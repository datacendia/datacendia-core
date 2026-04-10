/**
 * API Routes — Stakeholder Collaboration Portals
 * @module routes/stakeholder-portals
 */

import { Router, Request, Response } from 'express';
import { stakeholderPortal } from '../services/collaboration/StakeholderPortalService.js';

const router = Router();

router.get('/portals', async (req: Request, res: Response) => {
  try {
    const portals = await stakeholderPortal.listPortals(req.query.organizationId as string);
    res.json({ success: true, data: portals });
  } catch (error) { res.status(500).json({ success: false, error: 'Failed to list portals' }); }
});

router.post('/portals', async (req: Request, res: Response) => {
  try {
    const portal = await stakeholderPortal.createPortal(req.body);
    res.status(201).json({ success: true, data: portal });
  } catch (error) { res.status(500).json({ success: false, error: 'Failed to create portal' }); }
});

router.get('/portals/:id', async (req: Request, res: Response) => {
  try {
    const portal = await stakeholderPortal.getPortal(req.params.id);
    if (!portal) return res.status(404).json({ success: false, error: 'Portal not found' });
    res.json({ success: true, data: portal });
  } catch (error) { res.status(500).json({ success: false, error: 'Failed to get portal' }); }
});

router.post('/portals/:id/members', async (req: Request, res: Response) => {
  try {
    const member = await stakeholderPortal.addMember(req.params.id, req.body);
    if (!member) return res.status(400).json({ success: false, error: 'Failed to add member' });
    res.status(201).json({ success: true, data: member });
  } catch (error) { res.status(500).json({ success: false, error: 'Failed to add member' }); }
});

router.delete('/portals/:id/members/:memberId', async (req: Request, res: Response) => {
  try {
    await stakeholderPortal.removeMember(req.params.id, req.params.memberId);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ success: false, error: 'Failed to remove member' }); }
});

router.post('/portals/:id/evidence', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || 'system';
    const evidence = await stakeholderPortal.shareEvidence(req.params.id, { ...req.body, sharedBy: userId, sharedAt: new Date().toISOString() });
    if (!evidence) return res.status(404).json({ success: false, error: 'Portal not found' });
    res.status(201).json({ success: true, data: evidence });
  } catch (error) { res.status(500).json({ success: false, error: 'Failed to share evidence' }); }
});

router.post('/portals/:id/evidence/:evidenceId/access', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || 'system';
    await stakeholderPortal.recordEvidenceAccess(req.params.id, req.params.evidenceId, userId, req.body.action);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ success: false, error: 'Failed to record access' }); }
});

router.post('/portals/:id/tasks', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || 'system';
    const task = await stakeholderPortal.createTask(req.params.id, { ...req.body, createdBy: userId });
    if (!task) return res.status(404).json({ success: false, error: 'Portal not found' });
    res.status(201).json({ success: true, data: task });
  } catch (error) { res.status(500).json({ success: false, error: 'Failed to create task' }); }
});

router.put('/portals/:id/tasks/:taskId/status', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || 'system';
    const task = await stakeholderPortal.updateTaskStatus(req.params.id, req.params.taskId, req.body.status, userId);
    if (!task) return res.status(404).json({ success: false, error: 'Task not found' });
    res.json({ success: true, data: task });
  } catch (error) { res.status(500).json({ success: false, error: 'Failed to update task' }); }
});

router.post('/portals/:id/comments', async (req: Request, res: Response) => {
  try {
    const comment = await stakeholderPortal.addComment(req.params.id, { ...req.body, portalId: req.params.id });
    if (!comment) return res.status(404).json({ success: false, error: 'Portal not found' });
    res.status(201).json({ success: true, data: comment });
  } catch (error) { res.status(500).json({ success: false, error: 'Failed to add comment' }); }
});

router.get('/portals/:id/activity', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const activity = await stakeholderPortal.getPortalActivity(req.params.id, limit);
    res.json({ success: true, data: activity });
  } catch (error) { res.status(500).json({ success: false, error: 'Failed to get activity' }); }
});

export default router;
