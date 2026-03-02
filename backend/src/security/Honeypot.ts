/**
 * Security — Honeypot
 *
 * Security hardening module for attack prevention and threat detection.
 *
 * @exports generateFakeUser, generateFakeApiKey, generateFakeToken, Honeypot
 * @module security/Honeypot
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * =============================================================================
 * HONEYPOT & DECEPTION TECHNOLOGY
 * =============================================================================
 * 
 * Detects and traps attackers using fake endpoints and data
 */

import { Router, Request, Response } from 'express';
import { redis } from '../config/redis.js';
import { logger } from '../utils/logger.js';
import crypto from 'crypto';

// =============================================================================
// HONEYPOT ROUTES
// =============================================================================

const honeypotRouter = Router();

// Fake admin endpoints
const fakeAdminPaths = [
  '/admin',
  '/administrator',
  '/wp-admin',
  '/wp-login.php',
  '/phpmyadmin',
  '/pma',
  '/mysql',
  '/adminer',
  '/manager',
  '/admin.php',
  '/login.php',
  '/cms',
  '/cpanel',
  '/webadmin',
  '/siteadmin',
  '/controlpanel',
];

// Fake sensitive files
const fakeSensitivePaths = [
  '/.env',
  '/.git/config',
  '/.git/HEAD',
  '/.svn/entries',
  '/config.php',
  '/wp-config.php',
  '/configuration.php',
  '/settings.py',
  '/database.yml',
  '/secrets.yml',
  '/credentials.json',
  '/id_rsa',
  '/id_rsa.pub',
  '/.ssh/authorized_keys',
  '/.htpasswd',
  '/.htaccess',
  '/web.config',
  '/server.xml',
  '/robots.txt.bak',
  '/sitemap.xml.bak',
  '/backup.sql',
  '/dump.sql',
  '/database.sql',
  '/db.sql',
  '/.DS_Store',
  '/Thumbs.db',
  '/error_log',
  '/access_log',
  '/debug.log',
];

// Fake API endpoints that attackers commonly probe
const fakeApiPaths = [
  '/api/admin/users',
  '/api/admin/config',
  '/api/internal/debug',
  '/api/internal/metrics',
  '/api/v1/admin/shell',
  '/api/v1/admin/execute',
  '/api/v1/debug/vars',
  '/api/v1/debug/pprof',
  '/api/swagger.json',
  '/api/graphql',
  '/graphql',
  '/api/v1/graphql',
  '/_debug',
  '/_profiler',
  '/_status',
  '/status',
  '/server-status',
  '/server-info',
  '/trace',
  '/console',
  '/shell',
  '/cmd',
  '/exec',
  '/run',
  '/eval',
  '/actuator',
  '/actuator/health',
  '/actuator/env',
  '/actuator/configprops',
  '/metrics',
  '/prometheus',
  '/jolokia',
  '/management',
  '/heapdump',
  '/threaddump',
];

/**
 * Log honeypot hit and block attacker
 */
async function logHoneypotHit(req: Request, trapType: string): Promise<void> {
  const ip = getIp(req);
  
  const entry = {
    timestamp: new Date().toISOString(),
    type: 'HONEYPOT_HIT',
    trapType,
    path: req.path,
    method: req.method,
    ip,
    userAgent: req.headers['user-agent'],
    headers: sanitizeHeaders(req.headers),
    body: req.body ? JSON.stringify(req.body).substring(0, 1000) : null,
  };

  // Log to Redis
  await redis.lpush('security:honeypot', JSON.stringify(entry));
  await redis.ltrim('security:honeypot', 0, 999);

  // Increment attacker score
  const attackKey = `security:attacker:${ip}`;
  await redis.incr(attackKey);
  await redis.expire(attackKey, 86400);

  // Auto-block after 3 honeypot hits
  const hitCount = await redis.get(attackKey);
  if (hitCount && parseInt(hitCount, 10) >= 3) {
    await redis.sadd('security:ip:blocklist:auto', ip);
    await redis.setex(`security:ip:tempblock:${ip}`, 86400, 'honeypot');
    logger.warn(`AUTO-BLOCKED IP ${ip} after ${hitCount} honeypot hits`);
  }

  logger.warn(`HONEYPOT HIT: ${trapType} - ${req.method} ${req.path} from ${ip}`);
}

function getIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.socket.remoteAddress || 'unknown';
}

function sanitizeHeaders(headers: any): Record<string, string> {
  const safe: Record<string, string> = {};
  const allowed = [
    'user-agent', 'accept', 'accept-language', 'accept-encoding',
    'content-type', 'content-length', 'origin', 'referer'
  ];
  for (const key of allowed) {
    if (headers[key]) {
      safe[key] = String(headers[key]).substring(0, 500);
    }
  }
  return safe;
}

/**
 * Generate fake but realistic-looking response
 */
function generateFakeResponse(type: string): any {
  switch (type) {
    case 'env':
      return {
        error: 'Access denied',
        // Fake breadcrumb to track attacker
        trace_id: `trap_${crypto.randomBytes(16).toString('hex')}`,
      };
    
    case 'admin':
      return {
        status: 401,
        error: 'Unauthorized',
        message: 'Invalid credentials',
        // Fake login form to collect attacker credentials
      };
    
    case 'api':
      return {
        error: {
          code: 'UNAUTHORIZED',
          message: 'API key required',
          docs: 'https://docs.datacendia.com/api',
        },
      };
    
    case 'git':
      // Return fake git config that looks real but tracks attacker
      return `[core]
  repositoryformatversion = 0
  filemode = true
  bare = false
[remote "origin"]
  url = https://github.com/datacendia/internal.git
  fetch = +refs/heads/*:refs/remotes/origin/*
`;
    
    default:
      return { error: 'Not found' };
  }
}

// =============================================================================
// HONEYPOT MIDDLEWARE
// =============================================================================

/**
 * Main honeypot middleware
 */
export async function honeypotMiddleware(
  req: Request,
  res: Response,
  next: Function
): Promise<void> {
  const path = req.path.toLowerCase();

  // Check admin honeypots
  for (const trap of fakeAdminPaths) {
    if (path === trap || path.startsWith(trap + '/')) {
      await logHoneypotHit(req, 'ADMIN_PROBE');
      res.status(401).json(generateFakeResponse('admin'));
      return;
    }
  }

  // Check sensitive file honeypots
  for (const trap of fakeSensitivePaths) {
    if (path === trap || path.endsWith(trap)) {
      await logHoneypotHit(req, 'FILE_PROBE');
      
      if (trap.includes('.git')) {
        res.type('text/plain').send(generateFakeResponse('git'));
      } else if (trap.includes('.env')) {
        res.status(403).json(generateFakeResponse('env'));
      } else {
        res.status(404).send('Not Found');
      }
      return;
    }
  }

  // Check API honeypots
  for (const trap of fakeApiPaths) {
    if (path === trap || path.startsWith(trap)) {
      await logHoneypotHit(req, 'API_PROBE');
      res.status(401).json(generateFakeResponse('api'));
      return;
    }
  }

  next();
}

// =============================================================================
// FAKE DATA GENERATORS
// =============================================================================

/**
 * Generate fake user data (for honeypot database)
 */
export function generateFakeUser(): any {
  const id = crypto.randomUUID();
  return {
    id,
    email: `user_${id.substring(0, 8)}@internal.datacendia.com`,
    password: '$2b$10$TRAP' + crypto.randomBytes(20).toString('hex'), // Looks like bcrypt
    role: 'admin',
    created_at: new Date().toISOString(),
    api_key: `sk_trap_${crypto.randomBytes(24).toString('hex')}`,
    // Hidden tracking
    _trap: true,
    _created: Date.now(),
  };
}

/**
 * Generate fake API key (for honeypot)
 */
export function generateFakeApiKey(): string {
  return `sk_live_TRAP${crypto.randomBytes(24).toString('hex')}`;
}

/**
 * Generate fake token (for honeypot)
 */
