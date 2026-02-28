// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA - COUNCIL SUB-PAGES
// =============================================================================

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { cn, formatRelativeTime } from '../../../../lib/utils';

// =============================================================================
// DELIBERATION VIEW PAGE
// =============================================================================

export const DeliberationViewPage: React.FC = () => {
  const navigate = useNavigate();
  const { deliberationId } = useParams();
  const [isLive, setIsLive] = useState(true);

  // Mock deliberation data
  const deliberation = {
    id: deliberationId || 'delib-1',
    query: 'What would be the impact of expanding into the European market in Q2 2026?',
    status: 'in_progress',
    phase: 'cross_examination',
    progress: 65,
    startedAt: new Date(Date.now() - 1800000),
    participants: ['chief', 'cfo', 'coo', 'cro', 'risk'],
  };

  const agentInfo: Record<string, { name: string; icon: string; color: string }> = {
    chief: { name: 'CendiaChief', icon: '👔', color: '#6366F1' },
    cfo: { name: 'CendiaCFO', icon: '💰', color: '#10B981' },
    coo: { name: 'CendiaCOO', icon: '⚙️', color: '#F59E0B' },
    cro: { name: 'CendiaCRO', icon: '📈', color: '#8B5CF6' },
    risk: { name: 'CendiaRisk', icon: '⚠️', color: '#F97316' },
  };

  const transcript = [
    {
      agent: 'chief',
      phase: 'initial',
      message:
        "I'll coordinate this analysis. Let me gather perspectives from the relevant agents on the European expansion question.",
      timestamp: new Date(Date.now() - 1800000),
    },
    {
      agent: 'cfo',
      phase: 'initial',
      message:
        'From a financial perspective, European expansion in Q2 2026 would require approximately $15M in initial investment. Based on our current cash position of $45M and projected Q1 revenues, this is feasible but would reduce our runway to 18 months.',
      timestamp: new Date(Date.now() - 1700000),
    },
    {
      agent: 'coo',
      phase: 'initial',
      message:
        "Operationally, we'd need to establish a legal entity, hire 15-20 local staff, and set up EU data infrastructure for GDPR compliance. Timeline estimate: 4-6 months prep before launch.",
      timestamp: new Date(Date.now() - 1600000),
    },
    {
      agent: 'cro',
      phase: 'initial',
      message:
        'The European market represents a $2.3B TAM for our segment. Our analysis shows 3 primary competitors with <40% market penetration. I project we could capture 5% market share within 18 months, translating to ~$8-12M ARR.',
      timestamp: new Date(Date.now() - 1500000),
    },
    {
      agent: 'risk',
      phase: 'initial',
      message:
        'Key risks include: currency fluctuation (EUR/USD), regulatory complexity across EU member states, and potential economic slowdown in the Eurozone. I recommend building in a 20% contingency buffer.',
      timestamp: new Date(Date.now() - 1400000),
    },
    {
      agent: 'cfo',
      phase: 'cross_examination',
      message:
        "CendiaRisk, given the 20% contingency you mentioned, what's the worst-case scenario for our cash position if revenue projections are 30% below target?",
      timestamp: new Date(Date.now() - 1200000),
    },
    {
      agent: 'risk',
      phase: 'cross_examination',
      message:
        "In a 30% revenue shortfall scenario with 20% contingency, we'd have 12 months runway remaining. This is below our 15-month threshold. I'd recommend either reducing initial investment or securing a line of credit.",
      timestamp: new Date(Date.now() - 1100000),
    },
    {
      agent: 'cro',
      phase: 'cross_examination',
      message:
        'I want to challenge the 30% shortfall assumption. Our pipeline data shows strong European demand - 45 qualified leads from EMEA in Q4 alone. A more realistic downside is 15%.',
      timestamp: new Date(Date.now() - 1000000),
    },
  ];

  const phases = [
    { id: 'initial', name: 'Initial Analysis', complete: true },
    { id: 'cross_examination', name: 'Cross-Examination', complete: false, active: true },
    { id: 'synthesis', name: 'Synthesis', complete: false },
    { id: 'ethics', name: 'Ethics Check', complete: false },
    { id: 'final', name: 'Final Recommendation', complete: false },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <button
            onClick={() => navigate('/cortex/council')}
            className="text-sm text-neutral-500 hover:text-primary-600 mb-2"
          >
            ← Back to Council
          </button>
          <h1 className="text-2xl font-bold text-neutral-900">Deliberation in Progress</h1>
        </div>
        <div className="flex items-center gap-4">
          {isLive && (
            <span className="flex items-center gap-2 px-3 py-1.5 bg-success-light text-success-dark rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-success-main rounded-full animate-pulse" />
              Live
            </span>
          )}
          <button
            onClick={() => setIsLive(!isLive)}
            className="px-4 py-2 border border-neutral-300 rounded-lg text-sm hover:bg-neutral-50"
          >
            {isLive ? 'Pause' : 'Resume'}
          </button>
        </div>
      </div>

      {/* Query Card */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 mb-6 text-white">
        <p className="text-sm text-white/70 mb-2">Query</p>
        <p className="text-xl font-medium">{deliberation.query}</p>
        <div className="flex items-center gap-4 mt-4">
          <div className="flex -space-x-2">
            {deliberation.participants.map((p) => (
              <div
                key={p}
                className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center"
                style={{ backgroundColor: agentInfo[p].color }}
                title={agentInfo[p].name}
              >
                <span className="text-sm">{agentInfo[p].icon}</span>
              </div>
            ))}
          </div>
          <span className="text-sm text-white/70">
            {deliberation.participants.length} agents participating
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Main Transcript */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <div className="p-4 border-b border-neutral-200">
            <h2 className="font-semibold text-neutral-900">Deliberation Transcript</h2>
          </div>
          <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
            {transcript.map((msg, i) => (
              <div key={i} className="flex gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: agentInfo[msg.agent].color }}
                >
                  <span className="text-lg">{agentInfo[msg.agent].icon}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-neutral-900">
                      {agentInfo[msg.agent].name}
                    </span>
                    <span className="px-2 py-0.5 bg-neutral-100 text-neutral-500 text-xs rounded capitalize">
                      {msg.phase.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-neutral-400">
                      {formatRelativeTime(msg.timestamp)}
                    </span>
                  </div>
                  <p className="text-neutral-700">{msg.message}</p>
                </div>
              </div>
            ))}

            {isLive && (
              <div className="flex gap-4 items-center text-neutral-400">
                <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center animate-pulse">
                  <span>💭</span>
                </div>
                <span className="text-sm">Agents are deliberating...</span>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Phase Progress */}
          <div className="bg-white rounded-xl border border-neutral-200 p-4">
            <h3 className="font-semibold text-neutral-900 mb-4">Deliberation Phases</h3>
            <div className="space-y-3">
              {phases.map((phase, i) => (
                <div key={phase.id} className="flex items-center gap-3">
                  <div
                    className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium',
                      phase.complete
                        ? 'bg-success-main text-white'
                        : phase.active
                          ? 'bg-primary-600 text-white'
                          : 'bg-neutral-200 text-neutral-500'
                    )}
                  >
                    {phase.complete ? '✓' : i + 1}
                  </div>
                  <span
                    className={cn(
                      'text-sm',
                      phase.active ? 'font-medium text-neutral-900' : 'text-neutral-500'
                    )}
                  >
                    {phase.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl border border-neutral-200 p-4">
            <h3 className="font-semibold text-neutral-900 mb-4">Actions</h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 rounded-lg">
                📤 Export Transcript
              </button>
              <button className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 rounded-lg">
                🔔 Set Alert
              </button>
              <button className="w-full px-4 py-2 text-left text-sm text-error-main hover:bg-error-light rounded-lg">
                ⏹️ Cancel Deliberation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// AGENT PROFILE PAGE
// =============================================================================

export const AgentProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { agentId } = useParams();

  const agents: Record<string, any> = {
    chief: {
      id: 'chief',
      name: 'CendiaChief',
      title: 'Chief of Staff',
      icon: '👔',
      color: '#6366F1',
      status: 'online',
      description:
        'The orchestrator and coordinator of all agent activities. Synthesizes insights from specialized agents and provides executive-level recommendations.',
      capabilities: [
        'Multi-agent coordination',
        'Executive summary generation',
        'Strategic recommendation synthesis',
        'Cross-functional analysis',
        'Decision facilitation',
      ],
      stats: {
        deliberationsLed: 234,
        avgConfidence: 87,
        avgResponseTime: '4.2s',
        satisfactionScore: 92,
      },
      recentActivity: [
        {
          action: 'Completed deliberation on Q1 budget allocation',
          time: new Date(Date.now() - 3600000),
        },
        { action: 'Synthesized European expansion analysis', time: new Date(Date.now() - 7200000) },
        { action: 'Coordinated security audit review', time: new Date(Date.now() - 86400000) },
      ],
    },
    cfo: {
      id: 'cfo',
      name: 'CendiaCFO',
      title: 'Chief Financial Officer',
      icon: '💰',
      color: '#10B981',
      status: 'online',
      description:
        'Financial intelligence agent specializing in budgeting, forecasting, cash flow analysis, and financial strategy.',
      capabilities: [
        'Financial modeling',
        'Cash flow forecasting',
        'Budget analysis',
        'Investment evaluation',
        'Risk-adjusted returns',
      ],
      stats: {
        analysisCompleted: 456,
        avgConfidence: 91,
        avgResponseTime: '3.8s',
        satisfactionScore: 94,
      },
      recentActivity: [
        { action: 'Analyzed Q4 revenue projections', time: new Date(Date.now() - 1800000) },
        { action: 'Reviewed vendor contract terms', time: new Date(Date.now() - 3600000) },
        { action: 'Generated cash flow forecast', time: new Date(Date.now() - 7200000) },
      ],
    },
  };

  const agent = agents[agentId || 'chief'] || agents.chief;

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <button
        onClick={() => navigate('/cortex/council')}
        className="text-sm text-neutral-500 hover:text-primary-600 mb-4"
      >
        ← Back to Council
      </button>

      {/* Agent Card */}
      <div className="bg-white rounded-xl border border-neutral-200 p-8 mb-6">
        <div className="flex items-start gap-6">
          <div
            className="w-24 h-24 rounded-2xl flex items-center justify-center text-5xl"
            style={{ backgroundColor: agent.color + '20' }}
          >
            {agent.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-neutral-900">{agent.name}</h1>
              <span
                className={cn(
                  'flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium',
                  agent.status === 'online'
                    ? 'bg-success-light text-success-dark'
                    : 'bg-neutral-100 text-neutral-500'
                )}
              >
                <span
                  className={cn(
                    'w-2 h-2 rounded-full',
                    agent.status === 'online' ? 'bg-success-main' : 'bg-neutral-400'
                  )}
                />
                {agent.status}
              </span>
            </div>
            <p className="text-lg text-neutral-500 mb-4">{agent.title}</p>
            <p className="text-neutral-600">{agent.description}</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Stats */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <h2 className="font-semibold text-neutral-900 mb-4">Performance Stats</h2>
          <div className="space-y-4">
            {Object.entries(agent.stats).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm text-neutral-500 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span className="font-semibold text-neutral-900">
                  {String(value)}
                  {key.includes('Confidence') || key.includes('Score') ? '%' : ''}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Capabilities */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <h2 className="font-semibold text-neutral-900 mb-4">Capabilities</h2>
          <ul className="space-y-2">
            {agent.capabilities.map((cap: string) => (
              <li key={cap} className="flex items-center gap-2 text-sm text-neutral-600">
                <span className="text-success-main">✓</span>
                {cap}
              </li>
            ))}
          </ul>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <h2 className="font-semibold text-neutral-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {agent.recentActivity.map((activity: any, i: number) => (
              <div key={i} className="border-l-2 border-neutral-200 pl-4">
                <p className="text-sm text-neutral-900">{activity.action}</p>
                <p className="text-xs text-neutral-400 mt-1">{formatRelativeTime(activity.time)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ask This Agent */}
      <div className="mt-6 bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Ask {agent.name}</h2>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder={`Ask ${agent.name} a question...`}
            className="flex-1 h-12 px-4 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
          />
          <button className="px-6 h-12 bg-white text-primary-600 font-medium rounded-lg hover:bg-white/90 transition-colors">
            Ask
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliberationViewPage;
