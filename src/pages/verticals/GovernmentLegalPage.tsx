// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA GOVERNMENT & LEGAL VERTICAL
// Sovereign AI for policy, procurement, and contract intelligence
// =============================================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const agents = [
  {
    code: 'policy',
    name: 'Policy Analyst',
    purpose: 'Regulatory impact analysis, policy drafting, legislative tracking',
    model: 'llama3.3:70b',
  },
  {
    code: 'procurement',
    name: 'Procurement Officer',
    purpose: 'Vendor evaluation, contract analysis, compliance verification',
    model: 'qwq:32b',
  },
  {
    code: 'legal-counsel',
    name: 'Legal Counsel',
    purpose: 'Legal risk assessment, contract review, litigation support',
    model: 'qwq:32b',
  },
  {
    code: 'ethics-gov',
    name: 'Ethics Officer',
    purpose: 'Conflict of interest, FOIA compliance, transparency requirements',
    model: 'llama3.3:70b',
  },
];

const compliance = [
  'FedRAMP',
  'FISMA',
  'EU AI Act',
  'FOIA',
  'ADA Section 508',
  'NIST 800-53',
  'StateRAMP',
  'ITAR',
  'CMMC',
];

const pricing = [
  {
    package: 'Government Starter',
    price: '$150,000',
    includes: '8 Pillars + 4 Gov Agents',
    roi: '8 months',
  },
  {
    package: 'Government Professional',
    price: '$1,500,000',
    includes: '+ Panopticon, Aegis, Ledger',
    roi: '5 months',
  },
  {
    package: 'Government Enterprise',
    price: '$8,000,000',
    includes: '+ Full Guardian Suite',
    roi: '3 months',
  },
  {
    package: 'Government Sovereign',
    price: '$25,000,000+',
    includes: '+ Nation-scale, SCIF-ready',
    roi: '2 months',
  },
];

