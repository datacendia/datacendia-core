/**
 * API Routes — Admin Settings
 *
 * Express route handler defining REST endpoints.
 * @module routes/admin-settings
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA - ADMIN SETTINGS API
// Manage environment variables, credentials, and system configuration
// =============================================================================

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';
import { Prisma } from '@prisma/client';
import { prisma } from '../config/database.js';
import { logger } from '../utils/logger.js';
import { errors } from '../middleware/errorHandler.js';
import { devAuth, requireRole } from '../middleware/auth.js';

const router = Router();

// All routes require admin authentication
router.use(devAuth);
router.use(requireRole('ADMIN', 'SUPER_ADMIN'));

// =============================================================================
// TYPES
// =============================================================================

interface SettingCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  settings: SettingDefinition[];
}

interface SettingDefinition {
  key: string;
  label: string;
  type: 'text' | 'password' | 'url' | 'number' | 'boolean' | 'select' | 'textarea';
  description?: string;
  required?: boolean;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  category: string;
  sensitive?: boolean;
}

// =============================================================================
// SETTINGS DEFINITIONS - What can be configured
// =============================================================================

const SETTINGS_DEFINITIONS: SettingCategory[] = [
  {
    id: 'ollama',
    name: 'Ollama LLM',
    description: 'Local AI model configuration',
    icon: '🧠',
    settings: [
      { key: 'OLLAMA_BASE_URL', label: 'Ollama Base URL', type: 'url', description: 'URL of your Ollama instance', placeholder: 'http://127.0.0.1:11434', category: 'ollama' },
      { key: 'OLLAMA_MODEL', label: 'Default Model', type: 'text', description: 'Primary model for general use', placeholder: 'qwen3:32b', category: 'ollama' },
      { key: 'OLLAMA_MODEL_LARGE', label: 'Large Model', type: 'text', description: 'Largest model for council/executive decisions', placeholder: 'llama3.3:70b', category: 'ollama' },
      { key: 'OLLAMA_MODEL_REASONING', label: 'Reasoning Model', type: 'text', description: 'Model for complex reasoning', placeholder: 'deepseek-r1:32b', category: 'ollama' },
      { key: 'OLLAMA_MODEL_CODER', label: 'Coding Model', type: 'text', description: 'Model for code generation', placeholder: 'qwen3-coder:30b', category: 'ollama' },
      { key: 'OLLAMA_MODEL_FAST', label: 'Fast Model', type: 'text', description: 'Model for quick responses', placeholder: 'llama3.2:3b', category: 'ollama' },
    ],
  },
  {
    id: 'database',
    name: 'Database',
    description: 'PostgreSQL and data storage',
    icon: '💾',
    settings: [
      { key: 'DATABASE_URL', label: 'PostgreSQL URL', type: 'password', description: 'Full database connection string', required: true, sensitive: true, category: 'database' },
      { key: 'REDIS_URL', label: 'Redis URL', type: 'url', description: 'Redis connection string', placeholder: 'redis://localhost:6379', category: 'database' },
      { key: 'NEO4J_URI', label: 'Neo4j URI', type: 'url', description: 'Neo4j bolt URI', placeholder: 'bolt://localhost:7687', category: 'database' },
      { key: 'NEO4J_USER', label: 'Neo4j User', type: 'text', placeholder: 'neo4j', category: 'database' },
      { key: 'NEO4J_PASSWORD', label: 'Neo4j Password', type: 'password', sensitive: true, category: 'database' },
    ],
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    description: 'CRM integration',
    icon: '☁️',
    settings: [
      { key: 'SALESFORCE_LOGIN_URL', label: 'Login URL', type: 'url', description: 'Salesforce login endpoint', placeholder: 'https://login.salesforce.com', category: 'salesforce' },
      { key: 'SALESFORCE_CLIENT_ID', label: 'Client ID', type: 'text', description: 'Connected App Client ID', category: 'salesforce' },
      { key: 'SALESFORCE_CLIENT_SECRET', label: 'Client Secret', type: 'password', sensitive: true, category: 'salesforce' },
      { key: 'SALESFORCE_USERNAME', label: 'Username', type: 'text', description: 'API user email', category: 'salesforce' },
      { key: 'SALESFORCE_PASSWORD', label: 'Password', type: 'password', sensitive: true, category: 'salesforce' },
      { key: 'SALESFORCE_SECURITY_TOKEN', label: 'Security Token', type: 'password', sensitive: true, category: 'salesforce' },
    ],
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Team communication',
    icon: '💬',
    settings: [
      { key: 'SLACK_BOT_TOKEN', label: 'Bot Token', type: 'password', description: 'xoxb-... bot token', placeholder: 'xoxb-...', sensitive: true, category: 'slack' },
      { key: 'SLACK_SIGNING_SECRET', label: 'Signing Secret', type: 'password', sensitive: true, category: 'slack' },
      { key: 'SLACK_APP_TOKEN', label: 'App Token', type: 'password', description: 'xapp-... token for Socket Mode', sensitive: true, category: 'slack' },
    ],
  },
  {
    id: 'email',
    name: 'Email (SMTP)',
    description: 'Email notifications',
    icon: '📧',
    settings: [
      { key: 'SMTP_HOST', label: 'SMTP Host', type: 'text', placeholder: 'smtp.gmail.com', category: 'email' },
      { key: 'SMTP_PORT', label: 'SMTP Port', type: 'number', placeholder: '587', category: 'email' },
      { key: 'SMTP_SECURE', label: 'Use SSL/TLS', type: 'boolean', category: 'email' },
      { key: 'SMTP_USER', label: 'Username', type: 'text', category: 'email' },
      { key: 'SMTP_PASSWORD', label: 'Password', type: 'password', sensitive: true, category: 'email' },
      { key: 'SMTP_FROM', label: 'From Address', type: 'text', placeholder: 'noreply@company.com', category: 'email' },
    ],
  },
  {
    id: 'aws',
    name: 'Amazon Web Services',
    description: 'AWS S3, Redshift, etc.',
    icon: '☁️',
    settings: [
      { key: 'AWS_ACCESS_KEY_ID', label: 'Access Key ID', type: 'text', category: 'aws' },
      { key: 'AWS_SECRET_ACCESS_KEY', label: 'Secret Access Key', type: 'password', sensitive: true, category: 'aws' },
      { key: 'AWS_REGION', label: 'Default Region', type: 'text', placeholder: 'us-east-1', category: 'aws' },
      { key: 'AWS_S3_BUCKET', label: 'S3 Bucket', type: 'text', category: 'aws' },
    ],
  },
  {
    id: 'azure',
    name: 'Microsoft Azure',
    description: 'Azure Blob, SQL, etc.',
    icon: '☁️',
    settings: [
      { key: 'AZURE_TENANT_ID', label: 'Tenant ID', type: 'text', category: 'azure' },
      { key: 'AZURE_CLIENT_ID', label: 'Client ID', type: 'text', category: 'azure' },
      { key: 'AZURE_CLIENT_SECRET', label: 'Client Secret', type: 'password', sensitive: true, category: 'azure' },
      { key: 'AZURE_STORAGE_ACCOUNT', label: 'Storage Account', type: 'text', category: 'azure' },
      { key: 'AZURE_STORAGE_KEY', label: 'Storage Key', type: 'password', sensitive: true, category: 'azure' },
    ],
  },
  {
    id: 'google',
    name: 'Google Cloud',
    description: 'BigQuery, GCS, etc.',
    icon: '☁️',
    settings: [
      { key: 'GOOGLE_PROJECT_ID', label: 'Project ID', type: 'text', category: 'google' },
      { key: 'GOOGLE_SERVICE_ACCOUNT_KEY', label: 'Service Account JSON', type: 'textarea', description: 'Paste the entire service account JSON', sensitive: true, category: 'google' },
    ],
  },
  {
    id: 'snowflake',
    name: 'Snowflake',
    description: 'Data warehouse',
    icon: '❄️',
    settings: [
      { key: 'SNOWFLAKE_ACCOUNT', label: 'Account', type: 'text', placeholder: 'xy12345.us-east-1', category: 'snowflake' },
      { key: 'SNOWFLAKE_USERNAME', label: 'Username', type: 'text', category: 'snowflake' },
      { key: 'SNOWFLAKE_PASSWORD', label: 'Password', type: 'password', sensitive: true, category: 'snowflake' },
      { key: 'SNOWFLAKE_WAREHOUSE', label: 'Warehouse', type: 'text', category: 'snowflake' },
      { key: 'SNOWFLAKE_DATABASE', label: 'Database', type: 'text', category: 'snowflake' },
      { key: 'SNOWFLAKE_SCHEMA', label: 'Schema', type: 'text', placeholder: 'PUBLIC', category: 'snowflake' },
    ],
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    description: 'CRM and marketing',
    icon: '🧡',
    settings: [
      { key: 'HUBSPOT_API_KEY', label: 'API Key', type: 'password', sensitive: true, category: 'hubspot' },
      { key: 'HUBSPOT_ACCESS_TOKEN', label: 'Access Token', type: 'password', description: 'OAuth access token (preferred)', sensitive: true, category: 'hubspot' },
    ],
  },
  {
    id: 'jira',
    name: 'Jira',
    description: 'Project management',
    icon: '📋',
    settings: [
      { key: 'JIRA_DOMAIN', label: 'Domain', type: 'text', placeholder: 'yourcompany.atlassian.net', category: 'jira' },
      { key: 'JIRA_EMAIL', label: 'Email', type: 'text', category: 'jira' },
      { key: 'JIRA_API_TOKEN', label: 'API Token', type: 'password', sensitive: true, category: 'jira' },
    ],
  },
  {
    id: 'tableau',
    name: 'Tableau',
    description: 'Business intelligence',
    icon: '📊',
    settings: [
      { key: 'TABLEAU_SERVER_URL', label: 'Server URL', type: 'url', placeholder: 'https://yourserver.tableau.com', category: 'tableau' },
      { key: 'TABLEAU_SITE_NAME', label: 'Site Name', type: 'text', category: 'tableau' },
      { key: 'TABLEAU_TOKEN_NAME', label: 'Token Name', type: 'text', category: 'tableau' },
      { key: 'TABLEAU_TOKEN_VALUE', label: 'Token Value', type: 'password', sensitive: true, category: 'tableau' },
    ],
  },
  {
    id: 'teams',
    name: 'Microsoft Teams',
    description: 'Team communication',
    icon: '💜',
    settings: [
      { key: 'TEAMS_WEBHOOK_URL', label: 'Webhook URL', type: 'url', description: 'Incoming webhook URL', category: 'teams' },
    ],
  },
  {
    id: 'security',
    name: 'Security',
    description: 'JWT and authentication',
    icon: '🔐',
    settings: [
      { key: 'JWT_SECRET', label: 'JWT Secret', type: 'password', required: true, sensitive: true, category: 'security' },
      { key: 'JWT_REFRESH_SECRET', label: 'JWT Refresh Secret', type: 'password', required: true, sensitive: true, category: 'security' },
      { key: 'JWT_EXPIRES_IN', label: 'Token Expiry', type: 'text', placeholder: '1h', category: 'security' },
      { key: 'JWT_REFRESH_EXPIRES_IN', label: 'Refresh Token Expiry', type: 'text', placeholder: '30d', category: 'security' },
    ],
  },
];

// =============================================================================
// ENV FILE PATH
// =============================================================================

const ENV_FILE_PATH = path.resolve(process.cwd(), '.env');

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

async function readEnvFile(): Promise<Record<string, string>> {
  try {
    const content = await fs.readFile(ENV_FILE_PATH, 'utf-8');
    const env: Record<string, string> = {};
    
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      
      const eqIndex = trimmed.indexOf('=');
      if (eqIndex === -1) continue;
      
      const key = trimmed.substring(0, eqIndex).trim();
      let value = trimmed.substring(eqIndex + 1).trim();
      
      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      
      env[key] = value;
    }
    
    return env;
  } catch (error) {
    logger.warn('Could not read .env file:', error);
    return {};
  }
}

async function writeEnvFile(env: Record<string, string>): Promise<void> {
  // Read existing file to preserve comments and structure
  let existingContent = '';
  try {
    existingContent = await fs.readFile(ENV_FILE_PATH, 'utf-8');
  } catch {
    // File doesn't exist, start fresh
  }
  
  const existingLines = existingContent.split('\n');
  const updatedKeys = new Set<string>();
  const outputLines: string[] = [];
  
  // Update existing lines
  for (const line of existingLines) {
    const trimmed = line.trim();
    
    // Keep comments and empty lines
    if (!trimmed || trimmed.startsWith('#')) {
      outputLines.push(line);
      continue;
    }
    
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) {
      outputLines.push(line);
      continue;
    }
    
    const key = trimmed.substring(0, eqIndex).trim();
    
    if (key in env) {
      // Update this key
      const value = env[key];
      // Quote if contains special characters
      const needsQuotes = value.includes(' ') || value.includes('#') || value.includes('=');
      outputLines.push(`${key}=${needsQuotes ? `"${value}"` : value}`);
      updatedKeys.add(key);
    } else {
      // Keep existing line
      outputLines.push(line);
      updatedKeys.add(key);
    }
  }
  
  // Add new keys that weren't in the file
  const newKeys = Object.keys(env).filter(k => !updatedKeys.has(k));
  if (newKeys.length > 0) {
    outputLines.push('');
    outputLines.push('# Added by Datacendia Admin');
    for (const key of newKeys) {
      const value = env[key];
      const needsQuotes = value.includes(' ') || value.includes('#') || value.includes('=');
      outputLines.push(`${key}=${needsQuotes ? `"${value}"` : value}`);
    }
  }
  
  await fs.writeFile(ENV_FILE_PATH, outputLines.join('\n'), 'utf-8');
  logger.info('Environment file updated');
}

function maskSensitiveValue(value: string): string {
  if (!value || value.length < 8) return '••••••••';
  return value.substring(0, 4) + '••••••••' + value.substring(value.length - 4);
}

// =============================================================================
// ENDPOINTS
// =============================================================================

/**
 * GET /api/v1/admin/settings/categories
 * Get all setting categories and their definitions
 */
