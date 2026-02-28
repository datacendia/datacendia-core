// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA — USER PROFILE PAGE (MVP)
// =============================================================================
// Basic user profile: identity, role, activity log, preferences, API keys.

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { authApi } from '../../../lib/api';
import { cn } from '../../../../lib/utils';
import {
  User, Shield, Key, Clock, Settings, Mail, Building2,
  Activity, LogOut, ChevronRight, Copy, Check, Eye, EyeOff,
} from 'lucide-react';

interface UserProfile {
  name: string;
  email: string;
  role: string;
  organization: string;
  lastLogin: string;
  createdAt: string;
  avatarUrl?: string;
}

interface ActivityItem {
  id: string;
  action: string;
  target: string;
  timestamp: Date;
  type: 'deliberation' | 'approval' | 'login' | 'export' | 'config';
}

// Demo activity data
const DEMO_ACTIVITY: ActivityItem[] = [
  { id: '1', action: 'Started deliberation', target: 'Q1 Budget Allocation Review', timestamp: new Date(Date.now() - 3600000), type: 'deliberation' },
  { id: '2', action: 'Approved decision', target: 'Vendor Selection — Cloud Provider', timestamp: new Date(Date.now() - 7200000), type: 'approval' },
  { id: '3', action: 'Exported receipt', target: "Regulator's Receipt #RC-2026-0214", timestamp: new Date(Date.now() - 14400000), type: 'export' },
  { id: '4', action: 'Signed in', target: 'Web — Chrome (Windows)', timestamp: new Date(Date.now() - 28800000), type: 'login' },
  { id: '5', action: 'Updated configuration', target: 'Council Mode: Strategic Advisory', timestamp: new Date(Date.now() - 86400000), type: 'config' },
  { id: '6', action: 'Started deliberation', target: 'Compliance Gap Assessment — EU AI Act', timestamp: new Date(Date.now() - 172800000), type: 'deliberation' },
];

const activityIcon = (type: ActivityItem['type']) => {
  switch (type) {
    case 'deliberation': return <Activity className="w-4 h-4 text-blue-400" />;
    case 'approval': return <Check className="w-4 h-4 text-green-400" />;
    case 'login': return <LogOut className="w-4 h-4 text-slate-400" />;
    case 'export': return <Copy className="w-4 h-4 text-purple-400" />;
    case 'config': return <Settings className="w-4 h-4 text-amber-400" />;
  }
};

const timeAgo = (d: Date) => {
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) {return `${mins}m ago`;}
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) {return `${hrs}h ago`;}
  return `${Math.floor(hrs / 24)}d ago`;
};

