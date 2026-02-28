// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA PRICING PAGE - Enterprise Regional Pricing
// Matching DatacendiaPricing.jsx design
// =============================================================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface Region {
  id: string;
  name: string;
  flag: string;
  multiplier: number;
  currency: string;
  symbol: string;
  countries: string[];
  conversionRate?: number;
}

interface Tier {
  id: string;
  name: string;
  basePrice: number;
  description: string;
  features: string[];
  cta: string;
  popular: boolean;
}

interface CommitmentOption {
  id: string;
  label: string;
  discount: number;
  multiplier: number;
}

const regions: Region[] = [
  {
    id: 'north-america',
    name: 'North America',
    flag: '🇺🇸',
    multiplier: 1.0,
    currency: 'USD',
    symbol: '$',
    countries: ['United States', 'Canada'],
  },
  {
    id: 'western-europe',
    name: 'Western Europe',
    flag: '🇪🇺',
    multiplier: 1.0,
    currency: 'EUR',
    symbol: '€',
    countries: ['UK', 'Germany', 'France', 'Netherlands', 'Switzerland'],
  },
  {
    id: 'gulf-states',
    name: 'Gulf States',
    flag: '🇦🇪',
    multiplier: 1.0,
    currency: 'USD',
    symbol: '$',
    countries: ['UAE', 'Saudi Arabia', 'Qatar', 'Kuwait'],
  },
  {
    id: 'australia-japan',
    name: 'Australia & Japan',
    flag: '🇦🇺',
    multiplier: 0.95,
    currency: 'USD',
    symbol: '$',
    countries: ['Australia', 'New Zealand', 'Japan'],
  },
  {
    id: 'singapore-hk',
    name: 'Singapore & Hong Kong',
    flag: '🇸🇬',
    multiplier: 0.95,
    currency: 'USD',
    symbol: '$',
    countries: ['Singapore', 'Hong Kong'],
  },
  {
    id: 'china',
    name: 'Greater China',
    flag: '🇨🇳',
    multiplier: 0.7,
    currency: 'CNY',
    symbol: '¥',
    conversionRate: 7.1,
    countries: ['China', 'Taiwan'],
  },
  {
    id: 'eastern-europe',
    name: 'Eastern Europe',
    flag: '🇵🇱',
    multiplier: 0.65,
    currency: 'EUR',
    symbol: '€',
    countries: ['Poland', 'Czech Republic', 'Romania', 'Hungary'],
  },
  {
    id: 'middle-east',
    name: 'Middle East (Other)',
    flag: '🇹🇷',
    multiplier: 0.6,
    currency: 'USD',
    symbol: '$',
    countries: ['Turkey', 'Israel', 'Egypt', 'Jordan'],
  },
  {
    id: 'latin-america',
    name: 'Latin America',
    flag: '🇧🇷',
    multiplier: 0.55,
    currency: 'USD',
    symbol: '$',
    countries: ['Brazil', 'Mexico', 'Argentina', 'Chile', 'Colombia'],
  },
  {
    id: 'southeast-asia',
    name: 'Southeast Asia',
    flag: '🇹🇭',
    multiplier: 0.5,
    currency: 'USD',
    symbol: '$',
    countries: ['Thailand', 'Vietnam', 'Indonesia', 'Philippines', 'Malaysia'],
  },
  {
    id: 'india',
    name: 'India',
    flag: '🇮🇳',
    multiplier: 0.45,
    currency: 'USD',
    symbol: '$',
    countries: ['India'],
  },
  {
    id: 'africa',
    name: 'Africa',
    flag: '🌍',
    multiplier: 0.45,
    currency: 'USD',
    symbol: '$',
    countries: ['South Africa', 'Kenya', 'Nigeria', 'Morocco', 'Egypt'],
  },
];

