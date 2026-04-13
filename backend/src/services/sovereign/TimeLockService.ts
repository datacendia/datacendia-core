// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import crypto from 'crypto';

class TimeLockServiceImpl {
  private vaults = new Map<string, any>();

  async createVault(data: any) {
    const id = `vault-${crypto.randomUUID().slice(0, 8)}`;
    const unlockAt = data.unlockAt || new Date(Date.now() + 86400000).toISOString();
    const vault = { id, organizationId: data.organizationId, createdBy: data.createdBy, label: data.label || 'Time-Locked Vault', content: data.content, status: 'locked', unlockAt, createdAt: new Date().toISOString() };
    this.vaults.set(id, vault);
    return vault;
  }

  listVaults(orgId: string) { return [...this.vaults.values()].filter(v => !orgId || v.organizationId === orgId); }

  getVault(id: string) { return this.vaults.get(id) || null; }

  async startUnlock(id: string) {
    const vault = this.vaults.get(id);
    if (!vault) throw new Error('Vault not found');
    const now = new Date();
    if (now < new Date(vault.unlockAt)) {
      return { id, status: 'pending', unlockAt: vault.unlockAt, remainingMs: new Date(vault.unlockAt).getTime() - now.getTime() };
    }
    vault.status = 'unlocked';
    return { id, status: 'unlocked', unlockedAt: now.toISOString() };
  }

  getUnlockProgress(id: string) {
    const vault = this.vaults.get(id);
    if (!vault) return null;
    const now = Date.now();
    const created = new Date(vault.createdAt).getTime();
    const unlock = new Date(vault.unlockAt).getTime();
    const progress = Math.min(100, Math.round(((now - created) / (unlock - created)) * 100));
    return { id, status: vault.status, progress, unlockAt: vault.unlockAt };
  }

  getVaultContent(id: string, userId: string) {
    const vault = this.vaults.get(id);
    if (!vault || vault.status !== 'unlocked') return null;
    return vault.content;
  }

  async revokeVault(id: string, userId: string) {
    const vault = this.vaults.get(id);
    if (!vault) throw new Error('Vault not found');
    vault.status = 'revoked';
    vault.revokedBy = userId;
  }
}

export const timeLockService = new TimeLockServiceImpl();
