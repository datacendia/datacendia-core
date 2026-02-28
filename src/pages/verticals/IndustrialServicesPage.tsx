// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA INDUSTRIAL SERVICES VERTICAL
// Project-based decision intelligence for industrial maintenance, repair & construction
// =============================================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const agents = [
  // DEFAULT AGENTS (4)
  { code: 'safety-sentinel', name: 'Safety Sentinel', purpose: 'OSHA/ISO 45001/SUNAFIL compliance, hazard assessment, permit-to-work evaluation', model: 'deepseek-r1:32b', category: 'default' },
  { code: 'project-evaluator', name: 'Project Evaluator', purpose: 'Bid/no-bid analysis, resource capacity planning, schedule risk assessment', model: 'qwen3:32b', category: 'default' },
  { code: 'finance-controller', name: 'Finance Controller', purpose: 'Cost estimation, margin analysis, ROI projection, cash flow impact', model: 'deepseek-r1:32b', category: 'default' },
  { code: 'procurement-analyst', name: 'Procurement Analyst', purpose: 'Vendor scoring, subcontractor qualification, insurance verification', model: 'qwen3:32b', category: 'default' },
  // OPTIONAL AGENTS (18)
  { code: 'legal-advisor', name: 'Legal Advisor', purpose: 'Contract review, liability assessment, multi-jurisdiction compliance', model: 'qwen3:32b', category: 'optional' },
  { code: 'quality-inspector', name: 'Quality Inspector', purpose: 'ISO 9001/ASME/AWS compliance, welding standards, NDE requirements', model: 'qwen3:32b', category: 'optional' },
  { code: 'environmental-officer', name: 'Environmental Officer', purpose: 'ISO 14001 compliance, environmental impact, waste management', model: 'llama3.2:3b', category: 'optional' },
  { code: 'maintenance-planner', name: 'Maintenance Planner', purpose: 'RBI methodology, API 510/570 inspection, corrosion rate analysis', model: 'qwen3:32b', category: 'optional' },
  { code: 'workforce-mobilizer', name: 'Workforce Mobilizer', purpose: 'Crew allocation, certification tracking, fatigue management', model: 'qwen3:32b', category: 'optional' },
  { code: 'incident-investigator', name: 'Incident Investigator', purpose: 'Root cause analysis (fishbone, 5-Why, fault-tree, TapRooT)', model: 'deepseek-r1:32b', category: 'optional' },
  { code: 'training-coordinator', name: 'Training Coordinator', purpose: 'Certification renewals, competency matrix, regulatory training', model: 'llama3.2:3b', category: 'optional' },
  { code: 'change-order-analyst', name: 'Change Order Analyst', purpose: 'Scope change evaluation, FIDIC/NEC clauses, delay analysis', model: 'qwen3:32b', category: 'optional' },
  { code: 'insurance-advisor', name: 'Insurance Advisor', purpose: 'Claims processing, EMR tracking, SCTR Peru compliance', model: 'qwen3:32b', category: 'optional' },
  { code: 'emergency-commander', name: 'Emergency Commander', purpose: 'Emergency response, evacuation coordination, crisis management', model: 'deepseek-r1:32b', category: 'optional' },
  { code: 'welding-engineer', name: 'Welding Engineer', purpose: 'WPS/PQR development, ASME IX/AWS D1.1, NDE interpretation', model: 'qwen3:32b', category: 'optional' },
  { code: 'rigging-specialist', name: 'Rigging Specialist', purpose: 'Critical lift planning, load chart calculation, OSHA Subpart CC', model: 'qwen3:32b', category: 'optional' },
  { code: 'confined-space-expert', name: 'Confined Space Expert', purpose: 'Atmospheric monitoring, entry permits, rescue planning', model: 'qwen3:32b', category: 'optional' },
  { code: 'electrical-safety', name: 'Electrical Safety Officer', purpose: 'NFPA 70E compliance, arc flash analysis, LOTO verification', model: 'qwen3:32b', category: 'optional' },
  { code: 'structural-engineer', name: 'Structural Engineer', purpose: 'Structural integrity, seismic evaluation, API 579-1 FFS', model: 'qwen3:32b', category: 'optional' },
  { code: 'asset-manager', name: 'Asset Manager', purpose: 'ISO 55001, TCO analysis, equipment lifecycle, capital planning', model: 'qwen3:32b', category: 'optional' },
  { code: 'site-logistics', name: 'Site Logistics Coordinator', purpose: 'Materials delivery, laydown areas, remote site logistics', model: 'llama3.2:3b', category: 'optional' },
  { code: 'stakeholder-relations', name: 'Stakeholder Relations', purpose: 'Client communications, community relations, ESG compliance', model: 'llama3.2:3b', category: 'optional' },
  // SILENT GUARD AGENTS (5)
  { code: 'council-synthesizer', name: 'Council Synthesizer', purpose: 'Multi-agent synthesis, confidence scoring, dissent preservation', model: 'deepseek-r1:32b', category: 'silent-guard' },
  { code: 'compliance-monitor', name: 'Compliance Monitor', purpose: 'Real-time compliance checking across all 18 frameworks', model: 'qwen3:32b', category: 'silent-guard' },
  { code: 'data-analytics', name: 'Data Analytics Engine', purpose: 'Pattern detection, anomaly detection, predictive analytics', model: 'deepseek-r1:32b', category: 'silent-guard' },
  { code: 'regulatory-tracker', name: 'Regulatory Tracker', purpose: 'Regulatory change monitoring across OSHA, SUNAFIL, ISO, EPA', model: 'llama3.2:3b', category: 'silent-guard' },
  { code: 'performance-benchmarker', name: 'Performance Benchmarker', purpose: 'KPI benchmarking (TRIR, LTIR, EMR, SPI, CPI)', model: 'llama3.2:3b', category: 'silent-guard' },
];

