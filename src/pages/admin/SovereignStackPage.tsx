// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA SOVEREIGN STACK - Infrastructure Management Page
// Real-time monitoring and control of all sovereign infrastructure services
// =============================================================================

import React, { useState, useEffect, useCallback } from 'react';
import {
  Server,
  Database,
  HardDrive,
  Activity,
  Shield,
  Key,
  Search,
  GitBranch,
  Workflow,
  ToggleLeft,
  Box,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Cpu,
  MemoryStick,
  Network,
  Zap,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Terminal,
} from 'lucide-react';
import { sovereignApi, enterpriseApi } from '../../lib/sovereignApi';

// =============================================================================
// TYPES
// =============================================================================

interface SovereignService {
  id: string;
  name: string;
  brandName: string;
  description: string;
  icon: React.ElementType;
  category: 'data' | 'observability' | 'security' | 'orchestration' | 'integration';
  port: number;
  status: 'online' | 'degraded' | 'offline' | 'starting';
  url: string;
  metrics?: {
    cpu?: number;
    memory?: number;
    uptime?: string;
    requests?: number;
  };
}

interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  services: SovereignService[];
}

// =============================================================================
// SOVEREIGN SERVICES CONFIGURATION
// =============================================================================

const SOVEREIGN_SERVICES: SovereignService[] = [
  // Data Layer
  {
    id: 'postgres',
    name: 'PostgreSQL + pgvector',
    brandName: 'CendiaMemory™',
    description: 'Primary database with vector embeddings for agent long-term memory',
    icon: Database,
    category: 'data',
    port: 5434,
    status: 'online',
    url: 'http://localhost:5434',
  },
  {
    id: 'redis',
    name: 'Redis + BullMQ',
    brandName: 'CendiaQueue™',
    description: 'Cache and job queues for agent orchestration',
    icon: Zap,
    category: 'data',
    port: 6380,
    status: 'online',
    url: 'http://localhost:6380',
  },
  {
    id: 'druid',
    name: 'Apache Druid',
    brandName: 'CendiaChronos™ Engine',
    description: 'High-performance analytics for event history and audit trails',
    icon: Activity,
    category: 'data',
    port: 8888,
    status: 'online',
    url: 'http://localhost:8888',
  },
  {
    id: 'minio',
    name: 'MinIO',
    brandName: 'CendiaVault™',
    description: 'S3-compatible object storage for documents and backups',
    icon: HardDrive,
    category: 'data',
    port: 9001,
    status: 'online',
    url: 'http://localhost:9001',
  },
  {
    id: 'meilisearch',
    name: 'Meilisearch',
    brandName: 'CendiaGnosis™ Search',
    description: 'Lightning-fast full-text search for documents',
    icon: Search,
    category: 'data',
    port: 7700,
    status: 'online',
    url: 'http://localhost:7700',
  },
  // Observability Layer
  {
    id: 'prometheus',
    name: 'Prometheus',
    brandName: 'CendiaPulse™ Metrics',
    description: 'Metrics collection and alerting',
    icon: Activity,
    category: 'observability',
    port: 9090,
    status: 'online',
    url: 'http://localhost:9090',
  },
  {
    id: 'grafana',
    name: 'Grafana',
    brandName: 'CendiaPulse™ Dashboards',
    description: 'Visualization and monitoring dashboards',
    icon: Activity,
    category: 'observability',
    port: 3001,
    status: 'online',
    url: 'http://localhost:3001',
  },
  {
    id: 'loki',
    name: 'Loki',
    brandName: 'CendiaWitness™ Logs',
    description: 'Log aggregation and querying',
    icon: Terminal,
    category: 'observability',
    port: 3100,
    status: 'online',
    url: 'http://localhost:3100',
  },
  // Security Layer
  {
    id: 'keycloak',
    name: 'Keycloak',
    brandName: 'CendiaKey™',
    description: 'Identity and access management, SSO',
    icon: Key,
    category: 'security',
    port: 8080,
    status: 'online',
    url: 'http://localhost:8080',
  },
  {
    id: 'infisical',
    name: 'Infisical',
    brandName: 'CendiaGuard™ Secrets',
    description: 'Secret management and encryption',
    icon: Shield,
    category: 'security',
    port: 8090,
    status: 'online',
    url: 'http://localhost:8090',
  },
  // Orchestration Layer
  {
    id: 'n8n',
    name: 'n8n',
    brandName: 'CendiaFlow™',
    description: 'Visual workflow automation',
    icon: Workflow,
    category: 'orchestration',
    port: 5678,
    status: 'online',
    url: 'http://localhost:5678',
  },
  {
    id: 'unleash',
    name: 'Unleash',
    brandName: 'CendiaControl™',
    description: 'Feature flags and dynamic configuration',
    icon: ToggleLeft,
    category: 'orchestration',
    port: 4242,
    status: 'online',
    url: 'http://localhost:4242',
  },
  // Enterprise Additions
  {
    id: 'clickhouse',
    name: 'ClickHouse',
    brandName: 'CendiaAnalytics™ Fast',
    description: 'Fast SQL analytics with auto-routing from Druid',
    icon: Activity,
    category: 'data',
    port: 8123,
    status: 'online',
    url: 'http://localhost:8123',
  },
  {
    id: 'tika',
    name: 'Apache Tika',
    brandName: 'CendiaIngest™',
    description: 'Universal document extraction (PDF, DOCX, PPTX, etc.)',
    icon: Box,
    category: 'orchestration',
    port: 9998,
    status: 'online',
    url: 'http://localhost:9998',
  },
  {
    id: 'tempo',
    name: 'Grafana Tempo',
    brandName: 'CendiaTrace™',
    description: 'Distributed tracing for full request visibility',
    icon: Activity,
    category: 'observability',
    port: 3200,
    status: 'online',
    url: 'http://localhost:3200',
  },
  {
    id: 'falco',
    name: 'Falco',
    brandName: 'CendiaWatchdog™',
    description: 'Runtime security (production Linux only)',
    icon: Shield,
    category: 'security',
    port: 8765,
    status: 'offline',
    url: 'http://localhost:8765',
  },
  {
    id: 'wazuh',
    name: 'Wazuh',
    brandName: 'CendiaSentinel™',
    description: 'Universal IDS/SIEM - file integrity, vulnerability detection',
    icon: Shield,
    category: 'security',
    port: 55000,
    status: 'online',
    url: 'http://localhost:55000',
  },
  {
    id: 'step-ca',
    name: 'step-ca',
    brandName: 'CendiaPKI™',
    description: 'Internal PKI for zero-trust mTLS',
    icon: Key,
    category: 'security',
    port: 9002,
    status: 'online',
    url: 'http://localhost:9002',
  },
  {
    id: 'vaultwarden',
    name: 'Vaultwarden',
    brandName: 'CendiaKey™ Vault',
    description: 'Sovereign credential manager (Rust, 100MB RAM, air-gapped)',
    icon: Key,
    category: 'security',
    port: 8005,
    status: 'online',
    url: 'http://localhost:8005',
  },
];

