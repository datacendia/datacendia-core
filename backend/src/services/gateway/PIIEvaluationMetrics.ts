// Copyright (c) 2024-2026 Datacendia, Inc. All Rights Reserved.

/**
 * @module services/gateway/PIIEvaluationMetrics
 * @description Evaluation metrics for PII detection and bias analysis.
 *
 * Provides precision, recall, F1 score, and confusion matrix for the
 * PII scanner against labeled test corpora. Essential for:
 * - Quantifying false positive / false negative rates before production
 * - Regression testing after pattern changes
 * - Compliance evidence (auditors ask "how accurate is your PII scanner?")
 * - Bias detection in AI outputs (toxicity, stereotypes, fairness)
 */

import { scanForPII, PIIType, PIIScanResult } from './PIIDetector.js';
import { logger } from '../../utils/logger.js';

// =============================================================================
// TYPES
// =============================================================================

/** A single labeled test case for PII evaluation */
export interface PIITestCase {
  id: string;
  text: string;
  expectedDetections: Array<{
    type: PIIType;
    value: string;
  }>;
  description?: string;
}

/** Metrics for a single PII type */
export interface TypeMetrics {
  type: PIIType;
  truePositives: number;
  falsePositives: number;
  falseNegatives: number;
  precision: number;
  recall: number;
  f1Score: number;
}

/** Overall evaluation result */
export interface EvaluationResult {
  timestamp: Date;
  totalTestCases: number;
  totalExpected: number;
  totalDetected: number;
  overallPrecision: number;
  overallRecall: number;
  overallF1: number;
  byType: TypeMetrics[];
  confusionMatrix: Record<string, { tp: number; fp: number; fn: number }>;
  failedCases: Array<{
    testId: string;
    description?: string;
    missed: string[];
    spurious: string[];
  }>;
  durationMs: number;
}

/** Bias detection test case */
export interface BiasTestCase {
  id: string;
  text: string;
  expectedFlags: BiasFlag[];
  description?: string;
}

export type BiasFlag =
  | 'gender_stereotype'
  | 'racial_bias'
  | 'age_discrimination'
  | 'disability_bias'
  | 'religious_bias'
  | 'socioeconomic_bias'
  | 'toxicity'
  | 'none';

/** Bias evaluation result */
export interface BiasEvaluationResult {
  timestamp: Date;
  totalTestCases: number;
  flagsDetected: number;
  flagsMissed: number;
  byCategory: Record<BiasFlag, { detected: number; missed: number; falsePositive: number }>;
  durationMs: number;
}

// =============================================================================
// BUILT-IN TEST CORPUS — Known PII samples for regression testing
// =============================================================================

const BUILT_IN_PII_CORPUS: PIITestCase[] = [
  {
    id: 'pii-ssn-1',
    text: 'My social security number is 123-45-6789.',
    expectedDetections: [{ type: 'ssn', value: '123-45-6789' }],
    description: 'Standard SSN with dashes',
  },
  {
    id: 'pii-ssn-2',
    text: 'SSN: 123 45 6789',
    expectedDetections: [{ type: 'ssn', value: '123 45 6789' }],
    description: 'SSN with spaces',
  },
  {
    id: 'pii-cc-1',
    text: 'Please charge card 4111-1111-1111-1111 for the order.',
    expectedDetections: [{ type: 'credit_card', value: '4111-1111-1111-1111' }],
    description: 'Visa test card number',
  },
  {
    id: 'pii-email-1',
    text: 'Contact john.doe@example.com for details.',
    expectedDetections: [{ type: 'email', value: 'john.doe@example.com' }],
    description: 'Standard email address',
  },
  {
    id: 'pii-phone-1',
    text: 'Call me at (555) 123-4567.',
    expectedDetections: [{ type: 'phone', value: '(555) 123-4567' }],
    description: 'US phone number with parentheses',
  },
  {
    id: 'pii-ip-1',
    text: 'Server IP is 192.168.1.100.',
    expectedDetections: [{ type: 'ip_address', value: '192.168.1.100' }],
    description: 'IPv4 address',
  },
  {
    id: 'pii-multi-1',
    text: 'Patient john.doe@hospital.com, SSN 111-22-3333, phone 555-867-5309.',
    expectedDetections: [
      { type: 'email', value: 'john.doe@hospital.com' },
      { type: 'ssn', value: '111-22-3333' },
      { type: 'phone', value: '555-867-5309' },
    ],
    description: 'Multiple PII types in one text',
  },
  {
    id: 'pii-clean-1',
    text: 'The quarterly revenue was $2.3 million, up 15% from last year.',
    expectedDetections: [],
    description: 'Clean text with no PII — should produce zero detections',
  },
  {
    id: 'pii-clean-2',
    text: 'We recommend implementing a three-phase rollout strategy.',
    expectedDetections: [],
    description: 'Generic business text — no PII',
  },
  {
    id: 'pii-passport-1',
    text: 'Passport: AB1234567',
    expectedDetections: [{ type: 'passport', value: 'Passport: AB1234567' }],
    description: 'Passport number',
  },
  {
    id: 'pii-bank-1',
    text: 'Routing number: 021000021, account: 123456789012',
    expectedDetections: [{ type: 'bank_account', value: 'account: 123456789012' }],
    description: 'Bank account number',
  },
  {
    id: 'pii-medical-1',
    text: 'Patient ID: 1234567890',
    expectedDetections: [{ type: 'medical_record', value: 'Patient ID: 1234567890' }],
    description: 'Medical record number',
  },
];

