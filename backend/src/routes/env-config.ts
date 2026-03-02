/**
 * API Routes — Env Config
 *
 * Express route handler defining REST endpoints.
 * @module routes/env-config
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * Environment Configuration API Routes
 * 
 * SECURITY: Admin-only access required
 * Allows runtime viewing and editing of .env file
 */

import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = Router();

// @ts-ignore
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ENV_PATH = path.resolve(__dirname, '../../../.env');

/**
 * Parse .env file into key-value pairs
 */
function parseEnvFile(content: string): Record<string, string> {
  const lines = content.split('\n');
  const vars: Record<string, string> = {};
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    
    const [key, ...valueParts] = trimmed.split('=');
    if (key) {
      vars[key.trim()] = valueParts.join('=').trim();
    }
  }
  
  return vars;
}

/**
 * Convert key-value pairs back to .env format
 */
function serializeEnvFile(vars: Record<string, string>): string {
  const lines: string[] = [
    '# ============================================',
    '# DATACENDIA PLATFORM - Environment Configuration',
    '# ============================================',
    '# Auto-generated via Environment Config UI',
    `# Last updated: ${new Date().toISOString()}`,
    '',
  ];
  
  // Group by category (basic grouping)
  const categories: Record<string, string[]> = {
    'Application': ['NODE_ENV', 'PORT', 'LOG_LEVEL'],
    'Database': ['DATABASE_URL', 'POSTGRES_USER', 'POSTGRES_PASSWORD', 'POSTGRES_DB'],
    'Cache': ['REDIS_URL', 'REDIS_PASSWORD', 'REDIS_HOST', 'REDIS_PORT'],
    'Graph Database': ['NEO4J_URI', 'NEO4J_USER', 'NEO4J_PASSWORD'],
    'AI Models': ['OLLAMA_BASE_URL', 'OLLAMA_MODEL', 'OPENAI_API_KEY', 'OPENAI_MODEL', 'ANTHROPIC_API_KEY'],
    'Security': ['JWT_SECRET', 'JWT_REFRESH_SECRET', 'JWT_ACCESS_EXPIRY', 'JWT_REFRESH_EXPIRY', 'ENCRYPTION_KEY', 'CORS_ORIGIN'],
    'Email': ['SENDGRID_API_KEY', 'EMAIL_FROM', 'SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASSWORD'],
    'Billing': ['STRIPE_SECRET_KEY', 'STRIPE_PUBLISHABLE_KEY', 'STRIPE_WEBHOOK_SECRET'],
    'Monitoring': ['SENTRY_DSN', 'DATADOG_API_KEY'],
    'Features': ['ENABLE_DEMO_MODE', 'ENABLE_OLLAMA', 'ENABLE_OPENAI', 'ENABLE_BILLING'],
  };
  
  for (const [category, keys] of Object.entries(categories)) {
    const categoryVars = keys.filter(k => vars[k] !== undefined);
    if (categoryVars.length === 0) continue;
    
    lines.push('', `# ============================================`, `# ${category}`, `# ============================================`);
    for (const key of categoryVars) {
      lines.push(`${key}=${vars[key]}`);
    }
  }
  
  // Add any remaining vars not in categories
  const categorizedKeys = new Set(Object.values(categories).flat());
  const remaining = Object.keys(vars).filter(k => !categorizedKeys.has(k));
  if (remaining.length > 0) {
    lines.push('', `# ============================================`, `# Other`, `# ============================================`);
    for (const key of remaining) {
      lines.push(`${key}=${vars[key]}`);
    }
  }
  
  lines.push('');
  return lines.join('\n');
}

/**
 * GET /api/v1/admin/env-config
 * Read current .env configuration
 */
router.get('/', async (_req: Request, res: Response) => {
  try {
    if (!fs.existsSync(ENV_PATH)) {
      return res.status(404).json({
        success: false,
        error: '.env file not found',
      });
    }
    
    const content = fs.readFileSync(ENV_PATH, 'utf8');
    const vars = parseEnvFile(content);
    
    // Build structured response
    const variables = Object.entries(vars).map(([key, value]) => ({
      key,
      value,
      category: getCategoryForKey(key),
      description: getDescriptionForKey(key),
      required: isRequired(key),
      sensitive: isSensitive(key),
    }));
    
    res.json({
      success: true,
      data: {
        variables,
        lastModified: fs.statSync(ENV_PATH).mtime,
        environment: process.env.NODE_ENV || 'development',
      },
    });
  } catch (error) {
    console.error('Error reading .env:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to read configuration',
    });
  }
});

