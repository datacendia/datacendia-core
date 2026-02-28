// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Workflow Builder Component
 * Visual drag-and-drop workflow editor
 */
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { cn } from '../../../lib/utils';
import { workflowsApi } from '../../lib/api';
import type {
  Workflow,
  WorkflowNode as ApiWorkflowNode,
  WorkflowEdge as ApiWorkflowEdge,
} from '../../lib/api/types';

// =============================================================================
// TYPES
// =============================================================================

interface Position {
  x: number;
  y: number;
}

interface WorkflowNode {
  id: string;
  type: 'trigger' | 'query' | 'transform' | 'condition' | 'action' | 'approval' | 'notification';
  label: string;
  config: Record<string, unknown>;
  position: Position;
}

interface WorkflowEdge {
  id: string;
  from: string;
  to: string;
  condition?: string;
  label?: string;
}

interface WorkflowBuilderProps {
  workflowId?: string;
  initialNodes?: WorkflowNode[];
  initialEdges?: WorkflowEdge[];
  onSave?: (nodes: WorkflowNode[], edges: WorkflowEdge[]) => void;
  onChange?: (nodes: WorkflowNode[], edges: WorkflowEdge[]) => void;
}

// =============================================================================
// NODE TYPES CATALOG
// =============================================================================

const nodeTypes = {
  triggers: [
    {
      type: 'trigger',
      subtype: 'schedule',
      label: 'Schedule',
      icon: '⏰',
      description: 'Run on a schedule',
    },
    {
      type: 'trigger',
      subtype: 'event',
      label: 'Event',
      icon: '📨',
      description: 'Triggered by an event',
    },
    {
      type: 'trigger',
      subtype: 'webhook',
      label: 'Webhook',
      icon: '🔗',
      description: 'External webhook trigger',
    },
    {
      type: 'trigger',
      subtype: 'manual',
      label: 'Manual',
      icon: '👤',
      description: 'Manual execution',
    },
  ],
  actions: [
    {
      type: 'query',
      subtype: 'query',
      label: 'Query Data',
      icon: '📊',
      description: 'Query from data source',
    },
    {
      type: 'transform',
      subtype: 'transform',
      label: 'Transform',
      icon: '🔄',
      description: 'Transform data',
    },
    {
      type: 'action',
      subtype: 'create',
      label: 'Create Record',
      icon: '📝',
      description: 'Create a new record',
    },
    {
      type: 'action',
      subtype: 'update',
      label: 'Update Record',
      icon: '✏️',
      description: 'Update existing record',
    },
    {
      type: 'action',
      subtype: 'api',
      label: 'API Call',
      icon: '🔌',
      description: 'Call external API',
    },
  ],
  logic: [
    {
      type: 'condition',
      subtype: 'if',
      label: 'If/Else',
      icon: '◇',
      description: 'Conditional branching',
    },
    {
      type: 'condition',
      subtype: 'loop',
      label: 'Loop',
      icon: '⟳',
      description: 'Iterate over items',
    },
    {
      type: 'approval',
      subtype: 'approval',
      label: 'Approval',
      icon: '✓',
      description: 'Request approval',
    },
    {
      type: 'condition',
      subtype: 'wait',
      label: 'Wait',
      icon: '⏸',
      description: 'Wait for duration/condition',
    },
  ],
  notifications: [
    {
      type: 'notification',
      subtype: 'email',
      label: 'Email',
      icon: '📧',
      description: 'Send email',
    },
    {
      type: 'notification',
      subtype: 'slack',
      label: 'Slack',
      icon: '💬',
      description: 'Send Slack message',
    },
    {
      type: 'notification',
      subtype: 'alert',
      label: 'Alert',
      icon: '🔔',
      description: 'Create alert',
    },
  ],
};

// Node colors
const nodeColors: Record<string, { bg: string; border: string }> = {
  trigger: { bg: '#DBEAFE', border: '#3B82F6' },
  query: { bg: '#D1FAE5', border: '#10B981' },
  transform: { bg: '#FEF3C7', border: '#F59E0B' },
  condition: { bg: '#EDE9FE', border: '#8B5CF6' },
  action: { bg: '#FCE7F3', border: '#EC4899' },
  approval: { bg: '#CFFAFE', border: '#06B6D4' },
  notification: { bg: '#FFEDD5', border: '#F97316' },
};

// =============================================================================
// NODE COMPONENT
// =============================================================================

