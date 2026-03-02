/**
 * Service — Index
 *
 * Business logic service implementing platform capabilities.
 * @module services/streaming/index
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA STREAMING — Barrel Exports
// =============================================================================

export { flinkCEP, default } from './FlinkCEPService.js';

export type {
  CEPEvent,
  CEPRule,
  CEPCondition,
  CEPAction,
  CEPAlert,
  FlinkHealth,
} from './FlinkCEPService.js';
