// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA MANUFACTURING VERTICAL
// Supply chain resilience and operational intelligence
// =============================================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const agents = [
  {
    code: 'vp-ops',
    name: 'VP Operations',
    purpose: 'Production planning, capacity optimization, lean initiatives',
    model: 'llama3.3:70b',
  },
  {
    code: 'supply-chain',
    name: 'Supply Chain Director',
    purpose: 'Supplier management, logistics optimization, risk mitigation',
    model: 'qwq:32b',
  },
  {
    code: 'quality',
    name: 'Quality Manager',
    purpose: 'Quality control, compliance, continuous improvement',
    model: 'qwq:32b',
  },
  {
    code: 'plant',
    name: 'Plant Manager',
    purpose: 'Shop floor operations, workforce planning, safety',
    model: 'llama3.3:70b',
  },
];

const compliance = [
  'ISO 9001',
  'IATF 16949',
  'AS9100',
  'OSHA',
  'EPA',
  'FDA cGMP',
  'ISO 14001',
  'ISO 45001',
];

const pricing = [
  {
    package: 'Manufacturing Starter',
    price: '$80,000',
    includes: '8 Pillars + 4 Mfg Agents',
    roi: '8 months',
  },
  {
    package: 'Manufacturing Professional',
    price: '$600,000',
    includes: '+ Panopticon, Crucible, Mesh',
    roi: '5 months',
  },
  {
    package: 'Manufacturing Enterprise',
    price: '$3,000,000',
    includes: '+ Full Guardian Suite',
    roi: '3 months',
  },
  {
    package: 'Manufacturing Sovereign',
    price: '$8,000,000+',
    includes: '+ Multi-plant, OT security',
    roi: '2 months',
  },
];