interface NodeComponentProps {
  node: WorkflowNode;
  isSelected: boolean;
  onSelect: () => void;
  onDragStart: (e: React.MouseEvent) => void;
  onDelete: () => void;
  onConfigure: () => void;
}

const NodeComponent: React.FC<NodeComponentProps> = ({
  node,
  isSelected,
  onSelect,
  onDragStart,
  onDelete,
  onConfigure,
}) => {
  const colors = nodeColors[node.type] || { bg: '#F3F4F6', border: '#9CA3AF' };

  return (
    <div
      className={cn(
        'absolute w-40 rounded-lg shadow-md cursor-move transition-shadow',
        isSelected && 'ring-2 ring-primary-500 shadow-lg'
      )}
      style={{
        left: node.position.x,
        top: node.position.y,
        backgroundColor: colors.bg,
        borderColor: colors.border,
        borderWidth: 2,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onMouseDown={onDragStart}
    >
      {/* Header */}
      <div
        className="px-3 py-2 border-b flex items-center gap-2"
        style={{ borderColor: colors.border }}
      >
        <span className="text-lg">{getNodeIcon(node)}</span>
        <span className="text-sm font-medium truncate flex-1">{node.label}</span>
      </div>

      {/* Body */}
      <div className="px-3 py-2">
        <p className="text-xs text-neutral-500 truncate">{getNodeDescription(node)}</p>
      </div>

      {/* Actions (visible when selected) */}
      {isSelected && (
        <div className="absolute -top-3 -right-3 flex gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onConfigure();
            }}
            className="w-6 h-6 rounded-full bg-white border border-neutral-300 flex items-center justify-center text-xs hover:bg-neutral-100"
            title="Configure"
          >
            ⚙️
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="w-6 h-6 rounded-full bg-white border border-red-300 flex items-center justify-center text-xs hover:bg-red-50"
            title="Delete"
          >
            🗑️
          </button>
        </div>
      )}

      {/* Connection points */}
      <div
        className="absolute left-1/2 -translate-x-1/2 -top-2 w-4 h-4 rounded-full bg-white border-2 cursor-crosshair"
        style={{ borderColor: colors.border }}
        title="Input"
      />
      <div
        className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-4 h-4 rounded-full bg-white border-2 cursor-crosshair"
        style={{ borderColor: colors.border }}
        title="Output"
      />
    </div>
  );
};

function getNodeIcon(node: WorkflowNode): string {
  const config = node.config as { subtype?: string };
  const allTypes = [
    ...nodeTypes.triggers,
    ...nodeTypes.actions,
    ...nodeTypes.logic,
    ...nodeTypes.notifications,
  ];
  const found = allTypes.find(
    (t) => t.type === node.type && (!config.subtype || t.subtype === config.subtype)
  );
  return found?.icon || '📦';
}

function getNodeDescription(node: WorkflowNode): string {
  const config = node.config as { subtype?: string };
  const allTypes = [
    ...nodeTypes.triggers,
    ...nodeTypes.actions,
    ...nodeTypes.logic,
    ...nodeTypes.notifications,
  ];
  const found = allTypes.find(
    (t) => t.type === node.type && (!config.subtype || t.subtype === config.subtype)
  );
  return found?.description || 'Workflow step';
}

// =============================================================================
// EDGE COMPONENT
// =============================================================================

interface EdgeComponentProps {
  edge: WorkflowEdge;
  fromNode: WorkflowNode;
  toNode: WorkflowNode;
  isSelected: boolean;
  onSelect: () => void;
}

const EdgeComponent: React.FC<EdgeComponentProps> = ({
  edge,
  fromNode,
  toNode,
  isSelected,
  onSelect,
}) => {
  const fromX = fromNode.position.x + 80; // center of node
  const fromY = fromNode.position.y + 80; // bottom of node
  const toX = toNode.position.x + 80;
  const toY = toNode.position.y; // top of node

  // Calculate control points for bezier curve
  const midY = (fromY + toY) / 2;
  const path = `M ${fromX} ${fromY} C ${fromX} ${midY}, ${toX} ${midY}, ${toX} ${toY}`;

  return (
    <g onClick={onSelect} className="cursor-pointer">
      {/* Invisible wider path for easier clicking */}
      <path d={path} fill="none" stroke="transparent" strokeWidth={20} />
      {/* Visible path */}
      <path
        d={path}
        fill="none"
        stroke={isSelected ? '#6366F1' : '#94A3B8'}
        strokeWidth={isSelected ? 3 : 2}
        strokeDasharray={edge.condition ? '5,5' : undefined}
        markerEnd="url(#arrowhead)"
      />
      {/* Label */}
      {edge.label && (
        <text
          x={(fromX + toX) / 2}
          y={(fromY + toY) / 2}
          textAnchor="middle"
          className="text-xs fill-neutral-500"
        >
          {edge.label}
        </text>
      )}
    </g>
  );
};

