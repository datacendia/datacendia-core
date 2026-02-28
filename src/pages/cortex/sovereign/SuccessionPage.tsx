// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIA SUCCESSION™ - LEADERSHIP CONTINUITY & KNOWLEDGE TRANSFER
// Sovereign-Tier Service for Enterprise Decision Intelligence
// "Preserve Institutional Wisdom Across Generations"
//
// CAPABILITIES:
// - AI-powered executive succession planning
// - Tacit knowledge capture from departing leaders
// - Decision pattern inheritance for new executives
// - Leadership readiness assessment
// - Knowledge gap analysis
// - Mentorship matching algorithms
// - Critical relationship mapping
// - Institutional memory preservation
// =============================================================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../../lib/api/client';

// =============================================================================
// TYPES
// =============================================================================

type ReadinessLevel = 'ready-now' | 'ready-1yr' | 'ready-2yr' | 'developing' | 'not-ready';
type RiskLevel = 'critical' | 'high' | 'medium' | 'low';
type KnowledgeType = 'strategic' | 'operational' | 'relational' | 'technical' | 'cultural';

interface Executive {
  id: string;
  name: string;
  title: string;
  department: string;
  tenure: number;
  retirementRisk: RiskLevel;
  knowledgeCaptured: number;
  successorCount: number;
  criticalRelationships: number;
  lastKnowledgeSession: Date;
}

interface Successor {
  id: string;
  name: string;
  currentRole: string;
  targetRole: string;
  readiness: ReadinessLevel;
  strengthAreas: string[];
  developmentAreas: string[];
  mentorId: string;
  completedMilestones: number;
  totalMilestones: number;
  projectedReadyDate: Date;
}

interface KnowledgeAsset {
  id: string;
  executiveId: string;
  executiveName: string;
  type: KnowledgeType;
  title: string;
  description: string;
  captureDate: Date;
  accessLevel: 'restricted' | 'leadership' | 'management';
  format: 'video' | 'document' | 'decision-tree' | 'relationship-map' | 'playbook';
  viewCount: number;
  rating: number;
}

interface SuccessionPlan {
  id: string;
  position: string;
  incumbent: string;
  incumbentRisk: RiskLevel;
  successors: {
    name: string;
    readiness: ReadinessLevel;
    isPrimary: boolean;
  }[];
  lastReviewed: Date;
  status: 'active' | 'needs-review' | 'critical-gap';
}

interface KnowledgeGap {
  id: string;
  area: string;
  severity: RiskLevel;
  affectedRoles: string[];
  currentCoverage: number;
  requiredCoverage: number;
  atRiskExecutive: string;
  mitigationPlan: string;
}

// =============================================================================
// MOCK DATA
// =============================================================================

const KNOWLEDGE_CONFIG: Record<KnowledgeType, { icon: string; color: string; label: string }> = {
  strategic: { icon: '🎯', color: 'from-purple-600 to-pink-600', label: 'Strategic Insights' },
  operational: { icon: '⚙️', color: 'from-blue-600 to-indigo-600', label: 'Operational Know-How' },
  relational: { icon: '🤝', color: 'from-amber-600 to-orange-600', label: 'Key Relationships' },
  technical: { icon: '💻', color: 'from-green-600 to-emerald-600', label: 'Technical Expertise' },
  cultural: { icon: '🏛️', color: 'from-cyan-600 to-blue-600', label: 'Cultural Knowledge' },
};

