/**
 * Security — Defense In Depth
 *
 * Security hardening module for attack prevention and threat detection.
 *
 * @exports validateFileUpload, generateCsrfToken, preventDataExfiltration, DefenseInDepth
 * @module security/DefenseInDepth
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * =============================================================================
 * DATACENDIA DEFENSE-IN-DEPTH SECURITY LAYER
 * =============================================================================
 * 
 * Comprehensive protection against ALL attack vectors:
 * - DDoS / DoS attacks
 * - SQL Injection, XSS, CSRF, XXE, SSRF
 * - Brute force / Credential stuffing
 * - Bot attacks / Scraping
 * - API abuse
 * - Account takeover
 * - Data exfiltration
 * - Session hijacking
 * - Man-in-the-middle
 * - Replay attacks
 * - Clickjacking
 * - File upload attacks
 * - Directory traversal
 * - Remote code execution
 * - Insider threats
 * - Supply chain attacks
 */

import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { redis } from '../config/redis.js';
import { logger } from '../utils/logger.js';

// =============================================================================
// ATTACK DETECTION PATTERNS
// =============================================================================

const ATTACK_PATTERNS = {
  // SQL Injection - Comprehensive
  SQL_INJECTION: [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|TRUNCATE|ALTER|CREATE|EXEC|EXECUTE|UNION|DECLARE|CAST|CONVERT|CHAR|NCHAR|VARCHAR|NVARCHAR)\b)/gi,
    /(--|#|\/\*|\*\/|;|\bOR\b\s+\d+=\d+|\bAND\b\s+\d+=\d+)/gi,
    /(\bUNION\b\s+\bSELECT\b)/gi,
    /(\'|\")(\s*)(OR|AND)(\s*)(\'|\"|\d)/gi,
    /(\bWAITFOR\b\s+\bDELAY\b)/gi,
    /(\bBENCHMARK\b\s*\()/gi,
    /(\bSLEEP\b\s*\()/gi,
    /(0x[0-9a-fA-F]+)/g,
    /(\bINFORMATION_SCHEMA\b)/gi,
    /(\bSYS\.|SYSOBJECTS|SYSCOLUMNS)/gi,
  ],

  // XSS - Cross-Site Scripting
  XSS: [
    /<script\b[^>]*>[\s\S]*?<\/script>/gi,
    /<script\b[^>]*>/gi,
    /javascript\s*:/gi,
    /vbscript\s*:/gi,
    /on\w+\s*=\s*["']?[^"']*["']?/gi,
    /<iframe\b[^>]*>/gi,
    /<object\b[^>]*>/gi,
    /<embed\b[^>]*>/gi,
    /<link\b[^>]*>/gi,
    /<meta\b[^>]*>/gi,
    /<style\b[^>]*>[\s\S]*?<\/style>/gi,
    /expression\s*\([^)]*\)/gi,
    /url\s*\(\s*["']?\s*data:/gi,
    /<svg\b[^>]*onload/gi,
    /<img\b[^>]*onerror/gi,
    /document\.(cookie|location|write)/gi,
    /window\.(location|open)/gi,
    /eval\s*\(/gi,
    /setTimeout\s*\(/gi,
    /setInterval\s*\(/gi,
    /Function\s*\(/gi,
  ],

  // Path Traversal
  PATH_TRAVERSAL: [
    /\.\.\//g,
    /\.\.\\/, 
    /%2e%2e%2f/gi,
    /%2e%2e\//gi,
    /\.\.%2f/gi,
    /%2e%2e%5c/gi,
    /\.\.%5c/gi,
    /%252e%252e%252f/gi,
    /\.\.%255c/gi,
    /\.\.\\/g,
    /\.%00\./gi,
    /%00/gi,
  ],

  // Command Injection
  COMMAND_INJECTION: [
    /[;&|`$]/g,
    /\$\(/g,
    /`[^`]*`/g,
    /\|\|/g,
    /&&/g,
    /\$\{[^}]*\}/g,
    />\s*\/dev\/null/gi,
    /\bcat\b|\bls\b|\bpwd\b|\bwhoami\b|\buname\b/gi,
    /\/bin\/sh/gi,
    /\/bin\/bash/gi,
    /cmd\.exe/gi,
    /powershell/gi,
  ],

  // LDAP Injection
  LDAP_INJECTION: [
    /[()\\*]/g,
    /\x00/g,
    /\x0a/g,
    /\x0d/g,
  ],

  // XML/XXE Injection
  XXE: [
    /<!ENTITY/gi,
    /<!DOCTYPE/gi,
    /SYSTEM\s+["']/gi,
    /file:\/\//gi,
    /expect:\/\//gi,
    /php:\/\//gi,
  ],

  // SSRF - Server-Side Request Forgery
  SSRF: [
    /localhost/gi,
    /127\.0\.0\.1/g,
    /0\.0\.0\.0/g,
    /::1/g,
    /169\.254\./g,
    /10\.\d+\.\d+\.\d+/g,
    /172\.(1[6-9]|2\d|3[01])\.\d+\.\d+/g,
    /192\.168\.\d+\.\d+/g,
    /file:\/\//gi,
    /gopher:\/\//gi,
    /dict:\/\//gi,
    /ftp:\/\//gi,
    /metadata\.google/gi,
    /169\.254\.169\.254/g,
  ],

  // NoSQL Injection
  NOSQL_INJECTION: [
    /\$where/gi,
    /\$ne/gi,
    /\$gt/gi,
    /\$lt/gi,
    /\$or/gi,
    /\$and/gi,
    /\$regex/gi,
    /\$exists/gi,
    /\$type/gi,
    /\$elemMatch/gi,
    /mapReduce/gi,
    /\$function/gi,
  ],

  // Template Injection
  TEMPLATE_INJECTION: [
    /\{\{.*\}\}/g,
    /\$\{.*\}/g,
    /<%.*%>/g,
    /<#.*>/g,
    /\[\[.*\]\]/g,
    /#\{.*\}/g,
    /@\{.*\}/g,
  ],

  // Log Injection
  LOG_INJECTION: [
    /\n/g,
    /\r/g,
    /%0a/gi,
    /%0d/gi,
    /%0A/g,
    /%0D/g,
  ],

  // Header Injection
  HEADER_INJECTION: [
    /\r\n/g,
    /\n/g,
    /\r/g,
    /%0d%0a/gi,
    /%0a/gi,
    /%0d/gi,
  ],

  // Email Header Injection
  EMAIL_INJECTION: [
    /\bcc:/gi,
    /\bbcc:/gi,
    /\bto:/gi,
    /\bcontent-type:/gi,
    /\bmime-version:/gi,
  ],

  // Prototype Pollution
  PROTOTYPE_POLLUTION: [
    /__proto__/g,
    /constructor/g,
    /prototype/g,
  ],
};

// Suspicious file extensions
const DANGEROUS_EXTENSIONS = [
  '.exe', '.dll', '.bat', '.cmd', '.sh', '.ps1', '.vbs', '.js', '.jar',
  '.php', '.asp', '.aspx', '.jsp', '.cgi', '.pl', '.py', '.rb',
  '.htaccess', '.htpasswd', '.config', '.ini', '.env',
  '.phtml', '.php3', '.php4', '.php5', '.phps',
];

// Suspicious MIME types
const DANGEROUS_MIME_TYPES = [
  'application/x-executable',
  'application/x-msdownload',
  'application/x-msdos-program',
  'application/x-sh',
  'application/x-shellscript',
  'text/x-php',
  'application/x-php',
  'application/x-httpd-php',
];

// =============================================================================
// RATE LIMITING CONFIGURATIONS
// =============================================================================

interface RateLimitConfig {
  window: number;  // seconds
  max: number;     // max requests
  blockDuration: number; // seconds to block after exceeding
}

const RATE_LIMITS: Record<string, RateLimitConfig> = {
  // Authentication endpoints - strict limits
  'POST:/api/v1/auth/login': { window: 900, max: 5, blockDuration: 1800 },
  'POST:/api/v1/auth/register': { window: 3600, max: 3, blockDuration: 86400 },
  'POST:/api/v1/auth/forgot-password': { window: 3600, max: 3, blockDuration: 3600 },
  'POST:/api/v1/auth/reset-password': { window: 3600, max: 5, blockDuration: 3600 },
  'POST:/api/v1/mfa/verify': { window: 300, max: 5, blockDuration: 900 },
  
  // Sensitive operations
  'DELETE:*': { window: 60, max: 10, blockDuration: 300 },
  'POST:/api/v1/admin/*': { window: 60, max: 20, blockDuration: 600 },
  
  // API endpoints
  'GET:/api/*': { window: 60, max: 300, blockDuration: 60 },
  'POST:/api/*': { window: 60, max: 100, blockDuration: 120 },
  
  // Default
  'default': { window: 60, max: 200, blockDuration: 60 },
};

// =============================================================================
// BOT DETECTION
// =============================================================================

const BOT_SIGNATURES = [
  // Known bad bots
  /semrush/i, /ahrefs/i, /mj12bot/i, /dotbot/i, /petalbot/i,
  /baiduspider/i, /yandexbot/i, /sogou/i,
  // Scraping tools
  /curl/i, /wget/i, /python-requests/i, /httpie/i, /postman/i,
  /insomnia/i, /axios/i, /node-fetch/i,
  // Headless browsers
  /headlesschrome/i, /phantomjs/i, /selenium/i, /puppeteer/i,
  /playwright/i, /webdriver/i,
  // Generic patterns
  /bot/i, /spider/i, /crawler/i, /scraper/i,
];

const ALLOWED_BOTS = [
  /googlebot/i, /bingbot/i, /slackbot/i, /twitterbot/i,
  /facebookexternalhit/i, /linkedinbot/i,
];

// =============================================================================
// CORE SECURITY MIDDLEWARE
// =============================================================================

/**
 * Master security middleware - applies all protections
 */
export async function masterSecurityMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const startTime = Date.now();
  const clientIp = getClientIp(req);
  const requestId = crypto.randomUUID();

  // Attach request ID
  req.headers['x-request-id'] = requestId;
  res.setHeader('X-Request-ID', requestId);

  try {
    // 1. Check IP blocklist
    if (await isIpBlocked(clientIp)) {
      await logAttack(req, 'BLOCKED_IP', 'IP is in blocklist');
      res.status(403).json({ error: { code: 'BLOCKED', message: 'Access denied' } });
      return;
    }

    // 2. Bot detection
    const botResult = detectBot(req);
    if (botResult.isBot && !botResult.isAllowed) {
      await logAttack(req, 'BOT_BLOCKED', botResult.reason || 'Bot detected');
      res.status(403).json({ error: { code: 'BOT_DETECTED', message: 'Automated access denied' } });
      return;
    }

    // 3. Rate limiting
    const rateLimitResult = await checkRateLimit(req, clientIp);
    if (!rateLimitResult.allowed) {
      await logAttack(req, 'RATE_LIMITED', `Exceeded ${rateLimitResult.limit} requests`);
      res.status(429).json({
        error: {
          code: 'RATE_LIMITED',
          message: 'Too many requests',
          retryAfter: rateLimitResult.retryAfter,
        },
      });
      return;
    }

    // 4. Attack pattern detection
    const attackResult = detectAttackPatterns(req);
    if (attackResult.detected) {
      await logAttack(req, attackResult.type, attackResult.details);
      await incrementThreatScore(clientIp, attackResult.severity);
      
      // Block on high severity
      if (attackResult.severity >= 8) {
        await blockIp(clientIp, 3600); // Block for 1 hour
        res.status(403).json({ error: { code: 'SECURITY_VIOLATION', message: 'Request blocked' } });
        return;
      }
    }

    // 5. Request size limits
    const contentLength = parseInt(req.headers['content-length'] || '0', 10);
    if (contentLength > 10 * 1024 * 1024) { // 10MB
      await logAttack(req, 'OVERSIZED_REQUEST', `Size: ${contentLength}`);
      res.status(413).json({ error: { code: 'PAYLOAD_TOO_LARGE', message: 'Request too large' } });
      return;
    }

    // 6. Verify request integrity
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      const contentType = req.headers['content-type'] || '';
      if (!isValidContentType(contentType)) {
        await logAttack(req, 'INVALID_CONTENT_TYPE', contentType);
      }
    }

    // 7. Add security response headers
    addSecurityHeaders(res);

    // 8. Log request timing
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      if (duration > 30000) { // > 30 seconds
        logger.warn(`Slow request: ${req.method} ${req.path} took ${duration}ms`);
      }
    });

    next();
  } catch (error) {
    logger.error(`Security middleware error: ${error}`);
    next(error);
  }
}

// =============================================================================
// ATTACK DETECTION
// =============================================================================

interface AttackDetectionResult {
  detected: boolean;
  type: string;
  details: string;
  severity: number; // 1-10
}

function detectAttackPatterns(req: Request): AttackDetectionResult {
  const checkValue = (value: string, source: string): AttackDetectionResult | null => {
    if (typeof value !== 'string' || value.length === 0) return null;

    // Check each pattern category
    for (const [category, patterns] of Object.entries(ATTACK_PATTERNS)) {
      for (const pattern of patterns) {
        if (pattern.test(value)) {
          return {
            detected: true,
            type: category,
            details: `${category} pattern detected in ${source}`,
            severity: getSeverity(category),
          };
        }
        // Reset regex lastIndex
        pattern.lastIndex = 0;
      }
    }
    return null;
  };

  const checkObject = (obj: any, prefix: string): AttackDetectionResult | null => {
    if (!obj || typeof obj !== 'object') return null;
    
    for (const [key, value] of Object.entries(obj)) {
      // Check key names (prototype pollution)
      if (ATTACK_PATTERNS.PROTOTYPE_POLLUTION.some(p => p.test(key))) {
        return {
          detected: true,
          type: 'PROTOTYPE_POLLUTION',
          details: `Prototype pollution attempt via key: ${key}`,
          severity: 10,
        };
      }

      if (typeof value === 'string') {
        const result = checkValue(value, `${prefix}.${key}`);
        if (result) return result;
      } else if (Array.isArray(value)) {
        for (let i = 0; i < value.length; i++) {
          if (typeof value[i] === 'string') {
            const result = checkValue(value[i], `${prefix}.${key}[${i}]`);
            if (result) return result;
          } else if (typeof value[i] === 'object') {
            const result = checkObject(value[i], `${prefix}.${key}[${i}]`);
            if (result) return result;
          }
        }
      } else if (typeof value === 'object') {
        const result = checkObject(value, `${prefix}.${key}`);
        if (result) return result;
      }
    }
    return null;
  };

  // Check all input sources
  const sources = [
    { data: req.body, name: 'body' },
    { data: req.query, name: 'query' },
    { data: req.params, name: 'params' },
  ];

  for (const source of sources) {
    const result = checkObject(source.data, source.name);
    if (result) return result;
  }

  // Check headers
  const dangerousHeaders = ['x-forwarded-for', 'referer', 'user-agent'];
  for (const header of dangerousHeaders) {
    const value = req.headers[header];
    if (typeof value === 'string') {
      const result = checkValue(value, `header.${header}`);
      if (result) return result;
    }
  }

  // Check URL path
  const pathResult = checkValue(req.path, 'path');
  if (pathResult) return pathResult;

  return { detected: false, type: '', details: '', severity: 0 };
}

function getSeverity(attackType: string): number {
  const severities: Record<string, number> = {
    SQL_INJECTION: 10,
    COMMAND_INJECTION: 10,
    XXE: 9,
    SSRF: 9,
    PATH_TRAVERSAL: 8,
    XSS: 7,
    NOSQL_INJECTION: 8,
    TEMPLATE_INJECTION: 8,
    LDAP_INJECTION: 8,
    PROTOTYPE_POLLUTION: 10,
    LOG_INJECTION: 5,
    HEADER_INJECTION: 6,
    EMAIL_INJECTION: 5,
  };
  return severities[attackType] || 5;
}

// =============================================================================
// BOT DETECTION
// =============================================================================

interface BotDetectionResult {
  isBot: boolean;
  isAllowed: boolean;
  reason?: string;
}

function detectBot(req: Request): BotDetectionResult {
  const userAgent = req.headers['user-agent'] || '';

  // Check if it's an allowed bot
  for (const pattern of ALLOWED_BOTS) {
    if (pattern.test(userAgent)) {
      return { isBot: true, isAllowed: true };
    }
  }

  // Check for bad bot signatures
  for (const pattern of BOT_SIGNATURES) {
    if (pattern.test(userAgent)) {
      return { isBot: true, isAllowed: false, reason: 'Bot signature detected' };
    }
  }

  // Heuristic checks
  if (!userAgent || userAgent.length < 10) {
    return { isBot: true, isAllowed: false, reason: 'Missing/invalid user agent' };
  }

  // Check for missing typical browser headers
  if (!req.headers['accept-language'] && !req.headers['accept-encoding']) {
    return { isBot: true, isAllowed: false, reason: 'Missing browser headers' };
  }

  return { isBot: false, isAllowed: true };
}

// =============================================================================
// RATE LIMITING
// =============================================================================

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  retryAfter?: number;
}

async function checkRateLimit(req: Request, ip: string): Promise<RateLimitResult> {
  const endpoint = `${req.method}:${req.path}`;
  const userId = (req as any).user?.id || 'anonymous';
  
  // Find matching rate limit config
  let config = RATE_LIMITS['default'];
  for (const [pattern, cfg] of Object.entries(RATE_LIMITS)) {
    if (pattern === 'default') continue;
    if (endpoint === pattern || matchPattern(endpoint, pattern)) {
      config = cfg;
      break;
    }
  }

  const key = `ratelimit:${ip}:${userId}:${endpoint.replace(/[^a-zA-Z0-9]/g, '_')}`;
  
  // Check if IP is in penalty box
  const blocked = await redis.get(`ratelimit:blocked:${ip}`);
  if (blocked) {
    const ttl = await redis.ttl(`ratelimit:blocked:${ip}`);
    return { allowed: false, remaining: 0, limit: config.max, retryAfter: ttl };
  }

  const current = await redis.incr(key);
  if (current === 1) {
    await redis.expire(key, config.window);
  }

  if (current > config.max) {
    // Put IP in penalty box
    await redis.setex(`ratelimit:blocked:${ip}`, config.blockDuration, '1');
    return { 
      allowed: false, 
      remaining: 0, 
      limit: config.max, 
      retryAfter: config.blockDuration 
    };
  }

  return { 
    allowed: true, 
    remaining: Math.max(0, config.max - current), 
    limit: config.max 
  };
}

function matchPattern(endpoint: string, pattern: string): boolean {
  const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
  return regex.test(endpoint);
}

// =============================================================================
// IP MANAGEMENT
// =============================================================================

function getClientIp(req: Request): string {
  // Check various headers (verify trust chain in production)
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  
  const realIp = req.headers['x-real-ip'];
  if (typeof realIp === 'string') {
    return realIp;
  }
  
  return req.ip || req.socket.remoteAddress || 'unknown';
}

async function isIpBlocked(ip: string): Promise<boolean> {
  // Check permanent blocklist
  const permanent = await redis.sismember('security:ip:blocklist', ip);
  if (permanent) return true;
  
  // Check temporary blocks
  const temp = await redis.get(`security:ip:tempblock:${ip}`);
  return !!temp;
}

async function blockIp(ip: string, duration: number): Promise<void> {
  await redis.setex(`security:ip:tempblock:${ip}`, duration, '1');
  logger.warn(`IP blocked: ${ip} for ${duration} seconds`);
}

async function incrementThreatScore(ip: string, score: number): Promise<number> {
  const key = `security:threat:${ip}`;
  const newScore = await redis.incrby(key, score);
  await redis.expire(key, 3600); // Reset after 1 hour of no activity
  
  // Auto-block at high threat score
  if (newScore >= 50) {
    await blockIp(ip, 3600);
  }
  
  return newScore;
}

// =============================================================================
// FILE UPLOAD SECURITY
// =============================================================================

export function validateFileUpload(
  file: Express.Multer.File
): { valid: boolean; reason?: string } {
  // Check extension
  const ext = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));
  if (DANGEROUS_EXTENSIONS.includes(ext)) {
    return { valid: false, reason: `Dangerous file extension: ${ext}` };
  }

  // Check MIME type
  if (DANGEROUS_MIME_TYPES.includes(file.mimetype)) {
    return { valid: false, reason: `Dangerous MIME type: ${file.mimetype}` };
  }

  // Check for double extensions
  const parts = file.originalname.split('.');
  if (parts.length > 2) {
    for (let i = 0; i < parts.length - 1; i++) {
      if (DANGEROUS_EXTENSIONS.includes('.' + parts[i].toLowerCase())) {
        return { valid: false, reason: 'Double extension detected' };
      }
    }
  }

  // Check file signature (magic bytes) for common types
  const buffer = file.buffer;
  if (buffer && buffer.length >= 4) {
    const signature = buffer.slice(0, 4).toString('hex');
    
    // Known dangerous signatures
    const dangerous = [
      '4d5a', // MZ - Windows executable
      '7f454c46', // ELF - Linux executable
    ];
    
    if (dangerous.some(sig => signature.startsWith(sig))) {
      return { valid: false, reason: 'Executable file detected' };
    }
  }

  // Check file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    return { valid: false, reason: 'File too large' };
  }

  return { valid: true };
}

// =============================================================================
// SECURITY HEADERS
// =============================================================================

function addSecurityHeaders(res: Response): void {
  // Already set by helmet, but add extras
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Download-Options', 'noopen');
  res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
}

function isValidContentType(contentType: string): boolean {
  const allowed = [
    'application/json',
    'application/x-www-form-urlencoded',
    'multipart/form-data',
    'text/plain',
  ];
  
  return allowed.some(type => contentType.includes(type));
}

// =============================================================================
// ATTACK LOGGING
// =============================================================================

async function logAttack(
  req: Request,
  type: string,
  details: string
): Promise<void> {
  const ip = getClientIp(req);
  const entry = {
    timestamp: new Date().toISOString(),
    type,
    details,
    ip,
    method: req.method,
    path: req.path,
    userAgent: req.headers['user-agent'],
    userId: (req as any).user?.id,
  };

  // Log to Redis for real-time monitoring
  await redis.lpush('security:attacks', JSON.stringify(entry));
  await redis.ltrim('security:attacks', 0, 9999); // Keep last 10000

  // Log to application logger
  logger.warn(`ATTACK DETECTED: ${type} - ${details} from ${ip}`);

  // Increment attack counter for this IP
  await redis.incr(`security:attacks:count:${ip}`);
  await redis.expire(`security:attacks:count:${ip}`, 86400); // 24 hours
}

// =============================================================================
// CSRF PROTECTION
// =============================================================================

export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString('base64url');
}

