// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA RAPIDS / GPU — Barrel Exports
// =============================================================================

export { rapids, default } from './RAPIDSService.js';
export { confidentialCompute } from './ConfidentialComputeService.js';

export type {
  DataFrameSpec,
  BiasAnalysisInput,
  BiasAnalysisResult,
  GraphAnalyticsInput,
  GraphAnalyticsResult,
  StatisticalTestInput,
  StatisticalTestResult,
  AnomalyDetectionInput,
  AnomalyDetectionResult,
  RAPIDSHealth,
} from './RAPIDSService.js';

export type {
  GPUConfidentialMode,
  GPUAttestationResult,
  ConfidentialSession,
  CCEvidencePacket,
  CCPolicy,
  CCHealth,
} from './ConfidentialComputeService.js';
