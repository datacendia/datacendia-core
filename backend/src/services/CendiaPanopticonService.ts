// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import { withFallback } from './_serviceProxy.js';

export const cendiaPanopticonService: any = withFallback({});

export const REGULATORY_FRAMEWORKS: Record<string, { name: string; region: string; category: string }> = {
  'EU_AI_ACT': { name: 'EU AI Act', region: 'EU', category: 'ai_governance' },
  'GDPR': { name: 'General Data Protection Regulation', region: 'EU', category: 'data_privacy' },
  'DORA': { name: 'Digital Operational Resilience Act', region: 'EU', category: 'operational_resilience' },
  'SOC2': { name: 'SOC 2 Type II', region: 'US', category: 'security' },
  'HIPAA': { name: 'Health Insurance Portability and Accountability Act', region: 'US', category: 'healthcare' },
  'NIST_AI_RMF': { name: 'NIST AI Risk Management Framework', region: 'US', category: 'ai_governance' },
  'ISO_27001': { name: 'ISO 27001', region: 'Global', category: 'security' },
  'BASEL_III': { name: 'Basel III', region: 'Global', category: 'banking' },
};