// =============================================================================
// BIAS DETECTION PATTERNS
// =============================================================================

const BIAS_PATTERNS: Array<{ flag: BiasFlag; patterns: RegExp[] }> = [
  {
    flag: 'gender_stereotype',
    patterns: [
      /\b(women|girls|females?)\s+(should|must|need to|are better at|can't|cannot|aren't able)\b/gi,
      /\b(men|boys|males?)\s+(should|must|need to|are better at|can't|cannot|aren't able)\b/gi,
      /\b(typical(?:ly)?|naturally|inherently)\s+(?:male|female|masculine|feminine)\b/gi,
    ],
  },
  {
    flag: 'racial_bias',
    patterns: [
      /\b(all|every|most)\s+(?:black|white|asian|hispanic|latino|arab)\s+(?:people|men|women|folk)\b/gi,
      /\b(?:black|white|asian|hispanic)\s+(?:are|tend to be)\s+(?:more|less)\b/gi,
    ],
  },
  {
    flag: 'age_discrimination',
    patterns: [
      /\b(too old|too young)\s+(?:to|for)\b/gi,
      /\b(?:old people|elderly|boomers|millennials|zoomers)\s+(?:are|can't|don't|always)\b/gi,
    ],
  },
  {
    flag: 'toxicity',
    patterns: [
      /\b(hate|kill|destroy|eliminate)\s+(?:all|every|those)\b/gi,
      /\b(stupid|idiot|moron|dumb)\s+(?:people|users|customers)\b/gi,
    ],
  },
];

const BUILT_IN_BIAS_CORPUS: BiasTestCase[] = [
  {
    id: 'bias-clean-1',
    text: 'The decision was made based on quarterly performance metrics.',
    expectedFlags: ['none'],
    description: 'Neutral business text',
  },
  {
    id: 'bias-gender-1',
    text: 'Women should focus on nurturing roles while men handle leadership.',
    expectedFlags: ['gender_stereotype'],
    description: 'Gender stereotype in role assignment',
  },
  {
    id: 'bias-toxic-1',
    text: 'We need to eliminate all those inefficient processes.',
    expectedFlags: ['none'],
    description: 'Business language that sounds toxic but is not',
  },
];

// =============================================================================
// EVALUATION SERVICE
// =============================================================================

class PIIEvaluationService {
  /**
   * Run PII evaluation against the built-in test corpus or a custom one.
   */
  async evaluatePII(customCorpus?: PIITestCase[]): Promise<EvaluationResult> {
    const startTime = Date.now();
    const corpus = customCorpus ?? BUILT_IN_PII_CORPUS;

    let totalExpected = 0;
    let totalDetected = 0;
    const typeStats: Record<string, { tp: number; fp: number; fn: number }> = {};
    const failedCases: EvaluationResult['failedCases'] = [];

    for (const testCase of corpus) {
      const result: PIIScanResult = scanForPII(testCase.text);
      const detected = result.detections;
      const expected = testCase.expectedDetections;

      totalExpected += expected.length;
      totalDetected += detected.length;

      // Match detections to expected
      const matchedExpected = new Set<number>();
      const matchedDetected = new Set<number>();

      for (let i = 0; i < expected.length; i++) {
        const exp = expected[i];
        if (!exp) continue;
        for (let j = 0; j < detected.length; j++) {
          if (matchedDetected.has(j)) continue;
          const det = detected[j];
          if (!det) continue;
          if (det.type === exp.type) {
            matchedExpected.add(i);
            matchedDetected.add(j);

            // True positive
            if (!typeStats[exp.type]) typeStats[exp.type] = { tp: 0, fp: 0, fn: 0 };
            typeStats[exp.type]!.tp++;
            break;
          }
        }
      }

      // False negatives: expected but not detected
      const missed: string[] = [];
      for (let i = 0; i < expected.length; i++) {
        if (!matchedExpected.has(i)) {
          const exp = expected[i]!;
          if (!typeStats[exp.type]) typeStats[exp.type] = { tp: 0, fp: 0, fn: 0 };
          typeStats[exp.type]!.fn++;
          missed.push(`${exp.type}: "${exp.value}"`);
        }
      }

      // False positives: detected but not expected
      const spurious: string[] = [];
      for (let j = 0; j < detected.length; j++) {
        if (!matchedDetected.has(j)) {
          const det = detected[j]!;
          if (!typeStats[det.type]) typeStats[det.type] = { tp: 0, fp: 0, fn: 0 };
          typeStats[det.type]!.fp++;
          spurious.push(`${det.type}: "${det.value}"`);
        }
      }

      if (missed.length > 0 || spurious.length > 0) {
        failedCases.push({
          testId: testCase.id,
          description: testCase.description,
          missed,
          spurious,
        });
      }
    }

    // Calculate per-type metrics
    const byType: TypeMetrics[] = Object.entries(typeStats).map(([type, stats]) => {
      const precision = stats.tp + stats.fp > 0 ? stats.tp / (stats.tp + stats.fp) : 0;
      const recall = stats.tp + stats.fn > 0 ? stats.tp / (stats.tp + stats.fn) : 0;
      const f1 = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;
      return {
        type: type as PIIType,
        truePositives: stats.tp,
        falsePositives: stats.fp,
        falseNegatives: stats.fn,
        precision: Math.round(precision * 1000) / 1000,
        recall: Math.round(recall * 1000) / 1000,
        f1Score: Math.round(f1 * 1000) / 1000,
      };
    });

    // Overall metrics (micro-average)
    const totalTP = Object.values(typeStats).reduce((s, t) => s + t.tp, 0);
    const totalFP = Object.values(typeStats).reduce((s, t) => s + t.fp, 0);
    const totalFN = Object.values(typeStats).reduce((s, t) => s + t.fn, 0);

    const overallPrecision = totalTP + totalFP > 0 ? totalTP / (totalTP + totalFP) : 0;
    const overallRecall = totalTP + totalFN > 0 ? totalTP / (totalTP + totalFN) : 0;
    const overallF1 = overallPrecision + overallRecall > 0
      ? (2 * overallPrecision * overallRecall) / (overallPrecision + overallRecall)
      : 0;

    const duration = Date.now() - startTime;

    const result: EvaluationResult = {
      timestamp: new Date(),
      totalTestCases: corpus.length,
      totalExpected,
      totalDetected,
      overallPrecision: Math.round(overallPrecision * 1000) / 1000,
      overallRecall: Math.round(overallRecall * 1000) / 1000,
      overallF1: Math.round(overallF1 * 1000) / 1000,
      byType,
      confusionMatrix: typeStats,
      failedCases,
      durationMs: duration,
    };

    logger.info(
      `[PIIEval] Evaluation complete: P=${result.overallPrecision} R=${result.overallRecall} F1=${result.overallF1} ` +
      `(${corpus.length} cases, ${failedCases.length} failures, ${duration}ms)`
    );

    return result;
  }

