// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIA MESH™ - CROSS-COMPANY DECISION NETWORK
// Secure Decision-Sharing Network with Differential Privacy
// "Palantir Foundry + McKinsey Insights + Network Effects"
//
// CAPABILITIES:
// - Anonymized performance benchmarking
// - Industry pattern detection
// - Risk signal aggregation
// - Pricing intelligence
// - Supply chain disruption alerts
// - Fraud detection patterns
// - Differential privacy protection
// =============================================================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { meshApi } from '../../../lib/api';
import { deterministicFloat, deterministicInt } from '../../../lib/deterministic';

// =============================================================================
// TYPES
// =============================================================================

type Industry =
  | 'technology'
  | 'finance'
  | 'healthcare'
  | 'manufacturing'
  | 'retail'
  | 'energy'
  | 'aerospace'
  | 'pharma';
type SignalSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';
type InsightCategory = 'benchmark' | 'risk' | 'opportunity' | 'trend' | 'disruption' | 'fraud';

interface NetworkNode {
  id: string;
  industry: Industry;
  region: string;
  employeeRange: string;
  revenueRange: string;
  contributionScore: number;
  dataQuality: number;
  lastActive: Date;
  anonymousId: string;
}

interface BenchmarkMetric {
  id: string;
  name: string;
  category: string;
  yourValue: number;
  industryP25: number;
  industryP50: number;
  industryP75: number;
  industryP90: number;
  trend: 'up' | 'down' | 'stable';
  trendPercent: number;
  unit: string;
  participants: number;
}

interface RiskSignal {
  id: string;
  title: string;
  description: string;
  category: InsightCategory;
  severity: SignalSeverity;
  affectedIndustries: Industry[];
  affectedRegions: string[];
  confidence: number;
  sources: number;
  detectedAt: Date;
  validUntil: Date;
  recommendations: string[];
  relatedSignals: string[];
}

interface IndustryPattern {
  id: string;
  name: string;
  description: string;
  industry: Industry;
  adoptionRate: number;
  avgImpact: number;
  riskLevel: 'low' | 'medium' | 'high';
  timeToValue: string;
  examples: string[];
  relatedPatterns: string[];
}

interface PricingIntelligence {
  id: string;
  category: string;
  product: string;
  yourPrice: number;
  marketP25: number;
  marketP50: number;
  marketP75: number;
  trend: 'rising' | 'falling' | 'stable';
  volatility: 'low' | 'medium' | 'high';
  forecast30d: number;
  forecast90d: number;
  currency: string;
  lastUpdated: Date;
}

interface SupplyChainAlert {
  id: string;
  title: string;
  description: string;
  severity: SignalSeverity;
  affectedSuppliers: number;
  affectedRegions: string[];
  estimatedImpact: string;
  mitigationOptions: string[];
  detectedAt: Date;
  expectedDuration: string;
}

interface FraudPattern {
  id: string;
  name: string;
  description: string;
  detectionRate: number;
  falsePositiveRate: number;
  affectedIndustries: Industry[];
  indicators: string[];
  recommendedActions: string[];
  reportingOrgs: number;
}

interface NetworkStats {
  totalParticipants: number;
  activeToday: number;
  dataPointsShared: number;
  insightsGenerated: number;
  avgResponseTime: number;
  privacyScore: number;
  uptime: number;
}

// =============================================================================
// MOCK DATA
// =============================================================================

const INDUSTRY_CONFIG: Record<Industry, { icon: string; color: string; name: string }> = {
  technology: { icon: '💻', color: 'from-blue-600 to-cyan-600', name: 'Technology' },
  finance: { icon: '🏦', color: 'from-green-600 to-emerald-600', name: 'Financial Services' },
  healthcare: { icon: '🏥', color: 'from-red-600 to-rose-600', name: 'Healthcare' },
  manufacturing: { icon: '🏭', color: 'from-amber-600 to-orange-600', name: 'Manufacturing' },
  retail: { icon: '🛍️', color: 'from-purple-600 to-pink-600', name: 'Retail' },
  energy: { icon: '⚡', color: 'from-yellow-600 to-amber-600', name: 'Energy' },
  aerospace: { icon: '✈️', color: 'from-slate-600 to-gray-600', name: 'Aerospace & Defense' },
  pharma: { icon: '💊', color: 'from-teal-600 to-cyan-600', name: 'Pharmaceuticals' },
};

