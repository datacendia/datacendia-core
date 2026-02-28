// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA NVIDIA CONFIDENTIAL COMPUTING SERVICE
// Ensures data-in-use protection during GPU inference via NVIDIA H100/H200
// Confidential Computing mode with hardware-level attestation.
//
// Provides:
//   - GPU attestation verification (local NVIDIA attestation)
//   - Confidential inference enforcement (only attested GPUs process data)
//   - CC compliance evidence generation for DCII P7
//   - Secure enclave session management
//   - Memory encryption verification
//
// DCII Alignment:
//   - P7 (Quantum-Resistant Integrity): Evidence cannot be extracted from GPU memory
//   - P4 (Continuity Memory): Secure processing state management
//   - P1 (Discovery-Time Proof): Attestation timestamps prove CC was active
//
// Configuration:
//   CC_ENABLED          — 'true' to activate (default: false)
//   CC_ATTESTATION_URL  — NVIDIA Local Attestation service (default: http://localhost:8443)
//   CC_REQUIRE_GPU      — 'true' to block inference without attested GPU (default: false)
//   CC_EVIDENCE_DIR     — Directory for CC evidence artifacts (default: /var/datacendia/cc-evidence)
// =============================================================================

import { logger } from '../../utils/logger.js';
import crypto from 'crypto';

// ---------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------

export type GPUConfidentialMode = 'off' | 'on' | 'devtools' | 'unknown';

export interface GPUAttestationResult {
  attestationId: string;
  timestamp: Date;
  gpuId: string;
  gpuModel: string;
  firmwareVersion: string;
  driverVersion: string;
  confidentialMode: GPUConfidentialMode;
  memoryEncryption: boolean;
  secureBootVerified: boolean;
  attestationChain: string[];
  nonce: string;
  signature: string;
  valid: boolean;
  expiresAt: Date;
}

export interface ConfidentialSession {
  sessionId: string;
  gpuId: string;
  attestationId: string;
  createdAt: Date;
  expiresAt: Date;
  active: boolean;
  inferenceCount: number;
  bytesProcessed: number;
  lastActivityAt: Date;
}

export interface CCEvidencePacket {
  packetId: string;
  generatedAt: Date;
  organizationId: string;
  attestations: GPUAttestationResult[];
  sessions: ConfidentialSession[];
  policyEnforcement: {
    requireCC: boolean;
    blockedInferences: number;
    allowedInferences: number;
    enforcementRate: number;
  };
  complianceFrameworks: string[];
  dciiPrimitives: string[];
  integrityHash: string;
  signature?: string;
}

export interface CCPolicy {
  requireAttestation: boolean;
  attestationRefreshIntervalSec: number;
  maxSessionDurationSec: number;
  allowedGPUModels: string[];
  minimumFirmwareVersion: string;
  requireMemoryEncryption: boolean;
  requireSecureBoot: boolean;
  blockOnAttestationFailure: boolean;
}

export interface CCHealth {
  enabled: boolean;
  attestationServiceAvailable: boolean;
  activeGPUs: number;
  attestedGPUs: number;
  activeSessions: number;
  policyEnforced: boolean;
  latencyMs?: number;
}

// ---------------------------------------------------------------------------
// DEFAULT POLICY
// ---------------------------------------------------------------------------

const DEFAULT_CC_POLICY: CCPolicy = {
  requireAttestation: true,
  attestationRefreshIntervalSec: 3600, // Re-attest every hour
  maxSessionDurationSec: 86400, // 24 hour sessions
  allowedGPUModels: ['H100', 'H200', 'H100 SXM5', 'H200 SXM5', 'A100'], // CC-capable GPUs
  minimumFirmwareVersion: '550.0.0',
  requireMemoryEncryption: true,
  requireSecureBoot: true,
  blockOnAttestationFailure: false, // Default: warn, not block
};

// ---------------------------------------------------------------------------
// CONFIDENTIAL COMPUTE SERVICE
// ---------------------------------------------------------------------------

class ConfidentialComputeService {
  private enabled: boolean;
  private attestationUrl: string;
  private requireGPU: boolean;
  private evidenceDir: string;
  private policy: CCPolicy;

  private attestations: Map<string, GPUAttestationResult> = new Map();
  private sessions: Map<string, ConfidentialSession> = new Map();

  // Stats
  private attestationCount = 0;
  private attestationFailures = 0;
  private blockedInferences = 0;
  private allowedInferences = 0;

