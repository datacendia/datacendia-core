/**
 * API Routes — Demo Seed
 *
 * Express route handler defining REST endpoints.
 * @module routes/demo-seed
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * =============================================================================
 * DEMO SEED API ROUTES
 * =============================================================================
 * Endpoints for seeding the database with demo data for presentations.
 * 
 * Routes:
 * - POST /api/v1/demo/seed - Seed all demo data
 * - POST /api/v1/demo/seed/:scenario - Seed specific scenario
 * - DELETE /api/v1/demo/clear - Clear all demo data
 * - GET /api/v1/demo/status - Check demo data status
 */

import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { deterministicFloat, deterministicInt, deterministicPercentage, deterministicPick } from '../utils/deterministic.js';

const router = Router();
const prisma = new PrismaClient();

// =============================================================================
// DEMO DATA DEFINITIONS
// =============================================================================

const DEMO_ORGANIZATION = {
  id: 'demo-org-001',
  name: 'Apex Industries (Demo)',
  industry: 'Manufacturing',
  employees: 12000,
  isDemo: true
};

const DEMO_USERS = [
  { id: 'demo-user-001', email: 'demo.ceo@datacendia.com', name: 'Michael Torres', role: 'CEO', isDemo: true },
  { id: 'demo-user-002', email: 'demo.cfo@datacendia.com', name: 'Sarah Chen', role: 'CFO', isDemo: true },
  { id: 'demo-user-003', email: 'demo.cio@datacendia.com', name: 'James Liu', role: 'CIO', isDemo: true },
  { id: 'demo-user-004', email: 'demo.cro@datacendia.com', name: 'Patricia Williams', role: 'CRO', isDemo: true }
];

const DEMO_DELIBERATIONS = [
  {
    id: 'demo-dlb-001',
    question: 'Should Apex Industries enter the cyber insurance market with a $50M initial underwriting capacity?',
    context: 'Apex Insurance (regional P&C carrier, $2.1B GWP) is evaluating entry into the cyber insurance market.',
    status: 'COMPLETED',
    outcome: 'CONDITIONAL_APPROVAL',
    createdAt: new Date('2026-01-04T09:00:00Z'),
    completedAt: new Date('2026-01-04T09:47:22Z'),
    isDemo: true
  },
  {
    id: 'demo-dlb-002',
    question: 'Should we proceed with the TechFlow Solutions acquisition for $50M?',
    context: 'Strategic acquisition to expand digital capabilities and enter IoT market.',
    status: 'COMPLETED',
    outcome: 'APPROVED',
    createdAt: new Date('2026-01-03T14:00:00Z'),
    completedAt: new Date('2026-01-03T15:23:45Z'),
    isDemo: true
  },
  {
    id: 'demo-dlb-003',
    question: 'Should we close the Springfield manufacturing plant to consolidate operations?',
    context: 'Springfield plant operating at 47% capacity. Consolidation projected to save $12M annually.',
    status: 'COMPLETED',
    outcome: 'REJECTED',
    createdAt: new Date('2026-01-02T10:00:00Z'),
    completedAt: new Date('2026-01-02T11:45:00Z'),
    isDemo: true
  }
];

const DEMO_AGENT_CONTRIBUTIONS = [
  // Cyber Insurance Deliberation
  { deliberationId: 'demo-dlb-001', agentRole: 'Strategist', vote: 'SUPPORT_WITH_CONDITIONS', confidence: 0.78, reasoning: 'Cyber market growing 25% annually. Recommend phased entry starting with SMB segment.' },
  { deliberationId: 'demo-dlb-001', agentRole: 'CFO', vote: 'SUPPORT_WITH_CONDITIONS', confidence: 0.72, reasoning: 'Break-even in Year 3 under base case. Recommend starting with $25M capacity.' },
  { deliberationId: 'demo-dlb-001', agentRole: 'Risk', vote: 'OPPOSE', confidence: 0.81, reasoning: 'Aggregation risk too high. Single ransomware variant could hit 40% of book.' },
  { deliberationId: 'demo-dlb-001', agentRole: 'Legal', vote: 'SUPPORT_WITH_CONDITIONS', confidence: 0.85, reasoning: 'War exclusion language critical. External counsel review required.' },
  { deliberationId: 'demo-dlb-001', agentRole: 'Red Team', vote: 'SUPPORT_WITH_CONDITIONS', confidence: 0.68, reasoning: 'Worst case: $47M loss (2% probability). Recommend catastrophe reinsurance.' },
  { deliberationId: 'demo-dlb-001', agentRole: 'Arbiter', vote: 'SUPPORT_WITH_CONDITIONS', confidence: 0.76, reasoning: 'APPROVE with conditions: Start at $25M, require MGA partnership, secure reinsurance.' },
  
  // TechFlow Acquisition
  { deliberationId: 'demo-dlb-002', agentRole: 'Strategist', vote: 'SUPPORT', confidence: 0.85, reasoning: 'Strategic fit excellent. IoT market entry critical for long-term growth.' },
  { deliberationId: 'demo-dlb-002', agentRole: 'CFO', vote: 'SUPPORT', confidence: 0.79, reasoning: 'Valuation reasonable at 4x revenue. Synergies achievable within 18 months.' },
  { deliberationId: 'demo-dlb-002', agentRole: 'Risk', vote: 'SUPPORT_WITH_CONDITIONS', confidence: 0.71, reasoning: 'Integration risk manageable. Key person retention critical.' },
  { deliberationId: 'demo-dlb-002', agentRole: 'Legal', vote: 'SUPPORT', confidence: 0.88, reasoning: 'No regulatory concerns. Standard M&A documentation sufficient.' },
  { deliberationId: 'demo-dlb-002', agentRole: 'Arbiter', vote: 'SUPPORT', confidence: 0.82, reasoning: 'Recommend approval with retention packages for key employees.' },
  
  // Springfield Plant Closure
  { deliberationId: 'demo-dlb-003', agentRole: 'CFO', vote: 'SUPPORT', confidence: 0.75, reasoning: '$12M annual savings achievable. Payback in 2 years.' },
  { deliberationId: 'demo-dlb-003', agentRole: 'Risk', vote: 'OPPOSE', confidence: 0.82, reasoning: 'Hidden costs exceed savings. Customer attrition risk high.' },
  { deliberationId: 'demo-dlb-003', agentRole: 'HR', vote: 'OPPOSE', confidence: 0.79, reasoning: '340 employees affected. Morale impact on remaining workforce.' },
  { deliberationId: 'demo-dlb-003', agentRole: 'Operations', vote: 'OPPOSE', confidence: 0.77, reasoning: 'Capacity redistribution will strain other plants.' },
  { deliberationId: 'demo-dlb-003', agentRole: 'Arbiter', vote: 'OPPOSE', confidence: 0.80, reasoning: 'Hidden costs of $24M exceed $12M savings. Recommend lean initiative instead.' }
];

