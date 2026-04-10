/**
 * API Routes — AI Model Registry & Lifecycle
 * @module routes/model-registry
 */

import { Router, Request, Response } from 'express';
import { modelRegistry } from '../services/ai/ModelRegistryService.js';

const router = Router();

router.get('/models', async (req: Request, res: Response) => {
  try {
    const models = await modelRegistry.listModels({
      status: req.query.status as any,
      type: req.query.type as any,
      team: req.query.team as string,
      query: req.query.q as string,
    });
    res.json({ success: true, data: models, total: models.length });
  } catch (error) { res.status(500).json({ success: false, error: 'Failed to list models' }); }
});

router.post('/models', async (req: Request, res: Response) => {
  try {
    const model = await modelRegistry.registerModel(req.body);
    res.status(201).json({ success: true, data: model });
  } catch (error) { res.status(500).json({ success: false, error: 'Failed to register model' }); }
});

router.get('/models/:id', async (req: Request, res: Response) => {
  try {
    const model = await modelRegistry.getModel(req.params.id);
    if (!model) return res.status(404).json({ success: false, error: 'Model not found' });
    res.json({ success: true, data: model });
  } catch (error) { res.status(500).json({ success: false, error: 'Failed to get model' }); }
});

router.put('/models/:id/version', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || 'system';
    const model = await modelRegistry.updateModelVersion(req.params.id, req.body.version, req.body.metrics, userId);
    if (!model) return res.status(404).json({ success: false, error: 'Model not found' });
    res.json({ success: true, data: model });
  } catch (error) { res.status(500).json({ success: false, error: 'Failed to update version' }); }
});

router.post('/models/:id/submit-approval', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || 'system';
    const model = await modelRegistry.submitForApproval(req.params.id, userId);
    if (!model) return res.status(404).json({ success: false, error: 'Model not found' });
    res.json({ success: true, data: model });
  } catch (error) { res.status(500).json({ success: false, error: 'Failed to submit' }); }
});

router.post('/models/:id/review', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || 'system';
    const model = await modelRegistry.reviewApproval(req.params.id, req.body.stage, req.body.status, userId, req.body.comments);
    if (!model) return res.status(400).json({ success: false, error: 'Review failed' });
    res.json({ success: true, data: model });
  } catch (error) { res.status(500).json({ success: false, error: 'Failed to review' }); }
});

router.post('/models/:id/deploy', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || 'system';
    const dep = await modelRegistry.deployModel(req.params.id, { ...req.body, deployedBy: userId, deployedAt: new Date().toISOString() });
    if (!dep) return res.status(400).json({ success: false, error: 'Model must be approved before deployment' });
    res.status(201).json({ success: true, data: dep });
  } catch (error) { res.status(500).json({ success: false, error: 'Failed to deploy' }); }
});

router.post('/models/:id/deprecate', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || 'system';
    const model = await modelRegistry.deprecateModel(req.params.id, userId);
    if (!model) return res.status(404).json({ success: false, error: 'Model not found' });
    res.json({ success: true, data: model });
  } catch (error) { res.status(500).json({ success: false, error: 'Failed to deprecate' }); }
});

router.post('/models/:id/bias-audit', async (req: Request, res: Response) => {
  try {
    const model = await modelRegistry.addBiasAudit(req.params.id, req.body);
    if (!model) return res.status(404).json({ success: false, error: 'Model not found' });
    res.json({ success: true, data: model });
  } catch (error) { res.status(500).json({ success: false, error: 'Failed to add bias audit' }); }
});

router.post('/models/:id/explainability', async (req: Request, res: Response) => {
  try {
    const model = await modelRegistry.addExplainabilityReport(req.params.id, req.body);
    if (!model) return res.status(404).json({ success: false, error: 'Model not found' });
    res.json({ success: true, data: model });
  } catch (error) { res.status(500).json({ success: false, error: 'Failed to add explainability report' }); }
});

router.post('/models/:id/risk-assessment', async (req: Request, res: Response) => {
  try {
    const model = await modelRegistry.addRiskAssessment(req.params.id, req.body);
    if (!model) return res.status(404).json({ success: false, error: 'Model not found' });
    res.json({ success: true, data: model });
  } catch (error) { res.status(500).json({ success: false, error: 'Failed to add risk assessment' }); }
});

router.get('/models/:id/lineage', async (req: Request, res: Response) => {
  try {
    const lineage = await modelRegistry.getModelLineage(req.params.id);
    if (!lineage) return res.status(404).json({ success: false, error: 'Model not found' });
    res.json({ success: true, data: lineage });
  } catch (error) { res.status(500).json({ success: false, error: 'Failed to get lineage' }); }
});

router.get('/audit', async (req: Request, res: Response) => {
  try {
    const entries = modelRegistry.getAuditLog(req.query.modelId as string);
    res.json({ success: true, data: entries });
  } catch (error) { res.status(500).json({ success: false, error: 'Failed to get audit log' }); }
});

export default router;
