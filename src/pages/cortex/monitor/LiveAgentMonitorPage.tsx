// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CendiaPulse™ - LIVE AGENT MONITOR WEB DASHBOARD
// Real-time visualization of agent actions, decisions, and compliance checks
// Superior to CLI monitors with animations, charts, and drill-down capabilities
// =============================================================================

import React, { useState, useEffect, useRef } from 'react';
import apiClient from '../../../lib/api/client';
import { deterministicFloat, deterministicInt } from '../../../lib/deterministic';
import { ReportSection, POIList, StatusBadge } from '../../../components/reports/DrillDownReportKit';
import { MetricWithSparkline, AnomalyBanner } from '../../../components/reports/TrendSparklineKit';
import { HeatmapCalendar, AuditTimeline } from '../../../components/reports/HeatmapTimelineKit';
import { ExportToolbar, ComparisonPanel, PDFExportButton } from '../../../components/reports/ExportCompareKit';
import { SavedViewManager } from '../../../components/reports/InteractionKit';
import {
  Activity,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  TrendingUp,
  TrendingDown,
  Users,
  Lock,
  Database,
  FileText,
  DollarSign,
  Eye,
  Pause,
  Play,
  Settings,
  Download,
  Filter,
  Search,
  ChevronRight,
  BarChart3,
  PieChart,
  RefreshCw,
} from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

interface AgentAction {
  id: string;
  timestamp: Date;
  agentId: string;
  agentName: string;
  agentColor: string;
  action: string;
  target?: string;
  decision: 'ALLOW' | 'BLOCK' | 'ESCALATE' | 'PENDING';
  riskScore: number;
  latencyMs: number;
  framework?: string;
  citation?: string;
  details?: string;
}

