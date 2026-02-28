// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA LEGAL / LAW FIRMS VERTICAL
// Privilege-preserving AI with audit-grade decision packets for legal practice
// =============================================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// =============================================================================
// TYPES & DATA
// =============================================================================

interface Agent {
  code: string;
  name: string;
  purpose: string;
  model: string;
  isDefault: boolean;
}

interface UseCase {
  name: string;
  description: string;
  services: string[];
  pack: 'contract' | 'litigation' | 'governance';
}

interface CaseStudy {
  org: string;
  quote: string;
  metric: string;
  anonymized: boolean;
}

// Default agents (always on)
const defaultAgents: Agent[] = [
  {
    code: 'matter-lead',
    name: 'Matter Lead (Arbiter)',
    purpose: 'Final synthesis, scopes questions, produces recommendation + decision packet',
    model: 'qwq:32b',
    isDefault: true,
  },
  {
    code: 'research-counsel',
    name: 'Research Counsel',
    purpose: 'Retrieves and summarizes authorities/precedent from ingested case law library',
    model: 'llama3.3:70b',
    isDefault: true,
  },
  {
    code: 'contract-counsel',
    name: 'Contract / Transaction Counsel',
    purpose: 'Clause-level review, playbook enforcement, fallback language, commercial reasonableness',
    model: 'qwq:32b',
    isDefault: true,
  },
  {
    code: 'litigation-strategist',
    name: 'Litigation Strategist',
    purpose: 'Case theory, arguments, discovery posture, deposition outline logic',
    model: 'qwq:32b',
    isDefault: true,
  },
  {
    code: 'risk-counsel',
    name: 'Risk & Liability Counsel',
    purpose: 'Damages exposure, indemnity posture, limitation of liability, insurance implications',
    model: 'llama3.3:70b',
    isDefault: true,
  },
  {
    code: 'opposing-counsel',
    name: 'Opposing Counsel (Red Team)',
    purpose: 'Adversarial challenge: "How would the other side attack this?"',
    model: 'qwq:32b',
    isDefault: true,
  },
  {
    code: 'privilege-officer',
    name: 'Privilege & Confidentiality Officer',
    purpose: 'Privilege screening, redaction guidance, confidentiality tiering, export restrictions',
    model: 'llama3.3:70b',
    isDefault: true,
  },
  {
    code: 'evidence-officer',
    name: 'Evidence & Audit Officer',
    purpose: 'Ensures every claim links to source artifact; assembles Decision Packet / Ledger Export',
    model: 'llama3.3:70b',
    isDefault: true,
  },
];

// Optional specialist agents (toggle per matter type)
const optionalAgents: Agent[] = [
  {
    code: 'regulatory-counsel',
    name: 'Regulatory/Compliance Counsel',
    purpose: 'Financial services, healthcare, privacy-heavy work, DPA/AI Act/HIPAA/GLBA',
    model: 'qwq:32b',
    isDefault: false,
  },
  {
    code: 'employment-counsel',
    name: 'Employment Counsel',
    purpose: 'HR disputes, investigations, termination, workplace policies',
    model: 'llama3.3:70b',
    isDefault: false,
  },
  {
    code: 'ip-counsel',
    name: 'IP Counsel',
    purpose: 'Patents, licensing, open-source compliance, infringement risk',
    model: 'qwq:32b',
    isDefault: false,
  },
  {
    code: 'tax-counsel',
    name: 'Tax Counsel',
    purpose: 'Deal structuring, cross-border, entity formation, transfer pricing',
    model: 'llama3.3:70b',
    isDefault: false,
  },
  {
    code: 'antitrust-counsel',
    name: 'Competition/Antitrust Counsel',
    purpose: 'M&A clearance, exclusivity, market power language, HSR filings',
    model: 'qwq:32b',
    isDefault: false,
  },
  {
    code: 'commercial-advisor',
    name: 'Client/Business Advisor',
    purpose: 'Business trade-offs, commercial strategy, client relationship context',
    model: 'llama3.3:70b',
    isDefault: false,
  },
];

