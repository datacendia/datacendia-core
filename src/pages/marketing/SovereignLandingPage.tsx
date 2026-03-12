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
import { ArrowRight, ArrowDown, Terminal, Scale, ShieldCheck, MessageCircle, Users, FileWarning, Fingerprint, Archive, FileCheck2, Shield, Lock, Award, ChevronDown, X, Check, Eye } from 'lucide-react';
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

const TRUST_BADGES = [
  { key: 'nvidia', icon: Award, color: 'text-green-400' },
  { key: 'openSource', icon: Terminal, color: 'text-sky-400' },
  { key: 'sovereign', icon: Shield, color: 'text-indigo-400' },
  { key: 'compliance', icon: Scale, color: 'text-amber-400' },
  { key: 'crypto', icon: Fingerprint, color: 'text-purple-400' },
  { key: 'zeroTrust', icon: Lock, color: 'text-rose-400' },
] as const;

const DIFF_ROWS = ['memory', 'dissent', 'proof', 'accountability', 'sovereignty'] as const;

const SovereignLandingPage: React.FC = () => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
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

      {/* ═══════════════════════════ SOCIAL PROOF STRIP ═══════════════════════════ */}
      <section className="relative z-10 px-6 py-16 border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto">
          <p className="text-[11px] tracking-[0.25em] text-gray-600 uppercase mb-10 text-center">{t('landing.socialProof.label')}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {TRUST_BADGES.map((badge) => {
              const Icon = badge.icon;
              return (
                <div key={badge.key} className="flex flex-col items-center gap-2.5 p-4 rounded-xl border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.03] transition-colors">
                  <Icon className={`w-5 h-5 ${badge.color} opacity-70`} />
                  <p className="text-[10px] text-gray-500 text-center leading-tight tracking-wide">
                    {t(`landing.socialProof.${badge.key}`)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ PLATFORM PREVIEW ═══════════════════════════ */}
      <section className="relative z-10 px-6 py-24 border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto">
          <p className="text-[11px] tracking-[0.25em] text-gray-600 uppercase mb-3 text-center">{t('landing.preview.label')}</p>
          <p className="text-sm text-gray-500 text-center mb-12 max-w-2xl mx-auto">{t('landing.preview.subtitle')}</p>

          {/* Preview mockup */}
          <div className="relative rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-white/[0.01] overflow-hidden">
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
              </div>
              <div className="flex-1 mx-4">
                <div className="mx-auto max-w-xs h-5 rounded bg-white/[0.04] flex items-center justify-center">
                  <span className="text-[10px] text-gray-600 font-mono">app.datacendia.com/cortex/council</span>
                </div>
              </div>
            </div>

            {/* Mockup content — Council deliberation */}
            <div className="p-6 sm:p-8 space-y-4">
              {/* Query bar */}
              <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-4">
                <p className="text-xs text-gray-600 mb-1.5 font-mono">QUERY</p>
                <p className="text-sm text-gray-300 italic">"Should we acquire TechVenture Inc. at the proposed $42M valuation given current market conditions?"</p>
              </div>

              {/* Agent responses grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-lg bg-white/[0.02] border border-emerald-500/10 p-3.5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-medium text-emerald-400 tracking-wide">CFO Agent</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono">CONDITIONAL</span>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-relaxed">Valuation is 15% above sector median. Recommend counter at $36M with earnout structure...</p>
                </div>
                <div className="rounded-lg bg-white/[0.02] border border-amber-500/10 p-3.5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-medium text-amber-400 tracking-wide">Legal Counsel</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono">CAUTION</span>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-relaxed">IP assignment clauses in target's employment contracts have gaps. Due diligence required...</p>
                </div>
                <div className="rounded-lg bg-white/[0.02] border border-rose-500/10 p-3.5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-medium text-rose-400 tracking-wide">Red Team</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 font-mono">DISSENT</span>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-relaxed">Market correction risk in Q3 makes timing unfavorable. 3 of 5 comparable acquisitions in this...</p>
                </div>
              </div>

              {/* Signature bar */}
              <div className="flex items-center justify-between rounded-lg bg-white/[0.02] border border-white/[0.06] px-4 py-2.5">
                <div className="flex items-center gap-3">
                  <Fingerprint className="w-3.5 h-3.5 text-purple-400/60" />
                  <span className="text-[10px] text-gray-600 font-mono">Ed25519 signed · Merkle root: 0x7a3f...e2c1 · RFC 3161 TS</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] text-green-500/70">SEALED</span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-gray-600 text-center mt-4 italic">{t('landing.preview.caption')}</p>

          <div className="flex justify-center mt-6">
            <button
              onClick={scrollToForm}
              className="group text-sm text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-2 transition-colors"
            >
              {t('landing.preview.cta')}
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ WHY NOT CHATGPT? ═══════════════════════════ */}
      <section className="relative z-10 px-6 py-24 border-t border-white/[0.04]">
        <div className="max-w-4xl mx-auto">
          <p className="text-[11px] tracking-[0.25em] text-gray-600 uppercase mb-3 text-center">{t('landing.differentiator.label')}</p>
          <p className="text-base sm:text-lg text-gray-400 text-center mb-12 font-light">{t('landing.differentiator.subtitle')}</p>

          {/* Comparison table */}
          <div className="rounded-2xl border border-white/[0.06] overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-[1fr_1fr_1fr] border-b border-white/[0.06] bg-white/[0.02]">
              <div className="px-4 sm:px-6 py-3">
                <span className="text-[10px] text-gray-600 tracking-wider uppercase">{t('landing.differentiator.colHeaders.dimension')}</span>
              </div>
              <div className="px-4 sm:px-6 py-3 border-l border-white/[0.06]">
                <span className="text-[10px] text-gray-600 tracking-wider uppercase">{t('landing.differentiator.colHeaders.chatgpt')}</span>
              </div>
              <div className="px-4 sm:px-6 py-3 border-l border-white/[0.06]">
                <span className="text-[10px] text-indigo-400/80 tracking-wider uppercase">{t('landing.differentiator.colHeaders.datacendia')}</span>
              </div>
            </div>

            {/* Rows */}
            {DIFF_ROWS.map((row, i) => (
              <div key={row} className={`grid grid-cols-[1fr_1fr_1fr] ${i < DIFF_ROWS.length - 1 ? 'border-b border-white/[0.04]' : ''}`}>
                <div className="px-4 sm:px-6 py-4 flex items-start">
                  <span className="text-xs text-gray-400 font-medium capitalize">{row}</span>
                </div>
                <div className="px-4 sm:px-6 py-4 border-l border-white/[0.04] flex items-start gap-2">
                  <X className="w-3.5 h-3.5 text-red-400/60 shrink-0 mt-0.5" />
                  <span className="text-xs text-gray-500">{t(`landing.differentiator.items.${row}.chatgpt`)}</span>
                </div>
                <div className="px-4 sm:px-6 py-4 border-l border-white/[0.04] bg-indigo-500/[0.02] flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-xs text-gray-300">{t(`landing.differentiator.items.${row}.datacendia`)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ FAQ ═══════════════════════════ */}
      <section className="relative z-10 px-6 py-24 border-t border-white/[0.04]">
        <div className="max-w-3xl mx-auto">
          <p className="text-[11px] tracking-[0.25em] text-gray-600 uppercase mb-12 text-center">{t('landing.faq.label')}</p>

          <div className="space-y-2">
            {(t('landing.faq.items') as unknown as Array<{ q: string; a: string }>)?.map?.((item: { q: string; a: string }, i: number) => (
              <div key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.01] overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/[0.02] transition-colors"
                >
                  <span className="text-sm text-gray-300 font-medium pr-4">{item.q}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-600 shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 pt-0">
                    <p className="text-sm text-gray-500 leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            )) || null}
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
          <div className="flex items-center gap-4">
            <a href="https://www.linkedin.com/company/datacendia" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-white transition-colors" aria-label="Datacendia on LinkedIn">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a href="https://github.com/datacendia" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-white transition-colors" aria-label="Datacendia on GitHub">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
            </a>
            <p className="text-[11px] text-gray-600 text-center sm:text-right leading-relaxed">
              {t('landing.footer.tagline')}
            </p>
          </div>
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
