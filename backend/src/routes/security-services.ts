/**
 * API Routes — Security Services
 *
 * Express route handler defining REST endpoints.
 * @module routes/security-services
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * Security Services API Routes
 * 
 * Endpoints for:
 * - Immutable Audit Ledger
 * - SIEM Integration
 * - Compliance Export
 * - SBOM Generation
 */

import { Router, Request, Response } from 'express';
import { logger } from '../utils/logger.js';
import { immutableAuditLedger } from '../services/security/ImmutableAuditLedger.js';
import { siemIntegration, SIEMConfig } from '../services/security/SIEMIntegration.js';
import { complianceExportService, ComplianceFramework } from '../services/security/ComplianceExportService.js';
import { sbomGenerator } from '../services/security/SBOMGenerator.js';

const router = Router();

// =============================================================================
// IMMUTABLE AUDIT LEDGER
// =============================================================================

/**
 * GET /api/security/audit/entries
 * Get audit entries with integrity proof
 */
router.get('/audit/entries', async (req: Request, res: Response) => {
  try {
    const { organizationId, startDate, endDate, eventTypes, limit } = req.query;

    if (!organizationId) {
      return res.status(400).json({ error: 'organizationId is required' });
    }

    const { entries, proof } = await immutableAuditLedger.getEntriesWithProof({
      organizationId: organizationId as string,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
      eventTypes: eventTypes ? (eventTypes as string).split(',') : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });

    res.json({
      entries,
      proof,
      count: entries.length,
    });
  } catch (error) {
    logger.error('[SecurityAPI] Error fetching audit entries:', error);
    res.status(500).json({ error: 'Failed to fetch audit entries' });
  }
});

/**
 * GET /api/security/audit/verify
 * Verify ledger integrity
 */
router.get('/audit/verify', async (_req: Request, res: Response) => {
  try {
    const proof = await immutableAuditLedger.verifyIntegrity();
    res.json(proof);
  } catch (error) {
    logger.error('[SecurityAPI] Error verifying audit ledger:', error);
    res.status(500).json({ error: 'Failed to verify audit ledger' });
  }
});

/**
 * POST /api/security/audit/export
 * Export audit log with cryptographic proof
 */
router.post('/audit/export', async (req: Request, res: Response) => {
  try {
    const { organizationId, startDate, endDate, exportedBy } = req.body;

    if (!organizationId || !startDate || !endDate || !exportedBy) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const exportData = await immutableAuditLedger.exportWithProof({
      organizationId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      exportedBy,
    });

    res.json(exportData);
  } catch (error) {
    logger.error('[SecurityAPI] Error exporting audit log:', error);
    res.status(500).json({ error: 'Failed to export audit log' });
  }
});

/**
 * GET /api/security/audit/stats
 * Get ledger statistics
 */
router.get('/audit/stats', (_req: Request, res: Response) => {
  try {
    const stats = immutableAuditLedger.getStats();
    res.json(stats);
  } catch (error) {
    logger.error('[SecurityAPI] Error fetching audit stats:', error);
    res.status(500).json({ error: 'Failed to fetch audit stats' });
  }
});

// =============================================================================
// SIEM INTEGRATION
// =============================================================================

/**
 * GET /api/security/siem/integrations
 * List SIEM integrations for an organization
 */
router.get('/siem/integrations', (req: Request, res: Response) => {
  try {
    const { organizationId } = req.query;

    if (!organizationId) {
      return res.status(400).json({ error: 'organizationId is required' });
    }

    const integrations = siemIntegration.getIntegrations(organizationId as string);
    
    // Mask credentials in response
    const safeIntegrations = integrations.map(i => ({
      ...i,
      credentials: {
        token: i.credentials.token ? '***' : undefined,
        apiKey: i.credentials.apiKey ? '***' : undefined,
        username: i.credentials.username,
        password: i.credentials.password ? '***' : undefined,
      },
    }));

    res.json(safeIntegrations);
  } catch (error) {
    logger.error('[SecurityAPI] Error fetching SIEM integrations:', error);
    res.status(500).json({ error: 'Failed to fetch SIEM integrations' });
  }
});

