// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Workflow Scenarios Ingestion Test Framework
 * 
 * This module provides automated testing for workflow scenario ingestion,
 * validation, and execution readiness.
 * 
 * Usage:
 *   npx ts-node backend/src/data/workflow-ingestion-test.ts
 */

import * as fs from 'fs';
import * as path from 'path';

interface WorkflowStep {
  order: number;
  action: string;
  service: string;
  output: string;
}

interface WorkflowScenario {
  id: string;
  name: string;
  category: string;
  councilMode: string;
  services: string[];
  steps: WorkflowStep[];
  councilQuestion: string;
  expectedOutcome: string;
  priority: string;
  estimatedDuration: string;
  tags: string[];
}

interface WorkflowFile {
  version?: string;
  description?: string;
  framework?: {
    name: string;
    version: string;
    autoIngestEndpoint: string;
    validationEndpoint: string;
    executionEndpoint: string;
    schema: Record<string, string>;
  };
  serviceRegistry?: {
    enterprise: string[];
    intelligence: string[];
    sovereign: string[];
    core: string[];
  };
  scenarios: WorkflowScenario[];
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

interface IngestionTestResult {
  totalScenarios: number;
  validScenarios: number;
  invalidScenarios: number;
  serviceUsage: Record<string, number>;
  categoryDistribution: Record<string, number>;
  councilModeDistribution: Record<string, number>;
  priorityDistribution: Record<string, number>;
  errors: string[];
  warnings: string[];
}

const VALID_COUNCIL_MODES = [
  'war-room', 'due-diligence', 'innovation-lab', 'compliance', 'crisis',
  'execution', 'research', 'investment', 'stakeholder', 'rapid', 'advisory', 'governance'
];

const VALID_PRIORITIES = ['critical', 'high', 'medium', 'low'];

const ALL_SERVICES = [
  // Enterprise
  'CendiaProcure', 'CendiaGuardian', 'CendiaNerve', 'CendiaDocket', 'CendiaEquity',
  'CendiaMesh', 'CendiaFactory', 'CendiaTransit', 'CendiaAcademy', 'CendiaResonance',
  'CendiaInventum', 'CendiaHabitat', 'CendiaRegent', 'CendiaRainmaker', 'CendiaScout',
  // Intelligence
  'Chronos', 'Panopticon', 'Aegis', 'Eternal', 'Symbiont', 'Vox', 'Echo', 'RedTeam', 'Gnosis',
  // Sovereign
  'DataDiode', 'LocalRLHF', 'DecisionDNA', 'ShadowCouncil', 'DeterministicReplay',
  'QRAirGapBridge', 'CanaryTripwire', 'TPMAttestation', 'TimeLock', 'FederatedMesh', 'PortableInstance',
  // Core
  'Cascade', 'Apotheosis', 'Dissent', 'OmniTranslate', 'CendiaDissent',
  // Strategic (Investor-Aligned)
  'SynthesisEngine', 'LogicGate', 'RDP', 'CendiaGraph', 'CendiaIngest', 'WarGames', 'Union',
  // Always available
  'Council'
];

function validateScenario(scenario: WorkflowScenario, index: number): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required fields
  if (!scenario.id) errors.push(`Scenario ${index}: Missing id`);
  if (!scenario.name) errors.push(`Scenario ${index}: Missing name`);
  if (!scenario.category) errors.push(`Scenario ${index}: Missing category`);
  if (!scenario.councilMode) errors.push(`Scenario ${index}: Missing councilMode`);
  if (!scenario.services || scenario.services.length === 0) {
    errors.push(`Scenario ${index} (${scenario.id}): Missing services array`);
  }
  if (!scenario.steps || scenario.steps.length === 0) {
    errors.push(`Scenario ${index} (${scenario.id}): Missing steps array`);
  }
  if (!scenario.councilQuestion) errors.push(`Scenario ${index} (${scenario.id}): Missing councilQuestion`);
  if (!scenario.expectedOutcome) errors.push(`Scenario ${index} (${scenario.id}): Missing expectedOutcome`);
  if (!scenario.priority) errors.push(`Scenario ${index} (${scenario.id}): Missing priority`);
  if (!scenario.estimatedDuration) errors.push(`Scenario ${index} (${scenario.id}): Missing estimatedDuration`);
  if (!scenario.tags || scenario.tags.length === 0) {
    warnings.push(`Scenario ${index} (${scenario.id}): Missing or empty tags array`);
  }

