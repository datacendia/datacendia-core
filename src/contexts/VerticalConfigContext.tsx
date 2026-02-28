// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * CENDIA VERTICAL CONFIGURATION CONTEXT
 * 
 * Global state management for industry vertical and service access
 * Enterprise Platinum Standard - 100% Client Ready
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { verticalConfigApi, ServiceDefinition, VerticalTemplate, OrganizationVerticalConfig, ServiceToggle } from '../services/VerticalConfigService';

// =============================================================================
// TYPES
// =============================================================================

interface VerticalConfigState {
  // Data
  serviceCatalog: ServiceDefinition[];
  verticalTemplates: VerticalTemplate[];
  organizationConfig: OrganizationVerticalConfig | null;
  enabledServices: Set<string>;
  
  // Loading states
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  
  // Current vertical
  currentVertical: VerticalTemplate | null;
}

interface VerticalConfigActions {
  // Initialization
  initialize: () => Promise<void>;
  refresh: () => Promise<void>;
  
  // Service access
  isServiceEnabled: (serviceId: string) => boolean;
  isServiceCore: (serviceId: string) => boolean;
  getServiceById: (serviceId: string) => ServiceDefinition | undefined;
  
  // Configuration
  selectVertical: (verticalId: string, preserveCustomizations?: boolean) => Promise<void>;
  toggleService: (serviceId: string, enabled: boolean, reason?: string) => Promise<ServiceToggle | null>;
  bulkToggleServices: (toggles: { serviceId: string; enabled: boolean }[]) => Promise<ServiceToggle[]>;
  
  // Utilities
  getRecommendedServices: () => ServiceDefinition[];
  getEnabledServicesList: () => ServiceDefinition[];
  getDisabledServicesList: () => ServiceDefinition[];
}

interface VerticalConfigContextValue extends VerticalConfigState, VerticalConfigActions {}

// =============================================================================
// DEFAULT STATE
// =============================================================================

const defaultState: VerticalConfigState = {
  serviceCatalog: [],
  verticalTemplates: [],
  organizationConfig: null,
  enabledServices: new Set(['council', 'ledger', 'evidence-vault']), // Core services always enabled
  isLoading: true,
  isInitialized: false,
  error: null,
  currentVertical: null,
};

// =============================================================================
// CONTEXT
// =============================================================================

const VerticalConfigContext = createContext<VerticalConfigContextValue | undefined>(undefined);

// =============================================================================
// PROVIDER
// =============================================================================

interface VerticalConfigProviderProps {
  children: ReactNode;
}

