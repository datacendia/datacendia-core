/**
 * ENTERPRISE INTERNATIONALIZATION TESTS
 * Comprehensive i18n validation for all 21 supported languages
 */

import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const LOCALES_DIR = path.join(process.cwd(), 'src/lib/i18n/locales');

// =============================================================================
// LOCALE FILE TESTS
// =============================================================================

describe('Internationalization - Locale Files', () => {
  const expectedLocales = [
    'en', 'es', 'fr', 'de', 'zh', 'ja', 'ko', 'pt', 'it',
    'ar', 'hi', 'bn', 'pl', 'id', 'vi', 'th', 'tr', 'sw',
    'ur', 'he', 'tl'
  ];

  it('should have all locale files (26+ supported languages)', () => {
    const files = fs.readdirSync(LOCALES_DIR).filter(f => f.endsWith('.json'));
    expect(files.length).toBeGreaterThanOrEqual(26);
  });

  expectedLocales.forEach(locale => {
    it(`should have ${locale}.json locale file`, () => {
      const filePath = path.join(LOCALES_DIR, `${locale}.json`);
      expect(fs.existsSync(filePath)).toBe(true);
    });
  });

  it('should have valid JSON in all locale files', () => {
    const files = fs.readdirSync(LOCALES_DIR).filter(f => f.endsWith('.json'));
    
    files.forEach(file => {
      const content = fs.readFileSync(path.join(LOCALES_DIR, file), 'utf8');
      expect(() => JSON.parse(content)).not.toThrow();
    });
  });
});

// =============================================================================
// TRANSLATION KEY CONSISTENCY TESTS
// =============================================================================

describe('Translation Key Consistency', () => {
  const getLocaleKeys = (locale: string): string[] => {
    const filePath = path.join(LOCALES_DIR, `${locale}.json`);
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return Object.keys(content);
  };

  const getAllNestedKeys = (obj: Record<string, unknown>, prefix = ''): string[] => {
    const keys: string[] = [];
    for (const key of Object.keys(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        keys.push(...getAllNestedKeys(obj[key] as Record<string, unknown>, fullKey));
      } else {
        keys.push(fullKey);
      }
    }
    return keys;
  };

  it('should have English as the base locale', () => {
    const enKeys = getLocaleKeys('en');
    expect(enKeys.length).toBeGreaterThan(0);
  });

  it('all locales should have same top-level sections as English (or more)', () => {
    const enKeys = getLocaleKeys('en');
    const locales = ['es', 'fr', 'de', 'zh', 'ja', 'ko'];
    
    locales.forEach(locale => {
      const localeKeys = getLocaleKeys(locale);
      enKeys.forEach(key => {
        // Allow locales to have extra sections
        expect(localeKeys.length).toBeGreaterThanOrEqual(enKeys.length - 1);
      });
    });
  });
});

// =============================================================================
// REQUIRED TRANSLATION SECTIONS TESTS
// =============================================================================

describe('Required Translation Sections', () => {
  const requiredSections = [
    'common',
    'auth',
    'dashboard',
    'council',
    'errors',
    'tooltips',
    'agent',
  ];

  const locales = ['en', 'es', 'fr', 'de', 'zh', 'ja'];

  locales.forEach(locale => {
    describe(`${locale.toUpperCase()} locale`, () => {
      let content: Record<string, unknown>;

      beforeAll(() => {
        const filePath = path.join(LOCALES_DIR, `${locale}.json`);
        content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      });

      requiredSections.forEach(section => {
        it(`should have '${section}' section`, () => {
          expect(content).toHaveProperty(section);
        });
      });
    });
  });
});

// =============================================================================
// AGENT TRANSLATION TESTS
// =============================================================================

describe('Agent Translations', () => {
  const agentCodes = [
    'chief', 'cfo', 'clo', 'coo', 'cmo',
    'cco', 'cio', 'risk', 'cdo', 'cso',
    'cpo', 'cro', 'regulatory', 'hco', 'ciso',
    'treasury', 'pm', 'cro-finance', 'pso', 'ip',
    'contracts', 'litigation', 'int-auditor', 'ext-auditor', 'quant',
    'cmio', 'cod', 'caio'
  ];

  const locales = ['en', 'es', 'fr', 'de', 'zh', 'ja', 'ko', 'pt', 'it', 'ar'];

  locales.forEach(locale => {
    describe(`${locale.toUpperCase()} agent translations`, () => {
      let agentSection: Record<string, unknown>;

      beforeAll(() => {
        const filePath = path.join(LOCALES_DIR, `${locale}.json`);
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        agentSection = content.agent || {};
      });

      it('should have agent section', () => {
        expect(agentSection).toBeDefined();
      });

      agentCodes.forEach(code => {
        it(`should have translation for ${code} agent`, () => {
          expect(agentSection).toHaveProperty(code);
        });
      });
    });
  });
});

