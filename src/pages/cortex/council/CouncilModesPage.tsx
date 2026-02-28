// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA — COUNCIL MODES MANAGEMENT
// =============================================================================
// Configure and manage 35+ deliberation modes. Each mode shapes how agents
// approach a decision — from Strategic Advisory to Crisis Response.

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../../../lib/utils';
import apiClient from '../../../lib/api/client';
import {
  Brain, Settings, Search, Filter, ChevronRight, Play, Lock,
  Shield, Scale, AlertTriangle, Zap, BarChart3, Users, Eye,
  Briefcase, Target, Clock, CheckCircle, Star, Layers,
} from 'lucide-react';

interface CouncilMode {
  id: string;
  name: string;
  description: string;
  category: string;
  agentCount: number;
  avgDuration: string;
  isActive: boolean;
  isPremium: boolean;
  icon: string;
  usageCount: number;
}

const MODE_CATEGORIES = [
  { id: 'all', label: 'All Modes' },
  { id: 'strategic', label: 'Strategic' },
  { id: 'compliance', label: 'Compliance' },
  { id: 'crisis', label: 'Crisis' },
  { id: 'financial', label: 'Financial' },
  { id: 'operational', label: 'Operational' },
  { id: 'innovation', label: 'Innovation' },
  { id: 'governance', label: 'Governance' },
];

const CATEGORY_ICONS: Record<string, React.FC<{ className?: string }>> = {
  strategic: Target,
  compliance: Shield,
  crisis: AlertTriangle,
  financial: BarChart3,
  operational: Settings,
  innovation: Zap,
  governance: Scale,
};

