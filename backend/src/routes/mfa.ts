// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * =============================================================================
 * MULTI-FACTOR AUTHENTICATION ROUTES
 * =============================================================================
 * 
 * Implements TOTP-based two-factor authentication
 */

import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { errors } from '../middleware/errorHandler.js';
import { 
  generateMFASecret, 
  verifyTOTP,
  encryptData,
  decryptData,
  deriveKey,
  verifyPassword,
  createAuditLog 
} from '../security/SecurityHardening.js';
import crypto from 'crypto';

// MFA encryption key derived from server secret
const mfaRawKey = process.env['MFA_ENCRYPTION_KEY'];
if (!mfaRawKey && process.env.NODE_ENV === 'production') {
  throw new Error('MFA_ENCRYPTION_KEY must be set in production');
}
const MFA_KEY_PROMISE = deriveKey(mfaRawKey || 'dev-only-mfa-route-key');
async function getMFAKey(): Promise<Buffer> {
  return (await MFA_KEY_PROMISE).key;
}

function encryptMFASecret(secret: string, key: Buffer): string {
  const { ciphertext, iv, authTag } = encryptData(secret, key);
  return JSON.stringify({ ciphertext, iv, authTag });
}

function decryptMFASecret(encrypted: string, key: Buffer): string {
  const { ciphertext, iv, authTag } = JSON.parse(encrypted);
  return decryptData(ciphertext, key, iv, authTag);
}

const router = Router();

// =============================================================================
// SCHEMAS
// =============================================================================

const verifyCodeSchema = z.object({
  code: z.string().length(6).regex(/^\d{6}$/),
});

const verifyBackupCodeSchema = z.object({
  code: z.string().length(8).regex(/^[A-Z0-9]{8}$/),
});

// =============================================================================
// ROUTES
// =============================================================================

/**
 * GET /api/v1/mfa/setup
 * Initialize MFA setup - generates secret and backup codes
 */
