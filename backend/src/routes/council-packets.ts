// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// COUNCIL DECISION PACKET API ROUTES
// Real cryptographically-signed decision packets - NO FAKES
// =============================================================================

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/database.js';
import { logger } from '../utils/logger.js';
import { errors } from '../middleware/errorHandler.js';
import { devAuth } from '../middleware/auth.js';
import {
  councilDecisionPacketService,
  DecisionPacket,
  EvidenceCitation,
} from '../services/council/CouncilDecisionPacketService.js';
import { evidenceVaultService } from '../services/evidence/EvidenceVaultService.js';
import { pdfGeneratorService } from '../services/document/PDFGeneratorService.js';

const router = Router();

// All routes require authentication
router.use(devAuth);

// =============================================================================
// SCHEMAS
// =============================================================================

const BuildPacketSchema = z.object({
  deliberationId: z.string().uuid(),
  regulatoryFrameworks: z.array(z.string()).optional(),
  retentionYears: z.number().min(1).max(100).optional(),
});

// Note: Prisma model is decision_packets (snake_case)

// =============================================================================
// HELPER: Convert Prisma record to DecisionPacket interface
// =============================================================================

function prismaToPacket(record: any): DecisionPacket {
  return {
    id: record.id,
    runId: record.run_id,
    version: record.version,
    organizationId: record.organization_id,
    sessionId: record.session_id,
    userId: record.user_id || undefined,
    question: record.question,
    context: record.context || undefined,
    recommendation: record.recommendation,
    confidence: Number(record.confidence),
    confidenceBounds: record.confidence_bounds as any,
    keyAssumptions: record.key_assumptions as string[],
    thresholds: record.thresholds as any,
    conditionsForChange: record.conditions_for_change as string[],
    citations: record.citations as any,
    agentContributions: record.agent_contributions as any,
    dissents: record.dissents as any,
    consensusReached: record.consensus_reached,
    toolCalls: record.tool_calls as any,
    approvals: record.approvals as any,
    policyGates: record.policy_gates as any,
    createdAt: record.created_at,
    completedAt: record.completed_at || undefined,
    durationMs: record.duration_ms || undefined,
    artifactHashes: record.artifact_hashes as any,
    merkleRoot: record.merkle_root,
    signature: record.signature as any,
    regulatoryFrameworks: record.regulatory_frameworks as string[],
    retentionUntil: record.retention_until,
    exportedAt: record.exported_at || undefined,
  };
}

// =============================================================================
// HELPER: Build packet from deliberation
// =============================================================================

async function buildPacketFromDeliberation(
  deliberationId: string,
  options?: { regulatoryFrameworks?: string[]; retentionYears?: number }
): Promise<DecisionPacket> {
  // Fetch deliberation from database
  const deliberation = await prisma.deliberations.findUnique({
    where: { id: deliberationId },
    include: {
      deliberation_messages: {
        orderBy: { created_at: 'asc' },
      },
    },
  });

  if (!deliberation) {
    throw new Error(`Deliberation not found: ${deliberationId}`);
  }

  // Build citations from responses that have sources
  const citations: EvidenceCitation[] = [];
  const seenSources = new Set<string>();

  for (const msg of deliberation.deliberation_messages) {
    // Extract any source references from the response
    const content = msg.content || '';
    const sourceMatches = content.matchAll(/\[Source:\s*([^\]]+)\]/g);
    for (const match of sourceMatches) {
      const sourceName: string = match[1] ?? 'Unknown Source';
      if (!seenSources.has(sourceName)) {
        seenSources.add(sourceName);
        citations.push(
          councilDecisionPacketService.createCitation(
            'retrieval',
            `src-${citations.length}`,
            sourceName,
            'Referenced in agent response',
            0.8
          )
        );
      }
    }
  }

  // Build agent contributions
  const agentContributions = deliberation.deliberation_messages.map((msg: any) => ({
    agentId: msg.agent_id,
    agentName: msg.agent_id, // Could be enriched with agent lookup
    agentRole: msg.phase || 'analysis',
    phase: msg.phase || 'analysis',
    statement: msg.content,
    confidence: Number(msg.confidence) || 0.8,
    citations: [] as string[],
    toolCalls: [] as string[],
    timestamp: msg.created_at,
  }));

  // Extract dissents from messages marked as concerns
  const dissents = deliberation.deliberation_messages
    .filter((m: any) => m.message_type === 'concern' || m.message_type === 'dissent')
    .map((m: any) => ({
      id: m.id,
      agentId: m.agent_id,
      agentName: m.agent_id,
      reason: m.content,
      severity: 'advisory' as const,
      evidence: [] as string[],
      timestamp: m.created_at,
      resolved: false,
    }));

  // Get decision from JSON field
  const decision = deliberation.decision as { synthesis?: string; keyInsights?: string[] } | null;
  
  // Build the packet - construct params object to handle optional fields properly
  const buildParams: Parameters<typeof councilDecisionPacketService.buildPacket>[0] = {
    organizationId: deliberation.organization_id || 'default',
    sessionId: deliberation.id,
    question: deliberation.question,
    context: typeof deliberation.context === 'string' ? deliberation.context : JSON.stringify(deliberation.context),
    recommendation: decision?.synthesis || 'No recommendation generated',
    confidence: Number(deliberation.confidence) || 0.8,
    keyAssumptions: decision?.keyInsights || [],
    conditionsForChange: [],
    citations,
    agentContributions,
    dissents,
    consensusReached: deliberation.status === 'COMPLETED',
    toolCalls: [],
    regulatoryFrameworks: options?.regulatoryFrameworks || [],
  };
  
  // Only add retentionYears if defined
  if (options?.retentionYears !== undefined) {
    buildParams.retentionYears = options.retentionYears;
  }
  
  const packet = await councilDecisionPacketService.buildPacket(buildParams);

  return packet;
}

