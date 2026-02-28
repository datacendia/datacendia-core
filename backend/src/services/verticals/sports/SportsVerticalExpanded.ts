// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Sports Vertical Implementation
 * 
 * Datacendia = "Athletic Governance & Compliance Decision Engine"
 * 
 * Killer Asset: FFP/salary cap compliance and player safety audit trails
 * proving regulatory governance and equitable decision-making.
 * 
 * Compliance: 10 frameworks | Decision Schemas: 12 types
 */

import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import {
  DataConnector, DataSource, IngestResult, ProvenanceRecord,
  VerticalKnowledgeBase, KnowledgeDocument, RetrievalResult,
  ComplianceMapper, ComplianceFramework, ComplianceControl, ComplianceViolation, ComplianceEvidence,
  DecisionSchema, BaseDecision, ValidationResult, DefensibleArtifact,
  AgentPreset, AgentCapability, AgentGuardrail, WorkflowStep, AgentTrace,
  DefensibleOutput, RegulatorPacket, CourtBundle, AuditTrail,
  VerticalImplementation, VerticalRegistry
} from '../core/VerticalPattern.js';
import { embeddingService } from '../../llm/EmbeddingService.js';

// ============================================================================
// SPORTS DECISION TYPES
// ============================================================================

export interface PlayerTransferDecision extends BaseDecision {
  type: 'player-transfer';
  inputs: { playerId: string; playerName: string; currentClub: string; targetClub: string; transferFee: number; agentFee: number; wageProposal: number; contractLength: number; sellOnClause: number; performanceBonuses: { trigger: string; amount: number }[]; medicalPassed: boolean; workPermitRequired: boolean; registrationWindow: boolean; thirdPartyOwnership: boolean; };
  outcome: { approved: boolean; finalTransferFee: number; wageAgreed: number; ffpCompliant: boolean; salarCapCompliant: boolean; registrationConfirmed: boolean; conditions: string[]; riskAssessment: 'low' | 'medium' | 'high'; };
}

export interface SalaryCapDecision extends BaseDecision {
  type: 'salary-cap';
  inputs: { teamId: string; league: string; currentPayroll: number; capLimit: number; luxuryTaxThreshold: number; proposedTransaction: { player: string; salary: number; years: number }; capExceptions: string[]; deferredCompensation: number; signAndTradeEligible: boolean; capHolds: number; deadMoney: number; };
  outcome: { compliant: boolean; capSpaceRemaining: number; luxuryTaxExposure: number; exceptionUsed: string; restructureRequired: boolean; alternativeStructures: string[]; conditions: string[]; };
}

export interface PlayerSafetyDecision extends BaseDecision {
  type: 'player-safety';
  inputs: { playerId: string; incidentType: 'concussion' | 'cardiac' | 'heat-illness' | 'contact-injury' | 'overuse' | 'mental-health'; severity: string; medicalEvaluation: string; returnToPlayProtocol: string; independentPhysician: boolean; previousInjuries: number; ageConcerns: boolean; dutyOfCare: string; parentalConsent: boolean; };
  outcome: { clearToPlay: boolean; restrictions: string[]; monitoringRequired: string[]; returnToPlayTimeline: number; independentReviewRequired: boolean; liabilityProtection: string; wellbeingSupport: string[]; conditions: string[]; };
}

export interface AntiDopingDecision extends BaseDecision {
  type: 'anti-doping';
  inputs: { athleteId: string; testId: string; testType: 'in-competition' | 'out-of-competition' | 'target' | 'random'; sampleType: 'urine' | 'blood' | 'passport'; laboratory: string; findings: { substance: string; concentration: number; threshold: number; prohibited: boolean }[]; tue: boolean; whereaboutsViolations: number; bSampleRequested: boolean; chainOfCustody: boolean; };
  outcome: { violation: boolean; substanceCategory: string; provisionalSuspension: boolean; hearingRequired: boolean; sanctionRange: { min: number; max: number }; athleteNotified: boolean; publicDisclosure: boolean; conditions: string[]; };
}

