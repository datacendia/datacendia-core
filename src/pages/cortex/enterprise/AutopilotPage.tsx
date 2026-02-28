// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIA AUTOPILOT™ - SELF-DRIVING ENTERPRISE MODE
// The System Proposes Decisions Automatically, Humans Approve
// "AI-Run Enterprise Territory"
//
// CAPABILITIES:
// - Autonomous decision recommendation engine
// - Human-in-the-loop approval workflows
// - Real-time business condition monitoring
// - Automatic budget adjustments
// - Resource reallocation suggestions
// - Predictive intervention system
// - Escalation-only human involvement
// =============================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  enterpriseService,
  AutoDecision,
  AutomationRule,
  SystemHealth,
  DecisionCategory,
} from '../../../services/EnterpriseService';
import { ollamaService } from '../../../lib/ollama';
import api from '../../../lib/api';
import { deterministicFloat, deterministicInt } from '../../../lib/deterministic';

// Types imported from EnterpriseService

// =============================================================================
// MOCK DATA
// =============================================================================

const CATEGORY_CONFIG: Record<DecisionCategory, { icon: string; color: string; name: string }> = {
  financial: { icon: '💰', color: 'from-green-600 to-emerald-600', name: 'Financial' },
  operational: { icon: '⚙️', color: 'from-blue-600 to-cyan-600', name: 'Operations' },
  hr: { icon: '👥', color: 'from-purple-600 to-pink-600', name: 'Human Resources' },
  sales: { icon: '📈', color: 'from-amber-600 to-orange-600', name: 'Sales & Revenue' },
  technology: { icon: '💻', color: 'from-indigo-600 to-violet-600', name: 'Technology' },
  risk: { icon: '⚠️', color: 'from-red-600 to-rose-600', name: 'Risk Management' },
  compliance: { icon: '⚖️', color: 'from-teal-600 to-cyan-600', name: 'Compliance' },
};

