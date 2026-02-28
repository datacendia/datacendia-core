// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * DecisionLifecycle - A unified visualization of how decisions flow through Datacendia modules
 *
 * Shows the complete journey:
 * 1. Question asked in Council
 * 2. Council produces synthesis + confidence + dissent
 * 3. Output becomes Decision DNA record
 * 4. Crucible runs stress scenarios
 * 5. Vox runs stakeholder assembly (optional)
 * 6. Panopticon/Aegis checks regulatory and security exposure
 * 7. Eternal archives final decision pack
 */

import React, { useState } from 'react';
import {
  MessageSquare,
  Brain,
  Dna,
  FlaskConical,
  Users,
  Shield,
  Archive,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertTriangle,
  Play,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from 'lucide-react';

// Decision lifecycle stages
const LIFECYCLE_STAGES = [
  {
    id: 'council',
    name: 'Council Deliberation',
    module: 'CendiaCouncil™',
    icon: <MessageSquare className="w-6 h-6" />,
    color: 'cyan',
    description: 'Question submitted, agents deliberate, synthesis produced',
    outputs: [
      'Executive synthesis',
      'Confidence score',
      'Dissent registry',
      'Cross-examination log',
    ],
    link: '/cortex/council',
  },
  {
    id: 'dna',
    name: 'Decision DNA Record',
    module: 'CendiaDecisionDNA™',
    icon: <Dna className="w-6 h-6" />,
    color: 'purple',
    description: 'Decision recorded with full provenance and rationale',
    outputs: ['Immutable record', 'Linked evidence', 'Stakeholder sign-offs', 'Version history'],
    link: '/cortex/intelligence/decision-dna',
  },
  {
    id: 'crucible',
    name: 'Stress Testing',
    module: 'CendiaCrucible™',
    icon: <FlaskConical className="w-6 h-6" />,
    color: 'orange',
    description: 'Decision tested against multiple failure scenarios',
    outputs: ['Resilience score', 'Break points', 'Mitigation plan', 'Monte Carlo results'],
    link: '/cortex/sovereign/crucible',
    optional: true,
  },
  {
    id: 'vox',
    name: 'Stakeholder Assembly',
    module: 'CendiaVox™',
    icon: <Users className="w-6 h-6" />,
    color: 'teal',
    description: 'Stakeholder voices gathered, vetoes checked',
    outputs: ['Voice assembly', 'Veto check', 'Sentiment analysis', 'Resolution record'],
    link: '/cortex/sovereign/vox',
    optional: true,
  },
  {
    id: 'compliance',
    name: 'Compliance & Security',
    module: 'CendiaPanopticon™ + CendiaAegis™',
    icon: <Shield className="w-6 h-6" />,
    color: 'emerald',
    description: 'Regulatory and security exposure assessed',
    outputs: ['Compliance impact', 'Security assessment', 'Risk flags', 'Remediation items'],
    link: '/cortex/sovereign/panopticon',
  },
  {
    id: 'eternal',
    name: 'Archive',
    module: 'CendiaEternal™',
    icon: <Archive className="w-6 h-6" />,
    color: 'amber',
    description: 'Final decision pack archived for long-term preservation',
    outputs: ['Archived artifact', 'Hash chain entry', 'Successor access', 'Retention policy'],
    link: '/cortex/sovereign/eternal',
  },
];

// Example decision journey data
const EXAMPLE_JOURNEY = {
  id: 'dec-2025-042',
  title: 'Facility Expansion Phase 2',
  status: 'in_progress',
  currentStage: 'vox',
  stages: {
    council: {
      status: 'completed',
      timestamp: '2025-01-10 09:00',
      confidence: 82,
      hasDissent: true,
    },
    dna: { status: 'completed', timestamp: '2025-01-10 09:15', recordId: 'DNA-2025-042' },
    crucible: {
      status: 'completed',
      timestamp: '2025-01-10 10:30',
      resilienceScore: 68,
      breakPoints: 3,
    },
    vox: {
      status: 'vetoed',
      timestamp: '2025-01-10 11:00',
      vetoBy: 'Environment',
      reason: 'Irreversible harm',
    },
    compliance: { status: 'pending' },
    eternal: { status: 'pending' },
  },
};

interface DecisionLifecycleProps {
  variant?: 'full' | 'compact' | 'inline';
  showExample?: boolean;
  onStageClick?: (stageId: string, link: string) => void;
}

export const DecisionLifecycle: React.FC<DecisionLifecycleProps> = ({
  variant = 'full',
  showExample = true,
  onStageClick,
}) => {
  const [expandedStage, setExpandedStage] = useState<string | null>(null);
  const [showJourneyExample, setShowJourneyExample] = useState(showExample);

  const getColorClasses = (color: string, isActive: boolean = false) => {
    const colors: Record<string, { bg: string; border: string; text: string; bgActive: string }> = {
      cyan: {
        bg: 'bg-cyan-500/10',
        border: 'border-cyan-500/30',
        text: 'text-cyan-400',
        bgActive: 'bg-cyan-500/20',
      },
      purple: {
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/30',
        text: 'text-purple-400',
        bgActive: 'bg-purple-500/20',
      },
      orange: {
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/30',
        text: 'text-orange-400',
        bgActive: 'bg-orange-500/20',
      },
      teal: {
        bg: 'bg-teal-500/10',
        border: 'border-teal-500/30',
        text: 'text-teal-400',
        bgActive: 'bg-teal-500/20',
      },
      emerald: {
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/30',
        text: 'text-emerald-400',
        bgActive: 'bg-emerald-500/20',
      },
      amber: {
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/30',
        text: 'text-amber-400',
        bgActive: 'bg-amber-500/20',
      },
    };
    return colors[color] || colors.purple;
  };

  const getStageStatus = (stageId: string) => {
    const stageData = EXAMPLE_JOURNEY.stages[stageId as keyof typeof EXAMPLE_JOURNEY.stages];
    return stageData?.status || 'pending';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'vetoed':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-amber-400 animate-pulse" />;
      default:
        return <Clock className="w-4 h-4 text-slate-500" />;
    }
  };

  if (variant === 'compact') {
    return (
      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-white text-sm">Decision Lifecycle</h3>
          <span className="text-xs text-slate-500">7 stages</span>
        </div>
        <div className="flex items-center gap-1">
          {LIFECYCLE_STAGES.map((stage, i) => {
            const colors = getColorClasses(stage.color);
            return (
              <React.Fragment key={stage.id}>
                <button
                  onClick={() => onStageClick?.(stage.id, stage.link)}
                  className={`w-8 h-8 rounded-full ${colors.bg} ${colors.border} border flex items-center justify-center hover:${colors.bgActive} transition-all`}
                  title={stage.name}
                >
                  <span className={colors.text}>
                    {React.cloneElement(stage.icon, { className: 'w-4 h-4' })}
                  </span>
                </button>
                {i < LIFECYCLE_STAGES.length - 1 && (
                  <ArrowRight className="w-3 h-3 text-slate-600" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className="flex items-center gap-2 text-xs">
        <span className="text-slate-500">Journey:</span>
        {LIFECYCLE_STAGES.map((stage, i) => (
          <React.Fragment key={stage.id}>
            <button
              onClick={() => onStageClick?.(stage.id, stage.link)}
              className={`${getColorClasses(stage.color).text} hover:underline`}
            >
              {stage.name.split(' ')[0]}
            </button>
            {i < LIFECYCLE_STAGES.length - 1 && <span className="text-slate-600">→</span>}
          </React.Fragment>
        ))}
      </div>
    );
  }

  // Full variant
  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Brain className="w-6 h-6 text-purple-400" />
              Decision Lifecycle
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              How decisions flow through Datacendia's Sovereign Stack
            </p>
          </div>
          <button
            onClick={() => setShowJourneyExample(!showJourneyExample)}
            className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs text-slate-300 flex items-center gap-1"
          >
            {showJourneyExample ? 'Hide' : 'Show'} live example
          </button>
        </div>
      </div>

      {/* Lifecycle Stages */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {LIFECYCLE_STAGES.map((stage, i) => {
            const colors = getColorClasses(stage.color);
            const isExpanded = expandedStage === stage.id;
            const status = showJourneyExample ? getStageStatus(stage.id) : 'pending';

            return (
              <div key={stage.id} className="relative">
                {/* Connector Arrow (hidden on first item and mobile) */}
                {i > 0 && (
                  <div className="hidden xl:block absolute -left-4 top-1/2 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-4 h-4 text-slate-600" />
                  </div>
                )}

                <div
                  className={`p-4 rounded-xl border ${colors.border} ${colors.bg} hover:${colors.bgActive} transition-all cursor-pointer ${
                    status === 'vetoed' ? 'ring-2 ring-red-500/50' : ''
                  }`}
                  onClick={() => setExpandedStage(isExpanded ? null : stage.id)}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 rounded-lg ${colors.bgActive}`}>
                      <span className={colors.text}>{stage.icon}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {stage.optional && (
                        <span className="text-[10px] text-slate-500 px-1.5 py-0.5 bg-slate-700 rounded">
                          Optional
                        </span>
                      )}
                      {showJourneyExample && getStatusIcon(status)}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-white text-sm mb-1">{stage.name}</h3>
                  <p className="text-xs text-slate-500 mb-2">{stage.module}</p>

                  {/* Description */}
                  <p className="text-xs text-slate-400 mb-3">{stage.description}</p>

                  {/* Expand/Collapse */}
                  <button className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300">
                    {isExpanded ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )}
                    {isExpanded ? 'Less' : 'More'}
                  </button>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-slate-700 space-y-2">
                      <div className="text-xs text-slate-400">Outputs:</div>
                      <ul className="space-y-1">
                        {stage.outputs.map((output, j) => (
                          <li key={j} className="text-xs text-slate-300 flex items-center gap-1">
                            <span className={`w-1.5 h-1.5 rounded-full ${colors.bgActive}`}></span>
                            {output}
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onStageClick?.(stage.id, stage.link);
                        }}
                        className={`mt-2 w-full px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1 ${colors.text} bg-slate-800 hover:bg-slate-700`}
                      >
                        Open {stage.module.split('™')[0]} <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Example Journey */}
      {showJourneyExample && (
        <div className="p-6 border-t border-slate-700 bg-slate-900/50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-white">Live Example: {EXAMPLE_JOURNEY.title}</h3>
              <p className="text-xs text-slate-500">ID: {EXAMPLE_JOURNEY.id}</p>
            </div>
            <span className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-medium">
              Veto Active
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {LIFECYCLE_STAGES.map((stage, i) => {
              const stageData =
                EXAMPLE_JOURNEY.stages[stage.id as keyof typeof EXAMPLE_JOURNEY.stages];
              const status = stageData?.status || 'pending';

              return (
                <React.Fragment key={stage.id}>
                  <div
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${
                      status === 'completed'
                        ? 'bg-emerald-500/10 text-emerald-300'
                        : status === 'vetoed'
                          ? 'bg-red-500/10 text-red-300'
                          : status === 'in_progress'
                            ? 'bg-amber-500/10 text-amber-300'
                            : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {getStatusIcon(status)}
                    <span>{stage.name.split(' ')[0]}</span>
                    {stageData && 'timestamp' in stageData && stageData.timestamp && (
                      <span className="text-[10px] text-slate-500">
                        {stageData.timestamp.split(' ')[1]}
                      </span>
                    )}
                  </div>
                  {i < LIFECYCLE_STAGES.length - 1 && (
                    <ArrowRight
                      className={`w-3 h-3 ${status === 'pending' ? 'text-slate-700' : 'text-slate-500'}`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Veto Details */}
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <div className="flex items-center gap-2 text-red-400 text-sm font-medium mb-1">
              <AlertTriangle className="w-4 h-4" />
              Veto Triggered: Environment Stakeholder
            </div>
            <p className="text-xs text-slate-300">
              Reason: Irreversible environmental harm. Decision requires mitigation plan before
              proceeding.
            </p>
          </div>
        </div>
      )}

      {/* Footer CTA */}
      <div className="p-4 border-t border-slate-700 flex items-center justify-between">
        <p className="text-xs text-slate-500">
          Every decision creates a permanent, auditable record across the Sovereign Stack
        </p>
        <button
          onClick={() => onStageClick?.('council', '/cortex/council')}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm font-medium flex items-center gap-2"
        >
          <Play className="w-4 h-4" /> Start New Decision
        </button>
      </div>
    </div>
  );
};

export default DecisionLifecycle;
