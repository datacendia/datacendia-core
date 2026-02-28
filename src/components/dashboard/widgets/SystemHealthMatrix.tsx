// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * SYSTEM HEALTH MATRIX - Technology Vertical
 * Status page style service health visualization
 */

import React, { useEffect, useState } from 'react';
import { cn } from '../../../lib/utils';
import { CheckCircle, AlertTriangle, XCircle, MinusCircle } from 'lucide-react';
import { deterministicFloat, deterministicInt } from '../../../lib/deterministic';

interface Service {
  id: string;
  name: string;
  status: 'operational' | 'degraded' | 'partial' | 'major' | 'maintenance';
  latency: number;
  uptime: number;
  lastIncident?: string | undefined;
}

interface ServiceGroup {
  id: string;
  name: string;
  services: Service[];
}

const SAMPLE_GROUPS: ServiceGroup[] = [
  {
    id: 'core', name: 'Core Platform',
    services: [
      { id: 'api', name: 'API Gateway', status: 'operational', latency: 42, uptime: 99.99 },
      { id: 'auth', name: 'Authentication', status: 'operational', latency: 38, uptime: 99.98 },
      { id: 'db', name: 'Database Cluster', status: 'operational', latency: 12, uptime: 99.97 },
      { id: 'cache', name: 'Cache Layer', status: 'operational', latency: 3, uptime: 99.99 },
    ],
  },
  {
    id: 'compute', name: 'Compute Services',
    services: [
      { id: 'k8s', name: 'Kubernetes', status: 'operational', latency: 0, uptime: 99.95 },
      { id: 'functions', name: 'Serverless Functions', status: 'degraded', latency: 245, uptime: 99.82, lastIncident: '2h ago' },
      { id: 'batch', name: 'Batch Processing', status: 'operational', latency: 0, uptime: 99.91 },
    ],
  },
  {
    id: 'data', name: 'Data Pipeline',
    services: [
      { id: 'ingest', name: 'Data Ingestion', status: 'operational', latency: 156, uptime: 99.94 },
      { id: 'stream', name: 'Stream Processing', status: 'partial', latency: 423, uptime: 99.71, lastIncident: '35m ago' },
      { id: 'warehouse', name: 'Data Warehouse', status: 'operational', latency: 89, uptime: 99.96 },
    ],
  },
  {
    id: 'ai', name: 'AI/ML Services',
    services: [
      { id: 'inference', name: 'Model Inference', status: 'operational', latency: 234, uptime: 99.89 },
      { id: 'training', name: 'Training Pipeline', status: 'maintenance', latency: 0, uptime: 99.45 },
      { id: 'embeddings', name: 'Embeddings API', status: 'operational', latency: 67, uptime: 99.92 },
    ],
  },
];

const StatusIcon: React.FC<{ status: Service['status'] }> = ({ status }) => {
  switch (status) {
    case 'operational':
      return <CheckCircle className="w-4 h-4 text-emerald-500" />;
    case 'degraded':
      return <AlertTriangle className="w-4 h-4 text-amber-500" />;
    case 'partial':
      return <MinusCircle className="w-4 h-4 text-orange-500" />;
    case 'major':
      return <XCircle className="w-4 h-4 text-red-500" />;
    case 'maintenance':
      return <MinusCircle className="w-4 h-4 text-violet-500" />;
  }
};

const StatusBar: React.FC<{ uptime: number }> = ({ uptime: _uptime }) => {
  // Generate 90 days of status bars (uptime used for seeding in production)
  const days = Array.from({ length: 90 }, () => {
    const rand = deterministicFloat('systemhealthmatrix-4');
    if (rand > 0.98) {return 'major';}
    if (rand > 0.95) {return 'partial';}
    if (rand > 0.92) {return 'degraded';}
    return 'operational';
  });

  return (
    <div className="flex gap-px">
      {days.map((status, i) => (
        <div
          key={i}
          className={cn(
            'w-1 h-6 rounded-sm',
            status === 'operational' && 'bg-emerald-500',
            status === 'degraded' && 'bg-amber-500',
            status === 'partial' && 'bg-orange-500',
            status === 'major' && 'bg-red-500',
          )}
          title={`Day ${90 - i}: ${status}`}
        />
      ))}
    </div>
  );
};

const ServiceRow: React.FC<{ service: Service }> = ({ service }) => (
  <div className="flex items-center justify-between py-2 px-3 hover:bg-sovereign-hover/50 rounded-lg transition-colors">
    <div className="flex items-center gap-3">
      <StatusIcon status={service.status} />
      <div>
        <p className="text-sm text-white">{service.name}</p>
        {service.lastIncident && (
          <p className="text-xs text-gray-500">Incident {service.lastIncident}</p>
        )}
      </div>
    </div>
    <div className="flex items-center gap-4">
      {service.latency > 0 && (
        <span className={cn(
          'text-xs',
          service.latency < 100 ? 'text-emerald-400' :
          service.latency < 300 ? 'text-amber-400' : 'text-red-400'
        )}>
          {service.latency}ms
        </span>
      )}
      <span className={cn(
        'text-xs font-medium',
        service.uptime >= 99.9 ? 'text-emerald-400' :
        service.uptime >= 99.5 ? 'text-amber-400' : 'text-red-400'
      )}>
        {service.uptime.toFixed(2)}%
      </span>
    </div>
  </div>
);

