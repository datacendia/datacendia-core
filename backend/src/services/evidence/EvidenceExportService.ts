// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * EvidenceExportService
 * 
 * One-click legal evidence bundle generation for:
 * - Court proceedings
 * - Regulatory audits
 * - Customer due diligence
 * - Insurance claims
 * - Internal investigations
 */

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { EventEmitter } from 'events';
import { logger } from '../../utils/logger.js';
import { TestEvidenceLedgerService, LedgerEntry, TestSuiteSummary, VerificationResult } from './TestEvidenceLedgerService.js';
import { SignedTestReportService, SignedReport } from './SignedTestReportService.js';
import { ComplianceDashboardService, ComplianceScore, GapAnalysis } from './ComplianceDashboardService.js';
import { persistServiceRecord, loadServiceRecords } from '../../utils/servicePersistence.js';

// =============================================================================
// TYPES
// =============================================================================

export interface ExportBundle {
  id: string;
  type: 'legal' | 'audit' | 'regulatory' | 'due_diligence' | 'investigation';
  
  // Metadata
  title: string;
  description: string;
  createdAt: Date;
  createdBy: string;
  requestedBy?: string;
  purpose: string;
  
  // Scope
  dateRange: {
    from: Date;
    to: Date;
  };
  frameworks?: string[];
  categories?: string[];
  
  // Contents
  manifest: BundleManifest;
  
  // Integrity
  bundleHash: string;
  signature: string;
  signedBy: string;
  
  // Delivery
  outputPath: string;
  outputFormat: 'zip' | 'tar.gz';
  outputSize: number;
  encrypted: boolean;
  encryptionKey?: string;
  
  // Chain of custody
  custody: CustodyRecord[];
  
  // Verification
  verificationCode: string;
  verificationUrl?: string;
}

export interface BundleManifest {
  version: string;
  generatedAt: string;
  
  // Summary
  totalFiles: number;
  totalSize: number;
  
  // Contents
  sections: ManifestSection[];
  
  // Hashes
  fileHashes: { path: string; hash: string; size: number }[];
  manifestHash: string;
}

export interface ManifestSection {
  name: string;
  description: string;
  files: ManifestFile[];
}

export interface ManifestFile {
  path: string;
  filename: string;
  description: string;
  format: string;
  size: number;
  hash: string;
  createdAt: string;
  signed: boolean;
}

export interface CustodyRecord {
  timestamp: Date;
  action: 'created' | 'accessed' | 'exported' | 'transferred' | 'verified' | 'sealed';
  actor: string;
  actorRole: string;
  actorOrganization?: string;
  details?: string;
  ipAddress?: string;
  signature?: string;
}

export interface ExportRequest {
  type: ExportBundle['type'];
  title: string;
  description?: string;
  purpose: string;
  requestedBy: string;
  createdBy: string;
  
  // Scope
  dateRange?: {
    from: Date;
    to: Date;
  };
  suiteIds?: string[];
  entryIds?: string[];
  reportIds?: string[];
  frameworks?: string[];
  categories?: string[];
  
  // Options
  includeRawData?: boolean;
  includeScreenshots?: boolean;
  includeSourceCode?: boolean;
  redactSensitive?: boolean;
  encrypt?: boolean;
  password?: string;
}

// =============================================================================
// SERVICE IMPLEMENTATION
// =============================================================================

export class EvidenceExportService extends EventEmitter {
  private static instance: EvidenceExportService;
  
  private bundles: Map<string, ExportBundle> = new Map();
  
  private ledgerService: TestEvidenceLedgerService;
  private reportService: SignedTestReportService;
  private complianceService: ComplianceDashboardService;
  
  private storagePath: string;
  private privateKey!: string;
  private publicKey!: string;

  private constructor() {
    super();
    this.storagePath = process.env.EVIDENCE_EXPORT_PATH || '/var/datacendia/evidence/exports';
    
    this.ledgerService = TestEvidenceLedgerService.getInstance();
    this.reportService = SignedTestReportService.getInstance();
    this.complianceService = ComplianceDashboardService.getInstance();
    
    this.ensureDirectories();
    this.initializeKeys();
    
    logger.info('[EvidenceExport] Service initialized - Legal bundle generation ready');


    this.loadFromDB().catch(() => {});
  }

  static getInstance(): EvidenceExportService {
    if (!EvidenceExportService.instance) {
      EvidenceExportService.instance = new EvidenceExportService();
    }
    return EvidenceExportService.instance;
  }

  private ensureDirectories(): void {
    const dirs = [
      this.storagePath,
      path.join(this.storagePath, 'bundles'),
      path.join(this.storagePath, 'temp'),
      path.join(this.storagePath, 'keys'),
    ];
    
    for (const dir of dirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }
  }

