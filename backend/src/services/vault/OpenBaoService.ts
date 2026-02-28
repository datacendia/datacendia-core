// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA OpenBao/Vault SERVICE
// Comprehensive secrets management, dynamic credentials, PKI, and transit
// encryption beyond the signing-only integration in KeyManagementService.
//
// OpenBao is the open-source fork of HashiCorp Vault (post-BSL license).
// This service is API-compatible with both OpenBao and HashiCorp Vault.
//
// Features:
//   - KV Secrets Engine:  Store/retrieve application secrets
//   - Transit Engine:     Encrypt/decrypt/sign/verify (extends existing KMS)
//   - PKI Engine:         Issue and manage TLS certificates
//   - Database Engine:    Dynamic database credentials with TTL
//   - Lease Management:   Automatic renewal and revocation
//   - Policy Management:  Create/update/delete ACL policies
//   - Auth Methods:       AppRole, Token, Kubernetes auth
//
// Configuration:
//   OPENBAO_ENABLED      — 'true' to activate (default: false)
//   OPENBAO_ADDR         — Server URL (default: http://127.0.0.1:8200)
//   OPENBAO_TOKEN        — Root or service token
//   OPENBAO_NAMESPACE    — Enterprise namespace (optional)
//   OPENBAO_ROLE_ID      — AppRole auth role ID (optional)
//   OPENBAO_SECRET_ID    — AppRole auth secret ID (optional)
// =============================================================================

import { logger } from '../../utils/logger.js';
import crypto from 'crypto';

// ---------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------

export interface VaultSecret {
  key: string;
  value: unknown;
  metadata: {
    version: number;
    createdTime: string;
    deletedTime?: string;
    destroyed?: boolean;
    customMetadata?: Record<string, string>;
  };
}

export interface VaultLease {
  leaseId: string;
  leaseDuration: number;
  renewable: boolean;
  expiresAt: Date;
  secretType: string;
  mountPath: string;
}

export interface TransitKey {
  name: string;
  type: string;
  latestVersion: number;
  minDecryptionVersion: number;
  minEncryptionVersion: number;
  deletionAllowed: boolean;
  exportable: boolean;
  supportsEncryption: boolean;
  supportsSigning: boolean;
}

export interface PKICertificate {
  serialNumber: string;
  certificate: string;
  privateKey: string;
  caChain: string[];
  issuingCA: string;
  expiration: Date;
  commonName: string;
}

export interface DynamicCredential {
  leaseId: string;
  username: string;
  password: string;
  leaseDuration: number;
  renewable: boolean;
  expiresAt: Date;
  backend: string;
  role: string;
}

export interface VaultPolicy {
  name: string;
  rules: string;
}

export interface VaultHealth {
  enabled: boolean;
  connected: boolean;
  sealed?: boolean;
  version?: string;
  clusterName?: string;
  latencyMs?: number;
  activeLeases: number;
}

export interface AppRoleCredentials {
  clientToken: string;
  accessor: string;
  policies: string[];
  leaseDuration: number;
  renewable: boolean;
}

// ---------------------------------------------------------------------------
// OpenBao/Vault SERVICE
// ---------------------------------------------------------------------------

class OpenBaoService {
  private enabled: boolean;
  private address: string;
  private token: string;
  private namespace: string | undefined;
  private connected = false;

  // Lease tracking for auto-renewal
  private leases: Map<string, VaultLease> = new Map();
  private renewalTimers: Map<string, NodeJS.Timeout> = new Map();

  // Stats
  private secretReads = 0;
  private secretWrites = 0;
  private encryptOps = 0;
  private decryptOps = 0;
  private certsIssued = 0;
  private dynamicCredsIssued = 0;

  constructor() {
    this.enabled = process.env['OPENBAO_ENABLED'] === 'true';
    this.address = process.env['OPENBAO_ADDR'] || process.env['VAULT_ADDR'] || 'http://127.0.0.1:8200';
    this.token = process.env['OPENBAO_TOKEN'] || process.env['VAULT_TOKEN'] || '';
    this.namespace = process.env['OPENBAO_NAMESPACE'] || process.env['VAULT_NAMESPACE'];

    if (this.enabled) {
      logger.info(`[OpenBao] Enabled — server: ${this.address}`);
    } else {
      logger.info('[OpenBao] Disabled — set OPENBAO_ENABLED=true to activate');
    }
  }

