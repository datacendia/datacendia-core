/**
 * Feature — Ghost Board
 *
 * Feature module implementing a specific platform capability.
 *
 * @exports GhostBoardService, ghostBoardService, GhostBoardRequest, BoardMember, BoardQuestion, GhostBoardResult, TranscriptEntry, BoardType
 * @module features/holy-shit/GhostBoard
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA PLATFORM - GHOST BOARD FEATURE
// AI-powered board meeting simulation for executive preparation
// =============================================================================

import { BaseService, ServiceConfig, ServiceHealth } from '../../core/services/BaseService.js';
import { eventBus } from '../../core/events/EventBus.js';
import { featureGating, SubscriptionTier } from '../../core/subscriptions/SubscriptionTiers.js';
import { getErrorMessage } from '../../utils/errors.js';
import { deterministicFloat, deterministicInt, deterministicPercentage, deterministicPick } from '../../utils/deterministic.js';

// =============================================================================
// TYPES
// =============================================================================

export interface GhostBoardRequest {
  organizationId: string;
  userId: string;
  proposalTitle: string;
  proposalContent: string;
  boardType?: BoardType;
  difficulty?: 'easy' | 'medium' | 'hard' | 'brutal';
  focusAreas?: string[];
  existingAnswers?: Record<string, string>;
  tier: SubscriptionTier;
}

export type BoardType = 
  | 'standard'
  | 'vc_backed'
  | 'public_company'
  | 'private_equity'
  | 'family_office'
  | 'non_profit';

export interface BoardMember {
  id: string;
  name: string;
  role: string;
  persona: BoardPersona;
  icon: string;
  typicalChallenges: string[];
  priorities: string[];
  communicationStyle: string;
}

export type BoardPersona = 
  | 'skeptical_vc'
  | 'risk_averse_independent'
  | 'growth_obsessed'
  | 'industry_expert'
  | 'financial_hawk'
  | 'operations_focused'
  | 'governance_stickler'
  | 'tech_visionary';

export interface BoardQuestion {
  id: string;
  rank: number;
  question: string;
  askedBy: BoardMember;
  category: QuestionCategory;
  difficulty: 'easy' | 'medium' | 'hard' | 'brutal';
  suggestedAnswer: string;
  answerStrength?: 'weak' | 'adequate' | 'strong';
  answerWarning?: string;
  followUpQuestions: string[];
  dataPointsNeeded: string[];
  commonMistakes: string[];
}

export type QuestionCategory = 
  | 'financial'
  | 'strategic'
  | 'operational'
  | 'market'
  | 'risk'
  | 'governance'
  | 'technical'
  | 'competitive'
  | 'team';

export interface GhostBoardResult {
  id: string;
  proposalTitle: string;
  sessionDate: Date;
  duration: number; // minutes
  difficulty: string;
  boardMembers: BoardMember[];
  questions: BoardQuestion[];
  preparednessScore: number; // 0-100
  keyGaps: string[];
  strengthAreas: string[];
  overallAssessment: string;
  recommendedPrepTime: string;
  criticalQuestions: BoardQuestion[];
  sessionTranscript: TranscriptEntry[];
}

export interface TranscriptEntry {
  timestamp: number; // seconds into session
  speaker: string;
  speakerRole: string;
  content: string;
  type: 'question' | 'answer' | 'followup' | 'challenge' | 'clarification';
}

// =============================================================================
// BOARD MEMBER DEFINITIONS
// =============================================================================

const BOARD_MEMBERS: Record<BoardPersona, BoardMember> = {
  skeptical_vc: {
    id: 'skeptical_vc',
    name: 'Victoria Chen',
    role: 'Lead Investor (Series B)',
    persona: 'skeptical_vc',
    icon: '??',
    typicalChallenges: [
      "What's the exit multiple?",
      "How does this affect our runway?",
      "Show me the unit economics.",
      "What's the path to profitability?",
    ],
    priorities: ['ROI', 'growth rate', 'market size', 'exit potential'],
    communicationStyle: 'Direct, numbers-focused, skeptical of optimistic projections',
  },
  risk_averse_independent: {
    id: 'risk_averse_independent',
    name: 'Robert Martinez',
    role: 'Independent Director',
    persona: 'risk_averse_independent',
    icon: '???',
    typicalChallenges: [
      "What's our liability exposure?",
      "Have legal reviewed this?",
      "What are the regulatory implications?",
      "Who's accountable if this fails?",
    ],
    priorities: ['risk mitigation', 'compliance', 'governance', 'liability'],
    communicationStyle: 'Cautious, thorough, focused on downside protection',
  },
  growth_obsessed: {
    id: 'growth_obsessed',
    name: 'Sarah Kim',
    role: 'Growth Advisor',
    persona: 'growth_obsessed',
    icon: '??',
    typicalChallenges: [
      "Why isn't this bigger?",
      "How do we 10x this?",
      "What's stopping us from moving faster?",
      "Where's the hockey stick?",
    ],
    priorities: ['scale', 'market capture', 'speed', 'competitive advantage'],
    communicationStyle: 'Ambitious, impatient with incremental thinking',
  },
  industry_expert: {
    id: 'industry_expert',
    name: 'Dr. James Thompson',
    role: 'Industry Expert Director',
    persona: 'industry_expert',
    icon: '??',
    typicalChallenges: [
      "Our competitors tried this in 2019...",
      "The industry is moving toward...",
      "Have you considered the regulatory changes coming?",
      "The technical approach seems outdated.",
    ],
    priorities: ['industry trends', 'technical viability', 'competitive landscape'],
    communicationStyle: 'Knowledgeable, references history, warns about pitfalls',
  },
  financial_hawk: {
    id: 'financial_hawk',
    name: 'Margaret O\'Brien',
    role: 'Audit Committee Chair',
    persona: 'financial_hawk',
    icon: '??',
    typicalChallenges: [
      "Walk me through the assumptions.",
      "What happens if revenue is 30% lower?",
      "Where are the cash flow projections?",
      "This doesn't reconcile with last quarter's forecast.",
    ],
    priorities: ['financial accuracy', 'cash management', 'forecast reliability'],
    communicationStyle: 'Meticulous, demands specifics, catches inconsistencies',
  },
  operations_focused: {
    id: 'operations_focused',
    name: 'Michael Park',
    role: 'Operations Advisor',
    persona: 'operations_focused',
    icon: '??',
    typicalChallenges: [
      "Do we have the capacity?",
      "Who's going to execute this?",
      "What's the implementation timeline?",
      "Have you stress-tested the operations?",
    ],
    priorities: ['execution feasibility', 'resource allocation', 'timeline reality'],
    communicationStyle: 'Practical, focused on how things actually get done',
  },
  governance_stickler: {
    id: 'governance_stickler',
    name: 'Eleanor Wright',
    role: 'Governance Committee Chair',
    persona: 'governance_stickler',
    icon: '??',
    typicalChallenges: [
      "Does this require shareholder approval?",
      "What's the conflict of interest analysis?",
      "Have we documented the decision process?",
      "Is this within management's authority?",
    ],
    priorities: ['proper process', 'documentation', 'fiduciary duty', 'transparency'],
    communicationStyle: 'Procedural, ensures proper governance is followed',
  },
  tech_visionary: {
    id: 'tech_visionary',
    name: 'Alex Nakamoto',
    role: 'Technology Advisor',
    persona: 'tech_visionary',
    icon: '??',
    typicalChallenges: [
      "Is this future-proof?",
      "What about AI/automation disruption?",
      "Why build when you could buy?",
      "What's the technical debt implication?",
    ],
    priorities: ['innovation', 'technical excellence', 'future-proofing', 'scalability'],
    communicationStyle: 'Forward-thinking, challenges conventional approaches',
  },
};

// =============================================================================
// GHOST BOARD SERVICE
// =============================================================================

export class GhostBoardService extends BaseService {
  private ollamaEndpoint: string;
  private sessionHistory: Map<string, GhostBoardResult[]> = new Map();

  constructor(config?: Partial<ServiceConfig>) {
    super({
      name: 'ghost-board',
      version: '1.0.0',
      dependencies: ['council'],
      ...config,
    });
    this.ollamaEndpoint = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434';
  }

  async initialize(): Promise<void> {
    this.logger.info('Ghost Board service initializing...');
  }

  async shutdown(): Promise<void> {
    this.logger.info('Ghost Board service shutting down...');
  }

  async healthCheck(): Promise<ServiceHealth> {
    return {
      status: 'healthy',
      lastCheck: new Date(),
      details: { boardMembers: Object.keys(BOARD_MEMBERS).length },
    };
  }

  // ---------------------------------------------------------------------------
  // FEATURE ACCESS CHECK
  // ---------------------------------------------------------------------------

  checkAccess(tier: SubscriptionTier, organizationId: string): { allowed: boolean; reason?: string } {
    if (!featureGating.hasFeature(tier, 'ghostBoard')) {
      return {
        allowed: false,
        reason: `Ghost Board requires ${featureGating.getUpgradeTierForFeature('ghostBoard')} tier or higher.`,
      };
    }
    return { allowed: true };
  }

  // ---------------------------------------------------------------------------
  // MAIN SESSION FUNCTION
  // ---------------------------------------------------------------------------

  async runSession(request: GhostBoardRequest): Promise<GhostBoardResult> {
    const startTime = Date.now();

    // Check feature access
    const access = this.checkAccess(request.tier, request.organizationId);
    if (!access.allowed) {
      throw new Error(access.reason);
    }

    // Check usage limits
    const currentUsage = this.getMonthlyUsage(request.organizationId);
    if (!featureGating.isWithinLimit(request.tier, 'ghostBoardSessionsPerMonth', currentUsage)) {
      throw new Error('Monthly Ghost Board session limit reached. Please upgrade your plan.');
    }

    this.logger.info(`Starting Ghost Board session for: ${request.proposalTitle}`);

    const difficulty = request.difficulty || 'hard';
    const boardType = request.boardType || 'standard';

    // Select board members based on board type and difficulty
    const boardMembers = this.selectBoardMembers(boardType, difficulty);

    // Generate questions from each board member
    const questions = await this.generateBoardQuestions(
      request,
      boardMembers,
      difficulty
    );

    // Assess answers if provided
    const assessedQuestions = request.existingAnswers
      ? await this.assessAnswers(questions, request.existingAnswers)
      : questions;

    // Calculate preparedness score
    const preparednessScore = this.calculatePreparednessScore(
      assessedQuestions,
      request.existingAnswers
    );

    // Identify gaps and strengths
    const { gaps, strengths } = this.identifyGapsAndStrengths(assessedQuestions);

    // Generate session transcript simulation
    const transcript = this.generateTranscript(boardMembers, assessedQuestions);

    // Critical questions (hardest ones)
    const criticalQuestions = assessedQuestions
      .filter(q => q.difficulty === 'brutal' || q.difficulty === 'hard')
      .slice(0, 5);

    const sessionDuration = Math.round((Date.now() - startTime) / 1000 / 60);

    const result: GhostBoardResult = {
      id: `gb-${Date.now()}-${crypto.randomUUID().slice(0, 9)}`,
      proposalTitle: request.proposalTitle,
      sessionDate: new Date(),
      duration: Math.max(45, sessionDuration), // Minimum 45 min simulated
      difficulty,
      boardMembers,
      questions: assessedQuestions,
      preparednessScore,
      keyGaps: gaps,
      strengthAreas: strengths,
      overallAssessment: this.generateAssessment(preparednessScore, gaps),
      recommendedPrepTime: this.recommendPrepTime(preparednessScore),
      criticalQuestions,
      sessionTranscript: transcript,
    };

    // Store session
    this.storeSession(request.organizationId, result);

    this.recordMetric('session_duration_ms', Date.now() - startTime);
    this.incrementCounter('sessions_completed', 1);

    return result;
  }

  // ---------------------------------------------------------------------------
  // BOARD MEMBER SELECTION
  // ---------------------------------------------------------------------------

  private selectBoardMembers(boardType: BoardType, difficulty: string): BoardMember[] {
    const memberConfigs: Record<BoardType, BoardPersona[]> = {
      standard: ['skeptical_vc', 'risk_averse_independent', 'growth_obsessed', 'industry_expert'],
      vc_backed: ['skeptical_vc', 'growth_obsessed', 'financial_hawk', 'tech_visionary'],
      public_company: ['financial_hawk', 'governance_stickler', 'risk_averse_independent', 'industry_expert'],
      private_equity: ['financial_hawk', 'operations_focused', 'growth_obsessed', 'risk_averse_independent'],
      family_office: ['risk_averse_independent', 'governance_stickler', 'industry_expert', 'operations_focused'],
      non_profit: ['governance_stickler', 'risk_averse_independent', 'operations_focused', 'industry_expert'],
    };

    const personas = memberConfigs[boardType] || memberConfigs.standard;
    
    // Add more members for harder difficulties
    if (difficulty === 'brutal') {
      personas.push('financial_hawk', 'governance_stickler');
    } else if (difficulty === 'hard') {
      personas.push('financial_hawk');
    }

    return [...new Set(personas)].map(p => BOARD_MEMBERS[p]);
  }

  // ---------------------------------------------------------------------------
  // QUESTION GENERATION
  // ---------------------------------------------------------------------------

  private async generateBoardQuestions(
    request: GhostBoardRequest,
    boardMembers: BoardMember[],
    difficulty: string
  ): Promise<BoardQuestion[]> {
    const allQuestions: BoardQuestion[] = [];
    let rank = 1;

    for (const member of boardMembers) {
      const questions = await this.generateMemberQuestions(
        request,
        member,
        difficulty,
        rank
      );
      allQuestions.push(...questions);
      rank += questions.length;
    }

    // Sort by difficulty and strategic importance
    return allQuestions.sort((a, b) => {
      const diffOrder = { brutal: 0, hard: 1, medium: 2, easy: 3 };
      return diffOrder[a.difficulty] - diffOrder[b.difficulty];
    }).map((q, idx) => ({ ...q, rank: idx + 1 }));
  }

  private async generateMemberQuestions(
    request: GhostBoardRequest,
    member: BoardMember,
    difficulty: string,
    startRank: number
  ): Promise<BoardQuestion[]> {
    const numQuestions = difficulty === 'brutal' ? 4 : difficulty === 'hard' ? 3 : 2;

    const prompt = `You are ${member.name}, ${member.role}, with the persona of a ${member.persona.replace('_', ' ')}.

Your priorities: ${member.priorities.join(', ')}
Your communication style: ${member.communicationStyle}

PROPOSAL TO REVIEW:
Title: ${request.proposalTitle}
Content: ${request.proposalContent}

${request.focusAreas?.length ? `Focus Areas: ${request.focusAreas.join(', ')}` : ''}

Generate ${numQuestions} challenging questions you would ask about this proposal.
Difficulty level: ${difficulty}

Return in JSON format:
{
  "questions": [
    {
      "question": "The exact question you would ask",
      "category": "financial|strategic|operational|market|risk|governance|technical|competitive|team",
      "difficulty": "easy|medium|hard|brutal",
      "suggestedAnswer": "A strong answer to this question",
      "followUpQuestions": ["Potential follow-up questions"],
      "dataPointsNeeded": ["Data needed to answer well"],
      "commonMistakes": ["Common mistakes when answering"]
    }
  ]
}`;

    try {
      const response = await fetch(`${this.ollamaEndpoint}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3.2:latest',
          prompt,
          stream: false,
          format: 'json',
        }),
      });

      const data = await response.json() as { response: string };
      const parsed = JSON.parse(data.response);

      return (parsed.questions || []).map((q: any, idx: number) => ({
        id: `q-${Date.now()}-${member.id}-${idx}`,
        rank: startRank + idx,
        question: q.question || '',
        askedBy: member,
        category: q.category || 'strategic',
        difficulty: q.difficulty || difficulty,
        suggestedAnswer: q.suggestedAnswer || '',
        followUpQuestions: q.followUpQuestions || [],
        dataPointsNeeded: q.dataPointsNeeded || [],
        commonMistakes: q.commonMistakes || [],
      }));
    } catch (error: unknown) {
      this.logger.error(`Failed to generate questions for ${member.name}: ${error instanceof Error ? getErrorMessage(error) : 'Unknown error'}`);
      // Return default questions based on member's typical challenges
      return member.typicalChallenges.slice(0, 2).map((challenge, idx) => ({
        id: `q-${Date.now()}-${member.id}-${idx}`,
        rank: startRank + idx,
        question: challenge,
        askedBy: member,
        category: 'strategic' as QuestionCategory,
        difficulty: difficulty as 'easy' | 'medium' | 'hard' | 'brutal',
        suggestedAnswer: 'Prepare a data-driven response addressing this concern.',
        followUpQuestions: [],
        dataPointsNeeded: [],
        commonMistakes: [],
      }));
    }
  }

  // ---------------------------------------------------------------------------
  // ANSWER ASSESSMENT
  // ---------------------------------------------------------------------------

  private async assessAnswers(
    questions: BoardQuestion[],
    answers: Record<string, string>
  ): Promise<BoardQuestion[]> {
    return questions.map(q => {
      const answer = answers[q.id];
      if (!answer) return q;

      // Simple assessment logic - could be enhanced with AI
      const answerLength = answer.length;
      let strength: 'weak' | 'adequate' | 'strong' = 'adequate';
      let warning: string | undefined;

      if (answerLength < 50) {
        strength = 'weak';
        warning = 'Answer is too brief. Board members expect detailed responses.';
      } else if (answerLength < 150) {
        strength = 'adequate';
      } else if (answerLength >= 150 && answer.includes('data') || answer.includes('%') || answer.includes('$')) {
        strength = 'strong';
      }

      return {
        ...q,
        answerStrength: strength,
        answerWarning: warning,
      };
    });
  }

  // ---------------------------------------------------------------------------
  // SCORING & ANALYSIS
  // ---------------------------------------------------------------------------

  private calculatePreparednessScore(
    questions: BoardQuestion[],
    answers?: Record<string, string>
  ): number {
    if (!answers || Object.keys(answers).length === 0) {
      return 0; // No answers provided yet
    }

    const answeredQuestions = questions.filter(q => answers[q.id]);
    const answerRate = answeredQuestions.length / questions.length;

    const strengthScores = {
      strong: 1,
      adequate: 0.7,
      weak: 0.3,
    };

    const avgStrength = answeredQuestions.reduce((sum, q) => {
      return sum + (strengthScores[q.answerStrength || 'adequate']);
    }, 0) / (answeredQuestions.length || 1);

    return Math.round(answerRate * avgStrength * 100);
  }

  private identifyGapsAndStrengths(questions: BoardQuestion[]): { 
    gaps: string[]; 
    strengths: string[]; 
  } {
    const gaps: string[] = [];
    const strengths: string[] = [];

    const categoryGroups = questions.reduce((acc, q) => {
      if (!acc[q.category]) acc[q.category] = [];
      acc[q.category].push(q);
      return acc;
    }, {} as Record<string, BoardQuestion[]>);

    for (const [category, qs] of Object.entries(categoryGroups)) {
      const weakCount = qs.filter(q => q.answerStrength === 'weak').length;
      const strongCount = qs.filter(q => q.answerStrength === 'strong').length;

      if (weakCount > strongCount) {
        gaps.push(`${category.charAt(0).toUpperCase() + category.slice(1)} questions need stronger answers`);
      } else if (strongCount > weakCount && strongCount > 0) {
        strengths.push(`Strong preparation in ${category} area`);
      }
    }

    // Add specific gaps for unanswered hard questions
    const unansweredHard = questions.filter(
      q => (q.difficulty === 'hard' || q.difficulty === 'brutal') && !q.answerStrength
    );
    if (unansweredHard.length > 0) {
      gaps.push(`${unansweredHard.length} critical questions still need answers`);
    }

    return { 
      gaps: gaps.length > 0 ? gaps : ['Complete the session to identify gaps'],
      strengths: strengths.length > 0 ? strengths : ['Continue answering to build strengths'],
    };
  }

  private generateAssessment(score: number, gaps: string[]): string {
    if (score >= 80) {
      return 'Excellent preparation. You are ready for this board meeting. Focus on polishing your delivery.';
    } else if (score >= 60) {
      return `Good foundation, but gaps remain: ${gaps[0]}. Schedule additional prep time.`;
    } else if (score >= 40) {
      return 'Significant preparation needed. Multiple areas require stronger answers and supporting data.';
    } else if (score > 0) {
      return 'Not ready for the board meeting. Recommend postponing until preparation is complete.';
    }
    return 'Session started. Answer the questions to assess your preparedness.';
  }

  private recommendPrepTime(score: number): string {
    if (score >= 80) return '1-2 hours for final polish';
    if (score >= 60) return '4-6 hours of focused preparation';
    if (score >= 40) return '1-2 days of intensive preparation';
    if (score > 0) return '3-5 days minimum, consider rescheduling';
    return 'Complete the session first';
  }

  // ---------------------------------------------------------------------------
  // TRANSCRIPT GENERATION
  // ---------------------------------------------------------------------------

  private generateTranscript(
    boardMembers: BoardMember[],
    questions: BoardQuestion[]
  ): TranscriptEntry[] {
    const transcript: TranscriptEntry[] = [];
    let timestamp = 0;

    // Opening
    transcript.push({
      timestamp: 0,
      speaker: 'Chair',
      speakerRole: 'Board Chair',
      content: "Let's begin. Management has prepared a proposal for our consideration. I'll open the floor for questions.",
      type: 'clarification',
    });
    timestamp += 30;

    // Questions and simulated exchanges
    for (const question of questions.slice(0, 12)) {
      transcript.push({
        timestamp,
        speaker: question.askedBy.name,
        speakerRole: question.askedBy.role,
        content: question.question,
        type: 'question',
      });
      timestamp += 60;

      if (question.answerStrength === 'weak') {
        transcript.push({
          timestamp,
          speaker: question.askedBy.name,
          speakerRole: question.askedBy.role,
          content: "I'm not satisfied with that response. Can you be more specific?",
          type: 'challenge',
        });
        timestamp += 45;
      }

      if (question.followUpQuestions.length > 0) {
        transcript.push({
          timestamp,
          speaker: question.askedBy.name,
          speakerRole: question.askedBy.role,
          content: question.followUpQuestions[0],
          type: 'followup',
        });
        timestamp += 60;
      }

      timestamp += 120; // Time for response
    }

    return transcript;
  }

  // ---------------------------------------------------------------------------
  // USAGE TRACKING
  // ---------------------------------------------------------------------------

  private getMonthlyUsage(organizationId: string): number {
    const history = this.sessionHistory.get(organizationId) || [];
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    
    return history.filter(h => h.sessionDate >= thisMonth).length;
  }

  private storeSession(organizationId: string, result: GhostBoardResult): void {
    const history = this.sessionHistory.get(organizationId) || [];
    history.push(result);
    this.sessionHistory.set(organizationId, history);
  }

  getSessionHistory(organizationId: string): GhostBoardResult[] {
    return this.sessionHistory.get(organizationId) || [];
  }

  getBoardMembers(): BoardMember[] {
    return Object.values(BOARD_MEMBERS);
  }
}

// Export singleton
export const ghostBoardService = new GhostBoardService();
