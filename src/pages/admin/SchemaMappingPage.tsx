// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Schema Mapping Admin Page
 * Configure how client database schemas map to Datacendia's canonical data model
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Database,
  Table2,
  Columns,
  Link2,
  Check,
  X,
  AlertTriangle,
  RefreshCw,
  Save,
  Wand2,
  ChevronDown,
  ChevronRight,
  Search,
  Filter,
  Eye,
  Code,
  Settings,
  HelpCircle,
  Zap,
} from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

interface SourceColumn {
  name: string;
  type: string;
  nullable: boolean;
  sampleValues?: any[];
}

interface SourceTable {
  name: string;
  schema: string;
  columns: SourceColumn[];
  rowCount?: number;
}

interface ColumnMapping {
  sourceColumn: string;
  canonicalField: string;
  transformation?: {
    type: string;
    config: Record<string, any>;
  };
  confidence: number;
  isManual: boolean;
}

interface TableMapping {
  id: string;
  dataSourceId: string;
  sourceTable: string;
  sourceSchema: string;
  canonicalEntity: string;
  columnMappings: ColumnMapping[];
  filters?: string;
  isActive: boolean;
}

interface SchemaMapping {
  id: string;
  dataSourceId: string;
  organizationId: string;
  name: string;
  description?: string;
  tableMappings: TableMapping[];
  version: number;
  isActive: boolean;
}

interface DataSource {
  id: string;
  name: string;
  type: string;
  status: string;
}

// =============================================================================
// CANONICAL MODEL (matches backend)
// =============================================================================

const CANONICAL_ENTITIES = [
  'organization', 'person', 'customer', 'employee', 'product', 'service',
  'transaction', 'invoice', 'payment', 'account', 'order', 'shipment',
  'inventory', 'asset', 'metric', 'kpi', 'target', 'event', 'log',
  'measurement', 'contract', 'project', 'task',
];

const CANONICAL_FIELDS: Record<string, { type: string; description: string }> = {
  id: { type: 'string', description: 'Unique identifier' },
  external_id: { type: 'string', description: 'External system identifier' },
  name: { type: 'string', description: 'Display name' },
  code: { type: 'string', description: 'Short code/SKU' },
  description: { type: 'text', description: 'Long description' },
  category: { type: 'string', description: 'Category/type classification' },
  tags: { type: 'array', description: 'Tags/labels' },
  status: { type: 'string', description: 'Current status' },
  created_at: { type: 'datetime', description: 'Creation timestamp' },
  updated_at: { type: 'datetime', description: 'Last update timestamp' },
  amount: { type: 'decimal', description: 'Monetary amount' },
  currency: { type: 'string', description: 'Currency code (ISO 4217)' },
  quantity: { type: 'decimal', description: 'Quantity/count' },
  email: { type: 'string', description: 'Email address' },
  phone: { type: 'string', description: 'Phone number' },
  value: { type: 'decimal', description: 'Numeric value' },
  unit: { type: 'string', description: 'Unit of measurement' },
};

// =============================================================================
// COMPONENT
// =============================================================================