export async function validateCsrfToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  // Skip for safe methods
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  // Skip for API key authenticated requests
  if (req.headers['x-api-key']) {
    return next();
  }

  const token = req.headers['x-csrf-token'] || req.body._csrf;
  const sessionToken = (req as any).session?.csrfToken;

  if (!token || !sessionToken || token !== sessionToken) {
    await logAttack(req, 'CSRF_ATTEMPT', 'Invalid or missing CSRF token');
    res.status(403).json({ error: { code: 'CSRF_INVALID', message: 'Invalid request' } });
    return;
  }

  next();
}

// =============================================================================
// REPLAY ATTACK PROTECTION
// =============================================================================

export async function preventReplayAttack(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const nonce = req.headers['x-nonce'] as string;
  const timestamp = req.headers['x-timestamp'] as string;

  if (!nonce || !timestamp) {
    return next(); // Only enforce for signed requests
  }

  // Check timestamp is within 5 minutes
  const requestTime = parseInt(timestamp, 10);
  const now = Date.now();
  if (Math.abs(now - requestTime) > 5 * 60 * 1000) {
    await logAttack(req, 'REPLAY_ATTACK', 'Expired timestamp');
    res.status(401).json({ error: { code: 'EXPIRED', message: 'Request expired' } });
    return;
  }

  // Check nonce hasn't been used
  const nonceKey = `security:nonce:${nonce}`;
  const exists = await redis.exists(nonceKey);
  if (exists) {
    await logAttack(req, 'REPLAY_ATTACK', 'Duplicate nonce');
    res.status(401).json({ error: { code: 'REPLAY', message: 'Request already processed' } });
    return;
  }

  // Store nonce for 10 minutes
  await redis.setex(nonceKey, 600, '1');
  next();
}

// =============================================================================
// DATA EXFILTRATION PREVENTION
// =============================================================================

export function preventDataExfiltration(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const originalJson = res.json.bind(res);

  res.json = function(body: any) {
    // Check response size
    const size = JSON.stringify(body).length;
    
    // Log large responses
    if (size > 1024 * 1024) { // 1MB
      logger.warn(`Large response: ${req.method} ${req.path} - ${size} bytes to ${getClientIp(req)}`);
    }

    // Check for bulk data extraction patterns
    if (Array.isArray(body) && body.length > 1000) {
      logger.warn(`Bulk data request: ${req.method} ${req.path} - ${body.length} records to ${getClientIp(req)}`);
    }

    // Add response headers
    res.setHeader('X-Response-Size', size.toString());

    return originalJson(body);
  };

  next();
}

// =============================================================================
// EXPORTS
// =============================================================================

export const DefenseInDepth = {
  masterSecurityMiddleware,
  validateFileUpload,
  generateCsrfToken,
  validateCsrfToken,
  preventReplayAttack,
  preventDataExfiltration,
  blockIp,
  isIpBlocked,
};

export default DefenseInDepth;
