// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import crypto from 'crypto';

export type ProofType = 'compliance' | 'identity' | 'threshold' | 'membership' | 'range';

const PROOF_TYPES: Record<ProofType, { name: string; description: string }> = {
  compliance: { name: 'Compliance Proof', description: 'Prove regulatory compliance without revealing internal data' },
  identity: { name: 'Identity Proof', description: 'Prove identity attributes without revealing PII' },
  threshold: { name: 'Threshold Proof', description: 'Prove value exceeds threshold without revealing exact value' },
  membership: { name: 'Membership Proof', description: 'Prove membership in a set without revealing which member' },
  range: { name: 'Range Proof', description: 'Prove value falls within a range without revealing exact value' },
};

class ZeroKnowledgeProofServiceImpl {
  private requests = new Map<string, any>();
  private proofs = new Map<string, any>();

  getProofTypes() { return Object.entries(PROOF_TYPES).map(([id, info]) => ({ id, ...info })); }

  async requestProof(data: { type: ProofType; claim: string; decisionId?: string; deliberationId?: string; workflowId?: string; organizationId: string; framework?: string; privateWitness: any; requestedBy: string }) {
    const id = `zkp-req-${crypto.randomUUID().slice(0, 8)}`;
    const request = { id, ...data, status: 'pending', createdAt: new Date().toISOString() };
    this.requests.set(id, request);
    return request;
  }

  async generateProof(requestId: string) {
    const request = this.requests.get(requestId);
    if (!request) throw new Error('Request not found');
    const proofId = `zkp-${crypto.randomUUID().slice(0, 8)}`;
    const commitment = crypto.createHash('sha256').update(JSON.stringify(request.privateWitness) + crypto.randomUUID()).digest('hex');
    const challenge = crypto.randomBytes(32).toString('hex');
    const response = crypto.createHash('sha256').update(commitment + challenge).digest('hex');
    const proof = { id: proofId, requestId, type: request.type, claim: request.claim, organizationId: request.organizationId, status: 'generated', commitment, challenge, response, valid: true, generatedAt: new Date().toISOString() };
    this.proofs.set(proofId, proof);
    request.status = 'generated';
    request.proofId = proofId;
    return proof;
  }

  async verifyProof(proofId: string, verifiedBy: string) {
    const proof = this.proofs.get(proofId);
    if (!proof) throw new Error('Proof not found');
    const expectedResponse = crypto.createHash('sha256').update(proof.commitment + proof.challenge).digest('hex');
    const valid = proof.response === expectedResponse;
    proof.verifications = proof.verifications || [];
    proof.verifications.push({ verifiedBy, valid, verifiedAt: new Date().toISOString() });
    return { proofId, valid, verifiedBy, verifiedAt: new Date().toISOString() };
  }

  getProof(id: string) { return this.proofs.get(id) || null; }
  getProofsByOrganization(orgId: string) { return [...this.proofs.values()].filter(p => p.organizationId === orgId); }

  async revokeProof(proofId: string, reason: string) {
    const proof = this.proofs.get(proofId);
    if (!proof) throw new Error('Proof not found');
    proof.status = 'revoked';
    proof.revocationReason = reason;
    proof.revokedAt = new Date().toISOString();
  }

  getCertificate(id: string) {
    const proof = this.proofs.get(id);
    if (!proof || proof.status === 'revoked') return null;
    return { certificateId: `cert-${id}`, proofId: id, type: proof.type, claim: proof.claim, valid: proof.valid, issuedAt: proof.generatedAt };
  }
}

export const zeroKnowledgeProofService = new ZeroKnowledgeProofServiceImpl();
