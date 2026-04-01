/**
 * Datacendia Product Showcase
 *
 * Comprehensive product demonstration beyond governance simulation
 * Shows live data, integrations, and full platform capabilities
 *
 * @module pages/sandbox/ProductShowcase
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import React, { useState, useEffect } from 'react';
import {
  Shield, Database, BarChart3, TrendingUp, Users, Zap,
  Activity, Globe, Lock, CheckCircle, AlertTriangle, Play,
  Download, Share, Eye, Clock, ArrowRight, Star,
  Cpu, Cloud, Server, Code, Terminal
} from 'lucide-react';

interface LiveMetric {
  id: string;
  name: string;
  value: string;
  change: number;
  status: 'active' | 'warning' | 'error';
  icon: React.ReactNode;
}

interface Integration {
  id: string;
  name: string;
  type: string;
  status: 'connected' | 'syncing' | 'disconnected';
  lastSync: string;
  dataFlow: number;
}

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  stats: {
    users?: string;
    transactions?: string;
    accuracy?: string;
    uptime?: string;
  };
}

export const ProductShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [liveMetrics, setLiveMetrics] = useState<LiveMetric[]>([]);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  // Simulate live data updates
  useEffect(() => {
    const metrics: LiveMetric[] = [
      {
        id: 'transactions',
        name: 'Active Transactions',
        value: '15,423',
        change: 12.5,
        status: 'active',
        icon: <Activity className="w-4 h-4" />
      },
      {
        id: 'compliance',
        name: 'Compliance Score',
        value: '94.2%',
        change: 2.1,
        status: 'active',
        icon: <CheckCircle className="w-4 h-4" />
      },
      {
        id: 'risk',
        name: 'Risk Alerts',
        value: '3',
        change: -25.0,
        status: 'warning',
        icon: <AlertTriangle className="w-4 h-4" />
      },
      {
        id: 'api',
        name: 'API Calls/sec',
        value: '8,721',
        change: 8.3,
        status: 'active',
        icon: <Zap className="w-4 h-4" />
      }
    ];

    const integrationData: Integration[] = [
      {
        id: 'binance',
        name: 'Binance API',
        type: 'Cryptocurrency Exchange',
        status: 'connected',
        lastSync: '2 seconds ago',
        dataFlow: 15423
      },
      {
        id: 'thomson',
        name: 'Thomson Reuters',
        type: 'Legal Research Platform',
        status: 'connected',
        lastSync: '5 seconds ago',
        dataFlow: 3421
      },
      {
        id: 'universitario',
        name: 'Universitario FC',
        type: 'Sports Management System',
        status: 'syncing',
        lastSync: '12 seconds ago',
        dataFlow: 892
      },
      {
        id: 'sap',
        name: 'SAP ERP',
        type: 'Enterprise Resource Planning',
        status: 'connected',
        lastSync: '1 minute ago',
        dataFlow: 2156
      }
    ];

    setLiveMetrics(metrics);
    setIntegrations(integrationData);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setLiveMetrics(prev => prev.map(metric => ({
        ...metric,
        value: metric.id === 'transactions' 
          ? String(Math.floor(Math.random() * 20000) + 10000)
          : metric.id === 'api'
          ? String(Math.floor(Math.random() * 10000) + 5000)
          : metric.value,
        change: metric.id === 'risk' 
          ? Math.floor(Math.random() * 10) - 5
          : Math.floor(Math.random() * 20) - 10
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const features: Feature[] = [
    {
      id: 'governance',
      title: 'AI Governance Engine',
      description: 'Real-time compliance monitoring with cryptographic evidence trails',
      icon: <Shield className="w-6 h-6" />,
      category: 'Core Platform',
      stats: {
        accuracy: '99.8%',
        uptime: '99.9%'
      }
    },
    {
      id: 'analytics',
      title: 'Advanced Analytics',
      description: 'Machine learning insights with predictive compliance scoring',
      icon: <BarChart3 className="w-6 h-6" />,
      category: 'Analytics',
      stats: {
        transactions: '2.3M/day',
        accuracy: '96.5%'
      }
    },
    {
      id: 'integrations',
      title: 'Universal Integrations',
      description: 'Connect with any system via APIs, webhooks, or direct database links',
      icon: <Globe className="w-6 h-6" />,
      category: 'Connectivity',
      stats: {
        users: '500+',
        uptime: '99.7%'
      }
    },
    {
      id: 'security',
      title: 'Enterprise Security',
      description: 'Zero-trust architecture with end-to-end encryption',
      icon: <Lock className="w-6 h-6" />,
      category: 'Security',
      stats: {
        uptime: '100%',
        accuracy: '99.9%'
      }
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Eye className="w-4 h-4" /> },
    { id: 'metrics', label: 'Live Metrics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'integrations', label: 'Integrations', icon: <Database className="w-4 h-4" /> },
    { id: 'features', label: 'Features', icon: <Star className="w-4 h-4" /> }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-emerald-400';
      case 'warning': return 'text-amber-400';
      case 'error': return 'text-red-400';
      case 'connected': return 'text-emerald-400';
      case 'syncing': return 'text-amber-400';
      case 'disconnected': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-emerald-400' : 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0d0d14] to-[#111118] text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0d0d14]/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-light tracking-[0.2em] text-white/90">DATACENDIA</h1>
                <p className="text-xs text-emerald-400/80">PRODUCT SHOWCASE</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm hover:bg-emerald-500/20 transition-all flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export Data
              </button>
              <button className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm hover:bg-white/20 transition-all flex items-center gap-2">
                <Share className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 flex items-center gap-2 border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-emerald-400 text-emerald-400'
                    : 'border-transparent text-white/60 hover:text-white/80'
                }`}
              >
                {tab.icon}
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-light tracking-[0.05em] text-white/90 mb-4">
                Enterprise AI Governance Platform
              </h2>
              <p className="text-lg text-white/60 max-w-3xl mx-auto">
                Real-time compliance monitoring, automated evidence generation, and cryptographic audit trails 
                for the modern enterprise.
              </p>
            </div>

            {/* Live Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {liveMetrics.map((metric) => (
                <div key={metric.id} className="bg-[#111118] border border-white/10 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2 rounded-lg bg-black/40 ${getStatusColor(metric.status)}`}>
                      {metric.icon}
                    </div>
                    <span className={`text-sm font-medium ${getChangeColor(metric.change)}`}>
                      {metric.change >= 0 ? '+' : ''}{metric.change}%
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">{metric.value}</h3>
                  <p className="text-sm text-white/60">{metric.name}</p>
                </div>
              ))}
            </div>

            {/* Key Features Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  className={`bg-[#111118] border rounded-xl p-6 cursor-pointer transition-all ${
                    selectedFeature === feature.id
                      ? 'border-emerald-500/30 bg-emerald-500/5'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                  onClick={() => setSelectedFeature(feature.id === selectedFeature ? null : feature.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg bg-emerald-500/10 text-emerald-400`}>
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                      <p className="text-sm text-white/60 mb-4">{feature.description}</p>
                      <div className="flex gap-4 text-xs">
                        {feature.stats.accuracy && (
                          <div>
                            <span className="text-emerald-400">Accuracy:</span>
                            <span className="text-white/80 ml-1">{feature.stats.accuracy}</span>
                          </div>
                        )}
                        {feature.stats.transactions && (
                          <div>
                            <span className="text-emerald-400">Volume:</span>
                            <span className="text-white/80 ml-1">{feature.stats.transactions}</span>
                          </div>
                        )}
                        {feature.stats.uptime && (
                          <div>
                            <span className="text-emerald-400">Uptime:</span>
                            <span className="text-white/80 ml-1">{feature.stats.uptime}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Live Metrics Tab */}
        {activeTab === 'metrics' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-white">Live Performance Metrics</h2>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-sm text-emerald-400">Live</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {liveMetrics.map((metric) => (
                <div key={metric.id} className="bg-[#111118] border border-white/10 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg bg-black/40 ${getStatusColor(metric.status)}`}>
                        {metric.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{metric.name}</h3>
                        <p className="text-sm text-white/60">Real-time monitoring</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
                      <div className={`text-sm font-medium ${getChangeColor(metric.change)}`}>
                        {metric.change >= 0 ? '↑' : '↓'} {Math.abs(metric.change)}%
                      </div>
                    </div>
                  </div>
                  
                  {/* Mini Chart */}
                  <div className="h-24 bg-black/40 rounded-lg flex items-end justify-around p-4">
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={i}
                        className="w-2 bg-emerald-400/30 rounded-t"
                        style={{ height: `${Math.random() * 80 + 20}%` }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Integrations Tab */}
        {activeTab === 'integrations' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-white">System Integrations</h2>
              <button className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm hover:bg-emerald-500/20 transition-all flex items-center gap-2">
                <Database className="w-4 h-4" />
                Add Integration
              </button>
            </div>

            <div className="space-y-4">
              {integrations.map((integration) => (
                <div key={integration.id} className="bg-[#111118] border border-white/10 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(integration.status)}`} />
                      <div>
                        <h3 className="text-lg font-semibold text-white">{integration.name}</h3>
                        <p className="text-sm text-white/60">{integration.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${getStatusColor(integration.status)}`}>
                        {integration.status}
                      </div>
                      <p className="text-xs text-white/40">{integration.lastSync}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm text-white/60">
                        {integration.dataFlow.toLocaleString()} items/sec
                      </span>
                    </div>
                    <button className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
                      Configure →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Features Tab */}
        {activeTab === 'features' && (
          <div className="space-y-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-light text-white/90 mb-4">Platform Features</h2>
              <p className="text-lg text-white/60">Comprehensive capabilities for enterprise governance</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => (
                <div key={feature.id} className="bg-[#111118] border border-white/10 rounded-xl p-6 hover:border-emerald-500/30 transition-all">
                  <div className={`w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-white/60 mb-4">{feature.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-emerald-400">{feature.category}</span>
                    <ArrowRight className="w-4 h-4 text-white/40" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-white/40">
            DATACENDIA PRODUCT SHOWCASE • ENTERPRISE AI GOVERNANCE PLATFORM
          </p>
        </div>
      </footer>
    </div>
  );
};
