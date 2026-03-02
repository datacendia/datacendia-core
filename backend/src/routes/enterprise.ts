// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA ENTERPRISE API ROUTES
// Full-Stack Corporation Services
// =============================================================================

import express, { Request, Response, Router } from 'express';
import { z } from 'zod';
import { authenticate, requireRole } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';

// Enterprise Services
import { cendiaProcureService, type VendorContract } from '../services/enterprise/CendiaProcureService.js';
import { cendiaScoutService } from '../services/enterprise/CendiaScoutService.js';
import { cendiaRainmakerService } from '../services/enterprise/CendiaRainmakerService.js';
import { cendiaRegentService } from '../services/enterprise/CendiaRegentService.js';
import { cendiaHabitatService } from '../services/enterprise/CendiaHabitatService.js';
import { cendiaGuardianService } from '../services/enterprise/CendiaGuardianService.js';
import { cendiaNerveService } from '../services/enterprise/CendiaNerveService.js';
import { cendiaDocketService } from '../services/enterprise/CendiaDocketService.js';
import { cendiaEquityService } from '../services/enterprise/CendiaEquityService.js';
import { cendiaMeshService } from '../services/enterprise/CendiaMeshService.js';
import { cendiaFactoryService } from '../services/enterprise/CendiaFactoryService.js';
import { cendiaTransitService } from '../services/enterprise/CendiaTransitService.js';
import { cendiaAcademyService } from '../services/enterprise/CendiaAcademyService.js';
import { cendiaResonanceService } from '../services/enterprise/CendiaResonanceService.js';
import { cendiaInventumService } from '../services/enterprise/CendiaInventumService.js';
import { getEnterpriseDashboard } from '../services/enterprise/index.js';

const router: Router = express.Router();

// ---- Zod Validation Schemas ----
const addContractSchema = z.object({
  vendorName: z.string().min(1).max(255),
  annualSpend: z.number().positive(),
  category: z.string().min(1).max(100),
  expirationDate: z.string().or(z.date()),
  autoRenew: z.boolean().optional().default(false),
  notes: z.string().max(2000).optional(),
});

const negotiationResultSchema = z.object({
  negotiatedPrice: z.number().nonnegative(),
});

// All enterprise routes require authentication and admin-level role
router.use(authenticate, requireRole('ADMIN', 'SUPER_ADMIN'));

// =============================================================================
// DASHBOARD
// =============================================================================

router.get('/dashboard', authenticate, async (_req: Request, res: Response) => {
  try {
    const dashboard = await getEnterpriseDashboard();
    res.json({ dashboard });
  } catch (error) {
    logger.error('Failed to get enterprise dashboard:', error);
    res.status(500).json({ error: 'Failed to get dashboard' });
  }
});

// =============================================================================
// CENDIAPROCURE ROUTES
// =============================================================================

// Get expiring contracts
router.get('/procure/contracts/expiring', authenticate, async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 90;
    const contracts = cendiaProcureService.getExpiringContracts(days);
    res.json({ contracts });
  } catch (error) {
    logger.error('Failed to get expiring contracts:', error);
    res.status(500).json({ error: 'Failed to get contracts' });
  }
});

// Add contract
router.post('/procure/contracts', authenticate, async (req: Request, res: Response) => {
  try {
    const validated = addContractSchema.parse(req.body);
    const expirationDate = typeof validated.expirationDate === 'string' ? new Date(validated.expirationDate) : validated.expirationDate;
    const contract = cendiaProcureService.addContract({
      vendorName: validated.vendorName,
      vendorEmail: '',
      category: validated.category as VendorContract['category'],
      annualValue: validated.annualSpend,
      currency: 'USD',
      startDate: new Date(),
      endDate: expirationDate,
      renewalDate: expirationDate,
      autoRenew: validated.autoRenew,
      usagePercent: 100,
      terms: validated.notes || '',
    });
    res.json({ contract });
  } catch (error) {
    logger.error('Failed to add contract:', error);
    res.status(500).json({ error: 'Failed to add contract' });
  }
});

// Execute The Squeeze
router.post('/procure/squeeze', authenticate, async (_req: Request, res: Response) => {
  try {
    const result = await cendiaProcureService.executeTheSqueeze();
    logger.info(`CendiaProcure: The Squeeze executed - ${result.negotiationsInitiated} negotiations, $${result.totalPotentialSavings} potential savings`);
    res.json({ result });
  } catch (error) {
    logger.error('Failed to execute The Squeeze:', error);
    res.status(500).json({ error: 'Failed to execute' });
  }
});

