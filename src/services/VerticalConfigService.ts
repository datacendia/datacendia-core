// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * CENDIA VERTICAL CONFIGURATION SERVICE (Frontend)
 * 
 * API client for vertical configuration and service toggles
 * Enterprise Platinum Standard - 100% Client Ready
 */

import { api } from '../lib/api/client';

// =============================================================================
// TYPES
// =============================================================================

export interface ServiceDefinition {
  id: string;
  name: string;
  description: string;
  category: 'core' | 'intelligence' | 'governance' | 'security' | 'sovereign' | 'analytics';
  icon: string;
  tier: 'starter' | 'professional' | 'enterprise' | 'sovereign';
  isCore: boolean;
}

export interface VerticalTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  defaultServices: string[];
  recommendedServices: string[];
  excludedServices: string[];
}

export interface OrganizationVerticalConfig {
  id: string;
  organizationId: string;
  verticalId: string;
  enabledServices: string[];
  disabledServices: string[];
  customizations: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface ServiceToggle {
  serviceId: string;
  enabled: boolean;
  enabledAt?: Date;
  enabledBy?: string;
  disabledAt?: Date;
  disabledBy?: string;
  reason?: string;
}

// =============================================================================
// API SERVICE
// =============================================================================

const BASE_URL = '/vertical-config';

export const verticalConfigApi = {
  // ===========================================================================
  // CATALOG & TEMPLATES
  // ===========================================================================

  async getServiceCatalog(): Promise<ServiceDefinition[]> {
    const response = await api.get<{ services: ServiceDefinition[] }>(`${BASE_URL}/services`);
    return (response.data as { services: ServiceDefinition[] })?.services || [];
  },

  async getServiceById(serviceId: string): Promise<ServiceDefinition | null> {
    const response = await api.get<ServiceDefinition>(`${BASE_URL}/services/${serviceId}`);
    return response.data as ServiceDefinition;
  },

  async getServicesByCategory(category: ServiceDefinition['category']): Promise<ServiceDefinition[]> {
    const response = await api.get<{ services: ServiceDefinition[] }>(`${BASE_URL}/services/category/${category}`);
    return (response.data as { services: ServiceDefinition[] })?.services || [];
  },

  async getVerticalTemplates(): Promise<VerticalTemplate[]> {
    const response = await api.get<{ verticals: VerticalTemplate[] }>(`${BASE_URL}/verticals`);
    return (response.data as { verticals: VerticalTemplate[] })?.verticals || [];
  },

  async getVerticalById(verticalId: string): Promise<VerticalTemplate | null> {
    const response = await api.get<VerticalTemplate>(`${BASE_URL}/verticals/${verticalId}`);
    return response.data as VerticalTemplate;
  },

  async getRecommendedServices(verticalId: string): Promise<ServiceDefinition[]> {
    const response = await api.get<{ services: ServiceDefinition[] }>(`${BASE_URL}/verticals/${verticalId}/recommended`);
    return (response.data as { services: ServiceDefinition[] })?.services || [];
  },

  async compareVerticals(verticalId1: string, verticalId2: string): Promise<{
    onlyIn1: string[];
    onlyIn2: string[];
    inBoth: string[];
  }> {
    const response = await api.get<{ onlyIn1: string[]; onlyIn2: string[]; inBoth: string[] }>(
      `${BASE_URL}/verticals/compare/${verticalId1}/${verticalId2}`
    );
    return response.data as { onlyIn1: string[]; onlyIn2: string[]; inBoth: string[] };
  },

  // ===========================================================================
  // ORGANIZATION CONFIGURATION
  // ===========================================================================

  async getOrganizationConfig(): Promise<OrganizationVerticalConfig | null> {
    try {
      const response = await api.get<OrganizationVerticalConfig>(`${BASE_URL}/organization`);
      return response.data as OrganizationVerticalConfig;
    } catch {
      return null;
    }
  },

  async createOrganizationConfig(
    verticalId: string,
    customEnabledServices?: string[]
  ): Promise<OrganizationVerticalConfig> {
    const response = await api.post<OrganizationVerticalConfig>(`${BASE_URL}/organization`, {
      verticalId,
      customEnabledServices,
    });
    return response.data as OrganizationVerticalConfig;
  },

  async updateOrganizationConfig(
    updates: Partial<Pick<OrganizationVerticalConfig, 'verticalId' | 'enabledServices' | 'disabledServices' | 'customizations'>>
  ): Promise<OrganizationVerticalConfig> {
    const response = await api.put<OrganizationVerticalConfig>(`${BASE_URL}/organization`, updates);
    return response.data as OrganizationVerticalConfig;
  },

  async switchVertical(
    verticalId: string,
    preserveCustomizations: boolean = true
  ): Promise<OrganizationVerticalConfig> {
    const response = await api.post<OrganizationVerticalConfig>(`${BASE_URL}/organization/switch-vertical`, {
      verticalId,
      preserveCustomizations,
    });
    return response.data as OrganizationVerticalConfig;
  },

  // ===========================================================================
  // SERVICE TOGGLES
  // ===========================================================================

  async toggleService(
    serviceId: string,
    enabled: boolean,
    reason?: string
  ): Promise<ServiceToggle> {
    const response = await api.post<ServiceToggle>(`${BASE_URL}/toggle/${serviceId}`, {
      enabled,
      reason,
    });
    return response.data as ServiceToggle;
  },

  async bulkToggleServices(
    toggles: { serviceId: string; enabled: boolean }[]
  ): Promise<ServiceToggle[]> {
    const response = await api.post<{ results: ServiceToggle[] }>(`${BASE_URL}/toggle-bulk`, { toggles });
    return (response.data as { results: ServiceToggle[] })?.results || [];
  },

  async getEnabledServices(): Promise<ServiceDefinition[]> {
    const response = await api.get<{ services: ServiceDefinition[] }>(`${BASE_URL}/enabled`);
    return (response.data as { services: ServiceDefinition[] })?.services || [];
  },

  async getDisabledServices(): Promise<ServiceDefinition[]> {
    const response = await api.get<{ services: ServiceDefinition[] }>(`${BASE_URL}/disabled`);
    return (response.data as { services: ServiceDefinition[] })?.services || [];
  },

  async isServiceEnabled(serviceId: string): Promise<boolean> {
    const response = await api.get<{ serviceId: string; enabled: boolean }>(`${BASE_URL}/check/${serviceId}`);
    return (response.data as { enabled: boolean })?.enabled || false;
  },
};

export default verticalConfigApi;