const generateExecutives = (): Executive[] => [
  {
    id: 'exec-001',
    name: 'Margaret Chen',
    title: 'Chief Financial Officer',
    department: 'Finance',
    tenure: 18,
    retirementRisk: 'high',
    knowledgeCaptured: 72,
    successorCount: 2,
    criticalRelationships: 45,
    lastKnowledgeSession: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'exec-002',
    name: 'Robert Williams',
    title: 'Chief Technology Officer',
    department: 'Technology',
    tenure: 12,
    retirementRisk: 'medium',
    knowledgeCaptured: 58,
    successorCount: 3,
    criticalRelationships: 67,
    lastKnowledgeSession: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'exec-003',
    name: 'Sarah Martinez',
    title: 'Chief Operating Officer',
    department: 'Operations',
    tenure: 22,
    retirementRisk: 'critical',
    knowledgeCaptured: 45,
    successorCount: 1,
    criticalRelationships: 89,
    lastKnowledgeSession: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'exec-004',
    name: 'James Thompson',
    title: 'Chief Revenue Officer',
    department: 'Sales',
    tenure: 8,
    retirementRisk: 'low',
    knowledgeCaptured: 34,
    successorCount: 2,
    criticalRelationships: 112,
    lastKnowledgeSession: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
  },
];

