/**
 * Service — P I I Detector
 *
 * Business logic service implementing platform capabilities.
 *
 * @exports scanForPII, containsPII, scanForKeywords, PIIDetection, PIIScanResult, PIIType
 * @module services/gateway/PIIDetector
 */

/**
 * CendiaGateway™ — PII Detection Engine
 * 
 * Detects personally identifiable information in AI prompts before
 * they reach external providers. Uses regex patterns for MVP;
 * production would add ML-based NER (Named Entity Recognition).
 */

export interface PIIDetection {
  type: PIIType;
  value: string;
  redacted: string;
  startIndex: number;
  endIndex: number;
  confidence: number;
}

export type PIIType = 
  | 'ssn'
  | 'credit_card'
  | 'email'
  | 'phone'
  | 'ip_address'
  | 'date_of_birth'
  | 'medical_record'
  | 'bank_account'
  | 'passport'
  | 'drivers_license'
  | 'address'
  | 'person_name'
  | 'financial_id';

export interface PIIScanResult {
  hasPII: boolean;
  detections: PIIDetection[];
  types: PIIType[];
  originalText: string;
  redactedText: string;
  scanDurationMs: number;
}

// PII pattern definitions with named capture groups
const PII_PATTERNS: Array<{ type: PIIType; pattern: RegExp; redactWith: string; confidence: number }> = [
  {
    type: 'ssn',
    pattern: /\b(\d{3}[-.\s]?\d{2}[-.\s]?\d{4})\b/g,
    redactWith: '[SSN REDACTED]',
    confidence: 0.95,
  },
  {
    type: 'credit_card',
    pattern: /\b(\d{4}[-.\s]?\d{4}[-.\s]?\d{4}[-.\s]?\d{4})\b/g,
    redactWith: '[CREDIT CARD REDACTED]',
    confidence: 0.95,
  },
  {
    type: 'email',
    pattern: /\b([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\b/g,
    redactWith: '[EMAIL REDACTED]',
    confidence: 0.99,
  },
  {
    type: 'phone',
    pattern: /\b(\+?1?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})\b/g,
    redactWith: '[PHONE REDACTED]',
    confidence: 0.85,
  },
  {
    type: 'ip_address',
    pattern: /\b(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\b/g,
    redactWith: '[IP REDACTED]',
    confidence: 0.90,
  },
  {
    type: 'date_of_birth',
    pattern: /\b((?:DOB|date of birth|born|birthday)[:\s]+\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})\b/gi,
    redactWith: '[DOB REDACTED]',
    confidence: 0.90,
  },
  {
    type: 'medical_record',
    pattern: /\b(MRN[:\s#]*\d{6,12}|patient\s*(?:id|number)[:\s#]*\d{4,12})\b/gi,
    redactWith: '[MEDICAL RECORD REDACTED]',
    confidence: 0.90,
  },
  {
    type: 'bank_account',
    pattern: /\b((?:account|acct|routing)[:\s#]*\d{8,17})\b/gi,
    redactWith: '[BANK ACCOUNT REDACTED]',
    confidence: 0.85,
  },
  {
    type: 'passport',
    pattern: /\b((?:passport)[:\s#]*[A-Z0-9]{6,12})\b/gi,
    redactWith: '[PASSPORT REDACTED]',
    confidence: 0.80,
  },
  {
    type: 'drivers_license',
    pattern: /\b((?:DL|driver'?s?\s*licen[sc]e)[:\s#]*[A-Z0-9]{5,15})\b/gi,
    redactWith: '[DL REDACTED]',
    confidence: 0.80,
  },
];

// =============================================================================
// HEURISTIC NER — Zero-dependency entity recognition for names, addresses,
// and contextual financial identifiers. Supplements regex patterns above.
// =============================================================================

/** Common name prefixes/titles that signal a person's name follows */
const NAME_TITLES = /\b(Mr\.?|Mrs\.?|Ms\.?|Dr\.?|Prof\.?|Sir|Dame|Hon\.?|Rev\.?|Sgt\.?|Cpl\.?|Lt\.?|Capt\.?|Maj\.?|Col\.?|Gen\.?)\s+/gi;

/** Contextual name triggers: "patient John Smith", "employee Jane Doe" */
const NAME_CONTEXT_TRIGGERS = /\b(patient|employee|client|customer|user|applicant|defendant|plaintiff|witness|claimant|beneficiary|insured|policyholder|member|subscriber|resident|tenant|borrower|guarantor)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})\b/g;

/** Title + capitalized name: "Dr. John Smith", "Mr. James O'Brien" */
const NAME_TITLE_PATTERN = /\b(?:Mr\.?|Mrs\.?|Ms\.?|Dr\.?|Prof\.?)\s+([A-Z][a-z]+(?:[-'][A-Z]?[a-z]+)?(?:\s+[A-Z][a-z]+(?:[-'][A-Z]?[a-z]+)?){1,3})\b/g;

/** US/UK street address patterns */
const ADDRESS_PATTERN = /\b(\d{1,5}\s+(?:[A-Z][a-z]+\s+){1,4}(?:St(?:reet)?|Ave(?:nue)?|Blvd|Boulevard|Dr(?:ive)?|Rd|Road|Ln|Lane|Ct|Court|Pl|Place|Way|Cir(?:cle)?|Pkwy|Hwy|Highway)\.?(?:\s*,?\s*(?:Apt|Suite|Unit|#)\s*\d+[A-Za-z]?)?(?:\s*,?\s*[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)?(?:\s*,?\s*[A-Z]{2}\s+\d{5}(?:-\d{4})?)?)\b/gi;

/** UK postcode */
const UK_POSTCODE = /\b([A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2})\b/gi;

/** IBAN (International Bank Account Number) */
const IBAN_PATTERN = /\b([A-Z]{2}\d{2}[A-Z0-9]{4,30})\b/g;

/** SWIFT/BIC code */
const SWIFT_PATTERN = /\b([A-Z]{4}[A-Z]{2}[A-Z0-9]{2}(?:[A-Z0-9]{3})?)\b/g;

/** Tax ID / EIN patterns */
const TAX_ID_PATTERN = /\b((?:EIN|TIN|tax\s*id|VAT)[:\s#]*[A-Z0-9\-]{6,15})\b/gi;

/** NER patterns — applied after regex patterns for additional coverage */
const NER_PATTERNS: Array<{
  type: PIIType;
  patterns: RegExp[];
  redactWith: string;
  confidence: number;
  validator?: (match: string) => boolean;
}> = [
  {
    type: 'person_name',
    patterns: [NAME_TITLE_PATTERN, NAME_CONTEXT_TRIGGERS],
    redactWith: '[NAME REDACTED]',
    confidence: 0.75,
  },
  {
    type: 'address',
    patterns: [ADDRESS_PATTERN, UK_POSTCODE],
    redactWith: '[ADDRESS REDACTED]',
    confidence: 0.80,
  },
  {
    type: 'financial_id',
    patterns: [IBAN_PATTERN, SWIFT_PATTERN, TAX_ID_PATTERN],
    redactWith: '[FINANCIAL ID REDACTED]',
    confidence: 0.80,
    validator: (match: string) => {
      // IBAN: validate length (15-34 chars) and starts with 2 letters + 2 digits
      if (/^[A-Z]{2}\d{2}/.test(match) && match.length >= 15) return true;
      // SWIFT: exactly 8 or 11 chars
      if (/^[A-Z]{6}[A-Z0-9]{2,5}$/.test(match)) return true;
      // Tax ID: must have keyword prefix
      if (/^(?:EIN|TIN|tax|VAT)/i.test(match)) return true;
      return false;
    },
  },
];

/**
 * Run heuristic NER patterns and return additional detections.
 * These supplement the regex-based patterns with contextual entity recognition.
 */
function runNERScan(text: string): PIIDetection[] {
  const detections: PIIDetection[] = [];

  for (const { type, patterns, redactWith, confidence, validator } of NER_PATTERNS) {
    for (const pattern of patterns) {
      const regex = new RegExp(pattern.source, pattern.flags);
      let match: RegExpExecArray | null;

      while ((match = regex.exec(text)) !== null) {
        // Use the last capture group (the actual entity) or full match
        const value = match[match.length - 1] || match[0];
        
        // Skip if validator rejects this match
        if (validator && !validator(value)) continue;

        // Skip very short matches (likely false positives)
        if (value.length < 4) continue;

        detections.push({
          type,
          value,
          redacted: redactWith,
          startIndex: match.index + (match[0].length - value.length),
          endIndex: match.index + match[0].length,
          confidence,
        });
      }
    }
  }

  return detections;
}

/**
 * Scans text for PII and optionally redacts it.
 * Uses a two-pass approach: fast regex patterns first, then heuristic NER.
 */
export function scanForPII(text: string): PIIScanResult {
  const startTime = Date.now();
  const detections: PIIDetection[] = [];
  let redactedText = text;

  // Pass 1: Fast regex patterns (structured PII — SSN, credit cards, emails, etc.)
  for (const { type, pattern, redactWith, confidence } of PII_PATTERNS) {
    const regex = new RegExp(pattern.source, pattern.flags);
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      const value = match[1] || match[0];
      detections.push({
        type,
        value,
        redacted: redactWith,
        startIndex: match.index,
        endIndex: match.index + match[0].length,
        confidence,
      });
    }
  }

  // Pass 2: Heuristic NER (names, addresses, financial identifiers)
  const nerDetections = runNERScan(text);
  for (const ner of nerDetections) {
    // Skip if this range overlaps with an existing regex detection
    const overlaps = detections.some(d =>
      (ner.startIndex >= d.startIndex && ner.startIndex < d.endIndex) ||
      (ner.endIndex > d.startIndex && ner.endIndex <= d.endIndex)
    );
    if (!overlaps) {
      detections.push(ner);
    }
  }

  // Sort by position (reverse) and redact
  const sortedDetections = [...detections].sort((a, b) => b.startIndex - a.startIndex);
  for (const detection of sortedDetections) {
    redactedText =
      redactedText.slice(0, detection.startIndex) +
      detection.redacted +
      redactedText.slice(detection.endIndex);
  }

  const types = [...new Set(detections.map(d => d.type))];

  return {
    hasPII: detections.length > 0,
    detections,
    types,
    originalText: text,
    redactedText,
    scanDurationMs: Date.now() - startTime,
  };
}

/**
 * Quick check — returns true if any PII is detected (no redaction).
 */
export function containsPII(text: string): boolean {
  for (const { pattern } of PII_PATTERNS) {
    const regex = new RegExp(pattern.source, pattern.flags);
    if (regex.test(text)) return true;
  }
  return false;
}

/**
 * Check text against custom blocked keywords.
 */
export function scanForKeywords(text: string, keywords: string[]): string[] {
  const found: string[] = [];
  const lowerText = text.toLowerCase();
  for (const keyword of keywords) {
    if (lowerText.includes(keyword.toLowerCase())) {
      found.push(keyword);
    }
  }
  return found;
}
