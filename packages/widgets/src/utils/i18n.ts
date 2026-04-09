/**
 * Internationalization utilities for Datacendia Web Components
 * Provides i18n hooks and translation management
 */

export interface TranslationDict {
  [key: string]: string | TranslationDict;
}

export interface LocaleConfig {
  code: string;
  name: string;
  rtl: boolean;
  translations: TranslationDict;
}

/**
 * Default English translations
 */
export const defaultTranslations: TranslationDict = {
  // Evidence Viewer
  evidenceViewer: {
    title: 'DCII Evidence Packet',
    version: 'Version',
    runId: 'Run ID',
    decision: 'Decision',
    confidence: 'Confidence',
    consensusReached: 'Consensus reached',
    consensusNotReached: 'No consensus',
    cryptographicIntegrity: 'Cryptographic Integrity',
    merkleRoot: 'Merkle Root',
    signature: 'Signature',
    algorithm: 'Algorithm',
    signedAt: 'Signed at',
    unsigned: 'Unsigned',
    agentContributions: 'Agent Contributions',
    regulatoryFrameworks: 'Regulatory Frameworks',
    verifyIntegrity: 'Verify Integrity',
    verifying: 'Verifying...',
    copyToClipboard: 'Copy to clipboard',
    clickToCopy: 'Click to copy',
    clickToExpand: 'Click to expand',
    clickToCollapse: 'Click to collapse',
  },
  // PII Scanner
  piiScanner: {
    title: 'PII Scanner',
    input: 'Input',
    loadSample: 'Load Sample',
    scanForPII: 'Scan for PII',
    scanning: 'Scanning...',
    placeholder: 'Paste or type text to scan for PII...',
    noPIIDetected: 'No PII detected',
    piiFound: 'Found {count} PII detection(s)',
    detections: 'Detections',
    redactedOutput: 'Redacted Output',
    scanDuration: 'Scanned in {duration}ms',
    policy: 'Policy',
    gdpr: 'GDPR',
    hipaa: 'HIPAA',
    custom: 'Custom',
  },
  // Council Status Badge
  councilStatusBadge: {
    completed: 'Completed',
    deliberating: 'Deliberating',
    pending: 'Pending',
    failed: 'Failed',
    crossExamination: 'Cross-Exam',
    inProgress: 'In Progress',
    confidence: 'Confidence',
    agents: 'Agents',
    status: 'Status',
    realTimeUpdates: 'Real-time updates',
    connected: 'Connected',
    disconnected: 'Disconnected',
    reconnecting: 'Reconnecting...',
  },
  // Common
  common: {
    loading: 'Loading...',
    error: 'Error',
    retry: 'Retry',
    close: 'Close',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    copy: 'Copy',
    copied: 'Copied!',
    failed: 'Failed',
    success: 'Success',
    warning: 'Warning',
    info: 'Information',
  },
};

/**
 * Supported locales
 */