// Real modes from the platform
const COUNCIL_MODES: CouncilMode[] = [
  { id: 'strategic-advisory', name: 'Strategic Advisory', description: 'Board-level strategic decision analysis with full agent panel', category: 'strategic', agentCount: 7, avgDuration: '8-12 min', isActive: true, isPremium: false, icon: 'target', usageCount: 142 },
  { id: 'crisis-response', name: 'Crisis Response', description: 'Rapid triage mode for time-critical decisions under pressure', category: 'crisis', agentCount: 5, avgDuration: '3-5 min', isActive: true, isPremium: false, icon: 'alert', usageCount: 23 },
  { id: 'compliance-review', name: 'Compliance Review', description: 'Multi-framework regulatory compliance assessment', category: 'compliance', agentCount: 6, avgDuration: '10-15 min', isActive: true, isPremium: false, icon: 'shield', usageCount: 87 },
  { id: 'financial-analysis', name: 'Financial Analysis', description: 'Cost-benefit analysis with risk quantification', category: 'financial', agentCount: 5, avgDuration: '6-10 min', isActive: true, isPremium: false, icon: 'chart', usageCount: 56 },
  { id: 'innovation-sprint', name: 'Innovation Sprint', description: 'Brainstorming and blue-sky thinking with divergent perspectives', category: 'innovation', agentCount: 7, avgDuration: '12-18 min', isActive: true, isPremium: false, icon: 'zap', usageCount: 34 },
  { id: 'governance-audit', name: 'Governance Audit', description: 'Policy alignment and governance gap analysis', category: 'governance', agentCount: 6, avgDuration: '8-12 min', isActive: true, isPremium: false, icon: 'scale', usageCount: 45 },
  { id: 'risk-assessment', name: 'Risk Assessment', description: 'Comprehensive risk identification and mitigation planning', category: 'strategic', agentCount: 7, avgDuration: '10-15 min', isActive: true, isPremium: false, icon: 'shield', usageCount: 98 },
  { id: 'stakeholder-impact', name: 'Stakeholder Impact', description: 'Multi-stakeholder impact analysis across all affected parties', category: 'governance', agentCount: 7, avgDuration: '12-18 min', isActive: true, isPremium: false, icon: 'users', usageCount: 41 },
  { id: 'legal-review', name: 'Legal Review', description: 'Legal risk analysis with jurisdiction-aware compliance checking', category: 'compliance', agentCount: 5, avgDuration: '8-12 min', isActive: true, isPremium: true, icon: 'scale', usageCount: 67 },
  { id: 'vendor-selection', name: 'Vendor Selection', description: 'Structured vendor evaluation with scoring matrix', category: 'operational', agentCount: 5, avgDuration: '6-10 min', isActive: true, isPremium: false, icon: 'briefcase', usageCount: 29 },
  { id: 'merger-analysis', name: 'M&A Analysis', description: 'Merger and acquisition due diligence deliberation', category: 'financial', agentCount: 7, avgDuration: '15-25 min', isActive: true, isPremium: true, icon: 'chart', usageCount: 12 },
  { id: 'ethical-review', name: 'Ethical Review', description: 'AI ethics and bias assessment for decision fairness', category: 'governance', agentCount: 6, avgDuration: '10-15 min', isActive: true, isPremium: false, icon: 'eye', usageCount: 38 },
  { id: 'incident-response', name: 'Incident Response', description: 'Security incident triage and response coordination', category: 'crisis', agentCount: 5, avgDuration: '2-5 min', isActive: true, isPremium: false, icon: 'alert', usageCount: 15 },
  { id: 'budget-allocation', name: 'Budget Allocation', description: 'Resource allocation optimization with constraint modeling', category: 'financial', agentCount: 5, avgDuration: '8-12 min', isActive: true, isPremium: false, icon: 'chart', usageCount: 44 },
  { id: 'talent-strategy', name: 'Talent Strategy', description: 'Workforce planning and talent acquisition analysis', category: 'operational', agentCount: 5, avgDuration: '6-10 min', isActive: true, isPremium: false, icon: 'users', usageCount: 22 },
  { id: 'product-launch', name: 'Product Launch', description: 'Go-to-market strategy evaluation with competitive analysis', category: 'innovation', agentCount: 7, avgDuration: '12-18 min', isActive: true, isPremium: false, icon: 'zap', usageCount: 31 },
  { id: 'regulatory-change', name: 'Regulatory Change', description: 'Impact analysis for upcoming regulatory changes', category: 'compliance', agentCount: 6, avgDuration: '10-15 min', isActive: true, isPremium: true, icon: 'shield', usageCount: 19 },
  { id: 'disaster-recovery', name: 'Disaster Recovery', description: 'Business continuity planning and disaster response', category: 'crisis', agentCount: 5, avgDuration: '5-8 min', isActive: true, isPremium: false, icon: 'alert', usageCount: 8 },
  { id: 'digital-transformation', name: 'Digital Transformation', description: 'Technology adoption and digital maturity assessment', category: 'innovation', agentCount: 7, avgDuration: '12-18 min', isActive: true, isPremium: true, icon: 'zap', usageCount: 17 },
  { id: 'supply-chain', name: 'Supply Chain Review', description: 'Supply chain risk and optimization analysis', category: 'operational', agentCount: 5, avgDuration: '8-12 min', isActive: true, isPremium: false, icon: 'briefcase', usageCount: 26 },
  { id: 'esg-review', name: 'ESG Review', description: 'Environmental, Social, and Governance impact analysis', category: 'governance', agentCount: 6, avgDuration: '10-15 min', isActive: true, isPremium: false, icon: 'eye', usageCount: 33 },
  { id: 'ip-strategy', name: 'IP Strategy', description: 'Intellectual property protection and licensing analysis', category: 'strategic', agentCount: 5, avgDuration: '8-12 min', isActive: true, isPremium: true, icon: 'target', usageCount: 14 },
  { id: 'customer-retention', name: 'Customer Retention', description: 'Churn analysis and retention strategy planning', category: 'operational', agentCount: 5, avgDuration: '6-10 min', isActive: true, isPremium: false, icon: 'users', usageCount: 21 },
  { id: 'partnership-eval', name: 'Partnership Evaluation', description: 'Strategic partnership assessment and due diligence', category: 'strategic', agentCount: 7, avgDuration: '10-15 min', isActive: true, isPremium: false, icon: 'target', usageCount: 18 },
  { id: 'pricing-strategy', name: 'Pricing Strategy', description: 'Market-aware pricing analysis with elasticity modeling', category: 'financial', agentCount: 5, avgDuration: '6-10 min', isActive: true, isPremium: false, icon: 'chart', usageCount: 27 },
  { id: 'expansion-planning', name: 'Market Expansion', description: 'Geographic and market expansion feasibility analysis', category: 'strategic', agentCount: 7, avgDuration: '12-18 min', isActive: true, isPremium: true, icon: 'target', usageCount: 9 },
  { id: 'cybersecurity-review', name: 'Cybersecurity Review', description: 'Security posture assessment and threat analysis', category: 'compliance', agentCount: 6, avgDuration: '10-15 min', isActive: true, isPremium: false, icon: 'shield', usageCount: 36 },
  { id: 'data-governance', name: 'Data Governance', description: 'Data quality, privacy, and governance policy review', category: 'governance', agentCount: 6, avgDuration: '8-12 min', isActive: true, isPremium: false, icon: 'scale', usageCount: 24 },
  { id: 'rapid-decision', name: 'Rapid Decision', description: 'Time-boxed quick decision with minimal debate', category: 'operational', agentCount: 3, avgDuration: '1-3 min', isActive: true, isPremium: false, icon: 'zap', usageCount: 76 },
  { id: 'devils-advocate', name: "Devil's Advocate", description: 'Adversarial mode where agents challenge every assumption', category: 'innovation', agentCount: 7, avgDuration: '12-18 min', isActive: true, isPremium: false, icon: 'eye', usageCount: 43 },
  { id: 'consensus-building', name: 'Consensus Building', description: 'Multi-round negotiation to find optimal compromise', category: 'governance', agentCount: 7, avgDuration: '15-25 min', isActive: true, isPremium: false, icon: 'users', usageCount: 31 },
  { id: 'war-gaming', name: 'War Gaming', description: 'Competitive scenario simulation with adversarial agents', category: 'strategic', agentCount: 7, avgDuration: '15-25 min', isActive: true, isPremium: true, icon: 'target', usageCount: 7 },
  { id: 'pre-mortem', name: 'Pre-Mortem Analysis', description: 'Predict failure modes before they happen', category: 'crisis', agentCount: 7, avgDuration: '10-15 min', isActive: true, isPremium: false, icon: 'alert', usageCount: 52 },
  { id: 'post-mortem', name: 'Post-Mortem Analysis', description: 'Analyze past decision outcomes for lessons learned', category: 'operational', agentCount: 5, avgDuration: '8-12 min', isActive: true, isPremium: false, icon: 'clock', usageCount: 39 },
  { id: 'due-diligence', name: 'Due Diligence', description: 'Comprehensive investigation and verification process', category: 'financial', agentCount: 7, avgDuration: '15-25 min', isActive: true, isPremium: true, icon: 'chart', usageCount: 11 },
];

