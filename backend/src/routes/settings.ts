// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// SETTINGS API ROUTES
// Organization/Tenant settings endpoints for client admins
// =============================================================================

import { Router, Request, Response } from 'express';
import { userManagementService } from '../services/admin/index.js';
import { tenantService } from '../services/admin/TenantService.js';
import { logger } from '../utils/logger.js';

const router = Router();

// Middleware to get tenant from auth context (simplified for demo)
const getTenantId = (req: Request): string => {
  return req.headers['x-tenant-id'] as string || 'tenant_acme_2024';
};

// =============================================================================
// ORGANIZATION
// =============================================================================

router.get('/organization', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const tenant = await tenantService.getTenant(tenantId);
    if (!tenant) {
      return res.status(404).json({ error: 'Organization not found' });
    }
    res.json({
      id: tenant.id,
      name: tenant.name,
      slug: tenant.slug,
      plan: tenant.plan,
      settings: tenant.settings,
      metadata: tenant.metadata,
      userCount: tenant.userCount,
      userLimit: tenant.userLimit,
    });
  } catch (error) {
    logger.error('Settings API: Get organization error', error);
    res.status(500).json({ error: 'Failed to get organization' });
  }
});

router.patch('/organization', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const { name, settings, metadata } = req.body;
    const tenant = await tenantService.updateTenant(tenantId, {
      name,
      settings,
      metadata,
    });
    if (!tenant) {
      return res.status(404).json({ error: 'Organization not found' });
    }
    res.json(tenant);
  } catch (error) {
    logger.error('Settings API: Update organization error', error);
    res.status(500).json({ error: 'Failed to update organization' });
  }
});

// =============================================================================
// USERS
// =============================================================================

router.get('/users', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const { role, status, search } = req.query;
    const users = await userManagementService.listUsers(tenantId, {
      role: role as any,
      status: status as any,
      search: search as string,
    });
    const metrics = userManagementService.getUserMetrics(tenantId);
    res.json({ 
      users, 
      total: users.length,
      metrics,
    });
  } catch (error) {
    logger.error('Settings API: List users error', error);
    res.status(500).json({ error: 'Failed to list users' });
  }
});

