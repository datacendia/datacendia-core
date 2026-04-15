// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * CendiaBackup™ — Database Backup Service
 *
 * Implements daily pg_dump exports encrypted with AES-256 and uploaded to
 * S3-compatible object storage (AWS S3, Cloudflare R2, Backblaze B2).
 *
 * RPO target: 24 hours | RTO target: 4 hours
 * See: docs/policies/backup-recovery-policy.md
 * SOC 2: A1.2, A1.3
 */

import { execFile } from 'child_process';
import { promisify } from 'util';
import { createCipheriv, randomBytes } from 'crypto';
import { createReadStream, createWriteStream, unlinkSync, existsSync } from 'fs';
import { pipeline } from 'stream/promises';
import path from 'path';
import os from 'os';
import { logger } from '../../utils/logger.js';

const execFileAsync = promisify(execFile);

const BACKUP_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 hours
let schedulerInterval: NodeJS.Timeout | null = null;

/**
 * Encrypt a file using AES-256-CBC and write to destPath.
 */
async function encryptFile(srcPath: string, destPath: string, key: string): Promise<void> {
  const iv = randomBytes(16);
  const keyBuf = Buffer.from(key.padEnd(32).slice(0, 32));
  const cipher = createCipheriv('aes-256-cbc', keyBuf, iv);

  const src = createReadStream(srcPath);
  const dest = createWriteStream(destPath);

  // Prepend IV to the encrypted output so it can be recovered on decrypt
  dest.write(iv);
  await pipeline(src, cipher, dest);
}

/**
 * Upload a local file to S3-compatible storage using fetch (no SDK dependency).
 * Uses AWS Signature V4 pre-signed URL pattern via the S3 REST API.
 */
async function uploadToS3(localPath: string, s3Key: string): Promise<void> {
  const bucket = process.env.BACKUP_S3_BUCKET;
  const endpoint = process.env.BACKUP_S3_ENDPOINT || 'https://s3.amazonaws.com';
  const accessKey = process.env.BACKUP_S3_ACCESS_KEY;
  const secretKey = process.env.BACKUP_S3_SECRET_KEY;

  if (!bucket || !accessKey || !secretKey) {
    throw new Error('[CendiaBackup] Missing S3 configuration (BACKUP_S3_BUCKET, BACKUP_S3_ACCESS_KEY, BACKUP_S3_SECRET_KEY)');
  }

  const fs = await import('fs');
  const fileBuffer = fs.readFileSync(localPath);
  const url = `${endpoint}/${bucket}/${s3Key}`;

  // Build AWS Signature V4 auth
  const { createHmac, createHash } = await import('crypto');
  const now = new Date();
  const date = now.toISOString().replace(/[:\-]|\.\d{3}/g, '').slice(0, 8);
  const datetime = now.toISOString().replace(/[:\-]|\.\d{3}/g, '').slice(0, 15) + 'Z';
  const region = process.env.BACKUP_S3_REGION || 'us-east-1';
  const service = 's3';

  const payloadHash = createHash('sha256').update(fileBuffer).digest('hex');
  const host = new URL(url).host;
  const canonicalHeaders = `host:${host}\nx-amz-content-sha256:${payloadHash}\nx-amz-date:${datetime}\n`;
  const signedHeaders = 'host;x-amz-content-sha256;x-amz-date';
  const canonicalRequest = `PUT\n/${bucket}/${s3Key}\n\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;
  const credentialScope = `${date}/${region}/${service}/aws4_request`;
  const stringToSign = `AWS4-HMAC-SHA256\n${datetime}\n${credentialScope}\n${createHash('sha256').update(canonicalRequest).digest('hex')}`;

  const hmac = (key: Buffer | string, data: string) => createHmac('sha256', key).update(data).digest();
  const signingKey = hmac(hmac(hmac(hmac(`AWS4${secretKey}`, date), region), service), 'aws4_request');
  const signature = createHmac('sha256', signingKey).update(stringToSign).digest('hex');
  const authorization = `AWS4-HMAC-SHA256 Credential=${accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': authorization,
      'x-amz-date': datetime,
      'x-amz-content-sha256': payloadHash,
      'Content-Type': 'application/octet-stream',
      'Content-Length': String(fileBuffer.length),
    },
    body: fileBuffer,
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`[CendiaBackup] S3 upload failed: ${response.status} ${body}`);
  }
}

/**
 * Run a full pg_dump backup, encrypt it, upload to S3, then clean up local files.
 */
async function runBackup(): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL;
  const encryptionKey = process.env.BACKUP_ENCRYPTION_KEY;

  if (!databaseUrl) {
    logger.error('[CendiaBackup] DATABASE_URL not set — backup aborted');
    return;
  }

  if (!encryptionKey) {
    logger.warn('[CendiaBackup] BACKUP_ENCRYPTION_KEY not set — backup will be uploaded UNENCRYPTED. Set this in production.');
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const dumpFile = path.join(os.tmpdir(), `datacendia-backup-${timestamp}.dump`);
  const encFile = `${dumpFile}.enc`;

  try {
    logger.info(`[CendiaBackup] Starting backup at ${timestamp}`);

    // Run pg_dump
    await execFileAsync('pg_dump', [
      '--format=custom',
      '--no-owner',
      '--no-acl',
      `--file=${dumpFile}`,
      databaseUrl,
    ]);
    logger.info(`[CendiaBackup] pg_dump complete: ${dumpFile}`);

    const s3Key = `backups/${timestamp}.dump${encryptionKey ? '.enc' : ''}`;

    if (encryptionKey) {
      await encryptFile(dumpFile, encFile, encryptionKey);
      await uploadToS3(encFile, s3Key);
      logger.info(`[CendiaBackup] Encrypted backup uploaded to s3://${process.env.BACKUP_S3_BUCKET}/${s3Key}`);
    } else {
      await uploadToS3(dumpFile, s3Key);
      logger.warn(`[CendiaBackup] Unencrypted backup uploaded to s3://${process.env.BACKUP_S3_BUCKET}/${s3Key}`);
    }

    logger.info(`[CendiaBackup] Backup complete — RPO window reset`);
  } catch (err) {
    logger.error('[CendiaBackup] Backup failed:', err);
    throw err;
  } finally {
    // Always clean up temp files
    if (existsSync(dumpFile)) unlinkSync(dumpFile);
    if (existsSync(encFile)) unlinkSync(encFile);
  }
}

export const databaseBackupService = {
  isEnabled(): boolean {
    return process.env.BACKUP_ENABLED === 'true';
  },

  startScheduler(): void {
    if (schedulerInterval) {
      logger.warn('[CendiaBackup] Scheduler already running');
      return;
    }

    logger.info(`[CendiaBackup] Scheduler started — backups every 24 hours`);

    // Run first backup 10 minutes after startup (let DB settle)
    setTimeout(async () => {
      try {
        await runBackup();
      } catch (err) {
        logger.error('[CendiaBackup] Initial backup failed:', err);
      }
    }, 10 * 60 * 1000);

    // Schedule recurring backups
    schedulerInterval = setInterval(async () => {
      try {
        await runBackup();
      } catch (err) {
        logger.error('[CendiaBackup] Scheduled backup failed:', err);
      }
    }, BACKUP_INTERVAL_MS);
  },

  stopScheduler(): void {
    if (schedulerInterval) {
      clearInterval(schedulerInterval);
      schedulerInterval = null;
      logger.info('[CendiaBackup] Backup scheduler stopped');
    }
  },

  async runNow(): Promise<void> {
    return runBackup();
  },
};
