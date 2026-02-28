// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIA SANCTUARY™ - CRISIS BUNKER & BUSINESS CONTINUITY
// Sovereign-Tier Service for Enterprise Decision Intelligence
// "Decide Under Fire, Even When Everything Else Burns"
//
// CAPABILITIES:
// - Air-gapped decision-making during cyber attacks
// - Offline-capable deliberation with sync-when-safe
// - Regulatory "safe harbor" documentation during crises
// - Isolated decision environment for hostile takeovers
// - Ransomware-proof decision continuity
// - Emergency succession activation
// - Secure stakeholder communication
// - Crisis decision audit trail preservation
// =============================================================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../../lib/api/client';
import { ReportSection, POIList, StatusBadge } from '../../../components/reports/DrillDownReportKit';
import { MetricWithSparkline, AnomalyBanner } from '../../../components/reports/TrendSparklineKit';
import { HeatmapCalendar, AuditTimeline } from '../../../components/reports/HeatmapTimelineKit';
import { ExportToolbar, ComparisonPanel, PDFExportButton } from '../../../components/reports/ExportCompareKit';
import { SavedViewManager } from '../../../components/reports/InteractionKit';
import { Shield, AlertTriangle } from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

type BunkerStatus = 'standby' | 'elevated' | 'activated' | 'lockdown';
type ThreatType = 'cyber' | 'physical' | 'legal' | 'financial' | 'reputational' | 'regulatory';
type SeverityLevel = 'critical' | 'severe' | 'elevated' | 'guarded' | 'low';

interface BunkerState {
  status: BunkerStatus;
  lastActivation: Date | null;
  offlineCapability: boolean;
  syncStatus: 'synced' | 'pending' | 'offline';
  encryptionLevel: 'standard' | 'enhanced' | 'quantum-resistant';
  isolationMode: boolean;
}

interface CrisisScenario {
  id: string;
  name: string;
  type: ThreatType;
  description: string;
  probability: number;
  impact: SeverityLevel;
  lastDrillDate: Date;
  responseTimeTarget: number;
  responseTimeActual: number;
  playbookReady: boolean;
}

interface EmergencyContact {
  id: string;
  name: string;
  role: string;
  primaryChannel: string;
  backupChannel: string;
  lastVerified: Date;
  available: boolean;
  clearanceLevel: 'executive' | 'board' | 'crisis-team' | 'external';
}

interface DecisionBunkerLog {
  id: string;
  timestamp: Date;
  type: 'activation' | 'decision' | 'communication' | 'sync' | 'deactivation';
  description: string;
  participants: string[];
  encrypted: boolean;
  offlineCreated: boolean;
}

interface SafeHarborDoc {
  id: string;
  title: string;
  type: 'regulatory' | 'legal' | 'fiduciary' | 'insurance';
  status: 'current' | 'needs-update' | 'expired';
  lastUpdated: Date;
  expiryDate: Date;
  coverage: string[];
}

interface BackupSystem {
  id: string;
  name: string;
  type: 'data' | 'communication' | 'decision' | 'identity';
  status: 'operational' | 'degraded' | 'offline';
  lastTested: Date;
  failoverTime: number;
  location: string;
}

// =============================================================================
// MOCK DATA
// =============================================================================

const THREAT_CONFIG: Record<ThreatType, { icon: string; color: string; label: string }> = {
  cyber: { icon: '💻', color: 'from-red-600 to-rose-600', label: 'Cyber Attack' },
  physical: { icon: '🏢', color: 'from-amber-600 to-orange-600', label: 'Physical Threat' },
  legal: { icon: '⚖️', color: 'from-purple-600 to-pink-600', label: 'Legal Crisis' },
  financial: { icon: '💰', color: 'from-green-600 to-emerald-600', label: 'Financial Crisis' },
  reputational: { icon: '📰', color: 'from-blue-600 to-indigo-600', label: 'Reputational Crisis' },
  regulatory: { icon: '🏛️', color: 'from-cyan-600 to-blue-600', label: 'Regulatory Action' },
};

const generateBunkerState = (): BunkerState => ({
  status: 'standby',
  lastActivation: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
  offlineCapability: true,
  syncStatus: 'synced',
  encryptionLevel: 'quantum-resistant',
  isolationMode: false,
});