export const supportedLocales: LocaleConfig[] = [
  {
    code: 'en',
    name: 'English',
    rtl: false,
    translations: defaultTranslations,
  },
  {
    code: 'es',
    name: 'Español',
    rtl: false,
    translations: Object.assign({}, defaultTranslations, {
      evidenceViewer: Object.assign({}, defaultTranslations.evidenceViewer, {
        title: 'Paquete de Evidencia DCII',
        confidence: 'Confianza',
        consensusReached: 'Consenso alcanzado',
        consensusNotReached: 'Sin consenso',
      }),
      piiScanner: Object.assign({}, defaultTranslations.piiScanner, {
        title: 'Escáner PII',
        placeholder: 'Pegue o escriba texto para escanear PII...',
        noPIIDetected: 'No se detectó PII',
        piiFound: 'Se encontraron {count} detección(es) de PII',
      }),
    }),
  },
  {
    code: 'fr',
    name: 'Français',
    rtl: false,
    translations: Object.assign({}, defaultTranslations, {
      evidenceViewer: Object.assign({}, defaultTranslations.evidenceViewer, {
        title: 'Paquet de Preuves DCII',
        confidence: 'Confiance',
        consensusReached: 'Consensus atteint',
        consensusNotReached: 'Pas de consensus',
      }),
      piiScanner: Object.assign({}, defaultTranslations.piiScanner, {
        title: 'Scanneur PII',
        placeholder: 'Collez ou tapez du texte à scanner pour les PII...',
        noPIIDetected: 'Aucun PII détecté',
        piiFound: '{count} détection(s) de PII trouvée(s)',
      }),
    }),
  },
  {
    code: 'de',
    name: 'Deutsch',
    rtl: false,
    translations: Object.assign({}, defaultTranslations, {
      evidenceViewer: Object.assign({}, defaultTranslations.evidenceViewer, {
        title: 'DCII-Beweispaket',
        confidence: 'Vertrauen',
        consensusReached: 'Konsens erreicht',
        consensusNotReached: 'Kein Konsens',
      }),
      piiScanner: Object.assign({}, defaultTranslations.piiScanner, {
        title: 'PII-Scanner',
        placeholder: 'Text einfügen oder eingeben zum Scannen auf PII...',
        noPIIDetected: 'Keine PII erkannt',
        piiFound: '{count} PII-Erkennung(en) gefunden',
      }),
    }),
  },
];

/**
 * I18n manager class
 */
export class I18nManager {
  private currentLocale: string = 'en';
  private translations: TranslationDict = defaultTranslations;
  private listeners: Set<() => void> = new Set();

  constructor() {
    // Detect browser locale
    const browserLocale = navigator.language.split('-')[0];
    if (supportedLocales.some(locale => locale.code === browserLocale)) {
      this.currentLocale = browserLocale;
    }
    this.updateTranslations();
  }

  setLocale(localeCode: string) {
    const locale = supportedLocales.find(l => l.code === localeCode);
    if (locale) {
      this.currentLocale = localeCode;
      this.updateTranslations();
      this.notifyListeners();
    }
  }

  getCurrentLocale(): string {
    return this.currentLocale;
  }

  getCurrentLocaleConfig(): LocaleConfig | undefined {
    return supportedLocales.find(l => l.code === this.currentLocale);
  }

  getSupportedLocales(): LocaleConfig[] {
    return supportedLocales;
  }

  translate(key: string, params?: Record<string, string | number>): string {
    const keys = key.split('.');
    let value: any = this.translations;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }

    if (typeof value !== 'string') {
      return key;
    }

    // Replace parameters
    if (params) {
      return value.replace(/\{(\w+)\}/g, (match, param) => {
        return params[param]?.toString() || match;
      });
    }

    return value;
  }

  private updateTranslations() {
    const locale = supportedLocales.find(l => l.code === this.currentLocale);
    this.translations = locale?.translations || defaultTranslations;
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

/**
 * Global i18n instance
 */
export const i18n = new I18nManager();

/**
 * Hook for components to use translations
 */
export function useTranslation() {
  const [locale, setLocale] = useState(i18n.getCurrentLocale());

  useEffect(() => {
    const unsubscribe = i18n.subscribe(() => {
      setLocale(i18n.getCurrentLocale());
    });
    return unsubscribe;
  }, []);

  return {
    locale,
    setLocale: (code: string) => i18n.setLocale(code),
    t: (key: string, params?: Record<string, string | number>) => i18n.translate(key, params),
    isRTL: i18n.getCurrentLocaleConfig()?.rtl || false,
    supportedLocales: i18n.getSupportedLocales(),
  };
}

/**
 * React-like hooks for Web Components
 */
function useState<T>(initialValue: T): [T, (value: T) => void] {
  let value = initialValue;
  return [
    value,
    (newValue: T) => {
      value = newValue;
      // Trigger re-render in actual implementation
    }
  ];
}

function useEffect(callback: () => (() => void) | void, deps?: any[]): void {
  // Implementation for Web Components would need custom reactivity
  callback();
}
