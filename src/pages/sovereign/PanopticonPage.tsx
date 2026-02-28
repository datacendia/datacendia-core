// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * CendiaPanopticon™ - Global Regulation Engine
 * "Every new regulation, absorbed and enforced."
 */

import React, { useState, useEffect } from 'react';
import apiClient from '../../lib/api/client';
import {
  Shield,
  AlertTriangle,
  FileText,
  TrendingUp,
  Globe,
  CheckCircle,
  XCircle,
  Clock,
  X,
  ExternalLink,
  Play,
  FlaskConical,
  MapPin,
  Zap,
  Download,
  User,
  Calendar,
  ChevronRight,
  Filter,
} from 'lucide-react';

interface Framework {
  code: string;
  name: string;
  jurisdiction: string;
  category: string;
  description: string;
  requirements: number;
}

interface Regulation {
  id: string;
  framework_code: string;
  framework_name: string;
  jurisdiction: string;
  status: string;
  obligations: any[];
  violations: any[];
}

interface Violation {
  id: string;
  title: string;
  severity: string;
  status: string;
  regulation: { framework_code: string };
  owner?: string;
  dueDate?: string;
  progress?: number;
}

interface Dashboard {
  totalFrameworks: number;
  overallComplianceScore: number;
  openViolations: { critical: number; high: number; medium: number; low: number; total: number };
  upcomingRegulations: number;
  jurisdictions: number;
}

interface RegulatoryRadarEvent {
  id: string;
  title: string;
  framework: string;
  jurisdiction: string;
  window: 'now' | '30' | '60' | '90';
  impact: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  effectiveDate: string;
  description: string;
}

const DEFAULT_RADAR_EVENTS: RegulatoryRadarEvent[] = [
  {
    id: 'dora-enforcement',
    title: 'DORA enforcement begins for financial entities',
    framework: 'DORA',
    jurisdiction: 'EU',
    window: '60',
    impact: 'CRITICAL',
    effectiveDate: 'In ~45 days',
    description:
      'Operational resilience requirements become enforceable. High expectations for incident reporting and ICT risk management.',
  },
  {
    id: 'ccpa-amendment',
    title: 'CCPA/CPRA enforcement expansion',
    framework: 'CCPA',
    jurisdiction: 'US-CA',
    window: '90',
    impact: 'HIGH',
    effectiveDate: 'In ~75 days',
    description:
      'Broader scope for data subject rights and vendor obligations. Increased enforcement expected for adtech and third parties.',
  },
  {
    id: 'eu-ai-act-phase-2',
    title: 'EU AI Act high-risk obligations phase-in',
    framework: 'EU AI Act',
    jurisdiction: 'EU',
    window: '30',
    impact: 'HIGH',
    effectiveDate: 'In ~30-60 days (phase 2)',
    description:
      'High-risk AI systems must align with transparency, human oversight, and robustness requirements. Significant documentation lift.',
  },
  {
    id: 'privacy-guidance-update',
    title: 'Updated supervisory guidance on cross-border transfers',
    framework: 'GDPR',
    jurisdiction: 'EU',
    window: 'now',
    impact: 'MEDIUM',
    effectiveDate: 'Now',
    description:
      'Regulators tightening expectations around SCCs and transfer impact assessments. Existing templates may need updates.',
  },
];

const DEFAULT_AI_SUMMARY =
  'The highest-impact change in the next 90 days is DORA enforcement for EU financial entities. ' +
  'If your critical services rely on third-party providers, you should prioritize mapping those dependencies and ' +
  'running a focused resilience review now. CCPA/CPRA expansion and the EU AI Act phase-in are close behind, ' +
  'particularly for data-rich and AI-heavy business units.';

const DEFAULT_AI_ACTIONS: string[] = [
  'Map your critical third-party services and vendors to understand DORA exposure.',
  'Run a focused operational resilience review on incident response and ICT risk controls.',
  'Prepare privacy- and AI-heavy business units for CCPA/CPRA expansion and EU AI Act obligations.',
];

// Mock compliance score breakdown
const SCORE_BREAKDOWN = {
  byFramework: [
    { code: 'GDPR', score: 68, controls: 142, mapped: 97 },
    { code: 'HIPAA', score: 80, controls: 89, mapped: 71 },
    { code: 'SOX', score: 71, controls: 64, mapped: 45 },
    { code: 'DORA', score: 45, controls: 112, mapped: 50 },
    { code: 'CCPA', score: 82, controls: 38, mapped: 31 },
  ],
  byControlFamily: [
    { family: 'Access Control', score: 78 },
    { family: 'Logging & Monitoring', score: 85 },
    { family: 'Vendor Risk', score: 62 },
    { family: 'Data Protection', score: 74 },
    { family: 'Incident Response', score: 69 },
  ],
};

