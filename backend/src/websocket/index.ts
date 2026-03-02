// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

import { Server as SocketIOServer, Socket } from 'socket.io';
import * as jose from 'jose';
import { config } from '../config/index.js';
import { pubsub } from '../config/redis.js';
import { logger } from '../utils/logger.js';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  organizationId?: string;
}

const JWT_SECRET = new TextEncoder().encode(config.jwtSecret);

export function setupWebSocketHandlers(io: SocketIOServer) {
  // Authentication middleware
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth['token'] || socket.handshake.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        return next(new Error('Authentication required'));
      }

      const { payload } = await jose.jwtVerify(token, JWT_SECRET);
      
      socket.userId = payload.sub as string;
      socket.organizationId = payload['organizationId'] as string;

      next();
    } catch (error) {
      logger.warn('WebSocket auth failed:', error);
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    logger.info(`WebSocket connected: ${socket.id} (user: ${socket.userId})`);

    // Join organization room
    if (socket.organizationId) {
      socket.join(`org:${socket.organizationId}`);
    }

    // Subscribe to deliberation updates
    socket.on('subscribe:deliberation', async (deliberationId: string) => {
      const channel = `deliberation:${deliberationId}`;
      socket.join(channel);
      
      logger.debug(`Socket ${socket.id} subscribed to ${channel}`);

      // Setup Redis subscription
      await pubsub.subscribe(channel, (message) => {
        try {
          const data = JSON.parse(message);
          io.to(channel).emit('deliberation:update', data);
        } catch {
          // Ignore malformed messages
        }
      });
    });

    socket.on('unsubscribe:deliberation', (deliberationId: string) => {
      socket.leave(`deliberation:${deliberationId}`);
    });

    // Subscribe to workflow execution updates
    socket.on('subscribe:workflow', async (executionId: string) => {
      const channel = `workflow:${executionId}`;
      socket.join(channel);

      await pubsub.subscribe(channel, (message) => {
        try {
          const data = JSON.parse(message);
          io.to(channel).emit('workflow:update', data);
        } catch {
          // Ignore malformed messages
        }
      });
    });

    socket.on('unsubscribe:workflow', (executionId: string) => {
      socket.leave(`workflow:${executionId}`);
    });

    // Subscribe to alerts for organization
    socket.on('subscribe:alerts', async () => {
      if (!socket.organizationId) return;

      const channel = `alerts:${socket.organizationId}`;
      socket.join(channel);

      await pubsub.subscribe(channel, (message) => {
        try {
          const data = JSON.parse(message);
          io.to(channel).emit('alert:update', data);
        } catch {
          // Ignore malformed messages
        }
      });
    });

    // Subscribe to health updates for organization
    socket.on('subscribe:health', async () => {
      if (!socket.organizationId) return;

      const channel = `health:${socket.organizationId}`;
      socket.join(channel);

      await pubsub.subscribe(channel, (message) => {
        try {
          const data = JSON.parse(message);
          io.to(channel).emit('health:update', data);
        } catch {
          // Ignore malformed messages
        }
      });
    });

    // Handle disconnection
    socket.on('disconnect', (reason) => {
      logger.info(`WebSocket disconnected: ${socket.id} (reason: ${reason})`);
    });

    // Handle errors
    socket.on('error', (error) => {
      logger.error(`WebSocket error for ${socket.id}:`, error);
    });
  });

  // Broadcast to organization
  io.broadcastToOrg = (orgId: string, event: string, data: unknown) => {
    io.to(`org:${orgId}`).emit(event, data);
  };

  logger.info('WebSocket handlers initialized');
}

// Extend Socket.IO types
declare module 'socket.io' {
  interface Server {
    broadcastToOrg: (orgId: string, event: string, data: unknown) => void;
  }
}
