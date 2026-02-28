// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA - BRIDGE SUB-PAGES
// =============================================================================

import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { cn, formatRelativeTime } from '../../../../lib/utils';
import { workflowsApi, dataSourcesApi } from '../../../lib/api';
import { PageGuide, GUIDES } from '../../../components/PageGuide';

// =============================================================================
// WORKFLOWS LIST PAGE
// =============================================================================

interface Workflow {
  id: string;
  name: string;
  status: string;
  trigger: string;
  schedule: string;
  steps: number;
  runs: { success: number; failed: number };
  lastRun: Date | null;
}

const FALLBACK_WORKFLOWS: Workflow[] = [
  {
    id: 'wf-1',
    name: 'Monthly Financial Close',
    status: 'active',
    trigger: 'schedule',
    schedule: '1st of month',
    steps: 12,
    runs: { success: 24, failed: 1 },
    lastRun: new Date(Date.now() - 86400000),
  },
  {
    id: 'wf-2',
    name: 'Alert Escalation',
    status: 'active',
    trigger: 'event',
    schedule: 'On critical alert',
    steps: 5,
    runs: { success: 156, failed: 3 },
    lastRun: new Date(Date.now() - 3600000),
  },
  {
    id: 'wf-3',
    name: 'Customer Onboarding',
    status: 'active',
    trigger: 'manual',
    schedule: 'Manual',
    steps: 8,
    runs: { success: 89, failed: 2 },
    lastRun: new Date(Date.now() - 7200000),
  },
  {
    id: 'wf-4',
    name: 'Vendor Onboarding',
    status: 'draft',
    trigger: 'manual',
    schedule: 'Manual',
    steps: 18,
    runs: { success: 0, failed: 0 },
    lastRun: null,
  },
  {
    id: 'wf-5',
    name: 'Employee Offboarding',
    status: 'paused',
    trigger: 'manual',
    schedule: 'Manual',
    steps: 22,
    runs: { success: 45, failed: 2 },
    lastRun: new Date(Date.now() - 604800000),
  },
];

export const WorkflowsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'active' | 'draft' | 'paused'>('all');
  const [workflows, setWorkflows] = useState<Workflow[]>(FALLBACK_WORKFLOWS);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const fetchWorkflows = async () => {
      try {
        const response = await workflowsApi.getWorkflows({});
        if (response.success && response.data && Array.isArray(response.data)) {
          const mapped: Workflow[] = response.data.map((w: any) => ({
            id: w.id,
            name: w.name,
            status: (w.status || 'draft').toLowerCase(),
            trigger: w.trigger?.type || 'manual',
            schedule: w.trigger?.cron || w.trigger?.event || 'Manual',
            steps: w.definition?.steps?.length || 0,
            runs: { success: w.successCount || 0, failed: w.failedCount || 0 },
            lastRun: w.lastExecutedAt ? new Date(w.lastExecutedAt) : null,
          }));
          if (mapped.length > 0) {setWorkflows(mapped);}
        }
      } catch (err) {
        console.log('Using fallback workflows');
      } finally {
        setIsLoading(false);
      }
    };
    fetchWorkflows();
  }, []);

  const filteredWorkflows =
    filter === 'all' ? workflows : workflows.filter((w) => w.status === filter);

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Workflows</h1>
          <p className="text-neutral-500">Automate your business processes</p>
        </div>
        <button
          onClick={() => navigate('/cortex/bridge/workflows/new')}
          className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
        >
          + Create Workflow
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6">
        {(['all', 'active', 'draft', 'paused'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize',
              filter === f
                ? 'bg-primary-100 text-primary-700'
                : 'text-neutral-600 hover:bg-neutral-100'
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Workflow List */}
      <div className="space-y-4">
        {filteredWorkflows.map((workflow) => (
          <div
            key={workflow.id}
            onClick={() => navigate(`/cortex/bridge/workflows/${workflow.id}`)}
            className="bg-white rounded-xl border border-neutral-200 p-5 hover:border-primary-300 hover:shadow-sm transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center',
                    workflow.status === 'active' && 'bg-success-light text-success-main',
                    workflow.status === 'draft' && 'bg-neutral-100 text-neutral-500',
                    workflow.status === 'paused' && 'bg-warning-light text-warning-main'
                  )}
                >
                  {workflow.trigger === 'schedule' && '⏰'}
                  {workflow.trigger === 'event' && '📨'}
                  {workflow.trigger === 'manual' && '👤'}
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">{workflow.name}</h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-neutral-500">
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded-full text-xs font-medium capitalize',
                        workflow.status === 'active' && 'bg-success-light text-success-dark',
                        workflow.status === 'draft' && 'bg-neutral-100 text-neutral-600',
                        workflow.status === 'paused' && 'bg-warning-light text-warning-dark'
                      )}
                    >
                      {workflow.status}
                    </span>
                    <span>{workflow.steps} steps</span>
                    <span>{workflow.schedule}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-success-main">{workflow.runs.success} success</span>
                  {workflow.runs.failed > 0 && (
                    <span className="text-error-main">{workflow.runs.failed} failed</span>
                  )}
                </div>
                <p className="text-xs text-neutral-400 mt-1">
                  {workflow.lastRun
                    ? `Last run ${formatRelativeTime(workflow.lastRun)}`
                    : 'Never run'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Page Guide */}
      <PageGuide {...GUIDES.workflows} />
    </div>
  );
};

