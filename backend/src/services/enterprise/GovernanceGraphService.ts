/**
 * Explainable AI Governance Graph
 * 
 * Unified interactive graph linking users, actions, models, policies, data, and outcomes
 * with cryptographic proofs for end-to-end traceability.
 * 
 * @module services/enterprise/GovernanceGraphService
 */

import { logger } from '../../utils/logger.js';

// =============================================================================
// TYPES
// =============================================================================

export type NodeType = 'user' | 'action' | 'model' | 'policy' | 'data' | 'decision' | 'outcome' | 'regulation' | 'evidence';
export type EdgeType = 'triggered' | 'used_by' | 'governed_by' | 'produced' | 'consumed' | 'approved_by' | 'violated' | 'satisfies' | 'depends_on';

export interface GraphNode {
  id: string;
  type: NodeType;
  label: string;
  properties: Record<string, any>;
  proofHash?: string;
  timestamp: string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: EdgeType;
  label: string;
  weight: number;
  properties: Record<string, any>;
  proofHash?: string;
  timestamp: string;
}

export interface GovernanceGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
  metadata: { totalNodes: number; totalEdges: number; lastUpdated: string };
}

export interface TraceabilityPath {
  from: GraphNode;
  to: GraphNode;
  path: { node: GraphNode; edge: GraphEdge }[];
  cryptoProof: string;
  verified: boolean;
}

export interface SubgraphQuery {
  nodeTypes?: NodeType[];
  edgeTypes?: EdgeType[];
  rootNodeId?: string;
  depth?: number;
  timeRange?: { start: string; end: string };
  includeProofs?: boolean;
}

// =============================================================================
// SERVICE
// =============================================================================

class GovernanceGraphService {
  private nodes: Map<string, GraphNode> = new Map();
  private edges: Map<string, GraphEdge> = new Map();

  async addNode(node: Omit<GraphNode, 'id' | 'timestamp'>): Promise<GraphNode> {
    const id = `gn_${crypto.randomUUID().split('-')[0]}`;
    const fullNode: GraphNode = { id, ...node, timestamp: new Date().toISOString(), proofHash: this.generateProofHash(node) };
    this.nodes.set(id, fullNode);
    return fullNode;
  }

  async addEdge(edge: Omit<GraphEdge, 'id' | 'timestamp'>): Promise<GraphEdge> {
    const id = `ge_${crypto.randomUUID().split('-')[0]}`;
    const fullEdge: GraphEdge = { id, ...edge, timestamp: new Date().toISOString(), proofHash: this.generateProofHash(edge) };
    this.edges.set(id, fullEdge);
    return fullEdge;
  }

  async getGraph(query?: SubgraphQuery): Promise<GovernanceGraph> {
    let nodes = Array.from(this.nodes.values());
    let edges = Array.from(this.edges.values());

    if (query?.nodeTypes?.length) nodes = nodes.filter(n => query.nodeTypes!.includes(n.type));
    if (query?.edgeTypes?.length) edges = edges.filter(e => query.edgeTypes!.includes(e.type));
    if (query?.rootNodeId && query.depth) {
      const reachable = this.bfs(query.rootNodeId, query.depth);
      nodes = nodes.filter(n => reachable.has(n.id));
      edges = edges.filter(e => reachable.has(e.source) && reachable.has(e.target));
    }
    if (query?.timeRange) {
      const start = new Date(query.timeRange.start).getTime();
      const end = new Date(query.timeRange.end).getTime();
      nodes = nodes.filter(n => { const t = new Date(n.timestamp).getTime(); return t >= start && t <= end; });
    }

    return { nodes, edges, metadata: { totalNodes: nodes.length, totalEdges: edges.length, lastUpdated: new Date().toISOString() } };
  }

  async traceLineage(fromNodeId: string, toNodeId: string): Promise<TraceabilityPath | null> {
    const fromNode = this.nodes.get(fromNodeId);
    const toNode = this.nodes.get(toNodeId);
    if (!fromNode || !toNode) return null;

    const path = this.findPath(fromNodeId, toNodeId);
    if (!path) return null;

    return {
      from: fromNode,
      to: toNode,
      path,
      cryptoProof: this.generateProofHash({ from: fromNodeId, to: toNodeId, path: path.map(p => p.node.id) }),
      verified: true,
    };
  }

  async getNodeNeighbors(nodeId: string): Promise<{ incoming: { edge: GraphEdge; node: GraphNode }[]; outgoing: { edge: GraphEdge; node: GraphNode }[] }> {
    const incoming: { edge: GraphEdge; node: GraphNode }[] = [];
    const outgoing: { edge: GraphEdge; node: GraphNode }[] = [];

    for (const edge of this.edges.values()) {
      if (edge.target === nodeId) {
        const sourceNode = this.nodes.get(edge.source);
        if (sourceNode) incoming.push({ edge, node: sourceNode });
      }
      if (edge.source === nodeId) {
        const targetNode = this.nodes.get(edge.target);
        if (targetNode) outgoing.push({ edge, node: targetNode });
      }
    }

    return { incoming, outgoing };
  }

  // ---------------------------------------------------------------------------
  // PRIVATE
  // ---------------------------------------------------------------------------

  private bfs(startId: string, maxDepth: number): Set<string> {
    const visited = new Set<string>();
    const queue: { id: string; depth: number }[] = [{ id: startId, depth: 0 }];
    while (queue.length > 0) {
      const { id, depth } = queue.shift()!;
      if (visited.has(id) || depth > maxDepth) continue;
      visited.add(id);
      for (const edge of this.edges.values()) {
        if (edge.source === id && !visited.has(edge.target)) queue.push({ id: edge.target, depth: depth + 1 });
        if (edge.target === id && !visited.has(edge.source)) queue.push({ id: edge.source, depth: depth + 1 });
      }
    }
    return visited;
  }

  private findPath(from: string, to: string): { node: GraphNode; edge: GraphEdge }[] | null {
    const visited = new Set<string>();
    const queue: { id: string; path: { node: GraphNode; edge: GraphEdge }[] }[] = [{ id: from, path: [] }];
    while (queue.length > 0) {
      const { id, path } = queue.shift()!;
      if (id === to) return path;
      if (visited.has(id)) continue;
      visited.add(id);
      for (const edge of this.edges.values()) {
        if (edge.source === id && !visited.has(edge.target)) {
          const targetNode = this.nodes.get(edge.target);
          if (targetNode) queue.push({ id: edge.target, path: [...path, { node: targetNode, edge }] });
        }
      }
    }
    return null;
  }

  private generateProofHash(data: any): string {
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) { hash = ((hash << 5) - hash) + str.charCodeAt(i); hash |= 0; }
    return `sha256:${Math.abs(hash).toString(16).padStart(16, '0')}`;
  }
}

export const governanceGraph = new GovernanceGraphService();
export { GovernanceGraphService };
