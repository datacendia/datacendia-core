// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA - PRICING PAGE
// =============================================================================

// File: src/pages/public/PricingPage.tsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn, formatCurrency } from '../../../lib/utils';

interface PlanFeature {
  name: string;
  foundation: boolean | string;
  intelligence: boolean | string;
  governance: boolean | string;
  sovereign: boolean | string;
}

const plans = [
  {
    id: 'foundation',
    name: 'Foundation',
    price: 5000,
    description: 'Essential data intelligence for growing teams',
    cta: 'Start Free Trial',
    highlighted: false,
  },
  {
    id: 'intelligence',
    name: 'Intelligence',
    price: 10000,
    description: 'Advanced analytics and AI-powered insights',
    cta: 'Start Free Trial',
    highlighted: true,
  },
  {
    id: 'governance',
    name: 'Governance',
    price: 15000,
    description: 'Complete data governance and compliance',
    cta: 'Contact Sales',
    highlighted: false,
  },
  {
    id: 'sovereign',
    name: 'Sovereign',
    price: 25000,
    description: 'Full platform with unlimited capabilities',
    cta: 'Contact Sales',
    highlighted: false,
  },
];

const features: PlanFeature[] = [
  {
    name: 'Users',
    foundation: '10',
    intelligence: '50',
    governance: '200',
    sovereign: 'Unlimited',
  },
  { name: 'Agents', foundation: '1', intelligence: '3', governance: '5', sovereign: 'Unlimited' },
  {
    name: 'Data Sources',
    foundation: '5',
    intelligence: '20',
    governance: '50',
    sovereign: 'Unlimited',
  },
  {
    name: 'API Calls/month',
    foundation: '10K',
    intelligence: '100K',
    governance: '500K',
    sovereign: 'Unlimited',
  },
  {
    name: 'Storage',
    foundation: '10 GB',
    intelligence: '50 GB',
    governance: '200 GB',
    sovereign: '1 TB',
  },
  {
    name: 'Lineage Tracking',
    foundation: true,
    intelligence: true,
    governance: true,
    sovereign: true,
  },
  {
    name: 'Unified Metrics',
    foundation: true,
    intelligence: true,
    governance: true,
    sovereign: true,
  },
  { name: 'Basic Helm', foundation: true, intelligence: true, governance: true, sovereign: true },
  {
    name: 'Predict (AI Forecasting)',
    foundation: false,
    intelligence: true,
    governance: true,
    sovereign: true,
  },
  {
    name: 'Health Monitoring',
    foundation: false,
    intelligence: true,
    governance: true,
    sovereign: true,
  },
  { name: 'Full Helm', foundation: false, intelligence: true, governance: true, sovereign: true },
  {
    name: 'Guard (Governance)',
    foundation: false,
    intelligence: false,
    governance: true,
    sovereign: true,
  },
  {
    name: 'Ethics Engine',
    foundation: false,
    intelligence: false,
    governance: true,
    sovereign: true,
  },
  {
    name: 'Flow (Automation)',
    foundation: false,
    intelligence: false,
    governance: false,
    sovereign: true,
  },
  {
    name: 'Custom Agents',
    foundation: false,
    intelligence: false,
    governance: false,
    sovereign: true,
  },
  { name: 'SSO/SAML', foundation: false, intelligence: true, governance: true, sovereign: true },
  {
    name: 'Audit Logs',
    foundation: '30 days',
    intelligence: '90 days',
    governance: '1 year',
    sovereign: '7 years',
  },
  {
    name: 'Support',
    foundation: 'Email',
    intelligence: 'Priority',
    governance: 'Dedicated',
    sovereign: 'White Glove',
  },
];

const addons = [
  { name: 'Additional Agent', price: 3000, description: 'Add another AI advisor to your Council' },
  { name: 'Custom Agent', price: 6000, description: 'Custom-trained agent for your domain' },
  {
    name: 'Reference Implementation',
    price: 5000,
    description: 'Industry-specific workflows & templates',
  },
  { name: 'Air-Gapped Deployment', price: '+50%', description: 'Fully isolated deployment option' },
  { name: 'Premium Support', price: 4000, description: '24/7 support with 1-hour SLA' },
];

const faqs = [
  {
    question: 'Can I try Datacendia before committing?',
    answer:
      'Yes! We offer a 14-day free trial for Foundation and Intelligence plans. For Governance and Sovereign plans, we provide a personalized demo and proof-of-concept.',
  },
  {
    question: 'How does billing work?',
    answer:
      'All plans are billed annually. Monthly billing is available at a 20% premium. We accept credit cards, ACH, and wire transfers for enterprise accounts.',
  },
  {
    question: 'Can I upgrade or downgrade my plan?',
    answer:
      'Yes, you can upgrade at any time and the price difference will be prorated. Downgrades take effect at the next billing cycle.',
  },
  {
    question: 'What happens if I exceed my usage limits?',
    answer:
      "We'll notify you when you reach 80% of any limit. Overages are billed at standard rates, or you can upgrade to a higher plan.",
  },
  {
    question: 'Do you offer discounts for nonprofits or startups?',
    answer:
      'Yes! We offer 50% off for qualified nonprofits and a special startup program. Contact us for details.',
  },
  {
    question: 'Is there a self-hosted option?',
    answer:
      'Yes, Sovereign plan includes the option for on-premise or private cloud deployment. Air-gapped deployments are available as an add-on.',
  },
];

