// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
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
