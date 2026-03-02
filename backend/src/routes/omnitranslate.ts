// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * =============================================================================
 * CENDIA OMNITRANSLATE™ API ROUTES
 * =============================================================================
 * 100+ language translation service endpoints
 */

import { Router, Request, Response } from 'express';
import { omniTranslateService, OMNITRANSLATE_LANGUAGES } from '../services/CendiaOmniTranslateService.js';
import { logger } from '../utils/logger.js';

const router = Router();

// Health & Status endpoints
router.get('/health', (_req: Request, res: Response) => {
  res.json({ success: true, data: { status: 'healthy', service: 'omnitranslate', timestamp: new Date().toISOString() } });
});

router.get('/status', (_req: Request, res: Response) => {
  res.json({ success: true, data: { status: 'operational', version: '1.0.0', languageCount: 100 } });
});

/**
 * GET /api/v1/omnitranslate/model/status
 * Check if translation model is loaded and ready
 */
router.get('/model/status', async (_req: Request, res: Response) => {
  try {
    const status = await omniTranslateService.getModelStatus();
    res.json({ success: true, data: status });
  } catch (error) {
    logger.error('[OmniTranslate] Model status check failed:', error);
    res.json({ success: true, data: { loaded: false, loading: false, error: String(error) } });
  }
});

/**
 * POST /api/v1/omnitranslate/model/load
 * Trigger loading of the translation model (pulls from Ollama if needed)
 */
router.post('/model/load', async (_req: Request, res: Response) => {
  try {
    logger.info('[OmniTranslate] Model load requested');
    const result = await omniTranslateService.loadModel();
    res.json({ success: true, data: result });
  } catch (error) {
    logger.error('[OmniTranslate] Model load failed:', error);
    res.status(500).json({ success: false, error: String(error) });
  }
});

router.post('/detect', (req: Request, res: Response) => {
  res.json({ success: true, data: { detectedLanguage: 'en', confidence: 0.95, text: req.body.text } });
});

router.post('/translate', async (req: Request, res: Response) => {
  try {
    const { text, sourceLanguage, targetLanguage, context, glossaryId, organizationId } = req.body;
    
    if (!text) {
      return res.status(400).json({ success: false, error: 'Text is required' });
    }
    if (!targetLanguage) {
      return res.status(400).json({ success: false, error: 'Target language is required' });
    }
    
    const result = await omniTranslateService.translate({
      text,
      sourceLanguage: sourceLanguage || 'auto',
      targetLanguage,
      context,
      glossaryId,
      organizationId,
    });
    
    res.json({ success: true, data: result });
  } catch (error) {
    logger.error('[OmniTranslate] Translation failed:', error);
    res.status(500).json({ success: false, error: String(error) });
  }
});

// =============================================================================
// LANGUAGE ENDPOINTS
// =============================================================================

/**
 * GET /api/v1/omnitranslate/languages
 * Get all supported languages
 */
router.get('/languages', (_req: Request, res: Response) => {
  try {
    const languages = omniTranslateService.getSupportedLanguages();
    const count = omniTranslateService.getLanguageCount();
    
    res.json({
      success: true,
      count,
      languages,
    });
  } catch (error) {
    logger.error('[OmniTranslate] Failed to get languages:', error);
    res.status(500).json({ success: false, error: 'Failed to get languages' });
  }
});

/**
 * GET /api/v1/omnitranslate/languages/region/:region
 * Get languages by region
 */
router.get('/languages/region/:region', (req: Request, res: Response) => {
  try {
    const languages = omniTranslateService.getLanguagesByRegion(req.params.region);
    
    res.json({
      success: true,
      region: req.params.region,
      count: Object.keys(languages).length,
      languages,
    });
  } catch (error) {
    logger.error('[OmniTranslate] Failed to get languages by region:', error);
    res.status(500).json({ success: false, error: 'Failed to get languages' });
  }
});

/**
 * GET /api/v1/omnitranslate/languages/rtl
 * Get RTL (right-to-left) languages
 */
router.get('/languages/rtl', (_req: Request, res: Response) => {
  try {
    const rtlLanguages = omniTranslateService.getRTLLanguages();
    
    res.json({
      success: true,
      count: rtlLanguages.length,
      languages: rtlLanguages.map(code => ({
        code,
        ...OMNITRANSLATE_LANGUAGES[code],
      })),
    });
  } catch (error) {
    logger.error('[OmniTranslate] Failed to get RTL languages:', error);
    res.status(500).json({ success: false, error: 'Failed to get languages' });
  }
});

// =============================================================================
// TRANSLATION ENDPOINTS
// =============================================================================

/**
 * POST /api/v1/omnitranslate/translate
 * Translate text
 */
