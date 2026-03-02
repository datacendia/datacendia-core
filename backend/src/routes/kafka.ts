// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// KAFKA ADMIN & MONITORING API ROUTES
// Mounted at /api/v1/kafka
// =============================================================================

import { Router, Request, Response, NextFunction } from 'express';
import { devAuth } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';
import { kafka } from '../services/kafka/KafkaService.js';
import { kafkaEventBridge } from '../services/kafka/KafkaEventBridge.js';
import { KAFKA_TOPICS, getAllTopicNames } from '../services/kafka/KafkaTopics.js';

const router = Router();
router.use(devAuth);

// ─── Health & Status ────────────────────────────────────────────────────

/**
 * GET /api/v1/kafka/health
 * Kafka cluster health check
 */
router.get('/health', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const health = await kafka.getHealth();
    res.json({ success: true, data: health });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/kafka/stats
 * Service statistics (messages sent/received, errors, buffer size)
 */
router.get('/stats', async (_req: Request, res: Response) => {
  res.json({ success: true, data: kafka.getStats() });
});

/**
 * GET /api/v1/kafka/status
 * Combined status: health + stats + bridge info
 */
router.get('/status', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const [health, stats] = await Promise.all([
      kafka.getHealth(),
      kafka.getStats(),
    ]);

    res.json({
      success: true,
      data: {
        health,
        stats,
        ready: kafka.isReady(),
        enabled: kafka.isEnabled(),
      },
    });
  } catch (error) {
    next(error);
  }
});

// ─── Topics ─────────────────────────────────────────────────────────────

/**
 * GET /api/v1/kafka/topics
 * List all configured Kafka topics with their configurations
 */
router.get('/topics', async (_req: Request, res: Response) => {
  const topics = Object.entries(KAFKA_TOPICS).map(([key, config]) => ({
    key,
    name: config.name,
    partitions: config.partitions,
    replicationFactor: config.replicationFactor,
    retentionMs: config.retentionMs,
    retentionHuman: config.retentionMs === -1
      ? 'indefinite'
      : `${Math.round(config.retentionMs / (24 * 60 * 60 * 1000))} days`,
    cleanupPolicy: config.cleanupPolicy,
    description: config.description,
    partitionKey: config.partitionKey,
  }));

  res.json({
    success: true,
    data: {
      topics,
      totalTopics: topics.length,
      allNames: getAllTopicNames(),
    },
  });
});

// ─── Consumer Groups ────────────────────────────────────────────────────

/**
 * GET /api/v1/kafka/consumers/:groupId/lag
 * Get consumer group lag
 */
router.get('/consumers/:groupId/lag', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lag = await kafka.getConsumerLag(req.params.groupId!);
    if (lag === null) {
      res.status(503).json({
        success: false,
        error: 'Kafka admin not available — cluster may not be connected',
      });
      return;
    }

    const totalLag = Object.values(lag).reduce((sum, l) => sum + l, 0);
    res.json({
      success: true,
      data: {
        groupId: req.params.groupId,
        partitionLag: lag,
        totalLag,
      },
    });
  } catch (error) {
    next(error);
  }
});

// ─── Event Buffer (when Kafka is disabled) ──────────────────────────────

/**
 * GET /api/v1/kafka/buffer
 * View in-memory event buffer (useful when Kafka is disabled)
 */
router.get('/buffer', async (req: Request, res: Response) => {
  const topic = req.query.topic as string | undefined;
  const limit = Math.min(parseInt(req.query.limit as string) || 100, 1000);

  const events = kafka.getBufferedEvents(topic, limit);
  res.json({
    success: true,
    data: {
      events: events.map(e => ({
        topic: e.topic,
        key: e.key,
        value: e.value.length > 500 ? e.value.substring(0, 500) + '...' : e.value,
        headers: e.headers,
        timestamp: e.timestamp,
      })),
      count: events.length,
      kafkaEnabled: kafka.isEnabled(),
      kafkaReady: kafka.isReady(),
    },
  });
});

// ─── Bridge Operations ──────────────────────────────────────────────────

/**
 * POST /api/v1/kafka/bridge/emit
 * Manually emit an event through the bridge (for testing/admin)
 */
router.post('/bridge/emit', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { topic, key, payload, headers } = req.body;

    if (!topic || !key || !payload) {
      res.status(400).json({
        success: false,
        error: 'Missing required fields: topic, key, payload',
      });
      return;
    }

    // Validate topic exists
    const validTopics = getAllTopicNames();
    if (!validTopics.includes(topic)) {
      res.status(400).json({
        success: false,
        error: `Invalid topic '${topic}'. Valid topics: ${validTopics.join(', ')}`,
      });
      return;
    }

    await kafka.emit(topic, key, payload, headers);

    logger.info(`[Kafka API] Manual event emitted to ${topic} by ${req.user?.email || 'unknown'}`);

    res.json({
      success: true,
      data: {
        topic,
        key,
        kafkaReady: kafka.isReady(),
        buffered: !kafka.isReady(),
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/kafka/bridge/audit
 * Emit an audit event through the bridge
 */
router.post('/bridge/audit', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { action, resourceType, resourceId, details } = req.body;

    if (!action || !resourceType) {
      res.status(400).json({
        success: false,
        error: 'Missing required fields: action, resourceType',
      });
      return;
    }

    await kafkaEventBridge.emitAudit({
      organizationId: req.organizationId || 'unknown',
      userId: req.user?.id,
      action,
      resourceType,
      resourceId,
      details,
    });

    res.json({ success: true, data: { emitted: true } });
  } catch (error) {
    next(error);
  }
});

export default router;
