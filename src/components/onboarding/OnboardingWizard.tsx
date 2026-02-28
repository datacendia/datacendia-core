// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Onboarding Wizard Component
 *
 * Guided first-run experience:
 * 1. Connect data source
 * 2. Configure agents
 * 3. Run first deliberation
 */

import React, { useState } from 'react';
import { cn } from '../../../lib/utils';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface DataSource {
  id: string;
  name: string;
  icon: string;
  category: string;
  description: string;
  popular?: boolean;
}

const STEPS: OnboardingStep[] = [
  { id: 'welcome', title: 'Welcome', description: 'Get started with Datacendia', icon: '👋' },
  { id: 'data', title: 'Connect Data', description: 'Link your first data source', icon: '🔗' },
  { id: 'agents', title: 'Configure Agents', description: 'Set up your AI Council', icon: '🧠' },
  {
    id: 'deliberation',
    title: 'First Deliberation',
    description: 'Ask your first question',
    icon: '⚖️',
  },
  {
    id: 'activation',
    title: 'Activate Modules',
    description: 'Choose your activation path',
    icon: '🚀',
  },
  { id: 'complete', title: 'Complete', description: "You're ready to go!", icon: '🎉' },
];

// Module activation path - progressive unlocking
interface ModuleActivation {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlocks: string[];
  recommended: boolean;
  tier: 'core' | 'advanced' | 'sovereign';
}

const MODULE_ACTIVATION_PATH: ModuleActivation[] = [
  {
    id: 'council',
    name: 'AI Council',
    icon: '⚖️',
    description: 'Multi-agent deliberation on strategic questions',
    unlocks: ['decision-dna'],
    recommended: true,
    tier: 'core',
  },
  {
    id: 'decision-dna',
    name: 'Decision DNA',
    icon: '🧬',
    description: 'Track and analyze all decisions',
    unlocks: ['chronos', 'crucible'],
    recommended: true,
    tier: 'core',
  },
  {
    id: 'chronos',
    name: 'Chronos',
    icon: '⏰',
    description: 'Time-travel through your decision history',
    unlocks: [],
    recommended: false,
    tier: 'core',
  },
  {
    id: 'crucible',
    name: 'Crucible',
    icon: '🔥',
    description: 'Stress-test decisions with simulations',
    unlocks: ['vox'],
    recommended: true,
    tier: 'advanced',
  },
  {
    id: 'vox',
    name: 'Vox',
    icon: '🗣️',
    description: 'Stakeholder voice assembly',
    unlocks: ['eternal'],
    recommended: false,
    tier: 'advanced',
  },
  {
    id: 'panopticon',
    name: 'Panopticon',
    icon: '👁️',
    description: 'Regulatory intelligence monitoring',
    unlocks: [],
    recommended: false,
    tier: 'advanced',
  },
  {
    id: 'symbiont',
    name: 'Symbiont',
    icon: '🤝',
    description: 'Partnership ecosystem management',
    unlocks: [],
    recommended: false,
    tier: 'advanced',
  },
  {
    id: 'aegis',
    name: 'Aegis',
    icon: '🛡️',
    description: 'Threat detection and security intel',
    unlocks: [],
    recommended: false,
    tier: 'sovereign',
  },
  {
    id: 'eternal',
    name: 'Eternal',
    icon: '📜',
    description: '100-year institutional memory',
    unlocks: [],
    recommended: false,
    tier: 'sovereign',
  },
];

const ACTIVATION_PATHS = [
  {
    id: 'quick',
    name: 'Quick Start',
    description: 'Council + Decision DNA only',
    modules: ['council', 'decision-dna'],
    time: '5 min',
  },
  {
    id: 'recommended',
    name: 'Recommended',
    description: 'Core + Crucible for stress testing',
    modules: ['council', 'decision-dna', 'crucible'],
    time: '10 min',
  },
  {
    id: 'complete',
    name: 'Full Platform',
    description: 'All modules activated',
    modules: MODULE_ACTIVATION_PATH.map((m) => m.id),
    time: '20 min',
  },
];

