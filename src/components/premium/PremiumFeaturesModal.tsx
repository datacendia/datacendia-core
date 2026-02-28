// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

import React, { useState } from 'react';
import { cn } from '../../../lib/utils';
import {
  PREMIUM_FEATURES,
  PREMIUM_BUNDLES,
  PREMIUM_TIERS,
  PremiumFeature,
  PremiumBundle,
  PremiumTier,
  getFeatureById,
} from '../../data/premiumFeatures';

interface PremiumFeaturesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase?: (itemId: string, type: 'feature' | 'bundle') => void;
  currentFeatures?: string[]; // Already purchased feature IDs
}

type ViewMode = 'features' | 'bundles' | 'agents';

const PremiumFeaturesModal: React.FC<PremiumFeaturesModalProps> = ({
  isOpen,
  onClose,
  onPurchase,
  currentFeatures = [],
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('bundles');
  const [selectedTier, setSelectedTier] = useState<PremiumTier | 'all'>('all');
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);

  if (!isOpen) {
    return null;
  }

  const filteredFeatures =
    selectedTier === 'all'
      ? PREMIUM_FEATURES
      : PREMIUM_FEATURES.filter((f) => f.tier === selectedTier);

  const renderFeatureCard = (feature: PremiumFeature) => {
    const tier = PREMIUM_TIERS[feature.tier];
    const isOwned = currentFeatures.includes(feature.id);
    const isExpanded = expandedFeature === feature.id;

    return (
      <div
        key={feature.id}
        className={cn(
          'relative bg-white rounded-xl border-2 overflow-hidden transition-all',
          isOwned
            ? 'border-green-300 bg-green-50'
            : 'border-neutral-200 hover:border-neutral-300 hover:shadow-lg'
        )}
      >
        {/* Tier Badge */}
        <div
          className={cn(
            'absolute top-3 right-3 text-white text-[10px] font-bold px-2 py-0.5 rounded-full',
            `bg-gradient-to-r ${tier.bgGradient}`
          )}
        >
          {tier.icon} {tier.name.toUpperCase()}
        </div>

        {/* Owned Badge */}
        {isOwned && (
          <div className="absolute top-3 left-3 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            ✓ OWNED
          </div>
        )}

        <div className="p-5">
          {/* Icon & Name */}
          <div className="flex items-start gap-3 mb-3 mt-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
              style={{ backgroundColor: `${tier.color}20` }}
            >
              {feature.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-neutral-900">{feature.name}</h3>
              <p className="text-sm text-neutral-500">{feature.description}</p>
            </div>
          </div>

          {/* Tier Label */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-sm font-semibold text-neutral-700">
              {tier.annualPricing}
            </span>
            <span className="text-xs text-neutral-400">annual license</span>
          </div>

          {/* Features List */}
          <ul className="space-y-2 mb-4">
            {feature.features.slice(0, isExpanded ? undefined : 4).map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-neutral-600">
                <span className="text-green-500 mt-0.5">✓</span>
                {f}
              </li>
            ))}
          </ul>

          {feature.features.length > 4 && (
            <button
              onClick={() => setExpandedFeature(isExpanded ? null : feature.id)}
              className="text-sm text-primary-600 hover:text-primary-700 mb-4"
            >
              {isExpanded ? '← Show less' : `+ ${feature.features.length - 4} more features`}
            </button>
          )}

          {/* Agent Integration */}
          <div className="p-3 bg-neutral-50 rounded-lg mb-4">
            <p className="text-xs font-semibold text-neutral-500 mb-1">🤖 AGENT INTEGRATION</p>
            <p className="text-sm text-neutral-600">{feature.agentIntegration}</p>
          </div>

          {/* CTA Button */}
          <button
            onClick={() => onPurchase?.(feature.id, 'feature')}
            disabled={isOwned}
            className={cn(
              'w-full py-3 rounded-lg font-semibold transition-all',
              isOwned
                ? 'bg-green-100 text-green-700 cursor-default'
                : `bg-gradient-to-r ${tier.bgGradient} text-white hover:opacity-90 hover:shadow-md`
            )}
          >
            {isOwned ? '✓ Already Owned' : `Get ${feature.name}`}
          </button>
        </div>
      </div>
    );
  };

  const renderBundleCard = (bundle: PremiumBundle) => {
    const tier = PREMIUM_TIERS[bundle.tier];
    const includedFeatures = bundle.includedFeatures
      .map((id) => getFeatureById(id))
      .filter(Boolean) as PremiumFeature[];
    const allOwned = bundle.includedFeatures.every((id) => currentFeatures.includes(id));

    return (
      <div
        key={bundle.id}
        className={cn(
          'relative bg-white rounded-xl border-2 overflow-hidden transition-all',
          bundle.popular && 'ring-2 ring-primary-500 ring-offset-2',
          allOwned ? 'border-green-300 bg-green-50' : 'border-neutral-200 hover:shadow-xl'
        )}
      >
        {/* Popular Badge */}
        {bundle.popular && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-500 text-white text-xs font-bold px-4 py-1 rounded-full">
            ⭐ MOST POPULAR
          </div>
        )}

        {/* Tier Badge */}
        <div
          className={cn(
            'absolute top-3 right-3 text-white text-[10px] font-bold px-2 py-0.5 rounded-full',
            `bg-gradient-to-r ${tier.bgGradient}`
          )}
        >
          {tier.icon} {tier.name.toUpperCase()}
        </div>

        <div className="p-6 pt-8">
          {/* Icon & Name */}
          <div className="text-center mb-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3"
              style={{ backgroundColor: `${tier.color}20` }}
            >
              {bundle.icon}
            </div>
            <h3 className="text-xl font-bold text-neutral-900">{bundle.name}</h3>
            <p className="text-sm text-neutral-500 mt-1">{bundle.description}</p>
          </div>

          {/* Annual License Pricing */}
          <div className="text-center mb-4">
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-2xl font-bold text-neutral-900">{tier.annualPricing}</span>
            </div>
            <p className="text-xs text-neutral-500 mt-1">annual enterprise license</p>
          </div>

          {/* Included Features */}
          <div className="space-y-2 mb-6">
            <p className="text-xs font-semibold text-neutral-500">INCLUDES {includedFeatures.length} PILLARS:</p>
            {includedFeatures.map((feature) => (
              <div
                key={feature.id}
                className="flex items-center gap-2 p-2 bg-neutral-50 rounded-lg"
              >
                <span className="text-lg">{feature.icon}</span>
                <span className="text-sm font-medium text-neutral-700">{feature.name}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <button
            onClick={() => onPurchase?.(bundle.id, 'bundle')}
            disabled={allOwned}
            className={cn(
              'w-full py-3 rounded-lg font-semibold transition-all text-lg',
              allOwned
                ? 'bg-green-100 text-green-700 cursor-default'
                : `bg-gradient-to-r ${tier.bgGradient} text-white hover:opacity-90 hover:shadow-lg`
            )}
          >
            {allOwned ? '✓ All Pillars Licensed' : `License ${bundle.name}`}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-neutral-50 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-primary-600 via-purple-600 to-indigo-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <span>✨</span> Premium Features
              </h2>
              <p className="text-white/80 mt-1">
                Supercharge your AI Council with powerful add-ons
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>

          {/* View Mode & Billing Toggle */}
          <div className="flex items-center justify-between mt-6">
            {/* View Mode Toggle */}
            <div className="flex bg-white/20 rounded-lg p-1">
              <button
                onClick={() => setViewMode('bundles')}
                className={cn(
                  'px-4 py-2 rounded-md text-sm font-medium transition-all',
                  viewMode === 'bundles'
                    ? 'bg-white text-primary-600'
                    : 'text-white hover:bg-white/10'
                )}
              >
                💎 Bundles
              </button>
              <button
                onClick={() => setViewMode('features')}
                className={cn(
                  'px-4 py-2 rounded-md text-sm font-medium transition-all',
                  viewMode === 'features'
                    ? 'bg-white text-primary-600'
                    : 'text-white hover:bg-white/10'
                )}
              >
                📦 Individual Features
              </button>
              <button
                onClick={() => setViewMode('agents')}
                className={cn(
                  'px-4 py-2 rounded-md text-sm font-medium transition-all',
                  viewMode === 'agents'
                    ? 'bg-white text-primary-600'
                    : 'text-white hover:bg-white/10'
                )}
              >
                🤖 Premium Agents
              </button>
            </div>

            {/* Annual License Badge */}
            <div className="flex items-center gap-2 bg-white/20 rounded-lg px-4 py-2">
              <span className="text-sm text-white font-medium">Annual Enterprise License</span>
            </div>
          </div>
        </div>

        {/* Tier Filter (Features view only) */}
        {viewMode === 'features' && (
          <div className="px-6 py-4 bg-white border-b border-neutral-200">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-neutral-600">Filter by tier:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedTier('all')}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                    selectedTier === 'all'
                      ? 'bg-neutral-900 text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  )}
                >
                  All
                </button>
                {Object.entries(PREMIUM_TIERS).map(([key, tier]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedTier(key as PremiumTier)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1',
                      selectedTier === key
                        ? `bg-gradient-to-r ${tier.bgGradient} text-white`
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    )}
                  >
                    {tier.icon} {tier.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {viewMode === 'bundles' ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PREMIUM_BUNDLES.map((bundle) => renderBundleCard(bundle))}
            </div>
          ) : viewMode === 'features' ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFeatures.map((feature) => renderFeatureCard(feature))}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Premium Agents Tab Content */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 mb-4">
                <p className="text-sm text-amber-800">
                  <span className="font-semibold">🔓 Unlock Premium Agents</span> — Get access to
                  specialized AI agents for compliance, healthcare, finance, and legal domains by
                  purchasing the relevant feature packs above.
                </p>
              </div>

              {/* Audit & Compliance Agents */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-semibold text-neutral-700">
                    External & Audit Agents
                  </span>
                  <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                    Audit Excellence Pack
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { name: 'External Auditor', desc: 'Independent Third-Party Audit', icon: '🔍' },
                    {
                      name: 'Internal Auditor',
                      desc: 'Internal Controls & Process Audit',
                      icon: '📋',
                    },
                  ].map((agent, i) => (
                    <div
                      key={i}
                      className="p-4 bg-white border border-neutral-200 rounded-xl hover:shadow-md transition-shadow"
                    >
                      <div className="text-2xl mb-2">{agent.icon}</div>
                      <p className="font-medium text-neutral-900 text-sm">{agent.name}</p>
                      <p className="text-xs text-neutral-500">{agent.desc}</p>
                      <button
                        onClick={() => onPurchase?.('audit-excellence', 'feature')}
                        className="mt-3 w-full text-xs py-1.5 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors"
                      >
                        Unlock with Audit Pack
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Healthcare Agents */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-semibold text-neutral-700">
                    Clinical / Healthcare Agents
                  </span>
                  <span className="text-[10px] bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded-full font-medium">
                    Healthcare Industry Pack
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    {
                      name: 'Chief Medical Information Officer',
                      desc: 'Healthcare IT & Clinical Systems',
                      icon: '🏥',
                    },
                    {
                      name: 'Patient Safety Officer',
                      desc: 'Clinical Safety & Quality',
                      icon: '🛡️',
                    },
                    {
                      name: 'Healthcare Compliance Officer',
                      desc: 'HIPAA & Healthcare Regulations',
                      icon: '⚖️',
                    },
                    {
                      name: 'Clinical Operations Director',
                      desc: 'Healthcare Operations & Efficiency',
                      icon: '📊',
                    },
                  ].map((agent, i) => (
                    <div
                      key={i}
                      className="p-4 bg-white border border-neutral-200 rounded-xl hover:shadow-md transition-shadow"
                    >
                      <div className="text-2xl mb-2">{agent.icon}</div>
                      <p className="font-medium text-neutral-900 text-sm">{agent.name}</p>
                      <p className="text-xs text-neutral-500">{agent.desc}</p>
                      <button
                        onClick={() => onPurchase?.('healthcare-industry', 'feature')}
                        className="mt-3 w-full text-xs py-1.5 bg-cyan-100 text-cyan-700 rounded-lg hover:bg-cyan-200 transition-colors"
                      >
                        Unlock with Healthcare Pack
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Finance Agents */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-semibold text-neutral-700">
                    Finance & Investment Agents
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                    Finance Industry Pack
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    {
                      name: 'Quantitative Analyst',
                      desc: 'Financial Modeling & Risk Analytics',
                      icon: '📈',
                    },
                    {
                      name: 'Portfolio Manager',
                      desc: 'Investment Strategy & Asset Allocation',
                      icon: '💼',
                    },
                    {
                      name: 'Credit Risk Officer',
                      desc: 'Credit Analysis & Risk Assessment',
                      icon: '🏦',
                    },
                    { name: 'Treasury Analyst', desc: 'Cash Management & Liquidity', icon: '💰' },
                  ].map((agent, i) => (
                    <div
                      key={i}
                      className="p-4 bg-white border border-neutral-200 rounded-xl hover:shadow-md transition-shadow"
                    >
                      <div className="text-2xl mb-2">{agent.icon}</div>
                      <p className="font-medium text-neutral-900 text-sm">{agent.name}</p>
                      <p className="text-xs text-neutral-500">{agent.desc}</p>
                      <button
                        onClick={() => onPurchase?.('finance-industry', 'feature')}
                        className="mt-3 w-full text-xs py-1.5 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors"
                      >
                        Unlock with Finance Pack
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Legal Agents */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-semibold text-neutral-700">
                    Legal & Compliance Agents
                  </span>
                  <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                    Legal Industry Pack
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    {
                      name: 'Contract Specialist',
                      desc: 'Contract Analysis & Negotiation',
                      icon: '📝',
                    },
                    {
                      name: 'Intellectual Property Counsel',
                      desc: 'Patents, Trademarks & IP Strategy',
                      icon: '💡',
                    },
                    {
                      name: 'Litigation Expert',
                      desc: 'Dispute Resolution & Trial Strategy',
                      icon: '⚖️',
                    },
                    {
                      name: 'Regulatory Affairs Counsel',
                      desc: 'Government Relations & Compliance',
                      icon: '🏛️',
                    },
                  ].map((agent, i) => (
                    <div
                      key={i}
                      className="p-4 bg-white border border-neutral-200 rounded-xl hover:shadow-md transition-shadow"
                    >
                      <div className="text-2xl mb-2">{agent.icon}</div>
                      <p className="font-medium text-neutral-900 text-sm">{agent.name}</p>
                      <p className="text-xs text-neutral-500">{agent.desc}</p>
                      <button
                        onClick={() => onPurchase?.('legal-industry', 'feature')}
                        className="mt-3 w-full text-xs py-1.5 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                      >
                        Unlock with Legal Pack
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-neutral-200 text-center">
          <p className="text-sm text-neutral-500">
            💳 Secure payment via Stripe • 30-day money-back guarantee • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
};

export default PremiumFeaturesModal;
