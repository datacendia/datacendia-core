// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import crypto from 'crypto';

export interface PDFSection {
  title?: string;
  content?: string;
  type?: string;
  level?: number;
  headers?: string[];
  rows?: string[][];
}

export interface PDFResult {
  buffer: Buffer;
  filename: string;
  hash: string;
  pageCount: number;
  size: number;
}

class PDFGeneratorServiceImpl {
  private buildTextPdf(title: string, sections: { heading: string; body: string }[]): PDFResult {
    const lines = [`=== ${title} ===`, `Generated: ${new Date().toISOString()}`, ''];
    for (const s of sections) { lines.push(`--- ${s.heading} ---`, s.body, ''); }
    const buffer = Buffer.from(lines.join('\n'), 'utf-8');
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return {
      buffer,
      filename: `${slug}-${Date.now()}.pdf`,
      hash: crypto.createHash('sha256').update(buffer).digest('hex'),
      pageCount: Math.max(1, Math.ceil(lines.length / 50)),
      size: buffer.length,
    };
  }

  async generateRegulatorsReceipt(receipt: any): Promise<PDFResult> {
    return this.buildTextPdf('Regulators Receipt', [
      { heading: 'Decision', body: JSON.stringify(receipt.decision ?? receipt, null, 2) },
      { heading: 'Evidence', body: JSON.stringify(receipt.evidence ?? [], null, 2) },
    ]);
  }

  async generateRegulatorsReceiptStandard(receipt: any): Promise<PDFResult> {
    return this.buildTextPdf('Regulators Receipt (Standard)', [
      { heading: 'Summary', body: receipt.summary ?? JSON.stringify(receipt, null, 2) },
    ]);
  }

  async generateDeliberationEvidencePackage(receipt: any, deliberationData: any): Promise<PDFResult> {
    return this.buildTextPdf('Deliberation Evidence Package', [
      { heading: 'Receipt', body: JSON.stringify(receipt, null, 2) },
      { heading: 'Deliberation', body: JSON.stringify(deliberationData, null, 2) },
    ]);
  }

  async generateDecisionReport(data: any): Promise<PDFResult> {
    return this.buildTextPdf(data.title || 'Decision Report', [
      { heading: 'Summary', body: data.summary || '' },
      { heading: 'Details', body: JSON.stringify(data, null, 2) },
    ]);
  }

  async generatePDF(sections: PDFSection[], options?: { title?: string; author?: string; subject?: string }): Promise<PDFResult> {
    const mapped = (sections || []).map((s: any) => ({ heading: s.title || s.heading || 'Section', body: s.content || s.body || JSON.stringify(s, null, 2) }));
    return this.buildTextPdf(options?.title || 'Generated Document', mapped);
  }
}

export const pdfGeneratorService = new PDFGeneratorServiceImpl();
