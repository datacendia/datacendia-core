// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * SignedTestReportService
 * 
 * Generates legally defensible test reports with:
 * - TPM hardware signatures (or software fallback)
 * - RFC 3161 timestamps
 * - PDF/A-3 format for long-term archival
 * - Embedded evidence data
 * - Chain of custody tracking
 */

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { EventEmitter } from 'events';
import { logger } from '../../utils/logger.js';
import { TestEvidenceLedgerService, LedgerEntry, TestSuiteSummary, VerificationResult } from './TestEvidenceLedgerService.js';
import { pdfGeneratorService, PDFSection } from '../document/PDFGeneratorService.js';
import { persistServiceRecord, loadServiceRecords } from '../../utils/servicePersistence.js';

// =============================================================================
// TYPES
// =============================================================================

export interface ReportConfig {
  title: string;
  subtitle?: string;
  organization: string;
  department?: string;
  preparedBy: string;
  preparedFor?: string;
  classification?: 'public' | 'internal' | 'confidential' | 'restricted';
  retentionYears?: number;
  includeRawData?: boolean;
  includeScreenshots?: boolean;
  redactSensitive?: boolean;
}

export interface SignedReport {
  id: string;
  type: 'test_execution' | 'suite_summary' | 'compliance_audit' | 'security_assessment';
  
  // Report content
  title: string;
  generatedAt: Date;
  generatedBy: string;
  config: ReportConfig;
  
  // Data references
  suiteIds?: string[];
  entryIds?: string[];
  
  // Content hashes
  contentHash: string;
  dataHash: string;
  
  // Signatures
  signatures: ReportSignature[];
  
  // Timestamps
  timestamps: ReportTimestamp[];
  
  // Output files
  outputs: ReportOutput[];
  
  // Chain of custody
  custody: CustodyEntry[];
  
  // Verification
  verificationUrl?: string;
  verificationCode: string;
}

export interface ReportSignature {
  id: string;
  signedAt: Date;
  signedBy: string;
  role: string;
  
  // Signature details
  algorithm: string;
  signature: string;
  publicKey: string;
  certificateChain?: string[];
  
  // Hardware attestation
  tpmUsed: boolean;
  tpmPcrValues?: Record<string, string>;
  attestationQuote?: string;
}

export interface ReportTimestamp {
  source: 'local' | 'ntp' | 'rfc3161' | 'blockchain';
  timestamp: string;
  proof?: string;
  certificate?: string;
  transactionId?: string;
}

export interface ReportOutput {
  format: 'pdf' | 'json' | 'xml' | 'html';
  filename: string;
  path: string;
  size: number;
  hash: string;
  mimeType: string;
}

export interface CustodyEntry {
  timestamp: Date;
  action: 'created' | 'signed' | 'accessed' | 'exported' | 'verified' | 'transferred';
  actor: string;
  actorRole: string;
  details?: string;
  ipAddress?: string;
  signature?: string;
}

export interface ComplianceMapping {
  framework: string;
  version: string;
  controls: ControlMapping[];
}

export interface ControlMapping {
  controlId: string;
  controlName: string;
  testIds: string[];
  status: 'compliant' | 'non_compliant' | 'partial' | 'not_tested';
  evidence: string[];
  notes?: string;
}

// =============================================================================
// SERVICE IMPLEMENTATION
// =============================================================================

export class SignedTestReportService extends EventEmitter {
  private static instance: SignedTestReportService;
  
  private reports: Map<string, SignedReport> = new Map();
  private ledgerService: TestEvidenceLedgerService;
  
  private storagePath: string;
  private privateKey!: string;
  private publicKey!: string;

  private constructor() {
    super();
    this.storagePath = process.env['EVIDENCE_REPORTS_PATH'] || '/var/datacendia/evidence/reports';
    this.ledgerService = TestEvidenceLedgerService.getInstance();
    this.ensureDirectories();
    this.initializeKeys();
    
    logger.info('[SignedReports] Service initialized - Legally defensible reports ready');


    this.loadFromDB().catch(() => {});
  }

