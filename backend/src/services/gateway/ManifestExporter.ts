/**
 * CendiaGateway™ — The Governance Receipt™ Exporter
 *
 * Generates The Governance Receipt™ — a print-ready, cryptographically
 * verified document that a CISO hands to a regulator proving every AI
 * interaction was governed. Designed for auditors, regulators, and
 * board presentations.
 *
 * The Governance Receipt™ includes:
 *   - Executive summary with key metrics
 *   - PII governance breakdown
 *   - Policy enforcement summary
 *   - Department-level usage analysis
 *   - Cryptographic integrity verification (DCII)
 *   - Regulatory compliance mapping (EU AI Act, GDPR, HIPAA, SOX)
 *   - Attestation signature blocks
 *
 * Zero external dependencies — generates self-contained HTML with inline CSS.
 *
 * @module services/gateway/ManifestExporter
 */

import type { AIManifest } from './CendiaGatewayService';

// =============================================================================
// EXPORTER
// =============================================================================

class ManifestExporter {

  /**
   * Generate The Governance Receipt™ as a self-contained HTML document.
   * Print-optimized — save as PDF via browser print dialog or wkhtmltopdf.
   */
  toHTML(manifest: AIManifest): string {
    const periodStart = new Date(manifest.periodStart).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const periodEnd = new Date(manifest.periodEnd).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const generatedAt = new Date(manifest.generatedAt).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short' });

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>The Governance Receipt™ — ${manifest.organizationName} — ${periodStart} to ${periodEnd}</title>
  <style>
    @page { size: A4; margin: 20mm; }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .no-print { display: none !important; }
      .page-break { page-break-before: always; }
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Georgia', 'Times New Roman', serif;
      color: #1A1A1A;
      line-height: 1.6;
      background: #fff;
      font-size: 11pt;
    }
    .container { max-width: 800px; margin: 0 auto; padding: 40px 20px; }

