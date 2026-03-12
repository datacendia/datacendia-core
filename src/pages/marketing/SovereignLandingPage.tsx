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
 * Narrative-driven entry point with frictionless demo access.
 * Name + email → instant platform access via /api/v1/auth/demo-access
 */

import React, { useState, useRef } from 'react';
import { ArrowRight, ArrowDown, Terminal, Scale, ShieldCheck } from 'lucide-react';
import { Logo } from '../../components/brand/Logo';
import { tokenManager } from '../../lib/api/client';

const SovereignLandingPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const problemRef = useRef<HTMLElement>(null);

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
        setTimeout(() => {
          window.location.href = '/cortex';
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

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => formRef.current?.querySelector('input')?.focus(), 400);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white antialiased selection:bg-indigo-900/30">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#09090b] via-[#0c0c10] to-[#09090b] pointer-events-none" />
      <div className="fixed inset-0 opacity-[0.015] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />

      {/* Nav */}
      <nav className="relative z-50 px-6 py-5 flex justify-between items-center max-w-6xl mx-auto">
        <Logo size="sm" />
        <button
          onClick={scrollToForm}
          className="text-xs tracking-widest text-gray-500 hover:text-white transition-colors"
        >
          TRY THE DEMO
        </button>
      </nav>

      {/* ═══════════════════════════ HERO ═══════════════════════════ */}
      <section className="relative z-10 px-6 pt-16 sm:pt-24 pb-20 max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-4xl md:text-[2.75rem] font-light leading-snug mb-2 text-gray-200">
          They have data. They don't have understanding.
        </h1>
        <h1 className="text-2xl sm:text-4xl md:text-[2.75rem] font-light leading-snug mb-10 text-white">
          They have AI. They don't have <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">agency.</span>
        </h1>

        <div className="max-w-3xl space-y-4 mb-10">
          <p className="text-base sm:text-lg text-gray-400 font-light leading-relaxed">
            Every consequential decision your organisation makes with AI is invisible.
            No record of what was considered. No proof of who decided. No evidence it can survive a regulator, an auditor, or a court.
          </p>
          <p className="text-base sm:text-lg text-gray-300 font-light leading-relaxed">
            The EU AI Act changed that. <span className="text-white font-normal">August 2025. Enforcement is live.</span>
          </p>
          <p className="text-base sm:text-lg text-white font-normal leading-relaxed">
            Datacendia gives AI decisions a memory, a voice, and a signature.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <button
            onClick={scrollToForm}
            className="group px-7 py-3.5 bg-white text-black rounded-lg font-medium text-sm tracking-wide inline-flex items-center gap-2.5 hover:bg-gray-100 transition-all"
          >
            Enter the Platform
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
          <button
            onClick={() => problemRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="px-7 py-3.5 border border-white/10 text-gray-400 rounded-lg text-sm inline-flex items-center gap-2.5 hover:border-white/20 hover:text-gray-200 transition-all"
          >
            Read how it works
            <ArrowDown className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ═══════════════════════════ THE PROBLEM ═══════════════════════════ */}
      <section ref={problemRef} className="relative z-10 px-6 py-24 border-t border-white/[0.04]">
        <div className="max-w-3xl mx-auto">
          <p className="text-[11px] tracking-[0.25em] text-gray-600 uppercase mb-6">The Problem</p>
          <p className="text-lg sm:text-xl text-gray-300 font-light leading-relaxed">
            When a law firm uses AI to assess litigation risk, a bank uses it to approve credit, or a board uses it to evaluate an acquisition — that decision vanishes the moment the window closes. If it's challenged, there's nothing to show. No deliberation. No dissent. No proof of process.{' '}
            <span className="text-gray-500">Just a chat log that doesn't exist anymore.</span>
          </p>
        </div>
      </section>

      {/* ═══════════════════════════ THE SOLUTION — 3 BEATS ═══════════════════════════ */}
      <section className="relative z-10 px-6 py-24 border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto">
          <p className="text-[11px] tracking-[0.25em] text-gray-600 uppercase mb-16 text-center">The Solution</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {/* Beat 1 */}
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-2">
                <span className="text-indigo-400 text-lg font-light">1</span>
              </div>
              <h3 className="text-lg text-white font-medium">The Council deliberates.</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Ask a question. Domain-expert AI agents — CFO, CISO, CTO, Legal Counsel, Red Team — argue your decision from every angle.{' '}
                <span className="text-gray-300">Dissent is recorded. Consensus is earned, not assumed.</span>
              </p>
            </div>

            {/* Beat 2 */}
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-2">
                <span className="text-indigo-400 text-lg font-light">2</span>
              </div>
              <h3 className="text-lg text-white font-medium">Every word is signed.</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Each response, vote, and objection is hashed into a Merkle tree. Ed25519 signed. RFC 3161 timestamped.{' '}
                <span className="text-gray-300">The chain of custody is established during deliberation — not reconstructed afterward.</span>
              </p>
            </div>

            {/* Beat 3 */}
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-2">
                <span className="text-indigo-400 text-lg font-light">3</span>
              </div>
              <h3 className="text-lg text-white font-medium">One click. Court-admissible proof.</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                The Regulator's Receipt&trade; exports everything a compliance audit needs.{' '}
                <span className="text-gray-300">Verify it yourself with <code className="text-xs px-1.5 py-0.5 rounded bg-white/5 text-gray-300 font-mono">openssl</code>. No vendor dependency. No trust required.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ AUDIENCE SECTIONS ═══════════════════════════ */}
      <section className="relative z-10 px-6 py-24 border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {/* Developers */}
          <div className="p-6 rounded-xl border border-white/[0.06] bg-white/[0.015]">
            <div className="flex items-center gap-3 mb-5">
              <Terminal className="w-5 h-5 text-emerald-400" />
              <p className="text-[11px] tracking-[0.2em] text-emerald-400/80 uppercase">For Developers</p>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Apache 2.0. Runs on Ollama locally or NVIDIA Triton in production. Self-hosted, air-gapped capable.{' '}
              <code className="text-xs px-1.5 py-0.5 rounded bg-white/5 text-gray-300 font-mono">docker compose up</code>{' '}
              and you're deliberating in five minutes.
            </p>
          </div>

          {/* Compliance */}
          <div className="p-6 rounded-xl border border-white/[0.06] bg-white/[0.015]">
            <div className="flex items-center gap-3 mb-5">
              <Scale className="w-5 h-5 text-amber-400" />
              <p className="text-[11px] tracking-[0.2em] text-amber-400/80 uppercase">For Compliance Teams</p>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              EU AI Act Article 14. SR 11-7. ABA Opinion 512. HIPAA. The platform maps to the frameworks you're already accountable to.
            </p>
          </div>

          {/* Leadership */}
          <div className="p-6 rounded-xl border border-white/[0.06] bg-white/[0.015]">
            <div className="flex items-center gap-3 mb-5">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              <p className="text-[11px] tracking-[0.2em] text-indigo-400/80 uppercase">For Leadership</p>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              The first AI governance platform that produces <span className="text-white">evidence</span>, not just reports. Built for the moment regulators start asking questions — before they do.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ BOTTOM CTA + FORM ═══════════════════════════ */}
      <section className="relative z-10 px-6 py-28 border-t border-white/[0.04]">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-light text-white mb-3">Try the Demo</h2>
          <p className="text-sm text-gray-500 mb-8">No login required. Enter your name and email to access the full platform.</p>

          <form
            ref={formRef}
            onSubmit={handleDemoAccess}
            id="start"
            className="text-left space-y-3"
          >
            <input
              type="text"
              placeholder="Your name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3.5 bg-white/[0.04] border border-white/10 rounded-lg text-white placeholder:text-gray-600 outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] transition-all text-sm"
            />
            <input
              type="email"
              placeholder="Work email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3.5 bg-white/[0.04] border border-white/10 rounded-lg text-white placeholder:text-gray-600 outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] transition-all text-sm"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-8 py-3.5 bg-white text-black rounded-lg font-medium text-sm tracking-wide flex items-center justify-center gap-2 hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-gray-400 border-t-black rounded-full animate-spin" />
                  Entering platform...
                </span>
              ) : (
                <>
                  Try the Demo — No login required
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            {error && (
              <p className="text-red-400 text-xs text-center">{error}</p>
            )}
          </form>
        </div>
      </section>

      {/* ═══════════════════════════ FOOTER ═══════════════════════════ */}
      <footer className="relative z-10 py-10 px-6 border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo size="sm" />
          <p className="text-[11px] text-gray-600 text-center sm:text-right leading-relaxed">
            NVIDIA Inception Program Member&nbsp;&middot;&nbsp;Apache 2.0&nbsp;&middot;&nbsp;Sovereign-first&nbsp;&middot;&nbsp;datacendia.com
          </p>
        </div>
        <div className="max-w-5xl mx-auto mt-4 text-center sm:text-right">
          <p className="text-[10px] text-gray-700">
            &copy; {new Date().getFullYear()} Datacendia, LLC. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SovereignLandingPage;