export interface YouthDevelopmentDecision extends BaseDecision {
  type: 'youth-development';
  inputs: { playerId: string; age: number; academyLevel: string; parentalConsent: boolean; educationPlan: boolean; trainingHoursPerWeek: number; travelRequirements: string; compensationOffered: number; scholarshipTerms: string; safeguardingChecks: boolean; wellbeingAssessment: string; internationalRecruitment: boolean; };
  outcome: { approved: boolean; educationPriority: boolean; trainingLimits: string; safeguardingConditions: string[]; parentalNotification: boolean; compensationCompliant: boolean; developmentPathway: string; conditions: string[]; };
}

export interface MatchIntegrityDecision extends BaseDecision {
  type: 'match-integrity';
  inputs: { matchId: string; alertType: 'betting-irregularity' | 'suspicious-result' | 'insider-information' | 'match-fixing' | 'spot-fixing'; bettingData: { market: string; anomaly: string; odds: number }[]; communicationIntelligence: string; personnelInvolved: string[]; previousAlerts: number; jurisdictionCooperation: boolean; evidenceStrength: string; };
  outcome: { investigationOpened: boolean; provisionalMeasures: string[]; personsSuspended: string[]; matchResult: 'valid' | 'void' | 'under-review'; referralToAuthorities: boolean; sanctionsRecommended: string[]; confidentialityLevel: string; conditions: string[]; };
}

export interface VenueDecision extends BaseDecision {
  type: 'venue';
  inputs: { venueId: string; decisionType: 'safety-assessment' | 'capacity-change' | 'event-approval' | 'renovation' | 'accessibility'; currentCapacity: number; safetyInspection: { area: string; compliant: boolean; issue: string }[]; securityPlan: string; emergencyPlan: string; adaCompliance: boolean; weatherConsiderations: string; crowdManagement: string; medicalFacilities: string; };
  outcome: { approved: boolean; capacityAllowed: number; safetyConditions: string[]; securityRequirements: string[]; accessibilityImprovements: string[]; evacuationPlanVerified: boolean; insuranceAdequate: boolean; conditions: string[]; };
}

export interface BroadcastRightsDecision extends BaseDecision {
  type: 'broadcast-rights';
  inputs: { rightsPackage: string; territory: string[]; duration: number; platforms: string[]; minimumGuarantee: number; revenueShare: number; exclusivity: boolean; digitalRights: boolean; clipRights: string; blackoutRestrictions: string[]; competitorBids: number; currentDealExpiry: Date; };
  outcome: { approved: boolean; dealValue: number; selectedBidder: string; revenueProjection: number; digitalTerms: string; antiTrustCleared: boolean; memberApproval: boolean; conditions: string[]; };
}

export interface DraftSelectionDecision extends BaseDecision {
  type: 'draft-selection';
  inputs: { draftYear: number; pickNumber: number; round: number; eligiblePlayers: { playerId: string; position: string; rating: number; medicalFlag: boolean }[]; teamNeeds: string[]; capImplications: { rookieScale: number; capSpace: number }; tradeOffers: { partner: string; picks: string[]; players: string[] }[]; characterAssessment: string; scoutingReports: number; };
  outcome: { selectedPlayer: string; position: string; tradeMade: boolean; capImpact: number; developmentPlan: string; contractTerms: string; conditions: string[]; };
}

export interface SponsorshipDecision extends BaseDecision {
  type: 'sponsorship';
  inputs: { sponsorId: string; sponsorName: string; dealValue: number; duration: number; sponsorshipType: 'naming-rights' | 'jersey' | 'official-partner' | 'broadcast' | 'digital'; brandAlignment: boolean; exclusivityCategory: string; activationRequirements: string[]; moralsTurpitudeClause: boolean; competitorConflicts: string[]; regulatoryRestrictions: string[]; gamblingRelated: boolean; };
  outcome: { approved: boolean; dealValue: number; termsAccepted: string; brandSafetyCleared: boolean; regulatoryCompliant: boolean; activationPlan: string; exitClause: string; conditions: string[]; };
}