router.get('/setup', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;

    // Check if MFA is already enabled
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: { 
        id: true, 
        email: true,
        mfa_enabled: true,
        mfa_secret: true,
      },
    });

    if (!user) {
      throw errors.notFound('User not found');
    }

    if (user.mfa_enabled) {
      throw errors.badRequest('MFA is already enabled');
    }

    // Generate new MFA secret
    const { secret, backupCodes } = generateMFASecret();

    // Encrypt and store the secret and backup codes temporarily
    const mfaKey = await getMFAKey();
    const encryptedSecret = encryptMFASecret(secret, mfaKey);
    const encryptedBackupCodes = encryptMFASecret(JSON.stringify(backupCodes), mfaKey);

    // Store encrypted secret (not yet enabled — enable happens after verification)
    await prisma.users.update({
      where: { id: userId },
      data: {
        mfa_secret: encryptedSecret,
        mfa_backup_codes: encryptedBackupCodes,
      },
    });

    // Generate QR code URL for authenticator apps
    const issuer = 'Datacendia';
    const otpauthUrl = `otpauth://totp/${issuer}:${user.email}?secret=${secret}&issuer=${issuer}&algorithm=SHA1&digits=6&period=30`;

    await createAuditLog({
      eventType: 'MFA_SETUP_INITIATED',
      userId,
      action: 'INITIATE_MFA_SETUP',
      outcome: 'SUCCESS',
      sourceIp: req.ip || 'unknown',
      userAgent: req.headers['user-agent'],
      details: {},
    });

    res.json({
      secret,
      otpauthUrl,
      backupCodes,
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpauthUrl)}`,
    });
  } catch (error) {
    throw error;
  }
});

/**
 * POST /api/v1/mfa/enable
 * Verify code and enable MFA
 */
router.post('/enable', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { code } = verifyCodeSchema.parse(req.body);
    const secret = req.body.secret; // From setup step

    if (!secret) {
      throw errors.badRequest('MFA secret required');
    }

    // Retrieve the stored (but not yet enabled) secret
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: { mfa_secret: true, mfa_enabled: true },
    });

    if (!user?.mfa_secret) {
      throw errors.badRequest('MFA setup not initiated. Call /setup first.');
    }

    if (user.mfa_enabled) {
      throw errors.badRequest('MFA is already enabled');
    }

    // Decrypt the stored secret to verify the code
    const mfaKey = await getMFAKey();
    const decryptedSecret = decryptMFASecret(user.mfa_secret, mfaKey);

    // Verify the code against the stored secret (ignore the client-provided secret)
    const isValid = verifyTOTP(decryptedSecret, code);
    if (!isValid) {
      await createAuditLog({
        eventType: 'MFA_ENABLE_FAILED',
        userId,
        action: 'ENABLE_MFA',
        outcome: 'FAILURE',
        sourceIp: req.ip || 'unknown',
        userAgent: req.headers['user-agent'],
        details: { reason: 'Invalid code' },
      });

      throw errors.badRequest('Invalid verification code');
    }

    // Enable MFA on user record
    await prisma.users.update({
      where: { id: userId },
      data: {
        mfa_enabled: true,
        mfa_enabled_at: new Date(),
      },
    });

    await createAuditLog({
      eventType: 'MFA_ENABLED',
      userId,
      action: 'ENABLE_MFA',
      outcome: 'SUCCESS',
      sourceIp: req.ip || 'unknown',
      userAgent: req.headers['user-agent'],
      details: {},
    });

    res.json({ 
      message: 'MFA enabled successfully',
      mfaEnabled: true,
    });
  } catch (error) {
    throw error;
  }
});

/**
 * POST /api/v1/mfa/verify
 * Verify MFA code during login
 */
router.post('/verify', async (req: Request, res: Response) => {
  try {
    const { code, tempToken } = verifyCodeSchema.extend({
      tempToken: z.string(),
    }).parse(req.body);

    // Retrieve the user ID from the temp session (id serves as the temp token)
    const session = await prisma.sessions.findUnique({
      where: { id: tempToken },
      select: { user_id: true, expires_at: true },
    });

    if (session && session.expires_at < new Date()) {
      throw errors.unauthorized('MFA session has expired');
    }

    if (!session) {
      throw errors.unauthorized('Invalid or expired MFA session');
    }

    const user = await prisma.users.findUnique({
      where: { id: session.user_id },
      select: { mfa_secret: true, mfa_enabled: true },
    });

    if (!user?.mfa_enabled || !user.mfa_secret) {
      throw errors.badRequest('MFA is not enabled for this user');
    }

    // Decrypt the stored secret and verify the TOTP code
    const mfaKey = await getMFAKey();
    const decryptedSecret = decryptMFASecret(user.mfa_secret, mfaKey);
    const isValid = verifyTOTP(decryptedSecret, code);

    if (!isValid) {
      await createAuditLog({
        eventType: 'MFA_VERIFY_FAILED',
        userId: session.user_id,
        action: 'VERIFY_MFA',
        outcome: 'FAILURE',
        sourceIp: req.ip || 'unknown',
        userAgent: req.headers['user-agent'],
        details: { reason: 'Invalid TOTP code' },
      });
      throw errors.unauthorized('Invalid MFA code');
    }

    await createAuditLog({
      eventType: 'MFA_VERIFIED',
      userId: session.user_id,
      action: 'VERIFY_MFA',
      outcome: 'SUCCESS',
      sourceIp: req.ip || 'unknown',
      userAgent: req.headers['user-agent'],
      details: {},
    });

    res.json({
      message: 'MFA verification successful',
      verified: true,
    });
  } catch (error) {
    throw error;
  }
});

/**
 * POST /api/v1/mfa/verify-backup
 * Verify using backup code
 */
router.post('/verify-backup', async (req: Request, res: Response) => {
  try {
    const { code, tempToken } = verifyBackupCodeSchema.extend({
      tempToken: z.string(),
    }).parse(req.body);

    // Retrieve the user from the temp session
    const session = await prisma.sessions.findUnique({
      where: { id: tempToken },
      select: { user_id: true, expires_at: true },
    });

    if (!session || session.expires_at < new Date()) {
      throw errors.unauthorized('Invalid or expired MFA session');
    }

    const user = await prisma.users.findUnique({
      where: { id: session.user_id },
      select: { mfa_backup_codes: true, mfa_enabled: true },
    });

    if (!user?.mfa_enabled || !user.mfa_backup_codes) {
      throw errors.badRequest('MFA is not enabled or no backup codes available');
    }

    // Decrypt backup codes and check if the provided code is valid
    const mfaKey = await getMFAKey();
    const backupCodes: string[] = JSON.parse(decryptMFASecret(user.mfa_backup_codes, mfaKey));
    const codeIndex = backupCodes.indexOf(code);

    if (codeIndex === -1) {
      await createAuditLog({
        eventType: 'MFA_BACKUP_VERIFY_FAILED',
        userId: session.user_id,
        action: 'VERIFY_BACKUP_CODE',
        outcome: 'FAILURE',
        sourceIp: req.ip || 'unknown',
        userAgent: req.headers['user-agent'],
        details: { reason: 'Invalid backup code' },
      });
      throw errors.unauthorized('Invalid backup code');
    }

    // Mark the backup code as used by removing it from the list
    backupCodes.splice(codeIndex, 1);
    const encryptedUpdatedCodes = encryptMFASecret(JSON.stringify(backupCodes), mfaKey);
    await prisma.users.update({
      where: { id: session.user_id },
      data: { mfa_backup_codes: encryptedUpdatedCodes },
    });

    await createAuditLog({
      eventType: 'MFA_BACKUP_VERIFIED',
      userId: session.user_id,
      action: 'VERIFY_BACKUP_CODE',
      outcome: 'SUCCESS',
      sourceIp: req.ip || 'unknown',
      userAgent: req.headers['user-agent'],
      details: { remainingCodes: backupCodes.length },
    });

    res.json({
      message: 'Backup code verification successful',
      verified: true,
      remainingBackupCodes: backupCodes.length,
    });
  } catch (error) {
    throw error;
  }
});

/**
 * DELETE /api/v1/mfa/disable
 * Disable MFA (requires current MFA code or password)
 */
router.delete('/disable', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { code, password } = z.object({
      code: z.string().optional(),
      password: z.string().optional(),
    }).refine(data => data.code || data.password, {
      message: 'Either MFA code or password required',
    }).parse(req.body);

    // Retrieve user for identity verification
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: { mfa_secret: true, mfa_enabled: true, password_hash: true },
    });

    if (!user?.mfa_enabled) {
      throw errors.badRequest('MFA is not enabled');
    }

    // Verify identity — either MFA code or password required
    if (code) {
      if (!user.mfa_secret) throw errors.badRequest('MFA secret not found');
      const mfaKey = await getMFAKey();
      const decryptedSecret = decryptMFASecret(user.mfa_secret, mfaKey);
      const isValid = verifyTOTP(decryptedSecret, code);
      if (!isValid) throw errors.unauthorized('Invalid MFA code');
    } else if (password) {
      if (!user.password_hash) throw errors.badRequest('Password not set for this account');
      const isValid = await verifyPassword(password, user.password_hash);
      if (!isValid) throw errors.unauthorized('Invalid password');
    }

    // Disable MFA and clear secrets
    await prisma.users.update({
      where: { id: userId },
      data: {
        mfa_enabled: false,
        mfa_secret: null,
        mfa_backup_codes: null,
        mfa_enabled_at: null,
      },
    });

    await createAuditLog({
      eventType: 'MFA_DISABLED',
      userId,
      action: 'DISABLE_MFA',
      outcome: 'SUCCESS',
      sourceIp: req.ip || 'unknown',
      userAgent: req.headers['user-agent'],
      details: {},
    });

    res.json({ 
      message: 'MFA disabled successfully',
      mfaEnabled: false,
    });
  } catch (error) {
    throw error;
  }
});

/**
 * POST /api/v1/mfa/regenerate-backup
 * Generate new backup codes (invalidates old ones)
 */
router.post('/regenerate-backup', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { code } = verifyCodeSchema.parse(req.body);

    // Verify current MFA code before regenerating backup codes
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: { mfa_secret: true, mfa_enabled: true },
    });

    if (!user?.mfa_enabled || !user.mfa_secret) {
      throw errors.badRequest('MFA is not enabled');
    }

    const mfaKey = await getMFAKey();
    const decryptedSecret = decryptMFASecret(user.mfa_secret, mfaKey);
    const isValid = verifyTOTP(decryptedSecret, code);
    if (!isValid) {
      throw errors.badRequest('Invalid MFA code');
    }

    // Generate new backup codes
    const { backupCodes } = generateMFASecret();

    // Encrypt and store new backup codes (invalidates old ones)
    const encryptedBackupCodes = encryptMFASecret(JSON.stringify(backupCodes), mfaKey);
    await prisma.users.update({
      where: { id: userId },
      data: { mfa_backup_codes: encryptedBackupCodes },
    });

    await createAuditLog({
      eventType: 'MFA_BACKUP_REGENERATED',
      userId,
      action: 'REGENERATE_BACKUP_CODES',
      outcome: 'SUCCESS',
      sourceIp: req.ip || 'unknown',
      userAgent: req.headers['user-agent'],
      details: {},
    });

    res.json({
      message: 'Backup codes regenerated successfully',
      backupCodes,
    });
  } catch (error) {
    throw error;
  }
});

export default router;