export const SystemHealthMatrix: React.FC<{ className?: string }> = ({ className }) => {
  const [groups, setGroups] = useState<ServiceGroup[]>(SAMPLE_GROUPS);

  // Simulate status changes
  useEffect(() => {
    const interval = setInterval(() => {
      setGroups(prev => prev.map(group => ({
        ...group,
        services: group.services.map((service): Service => {
          if (deterministicFloat('systemhealthmatrix-2') > 0.95) {
            const statuses: Service['status'][] = ['operational', 'operational', 'operational', 'degraded', 'partial'];
            const newStatus = statuses[Math.floor(deterministicFloat('systemhealthmatrix-5') * statuses.length)] as Service['status'];
            return {
              ...service,
              status: newStatus,
              latency: newStatus === 'operational' ? service.latency * (0.9 + deterministicFloat('systemhealthmatrix-3') * 0.2) : service.latency * (1.5 + deterministicFloat('systemhealthmatrix-6')),
              lastIncident: newStatus !== 'operational' ? 'Just now' : service.lastIncident,
            };
          }
          return {
            ...service,
            latency: Math.max(1, service.latency + (deterministicFloat('systemhealthmatrix-1') - 0.5) * 10),
          };
        }),
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const allServices = groups.flatMap(g => g.services);
  const operational = allServices.filter(s => s.status === 'operational').length;
  const issues = allServices.filter(s => s.status !== 'operational' && s.status !== 'maintenance').length;
  const avgUptime = allServices.reduce((sum, s) => sum + s.uptime, 0) / allServices.length;

  const overallStatus = issues === 0 ? 'All Systems Operational' :
    issues === 1 ? 'Minor Service Disruption' :
    issues <= 3 ? 'Partial System Outage' : 'Major System Outage';

  const statusColor = issues === 0 ? 'text-emerald-400 bg-emerald-900/20 border-emerald-500/30' :
    issues <= 2 ? 'text-amber-400 bg-amber-900/20 border-amber-500/30' :
    'text-red-400 bg-red-900/20 border-red-500/30';

  return (
    <div className={cn('relative w-full h-full min-h-[400px] rounded-lg overflow-hidden bg-sovereign-base p-4', className)}>
      {/* Overall Status */}
      <div className={cn('rounded-xl p-4 border mb-4 text-center', statusColor)}>
        <div className="flex items-center justify-center gap-2 mb-1">
          {issues === 0 ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          <h2 className="text-lg font-semibold">{overallStatus}</h2>
        </div>
        <p className="text-xs opacity-75">
          {operational}/{allServices.length} services operational • {avgUptime.toFixed(2)}% uptime
        </p>
      </div>

      {/* 90-day Status Bar */}
      <div className="mb-4 p-3 bg-sovereign-elevated/30 rounded-lg border border-sovereign-border-subtle">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-400">90-day uptime history</span>
          <span className="text-xs text-gray-500">Today →</span>
        </div>
        <StatusBar uptime={avgUptime} />
      </div>

      {/* Service Groups */}
      <div className="space-y-4 max-h-[280px] overflow-y-auto">
        {groups.map(group => {
          const groupOperational = group.services.filter(s => s.status === 'operational').length;
          return (
            <div key={group.id} className="bg-sovereign-elevated/30 rounded-lg border border-sovereign-border-subtle">
              <div className="flex items-center justify-between p-3 border-b border-sovereign-border-subtle">
                <h3 className="text-sm font-semibold text-white">{group.name}</h3>
                <span className={cn(
                  'text-xs',
                  groupOperational === group.services.length ? 'text-emerald-400' : 'text-amber-400'
                )}>
                  {groupOperational}/{group.services.length} operational
                </span>
              </div>
              <div className="divide-y divide-sovereign-border-subtle">
                {group.services.map(service => (
                  <ServiceRow key={service.id} service={service} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mt-4 text-xs">
        <div className="flex items-center gap-1.5"><CheckCircle className="w-3 h-3 text-emerald-500" /><span className="text-gray-400">Operational</span></div>
        <div className="flex items-center gap-1.5"><AlertTriangle className="w-3 h-3 text-amber-500" /><span className="text-gray-400">Degraded</span></div>
        <div className="flex items-center gap-1.5"><MinusCircle className="w-3 h-3 text-orange-500" /><span className="text-gray-400">Partial</span></div>
        <div className="flex items-center gap-1.5"><XCircle className="w-3 h-3 text-red-500" /><span className="text-gray-400">Major</span></div>
        <div className="flex items-center gap-1.5"><MinusCircle className="w-3 h-3 text-violet-500" /><span className="text-gray-400">Maintenance</span></div>
      </div>

      {/* Live indicator */}
      <div className="absolute top-3 right-3 flex items-center gap-2 bg-sovereign-elevated/95 backdrop-blur-sm rounded-full px-3 py-1.5 border border-sovereign-border">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-xs text-gray-300">Live</span>
      </div>
    </div>
  );
};

export default SystemHealthMatrix;