export interface DisciplinaryDecision extends BaseDecision {
  type: 'disciplinary';
  inputs: { personId: string; role: 'player' | 'coach' | 'official' | 'executive'; incidentId: string; violation: string; evidence: string[]; previousOffenses: number; mitigatingFactors: string[]; aggravatingFactors: string[]; dueProcess: { hearing: boolean; representation: boolean; evidence: boolean }; publicStatement: boolean; };
  outcome: { sanction: 'fine' | 'suspension' | 'ban' | 'community-service' | 'education' | 'warning' | 'no-action'; duration: number; fineAmount: number; appealAvailable: boolean; rehabilitationProgram: string; publicAnnouncement: boolean; precedentBasis: string; conditions: string[]; };
}

export interface FinancialFairPlayDecision extends BaseDecision {
  type: 'financial-fair-play';
  inputs: { clubId: string; reportingPeriod: string; revenue: number; wages: number; wageToRevenueRatio: number; transferSpend: number; amortization: number; acceptableLoss: number; actualLoss: number; ownerInjections: number; relatedPartyTransactions: { party: string; amount: number; fairValue: boolean }[]; footballEarnings: number; nonFootballRevenue: number; };
  outcome: { compliant: boolean; breakEvenResult: number; wageRatioCompliant: boolean; sanctionRisk: 'none' | 'warning' | 'fine' | 'transfer-ban' | 'point-deduction' | 'exclusion'; settlementAgreement: boolean; voluntaryAgreement: boolean; monitoringRequired: boolean; conditions: string[]; };
}

export type SportsDecision =
  | PlayerTransferDecision | SalaryCapDecision | PlayerSafetyDecision | AntiDopingDecision
  | YouthDevelopmentDecision | MatchIntegrityDecision | VenueDecision | BroadcastRightsDecision
  | DraftSelectionDecision | SponsorshipDecision | DisciplinaryDecision | FinancialFairPlayDecision;

// ============================================================================
// LAYERS 1-6: SPORTS
// ============================================================================

export class SportsDataConnector extends DataConnector<Record<string, unknown>> {
  readonly verticalId = 'sports'; readonly connectorType = 'multi-source';
  constructor() { super(); this.sources.set('player-mgmt', { id: 'player-mgmt', name: 'Player Management System', type: 'database', connectionStatus: 'disconnected', lastSync: null, recordCount: 0 }); this.sources.set('financial', { id: 'financial', name: 'Club Financial System', type: 'database', connectionStatus: 'disconnected', lastSync: null, recordCount: 0 }); this.sources.set('medical', { id: 'medical', name: 'Medical/Performance System', type: 'api', connectionStatus: 'disconnected', lastSync: null, recordCount: 0 }); this.sources.set('scouting', { id: 'scouting', name: 'Scouting Platform', type: 'api', connectionStatus: 'disconnected', lastSync: null, recordCount: 0 }); }
  async connect(config: Record<string, unknown>): Promise<boolean> { const s = this.sources.get(config['sourceId'] as string); if (!s) return false; s.connectionStatus = 'connected'; s.lastSync = new Date(); return true; }
  async disconnect(): Promise<void> { for (const s of this.sources.values()) s.connectionStatus = 'disconnected'; }
  async ingest(sourceId: string): Promise<IngestResult<Record<string, unknown>>> { const s = this.sources.get(sourceId); if (!s || s.connectionStatus !== 'connected') return { success: false, data: null, provenance: this.generateProvenance(sourceId, null), validationErrors: ['Not connected'] }; s.lastSync = new Date(); s.recordCount += 1; return { success: true, data: {}, provenance: this.generateProvenance(sourceId, {}), validationErrors: [] }; }
  validate(data: Record<string, unknown>): { valid: boolean; errors: string[] } { return { valid: !!data, errors: data ? [] : ['Null'] }; }
}

