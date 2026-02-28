// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA PROTECTED ROUTE
// Enterprise-grade route protection with role-based access control
// =============================================================================

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Loader2, Shield, AlertTriangle } from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** Required roles - user must have at least one */
  requiredRoles?: Array<'VIEWER' | 'ANALYST' | 'ADMIN' | 'SUPER_ADMIN'>;
  /** Required permissions - user must have all */
  requiredPermissions?: string[];
  /** Redirect path when not authenticated */
  redirectTo?: string;
  /** Show loading state while checking auth */
  showLoading?: boolean;
  /** Custom fallback component when access denied */
  fallback?: React.ReactNode;
}

// =============================================================================
// LOADING COMPONENT
// =============================================================================

function AuthLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 animate-pulse" />
          <Loader2 className="w-8 h-8 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-spin" />
        </div>
        <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm">Verifying authentication...</p>
      </div>
    </div>
  );
}

// =============================================================================
// ACCESS DENIED COMPONENT
// =============================================================================

function AccessDenied({ reason }: { reason: 'role' | 'permission' }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-md w-full text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-6">
          <Shield className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {reason === 'role'
            ? "You don't have the required role to access this page."
            : "You don't have the required permissions to access this page."}
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>Contact your administrator if you believe this is an error.</span>
        </div>
        <button
          onClick={() => window.history.back()}
          className="mt-6 px-6 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}

// =============================================================================
// PROTECTED ROUTE COMPONENT
// =============================================================================

export function ProtectedRoute({
  children,
  requiredRoles,
  requiredPermissions,
  redirectTo = '/auth/login',
  showLoading = true,
  fallback,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, isInitialized, user, hasRole, hasPermission } = useAuth();
  const location = useLocation();

  // Still loading auth state
  if (!isInitialized || isLoading) {
    if (showLoading) {
      return <AuthLoading />;
    }
    return null;
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to={redirectTo}
        state={{ from: location.pathname, message: 'Please sign in to continue' }}
        replace
      />
    );
  }

  // Check role requirements
  if (requiredRoles && requiredRoles.length > 0) {
    if (!hasRole(requiredRoles)) {
      return fallback ? <>{fallback}</> : <AccessDenied reason="role" />;
    }
  }

  // Check permission requirements
  if (requiredPermissions && requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every((p) => hasPermission(p));
    if (!hasAllPermissions) {
      return fallback ? <>{fallback}</> : <AccessDenied reason="permission" />;
    }
  }

  // All checks passed - render children
  return <>{children}</>;
}

// =============================================================================
// ADMIN ONLY ROUTE
// =============================================================================

export function AdminRoute({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute requiredRoles={['ADMIN', 'SUPER_ADMIN']}>{children}</ProtectedRoute>;
}

// =============================================================================
// ANALYST OR HIGHER ROUTE
// =============================================================================

export function AnalystRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRoles={['ANALYST', 'ADMIN', 'SUPER_ADMIN']}>{children}</ProtectedRoute>
  );
}

// =============================================================================
// HOC FOR CLASS COMPONENTS OR LEGACY CODE
// =============================================================================

export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: Omit<ProtectedRouteProps, 'children'>
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}

export default ProtectedRoute;
