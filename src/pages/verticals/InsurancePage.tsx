// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA INSURANCE VERTICAL
// Underwriting optimization and claims intelligence across 50+ jurisdictions
// =============================================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const agents = [
  {
    code: 'actuary',
    name: 'Chief Actuary',
    purpose: 'Risk modeling, pricing optimization, reserve analysis',
    model: 'qwq:32b',
  },
  {
    code: 'underwriting',
    name: 'Underwriting Manager',
    purpose: 'Risk selection, policy structuring, capacity allocation',
    model: 'llama3.3:70b',
  },
  {
    code: 'claims',
    name: 'Claims Director',
    purpose: 'Claims triage, fraud detection, settlement optimization',
    model: 'qwq:32b',
  },
  {
    code: 'risk-ins',
    name: 'Risk Manager',
    purpose: 'Portfolio analysis, catastrophe modeling, reinsurance strategy',
    model: 'llama3.3:70b',
  },
];

const compliance = [
  'State Insurance Laws',
  'NAIC Model Laws',
  'Solvency II',
  'GDPR',
  'CCPA',
  'ORSA',
  'RBC Requirements',
  'Market Conduct',
];

const pricing = [
  {
    package: 'Insurance Starter',
    price: '$100,000',
    includes: '8 Pillars + 4 Insurance Agents',
    roi: '8 months',
  },
  {
    package: 'Insurance Professional',
    price: '$1,000,000',
    includes: '+ Panopticon, Crucible, Aegis',
    roi: '5 months',
  },
  {
    package: 'Insurance Enterprise',
    price: '$4,000,000',
    includes: '+ Full Guardian Suite',
    roi: '3 months',
  },
  {
    package: 'Insurance Sovereign',
    price: '$10,000,000+',
    includes: '+ Multi-state, custom models',
    roi: '2 months',
  },
];

export const InsurancePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'agents' | 'pricing'>('overview');

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <div className="relative overflow-hidden border-b border-neutral-800">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 via-neutral-900 to-neutral-900"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <button
            onClick={() => navigate('/verticals')}
            className="flex items-center gap-2 text-neutral-400 hover:text-white mb-6"
          >
            ← Back to Verticals
          </button>

          <div className="flex items-start gap-6">
            <span className="text-6xl">🛡️</span>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-sm font-medium">
                  ⭐ Wave 1 Priority
                </span>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                  🔒 92% Sovereignty
                </span>
              </div>
              <h1 className="text-4xl font-bold mb-4">Insurance</h1>
              <p className="text-xl text-neutral-300 max-w-3xl mb-6">
                Underwriting optimization and claims intelligence across 50+ regulatory
                jurisdictions. Real-time loss ratio monitoring and fraud detection.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => navigate('/cortex/council?vertical=insurance')}
                  className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  <span>🏛️</span> Launch Insurance Council
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-neutral-400">Pilot Result</p>
              <p className="text-3xl font-bold text-green-400">29%</p>
              <p className="text-neutral-300">loss ratio improvement</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6 mt-12">
            {[
              { label: '18-Month ROI', value: '29%', subtext: 'loss ratio improvement' },
              { label: 'Claims Processing', value: '45%', subtext: 'faster' },
              { label: 'Fraud Detection', value: '3.2x', subtext: 'improvement' },
              { label: 'Jurisdictions', value: '50+', subtext: 'supported' },
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
              <h2 className="text-2xl font-bold mb-6">Why Datacendia for Insurance</h2>
              <div className="grid grid-cols-3 gap-6">
                {[
                  {
                    title: 'Multi-State Compliance',
                    desc: 'Navigate 50+ regulatory jurisdictions with automated compliance monitoring and filing tracking',
                    icon: '📋',
                  },
                  {
                    title: 'Real-Time Loss Ratio',
                    desc: 'Continuous monitoring with AI-powered early warning for adverse development',
                    icon: '📊',
                  },
                  {
                    title: 'Claims Fraud Detection',
                    desc: 'Pattern recognition across claims history identifies fraud 3.2x better than rules-based systems',
                    icon: '🔍',
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
                    org: 'P&C Carrier ($2B premium)',
                    quote:
                      "Loss ratio improved 29% in first year. The Council identified underwriting blind spots we'd missed for years.",
                    metric: '29% loss ratio',
                  },
                  {
                    org: 'Life Insurance Company',
                    quote:
                      'Underwriting decisions that took 2 weeks now happen in 2 days with full audit trail for regulators.',
                    metric: '2wk → 2d',
                  },
                  {
                    org: 'Claims Administrator',
                    quote:
                      'Fraud detection rate increased 3.2x while reducing false positives by 40%.',
                    metric: '3.2x fraud detection',
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
                    className="px-4 py-2 bg-orange-500/10 text-orange-400 rounded-lg border border-orange-500/30 font-medium"
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
              <h2 className="text-2xl font-bold mb-6">Insurance Agents</h2>
              <div className="grid grid-cols-2 gap-6">
                {agents.map((agent) => (
                  <div
                    key={agent.code}
                    className="bg-neutral-800 rounded-xl p-6 border border-neutral-700"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
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
              <h2 className="text-2xl font-bold mb-6">Insurance Pricing</h2>
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
                  onClick={() => navigate('/demo')}
                  className="px-8 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700"
                >
                  Request Insurance Demo
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

export default InsurancePage;
