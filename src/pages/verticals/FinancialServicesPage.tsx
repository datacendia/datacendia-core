// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA FINANCIAL SERVICES VERTICAL
// Fraud detection, regulatory intelligence, and credit decisioning
// =============================================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const agents = [
  {
    code: 'quant',
    name: 'Quantitative Analyst',
    purpose: 'Financial modeling, derivatives pricing, risk quantification',
    model: 'qwq:32b',
  },
  {
    code: 'pm',
    name: 'Portfolio Manager',
    purpose: 'Asset allocation, investment strategy, rebalancing decisions',
    model: 'llama3.3:70b',
  },
  {
    code: 'cro-finance',
    name: 'Credit Risk Officer',
    purpose: 'Credit analysis, Basel compliance, counterparty risk',
    model: 'qwq:32b',
  },
  {
    code: 'treasury',
    name: 'Treasury Analyst',
    purpose: 'Cash management, FX exposure, liquidity planning',
    model: 'llama3.3:70b',
  },
];

const overlays = [
  {
    name: 'Fraud Detection Agent',
    function: 'Real-time transaction anomaly detection, pattern recognition',
    integrates: 'CendiaAegis™',
  },
  {
    name: 'SEC Compliance Radar',
    function: '10-K/10-Q deadline tracking, material event monitoring',
    integrates: 'CendiaPanopticon™',
  },
  {
    name: 'Basel Capital Calculator',
    function: 'Automated RWA computation, capital adequacy alerts',
    integrates: 'CendiaPredict™',
  },
  {
    name: 'AML Pattern Matcher',
    function: 'Suspicious activity detection, SAR workflow automation',
    integrates: 'CendiaGuard™',
  },
];

const compliance = [
  'SOX',
  'Basel III/IV',
  'GDPR',
  'CCPA',
  'GLBA',
  'AML/BSA',
  'CFPB',
  'OCC',
  'FDIC',
  'Fed SR Letters',
  'FINRA',
  'SEC',
  'CCAR/DFAST',
];

const pricing = [
  {
    package: 'Banking Starter',
    price: '$120,000',
    includes: '8 Pillars + 4 Finance Agents',
    roi: '6 months',
  },
  {
    package: 'Banking Professional',
    price: '$800,000',
    includes: '+ Panopticon, Crucible, Aegis',
    roi: '4 months',
  },
  {
    package: 'Banking Enterprise',
    price: '$3,000,000',
    includes: '+ Full Guardian Suite + Ledger',
    roi: '3 months',
  },
  {
    package: 'Banking Sovereign',
    price: '$8,000,000+',
    includes: '+ On-premise, air-gapped, custom',
    roi: '2 months',
  },
];

