import crypto from 'crypto';
import type { PIIScanResult, PIIType } from './PIIDetector';

export interface GatewayProvider {
  id: string;
  name: string;
  baseUrl: string;
  authHeader: string; // e.g., 'Authorization' or 'x-api-key'
  authPrefix: string; // e.g., 'Bearer ' or ''
  models: string[];
  costPer1kPromptTokens: number;
  costPer1kResponseTokens: number;
}

export interface GatewayPolicy {
  id: string;
  name: string;
  enabled: boolean;
  priority: number;
  departments: string[];
  blockPIITypes: PIIType[];
  redactPIITypes: PIIType[];
  blockKeywords: string[];
  maxPromptLength?: number;
  defaultAction: 'allow' | 'warn' | 'redact' | 'block';
  notifyOnBlock: boolean;
  notifyEmail?: string;
}

export interface GatewayRequest {
  provider: string;
  model: string;
  endpoint: string;
  method: string;
  headers: Record<string, string>;
  body: any;
  userId: string;
  userEmail: string;
  userDepartment: string;
  organizationId: string;
}

export interface GatewayResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: any;
  promptText: string;
  responseText: string;
  promptTokens: number;
  responseTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
}

export interface GatewayInteraction {
  id: string;
  request: GatewayRequest;
  response?: GatewayResponse;
  piiScan: PIIScanResult;
  policyAction: 'allow' | 'warn' | 'redact' | 'block';
  policyReason?: string;
  policyId?: string;
  integrityHash: string;
  signature: string;
  ledgerEntryIndex?: number;
  latencyMs: number;
  providerLatencyMs: number;
  requestedAt: Date;
  respondedAt?: Date;
}

export interface GatewayStats {
  totalInteractions: number;
  totalTokens: number;
  totalCostUsd: number;
  piiDetections: number;
  piiBlocks: number;
  piiRedactions: number;
  policyBlocks: number;
  policyWarnings: number;
  byProvider: Record<string, { count: number; tokens: number; costUsd: number }>;
  byModel: Record<string, { count: number; tokens: number; costUsd: number }>;
  byDepartment: Record<string, { count: number; tokens: number; costUsd: number }>;
  byUser: Record<string, { count: number; tokens: number; costUsd: number }>;
  topPIITypes: Array<{ type: string; count: number }>;
  recentInteractions: GatewayInteraction[];
}

/**
 * The Governance Receipt™ — the printable, cryptographically verified artifact
 * that a CISO hands to a regulator proving every AI interaction was governed.
 *
 * Exported as both `GovernanceReceipt` (preferred) and `AIManifest` (legacy alias).
 */
export interface AIManifest {
  id: string;
  organizationId: string;
  organizationName: string;
  generatedAt: Date;
  generatedBy: string;
  periodStart: Date;
  periodEnd: Date;
  formatVersion: string;

  // Summary
  summary: {
    totalInteractions: number;
    totalUsers: number;
    totalDepartments: number;
    totalProviders: number;
    totalModels: number;
    totalTokens: number;
    totalCostUsd: number;
  };

  // PII governance
  piiGovernance: {
    totalDetections: number;
    totalBlocks: number;
    totalRedactions: number;
    byType: Array<{ type: string; count: number; action: string }>;
  };

  // Policy enforcement
  policyEnforcement: {
    totalBlocks: number;
    totalWarnings: number;
    activePolicies: number;
    byPolicy: Array<{ name: string; blocks: number; warnings: number }>;
  };

  // Department breakdown
  departments: Array<{
    name: string;
    users: number;
    interactions: number;
    tokens: number;
    costUsd: number;
    piiDetections: number;
    topModels: string[];
  }>;

  // Cryptographic proof
  integrity: {
    merkleRoot: string;
    integrityHash: string;
    signature: string;
    entriesVerified: number;
    chainIntact: boolean;
    algorithm: string;
    signedAt: Date;
  };

  // Compliance
  compliance: {
    euAiActArticle26: boolean; // Supports defensible posture under deployer monitoring obligations
    gdprArticle35: boolean; // DPIA conducted
    hipaaPhiProtection: boolean; // PHI detected and governed
    sox302Documentation: boolean; // Adequate internal controls documented
  };
}

/** Preferred name — The Governance Receipt™. `AIManifest` remains for backwards compatibility. */
export type GovernanceReceipt = AIManifest;

