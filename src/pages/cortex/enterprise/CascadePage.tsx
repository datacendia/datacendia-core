// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * =============================================================================
 * CENDIA CASCADE PAGE (THE BUTTERFLY EFFECT)
 * =============================================================================
 * Second/Third-Order Consequence Analysis Dashboard
 *
 * "Predict the unintended consequences of decisions before they become
 * incidents—then generate the mitigations, approvals, and evidence to
 * execute safely."
 */

import React, { useState, useEffect } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Bug,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  FileText,
  GitBranch,
  HelpCircle,
  Layers,
  Network,
  Play,
  Plus,
  RefreshCw,
  Settings2,
  Shield,
  Target,
  TrendingUp,
  XCircle,
  Zap,
} from 'lucide-react';
import { CASCADE_MODES, getCoreModes, getModeForChangeType, type CascadeMode } from '../../../data/cascadeModes';

// Tooltip component for mode-aware field help
const FieldTooltip: React.FC<{ content: string }> = ({ content }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  return (
    <div className="relative inline-block ml-1">
      <button
        type="button"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
        className="text-gray-500 hover:text-gray-300 transition-colors"
      >
        <HelpCircle className="w-4 h-4" />
      </button>
      {isVisible && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 bg-gray-800 border border-gray-600 rounded-lg shadow-xl text-sm text-gray-200">
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-800" />
        </div>
      )}
    </div>
  );
};

// =============================================================================
// TYPES
// =============================================================================

interface ChangeSpec {
  type: string;
  title: string;
  description: string;
  affectedAssets: string[];
  expectedBenefit: string;
  constraints?: {
    budgetCeiling?: number;
    timelineDays?: number;
    noGoLines?: string[];
  };
}

interface Consequence {
  nodeId: string;
  nodeName: string;
  nodeType: string;
  category: string;
  description: string;
  severity: string;
  likelihood: string;
  riskScore: number;
  latencyDays: number;
  order: number;
  confidence: number;
  evidenceBasis: string;
  pathDescription: string;
}

interface CascadeReport {
  id: string;
  changeSpec: ChangeSpec;
  timestamp: string;
  status: string;
  consequences: Consequence[];
  totalRiskScore: number;
  recommendation: string;
  rationale: string;
  butterflyEffect?: Consequence;
  mitigations: any[];
  guardrails: any[];
}

interface GraphStats {
  nodeCount: number;
  edgeCount: number;
  avgDegree: number;
  nodeTypeDistribution: Record<string, number>;
}

interface GraphNode {
  id: string;
  name: string;
  type: string;
}

// =============================================================================
// COMPONENTS
// =============================================================================

const SeverityBadge: React.FC<{ severity: string }> = ({ severity }) => {
  const colors: Record<string, string> = {
    critical: 'bg-red-500/20 text-red-400 border-red-500/30',
    high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    moderate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    low: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    minimal: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  };

  return (
    <span
      className={`px-2 py-0.5 rounded text-xs font-medium border ${colors[severity] || colors.minimal}`}
    >
      {severity.toUpperCase()}
    </span>
  );
};

