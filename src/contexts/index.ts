/**
 * Context — Index
 *
 * React context provider for cross-component state sharing.
 * @module contexts/index
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// Contexts barrel export
export { AuthProvider, useAuth, useUser, useIsAuthenticated, usePermissions } from './AuthContext';
export type { AuthState, AuthContextValue, RegisterData } from './AuthContext';
