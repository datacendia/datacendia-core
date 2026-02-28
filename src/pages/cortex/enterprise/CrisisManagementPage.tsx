// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIA CRISIS MANAGEMENT™ - INCIDENT RESPONSE CENTER
// Real-time crisis tracking, war room coordination, and incident lifecycle
// "From Detection to Resolution • Complete Audit Trail"
// =============================================================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// =============================================================================
// TYPES
// =============================================================================

type IncidentSeverity = 'P1' | 'P2' | 'P3' | 'P4';
type IncidentType = 'security' | 'pr' | 'operational' | 'financial' | 'legal' | 'compliance';
type IncidentPhase =
  | 'detection'
  | 'triage'
  | 'containment'
  | 'eradication'
  | 'recovery'
  | 'post-mortem'
  | 'closed';

interface Incident {
  id: string;
  title: string;
  type: IncidentType;
  severity: IncidentSeverity;
  phase: IncidentPhase;
  description: string;
  detectedAt: Date;
  assignedTo: string;
  incidentCommander?: string;
  affectedSystems: string[];
  timeline: TimelineEvent[];
  stakeholders: string[];
  containmentActions: string[];
  rootCause?: string;
  lessonsLearned?: string[];
}

interface TimelineEvent {
  id: string;
  timestamp: Date;
  actor: string;
  action: string;
  details: string;
  phase: IncidentPhase;
}

interface WarRoom {
  id: string;
  incidentId: string;
  name: string;
  status: 'active' | 'standby' | 'closed';
  participants: { name: string; role: string; online: boolean }[];
  startedAt: Date;
  decisions: { text: string; madeBy: string; timestamp: Date }[];
}

// =============================================================================
// MOCK DATA
// =============================================================================

const mockIncidents: Incident[] = [
  {
    id: 'INC-2025-001',
    title: 'Unauthorized Access Attempt Detected',
    type: 'security',
    severity: 'P2',
    phase: 'containment',
    description:
      'Multiple failed login attempts from suspicious IP range targeting executive accounts.',
    detectedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    assignedTo: 'Security Team',
    incidentCommander: 'Sarah Chen (CISO)',
    affectedSystems: ['Identity Provider', 'VPN Gateway', 'Executive Portal'],
    stakeholders: ['CISO', 'CTO', 'Legal'],
    containmentActions: [
      'Blocked IP range 185.x.x.x',
      'Forced password reset for targeted accounts',
      'Enabled enhanced monitoring',
    ],
    timeline: [
      {
        id: '1',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        actor: 'SIEM',
        action: 'Alert Generated',
        details: '50+ failed login attempts detected',
        phase: 'detection',
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 1.9 * 60 * 60 * 1000),
        actor: 'SOC Analyst',
        action: 'Triage Started',
        details: 'Confirmed malicious pattern, escalated to P2',
        phase: 'triage',
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
        actor: 'Security Team',
        action: 'IP Block Deployed',
        details: 'Firewall rules updated',
        phase: 'containment',
      },
    ],
  },
  {
    id: 'INC-2025-002',
    title: 'Negative Press Coverage - Data Practices',
    type: 'pr',
    severity: 'P2',
    phase: 'recovery',
    description:
      'TechNews article questioning data handling practices, gaining social media traction.',
    detectedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    assignedTo: 'Communications Team',
    incidentCommander: 'Michael Torres (CMO)',
    affectedSystems: [],
    stakeholders: ['CMO', 'CEO', 'Legal', 'Privacy Officer'],
    containmentActions: [
      'Prepared holding statement',
      'Identified spokesperson',
      'Drafted detailed response',
    ],
    timeline: [
      {
        id: '1',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        actor: 'Social Listening',
        action: 'Alert',
        details: 'Article gaining traction, 500+ shares',
        phase: 'detection',
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000),
        actor: 'CMO',
        action: 'War Room Activated',
        details: 'Crisis team assembled',
        phase: 'triage',
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000),
        actor: 'Communications',
        action: 'Holding Statement',
        details: 'Released initial response',
        phase: 'containment',
      },
      {
        id: '4',
        timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000),
        actor: 'CEO',
        action: 'Full Response Published',
        details: 'Detailed blog post addressing concerns',
        phase: 'recovery',
      },
    ],
    rootCause: 'Outdated privacy policy language not reflecting current practices',
    lessonsLearned: ['Update privacy policy quarterly', 'Proactive transparency reports'],
  },
  {
    id: 'INC-2025-003',
    title: 'Database Performance Degradation',
    type: 'operational',
    severity: 'P3',
    phase: 'post-mortem',
    description: 'Primary database experiencing 3x normal query latency during peak hours.',
    detectedAt: new Date(Date.now() - 72 * 60 * 60 * 1000),
    assignedTo: 'Platform Team',
    affectedSystems: ['PostgreSQL Primary', 'API Gateway'],
    stakeholders: ['CTO', 'VP Engineering'],
    containmentActions: [
      'Scaled read replicas',
      'Implemented query caching',
      'Identified slow queries',
    ],
    timeline: [],
    rootCause: 'Unoptimized query from new feature deployment',
    lessonsLearned: ['Mandatory query review for new features', 'Load testing before deployment'],
  },
];

