// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA COUNCIL STREAMING CLIENT
// Real-time WebSocket Client for AI Deliberations
// =============================================================================

export interface StreamEvent {
  type:
    | 'start'
    | 'token'
    | 'complete'
    | 'error'
    | 'phase_change'
    | 'agent_start'
    | 'agent_complete'
    | 'challenge'
    | 'synthesis';
  deliberationId: string;
  agentId?: string;
  content?: string;
  phase?: string;
  metadata?: any;
  timestamp: Date;
}

export interface DeliberationState {
  id: string;
  question: string;
  status: string;
  currentPhase: string;
  participatingAgents: string[];
  responses: Map<string, AgentStreamState>;
  synthesis?: string;
  confidence?: number;
  startedAt?: Date;
  completedAt?: Date;
}

export interface AgentStreamState {
  agentId: string;
  phase: string;
  isStreaming: boolean;
  content: string;
  confidence?: number;
  latency?: number;
  challenges: ChallengeState[];
}

export interface ChallengeState {
  challengerId: string;
  content: string;
  rebuttal?: string;
  resolved: boolean;
}

type EventCallback = (event: StreamEvent) => void;
type StateCallback = (state: DeliberationState) => void;
type ConnectionCallback = (connected: boolean) => void;

// =============================================================================
// COUNCIL STREAM CLIENT
// =============================================================================

export class CouncilStreamClient {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private heartbeatInterval: number | null = null;
  private isConnecting = false;

  // Event handlers
  private eventListeners: Map<string, Set<EventCallback>> = new Map();
  private stateListeners: Set<StateCallback> = new Set();
  private connectionListeners: Set<ConnectionCallback> = new Set();

  // State
  private deliberationStates: Map<string, DeliberationState> = new Map();
  private subscribedDeliberations: Set<string> = new Set();

  constructor(url?: string) {
    this.url = url || this.getDefaultUrl();
  }

  private getDefaultUrl(): string {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    return `${protocol}//${host}/ws/council`;
  }

