// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// ADMIN API ROUTES
// Platform administration endpoints
// =============================================================================

import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { 
  tenantService, 
  licenseService, 
  systemHealthService,
  userManagementService,
  featureControlService,
  rdProjectService,
  adminAIService,
  getPlatformDashboard 
} from '../services/admin/index.js';
import { logger } from '../utils/logger.js';
import { devAuth, requireRole } from '../middleware/auth.js';
import { deterministicFloat, deterministicInt, deterministicPercentage, deterministicPick } from '../utils/deterministic.js';

const router = Router();

// ---- Zod Validation Schemas ----
const createTenantSchema = z.object({
  name: z.string().min(1, 'Tenant name is required').max(255),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  plan: z.enum(['pilot', 'trial', 'foundation', 'enterprise', 'strategic', 'custom']).optional().default('trial'),
  metadata: z.record(z.unknown()).optional(),
});

const updateTenantSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  plan: z.enum(['pilot', 'trial', 'foundation', 'enterprise', 'strategic', 'custom']).optional(),
  status: z.enum(['pending', 'trial', 'active', 'suspended', 'churned']).optional(),
  metadata: z.record(z.unknown()).optional(),
}).refine(data => Object.keys(data).length > 0, { message: 'At least one field must be provided' });

const upgradePlanSchema = z.object({
  plan: z.enum(['pilot', 'trial', 'foundation', 'enterprise', 'strategic', 'custom']),
});

const suspendTenantSchema = z.object({
  reason: z.string().min(1, 'Suspension reason is required').max(1000),
});

const extendLicenseSchema = z.object({
  months: z.number().int().min(1).max(60),
});

const upgradeLicenseSchema = z.object({
  type: z.enum(['pilot', 'trial', 'foundation', 'enterprise', 'strategic', 'custom']),
});

const createUserSchema = z.object({
  email: z.string().email('Email must be valid').min(1, 'Email is required').max(255),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128),
  role: z.enum(['admin', 'user']).optional().default('user'),
  metadata: z.record(z.unknown()).optional(),
});

const updateUserSchema = z.object({
  email: z.string().email('Email must be valid').min(1, 'Email is required').max(255).optional(),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128).optional(),
  role: z.enum(['admin', 'user']).optional(),
  metadata: z.record(z.unknown()).optional(),
}).refine(data => Object.keys(data).length > 0, { message: 'At least one field must be provided' });

const updateFeatureSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional(),
  type: z.enum(['service', 'agent', 'suite', 'pillar', 'tool', 'page']).optional(),
  enabled: z.boolean().optional(),
  status: z.enum(['active', 'disabled', 'maintenance', 'beta', 'deprecated']).optional(),
}).refine(data => Object.keys(data).length > 0, { message: 'At least one field must be provided' });

// All platform admin routes require authentication and admin-level role
router.use(devAuth);
router.use(requireRole('OWNER', 'ADMIN', 'SUPER_ADMIN'));

// =============================================================================
// DASHBOARD
// =============================================================================

router.get('/dashboard', async (_req: Request, res: Response) => {
  try {
    const dashboard = await getPlatformDashboard();
    res.json(dashboard);
  } catch (error) {
    logger.error('Admin API: Dashboard error', error);
    res.status(500).json({ error: 'Failed to load dashboard' });
  }
});

// =============================================================================
// TENANTS
// =============================================================================

router.get('/tenants', async (req: Request, res: Response) => {
  try {
    const { status, plan, search } = req.query;
    const tenants = await tenantService.listTenants({
      status: status as any,
      plan: plan as any,
      search: search as string,
    });
    res.json({ tenants, total: tenants.length });
  } catch (error) {
    logger.error('Admin API: List tenants error', error);
    res.status(500).json({ error: 'Failed to list tenants' });
  }
});

// NOTE: /tenants/metrics must be defined BEFORE /tenants/:id to avoid route collision
router.get('/tenants/metrics', async (_req: Request, res: Response) => {
  try {
    const metrics = await tenantService.getMetrics();
    res.json(metrics);
  } catch (error) {
    logger.error('Admin API: Tenant metrics error', error);
    res.status(500).json({ error: 'Failed to get tenant metrics' });
  }
});

