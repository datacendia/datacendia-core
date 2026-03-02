// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA CORE API ROUTES
// Internal admin endpoints for running the company
// =============================================================================

import express, { Request, Response, Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';

// Core Services
import { cendiaBrandService } from '../services/core/CendiaBrandService.js';
import { cendiaFoundryService } from '../services/core/CendiaFoundryService.js';
import { cendiaRevenueService } from '../services/core/CendiaRevenueService.js';
import { cendiaSupportService } from '../services/core/CendiaSupportService.js';
import { cendiaWatchService } from '../services/core/CendiaWatchService.js';
import { getCoreDashboard } from '../services/core/index.js';

const router: Router = express.Router();

// All core admin routes require authentication and admin-level role
router.use(authenticate, requireRole('ADMIN', 'SUPER_ADMIN'));

// =============================================================================
// DASHBOARD
// =============================================================================

router.get('/dashboard', authenticate, async (_req: Request, res: Response) => {
  try {
    const dashboard = await getCoreDashboard();
    res.json({ dashboard });
  } catch (error) {
    logger.error('Failed to get core dashboard:', error);
    res.status(500).json({ error: 'Failed to get dashboard' });
  }
});

// =============================================================================
// CENDIABRAND ROUTES
// =============================================================================

// Get content queue
router.get('/brand/content', authenticate, async (_req: Request, res: Response) => {
  try {
    const content = cendiaBrandService.getContentQueue();
    res.json({ content, count: content.length });
  } catch (error) {
    logger.error('Failed to get content queue:', error);
    res.status(500).json({ error: 'Failed to get content' });
  }
});

// Generate LinkedIn post for feature
router.post('/brand/generate/linkedin', authenticate, async (req: Request, res: Response) => {
  try {
    const { featureId, featureName, featureDescription } = req.body;
    
    cendiaBrandService.registerFeature({
      id: featureId || `feat-${Date.now()}`,
      name: featureName,
      description: featureDescription,
      marketingAssets: [],
    });

    const post = await cendiaBrandService.generateLinkedInPost({
      id: featureId || `feat-${Date.now()}`,
      name: featureName,
      description: featureDescription,
      marketingAssets: [],
    });

    res.json({ post });
  } catch (error) {
    logger.error('Failed to generate LinkedIn post:', error);
    res.status(500).json({ error: 'Failed to generate post' });
  }
});

// Generate full marketing package
router.post('/brand/generate/package', authenticate, async (req: Request, res: Response) => {
  try {
    const { featureId } = req.body;
    const package_ = await cendiaBrandService.generateMarketingPackage(featureId);
    res.json({ package: package_ });
  } catch (error) {
    logger.error('Failed to generate marketing package:', error);
    res.status(500).json({ error: 'Failed to generate package' });
  }
});

// Audit content for brand voice
router.post('/brand/audit', authenticate, async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    const audit = await cendiaBrandService.auditContent(text);
    res.json({ audit });
  } catch (error) {
    logger.error('Failed to audit content:', error);
    res.status(500).json({ error: 'Failed to audit' });
  }
});

// Approve content
router.post('/brand/content/:id/approve', authenticate, async (req: Request, res: Response) => {
  try {
    cendiaBrandService.approveContent(req.params.id);
    res.json({ success: true });
  } catch (error) {
    logger.error('Failed to approve content:', error);
    res.status(500).json({ error: 'Failed to approve' });
  }
});

// Schedule content
router.post('/brand/content/:id/schedule', authenticate, async (req: Request, res: Response) => {
  try {
    const { date } = req.body;
    cendiaBrandService.scheduleContent(req.params.id, new Date(date));
    res.json({ success: true });
  } catch (error) {
    logger.error('Failed to schedule content:', error);
    res.status(500).json({ error: 'Failed to schedule' });
  }
});

// =============================================================================
// CENDIAFOUNDRY ROUTES
// =============================================================================

// Get roadmap
router.get('/foundry/roadmap', authenticate, async (_req: Request, res: Response) => {
  try {
    const roadmap = cendiaFoundryService.getRoadmap();
    res.json({ roadmap });
  } catch (error) {
    logger.error('Failed to get roadmap:', error);
    res.status(500).json({ error: 'Failed to get roadmap' });
  }
});

// Get feature priorities
router.get('/foundry/priorities', authenticate, async (_req: Request, res: Response) => {
  try {
    const priorities = await cendiaFoundryService.prioritizeFeatures();
    res.json({ priorities });
  } catch (error) {
    logger.error('Failed to get priorities:', error);
    res.status(500).json({ error: 'Failed to get priorities' });
  }
});

// Get next feature recommendation
router.get('/foundry/next', authenticate, async (_req: Request, res: Response) => {
  try {
    const recommendation = await cendiaFoundryService.getNextFeatureRecommendation();
    res.json({ recommendation });
  } catch (error) {
    logger.error('Failed to get recommendation:', error);
    res.status(500).json({ error: 'Failed to get recommendation' });
  }
});

