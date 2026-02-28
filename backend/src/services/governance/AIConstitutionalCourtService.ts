// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * CendiaConstitutionalCourt™ - AI Dispute Resolution with Precedent
 * 
 * Enterprise Platinum Feature: Formal arbitration when agents disagree
 * 
 * Features:
 * - Formal dispute filing between agents
 * - Precedent database with case law
 * - Binding opinions with rationale
 * - Appeal process
 * - Precedent-based resolution
 * - Constitutional principles enforcement
 */

import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';
import { persistServiceRecord, loadServiceRecords } from '../../utils/servicePersistence.js';

// ============================================================================
// TYPES
// ============================================================================

export type DisputeStatus = 
  | 'filed' 
  | 'under_review' 
  | 'hearing_scheduled' 
  | 'deliberating' 
  | 'opinion_drafted' 
  | 'resolved' 
  | 'appealed' 
  | 'appeal_resolved';

export type DisputeCategory =
  | 'confidence_conflict'      // Agents have conflicting high-confidence positions
  | 'methodology_dispute'      // Disagreement on analysis approach
  | 'data_interpretation'      // Different conclusions from same data
  | 'ethical_conflict'         // Competing ethical considerations
  | 'compliance_disagreement'  // Different compliance interpretations
  | 'risk_assessment'          // Conflicting risk evaluations
  | 'recommendation_conflict'; // Competing recommendations

export type PrecedentStrength = 'binding' | 'persuasive' | 'distinguishable' | 'overruled';

export interface ConstitutionalPrinciple {
  id: string;
  name: string;
  description: string;
  category: 'safety' | 'fairness' | 'transparency' | 'accountability' | 'privacy' | 'accuracy';
  weight: number; // 1-10
  adoptedAt: Date;
  amendedAt?: Date;
}

export interface DisputeParty {
  agentId: string;
  agentName: string;
  role: 'petitioner' | 'respondent';
  position: string;
  confidence: number;
  evidence: string[];
  citations: string[];
}

export interface Dispute {
  id: string;
  caseNumber: string;
  title: string;
  category: DisputeCategory;
  status: DisputeStatus;
  
  // Parties
  petitioner: DisputeParty;
  respondent: DisputeParty;
  
  // Context
  deliberationId?: string;
  verticalId?: string;
  organizationId: string;
  
  // Timeline
  filedAt: Date;
  hearingAt?: Date;
  resolvedAt?: Date;
  
  // Resolution
  opinion?: CourtOpinion;
  precedentsApplied: string[]; // Case numbers
  
  // Appeal
  appealFiled?: boolean;
  appealReason?: string;
  appealOpinion?: CourtOpinion;
}

export interface CourtOpinion {
  id: string;
  caseNumber: string;
  title: string;
  
  // Ruling
  ruling: 'petitioner' | 'respondent' | 'partial_petitioner' | 'partial_respondent' | 'remanded';
  summary: string;
  rationale: string;
  
  // Legal reasoning
  principlesApplied: string[];
  precedentsCited: PrecedentCitation[];
  distinguishedCases: string[];
  
  // Implications
  holdings: string[];
  dicta: string[];
  precedentStrength: PrecedentStrength;
  
  // Metadata
  draftedAt: Date;
  finalizedAt?: Date;
  authoringJudge: string;
  concurrences?: JudicialConcurrence[];
  dissents?: JudicialDissent[];
  
  // Integrity
  hash: string;
  signature?: string;
}

export interface PrecedentCitation {
  caseNumber: string;
  title: string;
  holding: string;
  relevance: string;
  strength: PrecedentStrength;
}

export interface JudicialConcurrence {
  judgeId: string;
  judgeName: string;
  rationale: string;
}

export interface JudicialDissent {
  judgeId: string;
  judgeName: string;
  rationale: string;
  alternativeHolding: string;
}