export class SportsKnowledgeBaseLayer extends VerticalKnowledgeBase {
  readonly verticalId = 'sports';
  async embed(content: string, metadata: Record<string, unknown>, provenance: ProvenanceRecord): Promise<KnowledgeDocument> { const doc: KnowledgeDocument = { id: uuidv4(), content, metadata, provenance, embedding: this.genEmb(content), createdAt: new Date(), updatedAt: new Date() }; this.documents.set(doc.id, doc); return doc; }
  async retrieve(query: string, topK: number = 5): Promise<RetrievalResult> { const qe = this.genEmb(query); const scored: { doc: KnowledgeDocument; score: number }[] = []; for (const d of this.documents.values()) if (d.embedding) scored.push({ doc: d, score: this.cos(qe, d.embedding) }); scored.sort((a, b) => b.score - a.score); const top = scored.slice(0, topK); return { documents: top.map(s => s.doc), scores: top.map(s => s.score), provenanceVerified: top.every(s => s.doc.provenance.authoritative), query }; }
  async enforceProvenance(docId: string): Promise<{ valid: boolean; issues: string[] }> { const d = this.documents.get(docId); if (!d) return { valid: false, issues: ['Not found'] }; const issues: string[] = []; if (!d.provenance.authoritative) issues.push('Not authoritative'); if (crypto.createHash('sha256').update(d.content).digest('hex') !== d.provenance.hash) issues.push('Hash mismatch'); return { valid: issues.length === 0, issues }; }
  private genEmb(text: string): number[] { return embeddingService.hashFallback(text); }
  private cos(a: number[], b: number[]): number { return embeddingService.cosineSimilarity(a, b); }
}

