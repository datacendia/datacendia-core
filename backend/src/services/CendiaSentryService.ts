// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// CENDIA SENTRY SERVICE — AI Guardrails & Content Safety Engine
// =============================================================================

import { logger } from '../utils/logger.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CheckContentParams {
  organizationId: string;
  userId: string;
  inputType: string;
  input?: string;
  output?: string;
  agentId?: string;
  modelUsed?: string;
  context?: Record<string, unknown>;
}

interface CheckContentWithContextParams extends CheckContentParams {
  domain: string;
}

interface CorrectionParams {
  organizationId: string;
  checkId: string;
  guardrailType: string;
  correctedDecision: string;
  reason: string;
  correctedBy: string;
}

interface GuardrailResult {
  id: string;
  status: 'pass' | 'fail' | 'warn';
  guardrails: GuardrailVerdict[];
  timestamp: string;
}

interface GuardrailVerdict {
  type: string;
  passed: boolean;
  score: number;
  threshold: number;
  details?: string;
}

interface ExplainResult {
  checkId: string;
  verdicts: Array<{
    guardrail: string;
    passed: boolean;
    score: number;
    explanation: string;
  }>;
  overallExplanation: string;
}

interface CorrectionResult {
  id: string;
  checkId: string;
  guardrailType: string;
  correctedDecision: string;
  reason: string;
  correctedBy: string;
  timestamp: string;
}

interface CorrectionAnalytics {
  totalCorrections: number;
  falsePositiveRate: number;
  falseNegativeRate: number;
  byGuardrail: Record<string, { total: number; falsePositives: number; falseNegatives: number }>;
  recommendations: string[];
}

type GuardrailConfig = Record<string, { enabled: boolean; threshold: number }>;

// ---------------------------------------------------------------------------
// In-memory stores (replaced by DB in production)
// ---------------------------------------------------------------------------

const checksStore = new Map<string, GuardrailResult>();
const correctionsStore: CorrectionResult[] = [];
const orgConfigs = new Map<string, GuardrailConfig>();

// ---------------------------------------------------------------------------
// Default guardrail checks
// ---------------------------------------------------------------------------

const DEFAULT_GUARDRAILS: Array<{ type: string; threshold: number }> = [
  { type: 'toxicity', threshold: 0.7 },
  { type: 'bias', threshold: 0.6 },
  { type: 'pii_detection', threshold: 0.8 },
  { type: 'hallucination', threshold: 0.5 },
  { type: 'prompt_injection', threshold: 0.9 },
];

