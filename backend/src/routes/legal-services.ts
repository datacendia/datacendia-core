// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * LEGAL SERVICES API ROUTES
 * 
 * Exposes CendiaVeto, CendiaGovern, and CendiaBridge services via REST API.
 */

import { Router, Request, Response } from 'express';
import { cendiaVetoService } from '../services/legal/CendiaVetoService';
import { cendiaGovernService } from '../services/legal/CendiaGovernService';
import { cendiaBridgeService } from '../services/legal/CendiaBridgeService';

const router = Router();

// =============================================================================
// CENDIA VETO ROUTES - Approval Gates
// =============================================================================

router.post('/veto/gates', async (req: Request, res: Response) => {
  try {
    const gate = await cendiaVetoService.createGate(req.body);
    res.json({ success: true, gate });
  } catch (error) {
    res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'Failed' });
  }
});

router.post('/veto/gates/:gateId/approve', async (req: Request, res: Response) => {
  try {
    const gateId = req.params['gateId'] || '';
    const gate = await cendiaVetoService.submitApproval({ gateId, ...req.body });
    res.json({ success: true, gate });
  } catch (error) {
    res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'Failed' });
  }
});

router.get('/veto/gates/:gateId', (req: Request, res: Response) => {
  const gateId = req.params['gateId'] || '';
  const gate = cendiaVetoService.getGate(gateId);
  if (!gate) {
    res.status(404).json({ success: false, error: 'Gate not found' });
    return;
  }
  res.json({ success: true, gate });
});

router.get('/veto/pending/:role', (req: Request, res: Response) => {
  const role = req.params['role'] || '';
  const gates = cendiaVetoService.getPendingGatesForRole(role as any);
  res.json({ success: true, gates });
});

router.get('/veto/matter/:matterId', (req: Request, res: Response) => {
  const matterId = req.params['matterId'] || '';
  const gates = cendiaVetoService.getGatesForMatter(matterId);
  res.json({ success: true, gates });
});

router.post('/veto/privilege-export', async (req: Request, res: Response) => {
  try {
    const gate = await cendiaVetoService.requestPrivilegeExportApproval(req.body);
    res.json({ success: true, gate });
  } catch (error) {
    res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'Failed' });
  }
});

router.post('/veto/ai-output', async (req: Request, res: Response) => {
  try {
    const gate = await cendiaVetoService.requestAIOutputApproval(req.body);
    res.json({ success: true, gate });
  } catch (error) {
    res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'Failed' });
  }
});

router.get('/veto/statistics', (_req: Request, res: Response) => {
  res.json({ success: true, statistics: cendiaVetoService.getStatistics() });
});

router.get('/veto/policies', (_req: Request, res: Response) => {
  res.json({ success: true, policies: cendiaVetoService.getAllPolicies() });
});

router.get('/veto/gates/:gateId/audit', (req: Request, res: Response) => {
  const gateId = req.params['gateId'] || '';
  res.json({ success: true, auditLog: cendiaVetoService.getAuditLog(gateId) });
});

router.get('/veto/audit/verify', (_req: Request, res: Response) => {
  res.json({ success: true, ...cendiaVetoService.verifyAuditIntegrity() });
});

// =============================================================================
// CENDIA GOVERN ROUTES - Policy Enforcement
// =============================================================================

router.post('/govern/check', async (req: Request, res: Response) => {
  try {
    const check = await cendiaGovernService.runComplianceCheck({ ...req.body, checkedBy: req.body.checkedBy || 'api' });
    res.json({ success: true, check });
  } catch (error) {
    res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'Failed' });
  }
});

router.get('/govern/violations', (req: Request, res: Response) => {
  const violations = cendiaGovernService.getOpenViolations({
    framework: req.query['framework'] as any,
    severity: req.query['severity'] as any,
    matterId: req.query['matterId'] as string,
  });
  res.json({ success: true, violations });
});

router.post('/govern/violations/:violationId/resolve', async (req: Request, res: Response) => {
  try {
    const violationId = req.params['violationId'] || '';
    const violation = await cendiaGovernService.resolveViolation(violationId, req.body);
    if (!violation) {
      res.status(404).json({ success: false, error: 'Violation not found' });
      return;
    }
    res.json({ success: true, violation });
  } catch (error) {
    res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'Failed' });
  }
});

router.get('/govern/frameworks/:framework/rules', (req: Request, res: Response) => {
  const framework = req.params['framework'] || '';
  res.json({ success: true, rules: cendiaGovernService.getRulesForFramework(framework as any) });
});

router.get('/govern/frameworks/:framework/config', (req: Request, res: Response) => {
  const framework = req.params['framework'] || '';
  const config = cendiaGovernService.getConfiguration(framework as any);
  if (!config) {
    res.status(404).json({ success: false, error: 'Framework not found' });
    return;
  }
  res.json({ success: true, config });
});

router.put('/govern/frameworks/:framework/config', (req: Request, res: Response) => {
  try {
    const framework = req.params['framework'] || '';
    cendiaGovernService.updateConfiguration({ framework: framework as any, ...req.body });
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'Failed' });
  }
});