export const SchemaMappingPage: React.FC = () => {
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [selectedDataSource, setSelectedDataSource] = useState<DataSource | null>(null);
  const [sourceTables, setSourceTables] = useState<SourceTable[]>([]);
  const [mapping, setMapping] = useState<SchemaMapping | null>(null);
  const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [previewQuery, setPreviewQuery] = useState<{ sql: string; params: any[] } | null>(null);

  // Load data sources on mount
  useEffect(() => {
    loadDataSources();
  }, []);

  const loadDataSources = async () => {
    try {
      const response = await fetch('/api/v1/data-sources');
      const data = await response.json();
      if (data.success) {
        setDataSources(data.dataSources || []);
      }
    } catch (error) {
      console.error('Failed to load data sources:', error);
      // Use mock data for demo
      setDataSources([
        { id: 'ds-1', name: 'Production PostgreSQL', type: 'POSTGRESQL', status: 'connected' },
        { id: 'ds-2', name: 'Sales Snowflake', type: 'SNOWFLAKE', status: 'connected' },
        { id: 'ds-3', name: 'Legacy MySQL', type: 'MYSQL', status: 'disconnected' },
      ]);
    }
  };

  const loadSourceSchema = async (dataSourceId: string) => {
    setIsLoading(true);
    try {
      // Try to get existing mapping
      const mappingRes = await fetch(`/api/v1/schema/mappings/${dataSourceId}`);
      const mappingData = await mappingRes.json();
      
      if (mappingData.success && mappingData.mapping) {
        setMapping(mappingData.mapping);
      }

      // Get source tables (mock for now - would come from connector)
      setSourceTables([
        {
          name: 'customers',
          schema: 'public',
          rowCount: 15420,
          columns: [
            { name: 'cust_id', type: 'uuid', nullable: false },
            { name: 'full_name', type: 'varchar(255)', nullable: false },
            { name: 'email_address', type: 'varchar(255)', nullable: true },
            { name: 'phone_num', type: 'varchar(50)', nullable: true },
            { name: 'created_date', type: 'timestamp', nullable: false },
            { name: 'is_active', type: 'boolean', nullable: false },
          ],
        },
        {
          name: 'orders',
          schema: 'public',
          rowCount: 89234,
          columns: [
            { name: 'order_id', type: 'uuid', nullable: false },
            { name: 'customer_id', type: 'uuid', nullable: false },
            { name: 'order_date', type: 'timestamp', nullable: false },
            { name: 'total_amount', type: 'decimal(12,2)', nullable: false },
            { name: 'currency_code', type: 'varchar(3)', nullable: false },
            { name: 'status_code', type: 'varchar(20)', nullable: false },
          ],
        },
        {
          name: 'products',
          schema: 'inventory',
          rowCount: 3421,
          columns: [
            { name: 'prod_id', type: 'uuid', nullable: false },
            { name: 'sku', type: 'varchar(50)', nullable: false },
            { name: 'product_name', type: 'varchar(255)', nullable: false },
            { name: 'description', type: 'text', nullable: true },
            { name: 'unit_price', type: 'decimal(10,2)', nullable: false },
            { name: 'qty_on_hand', type: 'integer', nullable: false },
          ],
        },
      ]);
    } catch (error) {
      console.error('Failed to load schema:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestMappings = async () => {
    if (!selectedDataSource || sourceTables.length === 0) {return;}

    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/schema/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dataSourceId: selectedDataSource.id,
          tables: sourceTables,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setMapping({
          id: `mapping-${selectedDataSource.id}`,
          dataSourceId: selectedDataSource.id,
          organizationId: 'org-1', // Would come from auth context
          name: `${selectedDataSource.name} Mapping`,
          tableMappings: data.suggestions,
          version: 1,
          isActive: true,
        });
      }
    } catch (error) {
      console.error('Failed to suggest mappings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveMapping = async () => {
    if (!mapping) {return;}

    setIsSaving(true);
    try {
      const response = await fetch('/api/v1/schema/mappings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mapping),
      });

      const data = await response.json();
      if (data.success) {
        setMapping(data.mapping);
      }
    } catch (error) {
      console.error('Failed to save mapping:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const updateColumnMapping = (
    tableId: string,
    sourceColumn: string,
    updates: Partial<ColumnMapping>
  ) => {
    if (!mapping) {return;}

    setMapping({
      ...mapping,
      tableMappings: mapping.tableMappings.map((table) => {
        if (table.id !== tableId) {return table;}
        return {
          ...table,
          columnMappings: table.columnMappings.map((col) => {
            if (col.sourceColumn !== sourceColumn) {return col;}
            return { ...col, ...updates, isManual: true };
          }),
        };
      }),
    });
  };

  const previewQueryTransform = async (tableMapping: TableMapping) => {
    if (!selectedDataSource) {return;}

    try {
      const response = await fetch('/api/v1/schema/transform-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dataSourceId: selectedDataSource.id,
          entity: tableMapping.canonicalEntity,
          fields: tableMapping.columnMappings.map((c) => c.canonicalField),
        }),
      });

      const data = await response.json();
      if (data.success) {
        setPreviewQuery({ sql: data.sql, params: data.params });
        setShowPreview(true);
      }
    } catch (error) {
      console.error('Failed to preview query:', error);
    }
  };

  const toggleTable = (tableId: string) => {
    const newExpanded = new Set(expandedTables);
    if (newExpanded.has(tableId)) {
      newExpanded.delete(tableId);
    } else {
      newExpanded.add(tableId);
    }
    setExpandedTables(newExpanded);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) {return 'text-green-400';}
    if (confidence >= 0.5) {return 'text-yellow-400';}
    return 'text-red-400';
  };

  const getConfidenceBg = (confidence: number) => {
    if (confidence >= 0.8) {return 'bg-green-500/20';}
    if (confidence >= 0.5) {return 'bg-yellow-500/20';}
    return 'bg-red-500/20';
  };

  const filteredTables = sourceTables.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.schema.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Database className="w-7 h-7 text-cyan-500" />
          Schema Mapping
        </h1>
        <p className="text-slate-400 mt-1">
          Map client database schemas to Datacendia's canonical data model
        </p>
      </div>

      {/* Data Source Selector */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 mb-6">
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Select Data Source
        </label>
        <div className="flex gap-4">
          <select
            value={selectedDataSource?.id || ''}
            onChange={(e) => {
              const ds = dataSources.find((d) => d.id === e.target.value);
              setSelectedDataSource(ds || null);
              if (ds) {loadSourceSchema(ds.id);}
            }}
            className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="">Choose a data source...</option>
            {dataSources.map((ds) => (
              <option key={ds.id} value={ds.id}>
                {ds.name} ({ds.type}) - {ds.status}
              </option>
            ))}
          </select>
          <button
            onClick={loadDataSources}
            className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {selectedDataSource && (
        <>
          {/* Actions Bar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search tables..."
                  className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 w-64"
                />
              </div>
              <span className="text-slate-400 text-sm">
                {filteredTables.length} tables found
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={suggestMappings}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-white font-medium disabled:opacity-50"
              >
                <Wand2 className="w-4 h-4" />
                Auto-Suggest Mappings
              </button>
              <button
                onClick={saveMapping}
                disabled={isSaving || !mapping}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white font-medium disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Mapping'}
              </button>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 text-cyan-500 animate-spin" />
              <span className="ml-3 text-slate-300">Loading schema...</span>
            </div>
          )}

          {/* Tables List */}
          {!isLoading && (
            <div className="space-y-4">
              {filteredTables.map((table) => {
                const tableMapping = mapping?.tableMappings.find(
                  (t) => t.sourceTable === table.name && t.sourceSchema === table.schema
                );
                const tableId = `${table.schema}.${table.name}`;
                const isExpanded = expandedTables.has(tableId);

                return (
                  <div
                    key={tableId}
                    className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden"
                  >
                    {/* Table Header */}
                    <div
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-700/50"
                      onClick={() => toggleTable(tableId)}
                    >
                      <div className="flex items-center gap-3">
                        {isExpanded ? (
                          <ChevronDown className="w-5 h-5 text-slate-400" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-slate-400" />
                        )}
                        <Table2 className="w-5 h-5 text-cyan-500" />
                        <div>
                          <span className="text-white font-medium">
                            {table.schema}.{table.name}
                          </span>
                          <span className="text-slate-400 text-sm ml-2">
                            ({table.columns.length} columns, {table.rowCount?.toLocaleString()} rows)
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {tableMapping && (
                          <>
                            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm">
                              → {tableMapping.canonicalEntity}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                previewQueryTransform(tableMapping);
                              }}
                              className="p-2 hover:bg-slate-600 rounded-lg"
                              title="Preview SQL"
                            >
                              <Code className="w-4 h-4 text-slate-400" />
                            </button>
                          </>
                        )}
                        {!tableMapping && (
                          <span className="px-3 py-1 bg-slate-700 text-slate-400 rounded-full text-sm">
                            Not mapped
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Column Mappings */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-slate-700"
                        >
                          {/* Entity Selector */}
                          {tableMapping && (
                            <div className="p-4 bg-slate-900/50 border-b border-slate-700">
                              <label className="block text-sm font-medium text-slate-400 mb-2">
                                Maps to Canonical Entity:
                              </label>
                              <select
                                value={tableMapping.canonicalEntity}
                                onChange={(e) => {
                                  if (!mapping) {return;}
                                  setMapping({
                                    ...mapping,
                                    tableMappings: mapping.tableMappings.map((t) =>
                                      t.id === tableMapping.id
                                        ? { ...t, canonicalEntity: e.target.value }
                                        : t
                                    ),
                                  });
                                }}
                                className="w-64 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                              >
                                {CANONICAL_ENTITIES.map((entity) => (
                                  <option key={entity} value={entity}>
                                    {entity}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}

                          {/* Column List */}
                          <div className="divide-y divide-slate-700/50">
                            <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-slate-900/50 text-xs font-medium text-slate-500 uppercase">
                              <div className="col-span-3">Source Column</div>
                              <div className="col-span-2">Type</div>
                              <div className="col-span-1"></div>
                              <div className="col-span-3">Canonical Field</div>
                              <div className="col-span-2">Confidence</div>
                              <div className="col-span-1">Status</div>
                            </div>
                            {table.columns.map((column) => {
                              const colMapping = tableMapping?.columnMappings.find(
                                (c) => c.sourceColumn === column.name
                              );
                              return (
                                <div
                                  key={column.name}
                                  className="grid grid-cols-12 gap-4 px-4 py-3 items-center hover:bg-slate-700/30"
                                >
                                  <div className="col-span-3 flex items-center gap-2">
                                    <Columns className="w-4 h-4 text-slate-500" />
                                    <span className="text-white font-mono text-sm">
                                      {column.name}
                                    </span>
                                  </div>
                                  <div className="col-span-2">
                                    <span className="text-slate-400 text-sm font-mono">
                                      {column.type}
                                    </span>
                                  </div>
                                  <div className="col-span-1 flex justify-center">
                                    <Link2 className="w-4 h-4 text-slate-600" />
                                  </div>
                                  <div className="col-span-3">
                                    <select
                                      value={colMapping?.canonicalField || ''}
                                      onChange={(e) =>
                                        tableMapping &&
                                        updateColumnMapping(tableMapping.id, column.name, {
                                          canonicalField: e.target.value,
                                        })
                                      }
                                      className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm text-white"
                                    >
                                      <option value="">-- Select field --</option>
                                      {Object.entries(CANONICAL_FIELDS).map(([field, info]) => (
                                        <option key={field} value={field}>
                                          {field} ({info.type})
                                        </option>
                                      ))}
                                      <option value={column.name}>
                                        [custom] {column.name}
                                      </option>
                                    </select>
                                  </div>
                                  <div className="col-span-2">
                                    {colMapping && (
                                      <div className="flex items-center gap-2">
                                        <div
                                          className={`h-2 flex-1 rounded-full ${getConfidenceBg(colMapping.confidence)}`}
                                        >
                                          <div
                                            className={`h-full rounded-full ${
                                              colMapping.confidence >= 0.8
                                                ? 'bg-green-500'
                                                : colMapping.confidence >= 0.5
                                                ? 'bg-yellow-500'
                                                : 'bg-red-500'
                                            }`}
                                            style={{ width: `${colMapping.confidence * 100}%` }}
                                          />
                                        </div>
                                        <span
                                          className={`text-xs ${getConfidenceColor(colMapping.confidence)}`}
                                        >
                                          {Math.round(colMapping.confidence * 100)}%
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="col-span-1 flex justify-center">
                                    {colMapping?.isManual ? (
                                      <span
                                        className="p-1 bg-cyan-500/20 rounded"
                                        title="Manually configured"
                                      >
                                        <Check className="w-4 h-4 text-cyan-500" />
                                      </span>
                                    ) : colMapping ? (
                                      <span
                                        className="p-1 bg-purple-500/20 rounded"
                                        title="Auto-suggested"
                                      >
                                        <Zap className="w-4 h-4 text-purple-500" />
                                      </span>
                                    ) : (
                                      <span className="p-1 bg-slate-700 rounded" title="Not mapped">
                                        <X className="w-4 h-4 text-slate-500" />
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* SQL Preview Modal */}
      <AnimatePresence>
        {showPreview && previewQuery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800 rounded-xl border border-slate-700 p-6 max-w-3xl w-full max-h-[80vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Code className="w-5 h-5 text-cyan-500" />
                Generated SQL Query
              </h3>
              <pre className="bg-slate-900 rounded-lg p-4 overflow-x-auto text-sm">
                <code className="text-cyan-300">{previewQuery.sql}</code>
              </pre>
              {previewQuery.params.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-slate-400 mb-2">Parameters:</h4>
                  <pre className="bg-slate-900 rounded-lg p-3 text-sm">
                    <code className="text-yellow-300">
                      {JSON.stringify(previewQuery.params, null, 2)}
                    </code>
                  </pre>
                </div>
              )}
              <button
                onClick={() => setShowPreview(false)}
                className="mt-4 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SchemaMappingPage;
