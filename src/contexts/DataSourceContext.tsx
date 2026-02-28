// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA - SHARED DATA SOURCE CONTEXT
// Enables all Cortex pages to work from the same data source and flow together
// =============================================================================

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../lib/api';
import { setCurrentDataSourceId } from '../lib/api/client';

// =============================================================================
// TYPES
// =============================================================================

export interface DataSource {
  id: string;
  name: string;
  type: string; // POSTGRESQL, SALESFORCE, SNOWFLAKE, etc.
  status: 'connected' | 'disconnected' | 'syncing' | 'error' | 'pending';
  lastSyncAt?: string;
  recordCount?: number;
  metadata?: Record<string, unknown>;
}

export interface SelectedEntity {
  id: string;
  name: string;
  type: string;
  dataSourceId: string;
  properties?: Record<string, unknown>;
}

export interface CortexWorkflow {
  id: string;
  name: string;
  steps: CortexWorkflowStep[];
  currentStep: number;
  status: 'active' | 'completed' | 'paused';
}

export interface CortexWorkflowStep {
  page: 'graph' | 'council' | 'pulse' | 'lens' | 'bridge';
  action: string;
  completed: boolean;
  result?: unknown;
}

export interface DataSourceContextValue {
  // Data Sources
  dataSources: DataSource[];
  selectedDataSource: DataSource | null;
  selectDataSource: (source: DataSource | null) => void;

  // Selected Entity (from Graph)
  selectedEntity: SelectedEntity | null;
  selectEntity: (entity: SelectedEntity | null) => void;

  // Cross-page workflow
  activeWorkflow: CortexWorkflow | null;
  startWorkflow: (name: string, steps: CortexWorkflowStep[]) => void;
  advanceWorkflow: (result?: unknown) => void;
  cancelWorkflow: () => void;

  // Navigation helpers
  exploreInGraph: (entityId?: string) => void;
  askCouncil: (question?: string, context?: Record<string, unknown>) => void;
  monitorInPulse: (metricId?: string) => void;
  forecastInLens: (metricId?: string, scenarioId?: string) => void;
  automateInBridge: (workflowId?: string) => void;

  // Shared state between pages
  sharedContext: Record<string, unknown>;
  setSharedContext: (key: string, value: unknown) => void;
  clearSharedContext: () => void;

  // Loading state
  isLoading: boolean;
}

// =============================================================================
// CONTEXT
// =============================================================================

const DataSourceContext = createContext<DataSourceContextValue | null>(null);

// =============================================================================
// PROVIDER
// =============================================================================