export const CouncilModesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [modes, setModes] = useState<CouncilMode[]>(COUNCIL_MODES);

  const filtered = modes.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || m.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const stats = {
    total: modes.length,
    active: modes.filter(m => m.isActive).length,
    premium: modes.filter(m => m.isPremium).length,
    totalUsage: modes.reduce((sum, m) => sum + m.usageCount, 0),
  };

  return (
    <div className="p-4 lg:p-6 max-w-[1440px] mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border bg-blue-500/15 text-blue-400 border-blue-500/30">FOUNDATION</span>
            <span className="text-slate-600 text-xs">/</span>
            <span className="text-xs text-slate-400">The Council</span>
          </div>
          <h1 className="text-xl font-bold text-neutral-100">Council Modes</h1>
          <p className="text-sm text-neutral-500 mt-0.5">Configure and manage {stats.total} deliberation modes</p>
        </div>
        <button
          onClick={() => navigate('/cortex/council')}
          className="px-4 py-2 bg-blue-500/15 text-blue-400 border border-blue-500/30 rounded-lg text-sm font-medium hover:bg-blue-500/25 flex items-center gap-2"
        >
          <Play className="w-4 h-4" /> Start Deliberation
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Modes', value: stats.total, icon: Layers, color: 'text-blue-400' },
          { label: 'Active', value: stats.active, icon: CheckCircle, color: 'text-green-400' },
          { label: 'Premium', value: stats.premium, icon: Star, color: 'text-amber-400' },
          { label: 'Total Usage', value: stats.totalUsage, icon: BarChart3, color: 'text-purple-400' },
        ].map((s, i) => (
          <div key={i} className="p-4 rounded-xl border border-neutral-700/50 bg-neutral-900/50">
            <div className="flex items-center gap-2 mb-2">
              <s.icon className={cn('w-4 h-4', s.color)} />
              <span className="text-xs text-neutral-500 uppercase tracking-wider">{s.label}</span>
            </div>
            <p className="text-2xl font-bold text-neutral-100">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search modes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-neutral-800/50 border border-neutral-700/50 rounded-lg text-sm text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-blue-500/50"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto">
          {MODE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors',
                selectedCategory === cat.id
                  ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                  : 'text-neutral-400 hover:text-neutral-200 border border-neutral-700/50 hover:border-neutral-600'
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Modes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((mode) => {
          const CatIcon = CATEGORY_ICONS[mode.category] || Brain;
          return (
            <div
              key={mode.id}
              className="p-5 rounded-xl border border-neutral-700/50 bg-neutral-900/50 hover:border-neutral-600 transition-all group cursor-pointer"
              onClick={() => navigate(`/cortex/council?mode=${mode.id}`)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <CatIcon className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex items-center gap-2">
                  {mode.isPremium && (
                    <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">PRO</span>
                  )}
                  <span className={cn('w-2 h-2 rounded-full', mode.isActive ? 'bg-green-400' : 'bg-neutral-600')} />
                </div>
              </div>
              <h3 className="text-sm font-semibold text-neutral-200 mb-1">{mode.name}</h3>
              <p className="text-xs text-neutral-500 mb-3 line-clamp-2">{mode.description}</p>
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {mode.agentCount}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {mode.avgDuration}</span>
                </div>
                <span className="text-neutral-600">{mode.usageCount} uses</span>
              </div>
              <div className="mt-3 pt-3 border-t border-neutral-800/50 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs text-blue-400">Launch this mode</span>
                <ChevronRight className="w-4 h-4 text-blue-400" />
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <Brain className="w-10 h-10 text-neutral-700 mx-auto mb-3" />
          <p className="text-neutral-500 text-sm">No modes match your search</p>
        </div>
      )}
    </div>
  );
};

export default CouncilModesPage;