const compliance = [
  'ISO 45001:2018',
  'ISO 9001:2015',
  'OSHA 29 CFR 1926',
  'SUNAFIL DS 005-2012-TR',
  'ISO 14001:2015',
  'ASME/AWS',
  'NFPA 70E',
  'API 510/570',
  'Peru Ley 29783',
  'ANSI Z359',
  'NFPA 51B',
  'ISO 31000',
  'ISO 55001',
  'Peru DS-024 Mining',
  'EPA 40 CFR',
  'Peru MINAM',
  'ILO C155',
  'NEBOSH IGC',
];

const decisionTypes = [
  { type: 'Project Bid / No-Bid', description: 'Multi-agent evaluation of project opportunities with risk, margin, and capacity analysis', icon: '📋' },
  { type: 'Equipment Purchase / Lease', description: 'TCO analysis, vendor comparison, safety requirements, and financing options', icon: '🏗️' },
  { type: 'Safety Work Permit', description: 'Hazard assessment, PPE verification, emergency procedures, and regulatory compliance', icon: '🦺' },
  { type: 'Subcontractor Selection', description: 'Weighted multi-criteria scoring with safety record, insurance, and quality verification', icon: '🔗' },
  { type: 'Client Contract Review', description: 'Terms analysis, liability assessment, force majeure, and financial exposure calculation', icon: '⚖️' },
  { type: 'Workforce Deployment', description: 'Crew allocation, certification verification, fatigue management, and high-altitude medical clearance', icon: '👷' },
  { type: 'Maintenance Schedule', description: 'RBI-based planning with corrosion rate analysis, remaining life calculation, and parts forecasting', icon: '🔧' },
  { type: 'Incident Investigation', description: 'Root cause analysis using fishbone/5-Why/fault-tree with corrective action tracking', icon: '🔎' },
  { type: 'Training & Certification', description: 'Certification renewal tracking, competency gap analysis, and regulatory training compliance', icon: '📚' },
  { type: 'Change Order', description: 'Scope change evaluation with cost/schedule impact, FIDIC/NEC clause verification, and margin recalculation', icon: '📝' },
  { type: 'Insurance Claim', description: 'Claims processing, coverage analysis, EMR tracking, and SCTR Peru compliance', icon: '🛡️' },
  { type: 'Environmental Assessment', description: 'Environmental impact evaluation, emissions monitoring, and waste management per ISO 14001/EPA', icon: '🌿' },
  { type: 'Quality NCR', description: 'Non-conformance disposition (use-as-is/repair/rework/scrap) with reinspection per ASME IX', icon: '🔍' },
  { type: 'Emergency Response', description: 'Emergency activation, evacuation coordination, ICS command structure, and mutual aid', icon: '🚨' },
  { type: 'Joint Venture / Partnership', description: 'Partner assessment, risk sharing, governance structure, and exit strategy evaluation', icon: '🤝' },
];

