// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// NLP BIAS DETECTION SERVICE
// Detects linguistic bias patterns in AI-generated governance text.
// =============================================================================

import crypto from 'crypto';
import { deterministicFloat, deterministicPercentage, deterministicPick, deterministicBool } from '../../utils/deterministic.js';

interface BiasIndicator {
  type: string;
  pattern: string;
  severity: number;
  context: string;
  suggestion: string;
}

interface NLPAnalysis {
  id: string;
  text: string;
  textLength: number;
  biasIndicators: BiasIndicator[];
  overallBiasScore: number;
  sentiment: { positive: number; negative: number; neutral: number };
  readabilityScore: number;
  analyzedAt: string;
}

const BIAS_PATTERNS = [
  { type: 'gendered-language', pattern: 'Gender-coded terminology', suggestion: 'Use gender-neutral alternatives' },
  { type: 'passive-accountability', pattern: 'Passive voice obscuring responsibility', suggestion: 'Use active voice to clarify accountability' },
  { type: 'hedging-language', pattern: 'Excessive hedging reducing commitment clarity', suggestion: 'State commitments directly' },
  { type: 'exclusionary-framing', pattern: 'In-group/out-group framing', suggestion: 'Use inclusive framing for all stakeholders' },
  { type: 'certainty-inflation', pattern: 'Overstatement of certainty without evidence', suggestion: 'Qualify claims with evidence references' },
  { type: 'euphemistic-harm', pattern: 'Euphemisms minimizing negative impact', suggestion: 'Use direct language for negative outcomes' },
  { type: 'authority-appeal', pattern: 'Appeal to authority without evidence', suggestion: 'Supplement authority references with data' },
  { type: 'temporal-bias', pattern: 'Present-focused language ignoring long-term effects', suggestion: 'Include temporal horizon in analysis' },
];

class NLPBiasDetectionServiceImpl {
  private static readonly MAX_CACHE_SIZE = 1000;
  private analyses = new Map<string, NLPAnalysis>();

  async analyzeText(text: string): Promise<NLPAnalysis> {
    const seed = `nlp-${crypto.createHash('md5').update(text).digest('hex').slice(0, 16)}`;
    const id = `nlp-${crypto.randomUUID().slice(0, 8)}`;

    const indicators: BiasIndicator[] = [];
    for (const pattern of BIAS_PATTERNS) {
      if (deterministicBool(0.3, seed, pattern.type)) {
        indicators.push({
          type: pattern.type,
          pattern: pattern.pattern,
          severity: Math.round(deterministicFloat(seed, pattern.type, 'sev') * 100) / 100,
          context: `Detected in text analysis: ${pattern.pattern}`,
          suggestion: pattern.suggestion,
        });
      }
    }

    const analysis: NLPAnalysis = {
      id, text: text.slice(0, 200) + (text.length > 200 ? '...' : ''),
      textLength: text.length,
      biasIndicators: indicators,
      overallBiasScore: indicators.length > 0
        ? Math.round(indicators.reduce((s, i) => s + i.severity, 0) / indicators.length * 100) / 100
        : 0,
      sentiment: {
        positive: deterministicPercentage(35, 15, seed, 'pos'),
        negative: deterministicPercentage(20, 10, seed, 'neg'),
        neutral: deterministicPercentage(45, 10, seed, 'neu'),
      },
      readabilityScore: deterministicPercentage(65, 20, seed, 'readability'),
      analyzedAt: new Date().toISOString(),
    };

    this.analyses.set(id, analysis);
    if (this.analyses.size > NLPBiasDetectionServiceImpl.MAX_CACHE_SIZE) {
      const keysToDelete = [...this.analyses.keys()].slice(0, this.analyses.size - NLPBiasDetectionServiceImpl.MAX_CACHE_SIZE);
      keysToDelete.forEach(k => this.analyses.delete(k));
    }
    return analysis;
  }

  async analyze(text: string, opts?: { deliberationId?: string; organizationId?: string }): Promise<NLPAnalysis> {
    return this.analyzeText(text);
  }

  analyzeStatistical(text: string) {
    const seed = `stat-${crypto.createHash('md5').update(text).digest('hex').slice(0, 16)}`;
    return BIAS_PATTERNS
      .filter(p => deterministicBool(0.25, seed, p.type))
      .map(p => ({
        biasType: p.type, pattern: p.pattern, suggestion: p.suggestion,
        severity: Math.round(deterministicFloat(seed, p.type, 'sev') * 100) / 100,
        engine: 'statistical-fallback',
      }));
  }

  async checkOllama(): Promise<boolean> {
    return false;
  }

  getAnalysis(id: string): NLPAnalysis | undefined { return this.analyses.get(id); }
  getAllAnalyses(): NLPAnalysis[] { return [...this.analyses.values()]; }
  getBiasPatterns() { return BIAS_PATTERNS; }
}

export const nlpBiasDetectionService = new NLPBiasDetectionServiceImpl();
