// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA MEDIA / ENTERTAINMENT VERTICAL
// Content strategy, audience intelligence, and rights management
// =============================================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const agents = [
  {
    code: 'content',
    name: 'Content Strategist',
    purpose: 'Programming decisions, content acquisition, greenlight analysis',
    model: 'llama3.3:70b',
  },
  {
    code: 'audience',
    name: 'Audience Analyst',
    purpose: 'Viewership prediction, engagement optimization, demographic insights',
    model: 'qwq:32b',
  },
  {
    code: 'rights',
    name: 'Rights Manager',
    purpose: 'Licensing deals, IP valuation, distribution strategy',
    model: 'qwq:32b',
  },
  {
    code: 'ad-ops',
    name: 'Ad Operations',
    purpose: 'Inventory optimization, yield management, programmatic strategy',
    model: 'llama3.3:70b',
  },
];

const compliance = [
  'FCC Regulations',
  'COPPA',
  'Advertising Standards',
  'Content Ratings',
  'Music Licensing',
  'SAG-AFTRA',
  'International Distribution',
];

const pricing = [
  {
    package: 'Media Starter',
    price: '$70,000',
    includes: '8 Pillars + 4 Media Agents',
    roi: '6 months',
  },
  {
    package: 'Media Professional',
    price: '$600,000',
    includes: '+ Predict, Crucible, Eternal',
    roi: '4 months',
  },
  {
    package: 'Media Enterprise',
    price: '$3,000,000',
    includes: '+ Full Guardian Suite',
    roi: '3 months',
  },
  {
    package: 'Media Sovereign',
    price: '$8,000,000+',
    includes: '+ Studio-scale, custom',
    roi: '2 months',
  },
];

export const MediaEntertainmentPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'agents' | 'pricing'>('overview');

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <div className="relative overflow-hidden border-b border-neutral-800">
        <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-900/20 via-neutral-900 to-neutral-900"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <button
            onClick={() => navigate('/verticals')}
            className="flex items-center gap-2 text-neutral-400 hover:text-white mb-6"
          >
            ← Back to Verticals
          </button>

          <div className="flex items-start gap-6">
            <span className="text-6xl">🎬</span>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                  📈 Growth Vertical
                </span>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                  🔒 80% Sovereignty
                </span>
              </div>
              <h1 className="text-4xl font-bold mb-4">Media / Entertainment</h1>
              <p className="text-xl text-neutral-300 max-w-3xl mb-6">
                Content strategy, audience intelligence, and rights management. From greenlight
                decisions to distribution optimization to ad yield.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => navigate('/cortex/council?vertical=media')}
                  className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  <span>🏛️</span> Launch Media Council
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-neutral-400">Pilot Result</p>
              <p className="text-3xl font-bold text-green-400">35%</p>
              <p className="text-neutral-300">better content ROI</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6 mt-12">
            {[
              { label: '18-Month ROI', value: '29%', subtext: 'revenue lift' },
              { label: 'Content Decisions', value: '60%', subtext: 'faster greenlight' },
              { label: 'Ad Yield', value: '+24%', subtext: 'improvement' },
              { label: 'Audience Prediction', value: '78%', subtext: 'accuracy' },
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
              <h2 className="text-2xl font-bold mb-6">Why Datacendia for Media</h2>
              <div className="grid grid-cols-3 gap-6">
                {[
                  {
                    title: 'Greenlight Intelligence',
                    desc: 'AI-powered content investment decisions with audience prediction, comp analysis, and risk modeling',
                    icon: '🎯',
                  },
                  {
                    title: 'Audience Analytics',
                    desc: 'Real-time viewership prediction, engagement optimization, and demographic insights across platforms',
                    icon: '👥',
                  },
                  {
                    title: 'Rights Optimization',
                    desc: 'IP valuation, licensing strategy, and distribution window optimization with full audit trail',
                    icon: '📜',
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
                    org: 'Streaming Platform',
                    quote:
                      'Content ROI improved 35% by predicting audience response before greenlight. The Council identified 3 shows our team was wrong about.',
                    metric: '35% better ROI',
                  },
                  {
                    org: 'Broadcast Network',
                    quote:
                      'Ad yield optimization increased revenue 24% without adding inventory. AI found pricing opportunities we were leaving on the table.',
                    metric: '24% ad yield',
                  },
                  {
                    org: 'Production Studio',
                    quote:
                      'Greenlight decisions that took 6 weeks now happen in 6 days with complete market analysis and risk assessment.',
                    metric: '6wk → 6d',
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
              <h2 className="text-2xl font-bold mb-6">Compliance Frameworks</h2>
              <div className="flex flex-wrap gap-2">
                {compliance.map((c) => (
                  <span
                    key={c}
                    className="px-4 py-2 bg-fuchsia-500/10 text-fuchsia-400 rounded-lg border border-fuchsia-500/30 font-medium"
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
              <h2 className="text-2xl font-bold mb-6">Media & Entertainment Agents</h2>
              <div className="grid grid-cols-2 gap-6">
                {agents.map((agent) => (
                  <div
                    key={agent.code}
                    className="bg-neutral-800 rounded-xl p-6 border border-neutral-700"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-fuchsia-500/20 rounded-full flex items-center justify-center">
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
              <h2 className="text-2xl font-bold mb-6">Media Pricing</h2>
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
                  Request Media Demo
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

export default MediaEntertainmentPage;
