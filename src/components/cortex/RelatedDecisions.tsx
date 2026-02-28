// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * CENDIA RELATED DECISIONS COMPONENT
 * 
 * Displays decision packets related to an entity (KPI, model, integration, etc.)
 * For use on entity detail pages to provide governance context
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileCheck,
  ExternalLink,
  Clock,
  CheckCircle2,
  Lock,
  AlertTriangle,
  Archive,
  FileText,
  ChevronRight,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { evidenceVaultApi, RelatedDecision, PacketStatus, DecisionMode } from '../../services/EvidenceVaultService';

// =============================================================================
// TYPES
// =============================================================================

interface RelatedDecisionsProps {
  entityType: string;
  entityId: string;
  entityName?: string;
  className?: string;
  compact?: boolean;
  maxItems?: number;
}

// =============================================================================
// HELPERS
// =============================================================================

const getStatusConfig = (status: PacketStatus) => {
  switch (status) {
    case 'draft':
      return { label: 'Draft', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', icon: FileText };
    case 'under_review':
      return { label: 'Under Review', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', icon: Clock };
    case 'approved':
      return { label: 'Approved', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', icon: CheckCircle2 };
    case 'locked':
      return { label: 'Locked', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30', icon: Lock };
    case 'superseded':
      return { label: 'Superseded', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', icon: Archive };
  }
};

const getModeConfig = (mode: DecisionMode) => {
  switch (mode) {
    case 'due_diligence':
      return { label: 'Due Diligence', color: 'text-blue-400', icon: '🔍' };
    case 'war_room':
      return { label: 'War Room', color: 'text-red-400', icon: '🚨' };
    case 'compliance':
      return { label: 'Compliance', color: 'text-purple-400', icon: '⚖️' };
    case 'strategic':
      return { label: 'Strategic', color: 'text-amber-400', icon: '🎯' };
    case 'operational':
      return { label: 'Operational', color: 'text-emerald-400', icon: '⚙️' };
  }
};

const getRelationshipLabel = (relationship: RelatedDecision['relationship']) => {
  switch (relationship) {
    case 'impacts':
      return 'Impacts';
    case 'impacted_by':
      return 'Impacted By';
    case 'related':
      return 'Related';
    case 'supersedes':
      return 'Supersedes';
    case 'superseded_by':
      return 'Superseded By';
  }
};

// =============================================================================
// COMPONENT
// =============================================================================

export const RelatedDecisions: React.FC<RelatedDecisionsProps> = ({
  entityType,
  entityId,
  entityName,
  className,
  compact = false,
  maxItems = 5,
}) => {
  const navigate = useNavigate();
  const [decisions, setDecisions] = useState<RelatedDecision[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRelatedDecisions = async () => {
      try {
        setIsLoading(true);
        const data = await evidenceVaultApi.getRelatedDecisions(entityType, entityId);
        setDecisions(data.slice(0, maxItems));
      } catch (err: any) {
        setError(err.message || 'Failed to load related decisions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelatedDecisions();
  }, [entityType, entityId, maxItems]);

  if (isLoading) {
    return (
      <div className={cn('bg-sovereign-card border border-sovereign-border rounded-xl p-4', className)}>
        <div className="animate-pulse">
          <div className="h-4 bg-sovereign-elevated rounded w-1/3 mb-4" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-sovereign-elevated rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn('bg-sovereign-card border border-sovereign-border rounded-xl p-4', className)}>
        <div className="flex items-center gap-2 text-amber-400">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-sm">{error}</span>
        </div>
      </div>
    );
  }

  if (decisions.length === 0) {
    return (
      <div className={cn('bg-sovereign-card border border-sovereign-border rounded-xl p-4', className)}>
        <h3 className="text-sm font-semibold text-gray-400 mb-3">Related Decisions</h3>
        <p className="text-sm text-gray-500">No related decisions found for this {entityType}.</p>
      </div>
    );
  }

  if (compact) {
    return (
      <div className={cn('bg-sovereign-card border border-sovereign-border rounded-xl p-4', className)}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-400">Related Decisions</h3>
          <span className="text-xs text-cyan-400">{decisions.length} found</span>
        </div>
        <div className="space-y-2">
          {decisions.map((decision) => {
            const statusConfig = getStatusConfig(decision.status);
            const StatusIcon = statusConfig.icon;

            return (
              <button
                key={decision.packetId}
                onClick={() => navigate(`/cortex/enterprise/evidence-vault?id=${decision.packetId}`)}
                className="w-full flex items-center justify-between p-2 bg-sovereign-elevated rounded-lg hover:bg-sovereign-hover transition-colors text-left"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <StatusIcon className={cn('w-4 h-4 flex-shrink-0', statusConfig.color.split(' ')[1])} />
                  <span className="text-sm text-white truncate">{decision.decisionTitle}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-500 flex-shrink-0" />
              </button>
            );
          })}
        </div>
        <button
          onClick={() => navigate('/cortex/enterprise/evidence-vault')}
          className="mt-3 w-full text-center text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          View all in Evidence Vault →
        </button>
      </div>
    );
  }

  return (
    <div className={cn('bg-sovereign-card border border-sovereign-border rounded-xl', className)}>
      <div className="p-4 border-b border-sovereign-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
            <FileCheck className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Related Decisions</h3>
            <p className="text-xs text-gray-500">
              {entityName ? `Governance context for ${entityName}` : `${decisions.length} decision packets`}
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/cortex/enterprise/evidence-vault')}
          className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <span>View All</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      <div className="divide-y divide-sovereign-border">
        {decisions.map((decision) => {
          const statusConfig = getStatusConfig(decision.status);
          const modeConfig = getModeConfig(decision.mode);
          const StatusIcon = statusConfig.icon;

          return (
            <div
              key={decision.packetId}
              className="p-4 hover:bg-sovereign-hover/50 transition-colors cursor-pointer"
              onClick={() => navigate(`/cortex/enterprise/evidence-vault?id=${decision.packetId}`)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border',
                        statusConfig.color
                      )}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {statusConfig.label}
                    </span>
                    <span className={cn('text-xs', modeConfig.color)}>
                      {modeConfig.icon} {modeConfig.label}
                    </span>
                  </div>
                  <h4 className="font-medium text-white truncate">{decision.decisionTitle}</h4>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                    <span className="font-mono">{decision.decisionId}</span>
                    <span>•</span>
                    <span className="text-gray-400">{getRelationshipLabel(decision.relationship)}</span>
                    <span>•</span>
                    <span>
                      Relevance: {Math.round(decision.relevanceScore * 100)}%
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-500 flex-shrink-0" />
              </div>
            </div>
          );
        })}
      </div>

      {decisions.length >= maxItems && (
        <div className="p-3 border-t border-sovereign-border text-center">
          <button
            onClick={() => navigate('/cortex/enterprise/evidence-vault')}
            className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            View all related decisions in Evidence Vault →
          </button>
        </div>
      )}
    </div>
  );
};

export default RelatedDecisions;
