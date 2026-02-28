// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
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
