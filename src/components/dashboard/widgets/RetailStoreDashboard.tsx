// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * RETAIL STORE DASHBOARD - Retail Vertical
 * Store performance heatmap, inventory, and customer analytics with AI agents
 */

import React, { useEffect, useState } from 'react';
import { cn } from '../../../lib/utils';
import { Store, ShoppingCart, Users, TrendingUp, Package, Bot, DollarSign, BarChart3 } from 'lucide-react';
import { deterministicFloat, deterministicInt } from '../../../lib/deterministic';

// =============================================================================
// TYPES
// =============================================================================

interface StoreData {
  id: string;
  name: string;
  region: string;
  revenue: number;
  target: number;
  traffic: number;
  conversion: number;
  avgTicket: number;
  inventory: number;
  status: 'exceeding' | 'on-track' | 'at-risk' | 'underperforming';
}

interface AIAgent {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'analyzing' | 'idle';
  currentAction: string;
  insight: string;
}

interface CategoryPerformance {
  name: string;
  sales: number;
  margin: number;
  trend: 'up' | 'down' | 'flat';
}

// =============================================================================
// SAMPLE DATA
// =============================================================================

const STORES: StoreData[] = [
  { id: 's1', name: 'Flagship NYC', region: 'Northeast', revenue: 2847000, target: 2500000, traffic: 12400, conversion: 24.2, avgTicket: 94, inventory: 98, status: 'exceeding' },
  { id: 's2', name: 'Chicago Loop', region: 'Midwest', revenue: 1890000, target: 2000000, traffic: 8900, conversion: 21.8, avgTicket: 97, inventory: 94, status: 'at-risk' },
  { id: 's3', name: 'LA Beverly', region: 'West', revenue: 2234000, target: 2200000, traffic: 10200, conversion: 22.5, avgTicket: 97, inventory: 96, status: 'on-track' },
  { id: 's4', name: 'Miami Beach', region: 'Southeast', revenue: 1567000, target: 1800000, traffic: 7800, conversion: 19.8, avgTicket: 101, inventory: 87, status: 'underperforming' },
  { id: 's5', name: 'Dallas Galleria', region: 'Southwest', revenue: 1923000, target: 1900000, traffic: 9100, conversion: 23.1, avgTicket: 92, inventory: 95, status: 'on-track' },
  { id: 's6', name: 'Seattle Downtown', region: 'Northwest', revenue: 1654000, target: 1500000, traffic: 7200, conversion: 25.8, avgTicket: 89, inventory: 99, status: 'exceeding' },
  { id: 's7', name: 'Boston Commons', region: 'Northeast', revenue: 1789000, target: 1750000, traffic: 8100, conversion: 22.9, avgTicket: 96, inventory: 92, status: 'on-track' },
  { id: 's8', name: 'Denver 16th St', region: 'Mountain', revenue: 1234000, target: 1400000, traffic: 6200, conversion: 20.1, avgTicket: 99, inventory: 88, status: 'underperforming' },
];

const AI_AGENTS: AIAgent[] = [
  { id: 'merch', name: 'MerchandisingAI', role: 'Assortment Planning', status: 'active', currentAction: 'Optimizing spring collection mix', insight: 'Recommend 15% increase in athleisure SKUs for Q2' },
  { id: 'price', name: 'PricingEngine', role: 'Dynamic Pricing', status: 'analyzing', currentAction: 'Analyzing competitor price changes', insight: 'Opportunity for 8% margin improvement on accessories' },
  { id: 'customer', name: 'CustomerInsight', role: 'Customer Intelligence', status: 'active', currentAction: 'Processing loyalty data', insight: 'High-value segment showing 12% churn risk' },
  { id: 'omni', name: 'OmniSync', role: 'Omnichannel Ops', status: 'active', currentAction: 'Balancing BOPIS inventory', insight: '23% of online orders eligible for same-day pickup' },
];

const CATEGORIES: CategoryPerformance[] = [
  { name: 'Apparel', sales: 4200000, margin: 52, trend: 'up' },
  { name: 'Footwear', sales: 2800000, margin: 48, trend: 'up' },
  { name: 'Accessories', sales: 1900000, margin: 62, trend: 'flat' },
  { name: 'Home', sales: 1200000, margin: 45, trend: 'down' },
  { name: 'Beauty', sales: 890000, margin: 58, trend: 'up' },
];

