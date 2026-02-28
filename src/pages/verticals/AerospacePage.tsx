// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA AEROSPACE / DEFENSE VERTICAL
// Mission-critical decisions, classified operations, sovereign deployment
// =============================================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const agents = [
  {
    code: 'mission-ops',
    name: 'Mission Operations Director',
    purpose: 'Mission planning, risk assessment, go/no-go decisions',
    model: 'qwq:32b',
  },
  {
    code: 'systems-eng',
    name: 'Systems Engineering Lead',
    purpose: 'Technical integration, requirements traceability, V&V',
    model: 'llama3.3:70b',
  },
  {
    code: 'program-mgr',
    name: 'Program Manager',
    purpose: 'Schedule, budget, milestone tracking, stakeholder coordination',
    model: 'qwq:32b',
  },
  {
    code: 'security-officer',
    name: 'Security Classification Officer',
    purpose: 'ITAR/EAR compliance, classification decisions, need-to-know',
    model: 'llama3.3:70b',
  },
];

const overlays = [
  {
    name: 'ITAR Compliance Monitor',
    function: 'Real-time export control violation detection',
    integrates: 'CendiaPanopticon™',
  },
  {
    name: 'Mission Readiness Tracker',
    function: 'Go/no-go criteria monitoring, anomaly detection',
    integrates: 'CendiaPredict™',
  },
  {
    name: 'Supply Chain Security',
    function: 'Counterfeit part detection, vendor risk scoring',
    integrates: 'CendiaGuard™',
  },
  {
    name: 'Classification Enforcer',
    function: 'Automatic document classification, spillage prevention',
    integrates: 'CendiaSovereign™',
  },
];

const compliance = [
  'ITAR',
  'EAR',
  'DFARS',
  'NIST 800-171',
  'CMMC 2.0',
  'FedRAMP High',
  'IL4/IL5/IL6',
  'DO-178C',
  'AS9100',
  'MIL-STD-882',
];

const pricing = [
  {
    package: 'Defense Starter',
    price: '$250,000',
    includes: '8 Pillars + 4 Defense Agents',
    roi: '8 months',
  },
  {
    package: 'Defense Professional',
    price: '$1,500,000',
    includes: '+ Sovereign, TPM, Time-Lock',
    roi: '6 months',
  },
  {
    package: 'Defense Enterprise',
    price: '$5,000,000',
    includes: '+ Air-Gapped, Federated Mesh',
    roi: '4 months',
  },
  {
    package: 'Defense Sovereign',
    price: '$15,000,000+',
    includes: '+ Full IL6, Custom Hardware',
    roi: '3 months',
  },
];