router.get('/govern/statistics', (_req: Request, res: Response) => {
  res.json({ success: true, statistics: cendiaGovernService.getStatistics() });
});

router.get('/govern/frameworks', (_req: Request, res: Response) => {
  const frameworks = [
    { id: 'aba_model_rules', name: 'ABA Model Rules', description: 'American Bar Association Model Rules' },
    { id: 'sra_uk', name: 'SRA (UK)', description: 'Solicitors Regulation Authority Code' },
    { id: 'eu_ai_act', name: 'EU AI Act', description: 'European Union AI Act' },
    { id: 'gdpr', name: 'GDPR', description: 'General Data Protection Regulation' },
    { id: 'state_bar', name: 'State Bar Rules', description: 'State-specific bar rules' },
    { id: 'attorney_client_privilege', name: 'Attorney-Client Privilege', description: 'Common law privilege' },
    { id: 'work_product_doctrine', name: 'Work Product Doctrine', description: 'Hickman v. Taylor protection' },
  ];
  res.json({ success: true, frameworks });
});

// =============================================================================
// CENDIA BRIDGE ROUTES - Data Integration
// =============================================================================

router.post('/bridge/connectors', async (req: Request, res: Response) => {
  try {
    const connector = await cendiaBridgeService.registerConnector(req.body);
    res.json({ success: true, connector });
  } catch (error) {
    res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'Failed' });
  }
});

router.post('/bridge/connectors/:connectorId/connect', async (req: Request, res: Response) => {
  try {
    const connectorId = req.params['connectorId'] || '';
    const connector = await cendiaBridgeService.connect(connectorId);
    res.json({ success: true, connector });
  } catch (error) {
    res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'Failed' });
  }
});

router.post('/bridge/connectors/:connectorId/disconnect', async (req: Request, res: Response) => {
  try {
    const connectorId = req.params['connectorId'] || '';
    await cendiaBridgeService.disconnect(connectorId);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'Failed' });
  }
});

router.get('/bridge/connectors/:connectorId', (req: Request, res: Response) => {
  const connectorId = req.params['connectorId'] || '';
  const connector = cendiaBridgeService.getConnector(connectorId);
  if (!connector) {
    res.status(404).json({ success: false, error: 'Connector not found' });
    return;
  }
  res.json({ success: true, connector });
});

router.get('/bridge/connectors', (req: Request, res: Response) => {
  const connectors = cendiaBridgeService.listConnectors({
    type: req.query['type'] as any,
    status: req.query['status'] as any,
  });
  res.json({ success: true, connectors });
});

router.get('/bridge/connector-types', (_req: Request, res: Response) => {
  res.json({ success: true, types: cendiaBridgeService.getConnectorTypes() });
});

router.post('/bridge/ingest', async (req: Request, res: Response) => {
  try {
    const job = await cendiaBridgeService.startIngestJob(req.body);
    res.json({ success: true, job });
  } catch (error) {
    res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'Failed' });
  }
});

router.get('/bridge/jobs/:jobId', (req: Request, res: Response) => {
  const jobId = req.params['jobId'] || '';
  const job = cendiaBridgeService.getJob(jobId);
  if (!job) {
    res.status(404).json({ success: false, error: 'Job not found' });
    return;
  }
  res.json({ success: true, job });
});

router.get('/bridge/jobs', (req: Request, res: Response) => {
  const jobs = cendiaBridgeService.listJobs({
    connectorId: req.query['connectorId'] as string,
    status: req.query['status'] as any,
  });
  res.json({ success: true, jobs });
});

router.get('/bridge/items/:itemId', (req: Request, res: Response) => {
  const itemId = req.params['itemId'] || '';
  const item = cendiaBridgeService.getItem(itemId);
  if (!item) {
    res.status(404).json({ success: false, error: 'Item not found' });
    return;
  }
  res.json({ success: true, item });
});

router.get('/bridge/items', (req: Request, res: Response) => {
  const limitStr = req.query['limit'] as string | undefined;
  const searchParams: { query?: string; dataType?: any; connectorId?: string; limit?: number } = {};
  
  if (req.query['query']) searchParams.query = req.query['query'] as string;
  if (req.query['dataType']) searchParams.dataType = req.query['dataType'] as any;
  if (req.query['connectorId']) searchParams.connectorId = req.query['connectorId'] as string;
  if (limitStr) searchParams.limit = parseInt(limitStr);
  
  const items = cendiaBridgeService.searchItems(searchParams);
  res.json({ success: true, items });
});

router.get('/bridge/statistics', (_req: Request, res: Response) => {
  res.json({ success: true, statistics: cendiaBridgeService.getStatistics() });
});

// =============================================================================
// HEALTH CHECK
// =============================================================================

router.get('/health', (_req: Request, res: Response) => {
  res.json({
    success: true,
    services: {
      veto: { status: 'operational', statistics: cendiaVetoService.getStatistics() },
      govern: { status: 'operational', statistics: cendiaGovernService.getStatistics() },
      bridge: { status: 'operational', statistics: cendiaBridgeService.getStatistics() },
    },
  });
});

export default router;
