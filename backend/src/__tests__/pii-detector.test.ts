// =============================================================================
// UNIT TESTS — PII Detector
// =============================================================================
// Tests for the CendiaGateway PII detection engine.
// Covers all 10 regex PII types + heuristic NER (names, addresses, financial IDs).
// Run: cd backend && npx vitest run src/__tests__/pii-detector.test.ts

import { describe, it, expect } from 'vitest';
import { scanForPII, containsPII, scanForKeywords } from '../services/gateway/PIIDetector.js';

// =============================================================================
// SSN Detection
// =============================================================================
describe('PII: SSN', () => {
  it('detects standard SSN format (XXX-XX-XXXX)', () => {
    const result = scanForPII('My SSN is 123-45-6789');
    expect(result.hasPII).toBe(true);
    expect(result.types).toContain('ssn');
    expect(result.detections.find(d => d.type === 'ssn')?.value).toBe('123-45-6789');
  });

  it('detects SSN with dots', () => {
    const result = scanForPII('SSN: 123.45.6789');
    expect(result.hasPII).toBe(true);
    expect(result.types).toContain('ssn');
  });

  it('detects SSN with spaces', () => {
    const result = scanForPII('SSN: 123 45 6789');
    expect(result.hasPII).toBe(true);
    expect(result.types).toContain('ssn');
  });

  it('detects SSN without separators', () => {
    const result = scanForPII('SSN: 123456789');
    expect(result.hasPII).toBe(true);
    expect(result.types).toContain('ssn');
  });

  it('redacts SSN from text', () => {
    const result = scanForPII('My SSN is 123-45-6789 and I need help');
    expect(result.redactedText).toContain('[SSN REDACTED]');
    expect(result.redactedText).not.toContain('123-45-6789');
  });
});

// =============================================================================
// Credit Card Detection
// =============================================================================
describe('PII: Credit Card', () => {
  it('detects Visa-like card number with dashes', () => {
    const result = scanForPII('Card: 4111-1111-1111-1111');
    expect(result.hasPII).toBe(true);
    expect(result.types).toContain('credit_card');
  });

  it('detects card number with spaces', () => {
    const result = scanForPII('Card: 4111 1111 1111 1111');
    expect(result.hasPII).toBe(true);
    expect(result.types).toContain('credit_card');
  });

  it('detects card number without separators', () => {
    const result = scanForPII('Card: 4111111111111111');
    expect(result.hasPII).toBe(true);
    expect(result.types).toContain('credit_card');
  });

  it('redacts credit card from text', () => {
    const result = scanForPII('Pay with 4111-1111-1111-1111 please');
    expect(result.redactedText).toContain('[CREDIT CARD REDACTED]');
    expect(result.redactedText).not.toContain('4111');
  });
});

// =============================================================================
// Email Detection
// =============================================================================
describe('PII: Email', () => {
  it('detects standard email', () => {
    const result = scanForPII('Contact me at john.doe@example.com');
    expect(result.hasPII).toBe(true);
    expect(result.types).toContain('email');
    expect(result.detections.find(d => d.type === 'email')?.value).toBe('john.doe@example.com');
  });

  it('detects email with plus addressing', () => {
    const result = scanForPII('Send to user+tag@gmail.com');
    expect(result.hasPII).toBe(true);
    expect(result.types).toContain('email');
  });

  it('detects email with subdomain', () => {
    const result = scanForPII('Email: admin@mail.corp.example.com');
    expect(result.hasPII).toBe(true);
    expect(result.types).toContain('email');
  });

  it('redacts email from text', () => {
    const result = scanForPII('Email john.doe@example.com for details');
    expect(result.redactedText).toContain('[EMAIL REDACTED]');
  });
});

// =============================================================================
// Phone Detection
// =============================================================================
describe('PII: Phone', () => {
  it('detects US phone with dashes', () => {
    const result = scanForPII('Call me at 555-123-4567');
    expect(result.hasPII).toBe(true);
    expect(result.types).toContain('phone');
  });

  it('detects phone with parentheses', () => {
    const result = scanForPII('Phone: (555) 123-4567');
    expect(result.hasPII).toBe(true);
    expect(result.types).toContain('phone');
  });

  it('detects phone with country code', () => {
    const result = scanForPII('Call +1-555-123-4567');
    expect(result.hasPII).toBe(true);
    expect(result.types).toContain('phone');
  });

  it('redacts phone number', () => {
    const result = scanForPII('Reach me at 555-123-4567 anytime');
    expect(result.redactedText).toContain('[PHONE REDACTED]');
  });
});

// =============================================================================
// IP Address Detection
// =============================================================================
describe('PII: IP Address', () => {
  it('detects IPv4 address', () => {
    const result = scanForPII('Server IP: 192.168.1.100');
    expect(result.hasPII).toBe(true);
    expect(result.types).toContain('ip_address');
  });

  it('detects loopback address', () => {
    const result = scanForPII('Connect to 127.0.0.1');
    expect(result.hasPII).toBe(true);
    expect(result.types).toContain('ip_address');
  });

  it('redacts IP address', () => {
    const result = scanForPII('The server at 10.0.0.50 is down');
    expect(result.redactedText).toContain('[IP REDACTED]');
  });
});