// Record negotiation result
router.post('/procure/contracts/:id/result', authenticate, async (req: Request, res: Response) => {
  try {
    const { negotiatedPrice } = negotiationResultSchema.parse(req.body);
    const result = cendiaProcureService.recordNegotiationResult(req.params.id, negotiatedPrice);
    res.json({ result });
  } catch (error) {
    logger.error('Failed to record result:', error);
    res.status(500).json({ error: 'Failed to record' });
  }
});

// Get procurement metrics
router.get('/procure/metrics', authenticate, async (_req: Request, res: Response) => {
  try {
    const metrics = cendiaProcureService.getMetrics();
    res.json({ metrics });
  } catch (error) {
    logger.error('Failed to get procurement metrics:', error);
    res.status(500).json({ error: 'Failed to get metrics' });
  }
});

// =============================================================================
// CENDIASCOUT ROUTES
// =============================================================================

// Map top performer genome
router.post('/scout/performers', authenticate, async (req: Request, res: Response) => {
  try {
    const performer = await cendiaScoutService.mapTopPerformerGenome(req.body);
    res.json({ performer });
  } catch (error) {
    logger.error('Failed to map performer genome:', error);
    res.status(500).json({ error: 'Failed to map genome' });
  }
});

// Get ideal profile for role
router.get('/scout/profiles/:role', authenticate, async (req: Request, res: Response) => {
  try {
    const profile = cendiaScoutService.getIdealProfile(req.params.role);
    res.json({ profile });
  } catch (error) {
    logger.error('Failed to get ideal profile:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Match candidate
router.post('/scout/candidates/match', authenticate, async (req: Request, res: Response) => {
  try {
    const { candidate, targetRole } = req.body;
    const matched = await cendiaScoutService.matchCandidate(candidate, targetRole);
    res.json({ candidate: matched });
  } catch (error) {
    logger.error('Failed to match candidate:', error);
    res.status(500).json({ error: 'Failed to match' });
  }
});

// Build shadow pipeline
router.post('/scout/pipelines', authenticate, async (req: Request, res: Response) => {
  try {
    const { roleId, roleName, department, targetCount } = req.body;
    const pipeline = await cendiaScoutService.buildShadowPipeline(roleId, roleName, department, targetCount);
    res.json({ pipeline });
  } catch (error) {
    logger.error('Failed to build pipeline:', error);
    res.status(500).json({ error: 'Failed to build pipeline' });
  }
});

// Activate emergency search
router.post('/scout/pipelines/:id/emergency', authenticate, async (req: Request, res: Response) => {
  try {
    const result = await cendiaScoutService.activateEmergencySearch(req.params.id);
    res.json({ result });
  } catch (error) {
    logger.error('Failed to activate emergency search:', error);
    res.status(500).json({ error: 'Failed to activate' });
  }
});

// Get pipeline health
router.get('/scout/pipelines/health', authenticate, async (_req: Request, res: Response) => {
  try {
    const health = cendiaScoutService.getPipelineHealth();
    res.json({ health });
  } catch (error) {
    logger.error('Failed to get pipeline health:', error);
    res.status(500).json({ error: 'Failed to get health' });
  }
});

// Get talent alerts
router.get('/scout/alerts', authenticate, async (_req: Request, res: Response) => {
  try {
    const alerts = cendiaScoutService.getAlerts();
    res.json({ alerts });
  } catch (error) {
    logger.error('Failed to get talent alerts:', error);
    res.status(500).json({ error: 'Failed to get alerts' });
  }
});

// =============================================================================
// CENDIARAINMAKER ROUTES
// =============================================================================

// Add deal
router.post('/rainmaker/deals', authenticate, async (req: Request, res: Response) => {
  try {
    const deal = cendiaRainmakerService.addDeal(req.body);
    res.json({ deal });
  } catch (error) {
    logger.error('Failed to add deal:', error);
    res.status(500).json({ error: 'Failed to add deal' });
  }
});

// Predict deal outcome
router.get('/rainmaker/deals/:id/predict', authenticate, async (req: Request, res: Response) => {
  try {
    const prediction = await cendiaRainmakerService.predictDealOutcome(req.params.id);
    res.json({ prediction });
  } catch (error) {
    logger.error('Failed to predict deal:', error);
    res.status(500).json({ error: 'Failed to predict' });
  }
});

// Get slipping deals
router.get('/rainmaker/deals/slipping', authenticate, async (_req: Request, res: Response) => {
  try {
    const deals = await cendiaRainmakerService.getSlippingDeals();
    res.json({ deals });
  } catch (error) {
    logger.error('Failed to get slipping deals:', error);
    res.status(500).json({ error: 'Failed to get deals' });
  }
});

// Generate executive letter
router.post('/rainmaker/deals/:id/letter', authenticate, async (req: Request, res: Response) => {
  try {
    const { purpose } = req.body;
    const letter = await cendiaRainmakerService.generateExecutiveLetter(req.params.id, purpose);
    res.json({ letter });
  } catch (error) {
    logger.error('Failed to generate letter:', error);
    res.status(500).json({ error: 'Failed to generate' });
  }
});

// Analyze call
router.post('/rainmaker/calls/analyze', authenticate, async (req: Request, res: Response) => {
  try {
    const { dealId, transcript, participants } = req.body;
    const analysis = await cendiaRainmakerService.analyzeCall(dealId, transcript, participants);
    res.json({ analysis });
  } catch (error) {
    logger.error('Failed to analyze call:', error);
    res.status(500).json({ error: 'Failed to analyze' });
  }
});

// Get whisper coaching
router.post('/rainmaker/deals/:id/whisper', authenticate, async (req: Request, res: Response) => {
  try {
    const { context } = req.body;
    const tips = await cendiaRainmakerService.getWhisperCoaching(req.params.id, context);
    res.json({ tips });
  } catch (error) {
    logger.error('Failed to get whisper coaching:', error);
    res.status(500).json({ error: 'Failed to get coaching' });
  }
});

// Get pipeline metrics
router.get('/rainmaker/metrics', authenticate, async (_req: Request, res: Response) => {
  try {
    const metrics = cendiaRainmakerService.getPipelineMetrics();
    res.json({ metrics });
  } catch (error) {
    logger.error('Failed to get pipeline metrics:', error);
    res.status(500).json({ error: 'Failed to get metrics' });
  }
});

// =============================================================================
// CENDIAREGENT ROUTES
// =============================================================================

// Get advisors
router.get('/regent/advisors', authenticate, async (_req: Request, res: Response) => {
  try {
    const advisors = cendiaRegentService.getAdvisors();
    res.json({ advisors });
  } catch (error) {
    logger.error('Failed to get advisors:', error);
    res.status(500).json({ error: 'Failed to get advisors' });
  }
});

// Consult council
router.post('/regent/consult', authenticate, async (req: Request, res: Response) => {
  try {
    const { question, context, advisorIds } = req.body;
    const session = await cendiaRegentService.consultCouncil(question, context, advisorIds);
    res.json({ session });
  } catch (error) {
    logger.error('Failed to consult council:', error);
    res.status(500).json({ error: 'Failed to consult' });
  }
});

// The Mirror - reveal uncomfortable truths
router.post('/regent/mirror', authenticate, async (req: Request, res: Response) => {
  try {
    const { topic, ceoBeliefs, data } = req.body;
    const analysis = await cendiaRegentService.revealMirrorTruth(topic, ceoBeliefs, data);
    res.json({ analysis });
  } catch (error) {
    logger.error('Failed to get mirror truth:', error);
    res.status(500).json({ error: 'Failed to analyze' });
  }
});

// Daily mirror
router.post('/regent/mirror/daily', authenticate, async (req: Request, res: Response) => {
  try {
    const { recentDecisions, metrics } = req.body;
    const truth = await cendiaRegentService.getDailyMirror(recentDecisions, metrics);
    res.json({ truth });
  } catch (error) {
    logger.error('Failed to get daily mirror:', error);
    res.status(500).json({ error: 'Failed to get truth' });
  }
});

// Add custom advisor
router.post('/regent/advisors', authenticate, async (req: Request, res: Response) => {
  try {
    const advisor = cendiaRegentService.addCustomAdvisor(req.body);
    res.json({ advisor });
  } catch (error) {
    logger.error('Failed to add advisor:', error);
    res.status(500).json({ error: 'Failed to add advisor' });
  }
});

// Get sessions
router.get('/regent/sessions', authenticate, async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const sessions = cendiaRegentService.getSessions(limit);
    res.json({ sessions });
  } catch (error) {
    logger.error('Failed to get sessions:', error);
    res.status(500).json({ error: 'Failed to get sessions' });
  }
});

// =============================================================================
// CENDIAHABITAT ROUTES - Facilities & Real Estate
// =============================================================================

// Register zone
router.post('/habitat/zones', authenticate, async (req: Request, res: Response) => {
  try {
    const zone = cendiaHabitatService.registerZone(req.body);
    res.json({ zone });
  } catch (error) {
    logger.error('Failed to register zone:', error);
    res.status(500).json({ error: 'Failed to register zone' });
  }
});

// Get all zones
router.get('/habitat/zones', authenticate, async (_req: Request, res: Response) => {
  try {
    const zones = cendiaHabitatService.getAllZones();
    res.json({ zones });
  } catch (error) {
    logger.error('Failed to get zones:', error);
    res.status(500).json({ error: 'Failed to get zones' });
  }
});

// Activate BioSync
router.post('/habitat/zones/:id/biosync', authenticate, async (req: Request, res: Response) => {
  try {
    const { teamId, stressLevel } = req.body;
    const recommendation = await cendiaHabitatService.activateBioSync(req.params.id, teamId, stressLevel);
    res.json({ recommendation });
  } catch (error) {
    logger.error('Failed to activate BioSync:', error);
    res.status(500).json({ error: 'Failed to activate BioSync' });
  }
});

// Update sensors
router.put('/habitat/zones/:id/sensors', authenticate, async (req: Request, res: Response) => {
  try {
    const zone = cendiaHabitatService.updateSensors(req.params.id, req.body);
    res.json({ zone });
  } catch (error) {
    logger.error('Failed to update sensors:', error);
    res.status(500).json({ error: 'Failed to update sensors' });
  }
});

// Get real estate optimization
router.get('/habitat/optimization', authenticate, async (_req: Request, res: Response) => {
  try {
    const optimization = await cendiaHabitatService.optimizeRealEstate();
    res.json({ optimization });
  } catch (error) {
    logger.error('Failed to get optimization:', error);
    res.status(500).json({ error: 'Failed to get optimization' });
  }
});

// =============================================================================
// CENDIAGUARDIAN ROUTES - Customer Success
// =============================================================================

// Add customer
router.post('/guardian/customers', authenticate, async (req: Request, res: Response) => {
  try {
    const customer = cendiaGuardianService.addCustomer(req.body);
    res.json({ customer });
  } catch (error) {
    logger.error('Failed to add customer:', error);
    res.status(500).json({ error: 'Failed to add customer' });
  }
});

// Get all customers
router.get('/guardian/customers', authenticate, async (_req: Request, res: Response) => {
  try {
    const customers = cendiaGuardianService.getAllCustomers();
    res.json({ customers });
  } catch (error) {
    logger.error('Failed to get customers:', error);
    res.status(500).json({ error: 'Failed to get customers' });
  }
});

// Assess customer health
router.get('/guardian/customers/:id/health', authenticate, async (req: Request, res: Response) => {
  try {
    const health = await cendiaGuardianService.assessHealth(req.params.id);
    res.json({ health });
  } catch (error) {
    logger.error('Failed to assess health:', error);
    res.status(500).json({ error: 'Failed to assess health' });
  }
});

// Predict churn
router.get('/guardian/customers/:id/churn', authenticate, async (req: Request, res: Response) => {
  try {
    const prediction = await cendiaGuardianService.predictChurn(req.params.id);
    res.json({ prediction });
  } catch (error) {
    logger.error('Failed to predict churn:', error);
    res.status(500).json({ error: 'Failed to predict churn' });
  }
});

// Generate care package
router.post('/guardian/customers/:id/care-package', authenticate, async (req: Request, res: Response) => {
  try {
    const { riskFactors, opportunities } = req.body;
    const carePackage = await cendiaGuardianService.generateCarePackage(req.params.id, riskFactors || [], opportunities || []);
    res.json({ carePackage });
  } catch (error) {
    logger.error('Failed to generate care package:', error);
    res.status(500).json({ error: 'Failed to generate care package' });
  }
});

// Get at-risk customers
router.get('/guardian/customers/at-risk', authenticate, async (_req: Request, res: Response) => {
  try {
    const customers = cendiaGuardianService.getAllCustomers().filter(c => c.healthScore < 60);
    res.json({ customers });
  } catch (error) {
    logger.error('Failed to get at-risk customers:', error);
    res.status(500).json({ error: 'Failed to get at-risk customers' });
  }
});

// =============================================================================
// CENDIENERVE ROUTES - IT Operations
// =============================================================================

// Register service
router.post('/nerve/services', authenticate, async (req: Request, res: Response) => {
  try {
    const service = cendiaNerveService.registerService(req.body);
    res.json({ service });
  } catch (error) {
    logger.error('Failed to register service:', error);
    res.status(500).json({ error: 'Failed to register service' });
  }
});

// Get all services
router.get('/nerve/services', authenticate, async (_req: Request, res: Response) => {
  try {
    const services = cendiaNerveService.getAllServices();
    res.json({ services });
  } catch (error) {
    logger.error('Failed to get services:', error);
    res.status(500).json({ error: 'Failed to get services' });
  }
});

// Get incidents
router.get('/nerve/incidents', authenticate, async (_req: Request, res: Response) => {
  try {
    const incidents = cendiaNerveService.getActiveIncidents();
    res.json({ incidents });
  } catch (error) {
    logger.error('Failed to get incidents:', error);
    res.status(500).json({ error: 'Failed to get incidents' });
  }
});

// Analyze incident
router.get('/nerve/incidents/:id/analyze', authenticate, async (req: Request, res: Response) => {
  try {
    const analysis = await cendiaNerveService.analyzeIncident(req.params.id);
    res.json({ analysis });
  } catch (error) {
    logger.error('Failed to analyze incident:', error);
    res.status(500).json({ error: 'Failed to analyze incident' });
  }
});

// Activate Lazarus Protocol
router.post('/nerve/lazarus', authenticate, async (req: Request, res: Response) => {
  try {
    const { trigger } = req.body;
    const protocol = await cendiaNerveService.activateLazarusProtocol(trigger);
    res.json({ protocol });
  } catch (error) {
    logger.error('Failed to activate Lazarus:', error);
    res.status(500).json({ error: 'Failed to activate Lazarus' });
  }
});

// Get capacity forecasts
router.get('/nerve/capacity', authenticate, async (_req: Request, res: Response) => {
  try {
    const forecasts = await cendiaNerveService.forecastCapacity();
    res.json({ forecasts });
  } catch (error) {
    logger.error('Failed to get capacity forecasts:', error);
    res.status(500).json({ error: 'Failed to get forecasts' });
  }
});

// =============================================================================
// CENDIADOCKET ROUTES - Legal Operations
// =============================================================================

// Create matter
router.post('/docket/matters', authenticate, async (req: Request, res: Response) => {
  try {
    const matter = cendiaDocketService.createMatter(req.body);
    res.json({ matter });
  } catch (error) {
    logger.error('Failed to create matter:', error);
    res.status(500).json({ error: 'Failed to create matter' });
  }
});

// Get all matters
router.get('/docket/matters', authenticate, async (_req: Request, res: Response) => {
  try {
    const matters = cendiaDocketService.getAllMatters();
    res.json({ matters });
  } catch (error) {
    logger.error('Failed to get matters:', error);
    res.status(500).json({ error: 'Failed to get matters' });
  }
});

// Analyze litigation
router.get('/docket/matters/:id/analyze', authenticate, async (req: Request, res: Response) => {
  try {
    const analysis = await cendiaDocketService.analyzeLitigation(req.params.id);
    res.json({ analysis });
  } catch (error) {
    logger.error('Failed to analyze litigation:', error);
    res.status(500).json({ error: 'Failed to analyze litigation' });
  }
});

// Analyze contract
router.post('/docket/contracts/analyze', authenticate, async (req: Request, res: Response) => {
  try {
    const { documentId, content } = req.body;
    const analysis = await cendiaDocketService.analyzeContract(documentId, content);
    res.json({ analysis });
  } catch (error) {
    logger.error('Failed to analyze contract:', error);
    res.status(500).json({ error: 'Failed to analyze contract' });
  }
});

// Get compliance checks
router.get('/docket/compliance', authenticate, async (_req: Request, res: Response) => {
  try {
    const matters = cendiaDocketService.getAllMatters();
    res.json({ matters, count: matters.length });
  } catch (error) {
    logger.error('Failed to get compliance:', error);
    res.status(500).json({ error: 'Failed to get compliance' });
  }
});

// =============================================================================
// CENDIAEQUITY ROUTES - Investor Relations
// =============================================================================

// Add investor
router.post('/equity/investors', authenticate, async (req: Request, res: Response) => {
  try {
    const investor = cendiaEquityService.addInvestor(req.body);
    res.json({ investor });
  } catch (error) {
    logger.error('Failed to add investor:', error);
    res.status(500).json({ error: 'Failed to add investor' });
  }
});

// Prepare earnings call
router.post('/equity/earnings/prep', authenticate, async (req: Request, res: Response) => {
  try {
    const { quarterEnd, metrics } = req.body;
    const prep = await cendiaEquityService.prepareEarningsCall(quarterEnd, metrics);
    res.json({ prep });
  } catch (error) {
    logger.error('Failed to prepare earnings call:', error);
    res.status(500).json({ error: 'Failed to prepare' });
  }
});

// Analyze earnings phrase
router.post('/equity/earnings/simulate', authenticate, async (req: Request, res: Response) => {
  try {
    const { phrase } = req.body;
    const simulation = await cendiaEquityService.simulateEarningsPhrase(phrase);
    res.json({ simulation });
  } catch (error) {
    logger.error('Failed to simulate phrase:', error);
    res.status(500).json({ error: 'Failed to simulate' });
  }
});

// Get investor
router.get('/equity/investors/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const investor = cendiaEquityService.getInvestor(req.params.id);
    res.json({ investor });
  } catch (error) {
    logger.error('Failed to get investor:', error);
    res.status(500).json({ error: 'Failed to get investor' });
  }
});