const generateNetworkStats = (): NetworkStats => ({
  totalParticipants: 2847,
  activeToday: 1893,
  dataPointsShared: 47823000,
  insightsGenerated: 12456,
  avgResponseTime: 45,
  privacyScore: 99.97,
  uptime: 99.99,
});

const generateBenchmarks = (): BenchmarkMetric[] => [
  {
    id: 'rev-growth',
    name: 'Revenue Growth Rate',
    category: 'Financial',
    yourValue: 18.5,
    industryP25: 8.2,
    industryP50: 12.4,
    industryP75: 19.8,
    industryP90: 32.1,
    trend: 'up',
    trendPercent: 2.3,
    unit: '%',
    participants: 847,
  },
  {
    id: 'gross-margin',
    name: 'Gross Margin',
    category: 'Financial',
    yourValue: 68.2,
    industryP25: 45.0,
    industryP50: 58.5,
    industryP75: 72.0,
    industryP90: 82.5,
    trend: 'stable',
    trendPercent: 0.5,
    unit: '%',
    participants: 834,
  },
  {
    id: 'employee-growth',
    name: 'Employee Growth Rate',
    category: 'HR',
    yourValue: 12.0,
    industryP25: 3.5,
    industryP50: 8.2,
    industryP75: 15.0,
    industryP90: 25.0,
    trend: 'down',
    trendPercent: -4.2,
    unit: '%',
    participants: 756,
  },
  {
    id: 'customer-retention',
    name: 'Customer Retention Rate',
    category: 'Sales',
    yourValue: 94.5,
    industryP25: 78.0,
    industryP50: 85.5,
    industryP75: 92.0,
    industryP90: 97.0,
    trend: 'up',
    trendPercent: 1.8,
    unit: '%',
    participants: 623,
  },
  {
    id: 'sales-efficiency',
    name: 'Sales Efficiency Ratio',
    category: 'Sales',
    yourValue: 1.2,
    industryP25: 0.6,
    industryP50: 0.9,
    industryP75: 1.3,
    industryP90: 1.8,
    trend: 'up',
    trendPercent: 8.5,
    unit: 'x',
    participants: 589,
  },
  {
    id: 'r-d-intensity',
    name: 'R&D Intensity',
    category: 'Operations',
    yourValue: 22.0,
    industryP25: 8.0,
    industryP50: 15.0,
    industryP75: 25.0,
    industryP90: 35.0,
    trend: 'stable',
    trendPercent: 0.2,
    unit: '% of Rev',
    participants: 445,
  },
  {
    id: 'time-to-hire',
    name: 'Average Time to Hire',
    category: 'HR',
    yourValue: 32,
    industryP25: 55,
    industryP50: 42,
    industryP75: 28,
    industryP90: 18,
    trend: 'down',
    trendPercent: -12.0,
    unit: 'days',
    participants: 678,
  },
  {
    id: 'nps',
    name: 'Net Promoter Score',
    category: 'Customer',
    yourValue: 45,
    industryP25: 15,
    industryP50: 32,
    industryP75: 48,
    industryP90: 65,
    trend: 'up',
    trendPercent: 5.0,
    unit: '',
    participants: 534,
  },
];

