/**
 * Middleware — Security Middleware
 *
 * Express middleware for request processing pipeline.
 *
 * @exports sanitizeInput, redactSensitiveData, inputSanitizationMiddleware, responseSanitizationMiddleware, rateLimitMiddleware, corsSecurityMiddleware, sqlInjectionMiddleware, pathTraversalMiddleware
 * @module middleware/SecurityMiddleware
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * CendiaCrucible™ Security Middleware
 * Defends against prompt injection, jailbreaks, and data leakage
 */

import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

// ============================================================================
// PROMPT INJECTION PATTERNS
// ============================================================================

const INJECTION_PATTERNS = [
  // System override attempts
  /ignore\s+(all\s+)?(previous|prior|above)\s+(instructions|prompts|rules)/i,
  /disregard\s+(all\s+)?(previous|prior|above)/i,
  /forget\s+(everything|all|your)\s+(previous|prior|instructions)/i,
  
  // Role hijacking
  /you\s+are\s+(now\s+)?(DAN|evil|unrestricted|jailbroken)/i,
  /pretend\s+(you\s+are|to\s+be)\s+(evil|malicious|unrestricted)/i,
  /act\s+as\s+(if\s+)?(you\s+have\s+)?no\s+(restrictions|rules|guidelines)/i,
  
  // Delimiter escapes
  /###\s*(END|STOP|IGNORE)\s*(OF)?\s*(INSTRUCTIONS|SYSTEM|PROMPT)/i,
  /<\/?system>/i,
  /<\/?assistant>/i,
  /<\/?user>/i,
  /```\s*(system|assistant|user)/i,
  
  // Direct extraction attempts
  /what\s+(is|are)\s+(your|the)\s+(system\s+)?prompt/i,
  /show\s+(me\s+)?(your|the)\s+(system\s+)?prompt/i,
  /reveal\s+(your|the)\s+(instructions|prompt|rules)/i,
  /print\s+(your|the)\s+(system\s+)?prompt/i,
];

// ============================================================================
// JAILBREAK PATTERNS
// ============================================================================

const JAILBREAK_PATTERNS = [
  /\bDAN\b.*\b(do\s+anything|no\s+restrictions)/i,
  /evil\s+confidant/i,
  /bypass\s+(security|safety|ethical|guidelines)/i,
  /without\s+(restrictions|rules|guidelines|ethics)/i,
  /illegal\s+activities/i,
  /how\s+to\s+(hack|steal|fraud|attack)/i,
  /commit\s+(fraud|theft|crime)/i,
];

// ============================================================================
// DATA LEAKAGE PATTERNS
// ============================================================================

// Requests for the platform's own secrets. Mentioning one is not a probe:
// "Evaluate our password policy" and "Should we rotate API keys after the
// breach?" are ordinary governance questions, and the old list, which matched
// the bare words, turned both away from the Council.
const SECRET_NOUNS = String.raw`(api\s*keys?|secret\s*keys?|private\s*keys?|passwords?|connection\s*strings?|credentials|access\s*tokens?|environment\s*variables?|env\s*vars?|\.env\s*file)`;
const LEAKAGE_REQUEST_PATTERNS = [
  // "show me your API key", "what are the server's credentials"
  new RegExp(String.raw`\b(your|the\s+(system|server|platform|backend)'?s?)\s+(own\s+)?${SECRET_NOUNS}`, 'i'),
  // "print the environment variables", "dump the .env file"
  new RegExp(String.raw`\b(print|dump|reveal|echo|cat)\s+(me\s+)?(the\s+|all\s+|any\s+)?${SECRET_NOUNS}`, 'i'),
];

// Patterns to redact from responses
const SENSITIVE_PATTERNS = [
  // API keys
  /([a-zA-Z0-9_-]{20,})/g, // Generic long strings that might be keys
  /sk-[a-zA-Z0-9]{20,}/g, // OpenAI-style keys
  /Bearer\s+[a-zA-Z0-9._-]+/gi,
  
  // Connection strings
  /postgres(ql)?:\/\/[^\s"']+/gi,
  /mysql:\/\/[^\s"']+/gi,
  /mongodb(\+srv)?:\/\/[^\s"']+/gi,
  /redis:\/\/[^\s"']+/gi,
  
  // IP addresses (internal)
  /\b(10\.\d{1,3}\.\d{1,3}\.\d{1,3})\b/g,
  /\b(172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3})\b/g,
  /\b(192\.168\.\d{1,3}\.\d{1,3})\b/g,
  
  // Passwords in URLs
  /:([^:@\s]{8,})@/g,
];

// ============================================================================
// RATE LIMITING
// ============================================================================

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 30; // 30 requests per minute

// ============================================================================
// MIDDLEWARE FUNCTIONS
// ============================================================================

/**
 * Sanitize user input to prevent prompt injection
 */
export function sanitizeInput(input: string): { sanitized: string; blocked: boolean; reason?: string } {
  // Check for injection patterns
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(input)) {
      logger.warn(`[Security] Prompt injection attempt blocked: ${pattern}`);
      return {
        sanitized: '',
        blocked: true,
        reason: 'Prompt injection attempt detected',
      };
    }
  }

  // Check for jailbreak patterns
  for (const pattern of JAILBREAK_PATTERNS) {
    if (pattern.test(input)) {
      logger.warn(`[Security] Jailbreak attempt blocked: ${pattern}`);
      return {
        sanitized: '',
        blocked: true,
        reason: 'Potentially harmful request detected',
      };
    }
  }

  // Check for data leakage requests
  for (const pattern of LEAKAGE_REQUEST_PATTERNS) {
    if (pattern.test(input)) {
      logger.warn(`[Security] Data leakage probe blocked: ${pattern}`);
      return {
        sanitized: '',
        blocked: true,
        reason: 'Request for sensitive information detected',
      };
    }
  }

  // Escape potentially dangerous characters
  let sanitized = input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/```/g, '');

  return { sanitized, blocked: false };
}

/**
 * Redact sensitive information from responses
 */
export function redactSensitiveData(text: string): string {
  let redacted = text;

  for (const pattern of SENSITIVE_PATTERNS) {
    redacted = redacted.replace(pattern, '[REDACTED]');
  }

  return redacted;
}

/**
 * Input sanitization middleware
 */
export function inputSanitizationMiddleware(req: Request, res: Response, next: NextFunction) {
  // Skip for non-content routes
  if (!req.body) {
    return next();
  }

  // Check query parameter
  if (req.body.query) {
    const result = sanitizeInput(req.body.query);
    if (result.blocked) {
      logger.warn(`[Security] Blocked request from ${req.ip}: ${result.reason}`);
      return res.status(400).json({
        success: false,
        error: {
          code: 'SECURITY_VIOLATION',
          message: 'Your request was blocked for security reasons. Please rephrase your query.',
        },
      });
    }
    req.body.query = result.sanitized;
  }

  // Check prompt parameter
  if (req.body.prompt) {
    const result = sanitizeInput(req.body.prompt);
    if (result.blocked) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'SECURITY_VIOLATION',
          message: 'Your request was blocked for security reasons.',
        },
      });
    }
    req.body.prompt = result.sanitized;
  }

  // Check message parameter
  if (req.body.message) {
    const result = sanitizeInput(req.body.message);
    if (result.blocked) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'SECURITY_VIOLATION',
          message: 'Your request was blocked for security reasons.',
        },
      });
    }
    req.body.message = result.sanitized;
  }

  next();
}

/**
 * Response sanitization middleware
 */
export function responseSanitizationMiddleware(_req: Request, res: Response, next: NextFunction) {
  const originalJson = res.json.bind(res);

  res.json = (body: any) => {
    if (typeof body === 'object') {
      const sanitized = JSON.parse(
        redactSensitiveData(JSON.stringify(body))
      );
      return originalJson(sanitized);
    }
    return originalJson(body);
  };

  next();
}

/**
 * Rate limiting middleware
 */
export function rateLimitMiddleware(req: Request, res: Response, next: NextFunction): void {
  const clientId = req.ip || 'unknown';
  const now = Date.now();

  let entry = rateLimitStore.get(clientId);

  if (!entry || now > entry.resetTime) {
    entry = { count: 1, resetTime: now + RATE_LIMIT_WINDOW };
    rateLimitStore.set(clientId, entry);
  } else {
    entry.count++;
  }

  if (entry.count > RATE_LIMIT_MAX) {
    logger.warn(`[Security] Rate limit exceeded for ${clientId}`);
    res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil((entry.resetTime - now) / 1000),
      },
    });
    return;
  }

  res.setHeader('X-RateLimit-Limit', RATE_LIMIT_MAX);
  res.setHeader('X-RateLimit-Remaining', RATE_LIMIT_MAX - entry.count);
  res.setHeader('X-RateLimit-Reset', Math.ceil(entry.resetTime / 1000));

  next();
}

/**
 * CORS security middleware
 */
export function corsSecurityMiddleware(req: Request, res: Response, next: NextFunction): void {
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://datacendia.com',
    'https://app.datacendia.com',
  ];

  const origin = req.headers.origin;

  if (origin && !allowedOrigins.includes(origin)) {
    logger.warn(`[Security] CORS violation from origin: ${origin}`);
    res.status(403).json({
      success: false,
      error: {
        code: 'CORS_VIOLATION',
        message: 'Origin not allowed',
      },
    });
    return;
  }

  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  next();
}

// Signatures of actual injection attempts. Queries go through Prisma, which
// parameterises them; that is the defence, and this only turns away obvious
// probes, so it must never match ordinary text. The previous list rejected any
// apostrophe, '#' or '--' anywhere in a JSON body: "What's our exposure?" never
// reached the Council, a feedback title like "lot #BC-2024" came back 400, and so
// did every frontend crash report, because stack traces quote property names.
export const SQL_INJECTION_PATTERNS = [
  /'\s*(or|and)\s+('[^']*'|\d+)\s*=\s*('[^']*'|\d+)/i, // ' OR 1=1, ' or 'a'='a'
  /'\s*;\s*(drop|delete|insert|update|alter|create|truncate|exec)\b/i, // '; DROP ...
  /;\s*(drop|truncate)\s+table\b/i,
  /\bunion\s+(all\s+)?select\b/i,
  /\bexec(\s|\+)+(s|x)p\w+/i, // xp_cmdshell, sp_ procedures
];

/**
 * SQL injection prevention middleware
 */
export function sqlInjectionMiddleware(req: Request, res: Response, next: NextFunction): void {
  const checkValue = (value: string): boolean => {
    return SQL_INJECTION_PATTERNS.some(pattern => pattern.test(value));
  };

  // Check query params
  for (const [key, value] of Object.entries(req.query)) {
    if (typeof value === 'string' && checkValue(value)) {
      logger.warn(`[Security] SQL injection attempt in query param: ${key}`);
      res.status(400).json({
        success: false,
        error: {
          code: 'SECURITY_VIOLATION',
          message: 'Invalid request parameters',
        },
      });
      return;
    }
  }

  // Check body
  if (req.body) {
    const bodyStr = JSON.stringify(req.body);
    if (checkValue(bodyStr)) {
      logger.warn(`[Security] SQL injection attempt in body`);
      res.status(400).json({
        success: false,
        error: {
          code: 'SECURITY_VIOLATION',
          message: 'Invalid request data',
        },
      });
      return;
    }
  }

  next();
}

/**
 * Path traversal prevention middleware
 */
export function pathTraversalMiddleware(req: Request, res: Response, next: NextFunction): void {
  const traversalPatterns = [
    /\.\.\//, 
    /\.\.%2f/i,
    /%2e%2e\//i,
    /%2e%2e%2f/i,
    /\.\.%5c/i,
    /etc\/passwd/i,
    /etc\/shadow/i,
    /windows\/system32/i,
    /\.\.\\/,  // Backslash variant
    /\.\.$/,   // Ends with ..
  ];

  const path = req.path + req.url;
  
  // Also check request body for path traversal
  if (req.body) {
    const bodyStr = JSON.stringify(req.body);
    for (const pattern of traversalPatterns) {
      if (pattern.test(bodyStr)) {
        logger.warn(`[Security] Path traversal attempt in body`);
        res.status(400).json({
          success: false,
          error: {
            code: 'SECURITY_VIOLATION',
            message: 'Invalid path in request',
          },
        });
        return;
      }
    }
  }

  for (const pattern of traversalPatterns) {
    if (pattern.test(path)) {
      logger.warn(`[Security] Path traversal attempt: ${path}`);
      res.status(400).json({
        success: false,
        error: {
          code: 'SECURITY_VIOLATION',
          message: 'Invalid path',
        },
      });
      return;
    }
  }

  next();
}

/**
 * Combined security middleware
 */
export function securityMiddleware(req: Request, res: Response, next: NextFunction) {
  // Apply all security checks
  pathTraversalMiddleware(req, res, () => {
    sqlInjectionMiddleware(req, res, () => {
      rateLimitMiddleware(req, res, () => {
        inputSanitizationMiddleware(req, res, () => {
          responseSanitizationMiddleware(req, res, next);
        });
      });
    });
  });
}

export default {
  sanitizeInput,
  redactSensitiveData,
  inputSanitizationMiddleware,
  responseSanitizationMiddleware,
  rateLimitMiddleware,
  corsSecurityMiddleware,
  sqlInjectionMiddleware,
  pathTraversalMiddleware,
  securityMiddleware,
};
