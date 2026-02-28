// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * WalkthroughsPage - Step-by-Step Workflow Guides
 * Interactive walkthroughs that guide users through enterprise decision workflows
 */

import React, { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Play,
  CheckCircle,
  Clock,
  Target,
  Users,
  Zap,
  Shield,
  TrendingUp,
  FileText,
  Search,
  Filter,
  Lightbulb,
  MessageSquare,
} from 'lucide-react';
import { AskCouncilButton } from '../../../components/AskCouncilButton';
import apiClient from '../../../lib/api/client';

// Types
interface WorkflowStep {
  order: number;
  action: string;
  service: string;
  output: string;
}

interface WorkflowScenario {
  id: string;
  name: string;
  category: string;
  councilMode: string;
  services: string[];
  steps: WorkflowStep[];
  councilQuestion: string;
  expectedOutcome: string;
  priority: string;
  estimatedDuration: string;
  tags: string[];
}

// Category icons and colors
const CATEGORY_CONFIG: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  'Procurement': { icon: <FileText className="w-5 h-5" />, color: 'text-blue-400', bg: 'bg-blue-500/20' },
  'Customer Success': { icon: <Users className="w-5 h-5" />, color: 'text-green-400', bg: 'bg-green-500/20' },
  'Manufacturing': { icon: <Zap className="w-5 h-5" />, color: 'text-amber-400', bg: 'bg-amber-500/20' },
  'Mergers & Acquisitions': { icon: <TrendingUp className="w-5 h-5" />, color: 'text-purple-400', bg: 'bg-purple-500/20' },
  'Security': { icon: <Shield className="w-5 h-5" />, color: 'text-red-400', bg: 'bg-red-500/20' },
  'Intellectual Property': { icon: <Lightbulb className="w-5 h-5" />, color: 'text-cyan-400', bg: 'bg-cyan-500/20' },
  'Investor Relations': { icon: <TrendingUp className="w-5 h-5" />, color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
  'Facilities': { icon: <Target className="w-5 h-5" />, color: 'text-orange-400', bg: 'bg-orange-500/20' },
  'Executive': { icon: <Users className="w-5 h-5" />, color: 'text-indigo-400', bg: 'bg-indigo-500/20' },
  'IT Operations': { icon: <Zap className="w-5 h-5" />, color: 'text-rose-400', bg: 'bg-rose-500/20' },
  'Legal': { icon: <FileText className="w-5 h-5" />, color: 'text-slate-400', bg: 'bg-slate-500/20' },
};

// Priority badges
const PRIORITY_CONFIG: Record<string, { color: string; bg: string }> = {
  'critical': { color: 'text-red-400', bg: 'bg-red-500/20' },
  'high': { color: 'text-orange-400', bg: 'bg-orange-500/20' },
  'medium': { color: 'text-amber-400', bg: 'bg-amber-500/20' },
  'low': { color: 'text-green-400', bg: 'bg-green-500/20' },
};

// Service descriptions for tooltips
const SERVICE_DESCRIPTIONS: Record<string, string> = {
  'CendiaProcure': 'Procurement intelligence and vendor management',
  'CendiaChronos': 'Temporal analytics and historical pattern analysis',
  'CendiaEquity': 'Investor relations and equity management',
  'CendiaGuardian': 'Customer health monitoring and success management',
  'CendiaResonance': 'Communications and stakeholder engagement',
  'CendiaFactory': 'Manufacturing operations and predictive maintenance',
  'CendiaNerve': 'IT infrastructure monitoring and incident response',
  'CendiaNetMesh': 'Organizational network and culture analysis',
  'CendiaAcademy': 'Learning and development platform',
  'CendiaTransit': 'Travel security and logistics management',
  'CendiaAegis': 'Threat intelligence and security operations',
  'CendiaInventum': 'Innovation and intellectual property management',
  'CendiaDocket': 'Legal document management and compliance',
  'CendiaHabitat': 'Workplace optimization and facilities management',
  'CendiaRegent': 'Executive advisory and shadow cabinet',
  'CendiaEternal': 'Succession planning and institutional memory',
  'CendiaCouncil': 'Multi-agent decision synthesis and governance',
};

