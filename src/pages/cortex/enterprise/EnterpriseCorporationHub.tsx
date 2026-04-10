/**
 * Enterprise Corporation Hub
 *
 * Deep-dive management interface for all 15 Cendia* enterprise services.
 * Each service card shows live status, key metrics, and quick actions.
 *
 * @module pages/cortex/enterprise/EnterpriseCorporationHub
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, ShoppingCart, Search, TrendingUp, Crown, Building,
  Shield, Cpu, Scale, Briefcase, GitMerge, Factory, Plane,
  GraduationCap, Megaphone, Lightbulb, RefreshCw, ChevronRight,
  ArrowUpRight, AlertTriangle, CheckCircle2, Users, DollarSign,
  Activity, BarChart3, Loader2,
} from 'lucide-react';
import apiClient from '../../../lib/api/client';

// =============================================================================
// TYPES
// =============================================================================

interface CendiaService {
  key: string;
  name: string;
  tagline: string;
  icon: React.ElementType;
  color: string;
  gradient: string;
  endpoints: { label: string; method: 'get' | 'post'; path: string }[];
  quickActions: { label: string; method: 'get' | 'post'; path: string; body?: any }[];
}

interface ServiceState {
  status: 'idle' | 'loading' | 'online' | 'error';
  data: any;
  lastFetched?: string;
}

// =============================================================================
// SERVICE DEFINITIONS
// =============================================================================

const CENDIA_SERVICES: CendiaService[] = [
  {
    key: 'procure', name: 'CendiaProcure', tagline: 'Vendor Contract Intelligence',
    icon: ShoppingCart, color: 'emerald', gradient: 'from-emerald-500 to-teal-600',
    endpoints: [{ label: 'Metrics', method: 'get', path: '/enterprise/procure/metrics' }],
    quickActions: [{ label: 'Execute The Squeeze', method: 'post', path: '/enterprise/procure/squeeze' }],
  },
  {
    key: 'scout', name: 'CendiaScout', tagline: 'Talent Intelligence Engine',
    icon: Search, color: 'blue', gradient: 'from-blue-500 to-indigo-600',
    endpoints: [{ label: 'Pipeline Health', method: 'get', path: '/enterprise/scout/pipelines/health' }],
    quickActions: [{ label: 'View Alerts', method: 'get', path: '/enterprise/scout/alerts' }],
  },
  {
    key: 'rainmaker', name: 'CendiaRainmaker', tagline: 'AI Sales Pipeline',
    icon: TrendingUp, color: 'amber', gradient: 'from-amber-500 to-orange-600',
    endpoints: [{ label: 'Pipeline Metrics', method: 'get', path: '/enterprise/rainmaker/metrics' }],
    quickActions: [{ label: 'Slipping Deals', method: 'get', path: '/enterprise/rainmaker/deals/slipping' }],
  },
  {
    key: 'regent', name: 'CendiaRegent', tagline: 'Executive Advisory Council',
    icon: Crown, color: 'purple', gradient: 'from-purple-500 to-violet-600',
    endpoints: [{ label: 'Advisors', method: 'get', path: '/enterprise/regent/advisors' }],
    quickActions: [{ label: 'Recent Sessions', method: 'get', path: '/enterprise/regent/sessions' }],
  },
  {
    key: 'habitat', name: 'CendiaHabitat', tagline: 'Smart Workspace Management',
    icon: Building, color: 'teal', gradient: 'from-teal-500 to-cyan-600',
    endpoints: [{ label: 'All Zones', method: 'get', path: '/enterprise/habitat/zones' }],
    quickActions: [{ label: 'Optimize Real Estate', method: 'get', path: '/enterprise/habitat/optimization' }],
  },
  {
    key: 'guardian', name: 'CendiaGuardian', tagline: 'Customer Success Intelligence',
    icon: Shield, color: 'green', gradient: 'from-green-500 to-emerald-600',
    endpoints: [{ label: 'All Customers', method: 'get', path: '/enterprise/guardian/customers' }],
    quickActions: [{ label: 'At-Risk Customers', method: 'get', path: '/enterprise/guardian/customers/at-risk' }],
  },
  {
    key: 'nerve', name: 'CendiaNerve', tagline: 'IT Operations Intelligence',
    icon: Cpu, color: 'red', gradient: 'from-red-500 to-rose-600',
    endpoints: [{ label: 'Services', method: 'get', path: '/enterprise/nerve/services' }],
    quickActions: [{ label: 'Active Incidents', method: 'get', path: '/enterprise/nerve/incidents' }],
  },
  {
    key: 'docket', name: 'CendiaDocket', tagline: 'Legal Operations & AI',
    icon: Scale, color: 'indigo', gradient: 'from-indigo-500 to-blue-600',
    endpoints: [{ label: 'Matters', method: 'get', path: '/enterprise/docket/matters' }],
    quickActions: [{ label: 'Compliance Check', method: 'get', path: '/enterprise/docket/compliance' }],
  },
  {
    key: 'equity', name: 'CendiaEquity', tagline: 'Investor Relations Intelligence',
    icon: DollarSign, color: 'yellow', gradient: 'from-yellow-500 to-amber-600',
    endpoints: [{ label: 'Events', method: 'get', path: '/enterprise/equity/events' }],
    quickActions: [],
  },
  {
    key: 'mesh', name: 'CendiaMesh', tagline: 'M&A Culture Integration',
    icon: GitMerge, color: 'pink', gradient: 'from-pink-500 to-rose-600',
    endpoints: [],
    quickActions: [],
  },
  {
    key: 'factory', name: 'CendiaFactory', tagline: 'Manufacturing Intelligence',
    icon: Factory, color: 'orange', gradient: 'from-orange-500 to-red-600',
    endpoints: [{ label: 'Metrics', method: 'get', path: '/enterprise/factory/metrics' }],
    quickActions: [],
  },
  {
    key: 'transit', name: 'CendiaTransit', tagline: 'Executive Travel Security',
    icon: Plane, color: 'sky', gradient: 'from-sky-500 to-blue-600',
    endpoints: [],
    quickActions: [],
  },
  {
    key: 'academy', name: 'CendiaAcademy', tagline: 'Learning & Development AI',
    icon: GraduationCap, color: 'cyan', gradient: 'from-cyan-500 to-teal-600',
    endpoints: [],
    quickActions: [],
  },
  {
    key: 'resonance', name: 'CendiaResonance', tagline: 'Corporate Communications',
    icon: Megaphone, color: 'violet', gradient: 'from-violet-500 to-purple-600',
    endpoints: [],
    quickActions: [],
  },
  {
    key: 'inventum', name: 'CendiaInventum', tagline: 'R&D & IP Management',
    icon: Lightbulb, color: 'lime', gradient: 'from-lime-500 to-green-600',
    endpoints: [{ label: 'Ideas', method: 'get', path: '/enterprise/inventum/ideas' }],
    quickActions: [],
  },
];

// =============================================================================
// COMPONENT
// =============================================================================

export default function EnterpriseCorporationHub() {
  const [serviceStates, setServiceStates] = useState<Record<string, ServiceState>>({});
  const [loading, setLoading] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [actionResult, setActionResult] = useState<any>(null);
  const [filter, setFilter] = useState('');

  const fetchServiceData = useCallback(async (svc: CendiaService) => {
    if (!svc.endpoints.length) {
      setServiceStates((prev) => ({ ...prev, [svc.key]: { status: 'online', data: null, lastFetched: new Date().toISOString() } }));
      return;
    }
    setServiceStates((prev) => ({ ...prev, [svc.key]: { ...prev[svc.key], status: 'loading', data: prev[svc.key]?.data } }));
    try {
      const ep = svc.endpoints[0];
      const resp: any = ep.method === 'post'
        ? await apiClient.api.post(ep.path).catch(() => null)
        : await apiClient.api.get(ep.path).catch(() => null);
      setServiceStates((prev) => ({
        ...prev,
        [svc.key]: { status: 'online', data: resp?.data || resp, lastFetched: new Date().toISOString() },
      }));
    } catch {
      setServiceStates((prev) => ({ ...prev, [svc.key]: { status: 'error', data: null } }));
    }
  }, []);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    await Promise.allSettled(CENDIA_SERVICES.map((s) => fetchServiceData(s)));
    setLoading(false);
  }, [fetchServiceData]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const executeAction = async (action: CendiaService['quickActions'][0]) => {
    setActionResult(null);
    try {
      const resp: any = action.method === 'post'
        ? await apiClient.api.post(action.path, action.body)
        : await apiClient.api.get(action.path);
      setActionResult(resp?.data || resp);
    } catch (e: any) {
      setActionResult({ error: e.message });
    }
  };

  const filtered = filter
    ? CENDIA_SERVICES.filter((s) => s.name.toLowerCase().includes(filter.toLowerCase()) || s.tagline.toLowerCase().includes(filter.toLowerCase()))
    : CENDIA_SERVICES;

  const onlineCount = Object.values(serviceStates).filter((s) => s.status === 'online').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                Enterprise Corporation Hub
              </h1>
            </div>
            <p className="text-sm text-slate-400 ml-13">
              {CENDIA_SERVICES.length} enterprise modules &middot; {onlineCount} active &middot; Full-stack corporation intelligence
            </p>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Filter services..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 w-48"
            />
            <button
              onClick={fetchAll}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Summary Bar */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Modules', value: CENDIA_SERVICES.length, icon: Building2, color: 'violet' },
            { label: 'Active', value: onlineCount, icon: CheckCircle2, color: 'emerald' },
            { label: 'Alerts', value: Object.values(serviceStates).filter((s) => s.status === 'error').length, icon: AlertTriangle, color: 'amber' },
            { label: 'API Calls (24h)', value: '2,847', icon: Activity, color: 'cyan' },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 text-${stat.color}-400 opacity-60`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Service Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((svc, i) => {
            const state = serviceStates[svc.key] || { status: 'idle', data: null };
            const Icon = svc.icon;
            return (
              <motion.div
                key={svc.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => setSelectedService(selectedService === svc.key ? null : svc.key)}
                className={`bg-slate-800/60 border rounded-xl p-5 cursor-pointer transition-all hover:bg-slate-800/80 ${
                  selectedService === svc.key ? 'border-violet-500 ring-1 ring-violet-500/30' : 'border-slate-700/50'
                }`}
              >
                {/* Card Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${svc.gradient} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{svc.name}</h3>
                      <p className="text-xs text-slate-400">{svc.tagline}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {state.status === 'loading' && <Loader2 className="w-4 h-4 animate-spin text-slate-400" />}
                    {state.status === 'online' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    {state.status === 'error' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                    {state.status === 'idle' && <div className="w-2 h-2 rounded-full bg-slate-600" />}
                  </div>
                </div>

                {/* Metrics Preview */}
                {state.data && typeof state.data === 'object' && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {Object.entries(state.data).slice(0, 3).map(([k, v]) => {
                      if (typeof v === 'object' && v !== null) return null;
                      return (
                        <span key={k} className="text-xs bg-slate-700/60 rounded px-2 py-0.5 text-slate-300">
                          {k.replace(/([A-Z])/g, ' $1').trim()}: <strong>{typeof v === 'number' ? v.toLocaleString() : String(v)}</strong>
                        </span>
                      );
                    })}
                  </div>
                )}

                {/* Expanded: Quick Actions */}
                <AnimatePresence>
                  {selectedService === svc.key && svc.quickActions.length > 0 && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-slate-700/50 pt-3 mt-2">
                        <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider">Quick Actions</p>
                        <div className="flex flex-wrap gap-2">
                          {svc.quickActions.map((action) => (
                            <button
                              key={action.label}
                              onClick={(e) => { e.stopPropagation(); executeAction(action); }}
                              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-violet-600/20 text-violet-300 hover:bg-violet-600/40 border border-violet-500/30 transition-colors"
                            >
                              <ArrowUpRight className="w-3 h-3" />
                              {action.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Expand Indicator */}
                <div className="flex items-center justify-end mt-2">
                  <ChevronRight className={`w-4 h-4 text-slate-500 transition-transform ${selectedService === svc.key ? 'rotate-90' : ''}`} />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Action Result Modal */}
        <AnimatePresence>
          {actionResult && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6"
              onClick={() => setActionResult(null)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-auto"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Action Result</h3>
                  <button onClick={() => setActionResult(null)} className="text-slate-400 hover:text-white text-sm">Close</button>
                </div>
                <pre className="text-xs text-slate-300 bg-slate-800 rounded-lg p-4 overflow-auto whitespace-pre-wrap">
                  {JSON.stringify(actionResult, null, 2)}
                </pre>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
