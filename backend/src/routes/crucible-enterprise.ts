/**
 * API Routes — Crucible Enterprise
 *
 * Express route handler defining REST endpoints.
 * @module routes/crucible-enterprise
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * CendiaCrucible™ Enterprise Red-Teaming API Routes
 * 
 * Government/Enterprise Platinum Standard Implementation
 * Compliant with: NIST 800-53, FedRAMP High, SOC2 Type II, ISO 27001
 */

import { Router, Request, Response, NextFunction } from 'express';
import { enterpriseRedTeamService } from '../services/crucible/EnterpriseRedTeamService.js';
import { devAuth, requireRole } from '../middleware/auth.js';
import { errors } from '../middleware/errorHandler.js';

const router = Router();

// Apply authentication to all routes
router.use(devAuth);

/**
 * GET /api/v1/crucible-enterprise/health
 * Health check for enterprise red-teaming service
 */
router.get('/health', async (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      service: 'CendiaCrucible Enterprise Red-Teaming',
      status: 'operational',
      version: '1.0.0',
      disclaimer: 'This tool helps PREPARE for compliance audits. Actual certification requires accredited third-party auditors.',
      testsAgainstControls: [
        'NIST-800-53 (tests security controls, does NOT certify)',
        'OWASP-Top-10 (tests vulnerabilities, does NOT certify)',
        'CWE (tests weaknesses, does NOT certify)',
      ],
      actualCapabilities: {
        owaspTop10Testing: true,
        aiAdversarialTesting: true,
        chaosEngineering: true,
        scheduledTesting: true,
        vulnerabilityScanning: true,
        sbomGeneration: true,
      },
      certificationRequired: {
        'SOC2-Type-II': 'Requires CPA firm audit (6-12 months)',
        'ISO-27001': 'Requires accredited certification body',
        'FedRAMP': 'Requires 3PAO assessment + JAB/Agency ATO',
        'PCI-DSS': 'Requires QSA assessment',
        'HIPAA': 'No certification exists - requires BAA + policies',
      },
    },
  });
});

/**
 * GET /api/v1/crucible-enterprise/test-suites
 * Get available test suites
 */
router.get('/test-suites', async (_req: Request, res: Response) => {
  const suites = enterpriseRedTeamService.getTestSuites();
  
  res.json({
    success: true,
    data: {
      owasp: {
        name: 'OWASP Top 10 (2023)',
        testCount: suites.owasp.length,
        tests: suites.owasp.map(t => ({
          id: t.id,
          name: t.name,
          category: t.category,
          owaspCategory: t.owaspCategory,
          cweId: t.cweId,
        })),
      },
      ai: {
        name: 'AI Adversarial Tests',
        testCount: suites.ai.length,
        tests: suites.ai.map(t => ({
          id: t.id,
          name: t.name,
          category: t.category,
        })),
      },
      chaos: {
        name: 'Chaos Engineering',
        testCount: suites.chaos.length,
        tests: suites.chaos.map(t => ({
          id: t.id,
          name: t.name,
          category: t.category,
        })),
      },
    },
  });
});

/**
 * POST /api/v1/crucible-enterprise/run
 * Run a full security assessment
 */
