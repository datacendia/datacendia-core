// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Agent Card Component
 * Displays an AI agent with status and capabilities
 */
import React from 'react';
import { cn } from '../../../lib/utils';

interface Agent {
  id: string;
  code: string;
  name: string;
  role: string;
  description: string;
  avatarUrl?: string;
  status: 'online' | 'offline' | 'busy';
  capabilities?: string[];
}

interface AgentCardProps {
  agent: Agent;
  isSelected?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

// Agent avatar colors by code
const agentColors: Record<string, { bg: string; text: string }> = {
  chief: { bg: '#6366F1', text: 'white' },
  cfo: { bg: '#10B981', text: 'white' },
  coo: { bg: '#F59E0B', text: 'white' },
  ciso: { bg: '#EF4444', text: 'white' },
  cmo: { bg: '#EC4899', text: 'white' },
  cro: { bg: '#8B5CF6', text: 'white' },
  cdo: { bg: '#3B82F6', text: 'white' },
  risk: { bg: '#14B8A6', text: 'white' },
  default: { bg: '#6B7280', text: 'white' },
};

// Status indicator colors
const statusColors: Record<string, string> = {
  online: '#10B981',
  offline: '#9CA3AF',
  busy: '#F59E0B',
};

export const AgentCard: React.FC<AgentCardProps> = ({
  agent,
  isSelected = false,
  onClick,
  size = 'md',
}) => {
  const colors = agentColors[agent.code] || agentColors.default;

  const sizeClasses = {
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6',
  };

  const avatarSizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-xl border transition-all cursor-pointer',
        sizeClasses[size],
        isSelected
          ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200'
          : 'border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-md'
      )}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          {agent.avatarUrl ? (
            <img
              src={agent.avatarUrl}
              alt={agent.name}
              className={cn('rounded-full object-cover', avatarSizes[size])}
            />
          ) : (
            <div
              className={cn(
                'rounded-full flex items-center justify-center font-semibold',
                avatarSizes[size]
              )}
              style={{ backgroundColor: colors.bg, color: colors.text }}
            >
              {agent.name.slice(0, 2).toUpperCase()}
            </div>
          )}
          {/* Status indicator */}
          <span
            className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white"
            style={{ backgroundColor: statusColors[agent.status] }}
            title={agent.status}
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3
            className={cn(
              'font-semibold text-neutral-900 truncate',
              size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base'
            )}
          >
            {agent.name}
          </h3>
          <p className={cn('text-neutral-500 truncate', size === 'sm' ? 'text-xs' : 'text-sm')}>
            {agent.role}
          </p>
          {size !== 'sm' && (
            <p className="text-xs text-neutral-400 mt-1 line-clamp-2">{agent.description}</p>
          )}
        </div>

        {/* Selection checkmark */}
        {isSelected && (
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Capabilities (only in large size) */}
      {size === 'lg' && agent.capabilities && agent.capabilities.length > 0 && (
        <div className="mt-3 pt-3 border-t border-neutral-100">
          <div className="flex flex-wrap gap-1">
            {agent.capabilities.slice(0, 4).map((cap, i) => (
              <span
                key={i}
                className="px-2 py-0.5 text-xs rounded-full bg-neutral-100 text-neutral-600"
              >
                {cap.replace(/_/g, ' ')}
              </span>
            ))}
            {agent.capabilities.length > 4 && (
              <span className="px-2 py-0.5 text-xs text-neutral-400">
                +{agent.capabilities.length - 4} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentCard;
