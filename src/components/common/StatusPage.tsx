// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Public Status Page Component
 *
 * Quick Win: Public status page showing system health
 * - Real-time service status
 * - Uptime history
 * - Incident history
 * - Scheduled maintenance
 */

import React, { useState, useEffect } from 'react';
import { cn } from '../../../lib/utils';

interface ServiceStatus {
  name: string;
  status: 'operational' | 'degraded' | 'outage' | 'maintenance';
  latency?: number;
  uptime: number;
  lastChecked: Date;
}

interface Incident {
  id: string;
  title: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  severity: 'minor' | 'major' | 'critical';
  affectedServices: string[];
  createdAt: Date;
  updatedAt: Date;
  updates: { timestamp: Date; message: string }[];
}

interface MaintenanceWindow {
  id: string;
  title: string;
  description: string;
  scheduledStart: Date;
  scheduledEnd: Date;
  affectedServices: string[];
  status: 'scheduled' | 'in_progress' | 'completed';
}

const StatusPage: React.FC = () => {
  const [services, setServices] = useState<ServiceStatus[]>([
    {
      name: 'API Gateway',
      status: 'operational',
      latency: 45,
      uptime: 99.99,
      lastChecked: new Date(),
    },
    {
      name: 'Council Deliberations',
      status: 'operational',
      latency: 1200,
      uptime: 99.95,
      lastChecked: new Date(),
    },
    {
      name: 'Knowledge Graph',
      status: 'operational',
      latency: 35,
      uptime: 99.98,
      lastChecked: new Date(),
    },
    {
      name: 'CendiaChronos',
      status: 'operational',
      latency: 28,
      uptime: 99.97,
      lastChecked: new Date(),
    },
    {
      name: 'Real-time Updates',
      status: 'operational',
      latency: 15,
      uptime: 99.99,
      lastChecked: new Date(),
    },
    {
      name: 'File Storage',
      status: 'operational',
      latency: 22,
      uptime: 99.99,
      lastChecked: new Date(),
    },
    {
      name: 'Authentication',
      status: 'operational',
      latency: 18,
      uptime: 99.99,
      lastChecked: new Date(),
    },
    {
      name: 'Analytics',
      status: 'operational',
      latency: 55,
      uptime: 99.9,
      lastChecked: new Date(),
    },
  ]);

  const [incidents, setIncidents] = useState<Incident[]>([
    {
      id: 'inc-001',
      title: 'Elevated API latency in EU region',
      status: 'resolved',
      severity: 'minor',
      affectedServices: ['API Gateway'],
      createdAt: new Date(Date.now() - 86400000 * 2),
      updatedAt: new Date(Date.now() - 86400000 * 2 + 3600000),
      updates: [
        {
          timestamp: new Date(Date.now() - 86400000 * 2),
          message: 'Investigating elevated latency in EU region',
        },
        {
          timestamp: new Date(Date.now() - 86400000 * 2 + 1800000),
          message: 'Identified cause as network congestion',
        },
        {
          timestamp: new Date(Date.now() - 86400000 * 2 + 3600000),
          message: 'Issue resolved, latency returned to normal',
        },
      ],
    },
  ]);

  const [maintenance, setMaintenance] = useState<MaintenanceWindow[]>([
    {
      id: 'maint-001',
      title: 'Database maintenance',
      description: 'Scheduled database optimization and index rebuilding',
      scheduledStart: new Date(Date.now() + 86400000 * 3),
      scheduledEnd: new Date(Date.now() + 86400000 * 3 + 7200000),
      affectedServices: ['Knowledge Graph', 'Analytics'],
      status: 'scheduled',
    },
  ]);

  const [uptimeData] = useState<number[]>([
    99.99, 99.99, 99.95, 99.99, 99.99, 99.99, 99.99, 99.98, 99.99, 99.99, 99.99, 99.99, 99.9, 99.99,
    99.99, 99.99, 99.99, 99.99, 99.95, 99.99, 99.99, 99.99, 99.99, 99.99, 99.99, 99.99, 99.99,
    99.99, 99.99, 99.99,
  ]);

  const getOverallStatus = () => {
    if (services.some((s) => s.status === 'outage')) {return 'outage';}
    if (services.some((s) => s.status === 'degraded')) {return 'degraded';}
    if (services.some((s) => s.status === 'maintenance')) {return 'maintenance';}
    return 'operational';
  };

  const overallStatus = getOverallStatus();
  const overallUptime = (services.reduce((sum, s) => sum + s.uptime, 0) / services.length).toFixed(
    2
  );

  const statusConfig = {
    operational: { color: 'bg-green-500', text: 'All Systems Operational', icon: '✓' },
    degraded: { color: 'bg-yellow-500', text: 'Partial System Outage', icon: '⚠' },
    outage: { color: 'bg-red-500', text: 'Major System Outage', icon: '✕' },
    maintenance: { color: 'bg-blue-500', text: 'Scheduled Maintenance', icon: '🔧' },
  };

  const serviceStatusColors = {
    operational: 'bg-green-500',
    degraded: 'bg-yellow-500',
    outage: 'bg-red-500',
    maintenance: 'bg-blue-500',
  };

  const incidentSeverityColors = {
    minor: 'bg-yellow-100 text-yellow-800',
    major: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800',
  };

  const incidentStatusColors = {
    investigating: 'text-red-600',
    identified: 'text-orange-600',
    monitoring: 'text-blue-600',
    resolved: 'text-green-600',
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎯</span>
              <h1 className="text-xl font-bold text-neutral-900">Datacendia Status</h1>
            </div>
            <a
              href="https://datacendia.com"
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              ← Back to Datacendia
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Overall Status Banner */}
        <div className={cn('rounded-xl p-6 mb-8 text-white', statusConfig[overallStatus].color)}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-3xl">{statusConfig[overallStatus].icon}</span>
              <div>
                <h2 className="text-2xl font-bold">{statusConfig[overallStatus].text}</h2>
                <p className="text-white/80">{overallUptime}% uptime over the last 30 days</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-white/70">Last updated</div>
              <div className="font-medium">{new Date().toLocaleTimeString()}</div>
            </div>
          </div>
        </div>

        {/* Uptime Graph */}
        <section className="bg-white rounded-xl border border-neutral-200 p-6 mb-8">
          <h3 className="font-semibold text-neutral-900 mb-4">30-Day Uptime History</h3>
          <div className="flex items-end gap-1 h-16">
            {uptimeData.map((uptime, i) => (
              <div
                key={i}
                className={cn(
                  'flex-1 rounded-t transition-all hover:opacity-80',
                  uptime >= 99.95 ? 'bg-green-500' : uptime >= 99.0 ? 'bg-yellow-500' : 'bg-red-500'
                )}
                style={{ height: `${Math.max(20, (uptime - 98) * 50)}%` }}
                title={`Day ${i + 1}: ${uptime}%`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-neutral-400">
            <span>30 days ago</span>
            <span>Today</span>
          </div>
        </section>

        {/* Services Status */}
        <section className="bg-white rounded-xl border border-neutral-200 mb-8">
          <div className="px-6 py-4 border-b border-neutral-200">
            <h3 className="font-semibold text-neutral-900">Service Status</h3>
          </div>
          <div className="divide-y divide-neutral-100">
            {services.map((service) => (
              <div key={service.name} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={cn('w-3 h-3 rounded-full', serviceStatusColors[service.status])}
                  />
                  <span className="font-medium text-neutral-900">{service.name}</span>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  {service.latency && <span className="text-neutral-500">{service.latency}ms</span>}
                  <span className="text-neutral-500">{service.uptime}%</span>
                  <span
                    className={cn(
                      'capitalize font-medium',
                      service.status === 'operational'
                        ? 'text-green-600'
                        : service.status === 'degraded'
                          ? 'text-yellow-600'
                          : service.status === 'outage'
                            ? 'text-red-600'
                            : 'text-blue-600'
                    )}
                  >
                    {service.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Scheduled Maintenance */}
        {maintenance.length > 0 && (
          <section className="bg-white rounded-xl border border-neutral-200 mb-8">
            <div className="px-6 py-4 border-b border-neutral-200">
              <h3 className="font-semibold text-neutral-900">Scheduled Maintenance</h3>
            </div>
            <div className="divide-y divide-neutral-100">
              {maintenance.map((m) => (
                <div key={m.id} className="px-6 py-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-neutral-900">{m.title}</h4>
                    <span
                      className={cn(
                        'px-2 py-1 rounded text-xs font-medium',
                        m.status === 'scheduled'
                          ? 'bg-blue-100 text-blue-700'
                          : m.status === 'in_progress'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-green-100 text-green-700'
                      )}
                    >
                      {m.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600 mb-2">{m.description}</p>
                  <div className="flex items-center gap-4 text-xs text-neutral-500">
                    <span>
                      📅 {m.scheduledStart.toLocaleDateString()}{' '}
                      {m.scheduledStart.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}{' '}
                      -{' '}
                      {m.scheduledEnd.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <span>Affects: {m.affectedServices.join(', ')}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Incident History */}
        <section className="bg-white rounded-xl border border-neutral-200">
          <div className="px-6 py-4 border-b border-neutral-200">
            <h3 className="font-semibold text-neutral-900">Incident History</h3>
          </div>
          {incidents.length === 0 ? (
            <div className="px-6 py-8 text-center text-neutral-500">
              No incidents in the last 30 days 🎉
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {incidents.map((incident) => (
                <div key={incident.id} className="px-6 py-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <h4 className="font-medium text-neutral-900">{incident.title}</h4>
                      <span
                        className={cn(
                          'px-2 py-0.5 rounded text-xs font-medium',
                          incidentSeverityColors[incident.severity]
                        )}
                      >
                        {incident.severity}
                      </span>
                    </div>
                    <span
                      className={cn(
                        'text-sm font-medium capitalize',
                        incidentStatusColors[incident.status]
                      )}
                    >
                      {incident.status}
                    </span>
                  </div>
                  <div className="ml-4 border-l-2 border-neutral-200 pl-4 mt-3 space-y-2">
                    {incident.updates.map((update, i) => (
                      <div key={i} className="text-sm">
                        <span className="text-neutral-400">
                          {update.timestamp.toLocaleTimeString()}
                        </span>
                        <span className="mx-2 text-neutral-300">—</span>
                        <span className="text-neutral-600">{update.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Subscribe */}
        <div className="mt-8 text-center">
          <p className="text-neutral-600 mb-4">Get notified about status updates</p>
          <div className="flex items-center justify-center gap-3">
            <input
              type="email"
              placeholder="your@email.com"
              className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <button className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium">
              Subscribe
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-neutral-500">
          © {new Date().getFullYear()} Datacendia. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default StatusPage;
