// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * CendiaCrucible™ API Routes
 * 
 * Synthetic Multiverse Simulation Engine
 * High-fidelity stress testing and decision future-mapping
 */

import { Router, Request, Response, NextFunction } from 'express';
import { cendiaCrucibleService, SCENARIO_TEMPLATES } from '../services/CendiaCrucibleService.js';
import { errors } from '../middleware/errorHandler.js';
import { devAuth } from '../middleware/auth.js';

const router = Router();

// Health endpoint (before auth)
router.get('/health', (_req: Request, res: Response) => {
  res.json({ success: true, data: { status: 'healthy', service: 'crucible', timestamp: new Date().toISOString() } });
});

// Apply auth to all routes
router.use(devAuth);

// ===========================================================================
// STATUS / HEALTH
// ===========================================================================

/**
 * GET /crucible/status
 * Service health and status
 */
router.get('/status', async (req: Request, res: Response) => {
  try {
    const orgId = req.organizationId;
    
    // Get simulation counts
    const simulations = await cendiaCrucibleService.listSimulations(orgId!, {}).catch(() => []);
    const templates = cendiaCrucibleService.getScenarioTemplates();

    res.json({
      success: true,
      data: {
        service: 'CendiaCrucible',
        status: 'operational',
        version: '1.0.0',
        description: 'Synthetic Multiverse Simulation Engine',
        capabilities: [
          'High-fidelity stress testing',
          'Decision future-mapping',
          'Monte Carlo simulations',
          'Black swan scenario modeling',
          'Regulatory impact analysis',
          'Competitive response simulation',
          'Financial stress testing',
        ],
        metrics: {
          totalSimulations: simulations.length,
          runningSimulations: simulations.filter((s: any) => s.status === 'running').length,
          completedSimulations: simulations.filter((s: any) => s.status === 'completed').length,
          availableTemplates: Object.keys(templates).length,
        },
        templateTypes: Object.keys(templates),
        lastCheck: new Date().toISOString(),
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

/**
 * GET /api/v1/crucible/templates
 * Get available scenario templates
 */
router.get('/templates', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const templates = cendiaCrucibleService.getScenarioTemplates();
    
    // Transform to array format with metadata
    const templateList = Object.entries(templates).map(([type, template]) => ({
      type,
      name: template.name,
      description: template.description,
      shockCount: template.shocks.length,
      shocks: template.shocks,
    }));

    res.json({
      success: true,
      data: templateList,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/crucible/simulations
 * List simulations for organization
 */
router.get('/simulations', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, type, limit, offset } = req.query;
    
    const simulations = await cendiaCrucibleService.listSimulations(
      req.organizationId!,
      {
        status: status as any,
        type: type as any,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
      }
    );

    res.json({
      success: true,
      data: simulations,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/crucible/simulations
 * Create a new simulation
 */
router.post('/simulations', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, simulationType, config, scenarioDefinition } = req.body;

    if (!name || !simulationType) {
      throw errors.badRequest('Name and simulation type are required');
    }

    // Use template if no custom scenario provided
    const scenario = scenarioDefinition || SCENARIO_TEMPLATES[simulationType as keyof typeof SCENARIO_TEMPLATES];
    
    if (!scenario) {
      throw errors.badRequest('Invalid simulation type or missing scenario definition');
    }

    const simulation = await cendiaCrucibleService.createSimulation(
      req.organizationId!,
      req.user!.id,
      {
        name,
        description,
        simulationType,
        config: config || {
          monteCarloRuns: 12, // Reduced for performance with LLM calls
          confidenceLevel: 0.95,
          timeHorizonDays: 365,
          variables: [],
          constraints: [],
        },
        scenarioDefinition: scenario,
      }
    );

    res.status(201).json({
      success: true,
      data: simulation,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/crucible/simulations/:id
 * Get simulation details with results
 */
router.get('/simulations/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const simulation = await cendiaCrucibleService.getSimulation(req.params.id);

    if (!simulation) {
      throw errors.notFound('Simulation');
    }

    if (simulation.organization_id !== req.organizationId) {
      throw errors.forbidden();
    }

    res.json({
      success: true,
      data: simulation,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/crucible/simulations/:id/run
 * Execute a simulation
 */
router.post('/simulations/:id/run', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const simulation = await cendiaCrucibleService.getSimulation(req.params.id);

    if (!simulation) {
      throw errors.notFound('Simulation');
    }

    if (simulation.organization_id !== req.organizationId) {
      throw errors.forbidden();
    }

    if (simulation.status !== 'DRAFT' && simulation.status !== 'CONFIGURING') {
      throw errors.badRequest('Simulation has already been run');
    }

    // Run simulation (this may take time)
    // mode=express skips Council deliberation, mode=deliberative (default) includes it
    const mode = req.body?.mode === 'express' ? 'express' : 'deliberative';
    const result = await cendiaCrucibleService.runSimulation(req.params.id, { mode });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/crucible/simulations/:id/universes
 * Get parallel universes from a simulation
 */
router.get('/simulations/:id/universes', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit = '20', sentiment } = req.query;
    
    const simulation = await cendiaCrucibleService.getSimulation(req.params.id);

    if (!simulation) {
      throw errors.notFound('Simulation');
    }

    if (simulation.organization_id !== req.organizationId) {
      throw errors.forbidden();
    }

    let universes = simulation.universes;
    
    // Filter by sentiment if specified
    if (sentiment) {
      universes = universes.filter(u => u.outcome_sentiment === sentiment);
    }

    res.json({
      success: true,
      data: universes.slice(0, parseInt(limit as string)),
      meta: {
        total: universes.length,
        sentimentDistribution: {
          catastrophic: universes.filter(u => u.outcome_sentiment === 'CATASTROPHIC').length,
          negative: universes.filter(u => u.outcome_sentiment === 'NEGATIVE').length,
          neutral: universes.filter(u => u.outcome_sentiment === 'NEUTRAL').length,
          positive: universes.filter(u => u.outcome_sentiment === 'POSITIVE').length,
          optimal: universes.filter(u => u.outcome_sentiment === 'OPTIMAL').length,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/crucible/simulations/:id/impacts
 * Get impact analysis from a simulation
 */
router.get('/simulations/:id/impacts', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, severity } = req.query;
    
    const simulation = await cendiaCrucibleService.getSimulation(req.params.id);

    if (!simulation) {
      throw errors.notFound('Simulation');
    }

    if (simulation.organization_id !== req.organizationId) {
      throw errors.forbidden();
    }

    let impacts = simulation.impacts;
    
    if (category) {
      impacts = impacts.filter(i => i.impact_category === category);
    }
    
    if (severity) {
      impacts = impacts.filter(i => i.severity === severity);
    }

    res.json({
      success: true,
      data: impacts,
      meta: {
        total: impacts.length,
        bySeverity: {
          critical: impacts.filter(i => i.severity === 'CRITICAL').length,
          high: impacts.filter(i => i.severity === 'HIGH').length,
          medium: impacts.filter(i => i.severity === 'MEDIUM').length,
          low: impacts.filter(i => i.severity === 'LOW').length,
          minimal: impacts.filter(i => i.severity === 'MINIMAL').length,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/crucible/simulations/:id/council
 * Get Council AI deliberations from a simulation
 */
router.get('/simulations/:id/council', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const simulation = await cendiaCrucibleService.getSimulation(req.params.id);

    if (!simulation) {
      throw errors.notFound('Simulation');
    }

    if (simulation.organization_id !== req.organizationId) {
      throw errors.forbidden();
    }

    res.json({
      success: true,
      data: simulation.council_deliberations,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/crucible/quick-simulate
 * Run a quick simulation without saving
 */
router.post('/quick-simulate', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { simulationType, customShocks } = req.body;

    if (!simulationType) {
      throw errors.badRequest('Simulation type is required');
    }

    const template = SCENARIO_TEMPLATES[simulationType as keyof typeof SCENARIO_TEMPLATES];
    if (!template && !customShocks) {
      throw errors.badRequest('Invalid simulation type');
    }

    // Create temporary simulation
    const simulation = await cendiaCrucibleService.createSimulation(
      req.organizationId!,
      req.user!.id,
      {
        name: `Quick Sim - ${new Date().toISOString()}`,
        description: 'Quick simulation run',
        simulationType,
        config: {
          monteCarloRuns: 100, // Fewer runs for quick sim
          confidenceLevel: 0.90,
          timeHorizonDays: 90,
          variables: [],
          constraints: [],
        },
        scenarioDefinition: customShocks ? { ...template, shocks: customShocks } : template,
      }
    );

    // Run immediately — pass mode through
    const mode = req.body?.mode === 'express' ? 'express' : 'deliberative';
    const result = await cendiaCrucibleService.runSimulation(simulation.id, { mode });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/crucible/resilience
 * Get real-time resilience scores from organization data
 */
router.get('/resilience', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const resilience = await cendiaCrucibleService.getResilienceScores(req.organizationId!);

    res.json({
      success: true,
      data: resilience,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/crucible/benchmarks
 * Get industry benchmarks for comparison
 */
router.get('/benchmarks', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const benchmarks = await cendiaCrucibleService.getIndustryBenchmarks(req.organizationId!);

    res.json({
      success: true,
      data: benchmarks,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/crucible/recommendations
 * Get scenario recommendations based on organization weaknesses
 */
router.get('/recommendations', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const recommendations = await cendiaCrucibleService.getScenarioRecommendations(req.organizationId!);

    res.json({
      success: true,
      data: recommendations,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/crucible/recent
 * Get recent simulations with summary
 */
router.get('/recent', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit = '5' } = req.query;
    const recentSimulations = await cendiaCrucibleService.getRecentSimulations(
      req.organizationId!,
      parseInt(limit as string)
    );

    res.json({
      success: true,
      data: recentSimulations,
    });
  } catch (error) {
    next(error);
  }
});

// ===========================================================================
// EXPRESS MODE — Quick Intelligence Without Council
// ===========================================================================

/**
 * POST /crucible/express/quick-sim
 * Quick 3-outcome scenario analysis (no Council needed)
 */
router.post('/express/quick-sim', devAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { scenarioType, description } = req.body;
    if (!scenarioType) {
      return res.status(400).json({ success: false, error: { message: 'scenarioType is required' } });
    }
    const result = await cendiaCrucibleService.getQuickSimulation(
      req.organizationId!,
      scenarioType,
      description
    );
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /crucible/express/resilience
 * Resilience score without full simulation (no Council needed)
 */
router.get('/express/resilience', devAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const score = await cendiaCrucibleService.getResilienceScore(req.organizationId!);
    res.json({ success: true, data: score });
  } catch (error) {
    next(error);
  }
});

// ===========================================================================
// 10/10 ENHANCEMENTS — Advanced Simulation Intelligence
// ===========================================================================

/**
 * POST /crucible/sensitivity
 * Sensitivity analysis — how outcomes change when variables shift
 */
router.post('/sensitivity', devAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { simulationId } = req.body;
    if (!simulationId) {
      return res.status(400).json({ success: false, error: { message: 'simulationId is required' } });
    }
    const result = await cendiaCrucibleService.runSensitivityAnalysis(simulationId);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /crucible/calibrate
 * Historical calibration — compare predictions vs Echo actuals
 */
router.post('/calibrate', devAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await cendiaCrucibleService.calibrateModel(req.organizationId!);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /crucible/correlations
 * Scenario correlations — find how scenarios interact
 */
router.post('/correlations', devAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await cendiaCrucibleService.analyzeScenarioCorrelations(req.organizationId!);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /crucible/library
 * Scenario library — industry presets + saved scenarios
 */
router.get('/library', devAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await cendiaCrucibleService.getScenarioLibrary(req.organizationId!);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

export default router;