export const PricingPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const getPrice = (price: number) => {
    const monthlyPrice = billingCycle === 'monthly' ? price * 1.2 : price;
    return formatCurrency(monthlyPrice);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation would be shared - simplified here */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">D</span>
              </div>
              <span className="font-semibold text-neutral-900">Datacendia</span>
            </Link>
            <Link to="/login" className="text-sm text-neutral-600 hover:text-neutral-900">
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto mb-8">
            Choose the plan that fits your organization. All plans include core Cortex access.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span
              className={cn(
                'text-sm',
                billingCycle === 'monthly' ? 'text-neutral-900' : 'text-neutral-500'
              )}
            >
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className={cn(
                'relative w-14 h-7 rounded-full transition-colors',
                billingCycle === 'annual' ? 'bg-primary-600' : 'bg-neutral-200'
              )}
            >
              <span
                className={cn(
                  'absolute top-1 w-5 h-5 bg-white rounded-full transition-transform',
                  billingCycle === 'annual' ? 'left-8' : 'left-1'
                )}
              />
            </button>
            <span
              className={cn(
                'text-sm',
                billingCycle === 'annual' ? 'text-neutral-900' : 'text-neutral-500'
              )}
            >
              Annual
            </span>
            {billingCycle === 'annual' && (
              <span className="px-2 py-1 bg-success-light text-success-dark text-xs font-medium rounded-full">
                Save 20%
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={cn(
                  'rounded-2xl border p-6 relative',
                  plan.highlighted
                    ? 'border-primary-500 bg-primary-50 shadow-lg shadow-primary-500/10'
                    : 'border-neutral-200 bg-white'
                )}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 bg-primary-600 text-white text-xs font-medium rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <h3 className="text-xl font-semibold text-neutral-900 mb-2">{plan.name}</h3>
                <p className="text-sm text-neutral-500 mb-4">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-neutral-900">
                    {getPrice(plan.price)}
                  </span>
                  <span className="text-neutral-500">/month</span>
                </div>

                <Link
                  to={plan.cta === 'Contact Sales' ? '/demo' : '/register'}
                  className={cn(
                    'block w-full py-3 text-center font-medium rounded-lg transition-colors',
                    plan.highlighted
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                  )}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-neutral-900 text-center mb-12">Compare Plans</h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-4 px-4 font-semibold text-neutral-900">Feature</th>
                  {plans.map((plan) => (
                    <th
                      key={plan.id}
                      className="text-center py-4 px-4 font-semibold text-neutral-900"
                    >
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => (
                  <tr key={index} className="border-b border-neutral-100">
                    <td className="py-4 px-4 text-sm text-neutral-600">{feature.name}</td>
                    {(['foundation', 'intelligence', 'governance', 'sovereign'] as const).map(
                      (plan) => (
                        <td key={plan} className="py-4 px-4 text-center">
                          {typeof feature[plan] === 'boolean' ? (
                            feature[plan] ? (
                              <span className="text-success-main">✓</span>
                            ) : (
                              <span className="text-neutral-300">—</span>
                            )
                          ) : (
                            <span className="text-sm text-neutral-700">{feature[plan]}</span>
                          )}
                        </td>
                      )
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-neutral-900 text-center mb-4">Add-ons</h2>
          <p className="text-neutral-600 text-center mb-12">
            Extend your plan with additional capabilities
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {addons.map((addon, index) => (
              <div key={index} className="p-6 bg-white rounded-xl border border-neutral-200">
                <h3 className="font-semibold text-neutral-900 mb-1">{addon.name}</h3>
                <p className="text-sm text-neutral-500 mb-3">{addon.description}</p>
                <p className="text-lg font-bold text-primary-600">
                  {typeof addon.price === 'number'
                    ? `${formatCurrency(addon.price)}/mo`
                    : addon.price}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-neutral-900 text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-neutral-200 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="font-medium text-neutral-900">{faq.question}</span>
                  <span
                    className={cn(
                      'text-xl text-neutral-400 transition-transform',
                      expandedFaq === index && 'rotate-180'
                    )}
                  >
                    ▼
                  </span>
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-6 text-neutral-600">{faq.answer}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
          <p className="text-xl text-white/70 mb-8">
            Start your 14-day free trial or talk to our team about your needs.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 bg-white text-primary-600 font-medium rounded-xl hover:bg-white/90 transition-colors"
            >
              Start Free Trial
            </Link>
            <Link
              to="/demo"
              className="w-full sm:w-auto px-8 py-4 border border-white/30 text-white font-medium rounded-xl hover:bg-white/10 transition-colors"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;
