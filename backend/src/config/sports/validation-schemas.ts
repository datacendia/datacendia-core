/**
 * Configuration — Validation Schemas
 *
 * Application configuration and service initialization.
 *
 * @exports PlayerSchema, ClubSchema, AgentSchema, CreateTransferDecisionSchema, UpdateTransferDecisionSchema, ScoutingAssessmentSchema, ValuationSchema, AlternativeSchema
 * @module config/sports/validation-schemas
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * DATACENDIA PLATFORM - SPORTS VERTICAL
 * Zod Validation Schemas
 * 
 * Copyright (c) 2024-2026 Datacendia, Inc. All Rights Reserved.
 * PROPRIETARY AND CONFIDENTIAL
 */

import { z } from 'zod';

// =============================================================================
// COMMON SCHEMAS
// =============================================================================

export const PlayerSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Player name is required'),
  dateOfBirth: z.string().or(z.date()).optional(),
  nationality: z.string().optional(),
  position: z.enum([
    'GK', 'CB', 'LB', 'RB', 'LWB', 'RWB', 
    'CDM', 'CM', 'CAM', 'LM', 'RM', 
    'LW', 'RW', 'CF', 'ST'
  ]).optional(),
  currentClub: z.string().optional(),
  contractExpiry: z.string().or(z.date()).optional(),
  marketValue: z.number().nonnegative().optional(),
});

export const ClubSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Club name is required'),
  country: z.string().optional(),
  league: z.string().optional(),
  tier: z.number().int().min(1).max(10).optional(),
});

export const AgentSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Agent name is required'),
  agency: z.string().optional(),
  fifaLicense: z.string().optional(),
  licenseVerified: z.boolean().default(false),
});

// =============================================================================
// TRANSFER DECISION SCHEMAS
// =============================================================================

export const CreateTransferDecisionSchema = z.object({
  organizationId: z.string().min(1, 'Organization ID is required'),
  userId: z.string().min(1, 'User ID is required'),
  templateId: z.string().default('transfer-inbound-v1'),
  transactionType: z.enum(['inbound', 'outbound', 'loan_out', 'loan_in']).default('inbound'),
  player: PlayerSchema,
  counterpartyClub: ClubSchema,
  transferFee: z.number().nonnegative().default(0),
  addOns: z.number().nonnegative().optional(),
  agentFee: z.number().nonnegative().optional(),
});

export const UpdateTransferDecisionSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  transferFee: z.number().nonnegative().optional(),
  addOns: z.number().nonnegative().optional(),
  agentFee: z.number().nonnegative().optional(),
  wages: z.object({
    weekly: z.number().nonnegative(),
    contractLength: z.number().int().min(1).max(7),
    totalValue: z.number().nonnegative(),
  }).optional(),
  sellOnClause: z.number().min(0).max(50).optional(),
  buybackClause: z.number().nonnegative().optional(),
});

export const ScoutingAssessmentSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  assessment: z.object({
    matchesObserved: z.number().int().nonnegative(),
    videoAnalysisComplete: z.boolean(),
    dataProfile: z.string(),
    characterReferences: z.number().int().nonnegative(),
    recommendation: z.enum(['strong_buy', 'buy', 'conditional', 'pass']),
  }),
});

export const ValuationSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  valuation: z.object({
    methodology: z.string().min(1, 'Methodology is required'),
    marketComparables: z.string(),
    internalValuation: z.number().nonnegative(),
    dataValuation: z.number().nonnegative().optional(),
    negotiatedFee: z.number().nonnegative(),
    premium: z.number(), // Can be negative (discount)
  }),
});

export const AlternativeSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  alternative: z.object({
    playerName: z.string().min(1, 'Player name is required'),
    reason: z.string().min(1, 'Reason is required'),
    whyNotSelected: z.string().min(1, 'Explanation required'),
  }),
});

export const SubmitForApprovalSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
});

export const ApprovalDecisionSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  userName: z.string().min(1, 'User name is required'),
  role: z.enum(['board', 'ceo', 'cfo', 'sporting_director', 'commercial_director', 'academy_director']),
  approved: z.boolean(),
  comments: z.string().optional(),
});

export const CompleteDecisionSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
});

export const FFPAssessmentSchema = z.object({
  currentBreakEvenPosition: z.number(),
  currentSquadCostRatio: z.number().min(0).max(100).optional(),
});

// =============================================================================
// CONTRACT DECISION SCHEMAS
// =============================================================================

export const CreateContractDecisionSchema = z.object({
  organizationId: z.string().min(1, 'Organization ID is required'),
  userId: z.string().min(1, 'User ID is required'),
  templateId: z.string().default('contract-new-v1'),
  contractType: z.enum(['new', 'renewal', 'termination']),
  player: PlayerSchema,
  currentContract: z.object({
    weeklyWage: z.number().nonnegative(),
    expiryDate: z.string().or(z.date()),
    remainingValue: z.number().nonnegative(),
  }).optional(),
  proposedContract: z.object({
    weeklyWage: z.number().nonnegative(),
    lengthYears: z.number().int().min(1).max(7),
    signingBonus: z.number().nonnegative().optional(),
    loyaltyBonus: z.number().nonnegative().optional(),
    performanceBonuses: z.string().optional(),
    releaseClause: z.number().nonnegative().optional(),
    totalValue: z.number().nonnegative(),
  }),
  justification: z.object({
    performanceAssessment: z.string(),
    marketBenchmarking: z.string(),
    strategicRationale: z.string(),
  }),
});

// =============================================================================
// EVIDENCE SCHEMAS
// =============================================================================

export const AttachEvidenceSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  evidenceType: z.enum([
    'scouting_report',
    'data_analysis',
    'valuation_analysis',
    'agent_engagement',
    'medical_report',
    'board_minutes',
    'video_analysis',
    'offer_documentation',
    'player_consent',
    'sell_on_calculation',
    'development_plan',
    'loan_club_assessment',
    'wage_analysis',
    'player_assessment',
    'wage_benchmarking',
    'performance_data',
    'valuation_report',
    'brand_due_diligence',
    'market_comparison',
    'interview_notes',
    'reference_checks',
    'performance_analysis',
    'education_plan',
    'parent_consent',
    'other',
  ]),
  description: z.string().optional(),
});

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type CreateTransferDecisionInput = z.infer<typeof CreateTransferDecisionSchema>;
export type UpdateTransferDecisionInput = z.infer<typeof UpdateTransferDecisionSchema>;
export type ScoutingAssessmentInput = z.infer<typeof ScoutingAssessmentSchema>;
export type ValuationInput = z.infer<typeof ValuationSchema>;
export type AlternativeInput = z.infer<typeof AlternativeSchema>;
export type ApprovalDecisionInput = z.infer<typeof ApprovalDecisionSchema>;
export type FFPAssessmentInput = z.infer<typeof FFPAssessmentSchema>;
export type CreateContractDecisionInput = z.infer<typeof CreateContractDecisionSchema>;
export type AttachEvidenceInput = z.infer<typeof AttachEvidenceSchema>;
