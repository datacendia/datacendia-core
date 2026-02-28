// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * DATACENDIA PLATFORM - UEFA GOVERNANCE WALKTHROUGH
 * Crisis Immunization Demo: Discovery-Time Proof, Regulator's Receipt, Time-Bar Immunity
 * 
 * Copyright (c) 2024-2026 Datacendia, Inc. All Rights Reserved.
 */

import React, { useState } from 'react';
import {
  Shield,
  Clock,
  FileText,
  Lock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  Download,
  Eye,
  Hash,
  Fingerprint,
  Scale,
  Gavel,
  TrendingUp,
  Users,
  Search,
  Timer,
  ShieldCheck,
  Activity,
  FileCheck,
  Layers,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

// =============================================================================
// DEMO DATA — Synthetic Scenario Based on Public CAS Patterns
// =============================================================================

interface EvidenceItem {
  id: string;
  reference: string;
  description: string;
  discoveredAt: string;
  hashedAt: string;
  sha256: string;
  source: string;
  timeBarExpires: string;
  status: 'valid' | 'approaching_expiry' | 'expired';
  daysRemaining: number;
}

interface DeliberationStep {
  id: string;
  timestamp: string;
  agent: string;
  role: string;
  action: string;
  content: string;
  confidence: number;
  citationCount: number;
}

interface ProceduralCheck {
  id: string;
  requirement: string;
  regulation: string;
  status: 'passed' | 'failed' | 'warning';
  verifiedAt: string;
  verifiedBy: string;
  notes: string;
}

const DEMO_EVIDENCE: EvidenceItem[] = [
  {
    id: 'EV-001',
    reference: 'Email #427 — Sponsorship Agreement',
    description: 'Internal correspondence regarding sponsorship structure and related-party transactions',
    discoveredAt: '2023-11-02T14:37:22Z',
    hashedAt: '2023-11-02T14:37:23Z',
    sha256: 'a3f5c89b2e1d4f7a8c9e2b3d4f6a7c8e',
    source: 'Financial Leaks Investigation',
    timeBarExpires: '2028-11-02T14:37:22Z',
    status: 'valid',
    daysRemaining: 1005,
  },
  {
    id: 'EV-002',
    reference: 'Email #531 — Payment Routing',
    description: 'Payment routing documentation showing alternative funding pathways',
    discoveredAt: '2023-11-02T14:39:41Z',
    hashedAt: '2023-11-02T14:39:42Z',
    sha256: '7d2e8f4b9c3a1e6d5f8a2c4b7e9d1f3a',
    source: 'Financial Leaks Investigation',
    timeBarExpires: '2028-11-02T14:39:41Z',
    status: 'valid',
    daysRemaining: 1005,
  },
  {
    id: 'EV-003',
    reference: 'Financial Statement FY2022',
    description: 'Annual financial statement with noted discrepancies in sponsorship revenue classification',
    discoveredAt: '2024-03-15T09:12:00Z',
    hashedAt: '2024-03-15T09:12:01Z',
    sha256: 'b8c4d9e2f1a3c5b7d9e1f3a5c7b9d1e3',
    source: 'Mandatory Club Submission',
    timeBarExpires: '2029-03-15T09:12:00Z',
    status: 'valid',
    daysRemaining: 1138,
  },
  {
    id: 'EV-004',
    reference: 'Witness Statement — Former CFO',
    description: 'Testimony regarding internal financial controls and reporting practices',
    discoveredAt: '2024-06-20T16:45:00Z',
    hashedAt: '2024-06-20T16:45:01Z',
    sha256: 'c9d5e3f1a2b4c6d8e0f2a4b6c8d0e2f4',
    source: 'Interview Transcript',
    timeBarExpires: '2029-06-20T16:45:00Z',
    status: 'valid',
    daysRemaining: 1235,
  },
  {
    id: 'EV-005',
    reference: 'Transfer Agreement #2019-047',
    description: 'Player transfer contract with associated agent commission disclosures',
    discoveredAt: '2024-01-10T11:20:00Z',
    hashedAt: '2024-01-10T11:20:01Z',
    sha256: 'd0e6f4a2b3c5d7e9f1a3b5c7d9e1f3a5',
    source: 'FIFA TMS Records',
    timeBarExpires: '2029-01-10T11:20:00Z',
    status: 'valid',
    daysRemaining: 1070,
  },
];

const DEMO_DELIBERATION: DeliberationStep[] = [
  {
    id: 'DEL-001',
    timestamp: '2026-02-01T09:00:00Z',
    agent: 'Financial Analysis Agent',
    role: 'CFO Advisory',
    action: 'Initial Assessment',
    content: 'Revenue classification discrepancy identified: €47.2M in sponsorship income requires independent fair market value assessment. Related-party transaction flags raised on 3 of 5 major sponsorship agreements.',
    confidence: 89,
    citationCount: 7,
  },
  {
    id: 'DEL-002',
    timestamp: '2026-02-01T09:15:00Z',
    agent: 'Legal Compliance Agent',
    role: 'Regulatory Review',
    action: 'Regulatory Mapping',
    content: 'Assessed against UEFA Financial Sustainability Regulations (2022), Articles 70-77. Club Licensing Manual Section 5.3 requires fair value attestation for related-party transactions exceeding €5M. All 5 evidence items are within statute of limitations.',
    confidence: 94,
    citationCount: 12,
  },
  {
    id: 'DEL-003',
    timestamp: '2026-02-01T09:30:00Z',
    agent: 'Adversarial Review Agent',
    role: 'Red Team',
    action: 'Defense Simulation',
    content: 'ADVERSARIAL ANALYSIS: Club defense will likely argue (1) commercial justification for premium sponsorship rates, (2) time-bar on pre-2019 evidence, (3) procedural inconsistency with similar cases. Counter: Discovery timestamps prove all evidence within 5-year window. Proportionality proof shows identical treatment to comparable cases.',
    confidence: 82,
    citationCount: 9,
  },
  {
    id: 'DEL-004',
    timestamp: '2026-02-01T09:45:00Z',
    agent: 'Precedent Analysis Agent',
    role: 'Case Law Review',
    action: 'Historical Comparison',
    content: 'Cross-referenced against 23 prior CFCB decisions and 8 CAS appeals. Identified 3 directly comparable cases. In all 3, CAS upheld sanctions where discovery timeline was documented. In 2 overturned cases, the failure point was absence of timestamped evidence chain.',
    confidence: 91,
    citationCount: 15,
  },
  {
    id: 'DEL-005',
    timestamp: '2026-02-01T10:00:00Z',
    agent: 'Synthesis Agent',
    role: 'Chief Strategy',
    action: 'Consensus Recommendation',
    content: 'RECOMMENDATION: Proceed with formal investigation. All evidence is within statute. Procedural integrity is verifiable. Adversarial review identifies manageable defense vectors. Confidence in CAS resilience: 87%. Generate Regulator\'s Receipt for CFCB Adjudicatory Chamber.',
    confidence: 87,
    citationCount: 4,
  },
];

const DEMO_PROCEDURAL_CHECKS: ProceduralCheck[] = [
  { id: 'PC-001', requirement: 'Evidence within statute of limitations', regulation: 'UEFA Procedural Rules, Art. 44', status: 'passed', verifiedAt: '2026-02-01T10:05:00Z', verifiedBy: 'Automated Verification', notes: 'All 5 evidence items confirmed within 5-year window' },
  { id: 'PC-002', requirement: 'Discovery timestamps cryptographically sealed', regulation: 'ISO 27037 (Digital Evidence)', status: 'passed', verifiedAt: '2026-02-01T10:05:01Z', verifiedBy: 'CendiaNotary™', notes: 'SHA-256 hashes generated within 1 second of discovery' },
  { id: 'PC-003', requirement: 'Proportionate treatment verification', regulation: 'UEFA FSR Art. 73(2)', status: 'passed', verifiedAt: '2026-02-01T10:05:02Z', verifiedBy: 'Precedent Agent', notes: 'Treatment consistent with 3 comparable prior cases' },
  { id: 'PC-004', requirement: 'Right to be heard documented', regulation: 'UEFA Procedural Rules, Art. 38', status: 'passed', verifiedAt: '2026-02-01T10:05:03Z', verifiedBy: 'Process Monitor', notes: 'Club formally notified and given 30-day response window' },
  { id: 'PC-005', requirement: 'Non-discrimination assessment', regulation: 'TFEU Art. 101 / ESL Precedent', status: 'passed', verifiedAt: '2026-02-01T10:05:04Z', verifiedBy: 'Constitutional Agent', notes: 'Objective criteria applied identically to all clubs' },
  { id: 'PC-006', requirement: 'Human oversight verification', regulation: 'EU AI Act, Art. 14', status: 'passed', verifiedAt: '2026-02-01T10:15:00Z', verifiedBy: 'CFCB Chairman (Manual)', notes: 'Chairman reviewed and accepted AI recommendation' },
];

// =============================================================================
// COMPONENTS
// =============================================================================

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case 'passed': return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
    case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    default: return <Clock className="h-4 w-4 text-gray-400" />;
  }
};

