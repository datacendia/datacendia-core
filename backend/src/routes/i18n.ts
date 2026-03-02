/**
 * API Routes — I18n
 *
 * Express route handler defining REST endpoints.
 * @module routes/i18n
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * =============================================================================
 * DATACENDIA - INTERNATIONALIZATION API
 * =============================================================================
 * Enterprise-grade translation API endpoints
 * - Dynamic AI-powered translation for ALL 24 languages
 * - Caching and persistence
 * - User preference management
 */

import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { 
  translationService, 
  SUPPORTED_LANGUAGES,
  BASE_TRANSLATIONS,
  type SupportedLanguage 
} from '../services/i18n/TranslationService.js';
import { logger } from '../utils/logger.js';
import { cacheService } from '../services/cache/RedisCacheService.js';
import { getErrorMessage } from '../utils/errors.js';

const router = Router();

// =============================================================================
// GET /api/v1/i18n/languages - List all supported languages
// =============================================================================

router.get('/languages', async (req: Request, res: Response) => {
  try {
    // Check cache first
    const cacheKey = 'i18n:languages';
    const cached = await cacheService.get<any>(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const languages = Object.entries(SUPPORTED_LANGUAGES).map(([code, info]) => ({
      code,
      ...info,
    }));
    
    const response = {
      success: true,
      data: {
        languages,
        count: languages.length,
      },
      // Also include at top level for backwards compatibility
      languages,
      count: languages.length,
    };

    // Cache for 1 hour (languages rarely change)
    await cacheService.set(cacheKey, response, 3600);
    
    res.json(response);
  } catch (error: unknown) {
    logger.error('Failed to get languages:', error);
    res.status(500).json({
      success: false,
      error: getErrorMessage(error),
    });
  }
});

// =============================================================================
// GET /api/v1/i18n/translations/:language - Get ALL translations for a language
// =============================================================================

router.get('/translations/:language', async (req: Request, res: Response) => {
  try {
    const { language } = req.params;

    // Validate language
    if (!(language in SUPPORTED_LANGUAGES)) {
      return res.status(400).json({
        success: false,
        error: `Language '${language}' is not supported`,
        supported: Object.keys(SUPPORTED_LANGUAGES),
      });
    }

    const lang = language as SupportedLanguage;
    const translations = await translationService.getAllTranslations(lang);
    const languageInfo = SUPPORTED_LANGUAGES[lang];

    res.json({
      success: true,
      language: {
        code: language,
        ...languageInfo,
      },
      translations,
      count: Object.keys(translations).length,
      totalAvailable: Object.keys(BASE_TRANSLATIONS).length,
    });
  } catch (error: unknown) {
    logger.error(`Failed to get translations for ${req.params.language}:`, error);
    res.status(500).json({
      success: false,
      error: getErrorMessage(error),
    });
  }
});

// =============================================================================
// POST /api/v1/i18n/translate/content - Translate dynamic content
// =============================================================================

const translateContentSchema = z.object({
  content: z.string().min(1).max(10000),
  targetLanguage: z.string(),
});

router.post('/translate/content', async (req: Request, res: Response) => {
  try {
    const validation = translateContentSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validation.error.errors,
      });
    }

    const { content, targetLanguage } = validation.data;

    if (!(targetLanguage in SUPPORTED_LANGUAGES)) {
      return res.status(400).json({
        success: false,
        error: `Language '${targetLanguage}' is not supported`,
      });
    }

    const translated = await translationService.translateContent(
      content,
      targetLanguage as SupportedLanguage
    );

    res.json({
      success: true,
      original: content,
      translated,
      targetLanguage,
    });
  } catch (error: unknown) {
    logger.error('Content translation failed:', error);
    res.status(500).json({
      success: false,
      error: getErrorMessage(error),
    });
  }
});

// =============================================================================
// POST /api/v1/i18n/translate/deliberation - Translate deliberation content
// =============================================================================

const translateDeliberationSchema = z.object({
  question: z.string(),
  messages: z.array(z.object({
    agent: z.string(),
    content: z.string(),
  })),
  decision: z.string().optional(),
  targetLanguage: z.string(),
});

router.post('/translate/deliberation', async (req: Request, res: Response) => {
  try {
    const validation = translateDeliberationSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validation.error.errors,
      });
    }

    const { question, messages, decision, targetLanguage } = validation.data;

    if (!(targetLanguage in SUPPORTED_LANGUAGES)) {
      return res.status(400).json({
        success: false,
        error: `Language '${targetLanguage}' is not supported`,
      });
    }

    const translated = await translationService.translateDeliberation(
      { question, messages, decision },
      targetLanguage as SupportedLanguage
    );

    res.json({
      success: true,
      ...translated,
      targetLanguage,
    });
  } catch (error: unknown) {
    logger.error('Deliberation translation failed:', error);
    res.status(500).json({
      success: false,
      error: getErrorMessage(error),
    });
  }
});

// =============================================================================
// GET /api/v1/i18n/user/preference - Get user language preference
// =============================================================================

router.get('/user/preference', async (req: Request, res: Response) => {
  try {
    // @ts-ignore - User may be set by auth middleware
    const userId = req.user?.id || 'anonymous';
    const preference = await translationService.getUserPreference(userId);
    const languageInfo = SUPPORTED_LANGUAGES[preference];

    res.json({
      success: true,
      preference: {
        language: preference,
        ...languageInfo,
      },
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      error: getErrorMessage(error),
    });
  }
});

// =============================================================================
// PUT /api/v1/i18n/user/preference - Set user language preference
// =============================================================================

const setPreferenceSchema = z.object({
  language: z.string(),
});

router.put('/user/preference', async (req: Request, res: Response) => {
  try {
    const validation = setPreferenceSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validation.error.errors,
      });
    }

    const { language } = validation.data;

    if (!(language in SUPPORTED_LANGUAGES)) {
      return res.status(400).json({
        success: false,
        error: `Language '${language}' is not supported`,
      });
    }

    // @ts-ignore - User may be set by auth middleware
    const userId = req.user?.id || 'anonymous';
    await translationService.setUserPreference(userId, language as SupportedLanguage);

    res.json({
      success: true,
      message: 'Language preference updated',
      language,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      error: getErrorMessage(error),
    });
  }
});

// =============================================================================
// POST /api/v1/i18n/cache/clear - Clear translation cache (admin)
// =============================================================================

router.post('/cache/clear', async (req: Request, res: Response) => {
  try {
    const { language } = req.body;
    await translationService.clearCache(language);

    res.json({
      success: true,
      message: language ? `Cache cleared for ${language}` : 'All translation caches cleared',
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      error: getErrorMessage(error),
    });
  }
});

// =============================================================================
// GET /api/v1/i18n/stats - Get translation statistics
// =============================================================================

router.get('/stats', async (req: Request, res: Response) => {
  try {
    const stats = await translationService.getStats();

    res.json({
      success: true,
      stats,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      error: getErrorMessage(error),
    });
  }
});

export default router;
