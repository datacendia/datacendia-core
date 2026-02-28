// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA CONSTRUCTION / ENGINEERING VERTICAL
// Contractors, AEC, Infrastructure
// =============================================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const agents = [
  {
    code: 'project-mgr',
    name: 'Project Manager',
    purpose: 'Schedule optimization, resource allocation, milestone tracking',
    model: 'qwq:32b',
  },
  {
    code: 'safety',
    name: 'Safety Director',
    purpose: 'OSHA compliance, incident prevention, safety protocols',
    model: 'llama3.3:70b',
  },
  {
    code: 'estimator',
    name: 'Chief Estimator',
    purpose: 'Bid analysis, cost estimation, change order management',
    model: 'qwq:32b',
  },
  {
    code: 'bim-coord',
    name: 'BIM Coordinator',
    purpose: 'Model coordination, clash detection, design integration',
    model: 'llama3.3:70b',
  },
];

const overlays = [
  {
    name: 'Schedule Risk Analyzer',
    function: 'Critical path monitoring and delay prediction',
    integrates: 'CendiaPredict™',
  },
  {
    name: 'Safety Incident Predictor',
    function: 'Proactive hazard identification and prevention',
    integrates: 'CendiaAegis™',
  },
  {
    name: 'Cost Overrun Detector',
    function: 'Early warning for budget deviations',
    integrates: 'CendiaCascade™',
  },
  {
    name: 'Subcontractor Risk Monitor',
    function: 'Vendor performance and financial health tracking',
    integrates: 'CendiaPanopticon™',
  },
];

const compliance = [
  'OSHA',
  'EPA',
  'ADA',
  'Building Codes',
  'LEED',
  'Prevailing Wage',
  'Bonding Requirements',
  'Insurance',
];

const pricing = [
  {
    package: 'Contractor Starter',
    price: '$80,000',
    includes: '8 Pillars + 4 Construction Agents',
    roi: '1 project',
  },
  {
    package: 'Contractor Professional',
    price: '$500,000',
    includes: '+ Cascade, Pre-Mortem, Mesh',
    roi: '6 months',
  },
  {
    package: 'GC Enterprise',
    price: '$2,500,000',
    includes: '+ Multi-project, Full Suite',
    roi: '4 months',
  },
  {
    package: 'GC Sovereign',
    price: '$8,000,000+',
    includes: '+ Government, Air-gapped',
    roi: '3 months',
  },
];

export const ConstructionPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'agents' | 'integrations' | 'pricing'>('overview');

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <div className="relative overflow-hidden border-b border-neutral-800">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/30 via-neutral-900 to-neutral-900"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <button
            onClick={() => navigate('/verticals')}
            className="flex items-center gap-2 text-neutral-400 hover:text-white mb-6"
          >
            ← Back to Verticals
          </button>

          <div className="flex items-start gap-6">
            <span className="text-6xl">🏗️</span>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm font-medium">
                  📊 Project Controls
                </span>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                  🦺 Safety First
                </span>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
                  🏛️ Infrastructure
                </span>
              </div>
              <h1 className="text-4xl font-bold mb-4">Construction / Engineering</h1>
              <p className="text-xl text-neutral-300 max-w-3xl mb-6">
                Decision intelligence for general contractors, specialty trades, and infrastructure projects. 
                From bid decisions to safety management to project controls.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => navigate('/cortex/council?vertical=construction')}
                  className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  <span>🏛️</span> Launch Construction Council
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-neutral-400">Pilot Result</p>
              <p className="text-3xl font-bold text-amber-400">34%</p>
              <p className="text-neutral-300">fewer delays</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6 mt-12">
            {[
              { label: 'Schedule Delays', value: '-34%', subtext: 'reduction' },
              { label: 'Safety Incidents', value: '-52%', subtext: 'TRIR improvement' },
              { label: 'Cost Overruns', value: '-28%', subtext: 'budget variance' },
              { label: 'Bid Win Rate', value: '+18%', subtext: 'improvement' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700"
              >
                <p className="text-3xl font-bold text-amber-400">{stat.value}</p>
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
                className={`px-6 py-4 font-medium capitalize transition-all border-b-2 ${activeTab === tab ? 'border-amber-500 text-white' : 'border-transparent text-neutral-400 hover:text-white'}`}
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
              <h2 className="text-2xl font-bold mb-6">Why Datacendia for Construction</h2>
              <div className="grid grid-cols-3 gap-6">
                {[
                  {
                    title: 'Schedule Intelligence',
                    desc: 'AI-powered critical path analysis and delay prediction with proactive mitigation.',
                    icon: '📅',
                  },
                  {
                    title: 'Safety Analytics',
                    desc: 'Predictive safety monitoring that identifies hazards before incidents occur.',
                    icon: '🦺',
                  },
                  {
                    title: 'Cost Control',
                    desc: 'Real-time budget tracking with early warning for cost overruns and change orders.',
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
                    className="px-4 py-2 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/30 font-medium"
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
              <h2 className="text-2xl font-bold mb-6">Construction-Specific AI Agents</h2>
              <div className="grid grid-cols-2 gap-6">
                {agents.map((agent) => (
                  <div
                    key={agent.code}
                    className="bg-neutral-800 rounded-xl p-6 border border-neutral-700"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded font-mono text-sm">
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
              <h2 className="text-2xl font-bold mb-6">Construction Overlays</h2>
              <div className="grid grid-cols-2 gap-6">
                {overlays.map((overlay) => (
                  <div
                    key={overlay.name}
                    className="bg-neutral-800 rounded-xl p-6 border border-neutral-700"
                  >
                    <h3 className="text-lg font-semibold mb-2">{overlay.name}</h3>
                    <p className="text-neutral-400 mb-3">{overlay.function}</p>
                    <span className="text-xs text-amber-400">Integrates: {overlay.integrates}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'integrations' && (
          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Construction System Integrations</h2>
              <div className="grid grid-cols-3 gap-6">
                {[
                  { name: 'Procore', type: 'Project Management', status: 'Native' },
                  { name: 'Autodesk Construction Cloud', type: 'BIM', status: 'Native' },
                  { name: 'Primavera P6', type: 'Scheduling', status: 'Adapter' },
                  { name: 'Bluebeam', type: 'Document Management', status: 'Native' },
                  { name: 'Sage 300 CRE', type: 'Accounting', status: 'Adapter' },
                  { name: 'PlanGrid', type: 'Field Management', status: 'Native' },
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
              <h2 className="text-2xl font-bold mb-6">Construction Pricing Tiers</h2>
              <div className="grid grid-cols-4 gap-6">
                {pricing.map((tier, idx) => (
                  <div
                    key={tier.package}
                    className={`rounded-xl p-6 border ${idx === 3 ? 'bg-amber-900/20 border-amber-500/50' : 'bg-neutral-800 border-neutral-700'}`}
                  >
                    <h3 className="text-lg font-semibold mb-2">{tier.package}</h3>
                    <p className="text-3xl font-bold text-amber-400 mb-4">{tier.price}</p>
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

export default ConstructionPage;
