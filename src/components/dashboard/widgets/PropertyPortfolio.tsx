// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * PROPERTY PORTFOLIO - Real Estate Vertical
 * Property performance, occupancy, and investment analytics with AI agents
 */

import React, { useEffect, useState } from 'react';
import { cn } from '../../../lib/utils';
import { Building2, DollarSign, Users, TrendingUp, MapPin, Bot, Key, BarChart3 } from 'lucide-react';
import { deterministicFloat, deterministicInt } from '../../../lib/deterministic';

// =============================================================================
// TYPES
// =============================================================================

interface Property {
  id: string;
  name: string;
  type: 'office' | 'retail' | 'multifamily' | 'industrial' | 'mixed';
  location: string;
  sqft: number;
  occupancy: number;
  noi: number;
  capRate: number;
  leaseExpiring: number;
  status: 'performing' | 'watch' | 'underperforming';
}

interface AIAgent {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'analyzing' | 'alert';
  action: string;
  recommendation: string;
}

interface MarketData {
  market: string;
  avgCapRate: number;
  vacancy: number;
  rentGrowth: number;
  trend: 'hot' | 'stable' | 'cooling';
}

// =============================================================================
// SAMPLE DATA
// =============================================================================

const PROPERTIES: Property[] = [
  { id: 'p1', name: 'Tower One Plaza', type: 'office', location: 'Manhattan, NY', sqft: 450000, occupancy: 94, noi: 18200000, capRate: 5.2, leaseExpiring: 12, status: 'performing' },
  { id: 'p2', name: 'Riverside Apartments', type: 'multifamily', location: 'Austin, TX', sqft: 280000, occupancy: 97, noi: 8400000, capRate: 4.8, leaseExpiring: 45, status: 'performing' },
  { id: 'p3', name: 'Commerce Center', type: 'industrial', location: 'Chicago, IL', sqft: 520000, occupancy: 100, noi: 6200000, capRate: 6.1, leaseExpiring: 3, status: 'watch' },
  { id: 'p4', name: 'Fashion District Retail', type: 'retail', location: 'Los Angeles, CA', sqft: 125000, occupancy: 78, noi: 3100000, capRate: 7.2, leaseExpiring: 8, status: 'underperforming' },
  { id: 'p5', name: 'Metro Mixed-Use', type: 'mixed', location: 'Seattle, WA', sqft: 340000, occupancy: 91, noi: 9800000, capRate: 5.5, leaseExpiring: 18, status: 'performing' },
  { id: 'p6', name: 'Lakefront Condos', type: 'multifamily', location: 'Miami, FL', sqft: 195000, occupancy: 88, noi: 5600000, capRate: 5.0, leaseExpiring: 22, status: 'watch' },
];

const AI_AGENTS: AIAgent[] = [
  { id: 'val', name: 'ValuationEngine', role: 'Property Valuation', status: 'active', action: 'Analyzing Q4 cap rate compression', recommendation: 'Tower One Plaza value up 4.2% - consider refinancing' },
  { id: 'lease', name: 'LeaseOptimizer', role: 'Lease Management', status: 'alert', action: 'Monitoring 3 expiring leases', recommendation: 'Commerce Center tenant negotiation needed in 45 days' },
  { id: 'prop', name: 'PropertyManager', role: 'Operations AI', status: 'active', action: 'Scheduling preventive maintenance', recommendation: '12 work orders completed, 3 pending for Riverside' },
  { id: 'invest', name: 'InvestmentAnalyst', role: 'Investment AI', status: 'analyzing', action: 'Evaluating acquisition targets', recommendation: 'Austin multifamily showing 15% IRR potential' },
];

const MARKETS: MarketData[] = [
  { market: 'Manhattan', avgCapRate: 5.1, vacancy: 12.4, rentGrowth: 2.8, trend: 'stable' },
  { market: 'Austin', avgCapRate: 4.6, vacancy: 5.2, rentGrowth: 8.4, trend: 'hot' },
  { market: 'Chicago', avgCapRate: 6.2, vacancy: 14.8, rentGrowth: 1.2, trend: 'cooling' },
  { market: 'Los Angeles', avgCapRate: 5.8, vacancy: 8.6, rentGrowth: 3.5, trend: 'stable' },
  { market: 'Seattle', avgCapRate: 5.3, vacancy: 7.1, rentGrowth: 4.2, trend: 'hot' },
];

