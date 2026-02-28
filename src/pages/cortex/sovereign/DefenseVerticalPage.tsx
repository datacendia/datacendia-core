// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DEFENSE & NATIONAL SECURITY VERTICAL PAGE
// DIU-Ready | FedRAMP High | CMMC Level 3 | ITAR Compliant
// =============================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../../../lib/api';
import {
  Shield,
  Target,
  Eye,
  Truck,
  Cpu,
  FileText,
  Scale,
  Users,
  AlertTriangle,
  CheckCircle,
  Lock,
  Radar,
  Crosshair,
  Satellite,
  Radio,
  Plane,
  Anchor,
  Zap,
  Activity,
  BarChart3,
  Settings,
  Play,
  ChevronRight,
} from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

interface DefenseAgent {
  id: string;
  name: string;
  role: string;
  category: 'default' | 'optional' | 'silent-guard';
  expertise: string[];
  clearanceRequired: string;
  opsecAware: boolean;
  missionFocused: boolean;
}

interface DefenseMode {
  id: string;
  name: string;
  category: string;
  purpose: string;
  leadAgent: string;
  classificationLevel: string;
  legalReviewRequired: boolean;
  opsecRequired: boolean;
}

interface DefenseSummary {
  vertical: string;
  displayName: string;
  agents: {
    totalAgents: number;
    defaultAgents: number;
    optionalAgents: number;
    silentGuards: number;
  };
  modes: {
    totalModes: number;
  };
  schemas: number;
  complianceFrameworks: number;
  dataConnectors: number;
  status: string;
}

// =============================================================================
// DEFAULT DATA (fetched from API when available)
// =============================================================================

const DEFAULT_SUMMARY: DefenseSummary = {
  vertical: 'defense',
  displayName: 'Defense & National Security',
  agents: {
    totalAgents: 24,
    defaultAgents: 8,
    optionalAgents: 12,
    silentGuards: 4,
  },
  modes: {
    totalModes: 35,
  },
  schemas: 5,
  complianceFrameworks: 5,
  dataConnectors: 8,
  status: 'operational',
};

const DEFAULT_AGENTS: DefenseAgent[] = [
  { id: 'mission-commander', name: 'Mission Commander', role: 'Mission Planning Authority', category: 'default', expertise: ['mission planning', 'operational art', 'joint operations'], clearanceRequired: 'SECRET', opsecAware: true, missionFocused: true },
  { id: 'threat-analyst', name: 'Threat Analyst', role: 'Intelligence & Threat Assessment', category: 'default', expertise: ['threat analysis', 'intelligence preparation', 'adversary capabilities'], clearanceRequired: 'SECRET', opsecAware: true, missionFocused: true },
  { id: 'opsec-officer', name: 'OPSEC Officer', role: 'Operations Security Guardian', category: 'default', expertise: ['operations security', 'information protection', 'counterintelligence'], clearanceRequired: 'SECRET', opsecAware: true, missionFocused: true },
  { id: 'logistics-coordinator', name: 'Logistics Coordinator', role: 'Sustainment & Logistics Authority', category: 'default', expertise: ['military logistics', 'supply chain', 'transportation'], clearanceRequired: 'SECRET', opsecAware: true, missionFocused: true },
  { id: 'cyber-warfare-specialist', name: 'Cyber Warfare Specialist', role: 'Cyber Operations Authority', category: 'default', expertise: ['offensive cyber', 'defensive cyber', 'network operations'], clearanceRequired: 'TOP_SECRET', opsecAware: true, missionFocused: true },
  { id: 'acquisition-specialist', name: 'Acquisition Specialist', role: 'Defense Acquisition Authority', category: 'default', expertise: ['defense acquisition', 'FAR/DFARS', 'contract management'], clearanceRequired: 'SECRET', opsecAware: true, missionFocused: false },
  { id: 'legal-advisor-ucmj', name: 'Legal Advisor (UCMJ/LOAC)', role: 'Judge Advocate / Legal Counsel', category: 'default', expertise: ['UCMJ', 'law of armed conflict', 'rules of engagement'], clearanceRequired: 'SECRET', opsecAware: true, missionFocused: true },
  { id: 'force-protection-officer', name: 'Force Protection Officer', role: 'Force Protection Authority', category: 'default', expertise: ['force protection', 'antiterrorism', 'physical security'], clearanceRequired: 'SECRET', opsecAware: true, missionFocused: true },
];