// Get upcoming IR events
router.get('/equity/events', authenticate, async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query['days'] as string) || 90;
    const events = cendiaEquityService.getUpcomingEvents(days);
    res.json({ events });
  } catch (error) {
    logger.error('Failed to get events:', error);
    res.status(500).json({ error: 'Failed to get events' });
  }
});

// =============================================================================
// CENDIAMESH ROUTES - M&A Culture Integration
// =============================================================================

// Assess culture
router.post('/mesh/profiles', authenticate, async (req: Request, res: Response) => {
  try {
    const profile = await cendiaMeshService.assessCulture(req.body);
    res.json({ profile });
  } catch (error) {
    logger.error('Failed to assess culture:', error);
    res.status(500).json({ error: 'Failed to assess culture' });
  }
});

// Compare cultures
router.post('/mesh/compare', authenticate, async (req: Request, res: Response) => {
  try {
    const { acquirerId, targetId } = req.body;
    const comparison = await cendiaMeshService.compareCultures(acquirerId, targetId);
    res.json({ comparison });
  } catch (error) {
    logger.error('Failed to compare cultures:', error);
    res.status(500).json({ error: 'Failed to compare' });
  }
});

// Generate integration roadmap
router.post('/mesh/roadmaps', authenticate, async (req: Request, res: Response) => {
  try {
    const { acquirerId, targetId, name } = req.body;
    const roadmap = await cendiaMeshService.generateIntegrationRoadmap(acquirerId, targetId, name);
    res.json({ roadmap });
  } catch (error) {
    logger.error('Failed to generate roadmap:', error);
    res.status(500).json({ error: 'Failed to generate roadmap' });
  }
});