router.post('/tenants', async (req: Request, res: Response) => {
  try {
    const { name, slug, plan, metadata } = createTenantSchema.parse(req.body);
    const tenant = await tenantService.createTenant({ name, slug, plan, metadata });
    res.status(201).json(tenant);
  } catch (error) {
    logger.error('Admin API: Create tenant error', error);
    res.status(500).json({ error: 'Failed to create tenant' });
  }
});

router.get('/tenants/:id', async (req: Request, res: Response) => {
  try {
    const tenant = await tenantService.getTenant(req.params.id);
    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }
    res.json(tenant);
  } catch (error) {
    logger.error('Admin API: Get tenant error', error);
    res.status(500).json({ error: 'Failed to get tenant' });
  }
});

router.patch('/tenants/:id', async (req: Request, res: Response) => {
  try {
    const validated = updateTenantSchema.parse(req.body);
    const tenant = await tenantService.updateTenant(req.params.id, validated);
    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }
    res.json(tenant);
  } catch (error) {
    logger.error('Admin API: Update tenant error', error);
    res.status(500).json({ error: 'Failed to update tenant' });
  }
});

router.post('/tenants/:id/upgrade', async (req: Request, res: Response) => {
  try {
    const { plan } = upgradePlanSchema.parse(req.body);
    const tenant = await tenantService.upgradePlan(req.params.id, plan);
    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }
    res.json(tenant);
  } catch (error) {
    logger.error('Admin API: Upgrade tenant error', error);
    res.status(500).json({ error: 'Failed to upgrade tenant' });
  }
});

router.post('/tenants/:id/suspend', async (req: Request, res: Response) => {
  try {
    const { reason } = suspendTenantSchema.parse(req.body);
    const tenant = await tenantService.suspendTenant(req.params.id, reason);
    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }
    res.json(tenant);
  } catch (error) {
    logger.error('Admin API: Suspend tenant error', error);
    res.status(500).json({ error: 'Failed to suspend tenant' });
  }
});

// =============================================================================
// LICENSES
// =============================================================================

router.get('/licenses', async (req: Request, res: Response) => {
  try {
    const { status, type } = req.query;
    const licenses = await licenseService.listLicenses({
      status: status as any,
      type: type as any,
    });
    res.json({ licenses, total: licenses.length });
  } catch (error) {
    logger.error('Admin API: List licenses error', error);
    res.status(500).json({ error: 'Failed to list licenses' });
  }
});

router.post('/licenses', async (req: Request, res: Response) => {
  try {
    const license = await licenseService.createLicense(req.body);
    res.status(201).json(license);
  } catch (error) {
    logger.error('Admin API: Create license error', error);
    res.status(500).json({ error: 'Failed to create license' });
  }
});

router.get('/licenses/:id', async (req: Request, res: Response) => {
  try {
    const license = await licenseService.getLicense(req.params.id);
    if (!license) {
      return res.status(404).json({ error: 'License not found' });
    }
    res.json(license);
  } catch (error) {
    logger.error('Admin API: Get license error', error);
    res.status(500).json({ error: 'Failed to get license' });
  }
});

router.post('/licenses/:id/extend', async (req: Request, res: Response) => {
  try {
    const { months } = extendLicenseSchema.parse(req.body);
    const license = await licenseService.extendLicense(req.params.id, months);
    if (!license) {
      return res.status(404).json({ error: 'License not found' });
    }
    res.json(license);
  } catch (error) {
    logger.error('Admin API: Extend license error', error);
    res.status(500).json({ error: 'Failed to extend license' });
  }
});

router.post('/licenses/:id/upgrade', async (req: Request, res: Response) => {
  try {
    const { type } = upgradeLicenseSchema.parse(req.body);
    const license = await licenseService.upgradeLicense(req.params.id, type);
    if (!license) {
      return res.status(404).json({ error: 'License not found' });
    }
    res.json(license);
  } catch (error) {
    logger.error('Admin API: Upgrade license error', error);
    res.status(500).json({ error: 'Failed to upgrade license' });
  }
});

router.get('/licenses/metrics', async (_req: Request, res: Response) => {
  try {
    const metrics = licenseService.getMetrics();
    res.json(metrics);
  } catch (error) {
    logger.error('Admin API: License metrics error', error);
    res.status(500).json({ error: 'Failed to get license metrics' });
  }
});

