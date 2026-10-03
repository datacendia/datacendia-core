// @vitest-environment jsdom
/**
 * Admin — Platform Dashboard Page Test
 *
 * The dashboard shows the API's figures and nothing invented: a refusal says
 * who the page is for, an outage offers a retry, and real data renders as is.
 */

import { afterEach, describe, it, expect, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const getDashboard = vi.hoisted(() => vi.fn());
vi.mock('../../services/AdminService', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../services/AdminService')>();
  return { ...actual, adminService: { getDashboard } };
});

import { AdminRequestError } from '../../services/AdminService';
import { AdminDashboardPage } from './index';

const renderPage = () =>
  render(
    <MemoryRouter>
      <AdminDashboardPage />
    </MemoryRouter>
  );

afterEach(() => {
  cleanup();
  getDashboard.mockReset();
});

describe('AdminDashboardPage', () => {
  it('tells a tenant admin the dashboard is for platform operators', async () => {
    getDashboard.mockRejectedValue(new AdminRequestError('Insufficient permissions', 403));
    renderPage();
    expect(await screen.findByText('For platform operators')).toBeTruthy();
    expect(screen.queryByText('Try again')).toBeNull();
    // The old fallback invented 127 tenants and $842K MRR.
    expect(screen.queryByText(/127|842/)).toBeNull();
  });

  it('offers a retry when the API fails', async () => {
    getDashboard.mockRejectedValue(new AdminRequestError('Failed to load dashboard', 500));
    renderPage();
    expect(await screen.findByText('The dashboard could not be loaded')).toBeTruthy();
    expect(screen.getByText('Failed to load dashboard')).toBeTruthy();
    expect(screen.getByText('Try again')).toBeTruthy();
  });

  it('shows the figures the API returns', async () => {
    getDashboard.mockResolvedValue({
      tenants: { total: 6, active: 3, trial: 2, churned: 1 },
      revenue: { mrr: 10500, arr: 126000, avgPerTenant: 3500 },
      licenses: { total: 6, active: 4, expiring: 1, revenueAtRisk: 1200 },
      users: { total: 42 },
      tenantGrowth: [
        { month: '2026-09', count: 0 },
        { month: '2026-10', count: 2 },
      ],
      revenueByPlan: [{ plan: 'ENTERPRISE', mrr: 9000 }],
      recentActivity: [
        { event: 'User login failed', tenant: 'Acme', time: new Date().toISOString(), isAlert: true },
      ],
      lastUpdated: new Date().toISOString(),
    });
    renderPage();
    expect(await screen.findByText('$10,500.00')).toBeTruthy();
    expect(screen.getByText('3 active · 2 on trial')).toBeTruthy();
    expect(screen.getByText('ARR $126,000.00')).toBeTruthy();
    expect(screen.getByText('1 expiring within 30 days')).toBeTruthy();
    expect(screen.getByText('Enterprise')).toBeTruthy();
    expect(screen.getByText('Oct')).toBeTruthy();
    expect(screen.getByText('User login failed')).toBeTruthy();
    expect(screen.queryByText('[Chart Placeholder]')).toBeNull();
  });
});