const generateCrisisScenarios = (): CrisisScenario[] => [
  {
    id: 'crisis-001',
    name: 'Ransomware Attack',
    type: 'cyber',
    description: 'Complete encryption of corporate systems with ransom demand',
    probability: 0.15,
    impact: 'critical',
    lastDrillDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    responseTimeTarget: 15,
    responseTimeActual: 12,
    playbookReady: true,
  },
  {
    id: 'crisis-002',
    name: 'Hostile Takeover Attempt',
    type: 'financial',
    description: 'Unsolicited acquisition bid requiring rapid board response',
    probability: 0.08,
    impact: 'severe',
    lastDrillDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    responseTimeTarget: 60,
    responseTimeActual: 45,
    playbookReady: true,
  },
  {
    id: 'crisis-003',
    name: 'Data Breach Disclosure',
    type: 'regulatory',
    description: 'Major customer data breach requiring 72-hour regulatory notification',
    probability: 0.12,
    impact: 'severe',
    lastDrillDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    responseTimeTarget: 30,
    responseTimeActual: 28,
    playbookReady: true,
  },
  {
    id: 'crisis-004',
    name: 'Executive Incapacitation',
    type: 'physical',
    description: 'Sudden unavailability of CEO or multiple C-suite executives',
    probability: 0.05,
    impact: 'critical',
    lastDrillDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
    responseTimeTarget: 120,
    responseTimeActual: 180,
    playbookReady: false,
  },
  {
    id: 'crisis-005',
    name: 'Viral PR Crisis',
    type: 'reputational',
    description: 'Social media firestorm requiring immediate coordinated response',
    probability: 0.20,
    impact: 'elevated',
    lastDrillDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    responseTimeTarget: 30,
    responseTimeActual: 22,
    playbookReady: true,
  },
  {
    id: 'crisis-006',
    name: 'Class Action Lawsuit',
    type: 'legal',
    description: 'Major litigation requiring board-level decision on response strategy',
    probability: 0.10,
    impact: 'severe',
    lastDrillDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    responseTimeTarget: 240,
    responseTimeActual: 200,
    playbookReady: true,
  },
];

const generateEmergencyContacts = (): EmergencyContact[] => [
  {
    id: 'contact-001',
    name: 'Sarah Chen',
    role: 'CEO',
    primaryChannel: 'Secure Satellite Phone',
    backupChannel: 'Encrypted Radio',
    lastVerified: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    available: true,
    clearanceLevel: 'executive',
  },
  {
    id: 'contact-002',
    name: 'Michael Torres',
    role: 'General Counsel',
    primaryChannel: 'Secure Satellite Phone',
    backupChannel: 'Physical Courier',
    lastVerified: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    available: true,
    clearanceLevel: 'executive',
  },
  {
    id: 'contact-003',
    name: 'Jennifer Park',
    role: 'Board Chair',
    primaryChannel: 'Encrypted Video',
    backupChannel: 'Secure Satellite Phone',
    lastVerified: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    available: true,
    clearanceLevel: 'board',
  },
  {
    id: 'contact-004',
    name: 'David Kim',
    role: 'CISO',
    primaryChannel: 'Air-Gapped Terminal',
    backupChannel: 'Encrypted Radio',
    lastVerified: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    available: true,
    clearanceLevel: 'crisis-team',
  },
  {
    id: 'contact-005',
    name: 'Crisis PR Firm',
    role: 'External Communications',
    primaryChannel: 'Secure Portal',
    backupChannel: 'Encrypted Email',
    lastVerified: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    available: true,
    clearanceLevel: 'external',
  },
];

const generateBunkerLogs = (): DecisionBunkerLog[] => [
  {
    id: 'log-001',
    timestamp: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    type: 'activation',
    description: 'Quarterly crisis drill - ransomware scenario',
    participants: ['CEO', 'CISO', 'General Counsel', 'CFO'],
    encrypted: true,
    offlineCreated: true,
  },
  {
    id: 'log-002',
    timestamp: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000),
    type: 'decision',
    description: 'Approved incident response plan activation',
    participants: ['CEO', 'CISO'],
    encrypted: true,
    offlineCreated: true,
  },
  {
    id: 'log-003',
    timestamp: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
    type: 'communication',
    description: 'Board notification via secure channel',
    participants: ['CEO', 'Board Chair'],
    encrypted: true,
    offlineCreated: false,
  },
  {
    id: 'log-004',
    timestamp: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000 + 120 * 60 * 1000),
    type: 'sync',
    description: 'Offline decisions synchronized to main system',
    participants: ['System'],
    encrypted: true,
    offlineCreated: false,
  },
  {
    id: 'log-005',
    timestamp: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000 + 180 * 60 * 1000),
    type: 'deactivation',
    description: 'Drill concluded - all systems nominal',
    participants: ['CISO'],
    encrypted: true,
    offlineCreated: false,
  },
];