/**
 * POST /api/security/siem/integrations
 * Register a new SIEM integration
 */
router.post('/siem/integrations', async (req: Request, res: Response) => {
  try {
    const config: Omit<SIEMConfig, 'id' | 'createdAt' | 'updatedAt'> = req.body;

    if (!config.provider || !config.endpoint || !config.organizationId) {
      return res.status(400).json({ error: 'Missing required fields: provider, endpoint, organizationId' });
    }

    const integration = await siemIntegration.registerIntegration(config);
    
    res.status(201).json({
      ...integration,
      credentials: { ...integration.credentials, token: '***', apiKey: '***', password: '***' },
    });
  } catch (error) {
    logger.error('[SecurityAPI] Error registering SIEM integration:', error);
    res.status(500).json({ error: 'Failed to register SIEM integration' });
  }
});

/**
 * POST /api/security/siem/integrations/:id/test
 * Test SIEM connection
 */
router.post('/siem/integrations/:id/test', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await siemIntegration.testConnection(id);
    res.json(result);
  } catch (error) {
    logger.error('[SecurityAPI] Error testing SIEM connection:', error);
    res.status(500).json({ error: 'Failed to test SIEM connection' });
  }
});

/**
 * DELETE /api/security/siem/integrations/:id
 * Remove a SIEM integration
 */
router.delete('/siem/integrations/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const removed = await siemIntegration.removeIntegration(id);
    
    if (!removed) {
      return res.status(404).json({ error: 'Integration not found' });
    }

    res.json({ success: true });
  } catch (error) {
    logger.error('[SecurityAPI] Error removing SIEM integration:', error);
    res.status(500).json({ error: 'Failed to remove SIEM integration' });
  }
});

/**
 * GET /api/security/siem/stats
 * Get SIEM delivery statistics
 */
router.get('/siem/stats', (req: Request, res: Response) => {
  try {
    const { organizationId } = req.query;
    const stats = siemIntegration.getDeliveryStats(organizationId as string | undefined);
    res.json(stats);
  } catch (error) {
    logger.error('[SecurityAPI] Error fetching SIEM stats:', error);
    res.status(500).json({ error: 'Failed to fetch SIEM stats' });
  }
});

// =============================================================================
// COMPLIANCE EXPORT
// =============================================================================

/**
 * GET /api/security/compliance/frameworks
 * List available compliance frameworks
 */
router.get('/compliance/frameworks', (_req: Request, res: Response) => {
  try {
    const frameworks = complianceExportService.getAvailableFrameworks();
    res.json(frameworks);
  } catch (error) {
    logger.error('[SecurityAPI] Error fetching compliance frameworks:', error);
    res.status(500).json({ error: 'Failed to fetch compliance frameworks' });
  }
});

/**
 * POST /api/security/compliance/export
 * Generate compliance export package
 */
router.post('/compliance/export', async (req: Request, res: Response) => {
  try {
    const { organizationId, framework, startDate, endDate, requestedBy, includeRawLogs, includeIntegrityProof } = req.body;

    if (!organizationId || !framework || !startDate || !endDate || !requestedBy) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const validFrameworks: ComplianceFramework[] = ['soc2', 'hipaa', 'gdpr', 'iso27001', 'nist', 'pci_dss'];
    if (!validFrameworks.includes(framework)) {
      return res.status(400).json({ error: `Invalid framework. Must be one of: ${validFrameworks.join(', ')}` });
    }

    const result = await complianceExportService.generateExport({
      organizationId,
      framework,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      requestedBy,
      includeRawLogs: includeRawLogs ?? true,
      includeIntegrityProof: includeIntegrityProof ?? true,
    });

    res.json(result);
  } catch (error) {
    logger.error('[SecurityAPI] Error generating compliance export:', error);
    res.status(500).json({ error: 'Failed to generate compliance export' });
  }
});

