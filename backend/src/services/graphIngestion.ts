// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// GRAPH INGESTION SERVICE (Community Edition)
// Ingests data from Postgres into Neo4j knowledge graph.
// =============================================================================

export async function ingestPostgresDataSourceToGraph(
  _sourceConfig: Record<string, any>,
): Promise<{ nodesCreated: number; edgesCreated: number; duration: number }> {
  return { nodesCreated: 0, edgesCreated: 0, duration: 0 };
}