const useCases: UseCase[] = [
  // Contract & Deal Pack
  {
    name: 'Contract Review & Redlining',
    description: 'Multi-agent review of sell-side/buy-side contracts with playbook enforcement',
    services: ['Council', 'Lens', 'Evidence Vault', 'Veto/Govern'],
    pack: 'contract',
  },
  {
    name: 'Clause Risk Scoring',
    description: 'Playbook-driven risk scoring with fallback clause suggestions',
    services: ['Veto/Govern', 'Lens', 'Graph/Lineage', 'Council'],
    pack: 'contract',
  },
  {
    name: 'Negotiation Strategy Prep',
    description: '"If they push on X, we offer Y" scenario planning with adversarial testing',
    services: ['Council', 'Crucible/Red Team', 'Chronos', 'Evidence Vault'],
    pack: 'contract',
  },
  {
    name: 'M&A Due Diligence',
    description: 'Data room summarization, risk flagging, and issue tracking',
    services: ['Bridge', 'Lens', 'Graph', 'Council', 'Evidence Vault'],
    pack: 'contract',
  },
  {
    name: 'Reps & Warranties Risk Map',
    description: 'Missing disclosure detection and representation gap analysis',
    services: ['Lens', 'Graph', 'Council', 'Evidence Vault'],
    pack: 'contract',
  },
  {
    name: 'Policy-Aware Drafting',
    description: 'Email/memo drafting with firm style and risk constraints enforced',
    services: ['Veto/Govern', 'Lens', 'Council'],
    pack: 'contract',
  },
  // Litigation Pack
  {
    name: 'Litigation Fact Chronology',
    description: 'Events, exhibits, witnesses, dates mapped into defensible timeline',
    services: ['Chronos', 'Bridge', 'Graph', 'Lens'],
    pack: 'litigation',
  },
  {
    name: 'Case Theory Stress Test',
    description: "Devil's advocate across arguments with documented dissent",
    services: ['Crucible/Red Team', 'Council', 'Evidence Vault'],
    pack: 'litigation',
  },
  {
    name: 'Deposition Outline Drafting',
    description: 'Grounded in the record with citation-required enforcement',
    services: ['Lens', 'Evidence Vault', 'Veto/Govern'],
    pack: 'litigation',
  },
  {
    name: 'Discovery Request Response',
    description: 'Response drafting with exhibit mapping and privilege review',
    services: ['Lens', 'Graph', 'Council', 'Evidence Vault'],
    pack: 'litigation',
  },
  {
    name: 'eDiscovery Defensibility Packet',
    description: 'What was searched, how, when, by whom—audit-grade documentation',
    services: ['Ledger', 'Chronos', 'Evidence Vault', 'Veto/Govern'],
    pack: 'litigation',
  },
  {
    name: 'Expert Witness Prep',
    description: 'Cross-examination simulation and testimony stress testing',
    services: ['Crucible/Red Team', 'Council', 'Chronos'],
    pack: 'litigation',
  },
  // Governance & Defensibility Pack
  {
    name: "Regulator's Receipt",
    description: 'Defensible work product trail for legal opinions',
    services: ['Chronos', 'Ledger', 'Evidence Vault', 'Veto/Govern'],
    pack: 'governance',
  },
  {
    name: 'Privilege & Confidentiality Review',
    description: 'Triage workflow with approvals and privilege logging',
    services: ['Veto/Govern', 'Ledger', 'Evidence Vault', 'Bridge'],
    pack: 'governance',
  },
  {
    name: 'Conflicts Check Augmentation',
    description: 'Relationships, entities, counterparties mapped with audit trail',
    services: ['Graph', 'Bridge', 'Veto/Govern', 'Ledger'],
    pack: 'governance',
  },
  {
    name: 'Security Questionnaire Response',
    description: 'Client security questionnaire and outside counsel guidelines pack',
    services: ['Panopticon', 'Evidence Vault', 'Ledger', 'Sovereign'],
    pack: 'governance',
  },
  {
    name: 'Regulatory Change Monitoring',
    description: 'Alerts → legal impact memo for client-specific regulations',
    services: ['Panopticon', 'Lens', 'Council', 'Chronos'],
    pack: 'governance',
  },
  {
    name: 'Compliance Evidence Assembly',
    description: 'SOC2/ISO/NIST mapping with exportable control documentation',
    services: ['Panopticon', 'Evidence Vault', 'Ledger', 'Graph/Lineage'],
    pack: 'governance',
  },
  {
    name: 'Matter Post-Mortem',
    description: 'What worked, what failed, why—lessons learned with audit trail',
    services: ['Chronos', 'Council', 'Ledger', 'Lens'],
    pack: 'governance',
  },
  {
    name: 'Precedent Knowledge Base',
    description: 'Search firm precedents with "why this is relevant" context',
    services: ['Bridge', 'Lens', 'Graph', 'Sovereign'],
    pack: 'governance',
  },
];

