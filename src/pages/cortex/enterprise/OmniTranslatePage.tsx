// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIA OMNITRANSLATE™ - 100-LANGUAGE ENTERPRISE TRANSLATOR
// Real-Time Translation for Global Enterprise Operations
// "Breaking Language Barriers Across Your Entire Organization"
//
// CAPABILITIES:
// - 100+ language pairs
// - Real-time meeting translation
// - Document translation with formatting preservation
// - Email/chat translation
// - Voice-to-voice translation
// - Industry-specific terminology
// - Brand voice consistency
// - Context-aware translation
// =============================================================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { decisionIntelApi } from '../../../lib/api';

// =============================================================================
// TYPES
// =============================================================================

type TranslationType = 'document' | 'meeting' | 'email' | 'chat' | 'voice' | 'website';
type QualityLevel = 'draft' | 'business' | 'professional' | 'legal' | 'certified';

interface UploadedDocument {
  id: string;
  name: string;
  size: number;
  type: string;
  content: string;
  uploadedAt: Date;
  wordCount: number;
  detectedLanguage: string;
}

interface DocumentTranslation {
  languageCode: string;
  languageName: string;
  status: 'pending' | 'translating' | 'complete' | 'error';
  progress: number;
  translatedContent: string;
  wordCount: number;
  completedAt?: Date;
}

interface Language {
  code: string;
  name: string;
  nativeName: string;
  region: string;
  supported: TranslationType[];
  qualityScore: number;
}

interface TranslationJob {
  id: string;
  type: TranslationType;
  sourceLanguage: string;
  targetLanguage: string;
  status: 'queued' | 'processing' | 'review' | 'complete' | 'failed';
  progress: number;
  sourceWordCount: number;
  targetWordCount: number;
  qualityLevel: QualityLevel;
  createdAt: Date;
  completedAt?: Date;
  requestedBy: string;
  department: string;
  cost: number;
}

interface LiveSession {
  id: string;
  type: 'meeting' | 'call' | 'presentation';
  name: string;
  sourceLanguage: string;
  targetLanguages: string[];
  participants: number;
  duration: number;
  wordsTranslated: number;
  status: 'active' | 'paused' | 'ended';
  startedAt: Date;
}

interface TerminologyGlossary {
  id: string;
  name: string;
  industry: string;
  termCount: number;
  languages: string[];
  lastUpdated: Date;
  usageCount: number;
}

interface TranslationMetrics {
  totalWordsTranslated: number;
  documentsProcessed: number;
  meetingsTranslated: number;
  activeLanguages: number;
  avgQualityScore: number;
  avgTurnaround: number;
  costSavings: number;
  glossaryTerms: number;
}

interface LanguageUsage {
  language: string;
  wordCount: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
}

// =============================================================================
// MOCK DATA
// =============================================================================

// 100+ Languages - matching backend CendiaOmniTranslateService
const LANGUAGES: Language[] = [
  // Major World Languages
  { code: 'en', name: 'English', nativeName: 'English', region: 'Global', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 99 },
  { code: 'zh', name: 'Chinese (Simplified)', nativeName: '简体中文', region: 'Asia', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 97 },
  { code: 'zh-TW', name: 'Chinese (Traditional)', nativeName: '繁體中文', region: 'Asia', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 97 },
  { code: 'es', name: 'Spanish', nativeName: 'Español', region: 'Americas/Europe', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 98 },
  { code: 'fr', name: 'French', nativeName: 'Français', region: 'Europe/Africa', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 98 },
  { code: 'de', name: 'German', nativeName: 'Deutsch', region: 'Europe', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 98 },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', region: 'Europe', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 97 },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', region: 'Americas/Europe', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 97 },
  { code: 'pt-BR', name: 'Portuguese (Brazil)', nativeName: 'Português (Brasil)', region: 'Americas', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 97 },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', region: 'Europe', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 96 },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', region: 'Europe', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 95 },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', region: 'Europe/Asia', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 95 },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', region: 'Europe', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 94 },
  // Asian Languages
  { code: 'ja', name: 'Japanese', nativeName: '日本語', region: 'Asia', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 96 },
  { code: 'ko', name: 'Korean', nativeName: '한국어', region: 'Asia', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 96 },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', region: 'Asia', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 93 },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', region: 'Asia', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 94 },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', region: 'Asia', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 94 },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', region: 'Asia', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 93 },
  { code: 'tl', name: 'Filipino', nativeName: 'Filipino', region: 'Asia', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 92 },
  { code: 'my', name: 'Burmese', nativeName: 'မြန်မာဘာသာ', region: 'Asia', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 88 },
  { code: 'km', name: 'Khmer', nativeName: 'ខ្មែរ', region: 'Asia', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 87 },
  { code: 'lo', name: 'Lao', nativeName: 'ລາວ', region: 'Asia', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 86 },
  // South Asian Languages
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', region: 'South Asia', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 93 },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', region: 'South Asia', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 91 },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', region: 'South Asia', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 90 },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', region: 'South Asia', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 89 },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', region: 'South Asia', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 88 },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', region: 'South Asia', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 88 },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', region: 'South Asia', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 90 },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', region: 'South Asia', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 89 },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', region: 'South Asia', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 88 },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', region: 'South Asia', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 88 },
  { code: 'si', name: 'Sinhala', nativeName: 'සිංහල', region: 'South Asia', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 86 },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', region: 'South Asia', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 87 },
  // Middle Eastern Languages
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', region: 'Middle East/Africa', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 94 },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', region: 'Middle East', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 93 },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', region: 'Middle East', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 91 },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', region: 'Middle East/Europe', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 94 },
  { code: 'ku', name: 'Kurdish', nativeName: 'Kurdî', region: 'Middle East', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 85 },
  { code: 'ps', name: 'Pashto', nativeName: 'پښتو', region: 'Middle East', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 84 },
  // African Languages
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', region: 'Africa', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 90 },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', region: 'Africa', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 86 },
  { code: 'ha', name: 'Hausa', nativeName: 'Hausa', region: 'Africa', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 85 },
  { code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá', region: 'Africa', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 84 },
  { code: 'ig', name: 'Igbo', nativeName: 'Igbo', region: 'Africa', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 83 },
  { code: 'zu', name: 'Zulu', nativeName: 'isiZulu', region: 'Africa', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 85 },
  { code: 'xh', name: 'Xhosa', nativeName: 'isiXhosa', region: 'Africa', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 84 },
  { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans', region: 'Africa', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 93 },
  { code: 'so', name: 'Somali', nativeName: 'Soomaali', region: 'Africa', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 82 },
  { code: 'rw', name: 'Kinyarwanda', nativeName: 'Kinyarwanda', region: 'Africa', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 81 },
  // European Languages
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', region: 'Europe', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 96 },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', region: 'Europe', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 95 },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', region: 'Europe', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 95 },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', region: 'Europe', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 94 },
  { code: 'is', name: 'Icelandic', nativeName: 'Íslenska', region: 'Europe', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 89 },
  { code: 'et', name: 'Estonian', nativeName: 'Eesti', region: 'Europe', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 91 },
  { code: 'lv', name: 'Latvian', nativeName: 'Latviešu', region: 'Europe', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 90 },
  { code: 'lt', name: 'Lithuanian', nativeName: 'Lietuvių', region: 'Europe', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 90 },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', region: 'Europe', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 94 },
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina', region: 'Europe', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 93 },
  { code: 'sl', name: 'Slovenian', nativeName: 'Slovenščina', region: 'Europe', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 92 },
  { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski', region: 'Europe', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 92 },
  { code: 'sr', name: 'Serbian', nativeName: 'Српски', region: 'Europe', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 91 },
  { code: 'bs', name: 'Bosnian', nativeName: 'Bosanski', region: 'Europe', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 91 },
  { code: 'mk', name: 'Macedonian', nativeName: 'Македонски', region: 'Europe', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 89 },
  { code: 'bg', name: 'Bulgarian', nativeName: 'Български', region: 'Europe', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 92 },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', region: 'Europe', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 93 },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', region: 'Europe', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 92 },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', region: 'Europe', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 93 },
  { code: 'sq', name: 'Albanian', nativeName: 'Shqip', region: 'Europe', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 88 },
  { code: 'be', name: 'Belarusian', nativeName: 'Беларуская', region: 'Europe', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 87 },
  { code: 'ka', name: 'Georgian', nativeName: 'ქართული', region: 'Europe', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 86 },
  { code: 'hy', name: 'Armenian', nativeName: 'Հայdelays', region: 'Europe', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 85 },
  { code: 'az', name: 'Azerbaijani', nativeName: 'Azərbaycan', region: 'Europe/Asia', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 87 },
  // Central Asian Languages
  { code: 'kk', name: 'Kazakh', nativeName: 'Қазақша', region: 'Asia', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 85 },
  { code: 'uz', name: 'Uzbek', nativeName: 'Oʻzbekcha', region: 'Asia', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 84 },
  { code: 'tg', name: 'Tajik', nativeName: 'Тоҷикӣ', region: 'Asia', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 83 },
  { code: 'ky', name: 'Kyrgyz', nativeName: 'Кыргызча', region: 'Asia', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 82 },
  { code: 'tk', name: 'Turkmen', nativeName: 'Türkmen', region: 'Asia', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 81 },
  { code: 'mn', name: 'Mongolian', nativeName: 'Монгол', region: 'Asia', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 84 },
  // Celtic Languages
  { code: 'ga', name: 'Irish', nativeName: 'Gaeilge', region: 'Europe', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 86 },
  { code: 'cy', name: 'Welsh', nativeName: 'Cymraeg', region: 'Europe', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 87 },
  { code: 'gd', name: 'Scottish Gaelic', nativeName: 'Gàidhlig', region: 'Europe', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 82 },
  // Other European Languages
  { code: 'mt', name: 'Maltese', nativeName: 'Malti', region: 'Europe', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 85 },
  { code: 'eu', name: 'Basque', nativeName: 'Euskara', region: 'Europe', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 84 },
  { code: 'ca', name: 'Catalan', nativeName: 'Català', region: 'Europe', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 93 },
  { code: 'gl', name: 'Galician', nativeName: 'Galego', region: 'Europe', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 91 },
  { code: 'la', name: 'Latin', nativeName: 'Latina', region: 'Europe', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 88 },
  { code: 'eo', name: 'Esperanto', nativeName: 'Esperanto', region: 'Global', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 90 },
  // Pacific Languages
  { code: 'mi', name: 'Māori', nativeName: 'Te Reo Māori', region: 'Pacific', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 83 },
  { code: 'haw', name: 'Hawaiian', nativeName: 'ʻŌlelo Hawaiʻi', region: 'Pacific', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 80 },
  { code: 'sm', name: 'Samoan', nativeName: 'Gagana Samoa', region: 'Pacific', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 79 },
  { code: 'to', name: 'Tongan', nativeName: 'Lea Faka-Tonga', region: 'Pacific', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 78 },
  { code: 'fj', name: 'Fijian', nativeName: 'Vosa Vakaviti', region: 'Pacific', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 77 },
  // Additional Languages to reach 100
  { code: 'lb', name: 'Luxembourgish', nativeName: 'Lëtzebuergesch', region: 'Europe', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 86 },
  { code: 'fy', name: 'Frisian', nativeName: 'Frysk', region: 'Europe', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 84 },
  { code: 'yi', name: 'Yiddish', nativeName: 'ייִדיש', region: 'Europe', supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'], qualityScore: 85 },
];