const tiers: Tier[] = [
  {
    id: 'foundation',
    name: 'Foundation',
    basePrice: 150000,
    description: 'Make decisions → Understand them → Prove them',
    features: [
      'THE COUNCIL — 15 C-Suite agents, 35+ modes, CendiaLive™',
      'DECIDE — Pre-Mortem, Ghost Board, Decision Debt, Chronos',
      'DCII — 9 Primitives, IISS Scoring, Evidence Vault, Regulator\'s Receipt™',
      'Up to 100 users',
      '1,000 deliberations/month',
      'Priority support',
      '$50K pilot available (90 days)',
    ],
    cta: 'Start Foundation Pilot',
    popular: false,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    basePrice: 500000,
    description: 'Foundation + Stress-Test, Comply, Govern, Sovereign, Operate',
    features: [
      'All Foundation pillars',
      'STRESS-TEST — CendiaCrucible™, Red Team, War Games',
      'COMPLY — 10 frameworks, 17 jurisdictions, CendiaInsure™',
      'GOVERN — Policy Engine, Protected Dissent, CendiaCourt™',
      'SOVEREIGN — 11 architectural patterns, Post-Quantum KMS, Air-Gap',
      'OPERATE — 19 department co-pilots, CendiaOmniTranslate™',
      'SSO, CAC/PIV auth & dedicated success manager',
      'Unlimited deliberations & up to 500 users',
    ],
    cta: 'Contact Sales',
    popular: true,
  },
  {
    id: 'strategic',
    name: 'Strategic',
    basePrice: 2000000,
    description: 'Enterprise + Resilience, Model, Dominate, Nation',
    features: [
      'All Enterprise pillars',
      'RESILIENCE — COLLAPSE simulation, CendiaPhoenix™, CendiaEternal™',
      'MODEL — SGAS population modeling, CendiaVox™, Policy Impact Simulator',
      'DOMINATE — 8 industry verticals (48+ modes each), CendiaMesh™ M&A',
      'NATION — CendiaNation™, multi-agency coordination, sovereign infrastructure',
      'White-glove support & custom SLA',
      'Unlimited users, agents & air-gap deploy',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

const commitmentOptions: CommitmentOption[] = [
  { id: 'annual', label: 'Annual', discount: 0, multiplier: 1.0 },
  { id: 'multi-year', label: '3-Year', discount: 20, multiplier: 0.8 },
];

const faqs = [
  {
    q: 'How does regional pricing work?',
    a: 'We adjust our prices based on local market conditions to make Datacendia accessible globally. Your region is determined by your billing address. All features are identical regardless of pricing tier.',
  },
  {
    q: 'Can I change my plan later?',
    a: "Yes! You can upgrade at any time and we'll prorate the difference. Downgrades take effect at your next renewal date.",
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit cards, wire transfers, and ACH. Enterprise customers can also pay via invoice with NET 30 terms.',
  },
  {
    q: 'Is there a pilot program?',
    a: 'Yes! We offer a $50,000 DCII pilot (90 days, 1 business unit) so you can prove value before committing to a Foundation license. Full access to Council, DECIDE, and DCII.',
  },
  {
    q: "What's your refund policy?",
    a: "We offer a 30-day satisfaction guarantee on all annual licenses. If you're not satisfied, we'll work with you to resolve any issues or provide a prorated refund.",
  },
  {
    q: 'Do you offer discounts for non-profits or education?',
    a: 'Yes! Non-profits receive 25% off, and educational institutions receive 40% off. Contact sales for details.',
  },
];

export default function PricingPage() {
  const [selectedRegion, setSelectedRegion] = useState<Region>(regions[0]);
  const [commitment, setCommitment] = useState<CommitmentOption>(commitmentOptions[0]);
  const [showRegionSelector, setShowRegionSelector] = useState(false);

  const formatPrice = (basePrice: number, region: Region, commit: CommitmentOption) => {
    let price = basePrice * region.multiplier * commit.multiplier;
    if (region.currency === 'CNY' && region.conversionRate) {
      price = price * region.conversionRate;
    }
    if (region.currency === 'EUR') {
      price = price * 0.92;
    }
    if (price >= 1000000) {
      return `${region.symbol}${(price / 1000000).toFixed(1)}M`;
    }
    if (price >= 1000) {
      return `${region.symbol}${Math.round(price / 1000)}K`;
    }
    return `${region.symbol}${Math.round(price).toLocaleString()}`;
  };

  const getMonthlyEquivalent = (basePrice: number, region: Region, commit: CommitmentOption) => {
    let price = (basePrice * region.multiplier * commit.multiplier) / 12;
    if (region.currency === 'CNY' && region.conversionRate) {
      price = price * region.conversionRate;
    }
    if (region.currency === 'EUR') {
      price = price * 0.92;
    }
    return `${region.symbol}${Math.round(price).toLocaleString()}`;
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%)',
        fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif",
        color: '#fff',
      }}
    >
      {/* Background effects */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: `radial-gradient(ellipse at 20% 20%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
                     radial-gradient(ellipse at 80% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Header */}
      <header style={{ position: 'relative', textAlign: 'center', padding: '80px 20px 60px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '100px',
            padding: '8px 16px',
            fontSize: '14px',
            color: '#a5b4fc',
            marginBottom: '24px',
          }}
        >
          <span>🌍</span>
          <span>Regional pricing available</span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(36px, 6vw, 64px)',
            fontWeight: 800,
            margin: '0 0 16px 0',
            background: 'linear-gradient(135deg, #fff 0%, #a5b4fc 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-2px',
          }}
        >
          Simple, Transparent Pricing
        </h1>

        <p
          style={{
            fontSize: '20px',
            color: 'rgba(255,255,255,0.6)',
            maxWidth: '600px',
            margin: '0 auto 40px',
          }}
        >
          Invest in better decisions. See ROI within 90 days.
        </p>

        {/* Region Selector */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            flexWrap: 'wrap',
            marginBottom: '32px',
          }}
        >
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowRegionSelector(!showRegionSelector)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 24px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <span style={{ fontSize: '24px' }}>{selectedRegion.flag}</span>
              <span>{selectedRegion.name}</span>
              <span
                style={{
                  opacity: 0.5,
                  marginLeft: '8px',
                  transform: showRegionSelector ? 'rotate(180deg)' : 'rotate(0)',
                  transition: 'transform 0.2s ease',
                }}
              >
                ▼
              </span>
            </button>

            {showRegionSelector && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  marginTop: '8px',
                  background: '#1a1a2e',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '16px',
                  padding: '8px',
                  minWidth: '280px',
                  maxHeight: '400px',
                  overflowY: 'auto',
                  zIndex: 100,
                  boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                }}
              >
                {regions.map((region) => (
                  <button
                    key={region.id}
                    onClick={() => {
                      setSelectedRegion(region);
                      setShowRegionSelector(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      width: '100%',
                      padding: '12px 16px',
                      background:
                        selectedRegion.id === region.id ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                      border: 'none',
                      borderRadius: '10px',
                      color: '#fff',
                      fontSize: '15px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background 0.2s ease',
                    }}
                  >
                    <span style={{ fontSize: '20px' }}>{region.flag}</span>
                    <div>
                      <div style={{ fontWeight: 500 }}>{region.name}</div>
                      <div style={{ fontSize: '12px', opacity: 0.5 }}>
                        {region.multiplier < 1
                          ? `${Math.round((1 - region.multiplier) * 100)}% regional adjustment`
                          : 'Base pricing'}
                      </div>
                    </div>
                    {selectedRegion.id === region.id && (
                      <span style={{ marginLeft: 'auto', color: '#6366f1' }}>✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Commitment Toggle */}
        <div
          style={{
            display: 'inline-flex',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '12px',
            padding: '4px',
          }}
        >
          {commitmentOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setCommitment(option)}
              style={{
                padding: '12px 24px',
                background: commitment.id === option.id ? 'rgba(99, 102, 241, 0.3)' : 'transparent',
                border: 'none',
                borderRadius: '10px',
                color: commitment.id === option.id ? '#fff' : 'rgba(255,255,255,0.5)',
                fontSize: '15px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative',
              }}
            >
              {option.label}
              {option.discount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: '#fff',
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: '100px',
                  }}
                >
                  -{option.discount}%
                </span>
              )}
            </button>
          ))}
        </div>
      </header>

      {/* Pricing Cards */}
      <section
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '24px',
          padding: '0 20px 80px',
          flexWrap: 'wrap',
          position: 'relative',
        }}
      >
        {tiers.map((tier) => (
          <div
            key={tier.id}
            style={{
              width: '340px',
              background: tier.popular
                ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.1) 100%)'
                : 'rgba(255,255,255,0.03)',
              border: tier.popular
                ? '2px solid rgba(99, 102, 241, 0.5)'
                : '1px solid rgba(255,255,255,0.08)',
              borderRadius: '24px',
              padding: '40px 32px',
              position: 'relative',
              transform: tier.popular ? 'scale(1.05)' : 'scale(1)',
              zIndex: tier.popular ? 10 : 1,
            }}
          >
            {tier.popular && (
              <div
                style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  padding: '6px 20px',
                  borderRadius: '100px',
                  fontSize: '12px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                Most Popular
              </div>
            )}

            <div
              style={{
                fontSize: '14px',
                color: 'rgba(255,255,255,0.5)',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                marginBottom: '8px',
              }}
            >
              {tier.name}
            </div>

            <div
              style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}
            >
              <span
                style={{
                  fontSize: '48px',
                  fontWeight: 800,
                  background: tier.popular ? 'linear-gradient(135deg, #fff, #a5b4fc)' : '#fff',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {formatPrice(tier.basePrice, selectedRegion, commitment)}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '16px' }}>
                /yr
              </span>
            </div>

            <div
              style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', marginBottom: '16px' }}
            >
              {getMonthlyEquivalent(tier.basePrice, selectedRegion, commitment)}/month billed{' '}
              {commitment.id === 'annual' ? 'annually' : 'every 3 years'}
            </div>

            <p
              style={{
                color: 'rgba(255,255,255,0.6)',
                fontSize: '15px',
                lineHeight: 1.6,
                marginBottom: '32px',
              }}
            >
              {tier.description}
            </p>

            <button
              style={{
                width: '100%',
                padding: '16px',
                background: tier.popular
                  ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                  : 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
                marginBottom: '32px',
                transition: 'all 0.2s ease',
              }}
            >
              {tier.cta}
            </button>

            <div
              style={{
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                color: 'rgba(255,255,255,0.4)',
                marginBottom: '16px',
              }}
            >
              What's included
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {tier.features.map((feature, i) => (
                <li
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '10px 0',
                    borderBottom:
                      i < tier.features.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  }}
                >
                  <span style={{ color: '#10b981', flexShrink: 0 }}>✓</span>
                  <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* Regional Pricing Explanation */}
      <section
        style={{
          background: 'rgba(255,255,255,0.02)',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          padding: '80px 20px',
        }}
      >
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '16px' }}>
            Fair Pricing, Everywhere
          </h2>
          <p
            style={{
              color: 'rgba(255,255,255,0.6)',
              fontSize: '18px',
              maxWidth: '600px',
              margin: '0 auto 48px',
            }}
          >
            We believe world-class decision intelligence should be accessible globally. Our regional
            pricing reflects local market conditions.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              textAlign: 'left',
            }}
          >
            {regions.map((region) => (
              <div
                key={region.id}
                onClick={() => setSelectedRegion(region)}
                style={{
                  padding: '20px',
                  background:
                    selectedRegion.id === region.id
                      ? 'rgba(99, 102, 241, 0.1)'
                      : 'rgba(255,255,255,0.02)',
                  border:
                    selectedRegion.id === region.id
                      ? '1px solid rgba(99, 102, 241, 0.3)'
                      : '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '8px',
                  }}
                >
                  <span style={{ fontSize: '20px' }}>{region.flag}</span>
                  <span style={{ fontWeight: 600 }}>{region.name}</span>
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    color: region.multiplier < 1 ? '#10b981' : 'rgba(255,255,255,0.5)',
                  }}
                >
                  {region.multiplier < 1
                    ? `${Math.round((1 - region.multiplier) * 100)}% adjustment`
                    : 'Base pricing'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise CTA */}
      <section style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div
          style={{
            maxWidth: '800px',
            margin: '0 auto',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.1))',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '24px',
            padding: '60px 40px',
          }}
        >
          <h2 style={{ fontSize: '36px', fontWeight: 700, marginBottom: '16px' }}>
            Need a Custom Solution?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '18px', marginBottom: '32px' }}>
            Large organization? Complex requirements? Government or education pricing? Let's build a
            package that works for you.
          </p>
          <button
            style={{
              padding: '18px 48px',
              background: '#fff',
              border: 'none',
              borderRadius: '12px',
              color: '#0a0a0f',
              fontSize: '18px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Talk to Sales
          </button>
        </div>
      </section>

      {/* FAQ */}
      <section
        style={{
          background: 'rgba(255,255,255,0.02)',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          padding: '80px 20px',
        }}
      >
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2
            style={{ fontSize: '32px', fontWeight: 700, textAlign: 'center', marginBottom: '48px' }}
          >
            Frequently Asked Questions
          </h2>
          {faqs.map((faq, i) => (
            <div
              key={i}
              style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '24px 0' }}
            >
              <h3
                style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px', color: '#fff' }}
              >
                {faq.q}
              </h3>
              <p
                style={{
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '15px',
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: '40px 20px',
          textAlign: 'center',
          borderTop: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>
          <p style={{ margin: '0 0 8px' }}>
            Prices shown in {selectedRegion.currency}. Local taxes may apply.
          </p>
          <p style={{ margin: 0 }}>Questions? Contact sales@datacendia.com</p>
        </div>
      </footer>
    </div>
  );
}
