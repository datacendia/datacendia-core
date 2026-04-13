// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

export type SupportedLanguage = 'en' | 'es' | 'fr' | 'de' | 'pt' | 'ja' | 'zh' | 'ko' | 'ar' | 'hi';

export const SUPPORTED_LANGUAGES: Record<SupportedLanguage, { name: string; nativeName: string; direction: 'ltr' | 'rtl' }> = {
  en: { name: 'English', nativeName: 'English', direction: 'ltr' },
  es: { name: 'Spanish', nativeName: 'Español', direction: 'ltr' },
  fr: { name: 'French', nativeName: 'Français', direction: 'ltr' },
  de: { name: 'German', nativeName: 'Deutsch', direction: 'ltr' },
  pt: { name: 'Portuguese', nativeName: 'Português', direction: 'ltr' },
  ja: { name: 'Japanese', nativeName: '日本語', direction: 'ltr' },
  zh: { name: 'Chinese', nativeName: '中文', direction: 'ltr' },
  ko: { name: 'Korean', nativeName: '한국어', direction: 'ltr' },
  ar: { name: 'Arabic', nativeName: 'العربية', direction: 'rtl' },
  hi: { name: 'Hindi', nativeName: 'हिन्दी', direction: 'ltr' },
};

export const BASE_TRANSLATIONS: Record<string, Record<SupportedLanguage, string>> = {
  'nav.dashboard': { en: 'Dashboard', es: 'Panel', fr: 'Tableau de bord', de: 'Dashboard', pt: 'Painel', ja: 'ダッシュボード', zh: '仪表板', ko: '대시보드', ar: 'لوحة القيادة', hi: 'डैशबोर्ड' },
  'nav.council': { en: 'AI Council', es: 'Consejo IA', fr: 'Conseil IA', de: 'KI-Rat', pt: 'Conselho IA', ja: 'AIカウンシル', zh: 'AI委员会', ko: 'AI 위원회', ar: 'مجلس الذكاء الاصطناعي', hi: 'AI परिषद' },
  'nav.settings': { en: 'Settings', es: 'Configuración', fr: 'Paramètres', de: 'Einstellungen', pt: 'Configurações', ja: '設定', zh: '设置', ko: '설정', ar: 'الإعدادات', hi: 'सेटिंग्स' },
  'common.save': { en: 'Save', es: 'Guardar', fr: 'Sauvegarder', de: 'Speichern', pt: 'Salvar', ja: '保存', zh: '保存', ko: '저장', ar: 'حفظ', hi: 'सहेजें' },
  'common.cancel': { en: 'Cancel', es: 'Cancelar', fr: 'Annuler', de: 'Abbrechen', pt: 'Cancelar', ja: 'キャンセル', zh: '取消', ko: '취소', ar: 'إلغاء', hi: 'रद्द करें' },
};

class TranslationServiceImpl {
  private overrides = new Map<string, Record<string, string>>();
  private userPreferences = new Map<string, SupportedLanguage>();

  getSupportedLanguages() { return SUPPORTED_LANGUAGES; }

  translate(key: string, language: SupportedLanguage = 'en'): string {
    const override = this.overrides.get(key);
    if (override?.[language]) return override[language]!;
    return BASE_TRANSLATIONS[key]?.[language] || BASE_TRANSLATIONS[key]?.en || key;
  }

  translateBatch(keys: string[], language: SupportedLanguage = 'en'): Record<string, string> {
    const result: Record<string, string> = {};
    for (const key of keys) result[key] = this.translate(key, language);
    return result;
  }

  setOverride(key: string, language: SupportedLanguage, value: string) {
    if (!this.overrides.has(key)) this.overrides.set(key, {});
    this.overrides.get(key)![language] = value;
  }

  getAllTranslations(language: SupportedLanguage = 'en') {
    const result: Record<string, string> = {};
    for (const [key, translations] of Object.entries(BASE_TRANSLATIONS)) {
      result[key] = translations[language] || translations.en;
    }
    return result;
  }

  async translateContent(content: string, targetLanguage: SupportedLanguage): Promise<string> {
    if (targetLanguage === 'en') return content;
    const langInfo = SUPPORTED_LANGUAGES[targetLanguage];
    return `[${langInfo.nativeName}] ${content}`;
  }

  async translateDeliberation(data: { question: string; messages: { agent: string; content: string }[]; decision?: string }, targetLanguage: SupportedLanguage) {
    const question = await this.translateContent(data.question, targetLanguage);
    const messages = await Promise.all(data.messages.map(async m => ({ agent: m.agent, content: await this.translateContent(m.content, targetLanguage) })));
    const decision = data.decision ? await this.translateContent(data.decision, targetLanguage) : undefined;
    return { question, messages, decision };
  }

  async getUserPreference(userId: string): Promise<SupportedLanguage> {
    return this.userPreferences.get(userId) || 'en';
  }

  async setUserPreference(userId: string, language: SupportedLanguage) {
    this.userPreferences.set(userId, language);
  }

  async clearCache(_language?: string) { /* no-op for in-memory impl */ }

  async getStats() {
    return { supportedLanguages: Object.keys(SUPPORTED_LANGUAGES).length, baseTranslations: Object.keys(BASE_TRANSLATIONS).length, overrides: this.overrides.size, userPreferences: this.userPreferences.size };
  }
}

export const translationService = new TranslationServiceImpl();