const pricing = [
  {
    package: 'Industrial Starter',
    price: '$90,000',
    includes: '8 Pillars + 4 Industrial Agents',
    roi: '7 months',
  },
  {
    package: 'Industrial Professional',
    price: '$650,000',
    includes: '+ Full Agent Council, Safety Hard-Stops',
    roi: '5 months',
  },
  {
    package: 'Industrial Enterprise',
    price: '$3,500,000',
    includes: '+ Multi-site, ERP Integration, SUNAFIL',
    roi: '3 months',
  },
  {
    package: 'Industrial Sovereign',
    price: '$9,000,000+',
    includes: '+ Full Sovereignty, Multi-country Ops',
    roi: '2 months',
  },
];

export const IndustrialServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'agents' | 'decisions' | 'pricing'>('overview');

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
            <span className="text-6xl">🏗️</span>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm font-medium">
                  🏭 Industrial Vertical
                </span>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                  🔒 100% Sovereignty
                </span>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
                  ✅ GA
                </span>
              </div>
              <h1 className="text-4xl font-bold mb-4">Industrial Services</h1>
              <p className="text-xl text-neutral-300 max-w-3xl mb-6">
                Project-based decision intelligence for industrial maintenance, repair, and
                construction companies. Safety-first AI with OSHA, ISO 45001, and SUNAFIL
                compliance built into every decision.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => navigate('/cortex/council?vertical=industrial-services')}
                  className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  <span>🏛️</span> Launch Industrial Services Council
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-neutral-400">Pilot Result</p>
              <p className="text-3xl font-bold text-green-400">34%</p>
              <p className="text-neutral-300">bid win rate improvement</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6 mt-12">
            {[
              { label: '18-Month ROI', value: '38%', subtext: 'cost savings' },
              { label: 'Safety Incidents', value: '-62%', subtext: 'reduction' },
              { label: 'Bid Win Rate', value: '+34%', subtext: 'improvement' },
              { label: 'Contract Risk', value: '-45%', subtext: 'exposure reduction' },
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
            {['overview', 'agents', 'decisions', 'pricing'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as typeof activeTab)}
                className={`px-6 py-4 font-medium capitalize transition-all border-b-2 ${activeTab === tab ? 'border-primary-500 text-white' : 'border-transparent text-neutral-400 hover:text-white'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {activeTab === 'overview' && (
          <div className="space-y-12">
            <div>
              <h2 className="text-2xl font-bold mb-6">Compliance Frameworks</h2>
              <div className="grid grid-cols-4 gap-4">
                {compliance.map((c) => (
                  <div key={c} className="bg-neutral-800/50 rounded-lg p-4 border border-neutral-700 text-center">
                    <p className="font-medium text-green-400">{c}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-6">6-Layer Architecture</h2>
              <div className="grid grid-cols-3 gap-6">
                {[
                  { layer: '1. Data Connector', desc: '6 data sources: Project Mgmt, Safety System, ERP, Equipment Registry, Contractor DB, Regulatory Feed', icon: '🔌' },
                  { layer: '2. Knowledge Base', desc: 'RAG-powered retrieval with provenance enforcement and 384-dim embeddings', icon: '📚' },
                  { layer: '3. Compliance Mapper', desc: '18 frameworks, 130+ controls, automated violation detection across ISO/OSHA/SUNAFIL/ASME/NFPA/API/EPA', icon: '🗺️' },
                  { layer: '4. Decision Schemas', desc: '15 decision types with full validation, required fields, and multi-approver chains', icon: '📐' },
                  { layer: '5. Agent Presets', desc: '21-step workflow with 21 guardrails including 9 hard-stops for safety', icon: '🤖' },
                  { layer: '6. Defensible Output', desc: 'Regulator packets, court bundles, and audit trails with SHA-256 cryptographic hashing', icon: '🛡️' },
                ].map((l) => (
                  <div key={l.layer} className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{l.icon}</span>
                      <h3 className="font-bold text-lg">{l.layer}</h3>
                    </div>
                    <p className="text-neutral-400 text-sm">{l.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-6">Key Use Cases</h2>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { title: 'Mining Site Maintenance', desc: 'Boiler repair and piping installation at Cerro Verde, Antamina, and other major mining operations with full safety compliance.' },
                  { title: 'Turnaround/Shutdown Projects', desc: 'Rapid mobilization for refinery and plant shutdowns with resource capacity planning and equipment procurement.' },
                  { title: 'Subcontractor Management', desc: 'Weighted multi-criteria scoring for subcontractor selection with safety record verification and insurance validation.' },
                  { title: 'Cross-Border Operations', desc: 'Multi-jurisdiction compliance for Peru/US operations with SUNAFIL and OSHA dual compliance tracking.' },
                ].map((uc) => (
                  <div key={uc.title} className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700">
                    <h3 className="font-bold text-lg mb-2">{uc.title}</h3>
                    <p className="text-neutral-400">{uc.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'agents' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Industrial Services AI Council</h2>
            <p className="text-neutral-400 mb-8">
              27 specialized agents (4 default + 18 optional + 5 silent guards) deliberate on every industrial decision.
              9 hard-stop guardrails ensure no extreme-risk decisions are approved without adequate controls.
            </p>
            <div className="grid gap-4">
              {agents.map((agent) => (
                <div
                  key={agent.code}
                  className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700 flex items-start gap-6"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-lg">{agent.name}</h3>
                      <span className="px-2 py-0.5 bg-neutral-700 rounded text-xs text-neutral-300">
                        {agent.model}
                      </span>
                    </div>
                    <p className="text-neutral-400">{agent.purpose}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    agent.category === 'default' ? 'bg-blue-500/20 text-blue-400' :
                    agent.category === 'silent-guard' ? 'bg-purple-500/20 text-purple-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {agent.category === 'default' ? 'Default' : agent.category === 'silent-guard' ? 'Silent Guard' : 'Optional'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'decisions' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Decision Types</h2>
            <p className="text-neutral-400 mb-8">
              15 enterprise-grade decision schemas, each with full validation, compliance mapping,
              and defensible output generation across 18 compliance frameworks.
            </p>
            <div className="grid gap-4">
              {decisionTypes.map((dt) => (
                <div
                  key={dt.type}
                  className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700 flex items-start gap-6"
                >
                  <span className="text-3xl">{dt.icon}</span>
                  <div>
                    <h3 className="font-bold text-lg mb-2">{dt.type}</h3>
                    <p className="text-neutral-400">{dt.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold mb-6">Pricing Tiers</h2>
            <div className="grid grid-cols-4 gap-6">
              {pricing.map((p) => (
                <div
                  key={p.package}
                  className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700"
                >
                  <h3 className="font-bold text-lg mb-4">{p.package}</h3>
                  <p className="text-3xl font-bold text-primary-400 mb-4">{p.price}</p>
                  <p className="text-neutral-400 mb-2">{p.includes}</p>
                  <div className="mt-4 pt-4 border-t border-neutral-700">
                    <p className="text-sm text-neutral-500">Payback Period</p>
                    <p className="font-bold text-green-400">{p.roi}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
