/**
 * Middleware — Csrf
 *
 * Express middleware for request processing pipeline.
 *
 * @exports generateCsrfToken, csrfTokenHandler, csrfProtection, ensureCsrfToken
 * @module middleware/csrf
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * CSRF Protection Middleware
 * 
 * Implements double-submit cookie pattern for CSRF protection.
 * - Generates a CSRF token and stores it in a secure cookie
 * - Validates the token from request header against the cookie
 * - Exempt paths can be configured for webhooks/APIs that use other auth
 */

import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';

// Configuration
const CSRF_COOKIE_NAME = 'csrf_token';
const CSRF_HEADER_NAME = 'x-csrf-token';
const CSRF_TOKEN_LENGTH = 32;

// Paths exempt from CSRF protection (webhooks, external APIs)
const EXEMPT_PATHS = [
  '/api/v1/webhooks',
  '/api/v1/integrations/webhook',
  '/api/v1/contact', // Public contact form uses different protection
  '/api/v1/legal-research', // Legal research API for dev testing
  '/health',
  '/api/docs',
];

// Methods that don't modify state (safe methods)
const SAFE_METHODS = ['GET', 'HEAD', 'OPTIONS'];

/**
 * Generate a cryptographically secure CSRF token
 */
export const generateCsrfToken = (): string => {
  return crypto.randomBytes(CSRF_TOKEN_LENGTH).toString('hex');
};

/**
 * Set CSRF token cookie
 */
const setCsrfCookie = (res: Response, token: string): void => {
  res.cookie(CSRF_COOKIE_NAME, token, {
    httpOnly: false, // Must be readable by JavaScript to include in headers
    secure: config.nodeEnv === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    path: '/',
  });
};

/**
 * Check if path is exempt from CSRF protection
 */
const isExemptPath = (path: string): boolean => {
  return EXEMPT_PATHS.some((exempt) => path.startsWith(exempt));
};

/**
 * CSRF Token Generation Endpoint
 * Call this to get a fresh CSRF token for the session
 */
export const csrfTokenHandler = (_req: Request, res: Response): void => {
  const token = generateCsrfToken();
  setCsrfCookie(res, token);
  
  res.json({
    success: true,
    csrfToken: token,
  });
};

/**
 * CSRF Protection Middleware
 * Validates CSRF token for state-changing requests
 */
export const csrfProtection = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Skip CSRF check for safe methods
  if (SAFE_METHODS.includes(req.method)) {
    return next();
  }

  // Skip CSRF check for exempt paths
  if (isExemptPath(req.path)) {
    return next();
  }

  // Skip in development if explicitly disabled
  if (config.nodeEnv === 'development' && process.env['DISABLE_CSRF'] === 'true') {
    logger.warn('⚠️  CSRF protection disabled in development');
    return next();
  }

  // Get token from cookie
  const cookieToken = req.cookies?.[CSRF_COOKIE_NAME];
  
  // Get token from header
  const headerToken = req.get(CSRF_HEADER_NAME);

  // Validate tokens exist
  if (!cookieToken || !headerToken) {
    logger.warn('CSRF validation failed - missing token', {
      path: req.path,
      method: req.method,
      hasCookie: !!cookieToken,
      hasHeader: !!headerToken,
      ip: req.ip,
    });
    
    res.status(403).json({
      success: false,
      error: {
        code: 'CSRF_TOKEN_MISSING',
        message: 'CSRF token is required for this request',
      },
    });
    return;
  }

  // Validate tokens match (timing-safe comparison)
  const tokensMatch = crypto.timingSafeEqual(
    Buffer.from(cookieToken),
    Buffer.from(headerToken)
  );

  if (!tokensMatch) {
    logger.warn('CSRF validation failed - token mismatch', {
      path: req.path,
      method: req.method,
      ip: req.ip,
    });
    
    res.status(403).json({
      success: false,
      error: {
        code: 'CSRF_TOKEN_INVALID',
        message: 'Invalid CSRF token',
      },
    });
    return;
  }

  // Token is valid - generate a new one for the next request (token rotation)
  const newToken = generateCsrfToken();
  setCsrfCookie(res, newToken);
  
  // Attach new token to response header so client can use it
  res.setHeader('X-CSRF-Token-New', newToken);

  next();
};

/**
 * Middleware to ensure CSRF cookie exists (for initial page load)
 * Use this on routes that render pages to ensure token is available
 */
export const ensureCsrfToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const existingToken = req.cookies?.[CSRF_COOKIE_NAME];
  
  if (!existingToken) {
    const token = generateCsrfToken();
    setCsrfCookie(res, token);
  }
  
  next();
};

export default csrfProtection;
