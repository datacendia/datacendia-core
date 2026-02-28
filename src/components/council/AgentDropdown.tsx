// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// AI AGENTS DROPDOWN SELECTOR
// Detailed dropdown list for selecting AI agents on the Council page
// Enterprise Platinum Ready
// =============================================================================

import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  Check,
  Search,
  Users,
  Zap,
  Shield,
  Brain,
  TrendingUp,
  Database,
  Scale,
  Target,
} from 'lucide-react';
import { cn } from '../../../lib/utils';

// Agent category definitions
const AGENT_CATEGORIES = {
  Executive: {
    icon: Users,
    color: '#6366F1',
    description: 'C-Suite strategic advisors',
  },
  Financial: {
    icon: TrendingUp,
    color: '#10B981',
    description: 'Financial analysis & planning',
  },
  Operations: {
    icon: Target,
    color: '#F59E0B',
    description: 'Operational excellence',
  },
  Technology: {
    icon: Database,
    color: '#3B82F6',
    description: 'Technical strategy & security',
  },
  'Risk & Compliance': {
    icon: Shield,
    color: '#EF4444',
    description: 'Risk management & governance',
  },
  Custom: {
    icon: Brain,
    color: '#8B5CF6',
    description: 'Your custom agents',
  },
} as const;

// Agent interface
interface Agent {
  id: string;
  code: string;
  name: string;
  role: string;
  description: string;
  avatar: string;
  color: string;
  status: 'online' | 'offline' | 'busy';
  capabilities?: string[];
  premium?: boolean;
  premiumPrice?: string;
  isCustom?: boolean;
  category?: keyof typeof AGENT_CATEGORIES;
}

interface AgentDropdownProps {
  agents: Agent[];
  selectedAgents: string[];
  onSelectionChange: (agentIds: string[]) => void;
  onSelectAll?: () => void;
  onClearSelection?: () => void;
  className?: string;
  compact?: boolean;
}

// Categorize agents
function categorizeAgents(agents: Agent[]): Record<string, Agent[]> {
  const categories: Record<string, Agent[]> = {};

  for (const agent of agents) {
    // Determine category based on agent code/role
    let category: string;

    if (agent.isCustom) {
      category = 'Custom';
    } else if (['chief', 'ceo'].includes(agent.code.toLowerCase())) {
      category = 'Executive';
    } else if (['cfo', 'treasurer', 'finance'].includes(agent.code.toLowerCase())) {
      category = 'Financial';
    } else if (['coo', 'operations', 'supply'].includes(agent.code.toLowerCase())) {
      category = 'Operations';
    } else if (['cto', 'cio', 'ciso', 'tech', 'data'].includes(agent.code.toLowerCase())) {
      category = 'Technology';
    } else if (['risk', 'compliance', 'legal', 'clo', 'redteam', 'devils-advocate'].includes(agent.code.toLowerCase())) {
      category = 'Risk & Compliance';
    } else if (['analyst', 'arbiter'].includes(agent.code.toLowerCase())) {
      category = 'Executive';
    } else if (['union', 'chro'].includes(agent.code.toLowerCase())) {
      category = 'Operations';
    } else {
      category = 'Executive';
    }

    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(agent);
  }

  return categories;
}