export const VerticalConfigProvider: React.FC<VerticalConfigProviderProps> = ({ children }) => {
  const [state, setState] = useState<VerticalConfigState>(defaultState);

  // ===========================================================================
  // INITIALIZATION
  // ===========================================================================

  const initialize = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Fetch catalog and templates in parallel
      const [catalog, templates, config] = await Promise.all([
        verticalConfigApi.getServiceCatalog(),
        verticalConfigApi.getVerticalTemplates(),
        verticalConfigApi.getOrganizationConfig(),
      ]);

      // Build enabled services set
      const coreServices = catalog.filter(s => s.isCore).map(s => s.id);
      let enabledSet: Set<string>;
      
      if (config) {
        enabledSet = new Set([...coreServices, ...config.enabledServices]);
        config.disabledServices.forEach(s => {
          if (!coreServices.includes(s)) {enabledSet.delete(s);}
        });
      } else {
        // Default to core services only if no config
        enabledSet = new Set(coreServices);
      }

      // Find current vertical
      const currentVertical = config 
        ? templates.find(v => v.id === config.verticalId) || null
        : null;

      setState({
        serviceCatalog: catalog,
        verticalTemplates: templates,
        organizationConfig: config,
        enabledServices: enabledSet,
        isLoading: false,
        isInitialized: true,
        error: null,
        currentVertical,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load vertical configuration';
      setState(prev => ({
        ...prev,
        isLoading: false,
        isInitialized: true,
        error: message,
      }));
    }
  }, []);

  const refresh = useCallback(async () => {
    await initialize();
  }, [initialize]);

  // Initialize only when authenticated (defer API calls until needed)
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      initialize();
    }
  }, [initialize]);

  // ===========================================================================
  // SERVICE ACCESS
  // ===========================================================================

  const isServiceEnabled = useCallback((serviceId: string): boolean => {
    // Core services are always enabled
    const service = state.serviceCatalog.find(s => s.id === serviceId);
    if (service?.isCore) {return true;}
    
    return state.enabledServices.has(serviceId);
  }, [state.serviceCatalog, state.enabledServices]);

  const isServiceCore = useCallback((serviceId: string): boolean => {
    const service = state.serviceCatalog.find(s => s.id === serviceId);
    return service?.isCore || false;
  }, [state.serviceCatalog]);

  const getServiceById = useCallback((serviceId: string): ServiceDefinition | undefined => {
    return state.serviceCatalog.find(s => s.id === serviceId);
  }, [state.serviceCatalog]);

  // ===========================================================================
  // CONFIGURATION
  // ===========================================================================

  const selectVertical = useCallback(async (verticalId: string, preserveCustomizations = true) => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const config = await verticalConfigApi.switchVertical(verticalId, preserveCustomizations);
      const vertical = state.verticalTemplates.find(v => v.id === verticalId) || null;
      
      const coreServices = state.serviceCatalog.filter(s => s.isCore).map(s => s.id);
      const enabledSet = new Set([...coreServices, ...config.enabledServices]);
      config.disabledServices.forEach(s => {
        if (!coreServices.includes(s)) {enabledSet.delete(s);}
      });

      setState(prev => ({
        ...prev,
        organizationConfig: config,
        enabledServices: enabledSet,
        currentVertical: vertical,
        isLoading: false,
      }));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to switch vertical';
      setState(prev => ({ ...prev, isLoading: false, error: message }));
    }
  }, [state.verticalTemplates, state.serviceCatalog]);

  const toggleService = useCallback(async (
    serviceId: string,
    enabled: boolean,
    reason?: string
  ): Promise<ServiceToggle | null> => {
    // Don't allow toggling core services
    const service = state.serviceCatalog.find(s => s.id === serviceId);
    if (service?.isCore) {return null;}

    try {
      const toggle = await verticalConfigApi.toggleService(serviceId, enabled, reason);
      
      setState(prev => {
        const newEnabled = new Set(prev.enabledServices);
        if (enabled) {
          newEnabled.add(serviceId);
        } else {
          newEnabled.delete(serviceId);
        }
        return { ...prev, enabledServices: newEnabled };
      });

      return toggle;
    } catch (err) {
      console.error('Failed to toggle service:', err);
      return null;
    }
  }, [state.serviceCatalog]);

  const bulkToggleServices = useCallback(async (
    toggles: { serviceId: string; enabled: boolean }[]
  ): Promise<ServiceToggle[]> => {
    // Filter out core services
    const filteredToggles = toggles.filter(t => {
      const service = state.serviceCatalog.find(s => s.id === t.serviceId);
      return !service?.isCore;
    });

    try {
      const results = await verticalConfigApi.bulkToggleServices(filteredToggles);
      
      setState(prev => {
        const newEnabled = new Set(prev.enabledServices);
        filteredToggles.forEach(t => {
          if (t.enabled) {
            newEnabled.add(t.serviceId);
          } else {
            newEnabled.delete(t.serviceId);
          }
        });
        return { ...prev, enabledServices: newEnabled };
      });

      return results;
    } catch (err) {
      console.error('Failed to bulk toggle services:', err);
      return [];
    }
  }, [state.serviceCatalog]);

  // ===========================================================================
  // UTILITIES
  // ===========================================================================

  const getRecommendedServices = useCallback((): ServiceDefinition[] => {
    if (!state.currentVertical) {return [];}
    
    return state.serviceCatalog.filter(s => 
      state.currentVertical!.recommendedServices.includes(s.id) && 
      !state.enabledServices.has(s.id)
    );
  }, [state.currentVertical, state.serviceCatalog, state.enabledServices]);

  const getEnabledServicesList = useCallback((): ServiceDefinition[] => {
    return state.serviceCatalog.filter(s => 
      s.isCore || state.enabledServices.has(s.id)
    );
  }, [state.serviceCatalog, state.enabledServices]);

  const getDisabledServicesList = useCallback((): ServiceDefinition[] => {
    return state.serviceCatalog.filter(s => 
      !s.isCore && !state.enabledServices.has(s.id)
    );
  }, [state.serviceCatalog, state.enabledServices]);

  // ===========================================================================
  // CONTEXT VALUE
  // ===========================================================================

  const value = useMemo<VerticalConfigContextValue>(() => ({
    // State
    ...state,
    
    // Actions
    initialize,
    refresh,
    isServiceEnabled,
    isServiceCore,
    getServiceById,
    selectVertical,
    toggleService,
    bulkToggleServices,
    getRecommendedServices,
    getEnabledServicesList,
    getDisabledServicesList,
  }), [
    state,
    initialize,
    refresh,
    isServiceEnabled,
    isServiceCore,
    getServiceById,
    selectVertical,
    toggleService,
    bulkToggleServices,
    getRecommendedServices,
    getEnabledServicesList,
    getDisabledServicesList,
  ]);

  return (
    <VerticalConfigContext.Provider value={value}>
      {children}
    </VerticalConfigContext.Provider>
  );
};

// =============================================================================
// HOOK
// =============================================================================

export const useVerticalConfig = (): VerticalConfigContextValue => {
  const context = useContext(VerticalConfigContext);
  if (!context) {
    throw new Error('useVerticalConfig must be used within a VerticalConfigProvider');
  }
  return context;
};

// =============================================================================
// UTILITY HOOK - Check if specific service is enabled
// =============================================================================

export const useServiceAccess = (serviceId: string): { 
  isEnabled: boolean; 
  isCore: boolean; 
  service: ServiceDefinition | undefined;
} => {
  const { isServiceEnabled, isServiceCore, getServiceById } = useVerticalConfig();
  
  return useMemo(() => ({
    isEnabled: isServiceEnabled(serviceId),
    isCore: isServiceCore(serviceId),
    service: getServiceById(serviceId),
  }), [serviceId, isServiceEnabled, isServiceCore, getServiceById]);
};

// =============================================================================
// UTILITY HOOK - Gate component based on service access
// =============================================================================

export const useServiceGate = (serviceId: string): boolean => {
  const { isServiceEnabled } = useVerticalConfig();
  return isServiceEnabled(serviceId);
};

export default VerticalConfigContext;
