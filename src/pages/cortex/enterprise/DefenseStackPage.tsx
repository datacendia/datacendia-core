// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIA DEFENSESTACK™ - GOVERNMENT/DEFENSE EDITION
// Sovereign AI Platform for National Security Applications
// "NATO/DoD Compatible • Air-Gapped Deployment • Zero Trust Architecture"
//
// CAPABILITIES:
// - Air-gapped deployment
// - Model red/blue team wargaming
// - Classified document absorption
// - Threat simulation
// - Multi-agent battlefield strategy AI
// - Decision-chain verification
// - Zero-trust architecture
// - NATO/DoD compatible audit logging
// =============================================================================

import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { decisionIntelApi } from '../../../lib/api';

// =============================================================================
// TYPES
// =============================================================================

type ClassificationLevel =
  | 'unclassified'
  | 'cui'
  | 'confidential'
  | 'secret'
  | 'top-secret'
  | 'sci';
type DeploymentMode = 'air-gapped' | 'classified-network' | 'hybrid' | 'cross-domain';
type ThreatCategory = 'cyber' | 'kinetic' | 'information' | 'economic' | 'hybrid-warfare';
type MissionPhase = 'planning' | 'preparation' | 'execution' | 'assessment';

interface ClassifiedDocument {
  id: string;
  title: string;
  classification: ClassificationLevel;
  compartments: string[];
  dateClassified: Date;
  originatingAgency: string;
  status: 'ingested' | 'processing' | 'indexed' | 'available';
  pageCount: number;
  extractedEntities: number;
}

interface ThreatScenario {
  id: string;
  name: string;
  category: ThreatCategory;
  adversary: string;
  probability: number;
  impact: 'catastrophic' | 'critical' | 'significant' | 'moderate' | 'minimal';
  timeframe: string;
  indicators: string[];
  countermeasures: string[];
  lastUpdated: Date;
}

interface WarGame {
  id: string;
  name: string;
  scenario: string;
  status: 'planning' | 'active' | 'complete' | 'archived';
  redTeam: {
    agents: number;
    objectives: string[];
    successRate: number;
  };
  blueTeam: {
    agents: number;
    objectives: string[];
    successRate: number;
  };
  iterations: number;
  insights: string[];
  startDate: Date;
  classification: ClassificationLevel;
}

interface DecisionChain {
  id: string;
  name: string;
  phase: MissionPhase;
  decisions: {
    id: string;
    description: string;
    authority: string;
    status: 'pending' | 'approved' | 'executed' | 'verified';
    timestamp: Date;
    verificationHash: string;
  }[];
  participants: string[];
  classification: ClassificationLevel;
}

interface SecurityPosture {
  overallScore: number;
  zeroTrustCompliance: number;
  encryptionCoverage: number;
  accessControlScore: number;
  auditCompleteness: number;
  vulnerabilities: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  lastAssessment: Date;
  certifications: string[];
}

interface AuditEvent {
  id: string;
  timestamp: Date;
  actor: string;
  action: string;
  resource: string;
  classification: ClassificationLevel;
  outcome: 'success' | 'failure' | 'denied';
  ipAddress: string;
  sessionId: string;
  verified: boolean;
}

interface DeploymentNode {
  id: string;
  name: string;
  location: string;
  mode: DeploymentMode;
  classification: ClassificationLevel;
  status: 'online' | 'offline' | 'maintenance' | 'compromised';
  lastSync: Date;
  agents: number;
  throughput: number;
}

// =============================================================================
// MOCK DATA
// =============================================================================

const CLASSIFICATION_CONFIG: Record<
  ClassificationLevel,
  { color: string; label: string; bg: string }
> = {
  unclassified: { color: 'text-green-400', label: 'UNCLASSIFIED', bg: 'bg-green-900/50' },
  cui: { color: 'text-blue-400', label: 'CUI', bg: 'bg-blue-900/50' },
  confidential: { color: 'text-cyan-400', label: 'CONFIDENTIAL', bg: 'bg-cyan-900/50' },
  secret: { color: 'text-amber-400', label: 'SECRET', bg: 'bg-amber-900/50' },
  'top-secret': { color: 'text-red-400', label: 'TOP SECRET', bg: 'bg-red-900/50' },
  sci: { color: 'text-purple-400', label: 'TS/SCI', bg: 'bg-purple-900/50' },
};