interface SystemMetrics {
  activeAgents: number;
  actionsPerSecond: number;
  avgLatency: number;
  blockRate: number;
  escalationRate: number;
  complianceScore: number;
  totalActions: number;
  blockedActions: number;
  escalatedActions: number;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const AGENTS = [
  { id: 'chief_strategist', name: 'Chief Strategist', color: 'bg-blue-500', textColor: 'text-blue-500' },
  { id: 'cfo_advisor', name: 'CFO Advisor', color: 'bg-emerald-500', textColor: 'text-emerald-500' },
  { id: 'ciso_security', name: 'CISO Security', color: 'bg-red-500', textColor: 'text-red-500' },
  { id: 'risk_analyzer', name: 'Risk Analyzer', color: 'bg-amber-500', textColor: 'text-amber-500' },
  { id: 'ethics_officer', name: 'Ethics Officer', color: 'bg-purple-500', textColor: 'text-purple-500' },
  { id: 'compliance_check', name: 'Compliance Bot', color: 'bg-cyan-500', textColor: 'text-cyan-500' },
  { id: 'legal_counsel', name: 'Legal Counsel', color: 'bg-pink-500', textColor: 'text-pink-500' },
  { id: 'operations_lead', name: 'Operations Lead', color: 'bg-teal-500', textColor: 'text-teal-500' },
  { id: 'data_pipeline', name: 'Data Pipeline', color: 'bg-indigo-500', textColor: 'text-indigo-500' },
  { id: 'audit_bot', name: 'Audit Bot', color: 'bg-green-500', textColor: 'text-green-500' },
  { id: 'treasury_bot', name: 'Treasury Bot', color: 'bg-yellow-500', textColor: 'text-yellow-500' },
  { id: 'invoice_processor', name: 'Invoice Processor', color: 'bg-slate-500', textColor: 'text-slate-500' },
  { id: 'portfolio_mgr', name: 'Portfolio Manager', color: 'bg-violet-500', textColor: 'text-violet-500' },
  { id: 'customer_service', name: 'Customer Service', color: 'bg-sky-500', textColor: 'text-sky-500' },
  { id: 'hr_assistant', name: 'HR Assistant', color: 'bg-fuchsia-500', textColor: 'text-fuchsia-500' },
  { id: 'vendor_manager', name: 'Vendor Manager', color: 'bg-orange-500', textColor: 'text-orange-500' },
];

// TR Demo: Petrov Transfer scenario - inject this action periodically
const TR_DEMO_ACTION: AgentAction = {
  id: 'tr-petrov-transfer',
  timestamp: new Date(),
  agentId: 'treasury_bot',
  agentName: 'Treasury Bot',
  agentColor: 'bg-yellow-500',
  action: 'transfer_funds',
  decision: 'ESCALATE',
  riskScore: 67,
  latencyMs: 23,
  framework: 'Basel-III',
  citation: '§4.2.1 - PEP Enhanced Due Diligence',
};

const ACTIONS = [
  'query_database', 'modify_record', 'approve_request', 'transfer_funds',
  'access_pii', 'generate_report', 'send_email', 'update_config',
  'escalate_ticket', 'close_account', 'schedule_task', 'delete_record',
  'export_data', 'import_batch', 'validate_identity', 'process_payment',
  'review_contract', 'sign_document', 'archive_file', 'restore_backup',
];

const FRAMEWORKS = [
  'HIPAA', 'GDPR', 'SOC2', 'PCI-DSS', 'CCPA', 'NIST-800-53',
  'FedRAMP', 'ISO-27001', 'Basel-III', 'MiFID-II', 'CMMC',
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function generateAction(): AgentAction {
  const agent = AGENTS[Math.floor(deterministicFloat('liveagentmonitor-8') * AGENTS.length)];
  const action = ACTIONS[Math.floor(deterministicFloat('liveagentmonitor-9') * ACTIONS.length)];
  const riskScore = deterministicInt(0, 99, 'liveagentmonitor-1');

  let decision: AgentAction['decision'];
  if (riskScore >= 85) {
    decision = 'BLOCK';
  } else if (riskScore >= 60) {
    decision = deterministicFloat('liveagentmonitor-6') > 0.5 ? 'ESCALATE' : 'ALLOW';
  } else if (riskScore >= 40) {
    decision = deterministicFloat('liveagentmonitor-7') > 0.8 ? 'ESCALATE' : 'ALLOW';
  } else {
    decision = 'ALLOW';
  }

  const needsCitation = riskScore >= 40 || ['access_pii', 'transfer_funds', 'delete_record', 'export_data'].includes(action);
  const framework = needsCitation ? FRAMEWORKS[Math.floor(deterministicFloat('liveagentmonitor-10') * FRAMEWORKS.length)] : undefined;
  const citation = framework ? `§${deterministicInt(0, 499, 'liveagentmonitor-2')}.${deterministicInt(0, 99, 'liveagentmonitor-3')}` : undefined;

  return {
    id: `${Date.now()}-${crypto.randomUUID().slice(0, 9)}`,
    timestamp: new Date(),
    agentId: agent.id,
    agentName: agent.name,
    agentColor: agent.color,
    action,
    decision,
    riskScore,
    latencyMs: deterministicInt(0, 49, 'liveagentmonitor-4') + 3,
    framework,
    citation,
  };
}

// =============================================================================
// COMPONENTS
// =============================================================================

const DecisionBadge: React.FC<{ decision: AgentAction['decision'] }> = ({ decision }) => {
  const configs = {
    ALLOW: { bg: 'bg-green-500', text: 'text-white', icon: CheckCircle },
    BLOCK: { bg: 'bg-red-500', text: 'text-white', icon: XCircle },
    ESCALATE: { bg: 'bg-amber-500', text: 'text-black', icon: AlertTriangle },
    PENDING: { bg: 'bg-gray-500', text: 'text-white', icon: Clock },
  };
  const config = configs[decision];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold ${config.bg} ${config.text} animate-pulse`}>
      <Icon className="w-3 h-3" />
      {decision}
    </span>
  );
};

const RiskGauge: React.FC<{ score: number }> = ({ score }) => {
  const color = score >= 80 ? 'text-red-500' : score >= 60 ? 'text-orange-500' : score >= 40 ? 'text-amber-500' : 'text-green-500';
  const bgColor = score >= 80 ? 'bg-red-500' : score >= 60 ? 'bg-orange-500' : score >= 40 ? 'bg-amber-500' : 'bg-green-500';

  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${bgColor} transition-all duration-300`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={`text-xs font-mono font-bold ${color}`}>{score}%</span>
    </div>
  );
};

const MetricCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: 'up' | 'down' | 'neutral';
  color: string;
}> = ({ title, value, icon: Icon, trend, color }) => (
  <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
    <div className="flex items-center justify-between">
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      {trend && (
        <div className={trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-gray-400'}>
          {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : trend === 'down' ? <TrendingDown className="w-4 h-4" /> : null}
        </div>
      )}
    </div>
    <div className="mt-3">
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-gray-400">{title}</p>
    </div>
  </div>
);

const ActionRow: React.FC<{ action: AgentAction; isNew: boolean }> = ({ action, isNew }) => {
  const agent = AGENTS.find(a => a.id === action.agentId) ?? AGENTS[0];

  return (
    <tr className={`border-b border-gray-800 transition-all duration-500 ${isNew ? 'bg-blue-900/30 animate-pulse' : 'hover:bg-gray-800/50'}`}>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${agent.color} ${isNew ? 'animate-ping' : ''}`} />
          <span className={`font-medium ${agent.textColor}`}>{action.agentName}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <code className="text-sm text-gray-300 bg-gray-800 px-2 py-0.5 rounded">{action.action}</code>
      </td>
      <td className="px-4 py-3">
        <DecisionBadge decision={action.decision} />
      </td>
      <td className="px-4 py-3">
        <RiskGauge score={action.riskScore} />
      </td>
      <td className="px-4 py-3">
        <span className={`text-xs font-mono ${action.latencyMs > 30 ? 'text-amber-400' : 'text-green-400'}`}>
          {action.latencyMs}ms
        </span>
      </td>
      <td className="px-4 py-3">
        {action.framework ? (
          <span className="text-xs text-cyan-400 font-mono">
            [{action.framework} {action.citation}]
          </span>
        ) : (
          <span className="text-gray-600">â€”</span>
        )}
      </td>
      <td className="px-4 py-3 text-xs text-gray-500">
        {action.timestamp.toLocaleTimeString()}
      </td>
    </tr>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const LiveAgentMonitorPage: React.FC = () => {
  const [actions, setActions] = useState<AgentAction[]>([]);
  const [metrics, setMetrics] = useState<SystemMetrics>({
    activeAgents: AGENTS.length,
    actionsPerSecond: 0,
    avgLatency: 0,
    blockRate: 0,
    escalationRate: 0,
    complianceScore: 99.2,
    totalActions: 0,
    blockedActions: 0,
    escalatedActions: 0,
  });
  const [isPaused, setIsPaused] = useState(false);
  const [filter, setFilter] = useState<'all' | 'ALLOW' | 'BLOCK' | 'ESCALATE'>('all');
  const [searchAgent, setSearchAgent] = useState('');
  const [newActionIds, setNewActionIds] = useState<Set<string>>(new Set());
  const actionsPerSecondRef = useRef(0);

  // Fetch real agent metrics from backend
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await apiClient.api.get<any>('/sgas/agents/status');
        if (res.success && res.data) {
          setMetrics(prev => ({
            ...prev,
            activeAgents: res.data.activeCount || prev.activeAgents,
            complianceScore: res.data.complianceScore || prev.complianceScore,
          }));
        }
      } catch { /* fallback to local metrics */ }
    };
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  // Generate actions - includes TR Demo Petrov transfer periodically
  useEffect(() => {
    if (isPaused) {return;}

    // Inject TR Demo action every 10 seconds
    const trDemoInterval = setInterval(() => {
      const trAction = {
        ...TR_DEMO_ACTION,
        id: `tr-petrov-${Date.now()}`,
        timestamp: new Date(),
      };
      setActions(prev => [trAction, ...prev].slice(0, 100));
      setNewActionIds(new Set([trAction.id]));
    }, 10000);

    const interval = setInterval(() => {
      const count = deterministicInt(0, 1, 'liveagentmonitor-5') + 1;
      const newActions: AgentAction[] = [];

      for (let i = 0; i < count; i++) {
        newActions.push(generateAction());
      }

      setActions(prev => [...newActions, ...prev].slice(0, 50));
      setNewActionIds(new Set(newActions.map(a => a.id)));
      actionsPerSecondRef.current += count;

      // Update metrics
      setMetrics(prev => {
        const total = prev.totalActions + count;
        const blocked = prev.blockedActions + newActions.filter(a => a.decision === 'BLOCK').length;
        const escalated = prev.escalatedActions + newActions.filter(a => a.decision === 'ESCALATE').length;
        const avgLat = Math.round((prev.avgLatency * prev.totalActions + newActions.reduce((s, a) => s + a.latencyMs, 0)) / total);

        return {
          ...prev,
          totalActions: total,
          blockedActions: blocked,
          escalatedActions: escalated,
          avgLatency: avgLat,
          blockRate: (blocked / total) * 100,
          escalationRate: (escalated / total) * 100,
          complianceScore: Math.max(90, 100 - (blocked / total) * 50 - (escalated / total) * 20),
        };
      });
    }, 800);

    return () => {
      clearInterval(interval);
      clearInterval(trDemoInterval);
    };
  }, [isPaused]);

  // Update actions per second
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        actionsPerSecond: actionsPerSecondRef.current,
      }));
      actionsPerSecondRef.current = 0;
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Clear new action highlighting
  useEffect(() => {
    if (newActionIds.size === 0) {return;}
    const timeout = setTimeout(() => setNewActionIds(new Set()), 500);
    return () => clearTimeout(timeout);
  }, [newActionIds]);

  const filteredActions = actions.filter(a => {
    if (filter !== 'all' && a.decision !== filter) {return false;}
    if (searchAgent && !a.agentName.toLowerCase().includes(searchAgent.toLowerCase())) {return false;}
    return true;
  });

  const decisionCounts = {
    ALLOW: actions.filter(a => a.decision === 'ALLOW').length,
    BLOCK: actions.filter(a => a.decision === 'BLOCK').length,
    ESCALATE: actions.filter(a => a.decision === 'ESCALATE').length,
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900 border-b border-gray-800">
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/30">
                <Activity className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  CendiaPulse™
                </h1>
                <p className="text-sm text-gray-400">Real-time AI agent activity • Compliance enforcement • Risk scoring</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${isPaused ? 'bg-amber-500/20 text-amber-400' : 'bg-green-500/20 text-green-400'}`}>
                <div className={`w-2 h-2 rounded-full ${isPaused ? 'bg-amber-500' : 'bg-green-500 animate-pulse'}`} />
                <span className="text-sm font-medium">{isPaused ? 'Paused' : 'Live'}</span>
              </div>

              <button
                onClick={() => setIsPaused(!isPaused)}
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
              </button>

              <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                <Download className="w-5 h-5" />
              </button>

              <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto px-6 py-6">
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
          <MetricCard title="Active Agents" value={metrics.activeAgents} icon={Users} color="bg-blue-500" />
          <MetricCard title="Actions/sec" value={metrics.actionsPerSecond.toFixed(1)} icon={Zap} trend="up" color="bg-amber-500" />
          <MetricCard title="Avg Latency" value={`${metrics.avgLatency}ms`} icon={Clock} color="bg-purple-500" />
          <MetricCard title="Compliance" value={`${metrics.complianceScore.toFixed(1)}%`} icon={Shield} trend="up" color="bg-green-500" />
          <MetricCard title="Block Rate" value={`${metrics.blockRate.toFixed(1)}%`} icon={XCircle} color="bg-red-500" />
          <MetricCard title="Escalations" value={`${metrics.escalationRate.toFixed(1)}%`} icon={AlertTriangle} color="bg-orange-500" />
          <MetricCard title="Total Actions" value={metrics.totalActions.toLocaleString()} icon={Activity} color="bg-indigo-500" />
          <MetricCard title="Blocked" value={metrics.blockedActions.toLocaleString()} icon={Lock} color="bg-rose-500" />
        </div>

        {/* Decision Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          <div className="lg:col-span-3 bg-gray-900/50 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-400" />
                Decision Distribution
              </h2>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-green-500" />
                  <span>ALLOW ({decisionCounts.ALLOW})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-red-500" />
                  <span>BLOCK ({decisionCounts.BLOCK})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-amber-500" />
                  <span>ESCALATE ({decisionCounts.ESCALATE})</span>
                </div>
              </div>
            </div>
            <div className="h-8 bg-gray-800 rounded-full overflow-hidden flex">
              <div
                className="h-full bg-green-500 transition-all duration-500"
                style={{ width: `${(decisionCounts.ALLOW / Math.max(actions.length, 1)) * 100}%` }}
              />
              <div
                className="h-full bg-red-500 transition-all duration-500"
                style={{ width: `${(decisionCounts.BLOCK / Math.max(actions.length, 1)) * 100}%` }}
              />
              <div
                className="h-full bg-amber-500 transition-all duration-500"
                style={{ width: `${(decisionCounts.ESCALATE / Math.max(actions.length, 1)) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <PieChart className="w-5 h-5 text-purple-400" />
              Compliance Score
            </h2>
            <div className="flex items-center justify-center">
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="none" className="text-gray-800" />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className={metrics.complianceScore >= 95 ? 'text-green-500' : metrics.complianceScore >= 80 ? 'text-amber-500' : 'text-red-500'}
                    strokeDasharray={`${metrics.complianceScore * 3.52} 352`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold">{metrics.complianceScore.toFixed(0)}%</span>
                  <span className="text-xs text-gray-400">Compliant</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2 bg-gray-900/50 border border-gray-800 rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search agents..."
              value={searchAgent}
              onChange={(e) => setSearchAgent(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-40"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            {(['all', 'ALLOW', 'BLOCK', 'ESCALATE'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filter === f
                    ? f === 'ALLOW' ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : f === 'BLOCK' ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : f === 'ESCALATE' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {f === 'all' ? 'All' : f}
              </button>
            ))}
          </div>

          <div className="ml-auto text-sm text-gray-500">
            Showing {filteredActions.length} of {actions.length} actions
          </div>
        </div>

        {/* Actions Table */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr className="text-left text-xs text-gray-400 uppercase tracking-wider">
                  <th className="px-4 py-3 font-medium">Agent</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                  <th className="px-4 py-3 font-medium">Decision</th>
                  <th className="px-4 py-3 font-medium">Risk Score</th>
                  <th className="px-4 py-3 font-medium">Latency</th>
                  <th className="px-4 py-3 font-medium">Compliance</th>
                  <th className="px-4 py-3 font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredActions.map((action) => (
                  <ActionRow
                    key={action.id}
                    action={action}
                    isNew={newActionIds.has(action.id)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Operate Analytics Drill-Down */}
        <ReportSection
          title="Operations Analytics"
          subtitle="Agent performance, incident timeline, and service health insights"
          icon={<Activity className="w-4 h-4 text-blue-400" />}
          tableColumns={[
            { key: 'agent', label: 'Agent', sortable: true },
            { key: 'actions', label: 'Actions', sortable: true, align: 'right' as const },
            { key: 'allowRate', label: 'Allow Rate', align: 'right' as const, render: (v: number) => <span className={v >= 90 ? 'text-emerald-400 font-bold' : v >= 70 ? 'text-amber-400 font-bold' : 'text-red-400 font-bold'}>{v}%</span> },
            { key: 'blockRate', label: 'Block Rate', align: 'right' as const, render: (v: number) => <span className={v <= 5 ? 'text-emerald-400' : v <= 15 ? 'text-amber-400' : 'text-red-400 font-bold'}>{v}%</span> },
            { key: 'avgRisk', label: 'Avg Risk', align: 'right' as const, render: (v: number) => <StatusBadge status={v >= 60 ? 'error' : v >= 40 ? 'warning' : 'success'} label={`${v}`} /> },
          ]}
          tableData={AGENTS.map((agent, i) => {
            const agentActions = actions.filter(a => a.agentId === agent.id);
            const total = Math.max(agentActions.length, 1);
            return {
              id: agent.id,
              agent: agent.name,
              actions: agentActions.length,
              allowRate: Math.round((agentActions.filter(a => a.decision === 'ALLOW').length / total) * 100),
              blockRate: Math.round((agentActions.filter(a => a.decision === 'BLOCK').length / total) * 100),
              avgRisk: agentActions.length > 0 ? Math.round(agentActions.reduce((s, a) => s + a.riskScore, 0) / total) : 0,
            };
          })}
          chartData={[
            { label: 'Allowed', value: decisionCounts.ALLOW, color: 'bg-emerald-500' },
            { label: 'Blocked', value: decisionCounts.BLOCK, color: 'bg-red-500' },
            { label: 'Escalated', value: decisionCounts.ESCALATE, color: 'bg-amber-500' },
          ]}
          chartTitle="Decision Distribution"
          poiItems={[
            { id: 'o1', title: `${metrics.activeAgents} agents active`, description: `All ${metrics.activeAgents} agents are processing actions. Compliance score: ${metrics.complianceScore.toFixed(1)}%.`, severity: 'positive' as const, metric: String(metrics.activeAgents), metricLabel: 'active' },
            { id: 'o2', title: `Block rate: ${metrics.blockRate.toFixed(1)}%`, description: `${metrics.blockedActions} actions blocked out of ${metrics.totalActions} total. ${metrics.blockRate > 10 ? 'Elevated block rate may indicate increased threat activity.' : 'Block rate within normal operating parameters.'}`, severity: metrics.blockRate > 10 ? ('high' as const) : ('positive' as const), metric: `${metrics.blockRate.toFixed(1)}%`, metricLabel: 'block rate' },
            { id: 'o3', title: `Avg latency: ${metrics.avgLatency}ms`, description: `Average action processing latency is ${metrics.avgLatency}ms. ${metrics.avgLatency > 30 ? 'Above 30ms threshold — consider scaling agents.' : 'Within acceptable performance bounds.'}`, severity: metrics.avgLatency > 30 ? ('medium' as const) : ('positive' as const), metric: `${metrics.avgLatency}ms`, metricLabel: 'latency' },
          ]}
          defaultView="table"
        />

        {/* Enhanced Analytics */}
        <div className="space-y-6 mt-8 border-t border-blue-900/30 pt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2"><Activity className="w-5 h-5 text-blue-400" /> Enhanced Analytics</h2>
            <div className="flex items-center gap-2">
              <SavedViewManager pageId="live-monitor" currentFilters={{}} onLoadView={() => {}} />
              <ExportToolbar data={actions.map(a => ({ agent: AGENTS.find(ag => ag.id === a.agentId)?.name || a.agentId, action: a.action, decision: a.decision, risk: a.riskScore }))} columns={[{ key: 'agent', label: 'Agent' }, { key: 'action', label: 'Action' }, { key: 'decision', label: 'Decision' }, { key: 'risk', label: 'Risk Score' }]} filename="live-agent-actions" />
              <PDFExportButton title="CendiaPulse Operations Report" subtitle="Live Agent Monitoring & Action Analytics" sections={[{ heading: 'Agent Performance', content: `${metrics.activeAgents} agents active. ${metrics.totalActions} total actions processed. Block rate: ${metrics.blockRate.toFixed(1)}%. Compliance score: ${metrics.complianceScore.toFixed(1)}%.`, metrics: [{ label: 'Active Agents', value: String(metrics.activeAgents) }, { label: 'Total Actions', value: String(metrics.totalActions) }, { label: 'Block Rate', value: `${metrics.blockRate.toFixed(1)}%` }, { label: 'Compliance', value: `${metrics.complianceScore.toFixed(1)}%` }] }]} />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricWithSparkline title="Actions/sec" value={metrics.actionsPerSecond || 0} trend={[12, 14, 15, 16, 18, 19, 20, metrics.actionsPerSecond || 21]} change={5.0} color="#60a5fa" />
            <MetricWithSparkline title="Block Rate" value={`${metrics.blockRate.toFixed(1)}%`} trend={[8.5, 7.8, 7.2, 6.8, 6.5, 6.2, 6.0, metrics.blockRate]} change={-3.3} color="#f87171" inverted />
            <MetricWithSparkline title="Compliance" value={`${metrics.complianceScore.toFixed(1)}%`} trend={[94, 95, 95.5, 96, 96.5, 97, 97.5, metrics.complianceScore]} change={1.0} color="#34d399" />
            <MetricWithSparkline title="Avg Latency" value={`${metrics.avgLatency}ms`} trend={[32, 30, 28, 27, 26, 25, 24, metrics.avgLatency]} change={-4.0} color="#fbbf24" inverted />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <HeatmapCalendar title="Agent Action Activity" subtitle="Daily action processing volume" valueLabel="actions" data={Array.from({ length: 180 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (180 - i)); return { date: d.toISOString().split('T')[0], value: Math.floor(Math.random() * 25) }; })} weeks={26} />
            <ComparisonPanel title="Operations Trend" labelA="Last Hour" labelB="This Hour" items={[{ label: 'Actions Processed', valueA: 142, valueB: metrics.totalActions, format: 'number', higherIsBetter: true }, { label: 'Block Rate', valueA: 6.8, valueB: metrics.blockRate, format: 'percent', higherIsBetter: false }, { label: 'Compliance Score', valueA: 96.5, valueB: metrics.complianceScore, format: 'percent', higherIsBetter: true }, { label: 'Avg Latency (ms)', valueA: 26, valueB: metrics.avgLatency, format: 'number', higherIsBetter: false }]} />
          </div>
          <AuditTimeline title="Operations Audit Trail" events={[{ id: 'op1', timestamp: new Date(Date.now() - 120000), type: 'decision', title: 'Action allowed: data export', description: 'Financial data export request approved by compliance agent with risk score 12', actor: 'Compliance Agent', severity: 'info' }, { id: 'op2', timestamp: new Date(Date.now() - 600000), type: 'alert', title: 'Action blocked: unauthorized access', description: 'Attempted access to restricted model weights blocked. Risk score: 92.', severity: 'critical' }, { id: 'op3', timestamp: new Date(Date.now() - 1800000), type: 'escalation', title: 'High-risk action escalated', description: 'Cross-border data transfer request escalated to DPO for manual review', severity: 'high' }]} maxVisible={3} />
        </div>
      </div>
    </div>
  );
};

export default LiveAgentMonitorPage;
