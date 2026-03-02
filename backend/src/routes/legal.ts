// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * DATACENDIA LEGAL VERTICAL API ROUTES
 * 
 * Enterprise Platinum Standard - Complete legal vertical API
 * Includes case law ingestion, matter management, privilege gates, and citation enforcement
 */

import { Router, Request, Response } from 'express';
import { legalVerticalService } from '../services/legal';
import { caseImportService } from '../services/legal/CaseImportService';
import {
  ALL_LEGAL_MODES,
  getLegalMode,
  getLegalModesByCategory,
  getLegalModesByLeadAgent,
  LegalModeCategory,
} from '../services/legal/LegalCouncilModes';
import {
  ALL_LEGAL_AGENTS,
  getLegalAgent,
  getDefaultLegalAgents,
  getOptionalLegalAgents,
  getSilentGuardAgents,
  getLegalAgentsByExpertise,
  buildLegalAgentTeam,
  buildJuryPanel,
  getJurorArchetypes,
  getJurorAgents,
  JurorArchetype,
} from '../services/legal/LegalAgents';

const router = Router();

// =============================================================================
// HEALTH CHECK
// =============================================================================

router.get('/health', (_req: Request, res: Response) => {
  try {
    const health = legalVerticalService.getHealth();
    res.json(health);
  } catch (error) {
    res.status(500).json({ error: 'Health check failed' });
  }
});

// =============================================================================
// CASE LAW LIBRARY
// =============================================================================

/**
 * POST /api/v1/legal/cases/ingest
 * Ingest a single case into the library
 */
router.post('/cases/ingest', async (req: Request, res: Response) => {
  try {
    const caseData = req.body;
    const result = await legalVerticalService.ingestCaseLaw(caseData);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to ingest case law', details: String(error) });
  }
});

/**
 * POST /api/v1/legal/cases/bulk-ingest
 * Bulk ingest cases (e.g., from Westlaw/LexisNexis export)
 */
router.post('/cases/bulk-ingest', async (req: Request, res: Response): Promise<void> => {
  try {
    const { cases, sourceSystem, importedBy } = req.body;
    
    if (!Array.isArray(cases)) {
      res.status(400).json({ error: 'cases must be an array' });
      return;
    }
    
    const result = await legalVerticalService.bulkIngestCaseLaw(
      cases,
      sourceSystem || 'manual',
      importedBy || 'system'
    );
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to bulk ingest cases', details: String(error) });
  }
});

/**
 * POST /api/v1/legal/cases/search
 * Search the case law library
 */
router.post('/cases/search', async (req: Request, res: Response) => {
  try {
    const query = req.body;
    const results = await legalVerticalService.searchCaseLaw(query);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Search failed', details: String(error) });
  }
});

/**
 * GET /api/v1/legal/cases/:id
 * Get case by ID
 */
router.get('/cases/:id', (req: Request<{ id: string }>, res: Response): void => {
  try {
    const caseLaw = legalVerticalService.getCaseById(req.params.id);
    if (!caseLaw) {
      res.status(404).json({ error: 'Case not found' });
      return;
    }
    res.json(caseLaw);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get case', details: String(error) });
  }
});

/**
 * GET /api/v1/legal/cases/citation/:citation
 * Get case by citation
 */
router.get('/cases/citation/:citation', (req: Request<{ citation: string }>, res: Response): void => {
  try {
    const citation = decodeURIComponent(req.params.citation);
    const caseLaw = legalVerticalService.getCaseByCitation(citation);
    if (!caseLaw) {
      res.status(404).json({ error: 'Case not found for citation' });
      return;
    }
    res.json(caseLaw);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get case', details: String(error) });
  }
});

/**
 * POST /api/v1/legal/cases/verify-citation
 * Verify a citation exists in the library
 */
router.post('/cases/verify-citation', (req: Request, res: Response) => {
  try {
    const { citation } = req.body;
    const result = legalVerticalService.verifyCitation(citation);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Verification failed', details: String(error) });
  }
});

/**
 * GET /api/v1/legal/cases/stats
 * Get library statistics
 */
