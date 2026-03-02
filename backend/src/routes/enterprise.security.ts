/**
 * API Routes — Enterprise Security
 *
 * Express route handler defining REST endpoints.
 * @module routes/enterprise.security
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// ENTERPRISE SECURITY ROUTES - Keycloak, Casbin, Tika Integration
// =============================================================================

import { Router, Request, Response } from 'express';
import { protect, optionalAuth, getOrgId, canVeto, canAccessCouncil, AuthenticatedRequest } from '../security/KeycloakAuth';
import { policyEngine } from '../security/PolicyEngine';
import { tikaService } from '../services/document/TikaService';
import { minioService } from '../services/storage/MinioService';
import { getErrorMessage } from '../utils/errors.js';

const router = Router();

// Status endpoint (no auth required for testing)
router.get('/status', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      status: 'operational',
      version: '1.0.0',
      keycloak: 'configured',
      casbin: 'active',
      tika: 'available',
    },
  });
});

// =============================================================================
// AUTHENTICATION ROUTES
// =============================================================================

/**
 * Get current user info from Keycloak token
 */
router.get('/me', protect(), (req: AuthenticatedRequest, res: Response) => {
  res.json({
    success: true,
    data: {
      user: req.keycloakUser,
      permissions: {
        canVeto: canVeto(req),
        canAccessCouncil: canAccessCouncil(req),
      },
    },
  });
});

/**
 * Check if user has specific permission
 */
router.post('/check-permission', protect(), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { resource, action } = req.body;
    const userRoles = req.keycloakUser?.roles || [];
    
    // Check against Casbin policy engine
    let allowed = false;
    for (const role of userRoles) {
      if (await policyEngine.enforce(role, resource, action)) {
        allowed = true;
        break;
      }
    }
    
    res.json({ success: true, allowed });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.post('/documents/extract-from-vault', async (req: Request, res: Response) => {
  try {
    const { bucket, path, mimeType, fileName, useOCR = false } = req.body;

    if (!bucket || !path) {
      res.status(400).json({ success: false, error: 'bucket and path are required' });
      return;
    }

    await minioService.initialize();
    const objectName = String(path).startsWith(`${bucket}/`)
      ? String(path).slice(String(bucket).length + 1)
      : String(path);

    const buffer = await minioService.downloadBuffer(String(bucket), objectName);
    if (!buffer) {
      res.status(404).json({ success: false, error: 'File not found' });
      return;
    }

    const result = useOCR
      ? await tikaService.extractWithOCR(buffer, mimeType)
      : await tikaService.extractText(buffer, mimeType, fileName || objectName);

    res.json({
      success: result.success,
      data: {
        text: result.text,
        metadata: result.metadata,
        wordCount: result.metadata.wordCount,
      },
      error: result.error,
    });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

// =============================================================================
// POLICY ROUTES (Casbin)
// =============================================================================

/**
 * Get all policies (admin only)
 */
router.get('/policies', protect('admin'), async (req: Request, res: Response) => {
  try {
    const policies = await policyEngine.exportPolicies();
    res.json({ success: true, data: policies });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

/**
 * Check decision approval permission
 */
router.post('/policies/can-approve', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { decisionType, existingApprovers = [] } = req.body;
    const userId = req.keycloakUser?.id || 'anonymous';
    const userRoles = req.keycloakUser?.roles || [];
    
    const result = await policyEngine.canApproveDecision(
      userId,
      userRoles,
      decisionType,
      existingApprovers
    );
    
    res.json({ success: true, ...result });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

/**
 * Check veto permission
 */
router.post('/policies/can-veto', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { decisionType } = req.body;
    const userRoles = req.keycloakUser?.roles || [];
    
    const result = await policyEngine.canVetoDecision(userRoles, decisionType);
    
    res.json({ success: true, ...result });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

// =============================================================================
// DOCUMENT EXTRACTION ROUTES (Tika)
// =============================================================================

/**
 * Extract text from uploaded document
 */
router.post('/documents/extract', async (req: Request, res: Response) => {
  try {
    const { content, mimeType, fileName, useOCR = false } = req.body;
    
    const buffer = Buffer.from(content, 'base64');
    
    const result = useOCR
      ? await tikaService.extractWithOCR(buffer, mimeType)
      : await tikaService.extractText(buffer, mimeType, fileName);
    
    res.json({
      success: result.success,
      data: {
        text: result.text,
        metadata: result.metadata,
        wordCount: result.metadata.wordCount,
      },
      error: result.error,
    });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

/**
 * Detect document type
 */
router.post('/documents/detect-type', async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    const buffer = Buffer.from(content, 'base64');
    
    const mimeType = await tikaService.detectType(buffer);
    const formatName = tikaService.getFormatName(mimeType);
    
    res.json({
      success: true,
      data: { mimeType, formatName },
    });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

/**
 * Get supported document formats
 */
router.get('/documents/formats', async (req: Request, res: Response) => {
  try {
    const types = await tikaService.getSupportedTypes();
    res.json({ success: true, data: types });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

/**
 * Check Tika service health
 */
router.get('/documents/health', async (req: Request, res: Response) => {
  try {
    const available = await tikaService.checkAvailability();
    res.json({ success: true, available });
  } catch (error: unknown) {
    res.status(500).json({ success: false, available: false, error: getErrorMessage(error) });
  }
});

// =============================================================================
// SECURITY STATUS
// =============================================================================

/**
 * Get enterprise security status
 */
router.get('/security/status', async (req: Request, res: Response) => {
  try {
    const [tikaHealth, policyStatus] = await Promise.all([
      tikaService.checkAvailability(),
      policyEngine.exportPolicies(),
    ]);
    
    res.json({
      success: true,
      data: {
        keycloak: { enabled: true, realm: process.env.KEYCLOAK_REALM || 'cendia' },
        casbin: { enabled: true, policyCount: policyStatus.policies.length },
        tika: { available: tikaHealth },
        tempo: { enabled: process.env.TRACING_ENABLED !== 'false' },
        falco: { enabled: true },
        stepCa: { enabled: true },
      },
    });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

export default router;