export interface PrecedentSearchResult {
  caseNumber: string;
  title: string;
  category: DisputeCategory;
  holdings: string[];
  relevanceScore: number;
  strength: PrecedentStrength;
  resolvedAt: Date;
}

// ============================================================================
// CONSTITUTIONAL PRINCIPLES
// ============================================================================

export const CONSTITUTIONAL_PRINCIPLES: ConstitutionalPrinciple[] = [
  {
    id: 'principle-safety-first',
    name: 'Safety First',
    description: 'AI decisions must prioritize human safety above all other considerations. No recommendation shall create undue risk to human life or wellbeing.',
    category: 'safety',
    weight: 10,
    adoptedAt: new Date('2024-01-01'),
  },
  {
    id: 'principle-transparency',
    name: 'Transparency Imperative',
    description: 'All AI reasoning must be explainable and auditable. Black-box decisions are constitutionally impermissible.',
    category: 'transparency',
    weight: 9,
    adoptedAt: new Date('2024-01-01'),
  },
  {
    id: 'principle-fairness',
    name: 'Equal Treatment',
    description: 'AI systems shall not discriminate based on protected characteristics. Similar cases must receive similar treatment.',
    category: 'fairness',
    weight: 9,
    adoptedAt: new Date('2024-01-01'),
  },
  {
    id: 'principle-accountability',
    name: 'Clear Accountability',
    description: 'Every AI decision must have a clear chain of responsibility. Liability shall be assignable and traceable.',
    category: 'accountability',
    weight: 8,
    adoptedAt: new Date('2024-01-01'),
  },
  {
    id: 'principle-privacy',
    name: 'Privacy Protection',
    description: 'Personal data shall be minimized and protected. AI decisions must respect data subject rights.',
    category: 'privacy',
    weight: 8,
    adoptedAt: new Date('2024-01-01'),
  },
  {
    id: 'principle-accuracy',
    name: 'Accuracy Requirement',
    description: 'AI outputs must be factually grounded. Speculation must be clearly labeled. Hallucination is impermissible.',
    category: 'accuracy',
    weight: 9,
    adoptedAt: new Date('2024-01-01'),
  },
  {
    id: 'principle-human-oversight',
    name: 'Human Oversight',
    description: 'High-stakes decisions require human review. AI shall recommend, humans shall decide on matters of significant consequence.',
    category: 'accountability',
    weight: 9,
    adoptedAt: new Date('2024-01-01'),
  },
  {
    id: 'principle-proportionality',
    name: 'Proportionality',
    description: 'AI interventions must be proportionate to the problem. Minimal necessary action is preferred.',
    category: 'fairness',
    weight: 7,
    adoptedAt: new Date('2024-01-01'),
  },
];

// ============================================================================
// SERVICE CLASS
// ============================================================================

export class AIConstitutionalCourtService {
  private disputes: Map<string, Dispute> = new Map();
  private opinions: Map<string, CourtOpinion> = new Map();
  private caseCounter = 1000;

  constructor() {
    this.initFromDb().catch(() => {
      logger.warn('[CendiaCourt] DB not available, using in-memory only');
    });
    logger.info('[CendiaCourt] AI Constitutional Court initialized with Prisma persistence');


    this.loadFromDB().catch(() => {});
  }

  private async initFromDb(): Promise<void> {
    try {
      const dbDisputes = await prisma.constitutional_disputes.findMany({ orderBy: { filed_at: 'desc' } });
      for (const row of dbDisputes) {
        const dispute = (row.data || row) as unknown as Dispute;
        this.disputes.set(row.id, dispute);
        if (dispute.opinion) {
          this.opinions.set(dispute.opinion.id, dispute.opinion);
        }
        // Track case counter
        const num = parseInt(row.case_number.split('-').pop() || '0');
        if (num > this.caseCounter) this.caseCounter = num;
      }
      if (dbDisputes.length > 0) {
        logger.info(`[CendiaCourt] Loaded ${dbDisputes.length} disputes from database`);
      }
    } catch { /* DB not available */ }
  }

