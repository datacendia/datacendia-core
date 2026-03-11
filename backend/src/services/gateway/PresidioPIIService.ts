// Copyright (c) 2024-2026 Datacendia, Inc. All Rights Reserved.

/**
 * @module services/gateway/PresidioPIIService
 * @description ML-based PII detection using Microsoft Presidio.
 *
 * Presidio runs as a Docker sidecar (analyzer + anonymizer) and provides
 * NER-based entity recognition that far exceeds regex accuracy for:
 * - Person names (without title prefixes)
 * - Locations and addresses
 * - Organization names
 * - Context-dependent phone numbers, dates, medical terms
 *
 * Architecture:
 *   [Request] → PresidioPIIService.analyze()
 *                  ├─ Presidio available? → ML NER analysis (high accuracy)
 *                  └─ Presidio unavailable? → Fallback to regex PIIDetector
 *
 * Docker services required:
 *   presidio-analyzer:  mcr.microsoft.com/presidio-analyzer:latest  (port 5001)
 *   presidio-anonymizer: mcr.microsoft.com/presidio-anonymizer:latest (port 5002)
 *
 * @see https://microsoft.github.io/presidio/
 */

import { logger } from '../../utils/logger.js';
import { scanForPII, PIIDetection, PIIType, PIIScanResult } from './PIIDetector.js';

// =============================================================================
// TYPES
// =============================================================================

/** Presidio analyzer response entity */
interface PresidioEntity {
  entity_type: string;
  start: number;
  end: number;
  score: number;
  analysis_explanation?: {
    recognizer: string;
    pattern_name?: string;
    pattern?: string;
    original_score: number;
    score: number;
    textual_explanation?: string;
    score_context_improvement?: number;
  };
}

/** Presidio anonymizer response */
interface PresidioAnonymizeResponse {
  text: string;
  items: Array<{
    start: number;
    end: number;
    entity_type: string;
    text: string;
    operator: string;
  }>;
}

/** Extended scan result with Presidio metadata */
export interface PresidioPIIScanResult extends PIIScanResult {
  engine: 'presidio' | 'regex-fallback';
  presidioLatencyMs?: number;
  recognizers?: string[];
}

// =============================================================================
// PRESIDIO ENTITY → PII TYPE MAPPING
// =============================================================================

const PRESIDIO_TO_PII_TYPE: Record<string, PIIType> = {
  'PERSON': 'person_name',
  'EMAIL_ADDRESS': 'email',
  'PHONE_NUMBER': 'phone',
  'CREDIT_CARD': 'credit_card',
  'US_SSN': 'ssn',
  'US_PASSPORT': 'passport',
  'US_DRIVER_LICENSE': 'drivers_license',
  'US_BANK_NUMBER': 'bank_account',
  'IP_ADDRESS': 'ip_address',
  'DATE_TIME': 'date_of_birth',
  'IBAN_CODE': 'financial_id',
  'MEDICAL_LICENSE': 'medical_record',
  'LOCATION': 'address',
  'US_ITIN': 'ssn',
  'UK_NHS': 'medical_record',
  'SG_NRIC_FIN': 'financial_id',
  'AU_ABN': 'financial_id',
  'AU_ACN': 'financial_id',
  'AU_TFN': 'financial_id',
  'AU_MEDICARE': 'medical_record',
};

const PRESIDIO_REDACT_LABELS: Record<string, string> = {
  'person_name': '[NAME REDACTED]',
  'email': '[EMAIL REDACTED]',
  'phone': '[PHONE REDACTED]',
  'credit_card': '[CREDIT CARD REDACTED]',
  'ssn': '[SSN REDACTED]',
  'passport': '[PASSPORT REDACTED]',
  'drivers_license': '[DL REDACTED]',
  'bank_account': '[BANK ACCOUNT REDACTED]',
  'ip_address': '[IP REDACTED]',
  'date_of_birth': '[DOB REDACTED]',
  'financial_id': '[FINANCIAL ID REDACTED]',
  'medical_record': '[MEDICAL RECORD REDACTED]',
  'address': '[ADDRESS REDACTED]',
};

// =============================================================================
// SERVICE
// =============================================================================

class PresidioPIIService {
  private analyzerUrl: string;
  private anonymizerUrl: string;
  private available: boolean | null = null;
  private lastHealthCheck = 0;
  private healthCheckIntervalMs = 30_000; // Re-check every 30s

  constructor() {
    this.analyzerUrl = process.env['PRESIDIO_ANALYZER_URL'] || 'http://localhost:5001';
    this.anonymizerUrl = process.env['PRESIDIO_ANONYMIZER_URL'] || 'http://localhost:5002';
  }

  /**
   * Check if Presidio analyzer is reachable.
   */
  async isAvailable(): Promise<boolean> {
    const now = Date.now();
    if (this.available !== null && now - this.lastHealthCheck < this.healthCheckIntervalMs) {
      return this.available;
    }

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);

      const response = await fetch(`${this.analyzerUrl}/health`, {
        signal: controller.signal,
      });
      clearTimeout(timeout);

