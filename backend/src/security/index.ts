/**
 * Security — Index
 *
 * Security hardening module for attack prevention and threat detection.
 *
 * @exports applySecurityMiddleware, encryptData, decryptData, hashData, generateSecureToken, sanitizeInput, isValidEmail, validatePassword
 * @module security/index
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA - MILITARY-GRADE SECURITY MODULE
// Enterprise security hardening for production deployments
// =============================================================================

import { Request, Response, NextFunction, Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import crypto from 'crypto';

import { logger } from '../utils/logger.js';
// Note: Install additional packages for production:
// npm install express-slow-down hpp express-mongo-sanitize xss-clean

// =============================================================================
// TYPES
// =============================================================================

interface SecurityConfig {
  cors: {
    allowedOrigins: string[];
    allowedMethods: string[];
    allowCredentials: boolean;
  };
  rateLimit: {
    windowMs: number;
    max: number;
    message: string;
  };
  slowDown: {
    windowMs: number;
    delayAfter: number;
    delayMs: number;
  };
  encryption: {
    algorithm: string;
    keyLength: number;
    ivLength: number;
  };
}

interface AuditLog {
  timestamp: Date;
  userId: string | null;
  action: string;
  resource: string;
  method: string;
  ip: string;
  userAgent: string;
  statusCode: number;
  duration: number;
  details?: Record<string, unknown>;
}

// =============================================================================
// CONFIGURATION
// =============================================================================

const securityConfig: SecurityConfig = {
  cors: {
    allowedOrigins: process.env.CORS_ORIGINS?.split(',') || [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:54003',  // Windsurf browser preview proxy
      'https://app.datacendia.com',
      'https://datacendia.com',
    ],
    allowedMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowCredentials: true,
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per window
    message: 'Too many requests from this IP, please try again later.',
  },
  slowDown: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    delayAfter: 50, // allow 50 requests without delay
    delayMs: 500, // add 500ms delay per request after limit
  },
  encryption: {
    algorithm: 'aes-256-gcm',
    keyLength: 32,
    ivLength: 16,
  },
};

// =============================================================================
// SECURITY MIDDLEWARE
// =============================================================================

/**
 * Apply all security middleware to Express app
 */
export function applySecurityMiddleware(app: Express): void {
  // Helmet - Security headers
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", 'wss:', 'https:'],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    crossOriginEmbedderPolicy: false,
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true,
    },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    noSniff: true,
    xssFilter: true,
    hidePoweredBy: true,
    frameguard: { action: 'deny' },
  }));

  // CORS - Cross-Origin Resource Sharing
  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      
      // In development, allow all localhost and 127.0.0.1 origins (any port)
      const isDev = process.env.NODE_ENV !== 'production';
      if (isDev && (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:'))) {
        return callback(null, true);
      }
      
      if (securityConfig.cors.allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: securityConfig.cors.allowedMethods,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'X-Request-Id', 'X-Data-Source-Id', 'x-data-source-id'],
    credentials: securityConfig.cors.allowCredentials,
    maxAge: 86400, // 24 hours
    exposedHeaders: ['X-Request-Id', 'X-RateLimit-Remaining'],
  }));

  // Rate limiting - Prevent brute force attacks
  app.use('/api/', rateLimit({
    windowMs: securityConfig.rateLimit.windowMs,
    max: securityConfig.rateLimit.max,
    message: { error: securityConfig.rateLimit.message },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
      // Use X-Forwarded-For behind proxy, fallback to IP
      return req.headers['x-forwarded-for']?.toString().split(',')[0] || 
             req.socket.remoteAddress || 
             'unknown';
    },
  }));

  // Slow down - Progressive delay for repeated requests (requires express-slow-down)
  // app.use('/api/', slowDown({
  //   windowMs: securityConfig.slowDown.windowMs,
  //   delayAfter: securityConfig.slowDown.delayAfter,
  //   delayMs: securityConfig.slowDown.delayMs,
  // }));

  // Stricter rate limit for authentication endpoints
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
    message: { error: 'Too many login attempts. Please try again in 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use('/api/v1/auth/login', authLimiter);
  app.use('/api/v1/auth/register', authLimiter);
  app.use('/api/v1/auth/forgot-password', authLimiter);

  // HPP - HTTP Parameter Pollution protection (requires hpp)
  // app.use(hpp({
  //   whitelist: ['sort', 'filter', 'fields', 'page', 'limit'],
  // }));

  // MongoDB sanitization - Prevent NoSQL injection (requires express-mongo-sanitize)
  // app.use(mongoSanitize());

  // XSS Clean - Sanitize user input (requires xss-clean)
  // app.use(xss());

  // Request ID for tracing
  app.use((req: Request, res: Response, next: NextFunction) => {
    req.headers['x-request-id'] = req.headers['x-request-id'] || 
      crypto.randomUUID();
    res.setHeader('X-Request-Id', req.headers['x-request-id']);
    next();
  });

  // Security headers for API responses
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    res.removeHeader('X-Powered-By');
    next();
  });
}

