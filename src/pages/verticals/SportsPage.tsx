// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA SPORTS / ATHLETICS VERTICAL
// Team performance, player analytics, and sports business intelligence
// =============================================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const agents = [
  {
    code: 'performance',
    name: 'Performance Director',
    purpose: 'Team analytics, game strategy, performance optimization',
    model: 'qwq:32b',
  },
  {
    code: 'scouting',
    name: 'Scouting Director',
    purpose: 'Player evaluation, draft analysis, talent identification',
    model: 'llama3.3:70b',
  },
  {
    code: 'sports-med',
    name: 'Sports Medicine',
    purpose: 'Injury prediction, recovery optimization, load management',
    model: 'qwq:32b',
  },
  {
    code: 'revenue',
    name: 'Revenue Director',
    purpose: 'Ticketing, sponsorships, media rights, merchandise',
    model: 'llama3.3:70b',
  },
];

const compliance = [
  'Salary Cap Rules',
  'League Regulations',
  'Player Union Agreements',
  'Broadcasting Rights',
  'Anti-Doping',
  'Gambling Regulations',
];

const pricing = [
  {
    package: 'Sports Starter',
    price: '$80,000',
    includes: '8 Pillars + 4 Sports Agents',
    roi: '6 months',
  },
  {
    package: 'Sports Professional',
    price: '$600,000',
    includes: '+ Predict, Crucible, Aegis',
    roi: '4 months',
  },
  {
    package: 'Sports Enterprise',
    price: '$3,000,000',
    includes: '+ Full Guardian Suite',
    roi: '3 months',
  },
  {
    package: 'Sports Franchise',
    price: '$8,000,000+',
    includes: '+ Multi-team, custom models',
    roi: '2 months',
  },
];

