/**
 * Service — Index
 *
 * Business logic service implementing platform capabilities.
 * @module services/temporal/index
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA TEMPORAL — Barrel Exports
// =============================================================================

export { temporal, default } from './TemporalService.js';

export type {
  WorkflowState,
  ActivityState,
  TemporalWorkflowDef,
  ActivityDef,
  RetryPolicy,
  WorkflowExecution,
  ActivityExecution,
  WorkflowQuery,
  SignalInput,
  TemporalHealth,
} from './TemporalService.js';
