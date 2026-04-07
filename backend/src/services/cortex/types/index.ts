// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.




import { withFallback } from '../../_serviceProxy.js';
// Auto-generated stub — implement as needed

export interface QueryParams { [key: string]: any; }

export interface AnalyzeParams { [key: string]: any; }

export interface SimulateParams { [key: string]: any; }

export interface GovernParams { [key: string]: any; }

export interface ContextOptions { [key: string]: any; }

export interface GatewayRequest { [key: string]: any; }

export interface GatewayResponse { [key: string]: any; }

export const DEFAULT_PROVIDERS: any = withFallback({});

export const MODEL_PRICING: any = withFallback({});

export const RING_BUFFER_SIZE: any = withFallback({});

export const FLUSH_BATCH_SIZE: any = withFallback({});

export const FLUSH_INTERVAL_MS: any = withFallback({});

export const MERKLE_LEAF_LIMIT: any = withFallback({});

export const hashData: any = withFallback({});

export const signData: any = withFallback({});

export const emptyCounters: any = withFallback({});

export type AggregateCounters = Record<string, number>;

export class GatewayProvider { [key: string]: any; }

export class GatewayPolicy { [key: string]: any; }

export class GatewayInteraction { [key: string]: any; }

export class GatewayStats { [key: string]: any; }

export class AIManifest { [key: string]: any; }

export class GovernanceReceipt { [key: string]: any; }

export class AgentCapabilities { [key: string]: any; }

export class AlertMetadata { [key: string]: any; }
