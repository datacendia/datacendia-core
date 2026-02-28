// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA - DASHBOARD PAGE (Real API Integration)
// =============================================================================

// File: src/pages/cortex/DashboardPage.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn, formatNumber, formatCurrency, formatRelativeTime } from '../../../lib/utils';
import { healthApi, alertsApi, metricsApi, organizationsApi, authApi } from '../../lib/api';
import type { Alert as ApiAlert } from '../../lib/api/types';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useVerticalConfig } from '../../contexts/VerticalConfigContext';
import { NarrativeGuide, NarrativeSelector } from '../../components/ui';
import { Compass, X, ChevronDown, Building2, Map, LayoutGrid } from 'lucide-react';
import { VerticalDashboard } from '../../components/dashboard';
import { LayoutMapRenderer } from '../../components/dashboard/LayoutMapRenderer';
import { VERTICAL_DASHBOARDS } from '../../config/verticalDashboards';
import { EXTENDED_DASHBOARDS } from '../../config/verticalDashboardsExtended';
import { getVerticalLayouts, type LayoutMap } from '../../config/verticalLayoutMaps';

// All available verticals from dashboard configs
const ALL_VERTICALS = [
  { id: 'financial', name: 'Financial Services', icon: '💹', description: 'Banking, investment, trading' },
  { id: 'healthcare', name: 'Healthcare', icon: '🏥', description: 'Hospitals, clinics, patient care' },
  { id: 'manufacturing', name: 'Manufacturing', icon: '🏭', description: 'Production, supply chain' },
  { id: 'technology', name: 'Technology', icon: '🚀', description: 'Software, platforms, SaaS' },
  { id: 'energy', name: 'Energy & Utilities', icon: '⚡', description: 'Power, grid, renewables' },
  { id: 'government', name: 'Government', icon: '🏛️', description: 'Public sector, agencies' },
  { id: 'legal', name: 'Legal', icon: '⚖️', description: 'Law firms, compliance' },
  { id: 'retail', name: 'Retail', icon: '🛒', description: 'Stores, e-commerce' },
  { id: 'real-estate', name: 'Real Estate', icon: '🏢', description: 'Property, construction' },
  { id: 'telecom', name: 'Telecommunications', icon: '📡', description: 'Networks, connectivity' },
  { id: 'hospitality', name: 'Hospitality & Travel', icon: '🏨', description: 'Hotels, tourism' },
  { id: 'education', name: 'Education', icon: '🎓', description: 'Universities, schools' },
  { id: 'media', name: 'Media & Entertainment', icon: '🎬', description: 'Content, streaming' },
  { id: 'agriculture', name: 'Agriculture', icon: '🌾', description: 'Farming, agtech' },
  { id: 'logistics', name: 'Transportation & Logistics', icon: '🚚', description: 'Fleet, supply chain' },
  { id: 'insurance', name: 'Insurance', icon: '🛡️', description: 'Claims, underwriting' },
  { id: 'non-profit', name: 'Non-Profit', icon: '💚', description: 'NGOs, foundations' },
  { id: 'construction', name: 'Construction', icon: '🏗️', description: 'Building, infrastructure' },
  { id: 'mining', name: 'Mining & Resources', icon: '⛏️', description: 'Extraction, minerals' },
  { id: 'aerospace', name: 'Aerospace & Defense', icon: '✈️', description: 'Aviation, defense' },
  { id: 'pharmaceuticals', name: 'Pharmaceuticals', icon: '💊', description: 'Drug development, trials' },
  { id: 'automotive', name: 'Automotive', icon: '🚗', description: 'Vehicles, EV, mobility' },
  { id: 'sports', name: 'Sports & Entertainment', icon: '🏆', description: 'Teams, leagues, events' },
];

// =============================================================================
// TYPES
// =============================================================================

interface HealthScore {
  overall: number;
  dimensions: {
    data: { score: number; trend: 'up' | 'down' | 'stable'; change: number };
    operations: { score: number; trend: 'up' | 'down' | 'stable'; change: number };
    security: { score: number; trend: 'up' | 'down' | 'stable'; change: number };
    people: { score: number; trend: 'up' | 'down' | 'stable'; change: number };
  };
}

interface Alert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  timestamp: Date;
}