const TimeBarIndicator = ({ item }: { item: EvidenceItem }) => {
  const totalDays = 1826; // 5 years
  const elapsed = totalDays - item.daysRemaining;
  const pct = Math.min(100, (elapsed / totalDays) * 100);
  const color = pct > 80 ? 'bg-red-500' : pct > 60 ? 'bg-yellow-500' : 'bg-green-500';

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">Time-Bar Status</span>
        <span className="font-medium">{item.daysRemaining} days remaining</span>
      </div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

// =============================================================================
// MAIN PAGE
// =============================================================================

export default function UEFAWalkthroughPage() {
  const [expandedEvidence, setExpandedEvidence] = useState<Set<string>>(new Set());
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());
  const [showReceipt, setShowReceipt] = useState(false);

  const toggleEvidence = (id: string) => {
    const next = new Set(expandedEvidence);
    if (next.has(id)) {next.delete(id);} else {next.add(id);}
    setExpandedEvidence(next);
  };

  const toggleStep = (id: string) => {
    const next = new Set(expandedSteps);
    if (next.has(id)) {next.delete(id);} else {next.add(id);}
    setExpandedSteps(next);
  };

  return (
    <div className="container mx-auto py-6 space-y-6 max-w-6xl">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Shield className="h-4 w-4" />
          <span>Crisis Immunization Framework</span>
          <ChevronRight className="h-3 w-3" />
          <span>UEFA Financial Sustainability</span>
        </div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Gavel className="h-8 w-8 text-indigo-600" />
          Procedural Integrity Walkthrough
        </h1>
        <p className="text-muted-foreground max-w-3xl">
          Synthetic demonstration of how Datacendia ensures regulatory decisions remain
          defensible under CAS appeal. Based on public patterns from Financial Fair Play enforcement.
        </p>
        <div className="flex gap-2 pt-2">
          <Badge variant="outline" className="gap-1"><Lock className="h-3 w-3" /> Sovereign Stack</Badge>
          <Badge variant="outline" className="gap-1"><Fingerprint className="h-3 w-3" /> SHA-256 Sealed</Badge>
          <Badge variant="outline" className="gap-1"><Scale className="h-3 w-3" /> CAS-Resilient</Badge>
          <Badge variant="outline" className="gap-1"><ShieldCheck className="h-3 w-3" /> ISO 27037</Badge>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Evidence Items</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{DEMO_EVIDENCE.length}</div>
            <p className="text-xs text-green-600">All within statute</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Procedural Checks</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{DEMO_PROCEDURAL_CHECKS.filter(c => c.status === 'passed').length}/{DEMO_PROCEDURAL_CHECKS.length}</div>
            <p className="text-xs text-green-600">All passed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CAS Resilience</CardTitle>
            <Shield className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600">87%</div>
            <p className="text-xs text-muted-foreground">Based on precedent analysis</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deliberation Agents</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Multi-agent review complete</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="evidence" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="evidence" className="gap-2">
            <Search className="h-4 w-4" />
            Evidence Chain
          </TabsTrigger>
          <TabsTrigger value="deliberation" className="gap-2">
            <Users className="h-4 w-4" />
            Deliberation
          </TabsTrigger>
          <TabsTrigger value="procedural" className="gap-2">
            <FileCheck className="h-4 w-4" />
            Procedural Checks
          </TabsTrigger>
          <TabsTrigger value="receipt" className="gap-2">
            <Fingerprint className="h-4 w-4" />
            Regulator's Receipt
          </TabsTrigger>
        </TabsList>

        {/* Evidence Chain Tab */}
        <TabsContent value="evidence" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Timer className="h-5 w-5 text-indigo-600" />
                Discovery-Time Proof Chain
              </CardTitle>
              <CardDescription>
                Every piece of evidence is cryptographically timestamped at the moment of discovery.
                This prevents time-bar challenges at CAS.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {DEMO_EVIDENCE.map((item) => (
                <div key={item.id} className="border rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleEvidence(item.id)}
                    className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                      <div className="text-left">
                        <div className="font-medium">{item.reference}</div>
                        <div className="text-sm text-muted-foreground">{item.description}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-green-600 border-green-200">Within Statute</Badge>
                      {expandedEvidence.has(item.id) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </div>
                  </button>
                  {expandedEvidence.has(item.id) && (
                    <div className="px-4 pb-4 space-y-3 border-t bg-muted/20">
                      <div className="grid grid-cols-2 gap-4 pt-3">
                        <div>
                          <div className="text-xs font-medium text-muted-foreground mb-1">Discovery Timestamp</div>
                          <div className="font-mono text-sm">{new Date(item.discoveredAt).toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-xs font-medium text-muted-foreground mb-1">Hash Sealed</div>
                          <div className="font-mono text-sm">{new Date(item.hashedAt).toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-xs font-medium text-muted-foreground mb-1">SHA-256 Hash</div>
                          <div className="font-mono text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded">{item.sha256}...</div>
                        </div>
                        <div>
                          <div className="text-xs font-medium text-muted-foreground mb-1">Source</div>
                          <div className="text-sm">{item.source}</div>
                        </div>
                      </div>
                      <TimeBarIndicator item={item} />
                      <div className="text-xs text-muted-foreground bg-green-50 dark:bg-green-900/20 p-2 rounded">
                        Time-bar expires: {new Date(item.timeBarExpires).toLocaleDateString()} — {item.daysRemaining} days remaining.
                        Hash generated within 1 second of discovery, making timestamp irrefutable under ISO 27037.
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Deliberation Tab */}
        <TabsContent value="deliberation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-indigo-600" />
                Multi-Agent Deliberation Record
              </CardTitle>
              <CardDescription>
                The Council™ assigned 5 specialized agents to review the case. Every statement, citation,
                and recommendation is immutably recorded.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {DEMO_DELIBERATION.map((step, index) => (
                <div key={step.id} className="border rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleStep(step.id)}
                    className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 font-bold text-sm shrink-0">
                        {index + 1}
                      </div>
                      <div className="text-left">
                        <div className="font-medium">{step.agent}</div>
                        <div className="text-sm text-muted-foreground">{step.action}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{step.confidence}% confidence</Badge>
                      <Badge variant="secondary">{step.citationCount} citations</Badge>
                      {expandedSteps.has(step.id) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </div>
                  </button>
                  {expandedSteps.has(step.id) && (
                    <div className="px-4 pb-4 border-t bg-muted/20">
                      <div className="pt-3 space-y-2">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Role: {step.role}</span>
                          <span>Timestamp: {new Date(step.timestamp).toLocaleString()}</span>
                        </div>
                        <div className="text-sm leading-relaxed bg-white dark:bg-gray-900 p-3 rounded border">
                          {step.content}
                        </div>
                        <div className="flex gap-4">
                          <Progress value={step.confidence} className="flex-1" />
                          <span className="text-xs text-muted-foreground whitespace-nowrap">{step.confidence}% confidence</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Procedural Checks Tab */}
        <TabsContent value="procedural" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-green-600" />
                Procedural Compliance Verification
              </CardTitle>
              <CardDescription>
                Every procedural requirement is verified before the ruling is finalized.
                This prevents CAS overturns on technical grounds.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {DEMO_PROCEDURAL_CHECKS.map((check) => (
                  <div key={check.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    <StatusIcon status={check.status} />
                    <div className="flex-1 space-y-1">
                      <div className="font-medium text-sm">{check.requirement}</div>
                      <div className="text-xs text-muted-foreground">{check.regulation}</div>
                      <div className="text-xs">{check.notes}</div>
                      <div className="flex gap-4 text-xs text-muted-foreground pt-1">
                        <span>Verified: {new Date(check.verifiedAt).toLocaleString()}</span>
                        <span>By: {check.verifiedBy}</span>
                      </div>
                    </div>
                    <Badge variant={check.status === 'passed' ? 'default' : 'destructive'} className={check.status === 'passed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : ''}>
                      {check.status === 'passed' ? 'PASSED' : check.status === 'failed' ? 'FAILED' : 'WARNING'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Regulator's Receipt Tab */}
        <TabsContent value="receipt" className="space-y-4">
          <Card className="border-2 border-indigo-200 dark:border-indigo-800">
            <CardHeader className="bg-indigo-50 dark:bg-indigo-900/20">
              <CardTitle className="flex items-center gap-2">
                <Fingerprint className="h-5 w-5 text-indigo-600" />
                Regulator's Receipt™
              </CardTitle>
              <CardDescription>
                A single, court-admissible artifact containing the complete Decision DNA for this case.
                This file is cryptographically sealed and cannot be altered.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="font-mono text-xs bg-gray-950 text-green-400 p-6 rounded-lg overflow-auto space-y-4">
                <div>
{`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  DATACENDIA REGULATOR'S RECEIPT™
  Case: FFP Financial Sustainability Review
  Generated: ${new Date().toISOString()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`}
                </div>

                <div>
{`EVIDENCE TIMELINE (Immutable)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${DEMO_EVIDENCE.map((e, i) => `${i+1}. ${e.reference}
   SHA-256: ${e.sha256}...
   Discovered: ${new Date(e.discoveredAt).toISOString()}
   Time-Bar Expires: ${new Date(e.timeBarExpires).toLocaleDateString()}
   Status: ✅ WITHIN STATUTE (${e.daysRemaining} days remaining)`).join('\n\n')}`}
                </div>

                <div>
{`DELIBERATION RECORD
━━━━━━━━━━━━━━━━━━━
Agents Invoked: 5
Total Citations: ${DEMO_DELIBERATION.reduce((s, d) => s + d.citationCount, 0)}
Consensus Confidence: 87%
Recommendation: PROCEED WITH FORMAL INVESTIGATION
Adversarial Vectors Identified: 3 (all mitigated)`}
                </div>

                <div>
{`PROCEDURAL COMPLIANCE
━━━━━━━━━━━━━━━━━━━━━
${DEMO_PROCEDURAL_CHECKS.map(c => `✅ ${c.requirement} (${c.regulation})`).join('\n')}`}
                </div>

                <div>
{`HUMAN VERIFICATION
━━━━━━━━━━━━━━━━━━
Verified By: CFCB Adjudicatory Chamber Chairman
TPM Signature: 0x7a3f2e9d1c4b8a6f...
Liability Transfer: ACCEPTED
Date: ${new Date().toISOString()}
Method: Manual review + digital signature`}
                </div>

                <div>
{`INTEGRITY SEAL
━━━━━━━━━━━━━━
Merkle Root: 0xf3e2d1c4b8a7f6e5d4c3b2a1
Document Hash: SHA-256:a1b2c3d4e5f6a7b8c9d0e1f2
Court Admissibility: ✅ ISO 27037 + eIDAS (EU 910/2014)
Audit Trail: ✅ 100 years (CendiaEternal™)
Tampering Detection: ✅ Any modification invalidates hash`}
                </div>

                <div className="text-yellow-400">
{`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  This file is cryptographically signed and immutable.
  Present to CAS as a single defensible artifact.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`}
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <Button className="gap-2">
                  <Download className="h-4 w-4" />
                  Export Receipt (PDF + JSON)
                </Button>
                <Button variant="outline" className="gap-2">
                  <Hash className="h-4 w-4" />
                  Verify Integrity
                </Button>
                <Button variant="outline" className="gap-2">
                  <Eye className="h-4 w-4" />
                  View Decision DNA
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* CAS Defense Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-indigo-600" />
                CAS Defense Posture
              </CardTitle>
              <CardDescription>How this receipt defeats common appeal vectors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="p-3 border rounded-lg bg-green-50 dark:bg-green-900/10">
                  <div className="font-medium text-sm flex items-center gap-2 mb-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    vs. "Time-Bar" Defense
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Cryptographic discovery timestamps prove all evidence was identified within the 5-year statute.
                    SHA-256 hashes generated within 1 second of discovery.
                  </div>
                </div>
                <div className="p-3 border rounded-lg bg-green-50 dark:bg-green-900/10">
                  <div className="font-medium text-sm flex items-center gap-2 mb-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    vs. "Arbitrary Decision" Defense
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Multi-agent deliberation record with 47 citations proves objective, rule-based analysis.
                    Precedent comparison shows consistent treatment.
                  </div>
                </div>
                <div className="p-3 border rounded-lg bg-green-50 dark:bg-green-900/10">
                  <div className="font-medium text-sm flex items-center gap-2 mb-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    vs. "Disproportionate" Defense
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Proportionality proof demonstrates identical treatment across 3 comparable cases.
                    No discrimination by club size or jurisdiction.
                  </div>
                </div>
                <div className="p-3 border rounded-lg bg-green-50 dark:bg-green-900/10">
                  <div className="font-medium text-sm flex items-center gap-2 mb-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    vs. "No Human Oversight" Defense
                  </div>
                  <div className="text-xs text-muted-foreground">
                    TPM-signed verification proves CFCB Chairman reviewed AI recommendation.
                    Compliant with EU AI Act Article 14 human oversight requirement.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
