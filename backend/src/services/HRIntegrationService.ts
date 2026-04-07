// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import { withFallback } from './_serviceProxy.js';

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

export const hRIntegrationService: any = withFallback({});

export default hRIntegrationService;