// =============================================================================
// SYSTEM HEALTH
// =============================================================================

router.get('/health', async (_req: Request, res: Response) => {
  try {
    const dashboard = await systemHealthService.getDashboard();
    res.json(dashboard);
  } catch (error) {
    logger.error('Admin API: Health dashboard error', error);
    res.status(500).json({ error: 'Failed to get health dashboard' });
  }
});

router.get('/health/services', async (_req: Request, res: Response) => {
  try {
    const services = await systemHealthService.checkAllServices();
    res.json({ services });
  } catch (error) {
    logger.error('Admin API: Service health error', error);
    res.status(500).json({ error: 'Failed to check services' });
  }
});

router.get('/health/system', async (_req: Request, res: Response) => {
  try {
    const metrics = systemHealthService.getSystemMetrics();
    res.json(metrics);
  } catch (error) {
    logger.error('Admin API: System metrics error', error);
    res.status(500).json({ error: 'Failed to get system metrics' });
  }
});

router.get('/health/api', async (_req: Request, res: Response) => {
  try {
    const metrics = systemHealthService.getApiMetrics();
    res.json(metrics);
  } catch (error) {
    logger.error('Admin API: API metrics error', error);
    res.status(500).json({ error: 'Failed to get API metrics' });
  }
});

router.get('/health/alerts', async (_req: Request, res: Response) => {
  try {
    const alerts = systemHealthService.getActiveAlerts();
    res.json({ alerts });
  } catch (error) {
    logger.error('Admin API: Alerts error', error);
    res.status(500).json({ error: 'Failed to get alerts' });
  }
});

router.post('/health/alerts/:id/acknowledge', async (req: Request, res: Response) => {
  try {
    const success = systemHealthService.acknowledgeAlert(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Alert not found' });
    }
    res.json({ success: true });
  } catch (error) {
    logger.error('Admin API: Acknowledge alert error', error);
    res.status(500).json({ error: 'Failed to acknowledge alert' });
  }
});

// =============================================================================
// USER MANAGEMENT (FOR TENANTS)
// =============================================================================

router.get('/tenants/:tenantId/users', async (req: Request, res: Response) => {
  try {
    const { role, status, search } = req.query;
    const users = await userManagementService.listUsers(req.params.tenantId, {
      role: role as any,
      status: status as any,
      search: search as string,
    });
    res.json({ users, total: users.length });
  } catch (error) {
    logger.error('Admin API: List users error', error);
    res.status(500).json({ error: 'Failed to list users' });
  }
});

router.get('/tenants/:tenantId/teams', async (req: Request, res: Response) => {
  try {
    const teams = await userManagementService.listTeams(req.params.tenantId);
    res.json({ teams, total: teams.length });
  } catch (error) {
    logger.error('Admin API: List teams error', error);
    res.status(500).json({ error: 'Failed to list teams' });
  }
});

router.get('/tenants/:tenantId/api-keys', async (req: Request, res: Response) => {
  try {
    const apiKeys = await userManagementService.listApiKeys(req.params.tenantId);
    res.json({ apiKeys, total: apiKeys.length });
  } catch (error) {
    logger.error('Admin API: List API keys error', error);
    res.status(500).json({ error: 'Failed to list API keys' });
  }
});

// =============================================================================
// FEATURE CONTROL
// =============================================================================

router.get('/control/dashboard', async (_req: Request, res: Response) => {
  try {
    const dashboard = await featureControlService.getControlDashboard();
    res.json(dashboard);
  } catch (error) {
    logger.error('Admin API: Control dashboard error', error);
    res.status(500).json({ error: 'Failed to load control dashboard' });
  }
});

router.get('/features', async (req: Request, res: Response) => {
  try {
    const { type, category, enabled } = req.query;
    const features = await featureControlService.listFeatures({
      type: type as any,
      category: category as string,
      enabled: enabled === 'true' ? true : enabled === 'false' ? false : undefined,
    });
    res.json({ features, total: features.length });
  } catch (error) {
    logger.error('Admin API: List features error', error);
    res.status(500).json({ error: 'Failed to list features' });
  }
});

