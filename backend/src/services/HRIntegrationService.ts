// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// Auto-generated stub — implement as needed

export type HRProvider = 'workday' | 'bamboohr' | 'adp' | 'gusto' | 'manual';

export interface HRCredentials {
  provider: HRProvider;
  apiKey?: string;
  clientId?: string;
  clientSecret?: string;
  tenantId?: string;
  subdomain?: string;
  refreshToken?: string;
}

export const hRIntegrationService: any = new Proxy({}, {
  get: (_t: any, prop: string) => {
    if (prop === 'then') return undefined;
    return (..._args: any[]) => Promise.resolve({});
  },
});

export default hRIntegrationService;