// =============================================================================
// COMPONENTS
// =============================================================================

const formatCurrency = (num: number): string => {
  if (num >= 1e6) {return `$${(num / 1e6).toFixed(1)}M`;}
  if (num >= 1e3) {return `$${(num / 1e3).toFixed(0)}K`;}
  return `$${num}`;
};

const StoreCard: React.FC<{ store: StoreData }> = ({ store }) => {
  const pctToTarget = (store.revenue / store.target) * 100;
  
  const statusColors = {
    exceeding: 'bg-emerald-900/20 border-emerald-500/40 text-emerald-400',
    'on-track': 'bg-cyan-900/20 border-cyan-500/40 text-cyan-400',
    'at-risk': 'bg-amber-900/20 border-amber-500/40 text-amber-400',
    underperforming: 'bg-red-900/20 border-red-500/40 text-red-400',
  };

  return (
    <div className={cn('p-2 rounded-lg border', statusColors[store.status])}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <Store className="w-3 h-3" />
          <span className="text-xs font-medium text-white truncate max-w-[100px]">{store.name}</span>
        </div>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/20">{pctToTarget.toFixed(0)}%</span>
      </div>
      
      <div className="grid grid-cols-3 gap-1 text-[10px]">
        <div>
          <p className="text-gray-500">Revenue</p>
          <p className="text-white font-medium">{formatCurrency(store.revenue)}</p>
        </div>
        <div>
          <p className="text-gray-500">Traffic</p>
          <p className="text-white font-medium">{(store.traffic / 1000).toFixed(1)}K</p>
        </div>
        <div>
          <p className="text-gray-500">Conv %</p>
          <p className="text-white font-medium">{store.conversion}%</p>
        </div>
      </div>
      
      <div className="mt-1.5 h-1 bg-black/30 rounded-full overflow-hidden">
        <div 
          className={cn(
            'h-full rounded-full',
            pctToTarget >= 100 ? 'bg-emerald-500' :
            pctToTarget >= 90 ? 'bg-cyan-500' :
            pctToTarget >= 80 ? 'bg-amber-500' : 'bg-red-500'
          )}
          style={{ width: `${Math.min(100, pctToTarget)}%` }}
        />
      </div>
    </div>
  );
};

const AgentCard: React.FC<{ agent: AIAgent }> = ({ agent }) => (
  <div className="p-2 bg-sovereign-elevated/50 rounded-lg border border-sovereign-border-subtle">
    <div className="flex items-center gap-2 mb-1">
      <div className={cn(
        'w-6 h-6 rounded-full flex items-center justify-center',
        agent.status === 'active' ? 'bg-emerald-900/50 text-emerald-400' :
        agent.status === 'analyzing' ? 'bg-cyan-900/50 text-cyan-400' :
        'bg-gray-900/50 text-gray-400'
      )}>
        <Bot className="w-3 h-3" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-white">{agent.name}</p>
        <p className="text-[10px] text-gray-500">{agent.role}</p>
      </div>
      <span className={cn(
        'w-1.5 h-1.5 rounded-full',
        agent.status === 'active' ? 'bg-emerald-500 animate-pulse' :
        agent.status === 'analyzing' ? 'bg-cyan-500 animate-pulse' : 'bg-gray-500'
      )} />
    </div>
    <p className="text-[10px] text-gray-400 mb-1">{agent.currentAction}</p>
    <p className="text-[10px] text-cyan-400 bg-cyan-900/20 rounded px-1.5 py-0.5">💡 {agent.insight}</p>
  </div>
);

