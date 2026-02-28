// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Auth API Service
 */
import { api, tokenManager } from '../client';
import type { ApiResponse, LoginRequest, LoginResponse, RegisterRequest, User } from '../types';

export const authApi = {
  /**
   * Login with email and password
   */
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await api.post<LoginResponse>('/auth/login', credentials);

    if (response.success && response.data) {
      tokenManager.setTokens({
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
        expiresIn: response.data.expiresIn,
      });
    }

    return response;
  },

  /**
   * Register new user and organization
   */
  async register(data: RegisterRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await api.post<LoginResponse>('/auth/register', data);

    if (response.success && response.data) {
      tokenManager.setTokens({
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
        expiresIn: response.data.expiresIn,
      });
    }

    return response;
  },

  /**
   * Logout and clear tokens
   */
  async logout(): Promise<void> {
    await api.post('/auth/logout');
    tokenManager.clearTokens();
  },

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return api.get<User>('/auth/me');
  },

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<boolean> {
    return tokenManager.refreshAccessToken();
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return tokenManager.isAuthenticated();
  },

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<ApiResponse<{ message: string }>> {
    return api.post('/auth/forgot-password', { email });
  },

  /**
   * Reset password with token
   */
  async resetPassword(token: string, password: string): Promise<ApiResponse<{ message: string }>> {
    return api.post('/auth/reset-password', { token, password });
  },
};
