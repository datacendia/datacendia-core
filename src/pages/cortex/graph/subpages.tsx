// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA - GRAPH SUB-PAGES
// =============================================================================

import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { cn, formatRelativeTime } from '../../../../lib/utils';

// =============================================================================
// LINEAGE VIEW PAGE
// =============================================================================

export const LineageViewPage: React.FC = () => {
  const navigate = useNavigate();
  const { entityId } = useParams();
  const [direction, setDirection] = useState<'upstream' | 'downstream' | 'both'>('both');

  // Mock lineage data
  const centralEntity = {
    id: entityId || 'revenue_metrics',
    name: 'revenue_metrics',
    type: 'dataset',
  };

  const upstreamNodes = [
    { id: 'orders', name: 'orders', type: 'dataset', distance: 1 },
    { id: 'customers', name: 'customers', type: 'dataset', distance: 1 },
    { id: 'products', name: 'products', type: 'dataset', distance: 2 },
    { id: 'salesforce', name: 'Salesforce CRM', type: 'source', distance: 3 },
    { id: 'sap', name: 'SAP ERP', type: 'source', distance: 3 },
  ];

  const downstreamNodes = [
    { id: 'revenue_dashboard', name: 'Revenue Dashboard', type: 'dashboard', distance: 1 },
    { id: 'monthly_report', name: 'Monthly Revenue Report', type: 'report', distance: 1 },
    { id: 'forecast_pipeline', name: 'Revenue Forecast', type: 'process', distance: 2 },
    { id: 'exec_dashboard', name: 'Executive Dashboard', type: 'dashboard', distance: 2 },
  ];

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'dataset':
        return 'bg-blue-500';
      case 'source':
        return 'bg-purple-500';
      case 'dashboard':
        return 'bg-green-500';
      case 'report':
        return 'bg-amber-500';
      case 'process':
        return 'bg-teal-500';
      default:
        return 'bg-neutral-500';
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-neutral-500 mb-2">
            <button onClick={() => navigate('/cortex/graph')} className="hover:text-primary-600">
              Graph
            </button>
            <span>/</span>
            <span>Lineage</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Data Lineage: {centralEntity.name}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {(['upstream', 'both', 'downstream'] as const).map((dir) => (
            <button
              key={dir}
              onClick={() => setDirection(dir)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize',
                direction === dir
                  ? 'bg-primary-600 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              )}
            >
              {dir}
            </button>
          ))}
        </div>
      </div>

      {/* Lineage Visualization */}
      <div className="bg-white rounded-xl border border-neutral-200 p-8 mb-6 min-h-[500px]">
        <div className="flex items-center justify-center gap-8">
          {/* Upstream */}
          {(direction === 'upstream' || direction === 'both') && (
            <div className="flex flex-col items-end gap-4">
              <h3 className="text-sm font-medium text-neutral-500 mb-2">Upstream (Sources)</h3>
              {upstreamNodes.map((node) => (
                <div
                  key={node.id}
                  onClick={() => navigate(`/cortex/graph/entity/${node.id}`)}
                  className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 cursor-pointer group"
                >
                  <span className="text-sm text-neutral-500">
                    {node.distance} hop{node.distance > 1 ? 's' : ''}
                  </span>
                  <div className={cn('w-3 h-3 rounded-full', getNodeColor(node.type))} />
                  <span className="font-medium text-neutral-900 group-hover:text-primary-600">
                    {node.name}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Arrows */}
          {(direction === 'upstream' || direction === 'both') && (
            <div className="text-4xl text-neutral-300">→</div>
          )}

          {/* Central Entity */}
          <div className="p-6 bg-primary-50 border-2 border-primary-500 rounded-xl">
            <div
              className={cn('w-4 h-4 rounded-full mx-auto mb-2', getNodeColor(centralEntity.type))}
            />
            <p className="font-bold text-lg text-neutral-900 text-center">{centralEntity.name}</p>
            <p className="text-sm text-neutral-500 text-center">{centralEntity.type}</p>
          </div>

          {/* Arrows */}
          {(direction === 'downstream' || direction === 'both') && (
            <div className="text-4xl text-neutral-300">→</div>
          )}

          {/* Downstream */}
          {(direction === 'downstream' || direction === 'both') && (
            <div className="flex flex-col items-start gap-4">
              <h3 className="text-sm font-medium text-neutral-500 mb-2">Downstream (Consumers)</h3>
              {downstreamNodes.map((node) => (
                <div
                  key={node.id}
                  onClick={() => navigate(`/cortex/graph/entity/${node.id}`)}
                  className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 cursor-pointer group"
                >
                  <span className="font-medium text-neutral-900 group-hover:text-primary-600">
                    {node.name}
                  </span>
                  <div className={cn('w-3 h-3 rounded-full', getNodeColor(node.type))} />
                  <span className="text-sm text-neutral-500">
                    {node.distance} hop{node.distance > 1 ? 's' : ''}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Impact Analysis */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Impact Analysis</h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 bg-neutral-50 rounded-lg">
            <p className="text-sm text-neutral-500">Upstream Dependencies</p>
            <p className="text-2xl font-bold text-neutral-900">{upstreamNodes.length}</p>
          </div>
          <div className="p-4 bg-neutral-50 rounded-lg">
            <p className="text-sm text-neutral-500">Downstream Consumers</p>
            <p className="text-2xl font-bold text-neutral-900">{downstreamNodes.length}</p>
          </div>
          <div className="p-4 bg-neutral-50 rounded-lg">
            <p className="text-sm text-neutral-500">Max Depth</p>
            <p className="text-2xl font-bold text-neutral-900">3 hops</p>
          </div>
          <div className="p-4 bg-neutral-50 rounded-lg">
            <p className="text-sm text-neutral-500">Risk Score</p>
            <p className="text-2xl font-bold text-warning-main">Medium</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// ENTITY DETAILS PAGE
// =============================================================================

export const EntityDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { entityId } = useParams();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'schema' | 'lineage' | 'quality' | 'usage'
  >('overview');

  // Mock entity data
  const entity = {
    id: entityId || 'customers',
    name: 'customers',
    type: 'dataset',
    source: 'Salesforce CRM',
    owner: 'Sales Team',
    description:
      'Master customer data including contact information, account details, and customer lifecycle stage.',
    tags: ['core', 'pii', 'master-data'],
    created: 'Jan 15, 2024',
    lastUpdated: new Date(Date.now() - 3600000),
    recordCount: 125000,
    qualityScore: 94,
  };

  const columns = [
    {
      name: 'customer_id',
      type: 'string',
      nullable: false,
      pii: false,
      description: 'Unique customer identifier',
    },
    {
      name: 'email',
      type: 'string',
      nullable: false,
      pii: true,
      description: 'Customer email address',
    },
    {
      name: 'first_name',
      type: 'string',
      nullable: true,
      pii: true,
      description: 'Customer first name',
    },
    {
      name: 'last_name',
      type: 'string',
      nullable: true,
      pii: true,
      description: 'Customer last name',
    },
    { name: 'company', type: 'string', nullable: true, pii: false, description: 'Company name' },
    {
      name: 'lifecycle_stage',
      type: 'enum',
      nullable: false,
      pii: false,
      description: 'Customer lifecycle stage',
    },
    {
      name: 'created_at',
      type: 'timestamp',
      nullable: false,
      pii: false,
      description: 'Record creation timestamp',
    },
    {
      name: 'updated_at',
      type: 'timestamp',
      nullable: false,
      pii: false,
      description: 'Last update timestamp',
    },
  ];

  const usageStats = [
    {
      user: 'Revenue Dashboard',
      type: 'dashboard',
      lastAccess: new Date(Date.now() - 300000),
      frequency: 'Real-time',
    },
    {
      user: 'Marketing Team',
      type: 'query',
      lastAccess: new Date(Date.now() - 3600000),
      frequency: 'Daily',
    },
    {
      user: 'CendiaCFO Agent',
      type: 'agent',
      lastAccess: new Date(Date.now() - 7200000),
      frequency: 'On-demand',
    },
    {
      user: 'Monthly Report',
      type: 'report',
      lastAccess: new Date(Date.now() - 86400000),
      frequency: 'Monthly',
    },
  ];

  return (
    <div className="p-6 lg:p-8">
      {/* Breadcrumb & Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-neutral-500 mb-2">
            <button onClick={() => navigate('/cortex/graph')} className="hover:text-primary-600">
              Graph
            </button>
            <span>/</span>
            <span>{entity.name}</span>
          </div>
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-neutral-900">{entity.name}</h1>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded">
              {entity.type}
            </span>
            <span
              className={cn(
                'px-2 py-1 rounded text-sm',
                entity.qualityScore >= 90
                  ? 'bg-success-light text-success-dark'
                  : 'bg-warning-light text-warning-dark'
              )}
            >
              Quality: {entity.qualityScore}%
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/cortex/graph/lineage/${entity.id}`)}
            className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50"
          >
            View Lineage
          </button>
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
            Edit
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-neutral-200 mb-6">
        <nav className="flex gap-6">
          {(['overview', 'schema', 'lineage', 'quality', 'usage'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'pb-3 text-sm font-medium capitalize border-b-2 transition-colors',
                activeTab === tab
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900'
              )}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Description</h2>
              <p className="text-neutral-600">{entity.description}</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-xl border border-neutral-200 p-4">
                <p className="text-sm text-neutral-500">Records</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {entity.recordCount.toLocaleString()}
                </p>
              </div>
              <div className="bg-white rounded-xl border border-neutral-200 p-4">
                <p className="text-sm text-neutral-500">Columns</p>
                <p className="text-2xl font-bold text-neutral-900">{columns.length}</p>
              </div>
              <div className="bg-white rounded-xl border border-neutral-200 p-4">
                <p className="text-sm text-neutral-500">PII Fields</p>
                <p className="text-2xl font-bold text-warning-main">
                  {columns.filter((c) => c.pii).length}
                </p>
              </div>
            </div>
          </div>

          {/* Metadata Sidebar */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Metadata</h2>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm text-neutral-500">Source</dt>
                <dd className="font-medium text-neutral-900">{entity.source}</dd>
              </div>
              <div>
                <dt className="text-sm text-neutral-500">Owner</dt>
                <dd className="font-medium text-neutral-900">{entity.owner}</dd>
              </div>
              <div>
                <dt className="text-sm text-neutral-500">Created</dt>
                <dd className="font-medium text-neutral-900">{entity.created}</dd>
              </div>
              <div>
                <dt className="text-sm text-neutral-500">Last Updated</dt>
                <dd className="font-medium text-neutral-900">
                  {formatRelativeTime(entity.lastUpdated)}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-neutral-500 mb-2">Tags</dt>
                <dd className="flex flex-wrap gap-2">
                  {entity.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-neutral-100 text-neutral-600 text-sm rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      )}

      {activeTab === 'schema' && (
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">
                  Column
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">
                  Type
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">
                  Nullable
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">
                  PII
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {columns.map((col) => (
                <tr key={col.name} className="border-b border-neutral-100">
                  <td className="px-4 py-3 font-mono text-sm text-neutral-900">{col.name}</td>
                  <td className="px-4 py-3 font-mono text-sm text-neutral-600">{col.type}</td>
                  <td className="px-4 py-3 text-sm">{col.nullable ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-3">
                    {col.pii && (
                      <span className="px-2 py-0.5 bg-warning-light text-warning-dark text-xs rounded">
                        PII
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-500">{col.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'usage' && (
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">
                  Consumer
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">
                  Type
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">
                  Last Access
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">
                  Frequency
                </th>
              </tr>
            </thead>
            <tbody>
              {usageStats.map((usage, i) => (
                <tr key={i} className="border-b border-neutral-100">
                  <td className="px-4 py-3 font-medium text-neutral-900">{usage.user}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs rounded">
                      {usage.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-500">
                    {formatRelativeTime(usage.lastAccess)}
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-600">{usage.frequency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'quality' && (
        <div className="text-center py-12">
          <div className="inline-flex flex-col items-center gap-4">
            <span className="text-4xl">📊</span>
            <h3 className="text-lg font-semibold text-neutral-700">Data Quality Analysis</h3>
            <p className="text-neutral-500 max-w-md">
              Quality metrics show completeness, accuracy, and freshness scores for this entity.
            </p>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">98%</p>
                <p className="text-sm text-green-700">Completeness</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">95%</p>
                <p className="text-sm text-blue-700">Accuracy</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">2h</p>
                <p className="text-sm text-purple-700">Freshness</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'lineage' && (
        <div className="text-center py-12">
          <button
            onClick={() => navigate(`/cortex/graph/lineage/${entity.id}`)}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Open Full Lineage View
          </button>
        </div>
      )}
    </div>
  );
};

export default LineageViewPage;
