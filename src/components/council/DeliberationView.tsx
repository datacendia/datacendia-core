// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Deliberation View Component
 * Real-time display of AI council deliberation with streaming messages
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '../../../lib/utils';
import { wsClient } from '../../lib/api/websocket';
import { councilApi } from '../../lib/api';
import type {
  Deliberation as ApiDeliberation,
  DeliberationMessage as ApiDeliberationMessage,
} from '../../lib/api/types';
import AgentCard from './AgentCard';
import { UserInterventionPanel, UserRole, UserIntervention } from './UserInterventionPanel';

interface Agent {
  id: string;
  code: string;
  name: string;
  role: string;
  description: string;
  avatarUrl?: string;
  status: 'online' | 'offline' | 'busy';
}

interface DeliberationMessage {
  id: string;
  agentId: string;
  phase: string;
  content: string;
  sources?: Array<{ entityId: string; name: string; relevance: number }>;
  confidence?: number;
  timestamp: string;
}

interface Deliberation {
  id: string;
  question: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  phase: string;
  progress: number;
  agents: string[];
  result?: {
    decision: string;
    confidence: number;
    dissent?: string[];
  };
}

interface DeliberationViewProps {
  deliberationId: string;
  agents: Agent[];
  onComplete?: (result: Deliberation['result']) => void;
  onCancel?: () => void;
  enableUserIntervention?: boolean;
}

// Phase display names
const phaseNames: Record<string, string> = {
  initial_analysis: 'Initial Analysis',
  cross_examination: 'Cross-Examination',
  synthesis: 'Synthesis',
  ethics_check: 'Ethics Check',
};

// Phase colors
const phaseColors: Record<string, string> = {
  initial_analysis: '#3B82F6',
  cross_examination: '#F59E0B',
  synthesis: '#10B981',
  ethics_check: '#8B5CF6',
};