  // ─── Connection & Auth ────────────────────────────────────────────────

  /**
   * Connect and authenticate with the Vault/OpenBao server.
   */
  async connect(): Promise<void> {
    if (!this.enabled) return;

    // Try AppRole auth first, then token
    const roleId = process.env['OPENBAO_ROLE_ID'];
    const secretId = process.env['OPENBAO_SECRET_ID'];

    if (roleId && secretId) {
      await this.authenticateAppRole(roleId, secretId);
    }

    // Verify connection
    const health = await this.checkHealth();
    this.connected = health.connected;

    if (this.connected) {
      logger.info(`[OpenBao] Connected — version: ${health.version}, sealed: ${health.sealed}`);
      this.startLeaseRenewalLoop();
    } else {
      logger.warn('[OpenBao] Server unreachable');
    }
  }

  /**
   * Authenticate via AppRole.
   */
  private async authenticateAppRole(roleId: string, secretId: string): Promise<void> {
    try {
      const response = await this.request('POST', '/v1/auth/approle/login', {
        role_id: roleId,
        secret_id: secretId,
      }, false);

      if (response.auth?.client_token) {
        this.token = response.auth.client_token;
        logger.info(`[OpenBao] AppRole authentication successful (policies: ${response.auth.policies?.join(', ')})`);
      }
    } catch (error) {
      logger.error('[OpenBao] AppRole authentication failed:', error);
    }
  }

  /**
   * Disconnect and clean up.
   */
  async disconnect(): Promise<void> {
    // Cancel all renewal timers
    for (const [id, timer] of this.renewalTimers) {
      clearTimeout(timer);
    }
    this.renewalTimers.clear();
    this.leases.clear();
    this.connected = false;
    logger.info('[OpenBao] Disconnected');
  }

  // ─── KV Secrets Engine ────────────────────────────────────────────────

  /**
   * Read a secret from the KV v2 secrets engine.
   */
  async readSecret(path: string, mount = 'secret'): Promise<VaultSecret | null> {
    if (!this.enabled) return null;

    try {
      const response = await this.request('GET', `/v1/${mount}/data/${path}`);
      this.secretReads++;

      return {
        key: path,
        value: response.data?.data,
        metadata: {
          version: response.data?.metadata?.version || 1,
          createdTime: response.data?.metadata?.created_time || new Date().toISOString(),
          deletedTime: response.data?.metadata?.deleted_time,
          destroyed: response.data?.metadata?.destroyed,
          customMetadata: response.data?.metadata?.custom_metadata,
        },
      };
    } catch (error) {
      logger.warn(`[OpenBao] Failed to read secret at ${path}:`, error);
      return null;
    }
  }

  /**
   * Write a secret to the KV v2 secrets engine.
   */
  async writeSecret(path: string, data: Record<string, unknown>, mount = 'secret'): Promise<boolean> {
    if (!this.enabled) return false;

    try {
      await this.request('POST', `/v1/${mount}/data/${path}`, { data });
      this.secretWrites++;
      logger.info(`[OpenBao] Secret written to ${mount}/${path}`);
      return true;
    } catch (error) {
      logger.error(`[OpenBao] Failed to write secret at ${path}:`, error);
      return false;
    }
  }

  /**
   * Delete a secret (soft delete in KV v2).
   */
  async deleteSecret(path: string, mount = 'secret'): Promise<boolean> {
    if (!this.enabled) return false;

    try {
      await this.request('DELETE', `/v1/${mount}/data/${path}`);
      logger.info(`[OpenBao] Secret deleted at ${mount}/${path}`);
      return true;
    } catch (error) {
      logger.error(`[OpenBao] Failed to delete secret at ${path}:`, error);
      return false;
    }
  }

  /**
   * List secrets at a path.
   */
  async listSecrets(path: string, mount = 'secret'): Promise<string[]> {
    if (!this.enabled) return [];

    try {
      const response = await this.request('LIST', `/v1/${mount}/metadata/${path}`);
      return response.data?.keys || [];
    } catch {
      return [];
    }
  }

  // ─── Transit Engine ───────────────────────────────────────────────────

