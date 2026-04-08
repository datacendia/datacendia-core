/**
 * Tests for src/stores/dataSourceStore.ts
 * Covers: data source management, connections, sync, schemas, selectors
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useDataSourceStore } from '../dataSourceStore';
import type { DataSource } from '../dataSourceStore';

// Mock fetch
global.fetch = vi.fn();

const mockDataSource: DataSource = {
  id: 'ds-1',
  name: 'Production DB',
  type: 'postgresql',
  status: 'connected',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('useDataSourceStore', () => {
  beforeEach(() => {
    useDataSourceStore.setState({
      dataSources: [],
      activeDataSource: null,
      isLoading: false,
      isSyncing: null,
      error: null,
      schemas: {},
    });
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = useDataSourceStore.getState();
      expect(state.dataSources).toEqual([]);
      expect(state.activeDataSource).toBeNull();
      expect(state.isLoading).toBe(false);
      expect(state.isSyncing).toBeNull();
      expect(state.error).toBeNull();
      expect(state.schemas).toEqual({});
    });
  });

  describe('setDataSources', () => {
    it('should set data sources', () => {
      useDataSourceStore.getState().setDataSources([mockDataSource]);
      expect(useDataSourceStore.getState().dataSources).toHaveLength(1);
    });
  });

  describe('addDataSource', () => {
    it('should add a data source', () => {
      useDataSourceStore.getState().addDataSource(mockDataSource);
      expect(useDataSourceStore.getState().dataSources).toHaveLength(1);
      expect(useDataSourceStore.getState().dataSources[0].name).toBe('Production DB');
    });
  });

  describe('updateDataSource', () => {
    it('should update a data source by id', () => {
      useDataSourceStore.getState().setDataSources([mockDataSource]);
      useDataSourceStore.getState().updateDataSource('ds-1', { status: 'syncing' });
      expect(useDataSourceStore.getState().dataSources[0].status).toBe('syncing');
    });

    it('should also update activeDataSource if it matches', () => {
      useDataSourceStore.setState({
        dataSources: [mockDataSource],
        activeDataSource: mockDataSource,
      });
      useDataSourceStore.getState().updateDataSource('ds-1', { name: 'Updated DB' });
      expect(useDataSourceStore.getState().activeDataSource?.name).toBe('Updated DB');
    });

    it('should not update non-existent data source', () => {
      useDataSourceStore.getState().setDataSources([mockDataSource]);
      useDataSourceStore.getState().updateDataSource('non-existent', { status: 'error' });
      expect(useDataSourceStore.getState().dataSources[0].status).toBe('connected');
    });
  });

  describe('removeDataSource', () => {
    it('should remove a data source', () => {
      useDataSourceStore.getState().setDataSources([mockDataSource]);
      useDataSourceStore.getState().removeDataSource('ds-1');
      expect(useDataSourceStore.getState().dataSources).toHaveLength(0);
    });

    it('should clear active data source if removed', () => {
      useDataSourceStore.setState({
        dataSources: [mockDataSource],
        activeDataSource: mockDataSource,
      });
      useDataSourceStore.getState().removeDataSource('ds-1');
      expect(useDataSourceStore.getState().activeDataSource).toBeNull();
    });
  });

  describe('setActiveDataSource', () => {
    it('should set active data source', () => {
      useDataSourceStore.getState().setActiveDataSource(mockDataSource);
      expect(useDataSourceStore.getState().activeDataSource).toEqual(mockDataSource);
    });

    it('should clear active data source', () => {
      useDataSourceStore.getState().setActiveDataSource(mockDataSource);
      useDataSourceStore.getState().setActiveDataSource(null);
      expect(useDataSourceStore.getState().activeDataSource).toBeNull();
    });
  });

  describe('utility actions', () => {
    it('should set loading state', () => {
      useDataSourceStore.getState().setLoading(true);
      expect(useDataSourceStore.getState().isLoading).toBe(true);
    });

    it('should set error', () => {
      useDataSourceStore.getState().setError('Connection failed');
      expect(useDataSourceStore.getState().error).toBe('Connection failed');
    });

    it('should clear error', () => {
      useDataSourceStore.getState().setError('Error');
      useDataSourceStore.getState().clearError();
      expect(useDataSourceStore.getState().error).toBeNull();
    });
  });

  describe('selectors', () => {
    it('selectDataSources should return all data sources', async () => {
      const { selectDataSources } = await import('../dataSourceStore');
      useDataSourceStore.getState().setDataSources([mockDataSource]);
      expect(selectDataSources(useDataSourceStore.getState())).toHaveLength(1);
    });

    it('selectActiveDataSource should return active data source', async () => {
      const { selectActiveDataSource } = await import('../dataSourceStore');
      useDataSourceStore.getState().setActiveDataSource(mockDataSource);
      expect(selectActiveDataSource(useDataSourceStore.getState())).toEqual(mockDataSource);
    });

    it('selectIsLoading should return loading state', async () => {
      const { selectIsLoading } = await import('../dataSourceStore');
      useDataSourceStore.getState().setLoading(true);
      expect(selectIsLoading(useDataSourceStore.getState())).toBe(true);
    });

    it('selectConnectedSources should filter connected sources', async () => {
      const { selectConnectedSources } = await import('../dataSourceStore');
      const disconnected: DataSource = { ...mockDataSource, id: 'ds-2', name: 'Offline DB', status: 'disconnected' };
      useDataSourceStore.getState().setDataSources([mockDataSource, disconnected]);
      const connected = selectConnectedSources(useDataSourceStore.getState());
      expect(connected).toHaveLength(1);
      expect(connected[0].name).toBe('Production DB');
    });
  });
});