function generateId(): string {
  return `chk_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function runGuardrails(
  content: string | undefined,
  guardrails: Array<{ type: string; threshold: number }>,
): GuardrailVerdict[] {
  return guardrails.map((g) => {
    // Stub scoring — in production this calls ML models / NeMo Guardrails
    const score = Math.random() * 0.4; // Low risk by default for stub
    return {
      type: g.type,
      passed: score < g.threshold,
      score: parseFloat(score.toFixed(4)),
      threshold: g.threshold,
    };
  });
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

class CendiaSentryService {
  // ── Core ─────────────────────────────────────────────────────────────

  async checkContent(params: CheckContentParams): Promise<GuardrailResult> {
    const config = orgConfigs.get(params.organizationId);
    const guardrails = config
      ? DEFAULT_GUARDRAILS.filter((g) => config[g.type]?.enabled !== false).map((g) => ({
          type: g.type,
          threshold: config[g.type]?.threshold ?? g.threshold,
        }))
      : DEFAULT_GUARDRAILS;

    const verdicts = runGuardrails(params.input || params.output, guardrails);
    const allPassed = verdicts.every((v) => v.passed);

    const result: GuardrailResult = {
      id: generateId(),
      status: allPassed ? 'pass' : verdicts.some((v) => !v.passed && v.score > 0.9) ? 'fail' : 'warn',
      guardrails: verdicts,
      timestamp: new Date().toISOString(),
    };

    checksStore.set(result.id, result);
    logger.debug(`[CendiaSentry] Check ${result.id}: ${result.status}`);
    return result;
  }

  async getCheck(id: string): Promise<GuardrailResult | null> {
    return checksStore.get(id) ?? null;
  }

  async getStatistics(organizationId: string): Promise<Record<string, unknown>> {
    const checks = Array.from(checksStore.values());
    return {
      organizationId,
      totalChecks: checks.length,
      passed: checks.filter((c) => c.status === 'pass').length,
      warned: checks.filter((c) => c.status === 'warn').length,
      failed: checks.filter((c) => c.status === 'fail').length,
    };
  }

  setGuardrailConfig(organizationId: string, configs: GuardrailConfig): void {
    orgConfigs.set(organizationId, configs);
    logger.info(`[CendiaSentry] Updated guardrail config for org ${organizationId}`);
  }

  // ── Context-aware ────────────────────────────────────────────────────

  async checkContentWithContext(params: CheckContentWithContextParams): Promise<GuardrailResult> {
    // Adjust thresholds based on domain
    const domainMultipliers: Record<string, number> = {
      medical: 0.8,
      financial: 0.85,
      legal: 0.85,
      hr: 0.9,
      technical: 1.1,
      general: 1.0,
    };
    const multiplier = domainMultipliers[params.domain] ?? 1.0;
    const adjusted = DEFAULT_GUARDRAILS.map((g) => ({
      type: g.type,
      threshold: parseFloat((g.threshold * multiplier).toFixed(2)),
    }));

    const verdicts = runGuardrails(params.input || params.output, adjusted);
    const allPassed = verdicts.every((v) => v.passed);

    const result: GuardrailResult = {
      id: generateId(),
      status: allPassed ? 'pass' : 'warn',
      guardrails: verdicts,
      timestamp: new Date().toISOString(),
    };
    checksStore.set(result.id, result);
    return result;
  }

  // ── Explainability ───────────────────────────────────────────────────

  async explainDecision(checkId: string): Promise<ExplainResult | null> {
    const check = checksStore.get(checkId);
    if (!check) return null;

    return {
      checkId,
      verdicts: check.guardrails.map((v) => ({
        guardrail: v.type,
        passed: v.passed,
        score: v.score,
        explanation: v.passed
          ? `Content scored ${v.score} on ${v.type}, below threshold ${v.threshold}.`
          : `Content scored ${v.score} on ${v.type}, exceeding threshold ${v.threshold}. Review recommended.`,
      })),
      overallExplanation: check.status === 'pass'
        ? 'All guardrails passed. Content is within acceptable parameters.'
        : 'One or more guardrails flagged this content for review.',
    };
  }

  // ── Corrections / feedback loop ──────────────────────────────────────

  async submitCorrection(params: CorrectionParams): Promise<CorrectionResult> {
    const correction: CorrectionResult = {
      id: `cor_${Date.now()}`,
      checkId: params.checkId,
      guardrailType: params.guardrailType,
      correctedDecision: params.correctedDecision,
      reason: params.reason,
      correctedBy: params.correctedBy,
      timestamp: new Date().toISOString(),
    };
    correctionsStore.push(correction);
    logger.info(`[CendiaSentry] Correction submitted for check ${params.checkId}`);
    return correction;
  }

  async getCorrectionAnalytics(organizationId: string): Promise<CorrectionAnalytics> {
    const total = correctionsStore.length;
    const fp = correctionsStore.filter((c) => c.correctedDecision === 'false_positive').length;
    const fn = correctionsStore.filter((c) => c.correctedDecision === 'false_negative').length;

    return {
      totalCorrections: total,
      falsePositiveRate: total > 0 ? fp / total : 0,
      falseNegativeRate: total > 0 ? fn / total : 0,
      byGuardrail: {},
      recommendations: total > 5
        ? ['Consider adjusting thresholds based on correction trends.']
        : ['Insufficient data for recommendations.'],
    };
  }

  // ── Tiered checking ──────────────────────────────────────────────────

  async checkContentTiered(params: CheckContentParams): Promise<GuardrailResult & { tier: string }> {
    // Quick scan with high thresholds
    const quickGuardrails = DEFAULT_GUARDRAILS.map((g) => ({ type: g.type, threshold: 0.95 }));
    const quickVerdicts = runGuardrails(params.input || params.output, quickGuardrails);
    const quickPass = quickVerdicts.every((v) => v.passed);

    if (quickPass) {
      const result = {
        id: generateId(),
        status: 'pass' as const,
        guardrails: quickVerdicts,
        timestamp: new Date().toISOString(),
        tier: 'quick',
      };
      checksStore.set(result.id, result);
      return result;
    }

    // Deep scan with standard thresholds
    const deepVerdicts = runGuardrails(params.input || params.output, DEFAULT_GUARDRAILS);
    const deepPass = deepVerdicts.every((v) => v.passed);
    const result = {
      id: generateId(),
      status: (deepPass ? 'pass' : 'warn') as 'pass' | 'warn',
      guardrails: deepVerdicts,
      timestamp: new Date().toISOString(),
      tier: 'deep',
    };
    checksStore.set(result.id, result);
    return result;
  }

  // ── NeMo integration (used by guardrails routes) ─────────────────────

  async getNeMoHealth(): Promise<{ status: string; enabled: boolean }> {
    return { status: 'stub', enabled: false };
  }

  async checkContentWithNeMo(params: CheckContentParams): Promise<GuardrailResult> {
    // Delegates to standard check; in production routes through NeMo Guardrails server
    return this.checkContent(params);
  }
}

export const cendiaSentryService = new CendiaSentryService();
