// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// ADMIN SERVICE - Platform Owner Admin API Client
// =============================================================================

const API_BASE =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? '/api/v1' : 'http://localhost:3001/api/v1');

// =============================================================================
// TYPES
// =============================================================================

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  plan: 'trial' | 'foundation' | 'intelligence' | 'governance' | 'sovereign';
  status: 'trial' | 'active' | 'suspended' | 'churned';
  userCount: number;
  userLimit: number;
  mrr: number;
  metadata: {
    industry?: string;
    companySize?: string;
    country?: string;
    primaryContact?: string;
    primaryEmail?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface LicenseFeatures {
  pillars?: number;
  agents?: number;
  maxUsers?: number;
  maxDeliberationsPerMonth?: number;
  guardianSuite?: boolean;
  sovereignDeployment?: boolean;
  customIntegrations?: boolean;
}

export interface License {
  id: string;
  tenantId: string;
  tenantName: string;
  type: 'trial' | 'foundation' | 'intelligence' | 'governance' | 'sovereign';
  status: 'active' | 'expiring' | 'expired' | 'suspended';
  startDate: string;
  expiresAt: string;
  features: string | LicenseFeatures;
  autoRenew: boolean;
  renewalPrice?: number;
}

export interface ServiceHealth {
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  latency: number;
  uptime: number;
  lastCheck: string;
}

export interface SystemMetrics {
  cpu: { usage: number; cores: number };
  memory: { total: number; used: number; free: number; usagePercent: number };
  disk: { total: number; used: number; free: number; usagePercent: number };
  uptime: number;
}

export interface PlatformDashboard {
  tenants: { total: number; active: number; trial: number; churned: number };
  revenue: { mrr: number; arr: number; avgPerTenant: number };
  licenses: { total: number; active: number; expiring: number; revenueAtRisk: number };
  system: { status: string; apiRequests24h: number; avgLatency: number; errorRate: number };
  users: { total: number };
  recentActivity: Array<{ event: string; tenant: string; time: string; isAlert?: boolean }>;
  lastUpdated: string;
}

export interface HealthDashboard {
  overallStatus: 'healthy' | 'degraded' | 'critical';
  services: ServiceHealth[];
  system: SystemMetrics;
  api: {
    totalRequests24h: number;
    avgLatency: number;
    p95Latency: number;
    errorRate: number;
    requestsByEndpoint: Record<string, number>;
    requestsByStatus: Record<number, number>;
  };
  alerts: Array<{
    id: string;
    severity: string;
    service: string;
    message: string;
    createdAt: string;
  }>;
}

// =============================================================================
// API CLIENT
// =============================================================================

class AdminService {
  private baseUrl = `${API_BASE}/admin`;

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        // Add auth token here in production
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // ---------------------------------------------------------------------------
  // DASHBOARD
  // ---------------------------------------------------------------------------

  async getDashboard(): Promise<PlatformDashboard> {
    return this.request('/dashboard');
  }

  // ---------------------------------------------------------------------------
  // TENANTS
  // ---------------------------------------------------------------------------

  async listTenants(filters?: {
    status?: string;
    plan?: string;
    search?: string;
  }): Promise<{ tenants: Tenant[]; total: number }> {
    const params = new URLSearchParams();
    if (filters?.status) {
      params.append('status', filters.status);
    }
    if (filters?.plan) {
      params.append('plan', filters.plan);
    }
    if (filters?.search) {
      params.append('search', filters.search);
    }

    const query = params.toString();
    return this.request(`/tenants${query ? `?${query}` : ''}`);
  }

  async getTenant(id: string): Promise<Tenant> {
    return this.request(`/tenants/${id}`);
  }

  async createTenant(data: {
    name: string;
    slug: string;
    plan: string;
    metadata?: Partial<Tenant['metadata']>;
  }): Promise<Tenant> {
    return this.request('/tenants', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTenant(id: string, updates: Partial<Tenant>): Promise<Tenant> {
    return this.request(`/tenants/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async upgradeTenant(id: string, plan: string): Promise<Tenant> {
    return this.request(`/tenants/${id}/upgrade`, {
      method: 'POST',
      body: JSON.stringify({ plan }),
    });
  }

  async suspendTenant(id: string, reason: string): Promise<Tenant> {
    return this.request(`/tenants/${id}/suspend`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  // ---------------------------------------------------------------------------
  // LICENSES
  // ---------------------------------------------------------------------------

  async listLicenses(filters?: {
    status?: string;
    type?: string;
  }): Promise<{ licenses: License[]; total: number }> {
    const params = new URLSearchParams();
    if (filters?.status) {
      params.append('status', filters.status);
    }
    if (filters?.type) {
      params.append('type', filters.type);
    }

    const query = params.toString();
    return this.request(`/licenses${query ? `?${query}` : ''}`);
  }

  async getLicense(id: string): Promise<License> {
    return this.request(`/licenses/${id}`);
  }

  async extendLicense(id: string, months: number): Promise<License> {
    return this.request(`/licenses/${id}/extend`, {
      method: 'POST',
      body: JSON.stringify({ months }),
    });
  }

  async upgradeLicense(id: string, type: string): Promise<License> {
    return this.request(`/licenses/${id}/upgrade`, {
      method: 'POST',
      body: JSON.stringify({ type }),
    });
  }

  // ---------------------------------------------------------------------------
  // SYSTEM HEALTH
  // ---------------------------------------------------------------------------

  async getHealthDashboard(): Promise<HealthDashboard> {
    return this.request('/health');
  }

  async getServiceHealth(): Promise<{ services: ServiceHealth[] }> {
    return this.request('/health/services');
  }

  async getSystemMetrics(): Promise<SystemMetrics> {
    return this.request('/health/system');
  }

  async getApiMetrics(): Promise<HealthDashboard['api']> {
    return this.request('/health/api');
  }

  async acknowledgeAlert(alertId: string): Promise<void> {
    await this.request(`/health/alerts/${alertId}/acknowledge`, {
      method: 'POST',
    });
  }
}

export const adminService = new AdminService();
export default adminService;
