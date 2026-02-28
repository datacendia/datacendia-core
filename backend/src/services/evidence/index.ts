// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Evidence Infrastructure Services
 * 
 * Unified exports for legally defensible test evidence.
 */

// Services
export { TestEvidenceLedgerService } from './TestEvidenceLedgerService.js';
export { SignedTestReportService } from './SignedTestReportService.js';
export { ComplianceDashboardService } from './ComplianceDashboardService.js';
export { EvidenceExportService } from './EvidenceExportService.js';
export { evidenceVaultService } from './EvidenceVaultService.js';

// Types from TestEvidenceLedgerService
export type {
  TestExecution,
  ExecutionEnvironment,
  NetworkInterface,
  Assertion,
  LedgerEntry,
  ExternalTimestamp,
  LedgerBlock,
  VerificationResult,
  TestSuiteSummary,
} from './TestEvidenceLedgerService.js';

// Types from SignedTestReportService
export type {
  ReportConfig,
  SignedReport,
  ReportSignature,
  ReportTimestamp,
  ReportOutput,
  CustodyEntry,
  ComplianceMapping,
  ControlMapping,
} from './SignedTestReportService.js';

// Types from ComplianceDashboardService
export type {
  ComplianceFramework,
  ComplianceDomain,
  ComplianceControl,
  ControlAttestation,
  ComplianceScore,
  GapAnalysis,
  ComplianceGap,
  Recommendation,
} from './ComplianceDashboardService.js';

// Types from EvidenceExportService
export type {
  ExportBundle,
  BundleManifest,
  ManifestSection,
  ManifestFile,
  CustodyRecord,
  ExportRequest,
} from './EvidenceExportService.js';
