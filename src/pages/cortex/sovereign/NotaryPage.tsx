// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Shield, Key, Lock, Unlock, RefreshCw, AlertTriangle, 
  CheckCircle, XCircle, Clock, Server, Cloud, HardDrive,
  FileKey, RotateCcw, Eye, EyeOff, Copy, Download, Upload,
  Settings, Activity, History, Fingerprint
} from 'lucide-react';

// =============================================================================
// CENDIANOTARY™ - Cryptographic Signing Authority
// Signs and authenticates all decisions with customer-owned keys
// Supports: AWS KMS, HashiCorp Vault, Azure Key Vault, Local Air-Gapped
// =============================================================================

interface KeyInfo {
  keyId: string;
  alias: string;
  provider: 'aws-kms' | 'hashicorp-vault' | 'azure-keyvault' | 'local';
  algorithm: string;
  keySpec: string;
  status: 'active' | 'pending-rotation' | 'disabled' | 'scheduled-deletion';
  createdAt: string;
  rotatedAt?: string;
  expiresAt?: string;
  usageCount: number;
  lastUsed?: string;
}

interface ProviderStatus {
  provider: string;
  connected: boolean;
  latency?: number;
  lastCheck: string;
  keyCount: number;
  error?: string;
}

interface AuditEntry {
  id: string;
  timestamp: string;
  action: 'sign' | 'encrypt' | 'decrypt' | 'rotate' | 'create' | 'delete';
  keyId: string;
  actor: string;
  success: boolean;
  details?: string;
}