const generateTranslationJobs = (): TranslationJob[] => [
  {
    id: 'job-001',
    type: 'document',
    sourceLanguage: 'en',
    targetLanguage: 'zh',
    status: 'complete',
    progress: 100,
    sourceWordCount: 15234,
    targetWordCount: 12456,
    qualityLevel: 'legal',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 30 * 60 * 1000),
    requestedBy: 'Legal Team',
    department: 'Legal',
    cost: 456.78,
  },
  {
    id: 'job-002',
    type: 'document',
    sourceLanguage: 'en',
    targetLanguage: 'ja',
    status: 'processing',
    progress: 67,
    sourceWordCount: 8945,
    targetWordCount: 0,
    qualityLevel: 'professional',
    createdAt: new Date(Date.now() - 45 * 60 * 1000),
    requestedBy: 'Marketing',
    department: 'Marketing',
    cost: 268.35,
  },
  {
    id: 'job-003',
    type: 'email',
    sourceLanguage: 'de',
    targetLanguage: 'en',
    status: 'complete',
    progress: 100,
    sourceWordCount: 523,
    targetWordCount: 548,
    qualityLevel: 'business',
    createdAt: new Date(Date.now() - 15 * 60 * 1000),
    completedAt: new Date(Date.now() - 12 * 60 * 1000),
    requestedBy: 'Sales EMEA',
    department: 'Sales',
    cost: 15.69,
  },
  {
    id: 'job-004',
    type: 'document',
    sourceLanguage: 'en',
    targetLanguage: 'es',
    status: 'review',
    progress: 100,
    sourceWordCount: 4521,
    targetWordCount: 5102,
    qualityLevel: 'certified',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    requestedBy: 'HR',
    department: 'Human Resources',
    cost: 180.84,
  },
  {
    id: 'job-005',
    type: 'website',
    sourceLanguage: 'en',
    targetLanguage: 'fr',
    status: 'queued',
    progress: 0,
    sourceWordCount: 12890,
    targetWordCount: 0,
    qualityLevel: 'professional',
    createdAt: new Date(Date.now() - 5 * 60 * 1000),
    requestedBy: 'Digital Team',
    department: 'Marketing',
    cost: 386.7,
  },
];

const generateLiveSessions = (): LiveSession[] => [
  {
    id: 'live-001',
    type: 'meeting',
    name: 'Q4 Planning - APAC Team',
    sourceLanguage: 'en',
    targetLanguages: ['zh', 'ja', 'ko'],
    participants: 24,
    duration: 47,
    wordsTranslated: 8923,
    status: 'active',
    startedAt: new Date(Date.now() - 47 * 60 * 1000),
  },
  {
    id: 'live-002',
    type: 'call',
    name: 'Customer Success - Germany',
    sourceLanguage: 'de',
    targetLanguages: ['en'],
    participants: 4,
    duration: 23,
    wordsTranslated: 2341,
    status: 'active',
    startedAt: new Date(Date.now() - 23 * 60 * 1000),
  },
  {
    id: 'live-003',
    type: 'presentation',
    name: 'Product Launch Webinar',
    sourceLanguage: 'en',
    targetLanguages: ['es', 'pt', 'fr', 'de', 'it'],
    participants: 847,
    duration: 62,
    wordsTranslated: 15234,
    status: 'active',
    startedAt: new Date(Date.now() - 62 * 60 * 1000),
  },
];

const generateGlossaries = (): TerminologyGlossary[] => [
  {
    id: 'gloss-001',
    name: 'Legal & Compliance',
    industry: 'Legal',
    termCount: 4521,
    languages: ['en', 'de', 'fr', 'es', 'zh', 'ja'],
    lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    usageCount: 12456,
  },
  {
    id: 'gloss-002',
    name: 'Financial Services',
    industry: 'Finance',
    termCount: 3892,
    languages: ['en', 'zh', 'ja', 'de', 'fr'],
    lastUpdated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    usageCount: 8934,
  },
  {
    id: 'gloss-003',
    name: 'Technology & Software',
    industry: 'Technology',
    termCount: 6234,
    languages: ['en', 'zh', 'ja', 'ko', 'de', 'es', 'fr', 'pt'],
    lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    usageCount: 23451,
  },
  {
    id: 'gloss-004',
    name: 'Healthcare & Medical',
    industry: 'Healthcare',
    termCount: 8923,
    languages: ['en', 'de', 'fr', 'es', 'zh', 'ja', 'ar'],
    lastUpdated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    usageCount: 6789,
  },
];

const generateMetrics = (): TranslationMetrics => ({
  totalWordsTranslated: 48923456,
  documentsProcessed: 12456,
  meetingsTranslated: 3892,
  activeLanguages: 100,
  avgQualityScore: 96.8,
  avgTurnaround: 2.3,
  costSavings: 2340000,
  glossaryTerms: 23570,
});

