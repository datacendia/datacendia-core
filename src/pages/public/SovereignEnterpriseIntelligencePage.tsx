// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA - SOVEREIGN ENTERPRISE INTELLIGENCE CATEGORY PAGE
// What category are we in? This page defines it.
// =============================================================================

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Database, Clock, Users, Shield, Eye, Zap } from 'lucide-react';

export const SovereignEnterpriseIntelligencePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white font-light antialiased">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="text-xl font-light tracking-[0.15em] text-white">
              DATACENDIA
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link
                to="/product"
                className="text-xs tracking-wider text-slate-400 hover:text-white transition-colors"
              >
                PRODUCT
              </Link>
              <Link
                to="/honesty"
                className="text-xs tracking-wider text-slate-400 hover:text-white transition-colors"
              >
                HONESTY
              </Link>
              <Link
                to="/pricing"
                className="text-xs tracking-wider text-slate-400 hover:text-white transition-colors"
              >
                PRICING
              </Link>
            </div>
            <Link
              to="/demo"
              className="px-5 py-2 bg-amber-500 text-black text-sm font-bold rounded hover:bg-amber-400 transition-colors"
            >
              Request Early Access
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs tracking-[0.4em] text-amber-500 uppercase mb-6">
            CATEGORY DEFINITION
          </p>
          <h1 className="text-4xl md:text-6xl font-light tracking-tight mb-6">
            Sovereign Enterprise Intelligence
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            A governed decision layer that runs on your infrastructure, replays any moment in time,
            and proves why you made each decision.
          </p>
        </div>
      </section>

      {/* Dev-Style Definition */}
      <section className="py-16 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-8 font-mono">
            <p className="text-slate-500 text-sm mb-4">// What is SEI?</p>
            <pre className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
              {`interface SovereignEnterpriseIntelligence {
  // Runs entirely on YOUR infrastructure
  deployment: 'on-prem' | 'private-cloud' | 'air-gapped';
  
  // Every decision is recorded and replayable
  auditTrail: ImmutableLedger;
  timeMachine: ChronosEngine;
  
  // Multi-agent reasoning, not single-model answers
  council: AICouncil<CFO | CISO | Ethics | Legal | ...>;
  
  // Formal dissent tracking and governance
  dissent: DissentProtocol;
  governance: StakeholderLayer;
  
  // Your models, your control
  modelZoo: SovereignModelZoo;
}`}
            </pre>
          </div>
        </div>
      </section>

      {/* Why BI/ML/Copilots Don't Cover This */}
      <section className="py-16 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-light text-center mb-12">
            Why Existing Tools Don't Cover the Decision Layer
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-900/30 border border-slate-800 p-6 rounded-lg">
              <h3 className="text-amber-400 font-mono text-sm mb-3">BUSINESS INTELLIGENCE</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Shows you what happened. Dashboards, charts, reports.
              </p>
              <p className="text-slate-500 text-xs">
                <span className="text-red-400">Missing:</span> Why it happened. Who decided. What
                alternatives existed.
              </p>
            </div>

            <div className="bg-slate-900/30 border border-slate-800 p-6 rounded-lg">
              <h3 className="text-amber-400 font-mono text-sm mb-3">ML / AI PLATFORMS</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Trains models. Deploys predictions. Monitors drift.
              </p>
              <p className="text-slate-500 text-xs">
                <span className="text-red-400">Missing:</span> Multi-agent debate. Dissent tracking.
                Audit-ready explainability.
              </p>
            </div>

            <div className="bg-slate-900/30 border border-slate-800 p-6 rounded-lg">
              <h3 className="text-amber-400 font-mono text-sm mb-3">AI COPILOTS</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Answers questions. Generates content. Assists tasks.
              </p>
              <p className="text-slate-500 text-xs">
                <span className="text-red-400">Missing:</span> Governance layer. Sovereignty.
                Evidence preservation. Council deliberation.
              </p>
            </div>
          </div>

          <p className="text-center text-slate-500 mt-8 text-sm">
            SEI sits <em>above</em> these tools. It's the decision layer that governs how
            intelligence flows into action.
          </p>
        </div>
      </section>

      {/* Core Capabilities */}
      <section className="py-16 border-t border-white/5 bg-slate-950/50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-light text-center mb-12">Core Capabilities</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex gap-4 p-6 bg-black/50 border border-slate-800 rounded-lg">
              <Clock className="w-8 h-8 text-amber-500 flex-shrink-0" />
              <div>
                <h3 className="font-medium mb-2">Time Machine</h3>
                <p className="text-sm text-slate-400">
                  Replay any moment in your organization's history. See exactly what was known,
                  decided, and why. CendiaChronos™ makes audits trivial.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-black/50 border border-slate-800 rounded-lg">
              <Users className="w-8 h-8 text-blue-500 flex-shrink-0" />
              <div>
                <h3 className="font-medium mb-2">AI Council</h3>
                <p className="text-sm text-slate-400">
                  Multi-agent deliberation. CFO, CISO, Ethics Officer debate before answering.
                  Dissent is tracked. Consensus is earned.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-black/50 border border-slate-800 rounded-lg">
              <Zap className="w-8 h-8 text-purple-500 flex-shrink-0" />
              <div>
                <h3 className="font-medium mb-2">Simulation Engine</h3>
                <p className="text-sm text-slate-400">
                  CendiaCrucible™ runs 10,000+ Monte Carlo simulations. Stress-test decisions before
                  you make them. See what breaks.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-black/50 border border-slate-800 rounded-lg">
              <Shield className="w-8 h-8 text-green-500 flex-shrink-0" />
              <div>
                <h3 className="font-medium mb-2">Governance Layer</h3>
                <p className="text-sm text-slate-400">
                  Immutable audit trail. Formal dissent protocol. Stakeholder visibility. Built for
                  regulators, boards, and "show me why" moments.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-black/50 border border-slate-800 rounded-lg">
              <Eye className="w-8 h-8 text-cyan-500 flex-shrink-0" />
              <div>
                <h3 className="font-medium mb-2">Stakeholder Layer</h3>
                <p className="text-sm text-slate-400">
                  CendiaPanopticon™ maps who cares about what. Surface concerns before they become
                  crises. Radical transparency as a feature.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-black/50 border border-slate-800 rounded-lg">
              <Database className="w-8 h-8 text-rose-500 flex-shrink-0" />
              <div>
                <h3 className="font-medium mb-2">Sovereign Model Zoo</h3>
                <p className="text-sm text-slate-400">
                  Your models. Your infrastructure. Role-specialized agents (CFO uses different
                  models than Coder). No data leaves your control.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Where It Sits in the Stack */}
      <section className="py-16 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-light text-center mb-12">Where SEI Sits in the Stack</h2>

          <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-8 font-mono text-sm">
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <span className="text-slate-600 w-24">Layer 5</span>
                <div className="flex-1 bg-amber-900/30 border border-amber-700/50 px-4 py-2 rounded text-amber-300">
                  SOVEREIGN ENTERPRISE INTELLIGENCE ← You are here
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-slate-600 w-24">Layer 4</span>
                <div className="flex-1 bg-slate-800/50 border border-slate-700 px-4 py-2 rounded text-slate-400">
                  AI/ML Platforms, Copilots, LLM APIs
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-slate-600 w-24">Layer 3</span>
                <div className="flex-1 bg-slate-800/50 border border-slate-700 px-4 py-2 rounded text-slate-400">
                  BI Tools, Analytics, Dashboards
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-slate-600 w-24">Layer 2</span>
                <div className="flex-1 bg-slate-800/50 border border-slate-700 px-4 py-2 rounded text-slate-400">
                  Data Warehouse, Data Lake, ETL
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-slate-600 w-24">Layer 1</span>
                <div className="flex-1 bg-slate-800/50 border border-slate-700 px-4 py-2 rounded text-slate-400">
                  Source Systems (ERP, CRM, HR, Finance)
                </div>
              </div>
            </div>

            <p className="text-slate-500 mt-6 text-xs">
              SEI doesn't replace your existing stack. It sits on top, governing how intelligence
              flows into decisions.
            </p>
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-16 border-t border-white/5 bg-slate-950/50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-light text-center mb-4">Who It's For</h2>
          <p className="text-center text-slate-500 mb-12 max-w-2xl mx-auto">
            Organizations where decisions have consequences—and where "we don't know why we decided
            that" is unacceptable.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 border border-slate-800 rounded-lg">
              <h3 className="text-amber-400 font-medium mb-3">Typical Triggers</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>• Regulator asks "show me how AI decided X"</li>
                <li>• Board wants audit trail for strategic decisions</li>
                <li>• Post-mortem reveals no one knows why decision was made</li>
                <li>• M&A due diligence requires decision lineage</li>
                <li>• New compliance requirement (AI Act, SOX, SEC)</li>
                <li>• Key person leaves and institutional memory vanishes</li>
              </ul>
            </div>

            <div className="p-6 border border-slate-800 rounded-lg">
              <h3 className="text-amber-400 font-medium mb-3">Industries</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  • <strong className="text-white">Financial Services</strong> — Banks, asset
                  managers, insurers
                </li>
                <li>
                  • <strong className="text-white">Healthcare</strong> — Hospital systems, pharma,
                  payers
                </li>
                <li>
                  • <strong className="text-white">Government</strong> — Federal, state, defense,
                  intelligence
                </li>
                <li>
                  • <strong className="text-white">Critical Infrastructure</strong> — Energy,
                  utilities, transport
                </li>
                <li>
                  • <strong className="text-white">Regulated Enterprise</strong> — Any org with
                  compliance obligations
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm mb-6">
            Datacendia is one implementation of this layer.
          </p>
          <h2 className="text-3xl font-light mb-6">
            We do not host your data.
            <br />
            <span className="text-amber-400">We return your mind.</span>
          </h2>
          <p className="text-slate-400 mb-10">
            Sovereign. Auditable. Governed. Built for organizations where decisions matter.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/demo"
              className="px-8 py-4 bg-amber-500 text-black font-bold rounded hover:bg-amber-400 transition-colors flex items-center justify-center gap-2"
            >
              Request Early Access <ArrowRight size={18} />
            </Link>
            <Link
              to="/honesty"
              className="px-8 py-4 border border-slate-700 text-white rounded hover:bg-slate-900 transition-colors"
            >
              View Honesty Matrices
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} Datacendia · Sovereign Enterprise Intelligence Platform
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SovereignEnterpriseIntelligencePage;
