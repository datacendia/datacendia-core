// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * Evidence Infrastructure API Routes
 * 
 * Exposes legally defensible evidence services:
 * - Test evidence ledger with immutable hash chain
 * - Signed test reports with timestamps
 * - Compliance dashboard and gap analysis
 * - One-click legal evidence bundles
 */

import { Router, Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';
import {
  TestEvidenceLedgerService,
  SignedTestReportService,
  ComplianceDashboardService,
  EvidenceExportService,
  TestExecution,
} from '../services/evidence/index.js';

const router = Router();

// Initialize services
const ledgerService = TestEvidenceLedgerService.getInstance();
const reportService = SignedTestReportService.getInstance();
const complianceService = ComplianceDashboardService.getInstance();
const exportService = EvidenceExportService.getInstance();

// =============================================================================
// STATUS
// =============================================================================

router.get('/status', (req: Request, res: Response) => {
  const ledgerStats = ledgerService.getStatistics();
  
  res.json({
    success: true,
    data: {
      version: '1.0.0',
      services: {
        ledger: {
          enabled: true,
          entries: ledgerStats.totalEntries,
          blocks: ledgerStats.totalBlocks,
          chainLength: ledgerStats.chainLength,
        },
        reports: {
          enabled: true,
          description: 'Signed test reports with timestamps',
        },
        compliance: {
          enabled: true,
          description: 'Real-time compliance tracking',
        },
        export: {
          enabled: true,
          description: 'Legal evidence bundle generation',
        },
      },
    },
  });
});

// =============================================================================
// LEDGER ENDPOINTS
// =============================================================================

router.post('/ledger/record', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const execution: TestExecution = {
      id: req.body.id || `test-${Date.now()}`,
      testSuiteId: req.body.testSuiteId || 'default-suite',
      testSuiteName: req.body.testSuiteName || 'Default Suite',
      testCaseId: req.body.testCaseId || `case-${Date.now()}`,
      testCaseName: req.body.testCaseName,
      category: req.body.category || 'general',
      executedAt: new Date(req.body.executedAt || Date.now()),
      executedBy: req.body.executedBy || 'system',
      executionEnvironment: req.body.executionEnvironment || {
        hostname: 'localhost',
        platform: process.platform,
        nodeVersion: process.version,
        timestamp: new Date().toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        networkInterfaces: [],
        dnsServers: [],
        cpuUsage: 0,
        memoryUsage: 0,
        diskUsage: 0,
      },
      status: req.body.status,
      durationMs: req.body.durationMs || 0,
      assertions: req.body.assertions || [],
      requestPayload: req.body.requestPayload,
      responsePayload: req.body.responsePayload,
      errorMessage: req.body.errorMessage,
      stackTrace: req.body.stackTrace,
      tags: req.body.tags || [],
      complianceFrameworks: req.body.complianceFrameworks || [],
      securityControls: req.body.securityControls || [],
    };
    
    const entry = await ledgerService.recordExecution(execution);
    
    res.json({
      success: true,
      data: entry,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/ledger/batch', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const executions: TestExecution[] = req.body.executions;
    
    if (!Array.isArray(executions)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_INPUT', message: 'executions must be an array' },
      });
    }
    
    const entries = await ledgerService.recordBatch(executions);
    
    res.json({
      success: true,
      data: {
        recorded: entries.length,
        entries: entries.map(e => ({ id: e.id, entryHash: e.entryHash })),
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get('/ledger/entries', (req: Request, res: Response) => {
  const options: {
    suiteId?: string;
    status?: TestExecution['status'];
    category?: string;
    fromDate?: Date;
    toDate?: Date;
    limit?: number;
  } = {};
  
  if (req.query.suiteId) options.suiteId = req.query.suiteId as string;
  if (req.query.status) options.status = req.query.status as TestExecution['status'];
  if (req.query.category) options.category = req.query.category as string;
  if (req.query.fromDate) options.fromDate = new Date(req.query.fromDate as string);
  if (req.query.toDate) options.toDate = new Date(req.query.toDate as string);
  if (req.query.limit) options.limit = parseInt(req.query.limit as string, 10);
  
  const entries = ledgerService.getEntries(options);
  
  res.json({
    success: true,
    data: entries,
  });
});

router.get('/ledger/entries/:id', (req: Request, res: Response) => {
  const entry = ledgerService.getEntry(req.params.id);
  
  if (!entry) {
    return res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: 'Entry not found' },
    });
  }
  
  res.json({
    success: true,
    data: entry,
  });
});

router.get('/ledger/entries/:id/verify', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await ledgerService.verifyEntry(req.params.id);
    
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/ledger/verify', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await ledgerService.verifyChain();
    
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/ledger/statistics', (req: Request, res: Response) => {
  const stats = ledgerService.getStatistics();
  
  res.json({
    success: true,
    data: stats,
  });
});

router.get('/ledger/blocks', (req: Request, res: Response) => {
  const blocks = ledgerService.getBlocks();
  
  res.json({
    success: true,
    data: blocks,
  });
});

router.get('/ledger/blocks/:number', (req: Request, res: Response) => {
  const block = ledgerService.getBlock(parseInt(req.params.number, 10));
  
  if (!block) {
    return res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: 'Block not found' },
    });
  }
  
  res.json({
    success: true,
    data: block,
  });
});

