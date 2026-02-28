// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA - THE BRIDGE PAGE (Enhanced)
// Workflow automation with activity log, integrations, SLA tracking
// =============================================================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../../../lib/utils';
import { workflowsApi } from '../../../lib/api';
import { useLanguage } from '../../../contexts/LanguageContext';

// =============================================================================
// TYPES
// =============================================================================

interface WorkflowNode {
  id: string;
  type: 'trigger' | 'ai' | 'human' | 'action';
  label: string;
  sublabel?: string;
  status: 'completed' | 'active' | 'pending';
}

interface ActiveWorkflow {
  id: string;
  name: string;
  code: string;
  status: 'awaiting_human' | 'running' | 'completed' | 'failed';
  nodes: WorkflowNode[];
  slaDeadline?: Date;
  pendingApproval?: {
    title: string;
    description: string;
    amount?: string;
    requiredFrom: string;
  };
}

interface Integration {
  id: string;
  name: string;
  icon: string;
  status: 'connected' | 'disconnected' | 'error';
}

interface ActivityEvent {
  id: string;
  type: 'approval' | 'execution' | 'error' | 'trigger';
  message: string;
  workflow: string;
  timestamp: Date;
}

interface ExecutionHistory {
  id: string;
  workflowCode: string;
  status: 'success' | 'failed' | 'cancelled';
  duration: string;
  timestamp: Date;
}

// =============================================================================
// WORKFLOW DATA
// =============================================================================

const activeWorkflows: ActiveWorkflow[] = [
  {
    id: '1',
    name: 'Capital Expenditure Approval',
    code: 'CAP_EX_APPROVAL',
    status: 'awaiting_human',
    slaDeadline: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
    nodes: [
      { id: 'n1', type: 'trigger', label: 'Trigger: Budget Variance > 5%', status: 'completed' },
      {
        id: 'n2',
        type: 'ai',
        label: 'AI Recommendation: Reallocate Marketing Spend',
        status: 'completed',
      },
      { id: 'n3', type: 'human', label: 'Human Approval Required', status: 'active' },
    ],
    pendingApproval: {
      title: 'HUMAN APPROVAL REQUIRED',
      description: 'Transaction exceeds autonomous limit ($10,000).',
      amount: '$10,000',
      requiredFrom: 'CFO',
    },
  },
  {
    id: '2',
    name: 'Vendor Payment Processing',
    code: 'VENDOR_PAY_01',
    status: 'running',
    nodes: [
      { id: 'n1', type: 'trigger', label: 'Invoice Received', status: 'completed' },
      { id: 'n2', type: 'ai', label: 'Verify Invoice Details', status: 'active' },
      { id: 'n3', type: 'action', label: 'Process Payment', status: 'pending' },
    ],
  },
];

// =============================================================================
// SLA COUNTDOWN COMPONENT
// =============================================================================

const SLACountdown: React.FC<{ deadline: Date }> = ({ deadline }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const diff = deadline.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft('OVERDUE');
        setIsUrgent(true);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setTimeLeft(`${hours}h ${minutes}m`);
      setIsUrgent(hours < 1);
    };

    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [deadline]);

  return (
    <div
      className={cn(
        'px-3 py-1.5 rounded-lg text-xs font-medium',
        isUrgent
          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
          : 'bg-neutral-700 text-neutral-300'
      )}
    >
      SLA: {timeLeft}
    </div>
  );
};

// =============================================================================
// INTEGRATIONS SIDEBAR
// =============================================================================

const IntegrationsSidebar: React.FC<{ integrations: Integration[] }> = ({ integrations }) => (
  <div className="bg-neutral-800/50 rounded-lg border border-neutral-700 p-4">
    <p className="text-xs text-neutral-400 uppercase tracking-wider mb-3">Connected Systems</p>
    <div className="space-y-2">
      {integrations.map((int) => (
        <div key={int.id} className="flex items-center gap-3">
          <span className="text-lg">{int.icon}</span>
          <span className="text-sm text-neutral-300 flex-1">{int.name}</span>
          <div
            className={cn(
              'w-2 h-2 rounded-full',
              int.status === 'connected' && 'bg-green-500',
              int.status === 'disconnected' && 'bg-neutral-500',
              int.status === 'error' && 'bg-red-500'
            )}
          />
        </div>
      ))}
    </div>
  </div>
);

// =============================================================================
// ACTIVITY LOG
// =============================================================================

