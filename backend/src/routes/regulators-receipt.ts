// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * DATACENDIA REGULATOR'S RECEIPT ROUTES
 * 
 * API endpoints for one-click court-admissible decision documentation
 */

import { Router, Request, Response } from 'express';
import { regulatorsReceiptService } from '../services/evidence/RegulatorsReceiptService.js';
import { pdfGeneratorService } from '../services/document/PDFGeneratorService.js';
import { prisma } from '../config/database.js';

const router = Router();

async function buildDeliberationData(deliberationId: string) {
  const deliberation = await prisma.deliberations.findUnique({ where: { id: deliberationId } });
  const messages = await prisma.deliberation_messages.findMany({
    where: { deliberation_id: deliberationId },
    include: { agents: true },
    orderBy: { created_at: 'asc' },
  });

  // Build phase timeline from messages
  const phaseMap = new Map<string, { name: string; startedAt: Date; completedAt?: Date }>();
  for (const msg of messages) {
    if (!phaseMap.has(msg.phase)) {
      phaseMap.set(msg.phase, { name: msg.phase, startedAt: msg.created_at });
    }
    const p = phaseMap.get(msg.phase)!;
    if (!p.completedAt || msg.created_at > p.completedAt) {
      p.completedAt = msg.created_at;
    }
  }

  return {
    question: deliberation?.question || '',
    phases: Array.from(phaseMap.values()),
    messages: messages.map(m => {
      const sources = (m.sources as any[]) || [];
      return {
        agentName: m.agents.name,
        agentRole: m.agents.role,
        phase: m.phase,
        content: m.content,
        confidence: m.confidence ?? undefined,
        sources: sources.map((s: any) => ({
          reference: s.reference || s.title || s.name || String(s),
          url: s.url || s.link || undefined,
        })),
        createdAt: m.created_at,
      };
    }),
  };
}

/**
 * POST /api/v1/regulators-receipt/generate
 * Generate a Regulator's Receipt for a deliberation
 */
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const { deliberationId, generatedBy, options } = req.body;
    
    if (!deliberationId) {
      return res.status(400).json({ error: 'deliberationId is required' });
    }
    
    const receipt = await regulatorsReceiptService.generateReceipt(
      deliberationId,
      generatedBy || 'system',
      options
    );
    
    res.json({ success: true, receipt });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

/**
 * POST /api/v1/regulators-receipt/export/pdf
 * Export receipt as real PDF bytes
 */
router.post('/export/pdf', async (req: Request, res: Response) => {
  try {
    const { receipt } = req.body;
    
    if (!receipt) {
      return res.status(400).json({ error: 'receipt is required' });
    }

    // Rehydrate date strings from JSON
    const hydrated = {
      ...receipt,
      generatedAt: new Date(receipt.generatedAt),
      decision: {
        ...receipt.decision,
        createdAt: new Date(receipt.decision.createdAt),
        completedAt: new Date(receipt.decision.completedAt),
      },
      retention: {
        ...receipt.retention,
        retentionUntil: new Date(receipt.retention.retentionUntil),
      },
      cryptographicProof: {
        ...receipt.cryptographicProof,
        signedAt: receipt.cryptographicProof.signedAt ? new Date(receipt.cryptographicProof.signedAt) : undefined,
      },
      auditTrail: (receipt.auditTrail || []).map((e: any) => ({ ...e, timestamp: new Date(e.timestamp) })),
    };

    const format = req.body.format || 'court';
    let pdf;
    if (format === 'evidence') {
      const deliberationData = await buildDeliberationData(hydrated.decision.id);
      pdf = await pdfGeneratorService.generateDeliberationEvidencePackage(hydrated, deliberationData);
    } else if (format === 'standard') {
      pdf = await pdfGeneratorService.generateRegulatorsReceiptStandard(hydrated);
    } else {
      pdf = await pdfGeneratorService.generateRegulatorsReceipt(hydrated);
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${pdf.filename}"`);
    res.setHeader('X-PDF-Hash', pdf.hash);
    res.setHeader('X-PDF-Pages', String(pdf.pageCount));
    res.setHeader('X-PDF-Format', format);
    res.send(pdf.buffer);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

/**
 * POST /api/v1/regulators-receipt/generate-pdf
 * One-step: generate receipt from deliberation ID and return PDF
 */
router.post('/generate-pdf', async (req: Request, res: Response) => {
  try {
    const { deliberationId, generatedBy, options } = req.body;

    if (!deliberationId) {
      return res.status(400).json({ error: 'deliberationId is required' });
    }

    const receipt = await regulatorsReceiptService.generateReceipt(
      deliberationId,
      generatedBy || 'system',
      options
    );

    const format = req.body.format || 'court';
    let pdf;
    if (format === 'evidence') {
      const deliberationData = await buildDeliberationData(deliberationId);
      pdf = await pdfGeneratorService.generateDeliberationEvidencePackage(receipt as any, deliberationData);
    } else if (format === 'standard') {
      pdf = await pdfGeneratorService.generateRegulatorsReceiptStandard(receipt as any);
    } else {
      pdf = await pdfGeneratorService.generateRegulatorsReceipt(receipt as any);
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${pdf.filename}"`);
    res.setHeader('X-PDF-Hash', pdf.hash);
    res.setHeader('X-PDF-Pages', String(pdf.pageCount));
    res.setHeader('X-PDF-Format', format);
    res.send(pdf.buffer);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

/**
 * POST /api/v1/regulators-receipt/export/json
 * Export receipt as JSON
 */
router.post('/export/json', (req: Request, res: Response) => {
  const { receipt } = req.body;
  
  if (!receipt) {
    return res.status(400).json({ error: 'receipt is required' });
  }
  
  const json = regulatorsReceiptService.exportAsJson(receipt);
  
  res.json({ success: true, json });
});

/**
 * POST /api/v1/regulators-receipt/export/html
 * Export receipt as HTML
 */
router.post('/export/html', (req: Request, res: Response) => {
  const { receipt } = req.body;
  
  if (!receipt) {
    return res.status(400).json({ error: 'receipt is required' });
  }
  
  const html = regulatorsReceiptService.exportAsHtml(receipt);
  
  res.json({ success: true, html });
});

/**
 * GET /api/v1/regulators-receipt/:deliberationId
 * Generate and return receipt JSON for a deliberation
 */
router.get('/:deliberationId', async (req: Request, res: Response) => {
  try {
    const { deliberationId } = req.params;

    if (!deliberationId) {
      return res.status(400).json({ error: 'deliberationId is required' });
    }

    const receipt = await regulatorsReceiptService.generateReceipt(
      deliberationId,
      'system'
    );

    res.json({ success: true, receipt });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

/**
 * POST /api/v1/regulators-receipt/verify
 * Verify a receipt's integrity
 */
router.post('/verify', (req: Request, res: Response) => {
  const { receipt } = req.body;
  
  if (!receipt) {
    return res.status(400).json({ error: 'receipt is required' });
  }
  
  const verification = regulatorsReceiptService.verifyReceipt(receipt);
  
  res.json({ success: true, verification });
});

export default router;