router.get('/cases/stats', (_req: Request, res: Response) => {
  try {
    const stats = legalVerticalService.getLibraryStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get stats', details: String(error) });
  }
});

// =============================================================================
// MATTER MANAGEMENT
// =============================================================================

/**
 * POST /api/v1/legal/matters
 * Create a new matter
 */
router.post('/matters', async (req: Request, res: Response) => {
  try {
    const matterData = req.body;
    const matter = await legalVerticalService.createMatter(matterData);
    res.status(201).json(matter);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create matter', details: String(error) });
  }
});

/**
 * GET /api/v1/legal/matters/:id
 * Get matter by ID
 */
router.get('/matters/:id', (req: Request<{ id: string }>, res: Response): void => {
  try {
    const matter = legalVerticalService.getMatter(req.params.id);
    if (!matter) {
      res.status(404).json({ error: 'Matter not found' });
      return;
    }
    res.json(matter);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get matter', details: String(error) });
  }
});

/**
 * PUT /api/v1/legal/matters/:id
 * Update matter
 */
router.put('/matters/:id', async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const updates = req.body;
    const matter = await legalVerticalService.updateMatter(req.params.id, updates);
    if (!matter) {
      res.status(404).json({ error: 'Matter not found' });
      return;
    }
    res.json(matter);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update matter', details: String(error) });
  }
});

/**
 * GET /api/v1/legal/matters
 * List matters with optional filters
 */