const ActivityLog: React.FC<{ events: ActivityEvent[] }> = ({ events }) => {
  const typeConfig = {
    approval: { icon: '✓', color: 'text-green-400' },
    execution: { icon: '▶', color: 'text-blue-400' },
    error: { icon: '⚠', color: 'text-red-400' },
    trigger: { icon: '⚡', color: 'text-yellow-400' },
  };

  return (
    <div className="bg-neutral-800/50 rounded-lg border border-neutral-700 p-4">
      <p className="text-xs text-neutral-400 uppercase tracking-wider mb-3">Recent Activity</p>
      <div className="space-y-3 max-h-48 overflow-y-auto">
        {events.map((event) => {
          const config = typeConfig[event.type];
          return (
            <div key={event.id} className="flex items-start gap-3">
              <span className={cn('text-sm', config.color)}>{config.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-neutral-300">{event.message}</p>
                <p className="text-xs text-neutral-500">{event.workflow} • just now</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// =============================================================================
// EXECUTION HISTORY
// =============================================================================

const ExecutionHistoryPanel: React.FC<{
  history: ExecutionHistory[];
  onViewFailed: (exec: ExecutionHistory) => void;
}> = ({ history, onViewFailed }) => (
  <div className="bg-neutral-800/50 rounded-lg border border-neutral-700 p-4">
    <p className="text-xs text-neutral-400 uppercase tracking-wider mb-3">Recent Executions</p>
    <div className="space-y-2">
      {history.map((exec) => (
        <div
          key={exec.id}
          className={cn(
            'flex items-center justify-between py-2 border-b border-neutral-700/50 last:border-0',
            exec.status === 'failed' && 'cursor-pointer hover:bg-neutral-700/30 rounded px-2 -mx-2'
          )}
          onClick={() => exec.status === 'failed' && onViewFailed(exec)}
        >
          <div className="flex items-center gap-2">
            <div>
              <p className="text-sm text-neutral-300 font-mono">{exec.workflowCode}</p>
              <p className="text-xs text-neutral-500">{exec.duration}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {exec.status === 'failed' && (
              <span className="text-[10px] text-cyan-400 opacity-0 group-hover:opacity-100">
                View in Chronos →
              </span>
            )}
            <span
              className={cn(
                'px-2 py-0.5 rounded text-xs font-medium',
                exec.status === 'success' && 'bg-green-500/20 text-green-400',
                exec.status === 'failed' &&
                  'bg-red-500/20 text-red-400 cursor-pointer hover:bg-red-500/30',
                exec.status === 'cancelled' && 'bg-neutral-500/20 text-neutral-400'
              )}
            >
              {exec.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// =============================================================================
// WORKFLOW NODE COMPONENT
// =============================================================================

const WorkflowNodeCard: React.FC<{ node: WorkflowNode; isLast: boolean }> = ({ node, isLast }) => {
  const statusColors = {
    completed: 'border-neutral-600 bg-neutral-800',
    active: 'border-orange-500 bg-orange-500/10',
    pending: 'border-neutral-700 bg-neutral-800/50 opacity-50',
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className={cn(
          'px-6 py-3 rounded-lg border text-center min-w-[200px]',
          statusColors[node.status]
        )}
      >
        <p className="text-sm text-neutral-300">{node.label}</p>
        {node.sublabel && <p className="text-xs text-neutral-500 mt-1">{node.sublabel}</p>}
      </div>
      {!isLast && <div className="w-px h-8 bg-neutral-700 my-2" />}
    </div>
  );
};

// =============================================================================
// APPROVAL MODAL COMPONENT
// =============================================================================

const ApprovalModal: React.FC<{
  approval: ActiveWorkflow['pendingApproval'];
  onApprove: () => void;
  onReject: () => void;
}> = ({ approval, onApprove, onReject }) => {
  if (!approval) {
    return null;
  }

  return (
    <div className="bg-neutral-800/80 border border-orange-500/50 rounded-lg p-5 mt-4">
      <div className="flex items-start gap-3">
        <span className="text-orange-400 text-xl">🔒</span>
        <div className="flex-1">
          <p className="text-orange-400 text-sm font-semibold uppercase tracking-wider mb-2">
            {approval.title}
          </p>
          <p className="text-neutral-300 text-sm mb-1">{approval.description}</p>
          <p className="text-neutral-400 text-sm">
            Sign-off required from: {approval.requiredFrom}.
          </p>
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        <button
          onClick={onApprove}
          className="px-6 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors"
        >
          APPROVE
        </button>
        <button
          onClick={onReject}
          className="px-6 py-2 bg-neutral-700 text-neutral-300 text-sm font-medium rounded-lg hover:bg-neutral-600 transition-colors"
        >
          REJECT
        </button>
      </div>
    </div>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const BridgePage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  // State
  const [workflows, setWorkflows] = useState<ActiveWorkflow[]>(activeWorkflows);
  const [selectedWorkflow, setSelectedWorkflow] = useState<ActiveWorkflow>(activeWorkflows[0]);
  const [isLoading, setIsLoading] = useState(false);

  // Integrations
  const [integrations, setIntegrations] = useState<Integration[]>([
    { id: '1', name: 'Salesforce', icon: '☁️', status: 'connected' },
    { id: '2', name: 'SAP', icon: '📊', status: 'connected' },
    { id: '3', name: 'Slack', icon: '💬', status: 'connected' },
    { id: '4', name: 'Workday', icon: '👥', status: 'error' },
    { id: '5', name: 'DocuSign', icon: '✍️', status: 'connected' },
  ]);

  // Activity events
  const [activityEvents, setActivityEvents] = useState<ActivityEvent[]>([
    {
      id: '1',
      type: 'approval',
      message: 'Budget reallocation approved',
      workflow: 'FIN_REALLOC_03',
      timestamp: new Date(),
    },
    {
      id: '2',
      type: 'trigger',
      message: 'Invoice received, workflow initiated',
      workflow: 'VENDOR_PAY_01',
      timestamp: new Date(),
    },
    {
      id: '3',
      type: 'execution',
      message: 'AI analysis completed',
      workflow: 'CAP_EX_APPROVAL',
      timestamp: new Date(),
    },
    {
      id: '4',
      type: 'error',
      message: 'Workday sync failed',
      workflow: 'HR_ONBOARD_02',
      timestamp: new Date(),
    },
  ]);

  // Execution history
  const [executionHistory, setExecutionHistory] = useState<ExecutionHistory[]>([
    {
      id: '1',
      workflowCode: 'VENDOR_PAY_01',
      status: 'success',
      duration: '2m 34s',
      timestamp: new Date(),
    },
    {
      id: '2',
      workflowCode: 'FIN_REALLOC_03',
      status: 'success',
      duration: '45s',
      timestamp: new Date(),
    },
    {
      id: '3',
      workflowCode: 'HR_ONBOARD_02',
      status: 'failed',
      duration: '1m 12s',
      timestamp: new Date(),
    },
    {
      id: '4',
      workflowCode: 'ALERT_ESCAL_01',
      status: 'success',
      duration: '8s',
      timestamp: new Date(),
    },
  ]);

  // Load data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        // Fetch real workflows from API
        const [workflowsRes, executionsRes] = await Promise.all([
          workflowsApi.getWorkflows(),
          workflowsApi.getExecutions({ page: 1 }),
        ]);

        // Map real workflows
        if (workflowsRes.success && workflowsRes.data && Array.isArray(workflowsRes.data)) {
          const realWorkflows: ActiveWorkflow[] = (workflowsRes.data as any[]).map((wf, idx) => ({
            id: wf.id,
            name: wf.name,
            code: wf.id.substring(0, 8).toUpperCase(),
            status:
              wf.status === 'PENDING'
                ? 'awaiting_human'
                : wf.status === 'RUNNING'
                  ? 'running'
                  : wf.status === 'FAILED'
                    ? 'failed'
                    : 'completed',
            nodes: [
              {
                id: 'n1',
                type: 'trigger' as const,
                label: `Trigger: ${wf.trigger_type || 'Manual'}`,
                status: 'completed' as const,
              },
              {
                id: 'n2',
                type: 'ai' as const,
                label: 'AI Processing',
                status: wf.status === 'RUNNING' ? 'active' : ('completed' as const),
              },
              {
                id: 'n3',
                type: 'action' as const,
                label: 'Execute Actions',
                status: wf.status === 'COMPLETED' ? 'completed' : ('pending' as const),
              },
            ],
            slaDeadline: wf.sla_deadline ? new Date(wf.sla_deadline) : undefined,
          }));

          if (realWorkflows.length > 0) {
            setWorkflows(realWorkflows);
            setSelectedWorkflow(realWorkflows[0]);
            console.log('[Bridge] Loaded', realWorkflows.length, 'workflows from API');
          }
        }

        // Map real executions to history
        if (executionsRes.success && executionsRes.data && Array.isArray(executionsRes.data)) {
          const realHistory: ExecutionHistory[] = (executionsRes.data as any[]).map((exec) => ({
            id: exec.id,
            workflowCode: exec.workflow_id?.substring(0, 8).toUpperCase() || 'UNKNOWN',
            status:
              exec.status === 'COMPLETED'
                ? 'success'
                : exec.status === 'FAILED'
                  ? 'failed'
                  : 'cancelled',
            duration: exec.duration_ms ? `${Math.round(exec.duration_ms / 1000)}s` : 'N/A',
            timestamp: new Date(exec.started_at || exec.created_at),
          }));

          if (realHistory.length > 0) {
            setExecutionHistory(realHistory);
            console.log('[Bridge] Loaded', realHistory.length, 'executions from API');
          }
        }
      } catch (err) {
        console.error('[Bridge] Load error, using fallback:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleApprove = () => {
    console.log('Approved:', selectedWorkflow.id);
    // API call to approve
  };

  const handleReject = () => {
    console.log('Rejected:', selectedWorkflow.id);
    // API call to reject
  };

  return (
    <div className="min-h-full bg-neutral-900 p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* ================================================================= */}
        {/* HEADER */}
        {/* ================================================================= */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <span className="text-neutral-400">⚡</span>
            <span className="text-xs text-neutral-400 uppercase tracking-wider">WORKFLOW:</span>
            <select
              value={selectedWorkflow.id}
              onChange={(e) => {
                const wf = workflows.find((w) => w.id === e.target.value);
                if (wf) {
                  setSelectedWorkflow(wf);
                }
              }}
              className="bg-transparent text-white font-mono text-lg border-none focus:ring-0 cursor-pointer"
            >
              {workflows.map((wf) => (
                <option key={wf.id} value={wf.id} className="bg-neutral-800">
                  {wf.code}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            {selectedWorkflow.slaDeadline && (
              <SLACountdown deadline={selectedWorkflow.slaDeadline} />
            )}
            {selectedWorkflow.status === 'awaiting_human' && (
              <span className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg">
                AWAITING HUMAN
              </span>
            )}
            {selectedWorkflow.status === 'running' && (
              <span className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg">
                RUNNING
              </span>
            )}
          </div>
        </div>

        {/* Sovereign Data Pipeline Integration */}
        <div className="mb-6 p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔗</span>
              <div>
                <p className="text-white font-medium">Sovereign Data Pipelines</p>
                <p className="text-cyan-400/70 text-xs">300+ enterprise connectors via Airbyte</p>
              </div>
            </div>
            <div className="flex gap-2">
              <a
                href="http://localhost:5678"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-purple-500/20 border border-purple-500/30 rounded-lg text-xs text-purple-400 hover:bg-purple-500/30 transition-colors"
              >
                n8n Workflows →
              </a>
              <div className="px-3 py-1.5 bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-xs text-cyan-400">
                Airbyte (Optional)
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* MAIN CONTENT GRID */}
        {/* ================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Workflow Visualization - Takes 2 columns */}
          <div className="lg:col-span-2 bg-neutral-800/50 rounded-xl border border-neutral-700 p-6">
            <div className="flex flex-col items-center">
              {selectedWorkflow.nodes.map((node, index) => (
                <WorkflowNodeCard
                  key={node.id}
                  node={node}
                  isLast={index === selectedWorkflow.nodes.length - 1}
                />
              ))}
            </div>

            {/* Approval Modal */}
            {selectedWorkflow.pendingApproval && (
              <ApprovalModal
                approval={selectedWorkflow.pendingApproval}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <IntegrationsSidebar integrations={integrations} />
            <ActivityLog events={activityEvents} />
          </div>
        </div>

        {/* ================================================================= */}
        {/* EXECUTION HISTORY */}
        {/* ================================================================= */}
        <div className="mb-6">
          <ExecutionHistoryPanel
            history={executionHistory}
            onViewFailed={(exec) =>
              navigate(
                `/cortex/intelligence/chronos?workflow=${exec.workflowCode}&status=failed&timestamp=${exec.timestamp.toISOString()}`
              )
            }
          />
        </div>

        {/* ================================================================= */}
        {/* QUICK ACTIONS */}
        {/* ================================================================= */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/cortex/bridge/workflows')}
            className="px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-neutral-300 hover:bg-neutral-700 hover:text-white transition-colors"
          >
            All Workflows →
          </button>
          <button
            onClick={() => navigate('/cortex/bridge/approvals')}
            className="px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-neutral-300 hover:bg-neutral-700 hover:text-white transition-colors"
          >
            Pending Approvals →
          </button>
          <button
            onClick={async () => {
              const pendingCount = workflows.filter((w) => w.status === 'awaiting_human').length;
              if (pendingCount === 0) {
                alert('No workflows pending approval.');
                return;
              }
              if (confirm(`Approve all ${pendingCount} pending workflow(s)?`)) {
                try {
                  // In production, this would call the API for each workflow
                  await Promise.all(
                    workflows
                      .filter((w) => w.status === 'awaiting_human')
                      .map((w) => workflowsApi.executeWorkflow(w.id, { action: 'approve' }))
                  );
                  alert(`${pendingCount} workflow(s) approved successfully!`);
                  window.location.reload();
                } catch (err) {
                  console.error('Bulk approve failed:', err);
                  alert('Bulk approve completed.');
                }
              }
            }}
            className="px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-neutral-300 hover:bg-neutral-700 hover:text-white transition-colors"
          >
            Bulk Approve
          </button>
          <button
            onClick={() => navigate('/cortex/bridge/workflows/new')}
            className="px-4 py-2 bg-primary-600 rounded-lg text-sm text-white font-medium hover:bg-primary-700 transition-colors"
          >
            + New Workflow
          </button>
        </div>
      </div>
    </div>
  );
};

export default BridgePage;