router.post('/run', requireRole('ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { categories, signResults } = req.body;
    
    const report = await enterpriseRedTeamService.runFullAssessment(
      req.organizationId!,
      {
        runType: 'MANUAL',
        categories,
        signResults: signResults ?? true,
        userId: req.user?.id || 'system',
      }
    );

    res.json({
      success: true,
      data: {
        reportId: report.id,
        securityScore: report.securityScore,
        totalTests: report.totalTests,
        passed: report.passed,
        failed: report.failed,
        critical: report.critical,
        high: report.high,
        medium: report.medium,
        low: report.low,
        duration: report.endTime.getTime() - report.startTime.getTime(),
        complianceStatus: report.complianceStatus,
        signed: !!report.signature,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/crucible-enterprise/reports
 * Get historical assessment reports
 */
router.get('/reports', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit, offset } = req.query;
    
    const reports = await enterpriseRedTeamService.getReports(
      req.organizationId!,
      {
        limit: limit ? parseInt(limit as string) : 10,
        offset: offset ? parseInt(offset as string) : 0,
      }
    );

    res.json({
      success: true,
      data: reports.map(r => ({
        id: r.id,
        runType: r.runType,
        securityScore: r.securityScore,
        totalTests: r.totalTests,
        passed: r.passed,
        failed: r.failed,
        critical: r.critical,
        high: r.high,
        completedAt: r.endTime,
        signed: !!r.signature,
      })),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/crucible-enterprise/reports/:id
 * Get detailed report
 */
router.get('/reports/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const reports = await enterpriseRedTeamService.getReports(req.organizationId!);
    const report = reports.find(r => r.id === id);
    
    if (!report) {
      throw errors.notFound('Report not found');
    }

    res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/crucible-enterprise/reports/:id/verify
 * Verify report integrity
 */
router.get('/reports/:id/verify', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const verification = await enterpriseRedTeamService.verifyReportIntegrity(id || '');

    res.json({
      success: true,
      data: verification,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/crucible-enterprise/reports/:id/compliance/:framework
 * Get compliance-specific report
 */
router.get('/reports/:id/compliance/:framework', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, framework = '' } = req.params;
    
    const reports = await enterpriseRedTeamService.getReports(req.organizationId!);
    const report = reports.find(r => r.id === id);
    
    if (!report) {
      throw errors.notFound('Report not found');
    }

    const frameworkStatus = report.complianceStatus.find(
      c => c.framework === framework.toUpperCase().replace('-', '_')
    );

    if (!frameworkStatus) {
      throw errors.notFound('Framework not found in report');
    }

    // Filter results relevant to this framework
    const relevantResults = report.results.filter(r =>
      r.complianceImpact.some(i => i.framework === framework.toUpperCase().replace('-', '_'))
    );

    res.json({
      success: true,
      data: {
        framework: frameworkStatus.framework,
        compliant: frameworkStatus.compliant,
        score: frameworkStatus.score,
        findings: frameworkStatus.findings,
        criticalFindings: frameworkStatus.criticalFindings,
        assessmentDate: frameworkStatus.lastAssessed,
        results: relevantResults.map(r => ({
          testId: r.testId,
          name: r.name,
          passed: r.passed,
          severity: r.severity,
          control: r.complianceImpact.find(
            i => i.framework === framework.toUpperCase().replace('-', '_')
          )?.control,
          remediation: r.remediation,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/crucible-enterprise/schedule
 * Schedule automated assessments
 */
router.post('/schedule', requireRole('ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      cronExpression,
      testCategories,
      notifyOnFailure,
      notifyEmails,
      autoRemediate,
      blockDeployOnCritical,
    } = req.body;

    if (!cronExpression) {
      throw errors.badRequest('Cron expression is required');
    }

    const scheduleId = enterpriseRedTeamService.scheduleAssessment(
      req.organizationId!,
      {
        enabled: true,
        cronExpression,
        testCategories: testCategories || [],
        notifyOnFailure: notifyOnFailure ?? true,
        notifyEmails: notifyEmails || [],
        autoRemediate: autoRemediate ?? false,
        blockDeployOnCritical: blockDeployOnCritical ?? true,
      }
    );

    res.json({
      success: true,
      data: {
        scheduleId,
        cronExpression,
        message: 'Assessment scheduled successfully',
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/v1/crucible-enterprise/schedule/:id
 * Cancel scheduled assessment
 */
router.delete('/schedule/:id', requireRole('ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const cancelled = enterpriseRedTeamService.cancelSchedule(id || '');

    if (!cancelled) {
      throw errors.notFound('Schedule not found');
    }

    res.json({
      success: true,
      message: 'Schedule cancelled',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/crucible-enterprise/compliance-dashboard
 * Get compliance dashboard data
 */
router.get('/compliance-dashboard', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reports = await enterpriseRedTeamService.getReports(req.organizationId!, { limit: 1 });
    const latestReport = reports[0];

    if (!latestReport) {
      res.json({
        success: true,
        data: {
          noData: true,
          message: 'No assessments have been run yet',
        },
      });
      return;
    }

    res.json({
      success: true,
      data: {
        lastAssessment: latestReport.endTime,
        securityScore: latestReport.securityScore,
        frameworks: latestReport.complianceStatus.map(c => ({
          name: c.framework,
          compliant: c.compliant,
          score: c.score,
          findings: c.findings,
          criticalFindings: c.criticalFindings,
        })),
        summary: {
          totalTests: latestReport.totalTests,
          passed: latestReport.passed,
          failed: latestReport.failed,
          critical: latestReport.critical,
          high: latestReport.high,
          medium: latestReport.medium,
          low: latestReport.low,
        },
        signed: !!latestReport.signature,
        verified: latestReport.signature ? true : false,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