  // ===========================================================================
  // CONNECTION MANAGEMENT
  // ===========================================================================

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }

      if (this.isConnecting) {
        reject(new Error('Already connecting'));
        return;
      }

      this.isConnecting = true;

      try {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          console.log('[CouncilStream] Connected');
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          this.startHeartbeat();
          this.notifyConnectionListeners(true);

          // Resubscribe to deliberations
          for (const id of this.subscribedDeliberations) {
            this.send({ type: 'subscribe', deliberationId: id });
          }

          resolve();
        };

        this.ws.onclose = (event) => {
          console.log('[CouncilStream] Disconnected', event.code, event.reason);
          this.isConnecting = false;
          this.stopHeartbeat();
          this.notifyConnectionListeners(false);
          this.attemptReconnect();
        };

        this.ws.onerror = (error) => {
          console.error('[CouncilStream] Error', error);
          this.isConnecting = false;
          reject(error);
        };

        this.ws.onmessage = (event) => {
          this.handleMessage(event.data);
        };
      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  disconnect(): void {
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('[CouncilStream] Max reconnect attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    console.log(`[CouncilStream] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);

    setTimeout(() => {
      this.connect().catch(() => {
        // Will trigger another reconnect attempt
      });
    }, delay);
  }

  private startHeartbeat(): void {
    this.heartbeatInterval = window.setInterval(() => {
      this.send({ type: 'ping' });
    }, 25000);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  // ===========================================================================
  // MESSAGE HANDLING
  // ===========================================================================

  private handleMessage(data: string): void {
    try {
      const message = JSON.parse(data);

      switch (message.type) {
        case 'connected':
          console.log('[CouncilStream] Client ID:', message.clientId);
          break;

        case 'subscribed':
          console.log('[CouncilStream] Subscribed to:', message.deliberationId);
          break;

        case 'deliberation_state':
          this.updateDeliberationState(message.deliberation);
          break;

        case 'deliberation_started':
          console.log('[CouncilStream] Deliberation started:', message.deliberationId);
          this.subscribedDeliberations.add(message.deliberationId);
          break;

        case 'stream_event':
          this.handleStreamEvent(message.event);
          break;

        case 'pong':
          // Heartbeat response
          break;

        case 'error':
          console.error('[CouncilStream] Server error:', message.message);
          break;

        default:
          console.log('[CouncilStream] Unknown message:', message.type);
      }
    } catch (error) {
      console.error('[CouncilStream] Failed to parse message:', error);
    }
  }

  private handleStreamEvent(event: StreamEvent): void {
    const state = this.deliberationStates.get(event.deliberationId);

    if (state) {
      // Update state based on event
      switch (event.type) {
        case 'phase_change':
          state.currentPhase = event.phase || state.currentPhase;
          state.status = event.phase || state.status;
          break;

        case 'agent_start':
          if (event.agentId) {
            const agentState = state.responses.get(event.agentId) || {
              agentId: event.agentId,
              phase: state.currentPhase,
              isStreaming: true,
              content: '',
              challenges: [],
            };
            agentState.isStreaming = true;
            agentState.phase = state.currentPhase;
            state.responses.set(event.agentId, agentState);
          }
          break;

        case 'token':
          if (event.agentId && event.content) {
            const agentState = state.responses.get(event.agentId);
            if (agentState) {
              agentState.content += event.content;
            }
          }
          break;

        case 'agent_complete':
          if (event.agentId) {
            const agentState = state.responses.get(event.agentId);
            if (agentState) {
              agentState.isStreaming = false;
              if (event.content) {
                agentState.content = event.content;
              }
              if (event.metadata?.confidence) {
                agentState.confidence = event.metadata.confidence;
              }
              if (event.metadata?.latency) {
                agentState.latency = event.metadata.latency;
              }
            }
          }
          break;

        case 'challenge':
          if (event.agentId && event.metadata?.targetAgentId) {
            const targetState = state.responses.get(event.metadata.targetAgentId);
            if (targetState) {
              targetState.challenges.push({
                challengerId: event.agentId,
                content: '',
                resolved: false,
              });
            }
          }
          break;

        case 'synthesis':
          state.currentPhase = 'synthesis';
          break;

        case 'complete':
          state.status = 'completed';
          if (event.content) {
            state.synthesis = event.content;
          }
          if (event.metadata?.confidence) {
            state.confidence = event.metadata.confidence;
          }
          state.completedAt = new Date();
          break;

        case 'error':
          state.status = 'error';
          break;
      }

      this.notifyStateListeners(state);
    }

    // Notify event listeners
    this.notifyEventListeners(event.deliberationId, event);
  }

  private updateDeliberationState(deliberation: any): void {
    const state: DeliberationState = {
      id: deliberation.id,
      question: deliberation.question,
      status: deliberation.status,
      currentPhase: deliberation.currentPhase || deliberation.status,
      participatingAgents: deliberation.participatingAgents || [],
      responses: new Map(),
      synthesis: deliberation.synthesis,
      confidence: deliberation.confidenceScore,
      startedAt: deliberation.startedAt ? new Date(deliberation.startedAt) : undefined,
      completedAt: deliberation.completedAt ? new Date(deliberation.completedAt) : undefined,
    };

    this.deliberationStates.set(deliberation.id, state);
    this.notifyStateListeners(state);
  }

  // ===========================================================================
  // DELIBERATION API
  // ===========================================================================

  subscribe(deliberationId: string): void {
    this.subscribedDeliberations.add(deliberationId);

    if (!this.deliberationStates.has(deliberationId)) {
      this.deliberationStates.set(deliberationId, {
        id: deliberationId,
        question: '',
        status: 'pending',
        currentPhase: 'pending',
        participatingAgents: [],
        responses: new Map(),
      });
    }

    if (this.isConnected()) {
      this.send({ type: 'subscribe', deliberationId });
    }
  }

  unsubscribe(deliberationId: string): void {
    this.subscribedDeliberations.delete(deliberationId);
    this.deliberationStates.delete(deliberationId);

    if (this.isConnected()) {
      this.send({ type: 'unsubscribe', deliberationId });
    }
  }

  startDeliberation(
    question: string,
    options: {
      agentIds?: string[];
      context?: string;
      config?: {
        maxDurationSeconds?: number;
        requireConsensus?: boolean;
        enableCrossExamination?: boolean;
        minConfidenceThreshold?: number;
        maxRounds?: number;
      };
    } = {}
  ): void {
    this.send({
      type: 'start_deliberation',
      payload: {
        question,
        ...options,
      },
    });
  }

  getDeliberationState(deliberationId: string): DeliberationState | undefined {
    return this.deliberationStates.get(deliberationId);
  }

  // ===========================================================================
  // EVENT LISTENERS
  // ===========================================================================

  onEvent(deliberationId: string, callback: EventCallback): () => void {
    if (!this.eventListeners.has(deliberationId)) {
      this.eventListeners.set(deliberationId, new Set());
    }
    this.eventListeners.get(deliberationId)!.add(callback);

    return () => {
      this.eventListeners.get(deliberationId)?.delete(callback);
    };
  }

  onStateChange(callback: StateCallback): () => void {
    this.stateListeners.add(callback);
    return () => {
      this.stateListeners.delete(callback);
    };
  }

  onConnectionChange(callback: ConnectionCallback): () => void {
    this.connectionListeners.add(callback);
    return () => {
      this.connectionListeners.delete(callback);
    };
  }

  private notifyEventListeners(deliberationId: string, event: StreamEvent): void {
    const listeners = this.eventListeners.get(deliberationId);
    if (listeners) {
      listeners.forEach((callback) => callback(event));
    }
  }

  private notifyStateListeners(state: DeliberationState): void {
    this.stateListeners.forEach((callback) => callback(state));
  }

  private notifyConnectionListeners(connected: boolean): void {
    this.connectionListeners.forEach((callback) => callback(connected));
  }

  // ===========================================================================
  // UTILITIES
  // ===========================================================================

  private send(message: any): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('[CouncilStream] Cannot send - not connected');
    }
  }
}

// Singleton instance
let clientInstance: CouncilStreamClient | null = null;

export function getCouncilStreamClient(): CouncilStreamClient {
  if (!clientInstance) {
    clientInstance = new CouncilStreamClient();
  }
  return clientInstance;
}

export default CouncilStreamClient;
