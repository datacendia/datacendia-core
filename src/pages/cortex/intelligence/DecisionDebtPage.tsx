// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA - DECISION DEBT DASHBOARD PAGE
// Track stuck decisions and their organizational cost
// =============================================================================

import React, { useState, useEffect } from 'react';
import { cn } from '../../../../lib/utils';
import {
  decisionIntelligenceService,
  DecisionDebtDashboard,
  PendingDecision,
} from '../../../services/DecisionIntelligenceService';

// Types imported from DecisionIntelligenceService

export const DecisionDebtPage: React.FC = () => {
  const [dashboard, setDashboard] = useState<DecisionDebtDashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDecision, setSelectedDecision] = useState<PendingDecision | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDecisionTitle, setNewDecisionTitle] = useState('');
  const [newDecisionDepartment, setNewDecisionDepartment] = useState('');
  const [newDecisionOwner, setNewDecisionOwner] = useState('');
  const [newDecisionCost, setNewDecisionCost] = useState('');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = () => {
    setIsLoading(true);
    try {
      // Use real Decision Intelligence Service
      const dashboardData = decisionIntelligenceService.getDecisionDebtDashboard();
      setDashboard(dashboardData);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDecision = () => {
    if (!newDecisionTitle.trim()) {
      return;
    }

    decisionIntelligenceService.createPendingDecision({
      title: newDecisionTitle,
      department: newDecisionDepartment || 'General',
      owner: newDecisionOwner || 'Unassigned',
      estimatedDailyCost: parseFloat(newDecisionCost) || 1000,
      priority: 'medium',
    });

    setNewDecisionTitle('');
    setNewDecisionDepartment('');
    setNewDecisionOwner('');
    setNewDecisionCost('');
    setShowAddModal(false);
    loadDashboard();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A':
        return 'text-green-600 bg-green-100';
      case 'B':
        return 'text-lime-600 bg-lime-100';
      case 'C':
        return 'text-yellow-600 bg-yellow-100';
      case 'D':
        return 'text-orange-600 bg-orange-100';
      case 'F':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-neutral-500">Loading Decision Debt Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">Failed to load dashboard</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">📊</span>
          <h1 className="text-3xl font-bold text-neutral-900">Decision Debt Dashboard</h1>
        </div>
        <p className="text-neutral-600 text-lg">
          See every decision that's stuck, who's blocking it, and what it's costing you per day.
        </p>
      </div>

      {/* Score and Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        {/* Debt Score */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
          <div className="text-center">
            <div
              className={cn(
                'w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-2',
                getGradeColor(dashboard.summary.debtScore.grade)
              )}
            >
              <span className="text-4xl font-bold">{dashboard.summary.debtScore.grade}</span>
            </div>
            <div className="text-lg font-semibold text-neutral-900">
              {dashboard.summary.debtScore.label}
            </div>
            <div className="text-sm text-neutral-500">Decision Debt Score</div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
          <div className="text-sm text-neutral-500 mb-1">Decisions Stuck</div>
          <div className="text-3xl font-bold text-red-600">
            {dashboard.summary.totalPendingDecisions}
          </div>
          <div className="text-sm text-neutral-500 mt-2">
            {dashboard.summary.totalBlockedDecisions} actively blocked
          </div>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
          <div className="text-sm text-neutral-500 mb-1">Average Days Stuck</div>
          <div className="text-3xl font-bold text-orange-600">
            {dashboard.summary.averageDaysStuck.toFixed(1)}
          </div>
          <div className="text-sm text-neutral-500 mt-2">days per decision</div>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
          <div className="text-sm text-neutral-500 mb-1">Daily Cost</div>
          <div className="text-3xl font-bold text-red-600">
            ${dashboard.summary.dailyCost.toLocaleString()}
          </div>
          <div className="text-sm text-neutral-500 mt-2">
            ${(dashboard.summary.annualProjectedLoss / 1000000).toFixed(1)}M/year projected
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Decisions List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">
              Pending Decisions ({dashboard.decisions.length})
            </h2>
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {dashboard.decisions.map((decision) => (
                <div
                  key={decision.id}
                  className={cn(
                    'p-4 rounded-lg border cursor-pointer transition-all',
                    selectedDecision?.id === decision.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-neutral-200 hover:border-neutral-300'
                  )}
                  onClick={() => setSelectedDecision(decision)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-medium text-neutral-900">{decision.title}</h3>
                      <p className="text-sm text-neutral-500">
                        {decision.department} • {decision.owner}
                      </p>
                    </div>
                    <span
                      className={cn(
                        'px-2 py-1 rounded text-xs font-medium border',
                        getPriorityColor(decision.priority)
                      )}
                    >
                      {decision.priority}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-orange-600 font-medium">
                      {decision.daysStuck} days stuck
                    </span>
                    <span className="text-red-600">
                      ${decision.totalCostAccrued.toLocaleString()} accrued
                    </span>
                    {decision.blockedBy.length > 0 && (
                      <span className="text-neutral-500">
                        Blocked by: {decision.blockedBy[0].name}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Critical Path */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Critical Path</h2>
            <div className="flex items-center gap-2 flex-wrap">
              {dashboard.criticalPath.map((decId, idx) => {
                const dec = dashboard.decisions.find((d) => d.id === decId);
                return (
                  <React.Fragment key={decId}>
                    <div className="px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-sm">
                      {dec?.title || decId}
                    </div>
                    {idx < dashboard.criticalPath.length - 1 && (
                      <span className="text-neutral-400">→</span>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
            <p className="mt-3 text-sm text-neutral-500">
              These decisions form a chain of dependencies. Resolving the first unblocks the rest.
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Top Blockers */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Top Blockers</h2>
            <div className="space-y-3">
              {dashboard.topBlockers.slice(0, 5).map((blocker, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-neutral-900">{blocker.blockerName}</div>
                    <div className="text-sm text-neutral-500">
                      {blocker.decisionsBlocked} decisions blocked
                    </div>
                  </div>
                  <div className="text-red-600 font-medium">
                    ${(blocker.totalCostImpact / 1000).toFixed(0)}K
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Recommendations</h2>
            <div className="space-y-4">
              {dashboard.recommendations.map((rec, idx) => (
                <div key={idx} className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="font-medium text-green-800 text-sm">{rec.title}</div>
                  <div className="text-xs text-green-700 mt-1">{rec.description}</div>
                  <div className="text-xs text-green-600 mt-2 font-medium">
                    Potential savings: ${rec.estimatedSavings.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecisionDebtPage;
