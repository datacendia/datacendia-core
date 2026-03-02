// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA PLATFORM - PILLAR API ROUTES
// RESTful endpoints for the 8 Foundational Data Layers
// =============================================================================

import { Router, Request, Response } from 'express';
import { devAuth } from '../middleware/auth.js';
import {
  helmService,
  lineageService,
  predictService,
  flowService,
  healthService,
  guardService,
  ethicsService,
  agentsService,
  initializePillarsForOrg,
} from '../services/pillars/index.js';
import { getErrorMessage } from '../utils/errors.js';

const router = Router();

// Use devAuth so requests have req.organizationId in development
router.use(devAuth);

 function requireOrganizationId(req: Request, res: Response): string | undefined {
   const organizationId = req.organizationId;
   if (!organizationId) {
     res.status(401).json({ success: false, error: 'Missing organizationId' });
     return;
   }
   return organizationId;
 }

 function requireParam(req: Request, res: Response, key: string): string | undefined {
   const value = req.params[key];
   if (!value) {
     res.status(400).json({ success: false, error: `Missing ${key}` });
     return;
   }
   return value;
 }

 function getQueryString(req: Request, key: string): string | undefined {
   const value = req.query[key];
   return typeof value === 'string' ? value : undefined;
 }

// =============================================================================
// INITIALIZATION
// =============================================================================

