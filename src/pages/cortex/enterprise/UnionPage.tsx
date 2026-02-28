// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIA UNION™ — EMPLOYEE RIGHTS & ADVOCACY MODULE
// First AI product marketed as union-grade protection
// Digital labor rights with burnout scoring and negotiation prep
// =============================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  unionService,
  Employee,
  WorkforceMetrics,
  BurnoutLevel,
  EmployeeRequest,
  NegotiationBrief,
} from '../../../services/UnionService';

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const UnionPage: React.FC = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [metrics, setMetrics] = useState<WorkforceMetrics | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'burnout' | 'rights' | 'negotiate'>(
    'dashboard'
  );
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showNegotiationBrief, setShowNegotiationBrief] = useState<NegotiationBrief | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [ollamaStatus, setOllamaStatus] = useState(false);

  const loadData = useCallback(() => {
    setEmployees(unionService.getAllEmployees());
    setMetrics(unionService.getWorkforceMetrics());
    setOllamaStatus(unionService.isOllamaAvailable());
  }, []);

  useEffect(() => {
    loadData();
    unionService
      .refreshOllamaStatus()
      .then(() => setOllamaStatus(unionService.isOllamaAvailable()));
  }, [loadData]);

  const getBurnoutColor = (level: BurnoutLevel) => {
    const colors = {
      healthy: 'bg-green-600',
      caution: 'bg-yellow-600',
      warning: 'bg-orange-600',
      critical: 'bg-red-600',
      emergency: 'bg-red-800',
    };
    return colors[level];
  };

  const getBurnoutTextColor = (level: BurnoutLevel) => {
    const colors = {
      healthy: 'text-green-400',
      caution: 'text-yellow-400',
      warning: 'text-orange-400',
      critical: 'text-red-400',
      emergency: 'text-red-300',
    };
    return colors[level];
  };

  const handlePrepareNegotiation = async (employeeId: string, requestId: string) => {
    setIsLoading(true);
    try {
      const brief = await unionService.prepareNegotiation(employeeId, requestId);
      setShowNegotiationBrief(brief);
      loadData();
    } finally {
      setIsLoading(false);
    }
  };

  const atRiskEmployees = employees.filter(
    (e) =>
      e.burnoutLevel === 'warning' ||
      e.burnoutLevel === 'critical' ||
      e.burnoutLevel === 'emergency'
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-blue-800/50 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/cortex/dashboard')}
                className="text-white/60 hover:text-white transition-colors"
              >
                ← Back
              </button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-3">
                  <span className="text-3xl">✊</span>
                  CendiaUnion™
                  <span className="text-xs bg-gradient-to-r from-blue-500 to-cyan-500 px-2 py-0.5 rounded-full font-medium">
                    EMPLOYEE RIGHTS
                  </span>
                </h1>
                <p className="text-blue-300 text-sm">
                  Digital Labor Rights • Burnout Protection • Negotiation Prep
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${ollamaStatus ? 'bg-green-900/50' : 'bg-red-900/50'}`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${ollamaStatus ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}
                />
                <span className="text-xs">{ollamaStatus ? 'AI Coach Active' : 'AI Offline'}</span>
              </div>
              <button
                onClick={() => setShowAddEmployee(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors"
              >
                + Add Employee
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Metrics Bar */}
      {metrics && (
        <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border-b border-blue-800/30">
          <div className="max-w-7xl mx-auto px-6 py-3">
            <div className="grid grid-cols-7 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-white">{metrics.totalEmployees}</div>
                <div className="text-xs text-blue-300">Employees</div>
              </div>
              <div>
                <div
                  className={`text-2xl font-bold ${metrics.avgBurnoutScore > 60 ? 'text-red-400' : metrics.avgBurnoutScore > 40 ? 'text-amber-400' : 'text-green-400'}`}
                >
                  {metrics.avgBurnoutScore}%
                </div>
                <div className="text-xs text-blue-300">Avg Burnout</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-400">
                  {metrics.burnoutDistribution.critical + metrics.burnoutDistribution.emergency}
                </div>
                <div className="text-xs text-blue-300">At Risk</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-400">{metrics.openViolations}</div>
                <div className="text-xs text-blue-300">Open Violations</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-cyan-400">{metrics.pendingRequests}</div>
                <div className="text-xs text-blue-300">Pending Requests</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">{metrics.overtimeAverage}h</div>
                <div className="text-xs text-blue-300">Avg Overtime</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">{metrics.avgTenure}y</div>
                <div className="text-xs text-blue-300">Avg Tenure</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-blue-800/30 bg-black/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {(['dashboard', 'burnout', 'rights', 'negotiate'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'text-white border-b-2 border-blue-500'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {tab === 'negotiate'
                  ? 'Negotiation Prep'
                  : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-3 gap-6">
            {/* At Risk Employees */}
            <div className="col-span-2 bg-black/30 rounded-2xl p-6 border border-blue-800/50">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="text-red-400">⚠️</span> At-Risk Employees
              </h2>
              {atRiskEmployees.length > 0 ? (
                <div className="space-y-3">
                  {atRiskEmployees.map((emp) => (
                    <div
                      key={emp.id}
                      onClick={() => setSelectedEmployee(emp)}
                      className="p-4 bg-black/20 rounded-xl cursor-pointer hover:bg-black/30 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{emp.name}</h3>
                          <p className="text-sm text-white/60">
                            {emp.role} • {emp.department}
                          </p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`px-2 py-0.5 rounded text-xs ${getBurnoutColor(emp.burnoutLevel)}`}
                          >
                            {emp.burnoutLevel.toUpperCase()}
                          </span>
                          <div
                            className={`text-lg font-bold mt-1 ${getBurnoutTextColor(emp.burnoutLevel)}`}
                          >
                            {emp.burnoutScore}%
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {emp.burnoutFactors.slice(0, 3).map((f) => (
                          <span
                            key={f.id}
                            className="px-2 py-0.5 bg-red-900/30 rounded text-xs text-red-300"
                          >
                            {f.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-white/40">
                  No at-risk employees detected. Workforce is healthy! 🎉
                </div>
              )}
            </div>

            {/* Burnout Distribution */}
            <div className="bg-black/30 rounded-2xl p-6 border border-blue-800/50">
              <h2 className="text-lg font-bold mb-4">Burnout Distribution</h2>
              {metrics && (
                <div className="space-y-3">
                  {(
                    ['healthy', 'caution', 'warning', 'critical', 'emergency'] as BurnoutLevel[]
                  ).map((level) => (
                    <div key={level} className="flex items-center gap-3">
                      <span className={`w-3 h-3 rounded-full ${getBurnoutColor(level)}`} />
                      <span className="flex-1 text-sm capitalize">{level}</span>
                      <span className="font-bold">{metrics.burnoutDistribution[level]}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-blue-800/30">
                <h3 className="text-sm font-semibold text-white/60 mb-3">Rights Violations</h3>
                {metrics &&
                Object.entries(metrics.rightsByType).filter(([_, v]) => v.violations > 0).length >
                  0 ? (
                  <div className="space-y-2">
                    {Object.entries(metrics.rightsByType)
                      .filter(([_, v]) => v.violations > 0)
                      .map(([type, data]) => (
                        <div key={type} className="flex items-center justify-between text-sm">
                          <span className="capitalize">{type.replace(/_/g, ' ')}</span>
                          <span className="text-red-400">{data.violations} open</span>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center text-white/40 text-sm">No violations reported</div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'burnout' && (
          <div className="grid grid-cols-4 gap-4">
            {employees.map((emp) => (
              <div
                key={emp.id}
                onClick={() => setSelectedEmployee(emp)}
                className="bg-black/30 rounded-xl p-4 border border-blue-800/50 cursor-pointer hover:border-blue-500 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-sm">{emp.name}</h3>
                    <p className="text-xs text-white/50">{emp.role}</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-xs ${getBurnoutColor(emp.burnoutLevel)}`}
                  >
                    {emp.burnoutScore}%
                  </span>
                </div>

                {/* Burnout meter */}
                <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      emp.burnoutScore >= 65
                        ? 'bg-red-500'
                        : emp.burnoutScore >= 50
                          ? 'bg-orange-500'
                          : emp.burnoutScore >= 30
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                    }`}
                    style={{ width: `${emp.burnoutScore}%` }}
                  />
                </div>

                <div className="mt-3 text-xs text-white/50">
                  {emp.avgHoursPerWeek}h/week • {emp.overtimeHoursThisMonth}h OT
                </div>
              </div>
            ))}
            {employees.length === 0 && (
              <div className="col-span-4 text-center py-12 text-white/40">
                No employees added yet. Click "Add Employee" to get started.
              </div>
            )}
          </div>
        )}

        {activeTab === 'rights' && (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4 mb-6">
              {(
                [
                  'compensation',
                  'time_off',
                  'workload',
                  'safety',
                  'privacy',
                  'dignity',
                  'growth',
                  'voice',
                ] as const
              ).map((right) => (
                <div
                  key={right}
                  className="bg-black/30 rounded-xl p-4 border border-blue-800/50 text-center"
                >
                  <div className="text-2xl mb-2">
                    {right === 'compensation'
                      ? '💰'
                      : right === 'time_off'
                        ? '🏖️'
                        : right === 'workload'
                          ? '⚖️'
                          : right === 'safety'
                            ? '🛡️'
                            : right === 'privacy'
                              ? '🔒'
                              : right === 'dignity'
                                ? '🤝'
                                : right === 'growth'
                                  ? '📈'
                                  : '📢'}
                  </div>
                  <div className="font-semibold text-sm capitalize">{right.replace(/_/g, ' ')}</div>
                  <div className="text-xs text-white/50 mt-1">
                    {metrics?.rightsByType[right]?.violations || 0} violations
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-black/30 rounded-2xl p-6 border border-blue-800/50">
              <h2 className="text-lg font-bold mb-4">Recent Violations</h2>
              {employees.flatMap((e) => e.rightsViolations.map((v) => ({ ...v, employee: e })))
                .length > 0 ? (
                <div className="space-y-3">
                  {employees
                    .flatMap((e) => e.rightsViolations.map((v) => ({ ...v, employee: e })))
                    .slice(0, 10)
                    .map((v) => (
                      <div key={v.id} className="p-4 bg-black/20 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <span className="font-semibold">{v.employee.name}</span>
                            <span className="text-white/50"> • </span>
                            <span className="capitalize">{v.type.replace(/_/g, ' ')}</span>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded text-xs ${
                              v.severity === 'critical'
                                ? 'bg-red-600'
                                : v.severity === 'severe'
                                  ? 'bg-orange-600'
                                  : v.severity === 'moderate'
                                    ? 'bg-amber-600'
                                    : 'bg-gray-600'
                            }`}
                          >
                            {v.severity}
                          </span>
                        </div>
                        <p className="text-sm text-white/70">{v.description}</p>
                        <div className="flex items-center justify-between mt-2 text-xs text-white/40">
                          <span>{v.occurredAt.toLocaleDateString()}</span>
                          <span
                            className={
                              v.status === 'resolved' ? 'text-green-400' : 'text-amber-400'
                            }
                          >
                            {v.status}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8 text-white/40">
                  No violations reported. Employee rights are being respected! ✅
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'negotiate' && (
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-black/30 rounded-2xl p-6 border border-blue-800/50">
              <h2 className="text-lg font-bold mb-4">Pending Requests</h2>
              <div className="space-y-3">
                {employees
                  .flatMap((e) =>
                    e.pendingRequests
                      .filter((r) => r.status !== 'approved' && r.status !== 'denied')
                      .map((r) => ({ ...r, employee: e }))
                  )
                  .map((req) => (
                    <div key={req.id} className="p-4 bg-black/20 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{req.title}</h3>
                          <p className="text-xs text-white/50">
                            {req.employee.name} • {req.type}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded text-xs ${
                            req.priority === 'urgent'
                              ? 'bg-red-600'
                              : req.priority === 'high'
                                ? 'bg-orange-600'
                                : 'bg-blue-600'
                          }`}
                        >
                          {req.priority}
                        </span>
                      </div>
                      <p className="text-sm text-white/60 mb-3">{req.description}</p>
                      <div className="flex gap-2">
                        {!req.aiPrepared ? (
                          <button
                            onClick={() => handlePrepareNegotiation(req.employee.id, req.id)}
                            disabled={isLoading}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm disabled:opacity-50"
                          >
                            {isLoading ? 'Preparing...' : '🤖 AI Prep Negotiation'}
                          </button>
                        ) : (
                          <button
                            onClick={() => setShowNegotiationBrief(req.negotiationBrief!)}
                            className="px-3 py-1.5 bg-green-600 hover:bg-green-500 rounded-lg text-sm"
                          >
                            📋 View Brief
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                {employees.flatMap((e) => e.pendingRequests).length === 0 && (
                  <div className="text-center py-8 text-white/40">No pending requests</div>
                )}
              </div>
            </div>

            <div className="bg-black/30 rounded-2xl p-6 border border-blue-800/50">
              <h2 className="text-lg font-bold mb-4">Negotiation Tips</h2>
              <div className="space-y-4">
                <div className="p-4 bg-blue-900/30 rounded-xl">
                  <h3 className="font-semibold text-blue-300 mb-2">📊 Know Your Worth</h3>
                  <p className="text-sm text-white/70">
                    Research market rates for your role. Our AI analyzes industry data to give you
                    accurate salary ranges.
                  </p>
                </div>
                <div className="p-4 bg-blue-900/30 rounded-xl">
                  <h3 className="font-semibold text-blue-300 mb-2">📝 Document Everything</h3>
                  <p className="text-sm text-white/70">
                    Keep records of achievements, overtime, and any rights concerns. The Union
                    module tracks this automatically.
                  </p>
                </div>
                <div className="p-4 bg-blue-900/30 rounded-xl">
                  <h3 className="font-semibold text-blue-300 mb-2">⏰ Timing Matters</h3>
                  <p className="text-sm text-white/70">
                    Ask after successful projects or during budget planning. Our AI identifies
                    optimal timing.
                  </p>
                </div>
                <div className="p-4 bg-blue-900/30 rounded-xl">
                  <h3 className="font-semibold text-blue-300 mb-2">🎯 Be Specific</h3>
                  <p className="text-sm text-white/70">
                    Have a clear ask range. Our negotiation briefs provide minimum, target, and
                    stretch numbers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Employee Modal */}
      {showAddEmployee && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-slate-900 rounded-2xl p-6 w-full max-w-lg border border-blue-800/50">
            <h2 className="text-xl font-bold mb-4">Add Employee</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const formData = new FormData(form);
                unionService.addEmployee({
                  name: formData.get('name') as string,
                  email: formData.get('email') as string,
                  department: formData.get('department') as string,
                  role: formData.get('role') as string,
                  level: formData.get('level') as string,
                  startDate: new Date(formData.get('startDate') as string),
                  status: 'active',
                  salary: parseInt(formData.get('salary') as string),
                  avgHoursPerWeek: 40,
                  overtimeHoursThisMonth: 0,
                  ptoDaysRemaining: 20,
                  ptoUsedThisYear: 0,
                });
                loadData();
                setShowAddEmployee(false);
              }}
              className="space-y-4"
            >
              <input
                name="name"
                required
                placeholder="Full Name"
                className="w-full px-4 py-2 bg-black/30 border border-blue-700/50 rounded-lg"
              />
              <input
                name="email"
                type="email"
                required
                placeholder="Email"
                className="w-full px-4 py-2 bg-black/30 border border-blue-700/50 rounded-lg"
              />
              <input
                name="department"
                required
                placeholder="Department"
                className="w-full px-4 py-2 bg-black/30 border border-blue-700/50 rounded-lg"
              />
              <input
                name="role"
                required
                placeholder="Role/Title"
                className="w-full px-4 py-2 bg-black/30 border border-blue-700/50 rounded-lg"
              />
              <input
                name="level"
                required
                placeholder="Level (e.g., Senior, Lead)"
                className="w-full px-4 py-2 bg-black/30 border border-blue-700/50 rounded-lg"
              />
              <input
                name="startDate"
                type="date"
                required
                className="w-full px-4 py-2 bg-black/30 border border-blue-700/50 rounded-lg"
              />
              <input
                name="salary"
                type="number"
                required
                placeholder="Annual Salary"
                className="w-full px-4 py-2 bg-black/30 border border-blue-700/50 rounded-lg"
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddEmployee(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg"
                >
                  Add Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Negotiation Brief Modal */}
      {showNegotiationBrief && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setShowNegotiationBrief(null)}
        >
          <div
            className="bg-slate-900 rounded-2xl p-6 w-full max-w-3xl border border-blue-800/50 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">🎯 Negotiation Brief</h2>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-black/30 rounded-xl text-center">
                <div className="text-sm text-white/50">Minimum</div>
                <div className="text-2xl font-bold text-amber-400">
                  ${showNegotiationBrief.askRange.minimum.toLocaleString()}
                </div>
              </div>
              <div className="p-4 bg-blue-900/50 rounded-xl text-center border border-blue-500">
                <div className="text-sm text-white/50">Target</div>
                <div className="text-2xl font-bold text-green-400">
                  ${showNegotiationBrief.askRange.target.toLocaleString()}
                </div>
              </div>
              <div className="p-4 bg-black/30 rounded-xl text-center">
                <div className="text-sm text-white/50">Stretch</div>
                <div className="text-2xl font-bold text-purple-400">
                  ${showNegotiationBrief.askRange.stretch.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">📊 Market Position</h3>
                <div className="p-3 bg-black/30 rounded-lg">
                  <p className="text-sm">
                    You are{' '}
                    <span
                      className={
                        showNegotiationBrief.marketPosition === 'below'
                          ? 'text-red-400 font-bold'
                          : 'text-green-400'
                      }
                    >
                      {showNegotiationBrief.marketPosition}
                    </span>{' '}
                    market rate ({showNegotiationBrief.marketPercentile}th percentile)
                  </p>
                  <p className="text-xs text-white/50 mt-1">
                    Range: ${showNegotiationBrief.marketSalaryRange.min.toLocaleString()} - $
                    {showNegotiationBrief.marketSalaryRange.max.toLocaleString()}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">💪 Leverage Points</h3>
                <div className="space-y-2">
                  {showNegotiationBrief.leveragePoints.map((lp, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 p-2 bg-black/30 rounded-lg text-sm"
                    >
                      <span
                        className={`px-2 py-0.5 rounded text-xs ${lp.strength === 'strong' ? 'bg-green-600' : lp.strength === 'moderate' ? 'bg-amber-600' : 'bg-gray-600'}`}
                      >
                        {lp.strength}
                      </span>
                      {lp.point}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">💬 Talking Points</h3>
                <ul className="space-y-2">
                  {showNegotiationBrief.talkingPoints.map((tp, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-blue-400">•</span>
                      {tp}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">🛡️ Objection Handlers</h3>
                <div className="space-y-2">
                  {showNegotiationBrief.objectionHandlers.map((oh, i) => (
                    <div key={i} className="p-3 bg-black/30 rounded-lg">
                      <p className="text-sm text-red-300 italic">"{oh.objection}"</p>
                      <p className="text-sm text-green-300 mt-1">→ {oh.response}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">⏰ Best Timing</h3>
                <p className="text-sm text-white/70">{showNegotiationBrief.bestTimeToAsk}</p>
                <p className="text-xs text-white/50 mt-1">
                  {showNegotiationBrief.budgetCycleContext}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowNegotiationBrief(null)}
              className="mt-6 w-full py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Employee Detail Modal */}
      {selectedEmployee && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setSelectedEmployee(null)}
        >
          <div
            className="bg-slate-900 rounded-2xl p-6 w-full max-w-2xl border border-blue-800/50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold">{selectedEmployee.name}</h2>
                <p className="text-sm text-white/60">
                  {selectedEmployee.role} • {selectedEmployee.department}
                </p>
              </div>
              <div className="text-right">
                <span
                  className={`px-3 py-1 rounded-full ${getBurnoutColor(selectedEmployee.burnoutLevel)}`}
                >
                  {selectedEmployee.burnoutLevel.toUpperCase()}
                </span>
                <div className="text-2xl font-bold mt-1">{selectedEmployee.burnoutScore}%</div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="p-3 bg-black/30 rounded-lg text-center">
                <div className="text-lg font-bold">{selectedEmployee.avgHoursPerWeek}h</div>
                <div className="text-xs text-white/50">Avg Hours/Week</div>
              </div>
              <div className="p-3 bg-black/30 rounded-lg text-center">
                <div className="text-lg font-bold">{selectedEmployee.overtimeHoursThisMonth}h</div>
                <div className="text-xs text-white/50">Overtime</div>
              </div>
              <div className="p-3 bg-black/30 rounded-lg text-center">
                <div className="text-lg font-bold">{selectedEmployee.ptoDaysRemaining}</div>
                <div className="text-xs text-white/50">PTO Remaining</div>
              </div>
              <div className="p-3 bg-black/30 rounded-lg text-center">
                <div className="text-lg font-bold">
                  ${(selectedEmployee.salary / 1000).toFixed(0)}k
                </div>
                <div className="text-xs text-white/50">Salary</div>
              </div>
            </div>

            {selectedEmployee.burnoutFactors.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Burnout Factors</h3>
                <div className="space-y-2">
                  {selectedEmployee.burnoutFactors.map((f) => (
                    <div
                      key={f.id}
                      className="p-3 bg-red-900/20 rounded-lg border border-red-700/30"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{f.name}</span>
                        <span className="text-red-400">{f.score}%</span>
                      </div>
                      <ul className="text-xs text-white/50">
                        {f.indicators.map((ind, i) => (
                          <li key={i}>• {ind}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={async () => {
                  await unionService.analyzeBurnout(selectedEmployee.id);
                  loadData();
                  setSelectedEmployee(unionService.getEmployee(selectedEmployee.id) || null);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg"
              >
                🔄 Refresh Analysis
              </button>
              <button
                onClick={() => setSelectedEmployee(null)}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnionPage;