// Get nag message
router.get('/foundry/nag', authenticate, async (_req: Request, res: Response) => {
  try {
    const nag = cendiaFoundryService.getNagMessage();
    res.json({ nag });
  } catch (error) {
    logger.error('Failed to get nag:', error);
    res.status(500).json({ error: 'Failed to get nag' });
  }
});

// Add to roadmap
router.post('/foundry/roadmap', authenticate, async (req: Request, res: Response) => {
  try {
    const item = cendiaFoundryService.addToRoadmap(req.body);
    res.json({ item });
  } catch (error) {
    logger.error('Failed to add to roadmap:', error);
    res.status(500).json({ error: 'Failed to add' });
  }
});

// Ingest feedback
router.post('/foundry/feedback', authenticate, async (req: Request, res: Response) => {
  try {
    const feedback = await cendiaFoundryService.ingestFeedback(req.body);
    res.json({ feedback });
  } catch (error) {
    logger.error('Failed to ingest feedback:', error);
    res.status(500).json({ error: 'Failed to ingest' });
  }
});

// Get feedback summary
router.get('/foundry/feedback/summary', authenticate, async (_req: Request, res: Response) => {
  try {
    const summary = cendiaFoundryService.getFeedbackSummary();
    res.json({ summary });
  } catch (error) {
    logger.error('Failed to get feedback summary:', error);
    res.status(500).json({ error: 'Failed to get summary' });
  }
});

// =============================================================================
// CENDIAREVENUE ROUTES
// =============================================================================

// Get metrics
router.get('/revenue/metrics', authenticate, async (_req: Request, res: Response) => {
  try {
    const metrics = cendiaRevenueService.calculateMetrics();
    res.json({ metrics });
  } catch (error) {
    logger.error('Failed to get revenue metrics:', error);
    res.status(500).json({ error: 'Failed to get metrics' });
  }
});

// Calculate runway
router.post('/revenue/runway', authenticate, async (req: Request, res: Response) => {
  try {
    const { cash, expenses } = req.body;
    const runway = cendiaRevenueService.calculateRunway(cash, expenses);
    res.json({ runway });
  } catch (error) {
    logger.error('Failed to calculate runway:', error);
    res.status(500).json({ error: 'Failed to calculate' });
  }
});

// Get pricing recommendation
router.post('/revenue/pricing', authenticate, async (req: Request, res: Response) => {
  try {
    const { tier, currentPrice } = req.body;
    const recommendation = await cendiaRevenueService.analyzePricing(tier, currentPrice);
    res.json({ recommendation });
  } catch (error) {
    logger.error('Failed to analyze pricing:', error);
    res.status(500).json({ error: 'Failed to analyze' });
  }
});

// Get quick pricing advice
router.get('/revenue/pricing/quick', authenticate, async (_req: Request, res: Response) => {
  try {
    const advice = await cendiaRevenueService.getQuickPricingAdvice();
    res.json({ advice });
  } catch (error) {
    logger.error('Failed to get pricing advice:', error);
    res.status(500).json({ error: 'Failed to get advice' });
  }
});

// Sync from Stripe
router.post('/revenue/sync/stripe', authenticate, async (req: Request, res: Response) => {
  try {
    const { subscriptions } = req.body;
    await cendiaRevenueService.syncFromStripe(subscriptions);
    res.json({ success: true });
  } catch (error) {
    logger.error('Failed to sync Stripe:', error);
    res.status(500).json({ error: 'Failed to sync' });
  }
});

// Get forecast
router.get('/revenue/forecast/:months', authenticate, async (req: Request, res: Response) => {
  try {
    const months = parseInt(req.params.months) || 12;
    const forecast = cendiaRevenueService.generateForecast(months);
    res.json({ forecast });
  } catch (error) {
    logger.error('Failed to generate forecast:', error);
    res.status(500).json({ error: 'Failed to forecast' });
  }
});

// Get alerts
router.get('/revenue/alerts', authenticate, async (_req: Request, res: Response) => {
  try {
    const alerts = cendiaRevenueService.getAlerts();
    res.json({ alerts });
  } catch (error) {
    logger.error('Failed to get alerts:', error);
    res.status(500).json({ error: 'Failed to get alerts' });
  }
});

// =============================================================================
// CENDIASUPPORT ROUTES
// =============================================================================

// Triage ticket
router.post('/support/triage', authenticate, async (req: Request, res: Response) => {
  try {
    const result = await cendiaSupportService.triageTicket(req.body);
    res.json({ result });
  } catch (error) {
    logger.error('Failed to triage ticket:', error);
    res.status(500).json({ error: 'Failed to triage' });
  }
});

// Get tickets
router.get('/support/tickets', authenticate, async (req: Request, res: Response) => {
  try {
    const { status, priority, customerId } = req.query;
    const tickets = cendiaSupportService.getTickets({
      status: status as string,
      priority: priority as string,
      customerId: customerId as string,
    });
    res.json({ tickets, count: tickets.length });
  } catch (error) {
    logger.error('Failed to get tickets:', error);
    res.status(500).json({ error: 'Failed to get tickets' });
  }
});

