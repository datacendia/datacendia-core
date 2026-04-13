// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import crypto from 'crypto';
import { deterministicPick } from '../../utils/deterministic.js';

class CendiaKeyServiceImpl {
  private keys = new Map<string, any>();
  private challenges = new Map<string, any>();
  private operations: any[] = [];
  private attempts: any[] = [];

  async getDashboard(orgId: string) {
    return { organizationId: orgId, totalKeys: this.getKeysForOrg(orgId).length, operations: this.operations.filter(o => o.organizationId === orgId).length, recentAttempts: this.attempts.filter(a => a.organizationId === orgId).length };
  }

  getKeysForOrg(orgId: string) { return [...this.keys.values()].filter(k => k.organizationId === orgId); }

  getKey(id: string) { return this.keys.get(id) || null; }

  async getKeyAuditLog(id: string) {
    return this.operations.filter(o => o.keyId === id);
  }

  getOperations(orgId: string) { return this.operations.filter(o => o.organizationId === orgId); }

  getRecentAttempts(orgId: string, limit: number) { return this.attempts.filter(a => a.organizationId === orgId).slice(-limit); }

  async createChallenge(keyId: string, operation: string) {
    const id = `challenge-${crypto.randomUUID().slice(0, 8)}`;
    const challenge = { id, keyId, operation, nonce: crypto.randomBytes(32).toString('hex'), expiresAt: new Date(Date.now() + 300000).toISOString(), createdAt: new Date().toISOString() };
    this.challenges.set(id, challenge);
    return challenge;
  }

  async verifyChallenge(challengeId: string, response: string) {
    const challenge = this.challenges.get(challengeId);
    if (!challenge) throw new Error('Challenge not found');
    const valid = response && response.length > 0;
    this.attempts.push({ challengeId, keyId: challenge.keyId, success: valid, timestamp: new Date().toISOString() });
    return { challengeId, valid, verifiedAt: new Date().toISOString() };
  }
}

export const cendiaKeyService = new CendiaKeyServiceImpl();
