// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Datacendia API Client
 * Production-grade API client with authentication, error handling, and type safety
 */

// In development, use relative path to go through Vite's proxy
// In production, use the full URL from environment
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? '/api/v1' : 'http://localhost:3001/api/v1');

// Header used to propagate the currently selected data source
const DATA_SOURCE_HEADER = 'X-Data-Source-Id';

// Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  meta?: {
    page?: number;
    pageSize?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  organizationId: string;
  avatarUrl?: string;
  preferences?: Record<string, unknown>;
}

// Token storage
class TokenManager {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private refreshPromise: Promise<boolean> | null = null;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('dc_access_token');
      this.refreshToken = localStorage.getItem('dc_refresh_token');
    }
  }

  setTokens(tokens: AuthTokens): void {
    this.accessToken = tokens.accessToken;
    this.refreshToken = tokens.refreshToken;
    if (typeof window !== 'undefined') {
      localStorage.setItem('dc_access_token', tokens.accessToken);
      localStorage.setItem('dc_refresh_token', tokens.refreshToken);
    }
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  getRefreshToken(): string | null {
    return this.refreshToken;
  }

  clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('dc_access_token');
      localStorage.removeItem('dc_refresh_token');
    }
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  async refreshAccessToken(): Promise<boolean> {
    // Prevent multiple simultaneous refresh attempts
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this._doRefresh();
    const result = await this.refreshPromise;
    this.refreshPromise = null;
    return result;
  }

  private async _doRefresh(): Promise<boolean> {
    if (!this.refreshToken) {
      return false;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });

      if (!response.ok) {
        this.clearTokens();
        return false;
      }

      const data: ApiResponse<AuthTokens> = await response.json();
      if (data.success && data.data) {
        this.setTokens(data.data);
        return true;
      }

      this.clearTokens();
      return false;
    } catch {
      this.clearTokens();
      return false;
    }
  }
}

export const tokenManager = new TokenManager();

// Selected data source tracking
let currentDataSourceId: string | null = null;

export function setCurrentDataSourceId(id: string | null): void {
  currentDataSourceId = id;
  if (typeof window !== 'undefined') {
    if (id) {
      localStorage.setItem('dc_selected_data_source_id', id);
    } else {
      localStorage.removeItem('dc_selected_data_source_id');
    }
  }
}

function getCurrentDataSourceId(): string | null {
  if (currentDataSourceId !== null) {
    return currentDataSourceId;
  }
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('dc_selected_data_source_id');
    currentDataSourceId = stored;
    return stored;
  }
  return null;
}

// API Client
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    const accessToken = tokenManager.getAccessToken();
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const dataSourceId = getCurrentDataSourceId();
    if (dataSourceId && !headers[DATA_SOURCE_HEADER]) {
      headers[DATA_SOURCE_HEADER] = dataSourceId;
    }

    // Add timeout to prevent slow loading (15 seconds)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      let response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      // Handle token expiration
      if (response.status === 401 && accessToken) {
        const refreshed = await tokenManager.refreshAccessToken();
        if (refreshed) {
          headers['Authorization'] = `Bearer ${tokenManager.getAccessToken()}`;
          response = await fetch(url, { ...options, headers });
        } else {
          // Redirect to login
          window.location.href = '/login';
          return { success: false, error: { code: 'AUTH_EXPIRED', message: 'Session expired' } };
        }
      }

      // Safe JSON parse — handle empty or malformed responses
      let data: ApiResponse<T>;
      const text = await response.text();
      if (!text || text.trim().length === 0) {
        data = {
          success: false,
          error: { code: 'EMPTY_RESPONSE', message: `Empty response from ${endpoint}` },
        };
      } else {
        try {
          data = JSON.parse(text);
        } catch {
          data = {
            success: false,
            error: { code: 'PARSE_ERROR', message: `Invalid JSON from ${endpoint}` },
          };
        }
      }

      if (!response.ok && !data.error) {
        data.success = false;
        data.error = {
          code: 'HTTP_ERROR',
          message: `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      return data;
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: error instanceof Error ? error.message : 'Network error',
        },
      };
    }
  }

  // HTTP methods
  async get<T>(
    endpoint: string,
    params?: Record<string, string | number | boolean>
  ): Promise<ApiResponse<T>> {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }
    return this.request<T>(url, { method: 'GET' });
  }

  async post<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    const options: RequestInit = { method: 'POST' };
    if (body) {options.body = JSON.stringify(body);}
    return this.request<T>(endpoint, options);
  }

  async put<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    const options: RequestInit = { method: 'PUT' };
    if (body) {options.body = JSON.stringify(body);}
    return this.request<T>(endpoint, options);
  }

  async patch<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    const options: RequestInit = { method: 'PATCH' };
    if (body) {options.body = JSON.stringify(body);}
    return this.request<T>(endpoint, options);
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const api = new ApiClient();

// Event emitter for auth state changes
type AuthListener = (isAuthenticated: boolean) => void;
const authListeners: AuthListener[] = [];

export function onAuthChange(listener: AuthListener): () => void {
  authListeners.push(listener);
  return () => {
    const index = authListeners.indexOf(listener);
    if (index > -1) {
      authListeners.splice(index, 1);
    }
  };
}

function notifyAuthChange(isAuthenticated: boolean): void {
  authListeners.forEach((listener) => listener(isAuthenticated));
}

// Export convenience methods
export default {
  api,
  tokenManager,
  onAuthChange,
  notifyAuthChange,
};
