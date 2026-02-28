// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * CendiaSymbiont™ - Partnership & Ecosystem Engine
 * "The ecosystem strategist."
 */

import React, { useState, useEffect } from 'react';
import apiClient from '../../lib/api/client';
import {
  Network,
  Building2,
  Link2,
  TrendingUp,
  Target,
  Users,
  Zap,
  Info,
  Database,
  FileText,
  Play,
  Upload,
  Download,
  Search,
  Filter,
  Star,
  ArrowUpRight,
  RefreshCw,
} from 'lucide-react';

// Opportunity priority levels
const PRIORITY_LEVELS = [
  { value: 'HIGH', label: 'High Priority', color: 'text-red-400 bg-red-500/20' },
  { value: 'MEDIUM', label: 'Medium', color: 'text-amber-400 bg-amber-500/20' },
  { value: 'LOW', label: 'Low', color: 'text-blue-400 bg-blue-500/20' },
];

interface Entity {
  id: string;
  entityType: string;
  name: string;
  description?: string;
  domain?: string;
  financialHealth?: number;
  reputationScore?: number;
}

interface Opportunity {
  id: string;
  entityId?: string;
  opportunityType: string;
  title: string;
  description: string;
  strategicFit: number;
  riskScore: number;
  status: string;
  estimatedValue?: number;
}

interface Dashboard {
  totalEntities: number;
  entitiesByType: Record<string, number>;
  activeOpportunities: number;
  healthyRelationships: number;
  avgRelationshipHealth: number;
}

// Starter library templates
const STARTER_TEMPLATES = [
  {
    id: 'vendors',
    name: 'Common Vendors',
    icon: '🏢',
    count: 15,
    description: 'Cloud, SaaS, infrastructure',
  },
  {
    id: 'partners',
    name: 'Partnership Types',
    icon: '🤝',
    count: 8,
    description: 'Channel, tech, strategic',
  },
  {
    id: 'competitors',
    name: 'Competitor Framework',
    icon: '🎯',
    count: 5,
    description: 'Direct, indirect, emerging',
  },
  {
    id: 'investors',
    name: 'Investor Categories',
    icon: '💰',
    count: 6,
    description: 'VC, PE, strategic, angel',
  },
];

// Opportunity detection signals explanation
const OPPORTUNITY_SIGNALS = [
  {
    source: 'Contracts',
    icon: '📝',
    description: 'Renewal dates, spend changes, term modifications',
  },
  { source: 'CRM', icon: '📊', description: 'Deal pipeline, relationship health, engagement' },
  {
    source: 'News & PR',
    icon: '📰',
    description: 'M&A activity, leadership changes, funding rounds',
  },
  {
    source: 'Market Data',
    icon: '📈',
    description: 'Competitor moves, industry trends, market shifts',
  },
  {
    source: 'Internal Signals',
    icon: '📡',
    description: 'Usage patterns, support tickets, NPS feedback',
  },
];

