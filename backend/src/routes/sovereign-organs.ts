/**
 * API Routes — Sovereign Organs
 *
 * Express route handler defining REST endpoints.
 * @module routes/sovereign-organs
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// SOVEREIGN ORGAN ROUTES - Layer 4 Services
// Mirror, Witness, Oracle, Legacy
// =============================================================================

import { Router, Request, Response } from 'express';
import { cendiaMirrorService } from '../services/sovereign/CendiaMirrorService.js';
import { cendiaWitnessService } from '../services/sovereign/CendiaWitnessService.js';
import { cendiaOracleService } from '../services/sovereign/CendiaOracleService.js';
import { cendiaLegacyService } from '../services/sovereign/CendiaLegacyService.js';
import { getErrorMessage } from '../utils/errors.js';

const router = Router();

// =============================================================================
// CENDIA MIRROR� - Digital Twin
// =============================================================================

router.get('/mirror/dashboard', async (req: Request, res: Response) => {
  try {
    const organizationId = (req.query.organizationId as string) || 'demo';
    
    // Enterprise Platinum: No auto-seeding - data from real operations only
    const dashboard = await cendiaMirrorService.getDashboard(organizationId);
    res.json({ success: true, data: dashboard });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/mirror/twins', async (req: Request, res: Response) => {
  try {
    const organizationId = (req.query.organizationId as string) || 'demo';
    const twins = await cendiaMirrorService.getTwinsForOrg(organizationId);
    res.json({ success: true, data: twins });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/mirror/twins/:id', async (req: Request, res: Response) => {
  try {
    const twin = await cendiaMirrorService.getTwin(req.params.id);
    if (!twin) {
      return res.status(404).json({ success: false, error: 'Twin not found' });
    }
    res.json({ success: true, data: twin });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.post('/mirror/twins/:id/sync', async (req: Request, res: Response) => {
  try {
    const twin = await cendiaMirrorService.syncTwin(req.params.id, req.body.state);
    if (!twin) {
      return res.status(404).json({ success: false, error: 'Twin not found' });
    }
    res.json({ success: true, data: twin });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/mirror/twins/:id/snapshots', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const snapshots = await cendiaMirrorService.getSnapshots(req.params.id, limit);
    res.json({ success: true, data: snapshots });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.post('/mirror/scenarios', async (req: Request, res: Response) => {
  try {
    const scenario = await cendiaMirrorService.createScenario(req.body);
    res.json({ success: true, data: scenario });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.post('/mirror/scenarios/:id/run', async (req: Request, res: Response) => {
  try {
    const result = await cendiaMirrorService.runSimulation(req.params.id);
    res.json({ success: true, data: result });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

// =============================================================================
// CENDIA WITNESS� - Legal Observer
// =============================================================================

router.get('/witness/dashboard', async (req: Request, res: Response) => {
  try {
    const organizationId = (req.query.organizationId as string) || 'demo';
    
    // Enterprise Platinum: No auto-seeding - data from real operations only
    const dashboard = await cendiaWitnessService.getDashboard(organizationId);
    res.json({ success: true, data: dashboard });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/witness/records', async (req: Request, res: Response) => {
  try {
    const organizationId = (req.query.organizationId as string) || 'demo';
    const filters = {
      eventType: req.query.eventType as string,
      legalRelevance: req.query.legalRelevance as string,
    };
    const records = await cendiaWitnessService.getRecordsForOrg(organizationId, filters);
    res.json({ success: true, data: records });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/witness/records/:id', async (req: Request, res: Response) => {
  try {
    const record = await cendiaWitnessService.getWitnessRecord(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, error: 'Record not found' });
    }
    res.json({ success: true, data: record });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/witness/records/:id/integrity', async (req: Request, res: Response) => {
  try {
    const result = await cendiaWitnessService.verifyRecordIntegrity(req.params.id);
    res.json({ success: true, data: result });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/witness/records/:id/custody', async (req: Request, res: Response) => {
  try {
    const chain = await cendiaWitnessService.getChainOfCustody(req.params.id);
    res.json({ success: true, data: chain });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/witness/legal-holds', async (req: Request, res: Response) => {
  try {
    const organizationId = (req.query.organizationId as string) || 'demo';
    const holds = await cendiaWitnessService.getActiveLegalHolds(organizationId);
    res.json({ success: true, data: holds });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/witness/discovery', async (req: Request, res: Response) => {
  try {
    const organizationId = (req.query.organizationId as string) || 'demo';
    const requests = await cendiaWitnessService.getDiscoveryRequests(organizationId);
    res.json({ success: true, data: requests });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

// =============================================================================
// CENDIA ORACLE� - Truth Arbiter
// =============================================================================

router.get('/oracle/dashboard', async (req: Request, res: Response) => {
  try {
    const organizationId = (req.query.organizationId as string) || 'demo';
    
    // Enterprise Platinum: No auto-seeding - data from real operations only
    const dashboard = await cendiaOracleService.getDashboard(organizationId);
    res.json({ success: true, data: dashboard });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/oracle/claims', async (req: Request, res: Response) => {
  try {
    const organizationId = (req.query.organizationId as string) || 'demo';
    const filters = {
      status: req.query.status as string,
      category: req.query.category as string,
    };
    const claims = await cendiaOracleService.getClaimsForOrg(organizationId, filters);
    res.json({ success: true, data: claims });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/oracle/claims/:id', async (req: Request, res: Response) => {
  try {
    const claim = await cendiaOracleService.getClaim(req.params.id);
    if (!claim) {
      return res.status(404).json({ success: false, error: 'Claim not found' });
    }
    res.json({ success: true, data: claim });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.post('/oracle/claims', async (req: Request, res: Response) => {
  try {
    const claim = await cendiaOracleService.submitClaim(req.body);
    res.json({ success: true, data: claim });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.post('/oracle/claims/:id/evidence', async (req: Request, res: Response) => {
  try {
    const evidence = await cendiaOracleService.submitEvidence(req.params.id, req.body);
    res.json({ success: true, data: evidence });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.post('/oracle/claims/:id/verify', async (req: Request, res: Response) => {
  try {
    const { verifiedBy } = req.body;
    const result = await cendiaOracleService.verifyClaim(req.params.id, verifiedBy);
    res.json({ success: true, data: result });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/oracle/claims/:id/votes', async (req: Request, res: Response) => {
  try {
    const votes = await cendiaOracleService.getVotesForClaim(req.params.id);
    res.json({ success: true, data: votes });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/oracle/disputes', async (req: Request, res: Response) => {
  try {
    const organizationId = (req.query.organizationId as string) || 'demo';
    const disputes = await cendiaOracleService.getDisputesForOrg(organizationId);
    res.json({ success: true, data: disputes });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

// =============================================================================
// CENDIA LEGACY� - Knowledge Archive
// =============================================================================

router.get('/legacy/dashboard', async (req: Request, res: Response) => {
  try {
    const organizationId = (req.query.organizationId as string) || 'demo';
    
    // Enterprise Platinum: No auto-seeding - data from real operations only
    const dashboard = await cendiaLegacyService.getDashboard(organizationId);
    res.json({ success: true, data: dashboard });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/legacy/articles', async (req: Request, res: Response) => {
  try {
    const organizationId = (req.query.organizationId as string) || 'demo';
    const filters = {
      category: req.query.category as string,
      status: req.query.status as string,
    };
    const articles = await cendiaLegacyService.getArticlesForOrg(organizationId, filters);
    res.json({ success: true, data: articles });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/legacy/articles/:id', async (req: Request, res: Response) => {
  try {
    const article = await cendiaLegacyService.getArticle(req.params.id);
    if (!article) {
      return res.status(404).json({ success: false, error: 'Article not found' });
    }
    res.json({ success: true, data: article });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/legacy/articles/:id/versions', async (req: Request, res: Response) => {
  try {
    const versions = await cendiaLegacyService.getVersionHistory(req.params.id);
    res.json({ success: true, data: versions });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/legacy/memories', async (req: Request, res: Response) => {
  try {
    const organizationId = (req.query.organizationId as string) || 'demo';
    const type = req.query.type as string;
    const memories = await cendiaLegacyService.getMemoriesForOrg(organizationId, type);
    res.json({ success: true, data: memories });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/legacy/experts', async (req: Request, res: Response) => {
  try {
    const organizationId = (req.query.organizationId as string) || 'demo';
    const area = req.query.area as string;
    const experts = await cendiaLegacyService.findExperts(organizationId, area);
    res.json({ success: true, data: experts });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/legacy/transfers', async (req: Request, res: Response) => {
  try {
    const organizationId = (req.query.organizationId as string) || 'demo';
    const transfers = await cendiaLegacyService.getTransfersForOrg(organizationId);
    res.json({ success: true, data: transfers });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/legacy/search', async (req: Request, res: Response) => {
  try {
    const organizationId = (req.query.organizationId as string) || 'demo';
    const query = req.query.q as string;
    if (!query) {
      return res.status(400).json({ success: false, error: 'Query parameter required' });
    }
    const results = await cendiaLegacyService.search(organizationId, query);
    res.json({ success: true, data: results });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

export default router;