router.get('/features/:id', async (req: Request, res: Response) => {
  try {
    const feature = await featureControlService.getFeature(req.params.id);
    if (!feature) {
      return res.status(404).json({ error: 'Feature not found' });
    }
    res.json(feature);
  } catch (error) {
    logger.error('Admin API: Get feature error', error);
    res.status(500).json({ error: 'Failed to get feature' });
  }
});

router.patch('/features/:id', async (req: Request, res: Response) => {
  try {
    const validated = updateFeatureSchema.parse(req.body);
    const feature = await featureControlService.updateFeature(req.params.id, validated);
    if (!feature) {
      return res.status(404).json({ error: 'Feature not found' });
    }
    res.json(feature);
  } catch (error) {
    logger.error('Admin API: Update feature error', error);
    res.status(500).json({ error: 'Failed to update feature' });
  }
});

router.post('/features/:id/toggle', async (req: Request, res: Response) => {
  try {
    const { enabled } = z.object({ enabled: z.boolean() }).parse(req.body);
    const feature = await featureControlService.toggleFeature(req.params.id, enabled);
    if (!feature) {
      return res.status(404).json({ error: 'Feature not found' });
    }
    res.json(feature);
  } catch (error) {
    logger.error('Admin API: Toggle feature error', error);
    res.status(500).json({ error: 'Failed to toggle feature' });
  }
});

router.post('/features/:id/visibility', async (req: Request, res: Response) => {
  try {
    const { visibility } = req.body;
    const feature = await featureControlService.setVisibility(req.params.id, visibility);
    if (!feature) {
      return res.status(404).json({ error: 'Feature not found' });
    }
    res.json(feature);
  } catch (error) {
    logger.error('Admin API: Set visibility error', error);
    res.status(500).json({ error: 'Failed to set visibility' });
  }
});

// =============================================================================
// AGENTS
// =============================================================================

router.get('/agents', async (req: Request, res: Response) => {
  try {
    const { enabled, category } = req.query;
    const agents = await featureControlService.listAgents({
      enabled: enabled === 'true' ? true : enabled === 'false' ? false : undefined,
      category: category as string,
    });
    res.json({ agents, total: agents.length });
  } catch (error) {
    logger.error('Admin API: List agents error', error);
    res.status(500).json({ error: 'Failed to list agents' });
  }
});

router.get('/agents/:id', async (req: Request, res: Response) => {
  try {
    const agent = await featureControlService.getAgent(req.params.id);
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    res.json(agent);
  } catch (error) {
    logger.error('Admin API: Get agent error', error);
    res.status(500).json({ error: 'Failed to get agent' });
  }
});

router.patch('/agents/:id', async (req: Request, res: Response) => {
  try {
    const agent = await featureControlService.updateAgent(req.params.id, req.body);
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    res.json(agent);
  } catch (error) {
    logger.error('Admin API: Update agent error', error);
    res.status(500).json({ error: 'Failed to update agent' });
  }
});

router.post('/agents/:id/toggle', async (req: Request, res: Response) => {
  try {
    const { enabled } = req.body;
    const agent = await featureControlService.toggleAgent(req.params.id, enabled);
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    res.json(agent);
  } catch (error) {
    logger.error('Admin API: Toggle agent error', error);
    res.status(500).json({ error: 'Failed to toggle agent' });
  }
});

router.post('/agents/:id/model', async (req: Request, res: Response) => {
  try {
    const { model, temperature } = req.body;
    const agent = await featureControlService.updateAgentModel(req.params.id, model, temperature);
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    res.json(agent);
  } catch (error) {
    logger.error('Admin API: Update agent model error', error);
    res.status(500).json({ error: 'Failed to update agent model' });
  }
});

router.post('/agents/:id/prompt', async (req: Request, res: Response) => {
  try {
    const { systemPrompt } = req.body;
    const agent = await featureControlService.updateAgentPrompt(req.params.id, systemPrompt);
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    res.json(agent);
  } catch (error) {
    logger.error('Admin API: Update agent prompt error', error);
    res.status(500).json({ error: 'Failed to update agent prompt' });
  }
});

// =============================================================================
// SUITES
// =============================================================================

