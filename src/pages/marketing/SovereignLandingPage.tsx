// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Sovereign Landing Page
 *
 * "This Is Different" - Premium, classified-level positioning
 * No pricing. No feature list. No trial. Pure exclusivity.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield } from 'lucide-react';
import { useForm, ValidationError } from '@formspree/react';
import { deterministicFloat, deterministicInt } from '../../lib/deterministic';
import { api } from '@/lib/api/client';

// Floating particles background
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
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: deterministicFloat('sovereignlanding-6') * canvas.width,
        y: deterministicFloat('sovereignlanding-7') * canvas.height,
        vx: (deterministicFloat('sovereignlanding-1') - 0.5) * 0.3,
        vy: (deterministicFloat('sovereignlanding-2') - 0.5) * 0.3,
        size: deterministicFloat('sovereignlanding-4') * 2 + 0.5,
        opacity: deterministicFloat('sovereignlanding-5') * 0.5 + 0.1,
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

      // Draw connecting lines for nearby particles
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(127, 29, 29, ${0.1 * (1 - dist / 150)})`;
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

// Scan lines overlay for classified feel
const ScanLines: React.FC = () => (
  <div
    className="fixed inset-0 pointer-events-none z-10 opacity-[0.03]"
    style={{
      backgroundImage:
        'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
    }}
  />
);

// Glitch text effect
const GlitchText: React.FC<{ children: string; className?: string }> = ({
  children,
  className,
}) => {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const interval = setInterval(
      () => {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 200);
      },
      5000 + deterministicFloat('sovereignlanding-3') * 3000
    );

    return () => clearInterval(interval);
  }, []);

  return (
    <span className={`relative inline-block ${className}`}>
      <span className={isGlitching ? 'opacity-0' : ''}>{children}</span>
      {isGlitching && (
        <>
          <span
            className="absolute inset-0 text-red-900/80"
            style={{ transform: 'translate(-2px, 0)', clipPath: 'inset(20% 0 30% 0)' }}
          >
            {children}
          </span>
          <span
            className="absolute inset-0 text-cyan-900/80"
            style={{ transform: 'translate(2px, 0)', clipPath: 'inset(50% 0 10% 0)' }}
          >
            {children}
          </span>
          <span className="absolute inset-0">{children}</span>
        </>
      )}
    </span>
  );
};

// Live counter animation hook
const useAnimatedCounter = (target: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) {startTime = timestamp;}
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration]);

  return count;
};

// Request Access Modal
const RequestAccessModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [formspreeState, formspreeSubmit] = useForm('xvzbvpev');
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    organization: '',
    concern: '',
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // Primary: Formspree (email notification via @formspree/react)
    await formspreeSubmit(e);

    // Secondary: Backend (database persistence)
    api.post('/api/v1/marketing-leads', {
      ...formData,
      source: 'sovereign_landing',
    }).catch((err) => console.error('[SovereignLanding] Backend failed:', err));
  };

  if (!isOpen) {return null;}

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm">
      <div className="relative w-full max-w-lg">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-gray-500 hover:text-white text-sm tracking-widest"
        >
          CLOSE
        </button>

        {formspreeState.succeeded ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 border border-red-900/50 rounded-full flex items-center justify-center mx-auto mb-8">
              <div className="w-3 h-3 bg-red-900 rounded-full" />
            </div>
            <h3 className="text-2xl font-light text-white mb-4 tracking-wide">Access Requested</h3>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto">
              Your inquiry has been received. If approved, you will be contacted within 48 hours to
              schedule a secure demonstration.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <input type="hidden" name="_subject" value={`Sovereign Access Request: ${formData.organization}`} />
            <input type="hidden" name="source" value="sovereign_landing" />
            <div>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-transparent border-b border-gray-800 focus:border-red-900/50 text-white py-4 px-0 text-lg outline-none transition-colors placeholder:text-gray-600"
              />
              <ValidationError prefix="Name" field="name" errors={formspreeState.errors} className="text-red-500 text-xs mt-1" />
            </div>
            <div>
              <input
                type="text"
                name="title"
                placeholder="Title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-transparent border-b border-gray-800 focus:border-red-900/50 text-white py-4 px-0 text-lg outline-none transition-colors placeholder:text-gray-600"
              />
              <ValidationError prefix="Title" field="title" errors={formspreeState.errors} className="text-red-500 text-xs mt-1" />
            </div>
            <div>
              <input
                type="text"
                name="organization"
                placeholder="Organization"
                required
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                className="w-full bg-transparent border-b border-gray-800 focus:border-red-900/50 text-white py-4 px-0 text-lg outline-none transition-colors placeholder:text-gray-600"
              />
              <ValidationError prefix="Organization" field="organization" errors={formspreeState.errors} className="text-red-500 text-xs mt-1" />
            </div>
            <div>
              <textarea
                name="message"
                placeholder="What keeps you up at night?"
                required
                rows={3}
                value={formData.concern}
                onChange={(e) => setFormData({ ...formData, concern: e.target.value })}
                className="w-full bg-transparent border-b border-gray-800 focus:border-red-900/50 text-white py-4 px-0 text-lg outline-none transition-colors placeholder:text-gray-600 resize-none"
              />
              <ValidationError prefix="Message" field="message" errors={formspreeState.errors} className="text-red-500 text-xs mt-1" />
            </div>
            <div className="pt-8">
              <button
                type="submit"
                disabled={formspreeState.submitting}
                className="w-full py-4 border border-red-900/50 text-white hover:bg-red-900/10 transition-colors text-sm tracking-widest disabled:opacity-50"
              >
                {formspreeState.submitting ? 'SUBMITTING...' : 'SUBMIT REQUEST'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

const SovereignLandingPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState<'honesty' | 'manifesto'>('honesty');

  // Animated counters
  const deployments = useAnimatedCounter(11, 2500);
  const decisions = useAnimatedCounter(2847, 3000);
  const frameworks = useAnimatedCounter(31, 2000);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

      {/* Fixed Nav with Sign In */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-xs tracking-[0.3em] text-gray-500 hover:text-white transition-colors">
          DATACENDIA
        </Link>
        <div className="flex items-center gap-4">
          <Link 
            to="/login" 
            className="px-4 py-2 text-xs tracking-[0.2em] border border-white/30 hover:border-white hover:bg-white/10 text-white transition-all"
          >
            SIGN IN
          </Link>
          <Link 
            to="/demo" 
            className="px-4 py-2 text-xs tracking-[0.2em] bg-red-900/80 hover:bg-red-800 text-white transition-all"
          >
            REQUEST ACCESS
          </Link>
        </div>
      </nav>

      {/* Hero Section - Full Screen */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 relative">
        {/* Logo / Brand */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extralight tracking-[0.3em] text-white mb-4">
            <GlitchText>DATACENDIA</GlitchText>
          </h1>
          <p className="text-sm tracking-[0.4em] text-gray-500 uppercase">
            Sovereign Intelligence Platform
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center gap-1 mb-12">
          <button
            onClick={() => setActiveTab('honesty')}
            className={`px-6 py-3 text-xs tracking-[0.2em] transition-all duration-300 border ${
              activeTab === 'honesty'
                ? 'border-red-900/50 text-white bg-red-900/10'
                : 'border-gray-800 text-gray-500 hover:text-white hover:border-gray-700'
            }`}
          >
            HONESTY MATRICES
          </button>
          <button
            onClick={() => setActiveTab('manifesto')}
            className={`px-6 py-3 text-xs tracking-[0.2em] transition-all duration-300 border ${
              activeTab === 'manifesto'
                ? 'border-red-900/50 text-white bg-red-900/10'
                : 'border-gray-800 text-gray-500 hover:text-white hover:border-gray-700'
            }`}
          >
            THE MANIFESTO
          </button>
        </div>

        {/* Honesty Matrices Tab */}
        {activeTab === 'honesty' && (
          <div className="w-full max-w-5xl mb-16">
            <div className="text-center mb-8">
              <p className="text-xs tracking-[0.4em] text-gray-500 uppercase mb-3">
                RADICAL TRANSPARENCY
              </p>
              <h2 className="text-xl md:text-2xl font-light text-white mb-2">
                Most vendors hide this. We lead with it.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="/honesty"
                className="group p-6 border border-gray-800 hover:border-red-900/50 bg-black/50 transition-all duration-300 rounded"
              >
                <div className="text-2xl mb-3">🏛️</div>
                <h3 className="text-sm font-medium text-white mb-1">Sovereignty Matrix</h3>
                <p className="text-xs text-gray-500 mb-3">How much control do you actually have?</p>
                <div className="flex gap-2">
                  <span className="px-2 py-0.5 text-[10px] bg-green-900/30 text-green-400 rounded">
                    Air-Gapped
                  </span>
                  <span className="px-2 py-0.5 text-[10px] bg-green-900/30 text-green-400 rounded">
                    On-Prem
                  </span>
                </div>
              </a>

              <a
                href="/honesty"
                className="group p-6 border border-gray-800 hover:border-red-900/50 bg-black/50 transition-all duration-300 rounded"
              >
                <div className="text-2xl mb-3">🚫</div>
                <h3 className="text-sm font-medium text-white mb-1">What We Can't Do</h3>
                <p className="text-xs text-gray-500 mb-3">Our actual limitations, documented.</p>
                <div className="flex gap-2">
                  <span className="px-2 py-0.5 text-[10px] bg-red-900/30 text-red-400 rounded">
                    Honest
                  </span>
                  <span className="px-2 py-0.5 text-[10px] bg-gray-800 text-gray-400 rounded">
                    No BS
                  </span>
                </div>
              </a>

              <a
                href="/honesty"
                className="group p-6 border border-gray-800 hover:border-red-900/50 bg-black/50 transition-all duration-300 rounded"
              >
                <div className="text-2xl mb-3">🚨</div>
                <h3 className="text-sm font-medium text-white mb-1">What Breaks at 3 AM</h3>
                <p className="text-xs text-gray-500 mb-3">When things go wrong, what happens?</p>
                <div className="flex gap-2">
                  <span className="px-2 py-0.5 text-[10px] bg-yellow-900/30 text-yellow-400 rounded">
                    Recovery
                  </span>
                  <span className="px-2 py-0.5 text-[10px] bg-yellow-900/30 text-yellow-400 rounded">
                    Root Cause
                  </span>
                </div>
              </a>
            </div>

            <div className="text-center mt-6">
              <a
                href="/honesty"
                className="text-xs tracking-[0.2em] text-gray-500 hover:text-red-900 transition-colors"
              >
                VIEW ALL 6 HONESTY MATRICES →
              </a>
            </div>
          </div>
        )}

        {/* Manifesto Tab */}
        {activeTab === 'manifesto' && (
          <div className="w-full max-w-3xl mb-16">
            <div className="space-y-8 text-center">
              <p className="text-lg md:text-xl font-light text-gray-300 leading-relaxed">
                Modern enterprises have surrendered their minds.
              </p>

              <p className="text-base text-gray-400 leading-relaxed">
                They've traded ownership for convenience, and now they're tenants in their own
                house.
              </p>

              <div className="space-y-2 text-sm text-gray-500">
                <p>They have data. They don't have understanding.</p>
                <p>They have dashboards. They don't have direction.</p>
                <p>They have AI. They don't have agency.</p>
                <p>They have predictions. They don't have power.</p>
                <p>They have tools. They don't have truth.</p>
              </div>

              <p className="text-xl md:text-2xl font-light text-white leading-relaxed pt-4">
                Datacendia exists to return the mind to its rightful owner.
              </p>

              <div className="pt-8 border-t border-gray-900">
                <p className="text-xs tracking-[0.3em] text-gray-600 uppercase mb-6">We Believe</p>
                <ol className="space-y-3 text-sm text-gray-400 text-left max-w-xl mx-auto">
                  <li className="flex gap-4">
                    <span className="text-red-900 font-mono">1.</span>
                    <span>
                      Your intelligence should live on your infrastructure, under your control.
                    </span>
                  </li>
                  <li className="flex gap-4">
                    <span className="text-red-900 font-mono">2.</span>
                    <span>Decisions made by machines should be explainable to humans.</span>
                  </li>
                  <li className="flex gap-4">
                    <span className="text-red-900 font-mono">3.</span>
                    <span>
                      Disagreement is not disloyalty — it is the immune system of good judgment.
                    </span>
                  </li>
                  <li className="flex gap-4">
                    <span className="text-red-900 font-mono">4.</span>
                    <span>
                      The past is not a black box — it is a teacher, if you can replay it.
                    </span>
                  </li>
                  <li className="flex gap-4">
                    <span className="text-red-900 font-mono">5.</span>
                    <span>Transparency is not a feature. It is the foundation.</span>
                  </li>
                </ol>
              </div>

              <p className="text-base text-gray-400 pt-6 italic">
                The future belongs to those who can see it —
                <br />
                <span className="text-white not-italic">
                  and refuse to rent it from someone else.
                </span>
              </p>
            </div>
          </div>
        )}

        {/* Value Proposition - Single memorable line */}
        <div className="text-center mb-16">
          <p className="text-xl md:text-2xl lg:text-3xl font-light leading-relaxed">
            <span className="text-gray-400">We do not host your data. We </span>
            <span className="relative text-white">
              return your mind
              <span className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-red-900/0 via-red-900 to-red-900/0" />
            </span>
            <span className="text-gray-400">.</span>
          </p>
        </div>

        {/* Request Access Button - CendiaVeto™ crimson */}
        <button
          onClick={() => setShowModal(true)}
          className="group relative px-10 py-5 border-2 border-red-900 bg-black hover:bg-red-900/10 transition-all duration-300 flex items-center gap-3 overflow-hidden"
        >
          {/* Pulse glow effect */}
          <span className="absolute inset-0 bg-red-900/20 animate-pulse" />
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-red-900/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <Shield className="w-4 h-4 text-red-800 relative z-10" />
          <span className="text-sm tracking-[0.25em] text-white font-medium relative z-10">
            Request Access
          </span>
          <ArrowRight className="w-4 h-4 text-red-800 group-hover:translate-x-1 transition-transform relative z-10" />
        </button>

        {/* Scroll indicator */}
        <div
          className={`absolute bottom-12 left-1/2 -translate-x-1/2 transition-opacity duration-500 ${hasScrolled ? 'opacity-0' : 'opacity-100'}`}
        >
          <div className="w-px h-16 bg-gradient-to-b from-transparent to-gray-800" />
        </div>
      </section>

      {/* Below the Fold */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 py-24">
        {/* Tagline */}
        <p className="text-center text-gray-500 text-lg md:text-xl font-light mb-24 tracking-wide">
          For organizations that cannot afford to be tenants.
        </p>

        {/* Live Counters */}
        <div className="flex flex-wrap justify-center gap-12 md:gap-24 mb-24">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-light text-white tabular-nums">
              {deployments}
            </div>
            <div className="text-[10px] text-gray-600 tracking-[0.3em] mt-2">
              SOVEREIGN DEPLOYMENTS ACTIVE
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-light text-white tabular-nums">
              {decisions.toLocaleString()}
            </div>
            <div className="text-[10px] text-gray-600 tracking-[0.3em] mt-2">
              DECISIONS PROTECTED THIS QUARTER
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-light text-white tabular-nums">
              {frameworks}
            </div>
            <div className="text-[10px] text-gray-600 tracking-[0.3em] mt-2">
              REGULATORY FRAMEWORKS MAPPED
            </div>
          </div>
        </div>

        {/* Second CTA */}
        <button
          onClick={() => setShowModal(true)}
          className="group px-8 py-4 border border-gray-800 hover:border-red-900/50 bg-black transition-all duration-300 flex items-center gap-3"
        >
          <span className="text-sm tracking-[0.2em] text-gray-400 group-hover:text-white transition-colors">
            Request Access
          </span>
          <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-red-900 group-hover:translate-x-1 transition-all" />
        </button>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-gray-900 relative z-20">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs text-gray-600 leading-relaxed max-w-2xl mx-auto mb-8">
            Datacendia runs entirely on your hardware, in your vault, under your control.
            <br />
            No cloud. No telemetry. No exceptions.
          </p>
          <div className="flex items-center justify-center gap-8 text-[10px] text-gray-700 tracking-widest">
            <span>© {new Date().getFullYear()} DATACENDIA</span>
            <span>•</span>
            <span>SOVEREIGN INTELLIGENCE</span>
          </div>
        </div>
      </footer>

      {/* Request Access Modal */}
      <RequestAccessModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default SovereignLandingPage;
