// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// Lazy proxy — delegates to real CendiaZKP™ when @noble/curves is available
// Falls back to no-op if tsx can't resolve ESM subpath exports
export interface ProofType { [key: string]: any; }

let _realService: any = null;
const _loadPromise = import('../crypto/ZeroKnowledgeProofService.js')
  .then(mod => { _realService = mod.zkpService; })
  .catch(() => { /* @noble/curves unavailable — ZKP degraded */ });

export const zeroKnowledgeProofService: any = new Proxy({}, {
  get: (_t: any, prop: string) => {
    if (prop === 'then') return undefined;
    if (_realService && prop in _realService) {
      const val = _realService[prop];
      return typeof val === 'function' ? val.bind(_realService) : val;
    }
    return (..._args: any[]) => Promise.resolve({});
  },
});