export const ManufacturingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'agents' | 'pricing'>('overview');

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <div className="relative overflow-hidden border-b border-neutral-800">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-neutral-900 to-neutral-900"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <button
            onClick={() => navigate('/verticals')}
            className="flex items-center gap-2 text-neutral-400 hover:text-white mb-6"
          >
            ← Back to Verticals
          </button>

          <div className="flex items-start gap-6">
            <span className="text-6xl">🏭</span>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                  📈 Growth Vertical
                </span>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                  🔒 88% Sovereignty
                </span>
              </div>
              <h1 className="text-4xl font-bold mb-4">Manufacturing</h1>
              <p className="text-xl text-neutral-300 max-w-3xl mb-6">
                Supply chain resilience and operational intelligence. Real-time production
                optimization with OT security integration.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => navigate('/cortex/council?vertical=manufacturing')}
                  className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  <span>🏛️</span> Launch Manufacturing Council
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-neutral-400">Pilot Result</p>
              <p className="text-3xl font-bold text-green-400">23%</p>
              <p className="text-neutral-300">inventory reduction</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6 mt-12">
            {[
              { label: '18-Month ROI', value: '23%', subtext: 'inventory reduction' },
              { label: 'Capital Freed', value: '$1.4M', subtext: 'average' },
              { label: 'Supply Risk', value: '35%', subtext: 'reduction' },
              { label: 'OEE Improvement', value: '12%', subtext: 'average' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700"
              >
                <p className="text-3xl font-bold text-primary-400">{stat.value}</p>
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
            {['overview', 'agents', 'pricing'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as typeof activeTab)}
                className={`px-6 py-4 font-medium capitalize transition-all border-b-2 ${activeTab === tab ? 'border-primary-500 text-white' : 'border-transparent text-neutral-400 hover:text-white'}`}
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
              <h2 className="text-2xl font-bold mb-6">Why Datacendia for Manufacturing</h2>
              <div className="grid grid-cols-3 gap-6">
                {[
                  {
                    title: 'Supply Chain Resilience',
                    desc: 'AI-powered supplier risk monitoring with automatic alternative sourcing recommendations',
                    icon: '🔗',
                  },
                  {
                    title: 'OT/IT Convergence',
                    desc: 'Secure integration with shop floor systems while maintaining air-gap for sensitive operations',
                    icon: '🔒',
                  },
                  {
                    title: 'Inventory Optimization',
                    desc: 'Dynamic safety stock and reorder point optimization based on demand signals',
                    icon: '📦',
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
              <h2 className="text-2xl font-bold mb-6">Customer Results</h2>
              <div className="space-y-4">
                {[
                  {
                    org: 'Auto Supplier (Tier 1)',
                    quote:
                      'Reduced inventory by 23%, freeing $1.4M in working capital. Council identified 12 SKUs we were over-stocking.',
                    metric: '$1.4M freed',
                  },
                  {
                    org: 'Aerospace Manufacturer',
                    quote:
                      'Supply chain disruption response time cut from 2 weeks to 2 days. We had alternatives ready before competitors knew there was a problem.',
                    metric: '2wk → 2d',
                  },
                  {
                    org: 'Consumer Goods Company',
                    quote: "OEE improved 12% by identifying bottlenecks our MES wasn't surfacing.",
                    metric: '12% OEE gain',
                  },
                ].map((cs, idx) => (
                  <div
                    key={idx}
                    className="bg-neutral-800 rounded-xl p-6 border border-neutral-700"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-neutral-300 text-lg italic">"{cs.quote}"</p>
                        <p className="text-neutral-500 mt-3">— {cs.org}</p>
                      </div>
                      <div className="ml-6 text-right">
                        <p className="text-2xl font-bold text-green-400">{cs.metric}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6">Compliance Frameworks</h2>
              <div className="flex flex-wrap gap-2">
                {compliance.map((c) => (
                  <span
                    key={c}
                    className="px-4 py-2 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/30 font-medium"
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
              <h2 className="text-2xl font-bold mb-6">Manufacturing Agents</h2>
              <div className="grid grid-cols-2 gap-6">
                {agents.map((agent) => (
                  <div
                    key={agent.code}
                    className="bg-neutral-800 rounded-xl p-6 border border-neutral-700"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center">
                        <span className="text-xl">🤖</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{agent.name}</h3>
                        <code className="text-xs text-neutral-500 bg-neutral-900 px-2 py-0.5 rounded">
                          {agent.code}
                        </code>
                      </div>
                    </div>
                    <p className="text-neutral-300 mb-3">{agent.purpose}</p>
                    <p className="text-sm text-neutral-500">
                      Model: <code className="text-primary-400">{agent.model}</code>
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Manufacturing Pricing</h2>
              <div className="grid grid-cols-4 gap-6">
                {pricing.map((pkg, idx) => (
                  <div
                    key={pkg.package}
                    className={`rounded-xl p-6 border ${idx === 1 ? 'bg-primary-900/20 border-primary-500' : 'bg-neutral-800 border-neutral-700'}`}
                  >
                    {idx === 1 && (
                      <span className="text-xs bg-primary-500 text-white px-2 py-1 rounded mb-3 inline-block">
                        Most Popular
                      </span>
                    )}
                    <h3 className="font-semibold text-lg mb-2">{pkg.package}</h3>
                    <p className="text-2xl font-bold text-primary-400 mb-4">{pkg.price}</p>
                    <p className="text-neutral-400 mb-4">{pkg.includes}</p>
                    <p className="text-sm text-green-400">ROI: {pkg.roi}</p>
                  </div>
                ))}
              </div>
            </section>
            <section className="text-center">
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => navigate('/demo')}
                  className="px-8 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700"
                >
                  Request Manufacturing Demo
                </button>
                <button
                  onClick={() => navigate('/contact')}
                  className="px-8 py-3 border border-neutral-600 text-white rounded-lg font-medium hover:bg-neutral-800"
                >
                  Talk to Sales
                </button>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManufacturingPage;