export const DeliberationView: React.FC<DeliberationViewProps> = ({
  deliberationId,
  agents,
  onComplete,
  onCancel,
  enableUserIntervention = true,
}) => {
  const [deliberation, setDeliberation] = useState<Deliberation | null>(null);
  const [messages, setMessages] = useState<DeliberationMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // User intervention state
  const [showInterventionPanel, setShowInterventionPanel] = useState(false);
  const [savedUserRole, setSavedUserRole] = useState<UserRole | null>(null);
  const [userInterventions, setUserInterventions] = useState<UserIntervention[]>([]);

  // Load saved user role
  useEffect(() => {
    const saved = localStorage.getItem('datacendia_user_role');
    if (saved) {
      try {
        setSavedUserRole(JSON.parse(saved));
      } catch (e) {
        /* ignore */
      }
    }
  }, []);

  const handleSaveUserRole = (role: UserRole) => {
    setSavedUserRole(role);
    localStorage.setItem('datacendia_user_role', JSON.stringify(role));
  };

  const handleUserIntervention = async (
    intervention: Omit<UserIntervention, 'id' | 'timestamp'>
  ) => {
    const newIntervention: UserIntervention = {
      ...intervention,
      id: `intervention-${Date.now()}`,
      timestamp: new Date(),
    };
    setUserInterventions((prev) => [...prev, newIntervention]);

    // Add user message to the messages stream
    const userMessage: DeliberationMessage = {
      id: `user-msg-${Date.now()}`,
      agentId: 'user',
      phase: deliberation?.phase || 'user_intervention',
      content: `**[${intervention.userRole.title} - ${intervention.userRole.department}]**: ${intervention.content}`,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Send to backend (optional - for real integration)
    try {
      await councilApi.addUserIntervention(deliberationId, {
        role: intervention.userRole,
        content: intervention.content,
        type: intervention.type,
      });
    } catch (err) {
      console.log('User intervention sent locally');
    }

    setShowInterventionPanel(false);
  };

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Load initial data and connect to WebSocket
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const initialize = async () => {
      try {
        setIsLoading(true);

        // Fetch current deliberation state
        const response = await councilApi.getDeliberation(deliberationId);
        if (response.success && response.data) {
          setDeliberation(response.data);

          if (response.data.status === 'completed' && response.data.result) {
            onComplete?.(response.data.result);
          }
        }

        // Fetch existing transcript
        const transcriptResponse = await councilApi.getDeliberationTranscript(deliberationId);
        if (transcriptResponse.success && transcriptResponse.data) {
          const allMessages: DeliberationMessage[] = [];
          transcriptResponse.data.phases.forEach(
            (phase: { phase: string; messages: DeliberationMessage[] }) => {
              allMessages.push(...phase.messages);
            }
          );
          setMessages(allMessages);
        }

        // Connect to WebSocket for real-time updates
        wsClient.connect();
        wsClient.subscribeToDeliberation(deliberationId);
        setIsStreaming(true);

        // Listen for new messages
        unsubscribe = wsClient.on('deliberation:message', (data: unknown) => {
          const message = data as DeliberationMessage & { deliberationId: string };
          if (message.deliberationId === deliberationId) {
            setMessages((prev) => [...prev, message]);
          }
        });

        // Listen for phase changes
        wsClient.on('deliberation:phase', (data: unknown) => {
          const update = data as { deliberationId: string; phase: string; progress: number };
          if (update.deliberationId === deliberationId) {
            setDeliberation((prev) =>
              prev ? { ...prev, phase: update.phase, progress: update.progress } : null
            );
          }
        });

        // Listen for completion
        wsClient.on('deliberation:complete', (data: unknown) => {
          const result = data as { deliberationId: string; result: Deliberation['result'] };
          if (result.deliberationId === deliberationId) {
            setDeliberation((prev) =>
              prev ? { ...prev, status: 'completed', result: result.result } : null
            );
            onComplete?.(result.result);
          }
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load deliberation');
      } finally {
        setIsLoading(false);
      }
    };

    initialize();

    return () => {
      unsubscribe?.();
      wsClient.unsubscribeFromDeliberation(deliberationId);
    };
  }, [deliberationId, onComplete]);

  const handleCancel = async () => {
    try {
      await councilApi.controlDeliberation(deliberationId, 'cancel');
      onCancel?.();
    } catch (err) {
      setError('Failed to cancel deliberation');
    }
  };

  const handleSkipToSynthesis = async () => {
    try {
      await councilApi.controlDeliberation(deliberationId, 'skip_to_synthesis');
    } catch (err) {
      setError('Failed to skip to synthesis');
    }
  };

  const getAgentById = (agentId: string) => {
    return agents.find((a) => a.id === agentId || a.code === agentId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-500">Loading deliberation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (!deliberation) {
    return null;
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-neutral-200 overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-neutral-200 bg-neutral-50">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h2 className="font-semibold text-neutral-900">Council Deliberation</h2>
            <p className="text-sm text-neutral-600 mt-1 line-clamp-2">{deliberation.question}</p>
          </div>
          <div className="flex items-center gap-2">
            {isStreaming && (
              <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Live
              </span>
            )}
            {deliberation.status === 'in_progress' && (
              <>
                <button
                  onClick={handleSkipToSynthesis}
                  className="px-3 py-1 text-sm text-neutral-600 hover:bg-neutral-100 rounded"
                >
                  Skip to Synthesis
                </button>
                <button
                  onClick={handleCancel}
                  className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium" style={{ color: phaseColors[deliberation.phase] }}>
              {phaseNames[deliberation.phase] || deliberation.phase}
            </span>
            <span className="text-neutral-500">{Math.round(deliberation.progress)}%</span>
          </div>
          <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-500"
              style={{
                width: `${deliberation.progress}%`,
                backgroundColor: phaseColors[deliberation.phase] || '#6B7280',
              }}
            />
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => {
          const agent = getAgentById(message.agentId);
          const isNewPhase = index === 0 || messages[index - 1].phase !== message.phase;

          return (
            <React.Fragment key={message.id || index}>
              {/* Phase divider */}
              {isNewPhase && (
                <div className="flex items-center gap-3 py-2">
                  <div className="flex-1 h-px bg-neutral-200" />
                  <span
                    className="px-3 py-1 text-xs font-medium rounded-full"
                    style={{
                      backgroundColor: `${phaseColors[message.phase]}20`,
                      color: phaseColors[message.phase],
                    }}
                  >
                    {phaseNames[message.phase] || message.phase}
                  </span>
                  <div className="flex-1 h-px bg-neutral-200" />
                </div>
              )}

              {/* Message */}
              <div className="flex gap-3">
                {agent ? (
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center font-semibold text-primary-700 text-sm">
                    {agent.name.slice(0, 2)}
                  </div>
                ) : (
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-neutral-200" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-neutral-900">
                      {agent?.name || message.agentId}
                    </span>
                    <span className="text-xs text-neutral-400">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                    {message.confidence && (
                      <span className="text-xs text-neutral-500">
                        {Math.round(message.confidence * 100)}% confidence
                      </span>
                    )}
                  </div>
                  <div className="text-neutral-700 whitespace-pre-wrap">{message.content}</div>

                  {/* Sources */}
                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {message.sources.map((source, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 text-xs bg-neutral-100 text-neutral-600 rounded"
                        >
                          📊 {source.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </React.Fragment>
          );
        })}

        {/* Typing indicator */}
        {deliberation.status === 'in_progress' && (
          <div className="flex items-center gap-2 text-neutral-500 text-sm">
            <div className="flex gap-1">
              <span
                className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"
                style={{ animationDelay: '0ms' }}
              />
              <span
                className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"
                style={{ animationDelay: '150ms' }}
              />
              <span
                className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"
                style={{ animationDelay: '300ms' }}
              />
            </div>
            <span>Agents are deliberating...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* User Intervention Button */}
      {enableUserIntervention && deliberation.status === 'in_progress' && (
        <div className="flex-shrink-0 p-3 border-t border-neutral-200 bg-neutral-50">
          <button
            onClick={() => setShowInterventionPanel(true)}
            className="w-full py-2.5 px-4 rounded-lg font-medium text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            🎤 Add Your Voice to the Deliberation
          </button>
          <p className="text-xs text-neutral-500 text-center mt-1">
            Share your perspective as a stakeholder
          </p>
        </div>
      )}

      {/* Result (if completed) */}
      {deliberation.status === 'completed' && deliberation.result && (
        <div className="flex-shrink-0 p-4 border-t border-neutral-200 bg-green-50">
          <h3 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Council Decision
          </h3>
          <p className="text-green-900 mb-2">{deliberation.result.decision}</p>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-green-700">
              Confidence: {Math.round(deliberation.result.confidence * 100)}%
            </span>
            {deliberation.result.dissent && deliberation.result.dissent.length > 0 && (
              <span className="text-amber-700">
                {deliberation.result.dissent.length} agent(s) dissented
              </span>
            )}
            {userInterventions.length > 0 && (
              <span className="text-primary-700">
                {userInterventions.length} user intervention(s)
              </span>
            )}
          </div>
        </div>
      )}

      {/* User Intervention Panel */}
      <UserInterventionPanel
        isOpen={showInterventionPanel}
        onClose={() => setShowInterventionPanel(false)}
        onSubmit={handleUserIntervention}
        currentPhase={phaseNames[deliberation.phase] || deliberation.phase}
        agentMessages={messages
          .filter((m) => m.agentId !== 'user')
          .slice(-10)
          .map((m) => ({
            agentId: m.agentId,
            agentName: getAgentById(m.agentId)?.name || m.agentId,
            content: m.content,
          }))}
        savedRole={savedUserRole}
        onRoleSave={handleSaveUserRole}
        disabled={deliberation.status !== 'in_progress'}
      />
    </div>
  );
};

export default DeliberationView;
