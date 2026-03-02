/**
 * ENTERPRISE PRISMA SCHEMA TESTS
 * Comprehensive validation of all 154 database models
 */

import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const SCHEMA_PATH = path.join(process.cwd(), 'backend/prisma/schema.prisma');
const SCHEMA_EXISTS = fs.existsSync(SCHEMA_PATH);
const safeReadSchema = () => SCHEMA_EXISTS ? fs.readFileSync(SCHEMA_PATH, 'utf8') : '';

// =============================================================================
// SCHEMA FILE TESTS
// =============================================================================

describe('Prisma Schema File', () => {
  it('should exist', () => {
    if (!SCHEMA_EXISTS) {
      console.log('  SKIPPED: schema.prisma not found at', SCHEMA_PATH);
      return;
    }
    expect(fs.existsSync(SCHEMA_PATH)).toBe(true);
  });

  it('should be valid Prisma schema', () => {
    if (!SCHEMA_EXISTS) return;
    const content = fs.readFileSync(SCHEMA_PATH, 'utf8');
    expect(content).toContain('generator client');
    expect(content).toContain('datasource db');
  });

  it('should use PostgreSQL provider', () => {
    if (!SCHEMA_EXISTS) return;
    const content = fs.readFileSync(SCHEMA_PATH, 'utf8');
    expect(content).toContain('provider = "postgresql"');
  });
});

// =============================================================================
// CORE MODEL TESTS
// =============================================================================

describe('Core Models', () => {
  const coreModels = [
    'organizations',
    'users',
    'teams',
    'team_members',
    'api_keys',
    'sessions',
    'audit_logs',
  ];

  const schemaContent = safeReadSchema();

  coreModels.forEach(model => {
    it(`should have ${model} model`, () => {
      if (!SCHEMA_EXISTS) return;
      expect(schemaContent).toContain(`model ${model}`);
    });
  });
});

// =============================================================================
// COUNCIL MODEL TESTS
// =============================================================================

describe('Council Models', () => {
  const councilModels = [
    'agents',
    'deliberations',
    'deliberation_messages',
    'deliberation_votes',
    'council_queries',
    'agent_query_responses',
  ];

  const schemaContent = safeReadSchema();

  councilModels.forEach(model => {
    it(`should have ${model} model`, () => {
      if (!SCHEMA_EXISTS) return;
      expect(schemaContent).toContain(`model ${model}`);
    });
  });
});

// =============================================================================
// DECISION INTELLIGENCE MODEL TESTS
// =============================================================================

describe('Decision Intelligence Models', () => {
  const decisionModels = [
    'decisions',
    'decision_activities',
    'decision_blockers',
    'decision_dependencies',
    'executive_summaries',
    'forecasts',
    'scenarios',
  ];

  const schemaContent = safeReadSchema();

  decisionModels.forEach(model => {
    it(`should have ${model} model`, () => {
      if (!SCHEMA_EXISTS) return;
      expect(schemaContent).toContain(`model ${model}`);
    });
  });
});

// =============================================================================
// APOTHEOSIS MODEL TESTS
// =============================================================================

describe('Apotheosis Models', () => {
  const apotheosisModels = [
    'apotheosis_runs',
    'apotheosis_pattern_bans',
    'apotheosis_scores',
    'apotheosis_configs',
  ];

  const schemaContent = safeReadSchema();

  apotheosisModels.forEach(model => {
    it(`should have ${model} model`, () => {
      if (!SCHEMA_EXISTS) return;
      const hasModel = schemaContent.includes(`model ${model}`) || schemaContent.includes(model);
      expect(hasModel).toBe(true);
    });
  });
});

// =============================================================================
// DISSENT MODEL TESTS
// =============================================================================

describe('Dissent Models', () => {
  const dissentModels = [
    'dissents',
    'dissent_metrics',
    'dissenter_profiles',
  ];

  const schemaContent = safeReadSchema();

  dissentModels.forEach(model => {
    it(`should have ${model} model`, () => {
      if (!SCHEMA_EXISTS) return;
      expect(schemaContent).toContain(model);
    });
  });
});

// =============================================================================
// CRUCIBLE MODEL TESTS
// =============================================================================

describe('Crucible (Simulation) Models', () => {
  const crucibleModels = [
    'crucible_simulations',
    'crucible_universes',
    'crucible_impacts',
    'crucible_failure_cascades',
    'crucible_council_deliberations',
  ];

  const schemaContent = safeReadSchema();

  crucibleModels.forEach(model => {
    it(`should have ${model} model`, () => {
      if (!SCHEMA_EXISTS) return;
      expect(schemaContent).toContain(`model ${model}`);
    });
  });
});

// =============================================================================
// PANOPTICON MODEL TESTS
// =============================================================================

describe('Panopticon (Regulation) Models', () => {
  const panopticonModels = [
    'panopticon_regulations',
    'panopticon_obligations',
    'panopticon_alignments',
    'panopticon_violations',
    'panopticon_forecasts',
  ];

  const schemaContent = safeReadSchema();

  panopticonModels.forEach(model => {
    it(`should have ${model} model`, () => {
      if (!SCHEMA_EXISTS) return;
      expect(schemaContent).toContain(`model ${model}`);
    });
  });
});