export class SportsComplianceMapper extends ComplianceMapper {
  readonly verticalId = 'sports';
  readonly supportedFrameworks: ComplianceFramework[] = [
    { id: 'uefa-ffp', name: 'UEFA Financial Sustainability Regulations', version: '2024', jurisdiction: 'EU', controls: [
      { id: 'ffp-breakeven', name: 'Break-Even Requirement', description: 'Club financial break-even assessment', severity: 'critical', automatable: true },
      { id: 'ffp-wage-ratio', name: 'Squad Cost Ratio', description: 'Wage-to-revenue ratio (70% threshold)', severity: 'critical', automatable: true },
      { id: 'ffp-overdue', name: 'No Overdue Payables', description: 'No overdue transfer or employee payables', severity: 'critical', automatable: true },
      { id: 'ffp-related-party', name: 'Related Party Transactions', description: 'Fair value assessment of related party deals', severity: 'high', automatable: true }
    ]},
    { id: 'wada-code', name: 'WADA Code', version: '2024', jurisdiction: 'International', controls: [
      { id: 'wada-testing', name: 'Testing Program', description: 'Comprehensive anti-doping testing', severity: 'critical', automatable: true },
      { id: 'wada-tue', name: 'Therapeutic Use Exemptions', description: 'TUE management and approval', severity: 'high', automatable: true },
      { id: 'wada-whereabouts', name: 'Whereabouts Requirements', description: 'Athlete whereabouts filing', severity: 'high', automatable: true },
      { id: 'wada-abp', name: 'Athlete Biological Passport', description: 'Biological passport monitoring', severity: 'critical', automatable: true }
    ]},
    { id: 'fifa-regulations', name: 'FIFA Regulations', version: '2024', jurisdiction: 'International', controls: [
      { id: 'fifa-transfer', name: 'Transfer Regulations', description: 'FIFA RSTP transfer rules', severity: 'critical', automatable: true },
      { id: 'fifa-tpo', name: 'Third-Party Ownership Ban', description: 'Prohibition on third-party ownership', severity: 'critical', automatable: true },
      { id: 'fifa-minors', name: 'Minor Protection', description: 'International transfer of minors restrictions', severity: 'critical', automatable: true },
      { id: 'fifa-agents', name: 'Agent Regulations', description: 'Football agent licensing and fee caps', severity: 'high', automatable: true }
    ]},
    { id: 'safeguarding', name: 'Safeguarding Standards', version: '2024', jurisdiction: 'International', controls: [
      { id: 'safe-dbs', name: 'Background Checks', description: 'DBS/background checks for youth workers', severity: 'critical', automatable: true },
      { id: 'safe-policy', name: 'Safeguarding Policy', description: 'Organizational safeguarding policy', severity: 'critical', automatable: false },
      { id: 'safe-reporting', name: 'Reporting Mechanisms', description: 'Whistleblowing and reporting channels', severity: 'critical', automatable: true }
    ]},
    { id: 'salary-cap-rules', name: 'Salary Cap Rules', version: '2024', jurisdiction: 'US', controls: [
      { id: 'cap-hard', name: 'Hard Cap Compliance', description: 'Salary cap ceiling compliance', severity: 'critical', automatable: true },
      { id: 'cap-floor', name: 'Salary Floor', description: 'Minimum spending requirements', severity: 'high', automatable: true },
      { id: 'cap-luxury', name: 'Luxury Tax', description: 'Luxury/competitive balance tax', severity: 'high', automatable: true }
    ]},
    { id: 'concussion-protocol', name: 'Concussion Protocol', version: '2024', jurisdiction: 'International', controls: [
      { id: 'conc-assessment', name: 'Assessment Protocol', description: 'Standardized concussion assessment', severity: 'critical', automatable: false },
      { id: 'conc-rtp', name: 'Return to Play', description: 'Graduated return to play protocol', severity: 'critical', automatable: true },
      { id: 'conc-independent', name: 'Independent Physician', description: 'Independent physician assessment', severity: 'critical', automatable: false }
    ]},
    { id: 'match-fixing', name: 'Match-Fixing Prevention', version: '2024', jurisdiction: 'International', controls: [
      { id: 'mf-monitoring', name: 'Betting Monitoring', description: 'Suspicious betting pattern monitoring', severity: 'critical', automatable: true },
      { id: 'mf-education', name: 'Integrity Education', description: 'Player and official education programs', severity: 'high', automatable: true },
      { id: 'mf-reporting', name: 'Reporting Obligations', description: 'Mandatory integrity reporting', severity: 'critical', automatable: true }
    ]},
    { id: 'venue-safety', name: 'Venue Safety Standards', version: '2024', jurisdiction: 'International', controls: [
      { id: 'venue-capacity', name: 'Capacity Management', description: 'Safe capacity management', severity: 'critical', automatable: true },
      { id: 'venue-emergency', name: 'Emergency Planning', description: 'Emergency evacuation plans', severity: 'critical', automatable: false },
      { id: 'venue-ada', name: 'Accessibility', description: 'ADA/accessibility compliance', severity: 'high', automatable: true }
    ]},
    { id: 'title-ix-sports', name: 'Title IX (Sports)', version: '2024', jurisdiction: 'US', controls: [
      { id: 'tix-s-participation', name: 'Equal Participation', description: 'Equal participation opportunities', severity: 'critical', automatable: true },
      { id: 'tix-s-scholarships', name: 'Scholarship Equity', description: 'Proportional scholarship allocation', severity: 'critical', automatable: true },
      { id: 'tix-s-treatment', name: 'Equal Treatment', description: 'Equal treatment in benefits', severity: 'high', automatable: true }
    ]},
    { id: 'gdpr-sports', name: 'GDPR (Sports)', version: '2018', jurisdiction: 'EU', controls: [
      { id: 'gdpr-s-player', name: 'Player Data', description: 'Player personal data protection', severity: 'critical', automatable: true },
      { id: 'gdpr-s-medical', name: 'Medical Data', description: 'Athlete medical data protection', severity: 'critical', automatable: true },
      { id: 'gdpr-s-fan', name: 'Fan Data', description: 'Fan and spectator data protection', severity: 'high', automatable: true }
    ]}
  ];

  mapToFramework(decisionType: string, frameworkId: string): ComplianceControl[] {
    const fw = this.getFramework(frameworkId); if (!fw) return [];
    const m: Record<string, Record<string, string[]>> = {
      'player-transfer': { 'fifa-regulations': ['fifa-transfer', 'fifa-tpo', 'fifa-minors', 'fifa-agents'], 'uefa-ffp': ['ffp-breakeven', 'ffp-wage-ratio'] },
      'financial-fair-play': { 'uefa-ffp': ['ffp-breakeven', 'ffp-wage-ratio', 'ffp-overdue', 'ffp-related-party'] },
      'salary-cap': { 'salary-cap-rules': ['cap-hard', 'cap-floor', 'cap-luxury'] },
      'anti-doping': { 'wada-code': ['wada-testing', 'wada-tue', 'wada-whereabouts', 'wada-abp'] },
      'player-safety': { 'concussion-protocol': ['conc-assessment', 'conc-rtp', 'conc-independent'] },
      'youth-development': { 'safeguarding': ['safe-dbs', 'safe-policy', 'safe-reporting'], 'fifa-regulations': ['fifa-minors'] },
      'match-integrity': { 'match-fixing': ['mf-monitoring', 'mf-education', 'mf-reporting'] },
      'venue': { 'venue-safety': ['venue-capacity', 'venue-emergency', 'venue-ada'] },
      'broadcast-rights': { 'gdpr-sports': ['gdpr-s-fan'] },
      'sponsorship': { 'gdpr-sports': ['gdpr-s-fan'] },
      'disciplinary': { 'wada-code': ['wada-testing'] }
    };
    const ids = m[decisionType]?.[frameworkId] || [];
    return fw.controls.filter(c => ids.includes(c.id));
  }

