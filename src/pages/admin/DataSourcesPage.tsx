// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA - ADMIN DATA SOURCES PAGE
// Configure and manage data source connections
// =============================================================================

import React, { useState, useEffect } from 'react';
import {
  Database,
  Plus,
  RefreshCw,
  Check,
  X,
  ChevronRight,
  Eye,
  EyeOff,
  Trash2,
  TestTube,
  Settings,
} from 'lucide-react';
import { api } from '../../lib/api';

// =============================================================================
// TYPES
// =============================================================================

interface DataSource {
  id: string;
  name: string;
  type: string;
  status: 'PENDING' | 'CONNECTED' | 'SYNCING' | 'ERROR' | 'DISABLED';
  config: Record<string, unknown>;
  lastSyncAt?: string;
  metadata?: Record<string, unknown>;
}

interface ConnectionTestResult {
  success: boolean;
  message: string;
  metadata?: Record<string, unknown>;
  error?: string;
}

// Connector configurations
const CONNECTOR_CONFIGS: Record<
  string,
  {
    name: string;
    icon: string;
    category: string;
    fields: Array<{
      key: string;
      label: string;
      type: 'text' | 'password' | 'number' | 'select' | 'textarea';
      placeholder?: string;
      required?: boolean;
      isCredential?: boolean;
      options?: Array<{ value: string; label: string }>;
    }>;
  }
