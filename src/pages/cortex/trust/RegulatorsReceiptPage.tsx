// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * REGULATOR'S RECEIPT DEMO PAGE
 * 
 * Dedicated page showcasing the Regulator's Receipt demo for clinical trial data
 * deliberation, consensus building, and cryptographic signing.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileSignature, Shield, Lock } from 'lucide-react';
import { RegulatorsReceiptDemo } from '../../../components/demos/RegulatorsReceiptDemo';
import { RedactionProvider, RedactionToggle } from '../../../components/ui/RedactedText';

const RegulatorsReceiptPage: React.FC = () => {
  return (
    <RedactionProvider>
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-slate-950 to-neutral-950">
      {/* Header */}
      <header className="border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/cortex/council"
                className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back to Council</span>
              </Link>
              <div className="w-px h-6 bg-neutral-700" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center">
                  <FileSignature className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">Regulator's Receipt</h1>
                  <p className="text-xs text-neutral-400">Audit-Safe Proof for Regulators & Examiners</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <RedactionToggle variant="dark" />
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-900/30 border border-emerald-700/50 rounded-full">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-emerald-300">FDA 21 CFR Part 11</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-cyan-900/30 border border-cyan-700/50 rounded-full">
                <Lock className="w-4 h-4 text-cyan-400" />
                <span className="text-xs text-cyan-300">GxP Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Introduction */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-violet-900/20 via-cyan-900/20 to-emerald-900/20 rounded-2xl p-6 border border-neutral-800">
            <h2 className="text-xl font-bold text-white mb-3">
              How AI Agents Deliberate on Clinical Data
            </h2>
            <p className="text-neutral-300 mb-4">
              This demonstration shows how Datacendia's CendiaCouncil™ AI agents analyze clinical trial data,
              engage in structured debate from multiple specialty perspectives, reach consensus through
              formal voting, and cryptographically sign the decision packet for regulatory compliance.
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-neutral-900/50 rounded-xl p-4 border border-neutral-700">
                <div className="text-2xl mb-2">🔬</div>
                <h3 className="text-sm font-semibold text-white mb-1">Multi-Specialty Analysis</h3>
                <p className="text-xs text-neutral-400">
                  CMO, Biostatistics, Safety, Regulatory, and Quality agents each analyze from their expertise
                </p>
              </div>
              <div className="bg-neutral-900/50 rounded-xl p-4 border border-neutral-700">
                <div className="text-2xl mb-2">⚖️</div>
                <h3 className="text-sm font-semibold text-white mb-1">Structured Deliberation</h3>
                <p className="text-xs text-neutral-400">
                  Agents present findings, challenge assumptions, and build consensus through formal debate
                </p>
              </div>
              <div className="bg-neutral-900/50 rounded-xl p-4 border border-neutral-700">
                <div className="text-2xl mb-2">🔐</div>
                <h3 className="text-sm font-semibold text-white mb-1">Cryptographic Signing</h3>
                <p className="text-xs text-neutral-400">
                  Each agent digitally signs the decision packet with Ed25519 signatures and Merkle proof
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Component */}
        <RegulatorsReceiptDemo autoStart={false} className="mb-8" />

        {/* Technical Details */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-neutral-900/50 rounded-2xl p-6 border border-neutral-800">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-400" />
              Regulatory Compliance
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-900/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-emerald-400 text-xs">✓</span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white">FDA 21 CFR Part 11</h4>
                  <p className="text-xs text-neutral-400">
                    Electronic records and signatures with audit trail, access controls, and validation
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-900/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-emerald-400 text-xs">✓</span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white">EMA GxP Guidelines</h4>
                  <p className="text-xs text-neutral-400">
                    Good Practice compliance for pharmaceutical manufacturing and clinical trials
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-900/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-emerald-400 text-xs">✓</span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white">ICH E6(R2) GCP</h4>
                  <p className="text-xs text-neutral-400">
                    Good Clinical Practice harmonized guidelines for clinical trial conduct
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-neutral-900/50 rounded-2xl p-6 border border-neutral-800">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-cyan-400" />
              Cryptographic Assurance
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-cyan-900/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-cyan-400 text-xs">🔑</span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white">Ed25519 Digital Signatures</h4>
                  <p className="text-xs text-neutral-400">
                    Each agent signs with their unique private key, verifiable with public key
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-cyan-900/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-cyan-400 text-xs">#</span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white">Merkle Tree Integrity</h4>
                  <p className="text-xs text-neutral-400">
                    All data points and deliberation transcript hashed into tamper-evident root
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-cyan-900/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-cyan-400 text-xs">⛓</span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white">Blockchain Anchoring</h4>
                  <p className="text-xs text-neutral-400">
                    Optional anchoring to public blockchain for immutable timestamp proof
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-neutral-500 text-sm">
              <span>Powered by</span>
              <span className="text-amber-400 font-semibold">CendiaCouncil™</span>
              <span>Sovereign AI Decision Engine</span>
            </div>
            <div className="text-xs text-neutral-600">
              © {new Date().getFullYear()} Datacendia. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
    </RedactionProvider>
  );
};

export default RegulatorsReceiptPage;
