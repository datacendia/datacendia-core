// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIA SHOWCASE DASHBOARD
// =============================================================================
// A comprehensive dashboard component that displays showcase data across all
// verticals and services. Used for demos, marketing, and investor presentations.
// =============================================================================

import React, { useState } from 'react';
import {
  Vertical,
  COMPANY_PROFILES,
  DECISIONS,
  EXECUTIVES,
  METRICS,
  REGULATORY_FRAMEWORKS,
  TIME_SCENARIOS,
  DECISION_DEBT,
  AI_AGENTS,
  BOARD_AVATARS,
  FAILURE_MODES,
  getDecisionsByVertical,
  getMetricsByVertical,
  getRegulatoryFrameworksByVertical,
  getDecisionDebtByVertical,
  calculateTotalDecisionDebt,
  formatCurrency,
  getRiskColor,
  getStatusColor,
  getDaysUntil,
} from '../../data/showcaseData';

// =============================================================================
// TYPES
// =============================================================================

interface ShowcaseDashboardProps {
  initialVertical?: Vertical;
  showVerticalSelector?: boolean;
}

// =============================================================================
// VERTICAL CONFIG
// =============================================================================

const VERTICAL_CONFIG: Record<Vertical, { label: string; icon: string; color: string }> = {
  healthcare: { label: 'Healthcare & Life Sciences', icon: '🏥', color: 'from-emerald-600 to-teal-600' },
  defense: { label: 'Defense & Government', icon: '🛡️', color: 'from-slate-600 to-zinc-600' },
  financial: { label: 'Financial Services', icon: '🏦', color: 'from-blue-600 to-indigo-600' },
  general: { label: 'Enterprise', icon: '🏢', color: 'from-purple-600 to-pink-600' },
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const ShowcaseDashboard: React.FC<ShowcaseDashboardProps> = ({
  initialVertical = 'healthcare',
  showVerticalSelector = true,
}) => {
  const [selectedVertical, setSelectedVertical] = useState<Vertical>(initialVertical);
  const [activeSection, setActiveSection] = useState<'overview' | 'decisions' | 'compliance' | 'debt' | 'council'>('overview');

  const company = COMPANY_PROFILES[selectedVertical];
  const decisions = getDecisionsByVertical(selectedVertical);
  const metrics = getMetricsByVertical(selectedVertical);
  const regulations = getRegulatoryFrameworksByVertical(selectedVertical);
  const decisionDebt = getDecisionDebtByVertical(selectedVertical);
  const totalDebt = calculateTotalDecisionDebt(selectedVertical);
  const executives = EXECUTIVES[selectedVertical];
  const timeScenarios = TIME_SCENARIOS[selectedVertical];

  const criticalDecisions = decisions.filter(d => d.risk === 'critical' || d.urgency === 'immediate');
  const avgComplianceScore = Math.round(regulations.reduce((sum, r) => sum + r.complianceScore, 0) / regulations.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-zinc-950 to-neutral-950 text-white p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        {/* Vertical Selector */}
        {showVerticalSelector && (
          <div className="mb-6">
            <div className="flex gap-2">
              {(Object.keys(VERTICAL_CONFIG) as Vertical[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setSelectedVertical(v)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedVertical === v
                      ? `bg-gradient-to-r ${VERTICAL_CONFIG[v].color} text-white`
                      : 'bg-zinc-800/50 text-white/60 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  {VERTICAL_CONFIG[v].icon} {VERTICAL_CONFIG[v].label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Company Header */}
        <div className={`bg-gradient-to-r ${VERTICAL_CONFIG[selectedVertical].color} rounded-2xl p-6 mb-6`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-4xl mb-2">{VERTICAL_CONFIG[selectedVertical].icon}</div>
              <h1 className="text-3xl font-bold">{company.name}</h1>
              <p className="text-white/80">{company.industry}</p>
            </div>
            <div className="grid grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold">{company.employees.toLocaleString()}</div>
                <div className="text-sm text-white/70">Employees</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{company.revenue}</div>
                <div className="text-sm text-white/70">Revenue</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{company.headquarters}</div>
                <div className="text-sm text-white/70">HQ</div>
              </div>
            </div>
          </div>
        </div>

        {/* Section Navigation */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'decisions', label: 'Active Decisions', icon: '⚖️' },
            { id: 'compliance', label: 'Compliance', icon: '🛡️' },
            { id: 'debt', label: 'Decision Debt', icon: '💸' },
            { id: 'council', label: 'AI Council', icon: '🤖' },
          ].map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id as typeof activeSection)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeSection === section.id
                  ? 'bg-white/10 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {section.icon} {section.label}
            </button>
          ))}
        </div>

        {/* Overview Section */}
        {activeSection === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-black/30 rounded-xl p-4 border border-zinc-800/50">
                <div className="text-3xl font-bold text-red-400">{criticalDecisions.length}</div>
                <div className="text-sm text-white/60">Critical Decisions</div>
              </div>
              <div className="bg-black/30 rounded-xl p-4 border border-zinc-800/50">
                <div className="text-3xl font-bold text-amber-400">{formatCurrency(totalDebt)}</div>
                <div className="text-sm text-white/60">Decision Debt</div>
              </div>
              <div className="bg-black/30 rounded-xl p-4 border border-zinc-800/50">
                <div className="text-3xl font-bold text-green-400">{avgComplianceScore}%</div>
                <div className="text-sm text-white/60">Avg Compliance</div>
              </div>
              <div className="bg-black/30 rounded-xl p-4 border border-zinc-800/50">
                <div className="text-3xl font-bold text-blue-400">{decisions.length}</div>
                <div className="text-sm text-white/60">Active Decisions</div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="bg-black/30 rounded-2xl p-6 border border-zinc-800/50">
              <h2 className="text-lg font-semibold mb-4">Key Performance Indicators</h2>
              <div className="grid grid-cols-3 gap-4">
                {metrics.map((metric) => (
                  <div key={metric.id} className="p-4 bg-black/20 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-white/60">{metric.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        metric.trend === 'up' ? 'bg-green-600/30 text-green-400' :
                        metric.trend === 'down' ? 'bg-red-600/30 text-red-400' :
                        'bg-zinc-600/30 text-zinc-400'
                      }`}>
                        {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→'} {Math.abs(metric.trendValue)}{metric.unit === '%' ? 'pp' : ''}
                      </span>
                    </div>
                    <div className="text-2xl font-bold">
                      {metric.value}{metric.unit}
                    </div>
                    {metric.target && (
                      <div className="text-xs text-white/40 mt-1">Target: {metric.target}{metric.unit}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Executive Team */}
            <div className="bg-black/30 rounded-2xl p-6 border border-zinc-800/50">
              <h2 className="text-lg font-semibold mb-4">Executive Team</h2>
              <div className="grid grid-cols-6 gap-4">
                {executives.map((exec) => (
                  <div key={exec.id} className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-zinc-600 to-zinc-700 mx-auto mb-2 flex items-center justify-center text-lg">
                      {exec.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="font-medium text-sm">{exec.name}</div>
                    <div className="text-xs text-white/50">{exec.title}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Time Scenarios */}
            <div className="bg-black/30 rounded-2xl p-6 border border-zinc-800/50">
              <h2 className="text-lg font-semibold mb-4">⏱️ Chronos Scenarios</h2>
              <div className="grid grid-cols-3 gap-4">
                {timeScenarios.map((scenario) => (
                  <div key={scenario.id} className={`p-4 rounded-xl border ${
                    scenario.type === 'replay' ? 'bg-blue-900/20 border-blue-700/50' :
                    scenario.type === 'simulation' ? 'bg-amber-900/20 border-amber-700/50' :
                    'bg-purple-900/20 border-purple-700/50'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        scenario.type === 'replay' ? 'bg-blue-600' :
                        scenario.type === 'simulation' ? 'bg-amber-600' :
                        'bg-purple-600'
                      }`}>
                        {scenario.type.toUpperCase()}
                      </span>
                      <span className="text-xs text-white/50">{scenario.timeframe}</span>
                    </div>
                    <h4 className="font-semibold mb-1">{scenario.name}</h4>
                    <p className="text-sm text-white/60 mb-2">{scenario.description}</p>
                    <div className="text-xs text-green-400">{scenario.impact}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Decisions Section */}
        {activeSection === 'decisions' && (
          <div className="space-y-4">
            <div className="bg-black/30 rounded-2xl p-6 border border-zinc-800/50">
              <h2 className="text-lg font-semibold mb-4">Active Decision Pipeline</h2>
              <div className="space-y-4">
                {decisions.map((decision) => (
                  <div key={decision.id} className="p-4 bg-black/20 rounded-xl border border-zinc-800/30">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{decision.title}</h3>
                          <span className={`px-2 py-0.5 rounded text-xs ${getRiskColor(decision.risk)}`}>
                            {decision.risk.toUpperCase()}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(decision.status)}`}>
                            {decision.status.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-sm text-white/60">{decision.description}</p>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-lg font-bold text-amber-400">{decision.financialImpact}</div>
                        <div className="text-xs text-white/50">
                          {getDaysUntil(decision.deadline)} days to deadline
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-white/50">Stakeholders:</span>
                        {decision.stakeholders.map((s, i) => (
                          <span key={i} className="text-xs px-2 py-0.5 bg-zinc-800 rounded">{s}</span>
                        ))}
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-white/50">
                          AI Confidence: <span className="text-white">{(decision.aiConfidence * 100).toFixed(0)}%</span>
                        </span>
                        {decision.dissent && (
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            decision.dissent.severity === 'critical' ? 'bg-red-600' :
                            decision.dissent.severity === 'significant' ? 'bg-amber-600' :
                            'bg-zinc-600'
                          }`}>
                            {decision.dissent.count} dissent{decision.dissent.count > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Compliance Section */}
        {activeSection === 'compliance' && (
          <div className="space-y-6">
            <div className="bg-black/30 rounded-2xl p-6 border border-zinc-800/50">
              <h2 className="text-lg font-semibold mb-4">Regulatory Compliance Dashboard</h2>
              <div className="grid grid-cols-2 gap-4">
                {regulations.map((reg) => (
                  <div key={reg.id} className="p-4 bg-black/20 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{reg.shortName}</h4>
                        <p className="text-xs text-white/50">{reg.name}</p>
                      </div>
                      <div className={`text-2xl font-bold ${
                        reg.complianceScore >= 95 ? 'text-green-400' :
                        reg.complianceScore >= 85 ? 'text-amber-400' :
                        'text-red-400'
                      }`}>
                        {reg.complianceScore}%
                      </div>
                    </div>
                    <div className="h-2 bg-black/30 rounded-full overflow-hidden mb-3">
                      <div
                        className={`h-full ${
                          reg.complianceScore >= 95 ? 'bg-green-500' :
                          reg.complianceScore >= 85 ? 'bg-amber-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${reg.complianceScore}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-white/50">
                      <span>Jurisdiction: {reg.jurisdiction}</span>
                      <span>Open Findings: {reg.openFindings} ({reg.criticalFindings} critical)</span>
                    </div>
                    <div className="flex justify-between text-xs text-white/40 mt-1">
                      <span>Last Audit: {reg.lastAudit.toLocaleDateString()}</span>
                      <span>Next Audit: {reg.nextAudit.toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Decision Debt Section */}
        {activeSection === 'debt' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-red-900/30 to-amber-900/30 rounded-2xl p-6 border border-red-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Total Decision Debt</h2>
                  <p className="text-white/60">Cost of delayed decisions accumulating daily</p>
                </div>
                <div className="text-4xl font-bold text-red-400">{formatCurrency(totalDebt)}</div>
              </div>
            </div>

            <div className="bg-black/30 rounded-2xl p-6 border border-zinc-800/50">
              <h2 className="text-lg font-semibold mb-4">Stuck Decisions</h2>
              <div className="space-y-4">
                {decisionDebt.map((debt) => (
                  <div key={debt.id} className="p-4 bg-black/20 rounded-xl border border-red-800/30">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{debt.title}</h4>
                        <p className="text-sm text-white/50">Owner: {debt.owner} • {debt.category}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-red-400">{formatCurrency(debt.totalCost)}</div>
                        <div className="text-xs text-white/50">{formatCurrency(debt.dailyCost)}/day</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-white/50">Blockers:</span>
                        {debt.blockers.map((b, i) => (
                          <span key={i} className="text-xs px-2 py-0.5 bg-red-900/30 rounded text-red-300">{b}</span>
                        ))}
                      </div>
                      <span className="text-sm font-bold text-amber-400">{debt.daysStuck} days stuck</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AI Council Section */}
        {activeSection === 'council' && (
          <div className="space-y-6">
            <div className="bg-black/30 rounded-2xl p-6 border border-zinc-800/50">
              <h2 className="text-lg font-semibold mb-4">🤖 AI Council Agents</h2>
              <div className="grid grid-cols-4 gap-4">
                {AI_AGENTS.filter(a => !a.vertical || a.vertical === selectedVertical).map((agent) => (
                  <div key={agent.id} className="p-4 bg-black/20 rounded-xl">
                    <div className="text-3xl mb-2">{agent.avatar}</div>
                    <h4 className="font-semibold">{agent.name}</h4>
                    <p className="text-xs text-white/50 mb-2">{agent.role}</p>
                    <p className="text-sm text-white/70 mb-2">{agent.specialty}</p>
                    {agent.bias && (
                      <span className="text-xs px-2 py-0.5 bg-purple-600/30 rounded text-purple-300">
                        Bias: {agent.bias}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-black/30 rounded-2xl p-6 border border-zinc-800/50">
              <h2 className="text-lg font-semibold mb-4">👻 Ghost Board Avatars</h2>
              <div className="grid grid-cols-3 gap-4">
                {BOARD_AVATARS.map((avatar) => (
                  <div key={avatar.id} className="p-4 bg-black/20 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="text-3xl">{avatar.avatar}</div>
                      <div>
                        <h4 className="font-semibold">{avatar.name}</h4>
                        <p className="text-xs text-white/50">{avatar.personality}</p>
                      </div>
                    </div>
                    <p className="text-sm text-white/60 mb-2">{avatar.background}</p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {avatar.expertise.map((e, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 bg-zinc-800 rounded">{e}</span>
                      ))}
                    </div>
                    <p className="text-xs text-amber-400">"{avatar.challengeStyle}"</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-black/30 rounded-2xl p-6 border border-zinc-800/50">
              <h2 className="text-lg font-semibold mb-4">💀 Pre-Mortem Failure Modes</h2>
              <div className="grid grid-cols-2 gap-4">
                {FAILURE_MODES.map((fm) => (
                  <div key={fm.id} className={`p-4 rounded-xl border ${
                    fm.impact === 'critical' ? 'bg-red-900/20 border-red-700/50' :
                    fm.impact === 'high' ? 'bg-amber-900/20 border-amber-700/50' :
                    'bg-yellow-900/20 border-yellow-700/50'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs px-2 py-0.5 bg-zinc-800 rounded">{fm.category}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${getRiskColor(fm.impact)}`}>
                        {(fm.probability * 100).toFixed(0)}% probability
                      </span>
                    </div>
                    <p className="text-sm font-medium mb-2">{fm.description}</p>
                    <div className="text-xs text-white/50 mb-1">Mitigations:</div>
                    <div className="flex flex-wrap gap-1">
                      {fm.mitigations.map((m, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 bg-green-900/30 rounded text-green-300">{m}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowcaseDashboard;