const generateDecisions = (): AutoDecision[] => [
  {
    id: 'dec-001',
    title: 'Q4 Budget Reallocation',
    description:
      'Revenue is trending 3.2% below forecast. Recommend adjusting Q4 budgets by 2% across non-critical teams to maintain margin targets.',
    category: 'financial',
    priority: 'high',
    status: 'pending',
    automationLevel: 'approval-required',
    trigger: {
      condition: 'Revenue below forecast threshold',
      metric: 'quarterly_revenue',
      threshold: -3,
      currentValue: -3.2,
    },
    recommendation:
      'Reduce discretionary spending by 2% ($450K) across Marketing, R&D, and G&A to protect EBITDA margin',
    impact: [
      { metric: 'EBITDA Margin', projectedChange: 0.8, unit: '%', confidence: 92 },
      { metric: 'Cash Runway', projectedChange: 2.1, unit: 'months', confidence: 88 },
      { metric: 'Team Morale', projectedChange: -5, unit: '%', confidence: 65 },
    ],
    risks: [
      {
        description: 'Delayed product launches',
        probability: 25,
        mitigation: 'Prioritize critical path items',
      },
      {
        description: 'Reduced marketing reach',
        probability: 40,
        mitigation: 'Focus on high-ROI channels',
      },
    ],
    alternatives: [
      { description: 'Accelerate collections on A/R', impact: 'Recover $200K within 30 days' },
      { description: 'Defer Q4 hiring', impact: 'Save $180K, delay 3 hires' },
    ],
    aiReasoning:
      'Historical analysis shows similar revenue shortfalls in 2022 and 2023 were addressed with 2-3% budget cuts, resulting in successful margin protection without significant operational impact. Current market conditions suggest conservative approach is prudent.',
    supportingData: [
      { source: 'SAP', value: 'YTD Revenue: $38.2M (vs $39.4M plan)' },
      { source: 'Workday', value: 'Headcount: 156 (vs 160 plan)' },
      { source: 'Salesforce', value: 'Pipeline: $45M (vs $52M plan)' },
    ],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  },
  {
    id: 'dec-002',
    title: 'Cloud Cost Optimization',
    description:
      'Cloud infrastructure costs have increased 18% MoM. Analysis indicates 8% of workloads can be moved back on-premises for 34% cost reduction.',
    category: 'technology',
    priority: 'medium',
    status: 'pending',
    automationLevel: 'approval-required',
    trigger: {
      condition: 'Cloud costs exceed threshold',
      metric: 'monthly_cloud_spend',
      threshold: 15,
      currentValue: 18,
    },
    recommendation: 'Migrate 8% of non-critical workloads to on-premises infrastructure',
    impact: [
      { metric: 'Monthly Cloud Spend', projectedChange: -34, unit: '%', confidence: 85 },
      { metric: 'Annual Savings', projectedChange: 180, unit: 'K USD', confidence: 85 },
      { metric: 'Latency', projectedChange: 5, unit: 'ms', confidence: 70 },
    ],
    risks: [
      {
        description: 'Migration complexity',
        probability: 30,
        mitigation: 'Phased migration over 6 weeks',
      },
      {
        description: 'Capacity constraints',
        probability: 20,
        mitigation: 'Pre-provision on-prem capacity',
      },
    ],
    alternatives: [
      { description: 'Reserved instance commitments', impact: 'Save 25% on compute' },
      { description: 'Rightsizing instances', impact: 'Save 15% through optimization' },
    ],
    aiReasoning:
      "Workload analysis shows batch processing and dev/test environments are ideal candidates for on-prem migration. These workloads have consistent, predictable resource requirements and don't benefit from cloud elasticity.",
    supportingData: [
      { source: 'AWS Cost Explorer', value: 'Monthly spend: $245K (+18% MoM)' },
      { source: 'Datadog', value: 'Avg utilization: 42%' },
      { source: 'Internal', value: 'On-prem capacity available: 340 cores' },
    ],
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000),
  },
  {
    id: 'dec-003',
    title: 'Sales Team Retraining Initiative',
    description:
      'Sales conversion rate has dropped 12% this quarter. Data suggests skill gaps in enterprise selling. Recommend targeted training program.',
    category: 'sales',
    priority: 'high',
    status: 'auto-executed',
    automationLevel: 'full-auto',
    trigger: {
      condition: 'Conversion rate below threshold',
      metric: 'sales_conversion_rate',
      threshold: -10,
      currentValue: -12,
    },
    recommendation: 'Enroll underperforming reps in Enterprise Sales Accelerator program',
    impact: [
      { metric: 'Conversion Rate', projectedChange: 8, unit: '%', confidence: 78 },
      { metric: 'Average Deal Size', projectedChange: 15, unit: '%', confidence: 72 },
      { metric: 'Quota Attainment', projectedChange: 12, unit: '%', confidence: 75 },
    ],
    risks: [
      {
        description: 'Rep availability during training',
        probability: 60,
        mitigation: 'Schedule during low-activity periods',
      },
    ],
    alternatives: [
      { description: 'External sales coaching', impact: 'Higher cost, faster results' },
    ],
    aiReasoning:
      'Pattern recognition identified that reps who completed this training in 2023 showed 23% improvement in enterprise deal closure. Current cohort matches the profile of successful candidates.',
    supportingData: [
      { source: 'Salesforce', value: 'Conversion: 18% (vs 20.5% benchmark)' },
      { source: 'Gong', value: 'Talk ratio: 68% (ideal: 45%)' },
      { source: 'LMS', value: '8 reps below certification threshold' },
    ],
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
    executedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
  },
  {
    id: 'dec-004',
    title: 'Retention Risk Intervention',
    description:
      'AI detected 4 high-performers in Engineering showing turnover risk signals. Recommend immediate retention actions.',
    category: 'hr',
    priority: 'critical',
    status: 'pending',
    automationLevel: 'approval-required',
    trigger: {
      condition: 'High-performer turnover risk detected',
      metric: 'retention_risk_score',
      threshold: 75,
      currentValue: 82,
    },
    recommendation:
      'Initiate retention conversations with identified engineers, prepare competitive counter-offers',
    impact: [
      { metric: 'Retention Rate', projectedChange: 15, unit: '%', confidence: 70 },
      { metric: 'Replacement Cost Avoided', projectedChange: 480, unit: 'K USD', confidence: 85 },
      { metric: 'Project Continuity', projectedChange: 100, unit: '%', confidence: 90 },
    ],
    risks: [
      {
        description: 'Salary compression with peers',
        probability: 45,
        mitigation: 'Use equity/bonus instead',
      },
      {
        description: 'Others may expect similar treatment',
        probability: 35,
        mitigation: 'Position as recognition program',
      },
    ],
    alternatives: [
      {
        description: 'Enhanced career development track',
        impact: 'Lower cost, longer-term impact',
      },
      {
        description: 'Project reassignment to high-visibility work',
        impact: 'No cost, moderate effectiveness',
      },
    ],
    aiReasoning:
      'Behavioral signals detected: reduced code commits (-40%), calendar availability (-60%), LinkedIn activity (+300%), sentiment in Slack (-25%). Historical pattern matches 87% of engineers who departed within 60 days.',
    supportingData: [
      { source: 'GitHub', value: 'Commit frequency: -40% vs 90-day avg' },
      { source: 'Calendar', value: 'Meeting declines: +60%' },
      { source: 'Slack', value: 'Engagement score: 45 (avg: 72)' },
    ],
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
  },
  {
    id: 'dec-005',
    title: 'Vendor Contract Renegotiation',
    description:
      'Annual renewal approaching for top SaaS vendor. Market analysis suggests 22% savings opportunity through renegotiation.',
    category: 'operational',
    priority: 'medium',
    status: 'approved',
    automationLevel: 'semi-auto',
    trigger: {
      condition: 'Contract renewal within 60 days',
      metric: 'contract_renewal_date',
      threshold: 60,
      currentValue: 45,
    },
    recommendation: 'Initiate renegotiation with benchmark data showing 22% below market rate',
    impact: [
      { metric: 'Annual Spend', projectedChange: -22, unit: '%', confidence: 75 },
      { metric: 'Savings', projectedChange: 85, unit: 'K USD', confidence: 75 },
    ],
    risks: [
      {
        description: 'Vendor pushback',
        probability: 50,
        mitigation: 'Have alternative vendor ready',
      },
    ],
    alternatives: [
      { description: 'Switch to competitor', impact: '$110K savings, 3-month migration' },
    ],
    aiReasoning:
      'CendiaMesh benchmark data shows similar-sized companies paying 22% less. Vendor recently lost two enterprise accounts and may be motivated to retain business.',
    supportingData: [
      { source: 'Contract DB', value: 'Current: $385K/year' },
      { source: 'CendiaMesh', value: 'Benchmark: $300K for comparable usage' },
    ],
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    approvedBy: 'CFO',
    approvedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
];