export const UserProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showApiKey, setShowApiKey] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const res = await authApi.getCurrentUser();
        if (res.success && res.data) {
          setProfile({
            name: res.data.name || 'User',
            email: res.data.email || '',
            role: (res.data as any).role || 'OWNER',
            organization: (res.data as any).organizationName || 'Datacendia',
            lastLogin: new Date().toISOString(),
            createdAt: (res.data as any).createdAt || '2024-01-15T00:00:00Z',
          });
        }
      } catch (e) {
        console.error('Failed to load profile:', e);
        setProfile({
          name: user?.name || 'User',
          email: user?.email || '',
          role: 'OWNER',
          organization: 'Datacendia',
          lastLogin: new Date().toISOString(),
          createdAt: '2024-01-15T00:00:00Z',
        });
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [user]);

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText('dc_live_xxxxxxxxxxxxxxxxxxxx');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8 max-w-[1200px] mx-auto flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 max-w-[1200px] mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {profile?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
          </div>
          <div>
            <h1 className="text-xl font-bold text-neutral-100">{profile?.name}</h1>
            <p className="text-sm text-neutral-400">{profile?.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border bg-amber-500/15 text-amber-400 border-amber-500/30">
                {profile?.role}
              </span>
              <span className="text-xs text-neutral-500">·</span>
              <span className="text-xs text-neutral-400 flex items-center gap-1">
                <Building2 className="w-3 h-3" /> {profile?.organization}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/cortex/settings/preferences')}
            className="px-4 py-2 rounded-lg border border-neutral-700 text-neutral-300 hover:bg-neutral-800 text-sm flex items-center gap-2 transition-colors"
          >
            <Settings className="w-4 h-4" /> Settings
          </button>
          <button
            onClick={logout}
            className="px-4 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm flex items-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Deliberations', value: '47', icon: Activity, color: 'text-blue-400' },
          { label: 'Decisions Approved', value: '31', icon: Check, color: 'text-green-400' },
          { label: 'Receipts Generated', value: '12', icon: Copy, color: 'text-purple-400' },
          { label: 'Active Sessions', value: '1', icon: Shield, color: 'text-amber-400' },
        ].map((stat, i) => (
          <div key={i} className="p-4 rounded-xl border border-neutral-700/50 bg-neutral-900/50">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={cn('w-4 h-4', stat.color)} />
              <span className="text-xs text-neutral-500 uppercase tracking-wider">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-neutral-100">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 rounded-xl border border-neutral-700/50 bg-neutral-900/50 overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-700/50 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-neutral-200 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" /> Recent Activity
            </h2>
            <span className="text-xs text-neutral-500">{DEMO_ACTIVITY.length} events</span>
          </div>
          <div className="divide-y divide-neutral-800/50">
            {DEMO_ACTIVITY.map((item) => (
              <div key={item.id} className="px-5 py-3 flex items-center gap-3 hover:bg-neutral-800/30 transition-colors">
                {activityIcon(item.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-neutral-200 truncate">
                    <span className="font-medium">{item.action}</span>
                    <span className="text-neutral-500"> — </span>
                    <span className="text-neutral-400">{item.target}</span>
                  </p>
                </div>
                <span className="text-xs text-neutral-500 shrink-0">{timeAgo(item.timestamp)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links & API Key */}
        <div className="space-y-4">
          {/* Quick Links */}
          <div className="rounded-xl border border-neutral-700/50 bg-neutral-900/50 overflow-hidden">
            <div className="px-5 py-4 border-b border-neutral-700/50">
              <h2 className="text-sm font-semibold text-neutral-200">Quick Links</h2>
            </div>
            <div className="divide-y divide-neutral-800/50">
              {[
                { label: 'Organization Settings', path: '/cortex/settings/organization', icon: Building2 },
                { label: 'Security Settings', path: '/cortex/settings/security', icon: Shield },
                { label: 'API Keys', path: '/cortex/settings/api-keys', icon: Key },
                { label: 'Preferences', path: '/cortex/settings/preferences', icon: Settings },
              ].map((link, i) => (
                <button
                  key={i}
                  onClick={() => navigate(link.path)}
                  className="w-full px-5 py-3 flex items-center gap-3 hover:bg-neutral-800/30 transition-colors text-left"
                >
                  <link.icon className="w-4 h-4 text-neutral-400" />
                  <span className="text-sm text-neutral-300 flex-1">{link.label}</span>
                  <ChevronRight className="w-4 h-4 text-neutral-600" />
                </button>
              ))}
            </div>
          </div>

          {/* API Key Preview */}
          <div className="rounded-xl border border-neutral-700/50 bg-neutral-900/50 p-5">
            <h3 className="text-sm font-semibold text-neutral-200 mb-3 flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-400" /> API Key
            </h3>
            <div className="flex items-center gap-2">
              <code className="flex-1 px-3 py-2 bg-neutral-800 rounded-lg text-xs text-neutral-400 font-mono truncate">
                {showApiKey ? 'dc_live_xxxxxxxxxxxxxxxxxxxx' : 'dc_live_••••••••••••••••••••'}
              </code>
              <button
                onClick={() => setShowApiKey(!showApiKey)}
                className="p-2 rounded-lg hover:bg-neutral-800 text-neutral-400 transition-colors"
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button
                onClick={handleCopyApiKey}
                className="p-2 rounded-lg hover:bg-neutral-800 text-neutral-400 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-neutral-600 mt-2">
              Manage keys in <button onClick={() => navigate('/cortex/settings/api-keys')} className="text-blue-400 hover:underline">Settings → API Keys</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
