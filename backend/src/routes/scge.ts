/**
 * API Routes — Scge
 *
 * Express route handler defining REST endpoints.
 * @module routes/scge
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * SCGE API Routes
 * Synthetic Civic Governance Environment - Decision Verification Infrastructure
 */

import { Router, Request, Response } from 'express';
import { logger } from '../utils/logger.js';
import {
  scgeOrchestrator,
  syntheticPopulationService,
  policyInjectionService,
  eventInjectionService,
  stressorLibraryService,
  DEFAULT_EVENT_SCENARIOS,
  DEFAULT_POLICY_TEMPLATES,
  DEFAULT_GOVERNANCE_PRESETS,
  DEFAULT_STRESSOR_LIBRARY,
  SimulationConfig,
  PopulationParameters,
  AccessVariance,
  InformationAsymmetry,
  MobilityConstraint,
  ResourceScarcity,
  ComplianceVariance,
  PolicyDomain,
  generateSCGEId,
} from '../services/scge/index.js';

const router = Router();

// =============================================================================
// HEALTH & STATUS
// =============================================================================

router.get('/health', (_req: Request, res: Response) => {
  const stats = scgeOrchestrator.getStatistics();
  res.json({
    status: 'healthy',
    version: '1.0.0',
    system: 'SCGE - Synthetic Civic Governance Environment',
    statistics: stats,
    capabilities: {
      population: true,
      policies: true,
      events: true,
      stressors: true,
      simulation: true,
      replay: true,
    },
  });
});

// =============================================================================
// POPULATION ENDPOINTS
// =============================================================================