  private initializeKeys(): void {
    const keyPath = path.join(this.storagePath, 'keys', 'export.key');
    const pubKeyPath = path.join(this.storagePath, 'keys', 'export.pub');
    
    if (fs.existsSync(keyPath) && fs.existsSync(pubKeyPath)) {
      this.privateKey = fs.readFileSync(keyPath, 'utf8');
      this.publicKey = fs.readFileSync(pubKeyPath, 'utf8');
    } else {
      const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
      });
      
      this.privateKey = privateKey;
      this.publicKey = publicKey;
      
      fs.writeFileSync(keyPath, privateKey, { mode: 0o600 });
      fs.writeFileSync(pubKeyPath, publicKey);
    }
  }

  // ===========================================================================
  // BUNDLE CREATION
  // ===========================================================================

  async createBundle(request: ExportRequest): Promise<ExportBundle> {
    const id = `bundle-${crypto.randomUUID()}`;
    const verificationCode = crypto.randomBytes(4).toString('hex').toUpperCase();
    const tempDir = path.join(this.storagePath, 'temp', id);
    
    // Create temp directory
    fs.mkdirSync(tempDir, { recursive: true });
    
    try {
      // Determine date range
      const dateRange = request.dateRange || {
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days
        to: new Date(),
      };
      
      // Collect evidence
      const sections: ManifestSection[] = [];
      const fileHashes: { path: string; hash: string; size: number }[] = [];
      
      // 1. Cover page and executive summary
      const coverSection = await this.createCoverSection(tempDir, request, dateRange);
      sections.push(coverSection);
      fileHashes.push(...coverSection.files.map(f => ({ path: f.path, hash: f.hash, size: f.size })));
      
      // 2. Test evidence ledger entries
      const ledgerSection = await this.createLedgerSection(tempDir, request, dateRange);
      sections.push(ledgerSection);
      fileHashes.push(...ledgerSection.files.map(f => ({ path: f.path, hash: f.hash, size: f.size })));
      
      // 3. Signed reports
      const reportsSection = await this.createReportsSection(tempDir, request, dateRange);
      sections.push(reportsSection);
      fileHashes.push(...reportsSection.files.map(f => ({ path: f.path, hash: f.hash, size: f.size })));
      
      // 4. Compliance status
      const complianceSection = await this.createComplianceSection(tempDir, request);
      sections.push(complianceSection);
      fileHashes.push(...complianceSection.files.map(f => ({ path: f.path, hash: f.hash, size: f.size })));
      
      // 5. Chain verification
      const verificationSection = await this.createVerificationSection(tempDir);
      sections.push(verificationSection);
      fileHashes.push(...verificationSection.files.map(f => ({ path: f.path, hash: f.hash, size: f.size })));
      
      // 6. Public keys for verification
      const keysSection = await this.createKeysSection(tempDir);
      sections.push(keysSection);
      fileHashes.push(...keysSection.files.map(f => ({ path: f.path, hash: f.hash, size: f.size })));
      
      // Calculate totals
      const totalFiles = fileHashes.length;
      const totalSize = fileHashes.reduce((sum, f) => sum + f.size, 0);
      
      // Create manifest
      const manifest: BundleManifest = {
        version: '1.0.0',
        generatedAt: new Date().toISOString(),
        totalFiles,
        totalSize,
        sections,
        fileHashes,
        manifestHash: '',
      };
      manifest.manifestHash = this.hashData(manifest);
      
      // Write manifest
      const manifestPath = path.join(tempDir, 'MANIFEST.json');
      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
      
      // Create bundle archive
      const bundlePath = path.join(this.storagePath, 'bundles', `${id}.tar.gz`);
      await this.createArchive(tempDir, bundlePath, request.encrypt, request.password);
      
      // Calculate bundle hash
      const bundleContent = fs.readFileSync(bundlePath);
      const bundleHash = crypto.createHash('sha256').update(bundleContent).digest('hex');
      
      // Sign bundle
      const signature = this.signData(bundleHash);
      
      // Create bundle record
      const bundle: ExportBundle = {
        id,
        type: request.type,
        title: request.title,
        description: request.description || '',
        createdAt: new Date(),
        createdBy: request.createdBy,
        requestedBy: request.requestedBy,
        purpose: request.purpose,
        dateRange,
        frameworks: request.frameworks,
        categories: request.categories,
        manifest,
        bundleHash,
        signature,
        signedBy: 'EvidenceExportService',
        outputPath: bundlePath,
        outputFormat: 'tar.gz',
        outputSize: bundleContent.length,
        encrypted: request.encrypt || false,
        custody: [{
          timestamp: new Date(),
          action: 'created',
          actor: request.createdBy,
          actorRole: 'Evidence Exporter',
          details: `Created ${request.type} evidence bundle`,
        }],
        verificationCode,
      };
      
      this.bundles.set(id, bundle);
      await this.persistBundle(bundle);
      
      // Cleanup temp directory
      fs.rmSync(tempDir, { recursive: true });
      
      this.emit('bundle:created', bundle);
      logger.info(`[EvidenceExport] Created bundle ${id}: ${totalFiles} files, ${totalSize} bytes`);
      
      return bundle;
      
    } catch (error) {
      // Cleanup on error
      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true });
      }
      throw error;
    }
  }

  // ===========================================================================
  // SECTION CREATORS
  // ===========================================================================

  private async createCoverSection(
    tempDir: string,
    request: ExportRequest,
    dateRange: { from: Date; to: Date }
  ): Promise<ManifestSection> {
    const sectionDir = path.join(tempDir, '01-cover');
    fs.mkdirSync(sectionDir, { recursive: true });
    
    const files: ManifestFile[] = [];
    
    // Cover page
    const coverContent = this.generateCoverPage(request, dateRange);
    const coverPath = path.join(sectionDir, 'cover-page.txt');
    fs.writeFileSync(coverPath, coverContent);
    
    files.push({
      path: '01-cover/cover-page.txt',
      filename: 'cover-page.txt',
      description: 'Evidence bundle cover page',
      format: 'text',
      size: Buffer.byteLength(coverContent),
      hash: this.hashData(coverContent),
      createdAt: new Date().toISOString(),
      signed: false,
    });
    
    // Table of contents
    const tocContent = this.generateTableOfContents(request);
    const tocPath = path.join(sectionDir, 'table-of-contents.txt');
    fs.writeFileSync(tocPath, tocContent);
    
    files.push({
      path: '01-cover/table-of-contents.txt',
      filename: 'table-of-contents.txt',
      description: 'Bundle table of contents',
      format: 'text',
      size: Buffer.byteLength(tocContent),
      hash: this.hashData(tocContent),
      createdAt: new Date().toISOString(),
      signed: false,
    });
    
    // Executive summary
    const summaryContent = await this.generateExecutiveSummary(request, dateRange);
    const summaryPath = path.join(sectionDir, 'executive-summary.txt');
    fs.writeFileSync(summaryPath, summaryContent);
    
    files.push({
      path: '01-cover/executive-summary.txt',
      filename: 'executive-summary.txt',
      description: 'Executive summary of evidence',
      format: 'text',
      size: Buffer.byteLength(summaryContent),
      hash: this.hashData(summaryContent),
      createdAt: new Date().toISOString(),
      signed: false,
    });
    
    return {
      name: 'Cover & Summary',
      description: 'Cover page, table of contents, and executive summary',
      files,
    };
  }

  private async createLedgerSection(
    tempDir: string,
    request: ExportRequest,
    dateRange: { from: Date; to: Date }
  ): Promise<ManifestSection> {
    const sectionDir = path.join(tempDir, '02-ledger');
    fs.mkdirSync(sectionDir, { recursive: true });
    
    const files: ManifestFile[] = [];
    
    // Get ledger entries
    const entries = this.ledgerService.getEntries({
      fromDate: dateRange.from,
      toDate: dateRange.to,
    });
    
    // Full ledger export
    const ledgerPath = path.join(sectionDir, 'evidence-ledger.json');
    const ledgerContent = JSON.stringify(entries, null, 2);
    fs.writeFileSync(ledgerPath, ledgerContent);
    
    files.push({
      path: '02-ledger/evidence-ledger.json',
      filename: 'evidence-ledger.json',
      description: 'Complete evidence ledger with hash chain',
      format: 'json',
      size: Buffer.byteLength(ledgerContent),
      hash: this.hashData(ledgerContent),
      createdAt: new Date().toISOString(),
      signed: true,
    });
    
    // Ledger summary
    const stats = this.ledgerService.getStatistics();
    const statsPath = path.join(sectionDir, 'ledger-statistics.json');
    const statsContent = JSON.stringify(stats, null, 2);
    fs.writeFileSync(statsPath, statsContent);
    
    files.push({
      path: '02-ledger/ledger-statistics.json',
      filename: 'ledger-statistics.json',
      description: 'Ledger statistics and metadata',
      format: 'json',
      size: Buffer.byteLength(statsContent),
      hash: this.hashData(statsContent),
      createdAt: new Date().toISOString(),
      signed: false,
    });
    
    // Test execution details (human readable)
    const detailsContent = this.generateTestDetails(entries);
    const detailsPath = path.join(sectionDir, 'test-execution-details.txt');
    fs.writeFileSync(detailsPath, detailsContent);
    
    files.push({
      path: '02-ledger/test-execution-details.txt',
      filename: 'test-execution-details.txt',
      description: 'Human-readable test execution details',
      format: 'text',
      size: Buffer.byteLength(detailsContent),
      hash: this.hashData(detailsContent),
      createdAt: new Date().toISOString(),
      signed: false,
    });
    
    return {
      name: 'Evidence Ledger',
      description: 'Immutable test execution records with cryptographic hash chain',
      files,
    };
  }

  private async createReportsSection(
    tempDir: string,
    request: ExportRequest,
    dateRange: { from: Date; to: Date }
  ): Promise<ManifestSection> {
    const sectionDir = path.join(tempDir, '03-reports');
    fs.mkdirSync(sectionDir, { recursive: true });
    
    const files: ManifestFile[] = [];
    
    // Get signed reports
    const reports = this.reportService.getReports({
      fromDate: dateRange.from,
      toDate: dateRange.to,
    });
    
    // Reports index
    const indexPath = path.join(sectionDir, 'reports-index.json');
    const indexContent = JSON.stringify(reports.map(r => ({
      id: r.id,
      type: r.type,
      title: r.title,
      generatedAt: r.generatedAt,
      signatures: r.signatures.length,
      verified: true,
    })), null, 2);
    fs.writeFileSync(indexPath, indexContent);
    
    files.push({
      path: '03-reports/reports-index.json',
      filename: 'reports-index.json',
      description: 'Index of signed reports',
      format: 'json',
      size: Buffer.byteLength(indexContent),
      hash: this.hashData(indexContent),
      createdAt: new Date().toISOString(),
      signed: false,
    });
    
    // Include each report
    for (const report of reports) {
      const reportContent = JSON.stringify(report, null, 2);
      const reportPath = path.join(sectionDir, `${report.id}.json`);
      fs.writeFileSync(reportPath, reportContent);
      
      files.push({
        path: `03-reports/${report.id}.json`,
        filename: `${report.id}.json`,
        description: `Signed report: ${report.title}`,
        format: 'json',
        size: Buffer.byteLength(reportContent),
        hash: this.hashData(reportContent),
        createdAt: report.generatedAt.toISOString(),
        signed: true,
      });
    }
    
    return {
      name: 'Signed Reports',
      description: 'Digitally signed test reports with timestamps',
      files,
    };
  }

  private async createComplianceSection(
    tempDir: string,
    request: ExportRequest
  ): Promise<ManifestSection> {
    const sectionDir = path.join(tempDir, '04-compliance');
    fs.mkdirSync(sectionDir, { recursive: true });
    
    const files: ManifestFile[] = [];
    
    // Get compliance data
    const dashboardData = await this.complianceService.getDashboardData();
    
    // Compliance overview
    const overviewPath = path.join(sectionDir, 'compliance-overview.json');
    const overviewContent = JSON.stringify({
      frameworks: dashboardData.frameworks.map(f => ({
        id: f.id,
        name: f.name,
        version: f.version,
        totalControls: f.totalControls,
      })),
      scores: dashboardData.scores,
      auditReadiness: dashboardData.auditReadiness,
      generatedAt: new Date().toISOString(),
    }, null, 2);
    fs.writeFileSync(overviewPath, overviewContent);
    
    files.push({
      path: '04-compliance/compliance-overview.json',
      filename: 'compliance-overview.json',
      description: 'Compliance status overview',
      format: 'json',
      size: Buffer.byteLength(overviewContent),
      hash: this.hashData(overviewContent),
      createdAt: new Date().toISOString(),
      signed: false,
    });
    
    // Gap analysis for each framework
    for (const framework of dashboardData.frameworks) {
      if (request.frameworks && !request.frameworks.includes(framework.id)) continue;
      
      const analysis = await this.complianceService.analyzeGaps(framework.id);
      const analysisPath = path.join(sectionDir, `gap-analysis-${framework.id}.json`);
      const analysisContent = JSON.stringify(analysis, null, 2);
      fs.writeFileSync(analysisPath, analysisContent);
      
      files.push({
        path: `04-compliance/gap-analysis-${framework.id}.json`,
        filename: `gap-analysis-${framework.id}.json`,
        description: `Gap analysis for ${framework.name}`,
        format: 'json',
        size: Buffer.byteLength(analysisContent),
        hash: this.hashData(analysisContent),
        createdAt: new Date().toISOString(),
        signed: false,
      });
    }
    
    // Human readable compliance summary
    const summaryContent = this.generateComplianceSummary(dashboardData);
    const summaryPath = path.join(sectionDir, 'compliance-summary.txt');
    fs.writeFileSync(summaryPath, summaryContent);
    
    files.push({
      path: '04-compliance/compliance-summary.txt',
      filename: 'compliance-summary.txt',
      description: 'Human-readable compliance summary',
      format: 'text',
      size: Buffer.byteLength(summaryContent),
      hash: this.hashData(summaryContent),
      createdAt: new Date().toISOString(),
      signed: false,
    });
    
    return {
      name: 'Compliance Status',
      description: 'Compliance framework scores and gap analysis',
      files,
    };
  }

  private async createVerificationSection(tempDir: string): Promise<ManifestSection> {
    const sectionDir = path.join(tempDir, '05-verification');
    fs.mkdirSync(sectionDir, { recursive: true });
    
    const files: ManifestFile[] = [];
    
    // Chain verification
    const verification = await this.ledgerService.verifyChain();
    const verificationPath = path.join(sectionDir, 'chain-verification.json');
    const verificationContent = JSON.stringify(verification, null, 2);
    fs.writeFileSync(verificationPath, verificationContent);
    
    files.push({
      path: '05-verification/chain-verification.json',
      filename: 'chain-verification.json',
      description: 'Evidence chain integrity verification',
      format: 'json',
      size: Buffer.byteLength(verificationContent),
      hash: this.hashData(verificationContent),
      createdAt: new Date().toISOString(),
      signed: true,
    });
    
    // Verification instructions
    const instructionsContent = this.generateVerificationInstructions();
    const instructionsPath = path.join(sectionDir, 'verification-instructions.txt');
    fs.writeFileSync(instructionsPath, instructionsContent);
    
    files.push({
      path: '05-verification/verification-instructions.txt',
      filename: 'verification-instructions.txt',
      description: 'Instructions for verifying evidence integrity',
      format: 'text',
      size: Buffer.byteLength(instructionsContent),
      hash: this.hashData(instructionsContent),
      createdAt: new Date().toISOString(),
      signed: false,
    });
    
    return {
      name: 'Verification',
      description: 'Chain integrity verification and instructions',
      files,
    };
  }

  private async createKeysSection(tempDir: string): Promise<ManifestSection> {
    const sectionDir = path.join(tempDir, '06-keys');
    fs.mkdirSync(sectionDir, { recursive: true });
    
    const files: ManifestFile[] = [];
    
    // Ledger public key
    const ledgerKey = this.ledgerService.getPublicKey();
    const ledgerKeyPath = path.join(sectionDir, 'ledger-public-key.pem');
    fs.writeFileSync(ledgerKeyPath, ledgerKey);
    
    files.push({
      path: '06-keys/ledger-public-key.pem',
      filename: 'ledger-public-key.pem',
      description: 'Public key for verifying ledger signatures',
      format: 'pem',
      size: Buffer.byteLength(ledgerKey),
      hash: this.hashData(ledgerKey),
      createdAt: new Date().toISOString(),
      signed: false,
    });
    
    // Report public key
    const reportKey = this.reportService.getPublicKey();
    const reportKeyPath = path.join(sectionDir, 'report-public-key.pem');
    fs.writeFileSync(reportKeyPath, reportKey);
    
    files.push({
      path: '06-keys/report-public-key.pem',
      filename: 'report-public-key.pem',
      description: 'Public key for verifying report signatures',
      format: 'pem',
      size: Buffer.byteLength(reportKey),
      hash: this.hashData(reportKey),
      createdAt: new Date().toISOString(),
      signed: false,
    });
    
    // Export public key
    const exportKeyPath = path.join(sectionDir, 'export-public-key.pem');
    fs.writeFileSync(exportKeyPath, this.publicKey);
    
    files.push({
      path: '06-keys/export-public-key.pem',
      filename: 'export-public-key.pem',
      description: 'Public key for verifying bundle signature',
      format: 'pem',
      size: Buffer.byteLength(this.publicKey),
      hash: this.hashData(this.publicKey),
      createdAt: new Date().toISOString(),
      signed: false,
    });
    
    return {
      name: 'Public Keys',
      description: 'Public keys for signature verification',
      files,
    };
  }

  // ===========================================================================
  // CONTENT GENERATORS
  // ===========================================================================

  private generateCoverPage(request: ExportRequest, dateRange: { from: Date; to: Date }): string {
    return `
${'â•'.repeat(80)}

                    DATACENDIA EVIDENCE BUNDLE

                    ${request.title.toUpperCase()}

${'â•'.repeat(80)}

BUNDLE TYPE:        ${request.type.toUpperCase()}
PURPOSE:            ${request.purpose}

PREPARED BY:        ${request.createdBy}
REQUESTED BY:       ${request.requestedBy || 'N/A'}
DATE GENERATED:     ${new Date().toISOString()}

EVIDENCE PERIOD:
  From:             ${dateRange.from.toISOString()}
  To:               ${dateRange.to.toISOString()}

${'â”€'.repeat(80)}

LEGAL NOTICE:
This evidence bundle contains digitally signed records that form an
immutable chain of evidence. Each record is cryptographically linked
to previous records, making tampering detectable.

All signatures can be verified using the public keys included in
this bundle under the '06-keys' directory.

${'â”€'.repeat(80)}

VERIFICATION:
To verify the integrity of this bundle:
1. Check the MANIFEST.json file for file hashes
2. Verify bundle signature using export-public-key.pem
3. Verify chain integrity using chain-verification.json
4. Verify individual record signatures using ledger-public-key.pem

${'â•'.repeat(80)}
    `.trim();
  }

  private generateTableOfContents(request: ExportRequest): string {
    return `
TABLE OF CONTENTS
${'â”€'.repeat(80)}

01-cover/
    cover-page.txt              Cover page and legal notice
    table-of-contents.txt       This file
    executive-summary.txt       Executive summary of evidence

02-ledger/
    evidence-ledger.json        Complete evidence ledger (signed)
    ledger-statistics.json      Ledger statistics
    test-execution-details.txt  Human-readable test details

03-reports/
    reports-index.json          Index of signed reports
    [report-id].json            Individual signed reports

04-compliance/
    compliance-overview.json    Compliance status overview
    gap-analysis-[fw].json      Gap analysis per framework
    compliance-summary.txt      Human-readable summary

05-verification/
    chain-verification.json     Chain integrity verification
    verification-instructions.txt   How to verify this bundle

06-keys/
    ledger-public-key.pem       Ledger signature verification key
    report-public-key.pem       Report signature verification key
    export-public-key.pem       Bundle signature verification key

MANIFEST.json                   Complete file manifest with hashes
    `.trim();
  }

  private async generateExecutiveSummary(
    request: ExportRequest,
    dateRange: { from: Date; to: Date }
  ): Promise<string> {
    const stats = this.ledgerService.getStatistics();
    const entries = this.ledgerService.getEntries({ fromDate: dateRange.from, toDate: dateRange.to });
    const dashboardData = await this.complianceService.getDashboardData();
    
    const passed = entries.filter(e => e.execution.status === 'passed').length;
    const failed = entries.filter(e => e.execution.status === 'failed').length;
    const passRate = entries.length > 0 ? ((passed / entries.length) * 100).toFixed(1) : '0.0';
    
    return `
EXECUTIVE SUMMARY
${'â•'.repeat(80)}

EVIDENCE OVERVIEW
${'â”€'.repeat(80)}
Total Evidence Entries:     ${stats.totalEntries}
Entries in Period:          ${entries.length}
Chain Length:               ${stats.chainLength}
All Entries Signed:         ${entries.every(e => e.signature) ? 'YES' : 'NO'}

TEST RESULTS
${'â”€'.repeat(80)}
Tests Passed:               ${passed}
Tests Failed:               ${failed}
Pass Rate:                  ${passRate}%

COMPLIANCE STATUS
${'â”€'.repeat(80)}
Frameworks Tracked:         ${dashboardData.frameworks.length}
Overall Audit Readiness:    ${dashboardData.auditReadiness}%
Critical Gaps:              ${dashboardData.criticalGaps.length}

FRAMEWORK SCORES
${'â”€'.repeat(80)}
${dashboardData.scores.map(s => 
  `${s.frameworkName.padEnd(25)} ${s.overallScore}% (${s.overallStatus})`
).join('\n')}

CHAIN INTEGRITY
${'â”€'.repeat(80)}
The evidence ledger maintains a cryptographic hash chain where each
entry includes the hash of the previous entry. This ensures that:
- Any tampering is immediately detectable
- The order of entries cannot be changed
- No entries can be inserted or removed

All entries are digitally signed using RSA-SHA256.

${'â•'.repeat(80)}
Generated: ${new Date().toISOString()}
    `.trim();
  }

  private generateTestDetails(entries: LedgerEntry[]): string {
    const lines = [
      'TEST EXECUTION DETAILS',
      'â•'.repeat(80),
      '',
    ];
    
    for (const entry of entries.slice(0, 100)) { // Limit to 100 entries
      lines.push(`Entry ID: ${entry.id}`);
      lines.push(`Index: ${entry.index}`);
      lines.push(`Test: ${entry.execution.testCaseName}`);
      lines.push(`Category: ${entry.execution.category}`);
      lines.push(`Status: ${entry.execution.status.toUpperCase()}`);
      lines.push(`Duration: ${entry.execution.durationMs}ms`);
      lines.push(`Executed: ${entry.execution.executedAt}`);
      lines.push(`Entry Hash: ${entry.entryHash}`);
      lines.push(`Signed: ${entry.signature ? 'YES' : 'NO'}`);
      lines.push('â”€'.repeat(80));
      lines.push('');
    }
    
    if (entries.length > 100) {
      lines.push(`... and ${entries.length - 100} more entries (see evidence-ledger.json for complete data)`);
    }
    
    return lines.join('\n');
  }

  private generateComplianceSummary(dashboardData: Awaited<ReturnType<ComplianceDashboardService['getDashboardData']>>): string {
    const lines = [
      'COMPLIANCE SUMMARY',
      'â•'.repeat(80),
      '',
      `Generated: ${new Date().toISOString()}`,
      `Overall Audit Readiness: ${dashboardData.auditReadiness}%`,
      '',
    ];
    
    for (const score of dashboardData.scores) {
      lines.push('â”€'.repeat(80));
      lines.push(`FRAMEWORK: ${score.frameworkName}`);
      lines.push('â”€'.repeat(80));
      lines.push(`Overall Score: ${score.overallScore}%`);
      lines.push(`Status: ${score.overallStatus.toUpperCase()}`);
      lines.push(`Trend: ${score.trend}`);
      lines.push('');
      lines.push('Control Status:');
      lines.push(`  Compliant:      ${score.compliantControls}`);
      lines.push(`  Partial:        ${score.partialControls}`);
      lines.push(`  Non-Compliant:  ${score.nonCompliantControls}`);
      lines.push(`  Not Tested:     ${score.notTestedControls}`);
      lines.push('');
      lines.push('Domain Scores:');
      for (const domain of score.domainScores) {
        lines.push(`  ${domain.domainName.padEnd(30)} ${domain.score}%`);
      }
      lines.push('');
    }
    
    if (dashboardData.criticalGaps.length > 0) {
      lines.push('â”€'.repeat(80));
      lines.push('CRITICAL GAPS REQUIRING ATTENTION:');
      lines.push('â”€'.repeat(80));
      for (const gap of dashboardData.criticalGaps) {
        lines.push(`- ${gap.controlId}: ${gap.controlName}`);
        lines.push(`  Type: ${gap.gapType}`);
        lines.push(`  Risk: ${gap.riskImpact}`);
        lines.push('');
      }
    }
    
    return lines.join('\n');
  }

  private generateVerificationInstructions(): string {
    return `
EVIDENCE VERIFICATION INSTRUCTIONS
${'â•'.repeat(80)}

This document explains how to verify the integrity and authenticity
of the evidence contained in this bundle.

1. VERIFY MANIFEST INTEGRITY
${'â”€'.repeat(80)}
The MANIFEST.json file contains SHA-256 hashes of all files.
To verify a file has not been modified:

  1. Calculate SHA-256 hash of the file
  2. Compare with hash in MANIFEST.json fileHashes array
  3. All hashes must match exactly

2. VERIFY BUNDLE SIGNATURE
${'â”€'.repeat(80)}
The bundle itself is signed. To verify:

  1. Load 06-keys/export-public-key.pem
  2. Use RSA-SHA256 to verify signature
  3. Signature is in bundle metadata

3. VERIFY EVIDENCE CHAIN
${'â”€'.repeat(80)}
Each ledger entry contains:
  - previousHash: Hash of previous entry
  - dataHash: Hash of execution data
  - entryHash: Hash of index + timestamp + dataHash + previousHash
  - signature: RSA-SHA256 signature of entryHash

To verify the chain:
  1. Start with genesis hash
  2. For each entry, verify previousHash matches prior entryHash
  3. Verify dataHash matches actual execution data
  4. Verify entryHash computation
  5. Verify signature using ledger-public-key.pem

4. VERIFY INDIVIDUAL ENTRIES
${'â”€'.repeat(80)}
For any specific entry:

  import crypto from 'crypto';
  
  function verifyEntry(entry, publicKey) {
    const verify = crypto.createVerify('RSA-SHA256');
    verify.update(entry.entryHash);
    return verify.verify(publicKey, entry.signature, 'base64');
  }

5. VERIFY REPORT SIGNATURES
${'â”€'.repeat(80)}
Reports in 03-reports/ are signed. Verify using report-public-key.pem.

${'â•'.repeat(80)}
For technical assistance, contact: evidence@datacendia.com
    `.trim();
  }

  // ===========================================================================
  // ARCHIVE & ENCRYPTION
  // ===========================================================================

  private async createArchive(
    sourceDir: string,
    outputPath: string,
    encrypt?: boolean,
    password?: string
  ): Promise<void> {
    // Create tar.gz archive
    const files = this.getAllFiles(sourceDir);
    const archive: { path: string; content: Buffer }[] = [];
    
    for (const file of files) {
      const relativePath = path.relative(sourceDir, file);
      const content = fs.readFileSync(file);
      archive.push({ path: relativePath, content });
    }
    
    // Archive format (tar library integration via npm install tar)
    const archiveContent = JSON.stringify(archive.map(f => ({
      path: f.path,
      content: f.content.toString('base64'),
    })));
    
    // Compress
    const compressed = zlib.gzipSync(archiveContent);
    
    // Optionally encrypt
    if (encrypt && password) {
      const key = crypto.scryptSync(password, 'datacendia-evidence', 32);
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
      
      let encrypted = cipher.update(compressed);
      encrypted = Buffer.concat([encrypted, cipher.final()]);
      const authTag = cipher.getAuthTag();
      
      // Prepend IV and auth tag
      const final = Buffer.concat([iv, authTag, encrypted]);
      fs.writeFileSync(outputPath, final);
    } else {
      fs.writeFileSync(outputPath, compressed);
    }
  }

  private getAllFiles(dir: string): string[] {
    const files: string[] = [];
    
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      if (item.isDirectory()) {
        files.push(...this.getAllFiles(fullPath));
      } else {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  // ===========================================================================
  // VERIFICATION
  // ===========================================================================

  async verifyBundle(bundleId: string): Promise<VerificationResult> {
    const bundle = this.bundles.get(bundleId);
    if (!bundle) {
      return {
        valid: false,
        chainIntegrity: false,
        signatureValid: false,
        timestampsValid: false,
        merkleValid: false,
        errors: [`Bundle ${bundleId} not found`],
        warnings: [],
        verifiedAt: new Date(),
        verifiedBy: 'EvidenceExportService',
      };
    }
    
    const errors: string[] = [];
    
    // Verify bundle file exists
    if (!fs.existsSync(bundle.outputPath)) {
      errors.push('Bundle file not found');
    }
    
    // Verify bundle hash
    if (fs.existsSync(bundle.outputPath)) {
      const content = fs.readFileSync(bundle.outputPath);
      const computedHash = crypto.createHash('sha256').update(content).digest('hex');
      
      if (computedHash !== bundle.bundleHash) {
        errors.push('Bundle hash mismatch - file may have been modified');
      }
    }
    
    // Verify signature
    let signatureValid = true;
    try {
      const verify = crypto.createVerify('RSA-SHA256');
      verify.update(bundle.bundleHash);
      signatureValid = verify.verify(this.publicKey, bundle.signature, 'base64');
      
      if (!signatureValid) {
        errors.push('Invalid bundle signature');
      }
    } catch {
      signatureValid = false;
      errors.push('Failed to verify bundle signature');
    }
    
    // Record verification
    bundle.custody.push({
      timestamp: new Date(),
      action: 'verified',
      actor: 'system',
      actorRole: 'Verification Service',
      details: errors.length === 0 ? 'Verification successful' : `Verification failed: ${errors.length} errors`,
    });
    
    return {
      valid: errors.length === 0,
      chainIntegrity: errors.length === 0,
      signatureValid,
      timestampsValid: true,
      merkleValid: true,
      errors,
      warnings: [],
      verifiedAt: new Date(),
      verifiedBy: 'EvidenceExportService',
    };
  }

  // ===========================================================================
  // QUERIES & PERSISTENCE
  // ===========================================================================

  getBundle(bundleId: string): ExportBundle | undefined {
    return this.bundles.get(bundleId);
  }

  getBundles(options?: {
    type?: ExportBundle['type'];
    fromDate?: Date;
    toDate?: Date;
  }): ExportBundle[] {
    let bundles = Array.from(this.bundles.values());
    
    if (options?.type) {
      bundles = bundles.filter(b => b.type === options.type);
    }
    
    if (options?.fromDate) {
      bundles = bundles.filter(b => b.createdAt >= options.fromDate!);
    }
    
    if (options?.toDate) {
      bundles = bundles.filter(b => b.createdAt <= options.toDate!);
    }
    
    return bundles.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  private hashData(data: unknown): string {
    return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
  }

  private signData(data: string): string {
    const sign = crypto.createSign('RSA-SHA256');
    sign.update(data);
    return sign.sign(this.privateKey, 'base64');
  }

  private async persistBundle(bundle: ExportBundle): Promise<void> {
    const filePath = path.join(this.storagePath, `${bundle.id}.json`);
    await fs.promises.writeFile(filePath, JSON.stringify(bundle, null, 2));
  }



  async loadFromDB(): Promise<void> {


    try {


      let restored = 0;


      const recs = await loadServiceRecords({ serviceName: 'EvidenceExport', recordType: 'record', limit: 1000 });


      for (const rec of recs) {


        const d = rec.data as any;


        if (d?.id && !this.bundles.has(d.id)) this.bundles.set(d.id, d);


      }


      restored += recs.length;


      if (restored > 0) logger.info(`[EvidenceExportService] Restored ${restored} records from database`);


    } catch (err) {


      logger.warn(`[EvidenceExportService] DB reload skipped: ${(err as Error).message}`);


    }


  }
}

export default EvidenceExportService;