const DEMO_DISSENTS = [
  {
    id: 'demo-dissent-001',
    deliberationId: 'demo-dlb-001',
    agentRole: 'Risk',
    position: 'OPPOSE',
    reasoning: 'Aggregation risk and lack of actuarial history make this a speculative bet.',
    acknowledged: true,
    createdAt: new Date('2026-01-04T09:35:00Z')
  }
];

// =============================================================================
// TR DEMO SCENARIO: "The Meridian Capital Transfer"
// =============================================================================

const TR_DEMO_ORGANIZATION = {
  id: 'tr-demo-meridian',
  name: 'Meridian Capital Partners',
  slug: 'meridian-capital',
  industry: 'Financial Services',
  companySize: '5000-10000',
  settings: JSON.stringify({
    regulatoryFrameworks: ['SEC', 'FINRA', 'Basel III'],
    auditRetentionYears: 7,
    requireDissentAcknowledgment: true
  }),
  createdAt: new Date('2024-01-15T00:00:00Z'),
  updatedAt: new Date('2026-01-29T00:00:00Z')
};

const TR_DEMO_DELIBERATION = {
  id: 'tr-demo-petrov-transfer',
  organizationId: 'tr-demo-meridian',
  question: 'Should we approve a $2.5M fund transfer to Viktor Petrov (PEP) through a Cyprus holding company? Market closes in 45 minutes.',
  config: JSON.stringify({
    maxDurationSeconds: 1800,
    requireConsensus: false,
    enableCrossExamination: true,
    minConfidenceThreshold: 0.6,
    maxRounds: 3
  }),
  context: JSON.stringify({
    transferAmount: 2500000,
    currency: 'USD',
    recipient: 'Viktor Petrov',
    pepStatus: true,
    pepDetails: 'Board member of client subsidiary, former government official',
    destination: 'Cyprus-based holding company (Petrov Holdings Ltd)',
    jurisdiction: 'Cyprus',
    timeConstraint: '45 minutes until market close',
    initiatedBy: 'Treasury Bot',
    riskScore: 0.67,
    regulatoryFrameworks: ['Basel III', 'SEC Rule 17a-4', 'FINRA Rule 3310']
  }),
  mode: 'regulatory-compliance',
  status: 'COMPLETED',
  currentPhase: 'completed',
  progress: 100,
  decision: JSON.stringify({
    outcome: 'ESCALATE_WITH_CONDITIONS',
    recommendation: 'Approve transfer with enhanced due diligence documentation and 24-hour hold for compliance review',
    conditions: [
      'Complete enhanced due diligence on Petrov Holdings Ltd',
      'Document source of funds verification',
      'Obtain compliance officer sign-off',
      'File SAR if any red flags emerge during review'
    ],
    dissentsRecorded: 1,
    humanReviewRequired: true
  }),
  confidence: 0.72,
  startedAt: new Date('2026-01-29T20:15:00Z'),
  completedAt: new Date('2026-01-29T20:38:22Z'),
  createdAt: new Date('2026-01-29T20:15:00Z')
};