const mockWarRoom: WarRoom = {
  id: 'WR-001',
  incidentId: 'INC-2025-001',
  name: 'Security Incident War Room',
  status: 'active',
  startedAt: new Date(Date.now() - 1.9 * 60 * 60 * 1000),
  participants: [
    { name: 'Sarah Chen', role: 'Incident Commander', online: true },
    { name: 'Alex Kim', role: 'Security Lead', online: true },
    { name: 'Jordan Lee', role: 'Network Engineer', online: true },
    { name: 'Pat Williams', role: 'Legal Counsel', online: false },
  ],
  decisions: [
    {
      text: 'Block suspicious IP range immediately',
      madeBy: 'Sarah Chen',
      timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
    },
    {
      text: 'Force password reset for all executive accounts',
      madeBy: 'Sarah Chen',
      timestamp: new Date(Date.now() - 1.3 * 60 * 60 * 1000),
    },
  ],
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

const getSeverityColor = (severity: IncidentSeverity) => {
  switch (severity) {
    case 'P1':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'P2':
      return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    case 'P3':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'P4':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
  }
};

const getPhaseColor = (phase: IncidentPhase) => {
  switch (phase) {
    case 'detection':
      return 'bg-purple-500/20 text-purple-400';
    case 'triage':
      return 'bg-orange-500/20 text-orange-400';
    case 'containment':
      return 'bg-yellow-500/20 text-yellow-400';
    case 'eradication':
      return 'bg-blue-500/20 text-blue-400';
    case 'recovery':
      return 'bg-cyan-500/20 text-cyan-400';
    case 'post-mortem':
      return 'bg-indigo-500/20 text-indigo-400';
    case 'closed':
      return 'bg-green-500/20 text-green-400';
  }
};

const getTypeIcon = (type: IncidentType) => {
  switch (type) {
    case 'security':
      return '🛡️';
    case 'pr':
      return '📢';
    case 'operational':
      return '⚙️';
    case 'financial':
      return '💰';
    case 'legal':
      return '⚖️';
    case 'compliance':
      return '📋';
  }
};

const formatTimeAgo = (date: Date) => {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) {return 'Just now';}
  if (seconds < 3600) {return `${Math.floor(seconds / 60)}m ago`;}
  if (seconds < 86400) {return `${Math.floor(seconds / 3600)}h ago`;}
  return `${Math.floor(seconds / 86400)}d ago`;
};

// =============================================================================
// COMPONENT
// =============================================================================

