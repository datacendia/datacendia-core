// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA MARKETING LAYOUT
// Premium dark theme layout for all marketing/public pages
// =============================================================================

import React, { useEffect, useRef, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { ArrowRight, Menu, X } from 'lucide-react';
import { deterministicFloat, deterministicInt } from '../lib/deterministic';

// =============================================================================
// PREMIUM EFFECTS
// =============================================================================

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
    const particleCount = 35;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: deterministicFloat('marketinglayout-5') * canvas.width,
        y: deterministicFloat('marketinglayout-6') * canvas.height,
        vx: (deterministicFloat('marketinglayout-1') - 0.5) * 0.2,
        vy: (deterministicFloat('marketinglayout-2') - 0.5) * 0.2,
        size: deterministicFloat('marketinglayout-3') * 2 + 0.5,
        opacity: deterministicFloat('marketinglayout-4') * 0.3 + 0.1,
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

      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(127, 29, 29, ${0.06 * (1 - dist / 100)})`;
            ctx.stroke();
          }
        });
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

const ScanLines: React.FC = () => (
  <div
    className="fixed inset-0 pointer-events-none z-10 opacity-[0.015]"
    style={{
      backgroundImage:
        'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
    }}
  />
);

// =============================================================================
// NAVIGATION
// =============================================================================

const navItems = [
  { label: 'SOVEREIGN', path: '/sovereign' },
  { label: 'HONESTY', path: '/honesty' },
  { label: 'PRODUCT', path: '/product' },
  { label: 'PRICING', path: '/pricing' },
  { label: 'DOCS', path: '/docs' },
];

// =============================================================================
// LAYOUT COMPONENT
// =============================================================================

export const MarketingLayout: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white font-light antialiased selection:bg-red-900/30 relative overflow-hidden">
      {/* Background Effects */}
      <ParticleField />
      <ScanLines />

      {/* Vignette overlay */}
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

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-xs tracking-[0.15em] transition-colors ${
                    location.pathname === item.path
                      ? 'text-red-900'
                      : 'text-gray-500 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-4">
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

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-black/95 border-b border-gray-900 z-50">
            <div className="px-6 py-4 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block text-sm tracking-wider ${
                    location.pathname === item.path ? 'text-red-900' : 'text-gray-400'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-800 space-y-3">
                <Link to="/login" className="block text-sm text-gray-400">
                  Sign In
                </Link>
                <Link to="/sovereign" className="block text-sm text-red-900">
                  Request Access →
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Page Content */}
      <main className="relative z-20">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="relative z-20 py-16 px-6 border-t border-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="text-xs tracking-[0.2em] text-gray-500 mb-4">PLATFORM</h4>
              <div className="space-y-2">
                <Link
                  to="/product"
                  className="block text-sm text-gray-600 hover:text-white transition-colors"
                >
                  Product
                </Link>
                <Link
                  to="/pricing"
                  className="block text-sm text-gray-600 hover:text-white transition-colors"
                >
                  Pricing
                </Link>
                <Link
                  to="/honesty"
                  className="block text-sm text-gray-600 hover:text-white transition-colors"
                >
                  Honesty Matrices
                </Link>
              </div>
            </div>
            <div>
              <h4 className="text-xs tracking-[0.2em] text-gray-500 mb-4">RESOURCES</h4>
              <div className="space-y-2">
                <Link
                  to="/docs"
                  className="block text-sm text-gray-600 hover:text-white transition-colors"
                >
                  Documentation
                </Link>
                <Link
                  to="/blog"
                  className="block text-sm text-gray-600 hover:text-white transition-colors"
                >
                  Blog
                </Link>
                <Link
                  to="/changelog"
                  className="block text-sm text-gray-600 hover:text-white transition-colors"
                >
                  Changelog
                </Link>
              </div>
            </div>
            <div>
              <h4 className="text-xs tracking-[0.2em] text-gray-500 mb-4">COMPANY</h4>
              <div className="space-y-2">
                <Link
                  to="/about"
                  className="block text-sm text-gray-600 hover:text-white transition-colors"
                >
                  About
                </Link>
                <Link
                  to="/security"
                  className="block text-sm text-gray-600 hover:text-white transition-colors"
                >
                  Security
                </Link>
                <Link
                  to="/support"
                  className="block text-sm text-gray-600 hover:text-white transition-colors"
                >
                  Support
                </Link>
              </div>
            </div>
            <div>
              <h4 className="text-xs tracking-[0.2em] text-gray-500 mb-4">LEGAL</h4>
              <div className="space-y-2">
                <Link
                  to="/privacy"
                  className="block text-sm text-gray-600 hover:text-white transition-colors"
                >
                  Privacy
                </Link>
                <Link
                  to="/terms"
                  className="block text-sm text-gray-600 hover:text-white transition-colors"
                >
                  Terms
                </Link>
                <Link
                  to="/cookies"
                  className="block text-sm text-gray-600 hover:text-white transition-colors"
                >
                  Cookies
                </Link>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-900 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-8 text-[10px] text-gray-700 tracking-widest">
              <span>© {new Date().getFullYear()} DATACENDIA</span>
              <span>•</span>
              <span>SOVEREIGN INTELLIGENCE</span>
            </div>
            <p className="text-xs text-gray-600">No cloud. No telemetry. No exceptions.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MarketingLayout;
