// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// SETTINGS SERVICE - Client Admin API Client
// =============================================================================

const API_BASE =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? '/api/v1' : 'http://localhost:3001/api/v1');

// =============================================================================
// TYPES
// =============================================================================

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  status: 'active' | 'pending' | 'suspended' | 'inactive';
  department?: string;
  title?: string;
  lastLoginAt?: string;
  createdAt: string;
  mfaEnabled: boolean;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  memberIds: string[];
  leaderId?: string;
  createdAt: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isSystem: boolean;
  userCount: number;
}

export interface ApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  permissions: string[];
  lastUsedAt?: string;
  status: 'active' | 'revoked';
  createdAt: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: string;
  settings: {
    timezone: string;
    dateFormat: string;
    currency: string;
    language: string;
  };
  metadata: {
    industry?: string;
    companySize?: string;
    primaryContact?: string;
    primaryEmail?: string;
  };
  userCount: number;
  userLimit: number;
}

export interface BillingInfo {
  plan: string;
  mrr: number;
  userCount: number;
  userLimit: number;
  nextBillingDate: string;
  paymentMethod: {
    type: string;
    last4: string;
    brand: string;
    expiryMonth: number;
    expiryYear: number;
  };
  invoices: Array<{
    id: string;
    date: string;
    amount: number;
    status: string;
  }>;
}

export interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
}

export interface Preferences {
  notifications: {
    email: boolean;
    slack: boolean;
    deliberationComplete: boolean;
    weeklyDigest: boolean;
    alertsOnly: boolean;
  };
  display: {
    theme: string;
    language: string;
    timezone: string;
    dateFormat: string;
  };
  council: {
    defaultMode: string;
    autoSave: boolean;
    streamResponses: boolean;
    showConfidenceScores: boolean;
  };
}

export interface SecuritySettings {
  sso: {
    enabled: boolean;
    provider: string | null;
    domain: string | null;
  };
  mfa: {
    enforced: boolean;
    enabledUsers: number;
    totalUsers: number;
  };
  sessions: {
    maxConcurrent: number;
    sessionTimeout: number;
    requireReauth: boolean;
  };
  ipWhitelist: {
    enabled: boolean;
    addresses: string[];
  };
  auditLog: {
    enabled: boolean;
    retentionDays: number;
  };
}

// =============================================================================
// API CLIENT
// =============================================================================

class SettingsService {
  private baseUrl = `${API_BASE}/settings`;

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
  // ORGANIZATION
  // ---------------------------------------------------------------------------

  async getOrganization(): Promise<Organization> {
    return this.request('/organization');
  }

  async updateOrganization(updates: Partial<Organization>): Promise<Organization> {
    return this.request('/organization', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  // ---------------------------------------------------------------------------
  // USERS
  // ---------------------------------------------------------------------------

  async listUsers(filters?: {
    role?: string;
    status?: string;
    search?: string;
  }): Promise<{ users: User[]; total: number; metrics: any }> {
    const params = new URLSearchParams();
    if (filters?.role) {
      params.append('role', filters.role);
    }
    if (filters?.status) {
      params.append('status', filters.status);
    }
    if (filters?.search) {
      params.append('search', filters.search);
    }

    const query = params.toString();
    return this.request(`/users${query ? `?${query}` : ''}`);
  }

  async getUser(id: string): Promise<User> {
    return this.request(`/users/${id}`);
  }

  async createUser(data: {
    email: string;
    name: string;
    role: string;
    department?: string;
    title?: string;
  }): Promise<User> {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    return this.request(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deleteUser(id: string): Promise<void> {
    await this.request(`/users/${id}`, { method: 'DELETE' });
  }

  async resendInvite(userId: string): Promise<void> {
    await this.request(`/users/${userId}/resend-invite`, { method: 'POST' });
  }

  // ---------------------------------------------------------------------------
  // TEAMS
  // ---------------------------------------------------------------------------

  async listTeams(): Promise<{ teams: Team[]; total: number }> {
    return this.request('/teams');
  }

  async getTeam(id: string): Promise<Team> {
    return this.request(`/teams/${id}`);
  }

  async createTeam(data: {
    name: string;
    description?: string;
    leaderId?: string;
    memberIds?: string[];
  }): Promise<Team> {
    return this.request('/teams', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTeam(id: string, updates: Partial<Team>): Promise<Team> {
    return this.request(`/teams/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deleteTeam(id: string): Promise<void> {
    await this.request(`/teams/${id}`, { method: 'DELETE' });
  }

  async addTeamMember(teamId: string, userId: string): Promise<Team> {
    return this.request(`/teams/${teamId}/members`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }

  async removeTeamMember(teamId: string, userId: string): Promise<Team> {
    return this.request(`/teams/${teamId}/members/${userId}`, {
      method: 'DELETE',
    });
  }

  // ---------------------------------------------------------------------------
  // ROLES
  // ---------------------------------------------------------------------------

  async listRoles(): Promise<{ roles: Role[]; total: number }> {
    return this.request('/roles');
  }

  async createRole(data: {
    name: string;
    description: string;
    permissions: string[];
  }): Promise<Role> {
    return this.request('/roles', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteRole(id: string): Promise<void> {
    await this.request(`/roles/${id}`, { method: 'DELETE' });
  }

  // ---------------------------------------------------------------------------
  // API KEYS
  // ---------------------------------------------------------------------------

  async listApiKeys(): Promise<{ apiKeys: ApiKey[]; total: number }> {
    return this.request('/api-keys');
  }

  async createApiKey(data: {
    name: string;
    permissions: string[];
    expiresAt?: string;
  }): Promise<{ apiKey: ApiKey; fullKey: string; warning: string }> {
    return this.request('/api-keys', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async revokeApiKey(id: string): Promise<void> {
    await this.request(`/api-keys/${id}`, { method: 'DELETE' });
  }

  // ---------------------------------------------------------------------------
  // BILLING
  // ---------------------------------------------------------------------------

  async getBilling(): Promise<BillingInfo> {
    return this.request('/billing');
  }

  // ---------------------------------------------------------------------------
  // INTEGRATIONS
  // ---------------------------------------------------------------------------

  async getIntegrations(): Promise<{
    available: Integration[];
    configured: Array<{ id: string; status: string; configuredAt: string }>;
  }> {
    return this.request('/integrations');
  }

  // ---------------------------------------------------------------------------
  // PREFERENCES
  // ---------------------------------------------------------------------------

  async getPreferences(): Promise<Preferences> {
    return this.request('/preferences');
  }

  async updatePreferences(updates: Partial<Preferences>): Promise<Preferences> {
    return this.request('/preferences', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  // ---------------------------------------------------------------------------
  // SECURITY
  // ---------------------------------------------------------------------------

  async getSecuritySettings(): Promise<SecuritySettings> {
    return this.request('/security');
  }

  async updateSecuritySettings(updates: Partial<SecuritySettings>): Promise<SecuritySettings> {
    return this.request('/security', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }
}

export const settingsService = new SettingsService();
export default settingsService;
