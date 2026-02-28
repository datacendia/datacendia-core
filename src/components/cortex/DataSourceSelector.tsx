// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA - DATA SOURCE SELECTOR
// Shared component for selecting data source across all Cortex pages
// =============================================================================

import React, { useState } from 'react';
import { Database, ChevronDown, Check, RefreshCw, Link2, AlertCircle } from 'lucide-react';
import { useDataSource, DataSource } from '../../contexts/DataSourceContext';
import { cn } from '../../../lib/utils';

export interface ConnectorDefinition {
  type: string;
  name: string;
  icon: string;
  category: string;
  id?: string;
  color?: string;
  oauth?: boolean;
}

export const AVAILABLE_CONNECTORS: ConnectorDefinition[] = [
  { type: 'POSTGRESQL', name: 'PostgreSQL', icon: '🗄️', category: 'Database' },
  { type: 'MYSQL', name: 'MySQL', icon: '🗄️', category: 'Database' },
  { type: 'MONGODB', name: 'MongoDB', icon: '🍃', category: 'Database' },
  { type: 'REDIS', name: 'Redis', icon: '🔴', category: 'Database' },
  { type: 'NEO4J', name: 'Neo4j', icon: '🔵', category: 'Database' },
  { type: 'SNOWFLAKE', name: 'Snowflake', icon: '❄️', category: 'Data Warehouse' },
  { type: 'BIGQUERY', name: 'Google BigQuery', icon: '📊', category: 'Data Warehouse' },
  {
    type: 'SALESFORCE',
    name: 'Salesforce',
    icon: '☁️',
    category: 'CRM',
    id: 'salesforce',
    color: 'bg-blue-500',
    oauth: true,
  },
  {
    type: 'HUBSPOT',
    name: 'HubSpot',
    icon: '🧡',
    category: 'CRM',
    id: 'hubspot',
    color: 'bg-orange-500',
    oauth: true,
  },
  { type: 'SAP', name: 'SAP', icon: '🏢', category: 'ERP' },
  { type: 'AWS', name: 'AWS (S3, Redshift)', icon: '🔶', category: 'Cloud' },
  { type: 'AZURE', name: 'Microsoft Azure', icon: '🔷', category: 'Cloud' },
  { type: 'REST_API', name: 'REST API', icon: '🔌', category: 'API' },
  { type: 'GRAPHQL', name: 'GraphQL', icon: '🔗', category: 'API' },
  { type: 'CSV_UPLOAD', name: 'CSV / Excel', icon: '📁', category: 'File' },
  {
    type: 'SLACK',
    name: 'Slack',
    icon: '💬',
    category: 'SaaS',
    id: 'slack',
    color: 'bg-purple-500',
    oauth: true,
  },
  {
    type: 'JIRA',
    name: 'Jira',
    icon: '📋',
    category: 'SaaS',
    id: 'jira',
    color: 'bg-blue-600',
    oauth: true,
  },
  {
    type: 'GITHUB',
    name: 'GitHub',
    icon: '🐙',
    category: 'SaaS',
    id: 'github',
    color: 'bg-gray-800',
    oauth: true,
  },
  {
    type: 'STRIPE',
    name: 'Stripe',
    icon: '💳',
    category: 'SaaS',
    id: 'stripe',
    color: 'bg-indigo-500',
    oauth: true,
  },
];

interface DataSourceSelectorProps {
  className?: string;
  compact?: boolean;
  showStatus?: boolean;
}