/**
 * POST /api/security/compliance/verify
 * Verify a compliance export
 */
router.post('/compliance/verify', (req: Request, res: Response) => {
  try {
    const exportData = req.body;

    if (!exportData || !exportData.signature) {
      return res.status(400).json({ error: 'Invalid export data' });
    }

    const result = complianceExportService.verifyExport(exportData);
    res.json(result);
  } catch (error) {
    logger.error('[SecurityAPI] Error verifying compliance export:', error);
    res.status(500).json({ error: 'Failed to verify compliance export' });
  }
});

// =============================================================================
// SBOM GENERATION
// =============================================================================

/**
 * GET /api/security/sbom
 * Generate SBOM for the platform
 */
router.get('/sbom', async (req: Request, res: Response) => {
  try {
    const { format } = req.query;
    const sbomFormat = format === 'spdx' ? 'spdx' : 'cyclonedx';
    
    const sbom = await sbomGenerator.generatePlatformSBOM(sbomFormat);
    const exported = sbomGenerator.export(sbom);

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="datacendia-sbom.${sbomFormat}.json"`);
    res.send(exported);
  } catch (error) {
    logger.error('[SecurityAPI] Error generating SBOM:', error);
    res.status(500).json({ error: 'Failed to generate SBOM' });
  }
});

/**
 * GET /api/security/sbom/summary
 * Get SBOM summary (without full export)
 */
router.get('/sbom/summary', async (req: Request, res: Response) => {
  try {
    const sbom = await sbomGenerator.generatePlatformSBOM('cyclonedx');
    const licenseSummary = sbomGenerator.getLicenseSummary(sbom);

    res.json({
      componentCount: sbom.components.length,
      vulnerabilities: sbom.vulnerabilitySummary,
      licenses: licenseSummary,
      generatedAt: sbom.metadata.timestamp,
    });
  } catch (error) {
    logger.error('[SecurityAPI] Error generating SBOM summary:', error);
    res.status(500).json({ error: 'Failed to generate SBOM summary' });
  }
});

/**
 * GET /api/security/sbom/licenses
 * Get license compliance summary
 */
router.get('/sbom/licenses', async (_req: Request, res: Response) => {
  try {
    const sbom = await sbomGenerator.generatePlatformSBOM('cyclonedx');
    const licenseSummary = sbomGenerator.getLicenseSummary(sbom);

    // Categorize licenses by type
    const categories = {
      permissive: ['MIT', 'Apache-2.0', 'BSD-2-Clause', 'BSD-3-Clause', 'ISC', 'Unlicense'],
      copyleft: ['GPL-2.0', 'GPL-3.0', 'LGPL-2.1', 'LGPL-3.0', 'AGPL-3.0'],
      unknown: ['UNKNOWN'],
    };

    const categorized: Record<string, { licenses: string[]; count: number }> = {
      permissive: { licenses: [], count: 0 },
      copyleft: { licenses: [], count: 0 },
      other: { licenses: [], count: 0 },
      unknown: { licenses: [], count: 0 },
    };

    for (const [license, count] of Object.entries(licenseSummary)) {
      let found = false;
      for (const [category, licenseList] of Object.entries(categories)) {
        if (licenseList.includes(license)) {
          categorized[category].licenses.push(license);
          categorized[category].count += count;
          found = true;
          break;
        }
      }
      if (!found) {
        categorized['other'].licenses.push(license);
        categorized['other'].count += count;
      }
    }

    res.json({
      summary: licenseSummary,
      categorized,
      totalComponents: sbom.components.length,
    });
  } catch (error) {
    logger.error('[SecurityAPI] Error fetching license summary:', error);
    res.status(500).json({ error: 'Failed to fetch license summary' });
  }
});

export default router;
