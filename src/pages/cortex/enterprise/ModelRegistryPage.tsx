/**
 * AI Model Registry & Lifecycle Page
 *
 * Deep-dive management for AI model registration, versioning,
 * compliance reviews, and lifecycle tracking.
 *
 * @module pages/cortex/enterprise/ModelRegistryPage
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, RefreshCw, Plus, Loader2, CheckCircle2, Clock,
  AlertTriangle, XCircle, ChevronRight, Search, Filter,
  GitBranch, Shield, Activity, BarChart3, Eye,
} from 'lucide-react';
import apiClient from '../../../lib/api/client';

// =============================================================================
// TYPES
// =============================================================================

interface AIModel {
  id: string;
  name: string;
  description?: string;
  type: string;
  framework: string;
  version: string;
  status: string;
  owner: string;
  riskLevel?: string;
  complianceStatus?: string;
  lastUpdated?: string;
  createdAt: string;
  metrics?: Record<string, any>;
  tags?: string[];
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function ModelRegistryPage() {
  const [models, setModels] = useState<AIModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [modelDetail, setModelDetail] = useState<any>(null);

  const fetchModels = useCallback(async () => {
    setLoading(true);
    try {
      const resp: any = await apiClient.api.get('/model-registry/models');
      setModels(resp?.data?.models || resp?.models || []);
    } catch {
      setModels([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchModels(); }, [fetchModels]);

  const fetchModelDetail = async (id: string) => {
    try {
      const resp: any = await apiClient.api.get(`/model-registry/models/${id}`);
      setModelDetail(resp?.data?.model || resp?.model || resp?.data || null);
    } catch {
      setModelDetail(null);
    }
  };

  const statusColors: Record<string, string> = {
    registered: 'bg-blue-600', training: 'bg-amber-600', validating: 'bg-purple-600',
    approved: 'bg-emerald-600', deployed: 'bg-green-600', monitoring: 'bg-cyan-600',
    retired: 'bg-slate-600', rejected: 'bg-red-600',
  };

  const riskColors: Record<string, string> = {
    low: 'text-emerald-400', medium: 'text-amber-400', high: 'text-orange-400', critical: 'text-red-400',
  };

  const filtered = models.filter(
    (m) => !searchTerm || m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: models.length,
    deployed: models.filter((m) => m.status === 'deployed' || m.status === 'monitoring').length,
    pending: models.filter((m) => ['registered', 'training', 'validating'].includes(m.status)).length,
    highRisk: models.filter((m) => m.riskLevel === 'high' || m.riskLevel === 'critical').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                AI Model Registry & Lifecycle
              </h1>
            </div>
            <p className="text-sm text-slate-400 ml-13">
              {stats.total} models &middot; {stats.deployed} deployed &middot; {stats.pending} in pipeline
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search models..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 w-48"
              />
            </div>
            <button onClick={fetchModels} disabled={loading} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm transition-colors">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Models', value: stats.total, icon: Brain, color: 'cyan' },
            { label: 'Deployed', value: stats.deployed, icon: CheckCircle2, color: 'emerald' },
            { label: 'In Pipeline', value: stats.pending, icon: Clock, color: 'amber' },
            { label: 'High Risk', value: stats.highRisk, icon: AlertTriangle, color: 'red' },
          ].map((s) => (
            <div key={s.label} className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">{s.label}</p>
                  <p className="text-2xl font-bold mt-1">{s.value}</p>
                </div>
                <s.icon className={`w-8 h-8 text-${s.color}-400 opacity-60`} />
              </div>
            </div>
          ))}
        </div>

        {/* Model List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((model, i) => {
              const isExpanded = selectedModel === model.id;
              return (
                <motion.div
                  key={model.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className={`bg-slate-800/60 border rounded-xl transition-all ${
                    isExpanded ? 'border-cyan-500 ring-1 ring-cyan-500/20' : 'border-slate-700/50'
                  }`}
                >
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer"
                    onClick={() => {
                      setSelectedModel(isExpanded ? null : model.id);
                      if (!isExpanded) fetchModelDetail(model.id);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <Brain className="w-5 h-5 text-cyan-400" />
                      <div>
                        <h3 className="font-semibold text-sm">{model.name}</h3>
                        <p className="text-xs text-slate-400">
                          {model.type} &middot; {model.framework} &middot; v{model.version} &middot; {model.owner}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {model.riskLevel && (
                        <span className={`text-xs font-medium ${riskColors[model.riskLevel] || 'text-slate-400'}`}>
                          {model.riskLevel} risk
                        </span>
                      )}
                      <span className={`text-xs text-white rounded-full px-2.5 py-0.5 ${statusColors[model.status] || 'bg-slate-600'}`}>
                        {model.status}
                      </span>
                      <ChevronRight className={`w-4 h-4 text-slate-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && modelDetail && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 border-t border-slate-700/50 pt-3">
                          {modelDetail.description && <p className="text-sm text-slate-300 mb-3">{modelDetail.description}</p>}
                          {modelDetail.metrics && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {Object.entries(modelDetail.metrics).map(([k, v]) => (
                                <span key={k} className="text-xs bg-slate-700/60 rounded px-2 py-0.5 text-slate-300">
                                  {k}: <strong>{String(v)}</strong>
                                </span>
                              ))}
                            </div>
                          )}
                          {modelDetail.tags && modelDetail.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {modelDetail.tags.map((tag: string) => (
                                <span key={tag} className="text-[10px] bg-cyan-600/20 text-cyan-300 rounded px-1.5 py-0.5">{tag}</span>
                              ))}
                            </div>
                          )}
                          <pre className="text-xs text-slate-400 bg-slate-900 rounded-lg p-3 mt-3 overflow-auto max-h-40 whitespace-pre-wrap">
                            {JSON.stringify(modelDetail, null, 2)}
                          </pre>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
            {filtered.length === 0 && (
              <div className="text-center py-12 text-slate-500">No models found. Register a new AI model to get started.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
