// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// COUNCIL DECISION PACKET SERVICE
// Real cryptographically-signed decision packets - NO FAKES
// Integrates: KMS signing, Merkle trees, tool-call tracing, evidence citations
// =============================================================================

import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../../utils/logger.js';
import { KeyManagementService, SignatureResult } from '../security/KeyManagementService.js';
import { persistServiceRecord, loadServiceRecords } from '../../utils/servicePersistence.js';

// =============================================================================
// TYPES
// =============================================================================

export interface ToolCall {
  id: string;
  toolName: string;
  parameters: Record<string, unknown>;
  result?: unknown;
  startedAt: Date;
  completedAt?: Date;
  durationMs?: number;
  success: boolean;
  error?: string;
}

export interface EvidenceCitation {
  id: string;
  sourceType: 'document' | 'database' | 'api' | 'retrieval' | 'user_input';
  sourceId: string;
  sourceName: string;
  sourceUrl?: string;
  content: string;
  relevanceScore: number;
  retrievedAt: Date;
  hash: string;
}

export interface AgentContribution {
  agentId: string;
  agentName: string;
  agentRole: string;
  phase: string;
  statement: string;
  confidence: number;
  citations: string[]; // Citation IDs
  toolCalls: string[]; // ToolCall IDs
  timestamp: Date;
  signature?: SignatureResult;
}

export interface Dissent {
  id: string;
  agentId: string;
  agentName: string;
  reason: string;
  severity: 'advisory' | 'formal_objection' | 'blocking';
  evidence: string[];
  timestamp: Date;
  resolved: boolean;
  resolution?: string;
}

export interface Approval {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: 'approve' | 'reject' | 'escalate' | 'defer';
  comment?: string;
  timestamp: Date;
  signature?: SignatureResult;
}

export interface PolicyGate {
  id: string;
  policyId: string;
  policyName: string;
  status: 'passed' | 'failed' | 'waived' | 'not_applicable';
  evaluatedAt: Date;
  details?: string;
}

export interface DecisionPacket {
  // Identity
  id: string;
  runId: string;
  version: number;
  
  // Context
  organizationId: string;
  sessionId: string;
  userId?: string;
  
  // Decision
  question: string;
  context?: string;
  recommendation: string;
  confidence: number;
  confidenceBounds: { lower: number; upper: number };
  keyAssumptions: string[];
  thresholds: Record<string, number>;
  conditionsForChange: string[];
  
  // Evidence
  citations: EvidenceCitation[];
  
  // Deliberation
  agentContributions: AgentContribution[];
  dissents: Dissent[];
  consensusReached: boolean;
  
  // Tool Trace
  toolCalls: ToolCall[];
  
  // Approvals
  approvals: Approval[];
  policyGates: PolicyGate[];
  
  // Integrity
  createdAt: Date;
  completedAt?: Date;
  durationMs?: number;
  artifactHashes: Record<string, string>;
  merkleRoot: string;
  signature?: SignatureResult;
  
  // Metadata
  regulatoryFrameworks: string[];
  retentionUntil: Date;
  exportedAt?: Date;
}

export interface ToolCallTracer {
  startCall(toolName: string, parameters: Record<string, unknown>): string;
  endCall(callId: string, result: unknown, success: boolean, error?: string): void;
  getCalls(): ToolCall[];
}

// =============================================================================
// TOOL CALL TRACER
// =============================================================================

export class ToolCallTracerImpl implements ToolCallTracer {
  private calls: Map<string, ToolCall> = new Map();

  startCall(toolName: string, parameters: Record<string, unknown>): string {
    const id = uuidv4();
    const call: ToolCall = {
      id,
      toolName,
      parameters,
      startedAt: new Date(),
      success: false,
    };
    this.calls.set(id, call);
    logger.debug(`[ToolTrace] Started: ${toolName}`, { callId: id });
    return id;
  }

  endCall(callId: string, result: unknown, success: boolean, error?: string): void {
    const call = this.calls.get(callId);
    if (!call) {
      logger.warn(`[ToolTrace] Unknown call ID: ${callId}`);
      return;
    }
    
    call.completedAt = new Date();
    call.durationMs = call.completedAt.getTime() - call.startedAt.getTime();
    call.result = result;
    call.success = success;
    call.error = error;
    
    logger.debug(`[ToolTrace] Completed: ${call.toolName}`, { 
      callId, 
      success, 
      durationMs: call.durationMs 
    });
  }

  getCalls(): ToolCall[] {
    return Array.from(this.calls.values());
  }
}

// =============================================================================
// MERKLE TREE FOR INTEGRITY
// =============================================================================

