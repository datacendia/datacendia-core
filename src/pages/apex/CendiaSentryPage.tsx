// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * CENDIA SENTRY - Apex Package Service Page
 * Security, Compliance & Risk Management
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Lock,
  Eye,
  FileCheck,
  AlertOctagon,
  Fingerprint,
  Activity,
  Check,
  Play,
  Zap,
  ArrowRight,
  ShieldCheck,
  Scale,
  ClipboardCheck,
  Sparkles,
} from 'lucide-react';

const SERVICES = [
  {
    icon: Shield,
    title: 'Threat Detection',
    description: 'AI-powered security monitoring with real-time threat intelligence.',
    capabilities: [
      'Behavioral anomaly detection',
      'Real-time threat scoring',
      'Automated incident response',
      'Integration with SIEM/SOAR',
      'Zero-day vulnerability alerts',
    ],
  },
  {
    icon: Lock,
    title: 'Access Control',
    description: 'Fine-grained permissions with just-in-time access provisioning.',
    capabilities: [
      'Role-based access control (RBAC)',
      'Attribute-based policies (ABAC)',
      'Just-in-time access grants',
      'Privileged access management',
      'Multi-factor authentication',
    ],
  },
  {
    icon: Eye,
    title: 'Audit & Monitoring',
    description: 'Complete visibility into all platform activities and data access.',
    capabilities: [
      'Immutable audit logs',
      'Real-time activity monitoring',
      'Data access tracking',
      'Session recording',
      'Forensic investigation tools',
    ],
  },
  {
    icon: FileCheck,
    title: 'Compliance Engine',
    description: 'Automated compliance monitoring for major regulatory frameworks.',
    capabilities: [
      'SOC 2 Type II automation',
      'GDPR compliance tools',
      'HIPAA controls',
      'PCI DSS monitoring',
      'Custom policy engine',
    ],
  },
  {
    icon: AlertOctagon,
    title: 'Risk Assessment',
    description: 'Continuous risk evaluation with AI-driven recommendations.',
    capabilities: [
      'Automated risk scoring',
      'Vendor risk management',
      'Third-party assessments',
      'Risk heat maps',
      'Mitigation tracking',
    ],
  },
  {
    icon: Fingerprint,
    title: 'Identity Management',
    description: 'Enterprise SSO and identity lifecycle management.',
    capabilities: [
      'SAML/OIDC integration',
      'Directory synchronization',
      'User lifecycle automation',
      'Session management',
      'Identity verification',
    ],
  },
];

const COMPLIANCE_BADGES = [
  { name: 'SOC 2', status: 'Certified', color: 'green' },
  { name: 'GDPR', status: 'Compliant', color: 'green' },
  { name: 'HIPAA', status: 'Ready', color: 'blue' },
  { name: 'ISO 27001', status: 'In Progress', color: 'yellow' },
];