  /**
   * File a new dispute
   */
  async fileDispute(params: {
    title: string;
    category: DisputeCategory;
    petitioner: Omit<DisputeParty, 'role'>;
    respondent: Omit<DisputeParty, 'role'>;
    deliberationId?: string;
    verticalId?: string;
    organizationId: string;
  }): Promise<Dispute> {
    const id = uuidv4();
    const caseNumber = this.generateCaseNumber();

    const dispute: Dispute = {
      id,
      caseNumber,
      title: params.title,
      category: params.category,
      status: 'filed',
      petitioner: { ...params.petitioner, role: 'petitioner' },
      respondent: { ...params.respondent, role: 'respondent' },
      deliberationId: params.deliberationId,
      verticalId: params.verticalId,
      organizationId: params.organizationId,
      filedAt: new Date(),
      precedentsApplied: [],
    };

    this.disputes.set(id, dispute);

    // Persist to database
    try {
      await prisma.constitutional_disputes.create({
        data: {
          id,
          case_number: caseNumber,
          title: params.title,
          category: params.category,
          status: 'filed',
          petitioner: dispute.petitioner as any,
          respondent: dispute.respondent as any,
          deliberation_id: params.deliberationId,
          vertical_id: params.verticalId,
          organization_id: params.organizationId,
          data: dispute as any,
          filed_at: dispute.filedAt,
        },
      });
    } catch (error) {
      logger.warn('Could not persist dispute to database', { error });
    }

    logger.info(`Dispute filed: ${caseNumber} - ${params.title}`);
    return dispute;
  }