router.post('/users', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const { email, name, role, department, title } = req.body;
    const user = await userManagementService.createUser(tenantId, {
      email,
      name,
      role,
      department,
      title,
      invitedBy: 'current_user', // Would get from auth
    });
    res.status(201).json(user);
  } catch (error) {
    logger.error('Settings API: Create user error', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

router.get('/users/:id', async (req: Request, res: Response) => {
  try {
    const user = await userManagementService.getUser(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    logger.error('Settings API: Get user error', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

router.patch('/users/:id', async (req: Request, res: Response) => {
  try {
    const user = await userManagementService.updateUser(req.params.id, req.body);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    logger.error('Settings API: Update user error', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

router.delete('/users/:id', async (req: Request, res: Response) => {
  try {
    const success = await userManagementService.deleteUser(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ success: true });
  } catch (error) {
    logger.error('Settings API: Delete user error', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

router.post('/users/:id/resend-invite', async (req: Request, res: Response) => {
  try {
    // Would send email invitation
    res.json({ success: true, message: 'Invitation resent' });
  } catch (error) {
    logger.error('Settings API: Resend invite error', error);
    res.status(500).json({ error: 'Failed to resend invite' });
  }
});

// =============================================================================
// TEAMS
// =============================================================================

router.get('/teams', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const teams = await userManagementService.listTeams(tenantId);
    res.json({ teams, total: teams.length });
  } catch (error) {
    logger.error('Settings API: List teams error', error);
    res.status(500).json({ error: 'Failed to list teams' });
  }
});

router.post('/teams', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const { name, description, leaderId, memberIds, permissions } = req.body;
    const team = await userManagementService.createTeam(tenantId, {
      name,
      description,
      leaderId,
      memberIds,
      permissions,
    });
    res.status(201).json(team);
  } catch (error) {
    logger.error('Settings API: Create team error', error);
    res.status(500).json({ error: 'Failed to create team' });
  }
});

router.get('/teams/:id', async (req: Request, res: Response) => {
  try {
    const team = await userManagementService.getTeam(req.params.id);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }
    res.json(team);
  } catch (error) {
    logger.error('Settings API: Get team error', error);
    res.status(500).json({ error: 'Failed to get team' });
  }
});

router.patch('/teams/:id', async (req: Request, res: Response) => {
  try {
    const team = await userManagementService.updateTeam(req.params.id, req.body);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }
    res.json(team);
  } catch (error) {
    logger.error('Settings API: Update team error', error);
    res.status(500).json({ error: 'Failed to update team' });
  }
});

router.delete('/teams/:id', async (req: Request, res: Response) => {
  try {
    const success = await userManagementService.deleteTeam(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Team not found' });
    }
    res.json({ success: true });
  } catch (error) {
    logger.error('Settings API: Delete team error', error);
    res.status(500).json({ error: 'Failed to delete team' });
  }
});

router.post('/teams/:id/members', async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const team = await userManagementService.addTeamMember(req.params.id, userId);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }
    res.json(team);
  } catch (error) {
    logger.error('Settings API: Add team member error', error);
    res.status(500).json({ error: 'Failed to add team member' });
  }
});

router.delete('/teams/:id/members/:userId', async (req: Request, res: Response) => {
  try {
    const team = await userManagementService.removeTeamMember(req.params.id, req.params.userId);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }
    res.json(team);
  } catch (error) {
    logger.error('Settings API: Remove team member error', error);
    res.status(500).json({ error: 'Failed to remove team member' });
  }
});

// =============================================================================
// ROLES
// =============================================================================

router.get('/roles', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const roles = await userManagementService.listRoles(tenantId);
    res.json({ roles, total: roles.length });
  } catch (error) {
    logger.error('Settings API: List roles error', error);
    res.status(500).json({ error: 'Failed to list roles' });
  }
});

router.post('/roles', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const { name, description, permissions } = req.body;
    const role = await userManagementService.createRole(tenantId, {
      name,
      description,
      permissions,
    });
    res.status(201).json(role);
  } catch (error) {
    logger.error('Settings API: Create role error', error);
    res.status(500).json({ error: 'Failed to create role' });
  }
});

router.delete('/roles/:id', async (req: Request, res: Response) => {
  try {
    const success = await userManagementService.deleteRole(req.params.id);
    if (!success) {
      return res.status(400).json({ error: 'Cannot delete system role' });
    }
    res.json({ success: true });
  } catch (error) {
    logger.error('Settings API: Delete role error', error);
    res.status(500).json({ error: 'Failed to delete role' });
  }
});

// =============================================================================
// API KEYS
// =============================================================================

router.get('/api-keys', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const apiKeys = await userManagementService.listApiKeys(tenantId);
    res.json({ apiKeys, total: apiKeys.length });
  } catch (error) {
    logger.error('Settings API: List API keys error', error);
    res.status(500).json({ error: 'Failed to list API keys' });
  }
});

router.post('/api-keys', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const userId = 'current_user'; // Would get from auth
    const { name, permissions, expiresAt } = req.body;
    
    const result = await userManagementService.createApiKey(tenantId, userId, {
      name,
      permissions,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
    });
    
    // Return full key only once
    res.status(201).json({
      apiKey: result.apiKey,
      fullKey: result.fullKey,
      warning: 'Save this key now. It will not be shown again.',
    });
  } catch (error) {
    logger.error('Settings API: Create API key error', error);
    res.status(500).json({ error: 'Failed to create API key' });
  }
});

router.delete('/api-keys/:id', async (req: Request, res: Response) => {
  try {
    const success = await userManagementService.revokeApiKey(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'API key not found' });
    }
    res.json({ success: true });
  } catch (error) {
    logger.error('Settings API: Revoke API key error', error);
    res.status(500).json({ error: 'Failed to revoke API key' });
  }
});

// =============================================================================
// BILLING (Simplified)
// =============================================================================

