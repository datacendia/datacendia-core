// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA PROFESSIONAL SERVICES VERTICAL
// Consulting, accounting, and advisory firm intelligence
// =============================================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const agents = [
  {
    code: 'partner',
    name: 'Managing Partner',
    purpose: 'Practice strategy, client portfolio, partner decisions',
    model: 'llama3.3:70b',
  },
  {
    code: 'engagement',
    name: 'Engagement Manager',
    purpose: 'Project staffing, utilization, delivery optimization',
    model: 'qwq:32b',
  },
  {
    code: 'bd',
    name: 'Business Development',
    purpose: 'Pipeline management, proposal strategy, client expansion',
    model: 'llama3.3:70b',
  },
  {
    code: 'quality',
    name: 'Quality & Risk',
    purpose: 'Engagement risk, independence, professional standards',
    model: 'qwq:32b',
  },
];

const compliance = [
  'AICPA Standards',
  'SEC Independence',
  'PCAOB',
  'State Bar Rules',
  'Consulting Ethics',
  'Client Confidentiality',
  'SOX',
];

const pricing = [
  {
    package: 'Services Starter',
    price: '$60,000',
    includes: '8 Pillars + 4 Services Agents',
    roi: '6 months',
  },
  {
    package: 'Services Professional',
    price: '$400,000',
    includes: '+ Predict, Eternal, Panopticon',
    roi: '4 months',
  },
  {
    package: 'Services Enterprise',
    price: '$2,000,000',
    includes: '+ Full Guardian Suite',
    roi: '3 months',
  },
  {
    package: 'Services Sovereign',
    price: '$5,000,000+',
    includes: '+ Multi-practice, custom',
    roi: '2 months',
  },
];

export const ProfessionalServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'agents' | 'pricing'>('overview');

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <div className="relative overflow-hidden border-b border-neutral-800">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-neutral-900 to-neutral-900"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <button
            onClick={() => navigate('/verticals')}
            className="flex items-center gap-2 text-neutral-400 hover:text-white mb-6"
          >
            ← Back to Verticals
          </button>

          <div className="flex items-start gap-6">
            <span className="text-6xl">💼</span>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                  📈 Growth Vertical
                </span>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                  🔒 92% Sovereignty
                </span>
              </div>
              <h1 className="text-4xl font-bold mb-4">Professional Services</h1>
              <p className="text-xl text-neutral-300 max-w-3xl mb-6">
                Consulting, accounting, legal, and advisory firm intelligence. From staffing
                optimization to client development to knowledge management.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => navigate('/cortex/council?vertical=professional-services')}
                  className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  <span>🏛️</span> Launch Services Council
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-neutral-400">Pilot Result</p>
              <p className="text-3xl font-bold text-green-400">31%</p>
              <p className="text-neutral-300">utilization improvement</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6 mt-12">
            {[
              { label: '18-Month ROI', value: '28%', subtext: 'revenue lift' },
              { label: 'Utilization', value: '+31%', subtext: 'improvement' },
              { label: 'Proposal Win Rate', value: '+18%', subtext: 'improvement' },
              { label: 'Knowledge Reuse', value: '4x', subtext: 'faster search' },
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
              <h2 className="text-2xl font-bold mb-6">Why Datacendia for Professional Services</h2>
              <div className="grid grid-cols-3 gap-6">
                {[
                  {
                    title: 'Staffing Optimization',
                    desc: 'AI-powered resource allocation matching skills, availability, and development goals to client needs',
                    icon: '👥',
                  },
                  {
                    title: 'Knowledge Intelligence',
                    desc: 'Institutional knowledge capture and retrieval - find relevant work product 4x faster',
                    icon: '🧠',
                  },
                  {
                    title: 'Client Development',
                    desc: 'Pipeline prioritization, proposal strategy, and cross-selling recommendations with audit trail',
                    icon: '📈',
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
                    org: 'Regional CPA Firm',
                    quote:
                      'Staff utilization improved 31% through AI-optimized scheduling. We reduced unbilled time by 45% in busy season.',
                    metric: '31% utilization',
                  },
                  {
                    org: 'Management Consultancy',
                    quote:
                      'Proposal win rate increased 18% by matching the right team to each opportunity. The Council sees patterns our partners miss.',
                    metric: '18% win rate',
                  },
                  {
                    org: 'Law Firm (200 attorneys)',
                    quote:
                      'Associates find relevant precedents 4x faster. Knowledge that used to retire with partners is now institutional.',
                    metric: '4x faster research',
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
                    className="px-4 py-2 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/30 font-medium"
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
              <h2 className="text-2xl font-bold mb-6">Professional Services Agents</h2>
              <div className="grid grid-cols-2 gap-6">
                {agents.map((agent) => (
                  <div
                    key={agent.code}
                    className="bg-neutral-800 rounded-xl p-6 border border-neutral-700"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center">
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
              <h2 className="text-2xl font-bold mb-6">Professional Services Pricing</h2>
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
                  Request Services Demo
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

export default ProfessionalServicesPage;
