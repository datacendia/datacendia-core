// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA COUNCIL WEBSOCKET SERVER
// Real-time Streaming for AI Deliberations
// =============================================================================

import WebSocket from 'ws';
import type { Server as HttpServer, IncomingMessage } from 'http';
import { CouncilService, StreamEvent } from './CouncilService';
import { persistServiceRecord, loadServiceRecords } from '../../utils/servicePersistence.js';
import { logger } from '../../utils/logger.js';

// Extended WebSocket client with custom properties
interface WebSocketClient {
  ws: WebSocket;
  id: string;
  userId?: string;
  subscribedDeliberations: Set<string>;
  isAlive: boolean;
}

interface WSMessage {
  type: 'subscribe' | 'unsubscribe' | 'start_deliberation' | 'ping';
  deliberationId?: string;
  payload?: any;
}

export class CouncilWebSocketServer {
  private wss: WebSocket.Server;
  private clients: Map<string, WebSocketClient> = new Map();
  private councilService: CouncilService;
  private heartbeatInterval: NodeJS.Timeout | null = null;

  constructor(server: HttpServer, councilService: CouncilService) {
    this.councilService = councilService;

    // Create WebSocket server
    this.wss = new WebSocket.Server({ 
      server: server as any, 
      path: '/ws/council',
      perMessageDeflate: {
        zlibDeflateOptions: {
          chunkSize: 1024,
          memLevel: 7,
          level: 3
        },
        zlibInflateOptions: {
          chunkSize: 10 * 1024
        },
        clientNoContextTakeover: true,
        serverNoContextTakeover: true,
        serverMaxWindowBits: 10,
        concurrencyLimit: 10,
        threshold: 1024
      }
    });

    this.setupEventHandlers();
    this.startHeartbeat();

    // Listen to council service events
    this.councilService.on('stream', (event: StreamEvent) => {
      this.broadcastToSubscribers(event.deliberationId, {
        type: 'stream_event',
        event,
      });
    });

    logger.info('[CouncilWebSocket] Server initialized on /ws/council');


    this.loadFromDB().catch(() => {});
  }

  private setupEventHandlers(): void {
    this.wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
      const clientId = this.generateClientId();
      
      const client: WebSocketClient = {
        ws,
        id: clientId,
        subscribedDeliberations: new Set(),
        isAlive: true,
      };

      // Extract user ID from auth header or query param
      const url = new URL(req.url || '', `http://${req.headers.host}`);
      client.userId = url.searchParams.get('userId') || undefined;

      this.clients.set(clientId, client);

      logger.info(`[CouncilWebSocket] Client connected: ${clientId}`);

      // Send welcome message
      this.sendToClient(client, {
        type: 'connected',
        clientId,
        timestamp: new Date().toISOString(),
      });

      // Handle messages
      ws.on('message', async (data: WebSocket.Data) => {
        try {
          const message: WSMessage = JSON.parse(data.toString());
          await this.handleMessage(client, message);
        } catch (error) {
          this.sendToClient(client, {
            type: 'error',
            message: 'Invalid message format',
          });
        }
      });

      // Handle pong for heartbeat
      ws.on('pong', () => {
        client.isAlive = true;
      });

      // Handle close
      ws.on('close', () => {
        logger.info(`[CouncilWebSocket] Client disconnected: ${clientId}`);
        this.clients.delete(clientId);
      });

      // Handle errors
      ws.on('error', (error: Error) => {
        console.error(`[CouncilWebSocket] Client error: ${clientId}`, error);
        this.clients.delete(clientId);
      });
    });
  }

  private async handleMessage(client: WebSocketClient, message: WSMessage): Promise<void> {
    switch (message.type) {
      case 'subscribe':
        if (message.deliberationId) {
          client.subscribedDeliberations.add(message.deliberationId);
          this.sendToClient(client, {
            type: 'subscribed',
            deliberationId: message.deliberationId,
          });

          // Send current state of deliberation
          const deliberation = await this.councilService.getDeliberation(message.deliberationId);
          if (deliberation) {
            this.sendToClient(client, {
              type: 'deliberation_state',
              deliberation,
            });
          }
        }
        break;

      case 'unsubscribe':
        if (message.deliberationId) {
          client.subscribedDeliberations.delete(message.deliberationId);
          this.sendToClient(client, {
            type: 'unsubscribed',
            deliberationId: message.deliberationId,
          });
        }
        break;

      case 'start_deliberation':
        if (message.payload?.question) {
          try {
            const deliberationId = await this.councilService.startDeliberation(
              message.payload.question,
              {
                userId: client.userId,
                agentIds: message.payload.agentIds,
                context: message.payload.context,
                config: message.payload.config,
              }
            );

            // Auto-subscribe to the new deliberation
            client.subscribedDeliberations.add(deliberationId);

            this.sendToClient(client, {
              type: 'deliberation_started',
              deliberationId,
            });
          } catch (error) {
            this.sendToClient(client, {
              type: 'error',
              message: error instanceof Error ? error.message : 'Failed to start deliberation',
            });
          }
        }
        break;

      case 'ping':
        this.sendToClient(client, { type: 'pong', timestamp: Date.now() });
        break;

      default:
        this.sendToClient(client, {
          type: 'error',
          message: `Unknown message type: ${message.type}`,
        });
    }
  }

  private broadcastToSubscribers(deliberationId: string, message: any): void {
    for (const client of this.clients.values()) {
      if (client.subscribedDeliberations.has(deliberationId) && client.ws.readyState === WebSocket.OPEN) {
        this.sendToClient(client, message);
      }
    }
  }

  private sendToClient(client: WebSocketClient, message: any): void {
    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify(message));
    }
  }

  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      for (const client of this.clients.values()) {
        if (client.isAlive === false) {
          this.clients.delete(client.id);
          client.ws.terminate();
          continue;
        }
        client.isAlive = false;
        client.ws.ping();
      }
    }, 30000);
  }

  private generateClientId(): string {
    return `client_${Date.now()}_${crypto.randomUUID().slice(0, 9)}`;
  }

  getConnectedClients(): number {
    return this.clients.size;
  }

  broadcast(message: any): void {
    for (const client of this.clients.values()) {
      if (client.ws.readyState === WebSocket.OPEN) {
        this.sendToClient(client, message);
      }
    }
  }

  close(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    this.wss.close();
  }



  async loadFromDB(): Promise<void> {


    try {


      let restored = 0;


      const recs = await loadServiceRecords({ serviceName: 'CouncilWebSocketServer', recordType: 'record', limit: 1000 });


      for (const rec of recs) {


        const d = rec.data as any;


        if (d?.id && !this.clients.has(d.id)) this.clients.set(d.id, d);


      }


      restored += recs.length;


      if (restored > 0) logger.info(`[CouncilWebSocketServer] Restored ${restored} records from database`);


    } catch (err) {


      logger.warn(`[CouncilWebSocketServer] DB reload skipped: ${(err as Error).message}`);


    }


  }
}

export default CouncilWebSocketServer;