const generateSuccessors = (): Successor[] => [
  {
    id: 'succ-001',
    name: 'David Park',
    currentRole: 'VP Finance',
    targetRole: 'Chief Financial Officer',
    readiness: 'ready-1yr',
    strengthAreas: ['Financial modeling', 'M&A experience', 'Board communication'],
    developmentAreas: ['Investor relations', 'Crisis management'],
    mentorId: 'exec-001',
    completedMilestones: 8,
    totalMilestones: 12,
    projectedReadyDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'succ-002',
    name: 'Emily Zhang',
    currentRole: 'VP Engineering',
    targetRole: 'Chief Technology Officer',
    readiness: 'ready-now',
    strengthAreas: ['Technical vision', 'Team leadership', 'Innovation culture'],
    developmentAreas: ['Vendor management'],
    mentorId: 'exec-002',
    completedMilestones: 11,
    totalMilestones: 12,
    projectedReadyDate: new Date(),
  },
  {
    id: 'succ-003',
    name: 'Michael Brown',
    currentRole: 'SVP Operations',
    targetRole: 'Chief Operating Officer',
    readiness: 'ready-2yr',
    strengthAreas: ['Process optimization', 'Supply chain'],
    developmentAreas: ['Executive presence', 'Strategic planning', 'Board experience'],
    mentorId: 'exec-003',
    completedMilestones: 5,
    totalMilestones: 15,
    projectedReadyDate: new Date(Date.now() + 730 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'succ-004',
    name: 'Lisa Anderson',
    currentRole: 'Regional VP Sales',
    targetRole: 'Chief Revenue Officer',
    readiness: 'developing',
    strengthAreas: ['Sales leadership', 'Customer relationships'],
    developmentAreas: ['Global markets', 'Partner strategy', 'Revenue operations'],
    mentorId: 'exec-004',
    completedMilestones: 3,
    totalMilestones: 14,
    projectedReadyDate: new Date(Date.now() + 1095 * 24 * 60 * 60 * 1000),
  },
];

const generateKnowledgeAssets = (): KnowledgeAsset[] => [
  {
    id: 'ka-001',
    executiveId: 'exec-001',
    executiveName: 'Margaret Chen',
    type: 'strategic',
    title: 'Capital Allocation Decision Framework',
    description: 'How I evaluate major investment decisions - the mental models and red flags I look for.',
    captureDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    accessLevel: 'leadership',
    format: 'decision-tree',
    viewCount: 23,
    rating: 4.8,
  },
  {
    id: 'ka-002',
    executiveId: 'exec-001',
    executiveName: 'Margaret Chen',
    type: 'relational',
    title: 'Key Banking Relationships Map',
    description: 'Critical contacts at major banks, their preferences, and relationship history.',
    captureDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    accessLevel: 'restricted',
    format: 'relationship-map',
    viewCount: 8,
    rating: 5.0,
  },
  {
    id: 'ka-003',
    executiveId: 'exec-003',
    executiveName: 'Sarah Martinez',
    type: 'operational',
    title: 'Crisis Response Playbook',
    description: '22 years of lessons learned from operational crises - what works and what doesn\'t.',
    captureDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    accessLevel: 'management',
    format: 'playbook',
    viewCount: 156,
    rating: 4.9,
  },
  {
    id: 'ka-004',
    executiveId: 'exec-002',
    executiveName: 'Robert Williams',
    type: 'technical',
    title: 'Architecture Decision Records',
    description: 'Why we made key technical decisions and the context that informed them.',
    captureDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    accessLevel: 'management',
    format: 'document',
    viewCount: 89,
    rating: 4.6,
  },
  {
    id: 'ka-005',
    executiveId: 'exec-003',
    executiveName: 'Sarah Martinez',
    type: 'cultural',
    title: 'Company Values in Action',
    description: 'Stories and examples of how our values guide difficult decisions.',
    captureDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    accessLevel: 'leadership',
    format: 'video',
    viewCount: 234,
    rating: 4.7,
  },
];

const generateSuccessionPlans = (): SuccessionPlan[] => [
  {
    id: 'plan-001',
    position: 'Chief Financial Officer',
    incumbent: 'Margaret Chen',
    incumbentRisk: 'high',
    successors: [
      { name: 'David Park', readiness: 'ready-1yr', isPrimary: true },
      { name: 'Jennifer Liu', readiness: 'ready-2yr', isPrimary: false },
    ],
    lastReviewed: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    status: 'active',
  },
  {
    id: 'plan-002',
    position: 'Chief Operating Officer',
    incumbent: 'Sarah Martinez',
    incumbentRisk: 'critical',
    successors: [{ name: 'Michael Brown', readiness: 'ready-2yr', isPrimary: true }],
    lastReviewed: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    status: 'critical-gap',
  },
  {
    id: 'plan-003',
    position: 'Chief Technology Officer',
    incumbent: 'Robert Williams',
    incumbentRisk: 'medium',
    successors: [
      { name: 'Emily Zhang', readiness: 'ready-now', isPrimary: true },
      { name: 'Alex Kumar', readiness: 'ready-1yr', isPrimary: false },
      { name: 'Chris Taylor', readiness: 'developing', isPrimary: false },
    ],
    lastReviewed: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    status: 'active',
  },
];

const generateKnowledgeGaps = (): KnowledgeGap[] => [
  {
    id: 'gap-001',
    area: 'Regulatory Relationships',
    severity: 'critical',
    affectedRoles: ['CFO', 'General Counsel', 'Chief Compliance Officer'],
    currentCoverage: 35,
    requiredCoverage: 80,
    atRiskExecutive: 'Margaret Chen',
    mitigationPlan: 'Schedule intensive knowledge capture sessions with regulatory contacts',
  },
  {
    id: 'gap-002',
    area: 'Supply Chain Crisis Management',
    severity: 'high',
    affectedRoles: ['COO', 'VP Supply Chain', 'VP Manufacturing'],
    currentCoverage: 45,
    requiredCoverage: 90,
    atRiskExecutive: 'Sarah Martinez',
    mitigationPlan: 'Document crisis playbooks and conduct tabletop exercises with successors',
  },
  {
    id: 'gap-003',
    area: 'Enterprise Architecture History',
    severity: 'medium',
    affectedRoles: ['CTO', 'VP Engineering', 'Chief Architect'],
    currentCoverage: 58,
    requiredCoverage: 75,
    atRiskExecutive: 'Robert Williams',
    mitigationPlan: 'Complete architecture decision records documentation',
  },
];

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const SuccessionPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'executives' | 'successors' | 'knowledge' | 'gaps'
  >('overview');
  const [executives] = useState<Executive[]>(generateExecutives);
  const [successors] = useState<Successor[]>(generateSuccessors);
  const [knowledgeAssets] = useState<KnowledgeAsset[]>(generateKnowledgeAssets);
  const [successionPlans] = useState<SuccessionPlan[]>(generateSuccessionPlans);
  const [knowledgeGaps] = useState<KnowledgeGap[]>(generateKnowledgeGaps);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiClient.api.get<any>('/sovereign-organs/legacy/succession');
        if (res.success && res.data) {
          // Merge live succession planning data when available
        }
      } catch { /* fallback to deterministic demo data */ }
      setIsLoading(false);
    };
    load();
  }, []);

  const criticalRisks = executives.filter((e) => e.retirementRisk === 'critical');
  const avgKnowledgeCaptured = Math.round(
    executives.reduce((sum, e) => sum + e.knowledgeCaptured, 0) / executives.length
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-purple-800/50 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
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
                  <span className="text-3xl">👔</span>
                  CendiaSuccession™
                  <span className="text-xs bg-gradient-to-r from-purple-600 to-indigo-600 px-2 py-0.5 rounded-full font-medium">
                    SOVEREIGN
                  </span>
                </h1>
                <p className="text-purple-300 text-sm">
                  Leadership Continuity & Knowledge Transfer • Preserve Institutional Wisdom
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {criticalRisks.length > 0 && (
                <div className="px-3 py-1.5 bg-red-600/20 border border-red-500/30 rounded-lg">
                  <span className="text-red-400 text-sm font-medium">
                    🔴 {criticalRisks.length} Critical Succession Risk
                  </span>
                </div>
              )}
              <div className="px-3 py-1.5 bg-purple-600/20 border border-purple-500/30 rounded-lg">
                <span className="text-purple-400 text-sm font-medium">
                  📊 {avgKnowledgeCaptured}% Knowledge Captured
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Metrics Bar */}
      <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border-b border-purple-800/30">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="grid grid-cols-6 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-white">{executives.length}</div>
              <div className="text-xs text-purple-300">Key Executives</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">{successors.length}</div>
              <div className="text-xs text-purple-300">Identified Successors</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-400">{avgKnowledgeCaptured}%</div>
              <div className="text-xs text-purple-300">Avg Knowledge Captured</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-cyan-400">{knowledgeAssets.length}</div>
              <div className="text-xs text-purple-300">Knowledge Assets</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-400">{knowledgeGaps.length}</div>
              <div className="text-xs text-purple-300">Knowledge Gaps</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">
                {successors.filter((s) => s.readiness === 'ready-now').length}
              </div>
              <div className="text-xs text-purple-300">Ready Now</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-purple-800/30 bg-black/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'executives', label: 'Key Executives', icon: '👔' },
              { id: 'successors', label: 'Successor Pipeline', icon: '📈' },
              { id: 'knowledge', label: 'Knowledge Vault', icon: '🧠' },
              { id: 'gaps', label: 'Risk Gaps', icon: '⚠️' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-purple-400 text-white bg-purple-900/40'
                    : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Succession Plans */}
                <div className="bg-black/30 rounded-2xl p-6 border border-purple-800/50">
                  <h2 className="text-lg font-semibold mb-4">Succession Plan Status</h2>
                  <div className="grid grid-cols-3 gap-4">
                    {successionPlans.map((plan) => (
                      <div
                        key={plan.id}
                        className={`p-4 rounded-xl border ${
                          plan.status === 'critical-gap'
                            ? 'bg-red-900/20 border-red-700/50'
                            : plan.status === 'needs-review'
                              ? 'bg-amber-900/20 border-amber-700/50'
                              : 'bg-purple-900/20 border-purple-700/50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold">{plan.position}</h4>
                          <span
                            className={`px-2 py-0.5 rounded text-xs ${
                              plan.status === 'critical-gap'
                                ? 'bg-red-600'
                                : plan.status === 'needs-review'
                                  ? 'bg-amber-600'
                                  : 'bg-green-600'
                            }`}
                          >
                            {plan.status === 'critical-gap' ? 'CRITICAL' : plan.status}
                          </span>
                        </div>
                        <div className="text-sm text-white/60 mb-3">
                          Incumbent: {plan.incumbent}
                          <span
                            className={`ml-2 px-1.5 py-0.5 rounded text-xs ${
                              plan.incumbentRisk === 'critical'
                                ? 'bg-red-600/50'
                                : plan.incumbentRisk === 'high'
                                  ? 'bg-amber-600/50'
                                  : 'bg-green-600/50'
                            }`}
                          >
                            {plan.incumbentRisk} risk
                          </span>
                        </div>
                        <div className="space-y-2">
                          {plan.successors.map((succ) => (
                            <div
                              key={succ.name}
                              className="flex items-center justify-between text-sm"
                            >
                              <span className={succ.isPrimary ? 'font-medium' : 'text-white/60'}>
                                {succ.isPrimary && '★ '}
                                {succ.name}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded text-xs ${
                                  succ.readiness === 'ready-now'
                                    ? 'bg-green-600'
                                    : succ.readiness === 'ready-1yr'
                                      ? 'bg-blue-600'
                                      : 'bg-amber-600'
                                }`}
                              >
                                {succ.readiness}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Knowledge Gaps Alert */}
                {knowledgeGaps.filter((g) => g.severity === 'critical').length > 0 && (
                  <div className="bg-black/30 rounded-2xl p-6 border border-red-800/50">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <span className="text-red-400">⚠️</span> Critical Knowledge Gaps
                    </h2>
                    <div className="space-y-3">
                      {knowledgeGaps
                        .filter((g) => g.severity === 'critical')
                        .map((gap) => (
                          <div
                            key={gap.id}
                            className="p-4 bg-red-900/20 rounded-xl border border-red-700/30"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold">{gap.area}</h4>
                              <span className="text-red-400 font-bold">
                                {gap.currentCoverage}% / {gap.requiredCoverage}%
                              </span>
                            </div>
                            <p className="text-sm text-white/60 mb-2">
                              At-risk executive: {gap.atRiskExecutive}
                            </p>
                            <p className="text-xs text-white/50">{gap.mitigationPlan}</p>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Recent Knowledge Assets */}
                <div className="bg-black/30 rounded-2xl p-6 border border-purple-800/50">
                  <h2 className="text-lg font-semibold mb-4">🧠 Recent Knowledge Captures</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {knowledgeAssets.slice(0, 4).map((asset) => (
                      <div key={asset.id} className="p-4 bg-black/20 rounded-xl">
                        <div className="flex items-center gap-3 mb-3">
                          <div
                            className={`w-10 h-10 rounded-lg bg-gradient-to-br ${KNOWLEDGE_CONFIG[asset.type].color} flex items-center justify-center text-lg`}
                          >
                            {KNOWLEDGE_CONFIG[asset.type].icon}
                          </div>
                          <div>
                            <h4 className="font-semibold">{asset.title}</h4>
                            <div className="text-xs text-white/50">{asset.executiveName}</div>
                          </div>
                        </div>
                        <p className="text-sm text-white/60 mb-2">{asset.description}</p>
                        <div className="flex items-center justify-between text-xs text-white/40">
                          <span>{asset.format}</span>
                          <span>⭐ {asset.rating}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'executives' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 rounded-2xl p-6 border border-purple-700/50">
                  <h2 className="text-lg font-semibold mb-2">👔 Key Executive Profiles</h2>
                  <p className="text-white/60">
                    Track institutional knowledge and succession readiness for key leaders.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {executives.map((exec) => (
                    <div
                      key={exec.id}
                      className="bg-black/30 rounded-2xl p-6 border border-purple-800/50"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold">{exec.name}</h3>
                          <div className="text-sm text-purple-300">{exec.title}</div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-lg text-sm ${
                            exec.retirementRisk === 'critical'
                              ? 'bg-red-600'
                              : exec.retirementRisk === 'high'
                                ? 'bg-amber-600'
                                : exec.retirementRisk === 'medium'
                                  ? 'bg-yellow-600'
                                  : 'bg-green-600'
                          }`}
                        >
                          {exec.retirementRisk} risk
                        </span>
                      </div>

                      <div className="grid grid-cols-4 gap-3 mb-4">
                        <div className="text-center p-3 bg-black/20 rounded-xl">
                          <div className="text-xl font-bold">{exec.tenure}</div>
                          <div className="text-xs text-white/50">Years</div>
                        </div>
                        <div className="text-center p-3 bg-black/20 rounded-xl">
                          <div className="text-xl font-bold text-purple-400">
                            {exec.knowledgeCaptured}%
                          </div>
                          <div className="text-xs text-white/50">Captured</div>
                        </div>
                        <div className="text-center p-3 bg-black/20 rounded-xl">
                          <div className="text-xl font-bold text-green-400">{exec.successorCount}</div>
                          <div className="text-xs text-white/50">Successors</div>
                        </div>
                        <div className="text-center p-3 bg-black/20 rounded-xl">
                          <div className="text-xl font-bold text-cyan-400">
                            {exec.criticalRelationships}
                          </div>
                          <div className="text-xs text-white/50">Relationships</div>
                        </div>
                      </div>

                      <div className="mb-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Knowledge Capture Progress</span>
                          <span>{exec.knowledgeCaptured}%</span>
                        </div>
                        <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              exec.knowledgeCaptured >= 70
                                ? 'bg-green-500'
                                : exec.knowledgeCaptured >= 50
                                  ? 'bg-amber-500'
                                  : 'bg-red-500'
                            }`}
                            style={{ width: `${exec.knowledgeCaptured}%` }}
                          />
                        </div>
                      </div>

                      <div className="text-xs text-white/40">
                        Last session: {exec.lastKnowledgeSession.toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'successors' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-2xl p-6 border border-green-700/50">
                  <h2 className="text-lg font-semibold mb-2">📈 Successor Development Pipeline</h2>
                  <p className="text-white/60">
                    Track readiness and development progress for identified successors.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {successors.map((succ) => (
                    <div
                      key={succ.id}
                      className="bg-black/30 rounded-2xl p-6 border border-purple-800/50"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold">{succ.name}</h3>
                          <div className="text-sm text-white/60">{succ.currentRole}</div>
                          <div className="text-sm text-purple-300">→ {succ.targetRole}</div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-lg text-sm ${
                            succ.readiness === 'ready-now'
                              ? 'bg-green-600'
                              : succ.readiness === 'ready-1yr'
                                ? 'bg-blue-600'
                                : succ.readiness === 'ready-2yr'
                                  ? 'bg-amber-600'
                                  : 'bg-zinc-600'
                          }`}
                        >
                          {succ.readiness}
                        </span>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Development Milestones</span>
                          <span>
                            {succ.completedMilestones}/{succ.totalMilestones}
                          </span>
                        </div>
                        <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-500"
                            style={{
                              width: `${(succ.completedMilestones / succ.totalMilestones) * 100}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-white/50 mb-2">Strengths</div>
                          <div className="space-y-1">
                            {succ.strengthAreas.map((s) => (
                              <div
                                key={s}
                                className="text-xs px-2 py-1 bg-green-900/30 rounded text-green-300"
                              >
                                ✓ {s}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-white/50 mb-2">Development Areas</div>
                          <div className="space-y-1">
                            {succ.developmentAreas.map((d) => (
                              <div
                                key={d}
                                className="text-xs px-2 py-1 bg-amber-900/30 rounded text-amber-300"
                              >
                                → {d}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 text-xs text-white/40">
                        Projected ready: {succ.projectedReadyDate.toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'knowledge' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-2xl p-6 border border-cyan-700/50">
                  <h2 className="text-lg font-semibold mb-2">🧠 Institutional Knowledge Vault</h2>
                  <p className="text-white/60">
                    Captured wisdom, decision frameworks, and relationship maps from key executives.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {knowledgeAssets.map((asset) => (
                    <div
                      key={asset.id}
                      className="bg-black/30 rounded-2xl p-6 border border-purple-800/50"
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-14 h-14 rounded-xl bg-gradient-to-br ${KNOWLEDGE_CONFIG[asset.type].color} flex items-center justify-center text-2xl flex-shrink-0`}
                        >
                          {KNOWLEDGE_CONFIG[asset.type].icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold">{asset.title}</h3>
                            <div className="flex items-center gap-2">
                              <span className="text-amber-400">⭐ {asset.rating}</span>
                              <span
                                className={`px-2 py-0.5 rounded text-xs ${
                                  asset.accessLevel === 'restricted'
                                    ? 'bg-red-600'
                                    : asset.accessLevel === 'leadership'
                                      ? 'bg-purple-600'
                                      : 'bg-blue-600'
                                }`}
                              >
                                {asset.accessLevel}
                              </span>
                            </div>
                          </div>
                          <div className="text-sm text-purple-300 mb-2">
                            {asset.executiveName} • {KNOWLEDGE_CONFIG[asset.type].label}
                          </div>
                          <p className="text-white/70 mb-3">{asset.description}</p>
                          <div className="flex items-center justify-between text-sm text-white/50">
                            <span>Format: {asset.format}</span>
                            <span>{asset.viewCount} views</span>
                            <span>Captured: {asset.captureDate.toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'gaps' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-red-900/30 to-rose-900/30 rounded-2xl p-6 border border-red-700/50">
                  <h2 className="text-lg font-semibold mb-2">⚠️ Knowledge Gap Analysis</h2>
                  <p className="text-white/60">
                    Identify and mitigate critical knowledge risks before executive transitions.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {knowledgeGaps.map((gap) => (
                    <div
                      key={gap.id}
                      className={`p-6 rounded-2xl border ${
                        gap.severity === 'critical'
                          ? 'bg-red-900/20 border-red-700/50'
                          : gap.severity === 'high'
                            ? 'bg-amber-900/20 border-amber-700/50'
                            : 'bg-yellow-900/20 border-yellow-700/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold">{gap.area}</h3>
                        <span
                          className={`px-3 py-1 rounded-lg text-sm font-bold ${
                            gap.severity === 'critical'
                              ? 'bg-red-600'
                              : gap.severity === 'high'
                                ? 'bg-amber-600'
                                : 'bg-yellow-600'
                          }`}
                        >
                          {gap.severity.toUpperCase()}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="p-3 bg-black/20 rounded-xl">
                          <div className="text-sm text-white/50 mb-1">Current Coverage</div>
                          <div className="text-2xl font-bold text-red-400">{gap.currentCoverage}%</div>
                        </div>
                        <div className="p-3 bg-black/20 rounded-xl">
                          <div className="text-sm text-white/50 mb-1">Required Coverage</div>
                          <div className="text-2xl font-bold text-green-400">
                            {gap.requiredCoverage}%
                          </div>
                        </div>
                        <div className="p-3 bg-black/20 rounded-xl">
                          <div className="text-sm text-white/50 mb-1">Gap</div>
                          <div className="text-2xl font-bold text-amber-400">
                            {gap.requiredCoverage - gap.currentCoverage}%
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="text-sm text-white/50 mb-1">At-Risk Executive</div>
                        <div className="font-medium">{gap.atRiskExecutive}</div>
                      </div>

                      <div className="mb-3">
                        <div className="text-sm text-white/50 mb-1">Affected Roles</div>
                        <div className="flex flex-wrap gap-2">
                          {gap.affectedRoles.map((role) => (
                            <span key={role} className="px-2 py-1 bg-black/30 rounded text-sm">
                              {role}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="p-3 bg-black/20 rounded-xl">
                        <div className="text-sm text-white/50 mb-1">Mitigation Plan</div>
                        <p className="text-white/80">{gap.mitigationPlan}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};