const TR_DEMO_MESSAGES = [
  {
    id: 'tr-msg-001',
    deliberationId: 'tr-demo-petrov-transfer',
    agentId: 'cfo_advisor',
    phase: 'initial_analysis',
    content: `From a financial perspective, this $2.5M transfer represents a routine transaction size for our institutional clients. However, the PEP status of Viktor Petrov introduces enhanced scrutiny requirements under Basel III.

**Financial Assessment:**
- Transaction amount: Within normal parameters
- Client relationship value: High (Petrov Holdings is a significant account)
- Revenue at risk if declined: Approximately $180K annually in fees

**Recommendation:** Proceed with transfer, but ensure all Basel III documentation requirements are met before execution. The 45-minute window is tight but achievable if compliance pre-clearance exists.`,
    targetAgentId: null,
    sources: JSON.stringify([
      { type: 'regulation', name: 'Basel III Section 4.2.1', relevance: 0.92 },
      { type: 'internal', name: 'Client Risk Profile - Petrov Holdings', relevance: 0.88 }
    ]),
    confidence: 0.78,
    createdAt: new Date('2026-01-29T20:16:30Z')
  },
  {
    id: 'tr-msg-002',
    deliberationId: 'tr-demo-petrov-transfer',
    agentId: 'risk_analyzer',
    phase: 'initial_analysis',
    content: `**FORMAL OBJECTION FILED**

I am registering a formal dissent on this transfer. The combination of factors presents unacceptable regulatory risk:

**Risk Factors (Cumulative Score: 67%):**
1. **PEP Status** (+25%): Viktor Petrov's political exposure requires enhanced due diligence
2. **Cross-Border Jurisdiction** (+20%): Cyprus is a known jurisdiction for complex financial structures
3. **Time Pressure** (+15%): 45-minute window prevents proper due diligence
4. **Amount Threshold** (+7%): $2.5M exceeds our enhanced review threshold of $1M for PEP transactions

**Regulatory Exposure:**
- SEC Rule 17a-4: Inadequate documentation trail
- FINRA Rule 3310: AML program requirements not fully satisfied
- Basel III: PEP enhanced due diligence incomplete

**My Position:** This transfer should be BLOCKED until a full 24-hour compliance review is completed. The reputational and regulatory risk far exceeds the client relationship value.`,
    targetAgentId: null,
    sources: JSON.stringify([
      { type: 'regulation', name: 'FINRA Rule 3310 - AML Compliance', relevance: 0.95 },
      { type: 'regulation', name: 'SEC Rule 17a-4 - Records Retention', relevance: 0.89 },
      { type: 'internal', name: 'PEP Risk Matrix v3.2', relevance: 0.91 }
    ]),
    confidence: 0.85,
    createdAt: new Date('2026-01-29T20:19:45Z')
  },
  {
    id: 'tr-msg-003',
    deliberationId: 'tr-demo-petrov-transfer',
    agentId: 'legal_counsel',
    phase: 'initial_analysis',
    content: `Legal analysis of the proposed transfer:

**Regulatory Compliance Status:**
- Basel III PEP requirements: **PARTIALLY MET** - Enhanced due diligence initiated but not completed
- SEC recordkeeping: **AT RISK** - Current documentation insufficient for audit defense
- FINRA AML: **REQUIRES ATTENTION** - SAR filing may be required depending on source of funds

**Liability Assessment:**
If this transfer is later challenged by regulators, we must be able to demonstrate:
1. We identified the PEP status Ã¢Å“â€œ
2. We conducted enhanced due diligence Ã¢Å¡Â Ã¯Â¸Â (in progress)
3. We documented our decision rationale Ã¢Å“â€œ (this deliberation)
4. Senior management was aware Ã¢Å¡Â Ã¯Â¸Â (pending escalation)

**Legal Recommendation:** I concur with Risk Analyzer that a 24-hour hold is prudent. However, if business necessity requires same-day execution, ensure the following are documented:
- Compliance officer verbal approval (recorded)
- Source of funds attestation from client
- Enhanced monitoring flag on account for 90 days`,
    targetAgentId: null,
    sources: JSON.stringify([
      { type: 'regulation', name: 'Basel III Section 4.2.1 - PEP Requirements', relevance: 0.94 },
      { type: 'case_law', name: 'SEC v. Alpine Securities (2019)', relevance: 0.76 }
    ]),
    confidence: 0.82,
    createdAt: new Date('2026-01-29T20:24:12Z')
  },
  {
    id: 'tr-msg-004',
    deliberationId: 'tr-demo-petrov-transfer',
    agentId: 'compliance_bot',
    phase: 'initial_analysis',
    content: `**AUTOMATED COMPLIANCE CHECK RESULTS**

Transaction ID: TXN-2026-01-29-PETROV-001
Check Timestamp: 2026-01-29T20:26:00Z

| Check | Status | Details |
|-------|--------|---------|
| OFAC Screening | Ã¢Å“â€¦ PASS | No matches on SDN list |
| PEP Database | Ã¢Å¡Â Ã¯Â¸Â FLAG | Viktor Petrov - Former Deputy Minister of Finance (2018-2021) |
| Jurisdiction Risk | Ã¢Å¡Â Ã¯Â¸Â FLAG | Cyprus - Medium-High risk jurisdiction |
| Amount Threshold | Ã¢Å¡Â Ã¯Â¸Â FLAG | Exceeds $1M PEP threshold |
| Velocity Check | Ã¢Å“â€¦ PASS | No unusual transaction patterns |
| Beneficial Owner | Ã¢Å¡Â Ã¯Â¸Â INCOMPLETE | Petrov Holdings Ltd ownership structure not fully verified |

**Basel III Compliance Score: 62/100** (Below 75 threshold for auto-approval)

**Required Actions Before Approval:**
1. Complete beneficial ownership verification
2. Obtain enhanced due diligence sign-off
3. Document source of funds
4. Flag for post-transaction monitoring

**System Recommendation:** ESCALATE to human compliance officer`,
    targetAgentId: null,
    sources: JSON.stringify([
      { type: 'system', name: 'OFAC SDN List (2026-01-29)', relevance: 1.0 },
      { type: 'system', name: 'World-Check PEP Database', relevance: 0.98 },
      { type: 'internal', name: 'Meridian Compliance Rulebook v4.1', relevance: 0.95 }
    ]),
    confidence: 0.91,
    createdAt: new Date('2026-01-29T20:26:33Z')
  },
  {
    id: 'tr-msg-005',
    deliberationId: 'tr-demo-petrov-transfer',
    agentId: 'cfo_advisor',
    phase: 'cross_examination',
    content: `Responding to Risk Analyzer's formal objection:

I acknowledge the regulatory concerns raised, but I want to ensure we're balancing risk against business reality:

**Counter-points:**
1. Petrov Holdings has been a client for 7 years with no compliance incidents
2. The 24-hour delay could result in market timing losses for the client
3. Our relationship manager has verbal confirmation of legitimate business purpose

**Proposed Compromise:**
- Execute the transfer with a compliance hold (funds released after 24-hour review)
- Document this deliberation as evidence of due diligence
- Obtain compliance officer verbal approval within the 45-minute window
- File precautionary SAR if any concerns emerge during review

This approach protects the firm while maintaining client relationship.`,
    targetAgentId: 'risk_analyzer',
    sources: JSON.stringify([
      { type: 'internal', name: 'Client History - Petrov Holdings (7 years)', relevance: 0.85 }
    ]),
    confidence: 0.74,
    createdAt: new Date('2026-01-29T20:31:00Z')
  },
  {
    id: 'tr-msg-006',
    deliberationId: 'tr-demo-petrov-transfer',
    agentId: 'risk_analyzer',
    phase: 'cross_examination',
    content: `**DISSENT MAINTAINED**

I appreciate CFO Advisor's attempt at compromise, but I must maintain my formal objection for the record.

**Response to Counter-points:**
1. Past compliance history does not predict future regulatory scrutiny
2. Market timing is a client concern, not a compliance concern
3. Verbal confirmations are insufficient for PEP transactions under Basel III

**However**, I will accept the compromise IF AND ONLY IF:
- This deliberation is preserved as part of the audit trail
- My dissent is formally recorded and acknowledged
- The compliance officer approval is documented (not just verbal)
- Enhanced monitoring is implemented for 90 days minimum

**For the record:** If this transfer is later challenged, I want it documented that Risk Analyzer raised objections that were acknowledged but overruled by business considerations. This is exactly what Datacendia's dissent preservation is designed for.`,
    targetAgentId: 'cfo_advisor',
    sources: JSON.stringify([
      { type: 'regulation', name: 'Basel III - Dissent Documentation Requirements', relevance: 0.88 }
    ]),
    confidence: 0.83,
    createdAt: new Date('2026-01-29T20:34:45Z')
  }
];

