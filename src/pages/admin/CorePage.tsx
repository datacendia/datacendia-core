// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA CORE - INTERNAL ADMIN PAGE
// "Dogfooding" - Datacendia runs on Datacendia
// The secret admin panel for running the company itself
// =============================================================================

import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import {
  Megaphone,
  Hammer,
  DollarSign,
  HeadphonesIcon,
  Eye,
  TrendingUp,
  AlertTriangle,
  Calendar,
  FileText,
  Users,
  Target,
  Zap,
  Brain,
  Shield,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  Clock,
  Send,
  BarChart3,
  Sparkles,
  Crown,
  MessageSquare,
  Settings,
  ChevronRight,
  Server,
  Database,
  HardDrive,
  Activity,
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';

// =============================================================================
// TYPES
// =============================================================================

interface CoreMetrics {
  brand: {
    contentQueue: number;
    scheduledPosts: number;
    voiceScore: number;
  };
  foundry: {
    backlogItems: number;
    technicalDebt: number;
    topPriority: string | null;
    nagMessage: string | null;
  };
  revenue: {
    mrr: number;
    arr: number;
    runwayMonths: number;
    pricingAdvice: string | null;
  };
  support: {
    openTickets: number;
    atRiskCustomers: number;
    avgResponseTime: number;
  };
  watch: {
    activeAlerts: number;
    criticalAlert: string | null;
    competitorsTracked: number;
  };
}

interface ContentItem {
  id: string;
  type: 'linkedin' | 'twitter' | 'blog' | 'newsletter';
  title: string;
  status: 'draft' | 'approved' | 'scheduled';
  scheduledFor?: string;
}

// =============================================================================
// CORE SERVICE CARDS
// =============================================================================

const CoreServices = [
  {
    id: 'brand',
    name: 'CendiaBrand™',
    agent: 'The Evangelist',
    icon: Megaphone,
    color: '#8B5CF6',
    description:
      'Automated self-branding & marketing. Content generation, voice guard, launch timing.',
    features: ['Content Engine', 'Voice Guard', 'Hype Cycle'],
  },
  {
    id: 'foundry',
    name: 'CendiaFoundry™',
    agent: 'The Architect',
    icon: Hammer,
    color: '#F59E0B',
    description: 'Product management & R&D. Feature prioritization, technical debt tracking.',
    features: ['Feature Prioritization', 'Technical Debt', '20-Year Vision'],
  },
  {
    id: 'revenue',
    name: 'CendiaRevenue™',
    agent: 'The Treasurer',
    icon: DollarSign,
    color: '#10B981',
    description: 'Financial ops for the founder. Runway calculator, pricing optimizer.',
    features: ['Stripe Sync', 'Runway Calculator', 'Pricing Optimizer'],
  },
  {
    id: 'support',
    name: 'CendiaSupport™',
    agent: 'The Caretaker',
    icon: HeadphonesIcon,
    color: '#3B82F6',
    description: 'Automated customer success. Ticket triage, churn prediction.',
    features: ['Ticket Triage', 'Churn Predictor', 'Auto-Responses'],
  },
  {
    id: 'watch',
    name: 'CendiaWatch™',
    agent: 'The Sentry',
    icon: Eye,
    color: '#EF4444',
    description: 'Competitor & market surveillance. Real-time monitoring and alerts.',
    features: ['Radar', 'Competitor Tracking', 'Threat Alerts'],
  },
];

// =============================================================================
// COMPONENT
// =============================================================================

export default function CorePage() {
  const [metrics, setMetrics] = useState<CoreMetrics | null>(null);
  const [activeService, setActiveService] = useState<string>('brand');
  const [contentQueue, setContentQueue] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    setLoading(true);
    try {
      // Fetch real data from Core API
      const [dashboardRes, contentRes] = await Promise.all([
        api.get<any>('/core/dashboard'),
        api.get<any>('/core/brand/content'),
      ]);

      const dashPayload = dashboardRes as any;
      const rawDashboard = dashPayload.dashboard ?? dashPayload.data?.dashboard;
      if (dashPayload.success !== false && rawDashboard) {
        setMetrics({
          brand: rawDashboard.brand || { contentQueue: 0, scheduledPosts: 0, voiceScore: 0 },
          foundry: rawDashboard.foundry || {
            backlogItems: 0,
            technicalDebt: 0,
            topPriority: null,
            nagMessage: null,
          },
          revenue: rawDashboard.revenue || { mrr: 0, arr: 0, runwayMonths: 0, pricingAdvice: null },
          support: rawDashboard.support || {
            openTickets: 0,
            atRiskCustomers: 0,
            avgResponseTime: 0,
          },
          watch: rawDashboard.watch || {
            activeAlerts: 0,
            criticalAlert: null,
            competitorsTracked: 0,
          },
        });
        console.log('[Core] Loaded dashboard from API');
      }

      const contentPayload = contentRes as any;
      const rawContent = contentPayload.content ?? contentPayload.data?.content;
      if (contentPayload.success !== false && rawContent && Array.isArray(rawContent)) {
        setContentQueue(
          rawContent.map((c: any) => ({
            id: c.id,
            type: c.type || 'blog',
            title: c.title || c.name,
            status: c.status || 'draft',
            scheduledFor: c.scheduledFor,
          }))
        );
        console.log('[Core] Loaded', rawContent.length, 'content items from API');
      }
    } catch (error) {
      console.error('[Core] Failed to load from API, using fallback:', error);
      // Fallback data
      setMetrics({
        brand: { contentQueue: 5, scheduledPosts: 3, voiceScore: 92 },
        foundry: {
          backlogItems: 12,
          technicalDebt: 4,
          topPriority: 'CendiaVoice Enhancement',
          nagMessage: null,
        },
        revenue: {
          mrr: 15000,
          arr: 180000,
          runwayMonths: 18,
          pricingAdvice: 'Consider 15% price increase on Enterprise tier',
        },
        support: { openTickets: 3, atRiskCustomers: 1, avgResponseTime: 2.4 },
        watch: { activeAlerts: 2, criticalAlert: null, competitorsTracked: 8 },
      });
      setContentQueue([
        { id: '1', type: 'linkedin', title: 'Pre-Mortem Feature Launch', status: 'draft' },
        { id: '2', type: 'blog', title: 'Why AI Councils Beat Single Agents', status: 'approved' },
        {
          id: '3',
          type: 'newsletter',
          title: 'Week 48 Update',
          status: 'scheduled',
          scheduledFor: 'Monday 9am',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const generateContent = async (type: string) => {
    setGenerating(true);
    try {
      // Call real API to generate content
      const res = await api.post<any>('/core/brand/generate/linkedin', {
        featureName: `${type} content`,
        featureDescription: `Auto-generated ${type} content`,
      });

      const payload = res as any;
      if (payload.success !== false) {
        const data = payload.data ?? payload;
        if (data.post) {
          setContentQueue((prev) => [
            {
              id: Date.now().toString(),
              type: type as any,
              title: data.post.title || `Generated ${type} post`,
              status: 'draft',
            },
            ...prev,
          ]);
          console.log('[Core] Generated content via API');
          return;
        }
      }
    } catch (error) {
      console.error('[Core] Content generation failed:', error);
    }

    // Fallback
    setContentQueue((prev) => [
      {
        id: Date.now().toString(),
        type: type as any,
        title: `Generated ${type} post`,
        status: 'draft',
      },
      ...prev,
    ]);
    setGenerating(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <Crown className="w-16 h-16 text-amber-500 mx-auto mb-4 animate-pulse" />
          <p className="text-neutral-400">Loading Datacendia Core...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <Crown className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Datacendia Core</h1>
            <p className="text-neutral-400">Internal Admin Suite • Dogfooding Mode</p>
          </div>
        </div>
        <p className="text-neutral-500 mt-4 max-w-2xl">
          "I don't just sell this. I run my entire company on it." — The ultimate proof of
          confidence.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            {
              label: 'MRR',
              value: `$${metrics?.revenue.mrr.toLocaleString()}`,
              icon: DollarSign,
              color: 'text-emerald-400',
            },
            {
              label: 'Runway',
              value: `${metrics?.revenue.runwayMonths} mo`,
              icon: Clock,
              color: 'text-blue-400',
            },
            {
              label: 'Open Tickets',
              value: metrics?.support.openTickets,
              icon: HeadphonesIcon,
              color: 'text-amber-400',
            },
            {
              label: 'Alerts',
              value: metrics?.watch.activeAlerts,
              icon: AlertTriangle,
              color: 'text-red-400',
            },
            {
              label: 'Content Queue',
              value: metrics?.brand.contentQueue,
              icon: FileText,
              color: 'text-purple-400',
            },
          ].map((stat, i) => (
            <div key={i} className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                <span className="text-sm text-neutral-500">{stat.label}</span>
              </div>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Service Navigation */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {CoreServices.map((service) => (
            <button
              key={service.id}
              onClick={() => setActiveService(service.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                activeService === service.id
                  ? 'bg-neutral-800 border border-neutral-700'
                  : 'bg-neutral-900/50 border border-neutral-800/50 hover:border-neutral-700'
              }`}
            >
              <service.icon className="w-4 h-4" style={{ color: service.color }} />
              <span className="text-sm text-white">{service.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Service Detail Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Service Card */}
          {CoreServices.filter((s) => s.id === activeService).map((service) => (
            <div
              key={service.id}
              className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${service.color}20` }}
                  >
                    <service.icon className="w-7 h-7" style={{ color: service.color }} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{service.name}</h2>
                    <p className="text-neutral-400">{service.agent}</p>
                  </div>
                </div>
                <button className="p-2 hover:bg-neutral-800 rounded-lg transition-colors">
                  <Settings className="w-5 h-5 text-neutral-500" />
                </button>
              </div>
              <p className="text-neutral-400 mb-6">{service.description}</p>
              <div className="flex flex-wrap gap-2">
                {service.features.map((feature, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full text-sm"
                    style={{ backgroundColor: `${service.color}15`, color: service.color }}
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          ))}

          {/* Brand Content Section */}
          {activeService === 'brand' && (
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Content Queue</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => generateContent('linkedin')}
                    disabled={generating}
                    className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg text-sm transition-colors disabled:opacity-50"
                  >
                    {generating ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    Generate Post
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                {contentQueue.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-neutral-800/50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          item.status === 'scheduled'
                            ? 'bg-green-400'
                            : item.status === 'approved'
                              ? 'bg-blue-400'
                              : 'bg-amber-400'
                        }`}
                      />
                      <div>
                        <p className="text-white text-sm">{item.title}</p>
                        <p className="text-neutral-500 text-xs capitalize">
                          {item.type} • {item.status}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {item.status === 'draft' && (
                        <button className="p-2 hover:bg-neutral-700 rounded-lg transition-colors">
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                        </button>
                      )}
                      {item.status === 'approved' && (
                        <button className="p-2 hover:bg-neutral-700 rounded-lg transition-colors">
                          <Calendar className="w-4 h-4 text-blue-400" />
                        </button>
                      )}
                      <button className="p-2 hover:bg-neutral-700 rounded-lg transition-colors">
                        <ChevronRight className="w-4 h-4 text-neutral-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Revenue Section */}
          {activeService === 'revenue' && metrics && (
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Financial Health</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-neutral-800/50 rounded-xl p-4">
                  <p className="text-neutral-500 text-sm mb-1">Monthly Recurring Revenue</p>
                  <p className="text-2xl font-bold text-emerald-400">
                    ${metrics.revenue.mrr.toLocaleString()}
                  </p>
                </div>
                <div className="bg-neutral-800/50 rounded-xl p-4">
                  <p className="text-neutral-500 text-sm mb-1">Annual Run Rate</p>
                  <p className="text-2xl font-bold text-emerald-400">
                    ${metrics.revenue.arr.toLocaleString()}
                  </p>
                </div>
                <div className="bg-neutral-800/50 rounded-xl p-4">
                  <p className="text-neutral-500 text-sm mb-1">Runway</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {metrics.revenue.runwayMonths} months
                  </p>
                </div>
                <div className="bg-neutral-800/50 rounded-xl p-4">
                  <p className="text-neutral-500 text-sm mb-1">LTV:CAC Ratio</p>
                  <p className="text-2xl font-bold text-purple-400">4.2x</p>
                </div>
              </div>
              {metrics.revenue.pricingAdvice && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400 text-sm font-medium">Pricing Insight</span>
                  </div>
                  <p className="text-neutral-300 text-sm">{metrics.revenue.pricingAdvice}</p>
                </div>
              )}
            </div>
          )}

          {/* Foundry Section */}
          {activeService === 'foundry' && metrics && (
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Product Health</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-neutral-800/50 rounded-xl p-4">
                  <p className="text-neutral-500 text-sm mb-1">Backlog Items</p>
                  <p className="text-2xl font-bold text-amber-400">
                    {metrics.foundry.backlogItems}
                  </p>
                </div>
                <div className="bg-neutral-800/50 rounded-xl p-4">
                  <p className="text-neutral-500 text-sm mb-1">Technical Debt</p>
                  <p className="text-2xl font-bold text-red-400">{metrics.foundry.technicalDebt}</p>
                </div>
              </div>
              {metrics.foundry.topPriority && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-amber-400" />
                    <span className="text-amber-400 text-sm font-medium">Top Priority</span>
                  </div>
                  <p className="text-white">{metrics.foundry.topPriority}</p>
                </div>
              )}
              {metrics.foundry.nagMessage && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span className="text-red-400 text-sm font-medium">Foundry Nag</span>
                  </div>
                  <p className="text-neutral-300 text-sm">{metrics.foundry.nagMessage}</p>
                </div>
              )}
            </div>
          )}

          {/* Watch Section */}
          {activeService === 'watch' && metrics && (
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Market Intelligence</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-neutral-800/50 rounded-xl p-4">
                  <p className="text-neutral-500 text-sm mb-1">Competitors Tracked</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {metrics.watch.competitorsTracked}
                  </p>
                </div>
                <div className="bg-neutral-800/50 rounded-xl p-4">
                  <p className="text-neutral-500 text-sm mb-1">Active Alerts</p>
                  <p className="text-2xl font-bold text-red-400">{metrics.watch.activeAlerts}</p>
                </div>
              </div>
              {metrics.watch.criticalAlert && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span className="text-red-400 text-sm font-medium">Critical Alert</span>
                  </div>
                  <p className="text-neutral-300 text-sm">{metrics.watch.criticalAlert}</p>
                </div>
              )}
              <div className="mt-4 space-y-2">
                <p className="text-neutral-500 text-sm">Tracked Keywords:</p>
                <div className="flex flex-wrap gap-2">
                  {['Sovereign AI', 'Palantir', 'AI Council', 'Enterprise AI'].map((kw, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-neutral-800 rounded text-xs text-neutral-400"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { icon: Sparkles, label: 'Generate Marketing Package', color: 'text-purple-400' },
                { icon: BarChart3, label: 'Run Pricing Analysis', color: 'text-emerald-400' },
                { icon: Eye, label: 'Scan Competitors', color: 'text-red-400' },
                { icon: Brain, label: 'Consult the Regent', color: 'text-amber-400' },
                { icon: RefreshCw, label: 'Sync Stripe Data', color: 'text-blue-400' },
              ].map((action, i) => (
                <button
                  key={i}
                  className="w-full flex items-center gap-3 p-3 bg-neutral-800/50 hover:bg-neutral-800 rounded-xl transition-colors text-left"
                >
                  <action.icon className={`w-5 h-5 ${action.color}`} />
                  <span className="text-sm text-neutral-300">{action.label}</span>
                  <ArrowRight className="w-4 h-4 text-neutral-600 ml-auto" />
                </button>
              ))}
            </div>
          </div>

          {/* The Mirror */}
          <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <Crown className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold">The Mirror</h3>
                <p className="text-amber-400/70 text-xs">Truth no one else will tell</p>
              </div>
            </div>
            <p className="text-neutral-300 text-sm italic">
              "You're spending too much time on features and not enough on distribution. The best
              product doesn't win—the best-known product wins."
            </p>
            <button className="mt-4 text-amber-400 text-sm hover:text-amber-300 transition-colors flex items-center gap-1">
              Ask the Mirror <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Sovereign Stack Status */}
          <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                  <Server className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Sovereign Stack</h3>
                  <p className="text-indigo-400/70 text-xs">Infrastructure Status</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 bg-green-500/20 rounded-full">
                <CheckCircle2 className="w-3 h-3 text-green-400" />
                <span className="text-xs text-green-400 font-medium">Online</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="flex items-center gap-2 p-2 bg-neutral-800/50 rounded-lg">
                <Database className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-neutral-300">PostgreSQL</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-neutral-800/50 rounded-lg">
                <Activity className="w-4 h-4 text-green-400" />
                <span className="text-xs text-neutral-300">Druid</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-neutral-800/50 rounded-lg">
                <HardDrive className="w-4 h-4 text-amber-400" />
                <span className="text-xs text-neutral-300">MinIO</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-neutral-800/50 rounded-lg">
                <Activity className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-neutral-300">Grafana</span>
              </div>
            </div>
            <Link
              to="/admin/sovereign-stack"
              className="flex items-center justify-center gap-2 w-full py-2 bg-indigo-500/20 hover:bg-indigo-500/30 rounded-lg text-indigo-400 text-sm transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Open Infrastructure
            </Link>
          </div>

          {/* Activity Feed */}
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {[
                {
                  time: '2m ago',
                  text: 'CendiaBrand generated LinkedIn post',
                  icon: Megaphone,
                  color: 'text-purple-400',
                },
                {
                  time: '1h ago',
                  text: 'New support ticket triaged',
                  icon: HeadphonesIcon,
                  color: 'text-blue-400',
                },
                {
                  time: '3h ago',
                  text: 'Competitor alert: Palantir AIP update',
                  icon: Eye,
                  color: 'text-red-400',
                },
                {
                  time: '1d ago',
                  text: 'Pricing analysis complete',
                  icon: DollarSign,
                  color: 'text-emerald-400',
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center flex-shrink-0`}
                  >
                    <item.icon className={`w-4 h-4 ${item.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-300">{item.text}</p>
                    <p className="text-xs text-neutral-600">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Dogfood Message */}
      <div className="max-w-7xl mx-auto mt-12 text-center">
        <p className="text-neutral-600 text-sm">
          🐕 Dogfooding Mode Active • Datacendia runs on Datacendia
        </p>
      </div>
    </div>
  );
}
