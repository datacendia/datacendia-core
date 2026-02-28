// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Data Source Store - Data connection state management
 *
 * Manages data sources, connections, sync status, and schemas.
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

// =============================================================================
// TYPES
// =============================================================================

export type DataSourceType =
  | 'postgresql'
  | 'mysql'
  | 'mongodb'
  | 'snowflake'
  | 'bigquery'
  | 'redshift'
  | 'sqlserver'
  | 'oracle'
  | 'csv'
  | 'api'
  | 'salesforce'
  | 'hubspot';

export type DataSourceStatus = 'connected' | 'disconnected' | 'syncing' | 'error' | 'pending';

export interface DataSource {
  id: string;
  name: string;
  type: DataSourceType;
  status: DataSourceStatus;
  lastSyncAt?: Date;
  lastSyncStatus?: string;
  syncSchedule?: string;
  metadata?: {
    tables?: string[];
    rowCounts?: Record<string, number>;
    lastError?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface DataSourceState {
  // State
  dataSources: DataSource[];
  activeDataSource: DataSource | null;
  isLoading: boolean;
  isSyncing: string | null; // ID of currently syncing source
  error: string | null;

  // Schema
  schemas: Record<
    string,
    {
      tables: Array<{
        name: string;
        columns: Array<{
          name: string;
          type: string;
          nullable: boolean;
        }>;
        rowCount?: number;
      }>;
    }
  >;

  // Actions
  setDataSources: (sources: DataSource[]) => void;
  addDataSource: (source: DataSource) => void;
  updateDataSource: (id: string, updates: Partial<DataSource>) => void;
  removeDataSource: (id: string) => void;
  setActiveDataSource: (source: DataSource | null) => void;

  fetchDataSources: () => Promise<void>;
  createDataSource: (config: CreateDataSourceConfig) => Promise<string | null>;
  testConnection: (id: string) => Promise<boolean>;
  syncDataSource: (id: string) => Promise<boolean>;
  deleteDataSource: (id: string) => Promise<boolean>;

  loadSchema: (id: string) => Promise<void>;

  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export interface CreateDataSourceConfig {
  name: string;
  type: DataSourceType;
  config: Record<string, unknown>;
  credentials?: Record<string, string>;
  syncSchedule?: string;
}

// =============================================================================
// API HELPERS
// =============================================================================

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

async function dataSourceApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('datacendia-auth')
    ? JSON.parse(localStorage.getItem('datacendia-auth')!).state?.token
    : null;

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || error.error?.message || 'Request failed');
  }

  return response.json();
}

// =============================================================================
// STORE
// =============================================================================

export const useDataSourceStore = create<DataSourceState>()(
  immer((set, get) => ({
    // Initial State
    dataSources: [],
    activeDataSource: null,
    isLoading: false,
    isSyncing: null,
    error: null,
    schemas: {},

    // Basic Actions
    setDataSources: (sources) =>
      set((state) => {
        state.dataSources = sources;
      }),

    addDataSource: (source) =>
      set((state) => {
        state.dataSources.push(source);
      }),

    updateDataSource: (id, updates) =>
      set((state) => {
        const index = state.dataSources.findIndex((s: DataSource) => s.id === id);
        if (index !== -1) {
          Object.assign(state.dataSources[index], updates);
        }
        if (state.activeDataSource?.id === id) {
          Object.assign(state.activeDataSource, updates);
        }
      }),

    removeDataSource: (id) =>
      set((state) => {
        state.dataSources = state.dataSources.filter((s: DataSource) => s.id !== id);
        if (state.activeDataSource?.id === id) {
          state.activeDataSource = null;
        }
      }),

    setActiveDataSource: (source) =>
      set((state) => {
        state.activeDataSource = source;
      }),

    // API Actions
    fetchDataSources: async () => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const response = await dataSourceApi<{ dataSources: DataSource[] }>('/data-sources');

        set((state) => {
          state.dataSources = response.dataSources;
          state.isLoading = false;
        });
      } catch (error) {
        set((state) => {
          state.error = error instanceof Error ? error.message : 'Failed to fetch data sources';
          state.isLoading = false;
        });
      }
    },

    createDataSource: async (config) => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const response = await dataSourceApi<{ dataSource: DataSource }>('/data-sources', {
          method: 'POST',
          body: JSON.stringify(config),
        });

        set((state) => {
          state.dataSources.push(response.dataSource);
          state.isLoading = false;
        });

        return response.dataSource.id;
      } catch (error) {
        set((state) => {
          state.error = error instanceof Error ? error.message : 'Failed to create data source';
          state.isLoading = false;
        });
        return null;
      }
    },

    testConnection: async (id) => {
      try {
        await dataSourceApi(`/data-sources/${id}/test`, { method: 'POST' });
        return true;
      } catch (error) {
        set((state) => {
          state.error = error instanceof Error ? error.message : 'Connection test failed';
        });
        return false;
      }
    },

    syncDataSource: async (id) => {
      set((state) => {
        state.isSyncing = id;
      });

      try {
        await dataSourceApi(`/data-sources/${id}/sync`, { method: 'POST' });

        set((state) => {
          state.isSyncing = null;
          const source = state.dataSources.find((s: DataSource) => s.id === id);
          if (source) {
            source.lastSyncAt = new Date();
            source.lastSyncStatus = 'success';
          }
        });

        return true;
      } catch (error) {
        set((state) => {
          state.isSyncing = null;
          state.error = error instanceof Error ? error.message : 'Sync failed';
          const source = state.dataSources.find((s: DataSource) => s.id === id);
          if (source) {
            source.lastSyncStatus = 'error';
          }
        });
        return false;
      }
    },

    deleteDataSource: async (id) => {
      try {
        await dataSourceApi(`/data-sources/${id}`, { method: 'DELETE' });
        get().removeDataSource(id);
        return true;
      } catch (error) {
        set((state) => {
          state.error = error instanceof Error ? error.message : 'Failed to delete data source';
        });
        return false;
      }
    },

    loadSchema: async (id) => {
      try {
        const response = await dataSourceApi<{ schema: DataSourceState['schemas'][string] }>(
          `/data-sources/${id}/schema`
        );

        set((state) => {
          state.schemas[id] = response.schema;
        });
      } catch (error) {
        set((state) => {
          state.error = error instanceof Error ? error.message : 'Failed to load schema';
        });
      }
    },

    // Utility Actions
    setLoading: (loading) =>
      set((state) => {
        state.isLoading = loading;
      }),

    setError: (error) =>
      set((state) => {
        state.error = error;
      }),

    clearError: () =>
      set((state) => {
        state.error = null;
      }),
  }))
);

// =============================================================================
// SELECTORS
// =============================================================================

export const selectDataSources = (state: DataSourceState) => state.dataSources;
export const selectActiveDataSource = (state: DataSourceState) => state.activeDataSource;
export const selectIsLoading = (state: DataSourceState) => state.isLoading;
export const selectConnectedSources = (state: DataSourceState) =>
  state.dataSources.filter((s) => s.status === 'connected');