// Mock jurisdiction matrix
const JURISDICTION_MATRIX = [
  {
    region: 'European Union',
    frameworks: ['GDPR', 'DORA', 'EU AI Act'],
    obligations: 245,
    violations: 1,
  },
  {
    region: 'United States',
    frameworks: ['HIPAA', 'SOX', 'CCPA'],
    obligations: 180,
    violations: 2,
  },
  { region: 'United Kingdom', frameworks: ['UK GDPR', 'FCA'], obligations: 95, violations: 0 },
  { region: 'Canada', frameworks: ['PIPEDA'], obligations: 42, violations: 0 },
  { region: 'Australia', frameworks: ['Privacy Act'], obligations: 38, violations: 0 },
  { region: 'Singapore', frameworks: ['PDPA'], obligations: 35, violations: 0 },
];

// Helper for dynamic date generation
const getFutureDate = (daysFromNow: number): string => {
  const date = new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000);
  return date.toISOString().split('T')[0];
};

const currentYear = new Date().getFullYear();

// Dynamic violation details (dates relative to current time)
const VIOLATION_DETAILS: Record<string, any> = {
  v1: {
    id: 'v1',
    title: 'Missing data retention policy enforcement',
    severity: 'HIGH',
    framework: 'GDPR',
    description:
      'Article 5(1)(e) requires storage limitation. Current systems retain personal data beyond declared periods.',
    owner: 'Data Protection Officer',
    dueDate: getFutureDate(30),
    linkedDecisions: [`DEC-${currentYear - 1}-089: Data Retention Review`],
    mitigationWorkflow: `WF-${currentYear}-012`,
  },
  v2: {
    id: 'v2',
    title: 'Incomplete vendor risk assessment',
    severity: 'MEDIUM',
    framework: 'DORA',
    description: 'ICT third-party risk assessment not completed for 3 critical vendors.',
    owner: 'Vendor Risk Manager',
    dueDate: getFutureDate(14),
    linkedDecisions: [],
    mitigationWorkflow: null,
  },
};

