// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * LEGAL WORKFLOW PAGE - 12-Step Integrated Decision Flow
 * 
 * Reference page showing the complete legal decision workflow.
 * Each step links to the actual service page where the work is done.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import {
  Scale, Clock, Users, MessageSquare, Shield, AlertTriangle,
  FileText, Key, Archive, Dna, Theater, FileSignature,
  ExternalLink, Zap, ChevronRight
} from 'lucide-react';

// =============================================================================
// WORKFLOW STEPS
// =============================================================================

const WORKFLOW_STEPS = [
  {
    id: 1,
    name: 'Check Decision Debt',
    description: 'Is this matter stuck? What\'s the cost of delay?',
    service: 'Decision Debt™',
    endpoint: 'GET /api/v1/consolidated/decision-debt/list',
    path: '/cortex/intelligence/decision-debt',
    icon: Clock,
  },
  {
    id: 2,
    name: 'Run Governed Deliberation',
    description: '5 Legal agents analyze the case with structured debate',
    service: 'The Council™',
    endpoint: 'POST /api/v1/council/deliberate',
    path: '/cortex/council?vertical=legal',
    icon: Users,
  },
  {
    id: 3,
    name: 'User Intervention',
    description: 'Ask follow-up questions via chat (@Litigation what\'s the timeline?)',
    service: 'Council Chat',
    endpoint: 'Interactive',
    path: '/cortex/council',
    icon: MessageSquare,
  },
  {
    id: 4,
    name: 'Stress Test with Crucible',
    description: 'Red-team the recommendation with adversarial attacks',
    service: 'CendiaCrucible™',
    endpoint: 'POST /api/v1/consolidated/crucible/test',
    path: '/cortex/sovereign/crucible',
    icon: Zap,
  },
  {
    id: 5,
    name: 'Pre-Mortem Analysis',
    description: 'What could go wrong with this strategy?',
    service: 'CendiaPreMortem™',
    endpoint: 'POST /api/v1/consolidated/pre-mortem/analyze',
    path: '/cortex/intelligence/pre-mortem',
    icon: AlertTriangle,
  },
  {
    id: 6,
    name: 'Compliance Check',
    description: 'Verify regulatory compliance (ABA, privilege, ethics)',
    service: 'CendiaOversight™',
    endpoint: 'POST /api/v1/consolidated/oversight/check',
    path: '/cortex/sovereign/panopticon',
    icon: Shield,
  },
  {
    id: 7,
    name: 'Generate Summary & Minutes',
    description: 'Executive summary and meeting minutes',
    service: 'Council Summary',
    endpoint: 'UI: Click "Executive Summary"',
    path: '/cortex/council',
    icon: FileText,
  },
  {
    id: 8,
    name: 'Sign with Notary',
    description: 'Cryptographically sign the decision',
    service: 'CendiaNotary™',
    endpoint: 'POST /api/v1/consolidated/notary/sign',
    path: '/cortex/sovereign/notary',
    icon: Key,
  },
  {
    id: 9,
    name: 'Store in Vault',
    description: 'Archive for litigation support with 7-year retention',
    service: 'CendiaVault™',
    endpoint: 'POST /api/v1/consolidated/vault/store',
    path: '/cortex/sovereign/vault',
    icon: Archive,
  },
  {
    id: 10,
    name: 'Create Decision DNA Packet',
    description: 'Immutable audit trail with full lineage',
    service: 'Decision DNA™',
    endpoint: 'Automatic via Decision DNA service',
    path: '/cortex/intelligence/decision-dna',
    icon: Dna,
  },
  {
    id: 11,
    name: 'Rehearse with Ghost Board',
    description: 'Practice presenting to the board or client',
    service: 'Ghost Board™',
    endpoint: 'POST /api/v1/consolidated/ghost-board/rehearse',
    path: '/cortex/intelligence/ghost-board',
    icon: Theater,
  },
  {
    id: 12,
    name: "Generate Regulator's Receipt",
    description: 'Audit-safe proof for regulators, examiners, or court review',
    service: "Regulator's Receipt",
    endpoint: 'Full audit bundle export',
    path: '/cortex/trust/regulators-receipt',
    icon: FileSignature,
  },
];

const LEGAL_AGENTS = [
  { id: 'matter-lead', name: 'Matter Lead', role: 'Arbiter', specialty: 'Final synthesis & decision packet', color: 'from-amber-500 to-yellow-500' },
  { id: 'research', name: 'Research Counsel', role: 'Analyst', specialty: 'Case law & precedent research', color: 'from-blue-500 to-cyan-500' },
  { id: 'litigation', name: 'Litigation Strategist', role: 'Strategist', specialty: 'Case theory & arguments', color: 'from-purple-500 to-violet-500' },
  { id: 'risk', name: 'Risk Counsel', role: 'Risk Assessor', specialty: 'Liability & exposure analysis', color: 'from-red-500 to-orange-500' },
  { id: 'opposing', name: 'Opposing Counsel', role: 'Red Team', specialty: 'Adversarial challenge', color: 'from-rose-600 to-red-600' },
];

// =============================================================================
// COMPONENT
// =============================================================================

const LegalWorkflowPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-slate-950 to-neutral-950 text-white">
      {/* Header */}
      <header className="border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Legal Decision Workflow</h1>
              <p className="text-sm text-neutral-400">12-Step Integrated Flow with Audit-Safe Proof</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Legal Agents */}
        <div className="mb-8 bg-neutral-900/50 rounded-2xl p-6 border border-neutral-800">
          <h2 className="text-lg font-semibold mb-4">Legal Council Agents (5)</h2>
          <div className="grid grid-cols-5 gap-4">
            {LEGAL_AGENTS.map(agent => (
              <div key={agent.id} className="bg-neutral-800/50 rounded-xl p-4 border border-neutral-700">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${agent.color} flex items-center justify-center mb-3`}>
                  <span className="text-lg">⚖️</span>
                </div>
                <h4 className="font-medium text-sm">{agent.name}</h4>
                <p className="text-xs text-neutral-500">{agent.role}</p>
                <p className="text-xs text-neutral-400 mt-1">{agent.specialty}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Workflow Steps */}
        <div className="space-y-3">
          {WORKFLOW_STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <Link
                key={step.id}
                to={step.path}
                className="block rounded-xl p-5 border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800/50 hover:border-neutral-700 transition-all group"
              >
                <div className="flex items-center gap-4">
                  {/* Step Number */}
                  <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center text-lg font-bold">
                    {step.id}
                  </div>

                  {/* Icon */}
                  <div className="w-10 h-10 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-400 group-hover:text-amber-400 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold">{step.name}</h3>
                      <span className="px-2 py-0.5 bg-neutral-800 rounded text-xs text-neutral-400">
                        {step.service}
                      </span>
                    </div>
                    <p className="text-neutral-400 text-sm">{step.description}</p>
                    <code className="text-xs text-neutral-500 mt-1 block">{step.endpoint}</code>
                  </div>

                  {/* Arrow */}
                  <div className="text-neutral-600 group-hover:text-amber-400 transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="mt-8 p-6 bg-amber-900/20 rounded-xl border border-amber-700/30">
          <h3 className="font-semibold text-amber-400 mb-2">Workflow Summary</h3>
          <p className="text-neutral-300 text-sm">
            This workflow integrates all Datacendia services for a complete legal decision process. 
            Each step links to the actual service where the work is performed. The final step generates 
            a Regulator's Receipt - an audit-safe proof that answers: "Why did you approve this decision, 
            using what data, under which policy, and who reviewed it?"
          </p>
        </div>
      </main>
    </div>
  );
};

export default LegalWorkflowPage;