router.get('/ledger/public-key', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      publicKey: ledgerService.getPublicKey(),
      algorithm: 'RSA-SHA256',
    },
  });
});

// =============================================================================
// AUDIT-READY ENDPOINTS (Build Identity, Execution Identity, Crypto Details)
// =============================================================================

router.get('/ledger/audit-info', (req: Request, res: Response) => {
  const reportedTestCount = req.query.testCount ? parseInt(req.query.testCount as string, 10) : undefined;
  const suiteStartTime = req.query.suiteStartTime ? new Date(req.query.suiteStartTime as string) : undefined;
  
  const crypto = ledgerService.getCryptoDetails();
  const reconciliation = ledgerService.getEntryReconciliation(reportedTestCount);
  const tamperTest = ledgerService.performTamperTest();
  const buildIdentity = TestEvidenceLedgerService.captureBuildIdentity();
  const executionIdentity = TestEvidenceLedgerService.captureExecutionIdentity();
  
  // Compute duration if start time provided
  const now = new Date();
  const durationMs = suiteStartTime ? now.getTime() - suiteStartTime.getTime() : undefined;
  const durationFormatted = durationMs ? `${Math.floor(durationMs / 1000)}s` : undefined;
  
  res.json({
    success: true,
    data: {
      timestamp: now.toISOString(),
      suiteStartTime: suiteStartTime?.toISOString(),
      suiteDuration: durationFormatted,
      buildIdentity,
      executionIdentity,
      cryptoDetails: crypto,
      entryReconciliation: reconciliation,
      tamperTest,
    },
  });
});

router.get('/ledger/build-identity', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: TestEvidenceLedgerService.captureBuildIdentity(),
  });
});

router.get('/ledger/execution-identity', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: TestEvidenceLedgerService.captureExecutionIdentity(),
  });
});

router.get('/ledger/crypto-details', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: ledgerService.getCryptoDetails(),
  });
});

router.get('/ledger/reconciliation', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: ledgerService.getEntryReconciliation(),
  });
});

router.get('/ledger/tamper-test', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: ledgerService.performTamperTest(),
  });
});

// Suite management
router.post('/ledger/suites', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const suiteId = await ledgerService.startSuite({
      suiteId: req.body.suiteId || `suite-${Date.now()}`,
      suiteName: req.body.suiteName,
      executedBy: req.body.executedBy || 'system',
    });
    
    res.json({
      success: true,
      data: { suiteId },
    });
  } catch (error) {
    next(error);
  }
});

router.post('/ledger/suites/:id/complete', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const summary = await ledgerService.completeSuite(req.params.id);
    
    res.json({
      success: true,
      data: summary,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/ledger/suites', (req: Request, res: Response) => {
  const suites = ledgerService.getSuites();
  
  res.json({
    success: true,
    data: suites,
  });
});

router.get('/ledger/suites/:id', (req: Request, res: Response) => {
  const suite = ledgerService.getSuite(req.params.id);
  
  if (!suite) {
    return res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: 'Suite not found' },
    });
  }
  
  res.json({
    success: true,
    data: suite,
  });
});

// =============================================================================
// REPORTS ENDPOINTS
// =============================================================================

router.post('/reports/suite/:suiteId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const report = await reportService.generateSuiteReport(req.params.suiteId, {
      title: req.body.title || 'Test Suite Report',
      organization: req.body.organization || 'Datacendia',
      preparedBy: req.body.preparedBy || 'system',
      preparedFor: req.body.preparedFor,
      classification: req.body.classification,
      includeRawData: req.body.includeRawData,
    });
    
    res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/reports/compliance', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const report = await reportService.generateComplianceReport({
      config: {
        title: req.body.title || 'Compliance Audit Report',
        organization: req.body.organization || 'Datacendia',
        preparedBy: req.body.preparedBy || 'system',
        preparedFor: req.body.preparedFor,
        classification: req.body.classification || 'confidential',
      },
      frameworks: req.body.frameworks || [],
      fromDate: req.body.fromDate ? new Date(req.body.fromDate) : undefined,
      toDate: req.body.toDate ? new Date(req.body.toDate) : undefined,
    });
    
    res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/reports/security', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const report = await reportService.generateSecurityReport({
      config: {
        title: req.body.title || 'Security Assessment Report',
        organization: req.body.organization || 'Datacendia',
        preparedBy: req.body.preparedBy || 'system',
        preparedFor: req.body.preparedFor,
        classification: req.body.classification || 'confidential',
      },
      securityControls: req.body.securityControls,
      fromDate: req.body.fromDate ? new Date(req.body.fromDate) : undefined,
      toDate: req.body.toDate ? new Date(req.body.toDate) : undefined,
    });
    
    res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/reports', (req: Request, res: Response) => {
  const reports = reportService.getReports({
    type: req.query.type as any,
    fromDate: req.query.fromDate ? new Date(req.query.fromDate as string) : undefined,
    toDate: req.query.toDate ? new Date(req.query.toDate as string) : undefined,
  });
  
  res.json({
    success: true,
    data: reports,
  });
});

