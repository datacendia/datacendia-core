/**
 * Component — Graph Canvas
 *
 * Reusable React UI component.
 *
 * @exports GraphCanvas, GraphNode, GraphEdge, GraphData
 * @module components/graph/GraphCanvas
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * GraphCanvas - Cytoscape.js-based graph visualization component
 */
import React, { useEffect, useRef, useCallback, useState } from 'react';
import cytoscape, { Core, NodeSingular, EdgeSingular, EventObject } from 'cytoscape';
import { cn } from '../../../lib/utils';

// Graph element types
export interface GraphNode {
  id: string;
  type: string;
  name: string;
  properties?: Record<string, unknown>;
}

export interface GraphEdge {
  source: string;
  target: string;
  type: string;
  properties?: Record<string, unknown>;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

interface GraphCanvasProps {
  data: GraphData;
  selectedNodeId?: string | null;
  onNodeSelect?: (node: GraphNode | null) => void;
  onNodeDoubleClick?: (node: GraphNode) => void;
  onEdgeSelect?: (edge: GraphEdge | null) => void;
  className?: string;
  layout?: 'cose' | 'breadthfirst' | 'circle' | 'concentric' | 'grid' | 'dagre';
}

// Color scheme for different node types (lowercase keys to match data)
const nodeColors: Record<string, string> = {
  dataset: '#3B82F6', // Blue
  metric: '#10B981', // Green
  process: '#F59E0B', // Amber
  report: '#EC4899', // Pink
  dashboard: '#06B6D4', // Cyan
  entity: '#8B5CF6', // Purple
  workflow: '#F97316', // Orange
  user: '#14B8A6', // Teal
  team: '#F97316', // Orange
  default: '#6B7280', // Gray
};

// Border/glow colors per type
const nodeBorderColors: Record<string, string> = {
  dataset: '#60A5FA',
  metric: '#34D399',
  process: '#FBBF24',
  report: '#F472B6',
  dashboard: '#22D3EE',
  entity: '#A78BFA',
  workflow: '#FB923C',
  user: '#2DD4BF',
  team: '#FB923C',
  default: '#9CA3AF',
};

// Edge colors by relationship type
const edgeColors: Record<string, string> = {
  feeds: '#3B82F6',
  derives: '#10B981',
  transforms: '#F59E0B',
  related: '#9CA3AF',
  owns: '#8B5CF6',
  DERIVES_FROM: '#3B82F6',
  CALCULATED_FROM: '#10B981',
  IMPACTS: '#F59E0B',
  OWNS: '#8B5CF6',
  USES: '#EC4899',
  default: '#4B5563',
};

export const GraphCanvas: React.FC<GraphCanvasProps> = ({
  data,
  selectedNodeId,
  onNodeSelect,
  onNodeDoubleClick,
  onEdgeSelect,
  className,
  layout = 'cose',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Convert data to Cytoscape format
  const getCytoscapeElements = useCallback(() => {
    const nodes = data.nodes.map((node) => ({
      data: {
        id: node.id,
        label: node.name,
        type: node.type,
        ...node.properties,
      },
    }));

    const edges = data.edges.map((edge, index) => ({
      data: {
        id: `edge-${index}`,
        source: edge.source,
        target: edge.target,
        type: edge.type,
        label: edge.type.replace(/_/g, ' ').toLowerCase(),
        ...edge.properties,
      },
    }));

    return [...nodes, ...edges];
  }, [data]);

  // Initialize Cytoscape
  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const cy = cytoscape({
      container: containerRef.current,
      elements: getCytoscapeElements(),
      style: [
        // Node styles
        {
          selector: 'node',
          style: {
            'background-color': (ele: NodeSingular) =>
              nodeColors[ele.data('type')] || nodeColors.default,
            label: 'data(label)',
            'text-valign': 'bottom',
            'text-halign': 'center',
            'text-margin-y': 8,
            'font-size': 12,
            'font-weight': 600,
            color: '#E5E7EB',
            'text-outline-color': '#111827',
            'text-outline-width': 2,
            width: 44,
            height: 44,
            'border-width': 3,
            'border-color': (ele: NodeSingular) =>
              nodeBorderColors[ele.data('type')] || nodeBorderColors.default,
            'border-opacity': 0.8,
            'background-opacity': 0.85,
            'transition-property': 'background-color, border-color, width, height',
            'transition-duration': 150,
          } as cytoscape.Css.Node,
        },
        // Selected node
        {
          selector: 'node:selected',
          style: {
            'border-width': 4,
            'border-color': '#FBBF24',
            width: 54,
            height: 54,
          } as cytoscape.Css.Node,
        },
        // Hovered node
        {
          selector: 'node:active',
          style: {
            'overlay-opacity': 0.15,
            'overlay-color': '#FBBF24',
          } as cytoscape.Css.Node,
        },
        // Edge styles
        {
          selector: 'edge',
          style: {
            width: 1.5,
            'line-color': (ele: EdgeSingular) => edgeColors[ele.data('type')] || edgeColors.default,
            'line-opacity': 0.6,
            'target-arrow-color': (ele: EdgeSingular) =>
              edgeColors[ele.data('type')] || edgeColors.default,
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            label: 'data(label)',
            'font-size': 9,
            color: '#9CA3AF',
            'text-rotation': 'autorotate',
            'text-margin-y': -10,
            'text-background-color': '#1F2937',
            'text-background-opacity': 0.9,
            'text-background-padding': 2,
          } as unknown as cytoscape.Css.Edge,
        },
        // Selected edge
        {
          selector: 'edge:selected',
          style: {
            width: 3,
            'line-color': '#FBBF24',
            'target-arrow-color': '#FBBF24',
            'line-opacity': 1,
          } as cytoscape.Css.Edge,
        },
        // Inferred (heuristic) edges
        {
          selector: 'edge[inferred = true]',
          style: {
            'line-style': 'dashed',
          } as cytoscape.Css.Edge,
        },
        // Dimmed elements (when filtering)
        {
          selector: '.dimmed',
          style: {
            opacity: 0.2,
          } as cytoscape.Css.Node,
        },
        // Highlighted path
        {
          selector: '.highlighted',
          style: {
            'background-color': '#1D4ED8',
            'line-color': '#1D4ED8',
            'target-arrow-color': '#1D4ED8',
          } as cytoscape.Css.Node,
        },
      ],
      layout: {
        name: layout,
        animate: true,
        animationDuration: 500,
        fit: true,
        padding: 50,
        ...(layout === 'cose'
          ? {
              nodeRepulsion: () => 8000,
              idealEdgeLength: () => 100,
              edgeElasticity: () => 100,
              gravity: 0.25,
              numIter: 1000,
            }
          : {}),
      },
      minZoom: 0.2,
      maxZoom: 3,
      wheelSensitivity: 0.3,
    });

    cyRef.current = cy;

    // Event handlers
    cy.on('tap', 'node', (evt: EventObject) => {
      const node = evt.target;
      const nodeData: GraphNode = {
        id: node.data('id'),
        type: node.data('type'),
        name: node.data('label'),
        properties: node.data(),
      };
      onNodeSelect?.(nodeData);
    });

    cy.on('tap', 'edge', (evt: EventObject) => {
      const edge = evt.target;
      const edgeData: GraphEdge = {
        source: edge.data('source'),
        target: edge.data('target'),
        type: edge.data('type'),
        properties: edge.data(),
      };
      onEdgeSelect?.(edgeData);
    });

    cy.on('tap', (evt: EventObject) => {
      if (evt.target === cy) {
        onNodeSelect?.(null);
        onEdgeSelect?.(null);
      }
    });

    cy.on('dbltap', 'node', (evt: EventObject) => {
      const node = evt.target;
      const nodeData: GraphNode = {
        id: node.data('id'),
        type: node.data('type'),
        name: node.data('label'),
        properties: node.data(),
      };
      onNodeDoubleClick?.(nodeData);
    });

    setIsInitialized(true);

    return () => {
      cy.destroy();
      cyRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update elements when data changes
  useEffect(() => {
    if (!cyRef.current || !isInitialized) {
      return;
    }

    const cy = cyRef.current;
    cy.elements().remove();
    cy.add(getCytoscapeElements());
    cy.layout({
      name: layout,
      animate: true,
      animationDuration: 500,
      fit: true,
      padding: 50,
    }).run();
  }, [data, isInitialized, getCytoscapeElements, layout]);

  // Handle external selection
  useEffect(() => {
    if (!cyRef.current || !isInitialized) {
      return;
    }

    const cy = cyRef.current;
    cy.elements().unselect();

    if (selectedNodeId) {
      const node = cy.getElementById(selectedNodeId);
      if (node.length > 0) {
        node.select();
        cy.animate({
          center: { eles: node },
          zoom: 1.5,
          duration: 300,
        });
      }
    }
  }, [selectedNodeId, isInitialized]);

  // Public methods exposed via ref
  const zoomIn = useCallback(() => {
    cyRef.current?.zoom(cyRef.current.zoom() * 1.2);
  }, []);

  const zoomOut = useCallback(() => {
    cyRef.current?.zoom(cyRef.current.zoom() * 0.8);
  }, []);

  const fitToScreen = useCallback(() => {
    cyRef.current?.fit(undefined, 50);
  }, []);

  const resetView = useCallback(() => {
    cyRef.current?.reset();
  }, []);

  const highlightPath = useCallback((nodeIds: string[]) => {
    if (!cyRef.current) {
      return;
    }

    const cy = cyRef.current;
    cy.elements().removeClass('highlighted dimmed');

    if (nodeIds.length === 0) {
      return;
    }

    const nodes = cy.nodes().filter((n) => nodeIds.includes(n.data('id')));
    const edges = nodes.edgesWith(nodes);

    cy.elements().addClass('dimmed');
    nodes.removeClass('dimmed').addClass('highlighted');
    edges.removeClass('dimmed').addClass('highlighted');
  }, []);

  const clearHighlight = useCallback(() => {
    cyRef.current?.elements().removeClass('highlighted dimmed');
  }, []);

  return (
    <div className={cn('relative w-full h-full bg-gray-950 rounded-lg overflow-hidden', className)}>
      {/* Graph container */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Controls */}
      <div className="absolute bottom-4 left-4 flex gap-2 bg-gray-800/90 border border-gray-700 rounded-lg shadow-lg p-1">
        <button
          onClick={zoomIn}
          className="p-2 hover:bg-gray-700 rounded transition-colors text-gray-300"
          title="Zoom In"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </button>
        <button
          onClick={zoomOut}
          className="p-2 hover:bg-gray-700 rounded transition-colors text-gray-300"
          title="Zoom Out"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
          </svg>
        </button>
        <div className="w-px bg-gray-600" />
        <button
          onClick={fitToScreen}
          className="p-2 hover:bg-gray-700 rounded transition-colors text-gray-300"
          title="Fit to Screen"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
            />
          </svg>
        </button>
        <button
          onClick={resetView}
          className="p-2 hover:bg-gray-700 rounded transition-colors text-gray-300"
          title="Reset View"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-gray-800/90 border border-gray-700 rounded-lg shadow-lg p-3">
        <h4 className="text-xs font-semibold text-gray-400 mb-2">LEGEND</h4>
        <div className="space-y-1.5">
          {Object.entries(nodeColors)
            .filter(([k]) => k !== 'default')
            .map(([type, color]) => (
              <div key={type} className="flex items-center gap-2 text-xs">
                <span className="w-3 h-3 rounded-full border" style={{ backgroundColor: color, borderColor: nodeBorderColors[type] || color }} />
                <span className="text-gray-300 capitalize">{type}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default GraphCanvas;