// =============================================================================
// Date of Birth Detection
// =============================================================================
describe('PII: Date of Birth', () => {
  it('detects DOB with prefix', () => {
    const result = scanForPII('DOB: 01/15/1990');
    expect(result.hasPII).toBe(true);
    expect(result.types).toContain('date_of_birth');
  });

  it('detects "date of birth" prefix', () => {
    const result = scanForPII('date of birth: 03-22-1985');
    expect(result.hasPII).toBe(true);
    expect(result.types).toContain('date_of_birth');
  });

  it('detects "born" prefix', () => {
    const result = scanForPII('born 12/25/1970');
    expect(result.hasPII).toBe(true);
    expect(result.types).toContain('date_of_birth');
  });
});

// =============================================================================
// Medical Record Detection
// =============================================================================
describe('PII: Medical Record', () => {
  it('detects MRN with hash separator', () => {
    const result = scanForPII('MRN#12345678');
    expect(result.hasPII).toBe(true);
    expect(result.types).toContain('medical_record');
  });

  it('detects MRN with colon', () => {
    const result = scanForPII('MRN: 12345678');
    expect(result.hasPII).toBe(true);
    expect(result.types).toContain('medical_record');
  });

  it('detects patient ID', () => {
    const result = scanForPII('patient id: 987654');
    expect(result.hasPII).toBe(true);
    expect(result.types).toContain('medical_record');
  });

  it('detects patient number', () => {
    const result = scanForPII('patient number#12345678');
    expect(result.hasPII).toBe(true);
    expect(result.types).toContain('medical_record');
  });
});

// =============================================================================
// Bank Account Detection
// =============================================================================
describe('PII: Bank Account', () => {
  it('detects account number', () => {
    const result = scanForPII('account: 12345678901');
    expect(result.hasPII).toBe(true);
    expect(result.types).toContain('bank_account');
  });

  it('detects routing number', () => {
    const result = scanForPII('routing#123456789');
    expect(result.hasPII).toBe(true);
    expect(result.types).toContain('bank_account');
  });

  it('detects acct abbreviation', () => {
    const result = scanForPII('acct: 9876543210');
    expect(result.hasPII).toBe(true);
    expect(result.types).toContain('bank_account');
  });
});

// =============================================================================
// Passport Detection
// =============================================================================
describe('PII: Passport', () => {
  it('detects passport number', () => {
    const result = scanForPII('passport: AB1234567');
    expect(result.hasPII).toBe(true);
    expect(result.types).toContain('passport');
  });

  it('detects passport with hash', () => {
    const result = scanForPII('passport#C12345678');
    expect(result.hasPII).toBe(true);
    expect(result.types).toContain('passport');
  });
});

// =============================================================================
// Drivers License Detection
// =============================================================================
describe('PII: Drivers License', () => {
  it('detects DL abbreviation', () => {
    const result = scanForPII('DL: D12345678');
    expect(result.hasPII).toBe(true);
    expect(result.types).toContain('drivers_license');
  });

  it('detects "drivers license" full text', () => {
    const result = scanForPII("driver's license: ABC12345");
    expect(result.hasPII).toBe(true);
    expect(result.types).toContain('drivers_license');
  });
});

// =============================================================================
// Heuristic NER — Person Names
// =============================================================================
describe('PII NER: Person Names', () => {
  it('detects title + name (Dr. John Smith)', () => {
    const result = scanForPII('Dr. John Smith prescribed medication');
    expect(result.hasPII).toBe(true);
    expect(result.types).toContain('person_name');
  });

  it('detects title + name (Mr. James Wilson)', () => {
    const result = scanForPII('Mr. James Wilson signed the contract');
    expect(result.hasPII).toBe(true);
    expect(result.types).toContain('person_name');
  });

  it('detects contextual name (patient Jane Doe)', () => {
    const result = scanForPII('patient Jane Doe was admitted');
    expect(result.hasPII).toBe(true);
    expect(result.types).toContain('person_name');
  });

  it('detects contextual name (employee Robert Chen)', () => {
    const result = scanForPII('employee Robert Chen requested time off');
    expect(result.hasPII).toBe(true);
    expect(result.types).toContain('person_name');
  });
});

// =============================================================================
// Heuristic NER — Addresses
// =============================================================================
describe('PII NER: Addresses', () => {
  it('detects US street address', () => {
    const result = scanForPII('Lives at 123 Main Street, Springfield');
    expect(result.hasPII).toBe(true);
    expect(result.types).toContain('address');
  });

  it('detects address with apartment', () => {
    const result = scanForPII('Address: 456 Oak Avenue Apt 12');
    expect(result.hasPII).toBe(true);
    expect(result.types).toContain('address');
  });
});