  /**
   * Run bias detection evaluation against a test corpus.
   */
  async evaluateBias(customCorpus?: BiasTestCase[]): Promise<BiasEvaluationResult> {
    const startTime = Date.now();
    const corpus = customCorpus ?? BUILT_IN_BIAS_CORPUS;

    const byCategory: Record<BiasFlag, { detected: number; missed: number; falsePositive: number }> = {
      gender_stereotype: { detected: 0, missed: 0, falsePositive: 0 },
      racial_bias: { detected: 0, missed: 0, falsePositive: 0 },
      age_discrimination: { detected: 0, missed: 0, falsePositive: 0 },
      disability_bias: { detected: 0, missed: 0, falsePositive: 0 },
      religious_bias: { detected: 0, missed: 0, falsePositive: 0 },
      socioeconomic_bias: { detected: 0, missed: 0, falsePositive: 0 },
      toxicity: { detected: 0, missed: 0, falsePositive: 0 },
      none: { detected: 0, missed: 0, falsePositive: 0 },
    };

    let flagsDetected = 0;
    let flagsMissed = 0;

    for (const testCase of corpus) {
      const detectedFlags = this.detectBias(testCase.text);
      const expected = new Set(testCase.expectedFlags);
      const detected = new Set(detectedFlags);

      for (const flag of expected) {
        if (flag === 'none') continue;
        if (detected.has(flag)) {
          byCategory[flag].detected++;
          flagsDetected++;
        } else {
          byCategory[flag].missed++;
          flagsMissed++;
        }
      }

      for (const flag of detected) {
        if (!expected.has(flag)) {
          byCategory[flag].falsePositive++;
        }
      }
    }

    return {
      timestamp: new Date(),
      totalTestCases: corpus.length,
      flagsDetected,
      flagsMissed,
      byCategory,
      durationMs: Date.now() - startTime,
    };
  }

  /**
   * Detect bias flags in text using pattern matching.
   */
  detectBias(text: string): BiasFlag[] {
    const flags: BiasFlag[] = [];

    for (const { flag, patterns } of BIAS_PATTERNS) {
      for (const pattern of patterns) {
        // Reset lastIndex for global patterns
        pattern.lastIndex = 0;
        if (pattern.test(text)) {
          if (!flags.includes(flag)) {
            flags.push(flag);
          }
          break;
        }
      }
    }

    return flags;
  }

  /**
   * Get the built-in test corpus (useful for inspection or extension).
   */
  getBuiltInPIICorpus(): PIITestCase[] {
    return [...BUILT_IN_PII_CORPUS];
  }

  /**
   * Get the built-in bias corpus.
   */
  getBuiltInBiasCorpus(): BiasTestCase[] {
    return [...BUILT_IN_BIAS_CORPUS];
  }
}

export const piiEvaluation = new PIIEvaluationService();
export default piiEvaluation;
