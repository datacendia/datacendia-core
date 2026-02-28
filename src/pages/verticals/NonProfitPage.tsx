// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA NON-PROFIT / NGO VERTICAL
// Foundations, Aid Organizations, Charities
// =============================================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const agents = [
  {
    code: 'program-dir',
    name: 'Program Director',
    purpose: 'Impact measurement, program evaluation, resource allocation',
    model: 'qwq:32b',
  },
  {
    code: 'development',
    name: 'Development Director',
    purpose: 'Donor relations, grant writing, fundraising strategy',
    model: 'llama3.3:70b',
  },
  {
    code: 'compliance',
    name: 'Compliance Officer',
    purpose: 'Grant compliance, 990 reporting, audit preparation',
    model: 'qwq:32b',
  },
  {
    code: 'advocacy',
    name: 'Advocacy Director',
    purpose: 'Policy analysis, stakeholder engagement, coalition building',
    model: 'llama3.3:70b',
  },
];

const overlays = [
  {
    name: 'Impact Measurement',
    function: 'Outcome tracking and social ROI calculation',
    integrates: 'CendiaMetrics™',
  },
  {
    name: 'Grant Compliance Tracker',
    function: 'Deadline monitoring and reporting automation',
    integrates: 'CendiaGovern™',
  },
  {
    name: 'Donor Intelligence',
    function: 'Prospect research and relationship management',
    integrates: 'CendiaPredict™',
  },
  {
    name: 'Board Decision Support',
    function: 'Governance documentation and fiduciary oversight',
    integrates: 'CendiaCouncil™',
  },
];

const compliance = [
  'IRS 501(c)(3)',
  'Form 990',
  'GAAP for NPOs',
  'State Registration',
  'Grant Requirements',
  'OFAC Screening',
  'Donor Privacy',
  'Conflict of Interest',
];

const pricing = [
  {
    package: 'Non-Profit Starter',
    price: '$24,000',
    includes: '8 Pillars + 4 NPO Agents',
    roi: '1 grant cycle',
  },
  {
    package: 'Non-Profit Professional',
    price: '$120,000',
    includes: '+ Govern, Dissent, Veto',
    roi: '6 months',
  },
  {
    package: 'Foundation Enterprise',
    price: '$500,000',
    includes: '+ Multi-program, Full Suite',
    roi: '4 months',
  },
  {
    package: 'Foundation Sovereign',
    price: '$1,500,000+',
    includes: '+ Global, Air-gapped',
    roi: '3 months',
  },
];

