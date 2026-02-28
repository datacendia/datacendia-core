// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../../components/brand/Logo';
import {
  Shield,
  Brain,
  Globe,
  Zap,
  Users,
  Lock,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Menu,
  X,
  Database,
  Activity,
  Eye,
  Scale,
  MessageSquare,
  BarChart3,
  Play,
  FileText,
  Monitor,
  Cpu,
  Layers,
  Briefcase,
  Bot,
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeRegion, setActiveRegion] = useState('US');

  const regions: Record<string, { label: string; symbol: string; multiplier: number }> = {
    US: { label: 'United States', symbol: '$', multiplier: 1 },
    EU: { label: 'Europe', symbol: '€', multiplier: 0.9 },
    LATAM: { label: 'Latin America', symbol: '$', multiplier: 0.4 },
    ASIA: { label: 'Asia', symbol: '$', multiplier: 0.6 },
  };

  const pricing: Record<string, Record<string, string>> = {
    foundation: { US: '$150K', EU: '€138K', LATAM: '$83K', ASIA: '$113K' },
    enterprise: { US: '$500K', EU: '€460K', LATAM: '$275K', ASIA: '$375K' },
    strategic: { US: '$2M+', EU: '€1.8M+', LATAM: '$1.1M+', ASIA: '$1.5M+' },
  };

  const [showVideo, setShowVideo] = useState(false);

  const pillars = [
    {
      name: 'CendiaLineage™',
      icon: Database,
      desc: 'Memory & Truth',
      path: '/cortex/pillars/lineage',
    },
    { name: 'CendiaGuard™', icon: Shield, desc: 'Immune System', path: '/cortex/pillars/guard' },
    {
      name: 'CendiaHelm™',
      icon: MessageSquare,
      desc: 'Voice Interface',
      path: '/cortex/pillars/helm',
    },
    { name: 'CendiaMetrics™', icon: BarChart3, desc: 'The Pulse', path: '/cortex/pulse' },
    {
      name: 'CendiaHealth™',
      icon: Activity,
      desc: 'Nervous System',
      path: '/cortex/pillars/health',
    },
    { name: 'CendiaPredict™', icon: Eye, desc: 'Imagination', path: '/cortex/pillars/predict' },
    { name: 'CendiaEthics™', icon: Scale, desc: 'Conscience', path: '/cortex/pillars/ethics' },
    { name: 'CendiaFlow™', icon: Zap, desc: 'Hands & Action', path: '/cortex/pillars/flow' },
  ];

  return (
    <div className="min-h-screen bg-black text-slate-200 font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center">
              <Logo size="lg" />
            </Link>

            <div className="hidden md:block">
              <div className="flex items-baseline space-x-8">
                <a
                  href="#philosophy"
                  className="hover:text-white transition-colors text-sm font-medium"
                >
                  Philosophy
                </a>
                <a
                  href="#cortex"
                  className="hover:text-white transition-colors text-sm font-medium"
                >
                  The Cortex
                </a>
                <Link
                  to="/apex/forecast"
                  className="hover:text-white transition-colors text-sm font-medium"
                >
                  Services
                </Link>
                <a
                  href="#pricing"
                  className="hover:text-white transition-colors text-sm font-medium"
                >
                  Pricing
                </a>
                <Link
                  to="/contact"
                  className="hover:text-white transition-colors text-sm font-medium"
                >
                  Contact
                </Link>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <Link 
                to="/login" 
                className="text-sm font-medium hover:text-white border border-white/30 hover:border-white/60 px-4 py-2 rounded transition-all"
              >
                Sign In
              </Link>
              <Link
                to="/demo"
                className="bg-white text-black hover:bg-amber-400 hover:text-black transition-all px-5 py-2.5 rounded font-bold text-sm flex items-center gap-2"
              >
                Get Started <ArrowRight size={16} />
              </Link>
            </div>

            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-400 hover:text-white p-2"
              >
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-slate-900 border-b border-white/10">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a
                href="#philosophy"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10"
              >
                Philosophy
              </a>
              <a
                href="#cortex"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10"
              >
                The Cortex
              </a>
              <a
                href="#pricing"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10"
              >
                Pricing
              </a>
              <Link
                to="/apex/forecast"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10"
              >
                Services
              </Link>
              <Link
                to="/contact"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10"
              >
                Contact
              </Link>
              <Link
                to="/about"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10"
              >
                About
              </Link>
              <div className="border-t border-white/10 mt-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10"
                >
                  Login
                </Link>
                <Link
                  to="/demo"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium bg-amber-500 text-black mt-2"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-500/20 blur-[120px] rounded-full mix-blend-screen" />
          <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-purple-500/10 blur-[100px] rounded-full mix-blend-screen" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur mb-4">
            <span className="flex h-2 w-2 rounded-full bg-amber-500"></span>
            <span className="text-xs font-mono text-amber-200 uppercase tracking-widest">
              Sovereign Enterprise Intelligence Platform
            </span>
          </div>

          <p className="text-[10px] text-slate-500 uppercase tracking-[0.3em] mb-6">
            Datacendia is a Sovereign Enterprise Intelligence Platform
          </p>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white tracking-tight mb-8 leading-[1.1]">
            The mind your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-amber-200 to-purple-400">
              enterprise deserves.
            </span>
          </h1>

          <p className="mt-6 max-w-3xl mx-auto text-xl md:text-2xl text-slate-400 font-light leading-relaxed">
            A governed decision layer that runs on your infrastructure, replays any moment in time,
            and proves why you made each decision.
          </p>

          <p className="mt-4 max-w-xl mx-auto text-base text-slate-500 italic">
            "We do not host your data. We return your mind."
          </p>

          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate('/demo')}
              className="bg-amber-500 hover:bg-amber-400 text-black px-8 py-4 rounded font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)]"
            >
              Request Early Access <ArrowRight size={20} />
            </button>
            <button
              onClick={() => setShowVideo(true)}
              className="group border border-white/20 hover:border-white text-white px-8 py-4 rounded font-medium text-lg transition-all flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 backdrop-blur-sm"
            >
              <Play size={20} className="fill-white group-hover:scale-110 transition-transform" />{' '}
              Watch the Demo
            </button>
          </div>

          <div className="mt-16 pt-8 border-t border-white/5 flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {['FINANCE', 'HEALTHCARE', 'GOVERNMENT', 'MANUFACTURING'].map((sector) => (
              <span key={sector} className="text-sm font-mono font-bold tracking-widest">
                {sector} READY
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* The Philosophy / Pillars */}
      <section id="philosophy" className="py-24 bg-slate-950 relative border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
              Architecture as Philosophy
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Not just features. Organs of a living intelligence system.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {pillars.map((pillar, i) => (
              <Link
                key={i}
                to={pillar.path}
                className="group p-6 bg-black border border-white/10 hover:border-amber-500/50 hover:bg-white/5 transition-all rounded-lg cursor-pointer relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <pillar.icon className="w-8 h-8 text-slate-500 group-hover:text-amber-500 mb-4 transition-colors" />
                <h3 className="text-lg font-bold text-white font-mono mb-1">{pillar.name}</h3>
                <p className="text-xs text-amber-500 uppercase tracking-wider font-bold mb-2">
                  {pillar.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* The Council Preview */}
      <section id="cortex" className="py-24 bg-black overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-900/10 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div className="mb-12 lg:mb-0">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-6">
                <Users size={12} /> THE PANTHEON
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight">
                Don't just ask AI.
                <br />
                <span className="text-blue-400">Convene a Council.</span>
              </h2>
              <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                When you ask a strategic question, Datacendia doesn't just guess. It convenes
                specialized AI agents—your CFO, COO, CISO, and Ethics Officer—to deliberate, debate,
                and verify before answering.
              </p>

              <ul className="space-y-4 mb-8">
                {[
                  'Multi-agent debate protocols',
                  'Blocking concerns (e.g., Security vetos)',
                  'Full reasoning lineage',
                  'Ethical guardrails built-in',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300">
                    <CheckCircle2 size={18} className="text-blue-500" /> {item}
                  </li>
                ))}
              </ul>

              <Link
                to="/cortex/council"
                className="text-white border-b border-amber-500 hover:text-amber-500 pb-1 transition-colors font-mono text-sm"
              >
                MEET THE AGENTS →
              </Link>
            </div>

            <div className="relative">
              {/* Abstract representation of the Council UI */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl shadow-blue-900/20">
                <div className="bg-slate-950 p-4 border-b border-slate-800 flex justify-between items-center">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/20" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                    <div className="w-3 h-3 rounded-full bg-green-500/20" />
                  </div>
                  <div className="text-xs font-mono text-slate-500">SESSION: STRAT_001</div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-slate-800 rounded flex items-center justify-center text-xs text-slate-400">
                      USR
                    </div>
                    <div className="bg-slate-800/50 p-3 rounded text-sm text-slate-300 w-full">
                      Should we acquire Competitor X?
                    </div>
                  </div>

                  {/* Agent Response 1 */}
                  <div className="flex gap-4 pl-4 border-l-2 border-emerald-500/20">
                    <div className="w-8 h-8 bg-emerald-900/20 rounded flex items-center justify-center text-[10px] font-bold text-emerald-500 border border-emerald-500/30">
                      CFO
                    </div>
                    <div className="bg-emerald-950/10 p-3 rounded text-sm text-slate-400 w-full border border-emerald-900/20">
                      <span className="text-emerald-500 text-xs font-bold block mb-1">
                        FINANCIAL ANALYSIS
                      </span>
                      Cash reserves sufficient. However, ROI projection assumes 15% synergy which
                      lacks historical precedent.
                    </div>
                  </div>

                  {/* Agent Response 2 */}
                  <div className="flex gap-4 pl-4 border-l-2 border-red-500/20">
                    <div className="w-8 h-8 bg-red-900/20 rounded flex items-center justify-center text-[10px] font-bold text-red-500 border border-red-500/30">
                      SEC
                    </div>
                    <div className="bg-red-950/10 p-3 rounded text-sm text-slate-400 w-full border border-red-900/20">
                      <span className="text-red-500 text-xs font-bold block mb-1">
                        SECURITY ALERT
                      </span>
                      Competitor X has documented unpatched legacy systems. Integration poses
                      significant risk to our ISO 27001 status.
                    </div>
                  </div>

                  {/* Synthesis */}
                  <div className="flex gap-4 mt-4">
                    <div className="w-8 h-8 bg-amber-900/20 rounded flex items-center justify-center text-[10px] font-bold text-amber-500 border border-amber-500/30">
                      HQ
                    </div>
                    <div className="bg-amber-950/10 p-3 rounded text-sm text-white w-full border border-amber-900/20">
                      <span className="text-amber-500 text-xs font-bold block mb-1">
                        RECOMMENDATION: HOLD
                      </span>
                      Due to security risks flagged by CISO, we cannot proceed until a full
                      technical audit is performed.
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-6 -right-6 bg-slate-800 border border-slate-700 p-4 rounded-lg shadow-xl flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="font-mono text-xs text-slate-300">8 AGENTS ONLINE</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform in Action — Product Screenshots / Demo Mockups */}
      <section className="py-24 bg-slate-950 border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-purple-900/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur mb-4">
              <Monitor size={12} className="text-amber-400" />
              <span className="text-xs font-mono text-amber-200 uppercase tracking-widest">
                Platform in Action
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
              See the Platform. Not Just the Promise.
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Regulated industries need proof before commitment. Here's what your team will actually use.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* DCII Dashboard */}
            <div className="group bg-black border border-white/10 hover:border-amber-500/40 rounded-xl overflow-hidden transition-all">
              <div className="bg-slate-900 p-3 border-b border-white/10 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/30" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/30" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/30" />
                </div>
                <span className="text-[10px] font-mono text-slate-500 ml-2">DCII Dashboard</span>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex gap-1 mb-3">
                  {['IISS', 'Media Auth', 'Jurisdiction', 'Timestamps', 'Similarity', 'Bias'].map((tab) => (
                    <span key={tab} className="px-2 py-1 text-[9px] font-mono rounded bg-slate-800 text-slate-400 border border-slate-700">
                      {tab}
                    </span>
                  ))}
                </div>
                <div className="bg-slate-800/50 rounded p-3 border border-slate-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-amber-400">IISS SCORE</span>
                    <span className="text-lg font-bold text-white font-mono">847</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-amber-500 to-green-500 h-2 rounded-full" style={{ width: '84.7%' }} />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-[9px] text-slate-500">0</span>
                    <span className="text-[9px] text-green-400">Excellent</span>
                    <span className="text-[9px] text-slate-500">1000</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Primitives', val: '9/9' },
                    { label: 'Evidence', val: '142' },
                    { label: 'Compliance', val: '100%' },
                  ].map((m) => (
                    <div key={m.label} className="bg-slate-800/30 rounded p-2 text-center border border-slate-700/30">
                      <div className="text-xs font-bold text-white font-mono">{m.val}</div>
                      <div className="text-[9px] text-slate-500">{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="px-5 pb-5">
                <h3 className="text-base font-bold text-white mb-1">DCII Dashboard</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  6-tab governance dashboard with IISS scoring, media authentication, jurisdiction mapping, and cognitive bias detection — all backed by real services.
                </p>
                <Link to="/cortex/dcii" className="text-xs text-amber-500 hover:text-amber-400 mt-2 inline-block font-mono">
                  EXPLORE DCII →
                </Link>
              </div>
            </div>

            {/* Mission Control */}
            <div className="group bg-black border border-white/10 hover:border-blue-500/40 rounded-xl overflow-hidden transition-all">
              <div className="bg-slate-900 p-3 border-b border-white/10 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/30" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/30" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/30" />
                </div>
                <span className="text-[10px] font-mono text-slate-500 ml-2">Mission Control</span>
              </div>
              <div className="p-5 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Services Online', val: '47/47', color: 'text-green-400' },
                    { label: 'Active Users', val: '1,284', color: 'text-blue-400' },
                    { label: 'Decisions/hr', val: '342', color: 'text-amber-400' },
                    { label: 'Uptime', val: '99.97%', color: 'text-emerald-400' },
                  ].map((m) => (
                    <div key={m.label} className="bg-slate-800/50 rounded p-2 border border-slate-700/50">
                      <div className={`text-sm font-bold font-mono ${m.color}`}>{m.val}</div>
                      <div className="text-[9px] text-slate-500">{m.label}</div>
                    </div>
                  ))}
                </div>
                <div className="bg-slate-800/30 rounded p-3 border border-slate-700/30">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-mono text-slate-400">LIVE FEED</span>
                  </div>
                  {[
                    { time: '14:32:01', msg: 'Council session STRAT_047 completed' },
                    { time: '14:31:45', msg: 'IISS score recalculated: 847 → 852' },
                    { time: '14:31:12', msg: 'Regulator receipt generated: RC-2847' },
                  ].map((e, i) => (
                    <div key={i} className="flex gap-2 text-[10px] py-0.5">
                      <span className="text-slate-600 font-mono">{e.time}</span>
                      <span className="text-slate-400">{e.msg}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="px-5 pb-5">
                <h3 className="text-base font-bold text-white mb-1">Mission Control</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Real-time operational dashboard — 47 services, live event feeds, health metrics, and service topology. Your single pane of glass.
                </p>
                <Link to="/cortex/mission-control" className="text-xs text-blue-400 hover:text-blue-300 mt-2 inline-block font-mono">
                  VIEW MISSION CONTROL →
                </Link>
              </div>
            </div>

            {/* Regulator's Receipt */}
            <div className="group bg-black border border-white/10 hover:border-emerald-500/40 rounded-xl overflow-hidden transition-all">
              <div className="bg-slate-900 p-3 border-b border-white/10 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/30" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/30" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/30" />
                </div>
                <span className="text-[10px] font-mono text-slate-500 ml-2">Regulator's Receipt</span>
              </div>
              <div className="p-5 space-y-3">
                <div className="bg-slate-800/50 rounded p-3 border border-emerald-900/30">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText size={14} className="text-emerald-400" />
                    <span className="text-[10px] font-mono text-emerald-400">COURT-ADMISSIBLE PDF</span>
                  </div>
                  <div className="space-y-2 text-[10px]">
                    {[
                      { label: 'Merkle Root', val: '0x7f3a...c829' },
                      { label: 'IISS Score', val: '847 / 1000' },
                      { label: 'Compliance', val: 'SOX, GDPR, ISO 27001' },
                      { label: 'Digital Sig', val: 'SHA-256 + Timestamp' },
                      { label: 'Evidence Chain', val: '14 linked artifacts' },
                    ].map((r) => (
                      <div key={r.label} className="flex justify-between">
                        <span className="text-slate-500">{r.label}</span>
                        <span className="text-white font-mono">{r.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 px-1">
                  <Shield size={12} className="text-emerald-500" />
                  <span className="text-[10px] text-emerald-400">Tamper-proof evidence chain</span>
                </div>
              </div>
              <div className="px-5 pb-5">
                <h3 className="text-base font-bold text-white mb-1">Regulator's Receipt</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  1-click court-admissible PDFs with Merkle trees, IISS scores, digital signatures, compliance mappings, and full evidence chains.
                </p>
                <Link to="/cortex/dcii" className="text-xs text-emerald-400 hover:text-emerald-300 mt-2 inline-block font-mono">
                  SEE THE RECEIPT →
                </Link>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => navigate('/demo')}
              className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 rounded hover:bg-white/5 text-sm text-white transition-all"
            >
              <Play size={16} /> Request a Live Walkthrough
            </button>
          </div>
        </div>
      </section>

      {/* Why Datacendia — Hidden Differentiators */}
      <section className="py-24 bg-black relative border-t border-white/5">
        <div className="absolute bottom-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-900/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
              What No Other Platform Can Do
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              These aren't features on a roadmap. They're shipping today.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Multi-Model Architecture */}
            <div className="group p-6 bg-slate-900/50 border border-white/10 hover:border-purple-500/40 rounded-xl transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-purple-900/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
                  <Cpu size={24} className="text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">8-Slot Multi-Model Architecture</h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-3">
                    Not one generic LLM — 8 purpose-built AI models working in concert. Dedicated reasoning,
                    coding, vision, embedding, guard, and creative models, each selected for its task.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['Reasoning', 'Coder', 'Vision', 'Embedding', 'Guard', 'Creative', 'Fast', 'Specialist'].map((slot) => (
                      <span key={slot} className="px-2 py-0.5 text-[10px] font-mono bg-purple-900/20 text-purple-300 border border-purple-800/30 rounded">
                        {slot}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* CendiaOps — 19 Department Co-Pilots */}
            <div className="group p-6 bg-slate-900/50 border border-white/10 hover:border-blue-500/40 rounded-xl transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-900/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                  <Bot size={24} className="text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">CendiaOps — 19 Department Co-Pilots</h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-3">
                    Every department gets a purpose-built AI co-pilot: Finance, Legal, HR, Procurement, IT,
                    Marketing, Sales, and 12 more. Each understands your org's context and governance rules.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['Finance', 'Legal', 'HR', 'IT', 'Procurement', 'Sales', 'Marketing', '+12 more'].map((dept) => (
                      <span key={dept} className="px-2 py-0.5 text-[10px] font-mono bg-blue-900/20 text-blue-300 border border-blue-800/30 rounded">
                        {dept}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Tiered Licensing */}
            <div className="group p-6 bg-slate-900/50 border border-white/10 hover:border-amber-500/40 rounded-xl transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-amber-900/20 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
                  <Layers size={24} className="text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Tiered License Gating</h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-3">
                    Start with a $50K pilot. Unlock capabilities as you grow. Automatic model access control
                    with graceful downgrade — no vendor lock-in, no surprise bills.
                  </p>
                  <div className="flex gap-3 items-center">
                    {[
                      { tier: 'Pilot', color: 'border-slate-600 text-slate-400' },
                      { tier: 'Foundation', color: 'border-white/30 text-white' },
                      { tier: 'Enterprise', color: 'border-amber-500/50 text-amber-300' },
                      { tier: 'Sovereign', color: 'border-red-500/50 text-red-300' },
                    ].map((t, i) => (
                      <div key={t.tier} className="flex items-center gap-1">
                        {i > 0 && <ArrowRight size={10} className="text-slate-600" />}
                        <span className={`px-2 py-0.5 text-[10px] font-mono border rounded ${t.color}`}>
                          {t.tier}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 11 Sovereign Patterns */}
            <div className="group p-6 bg-slate-900/50 border border-white/10 hover:border-red-500/40 rounded-xl transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-red-900/20 border border-red-500/30 flex items-center justify-center flex-shrink-0">
                  <Lock size={24} className="text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">11 Sovereign Architectural Patterns</h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-3">
                    Air-gapped, on-premise, federated mesh, data diode ingest, local RLHF, TPM attestation,
                    and post-quantum KMS. Your data never touches our infrastructure.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['Air-Gap', 'On-Prem', 'Federated Mesh', 'Data Diode', 'Local RLHF', 'TPM'].map((p) => (
                      <span key={p} className="px-2 py-0.5 text-[10px] font-mono bg-red-900/20 text-red-300 border border-red-800/30 rounded">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-slate-950 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
              Sovereign Pricing
            </h2>
            <p className="text-slate-400 mb-8">
              Fair, regional pricing accessible to everyone. 16 Languages included.
            </p>

            {/* Region Toggle */}
            <div className="inline-flex bg-black border border-white/10 rounded-lg p-1">
              {Object.keys(regions).map((r) => (
                <button
                  key={r}
                  onClick={() => setActiveRegion(r)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeRegion === r
                      ? 'bg-white text-black shadow-lg'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Foundation */}
            <div className="bg-black border border-white/10 p-8 rounded-xl hover:border-white/20 transition-all flex flex-col">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-white">Foundation</h3>
                <p className="text-slate-500 text-sm">Make decisions → Understand → Prove</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">
                  {pricing.foundation[activeRegion]}
                </span>
                <span className="text-slate-500">/yr</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex gap-2 text-sm text-slate-300">
                  <CheckCircle2 size={16} className="text-slate-500" /> THE COUNCIL — 15 C-Suite AI agents
                </li>
                <li className="flex gap-2 text-sm text-slate-300">
                  <CheckCircle2 size={16} className="text-slate-500" /> DECIDE — Pre-Mortem, Ghost Board, Chronos
                </li>
                <li className="flex gap-2 text-sm text-slate-300">
                  <CheckCircle2 size={16} className="text-slate-500" /> DCII — 9 Primitives, Evidence Vault
                </li>
                <li className="flex gap-2 text-sm text-slate-300">
                  <CheckCircle2 size={16} className="text-slate-500" /> $50K pilot available (90 days)
                </li>
              </ul>
              <button
                onClick={() => navigate('/pricing')}
                className="w-full py-3 border border-white/20 rounded hover:bg-white hover:text-black transition-colors font-medium"
              >
                Start Foundation Pilot
              </button>
            </div>

            {/* Enterprise */}
            <div className="bg-slate-900 border border-amber-500/50 p-8 rounded-xl relative flex flex-col shadow-[0_0_30px_rgba(245,158,11,0.1)]">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                MOST POPULAR
              </div>
              <div className="mb-4">
                <h3 className="text-xl font-bold text-white">Enterprise</h3>
                <p className="text-slate-400 text-sm">Harden, automate, and scale</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">
                  {pricing.enterprise[activeRegion]}
                </span>
                <span className="text-slate-500">/yr</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex gap-2 text-sm text-white">
                  <CheckCircle2 size={16} className="text-amber-500" /> All Foundation pillars
                </li>
                <li className="flex gap-2 text-sm text-white">
                  <CheckCircle2 size={16} className="text-amber-500" /> Stress-Test, Comply, Govern
                </li>
                <li className="flex gap-2 text-sm text-white">
                  <CheckCircle2 size={16} className="text-amber-500" /> Sovereign deploy & 19 co-pilots
                </li>
                <li className="flex gap-2 text-sm text-white">
                  <CheckCircle2 size={16} className="text-amber-500" /> SSO, dedicated success manager
                </li>
              </ul>
              <button
                onClick={() => navigate('/pricing')}
                className="w-full py-3 bg-amber-500 rounded hover:bg-amber-400 text-black font-bold transition-colors"
              >
                Contact Sales
              </button>
            </div>

            {/* Strategic */}
            <div className="bg-black border border-white/10 p-8 rounded-xl hover:border-white/20 transition-all flex flex-col">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-white">Strategic</h3>
                <p className="text-slate-500 text-sm">From enterprise tool to strategic weapon</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">
                  {pricing.strategic[activeRegion]}
                </span>
                <span className="text-slate-500">/yr</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex gap-2 text-sm text-slate-300">
                  <CheckCircle2 size={16} className="text-slate-500" /> All 12 pillars
                </li>
                <li className="flex gap-2 text-sm text-slate-300">
                  <CheckCircle2 size={16} className="text-slate-500" /> Resilience, Model, Dominate, Nation
                </li>
                <li className="flex gap-2 text-sm text-slate-300">
                  <CheckCircle2 size={16} className="text-slate-500" /> On-Prem / Air-Gapped
                </li>
                <li className="flex gap-2 text-sm text-slate-300">
                  <CheckCircle2 size={16} className="text-slate-500" /> Custom AI Agents
                </li>
                <li className="flex gap-2 text-sm text-slate-300">
                  <CheckCircle2 size={16} className="text-slate-500" /> Dedicated Success Manager
                </li>
              </ul>
              <button
                onClick={() => navigate('/contact')}
                className="w-full py-3 border border-white/20 rounded hover:bg-white hover:text-black transition-colors font-medium"
              >
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-1 md:col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600" />
                <span className="text-xl font-bold text-white">DATACENDIA</span>
              </Link>
              <p className="text-slate-500 text-sm max-w-xs mb-4">
                The world's first Sovereign Enterprise Intelligence Platform. Verifies data, reasons
                about the future, and orchestrates action.
              </p>
              <div className="flex gap-4">
                <a
                  href="https://twitter.com/datacendia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 hover:text-white"
                >
                  𝕏
                </a>
                <a
                  href="https://linkedin.com/company/datacendia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 hover:text-white"
                >
                  in
                </a>
                <a
                  href="https://github.com/datacendia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 hover:text-white"
                >
                  gh
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li>
                  <Link to="/cortex" className="hover:text-white">
                    The Cortex
                  </Link>
                </li>
                <li>
                  <Link to="/cortex/council" className="hover:text-white">
                    AI Council
                  </Link>
                </li>
                <li>
                  <Link to="/apex/forecast" className="hover:text-white">
                    CendiaForecast
                  </Link>
                </li>
                <li>
                  <Link to="/apex/sentry" className="hover:text-white">
                    CendiaSentry
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="hover:text-white">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li>
                  <Link to="/about" className="hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/manifesto" className="hover:text-white">
                    Manifesto
                  </Link>
                </li>
                <li>
                  <Link to="/pitch" className="hover:text-white">
                    Investors
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-white">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/demo" className="hover:text-white">
                    Request Demo
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li>
                  <Link to="/privacy" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-white">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/license" className="hover:text-white">
                    License
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600">
            <p>© 2025 Datacendia LLC. All rights reserved.</p>
            <div className="flex gap-4">
              <span>Lima • Delaware • Dublin</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Video Modal */}
      {showVideo && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowVideo(false)}
        >
          <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowVideo(false)}
              className="absolute -top-12 right-0 text-white hover:text-amber-500 transition-colors"
            >
              <X size={32} />
            </button>
            <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden border border-white/10">
              {/* Placeholder for video - replace with actual video embed */}
              <div className="w-full h-full flex flex-col items-center justify-center text-center p-8">
                <Play size={64} className="text-amber-500 mb-6" />
                <h3 className="text-2xl font-bold text-white mb-2">Product Demo</h3>
                <p className="text-slate-400 mb-6">
                  See how Datacendia transforms enterprise decision-making
                </p>
                <Link
                  to="/demo"
                  className="px-6 py-3 bg-amber-500 text-black font-bold rounded hover:bg-amber-400 transition-colors"
                  onClick={() => setShowVideo(false)}
                >
                  Request Live Demo
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