export const SymbiontPage: React.FC = () => {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddEntity, setShowAddEntity] = useState(false);
  const [showOpportunityExplainer, setShowOpportunityExplainer] = useState(false);
  const [newEntity, setNewEntity] = useState({
    name: '',
    entityType: 'PARTNER',
    domain: '',
    description: '',
  });

  // New state for filters and import/export
  const [entitySearch, setEntitySearch] = useState('');
  const [entityTypeFilter, setEntityTypeFilter] = useState('ALL');
  const [opportunityFilter, setOpportunityFilter] = useState('ALL');
  const [showImportModal, setShowImportModal] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  // Filtered entities
  const filteredEntities = entities.filter((e) => {
    const matchesSearch =
      entitySearch === '' ||
      e.name.toLowerCase().includes(entitySearch.toLowerCase()) ||
      e.domain?.toLowerCase().includes(entitySearch.toLowerCase());
    const matchesType = entityTypeFilter === 'ALL' || e.entityType === entityTypeFilter;
    return matchesSearch && matchesType;
  });

  // Filtered opportunities with scoring
  const scoredOpportunities = opportunities
    .map((o) => ({
      ...o,
      priority:
        o.estimatedValue && o.estimatedValue > 500000
          ? 'HIGH'
          : o.estimatedValue && o.estimatedValue > 100000
            ? 'MEDIUM'
            : 'LOW',
    }))
    .filter((o) => opportunityFilter === 'ALL' || o.priority === opportunityFilter);

  // Auto-scan all entities
  const runAutoScan = async () => {
    setIsScanning(true);
    try {
      for (const entity of entities) {
        await detectOpportunities(entity.id);
      }
    } finally {
      setIsScanning(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [entRes, oppRes, dashRes] = await Promise.all([
        apiClient.api.get<{ data: Entity[] }>('/symbiont/entities'),
        apiClient.api.get<{ data: Opportunity[] }>('/symbiont/opportunities'),
        apiClient.api.get<{ data: Dashboard }>('/symbiont/dashboard'),
      ]);
      if (entRes.success) {
        setEntities((entRes.data as any)?.data || entRes.data || []);
      }
      if (oppRes.success) {
        setOpportunities((oppRes.data as any)?.data || oppRes.data || []);
      }
      if (dashRes.success) {
        setDashboard((dashRes.data as any)?.data || dashRes.data || null);
      }
    } catch (error) {
      console.error('Failed to load Symbiont data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addEntity = async () => {
    try {
      await apiClient.api.post('/symbiont/entities', newEntity);
      setShowAddEntity(false);
      setNewEntity({ name: '', entityType: 'PARTNER', domain: '', description: '' });
      await loadData();
    } catch (error) {
      console.error('Add entity failed:', error);
    }
  };

  const detectOpportunities = async (entityId: string) => {
    try {
      await apiClient.api.post(`/symbiont/entities/${entityId}/opportunities`);
      await loadData();
    } catch (error) {
      console.error('Opportunity detection failed:', error);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'PARTNER':
        return <Link2 className="w-4 h-4 text-emerald-400" />;
      case 'VENDOR':
        return <Building2 className="w-4 h-4 text-blue-400" />;
      case 'COMPETITOR':
        return <Target className="w-4 h-4 text-red-400" />;
      case 'CUSTOMER':
        return <Users className="w-4 h-4 text-purple-400" />;
      default:
        return <Network className="w-4 h-4 text-slate-400" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        Loading Symbiont...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Network className="w-10 h-10 text-purple-400" />
            <div>
              <h1 className="text-3xl font-bold">CendiaSymbiont™</h1>
              <p className="text-slate-400">
                Partnership & Ecosystem Engine - "The ecosystem strategist."
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/cortex/council?context=partnership"
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-sm font-medium flex items-center gap-2"
            >
              <Play className="w-4 h-4" /> Deliberate in Council
            </a>
            <button
              onClick={() => {
                const reportData = {
                  generated: new Date().toISOString(),
                  entities: entities,
                  opportunities: scoredOpportunities,
                  dashboard,
                };
                const blob = new Blob([JSON.stringify(reportData, null, 2)], {
                  type: 'application/json',
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `symbiont-ecosystem-report-${new Date().toISOString().split('T')[0]}.json`;
                a.click();
              }}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Export Ecosystem
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Stats */}
      {dashboard && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Building2 className="w-4 h-4" /> Entities
            </div>
            <div className="text-3xl font-bold">{dashboard.totalEntities}</div>
          </div>
          <button
            onClick={() => setShowOpportunityExplainer(true)}
            className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-purple-500/50 transition-all text-left"
          >
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Zap className="w-4 h-4" /> Active Opportunities <Info className="w-3 h-3" />
            </div>
            <div className="text-3xl font-bold text-purple-400">
              {dashboard.activeOpportunities}
            </div>
            <div className="text-xs text-purple-400/60 mt-1">How we detect →</div>
          </button>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Link2 className="w-4 h-4" /> Healthy Relations
            </div>
            <div className="text-3xl font-bold text-emerald-400">
              {dashboard.healthyRelationships}
            </div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <TrendingUp className="w-4 h-4" /> Avg Health
            </div>
            <div className="text-3xl font-bold">{dashboard.avgRelationshipHealth}%</div>
          </div>
        </div>
      )}

      {/* Ecosystem Map Preview */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Network className="w-5 h-5 text-purple-400" /> Ecosystem Map
            </h2>
            <p className="text-sm text-slate-400">
              Visual representation of your ecosystem relationships
            </p>
          </div>
          <button className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm font-medium">
            Open Full Map
          </button>
        </div>
        {entities.length === 0 ? (
          <div className="relative h-64 bg-slate-900/50 rounded-lg border border-dashed border-slate-600 flex items-center justify-center">
            <div className="text-center">
              <Network className="w-12 h-12 mx-auto mb-3 text-slate-600" />
              <p className="text-slate-500 mb-4">Add entities to see your ecosystem map</p>
              <div className="flex flex-wrap justify-center gap-2">
                {STARTER_TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs flex items-center gap-2"
                  >
                    <span>{t.icon}</span>
                    <span>{t.name}</span>
                    <span className="text-slate-500">({t.count})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="relative h-64 bg-slate-900/50 rounded-lg">
            {/* Simple ecosystem visualization */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Center node (Your Company) */}
                <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold z-10 relative">
                  You
                </div>
                {/* Entity nodes around */}
                {entities.slice(0, 6).map((e, i) => {
                  const angle = i * 60 * (Math.PI / 180);
                  const x = Math.cos(angle) * 100;
                  const y = Math.sin(angle) * 80;
                  return (
                    <div
                      key={e.id}
                      className="absolute w-12 h-12 rounded-full flex items-center justify-center text-xs font-medium border-2"
                      style={{
                        left: `calc(50% + ${x}px - 24px)`,
                        top: `calc(50% + ${y}px - 24px)`,
                        backgroundColor:
                          e.entityType === 'PARTNER'
                            ? 'rgba(16, 185, 129, 0.2)'
                            : e.entityType === 'VENDOR'
                              ? 'rgba(59, 130, 246, 0.2)'
                              : e.entityType === 'COMPETITOR'
                                ? 'rgba(239, 68, 68, 0.2)'
                                : 'rgba(168, 85, 247, 0.2)',
                        borderColor:
                          e.entityType === 'PARTNER'
                            ? 'rgb(16, 185, 129)'
                            : e.entityType === 'VENDOR'
                              ? 'rgb(59, 130, 246)'
                              : e.entityType === 'COMPETITOR'
                                ? 'rgb(239, 68, 68)'
                                : 'rgb(168, 85, 247)',
                      }}
                    >
                      {e.name.substring(0, 2).toUpperCase()}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="absolute bottom-3 right-3 flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Partners
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span> Vendors
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500"></span> Competitors
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-purple-500"></span> Others
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Import/Export Bar */}
      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowImportModal(true)}
              className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm flex items-center gap-2"
            >
              <Upload className="w-4 h-4" /> Import Entities
            </button>
            <button className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm flex items-center gap-2">
              <Download className="w-4 h-4" /> Export CSV
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={runAutoScan}
              disabled={isScanning || entities.length === 0}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
              {isScanning ? 'Scanning...' : 'Auto-Scan All'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Entities */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Ecosystem Entities</h2>
            <button
              onClick={() => setShowAddEntity(true)}
              className="px-3 py-1 bg-purple-600 hover:bg-purple-500 rounded text-sm"
            >
              + Add Entity
            </button>
          </div>

          {/* Search & Filter */}
          {entities.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={entitySearch}
                  onChange={(e) => setEntitySearch(e.target.value)}
                  placeholder="Search entities..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm placeholder-slate-500"
                />
              </div>
              <select
                value={entityTypeFilter}
                onChange={(e) => setEntityTypeFilter(e.target.value)}
                className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm"
              >
                <option value="ALL">All Types</option>
                <option value="PARTNER">Partners</option>
                <option value="VENDOR">Vendors</option>
                <option value="COMPETITOR">Competitors</option>
                <option value="CUSTOMER">Customers</option>
              </select>
            </div>
          )}
          {entities.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="w-12 h-12 mx-auto mb-3 text-purple-400 opacity-50" />
              <h3 className="text-lg font-semibold text-white mb-2">Build Your Ecosystem</h3>
              <p className="text-slate-400 mb-4 text-sm">
                Start with a template or add entities manually
              </p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {STARTER_TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    className="p-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-left text-sm"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span>{t.icon}</span>
                      <span className="font-medium">{t.name}</span>
                    </div>
                    <div className="text-xs text-slate-400">{t.description}</div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowAddEntity(true)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm"
              >
                + Add Custom Entity
              </button>
            </div>
          ) : filteredEntities.length === 0 ? (
            <div className="text-center py-8 text-slate-500">No entities match your search</div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredEntities.map((e) => (
                <div
                  key={e.id}
                  className="p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-2">
                    {getTypeIcon(e.entityType)}
                    <span className="font-medium">{e.name}</span>
                    <span className="text-xs px-2 py-0.5 bg-slate-600 rounded">{e.entityType}</span>
                  </div>
                  {e.domain && <div className="text-sm text-slate-400 mb-2">{e.domain}</div>}
                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-2">
                    <span>Health: {e.financialHealth || 50}%</span>
                    <span>Reputation: {e.reputationScore || 50}%</span>
                  </div>
                  <button
                    onClick={() => detectOpportunities(e.id)}
                    className="w-full px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded text-xs"
                  >
                    Detect Opportunities
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Opportunities */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Detected Opportunities</h2>
            <button
              onClick={() => setShowOpportunityExplainer(true)}
              className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              <Info className="w-3 h-3" /> How we detect
            </button>
          </div>

          {/* Priority Filter */}
          {opportunities.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-4 h-4 text-slate-500" />
              <div className="flex items-center gap-1 bg-slate-700 rounded-lg p-0.5">
                <button
                  onClick={() => setOpportunityFilter('ALL')}
                  className={`px-3 py-1 rounded text-xs ${opportunityFilter === 'ALL' ? 'bg-purple-600 text-white' : 'text-slate-400'}`}
                >
                  All
                </button>
                {PRIORITY_LEVELS.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => setOpportunityFilter(p.value)}
                    className={`px-3 py-1 rounded text-xs flex items-center gap-1 ${opportunityFilter === p.value ? 'bg-purple-600 text-white' : 'text-slate-400'}`}
                  >
                    <Star className="w-3 h-3" /> {p.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {opportunities.length === 0 ? (
            <div className="text-center py-12">
              <Zap className="w-12 h-12 mx-auto mb-3 text-purple-400 opacity-50" />
              <p className="text-slate-400 mb-4 text-sm">
                Add entities and connect data sources to detect opportunities
              </p>
              <button
                onClick={() => setShowOpportunityExplainer(true)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm"
              >
                See What Signals We Track →
              </button>
            </div>
          ) : scoredOpportunities.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              No opportunities match this priority filter
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {scoredOpportunities.map((o) => (
                <div
                  key={o.id}
                  className="p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 bg-purple-900/50 text-purple-300 rounded">
                        {o.opportunityType.replace(/_/g, ' ')}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded flex items-center gap-1 ${
                          o.priority === 'HIGH'
                            ? 'bg-red-500/20 text-red-300'
                            : o.priority === 'MEDIUM'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-blue-500/20 text-blue-300'
                        }`}
                      >
                        <Star className="w-3 h-3" /> {o.priority}
                      </span>
                    </div>
                    <span className="text-xs px-2 py-0.5 bg-slate-600 rounded">{o.status}</span>
                  </div>
                  <div className="font-medium mb-1">{o.title}</div>
                  <div className="text-sm text-slate-400 mb-2">
                    {o.description?.substring(0, 80)}...
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-emerald-400">Fit: {o.strategicFit}%</span>
                      <span className="text-red-400">Risk: {o.riskScore}%</span>
                      {o.estimatedValue && (
                        <span className="text-purple-400">
                          ${(o.estimatedValue / 1000).toFixed(0)}K
                        </span>
                      )}
                    </div>
                    <button className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1">
                      <ArrowUpRight className="w-3 h-3" /> Pursue
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Entity Modal */}
      {showAddEntity && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md border border-slate-700">
            <h3 className="text-xl font-semibold mb-4">Add Ecosystem Entity</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Type</label>
                <select
                  value={newEntity.entityType}
                  onChange={(e) => setNewEntity({ ...newEntity, entityType: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2"
                >
                  <option value="PARTNER">Partner</option>
                  <option value="VENDOR">Vendor</option>
                  <option value="COMPETITOR">Competitor</option>
                  <option value="CUSTOMER">Customer</option>
                  <option value="INVESTOR">Investor</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Name</label>
                <input
                  value={newEntity.name}
                  onChange={(e) => setNewEntity({ ...newEntity, name: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2"
                  placeholder="Organization name"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Domain/Industry</label>
                <input
                  value={newEntity.domain}
                  onChange={(e) => setNewEntity({ ...newEntity, domain: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2"
                  placeholder="e.g., Technology, Finance"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddEntity(false)}
                className="flex-1 px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded"
              >
                Cancel
              </button>
              <button
                onClick={addEntity}
                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded"
              >
                Add Entity
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Opportunity Detection Explainer Modal */}
      {showOpportunityExplainer && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setShowOpportunityExplainer(false)}
        >
          <div
            className="bg-slate-800 rounded-xl p-6 w-full max-w-2xl border border-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold">How Opportunity Detection Works</h3>
                <p className="text-sm text-slate-400">
                  CendiaSymbiont™ monitors multiple signals to surface opportunities
                </p>
              </div>
              <button
                onClick={() => setShowOpportunityExplainer(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 mb-6">
              {OPPORTUNITY_SIGNALS.map((signal) => (
                <div
                  key={signal.source}
                  className="flex items-center gap-4 p-4 bg-slate-700/50 rounded-lg"
                >
                  <span className="text-2xl">{signal.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium">{signal.source}</div>
                    <div className="text-sm text-slate-400">{signal.description}</div>
                  </div>
                  <span className="px-2 py-0.5 bg-slate-600 rounded text-xs text-slate-300">
                    Connected
                  </span>
                </div>
              ))}
            </div>

            <div className="p-4 bg-purple-900/20 border border-purple-500/30 rounded-lg">
              <h4 className="font-medium text-purple-300 mb-2">AI-Powered Analysis</h4>
              <p className="text-sm text-slate-300">
                Our AI cross-references these signals against your strategic goals, market
                conditions, and historical patterns to surface the highest-value opportunities.
              </p>
            </div>

            <div className="mt-6 flex gap-3">
              <button className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg font-medium flex items-center justify-center gap-2">
                <Database className="w-4 h-4" /> Connect Data Sources
              </button>
              <button
                onClick={() => setShowOpportunityExplainer(false)}
                className="px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setShowImportModal(false)}
        >
          <div
            className="bg-slate-800 rounded-xl p-6 w-full max-w-lg border border-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Upload className="w-5 h-5 text-purple-400" /> Import Entities
                </h3>
                <p className="text-sm text-slate-400">
                  Bulk import ecosystem entities from file or CRM
                </p>
              </div>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Import Options */}
            <div className="space-y-3 mb-6">
              <button className="w-full p-4 bg-slate-700 hover:bg-slate-600 rounded-lg text-left transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">CSV File</div>
                    <div className="text-xs text-slate-400">
                      Upload a CSV with Name, Type, Domain columns
                    </div>
                  </div>
                </div>
              </button>
              <button className="w-full p-4 bg-slate-700 hover:bg-slate-600 rounded-lg text-left transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Database className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Salesforce CRM</div>
                    <div className="text-xs text-slate-400">
                      Import accounts and partners from Salesforce
                    </div>
                  </div>
                </div>
              </button>
              <button className="w-full p-4 bg-slate-700 hover:bg-slate-600 rounded-lg text-left transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                    <Database className="w-5 h-5 text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">HubSpot CRM</div>
                    <div className="text-xs text-slate-400">Import companies from HubSpot</div>
                  </div>
                </div>
              </button>
              <button className="w-full p-4 bg-slate-700 hover:bg-slate-600 rounded-lg text-left transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">JSON File</div>
                    <div className="text-xs text-slate-400">
                      Import structured entity data from JSON
                    </div>
                  </div>
                </div>
              </button>
            </div>

            {/* Drop Zone */}
            <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center mb-4">
              <Upload className="w-8 h-8 mx-auto mb-2 text-slate-500" />
              <p className="text-slate-400 text-sm">
                Drag and drop a file here, or click to browse
              </p>
              <p className="text-slate-500 text-xs mt-1">Supports CSV, JSON up to 10MB</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowImportModal(false)}
                className="flex-1 px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg font-medium">
                Import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SymbiontPage;
