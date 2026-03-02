// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * LEGAL RESEARCH API ROUTES
 * Backend routes for legal research tools used by Council agents
 * 
 * Endpoints:
 * - GET /api/v1/legal-research/status - Service status
 * - POST /api/v1/legal-research/cases - Search case law
 * - POST /api/v1/legal-research/regulations - Search CFR
 * - POST /api/v1/legal-research/bills - Search state bills
 * - POST /api/v1/legal-research/federal-register - Search Federal Register
 * - POST /api/v1/legal-research/sec - Search SEC filings
 * - POST /api/v1/legal-research/unified - Unified search across sources
 * - POST /api/v1/legal-research/execute-tool - Execute a legal tool by name
 * - GET /api/v1/legal-research/history - Get tool call history
 */

import { Router, Request, Response } from 'express';
import { legalResearchService } from '../services/legal/LegalResearchService.js';

const router = Router();

// ===========================================================================
// STATUS
// ===========================================================================

router.get('/status', async (_req: Request, res: Response) => {
  try {
    const status = legalResearchService.getStatus();
    res.json({
      success: true,
      status,
      availableSources: Object.entries(status)
        .filter(([, available]) => available)
        .map(([source]) => source),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// ===========================================================================
// CASE LAW SEARCH
// ===========================================================================

router.post('/cases', async (req: Request, res: Response) => {
  try {
    const { query, jurisdiction, dateMin, dateMax, limit } = req.body;
    
    if (!query) {
      return res.status(400).json({ success: false, error: 'Query required' });
    }

    const results = await legalResearchService.searchCases(query, {
      jurisdiction,
      dateMin,
      dateMax,
      limit,
    });

    res.json({
      success: true,
      count: results.length,
      results,
      formatted: legalResearchService.formatResultsForAgent(results),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

router.get('/cases/:citation', async (req: Request, res: Response) => {
  try {
    const citation = req.params['citation'];
    if (!citation) {
      return res.status(400).json({ success: false, error: 'Citation required' });
    }
    const result = await legalResearchService.getCaseByCitation(decodeURIComponent(citation));

    if (!result) {
      return res.status(404).json({ success: false, error: 'Case not found' });
    }

    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// ===========================================================================
// FEDERAL REGULATIONS (eCFR)
// ===========================================================================

router.post('/regulations', async (req: Request, res: Response) => {
  try {
    const { query, title, limit } = req.body;
    
    if (!query) {
      return res.status(400).json({ success: false, error: 'Query required' });
    }

    const results = await legalResearchService.searchRegulations(query, { title, limit });

    res.json({
      success: true,
      count: results.length,
      results,
      formatted: legalResearchService.formatResultsForAgent(results),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// ===========================================================================
// STATE LEGISLATION (Open States)
// ===========================================================================

router.post('/bills', async (req: Request, res: Response) => {
  try {
    const { query, state, limit } = req.body;
    
    if (!query) {
      return res.status(400).json({ success: false, error: 'Query required' });
    }

    const results = await legalResearchService.searchStateBills(query, { state, limit });

    res.json({
      success: true,
      count: results.length,
      results,
      formatted: legalResearchService.formatResultsForAgent(results),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// ===========================================================================
// FEDERAL REGISTER
// ===========================================================================

router.post('/federal-register', async (req: Request, res: Response) => {
  try {
    const { query, type, agency, days, limit } = req.body;
    
    if (!query) {
      return res.status(400).json({ success: false, error: 'Query required' });
    }

    const results = await legalResearchService.searchFederalRegister(query, {
      type,
      agency,
      days,
      limit,
    });

    res.json({
      success: true,
      count: results.length,
      results,
      formatted: legalResearchService.formatResultsForAgent(results),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// ===========================================================================
// SEC EDGAR
// ===========================================================================

router.post('/sec', async (req: Request, res: Response) => {
  try {
    const { cik, form, limit } = req.body;
    
    if (!cik) {
      return res.status(400).json({ success: false, error: 'CIK required' });
    }

    const results = await legalResearchService.searchSECFilings(cik, { form, limit });

    res.json({
      success: true,
      count: results.length,
      results,
      formatted: legalResearchService.formatResultsForAgent(results),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// ===========================================================================
// WESTLAW (Thomson Reuters)
// ===========================================================================

router.post('/westlaw', async (req: Request, res: Response) => {
  try {
    const { query, jurisdiction, dateMin, dateMax, contentType, limit } = req.body;
    
    if (!query) {
      return res.status(400).json({ success: false, error: 'Query required' });
    }

    const results = await legalResearchService.searchWestlaw(query, {
      jurisdiction,
      dateMin,
      dateMax,
      contentType,
      limit,
    });

    res.json({
      success: true,
      count: results.length,
      results,
      formatted: legalResearchService.formatResultsForAgent(results),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

router.get('/westlaw/:documentId', async (req: Request, res: Response) => {
  try {
    const documentId = req.params['documentId'];
    if (!documentId) {
      return res.status(400).json({ success: false, error: 'Document ID required' });
    }
    const result = await legalResearchService.getWestlawDocument(decodeURIComponent(documentId));

    if (!result) {
      return res.status(404).json({ success: false, error: 'Document not found or Westlaw not configured' });
    }

    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// ===========================================================================
// UNIFIED SEARCH
// ===========================================================================

router.post('/unified', async (req: Request, res: Response) => {
  try {
    const { query, sources, jurisdiction, limit } = req.body;
    
    if (!query) {
      return res.status(400).json({ success: false, error: 'Query required' });
    }

    const results = await legalResearchService.unifiedSearch(query, {
      sources,
      jurisdiction,
      limit,
    });

    res.json({
      success: true,
      count: results.length,
      results,
      formatted: legalResearchService.formatResultsForAgent(results),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// ===========================================================================
// TOOL EXECUTION (for Council agents)
// ===========================================================================

router.post('/execute-tool', async (req: Request, res: Response) => {
  try {
    const { tool, params } = req.body;
    
    if (!tool) {
      return res.status(400).json({ success: false, error: 'Tool name required' });
    }

    const result = await legalResearchService.executeTool(tool, params || {});

    res.json({
      ...result,
      formatted: result.results 
        ? legalResearchService.formatResultsForAgent(result.results)
        : undefined,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// ===========================================================================
// TOOL CALL HISTORY
// ===========================================================================

router.get('/history', async (_req: Request, res: Response) => {
  try {
    const history = legalResearchService.getToolCallHistory();
    res.json({
      success: true,
      count: history.length,
      history,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// ===========================================================================
// CONFIGURATION
// ===========================================================================

router.post('/config/api-keys', async (req: Request, res: Response) => {
  try {
    const { caselaw, courtlistener, openstates } = req.body;
    
    legalResearchService.setApiKeys({ caselaw, courtlistener, openstates } as any);
    
    res.json({
      success: true,
      status: legalResearchService.getStatus(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

router.post('/cache/clear', async (_req: Request, res: Response) => {
  try {
    legalResearchService.clearCache();
    res.json({ success: true, message: 'Cache cleared' });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// ===========================================================================
// LEGAL DEMO SCENARIOS (for LEGAL_DEMO_SHOWCASE)
// ===========================================================================

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// @ts-ignore TS1470: import.meta used with CommonJS output (runtime uses tsx/ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

router.get('/demo/scenarios', (_req: Request, res: Response) => {
  try {
    const scenariosPath = join(__dirname, '../data/legal-demo-scenarios.json');
    const scenariosData = readFileSync(scenariosPath, 'utf-8');
    const scenarios = JSON.parse(scenariosData);
    
    res.json({
      success: true,
      scenarios: scenarios.scenarios,
      quickPrompts: scenarios.quickPrompts,
      count: scenarios.scenarios.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to load scenarios',
    });
  }
});

router.get('/demo/scenarios/:id', (req: Request, res: Response) => {
  try {
    const id = req.params['id'];
    const scenariosPath = join(__dirname, '../data/legal-demo-scenarios.json');
    const scenariosData = readFileSync(scenariosPath, 'utf-8');
    const scenarios = JSON.parse(scenariosData);
    
    const scenario = scenarios.scenarios.find((s: any) => s.id === id);
    
    if (!scenario) {
      return res.status(404).json({
        success: false,
        error: 'Scenario not found',
      });
    }
    
    res.json({
      success: true,
      scenario,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to load scenario',
    });
  }
});

router.get('/demo/materials', (_req: Request, res: Response) => {
  try {
    const materialsDir = join(__dirname, '../data/legal-demo-materials');
    const materials = [
      {
        id: 'trade-secret-brief',
        name: 'Trade Secret Misappropriation Brief',
        filename: 'trade-secret-brief.md',
        category: 'litigation',
        description: 'Sample brief for trade secret case analysis',
      },
      {
        id: 'musk-v-openai-brief',
        name: 'Musk v. OpenAI Analysis',
        filename: 'musk-v-openai-brief.md',
        category: 'contract-law',
        description: 'Real case analysis of Musk v. OpenAI breach of contract claims',
      },
    ];
    
    res.json({
      success: true,
      materials,
      count: materials.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to load materials',
    });
  }
});

router.get('/demo/materials/:id', (req: Request, res: Response) => {
  try {
    const id = req.params['id'];
    const materialsDir = join(__dirname, '../data/legal-demo-materials');
    
    const materialMap: Record<string, string> = {
      'trade-secret-brief': 'trade-secret-brief.md',
      'musk-v-openai-brief': 'musk-v-openai-brief.md',
    };
    
    const filename = materialMap[id];
    if (!filename) {
      return res.status(404).json({
        success: false,
        error: 'Material not found',
      });
    }
    
    const content = readFileSync(join(materialsDir, filename), 'utf-8');
    
    res.json({
      success: true,
      material: {
        id,
        filename,
        content,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to load material',
    });
  }
});

export default router;
