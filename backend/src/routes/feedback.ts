/**
 * API Routes — Feedback & Improvement Loop
 * @module routes/feedback
 */

import { Router, Request, Response } from 'express';
import { feedbackService } from '../services/feedback/FeedbackService.js';

const router = Router();

// --- Feedback ---
router.get('/feedback', async (req: Request, res: Response) => {
  try {
    const entries = await feedbackService.listFeedback({
      type: req.query.type as any,
      status: req.query.status as any,
      category: req.query.category as string,
      source: req.query.source as any,
      query: req.query.q as string,
      sortBy: (req.query.sortBy as any) || 'recent',
    });
    res.json({ success: true, data: entries, total: entries.length });
  } catch (error) { res.status(500).json({ success: false, error: 'Failed to list feedback' }); }
});

router.post('/feedback', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || 'anonymous';
    const entry = await feedbackService.submitFeedback({ ...req.body, submittedBy: userId });
    res.status(201).json({ success: true, data: entry });
  } catch (error) { res.status(500).json({ success: false, error: 'Failed to submit feedback' }); }
});

router.get('/feedback/:id', async (req: Request, res: Response) => {
  try {
    const entry = await feedbackService.getFeedback(req.params.id);
    if (!entry) return res.status(404).json({ success: false, error: 'Feedback not found' });
    res.json({ success: true, data: entry });
  } catch (error) { res.status(500).json({ success: false, error: 'Failed to get feedback' }); }
});

router.put('/feedback/:id/status', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || 'system';
    const entry = await feedbackService.updateFeedbackStatus(req.params.id, req.body.status, userId, req.body.reason);
    if (!entry) return res.status(404).json({ success: false, error: 'Feedback not found' });
    res.json({ success: true, data: entry });
  } catch (error) { res.status(500).json({ success: false, error: 'Failed to update status' }); }
});

router.post('/feedback/:id/vote', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || 'anonymous';
    const entry = await feedbackService.voteFeedback(req.params.id, userId);
    if (!entry) return res.status(404).json({ success: false, error: 'Feedback not found' });
    res.json({ success: true, data: entry });
  } catch (error) { res.status(500).json({ success: false, error: 'Failed to vote' }); }
});

router.post('/feedback/:id/comments', async (req: Request, res: Response) => {
  try {
    const comment = await feedbackService.addComment(req.params.id, req.body);
    if (!comment) return res.status(404).json({ success: false, error: 'Feedback not found' });
    res.status(201).json({ success: true, data: comment });
  } catch (error) { res.status(500).json({ success: false, error: 'Failed to add comment' }); }
});

// --- Improvements Roadmap ---
router.get('/improvements', async (req: Request, res: Response) => {
  try {
    const items = await feedbackService.listImprovements(req.query.visibility as any);
    res.json({ success: true, data: items });
  } catch (error) { res.status(500).json({ success: false, error: 'Failed to list improvements' }); }
});

router.post('/improvements', async (req: Request, res: Response) => {
  try {
    const item = await feedbackService.createImprovement(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (error) { res.status(500).json({ success: false, error: 'Failed to create improvement' }); }
});

router.put('/improvements/:id/status', async (req: Request, res: Response) => {
  try {
    const item = await feedbackService.updateImprovementStatus(req.params.id, req.body.status);
    if (!item) return res.status(404).json({ success: false, error: 'Improvement not found' });
    res.json({ success: true, data: item });
  } catch (error) { res.status(500).json({ success: false, error: 'Failed to update status' }); }
});

// --- Lessons Learned ---
router.get('/lessons', async (_req: Request, res: Response) => {
  try {
    const lessons = await feedbackService.listLessonsLearned();
    res.json({ success: true, data: lessons });
  } catch (error) { res.status(500).json({ success: false, error: 'Failed to list lessons' }); }
});

router.post('/lessons', async (req: Request, res: Response) => {
  try {
    const lesson = await feedbackService.captureLessonLearned(req.body);
    res.status(201).json({ success: true, data: lesson });
  } catch (error) { res.status(500).json({ success: false, error: 'Failed to capture lesson' }); }
});

// --- Analytics ---
router.get('/analytics', async (_req: Request, res: Response) => {
  try {
    const analytics = await feedbackService.getAnalytics();
    res.json({ success: true, data: analytics });
  } catch (error) { res.status(500).json({ success: false, error: 'Failed to get analytics' }); }
});

export default router;
