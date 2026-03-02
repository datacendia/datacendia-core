// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// ZOD RUNTIME VALIDATION MIDDLEWARE
// Enterprise-grade request/response validation at API boundaries
// =============================================================================

import { Request, Response, NextFunction, RequestHandler } from 'express';
import { z, ZodSchema, ZodError } from 'zod';
import { logger } from '../utils/logger.js';

// =============================================================================
// VALIDATION ERROR RESPONSE
// =============================================================================

interface ValidationErrorResponse {
  success: false;
  error: {
    code: 'VALIDATION_ERROR';
    message: string;
    details: Array<{
      path: string;
      message: string;
      code: string;
    }>;
  };
}

function formatZodError(error: ZodError): ValidationErrorResponse {
  return {
    success: false,
    error: {
      code: 'VALIDATION_ERROR',
      message: 'Request validation failed',
      details: error.errors.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
        code: err.code,
      })),
    },
  };
}

// =============================================================================
// VALIDATION MIDDLEWARE FACTORY
// =============================================================================

interface ValidationOptions {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
  stripUnknown?: boolean;
}

export function validate(schemas: ValidationOptions): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validate body
      if (schemas.body) {
        const result = schemas.body.safeParse(req.body);
        if (!result.success) {
          logger.warn('Request body validation failed', {
            path: req.path,
            method: req.method,
            errors: result.error.errors,
          });
          res.status(400).json(formatZodError(result.error));
          return;
        }
        req.body = result.data;
      }

      // Validate query parameters
      if (schemas.query) {
        const result = schemas.query.safeParse(req.query);
        if (!result.success) {
          logger.warn('Request query validation failed', {
            path: req.path,
            method: req.method,
            errors: result.error.errors,
          });
          res.status(400).json(formatZodError(result.error));
          return;
        }
        req.query = result.data;
      }

      // Validate URL parameters
      if (schemas.params) {
        const result = schemas.params.safeParse(req.params);
        if (!result.success) {
          logger.warn('Request params validation failed', {
            path: req.path,
            method: req.method,
            errors: result.error.errors,
          });
          res.status(400).json(formatZodError(result.error));
          return;
        }
        req.params = result.data;
      }

      next();
    } catch (error) {
      logger.error('Validation middleware error', { error });
      next(error);
    }
  };
}

// =============================================================================
// RESPONSE VALIDATION (for development/testing)
// =============================================================================

export function validateResponse<T>(
  schema: ZodSchema<T>,
  data: unknown,
  context?: string
): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    logger.error('Response validation failed', {
      context,
      errors: result.error.errors,
    });
    if (process.env['NODE_ENV'] === 'development') {
      throw new Error(`Response validation failed: ${JSON.stringify(result.error.errors)}`);
    }
  }
  return result.success ? result.data : (data as T);
}

// =============================================================================
// COMMON SCHEMAS
// =============================================================================

export const CommonSchemas = {
  // Pagination
  pagination: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
  }),

  // UUID parameter
  uuidParam: z.object({
    id: z.string().uuid('Invalid UUID format'),
  }),

  // Date range
  dateRange: z.object({
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
  }).refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return data.startDate <= data.endDate;
      }
      return true;
    },
    { message: 'startDate must be before or equal to endDate' }
  ),

  // Organization context
  orgContext: z.object({
    organizationId: z.string().uuid('Invalid organization ID'),
  }),

  // Search query
  searchQuery: z.object({
    q: z.string().min(1).max(500).optional(),
    filters: z.record(z.string()).optional(),
  }),
};

// =============================================================================
// DECISION SCHEMAS
// =============================================================================

export const DecisionSchemas = {
  create: z.object({
    title: z.string().min(1, 'Title is required').max(255),
    description: z.string().max(10000).optional(),
    category: z.enum(['strategic', 'operational', 'tactical', 'compliance']).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('MEDIUM'),
    department: z.string().max(100).optional(),
    stakeholders: z.array(z.string().email()).optional(),
    deadline: z.coerce.date().optional(),
    budget: z.number().min(0).optional(),
    tags: z.array(z.string()).optional(),
  }),

  update: z.object({
    title: z.string().min(1).max(255).optional(),
    description: z.string().max(10000).optional(),
    status: z.enum([
      'PENDING',
      'BLOCKED',
      'DEFERRED',
      'ESCALATED',
      'APPROVED',
      'REJECTED',
      'IMPLEMENTED',
    ]).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
    resolution: z.string().max(10000).optional(),
  }),

  list: CommonSchemas.pagination.extend({
    status: z.enum([
      'PENDING',
      'BLOCKED',
      'DEFERRED',
      'ESCALATED',
      'APPROVED',
      'REJECTED',
      'IMPLEMENTED',
    ]).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
    department: z.string().optional(),
    category: z.string().optional(),
  }),
};