export const DataSourceSelector: React.FC<DataSourceSelectorProps> = ({
  className,
  compact = false,
  showStatus = true,
}) => {
  const { dataSources, selectedDataSource, selectDataSource, isLoading } = useDataSource();
  const [isOpen, setIsOpen] = useState(false);

  const getStatusColor = (status: DataSource['status']) => {
    switch (status) {
      case 'connected':
        return 'bg-green-500';
      case 'syncing':
        return 'bg-yellow-500 animate-pulse';
      case 'disconnected':
        return 'bg-gray-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: DataSource['status']) => {
    switch (status) {
      case 'connected':
        return <Link2 className="w-3 h-3 text-green-400" />;
      case 'syncing':
        return <RefreshCw className="w-3 h-3 text-yellow-400 animate-spin" />;
      case 'error':
        return <AlertCircle className="w-3 h-3 text-red-400" />;
      default:
        return null;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type?.toUpperCase()) {
      case 'POSTGRESQL':
      case 'MYSQL':
      case 'MONGODB':
      case 'ORACLE':
        return '🗄️';
      case 'REDIS':
        return '🔴';
      case 'NEO4J':
        return '🔵';
      case 'REST_API':
      case 'GRAPHQL':
        return '🔌';
      case 'CSV_UPLOAD':
        return '📁';
      case 'SALESFORCE':
        return '☁️';
      case 'SAP':
        return '🏢';
      case 'SNOWFLAKE':
      case 'BIGQUERY':
        return '❄️';
      case 'AWS':
        return '🔶';
      case 'AZURE':
        return '🔷';
      case 'HUBSPOT':
        return '🟠';
      case 'SLACK':
        return '💬';
      case 'JIRA':
        return '📋';
      case 'GITHUB':
        return '🐙';
      case 'STRIPE':
        return '💳';
      default:
        return '📊';
    }
  };

  if (isLoading) {
    return (
      <div
        className={cn(
          'flex items-center gap-2 px-3 py-2 bg-sovereign-card rounded-lg border border-sovereign-border',
          className
        )}
      >
        <RefreshCw className="w-4 h-4 text-cyan-500 animate-spin" />
        <span className="text-sm text-gray-400">Loading sources...</span>
      </div>
    );
  }

  // Available connector types to show even when no sources configured
  const availableConnectors = AVAILABLE_CONNECTORS;

  return (
    <div className={cn('relative', className)}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 bg-sovereign-card hover:bg-sovereign-hover rounded-lg border border-sovereign-border transition-colors w-full',
          isOpen && 'ring-2 ring-cyan-500 border-cyan-500/50'
        )}
      >
        {selectedDataSource ? (
          <>
            <span className="text-lg">{getTypeIcon(selectedDataSource.type)}</span>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-white truncate">{selectedDataSource.name}</p>
              {showStatus && !compact && (
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <span
                    className={cn(
                      'w-1.5 h-1.5 rounded-full',
                      getStatusColor(selectedDataSource.status)
                    )}
                  />
                  {selectedDataSource.status}
                  {selectedDataSource.recordCount && (
                    <span className="ml-1">
                      • {selectedDataSource.recordCount.toLocaleString()} records
                    </span>
                  )}
                </p>
              )}
            </div>
            <ChevronDown
              className={cn('w-4 h-4 text-gray-400 transition-transform', isOpen && 'rotate-180')}
            />
          </>
        ) : (
          <>
            <Database className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-white flex-1 text-left">
              {dataSources.length > 0 ? 'Select data source' : 'Connect a data source'}
            </span>
            <ChevronDown
              className={cn('w-4 h-4 text-gray-400 transition-transform', isOpen && 'rotate-180')}
            />
          </>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-[9998]" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 right-0 mt-1 bg-sovereign-card border border-sovereign-border rounded-xl shadow-2xl z-[9999] max-h-96 overflow-y-auto min-w-[320px]">
            {/* Configured Sources Section */}
            {dataSources.length > 0 && (
              <>
                <div className="px-3 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wider bg-sovereign-elevated">
                  Configured Sources
                </div>
                {dataSources.map((source) => (
                  <button
                    key={source.id}
                    onClick={() => {
                      selectDataSource(source);
                      setIsOpen(false);
                    }}
                    disabled={source.status === 'disconnected' || source.status === 'error'}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2 hover:bg-sovereign-hover transition-colors',
                      selectedDataSource?.id === source.id &&
                        'bg-sovereign-active border-l-2 border-cyan-500',
                      (source.status === 'disconnected' || source.status === 'error') &&
                        'opacity-50 cursor-not-allowed'
                    )}
                  >
                    <span className="text-lg">{getTypeIcon(source.type)}</span>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-white">{source.name}</p>
                        {getStatusIcon(source.status)}
                      </div>
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <span
                          className={cn('w-1.5 h-1.5 rounded-full', getStatusColor(source.status))}
                        />
                        {source.status}
                        {source.recordCount && (
                          <span className="ml-1">
                            • {source.recordCount.toLocaleString()} records
                          </span>
                        )}
                      </p>
                    </div>
                    {selectedDataSource?.id === source.id && (
                      <Check className="w-4 h-4 text-cyan-400" />
                    )}
                  </button>
                ))}
                <div className="h-px bg-sovereign-border-subtle my-1" />
              </>
            )}

            {/* Available Connectors Section */}
            <div className="px-3 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wider bg-sovereign-elevated">
              Available Integrations
            </div>

            {/* Group by category */}
            {['Database', 'Data Warehouse', 'CRM', 'ERP', 'Cloud', 'API', 'File', 'SaaS'].map(
              (category) => {
                const categoryConnectors = availableConnectors.filter(
                  (c) => c.category === category
                );
                if (categoryConnectors.length === 0) {
                  return null;
                }

                return (
                  <div key={category}>
                    <div className="px-3 py-1 text-xs text-gray-500 bg-sovereign-base">
                      {category}
                    </div>
                    {categoryConnectors.map((connector) => {
                      const isConfigured = dataSources.some((ds) => ds.type === connector.type);
                      return (
                        <a
                          key={connector.type}
                          href="/admin/data-sources"
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            'w-full flex items-center gap-3 px-3 py-2 hover:bg-sovereign-hover transition-colors',
                            isConfigured && 'opacity-50'
                          )}
                        >
                          <span className="text-lg">{connector.icon}</span>
                          <div className="flex-1 text-left">
                            <p className="text-sm font-medium text-white">{connector.name}</p>
                            <p className="text-xs text-gray-500">
                              {isConfigured ? 'Configured' : 'Click to configure'}
                            </p>
                          </div>
                          {!isConfigured && <span className="text-xs text-cyan-400">+ Add</span>}
                        </a>
                      );
                    })}
                  </div>
                );
              }
            )}
          </div>
        </>
      )}
    </div>
  );
};

