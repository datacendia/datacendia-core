// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { deterministicFloat, deterministicInt } from '../../lib/deterministic';
import {
  HelpCircle,
  Mail,
  MessageSquare,
  Book,
  Clock,
  Shield,
  Phone,
  ArrowRight,
} from 'lucide-react';

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
        x: deterministicFloat('support-5') * canvas.width,
        y: deterministicFloat('support-6') * canvas.height,
        vx: (deterministicFloat('support-1') - 0.5) * 0.15,
        vy: (deterministicFloat('support-2') - 0.5) * 0.15,
        size: deterministicFloat('support-3') * 1.5 + 0.5,
        opacity: deterministicFloat('support-4') * 0.25 + 0.05,
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

export const SupportPage: React.FC = () => {
  const supportChannels = [
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Get help from our technical team',
      action: 'support@datacendia.com',
      href: 'mailto:support@datacendia.com',
      availability: 'Response within 24 hours',
    },
    {
      icon: Book,
      title: 'Documentation',
      description: 'Self-service guides and tutorials',
      action: 'Browse Docs',
      href: '/docs',
      availability: 'Available 24/7',
    },
    {
      icon: MessageSquare,
      title: 'Enterprise Support',
      description: 'Dedicated support for licensed customers',
      action: 'Contact Account Manager',
      href: '/contact',
      availability: 'SLA-based response times',
    },
  ];

  const supportTiers = [
    {
      name: 'Standard',
      responseTime: '24 hours',
      channels: ['Email'],
      features: ['Documentation access', 'Community forums', 'Email support'],
    },
    {
      name: 'Enterprise',
      responseTime: '4 hours',
      channels: ['Email', 'Phone', 'Slack'],
      features: ['Priority queue', 'Dedicated CSM', 'Quarterly reviews', 'Training sessions'],
    },
    {
      name: 'Sovereign',
      responseTime: '1 hour',
      channels: ['Email', 'Phone', 'Slack', 'On-site'],
      features: ['24/7 support', 'Dedicated team', 'On-site visits', 'Custom SLA'],
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
            <Link to="/docs" className="text-gray-500 hover:text-white transition-colors">
              DOCS
            </Link>
            <Link to="/support" className="text-red-900">
              SUPPORT
            </Link>
            <Link to="/sovereign" className="text-gray-500 hover:text-white transition-colors">
              SOVEREIGN
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-20 py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <HelpCircle className="w-10 h-10 mx-auto mb-4 text-red-900" />
          <p className="text-xs tracking-[0.4em] text-gray-600 uppercase mb-6">ASSISTANCE</p>
          <h1 className="text-3xl font-extralight tracking-wide mb-4">Support</h1>
          <p className="text-gray-500">We're here to help you succeed with Datacendia.</p>
        </div>
      </section>

      {/* Support Channels */}
      <section className="relative z-20 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-lg font-light text-center mb-8 text-white">Get Help</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {supportChannels.map((channel, index) => (
              <div
                key={index}
                className="bg-black/50 backdrop-blur-sm border border-gray-800 hover:border-red-900/30 rounded p-6 text-center transition-colors"
              >
                <channel.icon className="w-8 h-8 mx-auto mb-4 text-red-900" />
                <h3 className="text-lg font-medium text-white mb-2">{channel.title}</h3>
                <p className="text-gray-500 text-sm mb-4">{channel.description}</p>
                <a
                  href={channel.href}
                  className="inline-block px-4 py-2 border border-red-900/50 text-white text-sm hover:bg-red-900/10 transition-colors"
                >
                  {channel.action}
                </a>
                <p className="text-xs text-gray-600 mt-3 flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3" />
                  {channel.availability}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Tiers */}
      <section className="relative z-20 py-12 border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-lg font-light text-center mb-8 text-white">Support Tiers</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {supportTiers.map((tier, index) => (
              <div
                key={index}
                className={`rounded p-6 border ${
                  tier.name === 'Sovereign'
                    ? 'bg-red-900/10 border-red-900/50'
                    : 'bg-black/50 border-gray-800'
                }`}
              >
                <h3 className="text-lg font-medium text-white mb-2">{tier.name}</h3>
                <div className="flex items-center gap-2 mb-4">
                  <Clock
                    className={`w-4 h-4 ${tier.name === 'Sovereign' ? 'text-red-400' : 'text-gray-500'}`}
                  />
                  <span className="text-sm text-gray-400">{tier.responseTime} response</span>
                </div>
                <ul className="space-y-2">
                  {tier.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="text-sm flex items-center gap-2 text-gray-400"
                    >
                      <Shield
                        className={`w-3 h-3 ${tier.name === 'Sovereign' ? 'text-red-400' : 'text-gray-600'}`}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="relative z-20 py-16 border-t border-gray-900">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-xl font-light text-white mb-4">Still Need Help?</h2>
          <p className="text-gray-500 mb-8 text-sm">
            Our team is available to answer any questions.
          </p>
          <Link
            to="/sovereign"
            className="group inline-flex items-center gap-2 px-8 py-4 border-2 border-red-900 text-white text-sm tracking-wider hover:bg-red-900/10 transition-all"
          >
            <Phone className="w-4 h-4 text-red-800" />
            <span>Contact Us</span>
            <ArrowRight className="w-4 h-4 text-red-800 group-hover:translate-x-1 transition-transform" />
          </Link>
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

export default SupportPage;