const generateAutomationRules = (): AutomationRule[] => [
  {
    id: 'rule-001',
    name: 'Budget Variance Alert',
    description: 'Trigger budget adjustment recommendations when actual spend exceeds plan by >5%',
    category: 'financial',
    enabled: true,
    automationLevel: 'approval-required',
    triggers: [{ metric: 'budget_variance', operator: 'gt', value: 5 }],
    actions: [
      'Generate budget reallocation recommendation',
      'Alert CFO',
      'Prepare impact analysis',
    ],
    lastTriggered: new Date(Date.now() - 2 * 60 * 60 * 1000),
    triggerCount: 12,
  },
  {
    id: 'rule-002',
    name: 'High-Performer Retention',
    description:
      'Automatically flag and recommend retention actions for high-performers showing risk signals',
    category: 'hr',
    enabled: true,
    automationLevel: 'approval-required',
    triggers: [{ metric: 'retention_risk_score', operator: 'gt', value: 70 }],
    actions: ['Alert CHRO', 'Prepare retention package options', 'Schedule manager check-in'],
    lastTriggered: new Date(Date.now() - 4 * 60 * 60 * 1000),
    triggerCount: 8,
  },
  {
    id: 'rule-003',
    name: 'Sales Training Enrollment',
    description: 'Auto-enroll underperforming reps in training when conversion drops',
    category: 'sales',
    enabled: true,
    automationLevel: 'full-auto',
    triggers: [{ metric: 'sales_conversion_rate', operator: 'lt', value: -10 }],
    actions: [
      'Enroll in training program',
      'Notify sales manager',
      'Schedule follow-up assessment',
    ],
    lastTriggered: new Date(Date.now() - 24 * 60 * 60 * 1000),
    triggerCount: 23,
  },
  {
    id: 'rule-004',
    name: 'Cloud Cost Optimization',
    description: 'Recommend workload optimization when cloud costs increase >15% MoM',
    category: 'technology',
    enabled: true,
    automationLevel: 'approval-required',
    triggers: [{ metric: 'cloud_cost_mom', operator: 'gt', value: 15 }],
    actions: ['Generate optimization report', 'Identify migration candidates', 'Alert CIO'],
    lastTriggered: new Date(Date.now() - 8 * 60 * 60 * 1000),
    triggerCount: 5,
  },
  {
    id: 'rule-005',
    name: 'Security Incident Response',
    description: 'Auto-initiate incident response for critical security events',
    category: 'risk',
    enabled: true,
    automationLevel: 'full-auto',
    triggers: [{ metric: 'security_threat_level', operator: 'eq', value: 5 }],
    actions: ['Activate incident response', 'Isolate affected systems', 'Alert CISO and exec team'],
    triggerCount: 2,
  },
];