// =============================================================================
// ENCRYPTION UTILITIES
// =============================================================================

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 
  crypto.randomBytes(32).toString('hex');

/**
 * Encrypt sensitive data using AES-256-GCM
 */
export function encryptData(plaintext: string): string {
  const iv = crypto.randomBytes(securityConfig.encryption.ivLength);
  const key = Buffer.from(ENCRYPTION_KEY.slice(0, 64), 'hex');
  
  const cipher = crypto.createCipheriv(
    securityConfig.encryption.algorithm,
    key,
    iv
  );
  
  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = (cipher as crypto.CipherGCM).getAuthTag();
  
  // Combine IV + AuthTag + Encrypted data
  return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
}

/**
 * Decrypt data encrypted with encryptData
 */
export function decryptData(encryptedData: string): string {
  const parts = encryptedData.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted data format');
  }
  
  const iv = Buffer.from(parts[0], 'hex');
  const authTag = Buffer.from(parts[1], 'hex');
  const encrypted = parts[2];
  const key = Buffer.from(ENCRYPTION_KEY.slice(0, 64), 'hex');
  
  const decipher = crypto.createDecipheriv(
    securityConfig.encryption.algorithm,
    key,
    iv
  );
  
  (decipher as crypto.DecipherGCM).setAuthTag(authTag);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

/**
 * Hash sensitive data using SHA-256
 */
export function hashData(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Generate secure random token
 */
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

// =============================================================================
// INPUT VALIDATION & SANITIZATION
// =============================================================================

/**
 * Sanitize string input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): { 
  valid: boolean; 
  errors: string[] 
} {
  const errors: string[] = [];
  
  if (password.length < 12) {
    errors.push('Password must be at least 12 characters');
  }
  if (password.length > 128) {
    errors.push('Password must be less than 128 characters');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  // Check for common passwords
  const commonPasswords = ['password123', 'qwerty123', 'admin123'];
  if (commonPasswords.some(cp => password.toLowerCase().includes(cp))) {
    errors.push('Password is too common');
  }
  
  return { valid: errors.length === 0, errors };
}

/**
 * Validate UUID format
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

// =============================================================================
// AUDIT LOGGING
// =============================================================================

const auditLogs: AuditLog[] = [];

/**
 * Middleware to log all API requests
 */
export function auditMiddleware(
  req: Request, 
  res: Response, 
  next: NextFunction
): void {
  const startTime = Date.now();
  
  // Capture response
  const originalSend = res.send;
  res.send = function(body): Response {
    const duration = Date.now() - startTime;
    
    const auditEntry: AuditLog = {
      timestamp: new Date(),
      userId: (req as any).user?.id || null,
      action: `${req.method} ${req.path}`,
      resource: req.path,
      method: req.method,
      ip: req.headers['x-forwarded-for']?.toString().split(',')[0] || 
          req.socket.remoteAddress || 'unknown',
      userAgent: req.headers['user-agent'] || 'unknown',
      statusCode: res.statusCode,
      duration,
      details: {
        query: req.query,
        params: req.params,
        requestId: req.headers['x-request-id'],
      },
    };
    
    // Store audit log (production upgrade: persistent storage)
    auditLogs.push(auditEntry);
    
    // Keep only last 10000 logs in memory
    if (auditLogs.length > 10000) {
      auditLogs.shift();
    }
    
    // Log security-relevant events
    if (req.path.includes('/auth/') || res.statusCode >= 400) {
      logger.info(`[AUDIT] ${auditEntry.timestamp.toISOString()} | ${auditEntry.method} ${auditEntry.resource} | ${auditEntry.statusCode} | ${auditEntry.ip} | ${auditEntry.duration}ms`);
    }
    
    return originalSend.call(this, body);
  };
  
  next();
}

/**
 * Get audit logs (for admin dashboard)
 */
export function getAuditLogs(options: {
  userId?: string;
  startDate?: Date;
  endDate?: Date;
  action?: string;
  limit?: number;
}): AuditLog[] {
  let logs = [...auditLogs];
  
  if (options.userId) {
    logs = logs.filter(l => l.userId === options.userId);
  }
  if (options.startDate) {
    logs = logs.filter(l => l.timestamp >= options.startDate!);
  }
  if (options.endDate) {
    logs = logs.filter(l => l.timestamp <= options.endDate!);
  }
  if (options.action) {
    logs = logs.filter(l => l.action.includes(options.action!));
  }
  
  return logs.slice(-(options.limit || 100));
}

// =============================================================================
// SESSION SECURITY
// =============================================================================

/**
 * Generate secure session ID
 */
export function generateSessionId(): string {
  return crypto.randomBytes(32).toString('base64url');
}

/**
 * Validate session token format
 */
export function isValidSessionToken(token: string): boolean {
  // Base64URL format, 43 characters (32 bytes)
  return /^[A-Za-z0-9_-]{43}$/.test(token);
}

// =============================================================================
// CSRF PROTECTION
// =============================================================================

const csrfTokens = new Map<string, { token: string; expires: Date }>();

/**
 * Generate CSRF token for session
 */
export function generateCsrfToken(sessionId: string): string {
  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 3600000); // 1 hour
  
  csrfTokens.set(sessionId, { token, expires });
  
  return token;
}