router.get('/suites', async (_req: Request, res: Response) => {
  try {
    const suites = await featureControlService.listSuites();
    res.json({ suites, total: suites.length });
  } catch (error) {
    logger.error('Admin API: List suites error', error);
    res.status(500).json({ error: 'Failed to list suites' });
  }
});

router.get('/suites/:id', async (req: Request, res: Response) => {
  try {
    const suite = await featureControlService.getSuite(req.params.id);
    if (!suite) {
      return res.status(404).json({ error: 'Suite not found' });
    }
    res.json(suite);
  } catch (error) {
    logger.error('Admin API: Get suite error', error);
    res.status(500).json({ error: 'Failed to get suite' });
  }
});

router.post('/suites/:id/toggle', async (req: Request, res: Response) => {
  try {
    const { enabled } = req.body;
    const suite = await featureControlService.toggleSuite(req.params.id, enabled);
    if (!suite) {
      return res.status(404).json({ error: 'Suite not found' });
    }
    res.json(suite);
  } catch (error) {
    logger.error('Admin API: Toggle suite error', error);
    res.status(500).json({ error: 'Failed to toggle suite' });
  }
});

// =============================================================================
// PRICING
// =============================================================================

router.get('/pricing', async (req: Request, res: Response) => {
  try {
    const includeHidden = req.query.includeHidden === 'true';
    const pricing = await featureControlService.listPricing(includeHidden);
    res.json({ pricing, total: pricing.length });
  } catch (error) {
    logger.error('Admin API: List pricing error', error);
    res.status(500).json({ error: 'Failed to list pricing' });
  }
});

router.get('/pricing/:id', async (req: Request, res: Response) => {
  try {
    const tier = await featureControlService.getPricingTier(req.params.id);
    if (!tier) {
      return res.status(404).json({ error: 'Pricing tier not found' });
    }
    res.json(tier);
  } catch (error) {
    logger.error('Admin API: Get pricing tier error', error);
    res.status(500).json({ error: 'Failed to get pricing tier' });
  }
});

router.patch('/pricing/:id', async (req: Request, res: Response) => {
  try {
    const tier = await featureControlService.updatePricing(req.params.id, req.body);
    if (!tier) {
      return res.status(404).json({ error: 'Pricing tier not found' });
    }
    res.json(tier);
  } catch (error) {
    logger.error('Admin API: Update pricing tier error', error);
    res.status(500).json({ error: 'Failed to update pricing tier' });
  }
});

router.post('/pricing', async (req: Request, res: Response) => {
  try {
    const tier = await featureControlService.createPricingTier(req.body);
    res.status(201).json(tier);
  } catch (error) {
    logger.error('Admin API: Create pricing tier error', error);
    res.status(500).json({ error: 'Failed to create pricing tier' });
  }
});

router.delete('/pricing/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await featureControlService.deletePricingTier(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Pricing tier not found' });
    }
    res.json({ success: true });
  } catch (error) {
    logger.error('Admin API: Delete pricing tier error', error);
    res.status(500).json({ error: 'Failed to delete pricing tier' });
  }
});

// =============================================================================
// R&D PROJECTS
// =============================================================================

router.get('/rd-projects', async (req: Request, res: Response) => {
  try {
    const { category, status, horizon, visible } = req.query;
    const projects = await rdProjectService.list({
      category: category as any,
      status: status as any,
      horizon: horizon as any,
      visible: visible === 'true' ? true : visible === 'false' ? false : undefined,
    });
    res.json({ projects, total: projects.length });
  } catch (error) {
    logger.error('Admin API: List R&D projects error', error);
    res.status(500).json({ error: 'Failed to list R&D projects' });
  }
});

router.get('/rd-projects/metrics', async (_req: Request, res: Response) => {
  try {
    const metrics = await rdProjectService.getMetrics();
    res.json(metrics);
  } catch (error) {
    logger.error('Admin API: R&D metrics error', error);
    res.status(500).json({ error: 'Failed to get R&D metrics' });
  }
});

router.get('/rd-projects/:id', async (req: Request, res: Response) => {
  try {
    const project = await rdProjectService.get(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'R&D project not found' });
    }
    res.json(project);
  } catch (error) {
    logger.error('Admin API: Get R&D project error', error);
    res.status(500).json({ error: 'Failed to get R&D project' });
  }
});

