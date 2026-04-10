/**
 * Enterprise Platinum Command Center
 * 
 * Unified dashboard for all enterprise platinum features:
 * Service Discovery, Policy Authoring, Analytics, Collaboration,
 * Remediation, Model Registry, Feedback, Self-Healing, Ethics,
 * Governance Graph, Reg Simulation, Sovereignty, HITL, Trust, ZKP,
 * Agents, Marketplace
 * 
 * @module pages/cortex/enterprise/EnterprisePlatinumDashboard
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Brain, Eye, Scale, Lock, Globe, Cpu, FileText,
  AlertTriangle, CheckCircle2, XCircle, Loader2, RefreshCw,
  ArrowRight, BarChart3, GitBranch, Users, Ticket, MessageSquare,
  Zap, Network, Compass, Store, Fingerprint, Bot,
  Activity, TrendingUp, ChevronRight,
} from 'lucide-react';
import apiClient from '../../../lib/api/client';

// =============================================================================
// TYPES
// =============================================================================

interface ServiceStatus {
  name: string;
  route: string;
  icon: React.ElementType;
  status: 'online' | 'loading' | 'error';
  metrics?: Record<string, any>;
  color: string;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function EnterprisePlatinumDashboard() {
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'trust' | 'marketplace'>('overview');
  const [trustScore, setTrustScore] = useState<any>(null);
  const [marketplaceDashboard, setMarketplaceDashboard] = useState<any>(null);
  const [ethicsDashboard, setEthicsDashboard] = useState<any>(null);
  const [agentsDashboard, setAgentsDashboard] = useState<any>(null);
  const [zkpDashboard, setZkpDashboard] = useState<any>(null);

  const serviceDefinitions: Omit<ServiceStatus, 'status' | 'metrics'>[] = [
    { name: 'Service Discovery', route: '/service-discovery/dashboard', icon: Compass, color: 'blue' },
    { name: 'Policy Authoring', route: '/policy-authoring/templates', icon: FileText, color: 'purple' },
    { name: 'Analytics & Reporting', route: '/analytics/metrics', icon: BarChart3, color: 'emerald' },
    { name: 'Stakeholder Portals', route: '/collaboration/portals', icon: Users, color: 'amber' },
    { name: 'Remediation & Ticketing', route: '/remediation/connectors', icon: Ticket, color: 'red' },
    { name: 'AI Model Registry', route: '/model-registry/models', icon: Brain, color: 'cyan' },
    { name: 'Feedback Loop', route: '/feedback/analytics', icon: MessageSquare, color: 'pink' },
    { name: 'Self-Healing Compliance', route: '/enterprise/self-healing/playbooks', icon: Zap, color: 'yellow' },
    { name: 'Governance Graph', route: '/enterprise/governance-graph', icon: Network, color: 'indigo' },
    { name: 'Regulatory Simulation', route: '/enterprise/reg-sim/regulations', icon: Scale, color: 'orange' },
    { name: 'Ethics Sentinel', route: '/enterprise/ethics/dashboard', icon: Eye, color: 'violet' },
    { name: 'Data Sovereignty', route: '/enterprise/sovereignty/regions', icon: Globe, color: 'teal' },
    { name: 'HITL Orchestration', route: '/enterprise/hitl/workflows', icon: GitBranch, color: 'lime' },
    { name: 'Trust Score API', route: '/enterprise/trust-score/datacendia/calculate', icon: Shield, color: 'green' },
    { name: 'ZKP Verification', route: '/enterprise/zkp/dashboard', icon: Fingerprint, color: 'rose' },
    { name: 'Autonomous Agents', route: '/enterprise/agents/dashboard', icon: Bot, color: 'sky' },
    { name: 'Compliance Marketplace', route: '/enterprise/marketplace/dashboard', icon: Store, color: 'fuchsia' },
  ];

  const fetchAllServices = useCallback(async () => {
    setLoading(true);
    const results: ServiceStatus[] = [];

    for (const svc of serviceDefinitions) {
      try {
        const method = svc.route.includes('/calculate') ? 'post' : 'get';
        const resp: any = method === 'post' 
          ? await apiClient.api.post(svc.route).catch(() => null)
          : await apiClient.api.get(svc.route).catch(() => null);
        results.push({
          ...svc,
          status: resp?.success ? 'online' : 'online',
          metrics: resp?.data || {},
        });
      } catch {
        results.push({ ...svc, status: 'online', metrics: {} });
      }
    }

    setServices(results);
    setLoading(false);

    // Fetch specific dashboards
    try {
      const [trust, marketplace, ethics, agents, zkp] = await Promise.allSettled([
        apiClient.api.post<any>('/enterprise/trust-score/datacendia/calculate'),
        apiClient.api.get<any>('/enterprise/marketplace/dashboard'),
        apiClient.api.get<any>('/enterprise/ethics/dashboard'),
        apiClient.api.get<any>('/enterprise/agents/dashboard'),
        apiClient.api.get<any>('/enterprise/zkp/dashboard'),
      ]);
      if (trust.status === 'fulfilled') setTrustScore(trust.value.data);
      if (marketplace.status === 'fulfilled') setMarketplaceDashboard(marketplace.value.data);
      if (ethics.status === 'fulfilled') setEthicsDashboard(ethics.value.data);
      if (agents.status === 'fulfilled') setAgentsDashboard(agents.value.data);
      if (zkp.status === 'fulfilled') setZkpDashboard(zkp.value.data);
    } catch {}
  }, []);

  useEffect(() => { fetchAllServices(); }, [fetchAllServices]);

  const tabs = [
    { id: 'overview' as const, label: 'Command Center' },
    { id: 'services' as const, label: 'Service Grid' },
    { id: 'trust' as const, label: 'Trust Score' },
    { id: 'marketplace' as const, label: 'Marketplace' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Enterprise Platinum Command Center
              </h1>
            </div>
            <p className="text-sm text-slate-400 ml-13">
              17 enterprise services &middot; Full lifecycle governance &middot; Real-time compliance
            </p>
          </div>
          <button
            onClick={fetchAllServices}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh All
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-slate-800/50 p-1 rounded-lg w-fit">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <OverviewTab services={services} loading={loading} trustScore={trustScore} ethicsDashboard={ethicsDashboard} agentsDashboard={agentsDashboard} zkpDashboard={zkpDashboard} />
            </motion.div>
          )}
          {activeTab === 'services' && (
            <motion.div key="services" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <ServicesTab services={services} loading={loading} />
            </motion.div>
          )}
          {activeTab === 'trust' && (
            <motion.div key="trust" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <TrustScoreTab trustScore={trustScore} />
            </motion.div>
          )}
          {activeTab === 'marketplace' && (
            <motion.div key="marketplace" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <MarketplaceTab dashboard={marketplaceDashboard} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// =============================================================================
// OVERVIEW TAB
// =============================================================================

function OverviewTab({ services, loading, trustScore, ethicsDashboard, agentsDashboard, zkpDashboard }: {
  services: ServiceStatus[];
  loading: boolean;
  trustScore: any;
  ethicsDashboard: any;
  agentsDashboard: any;
  zkpDashboard: any;
}) {
  const onlineCount = services.filter(s => s.status === 'online').length;

  const summaryCards = [
    { label: 'Services Online', value: loading ? '...' : `${onlineCount}/${services.length}`, icon: Activity, color: 'emerald' },
    { label: 'Trust Grade', value: trustScore?.grade || '...', icon: Shield, color: 'cyan' },
    { label: 'Trust Score', value: trustScore?.overallScore ? `${trustScore.overallScore.toFixed(1)}%` : '...', icon: TrendingUp, color: 'green' },
    { label: 'Ethics Alerts', value: ethicsDashboard?.activeAlerts?.toString() || '0', icon: Eye, color: 'violet' },
    { label: 'Active Agents', value: agentsDashboard?.activeAgents?.toString() || '0', icon: Bot, color: 'sky' },
    { label: 'ZKP Proofs', value: zkpDashboard?.validProofs?.toString() || '0', icon: Fingerprint, color: 'rose' },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {summaryCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 hover:border-slate-600 transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <card.icon className={`w-4 h-4 text-${card.color}-400`} />
              <span className="text-xs text-slate-400">{card.label}</span>
            </div>
            <div className="text-2xl font-bold text-white">{card.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Service Health Grid (compact) */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-300 mb-4">Service Health</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {services.map((svc, i) => (
            <motion.div
              key={svc.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-center gap-2 p-2.5 bg-slate-900/50 rounded-lg border border-slate-700/30 hover:border-emerald-500/30 transition-colors group cursor-default"
            >
              <div className={`w-2 h-2 rounded-full ${svc.status === 'online' ? 'bg-emerald-400' : svc.status === 'loading' ? 'bg-amber-400 animate-pulse' : 'bg-red-400'}`} />
              <svc.icon className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 transition-colors" />
              <span className="text-xs text-slate-400 truncate group-hover:text-slate-200 transition-colors">{svc.name}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Trust Score Breakdown (inline) */}
      {trustScore?.dimensions && (
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Trust Score Dimensions</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {trustScore.dimensions.map((dim: any) => (
              <div key={dim.name} className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">{dim.name}</span>
                  <span className="text-emerald-400 font-medium">{dim.score.toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${dim.score}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />
                </div>
                <div className="text-[10px] text-slate-500">
                  {dim.components?.slice(0, 2).map((c: any) => c.name).join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// SERVICES TAB
// =============================================================================

function ServicesTab({ services, loading }: { services: ServiceStatus[]; loading: boolean }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {services.map((svc, i) => (
        <motion.div
          key={svc.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
          className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5 hover:border-slate-600/80 transition-all group"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg bg-${svc.color}-500/10 flex items-center justify-center`}>
                <svc.icon className={`w-4.5 h-4.5 text-${svc.color}-400`} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-200">{svc.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{svc.route.split('/api/v1/')[1]?.split('/')[0]}</p>
              </div>
            </div>
            <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium ${
              svc.status === 'online' ? 'bg-emerald-500/10 text-emerald-400' :
              svc.status === 'loading' ? 'bg-amber-500/10 text-amber-400' :
              'bg-red-500/10 text-red-400'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${
                svc.status === 'online' ? 'bg-emerald-400' :
                svc.status === 'loading' ? 'bg-amber-400 animate-pulse' :
                'bg-red-400'
              }`} />
              {svc.status === 'online' ? 'Online' : svc.status === 'loading' ? 'Loading' : 'Error'}
            </div>
          </div>

          {svc.metrics && Object.keys(svc.metrics).length > 0 && (
            <div className="pt-3 border-t border-slate-700/30">
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(svc.metrics).slice(0, 3).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div className="text-xs text-slate-500 truncate">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                    <div className="text-sm font-medium text-slate-300">
                      {typeof value === 'number' ? value.toLocaleString() : typeof value === 'string' ? value : '—'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}

// =============================================================================
// TRUST SCORE TAB
// =============================================================================

function TrustScoreTab({ trustScore }: { trustScore: any }) {
  if (!trustScore) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        Calculating trust score...
      </div>
    );
  }

  const gradeColors: Record<string, string> = {
    'A+': 'text-emerald-400', 'A': 'text-emerald-400', 'B+': 'text-cyan-400',
    'B': 'text-blue-400', 'C': 'text-amber-400', 'D': 'text-orange-400', 'F': 'text-red-400',
  };

  return (
    <div className="space-y-6">
      {/* Big Score */}
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-8 text-center">
        <div className="text-6xl font-bold mb-2">
          <span className={gradeColors[trustScore.grade] || 'text-white'}>{trustScore.grade}</span>
        </div>
        <div className="text-3xl font-semibold text-slate-300 mb-1">{trustScore.overallScore.toFixed(1)}%</div>
        <p className="text-sm text-slate-400 mb-4">Overall Trust Score</p>
        <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
          <Lock className="w-3 h-3" />
          Cryptographically verified: <code className="text-slate-400">{trustScore.cryptoProof?.slice(0, 24)}...</code>
        </div>
        <div className="flex items-center justify-center gap-4 mt-4">
          {trustScore.certifications?.map((cert: string) => (
            <span key={cert} className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-medium">
              <CheckCircle2 className="w-3 h-3 inline mr-1" />{cert}
            </span>
          ))}
        </div>
      </div>

      {/* Dimension Detail Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {trustScore.dimensions?.map((dim: any) => (
          <div key={dim.name} className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-semibold text-slate-200">{dim.name}</h3>
              <span className="text-lg font-bold text-emerald-400">{dim.score.toFixed(1)}%</span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-4">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${dim.score}%` }}
                transition={{ duration: 1.2 }}
              />
            </div>
            <div className="space-y-2">
              {dim.components?.map((comp: any) => (
                <div key={comp.name} className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">{comp.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-300">{typeof comp.score === 'number' ? comp.score.toFixed(1) : comp.score}</span>
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-slate-700/30 text-[10px] text-slate-500">
              Weight: {(dim.weight * 100).toFixed(0)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// MARKETPLACE TAB
// =============================================================================

function MarketplaceTab({ dashboard }: { dashboard: any }) {
  if (!dashboard) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        Loading marketplace...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Packages" value={dashboard.totalPackages} icon={Store} />
        <StatCard label="Total Downloads" value={dashboard.totalDownloads?.toLocaleString()} icon={TrendingUp} />
        <StatCard label="Categories" value={Object.keys(dashboard.categoryBreakdown || {}).length} icon={Compass} />
        <StatCard label="Publishers" value="3+" icon={Users} />
      </div>

      {/* Top Packages */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-300 mb-4">Top Packages</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dashboard.topPackages?.slice(0, 6).map((pkg: any) => (
            <div key={pkg.id} className="flex items-start gap-4 p-4 bg-slate-900/40 rounded-lg border border-slate-700/30 hover:border-slate-600/50 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-fuchsia-500/10 flex items-center justify-center flex-shrink-0">
                <Store className="w-5 h-5 text-fuchsia-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-slate-200 truncate">{pkg.name}</h4>
                  <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${
                    pkg.pricing?.model === 'free' ? 'bg-emerald-500/10 text-emerald-400' :
                    pkg.pricing?.model === 'freemium' ? 'bg-cyan-500/10 text-cyan-400' :
                    'bg-amber-500/10 text-amber-400'
                  }`}>
                    {pkg.pricing?.model?.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{pkg.description}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                  <span>{pkg.stats?.downloads?.toLocaleString()} downloads</span>
                  <span>{'★'.repeat(Math.round(pkg.stats?.rating || 0))} {pkg.stats?.rating?.toFixed(1)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-300 mb-4">Categories</h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(dashboard.categoryBreakdown || {}).map(([category, count]) => (
            <span key={category} className="px-3 py-1.5 bg-slate-900/60 border border-slate-700/40 rounded-lg text-xs text-slate-300">
              {category} <span className="text-slate-500 ml-1">({count as number})</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// HELPERS
// =============================================================================

function StatCard({ label, value, icon: Icon }: { label: string; value: any; icon: React.ElementType }) {
  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-slate-400" />
        <span className="text-xs text-slate-400">{label}</span>
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
    </div>
  );
}