router.get('/categories', async (req: Request, res: Response) => {
  res.json({
    success: true,
    data: SETTINGS_DEFINITIONS.map(cat => ({
      id: cat.id,
      name: cat.name,
      description: cat.description,
      icon: cat.icon,
      settingsCount: cat.settings.length,
    })),
  });
});

/**
 * GET /api/v1/admin/settings/category/:categoryId
 * Get settings for a specific category
 */
router.get('/category/:categoryId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { categoryId } = req.params;
    
    const category = SETTINGS_DEFINITIONS.find(c => c.id === categoryId);
    if (!category) {
      throw errors.notFound('Setting category');
    }
    
    // Read current values from .env
    const currentEnv = await readEnvFile();
    
    // Return settings with current values (masked for sensitive)
    const settingsWithValues = category.settings.map(setting => ({
      ...setting,
      value: setting.sensitive 
        ? (currentEnv[setting.key] ? maskSensitiveValue(currentEnv[setting.key]) : '')
        : (currentEnv[setting.key] || ''),
      hasValue: !!currentEnv[setting.key],
    }));
    
    res.json({
      success: true,
      data: {
        ...category,
        settings: settingsWithValues,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/admin/settings
 * Get all settings with current values
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const currentEnv = await readEnvFile();
    
    const categoriesWithValues = SETTINGS_DEFINITIONS.map(category => ({
      ...category,
      settings: category.settings.map(setting => ({
        ...setting,
        value: setting.sensitive 
          ? (currentEnv[setting.key] ? maskSensitiveValue(currentEnv[setting.key]) : '')
          : (currentEnv[setting.key] || ''),
        hasValue: !!currentEnv[setting.key],
      })),
    }));
    
    res.json({
      success: true,
      data: categoriesWithValues,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/v1/admin/settings
 * Update settings
 */
const updateSettingsSchema = z.object({
  settings: z.record(z.string()),
});

router.put('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { settings } = updateSettingsSchema.parse(req.body);
    
    // Validate that all keys are in our definitions
    const allKeys = new Set(
      SETTINGS_DEFINITIONS.flatMap(c => c.settings.map(s => s.key))
    );
    
    const invalidKeys = Object.keys(settings).filter(k => !allKeys.has(k));
    if (invalidKeys.length > 0) {
      throw errors.badRequest(`Invalid setting keys: ${invalidKeys.join(', ')}`);
    }
    
    // Read current env
    const currentEnv = await readEnvFile();
    
    // Merge new settings (skip empty values for sensitive fields to preserve existing)
    const updatedEnv = { ...currentEnv };
    for (const [key, value] of Object.entries(settings)) {
      const setting = SETTINGS_DEFINITIONS
        .flatMap(c => c.settings)
        .find(s => s.key === key);
      
      // Skip if sensitive and value is masked or empty (preserve existing)
      if (setting?.sensitive && (value.includes('••••') || value === '')) {
        continue;
      }
      
      updatedEnv[key] = value;
    }
    
    // Write updated env
    await writeEnvFile(updatedEnv);
    
    // Audit log
    await prisma.audit_logs.create({
      data: {
        id: crypto.randomUUID(),
        organization_id: req.organizationId ?? 'system',
        user_id: req.user!.id,
        action: 'settings.update',
        resource_type: 'system_settings',
        details: {
          updatedKeys: Object.keys(settings).filter(k => {
            const s = SETTINGS_DEFINITIONS.flatMap(c => c.settings).find(s => s.key === k);
            return !s?.sensitive; // Only log non-sensitive key names
          }),
          sensitiveKeysUpdated: Object.keys(settings).filter(k => {
            const s = SETTINGS_DEFINITIONS.flatMap(c => c.settings).find(s => s.key === k);
            return s?.sensitive && !settings[k].includes('••••');
          }).length,
        } as Prisma.InputJsonValue,
      },
    });
    
    res.json({
      success: true,
      message: 'Settings updated successfully. Some changes may require a server restart.',
      data: {
        updatedCount: Object.keys(settings).length,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/v1/admin/settings/:key
 * Update a single setting
 */
const updateSingleSettingSchema = z.object({
  value: z.string(),
});

router.put('/:key', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { key } = req.params;
    const { value } = updateSingleSettingSchema.parse(req.body);
    
    // Find the setting definition
    const setting = SETTINGS_DEFINITIONS
      .flatMap(c => c.settings)
      .find(s => s.key === key);
    
    if (!setting) {
      throw errors.badRequest(`Unknown setting key: ${key}`);
    }
    
    // Don't update if value is masked
    if (setting.sensitive && value.includes('••••')) {
      return res.json({
        success: true,
        message: 'Setting unchanged (masked value provided)',
      });
    }
    
    // Read and update
    const currentEnv = await readEnvFile();
    currentEnv[key] = value;
    await writeEnvFile(currentEnv);
    
    // Audit log
    await prisma.audit_logs.create({
      data: {
        id: crypto.randomUUID(),
        organization_id: req.organizationId ?? 'system',
        user_id: req.user!.id,
        action: 'settings.update',
        resource_type: 'system_settings',
        resource_id: key,
        details: {
          key,
          sensitive: setting.sensitive,
        } as Prisma.InputJsonValue,
      },
    });
    
    res.json({
      success: true,
      message: `Setting ${key} updated successfully`,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/admin/settings/test/:integrationId
 * Test an integration connection using current settings
 */
router.post('/test/:integrationId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { integrationId } = req.params;
    
    // Import connectors
    const { testDataSourceConnection } = await import('../services/connectors/index.js');
    
    // Read current env
    const currentEnv = await readEnvFile();
    
    // Map integration ID to connector type and extract config
    const integrationConfigs: Record<string, { type: string; config: Record<string, unknown>; credentials: Record<string, string | undefined> }> = {
      salesforce: {
        type: 'SALESFORCE',
        config: {
          loginUrl: currentEnv.SALESFORCE_LOGIN_URL || 'https://login.salesforce.com',
          sandbox: currentEnv.SALESFORCE_LOGIN_URL?.includes('test.salesforce.com'),
        },
        credentials: {
          clientId: currentEnv.SALESFORCE_CLIENT_ID,
          clientSecret: currentEnv.SALESFORCE_CLIENT_SECRET,
          username: currentEnv.SALESFORCE_USERNAME,
          password: currentEnv.SALESFORCE_PASSWORD,
          securityToken: currentEnv.SALESFORCE_SECURITY_TOKEN,
        },
      },
      slack: {
        type: 'SLACK',
        config: {},
        credentials: {
          botToken: currentEnv.SLACK_BOT_TOKEN,
        },
      },
      email: {
        type: 'EMAIL',
        config: {
          host: currentEnv.SMTP_HOST || 'smtp.gmail.com',
          port: parseInt(currentEnv.SMTP_PORT || '587'),
          secure: currentEnv.SMTP_SECURE === 'true',
        },
        credentials: {
          username: currentEnv.SMTP_USER,
          password: currentEnv.SMTP_PASSWORD,
        },
      },
      hubspot: {
        type: 'HUBSPOT',
        config: {},
        credentials: {
          apiKey: currentEnv.HUBSPOT_API_KEY,
          accessToken: currentEnv.HUBSPOT_ACCESS_TOKEN,
        },
      },
      snowflake: {
        type: 'SNOWFLAKE',
        config: {
          account: currentEnv.SNOWFLAKE_ACCOUNT,
          warehouse: currentEnv.SNOWFLAKE_WAREHOUSE,
          database: currentEnv.SNOWFLAKE_DATABASE,
          schema: currentEnv.SNOWFLAKE_SCHEMA,
        },
        credentials: {
          username: currentEnv.SNOWFLAKE_USERNAME,
          password: currentEnv.SNOWFLAKE_PASSWORD,
        },
      },
      jira: {
        type: 'JIRA',
        config: {
          domain: currentEnv.JIRA_DOMAIN,
        },
        credentials: {
          email: currentEnv.JIRA_EMAIL,
          apiToken: currentEnv.JIRA_API_TOKEN,
        },
      },
      tableau: {
        type: 'TABLEAU',
        config: {
          serverUrl: currentEnv.TABLEAU_SERVER_URL,
          siteName: currentEnv.TABLEAU_SITE_NAME,
        },
        credentials: {
          tokenName: currentEnv.TABLEAU_TOKEN_NAME,
          tokenValue: currentEnv.TABLEAU_TOKEN_VALUE,
        },
      },
      teams: {
        type: 'TEAMS',
        config: {
          webhookUrl: currentEnv.TEAMS_WEBHOOK_URL,
        },
        credentials: {},
      },
      neo4j: {
        type: 'NEO4J',
        config: {
          uri: currentEnv.NEO4J_URI,
        },
        credentials: {
          username: currentEnv.NEO4J_USER,
          password: currentEnv.NEO4J_PASSWORD,
        },
      },
      redis: {
        type: 'REDIS',
        config: {
          host: currentEnv.REDIS_URL?.replace('redis://', '').split(':')[0] || 'localhost',
          port: parseInt(currentEnv.REDIS_URL?.split(':').pop() || '6379'),
        },
        credentials: {},
      },
    };
    
    const integrationConfig = integrationConfigs[integrationId];
    if (!integrationConfig) {
      throw errors.badRequest(`Unknown integration: ${integrationId}`);
    }
    
    const result = await testDataSourceConnection(
      integrationConfig.type,
      integrationConfig.config,
      integrationConfig.credentials
    );
    
    res.json({
      success: result.success,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/admin/settings/env
 * Get raw .env file (for download/backup)
 */
router.get('/env', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const content = await fs.readFile(ENV_FILE_PATH, 'utf-8');
    
    // Mask sensitive values
    const lines = content.split('\n').map(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return line;
      
      const eqIndex = trimmed.indexOf('=');
      if (eqIndex === -1) return line;
      
      const key = trimmed.substring(0, eqIndex).trim();
      const value = trimmed.substring(eqIndex + 1).trim();
      
      // Check if this is a sensitive key
      const setting = SETTINGS_DEFINITIONS
        .flatMap(c => c.settings)
        .find(s => s.key === key);
      
      if (setting?.sensitive && value) {
        return `${key}=${maskSensitiveValue(value)}`;
      }
      
      return line;
    });
    
    res.json({
      success: true,
      data: {
        content: lines.join('\n'),
        path: ENV_FILE_PATH,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
