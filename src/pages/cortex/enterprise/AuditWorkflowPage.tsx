// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIA AUDIT WORKFLOW™ - COMPLIANCE AUDIT MANAGEMENT
// T-90 to Post-Audit lifecycle management with automated checklists
// "From Planning to Closeout • Full Evidence Management"
// =============================================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// =============================================================================
// TYPES
// =============================================================================

type AuditPhase =
  | 'planning'
  | 'readiness'
  | 'remediation'
  | 'mock-audit'
  | 'final-prep'
  | 'execution'
  | 'closeout';
type TaskStatus = 'pending' | 'in-progress' | 'complete' | 'blocked' | 'not-applicable';
type AuditType = 'SOC2' | 'ISO27001' | 'HIPAA' | 'GDPR' | 'PCI-DSS' | 'FedRAMP' | 'Custom';
type FindingSeverity = 'critical' | 'high' | 'medium' | 'low' | 'informational';

interface AuditTask {
  id: string;
  title: string;
  description: string;
  phase: AuditPhase;
  status: TaskStatus;
  assignee: string;
  dueDate: Date;
  completedDate?: Date;
  evidence?: string[];
  notes?: string;
  dependencies?: string[];
}

interface AuditFinding {
  id: string;
  title: string;
  description: string;
  severity: FindingSeverity;
  control: string;
  status: 'open' | 'remediated' | 'accepted' | 'disputed';
  assignee: string;
  dueDate: Date;
  remediation?: string;
}

interface Audit {
  id: string;
  name: string;
  type: AuditType;
  auditor: string;
  startDate: Date;
  targetDate: Date;
  currentPhase: AuditPhase;
  progress: number;
  tasks: AuditTask[];
  findings: AuditFinding[];
  team: { name: string; role: string }[];
}

// =============================================================================
// MOCK DATA
// =============================================================================

const phases: { id: AuditPhase; name: string; daysOut: string; icon: string }[] = [
  { id: 'planning', name: 'Planning', daysOut: 'T-90', icon: '📋' },
  { id: 'readiness', name: 'Readiness Assessment', daysOut: 'T-60', icon: '🔍' },
  { id: 'remediation', name: 'Remediation', daysOut: 'T-45', icon: '🔧' },
  { id: 'mock-audit', name: 'Mock Audit', daysOut: 'T-14', icon: '🎭' },
  { id: 'final-prep', name: 'Final Prep', daysOut: 'T-7', icon: '✅' },
  { id: 'execution', name: 'Audit Week', daysOut: 'T-0', icon: '📊' },
  { id: 'closeout', name: 'Closeout', daysOut: 'Post', icon: '🏁' },
];

