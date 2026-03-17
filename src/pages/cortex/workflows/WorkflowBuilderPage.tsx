/**
 * Page — Workflow Builder
 *
 * Visual drag-and-drop workflow builder. Users drag services from
 * the catalog into a canvas, configure each step, connect them,
 * and save/load/run workflows with persistent localStorage storage.
 *
 * @exports WorkflowBuilderPage
 * @module pages/cortex/workflows/WorkflowBuilderPage
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import {
  Plus, Save, Play, Trash2, Copy, Download, Upload, Search,
  ChevronRight, ChevronDown, X, GripVertical, Settings2, Zap,
  FileText, Clock, Users, Ghost, Skull, Film, Eye, Shield,
  Network, HeartPulse, AlertTriangle, Brain, CheckCircle, TrendingUp,
  FileSignature, Loader2, FolderOpen, MoreHorizontal, ArrowRight,
} from 'lucide-react';
import { SERVICE_REGISTRY, getServiceById, getCategories } from '../../../services/ServiceRegistry';
import { WorkflowPersistenceService } from '../../../services/WorkflowPersistenceService';
import type { Workflow, WorkflowStep, ServiceDefinition, ServiceCategory } from '../../../types/workflow';

// =============================================================================
// ICON MAP
// =============================================================================

const ICON_MAP: Record<string, React.ElementType> = {
  Users, Film, FileText, Clock, Skull, Ghost, TrendingUp, CheckCircle,
  FileSignature, Eye, Search: Search, Brain, Shield, Network, HeartPulse,
  AlertTriangle, Zap, Settings2,
};

const getIcon = (name: string) => ICON_MAP[name] || Zap;

const CATEGORY_COLORS: Record<string, string> = {
  council: 'cyan', intelligence: 'violet', dcii: 'emerald', compliance: 'indigo',
  governance: 'amber', crypto: 'amber', graph: 'orange', pulse: 'rose',
  bridge: 'sky', gateway: 'blue', crown: 'purple', enterprise: 'purple',
  sovereign: 'yellow', verticals: 'teal',
};

// =============================================================================
// COMPONENT
// =============================================================================

export default function WorkflowBuilderPage() {
  // ── State ────────────────────────────────────────────────────────────────
  const [workflow, setWorkflow] = useState<Workflow>(() => {
    return WorkflowPersistenceService.createWorkflow({ name: 'New Workflow' });
  });
  const [savedWorkflows, setSavedWorkflows] = useState(() => WorkflowPersistenceService.listWorkflows());
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);
  const [catalogSearch, setCatalogSearch] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['council', 'intelligence', 'dcii']));
  const [showSavedPanel, setShowSavedPanel] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [dragOverCanvas, setDragOverCanvas] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const selectedStep = useMemo(() =>
    workflow.steps.find(s => s.id === selectedStepId) || null,
    [workflow.steps, selectedStepId]
  );

  const selectedService = useMemo(() =>
    selectedStep ? getServiceById(selectedStep.serviceId) : null,
    [selectedStep]
  );

  // ── Filtered Catalog ────────────────────────────────────────────────────
  const filteredServices = useMemo(() => {
    if (!catalogSearch.trim()) return SERVICE_REGISTRY;
    const q = catalogSearch.toLowerCase();
    return SERVICE_REGISTRY.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.shortName.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q)
    );
  }, [catalogSearch]);

  const categories = useMemo(() => getCategories(), []);

  // ── Drag & Drop ─────────────────────────────────────────────────────────
  const handleDragStart = useCallback((e: React.DragEvent, service: ServiceDefinition) => {
    e.dataTransfer.setData('serviceId', service.id);
    e.dataTransfer.effectAllowed = 'copy';
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setDragOverCanvas(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverCanvas(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOverCanvas(false);
    const serviceId = e.dataTransfer.getData('serviceId');
    const service = getServiceById(serviceId);
    if (!service) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    const x = rect ? e.clientX - rect.left : 100;
    const y = rect ? e.clientY - rect.top : 100;

    const newStep: WorkflowStep = {
      id: `step-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      serviceId: service.id,
      label: service.shortName,
      config: Object.fromEntries(service.configSchema.map(f => [f.key, f.defaultValue ?? ''])),
      position: { x: Math.max(0, x - 80), y: Math.max(0, y - 30) },
      status: 'idle',
    };

    setWorkflow(prev => ({
      ...prev,
      steps: [...prev.steps, newStep],
      status: 'ready',
    }));
    setSelectedStepId(newStep.id);
  }, []);

  // ── Add Step (button alternative to drag) ───────────────────────────────
  const addStep = useCallback((serviceId: string) => {
    const service = getServiceById(serviceId);
    if (!service) return;
    const stepCount = workflow.steps.length;
    const newStep: WorkflowStep = {
      id: `step-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      serviceId: service.id,
      label: service.shortName,
      config: Object.fromEntries(service.configSchema.map(f => [f.key, f.defaultValue ?? ''])),
      position: { x: 40 + (stepCount % 3) * 280, y: 40 + Math.floor(stepCount / 3) * 140 },
      status: 'idle',
    };
    setWorkflow(prev => ({ ...prev, steps: [...prev.steps, newStep], status: 'ready' }));
    setSelectedStepId(newStep.id);
  }, [workflow.steps.length]);

  // ── Remove Step ─────────────────────────────────────────────────────────
  const removeStep = useCallback((stepId: string) => {
    setWorkflow(prev => ({
      ...prev,
      steps: prev.steps.filter(s => s.id !== stepId),
      connections: prev.connections.filter(c => c.fromStepId !== stepId && c.toStepId !== stepId),
    }));
    if (selectedStepId === stepId) setSelectedStepId(null);
  }, [selectedStepId]);

  // ── Update Step Config ──────────────────────────────────────────────────
  const updateStepConfig = useCallback((stepId: string, key: string, value: string | number | boolean) => {
    setWorkflow(prev => ({
      ...prev,
      steps: prev.steps.map(s => s.id === stepId ? { ...s, config: { ...s.config, [key]: value } } : s),
    }));
  }, []);

  const updateStepLabel = useCallback((stepId: string, label: string) => {
    setWorkflow(prev => ({
      ...prev,
      steps: prev.steps.map(s => s.id === stepId ? { ...s, label } : s),
    }));
  }, []);

  // ── Save / Load ─────────────────────────────────────────────────────────
  const handleSave = useCallback(() => {
    setIsSaving(true);
    WorkflowPersistenceService.updateWorkflow(workflow);
    setSavedWorkflows(WorkflowPersistenceService.listWorkflows());
    setTimeout(() => setIsSaving(false), 600);
  }, [workflow]);

  const handleLoad = useCallback((id: string) => {
    const loaded = WorkflowPersistenceService.getWorkflow(id);
    if (loaded) {
      setWorkflow(loaded);
      setSelectedStepId(null);
      setShowSavedPanel(false);
    }
  }, []);

  const handleNew = useCallback(() => {
    const w = WorkflowPersistenceService.createWorkflow({ name: 'New Workflow' });
    setWorkflow(w);
    setSelectedStepId(null);
    setSavedWorkflows(WorkflowPersistenceService.listWorkflows());
  }, []);

  const handleDuplicate = useCallback((id: string) => {
    const dup = WorkflowPersistenceService.duplicateWorkflow(id);
    if (dup) {
      setWorkflow(dup);
      setSavedWorkflows(WorkflowPersistenceService.listWorkflows());
      setShowSavedPanel(false);
    }
  }, []);

  const handleDelete = useCallback((id: string) => {
    WorkflowPersistenceService.deleteWorkflow(id);
    setSavedWorkflows(WorkflowPersistenceService.listWorkflows());
  }, []);

  const handleExport = useCallback(() => {
    const json = WorkflowPersistenceService.exportWorkflow(workflow.id);
    if (json) {
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${workflow.name.replace(/\s+/g, '-').toLowerCase()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }, [workflow]);

  // ── Simulate Run ────────────────────────────────────────────────────────
  const handleRun = useCallback(async () => {
    if (workflow.steps.length === 0) return;
    setIsRunning(true);
    let current: Workflow = { ...workflow, status: 'running', lastRunAt: new Date().toISOString(), runCount: workflow.runCount + 1, steps: workflow.steps.map(s => ({ ...s })) };

    for (let i = 0; i < current.steps.length; i++) {
      current = { ...current, steps: current.steps.map((s, idx) => idx === i ? { ...s, status: 'running' } : s) };
      setWorkflow(current);
      await new Promise(r => setTimeout(r, 800 + Math.random() * 600));
      const success = Math.random() > 0.1;
      current = { ...current, steps: current.steps.map((s, idx) => idx === i ? {
        ...s,
        status: success ? 'completed' : 'failed',
        result: { success, timestamp: new Date().toISOString(), duration: 800 + Math.floor(Math.random() * 600) },
      } : s) };
      setWorkflow(current);
      if (!success) break;
    }

    const finalStatus: Workflow['status'] = current.steps.every(s => s.status === 'completed') ? 'completed' : 'failed';
    current = { ...current, status: finalStatus };
    setWorkflow(current);
    WorkflowPersistenceService.updateWorkflow(current);
    WorkflowPersistenceService.logRun({
      id: `run-${Date.now().toString(36)}`,
      workflowId: current.id,
      startedAt: current.lastRunAt!,
      completedAt: new Date().toISOString(),
      status: finalStatus === 'completed' ? 'completed' : 'failed',
      stepResults: current.steps.map(s => ({ stepId: s.id, result: s.result! })).filter(s => s.result),
    });
    setSavedWorkflows(WorkflowPersistenceService.listWorkflows());
    setIsRunning(false);
  }, [workflow]);

  // ── Auto-save on Ctrl+S ─────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleSave]);

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* ── LEFT: Service Catalog ──────────────────────────────────────── */}
      <div className="w-72 flex-shrink-0 bg-zinc-950 border-r border-zinc-800 flex flex-col">
        <div className="p-3 border-b border-zinc-800">
          <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Service Catalog</h2>
          <div className="relative">
            <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-zinc-500" />
            <input
              value={catalogSearch}
              onChange={e => setCatalogSearch(e.target.value)}
              placeholder="Search services..."
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {categories.map(cat => {
            const services = filteredServices.filter(s => s.category === cat.id);
            if (services.length === 0) return null;
            const isExpanded = expandedCategories.has(cat.id);
            const color = CATEGORY_COLORS[cat.id] || 'zinc';
            return (
              <div key={cat.id}>
                <button
                  onClick={() => setExpandedCategories(prev => {
                    const next = new Set(prev);
                    next.has(cat.id) ? next.delete(cat.id) : next.add(cat.id);
                    return next;
                  })}
                  className="w-full flex items-center gap-2 px-2 py-1.5 text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  <span className={`w-2 h-2 rounded-full bg-${color}-500`} />
                  {cat.label}
                  <span className="ml-auto text-[10px] text-zinc-600">{services.length}</span>
                </button>
                {isExpanded && (
                  <div className="space-y-0.5 ml-2">
                    {services.map(service => {
                      const Icon = getIcon(service.icon);
                      return (
                        <div
                          key={service.id}
                          draggable
                          onDragStart={e => handleDragStart(e, service)}
                          onClick={() => addStep(service.id)}
                          className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-grab active:cursor-grabbing border border-transparent hover:border-${color}-500/30 hover:bg-${color}-500/5 transition-all group`}
                          title={service.description}
                        >
                          <div className={`w-7 h-7 rounded-md bg-${color}-500/10 flex items-center justify-center flex-shrink-0`}>
                            <Icon className={`w-3.5 h-3.5 text-${color}-400`} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-zinc-300 truncate">{service.shortName}</p>
                            <p className="text-[10px] text-zinc-600 truncate">{service.name}</p>
                          </div>
                          <Plus className="w-3 h-3 text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="p-3 border-t border-zinc-800 text-center">
          <p className="text-[10px] text-zinc-600">{SERVICE_REGISTRY.length} services available</p>
        </div>
      </div>

      {/* ── CENTER: Canvas + Top Bar ───────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="h-12 flex items-center gap-3 px-4 border-b border-zinc-800 bg-zinc-950/80 flex-shrink-0">
          <input
            value={workflow.name}
            onChange={e => setWorkflow(prev => ({ ...prev, name: e.target.value }))}
            className="bg-transparent text-sm font-semibold text-zinc-100 border-none focus:outline-none focus:ring-0 min-w-0 max-w-[260px]"
            placeholder="Workflow name..."
          />
          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
            workflow.status === 'completed' ? 'bg-emerald-900/40 text-emerald-400' :
            workflow.status === 'running' ? 'bg-blue-900/40 text-blue-400' :
            workflow.status === 'failed' ? 'bg-red-900/40 text-red-400' :
            workflow.status === 'ready' ? 'bg-cyan-900/40 text-cyan-400' :
            'bg-zinc-800 text-zinc-500'
          }`}>
            {workflow.status.toUpperCase()}
          </span>
          <span className="text-[10px] text-zinc-600">{workflow.steps.length} steps</span>
          <div className="flex-1" />
          <button onClick={() => setShowSavedPanel(!showSavedPanel)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors">
            <FolderOpen className="w-3.5 h-3.5" /> Saved
          </button>
          <button onClick={handleNew} className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors">
            <Plus className="w-3.5 h-3.5" /> New
          </button>
          <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white bg-cyan-600 hover:bg-cyan-500 disabled:bg-zinc-700 rounded-lg transition-colors font-medium">
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            {isSaving ? 'Saved!' : 'Save'}
          </button>
          <button
            onClick={handleRun}
            disabled={isRunning || workflow.steps.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-700 rounded-lg transition-colors font-medium"
          >
            {isRunning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
            {isRunning ? 'Running...' : 'Run'}
          </button>
          <button onClick={handleExport} className="p-1.5 text-zinc-500 hover:text-zinc-300 transition-colors" title="Export JSON">
            <Download className="w-4 h-4" />
          </button>
        </div>

        {/* Saved workflows panel (overlay) */}
        {showSavedPanel && (
          <div className="absolute top-12 right-72 z-50 w-80 max-h-96 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl overflow-hidden">
            <div className="p-3 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="text-xs font-bold text-zinc-300 uppercase">Saved Workflows</h3>
              <button onClick={() => setShowSavedPanel(false)} className="text-zinc-500 hover:text-zinc-300"><X className="w-4 h-4" /></button>
            </div>
            <div className="max-h-72 overflow-y-auto">
              {savedWorkflows.length === 0 ? (
                <p className="p-4 text-xs text-zinc-600 text-center">No saved workflows yet</p>
              ) : (
                savedWorkflows.map(w => (
                  <div key={w.id} className={`flex items-center gap-3 px-3 py-2.5 hover:bg-zinc-800/50 transition-colors ${w.id === workflow.id ? 'bg-cyan-500/5 border-l-2 border-cyan-500' : ''}`}>
                    <div className="flex-1 min-w-0 cursor-pointer" onClick={() => handleLoad(w.id)}>
                      <p className="text-xs font-medium text-zinc-200 truncate">{w.name}</p>
                      <p className="text-[10px] text-zinc-500">{w.stepCount} steps · {w.runCount} runs</p>
                    </div>
                    <button onClick={() => handleDuplicate(w.id)} className="text-zinc-600 hover:text-zinc-300" title="Duplicate"><Copy className="w-3 h-3" /></button>
                    <button onClick={() => handleDelete(w.id)} className="text-zinc-600 hover:text-red-400" title="Delete"><Trash2 className="w-3 h-3" /></button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Canvas */}
        <div
          ref={canvasRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex-1 overflow-auto relative ${dragOverCanvas ? 'bg-cyan-950/10 ring-2 ring-inset ring-cyan-500/30' : 'bg-zinc-950/50'}`}
          style={{ backgroundImage: 'radial-gradient(circle, rgba(100,100,100,0.08) 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        >
          {workflow.steps.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-zinc-600" />
                </div>
                <p className="text-sm font-medium text-zinc-500">Drag services from the catalog</p>
                <p className="text-xs text-zinc-600 mt-1">or click a service to add it to your workflow</p>
              </div>
            </div>
          ) : (
            <div className="p-6 space-y-3">
              {/* Connection lines between sequential steps */}
              {workflow.steps.length > 1 && (
                <div className="flex items-center justify-center mb-2">
                  <span className="text-[10px] text-zinc-600 bg-zinc-900 px-2 py-0.5 rounded-full border border-zinc-800">
                    {workflow.steps.length} steps — sequential pipeline
                  </span>
                </div>
              )}
              {workflow.steps.map((step, idx) => {
                const service = getServiceById(step.serviceId);
                if (!service) return null;
                const Icon = getIcon(service.icon);
                const color = CATEGORY_COLORS[service.category] || 'zinc';
                const isSelected = selectedStepId === step.id;
                return (
                  <React.Fragment key={step.id}>
                    {idx > 0 && (
                      <div className="flex items-center justify-center py-1">
                        <div className="w-px h-6 bg-zinc-700" />
                        <ArrowRight className="w-3 h-3 text-zinc-600 mx-1" />
                        <div className="w-px h-6 bg-zinc-700" />
                      </div>
                    )}
                    <div
                      onClick={() => setSelectedStepId(step.id)}
                      className={`relative flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? `border-${color}-500 bg-${color}-500/5 ring-1 ring-${color}-500/20`
                          : 'border-zinc-800 bg-zinc-900/80 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 text-[10px] text-zinc-600 absolute top-1 right-2">
                        <span>#{idx + 1}</span>
                        {step.status === 'running' && <Loader2 className="w-3 h-3 animate-spin text-blue-400" />}
                        {step.status === 'completed' && <CheckCircle className="w-3 h-3 text-emerald-400" />}
                        {step.status === 'failed' && <X className="w-3 h-3 text-red-400" />}
                      </div>
                      <div className={`w-10 h-10 rounded-lg bg-${color}-500/10 flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-5 h-5 text-${color}-400`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-zinc-200">{step.label}</p>
                        <p className="text-[10px] text-zinc-500">{service.name}</p>
                        {step.result && (
                          <p className={`text-[10px] mt-1 ${step.result.success ? 'text-emerald-500' : 'text-red-400'}`}>
                            {step.result.success ? `✓ Completed in ${step.result.duration}ms` : `✗ ${step.result.error || 'Failed'}`}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={e => { e.stopPropagation(); removeStep(step.id); }}
                        className="p-1 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── RIGHT: Step Configuration ──────────────────────────────────── */}
      <div className="w-72 flex-shrink-0 bg-zinc-950 border-l border-zinc-800 flex flex-col">
        {selectedStep && selectedService ? (
          <>
            <div className="p-3 border-b border-zinc-800">
              <div className="flex items-center gap-2 mb-2">
                <Settings2 className="w-4 h-4 text-zinc-400" />
                <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Step Configuration</h2>
              </div>
              <div className="flex items-center gap-2">
                {(() => { const Icon = getIcon(selectedService.icon); return <Icon className={`w-4 h-4 text-${CATEGORY_COLORS[selectedService.category]}-400`} />; })()}
                <span className="text-sm font-medium text-zinc-200">{selectedService.name}</span>
              </div>
              <p className="text-[10px] text-zinc-500 mt-1">{selectedService.description}</p>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-4">
              {/* Label */}
              <div>
                <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block mb-1">Step Label</label>
                <input
                  value={selectedStep.label}
                  onChange={e => updateStepLabel(selectedStep.id, e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              {/* Inputs */}
              {selectedService.inputs.length > 0 && (
                <div>
                  <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block mb-2">Inputs</label>
                  <div className="space-y-1">
                    {selectedService.inputs.map(port => (
                      <div key={port.id} className="flex items-center gap-2 text-xs text-zinc-400">
                        <div className="w-2 h-2 rounded-full bg-cyan-500/50" />
                        <span>{port.name}</span>
                        <span className="text-[10px] text-zinc-600 ml-auto">{port.type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Outputs */}
              {selectedService.outputs.length > 0 && (
                <div>
                  <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block mb-2">Outputs</label>
                  <div className="space-y-1">
                    {selectedService.outputs.map(port => (
                      <div key={port.id} className="flex items-center gap-2 text-xs text-zinc-400">
                        <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
                        <span>{port.name}</span>
                        <span className="text-[10px] text-zinc-600 ml-auto">{port.type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Config Fields */}
              {selectedService.configSchema.length > 0 && (
                <div>
                  <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block mb-2">Configuration</label>
                  <div className="space-y-3">
                    {selectedService.configSchema.map(field => (
                      <div key={field.key}>
                        <label className="text-[10px] text-zinc-400 block mb-1">{field.label}</label>
                        {field.type === 'select' ? (
                          <select
                            value={String(selectedStep.config[field.key] ?? field.defaultValue ?? '')}
                            onChange={e => updateStepConfig(selectedStep.id, field.key, e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                          >
                            {field.options?.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                          </select>
                        ) : field.type === 'boolean' ? (
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={Boolean(selectedStep.config[field.key] ?? field.defaultValue)}
                              onChange={e => updateStepConfig(selectedStep.id, field.key, e.target.checked)}
                              className="rounded border-zinc-600"
                            />
                            <span className="text-xs text-zinc-400">{field.label}</span>
                          </label>
                        ) : field.type === 'number' ? (
                          <input
                            type="number"
                            value={Number(selectedStep.config[field.key] ?? field.defaultValue ?? 0)}
                            onChange={e => updateStepConfig(selectedStep.id, field.key, parseFloat(e.target.value) || 0)}
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                          />
                        ) : (
                          <input
                            type="text"
                            value={String(selectedStep.config[field.key] ?? field.defaultValue ?? '')}
                            onChange={e => updateStepConfig(selectedStep.id, field.key, e.target.value)}
                            placeholder={field.placeholder}
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Step Actions */}
            <div className="p-3 border-t border-zinc-800 space-y-2">
              <button
                onClick={() => removeStep(selectedStep.id)}
                className="w-full flex items-center justify-center gap-2 px-3 py-1.5 text-xs text-red-400 bg-red-950/20 hover:bg-red-950/40 rounded-lg transition-colors"
              >
                <Trash2 className="w-3 h-3" /> Remove Step
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="text-center">
              <Settings2 className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
              <p className="text-xs text-zinc-500">Select a step to configure</p>
              <p className="text-[10px] text-zinc-600 mt-1">Click on any step in the canvas</p>
            </div>
          </div>
        )}

        {/* Workflow metadata */}
        <div className="p-3 border-t border-zinc-800">
          <div className="space-y-2">
            <div>
              <label className="text-[10px] text-zinc-600 block mb-0.5">Description</label>
              <textarea
                value={workflow.description}
                onChange={e => setWorkflow(prev => ({ ...prev, description: e.target.value }))}
                rows={2}
                placeholder="Describe this workflow..."
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-cyan-500 resize-none"
              />
            </div>
            <div className="flex items-center gap-2 text-[10px] text-zinc-600">
              <span>Runs: {workflow.runCount}</span>
              {workflow.lastRunAt && <span>· Last: {new Date(workflow.lastRunAt).toLocaleDateString()}</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