// =============================================================================
// PROVIDER CONFIGURATIONS
// =============================================================================

export const DEFAULT_PROVIDERS: GatewayProvider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    baseUrl: 'https://api.openai.com',
    authHeader: 'Authorization',
    authPrefix: 'Bearer ',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo', 'o1', 'o1-mini', 'o3-mini'],
    costPer1kPromptTokens: 0.005,
    costPer1kResponseTokens: 0.015,
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    baseUrl: 'https://api.anthropic.com',
    authHeader: 'x-api-key',
    authPrefix: '',
    models: ['claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022', 'claude-3-opus-20240229'],
    costPer1kPromptTokens: 0.003,
    costPer1kResponseTokens: 0.015,
  },
  {
    id: 'google',
    name: 'Google AI',
    baseUrl: 'https://generativelanguage.googleapis.com',
    authHeader: 'x-goog-api-key',
    authPrefix: '',
    models: ['gemini-2.0-flash', 'gemini-1.5-pro', 'gemini-1.5-flash'],
    costPer1kPromptTokens: 0.00125,
    costPer1kResponseTokens: 0.005,
  },
  {
    id: 'ollama',
    name: 'Ollama (Local)',
    baseUrl: 'http://localhost:11434',
    authHeader: '',
    authPrefix: '',
    models: ['llama3.1', 'mistral', 'codellama', 'phi3'],
    costPer1kPromptTokens: 0,
    costPer1kResponseTokens: 0,
  },
  {
    id: 'azure-openai',
    name: 'Azure OpenAI',
    baseUrl: process.env['AZURE_OPENAI_ENDPOINT'] || 'https://your-resource.openai.azure.com',
    authHeader: 'api-key',
    authPrefix: '',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-4', 'gpt-35-turbo'],
    costPer1kPromptTokens: 0.005,
    costPer1kResponseTokens: 0.015,
  },
  {
    id: 'bedrock',
    name: 'AWS Bedrock',
    baseUrl: process.env['AWS_BEDROCK_ENDPOINT'] || 'https://bedrock-runtime.us-east-1.amazonaws.com',
    authHeader: 'Authorization',
    authPrefix: '',
    models: ['anthropic.claude-3-5-sonnet-20241022-v2:0', 'anthropic.claude-3-haiku-20240307-v1:0', 'meta.llama3-1-70b-instruct-v1:0', 'amazon.titan-text-premier-v1:0'],
    costPer1kPromptTokens: 0.003,
    costPer1kResponseTokens: 0.015,
  },
  {
    id: 'mistral',
    name: 'Mistral AI',
    baseUrl: 'https://api.mistral.ai',
    authHeader: 'Authorization',
    authPrefix: 'Bearer ',
    models: ['mistral-large-latest', 'mistral-medium-latest', 'mistral-small-latest', 'codestral-latest', 'open-mistral-nemo'],
    costPer1kPromptTokens: 0.002,
    costPer1kResponseTokens: 0.006,
  },
  {
    id: 'cohere',
    name: 'Cohere',
    baseUrl: 'https://api.cohere.com',
    authHeader: 'Authorization',
    authPrefix: 'Bearer ',
    models: ['command-r-plus', 'command-r', 'command-light', 'embed-english-v3.0'],
    costPer1kPromptTokens: 0.003,
    costPer1kResponseTokens: 0.015,
  },
  {
    id: 'groq',
    name: 'Groq',
    baseUrl: 'https://api.groq.com/openai',
    authHeader: 'Authorization',
    authPrefix: 'Bearer ',
    models: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768', 'gemma2-9b-it'],
    costPer1kPromptTokens: 0.00059,
    costPer1kResponseTokens: 0.00079,
  },
];

