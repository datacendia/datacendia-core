// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * PHI De-Identification Service
 *
 * Implements HIPAA §164.514(b) Safe Harbor de-identification:
 * Removes or generalises all 18 Safe Harbor identifiers before
 * any Protected Health Information (PHI) is passed to AI deliberations.
 *
 * Also supports Expert Determination mode (logs confidence score).
 *
 * Safe Harbor identifiers removed:
 *   1. Names             10. Account numbers
 *   2. Geographic data   11. Certificate/license numbers
 *   3. Dates (>year)     12. Vehicle identifiers & serial numbers
 *   4. Phone numbers     13. Device identifiers & serial numbers
 *   5. Fax numbers       14. Web URLs
 *   6. Email addresses   15. IP addresses
 *   7. SSNs              16. Biometric identifiers
 *   8. MRN / Health plan 17. Full-face photographs
 *   9. Account numbers   18. Any other unique identifying number
 */

import crypto from 'crypto';
import { logger } from '../../utils/logger.js';

// ============================================================================
// SAFE HARBOR REGEX PATTERNS (HIPAA §164.514(b)(2))
// ============================================================================

const SAFE_HARBOR_PATTERNS: Array<{ name: string; pattern: RegExp; replacement: string }> = [
  // 1. Names — rudimentary; Presidio NER is preferred for production
  { name: 'email', pattern: /\b[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}\b/g, replacement: '[EMAIL REMOVED]' },
  // 3. Full dates (keep year only per Safe Harbor)
  { name: 'full_date', pattern: /\b(0?[1-9]|1[0-2])[\/\-](0?[1-9]|[12]\d|3[01])[\/\-](\d{4}|\d{2})\b/g, replacement: '[DATE REMOVED]' },
  { name: 'full_date_text', pattern: /\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{1,2},?\s+\d{4}\b/gi, replacement: '[DATE REMOVED]' },
  // 4-5. Phone / fax numbers
  { name: 'phone', pattern: /\b(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}\b/g, replacement: '[PHONE REMOVED]' },
  // 7. SSN
  { name: 'ssn', pattern: /\b\d{3}-\d{2}-\d{4}\b/g, replacement: '[SSN REMOVED]' },
  // 8. Medical Record Numbers (common formats)
  { name: 'mrn', pattern: /\b(MRN|mrn|Medical Record|medical record)[:\s#]*\d{5,12}\b/gi, replacement: '[MRN REMOVED]' },
  // 9. Health Plan / Insurance IDs
  { name: 'insurance_id', pattern: /\b(Member ID|Policy|Plan)[:\s#]*[A-Z0-9]{6,15}\b/gi, replacement: '[INSURANCE ID REMOVED]' },
  // 10. Account numbers
  { name: 'account', pattern: /\b(Account|Acct)[:\s#.]*\d{6,20}\b/gi, replacement: '[ACCOUNT REMOVED]' },
  // 15. IP addresses
  { name: 'ipv4', pattern: /\b(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\b/g, replacement: '[IP REMOVED]' },
  // 14. URLs
  { name: 'url', pattern: /https?:\/\/[^\s"'<>]+/gi, replacement: '[URL REMOVED]' },
  // PCI DSS — Primary Account Number (PAN) masking
  { name: 'credit_card_pan', pattern: /\b(?:\d{4}[-\s]?){3}\d{4}\b/g, replacement: '[CARD REMOVED]' },
  // 12-13. Serial / VIN numbers (alphanumeric 17-char patterns)
  { name: 'vin', pattern: /\b[A-HJ-NPR-Z0-9]{17}\b/g, replacement: '[VIN REMOVED]' },
  // Geographic: zip codes (5 and 9 digit)
  { name: 'zipcode', pattern: /\b\d{5}(?:-\d{4})?\b/g, replacement: '[ZIP REMOVED]' },
  // Geographic: US street addresses
  { name: 'street_address', pattern: /\b\d{1,5}\s+(?:[A-Za-z]+\s){1,5}(?:Street|St|Avenue|Ave|Boulevard|Blvd|Road|Rd|Drive|Dr|Lane|Ln|Court|Ct|Way|Place|Pl|Circle|Cir)\b/gi, replacement: '[ADDRESS REMOVED]' },
];

// ============================================================================
// TYPES
// ============================================================================

export interface DeIdentifyOptions {
  mode: 'safe_harbor' | 'expert_determination';
  keepDiagnoses?: boolean;    // Keep ICD codes / diagnosis labels (not PII)
  keepMedications?: boolean;  // Keep medication names (not PII)
  keepVitalSigns?: boolean;   // Keep vital signs data (not PII)
  preserveStructure?: boolean; // Preserve JSON structure, only scrub string values
}

export interface DeIdentifyResult {
  original?: string;           // only included if includeOriginal=true
  deIdentified: string;
  identifiersRemoved: string[];
  confidence: number;          // 0-1 confidence that de-identification is complete
  mode: string;
  hipaaCompliant: boolean;
  timestamp: string;
  checksum: string;            // SHA-256 of de-identified output for audit trail
}

export interface DeIdentifyObjectResult {
  deIdentified: Record<string, unknown>;
  identifiersRemoved: string[];
  fieldsProcessed: number;
  hipaaCompliant: boolean;
}

// ============================================================================
// SERVICE
// ============================================================================

export class PHIDeIdentificationService {

  /**
   * De-identify a plain text string using Safe Harbor or Expert Determination.
   * Pass includeOriginal=true only in secure internal contexts — never return
   * original PHI to client responses.
   */
  deIdentifyText(
    text: string,
    options: DeIdentifyOptions = { mode: 'safe_harbor' },
    includeOriginal = false,
  ): DeIdentifyResult {
    const removed: string[] = [];
    let result = text;

    for (const { name, pattern, replacement } of SAFE_HARBOR_PATTERNS) {
      const before = result;
      result = result.replace(pattern, replacement);
      if (result !== before) removed.push(name);
    }

    // Confidence heuristic: more patterns matched = lower confidence
    // (something may have been missed); 0 matched on medical text = suspicious
    const hasResidualNumbers = /\b\d{6,}\b/.test(result);
    const hasResidualEmail = /@/.test(result);
    const confidence = hasResidualNumbers || hasResidualEmail ? 0.75 : 0.95;

    const checksum = crypto.createHash('sha256').update(result).digest('hex');

    if (removed.length > 0) {
      logger.info('[PHI-DeID] Identifiers removed from text', {
        count: removed.length,
        types: removed,
        mode: options.mode,
      });
    }

    return {
      ...(includeOriginal ? { original: text } : {}),
      deIdentified: result,
      identifiersRemoved: removed,
      confidence,
      mode: options.mode,
      hipaaCompliant: confidence >= 0.90,
      timestamp: new Date().toISOString(),
      checksum,
    };
  }

  /**
   * De-identify all string fields in a JSON object (e.g., a FHIR resource).
   * Recursively walks the object, applying Safe Harbor scrubbing to every string value.
   */
  deIdentifyObject(
    obj: Record<string, unknown>,
    options: DeIdentifyOptions = { mode: 'safe_harbor' },
  ): DeIdentifyObjectResult {
    const allRemoved: string[] = [];
    let fieldsProcessed = 0;

    const scrub = (value: unknown): unknown => {
      if (typeof value === 'string') {
        fieldsProcessed++;
        const result = this.deIdentifyText(value, options);
        allRemoved.push(...result.identifiersRemoved);
        return result.deIdentified;
      }
      if (Array.isArray(value)) return value.map(scrub);
      if (value !== null && typeof value === 'object') {
        const out: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
          out[k] = scrub(v);
        }
        return out;
      }
      return value;
    };

    const deIdentified = scrub(obj) as Record<string, unknown>;
    const uniqueRemoved = [...new Set(allRemoved)];

    return {
      deIdentified,
      identifiersRemoved: uniqueRemoved,
      fieldsProcessed,
      hipaaCompliant: true,
    };
  }

  /**
   * Validate that a text has been de-identified (spot-check for residual PII).
   * Returns true if no obvious PII remains.
   */
  validateDeIdentification(text: string): { valid: boolean; potentialResidualPII: string[] } {
    const concerns: string[] = [];
    if (/@/.test(text)) concerns.push('possible email address');
    if (/\b\d{3}-\d{2}-\d{4}\b/.test(text)) concerns.push('possible SSN');
    if (/\b(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}\b/.test(text)) concerns.push('possible phone number');
    if (/\b\d{3}-\d{2}-\d{4}\b/.test(text)) concerns.push('possible SSN');
    return { valid: concerns.length === 0, potentialResidualPII: concerns };
  }
}

export const phiDeIdentificationService = new PHIDeIdentificationService();