    /* Header */
    .header {
      text-align: center;
      border-bottom: 3px double #D4AF37;
      padding-bottom: 24px;
      margin-bottom: 32px;
    }
    .header .logo { font-size: 28pt; font-weight: bold; color: #D4AF37; letter-spacing: 2px; }
    .header .subtitle { font-size: 14pt; color: #666; margin-top: 4px; }
    .header .doc-title {
      font-size: 18pt; font-weight: bold; color: #1A1A1A;
      margin-top: 16px; text-transform: uppercase; letter-spacing: 1px;
    }
    .header .period { font-size: 12pt; color: #555; margin-top: 8px; }

    /* Classification banner */
    .classification {
      background: #FEF3C7; border: 1px solid #D97706;
      text-align: center; padding: 6px; font-size: 9pt;
      font-weight: bold; color: #92400E; margin-bottom: 24px;
      text-transform: uppercase; letter-spacing: 1px;
    }

    /* Sections */
    h2 {
      font-size: 14pt; color: #1A1A1A; border-bottom: 1px solid #D4AF37;
      padding-bottom: 6px; margin: 28px 0 16px; text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    h3 { font-size: 12pt; color: #333; margin: 16px 0 8px; }

    /* Summary grid */
    .summary-grid {
      display: grid; grid-template-columns: repeat(4, 1fr);
      gap: 12px; margin: 16px 0;
    }
    .stat-box {
      background: #F9F9F9; border: 1px solid #E5E5E5; border-radius: 4px;
      padding: 12px; text-align: center;
    }
    .stat-box .value { font-size: 22pt; font-weight: bold; color: #D4AF37; }
    .stat-box .label { font-size: 8pt; color: #888; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px; }

    /* Tables */
    table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 10pt; }
    th { background: #F5F5F5; border: 1px solid #DDD; padding: 8px 10px; text-align: left; font-weight: 600; font-size: 9pt; text-transform: uppercase; letter-spacing: 0.3px; }
    td { border: 1px solid #DDD; padding: 8px 10px; }
    tr:nth-child(even) td { background: #FAFAFA; }

    /* Compliance */
    .compliance-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 12px 0; }
    .compliance-item {
      display: flex; align-items: center; gap: 8px;
      padding: 10px; border: 1px solid #E5E5E5; border-radius: 4px;
    }
    .compliance-item .icon { font-size: 16pt; }
    .compliance-item .text { font-size: 10pt; }
    .compliance-item .regulation { font-weight: 600; }

    /* Integrity */
    .integrity-box {
      background: #F0FDF4; border: 1px solid #22C55E; border-radius: 4px;
      padding: 16px; margin: 12px 0;
    }
    .integrity-box .status { font-size: 14pt; font-weight: bold; color: #16A34A; }
    .hash-value {
      font-family: 'Courier New', monospace; font-size: 8pt; color: #555;
      word-break: break-all; background: #F5F5F5; padding: 4px 8px;
      border-radius: 2px; margin: 4px 0;
    }

    /* Signature block */
    .signature-block {
      margin-top: 48px; border-top: 2px solid #D4AF37; padding-top: 24px;
    }
    .signature-line {
      display: flex; justify-content: space-between; margin-top: 48px;
    }
    .sig-field {
      width: 45%; border-top: 1px solid #333; padding-top: 4px;
      font-size: 9pt; color: #666;
    }

    /* Footer */
    .footer {
      margin-top: 40px; text-align: center; font-size: 8pt; color: #999;
      border-top: 1px solid #E5E5E5; padding-top: 12px;
    }

    /* Print button */
    .print-btn {
      position: fixed; bottom: 20px; right: 20px;
      background: #D4AF37; color: #000; border: none;
      padding: 12px 24px; font-size: 14px; font-weight: 600;
      border-radius: 8px; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }
    .print-btn:hover { background: #C9A02C; }
  </style>
</head>
<body>
  <div class="container">
    <div class="classification">CONFIDENTIAL — INTERNAL USE ONLY</div>

    <div class="header">
      <div class="logo">DATACENDIA</div>
      <div class="subtitle">CendiaGateway™ — AI Governance Gateway</div>
      <div class="doc-title">The Governance Receipt™</div>
      <div class="period">${periodStart} — ${periodEnd}</div>
    </div>

    <!-- Executive Summary -->
    <h2>1. Executive Summary</h2>
    <p>This Governance Receipt provides a cryptographically verified account of all AI interactions governed by CendiaGateway for <strong>${manifest.organizationName}</strong> during the reporting period. Every interaction recorded herein has been signed with DCII (Decision Crisis Immunization Infrastructure) evidence and can be independently verified.</p>

    <div class="summary-grid">
      <div class="stat-box">
        <div class="value">${manifest.summary.totalInteractions.toLocaleString()}</div>
        <div class="label">Total Interactions</div>
      </div>
      <div class="stat-box">
        <div class="value">${manifest.summary.totalUsers.toLocaleString()}</div>
        <div class="label">Active Users</div>
      </div>
      <div class="stat-box">
        <div class="value">${manifest.summary.totalTokens.toLocaleString()}</div>
        <div class="label">Tokens Processed</div>
      </div>
      <div class="stat-box">
        <div class="value">$${manifest.summary.totalCostUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        <div class="label">Total AI Spend</div>
      </div>
    </div>

    <table>
      <tr><th>Metric</th><th>Value</th></tr>
      <tr><td>Reporting Period</td><td>${periodStart} — ${periodEnd}</td></tr>
      <tr><td>Organization</td><td>${manifest.organizationName}</td></tr>
      <tr><td>Active Departments</td><td>${manifest.summary.totalDepartments}</td></tr>
      <tr><td>AI Providers Used</td><td>${manifest.summary.totalProviders}</td></tr>
      <tr><td>AI Models Used</td><td>${manifest.summary.totalModels}</td></tr>
      <tr><td>Generated By</td><td>${manifest.generatedBy}</td></tr>
      <tr><td>Generated At</td><td>${generatedAt}</td></tr>
      <tr><td>Manifest ID</td><td style="font-family: monospace; font-size: 9pt;">${manifest.id}</td></tr>
    </table>

    <!-- PII Governance -->
    <h2>2. PII Governance</h2>
    <p>CendiaGateway scanned every AI prompt for personally identifiable information before transmission to external AI providers.</p>

    <div class="summary-grid">
      <div class="stat-box">
        <div class="value">${manifest.piiGovernance.totalDetections.toLocaleString()}</div>
        <div class="label">PII Detections</div>
      </div>
      <div class="stat-box">
        <div class="value" style="color: #DC2626;">${manifest.piiGovernance.totalBlocks.toLocaleString()}</div>
        <div class="label">Blocked</div>
      </div>
      <div class="stat-box">
        <div class="value" style="color: #F59E0B;">${manifest.piiGovernance.totalRedactions.toLocaleString()}</div>
        <div class="label">Redacted</div>
      </div>
      <div class="stat-box">
        <div class="value" style="color: #22C55E;">${manifest.piiGovernance.totalDetections === 0 ? '100' : Math.round(((manifest.piiGovernance.totalBlocks + manifest.piiGovernance.totalRedactions) / Math.max(1, manifest.piiGovernance.totalDetections)) * 100)}%</div>
        <div class="label">Governed Rate</div>
      </div>
    </div>

    ${manifest.piiGovernance.byType.length > 0 ? `
    <table>
      <tr><th>PII Type</th><th>Detections</th><th>Action</th></tr>
      ${manifest.piiGovernance.byType.map(t => `<tr><td>${t.type}</td><td>${t.count}</td><td>${t.action}</td></tr>`).join('')}
    </table>` : '<p><em>No PII detections during this period.</em></p>'}

    <!-- Policy Enforcement -->
    <h2>3. Policy Enforcement</h2>
    <table>
      <tr><th>Metric</th><th>Value</th></tr>
      <tr><td>Active Policies</td><td>${manifest.policyEnforcement.activePolicies}</td></tr>
      <tr><td>Total Blocks</td><td>${manifest.policyEnforcement.totalBlocks}</td></tr>
      <tr><td>Total Warnings</td><td>${manifest.policyEnforcement.totalWarnings}</td></tr>
    </table>

    <!-- Department Breakdown -->
    <div class="page-break"></div>
    <h2>4. Department Breakdown</h2>
    ${manifest.departments.length > 0 ? `
    <table>
      <tr><th>Department</th><th>Users</th><th>Interactions</th><th>Tokens</th><th>Cost (USD)</th><th>PII Events</th></tr>
      ${manifest.departments.map(d => `<tr><td>${d.name}</td><td>${d.users}</td><td>${d.interactions.toLocaleString()}</td><td>${d.tokens.toLocaleString()}</td><td>$${d.costUsd.toFixed(2)}</td><td>${d.piiDetections}</td></tr>`).join('')}
    </table>` : '<p><em>No department-level data available for this period.</em></p>'}

    <!-- Regulatory Compliance -->
    <h2>5. Regulatory Compliance Mapping</h2>
    <p>The following compliance indicators reflect the governance controls applied during this period:</p>

    <div class="compliance-grid">
      <div class="compliance-item">
        <span class="icon">${manifest.compliance.euAiActArticle26 ? '✅' : '⬜'}</span>
        <div class="text">
          <div class="regulation">EU AI Act — Article 26</div>
          <div>Deployer monitoring obligations</div>
        </div>
      </div>
      <div class="compliance-item">
        <span class="icon">${manifest.compliance.gdprArticle35 ? '✅' : '⬜'}</span>
        <div class="text">
          <div class="regulation">GDPR — Article 35</div>
          <div>Data Protection Impact Assessment</div>
        </div>
      </div>
      <div class="compliance-item">
        <span class="icon">${manifest.compliance.hipaaPhiProtection ? '✅' : '⬜'}</span>
        <div class="text">
          <div class="regulation">HIPAA — PHI Protection</div>
          <div>Protected Health Information governed</div>
        </div>
      </div>
      <div class="compliance-item">
        <span class="icon">${manifest.compliance.sox302Documentation ? '✅' : '⬜'}</span>
        <div class="text">
          <div class="regulation">SOX § 302</div>
          <div>Internal controls documented</div>
        </div>
      </div>
    </div>

    <!-- Cryptographic Integrity -->
    <h2>6. Cryptographic Integrity Verification</h2>
    <div class="integrity-box">
      <div class="status">${manifest.integrity.chainIntact ? '✓ INTEGRITY VERIFIED — Chain Intact' : '✗ INTEGRITY FAILURE — Chain Broken'}</div>
      <p style="margin-top: 8px; font-size: 10pt;">All ${manifest.integrity.entriesVerified.toLocaleString()} interactions have been independently hashed and verified against the Merkle tree root.</p>
    </div>

    <table>
      <tr><th>Field</th><th>Value</th></tr>
      <tr><td>Algorithm</td><td>${manifest.integrity.algorithm}</td></tr>
      <tr><td>Entries Verified</td><td>${manifest.integrity.entriesVerified.toLocaleString()}</td></tr>
      <tr><td>Chain Intact</td><td>${manifest.integrity.chainIntact ? 'Yes' : 'NO — INVESTIGATE'}</td></tr>
      <tr><td>Signed At</td><td>${new Date(manifest.integrity.signedAt).toLocaleString('en-US')}</td></tr>
    </table>

    <h3>Merkle Root</h3>
    <div class="hash-value">${manifest.integrity.merkleRoot}</div>

    <h3>Integrity Hash</h3>
    <div class="hash-value">${manifest.integrity.integrityHash}</div>

    <h3>HMAC Signature</h3>
    <div class="hash-value">${manifest.integrity.signature}</div>

    <!-- Attestation -->
    <div class="signature-block">
      <h2>7. Attestation</h2>
      <p>I attest that the information contained in this Governance Receipt is accurate and complete to the best of my knowledge. The cryptographic integrity of this document has been verified using the CendiaGateway™ DCII evidence framework.</p>

      <div class="signature-line">
        <div class="sig-field">Authorized Signatory — Name & Title</div>
        <div class="sig-field">Date</div>
      </div>
      <div class="signature-line" style="margin-top: 32px;">
        <div class="sig-field">Compliance Officer — Name & Title</div>
        <div class="sig-field">Date</div>
      </div>
    </div>

    <div class="footer">
      <p>The Governance Receipt™ — Generated by CendiaGateway™ — Datacendia Decision Governance Infrastructure</p>
      <p>Format Version: ${manifest.formatVersion} | Receipt ID: ${manifest.id}</p>
      <p>This document is machine-generated. Cryptographic signatures can be verified against the CendiaGateway audit ledger.</p>
    </div>
  </div>

  <button class="print-btn no-print" onclick="window.print()">Save Governance Receipt as PDF</button>
</body>
</html>`;
  }

  /**
   * Generate The Governance Receipt™ as JSON (machine-readable).
   */
  toJSON(manifest: AIManifest): string {
    return JSON.stringify(manifest, null, 2);
  }

  /**
   * Generate The Governance Receipt™ as CSV for spreadsheet import.
   */
  toCSV(manifest: AIManifest): string {
    const rows: string[] = [];
    
    // Header
    rows.push('Section,Metric,Value');

    // Summary
    rows.push(`Summary,Total Interactions,${manifest.summary.totalInteractions}`);
    rows.push(`Summary,Total Users,${manifest.summary.totalUsers}`);
    rows.push(`Summary,Total Departments,${manifest.summary.totalDepartments}`);
    rows.push(`Summary,Total Providers,${manifest.summary.totalProviders}`);
    rows.push(`Summary,Total Models,${manifest.summary.totalModels}`);
    rows.push(`Summary,Total Tokens,${manifest.summary.totalTokens}`);
    rows.push(`Summary,Total Cost (USD),${manifest.summary.totalCostUsd}`);

    // PII
    rows.push(`PII Governance,Total Detections,${manifest.piiGovernance.totalDetections}`);
    rows.push(`PII Governance,Total Blocks,${manifest.piiGovernance.totalBlocks}`);
    rows.push(`PII Governance,Total Redactions,${manifest.piiGovernance.totalRedactions}`);

    for (const t of manifest.piiGovernance.byType) {
      rows.push(`PII By Type,${t.type},${t.count}`);
    }

    // Departments
    for (const d of manifest.departments) {
      rows.push(`Department: ${d.name},Users,${d.users}`);
      rows.push(`Department: ${d.name},Interactions,${d.interactions}`);
      rows.push(`Department: ${d.name},Tokens,${d.tokens}`);
      rows.push(`Department: ${d.name},Cost (USD),${d.costUsd}`);
      rows.push(`Department: ${d.name},PII Detections,${d.piiDetections}`);
    }

    // Integrity
    rows.push(`Integrity,Algorithm,${manifest.integrity.algorithm}`);
    rows.push(`Integrity,Entries Verified,${manifest.integrity.entriesVerified}`);
    rows.push(`Integrity,Chain Intact,${manifest.integrity.chainIntact}`);
    rows.push(`Integrity,Merkle Root,${manifest.integrity.merkleRoot}`);

    return rows.join('\n');
  }
}

export default ManifestExporter;