// Model-specific pricing overrides (cost per 1K tokens)
export const MODEL_PRICING: Record<string, { prompt: number; response: number }> = {
  'gpt-4o': { prompt: 0.0025, response: 0.01 },
  'gpt-4o-mini': { prompt: 0.00015, response: 0.0006 },
  'gpt-4-turbo': { prompt: 0.01, response: 0.03 },
  'gpt-4': { prompt: 0.03, response: 0.06 },
  'gpt-3.5-turbo': { prompt: 0.0005, response: 0.0015 },
  'o1': { prompt: 0.015, response: 0.06 },
  'o1-mini': { prompt: 0.003, response: 0.012 },
  'o3-mini': { prompt: 0.0011, response: 0.0044 },
  'claude-3-5-sonnet-20241022': { prompt: 0.003, response: 0.015 },
  'claude-3-5-haiku-20241022': { prompt: 0.001, response: 0.005 },
  'claude-3-opus-20240229': { prompt: 0.015, response: 0.075 },
  'gemini-2.0-flash': { prompt: 0.0001, response: 0.0004 },
  'gemini-1.5-pro': { prompt: 0.00125, response: 0.005 },
  'gemini-1.5-flash': { prompt: 0.000075, response: 0.0003 },
  // Azure OpenAI (same pricing as OpenAI — models reuse entries above)
  'gpt-35-turbo': { prompt: 0.0005, response: 0.0015 },
  // AWS Bedrock
  'anthropic.claude-3-5-sonnet-20241022-v2:0': { prompt: 0.003, response: 0.015 },
  'anthropic.claude-3-haiku-20240307-v1:0': { prompt: 0.00025, response: 0.00125 },
  'meta.llama3-1-70b-instruct-v1:0': { prompt: 0.00099, response: 0.00099 },
  'amazon.titan-text-premier-v1:0': { prompt: 0.0005, response: 0.0015 },
  // Mistral AI
  'mistral-large-latest': { prompt: 0.002, response: 0.006 },
  'mistral-medium-latest': { prompt: 0.0027, response: 0.0081 },
  'mistral-small-latest': { prompt: 0.001, response: 0.003 },
  'codestral-latest': { prompt: 0.001, response: 0.003 },
  'open-mistral-nemo': { prompt: 0.0003, response: 0.0003 },
  // Cohere
  'command-r-plus': { prompt: 0.003, response: 0.015 },
  'command-r': { prompt: 0.0005, response: 0.0015 },
  'command-light': { prompt: 0.0003, response: 0.0006 },
  // Groq
  'llama-3.3-70b-versatile': { prompt: 0.00059, response: 0.00079 },
  'llama-3.1-8b-instant': { prompt: 0.00005, response: 0.00008 },
  'mixtral-8x7b-32768': { prompt: 0.00024, response: 0.00024 },
  'gemma2-9b-it': { prompt: 0.0002, response: 0.0002 },
};

// =============================================================================
// SIGNING KEY
// =============================================================================

export const GATEWAY_SIGNING_KEY = process.env['GATEWAY_SIGNING_KEY'] || crypto.randomBytes(32).toString('hex');

export function signData(data: string): string {
  return crypto.createHmac('sha256', GATEWAY_SIGNING_KEY).update(data).digest('hex');
}

export function hashData(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

// =============================================================================
// SCALE CONFIGURATION
// =============================================================================

/** Max interactions kept in memory (ring buffer). Older entries evicted. */
export const RING_BUFFER_SIZE = 10_000;

/** Batch DB persistence: flush every N interactions or every N ms */
export const FLUSH_BATCH_SIZE = 100;
export const FLUSH_INTERVAL_MS = 5_000;

/** Max Merkle leaves kept in memory. When exceeded, older leaves are pruned
 *  and their combined hash is preserved as a single "epoch root" leaf. */
export const MERKLE_LEAF_LIMIT = 100_000;

// =============================================================================
// AGGREGATE COUNTERS — O(1) stats instead of O(n) iteration
// =============================================================================

export interface AggregateCounters {
  totalInteractions: number;
  totalTokens: number;
  totalCostUsd: number;
  piiDetections: number;
  piiBlocks: number;
  piiRedactions: number;
  policyBlocks: number;
  policyWarnings: number;
  byProvider: Record<string, { count: number; tokens: number; costUsd: number }>;
  byModel: Record<string, { count: number; tokens: number; costUsd: number }>;
  byDepartment: Record<string, { count: number; tokens: number; costUsd: number }>;
  byUser: Record<string, { count: number; tokens: number; costUsd: number }>;
  piiTypeCount: Record<string, number>;
}

export function emptyCounters(): AggregateCounters {
  return {
    totalInteractions: 0, totalTokens: 0, totalCostUsd: 0,
    piiDetections: 0, piiBlocks: 0, piiRedactions: 0,
    policyBlocks: 0, policyWarnings: 0,
    byProvider: {}, byModel: {}, byDepartment: {}, byUser: {},
    piiTypeCount: {},
  };
}

// =============================================================================
// SERVICE
// =============================================================================