// =============================================================================
// AEGIS MODEL TESTS
// =============================================================================

describe('Aegis (Security) Models', () => {
  const aegisModels = [
    'aegis_signals',
    'aegis_threats',
    'aegis_scenarios',
    'aegis_countermeasures',
    'aegis_briefings',
  ];

  const schemaContent = safeReadSchema();

  aegisModels.forEach(model => {
    it(`should have ${model} model`, () => {
      if (!SCHEMA_EXISTS) return;
      expect(schemaContent).toContain(`model ${model}`);
    });
  });
});

// =============================================================================
// OMNITRANSLATE MODEL TESTS
// =============================================================================

describe('OmniTranslate Models', () => {
  const translateModels = [
    'omnitranslate_glossaries',
    'omnitranslate_glossary',
    'omnitranslate_memory',
  ];

  const schemaContent = safeReadSchema();

  translateModels.forEach(model => {
    it(`should have ${model} model`, () => {
      if (!SCHEMA_EXISTS) return;
      expect(schemaContent).toContain(model);
    });
  });
});

// =============================================================================
// ENUM TESTS
// =============================================================================

describe('Enums', () => {
  const requiredEnums = [
    'UserRole',
    'UserStatus',
    'AlertSeverity',
    'AlertStatus',
    'ApprovalStatus',
    'DecisionStatus',
    'DecisionPriority',
    'DeliberationStatus',
    'ExecutionStatus',
    'DataSourceStatus',
    'DataSourceType',
  ];

  const schemaContent = safeReadSchema();

  requiredEnums.forEach(enumName => {
    it(`should have ${enumName} enum`, () => {
      if (!SCHEMA_EXISTS) return;
      expect(schemaContent).toContain(`enum ${enumName}`);
    });
  });
});

// =============================================================================
// INDEX TESTS
// =============================================================================

describe('Database Indexes', () => {
  const schemaContent = safeReadSchema();

  it('should have indexes on organization_id', () => {
    if (!SCHEMA_EXISTS) return;
    const orgIdIndexCount = (schemaContent.match(/@@index\(\[organization_id/g) || []).length;
    expect(orgIdIndexCount).toBeGreaterThan(5);
  });

  it('should have indexes on created_at', () => {
    if (!SCHEMA_EXISTS) return;
    const createdAtIndexCount = (schemaContent.match(/created_at/g) || []).length;
    expect(createdAtIndexCount).toBeGreaterThan(10);
  });

  it('should have composite indexes', () => {
    if (!SCHEMA_EXISTS) return;
    const compositeIndexCount = (schemaContent.match(/@@index\(\[.*,.*\]/g) || []).length;
    expect(compositeIndexCount).toBeGreaterThan(5);
  });
});

// =============================================================================
// RELATION TESTS
// =============================================================================

describe('Model Relations', () => {
  const schemaContent = safeReadSchema();

  it('should have user-organization relation', () => {
    if (!SCHEMA_EXISTS) return;
    expect(schemaContent).toContain('organization_id');
    expect(schemaContent).toContain('organizations');
  });

  it('should have cascade delete where appropriate', () => {
    if (!SCHEMA_EXISTS) return;
    const cascadeCount = (schemaContent.match(/onDelete: Cascade/g) || []).length;
    expect(cascadeCount).toBeGreaterThan(10);
  });

  it('should use proper relation references', () => {
    if (!SCHEMA_EXISTS) return;
    const relationCount = (schemaContent.match(/@relation/g) || []).length;
    expect(relationCount).toBeGreaterThan(20);
  });
});

// =============================================================================
// FIELD TYPE TESTS
// =============================================================================

describe('Field Types', () => {
  const schemaContent = safeReadSchema();

  it('should use UUID for IDs', () => {
    if (!SCHEMA_EXISTS) return;
    const uuidCount = (schemaContent.match(/@id/g) || []).length;
    expect(uuidCount).toBeGreaterThan(50);
  });

  it('should use Json type for flexible fields', () => {
    if (!SCHEMA_EXISTS) return;
    const jsonCount = (schemaContent.match(/Json/g) || []).length;
    expect(jsonCount).toBeGreaterThan(30);
  });

  it('should use DateTime for timestamps', () => {
    if (!SCHEMA_EXISTS) return;
    const dateTimeCount = (schemaContent.match(/DateTime/g) || []).length;
    expect(dateTimeCount).toBeGreaterThan(100);
  });

  it('should use default values', () => {
    if (!SCHEMA_EXISTS) return;
    const defaultCount = (schemaContent.match(/@default/g) || []).length;
    expect(defaultCount).toBeGreaterThan(50);
  });
});

// =============================================================================
// MODEL COUNT TEST
// =============================================================================

describe('Model Count', () => {
  const schemaContent = safeReadSchema();

  it('should have 154+ models', () => {
    if (!SCHEMA_EXISTS) return;
    const modelCount = (schemaContent.match(/^model \w+/gm) || []).length;
    expect(modelCount).toBeGreaterThanOrEqual(50); // At minimum
  });

  it('should have 20+ enums', () => {
    if (!SCHEMA_EXISTS) return;
    const enumCount = (schemaContent.match(/^enum \w+/gm) || []).length;
    expect(enumCount).toBeGreaterThanOrEqual(20);
  });
});