router.post('/population/generate', (req: Request, res: Response) => {
  try {
    const params: PopulationParameters = {
      size: req.body.size || 100000,
      accessVarianceLevel: req.body.accessVarianceLevel || AccessVariance.MODERATE,
      informationAsymmetryLevel: req.body.informationAsymmetryLevel || InformationAsymmetry.MODERATE,
      mobilityConstraintLevel: req.body.mobilityConstraintLevel || MobilityConstraint.LIMITED,
      resourceScarcityLevel: req.body.resourceScarcityLevel || ResourceScarcity.CONSTRAINED,
      complianceVarianceLevel: req.body.complianceVarianceLevel || ComplianceVariance.MODERATE_COMPLIANCE,
      seed: req.body.seed,
    };

    const population = syntheticPopulationService.generatePopulation(params);

    res.json({
      success: true,
      population: {
        id: population.id,
        name: population.name,
        totalSize: population.totalSize,
        distributions: population.distributions,
        generationSeed: population.generationSeed,
        hash: population.hash,
        metadata: population.metadata,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: 'Population generation failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

router.get('/population/:id', (req: Request, res: Response) => {
  const population = syntheticPopulationService.getPopulation(req.params['id'] || '');
  if (!population) {
    res.status(404).json({ error: 'Population not found' });
    return;
  }
  res.json({ population });
});

router.get('/populations', (_req: Request, res: Response) => {
  const populations = syntheticPopulationService.listPopulations();
  res.json({
    count: populations.length,
    populations: populations.map(p => ({
      id: p.id,
      name: p.name,
      totalSize: p.totalSize,
      generationSeed: p.generationSeed,
    })),
  });
});

// =============================================================================
// POLICY ENDPOINTS
// =============================================================================

router.get('/policies/templates', (_req: Request, res: Response) => {
  res.json({
    count: DEFAULT_POLICY_TEMPLATES.length,
    templates: DEFAULT_POLICY_TEMPLATES.map(t => ({
      name: t.name,
      domain: t.domain,
      rulesCount: t.rules.length,
      constraintsCount: t.constraints.length,
    })),
  });
});

router.post('/policies', (req: Request, res: Response) => {
  try {
    const { name, domain, rules, constraints, metadata } = req.body;
    
    const policy = policyInjectionService.createPolicyBundle(
      name || 'Unnamed Policy',
      domain || PolicyDomain.ZONING,
      rules || [],
      constraints || [],
      metadata || {}
    );

    res.json({ success: true, policy });
  } catch (error) {
    res.status(500).json({
      error: 'Policy creation failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

router.get('/policies', (_req: Request, res: Response) => {
  const policies = policyInjectionService.listPolicies();
  res.json({
    count: policies.length,
    policies: policies.map(p => ({
      id: p.id,
      name: p.name,
      domain: p.domain,
      version: p.version,
      status: p.status,
      rulesCount: p.rules.length,
    })),
  });
});

router.get('/policies/:id', (req: Request, res: Response) => {
  const policy = policyInjectionService.getPolicy(req.params['id'] || '');
  if (!policy) {
    res.status(404).json({ error: 'Policy not found' });
    return;
  }
  res.json({ policy });
});

router.post('/policies/:id/activate', (req: Request, res: Response) => {
  try {
    const policy = policyInjectionService.activatePolicy(req.params['id'] || '');
    res.json({ success: true, policy });
  } catch (error) {
    res.status(500).json({
      error: 'Policy activation failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

router.post('/policies/:id/evaluate', (req: Request, res: Response) => {
  try {
    const result = policyInjectionService.evaluateDecision(
      req.params['id'] || '',
      req.body.context || {}
    );
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({
      error: 'Policy evaluation failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// =============================================================================
// EVENT ENDPOINTS
// =============================================================================

router.get('/events/scenarios', (_req: Request, res: Response) => {
  res.json({
    count: DEFAULT_EVENT_SCENARIOS.length,
    scenarios: DEFAULT_EVENT_SCENARIOS.map(s => ({
      id: s.id,
      name: s.name,
      description: s.description,
      eventCount: s.eventTemplates.length,
    })),
  });
});

router.post('/events/sequence', (req: Request, res: Response) => {
  try {
    const { scenarioId, seed } = req.body;
    const scenario = DEFAULT_EVENT_SCENARIOS.find(s => s.id === scenarioId);
    
    if (!scenario) {
      res.status(400).json({ error: 'Scenario not found' });
      return;
    }

    const sequence = eventInjectionService.generateScenarioSequence(
      scenario,
      seed || Date.now()
    );

    res.json({ success: true, sequence });
  } catch (error) {
    res.status(500).json({
      error: 'Event sequence generation failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

router.get('/events/sequences', (_req: Request, res: Response) => {
  const sequences = eventInjectionService.listSequences();
  res.json({
    count: sequences.length,
    sequences: sequences.map(s => ({
      id: s.id,
      name: s.name,
      eventCount: s.events.length,
      totalDuration: s.totalDuration,
    })),
  });
});

// =============================================================================
// STRESSOR ENDPOINTS
// =============================================================================

router.get('/stressors', (_req: Request, res: Response) => {
  const stressors = stressorLibraryService.listStressors();
  res.json({
    count: stressors.length,
    stressors: stressors.map(s => ({
      id: s.id,
      name: s.name,
      type: s.type,
      intensity: s.intensity,
      duration: s.duration,
    })),
  });
});

router.get('/stressors/library', (_req: Request, res: Response) => {
  res.json({
    count: DEFAULT_STRESSOR_LIBRARY.length,
    stressors: DEFAULT_STRESSOR_LIBRARY,
  });
});

router.post('/stressors/schedule', (req: Request, res: Response) => {
  try {
    const { stressorCount, maxDuration, seed } = req.body;
    
    const schedule = stressorLibraryService.generateRandomSchedule(
      stressorCount || 4,
      maxDuration || 168,
      seed || Date.now()
    );

    res.json({ success: true, schedule });
  } catch (error) {
    res.status(500).json({
      error: 'Stressor schedule generation failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

router.post('/stressors/impact', (req: Request, res: Response) => {
  try {
    const { stressorIds } = req.body;
    const stressors = stressorIds
      .map((id: string) => stressorLibraryService.getStressor(id))
      .filter(Boolean);

    if (stressors.length === 0) {
      res.status(400).json({ error: 'No valid stressors provided' });
      return;
    }

    const impact = stressorLibraryService.calculateCombinedImpact(stressors);
    res.json({ success: true, impact });
  } catch (error) {
    res.status(500).json({
      error: 'Impact calculation failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// =============================================================================
// GOVERNANCE PRESETS
// =============================================================================

router.get('/governance/presets', (_req: Request, res: Response) => {
  res.json({
    count: DEFAULT_GOVERNANCE_PRESETS.length,
    presets: DEFAULT_GOVERNANCE_PRESETS,
  });
});

// =============================================================================
// SIMULATION ENDPOINTS
// =============================================================================

router.post('/simulation', async (req: Request, res: Response) => {
  try {
    const { name, description, populationParams, policyIds, scenarioId, stressorConfig, seed, maxDuration } = req.body;

    // Generate population
    const population = syntheticPopulationService.generatePopulation({
      size: populationParams?.size || 100000,
      accessVarianceLevel: populationParams?.accessVarianceLevel || AccessVariance.MODERATE,
      informationAsymmetryLevel: populationParams?.informationAsymmetryLevel || InformationAsymmetry.MODERATE,
      mobilityConstraintLevel: populationParams?.mobilityConstraintLevel || MobilityConstraint.LIMITED,
      resourceScarcityLevel: populationParams?.resourceScarcityLevel || ResourceScarcity.CONSTRAINED,
      complianceVarianceLevel: populationParams?.complianceVarianceLevel || ComplianceVariance.MODERATE_COMPLIANCE,
      seed: seed || Date.now(),
    });

    // Get or create policies
    const policies = (policyIds || [])
      .map((id: string) => policyInjectionService.getPolicy(id))
      .filter(Boolean);

    // Generate event sequence
    const scenario = DEFAULT_EVENT_SCENARIOS.find(s => s.id === scenarioId) || DEFAULT_EVENT_SCENARIOS[0]!;
    const eventSequence = eventInjectionService.generateScenarioSequence(scenario, seed || Date.now());
    const eventConfig = eventInjectionService.createInjectionConfig(eventSequence);

    // Generate stressor schedule
    const stressorSchedule = stressorLibraryService.generateRandomSchedule(
      stressorConfig?.count || 4,
      maxDuration || 168,
      seed || Date.now()
    );

    // Create simulation config
    const config: SimulationConfig = {
      id: generateSCGEId('config'),
      name: name || 'SCGE Simulation',
      description: description || 'Synthetic civic governance simulation',
      population: {
        size: population.totalSize,
        accessVarianceLevel: AccessVariance.MODERATE,
        informationAsymmetryLevel: InformationAsymmetry.MODERATE,
        mobilityConstraintLevel: MobilityConstraint.LIMITED,
        resourceScarcityLevel: ResourceScarcity.CONSTRAINED,
        complianceVarianceLevel: ComplianceVariance.MODERATE_COMPLIANCE,
        seed: population.generationSeed,
      },
      governance: DEFAULT_GOVERNANCE_PRESETS[0] as any,
      policies,
      events: eventConfig,
      stressors: stressorSchedule,
      institutions: [],
      seed: seed || Date.now(),
      timeScale: 1.0,
      maxDuration: maxDuration || 168,
      auditLevel: 'comprehensive',
    };

    // Run simulation
    const result = await scgeOrchestrator.runSimulation(config);

    res.json({
      success: true,
      resultId: result.id,
      summary: result.summary,
      outcomes: {
        equityScore: result.outcomes.equityScore,
        trustDelta: result.outcomes.trustDelta,
        outcomeVariance: result.outcomes.outcomeVariance,
        biasIndicatorsCount: result.outcomes.biasIndicators.length,
      },
      replay: {
        bundleId: result.replayBundle.id,
        seed: result.replayBundle.seed,
        expectedHash: result.replayBundle.expectedHash,
      },
    });
  } catch (error) {
    logger.error('Simulation error:', error);
    res.status(500).json({
      error: 'Simulation failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

router.get('/simulation/:id', (req: Request, res: Response) => {
  const result = scgeOrchestrator.getCompletedSimulation(req.params['id'] || '');
  if (!result) {
    res.status(404).json({ error: 'Simulation not found' });
    return;
  }

  res.json({
    id: result.id,
    configId: result.configId,
    startTime: result.startTime,
    endTime: result.endTime,
    summary: result.summary,
    outcomes: result.outcomes,
    auditPacket: {
      id: result.auditPacket.id,
      entryCount: result.auditPacket.entries.length,
      merkleRoot: result.auditPacket.merkleRoot,
      integrityHash: result.auditPacket.integrityHash,
    },
    replayBundle: result.replayBundle,
  });
});

router.get('/simulation/:id/full', (req: Request, res: Response) => {
  const result = scgeOrchestrator.getCompletedSimulation(req.params['id'] || '');
  if (!result) {
    res.status(404).json({ error: 'Simulation not found' });
    return;
  }
  res.json(result);
});

router.get('/simulation/:id/audit', (req: Request, res: Response) => {
  const result = scgeOrchestrator.getCompletedSimulation(req.params['id'] || '');
  if (!result) {
    res.status(404).json({ error: 'Simulation not found' });
    return;
  }
  res.json(result.auditPacket);
});

router.get('/simulation/:id/replay', (req: Request, res: Response) => {
  const result = scgeOrchestrator.getCompletedSimulation(req.params['id'] || '');
  if (!result) {
    res.status(404).json({ error: 'Simulation not found' });
    return;
  }
  res.json(result.replayBundle);
});

router.get('/simulations', (_req: Request, res: Response) => {
  const active = scgeOrchestrator.listActiveSimulations();
  const completed = scgeOrchestrator.listCompletedSimulations();

  res.json({
    active: {
      count: active.length,
      simulations: active.map(s => ({
        id: s.id,
        phase: s.phase,
        currentTime: s.currentTime,
      })),
    },
    completed: {
      count: completed.length,
      simulations: completed.map(r => ({
        id: r.id,
        configId: r.configId,
        startTime: r.startTime,
        endTime: r.endTime,
        summary: r.summary,
      })),
    },
  });
});

router.get('/statistics', (_req: Request, res: Response) => {
  const stats = scgeOrchestrator.getStatistics();
  res.json(stats);
});

export default router;