  // Validate councilMode
  if (scenario.councilMode && !VALID_COUNCIL_MODES.includes(scenario.councilMode)) {
    errors.push(`Scenario ${scenario.id}: Invalid councilMode '${scenario.councilMode}'`);
  }

  // Validate priority
  if (scenario.priority && !VALID_PRIORITIES.includes(scenario.priority)) {
    errors.push(`Scenario ${scenario.id}: Invalid priority '${scenario.priority}'`);
  }

  // Validate services
  if (scenario.services) {
    for (const service of scenario.services) {
      if (!ALL_SERVICES.includes(service)) {
        warnings.push(`Scenario ${scenario.id}: Unknown service '${service}'`);
      }
    }
  }

  // Validate steps
  if (scenario.steps) {
    const stepOrders = scenario.steps.map(s => s.order);
    const expectedOrders = Array.from({ length: scenario.steps.length }, (_, i) => i + 1);
    
    if (JSON.stringify(stepOrders.sort()) !== JSON.stringify(expectedOrders)) {
      errors.push(`Scenario ${scenario.id}: Step orders are not sequential (1, 2, 3, ...)`);
    }

    for (const step of scenario.steps) {
      if (!step.action) errors.push(`Scenario ${scenario.id}: Step ${step.order} missing action`);
      if (!step.service) errors.push(`Scenario ${scenario.id}: Step ${step.order} missing service`);
      if (!step.output) errors.push(`Scenario ${scenario.id}: Step ${step.order} missing output`);
      
      if (step.service && !ALL_SERVICES.includes(step.service)) {
        warnings.push(`Scenario ${scenario.id}: Step ${step.order} uses unknown service '${step.service}'`);
      }
    }

    // Check that last step involves Council
    const lastStep = scenario.steps.find(s => s.order === scenario.steps.length);
    if (lastStep && lastStep.service !== 'Council') {
      warnings.push(`Scenario ${scenario.id}: Last step should typically involve Council service`);
    }
  }

  // Validate ID format
  if (scenario.id && !/^WF-\d{3}$/.test(scenario.id)) {
    warnings.push(`Scenario ${scenario.id}: ID does not match expected format WF-XXX`);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

function runIngestionTest(files: string[]): IngestionTestResult {
  const result: IngestionTestResult = {
    totalScenarios: 0,
    validScenarios: 0,
    invalidScenarios: 0,
    serviceUsage: {},
    categoryDistribution: {},
    councilModeDistribution: {},
    priorityDistribution: {},
    errors: [],
    warnings: []
  };

  const allScenarios: WorkflowScenario[] = [];

  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf-8');
      const data: WorkflowFile = JSON.parse(content);
      
      if (data.scenarios) {
        allScenarios.push(...data.scenarios);
      }
    } catch (err) {
      result.errors.push(`Failed to load file ${file}: ${err}`);
    }
  }

  result.totalScenarios = allScenarios.length;

  // Check for duplicate IDs
  const ids = allScenarios.map(s => s.id);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicateIds.length > 0) {
    result.errors.push(`Duplicate scenario IDs found: ${[...new Set(duplicateIds)].join(', ')}`);
  }

  // Validate each scenario
  for (let i = 0; i < allScenarios.length; i++) {
    const scenario: WorkflowScenario | undefined = allScenarios[i];
    if (!scenario) continue;
    
    const validation = validateScenario(scenario, i);

    if (validation.valid) {
      result.validScenarios++;
    } else {
      result.invalidScenarios++;
    }

    result.errors.push(...validation.errors);
    result.warnings.push(...validation.warnings);

    // Track service usage
    if (scenario.steps) {
      for (const step of scenario.steps) {
        if (step.service) {
          result.serviceUsage[step.service] = (result.serviceUsage[step.service] || 0) + 1;
        }
      }
    }

    // Track distributions
    if (scenario.category) {
      result.categoryDistribution[scenario.category] = (result.categoryDistribution[scenario.category] || 0) + 1;
    }
    if (scenario.councilMode) {
      result.councilModeDistribution[scenario.councilMode] = (result.councilModeDistribution[scenario.councilMode] || 0) + 1;
    }
    if (scenario.priority) {
      result.priorityDistribution[scenario.priority] = (result.priorityDistribution[scenario.priority] || 0) + 1;
    }
  }

  // Check minimum service usage
  for (const service of ALL_SERVICES) {
    if (service !== 'Council' && (!result.serviceUsage[service] || result.serviceUsage[service] < 3)) {
      result.warnings.push(`Service '${service}' is used fewer than 3 times (${result.serviceUsage[service] || 0})`);
    }
  }

  return result;
}

