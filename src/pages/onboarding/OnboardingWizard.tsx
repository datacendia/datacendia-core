// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * DATACENDIA ONBOARDING WIZARD
 * First-time user experience with guided setup
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Users,
  Database,
  Sparkles,
  Shield,
  Check,
  ChevronRight,
  ChevronLeft,
  Zap,
  Target,
  Brain,
  BarChart3,
} from 'lucide-react';

// Step configuration
const STEPS = [
  { id: 'welcome', title: 'Welcome', icon: Sparkles },
  { id: 'organization', title: 'Organization', icon: Building2 },
  { id: 'team', title: 'Team', icon: Users },
  { id: 'data', title: 'Data Sources', icon: Database },
  { id: 'goals', title: 'Goals', icon: Target },
  { id: 'complete', title: 'Ready!', icon: Check },
];

interface OnboardingData {
  organization: {
    name: string;
    industry: string;
    size: string;
  };
  team: {
    invites: string[];
  };
  dataSources: string[];
  goals: string[];
}

export const OnboardingWizard: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    organization: { name: '', industry: '', size: '' },
    team: { invites: [''] },
    dataSources: [],
    goals: [],
  });

  const currentStepConfig = STEPS[currentStep];
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  const handleNext = async () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      setIsLoading(true);
      try {
        // Save onboarding data
        await fetch('/api/v1/organizations/current', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: data.organization.name,
            industry: data.organization.industry,
            companySize: data.organization.size,
            settings: {
              onboardingCompleted: true,
              goals: data.goals,
            },
          }),
        });
        navigate('/cortex');
      } catch (error) {
        console.error('Failed to save onboarding:', error);
      }
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateOrg = (field: string, value: string) => {
    setData((prev) => ({
      ...prev,
      organization: { ...prev.organization, [field]: value },
    }));
  };

  const toggleDataSource = (source: string) => {
    setData((prev) => ({
      ...prev,
      dataSources: prev.dataSources.includes(source)
        ? prev.dataSources.filter((s) => s !== source)
        : [...prev.dataSources, source],
    }));
  };

  const toggleGoal = (goal: string) => {
    setData((prev) => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter((g) => g !== goal)
        : [...prev.goals, goal],
    }));
  };

  const addInvite = () => {
    setData((prev) => ({
      ...prev,
      team: { invites: [...prev.team.invites, ''] },
    }));
  };

  const updateInvite = (index: number, value: string) => {
    setData((prev) => ({
      ...prev,
      team: {
        invites: prev.team.invites.map((email, i) => (i === index ? value : email)),
      },
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {STEPS.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center gap-2 text-sm ${
                  index <= currentStep ? 'text-purple-400' : 'text-slate-500'
                }`}
              >
                <step.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{step.title}</span>
              </div>
            ))}
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-8">
          {/* Step Content */}
          <div className="min-h-[400px]">
            {currentStepConfig.id === 'welcome' && <WelcomeStep />}
            {currentStepConfig.id === 'organization' && (
              <OrganizationStep data={data.organization} update={updateOrg} />
            )}
            {currentStepConfig.id === 'team' && (
              <TeamStep
                invites={data.team.invites}
                addInvite={addInvite}
                updateInvite={updateInvite}
              />
            )}
            {currentStepConfig.id === 'data' && (
              <DataSourcesStep selected={data.dataSources} toggle={toggleDataSource} />
            )}
            {currentStepConfig.id === 'goals' && (
              <GoalsStep selected={data.goals} toggle={toggleGoal} />
            )}
            {currentStepConfig.id === 'complete' && <CompleteStep data={data} />}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-slate-700">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                currentStep === 0
                  ? 'text-slate-500 cursor-not-allowed'
                  : 'text-slate-300 hover:bg-slate-700'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold rounded-lg hover:opacity-90 transition"
            >
              {isLoading ? (
                'Saving...'
              ) : currentStep === STEPS.length - 1 ? (
                <>
                  Launch Datacendia
                  <Zap className="w-5 h-5" />
                </>
              ) : (
                <>
                  Continue
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Skip */}
        {currentStep < STEPS.length - 1 && (
          <div className="text-center mt-4">
            <button
              onClick={() => navigate('/cortex')}
              className="text-slate-500 hover:text-slate-300 text-sm"
            >
              Skip for now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Step Components
const WelcomeStep: React.FC = () => (
  <div className="text-center">
    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center">
      <Brain className="w-10 h-10 text-white" />
    </div>
    <h1 className="text-3xl font-bold text-white mb-4">Welcome to Datacendia</h1>
    <p className="text-slate-400 text-lg max-w-lg mx-auto mb-8">
      Your AI-powered organizational intelligence platform. Let's set up your account in just a few
      minutes.
    </p>
    <div className="grid grid-cols-3 gap-4 max-w-md mx-auto text-left">
      {[
        { icon: Brain, label: 'AI Council', desc: 'Multi-persona deliberation' },
        { icon: BarChart3, label: 'Real-time Analytics', desc: 'Pulse monitoring' },
        { icon: Shield, label: 'Enterprise Security', desc: 'SOC 2 ready' },
      ].map((feature) => (
        <div key={feature.label} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
          <feature.icon className="w-6 h-6 text-purple-400 mb-2" />
          <div className="text-sm font-medium text-white">{feature.label}</div>
          <div className="text-xs text-slate-500">{feature.desc}</div>
        </div>
      ))}
    </div>
  </div>
);

interface OrgStepProps {
  data: { name: string; industry: string; size: string };
  update: (field: string, value: string) => void;
}

const OrganizationStep: React.FC<OrgStepProps> = ({ data, update }) => {
  const industries = [
    'Technology',
    'Financial Services',
    'Healthcare',
    'Manufacturing',
    'Retail',
    'Energy',
    'Education',
    'Government',
    'Other',
  ];
  const sizes = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'];

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Tell us about your organization</h2>
      <p className="text-slate-400 mb-8">This helps us customize Datacendia for your needs.</p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Organization Name</label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="Acme Corporation"
            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Industry</label>
          <div className="grid grid-cols-3 gap-2">
            {industries.map((industry) => (
              <button
                key={industry}
                onClick={() => update('industry', industry)}
                className={`px-3 py-2 rounded-lg text-sm transition ${
                  data.industry === industry
                    ? 'bg-purple-500 text-white'
                    : 'bg-slate-900 text-slate-400 border border-slate-700 hover:border-purple-500'
                }`}
              >
                {industry}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Company Size</label>
          <div className="flex gap-2 flex-wrap">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => update('size', size)}
                className={`px-4 py-2 rounded-lg text-sm transition ${
                  data.size === size
                    ? 'bg-purple-500 text-white'
                    : 'bg-slate-900 text-slate-400 border border-slate-700 hover:border-purple-500'
                }`}
              >
                {size} employees
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface TeamStepProps {
  invites: string[];
  addInvite: () => void;
  updateInvite: (index: number, value: string) => void;
}

const TeamStep: React.FC<TeamStepProps> = ({ invites, addInvite, updateInvite }) => (
  <div>
    <h2 className="text-2xl font-bold text-white mb-2">Invite your team</h2>
    <p className="text-slate-400 mb-8">
      Datacendia works best with your whole team. You can skip this and add people later.
    </p>

    <div className="space-y-3">
      {invites.map((email, index) => (
        <input
          key={index}
          type="email"
          value={email}
          onChange={(e) => updateInvite(index, e.target.value)}
          placeholder="colleague@company.com"
          className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      ))}
      <button
        onClick={addInvite}
        className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1"
      >
        + Add another team member
      </button>
    </div>

    <div className="mt-8 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
      <h4 className="text-sm font-medium text-white mb-2">Team Roles</h4>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-purple-400">Admin</span>
          <span className="text-slate-500 ml-2">Full access</span>
        </div>
        <div>
          <span className="text-cyan-400">Analyst</span>
          <span className="text-slate-500 ml-2">View & analyze</span>
        </div>
      </div>
    </div>
  </div>
);

interface DataSourcesStepProps {
  selected: string[];
  toggle: (source: string) => void;
}

const DataSourcesStep: React.FC<DataSourcesStepProps> = ({ selected, toggle }) => {
  const sources = [
    { id: 'postgresql', name: 'PostgreSQL', icon: '🐘' },
    { id: 'snowflake', name: 'Snowflake', icon: '❄️' },
    { id: 'bigquery', name: 'BigQuery', icon: '📊' },
    { id: 'salesforce', name: 'Salesforce', icon: '☁️' },
    { id: 'hubspot', name: 'HubSpot', icon: '🟠' },
    { id: 'sap', name: 'SAP', icon: '💼' },
    { id: 'excel', name: 'Excel/CSV', icon: '📗' },
    { id: 'api', name: 'REST API', icon: '🔌' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Connect your data sources</h2>
      <p className="text-slate-400 mb-8">
        Select the systems you'd like to connect. You can add more later.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {sources.map((source) => (
          <button
            key={source.id}
            onClick={() => toggle(source.id)}
            className={`p-4 rounded-lg border transition text-center ${
              selected.includes(source.id)
                ? 'bg-purple-500/20 border-purple-500 text-white'
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'
            }`}
          >
            <div className="text-2xl mb-2">{source.icon}</div>
            <div className="text-sm font-medium">{source.name}</div>
            {selected.includes(source.id) && (
              <Check className="w-4 h-4 mx-auto mt-2 text-purple-400" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

interface GoalsStepProps {
  selected: string[];
  toggle: (goal: string) => void;
}

const GoalsStep: React.FC<GoalsStepProps> = ({ selected, toggle }) => {
  const goals = [
    {
      id: 'strategic',
      label: 'Strategic Decision Making',
      desc: 'AI-powered deliberation for major decisions',
    },
    {
      id: 'analytics',
      label: 'Real-time Analytics',
      desc: 'Monitor KPIs and organizational health',
    },
    { id: 'automation', label: 'Workflow Automation', desc: 'Automate approval processes' },
    {
      id: 'forecasting',
      label: 'Predictive Forecasting',
      desc: 'Scenario planning and predictions',
    },
    {
      id: 'compliance',
      label: 'Compliance & Governance',
      desc: 'Audit trails and policy enforcement',
    },
    { id: 'integration', label: 'System Integration', desc: 'Unify data across platforms' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">What are your main goals?</h2>
      <p className="text-slate-400 mb-8">This helps us prioritize features for you.</p>

      <div className="space-y-3">
        {goals.map((goal) => (
          <button
            key={goal.id}
            onClick={() => toggle(goal.id)}
            className={`w-full p-4 rounded-lg border text-left transition flex items-start gap-4 ${
              selected.includes(goal.id)
                ? 'bg-purple-500/20 border-purple-500'
                : 'bg-slate-900 border-slate-700 hover:border-slate-600'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                selected.includes(goal.id) ? 'bg-purple-500 border-purple-500' : 'border-slate-600'
              }`}
            >
              {selected.includes(goal.id) && <Check className="w-4 h-4 text-white" />}
            </div>
            <div>
              <div className="font-medium text-white">{goal.label}</div>
              <div className="text-sm text-slate-400">{goal.desc}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

interface CompleteStepProps {
  data: OnboardingData;
}

const CompleteStep: React.FC<CompleteStepProps> = ({ data }) => (
  <div className="text-center">
    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
      <Check className="w-10 h-10 text-white" />
    </div>
    <h2 className="text-3xl font-bold text-white mb-4">You're all set!</h2>
    <p className="text-slate-400 text-lg max-w-lg mx-auto mb-8">
      Your Datacendia workspace is ready. Let's explore what you can do.
    </p>

    <div className="grid grid-cols-2 gap-4 max-w-md mx-auto text-left">
      <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
        <div className="text-2xl mb-2">🧠</div>
        <div className="text-sm font-medium text-white">AI Council</div>
        <div className="text-xs text-slate-500">Start a deliberation</div>
      </div>
      <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
        <div className="text-2xl mb-2">📊</div>
        <div className="text-sm font-medium text-white">Pulse Dashboard</div>
        <div className="text-xs text-slate-500">View real-time metrics</div>
      </div>
      <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
        <div className="text-2xl mb-2">🔗</div>
        <div className="text-sm font-medium text-white">Connect Data</div>
        <div className="text-xs text-slate-500">Add your data sources</div>
      </div>
      <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
        <div className="text-2xl mb-2">⚡</div>
        <div className="text-sm font-medium text-white">Workflows</div>
        <div className="text-xs text-slate-500">Automate processes</div>
      </div>
    </div>

    {data.organization.name && (
      <div className="mt-8 p-4 bg-slate-900/50 rounded-lg border border-slate-700 max-w-md mx-auto">
        <div className="text-sm text-slate-500">Your organization</div>
        <div className="text-lg font-semibold text-white">{data.organization.name}</div>
        <div className="text-sm text-slate-400">
          {data.organization.industry} • {data.organization.size} employees
        </div>
      </div>
    )}
  </div>
);

export default OnboardingWizard;