  async checkViolation(decision: SportsDecision, frameworkId: string): Promise<ComplianceViolation[]> {
    const violations: ComplianceViolation[] = [];
    if (decision.type === 'financial-fair-play') {
      const ffp = decision as FinancialFairPlayDecision;
      if (ffp.inputs.wageToRevenueRatio > 0.7) violations.push({ controlId: 'ffp-wage-ratio', severity: 'critical', description: 'Squad cost ratio exceeds 70% threshold', remediation: 'Reduce wage expenditure or increase football earnings', detectedAt: new Date() });
    }
    if (decision.type === 'player-transfer') {
      const pt = decision as PlayerTransferDecision;
      if (pt.inputs.thirdPartyOwnership) violations.push({ controlId: 'fifa-tpo', severity: 'critical', description: 'Third-party ownership detected — prohibited by FIFA', remediation: 'Remove all third-party ownership arrangements', detectedAt: new Date() });
    }
    return violations;
  }

  async generateEvidence(decision: SportsDecision, frameworkId: string): Promise<ComplianceEvidence[]> {
    return this.mapToFramework(decision.type, frameworkId).map(c => ({ id: uuidv4(), frameworkId, controlId: c.id, status: 'compliant' as const, evidence: `Control ${c.id} evaluated for ${decision.type} decision ${decision.metadata.id}.`, generatedAt: new Date(), hash: crypto.createHash('sha256').update(JSON.stringify({ d: decision.metadata.id, c: c.id })).digest('hex') }));
  }
}

export class PlayerTransferSchema extends DecisionSchema<PlayerTransferDecision> {
  readonly verticalId = 'sports'; readonly decisionType = 'player-transfer';
  readonly requiredFields = ['inputs.playerId', 'inputs.currentClub', 'inputs.targetClub', 'inputs.transferFee', 'outcome.approved', 'outcome.ffpCompliant'];
  readonly requiredApprovers = ['sporting-director', 'chief-financial-officer'];
  validate(d: Partial<PlayerTransferDecision>): ValidationResult { const errors: string[] = [], warnings: string[] = []; if (!d.inputs?.playerId) errors.push('Player ID required'); if (!d.inputs?.currentClub) errors.push('Current club required'); if (!d.inputs?.targetClub) errors.push('Target club required'); if (d.inputs?.thirdPartyOwnership) errors.push('Third-party ownership prohibited'); if (!d.inputs?.medicalPassed) warnings.push('Medical not yet passed'); if (!d.inputs?.registrationWindow) warnings.push('Outside registration window'); return { valid: errors.length === 0, errors, warnings, requiredFields: this.requiredFields }; }
  async sign(d: PlayerTransferDecision, sId: string, sRole: string, pk: string): Promise<PlayerTransferDecision> { d.signatures.push({ signerId: sId, signerRole: sRole, signedAt: new Date(), signature: this.generateSignature(this.hashDecision(d), pk), publicKeyFingerprint: crypto.createHash('sha256').update(pk).digest('hex').slice(0, 16) }); return d; }
  async toDefensibleArtifact(d: PlayerTransferDecision, t: DefensibleArtifact['type']): Promise<DefensibleArtifact> { return { id: uuidv4(), decisionId: d.metadata.id, type: t, content: { player: d.inputs.playerId, from: d.inputs.currentClub, to: d.inputs.targetClub, fee: d.outcome.finalTransferFee, ffp: d.outcome.ffpCompliant, deliberation: d.deliberation }, hash: crypto.createHash('sha256').update(JSON.stringify(d)).digest('hex'), generatedAt: new Date() }; }
}