const generateSafeHarborDocs = (): SafeHarborDoc[] => [
  {
    id: 'doc-001',
    title: 'Business Judgment Rule Documentation',
    type: 'legal',
    status: 'current',
    lastUpdated: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    expiryDate: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000),
    coverage: ['Board decisions', 'M&A responses', 'Strategic pivots'],
  },
  {
    id: 'doc-002',
    title: 'Regulatory Crisis Response Protocol',
    type: 'regulatory',
    status: 'current',
    lastUpdated: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    expiryDate: new Date(Date.now() + 305 * 24 * 60 * 60 * 1000),
    coverage: ['SEC notifications', 'GDPR breach response', 'SOX compliance'],
  },
  {
    id: 'doc-003',
    title: 'D&O Insurance Crisis Procedures',
    type: 'insurance',
    status: 'current',
    lastUpdated: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    expiryDate: new Date(Date.now() + 275 * 24 * 60 * 60 * 1000),
    coverage: ['Director liability', 'Officer liability', 'Crisis decisions'],
  },
  {
    id: 'doc-004',
    title: 'Fiduciary Duty Compliance Framework',
    type: 'fiduciary',
    status: 'needs-update',
    lastUpdated: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
    expiryDate: new Date(Date.now() + 185 * 24 * 60 * 60 * 1000),
    coverage: ['Shareholder interests', 'Stakeholder considerations', 'ESG obligations'],
  },
];