const mockAudit: Audit = {
  id: 'AUD-2026-001',
  name: 'SOC 2 Type II Annual Audit',
  type: 'SOC2',
  auditor: 'Deloitte',
  startDate: new Date('2026-01-15'),
  targetDate: new Date('2026-04-15'),
  currentPhase: 'remediation',
  progress: 42,
  team: [
    { name: 'Sarah Chen', role: 'Audit Lead' },
    { name: 'Mike Torres', role: 'Security' },
    { name: 'Lisa Park', role: 'Compliance' },
    { name: 'James Wilson', role: 'Engineering' },
  ],
  tasks: [
    // Planning Phase
    {
      id: 'T001',
      title: 'Confirm audit scope with Deloitte',
      description: 'Review and finalize scope document',
      phase: 'planning',
      status: 'complete',
      assignee: 'Sarah Chen',
      dueDate: new Date('2026-01-20'),
      completedDate: new Date('2026-01-18'),
    },
    {
      id: 'T002',
      title: 'Assign audit team members',
      description: 'Identify and assign roles',
      phase: 'planning',
      status: 'complete',
      assignee: 'Sarah Chen',
      dueDate: new Date('2026-01-22'),
      completedDate: new Date('2026-01-21'),
    },
    {
      id: 'T003',
      title: 'Create master timeline',
      description: 'Build project plan with milestones',
      phase: 'planning',
      status: 'complete',
      assignee: 'Lisa Park',
      dueDate: new Date('2026-01-25'),
      completedDate: new Date('2026-01-24'),
    },

    // Readiness Phase
    {
      id: 'T004',
      title: 'Council Deliberation: Risk Assessment',
      description: 'AI-assisted gap analysis across all controls',
      phase: 'readiness',
      status: 'complete',
      assignee: 'Mike Torres',
      dueDate: new Date('2026-02-01'),
      completedDate: new Date('2026-01-30'),
    },
    {
      id: 'T005',
      title: 'Gap analysis by control domain',
      description: 'Document gaps per TSC category',
      phase: 'readiness',
      status: 'complete',
      assignee: 'Lisa Park',
      dueDate: new Date('2026-02-05'),
      completedDate: new Date('2026-02-04'),
    },
    {
      id: 'T006',
      title: 'Create risk-ranked remediation list',
      description: 'Prioritize findings by risk score',
      phase: 'readiness',
      status: 'complete',
      assignee: 'Mike Torres',
      dueDate: new Date('2026-02-08'),
      completedDate: new Date('2026-02-07'),
    },

    // Remediation Phase
    {
      id: 'T007',
      title: 'Address CC6.1 - Access Control gaps',
      description: 'Implement MFA for all admin accounts',
      phase: 'remediation',
      status: 'complete',
      assignee: 'James Wilson',
      dueDate: new Date('2026-02-20'),
      completedDate: new Date('2026-02-18'),
    },
    {
      id: 'T008',
      title: 'Address CC7.2 - Monitoring gaps',
      description: 'Deploy enhanced logging',
      phase: 'remediation',
      status: 'in-progress',
      assignee: 'James Wilson',
      dueDate: new Date('2026-02-25'),
    },
    {
      id: 'T009',
      title: 'Update security policies',
      description: 'Revise and publish updated policies',
      phase: 'remediation',
      status: 'in-progress',
      assignee: 'Lisa Park',
      dueDate: new Date('2026-02-28'),
    },
    {
      id: 'T010',
      title: 'Begin evidence gathering',
      description: 'Collect screenshots, logs, configs',
      phase: 'remediation',
      status: 'pending',
      assignee: 'Lisa Park',
      dueDate: new Date('2026-03-01'),
    },

    // Mock Audit
    {
      id: 'T011',
      title: 'Internal walkthrough - Security',
      description: 'Security control testing',
      phase: 'mock-audit',
      status: 'pending',
      assignee: 'Mike Torres',
      dueDate: new Date('2026-03-20'),
    },
    {
      id: 'T012',
      title: 'Internal walkthrough - Operations',
      description: 'Ops control testing',
      phase: 'mock-audit',
      status: 'pending',
      assignee: 'James Wilson',
      dueDate: new Date('2026-03-22'),
    },
    {
      id: 'T013',
      title: 'Finding simulation',
      description: 'Document potential findings',
      phase: 'mock-audit',
      status: 'pending',
      assignee: 'Lisa Park',
      dueDate: new Date('2026-03-25'),
    },

    // Final Prep
    {
      id: 'T014',
      title: 'Evidence package complete',
      description: 'All evidence organized and verified',
      phase: 'final-prep',
      status: 'pending',
      assignee: 'Lisa Park',
      dueDate: new Date('2026-04-01'),
    },
    {
      id: 'T015',
      title: 'Team briefing',
      description: 'Final prep meeting with all stakeholders',
      phase: 'final-prep',
      status: 'pending',
      assignee: 'Sarah Chen',
      dueDate: new Date('2026-04-05'),
    },
    {
      id: 'T016',
      title: 'Logistics confirmed',
      description: 'Meeting rooms, access, schedules',
      phase: 'final-prep',
      status: 'pending',
      assignee: 'Sarah Chen',
      dueDate: new Date('2026-04-08'),
    },

    // Execution
    {
      id: 'T017',
      title: 'Daily standup - Day 1',
      description: 'Morning sync with audit team',
      phase: 'execution',
      status: 'pending',
      assignee: 'Sarah Chen',
      dueDate: new Date('2026-04-15'),
    },
    {
      id: 'T018',
      title: 'Evidence request responses',
      description: 'Respond to auditor requests within SLA',
      phase: 'execution',
      status: 'pending',
      assignee: 'Lisa Park',
      dueDate: new Date('2026-04-18'),
    },

    // Closeout
    {
      id: 'T019',
      title: 'Exit meeting',
      description: 'Review preliminary findings',
      phase: 'closeout',
      status: 'pending',
      assignee: 'Sarah Chen',
      dueDate: new Date('2026-04-22'),
    },
    {
      id: 'T020',
      title: 'Management response',
      description: 'Draft responses to findings',
      phase: 'closeout',
      status: 'pending',
      assignee: 'Lisa Park',
      dueDate: new Date('2026-04-25'),
    },
    {
      id: 'T021',
      title: 'Lessons learned',
      description: 'Document improvements for next audit',
      phase: 'closeout',
      status: 'pending',
      assignee: 'Sarah Chen',
      dueDate: new Date('2026-04-30'),
    },
  ],
  findings: [
    {
      id: 'F001',
      title: 'MFA not enforced for service accounts',
      description: 'Several service accounts lack MFA',
      severity: 'high',
      control: 'CC6.1',
      status: 'remediated',
      assignee: 'James Wilson',
      dueDate: new Date('2026-02-20'),
      remediation: 'Implemented MFA for all service accounts',
    },
    {
      id: 'F002',
      title: 'Log retention below 12 months',
      description: 'Current retention is 6 months',
      severity: 'medium',
      control: 'CC7.2',
      status: 'open',
      assignee: 'James Wilson',
      dueDate: new Date('2026-02-25'),
    },
    {
      id: 'F003',
      title: 'Incident response plan outdated',
      description: 'Last updated 18 months ago',
      severity: 'medium',
      control: 'CC7.4',
      status: 'open',
      assignee: 'Lisa Park',
      dueDate: new Date('2026-02-28'),
    },
  ],
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

const getStatusColor = (status: TaskStatus) => {
  switch (status) {
    case 'complete':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'in-progress':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'pending':
      return 'bg-neutral-500/20 text-neutral-400 border-neutral-500/30';
    case 'blocked':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'not-applicable':
      return 'bg-neutral-700/20 text-neutral-500 border-neutral-700/30';
  }
};

const getSeverityColor = (severity: FindingSeverity) => {
  switch (severity) {
    case 'critical':
      return 'bg-red-500/20 text-red-400';
    case 'high':
      return 'bg-orange-500/20 text-orange-400';
    case 'medium':
      return 'bg-yellow-500/20 text-yellow-400';
    case 'low':
      return 'bg-blue-500/20 text-blue-400';
    case 'informational':
      return 'bg-neutral-500/20 text-neutral-400';
  }
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const getDaysUntil = (date: Date) => {
  const days = Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (days < 0) {return `${Math.abs(days)}d overdue`;}
  if (days === 0) {return 'Today';}
  return `${days}d`;
};

// =============================================================================
// COMPONENT
// =============================================================================

export const AuditWorkflowPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    'timeline' | 'tasks' | 'findings' | 'evidence' | 'council'
  >('timeline');
  const [selectedPhase, setSelectedPhase] = useState<AuditPhase | 'all'>('all');
  const [selectedTask, setSelectedTask] = useState<AuditTask | null>(null);

  const audit = mockAudit;
  const currentPhaseIndex = phases.findIndex((p) => p.id === audit.currentPhase);

  const tasksByPhase = phases.map((phase) => ({
    ...phase,
    tasks: audit.tasks.filter((t) => t.phase === phase.id),
    complete: audit.tasks.filter((t) => t.phase === phase.id && t.status === 'complete').length,
    total: audit.tasks.filter((t) => t.phase === phase.id).length,
  }));

  const filteredTasks =
    selectedPhase === 'all' ? audit.tasks : audit.tasks.filter((t) => t.phase === selectedPhase);

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">📋</span>
          <h1 className="text-3xl font-bold">Audit Workflow</h1>
        </div>
        <p className="text-neutral-400">
          Compliance audit lifecycle management • Evidence tracking • Council integration
        </p>
      </div>

      {/* Current Audit Card */}
      <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-neutral-500">{audit.id}</span>
              <span className="px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-sm font-medium">
                {audit.type}
              </span>
            </div>
            <h2 className="text-2xl font-bold">{audit.name}</h2>
            <p className="text-neutral-400 mt-1">Auditor: {audit.auditor}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-neutral-400">Target Date</p>
            <p className="text-xl font-semibold">{formatDate(audit.targetDate)}</p>
            <p className="text-sm text-neutral-500">{getDaysUntil(audit.targetDate)}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-neutral-400">Overall Progress</span>
            <span className="font-medium">{audit.progress}%</span>
          </div>
          <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 rounded-full transition-all duration-500"
              style={{ width: `${audit.progress}%` }}
            />
          </div>
        </div>

        {/* Team */}
        <div className="mt-6 flex items-center gap-4">
          <span className="text-sm text-neutral-400">Team:</span>
          <div className="flex -space-x-2">
            {audit.team.map((member, idx) => (
              <div
                key={member.name}
                className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-xs font-medium border-2 border-neutral-800"
                title={`${member.name} - ${member.role}`}
              >
                {member.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>
            ))}
          </div>
          <button className="text-sm text-primary-400 hover:text-primary-300">+ Add</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-neutral-700 pb-2">
        {[
          { id: 'timeline', label: 'Timeline', icon: '📅' },
          { id: 'tasks', label: 'Tasks', icon: '✓' },
          { id: 'findings', label: 'Findings', icon: '🔍' },
          { id: 'evidence', label: 'Evidence', icon: '📁' },
          { id: 'council', label: 'Council Queries', icon: '🧠' },
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

      {/* Timeline Tab */}
      {activeTab === 'timeline' && (
        <div className="space-y-6">
          {/* Phase Progress */}
          <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
            <h3 className="text-lg font-semibold mb-6">Audit Phases</h3>
            <div className="flex items-start justify-between">
              {tasksByPhase.map((phase, idx) => (
                <React.Fragment key={phase.id}>
                  <div
                    className={`flex flex-col items-center cursor-pointer group ${
                      idx <= currentPhaseIndex ? 'opacity-100' : 'opacity-50'
                    }`}
                    onClick={() => setSelectedPhase(phase.id)}
                  >
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl border-2 transition-all ${
                        idx < currentPhaseIndex
                          ? 'bg-green-500/20 border-green-500'
                          : idx === currentPhaseIndex
                            ? 'bg-primary-500/20 border-primary-500 animate-pulse'
                            : 'bg-neutral-700 border-neutral-600'
                      } group-hover:scale-110`}
                    >
                      {phase.icon}
                    </div>
                    <span className="text-xs text-neutral-400 mt-2">{phase.daysOut}</span>
                    <span className="text-sm font-medium mt-1 text-center">{phase.name}</span>
                    <span className="text-xs text-neutral-500 mt-1">
                      {phase.complete}/{phase.total} tasks
                    </span>
                  </div>
                  {idx < tasksByPhase.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mt-8 mx-2 ${
                        idx < currentPhaseIndex ? 'bg-green-500' : 'bg-neutral-700'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Current Phase Details */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
              <h3 className="text-lg font-semibold mb-4">
                Current Phase: {phases.find((p) => p.id === audit.currentPhase)?.name}
              </h3>
              <div className="space-y-3">
                {audit.tasks
                  .filter((t) => t.phase === audit.currentPhase)
                  .map((task) => (
                    <div
                      key={task.id}
                      onClick={() => setSelectedTask(task)}
                      className="p-3 bg-neutral-900 rounded-lg border border-neutral-700 hover:border-primary-500 cursor-pointer transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {task.status === 'complete' && <span className="text-green-500">✓</span>}
                          {task.status === 'in-progress' && (
                            <span className="text-blue-500">◐</span>
                          )}
                          {task.status === 'pending' && <span className="text-neutral-500">○</span>}
                          <span
                            className={
                              task.status === 'complete' ? 'line-through text-neutral-500' : ''
                            }
                          >
                            {task.title}
                          </span>
                        </div>
                        <span className="text-sm text-neutral-500">{formatDate(task.dueDate)}</span>
                      </div>
                      <p className="text-sm text-neutral-400 mt-1 ml-6">{task.assignee}</p>
                    </div>
                  ))}
              </div>
            </div>

            <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
              <h3 className="text-lg font-semibold mb-4">Open Findings</h3>
              {audit.findings.filter((f) => f.status === 'open').length === 0 ? (
                <div className="text-center py-8 text-neutral-500">
                  <span className="text-4xl">✅</span>
                  <p className="mt-2">No open findings</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {audit.findings
                    .filter((f) => f.status === 'open')
                    .map((finding) => (
                      <div
                        key={finding.id}
                        className="p-3 bg-neutral-900 rounded-lg border border-neutral-700"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-medium ${getSeverityColor(finding.severity)}`}
                          >
                            {finding.severity}
                          </span>
                          <span className="text-xs text-neutral-500">{finding.control}</span>
                        </div>
                        <p className="font-medium">{finding.title}</p>
                        <p className="text-sm text-neutral-400 mt-1">
                          Due: {formatDate(finding.dueDate)}
                        </p>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tasks Tab */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <select
              value={selectedPhase}
              onChange={(e) => setSelectedPhase(e.target.value as AuditPhase | 'all')}
              className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">All Phases</option>
              {phases.map((phase) => (
                <option key={phase.id} value={phase.id}>
                  {phase.name}
                </option>
              ))}
            </select>
            <button className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
              + Add Task
            </button>
          </div>

          <div className="bg-neutral-800 rounded-xl border border-neutral-700 overflow-hidden">
            <table className="w-full">
              <thead className="bg-neutral-900">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Task</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Phase</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Assignee</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Due</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Completed</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task) => (
                  <tr
                    key={task.id}
                    onClick={() => setSelectedTask(task)}
                    className="border-t border-neutral-700 hover:bg-neutral-700/50 cursor-pointer transition-colors"
                  >
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(task.status)}`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-neutral-500">{task.description}</p>
                    </td>
                    <td className="p-4 text-neutral-400 capitalize">
                      {task.phase.replace('-', ' ')}
                    </td>
                    <td className="p-4 text-neutral-300">{task.assignee}</td>
                    <td className="p-4 text-neutral-400">{formatDate(task.dueDate)}</td>
                    <td className="p-4 text-neutral-400">
                      {task.completedDate ? formatDate(task.completedDate) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Findings Tab */}
      {activeTab === 'findings' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-4">
              {['critical', 'high', 'medium', 'low'].map((severity) => {
                const count = audit.findings.filter((f) => f.severity === severity).length;
                return (
                  <div
                    key={severity}
                    className={`px-4 py-2 rounded-lg ${getSeverityColor(severity as FindingSeverity)}`}
                  >
                    <span className="capitalize">{severity}</span>
                    <span className="ml-2 font-bold">{count}</span>
                  </div>
                );
              })}
            </div>
            <button className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
              + Log Finding
            </button>
          </div>

          <div className="bg-neutral-800 rounded-xl border border-neutral-700 overflow-hidden">
            <table className="w-full">
              <thead className="bg-neutral-900">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">ID</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Severity</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Finding</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Control</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Due</th>
                </tr>
              </thead>
              <tbody>
                {audit.findings.map((finding) => (
                  <tr
                    key={finding.id}
                    className="border-t border-neutral-700 hover:bg-neutral-700/50 cursor-pointer transition-colors"
                  >
                    <td className="p-4 font-mono text-sm">{finding.id}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(finding.severity)}`}
                      >
                        {finding.severity}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="font-medium">{finding.title}</p>
                      <p className="text-sm text-neutral-500">{finding.description}</p>
                    </td>
                    <td className="p-4 font-mono text-sm">{finding.control}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          finding.status === 'remediated'
                            ? 'bg-green-500/20 text-green-400'
                            : finding.status === 'open'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-neutral-500/20 text-neutral-400'
                        }`}
                      >
                        {finding.status}
                      </span>
                    </td>
                    <td className="p-4 text-neutral-400">{formatDate(finding.dueDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Evidence Tab */}
      {activeTab === 'evidence' && (
        <div className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Total Evidence Items', value: '127', icon: '📄' },
              { label: 'Pending Review', value: '12', icon: '👀' },
              { label: 'Approved', value: '108', icon: '✅' },
              { label: 'Needs Update', value: '7', icon: '⚠️' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-neutral-800 rounded-xl border border-neutral-700 p-6"
              >
                <span className="text-2xl">{stat.icon}</span>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
                <p className="text-sm text-neutral-400">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Evidence by Control Category</h3>
              <button className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
                + Upload Evidence
              </button>
            </div>
            <div className="space-y-3">
              {[
                { control: 'CC6 - Logical and Physical Access', items: 28, complete: 25 },
                { control: 'CC7 - System Operations', items: 22, complete: 18 },
                { control: 'CC8 - Change Management', items: 15, complete: 15 },
                { control: 'CC9 - Risk Mitigation', items: 12, complete: 10 },
                { control: 'A1 - Availability', items: 18, complete: 16 },
                { control: 'C1 - Confidentiality', items: 20, complete: 14 },
                { control: 'PI1 - Processing Integrity', items: 12, complete: 10 },
              ].map((cat) => (
                <div key={cat.control} className="p-4 bg-neutral-900 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{cat.control}</span>
                    <span className="text-sm text-neutral-400">
                      {cat.complete}/{cat.items}
                    </span>
                  </div>
                  <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-500 rounded-full"
                      style={{ width: `${(cat.complete / cat.items) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Council Tab */}
      {activeTab === 'council' && (
        <div className="space-y-6">
          <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
            <h3 className="text-lg font-semibold mb-4">Ask the Council</h3>
            <p className="text-neutral-400 mb-4">
              Use AI-powered deliberation to analyze audit risks and get recommendations.
            </p>
            <div className="space-y-3">
              {[
                'What are our highest risk areas for this audit?',
                'How should we prioritize our remediation efforts?',
                'What evidence gaps might auditors identify?',
                "Compare our readiness to last year's audit",
              ].map((query) => (
                <button
                  key={query}
                  onClick={() => navigate('/cortex/council')}
                  className="w-full p-4 bg-neutral-900 rounded-lg border border-neutral-700 text-left hover:border-primary-500 transition-all"
                >
                  <span className="text-primary-400 mr-2">🧠</span>
                  {query}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Council Deliberations</h3>
            <div className="space-y-3">
              {[
                {
                  query: 'Risk assessment for CC7.2 monitoring gaps',
                  date: '2 days ago',
                  confidence: 87,
                },
                {
                  query: 'Evidence requirements for access control',
                  date: '5 days ago',
                  confidence: 92,
                },
                { query: 'Remediation timeline feasibility', date: '1 week ago', confidence: 78 },
              ].map((delib, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-neutral-900 rounded-lg flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">{delib.query}</p>
                    <p className="text-sm text-neutral-500">{delib.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-neutral-400">Confidence</p>
                    <p className="font-semibold text-primary-400">{delib.confidence}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-8">
          <div className="bg-neutral-800 rounded-2xl border border-neutral-700 max-w-2xl w-full">
            <div className="p-6 border-b border-neutral-700">
              <div className="flex items-start justify-between">
                <div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(selectedTask.status)}`}
                  >
                    {selectedTask.status}
                  </span>
                  <h2 className="text-xl font-bold mt-2">{selectedTask.title}</h2>
                </div>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="p-2 hover:bg-neutral-700 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-neutral-400 mb-1">Description</h3>
                <p>{selectedTask.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-neutral-400 mb-1">Assignee</h3>
                  <p>{selectedTask.assignee}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-neutral-400 mb-1">Due Date</h3>
                  <p>{formatDate(selectedTask.dueDate)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-neutral-400 mb-1">Phase</h3>
                  <p className="capitalize">{selectedTask.phase.replace('-', ' ')}</p>
                </div>
                {selectedTask.completedDate && (
                  <div>
                    <h3 className="text-sm font-medium text-neutral-400 mb-1">Completed</h3>
                    <p>{formatDate(selectedTask.completedDate)}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="p-6 border-t border-neutral-700 flex justify-end gap-3">
              {selectedTask.status !== 'complete' && (
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
                  Mark Complete
                </button>
              )}
              <button className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
                Edit Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditWorkflowPage;
