// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * OpenAPI/Swagger Configuration
 * 
 * Auto-generates API documentation from JSDoc comments in route files.
 * Access at /api/docs in development.
 */

import swaggerJsdoc from 'swagger-jsdoc';
import { config } from './index.js';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Datacendia API',
      version: '1.0.0',
      description: `
# Datacendia Platform API

Enterprise AI Decision Intelligence Platform API providing:

- **Council** - AI agent deliberation and consensus
- **Decisions** - Decision tracking and management
- **Graph** - Knowledge graph and lineage
- **Workflows** - Automation and approvals
- **Analytics** - Metrics, forecasts, and scenarios
- **Security** - RBAC, audit logs, compliance

## Authentication

All endpoints require JWT authentication via Bearer token:
\`\`\`
Authorization: Bearer <token>
\`\`\`

## Rate Limits

- Development: 1000 requests/minute
- Production: 100 requests/minute
      `,
      contact: {
        name: 'Datacendia Support',
        email: 'support@datacendia.com',
        url: 'https://datacendia.com',
      },
      license: {
        name: 'Proprietary',
        url: 'https://datacendia.com/license',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.port}/api/v1`,
        description: 'Development server',
      },
      {
        url: 'https://api.datacendia.com/v1',
        description: 'Production server',
      },
    ],
    tags: [
      { name: 'Auth', description: 'Authentication and authorization' },
      { name: 'Users', description: 'User management' },
      { name: 'Organizations', description: 'Organization management' },
      { name: 'Council', description: 'AI Council deliberations' },
      { name: 'Decisions', description: 'Decision tracking' },
      { name: 'Deliberations', description: 'Deliberation sessions' },
      { name: 'Graph', description: 'Knowledge graph operations' },
      { name: 'Lineage', description: 'Data lineage tracking' },
      { name: 'Workflows', description: 'Workflow automation' },
      { name: 'Metrics', description: 'Metrics and KPIs' },
      { name: 'Alerts', description: 'Alert management' },
      { name: 'Forecasts', description: 'Predictions and scenarios' },
      { name: 'Data Sources', description: 'Data source connections' },
      { name: 'Integrations', description: 'Third-party integrations' },
      { name: 'Admin', description: 'Administrative operations' },
      { name: 'Settings', description: 'Configuration settings' },
      { name: 'Enterprise', description: 'Enterprise features' },
      { name: 'Sovereign', description: 'Sovereign deployment features' },
      { name: 'Compliance', description: 'Compliance and audit' },
      { name: 'Security', description: 'Security operations' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token obtained from /auth/login',
        },
        apiKey: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key',
          description: 'API key for service-to-service communication',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: {
              type: 'object',
              properties: {
                code: { type: 'string', example: 'VALIDATION_ERROR' },
                message: { type: 'string', example: 'Validation failed' },
                details: { type: 'object' },
              },
            },
          },
        },
        Pagination: {
          type: 'object',
          properties: {
            page: { type: 'integer', example: 1 },
            limit: { type: 'integer', example: 20 },
            total: { type: 'integer', example: 100 },
            totalPages: { type: 'integer', example: 5 },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            role: { type: 'string', enum: ['admin', 'analyst', 'operator', 'auditor', 'viewer'] },
            organizationId: { type: 'string', format: 'uuid' },
            isActive: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Organization: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            slug: { type: 'string' },
            plan: { type: 'string', enum: ['pilot', 'foundation', 'enterprise', 'strategic', 'custom'] },
            settings: { type: 'object' },
            isActive: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Agent: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            code: { type: 'string', example: 'CFO' },
            name: { type: 'string', example: 'Chief Financial Officer' },
            role: { type: 'string' },
            description: { type: 'string' },
            avatarUrl: { type: 'string', format: 'uri' },
            isActive: { type: 'boolean' },
          },
        },
        Deliberation: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            organizationId: { type: 'string', format: 'uuid' },
            question: { type: 'string' },
            status: { type: 'string', enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'CANCELLED'] },
            currentPhase: { type: 'string' },
            progress: { type: 'integer', minimum: 0, maximum: 100 },
            decision: { type: 'object' },
            confidence: { type: 'number', minimum: 0, maximum: 1 },
            createdAt: { type: 'string', format: 'date-time' },
            completedAt: { type: 'string', format: 'date-time' },
          },
        },
        Decision: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            description: { type: 'string' },
            priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] },
            status: { type: 'string', enum: ['PENDING', 'IN_PROGRESS', 'APPROVED', 'REJECTED', 'DEFERRED'] },
            department: { type: 'string' },
            deadline: { type: 'string', format: 'date-time' },
            stakeholders: { type: 'array', items: { type: 'string' } },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Metric: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            code: { type: 'string' },
            name: { type: 'string' },
            value: { type: 'number' },
            unit: { type: 'string' },
            trend: { type: 'number' },
            target: { type: 'number' },
            category: { type: 'string' },
          },
        },
        Alert: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            severity: { type: 'string', enum: ['INFO', 'WARNING', 'ERROR', 'CRITICAL'] },
            status: { type: 'string', enum: ['ACTIVE', 'ACKNOWLEDGED', 'RESOLVED'] },
            title: { type: 'string' },
            message: { type: 'string' },
            source: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Workflow: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            description: { type: 'string' },
            status: { type: 'string', enum: ['DRAFT', 'ACTIVE', 'PAUSED', 'ARCHIVED'] },
            trigger: { type: 'object' },
            nodes: { type: 'array', items: { type: 'object' } },
            edges: { type: 'array', items: { type: 'object' } },
          },
        },
        DataSource: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            type: { type: 'string', enum: ['postgresql', 'mysql', 'mongodb', 'snowflake', 'bigquery', 'api'] },
            status: { type: 'string', enum: ['CONNECTED', 'DISCONNECTED', 'SYNCING', 'ERROR'] },
            lastSyncAt: { type: 'string', format: 'date-time' },
          },
        },
        HealthScore: {
          type: 'object',
          properties: {
            overall: { type: 'integer', minimum: 0, maximum: 100 },
            dataScore: { type: 'integer', minimum: 0, maximum: 100 },
            opsScore: { type: 'integer', minimum: 0, maximum: 100 },
            securityScore: { type: 'integer', minimum: 0, maximum: 100 },
            peopleScore: { type: 'integer', minimum: 0, maximum: 100 },
            calculatedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
      responses: {
        Unauthorized: {
          description: 'Authentication required',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: {
                success: false,
                error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
              },
            },
          },
        },
        Forbidden: {
          description: 'Access denied',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: {
                success: false,
                error: { code: 'FORBIDDEN', message: 'Access denied' },
              },
            },
          },
        },
        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: {
                success: false,
                error: { code: 'NOT_FOUND', message: 'Resource not found' },
              },
            },
          },
        },
        ValidationError: {
          description: 'Validation failed',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: {
                success: false,
                error: {
                  code: 'VALIDATION_ERROR',
                  message: 'Validation failed',
                  details: { field: ['error message'] },
                },
              },
            },
          },
        },
        RateLimited: {
          description: 'Too many requests',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: {
                success: false,
                error: { code: 'RATE_LIMITED', message: 'Too many requests' },
              },
            },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.ts', './src/routes/**/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