router.get('/matters', (req: Request, res: Response): void => {
  try {
    const filters: {
      clientId?: string;
      status?: any;
      type?: any;
      practiceArea?: string;
      responsibleAttorney?: string;
    } = {};
    
    if (req.query['clientId']) filters.clientId = req.query['clientId'] as string;
    if (req.query['status']) filters.status = req.query['status'] as any;
    if (req.query['type']) filters.type = req.query['type'] as any;
    if (req.query['practiceArea']) filters.practiceArea = req.query['practiceArea'] as string;
    if (req.query['responsibleAttorney']) filters.responsibleAttorney = req.query['responsibleAttorney'] as string;
    
    const matters = legalVerticalService.listMatters(filters);
    res.json({ matters, total: matters.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to list matters', details: String(error) });
  }
});

// =============================================================================
// PRIVILEGE MANAGEMENT
// =============================================================================

/**
 * POST /api/v1/legal/privilege/review
 * Submit a privilege review
 */
router.post('/privilege/review', async (req: Request, res: Response) => {
  try {
    const reviewData = req.body;
    const review = await legalVerticalService.submitPrivilegeReview(reviewData);
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit privilege review', details: String(error) });
  }
});

/**
 * GET /api/v1/legal/privilege/can-export/:documentId
 * Check if document can be exported (privilege gate)
 */
router.get('/privilege/can-export/:documentId', (req: Request<{ documentId: string }>, res: Response): void => {
  try {
    const result = legalVerticalService.canExportDocument(req.params.documentId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Export check failed', details: String(error) });
  }
});

/**
 * GET /api/v1/legal/privilege/reviews/:matterId
 * Get privilege reviews for a matter
 */
router.get('/privilege/reviews/:matterId', (req: Request<{ matterId: string }>, res: Response): void => {
  try {
    const reviews = legalVerticalService.getPrivilegeReviewsForMatter(req.params.matterId);
    res.json({ reviews, total: reviews.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get reviews', details: String(error) });
  }
});

// =============================================================================
// CITATION ENFORCEMENT
// =============================================================================

/**
 * POST /api/v1/legal/citations/validate
 * Validate citations
 */
router.post('/citations/validate', (req: Request, res: Response): void => {
  try {
    const { citations } = req.body;
    
    if (!Array.isArray(citations)) {
      res.status(400).json({ error: 'citations must be an array' });
      return;
    }
    
    const result = legalVerticalService.validateCitations(citations);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Validation failed', details: String(error) });
  }
});

/**
 * POST /api/v1/legal/citations/enforce
 * Enforce citation requirement (no-source-no-claim)
 */
router.post('/citations/enforce', (req: Request, res: Response): void => {
  try {
    const { claims } = req.body;
    
    if (!Array.isArray(claims)) {
      res.status(400).json({ error: 'claims must be an array' });
      return;
    }
    
    const result = legalVerticalService.enforceCitationRequirement(claims);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Enforcement failed', details: String(error) });
  }
});

// =============================================================================
// AGENT PRESETS
// =============================================================================

/**
 * GET /api/v1/legal/presets
 * Get all agent presets
 */
router.get('/presets', (_req: Request, res: Response) => {
  try {
    const presets = legalVerticalService.getAgentPresets();
    res.json({ presets });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get presets', details: String(error) });
  }
});

/**
 * GET /api/v1/legal/presets/:id
 * Get agent preset by ID
 */
router.get('/presets/:id', (req: Request<{ id: string }>, res: Response): void => {
  try {
    const preset = legalVerticalService.getAgentPreset(req.params.id);
    if (!preset) {
      res.status(404).json({ error: 'Preset not found' });
      return;
    }
    res.json(preset);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get preset', details: String(error) });
  }
});

/**
 * GET /api/v1/legal/presets/recommended/:matterType
 * Get recommended preset for matter type
 */
router.get('/presets/recommended/:matterType', (req: Request<{ matterType: string }>, res: Response): void => {
  try {
    const preset = legalVerticalService.getRecommendedPreset(req.params.matterType as any);
    res.json(preset);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get recommended preset', details: String(error) });
  }
});

// =============================================================================
// CASE IMPORT - FREE DATA SOURCES (CAP, CourtListener, CSV)
// =============================================================================

/**
 * POST /api/v1/legal/import/cap
 * Import cases from Caselaw Access Project (CAP) JSON format
 * https://case.law/download/
 */
router.post('/import/cap', async (req: Request, res: Response): Promise<void> => {
  try {
    const { cases, importedBy } = req.body;
    
    if (!cases) {
      res.status(400).json({ error: 'cases field is required (CAP JSON array or object)' });
      return;
    }
    
    // Handle both raw JSON and stringified JSON
    const jsonContent = typeof cases === 'string' ? cases : JSON.stringify(cases);
    const { cases: parsedCases, errors: parseErrors } = caseImportService.parseCAPBulkJSON(
      jsonContent,
      importedBy || 'system'
    );
    
    if (parsedCases.length === 0) {
      res.status(400).json({ 
        error: 'No valid cases found in CAP data',
        parseErrors 
      });
      return;
    }
    
    // Ingest parsed cases
    const result = await legalVerticalService.bulkIngestCaseLaw(
      parsedCases,
      'cap',
      importedBy || 'system'
    );
    
    res.json({
      ...result,
      parseErrors,
      source: 'cap',
      message: `Imported ${result.imported} cases from Caselaw Access Project`
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to import CAP cases', details: String(error) });
  }
});

/**
 * POST /api/v1/legal/import/cap/file
 * Import cases from uploaded CAP JSON file
 */
router.post('/import/cap/file', async (req: Request, res: Response): Promise<void> => {
  try {
    const { fileContent, importedBy } = req.body;
    
    if (!fileContent) {
      res.status(400).json({ error: 'fileContent is required (raw JSON string from CAP bulk download)' });
      return;
    }
    
    const { cases: parsedCases, errors: parseErrors } = caseImportService.parseCAPBulkJSON(
      fileContent,
      importedBy || 'system'
    );
    
    if (parsedCases.length === 0) {
      res.status(400).json({ 
        error: 'No valid cases found in CAP file',
        parseErrors 
      });
      return;
    }
    
    const result = await legalVerticalService.bulkIngestCaseLaw(
      parsedCases,
      'cap',
      importedBy || 'system'
    );
    
    res.json({
      ...result,
      parseErrors,
      source: 'cap',
      message: `Imported ${result.imported} cases from CAP file`
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to import CAP file', details: String(error) });
  }
});

/**
 * POST /api/v1/legal/import/courtlistener
 * Import cases from CourtListener API format
 * https://www.courtlistener.com/api/rest/v3/
 */
router.post('/import/courtlistener', async (req: Request, res: Response): Promise<void> => {
  try {
    const { cases, importedBy } = req.body;
    
    if (!Array.isArray(cases)) {
      res.status(400).json({ error: 'cases must be an array of CourtListener case objects' });
      return;
    }
    
    const parsedCases = caseImportService.parseCourtListenerCases(cases, importedBy || 'system');
    
    const result = await legalVerticalService.bulkIngestCaseLaw(
      parsedCases,
      'courtlistener',
      importedBy || 'system'
    );
    
    res.json({
      ...result,
      source: 'courtlistener',
      message: `Imported ${result.imported} cases from CourtListener`
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to import CourtListener cases', details: String(error) });
  }
});

/**
 * POST /api/v1/legal/import/csv
 * Import cases from CSV format
 * Required columns: citation, title
 * Optional: court, jurisdiction, date_decided, summary, topics, outcome, judges, plaintiff, defendant, holdings
 */
router.post('/import/csv', async (req: Request, res: Response): Promise<void> => {
  try {
    const { csvContent, importedBy } = req.body;
    
    if (!csvContent) {
      res.status(400).json({ 
        error: 'csvContent is required',
        format: 'CSV with headers: citation,title,court,jurisdiction,date_decided,summary,topics,outcome,judges,plaintiff,defendant,holdings'
      });
      return;
    }
    
    const { cases: parsedCases, errors: parseErrors } = caseImportService.parseCSV(
      csvContent,
      importedBy || 'system'
    );
    
    if (parsedCases.length === 0) {
      res.status(400).json({ 
        error: 'No valid cases found in CSV',
        parseErrors 
      });
      return;
    }
    
    const result = await legalVerticalService.bulkIngestCaseLaw(
      parsedCases,
      'csv',
      importedBy || 'system'
    );
    
    res.json({
      ...result,
      parseErrors,
      source: 'csv',
      message: `Imported ${result.imported} cases from CSV`
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to import CSV', details: String(error) });
  }
});

/**
 * GET /api/v1/legal/import/formats
 * Get supported import formats and their schemas
 */
router.get('/import/formats', (_req: Request, res: Response) => {
  res.json({
    formats: [
      {
        id: 'cap',
        name: 'Caselaw Access Project (CAP)',
        description: 'Free bulk case law from Harvard Law School',
        url: 'https://case.law/download/',
        cost: 'Free',
        coverage: 'All US case law through 2020',
        endpoint: '/api/v1/legal/import/cap',
        sampleRequest: {
          cases: [{ /* CAP case object */ }],
          importedBy: 'attorney@firm.com'
        }
      },
      {
        id: 'courtlistener',
        name: 'CourtListener / RECAP',
        description: 'Free Law Project federal court database',
        url: 'https://www.courtlistener.com/api/rest/v3/',
        cost: 'Free',
        coverage: 'Federal courts + some state courts',
        endpoint: '/api/v1/legal/import/courtlistener',
        sampleRequest: {
          cases: [{ /* CourtListener case object */ }],
          importedBy: 'attorney@firm.com'
        }
      },
      {
        id: 'csv',
        name: 'CSV Upload',
        description: 'Manual CSV import for any source',
        cost: 'Free',
        coverage: 'Any cases you have access to',
        endpoint: '/api/v1/legal/import/csv',
        requiredColumns: ['citation', 'title'],
        optionalColumns: ['court', 'jurisdiction', 'date_decided', 'summary', 'topics', 'outcome', 'judges', 'plaintiff', 'defendant', 'holdings'],
        sampleRequest: {
          csvContent: 'citation,title,court,jurisdiction,date_decided,summary\n"347 U.S. 483","Brown v. Board of Education","Supreme Court","Federal","1954-05-17","Separate but equal..."',
          importedBy: 'attorney@firm.com'
        }
      },
      {
        id: 'manual',
        name: 'Manual JSON',
        description: 'Direct JSON ingestion matching CaseLaw interface',
        cost: 'Free',
        endpoint: '/api/v1/legal/cases/ingest',
        sampleRequest: {
          citation: '347 U.S. 483',
          title: 'Brown v. Board of Education',
          court: 'Supreme Court of the United States',
          jurisdiction: 'Federal',
          dateDecided: '1954-05-17',
          summary: 'Separate educational facilities are inherently unequal.',
          headnotes: ['Equal Protection', 'Education'],
          keyPassages: [],
          topics: ['Civil Rights', 'Education'],
          citedBy: [],
          cites: ['163 U.S. 537'],
          outcome: 'Reversed',
          judges: ['Warren'],
          parties: { plaintiff: 'Oliver Brown', defendant: 'Board of Education' },
          procedural_posture: 'Appeal from U.S. District Court',
          holdings: ['Separate but equal has no place in public education'],
          importedBy: 'system',
          sourceSystem: 'manual'
        }
      }
    ],
    paidSources: [
      { name: 'Westlaw', note: 'Requires enterprise contract. Export to JSON and use manual import.' },
      { name: 'LexisNexis', note: 'Requires enterprise contract. Export to XML/JSON and use manual import.' },
      { name: 'Fastcase', note: 'Often included with state bar membership. Check your bar benefits.' },
      { name: 'Casetext', note: '$65-200/month. Has CoCounsel AI.' }
    ]
  });
});

// =============================================================================
// LEGAL COUNCIL MODES (50+)
// =============================================================================

/**
 * GET /api/v1/legal/modes
 * Get all legal council modes
 */
router.get('/modes', (_req: Request, res: Response): void => {
  res.json({
    modes: ALL_LEGAL_MODES,
    total: ALL_LEGAL_MODES.length,
    categories: ['major', 'core-practice', 'role-based', 'traditional', 'specialized'],
  });
});

/**
 * GET /api/v1/legal/modes/:id
 * Get a specific legal mode by ID
 */
router.get('/modes/:id', (req: Request<{ id: string }>, res: Response): void => {
  try {
    const mode = getLegalMode(req.params.id);
    if (!mode) {
      res.status(404).json({ error: 'Legal mode not found' });
      return;
    }
    res.json(mode);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get legal mode', details: String(error) });
  }
});

/**
 * GET /api/v1/legal/modes/category/:category
 * Get legal modes by category
 */
router.get('/modes/category/:category', (req: Request<{ category: string }>, res: Response): void => {
  try {
    const category = req.params.category as LegalModeCategory;
    const validCategories = ['major', 'core-practice', 'role-based', 'traditional', 'specialized'];
    
    if (!validCategories.includes(category)) {
      res.status(400).json({ 
        error: 'Invalid category',
        validCategories 
      });
      return;
    }
    
    const modes = getLegalModesByCategory(category);
    res.json({ modes, total: modes.length, category });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get modes by category', details: String(error) });
  }
});

/**
 * GET /api/v1/legal/modes/lead-agent/:agentId
 * Get legal modes by lead agent
 */
router.get('/modes/lead-agent/:agentId', (req: Request<{ agentId: string }>, res: Response): void => {
  try {
    const modes = getLegalModesByLeadAgent(req.params.agentId);
    res.json({ modes, total: modes.length, leadAgent: req.params.agentId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get modes by lead agent', details: String(error) });
  }
});

// =============================================================================
// LEGAL AGENTS (14)
// =============================================================================

/**
 * GET /api/v1/legal/agents
 * Get all legal agents
 */
router.get('/agents', (_req: Request, res: Response): void => {
  res.json({
    agents: ALL_LEGAL_AGENTS,
    total: ALL_LEGAL_AGENTS.length,
    defaultAgents: getDefaultLegalAgents().length,
    optionalAgents: getOptionalLegalAgents().length,
  });
});

/**
 * GET /api/v1/legal/agents/default
 * Get default legal agents (8)
 */
router.get('/agents/default', (_req: Request, res: Response): void => {
  const agents = getDefaultLegalAgents();
  res.json({ agents, total: agents.length });
});

/**
 * GET /api/v1/legal/agents/optional
 * Get optional legal agents (6)
 */
router.get('/agents/optional', (_req: Request, res: Response): void => {
  const agents = getOptionalLegalAgents();
  res.json({ agents, total: agents.length });
});

/**
 * GET /api/v1/legal/agents/guards
 * Get silent guard agents (3) - The "Legal Guard" team
 * These agents don't chat; they silently veto dangerous prompts.
 */
router.get('/agents/guards', (_req: Request, res: Response): void => {
  const agents = getSilentGuardAgents();
  res.json({ 
    agents, 
    total: agents.length,
    description: 'Silent Guard agents run as pre-flight checks on every legal vertical request',
    guards: {
      clientInstructionOfficer: 'Stops the user from asking the wrong things (engagement scope)',
      dataBoundaryOfficer: 'Stops the AI from seeing the wrong data (matter isolation)',
      qualityAssuranceCounsel: 'Stops the AI from outputting the wrong format (output validation)',
    }
  });
});

/**
 * GET /api/v1/legal/agents/:id
 * Get a specific legal agent by ID
 */
router.get('/agents/:id', (req: Request<{ id: string }>, res: Response): void => {
  try {
    const agent = getLegalAgent(req.params.id);
    if (!agent) {
      res.status(404).json({ error: 'Legal agent not found' });
      return;
    }
    res.json(agent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get legal agent', details: String(error) });
  }
});

/**
 * GET /api/v1/legal/agents/expertise/:expertise
 * Get legal agents by expertise area
 */
router.get('/agents/expertise/:expertise', (req: Request<{ expertise: string }>, res: Response): void => {
  try {
    const agents = getLegalAgentsByExpertise(req.params.expertise);
    res.json({ agents, total: agents.length, expertise: req.params.expertise });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get agents by expertise', details: String(error) });
  }
});

/**
 * POST /api/v1/legal/agents/build-team
 * Build an agent team for a legal mode
 */
router.post('/agents/build-team', (req: Request, res: Response): void => {
  try {
    const { modeId, includeOptional } = req.body;
    
    if (!modeId) {
      res.status(400).json({ error: 'modeId is required' });
      return;
    }
    
    const mode = getLegalMode(modeId);
    if (!mode) {
      res.status(404).json({ error: 'Legal mode not found' });
      return;
    }
    
    const optionalAgentIds = includeOptional ? mode.optionalAgents : [];
    const team = buildLegalAgentTeam(mode.defaultAgents, optionalAgentIds);
    
    res.json({
      mode: {
        id: mode.id,
        name: mode.name,
        purpose: mode.purpose,
        primeDirective: mode.primeDirective,
      },
      team,
      totalAgents: team.defaultAgents.length + team.optionalAgents.length,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to build agent team', details: String(error) });
  }
});

// =============================================================================
// LEGAL VERTICAL SUMMARY
// =============================================================================

/**
 * GET /api/v1/legal/summary
 * Get complete legal vertical summary
 */
router.get('/summary', (_req: Request, res: Response): void => {
  const health = legalVerticalService.getHealth();
  
  res.json({
    vertical: 'legal',
    name: 'CendiaLegal™',
    description: 'Enterprise legal vertical with case law library, matter management, privilege gates, and citation enforcement',
    capabilities: {
      caseLibrary: {
        size: health.caseLibrarySize,
        features: ['Case Ingestion', 'Bulk Import', 'Search', 'Citation Verification'],
      },
      matterManagement: {
        count: health.mattersCount,
        features: ['Matter Creation', 'Status Tracking', 'Conflicts Clearance'],
        types: ['Litigation', 'Transactional', 'Regulatory', 'Advisory', 'Investigation', 'IP', 'Employment', 'Real Estate'],
      },
      privilegeGates: {
        reviewCount: health.privilegeReviewsCount,
        features: ['Privilege Review', 'Export Gate', 'Privilege Log', 'Redaction Tracking'],
      },
      citationEnforcement: {
        features: ['No-Source-No-Claim', 'Batch Validation', 'Warning System'],
      },
    },
    councilModes: {
      total: ALL_LEGAL_MODES.length,
      categories: {
        major: getLegalModesByCategory('major').length,
        corePractice: getLegalModesByCategory('core-practice').length,
        roleBased: getLegalModesByCategory('role-based').length,
        traditional: getLegalModesByCategory('traditional').length,
        specialized: getLegalModesByCategory('specialized').length,
      },
    },
    agents: {
      total: ALL_LEGAL_AGENTS.length,
      default: getDefaultLegalAgents().length,
      optional: getOptionalLegalAgents().length,
    },
    importFormats: ['CAP (Caselaw Access Project)', 'CourtListener', 'CSV', 'Manual JSON'],
    health: health.status,
  });
});

// =============================================================================
// LEGAL WORKFLOWS
// =============================================================================

/**
 * GET /api/v1/legal/workflows
 * Get all legal-specific workflows that use the 50+ legal council modes
 */
router.get('/workflows', async (_req: Request, res: Response): Promise<void> => {
  try {
    const fs = await import('fs').then(m => m.promises);
    const path = await import('path');
    const workflowPath = path.join(__dirname, '../data/workflow-scenarios-legal.json');
    const content = await fs.readFile(workflowPath, 'utf-8');
    const workflows = JSON.parse(content);
    res.json(workflows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load legal workflows', details: String(error) });
  }
});

/**
 * GET /api/v1/legal/workflows/:id
 * Get a specific legal workflow by ID
 */
router.get('/workflows/:id', async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const fs = await import('fs').then(m => m.promises);
    const path = await import('path');
    const workflowPath = path.join(__dirname, '../data/workflow-scenarios-legal.json');
    const content = await fs.readFile(workflowPath, 'utf-8');
    const data = JSON.parse(content);
    const workflow = data.workflows.find((w: { id: string }) => w.id === req.params.id);
    
    if (!workflow) {
      res.status(404).json({ error: 'Legal workflow not found' });
      return;
    }
    
    // Enrich with mode and agent details
    const mode = getLegalMode(workflow.councilMode);
    res.json({
      ...workflow,
      modeDetails: mode || null,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load legal workflow', details: String(error) });
  }
});

// =============================================================================
// JURY PANEL BUILDER
// =============================================================================

/**
 * GET /api/v1/legal/jury/archetypes
 * Get all juror archetype definitions
 */
router.get('/jury/archetypes', (_req: Request, res: Response): void => {
  const archetypes = getJurorArchetypes();
  const jurorAgents = getJurorAgents();
  res.json({
    archetypes,
    baseAgents: jurorAgents.map(a => ({ id: a.id, name: a.name, role: a.role })),
    totalArchetypes: Object.keys(archetypes).length,
    description: '12 juror personality archetypes for building realistic jury panels',
  });
});

/**
 * POST /api/v1/legal/jury/build
 * Build a 12-person jury panel with custom composition
 */
router.post('/jury/build', (req: Request, res: Response): void => {
  try {
    const { caseId, composition, alternates } = req.body;
    
    if (!caseId) {
      res.status(400).json({ error: 'caseId is required' });
      return;
    }
    
    // Validate composition if provided
    const validArchetypes: JurorArchetype[] = [
      'skeptic', 'emotional', 'analytical', 'foreperson',
      'pragmatist', 'rule-follower', 'life-experience', 'quiet-observer',
      'quick-decider', 'holdout', 'mediator', 'detail-checker'
    ];
    
    if (composition) {
      for (const key of Object.keys(composition)) {
        if (!validArchetypes.includes(key as JurorArchetype)) {
          res.status(400).json({ 
            error: `Invalid archetype: ${key}`,
            validArchetypes 
          });
          return;
        }
      }
    }
    
    const panel = buildJuryPanel(
      caseId,
      composition as Partial<Record<JurorArchetype, number>>,
      alternates ?? 2
    );
    
    res.json({
      panel,
      summary: {
        totalJurors: panel.jurors.length,
        totalAlternates: panel.alternates.length,
        foreperson: panel.foreperson.name,
        composition: panel.composition,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to build jury panel', details: String(error) });
  }
});

/**
 * GET /api/v1/legal/jury/default
 * Get a default 12-person jury panel for a case
 */
router.get('/jury/default/:caseId', (req: Request<{ caseId: string }>, res: Response): void => {
  try {
    const panel = buildJuryPanel(req.params.caseId);
    res.json({
      panel,
      summary: {
        totalJurors: panel.jurors.length,
        totalAlternates: panel.alternates.length,
        foreperson: panel.foreperson.name,
        composition: panel.composition,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to build default jury panel', details: String(error) });
  }
});

export default router;