router.get('/reports/:id', (req: Request, res: Response) => {
  const report = reportService.getReport(req.params.id);
  
  if (!report) {
    return res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: 'Report not found' },
    });
  }
  
  res.json({
    success: true,
    data: report,
  });
});

router.post('/reports/:id/sign', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const signature = await reportService.addSignature(req.params.id, {
      signedBy: req.body.signedBy,
      role: req.body.role,
    });
    
    res.json({
      success: true,
      data: signature,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/reports/:id/verify', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await reportService.verifyReport(req.params.id);
    
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

// =============================================================================
// COMPLIANCE ENDPOINTS
// =============================================================================

router.get('/compliance/frameworks', (req: Request, res: Response) => {
  const frameworks = complianceService.getFrameworks();
  
  res.json({
    success: true,
    data: frameworks,
  });
});

router.get('/compliance/frameworks/:id', (req: Request, res: Response) => {
  const framework = complianceService.getFramework(req.params.id);
  
  if (!framework) {
    return res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: 'Framework not found' },
    });
  }
  
  res.json({
    success: true,
    data: framework,
  });
});

router.get('/compliance/applicable', (req: Request, res: Response) => {
  const frameworks = complianceService.getApplicableFrameworks({
    industry: req.query.industry as string,
    region: req.query.region as string,
  });
  
  res.json({
    success: true,
    data: frameworks,
  });
});

router.post('/compliance/attest', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const attestation = await complianceService.updateAttestation({
      frameworkId: req.body.frameworkId,
      controlId: req.body.controlId,
      status: req.body.status,
      evidenceIds: req.body.evidenceIds,
      notes: req.body.notes,
      changedBy: req.body.changedBy || 'system',
    });
    
    res.json({
      success: true,
      data: attestation,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/compliance/attest-from-evidence/:frameworkId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await complianceService.attestFromEvidence(req.params.frameworkId);
    
    res.json({
      success: true,
      data: { message: 'Attestation updated from evidence' },
    });
  } catch (error) {
    next(error);
  }
});

router.get('/compliance/attestations/:frameworkId', (req: Request, res: Response) => {
  const attestations = complianceService.getAttestations(req.params.frameworkId);
  
  res.json({
    success: true,
    data: attestations,
  });
});

router.get('/compliance/scores', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const scores = await complianceService.getAllScores();
    
    res.json({
      success: true,
      data: scores,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/compliance/scores/:frameworkId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const score = await complianceService.calculateScore(req.params.frameworkId);
    
    res.json({
      success: true,
      data: score,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/compliance/gaps/:frameworkId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const analysis = await complianceService.analyzeGaps(req.params.frameworkId);
    
    res.json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/compliance/dashboard', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await complianceService.getDashboardData();
    
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
});

// =============================================================================
// EXPORT ENDPOINTS
// =============================================================================

router.post('/export/bundle', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bundle = await exportService.createBundle({
      type: req.body.type || 'audit',
      title: req.body.title || 'Evidence Bundle',
      description: req.body.description,
      purpose: req.body.purpose || 'Audit evidence',
      requestedBy: req.body.requestedBy,
      createdBy: req.body.createdBy || 'system',
      dateRange: req.body.dateRange ? {
        from: new Date(req.body.dateRange.from),
        to: new Date(req.body.dateRange.to),
      } : undefined,
      suiteIds: req.body.suiteIds,
      entryIds: req.body.entryIds,
      reportIds: req.body.reportIds,
      frameworks: req.body.frameworks,
      categories: req.body.categories,
      includeRawData: req.body.includeRawData,
      includeScreenshots: req.body.includeScreenshots,
      redactSensitive: req.body.redactSensitive,
      encrypt: req.body.encrypt,
      password: req.body.password,
    });
    
    res.json({
      success: true,
      data: bundle,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/export/bundles', (req: Request, res: Response) => {
  const bundles = exportService.getBundles({
    type: req.query.type as any,
    fromDate: req.query.fromDate ? new Date(req.query.fromDate as string) : undefined,
    toDate: req.query.toDate ? new Date(req.query.toDate as string) : undefined,
  });
  
  res.json({
    success: true,
    data: bundles,
  });
});

router.get('/export/bundles/:id', (req: Request, res: Response) => {
  const bundle = exportService.getBundle(req.params.id);
  
  if (!bundle) {
    return res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: 'Bundle not found' },
    });
  }
  
  res.json({
    success: true,
    data: bundle,
  });
});

router.get('/export/bundles/:id/verify', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await exportService.verifyBundle(req.params.id);
    
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/export/bundles/:id/download', (req: Request, res: Response) => {
  const bundle = exportService.getBundle(req.params.id);
  
  if (!bundle) {
    return res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: 'Bundle not found' },
    });
  }
  
  res.download(bundle.outputPath, `${bundle.id}.tar.gz`);
});

// =============================================================================
// ERROR HANDLER
// =============================================================================

router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('[Evidence API] Error:', err);
  
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: err.message,
    },
  });
});

export default router;
