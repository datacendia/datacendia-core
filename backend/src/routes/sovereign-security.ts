// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// SOVEREIGN SECURITY ROUTES - Layer 6 Services
// Mirage, Key, Mesh, BlackBox, Glass
// =============================================================================

import { Router, Request, Response } from 'express';
import { cendiaMirageService } from '../services/sovereign/CendiaMirageService.js';
import { cendiaKeyService } from '../services/sovereign/CendiaKeyService.js';
import { cendiaMeshService } from '../services/sovereign/CendiaMeshService.js';
import { cendiaBlackBoxService } from '../services/sovereign/CendiaBlackBoxService.js';
import { cendiaGlassService } from '../services/sovereign/CendiaGlassService.js';
import { getErrorMessage } from '../utils/errors.js';

const router = Router();

// =============================================================================
// CENDIA MIRAGE™ - Deception Technology
// =============================================================================

router.get('/mirage/dashboard', async (req: Request, res: Response) => {
  try {
    const organizationId = (req.query.organizationId as string) || 'demo';
    
    // Enterprise Platinum: No auto-seeding - data from real operations only
    const dashboard = await cendiaMirageService.getDashboard(organizationId);
    res.json({ success: true, data: dashboard });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/mirage/honeytokens', async (req: Request, res: Response) => {
  try {
    const organizationId = (req.query.organizationId as string) || 'demo';
    const honeytokens = await cendiaMirageService.getHoneytokens(organizationId);
    res.json({ success: true, data: honeytokens });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/mirage/honeytokens/triggered', async (req: Request, res: Response) => {
  try {
    const organizationId = (req.query.organizationId as string) || 'demo';
    const triggered = await cendiaMirageService.getTriggeredHoneytokens(organizationId);
    res.json({ success: true, data: triggered });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/mirage/canaries', async (req: Request, res: Response) => {
  try {
    const organizationId = (req.query.organizationId as string) || 'demo';
    const canaries = await cendiaMirageService.getCanaries(organizationId);
    res.json({ success: true, data: canaries });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/mirage/alerts', async (req: Request, res: Response) => {
  try {
    const organizationId = (req.query.organizationId as string) || 'demo';
    const alerts = await cendiaMirageService.getCanaryAlerts(organizationId);
    res.json({ success: true, data: alerts });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/mirage/sandboxes', async (req: Request, res: Response) => {
  try {
    const organizationId = (req.query.organizationId as string) || 'demo';
    const sandboxes = await cendiaMirageService.getSandboxes(organizationId);
    res.json({ success: true, data: sandboxes });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/mirage/intelligence', async (req: Request, res: Response) => {
  try {
    const organizationId = (req.query.organizationId as string) || 'demo';
    const intel = await cendiaMirageService.getThreatIntelligence(organizationId);
    res.json({ success: true, data: intel });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

// =============================================================================
// CENDIA KEY™ - Hardware Authentication
// =============================================================================

router.get('/key/dashboard', async (req: Request, res: Response) => {
  try {
    const organizationId = (req.query.organizationId as string) || 'demo';
    
    // Enterprise Platinum: No auto-seeding - data from real operations only
    const dashboard = await cendiaKeyService.getDashboard(organizationId);
    res.json({ success: true, data: dashboard });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/key/keys', async (req: Request, res: Response) => {
  try {
    const organizationId = (req.query.organizationId as string) || 'demo';
    const keys = await cendiaKeyService.getKeysForOrg(organizationId);
    res.json({ success: true, data: keys });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/key/keys/:id', async (req: Request, res: Response) => {
  try {
    const key = await cendiaKeyService.getKey(req.params.id);
    if (!key) {
      return res.status(404).json({ success: false, error: 'Key not found' });
    }
    res.json({ success: true, data: key });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/key/keys/:id/audit', async (req: Request, res: Response) => {
  try {
    const audit = await cendiaKeyService.getKeyAuditLog(req.params.id);
    res.json({ success: true, data: audit });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/key/operations', async (req: Request, res: Response) => {
  try {
    const organizationId = (req.query.organizationId as string) || 'demo';
    const operations = await cendiaKeyService.getOperations(organizationId);
    res.json({ success: true, data: operations });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/key/attempts', async (req: Request, res: Response) => {
  try {
    const organizationId = (req.query.organizationId as string) || 'demo';
    const limit = parseInt(req.query.limit as string) || 50;
    const attempts = await cendiaKeyService.getRecentAttempts(organizationId, limit);
    res.json({ success: true, data: attempts });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.post('/key/challenge', async (req: Request, res: Response) => {
  try {
    const { keyId, operation } = req.body;
    const challenge = await cendiaKeyService.createChallenge(keyId, operation);
    res.json({ success: true, data: challenge });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.post('/key/verify', async (req: Request, res: Response) => {
  try {
    const { challengeId, response } = req.body;
    const result = await cendiaKeyService.verifyChallenge(challengeId, response);
    res.json({ success: true, data: result });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

// =============================================================================
// CENDIA MESH™ - Encrypted Networking
// =============================================================================

router.get('/mesh/dashboard', async (req: Request, res: Response) => {
  try {
    const organizationId = (req.query.organizationId as string) || 'demo';
    
    // Enterprise Platinum: No auto-seeding - data from real operations only
    const dashboard = await cendiaMeshService.getDashboard(organizationId);
    res.json({ success: true, data: dashboard });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/mesh/topology', async (req: Request, res: Response) => {
  try {
    const organizationId = (req.query.organizationId as string) || 'demo';
    const topology = await cendiaMeshService.getTopology(organizationId);
    res.json({ success: true, data: topology });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/mesh/nodes', async (req: Request, res: Response) => {
  try {
    const organizationId = (req.query.organizationId as string) || 'demo';
    const nodes = await cendiaMeshService.getNodesForOrg(organizationId);
    res.json({ success: true, data: nodes });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/mesh/nodes/:id', async (req: Request, res: Response) => {
  try {
    const node = await cendiaMeshService.getNode(req.params.id);
    if (!node) {
      return res.status(404).json({ success: false, error: 'Node not found' });
    }
    res.json({ success: true, data: node });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/mesh/connections', async (req: Request, res: Response) => {
  try {
    const organizationId = (req.query.organizationId as string) || 'demo';
    const connections = await cendiaMeshService.getConnections(organizationId);
    res.json({ success: true, data: connections });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/mesh/channels', async (req: Request, res: Response) => {
  try {
    const organizationId = (req.query.organizationId as string) || 'demo';
    const channels = await cendiaMeshService.getActiveChannels(organizationId);
    res.json({ success: true, data: channels });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/mesh/events', async (req: Request, res: Response) => {
  try {
    const organizationId = (req.query.organizationId as string) || 'demo';
    const limit = parseInt(req.query.limit as string) || 100;
    const events = await cendiaMeshService.getEvents(organizationId, limit);
    res.json({ success: true, data: events });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/mesh/policies', async (req: Request, res: Response) => {
  try {
    const organizationId = (req.query.organizationId as string) || 'demo';
    const policies = await cendiaMeshService.getPolicies(organizationId);
    res.json({ success: true, data: policies });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

// =============================================================================
// CENDIA BLACK BOX™ - Disaster Storage
// =============================================================================

router.get('/blackbox/dashboard', async (req: Request, res: Response) => {
  try {
    const organizationId = (req.query.organizationId as string) || 'demo';
    
    // Enterprise Platinum: No auto-seeding - data from real operations only
    const dashboard = await cendiaBlackBoxService.getDashboard(organizationId);
    res.json({ success: true, data: dashboard });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/blackbox/units', async (req: Request, res: Response) => {
  try {
    const organizationId = (req.query.organizationId as string) || 'demo';
    const units = await cendiaBlackBoxService.getUnitsForOrg(organizationId);
    res.json({ success: true, data: units });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/blackbox/units/:id', async (req: Request, res: Response) => {
  try {
    const unit = await cendiaBlackBoxService.getUnit(req.params.id);
    if (!unit) {
      return res.status(404).json({ success: false, error: 'Unit not found' });
    }
    res.json({ success: true, data: unit });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/blackbox/jobs', async (req: Request, res: Response) => {
  try {
    const organizationId = (req.query.organizationId as string) || 'demo';
    const status = req.query.status as string;
    const jobs = await cendiaBlackBoxService.getJobs(organizationId, status);
    res.json({ success: true, data: jobs });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/blackbox/records', async (req: Request, res: Response) => {
  try {
    const organizationId = (req.query.organizationId as string) || 'demo';
    const sourceType = req.query.sourceType as string;
    const records = await cendiaBlackBoxService.getStoredRecords(organizationId, sourceType);
    res.json({ success: true, data: records });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/blackbox/recoveries', async (req: Request, res: Response) => {
  try {
    const organizationId = (req.query.organizationId as string) || 'demo';
    const recoveries = await cendiaBlackBoxService.getRecoveries(organizationId);
    res.json({ success: true, data: recoveries });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/blackbox/reports', async (req: Request, res: Response) => {
  try {
    const organizationId = (req.query.organizationId as string) || 'demo';
    const reports = await cendiaBlackBoxService.getIntegrityReports(organizationId);
    res.json({ success: true, data: reports });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.post('/blackbox/units/:id/verify', async (req: Request, res: Response) => {
  try {
    const report = await cendiaBlackBoxService.runIntegrityCheck(req.params.id);
    res.json({ success: true, data: report });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

// =============================================================================
// CENDIA GLASS™ - AR Integration
// =============================================================================

router.get('/glass/dashboard', async (req: Request, res: Response) => {
  try {
    const organizationId = (req.query.organizationId as string) || 'demo';
    
    // Enterprise Platinum: No auto-seeding - data from real operations only
    const dashboard = await cendiaGlassService.getDashboard(organizationId);
    res.json({ success: true, data: dashboard });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/glass/devices', async (req: Request, res: Response) => {
  try {
    const organizationId = (req.query.organizationId as string) || 'demo';
    const devices = await cendiaGlassService.getDevicesForOrg(organizationId);
    res.json({ success: true, data: devices });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/glass/devices/:id', async (req: Request, res: Response) => {
  try {
    const device = await cendiaGlassService.getDevice(req.params.id);
    if (!device) {
      return res.status(404).json({ success: false, error: 'Device not found' });
    }
    res.json({ success: true, data: device });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/glass/overlays', async (req: Request, res: Response) => {
  try {
    const organizationId = (req.query.organizationId as string) || 'demo';
    const type = req.query.type as string;
    const overlays = await cendiaGlassService.getOverlays(organizationId, type);
    res.json({ success: true, data: overlays });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/glass/overlays/:id/data', async (req: Request, res: Response) => {
  try {
    const data = await cendiaGlassService.getOverlayData(req.params.id);
    res.json({ success: true, data });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/glass/sessions', async (req: Request, res: Response) => {
  try {
    const organizationId = (req.query.organizationId as string) || 'demo';
    const sessions = await cendiaGlassService.getActiveSessions(organizationId);
    res.json({ success: true, data: sessions });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/glass/sessions/history', async (req: Request, res: Response) => {
  try {
    const organizationId = (req.query.organizationId as string) || 'demo';
    const limit = parseInt(req.query.limit as string) || 50;
    const sessions = await cendiaGlassService.getSessionHistory(organizationId, limit);
    res.json({ success: true, data: sessions });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/glass/anchors', async (req: Request, res: Response) => {
  try {
    const organizationId = (req.query.organizationId as string) || 'demo';
    const location = {
      building: req.query.building as string,
      floor: req.query.floor as string,
    };
    const anchors = await cendiaGlassService.getAnchors(organizationId, location);
    res.json({ success: true, data: anchors });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/glass/sessions/:id/council', async (req: Request, res: Response) => {
  try {
    const visualizations = await cendiaGlassService.getCouncilVisualization(req.params.id);
    res.json({ success: true, data: visualizations });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

export default router;
