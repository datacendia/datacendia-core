// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA - PUBLIC PAGES
// =============================================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../../lib/utils';

// =============================================================================
// HOME PAGE
// =============================================================================

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const pillars = [
    {
      id: 'helm',
      name: 'The Helm',
      icon: '🎯',
      desc: 'Strategic decision support',
      path: '/cortex/pillars/helm',
    },
    {
      id: 'lineage',
      name: 'Lineage',
      icon: '🔗',
      desc: 'Trace every data point to its source',
      path: '/cortex/pillars/lineage',
    },
    {
      id: 'metrics',
      name: 'Metrics',
      icon: '📊',
      desc: 'Unified KPIs across all systems',
      path: '/cortex/pillars/helm',
    },
    {
      id: 'predict',
      name: 'Predict',
      icon: '🔮',
      desc: 'AI-powered forecasting',
      path: '/cortex/pillars/predict',
    },
    {
      id: 'flow',
      name: 'Flow',
      icon: '🌊',
      desc: 'Automated workflows',
      path: '/cortex/pillars/flow',
    },
    {
      id: 'guard',
      name: 'Guard',
      icon: '🛡️',
      desc: 'Data governance & compliance',
      path: '/cortex/pillars/guard',
    },
    {
      id: 'health',
      name: 'Health',
      icon: '💓',
      desc: 'Organizational vitality metrics',
      path: '/cortex/pillars/health',
    },
    {
      id: 'ethics',
      name: 'Ethics',
      icon: '⚖️',
      desc: 'Built-in ethical oversight',
      path: '/cortex/pillars/ethics',
    },
  ];

  const spaces = [
    {
      name: 'The Graph',
      desc: 'Navigate your knowledge universe',
      icon: '🔗',
      path: '/cortex/graph',
    },
    {
      name: 'The Council',
      desc: 'AI advisors that reason together',
      icon: '👥',
      path: '/cortex/council',
    },
    {
      name: 'The Pulse',
      desc: 'Real-time organizational health',
      icon: '💓',
      path: '/cortex/pulse',
    },
    { name: 'The Lens', desc: 'See possible futures', icon: '🔮', path: '/cortex/lens' },
    { name: 'The Bridge', desc: 'Take action across systems', icon: '🌉', path: '/cortex/bridge' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Your Organization's Intelligence,{' '}
              <span className="text-secondary-400">Sovereign and Whole</span>
            </h1>
            <p className="text-xl text-white/80 mb-8">
              Datacendia is the command center for enterprise intelligence. Connect your data,
              consult AI advisors, and see possible futures — all while keeping complete control.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/demo')}
                className="px-8 py-4 bg-white text-primary-900 font-semibold rounded-lg hover:bg-white/90 transition-colors"
              >
                Request Demo
              </button>
              <button
                onClick={() => navigate('/product')}
                className="px-8 py-4 bg-white/10 text-white font-semibold rounded-lg border border-white/20 hover:bg-white/20 transition-colors"
              >
                Explore Platform
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              The Problem with Enterprise Intelligence
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Organizations struggle with fragmented data, siloed tools, and reactive
              decision-making
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl border border-neutral-200">
              <div className="w-12 h-12 bg-error-light rounded-lg flex items-center justify-center text-2xl mb-4">
                🔀
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Data Chaos</h3>
              <p className="text-neutral-600">
                Your data lives in dozens of systems with no unified view. Nobody knows what's true.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl border border-neutral-200">
              <div className="w-12 h-12 bg-warning-light rounded-lg flex items-center justify-center text-2xl mb-4">
                🧩
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Tool Sprawl</h3>
              <p className="text-neutral-600">
                BI tools, analytics platforms, dashboards — none of them talk to each other.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl border border-neutral-200">
              <div className="w-12 h-12 bg-info-light rounded-lg flex items-center justify-center text-2xl mb-4">
                🔙
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">No Foresight</h3>
              <p className="text-neutral-600">
                You're always looking in the rear-view mirror. What about what's coming next?
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution - The Cortex */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              The Cortex: Your Intelligence Command Center
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Five integrated spaces that give you complete visibility and control
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-6">
            {spaces.map((space) => (
              <div
                key={space.name}
                onClick={() => navigate(space.path)}
                className="p-6 bg-neutral-50 rounded-xl border border-neutral-200 hover:border-primary-300 hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="text-4xl mb-4">{space.icon}</div>
                <h3 className="text-lg font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors">
                  {space.name}
                </h3>
                <p className="text-sm text-neutral-500 mt-2">{space.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8 Pillars */}
      <section className="py-20 bg-neutral-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">The 8 Pillars of Sovereign Intelligence</h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Every capability you need, working together as one
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {pillars.map((pillar) => (
              <div
                key={pillar.id}
                onClick={() => navigate(pillar.path)}
                className="p-6 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-colors cursor-pointer"
              >
                <div className="text-3xl mb-3">{pillar.icon}</div>
                <h3 className="font-semibold mb-1">{pillar.name}</h3>
                <p className="text-sm text-white/60">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to take control of your intelligence?</h2>
          <p className="text-xl text-white/80 mb-8">
            See how Datacendia can transform your organization's decision-making
          </p>
          <button
            onClick={() => navigate('/demo')}
            className="px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg hover:bg-white/90 transition-colors"
          >
            Schedule a Demo
          </button>
        </div>
      </section>
    </div>
  );
};

// =============================================================================
// PRICING PAGE
// =============================================================================

export const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  const plans = [
    {
      name: 'Foundation',
      price: billingCycle === 'annual' ? 4000 : 5000,
      description: 'Essential intelligence capabilities for growing teams',
      features: [
        'The Helm (Metrics)',
        'The Lineage (Data Provenance)',
        'Basic Health Monitoring',
        '10 Users',
        '3 Integrations',
        'Email Support',
      ],
      cta: 'Start Free Trial',
      popular: false,
    },
    {
      name: 'Intelligence',
      price: billingCycle === 'annual' ? 8000 : 10000,
      description: 'Advanced analytics and forecasting for scaling organizations',
      features: [
        'Everything in Foundation',
        'The Predict (Forecasting)',
        'Full Health Monitoring',
        '25 Users',
        '10 Integrations',
        '2 AI Agents',
        'Priority Support',
      ],
      cta: 'Start Free Trial',
      popular: true,
    },
    {
      name: 'Governance',
      price: billingCycle === 'annual' ? 12000 : 15000,
      description: 'Complete governance and compliance for regulated industries',
      features: [
        'Everything in Intelligence',
        'The Guard (Security)',
        'The Ethics (Guardrails)',
        '50 Users',
        'Unlimited Integrations',
        '5 AI Agents',
        'Audit Logging',
        'SSO / SAML',
      ],
      cta: 'Contact Sales',
      popular: false,
    },
    {
      name: 'Sovereign',
      price: billingCycle === 'annual' ? 20000 : 25000,
      description: 'Full platform with complete data sovereignty',
      features: [
        'Everything in Governance',
        'The Flow (Automation)',
        'All 8 AI Agents',
        'Unlimited Users',
        'Self-Hosted Option',
        'Air-Gapped Deployment',
        'Custom Agents',
        'Dedicated Support',
      ],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  const addons = [
    { name: 'Additional AI Agent', price: 3000, unit: '/agent/mo' },
    { name: 'Custom Agent Development', price: 6000, unit: '/agent (one-time)' },
    { name: 'Reference Implementation', price: 5000, unit: '/implementation' },
    { name: 'Air-Gapped Premium', price: '+50%', unit: 'of base price' },
    { name: 'Premium Support (24/7)', price: 4000, unit: '/mo' },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <section className="bg-white py-16 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto mb-8">
            Choose the plan that fits your organization. All plans include a 14-day free trial.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-3 p-1 bg-neutral-100 rounded-lg">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                billingCycle === 'monthly'
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                billingCycle === 'annual'
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              )}
            >
              Annual <span className="text-success-main">(-20%)</span>
            </button>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={cn(
                  'relative bg-white rounded-xl border-2 p-6',
                  plan.popular ? 'border-primary-500 shadow-lg' : 'border-neutral-200'
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary-500 text-white text-xs font-medium rounded-full">
                    Most Popular
                  </div>
                )}

                <h3 className="text-xl font-bold text-neutral-900">{plan.name}</h3>
                <p className="text-sm text-neutral-500 mt-1 mb-4">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-neutral-900">
                    ${plan.price.toLocaleString()}
                  </span>
                  <span className="text-neutral-500">/mo</span>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <span className="text-success-main mt-0.5">✓</span>
                      <span className="text-neutral-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => navigate('/demo')}
                  className={cn(
                    'w-full py-3 rounded-lg font-medium transition-colors',
                    plan.popular
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  )}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-8 text-center">Add-ons & Extras</h2>

          <div className="space-y-4">
            {addons.map((addon) => (
              <div
                key={addon.name}
                className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg"
              >
                <span className="font-medium text-neutral-900">{addon.name}</span>
                <span className="text-neutral-600">
                  <strong className="text-neutral-900">{addon.price}</strong> {addon.unit}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {[
              {
                q: 'Can I try before I buy?',
                a: 'Yes! All plans include a 14-day free trial with full access to features.',
              },
              {
                q: 'What happens to my data if I cancel?',
                a: "Your data remains yours. Export everything before cancellation, or we'll retain it for 30 days.",
              },
              {
                q: 'Do you offer discounts for nonprofits?',
                a: 'Yes, we offer 50% off for qualified nonprofits and educational institutions.',
              },
              {
                q: 'Can I upgrade or downgrade anytime?',
                a: 'Absolutely. Changes take effect at your next billing cycle, prorated if upgrading.',
              },
            ].map((faq) => (
              <div key={faq.q} className="bg-white p-6 rounded-xl border border-neutral-200">
                <h3 className="font-semibold text-neutral-900 mb-2">{faq.q}</h3>
                <p className="text-neutral-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// =============================================================================
// DEMO REQUEST PAGE
// =============================================================================

export const DemoRequestPage: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    jobTitle: '',
    companySize: '',
    industry: '',
    primaryInterest: '',
    additionalNotes: '',
    marketingConsent: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 bg-success-light rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">✓</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">Demo Request Received!</h1>
          <p className="text-neutral-600 mb-8">
            Thanks, {formData.firstName}! Our team will reach out within 24 hours to schedule your
            personalized demo.
          </p>
          <a href="/" className="text-primary-600 hover:text-primary-700 font-medium">
            ← Back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left - Value Props */}
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-4">See Datacendia in Action</h1>
            <p className="text-lg text-neutral-600 mb-8">
              Get a personalized demo tailored to your organization's needs. Our team will show you
              how Datacendia can transform your data into actionable intelligence.
            </p>

            <div className="space-y-6">
              {[
                {
                  icon: '⏱️',
                  title: '30-Minute Demo',
                  desc: 'Quick, focused walkthrough of key capabilities',
                },
                {
                  icon: '🎯',
                  title: 'Tailored to You',
                  desc: 'See features relevant to your industry and role',
                },
                {
                  icon: '💬',
                  title: 'Live Q&A',
                  desc: 'Get your questions answered by our experts',
                },
                {
                  icon: '📊',
                  title: 'ROI Discussion',
                  desc: 'Understand the potential impact on your org',
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="text-2xl">{item.icon}</div>
                  <div>
                    <h3 className="font-semibold text-neutral-900">{item.title}</h3>
                    <p className="text-neutral-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Form */}
          <div className="bg-white rounded-xl border border-neutral-200 p-8">
            <h2 className="text-xl font-semibold text-neutral-900 mb-6">Request Your Demo</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full h-10 px-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full h-10 px-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Work Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full h-10 px-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Company *</label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full h-10 px-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Job Title</label>
                <input
                  type="text"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                  className="w-full h-10 px-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Company Size
                  </label>
                  <select
                    value={formData.companySize}
                    onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                    className="w-full h-10 px-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select...</option>
                    <option value="1-50">1-50</option>
                    <option value="51-200">51-200</option>
                    <option value="201-1000">201-1,000</option>
                    <option value="1001-5000">1,001-5,000</option>
                    <option value="5000+">5,000+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Industry
                  </label>
                  <select
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full h-10 px-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select...</option>
                    <option value="finance">Financial Services</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="technology">Technology</option>
                    <option value="retail">Retail</option>
                    <option value="government">Government</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Primary Interest
                </label>
                <select
                  value={formData.primaryInterest}
                  onChange={(e) => setFormData({ ...formData, primaryInterest: e.target.value })}
                  className="w-full h-10 px-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select...</option>
                  <option value="data-integration">Data Integration</option>
                  <option value="analytics">Analytics & BI</option>
                  <option value="forecasting">Forecasting</option>
                  <option value="automation">Workflow Automation</option>
                  <option value="governance">Data Governance</option>
                  <option value="ai-advisors">AI Advisors</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Anything else we should know?
                </label>
                <textarea
                  rows={3}
                  value={formData.additionalNotes}
                  onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                />
              </div>

              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={formData.marketingConsent}
                  onChange={(e) => setFormData({ ...formData, marketingConsent: e.target.checked })}
                  className="mt-1 rounded text-primary-600"
                />
                <span className="text-sm text-neutral-600">
                  I'd like to receive occasional updates about Datacendia products and events.
                </span>
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Request Demo'}
              </button>

              <p className="text-xs text-neutral-400 text-center">
                By submitting, you agree to our Terms of Service and Privacy Policy.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// PRODUCT PAGE - Re-exported from enhanced version
// =============================================================================

export { ProductPage } from './ProductPage';

// =============================================================================
// ABOUT PAGE
// =============================================================================

export const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  const team = [
    {
      name: 'Stuart Rainey',
      role: 'Founder & CEO',
      avatar: '👨‍💼',
      bio: 'Serial entrepreneur with 20+ years building enterprise software.',
    },
  ];

  const values = [
    {
      icon: '🔐',
      title: 'Sovereignty',
      desc: 'Your data, your control, your intelligence. Never compromised.',
    },
    {
      icon: '🔍',
      title: 'Transparency',
      desc: 'No black boxes. Explainable AI with clear lineage.',
    },
    { icon: '⚖️', title: 'Ethics', desc: 'Built-in guardrails that ensure responsible AI use.' },
    {
      icon: '🔗',
      title: 'Integration',
      desc: 'We meet you where you are, connecting what exists.',
    },
  ];

  const milestones = [
    { year: '2024', event: 'Founded with a vision for sovereign enterprise intelligence' },
    { year: '2025', event: 'Platform launch with AI Council & Cortex' },
    { year: '2025', event: 'First enterprise customers onboarded' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.3),transparent_60%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              About{' '}
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Datacendia
              </span>
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed">
              We believe every organization deserves sovereign control over their intelligence. Not
              locked in vendor silos. Not requiring a PhD to access. Not with strings attached.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-neutral-900 mb-6">Our Mission</h2>
              <p className="text-lg text-neutral-600 leading-relaxed mb-6">
                To democratize enterprise intelligence by providing a platform that is powerful
                enough for the most demanding use cases, yet accessible enough that everyone can
                participate in data-driven decision making.
              </p>
              <p className="text-lg text-neutral-600 leading-relaxed">
                We're building the future where AI works for organizations, not the other way
                around. Where insights are trusted because their reasoning is transparent.
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-100 to-cyan-100 rounded-2xl p-8 flex items-center justify-center">
              <div className="text-center">
                <div className="text-8xl mb-4">🧠</div>
                <div className="text-2xl font-bold text-purple-900">The Cortex</div>
                <div className="text-purple-600">Sovereign Enterprise Intelligence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">Our Values</h2>
            <p className="text-lg text-neutral-600">
              The principles that guide everything we build
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-white p-8 rounded-xl border border-neutral-200 text-center hover:shadow-lg transition-shadow"
              >
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">{value.title}</h3>
                <p className="text-neutral-600">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">Our Journey</h2>
          </div>
          <div className="space-y-8">
            {milestones.map((m, i) => (
              <div key={i} className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-24 text-right">
                  <span className="text-2xl font-bold text-purple-600">{m.year}</span>
                </div>
                <div className="w-4 h-4 rounded-full bg-purple-600 mt-2 flex-shrink-0" />
                <div className="flex-1 pb-8 border-l-2 border-purple-200 pl-6 -ml-2">
                  <p className="text-lg text-neutral-700">{m.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-purple-100 mb-8">
            Join the organizations building sovereign intelligence
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate('/demo')}
              className="px-8 py-4 bg-white text-purple-600 font-semibold rounded-xl hover:bg-purple-50 transition-colors"
            >
              Request Demo
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="px-8 py-4 bg-purple-700 text-white font-semibold rounded-xl hover:bg-purple-800 transition-colors border border-purple-500"
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

// =============================================================================
// CONTACT PAGE
// =============================================================================

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
    type: 'general',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Submit to backend contact API
      const response = await fetch('/api/v1/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          message: formData.message,
          inquiry_type: formData.type,
          source: 'contact_page',
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        console.log('[Contact] Form submitted successfully');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to submit. Please try again.');
      }
    } catch (err) {
      console.error('[Contact] Submission error:', err);
      setError('Network error. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: '📧',
      title: 'Email',
      value: 'hello@datacendia.com',
      link: 'mailto:hello@datacendia.com',
    },
    {
      icon: '💼',
      title: 'Sales',
      value: 'sales@datacendia.com',
      link: 'mailto:sales@datacendia.com',
    },
    {
      icon: '🎧',
      title: 'Support',
      value: 'support@datacendia.com',
      link: 'mailto:support@datacendia.com',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.3),transparent_60%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Get in{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              Touch
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon
            as possible.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {contactMethods.map((method) => (
              <a
                key={method.title}
                href={method.link}
                className="bg-white p-6 rounded-xl border border-neutral-200 hover:border-indigo-300 hover:shadow-lg transition-all text-center"
              >
                <div className="text-4xl mb-3">{method.icon}</div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-1">{method.title}</h3>
                <p className="text-indigo-600">{method.value}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {submitted ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-6">✅</div>
              <h2 className="text-3xl font-bold text-neutral-900 mb-4">Message Sent!</h2>
              <p className="text-lg text-neutral-600 mb-8">
                Thank you for reaching out. We'll get back to you within 24 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-indigo-600 font-medium hover:text-indigo-700"
              >
                Send another message
              </button>
            </div>
          ) : (
            <>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-neutral-900 mb-4">Send Us a Message</h2>
                <p className="text-neutral-600">
                  Fill out the form below and we'll be in touch shortly
                </p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="you@company.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Company</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Your company name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    What can we help with?
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="demo">Request a Demo</option>
                    <option value="sales">Sales Question</option>
                    <option value="support">Technical Support</option>
                    <option value="partnership">Partnership Opportunity</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="How can we help you?"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-500 hover:to-purple-500 shadow-lg hover:shadow-xl transition-all"
                >
                  Send Message
                </button>
              </form>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

// =============================================================================
// MANIFESTO PAGE
// =============================================================================

export const ManifestoPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-4xl font-bold mb-2">The Datacendia Manifesto</h1>
        <p className="text-xl text-white/60 mb-12">A Declaration of Sovereign Intelligence</p>

        <div className="prose prose-invert prose-lg max-w-none">
          <p className="text-xl leading-relaxed mb-8">
            We stand at a crossroads in enterprise technology. On one path lies continued
            fragmentation—data scattered across dozens of systems, intelligence locked in vendor
            silos, decisions made on gut feeling because the truth is too hard to find.
          </p>

          <p className="text-lg leading-relaxed mb-8">
            On the other path lies sovereignty. Complete ownership of your organizational
            intelligence. AI that works for you, not for an advertising platform. Insights that you
            can trust because you can trace every step of their reasoning.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4">We Believe:</h2>

          <ol className="space-y-4 text-lg">
            <li>That organizations should own their intelligence, not rent it.</li>
            <li>That AI should explain its reasoning, not hide behind black boxes.</li>
            <li>That automation should have guardrails, not just accelerators.</li>
            <li>That data lineage is not a nice-to-have, but a fundamental right.</li>
            <li>That ethical AI is not a constraint, but a competitive advantage.</li>
          </ol>

          <h2 className="text-2xl font-bold mt-12 mb-4">This is Datacendia.</h2>
          <p className="text-lg">Your organization's intelligence, sovereign and whole.</p>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// DOWNLOADS PAGE - Re-exported from enhanced version
// =============================================================================

export { DownloadsPage } from './DownloadsPage';

// =============================================================================
// LICENSE PAGE - Re-exported from enhanced version
// =============================================================================

export { LicensePage } from './LicensePage';

// =============================================================================
// NEW PAGES - December 2024
// =============================================================================

export { SecurityPage } from './SecurityPage';
export { CookiePolicyPage } from './CookiePolicyPage';
export { DocsPage } from './DocsPage';
export { BlogPage } from './BlogPage';
export { ChangelogPage } from './ChangelogPage';
export { SupportPage } from './SupportPage';
export { IntegrationsPage } from './IntegrationsPage';

export default HomePage;