const DATA_SOURCES: DataSource[] = [
  {
    id: 'salesforce',
    name: 'Salesforce',
    icon: '☁️',
    category: 'CRM',
    description: 'Connect your Salesforce instance',
    popular: true,
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    icon: '🧡',
    category: 'CRM',
    description: 'Sync HubSpot contacts and deals',
    popular: true,
  },
  {
    id: 'snowflake',
    name: 'Snowflake',
    icon: '❄️',
    category: 'Data Warehouse',
    description: 'Query your Snowflake data',
    popular: true,
  },
  {
    id: 'bigquery',
    name: 'BigQuery',
    icon: '📊',
    category: 'Data Warehouse',
    description: 'Connect Google BigQuery',
  },
  {
    id: 'postgres',
    name: 'PostgreSQL',
    icon: '🐘',
    category: 'Database',
    description: 'Direct PostgreSQL connection',
  },
  {
    id: 'mysql',
    name: 'MySQL',
    icon: '🐬',
    category: 'Database',
    description: 'Connect MySQL database',
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    icon: '🍃',
    category: 'Database',
    description: 'NoSQL MongoDB connection',
  },
  {
    id: 'sap',
    name: 'SAP',
    icon: '🔷',
    category: 'ERP',
    description: 'SAP S/4HANA integration',
    popular: true,
  },
  {
    id: 'netsuite',
    name: 'NetSuite',
    icon: '📦',
    category: 'ERP',
    description: 'Oracle NetSuite connection',
  },
  {
    id: 'quickbooks',
    name: 'QuickBooks',
    icon: '💚',
    category: 'Finance',
    description: 'Intuit QuickBooks sync',
  },
  {
    id: 'xero',
    name: 'Xero',
    icon: '💙',
    category: 'Finance',
    description: 'Xero accounting data',
  },
  {
    id: 'stripe',
    name: 'Stripe',
    icon: '💳',
    category: 'Payments',
    description: 'Stripe payments and subscriptions',
  },
  {
    id: 'slack',
    name: 'Slack',
    icon: '💬',
    category: 'Communication',
    description: 'Slack workspace integration',
  },
  {
    id: 'jira',
    name: 'Jira',
    icon: '📋',
    category: 'Project Management',
    description: 'Atlassian Jira projects',
  },
  {
    id: 'github',
    name: 'GitHub',
    icon: '🐙',
    category: 'Development',
    description: 'GitHub repositories and issues',
  },
  {
    id: 'csv',
    name: 'CSV Upload',
    icon: '📄',
    category: 'File',
    description: 'Upload CSV or Excel files',
  },
  {
    id: 'api',
    name: 'REST API',
    icon: '🔌',
    category: 'Custom',
    description: 'Custom API integration',
  },
];

const AGENT_PRESETS = [
  {
    id: 'balanced',
    name: 'Balanced Council',
    description: 'CFO, COO, CISO, CMO - Good for general decisions',
    agents: ['cfo', 'coo', 'ciso', 'cmo'],
  },
  {
    id: 'financial',
    name: 'Financial Focus',
    description: 'CFO, Risk, CDO - Best for financial decisions',
    agents: ['cfo', 'risk', 'cdo'],
  },
  {
    id: 'operations',
    name: 'Operations Focus',
    description: 'COO, Risk, CDO - Ideal for operational planning',
    agents: ['coo', 'risk', 'cdo'],
  },
  {
    id: 'security',
    name: 'Security Focus',
    description: 'CISO, Risk, Ethics - For security and compliance',
    agents: ['ciso', 'risk', 'ethics'],
  },
  {
    id: 'growth',
    name: 'Growth Focus',
    description: 'CMO, CRO, CDO - For growth and market decisions',
    agents: ['cmo', 'cro', 'cdo'],
  },
  {
    id: 'all',
    name: 'Full Council',
    description: 'All 17 core agents - Maximum perspectives',
    agents: ['chief', 'cfo', 'coo', 'ciso', 'cmo', 'cro', 'cdo', 'risk', 'clo', 'cpo', 'caio', 'cso', 'cio', 'cco', 'actuary', 'partnerships', 'devils-advocate'],
  },
];

const SAMPLE_QUESTIONS = [
  'What are the key risks in our Q1 growth strategy?',
  'Should we expand into the European market this year?',
  'How can we reduce our operational costs by 15%?',
  "What's the best approach to our upcoming product launch?",
  'Analyze the competitive landscape in our industry',
];