// Get roadmap
router.get('/mesh/roadmaps/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const roadmap = cendiaMeshService.getRoadmap(req.params.id);
    res.json({ roadmap });
  } catch (error) {
    logger.error('Failed to get roadmap:', error);
    res.status(500).json({ error: 'Failed to get roadmap' });
  }
});

// =============================================================================
// CENDIAFACTORY ROUTES - Manufacturing
// =============================================================================

// Register production line
router.post('/factory/lines', authenticate, async (req: Request, res: Response) => {
  try {
    const line = cendiaFactoryService.registerLine(req.body);
    res.json({ line });
  } catch (error) {
    logger.error('Failed to register line:', error);
    res.status(500).json({ error: 'Failed to register line' });
  }
});

// Get line
router.get('/factory/lines/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const line = cendiaFactoryService.getLine(req.params.id);
    res.json({ line });
  } catch (error) {
    logger.error('Failed to get line:', error);
    res.status(500).json({ error: 'Failed to get line' });
  }
});

// Predict failures
router.get('/factory/lines/:id/predict', authenticate, async (req: Request, res: Response) => {
  try {
    const failures = await cendiaFactoryService.predictFailures(req.params.id);
    res.json({ failures });
  } catch (error) {
    logger.error('Failed to predict failures:', error);
    res.status(500).json({ error: 'Failed to predict failures' });
  }
});

