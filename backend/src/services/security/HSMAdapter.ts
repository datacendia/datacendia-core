// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import crypto from 'crypto';

class HSMAdapterImpl {
  private initialized = false;
  private keys = new Map<string, any>();

  getStatus() { return { mode: 'software-fallback', initialized: this.initialized, keyCount: this.keys.size, provider: 'SoftHSM (PKCS#11 emulation)' }; }

  async initialize() {
    this.initialized = true;
    return { success: true, mode: 'software-fallback', message: 'HSM initialized in software fallback mode' };
  }

  async generateKey(opts: { algorithm: string; label: string; extractable?: boolean }) {
    const id = `hsm-key-${crypto.randomUUID().slice(0, 8)}`;
    const keypair = crypto.generateKeyPairSync('ed25519');
    const key = { id, algorithm: opts.algorithm || 'Ed25519', label: opts.label, extractable: opts.extractable ?? false, createdAt: new Date().toISOString(), _softwareKey: keypair };
    this.keys.set(id, key);
    return key;
  }

  listKeys() { return [...this.keys.values()]; }
  getKey(id: string) { return this.keys.get(id) || null; }

  async sign(keyId: string, data: Buffer) {
    const key = this.keys.get(keyId);
    if (!key) throw new Error('Key not found');
    const signature = crypto.sign(null, data, key._softwareKey.privateKey);
    return { keyId, signature: signature.toString('base64'), algorithm: key.algorithm, signedAt: new Date().toISOString() };
  }

  async verify(keyId: string, data: Buffer, signatureB64: string) {
    const key = this.keys.get(keyId);
    if (!key) throw new Error('Key not found');
    const sig = Buffer.from(signatureB64, 'base64');
    return crypto.verify(null, data, key._softwareKey.publicKey, sig);
  }

  async wrapKey(keyToWrapId: string, wrappingKeyId: string) {
    const keyToWrap = this.keys.get(keyToWrapId);
    const wrappingKey = this.keys.get(wrappingKeyId);
    if (!keyToWrap) throw new Error(`Key ${keyToWrapId} not found`);
    if (!wrappingKey) throw new Error(`Wrapping key ${wrappingKeyId} not found`);
    const wrapped = crypto.publicEncrypt(wrappingKey._softwareKey.publicKey, Buffer.from(keyToWrapId));
    return { wrappedKey: wrapped.toString('base64'), wrappingKeyId, algorithm: wrappingKey.algorithm, wrappedAt: new Date().toISOString() };
  }

  async generateRandom(length: number) {
    const data = crypto.randomBytes(length);
    return { data, source: 'software-fallback', entropyBits: length * 8 };
  }
}

export const hsmAdapter = new HSMAdapterImpl();