interface OnboardingWizardProps {
  onComplete: () => void;
  onSkip: () => void;
}

const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedDataSource, setSelectedDataSource] = useState<string | null>(null);
  const [selectedAgentPreset, setSelectedAgentPreset] = useState<string>('balanced');
  const [firstQuestion, setFirstQuestion] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionSuccess, setConnectionSuccess] = useState(false);
  const [selectedActivationPath, setSelectedActivationPath] = useState<string>('recommended');
  const [activatedModules, setActivatedModules] = useState<string[]>(['council']);

  const step = STEPS[currentStep];

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleConnectDataSource = async () => {
    if (!selectedDataSource) {return;}

    setIsConnecting(true);
    // Simulate connection
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setConnectionSuccess(true);
    setIsConnecting(false);

    setTimeout(() => {
      handleNext();
    }, 1000);
  };

  const handleStartDeliberation = () => {
    if (firstQuestion.trim()) {
      // Would trigger actual deliberation
      handleNext();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-primary-900 via-neutral-900 to-neutral-900 flex items-center justify-center">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-4xl mx-4">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {STEPS.map((s, idx) => (
              <div
                key={s.id}
                className={cn(
                  'flex items-center gap-2',
                  idx <= currentStep ? 'text-white' : 'text-neutral-500'
                )}
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all',
                    idx < currentStep
                      ? 'bg-green-500 text-white'
                      : idx === currentStep
                        ? 'bg-primary-500 text-white ring-4 ring-primary-500/30'
                        : 'bg-neutral-700 text-neutral-400'
                  )}
                >
                  {idx < currentStep ? '✓' : s.icon}
                </div>
                <span className="hidden md:block text-sm font-medium">{s.title}</span>
              </div>
            ))}
          </div>
          <div className="h-1 bg-neutral-700 rounded-full">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-neutral-800/80 backdrop-blur-xl rounded-2xl border border-neutral-700 p-8 min-h-[500px]">
          {/* Welcome Step */}
          {step.id === 'welcome' && (
            <div className="text-center">
              <div className="text-6xl mb-6">🎯</div>
              <h1 className="text-3xl font-bold text-white mb-4">Welcome to Datacendia</h1>
              <p className="text-lg text-neutral-300 mb-8 max-w-2xl mx-auto">
                The AI-powered decision intelligence platform. Let's get you set up in just a few
                minutes.
              </p>
              <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-8">
                <div className="p-4 bg-neutral-700/50 rounded-xl">
                  <div className="text-2xl mb-2">🔗</div>
                  <div className="text-sm text-neutral-300">Connect your data</div>
                </div>
                <div className="p-4 bg-neutral-700/50 rounded-xl">
                  <div className="text-2xl mb-2">🧠</div>
                  <div className="text-sm text-neutral-300">Configure AI agents</div>
                </div>
                <div className="p-4 bg-neutral-700/50 rounded-xl">
                  <div className="text-2xl mb-2">⚖️</div>
                  <div className="text-sm text-neutral-300">Start deliberating</div>
                </div>
              </div>
            </div>
          )}

          {/* Data Source Step */}
          {step.id === 'data' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Connect Your First Data Source</h2>
              <p className="text-neutral-400 mb-6">
                Select a data source to power your Council's insights
              </p>

              {!connectionSuccess ? (
                <>
                  <div className="mb-4">
                    <span className="text-sm text-neutral-400">Popular integrations</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    {DATA_SOURCES.filter((ds) => ds.popular).map((ds) => (
                      <button
                        key={ds.id}
                        onClick={() => setSelectedDataSource(ds.id)}
                        className={cn(
                          'p-4 rounded-xl border transition-all text-left',
                          selectedDataSource === ds.id
                            ? 'bg-primary-900/50 border-primary-500'
                            : 'bg-neutral-700/50 border-neutral-600 hover:border-neutral-500'
                        )}
                      >
                        <div className="text-2xl mb-2">{ds.icon}</div>
                        <div className="font-medium text-white">{ds.name}</div>
                        <div className="text-xs text-neutral-400">{ds.category}</div>
                      </button>
                    ))}
                  </div>

                  <details className="mb-6">
                    <summary className="text-sm text-neutral-400 cursor-pointer hover:text-neutral-300">
                      Show all integrations ({DATA_SOURCES.length})
                    </summary>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                      {DATA_SOURCES.filter((ds) => !ds.popular).map((ds) => (
                        <button
                          key={ds.id}
                          onClick={() => setSelectedDataSource(ds.id)}
                          className={cn(
                            'p-3 rounded-xl border transition-all text-left',
                            selectedDataSource === ds.id
                              ? 'bg-primary-900/50 border-primary-500'
                              : 'bg-neutral-700/50 border-neutral-600 hover:border-neutral-500'
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{ds.icon}</span>
                            <div>
                              <div className="font-medium text-white text-sm">{ds.name}</div>
                              <div className="text-xs text-neutral-400">{ds.category}</div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </details>

                  {selectedDataSource && (
                    <button
                      onClick={handleConnectDataSource}
                      disabled={isConnecting}
                      className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                    >
                      {isConnecting ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Connecting...
                        </span>
                      ) : (
                        `Connect ${DATA_SOURCES.find((ds) => ds.id === selectedDataSource)?.name}`
                      )}
                    </button>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">✅</div>
                  <h3 className="text-xl font-bold text-white mb-2">Connected Successfully!</h3>
                  <p className="text-neutral-400">
                    {DATA_SOURCES.find((ds) => ds.id === selectedDataSource)?.name} is now linked to
                    your Council
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Agents Step */}
          {step.id === 'agents' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Configure Your AI Council</h2>
              <p className="text-neutral-400 mb-6">
                Choose a preset or customize which agents will advise you
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {AGENT_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => setSelectedAgentPreset(preset.id)}
                    className={cn(
                      'p-4 rounded-xl border transition-all text-left',
                      selectedAgentPreset === preset.id
                        ? 'bg-primary-900/50 border-primary-500'
                        : 'bg-neutral-700/50 border-neutral-600 hover:border-neutral-500'
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white">{preset.name}</span>
                      {selectedAgentPreset === preset.id && (
                        <span className="text-primary-400">✓</span>
                      )}
                    </div>
                    <p className="text-sm text-neutral-400 mb-3">{preset.description}</p>
                    <div className="flex gap-1">
                      {preset.agents.map((a) => (
                        <span
                          key={a}
                          className="px-2 py-0.5 bg-neutral-600 rounded text-xs text-neutral-300 uppercase"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* First Deliberation Step */}
          {step.id === 'deliberation' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Ask Your First Question</h2>
              <p className="text-neutral-400 mb-6">
                Let your AI Council analyze a strategic question
              </p>

              <textarea
                value={firstQuestion}
                onChange={(e) => setFirstQuestion(e.target.value)}
                placeholder="e.g., What are the key risks in our Q1 growth strategy?"
                className="w-full h-32 p-4 bg-neutral-700 border border-neutral-600 rounded-xl text-white placeholder-neutral-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 resize-none mb-4"
              />

              <div className="mb-6">
                <span className="text-sm text-neutral-400">Or try a sample question:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {SAMPLE_QUESTIONS.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => setFirstQuestion(q)}
                      className="px-3 py-1.5 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-sm text-neutral-300 transition-colors"
                    >
                      {q.slice(0, 40)}...
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Module Activation Step */}
          {step.id === 'activation' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Choose Your Activation Path</h2>
              <p className="text-neutral-400 mb-6">
                Start simple and unlock more as you go, or activate everything now
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {ACTIVATION_PATHS.map((path) => (
                  <button
                    key={path.id}
                    onClick={() => {
                      setSelectedActivationPath(path.id);
                      setActivatedModules(path.modules);
                    }}
                    className={cn(
                      'p-5 rounded-xl border transition-all text-left relative',
                      selectedActivationPath === path.id
                        ? 'bg-primary-900/50 border-primary-500 ring-2 ring-primary-500/30'
                        : 'bg-neutral-700/50 border-neutral-600 hover:border-neutral-500'
                    )}
                  >
                    {path.id === 'recommended' && (
                      <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-emerald-500 text-white text-xs font-medium rounded-full">
                        Recommended
                      </span>
                    )}
                    <div className="font-medium text-white mb-1">{path.name}</div>
                    <p className="text-sm text-neutral-400 mb-3">{path.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        {path.modules.slice(0, 4).map((m) => (
                          <span key={m} className="text-lg">
                            {MODULE_ACTIVATION_PATH.find((mod) => mod.id === m)?.icon}
                          </span>
                        ))}
                        {path.modules.length > 4 && (
                          <span className="text-xs text-neutral-400">
                            +{path.modules.length - 4}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-neutral-500">~{path.time}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Module Flow Visualization */}
              <div className="p-4 bg-neutral-900/50 rounded-xl border border-neutral-700">
                <div className="text-sm text-neutral-400 mb-4">Your activation path:</div>
                <div className="flex flex-wrap items-center gap-2">
                  {activatedModules.map((modId, idx) => {
                    const mod = MODULE_ACTIVATION_PATH.find((m) => m.id === modId);
                    return (
                      <React.Fragment key={modId}>
                        <div
                          className={cn(
                            'px-3 py-2 rounded-lg flex items-center gap-2',
                            mod?.tier === 'core'
                              ? 'bg-blue-500/20 border border-blue-500/30'
                              : mod?.tier === 'advanced'
                                ? 'bg-purple-500/20 border border-purple-500/30'
                                : 'bg-amber-500/20 border border-amber-500/30'
                          )}
                        >
                          <span>{mod?.icon}</span>
                          <span className="text-sm text-white">{mod?.name}</span>
                        </div>
                        {idx < activatedModules.length - 1 && (
                          <span className="text-neutral-500">→</span>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
                <p className="text-xs text-neutral-500 mt-3">
                  💡 Tip: You can always activate more modules later from Settings → Modules
                </p>
              </div>
            </div>
          )}

          {/* Complete Step */}
          {step.id === 'complete' && (
            <div className="text-center py-8">
              <div className="text-6xl mb-6">🎉</div>
              <h1 className="text-3xl font-bold text-white mb-4">You're All Set!</h1>
              <p className="text-lg text-neutral-300 mb-8 max-w-2xl mx-auto">
                Your Datacendia platform is configured. Start with the Council and explore from
                there.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-6">
                <div className="p-4 bg-neutral-700/50 rounded-xl">
                  <div className="text-green-400 text-2xl mb-2">✓</div>
                  <div className="text-sm text-neutral-300">Data Connected</div>
                </div>
                <div className="p-4 bg-neutral-700/50 rounded-xl">
                  <div className="text-green-400 text-2xl mb-2">✓</div>
                  <div className="text-sm text-neutral-300">Agents Ready</div>
                </div>
                <div className="p-4 bg-neutral-700/50 rounded-xl">
                  <div className="text-green-400 text-2xl mb-2">✓</div>
                  <div className="text-sm text-neutral-300">{activatedModules.length} Modules</div>
                </div>
                <div className="p-4 bg-neutral-700/50 rounded-xl">
                  <div className="text-green-400 text-2xl mb-2">✓</div>
                  <div className="text-sm text-neutral-300">Ready to Go</div>
                </div>
              </div>
              <div className="p-4 bg-primary-900/30 border border-primary-500/30 rounded-xl max-w-md mx-auto">
                <div className="text-sm text-primary-300 mb-2">Recommended first action:</div>
                <div className="text-white font-medium">
                  ⚖️ Ask your first question in the Council
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <div>
            {currentStep > 0 && currentStep < STEPS.length - 1 && (
              <button
                onClick={handleBack}
                className="px-6 py-2 text-neutral-400 hover:text-white transition-colors"
              >
                ← Back
              </button>
            )}
          </div>
          <div className="flex items-center gap-4">
            {currentStep < STEPS.length - 1 && (
              <button
                onClick={onSkip}
                className="px-6 py-2 text-neutral-400 hover:text-white transition-colors"
              >
                Skip Setup
              </button>
            )}
            <button
              onClick={step.id === 'deliberation' ? handleStartDeliberation : handleNext}
              disabled={step.id === 'data' && !connectionSuccess && !selectedDataSource}
              className="px-8 py-3 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {step.id === 'complete'
                ? 'Enter Dashboard'
                : step.id === 'deliberation'
                  ? 'Start Deliberation'
                  : 'Continue →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;