// =============================================================================
// Heuristic NER — Financial Identifiers
// =============================================================================
describe('PII NER: Financial Identifiers', () => {
  it('detects EIN', () => {
    const result = scanForPII('EIN: 12-3456789');
    expect(result.hasPII).toBe(true);
    expect(result.types).toContain('financial_id');
  });

  it('detects tax ID (note: 9-digit tax IDs overlap with SSN regex)', () => {
    // A bare 9-digit number after "tax id:" matches the SSN regex first.
    // The NER overlap detection correctly prevents double-counting.
    const result = scanForPII('tax id: 987654321');
    expect(result.hasPII).toBe(true);
    // The SSN regex fires first on the 9-digit number
    expect(result.types).toContain('ssn');
  });

  it('detects VAT number as financial_id', () => {
    const result = scanForPII('VAT: GB123456789012');
    expect(result.hasPII).toBe(true);
    expect(result.types).toContain('financial_id');
  });
});

// =============================================================================
// Multiple PII in Single Text
// =============================================================================
describe('Multiple PII Detection', () => {
  it('detects SSN + email in same text', () => {
    const result = scanForPII('SSN 123-45-6789, email john@example.com');
    expect(result.hasPII).toBe(true);
    expect(result.types).toContain('ssn');
    expect(result.types).toContain('email');
    expect(result.detections.length).toBeGreaterThanOrEqual(2);
  });

  it('detects credit card + phone in same text', () => {
    const result = scanForPII('Card 4111-1111-1111-1111, call 555-123-4567');
    expect(result.hasPII).toBe(true);
    expect(result.types).toContain('credit_card');
    expect(result.types).toContain('phone');
  });

  it('redacts all PII types found', () => {
    const result = scanForPII('SSN 123-45-6789, email test@test.com, card 4111-1111-1111-1111');
    expect(result.redactedText).toContain('[SSN REDACTED]');
    expect(result.redactedText).toContain('[EMAIL REDACTED]');
    expect(result.redactedText).toContain('[CREDIT CARD REDACTED]');
    expect(result.redactedText).not.toContain('123-45-6789');
    expect(result.redactedText).not.toContain('test@test.com');
  });
});

// =============================================================================
// True Negatives — Clean Text
// =============================================================================
describe('True Negatives', () => {
  it('returns false for clean business text', () => {
    const result = scanForPII('The quarterly revenue report shows a 15% increase in sales.');
    expect(result.hasPII).toBe(false);
    expect(result.detections).toHaveLength(0);
    expect(result.redactedText).toBe(result.originalText);
  });

  it('returns false for empty string', () => {
    const result = scanForPII('');
    expect(result.hasPII).toBe(false);
  });

  it('returns false for technical content', () => {
    const result = scanForPII('Deploy the container using docker compose up -d with the production config.');
    expect(result.hasPII).toBe(false);
  });
});

// =============================================================================
// containsPII — Quick Check
// =============================================================================
describe('containsPII (quick check)', () => {
  it('returns true when PII is present', () => {
    expect(containsPII('My SSN is 123-45-6789')).toBe(true);
  });

  it('returns false when no PII', () => {
    expect(containsPII('This is a clean sentence.')).toBe(false);
  });

  it('returns true for email', () => {
    expect(containsPII('Contact user@example.com')).toBe(true);
  });
});

// =============================================================================
// scanForKeywords — Custom Blocked Keywords
// =============================================================================
describe('scanForKeywords', () => {
  it('finds matching keywords', () => {
    const found = scanForKeywords('This contains confidential salary data', ['confidential', 'salary']);
    expect(found).toContain('confidential');
    expect(found).toContain('salary');
  });

  it('is case-insensitive', () => {
    const found = scanForKeywords('Contains SECRET information', ['secret']);
    expect(found).toContain('secret');
  });

  it('returns empty array when no keywords match', () => {
    const found = scanForKeywords('Normal business text', ['classified', 'restricted']);
    expect(found).toHaveLength(0);
  });

  it('handles empty keyword list', () => {
    const found = scanForKeywords('Any text here', []);
    expect(found).toHaveLength(0);
  });
});

// =============================================================================
// Performance & Edge Cases
// =============================================================================
describe('Edge Cases', () => {
  it('handles very long text without crashing', () => {
    const longText = 'This is clean text. '.repeat(10000);
    const result = scanForPII(longText);
    expect(result.hasPII).toBe(false);
    expect(result.scanDurationMs).toBeDefined();
  });

  it('records scan duration', () => {
    const result = scanForPII('Quick scan of text with SSN 123-45-6789');
    expect(result.scanDurationMs).toBeGreaterThanOrEqual(0);
  });

  it('preserves original text in result', () => {
    const original = 'My SSN is 123-45-6789';
    const result = scanForPII(original);
    expect(result.originalText).toBe(original);
  });

  it('detection includes position data', () => {
    const result = scanForPII('SSN: 123-45-6789');
    const detection = result.detections[0];
    expect(detection.startIndex).toBeGreaterThanOrEqual(0);
    expect(detection.endIndex).toBeGreaterThan(detection.startIndex);
    expect(detection.confidence).toBeGreaterThan(0);
  });
});