const caseStudies: CaseStudy[] = [
  {
    org: 'AmLaw 100 Firm (M&A Practice)',
    quote:
      'Reduced due diligence time by 40% on a $2B acquisition. Council identified 12 disclosure gaps that junior associates missed.',
    metric: '40% faster DD',
    anonymized: true,
  },
  {
    org: 'Litigation Boutique (50 attorneys)',
    quote:
      'Case theory stress testing caught a fatal flaw in our damages argument before deposition. Saved the case.',
    metric: 'Case-saving insight',
    anonymized: true,
  },
  {
    org: 'Global Corporate Practice',
    quote:
      'Privilege review workflow reduced partner review time by 60%. Every export has a defensible audit trail.',
    metric: '60% time saved',
    anonymized: true,
  },
];

const overlays = [
  {
    name: 'Case Law Library',
    function: 'Ingest prior cases, statutes, regulations for citation-grounded research',
    integrates: 'CendiaBridge™ + CendiaGraph™',
    api: '/api/v1/legal-services/bridge/*',
  },
  {
    name: 'Privilege Gate',
    function: 'Automatic privilege screening with human approval required for export',
    integrates: 'CendiaVeto™ + CendiaGovern™',
    api: '/api/v1/legal-services/veto/*, /api/v1/legal-services/govern/*',
  },
  {
    name: 'Citation Enforcer',
    function: 'No-source-no-claim: every assertion must link to ingested authority',
    integrates: 'Evidence Vault + LegalVerticalService',
    api: '/api/v1/legal/citations/validate',
  },
  {
    name: 'Matter Workspace',
    function: 'Client → Matter → Documents → Policies hierarchy with RBAC',
    integrates: 'LegalVerticalService',
    api: '/api/v1/legal/matters/*',
  },
];

const agentPresets = [
  {
    name: 'Contract Review (Standard)',
    agents: ['Matter Lead', 'Research', 'Contract Counsel', 'Risk', 'Privilege', 'Evidence'],
    useCase: 'Standard contract review and redlining',
  },
  {
    name: 'High-Stakes Negotiation',
    agents: [
      'Matter Lead',
      'Research',
      'Contract Counsel',
      'Risk',
      'Opposing Counsel (Red Team)',
      'Commercial Advisor',
      'Privilege',
      'Evidence',
    ],
    useCase: 'Major deal negotiations with adversarial testing',
  },
  {
    name: 'Litigation Prep',
    agents: [
      'Matter Lead',
      'Research',
      'Litigation Strategist',
      'Opposing Counsel (Red Team)',
      'Risk',
      'Privilege',
      'Evidence',
    ],
    useCase: 'Case strategy, depositions, trial prep',
  },
  {
    name: 'Regulatory Response / Audit',
    agents: [
      'Matter Lead',
      'Regulatory Counsel',
      'Research',
      'Privilege',
      'Evidence',
      'Risk',
    ],
    useCase: 'Regulatory inquiries, audits, compliance responses',
  },
];

const compliance = [
  'ABA Model Rules',
  'Rule 1.1 (Competence)',
  'Rule 1.6 (Confidentiality)',
  'Rule 5.1/5.3 (Supervision)',
  'SRA (UK)',
  'EU AI Act',
  'GDPR',
  'State Bar Rules',
  'Attorney-Client Privilege',
  'Work Product Doctrine',
];