export const DataSourceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Data sources state
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [selectedDataSource, setSelectedDataSource] = useState<DataSource | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<SelectedEntity | null>(null);
  const [activeWorkflow, setActiveWorkflow] = useState<CortexWorkflow | null>(null);
  const [sharedContext, setSharedContextState] = useState<Record<string, unknown>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Load data sources only when authenticated (defer API calls)
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {return;} // Skip if not authenticated
    
    const loadDataSources = async () => {
      setIsLoading(true);
      try {
        // Fetch from API via shared client so auth and data-source header are consistent
        const res = await api.get<any[]>('/data-sources');
        if (res.success && res.data) {
          // Map API response to frontend format
          const mapped = res.data.map((ds: any) => ({
            id: ds.id,
            name: ds.name,
            type: ds.type,
            status: (ds.status?.toLowerCase() as DataSource['status']) ?? 'pending',
            lastSyncAt: ds.lastSyncAt ?? ds.last_sync_at,
            recordCount: ds.metadata?.rows || ds.metadata?.records,
            metadata: ds.metadata,
          }));
          setDataSources(mapped);

          // Auto-select first connected source if none selected
          if (!selectedDataSource) {
            const connected = mapped.find((ds: DataSource) => ds.status === 'connected');
            if (connected) {
              setSelectedDataSource(connected);
            }
          }
        }
      } catch (error) {
        // Silently fail if not authenticated - data sources will load after login
        if (localStorage.getItem('accessToken')) {
          console.error('Failed to load data sources:', error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadDataSources();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist selected data source to URL params
  useEffect(() => {
    if (selectedDataSource) {
      const params = new URLSearchParams(location.search);
      params.set('dataSource', selectedDataSource.id);
      // Only update if different to avoid loops
      if (params.get('dataSource') !== selectedDataSource.id) {
        navigate({ search: params.toString() }, { replace: true });
      }
    }
  }, [selectedDataSource, location.pathname, location.search, navigate]);

  // Restore from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const dsId = params.get('dataSource');
    if (dsId && dataSources.length > 0 && !selectedDataSource) {
      const source = dataSources.find((ds) => ds.id === dsId);
      if (source) {
        setSelectedDataSource(source);
      }
    }
  }, [dataSources, location.search, selectedDataSource]);

  // Sync selected data source with API client header helper
  useEffect(() => {
    setCurrentDataSourceId(selectedDataSource ? selectedDataSource.id : null);
  }, [selectedDataSource]);

  // Select data source
  const selectDataSource = useCallback(
    (source: DataSource | null) => {
      setSelectedDataSource(source);
      // Clear entity when changing source
      if (source?.id !== selectedDataSource?.id) {
        setSelectedEntity(null);
      }
    },
    [selectedDataSource]
  );

  // Select entity
  const selectEntity = useCallback(
    (entity: SelectedEntity | null) => {
      setSelectedEntity(entity);
      if (entity) {
        // Auto-select the data source if not already
        const source = dataSources.find((ds) => ds.id === entity.dataSourceId);
        if (source && source.id !== selectedDataSource?.id) {
          setSelectedDataSource(source);
        }
      }
    },
    [dataSources, selectedDataSource]
  );

  // Start a cross-page workflow
  const startWorkflow = useCallback(
    (name: string, steps: CortexWorkflowStep[]) => {
      const workflow: CortexWorkflow = {
        id: `wf-${Date.now()}`,
        name,
        steps,
        currentStep: 0,
        status: 'active',
      };
      setActiveWorkflow(workflow);

      // Navigate to first step
      const firstStep = steps[0];
      if (firstStep?.page) {
        navigate(`/cortex/${firstStep.page}`);
      }
    },
    [navigate]
  );

  // Advance workflow to next step
  const advanceWorkflow = useCallback(
    (result?: unknown) => {
      if (!activeWorkflow) {
        return;
      }

      const updatedSteps = [...activeWorkflow.steps];
      const currentIndex = activeWorkflow.currentStep;
      const current = updatedSteps[currentIndex];
      if (current) {
        current.completed = true;
        current.result = result;
      }

      const nextStep = activeWorkflow.currentStep + 1;

      if (nextStep >= activeWorkflow.steps.length) {
        // Workflow complete
        setActiveWorkflow({
          ...activeWorkflow,
          steps: updatedSteps,
          currentStep: nextStep,
          status: 'completed',
        });
      } else {
        // Move to next step
        setActiveWorkflow({
          ...activeWorkflow,
          steps: updatedSteps,
          currentStep: nextStep,
        });
        const next = activeWorkflow.steps[nextStep];
        if (next?.page) {
          navigate(`/cortex/${next.page}`);
        }
      }
    },
    [activeWorkflow, navigate]
  );

  // Cancel workflow
  const cancelWorkflow = useCallback(() => {
    setActiveWorkflow(null);
  }, []);

  // Navigation helpers with context passing
  const exploreInGraph = useCallback(
    (entityId?: string) => {
      if (entityId) {
        setSharedContextState((prev) => ({ ...prev, focusEntityId: entityId }));
        navigate(`/cortex/graph/entity/${entityId}`);
      } else {
        navigate('/cortex/graph');
      }
    },
    [navigate]
  );

  const askCouncil = useCallback(
    (question?: string, context?: Record<string, unknown>) => {
      const councilContext: Record<string, unknown> = {
        ...context,
        dataSource: selectedDataSource,
        entity: selectedEntity,
      };

      if (question) {
        councilContext.prefillQuestion = question;
      }

      setSharedContextState((prev) => ({ ...prev, councilContext }));
      if (question?.trim()) {
        const queryContext = {
          question: question.trim(),
          sourcePage: 'Data Source Context',
          contextSummary: '',
          contextData: councilContext,
          timestamp: new Date().toISOString(),
        };
        sessionStorage.setItem('councilQueryContext', JSON.stringify(queryContext));
        navigate('/cortex/council?fromContext=true');
        return;
      }

      navigate('/cortex/council');
    },
    [navigate, selectedDataSource, selectedEntity]
  );

  const monitorInPulse = useCallback(
    (metricId?: string) => {
      if (metricId) {
        setSharedContextState((prev) => ({ ...prev, focusMetricId: metricId }));
      }
      navigate('/cortex/pulse');
    },
    [navigate]
  );

  const forecastInLens = useCallback(
    (metricId?: string, scenarioId?: string) => {
      const lensContext: Record<string, unknown> = {
        dataSource: selectedDataSource,
        entity: selectedEntity,
      };

      if (metricId) {
        lensContext.targetMetricId = metricId;
      }
      if (scenarioId) {
        lensContext.scenarioId = scenarioId;
      }

      setSharedContextState((prev) => ({ ...prev, lensContext }));
      navigate(scenarioId ? `/cortex/lens/scenarios/${scenarioId}` : '/cortex/lens');
    },
    [navigate, selectedDataSource, selectedEntity]
  );

  const automateInBridge = useCallback(
    (workflowId?: string) => {
      const bridgeContext: Record<string, unknown> = {
        dataSource: selectedDataSource,
        entity: selectedEntity,
      };

      setSharedContextState((prev) => ({ ...prev, bridgeContext }));
      navigate(workflowId ? `/cortex/bridge/workflows/${workflowId}` : '/cortex/bridge');
    },
    [navigate, selectedDataSource, selectedEntity]
  );

  // Set shared context value
  const setSharedContext = useCallback((key: string, value: unknown) => {
    setSharedContextState((prev) => ({ ...prev, [key]: value }));
  }, []);

  // Clear shared context
  const clearSharedContext = useCallback(() => {
    setSharedContextState({});
  }, []);

  const value: DataSourceContextValue = {
    dataSources,
    selectedDataSource,
    selectDataSource,
    selectedEntity,
    selectEntity,
    activeWorkflow,
    startWorkflow,
    advanceWorkflow,
    cancelWorkflow,
    exploreInGraph,
    askCouncil,
    monitorInPulse,
    forecastInLens,
    automateInBridge,
    sharedContext,
    setSharedContext,
    clearSharedContext,
    isLoading,
  };

  return <DataSourceContext.Provider value={value}>{children}</DataSourceContext.Provider>;
};

// =============================================================================
// HOOKS
// =============================================================================

export function useDataSource() {
  const context = useContext(DataSourceContext);
  if (!context) {
    throw new Error('useDataSource must be used within a DataSourceProvider');
  }
  return context;
}

// Convenience hooks for specific pages
export function useGraphContext() {
  const { selectedDataSource, selectedEntity, selectEntity, sharedContext } = useDataSource();
  return {
    dataSource: selectedDataSource,
    entity: selectedEntity,
    selectEntity,
    focusEntityId: sharedContext.focusEntityId as string | undefined,
  };
}

export function useCouncilContext() {
  const { selectedDataSource, selectedEntity, sharedContext, askCouncil } = useDataSource();
  const councilContext = sharedContext.councilContext as Record<string, unknown> | undefined;

  return {
    dataSource: selectedDataSource,
    entity: selectedEntity,
    prefillQuestion: councilContext?.prefillQuestion as string | undefined,
    additionalContext: councilContext,
    askFollowUp: askCouncil,
  };
}

export function usePulseContext() {
  const { selectedDataSource, sharedContext, monitorInPulse } = useDataSource();

  return {
    dataSource: selectedDataSource,
    focusMetricId: sharedContext.focusMetricId as string | undefined,
    drillDown: monitorInPulse,
  };
}

export function useLensContext() {
  const { selectedDataSource, selectedEntity, sharedContext, forecastInLens } = useDataSource();
  const lensContext = sharedContext.lensContext as Record<string, unknown> | undefined;

  return {
    dataSource: selectedDataSource,
    entity: selectedEntity,
    targetMetricId: lensContext?.targetMetricId as string | undefined,
    scenarioId: lensContext?.scenarioId as string | undefined,
    createScenario: forecastInLens,
  };
}

export function useBridgeContext() {
  const { selectedDataSource, selectedEntity, sharedContext, automateInBridge } = useDataSource();
  const bridgeContext = sharedContext.bridgeContext as Record<string, unknown> | undefined;

  return {
    dataSource: selectedDataSource,
    entity: selectedEntity,
    workflowContext: bridgeContext,
    createWorkflow: automateInBridge,
  };
}

// =============================================================================
// WORKFLOW PRESETS
// =============================================================================

export const WORKFLOW_PRESETS = {
  // Explore → Ask → Monitor
  dataDiscovery: (entityName: string): CortexWorkflowStep[] => [
    { page: 'graph', action: `Explore ${entityName} in The Graph`, completed: false },
    { page: 'council', action: 'Ask Council about implications', completed: false },
    { page: 'pulse', action: 'Monitor related metrics', completed: false },
  ],

  // Analyze → Forecast → Automate
  predictiveAction: (metricName: string): CortexWorkflowStep[] => [
    { page: 'pulse', action: `Review ${metricName} health`, completed: false },
    { page: 'lens', action: 'Create forecast scenario', completed: false },
    { page: 'bridge', action: 'Set up automated response', completed: false },
  ],

  // Full cycle: Explore → Analyze → Consult → Forecast → Automate
  fullAnalysis: (entityName: string): CortexWorkflowStep[] => [
    { page: 'graph', action: `Map ${entityName} relationships`, completed: false },
    { page: 'pulse', action: 'Check current health', completed: false },
    { page: 'council', action: 'Get strategic recommendations', completed: false },
    { page: 'lens', action: 'Model future scenarios', completed: false },
    { page: 'bridge', action: 'Implement automation', completed: false },
  ],
};

export default DataSourceContext;
