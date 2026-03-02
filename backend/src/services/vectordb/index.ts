/**
 * Service — Index
 *
 * Business logic service implementing platform capabilities.
 * @module services/vectordb/index
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// CendiaVector™ — Vector Database Service
// Barrel Export
// =============================================================================

export { vectorDB } from './VectorDBService.js';

export type {
  VectorPoint,
  VectorSearchResult,
  CollectionConfig,
  SearchFilter,
  FilterCondition,
  CollectionInfo,
  EmbeddingRequest,
  VectorCollectionName,
} from './VectorDBService.js';
