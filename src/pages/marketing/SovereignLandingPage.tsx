/**
 * Page — Sovereign Landing Page
 *
 * React page component rendered by the router.
 * @module pages/marketing/SovereignLandingPage
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * Sovereign Landing Page
 *
 * Marketing-style entry point with frictionless demo access.
 * Name + email → instant platform access via /api/v1/auth/demo-access
 */

import React, { useState, useRef } from 'react';
import { ArrowRight, Shield, Brain, FileCheck, Users, Zap, Lock, BarChart3 } from 'lucide-react';
import { Logo } from '../../components/brand/Logo';
import { tokenManager } from '../../lib/api/client';

// Feature card data
const FEATURES = [
  { icon: Brain, title: 'The Council', desc: '24 AI agents deliberate on your questions — CFO, CISO, CTO, and more.', tag: 'Live AI' },
  { icon: FileCheck, title: "Regulator's Receipt", desc: 'Cryptographic proof of every AI decision. Export-ready compliance artifacts.', tag: 'Audit' },
  { icon: Shield, title: 'CendiaGateway', desc: 'AI governance proxy — PII detection, policy enforcement, cost tracking.', tag: 'Security' },
  { icon: Users, title: 'Sovereign Stack', desc: 'Runs on your infrastructure. Air-gapped capable. No vendor lock-in.', tag: 'On-Prem' },
  { icon: BarChart3, title: 'Chronos Timeline', desc: 'Replay any decision. See what the AI saw, when it saw it.', tag: 'Audit' },
  { icon: Lock, title: 'Constitutional Court', desc: 'Hard-coded ethical boundaries. The AI cannot override its own guardrails.', tag: 'Ethics' },
];

const SovereignLandingPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const handleDemoAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/v1/auth/demo-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      });

      const data = await res.json();

      if (data.success && data.data) {
        tokenManager.setTokens({
          accessToken: data.data.accessToken,
          refreshToken: data.data.refreshToken,
          expiresIn: 86400,
        });
        // Small delay so AuthContext picks up the new token
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 100);
      } else {
        setError(data.error?.message || 'Something went wrong. Please try again.');
        setIsSubmitting(false);
      }
    } catch {
      setError('Connection error. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white antialiased selection:bg-indigo-900/30">
      {/* Subtle gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-950 to-indigo-950/20 pointer-events-none" />

      {/* Nav */}
      <nav className="relative z-50 px-6 py-5 flex justify-between items-center max-w-7xl mx-auto">
        <Logo size="sm" />
        <a
          href="#start"
          className="text-xs tracking-widest text-gray-400 hover:text-white transition-colors hidden sm:block"
        >
          TRY THE DEMO
        </a>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 pt-12 sm:pt-20 pb-20 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/5 mb-8">
          <Zap className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-xs text-indigo-300 tracking-wide">Powered by 24 AI Agents</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-light leading-tight mb-6">
          <span className="text-white">Your organization's </span>
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            AI brain trust
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-gray-400 font-light max-w-2xl mx-auto mb-12 leading-relaxed">
          Ask a question. 24 domain-expert AI agents deliberate, debate, and deliver
          a synthesized recommendation — with full audit trail.
        </p>

        {/* Inline Demo Access Form */}
        <form
          ref={formRef}
          onSubmit={handleDemoAccess}
          id="start"
          className="max-w-lg mx-auto"
        >
          <div className="flex flex-col sm:flex-row gap-3 mb-3">
            <input
              type="text"
              placeholder="Your name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 px-4 py-3.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 outline-none focus:border-indigo-500/50 focus:bg-white/[0.07] transition-all text-sm"
            />
            <input
              type="email"
              placeholder="Work email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 outline-none focus:border-indigo-500/50 focus:bg-white/[0.07] transition-all text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg font-medium text-sm tracking-wide flex items-center justify-center gap-2 mx-auto transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Entering platform...
              </span>
            ) : (
              <>
                Start Exploring
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
          {error && (
            <p className="text-red-400 text-xs mt-2">{error}</p>
          )}
          <p className="text-[11px] text-gray-600 mt-3">
            No credit card. No setup. Instant access to the full platform.
          </p>
        </form>
      </section>

      {/* Feature Grid */}
      <section className="relative z-10 px-6 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-2xl sm:text-3xl font-light text-white mb-3">What's inside</h2>
          <p className="text-gray-500 text-sm">Enterprise AI governance, not another chatbot.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group p-6 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 rounded-lg bg-indigo-500/10">
                  <f.icon className="w-5 h-5 text-indigo-400" />
                </div>
                <span className="text-[10px] tracking-wider text-gray-600 uppercase">{f.tag}</span>
              </div>
              <h3 className="text-sm font-medium text-white mb-1.5">{f.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Social Proof / Manifesto */}
      <section className="relative z-10 px-6 py-20 max-w-3xl mx-auto text-center">
        <div className="space-y-6">
          <p className="text-xl sm:text-2xl font-light text-gray-300 leading-relaxed">
            "They have data. They don't have understanding.<br />
            They have AI. They don't have agency."
          </p>
          <p className="text-lg text-white font-light">
            Datacendia exists to return the mind to its rightful owner.
          </p>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative z-10 px-6 py-20 max-w-lg mx-auto text-center">
        <h3 className="text-xl font-light text-white mb-6">Ready to see it in action?</h3>
        <button
          onClick={() => {
            formRef.current?.scrollIntoView({ behavior: 'smooth' });
            formRef.current?.querySelector('input')?.focus();
          }}
          className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg font-medium text-sm tracking-wide inline-flex items-center gap-2 transition-all"
        >
          Enter the Platform
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo size="sm" />
          <p className="text-[11px] text-gray-600">
            © {new Date().getFullYear()} Datacendia, LLC. Sovereign Intelligence Platform.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SovereignLandingPage;
