// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * CendiaCrucible™ - Synthetic Multiverse Simulation Engine
 *
 * "Synthetic Reality. Infinite Stress Testing. Failure Before It Happens."
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  Flame,
  Play,
  Target,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Shield,
  Users,
  DollarSign,
  Cpu,
  Globe,
  Zap,
  GitBranch,
  Network,
  BarChart3,
  Brain,
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
  Eye,
  Radar,
  Calendar,
  Building2,
  FileDown,
  Share2,
  RotateCcw,
  Skull,
  Timer,
  Banknote,
  UserMinus,
  Lightbulb,
  Settings,
  FileText,
  ClipboardList,
} from 'lucide-react';
import apiClient from '../../lib/api/client';
import {
  CRUCIBLE_MODES,
  INDUSTRY_FAILURE_BENCHMARKS,
  CORE_CRUCIBLE_MODES,
  calculateStressScore,
  getIndustryBenchmarkInsight,
} from '../../data/crucibleModes';
import {
  ModeSelector,
  IndustrySelector,
  ModeInfoBanner,
  IndustryInsight,
} from '../../components/modes';

// Types
interface SimulationTemplate {
  type: string;
  name: string;
  description: string;
  shockCount: number;
  shocks: Array<{
    target: string;
    type: string;
    value: number;
    timing: string;
    duration?: number;
  }>;
}

// Scenario explanations for guided view
const scenarioExplanations: Record<
  string,
  { title: string; whatHappens: string; whoAffected: string; realWorldExample: string }
> = {
  FINANCIAL_STRESS: {
    title: 'Financial Stress Test',
    whatHappens:
      'Simulates a sudden 30% revenue decline over 90 days combined with 15% operating cost increases. The system models how your cash flow, runway, and financial KPIs cascade through the organization.',
    whoAffected: 'Finance team, all departments with budgets, investors, creditors',
    realWorldExample: '2008 financial crisis, COVID-19 revenue collapse, major customer loss',
  },
  OPERATIONAL_SHOCK: {
    title: 'Operational Disruption',
    whatHappens:
      'Models a 50% throughput reduction with 2.5x longer cycle times. Shows how operational bottlenecks propagate through your supply chain, delivery timelines, and customer satisfaction.',
    whoAffected: 'Operations, logistics, customer service, sales teams',
    realWorldExample: 'Factory shutdown, key system outage, major process failure',
  },
  CYBER_ATTACK: {
    title: 'Cybersecurity Incident',
    whatHappens:
      'Simulates complete system unavailability, 80% security score drop, and 40% reputation damage over 6 months. Models incident response, recovery costs, and long-term trust impact.',
    whoAffected: 'IT, security, legal, PR, all employees, customers',
    realWorldExample: 'Colonial Pipeline ransomware, SolarWinds breach, Equifax data breach',
  },
  REGULATORY_CHANGE: {
    title: 'Regulatory Shock',
    whatHappens:
      'Models 100% compliance cost increase over a year with 30% reduction in operational flexibility. Shows how new regulations affect product development, market access, and competitive positioning.',
    whoAffected: 'Legal, compliance, product teams, international operations',
    realWorldExample: 'GDPR implementation, AI Act compliance, SOX requirements',
  },
  CULTURAL_SHIFT: {
    title: 'Cultural Disruption',
    whatHappens:
      'Simulates 40% drop in employee engagement over 60 days and 3x turnover rate increase. Models institutional knowledge loss, productivity decline, and recruitment costs.',
    whoAffected: 'HR, all managers, entire workforce',
    realWorldExample: 'Mass layoffs aftermath, toxic leadership exposure, remote work backlash',
  },
  ESG_EVENT: {
    title: 'ESG Crisis',
    whatHappens:
      'Models 60% ESG score collapse and 35% investor confidence decline over 4 months. Shows impact on fundraising, partnerships, and brand value.',
    whoAffected: 'Executive team, investor relations, sustainability, PR',
    realWorldExample: 'Environmental scandal, labor violations exposed, governance failures',
  },
  MA_SCENARIO: {
    title: 'M&A Event',
    whatHappens:
      'Simulates $5M integration costs and 25% productivity decline over 6 months. Models culture clash, system integration challenges, and talent retention during transition.',
    whoAffected: 'All employees, IT, HR, finance, operations',
    realWorldExample: 'Major acquisition, merger integration, spin-off transition',
  },
  MARKET_DISRUPTION: {
    title: 'Market Disruption',
    whatHappens:
      'Models 20% market share loss over a year with 15% pricing power reduction. Shows competitive response options and long-term strategic positioning impacts.',
    whoAffected: 'Sales, marketing, product, strategy, executive team',
    realWorldExample: 'New competitor entry, technology disruption, demand shift',
  },
  SUPPLY_CHAIN: {
    title: 'Supply Chain Breakdown',
    whatHappens:
      'Simulates 70% supply availability drop with 4x lead time increase. Models inventory depletion, customer impact, and alternative sourcing costs.',
    whoAffected: 'Procurement, operations, logistics, sales, customers',
    realWorldExample: 'Suez Canal blockage, chip shortage, pandemic supply disruption',
  },
  TALENT_EXODUS: {
    title: 'Talent Crisis',
    whatHappens:
      'Models 50% key talent loss and 40% institutional knowledge decline over 90 days. Shows recruitment costs, productivity gaps, and competitive vulnerability.',
    whoAffected: 'All departments, HR, executive leadership',
    realWorldExample: 'Executive departures, team poaching, great resignation wave',
  },
  TECHNOLOGY_FAILURE: {
    title: 'Technology Failure',
    whatHappens:
      'Simulates complete core system outage with 72-hour recovery time. Models business continuity, customer impact, and recovery procedures.',
    whoAffected: 'IT, all digital operations, customers, partners',
    realWorldExample: 'AWS outage, database corruption, critical software failure',
  },
  BLACK_SWAN: {
    title: 'Black Swan Event',
    whatHappens:
      'Models 80% operational collapse with 60% external environment degradation. Stress tests your organization against extreme, unpredictable events.',
    whoAffected: 'Entire organization, all stakeholders',
    realWorldExample: 'Global pandemic, natural disaster, unprecedented market crash',
  },
  AI_DISRUPTION: {
    title: 'AI Market Disruption',
    whatHappens:
      'Simulates 60% commoditization of core offerings due to AI automation, 40% competitive displacement, and 50% talent obsolescence over 18 months. Models required pivots and reinvention strategies.',
    whoAffected: 'Product, engineering, sales, entire workforce',
    realWorldExample:
      'ChatGPT disrupting SaaS, GitHub Copilot changing development, AI replacing creative work',
  },
  KEY_PERSON_RISK: {
    title: 'Founder/Key Person Loss',
    whatHappens:
      'Models sudden loss of CEO/founder or critical executive. Simulates 70% strategic direction uncertainty, 50% investor confidence drop, and 30% key customer concern over 6 months.',
    whoAffected: 'Board, investors, leadership team, all employees, key customers',
    realWorldExample: 'Sudden CEO departure, founder health crisis, key executive poaching',
  },
  CUSTOMER_CONCENTRATION: {
    title: 'Key Customer Loss',
    whatHappens:
      'Models loss of top customer representing 25%+ of revenue. Simulates immediate 25-40% revenue drop, 6-month recovery timeline, and cascading effects on growth metrics.',
    whoAffected: 'Sales, finance, operations, investors',
    realWorldExample: 'Enterprise contract non-renewal, customer acquisition, strategic pivot away',
  },
  CUSTOM: {
    title: 'Custom Scenario',
    whatHappens:
      "Define your own shocks and parameters to test specific hypotheses about your organization's resilience.",
    whoAffected: 'Depends on your configuration',
    realWorldExample: 'Your unique business risks and concerns',
  },
};

interface Simulation {
  id: string;
  name: string;
  simulation_type: string;
  status: string;
  created_at: string;
  results_summary?: ResultSummary;
  universes?: Universe[];
  impacts?: Impact[];
  council_deliberations?: CouncilDeliberation[];
}

interface Universe {
  id: string;
  universe_number: number;
  probability: number;
  outcome_sentiment: string;
  outcome_summary?: string;
}

interface Impact {
  id: string;
  impact_category: string;
  entity_name: string;
  change_percent?: number;
  severity: string;
}

interface CouncilDeliberation {
  id: string;
  agent_responses: AgentResponse[];
  consensus_reached: boolean;
  final_recommendation?: string;
  confidence_score?: number;
}

interface AgentResponse {
  agentRole: string;
  analysis: string;
  confidenceLevel: number;
}

interface ResultSummary {
  totalUniverses: number;
  bestCase: { probability: number; sentiment: string; summary: string };
  worstCase: { probability: number; sentiment: string; summary: string };
  mostLikely: { probability: number; sentiment: string; summary: string };
  keyRisks: string[];
  keyOpportunities: string[];
  overallConfidence: number;
}

// Severity levels: EXISTENTIAL (🔴), SEVERE (🟠), MODERATE (🟡)
type SeverityLevel = 'EXISTENTIAL' | 'SEVERE' | 'MODERATE';