// Optimize yield
router.get('/factory/lines/:id/optimize', authenticate, async (req: Request, res: Response) => {
  try {
    const optimization = await cendiaFactoryService.optimizeYield(req.params.id);
    res.json({ optimization });
  } catch (error) {
    logger.error('Failed to optimize yield:', error);
    res.status(500).json({ error: 'Failed to optimize' });
  }
});

// Get metrics
router.get('/factory/metrics', authenticate, async (_req: Request, res: Response) => {
  try {
    const metrics = cendiaFactoryService.getMetrics();
    res.json({ metrics });
  } catch (error) {
    logger.error('Failed to get metrics:', error);
    res.status(500).json({ error: 'Failed to get metrics' });
  }
});

// =============================================================================
// CENDIATRANSIT ROUTES - Travel & Security
// =============================================================================

// Create travel request
router.post('/transit/requests', authenticate, async (req: Request, res: Response) => {
  try {
    const request = await cendiaTransitService.createTravelRequest(req.body);
    res.json({ request });
  } catch (error) {
    logger.error('Failed to create travel request:', error);
    res.status(500).json({ error: 'Failed to create request' });
  }
});

// Get travel request
router.get('/transit/requests/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const request = cendiaTransitService.getTravelRequest(req.params['id']);
    res.json({ request });
  } catch (error) {
    logger.error('Failed to get request:', error);
    res.status(500).json({ error: 'Failed to get request' });
  }
});