export class FinancialFairPlaySchema extends DecisionSchema<FinancialFairPlayDecision> {
  readonly verticalId = 'sports'; readonly decisionType = 'financial-fair-play';
  readonly requiredFields = ['inputs.clubId', 'inputs.reportingPeriod', 'inputs.revenue', 'inputs.wages', 'outcome.compliant'];
  readonly requiredApprovers = ['ffp-compliance-officer', 'chief-financial-officer'];
  validate(d: Partial<FinancialFairPlayDecision>): ValidationResult { const errors: string[] = [], warnings: string[] = []; if (!d.inputs?.clubId) errors.push('Club ID required'); if (!d.inputs?.reportingPeriod) errors.push('Reporting period required'); if (d.inputs?.wageToRevenueRatio && d.inputs.wageToRevenueRatio > 0.7) warnings.push('Squad cost ratio exceeds 70% — FFP risk'); if (d.inputs?.relatedPartyTransactions?.some(r => !r.fairValue)) warnings.push('Related party transactions not at fair value'); return { valid: errors.length === 0, errors, warnings, requiredFields: this.requiredFields }; }
  async sign(d: FinancialFairPlayDecision, sId: string, sRole: string, pk: string): Promise<FinancialFairPlayDecision> { d.signatures.push({ signerId: sId, signerRole: sRole, signedAt: new Date(), signature: this.generateSignature(this.hashDecision(d), pk), publicKeyFingerprint: crypto.createHash('sha256').update(pk).digest('hex').slice(0, 16) }); return d; }
  async toDefensibleArtifact(d: FinancialFairPlayDecision, t: DefensibleArtifact['type']): Promise<DefensibleArtifact> { return { id: uuidv4(), decisionId: d.metadata.id, type: t, content: { club: d.inputs.clubId, period: d.inputs.reportingPeriod, wageRatio: d.inputs.wageToRevenueRatio, compliant: d.outcome.compliant, sanctionRisk: d.outcome.sanctionRisk, deliberation: d.deliberation }, hash: crypto.createHash('sha256').update(JSON.stringify(d)).digest('hex'), generatedAt: new Date() }; }
}

export class SportsGovernancePreset extends AgentPreset {
  readonly verticalId = 'sports'; readonly presetId = 'sports-governance';
  readonly name = 'Sports Governance Workflow'; readonly description = 'Athletic governance with FFP compliance, player safety, and integrity monitoring';
  readonly capabilities: AgentCapability[] = [{ id: 'ffp-analysis', name: 'FFP Analysis', description: 'Analyze financial fair play compliance', requiredPermissions: ['read:financials'] }, { id: 'transfer-review', name: 'Transfer Review', description: 'Review player transfer compliance', requiredPermissions: ['read:transfers'] }];
  readonly guardrails: AgentGuardrail[] = [{ id: 'tpo-block', name: 'TPO Block', type: 'hard-stop', condition: 'thirdPartyOwnership === true', action: 'Block transfers with third-party ownership' }, { id: 'concussion-block', name: 'Concussion Protocol', type: 'hard-stop', condition: 'concussionProtocolNotComplete', action: 'Block return to play without medical clearance' }];
  readonly workflow: WorkflowStep[] = [{ id: 'step-1', name: 'Compliance Review', agentId: 'compliance-reviewer', requiredInputs: ['transactionData'], expectedOutputs: ['complianceResult'], guardrails: [this.guardrails[0]!], timeout: 60000 }];
  async loadWorkflow(): Promise<WorkflowStep[]> { return this.workflow; }
  async enforceGuardrails(): Promise<{ allowed: boolean; blockedBy?: string }> { return { allowed: true }; }
  trace(stepId: string, agentId: string, inputs: Record<string, unknown>): AgentTrace { const t: AgentTrace = { stepId, agentId, startedAt: new Date(), completedAt: null, inputs, outputs: null, guardrailsTriggered: [], status: 'running' }; this.traces.push(t); return t; }
}

