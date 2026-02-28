// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA - GRAPH EXPLORER PAGE (Enhanced Dark Theme)
// =============================================================================

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { cn } from '../../../../lib/utils';
import { graphApi, lineageApi } from '../../../lib/api';
import type { GraphEntity } from '../../../lib/api/types';
import GraphCanvas from '../../../components/graph/GraphCanvas';
import type { GraphNode, GraphEdge, GraphData } from '../../../components/graph/GraphCanvas';
import { useLanguage } from '../../../contexts/LanguageContext';

// =============================================================================
// TYPES
// =============================================================================

interface SelectedEntity {
  id: string;
  type: string;
  name: string;
  properties?: Record<string, unknown>;
  owner?: string;
  lastUpdated?: string;
  connections?: { incoming: number; outgoing: number };
}

interface SearchSuggestion {
  id: string;
  name: string;
  type: string;
}

// Node colors by type (dark theme optimized)
const nodeColors: Record<string, { bg: string; border: string; glow: string }> = {
  dataset: { bg: '#1E3A5F', border: '#3B82F6', glow: 'rgba(59, 130, 246, 0.3)' },
  metric: { bg: '#1A3D2E', border: '#10B981', glow: 'rgba(16, 185, 129, 0.3)' },
  process: { bg: '#3D2E1A', border: '#F59E0B', glow: 'rgba(245, 158, 11, 0.3)' },
  entity: { bg: '#2E1A3D', border: '#8B5CF6', glow: 'rgba(139, 92, 246, 0.3)' },
  report: { bg: '#3D1A2E', border: '#EC4899', glow: 'rgba(236, 72, 153, 0.3)' },
  dashboard: { bg: '#1A3D3D', border: '#06B6D4', glow: 'rgba(6, 182, 212, 0.3)' },
  workflow: { bg: '#3D2B1A', border: '#F97316', glow: 'rgba(249, 115, 22, 0.3)' },
};

const nodeIcons: Record<string, string> = {
  dataset: '📊',
  metric: '📈',
  process: '⚙️',
  entity: '🏢',
  report: '📄',
  dashboard: '📋',
  workflow: '🔄',
};

const edgeTypes: Record<string, { color: string; label: string }> = {
  derives: { color: '#3B82F6', label: 'Derives From' },
  feeds: { color: '#10B981', label: 'Feeds Into' },
  transforms: { color: '#F59E0B', label: 'Transforms' },
  owns: { color: '#8B5CF6', label: 'Owns' },
  related: { color: '#6B7280', label: 'Related To' },
  inferred: { color: '#9CA3AF', label: 'Inferred (Heuristic)' },
};

// =============================================================================
// ENTITY DETAILS PANEL
// =============================================================================