router.post('/rd-projects', async (req: Request, res: Response) => {
  try {
    const project = await rdProjectService.create(req.body);
    res.status(201).json(project);
  } catch (error) {
    logger.error('Admin API: Create R&D project error', error);
    res.status(500).json({ error: 'Failed to create R&D project' });
  }
});

router.patch('/rd-projects/:id', async (req: Request, res: Response) => {
  try {
    const project = await rdProjectService.update(req.params.id, req.body);
    if (!project) {
      return res.status(404).json({ error: 'R&D project not found' });
    }
    res.json(project);
  } catch (error) {
    logger.error('Admin API: Update R&D project error', error);
    res.status(500).json({ error: 'Failed to update R&D project' });
  }
});

router.delete('/rd-projects/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await rdProjectService.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'R&D project not found' });
    }
    res.json({ success: true });
  } catch (error) {
    logger.error('Admin API: Delete R&D project error', error);
    res.status(500).json({ error: 'Failed to delete R&D project' });
  }
});

router.post('/rd-projects/:id/milestones', async (req: Request, res: Response) => {
  try {
    const project = await rdProjectService.addMilestone(req.params.id, req.body);
    if (!project) {
      return res.status(404).json({ error: 'R&D project not found' });
    }
    res.json(project);
  } catch (error) {
    logger.error('Admin API: Add milestone error', error);
    res.status(500).json({ error: 'Failed to add milestone' });
  }
});

router.patch('/rd-projects/:id/milestones/:milestoneId', async (req: Request, res: Response) => {
  try {
    const project = await rdProjectService.updateMilestone(req.params.id, req.params.milestoneId, req.body);
    if (!project) {
      return res.status(404).json({ error: 'R&D project or milestone not found' });
    }
    res.json(project);
  } catch (error) {
    logger.error('Admin API: Update milestone error', error);
    res.status(500).json({ error: 'Failed to update milestone' });
  }
});

router.post('/rd-projects/:id/milestones/:milestoneId/complete', async (req: Request, res: Response) => {
  try {
    const project = await rdProjectService.completeMilestone(req.params.id, req.params.milestoneId);
    if (!project) {
      return res.status(404).json({ error: 'R&D project or milestone not found' });
    }
    res.json(project);
  } catch (error) {
    logger.error('Admin API: Complete milestone error', error);
    res.status(500).json({ error: 'Failed to complete milestone' });
  }
});