// Assess location risk
router.post('/transit/risk', authenticate, async (req: Request, res: Response) => {
  try {
    const { location, country } = req.body;
    const risk = await cendiaTransitService.assessLocationRisk(location, country);
    res.json({ risk });
  } catch (error) {
    logger.error('Failed to assess risk:', error);
    res.status(500).json({ error: 'Failed to assess risk' });
  }
});

// Create security plan
router.post('/transit/requests/:id/security-plan', authenticate, async (req: Request, res: Response) => {
  try {
    const plan = await cendiaTransitService.createSecurityPlan(req.params['id']);
    res.json({ plan });
  } catch (error) {
    logger.error('Failed to create security plan:', error);
    res.status(500).json({ error: 'Failed to create plan' });
  }
});

// Activate extraction
router.post('/transit/requests/:id/extract', authenticate, async (req: Request, res: Response) => {
  try {
    const { reason, activatedBy } = req.body;
    const extraction = await cendiaTransitService.activateExtraction(req.params.id, reason, activatedBy);
    res.json({ extraction });
  } catch (error) {
    logger.error('Failed to activate extraction:', error);
    res.status(500).json({ error: 'Failed to activate extraction' });
  }
});

// =============================================================================
// CENDIAACADEMY ROUTES - Learning & Development
// =============================================================================

