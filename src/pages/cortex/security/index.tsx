// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA - SECURITY PAGES
// =============================================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn, formatRelativeTime } from '../../../../lib/utils';

// =============================================================================
// SECURITY OVERVIEW PAGE
// =============================================================================

export const SecurityOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const securityScore = 85;

  const metrics = [
    { label: 'Security Score', value: `${securityScore}/100`, status: 'good' },
    { label: 'Active Threats', value: '0', status: 'good' },
    { label: 'Policy Violations', value: '3', status: 'warning' },
    { label: 'Pending Reviews', value: '12', status: 'info' },
  ];

  const recentEvents = [
    {
      id: 1,
      type: 'login',
      user: 'john@acme.com',
      action: 'Successful login',
      location: 'New York, US',
      time: new Date(Date.now() - 300000),
    },
    {
      id: 2,
      type: 'access',
      user: 'sarah@acme.com',
      action: 'Accessed sensitive dataset',
      location: 'Chicago, US',
      time: new Date(Date.now() - 900000),
    },
    {
      id: 3,
      type: 'policy',
      user: 'mike@acme.com',
      action: 'Policy violation: export attempt',
      location: 'Boston, US',
      time: new Date(Date.now() - 1800000),
      isAlert: true,
    },
    {
      id: 4,
      type: 'login',
      user: 'emily@acme.com',
      action: 'Failed login attempt (3x)',
      location: 'Unknown',
      time: new Date(Date.now() - 3600000),
      isAlert: true,
    },
  ];

  const complianceStatus = [
    { framework: 'SOC 2 Type II', status: 'compliant', lastAudit: 'Oct 15, 2025' },
    { framework: 'GDPR', status: 'compliant', lastAudit: 'Sep 1, 2025' },
    { framework: 'HIPAA', status: 'in_progress', lastAudit: 'Pending' },
    { framework: 'ISO 27001', status: 'compliant', lastAudit: 'Aug 20, 2025' },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Security Overview</h1>
          <p className="text-neutral-500">Monitor and manage your security posture</p>
        </div>
        <button
          onClick={() => {
            const report = {
              timestamp: new Date().toISOString(),
              securityScore,
              metrics,
              recentEvents: recentEvents.map((e) => ({ ...e, time: e.time.toISOString() })),
              complianceStatus,
            };
            const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `security-report-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
          }}
          className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
        >
          Security Report
        </button>
      </div>

      {/* Security Score */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <div className="flex items-center gap-8">
          <div className="relative">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle cx="64" cy="64" r="56" fill="none" stroke="#E2E8F0" strokeWidth="12" />
              <circle
                cx="64"
                cy="64"
                r="56"
                fill="none"
                stroke={
                  securityScore >= 80 ? '#22C55E' : securityScore >= 60 ? '#F59E0B' : '#EF4444'
                }
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${(securityScore / 100) * 352} 352`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-neutral-900">{securityScore}</span>
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-neutral-900 mb-2">Security Score</h2>
            <p className="text-neutral-500 mb-4">Your organization's overall security health</p>
            <div className="grid grid-cols-3 gap-4">
              {metrics.slice(1).map((m) => (
                <div key={m.label} className="p-3 bg-neutral-50 rounded-lg">
                  <p className="text-sm text-neutral-500">{m.label}</p>
                  <p
                    className={cn(
                      'text-xl font-bold',
                      m.status === 'good'
                        ? 'text-success-main'
                        : m.status === 'warning'
                          ? 'text-warning-main'
                          : 'text-info-main'
                    )}
                  >
                    {m.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Security Events */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-900">Recent Events</h2>
            <a
              href="/cortex/security/audit"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View All →
            </a>
          </div>
          <div className="space-y-3">
            {recentEvents.map((event) => (
              <div
                key={event.id}
                className={cn(
                  'p-3 rounded-lg',
                  event.isAlert ? 'bg-warning-light/50' : 'bg-neutral-50'
                )}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-neutral-900">{event.action}</p>
                    <p className="text-sm text-neutral-500">
                      {event.user} • {event.location}
                    </p>
                  </div>
                  <span className="text-xs text-neutral-400">{formatRelativeTime(event.time)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance Status */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-900">Compliance Status</h2>
            <a
              href="/cortex/security/policies"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              Manage →
            </a>
          </div>
          <div className="space-y-3">
            {complianceStatus.map((item) => (
              <div
                key={item.framework}
                className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      'w-2.5 h-2.5 rounded-full',
                      item.status === 'compliant' ? 'bg-success-main' : 'bg-warning-main'
                    )}
                  />
                  <span className="font-medium text-neutral-900">{item.framework}</span>
                </div>
                <span className="text-sm text-neutral-500">{item.lastAudit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// ACCESS CONTROL PAGE
// =============================================================================

export const AccessControlPage: React.FC = () => {
  const navigate = useNavigate();
  const [showCreatePolicy, setShowCreatePolicy] = useState(false);
  const accessPolicies = [
    {
      id: 1,
      name: 'Default User Access',
      type: 'Role-based',
      subjects: 'All Users',
      resources: 'Public Dashboards',
      effect: 'Allow',
    },
    {
      id: 2,
      name: 'Finance Data Access',
      type: 'Attribute-based',
      subjects: 'Finance Team',
      resources: 'Financial Datasets',
      effect: 'Allow',
    },
    {
      id: 3,
      name: 'PII Data Restriction',
      type: 'Data-based',
      subjects: 'All except HR',
      resources: 'PII Fields',
      effect: 'Deny',
    },
    {
      id: 4,
      name: 'Admin Full Access',
      type: 'Role-based',
      subjects: 'Admins',
      resources: 'All Resources',
      effect: 'Allow',
    },
    {
      id: 5,
      name: 'External Contractor',
      type: 'Time-based',
      subjects: 'Contractors',
      resources: 'Project Data',
      effect: 'Allow (9-5 EST)',
    },
  ];

  const recentRequests = [
    {
      id: 1,
      user: 'John Smith',
      resource: 'Financial Reports',
      status: 'pending',
      requestedAt: new Date(Date.now() - 3600000),
    },
    {
      id: 2,
      user: 'Sarah Chen',
      resource: 'Customer PII',
      status: 'approved',
      requestedAt: new Date(Date.now() - 86400000),
    },
    {
      id: 3,
      user: 'Mike Johnson',
      resource: 'Admin Console',
      status: 'denied',
      requestedAt: new Date(Date.now() - 172800000),
    },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Access Control</h1>
          <p className="text-neutral-500">Manage access policies and permissions</p>
        </div>
        <button className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors">
          + Create Policy
        </button>
      </div>

      {/* Access Policies */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden mb-6">
        <div className="p-4 border-b border-neutral-200">
          <h2 className="text-lg font-semibold text-neutral-900">Access Policies</h2>
        </div>
        <table className="w-full">
          <thead className="bg-neutral-50">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">
                Policy Name
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">
                Type
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">
                Subjects
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">
                Resources
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">
                Effect
              </th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {accessPolicies.map((policy) => (
              <tr key={policy.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                <td className="px-4 py-4 font-medium text-neutral-900">{policy.name}</td>
                <td className="px-4 py-4 text-neutral-600">{policy.type}</td>
                <td className="px-4 py-4 text-neutral-600">{policy.subjects}</td>
                <td className="px-4 py-4 text-neutral-600">{policy.resources}</td>
                <td className="px-4 py-4">
                  <span
                    className={cn(
                      'px-2 py-1 rounded-full text-xs font-medium',
                      policy.effect.includes('Allow')
                        ? 'bg-success-light text-success-dark'
                        : 'bg-error-light text-error-dark'
                    )}
                  >
                    {policy.effect}
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <button
                    onClick={() => alert(`Edit policy: ${policy.name}`)}
                    className="text-neutral-400 hover:text-neutral-600"
                  >
                    •••
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Access Requests */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-neutral-900">Recent Access Requests</h2>
          <button
            onClick={() => navigate('/cortex/security/access?tab=requests')}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            View All
          </button>
        </div>
        <div className="space-y-3">
          {recentRequests.map((request) => (
            <div
              key={request.id}
              className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg"
            >
              <div>
                <p className="font-medium text-neutral-900">{request.user}</p>
                <p className="text-sm text-neutral-500">Requesting access to {request.resource}</p>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={cn(
                    'px-2 py-1 rounded-full text-xs font-medium',
                    request.status === 'approved' && 'bg-success-light text-success-dark',
                    request.status === 'denied' && 'bg-error-light text-error-dark',
                    request.status === 'pending' && 'bg-warning-light text-warning-dark'
                  )}
                >
                  {request.status}
                </span>
                {request.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => alert(`Access request for ${request.user} approved!`)}
                      className="px-3 py-1 bg-success-main text-white text-sm rounded-lg hover:bg-success-dark"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => alert(`Access request for ${request.user} denied.`)}
                      className="px-3 py-1 border border-neutral-300 text-neutral-700 text-sm rounded-lg hover:bg-neutral-100"
                    >
                      Deny
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// AUDIT LOG PAGE
// =============================================================================

export const AuditLogPage: React.FC = () => {
  const [filters, setFilters] = useState({
    dateRange: '7d',
    eventType: 'all',
    user: '',
  });

  const auditLogs = [
    {
      id: 1,
      timestamp: new Date(Date.now() - 60000),
      user: 'john@acme.com',
      action: 'LOGIN',
      resource: '-',
      ip: '192.168.1.1',
      status: 'success',
    },
    {
      id: 2,
      timestamp: new Date(Date.now() - 120000),
      user: 'john@acme.com',
      action: 'VIEW',
      resource: 'Dashboard',
      ip: '192.168.1.1',
      status: 'success',
    },
    {
      id: 3,
      timestamp: new Date(Date.now() - 180000),
      user: 'sarah@acme.com',
      action: 'EXPORT',
      resource: 'customers.csv',
      ip: '192.168.1.2',
      status: 'blocked',
    },
    {
      id: 4,
      timestamp: new Date(Date.now() - 300000),
      user: 'mike@acme.com',
      action: 'UPDATE',
      resource: 'User Settings',
      ip: '192.168.1.3',
      status: 'success',
    },
    {
      id: 5,
      timestamp: new Date(Date.now() - 600000),
      user: 'emily@acme.com',
      action: 'DELETE',
      resource: 'Report #123',
      ip: '192.168.1.4',
      status: 'success',
    },
    {
      id: 6,
      timestamp: new Date(Date.now() - 900000),
      user: 'tom@acme.com',
      action: 'LOGIN',
      resource: '-',
      ip: '10.0.0.1',
      status: 'failed',
    },
    {
      id: 7,
      timestamp: new Date(Date.now() - 1200000),
      user: 'tom@acme.com',
      action: 'LOGIN',
      resource: '-',
      ip: '10.0.0.1',
      status: 'failed',
    },
    {
      id: 8,
      timestamp: new Date(Date.now() - 1500000),
      user: 'tom@acme.com',
      action: 'LOGIN',
      resource: '-',
      ip: '10.0.0.1',
      status: 'failed',
    },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Audit Log</h1>
          <p className="text-neutral-500">Complete record of all system activity</p>
        </div>
        <button
          onClick={() => {
            const logsData = JSON.stringify(
              auditLogs.map((l) => ({ ...l, timestamp: l.timestamp.toISOString() })),
              null,
              2
            );
            const blob = new Blob([logsData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
          }}
          className="px-4 py-2 border border-neutral-300 text-neutral-700 font-medium rounded-lg hover:bg-neutral-50 transition-colors"
        >
          Export Logs
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-neutral-200 p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <select
            value={filters.dateRange}
            onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
            className="h-10 px-3 border border-neutral-300 rounded-lg"
          >
            <option value="1h">Last hour</option>
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="custom">Custom range</option>
          </select>
          <select
            value={filters.eventType}
            onChange={(e) => setFilters({ ...filters, eventType: e.target.value })}
            className="h-10 px-3 border border-neutral-300 rounded-lg"
          >
            <option value="all">All Events</option>
            <option value="login">Login</option>
            <option value="view">View</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
            <option value="export">Export</option>
          </select>
          <input
            type="text"
            placeholder="Filter by user..."
            value={filters.user}
            onChange={(e) => setFilters({ ...filters, user: e.target.value })}
            className="flex-1 min-w-48 h-10 px-3 border border-neutral-300 rounded-lg"
          />
          <button
            onClick={() => console.log('Filters applied:', filters)}
            className="h-10 px-4 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-50">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">
                Timestamp
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">
                User
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">
                Action
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">
                Resource
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">
                IP Address
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {auditLogs.map((log) => (
              <tr key={log.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                <td className="px-4 py-3 text-sm text-neutral-600">
                  {log.timestamp.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-neutral-900">{log.user}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-neutral-100 text-neutral-700 text-xs font-mono rounded">
                    {log.action}
                  </span>
                </td>
                <td className="px-4 py-3 text-neutral-600">{log.resource}</td>
                <td className="px-4 py-3 text-neutral-500 font-mono text-sm">{log.ip}</td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      'px-2 py-1 rounded-full text-xs font-medium',
                      log.status === 'success' && 'bg-success-light text-success-dark',
                      log.status === 'failed' && 'bg-error-light text-error-dark',
                      log.status === 'blocked' && 'bg-warning-light text-warning-dark'
                    )}
                  >
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="p-4 border-t border-neutral-200 flex items-center justify-between">
          <span className="text-sm text-neutral-500">Showing 1-8 of 1,234 events</span>
          <div className="flex gap-2">
            <button
              onClick={() => console.log('Previous page')}
              className="px-3 py-1.5 border border-neutral-300 rounded-lg text-sm hover:bg-neutral-50"
              disabled
            >
              Previous
            </button>
            <button
              onClick={() => console.log('Next page')}
              className="px-3 py-1.5 border border-neutral-300 rounded-lg text-sm hover:bg-neutral-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// SECURITY POLICIES PAGE
// =============================================================================

export const SecurityPoliciesPage: React.FC = () => {
  const [showCreatePolicy, setShowCreatePolicy] = useState(false);
  const policies = [
    {
      id: 1,
      name: 'Password Policy',
      status: 'active',
      description: 'Minimum 12 characters, complexity requirements',
      lastUpdated: 'Nov 1, 2025',
    },
    {
      id: 2,
      name: 'Session Timeout',
      status: 'active',
      description: 'Auto-logout after 30 minutes of inactivity',
      lastUpdated: 'Oct 15, 2025',
    },
    {
      id: 3,
      name: 'Data Export Policy',
      status: 'active',
      description: 'Require approval for exports over 1000 records',
      lastUpdated: 'Sep 20, 2025',
    },
    {
      id: 4,
      name: 'IP Allowlist',
      status: 'draft',
      description: 'Restrict access to corporate IP ranges',
      lastUpdated: 'Nov 20, 2025',
    },
    {
      id: 5,
      name: 'MFA Enforcement',
      status: 'active',
      description: 'Require MFA for all users',
      lastUpdated: 'Aug 1, 2025',
    },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Security Policies</h1>
          <p className="text-neutral-500">Configure organizational security policies</p>
        </div>
        <button
          onClick={() => setShowCreatePolicy(true)}
          className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
        >
          + Create Policy
        </button>
      </div>

      <div className="space-y-4">
        {policies.map((policy) => (
          <div key={policy.id} className="bg-white rounded-xl border border-neutral-200 p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-neutral-900">{policy.name}</h3>
                  <span
                    className={cn(
                      'px-2 py-0.5 rounded-full text-xs font-medium',
                      policy.status === 'active'
                        ? 'bg-success-light text-success-dark'
                        : 'bg-neutral-100 text-neutral-600'
                    )}
                  >
                    {policy.status}
                  </span>
                </div>
                <p className="text-neutral-500">{policy.description}</p>
                <p className="text-sm text-neutral-400 mt-2">Last updated: {policy.lastUpdated}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => alert(`Editing policy: ${policy.name}`)}
                  className="px-3 py-1.5 border border-neutral-300 text-neutral-700 text-sm rounded-lg hover:bg-neutral-50"
                >
                  Edit
                </button>
                {policy.status === 'draft' && (
                  <button
                    onClick={() => alert(`Policy '${policy.name}' activated!`)}
                    className="px-3 py-1.5 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700"
                  >
                    Activate
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SecurityOverviewPage;