      this.available = response.ok;
      this.lastHealthCheck = now;

      if (this.available) {
        logger.info('[Presidio] Analyzer is available');
      }
    } catch {
      this.available = false;
      this.lastHealthCheck = now;
    }

    return this.available;
  }

  /**
   * Analyze text for PII using Presidio ML engine.
   * Falls back to regex PIIDetector if Presidio is unavailable.
   */
  async analyze(text: string): Promise<PresidioPIIScanResult> {
    const isUp = await this.isAvailable();

    if (!isUp) {
      // Graceful fallback to regex-based scanner
      const regexResult = scanForPII(text);
      return {
        ...regexResult,
        engine: 'regex-fallback',
      };
    }

    const startTime = Date.now();

    try {
      // Step 1: Analyze — identify entities
      const analyzeResponse = await fetch(`${this.analyzerUrl}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          language: 'en',
          score_threshold: 0.4,
          return_decision_process: true,
        }),
      });

      if (!analyzeResponse.ok) {
        throw new Error(`Presidio analyzer returned ${analyzeResponse.status}`);
      }

      const entities: PresidioEntity[] = await analyzeResponse.json() as PresidioEntity[];
      const presidioLatencyMs = Date.now() - startTime;

      // Step 2: Map Presidio entities to our PIIDetection format
      const detections: PIIDetection[] = [];
      const recognizers = new Set<string>();

      for (const entity of entities) {
        const piiType = PRESIDIO_TO_PII_TYPE[entity.entity_type];
        if (!piiType) continue; // Skip unknown entity types

        const value = text.slice(entity.start, entity.end);
        const redacted = PRESIDIO_REDACT_LABELS[piiType] || `[${entity.entity_type} REDACTED]`;

        if (entity.analysis_explanation?.recognizer) {
          recognizers.add(entity.analysis_explanation.recognizer);
        }

        detections.push({
          type: piiType,
          value,
          redacted,
          startIndex: entity.start,
          endIndex: entity.end,
          confidence: entity.score,
        });
      }

      // Step 3: Build redacted text (reverse order to preserve indices)
      let redactedText = text;
      const sorted = [...detections].sort((a, b) => b.startIndex - a.startIndex);
      for (const det of sorted) {
        redactedText =
          redactedText.slice(0, det.startIndex) +
          det.redacted +
          redactedText.slice(det.endIndex);
      }

      const types = [...new Set(detections.map(d => d.type))];

      return {
        hasPII: detections.length > 0,
        detections,
        types,
        originalText: text,
        redactedText,
        scanDurationMs: Date.now() - startTime,
        engine: 'presidio',
        presidioLatencyMs,
        recognizers: [...recognizers],
      };
    } catch (error) {
      logger.warn('[Presidio] Analysis failed, falling back to regex:', error);
      this.available = false; // Mark as down, will re-check after interval

      const regexResult = scanForPII(text);
      return {
        ...regexResult,
        engine: 'regex-fallback',
      };
    }
  }

  /**
   * Anonymize text using Presidio anonymizer service.
   * Provides more sophisticated anonymization (replace, hash, mask, encrypt).
   */
  async anonymize(
    text: string,
    operator: 'replace' | 'hash' | 'mask' | 'redact' = 'replace'
  ): Promise<{ text: string; items: PresidioAnonymizeResponse['items'] } | null> {
    const isUp = await this.isAvailable();
    if (!isUp) return null;

    try {
      // First analyze to get entities
      const analyzeResponse = await fetch(`${this.analyzerUrl}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          language: 'en',
          score_threshold: 0.4,
        }),
      });

      if (!analyzeResponse.ok) return null;
      const entities: PresidioEntity[] = await analyzeResponse.json() as PresidioEntity[];

      // Then anonymize
      const anonymizeResponse = await fetch(`${this.anonymizerUrl}/anonymize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          analyzer_results: entities.map(e => ({
            start: e.start,
            end: e.end,
            score: e.score,
            entity_type: e.entity_type,
          })),
          anonymizers: {
            DEFAULT: { type: operator, new_value: '<ANONYMIZED>' },
          },
        }),
      });

      if (!anonymizeResponse.ok) return null;
      return await anonymizeResponse.json() as PresidioAnonymizeResponse;
    } catch (error) {
      logger.warn('[Presidio] Anonymization failed:', error);
      return null;
    }
  }

  /**
   * Get supported entity types from the analyzer.
   */
  async getSupportedEntities(): Promise<string[]> {
    try {
      const response = await fetch(`${this.analyzerUrl}/supportedentities`, {
        method: 'GET',
      });
      if (!response.ok) return [];
      return await response.json() as string[];
    } catch {
      return [];
    }
  }

  /**
   * Get available recognizers from the analyzer.
   */
  async getRecognizers(): Promise<string[]> {
    try {
      const response = await fetch(`${this.analyzerUrl}/recognizers`, {
        method: 'GET',
      });
      if (!response.ok) return [];
      return (await response.json() as string[]);
    } catch {
      return [];
    }
  }
}

export const presidioPIIService = new PresidioPIIService();
export default presidioPIIService;
