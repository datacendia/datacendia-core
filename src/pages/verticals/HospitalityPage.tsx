// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA HOSPITALITY / TRAVEL VERTICAL
// Hotels, Airlines, OTAs, Cruise Lines
// =============================================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const agents = [
  {
    code: 'revenue-mgr',
    name: 'Revenue Manager',
    purpose: 'Dynamic pricing, yield optimization, demand forecasting',
    model: 'qwq:32b',
  },
  {
    code: 'guest-exp',
    name: 'Guest Experience Director',
    purpose: 'Satisfaction analysis, service recovery, loyalty optimization',
    model: 'llama3.3:70b',
  },
  {
    code: 'ops-director',
    name: 'Operations Director',
    purpose: 'Staffing, inventory, maintenance scheduling',
    model: 'qwq:32b',
  },
  {
    code: 'crisis-mgr',
    name: 'Crisis Manager',
    purpose: 'Incident response, reputation management, contingency planning',
    model: 'llama3.3:70b',
  },
];

const overlays = [
  {
    name: 'Dynamic Pricing Engine',
    function: 'Real-time rate optimization based on demand signals',
    integrates: 'CendiaPredict™',
  },
  {
    name: 'Guest Sentiment Monitor',
    function: 'Review analysis and proactive service recovery',
    integrates: 'CendiaPanopticon™',
  },
  {
    name: 'Crisis Response System',
    function: 'Incident management and communication coordination',
    integrates: 'CendiaAegis™',
  },
  {
    name: 'Demand Forecaster',
    function: 'Occupancy and booking predictions',
    integrates: 'CendiaHorizon™',
  },
];

const compliance = [
  'PCI-DSS',
  'GDPR',
  'ADA',
  'Health & Safety',
  'Liquor Licensing',
  'Fire Codes',
  'Labor Laws',
  'Tourism Regulations',
];

const pricing = [
  {
    package: 'Hospitality Starter',
    price: '$60,000',
    includes: '8 Pillars + 4 Hospitality Agents',
    roi: '1 season',
  },
  {
    package: 'Hospitality Professional',
    price: '$400,000',
    includes: '+ Horizon, Predict, Persona',
    roi: '6 months',
  },
  {
    package: 'Hospitality Enterprise',
    price: '$2,000,000',
    includes: '+ Multi-property, Full Suite',
    roi: '4 months',
  },
  {
    package: 'Hospitality Sovereign',
    price: '$6,000,000+',
    includes: '+ Global chain, Custom',
    roi: '3 months',
  },
];

export const HospitalityPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'agents' | 'integrations' | 'pricing'>('overview');

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <div className="relative overflow-hidden border-b border-neutral-800">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/30 via-neutral-900 to-neutral-900"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <button
            onClick={() => navigate('/verticals')}
            className="flex items-center gap-2 text-neutral-400 hover:text-white mb-6"
          >
            ← Back to Verticals
          </button>

          <div className="flex items-start gap-6">
            <span className="text-6xl">✈️</span>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm font-medium">
                  💰 Revenue Optimization
                </span>
                <span className="px-3 py-1 bg-pink-500/20 text-pink-400 rounded-full text-sm font-medium">
                  ⭐ Guest Experience
                </span>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                  🌍 Global Ready
                </span>
              </div>
              <h1 className="text-4xl font-bold mb-4">Hospitality / Travel</h1>
              <p className="text-xl text-neutral-300 max-w-3xl mb-6">
                Decision intelligence for hotels, airlines, cruise lines, and travel companies. 
                From revenue management to guest experience to crisis response.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => navigate('/cortex/council?vertical=hospitality')}
                  className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  <span>🏛️</span> Launch Hospitality Council
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-neutral-400">Pilot Result</p>
              <p className="text-3xl font-bold text-cyan-400">12%</p>
              <p className="text-neutral-300">RevPAR increase</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6 mt-12">
            {[
              { label: 'RevPAR Lift', value: '+12%', subtext: 'revenue per room' },
              { label: 'Guest Satisfaction', value: '+18pts', subtext: 'NPS improvement' },
              { label: 'Operational Cost', value: '-15%', subtext: 'efficiency gains' },
              { label: 'Crisis Response', value: '4min', subtext: 'avg resolution' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700"
              >
                <p className="text-3xl font-bold text-cyan-400">{stat.value}</p>
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
                className={`px-6 py-4 font-medium capitalize transition-all border-b-2 ${activeTab === tab ? 'border-cyan-500 text-white' : 'border-transparent text-neutral-400 hover:text-white'}`}
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
              <h2 className="text-2xl font-bold mb-6">Why Datacendia for Hospitality</h2>
              <div className="grid grid-cols-3 gap-6">
                {[
                  {
                    title: 'Revenue Optimization',
                    desc: 'AI-powered dynamic pricing and yield management that maximizes RevPAR.',
                    icon: '💰',
                  },
                  {
                    title: 'Guest Experience',
                    desc: 'Sentiment analysis and proactive service recovery before negative reviews.',
                    icon: '⭐',
                  },
                  {
                    title: 'Crisis Management',
                    desc: 'Rapid incident response and reputation protection across all channels.',
                    icon: '🚨',
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
                    className="px-4 py-2 bg-cyan-500/10 text-cyan-400 rounded-lg border border-cyan-500/30 font-medium"
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
              <h2 className="text-2xl font-bold mb-6">Hospitality-Specific AI Agents</h2>
              <div className="grid grid-cols-2 gap-6">
                {agents.map((agent) => (
                  <div
                    key={agent.code}
                    className="bg-neutral-800 rounded-xl p-6 border border-neutral-700"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded font-mono text-sm">
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
              <h2 className="text-2xl font-bold mb-6">Hospitality Overlays</h2>
              <div className="grid grid-cols-2 gap-6">
                {overlays.map((overlay) => (
                  <div
                    key={overlay.name}
                    className="bg-neutral-800 rounded-xl p-6 border border-neutral-700"
                  >
                    <h3 className="text-lg font-semibold mb-2">{overlay.name}</h3>
                    <p className="text-neutral-400 mb-3">{overlay.function}</p>
                    <span className="text-xs text-cyan-400">Integrates: {overlay.integrates}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'integrations' && (
          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Hospitality System Integrations</h2>
              <div className="grid grid-cols-3 gap-6">
                {[
                  { name: 'Opera PMS', type: 'Property Management', status: 'Native' },
                  { name: 'Amadeus', type: 'GDS', status: 'Native' },
                  { name: 'Sabre', type: 'Reservations', status: 'Adapter' },
                  { name: 'ReviewPro', type: 'Reputation', status: 'Native' },
                  { name: 'Duetto', type: 'Revenue Management', status: 'Adapter' },
                  { name: 'Medallia', type: 'Experience', status: 'Native' },
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
              <h2 className="text-2xl font-bold mb-6">Hospitality Pricing Tiers</h2>
              <div className="grid grid-cols-4 gap-6">
                {pricing.map((tier, idx) => (
                  <div
                    key={tier.package}
                    className={`rounded-xl p-6 border ${idx === 3 ? 'bg-cyan-900/20 border-cyan-500/50' : 'bg-neutral-800 border-neutral-700'}`}
                  >
                    <h3 className="text-lg font-semibold mb-2">{tier.package}</h3>
                    <p className="text-3xl font-bold text-cyan-400 mb-4">{tier.price}</p>
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

export default HospitalityPage;