// Get at-risk customers
router.get('/support/at-risk', authenticate, async (_req: Request, res: Response) => {
  try {
    const atRisk = await cendiaSupportService.getAtRiskCustomers();
    res.json({ customers: atRisk });
  } catch (error) {
    logger.error('Failed to get at-risk customers:', error);
    res.status(500).json({ error: 'Failed to get customers' });
  }
});

// Get customer health
router.get('/support/customers/:id/health', authenticate, async (req: Request, res: Response) => {
  try {
    const health = await cendiaSupportService.getCustomerHealth(req.params.id);
    res.json({ health });
  } catch (error) {
    logger.error('Failed to get customer health:', error);
    res.status(500).json({ error: 'Failed to get health' });
  }
});

// Predict churn
router.get('/support/customers/:id/churn', authenticate, async (req: Request, res: Response) => {
  try {
    const prediction = await cendiaSupportService.predictChurn(req.params.id);
    res.json({ prediction });
  } catch (error) {
    logger.error('Failed to predict churn:', error);
    res.status(500).json({ error: 'Failed to predict' });
  }
});

// Get support metrics
router.get('/support/metrics', authenticate, async (_req: Request, res: Response) => {
  try {
    const metrics = cendiaSupportService.getMetrics();
    res.json({ metrics });
  } catch (error) {
    logger.error('Failed to get support metrics:', error);
    res.status(500).json({ error: 'Failed to get metrics' });
  }
});

// Record login
router.post('/support/activity/login', authenticate, async (req: Request, res: Response) => {
  try {
    const { customerId } = req.body;
    cendiaSupportService.recordLogin(customerId);
    res.json({ success: true });
  } catch (error) {
    logger.error('Failed to record login:', error);
    res.status(500).json({ error: 'Failed to record' });
  }
});

// =============================================================================
// CENDIAWATCH ROUTES
// =============================================================================

// Get alerts
router.get('/watch/alerts', authenticate, async (req: Request, res: Response) => {
  try {
    const { acknowledged } = req.query;
    const alerts = cendiaWatchService.getAlerts(
      acknowledged === 'true' ? true : acknowledged === 'false' ? false : undefined
    );
    res.json({ alerts, count: alerts.length });
  } catch (error) {
    logger.error('Failed to get watch alerts:', error);
    res.status(500).json({ error: 'Failed to get alerts' });
  }
});

// Get critical alert
router.get('/watch/alerts/critical', authenticate, async (_req: Request, res: Response) => {
  try {
    const alert = cendiaWatchService.getCriticalAlert();
    res.json({ alert });
  } catch (error) {
    logger.error('Failed to get critical alert:', error);
    res.status(500).json({ error: 'Failed to get alert' });
  }
});

// Acknowledge alert
router.post('/watch/alerts/:id/acknowledge', authenticate, async (req: Request, res: Response) => {
  try {
    cendiaWatchService.acknowledgeAlert(req.params.id);
    res.json({ success: true });
  } catch (error) {
    logger.error('Failed to acknowledge alert:', error);
    res.status(500).json({ error: 'Failed to acknowledge' });
  }
});

// Ingest signal
router.post('/watch/signals', authenticate, async (req: Request, res: Response) => {
  try {
    const signal = await cendiaWatchService.ingestSignal(req.body);
    res.json({ signal });
  } catch (error) {
    logger.error('Failed to ingest signal:', error);
    res.status(500).json({ error: 'Failed to ingest' });
  }
});

// Get competitors
router.get('/watch/competitors', authenticate, async (_req: Request, res: Response) => {
  try {
    const competitors = cendiaWatchService.getCompetitors();
    res.json({ competitors });
  } catch (error) {
    logger.error('Failed to get competitors:', error);
    res.status(500).json({ error: 'Failed to get competitors' });
  }
});

// Scan competitor
router.get('/watch/competitors/:name/scan', authenticate, async (req: Request, res: Response) => {
  try {
    const scan = await cendiaWatchService.scanCompetitor(req.params.name);
    res.json({ scan });
  } catch (error) {
    logger.error('Failed to scan competitor:', error);
    res.status(500).json({ error: 'Failed to scan' });
  }
});

// Generate intelligence report
router.get('/watch/report/:period', authenticate, async (req: Request, res: Response) => {
  try {
    const period = req.params.period as 'daily' | 'weekly' | 'monthly';
    const report = await cendiaWatchService.generateReport(period);
    res.json({ report });
  } catch (error) {
    logger.error('Failed to generate report:', error);
    res.status(500).json({ error: 'Failed to generate' });
  }
});

// Get/update config
router.get('/watch/config', authenticate, async (_req: Request, res: Response) => {
  try {
    const config = cendiaWatchService.getConfig();
    res.json({ config });
  } catch (error) {
    logger.error('Failed to get watch config:', error);
    res.status(500).json({ error: 'Failed to get config' });
  }
});

router.put('/watch/config', authenticate, async (req: Request, res: Response) => {
  try {
    cendiaWatchService.updateConfig(req.body);
    res.json({ success: true });
  } catch (error) {
    logger.error('Failed to update watch config:', error);
    res.status(500).json({ error: 'Failed to update' });
  }
});

export default router;