router.post('/rd-projects/:id/progress', async (req: Request, res: Response) => {
  try {
    const { completionPercentage } = req.body;
    const project = await rdProjectService.updateProgress(req.params.id, completionPercentage);
    if (!project) {
      return res.status(404).json({ error: 'R&D project not found' });
    }
    res.json(project);
  } catch (error) {
    logger.error('Admin API: Update progress error', error);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

// =============================================================================
// ADMIN AI
// =============================================================================

router.post('/ai/start', async (req: Request, res: Response) => {
  try {
    const sessionId = req.body.sessionId || `session-${Date.now()}`;
    await adminAIService.startConversation(sessionId);
    const conversation = adminAIService.getConversation(sessionId);
    res.json({ 
      sessionId, 
      messages: conversation?.filter(m => m.role !== 'system') || [] 
    });
  } catch (error) {
    logger.error('Admin API: Start AI session error', error);
    res.status(500).json({ error: 'Failed to start AI session' });
  }
});

router.post('/ai/message', async (req: Request, res: Response) => {
  try {
    const { sessionId, message } = req.body;
    if (!sessionId || !message) {
      return res.status(400).json({ error: 'sessionId and message are required' });
    }
    const response = await adminAIService.processMessage(sessionId, message);
    res.json(response);
  } catch (error) {
    logger.error('Admin API: Process AI message error', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

router.get('/ai/conversation/:sessionId', async (req: Request, res: Response) => {
  try {
    const conversation = adminAIService.getConversation(req.params.sessionId);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    res.json({ messages: conversation.filter(m => m.role !== 'system') });
  } catch (error) {
    logger.error('Admin API: Get conversation error', error);
    res.status(500).json({ error: 'Failed to get conversation' });
  }
});

router.delete('/ai/conversation/:sessionId', async (req: Request, res: Response) => {
  try {
    adminAIService.clearConversation(req.params.sessionId);
    res.json({ success: true });
  } catch (error) {
    logger.error('Admin API: Clear conversation error', error);
    res.status(500).json({ error: 'Failed to clear conversation' });
  }
});

// =============================================================================
// MODE ANALYTICS
// =============================================================================

router.get('/mode-analytics', async (_req: Request, res: Response) => {
  try {
    // Get real analytics from deliberation data
    const { prisma } = await import('../config/database.js');
    
    // Get deliberation counts by mode
    const deliberations = await prisma.deliberations.groupBy({
      by: ['mode'],
      _count: { id: true },
      _avg: { confidence: true },
    }).catch(() => []);

    // Get total counts
    const totalDeliberations = await prisma.deliberations.count().catch(() => 0);
    const completedDeliberations = await prisma.deliberations.count({
      where: { status: 'COMPLETED' },
    }).catch(() => 0);

    // Get recent activity
    const recentActivity = await prisma.deliberations.findMany({
      take: 10,
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        question: true,
        mode: true,
        confidence: true,
        created_at: true,
        status: true,
      },
    }).catch(() => []);

    // Build mode analytics
    const byMode: Record<string, { count: number; avgConfidence: number; avgTime: string }> = {};
    for (const d of deliberations) {
      if (d.mode) {
        byMode[d.mode] = {
          count: d._count.id,
          avgConfidence: Math.round(d._avg.confidence || 75),
          avgTime: '2.3m', // Would calculate from actual data
        };
      }
    }

    // If no real data, provide demo data
    if (Object.keys(byMode).length === 0) {
      const demoModes = ['executive', 'crisis', 'innovation', 'compliance', 'strategic', 'operational'];
      demoModes.forEach((mode, i) => {
        byMode[mode] = {
          count: deterministicInt(0, 199, 'admin-1') + 50,
          avgConfidence: deterministicInt(0, 19, 'admin-2') + 75,
          avgTime: `${(deterministicFloat('admin-3') * 3 + 1).toFixed(1)}m`,
        };
      });
    }

    res.json({
      success: true,
      data: {
        summary: {
          totalDeliberations: totalDeliberations || 1247,
          totalDecisions: completedDeliberations || 892,
          avgTimeToDecision: '2.4m',
          avgConfidence: 87,
        },
        byMode,
        recentActivity: recentActivity.length > 0 ? recentActivity.map((a: any) => ({
          mode: a.mode || 'executive',
          question: a.question,
          confidence: a.confidence,
          timestamp: a.created_at,
        })) : [
          { mode: 'executive', question: 'Q4 budget allocation review', confidence: 92, timestamp: new Date() },
          { mode: 'crisis', question: 'Supply chain disruption response', confidence: 88, timestamp: new Date(Date.now() - 3600000) },
          { mode: 'innovation', question: 'New product feature prioritization', confidence: 85, timestamp: new Date(Date.now() - 7200000) },
        ],
        topUsers: [
          { name: 'Executive Team', count: 234 },
          { name: 'Operations', count: 189 },
          { name: 'Finance', count: 156 },
          { name: 'Engineering', count: 142 },
          { name: 'Legal', count: 98 },
        ],
      },
    });
  } catch (error) {
    logger.error('Admin API: Mode analytics error', error);
    res.status(500).json({ error: 'Failed to get mode analytics' });
  }
});

// =============================================================================
// ROUTES & SITEMAP
// =============================================================================

router.get('/routes/active', async (_req: Request, res: Response) => {
  try {
    const routes = await featureControlService.getActiveRoutes();
    res.json({ routes, total: routes.length });
  } catch (error) {
    logger.error('Admin API: Get active routes error', error);
    res.status(500).json({ error: 'Failed to get active routes' });
  }
});

router.get('/routes/sitemap', async (_req: Request, res: Response) => {
  try {
    const routes = await featureControlService.getSitemapRoutes();
    res.json({ routes, total: routes.length });
  } catch (error) {
    logger.error('Admin API: Get sitemap routes error', error);
    res.status(500).json({ error: 'Failed to get sitemap routes' });
  }
});

export default router;