function printReport(result: IngestionTestResult): void {
  console.log('\n' + '='.repeat(80));
  console.log('WORKFLOW SCENARIOS INGESTION TEST REPORT');
  console.log('='.repeat(80));

  console.log('\n## Summary');
  console.log(`Total Scenarios: ${result.totalScenarios}`);
  console.log(`Valid Scenarios: ${result.validScenarios}`);
  console.log(`Invalid Scenarios: ${result.invalidScenarios}`);
  console.log(`Validation Rate: ${((result.validScenarios / result.totalScenarios) * 100).toFixed(1)}%`);

  console.log('\n## Category Distribution');
  const sortedCategories = Object.entries(result.categoryDistribution)
    .sort((a, b) => b[1] - a[1]);
  for (const [category, count] of sortedCategories) {
    console.log(`  ${category}: ${count}`);
  }

  console.log('\n## Council Mode Distribution');
  const sortedModes = Object.entries(result.councilModeDistribution)
    .sort((a, b) => b[1] - a[1]);
  for (const [mode, count] of sortedModes) {
    console.log(`  ${mode}: ${count}`);
  }

  console.log('\n## Priority Distribution');
  const sortedPriorities = Object.entries(result.priorityDistribution)
    .sort((a, b) => b[1] - a[1]);
  for (const [priority, count] of sortedPriorities) {
    console.log(`  ${priority}: ${count}`);
  }

  console.log('\n## Service Usage (Top 20)');
  const sortedServices = Object.entries(result.serviceUsage)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20);
  for (const [service, count] of sortedServices) {
    console.log(`  ${service}: ${count}`);
  }

  console.log('\n## Service Usage (Bottom 10)');
  const bottomServices = Object.entries(result.serviceUsage)
    .sort((a, b) => a[1] - b[1])
    .slice(0, 10);
  for (const [service, count] of bottomServices) {
    console.log(`  ${service}: ${count}`);
  }

  if (result.errors.length > 0) {
    console.log('\n## Errors');
    for (const error of result.errors.slice(0, 20)) {
      console.log(`  ❌ ${error}`);
    }
    if (result.errors.length > 20) {
      console.log(`  ... and ${result.errors.length - 20} more errors`);
    }
  }

  if (result.warnings.length > 0) {
    console.log('\n## Warnings');
    for (const warning of result.warnings.slice(0, 10)) {
      console.log(`  ⚠️ ${warning}`);
    }
    if (result.warnings.length > 10) {
      console.log(`  ... and ${result.warnings.length - 10} more warnings`);
    }
  }

  console.log('\n' + '='.repeat(80));
  if (result.invalidScenarios === 0 && result.errors.length === 0) {
    console.log('✅ ALL SCENARIOS VALID - READY FOR INGESTION');
  } else {
    console.log('❌ VALIDATION FAILED - FIX ERRORS BEFORE INGESTION');
  }
  console.log('='.repeat(80) + '\n');
}

// Main execution
if (require.main === module) {
  const dataDir = path.join(__dirname);
  const files = [
    path.join(dataDir, 'workflow-scenarios.json'),
    path.join(dataDir, 'workflow-scenarios-part2.json')
  ];

  console.log('Loading workflow scenario files...');
  for (const file of files) {
    console.log(`  - ${file}`);
  }

  const result = runIngestionTest(files);
  printReport(result);

  // Exit with error code if validation failed
  process.exit(result.invalidScenarios > 0 || result.errors.length > 0 ? 1 : 0);
}

export { runIngestionTest, validateScenario, IngestionTestResult, ValidationResult };