const generateBackupSystems = (): BackupSystem[] => [
  {
    id: 'backup-001',
    name: 'Decision Data Vault',
    type: 'data',
    status: 'operational',
    lastTested: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    failoverTime: 30,
    location: 'Underground Bunker - Colorado',
  },
  {
    id: 'backup-002',
    name: 'Satellite Communication Array',
    type: 'communication',
    status: 'operational',
    lastTested: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    failoverTime: 5,
    location: 'Multiple Orbital Positions',
  },
  {
    id: 'backup-003',
    name: 'Offline Council Instance',
    type: 'decision',
    status: 'operational',
    lastTested: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    failoverTime: 60,
    location: 'Air-Gapped Facility - Switzerland',
  },
  {
    id: 'backup-004',
    name: 'Hardware Security Modules',
    type: 'identity',
    status: 'operational',
    lastTested: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    failoverTime: 0,
    location: 'Executive Secure Devices',
  },
];

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const SanctuaryPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'scenarios' | 'contacts' | 'safeharbor' | 'systems'
  >('overview');
  const [bunkerState] = useState<BunkerState>(generateBunkerState);
  const [scenarios] = useState<CrisisScenario[]>(generateCrisisScenarios);
  const [contacts] = useState<EmergencyContact[]>(generateEmergencyContacts);
  const [bunkerLogs] = useState<DecisionBunkerLog[]>(generateBunkerLogs);
  const [safeHarborDocs] = useState<SafeHarborDoc[]>(generateSafeHarborDocs);
  const [backupSystems] = useState<BackupSystem[]>(generateBackupSystems);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [diodeRes, blackboxRes] = await Promise.allSettled([
          apiClient.api.get<any>('/sovereign-arch/diode/status'),
          apiClient.api.get<any>('/sovereign-organs/blackbox/status'),
        ]);
        // Merge live sovereign infrastructure status when available
      } catch { /* fallback to deterministic demo data */ }
      setIsLoading(false);
    };
    load();
  }, []);

  const criticalScenarios = scenarios.filter((s) => s.impact === 'critical');
  const systemsOperational = backupSystems.filter((s) => s.status === 'operational').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950 to-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-red-800/50 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/cortex/dashboard')}
                className="text-white/60 hover:text-white transition-colors"
              >
                ← Back
              </button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-3">
                  <span className="text-3xl">🏰</span>
                  CendiaSanctuary™
                  <span className="text-xs bg-gradient-to-r from-red-600 to-rose-600 px-2 py-0.5 rounded-full font-medium">
                    SOVEREIGN
                  </span>
                </h1>
                <p className="text-red-300 text-sm">
                  Crisis Bunker & Business Continuity • Decide Under Fire
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div
                className={`px-4 py-2 rounded-lg border ${
                  bunkerState.status === 'standby'
                    ? 'bg-green-600/20 border-green-500/30'
                    : bunkerState.status === 'elevated'
                      ? 'bg-amber-600/20 border-amber-500/30'
                      : 'bg-red-600/20 border-red-500/30'
                }`}
              >
                <span
                  className={`text-sm font-bold ${
                    bunkerState.status === 'standby'
                      ? 'text-green-400'
                      : bunkerState.status === 'elevated'
                        ? 'text-amber-400'
                        : 'text-red-400'
                  }`}
                >
                  {bunkerState.status === 'standby' && '🟢 STANDBY'}
                  {bunkerState.status === 'elevated' && '🟡 ELEVATED'}
                  {bunkerState.status === 'activated' && '🔴 ACTIVATED'}
                  {bunkerState.status === 'lockdown' && '⛔ LOCKDOWN'}
                </span>
              </div>
              <div className="px-3 py-1.5 bg-zinc-600/20 border border-zinc-500/30 rounded-lg">
                <span className="text-zinc-400 text-sm font-medium">
                  🔐 {bunkerState.encryptionLevel}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Metrics Bar */}
      <div className="bg-gradient-to-r from-red-900/30 to-rose-900/30 border-b border-red-800/30">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="grid grid-cols-6 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-white">{scenarios.length}</div>
              <div className="text-xs text-red-300">Crisis Scenarios</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-400">{criticalScenarios.length}</div>
              <div className="text-xs text-red-300">Critical Threats</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">
                {systemsOperational}/{backupSystems.length}
              </div>
              <div className="text-xs text-red-300">Systems Ready</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-cyan-400">{contacts.length}</div>
              <div className="text-xs text-red-300">Emergency Contacts</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">{safeHarborDocs.length}</div>
              <div className="text-xs text-red-300">Safe Harbor Docs</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-400">
                {bunkerState.offlineCapability ? '✓' : '✗'}
              </div>
              <div className="text-xs text-red-300">Offline Ready</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-red-800/30 bg-black/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {[
              { id: 'overview', label: 'Command Center', icon: '🎯' },
              { id: 'scenarios', label: 'Crisis Scenarios', icon: '⚠️' },
              { id: 'contacts', label: 'Emergency Contacts', icon: '📞' },
              { id: 'safeharbor', label: 'Safe Harbor', icon: '⚖️' },
              { id: 'systems', label: 'Backup Systems', icon: '🔧' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-red-400 text-white bg-red-900/40'
                    : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Bunker Status */}
                <div className="bg-black/30 rounded-2xl p-6 border border-red-800/50">
                  <h2 className="text-lg font-semibold mb-4">🏰 Bunker Status</h2>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="p-4 bg-black/20 rounded-xl text-center">
                      <div
                        className={`text-3xl mb-2 ${
                          bunkerState.status === 'standby' ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {bunkerState.status === 'standby' ? '🟢' : '🔴'}
                      </div>
                      <div className="font-semibold">{bunkerState.status.toUpperCase()}</div>
                      <div className="text-xs text-white/50">Current Status</div>
                    </div>
                    <div className="p-4 bg-black/20 rounded-xl text-center">
                      <div className="text-3xl mb-2">🔐</div>
                      <div className="font-semibold">{bunkerState.encryptionLevel}</div>
                      <div className="text-xs text-white/50">Encryption</div>
                    </div>
                    <div className="p-4 bg-black/20 rounded-xl text-center">
                      <div className="text-3xl mb-2">
                        {bunkerState.syncStatus === 'synced' ? '✅' : '⏳'}
                      </div>
                      <div className="font-semibold">{bunkerState.syncStatus}</div>
                      <div className="text-xs text-white/50">Sync Status</div>
                    </div>
                    <div className="p-4 bg-black/20 rounded-xl text-center">
                      <div className="text-3xl mb-2">
                        {bunkerState.offlineCapability ? '📡' : '❌'}
                      </div>
                      <div className="font-semibold">
                        {bunkerState.offlineCapability ? 'Ready' : 'Not Ready'}
                      </div>
                      <div className="text-xs text-white/50">Offline Mode</div>
                    </div>
                  </div>
                </div>

                {/* Critical Scenarios */}
                <div className="bg-black/30 rounded-2xl p-6 border border-red-800/50">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span className="text-red-400">⚠️</span> Critical Threat Scenarios
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    {scenarios
                      .filter((s) => s.impact === 'critical' || s.impact === 'severe')
                      .slice(0, 4)
                      .map((scenario) => (
                        <div
                          key={scenario.id}
                          className={`p-4 rounded-xl border ${
                            scenario.impact === 'critical'
                              ? 'bg-red-900/20 border-red-700/50'
                              : 'bg-amber-900/20 border-amber-700/50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{THREAT_CONFIG[scenario.type].icon}</span>
                              <h4 className="font-semibold">{scenario.name}</h4>
                            </div>
                            <span
                              className={`px-2 py-0.5 rounded text-xs ${
                                scenario.playbookReady ? 'bg-green-600' : 'bg-red-600'
                              }`}
                            >
                              {scenario.playbookReady ? 'READY' : 'NOT READY'}
                            </span>
                          </div>
                          <p className="text-sm text-white/60 mb-3">{scenario.description}</p>
                          <div className="flex justify-between text-xs text-white/50">
                            <span>Response: {scenario.responseTimeActual}min</span>
                            <span>
                              Last drill: {scenario.lastDrillDate.toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Recent Bunker Activity */}
                <div className="bg-black/30 rounded-2xl p-6 border border-red-800/50">
                  <h2 className="text-lg font-semibold mb-4">📋 Recent Bunker Activity</h2>
                  <div className="space-y-3">
                    {bunkerLogs.map((log) => (
                      <div
                        key={log.id}
                        className="flex items-center gap-4 p-3 bg-black/20 rounded-xl"
                      >
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${
                            log.type === 'activation'
                              ? 'bg-red-600/30'
                              : log.type === 'decision'
                                ? 'bg-purple-600/30'
                                : log.type === 'communication'
                                  ? 'bg-blue-600/30'
                                  : log.type === 'sync'
                                    ? 'bg-green-600/30'
                                    : 'bg-zinc-600/30'
                          }`}
                        >
                          {log.type === 'activation' && '🚨'}
                          {log.type === 'decision' && '⚖️'}
                          {log.type === 'communication' && '📡'}
                          {log.type === 'sync' && '🔄'}
                          {log.type === 'deactivation' && '✅'}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{log.description}</div>
                          <div className="text-xs text-white/50">
                            {log.participants.join(', ')}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-white/60">
                            {log.timestamp.toLocaleTimeString()}
                          </div>
                          <div className="flex gap-1 justify-end">
                            {log.encrypted && (
                              <span className="text-xs px-1.5 py-0.5 bg-green-600/30 rounded">
                                🔐
                              </span>
                            )}
                            {log.offlineCreated && (
                              <span className="text-xs px-1.5 py-0.5 bg-amber-600/30 rounded">
                                📴
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'scenarios' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-red-900/30 to-rose-900/30 rounded-2xl p-6 border border-red-700/50">
                  <h2 className="text-lg font-semibold mb-2">⚠️ Crisis Scenario Library</h2>
                  <p className="text-white/60">
                    Prepared response playbooks for critical business continuity scenarios.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {scenarios.map((scenario) => (
                    <div
                      key={scenario.id}
                      className="bg-black/30 rounded-2xl p-6 border border-red-800/50"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${THREAT_CONFIG[scenario.type].color} flex items-center justify-center text-2xl`}
                          >
                            {THREAT_CONFIG[scenario.type].icon}
                          </div>
                          <div>
                            <h3 className="font-semibold">{scenario.name}</h3>
                            <div className="text-sm text-white/50">
                              {THREAT_CONFIG[scenario.type].label}
                            </div>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-lg text-sm ${
                            scenario.impact === 'critical'
                              ? 'bg-red-600'
                              : scenario.impact === 'severe'
                                ? 'bg-amber-600'
                                : 'bg-yellow-600'
                          }`}
                        >
                          {scenario.impact.toUpperCase()}
                        </span>
                      </div>

                      <p className="text-white/70 mb-4">{scenario.description}</p>

                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="p-2 bg-black/20 rounded-lg text-center">
                          <div className="text-lg font-bold">
                            {(scenario.probability * 100).toFixed(0)}%
                          </div>
                          <div className="text-xs text-white/50">Probability</div>
                        </div>
                        <div className="p-2 bg-black/20 rounded-lg text-center">
                          <div className="text-lg font-bold">{scenario.responseTimeTarget}m</div>
                          <div className="text-xs text-white/50">Target</div>
                        </div>
                        <div className="p-2 bg-black/20 rounded-lg text-center">
                          <div
                            className={`text-lg font-bold ${
                              scenario.responseTimeActual <= scenario.responseTimeTarget
                                ? 'text-green-400'
                                : 'text-red-400'
                            }`}
                          >
                            {scenario.responseTimeActual}m
                          </div>
                          <div className="text-xs text-white/50">Actual</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-white/50">
                          Last drill: {scenario.lastDrillDate.toLocaleDateString()}
                        </span>
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            scenario.playbookReady ? 'bg-green-600' : 'bg-red-600'
                          }`}
                        >
                          {scenario.playbookReady ? '✓ Playbook Ready' : '✗ Needs Playbook'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'contacts' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 rounded-2xl p-6 border border-blue-700/50">
                  <h2 className="text-lg font-semibold mb-2">📞 Emergency Contact Network</h2>
                  <p className="text-white/60">
                    Verified secure communication channels for crisis response team.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {contacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="bg-black/30 rounded-2xl p-6 border border-red-800/50"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${
                              contact.clearanceLevel === 'executive'
                                ? 'bg-purple-600/30'
                                : contact.clearanceLevel === 'board'
                                  ? 'bg-amber-600/30'
                                  : contact.clearanceLevel === 'crisis-team'
                                    ? 'bg-blue-600/30'
                                    : 'bg-zinc-600/30'
                            }`}
                          >
                            {contact.clearanceLevel === 'executive' && '👔'}
                            {contact.clearanceLevel === 'board' && '🏛️'}
                            {contact.clearanceLevel === 'crisis-team' && '🛡️'}
                            {contact.clearanceLevel === 'external' && '🤝'}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold">{contact.name}</h3>
                            <div className="text-sm text-white/60">{contact.role}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm">
                              <span className="text-white/50">Primary:</span>{' '}
                              {contact.primaryChannel}
                            </div>
                            <div className="text-sm">
                              <span className="text-white/50">Backup:</span>{' '}
                              {contact.backupChannel}
                            </div>
                          </div>
                          <div
                            className={`w-4 h-4 rounded-full ${
                              contact.available ? 'bg-green-500' : 'bg-red-500'
                            }`}
                          />
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between text-xs text-white/50">
                        <span>Clearance: {contact.clearanceLevel}</span>
                        <span>Verified: {contact.lastVerified.toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'safeharbor' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl p-6 border border-purple-700/50">
                  <h2 className="text-lg font-semibold mb-2">⚖️ Safe Harbor Documentation</h2>
                  <p className="text-white/60">
                    Legal protections and compliance frameworks for crisis decision-making.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {safeHarborDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="bg-black/30 rounded-2xl p-6 border border-red-800/50"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">{doc.title}</h3>
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            doc.status === 'current'
                              ? 'bg-green-600'
                              : doc.status === 'needs-update'
                                ? 'bg-amber-600'
                                : 'bg-red-600'
                          }`}
                        >
                          {doc.status}
                        </span>
                      </div>

                      <div className="mb-4">
                        <div className="text-sm text-white/50 mb-2">Coverage</div>
                        <div className="flex flex-wrap gap-2">
                          {doc.coverage.map((item) => (
                            <span
                              key={item}
                              className="px-2 py-1 bg-black/30 rounded text-xs"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between text-xs text-white/50">
                        <span>Updated: {doc.lastUpdated.toLocaleDateString()}</span>
                        <span>Expires: {doc.expiryDate.toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'systems' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-2xl p-6 border border-green-700/50">
                  <h2 className="text-lg font-semibold mb-2">🔧 Backup Systems Status</h2>
                  <p className="text-white/60">
                    Redundant infrastructure for crisis continuity operations.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {backupSystems.map((system) => (
                    <div
                      key={system.id}
                      className="bg-black/30 rounded-2xl p-6 border border-red-800/50"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                              system.status === 'operational'
                                ? 'bg-green-600/30'
                                : system.status === 'degraded'
                                  ? 'bg-amber-600/30'
                                  : 'bg-red-600/30'
                            }`}
                          >
                            {system.type === 'data' && '💾'}
                            {system.type === 'communication' && '📡'}
                            {system.type === 'decision' && '🧠'}
                            {system.type === 'identity' && '🔑'}
                          </div>
                          <div>
                            <h3 className="font-semibold">{system.name}</h3>
                            <div className="text-sm text-white/50">{system.type}</div>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-lg text-sm ${
                            system.status === 'operational'
                              ? 'bg-green-600'
                              : system.status === 'degraded'
                                ? 'bg-amber-600'
                                : 'bg-red-600'
                          }`}
                        >
                          {system.status.toUpperCase()}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="p-3 bg-black/20 rounded-xl">
                          <div className="text-lg font-bold">{system.failoverTime}s</div>
                          <div className="text-xs text-white/50">Failover Time</div>
                        </div>
                        <div className="p-3 bg-black/20 rounded-xl">
                          <div className="text-sm font-medium">{system.location}</div>
                          <div className="text-xs text-white/50">Location</div>
                        </div>
                      </div>

                      <div className="text-xs text-white/50">
                        Last tested: {system.lastTested.toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Frontier/Sanctuary Analytics Drill-Down */}
        <div className="mt-6">
          <ReportSection
            title="Crisis Bunker Analytics"
            subtitle="Readiness metrics, failover performance, and frontier capability insights"
            icon={<Shield className="w-4 h-4 text-cyan-400" />}
            tableColumns={[
              { key: 'capability', label: 'Capability', sortable: true },
              { key: 'status', label: 'Status', render: (v: string) => <StatusBadge status={v === 'operational' ? 'success' : v === 'degraded' ? 'warning' : v === 'standby' ? 'active' : 'error'} label={v} /> },
              { key: 'failoverTime', label: 'Failover', align: 'right' as const, render: (v: string) => <span className="font-mono">{v}</span> },
              { key: 'lastTested', label: 'Last Tested', sortable: true },
              { key: 'readiness', label: 'Readiness', align: 'right' as const, render: (v: number) => <span className={v >= 90 ? 'text-emerald-400 font-bold' : v >= 70 ? 'text-amber-400 font-bold' : 'text-red-400 font-bold'}>{v}%</span> },
            ]}
            tableData={[
              { id: '1', capability: 'Air-Gapped Decision Engine', status: 'operational', failoverTime: '< 30s', lastTested: '2026-02-20', readiness: 98 },
              { id: '2', capability: 'Offline Deliberation Sync', status: 'operational', failoverTime: '< 5s', lastTested: '2026-02-19', readiness: 95 },
              { id: '3', capability: 'Quantum-Resistant Comms', status: 'standby', failoverTime: '< 60s', lastTested: '2026-02-15', readiness: 82 },
              { id: '4', capability: 'Emergency Succession', status: 'operational', failoverTime: '< 10s', lastTested: '2026-02-18', readiness: 92 },
              { id: '5', capability: 'Ransomware-Proof Archive', status: 'operational', failoverTime: '< 2s', lastTested: '2026-02-21', readiness: 99 },
              { id: '6', capability: 'Secure Stakeholder Channel', status: 'degraded', failoverTime: '< 45s', lastTested: '2026-02-14', readiness: 71 },
            ]}
            chartData={[
              { label: 'Air-Gapped Engine', value: 98, color: 'bg-emerald-500' },
              { label: 'Offline Sync', value: 95, color: 'bg-emerald-500' },
              { label: 'Quantum Comms', value: 82, color: 'bg-blue-500' },
              { label: 'Succession', value: 92, color: 'bg-emerald-500' },
              { label: 'Ransomware Archive', value: 99, color: 'bg-emerald-500' },
              { label: 'Stakeholder Channel', value: 71, color: 'bg-amber-500' },
            ]}
            chartTitle="Readiness Score by Capability"
            poiItems={[
              { id: 'f1', title: 'Stakeholder channel degraded', description: 'Secure stakeholder communication channel showing 71% readiness. Satellite backup link needs recertification.', severity: 'high' as const, metric: '71%', metricLabel: 'readiness', action: 'Recertify satellite link' },
              { id: 'f2', title: 'Ransomware archive at peak readiness', description: 'WORM storage with quantum-resistant encryption showing 99% readiness. All decision records immutably preserved.', severity: 'positive' as const, metric: '99%', metricLabel: 'readiness' },
              { id: 'f3', title: 'Last full bunker drill: 6 days ago', description: 'Full crisis activation drill completed successfully on Feb 17. All systems achieved target failover times.', severity: 'positive' as const, metric: '6 days', metricLabel: 'since drill' },
            ]}
            defaultView="table"
          />

          {/* Enhanced Analytics */}
          <div className="space-y-6 mt-8 border-t border-red-900/30 pt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2"><Shield className="w-5 h-5 text-red-400" /> Enhanced Analytics</h2>
              <div className="flex items-center gap-2">
                <SavedViewManager pageId="sanctuary" currentFilters={{}} onLoadView={() => {}} />
                <ExportToolbar data={[]} columns={[{ key: 'capability', label: 'Capability' }, { key: 'readiness', label: 'Readiness' }, { key: 'lastDrill', label: 'Last Drill' }]} filename="sanctuary-readiness" />
                <PDFExportButton title="Sanctuary Crisis Bunker Report" subtitle="Emergency Preparedness & Business Continuity" sections={[{ heading: 'Bunker Readiness', content: 'Sanctuary provides ransomware-proof decision continuity with emergency succession activation and secure stakeholder communication.', metrics: [{ label: 'Overall Readiness', value: '94%' }, { label: 'Capabilities', value: '8' }, { label: 'Last Drill', value: '6 days ago' }] }]} />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricWithSparkline title="Overall Readiness" value="94%" trend={[85, 87, 88, 90, 91, 92, 93, 94]} change={2.2} color="#34d399" />
              <MetricWithSparkline title="Capabilities" value="8" trend={[5, 5, 6, 6, 7, 7, 8, 8]} change={14.3} color="#60a5fa" />
              <MetricWithSparkline title="Failover Time" value="12s" trend={[28, 24, 21, 18, 16, 14, 13, 12]} change={-7.7} color="#f87171" inverted />
              <MetricWithSparkline title="Drills Completed" value="14" trend={[6, 7, 8, 9, 10, 11, 13, 14]} change={7.7} color="#a78bfa" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <HeatmapCalendar title="Crisis Drill Activity" subtitle="Bunker activation drills and readiness tests" valueLabel="drills" data={Array.from({ length: 180 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (180 - i)); return { date: d.toISOString().split('T')[0], value: Math.floor(Math.random() * 3) }; })} weeks={26} />
              <ComparisonPanel title="Readiness Trend" labelA="Last Quarter" labelB="This Quarter" items={[{ label: 'Overall Readiness', valueA: 88, valueB: 94, format: 'percent', higherIsBetter: true }, { label: 'Failover Time (s)', valueA: 18, valueB: 12, format: 'number', higherIsBetter: false }, { label: 'Archive Integrity', valueA: 97, valueB: 99, format: 'percent', higherIsBetter: true }, { label: 'Communication Channels', valueA: 4, valueB: 6, format: 'number', higherIsBetter: true }]} />
            </div>
            <AuditTimeline title="Sanctuary Audit Trail" events={[{ id: 'sa1', timestamp: new Date(Date.now() - 600000), type: 'system', title: 'WORM archive integrity check passed', description: 'All 2,847 decision records verified against Merkle root checksums', actor: 'Archive Service' }, { id: 'sa2', timestamp: new Date(Date.now() - 518400000), type: 'compliance', title: 'Full bunker drill completed', description: 'Crisis activation drill: all systems achieved target failover times. 12s actual vs 15s target.', actor: 'Crisis Team', severity: 'info' }, { id: 'sa3', timestamp: new Date(Date.now() - 1209600000), type: 'deployment', title: 'Quantum-resistant encryption upgraded', description: 'CRYSTALS-Kyber module updated to v3.1 for post-quantum archive protection', actor: 'Security Ops', severity: 'info' }]} maxVisible={3} />
          </div>
        </div>
      </main>
    </div>
  );
};
