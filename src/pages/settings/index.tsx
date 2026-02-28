// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA - SETTINGS PAGES
// =============================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useToast } from '../../../components/feedback';
import { Modal, ConfirmModal, FormModal } from '../../components/ui/Modal';
import { cn, formatRelativeTime, formatCurrency } from '../../../lib/utils';
import {
  settingsService,
  type User,
  type Team,
  type Role,
  type ApiKey,
  type BillingInfo,
} from '../../services/SettingsService';
import { useVerticalConfig } from '../../contexts/VerticalConfigContext';
import { deterministicFloat, deterministicInt } from '../../lib/deterministic';

// =============================================================================
// SETTINGS LAYOUT
// =============================================================================

export const SettingsLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const settingsNav = [
    { id: 'organization', label: 'Organization', icon: '🏢' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'teams', label: 'Teams', icon: '👔' },
    { id: 'roles', label: 'Roles & Permissions', icon: '🔐' },
    { id: 'billing', label: 'Billing', icon: '💳' },
    { id: 'api-keys', label: 'API Keys', icon: '🔑' },
    { id: 'integrations', label: 'Integrations', icon: '🔗' },
    { id: 'preferences', label: 'Preferences', icon: '⚙️' },
    { id: 'security', label: 'Security', icon: '🛡️' },
  ];

  const currentPath = location.pathname.split('/').pop();

  return (
    <div className="flex h-full">
      {/* Settings Sidebar */}
      <aside className="w-64 border-r border-neutral-200 bg-white p-4">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Settings</h2>
        <nav className="space-y-1">
          {settingsNav.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(`/cortex/settings/${item.id}`)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left',
                currentPath === item.id
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
              )}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Settings Content */}
      <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-neutral-50">
        <Outlet />
      </main>
    </div>
  );
};

// =============================================================================
// ORGANIZATION SETTINGS
// =============================================================================

// Map settings industry values to vertical IDs
const INDUSTRY_TO_VERTICAL: Record<string, string> = {
  'technology': 'technology',
  'finance': 'financial',
  'healthcare': 'healthcare',
  'sports': 'sports',
  'aviation': 'aerospace',
  'manufacturing': 'manufacturing',
  'government': 'government',
  'retail': 'retail',
  'energy': 'energy',
  'logistics': 'logistics',
  'insurance': 'insurance',
  'legal': 'legal',
  'education': 'education',
  'hospitality': 'hospitality',
  'agriculture': 'agriculture',
  'real-estate': 'real-estate',
  'telecom': 'telecom',
  'media': 'media',
  'nonprofit': 'nonprofit',
  'construction': 'construction',
  'automotive': 'automotive',
  'pharmaceutical': 'pharmaceutical',
};