// =============================================================================
// WORKFLOW BUILDER PAGE
// =============================================================================

export const WorkflowBuilderPage: React.FC = () => {
  const navigate = useNavigate();
  const { workflowId } = useParams();
  const isNew = workflowId === 'new';

  const [workflow, setWorkflow] = useState({
    name: isNew ? 'New Workflow' : 'Monthly Financial Close',
    trigger: 'schedule',
    schedule: '0 0 1 * *',
    steps: [
      { id: 1, type: 'query', name: 'Fetch Revenue Data', config: { dataset: 'revenue_metrics' } },
      { id: 2, type: 'transform', name: 'Calculate Totals', config: {} },
      { id: 3, type: 'agent', name: 'CendiaCFO Analysis', config: { agent: 'cfo' } },
      { id: 4, type: 'approval', name: 'CFO Approval', config: { approvers: ['cfo@acme.com'] } },
      { id: 5, type: 'action', name: 'Generate Report', config: { format: 'pdf' } },
      { id: 6, type: 'notify', name: 'Send to Stakeholders', config: { channel: 'slack' } },
    ],
  });

  const stepTypes = [
    { type: 'query', icon: '📊', label: 'Query Data' },
    { type: 'transform', icon: '🔄', label: 'Transform' },
    { type: 'agent', icon: '🤖', label: 'AI Agent' },
    { type: 'approval', icon: '✅', label: 'Approval' },
    { type: 'action', icon: '⚡', label: 'Action' },
    { type: 'notify', icon: '🔔', label: 'Notify' },
    { type: 'condition', icon: '🔀', label: 'Condition' },
    { type: 'wait', icon: '⏳', label: 'Wait' },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-200 bg-white">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/cortex/bridge/workflows')}
            className="text-neutral-500 hover:text-neutral-900"
          >
            ← Back
          </button>
          <input
            type="text"
            value={workflow.name}
            onChange={(e) => setWorkflow({ ...workflow, name: e.target.value })}
            className="text-xl font-bold text-neutral-900 border-0 focus:ring-0 p-0 bg-transparent"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50">
            Test Run
          </button>
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
            Save & Activate
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Steps Palette */}
        <div className="w-64 border-r border-neutral-200 bg-white p-4 overflow-y-auto">
          <h3 className="text-sm font-semibold text-neutral-500 uppercase mb-3">Add Steps</h3>
          <div className="grid grid-cols-2 gap-2">
            {stepTypes.map((step) => (
              <button
                key={step.type}
                className="p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 text-center transition-colors"
              >
                <div className="text-2xl mb-1">{step.icon}</div>
                <span className="text-xs text-neutral-600">{step.label}</span>
              </button>
            ))}
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-neutral-500 uppercase mb-3">Trigger</h3>
            <select
              value={workflow.trigger}
              onChange={(e) => setWorkflow({ ...workflow, trigger: e.target.value })}
              className="w-full h-10 px-3 border border-neutral-300 rounded-lg"
            >
              <option value="schedule">Schedule</option>
              <option value="event">Event</option>
              <option value="manual">Manual</option>
              <option value="webhook">Webhook</option>
            </select>
            {workflow.trigger === 'schedule' && (
              <input
                type="text"
                value={workflow.schedule}
                onChange={(e) => setWorkflow({ ...workflow, schedule: e.target.value })}
                placeholder="Cron expression"
                className="w-full h-10 px-3 border border-neutral-300 rounded-lg mt-2 font-mono text-sm"
              />
            )}
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 bg-neutral-100 p-8 overflow-auto">
          <div className="max-w-2xl mx-auto space-y-4">
            {/* Trigger */}
            <div className="bg-primary-100 border-2 border-primary-500 rounded-xl p-4 text-center">
              <span className="text-2xl">🎯</span>
              <p className="font-medium text-primary-700 mt-1">Trigger</p>
              <p className="text-sm text-primary-600">{workflow.trigger}</p>
            </div>

            <div className="flex justify-center">
              <div className="w-0.5 h-8 bg-neutral-300" />
            </div>

            {/* Steps */}
            {workflow.steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="bg-white rounded-xl border border-neutral-200 p-4 hover:border-primary-300 hover:shadow-sm transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center text-xl">
                      {stepTypes.find((s) => s.type === step.type)?.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-neutral-900">{step.name}</h4>
                      <p className="text-sm text-neutral-500 capitalize">{step.type}</p>
                    </div>
                    <button className="text-neutral-400 hover:text-neutral-600">•••</button>
                  </div>
                </div>

                {index < workflow.steps.length - 1 && (
                  <div className="flex justify-center">
                    <div className="w-0.5 h-8 bg-neutral-300" />
                  </div>
                )}
              </React.Fragment>
            ))}

            {/* Add Step */}
            <div className="flex justify-center">
              <div className="w-0.5 h-8 bg-neutral-300" />
            </div>
            <button className="w-full border-2 border-dashed border-neutral-300 rounded-xl p-4 text-neutral-500 hover:border-primary-300 hover:text-primary-600 transition-colors">
              + Add Step
            </button>
          </div>
        </div>

        {/* Properties Panel */}
        <div className="w-80 border-l border-neutral-200 bg-white p-4 overflow-y-auto">
          <h3 className="text-sm font-semibold text-neutral-500 uppercase mb-3">Properties</h3>
          <p className="text-sm text-neutral-400">Select a step to configure its properties</p>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// APPROVALS PAGE
