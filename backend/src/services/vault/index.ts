// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA OpenBao/Vault — Barrel Exports
// =============================================================================

export { openBao, default } from './OpenBaoService.js';

export type {
  VaultSecret,
  VaultLease,
  TransitKey,
  PKICertificate,
  DynamicCredential,
  VaultPolicy,
  VaultHealth,
  AppRoleCredentials,
} from './OpenBaoService.js';