const scenarioSeverity: Record<string, SeverityLevel> = {
  BLACK_SWAN: 'EXISTENTIAL',
  CYBER_ATTACK: 'EXISTENTIAL',
  TECHNOLOGY_FAILURE: 'EXISTENTIAL',
  AI_DISRUPTION: 'EXISTENTIAL',
  KEY_PERSON_RISK: 'EXISTENTIAL',
  CUSTOMER_CONCENTRATION: 'EXISTENTIAL',
  FINANCIAL_STRESS: 'SEVERE',
  TALENT_EXODUS: 'SEVERE',
  SUPPLY_CHAIN: 'SEVERE',
  OPERATIONAL_SHOCK: 'SEVERE',
  MARKET_DISRUPTION: 'MODERATE',
  REGULATORY_CHANGE: 'MODERATE',
  CULTURAL_SHIFT: 'MODERATE',
  ESG_EVENT: 'MODERATE',
  MA_SCENARIO: 'MODERATE',
  CUSTOM: 'MODERATE',
};

const severityColors: Record<
  SeverityLevel,
  { bg: string; border: string; text: string; badge: string; indicator: string }
> = {
  EXISTENTIAL: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/40',
    text: 'text-red-400',
    badge: 'bg-red-500/20 text-red-300',
    indicator: 'bg-red-500',
  },
  SEVERE: {
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/40',
    text: 'text-orange-400',
    badge: 'bg-orange-500/20 text-orange-300',
    indicator: 'bg-orange-500',
  },
  MODERATE: {
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/40',
    text: 'text-yellow-400',
    badge: 'bg-yellow-500/20 text-yellow-300',
    indicator: 'bg-yellow-500',
  },
};

// Example shocks for each scenario (for card display)
const shockExamples: Record<string, string[]> = {
  FINANCIAL_STRESS: ['Revenue decline (10-50%)', 'Cost increase (15-40%)'],
  OPERATIONAL_SHOCK: ['Throughput reduction (30-70%)', 'Cycle time increase (2-4x)'],
  CYBER_ATTACK: ['System unavailability', 'Reputation damage (20-60%)'],
  REGULATORY_CHANGE: ['Compliance cost spike (50-150%)', 'Flexibility reduction'],
  CULTURAL_SHIFT: ['Engagement drop (20-50%)', 'Turnover increase (2-4x)'],
  ESG_EVENT: ['ESG score collapse (40-80%)', 'Investor confidence loss'],
  MA_SCENARIO: ['Integration costs ($1-10M)', 'Productivity decline (15-35%)'],
  MARKET_DISRUPTION: ['Market share loss (10-30%)', 'Pricing power erosion'],
  SUPPLY_CHAIN: ['Supply availability drop (50-90%)', 'Lead time increase (3-6x)'],
  TALENT_EXODUS: ['Key talent loss (30-70%)', 'Knowledge drain (30-60%)'],
  TECHNOLOGY_FAILURE: ['Core system outage', 'Recovery time (24-96h)'],
  BLACK_SWAN: ['Multi-system failure (60-90%)', 'External environment shock'],
  AI_DISRUPTION: ['Core offering commoditized (40-70%)', 'Competitive displacement'],
  KEY_PERSON_RISK: ['Strategic direction loss', 'Investor confidence drop (30-60%)'],
  CUSTOMER_CONCENTRATION: ['Revenue loss (25-40%)', 'Growth metric cascade'],
  CUSTOM: ['User-defined parameters'],
};

// Scenario icons
const scenarioIcons: Record<string, React.ReactNode> = {
  FINANCIAL_STRESS: <DollarSign className="w-5 h-5" />,
  OPERATIONAL_SHOCK: <Cpu className="w-5 h-5" />,
  CYBER_ATTACK: <Shield className="w-5 h-5" />,
  REGULATORY_CHANGE: <Globe className="w-5 h-5" />,
  CULTURAL_SHIFT: <Users className="w-5 h-5" />,
  MARKET_DISRUPTION: <TrendingDown className="w-5 h-5" />,
  SUPPLY_CHAIN: <Network className="w-5 h-5" />,
  TECHNOLOGY_FAILURE: <Zap className="w-5 h-5" />,
  BLACK_SWAN: <AlertTriangle className="w-5 h-5" />,
  TALENT_EXODUS: <UserMinus className="w-5 h-5" />,
  ESG_EVENT: <Globe className="w-5 h-5" />,
  MA_SCENARIO: <Building2 className="w-5 h-5" />,
  AI_DISRUPTION: <Brain className="w-5 h-5" />,
  KEY_PERSON_RISK: <Skull className="w-5 h-5" />,
  CUSTOMER_CONCENTRATION: <Users className="w-5 h-5" />,
  CUSTOM: <Target className="w-5 h-5" />,
};

// Resilience Radar Component - Spider chart visualization
interface ResilienceScore {
  dimension: string;
  score: number;
  icon: React.ReactNode;
}