export const CrisisManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'incidents' | 'war-room' | 'playbooks'>(
    'dashboard'
  );
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<IncidentSeverity | 'all'>('all');

  const activeIncidents = mockIncidents.filter((i) => !['closed', 'post-mortem'].includes(i.phase));
  const filteredIncidents =
    filterSeverity === 'all'
      ? mockIncidents
      : mockIncidents.filter((i) => i.severity === filterSeverity);

  const phases: IncidentPhase[] = [
    'detection',
    'triage',
    'containment',
    'eradication',
    'recovery',
    'post-mortem',
    'closed',
  ];

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🚨</span>
          <h1 className="text-3xl font-bold">Crisis Management</h1>
          {activeIncidents.length > 0 && (
            <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-medium animate-pulse">
              {activeIncidents.length} Active
            </span>
          )}
        </div>
        <p className="text-neutral-400">
          Incident response center • War room coordination • Complete audit trail
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-neutral-700 pb-2">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: '📊' },
          { id: 'incidents', label: 'All Incidents', icon: '📋' },
          { id: 'war-room', label: 'War Room', icon: '🎯' },
          { id: 'playbooks', label: 'Playbooks', icon: '📖' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-primary-600 text-white'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-4">
            {[
              {
                label: 'Active Incidents',
                value: activeIncidents.length,
                color: 'text-red-400',
                bg: 'bg-red-500/10',
              },
              {
                label: 'P1 Critical',
                value: mockIncidents.filter((i) => i.severity === 'P1').length,
                color: 'text-red-500',
                bg: 'bg-red-500/10',
              },
              {
                label: 'Mean Time to Contain',
                value: '2.4h',
                color: 'text-yellow-400',
                bg: 'bg-yellow-500/10',
              },
              {
                label: 'Resolved This Month',
                value: '12',
                color: 'text-green-400',
                bg: 'bg-green-500/10',
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className={`${stat.bg} rounded-xl p-6 border border-neutral-700`}
              >
                <p className="text-neutral-400 text-sm">{stat.label}</p>
                <p className={`text-3xl font-bold ${stat.color} mt-1`}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Active Incidents */}
          <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              Active Incidents
            </h2>
            <div className="space-y-3">
              {activeIncidents.map((incident) => (
                <div
                  key={incident.id}
                  onClick={() => setSelectedIncident(incident)}
                  className="p-4 bg-neutral-900 rounded-lg border border-neutral-700 hover:border-primary-500 cursor-pointer transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getTypeIcon(incident.type)}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm text-neutral-500">{incident.id}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-medium border ${getSeverityColor(incident.severity)}`}
                          >
                            {incident.severity}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-medium ${getPhaseColor(incident.phase)}`}
                          >
                            {incident.phase}
                          </span>
                        </div>
                        <h3 className="font-semibold mt-1">{incident.title}</h3>
                        <p className="text-sm text-neutral-400 mt-1">{incident.description}</p>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <p className="text-neutral-500">
                        Detected {formatTimeAgo(incident.detectedAt)}
                      </p>
                      <p className="text-neutral-400">
                        {incident.incidentCommander || incident.assignedTo}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {activeIncidents.length === 0 && (
                <div className="text-center py-8 text-neutral-500">
                  <span className="text-4xl">✅</span>
                  <p className="mt-2">No active incidents</p>
                </div>
              )}
            </div>
          </div>

          {/* Incident Lifecycle */}
          <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
            <h2 className="text-xl font-semibold mb-4">Incident Lifecycle</h2>
            <div className="flex items-center justify-between">
              {phases.map((phase, idx) => (
                <React.Fragment key={phase}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium ${getPhaseColor(phase)}`}
                    >
                      {mockIncidents.filter((i) => i.phase === phase).length}
                    </div>
                    <span className="text-xs text-neutral-400 mt-2 capitalize">
                      {phase.replace('-', ' ')}
                    </span>
                  </div>
                  {idx < phases.length - 1 && (
                    <div className="flex-1 h-0.5 bg-neutral-700 mx-2"></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Incidents Tab */}
      {activeTab === 'incidents' && (
        <div className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value as IncidentSeverity | 'all')}
              className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">All Severities</option>
              <option value="P1">P1 - Critical</option>
              <option value="P2">P2 - High</option>
              <option value="P3">P3 - Medium</option>
              <option value="P4">P4 - Low</option>
            </select>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors">
              + Report Incident
            </button>
          </div>

          <div className="bg-neutral-800 rounded-xl border border-neutral-700 overflow-hidden">
            <table className="w-full">
              <thead className="bg-neutral-900">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">ID</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Type</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Title</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Severity</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Phase</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Detected</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Commander</th>
                </tr>
              </thead>
              <tbody>
                {filteredIncidents.map((incident) => (
                  <tr
                    key={incident.id}
                    onClick={() => setSelectedIncident(incident)}
                    className="border-t border-neutral-700 hover:bg-neutral-700/50 cursor-pointer transition-colors"
                  >
                    <td className="p-4 font-mono text-sm">{incident.id}</td>
                    <td className="p-4">{getTypeIcon(incident.type)}</td>
                    <td className="p-4">{incident.title}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium border ${getSeverityColor(incident.severity)}`}
                      >
                        {incident.severity}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getPhaseColor(incident.phase)}`}
                      >
                        {incident.phase}
                      </span>
                    </td>
                    <td className="p-4 text-neutral-400">{formatTimeAgo(incident.detectedAt)}</td>
                    <td className="p-4 text-neutral-300">
                      {incident.incidentCommander || incident.assignedTo}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* War Room Tab */}
      {activeTab === 'war-room' && (
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-4">
            <div className="bg-neutral-800 rounded-xl border border-red-500/30 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                  <h2 className="text-xl font-semibold">{mockWarRoom.name}</h2>
                </div>
                <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm">
                  Active • {formatTimeAgo(mockWarRoom.startedAt)}
                </span>
              </div>

              <div className="bg-neutral-900 rounded-lg p-4 mb-4">
                <h3 className="text-sm font-medium text-neutral-400 mb-2">Linked Incident</h3>
                <p className="font-mono">
                  {mockWarRoom.incidentId} -{' '}
                  {mockIncidents.find((i) => i.id === mockWarRoom.incidentId)?.title}
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-medium text-neutral-400">War Room Decisions</h3>
                {mockWarRoom.decisions.map((decision, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-neutral-900 rounded-lg">
                    <span className="text-green-500">✓</span>
                    <div>
                      <p>{decision.text}</p>
                      <p className="text-sm text-neutral-500 mt-1">
                        {decision.madeBy} • {formatTimeAgo(decision.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Escalate to P1', icon: '⬆️', color: 'bg-red-600 hover:bg-red-700' },
                  {
                    label: 'Notify Stakeholders',
                    icon: '📧',
                    color: 'bg-blue-600 hover:bg-blue-700',
                  },
                  {
                    label: 'Start Council Deliberation',
                    icon: '🧠',
                    color: 'bg-purple-600 hover:bg-purple-700',
                  },
                  { label: 'Log Decision', icon: '📝', color: 'bg-green-600 hover:bg-green-700' },
                  {
                    label: 'Request Resources',
                    icon: '🔧',
                    color: 'bg-orange-600 hover:bg-orange-700',
                  },
                  {
                    label: 'Close Incident',
                    icon: '✅',
                    color: 'bg-neutral-600 hover:bg-neutral-700',
                  },
                ].map((action) => (
                  <button
                    key={action.label}
                    className={`${action.color} text-white rounded-lg p-3 text-sm font-medium transition-colors`}
                  >
                    {action.icon} {action.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
              <h3 className="font-semibold mb-4">
                Participants ({mockWarRoom.participants.length})
              </h3>
              <div className="space-y-3">
                {mockWarRoom.participants.map((p) => (
                  <div key={p.name} className="flex items-center gap-3">
                    <span
                      className={`w-2 h-2 rounded-full ${p.online ? 'bg-green-500' : 'bg-neutral-500'}`}
                    ></span>
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-sm text-neutral-400">{p.role}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 px-4 py-2 border border-neutral-600 text-neutral-300 rounded-lg hover:bg-neutral-700 transition-colors">
                + Invite Participant
              </button>
            </div>

            <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
              <h3 className="font-semibold mb-4">Communication Channels</h3>
              <div className="space-y-2">
                {[
                  { name: 'Slack: #incident-response', status: 'connected' },
                  { name: 'Video Call', status: 'ready' },
                  { name: 'Status Page', status: 'draft' },
                ].map((channel) => (
                  <div
                    key={channel.name}
                    className="flex items-center justify-between p-2 bg-neutral-900 rounded"
                  >
                    <span className="text-sm">{channel.name}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${
                        channel.status === 'connected'
                          ? 'bg-green-500/20 text-green-400'
                          : channel.status === 'ready'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                      }`}
                    >
                      {channel.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Playbooks Tab */}
      {activeTab === 'playbooks' && (
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              name: 'Security Incident Response',
              type: 'security',
              steps: 8,
              lastUsed: '2 days ago',
              sla: '15 min triage',
            },
            {
              name: 'PR Crisis Response',
              type: 'pr',
              steps: 6,
              lastUsed: '1 week ago',
              sla: '60 min statement',
            },
            {
              name: 'Data Breach Protocol',
              type: 'security',
              steps: 12,
              lastUsed: 'Never',
              sla: '4 hr notification',
            },
            {
              name: 'Service Outage',
              type: 'operational',
              steps: 7,
              lastUsed: '3 days ago',
              sla: '5 min detection',
            },
            {
              name: 'Compliance Violation',
              type: 'compliance',
              steps: 10,
              lastUsed: '2 weeks ago',
              sla: '24 hr remediation',
            },
            {
              name: 'Legal Threat',
              type: 'legal',
              steps: 5,
              lastUsed: 'Never',
              sla: '4 hr legal review',
            },
          ].map((playbook) => (
            <div
              key={playbook.name}
              className="bg-neutral-800 rounded-xl border border-neutral-700 p-6 hover:border-primary-500 cursor-pointer transition-all"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{getTypeIcon(playbook.type as IncidentType)}</span>
                <h3 className="font-semibold">{playbook.name}</h3>
              </div>
              <div className="space-y-2 text-sm">
                <p className="text-neutral-400">{playbook.steps} steps</p>
                <p className="text-neutral-400">SLA: {playbook.sla}</p>
                <p className="text-neutral-500">Last used: {playbook.lastUsed}</p>
              </div>
              <button className="w-full mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
                Activate Playbook
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Incident Detail Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-8">
          <div className="bg-neutral-800 rounded-2xl border border-neutral-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-neutral-700">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{getTypeIcon(selectedIncident.type)}</span>
                    <span className="font-mono text-neutral-500">{selectedIncident.id}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium border ${getSeverityColor(selectedIncident.severity)}`}
                    >
                      {selectedIncident.severity}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${getPhaseColor(selectedIncident.phase)}`}
                    >
                      {selectedIncident.phase}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold">{selectedIncident.title}</h2>
                </div>
                <button
                  onClick={() => setSelectedIncident(null)}
                  className="p-2 hover:bg-neutral-700 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-medium text-neutral-400 mb-2">Description</h3>
                <p>{selectedIncident.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-neutral-400 mb-2">Incident Commander</h3>
                  <p>{selectedIncident.incidentCommander || selectedIncident.assignedTo}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-neutral-400 mb-2">Detected</h3>
                  <p>{selectedIncident.detectedAt.toLocaleString()}</p>
                </div>
              </div>

              {selectedIncident.affectedSystems.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-neutral-400 mb-2">Affected Systems</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedIncident.affectedSystems.map((sys) => (
                      <span key={sys} className="px-3 py-1 bg-neutral-700 rounded-full text-sm">
                        {sys}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedIncident.containmentActions.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-neutral-400 mb-2">Containment Actions</h3>
                  <ul className="space-y-2">
                    {selectedIncident.containmentActions.map((action, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-neutral-400 mb-2">Timeline</h3>
                <div className="space-y-3">
                  {selectedIncident.timeline.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start gap-3 p-3 bg-neutral-900 rounded-lg"
                    >
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${getPhaseColor(event.phase)}`}
                      >
                        {event.phase}
                      </span>
                      <div className="flex-1">
                        <p className="font-medium">{event.action}</p>
                        <p className="text-sm text-neutral-400">{event.details}</p>
                        <p className="text-xs text-neutral-500 mt-1">
                          {event.actor} • {event.timestamp.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedIncident.rootCause && (
                <div>
                  <h3 className="text-sm font-medium text-neutral-400 mb-2">Root Cause</h3>
                  <p className="p-3 bg-neutral-900 rounded-lg">{selectedIncident.rootCause}</p>
                </div>
              )}

              {selectedIncident.lessonsLearned && selectedIncident.lessonsLearned.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-neutral-400 mb-2">Lessons Learned</h3>
                  <ul className="space-y-2">
                    {selectedIncident.lessonsLearned.map((lesson, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="text-blue-400">💡</span>
                        {lesson}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-neutral-700 flex justify-end gap-3">
              <button className="px-4 py-2 border border-neutral-600 text-neutral-300 rounded-lg hover:bg-neutral-700 transition-colors">
                View Full Audit Trail
              </button>
              <button className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
                Open in War Room
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrisisManagementPage;