/**
 * Validate CSRF token
 */
export function validateCsrfToken(sessionId: string, token: string): boolean {
  const stored = csrfTokens.get(sessionId);
  
  if (!stored) return false;
  if (stored.expires < new Date()) {
    csrfTokens.delete(sessionId);
    return false;
  }
  
  return crypto.timingSafeEqual(
    Buffer.from(stored.token),
    Buffer.from(token)
  );
}

/**
 * CSRF middleware
 */
export function csrfMiddleware(
  req: Request, 
  res: Response, 
  next: NextFunction
): void {
  // Skip for GET, HEAD, OPTIONS
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }
  
  const sessionId = (req as any).sessionId;
  const token = req.headers['x-csrf-token'] as string;
  
  if (!sessionId || !token || !validateCsrfToken(sessionId, token)) {
    res.status(403).json({ error: 'Invalid CSRF token' });
    return;
  }
  
  next();
}

// =============================================================================
// IP BLOCKING
// =============================================================================

const blockedIPs = new Set<string>();
const suspiciousIPs = new Map<string, { count: number; lastAttempt: Date }>();

/**
 * Check if IP is blocked
 */
export function isIPBlocked(ip: string): boolean {
  return blockedIPs.has(ip);
}

/**
 * Block an IP address
 */
export function blockIP(ip: string): void {
  blockedIPs.add(ip);
  logger.info(`[SECURITY] Blocked IP: ${ip}`);
}

/**
 * Unblock an IP address
 */
export function unblockIP(ip: string): void {
  blockedIPs.delete(ip);
  suspiciousIPs.delete(ip);
}

/**
 * Record suspicious activity
 */
export function recordSuspiciousActivity(ip: string): void {
  const record = suspiciousIPs.get(ip) || { count: 0, lastAttempt: new Date() };
  record.count++;
  record.lastAttempt = new Date();
  
  suspiciousIPs.set(ip, record);
  
  // Auto-block after 10 suspicious attempts within 1 hour
  if (record.count >= 10) {
    const timeDiff = Date.now() - record.lastAttempt.getTime();
    if (timeDiff < 3600000) {
      blockIP(ip);
    }
  }
}

/**
 * IP blocking middleware
 */
export function ipBlockMiddleware(
  req: Request, 
  res: Response, 
  next: NextFunction
): void {
  const ip = req.headers['x-forwarded-for']?.toString().split(',')[0] || 
             req.socket.remoteAddress || 'unknown';
  
  if (isIPBlocked(ip)) {
    res.status(403).json({ error: 'Access denied' });
    return;
  }
  
  next();
}

// =============================================================================
// EXPORTS
// =============================================================================

export {
  securityConfig,
  AuditLog,
};

export default {
  applySecurityMiddleware,
  encryptData,
  decryptData,
  hashData,
  generateSecureToken,
  sanitizeInput,
  isValidEmail,
  validatePassword,
  isValidUUID,
  auditMiddleware,
  getAuditLogs,
  generateSessionId,
  isValidSessionToken,
  generateCsrfToken,
  validateCsrfToken,
  csrfMiddleware,
  isIPBlocked,
  blockIP,
  unblockIP,
  recordSuspiciousActivity,
  ipBlockMiddleware,
};
