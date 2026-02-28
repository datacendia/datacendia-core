// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA - DATA PAGES
// =============================================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn, formatNumber, formatRelativeTime, formatBytes } from '../../../../lib/utils';

// =============================================================================
// DATA SOURCES PAGE
// =============================================================================

export const DataSourcesPage: React.FC = () => {
  const navigate = useNavigate();

  const sources = [
    {
      id: 1,
      name: 'Salesforce CRM',
      type: 'CRM',
      icon: '☁️',
      status: 'connected',
      lastSync: new Date(Date.now() - 300000),
      records: 125000,
      growth: 12,
    },
    {
      id: 2,
      name: 'Snowflake DW',
      type: 'Data Warehouse',
      icon: '❄️',
      status: 'connected',
      lastSync: new Date(Date.now() - 1800000),
      records: 45000000,
      growth: 5,
    },
    {
      id: 3,
      name: 'SAP ERP',
      type: 'ERP',
      icon: '📊',
      status: 'connected',
      lastSync: new Date(Date.now() - 3600000),
      records: 8500000,
      growth: 3,
    },
    {
      id: 4,
      name: 'HubSpot',
      type: 'Marketing',
      icon: '🧡',
      status: 'syncing',
      lastSync: null,
      records: 250000,
      growth: 18,
    },
    {
      id: 5,
      name: 'Stripe',
      type: 'Payments',
      icon: '💳',
      status: 'connected',
      lastSync: new Date(Date.now() - 600000),
      records: 890000,
      growth: 8,
    },
    {
      id: 6,
      name: 'PostgreSQL (Legacy)',
      type: 'Database',
      icon: '🐘',
      status: 'error',
      lastSync: new Date(Date.now() - 86400000),
      records: 12000000,
      growth: -2,
    },
  ];

  const categories = ['All', 'CRM', 'ERP', 'Data Warehouse', 'Database', 'API'];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Data Sources</h1>
          <p className="text-neutral-500">Manage your connected data sources</p>
        </div>
        <button className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors">
          + Connect Source
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          {
            label: 'Connected Sources',
            value: sources.filter((s) => s.status === 'connected').length,
          },
          { label: 'Total Records', value: '66.5M' },
          { label: 'Last Sync', value: '5 min ago' },
          { label: 'Sync Health', value: '83%' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-neutral-200 p-4">
            <p className="text-sm text-neutral-500">{stat.label}</p>
            <p className="text-2xl font-bold text-neutral-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                cat === 'All'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-neutral-600 hover:bg-neutral-100'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search sources..."
          className="ml-auto w-64 h-9 px-3 border border-neutral-300 rounded-lg text-sm"
        />
      </div>

      {/* Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sources.map((source) => (
          <div
            key={source.id}
            className="bg-white rounded-xl border border-neutral-200 p-5 hover:border-primary-300 hover:shadow-sm transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{source.icon}</div>
                <div>
                  <h3 className="font-semibold text-neutral-900">{source.name}</h3>
                  <p className="text-sm text-neutral-500">{source.type}</p>
                </div>
              </div>
              <span
                className={cn(
                  'w-2.5 h-2.5 rounded-full mt-1',
                  source.status === 'connected' && 'bg-success-main',
                  source.status === 'syncing' && 'bg-warning-main animate-pulse',
                  source.status === 'error' && 'bg-error-main'
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-neutral-500">Records</p>
                <p className="font-medium text-neutral-900">{formatNumber(source.records)}</p>
              </div>
              <div>
                <p className="text-neutral-500">Growth</p>
                <p
                  className={cn(
                    'font-medium',
                    source.growth >= 0 ? 'text-success-main' : 'text-error-main'
                  )}
                >
                  {source.growth >= 0 ? '+' : ''}
                  {source.growth}%
                </p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between">
              <span className="text-xs text-neutral-400">
                {source.status === 'syncing'
                  ? 'Syncing now...'
                  : source.lastSync
                    ? `Last sync ${formatRelativeTime(source.lastSync)}`
                    : 'Never synced'}
              </span>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                Configure
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// =============================================================================
// DATA CATALOG PAGE
// =============================================================================

export const DataCatalogPage: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const datasets = [
    {
      id: 1,
      name: 'customers',
      source: 'Salesforce',
      type: 'Table',
      columns: 45,
      rows: 125000,
      owner: 'Sales',
      tags: ['core', 'pii'],
      quality: 94,
    },
    {
      id: 2,
      name: 'orders',
      source: 'SAP ERP',
      type: 'Table',
      columns: 32,
      rows: 890000,
      owner: 'Finance',
      tags: ['core', 'transactional'],
      quality: 98,
    },
    {
      id: 3,
      name: 'products',
      source: 'PostgreSQL',
      type: 'Table',
      columns: 28,
      rows: 15000,
      owner: 'Product',
      tags: ['master'],
      quality: 87,
    },
    {
      id: 4,
      name: 'revenue_metrics',
      source: 'Snowflake',
      type: 'View',
      columns: 12,
      rows: null,
      owner: 'Finance',
      tags: ['kpi', 'aggregated'],
      quality: 96,
    },
    {
      id: 5,
      name: 'marketing_campaigns',
      source: 'HubSpot',
      type: 'Table',
      columns: 38,
      rows: 2500,
      owner: 'Marketing',
      tags: ['campaigns'],
      quality: 82,
    },
    {
      id: 6,
      name: 'employee_directory',
      source: 'Workday',
      type: 'Table',
      columns: 52,
      rows: 1200,
      owner: 'HR',
      tags: ['pii', 'sensitive'],
      quality: 91,
    },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Data Catalog</h1>
          <p className="text-neutral-500">Discover and understand your data assets</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={cn(
              'p-2 rounded-lg',
              viewMode === 'grid' ? 'bg-neutral-100' : 'hover:bg-neutral-50'
            )}
          >
            ▦
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              'p-2 rounded-lg',
              viewMode === 'list' ? 'bg-neutral-100' : 'hover:bg-neutral-50'
            )}
          >
            ≡
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-neutral-200 p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <input
            type="text"
            placeholder="Search datasets, columns, or tags..."
            className="flex-1 min-w-64 h-10 px-4 border border-neutral-300 rounded-lg"
          />
          <select className="h-10 px-3 border border-neutral-300 rounded-lg">
            <option>All Sources</option>
            <option>Salesforce</option>
            <option>Snowflake</option>
            <option>SAP ERP</option>
          </select>
          <select className="h-10 px-3 border border-neutral-300 rounded-lg">
            <option>All Owners</option>
            <option>Sales</option>
            <option>Finance</option>
            <option>Marketing</option>
          </select>
          <select className="h-10 px-3 border border-neutral-300 rounded-lg">
            <option>All Tags</option>
            <option>core</option>
            <option>pii</option>
            <option>kpi</option>
          </select>
        </div>
      </div>

      {/* Datasets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {datasets.map((dataset) => (
          <div
            key={dataset.id}
            onClick={() => navigate(`/cortex/graph/entity/dataset-${dataset.id}`)}
            className="bg-white rounded-xl border border-neutral-200 p-5 hover:border-primary-300 hover:shadow-sm transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">📊</span>
                  <h3 className="font-semibold text-neutral-900">{dataset.name}</h3>
                </div>
                <p className="text-sm text-neutral-500 mt-1">
                  {dataset.source} • {dataset.type}
                </p>
              </div>
              <div
                className={cn(
                  'px-2 py-1 rounded-full text-xs font-medium',
                  dataset.quality >= 90
                    ? 'bg-success-light text-success-dark'
                    : dataset.quality >= 70
                      ? 'bg-warning-light text-warning-dark'
                      : 'bg-error-light text-error-dark'
                )}
              >
                {dataset.quality}%
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-neutral-500 mb-3">
              <span>{dataset.columns} columns</span>
              <span>•</span>
              <span>{dataset.rows ? formatNumber(dataset.rows) + ' rows' : 'View'}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {dataset.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-neutral-100 text-neutral-600 text-xs rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <span className="text-xs text-neutral-400">{dataset.owner}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// =============================================================================
// DATA QUALITY PAGE
// =============================================================================

export const DataQualityPage: React.FC = () => {
  const qualityDimensions = [
    { name: 'Completeness', score: 92, trend: 'up', issues: 234 },
    { name: 'Accuracy', score: 96, trend: 'stable', issues: 89 },
    { name: 'Consistency', score: 87, trend: 'down', issues: 456 },
    { name: 'Timeliness', score: 78, trend: 'up', issues: 123 },
    { name: 'Uniqueness', score: 94, trend: 'stable', issues: 45 },
    { name: 'Validity', score: 91, trend: 'up', issues: 178 },
  ];

  const recentIssues = [
    {
      id: 1,
      severity: 'critical',
      dataset: 'customers',
      issue: 'Null values in email column',
      affected: 1234,
      detected: new Date(Date.now() - 3600000),
    },
    {
      id: 2,
      severity: 'warning',
      dataset: 'orders',
      issue: 'Date format inconsistency',
      affected: 567,
      detected: new Date(Date.now() - 7200000),
    },
    {
      id: 3,
      severity: 'warning',
      dataset: 'products',
      issue: 'Duplicate SKU values',
      affected: 23,
      detected: new Date(Date.now() - 14400000),
    },
    {
      id: 4,
      severity: 'info',
      dataset: 'marketing_campaigns',
      issue: 'Missing campaign end dates',
      affected: 45,
      detected: new Date(Date.now() - 28800000),
    },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Data Quality</h1>
          <p className="text-neutral-500">
            Monitor and improve data quality across your organization
          </p>
        </div>
        <button className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors">
          Run Quality Check
        </button>
      </div>

      {/* Overall Score */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <div className="flex items-center gap-8">
          <div className="relative">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle cx="64" cy="64" r="56" fill="none" stroke="#E2E8F0" strokeWidth="12" />
              <circle
                cx="64"
                cy="64"
                r="56"
                fill="none"
                stroke="#22C55E"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${(91 / 100) * 352} 352`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-neutral-900">91%</span>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">Overall Data Quality</h2>
            <p className="text-neutral-500">Based on 6 quality dimensions across 42 datasets</p>
            <p className="text-success-main font-medium mt-2">↑ 2% from last week</p>
          </div>
        </div>
      </div>

      {/* Quality Dimensions */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {qualityDimensions.map((dim) => (
          <div key={dim.name} className="bg-white rounded-xl border border-neutral-200 p-4">
            <p className="text-sm text-neutral-500 mb-1">{dim.name}</p>
            <p className="text-2xl font-bold text-neutral-900">{dim.score}%</p>
            <p
              className={cn(
                'text-sm font-medium',
                dim.trend === 'up'
                  ? 'text-success-main'
                  : dim.trend === 'down'
                    ? 'text-error-main'
                    : 'text-neutral-500'
              )}
            >
              {dim.trend === 'up' ? '↑' : dim.trend === 'down' ? '↓' : '→'} {dim.issues} issues
            </p>
          </div>
        ))}
      </div>

      {/* Recent Issues */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-neutral-900">Recent Issues</h2>
          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View All →
          </button>
        </div>

        <div className="space-y-3">
          {recentIssues.map((issue) => (
            <div
              key={issue.id}
              className={cn(
                'p-4 rounded-lg border-l-4',
                issue.severity === 'critical' && 'bg-error-light/50 border-error-main',
                issue.severity === 'warning' && 'bg-warning-light/50 border-warning-main',
                issue.severity === 'info' && 'bg-info-light/50 border-info-main'
              )}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-neutral-900">{issue.issue}</p>
                  <p className="text-sm text-neutral-500 mt-1">
                    {issue.dataset} • {formatNumber(issue.affected)} records affected
                  </p>
                </div>
                <span className="text-xs text-neutral-400">
                  {formatRelativeTime(issue.detected)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// DATA IMPORT/EXPORT PAGE
// =============================================================================

export const DataImportExportPage: React.FC = () => {
  const recentExports = [
    {
      id: 1,
      name: 'customers_backup.csv',
      size: 45600000,
      status: 'completed',
      date: new Date(Date.now() - 86400000),
    },
    {
      id: 2,
      name: 'orders_2025.parquet',
      size: 890000000,
      status: 'completed',
      date: new Date(Date.now() - 172800000),
    },
    { id: 3, name: 'metrics_q4.json', size: 12500000, status: 'in_progress', date: new Date() },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Import / Export</h1>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Import */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Import Data</h2>
          <div className="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center">
            <div className="text-4xl mb-4">📤</div>
            <p className="text-neutral-600 mb-2">Drop files here or click to upload</p>
            <p className="text-sm text-neutral-400">CSV, JSON, Parquet, Excel (max 500MB)</p>
            <button className="mt-4 px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors">
              Browse Files
            </button>
          </div>
        </div>

        {/* Export */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Export Data</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Dataset</label>
              <select className="w-full h-10 px-3 border border-neutral-300 rounded-lg">
                <option>Select a dataset...</option>
                <option>customers</option>
                <option>orders</option>
                <option>products</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Format</label>
              <select className="w-full h-10 px-3 border border-neutral-300 rounded-lg">
                <option>CSV</option>
                <option>JSON</option>
                <option>Parquet</option>
                <option>Excel</option>
              </select>
            </div>
            <button className="w-full px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors">
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Recent Exports */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Recent Exports</h2>
        <div className="space-y-3">
          {recentExports.map((exp) => (
            <div
              key={exp.id}
              className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">📄</span>
                <div>
                  <p className="font-medium text-neutral-900">{exp.name}</p>
                  <p className="text-sm text-neutral-500">{formatBytes(exp.size)}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={cn(
                    'px-2 py-1 rounded-full text-xs font-medium',
                    exp.status === 'completed'
                      ? 'bg-success-light text-success-dark'
                      : 'bg-warning-light text-warning-dark'
                  )}
                >
                  {exp.status}
                </span>
                {exp.status === 'completed' && (
                  <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    Download
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataSourcesPage;
