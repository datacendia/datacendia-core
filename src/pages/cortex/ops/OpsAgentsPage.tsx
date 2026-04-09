/**
 * Page — Ops Agents
 *
 * Practical, everyday AI agents that execute tasks:
 *   - Report Automation Agent
 *   - Analytics Agent
 *   - NLP Agent
 *   - Pipeline Builder Agent
 *
 * Separate from Governance/Council agents (which deliberate).
 * These agents DO things; Governance agents THINK about things.
 *
 * @exports OpsAgentsPage
 * @module pages/cortex/ops/OpsAgentsPage
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import {
  FileText, BarChart3, Brain, Workflow, Send, Loader2,
  CheckCircle2, XCircle, Clock, ChevronRight, Copy, Check,
  RefreshCw, Zap, Bot, Sparkles, ArrowRight, Download, AlertTriangle,
} from 'lucide-react';
import { cn } from '../../../lib/utils';

// Community-tier limits (enterprise unlocks higher limits)
const MAX_PROMPT_LENGTH = 8_000;
const MAX_CONTEXT_LENGTH = 16_000;
const COMMUNITY_AGENTS: OpsAgentType[] = ['report', 'analytics', 'nlp', 'pipeline'];

// =============================================================================
// TYPES
// =============================================================================

type OpsAgentType = 'report' | 'analytics' | 'nlp' | 'pipeline';
type TaskStatus = 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';

interface OpsAgent {
  id: string;
  type: OpsAgentType;
  name: string;
  description: string;
  icon: string;
  capabilities: string[];
  status: 'online' | 'offline';
}

interface OpsTask {
  id: string;
  agentType: OpsAgentType;
  title: string;
  prompt: string;
  status: TaskStatus;
  result?: { content: string; format: string; sections?: Array<{ title: string; content: string }> };
  createdAt: string;
  completedAt?: string;
  durationMs?: number;
  error?: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const AGENT_ICONS: Record<OpsAgentType, React.ReactNode> = {
  report: <FileText className="w-5 h-5" />,
  analytics: <BarChart3 className="w-5 h-5" />,
  nlp: <Brain className="w-5 h-5" />,
  pipeline: <Workflow className="w-5 h-5" />,
};

const AGENT_COLORS: Record<OpsAgentType, { bg: string; border: string; text: string; glow: string }> = {
  report: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', glow: 'shadow-blue-500/20' },
  analytics: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', glow: 'shadow-emerald-500/20' },
  nlp: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', glow: 'shadow-purple-500/20' },
  pipeline: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', glow: 'shadow-amber-500/20' },
};

// Community tier: 1 quick prompt per agent; enterprise unlocks full library
const QUICK_PROMPTS: Record<OpsAgentType, Array<{ label: string; prompt: string }>> = {
  report: [
    { label: 'Weekly AI Usage Report', prompt: 'Generate a weekly AI usage report for our organization. Include: total interactions by department, top tools used, cost breakdown, PII exposure incidents, and recommended actions.' },
    { label: 'Board-Ready Decision Summary', prompt: 'Create a board-ready executive summary of last month\'s key decisions. Include: decisions made, agents consulted, confidence scores, dissenting opinions, compliance status, and strategic implications.' },
    { label: 'Compliance Gap Report', prompt: 'Generate a compliance gap analysis report comparing our current AI governance posture against EU AI Act Article 14 (human oversight), NIST AI RMF, and SOC 2 Type II requirements. Flag gaps and recommend remediations.' },
  ],
  analytics: [
    { label: 'Department AI Spend Analysis', prompt: 'Analyze AI spending patterns by department. Show which departments spend the most, identify anomalies, and project next quarter costs.' },
    { label: 'Decision Quality Trends', prompt: 'Analyze decision quality over the past 6 months. Track confidence scores, dissent frequency, override rates, and time-to-decision. Identify which decision types have improving or declining quality.' },
    { label: 'Risk Exposure Dashboard', prompt: 'Build a risk exposure analysis: map open decisions by risk level (high/medium/low), identify decisions pending longer than SLA, and flag any with unresolved dissents or missing compliance gates.' },
  ],
  nlp: [
    { label: 'Classify Support Tickets', prompt: 'Classify the following support tickets into categories: billing, technical, feature-request, security, compliance. Output as JSON with confidence scores.' },
    { label: 'Contract Risk Review', prompt: 'Review the following contract for risky clauses. Flag: unlimited liability, broad indemnification, IP assignment, non-compete restrictions, auto-renewal traps, and data ownership ambiguity. Quote specific language.' },
    { label: 'Summarize Meeting Notes', prompt: 'Summarize the following meeting transcript into: key decisions made, action items with owners and deadlines, open questions, and risks raised. Keep it concise and board-ready.' },
  ],
  pipeline: [
    { label: 'ETL Pipeline for Reports', prompt: 'Design an ETL pipeline that: extracts data from our PostgreSQL database, transforms it into weekly report format, and loads it into a report storage bucket. Include scheduling and error handling.' },
    { label: 'Real-Time Compliance Monitor', prompt: 'Design a streaming pipeline that: monitors AI interactions in real-time, checks each against governance policies, flags violations immediately, and generates daily compliance summaries. Include retry logic and alerting.' },
    { label: 'Data Quality Pipeline', prompt: 'Scaffold a data quality pipeline that: ingests raw data from 3 sources (API, CSV uploads, database), validates schema and completeness, deduplicates records, applies business rules, and loads clean data into an analytics warehouse. Include error handling and dead-letter queues.' },
  ],
};

const STATUS_CONFIG: Record<TaskStatus, { icon: React.ReactNode; label: string; color: string }> = {
  queued: { icon: <Clock className="w-4 h-4" />, label: 'Queued', color: 'text-zinc-400' },
  running: { icon: <Loader2 className="w-4 h-4 animate-spin" />, label: 'Running', color: 'text-blue-400' },
  completed: { icon: <CheckCircle2 className="w-4 h-4" />, label: 'Completed', color: 'text-emerald-400' },
  failed: { icon: <XCircle className="w-4 h-4" />, label: 'Failed', color: 'text-red-400' },
  cancelled: { icon: <XCircle className="w-4 h-4" />, label: 'Cancelled', color: 'text-zinc-500' },
};

// =============================================================================
// API HELPERS
// =============================================================================

const API_BASE = '/api/v1/ops-agents';

async function fetchAgents(): Promise<OpsAgent[]> {
  const res = await fetch(API_BASE);
  const data = await res.json();
  return data.success ? data.data : [];
}

async function submitTask(body: Record<string, unknown>): Promise<OpsTask> {
  const res = await fetch(`${API_BASE}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || `Request failed (${res.status})`);
  return data.data;
}

function simpleMarkdownToHtml(md: string): string {
  return md
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/^### (.+)$/gm, '<h3 class="text-base font-bold text-zinc-100 mt-4 mb-1">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-lg font-bold text-zinc-100 mt-5 mb-2">$2</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-xl font-bold text-zinc-100 mt-6 mb-2">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-zinc-100">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code class="bg-zinc-800 px-1.5 py-0.5 rounded text-xs text-emerald-400">$1</code>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-zinc-300">$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal text-zinc-300">$1</li>')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>');
}

async function fetchTask(taskId: string): Promise<OpsTask> {
  const res = await fetch(`${API_BASE}/tasks/${taskId}`);
  const data = await res.json();
  return data.data;
}

async function fetchTasks(agentType?: string): Promise<OpsTask[]> {
  const url = agentType ? `${API_BASE}/tasks?agentType=${agentType}` : `${API_BASE}/tasks`;
  const res = await fetch(url);
  const data = await res.json();
  return data.success ? data.data : [];
}

// =============================================================================
// COMPONENTS
// =============================================================================

function AgentCard({
  agent,
  selected,
  onClick,
}: {
  agent: OpsAgent;
  selected: boolean;
  onClick: () => void;
}) {
  const colors = AGENT_COLORS[agent.type];
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative flex flex-col gap-2 p-4 rounded-xl border transition-all duration-200 text-left w-full',
        'hover:shadow-lg',
        selected
          ? `${colors.bg} ${colors.border} shadow-lg ${colors.glow}`
          : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700',
      )}
    >
      <div className="flex items-center gap-3">
        <div className={cn('p-2 rounded-lg', colors.bg, colors.text)}>
          {AGENT_ICONS[agent.type]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-zinc-100">{agent.name}</span>
            <span className={cn(
              'w-2 h-2 rounded-full',
              agent.status === 'online' ? 'bg-emerald-400' : 'bg-zinc-600',
            )} />
          </div>
          <p className="text-xs text-zinc-400 truncate">{agent.description}</p>
        </div>
        <ChevronRight className={cn('w-4 h-4 transition-transform', selected ? 'rotate-90' : '', colors.text)} />
      </div>
      {selected && (
        <div className="flex flex-wrap gap-1 mt-1">
          {agent.capabilities.slice(0, 4).map((cap) => (
            <span key={cap} className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">
              {cap.replace(/_/g, ' ')}
            </span>
          ))}
        </div>
      )}
    </button>
  );
}

function TaskHistory({
  tasks,
  onSelect,
  selectedId,
}: {
  tasks: OpsTask[];
  onSelect: (task: OpsTask) => void;
  selectedId?: string;
}) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-zinc-500 text-sm">
        <Bot className="w-8 h-8 mx-auto mb-2 opacity-50" />
        No tasks yet. Pick an agent and submit a prompt.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {tasks.map((task) => {
        const status = STATUS_CONFIG[task.status];
        const colors = AGENT_COLORS[task.agentType];
        return (
          <button
            key={task.id}
            onClick={() => onSelect(task)}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all text-sm',
              selectedId === task.id
                ? 'bg-zinc-800 border border-zinc-700'
                : 'hover:bg-zinc-800/50',
            )}
          >
            <div className={cn('p-1.5 rounded', colors.bg, colors.text)}>
              {AGENT_ICONS[task.agentType]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-zinc-200 truncate">{task.title}</div>
              <div className="text-xs text-zinc-500">
                {new Date(task.createdAt).toLocaleString()}
                {task.durationMs ? ` \u2022 ${(task.durationMs / 1000).toFixed(1)}s` : ''}
              </div>
            </div>
            <div className={cn('flex items-center gap-1', status.color)}>
              {status.icon}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function ResultViewer({ task }: { task: OpsTask }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (task.result?.content) {
      navigator.clipboard.writeText(task.result.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [task.result]);

  const handleDownload = useCallback(() => {
    if (!task.result?.content) return;
    const ext = task.result.format === 'json' ? 'json' : task.result.format === 'csv' ? 'csv' : 'md';
    const blob = new Blob([task.result.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${task.title.replace(/\s+/g, '-').toLowerCase()}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  }, [task]);

  const htmlContent = useMemo(
    () => task.result?.content ? simpleMarkdownToHtml(task.result.content) : '',
    [task.result?.content],
  );

  if (task.status === 'queued' || task.status === 'running') {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <div className="relative">
          <Loader2 className="w-10 h-10 animate-spin text-blue-400" />
          <div className="absolute inset-0 w-10 h-10 rounded-full bg-blue-400/10 animate-ping" />
        </div>
        <div className="text-sm text-zinc-400">
          {task.status === 'queued' ? 'Task queued\u2026' : 'Agent is working\u2026'}
        </div>
        <div className="text-xs text-zinc-600 max-w-xs text-center truncate">{task.prompt.slice(0, 100)}</div>
      </div>
    );
  }

  if (task.status === 'failed') {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <XCircle className="w-8 h-8 text-red-400" />
        <div className="text-sm text-red-400 font-medium">Task Failed</div>
        <div className="text-xs text-red-400/70 max-w-md text-center">{task.error || 'Unknown error'}</div>
      </div>
    );
  }

  if (task.status === 'cancelled') {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <XCircle className="w-8 h-8 text-zinc-500" />
        <div className="text-sm text-zinc-500">Task cancelled</div>
      </div>
    );
  }

  if (!task.result) return null;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-medium text-zinc-200 truncate max-w-xs">{task.title}</span>
          {task.durationMs && (
            <span className="text-xs text-zinc-500">{(task.durationMs / 1000).toFixed(1)}s</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={handleCopy} className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors" title="Copy">
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
          <button onClick={handleDownload} className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors" title="Download">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-6">
        <div
          className="prose prose-invert prose-sm max-w-none text-zinc-300 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    </div>
  );
}

// =============================================================================
// MAIN PAGE
// =============================================================================

export function OpsAgentsPage() {
  const [agents, setAgents] = useState<OpsAgent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<OpsAgentType>('report');
  const [tasks, setTasks] = useState<OpsTask[]>([]);
  const [selectedTask, setSelectedTask] = useState<OpsTask | null>(null);
  const [prompt, setPrompt] = useState('');
  const [context, setContext] = useState('');
  const [showContext, setShowContext] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [aiAvailable, setAiAvailable] = useState<boolean | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const selectedTaskRef = useRef<OpsTask | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Keep ref in sync for polling closure
  useEffect(() => { selectedTaskRef.current = selectedTask; }, [selectedTask]);

  // Auto-dismiss errors after 6s
  useEffect(() => {
    if (!errorMsg) return;
    const t = setTimeout(() => setErrorMsg(null), 6000);
    return () => clearTimeout(t);
  }, [errorMsg]);

  // Load agents + tasks on mount
  useEffect(() => {
    Promise.all([
      fetchAgents().then(setAgents).catch(() => {}),
      fetchTasks().then(setTasks).catch(() => {}),
      fetch(`${API_BASE}/status`).then(r => r.json()).then(d => setAiAvailable(d.data?.available ?? false)).catch(() => setAiAvailable(false)),
    ]).finally(() => setLoading(false));
  }, []);

  // Poll running tasks (uses ref to avoid dependency on selectedTask)
  useEffect(() => {
    const runningTasks = tasks.filter(t => t.status === 'queued' || t.status === 'running');
    if (runningTasks.length === 0) {
      if (pollingRef.current) { clearInterval(pollingRef.current); pollingRef.current = null; }
      return;
    }
    pollingRef.current = setInterval(async () => {
      try {
        const updated = await Promise.all(runningTasks.map(t => fetchTask(t.id)));
        setTasks(prev => {
          const map = new Map(prev.map(t => [t.id, t]));
          for (const u of updated) if (u) map.set(u.id, u);
          return [...map.values()].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        });
        const st = selectedTaskRef.current;
        if (st && (st.status === 'queued' || st.status === 'running')) {
          const fresh = updated.find(u => u?.id === st.id);
          if (fresh) setSelectedTask(fresh);
        }
      } catch { /* polling failure is non-fatal */ }
    }, 2000);
    return () => { if (pollingRef.current) { clearInterval(pollingRef.current); pollingRef.current = null; } };
  }, [tasks]);

  const handleSubmit = useCallback(async () => {
    if (!prompt.trim() || submitting) return;
    if (prompt.length > MAX_PROMPT_LENGTH) {
      setErrorMsg(`Prompt exceeds ${MAX_PROMPT_LENGTH.toLocaleString()} character limit`);
      return;
    }
    if (context && context.length > MAX_CONTEXT_LENGTH) {
      setErrorMsg(`Context exceeds ${MAX_CONTEXT_LENGTH.toLocaleString()} character limit`);
      return;
    }
    setSubmitting(true);
    setErrorMsg(null);
    try {
      const task = await submitTask({
        agentType: selectedAgent,
        title: prompt.slice(0, 80),
        prompt,
        context: context || undefined,
      });
      setTasks(prev => [task, ...prev]);
      setSelectedTask(task);
      setPrompt('');
      setContext('');
      setShowContext(false);
    } catch (err) {
      setErrorMsg((err as Error).message || 'Task submission failed');
    } finally {
      setSubmitting(false);
    }
  }, [prompt, context, selectedAgent, submitting]);

  const handleQuickPrompt = useCallback((p: string) => {
    setPrompt(p);
    textareaRef.current?.focus();
  }, []);

  const colors = AGENT_COLORS[selectedAgent];
  const agentTasks = tasks.filter(t => t.agentType === selectedAgent);

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-zinc-100">
      {/* Error banner */}
      {errorMsg && (
        <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border-b border-red-500/30 text-red-400 text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span className="flex-1">{errorMsg}</span>
          <button onClick={() => setErrorMsg(null)} className="text-red-400/60 hover:text-red-400">
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/20">
            <Zap className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">Ops Agents</h1>
            <p className="text-xs text-zinc-500">Everyday AI agents that execute tasks</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {aiAvailable !== null && (
            <div className={cn('flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border',
              aiAvailable
                ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
                : 'text-red-400 border-red-500/30 bg-red-500/10'
            )}>
              <span className={cn('w-2 h-2 rounded-full', aiAvailable ? 'bg-emerald-400' : 'bg-red-400')} />
              {aiAvailable ? 'AI Online' : 'AI Offline'}
            </div>
          )}
          <button
            onClick={() => fetchTasks().then(setTasks)}
            className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar — Agent selection + task history */}
        <aside className="w-80 border-r border-zinc-800 flex flex-col">
          {/* Agent cards */}
          <div className="p-3 border-b border-zinc-800">
            <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 px-1">Agents</div>
            <div className="flex flex-col gap-2">
              {agents.map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  selected={selectedAgent === agent.type}
                  onClick={() => setSelectedAgent(agent.type)}
                />
              ))}
              {/* Locked enterprise agents shown as upgrade prompts */}
              {!agents.find(a => a.type === 'nlp') && (
                <div className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-zinc-800 opacity-50">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                    <Brain className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-zinc-400">NLP Agent</div>
                    <div className="text-[10px] text-zinc-600">Enterprise</div>
                  </div>
                </div>
              )}
              {!agents.find(a => a.type === 'pipeline') && (
                <div className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-zinc-800 opacity-50">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                    <Workflow className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-zinc-400">Pipeline Agent</div>
                    <div className="text-[10px] text-zinc-600">Enterprise</div>
                  </div>
                </div>
              )}
              {agents.length === 0 && (
                <div className="text-xs text-zinc-500 text-center py-4">Loading agents...</div>
              )}
            </div>
          </div>

          {/* Task history */}
          <div className="flex-1 overflow-auto p-3">
            <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 px-1">
              Task History
            </div>
            <TaskHistory
              tasks={agentTasks}
              onSelect={setSelectedTask}
              selectedId={selectedTask?.id}
            />
          </div>
        </aside>

        {/* Main area */}
        <main className="flex-1 flex flex-col">
          {/* Result viewer or empty state */}
          <div className="flex-1 overflow-auto">
            {selectedTask ? (
              <ResultViewer task={selectedTask} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-6 px-8">
                <div className={cn('p-4 rounded-2xl', colors.bg)}>
                  <Sparkles className={cn('w-10 h-10', colors.text)} />
                </div>
                <div className="text-center max-w-md">
                  <h2 className="text-xl font-bold text-zinc-100 mb-2">
                    {agents.find(a => a.type === selectedAgent)?.name || 'Select an Agent'}
                  </h2>
                  <p className="text-sm text-zinc-400">
                    {agents.find(a => a.type === selectedAgent)?.description || 'Choose an agent from the sidebar to get started.'}
                  </p>
                </div>
                {/* Quick prompts */}
                <div className="w-full max-w-lg">
                  <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Quick Start</div>
                  <div className="flex flex-col gap-2">
                    {QUICK_PROMPTS[selectedAgent]?.map((qp, i) => (
                      <button
                        key={i}
                        onClick={() => handleQuickPrompt(qp.prompt)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl border border-zinc-800 hover:border-zinc-700 bg-zinc-900/50 hover:bg-zinc-900 transition-all text-left group"
                      >
                        <span className="text-sm text-zinc-300 flex-1">{qp.label}</span>
                        <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input area */}
          <div className="border-t border-zinc-800 p-4">
            {showContext && (
              <div className="mb-3">
                <textarea
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="Paste data, context, or documents here..."
                  className="w-full h-24 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-200 placeholder-zinc-600 resize-none focus:outline-none focus:border-zinc-700"
                />
              </div>
            )}
            <div className="flex items-end gap-3">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                  placeholder={`Ask the ${agents.find(a => a.type === selectedAgent)?.name || 'agent'} to do something...`}
                  rows={2}
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-200 placeholder-zinc-600 resize-none focus:outline-none focus:border-zinc-700 pr-24"
                />
                <div className="absolute right-2 bottom-2 flex items-center gap-1">
                  <span className={cn(
                    'text-[10px] tabular-nums',
                    prompt.length > MAX_PROMPT_LENGTH ? 'text-red-400' : prompt.length > MAX_PROMPT_LENGTH * 0.9 ? 'text-amber-400' : 'text-zinc-600',
                  )}>
                    {prompt.length > 0 && `${prompt.length.toLocaleString()}/${(MAX_PROMPT_LENGTH / 1000).toFixed(0)}k`}
                  </span>
                  <button
                    onClick={() => setShowContext(!showContext)}
                    className={cn(
                      'px-2 py-1 rounded text-xs transition-colors',
                      showContext ? 'bg-zinc-700 text-zinc-200' : 'text-zinc-500 hover:text-zinc-300',
                    )}
                  >
                    + Data
                  </button>
                </div>
              </div>
              <button
                onClick={handleSubmit}
                disabled={!prompt.trim() || submitting}
                className={cn(
                  'flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all',
                  prompt.trim() && !submitting
                    ? `bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20`
                    : 'bg-zinc-800 text-zinc-600 cursor-not-allowed',
                )}
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Run
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default OpsAgentsPage;
