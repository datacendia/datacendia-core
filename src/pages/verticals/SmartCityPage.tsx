// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Smart City / Municipal Government Vertical Page
 * CendiaCity™ - AI Decision Intelligence for Municipal Governance
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Users,
  Shield,
  Leaf,
  Car,
  Wifi,
  Scale,
  FileText,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertTriangle,
} from 'lucide-react';

// =============================================================================
// SMART CITY AGENTS DATA
// =============================================================================

const SMART_CITY_AGENTS = [
  { id: 'city-manager', name: 'City Manager', icon: '🏛️', category: 'Executive' },
  { id: 'urban-planner', name: 'Urban Planning Director', icon: '🗺️', category: 'Operations' },
  { id: 'public-works-director', name: 'Public Works Director', icon: '🚧', category: 'Operations' },
  { id: 'public-safety-chief', name: 'Public Safety Chief', icon: '🚔', category: 'Operations' },
  { id: 'finance-director', name: 'Municipal Finance Director', icon: '💰', category: 'Operations' },
  { id: 'parks-rec-director', name: 'Parks & Recreation Director', icon: '🌳', category: 'Operations' },
  { id: 'housing-director', name: 'Housing Director', icon: '🏠', category: 'Operations' },
  { id: 'transportation-director', name: 'Transportation Director', icon: '🚌', category: 'Operations' },
  { id: 'sustainability-officer', name: 'Chief Sustainability Officer', icon: '🌿', category: 'Specialist' },
  { id: 'cio', name: 'Chief Information Officer', icon: '💻', category: 'Specialist' },
  { id: 'hr-director', name: 'Human Resources Director', icon: '👥', category: 'Operations' },
  { id: 'city-attorney', name: 'City Attorney', icon: '⚖️', category: 'Specialist' },
  { id: 'community-engagement', name: 'Community Engagement Director', icon: '🤝', category: 'Operations' },
  { id: 'economic-development', name: 'Economic Development Director', icon: '📈', category: 'Operations' },
  { id: 'civil-rights-guardian', name: 'Civil Rights Guardian', icon: '🛡️', category: 'Guardian', isNonOverridable: true },
  { id: 'transparency-guardian', name: 'Public Transparency Guardian', icon: '👁️', category: 'Guardian', isNonOverridable: true },
  { id: 'equity-guardian', name: 'Equity & EJ Guardian', icon: '⚖️', category: 'Guardian', isNonOverridable: true },
];

const COUNCIL_MODE_CATEGORIES = [
  { id: 'finance', name: 'Budget & Finance', icon: '💰', count: 5 },
  { id: 'planning', name: 'Land Use & Development', icon: '🗺️', count: 5 },
  { id: 'public-safety', name: 'Public Safety', icon: '🚔', count: 4 },
  { id: 'infrastructure', name: 'Infrastructure & Sustainability', icon: '🌿', count: 5 },
  { id: 'transportation', name: 'Transportation & Mobility', icon: '🚌', count: 4 },
  { id: 'technology', name: 'Technology & Digital Services', icon: '💻', count: 3 },
  { id: 'governance', name: 'Governance & Transparency', icon: '🏛️', count: 2 },
];

const USE_CASES = [
  {
    title: 'Annual Budget Development',
    description: 'Multi-stakeholder budget deliberation with citizen priorities and fiscal sustainability analysis',
    agents: ['City Manager', 'Finance Director', 'Community Engagement'],
    outcome: 'Balanced budget with transparent trade-offs and accountability',
  },
  {
    title: 'Major Development Review',
    description: 'Comprehensive review of development proposals for community impact and code compliance',
    agents: ['Urban Planner', 'Public Works', 'Transportation', 'Equity Guardian'],
    outcome: 'Evidence-based development decisions with documented reasoning',
  },
  {
    title: 'Public Safety Policy Review',
    description: 'Constitutional review of policing policies with civil rights and community trust focus',
    agents: ['Public Safety Chief', 'City Attorney', 'Civil Rights Guardian'],
    outcome: 'Policies that balance safety with constitutional protections',
  },
  {
    title: 'Climate Action Planning',
    description: 'Comprehensive climate mitigation and adaptation with environmental justice lens',
    agents: ['Sustainability Officer', 'Urban Planner', 'Equity Guardian'],
    outcome: 'Measurable climate targets with equitable implementation',
  },
];

const COMPLIANCE_FRAMEWORKS = [
  'Open Government / Sunshine Laws',
  'ADA Accessibility',
  'Fair Housing Act',
  'Civil Rights / Equal Protection',
  'Environmental Justice',
  'GFOA Best Practices',
  'FEMA / NIMS Standards',
  'Vision Zero',
];

// =============================================================================
// COMPONENT
// =============================================================================