  /**
   * Encrypt data using the transit engine.
   */
  async transitEncrypt(keyName: string, plaintext: string, mount = 'transit'): Promise<string | null> {
    if (!this.enabled) return null;

    try {
      const encoded = Buffer.from(plaintext).toString('base64');
      const response = await this.request('POST', `/v1/${mount}/encrypt/${keyName}`, {
        plaintext: encoded,
      });
      this.encryptOps++;
      return response.data?.ciphertext || null;
    } catch (error) {
      logger.error(`[OpenBao] Transit encrypt failed for key ${keyName}:`, error);
      return null;
    }
  }

  /**
   * Decrypt data using the transit engine.
   */
  async transitDecrypt(keyName: string, ciphertext: string, mount = 'transit'): Promise<string | null> {
    if (!this.enabled) return null;

    try {
      const response = await this.request('POST', `/v1/${mount}/decrypt/${keyName}`, {
        ciphertext,
      });
      this.decryptOps++;
      const decoded = response.data?.plaintext;
      return decoded ? Buffer.from(decoded, 'base64').toString('utf8') : null;
    } catch (error) {
      logger.error(`[OpenBao] Transit decrypt failed for key ${keyName}:`, error);
      return null;
    }
  }

  /**
   * Create or get a transit encryption key.
   */
  async transitCreateKey(keyName: string, type = 'aes256-gcm96', mount = 'transit'): Promise<TransitKey | null> {
    if (!this.enabled) return null;

    try {
      await this.request('POST', `/v1/${mount}/keys/${keyName}`, { type });
      const response = await this.request('GET', `/v1/${mount}/keys/${keyName}`);
      const keyData = response.data;

      return {
        name: keyName,
        type: keyData?.type || type,
        latestVersion: keyData?.latest_version || 1,
        minDecryptionVersion: keyData?.min_decryption_version || 1,
        minEncryptionVersion: keyData?.min_encryption_version || 0,
        deletionAllowed: keyData?.deletion_allowed || false,
        exportable: keyData?.exportable || false,
        supportsEncryption: keyData?.supports_encryption ?? true,
        supportsSigning: keyData?.supports_signing ?? false,
      };
    } catch (error) {
      logger.error(`[OpenBao] Failed to create transit key ${keyName}:`, error);
      return null;
    }
  }

  /**
   * Rotate a transit key.
   */
  async transitRotateKey(keyName: string, mount = 'transit'): Promise<boolean> {
    if (!this.enabled) return false;

    try {
      await this.request('POST', `/v1/${mount}/keys/${keyName}/rotate`);
      logger.info(`[OpenBao] Transit key ${keyName} rotated`);
      return true;
    } catch (error) {
      logger.error(`[OpenBao] Failed to rotate transit key ${keyName}:`, error);
      return false;
    }
  }

  // ─── PKI Engine ───────────────────────────────────────────────────────

  /**
   * Issue a TLS certificate from the PKI engine.
   */
  async issueCertificate(params: {
    commonName: string;
    altNames?: string[];
    ttl?: string;
    role?: string;
    mount?: string;
  }): Promise<PKICertificate | null> {
    if (!this.enabled) return null;

    const mount = params.mount || 'pki';
    const role = params.role || 'datacendia';

    try {
      const response = await this.request('POST', `/v1/${mount}/issue/${role}`, {
        common_name: params.commonName,
        alt_names: params.altNames?.join(','),
        ttl: params.ttl || '720h',
      });

      this.certsIssued++;

      // Track the lease
      if (response.lease_id) {
        this.trackLease({
          leaseId: response.lease_id,
          leaseDuration: response.lease_duration || 0,
          renewable: response.renewable || false,
          expiresAt: new Date(Date.now() + (response.lease_duration || 0) * 1000),
          secretType: 'pki-certificate',
          mountPath: mount,
        });
      }

      return {
        serialNumber: response.data?.serial_number || '',
        certificate: response.data?.certificate || '',
        privateKey: response.data?.private_key || '',
        caChain: response.data?.ca_chain || [],
        issuingCA: response.data?.issuing_ca || '',
        expiration: new Date(response.data?.expiration ? response.data.expiration * 1000 : Date.now() + 30 * 24 * 60 * 60 * 1000),
        commonName: params.commonName,
      };
    } catch (error) {
      logger.error(`[OpenBao] Failed to issue certificate for ${params.commonName}:`, error);
      return null;
    }
  }

