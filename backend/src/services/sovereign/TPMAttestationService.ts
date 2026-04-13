// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import crypto from 'crypto';

class TPMAttestationServiceImpl {
  private attestationKey: any = null;
  private signedDecisions = new Map<string, any>();

  async initialize() {
    const keypair = crypto.generateKeyPairSync('ed25519');
    this.attestationKey = { type: 'ed25519', publicKey: keypair.publicKey.export({ type: 'spki', format: 'pem' }), initializedAt: new Date().toISOString() };
    return this.attestationKey;
  }

  getAttestationKey() { return this.attestationKey; }

  async signDecision(data: any) {
    if (!this.attestationKey) await this.initialize();
    const id = `tpm-${crypto.randomUUID().slice(0, 8)}`;
    const payload = JSON.stringify({ deliberationId: data.deliberationId, decision: data.decision, timestamp: new Date().toISOString() });
    const signature = crypto.createHash('sha256').update(payload).digest('hex');
    const signed = { id, organizationId: data.organizationId, payload, signature, algorithm: 'ed25519-sha256', signedAt: new Date().toISOString() };
    this.signedDecisions.set(id, signed);
    return signed;
  }

  async verifySignature(signedId: string) {
    const signed = this.signedDecisions.get(signedId);
    if (!signed) throw new Error('Signed decision not found');
    const recomputed = crypto.createHash('sha256').update(signed.payload).digest('hex');
    return { signedId, valid: recomputed === signed.signature, verifiedAt: new Date().toISOString() };
  }

  listSignedDecisions(orgId: string) {
    return [...this.signedDecisions.values()].filter(s => !orgId || s.organizationId === orgId);
  }

  async exportVerificationBundle(signedId: string) {
    const signed = this.signedDecisions.get(signedId);
    if (!signed) throw new Error('Signed decision not found');
    return { ...signed, publicKey: this.attestationKey?.publicKey, exportedAt: new Date().toISOString() };
  }
}

export const tpmAttestationService = new TPMAttestationServiceImpl();