/**
 * POST /api/v1/admin/env-config
 * Update .env configuration
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { variables } = req.body;
    
    if (!variables || typeof variables !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Invalid request body',
      });
    }
    
    // Backup existing .env
    if (fs.existsSync(ENV_PATH)) {
      const backupPath = `${ENV_PATH}.backup.${Date.now()}`;
      fs.copyFileSync(ENV_PATH, backupPath);
    }
    
    // Write new .env
    const content = serializeEnvFile(variables);
    fs.writeFileSync(ENV_PATH, content, 'utf8');
    
    res.json({
      success: true,
      message: 'Configuration saved successfully. Restart server to apply changes.',
    });
  } catch (error) {
    console.error('Error writing .env:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save configuration',
    });
  }
});

/**
 * POST /api/v1/admin/env-config/validate
 * Validate configuration without saving
 */
router.post('/validate', async (req: Request, res: Response) => {
  try {
    const { variables } = req.body;
    const errors: Record<string, string> = {};
    
    // Check required fields
    const requiredKeys = ['DATABASE_URL', 'REDIS_URL', 'NEO4J_URI', 'JWT_SECRET', 'JWT_REFRESH_SECRET', 'ENCRYPTION_KEY'];
    for (const key of requiredKeys) {
      if (!variables[key]) {
        errors[key] = 'Required field';
      }
    }
    
    // Validate URLs
    const urlKeys = ['DATABASE_URL', 'REDIS_URL', 'NEO4J_URI', 'OLLAMA_BASE_URL'];
    for (const key of urlKeys) {
      if (variables[key]) {
        try {
          new URL(variables[key]);
        } catch {
          errors[key] = 'Invalid URL format';
        }
      }
    }
    
    // Validate secret lengths
    if (variables.JWT_SECRET && variables.JWT_SECRET.length < 32) {
      errors.JWT_SECRET = 'Must be at least 32 characters';
    }
    if (variables.ENCRYPTION_KEY && variables.ENCRYPTION_KEY.length < 32) {
      errors.ENCRYPTION_KEY = 'Must be at least 32 characters';
    }
    
    res.json({
      success: Object.keys(errors).length === 0,
      errors: Object.keys(errors).length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Error validating config:', error);
    res.status(500).json({
      success: false,
      error: 'Validation failed',
    });
  }
});

/**
 * GET /api/v1/admin/env-config/download
 * Download current .env file
 */
router.get('/download', async (_req: Request, res: Response) => {
  try {
    if (!fs.existsSync(ENV_PATH)) {
      return res.status(404).json({
        success: false,
        error: '.env file not found',
      });
    }
    
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', 'attachment; filename=".env"');
    res.sendFile(ENV_PATH);
  } catch (error) {
    console.error('Error downloading .env:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to download configuration',
    });
  }
});

// Helper functions
function getCategoryForKey(key: string): string {
  if (key.startsWith('POSTGRES_') || key === 'DATABASE_URL') return 'Database';
  if (key.startsWith('REDIS_')) return 'Cache';
  if (key.startsWith('NEO4J_')) return 'Graph Database';
  if (key.startsWith('OLLAMA_') || key.startsWith('OPENAI_') || key.startsWith('ANTHROPIC_')) return 'AI Models';
  if (key.startsWith('JWT_') || key === 'ENCRYPTION_KEY' || key.startsWith('CORS_')) return 'Security';
  if (key.startsWith('SMTP_') || key.startsWith('SENDGRID_') || key === 'EMAIL_FROM') return 'Email';
  if (key.startsWith('STRIPE_')) return 'Billing';
  if (key.startsWith('SENTRY_') || key.startsWith('DATADOG_')) return 'Monitoring';
  if (key.startsWith('ENABLE_')) return 'Features';
  return 'Application';
}

function getDescriptionForKey(key: string): string {
  const descriptions: Record<string, string> = {
    NODE_ENV: 'Environment mode (development, production, test)',
    PORT: 'Server port number',
    LOG_LEVEL: 'Logging level (error, warn, info, debug)',
    DATABASE_URL: 'PostgreSQL connection string',
    REDIS_URL: 'Redis connection string',
    NEO4J_URI: 'Neo4j connection URI',
    JWT_SECRET: 'JWT signing secret (min 32 chars)',
    ENCRYPTION_KEY: 'Data encryption key (32 chars)',
    OLLAMA_BASE_URL: 'Ollama API base URL',
    OPENAI_API_KEY: 'OpenAI API key',
    ANTHROPIC_API_KEY: 'Anthropic API key',
  };
  return descriptions[key] || '';
}

function isRequired(key: string): boolean {
  const required = ['DATABASE_URL', 'REDIS_URL', 'NEO4J_URI', 'JWT_SECRET', 'JWT_REFRESH_SECRET', 'ENCRYPTION_KEY'];
  return required.includes(key);
}

function isSensitive(key: string): boolean {
  const sensitivePatterns = ['PASSWORD', 'SECRET', 'KEY', 'TOKEN', 'DSN'];
  return sensitivePatterns.some(pattern => key.includes(pattern));
}

export default router;
