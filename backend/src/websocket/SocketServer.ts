// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * =============================================================================
 * SOCKET.IO SERVER - Real-Time WebSocket Infrastructure
 * =============================================================================
 * Enterprise-grade WebSocket server for real-time updates
 */

import { Server, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { logger } from '../utils/logger.js';

export interface DeliberationUpdate {
  deliberationId: string;
  agentId: string;
  message: string;
  timestamp: Date;
  confidence?: number;
}

export interface DecisionUpdate {
  decisionId: string;
  status: string;
  data: any;
  timestamp: Date;
}

export interface AlertNotification {
  alertId: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  message: string;
  timestamp: Date;
}

export class SocketServer {
  private io: Server;
  private connectedClients: Map<string, Socket> = new Map();

  constructor(httpServer: HTTPServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: process.env['FRONTEND_URL'] || 'http://localhost:5173',
        credentials: true,
        methods: ['GET', 'POST'],
      },
      pingTimeout: 60000,
      pingInterval: 25000,
      transports: ['websocket', 'polling'],
      allowEIO3: true,
    });

    this.setupHandlers();
    logger.info('[SocketServer] WebSocket server initialized');
  }

  private setupHandlers(): void {
    this.io.on('connection', (socket: Socket) => {
      logger.info(`[SocketServer] Client connected: ${socket.id}`);
      this.connectedClients.set(socket.id, socket);

      socket.on('authenticate', (data: { userId: string; token: string }) => {
        socket.data.userId = data.userId;
        socket.join(`user-${data.userId}`);
        logger.info(`[SocketServer] User ${data.userId} authenticated`);
      });

      socket.on('join-deliberation', (deliberationId: string) => {
        socket.join(`deliberation-${deliberationId}`);
        logger.info(`[SocketServer] Client ${socket.id} joined deliberation ${deliberationId}`);
      });

      socket.on('leave-deliberation', (deliberationId: string) => {
        socket.leave(`deliberation-${deliberationId}`);
        logger.info(`[SocketServer] Client ${socket.id} left deliberation ${deliberationId}`);
      });

      socket.on('join-decision', (decisionId: string) => {
        socket.join(`decision-${decisionId}`);
        logger.info(`[SocketServer] Client ${socket.id} joined decision ${decisionId}`);
      });

      socket.on('leave-decision', (decisionId: string) => {
        socket.leave(`decision-${decisionId}`);
        logger.info(`[SocketServer] Client ${socket.id} left decision ${decisionId}`);
      });

      socket.on('subscribe-alerts', (userId: string) => {
        socket.join(`alerts-${userId}`);
        logger.info(`[SocketServer] Client ${socket.id} subscribed to alerts for user ${userId}`);
      });

      socket.on('disconnect', (reason: string) => {
        logger.info(`[SocketServer] Client disconnected: ${socket.id}, reason: ${reason}`);
        this.connectedClients.delete(socket.id);
      });

      socket.on('error', (error: Error) => {
        logger.error(`[SocketServer] Socket error for ${socket.id}:`, error);
      });
    });
  }

  emitDeliberationUpdate(deliberationId: string, update: DeliberationUpdate): void {
    this.io.to(`deliberation-${deliberationId}`).emit('deliberation-update', update);
    logger.debug(`[SocketServer] Emitted deliberation update for ${deliberationId}`);
  }

  emitDeliberationComplete(deliberationId: string, summary: any): void {
    this.io.to(`deliberation-${deliberationId}`).emit('deliberation-complete', summary);
    logger.info(`[SocketServer] Deliberation ${deliberationId} completed`);
  }

  emitDecisionUpdate(decisionId: string, update: DecisionUpdate): void {
    this.io.to(`decision-${decisionId}`).emit('decision-update', update);
    logger.debug(`[SocketServer] Emitted decision update for ${decisionId}`);
  }

  emitAlert(userId: string, alert: AlertNotification): void {
    this.io.to(`alerts-${userId}`).emit('alert', alert);
    this.io.to(`user-${userId}`).emit('alert', alert);
    logger.info(`[SocketServer] Emitted alert to user ${userId}: ${alert.title}`);
  }

  broadcastSystemAlert(alert: AlertNotification): void {
    this.io.emit('system-alert', alert);
    logger.warn(`[SocketServer] Broadcast system alert: ${alert.title}`);
  }

  emitHealthUpdate(status: any): void {
    this.io.emit('health-update', status);
  }

  emitMetricUpdate(metricId: string, value: any): void {
    this.io.emit('metric-update', { metricId, value, timestamp: new Date() });
  }

  getConnectedClientCount(): number {
    return this.connectedClients.size;
  }

  getServer(): Server {
    return this.io;
  }
}

export default SocketServer;