export const PanopticonPage: React.FC = () => {
  const [frameworks, setFrameworks] = useState<Framework[]>([]);
  const [regulations, setRegulations] = useState<Regulation[]>([]);
  const [violations, setViolations] = useState<Violation[]>([]);
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isIngesting, setIsIngesting] = useState(false);
  const [radarEvents, setRadarEvents] = useState<RegulatoryRadarEvent[]>(DEFAULT_RADAR_EVENTS);
  const [aiSummary, setAiSummary] = useState<string>(DEFAULT_AI_SUMMARY);

  // Panel/Modal states
  const [showScoreBreakdown, setShowScoreBreakdown] = useState(false);
  const [showJurisdictionMatrix, setShowJurisdictionMatrix] = useState(false);
  const [selectedRadarEvent, setSelectedRadarEvent] = useState<RegulatoryRadarEvent | null>(null);
  const [selectedViolation, setSelectedViolation] = useState<string | null>(null);
  const [aiActions, setAiActions] = useState<string[]>(DEFAULT_AI_ACTIONS);
  const [perspective, setPerspective] = useState<'board' | 'operator'>('board');
  const [showAiRationale, setShowAiRationale] = useState(false);

  // New state for violation workflow and exports
  const [showViolationWorkflow, setShowViolationWorkflow] = useState(false);
  const [violationFilter, setViolationFilter] = useState<
    'all' | 'critical' | 'high' | 'medium' | 'low'
  >('all');
  const [showExportModal, setShowExportModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Persist user preference for perspective
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem('dc_panopticon_perspective', perspective);
      } catch {
        // ignore storage errors
      }
    }

    loadRadarInsights(perspective);
  }, [perspective]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      const stored = window.localStorage.getItem('dc_panopticon_perspective');
      if (stored === 'board' || stored === 'operator') {
        setPerspective(stored);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const loadData = async () => {
    try {
      const [fwRes, regRes, violRes, dashRes] = await Promise.all([
        apiClient.api.get<{ data: Framework[] }>('/panopticon/frameworks'),
        apiClient.api.get<{ data: Regulation[] }>('/panopticon/regulations'),
        apiClient.api.get<{ data: Violation[] }>('/panopticon/violations'),
        apiClient.api.get<{ data: Dashboard }>('/panopticon/dashboard'),
      ]);

      if (fwRes.success) {
        setFrameworks((fwRes.data as any)?.data || fwRes.data || []);
      }
      if (regRes.success) {
        setRegulations((regRes.data as any)?.data || regRes.data || []);
      }
      if (violRes.success) {
        setViolations((violRes.data as any)?.data || violRes.data || []);
      }
      if (dashRes.success) {
        setDashboard((dashRes.data as any)?.data || dashRes.data || null);
      }
    } catch (error) {
      console.error('Failed to load Panopticon data, using demo data:', error);
      // Fallback demo data when backend unavailable
      setFrameworks([
        { code: 'GDPR', name: 'General Data Protection Regulation', jurisdiction: 'EU', category: 'Privacy', description: 'EU data protection and privacy regulation', requirements: 142 },
        { code: 'HIPAA', name: 'Health Insurance Portability and Accountability Act', jurisdiction: 'US', category: 'Healthcare', description: 'US healthcare data protection', requirements: 89 },
        { code: 'SOX', name: 'Sarbanes-Oxley Act', jurisdiction: 'US', category: 'Financial', description: 'Corporate governance and financial disclosure', requirements: 64 },
        { code: 'DORA', name: 'Digital Operational Resilience Act', jurisdiction: 'EU', category: 'Financial', description: 'EU ICT risk management for financial entities', requirements: 112 },
        { code: 'CCPA', name: 'California Consumer Privacy Act', jurisdiction: 'US-CA', category: 'Privacy', description: 'California data privacy rights', requirements: 38 },
        { code: 'EU_AI_ACT', name: 'EU Artificial Intelligence Act', jurisdiction: 'EU', category: 'AI Governance', description: 'Risk-based regulation of AI systems', requirements: 96 },
        { code: 'SOC2', name: 'SOC 2 Type II', jurisdiction: 'Global', category: 'Security', description: 'Trust service criteria for service organizations', requirements: 78 },
        { code: 'ISO27001', name: 'ISO 27001:2022', jurisdiction: 'Global', category: 'Security', description: 'Information security management system', requirements: 114 },
        { code: 'NIST_AI', name: 'NIST AI Risk Management Framework', jurisdiction: 'US', category: 'AI Governance', description: 'Voluntary AI risk management guidance', requirements: 52 },
        { code: 'PCI_DSS', name: 'PCI DSS v4.0', jurisdiction: 'Global', category: 'Financial', description: 'Payment card data security standard', requirements: 64 },
      ]);
      setViolations([
        { id: 'v1', title: 'Missing data retention policy enforcement', severity: 'HIGH', status: 'OPEN', regulation: { framework_code: 'GDPR' }, owner: 'Data Protection Officer', dueDate: getFutureDate(30), progress: 35 },
        { id: 'v2', title: 'Incomplete vendor risk assessment', severity: 'MEDIUM', status: 'OPEN', regulation: { framework_code: 'DORA' }, owner: 'Vendor Risk Manager', dueDate: getFutureDate(14), progress: 60 },
        { id: 'v3', title: 'AI model transparency documentation gaps', severity: 'HIGH', status: 'IN_PROGRESS', regulation: { framework_code: 'EU_AI_ACT' }, owner: 'AI Ethics Lead', dueDate: getFutureDate(45), progress: 20 },
      ]);
      setDashboard({
        totalFrameworks: 10,
        overallComplianceScore: 72,
        openViolations: { critical: 0, high: 2, medium: 1, low: 0, total: 3 },
        upcomingRegulations: 4,
        jurisdictions: 6,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadRadarInsights = async (view: 'board' | 'operator') => {
    try {
      const res = await apiClient.api.get<{
        data?:
          | { events?: RegulatoryRadarEvent[]; summary?: string; actions?: string[] }
          | RegulatoryRadarEvent[];
      }>('/panopticon/radar', { perspective: view });

      if (res.success && res.data) {
        const payload = ((res.data as any).data ?? res.data) as
          | RegulatoryRadarEvent[]
          | { events?: RegulatoryRadarEvent[]; summary?: string; actions?: string[] };

        if (Array.isArray(payload)) {
          setRadarEvents(payload);
        } else if (payload && Array.isArray(payload.events)) {
          setRadarEvents(payload.events);
          if (typeof payload.summary === 'string') {
            setAiSummary(payload.summary);
          }
          if (Array.isArray(payload.actions)) {
            setAiActions(payload.actions);
          }
        }
      }
    } catch {}
  };

  const ingestRegulation = async (code: string) => {
    setIsIngesting(true);
    try {
      await apiClient.api.post('/panopticon/regulations/ingest', { frameworkCode: code });
      await loadData();
    } catch (error) {
      console.error('Ingest failed:', error);
    } finally {
      setIsIngesting(false);
    }
  };

  const categories = [...new Set(frameworks.map((f) => f.category))];
  const filteredFrameworks =
    selectedCategory === 'all'
      ? frameworks
      : frameworks.filter((f) => f.category === selectedCategory);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-500';
      case 'HIGH':
        return 'bg-orange-500';
      case 'MEDIUM':
        return 'bg-yellow-500';
      default:
        return 'bg-blue-500';
    }
  };

  const getImpactBadgeClasses = (impact: string) => {
    switch (impact) {
      case 'CRITICAL':
        return 'bg-red-500/20 text-red-300 border border-red-500/40';
      case 'HIGH':
        return 'bg-orange-500/20 text-orange-200 border border-orange-500/40';
      case 'MEDIUM':
        return 'bg-yellow-500/20 text-yellow-200 border border-yellow-500/40';
      default:
        return 'bg-slate-600/40 text-slate-200 border border-slate-500/40';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading Panopticon...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-10 h-10 text-emerald-400" />
            <div>
              <h1 className="text-3xl font-bold">CendiaPanopticon™</h1>
              <p className="text-slate-400">
                Global Regulation Engine - "Every new regulation, absorbed and enforced."
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowExportModal(true)}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Export Reports
          </button>
        </div>
      </div>

      {/* Dashboard Stats */}
      {dashboard && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {/* Compliance Score - Clickable with tooltip */}
          <button
            onClick={() => setShowScoreBreakdown(true)}
            className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-emerald-500/50 hover:bg-slate-700/50 transition-all text-left group relative"
          >
            <div className="text-slate-400 text-sm flex items-center gap-1">
              Compliance Score
              <span className="text-slate-600 text-xs cursor-help">ⓘ</span>
              <span className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none w-64 z-10 border border-slate-700">
                Weighted coverage of obligations across all active frameworks:
                <br />
                • 0–49%: High exposure
                <br />
                • 50–79%: Partial coverage
                <br />• 80%+: Strong compliance
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <div className="text-3xl font-bold text-emerald-400">
                {dashboard.overallComplianceScore}%
              </div>
              <div className="flex items-center gap-1 text-sm text-emerald-300">
                <TrendingUp className="w-4 h-4" />
                <span>+3%</span>
              </div>
            </div>
            <div className="mt-3 h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-500 via-yellow-400 to-emerald-400"
                style={{
                  width: `${Math.min(100, Math.max(0, dashboard.overallComplianceScore))}%`,
                }}
              />
            </div>
            <div className="text-xs text-emerald-400/60 mt-2">View score breakdown →</div>
          </button>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="text-slate-400 text-sm">Active Frameworks</div>
            <div className="text-3xl font-bold">{regulations.length}</div>
          </div>
          <button
            onClick={() => setShowViolationWorkflow(true)}
            className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-red-500/50 hover:bg-slate-700/50 transition-all text-left"
          >
            <div className="text-slate-400 text-sm">Open Violations</div>
            <div
              className={`text-3xl font-bold ${
                dashboard.openViolations.total > 0 ? 'text-red-400' : 'text-emerald-400'
              }`}
            >
              {dashboard.openViolations.total === 0 ? '0 ✅' : dashboard.openViolations.total}
            </div>
            <div className="text-xs text-red-400/60 mt-2">Manage workflow →</div>
          </button>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="text-slate-400 text-sm">Critical</div>
            <div className="text-3xl font-bold text-red-500">
              {dashboard.openViolations.critical}
            </div>
          </div>
          {/* Jurisdictions - Clickable */}
          <button
            onClick={() => setShowJurisdictionMatrix(true)}
            className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-blue-500/50 hover:bg-slate-700/50 transition-all text-left"
          >
            <div className="text-slate-400 text-sm flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Jurisdictions
            </div>
            <div className="text-3xl font-bold text-blue-400">{dashboard.jurisdictions}</div>
            <div className="text-xs text-blue-400/60 mt-2">View exposure matrix →</div>
          </button>
        </div>
      )}

      {radarEvents.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-400" />
                <span>Regulatory Radar (Next 90 Days)</span>
              </h2>
            </div>
            <div className="relative pt-4">
              <div className="h-0.5 bg-slate-700 rounded-full" />
              <div className="flex justify-between mt-2 text-xs text-slate-400">
                <span>Now</span>
                <span>30 days</span>
                <span>60 days</span>
                <span>90 days</span>
              </div>
              <div className="mt-4 grid grid-cols-4 gap-4">
                {['now', '30', '60', '90'].map((window) => (
                  <div key={window} className="space-y-3">
                    {radarEvents
                      .filter((event) => event.window === window)
                      .map((event) => (
                        <button
                          key={event.id}
                          onClick={() => setSelectedRadarEvent(event)}
                          className="p-3 bg-slate-700/60 rounded-lg border border-slate-600 hover:border-emerald-500/50 hover:bg-slate-700 transition-all text-left w-full"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-emerald-300">
                              {event.framework}
                            </span>
                            <span
                              className={`text-[10px] px-1.5 py-0.5 rounded-full ${getImpactBadgeClasses(
                                event.impact
                              )}`}
                            >
                              {event.impact}
                            </span>
                          </div>
                          <div
                            className={`text-slate-200 ${
                              event.impact === 'CRITICAL' ? 'text-sm font-semibold' : 'text-xs'
                            }`}
                          >
                            {event.title}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-1">
                            {event.effectiveDate} · {event.jurisdiction}
                          </div>
                          <div className="text-[10px] text-emerald-400/60 mt-1">
                            Click for details →
                          </div>
                        </button>
                      ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <h2 className="text-xl font-semibold">AI Assessment</h2>
              </div>
              <select
                value={perspective}
                onChange={(e) => setPerspective(e.target.value as 'board' | 'operator')}
                className="bg-slate-900 border border-slate-700 text-xs rounded px-2 py-1 text-slate-200"
              >
                <option value="board">Board view</option>
                <option value="operator">Operator view</option>
              </select>
            </div>
            <p className="text-sm text-slate-300 whitespace-pre-line">{aiSummary}</p>
            {aiActions.length > 0 && (
              <div className="mt-4">
                <div className="text-xs uppercase tracking-wide text-slate-400 mb-1">
                  Recommended actions
                </div>
                <ul className="list-disc list-inside space-y-1 text-sm text-slate-200">
                  {aiActions.map((action, index) => (
                    <li key={index}>{action}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Confidence & Transparency */}
            <div className="mt-4 pt-3 border-t border-slate-700">
              <button
                onClick={() => setShowAiRationale(!showAiRationale)}
                className="flex items-center justify-between w-full text-xs text-slate-400 hover:text-slate-300"
              >
                <span className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded">
                    87% Confidence
                  </span>
                  <span>Last updated: 2 hours ago</span>
                </span>
                <span>{showAiRationale ? '▲' : '▼'} Why this assessment?</span>
              </button>
              {showAiRationale && (
                <div className="mt-3 p-3 bg-slate-900/50 rounded-lg text-xs text-slate-300 space-y-2">
                  <p>
                    <strong>Data sources:</strong> EU Official Journal, regulatory feeds, 14 vendor
                    advisories
                  </p>
                  <p>
                    <strong>Analysis method:</strong> Cross-referenced against your control
                    framework mapping
                  </p>
                  <p>
                    <strong>Confidence factors:</strong> High source reliability (+), recent
                    regulatory guidance (+), limited internal data on DORA (-)
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-4 pt-4 border-t border-slate-700 space-y-2">
              <button
                onClick={() =>
                  window.open('/cortex/council?briefing=regulatory-q4-2025', '_blank')
                }
                className="w-full px-3 py-2 bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/50 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
              >
                <Play className="w-4 h-4" />
                Create Council Briefing
              </button>
              <button
                onClick={() =>
                  window.open(
                    '/cortex/sovereign/crucible?preset=regulatory-resilience',
                    '_blank'
                  )
                }
                className="w-full px-3 py-2 bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/50 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
              >
                <FlaskConical className="w-4 h-4" />
                Launch Crucible Stress Test
              </button>
            </div>
            <div className="mt-3 text-[10px] text-slate-500">
              This assessment is logged in Decision DNA as "Regulatory Risk Review – Q4 2025"
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Framework Library */}
        <div className="lg:col-span-2 bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-400" />
              Regulatory Frameworks ({frameworks.length})
            </h2>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-700 border border-slate-600 rounded px-3 py-1 text-sm"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredFrameworks.map((fw) => {
              const regulation = regulations.find((r) => r.framework_code === fw.code);
              const isActive = regulation?.status === 'ACTIVE';
              const isIngested = !!regulation;

              // Determine status and button
              let statusBadge;
              let actionButton;

              if (isActive) {
                statusBadge = (
                  <span
                    className="flex items-center gap-1 text-emerald-400 text-xs px-2 py-0.5 bg-emerald-900/50 rounded"
                    title="Controls have been mapped; included in Compliance Score."
                  >
                    <CheckCircle className="w-3 h-3" /> Active
                  </span>
                );
                actionButton = (
                  <button className="px-3 py-1 bg-slate-600 hover:bg-slate-500 rounded text-sm">
                    View Controls
                  </button>
                );
              } else if (isIngested) {
                statusBadge = (
                  <span className="flex items-center gap-1 text-amber-400 text-xs px-2 py-0.5 bg-amber-900/50 rounded">
                    <Clock className="w-3 h-3" /> Ingested
                  </span>
                );
                actionButton = (
                  <button className="px-3 py-1 bg-amber-600 hover:bg-amber-500 rounded text-sm">
                    Map Controls
                  </button>
                );
              } else {
                statusBadge = <span className="text-xs text-slate-500">Not loaded</span>;
                actionButton = (
                  <button
                    onClick={() => ingestRegulation(fw.code)}
                    disabled={isIngesting}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 rounded text-sm disabled:opacity-50 group relative"
                    title="Pull full requirement set into Datacendia for mapping."
                  >
                    {isIngesting ? 'Ingesting...' : 'Ingest'}
                  </button>
                );
              }

              return (
                <div
                  key={fw.code}
                  className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{fw.code}</span>
                      <span className="text-xs px-2 py-0.5 bg-slate-600 rounded">
                        {fw.jurisdiction}
                      </span>
                      <span className="text-xs px-2 py-0.5 bg-blue-900/50 text-blue-300 rounded">
                        {fw.category}
                      </span>
                      {statusBadge}
                    </div>
                    <div className="text-sm text-slate-400">{fw.name}</div>
                    <div className="text-xs text-slate-500">{fw.requirements} requirements</div>
                  </div>
                  {actionButton}
                </div>
              );
            })}
          </div>
        </div>

        {/* Violations Panel */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <span>Open Violations ({violations.length})</span>
            </h2>
            <button className="text-xs px-2 py-1 rounded border border-slate-600 text-slate-300 hover:bg-slate-700">
              + New
            </button>
          </div>
          {violations.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-2 text-emerald-500" />
              No open violations
            </div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {violations.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedViolation(v.id)}
                  className="w-full p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 hover:border-red-500/30 border border-transparent transition-all text-left"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-2 h-2 rounded-full ${getSeverityColor(v.severity)}`} />
                    <span className="text-sm font-medium">{v.title}</span>
                  </div>
                  <div className="text-xs text-slate-400">
                    {v.regulation?.framework_code} • {v.status}
                  </div>
                  <div className="text-[10px] text-red-400/60 mt-1">
                    Click for details & actions →
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Active Regulations */}
      <div className="mt-6 bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-emerald-400" />
          Active Regulations
        </h2>
        {regulations.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 mx-auto mb-4 text-emerald-400 opacity-50" />
            <h3 className="text-xl font-semibold text-white mb-2">No Active Frameworks</h3>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              Get started by loading sample frameworks or ingesting your own regulatory
              requirements.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => {
                  // Demo mode: load sample frameworks
                  ['GDPR', 'SOX', 'HIPAA', 'CCPA'].forEach((code) => ingestRegulation(code));
                }}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-medium flex items-center gap-2"
              >
                <Zap className="w-4 h-4" /> Load Sample Frameworks
              </button>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium"
              >
                Browse Framework Library ↑
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {regulations.map((reg) => (
              <div key={reg.id} className="p-4 bg-slate-700/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-emerald-400">{reg.framework_code}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      reg.status === 'ACTIVE'
                        ? 'bg-emerald-900/50 text-emerald-300'
                        : 'bg-slate-600'
                    }`}
                  >
                    {reg.status}
                  </span>
                </div>
                <div className="text-sm text-slate-300">{reg.framework_name}</div>
                <div className="text-xs text-slate-500 mt-1">{reg.jurisdiction}</div>
                <div className="flex gap-4 mt-3 text-xs text-slate-400">
                  <span>{reg.obligations?.length || 0} obligations</span>
                  <span className={reg.violations?.length > 0 ? 'text-red-400' : ''}>
                    {reg.violations?.length || 0} violations
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Score Breakdown Modal */}
      {showScoreBreakdown && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowScoreBreakdown(false)}
        >
          <div
            className="bg-slate-900 rounded-xl border border-emerald-500/30 w-[600px] max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-slate-700 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">📊 Compliance Score Breakdown</h2>
                <p className="text-sm text-slate-400">
                  Weighted coverage across all active frameworks
                </p>
              </div>
              <button
                onClick={() => setShowScoreBreakdown(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-medium text-slate-300 mb-3">By Framework</h3>
                <div className="space-y-3">
                  {SCORE_BREAKDOWN.byFramework.map((fw) => (
                    <div key={fw.code} className="flex items-center gap-3">
                      <div className="w-16 text-sm font-medium">{fw.code}</div>
                      <div className="flex-1 h-3 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${fw.score >= 80 ? 'bg-emerald-500' : fw.score >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                          style={{ width: `${fw.score}%` }}
                        />
                      </div>
                      <span
                        className={`w-12 text-right text-sm font-medium ${fw.score >= 80 ? 'text-emerald-400' : fw.score >= 50 ? 'text-amber-400' : 'text-red-400'}`}
                      >
                        {fw.score}%
                      </span>
                      <span className="text-xs text-slate-500 w-24">
                        {fw.mapped}/{fw.controls} controls
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-300 mb-3">By Control Family</h3>
                <div className="space-y-3">
                  {SCORE_BREAKDOWN.byControlFamily.map((cf) => (
                    <div key={cf.family} className="flex items-center gap-3">
                      <div className="w-36 text-sm text-slate-400">{cf.family}</div>
                      <div className="flex-1 h-3 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${cf.score >= 80 ? 'bg-emerald-500' : cf.score >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                          style={{ width: `${cf.score}%` }}
                        />
                      </div>
                      <span
                        className={`w-12 text-right text-sm font-medium ${cf.score >= 80 ? 'text-emerald-400' : cf.score >= 50 ? 'text-amber-400' : 'text-red-400'}`}
                      >
                        {cf.score}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Jurisdiction Matrix Modal */}
      {showJurisdictionMatrix && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowJurisdictionMatrix(false)}
        >
          <div
            className="bg-slate-900 rounded-xl border border-blue-500/30 w-[700px] max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-slate-700 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">🌍 Jurisdiction Exposure Matrix</h2>
                <p className="text-sm text-slate-400">Where are we exposed?</p>
              </div>
              <button
                onClick={() => setShowJurisdictionMatrix(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-400 border-b border-slate-700">
                    <th className="pb-3">Region</th>
                    <th className="pb-3">Frameworks</th>
                    <th className="pb-3 text-right">Obligations</th>
                    <th className="pb-3 text-right">Violations</th>
                  </tr>
                </thead>
                <tbody>
                  {JURISDICTION_MATRIX.map((j) => (
                    <tr key={j.region} className="border-b border-slate-800">
                      <td className="py-3 font-medium">{j.region}</td>
                      <td className="py-3">
                        <div className="flex flex-wrap gap-1">
                          {j.frameworks.map((fw) => (
                            <span key={fw} className="text-xs px-2 py-0.5 bg-slate-700 rounded">
                              {fw}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 text-right">{j.obligations}</td>
                      <td className="py-3 text-right">
                        <span
                          className={
                            j.violations > 0 ? 'text-red-400 font-medium' : 'text-emerald-400'
                          }
                        >
                          {j.violations}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Radar Event Detail Panel */}
      {selectedRadarEvent && (
        <div
          className="fixed inset-0 bg-black/50 flex items-start justify-end z-50"
          onClick={() => setSelectedRadarEvent(null)}
        >
          <div
            className="w-[500px] h-full bg-slate-900 border-l border-slate-700 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-slate-700 flex items-center justify-between sticky top-0 bg-slate-900">
              <div>
                <div
                  className={`text-xs px-2 py-0.5 rounded-full inline-block mb-2 ${getImpactBadgeClasses(selectedRadarEvent.impact)}`}
                >
                  {selectedRadarEvent.impact} IMPACT
                </div>
                <h2 className="text-xl font-bold">{selectedRadarEvent.framework}</h2>
                <p className="text-sm text-slate-400">
                  {selectedRadarEvent.jurisdiction} • {selectedRadarEvent.effectiveDate}
                </p>
              </div>
              <button
                onClick={() => setSelectedRadarEvent(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-medium mb-2">{selectedRadarEvent.title}</h3>
                <p className="text-sm text-slate-300">{selectedRadarEvent.description}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-400 mb-2">Affected Business Units</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs px-2 py-1 bg-slate-700 rounded">IT Operations</span>
                  <span className="text-xs px-2 py-1 bg-slate-700 rounded">Data Privacy</span>
                  <span className="text-xs px-2 py-1 bg-slate-700 rounded">Vendor Management</span>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-400 mb-2">Affected Data Types</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs px-2 py-1 bg-slate-700 rounded">Personal Data</span>
                  <span className="text-xs px-2 py-1 bg-slate-700 rounded">Financial Records</span>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-700 space-y-3">
                <button
                  onClick={() =>
                    window.open(
                      `/cortex/intelligence/decision-dna?new=true&regulation=${selectedRadarEvent.framework}`,
                      '_blank'
                    )
                  }
                  className="w-full px-4 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  Create Impact Assessment in Decision DNA
                </button>
                <button
                  onClick={() =>
                    window.open(
                      `/cortex/bridge?template=remediation&regulation=${selectedRadarEvent.framework}`,
                      '_blank'
                    )
                  }
                  className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <Play className="w-4 h-4" />
                  Create Remediation Workflow in Bridge
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Violation Detail Modal (Witness-style) */}
      {selectedViolation && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setSelectedViolation(null)}
        >
          <div
            className="bg-slate-900 rounded-xl border border-red-500/30 w-[600px] max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Violation Details</h2>
                  <p className="text-sm text-slate-400">CendiaWitness™ Record</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedViolation(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {(() => {
                const detail = VIOLATION_DETAILS[
                  selectedViolation as keyof typeof VIOLATION_DETAILS
                ] || {
                  title: 'Unknown Violation',
                  severity: 'MEDIUM',
                  framework: 'Unknown',
                  description: 'No details available',
                  owner: 'Unassigned',
                  dueDate: 'TBD',
                  linkedDecisions: [],
                  mitigationWorkflow: null,
                };
                return (
                  <>
                    <div className="p-4 bg-slate-800 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{detail.title}</span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${detail.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-300' : detail.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-300' : 'bg-amber-500/20 text-amber-300'}`}
                        >
                          {detail.severity}
                        </span>
                      </div>
                      <p className="text-sm text-slate-300">{detail.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-400">Framework:</span>
                        <span className="ml-2 font-medium">{detail.framework}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Owner:</span>
                        <span className="ml-2 font-medium">{detail.owner}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Due Date:</span>
                        <span className="ml-2 font-medium">{detail.dueDate}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Status:</span>
                        <span className="ml-2 font-medium text-amber-400">Open</span>
                      </div>
                    </div>
                    {detail.linkedDecisions.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-slate-400 mb-2">
                          Linked Decisions
                        </h4>
                        <div className="space-y-2">
                          {detail.linkedDecisions.map((dec: string, i: number) => (
                            <button
                              key={i}
                              className="w-full p-2 bg-slate-800 rounded text-sm text-left hover:bg-slate-700 flex items-center justify-between"
                            >
                              <span>{dec}</span>
                              <ExternalLink className="w-3 h-3 text-slate-400" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {detail.mitigationWorkflow && (
                      <div>
                        <h4 className="text-sm font-medium text-slate-400 mb-2">
                          Mitigation Workflow
                        </h4>
                        <button className="w-full p-2 bg-purple-900/30 border border-purple-500/30 rounded text-sm text-left hover:bg-purple-900/50 flex items-center justify-between">
                          <span>{detail.mitigationWorkflow}</span>
                          <ExternalLink className="w-3 h-3 text-purple-400" />
                        </button>
                      </div>
                    )}
                    <div className="pt-4 border-t border-slate-700 space-y-3">
                      <button
                        onClick={() =>
                          window.open('/cortex/council?escalate=violation', '_blank')
                        }
                        className="w-full px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                      >
                        <Play className="w-4 h-4" />
                        Escalate to Council
                      </button>
                      <button
                        onClick={() => window.open('/cortex/bridge?link=violation', '_blank')}
                        className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                      >
                        Link to Workflow
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setShowExportModal(false)}
        >
          <div
            className="bg-slate-800 rounded-xl p-6 w-full max-w-md border border-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Download className="w-5 h-5 text-emerald-400" /> Export Reports
              </h3>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <button className="w-full p-4 bg-slate-700 hover:bg-slate-600 rounded-lg text-left transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Compliance Summary</div>
                    <div className="text-xs text-slate-400">
                      Overall scores, framework status, trend analysis
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded">
                    PDF
                  </span>
                </div>
              </button>
              <button className="w-full p-4 bg-slate-700 hover:bg-slate-600 rounded-lg text-left transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Open Violations Report</div>
                    <div className="text-xs text-slate-400">
                      All violations with owners, due dates, progress
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded">
                    CSV
                  </span>
                </div>
              </button>
              <button className="w-full p-4 bg-slate-700 hover:bg-slate-600 rounded-lg text-left transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Board Report</div>
                    <div className="text-xs text-slate-400">Executive summary with risk matrix</div>
                  </div>
                  <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded">
                    PPTX
                  </span>
                </div>
              </button>
              <button className="w-full p-4 bg-slate-700 hover:bg-slate-600 rounded-lg text-left transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Regulatory Radar</div>
                    <div className="text-xs text-slate-400">Upcoming changes by jurisdiction</div>
                  </div>
                  <span className="text-xs px-2 py-1 bg-amber-500/20 text-amber-300 rounded">
                    PDF
                  </span>
                </div>
              </button>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-700 text-xs text-slate-500">
              Reports can be customized via templates in Settings → Report Templates
            </div>
          </div>
        </div>
      )}

      {/* Violation Workflow Panel */}
      {showViolationWorkflow && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/50"
          onClick={() => setShowViolationWorkflow(false)}
        >
          <div
            className="w-[500px] h-full bg-slate-900 border-l border-slate-700 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-slate-700 sticky top-0 bg-slate-900">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Violation Workflow</h2>
                <button
                  onClick={() => setShowViolationWorkflow(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-500" />
                {(['all', 'critical', 'high', 'medium', 'low'] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setViolationFilter(level)}
                    className={`px-3 py-1 rounded-lg text-xs capitalize ${
                      violationFilter === level
                        ? level === 'critical'
                          ? 'bg-red-600 text-white'
                          : level === 'high'
                            ? 'bg-orange-600 text-white'
                            : level === 'medium'
                              ? 'bg-amber-600 text-white'
                              : level === 'low'
                                ? 'bg-blue-600 text-white'
                                : 'bg-emerald-600 text-white'
                        : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 space-y-4">
              {/* Dynamic violations with workflow (dates relative to current time) */}
              {[
                {
                  id: 'v1',
                  title: 'Missing data retention policy',
                  severity: 'HIGH',
                  owner: 'Data Protection Officer',
                  dueDate: getFutureDate(30),
                  progress: 35,
                },
                {
                  id: 'v2',
                  title: 'Incomplete vendor risk assessment',
                  severity: 'MEDIUM',
                  owner: 'Vendor Risk Manager',
                  dueDate: getFutureDate(14),
                  progress: 60,
                },
                {
                  id: 'v3',
                  title: 'Delayed security training',
                  severity: 'LOW',
                  owner: 'HR Director',
                  dueDate: getFutureDate(45),
                  progress: 80,
                },
              ]
                .filter(
                  (v) => violationFilter === 'all' || v.severity.toLowerCase() === violationFilter
                )
                .map((v) => (
                  <div key={v.id} className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${
                          v.severity === 'CRITICAL'
                            ? 'bg-red-500/20 text-red-300'
                            : v.severity === 'HIGH'
                              ? 'bg-orange-500/20 text-orange-300'
                              : v.severity === 'MEDIUM'
                                ? 'bg-amber-500/20 text-amber-300'
                                : 'bg-blue-500/20 text-blue-300'
                        }`}
                      >
                        {v.severity}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Due: {v.dueDate}
                      </span>
                    </div>

                    <div className="font-medium text-white mb-2">{v.title}</div>

                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                      <User className="w-3 h-3" />
                      <span>{v.owner}</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-slate-500 mb-1">
                        <span>Progress</span>
                        <span>{v.progress}%</span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            v.progress >= 80
                              ? 'bg-emerald-500'
                              : v.progress >= 50
                                ? 'bg-amber-500'
                                : 'bg-red-500'
                          }`}
                          style={{ width: `${v.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedViolation(v.id)}
                        className="flex-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-xs flex items-center justify-center gap-1"
                      >
                        View Details <ChevronRight className="w-3 h-3" />
                      </button>
                      <select className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-xs">
                        <option>Assign Owner</option>
                        <option>Sarah Chen</option>
                        <option>Michael Torres</option>
                        <option>Emily Watson</option>
                      </select>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PanopticonPage;