  // ─── Database Dynamic Credentials ─────────────────────────────────────

  /**
   * Get dynamic database credentials.
   */
  async getDatabaseCredentials(role: string, mount = 'database'): Promise<DynamicCredential | null> {
    if (!this.enabled) return null;

    try {
      const response = await this.request('GET', `/v1/${mount}/creds/${role}`);
      this.dynamicCredsIssued++;

      const cred: DynamicCredential = {
        leaseId: response.lease_id || '',
        username: response.data?.username || '',
        password: response.data?.password || '',
        leaseDuration: response.lease_duration || 3600,
        renewable: response.renewable || false,
        expiresAt: new Date(Date.now() + (response.lease_duration || 3600) * 1000),
        backend: mount,
        role,
      };

      // Track the lease for renewal
      if (cred.leaseId) {
        this.trackLease({
          leaseId: cred.leaseId,
          leaseDuration: cred.leaseDuration,
          renewable: cred.renewable,
          expiresAt: cred.expiresAt,
          secretType: 'database-credential',
          mountPath: mount,
        });
      }

      return cred;
    } catch (error) {
      logger.error(`[OpenBao] Failed to get database credentials for role ${role}:`, error);
      return null;
    }
  }

  // ─── Lease Management ─────────────────────────────────────────────────

  /**
   * Track a lease for auto-renewal.
   */
  private trackLease(lease: VaultLease): void {
    this.leases.set(lease.leaseId, lease);

    // Schedule renewal at 75% of lease duration
    if (lease.renewable && lease.leaseDuration > 0) {
      const renewAt = lease.leaseDuration * 0.75 * 1000;
      const timer = setTimeout(() => this.renewLease(lease.leaseId), renewAt);
      this.renewalTimers.set(lease.leaseId, timer);
    }
  }

  /**
   * Renew a lease.
   */
  async renewLease(leaseId: string): Promise<boolean> {
    try {
      const response = await this.request('PUT', '/v1/sys/leases/renew', {
        lease_id: leaseId,
      });

      const lease = this.leases.get(leaseId);
      if (lease) {
        lease.leaseDuration = response.lease_duration || lease.leaseDuration;
        lease.expiresAt = new Date(Date.now() + lease.leaseDuration * 1000);
        this.leases.set(leaseId, lease);

        // Reschedule next renewal
        const existingTimer = this.renewalTimers.get(leaseId);
        if (existingTimer) clearTimeout(existingTimer);
        const renewAt = lease.leaseDuration * 0.75 * 1000;
        const timer = setTimeout(() => this.renewLease(leaseId), renewAt);
        this.renewalTimers.set(leaseId, timer);
      }

      return true;
    } catch (error) {
      logger.warn(`[OpenBao] Lease renewal failed for ${leaseId}:`, error);
      return false;
    }
  }

  /**
   * Revoke a lease.
   */
  async revokeLease(leaseId: string): Promise<boolean> {
    try {
      await this.request('PUT', '/v1/sys/leases/revoke', { lease_id: leaseId });
      this.leases.delete(leaseId);
      const timer = this.renewalTimers.get(leaseId);
      if (timer) {
        clearTimeout(timer);
        this.renewalTimers.delete(leaseId);
      }
      return true;
    } catch (error) {
      logger.error(`[OpenBao] Lease revocation failed for ${leaseId}:`, error);
      return false;
    }
  }

  /**
   * Get all active leases.
   */
  getActiveLeases(): VaultLease[] {
    return Array.from(this.leases.values());
  }

  /**
   * Start background lease renewal loop.
   */
  private startLeaseRenewalLoop(): void {
    // Check for expired leases every 60 seconds
    setInterval(() => {
      const now = Date.now();
      for (const [id, lease] of this.leases) {
        if (lease.expiresAt.getTime() < now) {
          logger.warn(`[OpenBao] Lease ${id} expired — removing`);
          this.leases.delete(id);
          const timer = this.renewalTimers.get(id);
          if (timer) {
            clearTimeout(timer);
            this.renewalTimers.delete(id);
          }
        }
      }
    }, 60_000);
  }