// Create profile
router.post('/academy/profiles', authenticate, async (req: Request, res: Response) => {
  try {
    const profile = cendiaAcademyService.createProfile(req.body);
    res.json({ profile });
  } catch (error) {
    logger.error('Failed to create profile:', error);
    res.status(500).json({ error: 'Failed to create profile' });
  }
});

// Get profile
router.get('/academy/profiles/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const profile = cendiaAcademyService.getProfile(req.params.id);
    res.json({ profile });
  } catch (error) {
    logger.error('Failed to get profile:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Analyze skill gaps
router.get('/academy/profiles/:id/gaps', authenticate, async (req: Request, res: Response) => {
  try {
    const gaps = await cendiaAcademyService.analyzeSkillGaps(req.params['id']);
    res.json({ gaps });
  } catch (error) {
    logger.error('Failed to analyze gaps:', error);
    res.status(500).json({ error: 'Failed to analyze gaps' });
  }
});

// Recommend learning path
router.post('/academy/learning-path', authenticate, async (req: Request, res: Response) => {
  try {
    const { skill, currentLevel, targetLevel } = req.body;
    const path = await cendiaAcademyService.recommendLearningPath(skill, currentLevel, targetLevel);
    res.json({ path });
  } catch (error) {
    logger.error('Failed to recommend learning path:', error);
    res.status(500).json({ error: 'Failed to recommend path' });
  }
});

// Inject just-in-time intervention
router.post('/academy/intervention', authenticate, async (req: Request, res: Response) => {
  try {
    const { employeeId, trigger, skill } = req.body;
    const intervention = await cendiaAcademyService.injectJustInTime(employeeId, trigger, skill);
    res.json({ intervention });
  } catch (error) {
    logger.error('Failed to inject intervention:', error);
    res.status(500).json({ error: 'Failed to inject intervention' });
  }
});

// =============================================================================
// CENDIARESONANCE ROUTES - Corporate Communications
// =============================================================================

// Create campaign
router.post('/resonance/campaigns', authenticate, async (req: Request, res: Response) => {
  try {
    const campaign = cendiaResonanceService.createCampaign(req.body);
    res.json({ campaign });
  } catch (error) {
    logger.error('Failed to create campaign:', error);
    res.status(500).json({ error: 'Failed to create campaign' });
  }
});

// Get campaign
router.get('/resonance/campaigns/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const campaign = cendiaResonanceService.getCampaign(req.params.id);
    res.json({ campaign });
  } catch (error) {
    logger.error('Failed to get campaign:', error);
    res.status(500).json({ error: 'Failed to get campaign' });
  }
});