export const NonProfitPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'agents' | 'integrations' | 'pricing'>('overview');

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <div className="relative overflow-hidden border-b border-neutral-800">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-900/30 via-neutral-900 to-neutral-900"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <button
            onClick={() => navigate('/verticals')}
            className="flex items-center gap-2 text-neutral-400 hover:text-white mb-6"
          >
            ← Back to Verticals
          </button>

          <div className="flex items-start gap-6">
            <span className="text-6xl">🤝</span>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-pink-500/20 text-pink-400 rounded-full text-sm font-medium">
                  📊 Impact Focused
                </span>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                  ✅ Compliance Ready
                </span>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
                  💰 Donor Friendly
                </span>
              </div>
              <h1 className="text-4xl font-bold mb-4">Non-Profit / NGO</h1>
              <p className="text-xl text-neutral-300 max-w-3xl mb-6">
                Decision intelligence for foundations, charities, and aid organizations. 
                From impact measurement to grant compliance to donor relations.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => navigate('/cortex/council?vertical=nonprofit')}
                  className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  <span>🏛️</span> Launch Non-Profit Council
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-neutral-400">Pilot Result</p>
              <p className="text-3xl font-bold text-pink-400">45%</p>
              <p className="text-neutral-300">grant success rate</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6 mt-12">
            {[
              { label: 'Grant Success', value: '+45%', subtext: 'win rate' },
              { label: 'Compliance Time', value: '-60%', subtext: 'reporting hours' },
              { label: 'Donor Retention', value: '+28%', subtext: 'year-over-year' },
              { label: 'Program Efficiency', value: '92%', subtext: 'funds to mission' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700"
              >
                <p className="text-3xl font-bold text-pink-400">{stat.value}</p>
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
                className={`px-6 py-4 font-medium capitalize transition-all border-b-2 ${activeTab === tab ? 'border-pink-500 text-white' : 'border-transparent text-neutral-400 hover:text-white'}`}
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
              <h2 className="text-2xl font-bold mb-6">Why Datacendia for Non-Profits</h2>
              <div className="grid grid-cols-3 gap-6">
                {[
                  {
                    title: 'Impact Measurement',
                    desc: 'Quantify and communicate your social impact with data-driven outcome tracking.',
                    icon: '📊',
                  },
                  {
                    title: 'Grant Compliance',
                    desc: 'Automated reporting, deadline tracking, and audit-ready documentation.',
                    icon: '✅',
                  },
                  {
                    title: 'Donor Intelligence',
                    desc: 'Prospect research and relationship management to grow sustainable funding.',
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
              <h2 className="text-2xl font-bold mb-6">Compliance & Standards</h2>
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

            <section className="bg-gradient-to-r from-pink-900/30 to-purple-900/30 rounded-2xl p-8 border border-pink-500/30">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Non-Profit Discount</h2>
                  <h3 className="text-xl text-pink-400 mb-4">
                    50% off for qualifying 501(c)(3) organizations
                  </h3>
                  <ul className="space-y-2 text-neutral-300">
                    <li>• Verified 501(c)(3) status required</li>
                    <li>• Annual budget under $10M</li>
                    <li>• Mission-aligned use cases</li>
                    <li>• Case study participation</li>
                  </ul>
                </div>
                <div className="text-right">
                  <p className="text-sm text-neutral-400">Starting at</p>
                  <p className="text-3xl font-bold text-pink-400">$12,000/yr</p>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'agents' && (
          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Non-Profit-Specific AI Agents</h2>
              <div className="grid grid-cols-2 gap-6">
                {agents.map((agent) => (
                  <div
                    key={agent.code}
                    className="bg-neutral-800 rounded-xl p-6 border border-neutral-700"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-2 py-1 bg-pink-500/20 text-pink-400 rounded font-mono text-sm">
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
              <h2 className="text-2xl font-bold mb-6">Non-Profit Overlays</h2>
              <div className="grid grid-cols-2 gap-6">
                {overlays.map((overlay) => (
                  <div
                    key={overlay.name}
                    className="bg-neutral-800 rounded-xl p-6 border border-neutral-700"
                  >
                    <h3 className="text-lg font-semibold mb-2">{overlay.name}</h3>
                    <p className="text-neutral-400 mb-3">{overlay.function}</p>
                    <span className="text-xs text-pink-400">Integrates: {overlay.integrates}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'integrations' && (
          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Non-Profit System Integrations</h2>
              <div className="grid grid-cols-3 gap-6">
                {[
                  { name: 'Salesforce NPSP', type: 'CRM', status: 'Native' },
                  { name: 'Blackbaud', type: 'Fundraising', status: 'Native' },
                  { name: 'Fluxx', type: 'Grants Management', status: 'Adapter' },
                  { name: 'Sage Intacct', type: 'Accounting', status: 'Native' },
                  { name: 'Submittable', type: 'Applications', status: 'Adapter' },
                  { name: 'Classy', type: 'Fundraising', status: 'Native' },
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
              <h2 className="text-2xl font-bold mb-6">Non-Profit Pricing Tiers</h2>
              <div className="grid grid-cols-4 gap-6">
                {pricing.map((tier, idx) => (
                  <div
                    key={tier.package}
                    className={`rounded-xl p-6 border ${idx === 0 ? 'bg-pink-900/20 border-pink-500/50' : 'bg-neutral-800 border-neutral-700'}`}
                  >
                    <h3 className="text-lg font-semibold mb-2">{tier.package}</h3>
                    <p className="text-3xl font-bold text-pink-400 mb-4">{tier.price}</p>
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

export default NonProfitPage;