// =============================================================================
// COMPONENTS
// =============================================================================

const formatCurrency = (num: number): string => {
  if (num >= 1e6) {return `$${(num / 1e6).toFixed(1)}M`;}
  if (num >= 1e3) {return `$${(num / 1e3).toFixed(0)}K`;}
  return `$${num}`;
};

const PropertyTypeIcon: React.FC<{ type: Property['type'] }> = ({ type }) => {
  const icons = {
    office: <Building2 className="w-3 h-3" />,
    retail: <Key className="w-3 h-3" />,
    multifamily: <Users className="w-3 h-3" />,
    industrial: <BarChart3 className="w-3 h-3" />,
    mixed: <MapPin className="w-3 h-3" />,
  };
  return icons[type];
};

const PropertyCard: React.FC<{ property: Property }> = ({ property }) => {
  const statusColors = {
    performing: 'bg-emerald-900/20 border-emerald-500/40',
    watch: 'bg-amber-900/20 border-amber-500/40',
    underperforming: 'bg-red-900/20 border-red-500/40',
  };

  return (
    <div className={cn('p-2 rounded-lg border', statusColors[property.status])}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <PropertyTypeIcon type={property.type} />
          <span className="text-xs font-medium text-white truncate max-w-[120px]">{property.name}</span>
        </div>
        <span className={cn(
          'text-[10px] px-1.5 py-0.5 rounded capitalize',
          property.status === 'performing' ? 'bg-emerald-900/50 text-emerald-400' :
          property.status === 'watch' ? 'bg-amber-900/50 text-amber-400' :
          'bg-red-900/50 text-red-400'
        )}>
          {property.status}
        </span>
      </div>
      
      <p className="text-[10px] text-gray-400 mb-1.5">{property.location} • {(property.sqft / 1000).toFixed(0)}K sqft</p>
      
      <div className="grid grid-cols-4 gap-1 text-[10px]">
        <div>
          <p className="text-gray-500">Occ.</p>
          <p className={cn('font-medium', property.occupancy >= 90 ? 'text-emerald-400' : property.occupancy >= 80 ? 'text-amber-400' : 'text-red-400')}>
            {property.occupancy}%
          </p>
        </div>
        <div>
          <p className="text-gray-500">NOI</p>
          <p className="text-white font-medium">{formatCurrency(property.noi)}</p>
        </div>
        <div>
          <p className="text-gray-500">Cap</p>
          <p className="text-white font-medium">{property.capRate}%</p>
        </div>
        <div>
          <p className="text-gray-500">Expiring</p>
          <p className={cn('font-medium', property.leaseExpiring <= 6 ? 'text-red-400' : 'text-white')}>
            {property.leaseExpiring}mo
          </p>
        </div>
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
        'bg-amber-900/50 text-amber-400'
      )}>
        <Bot className="w-3 h-3" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-white">{agent.name}</p>
        <p className="text-[10px] text-gray-500">{agent.role}</p>
      </div>
      <span className={cn(
        'w-1.5 h-1.5 rounded-full animate-pulse',
        agent.status === 'active' ? 'bg-emerald-500' :
        agent.status === 'analyzing' ? 'bg-cyan-500' : 'bg-amber-500'
      )} />
    </div>
    <p className="text-[10px] text-gray-400 mb-1">{agent.action}</p>
    <p className="text-[10px] text-cyan-400 bg-cyan-900/20 rounded px-1.5 py-0.5">💡 {agent.recommendation}</p>
  </div>
);