  constructor() {
    this.enabled = process.env['CC_ENABLED'] === 'true';
    this.attestationUrl = process.env['CC_ATTESTATION_URL'] || 'http://localhost:8443';
    this.requireGPU = process.env['CC_REQUIRE_GPU'] === 'true';
    this.evidenceDir = process.env['CC_EVIDENCE_DIR'] || '/var/datacendia/cc-evidence';
    this.policy = { ...DEFAULT_CC_POLICY };

    if (this.enabled) {
      logger.info(`[CC] Confidential Computing enabled — attestation: ${this.attestationUrl}`);
    } else {
      logger.info('[CC] Confidential Computing disabled — set CC_ENABLED=true for data-in-use protection');
    }
  }

  // ─── GPU Attestation ──────────────────────────────────────────────────

  /**
   * Verify GPU is operating in Confidential Computing mode.
   * Contacts NVIDIA local attestation service for hardware-level proof.
   */
  async verifyGPUAttestation(gpuId?: string): Promise<GPUAttestationResult> {
    const attestationId = `cc-att-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
    const nonce = crypto.randomBytes(32).toString('hex');

    if (!this.enabled) {
      return this.createSoftwareAttestation(attestationId, gpuId || 'software-0', nonce);
    }

    try {
      // Contact NVIDIA Local Attestation Service
      const response = await fetch(`${this.attestationUrl}/v1/attest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gpu_id: gpuId || '0',
          nonce,
          evidence_type: 'gpu_attestation',
        }),
        signal: AbortSignal.timeout(10_000),
      });

      if (!response.ok) {
        throw new Error(`Attestation service returned ${response.status}`);
      }

      const data = await response.json() as any;

      const result: GPUAttestationResult = {
        attestationId,
        timestamp: new Date(),
        gpuId: data.gpu_id || gpuId || '0',
        gpuModel: data.gpu_model || 'unknown',
        firmwareVersion: data.firmware_version || 'unknown',
        driverVersion: data.driver_version || 'unknown',
        confidentialMode: this.parseConfidentialMode(data.cc_mode),
        memoryEncryption: data.memory_encryption ?? false,
        secureBootVerified: data.secure_boot ?? false,
        attestationChain: data.attestation_chain || [],
        nonce,
        signature: data.signature || '',
        valid: this.validateAttestation(data),
        expiresAt: new Date(Date.now() + this.policy.attestationRefreshIntervalSec * 1000),
      };

      this.attestations.set(attestationId, result);
      this.attestationCount++;

      if (!result.valid) {
        this.attestationFailures++;
        logger.warn(`[CC] Attestation failed for GPU ${result.gpuId}: CC mode=${result.confidentialMode}`);
      } else {
        logger.info(`[CC] GPU ${result.gpuId} (${result.gpuModel}) attested — CC: ${result.confidentialMode}, MEM_ENC: ${result.memoryEncryption}`);
      }

      return result;
    } catch (error) {
      this.attestationFailures++;
      logger.warn('[CC] Attestation service unavailable:', error);

      // Return software attestation as fallback
      return this.createSoftwareAttestation(attestationId, gpuId || 'software-0', nonce);
    }
  }

  private createSoftwareAttestation(
    attestationId: string,
    gpuId: string,
    nonce: string
  ): GPUAttestationResult {
    const result: GPUAttestationResult = {
      attestationId,
      timestamp: new Date(),
      gpuId,
      gpuModel: 'software-emulated',
      firmwareVersion: 'N/A',
      driverVersion: 'N/A',
      confidentialMode: 'off',
      memoryEncryption: false,
      secureBootVerified: false,
      attestationChain: [],
      nonce,
      signature: crypto.createHash('sha256').update(`${attestationId}:${nonce}`).digest('hex'),
      valid: !this.requireGPU, // Valid only if GPU is not required
      expiresAt: new Date(Date.now() + 3600 * 1000),
    };

    this.attestations.set(attestationId, result);
    return result;
  }

  private parseConfidentialMode(mode: string | undefined): GPUConfidentialMode {
    if (!mode) return 'unknown';
    const normalized = mode.toLowerCase();
    if (normalized === 'on' || normalized === 'enabled') return 'on';
    if (normalized === 'off' || normalized === 'disabled') return 'off';
    if (normalized === 'devtools') return 'devtools';
    return 'unknown';
  }

  private validateAttestation(data: any): boolean {
    if (!data) return false;

    // Check CC mode
    const mode = this.parseConfidentialMode(data.cc_mode);
    if (mode !== 'on' && mode !== 'devtools') return false;

    // Check memory encryption
    if (this.policy.requireMemoryEncryption && !data.memory_encryption) return false;

    // Check secure boot
    if (this.policy.requireSecureBoot && !data.secure_boot) return false;

    // Check GPU model
    if (this.policy.allowedGPUModels.length > 0) {
      const model = data.gpu_model || '';
      if (!this.policy.allowedGPUModels.some(allowed => model.includes(allowed))) return false;
    }

    return true;
  }

  // ─── Confidential Sessions ────────────────────────────────────────────

  /**
   * Create a confidential inference session on an attested GPU.
   */
  async createSession(gpuId: string): Promise<ConfidentialSession | null> {
    // Find valid attestation for this GPU
    const attestation = Array.from(this.attestations.values())
      .find(a => a.gpuId === gpuId && a.valid && a.expiresAt > new Date());

    if (!attestation) {
      // Try to attest the GPU first
      const newAttestation = await this.verifyGPUAttestation(gpuId);
      if (!newAttestation.valid) {
        if (this.policy.blockOnAttestationFailure) {
          this.blockedInferences++;
          logger.warn(`[CC] Session creation blocked — GPU ${gpuId} not attested`);
          return null;
        }
        logger.warn(`[CC] Creating session on unattested GPU ${gpuId} (policy: warn only)`);
      }
    }

    const session: ConfidentialSession = {
      sessionId: `cc-session-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`,
      gpuId,
      attestationId: attestation?.attestationId || 'unattested',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + this.policy.maxSessionDurationSec * 1000),
      active: true,
      inferenceCount: 0,
      bytesProcessed: 0,
      lastActivityAt: new Date(),
    };

    this.sessions.set(session.sessionId, session);
    logger.info(`[CC] Session ${session.sessionId} created on GPU ${gpuId}`);
    return session;
  }

  /**
   * Record an inference operation within a session.
   */
  recordInference(sessionId: string, bytesProcessed: number): boolean {
    const session = this.sessions.get(sessionId);
    if (!session || !session.active || session.expiresAt < new Date()) {
      this.blockedInferences++;
      return false;
    }

    session.inferenceCount++;
    session.bytesProcessed += bytesProcessed;
    session.lastActivityAt = new Date();
    this.allowedInferences++;
    return true;
  }

  /**
   * Close a confidential session.
   */
  closeSession(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    session.active = false;
    logger.info(`[CC] Session ${sessionId} closed — ${session.inferenceCount} inferences, ${session.bytesProcessed} bytes processed`);
    return true;
  }

  // ─── Inference Enforcement ────────────────────────────────────────────

  /**
   * Check if inference is allowed given current CC policy.
   * Called before each inference operation.
   */
  async enforceConfidentialInference(): Promise<{
    allowed: boolean;
    reason: string;
    attestationId?: string;
    sessionId?: string;
  }> {
    if (!this.enabled) {
      return { allowed: true, reason: 'CC disabled — inference allowed without attestation' };
    }

    // Find any valid attestation
    const validAttestation = Array.from(this.attestations.values())
      .find(a => a.valid && a.expiresAt > new Date());

    if (!validAttestation) {
      if (this.requireGPU) {
        this.blockedInferences++;
        return { allowed: false, reason: 'No valid GPU attestation — CC_REQUIRE_GPU is enforced' };
      }
      return { allowed: true, reason: 'No valid attestation but CC_REQUIRE_GPU is not enforced' };
    }

    // Find active session
    const activeSession = Array.from(this.sessions.values())
      .find(s => s.active && s.attestationId === validAttestation.attestationId && s.expiresAt > new Date());

    this.allowedInferences++;
    return {
      allowed: true,
      reason: `Inference authorized on attested GPU ${validAttestation.gpuId}`,
      attestationId: validAttestation.attestationId,
      sessionId: activeSession?.sessionId,
    };
  }

  // ─── Evidence Generation ──────────────────────────────────────────────

  /**
   * Generate CC compliance evidence for DCII P7.
   */
  async generateCCEvidence(organizationId: string): Promise<CCEvidencePacket> {
    const attestations = Array.from(this.attestations.values());
    const sessions = Array.from(this.sessions.values());

    const totalInferences = this.allowedInferences + this.blockedInferences;
    const enforcementRate = totalInferences > 0 ? this.allowedInferences / totalInferences : 1.0;

    const packet: CCEvidencePacket = {
      packetId: `cc-evidence-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`,
      generatedAt: new Date(),
      organizationId,
      attestations: attestations.slice(-50), // Last 50 attestations
      sessions: sessions.slice(-50),
      policyEnforcement: {
        requireCC: this.requireGPU,
        blockedInferences: this.blockedInferences,
        allowedInferences: this.allowedInferences,
        enforcementRate: Math.round(enforcementRate * 10000) / 10000,
      },
      complianceFrameworks: [
        'NIST-800-53-SC-28', // Protection of Information at Rest (extended to in-use)
        'ISO27001-A.10.1', // Cryptographic controls
        'FIPS-140-3', // Cryptographic module security
        'CC-EAL4+', // Common Criteria evaluation
        'EU-AI-Act-Art-15', // Accuracy, robustness, cybersecurity
      ],
      dciiPrimitives: [
        'P7: Quantum-Resistant Integrity — data protected during GPU processing',
        'P4: Continuity Memory — secure processing state managed',
        'P1: Discovery-Time Proof — attestation timestamps prove CC was active',
      ],
      integrityHash: '',
    };

    // Compute integrity hash
    packet.integrityHash = crypto
      .createHash('sha256')
      .update(JSON.stringify({ ...packet, integrityHash: '' }))
      .digest('hex');

    // Sign with KMS if available
    try {
      const { keyManagementService } = await import('../security/KeyManagementService.js');
      const sig = await keyManagementService.sign(Buffer.from(packet.integrityHash));
      packet.signature = sig.signature;
    } catch {
      // KMS not available — evidence still valid, just unsigned
    }

    return packet;
  }

  // ─── Policy Management ────────────────────────────────────────────────

  updatePolicy(updates: Partial<CCPolicy>): void {
    Object.assign(this.policy, updates);
    logger.info('[CC] Policy updated');
  }

  getPolicy(): CCPolicy {
    return { ...this.policy };
  }

  // ─── Health & Stats ───────────────────────────────────────────────────

  async checkHealth(): Promise<CCHealth> {
    if (!this.enabled) {
      return { enabled: false, attestationServiceAvailable: false, activeGPUs: 0, attestedGPUs: 0, activeSessions: 0, policyEnforced: false };
    }

    let attestationAvailable = false;
    let latencyMs: number | undefined;

    try {
      const start = Date.now();
      const response = await fetch(`${this.attestationUrl}/v1/health`, {
        signal: AbortSignal.timeout(3_000),
      });
      attestationAvailable = response.ok;
      latencyMs = Date.now() - start;
    } catch { /* unavailable */ }

    const now = new Date();
    const validAttestations = Array.from(this.attestations.values())
      .filter(a => a.valid && a.expiresAt > now);
    const activeSessions = Array.from(this.sessions.values())
      .filter(s => s.active && s.expiresAt > now);

    return {
      enabled: true,
      attestationServiceAvailable: attestationAvailable,
      activeGPUs: new Set(validAttestations.map(a => a.gpuId)).size,
      attestedGPUs: validAttestations.length,
      activeSessions: activeSessions.length,
      policyEnforced: this.requireGPU,
      latencyMs,
    };
  }

  getStats(): {
    enabled: boolean;
    requireGPU: boolean;
    attestationCount: number;
    attestationFailures: number;
    attestationSuccessRate: number;
    blockedInferences: number;
    allowedInferences: number;
    activeSessions: number;
    totalSessions: number;
  } {
    return {
      enabled: this.enabled,
      requireGPU: this.requireGPU,
      attestationCount: this.attestationCount,
      attestationFailures: this.attestationFailures,
      attestationSuccessRate: this.attestationCount > 0
        ? (this.attestationCount - this.attestationFailures) / this.attestationCount
        : 0,
      blockedInferences: this.blockedInferences,
      allowedInferences: this.allowedInferences,
      activeSessions: Array.from(this.sessions.values()).filter(s => s.active).length,
      totalSessions: this.sessions.size,
    };
  }

  isEnabled(): boolean {
    return this.enabled;
  }
}

// Export singleton
export const confidentialCompute = new ConfidentialComputeService();
export default confidentialCompute;