export const FinancialServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'agents' | 'integrations' | 'pricing'>(
    'overview'
  );

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-neutral-800">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-neutral-900 to-neutral-900"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <button
            onClick={() => navigate('/verticals')}
            className="flex items-center gap-2 text-neutral-400 hover:text-white mb-6"
          >
            ← Back to Verticals
          </button>

          <div className="flex items-start gap-6">
            <span className="text-6xl">💰</span>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-sm font-medium">
                  ⭐ Wave 1 Priority
                </span>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                  🔒 98% Sovereignty
                </span>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
                  16% Market Share
                </span>
              </div>
              <h1 className="text-4xl font-bold mb-4">Financial Services / Banking</h1>
              <p className="text-xl text-neutral-300 max-w-3xl mb-6">
                Fraud detection, regulatory intelligence, and credit decisioning with full audit
                trail. Meet Basel III Endgame, CFPB 1071, and expanding state privacy laws.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => navigate('/cortex/council?vertical=finance')}
                  className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  <span>🏛️</span> Launch Finance Council
                </button>
                <button
                  onClick={() => navigate('/cortex/enterprise/financial')}
                  className="px-6 py-3 border border-green-500/50 text-green-400 hover:bg-green-500/10 rounded-lg font-medium transition-colors"
                >
                  🏦 CendiaFinancial™
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-neutral-400">Pilot Result</p>
              <p className="text-3xl font-bold text-green-400">40%</p>
              <p className="text-neutral-300">fraud reduction</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6 mt-12">
            {[
              { label: '18-Month ROI', value: '34%', subtext: 'efficiency gain' },
              { label: 'Compliance Savings', value: '$2.1M', subtext: 'average' },
              { label: 'Credit Decision', value: '4.7→1.2d', subtext: 'cycle time' },
              { label: 'Time to Value', value: '6 weeks', subtext: 'to first ROI' },
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

      {/* Tabs */}
      <div className="border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {['overview', 'agents', 'integrations', 'pricing'].map((tab) => (
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
              <h2 className="text-2xl font-bold mb-6">Why Datacendia for Financial Services</h2>
              <div className="grid grid-cols-3 gap-6">
                {[
                  {
                    title: 'Basel III Endgame Ready',
                    desc: 'Automated RWA computation and capital adequacy monitoring with full audit trail',
                    icon: '📊',
                  },
                  {
                    title: 'Real-Time Fraud Detection',
                    desc: 'AI-powered transaction anomaly detection that identified 3 vulnerability patterns banks missed',
                    icon: '🛡️',
                  },
                  {
                    title: 'CFPB 1071 Compliance',
                    desc: 'Panopticon flagged compliance gaps 6 months before auditors found them',
                    icon: '📋',
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
                    org: 'Regional Bank ($8B assets)',
                    quote:
                      'Reduced fraud losses 40% via CendiaAegis™ RedTeam simulations. The Council identified 3 vulnerability patterns our existing systems missed.',
                    metric: '40% fraud reduction',
                  },
                  {
                    org: 'Credit Union ($2B assets)',
                    quote:
                      'Cut regulatory response time from 14 days to 3 days. Panopticon flagged CFPB 1071 gaps 6 months before our compliance team.',
                    metric: '14d → 3d response',
                  },
                  {
                    org: 'Asset Manager ($15B AUM)',
                    quote:
                      'Portfolio rebalancing decisions that took 2 weeks now happen in 2 hours with full audit trail.',
                    metric: '2wk → 2hr decisions',
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
                    className="px-4 py-2 bg-green-500/10 text-green-400 rounded-lg border border-green-500/30 font-medium"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </section>

            <section className="bg-gradient-to-r from-green-900/30 to-primary-900/30 rounded-2xl p-8 border border-green-500/30">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Welcome Bonus</h2>
                  <h3 className="text-xl text-green-400 mb-4">
                    "The Regulatory Exposure Snapshot"
                  </h3>
                  <ul className="space-y-2 text-neutral-300">
                    <li>• Scan of public filings + regulatory announcements</li>
                    <li>• Map of 5-7 regulatory risks specific to institution</li>
                    <li>• Comparison to 3 peer institutions' compliance postures</li>
                    <li>• Timeline of upcoming regulatory deadlines</li>
                  </ul>
                </div>
                <div className="text-right">
                  <p className="text-sm text-neutral-400">Perceived Value</p>
                  <p className="text-3xl font-bold text-green-400">$25,000–$40,000</p>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'agents' && (
          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Financial Services Agents</h2>
              <div className="grid grid-cols-2 gap-6">
                {agents.map((agent) => (
                  <div
                    key={agent.code}
                    className="bg-neutral-800 rounded-xl p-6 border border-neutral-700"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
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

            <section>
              <h2 className="text-2xl font-bold mb-6">Vertical Overlays</h2>
              <div className="bg-neutral-800 rounded-xl border border-neutral-700 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-neutral-900">
                    <tr>
                      <th className="text-left p-4 font-medium text-neutral-400">Overlay</th>
                      <th className="text-left p-4 font-medium text-neutral-400">Function</th>
                      <th className="text-left p-4 font-medium text-neutral-400">
                        Integrates With
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {overlays.map((o) => (
                      <tr key={o.name} className="border-t border-neutral-700">
                        <td className="p-4 font-medium">{o.name}</td>
                        <td className="p-4 text-neutral-300">{o.function}</td>
                        <td className="p-4">
                          <code className="text-primary-400">{o.integrates}</code>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'integrations' && (
          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Integration Reality</h2>
              <div className="bg-neutral-800 rounded-xl border border-neutral-700 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-neutral-900">
                    <tr>
                      <th className="text-left p-4 font-medium text-neutral-400">System</th>
                      <th className="text-left p-4 font-medium text-neutral-400">Difficulty</th>
                      <th className="text-left p-4 font-medium text-neutral-400">Timeline</th>
                      <th className="text-left p-4 font-medium text-neutral-400">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        system: 'Core Banking (FIS, Jack Henry)',
                        difficulty: 'medium',
                        timeline: '4-8 weeks',
                        notes: 'API-based, standard connectors',
                      },
                      {
                        system: 'Trading Platforms (Bloomberg, Refinitiv)',
                        difficulty: 'easy',
                        timeline: '1-2 weeks',
                        notes: 'REST APIs available',
                      },
                      {
                        system: 'Legacy Mainframe (AS/400, COBOL)',
                        difficulty: 'hard',
                        timeline: '3-6 months',
                        notes: 'Requires services engagement',
                      },
                      {
                        system: "Risk Systems (SAS, Moody's)",
                        difficulty: 'medium',
                        timeline: '4-6 weeks',
                        notes: 'Batch file integration typical',
                      },
                    ].map((int) => (
                      <tr key={int.system} className="border-t border-neutral-700">
                        <td className="p-4 font-medium">{int.system}</td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${int.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' : int.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}
                          >
                            {int.difficulty === 'easy'
                              ? '✅ Easy'
                              : int.difficulty === 'medium'
                                ? '⚠️ Medium'
                                : '⛔ Hard'}
                          </span>
                        </td>
                        <td className="p-4 text-neutral-300">{int.timeline}</td>
                        <td className="p-4 text-neutral-400">{int.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
            <section className="bg-yellow-500/10 rounded-xl p-6 border border-yellow-500/30">
              <h3 className="font-semibold text-yellow-400 mb-2">⚠️ What Breaks</h3>
              <p className="text-neutral-300">
                Legacy mainframe integration requires 3–6 months professional services. Budget
                $150k–$300k for complex core banking connections.
              </p>
            </section>
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Financial Services Pricing</h2>
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
                  Request Banking Demo
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

export default FinancialServicesPage;