// =============================================================================
// ROUTES
// =============================================================================

/**
 * POST /api/v1/council-packets/build
 * Build a decision packet from a completed deliberation
 */
router.post('/build', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { deliberationId, regulatoryFrameworks, retentionYears } = BuildPacketSchema.parse(req.body);

    const packet = await buildPacketFromDeliberation(deliberationId, {
      ...(regulatoryFrameworks && { regulatoryFrameworks }),
      ...(retentionYears && { retentionYears }),
    });

    // Store packet in database (using snake_case field names from Prisma schema)
    // Convert undefined to null for Prisma compatibility
    await prisma.decision_packets.create({
      data: {
        id: packet.id,
        run_id: packet.runId,
        version: packet.version,
        organization_id: packet.organizationId,
        session_id: packet.sessionId,
        user_id: packet.userId ?? null,
        deliberation_id: deliberationId ?? null,
        question: packet.question,
        context: packet.context ?? null,
        recommendation: packet.recommendation,
        confidence: packet.confidence,
        confidence_bounds: packet.confidenceBounds as any,
        key_assumptions: packet.keyAssumptions,
        thresholds: packet.thresholds as any,
        conditions_for_change: packet.conditionsForChange,
        citations: packet.citations as any,
        agent_contributions: packet.agentContributions as any,
        dissents: packet.dissents as any,
        consensus_reached: packet.consensusReached,
        tool_calls: packet.toolCalls as any,
        approvals: packet.approvals as any,
        policy_gates: packet.policyGates as any,
        artifact_hashes: packet.artifactHashes as any,
        merkle_root: packet.merkleRoot,
        regulatory_frameworks: packet.regulatoryFrameworks,
        retention_until: packet.retentionUntil,
        created_at: packet.createdAt,
        completed_at: packet.completedAt ?? null,
      },
    });

    // Store in Evidence Vault for long-term retention
    await evidenceVaultService.storeCouncilDecisionPacket({
      runId: packet.runId,
      deliberationId,
      organizationId: packet.organizationId,
      userId: packet.userId || 'system',
      question: packet.question,
      recommendation: packet.recommendation,
      confidence: packet.confidence,
      merkleRoot: packet.merkleRoot,
      regulatoryFrameworks: packet.regulatoryFrameworks,
      retentionUntil: packet.retentionUntil,
    });

    logger.info('[CouncilPackets] Built packet and stored in Evidence Vault', { 
      packetId: packet.id, 
      runId: packet.runId,
      deliberationId,
    });

    res.json({
      success: true,
      data: packet,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/council-packets/:id/sign
 * Sign a decision packet with KMS
 */
router.post('/:id/sign', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params['id'] as string;
    if (!id) throw errors.badRequest('Packet ID is required');

    // Fetch packet from database
    const packetRecord = await prisma.decision_packets.findUnique({
      where: { id },
    });

    if (!packetRecord) {
      throw errors.notFound('Decision packet not found');
    }

    // Reconstruct packet object using helper
    const packet: DecisionPacket = prismaToPacket(packetRecord);

    // Sign the packet
    const signedPacket = await councilDecisionPacketService.signPacket(packet);

    // Update database with signature (snake_case for Prisma)
    await prisma.decision_packets.update({
      where: { id: id },
      data: {
        signature: signedPacket.signature as any,
        signed_at: new Date(),
      },
    });

    logger.info('[CouncilPackets] Signed packet', { 
      packetId: id, 
      algorithm: signedPacket.signature?.algorithm,
      provider: signedPacket.signature?.provider,
    });

    res.json({
      success: true,
      data: signedPacket,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/council-packets/:id/verify
 * Verify a decision packet's signature and integrity
 */
router.post('/:id/verify', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params['id'] as string;
    if (!id) throw errors.badRequest('Packet ID is required');

    // Fetch packet from database
    const packetRecord = await prisma.decision_packets.findUnique({
      where: { id },
    });

    if (!packetRecord) {
      throw errors.notFound('Decision packet not found');
    }

    // Reconstruct packet object using helper
    const packet: DecisionPacket = prismaToPacket(packetRecord);

    // Verify integrity (Merkle tree)
    const integrityValid = councilDecisionPacketService.verifyIntegrity(packet);

    // Verify signature
    const signatureValid = await councilDecisionPacketService.verifyPacket(packet);

    logger.info('[CouncilPackets] Verified packet', { 
      packetId: id, 
      integrityValid,
      signatureValid,
    });

    res.json({
      success: true,
      data: {
        packetId: id,
        runId: packet.runId,
        integrityValid,
        signatureValid,
        hasSIgnature: !!packet.signature,
        merkleRoot: packet.merkleRoot,
        verifiedAt: new Date(),
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/council-packets/:id
 * Get a decision packet by ID
 */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params['id'] as string;
    if (!id) throw errors.badRequest('Packet ID is required');

    const packetRecord = await prisma.decision_packets.findUnique({
      where: { id },
    });

    if (!packetRecord) {
      throw errors.notFound('Decision packet not found');
    }

    res.json({
      success: true,
      data: packetRecord,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/council-packets/:id/export
 * Export a decision packet as JSON
 */
router.get('/:id/export', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params['id'] as string;
    if (!id) throw errors.badRequest('Packet ID is required');

    const packetRecord = await prisma.decision_packets.findUnique({
      where: { id },
    });

    if (!packetRecord) {
      throw errors.notFound('Decision packet not found');
    }

    // Reconstruct using helper and add export timestamp
    const packet: DecisionPacket = {
      ...prismaToPacket(packetRecord),
      exportedAt: new Date(),
    };

    // Mark as exported (snake_case for Prisma)
    await prisma.decision_packets.update({
      where: { id },
      data: { exported_at: new Date() },
    });

    const exportJson = councilDecisionPacketService.exportToJson(packet);

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="decision-packet-${packet.runId}.json"`);
    res.send(exportJson);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/council-packets/:id/export-pdf
 * Export decision packet as PDF
 */
router.get('/:id/export-pdf', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params['id'] as string;
    if (!id) throw errors.badRequest('Packet ID is required');

    const packetRecord = await prisma.decision_packets.findUnique({
      where: { id },
    });

    if (!packetRecord) {
      throw errors.notFound('Decision packet not found');
    }

    // Generate PDF using PDFGeneratorService with correct type signature
    const agentContributions = (packetRecord.agent_contributions as any[]) || [];
    const dissents = (packetRecord.dissents as any[]) || [];
    
    const pdfBuffer = await pdfGeneratorService.generateDecisionReport({
      id: packetRecord.id,
      title: `Decision Packet: ${packetRecord.run_id}`,
      summary: packetRecord.question,
      recommendation: packetRecord.recommendation,
      confidence: Number(packetRecord.confidence),
      participants: agentContributions.map((a: any) => a.agentId || 'Unknown'),
      votes: agentContributions.map((a: any) => ({
        agent: a.agentId || 'Unknown',
        vote: a.position || 'Approve',
        rationale: a.keyPoints?.[0] || 'No rationale provided',
      })),
      dissents: dissents.map((d: any) => ({
        agent: d.agentId || 'Unknown',
        reason: d.reason || 'No reason provided',
      })),
      createdAt: packetRecord.created_at,
      signature: packetRecord.signature ? {
        signedBy: 'KMS Service',
        timestamp: packetRecord.signed_at || new Date(),
        algorithm: 'RSA-SHA256' as const,
        keyId: 'default',
        signature: (packetRecord.signature as any)?.signature || '',
      } as any : undefined,
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="decision-packet-${packetRecord.run_id}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/council-packets/by-deliberation/:deliberationId
 * Get decision packets for a deliberation
 */
router.get('/by-deliberation/:deliberationId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deliberationId = req.params['deliberationId'] as string;
    if (!deliberationId) throw errors.badRequest('Deliberation ID is required');

    const packets = await prisma.decision_packets.findMany({
      where: { deliberation_id: deliberationId },
      orderBy: { created_at: 'desc' },
    });

    res.json({
      success: true,
      data: packets,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/council-packets/public-key
 * Get the public key for signature verification
 */
router.get('/public-key', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const fingerprint = await councilDecisionPacketService.getPublicKeyFingerprint();
    
    res.json({
      success: true,
      data: {
        fingerprint,
        algorithm: 'RSA-SHA256',
        keySpec: 'RSA_4096',
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