interface Approval {
  id: string;
  type: 'workflow' | 'access' | 'budget';
  title: string;
  requestedBy: string;
}

interface Metric {
  id: string;
  name: string;
  value: number;
  unit: string;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
}

interface Activity {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
  timestamp: Date;
}

// =============================================================================
// FALLBACK DATA (Used when API is unavailable)
// =============================================================================

const fallbackHealthScore: HealthScore = {
  overall: 82,
  dimensions: {
    data: { score: 94, trend: 'up', change: 2 },
    operations: { score: 78, trend: 'down', change: -5 },
    security: { score: 85, trend: 'up', change: 1 },
    people: { score: 71, trend: 'stable', change: 0 },
  },
};

// Translation helper type
type TranslateFunc = (key: string, params?: Record<string, string>) => string;

// Translated data getters - called inside component with t()
const getTranslatedAlerts = (t: TranslateFunc): Alert[] => [
  {
    id: '1',
    severity: 'critical',
    title: t('dashboard.sampleAlerts.databaseCpu'),
    timestamp: new Date(Date.now() - 300000),
  },
  {
    id: '2',
    severity: 'critical',
    title: t('dashboard.sampleAlerts.paymentLatency'),
    timestamp: new Date(Date.now() - 600000),
  },
  {
    id: '3',
    severity: 'warning',
    title: t('dashboard.sampleAlerts.diskUsage'),
    timestamp: new Date(Date.now() - 1800000),
  },
];

const getTranslatedApprovals = (t: TranslateFunc): Approval[] => [
  {
    id: '1',
    type: 'workflow',
    title: t('dashboard.sampleApprovals.monthlyClose'),
    requestedBy: 'Sarah Chen',
  },
  {
    id: '2',
    type: 'access',
    title: t('dashboard.sampleApprovals.prodDbAccess'),
    requestedBy: 'Emily Davis',
  },
];

const getTranslatedMetrics = (t: TranslateFunc): Metric[] => [
  {
    id: '1',
    name: t('dashboard.sampleMetrics.revenue'),
    value: 12400000,
    unit: 'USD',
    change: 12,
    changeType: 'increase',
  },
  {
    id: '2',
    name: t('dashboard.sampleMetrics.pipeline'),
    value: 48200000,
    unit: 'USD',
    change: 8,
    changeType: 'increase',
  },
  {
    id: '3',
    name: t('dashboard.sampleMetrics.burnRate'),
    value: 1200000,
    unit: 'USD/mo',
    change: -3,
    changeType: 'decrease',
  },
  {
    id: '4',
    name: t('dashboard.sampleMetrics.nps'),
    value: 72,
    unit: 'pts',
    change: 5,
    changeType: 'increase',
  },
];

const getTranslatedActivity = (t: TranslateFunc): Activity[] => [
  {
    id: '1',
    type: 'success',
    message: `Workflow "Monthly Close" ${t('common.completed') || 'completed'}`,
    timestamp: new Date(Date.now() - 120000),
  },
  {
    id: '2',
    type: 'info',
    message: `Sarah ${t('common.queried') || 'queried'} revenue forecast`,
    timestamp: new Date(Date.now() - 900000),
  },
];

const getTranslatedQueries = (t: TranslateFunc): string[] => [
  t('dashboard.sampleQueries.churnIncrease'),
  t('dashboard.sampleQueries.forecastRevenue'),
  t('dashboard.sampleQueries.biggestRisk'),
];

