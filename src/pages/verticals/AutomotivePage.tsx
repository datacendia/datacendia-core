// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA AUTOMOTIVE VERTICAL
// OEMs, Tier 1 Suppliers, EV Manufacturers
// =============================================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const agents = [
  {
    code: 'product-eng',
    name: 'Product Engineering Lead',
    purpose: 'Vehicle architecture, platform decisions, feature prioritization',
    model: 'qwq:32b',
  },
  {
    code: 'supply-chain',
    name: 'Supply Chain Director',
    purpose: 'Supplier management, logistics, inventory optimization',
    model: 'llama3.3:70b',
  },
  {
    code: 'quality',
    name: 'Quality Assurance Director',
    purpose: 'Defect analysis, recall prevention, IATF compliance',
    model: 'qwq:32b',
  },
  {
    code: 'ev-strategy',
    name: 'EV Strategy Officer',
    purpose: 'Electrification roadmap, battery decisions, charging infrastructure',
    model: 'llama3.3:70b',
  },
];

const overlays = [
  {
    name: 'Recall Risk Predictor',
    function: 'Early warning system for potential quality issues',
    integrates: 'CendiaPredict™',
  },
  {
    name: 'Supply Chain Monitor',
    function: 'Real-time supplier risk and disruption tracking',
    integrates: 'CendiaPanopticon™',
  },
  {
    name: 'IATF Compliance Tracker',
    function: 'Automotive quality management system monitoring',
    integrates: 'CendiaGovern™',
  },
  {
    name: 'EV Transition Planner',
    function: 'Electrification roadmap and investment decisions',
    integrates: 'CendiaHorizon™',
  },
];

const compliance = [
  'IATF 16949',
  'ISO 26262',
  'UNECE WP.29',
  'EPA/CARB',
  'NHTSA',
  'EU Type Approval',
  'REACH',
  'Conflict Minerals',
];

const pricing = [
  {
    package: 'Automotive Starter',
    price: '$150,000',
    includes: '8 Pillars + 4 Auto Agents',
    roi: '8 months',
  },
  {
    package: 'Automotive Professional',
    price: '$900,000',
    includes: '+ Cascade, Predict, Mesh',
    roi: '5 months',
  },
  {
    package: 'Automotive Enterprise',
    price: '$4,000,000',
    includes: '+ Full Supply Chain Suite',
    roi: '4 months',
  },
  {
    package: 'Automotive Sovereign',
    price: '$12,000,000+',
    includes: '+ Multi-plant, Air-gapped',
    roi: '3 months',
  },
];