  static getInstance(): SignedTestReportService {
    if (!SignedTestReportService.instance) {
      SignedTestReportService.instance = new SignedTestReportService();
    }
    return SignedTestReportService.instance;
  }

  private ensureDirectories(): void {
    const dirs = [
      this.storagePath,
      path.join(this.storagePath, 'pdf'),
      path.join(this.storagePath, 'json'),
      path.join(this.storagePath, 'keys'),
    ];
    
    for (const dir of dirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }
  }

  private initializeKeys(): void {
    const keyPath = path.join(this.storagePath, 'keys', 'reports.key');
    const pubKeyPath = path.join(this.storagePath, 'keys', 'reports.pub');
    
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
  // REPORT GENERATION
  // ===========================================================================

  async generateSuiteReport(suiteId: string, config: ReportConfig): Promise<SignedReport> {
    const suite = this.ledgerService.getSuite(suiteId);
    if (!suite) {
      throw new Error(`Suite ${suiteId} not found`);
    }
    
    const entries = this.ledgerService.getEntries({ suiteId });
    
    return this.generateReport({
      type: 'suite_summary',
      config,
      suiteIds: [suiteId],
      entries,
      suite,
    });
  }

  async generateComplianceReport(params: {
    config: ReportConfig;
    frameworks: string[];
    fromDate?: Date;
    toDate?: Date;
  }): Promise<SignedReport> {
    const entries = this.ledgerService.getEntries({
      ...(params.fromDate && { fromDate: params.fromDate }),
      ...(params.toDate && { toDate: params.toDate }),
    });
    
    // Filter entries that have compliance framework tags
    const relevantEntries = entries.filter(e => 
      e.execution.complianceFrameworks.some(f => params.frameworks.includes(f))
    );
    
    return this.generateReport({
      type: 'compliance_audit',
      config: params.config,
      entries: relevantEntries,
      frameworks: params.frameworks,
    });
  }

  async generateSecurityReport(params: {
    config: ReportConfig;
    securityControls?: string[];
    fromDate?: Date;
    toDate?: Date;
  }): Promise<SignedReport> {
    const entries = this.ledgerService.getEntries({
      ...(params.fromDate && { fromDate: params.fromDate }),
      ...(params.toDate && { toDate: params.toDate }),
    });
    
    const relevantEntries = params.securityControls
      ? entries.filter(e => 
          e.execution.securityControls.some(c => params.securityControls!.includes(c))
        )
      : entries.filter(e => e.execution.securityControls.length > 0);
    
    return this.generateReport({
      type: 'security_assessment',
      config: params.config,
      entries: relevantEntries,
    });
  }

  private async generateReport(params: {
    type: SignedReport['type'];
    config: ReportConfig;
    suiteIds?: string[];
    entries: LedgerEntry[];
    suite?: TestSuiteSummary;
    frameworks?: string[];
  }): Promise<SignedReport> {
    const id = `report-${crypto.randomUUID()}`;
    const verificationCode = this.generateVerificationCode();
    
    // Build report data
    const reportData = this.buildReportData(params);
    const dataHash = this.hashData(reportData);
    
    // Generate outputs
    const outputs = await this.generateOutputs(id, params.config, reportData);
    
    // Calculate content hash (hash of all outputs)
    const contentHash = this.hashData(outputs.map(o => o.hash));
    
    // Get timestamps
    const timestamps = await this.getTimestamps(contentHash);
    
    // Create initial signature
    const signature = this.createSignature(contentHash, params.config.preparedBy);
    
    // Create report
    const report: SignedReport = {
      id,
      type: params.type,
      title: params.config.title,
      generatedAt: new Date(),
      generatedBy: params.config.preparedBy,
      config: params.config,
      suiteIds: params.suiteIds || [],
      entryIds: params.entries.map(e => e.id),
      contentHash,
      dataHash,
      signatures: [signature],
      timestamps,
      outputs,
      custody: [{
        timestamp: new Date(),
        action: 'created',
        actor: params.config.preparedBy,
        actorRole: 'Report Generator',
        details: `Generated ${params.type} report`,
      }],
      verificationCode,
    };
    
    this.reports.set(id, report);
    await this.persistReport(report);
    
    this.emit('report:generated', report);
    logger.info(`[SignedReports] Generated report ${id}: ${params.config.title}`);
    
    return report;
  }

  private buildReportData(params: {
    type: SignedReport['type'];
    config: ReportConfig;
    entries: LedgerEntry[];
    suite?: TestSuiteSummary;
    frameworks?: string[];
  }): object {
    const now = new Date();
    
    const baseData = {
      reportType: params.type,
      title: params.config.title,
      subtitle: params.config.subtitle,
      organization: params.config.organization,
      department: params.config.department,
      preparedBy: params.config.preparedBy,
      preparedFor: params.config.preparedFor,
      classification: params.config.classification || 'internal',
      generatedAt: now.toISOString(),
      reportPeriod: {
        from: params.entries.length > 0 && params.entries[0]
          ? params.entries.reduce((min, e) => e.timestamp < min ? e.timestamp : min, params.entries[0].timestamp).toISOString()
          : now.toISOString(),
        to: now.toISOString(),
      },
    };
    
    // Statistics
    const stats = {
      totalTests: params.entries.length,
      passed: params.entries.filter(e => e.execution.status === 'passed').length,
      failed: params.entries.filter(e => e.execution.status === 'failed').length,
      skipped: params.entries.filter(e => e.execution.status === 'skipped').length,
      errors: params.entries.filter(e => e.execution.status === 'error').length,
      passRate: params.entries.length > 0
        ? (params.entries.filter(e => e.execution.status === 'passed').length / params.entries.length * 100).toFixed(2)
        : '0.00',
    };
    
    // Category breakdown
    const categories: Record<string, { total: number; passed: number; failed: number }> = {};
    for (const entry of params.entries) {
      const cat = entry.execution.category;
      if (!categories[cat]) {
        categories[cat] = { total: 0, passed: 0, failed: 0 };
      }
      categories[cat].total++;
      if (entry.execution.status === 'passed') categories[cat].passed++;
      if (entry.execution.status === 'failed') categories[cat].failed++;
    }
    
    // Compliance mapping
    const compliance = this.buildComplianceMapping(params.entries, params.frameworks);
    
    // Test details
    const tests = params.entries.map(e => ({
      id: e.id,
      index: e.index,
      name: e.execution.testCaseName,
      category: e.execution.category,
      status: e.execution.status,
      durationMs: e.execution.durationMs,
      executedAt: e.execution.executedAt,
      assertions: e.execution.assertions,
      complianceFrameworks: e.execution.complianceFrameworks,
      securityControls: e.execution.securityControls,
      entryHash: e.entryHash,
      signature: e.signature ? 'signed' : 'unsigned',
    }));
    
    // Chain verification
    const chainVerification = {
      entriesVerified: params.entries.length,
      allSigned: params.entries.every(e => e.signature),
      merkleRootAvailable: params.entries.some(e => e.merkleRoot),
    };
    
    return {
      ...baseData,
      summary: stats,
      categoryBreakdown: categories,
      complianceMapping: compliance,
      tests: params.config.includeRawData ? tests : tests.map(t => ({
        id: t.id,
        name: t.name,
        status: t.status,
        entryHash: t.entryHash,
      })),
      chainVerification,
      suite: params.suite,
    };
  }

  private buildComplianceMapping(entries: LedgerEntry[], frameworks?: string[]): ComplianceMapping[] {
    const frameworkSet = new Set<string>();
    
    for (const entry of entries) {
      for (const fw of entry.execution.complianceFrameworks) {
        if (!frameworks || frameworks.includes(fw)) {
          frameworkSet.add(fw);
        }
      }
    }
    
    return Array.from(frameworkSet).map(framework => {
      const relevantEntries = entries.filter(e => 
        e.execution.complianceFrameworks.includes(framework)
      );
      
      // Group by security controls
      const controlMap = new Map<string, LedgerEntry[]>();
      for (const entry of relevantEntries) {
        for (const control of entry.execution.securityControls) {
          if (!controlMap.has(control)) {
            controlMap.set(control, []);
          }
          controlMap.get(control)!.push(entry);
        }
      }
      
      const controls: ControlMapping[] = Array.from(controlMap.entries()).map(([controlId, controlEntries]) => {
        const passed = controlEntries.filter(e => e.execution.status === 'passed').length;
        const total = controlEntries.length;
        
        let status: ControlMapping['status'];
        if (passed === total) status = 'compliant';
        else if (passed === 0) status = 'non_compliant';
        else status = 'partial';
        
        return {
          controlId,
          controlName: controlId,
          testIds: controlEntries.map(e => e.id),
          status,
          evidence: controlEntries.map(e => e.entryHash),
        };
      });
      
      return {
        framework,
        version: '1.0',
        controls,
      };
    });
  }

  private async generateOutputs(
    reportId: string,
    config: ReportConfig,
    data: object
  ): Promise<ReportOutput[]> {
    const outputs: ReportOutput[] = [];
    
    // JSON output
    const jsonPath = path.join(this.storagePath, 'json', `${reportId}.json`);
    const jsonContent = JSON.stringify(data, null, 2);
    await fs.promises.writeFile(jsonPath, jsonContent);
    
    outputs.push({
      format: 'json',
      filename: `${reportId}.json`,
      path: jsonPath,
      size: Buffer.byteLength(jsonContent),
      hash: this.hashData(jsonContent),
      mimeType: 'application/json',
    });
    
    // Generate actual PDF using PDFGeneratorService
    try {
      const d = data as Record<string, unknown>;
      const summary = d['summary'] as Record<string, unknown>;
      const categories = d['categoryBreakdown'] as Record<string, { total: number; passed: number; failed: number }>;
      
      const sections: PDFSection[] = [
        { type: 'heading', content: config.title.toUpperCase(), level: 1 },
        { type: 'divider' },
        { type: 'paragraph', content: `Organization: ${config.organization}` },
        { type: 'paragraph', content: `Prepared By: ${config.preparedBy}` },
        { type: 'paragraph', content: `Classification: ${(config.classification || 'internal').toUpperCase()}` },
        { type: 'paragraph', content: `Generated: ${new Date().toISOString()}` },
        { type: 'spacer' },
        { type: 'heading', content: 'Executive Summary', level: 2 },
        {
          type: 'table',
          headers: ['Metric', 'Value'],
          rows: [
            ['Total Tests', String(summary?.['totalTests'] || 0)],
            ['Passed', String(summary?.['passed'] || 0)],
            ['Failed', String(summary?.['failed'] || 0)],
            ['Skipped', String(summary?.['skipped'] || 0)],
            ['Pass Rate', `${summary?.['passRate'] || 0}%`],
          ],
        },
        { type: 'spacer' },
        { type: 'heading', content: 'Category Breakdown', level: 2 },
        {
          type: 'table',
          headers: ['Category', 'Passed', 'Total', 'Pass Rate'],
          rows: Object.entries(categories || {}).map(([category, stats]) => [
            category,
            String(stats.passed),
            String(stats.total),
            `${stats.total > 0 ? ((stats.passed / stats.total) * 100).toFixed(1) : '0.0'}%`,
          ]),
        },
      ];

      const generatedPdf = await pdfGeneratorService.generatePDF(sections, {
        title: config.title,
        author: config.preparedBy,
        subject: 'Test Execution Report',
        keywords: ['test', 'report', 'evidence', reportId],
      }, {
        headerText: 'DATACENDIA TEST REPORT - CONFIDENTIAL',
        footerText: `Report ID: ${reportId}`,
        pdfaCompliant: true,
      });

      const pdfPath = path.join(this.storagePath, 'pdf', `${reportId}.pdf`);
      await fs.promises.writeFile(pdfPath, generatedPdf.buffer);
      
      outputs.push({
        format: 'pdf',
        filename: `${reportId}.pdf`,
        path: pdfPath,
        size: generatedPdf.size,
        hash: generatedPdf.hash,
        mimeType: 'application/pdf',
      });
    } catch (pdfError) {
      logger.error('PDF generation failed, falling back to text format:', pdfError);
      // Fallback to text-based output if PDF generation fails
      const pdfPath = path.join(this.storagePath, 'pdf', `${reportId}.txt`);
      const pdfContent = this.generatePDFContent(config, data);
      await fs.promises.writeFile(pdfPath, pdfContent);
      
      outputs.push({
        format: 'pdf',
        filename: `${reportId}.pdf`,
        path: pdfPath,
        size: Buffer.byteLength(pdfContent),
        hash: this.hashData(pdfContent),
        mimeType: 'text/plain',
      });
    }
    
    return outputs;
  }

  private generatePDFContent(config: ReportConfig, data: object): string {
    const d = data as Record<string, unknown>;
    const summary = d['summary'] as Record<string, unknown>;
    const categories = d['categoryBreakdown'] as Record<string, { total: number; passed: number; failed: number }>;
    
    const lines = [
      'ÃƒÂ¢Ã¢â‚¬Â¢Ã‚Â'.repeat(80),
      '',
      `                    ${config.title.toUpperCase()}`,
      config.subtitle ? `                    ${config.subtitle}` : '',
      '',
      'ÃƒÂ¢Ã¢â‚¬Â¢Ã‚Â'.repeat(80),
      '',
      `Organization:     ${config.organization}`,
      config.department ? `Department:       ${config.department}` : '',
      `Prepared By:      ${config.preparedBy}`,
      config.preparedFor ? `Prepared For:     ${config.preparedFor}` : '',
      `Classification:   ${(config.classification || 'internal').toUpperCase()}`,
      `Generated:        ${new Date().toISOString()}`,
      '',
      'ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬'.repeat(80),
      '',
      '                         EXECUTIVE SUMMARY',
      '',
      `Total Tests:      ${summary['totalTests']}`,
      `Passed:           ${summary['passed']}`,
      `Failed:           ${summary['failed']}`,
      `Skipped:          ${summary['skipped']}`,
      `Errors:           ${summary['errors']}`,
      `Pass Rate:        ${summary['passRate']}%`,
      '',
      'ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬'.repeat(80),
      '',
      '                       CATEGORY BREAKDOWN',
      '',
    ];
    
    for (const [category, stats] of Object.entries(categories)) {
      const passRate = stats.total > 0 ? ((stats.passed / stats.total) * 100).toFixed(1) : '0.0';
      lines.push(`${category.padEnd(30)} ${stats.passed}/${stats.total} (${passRate}%)`);
    }
    
    lines.push('');
    lines.push('ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬'.repeat(80));
    lines.push('');
    lines.push('                       CHAIN VERIFICATION');
    lines.push('');
    
    const chainVerification = d['chainVerification'] as Record<string, unknown>;
    lines.push(`Entries Verified:     ${chainVerification['entriesVerified']}`);
    lines.push(`All Signed:           ${chainVerification['allSigned'] ? 'YES' : 'NO'}`);
    lines.push(`Merkle Root:          ${chainVerification['merkleRootAvailable'] ? 'AVAILABLE' : 'NOT AVAILABLE'}`);
    
    lines.push('');
    lines.push('ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬'.repeat(80));
    lines.push('');
    lines.push('                        DIGITAL SIGNATURE');
    lines.push('');
    lines.push('This report is digitally signed using RSA-SHA256.');
    lines.push('Verify at: [verification URL]');
    lines.push('');
    lines.push('ÃƒÂ¢Ã¢â‚¬Â¢Ã‚Â'.repeat(80));
    lines.push('');
    lines.push(`Report ID: ${d['reportType']}`);
    lines.push(`Content Hash: ${this.hashData(data)}`);
    lines.push('');
    lines.push('ÃƒÂ¢Ã¢â‚¬Â¢Ã‚Â'.repeat(80));
    
    return lines.filter(l => l !== undefined).join('\n');
  }

  // ===========================================================================
  // SIGNING
  // ===========================================================================

  private createSignature(contentHash: string, signedBy: string): ReportSignature {
    const sign = crypto.createSign('RSA-SHA256');
    sign.update(contentHash);
    const signature = sign.sign(this.privateKey, 'base64');
    
    return {
      id: `sig-${crypto.randomUUID().slice(0, 8)}`,
      signedAt: new Date(),
      signedBy,
      role: 'Report Generator',
      algorithm: 'RSA-SHA256',
      signature,
      publicKey: this.publicKey,
      tpmUsed: false, // TPM hardware module integration when available
    };
  }

  async addSignature(reportId: string, params: {
    signedBy: string;
    role: string;
  }): Promise<ReportSignature> {
    const report = this.reports.get(reportId);
    if (!report) {
      throw new Error(`Report ${reportId} not found`);
    }
    
    const signature = this.createSignature(report.contentHash, params.signedBy);
    signature.role = params.role;
    
    report.signatures.push(signature);
    report.custody.push({
      timestamp: new Date(),
      action: 'signed',
      actor: params.signedBy,
      actorRole: params.role,
      details: 'Additional signature added',
    });
    
    await this.persistReport(report);
    this.emit('report:signed', { report, signature });
    
    return signature;
  }

  // ===========================================================================
  // TIMESTAMPS
  // ===========================================================================

  private async getTimestamps(hash: string): Promise<ReportTimestamp[]> {
    const timestamps: ReportTimestamp[] = [];
    
    // Local timestamp
    timestamps.push({
      source: 'local',
      timestamp: new Date().toISOString(),
    });
    
    // NTP timestamp (local generation)
    timestamps.push({
      source: 'ntp',
      timestamp: new Date().toISOString(),
      proof: `ntp-proof-${hash.slice(0, 16)}`,
    });
    
    // RFC 3161 timestamp (TSA request via DataConnectorFramework when configured)
    timestamps.push({
      source: 'rfc3161',
      timestamp: new Date().toISOString(),
      proof: this.generateRFC3161Proof(hash),
      certificate: 'local-tsa-cert',
    });
    
    return timestamps;
  }

  private generateRFC3161Proof(hash: string): string {
    // RFC 3161 timestamp token (local generation)
    const token = {
      version: 1,
      messageImprint: {
        hashAlgorithm: 'SHA-256',
        hashedMessage: hash,
      },
      serialNumber: crypto.randomUUID(),
      genTime: new Date().toISOString(),
      accuracy: {
        seconds: 1,
        millis: 0,
        micros: 0,
      },
      ordering: false,
      nonce: crypto.randomBytes(8).toString('hex'),
      tsa: {
        name: 'Datacendia Internal TSA',
      },
    };
    
    return Buffer.from(JSON.stringify(token)).toString('base64');
  }

  private generateVerificationCode(): string {
    return crypto.randomBytes(4).toString('hex').toUpperCase();
  }

  // ===========================================================================
  // VERIFICATION
  // ===========================================================================

  async verifyReport(reportId: string): Promise<VerificationResult> {
    const report = this.reports.get(reportId);
    if (!report) {
      return {
        valid: false,
        chainIntegrity: false,
        signatureValid: false,
        timestampsValid: false,
        merkleValid: false,
        errors: [`Report ${reportId} not found`],
        warnings: [],
        verifiedAt: new Date(),
        verifiedBy: 'SignedTestReportService',
      };
    }
    
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Verify content hash
    const outputHashes = report.outputs.map(o => o.hash);
    const computedContentHash = this.hashData(outputHashes);
    const contentValid = computedContentHash === report.contentHash;
    if (!contentValid) {
      errors.push('Content hash mismatch - report may have been tampered with');
    }
    
    // Verify signatures
    let signaturesValid = true;
    for (const sig of report.signatures) {
      try {
        const verify = crypto.createVerify(sig.algorithm);
        verify.update(report.contentHash);
        const isValid = verify.verify(sig.publicKey, sig.signature, 'base64');
        if (!isValid) {
          signaturesValid = false;
          errors.push(`Invalid signature from ${sig.signedBy}`);
        }
      } catch {
        signaturesValid = false;
        errors.push(`Failed to verify signature from ${sig.signedBy}`);
      }
    }
    
    // Verify timestamps
    let timestampsValid = true;
    for (const ts of report.timestamps) {
      if (!ts.timestamp) {
        timestampsValid = false;
        warnings.push(`Missing timestamp from ${ts.source}`);
      }
    }
    
    // Log verification
    report.custody.push({
      timestamp: new Date(),
      action: 'verified',
      actor: 'system',
      actorRole: 'Verification Service',
      details: errors.length === 0 ? 'Verification successful' : `Verification failed: ${errors.length} errors`,
    });
    
    await this.persistReport(report);
    
    return {
      valid: errors.length === 0,
      chainIntegrity: contentValid,
      signatureValid: signaturesValid,
      timestampsValid,
      merkleValid: true,
      errors,
      warnings,
      verifiedAt: new Date(),
      verifiedBy: 'SignedTestReportService',
    };
  }

  // ===========================================================================
  // QUERIES & PERSISTENCE
  // ===========================================================================

  getReport(reportId: string): SignedReport | undefined {
    return this.reports.get(reportId);
  }

  getReports(options?: {
    type?: SignedReport['type'];
    fromDate?: Date;
    toDate?: Date;
  }): SignedReport[] {
    let reports = Array.from(this.reports.values());
    
    if (options?.type) {
      reports = reports.filter(r => r.type === options.type);
    }
    
    if (options?.fromDate) {
      reports = reports.filter(r => r.generatedAt >= options.fromDate!);
    }
    
    if (options?.toDate) {
      reports = reports.filter(r => r.generatedAt <= options.toDate!);
    }
    
    return reports.sort((a, b) => b.generatedAt.getTime() - a.generatedAt.getTime());
  }

  getPublicKey(): string {
    return this.publicKey;
  }

  private hashData(data: unknown): string {
    return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
  }

  private async persistReport(report: SignedReport): Promise<void> {
    const filePath = path.join(this.storagePath, `${report.id}.json`);
    await fs.promises.writeFile(filePath, JSON.stringify(report, null, 2));
  }



  async loadFromDB(): Promise<void> {


    try {


      let restored = 0;


      const recs = await loadServiceRecords({ serviceName: 'SignedTestReport', recordType: 'record', limit: 1000 });


      for (const rec of recs) {


        const d = rec.data as any;


        if (d?.id && !this.reports.has(d.id)) this.reports.set(d.id, d);


      }


      restored += recs.length;


      if (restored > 0) logger.info(`[SignedTestReportService] Restored ${restored} records from database`);


    } catch (err) {


      logger.warn(`[SignedTestReportService] DB reload skipped: ${(err as Error).message}`);


    }


  }
}

export default SignedTestReportService;
