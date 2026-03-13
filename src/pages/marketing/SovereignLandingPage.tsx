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
import { ArrowRight, ArrowDown, Terminal, Scale, ShieldCheck, MessageCircle, Users, FileWarning, Fingerprint, Archive, FileCheck2, Shield, Lock, Award, ChevronDown, X, Check, ExternalLink, Github } from 'lucide-react';
import { Logo } from '../../components/brand/Logo';
import { LanguageSwitcher } from '../../components/i18n/LanguageSwitcher';
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

const FAQ_KEYS = ['dataSafe', 'internet', 'llms', 'openSource', 'different', 'compliance', 'setup', 'verify'] as const;

const SovereignLandingPage: React.FC = () => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const ctaRef = useRef<HTMLElement>(null);
  const problemRef = useRef<HTMLElement>(null);

  const handleDemoAccess = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/v1/auth/demo-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Demo User', email: `demo-${Date.now()}@datacendia.com` }),
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
        setError(data.error?.message || t('landing.demo.genericError'));
        setIsSubmitting(false);
      }
    } catch {
      setError(t('landing.demo.connectionError'));
      setIsSubmitting(false);
    }
  };

  const scrollToCta = () => {
    ctaRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white antialiased selection:bg-indigo-900/30">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#09090b] via-[#0c0c10] to-[#09090b] pointer-events-none" />
      <div className="fixed inset-0 opacity-[0.015] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />

      {/* Nav */}
      <nav className="relative z-50 px-6 py-5 flex justify-between items-center max-w-6xl mx-auto">
        <Logo size="sm" />
        <div className="flex items-center gap-4">
          <LanguageSwitcher variant="compact" theme="dark" />
          <a
            href="https://github.com/datacendia/datacendia-core"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs tracking-widest text-gray-500 hover:text-white transition-colors hidden sm:inline-flex items-center gap-1.5"
          >
            <Github className="w-3.5 h-3.5" /> {t('landing.nav.github')}
          </a>
          <a
            href="/contact"
            className="text-xs tracking-widest text-gray-400 hover:text-white transition-colors border border-white/10 px-3 py-1.5 rounded hover:border-white/20"
          >
            {t('landing.nav.contactSales')}
          </a>
        </div>
      </nav>

      {/* ═══════════════════════════ HERO ═══════════════════════════ */}
      <section className="relative z-10 px-6 pt-16 sm:pt-24 pb-12 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left: Headline + CTAs */}
          <div>
            <p className="text-[11px] tracking-[0.25em] text-indigo-400/80 uppercase mb-6 font-mono">{t('landing.hero.label')}</p>
            <h1 className="text-3xl sm:text-4xl md:text-[2.75rem] font-medium leading-[1.15] mb-6 text-white">
              {t('landing.hero.headline')}
            </h1>
            <p className="text-base sm:text-lg text-gray-400 font-light leading-relaxed mb-8 max-w-xl">
              {t('landing.hero.subheadline')}
            </p>

            {/* Dual-Funnel CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 items-start mb-6">
              <a
                href="/contact"
                className="group px-7 py-3.5 bg-white text-black rounded-lg font-medium text-sm tracking-wide inline-flex items-center gap-2.5 hover:bg-gray-100 transition-all"
              >
                {t('landing.hero.ctaPrimary')}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
              <a
                href="https://github.com/datacendia/datacendia-core"
                target="_blank"
                rel="noopener noreferrer"
                className="group px-7 py-3.5 border border-white/10 text-gray-400 rounded-lg text-sm inline-flex items-center gap-2.5 hover:border-white/20 hover:text-gray-200 transition-all"
              >
                <Github className="w-4 h-4" />
                {t('landing.hero.ctaSecondary')}
                <ExternalLink className="w-3 h-3 opacity-50" />
              </a>
            </div>
            <p className="text-[11px] text-gray-600">{t('landing.hero.finePrint')}</p>
          </div>

          {/* Right: Regulator's Receipt Artifact */}
          <div className="rounded-xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-white/[0.01] overflow-hidden font-mono text-[11px] shadow-2xl shadow-indigo-500/5">
            <div className="bg-white/[0.03] border-b border-white/[0.06] px-4 py-2.5 flex items-center justify-between">
              <span className="text-[10px] text-gray-500 tracking-widest">{t('landing.receipt.header')}</span>
            </div>
            <div className="p-5 space-y-4">
              <div className="text-center border-b border-white/[0.06] pb-4">
                <p className="text-indigo-400 text-xs tracking-[0.2em] mb-1">DATACENDIA</p>
                <p className="text-white text-sm font-bold tracking-wider">{t('landing.receipt.title')}</p>
                <p className="text-gray-500 text-[10px] mt-1">{t('landing.receipt.subtitle')}</p>
              </div>
              <div className="space-y-1.5 text-gray-400">
                <div className="flex justify-between"><span className="text-gray-600">{t('landing.receipt.receiptId')}</span><span>RR-1771557046091-A4163C09</span></div>
                <div className="flex justify-between"><span className="text-gray-600">{t('landing.receipt.decisionDate')}</span><span>2026-02-19 04:21:42 UTC</span></div>
                <div className="flex justify-between"><span className="text-gray-600">{t('landing.receipt.compliance')}</span><span className="text-amber-400">SAR ALERT</span></div>
                <div className="flex justify-between"><span className="text-gray-600">{t('landing.receipt.confidence')}</span><span>82%</span></div>
                <div className="flex justify-between"><span className="text-gray-600">{t('landing.receipt.dissenting')}</span><span className="text-rose-400">2 (CRO, Red Team)</span></div>
              </div>
              <div className="border-t border-white/[0.06] pt-3 space-y-1.5">
                <p className="text-gray-500 text-[10px] tracking-wider mb-2">{t('landing.receipt.cryptoLabel')}</p>
                <div><span className="text-gray-600">{t('landing.receipt.hashLabel')}</span></div>
                <p className="text-indigo-300 break-all leading-relaxed">3151f4581206cdb67e0db6c0773810363152f98fb40c0bb28ac3b29292080dbf</p>
                <div className="mt-2"><span className="text-gray-600">{t('landing.receipt.sigLabel')}</span></div>
                <p className="text-emerald-400">{t('landing.receipt.sigValue')}</p>
                <p className="text-gray-500">Signed: 2026-02-20 03:10:46 UTC</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ TRUST BAR ═══════════════════════════ */}
      <section className="relative z-10 px-6 py-10 border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4">
            <div className="flex items-center gap-2 text-[11px] text-gray-500 tracking-wide">
              <Award className="w-4 h-4 text-green-400/70" />
              <span>{t('landing.trustBar.nvidia')}</span>
            </div>
            <span className="hidden sm:inline text-gray-700">|</span>
            <div className="flex items-center gap-2 text-[11px] text-gray-500 tracking-wide">
              <Scale className="w-4 h-4 text-amber-400/70" />
              <span>{t('landing.trustBar.compliance')}</span>
            </div>
            <span className="hidden sm:inline text-gray-700">|</span>
            <div className="flex items-center gap-2 text-[11px] text-gray-500 tracking-wide">
              <Shield className="w-4 h-4 text-indigo-400/70" />
              <span>{t('landing.trustBar.ddgi')}</span>
            </div>
            <span className="hidden sm:inline text-gray-700">|</span>
            <div className="flex items-center gap-2 text-[11px] text-gray-500 tracking-wide">
              <Terminal className="w-4 h-4 text-sky-400/70" />
              <span>{t('landing.trustBar.openSource')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ THE PROBLEM ═══════════════════════════ */}
      <section ref={problemRef} className="relative z-10 px-6 py-24 border-t border-white/[0.04]">
        <div className="max-w-3xl mx-auto">
          <p className="text-[11px] tracking-[0.25em] text-gray-400 uppercase mb-6">{t('landing.problem.label')}</p>
          <p className="text-lg sm:text-xl text-gray-300 font-light leading-relaxed">
            {t('landing.problem.text')}{' '}
            <span className="text-gray-500">{t('landing.problem.fade')}</span>
          </p>
        </div>
      </section>

      {/* ═══════════════════════════ WHAT IS DATACENDIA? ═══════════════════════════ */}
      <section className="relative z-10 px-6 py-24 border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto">
          <p className="text-[11px] tracking-[0.25em] text-gray-400 uppercase mb-16 text-center">{t('landing.whatIs.label')}</p>

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

      {/* ═══════════════════════════ KILL ROOM — DECISION ARCHITECTURE ═══════════════════════════ */}
      <section className="relative z-10 px-6 py-24 border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto">
          <p className="text-[11px] tracking-[0.25em] text-gray-400 uppercase mb-3 text-center">{t('landing.killRoom.label')}</p>
          <p className="text-sm text-gray-500 text-center mb-16">{t('landing.killRoom.subtitle')}</p>

          {/* Banking-style infrastructure diagram — Desktop */}
          <div className="hidden md:block">
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
              {/* Header bar */}
              <div className="bg-white/[0.03] border-b border-white/[0.06] px-6 py-3 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500/60" />
                <span className="text-[10px] text-gray-500 font-mono tracking-widest">{t('landing.killRoom.pipelineLabel')}</span>
              </div>

              {/* 4-stage flow */}
              <div className="grid grid-cols-4 divide-x divide-white/[0.06]">
                {/* Stage 1: Human Request */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded bg-sky-500/15 flex items-center justify-center">
                      <MessageCircle className="w-3.5 h-3.5 text-sky-400" />
                    </div>
                    <span className="text-[10px] text-gray-600 font-mono tracking-wider">{t('landing.killRoom.stage1.label')}</span>
                  </div>
                  <h4 className="text-sm font-medium text-sky-400">{t('landing.killRoom.stage1.title')}</h4>
                  <p className="text-[11px] text-gray-500 leading-relaxed">{t('landing.killRoom.stage1.desc')}</p>
                  <div className="pt-2 border-t border-white/[0.04]">
                    <span className="text-[9px] text-gray-600 font-mono">{t('landing.killRoom.stage1.meta')}</span>
                  </div>
                </div>

                {/* Stage 2: Adversarial Deliberation */}
                <div className="p-6 space-y-3 bg-white/[0.01]">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded bg-indigo-500/15 flex items-center justify-center">
                      <Users className="w-3.5 h-3.5 text-indigo-400" />
                    </div>
                    <span className="text-[10px] text-gray-600 font-mono tracking-wider">{t('landing.killRoom.stage2.label')}</span>
                  </div>
                  <h4 className="text-sm font-medium text-indigo-400">{t('landing.killRoom.stage2.title')}</h4>
                  <p className="text-[11px] text-gray-500 leading-relaxed">{t('landing.killRoom.stage2.desc')}</p>
                  <div className="pt-2 border-t border-white/[0.04] space-y-1">
                    <span className="text-[9px] text-gray-600 font-mono block">{t('landing.killRoom.stage2.meta1')}</span>
                    <span className="text-[9px] text-amber-400/70 font-mono block">{t('landing.killRoom.stage2.meta2')}</span>
                  </div>
                </div>

                {/* Stage 3: Human Override */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded bg-amber-500/15 flex items-center justify-center">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <span className="text-[10px] text-gray-600 font-mono tracking-wider">{t('landing.killRoom.stage3.label')}</span>
                  </div>
                  <h4 className="text-sm font-medium text-amber-400">{t('landing.killRoom.stage3.title')}</h4>
                  <p className="text-[11px] text-gray-500 leading-relaxed">{t('landing.killRoom.stage3.desc')}</p>
                  <div className="pt-2 border-t border-white/[0.04]">
                    <span className="text-[9px] text-gray-600 font-mono">{t('landing.killRoom.stage3.meta')}</span>
                  </div>
                </div>

                {/* Stage 4: Cryptographic Seal */}
                <div className="p-6 space-y-3 bg-white/[0.01]">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded bg-emerald-500/15 flex items-center justify-center">
                      <Fingerprint className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <span className="text-[10px] text-gray-600 font-mono tracking-wider">{t('landing.killRoom.stage4.label')}</span>
                  </div>
                  <h4 className="text-sm font-medium text-emerald-400">{t('landing.killRoom.stage4.title')}</h4>
                  <p className="text-[11px] text-gray-500 leading-relaxed">{t('landing.killRoom.stage4.desc')}</p>
                  <div className="pt-2 border-t border-white/[0.04] space-y-1">
                    <span className="text-[9px] text-gray-600 font-mono block">{t('landing.killRoom.stage4.meta1')}</span>
                    <span className="text-[9px] text-emerald-400/70 font-mono block">{t('landing.killRoom.stage4.meta2')}</span>
                  </div>
                </div>
              </div>

              {/* Bottom pipeline connector */}
              <div className="bg-white/[0.02] border-t border-white/[0.06] px-6 py-2.5 flex items-center justify-between">
                <span className="text-[9px] text-gray-600 font-mono">{t('landing.killRoom.pipelineFlow')}</span>
                <span className="text-[9px] text-emerald-400/60 font-mono">{t('landing.killRoom.pipelineAudit')}</span>
              </div>
            </div>
          </div>

          {/* Mobile: vertical pipeline */}
          <div className="md:hidden space-y-0">
            {[
              { stage: '01', key: 'stage1', icon: MessageCircle, color: 'text-sky-400', bg: 'bg-sky-500/15' },
              { stage: '02', key: 'stage2', icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-500/15' },
              { stage: '03', key: 'stage3', icon: ShieldCheck, color: 'text-amber-400', bg: 'bg-amber-500/15' },
              { stage: '04', key: 'stage4', icon: Fingerprint, color: 'text-emerald-400', bg: 'bg-emerald-500/15' },
            ].map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.stage} className="relative flex gap-5">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded ${step.bg} flex items-center justify-center shrink-0`}>
                      <Icon className={`w-4.5 h-4.5 ${step.color}`} />
                    </div>
                    {i < 3 && <div className="w-px flex-1 bg-gradient-to-b from-white/10 to-transparent min-h-[2rem]" />}
                  </div>
                  <div className="pb-8 pt-1.5">
                    <span className="text-[10px] text-gray-600 font-mono">{t(`landing.killRoom.${step.key}.label`)}</span>
                    <h4 className={`text-sm font-medium ${step.color} mb-1`}>{t(`landing.killRoom.${step.key}.title`)}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed max-w-sm">{t(`landing.killRoom.${step.key}.desc`)}                    </p>
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
          <p className="text-[11px] tracking-[0.25em] text-gray-400 uppercase mb-16 text-center">{t('landing.solution.label')}</p>

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

      {/* ═══════════════════════════ COSS PRICING ANCHOR ═══════════════════════════ */}
      <section className="relative z-10 px-6 py-24 border-t border-white/[0.04]">
        <div className="max-w-4xl mx-auto">
          <p className="text-[11px] tracking-[0.25em] text-gray-400 uppercase mb-3 text-center">{t('landing.pricing.label')}</p>
          <p className="text-sm text-gray-500 text-center mb-16">{t('landing.pricing.subtitle')}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Community Edition */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 space-y-5">
              <div className="flex items-center gap-3">
                <Terminal className="w-5 h-5 text-sky-400" />
                <h3 className="text-lg font-medium text-white">{t('landing.pricing.community.title')}</h3>
              </div>
              <p className="text-2xl font-light text-white">{t('landing.pricing.community.price')}</p>
              <p className="text-[11px] text-gray-500 tracking-wide">{t('landing.pricing.community.license')}</p>
              <ul className="space-y-2.5 text-sm text-gray-400">
                <li className="flex items-start gap-2.5"><Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> {t('landing.pricing.community.f1')}</li>
                <li className="flex items-start gap-2.5"><Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> {t('landing.pricing.community.f2')}</li>
                <li className="flex items-start gap-2.5"><Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> {t('landing.pricing.community.f3')}</li>
                <li className="flex items-start gap-2.5"><Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> {t('landing.pricing.community.f4')}</li>
                <li className="flex items-start gap-2.5"><Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> {t('landing.pricing.community.f5')}</li>
              </ul>
              <a
                href="https://github.com/datacendia/datacendia-core"
                target="_blank"
                rel="noopener noreferrer"
                className="group w-full px-6 py-3 border border-white/10 text-gray-300 rounded-lg text-sm inline-flex items-center justify-center gap-2.5 hover:border-white/20 hover:text-white transition-all"
              >
                <Github className="w-4 h-4" />
                {t('landing.pricing.community.cta')}
                <ExternalLink className="w-3 h-3 opacity-50" />
              </a>
            </div>

            {/* Enterprise Edition */}
            <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/[0.03] p-8 space-y-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 px-3 py-1 bg-indigo-500/20 text-indigo-300 text-[10px] tracking-wider font-mono rounded-bl-lg">{t('landing.pricing.enterprise.badge')}</div>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-medium text-white">{t('landing.pricing.enterprise.title')}</h3>
              </div>
              <p className="text-2xl font-light text-white">{t('landing.pricing.enterprise.price')}</p>
              <p className="text-[11px] text-gray-500 tracking-wide">{t('landing.pricing.enterprise.license')}</p>
              <ul className="space-y-2.5 text-sm text-gray-400">
                <li className="flex items-start gap-2.5"><Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" /> {t('landing.pricing.enterprise.f1')}</li>
                <li className="flex items-start gap-2.5"><Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" /> {t('landing.pricing.enterprise.f2')}</li>
                <li className="flex items-start gap-2.5"><Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" /> {t('landing.pricing.enterprise.f3')}</li>
                <li className="flex items-start gap-2.5"><Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" /> {t('landing.pricing.enterprise.f4')}</li>
                <li className="flex items-start gap-2.5"><Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" /> {t('landing.pricing.enterprise.f5')}</li>
                <li className="flex items-start gap-2.5"><Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" /> {t('landing.pricing.enterprise.f6')}</li>
              </ul>
              <a
                href="/contact"
                className="group w-full px-6 py-3 bg-indigo-600 text-white rounded-lg text-sm font-medium inline-flex items-center justify-center gap-2.5 hover:bg-indigo-500 transition-all"
              >
                {t('landing.pricing.enterprise.cta')}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ PLATFORM PREVIEW ═══════════════════════════ */}
      <section className="relative z-10 px-6 py-24 border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto">
          <p className="text-[11px] tracking-[0.25em] text-gray-400 uppercase mb-3 text-center">{t('landing.preview.label')}</p>
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
                  <span className="text-[10px] text-gray-600 font-mono">Ed25519 signed · Merkle tree hashed · RFC 3161 timestamped</span>
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
              onClick={scrollToCta}
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
          <p className="text-[11px] tracking-[0.25em] text-gray-400 uppercase mb-3 text-center">{t('landing.differentiator.label')}</p>
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
          <p className="text-[11px] tracking-[0.25em] text-gray-400 uppercase mb-12 text-center">{t('landing.faq.label')}</p>

          <div className="space-y-2">
            {FAQ_KEYS.map((key, i) => (
              <div key={key} className="rounded-xl border border-white/[0.06] bg-white/[0.01] overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/[0.02] transition-colors"
                >
                  <span className="text-sm text-gray-300 font-medium pr-4">{t(`landing.faq.${key}.q`)}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 pt-0">
                    <p className="text-sm text-gray-400 leading-relaxed">{t(`landing.faq.${key}.a`)}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ BOTTOM CTA ═══════════════════════════ */}
      <section ref={ctaRef} className="relative z-10 px-6 py-28 border-t border-white/[0.04]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-medium text-white mb-3">{t('landing.bottomCta.title')}</h2>
          <p className="text-sm text-gray-500 mb-10">{t('landing.bottomCta.subtitle')}</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/contact"
              className="group px-10 py-4 bg-white text-black rounded-lg font-medium text-sm tracking-wide inline-flex items-center gap-3 hover:bg-gray-100 transition-all"
            >
              {t('landing.bottomCta.ctaPrimary')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
            <button
              onClick={handleDemoAccess}
              disabled={isSubmitting}
              className="group px-8 py-4 border border-white/10 text-gray-300 rounded-lg text-sm inline-flex items-center gap-3 hover:border-white/20 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin" />
                  {t('landing.bottomCta.submitting')}
                </span>
              ) : (
                <>
                  {t('landing.bottomCta.ctaSecondary')}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </div>
          {error && (
            <p className="text-red-400 text-xs text-center mt-4">{error}</p>
          )}
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
