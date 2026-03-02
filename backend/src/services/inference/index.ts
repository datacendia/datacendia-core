/**
 * Service — Index
 *
 * Business logic service implementing platform capabilities.
 * @module services/inference/index
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA INFERENCE LAYER — Barrel Exports
// =============================================================================

// Core interface & types
export type {
  IInferenceProvider,
  InferenceChatMessage,
  InferenceOptions,
  InferenceTelemetry,
  InferenceModel,
  InferenceProviderType,
  ProviderHealth,
  GenerateResult,
  ChatResult,
  EmbedResult,
} from './InferenceProvider.js';

// Provider implementations
export { OllamaProvider } from './OllamaProvider.js';
export { TritonProvider } from './TritonProvider.js';
export { NIMProvider } from './NIMProvider.js';

// Unified service (singleton)
export { inference, default } from './InferenceService.js';
