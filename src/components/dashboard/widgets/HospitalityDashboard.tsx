// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * HOSPITALITY DASHBOARD - Hospitality Vertical
 * RevPAR, occupancy, guest experience with AI agents
 */

import React, { useEffect, useState } from 'react';
import { cn } from '../../../lib/utils';
import { Hotel, Users, DollarSign, Star, Bot, Calendar, Bed } from 'lucide-react';
import { deterministicFloat, deterministicInt } from '../../../lib/deterministic';

// =============================================================================
// TYPES
// =============================================================================

interface Property {
  id: string;
  name: string;
  rooms: number;
  occupancy: number;
  adr: number;
  revpar: number;
  rating: number;
  bookingsToday: number;
}

interface AIAgent {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'optimizing' | 'alert';
  action: string;
}

// =============================================================================
// SAMPLE DATA
// =============================================================================

const PROPERTIES: Property[] = [
  { id: 'p1', name: 'Grand Plaza Hotel', rooms: 450, occupancy: 87, adr: 245, revpar: 213, rating: 4.7, bookingsToday: 42 },
  { id: 'p2', name: 'Seaside Resort', rooms: 280, occupancy: 92, adr: 320, revpar: 294, rating: 4.8, bookingsToday: 28 },
  { id: 'p3', name: 'Downtown Suites', rooms: 180, occupancy: 78, adr: 189, revpar: 147, rating: 4.5, bookingsToday: 18 },
  { id: 'p4', name: 'Airport Inn', rooms: 320, occupancy: 95, adr: 129, revpar: 123, rating: 4.2, bookingsToday: 65 },
  { id: 'p5', name: 'Mountain Lodge', rooms: 120, occupancy: 65, adr: 410, revpar: 267, rating: 4.9, bookingsToday: 8 },
];

const AI_AGENTS: AIAgent[] = [
  { id: 'rev', name: 'RevenueOptimizer', role: 'Dynamic Pricing', status: 'active', action: 'Adjusting rates for weekend surge - +12% recommended' },
  { id: 'guest', name: 'GuestExperience', role: 'Personalization AI', status: 'optimizing', action: 'Preparing VIP amenities for 23 loyalty members' },
  { id: 'demand', name: 'DemandForecaster', role: 'Demand Prediction', status: 'active', action: 'Convention booking detected - 89% occupancy predicted' },
  { id: 'review', name: 'ReviewSentinel', role: 'Reputation AI', status: 'alert', action: 'Negative review detected - escalating to GM' },
];

// =============================================================================
// COMPONENTS
// =============================================================================

const PropertyCard: React.FC<{ property: Property }> = ({ property }) => (
  <div className="p-2 bg-sovereign-elevated/30 rounded-lg border border-sovereign-border-subtle">
    <div className="flex items-center justify-between mb-1">
      <div className="flex items-center gap-1.5">
        <Hotel className="w-3 h-3 text-amber-400" />
        <span className="text-xs font-medium text-white truncate max-w-[120px]">{property.name}</span>
      </div>
      <div className="flex items-center gap-0.5">
        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
        <span className="text-[10px] text-amber-400">{property.rating}</span>
      </div>
    </div>
    
    <div className="grid grid-cols-4 gap-1 text-[10px]">
      <div>
        <p className="text-gray-500">Occ.</p>
        <p className={cn('font-medium', property.occupancy >= 90 ? 'text-emerald-400' : property.occupancy >= 75 ? 'text-white' : 'text-amber-400')}>
          {property.occupancy}%
        </p>
      </div>
      <div>
        <p className="text-gray-500">ADR</p>
        <p className="text-white font-medium">${property.adr}</p>
      </div>
      <div>
        <p className="text-gray-500">RevPAR</p>
        <p className="text-emerald-400 font-medium">${property.revpar}</p>
      </div>
      <div>
        <p className="text-gray-500">Today</p>
        <p className="text-cyan-400 font-medium">{property.bookingsToday}</p>
      </div>
    </div>
  </div>
);