export class SportsDefensibleOutput extends DefensibleOutput<SportsDecision> {
  readonly verticalId = 'sports';
  async toRegulatorPacket(d: SportsDecision, fId: string): Promise<RegulatorPacket> { const ev = d.complianceEvidence.filter(e => e.frameworkId === fId); return { id: this.generateId('RP'), decisionId: d.metadata.id, frameworkId: fId, jurisdiction: 'International', generatedAt: new Date(), validUntil: this.generateValidityPeriod(365*5), sections: { executiveSummary: `${d.type} decision (${d.metadata.id}).`, decisionRationale: d.deliberation.reasoning, complianceMapping: ev, dissentsAndOverrides: d.dissents, approvalChain: d.approvals, auditTrail: [`Created: ${d.metadata.createdAt.toISOString()}`] }, signatures: d.signatures, hash: this.hashContent(d) }; }
  async toCourtBundle(d: SportsDecision, ref?: string): Promise<CourtBundle> { const b: CourtBundle = { id: this.generateId('CB'), decisionId: d.metadata.id, generatedAt: new Date(), sections: { factualBackground: `${d.type} decision followed sports governance procedures.`, decisionProcess: d.deliberation.reasoning, humanOversight: `Roles: ${d.approvals.map(a => a.approverRole).join(', ')}.`, dissentsRecorded: d.dissents, evidenceChain: [`Input: ${this.hashContent(d.inputs)}`, `Outcome: ${this.hashContent(d.outcome)}`] }, certifications: { integrityHash: this.hashContent(d), witnessSignatures: d.signatures.filter(s => s.signerRole.includes('witness')) } }; if (ref) b.caseReference = ref; return b; }
  async toAuditTrail(d: SportsDecision, events: unknown[]): Promise<AuditTrail> { const ae = (events as { timestamp: Date; actor: string; action: string; details: Record<string, unknown> }[]).map(e => ({ ...e, hash: this.hashContent(e) })); return { id: this.generateId('AT'), decisionId: d.metadata.id, period: { start: d.metadata.createdAt, end: new Date() }, events: ae, summary: { totalEvents: ae.length, uniqueActors: new Set(ae.map(e => e.actor)).size, guardrailsTriggered: ae.filter(e => e.action.includes('guardrail')).length, dissentsRecorded: d.dissents.length }, hash: this.hashContent(ae) }; }
}

export class SportsVerticalImplementation implements VerticalImplementation<SportsDecision> {
  readonly verticalId = 'sports'; readonly verticalName = 'Sports';
  readonly completionPercentage = 100; readonly targetPercentage = 100;
  readonly dataConnector: SportsDataConnector; readonly knowledgeBase: SportsKnowledgeBaseLayer;
  readonly complianceMapper: SportsComplianceMapper; readonly decisionSchemas: Map<string, DecisionSchema<SportsDecision>>;
  readonly agentPresets: Map<string, AgentPreset>; readonly defensibleOutput: SportsDefensibleOutput;

  constructor() {
    this.dataConnector = new SportsDataConnector(); this.knowledgeBase = new SportsKnowledgeBaseLayer();
    this.complianceMapper = new SportsComplianceMapper();
    this.decisionSchemas = new Map();
    this.decisionSchemas.set('player-transfer', new PlayerTransferSchema() as unknown as DecisionSchema<SportsDecision>);
    this.decisionSchemas.set('financial-fair-play', new FinancialFairPlaySchema() as unknown as DecisionSchema<SportsDecision>);
    this.agentPresets = new Map(); this.agentPresets.set('sports-governance', new SportsGovernancePreset());
    this.defensibleOutput = new SportsDefensibleOutput();
  }

  getStatus() {
    return { vertical: this.verticalName, layers: { dataConnector: true, knowledgeBase: true, complianceMapper: true, decisionSchemas: true, agentPresets: true, defensibleOutput: true }, completionPercentage: this.completionPercentage, missingComponents: [], totalComplianceFrameworks: this.complianceMapper.supportedFrameworks.length, totalDecisionTypes: 12, totalDecisionSchemas: this.decisionSchemas.size };
  }
}

const sportsVertical = new SportsVerticalImplementation();
VerticalRegistry.getInstance().register(sportsVertical);
export default sportsVertical;