const generateRiskSignals = (): RiskSignal[] => [
  {
    id: 'sig-001',
    title: 'Semiconductor Supply Chain Disruption',
    description:
      'Multiple tier-2 suppliers in Taiwan reporting capacity constraints due to power grid issues. Expected 15-20% reduction in chip availability for Q1 2025.',
    category: 'disruption',
    severity: 'high',
    affectedIndustries: ['technology', 'manufacturing', 'aerospace'],
    affectedRegions: ['APAC', 'North America', 'Europe'],
    confidence: 87,
    sources: 145,
    detectedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    recommendations: [
      'Review safety stock levels for semiconductor-dependent products',
      'Engage backup suppliers immediately',
      'Consider temporary product mix adjustments',
    ],
    relatedSignals: ['sig-004', 'sig-007'],
  },
  {
    id: 'sig-002',
    title: 'Healthcare Cybersecurity Threat Escalation',
    description:
      'Coordinated ransomware campaign targeting healthcare organizations. 23 incidents reported in past 72 hours across network participants.',
    category: 'risk',
    severity: 'critical',
    affectedIndustries: ['healthcare', 'pharma'],
    affectedRegions: ['North America', 'Europe'],
    confidence: 94,
    sources: 89,
    detectedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    recommendations: [
      'Implement emergency patching protocol',
      'Activate incident response team',
      'Review backup integrity',
      'Brief executive team on potential impact',
    ],
    relatedSignals: ['sig-008'],
  },
  {
    id: 'sig-003',
    title: 'Enterprise AI Adoption Acceleration',
    description:
      'Network data shows 340% increase in enterprise AI deployment plans for 2025. Companies not investing facing competitive disadvantage signals.',
    category: 'trend',
    severity: 'medium',
    affectedIndustries: ['technology', 'finance', 'healthcare', 'manufacturing', 'retail'],
    affectedRegions: ['Global'],
    confidence: 92,
    sources: 423,
    detectedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    recommendations: [
      'Assess current AI capabilities and gaps',
      'Develop 12-month AI roadmap',
      'Evaluate build vs. buy decisions',
    ],
    relatedSignals: ['sig-005'],
  },
  {
    id: 'sig-004',
    title: 'Payment Fraud Pattern: New Vector',
    description:
      'Novel fraud pattern detected across 47 financial institutions. Synthetic identity combined with instant payment rails. Average loss per incident: $47K.',
    category: 'fraud',
    severity: 'high',
    affectedIndustries: ['finance', 'retail'],
    affectedRegions: ['North America'],
    confidence: 89,
    sources: 67,
    detectedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    recommendations: [
      'Update fraud detection rules',
      'Implement additional velocity checks',
      'Review instant payment controls',
    ],
    relatedSignals: [],
  },
  {
    id: 'sig-005',
    title: 'Labor Market Cooling in Tech Sector',
    description:
      'Hiring velocity down 28% QoQ across technology sector. Salary growth decelerating. Opportunity for strategic hiring.',
    category: 'opportunity',
    severity: 'info',
    affectedIndustries: ['technology'],
    affectedRegions: ['North America', 'Europe'],
    confidence: 96,
    sources: 234,
    detectedAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
    validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    recommendations: [
      'Review compensation benchmarks',
      'Accelerate strategic hiring plans',
      'Consider opportunistic talent acquisition',
    ],
    relatedSignals: [],
  },
];

const generatePricingIntel = (): PricingIntelligence[] => [
  {
    id: 'price-001',
    category: 'Cloud Services',
    product: 'Enterprise Cloud Compute',
    yourPrice: 0.085,
    marketP25: 0.072,
    marketP50: 0.089,
    marketP75: 0.112,
    trend: 'falling',
    volatility: 'medium',
    forecast30d: 0.082,
    forecast90d: 0.078,
    currency: 'USD/hour',
    lastUpdated: new Date(),
  },
  {
    id: 'price-002',
    category: 'SaaS Licensing',
    product: 'Enterprise CRM',
    yourPrice: 150,
    marketP25: 125,
    marketP50: 175,
    marketP75: 225,
    trend: 'rising',
    volatility: 'low',
    forecast30d: 155,
    forecast90d: 165,
    currency: 'USD/user/mo',
    lastUpdated: new Date(),
  },
  {
    id: 'price-003',
    category: 'Professional Services',
    product: 'Management Consulting',
    yourPrice: 450,
    marketP25: 350,
    marketP50: 425,
    marketP75: 550,
    trend: 'stable',
    volatility: 'low',
    forecast30d: 450,
    forecast90d: 460,
    currency: 'USD/hour',
    lastUpdated: new Date(),
  },
];

