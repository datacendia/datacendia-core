// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Book, Code, Server, Shield, Zap, Users, ArrowRight } from 'lucide-react';
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
    for (let i = 0; i < 25; i++) {
      particles.push({
        x: deterministicFloat('docs-5') * canvas.width,
        y: deterministicFloat('docs-6') * canvas.height,
        vx: (deterministicFloat('docs-1') - 0.5) * 0.15,
        vy: (deterministicFloat('docs-2') - 0.5) * 0.15,
        size: deterministicFloat('docs-3') * 1.5 + 0.5,
        opacity: deterministicFloat('docs-4') * 0.25 + 0.05,
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

export const DocsPage: React.FC = () => {
  const docSections = [
    {
      icon: Zap,
      title: 'Getting Started',
      description: 'Quick start guide for new users',
      links: [
        { label: 'Platform Overview', href: '/cortex' },
        { label: 'First Login', href: '/login' },
        { label: 'Dashboard Tour', href: '/cortex/dashboard' },
      ],
    },
    {
      icon: Book,
      title: 'Core Concepts',
      description: 'Understanding Decision Intelligence',
      links: [
        { label: 'Knowledge Graph', href: '/cortex/graph' },
        { label: 'AI Council', href: '/cortex/council' },
        { label: 'Chronos Timeline', href: '/cortex/intelligence/chronos' },
      ],
    },
    {
      icon: Code,
      title: 'API Reference',
      description: 'REST API documentation',
      links: [
        { label: 'Authentication', href: '/cortex/security' },
        { label: 'Endpoints', href: '/cortex/data' },
        { label: 'Webhooks', href: '/cortex/bridge/integrations' },
      ],
    },
    {
      icon: Server,
      title: 'Deployment',
      description: 'Installation and configuration',
      links: [
        { label: 'Docker Setup', href: '/contact' },
        { label: 'Air-Gapped Install', href: '/contact' },
        { label: 'Enterprise SSO', href: '/contact' },
      ],
    },
    {
      icon: Shield,
      title: 'Security',
      description: 'Security architecture and compliance',
      links: [
        { label: 'Security Overview', href: '/security' },
        { label: 'Compliance', href: '/security' },
        { label: 'Audit Logs', href: '/cortex/security/audit' },
      ],
    },
    {
      icon: Users,
      title: 'Administration',
      description: 'Managing users and settings',
      links: [
        { label: 'User Management', href: '/cortex/settings/users' },
        { label: 'Roles & Permissions', href: '/cortex/settings/roles' },
        { label: 'Organization Settings', href: '/cortex/settings/organization' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white font-light antialiased selection:bg-red-900/30 relative overflow-hidden">
      <ParticleField />
      <div
        className="fixed inset-0 pointer-events-none z-10"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)',
        }}
      />

      {/* Header */}
      <nav className="relative z-30 border-b border-gray-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-16">
          <Link
            to="/sovereign"
            className="text-xl font-extralight tracking-[0.2em] text-white hover:text-red-100 transition-colors"
          >
            DATACENDIA
          </Link>
          <div className="flex items-center gap-8 text-xs tracking-[0.15em]">
            <Link to="/product" className="text-gray-500 hover:text-white transition-colors">
              PRODUCT
            </Link>
            <Link to="/pricing" className="text-gray-500 hover:text-white transition-colors">
              PRICING
            </Link>
            <Link to="/docs" className="text-red-900">
              DOCS
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-20 py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <Book className="w-10 h-10 mx-auto mb-4 text-red-900" />
          <p className="text-xs tracking-[0.4em] text-gray-600 uppercase mb-6">KNOWLEDGE BASE</p>
          <h1 className="text-3xl font-extralight tracking-wide mb-4">Documentation</h1>
          <p className="text-gray-500">
            Everything you need to get started with the Datacendia platform.
          </p>
        </div>
      </section>

      {/* Doc Sections */}
      <section className="relative z-20 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {docSections.map((section, index) => (
              <div
                key={index}
                className="bg-black/50 backdrop-blur-sm border border-gray-800 hover:border-red-900/30 rounded p-6 transition-colors"
              >
                <section.icon className="w-6 h-6 text-red-900 mb-4" />
                <h2 className="text-lg font-medium text-white mb-2">{section.title}</h2>
                <p className="text-gray-500 text-sm mb-4">{section.description}</p>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        to={link.href}
                        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                      >
                        <ArrowRight className="w-3 h-3" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact for Full Docs */}
      <section className="relative z-20 py-16 border-t border-gray-900">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-xl font-light text-white mb-4">Need Full Documentation?</h2>
          <p className="text-gray-500 mb-8 text-sm">
            Complete API documentation and deployment guides are provided during onboarding for
            licensed customers.
          </p>
          <Link
            to="/sovereign"
            className="group inline-flex items-center gap-2 px-8 py-4 border-2 border-red-900 text-white text-sm tracking-wider hover:bg-red-900/10 transition-all"
          >
            <span>Request Access</span>
            <ArrowRight className="w-4 h-4 text-red-800 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-20 py-12 border-t border-gray-900">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center text-[10px] text-gray-700 tracking-widest">
          <p>© {new Date().getFullYear()} DATACENDIA • SOVEREIGN INTELLIGENCE</p>
        </div>
      </footer>
    </div>
  );
};

export default DocsPage;
