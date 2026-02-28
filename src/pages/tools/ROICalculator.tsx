// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA ROI CALCULATOR - Enterprise Sales Tool
// =============================================================================

import React, { useState, useMemo } from 'react';
import {
  Calculator,
  TrendingUp,
  DollarSign,
  Clock,
  Shield,
  Users,
  AlertTriangle,
  Download,
  Share2,
  ChevronRight,
} from 'lucide-react';
import { cn } from '../../../lib/utils';

// Industry benchmarks for ROI calculations
const BENCHMARKS = {
  decision_meeting_hours_per_week: 12,
  average_hourly_cost_executive: 250,
  compliance_audit_hours_per_year: 800,
  compliance_hourly_cost: 150,
  shadow_ai_incidents_per_year: 24,
  shadow_ai_cost_per_incident: 15000,
  data_quality_issues_per_month: 35,
  data_quality_cost_per_issue: 2500,
  strategic_delays_per_year: 6,
  strategic_delay_opportunity_cost: 100000,
};

// Datacendia improvement factors
const IMPROVEMENTS = {
  decision_time_reduction: 0.73,
  compliance_time_reduction: 0.6,
  shadow_ai_elimination: 0.9,
  data_quality_improvement: 0.65,
  strategic_delay_reduction: 0.7,
};

const INDUSTRIES = [
  { id: 'financial_services', name: 'Financial Services', complianceMultiplier: 1.8 },
  { id: 'healthcare', name: 'Healthcare', complianceMultiplier: 1.6 },
  { id: 'technology', name: 'Technology', complianceMultiplier: 1.2 },
  { id: 'manufacturing', name: 'Manufacturing', complianceMultiplier: 1.3 },
  { id: 'retail', name: 'Retail', complianceMultiplier: 1.1 },
  { id: 'professional_services', name: 'Professional Services', complianceMultiplier: 1.4 },
  { id: 'energy', name: 'Energy & Utilities', complianceMultiplier: 1.5 },
  { id: 'government', name: 'Government', complianceMultiplier: 1.7 },
];

