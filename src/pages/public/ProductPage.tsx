// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA - PRODUCT PAGE
// Premium dark theme
// =============================================================================

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../../lib/utils';
import { ArrowRight } from 'lucide-react';
import { deterministicFloat, deterministicInt } from '../../lib/deterministic';

// Particle field background
const ParticleField: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {return;}
    const ctx = canvas.getContext('2d');
    if (!ctx) {return;}
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }[] = [];
    for (let i = 0; i < 30; i++) {
      particles.push({
        x: deterministicFloat('product-5') * canvas.width,
        y: deterministicFloat('product-6') * canvas.height,
        vx: (deterministicFloat('product-1') - 0.5) * 0.2,
        vy: (deterministicFloat('product-2') - 0.5) * 0.2,
        size: deterministicFloat('product-3') * 2 + 0.5,
        opacity: deterministicFloat('product-4') * 0.3 + 0.1,
      });
    }
    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) {p.x = canvas.width;}
        if (p.x > canvas.width) {p.x = 0;}
        if (p.y < 0) {p.y = canvas.height;}
        if (p.y > canvas.height) {p.y = 0;}
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(127, 29, 29, ${p.opacity})`;
        ctx.fill();
      });
      animationId = requestAnimationFrame(animate);
    };
    animate();
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

// =============================================================================
// PRODUCT FEATURES DATA
// =============================================================================

const products = [
  {
    id: 'council',
    name: 'The Council™',
    tagline: 'AI-Powered Strategic Advisory',
    description:
      'Consult with a pantheon of specialized AI agents who reason across your entire organization. Get strategic insights from CendiaChief™, CendiaCFO™, CendiaCOO™, and more.',
    icon: '🧠',
    color: '#6366F1',
    features: [
      'Multi-agent deliberation with consensus building',
      'Domain-specific AI experts (Finance, Operations, Security, etc.)',
      'Real-time streaming responses with citations',
      'Confidence scoring and dissent tracking',
      'Full audit trail of all decisions',
    ],
    useCases: [
      'Strategic planning and scenario analysis',
      'Cross-functional decision support',
      'Risk assessment and mitigation',
      'Resource allocation optimization',
    ],
    screenshot: '/screenshots/council.png',
  },
  {
    id: 'apotheosis',
    name: 'CendiaApotheosis™',
    tagline: 'Organizational Superintelligence',
    description:
      'Nightly red-teaming that attacks your AI systems, auto-patches vulnerabilities, and upskills your team. Achieve an Apotheosis Score™ above 95 for enterprise-grade AI resilience.',
    icon: '⚡',
    color: '#F59E0B',
    features: [
      'Automated red-team attacks on your AI systems',
      'Self-healing with reversible auto-patches',
      'Human escalation for critical decisions',
      'Pattern banning to prevent repeat failures',
      'Upskill assignments for team development',
    ],
    useCases: [
      'AI security hardening',
      'Continuous improvement of decision quality',
      'Compliance with AI governance frameworks',
      'Enterprise superintelligence certification',
    ],
    screenshot: '/screenshots/apotheosis.png',
  },
  {
    id: 'dissent',
    name: 'CendiaDissent™',
    tagline: 'Protected Disagreement',
    description:
      'File formal dissent against AI recommendations with full retaliation protection. Track outcomes to prove when dissenters were right.',
    icon: '⚖️',
    color: '#DC2626',
    features: [
      'Formal dissent filing with evidence upload',
      'Anonymous and protected channels',
      'Outcome verification and accuracy tracking',
      'High-accuracy dissenter recognition',
      'Retaliation monitoring and protection',
    ],
    useCases: [
      'Ensuring human oversight of AI decisions',
      'Building organizational learning culture',
      'Regulatory compliance for AI governance',
      'Identifying high-value contrarian thinkers',
    ],
    screenshot: '/screenshots/dissent.png',
  },
  {
    id: 'omnitranslate',
    name: 'CendiaOmniTranslate™',
    tagline: '100+ Languages, Zero Friction',
    description:
      'Enterprise-grade AI translation supporting 100+ languages with context-aware business terminology, glossary management, and translation memory.',
    icon: '🌐',
    color: '#0EA5E9',
    features: [
      '100+ languages including low-resource languages',
      'RTL language support (Arabic, Hebrew, Urdu)',
      'Enterprise glossary management',
      'Translation memory for consistency',
      'Document and decision translation',
    ],
    useCases: [
      'Global team collaboration',
      'Multilingual customer support',
      'Cross-border compliance documentation',
      'International executive summaries',
    ],
    screenshot: '/screenshots/omnitranslate.png',
  },
  {
    id: 'pulse',
    name: 'CendiaPulse™',
    tagline: 'Organization Health at a Glance',
    description:
      "Real-time visibility into your organization's vital signs. Monitor data health, operations, security, and people metrics with instant alerts.",
    icon: '💓',
    color: '#EF4444',
    features: [
      'Unified health score across 4 dimensions',
      'Real-time alert management and escalation',
      'Trend analysis and anomaly detection',
      'System status monitoring',
      'Custom threshold configuration',
    ],
    useCases: [
      'Executive dashboards and reporting',
      'Operational monitoring',
      'Compliance tracking',
      'Incident response coordination',
    ],
    screenshot: '/screenshots/pulse.png',
  },
  {
    id: 'lens',
    name: 'CendiaLens™',
    tagline: 'See Possible Futures',
    description:
      'AI-powered forecasting and what-if analysis. Model different scenarios and understand the impact of decisions before you make them.',
    icon: '🔮',
    color: '#8B5CF6',
    features: [
      'ML-powered forecasting with confidence intervals',
      'What-if scenario modeling',
      'Sensitivity analysis',
      'Automated forecast accuracy tracking',
      'Multi-variable projections',
    ],
    useCases: [
      'Revenue and cash flow forecasting',
      'Demand planning',
      'Budget scenario modeling',
      'Risk quantification',
    ],
    screenshot: '/screenshots/lens.png',
  },
  {
    id: 'bridge',
    name: 'CendiaBridge™',
    tagline: 'Automate Everything',
    description:
      'Visual workflow builder that connects your systems, automates processes, and ensures nothing falls through the cracks.',
    icon: '🌉',
    color: '#10B981',
    features: [
      'Drag-and-drop workflow builder',
      'Pre-built integration connectors',
      'Human-in-the-loop approvals',
      'Real-time execution monitoring',
      'Error handling and retry logic',
    ],
    useCases: [
      'Month-end close automation',
      'Vendor onboarding workflows',
      'Approval routing',
      'Data pipeline orchestration',
    ],
    screenshot: '/screenshots/bridge.png',
  },
  {
    id: 'graph',
    name: 'CendiaGraph™',
    tagline: 'Your Data Universe, Visualized',
    description:
      'Interactive knowledge graph that maps every entity, relationship, and data flow in your organization. Understand lineage, impact, and dependencies instantly.',
    icon: '🕸️',
    color: '#06B6D4',
    features: [
      'Interactive graph visualization',
      'Data lineage tracking',
      'Impact analysis',
      'Entity relationship mapping',
      'Search and filter capabilities',
    ],
    useCases: [
      'Data governance and cataloging',
      'Change impact assessment',
      'Compliance documentation',
      'Data discovery',
    ],
    screenshot: '/screenshots/graph.png',
  },
];

const integrations = [
  { name: 'PostgreSQL', icon: '🐘', category: 'Native' },
  { name: 'MySQL', icon: '🐬', category: 'Native' },
  { name: 'SQL Server', icon: '🔷', category: 'Native' },
  { name: 'MongoDB', icon: '🍃', category: 'Via Adapter' },
  { name: 'Oracle', icon: '�', category: 'Via Adapter' },
  { name: 'IBM DB2', icon: '🔵', category: 'Via Adapter' },
  { name: 'Snowflake', icon: '❄️', category: 'Data Warehouse' },
  { name: 'Salesforce', icon: '☁️', category: 'CRM' },
  { name: 'SAP', icon: '🔒', category: 'ERP' },
  { name: 'Slack', icon: '💬', category: 'Communication' },
  { name: 'AWS', icon: '☁️', category: 'Cloud' },
  { name: 'Azure', icon: '🔷', category: 'Cloud' },
];

// =============================================================================
// COMPONENTS
// =============================================================================

const ProductCard: React.FC<{
  product: (typeof products)[0];
  isExpanded: boolean;
  onToggle: () => void;
}> = ({ product, isExpanded, onToggle }) => {
  return (
    <div
      className={cn(
        'bg-black/50 backdrop-blur-sm border transition-all duration-300 rounded',
        isExpanded ? 'border-red-900/50' : 'border-gray-800 hover:border-gray-700'
      )}
    >
      {/* Header */}
      <div className="p-6 cursor-pointer" onClick={onToggle}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded flex items-center justify-center text-2xl border border-gray-800"
              style={{ backgroundColor: `${product.color}10` }}
            >
              {product.icon}
            </div>
            <div>
              <h3 className="text-lg font-medium text-white">{product.name}</h3>
              <p className="text-xs text-gray-500">{product.tagline}</p>
            </div>
          </div>
          <button
            className={cn(
              'w-6 h-6 rounded flex items-center justify-center transition-transform text-xs',
              isExpanded && 'rotate-180'
            )}
            style={{ color: product.color }}
          >
            ▼
          </button>
        </div>
        <p className="mt-4 text-gray-500 text-sm">{product.description}</p>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-6 pb-6 border-t border-gray-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
            {/* Features */}
            <div>
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-4">
                Key Features
              </h4>
              <ul className="space-y-3">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span
                      className="mt-0.5 w-4 h-4 rounded flex items-center justify-center text-[10px] text-white flex-shrink-0"
                      style={{ backgroundColor: product.color }}
                    >
                      ✓
                    </span>
                    <span className="text-gray-400 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Use Cases */}
            <div>
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-4">
                Use Cases
              </h4>
              <ul className="space-y-3">
                {product.useCases.map((useCase, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-gray-600">→</span>
                    <span className="text-gray-400 text-sm">{useCase}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-6 pt-6 border-t border-gray-800 flex items-center justify-between">
            <Link
              to="/sovereign"
              className="text-sm hover:underline"
              style={{ color: product.color }}
            >
              See {product.name} in action →
            </Link>
            <Link
              to={`/cortex/${product.id === 'graph' ? 'graph' : product.id === 'council' ? 'council' : product.id === 'pulse' ? 'pulse' : product.id === 'lens' ? 'lens' : 'bridge'}`}
              className="px-4 py-2 rounded text-sm text-white transition-colors border"
              style={{ borderColor: `${product.color}50`, backgroundColor: `${product.color}20` }}
            >
              Try It Now
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const ProductPage: React.FC = () => {
  const [expandedProduct, setExpandedProduct] = useState<string | null>('council');

  return (
    <div className="min-h-screen bg-black text-white font-light antialiased selection:bg-red-900/30 relative overflow-hidden">
      <ParticleField />
      <div
        className="fixed inset-0 pointer-events-none z-10 opacity-[0.02]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none z-10"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)',
        }}
      />

      {/* Navigation */}
      <nav className="relative z-30 border-b border-gray-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              to="/sovereign"
              className="text-xl font-extralight tracking-[0.2em] text-white hover:text-red-100 transition-colors"
            >
              DATACENDIA
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link
                to="/sovereign"
                className="text-xs tracking-[0.15em] text-gray-500 hover:text-white transition-colors"
              >
                SOVEREIGN
              </Link>
              <Link
                to="/honesty"
                className="text-xs tracking-[0.15em] text-gray-500 hover:text-white transition-colors"
              >
                HONESTY
              </Link>
              <Link to="/product" className="text-xs tracking-[0.15em] text-red-900">
                PRODUCT
              </Link>
              <Link
                to="/pricing"
                className="text-xs tracking-[0.15em] text-gray-500 hover:text-white transition-colors"
              >
                PRICING
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-xs tracking-[0.15em] text-gray-500 hover:text-white transition-colors"
              >
                SIGN IN
              </Link>
              <Link
                to="/sovereign"
                className="px-4 py-2 border border-red-900/50 text-xs tracking-[0.15em] text-white hover:bg-red-900/10 transition-all"
              >
                REQUEST ACCESS
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-20 py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-xs tracking-[0.4em] text-gray-600 uppercase mb-6">
            SOVEREIGN INTELLIGENCE PLATFORM
          </p>
          <h1 className="text-4xl md:text-5xl font-extralight tracking-[0.05em] mb-6">
            Enterprise Modules.
            <br />
            <span className="text-gray-400">One Unified Platform.</span>
          </h1>
          <p className="text-lg text-gray-400 font-light max-w-2xl mx-auto mb-8">
            Datacendia™ unifies your data, empowers your teams with AI advisors, and automates your
            workflows—all while keeping your intelligence sovereign and secure.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              to="/sovereign"
              className="group px-8 py-4 border-2 border-red-900 bg-black hover:bg-red-900/10 transition-all flex items-center gap-3"
            >
              <span className="text-sm tracking-[0.2em] text-white">Request Access</span>
              <ArrowRight className="w-4 h-4 text-red-800 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 border border-gray-800 text-sm tracking-[0.2em] text-gray-400 hover:text-white hover:border-gray-700 transition-all"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="relative z-20 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-light text-white mb-4">Explore the Platform</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Each module is powerful on its own. Together, they create an intelligence system that
              transforms how your organization operates.
            </p>
          </div>

          <div className="space-y-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isExpanded={expandedProduct === product.id}
                onToggle={() =>
                  setExpandedProduct(expandedProduct === product.id ? null : product.id)
                }
              />
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="relative z-20 py-20 border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.3em] text-gray-600 uppercase mb-4">
              5 UNIVERSAL ADAPTERS
            </p>
            <h2 className="text-2xl font-light text-white mb-4">Connect to Your Existing Databases</h2>
            <p className="text-gray-500">File Watcher, Webhook, Database, Protocol & REST adapters. Data never leaves your infrastructure.</p>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {integrations.map((integration, idx) => (
              <div
                key={idx}
                className="p-4 bg-gray-900/50 border border-gray-800 rounded text-center hover:border-red-900/30 transition-colors"
              >
                <span className="text-2xl mb-2 block">{integration.icon}</span>
                <p className="font-medium text-white text-sm">{integration.name}</p>
                <p className="text-xs text-gray-600">{integration.category}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-600 mt-8 text-sm">
            Native drivers for PostgreSQL, MySQL & SQL Server. Other databases supported via universal adapters.
          </p>
        </div>
      </section>

      {/* Security */}
      <section className="relative z-20 py-20 border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs tracking-[0.3em] text-gray-600 uppercase mb-4">
                ENTERPRISE SECURITY
              </p>
              <h2 className="text-2xl font-light text-white mb-6">
                Your Data Never Leaves Your Control
              </h2>
              <p className="text-gray-500 mb-8">
                Datacendia is built with security and compliance at its core.
              </p>
              <ul className="space-y-4">
                {[
                  { icon: '🔒', text: 'SOC 2 Type II Certified' },
                  { icon: '🏠', text: 'Self-hosted or private cloud deployment' },
                  { icon: '🔐', text: 'End-to-end encryption at rest and in transit' },
                  { icon: '📋', text: 'GDPR, HIPAA, and CCPA compliant' },
                  { icon: '🕵️', text: 'Complete audit logging' },
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-gray-400">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-900/50 border border-gray-800 rounded p-8 text-center">
              <div className="text-5xl mb-4">🛡️</div>
              <p className="text-lg font-light text-white mb-2">Data Sovereignty</p>
              <p className="text-gray-500 text-sm">
                Your AI models run locally. Your data stays in your infrastructure. No data is ever
                shared with third parties.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-20 py-24 border-t border-gray-900">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-light text-white mb-4">Ready to Return Your Mind?</h2>
          <p className="text-gray-500 mb-8">
            Join the organizations that refuse to be tenants in their own house.
          </p>
          <Link
            to="/sovereign"
            className="group inline-flex px-10 py-5 border-2 border-red-900 bg-black hover:bg-red-900/10 transition-all items-center gap-3"
          >
            <span className="text-sm tracking-[0.25em] text-white font-medium">Request Access</span>
            <ArrowRight className="w-4 h-4 text-red-800 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-20 py-16 px-6 border-t border-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="text-xs tracking-[0.2em] text-gray-500 mb-4">PLATFORM</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/product"
                    className="text-sm text-gray-600 hover:text-white transition-colors"
                  >
                    Product
                  </Link>
                </li>
                <li>
                  <Link
                    to="/pricing"
                    className="text-sm text-gray-600 hover:text-white transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    to="/honesty"
                    className="text-sm text-gray-600 hover:text-white transition-colors"
                  >
                    Honesty Matrices
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs tracking-[0.2em] text-gray-500 mb-4">RESOURCES</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/docs"
                    className="text-sm text-gray-600 hover:text-white transition-colors"
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    to="/blog"
                    className="text-sm text-gray-600 hover:text-white transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    to="/changelog"
                    className="text-sm text-gray-600 hover:text-white transition-colors"
                  >
                    Changelog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs tracking-[0.2em] text-gray-500 mb-4">COMPANY</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/about"
                    className="text-sm text-gray-600 hover:text-white transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/security"
                    className="text-sm text-gray-600 hover:text-white transition-colors"
                  >
                    Security
                  </Link>
                </li>
                <li>
                  <Link
                    to="/support"
                    className="text-sm text-gray-600 hover:text-white transition-colors"
                  >
                    Support
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs tracking-[0.2em] text-gray-500 mb-4">LEGAL</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/privacy"
                    className="text-sm text-gray-600 hover:text-white transition-colors"
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms"
                    className="text-sm text-gray-600 hover:text-white transition-colors"
                  >
                    Terms
                  </Link>
                </li>
                <li>
                  <Link
                    to="/cookies"
                    className="text-sm text-gray-600 hover:text-white transition-colors"
                  >
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-900 flex items-center justify-between text-[10px] text-gray-700 tracking-widest">
            <span>© {new Date().getFullYear()} DATACENDIA</span>
            <span>SOVEREIGN INTELLIGENCE</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProductPage;