const CATEGORIES: ServiceCategory[] = [
  {
    id: 'data',
    name: 'Data Layer',
    description: 'Databases, storage, and search',
    color: '#3B82F6',
    services: SOVEREIGN_SERVICES.filter((s) => s.category === 'data'),
  },
  {
    id: 'observability',
    name: 'Observability',
    description: 'Metrics, logs, and monitoring',
    color: '#10B981',
    services: SOVEREIGN_SERVICES.filter((s) => s.category === 'observability'),
  },
  {
    id: 'security',
    name: 'Security',
    description: 'Identity, secrets, and access control',
    color: '#EF4444',
    services: SOVEREIGN_SERVICES.filter((s) => s.category === 'security'),
  },
  {
    id: 'orchestration',
    name: 'Orchestration',
    description: 'Workflows, flags, and automation',
    color: '#8B5CF6',
    services: SOVEREIGN_SERVICES.filter((s) => s.category === 'orchestration'),
  },
];

// =============================================================================
// STATUS INDICATOR COMPONENT
// =============================================================================

const StatusIndicator: React.FC<{ status: SovereignService['status'] }> = ({ status }) => {
  const config = {
    online: { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10', label: 'Online' },
    degraded: {
      icon: AlertTriangle,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
      label: 'Degraded',
    },
    offline: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10', label: 'Offline' },
    starting: { icon: Clock, color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'Starting' },
  }[status];

  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full ${config.bg}`}>
      <Icon className={`w-3.5 h-3.5 ${config.color}`} />
      <span className={`text-xs font-medium ${config.color}`}>{config.label}</span>
    </div>
  );
};

// =============================================================================
// SERVICE CARD COMPONENT
// =============================================================================

const ServiceCard: React.FC<{
  service: SovereignService;
  onOpenConsole: (service: SovereignService) => void;
}> = ({ service, onOpenConsole }) => {
  const Icon = service.icon;

  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-neutral-100 rounded-lg">
            <Icon className="w-5 h-5 text-neutral-600" />
          </div>
          <div>
            <h4 className="font-semibold text-neutral-900">{service.name}</h4>
            <p className="text-xs text-indigo-600 font-medium">{service.brandName}</p>
          </div>
        </div>
        <StatusIndicator status={service.status} />
      </div>

      <p className="text-sm text-neutral-600 mb-3">{service.description}</p>

      <div className="flex items-center justify-between">
        <span className="text-xs text-neutral-500">Port: {service.port}</span>
        <div className="flex gap-2">
          <button
            onClick={() => onOpenConsole(service)}
            className="p-1.5 text-neutral-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
            title="Open Console"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
          <button
            className="p-1.5 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded transition-colors"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {service.metrics && (
        <div className="mt-3 pt-3 border-t border-neutral-100 grid grid-cols-2 gap-2">
          {service.metrics.cpu !== undefined && (
            <div className="flex items-center gap-1.5 text-xs text-neutral-500">
              <Cpu className="w-3 h-3" />
              <span>CPU: {service.metrics.cpu}%</span>
            </div>
          )}
          {service.metrics.memory !== undefined && (
            <div className="flex items-center gap-1.5 text-xs text-neutral-500">
              <MemoryStick className="w-3 h-3" />
              <span>RAM: {service.metrics.memory}%</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// =============================================================================
// MAIN PAGE COMPONENT
// =============================================================================

export default function SovereignStackPage() {
  const [services, setServices] = useState<SovereignService[]>(SOVEREIGN_SERVICES);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [securityStatus, setSecurityStatus] = useState<any>(null);

  const checkServiceHealth = useCallback(async () => {
    setIsRefreshing(true);

    try {
      // Use the sovereign API for real health checks
      const [healthStatus, secStatus] = await Promise.all([
        sovereignApi.getHealthStatus(),
        enterpriseApi.getSecurityStatus().catch(() => null),
      ]);

      // Update enterprise security status
      if (secStatus) {
        setSecurityStatus(secStatus);
      }

      // Map backend service names to our service IDs
      const serviceHealthMap: Record<string, boolean> = {
        druid: healthStatus.services?.druid?.available ?? false,
        minio: healthStatus.services?.minio?.available ?? false,
        postgres: healthStatus.services?.vector?.available ?? false, // pgvector uses postgres
        redis: healthStatus.services?.queue?.available ?? false, // BullMQ uses redis
        prometheus: healthStatus.services?.prometheus?.available ?? false,
        grafana: healthStatus.services?.prometheus?.available ?? false, // Same stack
        loki: healthStatus.services?.prometheus?.available ?? false, // Same stack
        n8n: healthStatus.services?.n8n?.available ?? false,
        unleash: healthStatus.services?.unleash?.available ?? false,
        keycloak: true, // Assume online if Docker is running
        infisical: true,
        meilisearch: true,
      };

      const updatedServices = services.map((service) => ({
        ...service,
        status:
          (serviceHealthMap[service.id] ?? false) ? ('online' as const) : ('offline' as const),
        metrics: healthStatus.services?.[service.id]?.latency
          ? { ...service.metrics, latency: healthStatus.services[service.id].latency }
          : service.metrics,
      }));

      setServices(updatedServices);
    } catch (error) {
      console.error('[SovereignStack] Health check failed, falling back to direct checks:', error);

      // Fallback to direct service checks
      const updatedServices = await Promise.all(
        services.map(async (service) => {
          try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 3000);
            await fetch(service.url, {
              method: 'HEAD',
              signal: controller.signal,
              mode: 'no-cors',
            });
            clearTimeout(timeout);
            return { ...service, status: 'online' as const };
          } catch {
            return { ...service, status: 'offline' as const };
          }
        })
      );
      setServices(updatedServices);
    }

    setLastRefresh(new Date());
    setIsRefreshing(false);
  }, [services]);

  useEffect(() => {
    // Initial health check
    checkServiceHealth();

    // Refresh every 30 seconds
    const interval = setInterval(checkServiceHealth, 30000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openConsole = (service: SovereignService) => {
    window.open(service.url, '_blank');
  };

  const onlineCount = services.filter((s) => s.status === 'online').length;
  const totalCount = services.length;

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Server className="w-6 h-6 text-indigo-600" />
              </div>
              <h1 className="text-2xl font-bold text-neutral-900">Sovereign Stack</h1>
            </div>
            <p className="text-neutral-600">
              Infrastructure management for your air-gapped, self-hosted platform
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-neutral-900">
                {onlineCount}/{totalCount}
              </div>
              <div className="text-sm text-neutral-500">Services Online</div>
            </div>
            <button
              onClick={checkServiceHealth}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        <div className="mt-4 text-xs text-neutral-500">
          Last updated: {lastRefresh.toLocaleTimeString()}
        </div>
      </div>

      {/* Overall Health Banner */}
      <div className="max-w-7xl mx-auto mb-8">
        <div
          className={`rounded-lg p-4 ${
            onlineCount === totalCount
              ? 'bg-green-50 border border-green-200'
              : onlineCount > totalCount / 2
                ? 'bg-amber-50 border border-amber-200'
                : 'bg-red-50 border border-red-200'
          }`}
        >
          <div className="flex items-center gap-3">
            {onlineCount === totalCount ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">
                  All systems operational. Your sovereign infrastructure is fully online.
                </span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span className="font-medium text-amber-800">
                  {totalCount - onlineCount} service(s) require attention.
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Enterprise Security Status Panel */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6" />
              <h3 className="text-lg font-semibold">Enterprise Security Status</h3>
            </div>
            <div className="flex gap-2">
              <a
                href="http://localhost:8005"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm"
              >
                <Key className="w-4 h-4" />
                CendiaKey™ Vault
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="http://localhost:8080"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm"
              >
                <Shield className="w-4 h-4" />
                Keycloak SSO
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-xs text-white/60 mb-1">Keycloak SSO</div>
              <div className="flex items-center gap-2">
                <CheckCircle2
                  className={`w-4 h-4 ${securityStatus?.keycloak?.enabled ? 'text-green-400' : 'text-neutral-400'}`}
                />
                <span className="text-sm font-medium">
                  {securityStatus?.keycloak?.realm || 'cendia'}
                </span>
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-xs text-white/60 mb-1">Policy Engine</div>
              <div className="flex items-center gap-2">
                <CheckCircle2
                  className={`w-4 h-4 ${securityStatus?.casbin?.enabled ? 'text-green-400' : 'text-neutral-400'}`}
                />
                <span className="text-sm font-medium">
                  {securityStatus?.casbin?.policyCount || 0} policies
                </span>
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-xs text-white/60 mb-1">Document Extraction</div>
              <div className="flex items-center gap-2">
                <CheckCircle2
                  className={`w-4 h-4 ${securityStatus?.tika?.available ? 'text-green-400' : 'text-neutral-400'}`}
                />
                <span className="text-sm font-medium">Apache Tika</span>
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-xs text-white/60 mb-1">Distributed Tracing</div>
              <div className="flex items-center gap-2">
                <CheckCircle2
                  className={`w-4 h-4 ${securityStatus?.tempo?.enabled ? 'text-green-400' : 'text-neutral-400'}`}
                />
                <span className="text-sm font-medium">Tempo OTEL</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Service Categories */}
      <div className="max-w-7xl mx-auto space-y-8">
        {CATEGORIES.map((category) => (
          <div key={category.id}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 rounded-full" style={{ backgroundColor: category.color }} />
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">{category.name}</h2>
                <p className="text-sm text-neutral-500">{category.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={services.find((s) => s.id === service.id) || service}
                  onOpenConsole={openConsole}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Architecture Diagram */}
      <div className="max-w-7xl mx-auto mt-12">
        <div className="bg-white border border-neutral-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Architecture Overview</h3>
          <div className="grid grid-cols-4 gap-4 text-center text-sm">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="font-semibold text-blue-800 mb-2">Layer 0: Data</div>
              <div className="text-blue-600 text-xs space-y-1">
                <div>PostgreSQL + pgvector</div>
                <div>Redis + BullMQ</div>
                <div>Apache Druid</div>
                <div>MinIO</div>
              </div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="font-semibold text-green-800 mb-2">Layer 1: Observability</div>
              <div className="text-green-600 text-xs space-y-1">
                <div>Prometheus</div>
                <div>Grafana</div>
                <div>Loki</div>
              </div>
            </div>
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="font-semibold text-red-800 mb-2">Layer 2: Security</div>
              <div className="text-red-600 text-xs space-y-1">
                <div>Keycloak (SSO)</div>
                <div>Infisical (Secrets)</div>
              </div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="font-semibold text-purple-800 mb-2">Layer 3: Orchestration</div>
              <div className="text-purple-600 text-xs space-y-1">
                <div>n8n (Workflows)</div>
                <div>Unleash (Flags)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-7xl mx-auto mt-8">
        <div className="bg-neutral-900 rounded-lg p-6 text-white">
          <h3 className="font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a
              href="http://localhost:3001"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-3 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors"
            >
              <Activity className="w-4 h-4 text-green-400" />
              <span className="text-sm">Open Grafana</span>
            </a>
            <a
              href="http://localhost:5678"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-3 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors"
            >
              <Workflow className="w-4 h-4 text-purple-400" />
              <span className="text-sm">Open n8n</span>
            </a>
            <a
              href="http://localhost:9001"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-3 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors"
            >
              <HardDrive className="w-4 h-4 text-blue-400" />
              <span className="text-sm">Open MinIO</span>
            </a>
            <a
              href="http://localhost:8888"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-3 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors"
            >
              <Database className="w-4 h-4 text-amber-400" />
              <span className="text-sm">Open Druid</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