function hashData(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

function buildMerkleTree(hashes: string[]): string {
  if (hashes.length === 0) {
    return hashData('empty');
  }
  if (hashes.length === 1) {
    return hashes[0];
  }
  
  const nextLevel: string[] = [];
  for (let i = 0; i < hashes.length; i += 2) {
    const left = hashes[i];
    const right = hashes[i + 1] || left; // Duplicate last if odd
    nextLevel.push(hashData(left + right));
  }
  
  return buildMerkleTree(nextLevel);
}

// =============================================================================
// COUNCIL DECISION PACKET SERVICE
// =============================================================================

export class CouncilDecisionPacketService {
  private kms: KeyManagementService;
  
  constructor() {
    this.kms = new KeyManagementService();
  }

  async loadFromDB(): Promise<void> {
    try {
      const recs = await loadServiceRecords({ serviceName: 'CouncilDecisionPacketService', recordType: 'packet', limit: 1000 });
      if (recs.length > 0) logger.info(`[CouncilDecisionPacketService] Restored ${recs.length} records from database`);
    } catch (err) {
      logger.warn(`[CouncilDecisionPacketService] DB reload skipped: ${(err as Error).message}`);
    }
  }

  /**
   * Create a new tool call tracer for a deliberation
   */
  createTracer(): ToolCallTracer {
    return new ToolCallTracerImpl();
  }

  /**
   * Create an evidence citation with proper hashing and timestamp
   */
  createCitation(
    sourceType: EvidenceCitation['sourceType'],
    sourceId: string,
    sourceName: string,
    content: string,
    relevanceScore: number,
    sourceUrl?: string
  ): EvidenceCitation {
    const now = new Date();
    return {
      id: uuidv4(),
      sourceType,
      sourceId,
      sourceName,
      sourceUrl,
      content,
      relevanceScore,
      retrievedAt: now,
      hash: hashData(JSON.stringify({ sourceId, content, timestamp: now.toISOString() })),
    };
  }

  /**
   * Build a complete decision packet from deliberation results
   */
  async buildPacket(params: {
    organizationId: string;
    sessionId: string;
    userId?: string;
    question: string;
    context?: string;
    recommendation: string;
    confidence: number;
    keyAssumptions: string[];
    thresholds?: Record<string, number>;
    conditionsForChange?: string[];
    citations: EvidenceCitation[];
    agentContributions: AgentContribution[];
    dissents: Dissent[];
    consensusReached: boolean;
    toolCalls: ToolCall[];
    approvals?: Approval[];
    policyGates?: PolicyGate[];
    regulatoryFrameworks?: string[];
    retentionYears?: number;
  }): Promise<DecisionPacket> {
    const now = new Date();
    const runId = this.generateRunId();
    
    // Calculate confidence bounds (±10% or based on dissent count)
    const dissentPenalty = params.dissents.length * 0.05;
    const confidenceBounds = {
      lower: Math.max(0, params.confidence - 0.1 - dissentPenalty),
      upper: Math.min(1, params.confidence + 0.1),
    };

    // Build artifact hashes
    const artifactHashes: Record<string, string> = {
      question: hashData(params.question),
      context: hashData(params.context || ''),
      recommendation: hashData(params.recommendation),
      citations: hashData(JSON.stringify(params.citations)),
      contributions: hashData(JSON.stringify(params.agentContributions)),
      dissents: hashData(JSON.stringify(params.dissents)),
      toolCalls: hashData(JSON.stringify(params.toolCalls)),
    };

    // Build Merkle root from all artifact hashes
    const merkleRoot = buildMerkleTree(Object.values(artifactHashes));

    // Calculate retention date
    const retentionYears = params.retentionYears || 7;
    const retentionUntil = new Date(now);
    retentionUntil.setFullYear(retentionUntil.getFullYear() + retentionYears);

    const packet: DecisionPacket = {
      id: uuidv4(),
      runId,
      version: 1,
      organizationId: params.organizationId,
      sessionId: params.sessionId,
      userId: params.userId,
      question: params.question,
      context: params.context,
      recommendation: params.recommendation,
      confidence: params.confidence,
      confidenceBounds,
      keyAssumptions: params.keyAssumptions,
      thresholds: params.thresholds || {},
      conditionsForChange: params.conditionsForChange || [],
      citations: params.citations,
      agentContributions: params.agentContributions,
      dissents: params.dissents,
      consensusReached: params.consensusReached,
      toolCalls: params.toolCalls,
      approvals: params.approvals || [],
      policyGates: params.policyGates || [],
      createdAt: now,
      completedAt: now,
      artifactHashes,
      merkleRoot,
      regulatoryFrameworks: params.regulatoryFrameworks || [],
      retentionUntil,
    };

    logger.info('[DecisionPacket] Built packet', { 
      runId, 
      merkleRoot: merkleRoot.substring(0, 16) + '...',
      citationCount: params.citations.length,
      contributionCount: params.agentContributions.length,
      dissentCount: params.dissents.length,
    });

    return packet;
  }

  /**
   * Sign a decision packet with KMS
   */
  async signPacket(packet: DecisionPacket): Promise<DecisionPacket> {
    // Create canonical representation for signing
    const canonicalData = this.canonicalize(packet);
    
    try {
      const signature = await this.kms.sign(canonicalData);
      
      logger.info('[DecisionPacket] Signed packet', { 
        runId: packet.runId,
        algorithm: signature.algorithm,
        provider: signature.provider,
      });

      return {
        ...packet,
        signature,
      };
    } catch (error) {
      logger.error('[DecisionPacket] Signing failed', { runId: packet.runId, error });
      throw error;
    }
  }

  /**
   * Sign an individual agent contribution
   */
  async signAgentContribution(contribution: AgentContribution): Promise<AgentContribution> {
    const canonicalData = JSON.stringify({
      agentId: contribution.agentId,
      phase: contribution.phase,
      statement: contribution.statement,
      confidence: contribution.confidence,
      timestamp: contribution.timestamp.toISOString(),
    });

    try {
      const signature = await this.kms.sign(canonicalData);
      return {
        ...contribution,
        signature,
      };
    } catch (error) {
      logger.error('[DecisionPacket] Agent signing failed', { 
        agentId: contribution.agentId, 
        error 
      });
      throw error;
    }
  }

  /**
   * Verify a decision packet's signature
   */
  async verifyPacket(packet: DecisionPacket): Promise<boolean> {
    if (!packet.signature) {
      logger.warn('[DecisionPacket] No signature to verify', { runId: packet.runId });
      return false;
    }

    const canonicalData = this.canonicalize(packet);
    
    try {
      const isValid = await this.kms.verify(
        canonicalData, 
        packet.signature.signature,
        packet.signature.keyId
      );
      
      logger.info('[DecisionPacket] Verification result', { 
        runId: packet.runId, 
        isValid 
      });
      
      return isValid;
    } catch (error) {
      logger.error('[DecisionPacket] Verification failed', { runId: packet.runId, error });
      return false;
    }
  }

  /**
   * Verify Merkle tree integrity
   */
  verifyIntegrity(packet: DecisionPacket): boolean {
    // Recalculate artifact hashes
    const recalculatedHashes: Record<string, string> = {
      question: hashData(packet.question),
      context: hashData(packet.context || ''),
      recommendation: hashData(packet.recommendation),
      citations: hashData(JSON.stringify(packet.citations)),
      contributions: hashData(JSON.stringify(packet.agentContributions)),
      dissents: hashData(JSON.stringify(packet.dissents)),
      toolCalls: hashData(JSON.stringify(packet.toolCalls)),
    };

    // Verify each hash matches
    for (const [key, hash] of Object.entries(recalculatedHashes)) {
      if (packet.artifactHashes[key] !== hash) {
        logger.warn('[DecisionPacket] Hash mismatch', { 
          runId: packet.runId, 
          artifact: key 
        });
        return false;
      }
    }

    // Verify Merkle root
    const recalculatedMerkleRoot = buildMerkleTree(Object.values(recalculatedHashes));
    if (packet.merkleRoot !== recalculatedMerkleRoot) {
      logger.warn('[DecisionPacket] Merkle root mismatch', { runId: packet.runId });
      return false;
    }

    logger.info('[DecisionPacket] Integrity verified', { runId: packet.runId });
    return true;
  }

  /**
   * Export packet to JSON with all integrity data
   */
  exportToJson(packet: DecisionPacket): string {
    const exportData = {
      ...packet,
      exportedAt: new Date().toISOString(),
      exportVersion: '1.0.0',
      trustArtifacts: {
        iso42001: 'https://datacendia.com/trust/iso-42001-conformance.pdf',
        nistAIRMF: 'https://datacendia.com/trust/nist-ai-rmf-alignment.pdf',
        euAIAct: 'https://datacendia.com/trust/eu-ai-act-conformance.pdf',
        sbom: 'https://datacendia.com/trust/sbom.json',
        securityPolicy: 'https://datacendia.com/.well-known/security.txt',
        verificationTools: 'https://github.com/datacendia/verification-tools',
      },
    };
    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Generate a unique run ID with timestamp component
   */
  private generateRunId(): string {
    const timestamp = Date.now().toString(36);
    const random = crypto.randomBytes(4).toString('hex');
    return `RUN-${timestamp}-${random}`.toUpperCase();
  }

  /**
   * Create canonical representation for signing (excludes signature field)
   */
  private canonicalize(packet: DecisionPacket): string {
    const { signature, ...rest } = packet;
    return JSON.stringify(rest, Object.keys(rest).sort());
  }

  /**
   * Get public key fingerprint for verification
   */
  async getPublicKeyFingerprint(keyId?: string): Promise<string> {
    const publicKey = await this.kms.getPublicKey(keyId);
    if (!publicKey) {
      throw new Error('Public key not available');
    }
    return hashData(publicKey).substring(0, 32);
  }
}

// Singleton instance
export const councilDecisionPacketService = new CouncilDecisionPacketService();