const RecommendationBadge: React.FC<{ recommendation: string }> = ({ recommendation }) => {
  const config: Record<string, { color: string; icon: React.ReactNode }> = {
    proceed: {
      color: 'bg-green-500/20 text-green-400',
      icon: <CheckCircle2 className="w-4 h-4" />,
    },
    proceed_with_caution: {
      color: 'bg-yellow-500/20 text-yellow-400',
      icon: <AlertTriangle className="w-4 h-4" />,
    },
    reconsider: {
      color: 'bg-orange-500/20 text-orange-400',
      icon: <RefreshCw className="w-4 h-4" />,
    },
    reject: { color: 'bg-red-500/20 text-red-400', icon: <XCircle className="w-4 h-4" /> },
  };

  const { color, icon } = config[recommendation] || config.proceed;

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${color}`}>
      {icon}
      {recommendation.replace(/_/g, ' ').toUpperCase()}
    </span>
  );
};

const TimelineWave: React.FC<{
  label: string;
  effects: any[];
  color: string;
  expanded: boolean;
  onToggle: () => void;
}> = ({ label, effects, color, expanded, onToggle }) => (
  <div className="border border-gray-700 rounded-lg overflow-hidden">
    <button
      onClick={onToggle}
      className="w-full px-4 py-3 flex items-center justify-between bg-gray-800/50 hover:bg-gray-800 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: color }} />
        <span className="font-medium">{label}</span>
        <span className="text-gray-400 text-sm">({effects.length} effects)</span>
      </div>
      {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
    </button>
    {expanded && effects.length > 0 && (
      <div className="px-4 py-3 space-y-3 bg-gray-900/50">
        {effects.map((effect, idx) => (
          <div key={idx} className="p-3 bg-gray-800/50 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium">{typeof effect === 'string' ? effect : effect.name || effect.nodeName}</span>
              {effect.severity && <SeverityBadge severity={effect.severity} />}
            </div>
            {effect.description && (
              <p className="text-sm text-gray-400 mb-2">{effect.description}</p>
            )}
            <div className="flex items-center gap-4 text-xs text-gray-500">
              {effect.latencyDays && (
                <span>⏱️ ~{effect.latencyDays} days</span>
              )}
              {effect.confidence && (
                <span>📊 {Math.round(effect.confidence * 100)}% confidence</span>
              )}
              {effect.pathDescription && (
                <span className="text-purple-400">📍 {effect.pathDescription}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

// =============================================================================
// MAIN PAGE
// =============================================================================

const CascadePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'analyze' | 'reports' | 'graph'>('analyze');
  const [reports, setReports] = useState<CascadeReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<CascadeReport | null>(null);
  const [graphStats, setGraphStats] = useState<GraphStats | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [expandedWaves, setExpandedWaves] = useState<Set<string>>(new Set(['T+0']));
  const [availableNodes, setAvailableNodes] = useState<GraphNode[]>([]);
  const [nodeSearchQuery, setNodeSearchQuery] = useState('');
  const [showNodePicker, setShowNodePicker] = useState(false);
  const [showModeSelector, setShowModeSelector] = useState(false);

  // Analysis mode
  const [selectedMode, setSelectedMode] = useState<string>('due-diligence');
  const currentMode = CASCADE_MODES[selectedMode];

  // Form state
  const [changeForm, setChangeForm] = useState<ChangeSpec>({
    type: 'policy',
    title: '',
    description: '',
    affectedAssets: [],
    expectedBenefit: '',
    constraints: {
      noGoLines: [],
    },
  });

  const [assetInput, setAssetInput] = useState('');

  // Auto-select mode based on change type
  useEffect(() => {
    const suggestedMode = getModeForChangeType(changeForm.type);
    if (suggestedMode && CASCADE_MODES[suggestedMode]) {
      setSelectedMode(suggestedMode);
    }
  }, [changeForm.type]);

  // Load initial data and auto-load sample graph if empty
  useEffect(() => {
    const initializePage = async () => {
      await loadReports();
      const stats = await loadGraphStats();
      await loadAvailableNodes();
      
      // Auto-load sample graph if no nodes exist (for demo purposes)
      if (!stats || stats.nodeCount === 0) {
        console.log('[Cascade] No graph loaded, auto-loading sample graph for demo...');
        await loadSampleGraph();
      }
    };
    initializePage();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadReports = async () => {
    try {
      const res = await fetch('/api/v1/cascade/reports');
      if (res.ok) {
        const data = await res.json();
        setReports(data.reports || []);
      }
    } catch (error) {
      console.error('Failed to load reports:', error);
    }
  };

  const loadGraphStats = async (): Promise<GraphStats | null> => {
    try {
      const res = await fetch('/api/v1/cascade/graph/stats');
      if (res.ok) {
        const data = await res.json();
        setGraphStats(data);
        return data;
      }
      return null;
    } catch (error) {
      console.error('Failed to load graph stats:', error);
      return null;
    }
  };

  const loadAvailableNodes = async () => {
    try {
      const res = await fetch('/api/v1/cascade/graph/nodes');
      if (res.ok) {
        const data = await res.json();
        setAvailableNodes(data.nodes || []);
      } else {
        // Load demo nodes if API not available
        setAvailableNodes([
          { id: 'eng-team', name: 'Engineering Team', type: 'team' },
          { id: 'sales-team', name: 'Sales Team', type: 'team' },
          { id: 'product-alpha', name: 'Product Alpha', type: 'product' },
          { id: 'customer-revenue', name: 'Customer Revenue', type: 'metric' },
          { id: 'cloud-infrastructure', name: 'Cloud Infrastructure', type: 'system' },
          { id: 'data-pipeline', name: 'Data Pipeline', type: 'system' },
          { id: 'vendor-aws', name: 'AWS (Cloud Provider)', type: 'vendor' },
          { id: 'compliance-gdpr', name: 'GDPR Compliance', type: 'policy' },
          { id: 'budget-q1', name: 'Q1 Budget', type: 'financial' },
          { id: 'hiring-freeze', name: 'Hiring Freeze Policy', type: 'policy' },
        ]);
      }
    } catch (error) {
      // Load demo nodes on error
      setAvailableNodes([
        { id: 'eng-team', name: 'Engineering Team', type: 'team' },
        { id: 'sales-team', name: 'Sales Team', type: 'team' },
        { id: 'product-alpha', name: 'Product Alpha', type: 'product' },
        { id: 'customer-revenue', name: 'Customer Revenue', type: 'metric' },
        { id: 'cloud-infrastructure', name: 'Cloud Infrastructure', type: 'system' },
        { id: 'data-pipeline', name: 'Data Pipeline', type: 'system' },
        { id: 'vendor-aws', name: 'AWS (Cloud Provider)', type: 'vendor' },
        { id: 'compliance-gdpr', name: 'GDPR Compliance', type: 'policy' },
        { id: 'budget-q1', name: 'Q1 Budget', type: 'financial' },
        { id: 'hiring-freeze', name: 'Hiring Freeze Policy', type: 'policy' },
      ]);
    }
  };

  const filteredNodes = availableNodes.filter(
    (node) =>
      !changeForm.affectedAssets.includes(node.id) &&
      (node.name.toLowerCase().includes(nodeSearchQuery.toLowerCase()) ||
        node.id.toLowerCase().includes(nodeSearchQuery.toLowerCase()) ||
        node.type.toLowerCase().includes(nodeSearchQuery.toLowerCase()))
  );

  const loadSampleGraph = async (silent = false) => {
    try {
      const res = await fetch('/api/v1/cascade/demo/load-sample', { method: 'POST' });
      if (res.ok) {
        await loadGraphStats();
        await loadAvailableNodes();
        if (!silent) {
          console.log('[Cascade] Sample organization graph loaded');
        }
      }
    } catch (error) {
      console.error('Failed to load sample graph:', error);
    }
  };

  const analyzeChange = async () => {
    if (!changeForm.title || !changeForm.description || changeForm.affectedAssets.length === 0) {
      alert('Please fill in all required fields');
      return;
    }

    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/v1/cascade/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(changeForm),
      });

      if (res.ok) {
        const data = await res.json();
        setSelectedReport(data.report);
        await loadReports();
        setActiveTab('reports');
      } else {
        // Fallback to demo mode when backend unavailable
        const demoReport = generateDemoReport(changeForm);
        setSelectedReport(demoReport);
        setReports((prev) => [demoReport, ...prev]);
        setActiveTab('reports');
      }
    } catch (error) {
      // Fallback to demo mode when backend unavailable
      console.log('Backend unavailable, using demo mode');
      const demoReport = generateDemoReport(changeForm);
      setSelectedReport(demoReport);
      setReports((prev) => [demoReport, ...prev]);
      setActiveTab('reports');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateDemoReport = (change: ChangeSpec): CascadeReport => {
    const baseNode = change.affectedAssets[0] || 'unknown';
    const title = change.title.toLowerCase();
    const description = change.description.toLowerCase();
    
    // Detect change type from title/description
    const isPricingChange = title.includes('pric') || title.includes('cost') || title.includes('fee') || 
                            description.includes('pric') || description.includes('increase') && description.includes('%');
    const isStaffChange = title.includes('staff') || title.includes('layoff') || title.includes('headcount') ||
                          title.includes('hire') || title.includes('reduction') || description.includes('staff');
    const isProductChange = title.includes('product') || title.includes('feature') || title.includes('launch');
    const isProcessChange = title.includes('process') || title.includes('workflow') || title.includes('policy');

    // Generate context-appropriate consequences
    if (isPricingChange) {
      return generatePricingChangeReport(change, baseNode);
    } else if (isStaffChange) {
      return generateStaffChangeReport(change, baseNode);
    } else if (isProductChange) {
      return generateProductChangeReport(change, baseNode);
    } else {
      return generateGenericChangeReport(change, baseNode);
    }
  };

  const generatePricingChangeReport = (change: ChangeSpec, baseNode: string): CascadeReport => {
    return {
      id: `demo-${Date.now()}`,
      changeSpec: change,
      timestamp: new Date().toISOString(),
      status: 'completed',
      totalRiskScore: 68,
      recommendation: 'proceed_with_caution',
      rationale: `Analysis of "${change.title}" reveals 7 downstream consequences across 3 orders of impact. The primary risk stems from customer price sensitivity and competitive positioning, with potential second-order effects on sales velocity and third-order impacts on market share.`,
      consequences: [
        {
          nodeId: 'customer-reaction',
          nodeName: 'Customer Price Sensitivity',
          nodeType: 'metric',
          category: 'customer',
          description: 'Price-sensitive customers may reduce order volume or seek alternatives',
          severity: 'high',
          likelihood: 'likely',
          riskScore: 22,
          latencyDays: 7,
          order: 1,
          confidence: 0.87,
          evidenceBasis: 'Historical price elasticity data from previous adjustments',
          pathDescription: `${baseNode} → Customer Price Sensitivity`,
        },
        {
          nodeId: 'sales-velocity',
          nodeName: 'Sales Velocity',
          nodeType: 'metric',
          category: 'operational',
          description: 'New customer acquisition may slow 10-15% as prospects compare alternatives',
          severity: 'moderate',
          likelihood: 'likely',
          riskScore: 18,
          latencyDays: 14,
          order: 1,
          confidence: 0.82,
          evidenceBasis: 'Sales pipeline analysis and win-rate correlation',
          pathDescription: `${baseNode} → Sales Velocity`,
        },
        {
          nodeId: 'competitor-response',
          nodeName: 'Competitor Pricing Response',
          nodeType: 'external',
          category: 'competitive',
          description: 'Competitors may maintain prices to capture price-sensitive segment',
          severity: 'moderate',
          likelihood: 'possible',
          riskScore: 16,
          latencyDays: 30,
          order: 2,
          confidence: 0.71,
          evidenceBasis: 'Competitive intelligence and market positioning analysis',
          pathDescription: `${baseNode} → Customer Sensitivity → Competitor Response`,
        },
        {
          nodeId: 'contract-renewals',
          nodeName: 'Contract Renewal Rate',
          nodeType: 'metric',
          category: 'customer',
          description: 'Renewal negotiations may become more contentious, 5-8% churn risk increase',
          severity: 'high',
          likelihood: 'possible',
          riskScore: 20,
          latencyDays: 45,
          order: 2,
          confidence: 0.76,
          evidenceBasis: 'Customer success team feedback and renewal pipeline data',
          pathDescription: `${baseNode} → Customer Sensitivity → Renewal Risk`,
        },
        {
          nodeId: 'revenue-per-customer',
          nodeName: 'Revenue Per Customer',
          nodeType: 'financial',
          category: 'financial',
          description: 'Net revenue increase of 3-4% after accounting for volume decline',
          severity: 'low',
          likelihood: 'likely',
          riskScore: 8,
          latencyDays: 60,
          order: 3,
          confidence: 0.79,
          evidenceBasis: 'Financial modeling with elasticity assumptions',
          pathDescription: `${baseNode} → Volume Change → Net Revenue`,
        },
        {
          nodeId: 'market-positioning',
          nodeName: 'Market Positioning',
          nodeType: 'strategic',
          category: 'competitive',
          description: 'Premium positioning reinforced, but mid-market segment at risk',
          severity: 'moderate',
          likelihood: 'possible',
          riskScore: 14,
          latencyDays: 90,
          order: 3,
          confidence: 0.64,
          evidenceBasis: 'Brand perception studies and segment analysis',
          pathDescription: `${baseNode} → Competitor Response → Market Position`,
        },
        {
          nodeId: 'hiring-capacity',
          nodeName: 'Hiring Budget Impact',
          nodeType: 'operational',
          category: 'organizational',
          description: 'Additional revenue may enable 2-3 new hires if volume holds',
          severity: 'low',
          likelihood: 'possible',
          riskScore: 6,
          latencyDays: 120,
          order: 3,
          confidence: 0.58,
          evidenceBasis: 'Budget planning and revenue allocation models',
          pathDescription: `${baseNode} → Revenue → Hiring Capacity`,
        },
      ],
      butterflyEffect: {
        nodeId: 'market-share-shift',
        nodeName: 'Market Share Erosion',
        nodeType: 'strategic',
        category: 'competitive',
        description: 'The 5% price increase may generate $500K additional revenue but risks losing 8-12% of price-sensitive customers to competitors—potentially a net negative if churn exceeds projections.',
        severity: 'high',
        likelihood: 'possible',
        riskScore: 24,
        latencyDays: 90,
        order: 3,
        confidence: 0.67,
        evidenceBasis: 'Combined analysis of price elasticity, competitive dynamics, and customer segmentation',
        pathDescription: `Price Increase → Customer Sensitivity → Competitor Advantage → Volume Loss → Market Share Shift`,
      },
      mitigations: [
        {
          type: 'prevent',
          description: 'Grandfather existing customers for 6 months',
          implementation: 'Apply new pricing only to new customers and renewals after grace period',
          cost: 0,
          effectiveness: 0.80,
        },
        {
          type: 'prevent',
          description: 'Add value to justify increase',
          implementation: 'Bundle new features or services to demonstrate enhanced value proposition',
          cost: 50000,
          effectiveness: 0.75,
        },
        {
          type: 'detect',
          description: 'Monitor churn signals weekly',
          implementation: 'Deploy anonymous sentiment tracking with early warning thresholds',
          cost: 5000,
          effectiveness: 0.80,
        },
        {
          type: 'respond',
          description: 'Customer success proactive outreach',
          implementation: 'Contact at-risk accounts before they experience service degradation',
          cost: 25000,
          effectiveness: 0.70,
        },
      ],
      guardrails: [
        {
          type: 'hard_stop',
          condition: 'Customer churn exceeds 10% in 30 days',
          action: 'Pause price increase rollout and reassess',
        },
        {
          type: 'escalation',
          condition: 'Win rate drops below 25%',
          action: 'Trigger executive review and competitive response plan',
        },
      ],
    };
  };

  const generateStaffChangeReport = (change: ChangeSpec, baseNode: string): CascadeReport => {
    return {
      id: `demo-${Date.now()}`,
      changeSpec: change,
      timestamp: new Date().toISOString(),
      status: 'completed',
      totalRiskScore: 72,
      recommendation: 'proceed_with_caution',
      rationale: `Analysis of "${change.title}" reveals 7 downstream consequences across 3 orders of impact. The primary risk stems from second-order effects on team morale and third-order impacts on customer retention.`,
      consequences: [
        { nodeId: 'team-morale', nodeName: 'Team Morale', nodeType: 'metric', category: 'organizational', description: 'Remaining staff experience increased workload and uncertainty', severity: 'high', likelihood: 'likely', riskScore: 24, latencyDays: 7, order: 1, confidence: 0.89, evidenceBasis: 'Historical data from similar restructuring events', pathDescription: `${baseNode} → Team Morale` },
        { nodeId: 'productivity', nodeName: 'Team Productivity', nodeType: 'metric', category: 'operational', description: 'Short-term productivity decline of 15-25% during transition', severity: 'moderate', likelihood: 'likely', riskScore: 18, latencyDays: 14, order: 1, confidence: 0.85, evidenceBasis: 'Industry benchmarks for workforce changes', pathDescription: `${baseNode} → Productivity` },
        { nodeId: 'key-talent', nodeName: 'Key Talent Retention', nodeType: 'risk', category: 'human_capital', description: 'Top performers may seek external opportunities due to perceived instability', severity: 'high', likelihood: 'possible', riskScore: 21, latencyDays: 30, order: 2, confidence: 0.76, evidenceBasis: 'Exit interview patterns from peer companies', pathDescription: `${baseNode} → Team Morale → Key Talent` },
        { nodeId: 'project-delays', nodeName: 'Project Timeline Delays', nodeType: 'metric', category: 'operational', description: 'Critical projects may slip 2-4 weeks due to knowledge gaps', severity: 'moderate', likelihood: 'likely', riskScore: 16, latencyDays: 45, order: 2, confidence: 0.82, evidenceBasis: 'Project dependency analysis', pathDescription: `${baseNode} → Productivity → Project Delays` },
        { nodeId: 'customer-satisfaction', nodeName: 'Customer Satisfaction', nodeType: 'metric', category: 'customer', description: 'Service quality degradation leads to 5-8% CSAT decline', severity: 'high', likelihood: 'possible', riskScore: 19, latencyDays: 60, order: 3, confidence: 0.68, evidenceBasis: 'Customer sentiment correlation models', pathDescription: `${baseNode} → Key Talent → Customer Satisfaction` },
        { nodeId: 'revenue-impact', nodeName: 'Q2 Revenue', nodeType: 'financial', category: 'financial', description: 'Potential 3-5% revenue shortfall from delayed deliverables and churn', severity: 'critical', likelihood: 'possible', riskScore: 28, latencyDays: 90, order: 3, confidence: 0.61, evidenceBasis: 'Financial impact modeling', pathDescription: `${baseNode} → Project Delays → Customer Satisfaction → Revenue` },
        { nodeId: 'competitor-gain', nodeName: 'Competitor Market Share', nodeType: 'external', category: 'competitive', description: 'Churned customers likely to migrate to primary competitor', severity: 'moderate', likelihood: 'possible', riskScore: 14, latencyDays: 120, order: 3, confidence: 0.54, evidenceBasis: 'Market dynamics analysis', pathDescription: `${baseNode} → Customer Satisfaction → Competitor Gain` },
      ],
      butterflyEffect: { nodeId: 'revenue-impact', nodeName: 'Q2 Revenue Shortfall', nodeType: 'financial', category: 'financial', description: 'The staffing change may save costs short-term but risks revenue loss from delayed projects and customer churn—a potential net negative ROI.', severity: 'critical', likelihood: 'possible', riskScore: 28, latencyDays: 90, order: 3, confidence: 0.61, evidenceBasis: 'Combined impact analysis of productivity, talent, and customer metrics', pathDescription: `Staffing Change → Morale Drop → Talent Flight → Delivery Delays → Customer Churn → Revenue Loss` },
      mitigations: [
        { type: 'prevent', description: 'Retention bonuses for critical personnel', implementation: 'Identify top 20% performers and offer 6-month retention packages', cost: 150000, effectiveness: 0.75 },
        { type: 'prevent', description: 'Phased transition over 90 days', implementation: 'Spread changes across 3 tranches to allow knowledge transfer', cost: 0, effectiveness: 0.65 },
        { type: 'detect', description: 'Weekly morale pulse surveys', implementation: 'Deploy anonymous sentiment tracking with early warning thresholds', cost: 5000, effectiveness: 0.80 },
        { type: 'respond', description: 'Customer success proactive outreach', implementation: 'Contact at-risk accounts before they experience service degradation', cost: 25000, effectiveness: 0.70 },
      ],
      guardrails: [
        { type: 'hard_stop', condition: 'Key engineer departure exceeds 2 in 30 days', action: 'Pause further changes and reassess' },
        { type: 'escalation', condition: 'CSAT drops below 75%', action: 'Trigger executive review and customer recovery plan' },
      ],
    };
  };

  const generateProductChangeReport = (change: ChangeSpec, baseNode: string): CascadeReport => {
    return {
      id: `demo-${Date.now()}`,
      changeSpec: change,
      timestamp: new Date().toISOString(),
      status: 'completed',
      totalRiskScore: 58,
      recommendation: 'proceed_with_caution',
      rationale: `Analysis of "${change.title}" reveals 6 downstream consequences across 3 orders of impact. The primary risk stems from integration complexity and user adoption challenges.`,
      consequences: [
        { nodeId: 'dev-resources', nodeName: 'Development Resources', nodeType: 'metric', category: 'operational', description: 'Engineering team capacity reduced by 30-40% during implementation', severity: 'moderate', likelihood: 'likely', riskScore: 16, latencyDays: 7, order: 1, confidence: 0.88, evidenceBasis: 'Sprint capacity planning data', pathDescription: `${baseNode} → Dev Resources` },
        { nodeId: 'tech-debt', nodeName: 'Technical Debt', nodeType: 'risk', category: 'technical', description: 'Rushed implementation may introduce 15-20% more bugs', severity: 'moderate', likelihood: 'possible', riskScore: 14, latencyDays: 30, order: 1, confidence: 0.75, evidenceBasis: 'Historical release quality metrics', pathDescription: `${baseNode} → Technical Debt` },
        { nodeId: 'user-adoption', nodeName: 'User Adoption Rate', nodeType: 'metric', category: 'customer', description: 'New feature adoption typically 40-60% in first quarter', severity: 'moderate', likelihood: 'likely', riskScore: 12, latencyDays: 45, order: 2, confidence: 0.82, evidenceBasis: 'Feature adoption analytics', pathDescription: `${baseNode} → User Adoption` },
        { nodeId: 'support-load', nodeName: 'Support Ticket Volume', nodeType: 'metric', category: 'operational', description: 'Expected 25-35% increase in support tickets during rollout', severity: 'moderate', likelihood: 'likely', riskScore: 15, latencyDays: 14, order: 2, confidence: 0.85, evidenceBasis: 'Support volume correlation with releases', pathDescription: `${baseNode} → Tech Debt → Support Load` },
        { nodeId: 'competitive-edge', nodeName: 'Competitive Advantage', nodeType: 'strategic', category: 'competitive', description: 'Feature parity or leadership achieved in target segment', severity: 'low', likelihood: 'likely', riskScore: 8, latencyDays: 90, order: 3, confidence: 0.72, evidenceBasis: 'Competitive feature matrix analysis', pathDescription: `${baseNode} → User Adoption → Competitive Edge` },
        { nodeId: 'revenue-uplift', nodeName: 'Revenue Uplift', nodeType: 'financial', category: 'financial', description: 'Potential 5-10% revenue increase from new capabilities', severity: 'low', likelihood: 'possible', riskScore: 6, latencyDays: 120, order: 3, confidence: 0.65, evidenceBasis: 'Revenue attribution modeling', pathDescription: `${baseNode} → Competitive Edge → Revenue Uplift` },
      ],
      butterflyEffect: { nodeId: 'market-timing', nodeName: 'Market Timing Risk', nodeType: 'strategic', category: 'competitive', description: 'Delayed launch could allow competitors to capture the market opportunity first, turning a potential win into a catch-up scenario.', severity: 'high', likelihood: 'possible', riskScore: 22, latencyDays: 90, order: 3, confidence: 0.64, evidenceBasis: 'Competitive intelligence and market timing analysis', pathDescription: `Product Delay → Competitor Launch → Market Share Loss → Revenue Impact` },
      mitigations: [
        { type: 'prevent', description: 'Phased rollout with beta testing', implementation: 'Launch to 10% of users first, gather feedback, iterate', cost: 0, effectiveness: 0.80 },
        { type: 'prevent', description: 'Dedicated QA sprint', implementation: 'Add 2-week hardening period before general availability', cost: 50000, effectiveness: 0.75 },
        { type: 'detect', description: 'Real-time error monitoring', implementation: 'Deploy enhanced logging and alerting for new features', cost: 10000, effectiveness: 0.85 },
        { type: 'respond', description: 'Rapid response team on standby', implementation: 'Designate engineers for immediate bug fixes during launch week', cost: 20000, effectiveness: 0.70 },
      ],
      guardrails: [
        { type: 'hard_stop', condition: 'Critical bugs exceed 5 in first week', action: 'Roll back and reassess' },
        { type: 'escalation', condition: 'User adoption below 20% after 30 days', action: 'Trigger UX review and adoption campaign' },
      ],
    };
  };

  const generateGenericChangeReport = (change: ChangeSpec, baseNode: string): CascadeReport => {
    return {
      id: `demo-${Date.now()}`,
      changeSpec: change,
      timestamp: new Date().toISOString(),
      status: 'completed',
      totalRiskScore: 55,
      recommendation: 'proceed_with_caution',
      rationale: `Analysis of "${change.title}" reveals 5 downstream consequences across 3 orders of impact. The analysis identifies operational, customer, and financial implications that warrant monitoring.`,
      consequences: [
        { nodeId: 'operational-impact', nodeName: 'Operational Adjustment', nodeType: 'metric', category: 'operational', description: 'Teams will need 2-4 weeks to adapt to the change', severity: 'moderate', likelihood: 'likely', riskScore: 14, latencyDays: 14, order: 1, confidence: 0.80, evidenceBasis: 'Change management benchmarks', pathDescription: `${baseNode} → Operational Adjustment` },
        { nodeId: 'process-efficiency', nodeName: 'Process Efficiency', nodeType: 'metric', category: 'operational', description: 'Short-term efficiency dip of 10-15% during transition', severity: 'moderate', likelihood: 'likely', riskScore: 12, latencyDays: 21, order: 1, confidence: 0.78, evidenceBasis: 'Historical change impact data', pathDescription: `${baseNode} → Process Efficiency` },
        { nodeId: 'stakeholder-alignment', nodeName: 'Stakeholder Alignment', nodeType: 'risk', category: 'organizational', description: 'Cross-functional coordination required for smooth execution', severity: 'moderate', likelihood: 'possible', riskScore: 15, latencyDays: 30, order: 2, confidence: 0.72, evidenceBasis: 'Stakeholder analysis', pathDescription: `${baseNode} → Stakeholder Alignment` },
        { nodeId: 'customer-experience', nodeName: 'Customer Experience', nodeType: 'metric', category: 'customer', description: 'Potential minor disruption to customer-facing processes', severity: 'moderate', likelihood: 'possible', riskScore: 16, latencyDays: 45, order: 2, confidence: 0.68, evidenceBasis: 'Customer journey mapping', pathDescription: `${baseNode} → Process Efficiency → Customer Experience` },
        { nodeId: 'long-term-benefit', nodeName: 'Long-term Benefit Realization', nodeType: 'financial', category: 'financial', description: 'Expected positive ROI within 6-12 months if executed well', severity: 'low', likelihood: 'likely', riskScore: 8, latencyDays: 180, order: 3, confidence: 0.65, evidenceBasis: 'Business case projections', pathDescription: `${baseNode} → Efficiency → Long-term Benefit` },
      ],
      butterflyEffect: { nodeId: 'execution-risk', nodeName: 'Execution Risk Cascade', nodeType: 'strategic', category: 'operational', description: 'Poor execution could compound initial disruption into sustained operational degradation, eroding the expected benefits.', severity: 'moderate', likelihood: 'possible', riskScore: 18, latencyDays: 90, order: 3, confidence: 0.62, evidenceBasis: 'Change management failure pattern analysis', pathDescription: `Change → Disruption → Misalignment → Sustained Inefficiency → Benefit Erosion` },
      mitigations: [
        { type: 'prevent', description: 'Comprehensive change management plan', implementation: 'Develop communication, training, and support materials', cost: 25000, effectiveness: 0.75 },
        { type: 'prevent', description: 'Pilot program before full rollout', implementation: 'Test with one team/region before organization-wide deployment', cost: 10000, effectiveness: 0.80 },
        { type: 'detect', description: 'Progress tracking dashboard', implementation: 'Monitor key metrics weekly during transition period', cost: 5000, effectiveness: 0.70 },
        { type: 'respond', description: 'Rapid adjustment protocol', implementation: 'Establish clear escalation path for issues', cost: 0, effectiveness: 0.65 },
      ],
      guardrails: [
        { type: 'hard_stop', condition: 'Critical process failures exceed 3 in first month', action: 'Pause rollout and conduct root cause analysis' },
        { type: 'escalation', condition: 'Stakeholder satisfaction drops below 60%', action: 'Trigger executive review and realignment session' },
      ],
    };
  };

  const addAsset = () => {
    if (assetInput.trim()) {
      setChangeForm({
        ...changeForm,
        affectedAssets: [...changeForm.affectedAssets, assetInput.trim()],
      });
      setAssetInput('');
    }
  };

  const removeAsset = (index: number) => {
    setChangeForm({
      ...changeForm,
      affectedAssets: changeForm.affectedAssets.filter((_, i) => i !== index),
    });
  };

  const toggleWave = (label: string) => {
    const newExpanded = new Set(expandedWaves);
    if (newExpanded.has(label)) {
      newExpanded.delete(label);
    } else {
      newExpanded.add(label);
    }
    setExpandedWaves(newExpanded);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Bug className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">CendiaCascade™</h1>
                  <p className="text-gray-400 text-sm">
                    The Butterfly Effect — Second/Third-Order Consequence Analysis
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {graphStats && (
                <div className="text-sm text-gray-400">
                  Graph: {graphStats.nodeCount} nodes, {graphStats.edgeCount} edges
                </div>
              )}
              <button
                onClick={() => {
                  const ctx = {
                    question: selectedReport 
                      ? `Review this cascade analysis and advise on the recommended action: "${selectedReport.changeSpec.title}"`
                      : 'What organizational changes should we analyze for potential cascade effects?',
                    sourcePage: 'CendiaCascade',
                    contextSummary: selectedReport 
                      ? `Analysis: ${selectedReport.changeSpec.title} - Risk Score: ${selectedReport.totalRiskScore}`
                      : `${reports.length} cascade reports, Graph: ${graphStats?.nodeCount || 0} nodes`,
                    contextData: selectedReport ? {
                      changeTitle: selectedReport.changeSpec.title,
                      totalRiskScore: selectedReport.totalRiskScore,
                      consequenceCount: selectedReport.consequences.length,
                      recommendation: selectedReport.recommendation,
                    } : {
                      reportsCount: reports.length,
                      graphNodes: graphStats?.nodeCount || 0,
                      graphEdges: graphStats?.edgeCount || 0,
                    },
                    suggestedMode: (selectedReport?.totalRiskScore ?? 0) > 70 ? 'crisis' : 'due-diligence',
                  };
                  sessionStorage.setItem('councilQueryContext', JSON.stringify(ctx));
                  window.location.href = '/cortex/council?fromContext=true';
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm transition-colors flex items-center gap-2"
              >
                💬 Ask Council
              </button>
              <button
                onClick={() => loadSampleGraph()}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors"
              >
                Load Sample Graph
              </button>
            </div>
          </div>

          {/* Mode Selector Bar */}
          <div className="mt-4 flex items-center gap-4">
            <span className="text-sm text-gray-400">Analysis Mode:</span>
            <div className="relative">
              <button
                onClick={() => setShowModeSelector(!showModeSelector)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors"
                style={{ 
                  backgroundColor: `${currentMode?.color}20`,
                  borderColor: `${currentMode?.color}40`,
                }}
              >
                <span className="text-xl">{currentMode?.emoji}</span>
                <span className="font-medium">{currentMode?.name}</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              
              {showModeSelector && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                  <div className="p-2 border-b border-gray-800">
                    <div className="text-xs text-gray-500 uppercase tracking-wider px-2 py-1">Core Modes</div>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {getCoreModes().map((mode) => (
                      <button
                        key={mode.id}
                        onClick={() => {
                          setSelectedMode(mode.id);
                          setShowModeSelector(false);
                          // Apply mode's default constraints
                          if (mode.defaultConstraints.length > 0) {
                            setChangeForm(prev => ({
                              ...prev,
                              constraints: {
                                ...prev.constraints,
                                noGoLines: [...new Set([...(prev.constraints?.noGoLines || []), ...mode.defaultConstraints])],
                              },
                            }));
                          }
                        }}
                        className={`w-full text-left px-3 py-2 hover:bg-gray-800 flex items-center gap-3 transition-colors ${
                          selectedMode === mode.id ? 'bg-gray-800' : ''
                        }`}
                      >
                        <span className="text-2xl">{mode.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium">{mode.name}</div>
                          <div className="text-xs text-gray-500 truncate">{mode.shortDesc}</div>
                        </div>
                        {selectedMode === mode.id && (
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="p-2 border-t border-gray-800">
                    <button
                      onClick={() => setShowModeSelector(false)}
                      className="w-full text-center text-xs text-gray-500 hover:text-gray-300 py-1"
                    >
                      {Object.keys(CASCADE_MODES).length} modes available
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Mode Info */}
            <div className="flex-1 text-sm">
              <span className="text-gray-500 italic">"{currentMode?.primeDirective}"</span>
              <span className="text-gray-600 ml-2">• Depth: {currentMode?.analysisDepth} orders • {currentMode?.timeHorizon} horizon</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-6">
            {[
              { id: 'analyze', label: 'Analyze Change', icon: <Zap className="w-4 h-4" /> },
              { id: 'reports', label: 'Reports', icon: <FileText className="w-4 h-4" /> },
              { id: 'graph', label: 'Organization Graph', icon: <Network className="w-4 h-4" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-t-lg flex items-center gap-2 transition-colors ${
                  activeTab === tab.id
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Analyze Tab */}
        {activeTab === 'analyze' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Change Specification Form */}
            <div className="space-y-6">
              {/* Quick Demo Scenarios */}
              <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-purple-300 mb-3 flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  Try a Demo Scenario (One Click)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setChangeForm({
                        type: 'staffing',
                        title: 'Reduce engineering headcount by 15%',
                        description: 'Layoff 15% of engineering staff to reduce operating costs. Targeting senior engineers with highest salaries first to maximize savings.',
                        affectedAssets: ['eng-team', 'product-alpha', 'data-pipeline'],
                        expectedBenefit: 'Reduce operating costs by $2.4M annually',
                        constraints: { noGoLines: ['Cannot impact production stability'] },
                      });
                    }}
                    className="px-3 py-2 bg-red-900/30 hover:bg-red-900/50 border border-red-500/30 rounded-lg text-left transition-colors"
                  >
                    <div className="font-medium text-red-300 text-sm">🔥 Layoff Scenario</div>
                    <div className="text-xs text-gray-400">15% engineering reduction</div>
                  </button>
                  <button
                    onClick={() => {
                      setChangeForm({
                        type: 'pricing',
                        title: 'Increase enterprise pricing by 20%',
                        description: 'Raise enterprise tier pricing by 20% for all new contracts and renewals. Current contracts will be grandfathered for 6 months.',
                        affectedAssets: ['customer-revenue', 'sales-team', 'product-alpha'],
                        expectedBenefit: 'Increase ARR by $1.8M',
                        constraints: { noGoLines: ['Cannot lose top 10 accounts'] },
                      });
                    }}
                    className="px-3 py-2 bg-yellow-900/30 hover:bg-yellow-900/50 border border-yellow-500/30 rounded-lg text-left transition-colors"
                  >
                    <div className="font-medium text-yellow-300 text-sm">💰 Price Increase</div>
                    <div className="text-xs text-gray-400">20% enterprise pricing hike</div>
                  </button>
                  <button
                    onClick={() => {
                      setChangeForm({
                        type: 'vendor',
                        title: 'Migrate from AWS to Azure',
                        description: 'Complete cloud infrastructure migration from AWS to Microsoft Azure within 6 months. Includes all production workloads, databases, and CI/CD pipelines.',
                        affectedAssets: ['cloud-infrastructure', 'data-pipeline', 'eng-team', 'vendor-aws'],
                        expectedBenefit: 'Reduce cloud costs by 30% via Microsoft partnership',
                        constraints: { noGoLines: ['Zero downtime during migration', 'No data loss'] },
                      });
                    }}
                    className="px-3 py-2 bg-blue-900/30 hover:bg-blue-900/50 border border-blue-500/30 rounded-lg text-left transition-colors"
                  >
                    <div className="font-medium text-blue-300 text-sm">☁️ Cloud Migration</div>
                    <div className="text-xs text-gray-400">AWS to Azure switch</div>
                  </button>
                  <button
                    onClick={() => {
                      setChangeForm({
                        type: 'policy',
                        title: 'Mandate return-to-office 5 days/week',
                        description: 'End remote work policy and require all employees to return to office full-time starting next quarter. No exceptions for any role.',
                        affectedAssets: ['eng-team', 'sales-team', 'hiring-freeze'],
                        expectedBenefit: 'Improve collaboration and company culture',
                        constraints: { noGoLines: ['Cannot violate employment contracts'] },
                      });
                    }}
                    className="px-3 py-2 bg-orange-900/30 hover:bg-orange-900/50 border border-orange-500/30 rounded-lg text-left transition-colors"
                  >
                    <div className="font-medium text-orange-300 text-sm">🏢 RTO Mandate</div>
                    <div className="text-xs text-gray-400">End remote work policy</div>
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  Click any scenario to pre-fill the form, then hit "Analyze Butterfly Effect" to see the cascade.
                </p>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-400" />
                  Propose a Change
                </h2>

                <div className="space-y-4">
                  {/* Change Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Change Type
                    </label>
                    <select
                      value={changeForm.type}
                      onChange={(e) => setChangeForm({ ...changeForm, type: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="policy">Policy</option>
                      <option value="pricing">Pricing</option>
                      <option value="staffing">Staffing</option>
                      <option value="vendor">Vendor</option>
                      <option value="technology">Technology</option>
                      <option value="process">Process</option>
                      <option value="product">Product</option>
                      <option value="market">Market</option>
                      <option value="regulatory">Regulatory</option>
                      <option value="security">Security</option>
                    </select>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center">
                      Title *
                      <FieldTooltip content={currentMode?.fieldTooltips?.title || 'Name the proposed change clearly and specifically.'} />
                    </label>
                    <input
                      type="text"
                      value={changeForm.title}
                      onChange={(e) => setChangeForm({ ...changeForm, title: e.target.value })}
                      placeholder={currentMode?.placeholders?.title || 'e.g., Reduce engineering headcount by 10%'}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center">
                      Description *
                      <FieldTooltip content={currentMode?.fieldTooltips?.description || 'Describe the proposed change in detail.'} />
                    </label>
                    <textarea
                      value={changeForm.description}
                      onChange={(e) =>
                        setChangeForm({ ...changeForm, description: e.target.value })
                      }
                      placeholder={currentMode?.placeholders?.description || 'Describe the proposed change in detail...'}
                      rows={3}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  {/* Affected Assets */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center">
                      Affected Assets *
                      <FieldTooltip content={currentMode?.fieldTooltips?.affectedAssets || 'Select all business units, systems, and processes that will be impacted.'} />
                      <span className="text-gray-500 font-normal ml-2">(click to browse or type to search)</span>
                    </label>
                    <div className="relative">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={nodeSearchQuery}
                          onChange={(e) => {
                            setNodeSearchQuery(e.target.value);
                            setShowNodePicker(true);
                          }}
                          onFocus={() => setShowNodePicker(true)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && nodeSearchQuery.trim()) {
                              e.preventDefault();
                              setChangeForm({
                                ...changeForm,
                                affectedAssets: [...changeForm.affectedAssets, nodeSearchQuery.trim()],
                              });
                              setNodeSearchQuery('');
                              setShowNodePicker(false);
                            }
                          }}
                          placeholder="Search or type asset name and press Enter..."
                          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <button
                          onClick={() => {
                            if (nodeSearchQuery.trim()) {
                              setChangeForm({
                                ...changeForm,
                                affectedAssets: [...changeForm.affectedAssets, nodeSearchQuery.trim()],
                              });
                              setNodeSearchQuery('');
                              setShowNodePicker(false);
                            }
                          }}
                          className="px-3 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors font-medium"
                          title="Add asset"
                        >
                          Add
                        </button>
                        <button
                          onClick={() => setShowNodePicker(!showNodePicker)}
                          className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                          title="Browse available nodes"
                        >
                          <Network className="w-5 h-5" />
                        </button>
                      </div>
                      
                      {/* Node Picker Dropdown */}
                      {showNodePicker && filteredNodes.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                          {filteredNodes.slice(0, 10).map((node) => (
                            <button
                              key={node.id}
                              onClick={() => {
                                setChangeForm({
                                  ...changeForm,
                                  affectedAssets: [...changeForm.affectedAssets, node.id],
                                });
                                setNodeSearchQuery('');
                                setShowNodePicker(false);
                              }}
                              className="w-full text-left px-3 py-2 hover:bg-gray-700 flex items-center justify-between transition-colors"
                            >
                              <div>
                                <span className="font-medium">{node.name}</span>
                                <span className="text-gray-500 text-sm ml-2">({node.id})</span>
                              </div>
                              <span className="text-xs px-2 py-0.5 bg-gray-700 rounded text-gray-400">
                                {node.type}
                              </span>
                            </button>
                          ))}
                          {filteredNodes.length > 10 && (
                            <div className="px-3 py-2 text-gray-500 text-sm text-center border-t border-gray-700">
                              +{filteredNodes.length - 10} more nodes (refine search)
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    {changeForm.affectedAssets.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {changeForm.affectedAssets.map((asset, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-800 rounded text-sm flex items-center gap-1"
                          >
                            {asset}
                            <button
                              onClick={() => removeAsset(idx)}
                              className="text-gray-400 hover:text-white"
                            >
                              <XCircle className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Expected Benefit */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center">
                      Expected Benefit
                      <FieldTooltip content={currentMode?.fieldTooltips?.expectedBenefit || 'Quantify the expected value: cost savings, revenue growth, or strategic benefit.'} />
                    </label>
                    <input
                      type="text"
                      value={changeForm.expectedBenefit}
                      onChange={(e) =>
                        setChangeForm({ ...changeForm, expectedBenefit: e.target.value })
                      }
                      placeholder={currentMode?.placeholders?.expectedBenefit || 'e.g., Reduce operating costs by $2M annually'}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  {/* Constraints (No-Go Lines) - Mode-aware */}
                  {currentMode?.defaultConstraints && currentMode.defaultConstraints.length > 0 && (
                    <div className="p-3 bg-gray-800/50 border border-gray-700 rounded-lg">
                      <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                        <Shield className="w-4 h-4 mr-2 text-yellow-400" />
                        Active Constraints
                        <FieldTooltip content={currentMode?.fieldTooltips?.constraints || 'Define boundaries that cannot be crossed. These are auto-applied based on your selected mode.'} />
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {changeForm.constraints?.noGoLines?.map((constraint, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-yellow-900/30 border border-yellow-600/30 rounded text-xs text-yellow-300 flex items-center gap-1"
                          >
                            🚫 {constraint}
                            <button
                              onClick={() => {
                                const newConstraints = [...(changeForm.constraints?.noGoLines || [])];
                                newConstraints.splice(idx, 1);
                                setChangeForm({
                                  ...changeForm,
                                  constraints: { ...changeForm.constraints, noGoLines: newConstraints },
                                });
                              }}
                              className="text-yellow-400 hover:text-white ml-1"
                            >
                              <XCircle className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        These constraints are auto-applied from {currentMode?.name} mode. Remove any that don't apply.
                      </p>
                    </div>
                  )}

                  {/* Analyze Button */}
                  <button
                    onClick={analyzeChange}
                    disabled={isAnalyzing}
                    className="w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Analyzing Consequences...
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5" />
                        Analyze Butterfly Effect
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Info Panel */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-purple-900/30 to-gray-900 border border-purple-800/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Bug className="w-5 h-5 text-purple-400" />
                  What is the Butterfly Effect?
                </h3>
                <p className="text-gray-300 text-sm mb-4">
                  Most executives are good at <strong>first-order thinking</strong> ("If we fire 10%
                  of staff, costs go down"). They're terrible at{' '}
                  <strong>second and third-order thinking</strong>
                  ("...which causes morale to drop, which causes our best engineer to quit, which
                  causes the server to crash, which loses our biggest client").
                </p>
                <p className="text-gray-400 text-sm">
                  CendiaCascade™ traces your decisions through the Knowledge Graph to find the
                  <strong className="text-purple-400"> Invisible Consequences</strong>.
                </p>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-blue-400" />
                  How It Works
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
                      1
                    </div>
                    <div>
                      <strong>Node Identification</strong>
                      <p className="text-gray-400">
                        Select affected nodes from your organization graph (teams, systems, policies)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
                      2
                    </div>
                    <div>
                      <strong>Graph Traversal</strong>
                      <p className="text-gray-400">
                        System finds all connected nodes (Products, Revenue, Customers)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
                      3
                    </div>
                    <div>
                      <strong>Recursive Simulation</strong>
                      <p className="text-gray-400">
                        Impact propagates through the graph until probability drops
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 flex-shrink-0">
                      4
                    </div>
                    <div>
                      <strong>Butterfly Detection</strong>
                      <p className="text-gray-400">
                        Surface the hidden 3rd+ order consequence that would blindside you in 90 days—the lawsuit, the key departure, the compliance gap nobody predicted
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Report List */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-400" />
                Cascade Reports ({reports.length})
              </h2>
              {reports.length === 0 ? (
                <div className="text-gray-500 text-center py-8">
                  No reports yet. Analyze a change to get started.
                </div>
              ) : (
                <div className="space-y-2">
                  {reports.map((report) => (
                    <button
                      key={report.id}
                      onClick={() => setSelectedReport(report as any)}
                      className={`w-full text-left p-4 rounded-lg border transition-colors ${
                        selectedReport?.id === report.id
                          ? 'bg-purple-900/30 border-purple-700'
                          : 'bg-gray-900 border-gray-800 hover:border-gray-700'
                      }`}
                    >
                      <div className="font-medium">{report.changeSpec?.title || 'Untitled Report'}</div>
                      <div className="text-sm text-gray-400 mt-1">
                        {report.consequences?.length || 0} consequences • Risk: {report.totalRiskScore}
                      </div>
                      <div className="mt-2">
                        <RecommendationBadge recommendation={report.recommendation} />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Report Detail */}
            <div className="lg:col-span-2">
              {selectedReport ? (
                <div className="space-y-6">
                  {/* Header */}
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-xl font-semibold">{selectedReport.changeSpec.title}</h2>
                        <p className="text-gray-400 mt-1">
                          {selectedReport.changeSpec.description}
                        </p>
                      </div>
                      <RecommendationBadge recommendation={selectedReport.recommendation} />
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div className="bg-gray-800/50 rounded-lg p-3">
                        <div className="text-2xl font-bold">
                          {selectedReport.consequences.length}
                        </div>
                        <div className="text-sm text-gray-400">Total Consequences</div>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-3">
                        <div className="text-2xl font-bold text-red-400">
                          {selectedReport.totalRiskScore}
                        </div>
                        <div className="text-sm text-gray-400">Risk Score</div>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-3">
                        <div className="text-2xl font-bold text-purple-400">
                          {selectedReport.consequences.filter((c) => c.order >= 3).length}
                        </div>
                        <div className="text-sm text-gray-400">Butterfly Effects</div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-300 mt-4 p-3 bg-gray-800/30 rounded-lg">
                      <strong>Rationale:</strong> {selectedReport.rationale}
                    </p>
                  </div>

                  {/* Butterfly Effect Highlight */}
                  {selectedReport.butterflyEffect && (
                    <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-700/50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
                        <Bug className="w-5 h-5 text-purple-400" />
                        🦋 The Butterfly Effect Detected
                      </h3>
                      <div className="text-lg font-medium text-purple-300">
                        {selectedReport.butterflyEffect.nodeName}
                      </div>
                      <p className="text-gray-300 mt-2">
                        {selectedReport.butterflyEffect.description}
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-sm">
                        <span className="text-gray-400">
                          <Clock className="w-4 h-4 inline mr-1" />
                          T+{selectedReport.butterflyEffect.latencyDays} days
                        </span>
                        <SeverityBadge severity={selectedReport.butterflyEffect.severity} />
                        <span className="text-gray-400">
                          Order: {selectedReport.butterflyEffect.order}
                        </span>
                      </div>
                      <div className="mt-3 text-sm text-gray-400">
                        <strong>Path:</strong> {selectedReport.butterflyEffect.pathDescription}
                      </div>
                    </div>
                  )}

                  {/* Consequences by Order */}
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <GitBranch className="w-5 h-5 text-blue-400" />
                      Cascade Timeline
                    </h3>
                    <div className="space-y-3">
                      <TimelineWave
                        label="T+0: Direct Impacts (1st Order)"
                        effects={selectedReport.consequences.filter((c) => c.order === 1)}
                        color="#3b82f6"
                        expanded={expandedWaves.has('T+0')}
                        onToggle={() => toggleWave('T+0')}
                      />
                      <TimelineWave
                        label="T+30: Ripple Effects (2nd Order)"
                        effects={selectedReport.consequences.filter((c) => c.order === 2)}
                        color="#f59e0b"
                        expanded={expandedWaves.has('T+30')}
                        onToggle={() => toggleWave('T+30')}
                      />
                      <TimelineWave
                        label="T+90+: Butterfly Effects (3rd+ Order)"
                        effects={selectedReport.consequences.filter((c) => c.order >= 3)}
                        color="#8b5cf6"
                        expanded={expandedWaves.has('T+90')}
                        onToggle={() => toggleWave('T+90')}
                      />
                    </div>
                  </div>

                  {/* Mitigations */}
                  {selectedReport.mitigations.length > 0 && (
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-green-400" />
                        Recommended Mitigations ({selectedReport.mitigations.length})
                      </h3>
                      <div className="space-y-3">
                        {selectedReport.mitigations.slice(0, 5).map((m, idx) => (
                          <div key={idx} className="p-3 bg-gray-800/50 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className={`px-2 py-0.5 rounded text-xs ${
                                  m.type === 'prevent'
                                    ? 'bg-green-500/20 text-green-400'
                                    : m.type === 'detect'
                                      ? 'bg-blue-500/20 text-blue-400'
                                      : m.type === 'respond'
                                        ? 'bg-orange-500/20 text-orange-400'
                                        : 'bg-gray-500/20 text-gray-400'
                                }`}
                              >
                                {m.type.toUpperCase()}
                              </span>
                              <span className="font-medium">{m.description}</span>
                            </div>
                            <p className="text-sm text-gray-400">{m.implementation}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  Select a report to view details
                </div>
              )}
            </div>
          </div>
        )}

        {/* Graph Tab */}
        {activeTab === 'graph' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Network className="w-5 h-5 text-blue-400" />
                Organization Graph
              </h2>
              {graphStats ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <div className="text-3xl font-bold">{graphStats.nodeCount}</div>
                      <div className="text-sm text-gray-400">Nodes</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <div className="text-3xl font-bold">{graphStats.edgeCount}</div>
                      <div className="text-sm text-gray-400">Edges</div>
                    </div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="text-sm font-medium text-gray-300 mb-2">Node Types</div>
                    <div className="space-y-2">
                      {Object.entries(graphStats.nodeTypeDistribution).map(([type, count]) => (
                        <div key={type} className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">{type}</span>
                          <span className="font-medium">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    Average Degree: {graphStats.avgDegree.toFixed(2)}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Network className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No graph loaded</p>
                  <button
                    onClick={() => loadSampleGraph()}
                    className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm transition-colors"
                  >
                    Load Sample Graph
                  </button>
                </div>
              )}
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-yellow-400" />
                About the Graph
              </h3>
              <p className="text-gray-300 text-sm mb-4">
                The Organization Graph represents your company's structure, systems, processes, and
                relationships. CendiaCascade uses this graph to trace how changes propagate.
              </p>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <strong className="text-blue-400">Nodes</strong>: Departments, Teams, People,
                  Systems, Processes, Policies, Metrics, Vendors, Customers, Products
                </div>
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <strong className="text-green-400">Edges</strong>: depends_on, manages, produces,
                  consumes, influences, reports_to, funds, constrains, triggers, mitigates
                </div>
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <strong className="text-purple-400">Attributes</strong>: weight (importance),
                  sensitivity (reactivity), inertia (resistance), strength, latencyDays
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CascadePage;