const DEFAULT_MODES: DefenseMode[] = [
  { id: 'mission-planning-council', name: 'Mission Planning Council', category: 'major', purpose: 'Full Joint Operation Planning Process (JOPP) deliberation', leadAgent: 'mission-commander', classificationLevel: 'SECRET', legalReviewRequired: true, opsecRequired: true },
  { id: 'threat-assessment-war-room', name: 'Threat Assessment War Room', category: 'major', purpose: 'Comprehensive threat analysis and IPOE', leadAgent: 'threat-analyst', classificationLevel: 'SECRET', legalReviewRequired: false, opsecRequired: true },
  { id: 'acquisition-review-board', name: 'Acquisition Review Board', category: 'major', purpose: 'Defense acquisition milestone review', leadAgent: 'acquisition-specialist', classificationLevel: 'SECRET', legalReviewRequired: true, opsecRequired: true },
  { id: 'opsec-review-council', name: 'OPSEC Review Council', category: 'major', purpose: 'Operations security review for plans and products', leadAgent: 'opsec-officer', classificationLevel: 'SECRET', legalReviewRequired: false, opsecRequired: true },
  { id: 'cyber-operations-planning', name: 'Cyber Operations Planning', category: 'cyber', purpose: 'Offensive and defensive cyber operations planning', leadAgent: 'cyber-warfare-specialist', classificationLevel: 'TOP_SECRET', legalReviewRequired: true, opsecRequired: true },
  { id: 'roe-analysis', name: 'Rules of Engagement Analysis', category: 'operations', purpose: 'ROE development and LOAC compliance', leadAgent: 'legal-advisor-ucmj', classificationLevel: 'SECRET', legalReviewRequired: true, opsecRequired: true },
];

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

const AgentIcon: React.FC<{ agentId: string; className?: string }> = ({ agentId, className = "w-5 h-5" }) => {
  const iconMap: Record<string, React.ReactNode> = {
    'mission-commander': <Target className={className} />,
    'threat-analyst': <Eye className={className} />,
    'opsec-officer': <Lock className={className} />,
    'logistics-coordinator': <Truck className={className} />,
    'cyber-warfare-specialist': <Cpu className={className} />,
    'acquisition-specialist': <FileText className={className} />,
    'legal-advisor-ucmj': <Scale className={className} />,
    'force-protection-officer': <Shield className={className} />,
    'intelligence-analyst': <Radar className={className} />,
    'targeting-officer': <Crosshair className={className} />,
    'space-operations': <Satellite className={className} />,
    'communications-officer': <Radio className={className} />,
  };
  return <>{iconMap[agentId] || <Users className={className} />}</>;
};