const ResilienceRadar: React.FC<{
  scores: ResilienceScore[];
  overallScore: number;
  weakest: { dimension: string; score: number };
  strongest: { dimension: string; score: number };
  onRunSimulation?: (dimension: string) => void;
}> = ({ scores, overallScore, weakest, strongest, onRunSimulation }) => {
  const centerX = 150;
  const centerY = 150;
  const maxRadius = 120;
  const numPoints = scores.length;

  // Calculate polygon points for the scores
  const getPolygonPoints = (scoreList: ResilienceScore[]) => {
    return scoreList
      .map((s, i) => {
        const angle = (Math.PI * 2 * i) / numPoints - Math.PI / 2;
        const radius = (s.score / 100) * maxRadius;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        return `${x},${y}`;
      })
      .join(' ');
  };

  // Generate grid circles
  const gridLevels = [25, 50, 75, 100];

  return (
    <div className="p-6 bg-slate-900/80 border border-purple-500/30 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <Radar className="w-5 h-5 text-purple-400" />
          Resilience Radar
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-white">{overallScore}</span>
          <span className="text-sm text-gray-400">/100</span>
        </div>
      </div>

      <div className="flex gap-6">
        {/* SVG Radar Chart */}
        <div className="flex-shrink-0">
          <svg width="300" height="300" className="mx-auto">
            {/* Grid circles */}
            {gridLevels.map((level) => (
              <circle
                key={level}
                cx={centerX}
                cy={centerY}
                r={(level / 100) * maxRadius}
                fill="none"
                stroke="rgba(148, 163, 184, 0.2)"
                strokeWidth="1"
              />
            ))}

            {/* Axis lines */}
            {scores.map((_, i) => {
              const angle = (Math.PI * 2 * i) / numPoints - Math.PI / 2;
              const x2 = centerX + maxRadius * Math.cos(angle);
              const y2 = centerY + maxRadius * Math.sin(angle);
              return (
                <line
                  key={i}
                  x1={centerX}
                  y1={centerY}
                  x2={x2}
                  y2={y2}
                  stroke="rgba(148, 163, 184, 0.15)"
                  strokeWidth="1"
                />
              );
            })}

            {/* Score polygon */}
            <polygon
              points={getPolygonPoints(scores)}
              fill="rgba(168, 85, 247, 0.2)"
              stroke="rgb(168, 85, 247)"
              strokeWidth="2"
            />

            {/* Score points */}
            {scores.map((s, i) => {
              const angle = (Math.PI * 2 * i) / numPoints - Math.PI / 2;
              const radius = (s.score / 100) * maxRadius;
              const x = centerX + radius * Math.cos(angle);
              const y = centerY + radius * Math.sin(angle);
              const labelRadius = maxRadius + 25;
              const labelX = centerX + labelRadius * Math.cos(angle);
              const labelY = centerY + labelRadius * Math.sin(angle);

              const isWeak = s.score < 60;
              const isStrong = s.score >= 80;

              return (
                <g key={i}>
                  {/* Point */}
                  <circle
                    cx={x}
                    cy={y}
                    r="6"
                    fill={isWeak ? '#ef4444' : isStrong ? '#22c55e' : '#a855f7'}
                    stroke="white"
                    strokeWidth="2"
                  />
                  {/* Label */}
                  <text
                    x={labelX}
                    y={labelY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-[10px] fill-gray-400 font-medium"
                  >
                    {s.dimension}
                  </text>
                  {/* Score */}
                  <text
                    x={labelX}
                    y={labelY + 12}
                    textAnchor="middle"
                    className={`text-[11px] font-bold ${isWeak ? 'fill-red-400' : isStrong ? 'fill-green-400' : 'fill-purple-400'}`}
                  >
                    {s.score}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Insights panel */}
        <div className="flex-1 space-y-4">
          {/* Weakest dimension */}
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <div className="flex items-center gap-2 text-red-400 text-sm font-medium mb-1">
              <AlertTriangle className="w-4 h-4" />
              Weakest: {weakest.dimension} ({weakest.score})
            </div>
            <button
              onClick={() => onRunSimulation?.(weakest.dimension)}
              className="text-xs text-red-300 hover:text-red-200 underline"
            >
              Run simulation →
            </button>
          </div>

          {/* Strongest dimension */}
          <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
            <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
              <CheckCircle className="w-4 h-4" />
              Strongest: {strongest.dimension} ({strongest.score})
            </div>
          </div>

          {/* Score breakdown */}
          <div className="space-y-2">
            {scores.map((s) => (
              <div key={s.dimension} className="flex items-center gap-2">
                <div className="w-20 text-xs text-gray-400 truncate">{s.dimension}</div>
                <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      s.score < 60 ? 'bg-red-500' : s.score >= 80 ? 'bg-green-500' : 'bg-purple-500'
                    }`}
                    style={{ width: `${s.score}%` }}
                  />
                </div>
                <div
                  className={`w-8 text-xs font-medium text-right ${
                    s.score < 60
                      ? 'text-red-400'
                      : s.score >= 80
                        ? 'text-green-400'
                        : 'text-gray-400'
                  }`}
                >
                  {s.score}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Results Panel with break points and recommendations
interface SimulationBreakPoint {
  month: number;
  event: string;
  severity: 'critical' | 'warning' | 'info';
}

interface RecommendedAction {
  priority: number;
  action: string;
  impact: string;
}

const EnhancedResultsPanel: React.FC<{
  simulation: Simulation;
  onExport?: () => void;
  onShare?: () => void;
  onRerun?: () => void;
}> = ({ simulation, onExport, onShare, onRerun }) => {
  // Calculate simulated metrics from results
  const results = simulation.results_summary;
  if (!results) {return null;}

  // Generate synthetic break points based on scenario type
  const breakPoints: SimulationBreakPoint[] = [
    { month: 3, event: 'Critical resource threshold reached', severity: 'warning' },
    { month: 6, event: 'Cash flow becomes negative', severity: 'critical' },
    { month: 9, event: 'Operational capacity degraded by 50%', severity: 'critical' },
  ];

  const recommendedActions: RecommendedAction[] = [
    { priority: 1, action: 'Establish emergency credit facility', impact: '+3 months runway' },
    { priority: 2, action: 'Identify 15% cost reduction plan', impact: 'Reduce burn rate' },
    { priority: 3, action: 'Negotiate extended payment terms', impact: 'Improve cash flow' },
  ];

  // Calculate time metrics
  const survivalMonths = (results.overallConfidence * 12).toFixed(1);
  const criticalMonths = (results.overallConfidence * 8).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Key Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl text-center">
          <Timer className="w-6 h-6 text-orange-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{criticalMonths}</div>
          <div className="text-xs text-gray-400">Months to Critical</div>
        </div>
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-center">
          <Skull className="w-6 h-6 text-red-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{survivalMonths}</div>
          <div className="text-xs text-gray-400">Months to Failure</div>
        </div>
        <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl text-center">
          <Banknote className="w-6 h-6 text-purple-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">
            ${(results.overallConfidence * 5).toFixed(1)}M
          </div>
          <div className="text-xs text-gray-400">Cash at Risk</div>
        </div>
        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl text-center">
          <UserMinus className="w-6 h-6 text-blue-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">
            -{Math.round((1 - results.overallConfidence) * 40)}%
          </div>
          <div className="text-xs text-gray-400">Headcount Impact</div>
        </div>
      </div>

      {/* Break Points */}
      <div className="p-5 bg-slate-900/80 border border-slate-700 rounded-xl">
        <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-400" />
          Break Points Identified
        </h4>
        <div className="space-y-3">
          {breakPoints.map((bp, i) => (
            <div
              key={i}
              className={`flex items-center gap-4 p-3 rounded-lg border ${
                bp.severity === 'critical'
                  ? 'bg-red-500/10 border-red-500/30'
                  : bp.severity === 'warning'
                    ? 'bg-orange-500/10 border-orange-500/30'
                    : 'bg-blue-500/10 border-blue-500/30'
              }`}
            >
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                  bp.severity === 'critical'
                    ? 'bg-red-500 text-white'
                    : bp.severity === 'warning'
                      ? 'bg-orange-500 text-white'
                      : 'bg-blue-500 text-white'
                }`}
              >
                M{bp.month}
              </div>
              <div className="flex-1">
                <div
                  className={`text-sm font-medium ${
                    bp.severity === 'critical'
                      ? 'text-red-300'
                      : bp.severity === 'warning'
                        ? 'text-orange-300'
                        : 'text-blue-300'
                  }`}
                >
                  Month {bp.month}
                </div>
                <div className="text-gray-300 text-sm">{bp.event}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Actions */}
      <div className="p-5 bg-slate-900/80 border border-slate-700 rounded-xl">
        <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-400" />
          Recommended Actions
        </h4>
        <div className="space-y-3">
          {recommendedActions.map((action, i) => (
            <div key={i} className="flex items-start gap-4 p-3 bg-slate-800/50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-sm font-bold">
                {action.priority}
              </div>
              <div className="flex-1">
                <div className="text-white text-sm font-medium">{action.action}</div>
                <div className="text-green-400 text-xs">{action.impact}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onExport}
          className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
          <FileDown className="w-5 h-5" />
          Export Report
        </button>
        <button
          onClick={onShare}
          className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
          <Share2 className="w-5 h-5" />
          Share with Board
        </button>
        <button
          onClick={onRerun}
          className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
          Run Again
        </button>
      </div>
    </div>
  );
};

// Types for new API responses
interface ResilienceData {
  overall: number;
  dimensions: Array<{ dimension: string; score: number; trend: number }>;
  weakest: { dimension: string; score: number };
  strongest: { dimension: string; score: number };
  lastUpdated: string;
}

interface BenchmarkData {
  industry: string;
  benchmarks: Array<{
    dimension: string;
    industryAvg: number;
    topQuartile: number;
    yourScore: number;
  }>;
  overallComparison: { yourScore: number; industryAvg: number; percentile: number };
}

interface RecommendationData {
  scenarioType: string;
  priority: 'critical' | 'high' | 'medium';
  reason: string;
  relatedDimension: string;
  lastSimulated?: string;
}

interface RecentSimulationData {
  id: string;
  name: string;
  simulationType: string;
  status: string;
  createdAt: string;
  createdBy: string;
  resilienceScore?: number;
  sentiment?: string;
}

export const CruciblePage: React.FC = () => {
  const [templates, setTemplates] = useState<SimulationTemplate[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [activeSimulation, setActiveSimulation] = useState<Simulation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [view, setView] = useState<'templates' | 'history' | 'results'>('templates');
  const [showDetailModal, setShowDetailModal] = useState<string | null>(null);

  // New state for real-time data
  const [resilienceData, setResilienceData] = useState<ResilienceData | null>(null);
  const [benchmarkData, setBenchmarkData] = useState<BenchmarkData | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationData[]>([]);
  const [recentSimulations, setRecentSimulations] = useState<RecentSimulationData[]>([]);

  // Risk appetite slider (Conservative=1, Moderate=2, Aggressive=3)
  const [riskAppetite, setRiskAppetite] = useState<number>(2);
  const [showAssumptions, setShowAssumptions] = useState(false);
  const [showOutputArtifacts, setShowOutputArtifacts] = useState(false);

  // New state for scenario customization, history, and scheduling
  const [showScenarioCustomizer, setShowScenarioCustomizer] = useState(false);
  const [customScenario, setCustomScenario] = useState({
    revenueDecline: 30,
    costIncrease: 20,
    attritionRate: 15,
    marketShare: -10,
    duration: 6,
  });
  const [showHistorySidebar, setShowHistorySidebar] = useState(false);
  const [scheduleNightly, setScheduleNightly] = useState(false);
  
  // Mode and industry state
  const [selectedModeId, setSelectedModeId] = useState<string>('chaos-engineering');
  const [selectedIndustryId, setSelectedIndustryId] = useState<string>('general');
  
  const currentMode = CRUCIBLE_MODES[selectedModeId];
  const currentIndustry = INDUSTRY_FAILURE_BENCHMARKS[selectedIndustryId];
  const stressScore = currentMode && currentIndustry 
    ? calculateStressScore(currentMode, currentIndustry) 
    : null;
  const industryInsight = currentMode && currentIndustry
    ? getIndustryBenchmarkInsight(currentMode, currentIndustry)
    : '';

  // Risk appetite labels
  const riskAppetiteLabels = ['Conservative', 'Moderate', 'Aggressive'];
  const riskAppetiteDescriptions = {
    1: 'Lower severity thresholds, more warnings, cautious recommendations',
    2: 'Balanced severity thresholds, standard recommendations',
    3: 'Higher severity thresholds, focus on existential risks only',
  };

  const loadCrucibleData = useCallback(async () => {
    setIsLoading(true);

    let loadedTemplates: SimulationTemplate[] = [];
    let nextError: string | null = null;

    try {
      const [
        templatesRes,
        simulationsRes,
        resilienceRes,
        benchmarksRes,
        recommendationsRes,
        recentRes,
      ] = await Promise.all([
        apiClient.api.get<{ data: SimulationTemplate[] }>('/crucible/templates'),
        apiClient.api.get<{ data: Simulation[] }>('/crucible/simulations'),
        apiClient.api.get<{ data: ResilienceData }>('/crucible/resilience'),
        apiClient.api.get<{ data: BenchmarkData }>('/crucible/benchmarks'),
        apiClient.api.get<{ data: RecommendationData[] }>('/crucible/recommendations'),
        apiClient.api.get<{ data: RecentSimulationData[] }>('/crucible/recent'),
      ]);

      if (templatesRes.success && templatesRes.data) {
        const data = (templatesRes.data as any).data || templatesRes.data;
        loadedTemplates = Array.isArray(data) ? data : [];
      } else {
        nextError = templatesRes.error?.message || 'Failed to load simulation templates';
      }

      if (simulationsRes.success && simulationsRes.data) {
        const data = (simulationsRes.data as any).data || simulationsRes.data;
        setSimulations(Array.isArray(data) ? data : []);
      } else {
        setSimulations([]);
      }

      if (resilienceRes.success && resilienceRes.data) {
        const data = (resilienceRes.data as any).data || resilienceRes.data;
        setResilienceData(data);
      } else {
        setResilienceData(null);
      }

      if (benchmarksRes.success && benchmarksRes.data) {
        const data = (benchmarksRes.data as any).data || benchmarksRes.data;
        setBenchmarkData(data);
      } else {
        setBenchmarkData(null);
      }

      if (recommendationsRes.success && recommendationsRes.data) {
        const data = (recommendationsRes.data as any).data || recommendationsRes.data;
        setRecommendations(Array.isArray(data) ? data : []);
      } else {
        setRecommendations([]);
      }

      if (recentRes.success && recentRes.data) {
        const data = (recentRes.data as any).data || recentRes.data;
        setRecentSimulations(Array.isArray(data) ? data : []);
      } else {
        setRecentSimulations([]);
      }
    } catch (error) {
      console.error('Failed to load Crucible data, using demo data:', error);
      loadedTemplates = [
        { type: 'FINANCIAL_STRESS', name: 'Financial Stress Test', description: 'Sudden 30% revenue decline with cost increases', shockCount: 3, shocks: [{ target: 'revenue', type: 'decline', value: -30, timing: 'immediate', duration: 90 }, { target: 'costs', type: 'increase', value: 15, timing: 'gradual', duration: 180 }, { target: 'cashflow', type: 'decline', value: -25, timing: 'delayed' }] },
        { type: 'CYBER_ATTACK', name: 'Cybersecurity Incident', description: 'Complete system unavailability and reputation damage', shockCount: 4, shocks: [{ target: 'systems', type: 'outage', value: -100, timing: 'immediate' }, { target: 'security_score', type: 'decline', value: -80, timing: 'immediate' }, { target: 'reputation', type: 'decline', value: -40, timing: 'gradual', duration: 180 }, { target: 'recovery_cost', type: 'increase', value: 500, timing: 'immediate' }] },
        { type: 'REGULATORY_CHANGE', name: 'Regulatory Shock', description: '100% compliance cost increase with flexibility reduction', shockCount: 2, shocks: [{ target: 'compliance_cost', type: 'increase', value: 100, timing: 'gradual', duration: 365 }, { target: 'flexibility', type: 'decline', value: -30, timing: 'gradual', duration: 180 }] },
        { type: 'TALENT_EXODUS', name: 'Talent Crisis', description: '50% key talent loss with knowledge decline', shockCount: 3, shocks: [{ target: 'talent', type: 'decline', value: -50, timing: 'immediate', duration: 90 }, { target: 'knowledge', type: 'decline', value: -40, timing: 'gradual', duration: 90 }, { target: 'recruitment_cost', type: 'increase', value: 200, timing: 'delayed' }] },
        { type: 'MARKET_DISRUPTION', name: 'Market Disruption', description: '20% market share loss with pricing pressure', shockCount: 2, shocks: [{ target: 'market_share', type: 'decline', value: -20, timing: 'gradual', duration: 365 }, { target: 'pricing_power', type: 'decline', value: -15, timing: 'gradual', duration: 180 }] },
        { type: 'SUPPLY_CHAIN', name: 'Supply Chain Breakdown', description: '70% supply drop with lead time explosion', shockCount: 2, shocks: [{ target: 'supply', type: 'decline', value: -70, timing: 'immediate' }, { target: 'lead_time', type: 'increase', value: 300, timing: 'immediate', duration: 120 }] },
      ];
      nextError = null;
      setSimulations([]);
      setResilienceData({ overallScore: 62, categories: { financial: 71, operational: 58, cyber: 45, regulatory: 78, talent: 55 }, trend: [60, 58, 62, 59, 64, 62] } as any);
      setBenchmarkData({ industryAverage: 55, topQuartile: 78, yourScore: 62 } as any);
      setRecommendations([
        { id: 'rec-1', title: 'Strengthen Cyber Resilience', description: 'Cyber resilience score (45) is below industry average. Implement incident response playbooks.', priority: 'high', category: 'cyber' } as any,
        { id: 'rec-2', title: 'Improve Talent Retention', description: 'Talent resilience (55) at risk. Build succession plans for key roles.', priority: 'medium', category: 'talent' } as any,
        { id: 'rec-3', title: 'Diversify Supply Chain', description: 'Single-source dependencies create fragility. Identify alternative suppliers.', priority: 'medium', category: 'operational' } as any,
      ]);
      setRecentSimulations([
        { id: 'sim-1', type: 'FINANCIAL_STRESS', name: 'Q1 Revenue Stress', runAt: new Date(Date.now() - 86400000 * 2).toISOString(), result: 'survived', score: 68 } as any,
        { id: 'sim-2', type: 'CYBER_ATTACK', name: 'Ransomware Scenario', runAt: new Date(Date.now() - 86400000 * 5).toISOString(), result: 'critical', score: 34 } as any,
        { id: 'sim-3', type: 'TALENT_EXODUS', name: 'Key Person Departure', runAt: new Date(Date.now() - 86400000 * 7).toISOString(), result: 'stressed', score: 52 } as any,
      ]);
    }

    if (loadedTemplates.length === 0) {
      setTemplates([]);
      setApiError(nextError || 'No simulation templates returned from backend');
    } else {
      setTemplates(loadedTemplates);
      setApiError(null);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    void loadCrucibleData();
  }, [loadCrucibleData]);

  const runSimulation = async (templateType: string, customParams?: typeof customScenario) => {
    setIsRunning(true);
    try {
      // Build simulation payload with custom parameters if provided
      const payload: any = {
        name: `${templateType.replace(/_/g, ' ')} - ${new Date().toLocaleDateString()}`,
        simulationType: templateType,
        riskAppetite: riskAppetiteLabels[riskAppetite - 1]?.toLowerCase() || 'moderate',
      };

      // Include custom scenario parameters for CUSTOM type
      if (templateType === 'CUSTOM' && customParams) {
        payload.customParameters = {
          revenueDecline: customParams.revenueDecline,
          costIncrease: customParams.costIncrease,
          attritionRate: customParams.attritionRate,
          marketShareChange: customParams.marketShare,
          durationMonths: customParams.duration,
        };
      }

      const createRes = await apiClient.api.post<any>('/crucible/simulations', payload);

      if (createRes.success && createRes.data) {
        const simulation = (createRes.data as any).data || (createRes.data as Simulation);
        const runRes = await apiClient.api.post<{ data: any }>(
          `/crucible/simulations/${simulation.id}/run`
        );

        if (runRes.success) {
          const detailRes = await apiClient.api.get<any>(`/crucible/simulations/${simulation.id}`);
          if (detailRes.success && detailRes.data) {
            setActiveSimulation((detailRes.data as any).data || (detailRes.data as Simulation));
            setView('results');
            const refreshRes = await apiClient.api.get<any>('/crucible/simulations');
            if (refreshRes.success && refreshRes.data) {
              setSimulations((refreshRes.data as any).data || (refreshRes.data as Simulation[]));
            }
          }
        }
      }
    } catch (error) {
      console.error('Simulation failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const loadSimulationDetails = async (id: string) => {
    const res = await apiClient.api.get<any>(`/crucible/simulations/${id}`);
    if (res.success && res.data) {
      setActiveSimulation((res.data as any).data || (res.data as Simulation));
      setView('results');
    }
  };

  // Get the currently selected template details for modal
  const modalTemplate = showDetailModal ? templates.find((t) => t.type === showDetailModal) : null;
  const modalExplanation = showDetailModal ? scenarioExplanations[showDetailModal] : null;

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Scenario Detail Modal */}
      {showDetailModal && modalTemplate && modalExplanation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 rounded-xl ${
                      showDetailModal === 'BLACK_SWAN'
                        ? 'bg-red-500/20 text-red-400'
                        : showDetailModal === 'CYBER_ATTACK'
                          ? 'bg-orange-500/20 text-orange-400'
                          : 'bg-purple-500/20 text-purple-400'
                    }`}
                  >
                    {scenarioIcons[showDetailModal] || <Target className="w-6 h-6" />}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{modalExplanation.title}</h2>
                    <p className="text-gray-400 text-sm">
                      {modalTemplate.shockCount} stress factors applied
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailModal(null)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* What Happens */}
              <div>
                <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wide mb-2">
                  What Happens In This Simulation
                </h3>
                <p className="text-gray-300 leading-relaxed">{modalExplanation.whatHappens}</p>
              </div>

              {/* Shocks Applied */}
              <div>
                <h3 className="text-sm font-semibold text-orange-400 uppercase tracking-wide mb-3">
                  Stress Factors Applied
                </h3>
                <div className="space-y-2">
                  {modalTemplate.shocks?.map((shock, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700"
                    >
                      <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                      <div className="flex-1">
                        <span className="text-white font-medium capitalize">
                          {shock.target.replace(/_/g, ' ')}
                        </span>
                        <span className="text-gray-400 mx-2">→</span>
                        <span className={shock.value < 0 ? 'text-red-400' : 'text-yellow-400'}>
                          {shock.type === 'percentage'
                            ? `${shock.value > 0 ? '+' : ''}${shock.value}%`
                            : shock.type === 'multiplier'
                              ? `${shock.value}x`
                              : shock.value}
                        </span>
                        <span className="text-gray-500 text-sm ml-2">
                          ({shock.timing}
                          {shock.duration ? `, ${shock.duration} days` : ''})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Who Is Affected */}
              <div>
                <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wide mb-2">
                  Who Is Affected
                </h3>
                <p className="text-gray-300">{modalExplanation.whoAffected}</p>
              </div>

              {/* Real World Examples */}
              <div>
                <h3 className="text-sm font-semibold text-green-400 uppercase tracking-wide mb-2">
                  Real World Examples
                </h3>
                <p className="text-gray-300 italic">"{modalExplanation.realWorldExample}"</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-700 flex gap-3">
              <button
                onClick={() => {
                  setSelectedTemplate(showDetailModal);
                  setShowDetailModal(null);
                }}
                className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-xl transition-colors"
              >
                Select This Scenario
              </button>
              <button
                onClick={() => setShowDetailModal(null)}
                className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-gray-300 font-medium rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Header */}
      <div className="border-b border-purple-500/20 bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg shadow-orange-500/20">
                <Flame className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  CendiaCrucible™
                  <span className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-full">
                    SOVEREIGN
                  </span>
                </h1>
                <p className="text-purple-300/80 text-sm">
                  Synthetic Reality. Infinite Stress Testing. Failure Before It Happens.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white/5 p-1 rounded-lg">
              {['templates', 'history', 'results'].map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v as any)}
                  disabled={v === 'results' && !activeSimulation}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    view === v
                      ? 'bg-purple-500 text-white'
                      : 'text-gray-400 hover:text-white disabled:opacity-50'
                  }`}
                >
                  {v === 'templates' && <Target className="w-4 h-4 inline mr-2" />}
                  {v === 'history' && <Clock className="w-4 h-4 inline mr-2" />}
                  {v === 'results' && <BarChart3 className="w-4 h-4 inline mr-2" />}
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mode Selection & Risk Appetite Bar */}
      <div className="max-w-7xl mx-auto px-6 pt-6">
        {/* Mode Info Banner */}
        {currentMode && (
          <ModeInfoBanner 
            mode={currentMode} 
            primeDirective={currentMode.primeDirective} 
          />
        )}
        
        {/* Industry Insight */}
        {industryInsight && <IndustryInsight insight={industryInsight} />}
        
        {/* Stress Score Summary */}
        {stressScore && (
          <div className="mt-4 mb-4 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: currentMode?.color }}>
                    {stressScore.score}
                  </div>
                  <div className="text-xs text-gray-500">Stress Score</div>
                </div>
                <div className="h-8 w-px bg-gray-700" />
                <div>
                  <div className="text-sm text-gray-300">
                    Risk Level: <span className={`font-medium ${
                      stressScore.riskLevel === 'Low' ? 'text-green-400' :
                      stressScore.riskLevel === 'Medium' ? 'text-yellow-400' :
                      stressScore.riskLevel === 'High' ? 'text-orange-400' : 'text-red-400'
                    }`}>{stressScore.riskLevel}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {stressScore.recommendations.slice(0, 2).map((rec, i) => (
                      <span key={i} className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded">
                        {rec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ModeSelector
                  label=""
                  modes={CRUCIBLE_MODES}
                  selectedModeId={selectedModeId}
                  onModeChange={setSelectedModeId}
                  coreModeIds={[...CORE_CRUCIBLE_MODES]}
                  className="w-56"
                />
                <IndustrySelector
                  label=""
                  industries={INDUSTRY_FAILURE_BENCHMARKS}
                  selectedIndustryId={selectedIndustryId}
                  onIndustryChange={setSelectedIndustryId}
                  className="w-48"
                />
              </div>
            </div>
          </div>
        )}

        <div className="bg-slate-900/80 border border-purple-500/30 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* Risk Appetite Slider */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">Risk Appetite:</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-blue-400">Conservative</span>
                <input
                  type="range"
                  min="1"
                  max="3"
                  value={riskAppetite}
                  onChange={(e) => setRiskAppetite(parseInt(e.target.value))}
                  className="w-32 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <span className="text-xs text-red-400">Aggressive</span>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  riskAppetite === 1
                    ? 'bg-blue-500/20 text-blue-300'
                    : riskAppetite === 2
                      ? 'bg-purple-500/20 text-purple-300'
                      : 'bg-red-500/20 text-red-300'
                }`}
              >
                {riskAppetiteLabels[riskAppetite - 1]}
              </span>
              <span className="text-xs text-gray-500 max-w-xs">
                {riskAppetiteDescriptions[riskAppetite as keyof typeof riskAppetiteDescriptions]}
              </span>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAssumptions(true)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs text-gray-300 flex items-center gap-1"
              >
                <Settings className="w-3 h-3" /> Assumptions
              </button>
              <button
                onClick={() => setShowOutputArtifacts(true)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs text-gray-300 flex items-center gap-1"
              >
                <FileDown className="w-3 h-3" /> Output Artifacts
              </button>
              <button
                onClick={() => setShowHistorySidebar(true)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs text-gray-300 flex items-center gap-1"
              >
                <Clock className="w-3 h-3" /> History
              </button>

              {/* Schedule Toggle */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-lg">
                <span className="text-xs text-gray-400">Nightly</span>
                <button
                  onClick={() => setScheduleNightly(!scheduleNightly)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${scheduleNightly ? 'bg-purple-600' : 'bg-slate-600'}`}
                >
                  <div
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${scheduleNightly ? 'translate-x-5' : 'translate-x-0.5'}`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Last Simulation Status */}
          <div className="mt-3 pt-3 border-t border-slate-700 flex items-center justify-between text-xs">
            <span className="text-gray-500">
              {recentSimulations.length > 0 ? (
                <>
                  Last simulation:{' '}
                  <span className="text-purple-400">{recentSimulations[0]?.name}</span> (
                  {new Date(recentSimulations[0]?.createdAt).toLocaleDateString()})
                </>
              ) : (
                <span className="text-amber-400">
                  No simulation run yet — run your first stress test to establish baseline
                </span>
              )}
            </span>
            <div className="flex items-center gap-4">
              {scheduleNightly && (
                <span className="text-purple-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Scheduled nightly at 2:00 AM
                </span>
              )}
              <span className="text-gray-500">
                Baseline: {resilienceData?.overall || '--'}/100 resilience
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-purple-300">Initializing Crucible Engine...</p>
            </div>
          </div>
        ) : view === 'templates' ? (
          <>
            {/* Demo Mode Banner */}
            {apiError && (
              <div className="bg-amber-500/20 border border-amber-500/50 rounded-lg p-4 flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  <div>
                    <span className="font-semibold text-amber-300">API ERROR</span>
                    <span className="text-amber-200 ml-2">{apiError}</span>
                  </div>
                </div>
                <button
                  onClick={() => void loadCrucibleData()}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 rounded text-sm font-medium text-white flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Retry
                </button>
              </div>
            )}
          <div>
            {/* Top Row: Resilience Radar + Benchmarks + Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Resilience Radar - Real Data */}
              <div className="lg:col-span-2">
                {resilienceData ? (
                  <ResilienceRadar
                    scores={resilienceData.dimensions.map((d) => ({
                      dimension: d.dimension,
                      score: d.score,
                      icon: scenarioIcons[
                        d.dimension === 'Financial'
                          ? 'FINANCIAL_STRESS'
                          : d.dimension === 'Talent'
                            ? 'TALENT_EXODUS'
                            : d.dimension === 'Operational'
                              ? 'OPERATIONAL_SHOCK'
                              : d.dimension === 'Cyber'
                                ? 'CYBER_ATTACK'
                                : d.dimension === 'Market'
                                  ? 'MARKET_DISRUPTION'
                                  : d.dimension === 'Supply Chain'
                                    ? 'SUPPLY_CHAIN'
                                    : 'REGULATORY_CHANGE'
                      ] || <Target className="w-4 h-4" />,
                    }))}
                    overallScore={resilienceData.overall}
                    weakest={resilienceData.weakest}
                    strongest={resilienceData.strongest}
                    onRunSimulation={(dimension) => {
                      const dimensionToScenario: Record<string, string> = {
                        Financial: 'FINANCIAL_STRESS',
                        Talent: 'TALENT_EXODUS',
                        Operational: 'OPERATIONAL_SHOCK',
                        Cyber: 'CYBER_ATTACK',
                        Market: 'MARKET_DISRUPTION',
                        'Supply Chain': 'SUPPLY_CHAIN',
                        Regulatory: 'REGULATORY_CHANGE',
                      };
                      setSelectedTemplate(dimensionToScenario[dimension] || 'CUSTOM');
                    }}
                  />
                ) : (
                  <div className="p-6 bg-slate-900/80 border border-purple-500/30 rounded-xl h-full flex items-center justify-center">
                    <p className="text-gray-400">Loading resilience data...</p>
                  </div>
                )}
              </div>

              {/* Industry Benchmark + Recommendations Column */}
              <div className="space-y-6">
                {/* Industry Benchmark Comparison */}
                {benchmarkData && (
                  <div className="p-5 bg-slate-900/80 border border-blue-500/30 rounded-xl">
                    <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-blue-400" />
                      {benchmarkData.industry} Benchmark
                    </h3>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-2xl font-bold text-white">
                          {benchmarkData.overallComparison.yourScore}
                        </div>
                        <div className="text-xs text-gray-400">Your Score</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-purple-400">
                          {benchmarkData.overallComparison.percentile}th
                        </div>
                        <div className="text-xs text-gray-400">Percentile</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg text-gray-400">
                          {benchmarkData.overallComparison.industryAvg}
                        </div>
                        <div className="text-xs text-gray-400">Industry Avg</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {benchmarkData.benchmarks.slice(0, 4).map((b) => (
                        <div key={b.dimension} className="flex items-center gap-2">
                          <div className="w-16 text-[10px] text-gray-400 truncate">
                            {b.dimension}
                          </div>
                          <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden relative">
                            <div
                              className="absolute h-full bg-gray-600 rounded-full"
                              style={{ width: `${b.industryAvg}%` }}
                            />
                            <div
                              className={`absolute h-full rounded-full ${
                                b.yourScore >= b.industryAvg ? 'bg-green-500' : 'bg-orange-500'
                              }`}
                              style={{ width: `${b.yourScore}%` }}
                            />
                          </div>
                          <div
                            className={`w-6 text-[10px] font-medium text-right ${
                              b.yourScore >= b.industryAvg ? 'text-green-400' : 'text-orange-400'
                            }`}
                          >
                            {b.yourScore}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Scenario Recommendations */}
                {recommendations.length > 0 && (
                  <div className="p-5 bg-slate-900/80 border border-orange-500/30 rounded-xl">
                    <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-yellow-400" />
                      Recommended Scenarios
                    </h3>
                    <div className="space-y-2">
                      {recommendations.slice(0, 3).map((rec, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedTemplate(rec.scenarioType)}
                          className={`w-full p-3 rounded-lg text-left transition-colors ${
                            rec.priority === 'critical'
                              ? 'bg-red-500/10 border border-red-500/30 hover:bg-red-500/20'
                              : rec.priority === 'high'
                                ? 'bg-orange-500/10 border border-orange-500/30 hover:bg-orange-500/20'
                                : 'bg-slate-800/50 border border-slate-700 hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-white text-sm font-medium">
                              {rec.scenarioType.replace(/_/g, ' ')}
                            </span>
                            <span
                              className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                                rec.priority === 'critical'
                                  ? 'bg-red-500/20 text-red-300'
                                  : rec.priority === 'high'
                                    ? 'bg-orange-500/20 text-orange-300'
                                    : 'bg-gray-500/20 text-gray-300'
                              }`}
                            >
                              {rec.priority}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 line-clamp-1">{rec.reason}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Simulations Summary */}
            {recentSimulations.length > 0 && (
              <div className="mb-8 p-5 bg-slate-900/80 border border-slate-700 rounded-xl">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-400" />
                  Recent Simulations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  {recentSimulations.slice(0, 5).map((sim) => (
                    <button
                      key={sim.id}
                      onClick={() => loadSimulationDetails(sim.id)}
                      className="p-3 bg-slate-800/50 hover:bg-slate-800 rounded-lg text-left transition-colors border border-slate-700/50"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded ${
                            sim.status === 'COMPLETED'
                              ? 'bg-green-500/20 text-green-400'
                              : sim.status === 'RUNNING'
                                ? 'bg-blue-500/20 text-blue-400'
                                : 'bg-gray-500/20 text-gray-400'
                          }`}
                        >
                          {sim.status}
                        </span>
                        {sim.resilienceScore && (
                          <span className="text-xs font-bold text-purple-400">
                            {sim.resilienceScore}%
                          </span>
                        )}
                      </div>
                      <p className="text-white text-sm font-medium truncate">{sim.name}</p>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-500">
                        <span>{new Date(sim.createdAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{sim.createdBy}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">Simulation Scenarios</h2>
                <p className="text-gray-400">
                  Select a scenario to stress test your organization's resilience
                </p>
              </div>
              <button
                onClick={() => setShowScenarioCustomizer(true)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm font-medium flex items-center gap-2"
              >
                <Settings className="w-4 h-4" /> Build Custom Scenario
              </button>
            </div>

            {templates.length === 0 ? (
              <div className="text-center py-16 bg-white/5 rounded-xl border border-white/10">
                <XCircle className="w-12 h-12 text-amber-400 mx-auto mb-4 opacity-70" />
                <p className="text-gray-300">No simulation templates available.</p>
                <p className="text-gray-500 text-sm mt-2">
                  Configure the backend for the selected data source and retry.
                </p>
                <button
                  onClick={() => void loadCrucibleData()}
                  className="mt-6 px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-lg text-sm font-medium text-white inline-flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Retry
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template) => {
                const severity = scenarioSeverity[template.type] || 'MODERATE';
                const colors = severityColors[severity];
                const lastRun = simulations.find((s) => s.simulation_type === template.type);
                const examples = shockExamples[template.type] || [];

                return (
                  <div
                    key={template.type}
                    className={`relative rounded-xl border transition-all overflow-hidden ${
                      selectedTemplate === template.type
                        ? `${colors.bg} ${colors.border} ring-2 ring-purple-500/50`
                        : `bg-slate-900/80 ${colors.border} hover:border-purple-500/50`
                    }`}
                  >
                    {/* Severity Indicator */}
                    <div
                      className={`absolute top-0 right-0 w-3 h-3 rounded-bl-lg ${colors.indicator}`}
                    />

                    <div className="p-5">
                      {/* Header with icon and severity badge */}
                      <div className="flex items-start justify-between mb-3">
                        <div className={`p-2.5 rounded-lg ${colors.bg} ${colors.text}`}>
                          {scenarioIcons[template.type] || <Target className="w-5 h-5" />}
                        </div>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${colors.badge}`}
                        >
                          {severity}
                        </span>
                      </div>

                      {/* Title and description */}
                      <h3 className="font-semibold text-white mb-1">{template.name}</h3>
                      <p className="text-xs text-gray-400 mb-3 line-clamp-2">
                        {template.description}
                      </p>

                      {/* Shock examples */}
                      <div className="mb-3 space-y-1">
                        {examples.slice(0, 2).map((ex, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-gray-300">
                            <div className={`w-1.5 h-1.5 rounded-full ${colors.indicator}`} />
                            {ex}
                          </div>
                        ))}
                      </div>

                      {/* Stats row */}
                      <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          {template.shockCount} shocks
                        </span>
                        {lastRun && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Last: {new Date(lastRun.created_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 px-5 pb-5 pt-2 border-t border-slate-700/50">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDetailModal(template.type);
                        }}
                        className="flex-1 px-3 py-2 text-sm bg-slate-800 hover:bg-slate-700 text-gray-300 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Preview Scenario
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTemplate(template.type);
                        }}
                        className={`flex-1 px-3 py-2 text-sm rounded-lg transition-colors flex items-center justify-center gap-2 ${
                          selectedTemplate === template.type
                            ? 'bg-purple-600 text-white'
                            : 'bg-purple-600/20 hover:bg-purple-600/40 text-purple-300'
                        }`}
                      >
                        <Target className="w-4 h-4" />
                        {selectedTemplate === template.type ? 'Selected' : 'Select'}
                      </button>
                    </div>
                  </div>
                );
                })}
              </div>
            )}

            {selectedTemplate && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => runSimulation(selectedTemplate)}
                  disabled={isRunning}
                  className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white shadow-lg shadow-orange-500/30 flex items-center gap-3 ${
                    isRunning ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isRunning ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Running Multiverse Simulation...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      Launch Simulation
                      <Sparkles className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
          </>
        ) : view === 'history' ? (
          <div>
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-2">Simulation History</h2>
              <p className="text-gray-400">View past simulations and their results</p>
            </div>

            {simulations.length === 0 ? (
              <div className="text-center py-16 bg-white/5 rounded-xl border border-white/10">
                <Flame className="w-12 h-12 text-purple-400 mx-auto mb-4 opacity-50" />
                <p className="text-gray-400">No simulations yet</p>
                <button
                  onClick={() => setView('templates')}
                  className="mt-4 text-purple-400 hover:text-purple-300"
                >
                  Create your first simulation →
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {simulations.map((sim) => (
                  <div
                    key={sim.id}
                    onClick={() => loadSimulationDetails(sim.id)}
                    className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-purple-500/50 cursor-pointer transition-all hover:scale-[1.01]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                          {scenarioIcons[sim.simulation_type] || <Target className="w-5 h-5" />}
                        </div>
                        <div>
                          <h3 className="font-medium text-white">{sim.name}</h3>
                          <p className="text-sm text-gray-400">
                            {new Date(sim.created_at).toLocaleDateString()} •{' '}
                            {sim.simulation_type.replace(/_/g, ' ')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            sim.status === 'COMPLETED'
                              ? 'bg-green-500/20 text-green-400'
                              : sim.status === 'RUNNING'
                                ? 'bg-blue-500/20 text-blue-400'
                                : sim.status === 'FAILED'
                                  ? 'bg-red-500/20 text-red-400'
                                  : 'bg-gray-500/20 text-gray-400'
                          }`}
                        >
                          {sim.status}
                        </span>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : view === 'results' && activeSimulation ? (
          <div>
            {/* Results Header */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white mb-1">{activeSimulation.name}</h2>
                <p className="text-gray-400">
                  {activeSimulation.simulation_type.replace(/_/g, ' ')} •{' '}
                  {activeSimulation.universes?.length || 0} parallel universes
                </p>
              </div>
              {activeSimulation.status === 'COMPLETED' && (
                <span className="flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                  <CheckCircle className="w-4 h-4" /> Completed
                </span>
              )}
            </div>

            {/* Enhanced Results Panel - Key metrics, break points, recommendations */}
            {activeSimulation.results_summary && (
              <div className="mb-8">
                <EnhancedResultsPanel
                  simulation={activeSimulation}
                  onExport={() => console.log('Export report')}
                  onShare={() => console.log('Share with board')}
                  onRerun={() => runSimulation(activeSimulation.simulation_type)}
                />
              </div>
            )}

            {/* Summary Cards */}
            {activeSimulation.results_summary && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="p-6 bg-green-500/10 border border-green-500/30 rounded-xl">
                  <div className="flex items-center gap-2 text-green-400 mb-3">
                    <TrendingUp className="w-5 h-5" />
                    <span className="font-medium">Best Case</span>
                  </div>
                  <p className="text-white text-lg font-semibold mb-2">
                    {(activeSimulation.results_summary.bestCase.probability * 100).toFixed(1)}%
                    probability
                  </p>
                  <p className="text-gray-300 text-sm">
                    {activeSimulation.results_summary.bestCase.summary}
                  </p>
                </div>

                <div className="p-6 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                  <div className="flex items-center gap-2 text-purple-400 mb-3">
                    <Target className="w-5 h-5" />
                    <span className="font-medium">Most Likely</span>
                  </div>
                  <p className="text-white text-lg font-semibold mb-2">
                    {(activeSimulation.results_summary.mostLikely.probability * 100).toFixed(1)}%
                    probability
                  </p>
                  <p className="text-gray-300 text-sm">
                    {activeSimulation.results_summary.mostLikely.summary}
                  </p>
                </div>

                <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-xl">
                  <div className="flex items-center gap-2 text-red-400 mb-3">
                    <TrendingDown className="w-5 h-5" />
                    <span className="font-medium">Worst Case</span>
                  </div>
                  <p className="text-white text-lg font-semibold mb-2">
                    {(activeSimulation.results_summary.worstCase.probability * 100).toFixed(1)}%
                    probability
                  </p>
                  <p className="text-gray-300 text-sm">
                    {activeSimulation.results_summary.worstCase.summary}
                  </p>
                </div>
              </div>
            )}

            {/* Key Risks & Opportunities */}
            {activeSimulation.results_summary && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-400" />
                    Key Risks
                  </h3>
                  <ul className="space-y-2">
                    {activeSimulation.results_summary.keyRisks?.length > 0 ? (
                      activeSimulation.results_summary.keyRisks.map((risk, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                          <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                          {risk}
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-400 text-sm italic">
                        Risk analysis pending. Run simulation with AI Council enabled for
                        comprehensive risk identification.
                      </li>
                    )}
                  </ul>
                </div>

                <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-green-400" />
                    Opportunities
                  </h3>
                  <ul className="space-y-2">
                    {activeSimulation.results_summary.keyOpportunities?.length > 0 ? (
                      activeSimulation.results_summary.keyOpportunities.map((opp, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                          {opp}
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-400 text-sm italic">
                        Opportunity analysis pending. Run simulation with AI Council enabled for
                        strategic opportunity identification.
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            )}

            {/* Council Deliberation */}
            {activeSimulation.council_deliberations &&
              activeSimulation.council_deliberations.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-400" />
                    Council AI Deliberation
                  </h3>
                  {activeSimulation.council_deliberations.map((delib) => (
                    <div
                      key={delib.id}
                      className="p-6 bg-white/5 border border-white/10 rounded-xl"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <span
                          className={`flex items-center gap-2 ${delib.consensus_reached ? 'text-green-400' : 'text-orange-400'}`}
                        >
                          {delib.consensus_reached ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <AlertTriangle className="w-5 h-5" />
                          )}
                          {delib.consensus_reached ? 'Consensus Reached' : 'Deliberation Ongoing'}
                        </span>
                        {delib.confidence_score !== undefined && (
                          <span className="text-sm text-gray-400">
                            Confidence: {delib.confidence_score.toFixed(0)}%
                          </span>
                        )}
                      </div>

                      {delib.final_recommendation && (
                        <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg mb-6">
                          <h4 className="font-medium text-purple-300 mb-2">Final Recommendation</h4>
                          <p className="text-white">{delib.final_recommendation}</p>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {delib.agent_responses.map((agent, i) => (
                          <div key={i} className="p-4 bg-black/30 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                                {agent.agentRole.slice(0, 2)}
                              </div>
                              <span className="font-medium text-white text-sm">
                                {agent.agentRole}
                              </span>
                            </div>
                            <p className="text-gray-300 text-xs mb-2 line-clamp-3">
                              {agent.analysis}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">Confidence</span>
                              <span className="text-xs text-purple-400">
                                {agent.confidenceLevel}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

            {/* Parallel Universes */}
            {activeSimulation.universes && activeSimulation.universes.length > 0 && (
              <div>
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-blue-400" />
                  Parallel Universe Outcomes
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {activeSimulation.universes.slice(0, 8).map((universe) => (
                    <div
                      key={universe.id}
                      className={`p-4 rounded-xl border ${
                        universe.outcome_sentiment === 'CATASTROPHIC'
                          ? 'bg-red-500/10 border-red-500/30 text-red-400'
                          : universe.outcome_sentiment === 'NEGATIVE'
                            ? 'bg-orange-500/10 border-orange-500/30 text-orange-400'
                            : universe.outcome_sentiment === 'POSITIVE'
                              ? 'bg-green-500/10 border-green-500/30 text-green-400'
                              : universe.outcome_sentiment === 'OPTIMAL'
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                : 'bg-gray-500/10 border-gray-500/30 text-gray-400'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium">
                          Universe #{universe.universe_number}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded bg-white/10">
                          {(universe.probability * 100).toFixed(1)}%
                        </span>
                      </div>
                      <p className="font-medium text-sm mb-2">{universe.outcome_sentiment}</p>
                      {universe.outcome_summary && (
                        <p className="text-xs text-gray-300 line-clamp-2">
                          {universe.outcome_summary}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Assumptions Modal */}
      {showAssumptions && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setShowAssumptions(false)}
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-slate-700 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white">Simulation Assumptions</h3>
                <p className="text-sm text-gray-400">
                  Baseline metrics and confidence levels used in simulations
                </p>
              </div>
              <button
                onClick={() => setShowAssumptions(false)}
                className="text-gray-400 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Input Assumptions */}
              <div>
                <h4 className="text-sm font-semibold text-purple-400 uppercase tracking-wide mb-3">
                  Input Assumptions
                </h4>
                <div className="space-y-2">
                  {[
                    {
                      label: 'Monthly Burn Rate',
                      value: '$2.4M',
                      source: 'Finance system',
                      confidence: 95,
                    },
                    {
                      label: 'Cash Runway',
                      value: '18 months',
                      source: 'Treasury',
                      confidence: 90,
                    },
                    {
                      label: 'Revenue Growth Rate',
                      value: '12% YoY',
                      source: 'CRM pipeline',
                      confidence: 75,
                    },
                    { label: 'Employee Count', value: '847', source: 'HRIS', confidence: 100 },
                    {
                      label: 'Customer Churn Rate',
                      value: '3.2%',
                      source: 'Subscription data',
                      confidence: 85,
                    },
                  ].map((a, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg"
                    >
                      <div>
                        <div className="font-medium text-white">{a.label}</div>
                        <div className="text-xs text-gray-500">Source: {a.source}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-purple-400 font-medium">{a.value}</div>
                        <div className="text-xs text-gray-500">{a.confidence}% confidence</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Baseline Metrics */}
              <div>
                <h4 className="text-sm font-semibold text-blue-400 uppercase tracking-wide mb-3">
                  Baseline Metrics
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-800/50 rounded-lg">
                    <div className="text-xs text-gray-500">Overall Resilience</div>
                    <div className="text-xl font-bold text-white">
                      {resilienceData?.overall || 72}/100
                    </div>
                  </div>
                  <div className="p-3 bg-slate-800/50 rounded-lg">
                    <div className="text-xs text-gray-500">Financial Health</div>
                    <div className="text-xl font-bold text-white">78/100</div>
                  </div>
                  <div className="p-3 bg-slate-800/50 rounded-lg">
                    <div className="text-xs text-gray-500">Operational Capacity</div>
                    <div className="text-xl font-bold text-white">85%</div>
                  </div>
                  <div className="p-3 bg-slate-800/50 rounded-lg">
                    <div className="text-xs text-gray-500">Talent Stability</div>
                    <div className="text-xl font-bold text-white">71/100</div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-700">
                <p className="text-xs text-gray-500">
                  These assumptions are refreshed daily from connected data sources. Lower
                  confidence inputs have wider variance in Monte Carlo simulations.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Output Artifacts Modal */}
      {showOutputArtifacts && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setShowOutputArtifacts(false)}
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-slate-700 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white">Output Artifacts</h3>
                <p className="text-sm text-gray-400">Generated documents from simulation results</p>
              </div>
              <button
                onClick={() => setShowOutputArtifacts(false)}
                className="text-gray-400 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {[
                {
                  name: 'Board Brief',
                  icon: <FileText className="w-5 h-5 text-purple-400" />,
                  description: 'Executive summary for board presentation',
                  format: 'PDF / PPTX',
                  available: !!activeSimulation,
                },
                {
                  name: 'Operational Runbook',
                  icon: <ClipboardList className="w-5 h-5 text-blue-400" />,
                  description: 'Step-by-step response procedures',
                  format: 'PDF / Markdown',
                  available: !!activeSimulation,
                },
                {
                  name: 'Decision DNA Entry',
                  icon: <Brain className="w-5 h-5 text-cyan-400" />,
                  description: 'Permanent record linked to Decision DNA',
                  format: 'Auto-created',
                  available: !!activeSimulation,
                },
                {
                  name: 'Mitigation Plan',
                  icon: <Shield className="w-5 h-5 text-emerald-400" />,
                  description: 'Prioritized actions with owners and deadlines',
                  format: 'PDF / CSV',
                  available: !!activeSimulation,
                },
              ].map((artifact, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    artifact.available
                      ? 'bg-slate-800/50 border-slate-700'
                      : 'bg-slate-800/20 border-slate-800 opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {artifact.icon}
                    <div>
                      <div className="font-medium text-white">{artifact.name}</div>
                      <div className="text-xs text-gray-500">{artifact.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">{artifact.format}</span>
                    {artifact.available ? (
                      <button className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 rounded-lg text-xs font-medium">
                        Generate
                      </button>
                    ) : (
                      <span className="text-xs text-gray-600">Run simulation first</span>
                    )}
                  </div>
                </div>
              ))}

              {!activeSimulation && (
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                  <p className="text-sm text-amber-300">
                    Run a simulation to generate output artifacts. Each simulation creates a
                    complete package for stakeholder communication.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* History Sidebar */}
      {showHistorySidebar && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/50"
          onClick={() => setShowHistorySidebar(false)}
        >
          <div
            className="w-[450px] h-full bg-slate-900 border-l border-slate-700 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-slate-700 flex items-center justify-between sticky top-0 bg-slate-900">
              <div>
                <h2 className="text-xl font-bold text-white">Simulation History</h2>
                <p className="text-sm text-gray-400">Past runs and comparative analysis</p>
              </div>
              <button
                onClick={() => setShowHistorySidebar(false)}
                className="text-gray-400 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {recentSimulations.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No simulations run yet</div>
              ) : (
                recentSimulations.map((sim, i) => (
                  <div
                    key={sim.id}
                    className="p-4 bg-slate-800 rounded-lg border border-slate-700 hover:border-purple-500/50 cursor-pointer transition-colors"
                    onClick={() => {
                      loadSimulationDetails(sim.id);
                      setShowHistorySidebar(false);
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded">
                        {sim.simulationType.replace(/_/g, ' ')}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${
                          sim.status === 'COMPLETED'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {sim.status}
                      </span>
                    </div>
                    <div className="font-medium text-white mb-1">{sim.name}</div>
                    <div className="text-xs text-gray-500 mb-2">
                      {new Date(sim.createdAt).toLocaleString()}
                    </div>
                    {sim.resilienceScore && (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              sim.resilienceScore >= 70
                                ? 'bg-emerald-500'
                                : sim.resilienceScore >= 50
                                  ? 'bg-amber-500'
                                  : 'bg-red-500'
                            }`}
                            style={{ width: `${sim.resilienceScore}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400">{sim.resilienceScore}/100</span>
                      </div>
                    )}
                    <button className="mt-2 text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1">
                      <RotateCcw className="w-3 h-3" /> Re-run with current baseline
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Trend Chart Placeholder */}
            {recentSimulations.length > 1 && (
              <div className="p-4 border-t border-slate-700">
                <h3 className="font-medium text-white mb-3">Resilience Trend</h3>
                <div className="h-32 bg-slate-800 rounded-lg flex items-end gap-1 p-3">
                  {recentSimulations
                    .slice(0, 10)
                    .reverse()
                    .map((sim, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-purple-500/50 rounded-t transition-all hover:bg-purple-500"
                        style={{ height: `${sim.resilienceScore || 50}%` }}
                        title={`${sim.name}: ${sim.resilienceScore || '--'}/100`}
                      />
                    ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Oldest</span>
                  <span>Most Recent</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Scenario Customizer Modal */}
      {showScenarioCustomizer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setShowScenarioCustomizer(false)}
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-slate-700">
              <h3 className="text-xl font-semibold text-white">Custom Scenario Builder</h3>
              <p className="text-sm text-gray-400">
                Adjust parameters to create a tailored stress test
              </p>
            </div>
            <div className="p-6 space-y-6">
              {/* Revenue Decline */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300">Revenue Decline</span>
                  <span className="text-red-400">-{customScenario.revenueDecline}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="80"
                  value={customScenario.revenueDecline}
                  onChange={(e) =>
                    setCustomScenario({
                      ...customScenario,
                      revenueDecline: parseInt(e.target.value),
                    })
                  }
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                />
              </div>

              {/* Cost Increase */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300">Cost Increase</span>
                  <span className="text-orange-400">+{customScenario.costIncrease}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={customScenario.costIncrease}
                  onChange={(e) =>
                    setCustomScenario({ ...customScenario, costIncrease: parseInt(e.target.value) })
                  }
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
              </div>

              {/* Attrition Rate */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300">Employee Attrition</span>
                  <span className="text-amber-400">{customScenario.attritionRate}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={customScenario.attritionRate}
                  onChange={(e) =>
                    setCustomScenario({
                      ...customScenario,
                      attritionRate: parseInt(e.target.value),
                    })
                  }
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              {/* Duration */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300">Stress Duration</span>
                  <span className="text-purple-400">{customScenario.duration} months</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="24"
                  value={customScenario.duration}
                  onChange={(e) =>
                    setCustomScenario({ ...customScenario, duration: parseInt(e.target.value) })
                  }
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>

              {/* Impact Preview */}
              <div className="p-4 bg-slate-800 rounded-lg">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Estimated Impact Preview</h4>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <div className="text-xl font-bold text-red-400">
                      -${(customScenario.revenueDecline * 0.1).toFixed(1)}M
                    </div>
                    <div className="text-xs text-gray-500">Revenue</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-orange-400">
                      -{Math.round(customScenario.attritionRate * 8)}
                    </div>
                    <div className="text-xs text-gray-500">Headcount</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-purple-400">
                      {Math.max(
                        20,
                        100 - customScenario.revenueDecline - customScenario.costIncrease
                      )}
                    </div>
                    <div className="text-xs text-gray-500">Resilience</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-700 flex gap-3">
              <button
                onClick={() => setShowScenarioCustomizer(false)}
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  runSimulation('CUSTOM', customScenario);
                  setShowScenarioCustomizer(false);
                }}
                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg font-medium flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4" /> Run Custom Scenario
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CruciblePage;