// =============================================================================
// COUNCIL SCHEMAS
// =============================================================================

export const CouncilSchemas = {
  query: z.object({
    topic: z.string().min(1, 'Topic is required').max(5000),
    context: z.string().max(50000).optional(),
    agents: z.array(z.string()).min(1).max(10).optional(),
    mode: z.enum(['standard', 'debate', 'consensus', 'rapid']).default('standard'),
    maxRounds: z.number().int().min(1).max(10).default(3),
    attachments: z.array(z.object({
      name: z.string(),
      content: z.string(),
      type: z.string(),
    })).optional(),
  }),

  deliberation: z.object({
    decisionId: z.string().uuid().optional(),
    topic: z.string().min(1).max(5000),
    context: z.string().max(50000).optional(),
    participants: z.array(z.string()).optional(),
    urgency: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  }),
};

// =============================================================================
// USER SCHEMAS
// =============================================================================

export const UserSchemas = {
  create: z.object({
    email: z.string().email('Invalid email address'),
    name: z.string().min(1).max(255),
    role: z.enum(['admin', 'analyst', 'operator', 'viewer']).default('viewer'),
    department: z.string().max(100).optional(),
    organizationId: z.string().uuid().optional(),
  }),

  update: z.object({
    name: z.string().min(1).max(255).optional(),
    role: z.enum(['admin', 'analyst', 'operator', 'viewer']).optional(),
    department: z.string().max(100).optional(),
    preferences: z.record(z.unknown()).optional(),
  }),

  login: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    mfaCode: z.string().length(6).optional(),
  }),

  register: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string()
      .min(12, 'Password must be at least 12 characters')
      .regex(/[A-Z]/, 'Password must contain uppercase letter')
      .regex(/[a-z]/, 'Password must contain lowercase letter')
      .regex(/[0-9]/, 'Password must contain number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain special character'),
    name: z.string().min(1).max(255),
    organizationName: z.string().min(1).max(255).optional(),
  }),
};

// =============================================================================
// ALERT SCHEMAS
// =============================================================================

export const AlertSchemas = {
  create: z.object({
    title: z.string().min(1).max(255),
    message: z.string().max(5000),
    severity: z.enum(['info', 'warning', 'error', 'critical']),
    source: z.string().max(100),
    category: z.string().max(100).optional(),
    metadata: z.record(z.unknown()).optional(),
  }),

  acknowledge: z.object({
    notes: z.string().max(1000).optional(),
  }),

  list: CommonSchemas.pagination.extend({
    severity: z.enum(['info', 'warning', 'error', 'critical']).optional(),
    acknowledged: z.coerce.boolean().optional(),
    source: z.string().optional(),
  }),
};

// =============================================================================
// INTEGRATION SCHEMAS
// =============================================================================

export const IntegrationSchemas = {
  webhook: z.object({
    event: z.string().min(1).max(100),
    payload: z.record(z.unknown()),
    signature: z.string().optional(),
    timestamp: z.coerce.date().optional(),
  }),

  dataSource: z.object({
    name: z.string().min(1).max(255),
    type: z.enum(['database', 'api', 'file', 'stream']),
    connectionString: z.string().max(2000).optional(),
    config: z.record(z.unknown()).optional(),
    schedule: z.string().max(100).optional(),
  }),
};

// =============================================================================
// EXPORT ALL SCHEMAS
// =============================================================================

export const Schemas = {
  Common: CommonSchemas,
  Decision: DecisionSchemas,
  Council: CouncilSchemas,
  User: UserSchemas,
  Alert: AlertSchemas,
  Integration: IntegrationSchemas,
};

export { z } from 'zod';