const generateSupplyChainAlerts = (): SupplyChainAlert[] => [
  {
    id: 'sc-001',
    title: 'Port of Rotterdam Congestion',
    description:
      'Container processing delays of 4-6 days due to labor action. Affecting 23% of European shipments.',
    severity: 'high',
    affectedSuppliers: 156,
    affectedRegions: ['Europe', 'UK'],
    estimatedImpact: '8-12% increase in logistics costs',
    mitigationOptions: [
      'Reroute via Hamburg',
      'Air freight for critical items',
      'Increase safety stock',
    ],
    detectedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    expectedDuration: '7-14 days',
  },
  {
    id: 'sc-002',
    title: 'Rare Earth Materials Shortage',
    description:
      'China export restrictions impacting rare earth supply. 3-month lead time increase expected.',
    severity: 'critical',
    affectedSuppliers: 89,
    affectedRegions: ['Global'],
    estimatedImpact: '25-40% price increase, production delays',
    mitigationOptions: [
      'Qualify alternative suppliers',
      'Product redesign',
      'Strategic stockpiling',
    ],
    detectedAt: new Date(Date.now() - 72 * 60 * 60 * 1000),
    expectedDuration: '6-12 months',
  },
];

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const MeshPage: React.FC = () => {
  const navigate = useNavigate();
  const [networkStats, setNetworkStats] = useState<NetworkStats>(generateNetworkStats);
  const [benchmarks, setBenchmarks] = useState<BenchmarkMetric[]>(generateBenchmarks);
  const [riskSignals, setRiskSignals] = useState<RiskSignal[]>(generateRiskSignals);
  const [pricingIntel] = useState<PricingIntelligence[]>(generatePricingIntel);
  const [supplyChainAlerts] = useState<SupplyChainAlert[]>(generateSupplyChainAlerts);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'benchmarks' | 'signals' | 'pricing' | 'supply-chain'
  >('overview');
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        // Fetch network stats
        const statsRes = await meshApi.getStats();
        if (statsRes.success && statsRes.data) {
          setNetworkStats({
            totalParticipants: statsRes.data.total_participants,
            activeToday: statsRes.data.active_today,
            dataPointsShared: statsRes.data.data_points_shared,
            insightsGenerated: statsRes.data.insights_generated,
            avgResponseTime: statsRes.data.avg_response_ms,
            privacyScore: statsRes.data.privacy_score,
            uptime: statsRes.data.uptime_percent,
          });
        }

        // Fetch benchmarks
        const benchRes = await meshApi.getBenchmarks();
        if (benchRes.success && benchRes.data && Array.isArray(benchRes.data)) {
          const mappedBenchmarks = benchRes.data.map((b: any) => ({
            id: b.id,
            name: b.name,
            category: b.category,
            yourValue: b.p50_value * (0.9 + deterministicFloat('mesh-1') * 0.3), // Simulated "your value"
            industryP25: b.p25_value,
            industryP50: b.p50_value,
            industryP75: b.p75_value,
            industryP90: b.p90_value,
            trend: b.trend as 'up' | 'down' | 'stable',
            trendPercent: b.trend_percent,
            unit: b.unit,
            participants: b.participants,
          }));
          // Group by unique name (take first of each name)
          const uniqueBenchmarks = mappedBenchmarks.reduce(
            (acc: BenchmarkMetric[], curr: BenchmarkMetric) => {
              if (!acc.find((b) => b.name === curr.name)) {
                acc.push(curr);
              }
              return acc;
            },
            []
          );
          setBenchmarks(uniqueBenchmarks.slice(0, 8));
        }

        // Fetch risk signals
        const signalsRes = await meshApi.getRiskSignals({ active: true });
        if (signalsRes.success && signalsRes.data && Array.isArray(signalsRes.data)) {
          const mappedSignals = signalsRes.data.map((s: any) => ({
            id: s.id,
            title: s.title,
            description: s.description,
            category: s.category as InsightCategory,
            severity: s.severity as SignalSeverity,
            affectedIndustries: s.affected_industries || [],
            affectedRegions: s.affected_regions || [],
            confidence: s.confidence,
            sources: s.sources,
            detectedAt: new Date(s.detected_at),
            validUntil: new Date(s.valid_until),
            recommendations: s.recommendations || [],
            relatedSignals: [],
          }));
          setRiskSignals(mappedSignals);
        }
      } catch (error) {
        console.error('[Mesh] Data load error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const criticalSignals = riskSignals.filter(
    (s) => s.severity === 'critical' || s.severity === 'high'
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-950 via-blue-950 to-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-cyan-800/50 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
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
                  <span className="text-3xl">🕸️</span>
                  CendiaMesh™
                  <span className="text-xs bg-gradient-to-r from-cyan-500 to-blue-500 px-2 py-0.5 rounded-full font-medium">
                    NETWORK
                  </span>
                </h1>
                <p className="text-cyan-300 text-sm">
                  Cross-Company Decision Network • Differential Privacy Protected
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-sm text-green-400">Network Active</span>
              </div>
              <div className="text-right">
                <div className="text-sm text-white/60">Privacy Score</div>
                <div className="text-xl font-bold text-green-400">{networkStats.privacyScore}%</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Network Stats Bar */}
      <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border-b border-cyan-800/30">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="grid grid-cols-7 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-white">
                {networkStats.totalParticipants.toLocaleString()}
              </div>
              <div className="text-xs text-cyan-300">Network Participants</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">
                {networkStats.activeToday.toLocaleString()}
              </div>
              <div className="text-xs text-cyan-300">Active Today</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {(networkStats.dataPointsShared / 1000000).toFixed(1)}M
              </div>
              <div className="text-xs text-cyan-300">Data Points</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">
                {networkStats.insightsGenerated.toLocaleString()}
              </div>
              <div className="text-xs text-cyan-300">Insights Generated</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-400">{criticalSignals.length}</div>
              <div className="text-xs text-cyan-300">Active Alerts</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-cyan-400">
                {networkStats.avgResponseTime}ms
              </div>
              <div className="text-xs text-cyan-300">Avg Response</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-400">{networkStats.uptime}%</div>
              <div className="text-xs text-cyan-300">Uptime</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-cyan-800/30 bg-black/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {[
              { id: 'overview', label: 'Network Overview', icon: '🌐' },
              { id: 'benchmarks', label: 'Benchmarking', icon: '🔒' },
              { id: 'signals', label: 'Risk Signals', icon: '⚠️' },
              { id: 'pricing', label: 'Pricing Intelligence', icon: '💰' },
              { id: 'supply-chain', label: 'Supply Chain', icon: '🔗' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-cyan-400 text-white bg-cyan-900/20'
                    : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Privacy Notice */}
            <div className="bg-gradient-to-r from-emerald-900/30 to-green-900/30 rounded-2xl p-6 border border-emerald-700/50">
              <div className="flex items-center gap-4">
                <div className="text-4xl">🔐</div>
                <div>
                  <h2 className="text-lg font-semibold mb-1">Differential Privacy Protected</h2>
                  <p className="text-white/60 text-sm">
                    All data shared on CendiaMesh is protected by differential privacy. Individual
                    company data cannot be reverse-engineered from aggregate insights. Your
                    participation strengthens the network while maintaining complete
                    confidentiality.
                  </p>
                </div>
              </div>
            </div>

            {/* Critical Alerts */}
            {criticalSignals.length > 0 && (
              <div className="bg-black/30 rounded-2xl p-6 border border-red-800/50">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="text-red-400">🚨</span> Critical Alerts
                </h2>
                <div className="space-y-3">
                  {criticalSignals.slice(0, 3).map((signal) => (
                    <div
                      key={signal.id}
                      className={`p-4 rounded-xl border ${
                        signal.severity === 'critical'
                          ? 'bg-red-900/20 border-red-700/50'
                          : 'bg-amber-900/20 border-amber-700/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{signal.title}</h3>
                        <span
                          className={`px-2 py-0.5 rounded text-xs ${
                            signal.severity === 'critical' ? 'bg-red-600' : 'bg-amber-600'
                          }`}
                        >
                          {signal.severity.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-white/70 mb-2">{signal.description}</p>
                      <div className="flex items-center gap-4 text-xs text-white/50">
                        <span>Confidence: {signal.confidence}%</span>
                        <span>Sources: {signal.sources}</span>
                        <span>
                          Detected:{' '}
                          {Math.floor((Date.now() - signal.detectedAt.getTime()) / 3600000)}h ago
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Industry Distribution */}
            <div className="grid grid-cols-4 gap-4">
              {(Object.keys(INDUSTRY_CONFIG) as Industry[]).map((industry) => {
                const config = INDUSTRY_CONFIG[industry];
                const participants = Math.floor(
                  networkStats.totalParticipants * (0.08 + deterministicFloat('mesh-2') * 0.12)
                );
                return (
                  <div
                    key={industry}
                    onClick={() => setSelectedIndustry(industry)}
                    className={`bg-black/30 rounded-xl p-4 border cursor-pointer transition-all ${
                      selectedIndustry === industry
                        ? 'border-cyan-400 ring-2 ring-cyan-400/20'
                        : 'border-cyan-800/50 hover:border-cyan-600'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`w-10 h-10 rounded-lg bg-gradient-to-br ${config.color} flex items-center justify-center text-xl`}
                      >
                        {config.icon}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{config.name}</div>
                        <div className="text-xs text-white/50">{participants} participants</div>
                      </div>
                    </div>
                    <div className="h-1.5 bg-black/30 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${config.color}`}
                        style={{
                          width: `${(participants / networkStats.totalParticipants) * 100 * 5}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-black/30 rounded-2xl p-6 border border-cyan-800/50">
                <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">
                  Your Benchmarks
                </h3>
                <div className="space-y-3">
                  {benchmarks.slice(0, 4).map((b) => (
                    <div key={b.id} className="flex items-center justify-between">
                      <span className="text-sm text-white/70">{b.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">
                          {b.yourValue}
                          {b.unit}
                        </span>
                        <span
                          className={`text-xs ${
                            b.yourValue >= b.industryP75
                              ? 'text-green-400'
                              : b.yourValue >= b.industryP50
                                ? 'text-amber-400'
                                : 'text-red-400'
                          }`}
                        >
                          {b.yourValue >= b.industryP75
                            ? 'Top 25%'
                            : b.yourValue >= b.industryP50
                              ? 'Above Median'
                              : 'Below Median'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-black/30 rounded-2xl p-6 border border-cyan-800/50">
                <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">
                  Recent Insights
                </h3>
                <div className="space-y-3">
                  {riskSignals.slice(0, 4).map((s) => (
                    <div key={s.id} className="flex items-start gap-3">
                      <span
                        className={`text-lg ${
                          s.category === 'risk'
                            ? '⚠️'
                            : s.category === 'opportunity'
                              ? '💡'
                              : s.category === 'trend'
                                ? '📈'
                                : s.category === 'fraud'
                                  ? '🚨'
                                  : '🔔'
                        }`}
                      />
                      <div>
                        <div className="text-sm font-medium">{s.title}</div>
                        <div className="text-xs text-white/50">
                          {s.affectedIndustries.length} industries affected
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-black/30 rounded-2xl p-6 border border-cyan-800/50">
                <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">
                  Network Activity
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/70">Data contributions today</span>
                    <span className="font-bold text-cyan-400">12,456</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/70">New insights this week</span>
                    <span className="font-bold text-purple-400">847</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/70">Your contribution rank</span>
                    <span className="font-bold text-amber-400">Top 5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/70">Insights consumed</span>
                    <span className="font-bold text-green-400">234</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'benchmarks' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-2xl p-6 border border-cyan-700/50">
              <h2 className="text-lg font-semibold mb-2">🔒 Anonymized Performance Benchmarking</h2>
              <p className="text-white/60">
                Compare your performance against industry peers across key metrics. All data is
                aggregated and anonymized— individual company data is never exposed.
              </p>
            </div>

            <div className="space-y-4">
              {benchmarks.map((b) => (
                <div key={b.id} className="bg-black/30 rounded-2xl p-6 border border-cyan-800/50">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{b.name}</h3>
                      <div className="text-sm text-white/50">
                        {b.category} • {b.participants} participants
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold">
                        {b.yourValue}
                        {b.unit}
                      </div>
                      <div
                        className={`text-sm flex items-center gap-1 justify-end ${
                          b.trend === 'up'
                            ? 'text-green-400'
                            : b.trend === 'down'
                              ? 'text-red-400'
                              : 'text-white/50'
                        }`}
                      >
                        {b.trend === 'up' ? '↑' : b.trend === 'down' ? '↓' : '→'}
                        {Math.abs(b.trendPercent)}% vs last quarter
                      </div>
                    </div>
                  </div>

                  {/* Percentile Visualization */}
                  <div className="relative h-8 bg-black/30 rounded-full overflow-hidden mb-2">
                    <div className="absolute inset-0 flex">
                      <div className="bg-red-900/50 h-full" style={{ width: '25%' }} />
                      <div className="bg-amber-900/50 h-full" style={{ width: '25%' }} />
                      <div className="bg-green-900/50 h-full" style={{ width: '25%' }} />
                      <div className="bg-emerald-900/50 h-full" style={{ width: '25%' }} />
                    </div>
                    <div
                      className="absolute top-0 bottom-0 w-1 bg-white shadow-lg shadow-white/50"
                      style={{
                        left: `${Math.min(
                          100,
                          Math.max(
                            0,
                            ((b.yourValue - b.industryP25) / (b.industryP90 - b.industryP25)) * 75 +
                              25
                          )
                        )}%`,
                      }}
                    />
                  </div>

                  <div className="flex justify-between text-xs text-white/50">
                    <span>
                      P25: {b.industryP25}
                      {b.unit}
                    </span>
                    <span>
                      P50: {b.industryP50}
                      {b.unit}
                    </span>
                    <span>
                      P75: {b.industryP75}
                      {b.unit}
                    </span>
                    <span>
                      P90: {b.industryP90}
                      {b.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'signals' && (
          <div className="space-y-4">
            {riskSignals.map((signal) => (
              <div
                key={signal.id}
                className={`bg-black/30 rounded-2xl p-6 border ${
                  signal.severity === 'critical'
                    ? 'border-red-700/50'
                    : signal.severity === 'high'
                      ? 'border-amber-700/50'
                      : signal.severity === 'medium'
                        ? 'border-yellow-700/50'
                        : 'border-cyan-800/50'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {signal.category === 'risk'
                        ? '⚠️'
                        : signal.category === 'opportunity'
                          ? '💡'
                          : signal.category === 'trend'
                            ? '📈'
                            : signal.category === 'fraud'
                              ? '🚨'
                              : signal.category === 'disruption'
                                ? '⛈️'
                                : '📢'}
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold">{signal.title}</h3>
                      <div className="text-sm text-white/50">
                        Confidence: {signal.confidence}% • {signal.sources} sources
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-lg text-sm ${
                      signal.severity === 'critical'
                        ? 'bg-red-600'
                        : signal.severity === 'high'
                          ? 'bg-amber-600'
                          : signal.severity === 'medium'
                            ? 'bg-yellow-600'
                            : signal.severity === 'low'
                              ? 'bg-blue-600'
                              : 'bg-neutral-600'
                    }`}
                  >
                    {signal.severity.toUpperCase()}
                  </span>
                </div>

                <p className="text-white/70 mb-4">{signal.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-white/50 mb-1">Affected Industries</div>
                    <div className="flex flex-wrap gap-1">
                      {signal.affectedIndustries.map((ind) => (
                        <span key={ind} className="text-xs px-2 py-1 bg-cyan-900/50 rounded">
                          {INDUSTRY_CONFIG[ind].icon} {INDUSTRY_CONFIG[ind].name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-white/50 mb-1">Affected Regions</div>
                    <div className="flex flex-wrap gap-1">
                      {signal.affectedRegions.map((reg) => (
                        <span key={reg} className="text-xs px-2 py-1 bg-blue-900/50 rounded">
                          {reg}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-black/20 rounded-xl p-4">
                  <div className="text-xs text-white/50 mb-2">Recommended Actions</div>
                  <ul className="space-y-1">
                    {signal.recommendations.map((rec, idx) => (
                      <li key={idx} className="text-sm flex items-center gap-2">
                        <span className="text-green-400">→</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-2xl p-6 border border-green-700/50">
              <h2 className="text-lg font-semibold mb-2">💰 Pricing Intelligence</h2>
              <p className="text-white/60">
                Real-time market pricing data aggregated from network participants. Use these
                insights for procurement negotiations, pricing strategy, and competitive analysis.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {pricingIntel.map((price) => (
                <div
                  key={price.id}
                  className="bg-black/30 rounded-2xl p-6 border border-cyan-800/50"
                >
                  <div className="text-xs text-white/50 mb-1">{price.category}</div>
                  <h3 className="text-lg font-semibold mb-4">{price.product}</h3>

                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold">${price.yourPrice}</div>
                    <div className="text-sm text-white/50">{price.currency}</div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Market P25</span>
                      <span>${price.marketP25}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Market P50</span>
                      <span>${price.marketP50}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Market P75</span>
                      <span>${price.marketP75}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-cyan-800/30">
                    <div className="text-center">
                      <div
                        className={`text-lg font-bold ${
                          price.forecast30d < price.yourPrice ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        ${price.forecast30d}
                      </div>
                      <div className="text-xs text-white/50">30d Forecast</div>
                    </div>
                    <div className="text-center">
                      <div
                        className={`text-lg font-bold ${
                          price.forecast90d < price.yourPrice ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        ${price.forecast90d}
                      </div>
                      <div className="text-xs text-white/50">90d Forecast</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 mt-4">
                    <span
                      className={`px-2 py-0.5 rounded text-xs ${
                        price.trend === 'rising'
                          ? 'bg-red-900 text-red-300'
                          : price.trend === 'falling'
                            ? 'bg-green-900 text-green-300'
                            : 'bg-neutral-800 text-neutral-300'
                      }`}
                    >
                      {price.trend}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs ${
                        price.volatility === 'high'
                          ? 'bg-amber-900 text-amber-300'
                          : price.volatility === 'medium'
                            ? 'bg-yellow-900 text-yellow-300'
                            : 'bg-blue-900 text-blue-300'
                      }`}
                    >
                      {price.volatility} volatility
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'supply-chain' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 rounded-2xl p-6 border border-amber-700/50">
              <h2 className="text-lg font-semibold mb-2">🔗 Supply Chain Intelligence</h2>
              <p className="text-white/60">
                Early warning system for supply chain disruptions based on aggregated network data.
                Get ahead of issues before they impact your operations.
              </p>
            </div>

            <div className="space-y-4">
              {supplyChainAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`bg-black/30 rounded-2xl p-6 border ${
                    alert.severity === 'critical'
                      ? 'border-red-700/50'
                      : alert.severity === 'high'
                        ? 'border-amber-700/50'
                        : 'border-cyan-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{alert.title}</h3>
                      <div className="text-sm text-white/50">
                        {alert.affectedSuppliers} suppliers affected • Expected duration:{' '}
                        {alert.expectedDuration}
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-lg text-sm ${
                        alert.severity === 'critical'
                          ? 'bg-red-600'
                          : alert.severity === 'high'
                            ? 'bg-amber-600'
                            : 'bg-blue-600'
                      }`}
                    >
                      {alert.severity.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-white/70 mb-4">{alert.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-black/20 rounded-xl p-3">
                      <div className="text-xs text-white/50 mb-1">Estimated Impact</div>
                      <div className="font-medium text-amber-400">{alert.estimatedImpact}</div>
                    </div>
                    <div className="bg-black/20 rounded-xl p-3">
                      <div className="text-xs text-white/50 mb-1">Affected Regions</div>
                      <div className="flex flex-wrap gap-1">
                        {alert.affectedRegions.map((reg) => (
                          <span key={reg} className="text-xs px-2 py-0.5 bg-cyan-900/50 rounded">
                            {reg}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/20 rounded-xl p-4">
                    <div className="text-xs text-white/50 mb-2">Mitigation Options</div>
                    <div className="flex flex-wrap gap-2">
                      {alert.mitigationOptions.map((opt, idx) => (
                        <span key={idx} className="px-3 py-1.5 bg-green-900/50 rounded-lg text-sm">
                          {opt}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MeshPage;
