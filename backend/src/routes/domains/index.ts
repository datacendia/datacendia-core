/**
 * Domain Router — Index
 *
 * Aggregated route group that mounts related API endpoints under a single domain prefix.
 * @module routes/domains/index
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// DOMAIN ROUTERS - Barrel Export
// Groups 110+ routes into 14 logical domains
// =============================================================================

export { default as authDomain } from './auth.domain.js';
export { default as councilDomain } from './council.domain.js';
export { default as dataDomain } from './data.domain.js';
export { default as governanceDomain } from './governance.domain.js';
export { default as securityDomain } from './security.domain.js';
export { default as sovereignDomain } from './sovereign.domain.js';
export { default as enterpriseDomain } from './enterprise.domain.js';
export { default as legalDomain } from './legal.domain.js';
export { default as verticalsDomain } from './verticals.domain.js';
export { default as platformDomain } from './platform.domain.js';
export { default as simulationDomain } from './simulation.domain.js';
export { default as workflowsDomain } from './workflows.domain.js';
export { default as intelligenceDomain } from './intelligence.domain.js';
export { default as demoDomain } from './demo.domain.js';