router.get('/billing', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const tenant = await tenantService.getTenant(tenantId);
    if (!tenant) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    res.json({
      plan: tenant.plan,
      mrr: tenant.mrr,
      userCount: tenant.userCount,
      userLimit: tenant.userLimit,
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      paymentMethod: {
        type: 'card',
        last4: '4242',
        brand: 'Visa',
        expiryMonth: 12,
        expiryYear: 2026,
      },
      invoices: [
        { id: 'inv_001', date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), amount: tenant.mrr, status: 'paid' },
        { id: 'inv_002', date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), amount: tenant.mrr, status: 'paid' },
        { id: 'inv_003', date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), amount: tenant.mrr, status: 'paid' },
      ],
    });
  } catch (error) {
    logger.error('Settings API: Get billing error', error);
    res.status(500).json({ error: 'Failed to get billing' });
  }
});

// =============================================================================
// INTEGRATIONS
// =============================================================================

router.get('/integrations', async (req: Request, res: Response) => {
  try {
    // Return available and configured integrations
    res.json({
      available: [
        { id: 'slack', name: 'Slack', description: 'Send deliberation results to Slack', icon: '💬', category: 'communication' },
        { id: 'teams', name: 'Microsoft Teams', description: 'Teams integration', icon: '👥', category: 'communication' },
        { id: 'jira', name: 'Jira', description: 'Create issues from action items', icon: '📋', category: 'project' },
        { id: 'salesforce', name: 'Salesforce', description: 'CRM integration', icon: '☁️', category: 'crm' },
        { id: 'hubspot', name: 'HubSpot', description: 'Marketing automation', icon: '🎯', category: 'crm' },
        { id: 'snowflake', name: 'Snowflake', description: 'Data warehouse', icon: '❄️', category: 'data' },
        { id: 'bigquery', name: 'BigQuery', description: 'Google analytics', icon: '📊', category: 'data' },
      ],
      configured: [
        { id: 'slack', status: 'active', configuredAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
      ],
    });
  } catch (error) {
    logger.error('Settings API: Get integrations error', error);
    res.status(500).json({ error: 'Failed to get integrations' });
  }
});

// =============================================================================
// PREFERENCES
// =============================================================================

router.get('/preferences', async (req: Request, res: Response) => {
  try {
    res.json({
      notifications: {
        email: true,
        slack: true,
        deliberationComplete: true,
        weeklyDigest: true,
        alertsOnly: false,
      },
      display: {
        theme: 'light',
        language: 'en',
        timezone: 'America/New_York',
        dateFormat: 'MM/DD/YYYY',
      },
      council: {
        defaultMode: 'war-room',
        autoSave: true,
        streamResponses: true,
        showConfidenceScores: true,
      },
    });
  } catch (error) {
    logger.error('Settings API: Get preferences error', error);
    res.status(500).json({ error: 'Failed to get preferences' });
  }
});

router.patch('/preferences', async (req: Request, res: Response) => {
  try {
    // Would save to database
    res.json({ success: true, ...req.body });
  } catch (error) {
    logger.error('Settings API: Update preferences error', error);
    res.status(500).json({ error: 'Failed to update preferences' });
  }
});

// =============================================================================
// SECURITY
// =============================================================================

router.get('/security', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const tenant = await tenantService.getTenant(tenantId);

    res.json({
      sso: {
        enabled: tenant?.settings.features.ssoEnabled || false,
        provider: null,
        domain: null,
      },
      mfa: {
        enforced: false,
        enabledUsers: 2,
        totalUsers: 5,
      },
      sessions: {
        maxConcurrent: 5,
        sessionTimeout: 24, // hours
        requireReauth: false,
      },
      ipWhitelist: {
        enabled: false,
        addresses: [],
      },
      auditLog: {
        enabled: true,
        retentionDays: 90,
      },
    });
  } catch (error) {
    logger.error('Settings API: Get security error', error);
    res.status(500).json({ error: 'Failed to get security settings' });
  }
});

router.patch('/security', async (req: Request, res: Response) => {
  try {
    // Would save to database
    res.json({ success: true, ...req.body });
  } catch (error) {
    logger.error('Settings API: Update security error', error);
    res.status(500).json({ error: 'Failed to update security settings' });
  }
});

export default router;