const AgentCard: React.FC<{ agent: AIAgent }> = ({ agent }) => (
  <div className="p-2 bg-sovereign-elevated/50 rounded-lg border border-sovereign-border-subtle">
    <div className="flex items-center gap-2 mb-1">
      <div className={cn(
        'w-6 h-6 rounded-full flex items-center justify-center',
        agent.status === 'active' ? 'bg-emerald-900/50 text-emerald-400' :
        agent.status === 'optimizing' ? 'bg-cyan-900/50 text-cyan-400' :
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
        agent.status === 'optimizing' ? 'bg-cyan-500' : 'bg-amber-500'
      )} />
    </div>
    <p className="text-[10px] text-cyan-400">🎯 {agent.action}</p>
  </div>
);

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const HospitalityDashboard: React.FC<{ className?: string }> = ({ className }) => {
  const [properties, setProperties] = useState<Property[]>(PROPERTIES);
  const [agents, setAgents] = useState<AIAgent[]>(AI_AGENTS);

  useEffect(() => {
    const interval = setInterval(() => {
      setProperties(prev => prev.map((p): Property => ({
        ...p,
        occupancy: Math.max(50, Math.min(100, p.occupancy + Math.floor((deterministicFloat('hospitality-1') - 0.5) * 4))),
        bookingsToday: p.bookingsToday + (deterministicFloat('hospitality-2') > 0.7 ? 1 : 0),
      })));

      setAgents(prev => prev.map((a): AIAgent => ({
        ...a,
        status: deterministicFloat('hospitality-3') > 0.8 ? 'optimizing' : 'active',
      })));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const totalRooms = properties.reduce((sum, p) => sum + p.rooms, 0);
  const avgOccupancy = properties.reduce((sum, p) => sum + p.occupancy, 0) / properties.length;
  const avgRevpar = properties.reduce((sum, p) => sum + p.revpar, 0) / properties.length;
  const totalBookings = properties.reduce((sum, p) => sum + p.bookingsToday, 0);

  return (
    <div className={cn('relative w-full h-full min-h-[400px] rounded-lg overflow-hidden bg-sovereign-base p-3', className)}>
      {/* Header Stats */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        <div className="bg-amber-900/20 rounded-lg p-2 text-center border border-amber-500/30">
          <Bed className="w-4 h-4 mx-auto text-amber-400 mb-1" />
          <p className="text-lg font-bold text-white">{totalRooms.toLocaleString()}</p>
          <p className="text-[10px] text-gray-400">Total Rooms</p>
        </div>
        <div className="bg-emerald-900/20 rounded-lg p-2 text-center border border-emerald-500/30">
          <Users className="w-4 h-4 mx-auto text-emerald-400 mb-1" />
          <p className="text-lg font-bold text-white">{avgOccupancy.toFixed(0)}%</p>
          <p className="text-[10px] text-gray-400">Avg Occupancy</p>
        </div>
        <div className="bg-cyan-900/20 rounded-lg p-2 text-center border border-cyan-500/30">
          <DollarSign className="w-4 h-4 mx-auto text-cyan-400 mb-1" />
          <p className="text-lg font-bold text-white">${avgRevpar.toFixed(0)}</p>
          <p className="text-[10px] text-gray-400">Avg RevPAR</p>
        </div>
        <div className="bg-violet-900/20 rounded-lg p-2 text-center border border-violet-500/30">
          <Calendar className="w-4 h-4 mx-auto text-violet-400 mb-1" />
          <p className="text-lg font-bold text-white">{totalBookings}</p>
          <p className="text-[10px] text-gray-400">Bookings Today</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 h-[calc(100%-80px)]">
        {/* Left - Properties */}
        <div className="overflow-y-auto">
          <h3 className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1">
            <Hotel className="w-3 h-3" /> Properties ({properties.length})
          </h3>
          <div className="space-y-2">
            {properties.map(prop => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        </div>

        {/* Right - AI Agents */}
        <div className="overflow-y-auto">
          <h3 className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1">
            <Bot className="w-3 h-3" /> AI Hospitality Agents
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
        <span className="text-xs text-gray-300">Live Bookings</span>
      </div>
    </div>
  );
};

export default HospitalityDashboard;