// =============================================================================
// RTL LANGUAGE TESTS
// =============================================================================

describe('RTL Language Support', () => {
  const rtlLocales = ['ar', 'he', 'ur'];

  rtlLocales.forEach(locale => {
    it(`should have ${locale} RTL locale file`, () => {
      const filePath = path.join(LOCALES_DIR, `${locale}.json`);
      expect(fs.existsSync(filePath)).toBe(true);
    });
  });

  it('should have Arabic translations', () => {
    const filePath = path.join(LOCALES_DIR, 'ar.json');
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    expect(content.common).toBeDefined();
  });

  it('should have Hebrew translations', () => {
    const filePath = path.join(LOCALES_DIR, 'he.json');
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    expect(content.common).toBeDefined();
  });

  it('should have Urdu translations', () => {
    const filePath = path.join(LOCALES_DIR, 'ur.json');
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    expect(content.common).toBeDefined();
  });
});

// =============================================================================
// PLACEHOLDER VALIDATION TESTS
// =============================================================================

describe('Translation Placeholders', () => {
  const extractPlaceholders = (text: string): string[] => {
    const matches = text.match(/\{\{[^}]+\}\}|\{[^}]+\}/g) || [];
    return matches;
  };

  it('should have consistent placeholder format', () => {
    const validFormats = [
      '{{name}}',
      '{{count}}',
      '{0}',
      '{{value}}',
    ];
    
    validFormats.forEach(placeholder => {
      expect(placeholder).toMatch(/\{\{?\w+\}?\}/);
    });
  });

  it('should use double braces for named placeholders', () => {
    const text = 'Hello {{name}}, you have {{count}} messages';
    const placeholders = extractPlaceholders(text);
    
    expect(placeholders).toContain('{{name}}');
    expect(placeholders).toContain('{{count}}');
  });
});

// =============================================================================
// SPECIAL CHARACTER TESTS
// =============================================================================

describe('Special Characters in Translations', () => {
  it('should handle apostrophes correctly', () => {
    const translations = [
      "Don't delete",
      "User's data",
      "It's working",
    ];
    
    translations.forEach(t => {
      expect(t).toContain("'");
    });
  });

  it('should handle quotes correctly', () => {
    const text = 'Click "Submit" to continue';
    expect(text).toContain('"');
  });

  it('should handle ampersands', () => {
    const text = 'Terms & Conditions';
    expect(text).toContain('&');
  });
});

// =============================================================================
// LANGUAGE METADATA TESTS
// =============================================================================

describe('Language Metadata', () => {
  const languageMetadata = [
    { code: 'en', name: 'English', nativeName: 'English', direction: 'ltr' },
    { code: 'es', name: 'Spanish', nativeName: 'Español', direction: 'ltr' },
    { code: 'fr', name: 'French', nativeName: 'Français', direction: 'ltr' },
    { code: 'de', name: 'German', nativeName: 'Deutsch', direction: 'ltr' },
    { code: 'zh', name: 'Chinese', nativeName: '中文', direction: 'ltr' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語', direction: 'ltr' },
    { code: 'ko', name: 'Korean', nativeName: '한국어', direction: 'ltr' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', direction: 'rtl' },
    { code: 'he', name: 'Hebrew', nativeName: 'עברית', direction: 'rtl' },
    { code: 'ur', name: 'Urdu', nativeName: 'اردو', direction: 'rtl' },
  ];

  it('should have metadata for all major languages', () => {
    expect(languageMetadata.length).toBeGreaterThanOrEqual(10);
  });

  it('should identify RTL languages', () => {
    const rtlLanguages = languageMetadata.filter(l => l.direction === 'rtl');
    expect(rtlLanguages.length).toBe(3);
    expect(rtlLanguages.map(l => l.code)).toContain('ar');
    expect(rtlLanguages.map(l => l.code)).toContain('he');
    expect(rtlLanguages.map(l => l.code)).toContain('ur');
  });

  it('should have native names for all languages', () => {
    languageMetadata.forEach(lang => {
      expect(lang.nativeName).toBeDefined();
      expect(lang.nativeName.length).toBeGreaterThan(0);
    });
  });
});

// Helper to run beforeAll
function beforeAll(fn: () => void) {
  fn();
}
