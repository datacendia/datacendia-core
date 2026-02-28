// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA AGRICULTURE / AGTECH VERTICAL
// Farm operations, supply chain, and agricultural intelligence
// =============================================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const agents = [
  {
    code: 'agronomist',
    name: 'Digital Agronomist',
    purpose: 'Crop planning, soil analysis, yield optimization',
    model: 'qwq:32b',
  },
  {
    code: 'supply-chain',
    name: 'Supply Chain Director',
    purpose: 'Logistics, storage, distribution, market timing',
    model: 'llama3.3:70b',
  },
  {
    code: 'sustainability',
    name: 'Sustainability Officer',
    purpose: 'Carbon tracking, water management, ESG reporting',
    model: 'qwq:32b',
  },
  {
    code: 'commodity',
    name: 'Commodity Analyst',
    purpose: 'Price forecasting, hedging strategies, market intelligence',
    model: 'llama3.3:70b',
  },
];

const overlays = [
  {
    name: 'Weather Impact Predictor',
    function: 'Crop yield forecasting based on weather patterns',
    integrates: 'CendiaHorizon™',
  },
  {
    name: 'Supply Chain Tracker',
    function: 'Farm-to-table traceability and cold chain monitoring',
    integrates: 'CendiaLineage™',
  },
  {
    name: 'Sustainability Dashboard',
    function: 'Carbon footprint tracking, water usage, ESG metrics',
    integrates: 'CendiaMetrics™',
  },
  {
    name: 'Market Intelligence',
    function: 'Commodity price predictions, optimal selling windows',
    integrates: 'CendiaPredict™',
  },
];

const compliance = [
  'USDA Organic',
  'GAP Certification',
  'FSMA',
  'EU Farm to Fork',
  'Carbon Credits',
  'Water Rights',
  'Pesticide Regulations',
  'Animal Welfare',
];

const pricing = [
  {
    package: 'Farm Starter',
    price: '$60,000',
    includes: '8 Pillars + 4 Ag Agents',
    roi: '1 harvest cycle',
  },
  {
    package: 'Farm Professional',
    price: '$400,000',
    includes: '+ Horizon, Predict, Mesh',
    roi: '6 months',
  },
  {
    package: 'Agribusiness Enterprise',
    price: '$2,000,000',
    includes: '+ Full Supply Chain Suite',
    roi: '4 months',
  },
  {
    package: 'Agribusiness Sovereign',
    price: '$6,000,000+',
    includes: '+ Multi-farm, IoT integration',
    roi: '3 months',
  },
];

export const AgriculturePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'agents' | 'integrations' | 'pricing'>('overview');

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <div className="relative overflow-hidden border-b border-neutral-800">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/30 via-neutral-900 to-neutral-900"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <button
            onClick={() => navigate('/verticals')}
            className="flex items-center gap-2 text-neutral-400 hover:text-white mb-6"
          >
            ← Back to Verticals
          </button>

          <div className="flex items-start gap-6">
            <span className="text-6xl">🌾</span>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                  🌱 Sustainability Focus
                </span>
                <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-medium">
                  📡 IoT Ready
                </span>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
                  🔗 Supply Chain
                </span>
              </div>
              <h1 className="text-4xl font-bold mb-4">Agriculture / AgTech</h1>
              <p className="text-xl text-neutral-300 max-w-3xl mb-6">
                Farm-to-table decision intelligence. Optimize yields, manage supply chains, 
                and meet sustainability goals with AI-powered agricultural insights.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => navigate('/cortex/council?vertical=agriculture')}
                  className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  <span>🏛️</span> Launch Agriculture Council
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-neutral-400">Pilot Result</p>
              <p className="text-3xl font-bold text-green-400">23%</p>
              <p className="text-neutral-300">yield improvement</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6 mt-12">
            {[
              { label: 'Yield Optimization', value: '+23%', subtext: 'per acre' },
              { label: 'Water Savings', value: '31%', subtext: 'reduction' },
              { label: 'Supply Chain', value: '99.2%', subtext: 'traceability' },
              { label: 'Carbon Credits', value: '$180K', subtext: 'annual value' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700"
              >
                <p className="text-3xl font-bold text-green-400">{stat.value}</p>
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
                className={`px-6 py-4 font-medium capitalize transition-all border-b-2 ${activeTab === tab ? 'border-green-500 text-white' : 'border-transparent text-neutral-400 hover:text-white'}`}
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
              <h2 className="text-2xl font-bold mb-6">Why Datacendia for Agriculture</h2>
              <div className="grid grid-cols-3 gap-6">
                {[
                  {
                    title: 'Precision Agriculture',
                    desc: 'AI-powered crop planning, soil analysis, and yield optimization based on satellite and IoT data.',
                    icon: '🎯',
                  },
                  {
                    title: 'Supply Chain Visibility',
                    desc: 'Farm-to-table traceability with cold chain monitoring and quality assurance.',
                    icon: '🔗',
                  },
                  {
                    title: 'Sustainability Tracking',
                    desc: 'Carbon footprint monitoring, water usage optimization, and ESG reporting.',
                    icon: '🌍',
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
              <h2 className="text-2xl font-bold mb-6">Compliance & Certifications</h2>
              <div className="flex flex-wrap gap-2">
                {compliance.map((c) => (
                  <span
                    key={c}
                    className="px-4 py-2 bg-green-500/10 text-green-400 rounded-lg border border-green-500/30 font-medium"
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
              <h2 className="text-2xl font-bold mb-6">Agriculture-Specific AI Agents</h2>
              <div className="grid grid-cols-2 gap-6">
                {agents.map((agent) => (
                  <div
                    key={agent.code}
                    className="bg-neutral-800 rounded-xl p-6 border border-neutral-700"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded font-mono text-sm">
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
              <h2 className="text-2xl font-bold mb-6">Agriculture Overlays</h2>
              <div className="grid grid-cols-2 gap-6">
                {overlays.map((overlay) => (
                  <div
                    key={overlay.name}
                    className="bg-neutral-800 rounded-xl p-6 border border-neutral-700"
                  >
                    <h3 className="text-lg font-semibold mb-2">{overlay.name}</h3>
                    <p className="text-neutral-400 mb-3">{overlay.function}</p>
                    <span className="text-xs text-green-400">Integrates: {overlay.integrates}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'integrations' && (
          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">AgTech Integrations</h2>
              <div className="grid grid-cols-3 gap-6">
                {[
                  { name: 'John Deere Operations Center', type: 'Equipment', status: 'Native' },
                  { name: 'Climate FieldView', type: 'Analytics', status: 'Native' },
                  { name: 'Granular/Corteva', type: 'Farm Management', status: 'Adapter' },
                  { name: 'Trimble Ag', type: 'Precision Ag', status: 'Adapter' },
                  { name: 'FarmLogs', type: 'Record Keeping', status: 'Native' },
                  { name: 'Bushel', type: 'Grain Marketing', status: 'Adapter' },
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
              <h2 className="text-2xl font-bold mb-6">Agriculture Pricing Tiers</h2>
              <div className="grid grid-cols-4 gap-6">
                {pricing.map((tier, idx) => (
                  <div
                    key={tier.package}
                    className={`rounded-xl p-6 border ${idx === 3 ? 'bg-green-900/20 border-green-500/50' : 'bg-neutral-800 border-neutral-700'}`}
                  >
                    <h3 className="text-lg font-semibold mb-2">{tier.package}</h3>
                    <p className="text-3xl font-bold text-green-400 mb-4">{tier.price}</p>
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

export default AgriculturePage;
