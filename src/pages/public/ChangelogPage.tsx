// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { History, Sparkles, Bug, Zap, Shield, ArrowRight } from 'lucide-react';
import { deterministicFloat, deterministicInt } from '../../lib/deterministic';

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
    for (let i = 0; i < 25; i++)
      {particles.push({
        x: deterministicFloat('changelog-5') * canvas.width,
        y: deterministicFloat('changelog-6') * canvas.height,
        vx: (deterministicFloat('changelog-1') - 0.5) * 0.15,
        vy: (deterministicFloat('changelog-2') - 0.5) * 0.15,
        size: deterministicFloat('changelog-3') * 1.5 + 0.5,
        opacity: deterministicFloat('changelog-4') * 0.25 + 0.05,
      });}
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

export const ChangelogPage: React.FC = () => {
  const releases = [
    {
      version: '2.4.0',
      date: 'December 2024',
      type: 'major',
      highlights: [
        { icon: Sparkles, text: 'Chronos temporal intelligence - navigate your org through time' },
        { icon: Sparkles, text: 'Department-level metrics with org comparison' },
        { icon: Zap, text: 'Performance improvements to Knowledge Graph rendering' },
        { icon: Shield, text: 'Enhanced SAML 2.0 and OIDC support' },
      ],
    },
    {
      version: '2.3.0',
      date: 'November 2024',
      type: 'major',
      highlights: [
        { icon: Sparkles, text: 'Sovereign theme and branding overhaul' },
        { icon: Sparkles, text: 'Air-gapped deployment package builder' },
        { icon: Zap, text: 'Redis-backed rate limiting for enterprise scale' },
        { icon: Bug, text: 'Fixed 404 errors on footer navigation links' },
      ],
    },
    {
      version: '2.2.0',
      date: 'October 2024',
      type: 'major',
      highlights: [
        { icon: Sparkles, text: 'Pre-Mortem analysis for proactive risk assessment' },
        { icon: Sparkles, text: 'Ghost Board for stakeholder simulation' },
        { icon: Zap, text: 'Command palette with keyboard shortcuts' },
        { icon: Shield, text: 'Defense in depth security architecture' },
      ],
    },
    {
      version: '2.1.0',
      date: 'September 2024',
      type: 'minor',
      highlights: [
        { icon: Sparkles, text: 'Decision DNA pattern recognition' },
        { icon: Zap, text: 'Improved Council deliberation performance' },
        { icon: Bug, text: 'Fixed timezone issues in audit logs' },
      ],
    },
    {
      version: '2.0.0',
      date: 'August 2024',
      type: 'major',
      highlights: [
        { icon: Sparkles, text: 'Complete platform redesign' },
        { icon: Sparkles, text: 'Multi-agent AI Council' },
        { icon: Sparkles, text: 'Knowledge Graph Explorer' },
        { icon: Shield, text: 'SOC 2 Type II compliance' },
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
            <Link to="/changelog" className="text-red-900">
              CHANGELOG
            </Link>
            <Link to="/docs" className="text-gray-500 hover:text-white transition-colors">
              DOCS
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-20 py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <History className="w-10 h-10 mx-auto mb-4 text-red-900" />
          <p className="text-xs tracking-[0.4em] text-gray-600 uppercase mb-6">RELEASES</p>
          <h1 className="text-3xl font-extralight tracking-wide mb-4">Changelog</h1>
          <p className="text-gray-500">
            What's new in Datacendia. All releases, updates, and improvements.
          </p>
        </div>
      </section>

      {/* Releases */}
      <section className="relative z-20 py-12">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="space-y-6">
            {releases.map((release, index) => (
              <div
                key={index}
                className="bg-black/50 backdrop-blur-sm border border-gray-800 hover:border-red-900/30 rounded p-6 transition-colors"
              >
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-xl font-medium text-white">v{release.version}</span>
                  <span
                    className={`px-2 py-1 text-[10px] font-medium rounded border ${
                      release.type === 'major'
                        ? 'bg-red-900/20 text-red-400 border-red-900/30'
                        : 'bg-gray-800 text-gray-400 border-gray-700'
                    }`}
                  >
                    {release.type === 'major' ? 'MAJOR' : 'MINOR'}
                  </span>
                  <span className="text-xs text-gray-600">{release.date}</span>
                </div>
                <ul className="space-y-3">
                  {release.highlights.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-3">
                      <item.icon
                        className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                          item.icon === Sparkles
                            ? 'text-cyan-500'
                            : item.icon === Zap
                              ? 'text-amber-500'
                              : item.icon === Bug
                                ? 'text-green-500'
                                : 'text-violet-500'
                        }`}
                      />
                      <span className="text-gray-400 text-sm">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
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

export default ChangelogPage;