interface ROIBreakdown {
  decisionSavings: number;
  complianceSavings: number;
  shadowAISavings: number;
  dataQualitySavings: number;
  delaySavings: number;
  totalBenefit: number;
  datacendiaCost: number;
  netBenefit: number;
  roiPercentage: number;
  paybackMonths: number;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export default function ROICalculator() {
  const [employees, setEmployees] = useState(500);
  const [executives, setExecutives] = useState(25);
  const [industry, setIndustry] = useState('financial_services');
  const [currentAISpend, setCurrentAISpend] = useState(200000);
  const [complianceHeavy, setComplianceHeavy] = useState(true);

  const roi = useMemo<ROIBreakdown>(() => {
    const industryData = INDUSTRIES.find((i) => i.id === industry) || INDUSTRIES[0];

    // Decision time savings
    const weeklyMeetingHours = BENCHMARKS.decision_meeting_hours_per_week * executives;
    const annualMeetingHours = weeklyMeetingHours * 48;
    const meetingCostBefore = annualMeetingHours * BENCHMARKS.average_hourly_cost_executive;
    const meetingCostAfter = meetingCostBefore * (1 - IMPROVEMENTS.decision_time_reduction);
    const decisionSavings = meetingCostBefore - meetingCostAfter;

    // Compliance savings
    const complianceMultiplier = complianceHeavy ? industryData.complianceMultiplier : 1.0;
    const complianceHours = BENCHMARKS.compliance_audit_hours_per_year * complianceMultiplier;
    const complianceCostBefore = complianceHours * BENCHMARKS.compliance_hourly_cost;
    const complianceCostAfter = complianceCostBefore * (1 - IMPROVEMENTS.compliance_time_reduction);
    const complianceSavings = complianceCostBefore - complianceCostAfter;

    // Shadow AI risk reduction
    const shadowAICostBefore =
      BENCHMARKS.shadow_ai_incidents_per_year * BENCHMARKS.shadow_ai_cost_per_incident;
    const shadowAICostAfter = shadowAICostBefore * (1 - IMPROVEMENTS.shadow_ai_elimination);
    const shadowAISavings = shadowAICostBefore - shadowAICostAfter;

    // Data quality improvement
    const dataIssuesPerYear = BENCHMARKS.data_quality_issues_per_month * 12;
    const dataQualityCostBefore = dataIssuesPerYear * BENCHMARKS.data_quality_cost_per_issue;
    const dataQualityCostAfter =
      dataQualityCostBefore * (1 - IMPROVEMENTS.data_quality_improvement);
    const dataQualitySavings = dataQualityCostBefore - dataQualityCostAfter;

    // Strategic delay reduction
    const delaysCostBefore =
      BENCHMARKS.strategic_delays_per_year * BENCHMARKS.strategic_delay_opportunity_cost;
    const delaysCostAfter = delaysCostBefore * (1 - IMPROVEMENTS.strategic_delay_reduction);
    const delaySavings = delaysCostBefore - delaysCostAfter;

    // Total benefits
    const totalBenefit =
      decisionSavings + complianceSavings + shadowAISavings + dataQualitySavings + delaySavings;

    // Datacendia cost based on company size
    let datacendiaCost: number;
    if (employees < 200) {
      datacendiaCost = 50000;
    } else if (employees < 1000) {
      datacendiaCost = 150000;
    } else if (employees < 5000) {
      datacendiaCost = 350000;
    } else {
      datacendiaCost = 500000;
    }

    const netBenefit = totalBenefit - datacendiaCost;
    const roiPercentage = ((totalBenefit - datacendiaCost) / datacendiaCost) * 100;
    const paybackMonths = (datacendiaCost / totalBenefit) * 12;

    return {
      decisionSavings,
      complianceSavings,
      shadowAISavings,
      dataQualitySavings,
      delaySavings,
      totalBenefit,
      datacendiaCost,
      netBenefit,
      roiPercentage,
      paybackMonths,
    };
  }, [employees, executives, industry, complianceHeavy]);

  const savingsBreakdown = [
    {
      label: 'Decision Acceleration',
      value: roi.decisionSavings,
      icon: Clock,
      color: 'text-blue-400',
    },
    {
      label: 'Compliance Efficiency',
      value: roi.complianceSavings,
      icon: Shield,
      color: 'text-amber-400',
    },
    {
      label: 'Shadow AI Elimination',
      value: roi.shadowAISavings,
      icon: AlertTriangle,
      color: 'text-red-400',
    },
    {
      label: 'Data Quality Improvement',
      value: roi.dataQualitySavings,
      icon: TrendingUp,
      color: 'text-green-400',
    },
    {
      label: 'Strategic Speed',
      value: roi.delaySavings,
      icon: ChevronRight,
      color: 'text-purple-400',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <Calculator className="w-6 h-6 text-emerald-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">ROI Calculator</h1>
          </div>
          <p className="text-gray-400">
            Calculate the return on investment for Datacendia implementation
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Inputs */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h2 className="text-lg font-semibold text-white mb-6">Organization Profile</h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Total Employees
                </label>
                <input
                  type="range"
                  min="50"
                  max="10000"
                  step="50"
                  value={employees}
                  onChange={(e) => setEmployees(Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-500">50</span>
                  <span className="text-white font-medium">{employees.toLocaleString()}</span>
                  <span className="text-gray-500">10,000</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Executives & Senior Leaders
                </label>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={executives}
                  onChange={(e) => setExecutives(Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-500">5</span>
                  <span className="text-white font-medium">{executives}</span>
                  <span className="text-gray-500">100</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Industry</label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white"
                >
                  {INDUSTRIES.map((ind) => (
                    <option key={ind.id} value={ind.id}>
                      {ind.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Current AI/Analytics Spend
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="number"
                    value={currentAISpend}
                    onChange={(e) => setCurrentAISpend(Number(e.target.value))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-9 pr-4 py-2.5 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-400">
                  Heavy Compliance Requirements
                </label>
                <button
                  onClick={() => setComplianceHeavy(!complianceHeavy)}
                  className={cn(
                    'w-12 h-6 rounded-full transition-colors',
                    complianceHeavy ? 'bg-emerald-500' : 'bg-gray-700'
                  )}
                >
                  <div
                    className={cn(
                      'w-5 h-5 bg-white rounded-full transition-transform',
                      complianceHeavy ? 'translate-x-6' : 'translate-x-0.5'
                    )}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 rounded-xl p-5">
                <div className="text-sm text-emerald-400 mb-1">Annual Savings</div>
                <div className="text-2xl font-bold text-white">
                  {formatCurrency(roi.totalBenefit)}
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-xl p-5">
                <div className="text-sm text-blue-400 mb-1">ROI</div>
                <div className="text-2xl font-bold text-white">{roi.roiPercentage.toFixed(0)}%</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 rounded-xl p-5">
                <div className="text-sm text-purple-400 mb-1">Payback Period</div>
                <div className="text-2xl font-bold text-white">
                  {roi.paybackMonths.toFixed(1)} mo
                </div>
              </div>
            </div>

            {/* Breakdown */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Savings Breakdown</h3>
              <div className="space-y-4">
                {savingsBreakdown.map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className={cn('p-2 rounded-lg bg-gray-800', item.color)}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-300">{item.label}</span>
                        <span className="text-sm font-medium text-white">
                          {formatCurrency(item.value)}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                          style={{ width: `${(item.value / roi.totalBenefit) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-800">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-gray-400">Datacendia Investment</div>
                    <div className="text-lg font-semibold text-white">
                      {formatCurrency(roi.datacendiaCost)}/year
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">Net Annual Benefit</div>
                    <div className="text-lg font-semibold text-emerald-400">
                      {formatCurrency(roi.netBenefit)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors">
                <Download className="w-4 h-4" />
                Export PDF Report
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors">
                <Share2 className="w-4 h-4" />
                Share Analysis
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