const calculateSystemHealth = (decisions: AutoDecision[]): SystemHealth => {
  const categories: SystemHealth['categories'] = (
    Object.keys(CATEGORY_CONFIG) as DecisionCategory[]
  ).map((cat) => ({
    category: cat,
    score: 70 + deterministicFloat('autopilot-2') * 25,
    trend: ['up', 'down', 'stable'][deterministicInt(0, 2, 'autopilot-1')] as 'up' | 'down' | 'stable',
    activeDecisions: decisions.filter((d) => d.category === cat && d.status === 'pending').length,
  }));

  return {
    overallScore: Math.round(categories.reduce((sum, c) => sum + c.score, 0) / categories.length),
    categories,
    pendingDecisions: decisions.filter((d) => d.status === 'pending').length,
    autoExecutedToday: decisions.filter((d) => d.status === 'auto-executed').length,
    humanApprovedToday: decisions.filter((d) => d.status === 'approved').length,
    escalatedToday: decisions.filter((d) => d.status === 'escalated').length,
  };
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const AutopilotPage: React.FC = () => {
  const navigate = useNavigate();
  const [decisions, setDecisions] = useState<AutoDecision[]>([]);
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'decisions' | 'rules' | 'history'>(
    'dashboard'
  );
  const [selectedDecision, setSelectedDecision] = useState<AutoDecision | null>(null);
  const [autopilotEnabled, setAutopilotEnabled] = useState(true);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [ollamaStatus, setOllamaStatus] = useState({ available: false });

  // Load data from Enterprise Service & API
  const loadData = useCallback(async () => {
    // First try to load from API
    try {
      const [rulesRes, executionsRes] = await Promise.all([
        api.autopilot.getRules(),
        api.autopilot.getExecutions(),
      ]);

      if (rulesRes.success && rulesRes.data) {
        console.log('[Autopilot] Loaded', rulesRes.data.length, 'rules from database');
      }
      if (executionsRes.success && executionsRes.data) {
        console.log('[Autopilot] Loaded', executionsRes.data.length, 'executions from database');
      }
    } catch (error) {
      console.log('[Autopilot] API unavailable, using local service');
    }

    // Fall back to enterprise service
    setDecisions(enterpriseService.getAutoDecisions());
    setSystemHealth(enterpriseService.getSystemHealth());
    setOllamaStatus(ollamaService.getStatus());
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, [loadData]);

  const pendingDecisions = decisions.filter((d) => d.status === 'pending');
  const criticalPending = pendingDecisions.filter((d) => d.priority === 'critical');

  const handleApprove = (decisionId: string) => {
    enterpriseService.approveAutoDecision(decisionId, 'Current User');
    loadData();
    setSelectedDecision(null);
  };

  const handleReject = (decisionId: string) => {
    enterpriseService.rejectAutoDecision(decisionId);
    loadData();
    setSelectedDecision(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-950 via-orange-950 to-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-amber-800/50 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/cortex/dashboard')}
                className="text-white/60 hover:text-white transition-colors"
              >
                ← Back
              </button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-3">
                  <span className="text-3xl">🚀</span>
                  CendiaAutopilot™
                  <span className="text-xs bg-gradient-to-r from-amber-500 to-orange-500 px-2 py-0.5 rounded-full font-medium">
                    AUTONOMOUS
                  </span>
                </h1>
                <p className="text-amber-300 text-sm">
                  Self-Driving Enterprise Mode • AI Proposes, Humans Approve
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {/* Autopilot Toggle */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-white/60">Autopilot</span>
                <button
                  onClick={() => setAutopilotEnabled(!autopilotEnabled)}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    autopilotEnabled ? 'bg-green-600' : 'bg-neutral-700'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${
                      autopilotEnabled ? 'translate-x-8' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span
                  className={`text-sm font-medium ${autopilotEnabled ? 'text-green-400' : 'text-neutral-400'}`}
                >
                  {autopilotEnabled ? 'Active' : 'Paused'}
                </span>
              </div>

              {criticalPending.length > 0 && (
                <div className="px-4 py-2 bg-red-600 rounded-lg animate-pulse">
                  <div className="text-sm font-bold">{criticalPending.length} Critical</div>
                  <div className="text-xs">Awaiting Approval</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* System Health Bar */}
      <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 border-b border-amber-800/30">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="grid grid-cols-6 gap-4 text-center">
            <div>
              <div
                className={`text-3xl font-bold ${
                  (systemHealth?.overallScore ?? 0) >= 80
                    ? 'text-green-400'
                    : (systemHealth?.overallScore ?? 0) >= 60
                      ? 'text-amber-400'
                      : 'text-red-400'
                }`}
              >
                {systemHealth?.overallScore ?? 0}%
              </div>
              <div className="text-xs text-amber-300">System Health</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-amber-400">
                {systemHealth?.pendingDecisions ?? 0}
              </div>
              <div className="text-xs text-amber-300">Pending Decisions</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400">
                {systemHealth?.autoExecutedToday ?? 0}
              </div>
              <div className="text-xs text-amber-300">Auto-Executed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-400">
                {systemHealth?.humanApprovedToday ?? 0}
              </div>
              <div className="text-xs text-amber-300">Human Approved</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400">
                {automationRules.filter((r) => r.enabled).length}
              </div>
              <div className="text-xs text-amber-300">Active Rules</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-cyan-400">24/7</div>
              <div className="text-xs text-amber-300">Monitoring</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-amber-800/30 bg-black/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {[
              { id: 'dashboard', label: 'Command Center', icon: '🎛️' },
              {
                id: 'decisions',
                label: 'Pending Decisions',
                icon: '⏳',
                badge: pendingDecisions.length,
              },
              { id: 'rules', label: 'Automation Rules', icon: '⚙️' },
              { id: 'history', label: 'Decision History', icon: '📜' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-amber-400 text-white bg-amber-900/20'
                    : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.icon} {tab.label}
                {tab.badge && tab.badge > 0 && (
                  <span className="px-2 py-0.5 bg-amber-600 rounded-full text-xs">{tab.badge}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Critical Decisions Alert */}
            {criticalPending.length > 0 && (
              <div className="bg-red-900/30 rounded-2xl p-6 border border-red-700/50">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="text-red-400 animate-pulse">🚨</span> Critical Decisions
                  Requiring Attention
                </h2>
                <div className="space-y-3">
                  {criticalPending.map((d) => (
                    <div
                      key={d.id}
                      onClick={() => setSelectedDecision(d)}
                      className="p-4 bg-red-900/20 rounded-xl border border-red-700/50 cursor-pointer hover:bg-red-900/30 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{CATEGORY_CONFIG[d.category].icon}</span>
                          <div>
                            <h3 className="font-semibold">{d.title}</h3>
                            <p className="text-sm text-white/60">
                              {d.description.slice(0, 100)}...
                            </p>
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-red-600 rounded-lg font-medium hover:bg-red-500 transition-colors">
                          Review Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Category Health */}
            <div className="bg-black/30 rounded-2xl p-6 border border-amber-800/50">
              <h2 className="text-lg font-semibold mb-4">System Health by Category</h2>
              <div className="grid grid-cols-7 gap-4">
                {(systemHealth?.categories ?? []).map((cat) => {
                  const config = CATEGORY_CONFIG[cat.category];
                  return (
                    <div key={cat.category} className="text-center p-4 bg-black/20 rounded-xl">
                      <div
                        className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center text-2xl mb-2`}
                      >
                        {config.icon}
                      </div>
                      <div
                        className={`text-2xl font-bold ${
                          cat.score >= 80
                            ? 'text-green-400'
                            : cat.score >= 60
                              ? 'text-amber-400'
                              : 'text-red-400'
                        }`}
                      >
                        {Math.round(cat.score)}%
                      </div>
                      <div className="text-xs text-white/50">{config.name}</div>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <span
                          className={
                            cat.trend === 'up'
                              ? 'text-green-400'
                              : cat.trend === 'down'
                                ? 'text-red-400'
                                : 'text-white/40'
                          }
                        >
                          {cat.trend === 'up' ? '↑' : cat.trend === 'down' ? '↓' : '→'}
                        </span>
                        {cat.activeDecisions > 0 && (
                          <span className="text-xs px-1.5 py-0.5 bg-amber-600 rounded">
                            {cat.activeDecisions}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-black/30 rounded-2xl p-6 border border-amber-800/50">
                <h3 className="text-lg font-semibold mb-4">Recent Auto-Executed Decisions</h3>
                <div className="space-y-3">
                  {decisions
                    .filter((d) => d.status === 'auto-executed')
                    .slice(0, 3)
                    .map((d) => (
                      <div
                        key={d.id}
                        className="p-3 bg-green-900/20 rounded-xl border border-green-700/50"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span>{CATEGORY_CONFIG[d.category].icon}</span>
                          <span className="font-medium text-sm">{d.title}</span>
                          <span className="text-xs px-2 py-0.5 bg-green-600 rounded">Auto</span>
                        </div>
                        <p className="text-xs text-white/60">{d.recommendation}</p>
                      </div>
                    ))}
                </div>
              </div>

              <div className="bg-black/30 rounded-2xl p-6 border border-amber-800/50">
                <h3 className="text-lg font-semibold mb-4">Recently Triggered Rules</h3>
                <div className="space-y-3">
                  {automationRules
                    .filter((r) => r.lastTriggered)
                    .slice(0, 3)
                    .map((r) => (
                      <div key={r.id} className="p-3 bg-black/20 rounded-xl">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span>{CATEGORY_CONFIG[r.category].icon}</span>
                            <span className="font-medium text-sm">{r.name}</span>
                          </div>
                          <span
                            className={`text-xs px-2 py-0.5 rounded ${
                              r.automationLevel === 'full-auto'
                                ? 'bg-green-900 text-green-300'
                                : r.automationLevel === 'semi-auto'
                                  ? 'bg-amber-900 text-amber-300'
                                  : 'bg-blue-900 text-blue-300'
                            }`}
                          >
                            {r.automationLevel}
                          </span>
                        </div>
                        <div className="text-xs text-white/50">
                          Triggered{' '}
                          {Math.floor((Date.now() - (r.lastTriggered?.getTime() || 0)) / 3600000)}h
                          ago • {r.triggerCount} total
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'decisions' && (
          <div className="space-y-4">
            {pendingDecisions.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">✅</div>
                <h2 className="text-2xl font-bold mb-2">All Caught Up!</h2>
                <p className="text-white/60">No pending decisions require your attention.</p>
              </div>
            ) : (
              pendingDecisions.map((d) => (
                <div
                  key={d.id}
                  onClick={() => setSelectedDecision(d)}
                  className={`bg-black/30 rounded-2xl p-6 border cursor-pointer transition-all hover:scale-[1.01] ${
                    d.priority === 'critical'
                      ? 'border-red-700/50 hover:border-red-500'
                      : d.priority === 'high'
                        ? 'border-amber-700/50 hover:border-amber-500'
                        : 'border-amber-800/50 hover:border-amber-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${CATEGORY_CONFIG[d.category].color} flex items-center justify-center text-2xl`}
                      >
                        {CATEGORY_CONFIG[d.category].icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{d.title}</h3>
                        <div className="text-sm text-white/50">
                          {CATEGORY_CONFIG[d.category].name}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-lg text-sm ${
                          d.priority === 'critical'
                            ? 'bg-red-600'
                            : d.priority === 'high'
                              ? 'bg-amber-600'
                              : d.priority === 'medium'
                                ? 'bg-blue-600'
                                : 'bg-neutral-600'
                        }`}
                      >
                        {d.priority.toUpperCase()}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-lg text-sm ${
                          d.automationLevel === 'full-auto'
                            ? 'bg-green-900 text-green-300'
                            : d.automationLevel === 'semi-auto'
                              ? 'bg-amber-900 text-amber-300'
                              : 'bg-blue-900 text-blue-300'
                        }`}
                      >
                        {d.automationLevel}
                      </span>
                    </div>
                  </div>

                  <p className="text-white/70 mb-4">{d.description}</p>

                  <div className="p-4 bg-amber-900/20 rounded-xl border border-amber-700/30 mb-4">
                    <div className="text-xs text-amber-400 uppercase tracking-wider mb-1">
                      Recommendation
                    </div>
                    <p className="font-medium">{d.recommendation}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {d.impact.slice(0, 3).map((imp, idx) => (
                      <div key={idx} className="text-center p-3 bg-black/20 rounded-xl">
                        <div
                          className={`text-xl font-bold ${imp.projectedChange > 0 ? 'text-green-400' : 'text-red-400'}`}
                        >
                          {imp.projectedChange > 0 ? '+' : ''}
                          {imp.projectedChange}
                          {imp.unit}
                        </div>
                        <div className="text-xs text-white/50">{imp.metric}</div>
                        <div className="text-xs text-white/30">{imp.confidence}% confidence</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'rules' && (
          <div className="space-y-4">
            {automationRules.map((rule) => (
              <div key={rule.id} className="bg-black/30 rounded-2xl p-6 border border-amber-800/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{CATEGORY_CONFIG[rule.category].icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold">{rule.name}</h3>
                      <p className="text-sm text-white/50">{rule.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-lg text-sm ${
                        rule.automationLevel === 'full-auto'
                          ? 'bg-green-900 text-green-300'
                          : rule.automationLevel === 'semi-auto'
                            ? 'bg-amber-900 text-amber-300'
                            : rule.automationLevel === 'approval-required'
                              ? 'bg-blue-900 text-blue-300'
                              : 'bg-neutral-800 text-neutral-300'
                      }`}
                    >
                      {rule.automationLevel}
                    </span>
                    <button
                      className={`w-12 h-6 rounded-full transition-colors ${
                        rule.enabled ? 'bg-green-600' : 'bg-neutral-700'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white mx-1 transition-transform ${
                          rule.enabled ? 'translate-x-6' : ''
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-black/20 rounded-xl">
                    <div className="text-xs text-white/50 mb-2">Triggers</div>
                    <div className="space-y-1">
                      {rule.triggers.map((t, idx) => (
                        <div key={idx} className="text-sm font-mono">
                          {t.metric} {t.operator} {t.value}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 bg-black/20 rounded-xl">
                    <div className="text-xs text-white/50 mb-2">Actions</div>
                    <div className="space-y-1">
                      {rule.actions.map((a, idx) => (
                        <div key={idx} className="text-sm">
                          → {a}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between text-xs text-white/40 mt-4 pt-4 border-t border-amber-800/30">
                  <span>Triggered {rule.triggerCount} times</span>
                  {rule.lastTriggered && (
                    <span>
                      Last: {Math.floor((Date.now() - rule.lastTriggered.getTime()) / 3600000)}h ago
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            {decisions
              .filter((d) => d.status !== 'pending')
              .map((d) => (
                <div
                  key={d.id}
                  className={`bg-black/30 rounded-2xl p-6 border ${
                    d.status === 'approved'
                      ? 'border-green-800/50'
                      : d.status === 'auto-executed'
                        ? 'border-blue-800/50'
                        : d.status === 'rejected'
                          ? 'border-red-800/50'
                          : 'border-amber-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{CATEGORY_CONFIG[d.category].icon}</span>
                      <div>
                        <h3 className="font-semibold">{d.title}</h3>
                        <p className="text-sm text-white/50">{d.recommendation}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-3 py-1 rounded-lg text-sm ${
                          d.status === 'approved'
                            ? 'bg-green-600'
                            : d.status === 'auto-executed'
                              ? 'bg-blue-600'
                              : d.status === 'rejected'
                                ? 'bg-red-600'
                                : 'bg-amber-600'
                        }`}
                      >
                        {d.status}
                      </span>
                      <div className="text-xs text-white/40 mt-1">
                        {d.approvedAt?.toLocaleDateString() || d.executedAt?.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </main>

      {/* Decision Detail Modal */}
      {selectedDecision && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-neutral-900 rounded-2xl border border-amber-700/50 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div
              className={`p-6 bg-gradient-to-r ${CATEGORY_CONFIG[selectedDecision.category].color}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">
                    {CATEGORY_CONFIG[selectedDecision.category].icon}
                  </span>
                  <div>
                    <h2 className="text-xl font-bold">{selectedDecision.title}</h2>
                    <p className="text-white/80">
                      {CATEGORY_CONFIG[selectedDecision.category].name}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDecision(null)}
                  className="text-white/60 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <p className="text-white/80">{selectedDecision.description}</p>

              <div className="p-4 bg-amber-900/30 rounded-xl border border-amber-700/30">
                <div className="text-xs text-amber-400 uppercase tracking-wider mb-2">
                  AI Recommendation
                </div>
                <p className="font-semibold text-lg">{selectedDecision.recommendation}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Projected Impact</h4>
                <div className="grid grid-cols-3 gap-3">
                  {selectedDecision.impact.map((imp, idx) => (
                    <div key={idx} className="p-4 bg-black/30 rounded-xl text-center">
                      <div
                        className={`text-2xl font-bold ${imp.projectedChange > 0 ? 'text-green-400' : 'text-red-400'}`}
                      >
                        {imp.projectedChange > 0 ? '+' : ''}
                        {imp.projectedChange}
                        {imp.unit}
                      </div>
                      <div className="text-sm text-white/60">{imp.metric}</div>
                      <div className="text-xs text-white/40">{imp.confidence}% confidence</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">AI Reasoning</h4>
                <p className="text-sm text-white/70 p-4 bg-black/30 rounded-xl">
                  {selectedDecision.aiReasoning}
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Supporting Data</h4>
                <div className="space-y-2">
                  {selectedDecision.supportingData.map((data, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-black/30 rounded-lg"
                    >
                      <span className="text-sm text-white/50">{data.source}</span>
                      <span className="font-medium">{data.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Risks</h4>
                <div className="space-y-2">
                  {selectedDecision.risks.map((risk, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-red-900/20 rounded-xl border border-red-700/30"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{risk.description}</span>
                        <span className="text-xs px-2 py-0.5 bg-red-600 rounded">
                          {risk.probability}% probability
                        </span>
                      </div>
                      <p className="text-sm text-white/60">Mitigation: {risk.mitigation}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-neutral-800">
                <button
                  onClick={() => handleApprove(selectedDecision.id)}
                  className="flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl font-semibold hover:opacity-90 transition-all"
                >
                  ✅ Approve & Execute
                </button>
                <button
                  onClick={() => handleReject(selectedDecision.id)}
                  className="flex-1 py-3 bg-gradient-to-r from-red-600 to-rose-600 rounded-xl font-semibold hover:opacity-90 transition-all"
                >
                  ❌ Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AutopilotPage;