// Generate campaign message
router.post('/resonance/messages/generate', authenticate, async (req: Request, res: Response) => {
  try {
    const { campaignId, audience, channel, tone } = req.body;
    const message = await cendiaResonanceService.generateCampaignMessage(campaignId, audience, channel, tone);
    res.json({ message });
  } catch (error) {
    logger.error('Failed to generate message:', error);
    res.status(500).json({ error: 'Failed to generate' });
  }
});

// Measure belief
router.post('/resonance/beliefs/measure', authenticate, async (req: Request, res: Response) => {
  try {
    const { topic, audience } = req.body;
    const belief = await cendiaResonanceService.measureBelief(topic, audience);
    res.json({ belief });
  } catch (error) {
    logger.error('Failed to measure belief:', error);
    res.status(500).json({ error: 'Failed to measure' });
  }
});

// Initiate crisis response
router.post('/resonance/crisis', authenticate, async (req: Request, res: Response) => {
  try {
    const { crisisType, severity, description } = req.body;
    const response = await cendiaResonanceService.initiateCrisisResponse(crisisType, severity, description);
    res.json({ response });
  } catch (error) {
    logger.error('Failed to initiate crisis response:', error);
    res.status(500).json({ error: 'Failed to initiate response' });
  }
});

// Detect leak patterns
router.post('/resonance/leaks/detect', authenticate, async (req: Request, res: Response) => {
  try {
    const { content, distribution } = req.body;
    const leaks = await cendiaResonanceService.detectLeakPatterns(content, distribution);
    res.json({ leaks });
  } catch (error) {
    logger.error('Failed to detect leaks:', error);
    res.status(500).json({ error: 'Failed to detect' });
  }
});

// =============================================================================
// CENDIAINVENTUM ROUTES - R&D & IP
// =============================================================================

// Capture idea
router.post('/inventum/ideas', authenticate, async (req: Request, res: Response) => {
  try {
    const idea = await cendiaInventumService.captureIdea(req.body);
    res.json({ idea });
  } catch (error) {
    logger.error('Failed to capture idea:', error);
    res.status(500).json({ error: 'Failed to capture idea' });
  }
});

// Get ideas
router.get('/inventum/ideas', authenticate, async (_req: Request, res: Response) => {
  try {
    const ideas = cendiaInventumService.getAllIdeas();
    res.json({ ideas });
  } catch (error) {
    logger.error('Failed to get ideas:', error);
    res.status(500).json({ error: 'Failed to get ideas' });
  }
});

// Get idea
router.get('/inventum/ideas/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const idea = cendiaInventumService.getIdea(req.params.id);
    res.json({ idea });
  } catch (error) {
    logger.error('Failed to get idea:', error);
    res.status(500).json({ error: 'Failed to get idea' });
  }
});

// Create patent
router.post('/inventum/patents', authenticate, async (req: Request, res: Response) => {
  try {
    const patent = cendiaInventumService.createPatent(req.body);
    res.json({ patent });
  } catch (error) {
    logger.error('Failed to create patent:', error);
    res.status(500).json({ error: 'Failed to create patent' });
  }
});

// Get patent
router.get('/inventum/patents/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const patent = cendiaInventumService.getPatent(req.params.id);
    res.json({ patent });
  } catch (error) {
    logger.error('Failed to get patent:', error);
    res.status(500).json({ error: 'Failed to get patent' });
  }
});

// Generate provisional patent
router.post('/inventum/ideas/:id/provisional', authenticate, async (req: Request, res: Response) => {
  try {
    const draft = await cendiaInventumService.generateProvisionalPatent(req.params.id);
    res.json({ draft });
  } catch (error) {
    logger.error('Failed to generate provisional:', error);
    res.status(500).json({ error: 'Failed to generate' });
  }
});

// Create project
router.post('/inventum/projects', authenticate, async (req: Request, res: Response) => {
  try {
    const project = cendiaInventumService.createProject(req.body);
    res.json({ project });
  } catch (error) {
    logger.error('Failed to create project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Get project
router.get('/inventum/projects/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const project = cendiaInventumService.getProject(req.params.id);
    res.json({ project });
  } catch (error) {
    logger.error('Failed to get project:', error);
    res.status(500).json({ error: 'Failed to get project' });
  }
});

export default router;
