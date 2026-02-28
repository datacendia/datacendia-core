// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * DATACENDIA DOMAIN AGENTS - Modular Agent Registry
 * Split into separate files for faster HMR and better organization
 * 17 Industry Verticals + Core C-Suite + Premium Tiers
 */

export type { DomainAgent } from './types';

// Core & Premium
export { CORE_AGENTS } from './core';
export { PRO_AGENTS, ENTERPRISE_AGENTS, PREMIUM_AGENTS } from './premium';

// Industry Verticals
export { LEGAL_AGENTS } from './legal';
export { HEALTHCARE_AGENTS } from './healthcare';
export { FINANCE_AGENTS } from './finance';
export { GOVERNMENT_AGENTS } from './government';
export { INSURANCE_AGENTS } from './insurance';
export { PHARMACEUTICAL_AGENTS } from './pharmaceutical';
export { MANUFACTURING_AGENTS } from './manufacturing';
export { ENERGY_AGENTS } from './energy';
export { TECHNOLOGY_AGENTS } from './technology';
export { RETAIL_AGENTS } from './retail';
export { REAL_ESTATE_AGENTS } from './real-estate';
export { TRANSPORTATION_AGENTS } from './transportation';
export { MEDIA_AGENTS } from './media';
export { PROFESSIONAL_SERVICES_AGENTS } from './professional-services';
export { EDUCATION_AGENTS } from './education';
export { SPORTS_AGENTS } from './sports';

// Combined agents array for backward compatibility
import { CORE_AGENTS } from './core';
import { LEGAL_AGENTS } from './legal';
import { PREMIUM_AGENTS } from './premium';
import { HEALTHCARE_AGENTS } from './healthcare';
import { FINANCE_AGENTS } from './finance';
import { GOVERNMENT_AGENTS } from './government';
import { INSURANCE_AGENTS } from './insurance';
import { PHARMACEUTICAL_AGENTS } from './pharmaceutical';
import { MANUFACTURING_AGENTS } from './manufacturing';
import { ENERGY_AGENTS } from './energy';
import { TECHNOLOGY_AGENTS } from './technology';
import { RETAIL_AGENTS } from './retail';
import { REAL_ESTATE_AGENTS } from './real-estate';
import { TRANSPORTATION_AGENTS } from './transportation';
import { MEDIA_AGENTS } from './media';
import { PROFESSIONAL_SERVICES_AGENTS } from './professional-services';
import { EDUCATION_AGENTS } from './education';
import { SPORTS_AGENTS } from './sports';

// Filter out CLO from CORE_AGENTS since it's in LEGAL_AGENTS
const CORE_WITHOUT_CLO = CORE_AGENTS.filter(a => a.code !== 'clo');

// All vertical agents combined
export const VERTICAL_AGENTS = [
  ...LEGAL_AGENTS,
  ...HEALTHCARE_AGENTS,
  ...FINANCE_AGENTS,
  ...GOVERNMENT_AGENTS,
  ...INSURANCE_AGENTS,
  ...PHARMACEUTICAL_AGENTS,
  ...MANUFACTURING_AGENTS,
  ...ENERGY_AGENTS,
  ...TECHNOLOGY_AGENTS,
  ...RETAIL_AGENTS,
  ...REAL_ESTATE_AGENTS,
  ...TRANSPORTATION_AGENTS,
  ...MEDIA_AGENTS,
  ...PROFESSIONAL_SERVICES_AGENTS,
  ...EDUCATION_AGENTS,
  ...SPORTS_AGENTS,
];

// Complete agent registry
export const DOMAIN_AGENTS = [
  ...CORE_WITHOUT_CLO,
  ...VERTICAL_AGENTS,
  ...PREMIUM_AGENTS,
];