export const SportsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'agents' | 'pricing'>('overview');

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <div className="relative overflow-hidden border-b border-neutral-800">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-neutral-900 to-neutral-900"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <button
            onClick={() => navigate('/verticals')}
            className="flex items-center gap-2 text-neutral-400 hover:text-white mb-6"
          >
            ← Back to Verticals
          </button>

          <div className="flex items-start gap-6">
            <span className="text-6xl">🏟️</span>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                  📈 Growth Vertical
                </span>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                  🔒 90% Sovereignty
                </span>
              </div>
              <h1 className="text-4xl font-bold mb-4">Sports / Athletics</h1>
              <p className="text-xl text-neutral-300 max-w-3xl mb-6">
                Team performance optimization, player analytics, and sports business intelligence.
                From draft decisions to injury prevention to revenue optimization.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => navigate('/cortex/verticals/sports/fifa-scenarios')}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  <span>⚖️</span> FIFA/UEFA Governance Scenarios
                </button>
                <button
                  onClick={() => navigate('/cortex/verticals/sports')}
                  className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  <span>🏛️</span> Transfer Governance Dashboard
                </button>
                <button
                  onClick={() => navigate('/cortex/verticals/sports/uefa-walkthrough')}
                  className="px-6 py-3 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  <span>🛡️</span> UEFA Walkthrough
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-neutral-400">Pilot Result</p>
              <p className="text-3xl font-bold text-green-400">28%</p>
              <p className="text-neutral-300">better draft picks</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6 mt-12">
            {[
              { label: '18-Month ROI', value: '32%', subtext: 'performance gain' },
              { label: 'Injury Prediction', value: '67%', subtext: 'accuracy' },
              { label: 'Revenue Lift', value: '18%', subtext: 'ticketing + sponsors' },
              { label: 'Scouting Efficiency', value: '3x', subtext: 'prospects analyzed' },
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
            <section>
              <h2 className="text-2xl font-bold mb-6">Why Datacendia for Sports</h2>
              <div className="grid grid-cols-3 gap-6">
                {[
                  {
                    title: 'Player Analytics',
                    desc: 'AI-powered performance analysis, injury prediction, and load management across your entire roster',
                    icon: '📊',
                  },
                  {
                    title: 'Scouting Intelligence',
                    desc: 'Evaluate 10x more prospects with Council deliberation on draft picks and acquisitions',
                    icon: '🔍',
                  },
                  {
                    title: 'Revenue Optimization',
                    desc: 'Dynamic ticket pricing, sponsorship valuation, and media rights negotiation support',
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
              <h2 className="text-2xl font-bold mb-6">Customer Results</h2>
              <div className="space-y-4">
                {[
                  {
                    org: 'Professional Basketball Team',
                    quote:
                      'Injury prediction model identified 67% of soft tissue injuries before they occurred. Reduced games lost to injury by 23%.',
                    metric: '67% prediction',
                  },
                  {
                    org: 'MLB Organization',
                    quote:
                      'Draft analysis improved hit rate on picks by 28%. The Council identified undervalued prospects our scouts missed.',
                    metric: '28% better picks',
                  },
                  {
                    org: 'Sports Entertainment Company',
                    quote:
                      'Dynamic ticket pricing increased per-game revenue 18% while maintaining 97% attendance.',
                    metric: '18% revenue lift',
                  },
                ].map((cs, idx) => (
                  <div
                    key={idx}
                    className="bg-neutral-800 rounded-xl p-6 border border-neutral-700"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-neutral-300 text-lg italic">"{cs.quote}"</p>
                        <p className="text-neutral-500 mt-3">— {cs.org} (Anonymized)</p>
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
              <h2 className="text-2xl font-bold mb-6">Compliance & Regulations</h2>
              <div className="flex flex-wrap gap-2">
                {compliance.map((c) => (
                  <span
                    key={c}
                    className="px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/30 font-medium"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </section>

            <section className="bg-gradient-to-r from-emerald-900/30 to-primary-900/30 rounded-2xl p-8 border border-emerald-500/30">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Welcome Bonus</h2>
                  <h3 className="text-xl text-emerald-400 mb-4">"The Competitive Edge Report"</h3>
                  <ul className="space-y-2 text-neutral-300">
                    <li>• Analysis of your team's performance metrics vs. league benchmarks</li>
                    <li>• Injury risk assessment for current roster</li>
                    <li>• Revenue optimization opportunities (ticketing, sponsorship)</li>
                    <li>• 3-year draft strategy recommendation</li>
                  </ul>
                </div>
                <div className="text-right">
                  <p className="text-sm text-neutral-400">Perceived Value</p>
                  <p className="text-3xl font-bold text-emerald-400">$50,000–$100,000</p>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'agents' && (
          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Sports & Athletics Agents</h2>
              <div className="grid grid-cols-2 gap-6">
                {agents.map((agent) => (
                  <div
                    key={agent.code}
                    className="bg-neutral-800 rounded-xl p-6 border border-neutral-700"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
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
              <h2 className="text-2xl font-bold mb-6">Sports Analytics Overlays</h2>
              <div className="grid grid-cols-2 gap-6">
                {[
                  {
                    name: 'Injury Prediction Engine',
                    use: 'Biomechanical analysis, load monitoring, soft tissue risk scoring',
                  },
                  {
                    name: 'Draft Intelligence',
                    use: 'Prospect evaluation, career trajectory modeling, value-over-replacement',
                  },
                  {
                    name: 'Game Strategy Simulator',
                    use: 'Play-by-play simulation, matchup analysis, situational optimization',
                  },
                  {
                    name: 'Fan Revenue Optimizer',
                    use: 'Dynamic pricing, attendance forecasting, sponsor ROI modeling',
                  },
                ].map((service) => (
                  <div
                    key={service.name}
                    className="bg-neutral-800 rounded-xl p-6 border border-neutral-700"
                  >
                    <h3 className="font-semibold text-lg text-emerald-400 mb-2">{service.name}</h3>
                    <p className="text-neutral-300">{service.use}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Sports Pricing</h2>
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
                  Request Sports Demo
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

export default SportsPage;