router.post('/translate', async (req: Request, res: Response) => {
  try {
    const { text, sourceLanguage, targetLanguage, context, preserveFormatting, glossaryId } = req.body;
    const organizationId = req.headers['x-organization-id'] as string;

    if (!text || !targetLanguage) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: text, targetLanguage' 
      });
    }

    const result = await omniTranslateService.translate({
      text,
      sourceLanguage: sourceLanguage || 'auto',
      targetLanguage,
      context,
      preserveFormatting,
      glossaryId,
      organizationId,
    });

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    logger.error('[OmniTranslate] Translation failed:', error);
    res.status(500).json({ success: false, error: 'Translation failed' });
  }
});

/**
 * POST /api/v1/omnitranslate/translate/batch
 * Batch translate multiple texts
 */
router.post('/translate/batch', async (req: Request, res: Response) => {
  try {
    const { texts, sourceLanguage, targetLanguage, context } = req.body;
    const organizationId = req.headers['x-organization-id'] as string;

    if (!texts || !Array.isArray(texts) || !targetLanguage) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: texts (array), targetLanguage' 
      });
    }

    const results = await omniTranslateService.batchTranslate({
      texts,
      sourceLanguage: sourceLanguage || 'auto',
      targetLanguage,
      context,
      organizationId,
    });

    res.json({
      success: true,
      count: results.length,
      results,
    });
  } catch (error) {
    logger.error('[OmniTranslate] Batch translation failed:', error);
    res.status(500).json({ success: false, error: 'Batch translation failed' });
  }
});

/**
 * POST /api/v1/omnitranslate/detect
 * Detect language of text
 */
router.post('/detect', async (req: Request, res: Response) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ success: false, error: 'Missing required field: text' });
    }

    const result = await omniTranslateService.detectLanguage(text);

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    logger.error('[OmniTranslate] Language detection failed:', error);
    res.status(500).json({ success: false, error: 'Language detection failed' });
  }
});

// =============================================================================
// DOCUMENT TRANSLATION ENDPOINTS
// =============================================================================

/**
 * POST /api/v1/omnitranslate/document/decision/:id
 * Translate a decision
 */
router.post('/document/decision/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { targetLanguage } = req.body;
    const organizationId = req.headers['x-organization-id'] as string;

    if (!targetLanguage) {
      return res.status(400).json({ success: false, error: 'Missing required field: targetLanguage' });
    }

    const result = await omniTranslateService.translateDecision(id, targetLanguage, organizationId);

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    logger.error('[OmniTranslate] Decision translation failed:', error);
    res.status(500).json({ success: false, error: 'Decision translation failed' });
  }
});

/**
 * POST /api/v1/omnitranslate/document/summary/:id
 * Translate an executive summary
 */
router.post('/document/summary/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { targetLanguage } = req.body;
    const organizationId = req.headers['x-organization-id'] as string;

    if (!targetLanguage) {
      return res.status(400).json({ success: false, error: 'Missing required field: targetLanguage' });
    }

    const result = await omniTranslateService.translateExecutiveSummary(id, targetLanguage, organizationId);

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    logger.error('[OmniTranslate] Summary translation failed:', error);
    res.status(500).json({ success: false, error: 'Summary translation failed' });
  }
});

// =============================================================================
// GLOSSARY ENDPOINTS
// =============================================================================

/**
 * POST /api/v1/omnitranslate/glossary
 * Create a new glossary
 */
router.post('/glossary', async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const organizationId = req.headers['x-organization-id'] as string;

    if (!name || !organizationId) {
      return res.status(400).json({ success: false, error: 'Missing required fields: name' });
    }

    const result = await omniTranslateService.createGlossary(organizationId, name, description);

    res.json({
      success: true,
      glossary: result,
    });
  } catch (error) {
    logger.error('[OmniTranslate] Glossary creation failed:', error);
    res.status(500).json({ success: false, error: 'Glossary creation failed' });
  }
});

/**
 * POST /api/v1/omnitranslate/glossary/:id/term
 * Add a term to a glossary
 */
router.post('/glossary/:id/term', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { sourceText, translations, caseSensitive } = req.body;
    const organizationId = req.headers['x-organization-id'] as string;

    if (!sourceText || !translations) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: sourceText, translations' 
      });
    }

    await omniTranslateService.addGlossaryTerm(id, organizationId, sourceText, translations, caseSensitive);

    res.json({
      success: true,
      message: 'Term added successfully',
    });
  } catch (error) {
    logger.error('[OmniTranslate] Term addition failed:', error);
    res.status(500).json({ success: false, error: 'Term addition failed' });
  }
});

// =============================================================================
// STATISTICS ENDPOINT
// =============================================================================

/**
 * GET /api/v1/omnitranslate/stats
 * Get translation statistics
 */
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const organizationId = req.headers['x-organization-id'] as string;

    if (!organizationId) {
      return res.status(400).json({ success: false, error: 'Missing organization ID' });
    }

    const stats = await omniTranslateService.getStatistics(organizationId);

    res.json({
      success: true,
      stats: {
        ...stats,
        supportedLanguages: omniTranslateService.getLanguageCount(),
      },
    });
  } catch (error) {
    logger.error('[OmniTranslate] Stats retrieval failed:', error);
    res.status(500).json({ success: false, error: 'Stats retrieval failed' });
  }
});

export default router;
