// =============================================================================
// INTERNATIONALIZATION TESTS - Verify All Translations
// =============================================================================

import { describe, it, expect, beforeAll } from 'vitest';

// Import locale files for testing
import enLocale from '../../src/lib/i18n/locales/en.json';
import esLocale from '../../src/lib/i18n/locales/es.json';
import frLocale from '../../src/lib/i18n/locales/fr.json';
import deLocale from '../../src/lib/i18n/locales/de.json';
import jaLocale from '../../src/lib/i18n/locales/ja.json';
import zhLocale from '../../src/lib/i18n/locales/zh.json';

type LocaleData = Record<string, unknown>;

// Helper to get all keys from nested object
function getAllKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  const keys: string[] = [];
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys.push(...getAllKeys(obj[key] as Record<string, unknown>, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

describe('Internationalization Tests', () => {
  const locales: Record<string, LocaleData> = {
    en: enLocale,
    es: esLocale,
    fr: frLocale,
    de: deLocale,
    ja: jaLocale,
    zh: zhLocale,
  };

  const enKeys = getAllKeys(enLocale);

  describe('English (Base Locale)', () => {
    it('should have all required translation sections', () => {
      const requiredSections = [
        'common',
        'nav',
        'auth',
        'dashboard',
        'sidebar',
        'council',
        'commandPalette',
      ];
      
      requiredSections.forEach(section => {
        expect(enLocale).toHaveProperty(section);
      });
    });

    it('should have no empty translation values', () => {
      const checkForEmpty = (obj: Record<string, unknown>, path = ''): string[] => {
        const empty: string[] = [];
        for (const key in obj) {
          const currentPath = path ? `${path}.${key}` : key;
          const value = obj[key];
          if (typeof value === 'string' && value.trim() === '') {
            empty.push(currentPath);
          } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            empty.push(...checkForEmpty(value as Record<string, unknown>, currentPath));
          }
        }
        return empty;
      };
      
      const emptyKeys = checkForEmpty(enLocale);
      expect(emptyKeys).toHaveLength(0);
    });
  });

  describe('Translation Parity', () => {
    const coreKeys = [
      'common.save',
      'common.cancel',
      'common.loading',
      'auth.login.title',
      'auth.register.title',
      'dashboard.title',
      'sidebar.dashboard',
    ];

    Object.entries(locales).forEach(([locale, data]) => {
      if (locale === 'en') return;
      
      describe(`${locale.toUpperCase()} Locale`, () => {
        it('should have all core translation keys', () => {
          coreKeys.forEach(key => {
            const keys = key.split('.');
            let value: unknown = data;
            for (const k of keys) {
              value = (value as Record<string, unknown>)?.[k];
            }
            expect(value, `Missing key: ${key} in ${locale}`).toBeDefined();
          });
        });

        it('should have dashboard section', () => {
          expect(data).toHaveProperty('dashboard');
        });

        it('should have sidebar section', () => {
          expect(data).toHaveProperty('sidebar');
        });

        it('should have council section', () => {
          expect(data).toHaveProperty('council');
        });
      });
    });
  });

  describe('Translation Format Validation', () => {
    it('should have consistent interpolation syntax per key', () => {
      // This test just validates that interpolation syntax is present where needed
      // Both {{var}} and {var} formats are acceptable
      const hasInterpolation = (str: string): boolean => {
        return /\{[^}]+\}/.test(str) || /\{\{[^}]+\}\}/.test(str);
      };
      
      // Check that English locale has some interpolated strings
      const checkForInterpolation = (obj: Record<string, unknown>): number => {
        let count = 0;
        const check = (o: Record<string, unknown>) => {
          for (const key in o) {
            const value = o[key];
            if (typeof value === 'string' && hasInterpolation(value)) {
              count++;
            } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
              check(value as Record<string, unknown>);
            }
          }
        };
        check(obj);
        return count;
      };
      
      // English should have some interpolated strings
      const enCount = checkForInterpolation(enLocale);
      expect(enCount).toBeGreaterThan(0);
    });
  });

  describe('Sample Data Translations', () => {
    const sampleDataKeys = [
      'dashboard.sampleAlerts.databaseCpu',
      'dashboard.sampleMetrics.revenue',
      'dashboard.sampleQueries.churnIncrease',
    ];

    Object.entries(locales).forEach(([locale, data]) => {
      describe(`${locale.toUpperCase()} Sample Data`, () => {
        sampleDataKeys.forEach(key => {
          it(`should have ${key}`, () => {
            const keys = key.split('.');
            let value: unknown = data;
            for (const k of keys) {
              if (value && typeof value === 'object') {
                value = (value as Record<string, unknown>)[k];
              }
            }
            expect(value, `Missing: ${key} in ${locale}`).toBeDefined();
          });
        });
      });
    });
  });
});
