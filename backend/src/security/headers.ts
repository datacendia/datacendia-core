// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * =============================================================================
 * MILITARY-GRADE SECURITY HEADERS
 * =============================================================================
 * 
 * Implements OWASP Secure Headers Project recommendations
 * https://owasp.org/www-project-secure-headers/
 */

import helmet from 'helmet';
import { RequestHandler } from 'express';

/**
 * Production-hardened security headers
 */
export const securityHeaders: RequestHandler = helmet({
  // Content Security Policy - Strict
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"], // Production upgrade: remove unsafe-inline
      imgSrc: ["'self'", 'data:', 'https:'],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
      childSrc: ["'none'"],
      workerSrc: ["'self'"],
      frameAncestors: ["'none'"],
      formAction: ["'self'"],
      baseUri: ["'self'"],
      manifestSrc: ["'self'"],
      connectSrc: ["'self'", 'wss:', 'https:'],
      upgradeInsecureRequests: [],
      blockAllMixedContent: [],
    },
    reportOnly: false,
  },

  // Cross-Origin settings
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: { policy: 'same-origin' },
  crossOriginResourcePolicy: { policy: 'same-origin' },

  // DNS Prefetch Control
  dnsPrefetchControl: { allow: false },

  // Expect-CT (Certificate Transparency)
  // expectCt: { maxAge: 86400, enforce: true },

  // Frameguard - Prevent clickjacking
  frameguard: { action: 'deny' },

  // Hide X-Powered-By
  hidePoweredBy: true,

  // HSTS - Strict Transport Security
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },

  // IE No Open
  ieNoOpen: true,

  // No Sniff - Prevent MIME type sniffing
  noSniff: true,

  // Origin Agent Cluster
  originAgentCluster: true,

  // Permitted Cross-Domain Policies
  permittedCrossDomainPolicies: { permittedPolicies: 'none' },

  // Referrer Policy
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },

  // XSS Filter (legacy, but still useful)
  xssFilter: true,
});

/**
 * Additional custom security headers
 */
export const customSecurityHeaders: RequestHandler = (req, res, next) => {
  // Permissions Policy (Feature Policy successor)
  res.setHeader('Permissions-Policy', [
    'accelerometer=()',
    'ambient-light-sensor=()',
    'autoplay=()',
    'battery=()',
    'camera=()',
    'cross-origin-isolated=()',
    'display-capture=()',
    'document-domain=()',
    'encrypted-media=()',
    'execution-while-not-rendered=()',
    'execution-while-out-of-viewport=()',
    'fullscreen=(self)',
    'geolocation=()',
    'gyroscope=()',
    'keyboard-map=()',
    'magnetometer=()',
    'microphone=()',
    'midi=()',
    'navigation-override=()',
    'payment=()',
    'picture-in-picture=()',
    'publickey-credentials-get=()',
    'screen-wake-lock=()',
    'sync-xhr=()',
    'usb=()',
    'web-share=()',
    'xr-spatial-tracking=()',
  ].join(', '));

  // Cache-Control for sensitive data
  if (req.path.startsWith('/api/')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
  }

  // Clear-Site-Data on logout
  if (req.path === '/api/v1/auth/logout' && req.method === 'POST') {
    res.setHeader('Clear-Site-Data', '"cache", "cookies", "storage"');
  }

  // Add security timing headers
  res.setHeader('X-Request-Id', req.headers['x-request-id'] || crypto.randomUUID());
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');

  next();
};

/**
 * CORS configuration for government/military environments
 */
export const strictCorsConfig = {
  // Only allow specific origins
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    const allowedOrigins = process.env.CORS_ORIGINS?.split(',') || [];
    
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) {
      callback(null, true);
      return;
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  
  // Credentials
  credentials: true,
  
  // Allowed methods
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  
  // Allowed headers
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Request-ID',
    'X-API-Key',
    'X-Signature',
    'X-Timestamp',
  ],
  
  // Exposed headers
  exposedHeaders: [
    'X-Request-ID',
    'X-RateLimit-Limit',
    'X-RateLimit-Remaining',
    'X-RateLimit-Reset',
    'Retry-After',
  ],
  
  // Max age for preflight
  maxAge: 600, // 10 minutes
  
  // Success status for legacy browsers
  optionsSuccessStatus: 204,
};

import crypto from 'crypto';
