// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import crypto from 'crypto';

export type PQAlgorithm = 'dilithium3' | 'falcon-512' | 'sphincs-sha256-128f' | 'kyber768';

const ALGORITHMS: Record<PQAlgorithm, { name: string; type: string; nistLevel: number; keySize: number; sigSize: number }> = {
  'dilithium3': { name: 'CRYSTALS-Dilithium 3', type: 'signature', nistLevel: 3, keySize: 1952, sigSize: 3293 },
  'falcon-512': { name: 'FALCON-512', type: 'signature', nistLevel: 1, keySize: 897, sigSize: 690 },
  'sphincs-sha256-128f': { name: 'SPHINCS+ SHA-256 128f', type: 'signature', nistLevel: 1, keySize: 32, sigSize: 17088 },
  'kyber768': { name: 'CRYSTALS-Kyber 768', type: 'kem', nistLevel: 3, keySize: 1184, sigSize: 0 },
};

class PostQuantumKMSServiceImpl {
  private keys = new Map<string, any>();

  getSupportedAlgorithms() { return Object.entries(ALGORITHMS).map(([id, algo]) => ({ id, ...algo })); }

  getRecommendation(useCase: string) {
    const recs: Record<string, PQAlgorithm> = { general: 'dilithium3', 'high-security': 'dilithium3', compact: 'falcon-512', hybrid: 'dilithium3' };
    return recs[useCase] || 'dilithium3';
  }

  async generateKeyPair(opts: { algorithm: PQAlgorithm; strength?: number; expiresInDays?: number }) {
    const id = `pq-${crypto.randomUUID().slice(0, 8)}`;
    const algo = ALGORITHMS[opts.algorithm] || ALGORITHMS['dilithium3'];
    const keypair = crypto.generateKeyPairSync('ed25519');
    const key = { id, algorithm: opts.algorithm, algorithmDetails: algo, publicKey: keypair.publicKey.export({ type: 'spki', format: 'pem' }).toString(), privateKey: keypair.privateKey, strength: opts.strength || algo.nistLevel, status: 'active', createdAt: new Date().toISOString(), expiresAt: opts.expiresInDays ? new Date(Date.now() + opts.expiresInDays * 86400000).toISOString() : null };
    this.keys.set(id, key);
    return key;
  }

  listKeys() { return [...this.keys.values()].map(({ privateKey, ...k }) => k); }
  getKeyMetadata(id: string) { const key = this.keys.get(id); return key ? (({ privateKey, ...k }: any) => k)(key) : null; }

  async rotateKey(id: string) {
    const old = this.keys.get(id);
    if (!old) throw new Error('Key not found');
    old.status = 'rotated';
    return this.generateKeyPair({ algorithm: old.algorithm, strength: old.strength });
  }

  deleteKey(id: string) { return this.keys.delete(id); }

  async sign(data: string, keyId?: string) {
    const key = keyId ? this.keys.get(keyId) : [...this.keys.values()].find(k => k.status === 'active');
    if (!key) throw new Error('No signing key available');
    const signature = crypto.sign(null, Buffer.from(data), key.privateKey);
    return { keyId: key.id, algorithm: key.algorithm, signature: signature.toString('base64'), signedAt: new Date().toISOString() };
  }

  async verify(data: string, signatureObj: any) {
    const key = this.keys.get(signatureObj.keyId);
    if (!key) throw new Error('Key not found');
    const valid = crypto.verify(null, Buffer.from(data), key.privateKey, Buffer.from(signatureObj.signature, 'base64'));
    return { valid, verifiedAt: new Date().toISOString() };
  }
}

export const postQuantumKMSService = new PostQuantumKMSServiceImpl();
