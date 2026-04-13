// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import crypto from 'crypto';

export interface SignatureResult {
  signature: string;
  keyId: string;
  algorithm: string;
  provider: string;
  signedAt: string;
}

class KeyManagementServiceImpl {
  private keys = new Map<string, any>();

  constructor() {
    // Seed default signing keys
    for (const kid of ['key-decision-signing-001', 'key-audit-ledger-001', 'key-data-encryption-001']) {
      const kp = crypto.generateKeyPairSync('rsa', { modulusLength: 2048, publicKeyEncoding: { type: 'spki', format: 'pem' }, privateKeyEncoding: { type: 'pkcs8', format: 'pem' } });
      this.keys.set(kid, { keyId: kid, provider: 'local', algorithm: 'RSA-SHA256', keySpec: 'RSA_2048', publicKey: kp.publicKey, privateKey: kp.privateKey, createdAt: new Date().toISOString(), rotatedAt: null, expiresAt: null, usageCount: 0, lastUsed: null });
    }
  }

  getStatus() { return { service: 'cendia-kms', status: 'operational', provider: 'local', keyCount: this.keys.size, initialized: true }; }

  async sign(data: string | Buffer, keyId?: string): Promise<SignatureResult> {
    const key = keyId ? this.keys.get(keyId) : [...this.keys.values()][0];
    if (!key) throw new Error('No signing key available');
    key.usageCount++; key.lastUsed = new Date();
    const buf = typeof data === 'string' ? Buffer.from(data) : data;
    const signature = crypto.sign('RSA-SHA256', buf, key.privateKey).toString('base64');
    return { signature, keyId: key.keyId, algorithm: key.algorithm, provider: key.provider, signedAt: new Date().toISOString() };
  }

  async verify(data: string | Buffer, signatureB64: string, keyId?: string): Promise<boolean> {
    const key = keyId ? this.keys.get(keyId) : [...this.keys.values()][0];
    if (!key) throw new Error('No verification key available');
    key.usageCount++; key.lastUsed = new Date();
    const buf = typeof data === 'string' ? Buffer.from(data) : data;
    return crypto.verify('RSA-SHA256', buf, key.publicKey, Buffer.from(signatureB64, 'base64'));
  }

  async encrypt(data: Buffer, keyId?: string) {
    const key = keyId ? this.keys.get(keyId) : [...this.keys.values()][0];
    if (!key) throw new Error('No encryption key available');
    key.usageCount++; key.lastUsed = new Date();
    const encrypted = crypto.publicEncrypt(key.publicKey, data);
    return { ciphertext: encrypted.toString('base64'), keyId: key.keyId, provider: key.provider, encryptedAt: new Date().toISOString() };
  }

  async decrypt(ciphertextB64: string, keyId?: string) {
    const key = keyId ? this.keys.get(keyId) : [...this.keys.values()][0];
    if (!key) throw new Error('No decryption key available');
    key.usageCount++; key.lastUsed = new Date();
    const plaintext = crypto.privateDecrypt(key.privateKey, Buffer.from(ciphertextB64, 'base64'));
    return { plaintext, keyId: key.keyId, provider: key.provider };
  }

  async createKey(keyId: string, opts?: { algorithm?: string; exportable?: boolean }) {
    const kp = crypto.generateKeyPairSync('rsa', { modulusLength: 2048, publicKeyEncoding: { type: 'spki', format: 'pem' }, privateKeyEncoding: { type: 'pkcs8', format: 'pem' } });
    const meta = { keyId, provider: 'local', algorithm: opts?.algorithm || 'RSA-SHA256', keySpec: 'RSA_2048', publicKey: kp.publicKey, privateKey: kp.privateKey, exportable: opts?.exportable ?? false, createdAt: new Date().toISOString(), rotatedAt: null, expiresAt: null, usageCount: 0, lastUsed: null };
    this.keys.set(keyId, meta);
    const { privateKey, ...safe } = meta;
    return safe;
  }

  async getKeyMetadata(keyId: string) {
    const key = this.keys.get(keyId);
    if (!key) return null;
    const { privateKey, ...safe } = key;
    return safe;
  }

  async rotateKey(keyId: string) {
    const old = this.keys.get(keyId);
    if (!old) throw new Error('Key not found');
    const kp = crypto.generateKeyPairSync('rsa', { modulusLength: 2048, publicKeyEncoding: { type: 'spki', format: 'pem' }, privateKeyEncoding: { type: 'pkcs8', format: 'pem' } });
    old.publicKey = kp.publicKey; old.privateKey = kp.privateKey; old.rotatedAt = new Date().toISOString();
    const { privateKey, ...safe } = old;
    return safe;
  }

  listKeys() { return [...this.keys.values()].map(({ privateKey, ...k }) => k); }

  getPublicKey(keyId?: string) {
    const key = keyId ? this.keys.get(keyId) : [...this.keys.values()][0];
    return key ? key.publicKey : null;
  }
}

export const keyManagementService = new KeyManagementServiceImpl();
export { KeyManagementServiceImpl as KeyManagementService };