// =============================================================================
// PALETTE COMPONENT
// =============================================================================

interface PaletteProps {
  onDragStart: (nodeType: (typeof nodeTypes.triggers)[0]) => void;
}

const Palette: React.FC<PaletteProps> = ({ onDragStart }) => {
  const [expandedCategory, setExpandedCategory] = useState<string>('triggers');

  const categories = [
    { key: 'triggers', label: 'Triggers', items: nodeTypes.triggers },
    { key: 'actions', label: 'Actions', items: nodeTypes.actions },
    { key: 'logic', label: 'Logic', items: nodeTypes.logic },
    { key: 'notifications', label: 'Notifications', items: nodeTypes.notifications },
  ];

  return (
    <div className="w-56 bg-white border-r border-neutral-200 overflow-y-auto">
      <div className="p-3 border-b border-neutral-200">
        <h3 className="font-semibold text-neutral-900">Components</h3>
        <p className="text-xs text-neutral-500">Drag to add to canvas</p>
      </div>

      {categories.map((category) => (
        <div key={category.key}>
          <button
            onClick={() =>
              setExpandedCategory(expandedCategory === category.key ? '' : category.key)
            }
            className="w-full px-3 py-2 flex items-center justify-between text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          >
            <span>{category.label}</span>
            <span className="text-neutral-400">
              {expandedCategory === category.key ? '▼' : '▶'}
            </span>
          </button>

          {expandedCategory === category.key && (
            <div className="px-2 pb-2 space-y-1">
              {category.items.map((item, idx) => (
                <div
                  key={idx}
                  draggable
                  onDragStart={() => onDragStart(item)}
                  className="flex items-center gap-2 p-2 rounded-lg cursor-grab hover:bg-neutral-100 transition-colors"
                  style={{ backgroundColor: `${nodeColors[item.type]?.bg}40` }}
                >
                  <span className="text-lg">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-800">{item.label}</p>
                    <p className="text-xs text-neutral-500 truncate">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// =============================================================================
// CONFIG PANEL COMPONENT
// =============================================================================

interface ConfigPanelProps {
  node: WorkflowNode | null;
  onUpdate: (config: Record<string, unknown>) => void;
  onClose: () => void;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({ node, onUpdate, onClose }) => {
  if (!node) {
    return null;
  }

  return (
    <div className="w-72 bg-white border-l border-neutral-200 overflow-y-auto">
      <div className="p-3 border-b border-neutral-200 flex items-center justify-between">
        <h3 className="font-semibold text-neutral-900">Configure: {node.label}</h3>
        <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
          ✕
        </button>
      </div>

      <div className="p-3 space-y-4">
        {/* Node Label */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Label</label>
          <input
            type="text"
            value={node.label}
            onChange={(e) => onUpdate({ ...node.config, label: e.target.value })}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Type-specific configuration */}
        {node.type === 'trigger' && (
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Schedule (cron)
            </label>
            <input
              type="text"
              placeholder="0 9 * * 1-5"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <p className="text-xs text-neutral-500 mt-1">e.g., "0 9 * * 1-5" for weekdays at 9am</p>
          </div>
        )}

        {node.type === 'query' && (
          <>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Data Source</label>
              <select className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option>Select source...</option>
                <option>Sales Mart</option>
                <option>CRM Export</option>
                <option>Financial Data</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Query</label>
              <textarea
                rows={3}
                placeholder="SELECT * FROM..."
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </>
        )}

        {node.type === 'condition' && (
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Condition</label>
            <input
              type="text"
              placeholder="{{value}} > 100"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        )}

        {node.type === 'notification' && (
          <>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Recipients</label>
              <input
                type="text"
                placeholder="email@example.com"
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Message</label>
              <textarea
                rows={3}
                placeholder="Enter message..."
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </>
        )}

        <div className="pt-3 border-t border-neutral-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
          >
            Apply Configuration
          </button>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({
  workflowId,
  initialNodes = [],
  initialEdges = [],
  onSave,
  onChange,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<WorkflowNode[]>(initialNodes);
  const [edges, setEdges] = useState<WorkflowEdge[]>(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [configuringNode, setConfiguringNode] = useState<WorkflowNode | null>(null);
  const [draggedType, setDraggedType] = useState<(typeof nodeTypes.triggers)[0] | null>(null);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });

  // Notify parent of changes
  useEffect(() => {
    onChange?.(nodes, edges);
  }, [nodes, edges, onChange]);

  // Handle dropping a new node from palette
  const handleCanvasDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!draggedType || !canvasRef.current) {
        return;
      }

      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - 80;
      const y = e.clientY - rect.top - 40;

      const newNode: WorkflowNode = {
        id: `node-${Date.now()}`,
        type: draggedType.type as WorkflowNode['type'],
        label: draggedType.label,
        config: { subtype: draggedType.subtype },
        position: { x, y },
      };

      setNodes((prev) => [...prev, newNode]);
      setDraggedType(null);
    },
    [draggedType]
  );

  // Handle node dragging
  const handleNodeDragStart = useCallback(
    (nodeId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      const node = nodes.find((n) => n.id === nodeId);
      if (!node) {
        return;
      }

      setDraggingNodeId(nodeId);
      setDragOffset({
        x: e.clientX - node.position.x,
        y: e.clientY - node.position.y,
      });
    },
    [nodes]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!draggingNodeId) {
        return;
      }

      setNodes((prev) =>
        prev.map((node) =>
          node.id === draggingNodeId
            ? { ...node, position: { x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y } }
            : node
        )
      );
    },
    [draggingNodeId, dragOffset]
  );

  const handleMouseUp = useCallback(() => {
    setDraggingNodeId(null);
  }, []);

  // Delete node
  const handleDeleteNode = useCallback((nodeId: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== nodeId));
    setEdges((prev) => prev.filter((e) => e.from !== nodeId && e.to !== nodeId));
    setSelectedNodeId(null);
  }, []);

  // Update node config
  const handleUpdateNodeConfig = useCallback(
    (config: Record<string, unknown>) => {
      if (!configuringNode) {
        return;
      }
      setNodes((prev) =>
        prev.map((n) =>
          n.id === configuringNode.id ? { ...n, config: { ...n.config, ...config } } : n
        )
      );
    },
    [configuringNode]
  );

  // Save workflow
  const handleSave = useCallback(async () => {
    onSave?.(nodes, edges);

    if (workflowId) {
      try {
        await workflowsApi.updateWorkflow(workflowId, {
          definition: { nodes, edges } as any,
        });
      } catch (err) {
        console.error('Failed to save workflow:', err);
      }
    }
  }, [nodes, edges, workflowId, onSave]);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  return (
    <div className="flex h-full bg-neutral-100">
      {/* Palette */}
      <Palette onDragStart={setDraggedType} />

      {/* Canvas */}
      <div
        ref={canvasRef}
        className="flex-1 relative overflow-hidden"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleCanvasDrop}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={() => {
          setSelectedNodeId(null);
          setSelectedEdgeId(null);
        }}
      >
        {/* Grid background */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E5E7EB" strokeWidth="0.5" />
            </pattern>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#94A3B8" />
            </marker>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Edges */}
          {edges.map((edge) => {
            const fromNode = nodes.find((n) => n.id === edge.from);
            const toNode = nodes.find((n) => n.id === edge.to);
            if (!fromNode || !toNode) {
              return null;
            }
            return (
              <EdgeComponent
                key={edge.id}
                edge={edge}
                fromNode={fromNode}
                toNode={toNode}
                isSelected={selectedEdgeId === edge.id}
                onSelect={() => setSelectedEdgeId(edge.id)}
              />
            );
          })}
        </svg>

        {/* Nodes */}
        {nodes.map((node) => (
          <NodeComponent
            key={node.id}
            node={node}
            isSelected={selectedNodeId === node.id}
            onSelect={() => setSelectedNodeId(node.id)}
            onDragStart={(e) => handleNodeDragStart(node.id, e)}
            onDelete={() => handleDeleteNode(node.id)}
            onConfigure={() => setConfiguringNode(node)}
          />
        ))}

        {/* Empty state */}
        {nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="text-4xl mb-2">📋</div>
              <p className="text-neutral-500">
                Drag components from the left panel to build your workflow
              </p>
            </div>
          </div>
        )}

        {/* Toolbar */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 shadow-md"
          >
            Save Workflow
          </button>
        </div>
      </div>

      {/* Config Panel */}
      <ConfigPanel
        node={configuringNode}
        onUpdate={handleUpdateNodeConfig}
        onClose={() => setConfiguringNode(null)}
      />
    </div>
  );
};

export default WorkflowBuilder;
