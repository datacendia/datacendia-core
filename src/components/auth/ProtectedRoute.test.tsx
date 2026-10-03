// @vitest-environment jsdom
/**
 * Component — Protected Route Test
 *
 * Signed-out visits go to sign-in, remembering the page they asked for; a
 * signed-in user sees the page; nothing is decided until the session check at
 * startup has finished.
 */

import { afterEach, describe, it, expect, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';

const auth = vi.hoisted(() => ({ value: {} as Record<string, unknown> }));
vi.mock('../../contexts/AuthContext', () => ({ useAuth: () => auth.value }));

import { ProtectedRoute } from './ProtectedRoute';

type Role = 'VIEWER' | 'ANALYST' | 'ADMIN' | 'OWNER' | 'SUPER_ADMIN';

const signedOut = {
  isAuthenticated: false,
  isInitialized: true,
  isLoading: false,
  user: null,
  hasRole: () => false,
  hasPermission: () => false,
};

const signedIn = (role: Role = 'ADMIN') => ({
  isAuthenticated: true,
  isInitialized: true,
  isLoading: false,
  user: { id: 'usr-1', name: 'Sarah Chen', email: 'sarah@example.com', role },
  hasRole: (roles: string | string[]) => (Array.isArray(roles) ? roles : [roles]).includes(role),
  hasPermission: () => true,
});

function SignInPage() {
  const location = useLocation();
  return <div data-testid="sign-in">{JSON.stringify(location.state)}</div>;
}

function renderAt(path: string, requiredRoles?: Role[]) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/login" element={<SignInPage />} />
        <Route
          path="/cortex/*"
          element={
            <ProtectedRoute requiredRoles={requiredRoles}>
              <div data-testid="page">page</div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>
  );
}

afterEach(cleanup);

describe('ProtectedRoute', () => {
  it('sends a signed-out visit to sign-in with the page it asked for', () => {
    auth.value = signedOut;
    renderAt('/cortex/council?mode=advisory#top');
    expect(screen.queryByTestId('page')).toBeNull();
    expect(JSON.parse(screen.getByTestId('sign-in').textContent ?? 'null')).toEqual({
      from: '/cortex/council?mode=advisory#top',
      message: 'Please sign in to continue',
    });
  });

  it('shows the page to a signed-in user', () => {
    auth.value = signedIn();
    renderAt('/cortex/council');
    expect(screen.getByTestId('page')).toBeTruthy();
  });

  it('waits for the session check instead of redirecting', () => {
    auth.value = { ...signedOut, isInitialized: false, isLoading: true };
    renderAt('/cortex/council');
    expect(screen.queryByTestId('sign-in')).toBeNull();
    expect(screen.queryByTestId('page')).toBeNull();
    expect(screen.getByText('Verifying authentication...')).toBeTruthy();
  });

  it('keeps the page mounted while a sign-in or sign-out action runs', () => {
    auth.value = { ...signedIn(), isLoading: true };
    renderAt('/cortex/council');
    expect(screen.getByTestId('page')).toBeTruthy();
  });

  it('turns away a signed-in user without a required role', () => {
    auth.value = signedIn('ANALYST');
    renderAt('/cortex/admin', ['OWNER', 'ADMIN', 'SUPER_ADMIN']);
    expect(screen.queryByTestId('page')).toBeNull();
    expect(screen.getByText('Access Denied')).toBeTruthy();
  });

  it('lets an owner into an owner-or-admin page', () => {
    auth.value = signedIn('OWNER');
    renderAt('/cortex/admin', ['OWNER', 'ADMIN', 'SUPER_ADMIN']);
    expect(screen.getByTestId('page')).toBeTruthy();
  });
});
