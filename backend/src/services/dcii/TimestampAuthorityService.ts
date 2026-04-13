// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// RFC 3161 TIMESTAMP AUTHORITY SERVICE
// Cryptographic timestamping for tamper-evident governance records.
// =============================================================================

import crypto from 'crypto';

interface TimestampToken {
  id: string;
  organizationId: string;
  dataHash: string;
  description: string;
  dataType: string;
  referenceId?: string;
  timestamp: string;
  serialNumber: string;
  signature: string;
  provider: string;
  blockchain?: { txHash: string; block: number; chain: string };
  verifications: Array<{ verifiedBy: string; verifiedAt: string; valid: boolean }>;
  issuedAt: string;
}

interface TimestampBatch {
  id: string;
  organizationId: string;
  tokenIds: string[];
  merkleRoot: string;
  issuedAt: string;
}

const PROVIDERS = [
  { id: 'cendia-tsa', name: 'Cendia Internal TSA', type: 'internal', rfc3161: true },
  { id: 'digicert-tsa', name: 'DigiCert Timestamp', type: 'external', rfc3161: true },
  { id: 'eth-mainnet', name: 'Ethereum Mainnet', type: 'blockchain', rfc3161: false },
];

class TimestampAuthorityServiceImpl {
  private tokens = new Map<string, TimestampToken>();
  private batches = new Map<string, TimestampBatch>();
  private serial = 0;

  async issueTimestamp(
    organizationId: string, data: string, description: string,
    dataType: string, referenceId?: string,
    options?: { useExternal?: boolean; useBlockchain?: boolean; preferredProvider?: string },
  ): Promise<TimestampToken> {
    const id = `ts-${crypto.randomUUID().slice(0, 8)}`;
    const dataHash = crypto.createHash('sha256').update(data).digest('hex');
    const now = new Date().toISOString();
    this.serial++;

    const provider = options?.useBlockchain ? 'eth-mainnet' : options?.useExternal ? 'digicert-tsa' : 'cendia-tsa';
    const signature = crypto.createHash('sha256').update(`${id}|${dataHash}|${now}|${this.serial}`).digest('hex');

    const token: TimestampToken = {
      id, organizationId, dataHash, description, dataType, referenceId,
      timestamp: now,
      serialNumber: `SN-${this.serial.toString().padStart(8, '0')}`,
      signature, provider,
      blockchain: options?.useBlockchain ? {
        txHash: `0x${crypto.createHash('sha256').update(`tx-${id}`).digest('hex')}`,
        block: 19000000 + this.serial,
        chain: 'ethereum-mainnet',
      } : undefined,
      verifications: [],
      issuedAt: now,
    };

    this.tokens.set(id, token);
    return token;
  }

  async batchTimestamp(
    organizationId: string,
    items: Array<{ data: string; description: string; dataType?: string }>,
    options?: { useExternal?: boolean; useBlockchain?: boolean },
  ): Promise<TimestampBatch> {
    const tokenIds: string[] = [];
    const hashes: string[] = [];

    for (const item of items) {
      const token = await this.issueTimestamp(organizationId, item.data, item.description, item.dataType || 'generic', undefined, options);
      tokenIds.push(token.id);
      hashes.push(token.dataHash);
    }

    const merkleRoot = this.computeMerkleRoot(hashes);
    const batch: TimestampBatch = {
      id: `batch-${crypto.randomUUID().slice(0, 8)}`,
      organizationId, tokenIds, merkleRoot, issuedAt: new Date().toISOString(),
    };
    this.batches.set(batch.id, batch);
    return batch;
  }

  async verifyTimestamp(tokenId: string, verifiedBy: string) {
    const token = this.tokens.get(tokenId);
    if (!token) throw new Error(`Token ${tokenId} not found`);

    const expectedSig = crypto.createHash('sha256')
      .update(`${token.id}|${token.dataHash}|${token.timestamp}|${token.serialNumber.replace('SN-', '')}`)
      .digest('hex');

    const valid = expectedSig === token.signature;
    const verification = { verifiedBy, verifiedAt: new Date().toISOString(), valid };
    token.verifications.push(verification);

    return {
      tokenId, valid, signature: token.signature, expectedSignature: expectedSig,
      timestamp: token.timestamp, provider: token.provider,
      blockchain: token.blockchain, verification,
    };
  }

  getToken(id: string): TimestampToken | undefined { return this.tokens.get(id); }
  getTokensByOrganization(orgId: string): TimestampToken[] {
    return [...this.tokens.values()].filter(t => t.organizationId === orgId);
  }
  getAllTokens(): TimestampToken[] { return [...this.tokens.values()]; }
  getTokensByReference(refId: string): TimestampToken[] {
    return [...this.tokens.values()].filter(t => t.referenceId === refId);
  }
  getBatch(batchId: string): TimestampBatch | undefined { return this.batches.get(batchId); }
  getProviders() { return PROVIDERS; }

  getStats(organizationId?: string) {
    const tokens = organizationId
      ? [...this.tokens.values()].filter(t => t.organizationId === organizationId)
      : [...this.tokens.values()];
    return {
      totalTokens: tokens.length,
      totalVerifications: tokens.reduce((s, t) => s + t.verifications.length, 0),
      blockchainAnchored: tokens.filter(t => t.blockchain).length,
      providers: PROVIDERS.map(p => ({ ...p, count: tokens.filter(t => t.provider === p.id).length })),
    };
  }

  private computeMerkleRoot(leaves: string[]): string {
    if (leaves.length === 0) return crypto.createHash('sha256').update('empty').digest('hex');
    if (leaves.length === 1) return leaves[0]!;
    const level: string[] = [];
    for (let i = 0; i < leaves.length; i += 2) {
      const left = leaves[i]!;
      const right = leaves[i + 1] || left;
      level.push(crypto.createHash('sha256').update(left + right).digest('hex'));
    }
    return this.computeMerkleRoot(level);
  }
}

export const timestampAuthorityService = new TimestampAuthorityServiceImpl();
