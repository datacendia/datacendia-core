/**
 * Policy Authoring Deep-Dive Page
 *
 * Full lifecycle policy management: templates, drafting, versioning,
 * approval workflows, simulation, and audit trails.
 *
 * @module pages/cortex/enterprise/PolicyAuthoringPage
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Plus, RefreshCw, CheckCircle2, XCircle, Clock,
  Play, Eye, History, Shield, AlertTriangle, Loader2,
  ChevronRight, Filter, Search, ArrowRight, Zap,
} from 'lucide-react';
import apiClient from '../../../lib/api/client';

// =============================================================================
// TYPES
// =============================================================================

interface PolicyTemplate {
  id: string;
  name: string;
  description?: string;
  domain: string;
  framework?: string;
  version: string;
  tags?: string[];
}

interface PolicyDefinition {
  id: string;
  name: string;
  description?: string;
  domain: string;
  status: 'draft' | 'pending_review' | 'approved' | 'active' | 'deprecated' | 'archived';
  version: number;
  severity: string;
  createdAt: string;
  updatedAt: string;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function PolicyAuthoringPage() {
  const [tab, setTab] = useState<'templates' | 'policies' | 'audit'>('templates');
  const [templates, setTemplates] = useState<PolicyTemplate[]>([]);
  const [policies, setPolicies] = useState<PolicyDefinition[]>([]);
  const [auditLog, setAuditLog] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPolicy, setSelectedPolicy] = useState<string | null>(null);
  const [simResult, setSimResult] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [domainFilter, setDomainFilter] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [tplResp, polResp] = await Promise.allSettled([
        apiClient.api.get<any>('/policy-authoring/templates'),
        apiClient.api.get<any>('/policy-authoring/policies'),
      ]);
      if (tplResp.status === 'fulfilled') setTemplates(tplResp.value?.data?.templates || tplResp.value?.templates || []);
      if (polResp.status === 'fulfilled') setPolicies(polResp.value?.data?.policies || polResp.value?.policies || []);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const fetchAudit = async (policyId: string) => {
    try {
      const resp: any = await apiClient.api.get(`/policy-authoring/policies/${policyId}/audit`);
      setAuditLog(resp?.data?.auditLog || resp?.auditLog || []);
    } catch { setAuditLog([]); }
  };

  const simulatePolicy = async (policyId: string) => {
    setSimResult(null);
    try {
      const resp: any = await apiClient.api.post(`/policy-authoring/policies/${policyId}/simulate`, {
        scenario: { dataTypes: ['PII', 'financial'], regions: ['EU', 'US'], complianceDomains: ['GDPR', 'SOC2'] },
      });
      setSimResult(resp?.data || resp);
    } catch (e: any) {
      setSimResult({ error: e.message });
    }
  };

  const statusColors: Record<string, string> = {
    draft: 'bg-slate-600', pending_review: 'bg-amber-600', approved: 'bg-blue-600',
    active: 'bg-emerald-600', deprecated: 'bg-orange-600', archived: 'bg-slate-700',
  };

  const statusIcons: Record<string, React.ElementType> = {
    draft: FileText, pending_review: Clock, approved: CheckCircle2,
    active: Zap, deprecated: AlertTriangle, archived: XCircle,
  };

  const domains = [...new Set([...templates.map((t) => t.domain), ...policies.map((p) => p.domain)])].filter(Boolean);

  const filteredTemplates = templates.filter(
    (t) => (!searchTerm || t.name.toLowerCase().includes(searchTerm.toLowerCase())) && (!domainFilter || t.domain === domainFilter)
  );

  const filteredPolicies = policies.filter(
    (p) => (!searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase())) && (!domainFilter || p.domain === domainFilter)
  );

  const tabs = [
    { id: 'templates' as const, label: 'Templates', count: templates.length },
    { id: 'policies' as const, label: 'Policies', count: policies.length },
    { id: 'audit' as const, label: 'Audit Trail', count: auditLog.length },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                Policy Authoring Studio
              </h1>
            </div>
            <p className="text-sm text-slate-400 ml-13">
              {templates.length} templates &middot; {policies.length} policies &middot; Full lifecycle governance
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 w-48"
              />
            </div>
            {domains.length > 0 && (
              <select
                value={domainFilter}
                onChange={(e) => setDomainFilter(e.target.value)}
                className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Domains</option>
                {domains.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            )}
            <button
              onClick={fetchData}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-slate-800/50 p-1 rounded-lg w-fit">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                tab === t.id ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {t.label}
              <span className="text-xs bg-slate-700/60 rounded-full px-2 py-0.5">{t.count}</span>
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
          </div>
        )}

        {!loading && (
          <AnimatePresence mode="wait">
            {/* Templates Tab */}
            {tab === 'templates' && (
              <motion.div key="tpl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTemplates.map((tpl, i) => (
                    <motion.div
                      key={tpl.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.02 }}
                      className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5 hover:border-purple-500/40 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm mb-1">{tpl.name}</h3>
                          <p className="text-xs text-slate-400 line-clamp-2">{tpl.description || 'Policy template'}</p>
                        </div>
                        <span className="text-xs bg-purple-600/20 text-purple-300 rounded px-2 py-0.5">{tpl.domain}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        {tpl.framework && <span className="text-xs bg-slate-700/60 rounded px-2 py-0.5">{tpl.framework}</span>}
                        <span className="text-xs text-slate-500">v{tpl.version}</span>
                      </div>
                      {tpl.tags && tpl.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {tpl.tags.slice(0, 4).map((tag) => (
                            <span key={tag} className="text-[10px] bg-slate-700/40 rounded px-1.5 py-0.5 text-slate-400">{tag}</span>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                  {filteredTemplates.length === 0 && (
                    <div className="col-span-3 text-center py-12 text-slate-500">No templates found.</div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Policies Tab */}
            {tab === 'policies' && (
              <motion.div key="pol" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="space-y-3">
                  {filteredPolicies.map((pol, i) => {
                    const StatusIcon = statusIcons[pol.status] || FileText;
                    const isExpanded = selectedPolicy === pol.id;
                    return (
                      <motion.div
                        key={pol.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.02 }}
                        className={`bg-slate-800/60 border rounded-xl transition-all ${
                          isExpanded ? 'border-purple-500 ring-1 ring-purple-500/20' : 'border-slate-700/50'
                        }`}
                      >
                        <div
                          className="flex items-center justify-between p-4 cursor-pointer"
                          onClick={() => {
                            setSelectedPolicy(isExpanded ? null : pol.id);
                            if (!isExpanded) fetchAudit(pol.id);
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <StatusIcon className="w-5 h-5 text-slate-400" />
                            <div>
                              <h3 className="font-semibold text-sm">{pol.name}</h3>
                              <p className="text-xs text-slate-400">{pol.domain} &middot; v{pol.version} &middot; {pol.severity}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`text-xs text-white rounded-full px-2.5 py-0.5 ${statusColors[pol.status] || 'bg-slate-600'}`}>
                              {pol.status.replace('_', ' ')}
                            </span>
                            <ChevronRight className={`w-4 h-4 text-slate-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                          </div>
                        </div>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 pb-4 border-t border-slate-700/50 pt-3">
                                <div className="flex gap-2 mb-4">
                                  <button
                                    onClick={() => simulatePolicy(pol.id)}
                                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/40 border border-emerald-500/30 transition-colors"
                                  >
                                    <Play className="w-3 h-3" /> Simulate
                                  </button>
                                  <button
                                    onClick={() => fetchAudit(pol.id)}
                                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-300 hover:bg-blue-600/40 border border-blue-500/30 transition-colors"
                                  >
                                    <History className="w-3 h-3" /> Audit Trail
                                  </button>
                                </div>

                                {simResult && (
                                  <div className="bg-slate-900 rounded-lg p-3 mb-3">
                                    <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider">Simulation Result</p>
                                    <pre className="text-xs text-slate-300 whitespace-pre-wrap overflow-auto max-h-40">
                                      {JSON.stringify(simResult, null, 2)}
                                    </pre>
                                  </div>
                                )}

                                {auditLog.length > 0 && (
                                  <div className="space-y-2">
                                    <p className="text-xs text-slate-500 uppercase tracking-wider">Recent Audit</p>
                                    {auditLog.slice(0, 5).map((entry: any, idx: number) => (
                                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/60 rounded-lg px-3 py-2">
                                        <Clock className="w-3 h-3" />
                                        <span className="font-medium text-slate-300">{entry.action || entry.type}</span>
                                        <span className="text-slate-500">&middot;</span>
                                        <span>{entry.performedBy || entry.userId || 'system'}</span>
                                        <span className="ml-auto text-slate-500">{entry.timestamp ? new Date(entry.timestamp).toLocaleString() : ''}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                  {filteredPolicies.length === 0 && (
                    <div className="text-center py-12 text-slate-500">No policies found. Create one from a template.</div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Audit Tab */}
            {tab === 'audit' && (
              <motion.div key="audit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {auditLog.length > 0 ? (
                  <div className="space-y-2">
                    {auditLog.map((entry: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-3 bg-slate-800/60 border border-slate-700/50 rounded-lg px-4 py-3">
                        <History className="w-4 h-4 text-slate-500" />
                        <div className="flex-1">
                          <span className="text-sm font-medium">{entry.action || entry.type}</span>
                          <span className="text-xs text-slate-500 ml-2">{entry.policyId || ''}</span>
                        </div>
                        <span className="text-xs text-slate-400">{entry.performedBy || 'system'}</span>
                        <span className="text-xs text-slate-500">{entry.timestamp ? new Date(entry.timestamp).toLocaleString() : ''}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-500">
                    Select a policy above to view its audit trail, or click a policy in the Policies tab.
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