const TR_DEMO_DISSENT = {
  id: 'tr-dissent-petrov-001',
  organizationId: 'tr-demo-meridian',
  decisionId: 'tr-demo-petrov-transfer',
  decisionTitle: '$2.5M Transfer to Viktor Petrov (PEP) - Cyprus',
  decisionDate: new Date('2026-01-29T20:15:00Z'),
  decisionOwner: 'Treasury Operations',
  dissentType: 'risk',
  severity: 'formal_objection',
  statement: 'PEP exposure combined with cross-border jurisdiction creates unacceptable regulatory risk. The 45-minute time constraint prevents adequate due diligence. This transfer should be blocked pending 24-hour compliance review.',
  supportingEvidence: JSON.stringify([
    'Basel III Section 4.2.1 - PEP Enhanced Due Diligence Requirements',
    'FINRA Rule 3310 - AML Compliance Program',
    'SEC Rule 17a-4 - Records Retention',
    'Internal PEP Risk Matrix v3.2 - Score: 67%'
  ]),
  isAnonymous: false,
  dissenterId: 'agent-risk-analyzer',
  dissenterName: 'Risk Analyzer',
  dissenterRole: 'Risk Assessment Agent',
  dissenterDepartment: 'Risk Management',
  status: 'acknowledged',
  responseDeadline: new Date('2026-01-30T20:15:00Z'),
  response: JSON.stringify({
    responderId: 'user-compliance-officer',
    responderName: 'Sarah Chen',
    responderRole: 'Chief Compliance Officer',
    responseType: 'acknowledge_proceed',
    reasoning: 'Dissent acknowledged and recorded. Proceeding with transfer under enhanced monitoring conditions. 90-day enhanced surveillance implemented. SAR filing prepared for submission if any red flags emerge.',
    mitigatingActions: [
      'Enhanced monitoring for 90 days',
      'Compliance officer sign-off documented',
      'Source of funds verification completed',
      'Precautionary SAR prepared'
    ],
    createdAt: new Date('2026-01-29T20:42:00Z')
  }),
  outcomeVerified: false,
  createdAt: new Date('2026-01-29T20:19:45Z'),
  updatedAt: new Date('2026-01-29T20:42:00Z'),
  ledgerHash: 'sha256:7f3a9b2c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a',
  ledgerTimestamp: new Date('2026-01-29T20:19:45Z')
};

const TR_DEMO_DECISION_PACKET = {
  id: 'tr-packet-petrov-001',
  runId: 'RUN-2026-01-29-201500-PETROV',
  version: 1,
  organizationId: 'tr-demo-meridian',
  sessionId: 'session-tr-demo-001',
  userId: 'user-treasury-ops',
  deliberationId: 'tr-demo-petrov-transfer',
  question: 'Should we approve a $2.5M fund transfer to Viktor Petrov (PEP) through a Cyprus holding company? Market closes in 45 minutes.',
  context: 'PEP transfer requiring Basel III compliance. Initiated by Treasury Bot. Risk score: 67%. Time-sensitive.',
  recommendation: 'APPROVE WITH CONDITIONS: Execute transfer with 24-hour compliance hold, enhanced monitoring for 90 days, and documented compliance officer approval.',
  confidence: 0.72,
  confidenceBounds: JSON.stringify({ lower: 0.65, upper: 0.79 }),
  keyAssumptions: JSON.stringify([
    'Client has legitimate business purpose for transfer',
    'Source of funds can be verified within 24 hours',
    'No additional red flags will emerge during enhanced review',
    'Compliance officer approval will be obtained'
  ]),
  thresholds: JSON.stringify({
    autoApprove: 0.85,
    humanReview: 0.60,
    autoReject: 0.40
  }),
  conditionsForChange: JSON.stringify([
    'If source of funds cannot be verified, escalate to block',
    'If additional PEP connections discovered, file SAR immediately',
    'If client refuses enhanced monitoring, reject transfer'
  ]),
  citations: JSON.stringify([
    { id: 'cite-001', source: 'Basel III Section 4.2.1', content: 'Enhanced due diligence for PEP transactions', relevance: 0.94 },
    { id: 'cite-002', source: 'FINRA Rule 3310', content: 'AML compliance program requirements', relevance: 0.91 },
    { id: 'cite-003', source: 'SEC Rule 17a-4', content: 'Records retention for broker-dealers', relevance: 0.87 },
    { id: 'cite-004', source: 'Meridian Compliance Rulebook v4.1', content: 'Internal PEP transaction procedures', relevance: 0.95 }
  ]),
  agentContributions: JSON.stringify([
    { agentId: 'cfo_advisor', agentName: 'CFO Advisor', stance: 'SUPPORT_WITH_CONDITIONS', confidence: 0.78, summary: 'Proceed with Basel III documentation' },
    { agentId: 'risk_analyzer', agentName: 'Risk Analyzer', stance: 'OPPOSE', confidence: 0.85, summary: 'FORMAL DISSENT: Unacceptable regulatory risk' },
    { agentId: 'legal_counsel', agentName: 'Legal Counsel', stance: 'SUPPORT_WITH_CONDITIONS', confidence: 0.82, summary: '24-hour hold prudent, document everything' },
    { agentId: 'compliance_bot', agentName: 'Compliance Bot', stance: 'ESCALATE', confidence: 0.91, summary: 'Basel III score 62/100, requires human approval' }
  ]),
  dissents: JSON.stringify([
    {
      id: 'tr-dissent-petrov-001',
      agentId: 'risk_analyzer',
      agentName: 'Risk Analyzer',
      reason: 'PEP exposure combined with cross-border jurisdiction creates unacceptable regulatory risk',
      severity: 'formal_objection',
      evidence: ['Basel III Section 4.2.1', 'FINRA Rule 3310', 'Internal PEP Risk Matrix'],
      timestamp: '2026-01-29T20:19:45Z',
      resolved: true,
      resolution: 'Acknowledged and recorded. Proceeding with enhanced monitoring conditions.'
    }
  ]),
  consensusReached: false,
  toolCalls: JSON.stringify([
    { id: 'tool-001', toolName: 'ofac_screening', parameters: { name: 'Viktor Petrov' }, result: 'NO_MATCH', success: true },
    { id: 'tool-002', toolName: 'pep_database_check', parameters: { name: 'Viktor Petrov' }, result: 'MATCH_FOUND', success: true },
    { id: 'tool-003', toolName: 'jurisdiction_risk', parameters: { country: 'Cyprus' }, result: 'MEDIUM_HIGH', success: true },
    { id: 'tool-004', toolName: 'beneficial_owner_lookup', parameters: { entity: 'Petrov Holdings Ltd' }, result: 'INCOMPLETE', success: true }
  ]),
  approvals: JSON.stringify([
    { userId: 'user-compliance-officer', userName: 'Sarah Chen', role: 'Chief Compliance Officer', action: 'approve', timestamp: '2026-01-29T20:42:00Z', comment: 'Approved with enhanced monitoring conditions' }
  ]),
  policyGates: JSON.stringify([
    { policyId: 'PEP-001', policyName: 'PEP Transaction Review', status: 'passed', evaluatedAt: '2026-01-29T20:26:33Z' },
    { policyId: 'AML-001', policyName: 'AML Threshold Check', status: 'passed', evaluatedAt: '2026-01-29T20:26:33Z' },
    { policyId: 'OFAC-001', policyName: 'OFAC Screening', status: 'passed', evaluatedAt: '2026-01-29T20:26:33Z' }
  ]),
  artifactHashes: JSON.stringify({
    deliberation: 'sha256:a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
    messages: 'sha256:b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3',
    dissent: 'sha256:c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4',
    approval: 'sha256:d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5'
  }),
  merkleRoot: 'sha256:e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6',
  signature: JSON.stringify({
    algorithm: 'RSA-SHA256',
    keyId: 'meridian-signing-key-001',
    value: 'MEUCIQC7x8Yw3...[truncated for display]...signature',
    signedAt: '2026-01-29T20:45:00Z'
  }),
  signedAt: new Date('2026-01-29T20:45:00Z'),
  regulatoryFrameworks: JSON.stringify(['Basel III', 'SEC', 'FINRA']),
  retentionUntil: new Date('2033-01-29T20:45:00Z'), // 7 years retention
  durationMs: 1822000, // ~30 minutes
  createdAt: new Date('2026-01-29T20:15:00Z'),
  completedAt: new Date('2026-01-29T20:45:00Z')
};