const CategoryBar: React.FC<{ category: CategoryPerformance; maxSales: number }> = ({ category, maxSales }) => (
  <div className="flex items-center gap-2">
    <span className="text-[10px] text-gray-400 w-16 truncate">{category.name}</span>
    <div className="flex-1 h-4 bg-sovereign-base rounded overflow-hidden relative">
      <div 
        className="h-full bg-gradient-to-r from-violet-600 to-fuchsia-500 rounded"
        style={{ width: `${(category.sales / maxSales) * 100}%` }}
      />
      <span className="absolute inset-0 flex items-center justify-center text-[9px] text-white font-medium">
        {formatCurrency(category.sales)} • {category.margin}% margin
      </span>
    </div>
    <span className={cn(
      'text-xs',
      category.trend === 'up' ? 'text-emerald-400' :
      category.trend === 'down' ? 'text-red-400' : 'text-gray-400'
    )}>
      {category.trend === 'up' ? '↑' : category.trend === 'down' ? '↓' : '→'}
    </span>
  </div>
);

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const RetailStoreDashboard: React.FC<{ className?: string }> = ({ className }) => {
  const [stores, setStores] = useState<StoreData[]>(STORES);
  const [agents, setAgents] = useState<AIAgent[]>(AI_AGENTS);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate store metrics fluctuation
      setStores(prev => prev.map((store): StoreData => ({
        ...store,
        traffic: Math.max(5000, store.traffic + Math.floor((deterministicFloat('retailstore-1') - 0.5) * 200)),
        conversion: Math.max(15, Math.min(30, store.conversion + (deterministicFloat('retailstore-2') - 0.5) * 0.5)),
      })));

      // Simulate agent activity
      setAgents(prev => prev.map((agent): AIAgent => ({
        ...agent,
        status: deterministicFloat('retailstore-3') > 0.7 ? 'analyzing' : 'active',
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const totalRevenue = stores.reduce((sum, s) => sum + s.revenue, 0);
  const totalTraffic = stores.reduce((sum, s) => sum + s.traffic, 0);
  const avgConversion = stores.reduce((sum, s) => sum + s.conversion, 0) / stores.length;
  const maxCategorySales = Math.max(...CATEGORIES.map(c => c.sales));

  return (
    <div className={cn('relative w-full h-full min-h-[400px] rounded-lg overflow-hidden bg-sovereign-base p-3', className)}>
      {/* Header Stats */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        <div className="bg-violet-900/20 rounded-lg p-2 text-center border border-violet-500/30">
          <DollarSign className="w-4 h-4 mx-auto text-violet-400 mb-1" />
          <p className="text-lg font-bold text-white">{formatCurrency(totalRevenue)}</p>
          <p className="text-[10px] text-gray-400">Total Revenue</p>
        </div>
        <div className="bg-cyan-900/20 rounded-lg p-2 text-center border border-cyan-500/30">
          <Users className="w-4 h-4 mx-auto text-cyan-400 mb-1" />
          <p className="text-lg font-bold text-white">{(totalTraffic / 1000).toFixed(0)}K</p>
          <p className="text-[10px] text-gray-400">Total Traffic</p>
        </div>
        <div className="bg-emerald-900/20 rounded-lg p-2 text-center border border-emerald-500/30">
          <ShoppingCart className="w-4 h-4 mx-auto text-emerald-400 mb-1" />
          <p className="text-lg font-bold text-white">{avgConversion.toFixed(1)}%</p>
          <p className="text-[10px] text-gray-400">Avg Conversion</p>
        </div>
        <div className="bg-amber-900/20 rounded-lg p-2 text-center border border-amber-500/30">
          <Package className="w-4 h-4 mx-auto text-amber-400 mb-1" />
          <p className="text-lg font-bold text-white">{stores.filter(s => s.status === 'exceeding' || s.status === 'on-track').length}/{stores.length}</p>
          <p className="text-[10px] text-gray-400">On Target</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 h-[calc(100%-80px)]">
        {/* Left - Store Grid */}
        <div className="col-span-2 overflow-y-auto">
          <h3 className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1">
            <Store className="w-3 h-3" /> Store Performance ({stores.length} locations)
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {stores.map(store => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
          
          {/* Category Performance */}
          <h3 className="text-xs font-semibold text-gray-400 mt-3 mb-2 flex items-center gap-1">
            <BarChart3 className="w-3 h-3" /> Category Performance
          </h3>
          <div className="space-y-1.5">
            {CATEGORIES.map(cat => (
              <CategoryBar key={cat.name} category={cat} maxSales={maxCategorySales} />
            ))}
          </div>
        </div>

        {/* Right - AI Agents */}
        <div className="overflow-y-auto">
          <h3 className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1">
            <Bot className="w-3 h-3" /> AI Retail Agents
          </h3>
          <div className="space-y-2">
            {agents.map(agent => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </div>
      </div>

      {/* Live indicator */}
      <div className="absolute top-3 right-3 flex items-center gap-2 bg-sovereign-elevated/95 backdrop-blur-sm rounded-full px-3 py-1.5 border border-sovereign-border">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-xs text-gray-300">Live Sales</span>
      </div>
    </div>
  );
};

export default RetailStoreDashboard;
