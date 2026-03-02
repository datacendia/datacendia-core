// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import neo4jDriver, { Driver, Session, QueryResult } from 'neo4j-driver';
import { config } from './index.js';
import { logger } from '../utils/logger.js';

export const neo4j: Driver = neo4jDriver.driver(
  config.neo4jUri,
  neo4jDriver.auth.basic(config.neo4jUser, config.neo4jPassword),
  {
    maxConnectionPoolSize: 50,
    connectionAcquisitionTimeout: 60000,
    maxTransactionRetryTime: 30000,
    logging: {
      level: config.nodeEnv === 'development' ? 'info' : 'warn',
      logger: (level, message) => {
        logger.log(level, `[Neo4j] ${message}`);
      },
    },
  }
);

// Graph query helper
export const graph = {
  /**
   * Execute a read query
   */
  async read<T = unknown>(
    cypher: string,
    params: Record<string, unknown> = {}
  ): Promise<T[]> {
    const session = neo4j.session({ defaultAccessMode: neo4jDriver.session.READ });
    try {
      const result = await session.run(cypher, params);
      return result.records.map((record) => record.toObject() as T);
    } finally {
      await session.close();
    }
  },

  /**
   * Execute a write query
   */
  async write<T = unknown>(
    cypher: string,
    params: Record<string, unknown> = {}
  ): Promise<T[]> {
    const session = neo4j.session({ defaultAccessMode: neo4jDriver.session.WRITE });
    try {
      const result = await session.run(cypher, params);
      return result.records.map((record) => record.toObject() as T);
    } finally {
      await session.close();
    }
  },

  /**
   * Execute multiple queries in a transaction
   */
  async transaction<T>(
    work: (tx: {
      run: (cypher: string, params?: Record<string, unknown>) => Promise<QueryResult>;
    }) => Promise<T>
  ): Promise<T> {
    const session = neo4j.session({ defaultAccessMode: neo4jDriver.session.WRITE });
    try {
      return await session.executeWrite(work);
    } finally {
      await session.close();
    }
  },

  /**
   * Create a node
   */
  async createNode(
    label: string,
    properties: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    const cypher = `
      CREATE (n:${label} $properties)
      SET n.createdAt = datetime()
      RETURN n
    `;
    const result = await this.write<{ n: Record<string, unknown> }>(cypher, { properties });
    return result[0]?.n;
  },

  /**
   * Create a relationship between nodes
   */
  async createRelationship(
    fromId: string,
    toId: string,
    type: string,
    properties: Record<string, unknown> = {}
  ): Promise<void> {
    const cypher = `
      MATCH (from {id: $fromId})
      MATCH (to {id: $toId})
      CREATE (from)-[r:${type} $properties]->(to)
      SET r.createdAt = datetime()
      RETURN r
    `;
    await this.write(cypher, { fromId, toId, properties });
  },

  /**
   * Get node neighbors
   */
  async getNeighbors(
    nodeId: string,
    direction: 'incoming' | 'outgoing' | 'both' = 'both',
    relationshipType?: string,
    depth: number = 1
  ): Promise<Array<{ node: Record<string, unknown>; relationship: Record<string, unknown> }>> {
    const relationPattern = relationshipType ? `:${relationshipType}` : '';
    const depthPattern = depth > 1 ? `*1..${depth}` : '';
    
    let directionPattern: string;
    switch (direction) {
      case 'incoming':
        directionPattern = `<-[r${relationPattern}${depthPattern}]-`;
        break;
      case 'outgoing':
        directionPattern = `-[r${relationPattern}${depthPattern}]->`;
        break;
      default:
        directionPattern = `-[r${relationPattern}${depthPattern}]-`;
    }

    const cypher = `
      MATCH (source {id: $nodeId})${directionPattern}(neighbor)
      RETURN neighbor, r
    `;
    
    return this.read<{ neighbor: Record<string, unknown>; r: Record<string, unknown> }>(cypher, { nodeId })
      .then(results => results.map(r => ({ node: r.neighbor, relationship: r.r })));
  },

  /**
   * Get lineage (upstream dependencies)
   */
  async getLineage(
    entityId: string,
    direction: 'upstream' | 'downstream' | 'both' = 'upstream',
    depth: number = 3
  ): Promise<{
    nodes: Array<Record<string, unknown>>;
    edges: Array<{ source: string; target: string; type: string; properties: Record<string, unknown> }>;
  }> {
    const pathPattern = direction === 'upstream' 
      ? `<-[r:DERIVES_FROM|DEPENDS_ON*1..${depth}]-` 
      : direction === 'downstream'
        ? `-[r:DERIVES_FROM|DEPENDS_ON*1..${depth}]->`
        : `-[r:DERIVES_FROM|DEPENDS_ON*1..${depth}]-`;

    const cypher = `
      MATCH path = (root {id: $entityId})${pathPattern}(related)
      UNWIND relationships(path) as rel
      WITH collect(DISTINCT root) + collect(DISTINCT related) as allNodes, collect(DISTINCT rel) as allRels
      RETURN allNodes as nodes, allRels as edges
    `;

    const result = await this.read<{ nodes: Record<string, unknown>[]; edges: unknown[] }>(cypher, { entityId });
    
    if (result.length === 0) {
      return { nodes: [], edges: [] };
    }

    const { nodes, edges } = result[0];
    return {
      nodes,
      edges: (edges as Array<{ start: { id: string }; end: { id: string }; type: string; properties: Record<string, unknown> }>).map(e => ({
        source: String(e.start),
        target: String(e.end),
        type: e.type,
        properties: e.properties || {},
      })),
    };
  },

  /**
   * Search entities
   */
  async searchEntities(
    query: string,
    entityType?: string,
    limit: number = 20
  ): Promise<Array<Record<string, unknown>>> {
    const typeFilter = entityType ? `AND n:${entityType}` : '';
    const cypher = `
      MATCH (n)
      WHERE (n.name =~ $pattern OR n.description =~ $pattern) ${typeFilter}
      RETURN n
      LIMIT $limit
    `;
    
    const pattern = `(?i).*${query}.*`;
    return this.read<{ n: Record<string, unknown> }>(cypher, { pattern, limit })
      .then(results => results.map(r => r.n));
  },
};

export default neo4j;