  /**
   * Search for relevant precedents
   */
  async searchPrecedents(params: {
    category?: DisputeCategory;
    keywords?: string[];
    limit?: number;
  }): Promise<PrecedentSearchResult[]> {
    const results: PrecedentSearchResult[] = [];
    const limit = params.limit || 10;

    // Search through resolved disputes
    for (const dispute of this.disputes.values()) {
      if (dispute.status !== 'resolved' && dispute.status !== 'appeal_resolved') continue;
      if (params.category && dispute.category !== params.category) continue;
      if (!dispute.opinion) continue;

      let relevanceScore = 0.5;

      // Boost for same category
      if (params.category === dispute.category) {
        relevanceScore += 0.3;
      }

      // Boost for keyword matches
      if (params.keywords) {
        const textToSearch = `${dispute.title} ${dispute.opinion.summary} ${dispute.opinion.holdings.join(' ')}`.toLowerCase();
        for (const keyword of params.keywords) {
          if (textToSearch.includes(keyword.toLowerCase())) {
            relevanceScore += 0.1;
          }
        }
      }

      results.push({
        caseNumber: dispute.caseNumber,
        title: dispute.title,
        category: dispute.category,
        holdings: dispute.opinion.holdings,
        relevanceScore: Math.min(relevanceScore, 1),
        strength: dispute.opinion.precedentStrength,
        resolvedAt: dispute.resolvedAt!,
      });
    }

    // Sort by relevance and return top results
    return results
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limit);
  }

  /**
   * Schedule a hearing
   */
  async scheduleHearing(disputeId: string, hearingDate: Date): Promise<Dispute> {
    const dispute = this.disputes.get(disputeId);
    if (!dispute) throw new Error('Dispute not found');

    dispute.status = 'hearing_scheduled';
    dispute.hearingAt = hearingDate;

    try {
      await prisma.constitutional_disputes.update({
        where: { id: disputeId },
        data: {
          status: 'hearing_scheduled',
          hearing_at: hearingDate,
          data: dispute as any,
        },
      });
    } catch (error) {
      logger.warn('Could not update dispute in database', { error });
    }

    return dispute;
  }

  /**
   * Begin deliberation on a dispute
   */
  async beginDeliberation(disputeId: string): Promise<Dispute> {
    const dispute = this.disputes.get(disputeId);
    if (!dispute) throw new Error('Dispute not found');

    dispute.status = 'deliberating';

    // Find relevant precedents
    const precedents = await this.searchPrecedents({
      category: dispute.category,
      keywords: dispute.title.split(' '),
      limit: 5,
    });

    dispute.precedentsApplied = precedents.map(p => p.caseNumber);

    return dispute;
  }

  /**
   * Draft an opinion
   */
  async draftOpinion(params: {
    disputeId: string;
    ruling: CourtOpinion['ruling'];
    summary: string;
    rationale: string;
    holdings: string[];
    principlesApplied: string[];
    authoringJudge: string;
    precedentsCited?: PrecedentCitation[];
    dissents?: JudicialDissent[];
  }): Promise<CourtOpinion> {
    const dispute = this.disputes.get(params.disputeId);
    if (!dispute) throw new Error('Dispute not found');

    const opinionId = uuidv4();
    const content = JSON.stringify({
      disputeId: params.disputeId,
      ruling: params.ruling,
      summary: params.summary,
      rationale: params.rationale,
      holdings: params.holdings,
    });

    const opinion: CourtOpinion = {
      id: opinionId,
      caseNumber: dispute.caseNumber,
      title: `Opinion in ${dispute.title}`,
      ruling: params.ruling,
      summary: params.summary,
      rationale: params.rationale,
      principlesApplied: params.principlesApplied,
      precedentsCited: params.precedentsCited || [],
      distinguishedCases: [],
      holdings: params.holdings,
      dicta: [],
      precedentStrength: 'binding',
      draftedAt: new Date(),
      authoringJudge: params.authoringJudge,
      dissents: params.dissents,
      hash: crypto.createHash('sha256').update(content).digest('hex'),
    };

    dispute.status = 'opinion_drafted';
    dispute.opinion = opinion;
    this.opinions.set(opinionId, opinion);

    return opinion;
  }

  /**
   * Finalize and resolve a dispute
   */
  async resolveDispute(disputeId: string): Promise<Dispute> {
    const dispute = this.disputes.get(disputeId);
    if (!dispute) throw new Error('Dispute not found');
    if (!dispute.opinion) throw new Error('No opinion drafted');

    dispute.status = 'resolved';
    dispute.resolvedAt = new Date();
    dispute.opinion.finalizedAt = new Date();

    // Sign the opinion
    const signatureContent = `${dispute.opinion.hash}:${dispute.opinion.finalizedAt.toISOString()}`;
    dispute.opinion.signature = crypto
      .createHash('sha256')
      .update(signatureContent)
      .digest('hex');

    try {
      await prisma.constitutional_disputes.update({
        where: { id: disputeId },
        data: {
          status: 'resolved',
          resolved_at: dispute.resolvedAt,
          data: dispute as any,
        },
      });

      // Store opinion as precedent
      await prisma.constitutional_opinions.create({
        data: {
          id: dispute.opinion.id,
          dispute_id: disputeId,
          case_number: dispute.caseNumber,
          title: dispute.opinion.title,
          ruling: dispute.opinion.ruling,
          summary: dispute.opinion.summary,
          rationale: dispute.opinion.rationale,
          holdings: dispute.opinion.holdings,
          principles_applied: dispute.opinion.principlesApplied,
          precedent_strength: dispute.opinion.precedentStrength,
          authoring_judge: dispute.opinion.authoringJudge,
          opinion_hash: dispute.opinion.hash,
          data: dispute.opinion as any,
          drafted_at: dispute.opinion.draftedAt,
          finalized_at: dispute.opinion.finalizedAt,
        },
      });
    } catch (error) {
      logger.warn('Could not persist resolution to database', { error });
    }

    logger.info(`Dispute resolved: ${dispute.caseNumber}`);
    return dispute;
  }

  /**
   * File an appeal
   */
  async fileAppeal(disputeId: string, reason: string): Promise<Dispute> {
    const dispute = this.disputes.get(disputeId);
    if (!dispute) throw new Error('Dispute not found');
    if (dispute.status !== 'resolved') throw new Error('Can only appeal resolved disputes');

    dispute.status = 'appealed';
    dispute.appealFiled = true;
    dispute.appealReason = reason;

    return dispute;
  }

  /**
   * Get dispute by ID
   */
  getDispute(id: string): Dispute | undefined {
    return this.disputes.get(id);
  }

  /**
   * Get dispute by case number
   */
  getDisputeByCaseNumber(caseNumber: string): Dispute | undefined {
    for (const dispute of this.disputes.values()) {
      if (dispute.caseNumber === caseNumber) {
        return dispute;
      }
    }
    return undefined;
  }

  /**
   * Get all disputes for an organization
   */
  getDisputesByOrganization(organizationId: string): Dispute[] {
    return Array.from(this.disputes.values())
      .filter(d => d.organizationId === organizationId)
      .sort((a, b) => b.filedAt.getTime() - a.filedAt.getTime());
  }

  /**
   * Get constitutional principles
   */
  getPrinciples(): ConstitutionalPrinciple[] {
    return CONSTITUTIONAL_PRINCIPLES;
  }

  /**
   * Get court statistics
   */
  getStatistics(): {
    totalDisputes: number;
    resolved: number;
    pending: number;
    appealed: number;
    byCategory: Record<DisputeCategory, number>;
    avgResolutionDays: number;
  } {
    const disputes = Array.from(this.disputes.values());
    const resolved = disputes.filter(d => d.status === 'resolved' || d.status === 'appeal_resolved');
    
    const byCategory: Record<DisputeCategory, number> = {
      confidence_conflict: 0,
      methodology_dispute: 0,
      data_interpretation: 0,
      ethical_conflict: 0,
      compliance_disagreement: 0,
      risk_assessment: 0,
      recommendation_conflict: 0,
    };

    for (const dispute of disputes) {
      byCategory[dispute.category]++;
    }

    let totalDays = 0;
    for (const d of resolved) {
      if (d.resolvedAt && d.filedAt) {
        totalDays += (d.resolvedAt.getTime() - d.filedAt.getTime()) / (1000 * 60 * 60 * 24);
      }
    }

    return {
      totalDisputes: disputes.length,
      resolved: resolved.length,
      pending: disputes.filter(d => !['resolved', 'appeal_resolved'].includes(d.status)).length,
      appealed: disputes.filter(d => d.appealFiled).length,
      byCategory,
      avgResolutionDays: resolved.length > 0 ? totalDays / resolved.length : 0,
    };
  }

  /**
   * Generate case number
   */
  private generateCaseNumber(): string {
    const year = new Date().getFullYear();
    const number = ++this.caseCounter;
    return `${year}-AICC-${number.toString().padStart(5, '0')}`;
  }



  async loadFromDB(): Promise<void> {


    try {


      let restored = 0;


      const recs = await loadServiceRecords({ serviceName: 'AIConstitutionalCourt', recordType: 'record', limit: 1000 });


      for (const rec of recs) {


        const d = rec.data as any;


        if (d?.id && !this.disputes.has(d.id)) this.disputes.set(d.id, d);


      }


      restored += recs.length;


      const recs_1 = await loadServiceRecords({ serviceName: 'AIConstitutionalCourt', recordType: 'record', limit: 1000 });


      for (const rec of recs_1) {


        const d = rec.data as any;


        if (d?.id && !this.opinions.has(d.id)) this.opinions.set(d.id, d);


      }


      restored += recs_1.length;


      if (restored > 0) logger.info(`[AIConstitutionalCourtService] Restored ${restored} records from database`);


    } catch (err) {


      logger.warn(`[AIConstitutionalCourtService] DB reload skipped: ${(err as Error).message}`);


    }


  }
}

export const aiConstitutionalCourtService = new AIConstitutionalCourtService();