// =============================================================================

export const ApprovalsPage: React.FC = () => {
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');

  const approvals = [
    {
      id: 1,
      type: 'workflow',
      title: 'Monthly Close - CFO Approval',
      requestor: 'System',
      workflow: 'Monthly Financial Close',
      priority: 'high',
      requestedAt: new Date(Date.now() - 3600000),
      status: 'pending',
    },
    {
      id: 2,
      type: 'access',
      title: 'Production Database Access',
      requestor: 'John Smith',
      details: 'Read access to production DB',
      priority: 'medium',
      requestedAt: new Date(Date.now() - 7200000),
      status: 'pending',
    },
    {
      id: 3,
      type: 'budget',
      title: 'Q2 Marketing Budget Increase',
      requestor: 'Sarah Chen',
      details: '+$50,000 for campaign',
      priority: 'medium',
      requestedAt: new Date(Date.now() - 14400000),
      status: 'pending',
    },
    {
      id: 4,
      type: 'vendor',
      title: 'New Vendor: CloudTech Inc',
      requestor: 'Mike Johnson',
      details: 'Data analytics vendor',
      priority: 'low',
      requestedAt: new Date(Date.now() - 86400000),
      status: 'approved',
    },
    {
      id: 5,
      type: 'access',
      title: 'Admin Console Access',
      requestor: 'Emily Davis',
      details: 'Full admin access',
      priority: 'high',
      requestedAt: new Date(Date.now() - 172800000),
      status: 'rejected',
    },
  ];

  const filteredApprovals =
    filter === 'all' ? approvals : approvals.filter((a) => a.status === filter);

  const typeIcons: Record<string, string> = {
    workflow: '🔄',
    access: '🔑',
    budget: '💰',
    vendor: '🏢',
  };

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Approvals</h1>
          <p className="text-neutral-500">Review and approve pending requests</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="px-3 py-1 bg-warning-light text-warning-dark text-sm font-medium rounded-full">
            {approvals.filter((a) => a.status === 'pending').length} pending
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6">
        {(['pending', 'approved', 'rejected', 'all'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize',
              filter === f
                ? 'bg-primary-100 text-primary-700'
                : 'text-neutral-600 hover:bg-neutral-100'
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Approvals List */}
      <div className="space-y-4">
        {filteredApprovals.map((approval) => (
          <div
            key={approval.id}
            className={cn(
              'bg-white rounded-xl border-l-4 p-5',
              approval.priority === 'high' && 'border-l-error-main border border-neutral-200',
              approval.priority === 'medium' && 'border-l-warning-main border border-neutral-200',
              approval.priority === 'low' && 'border-l-info-main border border-neutral-200'
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center text-2xl">
                  {typeIcons[approval.type]}
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">{approval.title}</h3>
                  <p className="text-neutral-500 mt-1">
                    Requested by {approval.requestor} • {formatRelativeTime(approval.requestedAt)}
                  </p>
                  {approval.details && (
                    <p className="text-sm text-neutral-400 mt-1">{approval.details}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {approval.status === 'pending' ? (
                  <>
                    <button className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50">
                      Reject
                    </button>
                    <button className="px-4 py-2 bg-success-main text-white rounded-lg hover:bg-success-dark">
                      Approve
                    </button>
                  </>
                ) : (
                  <span
                    className={cn(
                      'px-3 py-1.5 rounded-full text-sm font-medium capitalize',
                      approval.status === 'approved' && 'bg-success-light text-success-dark',
                      approval.status === 'rejected' && 'bg-error-light text-error-dark'
                    )}
                  >
                    {approval.status}
                  </span>
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
// INTEGRATIONS PAGE
// =============================================================================

interface Integration {
  id: string;
  name: string;
  category: string;
  icon: string;
  status: string;
  lastSync: Date | null;
}

const FALLBACK_INTEGRATIONS: Integration[] = [
  {
    id: 'salesforce',
    name: 'Salesforce',
    category: 'CRM',
    icon: '☁️',
    status: 'connected',
    lastSync: new Date(Date.now() - 300000),
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    category: 'CRM',
    icon: '🧡',
    status: 'pending',
    lastSync: null,
  },
  {
    id: 'snowflake',
    name: 'Snowflake',
    category: 'Database',
    icon: '❄️',
    status: 'connected',
    lastSync: new Date(Date.now() - 1800000),
  },
  {
    id: 'bigquery',
    name: 'BigQuery',
    category: 'Analytics',
    icon: '📦',
    status: 'connected',
    lastSync: new Date(Date.now() - 3600000),
  },
  { id: 'sap', name: 'SAP', category: 'ERP', icon: '📊', status: 'syncing', lastSync: null },
];

const getIconForType = (type: string): string => {
  const icons: Record<string, string> = {
    SALESFORCE: '☁️',
    HUBSPOT: '🧡',
    POSTGRESQL: '🐘',
    MYSQL: '🐬',
    SNOWFLAKE: '❄️',
    BIGQUERY: '📦',
    SAP: '📊',
    ORACLE: '🔴',
    MONGODB: '🍃',
    REST_API: '🔗',
    GOOGLE_SHEETS: '📋',
    AIRTABLE: '📑',
  };
  return icons[type] || '📊';
};

export const BridgeIntegrationsPage: React.FC = () => {
  const categories = ['All', 'CRM', 'ERP', 'Database', 'Analytics', 'Spreadsheet'];
  const [activeCategory, setActiveCategory] = useState('All');
  const [integrations, setIntegrations] = useState<Integration[]>(FALLBACK_INTEGRATIONS);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const fetchDataSources = async () => {
      try {
        const response = await dataSourcesApi.getDataSources();
        if (response.success && response.data && Array.isArray(response.data)) {
          const mapped: Integration[] = response.data.map((ds: any) => ({
            id: ds.id,
            name: ds.name,
            category: ds.config?.category || 'Database',
            icon: getIconForType(ds.type),
            status: (ds.status || 'pending').toLowerCase(),
            lastSync: ds.last_sync_at ? new Date(ds.last_sync_at) : null,
          }));
          if (mapped.length > 0) {setIntegrations(mapped);}
        }
      } catch (err) {
        console.log('Using fallback integrations');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDataSources();
  }, []);

  const filtered =
    activeCategory === 'All'
      ? integrations
      : integrations.filter((i) => i.category === activeCategory);

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Integrations</h1>
          <p className="text-neutral-500">Connect your tools and services</p>
        </div>
        <button className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors">
          + Request Integration
        </button>
      </div>

      {/* Categories */}
      <div className="flex items-center gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              activeCategory === cat
                ? 'bg-primary-100 text-primary-700'
                : 'text-neutral-600 hover:bg-neutral-100'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Integration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((integration) => (
          <div
            key={integration.id}
            className="bg-white rounded-xl border border-neutral-200 p-5 hover:border-primary-300 hover:shadow-sm transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{integration.icon}</div>
                <div>
                  <h3 className="font-semibold text-neutral-900">{integration.name}</h3>
                  <p className="text-sm text-neutral-500">{integration.category}</p>
                </div>
              </div>
              <span
                className={cn(
                  'w-2.5 h-2.5 rounded-full',
                  integration.status === 'connected' ? 'bg-success-main' : 'bg-neutral-300'
                )}
              />
            </div>

            <p className="text-sm text-neutral-400 mb-4">
              {integration.status === 'connected'
                ? `Last sync ${formatRelativeTime(integration.lastSync!)}`
                : 'Not connected'}
            </p>

            <button
              className={cn(
                'w-full py-2 rounded-lg font-medium text-sm transition-colors',
                integration.status === 'connected'
                  ? 'border border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              )}
            >
              {integration.status === 'connected' ? 'Configure' : 'Connect'}
            </button>
          </div>
        ))}
      </div>

      {/* Page Guide */}
      <PageGuide {...GUIDES.integrations} />
    </div>
  );
};

export default WorkflowsListPage;