router.post('/initialize', async (req: Request, res: Response) => {
  try {
    const organizationId = requireOrganizationId(req, res);
    if (!organizationId) return;
    await initializePillarsForOrg(organizationId);
    res.json({ success: true, message: 'Pillars initialized' });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

// =============================================================================
// THE HELM - Metrics & KPIs
// =============================================================================

router.get('/helm/dashboard', async (req: Request, res: Response) => {
  try {
    const organizationId = requireOrganizationId(req, res);
    if (!organizationId) return;
    // Enterprise Platinum: No auto-seeding - data comes only from real operations
    const dashboard = await helmService.getKPIDashboard(organizationId);
    res.json({ success: true, data: dashboard });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/helm/metrics', async (req: Request, res: Response) => {
  try {
    const organizationId = requireOrganizationId(req, res);
    if (!organizationId) return;
    const category = getQueryString(req, 'category');
    const metrics = await helmService.getOrgMetrics(organizationId, category as any);
    res.json({ success: true, data: metrics });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/helm/metrics/:id', async (req: Request, res: Response) => {
  try {
    const id = requireParam(req, res, 'id');
    if (!id) return;
    const metric = await helmService.getMetric(id);
    if (!metric) {
      res.status(404).json({ success: false, error: 'Metric not found' });
      return;
    }
    res.json({ success: true, data: metric });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/helm/metrics/:id/history', async (req: Request, res: Response) => {
  try {
    const id = requireParam(req, res, 'id');
    if (!id) return;
    const daysRaw = getQueryString(req, 'days');
    const days = (daysRaw ? parseInt(daysRaw) : 30) || 30;
    const history = await helmService.getMetricHistory(id, days);
    res.json({ success: true, data: history });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.patch('/helm/metrics/:id', async (req: Request, res: Response) => {
  try {
    const { value } = req.body;
    const id = requireParam(req, res, 'id');
    if (!id) return;
    const metric = await helmService.updateMetricValue(id, value);
    if (!metric) {
      res.status(404).json({ success: false, error: 'Metric not found' });
      return;
    }
    res.json({ success: true, data: metric });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/helm/alerts', async (req: Request, res: Response) => {
  try {
    const organizationId = requireOrganizationId(req, res);
    if (!organizationId) return;
    const alerts = await helmService.getActiveAlerts(organizationId);
    res.json({ success: true, data: alerts });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.post('/helm/alerts/:id/acknowledge', async (req: Request, res: Response) => {
  try {
    const id = requireParam(req, res, 'id');
    if (!id) return;
    await helmService.acknowledgeAlert(id);
    res.json({ success: true });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

// =============================================================================
// THE LINEAGE - Data Provenance
// =============================================================================

router.get('/lineage/graph', async (req: Request, res: Response) => {
  try {
    const organizationId = requireOrganizationId(req, res);
    if (!organizationId) return;
    // Enterprise Platinum: No auto-seeding
    const graph = await lineageService.getLineageGraph(organizationId);
    res.json({ success: true, data: graph });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/lineage/entities', async (req: Request, res: Response) => {
  try {
    const organizationId = requireOrganizationId(req, res);
    if (!organizationId) return;
    const type = getQueryString(req, 'type');
    const entities = await lineageService.getEntities(organizationId, type as any);
    res.json({ success: true, data: entities });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/lineage/entities/:id/trace', async (req: Request, res: Response) => {
  try {
    const id = requireParam(req, res, 'id');
    if (!id) return;
    const direction = getQueryString(req, 'direction') || 'both';
    const graph = await lineageService.traceLineage(id, direction as any);
    res.json({ success: true, data: graph });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/lineage/quality', async (req: Request, res: Response) => {
  try {
    const organizationId = requireOrganizationId(req, res);
    if (!organizationId) return;
    const overview = await lineageService.getQualityOverview(organizationId);
    res.json({ success: true, data: overview });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.post('/lineage/entities/:id/quality-check', async (req: Request, res: Response) => {
  try {
    const id = requireParam(req, res, 'id');
    if (!id) return;
    const report = await lineageService.checkDataQuality(id);
    res.json({ success: true, data: report });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

// =============================================================================
// THE PREDICT - Forecasting
// =============================================================================

router.get('/predict/models', async (req: Request, res: Response) => {
  try {
    const organizationId = requireOrganizationId(req, res);
    if (!organizationId) return;
    // Enterprise Platinum: No auto-seeding
    const models = await predictService.getModels(organizationId);
    res.json({ success: true, data: models });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/predict/models/:id', async (req: Request, res: Response) => {
  try {
    const id = requireParam(req, res, 'id');
    if (!id) return;
    const model = await predictService.getModel(id);
    if (!model) {
      res.status(404).json({ success: false, error: 'Model not found' });
      return;
    }
    res.json({ success: true, data: model });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/predict/models/:id/features', async (req: Request, res: Response) => {
  try {
    const id = requireParam(req, res, 'id');
    if (!id) return;
    const features = await predictService.getFeatureImportance(id);
    res.json({ success: true, data: features });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.post('/predict/models/:id/predict', async (req: Request, res: Response) => {
  try {
    const id = requireParam(req, res, 'id');
    if (!id) return;
    const prediction = await predictService.predict(id, req.body.input || {});
    res.json({ success: true, data: prediction });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.post('/predict/models/:id/train', async (req: Request, res: Response) => {
  try {
    const id = requireParam(req, res, 'id');
    if (!id) return;
    const model = await predictService.trainModel(id);
    res.json({ success: true, data: model });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/predict/forecasts', async (req: Request, res: Response) => {
  try {
    const organizationId = requireOrganizationId(req, res);
    if (!organizationId) return;
    const forecasts = await predictService.getForecasts(organizationId);
    res.json({ success: true, data: forecasts });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/predict/insights', async (req: Request, res: Response) => {
  try {
    const organizationId = requireOrganizationId(req, res);
    if (!organizationId) return;
    const insights = await predictService.generateInsights(organizationId);
    res.json({ success: true, data: insights });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

// =============================================================================
// THE FLOW - Workflow Automation
// =============================================================================

router.get('/flow/stats', async (req: Request, res: Response) => {
  try {
    const organizationId = requireOrganizationId(req, res);
    if (!organizationId) return;
    // Enterprise Platinum: No auto-seeding
    const stats = await flowService.getFlowStats(organizationId);
    res.json({ success: true, data: stats });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/flow/workflows', async (req: Request, res: Response) => {
  try {
    const organizationId = requireOrganizationId(req, res);
    if (!organizationId) return;
    const status = getQueryString(req, 'status');
    const workflows = await flowService.getWorkflows(organizationId, status as any);
    res.json({ success: true, data: workflows });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/flow/workflows/:id', async (req: Request, res: Response) => {
  try {
    const id = requireParam(req, res, 'id');
    if (!id) return;
    const workflow = await flowService.getWorkflow(id);
    if (!workflow) {
      res.status(404).json({ success: false, error: 'Workflow not found' });
      return;
    }
    res.json({ success: true, data: workflow });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.post('/flow/workflows/:id/execute', async (req: Request, res: Response) => {
  try {
    const { triggeredBy = 'api', input } = req.body;
    const id = requireParam(req, res, 'id');
    if (!id) return;
    const execution = await flowService.executeWorkflow(id, triggeredBy, input);
    res.json({ success: true, data: execution });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/flow/executions', async (req: Request, res: Response) => {
  try {
    const organizationId = requireOrganizationId(req, res);
    if (!organizationId) return;
    const limitRaw = getQueryString(req, 'limit');
    const limit = (limitRaw ? parseInt(limitRaw) : 50) || 50;
    const executions = await flowService.getExecutions(organizationId, limit);
    res.json({ success: true, data: executions });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/flow/approvals', async (req: Request, res: Response) => {
  try {
    const organizationId = requireOrganizationId(req, res);
    if (!organizationId) return;
    const approvals = await flowService.getPendingApprovals(organizationId);
    res.json({ success: true, data: approvals });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.post('/flow/approvals/:id', async (req: Request, res: Response) => {
  try {
    const { approved, decidedBy, reason } = req.body;
    const id = requireParam(req, res, 'id');
    if (!id) return;
    const approval = await flowService.processApproval(id, approved, decidedBy, reason);
    res.json({ success: true, data: approval });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

// =============================================================================
// THE HEALTH - System Health
// =============================================================================

router.get('/health/status', async (req: Request, res: Response) => {
  try {
    const organizationId = requireOrganizationId(req, res);
    if (!organizationId) return;
    const health = await healthService.getSystemHealth(organizationId);
    res.json({ success: true, data: health });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/health/alerts', async (req: Request, res: Response) => {
  try {
    const organizationId = requireOrganizationId(req, res);
    if (!organizationId) return;
    const includeResolved = getQueryString(req, 'includeResolved') === 'true';
    const alerts = await healthService.getAlerts(organizationId, includeResolved);
    res.json({ success: true, data: alerts });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.post('/health/alerts/:id/acknowledge', async (req: Request, res: Response) => {
  try {
    const id = requireParam(req, res, 'id');
    if (!id) return;
    const alert = await healthService.acknowledgeAlert(id);
    res.json({ success: true, data: alert });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.post('/health/alerts/:id/resolve', async (req: Request, res: Response) => {
  try {
    const id = requireParam(req, res, 'id');
    if (!id) return;
    const alert = await healthService.resolveAlert(id);
    res.json({ success: true, data: alert });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/health/trends', async (req: Request, res: Response) => {
  try {
    const organizationId = requireOrganizationId(req, res);
    if (!organizationId) return;
    const hoursRaw = getQueryString(req, 'hours');
    const hours = (hoursRaw ? parseInt(hoursRaw) : 24) || 24;
    const trends = await healthService.getHealthTrends(organizationId, hours);
    res.json({ success: true, data: trends });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

// =============================================================================
// THE GUARD - Security Posture
// =============================================================================

router.get('/guard/posture', async (req: Request, res: Response) => {
  try {
    const organizationId = requireOrganizationId(req, res);
    if (!organizationId) return;
    const posture = await guardService.getSecurityPosture(organizationId);
    res.json({ success: true, data: posture });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/guard/threats', async (req: Request, res: Response) => {
  try {
    const organizationId = requireOrganizationId(req, res);
    if (!organizationId) return;
    const includeResolved = getQueryString(req, 'includeResolved') === 'true';
    // Enterprise Platinum: No auto-seeding
    const threats = await guardService.getThreats(organizationId, includeResolved);
    res.json({ success: true, data: threats });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.patch('/guard/threats/:id', async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const id = requireParam(req, res, 'id');
    if (!id) return;
    const threat = await guardService.updateThreatStatus(id, status);
    res.json({ success: true, data: threat });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/guard/policies', async (req: Request, res: Response) => {
  try {
    const organizationId = requireOrganizationId(req, res);
    if (!organizationId) return;
    const policies = await guardService.getPolicies(organizationId);
    res.json({ success: true, data: policies });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.patch('/guard/policies/:id', async (req: Request, res: Response) => {
  try {
    const { enabled } = req.body;
    const id = requireParam(req, res, 'id');
    if (!id) return;
    const policy = await guardService.togglePolicy(id, enabled);
    res.json({ success: true, data: policy });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/guard/audit', async (req: Request, res: Response) => {
  try {
    const organizationId = requireOrganizationId(req, res);
    if (!organizationId) return;
    const limitRaw = getQueryString(req, 'limit');
    const limit = (limitRaw ? parseInt(limitRaw) : 100) || 100;
    const logs = await guardService.getAuditLogs(organizationId, limit);
    res.json({ success: true, data: logs });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

// =============================================================================
// THE ETHICS - AI Governance
// =============================================================================

router.get('/ethics/stats', async (req: Request, res: Response) => {
  try {
    const organizationId = requireOrganizationId(req, res);
    if (!organizationId) return;
    // Enterprise Platinum: No auto-seeding
    const stats = await ethicsService.getEthicsStats(organizationId);
    res.json({ success: true, data: stats });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/ethics/principles', async (req: Request, res: Response) => {
  try {
    const organizationId = requireOrganizationId(req, res);
    if (!organizationId) return;
    const status = getQueryString(req, 'status');
    const principles = await ethicsService.getPrinciples(organizationId, status as any);
    res.json({ success: true, data: principles });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/ethics/reviews', async (req: Request, res: Response) => {
  try {
    const organizationId = requireOrganizationId(req, res);
    if (!organizationId) return;
    const result = getQueryString(req, 'result');
    const reviews = await ethicsService.getReviews(organizationId, result as any);
    res.json({ success: true, data: reviews });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.post('/ethics/reviews', async (req: Request, res: Response) => {
  try {
    const review = await ethicsService.requestReview(req.body);
    res.json({ success: true, data: review });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.post('/ethics/reviews/:id/decide', async (req: Request, res: Response) => {
  try {
    const { result, notes, violations } = req.body;
    const id = requireParam(req, res, 'id');
    if (!id) return;
    const review = await ethicsService.submitReviewDecision(id, result, notes, violations);
    res.json({ success: true, data: review });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/ethics/bias-checks', async (req: Request, res: Response) => {
  try {
    const organizationId = requireOrganizationId(req, res);
    if (!organizationId) return;
    const checks = await ethicsService.getBiasChecks(organizationId);
    res.json({ success: true, data: checks });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.post('/ethics/bias-check', async (req: Request, res: Response) => {
  try {
    const organizationId = requireOrganizationId(req, res);
    if (!organizationId) return;
    const { modelId, modelName } = req.body;
    const check = await ethicsService.performBiasCheck(organizationId, modelId, modelName);
    res.json({ success: true, data: check });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

// =============================================================================
// THE AGENTS - AI Agent Management
// =============================================================================

router.get('/agents/stats', async (req: Request, res: Response) => {
  try {
    const organizationId = requireOrganizationId(req, res);
    if (!organizationId) return;
    // Enterprise Platinum: No auto-seeding
    const stats = await agentsService.getAgentStats(organizationId);
    res.json({ success: true, data: stats });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/agents', async (req: Request, res: Response) => {
  try {
    const organizationId = requireOrganizationId(req, res);
    if (!organizationId) return;
    // Enterprise Platinum: No auto-seeding
    const agents = await agentsService.getAgents(organizationId);
    res.json({ success: true, data: agents });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/agents/:id', async (req: Request, res: Response) => {
  try {
    const id = requireParam(req, res, 'id');
    if (!id) return;
    const agent = await agentsService.getAgent(id);
    if (!agent) {
      res.status(404).json({ success: false, error: 'Agent not found' });
      return;
    }
    res.json({ success: true, data: agent });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.patch('/agents/:id/status', async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const id = requireParam(req, res, 'id');
    if (!id) return;
    const agent = await agentsService.updateAgentStatus(id, status);
    res.json({ success: true, data: agent });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.patch('/agents/:id/config', async (req: Request, res: Response) => {
  try {
    const id = requireParam(req, res, 'id');
    if (!id) return;
    const agent = await agentsService.updateAgentConfig(id, req.body);
    res.json({ success: true, data: agent });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/agents/:id/interactions', async (req: Request, res: Response) => {
  try {
    const id = requireParam(req, res, 'id');
    if (!id) return;
    const limitRaw = getQueryString(req, 'limit');
    const limit = (limitRaw ? parseInt(limitRaw) : 50) || 50;
    const interactions = await agentsService.getInteractions(id, limit);
    res.json({ success: true, data: interactions });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.post('/agents/:id/interactions', async (req: Request, res: Response) => {
  try {
    const id = requireParam(req, res, 'id');
    if (!id) return;
    const interaction = await agentsService.recordInteraction({
      ...req.body,
      agentId: id,
    });
    res.json({ success: true, data: interaction });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.post('/agents/interactions/:id/rate', async (req: Request, res: Response) => {
  try {
    const { rating, feedback } = req.body;
    const id = requireParam(req, res, 'id');
    if (!id) return;
    const interaction = await agentsService.rateInteraction(id, rating, feedback);
    res.json({ success: true, data: interaction });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

export default router;
