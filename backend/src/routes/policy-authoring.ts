/**
 * API Routes — Policy Authoring & Simulation
 * @module routes/policy-authoring
 */

import { Router, Request, Response } from 'express';
import { policyAuthoring } from '../services/governance/PolicyAuthoringService.js';
import { logger } from '../utils/logger.js';

const router = Router();

/** GET /policies — List policies with optional filters */
router.get('/policies', async (req: Request, res: Response) => {
  try {
    const policies = await policyAuthoring.listPolicies({
      domain: req.query.domain as any,
      status: req.query.status as any,
      query: req.query.q as string,
    });
    res.json({ success: true, data: policies, total: policies.length });
  } catch (error) { res.status(500).json({ success: false, error: 'Failed to list policies' }); }
});

/** POST /policies — Create a new policy */
router.post('/policies', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || 'system';
    const policy = await policyAuthoring.createPolicy({ ...req.body, createdBy: userId });
    res.status(201).json({ success: true, data: policy });
  } catch (error) { res.status(500).json({ success: false, error: 'Failed to create policy' }); }
});

/** GET /policies/:id — Get policy by ID */
router.get('/policies/:id', async (req: Request, res: Response) => {
  try {
    const policy = await policyAuthoring.getPolicy(req.params.id);
    if (!policy) return res.status(404).json({ success: false, error: 'Policy not found' });
    res.json({ success: true, data: policy });
  } catch (error) { res.status(500).json({ success: false, error: 'Failed to get policy' }); }
});

/** PUT /policies/:id — Update policy */
router.put('/policies/:id', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || 'system';
    const policy = await policyAuthoring.updatePolicy(req.params.id, req.body.updates, userId, req.body.changeDescription || 'Updated');
    if (!policy) return res.status(404).json({ success: false, error: 'Policy not found' });
    res.json({ success: true, data: policy });
  } catch (error) { res.status(500).json({ success: false, error: 'Failed to update policy' }); }
});

/** POST /policies/:id/approve — Approve a policy */
router.post('/policies/:id/approve', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || 'system';
    const policy = await policyAuthoring.approvePolicy(req.params.id, userId);
    if (!policy) return res.status(404).json({ success: false, error: 'Policy not found' });
    res.json({ success: true, data: policy });
  } catch (error) { res.status(500).json({ success: false, error: 'Failed to approve policy' }); }
});

/** POST /policies/:id/activate — Activate an approved policy */
router.post('/policies/:id/activate', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || 'system';
    const policy = await policyAuthoring.activatePolicy(req.params.id, userId);
    if (!policy) return res.status(400).json({ success: false, error: 'Policy must be approved before activation' });
    res.json({ success: true, data: policy });
  } catch (error) { res.status(500).json({ success: false, error: 'Failed to activate policy' }); }
});

/** POST /policies/:id/deprecate — Deprecate a policy */
router.post('/policies/:id/deprecate', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || 'system';
    const policy = await policyAuthoring.deprecatePolicy(req.params.id, userId);
    if (!policy) return res.status(404).json({ success: false, error: 'Policy not found' });
    res.json({ success: true, data: policy });
  } catch (error) { res.status(500).json({ success: false, error: 'Failed to deprecate policy' }); }
});

/** GET /policies/:id/versions — Version history */
router.get('/policies/:id/versions', async (req: Request, res: Response) => {
  try {
    const versions = await policyAuthoring.getPolicyVersions(req.params.id);
    res.json({ success: true, data: versions });
  } catch (error) { res.status(500).json({ success: false, error: 'Failed to get version history' }); }
});

/** POST /policies/:id/simulate — Simulate policy against test data */
router.post('/policies/:id/simulate', async (req: Request, res: Response) => {
  try {
    const result = await policyAuthoring.simulatePolicy({
      policyId: req.params.id,
      testData: req.body.testData,
      options: req.body.options || { stopOnFirstFailure: false, includeExplanation: true, evaluateExceptions: true },
    });
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Simulation failed' });
  }
});

/** GET /templates — List policy templates */
router.get('/templates', async (req: Request, res: Response) => {
  try {
    const templates = await policyAuthoring.getTemplates(req.query.domain as any);
    res.json({ success: true, data: templates, total: templates.length });
  } catch (error) { res.status(500).json({ success: false, error: 'Failed to list templates' }); }
});

/** GET /templates/:id — Get template by ID */
router.get('/templates/:id', async (req: Request, res: Response) => {
  try {
    const template = await policyAuthoring.getTemplate(req.params.id);
    if (!template) return res.status(404).json({ success: false, error: 'Template not found' });
    res.json({ success: true, data: template });
  } catch (error) { res.status(500).json({ success: false, error: 'Failed to get template' }); }
});

/** GET /audit — Policy audit trail */
router.get('/audit', async (req: Request, res: Response) => {
  try {
    const entries = await policyAuthoring.getAuditLog(req.query.policyId as string);
    res.json({ success: true, data: entries });
  } catch (error) { res.status(500).json({ success: false, error: 'Failed to get audit log' }); }
});

export default router;