export function AgentDropdown({
  agents,
  selectedAgents,
  onSelectionChange,
  onSelectAll,
  onClearSelection,
  className,
  compact = false,
}: AgentDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(Object.keys(AGENT_CATEGORIES))
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter agents by search
  const filteredAgents = agents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Categorize filtered agents
  const categorizedAgents = categorizeAgents(filteredAgents);

  // Toggle agent selection
  const toggleAgent = (agentId: string) => {
    if (selectedAgents.includes(agentId)) {
      onSelectionChange(selectedAgents.filter((id) => id !== agentId));
    } else {
      onSelectionChange([...selectedAgents, agentId]);
    }
  };

  // Toggle category expansion
  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  // Select all agents in category
  const selectCategory = (category: string) => {
    const categoryAgentIds =
      categorizedAgents[category]?.filter((a) => a.status === 'online').map((a) => a.id) || [];

    const newSelection = new Set([...selectedAgents, ...categoryAgentIds]);
    onSelectionChange(Array.from(newSelection));
  };

  // Get selected agents display
  const selectedAgentsList = agents.filter((a) => selectedAgents.includes(a.id));
  const onlineCount = agents.filter((a) => a.status === 'online').length;

  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-lg border transition-all',
          isOpen
            ? 'bg-white border-primary-300 ring-2 ring-primary-100'
            : 'bg-white border-neutral-200 hover:border-neutral-300',
          compact && 'px-3 py-1.5'
        )}
      >
        {/* Selected agents avatars */}
        {selectedAgentsList.length > 0 ? (
          <div className="flex -space-x-1.5">
            {selectedAgentsList.slice(0, 4).map((agent) => (
              <div
                key={agent.id}
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs border-2 border-white"
                style={{ backgroundColor: agent.color }}
                title={agent.name}
              >
                {agent.avatar}
              </div>
            ))}
            {selectedAgentsList.length > 4 && (
              <div className="w-6 h-6 rounded-full bg-neutral-200 flex items-center justify-center text-xs border-2 border-white text-neutral-600">
                +{selectedAgentsList.length - 4}
              </div>
            )}
          </div>
        ) : (
          <Users className="w-4 h-4 text-neutral-400" />
        )}

        <span className={cn('font-medium text-neutral-700', compact && 'text-sm')}>
          {selectedAgents.length === 0
            ? 'All Agents'
            : `${selectedAgents.length} Agent${selectedAgents.length !== 1 ? 's' : ''}`}
        </span>

        <ChevronDown
          className={cn('w-4 h-4 text-neutral-400 transition-transform', isOpen && 'rotate-180')}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-96 bg-white rounded-xl border border-neutral-200 shadow-xl z-50 max-h-[480px] overflow-hidden flex flex-col">
          {/* Search Header */}
          <div className="p-3 border-b border-neutral-100 bg-neutral-50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search agents..."
                className="w-full pl-9 pr-4 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-300"
              />
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={() => {
                  const onlineIds = agents.filter((a) => a.status === 'online').map((a) => a.id);
                  onSelectionChange(onlineIds);
                }}
                className="text-xs px-2 py-1 bg-primary-50 text-primary-600 rounded hover:bg-primary-100 transition-colors"
              >
                Select All Online ({onlineCount})
              </button>
              <button
                onClick={() => onSelectionChange([])}
                className="text-xs px-2 py-1 bg-neutral-100 text-neutral-600 rounded hover:bg-neutral-200 transition-colors"
              >
                Clear Selection
              </button>
            </div>
          </div>

          {/* Agent Categories */}
          <div className="flex-1 overflow-y-auto">
            {Object.entries(AGENT_CATEGORIES).map(([categoryName, categoryInfo]) => {
              const categoryAgents = categorizedAgents[categoryName] || [];
              if (categoryAgents.length === 0) {
                return null;
              }

              const Icon = categoryInfo.icon;
              const isExpanded = expandedCategories.has(categoryName);
              const selectedInCategory = categoryAgents.filter((a) =>
                selectedAgents.includes(a.id)
              ).length;
              const onlineInCategory = categoryAgents.filter((a) => a.status === 'online').length;

              return (
                <div key={categoryName} className="border-b border-neutral-100 last:border-b-0">
                  {/* Category Header */}
                  <div
                    className="flex items-center justify-between px-4 py-3 bg-neutral-50 cursor-pointer hover:bg-neutral-100 transition-colors"
                    onClick={() => toggleCategory(categoryName)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${categoryInfo.color}15` }}
                      >
                        <Icon className="w-4 h-4" style={{ color: categoryInfo.color }} />
                      </div>
                      <div>
                        <div className="font-semibold text-neutral-800 text-sm">{categoryName}</div>
                        <div className="text-xs text-neutral-500">{categoryInfo.description}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 bg-white rounded-full text-neutral-600 border border-neutral-200">
                        {selectedInCategory}/{categoryAgents.length}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          selectCategory(categoryName);
                        }}
                        className="text-xs px-2 py-0.5 bg-primary-50 text-primary-600 rounded hover:bg-primary-100"
                      >
                        All
                      </button>
                      <ChevronDown
                        className={cn(
                          'w-4 h-4 text-neutral-400 transition-transform',
                          isExpanded && 'rotate-180'
                        )}
                      />
                    </div>
                  </div>

                  {/* Category Agents */}
                  {isExpanded && (
                    <div className="p-2 space-y-1">
                      {categoryAgents.map((agent) => {
                        const isSelected = selectedAgents.includes(agent.id);
                        const isOnline = agent.status === 'online';

                        return (
                          <div
                            key={agent.id}
                            onClick={() => isOnline && toggleAgent(agent.id)}
                            className={cn(
                              'flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all',
                              isSelected
                                ? 'bg-primary-50 border border-primary-200'
                                : 'hover:bg-neutral-50 border border-transparent',
                              !isOnline && 'opacity-50 cursor-not-allowed'
                            )}
                          >
                            {/* Avatar */}
                            <div className="relative">
                              <div
                                className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                                style={{ backgroundColor: `${agent.color}20` }}
                              >
                                {agent.avatar}
                              </div>
                              <span
                                className={cn(
                                  'absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white',
                                  isOnline ? 'bg-green-500' : 'bg-neutral-300'
                                )}
                              />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-neutral-800 text-sm truncate">
                                  {agent.name}
                                </span>
                                {agent.premium && (
                                  <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded font-medium">
                                    PRO
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-neutral-500 truncate">{agent.role}</div>
                              {agent.capabilities && agent.capabilities.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {agent.capabilities.slice(0, 2).map((cap, i) => (
                                    <span
                                      key={i}
                                      className="text-[10px] px-1.5 py-0.5 bg-neutral-100 text-neutral-500 rounded"
                                    >
                                      {cap.replace(/_/g, ' ')}
                                    </span>
                                  ))}
                                  {agent.capabilities.length > 2 && (
                                    <span className="text-[10px] text-neutral-400">
                                      +{agent.capabilities.length - 2}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Selection Indicator */}
                            <div
                              className={cn(
                                'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all',
                                isSelected
                                  ? 'bg-primary-500 border-primary-500'
                                  : 'border-neutral-300'
                              )}
                            >
                              {isSelected && <Check className="w-3 h-3 text-white" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-neutral-100 bg-neutral-50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-500">
                {selectedAgents.length} of {agents.length} agents selected
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="px-3 py-1.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Compact version for inline use
export function AgentDropdownCompact({
  agents,
  selectedAgents,
  onSelectionChange,
}: Omit<AgentDropdownProps, 'compact'>) {
  return (
    <AgentDropdown
      agents={agents}
      selectedAgents={selectedAgents}
      onSelectionChange={onSelectionChange}
      compact={true}
    />
  );
}

export default AgentDropdown;
