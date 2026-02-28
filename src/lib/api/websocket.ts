// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * WebSocket Client for Real-time Updates
 */
import { io, Socket } from 'socket.io-client';
import { tokenManager } from './client';

// WebSocket needs full URL even in dev (no proxy for WS)
const WS_URL =
  import.meta.env.VITE_WS_URL ||
  (typeof window !== 'undefined'
    ? `${window.location.protocol}//${window.location.hostname}:3001`
    : 'http://localhost:3001');

type MessageHandler = (data: unknown) => void;

class WebSocketClient {
  private socket: Socket | null = null;
  private handlers: Map<string, Set<MessageHandler>> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(): void {
    if (this.socket?.connected) {
      return;
    }

    const token = tokenManager.getAccessToken();
    if (!token) {
      console.warn('WebSocket: No auth token available');
      return;
    }

    this.socket = io(WS_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
    });

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    // Forward all events to handlers
    this.socket.onAny((event: string, data: unknown) => {
      const eventHandlers = this.handlers.get(event);
      if (eventHandlers) {
        eventHandlers.forEach((handler) => handler(data));
      }
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event: string, handler: MessageHandler): () => void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);

    // Return unsubscribe function
    return () => {
      this.handlers.get(event)?.delete(handler);
    };
  }

  off(event: string, handler?: MessageHandler): void {
    if (handler) {
      this.handlers.get(event)?.delete(handler);
    } else {
      this.handlers.delete(event);
    }
  }

  emit(event: string, data?: unknown): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('WebSocket not connected, cannot emit:', event);
    }
  }

  // Deliberation-specific methods
  subscribeToDeliberation(deliberationId: string): void {
    this.emit('subscribe:deliberation', { deliberationId });
  }

  unsubscribeFromDeliberation(deliberationId: string): void {
    this.emit('unsubscribe:deliberation', { deliberationId });
  }

  // Workflow execution updates
  subscribeToWorkflow(executionId: string): void {
    this.emit('subscribe:workflow', { executionId });
  }

  unsubscribeFromWorkflow(executionId: string): void {
    this.emit('unsubscribe:workflow', { executionId });
  }

  // Organization-wide alerts
  subscribeToAlerts(): void {
    this.emit('subscribe:alerts');
  }

  // Health score updates
  subscribeToHealth(): void {
    this.emit('subscribe:health');
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}

export const wsClient = new WebSocketClient();

// React hook for WebSocket events
export function useWebSocket(event: string, handler: MessageHandler): void {
  // Note: In a real implementation, this would be a proper React hook
  // with useEffect for cleanup. This is a simplified version.
  wsClient.on(event, handler);
}

export default wsClient;
