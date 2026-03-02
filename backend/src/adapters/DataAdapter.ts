/**
 * Data Adapter — Data Adapter
 *
 * Data transformation adapter between internal and external formats.
 *
 * @exports exampleSchemaMapping, DataAdapter, ApotheosisDataAdapter, DissentDataAdapter, OrganizationDataConfig, SchemaMapping, DataStorageMode
 * @module adapters/DataAdapter
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// DATA ADAPTER INTERFACE
// Abstract interface for all data operations - allows connecting to any database
// without storing data on Datacendia infrastructure
// =============================================================================

import { 
  ApotheosisRun, 
  ApotheosisConfig, 
  ApotheosisScore,
  Escalation,
  PatternBan,
  UpskillAssignment,
  WeaknessItem,
  AutoPatch
} from '../services/CendiaApotheosisService.js';

import {
  Dissent,
  DissentResponse,
  DissenterProfile,
  OrganizationDissentMetrics
} from '../services/CendiaDissentService.js';

// =============================================================================
// CORE ADAPTER INTERFACE
// =============================================================================

export interface DataAdapter {
  readonly type: 'datacendia' | 'client-hosted' | 'hybrid';
  readonly organizationId: string;
  
  // Connection management
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  healthCheck(): Promise<boolean>;
  
  // Apotheosis operations
  apotheosis: ApotheosisDataAdapter;
  
  // Dissent operations
  dissent: DissentDataAdapter;
  
  // Generic query (for advanced use cases)
  rawQuery<T>(query: string, params?: unknown[]): Promise<T>;
}

export interface ApotheosisDataAdapter {
  // Runs
  storeRun(run: ApotheosisRun): Promise<void>;
  getLatestRun(): Promise<ApotheosisRun | null>;
  getRunHistory(limit: number): Promise<ApotheosisRun[]>;
  getRunById(runId: string): Promise<ApotheosisRun | null>;
  
  // Weaknesses
  storeWeaknesses(runId: string, weaknesses: WeaknessItem[]): Promise<void>;
  getWeaknesses(runId: string): Promise<WeaknessItem[]>;
  updateWeaknessStatus(weaknessId: string, status: WeaknessItem['status']): Promise<void>;
  
  // Escalations
  storeEscalations(runId: string, escalations: Escalation[]): Promise<void>;
  getPendingEscalations(): Promise<Escalation[]>;
  respondToEscalation(escalationId: string, response: string, status: Escalation['status']): Promise<void>;
  
  // Auto Patches
  storeAutoPatches(runId: string, patches: AutoPatch[]): Promise<void>;
  getAutoPatches(runId: string): Promise<AutoPatch[]>;
  
  // Upskill Assignments
  storeUpskillAssignments(runId: string, assignments: UpskillAssignment[]): Promise<void>;
  getUpskillAssignments(): Promise<UpskillAssignment[]>;
  updateUpskillProgress(assignmentId: string, progress: number, status: UpskillAssignment['status']): Promise<void>;
  
  // Pattern Bans
  storeBannedPatterns(patterns: PatternBan[]): Promise<void>;
  getBannedPatterns(): Promise<PatternBan[]>;
  liftPatternBan(patternId: string): Promise<void>;
  
  // Configuration
  getConfig(): Promise<ApotheosisConfig>;
  updateConfig(config: Partial<ApotheosisConfig>): Promise<ApotheosisConfig>;
  
  // Scores
  storeScore(score: ApotheosisScore): Promise<void>;
  getScore(): Promise<ApotheosisScore>;
  getScoreHistory(days: number): Promise<Array<{ date: string; score: number }>>;
}

export interface DissentDataAdapter {
  // Dissents
  fileDissent(dissent: Dissent): Promise<Dissent>;
  getDissents(options?: { status?: string; userId?: string; limit?: number }): Promise<Dissent[]>;
  getDissentById(dissentId: string): Promise<Dissent | null>;
  
  // Responses
  respondToDissent(dissentId: string, response: DissentResponse): Promise<Dissent>;
  
  // Outcome verification
  verifyOutcome(dissentId: string, wasCorrect: boolean): Promise<void>;
  
  // Profiles
  getDissenterProfile(userId: string): Promise<DissenterProfile>;
  
  // Metrics
  getOrganizationMetrics(): Promise<OrganizationDissentMetrics>;
}

// =============================================================================
// DATA STORAGE MODE
// =============================================================================

export type DataStorageMode = 
  | 'datacendia-hosted'      // Data stored on Datacendia infrastructure
  | 'client-hosted'          // Data stored only on client infrastructure (zero-copy)
  | 'hybrid-sync'            // Data synced between client and Datacendia
  | 'hybrid-cache';          // Client is source of truth, Datacendia caches for performance

export interface OrganizationDataConfig {
  organizationId: string;
  storageMode: DataStorageMode;
  
  // Client database connection (for client-hosted or hybrid modes)
  clientDatabase?: {
    type: 'postgresql' | 'mysql' | 'sqlserver' | 'oracle' | 'mongodb' | 'dynamodb' | 'db2';
    connectionString?: string;
    host?: string;
    port?: number;
    database?: string;
    username?: string;
    password?: string; // Production upgrade: use secrets manager
    ssl?: boolean;
    
    // Schema mapping for existing databases
    schemaMapping?: SchemaMapping;
  };
  
  // Sync configuration (for hybrid modes)
  syncConfig?: {
    direction: 'bidirectional' | 'client-to-datacendia' | 'datacendia-to-client';
    frequency: 'realtime' | 'hourly' | 'daily';
    conflictResolution: 'client-wins' | 'datacendia-wins' | 'latest-wins';
  };
  
  // Data retention (for compliance)
  retention?: {
    enabled: boolean;
    days: number;
    deleteFromDatacendia: boolean;
  };
}

// =============================================================================
// SCHEMA MAPPING
// For clients with existing databases, map their schema to Datacendia models
// =============================================================================

export interface SchemaMapping {
  // Table name mappings
  tables: {
    apotheosis_runs?: string;       // e.g., "risk_assessments"
    apotheosis_weaknesses?: string; // e.g., "vulnerabilities"
    apotheosis_escalations?: string;
    dissents?: string;              // e.g., "formal_objections"
    dissent_responses?: string;
    // ... etc
  };
  
  // Column name mappings per table
  columns: {
    [tableName: string]: {
      [datacendiaColumn: string]: string;  // datacendia_name -> client_name
    };
  };
  
  // Value transformations
  transforms?: {
    [tableName: string]: {
      [column: string]: {
        toClient: (value: unknown) => unknown;
        fromClient: (value: unknown) => unknown;
      };
    };
  };
}

// =============================================================================
// EXAMPLE SCHEMA MAPPING
// =============================================================================

export const exampleSchemaMapping: SchemaMapping = {
  tables: {
    apotheosis_runs: 'security_assessments',
    apotheosis_weaknesses: 'vulnerabilities',
    apotheosis_escalations: 'executive_reviews',
    dissents: 'formal_disagreements',
  },
  columns: {
    security_assessments: {
      id: 'assessment_id',
      organization_id: 'company_id',
      started_at: 'start_time',
      completed_at: 'end_time',
      scenarios_tested: 'test_count',
      apotheosis_score: 'risk_score',
    },
    vulnerabilities: {
      id: 'vuln_id',
      title: 'name',
      severity: 'priority',
      damage_estimate: 'potential_loss',
    },
    formal_disagreements: {
      id: 'objection_id',
      statement: 'objection_text',
      dissenter_id: 'employee_id',
      severity: 'urgency_level',
    },
  },
  transforms: {
    security_assessments: {
      // Client uses 1-100 scale, we use 0-100
      risk_score: {
        toClient: (v) => v,
        fromClient: (v) => v,
      },
    },
    vulnerabilities: {
      // Client uses "P1/P2/P3", we use "critical/high/medium"
      priority: {
        toClient: (v) => {
          const map: Record<string, string> = { critical: 'P1', high: 'P2', medium: 'P3', low: 'P4' };
          return map[v as string] || 'P4';
        },
        fromClient: (v) => {
          const map: Record<string, string> = { P1: 'critical', P2: 'high', P3: 'medium', P4: 'low' };
          return map[v as string] || 'low';
        },
      },
    },
  },
};
