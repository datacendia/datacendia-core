// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA PHARMACEUTICAL VERTICAL
// Pipeline decisions and regulatory acceleration for life sciences
// =============================================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const agents = [
  {
    code: 'cso',
    name: 'Chief Scientific Officer',
    purpose: 'R&D strategy, pipeline prioritization, scientific advisory',
    model: 'llama3.3:70b',
  },
  {
    code: 'regulatory',
    name: 'Regulatory Affairs',
    purpose: 'FDA submissions, global filing strategy, compliance tracking',
    model: 'qwq:32b',
  },
  {
    code: 'clinical-ops',
    name: 'Clinical Operations',
    purpose: 'Trial design, site selection, enrollment optimization',
    model: 'qwq:32b',
  },
  {
    code: 'medical-affairs',
    name: 'Medical Affairs',
    purpose: 'KOL engagement, medical education, publication strategy',
    model: 'llama3.3:70b',
  },
];

const compliance = [
  '21 CFR Part 11',
  'FDA AI Guidance',
  'GxP',
  'ICH Guidelines',
  'EMA Requirements',
  'HIPAA',
  'Clinical Trial Regulations',
  'Pharmacovigilance',
];

const pricing = [
  {
    package: 'Pharma Starter',
    price: '$150,000',
    includes: '8 Pillars + 4 Pharma Agents',
    roi: '8 months',
  },
  {
    package: 'Pharma Professional',
    price: '$1,500,000',
    includes: '+ Panopticon, Crucible, Eternal',
    roi: '5 months',
  },
  {
    package: 'Pharma Enterprise',
    price: '$6,000,000',
    includes: '+ Full Guardian Suite',
    roi: '3 months',
  },
  {
    package: 'Pharma Sovereign',
    price: '$15,000,000+',
    includes: '+ Global, air-gapped, custom',
    roi: '2 months',
  },
];

export const PharmaceuticalPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'agents' | 'pricing'>('overview');

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <div className="relative overflow-hidden border-b border-neutral-800">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-900/20 via-neutral-900 to-neutral-900"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <button
            onClick={() => navigate('/verticals')}
            className="flex items-center gap-2 text-neutral-400 hover:text-white mb-6"
          >
            ← Back to Verticals
          </button>

          <div className="flex items-start gap-6">
            <span className="text-6xl">💊</span>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-sm font-medium">
                  ⭐ Wave 1 Priority
                </span>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                  🔒 95% Sovereignty
                </span>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
                  12% Market Share
                </span>
              </div>
              <h1 className="text-4xl font-bold mb-4">Pharmaceutical / Biotech</h1>
              <p className="text-xl text-neutral-300 max-w-3xl mb-6">
                Pipeline decisions and regulatory acceleration for life sciences. 21 CFR Part 11
                compliant with full audit trail for FDA submissions.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => navigate('/cortex/council?vertical=pharmaceutical')}
                  className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  <span>🏛️</span> Launch Pharma Council
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-neutral-400">Pilot Result</p>
              <p className="text-3xl font-bold text-green-400">31%</p>
              <p className="text-neutral-300">faster Phase II decisions</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6 mt-12">
            {[
              { label: '18-Month ROI', value: '31%', subtext: 'faster trials' },
              { label: 'Pipeline Decisions', value: '$4M+', subtext: 'per month at stake' },
              { label: 'Submission Prep', value: '40%', subtext: 'faster' },
              { label: 'Part 11 Compliant', value: '100%', subtext: 'audit-ready' },
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
              <h2 className="text-2xl font-bold mb-6">Why Datacendia for Pharma</h2>
              <div className="grid grid-cols-3 gap-6">
                {[
                  {
                    title: '21 CFR Part 11 Compliant',
                    desc: 'Full electronic record and signature compliance with automated audit trail generation',
                    icon: '📋',
                  },
                  {
                    title: 'FDA AI Guidance Ready',
                    desc: 'Documentation and validation framework aligned with emerging FDA AI/ML guidance',
                    icon: '🏛️',
                  },
                  {
                    title: 'Pipeline Intelligence',
                    desc: 'AI-powered go/no-go decisions with Council deliberation on $4M+/month decisions',
                    icon: '🧬',
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
                    org: 'Mid-Size Biotech',
                    quote:
                      'Phase II go/no-go decisions that took 6 weeks now happen in 4 weeks with complete documentation for investors.',
                    metric: '31% faster',
                  },
                  {
                    org: 'Global Pharma Company',
                    quote:
                      'Regulatory submission prep time cut by 40%. The Council identified 23 documentation gaps before FDA review.',
                    metric: '40% faster prep',
                  },
                  {
                    org: 'CRO Partner',
                    quote:
                      'Site selection decisions improved by analyzing 10x more data points than our previous process.',
                    metric: '10x more data',
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
                    className="px-4 py-2 bg-pink-500/10 text-pink-400 rounded-lg border border-pink-500/30 font-medium"
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
              <h2 className="text-2xl font-bold mb-6">Pharmaceutical Agents</h2>
              <div className="grid grid-cols-2 gap-6">
                {agents.map((agent) => (
                  <div
                    key={agent.code}
                    className="bg-neutral-800 rounded-xl p-6 border border-neutral-700"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center">
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
              <h2 className="text-2xl font-bold mb-6">Pharmaceutical Pricing</h2>
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
                  Request Pharma Demo
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

export default PharmaceuticalPage;