// Walkthrough Step Component
const WalkthroughStep: React.FC<{
  step: WorkflowStep;
  isActive: boolean;
  isCompleted: boolean;
  onActivate: () => void;
}> = ({ step, isActive, isCompleted, onActivate }) => {
  const serviceDesc = SERVICE_DESCRIPTIONS[step.service] || step.service;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: step.order * 0.1 }}
      className={`relative pl-8 pb-6 border-l-2 ${
        isCompleted ? 'border-green-500' : isActive ? 'border-cyan-500' : 'border-slate-600'
      }`}
    >
      {/* Step indicator */}
      <div
        className={`absolute -left-3 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-all ${
          isCompleted
            ? 'bg-green-500 text-white'
            : isActive
            ? 'bg-cyan-500 text-white ring-4 ring-cyan-500/30'
            : 'bg-slate-700 text-gray-400 hover:bg-slate-600'
        }`}
        onClick={onActivate}
      >
        {isCompleted ? (
          <CheckCircle className="w-4 h-4" />
        ) : (
          <span className="text-xs font-bold">{step.order}</span>
        )}
      </div>

      {/* Step content */}
      <div className={`ml-4 ${isActive ? 'opacity-100' : 'opacity-70'}`}>
        <div className="flex items-start justify-between">
          <div>
            <h4 className={`font-semibold ${isActive ? 'text-white' : 'text-gray-300'}`}>
              {step.action}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs px-2 py-0.5 bg-slate-700 rounded text-cyan-400">
                {step.service}
              </span>
              <span className="text-xs text-gray-500">→ {step.output}</span>
            </div>
          </div>
        </div>
        
        {isActive && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700"
          >
            <p className="text-sm text-gray-400">{serviceDesc}</p>
            <div className="mt-2 flex items-center gap-2">
              <button className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 rounded text-sm text-white font-medium flex items-center gap-1">
                <Play className="w-3 h-3" />
                Execute Step
              </button>
              <button className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-sm text-gray-300">
                View Details
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// Walkthrough Card Component
const WalkthroughCard: React.FC<{
  scenario: WorkflowScenario;
  onStart: () => void;
}> = ({ scenario, onStart }) => {
  const categoryConfig = CATEGORY_CONFIG[scenario.category] || { icon: <FileText className="w-5 h-5" />, color: 'text-gray-400', bg: 'bg-gray-500/20' };
  const priorityConfig = PRIORITY_CONFIG[scenario.priority] ?? { color: 'text-amber-400', bg: 'bg-amber-500/20' };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-slate-800/50 rounded-xl border border-slate-700 p-5 hover:border-cyan-500/50 transition-colors cursor-pointer"
      onClick={onStart}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg ${categoryConfig.bg}`}>
          <span className={categoryConfig.color}>{categoryConfig.icon}</span>
        </div>
        <span className={`text-xs px-2 py-1 rounded ${priorityConfig.bg} ${priorityConfig.color} uppercase font-medium`}>
          {scenario.priority}
        </span>
      </div>

      <h3 className="font-semibold text-white mb-1">{scenario.name}</h3>
      <p className="text-sm text-gray-400 mb-3">{scenario.category}</p>

      <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {scenario.estimatedDuration}
        </span>
        <span className="flex items-center gap-1">
          <Target className="w-3 h-3" />
          {scenario.steps.length} steps
        </span>
      </div>

      <div className="flex flex-wrap gap-1">
        {scenario.tags.slice(0, 3).map(tag => (
          <span key={tag} className="text-xs px-2 py-0.5 bg-slate-700 rounded text-gray-400">
            {tag}
          </span>
        ))}
      </div>

      <button className="mt-4 w-full py-2 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/50 rounded-lg text-cyan-400 font-medium flex items-center justify-center gap-2">
        <Play className="w-4 h-4" />
        Start Walkthrough
      </button>
    </motion.div>
  );
};

// Active Walkthrough View
const ActiveWalkthrough: React.FC<{
  scenario: WorkflowScenario;
  onClose: () => void;
}> = ({ scenario, onClose }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const categoryConfig = CATEGORY_CONFIG[scenario.category] || { icon: <FileText className="w-5 h-5" />, color: 'text-gray-400', bg: 'bg-gray-500/20' };

  const handleCompleteStep = (stepOrder: number) => {
    if (!completedSteps.includes(stepOrder)) {
      setCompletedSteps([...completedSteps, stepOrder]);
      if (stepOrder < scenario.steps.length) {
        setActiveStep(stepOrder);
      }
    }
  };

  const progress = (completedSteps.length / scenario.steps.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-sm flex items-center gap-1 mb-2"
          >
            ← Back to Walkthroughs
          </button>
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${categoryConfig.bg}`}>
              <span className={categoryConfig.color}>{categoryConfig.icon}</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{scenario.name}</h1>
              <p className="text-gray-400">{scenario.category} • {scenario.estimatedDuration}</p>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-cyan-400">{Math.round(progress)}%</div>
          <div className="text-sm text-gray-500">Complete</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Steps */}
        <div className="lg:col-span-2 bg-slate-800/30 rounded-xl border border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            Step-by-Step Guide
          </h2>

          <div className="space-y-2">
            {scenario.steps.map((step, idx) => (
              <WalkthroughStep
                key={step.order}
                step={step}
                isActive={activeStep === idx}
                isCompleted={completedSteps.includes(step.order)}
                onActivate={() => setActiveStep(idx)}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-700">
            <button
              onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
              disabled={activeStep === 0}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white flex items-center gap-2"
            >
              ← Previous
            </button>
            <button
              onClick={() => {
                const currentStep = scenario.steps[activeStep];
                if (currentStep) {
                  handleCompleteStep(currentStep.order);
                }
              }}
              className="px-6 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-white font-medium flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Mark Complete
            </button>
            <button
              onClick={() => setActiveStep(Math.min(scenario.steps.length - 1, activeStep + 1))}
              disabled={activeStep === scenario.steps.length - 1}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white flex items-center gap-2"
            >
              Next →
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Council Question */}
          <div className="bg-gradient-to-br from-purple-900/30 to-slate-900 rounded-xl border border-purple-500/30 p-5">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-purple-400" />
              Council Question
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              {scenario.councilQuestion}
            </p>
            <AskCouncilButton
              sourcePage="Workflow Walkthroughs"
              defaultQuestion={scenario.councilQuestion}
              contextSummary={`${scenario.id}: ${scenario.name}`}
              contextData={{
                workflowId: scenario.id,
                workflowName: scenario.name,
                category: scenario.category,
                expectedOutcome: scenario.expectedOutcome,
                steps: scenario.steps,
                tags: scenario.tags,
              }}
              suggestedMode={scenario.councilMode}
              priority={scenario.priority as any}
              className="mt-4 w-full justify-center"
            />
          </div>

          {/* Expected Outcome */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-5">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <Target className="w-5 h-5 text-green-400" />
              Expected Outcome
            </h3>
            <p className="text-sm text-gray-400">
              {scenario.expectedOutcome}
            </p>
          </div>

          {/* Services Used */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-5">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              Services Used
            </h3>
            <div className="space-y-2">
              {scenario.services.map(service => (
                <div key={service} className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span className="text-gray-300">{service}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Main Page Component
const WalkthroughsPage: React.FC = () => {
  const [scenarios, setScenarios] = useState<WorkflowScenario[]>([]);
  const [activeScenario, setActiveScenario] = useState<WorkflowScenario | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(24);

  // Load scenarios from backend
  const loadScenarios = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await apiClient.api.get<WorkflowScenario[]>('/workflows/scenarios');
      if (!res.success) {
        throw new Error(res.error?.message || 'Failed to load workflows');
      }

      const loaded = Array.isArray(res.data) ? res.data : [];
      setScenarios(loaded);

      if (loaded.length === 0) {
        setError('No workflow scenarios returned from backend');
      }
    } catch (e) {
      setScenarios([]);
      setError(e instanceof Error ? e.message : 'Failed to load workflows');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadScenarios();
  }, [loadScenarios]);

  useEffect(() => {
    setVisibleCount(24);
  }, [searchQuery, selectedGroup, selectedCategory]);

  const getGroupForCategory = (category: string): string => {
    const c = category.toLowerCase();
    if (c.includes('security') || c.includes('risk') || c.includes('fraud')) {return 'Security & Risk';}
    if (c.includes('compliance') || c.includes('legal') || c.includes('audit') || c.includes('governance'))
      {return 'Compliance & Legal';}
    if (c.includes('finance') || c.includes('investor') || c.includes('equity') || c.includes('tax'))
      {return 'Finance & Investor';}
    if (c.includes('human resources') || c.includes('hr') || c.includes('talent') || c.includes('workforce'))
      {return 'People & HR';}
    if (c.includes('manufacturing') || c.includes('facilities') || c.includes('procurement') || c.includes('operations') || c.includes('supply'))
      {return 'Operations';}
    if (c.includes('customer') || c.includes('support') || c.includes('customer experience')) {return 'Customer';}
    if (c.includes('sales') || c.includes('marketing') || c.includes('business development')) {return 'Sales & Growth';}
    if (c.includes('product') || c.includes('engineering') || c.includes('technology') || c.includes('ai') || c.includes('data') || c.includes('analytics'))
      {return 'Product & Tech';}
    if (c.includes('strategy') || c.includes('executive') || c.includes('mergers')) {return 'Strategy & Executive';}
    return 'Other';
  };

  // Get unique categories
  const categories = [...new Set(scenarios.map(s => s.category).filter((c): c is string => Boolean(c)))].sort();

  const groupCounts = scenarios.reduce<Record<string, number>>((acc, s) => {
    const group = getGroupForCategory(s.category);
    acc[group] = (acc[group] ?? 0) + 1;
    return acc;
  }, {});

  const groups = Object.keys(groupCounts).sort((a, b) => {
    const diff = (groupCounts[b] ?? 0) - (groupCounts[a] ?? 0);
    return diff !== 0 ? diff : a.localeCompare(b);
  });

  const categoriesInSelectedGroup = selectedGroup
    ? categories.filter((cat) => getGroupForCategory(cat) === selectedGroup)
    : categories;

  useEffect(() => {
    if (selectedCategory && selectedGroup) {
      if (getGroupForCategory(selectedCategory) !== selectedGroup) {
        setSelectedCategory(null);
      }
    }
  }, [selectedCategory, selectedGroup]);

  // Filter scenarios
  const filteredScenarios = scenarios.filter(s => {
    const matchesSearch = searchQuery === '' || 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ?? false);
    const matchesGroup = !selectedGroup || getGroupForCategory(s.category) === selectedGroup;
    const matchesCategory = !selectedCategory || s.category === selectedCategory;
    return matchesSearch && matchesGroup && matchesCategory;
  });

  const visibleScenarios = filteredScenarios.slice(0, visibleCount);

  if (activeScenario) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          <ActiveWalkthrough
            scenario={activeScenario}
            onClose={() => setActiveScenario(null)}
          />
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-cyan-400" />
            Workflow Walkthroughs
          </h1>
          <p className="text-gray-400 mt-1">
            Step-by-step guides for enterprise decision workflows
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-white">{scenarios.length}</div>
          <div className="text-sm text-gray-500">Available Workflows</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search workflows..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-5 h-5 text-gray-500" />
          <select
            value={selectedGroup ?? ''}
            onChange={(e) => setSelectedGroup(e.target.value ? e.target.value : null)}
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500"
          >
            <option value="">All Groups ({scenarios.length})</option>
            {groups.map((g) => (
              <option key={g} value={g}>
                {g} ({groupCounts[g] ?? 0})
              </option>
            ))}
          </select>

          <select
            value={selectedCategory ?? ''}
            onChange={(e) => setSelectedCategory(e.target.value ? e.target.value : null)}
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500 min-w-[220px]"
          >
            <option value="">All Categories ({categoriesInSelectedGroup.length})</option>
            {categoriesInSelectedGroup.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {(selectedGroup || selectedCategory || searchQuery) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedGroup(null);
                setSelectedCategory(null);
              }}
              className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white text-sm font-medium"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Scenarios Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-400">Loading workflows...</p>
        </div>
      ) : error && scenarios.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Workflows Unavailable</h3>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => void loadScenarios()}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white font-medium"
          >
            Retry
          </button>
        </div>
      ) : scenarios.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No Workflows Available</h3>
          <p className="text-gray-400">Configure the backend for the selected data source and retry.</p>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleScenarios.map(scenario => (
              <WalkthroughCard
                key={scenario.id}
                scenario={scenario}
                onStart={() => setActiveScenario(scenario)}
              />
            ))}
          </div>

          {filteredScenarios.length > visibleCount && (
            <div className="pt-4 flex justify-center">
              <button
                onClick={() => setVisibleCount((c) => Math.min(filteredScenarios.length, c + 24))}
                className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white font-medium"
              >
                Load more ({Math.min(filteredScenarios.length - visibleCount, 24)} more)
              </button>
            </div>
          )}
        </>
      )}

      {filteredScenarios.length === 0 && !loading && scenarios.length > 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No Workflows Found</h3>
          <p className="text-gray-400">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
};

export default WalkthroughsPage;