const generateLanguageUsage = (): LanguageUsage[] => [
  { language: 'Chinese', wordCount: 12345678, percentage: 25.2, trend: 'up' },
  { language: 'Spanish', wordCount: 8923456, percentage: 18.2, trend: 'stable' },
  { language: 'Japanese', wordCount: 6234567, percentage: 12.7, trend: 'up' },
  { language: 'German', wordCount: 5123456, percentage: 10.5, trend: 'stable' },
  { language: 'French', wordCount: 4892345, percentage: 10.0, trend: 'down' },
  { language: 'Portuguese', wordCount: 3456789, percentage: 7.1, trend: 'up' },
  { language: 'Korean', wordCount: 2345678, percentage: 4.8, trend: 'up' },
  { language: 'Arabic', wordCount: 1892345, percentage: 3.9, trend: 'stable' },
];

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const OmniTranslatePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'translate' | 'documents' | 'live' | 'jobs' | 'glossaries'
  >('documents');
  const [translationJobs] = useState<TranslationJob[]>(generateTranslationJobs);
  const [liveSessions] = useState<LiveSession[]>(generateLiveSessions);
  const [glossaries] = useState<TerminologyGlossary[]>(generateGlossaries);
  const [metrics] = useState<TranslationMetrics>(generateMetrics);
  const [languageUsage] = useState<LanguageUsage[]>(generateLanguageUsage);

  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Document translation state
  const [uploadedDocument, setUploadedDocument] = useState<UploadedDocument | null>(null);
  const [selectedTargetLanguages, setSelectedTargetLanguages] = useState<string[]>([]);
  const [documentTranslations, setDocumentTranslations] = useState<DocumentTranslation[]>([]);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [isTranslatingDoc, setIsTranslatingDoc] = useState(false);
  const [docQualityLevel, setDocQualityLevel] = useState<QualityLevel>('professional');

  // Model loading state
  const [modelStatus, setModelStatus] = useState<{
    loaded: boolean;
    loading: boolean;
    progress: number;
    model: string;
    error: string | null;
    ollamaAvailable: boolean;
  } | null>(null);
  const [isLoadingModel, setIsLoadingModel] = useState(false);
  const [modelLoadMessage, setModelLoadMessage] = useState<string | null>(null);

  // Check model status on page load
  useEffect(() => {
    const checkModelStatus = async () => {
      try {
        const response = await fetch('/api/v1/omnitranslate/model/status');
        const result = await response.json();
        if (result.success) {
          setModelStatus(result.data);
          console.log('[OmniTranslate] Model status:', result.data);
        }
      } catch (error) {
        console.log('[OmniTranslate] Could not check model status:', error);
        setModelStatus({ loaded: false, loading: false, progress: 0, model: 'qwen2.5:7b', error: 'Backend unavailable', ollamaAvailable: false });
      }
    };
    checkModelStatus();
  }, []);

  // Load the translation model
  const handleLoadModel = async () => {
    setIsLoadingModel(true);
    setModelLoadMessage('Initializing translation model... This may take 2-5 minutes on first load.');
    
    try {
      const response = await fetch('/api/v1/omnitranslate/model/load', { method: 'POST' });
      const result = await response.json();
      
      if (result.success) {
        setModelLoadMessage('Model loaded successfully! AI translation is now available.');
        setModelStatus(prev => prev ? { ...prev, loaded: true, loading: false } : null);
        // Clear success message after 3 seconds
        setTimeout(() => setModelLoadMessage(null), 3000);
      } else {
        setModelLoadMessage(`Failed to load model: ${result.data?.message || result.error}`);
      }
    } catch (error) {
      setModelLoadMessage('Failed to connect to translation service. Please ensure Ollama is running.');
    } finally {
      setIsLoadingModel(false);
    }
  };

  // Fetch real data from API
  useEffect(() => {
    const fetchTranslationData = async () => {
      try {
        const snapshotsRes = await decisionIntelApi.getChronosSnapshots();
        if (snapshotsRes.success && snapshotsRes.data) {
          console.log('[OmniTranslate] Loaded system snapshots for localization metrics');
        }
      } catch (error) {
        console.log('[OmniTranslate] Using local generators (API unavailable)');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTranslationData();
  }, []);

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      return;
    }
    setIsTranslating(true);

    try {
      const response = await fetch('/api/v1/omnitranslate/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: sourceText.trim(),
          sourceLanguage: sourceLang || 'auto',
          targetLanguage: targetLang,
          context: 'enterprise',
        }),
      });

      const result = await response.json();

      if (result.success && result.data?.translatedText) {
        setTranslatedText(result.data.translatedText);
      } else {
        console.error('[OmniTranslate] Translation failed:', result.error);
        setTranslatedText('Translation failed. Please try again.');
      }
    } catch (error) {
      console.error('[OmniTranslate] API error:', error);
      setTranslatedText('Translation service unavailable. Please try again later.');
    } finally {
      setIsTranslating(false);
    }
  };

  const activeJobs = translationJobs.filter(
    (j) => j.status === 'processing' || j.status === 'queued'
  );

  // Handle document file upload
  const handleDocumentUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {return;}

    setIsUploadingDoc(true);
    
    try {
      const content = await file.text();
      const wordCount = content.split(/\s+/).filter(Boolean).length;
      
      // Detect language (simplified - in production would use API)
      const detectedLang = detectLanguage(content);
      
      setUploadedDocument({
        id: `doc-${Date.now()}`,
        name: file.name,
        size: file.size,
        type: file.type || 'text/plain',
        content,
        uploadedAt: new Date(),
        wordCount,
        detectedLanguage: detectedLang,
      });
      
      // Reset translations when new document uploaded
      setDocumentTranslations([]);
      setSelectedTargetLanguages([]);
    } catch (error) {
      console.error('[OmniTranslate] Document upload error:', error);
    } finally {
      setIsUploadingDoc(false);
    }
  };

  // Simple language detection based on character patterns
  const detectLanguage = (text: string): string => {
    const sample = text.slice(0, 1000);
    if (/[\u4e00-\u9fff]/.test(sample)) {return 'zh';}
    if (/[\u3040-\u309f\u30a0-\u30ff]/.test(sample)) {return 'ja';}
    if (/[\uac00-\ud7af]/.test(sample)) {return 'ko';}
    if (/[\u0600-\u06ff]/.test(sample)) {return 'ar';}
    if (/[\u0400-\u04ff]/.test(sample)) {return 'ru';}
    if (/[\u0900-\u097f]/.test(sample)) {return 'hi';}
    // Default to English
    return 'en';
  };

  // Toggle target language selection
  const toggleTargetLanguage = (langCode: string) => {
    setSelectedTargetLanguages(prev => 
      prev.includes(langCode) 
        ? prev.filter(l => l !== langCode)
        : [...prev, langCode]
    );
  };

  // Translate document to all selected languages
  const handleTranslateDocument = async () => {
    if (!uploadedDocument || selectedTargetLanguages.length === 0) {return;}
    
    setIsTranslatingDoc(true);
    
    // Initialize translations
    const initialTranslations: DocumentTranslation[] = selectedTargetLanguages.map(langCode => ({
      languageCode: langCode,
      languageName: LANGUAGES.find(l => l.code === langCode)?.name || langCode,
      status: 'pending',
      progress: 0,
      translatedContent: '',
      wordCount: 0,
    }));
    setDocumentTranslations(initialTranslations);

    // Process each language sequentially (or could be parallel)
    for (let i = 0; i < selectedTargetLanguages.length; i++) {
      const langCode = selectedTargetLanguages[i];
      const langName = LANGUAGES.find(l => l.code === langCode)?.name || langCode;
      
      // Update status to translating
      setDocumentTranslations(prev => prev.map(t => 
        t.languageCode === langCode ? { ...t, status: 'translating', progress: 10 } : t
      ));

      try {
        // Simulate progress updates
        for (let p = 20; p <= 80; p += 20) {
          await new Promise(r => setTimeout(r, 300));
          setDocumentTranslations(prev => prev.map(t => 
            t.languageCode === langCode ? { ...t, progress: p } : t
          ));
        }

        // Call translation API
        const response = await fetch('/api/v1/omnitranslate/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: uploadedDocument.content,
            sourceLanguage: uploadedDocument.detectedLanguage,
            targetLanguage: langCode,
            context: docQualityLevel,
          }),
        });

        const result = await response.json();
        
        if (result.success && result.data?.translatedText) {
          const translatedContent = result.data.translatedText;
          const wordCount = translatedContent.split(/\s+/).filter(Boolean).length;
          
          setDocumentTranslations(prev => prev.map(t => 
            t.languageCode === langCode ? {
              ...t,
              status: 'complete',
              progress: 100,
              translatedContent,
              wordCount,
              completedAt: new Date(),
            } : t
          ));
        } else {
          // Demo fallback - generate simulated translation
          const demoTranslation = generateDemoTranslation(uploadedDocument.content, langCode, langName);
          setDocumentTranslations(prev => prev.map(t => 
            t.languageCode === langCode ? {
              ...t,
              status: 'complete',
              progress: 100,
              translatedContent: demoTranslation,
              wordCount: demoTranslation.split(/\s+/).filter(Boolean).length,
              completedAt: new Date(),
            } : t
          ));
        }
      } catch (error) {
        console.error(`[OmniTranslate] Translation to ${langCode} failed:`, error);
        // Demo fallback
        const demoTranslation = generateDemoTranslation(uploadedDocument.content, langCode, langName);
        setDocumentTranslations(prev => prev.map(t => 
          t.languageCode === langCode ? {
            ...t,
            status: 'complete',
            progress: 100,
            translatedContent: demoTranslation,
            wordCount: demoTranslation.split(/\s+/).filter(Boolean).length,
            completedAt: new Date(),
          } : t
        ));
      }
    }
    
    setIsTranslatingDoc(false);
  };

  // Generate demo translation (when API unavailable)
  // This does word-by-word replacement for common business terms to simulate translation
  const generateDemoTranslation = (content: string, langCode: string, langName: string): string => {
    const demoTranslations: Record<string, Record<string, string>> = {
      'zh': {
        'revenue': '收入', 'growth': '增长', 'market': '市场', 'business': '业务',
        'strategy': '战略', 'risk': '风险', 'security': '安全', 'data': '数据',
        'customer': '客户', 'product': '产品', 'the': '该', 'is': '是', 'and': '和',
        'Q4': '第四季度', 'outlook': '展望', 'agent': '代理', 'analysis': '分析',
        'decision': '决策', 'meeting': '会议', 'executive': '执行', 'board': '董事会',
        'financial': '财务', 'operations': '运营', 'intelligence': '情报',
      },
      'es': {
        'revenue': 'ingresos', 'growth': 'crecimiento', 'market': 'mercado', 'business': 'negocio',
        'strategy': 'estrategia', 'risk': 'riesgo', 'security': 'seguridad', 'data': 'datos',
        'customer': 'cliente', 'product': 'producto', 'the': 'el', 'is': 'es', 'and': 'y',
        'Q4': 'Q4', 'outlook': 'perspectiva', 'agent': 'agente', 'analysis': 'análisis',
        'decision': 'decisión', 'meeting': 'reunión', 'executive': 'ejecutivo', 'board': 'junta',
        'financial': 'financiero', 'operations': 'operaciones', 'intelligence': 'inteligencia',
      },
      'fr': {
        'revenue': 'revenus', 'growth': 'croissance', 'market': 'marché', 'business': 'entreprise',
        'strategy': 'stratégie', 'risk': 'risque', 'security': 'sécurité', 'data': 'données',
        'customer': 'client', 'product': 'produit', 'the': 'le', 'is': 'est', 'and': 'et',
        'Q4': 'T4', 'outlook': 'perspectives', 'agent': 'agent', 'analysis': 'analyse',
        'decision': 'décision', 'meeting': 'réunion', 'executive': 'exécutif', 'board': 'conseil',
        'financial': 'financier', 'operations': 'opérations', 'intelligence': 'renseignement',
      },
      'de': {
        'revenue': 'Umsatz', 'growth': 'Wachstum', 'market': 'Markt', 'business': 'Geschäft',
        'strategy': 'Strategie', 'risk': 'Risiko', 'security': 'Sicherheit', 'data': 'Daten',
        'customer': 'Kunde', 'product': 'Produkt', 'the': 'der', 'is': 'ist', 'and': 'und',
        'Q4': 'Q4', 'outlook': 'Ausblick', 'agent': 'Agent', 'analysis': 'Analyse',
        'decision': 'Entscheidung', 'meeting': 'Sitzung', 'executive': 'Führungs', 'board': 'Vorstand',
        'financial': 'Finanz', 'operations': 'Betrieb', 'intelligence': 'Intelligenz',
      },
      'ja': {
        'revenue': '収益', 'growth': '成長', 'market': '市場', 'business': 'ビジネス',
        'strategy': '戦略', 'risk': 'リスク', 'security': 'セキュリティ', 'data': 'データ',
        'customer': '顧客', 'product': '製品', 'the': 'その', 'is': 'です', 'and': 'と',
        'Q4': '第4四半期', 'outlook': '見通し', 'agent': 'エージェント', 'analysis': '分析',
        'decision': '決定', 'meeting': '会議', 'executive': '経営', 'board': '取締役会',
        'financial': '財務', 'operations': '運用', 'intelligence': 'インテリジェンス',
      },
      'ko': {
        'revenue': '수익', 'growth': '성장', 'market': '시장', 'business': '비즈니스',
        'strategy': '전략', 'risk': '위험', 'security': '보안', 'data': '데이터',
        'customer': '고객', 'product': '제품', 'the': '그', 'is': '입니다', 'and': '그리고',
        'Q4': '4분기', 'outlook': '전망', 'agent': '에이전트', 'analysis': '분석',
        'decision': '결정', 'meeting': '회의', 'executive': '경영', 'board': '이사회',
        'financial': '재무', 'operations': '운영', 'intelligence': '인텔리전스',
      },
      'ar': {
        'revenue': 'الإيرادات', 'growth': 'النمو', 'market': 'السوق', 'business': 'الأعمال',
        'strategy': 'الاستراتيجية', 'risk': 'المخاطر', 'security': 'الأمن', 'data': 'البيانات',
        'customer': 'العميل', 'product': 'المنتج', 'the': 'ال', 'is': 'هو', 'and': 'و',
        'Q4': 'الربع الرابع', 'outlook': 'التوقعات', 'agent': 'وكيل', 'analysis': 'تحليل',
        'decision': 'قرار', 'meeting': 'اجتماع', 'executive': 'تنفيذي', 'board': 'مجلس',
        'financial': 'مالي', 'operations': 'عمليات', 'intelligence': 'استخبارات',
      },
      'ru': {
        'revenue': 'доход', 'growth': 'рост', 'market': 'рынок', 'business': 'бизнес',
        'strategy': 'стратегия', 'risk': 'риск', 'security': 'безопасность', 'data': 'данные',
        'customer': 'клиент', 'product': 'продукт', 'the': '', 'is': 'является', 'and': 'и',
        'Q4': 'Q4', 'outlook': 'прогноз', 'agent': 'агент', 'analysis': 'анализ',
        'decision': 'решение', 'meeting': 'встреча', 'executive': 'исполнительный', 'board': 'совет',
        'financial': 'финансовый', 'operations': 'операции', 'intelligence': 'разведка',
      },
      'pt': {
        'revenue': 'receita', 'growth': 'crescimento', 'market': 'mercado', 'business': 'negócio',
        'strategy': 'estratégia', 'risk': 'risco', 'security': 'segurança', 'data': 'dados',
        'customer': 'cliente', 'product': 'produto', 'the': 'o', 'is': 'é', 'and': 'e',
        'Q4': 'T4', 'outlook': 'perspectiva', 'agent': 'agente', 'analysis': 'análise',
        'decision': 'decisão', 'meeting': 'reunião', 'executive': 'executivo', 'board': 'conselho',
        'financial': 'financeiro', 'operations': 'operações', 'intelligence': 'inteligência',
      },
      'it': {
        'revenue': 'ricavi', 'growth': 'crescita', 'market': 'mercato', 'business': 'affari',
        'strategy': 'strategia', 'risk': 'rischio', 'security': 'sicurezza', 'data': 'dati',
        'customer': 'cliente', 'product': 'prodotto', 'the': 'il', 'is': 'è', 'and': 'e',
        'Q4': 'Q4', 'outlook': 'prospettive', 'agent': 'agente', 'analysis': 'analisi',
        'decision': 'decisione', 'meeting': 'riunione', 'executive': 'esecutivo', 'board': 'consiglio',
        'financial': 'finanziario', 'operations': 'operazioni', 'intelligence': 'intelligence',
      },
      'hi': {
        'revenue': 'राजस्व', 'growth': 'विकास', 'market': 'बाजार', 'business': 'व्यापार',
        'strategy': 'रणनीति', 'risk': 'जोखिम', 'security': 'सुरक्षा', 'data': 'डेटा',
        'customer': 'ग्राहक', 'product': 'उत्पाद', 'the': 'वह', 'is': 'है', 'and': 'और',
        'Q4': 'Q4', 'outlook': 'दृष्टिकोण', 'agent': 'एजेंट', 'analysis': 'विश्लेषण',
        'decision': 'निर्णय', 'meeting': 'बैठक', 'executive': 'कार्यकारी', 'board': 'बोर्ड',
        'financial': 'वित्तीय', 'operations': 'संचालन', 'intelligence': 'खुफिया',
      },
    };

    const langDict = demoTranslations[langCode] || {};
    let result = content;
    
    // Do word-by-word replacement for common terms
    for (const [eng, translated] of Object.entries(langDict)) {
      if (translated) {
        const regex = new RegExp(`\\b${eng}\\b`, 'gi');
        result = result.replace(regex, translated);
      }
    }

    // Add language marker header
    const nativeNames: Record<string, string> = {
      'zh': '简体中文', 'es': 'Español', 'fr': 'Français', 'de': 'Deutsch',
      'ja': '日本語', 'ko': '한국어', 'ar': 'العربية', 'ru': 'Русский',
      'pt': 'Português', 'it': 'Italiano', 'hi': 'हिन्दी',
    };
    const nativeName = nativeNames[langCode] || langName;
    const header = `[${nativeName} - Demo Translation]\n\n`;
    
    return header + result;
  };

  // Export single translation as file
  const exportTranslation = (translation: DocumentTranslation) => {
    if (!uploadedDocument || !translation.translatedContent) {return;}
    
    const fileName = uploadedDocument.name.replace(/\.[^/.]+$/, '') + `_${translation.languageCode}.txt`;
    const blob = new Blob([translation.translatedContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Export all translations as ZIP
  const exportAllTranslations = async () => {
    if (!uploadedDocument || documentTranslations.length === 0) {return;}
    
    const completedTranslations = documentTranslations.filter(t => t.status === 'complete');
    if (completedTranslations.length === 0) {return;}

    // For simplicity, export as a combined text file (in production would use JSZip)
    const baseName = uploadedDocument.name.replace(/\.[^/.]+$/, '');
    let combinedContent = `=== Multi-Language Translation Export ===\n`;
    combinedContent += `Original Document: ${uploadedDocument.name}\n`;
    combinedContent += `Source Language: ${LANGUAGES.find(l => l.code === uploadedDocument.detectedLanguage)?.name || uploadedDocument.detectedLanguage}\n`;
    combinedContent += `Export Date: ${new Date().toISOString()}\n`;
    combinedContent += `Languages: ${completedTranslations.length}\n`;
    combinedContent += `\n${'='.repeat(50)}\n\n`;

    for (const trans of completedTranslations) {
      combinedContent += `\n${'─'.repeat(50)}\n`;
      combinedContent += `LANGUAGE: ${trans.languageName} (${trans.languageCode.toUpperCase()})\n`;
      combinedContent += `Word Count: ${trans.wordCount.toLocaleString()}\n`;
      combinedContent += `${'─'.repeat(50)}\n\n`;
      combinedContent += trans.translatedContent;
      combinedContent += `\n\n`;
    }

    const blob = new Blob([combinedContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${baseName}_all_translations.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-950 to-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-blue-800/50 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/cortex/dashboard')}
                className="text-white/60 hover:text-white transition-colors"
              >
                ← Back
              </button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-3">
                  <span className="text-3xl">🌍</span>
                  CendiaOmniTranslate™
                  <span className="text-xs bg-gradient-to-r from-blue-500 to-indigo-500 px-2 py-0.5 rounded-full font-medium">
                    100+ LANGUAGES
                  </span>
                </h1>
                <p className="text-blue-300 text-sm">
                  Enterprise Translation Platform • Real-Time • AI-Powered
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                {liveSessions.filter((s) => s.status === 'active').length > 0 && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-green-600/20 border border-green-500/30 rounded-lg animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-green-400" />
                    <span className="text-green-400 text-sm font-medium">
                      {liveSessions.filter((s) => s.status === 'active').length} Live Sessions
                    </span>
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="text-sm text-white/60">Words Translated</div>
                <div className="text-xl font-bold text-blue-400">
                  {(metrics.totalWordsTranslated / 1e6).toFixed(1)}M
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Metrics Bar */}
      <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border-b border-blue-800/30">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="grid grid-cols-8 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-white">{metrics.activeLanguages}</div>
              <div className="text-xs text-blue-300">Languages</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-cyan-400">
                {(metrics.totalWordsTranslated / 1e6).toFixed(1)}M
              </div>
              <div className="text-xs text-blue-300">Words</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">
                {metrics.documentsProcessed.toLocaleString()}
              </div>
              <div className="text-xs text-blue-300">Documents</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">
                {metrics.meetingsTranslated.toLocaleString()}
              </div>
              <div className="text-xs text-blue-300">Meetings</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-400">{metrics.avgQualityScore}%</div>
              <div className="text-xs text-blue-300">Quality Score</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">{metrics.avgTurnaround}h</div>
              <div className="text-xs text-blue-300">Avg Turnaround</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-400">
                ${(metrics.costSavings / 1e6).toFixed(1)}M
              </div>
              <div className="text-xs text-blue-300">Cost Savings</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-pink-400">
                {(metrics.glossaryTerms / 1000).toFixed(1)}K
              </div>
              <div className="text-xs text-blue-300">Glossary Terms</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-blue-800/30 bg-black/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: '📊' },
              { id: 'translate', label: 'Translate', icon: '✏️' },
              { id: 'documents', label: 'Documents', icon: '📎', badge: uploadedDocument ? 1 : 0 },
              {
                id: 'live',
                label: 'Live Sessions',
                icon: '🎙️',
                badge: liveSessions.filter((s) => s.status === 'active').length,
              },
              { id: 'jobs', label: 'Translation Jobs', icon: '📄', badge: activeJobs.length },
              { id: 'glossaries', label: 'Glossaries', icon: '📚' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-blue-400 text-white bg-blue-900/20'
                    : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.icon} {tab.label}
                {tab.badge && tab.badge > 0 && (
                  <span className="px-2 py-0.5 bg-blue-600 rounded-full text-xs">{tab.badge}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Live Sessions Alert */}
            {liveSessions.filter((s) => s.status === 'active').length > 0 && (
              <div className="bg-green-900/20 rounded-2xl p-6 border border-green-700/50">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="text-green-400 animate-pulse">🎙️</span> Active Live Translation
                  Sessions
                </h2>
                <div className="grid grid-cols-3 gap-4">
                  {liveSessions
                    .filter((s) => s.status === 'active')
                    .map((session) => (
                      <div
                        key={session.id}
                        className="p-4 bg-green-900/30 rounded-xl border border-green-700/30"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold">{session.name}</span>
                          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        </div>
                        <div className="text-sm text-white/60 mb-2">
                          {session.sourceLanguage.toUpperCase()} →{' '}
                          {session.targetLanguages.map((l) => l.toUpperCase()).join(', ')}
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="text-center p-2 bg-black/20 rounded">
                            <div className="font-bold">{session.participants}</div>
                            <div className="text-white/50">Participants</div>
                          </div>
                          <div className="text-center p-2 bg-black/20 rounded">
                            <div className="font-bold">{session.duration}m</div>
                            <div className="text-white/50">Duration</div>
                          </div>
                          <div className="text-center p-2 bg-black/20 rounded">
                            <div className="font-bold text-green-400">
                              {session.wordsTranslated.toLocaleString()}
                            </div>
                            <div className="text-white/50">Words</div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Language Usage */}
            <div className="bg-black/30 rounded-2xl p-6 border border-blue-800/50">
              <h2 className="text-lg font-semibold mb-4">Top Languages by Usage</h2>
              <div className="space-y-3">
                {languageUsage.map((usage) => (
                  <div key={usage.language} className="flex items-center gap-4">
                    <div className="w-24 text-sm font-medium">{usage.language}</div>
                    <div className="flex-1 h-4 bg-black/30 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                        style={{ width: `${usage.percentage}%` }}
                      />
                    </div>
                    <div className="w-20 text-right text-sm">
                      {(usage.wordCount / 1e6).toFixed(1)}M
                    </div>
                    <div
                      className={`w-12 text-right text-sm ${
                        usage.trend === 'up'
                          ? 'text-green-400'
                          : usage.trend === 'down'
                            ? 'text-red-400'
                            : 'text-white/50'
                      }`}
                    >
                      {usage.trend === 'up' ? '↑' : usage.trend === 'down' ? '↓' : '→'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6">
              {/* Supported Languages */}
              <div className="bg-black/30 rounded-2xl p-6 border border-blue-800/50">
                <h3 className="text-lg font-semibold mb-4">Top Quality Languages</h3>
                <div className="space-y-2">
                  {LANGUAGES.slice(0, 6).map((lang) => (
                    <div
                      key={lang.code}
                      className="flex items-center justify-between p-3 bg-black/20 rounded-lg"
                    >
                      <div>
                        <span className="font-medium">{lang.name}</span>
                        <span className="ml-2 text-sm text-white/50">{lang.nativeName}</span>
                      </div>
                      <span className="text-green-400 font-bold">{lang.qualityScore}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Jobs */}
              <div className="bg-black/30 rounded-2xl p-6 border border-blue-800/50">
                <h3 className="text-lg font-semibold mb-4">Recent Jobs</h3>
                <div className="space-y-2">
                  {translationJobs.slice(0, 4).map((job) => (
                    <div key={job.id} className="p-3 bg-black/20 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{job.requestedBy}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-xs ${
                            job.status === 'complete'
                              ? 'bg-green-600'
                              : job.status === 'processing'
                                ? 'bg-blue-600'
                                : job.status === 'review'
                                  ? 'bg-purple-600'
                                  : 'bg-neutral-600'
                          }`}
                        >
                          {job.status}
                        </span>
                      </div>
                      <div className="text-xs text-white/50">
                        {job.sourceLanguage.toUpperCase()} → {job.targetLanguage.toUpperCase()} •{' '}
                        {job.sourceWordCount.toLocaleString()} words
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Glossaries */}
              <div className="bg-black/30 rounded-2xl p-6 border border-blue-800/50">
                <h3 className="text-lg font-semibold mb-4">Active Glossaries</h3>
                <div className="space-y-2">
                  {glossaries.map((gloss) => (
                    <div key={gloss.id} className="p-3 bg-black/20 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{gloss.name}</span>
                        <span className="text-cyan-400 font-bold">
                          {gloss.termCount.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-xs text-white/50">
                        {gloss.languages.length} languages • {gloss.usageCount.toLocaleString()}{' '}
                        uses
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'translate' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 rounded-2xl p-6 border border-blue-700/50">
              <h2 className="text-lg font-semibold mb-2">✏️ Quick Translation</h2>
              <p className="text-white/60">
                Instant AI-powered translation with context awareness and industry terminology.
                Supports 100+ language pairs with enterprise-grade accuracy.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Source */}
              <div className="bg-black/30 rounded-2xl p-6 border border-blue-800/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Source Text</h3>
                  <select
                    value={sourceLang}
                    onChange={(e) => setSourceLang(e.target.value)}
                    className="px-3 py-1.5 bg-black/30 border border-blue-800/50 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
                <textarea
                  value={sourceText}
                  onChange={(e) => setSourceText(e.target.value)}
                  placeholder="Enter text to translate..."
                  className="w-full h-64 p-4 bg-black/20 border border-blue-800/30 rounded-xl focus:outline-none focus:border-blue-500 resize-none"
                />
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-white/50">
                    {sourceText.split(/\s+/).filter(Boolean).length} words
                  </span>
                  <button
                    onClick={handleTranslate}
                    disabled={!sourceText.trim() || isTranslating}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl font-medium hover:opacity-90 disabled:opacity-50 transition-all"
                  >
                    {isTranslating ? 'Translating...' : 'Translate →'}
                  </button>
                </div>
              </div>

              {/* Target */}
              <div className="bg-black/30 rounded-2xl p-6 border border-blue-800/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Translation</h3>
                  <select
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                    className="px-3 py-1.5 bg-black/30 border border-blue-800/50 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                  >
                    {LANGUAGES.filter((l) => l.code !== sourceLang).map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-full h-64 p-4 bg-black/20 border border-blue-800/30 rounded-xl overflow-y-auto">
                  {isTranslating ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-blue-400 animate-pulse">Translating...</div>
                    </div>
                  ) : translatedText ? (
                    <p className="leading-relaxed">{translatedText}</p>
                  ) : (
                    <p className="text-white/30">Translation will appear here...</p>
                  )}
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-white/50">
                    {translatedText.split(/\s+/).filter(Boolean).length} words
                  </span>
                  <button
                    onClick={() => navigator.clipboard.writeText(translatedText)}
                    disabled={!translatedText}
                    className="px-4 py-2 bg-black/30 rounded-lg text-sm hover:bg-black/40 disabled:opacity-50 transition-colors"
                  >
                    📋 Copy
                  </button>
                </div>
              </div>
            </div>

            {/* Translation Options */}
            <div className="bg-black/30 rounded-2xl p-6 border border-blue-800/50">
              <h3 className="font-semibold mb-4">Translation Settings</h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="p-4 bg-black/20 rounded-xl cursor-pointer hover:bg-black/30 transition-colors border border-transparent hover:border-blue-600">
                  <div className="text-2xl mb-2">📄</div>
                  <div className="font-medium">Business</div>
                  <div className="text-xs text-white/50">General business content</div>
                </div>
                <div className="p-4 bg-black/20 rounded-xl cursor-pointer hover:bg-black/30 transition-colors border border-transparent hover:border-blue-600">
                  <div className="text-2xl mb-2">⚖️</div>
                  <div className="font-medium">Legal</div>
                  <div className="text-xs text-white/50">Legal documents & contracts</div>
                </div>
                <div className="p-4 bg-black/20 rounded-xl cursor-pointer hover:bg-black/30 transition-colors border border-transparent hover:border-blue-600">
                  <div className="text-2xl mb-2">💊</div>
                  <div className="font-medium">Medical</div>
                  <div className="text-xs text-white/50">Healthcare & medical</div>
                </div>
                <div className="p-4 bg-black/20 rounded-xl cursor-pointer hover:bg-black/30 transition-colors border border-transparent hover:border-blue-600">
                  <div className="text-2xl mb-2">💻</div>
                  <div className="font-medium">Technical</div>
                  <div className="text-xs text-white/50">Software & technology</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="space-y-6">
            {/* Model Status Banner */}
            {modelStatus && !modelStatus.loaded && (
              <div className={`rounded-2xl p-6 border ${
                modelStatus.ollamaAvailable 
                  ? 'bg-gradient-to-r from-amber-900/30 to-orange-900/30 border-amber-700/50'
                  : 'bg-gradient-to-r from-red-900/30 to-rose-900/30 border-red-700/50'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">
                      {isLoadingModel ? '⏳' : modelStatus.ollamaAvailable ? '🤖' : '⚠️'}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {isLoadingModel 
                          ? 'Loading Translation Model...'
                          : modelStatus.ollamaAvailable 
                            ? 'AI Translation Model Not Loaded'
                            : 'Ollama Service Not Available'}
                      </h3>
                      <p className="text-white/60 text-sm">
                        {isLoadingModel 
                          ? modelLoadMessage || 'Please wait while the model initializes...'
                          : modelStatus.ollamaAvailable
                            ? `Load the ${modelStatus.model} model for high-quality AI translations. First load may take 2-5 minutes.`
                            : 'Start Ollama to enable AI-powered translation. Demo mode will use word substitution.'}
                      </p>
                    </div>
                  </div>
                  {modelStatus.ollamaAvailable && !isLoadingModel && (
                    <button
                      onClick={handleLoadModel}
                      className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl font-medium hover:opacity-90 transition-all flex items-center gap-2"
                    >
                      <span>🚀</span> Load Model
                    </button>
                  )}
                  {isLoadingModel && (
                    <div className="flex items-center gap-3">
                      <div className="animate-spin w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full" />
                      <span className="text-amber-400">Loading...</span>
                    </div>
                  )}
                </div>
                {isLoadingModel && (
                  <div className="mt-4">
                    <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 animate-pulse" style={{ width: '60%' }} />
                    </div>
                    <p className="text-xs text-white/50 mt-2">
                      ⚡ First-time download: ~4GB. Subsequent loads are instant.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Model Loaded Success Banner */}
            {modelStatus?.loaded && (
              <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-2xl p-4 border border-green-700/50">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✅</span>
                  <div>
                    <span className="font-medium text-green-400">AI Translation Ready</span>
                    <span className="text-white/60 text-sm ml-2">Using {modelStatus.model} for high-quality translations</span>
                  </div>
                </div>
              </div>
            )}

            {/* Header */}
            <div className="bg-gradient-to-r from-violet-900/30 to-purple-900/30 rounded-2xl p-6 border border-violet-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold mb-2">📎 Document Translation</h2>
                  <p className="text-white/60">
                    Upload documents and translate them to multiple languages simultaneously. 
                    Export individual translations or download all at once.
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-white/60">Supported Formats</div>
                  <div className="text-sm text-violet-400">.txt, .md, .json, .csv, .html</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {/* Upload Section */}
              <div className="col-span-1 space-y-4">
                <div className="bg-black/30 rounded-2xl p-6 border border-blue-800/50">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    📤 Upload Document
                  </h3>
                  
                  <label className="block">
                    <div className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                      isUploadingDoc ? 'border-blue-500 bg-blue-900/20' : 'border-blue-800/50 hover:border-blue-600 hover:bg-blue-900/10'
                    }`}>
                      <input
                        type="file"
                        accept=".txt,.md,.json,.csv,.html,.xml"
                        onChange={handleDocumentUpload}
                        className="hidden"
                        disabled={isUploadingDoc}
                      />
                      {isUploadingDoc ? (
                        <div className="text-blue-400 animate-pulse">
                          <div className="text-3xl mb-2">⏳</div>
                          <div>Processing...</div>
                        </div>
                      ) : (
                        <>
                          <div className="text-3xl mb-2">📄</div>
                          <div className="text-white/60">Click to upload or drag & drop</div>
                          <div className="text-xs text-white/40 mt-2">Max 10MB</div>
                        </>
                      )}
                    </div>
                  </label>

                  {uploadedDocument && (
                    <div className="mt-4 p-4 bg-green-900/20 rounded-xl border border-green-700/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-green-400">✓ Document Loaded</span>
                        <button 
                          onClick={() => {
                            setUploadedDocument(null);
                            setDocumentTranslations([]);
                            setSelectedTargetLanguages([]);
                          }}
                          className="text-xs text-white/50 hover:text-white"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="text-sm text-white/80 truncate">{uploadedDocument.name}</div>
                      <div className="text-xs text-white/50 mt-1">
                        {(uploadedDocument.size / 1024).toFixed(1)} KB • {uploadedDocument.wordCount.toLocaleString()} words
                      </div>
                      <div className="text-xs text-cyan-400 mt-1">
                        Detected: {LANGUAGES.find(l => l.code === uploadedDocument.detectedLanguage)?.name || uploadedDocument.detectedLanguage}
                      </div>
                    </div>
                  )}
                </div>

                {/* Quality Level */}
                <div className="bg-black/30 rounded-2xl p-6 border border-blue-800/50">
                  <h3 className="font-semibold mb-4">⚙️ Quality Level</h3>
                  <div className="space-y-2">
                    {(['draft', 'business', 'professional', 'legal', 'certified'] as QualityLevel[]).map(level => (
                      <button
                        key={level}
                        onClick={() => setDocQualityLevel(level)}
                        className={`w-full p-3 rounded-lg text-left transition-colors ${
                          docQualityLevel === level 
                            ? 'bg-violet-600 text-white' 
                            : 'bg-black/20 text-white/60 hover:bg-black/30'
                        }`}
                      >
                        <div className="font-medium capitalize">{level}</div>
                        <div className="text-xs opacity-70">
                          {level === 'draft' && 'Quick, general translation'}
                          {level === 'business' && 'Professional business content'}
                          {level === 'professional' && 'High accuracy, industry terms'}
                          {level === 'legal' && 'Legal precision required'}
                          {level === 'certified' && 'Certified translation standard'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Language Selection */}
              <div className="col-span-1 bg-black/30 rounded-2xl p-6 border border-blue-800/50">
                <h3 className="font-semibold mb-4 flex items-center justify-between">
                  <span>🌍 Target Languages</span>
                  <span className="text-sm text-cyan-400">{selectedTargetLanguages.length} selected</span>
                </h3>
                
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                  {LANGUAGES.filter(l => l.code !== uploadedDocument?.detectedLanguage).map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => toggleTargetLanguage(lang.code)}
                      disabled={isTranslatingDoc}
                      className={`w-full p-3 rounded-lg text-left transition-colors flex items-center justify-between ${
                        selectedTargetLanguages.includes(lang.code)
                          ? 'bg-blue-600 text-white'
                          : 'bg-black/20 text-white/60 hover:bg-black/30'
                      } ${isTranslatingDoc ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div>
                        <div className="font-medium">{lang.name}</div>
                        <div className="text-xs opacity-70">{lang.nativeName} • {lang.region}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs">{lang.qualityScore}%</span>
                        {selectedTargetLanguages.includes(lang.code) && <span>✓</span>}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-blue-800/30">
                  <button
                    onClick={handleTranslateDocument}
                    disabled={!uploadedDocument || selectedTargetLanguages.length === 0 || isTranslatingDoc}
                    className="w-full py-3 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isTranslatingDoc ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="animate-spin">⏳</span> Translating...
                      </span>
                    ) : (
                      `Translate to ${selectedTargetLanguages.length} Language${selectedTargetLanguages.length !== 1 ? 's' : ''}`
                    )}
                  </button>
                </div>
              </div>

              {/* Results Section */}
              <div className="col-span-1 bg-black/30 rounded-2xl p-6 border border-blue-800/50">
                <h3 className="font-semibold mb-4 flex items-center justify-between">
                  <span>📥 Translations</span>
                  {documentTranslations.filter(t => t.status === 'complete').length > 0 && (
                    <button
                      onClick={exportAllTranslations}
                      className="text-sm px-3 py-1 bg-green-600 rounded-lg hover:bg-green-500 transition-colors"
                    >
                      Export All
                    </button>
                  )}
                </h3>

                {documentTranslations.length === 0 ? (
                  <div className="text-center py-12 text-white/40">
                    <div className="text-4xl mb-3">📋</div>
                    <div>Select languages and click translate</div>
                    <div className="text-xs mt-1">Results will appear here</div>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                    {documentTranslations.map(trans => (
                      <div 
                        key={trans.languageCode}
                        className={`p-4 rounded-xl border ${
                          trans.status === 'complete' 
                            ? 'bg-green-900/20 border-green-700/30' 
                            : trans.status === 'translating'
                              ? 'bg-blue-900/20 border-blue-700/30'
                              : trans.status === 'error'
                                ? 'bg-red-900/20 border-red-700/30'
                                : 'bg-black/20 border-blue-800/30'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <span className="font-medium">{trans.languageName}</span>
                            <span className="text-xs text-white/50 ml-2">{trans.languageCode.toUpperCase()}</span>
                          </div>
                          {trans.status === 'complete' && (
                            <button
                              onClick={() => exportTranslation(trans)}
                              className="text-xs px-2 py-1 bg-blue-600 rounded hover:bg-blue-500 transition-colors"
                            >
                              Download
                            </button>
                          )}
                        </div>

                        {trans.status === 'translating' && (
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-blue-400">Translating...</span>
                              <span>{trans.progress}%</span>
                            </div>
                            <div className="h-1.5 bg-black/30 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all"
                                style={{ width: `${trans.progress}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {trans.status === 'complete' && (
                          <div className="text-xs text-white/50">
                            {trans.wordCount.toLocaleString()} words • Completed
                          </div>
                        )}

                        {trans.status === 'pending' && (
                          <div className="text-xs text-white/40">Waiting...</div>
                        )}

                        {trans.status === 'error' && (
                          <div className="text-xs text-red-400">Translation failed</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Preview Section */}
            {uploadedDocument && documentTranslations.some(t => t.status === 'complete') && (
              <div className="bg-black/30 rounded-2xl p-6 border border-blue-800/50">
                <h3 className="font-semibold mb-4">👁️ Translation Preview</h3>
                <div className="grid grid-cols-2 gap-6">
                  {/* Original */}
                  <div>
                    <div className="text-sm text-white/60 mb-2 flex items-center justify-between">
                      <span>Original ({LANGUAGES.find(l => l.code === uploadedDocument.detectedLanguage)?.name})</span>
                      <span className="text-xs">{uploadedDocument.wordCount.toLocaleString()} words</span>
                    </div>
                    <div className="h-64 p-4 bg-black/20 rounded-xl overflow-y-auto text-sm text-white/80 whitespace-pre-wrap">
                      {uploadedDocument.content.slice(0, 2000)}
                      {uploadedDocument.content.length > 2000 && '...'}
                    </div>
                  </div>
                  {/* First completed translation */}
                  {documentTranslations.filter(t => t.status === 'complete')[0] && (
                    <div>
                      <div className="text-sm text-white/60 mb-2 flex items-center justify-between">
                        <span>{documentTranslations.filter(t => t.status === 'complete')[0].languageName}</span>
                        <span className="text-xs">{documentTranslations.filter(t => t.status === 'complete')[0].wordCount.toLocaleString()} words</span>
                      </div>
                      <div className="h-64 p-4 bg-black/20 rounded-xl overflow-y-auto text-sm text-white/80 whitespace-pre-wrap">
                        {documentTranslations.filter(t => t.status === 'complete')[0].translatedContent.slice(0, 2000)}
                        {documentTranslations.filter(t => t.status === 'complete')[0].translatedContent.length > 2000 && '...'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'live' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-2xl p-6 border border-green-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold mb-2">🎙️ Live Translation Sessions</h2>
                  <p className="text-white/60">
                    Real-time translation for meetings, calls, and presentations. Support for
                    multiple target languages simultaneously.
                  </p>
                </div>
                <button className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl font-medium hover:opacity-90 transition-all">
                  Start New Session
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {liveSessions.map((session) => (
                <div
                  key={session.id}
                  className={`bg-black/30 rounded-2xl p-6 border ${
                    session.status === 'active' ? 'border-green-700/50' : 'border-blue-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      {session.status === 'active' && (
                        <span className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                      )}
                      <div>
                        <h3 className="text-lg font-semibold">{session.name}</h3>
                        <div className="text-sm text-white/50">{session.type}</div>
                      </div>
                    </div>
                    <span
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${
                        session.status === 'active'
                          ? 'bg-green-600'
                          : session.status === 'paused'
                            ? 'bg-amber-600'
                            : 'bg-neutral-600'
                      }`}
                    >
                      {session.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm text-white/60 mb-2">Languages</div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-blue-900/50 rounded-lg">
                        {session.sourceLanguage.toUpperCase()}
                      </span>
                      <span className="text-white/40">→</span>
                      {session.targetLanguages.map((lang) => (
                        <span key={lang} className="px-3 py-1 bg-indigo-900/50 rounded-lg">
                          {lang.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-black/20 rounded-xl">
                      <div className="text-2xl font-bold text-cyan-400">{session.participants}</div>
                      <div className="text-xs text-white/50">Participants</div>
                    </div>
                    <div className="text-center p-4 bg-black/20 rounded-xl">
                      <div className="text-2xl font-bold">{session.duration}m</div>
                      <div className="text-xs text-white/50">Duration</div>
                    </div>
                    <div className="text-center p-4 bg-black/20 rounded-xl">
                      <div className="text-2xl font-bold text-green-400">
                        {session.wordsTranslated.toLocaleString()}
                      </div>
                      <div className="text-xs text-white/50">Words Translated</div>
                    </div>
                    <div className="text-center p-4 bg-black/20 rounded-xl">
                      <div className="text-2xl font-bold text-purple-400">
                        {session.targetLanguages.length}
                      </div>
                      <div className="text-xs text-white/50">Target Languages</div>
                    </div>
                  </div>

                  {session.status === 'active' && (
                    <div className="flex gap-3 mt-4 pt-4 border-t border-blue-800/30">
                      <button className="px-4 py-2 bg-amber-600 rounded-lg text-sm hover:bg-amber-500 transition-colors">
                        ⏸️ Pause
                      </button>
                      <button className="px-4 py-2 bg-red-600 rounded-lg text-sm hover:bg-red-500 transition-colors">
                        ⏹️ End Session
                      </button>
                      <button className="px-4 py-2 bg-blue-600 rounded-lg text-sm hover:bg-blue-500 transition-colors">
                        📥 Download Transcript
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="space-y-4">
            {translationJobs.map((job) => (
              <div key={job.id} className="bg-black/30 rounded-2xl p-6 border border-blue-800/50">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{job.requestedBy}</h3>
                      <span className="px-2 py-0.5 bg-blue-900 rounded text-xs">{job.type}</span>
                      <span className="px-2 py-0.5 bg-purple-900 rounded text-xs">
                        {job.qualityLevel}
                      </span>
                    </div>
                    <div className="text-sm text-white/50">{job.department}</div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-lg text-sm ${
                      job.status === 'complete'
                        ? 'bg-green-600'
                        : job.status === 'processing'
                          ? 'bg-blue-600'
                          : job.status === 'review'
                            ? 'bg-purple-600'
                            : job.status === 'queued'
                              ? 'bg-amber-600'
                              : 'bg-red-600'
                    }`}
                  >
                    {job.status}
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <span className="px-3 py-1 bg-blue-900/50 rounded-lg font-medium">
                    {job.sourceLanguage.toUpperCase()}
                  </span>
                  <span className="text-white/40">→</span>
                  <span className="px-3 py-1 bg-indigo-900/50 rounded-lg font-medium">
                    {job.targetLanguage.toUpperCase()}
                  </span>
                </div>

                {job.status === 'processing' && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{job.progress}%</span>
                    </div>
                    <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all"
                        style={{ width: `${job.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="text-lg font-bold">{job.sourceWordCount.toLocaleString()}</div>
                    <div className="text-xs text-white/50">Source Words</div>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="text-lg font-bold">
                      {job.targetWordCount > 0 ? job.targetWordCount.toLocaleString() : '-'}
                    </div>
                    <div className="text-xs text-white/50">Target Words</div>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="text-lg font-bold text-green-400">${job.cost.toFixed(2)}</div>
                    <div className="text-xs text-white/50">Cost</div>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="text-lg font-bold">
                      {Math.floor((Date.now() - job.createdAt.getTime()) / 60000)}m
                    </div>
                    <div className="text-xs text-white/50">Age</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'glossaries' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl p-6 border border-purple-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold mb-2">📚 Terminology Glossaries</h2>
                  <p className="text-white/60">
                    Industry-specific terminology databases for consistent, accurate translations.
                    Maintain brand voice and technical accuracy across all languages.
                  </p>
                </div>
                <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-medium hover:opacity-90 transition-all">
                  Create Glossary
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {glossaries.map((gloss) => (
                <div
                  key={gloss.id}
                  className="bg-black/30 rounded-2xl p-6 border border-blue-800/50"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">{gloss.name}</h3>
                    <span className="px-3 py-1 bg-purple-900/50 rounded-lg text-sm">
                      {gloss.industry}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 bg-black/20 rounded-xl">
                      <div className="text-xl font-bold text-cyan-400">
                        {gloss.termCount.toLocaleString()}
                      </div>
                      <div className="text-xs text-white/50">Terms</div>
                    </div>
                    <div className="text-center p-3 bg-black/20 rounded-xl">
                      <div className="text-xl font-bold text-purple-400">
                        {gloss.languages.length}
                      </div>
                      <div className="text-xs text-white/50">Languages</div>
                    </div>
                    <div className="text-center p-3 bg-black/20 rounded-xl">
                      <div className="text-xl font-bold text-green-400">
                        {gloss.usageCount.toLocaleString()}
                      </div>
                      <div className="text-xs text-white/50">Uses</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-xs text-white/50 mb-2">Supported Languages</div>
                    <div className="flex flex-wrap gap-1">
                      {gloss.languages.map((lang) => (
                        <span key={lang} className="px-2 py-1 bg-blue-900/50 rounded text-xs">
                          {lang.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-blue-800/30">
                    <span className="text-xs text-white/40">
                      Updated:{' '}
                      {Math.floor(
                        (Date.now() - gloss.lastUpdated.getTime()) / (24 * 60 * 60 * 1000)
                      )}{' '}
                      days ago
                    </span>
                    <button className="px-4 py-2 bg-blue-600 rounded-lg text-sm hover:bg-blue-500 transition-colors">
                      Edit Glossary
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default OmniTranslatePage;