const integrations = [
  {
    system: 'Document Management (iManage, NetDocuments)',
    difficulty: 'easy',
    timeline: '2-4 weeks',
    notes: 'Standard API connectors, matter-level sync',
  },
  {
    system: 'eDiscovery (Relativity, Nuix)',
    difficulty: 'medium',
    timeline: '4-8 weeks',
    notes: 'Export/import workflows, production set integration',
  },
  {
    system: 'Practice Management (Clio, PracticePanther)',
    difficulty: 'easy',
    timeline: '2-3 weeks',
    notes: 'Matter sync, time entry integration',
  },
  {
    system: 'Legal Research (Westlaw, LexisNexis)',
    difficulty: 'medium',
    timeline: '4-6 weeks',
    notes: 'Citation verification, case law ingestion pipelines',
  },
  {
    system: 'Contract Lifecycle (Ironclad, DocuSign CLM)',
    difficulty: 'easy',
    timeline: '2-4 weeks',
    notes: 'Playbook sync, clause library integration',
  },
];

const pricing = [
  {
    package: 'Legal Pilot',
    price: '$35,000',
    includes: 'One matter end-to-end, 10 business days',
    roi: 'Proof of value',
  },
  {
    package: 'Practice Group Annual',
    price: '$120,000–$250,000',
    includes: 'Core Suite + 8 Legal Agents + Case Law Ingestion',
    roi: '6 months',
  },
  {
    package: 'Firm Enterprise',
    price: '$300,000–$750,000',
    includes: '+ All specialists, unlimited matters, on-prem option',
    roi: '4 months',
  },
  {
    package: 'Sovereign (Air-Gapped)',
    price: '$1,000,000+',
    includes: '+ SCIF-ready, custom models, dedicated support',
    roi: '3 months',
  },
];

// =============================================================================
// COMPONENT
// =============================================================================

