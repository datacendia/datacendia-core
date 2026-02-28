// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
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

// Color scheme for different node types
const nodeColors: Record<string, string> = {
  Dataset: '#3B82F6', // Blue
  Metric: '#10B981', // Green
  Process: '#8B5CF6', // Purple
  Report: '#F59E0B', // Amber
  Dashboard: '#EC4899', // Pink
  Entity: '#6366F1', // Indigo
  User: '#14B8A6', // Teal
  Team: '#F97316', // Orange
  default: '#6B7280', // Gray
};

// Edge colors by relationship type
const edgeColors: Record<string, string> = {
  DERIVES_FROM: '#3B82F6',
  CALCULATED_FROM: '#10B981',
  IMPACTS: '#F59E0B',
  OWNS: '#8B5CF6',
  USES: '#EC4899',
  default: '#9CA3AF',
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
            'font-weight': 500,
            color: '#374151',
            'text-outline-color': '#ffffff',
            'text-outline-width': 2,
            width: 40,
            height: 40,
            'border-width': 2,
            'border-color': '#ffffff',
            'transition-property': 'background-color, border-color, width, height',
            'transition-duration': 150,
          } as cytoscape.Css.Node,
        },
        // Selected node
        {
          selector: 'node:selected',
          style: {
            'border-width': 3,
            'border-color': '#1D4ED8',
            width: 50,
            height: 50,
          } as cytoscape.Css.Node,
        },
        // Hovered node
        {
          selector: 'node:active',
          style: {
            'overlay-opacity': 0.1,
          } as cytoscape.Css.Node,
        },
        // Edge styles
        {
          selector: 'edge',
          style: {
            width: 2,
            'line-color': (ele: EdgeSingular) => edgeColors[ele.data('type')] || edgeColors.default,
            'target-arrow-color': (ele: EdgeSingular) =>
              edgeColors[ele.data('type')] || edgeColors.default,
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            label: 'data(label)',
            'font-size': 10,
            color: '#6B7280',
            'text-rotation': 'autorotate',
            'text-margin-y': -10,
            'text-background-color': '#ffffff',
            'text-background-opacity': 0.8,
            'text-background-padding': 2,
          } as unknown as cytoscape.Css.Edge,
        },
        // Selected edge
        {
          selector: 'edge:selected',
          style: {
            width: 3,
            'line-color': '#1D4ED8',
            'target-arrow-color': '#1D4ED8',
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
    <div className={cn('relative w-full h-full bg-gray-50 rounded-lg overflow-hidden', className)}>
      {/* Graph container */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Controls */}
      <div className="absolute bottom-4 left-4 flex gap-2 bg-white rounded-lg shadow-lg p-1">
        <button
          onClick={zoomIn}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
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
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="Zoom Out"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
          </svg>
        </button>
        <div className="w-px bg-gray-200" />
        <button
          onClick={fitToScreen}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
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
          className="p-2 hover:bg-gray-100 rounded transition-colors"
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
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3">
        <h4 className="text-xs font-semibold text-gray-500 mb-2">LEGEND</h4>
        <div className="space-y-1">
          {Object.entries(nodeColors)
            .filter(([k]) => k !== 'default')
            .slice(0, 5)
            .map(([type, color]) => (
              <div key={type} className="flex items-center gap-2 text-xs">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-gray-600">{type}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default GraphCanvas;
