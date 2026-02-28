// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA COUNCIL STREAMING HOOKS
// React Hooks for Real-time AI Deliberations
// =============================================================================

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  CouncilStreamClient,
  getCouncilStreamClient,
  DeliberationState,
  StreamEvent,
  AgentStreamState,
} from './CouncilStreamClient';

// =============================================================================
// TYPES
// =============================================================================

export interface UseCouncilStreamOptions {
  autoConnect?: boolean;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: any) => void;
}

export interface UseDeliberationOptions {
  onPhaseChange?: (phase: string) => void;
  onAgentStart?: (agentId: string) => void;
  onAgentComplete?: (agentId: string, content: string) => void;
  onToken?: (agentId: string, token: string) => void;
  onChallenge?: (challengerId: string, targetId: string) => void;
  onComplete?: (synthesis: string, confidence: number) => void;
  onError?: (error: string) => void;
}

// =============================================================================
// useCouncilConnection - Connection Management
// =============================================================================

export function useCouncilConnection(options: UseCouncilStreamOptions = {}) {
  const { autoConnect = true, onConnect, onDisconnect, onError } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const clientRef = useRef<CouncilStreamClient | null>(null);

  useEffect(() => {
    clientRef.current = getCouncilStreamClient();

    const unsubscribe = clientRef.current.onConnectionChange((connected) => {
      setIsConnected(connected);
      setIsConnecting(false);
      if (connected) {
        onConnect?.();
      } else {
        onDisconnect?.();
      }
    });

    if (autoConnect) {
      setIsConnecting(true);
      clientRef.current.connect().catch((error) => {
        setIsConnecting(false);
        onError?.(error);
      });
    }

    return () => {
      unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoConnect]);

  const connect = useCallback(async () => {
    if (!clientRef.current) {
      return;
    }
    setIsConnecting(true);
    try {
      await clientRef.current.connect();
    } catch (error) {
      onError?.(error);
    } finally {
      setIsConnecting(false);
    }
  }, [onError]);

  const disconnect = useCallback(() => {
    clientRef.current?.disconnect();
  }, []);

  return {
    isConnected,
    isConnecting,
    connect,
    disconnect,
    client: clientRef.current,
  };
}

// =============================================================================
// useDeliberation - Single Deliberation Management
// =============================================================================

export function useDeliberation(
  deliberationId: string | null,
  options: UseDeliberationOptions = {}
) {
  const {
    onPhaseChange,
    onAgentStart,
    onAgentComplete,
    onToken,
    onChallenge,
    onComplete,
    onError,
  } = options;

  const [state, setState] = useState<DeliberationState | null>(null);
  const [agentResponses, setAgentResponses] = useState<Map<string, AgentStreamState>>(new Map());
  const [currentPhase, setCurrentPhase] = useState<string>('pending');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingAgentId, setStreamingAgentId] = useState<string | null>(null);

  const clientRef = useRef<CouncilStreamClient | null>(null);

  useEffect(() => {
    if (!deliberationId) {
      return;
    }

    clientRef.current = getCouncilStreamClient();

    // Subscribe to deliberation
    clientRef.current.subscribe(deliberationId);

    // Listen for state changes
    const unsubscribeState = clientRef.current.onStateChange((newState) => {
      if (newState.id === deliberationId) {
        setState(newState);
        setAgentResponses(new Map(newState.responses));
        setCurrentPhase(newState.currentPhase);
      }
    });

    // Listen for events
    const unsubscribeEvents = clientRef.current.onEvent(deliberationId, (event) => {
      switch (event.type) {
        case 'phase_change':
          setCurrentPhase(event.phase || 'unknown');
          onPhaseChange?.(event.phase || 'unknown');
          break;

        case 'agent_start':
          setIsStreaming(true);
          setStreamingAgentId(event.agentId || null);
          if (event.agentId) {
            onAgentStart?.(event.agentId);
          }
          break;

        case 'token':
          if (event.agentId && event.content) {
            setAgentResponses((prev) => {
              const updated = new Map(prev);
              const agentState = updated.get(event.agentId!) || {
                agentId: event.agentId!,
                phase: currentPhase,
                isStreaming: true,
                content: '',
                challenges: [],
              };
              agentState.content += event.content;
              updated.set(event.agentId!, agentState);
              return updated;
            });
            onToken?.(event.agentId, event.content);
          }
          break;

        case 'agent_complete':
          setIsStreaming(false);
          setStreamingAgentId(null);
          if (event.agentId && event.content) {
            onAgentComplete?.(event.agentId, event.content);
          }
          break;

        case 'challenge':
          if (event.agentId && event.metadata?.targetAgentId) {
            onChallenge?.(event.agentId, event.metadata.targetAgentId);
          }
          break;

        case 'complete':
          if (event.content && event.metadata?.confidence) {
            onComplete?.(event.content, event.metadata.confidence);
          }
          break;

        case 'error':
          onError?.(event.content || 'Unknown error');
          break;
      }
    });

    return () => {
      unsubscribeState();
      unsubscribeEvents();
      clientRef.current?.unsubscribe(deliberationId);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deliberationId, currentPhase]);

  return {
    state,
    agentResponses,
    currentPhase,
    isStreaming,
    streamingAgentId,
  };
}

// =============================================================================
// useCouncilDeliberation - Full Deliberation with Controls
// =============================================================================

export interface DeliberationConfig {
  maxDurationSeconds?: number;
  requireConsensus?: boolean;
  enableCrossExamination?: boolean;
  minConfidenceThreshold?: number;
  maxRounds?: number;
}

export function useCouncilDeliberation() {
  const [activeDeliberationId, setActiveDeliberationId] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clientRef = useRef<CouncilStreamClient | null>(null);

  useEffect(() => {
    clientRef.current = getCouncilStreamClient();
  }, []);

  const startDeliberation = useCallback(
    async (
      question: string,
      options: {
        agentIds?: string[];
        context?: string;
        config?: DeliberationConfig;
      } = {}
    ) => {
      if (!clientRef.current) {
        setError('Client not initialized');
        return null;
      }

      setIsStarting(true);
      setError(null);

      try {
        // Connect if not connected
        if (!clientRef.current.isConnected()) {
          await clientRef.current.connect();
        }

        // Start deliberation via WebSocket
        clientRef.current.startDeliberation(question, options);

        // The deliberation ID will come back via WebSocket message
        // We'll update the activeDeliberationId when we receive it

        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to start deliberation');
        return null;
      } finally {
        setIsStarting(false);
      }
    },
    []
  );

  const cancelDeliberation = useCallback(() => {
    if (activeDeliberationId && clientRef.current) {
      clientRef.current.unsubscribe(activeDeliberationId);
      setActiveDeliberationId(null);
    }
  }, [activeDeliberationId]);

  // Listen for new deliberation ID
  useEffect(() => {
    if (!clientRef.current) {
      return;
    }

    const unsubscribe = clientRef.current.onStateChange((state) => {
      if (!activeDeliberationId && state.status === 'initial_analysis') {
        setActiveDeliberationId(state.id);
      }
    });

    return unsubscribe;
  }, [activeDeliberationId]);

  return {
    activeDeliberationId,
    isStarting,
    error,
    startDeliberation,
    cancelDeliberation,
    setActiveDeliberationId,
  };
}

// =============================================================================
// useAgentStream - Stream Single Agent Response
// =============================================================================

export function useAgentStream(deliberationId: string | null, agentId: string | null) {
  const [content, setContent] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [latency, setLatency] = useState<number | null>(null);

  useEffect(() => {
    if (!deliberationId || !agentId) {
      return;
    }

    const client = getCouncilStreamClient();

    const unsubscribe = client.onEvent(deliberationId, (event) => {
      if (event.agentId !== agentId) {
        return;
      }

      switch (event.type) {
        case 'agent_start':
          setContent('');
          setIsStreaming(true);
          setIsComplete(false);
          break;

        case 'token':
          if (event.content) {
            setContent((prev) => prev + event.content);
          }
          break;

        case 'agent_complete':
          setIsStreaming(false);
          setIsComplete(true);
          if (event.content) {
            setContent(event.content);
          }
          if (event.metadata?.confidence) {
            setConfidence(event.metadata.confidence);
          }
          if (event.metadata?.latency) {
            setLatency(event.metadata.latency);
          }
          break;
      }
    });

    return unsubscribe;
  }, [deliberationId, agentId]);

  return {
    content,
    isStreaming,
    isComplete,
    confidence,
    latency,
  };
}

// =============================================================================
// Export all hooks
// =============================================================================

export default {
  useCouncilConnection,
  useDeliberation,
  useCouncilDeliberation,
  useAgentStream,
};