// =============================================================================
// COMPONENT
// =============================================================================

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const { currentVertical, selectVertical, isLoading: verticalLoading } = useVerticalConfig();
  const [queryInput, setQueryInput] = useState('');
  const [showVerticalSelector, setShowVerticalSelector] = useState(false);
  const [selectedVerticalId, setSelectedVerticalId] = useState<string>(currentVertical?.id || 'technology');
  
  // Layout map state
  const [showLayoutSelector, setShowLayoutSelector] = useState(false);
  const [selectedLayoutId, setSelectedLayoutId] = useState<string>('');
  const [viewMode, setViewMode] = useState<'dashboard' | 'map'>('map');
  
  // Get available layouts for selected vertical
  const availableLayouts = getVerticalLayouts(selectedVerticalId);
  const selectedLayout = availableLayouts.find(l => l.id === selectedLayoutId) || availableLayouts[0];

  // Check if user is admin/owner
  const isAdminOrOwner = user?.role === 'OWNER' || user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN';

  // Get current vertical info from ALL_VERTICALS
  const selectedVerticalInfo = ALL_VERTICALS.find(v => v.id === selectedVerticalId) || ALL_VERTICALS[3]; // Default to technology

  // Real data state
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [healthScore, setHealthScore] = useState<HealthScore>(fallbackHealthScore);
  const [userName, setUserName] = useState('User');
  const [orgName, setOrgName] = useState('Your Company');

  // Get translated fallback data
  const fallbackAlerts = getTranslatedAlerts(t);
  const fallbackApprovals = getTranslatedApprovals(t);
  const fallbackMetrics = getTranslatedMetrics(t);
  const fallbackActivity = getTranslatedActivity(t);
  const recentQueries = getTranslatedQueries(t);
  const [isLoading, setIsLoading] = useState(true);

  // Handle vertical change for admin users
  const handleVerticalChange = async (verticalId: string) => {
    setSelectedVerticalId(verticalId);
    setShowVerticalSelector(false);
    try {
      await selectVertical(verticalId);
    } catch (err) {
      console.error('Failed to switch vertical:', err);
    }
  };

  // User Journey State
  const [showJourneySelector, setShowJourneySelector] = useState(false);
  const [activeJourney, setActiveJourney] = useState<
    | 'welcome'
    | 'executive'
    | 'dataEngineer'
    | 'complianceOfficer'
    | 'strategist'
    | 'quickStart'
    | null
  >(null);
  const [journeyCompleted, setJourneyCompleted] = useState(() => {
    return localStorage.getItem('datacendia_journey_completed') === 'true';
  });

  // Fetch real data from APIs
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch alerts
        const alertsResponse = await alertsApi.getAlerts({ status: 'ACTIVE' });
        if (alertsResponse.success && alertsResponse.data) {
          const mappedAlerts: Alert[] = alertsResponse.data.slice(0, 5).map((a: ApiAlert) => ({
            id: a.id,
            severity: a.severity,
            title: a.title,
            timestamp: new Date(a.createdAt),
          }));
          setAlerts(mappedAlerts);
        }

        // Fetch metrics - use key metrics endpoint which includes real database values
        const metricsResponse = await metricsApi.getKeyMetrics();
        if (metricsResponse.success && metricsResponse.data) {
          const mappedMetrics: Metric[] = metricsResponse.data.slice(0, 4).map((m: any) => ({
            id: m.id,
            name: m.name,
            value: m.value || 0,
            unit: m.unit || '',
            change: m.change || 0,
            changeType:
              (m.change || 0) > 0
                ? 'increase'
                : (m.change || 0) < 0
                  ? 'decrease'
                  : 'neutral',
          }));
          setMetrics(mappedMetrics);
        }

        // Fetch health score
        const healthResponse = await healthApi.getScore();
        if (healthResponse.success && healthResponse.data) {
          setHealthScore(healthResponse.data as unknown as HealthScore);
        }

        // Fetch current organization
        const orgResponse = await organizationsApi.getCurrent();
        if (orgResponse.success && orgResponse.data) {
          setOrgName(orgResponse.data.name || 'Your Company');
        }

        // Fetch current user
        const userResponse = await authApi.getCurrentUser();
        if (userResponse.success && userResponse.data) {
          setUserName(userResponse.data.name?.split(' ')[0] || 'User');
        }
      } catch (error) {
        console.error('Dashboard data fetch error:', error);
        // Use fallbacks on error
        setAlerts(fallbackAlerts);
        setMetrics(fallbackMetrics);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleQuerySubmit = () => {
    if (queryInput.trim()) {
      navigate(`/cortex/council?q=${encodeURIComponent(queryInput)}`);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return t('dashboard.greetings.morning');
    }
    if (hour < 18) {
      return t('dashboard.greetings.afternoon');
    }
    return t('dashboard.greetings.evening');
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') {
      return '↑';
    }
    if (trend === 'down') {
      return '↓';
    }
    return '→';
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable', isPositive: boolean = true) => {
    if (trend === 'stable') {
      return 'text-neutral-500';
    }
    if (trend === 'up') {
      return isPositive ? 'text-success-main' : 'text-error-main';
    }
    return isPositive ? 'text-error-main' : 'text-success-main';
  };

  const handleJourneyComplete = () => {
    setActiveJourney(null);
    setJourneyCompleted(true);
    localStorage.setItem('datacendia_journey_completed', 'true');
  };

  const handleSelectJourney = (
    journeyId:
      | 'welcome'
      | 'executive'
      | 'dataEngineer'
      | 'complianceOfficer'
      | 'strategist'
      | 'quickStart'
  ) => {
    setActiveJourney(journeyId);
    setShowJourneySelector(false);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="p-6 lg:p-8 max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent mx-auto mb-4" />
          <p className="text-neutral-500">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto" lang={language}>
      {/* ================================================================= */}
      {/* HEADER */}
      {/* ================================================================= */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            {getGreeting()}, {userName}
          </h1>
          <p className="text-neutral-500 mt-1">{t('dashboard.subtitle', { company: orgName })}</p>
          {journeyCompleted && (
            <span className="inline-flex items-center mt-2 px-2 py-0.5 rounded-full text-xs font-medium bg-success-light text-success-dark">
              ✓ {t('dashboard.journeyComplete') || 'Journey Complete'}
            </span>
          )}
        </div>
        <button
          onClick={() => {
            const ctx = {
              question: 'Provide a strategic briefing on the current state of the organization',
              sourcePage: 'Dashboard',
              contextSummary: `Health: ${healthScore.overall}%, ${alerts.filter(a => a.severity === 'critical').length} critical alerts`,
              contextData: {
                healthScore: healthScore.overall,
                dataScore: healthScore.dimensions.data.score,
                operationsScore: healthScore.dimensions.operations.score,
                securityScore: healthScore.dimensions.security.score,
                peopleScore: healthScore.dimensions.people.score,
                criticalAlerts: alerts.filter(a => a.severity === 'critical').length,
                pendingApprovals: fallbackApprovals.length,
              },
              suggestedMode: 'executive',
            };
            sessionStorage.setItem('councilQueryContext', JSON.stringify(ctx));
            navigate('/cortex/council?fromContext=true');
          }}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          💬 Ask Council
        </button>
      </div>

      {/* ================================================================= */}
      {/* ADMIN VERTICAL SELECTOR */}
      {/* ================================================================= */}
      {isAdminOrOwner && (
        <div className="mb-6 bg-gradient-to-r from-primary-50 to-violet-50 rounded-xl border border-primary-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-700">Industry Vertical</p>
                <p className="text-xs text-neutral-500">Admin: Switch verticals to preview different industry dashboards</p>
              </div>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowVerticalSelector(!showVerticalSelector)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-primary-300 rounded-lg hover:bg-primary-50 transition-colors"
              >
                <span className="text-lg">{selectedVerticalInfo.icon}</span>
                <span className="font-medium text-neutral-900">{selectedVerticalInfo.name}</span>
                <ChevronDown className={cn('w-4 h-4 text-neutral-500 transition-transform', showVerticalSelector && 'rotate-180')} />
              </button>
              
              {showVerticalSelector && (
                <div className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto bg-white rounded-xl border border-neutral-200 shadow-xl z-50">
                  <div className="p-2">
                    <p className="px-3 py-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Select Industry ({ALL_VERTICALS.length} verticals)</p>
                    {ALL_VERTICALS.map((vertical) => (
                      <button
                        key={vertical.id}
                        onClick={() => handleVerticalChange(vertical.id)}
                        className={cn(
                          'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors',
                          selectedVerticalId === vertical.id
                            ? 'bg-primary-100 text-primary-900'
                            : 'hover:bg-neutral-50 text-neutral-700'
                        )}
                      >
                        <span className="text-xl">{vertical.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{vertical.name}</p>
                          <p className="text-xs text-neutral-500 truncate">{vertical.description}</p>
                        </div>
                        {selectedVerticalId === vertical.id && (
                          <span className="text-primary-600">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          {verticalLoading && (
            <div className="mt-3 flex items-center gap-2 text-sm text-primary-600">
              <div className="animate-spin w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full" />
              <span>Updating dashboard...</span>
            </div>
          )}
        </div>
      )}

      {/* ================================================================= */}
      {/* LAYOUT MAP SELECTOR & VIEW MODE TOGGLE */}
      {/* ================================================================= */}
      <div className="mb-6 bg-neutral-50 rounded-xl border border-neutral-200 p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Layout Selector */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Map className="w-5 h-5 text-primary-600" />
              <span className="text-sm font-medium text-neutral-700">Layout:</span>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowLayoutSelector(!showLayoutSelector)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                <span className="text-lg">{selectedLayout?.icon}</span>
                <span className="font-medium text-neutral-900">{selectedLayout?.name}</span>
                <ChevronDown className={cn('w-4 h-4 text-neutral-500 transition-transform', showLayoutSelector && 'rotate-180')} />
              </button>
              
              {showLayoutSelector && (
                <div className="absolute left-0 top-full mt-2 w-72 bg-white rounded-xl border border-neutral-200 shadow-xl z-50">
                  <div className="p-2">
                    <p className="px-3 py-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      {availableLayouts.length} Layout{availableLayouts.length !== 1 ? 's' : ''} Available
                    </p>
                    {availableLayouts.map((layout) => (
                      <button
                        key={layout.id}
                        onClick={() => {
                          setSelectedLayoutId(layout.id);
                          setShowLayoutSelector(false);
                        }}
                        className={cn(
                          'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors',
                          selectedLayout?.id === layout.id
                            ? 'bg-primary-100 text-primary-900'
                            : 'hover:bg-neutral-50 text-neutral-700'
                        )}
                      >
                        <span className="text-xl">{layout.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{layout.name}</p>
                          <p className="text-xs text-neutral-500 truncate">{layout.description}</p>
                        </div>
                        {selectedLayout?.id === layout.id && (
                          <span className="text-primary-600">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-white rounded-lg border border-neutral-200 p-1">
            <button
              onClick={() => setViewMode('map')}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                viewMode === 'map'
                  ? 'bg-primary-600 text-white'
                  : 'text-neutral-600 hover:bg-neutral-100'
              )}
            >
              <Map className="w-4 h-4" />
              <span>Layout Map</span>
            </button>
            <button
              onClick={() => setViewMode('dashboard')}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                viewMode === 'dashboard'
                  ? 'bg-primary-600 text-white'
                  : 'text-neutral-600 hover:bg-neutral-100'
              )}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* VERTICAL-SPECIFIC DASHBOARD OR LAYOUT MAP */}
      {/* ================================================================= */}
      <div className="mb-8">
        {viewMode === 'map' && selectedLayout ? (
          <div className="bg-neutral-900 rounded-xl border border-neutral-700 p-6">
            <LayoutMapRenderer
              layout={selectedLayout}
              verticalId={selectedVerticalId}
            />
          </div>
        ) : (
          <VerticalDashboard overrideVerticalId={selectedVerticalId} />
        )}
      </div>

      {/* ================================================================= */}
      {/* HEALTH SCORE */}
      {/* ================================================================= */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Overall Score */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle cx="48" cy="48" r="40" fill="none" stroke="#E2E8F0" strokeWidth="8" />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  fill="none"
                  stroke={
                    healthScore.overall >= 80
                      ? '#22C55E'
                      : healthScore.overall >= 60
                        ? '#F59E0B'
                        : '#EF4444'
                  }
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${(healthScore.overall / 100) * 251.2} 251.2`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-neutral-900">{healthScore.overall}</span>
              </div>
            </div>
            <div>
              <h2
                className="text-lg font-semibold text-neutral-900"
                title="Composite of Data, Operations, Security, and People – computed from the last 7 days of signals"
              >
                {t('dashboard.health_score')} ℹ️
              </h2>
              <p className="text-sm text-success-main font-medium">
                ▲ +3 {t('dashboard.fromLastWeek')}
              </p>
            </div>
          </div>

          {/* Dimensions */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 flex-1 lg:max-w-xl">
            {Object.entries(healthScore.dimensions).map(([key, data]) => {
              const lowestScore = Math.min(
                ...Object.values(healthScore.dimensions).map((d) => d.score)
              );
              const isLowest = data.score === lowestScore;
              return (
                <div
                  key={key}
                  className={cn(
                    'text-center p-3 rounded-lg cursor-pointer transition-all hover:shadow-md group relative',
                    isLowest ? 'bg-amber-50 ring-1 ring-amber-200' : 'bg-neutral-50'
                  )}
                  onClick={() => navigate(`/cortex/intelligence/chronos?filter=${key}`)}
                  title={`Click to view ${key} events in Chronos`}
                >
                  <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">
                    {t(`dashboard.${key}`)}
                    {isLowest && <span className="ml-1 text-amber-600">⚠️</span>}
                  </p>
                  <p className="text-2xl font-bold text-neutral-900">{data.score}</p>
                  <p className={cn('text-xs font-medium', getTrendColor(data.trend, true))}>
                    {getTrendIcon(data.trend)} {Math.abs(data.change)}
                  </p>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-neutral-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    {isLowest ? 'Lowest score - click to investigate' : 'View in Chronos'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* ALERTS & APPROVALS ROW */}
      {/* ================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Active Alerts */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-900">{t('dashboard.alerts')}</h3>
            <button
              onClick={() => navigate('/cortex/pulse/alerts')}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              {t('button.view_all')} →
            </button>
          </div>

          <div className="space-y-3">
            {/* Summary badges */}
            <div className="flex gap-3 mb-4">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-error-light text-error-dark">
                🔴{' '}
                {
                  (alerts.length > 0 ? alerts : fallbackAlerts).filter(
                    (a) => a.severity === 'critical'
                  ).length
                }{' '}
                {t('dashboard.critical')}
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-warning-light text-warning-dark">
                🟡{' '}
                {
                  (alerts.length > 0 ? alerts : fallbackAlerts).filter(
                    (a) => a.severity === 'warning'
                  ).length
                }{' '}
                {t('dashboard.warning')}
              </span>
            </div>

            {/* Alert list - clickable to Chronos */}
            {(alerts.length > 0 ? alerts : fallbackAlerts).slice(0, 4).map((alert) => (
              <div
                key={alert.id}
                onClick={() =>
                  navigate(
                    `/cortex/intelligence/chronos?alertId=${alert.id}&timestamp=${alert.timestamp.toISOString()}`
                  )
                }
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-neutral-50 cursor-pointer transition-colors group"
              >
                <span
                  className={cn(
                    'mt-0.5 w-2 h-2 rounded-full flex-shrink-0',
                    alert.severity === 'critical' && 'bg-error-main',
                    alert.severity === 'warning' && 'bg-warning-main',
                    alert.severity === 'info' && 'bg-info-main'
                  )}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-neutral-900 truncate">{alert.title}</p>
                  <p className="text-xs text-neutral-500">{formatRelativeTime(alert.timestamp)}</p>
                </div>
                <span className="text-xs text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  View in Chronos →
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-900">
              {t('dashboard.pending_approvals')}
            </h3>
            <button
              onClick={() => navigate('/cortex/bridge/approvals')}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              {t('button.view_all')} →
            </button>
          </div>

          {/* Summary badges */}
          <div className="flex gap-3 mb-4">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-700">
              📋 {fallbackApprovals.filter((a) => a.type === 'workflow').length}{' '}
              {t('dashboard.workflows')}
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-secondary-50 text-secondary-700">
              👤 {fallbackApprovals.filter((a) => a.type === 'access').length}{' '}
              {t('dashboard.access')}
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-accent-50 text-accent-700">
              💰 {fallbackApprovals.filter((a) => a.type === 'budget').length}{' '}
              {t('dashboard.budget')}
            </span>
          </div>

          {/* Approval list */}
          <div className="space-y-3">
            {fallbackApprovals.slice(0, 4).map((approval) => (
              <div
                key={approval.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-50 cursor-pointer transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-neutral-900 truncate">{approval.title}</p>
                  <p className="text-xs text-neutral-500">
                    {t('dashboard.by')} {approval.requestedBy}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // In a real app, this would call workflowsApi.approve(approval.id)
                      alert(`Approved: ${approval.title}`);
                    }}
                    className="px-3 py-1 text-xs font-medium text-success-main bg-success-light rounded-md hover:bg-success-main hover:text-white transition-colors"
                  >
                    {t('dashboard.approve')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* KEY METRICS */}
      {/* ================================================================= */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">{t('dashboard.keyMetrics')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {(metrics.length > 0 ? metrics : fallbackMetrics).map((metric) => (
            <div key={metric.id} className="p-4 bg-neutral-50 rounded-lg">
              <p className="text-xs font-medium text-neutral-500 mb-1">{metric.name}</p>
              <p className="text-xl font-bold text-neutral-900">
                {metric.unit === 'USD' || metric.unit === 'USD/mo'
                  ? formatCurrency(metric.value)
                  : metric.unit === '%' || metric.unit === 'pts'
                    ? formatNumber(metric.value, 1)
                    : formatNumber(metric.value)}
                {metric.unit === '%' && '%'}
              </p>
              <p
                className={cn(
                  'text-xs font-medium mt-1',
                  metric.changeType === 'increase'
                    ? 'text-success-main'
                    : metric.changeType === 'decrease' && metric.name === 'Churn'
                      ? 'text-success-main'
                      : metric.changeType === 'decrease' && metric.name === 'Burn Rate'
                        ? 'text-success-main'
                        : 'text-error-main'
                )}
              >
                {metric.changeType === 'increase' ? '▲' : '▼'} {Math.abs(metric.change)}
                {metric.unit === '%' ? 'pp' : '%'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ================================================================= */}
      {/* ASK THE COUNCIL & ACTIVITY */}
      {/* ================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ask the Council */}
        <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">{t('dashboard.askTheCouncil')}</h3>
              <p className="text-xs text-white/60">
                Council: Multi-agent deliberation on live data
              </p>
            </div>
            <button
              onClick={() => navigate('/cortex/council?tab=decisions')}
              className="text-xs text-white/80 hover:text-white bg-white/10 px-3 py-1.5 rounded-lg transition-colors"
            >
              📝 Recent Decisions
            </button>
          </div>

          <div className="relative mb-4">
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleQuerySubmit()}
              placeholder={t('dashboard.whatToKnow')}
              className={cn(
                'w-full h-12 pl-4 pr-12 rounded-lg',
                'bg-white/10 border border-white/20',
                'text-white placeholder:text-white/60',
                'focus:outline-none focus:ring-2 focus:ring-white/30'
              )}
            />
            <button
              onClick={handleQuerySubmit}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md hover:bg-white/10"
            >
              🎤
            </button>
          </div>

          <div>
            <p className="text-sm text-white/70 mb-2">{t('dashboard.recentQueries')}</p>
            <div className="space-y-2">
              {recentQueries.map((query, i) => (
                <button
                  key={i}
                  onClick={() => setQueryInput(query)}
                  className="block w-full text-left text-sm text-white/90 hover:text-white hover:bg-white/10 px-3 py-2 rounded-md transition-colors"
                >
                  "{query}"
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-900">
              {t('dashboard.recentActivity')}
            </h3>
            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              {t('dashboard.viewFullLog')} →
            </button>
          </div>

          <div className="space-y-3">
            {fallbackActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <span
                  className={cn(
                    'mt-1.5 w-2 h-2 rounded-full flex-shrink-0',
                    activity.type === 'success' && 'bg-success-main',
                    activity.type === 'info' && 'bg-info-main',
                    activity.type === 'warning' && 'bg-warning-main',
                    activity.type === 'error' && 'bg-error-main'
                  )}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-neutral-700">{activity.message}</p>
                  <p className="text-xs text-neutral-400">
                    {formatRelativeTime(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* USER JOURNEY / STORYBOARD */}
      {/* ================================================================= */}

      {/* Start Journey Button (shown when no journey active) */}
      {!activeJourney && !showJourneySelector && (
        <button
          onClick={() => setShowJourneySelector(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          <Compass className="w-5 h-5" />
          <span className="font-medium">Start Your Journey</span>
        </button>
      )}

      {/* Journey Selector Modal */}
      {showJourneySelector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden">
            <div className="bg-gradient-to-r from-primary-600 to-primary-500 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Choose Your Journey</h2>
                <p className="text-primary-100 text-sm mt-1">
                  Select a guided experience tailored to your role
                </p>
              </div>
              <button
                onClick={() => setShowJourneySelector(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <NarrativeSelector onSelect={handleSelectJourney} />
            </div>
          </div>
        </div>
      )}

      {/* Active Journey Guide (Floating) */}
      {activeJourney && (
        <NarrativeGuide
          narrativeId={activeJourney}
          variant="floating"
          onComplete={handleJourneyComplete}
        />
      )}
    </div>
  );
};

export default DashboardPage;
