// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// Community stub — enterprise implementation in datacendia-components

export const ChangeType = {
  POLICY: 'policy',
  PERSONNEL: 'personnel',
  TECHNOLOGY: 'technology',
  FINANCIAL: 'financial',
  STRATEGIC: 'strategic',
  OPERATIONAL: 'operational',
  COMPLIANCE: 'compliance',
  VENDOR: 'vendor',
} as const;
export type ChangeTypeValue = (typeof ChangeType)[keyof typeof ChangeType];

export const NodeType = {
  PERSON: 'person',
  TEAM: 'team',
  PRODUCT: 'product',
  METRIC: 'metric',
  VENDOR: 'vendor',
  CUSTOMER: 'customer',
  SYSTEM: 'system',
  PROCESS: 'process',
  POLICY: 'policy',
} as const;
export type NodeTypeValue = (typeof NodeType)[keyof typeof NodeType];

export const EdgeType = {
  MANAGES: 'manages',
  PRODUCES: 'produces',
  INFLUENCES: 'influences',
  DEPENDS_ON: 'depends_on',
  FUNDS: 'funds',
  TRIGGERS: 'triggers',
  CONSTRAINS: 'constrains',
} as const;
export type EdgeTypeValue = (typeof EdgeType)[keyof typeof EdgeType];

export interface Consequence {
  nodeId: string;
  nodeName: string;
  nodeType: string;
  category: string;
  order: number;
  severity: string;
  likelihood: string;
  riskScore: number;
  confidence: number;
  latencyDays: number;
  description: string;
  evidenceBasis: string;
  pathDescription: string;
}

export interface TimelineWave {
  date: string;
  effects: Array<{ nodeName: string; severity: string; category: string }>;
  directEffects?: string[];
}

export interface Mitigation {
  type: string;
  description: string;
  implementation: string;
  effectivenessScore: number;
}

export interface Guardrail {
  type: string;
  condition: string;
  action: string;
  threshold: string;
}

export interface ButterflyEffect {
  nodeName: string;
  description: string;
  pathDescription: string;
  latencyDays: number;
  order: number;
  severity: string;
}

export interface Alternative {
  description: string;
  riskDelta: number;
  tradeoffs: string[];
}

export interface CascadeReport {
  id: string;
  status: string;
  changeSpec: ChangeSpec;
  recommendation: string;
  rationale: string;
  totalRiskScore: number;
  consequences: Consequence[];
  mitigations: Mitigation[];
  guardrails: Guardrail[];
  requiredApprovals: string[];
  evidenceHash: string;
  signedBy: string | null;
  signedAt: string | null;
  orbitRunId: string;
  timestamp: string;
  timeline: {
    tZero: TimelineWave & { directEffects: string[] };
    tShort: TimelineWave;
    tMedium: TimelineWave;
    tLong: TimelineWave;
  };
  butterflyEffect: ButterflyEffect | null;
  alternatives?: Alternative[];
}

export interface OrbitRun {
  runId: string;
  sourceNodeId: string;
  changeDescription: string;
  totalNodesAffected: number;
  executionTimeMs: number;
  timestamp: string;
  [key: string]: any;
}

export interface GraphStats {
  nodeCount: number;
  edgeCount: number;
  avgDegree: number;
}

export interface GraphNode {
  id: string;
  type: string;
  name: string;
  metadata?: Record<string, any>;
  weight?: number;
  sensitivity?: number;
}

export interface GraphEdge {
  id: string;
  sourceId: string;
  targetId: string;
  type: string;
  strength: number;
  latencyDays?: number;
  bidirectional?: boolean;
}

export interface OrbitService {
  listRuns(): OrbitRun[];
  getRun(id: string): OrbitRun | null;
  runPropagation(sourceNodeId: string, changeDescription: string, initialImpact: number, config: Record<string, any>): Promise<any>;
  getCriticalNodes(topN: number): any[];
  findFeedbackLoops(maxLength: number): string[][];
}

export interface CendiaHorizonServiceInterface {
  getGraphStats(): GraphStats;
  listCascadeReports(): CascadeReport[];
  getCascadeReport(id: string): CascadeReport | null;
  analyzeChange(spec: ChangeSpec): Promise<CascadeReport>;
  updateCascadeReportStatus(id: string, status: string): void;
  signCascadeReport(id: string, signerId: string): Promise<void>;
  loadGraph(data: { nodes: GraphNode[]; edges: GraphEdge[] }): void;
  addNode(node: GraphNode): void;
  addEdge(edge: GraphEdge): void;
  getOrbitService(): OrbitService;
  createSimulation(spec: any): Promise<any>;
  getSimulation(id: string): any;
  getAllSimulations(): any[];
  getStatus(): any;
  getExpressForecast(question: string, opts?: any): Promise<any>;
}

const orbitProxy: OrbitService = new Proxy({} as OrbitService, {
  get: (_t: any, prop: string) => {
    if (prop === 'then') return undefined;
    return (..._args: any[]) => {
      if (prop === 'listRuns') return [];
      if (prop === 'getRun') return null;
      if (prop === 'getCriticalNodes') return [];
      if (prop === 'findFeedbackLoops') return [];
      return Promise.resolve({});
    };
  },
});

export const cendiaHorizonService: CendiaHorizonServiceInterface = new Proxy({} as CendiaHorizonServiceInterface, {
  get: (_t: any, prop: string) => {
    if (prop === 'then') return undefined;
    if (prop === 'getOrbitService') return () => orbitProxy;
    if (prop === 'listCascadeReports') return () => [];
    if (prop === 'getCascadeReport') return () => null;
    if (prop === 'getGraphStats') return () => ({ nodeCount: 0, edgeCount: 0, avgDegree: 0 });
    return (..._args: any[]) => Promise.resolve({});
  },
});

export class ChangeSpec {
  type!: string;
  title!: string;
  description!: string;
  affectedAssets!: string[];
  expectedBenefit?: string;
  proposedBy?: string;
  proposedAt?: string;
  constraints?: { noGoLines?: string[] };
  [key: string]: any;
}

export class TimeHorizon { [key: string]: any; }
