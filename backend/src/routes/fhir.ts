// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// FHIR R4 API ROUTES — Healthcare Data Connector
// =============================================================================

import { Router, Request, Response } from 'express';
import { devAuth } from '../middleware/auth.js';
import { FHIRConnector } from '../services/verticals/healthcare/FHIRConnector.js';

const router = Router();

// Shared FHIR connector instance (configured via env or defaults)
const fhirConnector = new FHIRConnector({
  baseUrl: process.env.FHIR_BASE_URL || 'http://localhost:8080/fhir',
  clientId: process.env.FHIR_CLIENT_ID || 'datacendia-fhir',
  clientSecret: process.env.FHIR_CLIENT_SECRET,
  tokenUrl: process.env.FHIR_TOKEN_URL || 'http://localhost:8080/fhir/auth/token',
  scope: (process.env.FHIR_SCOPES || 'system/*.read system/Patient.read').split(' '),
  ehrVendor: (process.env.FHIR_EHR_VENDOR as any) || 'generic',
});

// Health (no auth)
router.get('/health', (_req: Request, res: Response) => {
  res.json({ success: true, data: { status: 'healthy', service: 'fhir', timestamp: new Date().toISOString() } });
});

router.get('/status', (_req: Request, res: Response) => {
  res.json({ success: true, data: fhirConnector.getStatus() });
});

router.use(devAuth);

// =============================================================================
// AUTHENTICATION
// =============================================================================

router.post('/authenticate', async (_req: Request, res: Response) => {
  try {
    const result = await fhirConnector.authenticate();
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

// =============================================================================
// RESOURCE OPERATIONS
// =============================================================================

router.get('/resource/:resourceType/:resourceId', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || 'system';
    const resource = await fhirConnector.read(
      req.params.resourceType as any,
      req.params.resourceId,
      userId,
    );
    if (!resource) return res.status(404).json({ success: false, error: 'Resource not found' });
    res.json({ success: true, data: resource });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

router.get('/resource/:resourceType', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || 'system';
    const params: Record<string, string> = {};
    for (const [key, val] of Object.entries(req.query)) {
      if (typeof val === 'string') params[key] = val;
    }
    const bundle = await fhirConnector.search(req.params.resourceType as any, params, userId);
    res.json({ success: true, data: bundle });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

router.post('/resource', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || 'system';
    const resource = await fhirConnector.create(req.body, userId);
    if (!resource) return res.status(500).json({ success: false, error: 'Failed to create resource' });
    res.status(201).json({ success: true, data: resource });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

// =============================================================================
// CONSENT MANAGEMENT
// =============================================================================

router.post('/consent', (req: Request, res: Response) => {
  try {
    const consent = fhirConnector.buildConsentResource({
      ...req.body,
      dateTime: new Date(req.body.dateTime || Date.now()),
    });
    res.json({ success: true, data: consent });
  } catch (err) {
    res.status(400).json({ success: false, error: (err as Error).message });
  }
});

// =============================================================================
// AUDIT
// =============================================================================

router.post('/audit-event', async (req: Request, res: Response) => {
  try {
    const event = await fhirConnector.createAuditEvent(req.body);
    res.json({ success: true, data: event });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

router.get('/access-log', (req: Request, res: Response) => {
  const since = req.query.since ? new Date(req.query.since as string) : undefined;
  const log = fhirConnector.getAccessLog(since);
  res.json({ success: true, data: log });
});

export default router;