  // ─── Policy Management ────────────────────────────────────────────────

  /**
   * Create or update an ACL policy.
   */
  async putPolicy(name: string, rules: string): Promise<boolean> {
    if (!this.enabled) return false;

    try {
      await this.request('PUT', `/v1/sys/policies/acl/${name}`, { policy: rules });
      logger.info(`[OpenBao] Policy '${name}' created/updated`);
      return true;
    } catch (error) {
      logger.error(`[OpenBao] Failed to put policy '${name}':`, error);
      return false;
    }
  }

  /**
   * Read a policy.
   */
  async getPolicy(name: string): Promise<VaultPolicy | null> {
    if (!this.enabled) return null;

    try {
      const response = await this.request('GET', `/v1/sys/policies/acl/${name}`);
      return { name, rules: response.data?.policy || response.policy || '' };
    } catch {
      return null;
    }
  }

  /**
   * Delete a policy.
   */
  async deletePolicy(name: string): Promise<boolean> {
    if (!this.enabled) return false;

    try {
      await this.request('DELETE', `/v1/sys/policies/acl/${name}`);
      logger.info(`[OpenBao] Policy '${name}' deleted`);
      return true;
    } catch (error) {
      logger.error(`[OpenBao] Failed to delete policy '${name}':`, error);
      return false;
    }
  }

  /**
   * List all policies.
   */
  async listPolicies(): Promise<string[]> {
    if (!this.enabled) return [];

    try {
      const response = await this.request('GET', '/v1/sys/policies/acl');
      return response.data?.keys || response.keys || [];
    } catch {
      return [];
    }
  }

  // ─── HTTP Client ──────────────────────────────────────────────────────

  private async request(method: string, path: string, body?: unknown, auth = true): Promise<any> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (auth && this.token) {
      headers['X-Vault-Token'] = this.token;
    }
    if (this.namespace) {
      headers['X-Vault-Namespace'] = this.namespace;
    }

    const options: RequestInit = {
      method: method === 'LIST' ? 'GET' : method,
      headers,
      signal: AbortSignal.timeout(10_000),
    };

    // LIST uses a query parameter
    let url = `${this.address}${path}`;
    if (method === 'LIST') {
      url += (url.includes('?') ? '&' : '?') + 'list=true';
    }

    if (body && method !== 'GET' && method !== 'LIST') {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(`Vault ${method} ${path} returned ${response.status}: ${text.slice(0, 200)}`);
    }

    // Some endpoints return 204 No Content
    if (response.status === 204) return {};

    return response.json();
  }

  // ─── Health & Stats ───────────────────────────────────────────────────

  /**
   * Check Vault/OpenBao server health.
   */
  async checkHealth(): Promise<VaultHealth> {
    if (!this.enabled) {
      return { enabled: false, connected: false, activeLeases: 0 };
    }

    try {
      const start = Date.now();
      const response = await fetch(`${this.address}/v1/sys/health`, {
        signal: AbortSignal.timeout(3_000),
      });

      const data = await response.json() as any;

      return {
        enabled: true,
        connected: true,
        sealed: data.sealed,
        version: data.version,
        clusterName: data.cluster_name,
        latencyMs: Date.now() - start,
        activeLeases: this.leases.size,
      };
    } catch {
      return { enabled: true, connected: false, activeLeases: this.leases.size };
    }
  }

  /**
   * Get service statistics.
   */
  getStats(): {
    enabled: boolean;
    connected: boolean;
    address: string;
    secretReads: number;
    secretWrites: number;
    encryptOps: number;
    decryptOps: number;
    certsIssued: number;
    dynamicCredsIssued: number;
    activeLeases: number;
  } {
    return {
      enabled: this.enabled,
      connected: this.connected,
      address: this.address,
      secretReads: this.secretReads,
      secretWrites: this.secretWrites,
      encryptOps: this.encryptOps,
      decryptOps: this.decryptOps,
      certsIssued: this.certsIssued,
      dynamicCredsIssued: this.dynamicCredsIssued,
      activeLeases: this.leases.size,
    };
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  isConnected(): boolean {
    return this.connected;
  }
}

// Export singleton
export const openBao = new OpenBaoService();
export default openBao;