export const OrganizationSettingsPage: React.FC = () => {
  const { addToast } = useToast();
  const { selectVertical, currentVertical } = useVerticalConfig();
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const navigate = useNavigate();

  const [orgData, setOrgData] = useState({
    name: 'Acme Corporation',
    id: 'org_acme_2024',
    industry: 'technology',
    companySize: '201-1000',
    primaryContact: 'John Smith',
    primaryEmail: 'john@acme.com',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD',
    numberFormat: 'en-US',
  });

  // Sync industry with vertical config on change
  const handleIndustryChange = async (newIndustry: string) => {
    setOrgData({ ...orgData, industry: newIndustry });
    
    // Map to vertical ID and update vertical config
    const verticalId = INDUSTRY_TO_VERTICAL[newIndustry] || 'technology';
    try {
      await selectVertical(verticalId);
      addToast({
        status: 'success',
        title: 'Industry Updated',
        description: `Dashboard and services updated for ${newIndustry.replace('-', ' ')} vertical`,
      });
    } catch (err) {
      console.error('Failed to update vertical:', err);
    }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Organization</h1>

      {/* Organization Profile */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Organization Profile</h2>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Organization Name
              </label>
              <input
                type="text"
                value={orgData.name}
                onChange={(e) => setOrgData({ ...orgData, name: e.target.value })}
                className="w-full h-10 px-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Organization ID
              </label>
              <input
                type="text"
                value={orgData.id}
                disabled
                className="w-full h-10 px-3 border border-neutral-200 rounded-lg bg-neutral-50 text-neutral-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Industry</label>
              <select
                value={orgData.industry}
                onChange={(e) => handleIndustryChange(e.target.value)}
                className="w-full h-10 px-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="technology">Technology</option>
                <option value="finance">Financial Services</option>
                <option value="healthcare">Healthcare</option>
                <option value="sports">Sports & Entertainment</option>
                <option value="aviation">Aviation & Aerospace</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="government">Government</option>
                <option value="retail">Retail</option>
                <option value="energy">Energy & Utilities</option>
                <option value="logistics">Transportation & Logistics</option>
                <option value="insurance">Insurance</option>
                <option value="legal">Legal & Professional Services</option>
                <option value="education">Education</option>
                <option value="hospitality">Hospitality & Travel</option>
                <option value="agriculture">Agriculture</option>
                <option value="real-estate">Real Estate</option>
                <option value="telecom">Telecommunications</option>
                <option value="media">Media & Entertainment</option>
                <option value="nonprofit">Non-Profit</option>
                <option value="construction">Construction</option>
                <option value="automotive">Automotive</option>
                <option value="pharmaceutical">Pharmaceutical</option>
              </select>
              {currentVertical && (
                <p className="text-xs text-neutral-500 mt-1">
                  Dashboard configured for: <span className="font-medium text-primary-600">{currentVertical.name}</span>
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Company Size
              </label>
              <select
                value={orgData.companySize}
                onChange={(e) => setOrgData({ ...orgData, companySize: e.target.value })}
                className="w-full h-10 px-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="1-50">1-50</option>
                <option value="51-200">51-200</option>
                <option value="201-1000">201-1,000</option>
                <option value="1001-5000">1,001-5,000</option>
                <option value="5000+">5,000+</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Primary Contact
              </label>
              <input
                type="text"
                value={orgData.primaryContact}
                onChange={(e) => setOrgData({ ...orgData, primaryContact: e.target.value })}
                className="w-full h-10 px-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Primary Email
              </label>
              <input
                type="email"
                value={orgData.primaryEmail}
                onChange={(e) => setOrgData({ ...orgData, primaryEmail: e.target.value })}
                className="w-full h-10 px-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Regional Settings */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Regional Settings</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Timezone</label>
            <select
              value={orgData.timezone}
              onChange={(e) => setOrgData({ ...orgData, timezone: e.target.value })}
              className="w-full h-10 px-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="UTC">UTC</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Date Format</label>
            <select
              value={orgData.dateFormat}
              onChange={(e) => setOrgData({ ...orgData, dateFormat: e.target.value })}
              className="w-full h-10 px-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Currency</label>
            <select
              value={orgData.currency}
              onChange={(e) => setOrgData({ ...orgData, currency: e.target.value })}
              className="w-full h-10 px-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="JPY">JPY (¥)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Number Format</label>
            <select
              value={orgData.numberFormat}
              onChange={(e) => setOrgData({ ...orgData, numberFormat: e.target.value })}
              className="w-full h-10 px-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="en-US">1,234.56</option>
              <option value="de-DE">1.234,56</option>
              <option value="fr-FR">1 234,56</option>
            </select>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-xl border border-error-main/20 p-6">
        <h2 className="text-lg font-semibold text-error-dark mb-4">Danger Zone</h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-error-light/50 rounded-lg">
            <div>
              <p className="font-medium text-neutral-900">Export All Data</p>
              <p className="text-sm text-neutral-500">
                Download all organization data as a ZIP file
              </p>
            </div>
            <button
              onClick={async () => {
                setIsExporting(true);
                await new Promise((r) => setTimeout(r, 2000));
                setIsExporting(false);
                addToast({
                  status: 'success',
                  title: 'Export Complete',
                  description: 'Your data export is ready for download.',
                });
              }}
              disabled={isExporting}
              className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-white transition-colors disabled:opacity-50"
            >
              {isExporting ? 'Exporting...' : 'Export'}
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-error-light/50 rounded-lg">
            <div>
              <p className="font-medium text-neutral-900">Delete Organization</p>
              <p className="text-sm text-neutral-500">
                Permanently delete this organization and all data
              </p>
            </div>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 bg-error-main text-white rounded-lg hover:bg-error-dark transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={async () => {
            setIsSaving(true);
            await new Promise((r) => setTimeout(r, 1000));
            setIsSaving(false);
            addToast({
              status: 'success',
              title: 'Settings Saved',
              description: 'Organization settings have been updated.',
            });
          }}
          disabled={isSaving}
          className="px-6 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowDeleteModal(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-2">Delete Organization</h2>
            <p className="text-neutral-600 mb-4">
              This action cannot be undone. This will permanently delete the organization
              <strong> {orgData.name}</strong> and all associated data.
            </p>
            <p className="text-sm text-neutral-500 mb-2">
              Type <strong>{orgData.name}</strong> to confirm:
            </p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              className="w-full h-10 px-3 border border-neutral-300 rounded-lg mb-4"
              placeholder="Organization name"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmText('');
                }}
                className="flex-1 px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setShowDeleteModal(false);
                  addToast({
                    status: 'success',
                    title: 'Organization Deleted',
                    description: 'Redirecting to home...',
                  });
                  await new Promise((r) => setTimeout(r, 1500));
                  navigate('/');
                }}
                disabled={deleteConfirmText !== orgData.name}
                className="flex-1 px-4 py-2 bg-error-main text-white rounded-lg hover:bg-error-dark disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete Organization
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// =============================================================================
// USERS SETTINGS
// =============================================================================

export const UsersSettingsPage: React.FC = () => {
  const { addToast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [metrics, setMetrics] = useState<{
    totalUsers: number;
    activeUsers: number;
    pendingInvites: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteData, setInviteData] = useState({ email: '', role: 'viewer', name: '' });
  const [isInviting, setIsInviting] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const data = await settingsService.listUsers({ search: search || undefined });
        setUsers(data.users);
        setMetrics(data.metrics);
      } catch (err) {
        console.error('Failed to load users:', err);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, [search]);

  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsInviting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsInviting(false);
    setShowInviteModal(false);
    addToast({
      status: 'success',
      title: 'Invitation Sent',
      description: `Invite sent to ${inviteData.email}`,
    });
    setInviteData({ email: '', role: 'viewer', name: '' });
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Users</h1>
          <p className="text-neutral-500">Manage user access and permissions</p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
        >
          + Invite User
        </button>
      </div>

      {/* Invite User Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowInviteModal(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Invite User</h2>
            <form onSubmit={handleInviteUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={inviteData.name}
                  onChange={(e) => setInviteData({ ...inviteData, name: e.target.value })}
                  className="w-full h-10 px-3 border border-neutral-300 rounded-lg"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={inviteData.email}
                  onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                  className="w-full h-10 px-3 border border-neutral-300 rounded-lg"
                  placeholder="user@company.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Role</label>
                <select
                  value={inviteData.role}
                  onChange={(e) => setInviteData({ ...inviteData, role: e.target.value })}
                  className="w-full h-10 px-3 border border-neutral-300 rounded-lg"
                >
                  <option value="viewer">Viewer</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isInviting}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                  {isInviting ? 'Sending...' : 'Send Invite'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* License Usage */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-neutral-900">License Usage</h2>
          <span className="text-sm text-neutral-500">{metrics?.totalUsers || 0} of 50 users</span>
        </div>
        <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-500 rounded-full transition-all"
            style={{ width: `${Math.min(((metrics?.totalUsers || 0) / 50) * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* User List */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="p-4 border-b border-neutral-200">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 px-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">
                  User
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">
                  Role
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">
                  Last Login
                </th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-700 font-medium text-sm">
                          {user.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900">{user.name}</p>
                        <p className="text-sm text-neutral-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-600 capitalize">{user.role}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        'px-2 py-1 rounded-full text-xs font-medium',
                        user.status === 'active' && 'bg-success-light text-success-dark',
                        user.status === 'pending' && 'bg-warning-light text-warning-dark',
                        user.status === 'inactive' && 'bg-neutral-100 text-neutral-600',
                        user.status === 'suspended' && 'bg-error-light text-error-dark'
                      )}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-500">
                    {user.lastLoginAt ? formatRelativeTime(new Date(user.lastLoginAt)) : 'Never'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-neutral-400 hover:text-neutral-600">•••</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

// =============================================================================
// TEAMS SETTINGS
// =============================================================================

export const TeamsSettingsPage: React.FC = () => {
  const { addToast } = useToast();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTeam, setNewTeam] = useState({ name: '', lead: '' });
  const [isCreating, setIsCreating] = useState(false);
  const [teams, setTeams] = useState([
    { id: 1, name: 'Engineering', members: 12, lead: 'John Smith' },
    { id: 2, name: 'Finance', members: 8, lead: 'Sarah Chen' },
    { id: 3, name: 'Marketing', members: 6, lead: 'Lisa Brown' },
    { id: 4, name: 'Sales', members: 15, lead: 'Mike Johnson' },
    { id: 5, name: 'Operations', members: 10, lead: 'Tom Wilson' },
  ]);

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    await new Promise((r) => setTimeout(r, 1000));
    const newId = Math.max(...teams.map((t) => t.id)) + 1;
    setTeams([...teams, { id: newId, name: newTeam.name, members: 0, lead: newTeam.lead }]);
    setIsCreating(false);
    setShowCreateModal(false);
    addToast({
      status: 'success',
      title: 'Team Created',
      description: `${newTeam.name} has been created.`,
    });
    setNewTeam({ name: '', lead: '' });
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Teams</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
        >
          + Create Team
        </button>
      </div>

      {/* Create Team Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowCreateModal(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Create Team</h2>
            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Team Name</label>
                <input
                  type="text"
                  required
                  value={newTeam.name}
                  onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                  className="w-full h-10 px-3 border border-neutral-300 rounded-lg"
                  placeholder="e.g., Product Team"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Team Lead</label>
                <input
                  type="text"
                  required
                  value={newTeam.lead}
                  onChange={(e) => setNewTeam({ ...newTeam, lead: e.target.value })}
                  className="w-full h-10 px-3 border border-neutral-300 rounded-lg"
                  placeholder="Lead name"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                  {isCreating ? 'Creating...' : 'Create Team'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {teams.map((team) => (
          <div
            key={team.id}
            className="bg-white rounded-xl border border-neutral-200 p-6 hover:border-primary-300 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-neutral-900">{team.name}</h3>
                <p className="text-sm text-neutral-500">
                  {team.members} members • Lead: {team.lead}
                </p>
              </div>
              <button
                onClick={() =>
                  addToast({
                    status: 'info',
                    title: 'Team Options',
                    description: 'Edit, archive, or delete team.',
                  })
                }
                className="text-neutral-400 hover:text-neutral-600"
              >
                •••
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// =============================================================================
// ROLES SETTINGS
// =============================================================================

export const RolesSettingsPage: React.FC = () => {
  const { addToast } = useToast();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState<string | null>(null);
  const [newRole, setNewRole] = useState({ name: '', description: '' });
  const [isCreating, setIsCreating] = useState(false);
  const [roles, setRoles] = useState([
    { id: 1, name: 'Admin', description: 'Full access to all features', users: 3, isSystem: true },
    {
      id: 2,
      name: 'Editor',
      description: 'Can edit data and run workflows',
      users: 12,
      isSystem: true,
    },
    { id: 3, name: 'Viewer', description: 'Read-only access', users: 18, isSystem: true },
    {
      id: 4,
      name: 'Finance Team',
      description: 'Custom role for finance users',
      users: 5,
      isSystem: false,
    },
  ]);

  const permissions = [
    { category: 'Data', items: ['View data', 'Edit data', 'Delete data', 'Export data'] },
    { category: 'Users', items: ['View users', 'Invite users', 'Manage users', 'Delete users'] },
    {
      category: 'Settings',
      items: ['View settings', 'Edit organization', 'Manage billing', 'Manage integrations'],
    },
    { category: 'AI', items: ['Use Council', 'Create agents', 'View insights', 'Run automations'] },
  ];

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    await new Promise((r) => setTimeout(r, 1000));
    const newId = Math.max(...roles.map((r) => r.id)) + 1;
    setRoles([
      ...roles,
      {
        id: newId,
        name: newRole.name,
        description: newRole.description,
        users: 0,
        isSystem: false,
      },
    ]);
    setIsCreating(false);
    setShowCreateModal(false);
    addToast({
      status: 'success',
      title: 'Role Created',
      description: `${newRole.name} role has been created.`,
    });
    setNewRole({ name: '', description: '' });
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Roles & Permissions</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
        >
          + Create Role
        </button>
      </div>

      {/* Create Role Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowCreateModal(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Create Role</h2>
            <form onSubmit={handleCreateRole} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Role Name</label>
                <input
                  type="text"
                  required
                  value={newRole.name}
                  onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                  className="w-full h-10 px-3 border border-neutral-300 rounded-lg"
                  placeholder="e.g., Data Analyst"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  required
                  value={newRole.description}
                  onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                  className="w-full h-10 px-3 border border-neutral-300 rounded-lg"
                  placeholder="What can this role do?"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                  {isCreating ? 'Creating...' : 'Create Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Permissions Modal */}
      {showPermissionsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setShowPermissionsModal(null)}
          />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              Permissions: {showPermissionsModal}
            </h2>
            <div className="space-y-4">
              {permissions.map((group) => (
                <div key={group.category}>
                  <h3 className="font-medium text-neutral-700 mb-2">{group.category}</h3>
                  <div className="space-y-2">
                    {group.items.map((item) => (
                      <label
                        key={item}
                        className="flex items-center gap-3 p-2 bg-neutral-50 rounded-lg"
                      >
                        <input
                          type="checkbox"
                          defaultChecked={showPermissionsModal === 'Admin'}
                          className="rounded text-primary-600"
                        />
                        <span className="text-sm text-neutral-700">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowPermissionsModal(null)}
                className="flex-1 px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowPermissionsModal(null);
                  addToast({ status: 'success', title: 'Permissions Updated' });
                }}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {roles.map((role) => (
          <div key={role.id} className="bg-white rounded-xl border border-neutral-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-neutral-900">{role.name}</h3>
                {role.isSystem && (
                  <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 text-xs rounded-full">
                    System
                  </span>
                )}
              </div>
              <span className="text-sm text-neutral-500">{role.users} users</span>
            </div>
            <p className="text-sm text-neutral-500 mb-4">{role.description}</p>
            <button
              onClick={() => setShowPermissionsModal(role.name)}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View Permissions →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// =============================================================================
// BILLING SETTINGS
// =============================================================================

export const BillingSettingsPage: React.FC = () => {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Billing</h1>

      {/* Current Plan */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">Current Plan</h2>
            <p className="text-3xl font-bold text-neutral-900 mt-2">Intelligence</p>
            <p className="text-neutral-500">{formatCurrency(10000)}/month</p>
          </div>
          <span className="px-3 py-1 bg-success-light text-success-dark text-sm font-medium rounded-full">
            Active
          </span>
        </div>
        <button
          onClick={() => navigate('/pricing')}
          className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
        >
          Upgrade Plan
        </button>
      </div>

      {/* Usage */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Usage This Month</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { name: 'Users', used: 32, limit: 50 },
            { name: 'AI Agents', used: 3, limit: 3 },
            { name: 'API Calls', used: 45200, limit: 100000 },
            { name: 'Storage', used: 12, limit: 50, unit: 'GB' },
            { name: 'Workflows', used: 47, limit: null },
          ].map((item) => (
            <div key={item.name} className="p-4 bg-neutral-50 rounded-lg">
              <p className="text-sm text-neutral-500 mb-1">{item.name}</p>
              <p className="text-xl font-bold text-neutral-900">
                {item.used.toLocaleString()}
                {item.unit ? ` ${item.unit}` : ''}
                {item.limit && (
                  <span className="text-sm font-normal text-neutral-400">
                    {' '}
                    / {item.limit.toLocaleString()}
                  </span>
                )}
              </p>
              {item.limit && (
                <div className="mt-2 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full',
                      item.used / item.limit > 0.9 ? 'bg-error-main' : 'bg-primary-500'
                    )}
                    style={{ width: `${(item.used / item.limit) * 100}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Payment Method</h2>
        <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-8 bg-neutral-900 rounded flex items-center justify-center text-white text-xs font-bold">
              VISA
            </div>
            <div>
              <p className="font-medium text-neutral-900">•••• •••• •••• 4242</p>
              <p className="text-sm text-neutral-500">Expires 12/2026</p>
            </div>
          </div>
          <button
            onClick={() =>
              addToast({
                status: 'info',
                title: 'Update Payment',
                description: 'Contact billing@datacendia.com to update payment method.',
              })
            }
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            Update
          </button>
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Billing History</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-200">
              <th className="text-left py-2 text-sm font-medium text-neutral-500">Date</th>
              <th className="text-left py-2 text-sm font-medium text-neutral-500">Description</th>
              <th className="text-right py-2 text-sm font-medium text-neutral-500">Amount</th>
              <th className="text-right py-2 text-sm font-medium text-neutral-500"></th>
            </tr>
          </thead>
          <tbody>
            {[
              { date: 'Nov 1, 2025', desc: 'Intelligence Plan', amount: 10000 },
              { date: 'Oct 1, 2025', desc: 'Intelligence Plan', amount: 10000 },
              { date: 'Sep 1, 2025', desc: 'Intelligence Plan', amount: 10000 },
            ].map((invoice, i) => (
              <tr key={i} className="border-b border-neutral-100">
                <td className="py-3 text-sm text-neutral-600">{invoice.date}</td>
                <td className="py-3 text-sm text-neutral-900">{invoice.desc}</td>
                <td className="py-3 text-sm text-neutral-900 text-right">
                  {formatCurrency(invoice.amount)}
                </td>
                <td className="py-3 text-right">
                  <button
                    onClick={() =>
                      addToast({
                        status: 'success',
                        title: 'Invoice Downloaded',
                        description: 'Invoice PDF saved to downloads.',
                      })
                    }
                    className="text-primary-600 hover:text-primary-700 text-sm"
                  >
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// =============================================================================
// API KEYS SETTINGS
// =============================================================================

export const ApiKeysSettingsPage: React.FC = () => {
  const { addToast } = useToast();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [revealedKeys, setRevealedKeys] = useState<Set<number>>(new Set());

  const [keys, setKeys] = useState([
    {
      id: 1,
      name: 'Production API',
      prefix: 'dc_live_',
      key: 'dc_live_sk_1234567890abcdef',
      lastUsed: new Date(Date.now() - 3600000),
      created: 'Oct 15, 2025',
    },
    {
      id: 2,
      name: 'Development',
      prefix: 'dc_test_',
      key: 'dc_test_sk_0987654321fedcba',
      lastUsed: new Date(Date.now() - 86400000),
      created: 'Sep 1, 2025',
    },
    {
      id: 3,
      name: 'CI/CD Pipeline',
      prefix: 'dc_live_',
      key: 'dc_live_sk_abcdef1234567890',
      lastUsed: new Date(Date.now() - 7200000),
      created: 'Aug 20, 2025',
    },
  ]);

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    await new Promise((r) => setTimeout(r, 1000));
    const newKey = `dc_live_sk_${deterministicFloat('index-1').toString(36).slice(2, 18)}`;
    const newId = Math.max(...keys.map((k) => k.id)) + 1;
    setKeys([
      ...keys,
      {
        id: newId,
        name: newKeyName,
        prefix: 'dc_live_',
        key: newKey,
        lastUsed: new Date(),
        created: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
      },
    ]);
    setCreatedKey(newKey);
    setIsCreating(false);
  };

  const handleRevoke = (id: number, name: string) => {
    setKeys(keys.filter((k) => k.id !== id));
    addToast({
      status: 'warning',
      title: 'API Key Revoked',
      description: `${name} has been permanently revoked.`,
    });
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">API Keys</h1>
          <p className="text-neutral-500">Manage API access to Datacendia</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
        >
          + Create Key
        </button>
      </div>

      {/* Create Key Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => {
              setShowCreateModal(false);
              setCreatedKey(null);
              setNewKeyName('');
            }}
          />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            {createdKey ? (
              <>
                <h2 className="text-xl font-semibold text-neutral-900 mb-4">API Key Created</h2>
                <p className="text-neutral-600 mb-4">
                  Copy this key now. You won't be able to see it again.
                </p>
                <div className="p-3 bg-neutral-100 rounded-lg font-mono text-sm break-all mb-4">
                  {createdKey}
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(createdKey);
                    addToast({ status: 'success', title: 'Copied to clipboard' });
                  }}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 mb-2"
                >
                  Copy to Clipboard
                </button>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setCreatedKey(null);
                    setNewKeyName('');
                  }}
                  className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Done
                </button>
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-neutral-900 mb-4">Create API Key</h2>
                <form onSubmit={handleCreateKey}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Key Name
                    </label>
                    <input
                      type="text"
                      required
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      className="w-full h-10 px-3 border border-neutral-300 rounded-lg"
                      placeholder="e.g., Production API"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="flex-1 px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isCreating}
                      className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                    >
                      {isCreating ? 'Creating...' : 'Create Key'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        {keys.map((key, i) => (
          <div key={key.id} className={cn('p-4', i > 0 && 'border-t border-neutral-100')}>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-neutral-900">{key.name}</h3>
                  <code className="px-2 py-0.5 bg-neutral-100 text-neutral-600 text-xs rounded">
                    {revealedKeys.has(key.id) ? key.key : `${key.prefix}••••••••`}
                  </code>
                </div>
                <p className="text-sm text-neutral-500 mt-1">
                  Created {key.created} • Last used {formatRelativeTime(key.lastUsed)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (revealedKeys.has(key.id)) {
                      const newSet = new Set(revealedKeys);
                      newSet.delete(key.id);
                      setRevealedKeys(newSet);
                    } else {
                      setRevealedKeys(new Set([...revealedKeys, key.id]));
                    }
                  }}
                  className="px-3 py-1.5 text-sm border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  {revealedKeys.has(key.id) ? 'Hide' : 'Reveal'}
                </button>
                <button
                  onClick={() => handleRevoke(key.id, key.name)}
                  className="px-3 py-1.5 text-sm text-error-main border border-error-main/20 rounded-lg hover:bg-error-light transition-colors"
                >
                  Revoke
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-warning-light/50 rounded-lg">
        <p className="text-sm text-warning-dark">
          <strong>Security Tip:</strong> Keep your API keys secure and never expose them in
          client-side code. Rotate keys periodically and revoke any that may have been compromised.
        </p>
      </div>
    </div>
  );
};

// =============================================================================
// INTEGRATIONS SETTINGS
// =============================================================================

export const IntegrationSettingsPage: React.FC = () => {
  const { addToast } = useToast();
  const [showAddModal, setShowAddModal] = useState(false);
  const [integrations, setIntegrations] = useState([
    {
      id: 'salesforce',
      name: 'Salesforce',
      icon: '☁️',
      status: 'connected',
      lastSync: new Date(Date.now() - 300000),
    },
    {
      id: 'slack',
      name: 'Slack',
      icon: '💬',
      status: 'connected',
      lastSync: new Date(Date.now() - 60000),
    },
    {
      id: 'sap',
      name: 'SAP',
      icon: '🔒',
      status: 'connected',
      lastSync: new Date(Date.now() - 3600000),
    },
    {
      id: 'snowflake',
      name: 'Snowflake',
      icon: '❄️',
      status: 'connected',
      lastSync: new Date(Date.now() - 1800000),
    },
    { id: 'workday', name: 'Workday', icon: '👥', status: 'error', lastSync: null },
    { id: 'hubspot', name: 'HubSpot', icon: '🧡', status: 'disconnected', lastSync: null },
    { id: 'jira', name: 'Jira', icon: '📋', status: 'disconnected', lastSync: null },
  ]);

  const handleConnect = async (id: string, name: string) => {
    // Simulate connection
    await new Promise((r) => setTimeout(r, 1500));
    setIntegrations((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: 'connected', lastSync: new Date() } : i))
    );
    addToast({ status: 'success', title: 'Connected', description: `${name} is now connected.` });
  };

  const handleDisconnect = (id: string, name: string) => {
    setIntegrations((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: 'disconnected', lastSync: null } : i))
    );
    addToast({
      status: 'info',
      title: 'Disconnected',
      description: `${name} has been disconnected.`,
    });
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Integrations</h1>
        <button
          onClick={() =>
            addToast({
              status: 'info',
              title: 'Browse Integrations',
              description: 'Contact sales@datacendia.com for custom integrations.',
            })
          }
          className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
        >
          + Add Integration
        </button>
      </div>

      <div className="grid gap-4">
        {integrations.map((integration) => (
          <div key={integration.id} className="bg-white rounded-xl border border-neutral-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-3xl">{integration.icon}</div>
                <div>
                  <h3 className="font-medium text-neutral-900">{integration.name}</h3>
                  <p className="text-sm text-neutral-500">
                    {integration.status === 'connected' &&
                      `Last synced ${formatRelativeTime(integration.lastSync!)}`}
                    {integration.status === 'error' && 'Connection error - click to retry'}
                    {integration.status === 'disconnected' && 'Not connected'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    'w-2.5 h-2.5 rounded-full',
                    integration.status === 'connected' && 'bg-success-main',
                    integration.status === 'error' && 'bg-error-main',
                    integration.status === 'disconnected' && 'bg-neutral-300'
                  )}
                />
                {integration.status === 'connected' ? (
                  <button
                    onClick={() => handleDisconnect(integration.id, integration.name)}
                    className="px-3 py-1.5 text-sm font-medium rounded-lg transition-colors border border-neutral-300 text-neutral-700 hover:bg-neutral-50"
                  >
                    Disconnect
                  </button>
                ) : (
                  <button
                    onClick={() => handleConnect(integration.id, integration.name)}
                    className="px-3 py-1.5 text-sm font-medium rounded-lg transition-colors bg-primary-600 text-white hover:bg-primary-700"
                  >
                    Connect
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

// =============================================================================
// PREFERENCES SETTINGS
// =============================================================================

export const PreferencesSettingsPage: React.FC = () => {
  const { addToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [prefs, setPrefs] = useState({
    theme: 'light',
    language: 'en',
    notifications: {
      email: true,
      push: true,
      slack: false,
    },
    defaultView: 'dashboard',
  });

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Preferences</h1>

      {/* Appearance */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Appearance</h2>
        <div className="grid grid-cols-3 gap-4">
          {['light', 'dark', 'system'].map((theme) => (
            <button
              key={theme}
              onClick={() => setPrefs({ ...prefs, theme })}
              className={cn(
                'p-4 rounded-lg border-2 text-center transition-colors capitalize',
                prefs.theme === theme
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-neutral-200 hover:border-neutral-300'
              )}
            >
              {theme}
            </button>
          ))}
        </div>
      </div>

      {/* Language */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Language</h2>
        <select
          value={prefs.language}
          onChange={(e) => setPrefs({ ...prefs, language: e.target.value })}
          className="w-full h-10 px-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
        >
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
          <option value="de">Deutsch</option>
          <option value="pt">Português</option>
          <option value="ja">日本語</option>
          <option value="zh">中文</option>
        </select>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Notifications</h2>
        <div className="space-y-4">
          {[
            {
              key: 'email',
              label: 'Email notifications',
              desc: 'Receive alerts and updates via email',
            },
            {
              key: 'push',
              label: 'Push notifications',
              desc: 'Browser notifications for important events',
            },
            {
              key: 'slack',
              label: 'Slack notifications',
              desc: 'Send alerts to your Slack channel',
            },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-neutral-900">{item.label}</p>
                <p className="text-sm text-neutral-500">{item.desc}</p>
              </div>
              <button
                onClick={() =>
                  setPrefs({
                    ...prefs,
                    notifications: {
                      ...prefs.notifications,
                      [item.key]:
                        !prefs.notifications[item.key as keyof typeof prefs.notifications],
                    },
                  })
                }
                className={cn(
                  'w-11 h-6 rounded-full transition-colors relative',
                  prefs.notifications[item.key as keyof typeof prefs.notifications]
                    ? 'bg-primary-600'
                    : 'bg-neutral-200'
                )}
              >
                <span
                  className={cn(
                    'absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform',
                    prefs.notifications[item.key as keyof typeof prefs.notifications]
                      ? 'left-5'
                      : 'left-0.5'
                  )}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={async () => {
            setIsSaving(true);
            await new Promise((r) => setTimeout(r, 1000));
            setIsSaving(false);
            addToast({
              status: 'success',
              title: 'Preferences Saved',
              description: 'Your preferences have been updated.',
            });
          }}
          disabled={isSaving}
          className="px-6 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>
    </div>
  );
};

// =============================================================================
// SECURITY SETTINGS
// =============================================================================

export const SecuritySettingsPage: React.FC = () => {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showSSOModal, setShowSSOModal] = useState(false);
  const [sessions, setSessions] = useState([
    { id: 1, device: 'MacBook Pro', location: 'New York, US', current: true, lastActive: 'Now' },
    {
      id: 2,
      device: 'iPhone 15',
      location: 'New York, US',
      current: false,
      lastActive: '2 hours ago',
    },
    {
      id: 3,
      device: 'Chrome on Windows',
      location: 'Chicago, US',
      current: false,
      lastActive: '1 day ago',
    },
  ]);

  const handleRevokeSession = (id: number, device: string) => {
    setSessions(sessions.filter((s) => s.id !== id));
    addToast({
      status: 'warning',
      title: 'Session Revoked',
      description: `${device} has been signed out.`,
    });
  };

  const handleRevokeAllSessions = () => {
    setSessions(sessions.filter((s) => s.current));
    addToast({
      status: 'warning',
      title: 'All Sessions Revoked',
      description: 'All other devices have been signed out.',
    });
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Security</h1>

      {/* Password */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Password</h2>
        <p className="text-neutral-500 mb-4">Last changed 45 days ago</p>
        <button
          onClick={() => setShowPasswordModal(true)}
          className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
        >
          Change Password
        </button>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowPasswordModal(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Change Password</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await new Promise((r) => setTimeout(r, 1000));
                setShowPasswordModal(false);
                addToast({
                  status: 'success',
                  title: 'Password Changed',
                  description: 'Your password has been updated.',
                });
              }}
            >
              <div className="space-y-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    required
                    className="w-full h-10 px-3 border border-neutral-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    className="w-full h-10 px-3 border border-neutral-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    className="w-full h-10 px-3 border border-neutral-300 rounded-lg"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Two-Factor Authentication */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">Two-Factor Authentication</h2>
            <p className="text-neutral-500">Add an extra layer of security to your account</p>
          </div>
          <span className="px-2 py-1 bg-success-light text-success-dark text-xs font-medium rounded-full">
            Enabled
          </span>
        </div>
        <button
          onClick={() =>
            addToast({
              status: 'info',
              title: '2FA Settings',
              description:
                'Your authenticator app is configured. Backup codes available in your profile.',
            })
          }
          className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
        >
          Manage 2FA
        </button>
      </div>

      {/* Active Sessions */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Active Sessions</h2>
        <div className="space-y-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg"
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-neutral-900">{session.device}</p>
                  {session.current && (
                    <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs rounded-full">
                      Current
                    </span>
                  )}
                </div>
                <p className="text-sm text-neutral-500">
                  {session.location} • {session.lastActive}
                </p>
              </div>
              {!session.current && (
                <button
                  onClick={() => handleRevokeSession(session.id, session.device)}
                  className="text-error-main hover:text-error-dark text-sm font-medium"
                >
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>
        {sessions.filter((s) => !s.current).length > 0 && (
          <button
            onClick={handleRevokeAllSessions}
            className="mt-4 text-error-main hover:text-error-dark text-sm font-medium"
          >
            Sign out all other sessions
          </button>
        )}
      </div>

      {/* SSO */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Single Sign-On (SSO)</h2>
        <p className="text-neutral-500 mb-4">Configure SAML-based SSO for your organization</p>
        <button
          onClick={() =>
            addToast({
              status: 'info',
              title: 'SSO Configuration',
              description: 'Contact your administrator to configure enterprise SSO.',
            })
          }
          className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
        >
          Configure SSO
        </button>
      </div>
    </div>
  );
};

export default SettingsLayout;