export const LegalPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'agents' | 'usecases' | 'integrations' | 'pricing'
  >('overview');
  const [selectedPack, setSelectedPack] = useState<'all' | 'contract' | 'litigation' | 'governance'>(
    'all'
  );

  const filteredUseCases =
    selectedPack === 'all' ? useCases : useCases.filter((uc) => uc.pack === selectedPack);

  const packColors = {
    contract: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    litigation: 'bg-red-500/20 text-red-400 border-red-500/30',
    governance: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  };

  const packLabels = {
    contract: '📄 Contract & Deal',
    litigation: '⚖️ Litigation',
    governance: '🛡️ Governance & Defensibility',
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-neutral-800">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-neutral-900 to-neutral-900"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <button
            onClick={() => navigate('/verticals')}
            className="flex items-center gap-2 text-neutral-400 hover:text-white mb-6 transition-colors"
          >
            ← Back to Verticals
          </button>

          <div className="flex items-start gap-6">
            <span className="text-6xl">⚖️</span>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-sm font-medium">
                  ⭐ Wave 1 Priority
                </span>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                  🔒 Privilege-Preserving
                </span>
                <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm font-medium">
                  📋 Audit-Grade
                </span>
              </div>
              <h1 className="text-4xl font-bold mb-4">Legal / Law Firms</h1>
              <p className="text-xl text-neutral-300 max-w-3xl mb-6">
                Privilege-preserving AI with audit-grade decision packets. The only legal AI your
                General Counsel will approve—because data never leaves your infrastructure and every
                output has a defensible evidence trail.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => navigate('/cortex/council?vertical=legal')}
                  className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  <span>🏛️</span> Launch Legal Council
                </button>
                <button
                  onClick={() => setActiveTab('usecases')}
                  className="px-6 py-3 border border-amber-500/50 text-amber-400 hover:bg-amber-500/10 rounded-lg font-medium transition-colors"
                >
                  View 20 Use Cases
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-neutral-400">Pilot Result</p>
              <p className="text-3xl font-bold text-green-400">40%</p>
              <p className="text-neutral-300">faster due diligence</p>
            </div>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-4 gap-6 mt-12">
            {[
              { label: '18-Month ROI', value: '35%', subtext: 'billable hour leverage' },
              { label: 'DD Time Reduction', value: '40%', subtext: 'M&A due diligence' },
              { label: 'Privilege Review', value: '60%', subtext: 'time saved' },
              { label: 'Time to Value', value: '2-4 weeks', subtext: 'to first matter' },
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
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'agents', label: 'Agents & Presets' },
              { id: 'usecases', label: '20 Use Cases' },
              { id: 'integrations', label: 'Integrations' },
              { id: 'pricing', label: 'Pricing' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-6 py-4 font-medium transition-all border-b-2 ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-white'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-12">
            {/* Why Legal */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Why Datacendia for Law Firms</h2>
              <div className="grid grid-cols-3 gap-6">
                {[
                  {
                    title: 'Attorney-Client Privilege Preserved',
                    desc: 'On-prem / air-gapped deployment. No data sent to third-party model vendors. No training on client data.',
                    icon: '🔒',
                  },
                  {
                    title: 'Lawyers Remain Decision-Makers',
                    desc: 'AI assists, never advises clients directly. Human approval gates on all outputs. You stay accountable.',
                    icon: '👨‍⚖️',
                  },
                  {
                    title: 'Audit-Grade Evidence Packets',
                    desc: 'Every output includes inputs, sources, policies applied, approvals, and cryptographic signatures.',
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

            {/* Case Law Ingestion Feature */}
            <section className="bg-gradient-to-r from-amber-900/20 to-amber-800/20 rounded-2xl p-8 border border-amber-500/30">
              <div className="flex items-start gap-6">
                <span className="text-5xl">📚</span>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">Case Law & Precedent Library</h2>
                  <p className="text-lg text-amber-200 mb-4">
                    Ingest your firm's case law, prior opinions, and precedent documents. Research
                    Counsel only cites from your ingested library—no hallucinated citations.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      {
                        title: 'Jurisdiction Tagging',
                        desc: 'Tag cases by jurisdiction, court level, practice area',
                      },
                      {
                        title: 'Firm Precedent',
                        desc: 'Ingest prior opinions, memos, and internal guidance',
                      },
                      {
                        title: 'Citation Enforcement',
                        desc: 'No-source-no-claim: every assertion links to authority',
                      },
                      {
                        title: 'Privilege-Safe',
                        desc: 'Cases stay on-prem, never sent to external services',
                      },
                    ].map((feature) => (
                      <div key={feature.title} className="flex items-start gap-3">
                        <span className="text-green-400 mt-1">✓</span>
                        <div>
                          <p className="font-medium">{feature.title}</p>
                          <p className="text-sm text-neutral-400">{feature.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Case Studies */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Customer Results</h2>
              <div className="space-y-4">
                {caseStudies.map((cs, idx) => (
                  <div
                    key={idx}
                    className="bg-neutral-800 rounded-xl p-6 border border-neutral-700"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-neutral-300 text-lg italic">"{cs.quote}"</p>
                        <p className="text-neutral-500 mt-3">
                          — {cs.org} {cs.anonymized && '(Anonymized Demo Available)'}
                        </p>
                      </div>
                      <div className="ml-6 text-right">
                        <p className="text-2xl font-bold text-green-400">{cs.metric}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Ethics Compliance */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Professional Responsibility Alignment</h2>
              <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-4 text-green-400">
                      ✓ What Datacendia Does
                    </h3>
                    <ul className="space-y-2 text-neutral-300">
                      <li>• Decision support for legal professionals</li>
                      <li>• Evidence-backed reasoning with citations</li>
                      <li>• Audit-grade deliberation trails</li>
                      <li>• Privilege-preserving AI infrastructure</li>
                      <li>• Technology competence without data leakage</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-4 text-red-400">
                      ✗ What Datacendia Does NOT Do
                    </h3>
                    <ul className="space-y-2 text-neutral-300">
                      <li>• Does NOT provide legal advice</li>
                      <li>• Does NOT replace attorney judgment</li>
                      <li>• Does NOT auto-file or auto-submit</li>
                      <li>• Does NOT communicate with clients directly</li>
                      <li>• Outputs MUST be reviewed before use</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Compliance Frameworks */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Compliance Frameworks</h2>
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

            {/* Vertical Overlays */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Legal-Specific Overlays</h2>
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
                    {overlays.map((overlay) => (
                      <tr key={overlay.name} className="border-t border-neutral-700">
                        <td className="p-4 font-medium">{overlay.name}</td>
                        <td className="p-4 text-neutral-300">{overlay.function}</td>
                        <td className="p-4">
                          <code className="text-primary-400">{overlay.integrates}</code>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {/* Agents Tab */}
        {activeTab === 'agents' && (
          <div className="space-y-12">
            {/* Default Agents */}
            <section>
              <h2 className="text-2xl font-bold mb-2">Default Legal Council (8 Agents)</h2>
              <p className="text-neutral-400 mb-6">
                These agents are on by default for every matter. They deliberate together using The
                Council™ and produce audit-grade decision packets.
              </p>
              <div className="grid grid-cols-2 gap-6">
                {defaultAgents.map((agent) => (
                  <div
                    key={agent.code}
                    className="bg-neutral-800 rounded-xl p-6 border border-neutral-700"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center">
                        <span className="text-xl">⚖️</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{agent.name}</h3>
                        <code className="text-xs text-neutral-500 bg-neutral-900 px-2 py-0.5 rounded">
                          {agent.code}
                        </code>
                      </div>
                      <span className="ml-auto px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
                        Default
                      </span>
                    </div>
                    <p className="text-neutral-300 mb-3">{agent.purpose}</p>
                    <p className="text-sm text-neutral-500">
                      Model: <code className="text-primary-400">{agent.model}</code>
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Optional Specialists */}
            <section>
              <h2 className="text-2xl font-bold mb-2">Optional Specialist Agents (6)</h2>
              <p className="text-neutral-400 mb-6">
                Toggle these on per matter type. They join the Council when their expertise is
                needed.
              </p>
              <div className="grid grid-cols-3 gap-6">
                {optionalAgents.map((agent) => (
                  <div
                    key={agent.code}
                    className="bg-neutral-800 rounded-xl p-6 border border-neutral-700"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <span className="text-lg">🔧</span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{agent.name}</h3>
                        <code className="text-xs text-neutral-500">{agent.code}</code>
                      </div>
                    </div>
                    <p className="text-neutral-400 text-sm">{agent.purpose}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Agent Presets */}
            <section>
              <h2 className="text-2xl font-bold mb-6">One-Click Agent Presets</h2>
              <div className="grid grid-cols-2 gap-6">
                {agentPresets.map((preset) => (
                  <div
                    key={preset.name}
                    className="bg-neutral-800 rounded-xl p-6 border border-neutral-700"
                  >
                    <h3 className="font-semibold text-lg text-primary-400 mb-2">{preset.name}</h3>
                    <p className="text-neutral-400 mb-4">{preset.useCase}</p>
                    <div className="flex flex-wrap gap-1">
                      {preset.agents.map((agent) => (
                        <span
                          key={agent}
                          className="px-2 py-1 bg-neutral-700 rounded text-xs text-neutral-300"
                        >
                          {agent}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Governance Behaviors */}
            <section className="bg-red-500/10 rounded-xl p-6 border border-red-500/30">
              <h3 className="font-semibold text-red-400 mb-4">
                ⚠️ Non-Negotiable Governance Behaviors
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Privilege Gate</h4>
                  <p className="text-neutral-300 text-sm">
                    Any export/share action requires Privilege Officer review + human approval.
                    Cannot be bypassed.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Citation Gate</h4>
                  <p className="text-neutral-300 text-sm">
                    Research + Evidence Officer enforce "no citation = mark as assumption." No
                    hallucinated authorities.
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Use Cases Tab */}
        {activeTab === 'usecases' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">20 Legal Use Cases</h2>
              <div className="flex gap-2">
                {[
                  { id: 'all', label: 'All', count: useCases.length },
                  {
                    id: 'contract',
                    label: '📄 Contract & Deal',
                    count: useCases.filter((uc) => uc.pack === 'contract').length,
                  },
                  {
                    id: 'litigation',
                    label: '⚖️ Litigation',
                    count: useCases.filter((uc) => uc.pack === 'litigation').length,
                  },
                  {
                    id: 'governance',
                    label: '🛡️ Governance',
                    count: useCases.filter((uc) => uc.pack === 'governance').length,
                  },
                ].map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedPack(filter.id as typeof selectedPack)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedPack === filter.id
                        ? 'bg-primary-600 text-white'
                        : 'bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700'
                    }`}
                  >
                    {filter.label} ({filter.count})
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {filteredUseCases.map((uc, idx) => (
                <div
                  key={uc.name}
                  className={`rounded-xl p-6 border ${packColors[uc.pack]} hover:border-primary-500/50 transition-all`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-lg">{uc.name}</h3>
                    <span className="text-xs px-2 py-1 bg-neutral-800 rounded">
                      {packLabels[uc.pack]}
                    </span>
                  </div>
                  <p className="text-neutral-300 mb-4">{uc.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {uc.services.slice(0, 3).map((service) => (
                        <span
                          key={service}
                          className="px-2 py-0.5 bg-neutral-800 rounded text-xs text-neutral-400"
                        >
                          {service}
                        </span>
                      ))}
                      {uc.services.length > 3 && (
                        <span className="px-2 py-0.5 bg-neutral-800 rounded text-xs text-neutral-400">
                          +{uc.services.length - 3}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        // Regulator's Receipt has its own dedicated demo page
                        if (uc.name === "Regulator's Receipt") {
                          navigate('/cortex/trust/regulators-receipt');
                        } else {
                          navigate(`/cortex/council?vertical=legal&mode=${uc.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`);
                        }
                      }}
                      className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                      <span>▶</span> {uc.name === "Regulator's Receipt" ? 'Demo' : 'Start'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Integrations Tab */}
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
                    {integrations.map((int) => (
                      <tr key={int.system} className="border-t border-neutral-700">
                        <td className="p-4 font-medium">{int.system}</td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              int.difficulty === 'easy'
                                ? 'bg-green-500/20 text-green-400'
                                : int.difficulty === 'medium'
                                  ? 'bg-yellow-500/20 text-yellow-400'
                                  : 'bg-red-500/20 text-red-400'
                            }`}
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

            <section className="bg-amber-500/10 rounded-xl p-6 border border-amber-500/30">
              <h3 className="font-semibold text-amber-400 mb-2">📚 Case Law Ingestion</h3>
              <p className="text-neutral-300">
                Ingest case law from Westlaw/LexisNexis exports, firm document repositories, or
                direct API connections. Cases are indexed by jurisdiction, court, date, and practice
                area. Research Counsel searches only your ingested library—no external calls, no
                hallucinated citations.
              </p>
            </section>
          </div>
        )}

        {/* Pricing Tab */}
        {activeTab === 'pricing' && (
          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Legal Pricing</h2>
              <p className="text-neutral-400 mb-8">
                Outcome-based pricing: per matter or per practice group—not per seat.
              </p>
              <div className="grid grid-cols-4 gap-6">
                {pricing.map((pkg, idx) => (
                  <div
                    key={pkg.package}
                    className={`rounded-xl p-6 border ${
                      idx === 2
                        ? 'bg-primary-900/20 border-primary-500'
                        : 'bg-neutral-800 border-neutral-700'
                    }`}
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

            <section className="bg-gradient-to-r from-amber-900/20 to-amber-800/20 rounded-2xl p-8 border border-amber-500/30">
              <h2 className="text-2xl font-bold mb-4">The Strongest Legal AI Positioning</h2>
              <blockquote className="text-2xl text-amber-200 italic mb-4">
                "Datacendia gives law firms AI assistance without sacrificing privilege, control, or
                professional responsibility."
              </blockquote>
              <p className="text-neutral-400">
                Or more bluntly: <strong className="text-white">We built the AI lawyers are actually allowed to use.</strong>
              </p>
            </section>

            <section className="text-center">
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => navigate('/cortex/workflows/legal')}
                  className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 transition-colors"
                >
                  ▶ Start 12-Step Legal Workflow
                </button>
                <button
                  onClick={() => navigate('/demo')}
                  className="px-8 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                >
                  Request Legal Demo
                </button>
                <button
                  onClick={() => navigate('/contact')}
                  className="px-8 py-3 border border-neutral-600 text-white rounded-lg font-medium hover:bg-neutral-800 transition-colors"
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

export default LegalPage;