const generateSecurityPosture = (): SecurityPosture => ({
  overallScore: 94,
  zeroTrustCompliance: 98,
  encryptionCoverage: 100,
  accessControlScore: 96,
  auditCompleteness: 99,
  vulnerabilities: {
    critical: 0,
    high: 2,
    medium: 8,
    low: 23,
  },
  lastAssessment: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  certifications: ['FedRAMP High', 'IL5', 'IL6', 'CMMC Level 3', 'NIST 800-171', 'JSIG'],
});

const generateThreatScenarios = (): ThreatScenario[] => [
  {
    id: 'threat-001',
    name: 'Advanced Persistent Threat - APT29',
    category: 'cyber',
    adversary: 'Nation State Actor',
    probability: 0.72,
    impact: 'critical',
    timeframe: '30-90 days',
    indicators: [
      'Spear phishing campaigns',
      'C2 beacon activity',
      'Lateral movement patterns',
      'Data staging',
    ],
    countermeasures: [
      'Enhanced email filtering',
      'Network segmentation',
      'EDR deployment',
      'Zero trust enforcement',
    ],
    lastUpdated: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  {
    id: 'threat-002',
    name: 'Supply Chain Compromise',
    category: 'hybrid-warfare',
    adversary: 'Multiple Actors',
    probability: 0.45,
    impact: 'catastrophic',
    timeframe: '6-12 months',
    indicators: [
      'Vendor anomalies',
      'Code integrity failures',
      'Unexpected dependencies',
      'Certificate issues',
    ],
    countermeasures: [
      'SBOM verification',
      'Vendor security assessments',
      'Code signing enforcement',
      'Continuous monitoring',
    ],
    lastUpdated: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: 'threat-003',
    name: 'Disinformation Campaign',
    category: 'information',
    adversary: 'State-Sponsored Media',
    probability: 0.88,
    impact: 'significant',
    timeframe: 'Ongoing',
    indicators: [
      'Coordinated social media activity',
      'Bot network activation',
      'Narrative amplification',
      'Deep fake content',
    ],
    countermeasures: [
      'Media monitoring',
      'Attribution analysis',
      'Counter-narrative development',
      'Public awareness',
    ],
    lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: 'threat-004',
    name: 'Critical Infrastructure Attack',
    category: 'kinetic',
    adversary: 'Terrorist Organization',
    probability: 0.15,
    impact: 'catastrophic',
    timeframe: 'Unknown',
    indicators: ['Surveillance activity', 'Insider threat signals', 'Physical security anomalies'],
    countermeasures: [
      'Physical security hardening',
      'Personnel vetting',
      'Redundancy planning',
      'Rapid response teams',
    ],
    lastUpdated: new Date(Date.now() - 48 * 60 * 60 * 1000),
  },
];

const generateWarGames = (): WarGame[] => [
  {
    id: 'wg-001',
    name: 'Operation CYBER SHIELD',
    scenario: 'Nation-state cyber attack on critical infrastructure',
    status: 'active',
    redTeam: {
      agents: 8,
      objectives: ['Establish persistence', 'Exfiltrate data', 'Disrupt operations'],
      successRate: 34,
    },
    blueTeam: {
      agents: 12,
      objectives: ['Detect intrusion', 'Contain threat', 'Preserve evidence', 'Restore operations'],
      successRate: 66,
    },
    iterations: 1247,
    insights: [
      'Initial access via compromised vendor credentials',
      'Lateral movement through legacy systems',
      'Detection gap in OT network monitoring',
    ],
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    classification: 'secret',
  },
  {
    id: 'wg-002',
    name: 'Operation SWIFT RESPONSE',
    scenario: 'Multi-domain conflict escalation',
    status: 'complete',
    redTeam: {
      agents: 15,
      objectives: ['Achieve air superiority', 'Disrupt logistics', 'Information dominance'],
      successRate: 42,
    },
    blueTeam: {
      agents: 20,
      objectives: ['Maintain deterrence', 'Coalition coordination', 'Escalation management'],
      successRate: 58,
    },
    iterations: 5000,
    insights: [
      'Space domain critical for C2',
      'Supply chain resilience essential',
      'Allied interoperability gaps identified',
    ],
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    classification: 'top-secret',
  },
];

const generateClassifiedDocs = (): ClassifiedDocument[] => [
  {
    id: 'doc-001',
    title: 'National Defense Strategy Implementation Plan',
    classification: 'secret',
    compartments: ['NOFORN'],
    dateClassified: new Date('2024-01-15'),
    originatingAgency: 'DoD',
    status: 'available',
    pageCount: 847,
    extractedEntities: 12453,
  },
  {
    id: 'doc-002',
    title: 'Threat Assessment - Indo-Pacific Region',
    classification: 'top-secret',
    compartments: ['SI', 'TK'],
    dateClassified: new Date('2024-06-22'),
    originatingAgency: 'DIA',
    status: 'available',
    pageCount: 234,
    extractedEntities: 5621,
  },
  {
    id: 'doc-003',
    title: 'Cyber Operations Framework',
    classification: 'sci',
    compartments: ['GAMMA', 'HCS'],
    dateClassified: new Date('2024-08-10'),
    originatingAgency: 'NSA',
    status: 'processing',
    pageCount: 156,
    extractedEntities: 0,
  },
];

const generateDeploymentNodes = (): DeploymentNode[] => [
  {
    id: 'node-001',
    name: 'Pentagon SCIF',
    location: 'Arlington, VA',
    mode: 'air-gapped',
    classification: 'top-secret',
    status: 'online',
    lastSync: new Date(Date.now() - 15 * 60 * 1000),
    agents: 24,
    throughput: 1250,
  },
  {
    id: 'node-002',
    name: 'EUCOM Forward',
    location: 'Stuttgart, Germany',
    mode: 'classified-network',
    classification: 'secret',
    status: 'online',
    lastSync: new Date(Date.now() - 5 * 60 * 1000),
    agents: 18,
    throughput: 890,
  },
  {
    id: 'node-003',
    name: 'INDOPACOM Hub',
    location: 'Hawaii',
    mode: 'classified-network',
    classification: 'secret',
    status: 'online',
    lastSync: new Date(Date.now() - 8 * 60 * 1000),
    agents: 32,
    throughput: 2100,
  },
  {
    id: 'node-004',
    name: 'IC Fusion Center',
    location: 'McLean, VA',
    mode: 'air-gapped',
    classification: 'sci',
    status: 'online',
    lastSync: new Date(Date.now() - 30 * 60 * 1000),
    agents: 48,
    throughput: 3400,
  },
];

const generateAuditEvents = (): AuditEvent[] => [
  {
    id: 'audit-001',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    actor: 'ADM.JOHNSON',
    action: 'DOCUMENT_ACCESS',
    resource: 'doc-002',
    classification: 'top-secret',
    outcome: 'success',
    ipAddress: '10.0.45.123',
    sessionId: 'sess-847291',
    verified: true,
  },
  {
    id: 'audit-002',
    timestamp: new Date(Date.now() - 12 * 60 * 1000),
    actor: 'COL.MARTINEZ',
    action: 'WARGAME_EXECUTE',
    resource: 'wg-001',
    classification: 'secret',
    outcome: 'success',
    ipAddress: '10.0.32.89',
    sessionId: 'sess-847234',
    verified: true,
  },
  {
    id: 'audit-003',
    timestamp: new Date(Date.now() - 18 * 60 * 1000),
    actor: 'SYSTEM',
    action: 'THREAT_ANALYSIS',
    resource: 'threat-001',
    classification: 'secret',
    outcome: 'success',
    ipAddress: '10.0.1.1',
    sessionId: 'sys-auto',
    verified: true,
  },
  {
    id: 'audit-004',
    timestamp: new Date(Date.now() - 25 * 60 * 1000),
    actor: 'LT.CHEN',
    action: 'DOCUMENT_ACCESS',
    resource: 'doc-003',
    classification: 'sci',
    outcome: 'denied',
    ipAddress: '10.0.67.45',
    sessionId: 'sess-847198',
    verified: true,
  },
];

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const DefenseStackPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'threats' | 'wargames' | 'documents' | 'deployment' | 'audit'
  >('overview');
  const [securityPosture] = useState<SecurityPosture>(generateSecurityPosture);
  const [threatScenarios] = useState<ThreatScenario[]>(generateThreatScenarios);
  const [warGames] = useState<WarGame[]>(generateWarGames);
  const [classifiedDocs] = useState<ClassifiedDocument[]>(generateClassifiedDocs);
  const [deploymentNodes] = useState<DeploymentNode[]>(generateDeploymentNodes);
  const [auditEvents] = useState<AuditEvent[]>(generateAuditEvents);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real data from API
  useEffect(() => {
    const fetchDefenseData = async () => {
      try {
        const [preMortemRes, regulatoryRes] = await Promise.all([
          decisionIntelApi.getPreMortemAnalyses(),
          decisionIntelApi.getRegulatoryItems(),
        ]);

        if (preMortemRes.success && preMortemRes.data) {
          console.log('[DefenseStack] Loaded', preMortemRes.data.length, 'risk analyses');
        }
        if (regulatoryRes.success && regulatoryRes.data) {
          console.log('[DefenseStack] Loaded', regulatoryRes.data.length, 'regulatory items');
        }
      } catch (error) {
        console.log('[DefenseStack] Using local generators (API unavailable)');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDefenseData();
  }, []);

  const activeThreats = threatScenarios.filter((t) => t.probability > 0.5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-neutral-950 to-slate-950 text-white">
      {/* Classification Banner */}
      <div className="bg-red-800 text-white text-center py-1 text-xs font-bold tracking-wider">
        TOP SECRET // NOFORN // DEMONSTRATION SYSTEM - NOT FOR OPERATIONAL USE
      </div>

      {/* Header */}
      <header className="border-b border-slate-700/50 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
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
                  <span className="text-3xl">🛡️</span>
                  CendiaDefenseStack™
                  <span className="text-xs bg-gradient-to-r from-red-600 to-orange-600 px-2 py-0.5 rounded-full font-medium">
                    DEFENSE
                  </span>
                </h1>
                <p className="text-slate-400 text-sm">
                  Government/Defense Edition • Air-Gapped • Zero Trust
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  const ctx = {
                    question: 'Assess our defense posture and identify any security gaps or improvement opportunities',
                    sourcePage: 'CendiaDefenseStack',
                    contextSummary: `Security: ${securityPosture.overallScore}%, ${activeThreats.length} active threats`,
                    contextData: {
                      securityScore: securityPosture.overallScore,
                      zeroTrustCompliance: securityPosture.zeroTrustCompliance,
                      encryptionCoverage: securityPosture.encryptionCoverage,
                      activeThreats: activeThreats.length,
                      activeWarGames: warGames.filter(w => w.status === 'active').length,
                      classifiedDocs: classifiedDocs.length,
                    },
                    suggestedMode: activeThreats.length > 2 ? 'crisis' : 'war-room',
                  };
                  sessionStorage.setItem('councilQueryContext', JSON.stringify(ctx));
                  navigate('/cortex/council?fromContext=true');
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                💬 Ask Council
              </button>
              {securityPosture.certifications.slice(0, 3).map((cert) => (
                <span
                  key={cert}
                  className="px-2 py-1 bg-green-900/30 border border-green-600/30 rounded text-xs text-green-400"
                >
                  ✓ {cert}
                </span>
              ))}
              <div className="text-right">
                <div className="text-sm text-white/60">Security Score</div>
                <div className="text-xl font-bold text-green-400">
                  {securityPosture.overallScore}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Metrics Bar */}
      <div className="bg-gradient-to-r from-slate-900/50 to-neutral-900/50 border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="grid grid-cols-8 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-400">
                {securityPosture.zeroTrustCompliance}%
              </div>
              <div className="text-xs text-slate-400">Zero Trust</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-cyan-400">
                {securityPosture.encryptionCoverage}%
              </div>
              <div className="text-xs text-slate-400">Encryption</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-400">{activeThreats.length}</div>
              <div className="text-xs text-slate-400">Active Threats</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">
                {warGames.filter((w) => w.status === 'active').length}
              </div>
              <div className="text-xs text-slate-400">Active Wargames</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">
                {deploymentNodes.filter((n) => n.status === 'online').length}
              </div>
              <div className="text-xs text-slate-400">Nodes Online</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-400">
                {securityPosture.vulnerabilities.critical}
              </div>
              <div className="text-xs text-slate-400">Critical Vulns</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-300">{classifiedDocs.length}</div>
              <div className="text-xs text-slate-400">Classified Docs</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-400">
                {securityPosture.auditCompleteness}%
              </div>
              <div className="text-xs text-slate-400">Audit Coverage</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-slate-800/50 bg-black/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {[
              { id: 'overview', label: 'Command Center', icon: '🎖️' },
              { id: 'threats', label: 'Threat Analysis', icon: '⚠️' },
              { id: 'wargames', label: 'Wargaming', icon: '♟️' },
              { id: 'documents', label: 'Classified Intel', icon: '📁' },
              { id: 'deployment', label: 'Deployment', icon: '🌐' },
              { id: 'audit', label: 'Audit Log', icon: '📋' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-red-500 text-white bg-red-900/20'
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
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Active Threats Alert */}
            {activeThreats.length > 0 && (
              <div className="bg-red-900/20 rounded-2xl p-6 border border-red-700/50">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="text-red-400">🚨</span> Active Threat Indicators
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {activeThreats.map((threat) => (
                    <div
                      key={threat.id}
                      className="p-4 bg-red-900/30 rounded-xl border border-red-700/30"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{threat.name}</span>
                        <span className="text-xl font-bold text-red-400">
                          {(threat.probability * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="text-sm text-white/60 mb-2">
                        {threat.adversary} • {threat.timeframe}
                      </div>
                      <div
                        className={`inline-block px-2 py-0.5 rounded text-xs ${
                          threat.impact === 'catastrophic'
                            ? 'bg-red-600'
                            : threat.impact === 'critical'
                              ? 'bg-orange-600'
                              : 'bg-amber-600'
                        }`}
                      >
                        {threat.impact.toUpperCase()} IMPACT
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security Posture */}
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-black/30 rounded-2xl p-6 border border-slate-700/50">
                <h3 className="text-lg font-semibold mb-4">Zero Trust Compliance</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Identity Verification</span>
                      <span className="font-bold text-green-400">100%</span>
                    </div>
                    <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: '100%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Device Trust</span>
                      <span className="font-bold text-green-400">98%</span>
                    </div>
                    <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: '98%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Network Segmentation</span>
                      <span className="font-bold text-green-400">96%</span>
                    </div>
                    <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: '96%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Continuous Monitoring</span>
                      <span className="font-bold text-green-400">99%</span>
                    </div>
                    <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: '99%' }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-black/30 rounded-2xl p-6 border border-slate-700/50">
                <h3 className="text-lg font-semibold mb-4">Vulnerability Status</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-red-900/20 rounded-xl">
                    <div className="text-3xl font-bold text-red-400">
                      {securityPosture.vulnerabilities.critical}
                    </div>
                    <div className="text-xs text-white/50">Critical</div>
                  </div>
                  <div className="text-center p-4 bg-orange-900/20 rounded-xl">
                    <div className="text-3xl font-bold text-orange-400">
                      {securityPosture.vulnerabilities.high}
                    </div>
                    <div className="text-xs text-white/50">High</div>
                  </div>
                  <div className="text-center p-4 bg-amber-900/20 rounded-xl">
                    <div className="text-3xl font-bold text-amber-400">
                      {securityPosture.vulnerabilities.medium}
                    </div>
                    <div className="text-xs text-white/50">Medium</div>
                  </div>
                  <div className="text-center p-4 bg-blue-900/20 rounded-xl">
                    <div className="text-3xl font-bold text-blue-400">
                      {securityPosture.vulnerabilities.low}
                    </div>
                    <div className="text-xs text-white/50">Low</div>
                  </div>
                </div>
              </div>

              <div className="bg-black/30 rounded-2xl p-6 border border-slate-700/50">
                <h3 className="text-lg font-semibold mb-4">Certifications</h3>
                <div className="space-y-2">
                  {securityPosture.certifications.map((cert) => (
                    <div
                      key={cert}
                      className="flex items-center justify-between p-3 bg-green-900/20 rounded-lg border border-green-700/30"
                    >
                      <span className="font-medium">{cert}</span>
                      <span className="text-green-400">✓ Active</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Deployment Status */}
            <div className="bg-black/30 rounded-2xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold mb-4">Global Deployment Status</h3>
              <div className="grid grid-cols-4 gap-4">
                {deploymentNodes.map((node) => {
                  const classConfig = CLASSIFICATION_CONFIG[node.classification];
                  return (
                    <div
                      key={node.id}
                      className="p-4 bg-black/20 rounded-xl border border-slate-700/30"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{node.name}</span>
                        <span
                          className={`w-3 h-3 rounded-full ${
                            node.status === 'online'
                              ? 'bg-green-400'
                              : node.status === 'offline'
                                ? 'bg-red-400'
                                : 'bg-amber-400'
                          }`}
                        />
                      </div>
                      <div className="text-sm text-white/50 mb-2">{node.location}</div>
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-2 py-0.5 rounded text-xs ${classConfig.bg} ${classConfig.color}`}
                        >
                          {classConfig.label}
                        </span>
                        <span className="text-xs text-white/40">{node.mode}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-white/40">Agents:</span>
                          <span className="ml-1 font-medium">{node.agents}</span>
                        </div>
                        <div>
                          <span className="text-white/40">TPS:</span>
                          <span className="ml-1 font-medium">{node.throughput}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'threats' && (
          <div className="space-y-4">
            {threatScenarios.map((threat) => (
              <div
                key={threat.id}
                className={`bg-black/30 rounded-2xl p-6 border ${
                  threat.probability > 0.7
                    ? 'border-red-700/50'
                    : threat.probability > 0.4
                      ? 'border-amber-700/50'
                      : 'border-slate-700/50'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{threat.name}</h3>
                    <div className="text-sm text-white/50">
                      {threat.adversary} • {threat.category}
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-3xl font-bold ${
                        threat.probability > 0.7
                          ? 'text-red-400'
                          : threat.probability > 0.4
                            ? 'text-amber-400'
                            : 'text-green-400'
                      }`}
                    >
                      {(threat.probability * 100).toFixed(0)}%
                    </div>
                    <div className="text-xs text-white/50">Probability</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-2">
                      Indicators
                    </h4>
                    <ul className="space-y-1">
                      {threat.indicators.map((ind, idx) => (
                        <li key={idx} className="text-sm flex items-center gap-2">
                          <span className="text-red-400">•</span> {ind}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-2">
                      Countermeasures
                    </h4>
                    <ul className="space-y-1">
                      {threat.countermeasures.map((cm, idx) => (
                        <li key={idx} className="text-sm flex items-center gap-2">
                          <span className="text-green-400">→</span> {cm}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700/30">
                  <span
                    className={`px-3 py-1 rounded text-sm ${
                      threat.impact === 'catastrophic'
                        ? 'bg-red-600'
                        : threat.impact === 'critical'
                          ? 'bg-orange-600'
                          : threat.impact === 'significant'
                            ? 'bg-amber-600'
                            : 'bg-blue-600'
                    }`}
                  >
                    {threat.impact.toUpperCase()} IMPACT
                  </span>
                  <span className="text-sm text-white/40">
                    Timeframe: {threat.timeframe} • Updated:{' '}
                    {Math.floor((Date.now() - threat.lastUpdated.getTime()) / 3600000)}h ago
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'wargames' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl p-6 border border-purple-700/50">
              <h2 className="text-lg font-semibold mb-2">♟️ Multi-Agent Wargaming Platform</h2>
              <p className="text-white/60">
                Red team vs Blue team AI simulations for strategic planning and vulnerability
                discovery. All scenarios are run in isolated, air-gapped environments.
              </p>
            </div>

            {warGames.map((wg) => {
              const classConfig = CLASSIFICATION_CONFIG[wg.classification];
              return (
                <div key={wg.id} className="bg-black/30 rounded-2xl p-6 border border-slate-700/50">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold">{wg.name}</h3>
                        <span
                          className={`px-2 py-0.5 rounded text-xs ${classConfig.bg} ${classConfig.color}`}
                        >
                          {classConfig.label}
                        </span>
                      </div>
                      <div className="text-sm text-white/50">{wg.scenario}</div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-lg text-sm ${
                        wg.status === 'active'
                          ? 'bg-green-600'
                          : wg.status === 'complete'
                            ? 'bg-blue-600'
                            : 'bg-neutral-600'
                      }`}
                    >
                      {wg.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-4">
                    <div className="p-4 bg-red-900/20 rounded-xl border border-red-700/30">
                      <h4 className="font-semibold text-red-400 mb-2">🔴 Red Team</h4>
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <div className="text-2xl font-bold">{wg.redTeam.agents}</div>
                          <div className="text-xs text-white/50">Agents</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-red-400">
                            {wg.redTeam.successRate}%
                          </div>
                          <div className="text-xs text-white/50">Success Rate</div>
                        </div>
                      </div>
                      <div className="text-xs text-white/60">
                        Objectives: {wg.redTeam.objectives.join(', ')}
                      </div>
                    </div>

                    <div className="p-4 bg-blue-900/20 rounded-xl border border-blue-700/30">
                      <h4 className="font-semibold text-blue-400 mb-2">🔵 Blue Team</h4>
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <div className="text-2xl font-bold">{wg.blueTeam.agents}</div>
                          <div className="text-xs text-white/50">Agents</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-blue-400">
                            {wg.blueTeam.successRate}%
                          </div>
                          <div className="text-xs text-white/50">Success Rate</div>
                        </div>
                      </div>
                      <div className="text-xs text-white/60">
                        Objectives: {wg.blueTeam.objectives.join(', ')}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-black/20 rounded-xl">
                    <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-2">
                      Key Insights
                    </h4>
                    <ul className="space-y-1">
                      {wg.insights.map((insight, idx) => (
                        <li key={idx} className="text-sm flex items-center gap-2">
                          <span className="text-amber-400">💡</span> {insight}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700/30 text-sm text-white/40">
                    <span>{wg.iterations.toLocaleString()} iterations completed</span>
                    <span>Started: {wg.startDate.toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 rounded-2xl p-6 border border-amber-700/50">
              <h2 className="text-lg font-semibold mb-2">📁 Classified Document Intelligence</h2>
              <p className="text-white/60">
                AI-powered analysis of classified documents with entity extraction, relationship
                mapping, and secure search. All processing occurs within air-gapped environments.
              </p>
            </div>

            {classifiedDocs.map((doc) => {
              const classConfig = CLASSIFICATION_CONFIG[doc.classification];
              return (
                <div
                  key={doc.id}
                  className="bg-black/30 rounded-2xl p-6 border border-slate-700/50"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`px-3 py-1.5 rounded ${classConfig.bg}`}>
                        <span className={`font-bold ${classConfig.color}`}>
                          {classConfig.label}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{doc.title}</h3>
                        <div className="text-sm text-white/50">
                          {doc.originatingAgency} • {doc.dateClassified.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-lg text-sm ${
                        doc.status === 'available'
                          ? 'bg-green-600'
                          : doc.status === 'processing'
                            ? 'bg-amber-600'
                            : 'bg-blue-600'
                      }`}
                    >
                      {doc.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {doc.compartments.map((comp) => (
                      <span
                        key={comp}
                        className="px-2 py-1 bg-red-900/30 border border-red-700/30 rounded text-xs"
                      >
                        {comp}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-black/20 rounded-xl">
                      <div className="text-xl font-bold">{doc.pageCount}</div>
                      <div className="text-xs text-white/50">Pages</div>
                    </div>
                    <div className="text-center p-3 bg-black/20 rounded-xl">
                      <div className="text-xl font-bold text-cyan-400">
                        {doc.extractedEntities.toLocaleString()}
                      </div>
                      <div className="text-xs text-white/50">Entities Extracted</div>
                    </div>
                    <div className="text-center p-3 bg-black/20 rounded-xl">
                      <div
                        className={`text-xl font-bold ${doc.status === 'available' ? 'text-green-400' : 'text-amber-400'}`}
                      >
                        {doc.status === 'available' ? 'Ready' : 'Processing'}
                      </div>
                      <div className="text-xs text-white/50">Status</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'deployment' && (
          <div className="grid grid-cols-2 gap-6">
            {deploymentNodes.map((node) => {
              const classConfig = CLASSIFICATION_CONFIG[node.classification];
              return (
                <div
                  key={node.id}
                  className="bg-black/30 rounded-2xl p-6 border border-slate-700/50"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full ${
                          node.status === 'online'
                            ? 'bg-green-400 animate-pulse'
                            : node.status === 'offline'
                              ? 'bg-red-400'
                              : 'bg-amber-400'
                        }`}
                      />
                      <h3 className="text-lg font-semibold">{node.name}</h3>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs ${classConfig.bg} ${classConfig.color}`}
                    >
                      {classConfig.label}
                    </span>
                  </div>

                  <div className="text-sm text-white/60 mb-4">
                    {node.location} • {node.mode}
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-black/20 rounded-xl">
                      <div className="text-xl font-bold text-cyan-400">{node.agents}</div>
                      <div className="text-xs text-white/50">AI Agents</div>
                    </div>
                    <div className="text-center p-3 bg-black/20 rounded-xl">
                      <div className="text-xl font-bold text-purple-400">{node.throughput}</div>
                      <div className="text-xs text-white/50">TPS</div>
                    </div>
                    <div className="text-center p-3 bg-black/20 rounded-xl">
                      <div className="text-xl font-bold text-green-400">
                        {Math.floor((Date.now() - node.lastSync.getTime()) / 60000)}m
                      </div>
                      <div className="text-xs text-white/50">Last Sync</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-slate-800/50 to-neutral-800/50 rounded-2xl p-6 border border-slate-700/50">
              <h2 className="text-lg font-semibold mb-2">📋 NATO/DoD Compatible Audit Log</h2>
              <p className="text-white/60">
                Cryptographically verified, tamper-evident audit trail. All events are signed and
                stored in WORM-compliant storage with chain-of-custody preservation.
              </p>
            </div>

            <div className="bg-black/30 rounded-2xl border border-slate-700/50 overflow-hidden">
              <div className="grid grid-cols-7 gap-4 p-4 bg-black/30 border-b border-slate-700/30 text-xs font-semibold text-white/60 uppercase tracking-wider">
                <div>Timestamp</div>
                <div>Actor</div>
                <div>Action</div>
                <div>Resource</div>
                <div>Classification</div>
                <div>Outcome</div>
                <div>Verified</div>
              </div>
              {auditEvents.map((event) => {
                const classConfig = CLASSIFICATION_CONFIG[event.classification];
                return (
                  <div
                    key={event.id}
                    className="grid grid-cols-7 gap-4 p-4 border-b border-slate-800/30 text-sm"
                  >
                    <div className="font-mono text-xs">{event.timestamp.toLocaleTimeString()}</div>
                    <div className="font-medium">{event.actor}</div>
                    <div>{event.action}</div>
                    <div className="font-mono text-xs">{event.resource}</div>
                    <div>
                      <span
                        className={`px-2 py-0.5 rounded text-xs ${classConfig.bg} ${classConfig.color}`}
                      >
                        {classConfig.label}
                      </span>
                    </div>
                    <div
                      className={
                        event.outcome === 'success'
                          ? 'text-green-400'
                          : event.outcome === 'denied'
                            ? 'text-red-400'
                            : 'text-amber-400'
                      }
                    >
                      {event.outcome}
                    </div>
                    <div>
                      {event.verified ? (
                        <span className="text-green-400">✓ Verified</span>
                      ) : (
                        <span className="text-amber-400">Pending</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Classification Banner Bottom */}
      <div className="bg-red-800 text-white text-center py-1 text-xs font-bold tracking-wider">
        TOP SECRET // NOFORN // DEMONSTRATION SYSTEM - NOT FOR OPERATIONAL USE
      </div>
    </div>
  );
};

export default DefenseStackPage;