// =============================================================================
// WORKFLOW INDICATOR
// =============================================================================

export const WorkflowIndicator: React.FC = () => {
  const { activeWorkflow, advanceWorkflow, cancelWorkflow } = useDataSource();

  if (!activeWorkflow || activeWorkflow.status === 'completed') {
    return null;
  }

  const currentStep = activeWorkflow.steps[activeWorkflow.currentStep];
  const progress = (activeWorkflow.currentStep / activeWorkflow.steps.length) * 100;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-sovereign-card border border-sovereign-border rounded-xl p-4 shadow-2xl z-50 min-w-[400px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
          <span className="text-sm font-medium text-white">{activeWorkflow.name}</span>
        </div>
        <button
          onClick={cancelWorkflow}
          className="text-gray-400 hover:text-crimson-400 text-sm transition-colors"
        >
          Cancel
        </button>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-sovereign-border rounded-full mb-3 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Current Step */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">
            Step {activeWorkflow.currentStep + 1} of {activeWorkflow.steps.length}
          </p>
          <p className="text-sm text-white">{currentStep?.action}</p>
        </div>
        <button
          onClick={() => advanceWorkflow()}
          className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Continue →
        </button>
      </div>

      {/* Step Indicators */}
      <div className="flex items-center gap-1 mt-3">
        {activeWorkflow.steps.map((step, idx) => (
          <div
            key={idx}
            className={cn(
              'flex-1 h-1 rounded-full transition-colors',
              step.completed
                ? 'bg-green-500'
                : idx === activeWorkflow.currentStep
                  ? 'bg-cyan-500'
                  : 'bg-sovereign-border'
            )}
          />
        ))}
      </div>
    </div>
  );
};

// =============================================================================
// QUICK ACTIONS BAR
// =============================================================================

interface QuickActionsBarProps {
  currentPage: 'graph' | 'council' | 'pulse' | 'lens' | 'bridge';
}

export const QuickActionsBar: React.FC<QuickActionsBarProps> = ({ currentPage }) => {
  const {
    selectedEntity,
    selectedDataSource,
    exploreInGraph,
    askCouncil,
    monitorInPulse,
    forecastInLens,
    automateInBridge,
  } = useDataSource();

  const entityName = selectedEntity?.name || selectedDataSource?.name || 'this data';

  const actions = [
    {
      page: 'graph' as const,
      label: 'Explore',
      icon: '🔍',
      action: () => exploreInGraph(selectedEntity?.id),
      disabled: currentPage === 'graph',
    },
    {
      page: 'council' as const,
      label: 'Ask Council',
      icon: '🧠',
      action: () => askCouncil(`What insights can you provide about ${entityName}?`),
      disabled: currentPage === 'council',
    },
    {
      page: 'pulse' as const,
      label: 'Monitor',
      icon: '💓',
      action: () => monitorInPulse(),
      disabled: currentPage === 'pulse',
    },
    {
      page: 'lens' as const,
      label: 'Forecast',
      icon: '🔮',
      action: () => forecastInLens(),
      disabled: currentPage === 'lens',
    },
    {
      page: 'bridge' as const,
      label: 'Automate',
      icon: '⚡',
      action: () => automateInBridge(),
      disabled: currentPage === 'bridge',
    },
  ];

  return (
    <div className="flex items-center gap-1 p-1 bg-sovereign-card/50 border border-sovereign-border-subtle rounded-lg">
      {actions.map((action) => (
        <button
          key={action.page}
          onClick={action.action}
          disabled={action.disabled}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors',
            action.disabled
              ? 'bg-sovereign-active text-gray-500 cursor-default'
              : 'hover:bg-sovereign-hover text-gray-400 hover:text-white'
          )}
        >
          <span>{action.icon}</span>
          <span>{action.label}</span>
        </button>
      ))}
    </div>
  );
};

export default DataSourceSelector;
