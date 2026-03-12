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
import { ArrowRight, ArrowDown, Terminal, Scale, ShieldCheck, MessageCircle, Users, FileWarning, Fingerprint, Archive, FileCheck2 } from 'lucide-react';
import { Logo } from '../../components/brand/Logo';
import { tokenManager } from '../../lib/api/client';
import { useTranslation } from '../../lib/i18n';

const WORKFLOW_STEPS = [
  { key: 'ask', icon: MessageCircle, color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/20' },
  { key: 'deliberate', icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
  { key: 'dissent', icon: FileWarning, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  { key: 'sign', icon: Fingerprint, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
  { key: 'store', icon: Archive, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  { key: 'export', icon: FileCheck2, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
] as const;

const SovereignLandingPage: React.FC = () => {
  const { t } = useTranslation();
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
          {t('landing.nav.tryDemo')}
        </button>
      </nav>

      {/* ═══════════════════════════ HERO ═══════════════════════════ */}
      <section className="relative z-10 px-6 pt-16 sm:pt-24 pb-20 max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-4xl md:text-[2.75rem] font-light leading-snug mb-2 text-gray-200">
          {t('landing.hero.line1')}
        </h1>
        <h1 className="text-2xl sm:text-4xl md:text-[2.75rem] font-light leading-snug mb-10 text-white">
          {t('landing.hero.line2')} <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{t('landing.hero.agency')}</span>
        </h1>

        <div className="max-w-3xl space-y-4 mb-10">
          <p className="text-base sm:text-lg text-gray-400 font-light leading-relaxed">
            {t('landing.hero.p1')}
          </p>
          <p className="text-base sm:text-lg text-gray-300 font-light leading-relaxed">
            {t('landing.hero.p2')} <span className="text-white font-normal">{t('landing.hero.p2Emphasis')}</span>
          </p>
          <p className="text-base sm:text-lg text-white font-normal leading-relaxed">
            {t('landing.hero.p3')}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <button
            onClick={scrollToForm}
            className="group px-7 py-3.5 bg-white text-black rounded-lg font-medium text-sm tracking-wide inline-flex items-center gap-2.5 hover:bg-gray-100 transition-all"
          >
            {t('landing.hero.cta')}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
          <button
            onClick={() => problemRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="px-7 py-3.5 border border-white/10 text-gray-400 rounded-lg text-sm inline-flex items-center gap-2.5 hover:border-white/20 hover:text-gray-200 transition-all"
          >
            {t('landing.hero.secondaryCta')}
            <ArrowDown className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ═══════════════════════════ THE PROBLEM ═══════════════════════════ */}
      <section ref={problemRef} className="relative z-10 px-6 py-24 border-t border-white/[0.04]">
        <div className="max-w-3xl mx-auto">
          <p className="text-[11px] tracking-[0.25em] text-gray-600 uppercase mb-6">{t('landing.problem.label')}</p>
          <p className="text-lg sm:text-xl text-gray-300 font-light leading-relaxed">
            {t('landing.problem.text')}{' '}
            <span className="text-gray-500">{t('landing.problem.fade')}</span>
          </p>
        </div>
      </section>

      {/* ═══════════════════════════ WHAT IS DATACENDIA? ═══════════════════════════ */}
      <section className="relative z-10 px-6 py-24 border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto">
          <p className="text-[11px] tracking-[0.25em] text-gray-600 uppercase mb-16 text-center">{t('landing.whatIs.label')}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Plain terms */}
            <div className="p-8 rounded-2xl border border-white/[0.06] bg-white/[0.015] space-y-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                </div>
                <h3 className="text-base font-medium text-emerald-400">{t('landing.whatIs.simple.title')}</h3>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                {t('landing.whatIs.simple.description')}
              </p>
              <p className="text-xs text-gray-500 leading-relaxed italic border-l-2 border-emerald-500/20 pl-4">
                {t('landing.whatIs.simple.analogy')}
              </p>
            </div>

            {/* Technical */}
            <div className="p-8 rounded-2xl border border-white/[0.06] bg-white/[0.015] space-y-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center">
                  <Terminal className="w-4 h-4 text-indigo-400" />
                </div>
                <h3 className="text-base font-medium text-indigo-400">{t('landing.whatIs.technical.title')}</h3>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                {t('landing.whatIs.technical.description')}
              </p>
              <p className="text-[11px] text-gray-600 font-mono tracking-wide">
                {t('landing.whatIs.technical.stack')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ WORKFLOW DIAGRAM ═══════════════════════════ */}
      <section className="relative z-10 px-6 py-24 border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto">
          <p className="text-[11px] tracking-[0.25em] text-gray-600 uppercase mb-3 text-center">{t('landing.workflow.label')}</p>
          <p className="text-sm text-gray-500 text-center mb-16">{t('landing.workflow.subtitle')}</p>

          {/* Desktop: horizontal flow */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-6 gap-0 items-start">
              {WORKFLOW_STEPS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={step.key} className="relative flex flex-col items-center text-center">
                    {/* Connector line */}
                    {i > 0 && (
                      <div className="absolute top-5 -left-[50%] w-full h-px bg-gradient-to-r from-white/[0.06] to-white/[0.12]" />
                    )}
                    {/* Step number + icon */}
                    <div className={`relative z-10 w-10 h-10 rounded-full ${step.bg} border ${step.border} flex items-center justify-center mb-4`}>
                      <Icon className={`w-4.5 h-4.5 ${step.color}`} />
                    </div>
                    {/* Step number badge */}
                    <span className="text-[10px] text-gray-600 font-mono mb-1">{String(i + 1).padStart(2, '0')}</span>
                    <h4 className={`text-sm font-medium ${step.color} mb-2`}>
                      {t(`landing.workflow.steps.${step.key}.title`)}
                    </h4>
                    <p className="text-xs text-gray-500 leading-relaxed px-2">
                      {t(`landing.workflow.steps.${step.key}.description`)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile/tablet: vertical flow */}
          <div className="lg:hidden space-y-0">
            {WORKFLOW_STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.key} className="relative flex gap-5">
                  {/* Vertical line + icon */}
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full ${step.bg} border ${step.border} flex items-center justify-center shrink-0`}>
                      <Icon className={`w-4.5 h-4.5 ${step.color}`} />
                    </div>
                    {i < WORKFLOW_STEPS.length - 1 && (
                      <div className="w-px flex-1 bg-gradient-to-b from-white/10 to-transparent min-h-[2rem]" />
                    )}
                  </div>
                  {/* Content */}
                  <div className="pb-8 pt-1.5">
                    <span className="text-[10px] text-gray-600 font-mono">{String(i + 1).padStart(2, '0')}</span>
                    <h4 className={`text-sm font-medium ${step.color} mb-1`}>
                      {t(`landing.workflow.steps.${step.key}.title`)}
                    </h4>
                    <p className="text-xs text-gray-500 leading-relaxed max-w-sm">
                      {t(`landing.workflow.steps.${step.key}.description`)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ THE SOLUTION — 3 BEATS ═══════════════════════════ */}
      <section className="relative z-10 px-6 py-24 border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto">
          <p className="text-[11px] tracking-[0.25em] text-gray-600 uppercase mb-16 text-center">{t('landing.solution.label')}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {/* Beat 1 */}
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-2">
                <span className="text-indigo-400 text-lg font-light">1</span>
              </div>
              <h3 className="text-lg text-white font-medium">{t('landing.solution.beat1Title')}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                {t('landing.solution.beat1Text')}{' '}
                <span className="text-gray-300">{t('landing.solution.beat1Emphasis')}</span>
              </p>
            </div>

            {/* Beat 2 */}
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-2">
                <span className="text-indigo-400 text-lg font-light">2</span>
              </div>
              <h3 className="text-lg text-white font-medium">{t('landing.solution.beat2Title')}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                {t('landing.solution.beat2Text')}{' '}
                <span className="text-gray-300">{t('landing.solution.beat2Emphasis')}</span>
              </p>
            </div>

            {/* Beat 3 */}
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-2">
                <span className="text-indigo-400 text-lg font-light">3</span>
              </div>
              <h3 className="text-lg text-white font-medium">{t('landing.solution.beat3Title')}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                {t('landing.solution.beat3Text')}{' '}
                <span className="text-gray-300">{t('landing.solution.beat3Emphasis')} <code className="text-xs px-1.5 py-0.5 rounded bg-white/5 text-gray-300 font-mono">openssl</code>{t('landing.solution.beat3EmpSuffix')}</span>
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
              <p className="text-[11px] tracking-[0.2em] text-emerald-400/80 uppercase">{t('landing.audience.developers.label')}</p>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              {t('landing.audience.developers.text')}{' '}
              <code className="text-xs px-1.5 py-0.5 rounded bg-white/5 text-gray-300 font-mono">{t('landing.audience.developers.code')}</code>{' '}
              {t('landing.audience.developers.suffix')}
            </p>
          </div>

          {/* Compliance */}
          <div className="p-6 rounded-xl border border-white/[0.06] bg-white/[0.015]">
            <div className="flex items-center gap-3 mb-5">
              <Scale className="w-5 h-5 text-amber-400" />
              <p className="text-[11px] tracking-[0.2em] text-amber-400/80 uppercase">{t('landing.audience.compliance.label')}</p>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              {t('landing.audience.compliance.text')}
            </p>
          </div>

          {/* Leadership */}
          <div className="p-6 rounded-xl border border-white/[0.06] bg-white/[0.015]">
            <div className="flex items-center gap-3 mb-5">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              <p className="text-[11px] tracking-[0.2em] text-indigo-400/80 uppercase">{t('landing.audience.leadership.label')}</p>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              {t('landing.audience.leadership.text')} <span className="text-white">{t('landing.audience.leadership.emphasis')}</span>{t('landing.audience.leadership.suffix')}
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ BOTTOM CTA + FORM ═══════════════════════════ */}
      <section className="relative z-10 px-6 py-28 border-t border-white/[0.04]">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-light text-white mb-3">{t('landing.demo.title')}</h2>
          <p className="text-sm text-gray-500 mb-8">{t('landing.demo.subtitle')}</p>

          <form
            ref={formRef}
            onSubmit={handleDemoAccess}
            id="start"
            className="text-left space-y-3"
          >
            <input
              type="text"
              placeholder={t('landing.demo.namePlaceholder')}
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3.5 bg-white/[0.04] border border-white/10 rounded-lg text-white placeholder:text-gray-600 outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] transition-all text-sm"
            />
            <input
              type="email"
              placeholder={t('landing.demo.emailPlaceholder')}
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
                  {t('landing.demo.submitting')}
                </span>
              ) : (
                <>
                  {t('landing.demo.submitButton')}
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
            {t('landing.footer.tagline')}
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
