// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Vertical Services Index
 * 
 * Universal Pattern: Build one pattern, repeat it.
 * Legal proves this. Everything else copies it.
 * 
 * Datacendia is not an AI platform. It is decision infrastructure.
 * 
 * 6-Layer Completion Standard:
 * 1. Authoritative Data Connectors
 * 2. Vertical Knowledge Base (RAG) with provenance
 * 3. Compliance & Liability Mapping (machine-enforced)
 * 4. Decision Schemas (industry-specific objects)
 * 5. Agent Presets (tied to workflows, not personas)
 * 6. Externally Defensible Outputs (regulator/court/auditor ready)
 */

// Core Pattern (6 layers)
export * from './core/VerticalPattern.js';

// Financial Services Vertical (Target: 100%)
export * from './financial/FinancialVertical.js';
export * as financialCouncilModes from './financial/FinancialCouncilModes.js';

// Healthcare Vertical (Target: 80%)
export * from './healthcare/HealthcareVertical.js';
export * as healthcareCouncilModes from './healthcare/HealthcareCouncilModes.js';

// Insurance Vertical (Target: 80%)
// Note: Static re-exports kept — verticals/insurance/ is community code.
// The enterprise services/insurance/ (per-decision liability) is a separate directory.
export * from './insurance/InsuranceVertical.js';
export * as insuranceCouncilModes from './insurance/InsuranceCouncilModes.js';

// Energy & Utilities Vertical (Target: 80%)
export * from './energy/EnergyVertical.js';
export * as energyCouncilModes from './energy/EnergyCouncilModes.js';

// Government / Public Sector Vertical (Target: 85%)
export * from './government/GovernmentAgents.js';
export * as governmentCouncilModes from './government/GovernmentCouncilModes.js';

// Manufacturing Vertical (Target: 85%)
export * from './manufacturing/ManufacturingAgents.js';
export * as manufacturingCouncilModes from './manufacturing/ManufacturingCouncilModes.js';

// Technology / SaaS Vertical (Target: 85%)
export * from './technology/TechnologyAgents.js';
export * as technologyCouncilModes from './technology/TechnologyCouncilModes.js';

// Retail Vertical (Target: 85%)
export * from './retail/RetailAgents.js';
export * as retailCouncilModes from './retail/RetailCouncilModes.js';

// Education Vertical (Target: 85%)
export * from './education/EducationAgents.js';
export * as educationCouncilModes from './education/EducationCouncilModes.js';

// Real Estate Vertical (Target: 85%)
export * from './realestate/RealEstateAgents.js';
export * as realEstateCouncilModes from './realestate/RealEstateCouncilModes.js';

// Smart City Vertical (Target: 85%)
export * from './smartcity/SmartCityAgents.js';
export * as smartCityCouncilModes from './smartcity/SmartCityCouncilModes.js';

// Vertical Sentinel Meta-Agents
export * from './meta/VerticalSentinelService.js';

// EU Banking Compliance (Basel III + EU AI Act)
export * from './eu-banking/index.js';

// Internal Dogfooding (Datacendia-for-Datacendia)
export * from './internal/DatacendiaInternalService.js';

// Re-export default instances
export { default as financialVertical } from './financial/FinancialVertical.js';
export { default as healthcareVertical } from './healthcare/HealthcareVertical.js';
export { default as insuranceVertical } from './insurance/InsuranceVertical.js';  // verticals/insurance/ is community code
export { default as energyVertical } from './energy/EnergyVertical.js';
export { default as verticalSentinelService } from './meta/VerticalSentinelService.js';
export { default as datacendiaInternalService } from './internal/DatacendiaInternalService.js';
