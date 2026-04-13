// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

export class PDFSection {
  title: string;
  content: string;
  constructor(title: string, content: string) { this.title = title; this.content = content; }
}

class PDFGeneratorServiceImpl {
  private buildTextPdf(title: string, sections: { heading: string; body: string }[]): Buffer {
    const lines = [`=== ${title} ===`, `Generated: ${new Date().toISOString()}`, ''];
    for (const s of sections) { lines.push(`--- ${s.heading} ---`, s.body, ''); }
    return Buffer.from(lines.join('\n'), 'utf-8');
  }

  async generateRegulatorsReceipt(receipt: any): Promise<Buffer> {
    return this.buildTextPdf('Regulators Receipt', [
      { heading: 'Decision', body: JSON.stringify(receipt.decision ?? receipt, null, 2) },
      { heading: 'Evidence', body: JSON.stringify(receipt.evidence ?? [], null, 2) },
    ]);
  }

  async generateRegulatorsReceiptStandard(receipt: any): Promise<Buffer> {
    return this.buildTextPdf('Regulators Receipt (Standard)', [
      { heading: 'Summary', body: receipt.summary ?? JSON.stringify(receipt, null, 2) },
    ]);
  }

  async generateDeliberationEvidencePackage(receipt: any, deliberationData: any): Promise<Buffer> {
    return this.buildTextPdf('Deliberation Evidence Package', [
      { heading: 'Receipt', body: JSON.stringify(receipt, null, 2) },
      { heading: 'Deliberation', body: JSON.stringify(deliberationData, null, 2) },
    ]);
  }

  async generateDecisionReport(data: any): Promise<Buffer> {
    return this.buildTextPdf(data.title || 'Decision Report', [
      { heading: 'Summary', body: data.summary || '' },
      { heading: 'Details', body: JSON.stringify(data, null, 2) },
    ]);
  }

  async generatePDF(sections: any[], options?: { title?: string; author?: string; subject?: string }): Promise<Buffer> {
    const mapped = (sections || []).map((s: any) => ({ heading: s.title || s.heading || 'Section', body: s.content || s.body || JSON.stringify(s, null, 2) }));
    return this.buildTextPdf(options?.title || 'Generated Document', mapped);
  }
}

export const pdfGeneratorService = new PDFGeneratorServiceImpl();
