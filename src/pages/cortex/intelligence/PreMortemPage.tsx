// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA - PRE-MORTEM ANALYSIS PAGE
// AI-powered failure analysis before decisions are made
// =============================================================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { cn } from '../../../../lib/utils';
import {
  decisionIntelligenceService,
  PreMortemResult,
} from '../../../services/DecisionIntelligenceService';
import { ollamaService, DomainAgent } from '../../../lib/ollama';
import { deterministicFloat, deterministicInt } from '../../../lib/deterministic';
import {
  UserInterventionPanel,
  UserRole,
  UserIntervention,
} from '../../../components/council/UserInterventionPanel';

interface Agent {
  id: string;
  name: string;
  role: string;
  icon: string;
  color: string;
  description: string;
}

interface LiveMessage {
  id: string;
  agentId: string;
  agentName: string;
  agentIcon: string;
  content: string;
  timestamp: Date;
  type: 'agent' | 'user' | 'system';
  userRole?: UserRole;
}

export const PreMortemPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [decision, setDecision] = useState('');
  const [context, setContext] = useState('');
  const [timeframe, setTimeframe] = useState('');
  const [budget, setBudget] = useState('');

  // Pre-populate from URL query params (e.g., from Decision DNA)
  useEffect(() => {
    const decisionParam = searchParams.get('decision');
    const contextParam = searchParams.get('context');
    const timeframeParam = searchParams.get('timeframe');
    const budgetParam = searchParams.get('budget');
    if (decisionParam) {setDecision(decisionParam);}
    if (contextParam) {setContext(contextParam);}
    if (timeframeParam) {setTimeframe(timeframeParam);}
    if (budgetParam) {setBudget(budgetParam);}
  }, [searchParams]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<PreMortemResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgents, setSelectedAgents] = useState<string[]>(['cfo', 'ciso', 'clo']);
  const [ollamaStatus, setOllamaStatus] = useState({ available: false, models: [] as string[] });

  // Live deliberation state
  const [showLiveView, setShowLiveView] = useState(false);
  const [liveMessages, setLiveMessages] = useState<LiveMessage[]>([]);
  const [currentPhase, setCurrentPhase] = useState('initializing');
  const [showInterventionPanel, setShowInterventionPanel] = useState(false);
  const [savedUserRole, setSavedUserRole] = useState<UserRole | null>(null);
  const [userInterventions, setUserInterventions] = useState<UserIntervention[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [liveMessages, scrollToBottom]);

  // Load saved user role from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('datacendia_user_role');
    if (saved) {
      try {
        setSavedUserRole(JSON.parse(saved));
      } catch (e) {
        // Ignore parse errors
      }
    }
  }, []);

  const handleSaveUserRole = (role: UserRole) => {
    setSavedUserRole(role);
    localStorage.setItem('datacendia_user_role', JSON.stringify(role));
  };

  // Load available agents from Ollama
  useEffect(() => {
    const status = ollamaService.getStatus();
    setOllamaStatus(status);

    // Get agents from Ollama service
    const ollamaAgents = ollamaService.getAgents();
    const mappedAgents: Agent[] = ollamaAgents.slice(0, 10).map((a: DomainAgent) => ({
      id: a.code,
      name: a.name,
      role: a.role,
      icon: a.avatar,
      color: a.color,
      description: a.description,
    }));
    setAgents(mappedAgents);
  }, []);

  const toggleAgent = (agentId: string) => {
    setSelectedAgents((prev) =>
      prev.includes(agentId) ? prev.filter((id) => id !== agentId) : [...prev, agentId]
    );
  };

  const addLiveMessage = (message: Omit<LiveMessage, 'id' | 'timestamp'>) => {
    setLiveMessages((prev) => [
      ...prev,
      {
        ...message,
        id: `msg-${Date.now()}-${crypto.randomUUID().slice(0, 4)}`,
        timestamp: new Date(),
      },
    ]);
  };

  const handleUserIntervention = (intervention: Omit<UserIntervention, 'id' | 'timestamp'>) => {
    const newIntervention: UserIntervention = {
      ...intervention,
      id: `intervention-${Date.now()}`,
      timestamp: new Date(),
    };
    setUserInterventions((prev) => [...prev, newIntervention]);

    // Add to live messages
    addLiveMessage({
      agentId: 'user',
      agentName: `${intervention.userRole.title} (You)`,
      agentIcon: intervention.userRole.icon,
      content: intervention.content,
      type: 'user',
      userRole: intervention.userRole,
    });

    // System acknowledgment
    setTimeout(() => {
      addLiveMessage({
        agentId: 'system',
        agentName: 'Council Moderator',
        agentIcon: '🎯',
        content: `Thank you for your input as ${intervention.userRole.title}. The Council is considering your ${intervention.type}.`,
        type: 'system',
      });
    }, 500);
  };

  const runAnalysis = async () => {
    if (!decision.trim()) {
      setError('Please enter a decision to analyze');
      return;
    }

    setIsAnalyzing(true);
    setShowLiveView(true);
    setLiveMessages([]);
    setError(null);
    setCurrentPhase('initializing');

    // Add initial system message
    addLiveMessage({
      agentId: 'system',
      agentName: 'Council Moderator',
      agentIcon: '🎯',
      content: `Pre-Mortem Analysis initiated for: "${decision}"`,
      type: 'system',
    });

    try {
      // Simulate streaming deliberation
      const selectedAgentDetails = agents.filter((a) => selectedAgents.includes(a.id));

      // Phase 1: Initial Analysis
      setCurrentPhase('Initial Analysis');
      addLiveMessage({
        agentId: 'system',
        agentName: 'Council Moderator',
        agentIcon: '🎯',
        content:
          'Phase 1: Each agent will analyze potential failure modes from their domain expertise.',
        type: 'system',
      });

      // Simulate each agent responding
      for (const agent of selectedAgentDetails) {
        await new Promise((resolve) => setTimeout(resolve, 800 + deterministicFloat('premortem-1') * 400));
        addLiveMessage({
          agentId: agent.id,
          agentName: agent.name,
          agentIcon: agent.icon,
          content: `Analyzing decision from ${agent.role} perspective...`,
          type: 'agent',
        });
      }

      // Phase 2: Cross-Examination
      setCurrentPhase('Cross-Examination');
      await new Promise((resolve) => setTimeout(resolve, 500));
      addLiveMessage({
        agentId: 'system',
        agentName: 'Council Moderator',
        agentIcon: '🎯',
        content: "Phase 2: Agents are challenging each other's assumptions.",
        type: 'system',
      });

      // Phase 3: Risk Synthesis
      setCurrentPhase('Risk Synthesis');
      await new Promise((resolve) => setTimeout(resolve, 500));
      addLiveMessage({
        agentId: 'system',
        agentName: 'Council Moderator',
        agentIcon: '🎯',
        content: 'Phase 3: Synthesizing failure modes and calculating risk scores.',
        type: 'system',
      });

      // Use real Decision Intelligence Service with Ollama
      const analysisResult = await decisionIntelligenceService.runPreMortem(
        decision,
        context +
          (userInterventions.length > 0
            ? `\n\nUser Interventions:\n${userInterventions.map((i) => `[${i.userRole.title}]: ${i.content}`).join('\n')}`
            : ''),
        {
          budget: budget ? parseFloat(budget) : undefined,
          timeframe: timeframe || undefined,
          agents: selectedAgents,
        }
      );

      setCurrentPhase('Complete');
      addLiveMessage({
        agentId: 'system',
        agentName: 'Council Moderator',
        agentIcon: '✅',
        content: `Analysis complete. Identified ${analysisResult.failureModes.length} potential failure modes with overall risk score of ${analysisResult.overallRiskScore}%.`,
        type: 'system',
      });

      setResult(analysisResult);
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'Analysis failed');
      addLiveMessage({
        agentId: 'system',
        agentName: 'System',
        agentIcon: 'âŒ',
        content: `Error: ${err instanceof Error ? err.message : 'Analysis failed'}`,
        type: 'system',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRiskColor = (score: number) => {
    if (score < 25) {
      return 'text-green-600 bg-green-50';
    }
    if (score < 50) {
      return 'text-yellow-600 bg-yellow-50';
    }
    if (score < 75) {
      return 'text-orange-600 bg-orange-50';
    }
    return 'text-red-600 bg-red-50';
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'proceed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'proceed_with_caution':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'delay':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'abort':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">💀</span>
          <h1 className="text-3xl font-bold text-neutral-900">Pre-Mortem Analysis</h1>
        </div>
        <p className="text-neutral-600 text-lg">
          Before you decide, let me show you every way this could fail.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Decision Details</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Decision to Analyze *
                </label>
                <textarea
                  value={decision}
                  onChange={(e) => setDecision(e.target.value)}
                  placeholder="e.g., Expand into European market Q2 2025"
                  className="w-full h-24 px-4 py-3 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Additional Context
                </label>
                <textarea
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="Any relevant background information..."
                  className="w-full h-20 px-4 py-3 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Timeframe
                  </label>
                  <input
                    type="text"
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                    placeholder="e.g., Q2 2025"
                    className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Budget ($)
                  </label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="e.g., 2000000"
                    className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Agent Selection */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Select Agents ({selectedAgents.length} selected)
                  <span className="text-neutral-400 font-normal ml-2">
                    More agents = more thorough but slower
                  </span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1">
                  {agents.map((agent) => (
                    <button
                      key={agent.id}
                      onClick={() => toggleAgent(agent.id)}
                      className={cn(
                        'flex items-center gap-2 p-2 rounded-lg border text-left transition-all',
                        selectedAgents.includes(agent.id)
                          ? 'border-amber-500 bg-amber-50 ring-1 ring-amber-200'
                          : 'border-neutral-200 hover:border-neutral-300'
                      )}
                    >
                      <span className="text-lg">{agent.icon}</span>
                      <div className="min-w-0">
                        <div className="text-xs font-medium truncate">{agent.name}</div>
                        <div className="text-[10px] text-neutral-500 truncate">
                          {agent.description}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedAgents(['cfo', 'ciso', 'pessimist'])}
                    className="text-xs text-amber-600 hover:text-amber-700"
                  >
                    Quick (3 agents)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedAgents(agents.map((a) => a.id))}
                    className="text-xs text-amber-600 hover:text-amber-700"
                  >
                    Thorough (all agents)
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={runAnalysis}
                disabled={isAnalyzing || selectedAgents.length === 0}
                className={cn(
                  'w-full py-3 px-4 rounded-lg font-medium text-white',
                  'bg-gradient-to-r from-amber-500 to-orange-500',
                  'hover:from-amber-600 hover:to-orange-600',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'transition-all shadow-sm hover:shadow-md'
                )}
              >
                {isAnalyzing ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Analyzing Failure Modes...
                  </span>
                ) : (
                  '💀 Run Pre-Mortem Analysis'
                )}
              </button>

              {/* User Intervention Button */}
              {isAnalyzing && (
                <button
                  onClick={() => setShowInterventionPanel(true)}
                  className="w-full mt-3 py-3 px-4 rounded-lg font-medium text-amber-700 bg-amber-50 border-2 border-amber-200 hover:bg-amber-100 transition-all flex items-center justify-center gap-2"
                >
                  🎤 Intervene - Add Your Perspective
                </button>
              )}
            </div>
          </div>

          {/* How it Works */}
          <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-6">
            <h3 className="font-semibold text-neutral-900 mb-3">How It Works</h3>
            <ol className="space-y-2 text-sm text-neutral-600">
              <li className="flex items-start gap-2">
                <span className="bg-amber-100 text-amber-700 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                  1
                </span>
                <span>
                  AI agents imagine the decision has <strong>already failed</strong>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-amber-100 text-amber-700 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                  2
                </span>
                <span>
                  They work backward to explain <strong>exactly why</strong> it failed
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-amber-100 text-amber-700 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                  3
                </span>
                <span>
                  Each failure mode is ranked by <strong>probability and cost impact</strong>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-amber-100 text-amber-700 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                  4
                </span>
                <span>
                  You get specific <strong>mitigations</strong> for each risk
                </span>
              </li>
            </ol>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {/* Live Deliberation View */}
          {showLiveView && (
            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">💀</span>
                    <h2 className="font-semibold">Live Pre-Mortem Deliberation</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    {isAnalyzing && (
                      <span className="flex items-center gap-1 px-2 py-1 bg-white/20 text-white text-xs rounded-full">
                        <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        Live
                      </span>
                    )}
                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                      {currentPhase}
                    </span>
                  </div>
                </div>
              </div>

              {/* Messages Stream */}
              <div className="h-80 overflow-y-auto p-4 space-y-3 bg-neutral-50">
                {liveMessages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      'flex gap-3 p-3 rounded-lg',
                      message.type === 'user'
                        ? 'bg-primary-50 border border-primary-200'
                        : message.type === 'system'
                          ? 'bg-amber-50 border border-amber-200'
                          : 'bg-white border border-neutral-200'
                    )}
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-xl">
                      {message.agentIcon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={cn(
                            'font-medium',
                            message.type === 'user'
                              ? 'text-primary-700'
                              : message.type === 'system'
                                ? 'text-amber-700'
                                : 'text-neutral-900'
                          )}
                        >
                          {message.agentName}
                        </span>
                        {message.userRole && (
                          <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">
                            {message.userRole.department}
                          </span>
                        )}
                        <span className="text-xs text-neutral-400">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-neutral-700 text-sm">{message.content}</p>
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {isAnalyzing && (
                  <div className="flex items-center gap-2 text-neutral-500 text-sm p-2">
                    <div className="flex gap-1">
                      <span
                        className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0ms' }}
                      />
                      <span
                        className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"
                        style={{ animationDelay: '150ms' }}
                      />
                      <span
                        className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"
                        style={{ animationDelay: '300ms' }}
                      />
                    </div>
                    <span>Agents are analyzing...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Intervention Button */}
              {isAnalyzing && (
                <div className="p-4 border-t border-neutral-200 bg-white">
                  <button
                    onClick={() => setShowInterventionPanel(true)}
                    className="w-full py-3 px-4 rounded-lg font-medium text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 transition-all flex items-center justify-center gap-2"
                  >
                    🎤 Add Your Voice to the Deliberation
                  </button>
                  <p className="text-xs text-neutral-500 text-center mt-2">
                    Share your perspective, ask questions, or raise objections
                  </p>
                </div>
              )}
            </div>
          )}

          {result ? (
            <>
              {/* Summary Card */}
              <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-neutral-900">Analysis Results</h2>
                  <span
                    className={cn(
                      'px-3 py-1 rounded-full text-sm font-medium',
                      getRiskColor(result.overallRiskScore)
                    )}
                  >
                    Risk Score: {result.overallRiskScore}%
                  </span>
                </div>

                {/* Recommendation */}
                <div
                  className={cn(
                    'p-4 rounded-lg border mb-4',
                    getActionColor(result.recommendation.action)
                  )}
                >
                  <div className="font-semibold mb-1">
                    Recommendation: {result.recommendation.action.replace('_', ' ').toUpperCase()}
                  </div>
                  <p className="text-sm">{result.recommendation.reasoning}</p>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-neutral-50 rounded-lg p-4">
                    <div className="text-sm text-neutral-500">Failure Modes Identified</div>
                    <div className="text-2xl font-bold text-neutral-900">
                      {result.failureModes.length}
                    </div>
                  </div>
                  <div className="bg-neutral-50 rounded-lg p-4">
                    <div className="text-sm text-neutral-500">Risk-Weighted Exposure</div>
                    <div className="text-2xl font-bold text-red-600">
                      ${(result.totalRiskWeightedExposure / 1000000).toFixed(1)}M
                    </div>
                  </div>
                </div>
              </div>

              {/* Failure Modes */}
              <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-neutral-900 mb-4">Failure Modes</h2>
                <div className="space-y-3">
                  {result.failureModes.map((mode, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-neutral-50 rounded-lg border border-neutral-100"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="bg-neutral-200 text-neutral-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                            {mode.rank}
                          </span>
                          <span className="font-medium text-neutral-900">{mode.title}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <span
                            className={cn(
                              'px-2 py-0.5 rounded',
                              mode.probability > 60
                                ? 'bg-red-100 text-red-700'
                                : mode.probability > 40
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-green-100 text-green-700'
                            )}
                          >
                            {mode.probability}%
                          </span>
                          <span className="text-neutral-500">
                            ${(mode.costImpact / 1000).toFixed(0)}K
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-neutral-500 uppercase tracking-wide mb-2">
                        {mode.category}
                      </div>
                      {mode.mitigations && mode.mitigations.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-neutral-200">
                          <div className="text-xs text-neutral-500 mb-1">Mitigations:</div>
                          <ul className="text-sm text-neutral-600 space-y-1">
                            {mode.mitigations.slice(0, 2).map((m, i) => (
                              <li key={i} className="flex items-start gap-1">
                                <span className="text-green-500">•</span>
                                <span>{typeof m === 'string' ? m : m.action}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Executive Summary */}
              <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-neutral-900 mb-4">Executive Summary</h2>
                <pre className="whitespace-pre-wrap text-sm text-neutral-700 font-sans">
                  {result.executiveSummary}
                </pre>
              </div>
            </>
          ) : (
            <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-12 text-center">
              <div className="text-6xl mb-4">💀</div>
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No Analysis Yet</h3>
              <p className="text-neutral-500">
                Enter a decision and run the Pre-Mortem analysis to see potential failure modes.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* User Intervention Panel */}
      <UserInterventionPanel
        isOpen={showInterventionPanel}
        onClose={() => setShowInterventionPanel(false)}
        onSubmit={handleUserIntervention}
        currentPhase={currentPhase}
        agentMessages={liveMessages
          .filter((m) => m.type === 'agent')
          .map((m) => ({ agentId: m.agentId, agentName: m.agentName, content: m.content }))}
        savedRole={savedUserRole}
        onRoleSave={handleSaveUserRole}
        disabled={!isAnalyzing}
      />
    </div>
  );
};

export default PreMortemPage;