export const AerospacePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'agents' | 'integrations' | 'pricing'>('overview');

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <div className="relative overflow-hidden border-b border-neutral-800">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-neutral-900 to-neutral-900"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <button
            onClick={() => navigate('/verticals')}
            className="flex items-center gap-2 text-neutral-400 hover:text-white mb-6"
          >
            ← Back to Verticals
          </button>

          <div className="flex items-start gap-6">
            <span className="text-6xl">🚀</span>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
                  🔒 100% Sovereign
                </span>
                <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-medium">
                  🛡️ CMMC 2.0 Ready
                </span>
                <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-medium">
                  ✈️ DO-178C Compliant
                </span>
              </div>
              <h1 className="text-4xl font-bold mb-4">Aerospace / Defense</h1>
              <p className="text-xl text-neutral-300 max-w-3xl mb-6">
                Mission-critical decision intelligence for defense contractors, space programs, 
                and aviation. Air-gapped deployment with hardware-signed audit trails.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => navigate('/cortex/council?vertical=aerospace')}
                  className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  <span>🏛️</span> Launch Aerospace Council
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-neutral-400">Pilot Result</p>
              <p className="text-3xl font-bold text-blue-400">94%</p>
              <p className="text-neutral-300">audit readiness</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6 mt-12">
            {[
              { label: 'CMMC Prep Time', value: '18→4mo', subtext: 'certification ready' },
              { label: 'Decision Latency', value: '72→8hr', subtext: 'approval cycle' },
              { label: 'Compliance Cost', value: '-45%', subtext: 'audit overhead' },
              { label: 'Classification Errors', value: '0', subtext: 'spillage incidents' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700"
              >
                <p className="text-3xl font-bold text-blue-400">{stat.value}</p>
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
                className={`px-6 py-4 font-medium capitalize transition-all border-b-2 ${activeTab === tab ? 'border-blue-500 text-white' : 'border-transparent text-neutral-400 hover:text-white'}`}
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
              <h2 className="text-2xl font-bold mb-6">Why Datacendia for Aerospace & Defense</h2>
              <div className="grid grid-cols-3 gap-6">
                {[
                  {
                    title: 'Air-Gapped Deployment',
                    desc: 'Zero external dependencies. Runs on your classified network with no internet connectivity required.',
                    icon: '🔒',
                  },
                  {
                    title: 'Hardware-Signed Decisions',
                    desc: 'TPM attestation ensures every decision is cryptographically signed and tamper-evident.',
                    icon: '🔐',
                  },
                  {
                    title: 'CMMC 2.0 Accelerator',
                    desc: 'Pre-built controls mapping, evidence collection, and continuous compliance monitoring.',
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
              <h2 className="text-2xl font-bold mb-6">Compliance Frameworks</h2>
              <div className="flex flex-wrap gap-2">
                {compliance.map((c) => (
                  <span
                    key={c}
                    className="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/30 font-medium"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </section>

            <section className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-2xl p-8 border border-blue-500/30">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Sovereign Deployment</h2>
                  <h3 className="text-xl text-blue-400 mb-4">
                    "The Portable Briefcase Instance"
                  </h3>
                  <ul className="space-y-2 text-neutral-300">
                    <li>• USB-bootable deployment for field operations</li>
                    <li>• QR code air-gap bridge for data transfer</li>
                    <li>• Federated mesh learning across sites</li>
                    <li>• Time-locked decisions for embargoed operations</li>
                  </ul>
                </div>
                <div className="text-right">
                  <p className="text-sm text-neutral-400">Security Level</p>
                  <p className="text-3xl font-bold text-blue-400">IL6 Ready</p>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'agents' && (
          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Defense-Specific AI Agents</h2>
              <div className="grid grid-cols-2 gap-6">
                {agents.map((agent) => (
                  <div
                    key={agent.code}
                    className="bg-neutral-800 rounded-xl p-6 border border-neutral-700"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded font-mono text-sm">
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
              <h2 className="text-2xl font-bold mb-6">Defense Overlays</h2>
              <div className="grid grid-cols-2 gap-6">
                {overlays.map((overlay) => (
                  <div
                    key={overlay.name}
                    className="bg-neutral-800 rounded-xl p-6 border border-neutral-700"
                  >
                    <h3 className="text-lg font-semibold mb-2">{overlay.name}</h3>
                    <p className="text-neutral-400 mb-3">{overlay.function}</p>
                    <span className="text-xs text-blue-400">Integrates: {overlay.integrates}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'integrations' && (
          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Defense System Integrations</h2>
              <div className="grid grid-cols-3 gap-6">
                {[
                  { name: 'JIRA/Confluence', type: 'Project Management', status: 'Native' },
                  { name: 'Windchill/Teamcenter', type: 'PLM', status: 'Adapter' },
                  { name: 'DOORS', type: 'Requirements', status: 'Native' },
                  { name: 'Cameo/MagicDraw', type: 'MBSE', status: 'Adapter' },
                  { name: 'ServiceNow', type: 'ITSM', status: 'Native' },
                  { name: 'Palantir Foundry', type: 'Analytics', status: 'Adapter' },
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
              <h2 className="text-2xl font-bold mb-6">Defense Pricing Tiers</h2>
              <div className="grid grid-cols-4 gap-6">
                {pricing.map((tier, idx) => (
                  <div
                    key={tier.package}
                    className={`rounded-xl p-6 border ${idx === 3 ? 'bg-blue-900/20 border-blue-500/50' : 'bg-neutral-800 border-neutral-700'}`}
                  >
                    <h3 className="text-lg font-semibold mb-2">{tier.package}</h3>
                    <p className="text-3xl font-bold text-blue-400 mb-4">{tier.price}</p>
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

export default AerospacePage;
