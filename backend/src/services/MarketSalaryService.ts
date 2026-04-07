// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import { withFallback } from './_serviceProxy.js';

export interface SalaryQuery {
  title: string;
  role?: string;
  level?: string;
  location?: string;
  experience?: number;
  yearsExperience?: number;
  industry?: string;
  skills?: string[];
  companySize?: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
}

export const marketSalaryService: any = withFallback({});

export default marketSalaryService;