export const CendiaSentryPage: React.FC = () => {
  const [activeService, setActiveService] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-red-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(239,68,68,0.15),transparent_70%)]" />
        <div className="max-w-7xl mx-auto px-6 py-20 relative">
          <div className="flex items-center gap-2 text-red-400 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            APEX PACKAGE
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Cendia<span className="text-red-400">Sentry</span>
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mb-8">
            Enterprise-grade security and compliance. Protect your data, meet regulatory
            requirements, and manage risk with AI-powered vigilance.
          </p>

          <div className="flex flex-wrap gap-4 mb-12">
            <Link
              to="/demo?package=sentry"
              className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-500 transition"
            >
              <Play className="w-5 h-5" />
              Request Demo
            </Link>
            <Link
              to="/trust-center"
              className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-700 transition border border-slate-700"
            >
              <ShieldCheck className="w-5 h-5" />
              Trust Center
            </Link>
          </div>

          {/* Compliance Badges */}
          <div className="flex flex-wrap gap-4">
            {COMPLIANCE_BADGES.map((badge) => (
              <div
                key={badge.name}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700"
              >
                <ShieldCheck
                  className={`w-5 h-5 ${
                    badge.color === 'green'
                      ? 'text-green-400'
                      : badge.color === 'blue'
                        ? 'text-blue-400'
                        : 'text-yellow-400'
                  }`}
                />
                <span className="text-white font-medium">{badge.name}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded ${
                    badge.color === 'green'
                      ? 'bg-green-500/20 text-green-400'
                      : badge.color === 'blue'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                  }`}
                >
                  {badge.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">6 Security & Compliance Services</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Comprehensive protection for your organizational intelligence platform, built on
            zero-trust principles.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service, index) => (
            <div
              key={service.title}
              onClick={() => setActiveService(index)}
              className={`p-6 rounded-xl border cursor-pointer transition-all ${
                activeService === index
                  ? 'bg-red-600/20 border-red-500 shadow-lg shadow-red-500/20'
                  : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
              }`}
            >
              <service.icon
                className={`w-10 h-10 mb-4 ${
                  activeService === index ? 'text-red-400' : 'text-slate-400'
                }`}
              />
              <h3 className="text-xl font-semibold text-white mb-2">{service.title}</h3>
              <p className="text-slate-400 text-sm mb-4">{service.description}</p>
              <ul className="space-y-2">
                {service.capabilities.slice(0, 3).map((cap) => (
                  <li key={cap} className="flex items-center gap-2 text-sm text-slate-300">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    {cap}
                  </li>
                ))}
              </ul>
              <button className="mt-4 text-red-400 text-sm font-medium flex items-center gap-1 hover:text-red-300">
                Learn more <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Security Dashboard Preview */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden">
          <div className="grid lg:grid-cols-2">
            <div className="p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Real-Time Security Dashboard</h3>

              <div className="space-y-4">
                <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                  <div className="flex items-center gap-3 mb-2">
                    <ShieldCheck className="w-5 h-5 text-green-400" />
                    <span className="font-medium text-white">Security Score</span>
                    <span className="ml-auto text-2xl font-bold text-green-400">94/100</span>
                  </div>
                  <p className="text-sm text-slate-400">
                    All critical controls passing • Last scan: 2 min ago
                  </p>
                </div>

                <div className="p-4 bg-slate-900/50 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Activity className="w-5 h-5 text-cyan-400" />
                    <span className="font-medium text-white">Active Sessions</span>
                    <span className="ml-auto text-lg font-semibold text-white">127</span>
                  </div>
                  <p className="text-sm text-slate-400">
                    12 admin sessions • 3 elevated access grants
                  </p>
                </div>

                <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/30">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertOctagon className="w-5 h-5 text-amber-400" />
                    <span className="font-medium text-white">Open Findings</span>
                    <span className="ml-auto text-lg font-semibold text-amber-400">3</span>
                  </div>
                  <p className="text-sm text-slate-400">1 high • 2 medium • Due by next audit</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 p-8 flex items-center justify-center">
              <div className="text-center">
                <div className="w-48 h-48 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30 flex items-center justify-center">
                  <Shield className="w-24 h-24 text-red-400" />
                </div>
                <div className="text-white font-semibold">Zero Trust Engine</div>
                <div className="text-slate-400 text-sm">Continuous verification active</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance Frameworks */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h3 className="text-2xl font-bold text-white mb-8 text-center">
          Supported Compliance Frameworks
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'SOC 2', icon: Scale },
            { name: 'GDPR', icon: ClipboardCheck },
            { name: 'HIPAA', icon: FileCheck },
            { name: 'ISO 27001', icon: Shield },
            { name: 'PCI DSS', icon: Lock },
            { name: 'CCPA', icon: Eye },
            { name: 'FedRAMP', icon: ShieldCheck },
            { name: 'NIST', icon: Fingerprint },
          ].map((framework) => (
            <div
              key={framework.name}
              className="p-6 bg-slate-800/30 rounded-xl border border-slate-700 text-center hover:border-red-500/50 transition"
            >
              <framework.icon className="w-8 h-8 text-red-400 mx-auto mb-3" />
              <div className="text-white font-medium">{framework.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-8 md:p-12 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Secure Your Organizational Intelligence
          </h3>
          <p className="text-red-100 mb-8 max-w-2xl mx-auto">
            Get enterprise-grade security and compliance out of the box. Schedule a security
            assessment today.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/demo?package=sentry"
              className="px-8 py-3 bg-white text-red-600 font-semibold rounded-lg hover:bg-red-50 transition"
            >
              Schedule Assessment
            </Link>
            <Link
              to="/trust-center"
              className="px-8 py-3 bg-red-700 text-white font-semibold rounded-lg hover:bg-red-800 transition"
            >
              View Trust Center
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CendiaSentryPage;
