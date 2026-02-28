// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA TELECOMMUNICATIONS VERTICAL
// Network optimization, churn prediction, and spectrum management
// =============================================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const agents = [
  {
    code: 'network',
    name: 'Network Operations',
    purpose: 'Capacity planning, outage management, performance optimization',
    model: 'qwq:32b',
  },
  {
    code: 'customer-telecom',
    name: 'Customer Intelligence',
    purpose: 'Churn prediction, lifetime value, retention strategy',
    model: 'llama3.3:70b',
  },
  {
    code: 'spectrum',
    name: 'Spectrum Manager',
    purpose: 'Spectrum allocation, 5G planning, regulatory compliance',
    model: 'qwq:32b',
  },
  {
    code: 'revenue-telecom',
    name: 'Revenue Assurance',
    purpose: 'Billing accuracy, fraud detection, revenue optimization',
    model: 'llama3.3:70b',
  },
];

const compliance = [
  'FCC Regulations',
  'CPNI Privacy',
  'E911',
  'Accessibility (ADA)',
  'Net Neutrality',
  'Spectrum Licensing',
  'International Roaming',
];

const pricing = [
  {
    package: 'Telecom Starter',
    price: '$100,000',
    includes: '8 Pillars + 4 Telecom Agents',
    roi: '6 months',
  },
  {
    package: 'Telecom Professional',
    price: '$800,000',
    includes: '+ Predict, Aegis, Panopticon',
    roi: '4 months',
  },
  {
    package: 'Telecom Enterprise',
    price: '$4,000,000',
    includes: '+ Full Guardian Suite',
    roi: '3 months',
  },
  {
    package: 'Telecom Sovereign',
    price: '$12,000,000+',
    includes: '+ Carrier-scale, custom',
    roi: '2 months',
  },
];

export const TelecommunicationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'agents' | 'pricing'>('overview');

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <div className="relative overflow-hidden border-b border-neutral-800">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-900/20 via-neutral-900 to-neutral-900"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <button
            onClick={() => navigate('/verticals')}
            className="flex items-center gap-2 text-neutral-400 hover:text-white mb-6"
          >
            ← Back to Verticals
          </button>

          <div className="flex items-start gap-6">
            <span className="text-6xl">📡</span>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-medium">
                  🔜 Coming Q2 2026
                </span>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                  🔒 95% Sovereignty
                </span>
              </div>
              <h1 className="text-4xl font-bold mb-4">Telecommunications</h1>
              <p className="text-xl text-neutral-300 max-w-3xl mb-6">
                Network optimization, churn prediction, and spectrum management intelligence. From
                5G rollout decisions to customer retention to billing assurance.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => navigate('/cortex/council?vertical=telecommunications')}
                  className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  <span>🏛️</span> Launch Telecom Council
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-neutral-400">Projected Result</p>
              <p className="text-3xl font-bold text-green-400">22%</p>
              <p className="text-neutral-300">churn reduction</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6 mt-12">
            {[
              { label: '18-Month ROI', value: '28%', subtext: 'projected' },
              { label: 'Churn Prediction', value: '85%', subtext: 'accuracy' },
              { label: 'Network Efficiency', value: '+15%', subtext: 'improvement' },
              { label: 'Revenue Leakage', value: '-40%', subtext: 'reduction' },
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
                {tab === 'agents' ? 'Agents & Analytics' : tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {activeTab === 'overview' && (
          <div className="space-y-12">
            <section className="bg-yellow-500/10 rounded-xl p-6 border border-yellow-500/30">
              <h3 className="font-semibold text-yellow-400 mb-2">🔜 Coming Q2 2026</h3>
              <p className="text-neutral-300">
                Telecommunications vertical is in active development with 3 design partners. Core
                platform is available now with industry-specific agents launching Q2 2026.
              </p>
              <button
                onClick={() => navigate('/contact')}
                className="mt-4 px-6 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg border border-yellow-500/30 hover:bg-yellow-500/30"
              >
                Request Early Access
              </button>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6">Why Datacendia for Telecom</h2>
              <div className="grid grid-cols-3 gap-6">
                {[
                  {
                    title: 'Network Intelligence',
                    desc: 'AI-powered capacity planning, outage prediction, and performance optimization across your network',
                    icon: '🌐',
                  },
                  {
                    title: 'Churn Prevention',
                    desc: 'Predict customer churn with 85% accuracy and trigger proactive retention interventions',
                    icon: '👥',
                  },
                  {
                    title: 'Revenue Assurance',
                    desc: 'Detect billing anomalies, reduce revenue leakage, and optimize pricing strategies',
                    icon: '💰',
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
              <h2 className="text-2xl font-bold mb-6">Compliance Frameworks</h2>
              <div className="flex flex-wrap gap-2">
                {compliance.map((c) => (
                  <span
                    key={c}
                    className="px-4 py-2 bg-teal-500/10 text-teal-400 rounded-lg border border-teal-500/30 font-medium"
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
              <h2 className="text-2xl font-bold mb-6">
                Telecommunications Agents (In Development)
              </h2>
              <div className="grid grid-cols-2 gap-6">
                {agents.map((agent) => (
                  <div
                    key={agent.code}
                    className="bg-neutral-800 rounded-xl p-6 border border-neutral-700 opacity-75"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-teal-500/20 rounded-full flex items-center justify-center">
                        <span className="text-xl">🤖</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{agent.name}</h3>
                        <code className="text-xs text-neutral-500 bg-neutral-900 px-2 py-0.5 rounded">
                          {agent.code}
                        </code>
                        <span className="ml-2 text-xs text-yellow-400">In Development</span>
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
              <h2 className="text-2xl font-bold mb-6">Telecommunications Pricing (Projected)</h2>
              <div className="grid grid-cols-4 gap-6">
                {pricing.map((pkg, idx) => (
                  <div
                    key={pkg.package}
                    className={`rounded-xl p-6 border ${idx === 2 ? 'bg-primary-900/20 border-primary-500' : 'bg-neutral-800 border-neutral-700'}`}
                  >
                    {idx === 2 && (
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
                  onClick={() => navigate('/contact')}
                  className="px-8 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700"
                >
                  Request Early Access
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

export default TelecommunicationsPage;
