// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// NOTIFICATION ROUTES
// API endpoints for notification management
// =============================================================================

import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { notificationService, NotificationType, NotificationChannel } from '../services/NotificationService.js';
import { getErrorMessage } from '../utils/errors.js';

const router = Router();

// Validation schemas
const sendNotificationSchema = z.object({
  userId: z.string().uuid(),
  organizationId: z.string(),
  type: z.enum([
    'DELIBERATION_STARTED', 'DELIBERATION_COMPLETE', 'DECISION_MADE',
    'DISSENT_FILED', 'APPROVAL_REQUIRED', 'APPROVAL_GRANTED',
    'APPROVAL_DENIED', 'ALERT_TRIGGERED', 'SYSTEM_ANNOUNCEMENT',
    'SECURITY_ALERT', 'MFA_ENABLED', 'MFA_DISABLED'
  ] as const),
  title: z.string().min(1).max(200),
  message: z.string().min(1).max(2000),
  link: z.string().url().optional(),
  channels: z.array(z.enum(['IN_APP', 'EMAIL', 'SLACK', 'TEAMS', 'PUSH', 'WEBHOOK'] as const)).optional(),
});

const updatePreferencesSchema = z.object({
  email: z.boolean().optional(),
  inApp: z.boolean().optional(),
  push: z.boolean().optional(),
  slack: z.boolean().optional(),
  teams: z.boolean().optional(),
  webhook: z.boolean().optional(),
  webhookUrl: z.string().url().optional(),
  slackChannel: z.string().optional(),
  teamsChannel: z.string().optional(),
});

// =============================================================================
// ROUTES
// =============================================================================

/**
 * @swagger
 * /api/v1/notifications:
 *   get:
 *     summary: Get notifications for current user
 *     tags: [Notifications]
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id || req.organizationId;
    if (!userId) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    const limit = parseInt(String(req.query['limit'])) || 50;
    const offset = parseInt(String(req.query['offset'])) || 0;
    const unreadOnly = req.query['unread'] === 'true';

    const notifications = unreadOnly
      ? await notificationService.getUnread(userId, limit)
      : await notificationService.getAll(userId, limit, offset);

    res.json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

/**
 * @swagger
 * /api/v1/notifications/unread-count:
 *   get:
 *     summary: Get unread notification count
 *     tags: [Notifications]
 */
router.get('/unread-count', async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id || req.organizationId;
    if (!userId) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    const count = await notificationService.getUnreadCount(userId);
    res.json({ success: true, data: { count } });
  } catch (error) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

/**
 * @swagger
 * /api/v1/notifications/send:
 *   post:
 *     summary: Send a notification (admin only)
 *     tags: [Notifications]
 */
router.post('/send', async (req: Request, res: Response) => {
  try {
    const payload = sendNotificationSchema.parse(req.body);
    
    const notifPayload: Parameters<typeof notificationService.send>[0] = {
      userId: payload.userId,
      organizationId: payload.organizationId,
      type: payload.type as NotificationType,
      title: payload.title,
      message: payload.message,
      channels: payload.channels as NotificationChannel[],
    };
    if (payload.link) {
      notifPayload.link = payload.link;
    }
    const result = await notificationService.send(notifPayload);

    res.json({ success: true, data: result });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, error: 'Invalid request', details: error.errors });
      return;
    }
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

/**
 * @swagger
 * /api/v1/notifications/broadcast:
 *   post:
 *     summary: Broadcast notification to all users in organization
 *     tags: [Notifications]
 */
router.post('/broadcast', async (req: Request, res: Response) => {
  try {
    const { type, title, message, link } = req.body;
    const organizationId = req.organizationId;

    if (!organizationId) {
      res.status(401).json({ success: false, error: 'Organization ID required' });
      return;
    }

    const result = await notificationService.broadcast(
      organizationId,
      type as NotificationType,
      title,
      message,
      link
    );

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

/**
 * @swagger
 * /api/v1/notifications/{id}/read:
 *   post:
 *     summary: Mark notification as read
 *     tags: [Notifications]
 */
router.post('/:id/read', async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id || req.organizationId;
    if (!userId) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    const notificationId = req.params['id'];
    if (!notificationId) {
      res.status(400).json({ success: false, error: 'Notification ID required' });
      return;
    }

    const success = await notificationService.markAsRead(notificationId, userId);
    res.json({ success });
  } catch (error) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

/**
 * @swagger
 * /api/v1/notifications/read-all:
 *   post:
 *     summary: Mark all notifications as read
 *     tags: [Notifications]
 */
router.post('/read-all', async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id || req.organizationId;
    if (!userId) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    const success = await notificationService.markAllAsRead(userId);
    res.json({ success });
  } catch (error) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

/**
 * @swagger
 * /api/v1/notifications/preferences:
 *   get:
 *     summary: Get notification preferences
 *     tags: [Notifications]
 */
router.get('/preferences', async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id || req.organizationId;
    if (!userId) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    const preferences = await notificationService.getUserPreferences(userId);
    res.json({ success: true, data: preferences });
  } catch (error) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

/**
 * @swagger
 * /api/v1/notifications/preferences:
 *   put:
 *     summary: Update notification preferences
 *     tags: [Notifications]
 */
router.put('/preferences', async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id || req.organizationId;
    if (!userId) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    const parsed = updatePreferencesSchema.parse(req.body);
    // Filter out undefined values for exactOptionalPropertyTypes
    const preferences: Record<string, boolean | string> = {};
    if (parsed.email !== undefined) preferences['email'] = parsed.email;
    if (parsed.inApp !== undefined) preferences['inApp'] = parsed.inApp;
    if (parsed.push !== undefined) preferences['push'] = parsed.push;
    if (parsed.slack !== undefined) preferences['slack'] = parsed.slack;
    if (parsed.teams !== undefined) preferences['teams'] = parsed.teams;
    if (parsed.webhook !== undefined) preferences['webhook'] = parsed.webhook;
    if (parsed.webhookUrl !== undefined) preferences['webhookUrl'] = parsed.webhookUrl;
    if (parsed.slackChannel !== undefined) preferences['slackChannel'] = parsed.slackChannel;
    if (parsed.teamsChannel !== undefined) preferences['teamsChannel'] = parsed.teamsChannel;
    const success = await notificationService.updateUserPreferences(userId, preferences as Partial<import('../services/NotificationService.js').NotificationPreferences>);
    res.json({ success });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, error: 'Invalid preferences', details: error.errors });
      return;
    }
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

export default router;