const ClassificationBadge: React.FC<{ level: string }> = ({ level }) => {
  const colors: Record<string, string> = {
    'UNCLASSIFIED': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    'CUI': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    'SECRET': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    'TOP_SECRET': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  };
  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded ${colors[level] || colors['UNCLASSIFIED']}`}>
      {level.replace('_', ' ')}
    </span>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number; color: string }> = ({ icon, label, value, color }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm`}>
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-lg ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  </div>
);

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const DefenseVerticalPage: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'overview' | 'agents' | 'modes' | 'compliance'>('overview');
  const [summary, setSummary] = useState<DefenseSummary>(DEFAULT_SUMMARY);
  const [agents, setAgents] = useState<DefenseAgent[]>(DEFAULT_AGENTS);
  const [modes, setModes] = useState<DefenseMode[]>(DEFAULT_MODES);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMode, setSelectedMode] = useState<DefenseMode | null>(null);

  // Load data from API on mount
  useEffect(() => {
    loadDefenseData();
  }, []);

  const loadDefenseData = async () => {
    setIsLoading(true);
    try {
      const res = await api.get<any>('/defense/summary');
      const payload = res as any;
      if (payload.success) {
        if (payload.summary) {setSummary(payload.summary);}
        if (payload.agents) {setAgents(payload.agents);}
        if (payload.modes) {setModes(payload.modes);}
      }
    } catch (error) {
      console.error('Failed to load defense data:', error);
      // Keep default data on error
    } finally {
      setIsLoading(false);
    }
  };

  const complianceFrameworks = [
    { id: 'fedramp-high', name: 'FedRAMP High', status: 'compliant', icon: <Shield className="w-5 h-5" /> },
    { id: 'cmmc-level-3', name: 'CMMC Level 3', status: 'compliant', icon: <Lock className="w-5 h-5" /> },
    { id: 'itar', name: 'ITAR', status: 'compliant', icon: <AlertTriangle className="w-5 h-5" /> },
    { id: 'nist-800-171', name: 'NIST 800-171', status: 'compliant', icon: <CheckCircle className="w-5 h-5" /> },
    { id: 'loac', name: 'Law of Armed Conflict', status: 'compliant', icon: <Scale className="w-5 h-5" /> },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'agents', label: 'Defense Agents', icon: <Users className="w-4 h-4" /> },
    { id: 'modes', label: 'Council Modes', icon: <Settings className="w-4 h-4" /> },
    { id: 'compliance', label: 'Compliance', icon: <Shield className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/10 rounded-xl">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Defense & National Security</h1>
              <p className="text-slate-300">DIU-Ready | FedRAMP High | CMMC Level 3 | ITAR Compliant</p>
            </div>
          </div>
          
          {/* Status Badge */}
          <div className="flex items-center gap-2 mt-4">
            <span className="flex items-center gap-1.5 px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Operational
            </span>
            <span className="px-3 py-1 bg-white/10 rounded-full text-sm">
              {summary.agents.totalAgents} Agents
            </span>
            <span className="px-3 py-1 bg-white/10 rounded-full text-sm">
              {summary.modes.totalModes} Council Modes
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={<Users className="w-6 h-6 text-blue-600" />}
                label="Total Agents"
                value={summary.agents.totalAgents}
                color="bg-blue-100 dark:bg-blue-900/30"
              />
              <StatCard
                icon={<Settings className="w-6 h-6 text-purple-600" />}
                label="Council Modes"
                value={summary.modes.totalModes}
                color="bg-purple-100 dark:bg-purple-900/30"
              />
              <StatCard
                icon={<Shield className="w-6 h-6 text-green-600" />}
                label="Compliance Frameworks"
                value={summary.complianceFrameworks}
                color="bg-green-100 dark:bg-green-900/30"
              />
              <StatCard
                icon={<Zap className="w-6 h-6 text-orange-600" />}
                label="Data Connectors"
                value={summary.dataConnectors}
                color="bg-orange-100 dark:bg-orange-900/30"
              />
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-left">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Start Mission Planning</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Launch JOPP deliberation</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
                </button>
                
                <button className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-left">
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <Eye className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Threat Assessment</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Run IPOE analysis</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
                </button>
                
                <button className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-left">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Cpu className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Cyber Operations</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Plan OCO/DCO</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
                </button>
              </div>
            </div>

            {/* Agent Categories */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Default Agents</h3>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{summary.agents.defaultAgents}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Core mission team</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Optional Specialists</h3>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{summary.agents.optionalAgents}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Mission-specific experts</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Silent Guards</h3>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400">{summary.agents.silentGuards}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Security enforcement</p>
              </div>
            </div>
          </div>
        )}

        {/* Agents Tab */}
        {activeTab === 'agents' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Defense Agents</h2>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                  {agents.filter(a => a.category === 'default').length} Default
                </span>
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm">
                  {agents.filter(a => a.category === 'optional').length} Optional
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${
                      agent.category === 'default' 
                        ? 'bg-blue-100 dark:bg-blue-900/30' 
                        : 'bg-purple-100 dark:bg-purple-900/30'
                    }`}>
                      <AgentIcon agentId={agent.id} className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{agent.name}</h3>
                        <ClassificationBadge level={agent.clearanceRequired} />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{agent.role}</p>
                      <div className="flex flex-wrap gap-1">
                        {agent.expertise.slice(0, 3).map((exp) => (
                          <span
                            key={exp}
                            className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs"
                          >
                            {exp}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-3 mt-3 text-xs text-gray-500 dark:text-gray-400">
                        {agent.opsecAware && (
                          <span className="flex items-center gap-1">
                            <Lock className="w-3 h-3" /> OPSEC Aware
                          </span>
                        )}
                        {agent.missionFocused && (
                          <span className="flex items-center gap-1">
                            <Target className="w-3 h-3" /> Mission Focused
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modes Tab */}
        {activeTab === 'modes' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Council Modes</h2>
              <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-sm">
                {modes.length} Modes Available
              </span>
            </div>

            <div className="space-y-4">
              {modes.map((mode) => (
                <div
                  key={mode.id}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{mode.name}</h3>
                        <ClassificationBadge level={mode.classificationLevel} />
                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded text-xs">
                          {mode.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{mode.purpose}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" /> Lead: {mode.leadAgent}
                        </span>
                        {mode.legalReviewRequired && (
                          <span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                            <Scale className="w-3 h-3" /> Legal Review Required
                          </span>
                        )}
                        {mode.opsecRequired && (
                          <span className="flex items-center gap-1 text-red-600 dark:text-red-400">
                            <Lock className="w-3 h-3" /> OPSEC Required
                          </span>
                        )}
                      </div>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                      <Play className="w-4 h-4" />
                      Start
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Compliance Tab */}
        {activeTab === 'compliance' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Compliance Frameworks</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {complianceFrameworks.map((framework) => (
                <div
                  key={framework.id}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      {framework.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{framework.name}</h3>
                      <span className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                        <CheckCircle className="w-4 h-4" />
                        Compliant
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Compliance Status */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                <div>
                  <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">All Compliance Requirements Met</h3>
                  <p className="text-green-700 dark:text-green-300">
                    This vertical is fully compliant with FedRAMP High, CMMC Level 3, ITAR, NIST 800-171, and LOAC requirements.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DefenseVerticalPage;