export const SmartCityPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
              <Building2 className="h-4 w-4 text-emerald-400" />
              <span className="text-emerald-400 text-sm font-medium">Municipal Government Vertical</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Cendia<span className="text-emerald-400">City</span>™
            </h1>
            
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
              AI-powered decision intelligence for municipal governance. 
              <span className="text-emerald-400 font-semibold"> 17 specialized agents</span>, 
              <span className="text-emerald-400 font-semibold"> 28 council modes</span>, and 
              <span className="text-emerald-400 font-semibold"> 3 non-overridable guardians</span> for 
              transparent, accountable, citizen-focused decisions.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigate('/cortex/council')}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
              >
                Start Deliberation
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => navigate('/cortex/admin/vertical-config')}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
              >
                Configure Agents
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Key Stats */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'AI Agents', value: '17', icon: Users },
            { label: 'Council Modes', value: '28', icon: FileText },
            { label: 'Guardians', value: '3', sublabel: 'Non-Overridable', icon: Shield },
            { label: 'Compliance', value: '8+', sublabel: 'Frameworks', icon: Scale },
          ].map((stat, i) => (
            <div key={i} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <stat.icon className="h-8 w-8 text-emerald-400 mb-3" />
              <div className="text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-slate-400 text-sm">{stat.label}</div>
              {stat.sublabel && <div className="text-emerald-400 text-xs">{stat.sublabel}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Agents Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Users className="h-6 w-6 text-emerald-400" />
          Municipal AI Agents
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {SMART_CITY_AGENTS.map((agent) => (
            <div
              key={agent.id}
              className={`p-4 rounded-lg border transition-colors ${
                agent.isNonOverridable
                  ? 'bg-amber-900/20 border-amber-500/30 hover:border-amber-400/50'
                  : 'bg-slate-800/50 border-slate-700 hover:border-emerald-500/50'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{agent.icon}</span>
                <div>
                  <div className="font-medium text-white text-sm">{agent.name}</div>
                  <div className={`text-xs ${agent.isNonOverridable ? 'text-amber-400' : 'text-slate-400'}`}>
                    {agent.isNonOverridable ? '🔒 Non-Overridable' : agent.category}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Council Modes Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <FileText className="h-6 w-6 text-emerald-400" />
          Council Deliberation Modes (28)
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {COUNCIL_MODE_CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
              className={`p-4 rounded-lg border text-left transition-colors ${
                selectedCategory === category.id
                  ? 'bg-emerald-600/20 border-emerald-500'
                  : 'bg-slate-800/50 border-slate-700 hover:border-emerald-500/50'
              }`}
            >
              <span className="text-2xl mb-2 block">{category.icon}</span>
              <div className="font-medium text-white">{category.name}</div>
              <div className="text-emerald-400 text-sm">{category.count} modes</div>
            </button>
          ))}
        </div>
      </div>

      {/* Use Cases Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <CheckCircle className="h-6 w-6 text-emerald-400" />
          Municipal Decision Use Cases
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {USE_CASES.map((useCase, i) => (
            <div key={i} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-2">{useCase.title}</h3>
              <p className="text-slate-400 text-sm mb-4">{useCase.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {useCase.agents.map((agent, j) => (
                  <span key={j} className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded text-xs">
                    {agent}
                  </span>
                ))}
              </div>
              
              <div className="flex items-start gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span className="text-slate-300">{useCase.outcome}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Scale className="h-6 w-6 text-emerald-400" />
          Compliance & Governance Frameworks
        </h2>
        
        <div className="flex flex-wrap gap-3">
          {COMPLIANCE_FRAMEWORKS.map((framework, i) => (
            <div key={i} className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-300 text-sm">
              {framework}
            </div>
          ))}
        </div>
      </div>

      {/* Non-Overridable Guardians Alert */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-amber-900/20 border border-amber-500/30 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="h-8 w-8 text-amber-400 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-amber-400 mb-2">
                3 Non-Overridable Guardian Agents
              </h3>
              <p className="text-slate-300 mb-4">
                These agents cannot be disabled or overridden. They ensure every municipal decision 
                respects constitutional rights, operates transparently, and centers equity.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded text-amber-400 text-sm">
                  🛡️ Civil Rights Guardian
                </span>
                <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded text-amber-400 text-sm">
                  👁️ Public Transparency Guardian
                </span>
                <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded text-amber-400 text-sm">
                  ⚖️ Equity & Environmental Justice Guardian
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-600/20 to-cyan-600/20 rounded-2xl p-8 border border-emerald-500/20 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to Transform Municipal Decision-Making?
          </h2>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            Start using CendiaCity™ to bring AI-powered deliberation to your municipal governance 
            while maintaining transparency, accountability, and citizen trust.
          </p>
          <button
            onClick={() => navigate('/cortex/council')}
            className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium text-lg flex items-center gap-2 mx-auto transition-colors"
          >
            Launch Municipal Council
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmartCityPage;