> = {
  POSTGRESQL: {
    name: 'PostgreSQL',
    icon: '🗄️',
    category: 'Database',
    fields: [
      { key: 'host', label: 'Host', type: 'text', placeholder: 'localhost', required: true },
      { key: 'port', label: 'Port', type: 'number', placeholder: '5432', required: true },
      { key: 'database', label: 'Database', type: 'text', placeholder: 'mydb', required: true },
      { key: 'schema', label: 'Schema', type: 'text', placeholder: 'public' },
      { key: 'username', label: 'Username', type: 'text', required: true, isCredential: true },
      { key: 'password', label: 'Password', type: 'password', required: true, isCredential: true },
    ],
  },
  MYSQL: {
    name: 'MySQL',
    icon: '🗄️',
    category: 'Database',
    fields: [
      { key: 'host', label: 'Host', type: 'text', placeholder: 'localhost', required: true },
      { key: 'port', label: 'Port', type: 'number', placeholder: '3306', required: true },
      { key: 'database', label: 'Database', type: 'text', required: true },
      { key: 'username', label: 'Username', type: 'text', required: true, isCredential: true },
      { key: 'password', label: 'Password', type: 'password', required: true, isCredential: true },
    ],
  },
  MONGODB: {
    name: 'MongoDB',
    icon: '🍃',
    category: 'Database',
    fields: [
      {
        key: 'connectionString',
        label: 'Connection String',
        type: 'text',
        placeholder: 'mongodb://...',
        required: true,
      },
      { key: 'database', label: 'Database', type: 'text', required: true },
    ],
  },
  REDIS: {
    name: 'Redis',
    icon: '🔴',
    category: 'Database',
    fields: [
      { key: 'host', label: 'Host', type: 'text', placeholder: 'localhost', required: true },
      { key: 'port', label: 'Port', type: 'number', placeholder: '6379', required: true },
      { key: 'db', label: 'Database Number', type: 'number', placeholder: '0' },
      { key: 'password', label: 'Password', type: 'password', isCredential: true },
    ],
  },
  NEO4J: {
    name: 'Neo4j',
    icon: '🔵',
    category: 'Database',
    fields: [
      { key: 'host', label: 'Host', type: 'text', placeholder: 'localhost', required: true },
      { key: 'port', label: 'Bolt Port', type: 'number', placeholder: '7687', required: true },
      { key: 'uri', label: 'Connection URI', type: 'text', placeholder: 'bolt://localhost:7687' },
      {
        key: 'username',
        label: 'Username',
        type: 'text',
        placeholder: 'neo4j',
        required: true,
        isCredential: true,
      },
      { key: 'password', label: 'Password', type: 'password', required: true, isCredential: true },
    ],
  },
  SNOWFLAKE: {
    name: 'Snowflake',
    icon: '❄️',
    category: 'Data Warehouse',
    fields: [
      {
        key: 'account',
        label: 'Account',
        type: 'text',
        placeholder: 'xyz12345.us-east-1',
        required: true,
      },
      { key: 'warehouse', label: 'Warehouse', type: 'text', required: true },
      { key: 'database', label: 'Database', type: 'text', required: true },
      { key: 'schema', label: 'Schema', type: 'text', placeholder: 'PUBLIC' },
      { key: 'username', label: 'Username', type: 'text', required: true, isCredential: true },
      { key: 'password', label: 'Password', type: 'password', required: true, isCredential: true },
    ],
  },
  BIGQUERY: {
    name: 'Google BigQuery',
    icon: '📊',
    category: 'Data Warehouse',
    fields: [
      { key: 'projectId', label: 'Project ID', type: 'text', required: true },
      {
        key: 'serviceAccountKey',
        label: 'Service Account JSON',
        type: 'textarea',
        required: true,
        isCredential: true,
      },
    ],
  },
  SALESFORCE: {
    name: 'Salesforce',
    icon: '☁️',
    category: 'CRM',
    fields: [
      {
        key: 'sandbox',
        label: 'Environment',
        type: 'select',
        options: [
          { value: 'false', label: 'Production' },
          { value: 'true', label: 'Sandbox' },
        ],
      },
      { key: 'clientId', label: 'Client ID', type: 'text', required: true, isCredential: true },
      {
        key: 'clientSecret',
        label: 'Client Secret',
        type: 'password',
        required: true,
        isCredential: true,
      },
      { key: 'username', label: 'Username', type: 'text', required: true, isCredential: true },
      { key: 'password', label: 'Password', type: 'password', required: true, isCredential: true },
      { key: 'securityToken', label: 'Security Token', type: 'password', isCredential: true },
    ],
  },
  HUBSPOT: {
    name: 'HubSpot',
    icon: '🟠',
    category: 'CRM',
    fields: [
      {
        key: 'apiKey',
        label: 'Private App Access Token',
        type: 'password',
        required: true,
        isCredential: true,
      },
    ],
  },
  SAP: {
    name: 'SAP',
    icon: '🏢',
    category: 'ERP',
    fields: [
      { key: 'server', label: 'Server', type: 'text', required: true },
      { key: 'client', label: 'Client', type: 'text', placeholder: '100', required: true },
      { key: 'systemId', label: 'System ID', type: 'text' },
      { key: 'username', label: 'Username', type: 'text', required: true, isCredential: true },
      { key: 'password', label: 'Password', type: 'password', required: true, isCredential: true },
    ],
  },
  AWS: {
    name: 'Amazon Web Services',
    icon: '🔶',
    category: 'Cloud',
    fields: [
      { key: 'region', label: 'Region', type: 'text', placeholder: 'us-east-1', required: true },
      {
        key: 'service',
        label: 'Service',
        type: 'select',
        options: [
          { value: 's3', label: 'S3 (Storage)' },
          { value: 'redshift', label: 'Redshift (Data Warehouse)' },
          { value: 'rds', label: 'RDS (Database)' },
          { value: 'dynamodb', label: 'DynamoDB' },
        ],
      },
      {
        key: 'accessKeyId',
        label: 'Access Key ID',
        type: 'text',
        required: true,
        isCredential: true,
      },
      {
        key: 'secretAccessKey',
        label: 'Secret Access Key',
        type: 'password',
        required: true,
        isCredential: true,
      },
    ],
  },
  AZURE: {
    name: 'Microsoft Azure',
    icon: '🔷',
    category: 'Cloud',
    fields: [
      {
        key: 'service',
        label: 'Service',
        type: 'select',
        options: [
          { value: 'blob', label: 'Blob Storage' },
          { value: 'sql', label: 'SQL Database' },
          { value: 'synapse', label: 'Synapse Analytics' },
        ],
      },
      { key: 'accountName', label: 'Account/Server Name', type: 'text', required: true },
      { key: 'database', label: 'Database', type: 'text' },
      {
        key: 'accessKey',
        label: 'Access Key / Password',
        type: 'password',
        required: true,
        isCredential: true,
      },
    ],
  },
  REST_API: {
    name: 'REST API',
    icon: '🔌',
    category: 'API',
    fields: [
      {
        key: 'baseUrl',
        label: 'Base URL',
        type: 'text',
        placeholder: 'https://api.example.com',
        required: true,
      },
      {
        key: 'authType',
        label: 'Auth Type',
        type: 'select',
        options: [
          { value: 'none', label: 'None' },
          { value: 'bearer', label: 'Bearer Token' },
          { value: 'apikey', label: 'API Key' },
          { value: 'basic', label: 'Basic Auth' },
        ],
      },
      { key: 'apiKey', label: 'API Key / Token', type: 'password', isCredential: true },
      { key: 'username', label: 'Username (Basic Auth)', type: 'text', isCredential: true },
      { key: 'password', label: 'Password (Basic Auth)', type: 'password', isCredential: true },
    ],
  },
  GRAPHQL: {
    name: 'GraphQL API',
    icon: '🔗',
    category: 'API',
    fields: [
      {
        key: 'endpoint',
        label: 'Endpoint URL',
        type: 'text',
        placeholder: 'https://api.example.com/graphql',
        required: true,
      },
      { key: 'apiKey', label: 'Authorization Token', type: 'password', isCredential: true },
    ],
  },
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const DataSourcesPage: React.FC = () => {
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState<DataSource | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newSourceType, setNewSourceType] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [testResult, setTestResult] = useState<ConnectionTestResult | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load data sources
  useEffect(() => {
    loadDataSources();
  }, []);

  const loadDataSources = async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const res = await api.get<DataSource[]>('/data-sources');
      if (res.success && res.data) {
        setDataSources(res.data);
      } else {
        setDataSources([]);
        setLoadError(res.error?.message || 'Failed to load data sources');
      }
    } catch (error) {
      console.error('Failed to load data sources:', error);
      setDataSources([]);
      setLoadError(error instanceof Error ? error.message : 'Failed to load data sources');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSource = (source: DataSource) => {
    setSelectedSource(source);
    setIsEditing(false);
    setTestResult(null);

    // Populate form with existing config
    const config = source.config as Record<string, string>;
    setFormData(config);
  };

  const handleStartEdit = () => {
    setIsEditing(true);
  };

  const handleStartAdd = (type: string) => {
    setNewSourceType(type);
    setIsAddingNew(true);
    setSelectedSource(null);
    setFormData({});
    setTestResult(null);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      const sourceId = selectedSource?.id;
      if (sourceId) {
        // Test existing source
        const res = await api.post<ConnectionTestResult>(`/data-sources/${sourceId}/test`);
        if (res.success && res.data) {
          setTestResult(res.data);
        } else {
          setTestResult(
            res.data || { success: false, message: res.error?.message || 'Test failed' }
          );
        }
      } else {
        // Test new configuration
        const dataSourceType = newSourceType;
        if (!dataSourceType) {
          setTestResult({ success: false, message: 'Select a data source type to test' });
          return;
        }
        const res = await api.post<ConnectionTestResult>('/data-sources/test', {
          type: dataSourceType,
          config: formData,
          credentials: formData,
        });
        if (res.success && res.data) {
          setTestResult(res.data);
        } else {
          setTestResult(
            res.data || { success: false, message: res.error?.message || 'Test failed' }
          );
        }
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Connection test failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const type = selectedSource?.type || newSourceType;
      const connectorConfig = CONNECTOR_CONFIGS[type || ''];

      // Separate config and credentials
      const config: Record<string, unknown> = {};
      const credentials: Record<string, unknown> = {};

      connectorConfig?.fields.forEach((field) => {
        if (formData[field.key]) {
          if (field.isCredential) {
            credentials[field.key] = formData[field.key];
          } else {
            const fieldValue = formData[field.key];
            config[field.key] =
              field.type === 'number' && fieldValue ? parseInt(fieldValue) : fieldValue;
          }
        }
      });

      if (selectedSource) {
        // Update existing
        const res = await api.put<unknown>(`/data-sources/${selectedSource.id}`, {
          config,
          credentials,
        });
        if (res.success) {
          await loadDataSources();
          setIsEditing(false);
        }
      } else if (newSourceType) {
        // Create new
        const res = await api.post<unknown>('/data-sources', {
          name: formData.name || connectorConfig?.name,
          type: newSourceType,
          config,
          credentials,
        });
        if (res.success) {
          await loadDataSources();
          setIsAddingNew(false);
          setNewSourceType(null);
        }
      }
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSync = async (id: string) => {
    try {
      const res = await api.post<unknown>(`/data-sources/${id}/sync`);
      if (res.success) {
        setDataSources((prev) =>
          prev.map((ds) =>
            ds.id === id ? { ...ds, status: 'SYNCING' as DataSource['status'] } : ds
          )
        );

        setSelectedSource((prev) =>
          prev && prev.id === id ? { ...prev, status: 'SYNCING' as DataSource['status'] } : prev
        );
      }
    } catch (error) {
      console.error('Failed to start sync:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this data source?')) {
      return;
    }

    try {
      const res = await api.delete<unknown>(`/data-sources/${id}`);
      if (res.success) {
        await loadDataSources();
        setSelectedSource(null);
      }
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONNECTED':
        return 'bg-green-500';
      case 'SYNCING':
        return 'bg-yellow-500 animate-pulse';
      case 'ERROR':
        return 'bg-red-500';
      case 'PENDING':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'CONNECTED':
        return 'Connected';
      case 'SYNCING':
        return 'Syncing...';
      case 'ERROR':
        return 'Error';
      case 'PENDING':
        return 'Not Configured';
      default:
        return status;
    }
  };

  // Group connectors by category
  const connectorsByCategory = Object.entries(CONNECTOR_CONFIGS).reduce(
    (acc, [key, config]) => {
      const category = config.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push({ key, ...config });
      return acc;
    },
    {} as Record<string, Array<{ key: string; name: string; icon: string; category: string }>>
  );

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <Database className="w-7 h-7 text-indigo-400" />
              Data Sources
            </h1>
            <p className="text-gray-400 mt-1">Configure and manage your data source connections</p>
          </div>
          <button
            onClick={() => setIsAddingNew(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Data Source
          </button>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left Panel - Data Sources List */}
          <div className="col-span-4 bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Configured Sources ({dataSources.length})
              </h2>
            </div>

            <div className="divide-y divide-gray-700 max-h-[600px] overflow-y-auto">
              {isLoading ? (
                <div className="p-8 text-center">
                  <RefreshCw className="w-6 h-6 text-gray-500 animate-spin mx-auto" />
                  <p className="text-gray-500 mt-2">Loading...</p>
                </div>
              ) : loadError ? (
                <div className="p-6">
                  <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
                    {loadError}
                  </div>
                </div>
              ) : dataSources.length === 0 ? (
                <div className="p-8 text-center">
                  <Database className="w-12 h-12 text-gray-600 mx-auto" />
                  <p className="text-gray-400 mt-4">No data sources configured</p>
                  <p className="text-gray-500 mt-2 text-sm">Add a data source to begin</p>
                  <button
                    onClick={() => setIsAddingNew(true)}
                    className="mt-4 text-indigo-400 hover:text-indigo-300 text-sm"
                  >
                    Add your first data source →
                  </button>
                </div>
              ) : (
                dataSources.map((source) => {
                  const config = CONNECTOR_CONFIGS[source.type];
                  return (
                    <button
                      key={source.id}
                      onClick={() => handleSelectSource(source)}
                      className={`w-full p-4 text-left hover:bg-gray-700/50 transition-colors ${
                        selectedSource?.id === source.id
                          ? 'bg-gray-700/50 border-l-2 border-indigo-500'
                          : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{config?.icon || '📊'}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">{source.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`w-2 h-2 rounded-full ${getStatusColor(source.status)}`}
                            />
                            <span className="text-xs text-gray-400">
                              {getStatusLabel(source.status)}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Panel - Configuration */}
          <div className="col-span-8">
            {isAddingNew && !newSourceType ? (
              // Select connector type
              <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-white mb-6">Select Data Source Type</h2>

                {Object.entries(connectorsByCategory).map(([category, connectors]) => (
                  <div key={category} className="mb-6">
                    <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">
                      {category}
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                      {connectors.map((connector) => (
                        <button
                          key={connector.key}
                          onClick={() => handleStartAdd(connector.key)}
                          className="flex items-center gap-3 p-4 bg-gray-700/50 hover:bg-gray-700 rounded-lg border border-gray-600 hover:border-indigo-500 transition-all"
                        >
                          <span className="text-2xl">{connector.icon}</span>
                          <span className="text-white font-medium">{connector.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => setIsAddingNew(false)}
                  className="mt-4 text-gray-400 hover:text-white text-sm"
                >
                  ← Cancel
                </button>
              </div>
            ) : selectedSource || newSourceType ? (
              // Configuration form
              <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">
                        {CONNECTOR_CONFIGS[selectedSource?.type || newSourceType || '']?.icon ||
                          '📊'}
                      </span>
                      <div>
                        <h2 className="text-xl font-semibold text-white">
                          {selectedSource?.name || CONNECTOR_CONFIGS[newSourceType || '']?.name}
                        </h2>
                        <p className="text-sm text-gray-400">
                          {CONNECTOR_CONFIGS[selectedSource?.type || newSourceType || '']?.category}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedSource && (
                        <>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              selectedSource.status === 'CONNECTED'
                                ? 'bg-green-900/50 text-green-400'
                                : selectedSource.status === 'ERROR'
                                  ? 'bg-red-900/50 text-red-400'
                                  : 'bg-gray-700 text-gray-400'
                            }`}
                          >
                            {getStatusLabel(selectedSource.status)}
                          </span>
                          <button
                            onClick={() => handleSync(selectedSource.id)}
                            className="p-2 text-gray-400 hover:text-indigo-400 hover:bg-indigo-900/20 rounded-lg transition-colors"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(selectedSource.id)}
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Form */}
                <div className="p-6">
                  {isEditing || isAddingNew ? (
                    <div className="space-y-4">
                      {/* Name field for new sources */}
                      {isAddingNew && (
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Display Name
                          </label>
                          <input
                            type="text"
                            value={formData.name || ''}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder={CONNECTOR_CONFIGS[newSourceType || '']?.name}
                            className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                      )}

                      {/* Dynamic fields */}
                      {CONNECTOR_CONFIGS[selectedSource?.type || newSourceType || '']?.fields.map(
                        (field) => (
                          <div key={field.key}>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              {field.label}
                              {field.required && <span className="text-red-400 ml-1">*</span>}
                            </label>

                            {field.type === 'select' ? (
                              <select
                                value={formData[field.key] || ''}
                                onChange={(e) =>
                                  setFormData({ ...formData, [field.key]: e.target.value })
                                }
                                className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              >
                                <option value="">Select...</option>
                                {field.options?.map((opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                            ) : field.type === 'textarea' ? (
                              <textarea
                                value={formData[field.key] || ''}
                                onChange={(e) =>
                                  setFormData({ ...formData, [field.key]: e.target.value })
                                }
                                placeholder={field.placeholder}
                                rows={4}
                                className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                              />
                            ) : (
                              <div className="relative">
                                <input
                                  type={
                                    field.type === 'password' && !showPasswords[field.key]
                                      ? 'password'
                                      : 'text'
                                  }
                                  value={formData[field.key] || ''}
                                  onChange={(e) =>
                                    setFormData({ ...formData, [field.key]: e.target.value })
                                  }
                                  placeholder={field.placeholder}
                                  className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
                                />
                                {field.type === 'password' && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setShowPasswords({
                                        ...showPasswords,
                                        [field.key]: !showPasswords[field.key],
                                      })
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                  >
                                    {showPasswords[field.key] ? (
                                      <EyeOff className="w-4 h-4" />
                                    ) : (
                                      <Eye className="w-4 h-4" />
                                    )}
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        )
                      )}

                      {/* Test Result */}
                      {testResult && (
                        <div
                          className={`p-4 rounded-lg ${
                            testResult.success
                              ? 'bg-green-900/30 border border-green-800'
                              : 'bg-red-900/30 border border-red-800'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {testResult.success ? (
                              <Check className="w-5 h-5 text-green-400" />
                            ) : (
                              <X className="w-5 h-5 text-red-400" />
                            )}
                            <span
                              className={testResult.success ? 'text-green-400' : 'text-red-400'}
                            >
                              {testResult.message}
                            </span>
                          </div>
                          {testResult.error && (
                            <p className="text-sm text-red-300 mt-2">{testResult.error}</p>
                          )}
                          {testResult.metadata && (
                            <pre className="text-xs text-gray-400 mt-2 overflow-auto">
                              {JSON.stringify(testResult.metadata, null, 2)}
                            </pre>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-3 pt-4 flex-wrap">
                        <button
                          onClick={handleTestConnection}
                          disabled={isTesting}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors disabled:opacity-50"
                        >
                          {isTesting ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <TestTube className="w-4 h-4" />
                          )}
                          Test Connection
                        </button>
                        <button
                          onClick={handleSave}
                          disabled={isSaving}
                          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50"
                        >
                          {isSaving ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                          Save Configuration
                        </button>
                        <button
                          onClick={() => {
                            setIsEditing(false);
                            setIsAddingNew(false);
                            setNewSourceType(null);
                          }}
                          className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View mode
                    <div>
                      <div className="space-y-4">
                        {CONNECTOR_CONFIGS[selectedSource?.type || '']?.fields.map((field) => {
                          const value = (selectedSource?.config as Record<string, unknown>)?.[
                            field.key
                          ];
                          if (!value && !field.isCredential) {
                            return null;
                          }

                          return (
                            <div
                              key={field.key}
                              className="flex items-center justify-between py-2 border-b border-gray-700"
                            >
                              <span className="text-gray-400">{field.label}</span>
                              <span className="text-white font-mono">
                                {field.isCredential ? '••••••••' : String(value)}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex items-center gap-3 mt-6">
                        <button
                          onClick={handleStartEdit}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          Edit Configuration
                        </button>
                        <button
                          onClick={handleTestConnection}
                          disabled={isTesting}
                          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50"
                        >
                          {isTesting ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <TestTube className="w-4 h-4" />
                          )}
                          Test Connection
                        </button>
                      </div>

                      {/* Test Result */}
                      {testResult && (
                        <div
                          className={`mt-4 p-4 rounded-lg ${
                            testResult.success
                              ? 'bg-green-900/30 border border-green-800'
                              : 'bg-red-900/30 border border-red-800'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {testResult.success ? (
                              <Check className="w-5 h-5 text-green-400" />
                            ) : (
                              <X className="w-5 h-5 text-red-400" />
                            )}
                            <span
                              className={testResult.success ? 'text-green-400' : 'text-red-400'}
                            >
                              {testResult.message}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Empty state
              <div className="bg-gray-800 rounded-xl border border-gray-700 p-12 text-center">
                <Database className="w-16 h-16 text-gray-600 mx-auto" />
                <h3 className="text-xl font-semibold text-white mt-4">Select a Data Source</h3>
                <p className="text-gray-400 mt-2">
                  Choose a data source from the list to view or edit its configuration
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataSourcesPage;