export const GovernmentLegalPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'agents' | 'integrations' | 'pricing'>(
    'overview'
  );

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <div className="relative overflow-hidden border-b border-neutral-800">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-neutral-900 to-neutral-900"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <button
            onClick={() => navigate('/verticals')}
            className="flex items-center gap-2 text-neutral-400 hover:text-white mb-6"
          >
            ← Back to Verticals
          </button>

          <div className="flex items-start gap-6">
            <span className="text-6xl">🏛️</span>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-sm font-medium">
                  ⭐ Wave 1 Priority
                </span>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                  🔒 100% Sovereignty
                </span>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
                  19% Market Share
                </span>
              </div>
              <h1 className="text-4xl font-bold mb-4">Government & Legal Services</h1>
              <p className="text-xl text-neutral-300 max-w-3xl mb-6">
                Sovereign AI platform for policy analysis, procurement decisions, and contract
                intelligence. SCIF-ready deployment meets EU AI Act sovereignty mandates.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => navigate('/cortex/council?vertical=government')}
                  className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  <span>🏛️</span> Launch Government Council
                </button>
                <button
                  onClick={() => navigate('/cortex/enterprise/defense-stack')}
                  className="px-6 py-3 border border-purple-500/50 text-purple-400 hover:bg-purple-500/10 rounded-lg font-medium transition-colors"
                >
                  🛡️ CendiaDefense™
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-neutral-400">Pilot Result</p>
              <p className="text-3xl font-bold text-green-400">60%</p>
              <p className="text-neutral-300">faster contract review</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6 mt-12">
            {[
              { label: '18-Month ROI', value: '38%', subtext: 'highest of all verticals' },
              { label: 'Contract Review', value: '60%', subtext: 'faster' },
              { label: 'Procurement Savings', value: '$4.2M', subtext: 'avg per agency' },
              { label: 'FedRAMP Ready', value: '100%', subtext: 'compliance' },
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
              <h2 className="text-2xl font-bold mb-6">Why Datacendia for Government</h2>
              <div className="grid grid-cols-3 gap-6">
                {[
                  {
                    title: 'SCIF-Ready Deployment',
                    desc: 'Full air-gapped operation for classified environments. No data ever leaves your infrastructure.',
                    icon: '🔒',
                  },
                  {
                    title: 'EU AI Act Compliant',
                    desc: "2025 sovereignty mandates require audit trails for AI decisions. We're already compliant.",
                    icon: '📋',
                  },
                  {
                    title: 'FedRAMP Authorization',
                    desc: 'Meeting federal security requirements with continuous monitoring and ATO support.',
                    icon: '🛡️',
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
                    org: 'Federal Agency',
                    quote:
                      'Contract review cycle reduced from 45 days to 18 days. The Council identified 12 risk clauses our team missed in initial review.',
                    metric: '60% faster',
                  },
                  {
                    org: 'State Government',
                    quote:
                      'Procurement decisions that took 6 months now happen in 6 weeks with full audit trail for legislative oversight.',
                    metric: '6mo → 6wk',
                  },
                  {
                    org: 'Legal Services Provider',
                    quote:
                      'Case research time cut by 70%. Associates now focus on strategy instead of document review.',
                    metric: '70% time saved',
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
                    className="px-4 py-2 bg-purple-500/10 text-purple-400 rounded-lg border border-purple-500/30 font-medium"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </section>

            <section className="bg-gradient-to-r from-purple-900/30 to-primary-900/30 rounded-2xl p-8 border border-purple-500/30">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Welcome Bonus</h2>
                  <h3 className="text-xl text-purple-400 mb-4">
                    "The Regulatory Landscape Briefing"
                  </h3>
                  <ul className="space-y-2 text-neutral-300">
                    <li>• Analysis of upcoming regulatory changes affecting your jurisdiction</li>
                    <li>• AI policy comparison with peer agencies/states</li>
                    <li>• Procurement bottleneck assessment</li>
                    <li>• FOIA request pattern analysis</li>
                  </ul>
                </div>
                <div className="text-right">
                  <p className="text-sm text-neutral-400">Perceived Value</p>
                  <p className="text-3xl font-bold text-purple-400">$40,000–$75,000</p>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'agents' && (
          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Government & Legal Agents</h2>
              <div className="grid grid-cols-2 gap-6">
                {agents.map((agent) => (
                  <div
                    key={agent.code}
                    className="bg-neutral-800 rounded-xl p-6 border border-neutral-700"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
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
              <h2 className="text-2xl font-bold mb-6">Guardian Suite for Government</h2>
              <div className="grid grid-cols-2 gap-6">
                {[
                  {
                    name: 'CendiaAegis™',
                    use: 'Nation-state threat intelligence, critical infrastructure protection',
                  },
                  {
                    name: 'CendiaPanopticon™',
                    use: 'Legislative tracking, regulatory change monitoring, compliance verification',
                  },
                  {
                    name: 'CendiaLedger™',
                    use: 'Immutable audit trail for congressional oversight, FOIA compliance',
                  },
                  {
                    name: 'CendiaDefenseStack™',
                    use: 'SCIF deployment, classified document handling, NATO compatibility',
                  },
                ].map((service) => (
                  <div
                    key={service.name}
                    className="bg-neutral-800 rounded-xl p-6 border border-neutral-700"
                  >
                    <h3 className="font-semibold text-lg text-purple-400 mb-2">{service.name}</h3>
                    <p className="text-neutral-300">{service.use}</p>
                  </div>
                ))}
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
                        system: 'SAP/Oracle ERP',
                        difficulty: 'medium',
                        timeline: '6-10 weeks',
                        notes: 'Standard government connectors',
                      },
                      {
                        system: 'Case Management (Tyler, Odyssey)',
                        difficulty: 'medium',
                        timeline: '8-12 weeks',
                        notes: 'API access varies by vendor',
                      },
                      {
                        system: 'Document Management (SharePoint)',
                        difficulty: 'easy',
                        timeline: '2-4 weeks',
                        notes: 'Native integration',
                      },
                      {
                        system: 'Legacy Systems (COBOL, Mainframe)',
                        difficulty: 'hard',
                        timeline: '4-8 months',
                        notes: 'Custom middleware required',
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
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Government Pricing</h2>
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
                  Request Government Demo
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

export default GovernmentLegalPage;