const MarketRow: React.FC<{ market: MarketData }> = ({ market }) => (
  <div className="flex items-center gap-2 p-1.5 bg-sovereign-base rounded text-[10px]">
    <span className="text-gray-300 w-20 truncate">{market.market}</span>
    <span className="text-white w-10">{market.avgCapRate}%</span>
    <span className={cn('w-10', market.vacancy > 10 ? 'text-amber-400' : 'text-emerald-400')}>{market.vacancy}%</span>
    <span className={cn('w-10', market.rentGrowth > 5 ? 'text-emerald-400' : 'text-white')}>{market.rentGrowth > 0 ? '+' : ''}{market.rentGrowth}%</span>
    <span className={cn(
      'px-1.5 py-0.5 rounded capitalize',
      market.trend === 'hot' ? 'bg-emerald-900/50 text-emerald-400' :
      market.trend === 'cooling' ? 'bg-blue-900/50 text-blue-400' :
      'bg-gray-900/50 text-gray-400'
    )}>
      {market.trend}
    </span>
  </div>
);

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const PropertyPortfolio: React.FC<{ className?: string }> = ({ className }) => {
  const [properties, setProperties] = useState<Property[]>(PROPERTIES);
  const [agents, setAgents] = useState<AIAgent[]>(AI_AGENTS);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate occupancy fluctuation
      setProperties(prev => prev.map((p): Property => ({
        ...p,
        occupancy: Math.max(70, Math.min(100, p.occupancy + (deterministicFloat('propertyportfolio-1') - 0.5) * 2)),
      })));

      // Simulate agent status
      setAgents(prev => prev.map((a): AIAgent => ({
        ...a,
        status: deterministicFloat('propertyportfolio-2') > 0.8 ? 'analyzing' : 'active',
      })));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const totalNOI = properties.reduce((sum, p) => sum + p.noi, 0);
  const totalSqft = properties.reduce((sum, p) => sum + p.sqft, 0);
  const avgOccupancy = properties.reduce((sum, p) => sum + p.occupancy, 0) / properties.length;
  const avgCapRate = properties.reduce((sum, p) => sum + p.capRate, 0) / properties.length;

  return (
    <div className={cn('relative w-full h-full min-h-[400px] rounded-lg overflow-hidden bg-sovereign-base p-3', className)}>
      {/* Header Stats */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        <div className="bg-emerald-900/20 rounded-lg p-2 text-center border border-emerald-500/30">
          <DollarSign className="w-4 h-4 mx-auto text-emerald-400 mb-1" />
          <p className="text-lg font-bold text-white">{formatCurrency(totalNOI)}</p>
          <p className="text-[10px] text-gray-400">Total NOI</p>
        </div>
        <div className="bg-violet-900/20 rounded-lg p-2 text-center border border-violet-500/30">
          <Building2 className="w-4 h-4 mx-auto text-violet-400 mb-1" />
          <p className="text-lg font-bold text-white">{(totalSqft / 1e6).toFixed(1)}M</p>
          <p className="text-[10px] text-gray-400">Total Sqft</p>
        </div>
        <div className="bg-cyan-900/20 rounded-lg p-2 text-center border border-cyan-500/30">
          <Users className="w-4 h-4 mx-auto text-cyan-400 mb-1" />
          <p className="text-lg font-bold text-white">{avgOccupancy.toFixed(1)}%</p>
          <p className="text-[10px] text-gray-400">Avg Occupancy</p>
        </div>
        <div className="bg-amber-900/20 rounded-lg p-2 text-center border border-amber-500/30">
          <TrendingUp className="w-4 h-4 mx-auto text-amber-400 mb-1" />
          <p className="text-lg font-bold text-white">{avgCapRate.toFixed(1)}%</p>
          <p className="text-[10px] text-gray-400">Avg Cap Rate</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 h-[calc(100%-80px)]">
        {/* Left - Properties */}
        <div className="col-span-2 overflow-y-auto">
          <h3 className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1">
            <Building2 className="w-3 h-3" /> Portfolio Properties ({properties.length})
          </h3>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {properties.map(prop => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
          
          {/* Market Data */}
          <h3 className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1">
            <MapPin className="w-3 h-3" /> Market Conditions
          </h3>
          <div className="text-[9px] text-gray-500 flex gap-2 mb-1 px-1.5">
            <span className="w-20">Market</span>
            <span className="w-10">Cap</span>
            <span className="w-10">Vac.</span>
            <span className="w-10">Rent</span>
            <span>Trend</span>
          </div>
          <div className="space-y-1">
            {MARKETS.map(m => (
              <MarketRow key={m.market} market={m} />
            ))}
          </div>
        </div>

        {/* Right - AI Agents */}
        <div className="overflow-y-auto">
          <h3 className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1">
            <Bot className="w-3 h-3" /> AI Real Estate Agents
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
        <span className="text-xs text-gray-300">Live Portfolio</span>
      </div>
    </div>
  );
};

export default PropertyPortfolio;
