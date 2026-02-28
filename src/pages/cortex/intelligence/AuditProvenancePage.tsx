// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * DATACENDIA PLATFORM - CendiaProvenance™
 * Full decision lineage & evidence export
 * 
 * Merges Decision DNA (decision lifecycle timeline) with 
 * Regulator's Receipt (court-admissible evidence export)
 * into one unified product matching the marketing website.
 * 
 * "When the auditor asks 'prove it,' hand them this."
 * 
 * Copyright (c) 2024-2026 Datacendia, Inc. All Rights Reserved.
 */

import React, { useState } from 'react';
import {
  Dna,
  FileCheck,
  Fingerprint,
  Shield,
  Lock,
  Clock,
  CheckCircle,
  Hash,
  Download,
  ChevronRight,
} from 'lucide-react';

// Import existing page components
import { DecisionDNAPage } from './DecisionDNAPage';
import { RegulatorsReceiptPage } from '../compliance/RegulatorsReceiptPage';

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const AuditProvenancePage: React.FC = () => {
  const [activeView, setActiveView] = useState<'lineage' | 'receipt'>('lineage');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Unified Header */}
      <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-xl">
                <Fingerprint className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">CendiaProvenance™</h1>
                <p className="text-indigo-200">Full decision lineage & evidence export</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6 text-sm text-indigo-200">
              <span className="flex items-center gap-1.5"><Lock className="w-4 h-4" /> Cryptographically Signed</span>
              <span className="flex items-center gap-1.5"><Shield className="w-4 h-4" /> Court-Admissible</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4" /> SOC 2 / ISO 27001 Ready</span>
            </div>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-3 mt-6">
            {[
              { icon: Hash, label: 'Merkle Tree Integrity' },
              { icon: Clock, label: 'Complete Decision Timeline' },
              { icon: Download, label: 'One-Click Regulator Export' },
              { icon: Dna, label: 'Full Decision Lineage' },
            ].map((pill, i) => {
              const Icon = pill.icon;
              return (
                <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-full text-sm">
                  <Icon className="w-3.5 h-3.5" />
                  {pill.label}
                </span>
              );
            })}
          </div>

          {/* View Tabs */}
          <div className="flex gap-1 mt-6 bg-white/10 rounded-lg p-1 w-fit">
            <button
              onClick={() => setActiveView('lineage')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                activeView === 'lineage'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Dna className="w-4 h-4" />
              Decision Lineage
            </button>
            <button
              onClick={() => setActiveView('receipt')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                activeView === 'receipt'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <FileCheck className="w-4 h-4" />
              Evidence Export
            </button>
          </div>
        </div>
      </div>

      {/* Content — embedded mode suppresses sub-page headers */}
      {activeView === 'lineage' ? (
        <DecisionDNAPage embedded />
      ) : (
        <RegulatorsReceiptPage embedded />
      )}
    </div>
  );
};

export default AuditProvenancePage;