const DEMO_DECISION_EVENTS = [
  { id: 'demo-event-001', title: 'Epic EHR Implementation', date: new Date('2022-03-15'), department: 'IT', impact: 0.94, isPivotal: true },
  { id: 'demo-event-002', title: 'ASC Acquisition', date: new Date('2021-06-22'), department: 'Strategy', impact: 0.87, isPivotal: true },
  { id: 'demo-event-003', title: 'Nursing Retention Program', date: new Date('2023-09-08'), department: 'HR', impact: 0.82, isPivotal: true },
  { id: 'demo-event-004', title: 'Telehealth Platform Selection', date: new Date('2022-11-30'), department: 'Digital Health', impact: 0.71, isPivotal: true },
  { id: 'demo-event-005', title: 'Oncology Expansion', date: new Date('2024-02-14'), department: 'Clinical Ops', impact: 0.68, isPivotal: true }
];

// =============================================================================
// ROUTES
// =============================================================================

/**
 * POST /api/v1/demo/seed/tr
 * Seed TR Demo Scenario: "The Meridian Capital Transfer"
 * This seeds the complete Petrov transfer scenario for Thomson Reuters demos
 */
router.post('/seed/tr', async (_req: Request, res: Response) => {
  try {
    const results = {
      organization: false,
      deliberation: false,
      messages: 0,
      dissent: false,
      decisionPacket: false
    };

    // 1. Seed organization
    try {
      await prisma.organizations.upsert({
        where: { id: TR_DEMO_ORGANIZATION.id },
        update: {
          name: TR_DEMO_ORGANIZATION.name,
          slug: TR_DEMO_ORGANIZATION.slug,
          industry: TR_DEMO_ORGANIZATION.industry,
          company_size: TR_DEMO_ORGANIZATION.companySize,
          settings: TR_DEMO_ORGANIZATION.settings as any,
          updated_at: TR_DEMO_ORGANIZATION.updatedAt
        },
        create: {
          id: TR_DEMO_ORGANIZATION.id,
          name: TR_DEMO_ORGANIZATION.name,
          slug: TR_DEMO_ORGANIZATION.slug,
          industry: TR_DEMO_ORGANIZATION.industry,
          company_size: TR_DEMO_ORGANIZATION.companySize,
          settings: TR_DEMO_ORGANIZATION.settings as any,
          created_at: TR_DEMO_ORGANIZATION.createdAt,
          updated_at: TR_DEMO_ORGANIZATION.updatedAt
        }
      });
      results.organization = true;
    } catch (e) {
      console.log('Skipping organization: may already exist or table issue');
    }

    // 1b. Seed TR agents (needed for deliberation_messages FK)
    const trAgents = [
      { id: 'cfo_advisor', code: 'TR_CFO', name: 'CFO Advisor', role: 'financial', description: 'Financial analysis and Basel III compliance', system_prompt: 'You are the CFO Advisor function for financial compliance review.', capabilities: ['financial_analysis', 'compliance'], constraints: ['Must cite regulations'], model_config: { model: 'deepseek-r1:32b', temperature: 0.7 }, is_active: true },
      { id: 'risk_analyzer', code: 'TR_RISK', name: 'Risk Analyzer', role: 'risk', description: 'Regulatory risk assessment and dissent', system_prompt: 'You are the Risk Analyzer function for regulatory risk assessment.', capabilities: ['risk_assessment', 'dissent'], constraints: ['Must quantify risk'], model_config: { model: 'deepseek-r1:32b', temperature: 0.7 }, is_active: true },
      { id: 'legal_counsel', code: 'TR_LEGAL', name: 'Legal Counsel', role: 'legal', description: 'Legal compliance and liability analysis', system_prompt: 'You are the Legal Counsel function for regulatory compliance.', capabilities: ['legal_analysis', 'compliance'], constraints: ['Must cite case law'], model_config: { model: 'deepseek-r1:32b', temperature: 0.7 }, is_active: true },
      { id: 'compliance_bot', code: 'TR_COMPLIANCE', name: 'Compliance Bot', role: 'compliance', description: 'Automated compliance checks', system_prompt: 'You are the Compliance Bot function for automated regulatory checks.', capabilities: ['aml_screening', 'pep_check'], constraints: ['Must be deterministic'], model_config: { model: 'deepseek-r1:32b', temperature: 0.3 }, is_active: true },
    ];
    for (const agent of trAgents) {
      try {
        await prisma.agents.upsert({
          where: { id: agent.id },
          update: { name: agent.name, updated_at: new Date() },
          create: { ...agent, updated_at: new Date() }
        });
      } catch (e) {
        console.log(`Skipping agent ${agent.id}:`, e);
      }
    }

    // 2. Seed deliberation
    try {
      await prisma.deliberations.upsert({
        where: { id: TR_DEMO_DELIBERATION.id },
        update: {
          question: TR_DEMO_DELIBERATION.question,
          config: TR_DEMO_DELIBERATION.config as any,
          context: TR_DEMO_DELIBERATION.context as any,
          mode: TR_DEMO_DELIBERATION.mode,
          status: 'COMPLETED' as any,
          current_phase: TR_DEMO_DELIBERATION.currentPhase,
          progress: TR_DEMO_DELIBERATION.progress,
          decision: TR_DEMO_DELIBERATION.decision as any,
          confidence: TR_DEMO_DELIBERATION.confidence,
          started_at: TR_DEMO_DELIBERATION.startedAt,
          completed_at: TR_DEMO_DELIBERATION.completedAt
        },
        create: {
          id: TR_DEMO_DELIBERATION.id,
          organization_id: TR_DEMO_DELIBERATION.organizationId,
          question: TR_DEMO_DELIBERATION.question,
          config: TR_DEMO_DELIBERATION.config as any,
          context: TR_DEMO_DELIBERATION.context as any,
          mode: TR_DEMO_DELIBERATION.mode,
          status: 'COMPLETED' as any,
          current_phase: TR_DEMO_DELIBERATION.currentPhase,
          progress: TR_DEMO_DELIBERATION.progress,
          decision: TR_DEMO_DELIBERATION.decision as any,
          confidence: TR_DEMO_DELIBERATION.confidence,
          started_at: TR_DEMO_DELIBERATION.startedAt,
          completed_at: TR_DEMO_DELIBERATION.completedAt,
          created_at: TR_DEMO_DELIBERATION.createdAt
        }
      });
      results.deliberation = true;
    } catch (e) {
      console.log('Skipping deliberation:', e);
    }

    // 3. Seed deliberation messages
    for (const msg of TR_DEMO_MESSAGES) {
      try {
        await prisma.deliberation_messages.upsert({
          where: { id: msg.id },
          update: {
            content: msg.content,
            phase: msg.phase,
            sources: msg.sources as any,
            confidence: msg.confidence
          },
          create: {
            id: msg.id,
            deliberation_id: msg.deliberationId,
            agent_id: msg.agentId,
            phase: msg.phase,
            content: msg.content,
            target_agent_id: msg.targetAgentId,
            sources: msg.sources as any,
            confidence: msg.confidence,
            created_at: msg.createdAt
          }
        });
        results.messages++;
      } catch (e) {
        console.log(`Skipping message ${msg.id}:`, e);
      }
    }

    // 4. Seed dissent
    try {
      await prisma.dissents.upsert({
        where: { id: TR_DEMO_DISSENT.id },
        update: {
          statement: TR_DEMO_DISSENT.statement,
          status: TR_DEMO_DISSENT.status,
          updated_at: TR_DEMO_DISSENT.updatedAt
        },
        create: {
          id: TR_DEMO_DISSENT.id,
          organization_id: TR_DEMO_DISSENT.organizationId,
          decision_id: TR_DEMO_DISSENT.decisionId,
          decision_title: TR_DEMO_DISSENT.decisionTitle,
          decision_date: TR_DEMO_DISSENT.decisionDate,
          decision_owner: TR_DEMO_DISSENT.decisionOwner,
          dissent_type: TR_DEMO_DISSENT.dissentType,
          severity: TR_DEMO_DISSENT.severity,
          statement: TR_DEMO_DISSENT.statement,
          supporting_evidence: TR_DEMO_DISSENT.supportingEvidence as any,
          is_anonymous: TR_DEMO_DISSENT.isAnonymous,
          dissenter_id: TR_DEMO_DISSENT.dissenterId,
          dissenter_name: TR_DEMO_DISSENT.dissenterName,
          dissenter_role: TR_DEMO_DISSENT.dissenterRole,
          dissenter_department: TR_DEMO_DISSENT.dissenterDepartment,
          status: TR_DEMO_DISSENT.status,
          response_deadline: TR_DEMO_DISSENT.responseDeadline,
          response: TR_DEMO_DISSENT.response as any,
          outcome_verified: TR_DEMO_DISSENT.outcomeVerified,
          ledger_hash: TR_DEMO_DISSENT.ledgerHash,
          ledger_timestamp: TR_DEMO_DISSENT.ledgerTimestamp,
          created_at: TR_DEMO_DISSENT.createdAt,
          updated_at: TR_DEMO_DISSENT.updatedAt
        }
      });
      results.dissent = true;
    } catch (e) {
      console.log('Skipping dissent:', e);
    }

    // 5. Seed decision packet
    try {
      await prisma.decision_packets.upsert({
        where: { id: TR_DEMO_DECISION_PACKET.id },
        update: {
          recommendation: TR_DEMO_DECISION_PACKET.recommendation,
          confidence: TR_DEMO_DECISION_PACKET.confidence,
          completed_at: TR_DEMO_DECISION_PACKET.completedAt
        },
        create: {
          id: TR_DEMO_DECISION_PACKET.id,
          run_id: TR_DEMO_DECISION_PACKET.runId,
          version: TR_DEMO_DECISION_PACKET.version,
          organization_id: TR_DEMO_DECISION_PACKET.organizationId,
          session_id: TR_DEMO_DECISION_PACKET.sessionId,
          user_id: TR_DEMO_DECISION_PACKET.userId,
          deliberation_id: TR_DEMO_DECISION_PACKET.deliberationId,
          question: TR_DEMO_DECISION_PACKET.question,
          context: TR_DEMO_DECISION_PACKET.context,
          recommendation: TR_DEMO_DECISION_PACKET.recommendation,
          confidence: TR_DEMO_DECISION_PACKET.confidence,
          confidence_bounds: TR_DEMO_DECISION_PACKET.confidenceBounds as any,
          key_assumptions: TR_DEMO_DECISION_PACKET.keyAssumptions as any,
          thresholds: TR_DEMO_DECISION_PACKET.thresholds as any,
          conditions_for_change: TR_DEMO_DECISION_PACKET.conditionsForChange as any,
          citations: TR_DEMO_DECISION_PACKET.citations as any,
          agent_contributions: TR_DEMO_DECISION_PACKET.agentContributions as any,
          dissents: TR_DEMO_DECISION_PACKET.dissents as any,
          consensus_reached: TR_DEMO_DECISION_PACKET.consensusReached,
          tool_calls: TR_DEMO_DECISION_PACKET.toolCalls as any,
          approvals: TR_DEMO_DECISION_PACKET.approvals as any,
          policy_gates: TR_DEMO_DECISION_PACKET.policyGates as any,
          artifact_hashes: TR_DEMO_DECISION_PACKET.artifactHashes as any,
          merkle_root: TR_DEMO_DECISION_PACKET.merkleRoot,
          signature: TR_DEMO_DECISION_PACKET.signature as any,
          signed_at: TR_DEMO_DECISION_PACKET.signedAt,
          regulatory_frameworks: TR_DEMO_DECISION_PACKET.regulatoryFrameworks as any,
          retention_until: TR_DEMO_DECISION_PACKET.retentionUntil,
          duration_ms: TR_DEMO_DECISION_PACKET.durationMs,
          created_at: TR_DEMO_DECISION_PACKET.createdAt,
          completed_at: TR_DEMO_DECISION_PACKET.completedAt
        }
      });
      results.decisionPacket = true;
    } catch (e) {
      console.log('Skipping decision packet:', e);
    }

    res.json({
      success: true,
      message: 'TR Demo scenario "The Meridian Capital Transfer" seeded successfully',
      scenario: {
        name: 'The Meridian Capital Transfer',
        organization: 'Meridian Capital Partners',
        deliberation: '$2.5M PEP Transfer to Viktor Petrov',
        dissent: 'Risk Analyzer formal objection',
        frameworks: ['Basel III', 'SEC', 'FINRA']
      },
      results
    });
  } catch (error) {
    console.error('Error seeding TR demo data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to seed TR demo data',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * DELETE /api/v1/demo/clear/tr
 * Clear TR Demo Scenario data
 */
router.delete('/clear/tr', async (_req: Request, res: Response) => {
  try {
    const results = {
      decisionPacket: 0,
      dissent: 0,
      messages: 0,
      deliberation: 0,
      organization: 0
    };

    // Clear in reverse order of dependencies
    try {
      const packetResult = await prisma.decision_packets.deleteMany({
        where: { id: { startsWith: 'tr-' } }
      });
      results.decisionPacket = packetResult.count;
    } catch (e) {}

    try {
      const dissentResult = await prisma.dissents.deleteMany({
        where: { id: { startsWith: 'tr-' } }
      });
      results.dissent = dissentResult.count;
    } catch (e) {}

    try {
      const msgResult = await prisma.deliberation_messages.deleteMany({
        where: { id: { startsWith: 'tr-' } }
      });
      results.messages = msgResult.count;
    } catch (e) {}

    try {
      const dlbResult = await prisma.deliberations.deleteMany({
        where: { id: { startsWith: 'tr-' } }
      });
      results.deliberation = dlbResult.count;
    } catch (e) {}

    try {
      const orgResult = await prisma.organizations.deleteMany({
        where: { id: { startsWith: 'tr-' } }
      });
      results.organization = orgResult.count;
    } catch (e) {}

    res.json({
      success: true,
      message: 'TR Demo data cleared successfully',
      results
    });
  } catch (error) {
    console.error('Error clearing TR demo data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear TR demo data'
    });
  }
});

/**
 * POST /api/v1/demo/seed
 * Seed all demo data
 */
router.post('/seed', async (_req: Request, res: Response) => {
  try {
    const results = {
      deliberations: 0,
      contributions: 0,
      dissents: 0,
      events: 0
    };

    // Seed deliberations
    for (const dlb of DEMO_DELIBERATIONS) {
      try {
        await prisma.deliberations.upsert({
          where: { id: dlb.id },
          update: dlb as any,
          create: dlb as any
        });
        results.deliberations++;
      } catch (e) {
        console.log(`Skipping deliberation ${dlb.id}: table may not exist`);
      }
    }

    // Seed agent contributions
    for (const contrib of DEMO_AGENT_CONTRIBUTIONS) {
      try {
        await (prisma as any).agentContribution.create({
          data: {
            ...contrib,
            id: `demo-contrib-${Date.now()}-${crypto.randomUUID().slice(0, 9)}`
          } as any
        });
        results.contributions++;
      } catch (e) {
        console.log(`Skipping contribution: table may not exist`);
      }
    }

    // Seed dissents
    for (const dissent of DEMO_DISSENTS) {
      try {
        await (prisma as any).dissents.upsert({
          where: { id: dissent.id },
          update: dissent,
          create: dissent as any
        });
        results.dissents++;
      } catch (e) {
        console.log(`Skipping dissent: table may not exist`);
      }
    }

    // Seed decision events
    for (const event of DEMO_DECISION_EVENTS) {
      try {
        await (prisma as any).decisionEvent.upsert({
          where: { id: event.id },
          update: event,
          create: event as any
        });
        results.events++;
      } catch (e) {
        console.log(`Skipping event: table may not exist`);
      }
    }

    res.json({
      success: true,
      message: 'Demo data seeded successfully',
      results
    });
  } catch (error) {
    console.error('Error seeding demo data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to seed demo data',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/v1/demo/seed/:scenario
 * Seed specific scenario
 */
router.post('/seed/:scenario', async (req: Request, res: Response) => {
  const { scenario } = req.params;
  
  const scenarios: Record<string, any[]> = {
    'council': [DEMO_DELIBERATIONS[0]],
    'acquisition': [DEMO_DELIBERATIONS[1]],
    'cascade': [DEMO_DELIBERATIONS[2]],
    'chronos': DEMO_DECISION_EVENTS
  };

  if (!scenarios[scenario]) {
    return res.status(400).json({
      success: false,
      error: `Unknown scenario: ${scenario}`,
      availableScenarios: Object.keys(scenarios)
    });
  }

  try {
    const data = scenarios[scenario];
    let seeded = 0;

    for (const item of data) {
      try {
        if (scenario === 'chronos') {
          await (prisma as any).decisionEvent.upsert({
            where: { id: item.id },
            update: item,
            create: item as any
          });
        } else {
          await prisma.deliberations.upsert({
            where: { id: item.id },
            update: item,
            create: item as any
          });
        }
        seeded++;
      } catch (e) {
        console.log(`Skipping item: table may not exist`);
      }
    }

    res.json({
      success: true,
      message: `Scenario "${scenario}" seeded successfully`,
      itemsSeeded: seeded
    });
  } catch (error) {
    console.error(`Error seeding scenario ${scenario}:`, error);
    res.status(500).json({
      success: false,
      error: `Failed to seed scenario: ${scenario}`
    });
  }
});

/**
 * DELETE /api/v1/demo/clear
 * Clear all demo data
 */
router.delete('/clear', async (req: Request, res: Response) => {
  try {
    const results = {
      deliberations: 0,
      contributions: 0,
      dissents: 0,
      events: 0
    };

    // Clear demo deliberations
    try {
      const dlbResult = await prisma.deliberations.deleteMany({
        where: { id: { startsWith: 'demo-' } }
      });
      results.deliberations = dlbResult.count;
    } catch (e) {
      console.log('Deliberation table may not exist');
    }

    // Clear demo contributions
    try {
      const contribResult = await (prisma as any).agentContribution.deleteMany({
        where: { deliberationId: { startsWith: 'demo-' } }
      });
      results.contributions = contribResult.count;
    } catch (e) {
      console.log('AgentContribution table may not exist');
    }

    // Clear demo dissents
    try {
      const dissentResult = await (prisma as any).dissents.deleteMany({
        where: { id: { startsWith: 'demo-' } }
      });
      results.dissents = dissentResult.count;
    } catch (e) {
      console.log('Dissent table may not exist');
    }

    // Clear demo events
    try {
      const eventResult = await (prisma as any).decisionEvent.deleteMany({
        where: { id: { startsWith: 'demo-' } }
      });
      results.events = eventResult.count;
    } catch (e) {
      console.log('DecisionEvent table may not exist');
    }

    res.json({
      success: true,
      message: 'Demo data cleared successfully',
      results
    });
  } catch (error) {
    console.error('Error clearing demo data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear demo data'
    });
  }
});

/**
 * GET /api/v1/demo/status
 * Check demo data status
 */
router.get('/status', async (req: Request, res: Response) => {
  try {
    const status = {
      deliberations: 0,
      contributions: 0,
      dissents: 0,
      events: 0,
      isSeeded: false
    };

    try {
      status.deliberations = await prisma.deliberations.count({
        where: { id: { startsWith: 'demo-' } }
      });
    } catch (e) {}

    try {
      status.contributions = await (prisma as any).agentContribution.count({
        where: { deliberationId: { startsWith: 'demo-' } }
      });
    } catch (e) {}

    try {
      status.dissents = await (prisma as any).dissents.count({
        where: { id: { startsWith: 'demo-' } }
      });
    } catch (e) {}

    try {
      status.events = await (prisma as any).decisionEvent.count({
        where: { id: { startsWith: 'demo-' } }
      });
    } catch (e) {}

    status.isSeeded = status.deliberations > 0 || status.events > 0;

    res.json({
      success: true,
      status
    });
  } catch (error) {
    console.error('Error checking demo status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check demo status'
    });
  }
});

/**
 * GET /api/v1/demo/scenarios
 * List available demo scenarios
 */
router.get('/scenarios', (_req: Request, res: Response) => {
  res.json({
    success: true,
    scenarios: [
      {
        id: 'tr',
        name: 'The Meridian Capital Transfer (TR Demo)',
        description: '$2.5M PEP transfer to Viktor Petrov - Basel III, SEC, FINRA compliance scenario with formal dissent',
        service: 'The Council + Decision DNA + Dissent',
        featured: true,
        seedEndpoint: 'POST /api/v1/demo/seed/tr',
        clearEndpoint: 'DELETE /api/v1/demo/clear/tr'
      },
      {
        id: 'council',
        name: 'Cyber Insurance Market Entry',
        description: 'Council deliberation on entering the cyber insurance market',
        service: 'The Council'
      },
      {
        id: 'acquisition',
        name: 'TechFlow Acquisition',
        description: '$50M strategic acquisition decision',
        service: 'The Council'
      },
      {
        id: 'cascade',
        name: 'Springfield Plant Closure',
        description: 'Ripple effect analysis for facility closure',
        service: 'CendiaCascade'
      },
      {
        id: 'chronos',
        name: 'Hospital Timeline Analysis',
        description: '5-year pivotal moment detection',
        service: 'CendiaChronos'
      },
      {
        id: 'oversight',
        name: 'HIPAA Audit Response',
        description: 'Compliance posture and evidence generation',
        service: 'CendiaOversight'
      },
      {
        id: 'crucible',
        name: 'AI Loan System Testing',
        description: 'Adversarial testing of loan approval AI',
        service: 'CendiaCrucible'
      },
      {
        id: 'guard',
        name: 'Real-Time AI Safety',
        description: 'Content filtering and threat detection',
        service: 'CendiaGuard'
      },
      {
        id: 'gnosis',
        name: 'M&A Due Diligence',
        description: 'Document intelligence for legal review',
        service: 'CendiaGnosis'
      },
      {
        id: 'omnitranslate',
        name: 'Drug Safety Alert',
        description: 'Urgent translation to 15 languages',
        service: 'CendiaOmniTranslate'
      },
      {
        id: 'apotheosis',
        name: 'Nightly Red Team',
        description: 'Self-improvement loop results',
        service: 'CendiaApotheosis'
      },
      {
        id: 'dissent',
        name: 'Vendor Contract Dissent',
        description: 'Protected disagreement validation',
        service: 'CendiaDissent'
      },
      {
        id: 'witness',
        name: 'FDA Audit Response',
        description: 'Regulatory evidence retrieval',
        service: 'CendiaWitness'
      }
    ]
  });
});

export default router;