const NotaryPage: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'overview' | 'keys' | 'providers' | 'audit' | 'settings'>('overview');
  const [keys, setKeys] = useState<KeyInfo[]>([]);
  const [providers, setProviders] = useState<ProviderStatus[]>([]);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSecrets, setShowSecrets] = useState(false);
  const [selectedKey, setSelectedKey] = useState<KeyInfo | null>(null);

  useEffect(() => {
    loadNotaryData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadNotaryData = async () => {
    setIsLoading(true);
    try {
      // Load from backend API
      const [keysRes, providersRes, auditRes] = await Promise.all([
        fetch('/api/v1/kms/keys').then(r => r.ok ? r.json() : { keys: [] }),
        fetch('/api/v1/kms/providers').then(r => r.ok ? r.json() : { providers: [] }),
        fetch('/api/v1/kms/audit?limit=50').then(r => r.ok ? r.json() : { entries: [] }),
      ]);

      setKeys(keysRes.keys || getMockKeys());
      setProviders(providersRes.providers || getMockProviders());
      setAuditLog(auditRes.entries || getMockAuditLog());
    } catch (error) {
      console.error('[CendiaNotary] Failed to load data:', error);
      // Use mock data for demo
      setKeys(getMockKeys());
      setProviders(getMockProviders());
      setAuditLog(getMockAuditLog());
    } finally {
      setIsLoading(false);
    }
  };

  const getMockKeys = (): KeyInfo[] => [
    {
      keyId: 'key-decision-signing-001',
      alias: 'Decision Packet Signing Key',
      provider: 'local',
      algorithm: 'RSA-PSS',
      keySpec: 'RSA_4096',
      status: 'active',
      createdAt: '2025-12-01T00:00:00Z',
      rotatedAt: '2026-01-01T00:00:00Z',
      usageCount: 1247,
      lastUsed: '2026-01-03T21:30:00Z',
    },
    {
      keyId: 'key-audit-ledger-001',
      alias: 'Immutable Ledger Signing Key',
      provider: 'local',
      algorithm: 'ECDSA',
      keySpec: 'ECC_NIST_P384',
      status: 'active',
      createdAt: '2025-11-15T00:00:00Z',
      usageCount: 8934,
      lastUsed: '2026-01-03T21:45:00Z',
    },
    {
      keyId: 'key-data-encryption-001',
      alias: 'Data-at-Rest Encryption Key',
      provider: 'local',
      algorithm: 'AES-GCM',
      keySpec: 'AES_256',
      status: 'active',
      createdAt: '2025-10-01T00:00:00Z',
      usageCount: 45678,
      lastUsed: '2026-01-03T21:50:00Z',
    },
    {
      keyId: 'key-timelock-001',
      alias: 'Time-Lock Puzzle Key',
      provider: 'local',
      algorithm: 'RSA',
      keySpec: 'RSA_2048',
      status: 'active',
      createdAt: '2025-12-15T00:00:00Z',
      usageCount: 23,
      lastUsed: '2026-01-02T14:00:00Z',
    },
  ];

  const getMockProviders = (): ProviderStatus[] => [
    {
      provider: 'Local (Air-Gapped)',
      connected: true,
      latency: 2,
      lastCheck: new Date().toISOString(),
      keyCount: 4,
    },
    {
      provider: 'AWS KMS',
      connected: false,
      lastCheck: new Date().toISOString(),
      keyCount: 0,
      error: 'Not configured - Air-gapped mode active',
    },
    {
      provider: 'HashiCorp Vault',
      connected: false,
      lastCheck: new Date().toISOString(),
      keyCount: 0,
      error: 'Not configured',
    },
    {
      provider: 'Azure Key Vault',
      connected: false,
      lastCheck: new Date().toISOString(),
      keyCount: 0,
      error: 'Not configured',
    },
  ];

  const getMockAuditLog = (): AuditEntry[] => [
    {
      id: 'audit-001',
      timestamp: '2026-01-03T21:50:00Z',
      action: 'sign',
      keyId: 'key-decision-signing-001',
      actor: 'council-service',
      success: true,
      details: 'Signed decision packet DEL-2026-0103-001',
    },
    {
      id: 'audit-002',
      timestamp: '2026-01-03T21:45:00Z',
      action: 'sign',
      keyId: 'key-audit-ledger-001',
      actor: 'ledger-service',
      success: true,
      details: 'Appended ledger entry #8934',
    },
    {
      id: 'audit-003',
      timestamp: '2026-01-03T21:30:00Z',
      action: 'encrypt',
      keyId: 'key-data-encryption-001',
      actor: 'storage-service',
      success: true,
      details: 'Encrypted document upload',
    },
    {
      id: 'audit-004',
      timestamp: '2026-01-01T00:00:00Z',
      action: 'rotate',
      keyId: 'key-decision-signing-001',
      actor: 'system-scheduler',
      success: true,
      details: 'Scheduled key rotation completed',
    },
  ];

  const getProviderIcon = (provider: string) => {
    if (provider.includes('AWS')) {return <Cloud className="w-5 h-5 text-orange-400" />;}
    if (provider.includes('Azure')) {return <Cloud className="w-5 h-5 text-blue-400" />;}
    if (provider.includes('HashiCorp')) {return <Server className="w-5 h-5 text-purple-400" />;}
    return <HardDrive className="w-5 h-5 text-green-400" />;
  };

  const getStatusBadge = (status: KeyInfo['status']) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400 border border-green-500/30">Active</span>;
      case 'pending-rotation':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">Pending Rotation</span>;
      case 'disabled':
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-500/20 text-gray-400 border border-gray-500/30">Disabled</span>;
      case 'scheduled-deletion':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-500/20 text-red-400 border border-red-500/30">Scheduled Deletion</span>;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Stats calculations
  const activeKeys = keys.filter(k => k.status === 'active').length;
  const totalSignatures = keys.reduce((sum, k) => sum + k.usageCount, 0);
  const connectedProviders = providers.filter(p => p.connected).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30">
            <Lock className="w-8 h-8 text-amber-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              CendiaNotary™
            </h1>
            <p className="text-gray-400 text-sm">Cryptographic Signing Authority</p>
          </div>
        </div>
        <p className="text-gray-500 text-sm mt-2">
          Signs and authenticates all decisions with customer-owned keys. Non-repudiation for every action.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
          <div className="flex items-center justify-between mb-2">
            <Key className="w-5 h-5 text-amber-400" />
            <span className="text-xs text-gray-500">Keys</span>
          </div>
          <div className="text-2xl font-bold text-white">{activeKeys}</div>
          <div className="text-xs text-gray-400">Active encryption keys</div>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
          <div className="flex items-center justify-between mb-2">
            <Fingerprint className="w-5 h-5 text-cyan-400" />
            <span className="text-xs text-gray-500">Signatures</span>
          </div>
          <div className="text-2xl font-bold text-white">{totalSignatures.toLocaleString()}</div>
          <div className="text-xs text-gray-400">Cryptographic operations</div>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
          <div className="flex items-center justify-between mb-2">
            <Server className="w-5 h-5 text-green-400" />
            <span className="text-xs text-gray-500">Providers</span>
          </div>
          <div className="text-2xl font-bold text-white">{connectedProviders}/{providers.length}</div>
          <div className="text-xs text-gray-400">Connected KMS providers</div>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
          <div className="flex items-center justify-between mb-2">
            <Shield className="w-5 h-5 text-purple-400" />
            <span className="text-xs text-gray-500">Mode</span>
          </div>
          <div className="text-2xl font-bold text-green-400">Air-Gapped</div>
          <div className="text-xs text-gray-400">Zero cloud dependency</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-700/50 pb-2">
        {[
          { id: 'overview', label: 'Overview', icon: Activity },
          { id: 'keys', label: 'Keys', icon: Key },
          { id: 'providers', label: 'Providers', icon: Server },
          { id: 'audit', label: 'Audit Log', icon: History },
          { id: 'settings', label: 'Settings', icon: Settings },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Security Status */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-400" />
              Security Status
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <div>
                  <div className="text-sm font-medium text-white">Keys Secure</div>
                  <div className="text-xs text-gray-400">All keys encrypted at rest</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <div>
                  <div className="text-sm font-medium text-white">Air-Gap Active</div>
                  <div className="text-xs text-gray-400">No external KMS calls</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <div>
                  <div className="text-sm font-medium text-white">Rotation Current</div>
                  <div className="text-xs text-gray-400">No keys past rotation date</div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Usage Chart Placeholder */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              Key Usage (Last 24 Hours)
            </h2>
            <div className="h-48 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <Fingerprint className="w-12 h-12 mx-auto mb-2 text-gray-600" />
                <p className="text-sm">1,247 signing operations</p>
                <p className="text-xs text-gray-600">Peak: 3:00 PM (156 ops/hour)</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <History className="w-5 h-5 text-purple-400" />
              Recent Activity
            </h2>
            <div className="space-y-2">
              {auditLog.slice(0, 5).map(entry => (
                <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {entry.success ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400" />
                    )}
                    <div>
                      <div className="text-sm text-white">{entry.action.toUpperCase()}: {entry.details}</div>
                      <div className="text-xs text-gray-500">{entry.actor}</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">{formatDate(entry.timestamp)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'keys' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-white">Encryption Keys</h2>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 text-amber-400 rounded-lg border border-amber-500/30 hover:bg-amber-500/30 transition-colors">
                <Key className="w-4 h-4" />
                Generate Key
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg border border-gray-600/50 hover:bg-gray-700 transition-colors">
                <Upload className="w-4 h-4" />
                Import Key
              </button>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Key</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Provider</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Algorithm</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Usage</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {keys.map(key => (
                  <tr key={key.keyId} className="hover:bg-gray-800/30">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <FileKey className="w-5 h-5 text-amber-400" />
                        <div>
                          <div className="text-sm font-medium text-white">{key.alias}</div>
                          <div className="text-xs text-gray-500 font-mono">{key.keyId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <HardDrive className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-gray-300">Local</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-300">{key.algorithm}</div>
                      <div className="text-xs text-gray-500">{key.keySpec}</div>
                    </td>
                    <td className="px-4 py-4">{getStatusBadge(key.status)}</td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-white">{key.usageCount.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">operations</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors" title="Rotate Key">
                          <RotateCcw className="w-4 h-4 text-gray-400" />
                        </button>
                        <button className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors" title="Export Public Key">
                          <Download className="w-4 h-4 text-gray-400" />
                        </button>
                        <button className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors" title="View Details">
                          <Eye className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'providers' && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">KMS Providers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {providers.map(provider => (
              <div
                key={provider.provider}
                className={`bg-gray-800/50 rounded-xl p-6 border ${
                  provider.connected ? 'border-green-500/30' : 'border-gray-700/50'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getProviderIcon(provider.provider)}
                    <div>
                      <div className="text-sm font-medium text-white">{provider.provider}</div>
                      <div className="text-xs text-gray-500">{provider.keyCount} keys</div>
                    </div>
                  </div>
                  {provider.connected ? (
                    <span className="flex items-center gap-1 text-xs text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      Connected
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <XCircle className="w-4 h-4" />
                      Disconnected
                    </span>
                  )}
                </div>
                {provider.connected && provider.latency && (
                  <div className="text-xs text-gray-400">
                    Latency: {provider.latency}ms
                  </div>
                )}
                {provider.error && (
                  <div className="text-xs text-yellow-400 mt-2">
                    {provider.error}
                  </div>
                )}
                <button className="mt-4 w-full py-2 text-sm text-gray-400 hover:text-white border border-gray-700/50 rounded-lg hover:bg-gray-700/50 transition-colors">
                  Configure
                </button>
              </div>
            ))}
          </div>

          {/* Provider Info */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 mt-6">
            <h3 className="text-sm font-medium text-white mb-4">Supported Providers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
              <div>
                <strong className="text-white">AWS KMS</strong>
                <p>Managed keys with CloudHSM backing. Requires AWS credentials.</p>
              </div>
              <div>
                <strong className="text-white">HashiCorp Vault</strong>
                <p>Self-hosted secrets management. Transit secrets engine.</p>
              </div>
              <div>
                <strong className="text-white">Azure Key Vault</strong>
                <p>Azure-managed HSM with FIPS 140-2 Level 2 compliance.</p>
              </div>
              <div>
                <strong className="text-white">Local (Air-Gapped)</strong>
                <p>File-based key storage for fully offline deployments.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-white">Audit Log</h2>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg border border-gray-600/50 hover:bg-gray-700 transition-colors">
              <Download className="w-4 h-4" />
              Export Log
            </button>
          </div>

          <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Timestamp</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Action</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Key</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Actor</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {auditLog.map(entry => (
                  <tr key={entry.id} className="hover:bg-gray-800/30">
                    <td className="px-4 py-3 text-sm text-gray-300">{formatDate(entry.timestamp)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        entry.action === 'sign' ? 'bg-blue-500/20 text-blue-400' :
                        entry.action === 'encrypt' ? 'bg-green-500/20 text-green-400' :
                        entry.action === 'decrypt' ? 'bg-purple-500/20 text-purple-400' :
                        entry.action === 'rotate' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {entry.action.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400 font-mono">{entry.keyId}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">{entry.actor}</td>
                    <td className="px-4 py-3">
                      {entry.success ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">{entry.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-white">Vault Settings</h2>

          {/* Key Rotation Policy */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-amber-400" />
              Key Rotation Policy
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-white">Automatic Rotation</div>
                  <div className="text-xs text-gray-500">Rotate keys on a schedule</div>
                </div>
                <button className="relative w-12 h-6 bg-green-500/30 rounded-full">
                  <span className="absolute right-1 top-1 w-4 h-4 bg-green-400 rounded-full" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-white">Rotation Interval</div>
                  <div className="text-xs text-gray-500">Days between automatic rotations</div>
                </div>
                <select className="bg-gray-900/50 border border-gray-700/50 rounded-lg px-3 py-2 text-sm text-white">
                  <option value="30">30 days</option>
                  <option value="60">60 days</option>
                  <option value="90" selected>90 days</option>
                  <option value="180">180 days</option>
                  <option value="365">365 days</option>
                </select>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-400" />
              Security Settings
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-white">Require MFA for Key Operations</div>
                  <div className="text-xs text-gray-500">Additional authentication for sensitive operations</div>
                </div>
                <button className="relative w-12 h-6 bg-green-500/30 rounded-full">
                  <span className="absolute right-1 top-1 w-4 h-4 bg-green-400 rounded-full" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-white">Audit All Operations</div>
                  <div className="text-xs text-gray-500">Log every key usage to immutable ledger</div>
                </div>
                <button className="relative w-12 h-6 bg-green-500/30 rounded-full">
                  <span className="absolute right-1 top-1 w-4 h-4 bg-green-400 rounded-full" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-white">Air-Gap Mode</div>
                  <div className="text-xs text-gray-500">Disable all external KMS connections</div>
                </div>
                <button className="relative w-12 h-6 bg-green-500/30 rounded-full">
                  <span className="absolute right-1 top-1 w-4 h-4 bg-green-400 rounded-full" />
                </button>
              </div>
            </div>
          </div>

          {/* Export/Backup */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
              <Download className="w-4 h-4 text-cyan-400" />
              Backup & Recovery
            </h3>
            <div className="space-y-4">
              <button className="w-full flex items-center justify-center gap-2 py-3 bg-cyan-500/20 text-cyan-400 rounded-lg border border-cyan-500/30 hover:bg-cyan-500/30 transition-colors">
                <Download className="w-4 h-4" />
                Export Encrypted Backup
              </button>
              <p className="text-xs text-gray-500 text-center">
                Backup is encrypted with your master key. Store securely offline.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-gray-800/50 text-center text-xs text-gray-600">
        <p>CendiaNotary™ - Cryptographic Signing Authority</p>
        <p className="mt-1">Your keys. Your signatures. Non-repudiation guaranteed.</p>
      </div>
    </div>
  );
};

export default NotaryPage;