const EntityDetailsPanel: React.FC<{
  entity: SelectedEntity | null;
  onClose: () => void;
  onViewLineage: () => void;
  onViewImpact: () => void;
  onAskCouncil: () => void;
}> = ({ entity, onClose, onViewLineage, onViewImpact, onAskCouncil }) => {
  if (!entity) {
    return null;
  }

  const colors = nodeColors[entity.type] || nodeColors.entity;

  return (
    <div className="absolute bottom-4 left-4 bg-neutral-800 rounded-xl shadow-xl border border-neutral-700 p-4 w-80 z-10">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-xl border"
            style={{ backgroundColor: colors.bg, borderColor: colors.border }}
          >
            {nodeIcons[entity.type] || '📦'}
          </div>
          <div>
            <h3 className="font-semibold text-white">{entity.name}</h3>
            <p className="text-sm text-neutral-400 capitalize">{entity.type}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-neutral-500 hover:text-white hover:bg-neutral-700"
        >
          ✕
        </button>
      </div>

      <div className="space-y-3 mb-4">
        {entity.owner && (
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">Owner</span>
            <span className="text-white">{entity.owner}</span>
          </div>
        )}
        {entity.lastUpdated && (
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">Last Updated</span>
            <span className="text-white">{entity.lastUpdated}</span>
          </div>
        )}
        {entity.connections && (
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">Connections</span>
            <span className="text-white">
              {entity.connections.incoming} in, {entity.connections.outgoing} out
            </span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        {/* Ask Council - Primary CTA */}
        <button
          onClick={onAskCouncil}
          className="w-full px-3 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-500 rounded-lg hover:from-primary-500 hover:to-primary-400 transition-all flex items-center justify-center gap-2"
        >
          🧠 Ask the Council about this entity
        </button>
        <div className="flex gap-2">
          <button
            onClick={onViewLineage}
            className="flex-1 px-3 py-2 text-sm font-medium text-primary-400 bg-primary-900/30 border border-primary-700 rounded-lg hover:bg-primary-900/50 transition-colors"
          >
            View Lineage
          </button>
          <button
            onClick={onViewImpact}
            className="flex-1 px-3 py-2 text-sm font-medium text-neutral-300 bg-neutral-700 rounded-lg hover:bg-neutral-600 transition-colors"
          >
            Impact Analysis
          </button>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// MINI MAP COMPONENT
// =============================================================================

const MiniMap: React.FC<{ nodes: GraphNode[] }> = ({ nodes }) => {
  if (nodes.length === 0) {
    return null;
  }

  return (
    <div className="absolute bottom-4 right-4 w-32 h-24 bg-neutral-800/90 rounded-lg border border-neutral-700 p-2 z-10">
      <div className="relative w-full h-full">
        {nodes.slice(0, 20).map((node, i) => {
          const x = (i % 5) * 20 + 10;
          const y = Math.floor(i / 5) * 15 + 5;
          const colors = nodeColors[node.type] || nodeColors.entity;
          return (
            <div
              key={node.id}
              className="absolute w-2 h-2 rounded-full"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                backgroundColor: colors.border,
              }}
            />
          );
        })}
        {/* Viewport indicator */}
        <div className="absolute inset-2 border border-white/30 rounded" />
      </div>
    </div>
  );
};

// =============================================================================
// FILTER CHIPS COMPONENT
// =============================================================================

const FilterChips: React.FC<{
  types: string[];
  activeTypes: string[];
  onToggle: (type: string) => void;
}> = ({ types, activeTypes, onToggle }) => (
  <div className="flex flex-wrap gap-2">
    {types.map((type) => {
      const colors = nodeColors[type] || nodeColors.entity;
      const isActive = activeTypes.includes(type) || activeTypes.length === 0;
      return (
        <button
          key={type}
          onClick={() => onToggle(type)}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border',
            isActive
              ? 'bg-opacity-100 text-white'
              : 'bg-opacity-20 text-neutral-500 border-transparent'
          )}
          style={{
            backgroundColor: isActive ? colors.bg : 'transparent',
            borderColor: isActive ? colors.border : 'transparent',
          }}
        >
          <span>{nodeIcons[type]}</span>
          <span className="capitalize">{type}</span>
        </button>
      );
    })}
  </div>
);

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const GraphExplorerPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();

  // State
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<SelectedEntity | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search suggestions
  const suggestions = useMemo<SearchSuggestion[]>(() => {
    if (!searchQuery || searchQuery.length < 2) {
      return [];
    }
    return nodes
      .filter((n) => {
        const name = (n.name ?? '').toString();
        return name.toLowerCase().includes(searchQuery.toLowerCase());
      })
      .slice(0, 5)
      .map((n) => ({
        id: n.id,
        name: (n.name ?? n.id ?? 'Unnamed') as string,
        type: n.type,
      }));
  }, [searchQuery, nodes]);

  // Toggle filter
  const toggleFilter = useCallback((type: string) => {
    setActiveFilters((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  }, []);

  // Load graph data from API
  useEffect(() => {
    const loadGraph = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const entityId = searchParams.get('entity');

        if (entityId) {
          // Load lineage for specific entity
          const lineageRes = await lineageApi.getLineage(entityId, { direction: 'both', depth: 3 });
          if (lineageRes.success && lineageRes.data) {
            const data = lineageRes.data as any;
            const lineageNodes: GraphNode[] = (data.entities || data.nodes || []).map((e: any) => ({
              id: e.id,
              type: e.type || 'entity',
              name: e.name || e.label || e.id,
              properties: e.properties || {},
            }));
            const lineageEdges: GraphEdge[] = (data.relationships || data.edges || []).map(
              (r: any, idx: number) => ({
                id: r.id || `edge-${idx}`,
                source: r.sourceId || r.source,
                target: r.targetId || r.target,
                type: r.type || 'related',
                label: r.label || r.type,
              })
            );
            setNodes(lineageNodes);
            setEdges(lineageEdges);
          }
        } else {
          // Load full graph (nodes + relationships)
          const graphRes = await graphApi.getEntities({ pageSize: 100 });
          if (graphRes.success && graphRes.data) {
            const entities = graphRes.data as GraphEntity[];
            const graphNodes: GraphNode[] = entities.map((e) => ({
              id: e.id,
              type: e.type,
              name: e.name,
              properties: e.properties,
            }));

            setNodes(graphNodes);

            // Fetch relationships between the loaded nodes using the generic graph query API
            try {
              const relQuery = `
                MATCH (source {organizationId: $_orgId})-[r]->(target {organizationId: $_orgId})
                WHERE source.id IN $nodeIds AND target.id IN $nodeIds
                RETURN source.id AS sourceId, target.id AS targetId, type(r) AS relType, r AS properties
              `;

              const relRes = await graphApi.executeQuery(relQuery, {
                nodeIds: graphNodes.map((n) => n.id),
              });

              if (relRes.success && Array.isArray(relRes.data)) {
                const graphEdges: GraphEdge[] = (relRes.data as any[])
                  .map((row: any) => ({
                    source: String(row.sourceId ?? row.source ?? ''),
                    target: String(row.targetId ?? row.target ?? ''),
                    type: String(row.relType ?? row.type ?? 'related'),
                    properties: row.properties || {},
                  }))
                  .filter((e) => e.source && e.target);

                setEdges(graphEdges);
              } else {
                setEdges([]);
              }
            } catch (relErr) {
              console.error('Graph relationships load error:', relErr);
              setEdges([]);
            }
          }
        }
      } catch (err) {
        setError('Failed to load graph data');
        console.error('Graph load error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadGraph();
  }, [searchParams]);

  // Handle node selection from GraphCanvas
  const handleNodeSelect = useCallback((node: GraphNode | null) => {
    if (node) {
      setSelectedEntity({
        id: node.id,
        type: node.type,
        name: node.name,
        properties: node.properties,
        owner: 'Data Team',
        lastUpdated: 'Recently',
        connections: { incoming: 5, outgoing: 3 },
      });
    } else {
      setSelectedEntity(null);
    }
  }, []);

  // Handle node double-click (drill down)
  const handleNodeDoubleClick = useCallback(
    (node: GraphNode) => {
      navigate(`/cortex/graph?entity=${node.id}`);
    },
    [navigate]
  );

  // View lineage for selected entity
  const handleViewLineage = useCallback(() => {
    if (selectedEntity) {
      navigate(`/cortex/graph?entity=${selectedEntity.id}`);
    }
  }, [selectedEntity, navigate]);

  // View impact analysis
  const handleViewImpact = useCallback(async () => {
    if (selectedEntity) {
      const impactRes = await lineageApi.getImpact(selectedEntity.id);
      if (impactRes.success) {
        console.log('Impact analysis:', impactRes.data);
        // Could open a modal or navigate to impact view
      }
    }
  }, [selectedEntity]);

  // Filter nodes
  const filteredNodes = nodes.filter((node) => {
    const name = (node.name ?? '').toString();
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = activeFilters.length === 0 || activeFilters.includes(node.type);
    return matchesSearch && matchesType;
  });

  const filteredEdges = edges.filter((edge) => {
    const sourceVisible = filteredNodes.some((n) => n.id === edge.source);
    const targetVisible = filteredNodes.some((n) => n.id === edge.target);
    return sourceVisible && targetVisible;
  });

  // Graph data for canvas
  const graphData: GraphData = {
    nodes: filteredNodes,
    edges: filteredEdges,
  };

  // Get unique types for filter
  const nodeTypes = [...new Set(nodes.map((n) => n.type))];

  return (
    <div className="h-full flex flex-col bg-neutral-900">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-neutral-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-white">Graph Explorer</h1>
            <p className="text-sm text-neutral-400">Explore entities and their relationships</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-neutral-500">
              {filteredNodes.length} entities • {filteredEdges.length} relationships
            </span>
          </div>
        </div>

        {/* Search with Suggestions */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 max-w-md relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Search entities..."
              className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {/* Search Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-neutral-800 border border-neutral-700 rounded-lg shadow-xl z-20 overflow-hidden">
                {suggestions.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSearchQuery(s.name);
                      setShowSuggestions(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-neutral-700 transition-colors text-left"
                  >
                    <span>{nodeIcons[s.type] || '📦'}</span>
                    <div>
                      <p className="text-sm text-white">{s.name}</p>
                      <p className="text-xs text-neutral-500 capitalize">{s.type}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Filter Chips */}
        <FilterChips types={nodeTypes} activeTypes={activeFilters} onToggle={toggleFilter} />
      </div>

      {/* Graph Canvas */}
      <div className="flex-1 relative bg-neutral-950">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-neutral-400">Loading graph...</p>
            </div>
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-400 mb-2">⚠️ {error}</p>
              <button
                onClick={() => window.location.reload()}
                className="text-primary-400 hover:underline"
              >
                Retry
              </button>
            </div>
          </div>
        ) : nodes.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-4xl mb-2">🔍</p>
              <p className="text-neutral-400">No entities found</p>
              <p className="text-sm text-neutral-500">Try adjusting your search or filters</p>
            </div>
          </div>
        ) : (
          <GraphCanvas
            data={graphData}
            onNodeSelect={handleNodeSelect}
            onNodeDoubleClick={handleNodeDoubleClick}
            className="w-full h-full"
          />
        )}

        {/* Entity Details Panel */}
        <EntityDetailsPanel
          entity={selectedEntity}
          onClose={() => setSelectedEntity(null)}
          onViewLineage={handleViewLineage}
          onViewImpact={handleViewImpact}
          onAskCouncil={() => {
            if (selectedEntity) {
              navigate(
                `/cortex/council?q=Tell me about the ${selectedEntity.type} "${selectedEntity.name}" - its purpose, data quality, dependencies, and any risks or concerns.`
              );
            }
          }}
        />

        {/* Legend - Node Types */}
        <div className="absolute top-4 right-4 bg-neutral-800/90 rounded-lg border border-neutral-700 p-3 z-10">
          <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2">
            Node Types
          </p>
          <div className="space-y-1.5 mb-3">
            {Object.entries(nodeColors).map(([type, colors]) => (
              <div key={type} className="flex items-center gap-2 text-xs">
                <div
                  className="w-3 h-3 rounded border"
                  style={{ backgroundColor: colors.bg, borderColor: colors.border }}
                />
                <span className="capitalize text-neutral-300">{type}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-neutral-700 pt-2 mt-2">
            <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2">
              Edge Types
            </p>
            <div className="space-y-1.5">
              {Object.entries(edgeTypes).map(([type, config]) => (
                <div key={type} className="flex items-center gap-2 text-xs">
                  <div className="w-4 h-0.5 rounded" style={{ backgroundColor: config.color }} />
                  <span className="text-neutral-300">{config.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mini Map */}
        <MiniMap nodes={filteredNodes} />
      </div>
    </div>
  );
};

export default GraphExplorerPage;