export const AutomotivePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'agents' | 'integrations' | 'pricing'>('overview');

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <div className="relative overflow-hidden border-b border-neutral-800">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 via-neutral-900 to-neutral-900"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <button
            onClick={() => navigate('/verticals')}
            className="flex items-center gap-2 text-neutral-400 hover:text-white mb-6"
          >
            ← Back to Verticals
          </button>

          <div className="flex items-start gap-6">
            <span className="text-6xl">🚗</span>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-medium">
                  ⚡ EV Ready
                </span>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
                  🔗 Supply Chain
                </span>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                  ✅ IATF 16949
                </span>
              </div>
              <h1 className="text-4xl font-bold mb-4">Automotive</h1>
              <p className="text-xl text-neutral-300 max-w-3xl mb-6">
                Decision intelligence for OEMs, Tier 1 suppliers, and EV manufacturers. 
                From product engineering to supply chain resilience to quality management.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => navigate('/cortex/council?vertical=automotive')}
                  className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  <span>🏛️</span> Launch Automotive Council
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-neutral-400">Pilot Result</p>
              <p className="text-3xl font-bold text-red-400">67%</p>
              <p className="text-neutral-300">recall risk reduction</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6 mt-12">
            {[
              { label: 'Recall Prevention', value: '67%', subtext: 'risk reduction' },
              { label: 'Supply Disruption', value: '-45%', subtext: 'impact' },
              { label: 'Time to Market', value: '4mo', subtext: 'faster' },
              { label: 'Quality Costs', value: '-$8M', subtext: 'annual savings' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700"
              >
                <p className="text-3xl font-bold text-red-400">{stat.value}</p>
                <p className="font-medium">{stat.label}</p>
                <p className="text-sm text-neutral-500">{stat.subtext}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {['overview', 'agents', 'integrations', 'pricing'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as typeof activeTab)}
                className={`px-6 py-4 font-medium capitalize transition-all border-b-2 ${activeTab === tab ? 'border-red-500 text-white' : 'border-transparent text-neutral-400 hover:text-white'}`}
              >
                {tab === 'agents' ? 'Agents & Overlays' : tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {activeTab === 'overview' && (
          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Why Datacendia for Automotive</h2>
              <div className="grid grid-cols-3 gap-6">
                {[
                  {
                    title: 'Recall Prevention',
                    desc: 'AI-powered early warning system identifies quality issues before they become recalls.',
                    icon: '🛡️',
                  },
                  {
                    title: 'Supply Chain Resilience',
                    desc: 'Real-time supplier risk monitoring and alternative sourcing recommendations.',
                    icon: '🔗',
                  },
                  {
                    title: 'EV Transition Planning',
                    desc: 'Strategic decision support for electrification roadmap and battery investments.',
                    icon: '⚡',
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="bg-neutral-800 rounded-xl p-6 border border-neutral-700"
                  >
                    <span className="text-3xl">{item.icon}</span>
                    <h3 className="text-lg font-semibold mt-4 mb-2">{item.title}</h3>
                    <p className="text-neutral-400">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6">Compliance & Standards</h2>
              <div className="flex flex-wrap gap-2">
                {compliance.map((c) => (
                  <span
                    key={c}
                    className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg border border-red-500/30 font-medium"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'agents' && (
          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Automotive-Specific AI Agents</h2>
              <div className="grid grid-cols-2 gap-6">
                {agents.map((agent) => (
                  <div
                    key={agent.code}
                    className="bg-neutral-800 rounded-xl p-6 border border-neutral-700"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded font-mono text-sm">
                        {agent.code}
                      </span>
                      <span className="text-xs text-neutral-500">{agent.model}</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{agent.name}</h3>
                    <p className="text-neutral-400">{agent.purpose}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6">Automotive Overlays</h2>
              <div className="grid grid-cols-2 gap-6">
                {overlays.map((overlay) => (
                  <div
                    key={overlay.name}
                    className="bg-neutral-800 rounded-xl p-6 border border-neutral-700"
                  >
                    <h3 className="text-lg font-semibold mb-2">{overlay.name}</h3>
                    <p className="text-neutral-400 mb-3">{overlay.function}</p>
                    <span className="text-xs text-red-400">Integrates: {overlay.integrates}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'integrations' && (
          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Automotive System Integrations</h2>
              <div className="grid grid-cols-3 gap-6">
                {[
                  { name: 'SAP S/4HANA', type: 'ERP', status: 'Native' },
                  { name: 'Teamcenter', type: 'PLM', status: 'Native' },
                  { name: 'CATIA/NX', type: 'CAD', status: 'Adapter' },
                  { name: 'Covisint/Elemica', type: 'Supply Chain', status: 'Adapter' },
                  { name: 'QAD', type: 'MES', status: 'Native' },
                  { name: 'Plex', type: 'Manufacturing', status: 'Adapter' },
                ].map((int) => (
                  <div
                    key={int.name}
                    className="bg-neutral-800 rounded-xl p-6 border border-neutral-700"
                  >
                    <h3 className="text-lg font-semibold mb-1">{int.name}</h3>
                    <p className="text-neutral-500 text-sm mb-2">{int.type}</p>
                    <span className={`text-xs px-2 py-1 rounded ${int.status === 'Native' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {int.status}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Automotive Pricing Tiers</h2>
              <div className="grid grid-cols-4 gap-6">
                {pricing.map((tier, idx) => (
                  <div
                    key={tier.package}
                    className={`rounded-xl p-6 border ${idx === 3 ? 'bg-red-900/20 border-red-500/50' : 'bg-neutral-800 border-neutral-700'}`}
                  >
                    <h3 className="text-lg font-semibold mb-2">{tier.package}</h3>
                    <p className="text-3xl font-bold text-red-400 mb-4">{tier.price}</p>
                    <p className="text-neutral-400 text-sm mb-4">{tier.includes}</p>
                    <p className="text-xs text-neutral-500">ROI: {tier.roi}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default AutomotivePage;
