/**
 * Connector — Web Socket Connector
 *
 * External system connector for third-party integrations.
 *
 * @exports WebSocketConnectorConfig, StreamMessage
 * @module connectors/core/WebSocketConnector
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * =============================================================================
 * WEBSOCKET CONNECTOR - Enterprise Real-Time Streaming
 * =============================================================================
 * Production-grade WebSocket connector for real-time data feeds with
 * automatic reconnection, heartbeat, and message queuing.
 */

import { EventEmitter } from 'events';
import WebSocket from 'ws';
import { BaseConnector, ConnectorConfig, ConnectorMetadata, ConnectorStatus } from '../BaseConnector.js';
import { logger } from '../../utils/logger.js';

// =============================================================================
// TYPES
// =============================================================================

export interface WebSocketConnectorConfig extends ConnectorConfig {
  wsUrl: string;
  protocols?: string[];
  headers?: Record<string, string>;
  heartbeatIntervalMs?: number;
  heartbeatMessage?: string | object;
  reconnectAttempts?: number;
  reconnectDelayMs?: number;
  messageQueueSize?: number;
}

export interface StreamMessage {
  type: string;
  timestamp: Date;
  data: unknown;
  raw?: string;
}

// =============================================================================
// WEBSOCKET CONNECTOR
// =============================================================================

export abstract class WebSocketConnector extends BaseConnector {
  protected wsConfig: WebSocketConnectorConfig;
  protected ws?: WebSocket;
  protected heartbeatInterval?: NodeJS.Timeout;
  protected reconnectAttempts = 0;
  protected messageQueue: StreamMessage[] = [];
  protected isReconnecting = false;

  constructor(config: WebSocketConnectorConfig) {
    super(config);
    this.wsConfig = {
      heartbeatIntervalMs: 30000,
      reconnectAttempts: 10,
      reconnectDelayMs: 5000,
      messageQueueSize: 1000,
      ...config,
    };
  }

  // ---------------------------------------------------------------------------
  // CONNECTION MANAGEMENT
  // ---------------------------------------------------------------------------

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.status = 'connecting';
      this.emit('status', this.status);

      const options: WebSocket.ClientOptions = {};
      if (this.wsConfig.headers) {
        options.headers = this.wsConfig.headers;
      }