export function generateFakeToken(): string {
  const payload = {
    sub: crypto.randomUUID(),
    email: 'admin@datacendia.com',
    role: 'super_admin',
    _trap: true,
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64url') + 
         '.' + crypto.randomBytes(32).toString('base64url') +
         '.' + crypto.randomBytes(32).toString('base64url');
}

// =============================================================================
// CANARY TOKENS
// =============================================================================

interface CanaryToken {
  id: string;
  type: 'file' | 'url' | 'email' | 'api_key' | 'database';
  value: string;
  description: string;
  createdAt: Date;
  lastTriggered?: Date;
  triggerCount: number;
}

/**
 * Create a canary token
 */
export async function createCanaryToken(
  type: CanaryToken['type'],
  description: string
): Promise<CanaryToken> {
  const token: CanaryToken = {
    id: crypto.randomUUID(),
    type,
    value: generateCanaryValue(type),
    description,
    createdAt: new Date(),
    triggerCount: 0,
  };

  await redis.hset('security:canaries', token.id, JSON.stringify(token));
  return token;
}

function generateCanaryValue(type: CanaryToken['type']): string {
  switch (type) {
    case 'api_key':
      return `sk_canary_${crypto.randomBytes(24).toString('hex')}`;
    case 'email':
      return `canary_${crypto.randomBytes(8).toString('hex')}@trap.datacendia.com`;
    case 'url':
      return `https://trap.datacendia.com/c/${crypto.randomBytes(16).toString('hex')}`;
    case 'database':
      return `canary_record_${crypto.randomBytes(16).toString('hex')}`;
    case 'file':
      return `/trap/canary_${crypto.randomBytes(8).toString('hex')}.txt`;
    default:
      return crypto.randomBytes(32).toString('hex');
  }
}

/**
 * Check if a value is a canary token
 */
export async function checkCanaryToken(value: string): Promise<boolean> {
  // Quick check for canary patterns
  if (!value.includes('canary') && !value.includes('trap')) {
    return false;
  }

  const canaries = await redis.hgetall('security:canaries');
  for (const [id, json] of Object.entries(canaries)) {
    const token = JSON.parse(json) as CanaryToken;
    if (token.value === value) {
      // ALERT! Canary triggered
      await triggerCanaryAlert(token);
      return true;
    }
  }
  return false;
}

async function triggerCanaryAlert(token: CanaryToken): Promise<void> {
  // Update trigger count
  token.lastTriggered = new Date();
  token.triggerCount++;
  await redis.hset('security:canaries', token.id, JSON.stringify(token));

  // Log critical alert
  logger.error(`CANARY TRIGGERED: ${token.type} - ${token.description}`);

  // Store alert
  const alert = {
    timestamp: new Date().toISOString(),
    type: 'CANARY_TRIGGERED',
    tokenId: token.id,
    tokenType: token.type,
    description: token.description,
  };
  await redis.lpush('security:alerts:critical', JSON.stringify(alert));

  // Dispatch immediate notification via security alert pipeline
  try {
    const { prisma } = await import('../config/database.js');
    await prisma?.audit_logs.create({
      data: {
        id: crypto.randomUUID(),
        organization_id: 'system',
        user_id: 'system',
        action: 'security.canary_triggered',
        resource_type: 'canary_token',
        resource_id: token.id,
        details: {
          ...alert,
          severity: 'critical',
          alertChannel: ['email', 'sms', 'slack', 'pagerduty'],
          requiresImmediate: true,
        },
        ip_address: 'internal',
        user_agent: 'honeypot-service',
      },
    });
  } catch {
    // Best-effort: canary alert already stored in Redis above
    logger.warn(`Failed to persist canary alert to audit log: ${token.id}`);
  }
}

// =============================================================================
// EXPORTS
// =============================================================================

export const Honeypot = {
  middleware: honeypotMiddleware,
  generateFakeUser,
  generateFakeApiKey,
  generateFakeToken,
  createCanaryToken,
  checkCanaryToken,
};

export default honeypotRouter;
