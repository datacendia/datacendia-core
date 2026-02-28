// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * DATACENDIA PITCH DECK
 * Interactive slide presentation for investors and prospects
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Download,
  Maximize2,
  Brain,
  TrendingUp,
  Shield,
  Users,
  Target,
  DollarSign,
  Building2,
  Zap,
  Globe,
  Check,
  ArrowRight,
} from 'lucide-react';

interface Slide {
  id: string;
  title: string;
  content: React.ReactNode;
}

const SLIDES: Slide[] = [
  {
    id: 'cover',
    title: 'Cover',
    content: (
      <div className="h-full flex flex-col items-center justify-center text-center p-12">
        <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-8">
          <Brain className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">Datacendia</h1>
        <p className="text-2xl text-purple-300 mb-8">Sovereign Enterprise Intelligence</p>
        <div className="text-slate-400 text-lg">Investor Presentation • 2025</div>
      </div>
    ),
  },
  {
    id: 'problem',
    title: 'The Problem',
    content: (
      <div className="h-full flex flex-col justify-center p-12">
        <h2 className="text-4xl font-bold text-white mb-8">The Enterprise Intelligence Crisis</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { stat: '200+', label: 'SaaS tools per enterprise', icon: '🌊', color: 'red' },
            { stat: '73%', label: 'of data goes unused', icon: '📊', color: 'amber' },
            { stat: '$3.1T', label: 'lost to poor decisions annually', icon: '💸', color: 'red' },
          ].map((item) => (
            <div
              key={item.label}
              className="p-6 bg-slate-800/50 rounded-xl border border-slate-700"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <div
                className={`text-4xl font-bold ${item.color === 'red' ? 'text-red-400' : 'text-amber-400'}`}
              >
                {item.stat}
              </div>
              <div className="text-slate-400 mt-2">{item.label}</div>
            </div>
          ))}
        </div>
        <div className="mt-8 p-6 bg-red-500/10 rounded-xl border border-red-500/30">
          <p className="text-lg text-red-300">
            <strong>The Result:</strong> Executives make critical decisions with incomplete data,
            siloed insights, and zero predictive capability.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 'solution',
    title: 'The Solution',
    content: (
      <div className="h-full flex flex-col justify-center p-12">
        <h2 className="text-4xl font-bold text-white mb-4">Introducing The Cortex</h2>
        <p className="text-xl text-slate-400 mb-8">
          The unified intelligence platform that transforms how organizations think, decide, and
          act.
        </p>
        <div className="grid md:grid-cols-5 gap-4">
          {[
            { name: 'Graph', icon: '🕸️', desc: 'Knowledge Universe' },
            { name: 'Council', icon: '🧠', desc: 'AI Deliberation' },
            { name: 'Pulse', icon: '💓', desc: 'Real-time Health' },
            { name: 'Lens', icon: '🔮', desc: 'Predictive Analytics' },
            { name: 'Bridge', icon: '🌉', desc: 'Action Orchestration' },
          ].map((space) => (
            <div
              key={space.name}
              className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 text-center"
            >
              <div className="text-3xl mb-2">{space.icon}</div>
              <div className="text-white font-semibold">{space.name}</div>
              <div className="text-xs text-slate-500">{space.desc}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'product',
    title: 'Product',
    content: (
      <div className="h-full flex flex-col justify-center p-12">
        <h2 className="text-4xl font-bold text-white mb-8">
          The AI Council: Multi-Persona Deliberation
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <p className="text-lg text-slate-300">
              Unlike single-agent AI, Datacendia deploys an{' '}
              <strong className="text-purple-400">executive council</strong> of specialized AI
              personas that debate, challenge, and synthesize insights.
            </p>
            <div className="grid grid-cols-3 gap-2">
              {['CFO', 'COO', 'CISO', 'CTO', 'CMO', 'CHRO'].map((role) => (
                <div
                  key={role}
                  className="p-2 bg-purple-500/20 rounded text-center text-purple-300 text-sm"
                >
                  {role} Agent
                </div>
              ))}
            </div>
            <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
              <div className="text-green-400 font-semibold">Key Differentiator</div>
              <p className="text-slate-400 text-sm">
                Deliberation, not just generation. Our agents argue and converge on optimal
                decisions.
              </p>
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <div className="text-sm text-slate-500 mb-4">Example Question:</div>
            <div className="text-white text-lg mb-4">
              "Should we expand into the European market in Q2?"
            </div>
            <div className="space-y-3">
              {[
                { role: 'CFO', msg: 'Cash flow can support €2M investment...' },
                { role: 'COO', msg: 'Supply chain needs 3-month lead time...' },
                { role: 'CMO', msg: 'Brand awareness is 12% in target regions...' },
              ].map((item) => (
                <div key={item.role} className="flex gap-2 text-sm">
                  <span className="text-purple-400 font-mono">{item.role}:</span>
                  <span className="text-slate-400">{item.msg}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'market',
    title: 'Market',
    content: (
      <div className="h-full flex flex-col justify-center p-12">
        <h2 className="text-4xl font-bold text-white mb-8">$150B+ Total Addressable Market</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {[
            { label: 'TAM', value: '$150B', desc: 'Enterprise Intelligence' },
            { label: 'SAM', value: '$45B', desc: 'Mid-Market + Enterprise' },
            { label: 'SOM', value: '$2B', desc: 'Year 5 Target' },
          ].map((item) => (
            <div
              key={item.label}
              className="p-6 bg-slate-800/50 rounded-xl border border-slate-700 text-center"
            >
              <div className="text-slate-500 text-sm mb-2">{item.label}</div>
              <div className="text-4xl font-bold text-cyan-400">{item.value}</div>
              <div className="text-slate-400 text-sm mt-2">{item.desc}</div>
            </div>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700">
            <h3 className="text-white font-semibold mb-4">Competitive Landscape</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-400">
                <span>Palantir</span>
                <span>Too complex, too expensive</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Snowflake</span>
                <span>Data only, no intelligence</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Tableau</span>
                <span>Visualization, not prediction</span>
              </div>
              <div className="flex justify-between text-purple-400 font-semibold">
                <span>Datacendia</span>
                <span>Full-stack intelligence</span>
              </div>
            </div>
          </div>
          <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700">
            <h3 className="text-white font-semibold mb-4">Why Now?</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-400 mt-0.5" />
                LLMs enable multi-agent reasoning
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-400 mt-0.5" />
                Enterprises demanding AI ROI
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-400 mt-0.5" />
                Data governance regulations increasing
              </li>
            </ul>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'business',
    title: 'Business Model',
    content: (
      <div className="h-full flex flex-col justify-center p-12">
        <h2 className="text-4xl font-bold text-white mb-8">Annual Enterprise Licensing</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {[
            { tier: 'Foundation', price: '$150K–$500K/yr', users: 'Up to 100 users', color: 'slate' },
            { tier: 'Enterprise', price: '$500K–$2M/yr', users: 'Up to 500 users', color: 'purple' },
            { tier: 'Strategic', price: '$2M–$100M+/yr', users: 'Unlimited users', color: 'cyan' },
          ].map((plan) => (
            <div
              key={plan.tier}
              className={`p-6 rounded-xl border ${
                plan.color === 'purple'
                  ? 'bg-purple-500/20 border-purple-500'
                  : plan.color === 'cyan'
                    ? 'bg-cyan-500/20 border-cyan-500'
                    : 'bg-slate-800/50 border-slate-700'
              }`}
            >
              <div className="text-slate-400 text-sm mb-1">{plan.tier}</div>
              <div className="text-3xl font-bold text-white mb-2">{plan.price}</div>
              <div className="text-slate-400 text-sm">{plan.users}</div>
            </div>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700">
            <h3 className="text-white font-semibold mb-4">Revenue Streams</h3>
            <div className="space-y-3">
              {[
                { name: 'Platform Subscription', pct: '60%' },
                { name: 'Usage (AI/Compute)', pct: '25%' },
                { name: 'Professional Services', pct: '15%' },
              ].map((stream) => (
                <div key={stream.name} className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-cyan-500"
                        style={{ width: stream.pct }}
                      />
                    </div>
                  </div>
                  <div className="text-slate-400 text-sm w-24">{stream.name}</div>
                  <div className="text-white font-semibold w-12">{stream.pct}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700">
            <h3 className="text-white font-semibold mb-4">Unit Economics</h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              {[
                { label: 'CAC', value: '$15K' },
                { label: 'LTV', value: '$180K' },
                { label: 'LTV:CAC', value: '12:1' },
                { label: 'Payback', value: '8 mo' },
              ].map((metric) => (
                <div key={metric.label}>
                  <div className="text-2xl font-bold text-green-400">{metric.value}</div>
                  <div className="text-slate-500 text-sm">{metric.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'traction',
    title: 'Traction',
    content: (
      <div className="h-full flex flex-col justify-center p-12">
        <h2 className="text-4xl font-bold text-white mb-8">Early Traction & Roadmap</h2>
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {[
            { value: '3', label: 'Pilot Customers', icon: Building2 },
            { value: '$150K', label: 'Pipeline', icon: DollarSign },
            { value: '12', label: 'Active Users', icon: Users },
            { value: '94%', label: 'Satisfaction', icon: Target },
          ].map((metric) => (
            <div
              key={metric.label}
              className="p-6 bg-slate-800/50 rounded-xl border border-slate-700 text-center"
            >
              <metric.icon className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white">{metric.value}</div>
              <div className="text-slate-400 text-sm">{metric.label}</div>
            </div>
          ))}
        </div>
        <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700">
          <h3 className="text-white font-semibold mb-4">Roadmap</h3>
          <div className="flex gap-4">
            {[
              { q: 'Q1 2025', items: ['Platform GA', '10 customers'] },
              { q: 'Q2 2025', items: ['Apex Packages', '$500K ARR'] },
              { q: 'Q3 2025', items: ['Enterprise tier', '25 customers'] },
              { q: 'Q4 2025', items: ['Series A', '$2M ARR'] },
            ].map((phase) => (
              <div key={phase.q} className="flex-1 p-4 bg-slate-900/50 rounded-lg">
                <div className="text-purple-400 font-semibold mb-2">{phase.q}</div>
                <ul className="text-sm text-slate-400 space-y-1">
                  {phase.items.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'team',
    title: 'Team',
    content: (
      <div className="h-full flex flex-col justify-center p-12">
        <h2 className="text-4xl font-bold text-white mb-8">Leadership Team</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              name: 'Stuart Rainey',
              title: 'Founder & CEO',
              bio: 'Serial entrepreneur with 20+ years in enterprise software',
              avatar: '👨‍💼',
            },
            {
              name: 'Technical Team',
              title: 'Engineering',
              bio: 'Full-stack AI/ML expertise, building production systems',
              avatar: '👨‍💻',
            },
            {
              name: 'Advisory Board',
              title: 'Advisors',
              bio: 'Fortune 500 executives, AI researchers, enterprise sales leaders',
              avatar: '🎓',
            },
          ].map((member) => (
            <div
              key={member.name}
              className="p-6 bg-slate-800/50 rounded-xl border border-slate-700"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
                {member.avatar}
              </div>
              <div className="text-center">
                <div className="text-white font-semibold text-lg">{member.name}</div>
                <div className="text-purple-400 text-sm mb-3">{member.title}</div>
                <div className="text-slate-400 text-sm">{member.bio}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'ask',
    title: 'The Ask',
    content: (
      <div className="h-full flex flex-col justify-center p-12 text-center">
        <h2 className="text-4xl font-bold text-white mb-8">Seed Round: $2M</h2>
        <div className="max-w-2xl mx-auto mb-8">
          <div className="grid grid-cols-3 gap-6 mb-8">
            {[
              { pct: '50%', label: 'Product & Engineering' },
              { pct: '30%', label: 'Go-to-Market' },
              { pct: '20%', label: 'Operations' },
            ].map((item) => (
              <div
                key={item.label}
                className="p-4 bg-slate-800/50 rounded-xl border border-slate-700"
              >
                <div className="text-3xl font-bold text-purple-400">{item.pct}</div>
                <div className="text-slate-400 text-sm">{item.label}</div>
              </div>
            ))}
          </div>
          <div className="p-6 bg-green-500/10 rounded-xl border border-green-500/30">
            <div className="text-2xl font-bold text-green-400 mb-2">18-Month Runway</div>
            <div className="text-slate-400">Path to $2M ARR and Series A readiness</div>
          </div>
        </div>
        <div className="flex justify-center gap-4">
          <Link
            to="/demo"
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold rounded-xl hover:opacity-90 transition"
          >
            Schedule Demo
          </Link>
          <a
            href="mailto:invest@datacendia.com"
            className="px-8 py-4 border border-slate-600 text-white font-semibold rounded-xl hover:bg-slate-800 transition"
          >
            Contact Us
          </a>
        </div>
      </div>
    ),
  },
  {
    id: 'closing',
    title: 'Thank You',
    content: (
      <div className="h-full flex flex-col items-center justify-center text-center p-12">
        <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-8">
          <Brain className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-5xl font-bold text-white mb-4">Thank You</h1>
        <p className="text-2xl text-purple-300 mb-8">
          Let's build the future of enterprise intelligence together
        </p>
        <div className="text-slate-400">
          <div className="mb-2">📧 hello@datacendia.com</div>
          <div className="mb-2">🌐 datacendia.com</div>
        </div>
      </div>
    ),
  },
];

export const PitchDeck: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const nextSlide = () => {
    setCurrentSlide((prev) => Math.min(prev + 1, SLIDES.length - 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === ' ') {
      nextSlide();
    }
    if (e.key === 'ArrowLeft') {
      prevSlide();
    }
  };

  return (
    <div
      className={`min-h-screen bg-slate-900 flex flex-col ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-slate-400 hover:text-white">
            <Home className="w-5 h-5" />
          </Link>
          <span className="text-white font-semibold">Datacendia Pitch Deck</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-400 text-sm">
            {currentSlide + 1} / {SLIDES.length}
          </span>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="text-slate-400 hover:text-white"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500">
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Slide */}
      <div className="flex-1 flex">
        {/* Slide content */}
        <div className="flex-1 relative">
          <div className="absolute inset-0 overflow-hidden">{SLIDES[currentSlide].content}</div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800">
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
            currentSlide === 0
              ? 'text-slate-600 cursor-not-allowed'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
          Previous
        </button>

        {/* Slide thumbnails */}
        <div className="flex gap-2">
          {SLIDES.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition ${
                index === currentSlide ? 'bg-purple-500' : 'bg-slate-700 hover:bg-slate-600'
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          disabled={currentSlide === SLIDES.length - 1}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
            currentSlide === SLIDES.length - 1
              ? 'text-slate-600 cursor-not-allowed'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Next
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default PitchDeck;