      try {
        const wsOptions: WebSocket.ClientOptions = {
          ...options,
          protocol: this.wsConfig.protocols?.join(','),
        };
        this.ws = new WebSocket(this.wsConfig.wsUrl, wsOptions);

        this.ws.on('open', () => {
          this.status = 'connected';
          this.reconnectAttempts = 0;
          this.isReconnecting = false;
          this.emit('status', this.status);
          this.startHeartbeat();
          this.onConnected();
          this.log('info', 'WebSocket connected');
          resolve();
        });

        this.ws.on('message', (data: WebSocket.Data) => {
          try {
            const message = this.parseMessage(data);
            this.handleMessage(message);
          } catch (error) {
            this.log('warn', `Failed to parse message: ${error}`);
          }
        });

        this.ws.on('close', (code: number, reason: Buffer) => {
          this.stopHeartbeat();
          const wasConnected = this.status === 'connected';
          this.status = 'disconnected';
          this.emit('status', this.status);
          this.log('info', `WebSocket closed: ${code} ${reason.toString()}`);

          if (wasConnected && !this.isReconnecting) {
            this.attemptReconnect();
          }
        });

        this.ws.on('error', (error: Error) => {
          this.log('error', `WebSocket error: ${error.message}`);
          this.emit('error', error);
          if (this.status === 'connecting') {
            reject(error);
          }
        });

        this.ws.on('ping', () => {
          this.ws?.pong();
        });

      } catch (error) {
        this.status = 'error';
        this.emit('status', this.status);
        reject(error);
      }
    });
  }

  async disconnect(): Promise<void> {
    this.isReconnecting = false;
    this.stopHeartbeat();

    if (this.ws) {
      this.ws.removeAllListeners();
      if (this.ws.readyState === WebSocket.OPEN) {
        this.ws.close(1000, 'Normal closure');
      }
      this.ws = undefined;
    }

    this.status = 'disconnected';
    this.emit('status', this.status);
    this.log('info', 'WebSocket disconnected');
  }

  async testConnection(): Promise<boolean> {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      return false;
    }

    try {
      this.ws.ping();
      return true;
    } catch {
      return false;
    }
  }

  // ---------------------------------------------------------------------------
  // RECONNECTION
  // ---------------------------------------------------------------------------

  protected async attemptReconnect(): Promise<void> {
    if (this.isReconnecting) return;

    const maxAttempts = this.wsConfig.reconnectAttempts || 10;
    if (this.reconnectAttempts >= maxAttempts) {
      this.log('error', 'Max reconnection attempts reached');
      this.emit('reconnect:failed');
      return;
    }

    this.isReconnecting = true;
    this.reconnectAttempts++;

    const delay = (this.wsConfig.reconnectDelayMs || 5000) * Math.pow(1.5, this.reconnectAttempts - 1);
    this.log('info', `Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${maxAttempts})`);

    await this.sleep(delay);

    try {
      await this.connect();
      this.emit('reconnect:success');
    } catch (error) {
      this.isReconnecting = false;
      this.attemptReconnect();
    }
  }

  // ---------------------------------------------------------------------------
  // HEARTBEAT
  // ---------------------------------------------------------------------------

  protected startHeartbeat(): void {
    if (!this.wsConfig.heartbeatIntervalMs) return;

    this.heartbeatInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        if (this.wsConfig.heartbeatMessage) {
          const msg = typeof this.wsConfig.heartbeatMessage === 'string'
            ? this.wsConfig.heartbeatMessage
            : JSON.stringify(this.wsConfig.heartbeatMessage);
          this.ws.send(msg);
        } else {
          this.ws.ping();
        }
      }
    }, this.wsConfig.heartbeatIntervalMs);
  }

  protected stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = undefined;
    }
  }

  // ---------------------------------------------------------------------------
  // MESSAGE HANDLING
  // ---------------------------------------------------------------------------

  protected parseMessage(data: WebSocket.Data): StreamMessage {
    const raw = data.toString();
    let parsed: unknown;

    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = raw;
    }

    return {
      type: this.getMessageType(parsed),
      timestamp: new Date(),
      data: parsed,
      raw,
    };
  }

  protected handleMessage(message: StreamMessage): void {
    // Add to queue
    this.messageQueue.push(message);
    if (this.messageQueue.length > (this.wsConfig.messageQueueSize || 1000)) {
      this.messageQueue.shift();
    }

    // Emit for listeners
    this.emit('message', message);
    this.emit(`message:${message.type}`, message);

    // Process in subclass
    this.onMessage(message);
  }

  protected getMessageType(data: unknown): string {
    if (typeof data === 'object' && data !== null) {
      const obj = data as Record<string, unknown>;
      return String(obj.type || obj.event || obj.action || 'data');
    }
    return 'data';
  }

  // ---------------------------------------------------------------------------
  // SENDING
  // ---------------------------------------------------------------------------

  send(data: string | object): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket is not connected');
    }

    const message = typeof data === 'string' ? data : JSON.stringify(data);
    this.ws.send(message);
  }

  subscribe(channel: string, params?: Record<string, unknown>): void {
    this.send({
      action: 'subscribe',
      channel,
      ...params,
    });
  }

  unsubscribe(channel: string): void {
    this.send({
      action: 'unsubscribe',
      channel,
    });
  }

  // ---------------------------------------------------------------------------
  // DATA ACCESS
  // ---------------------------------------------------------------------------

  async fetchData(params?: Record<string, unknown>): Promise<StreamMessage[]> {
    // Return queued messages, optionally filtered
    if (!params) {
      return [...this.messageQueue];
    }

    return this.messageQueue.filter(msg => {
      if (params.type && msg.type !== params.type) return false;
      if (params.since && msg.timestamp < new Date(params.since as string)) return false;
      return true;
    });
  }

  getQueuedMessages(): StreamMessage[] {
    return [...this.messageQueue];
  }

  clearQueue(): void {
    this.messageQueue = [];
  }

  // ---------------------------------------------------------------------------
  // ABSTRACT METHODS
  // ---------------------------------------------------------------------------

  protected abstract onConnected(): void;
  protected abstract onMessage(message: StreamMessage): void;

  // ---------------------------------------------------------------------------
  // UTILITIES
  // ---------------------------------------------------------------------------

  protected sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
