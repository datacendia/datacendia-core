// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { deterministicFloat, deterministicInt } from '../../lib/deterministic';
import {
  Shield,
  Lock,
  Server,
  Eye,
  FileCheck,
  Users,
  AlertTriangle,
  CheckCircle,
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
        x: deterministicFloat('security-5') * canvas.width,
        y: deterministicFloat('security-6') * canvas.height,
        vx: (deterministicFloat('security-1') - 0.5) * 0.15,
        vy: (deterministicFloat('security-2') - 0.5) * 0.15,
        size: deterministicFloat('security-3') * 1.5 + 0.5,
        opacity: deterministicFloat('security-4') * 0.25 + 0.05,
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

export const SecurityPage: React.FC = () => {
  const securityFeatures = [
    {
      icon: Lock,
      title: 'Encryption at Rest & Transit',
      description: 'AES-256-GCM encryption for all data at rest. TLS 1.3 for all data in transit.',
    },
    {
      icon: Server,
      title: 'Air-Gapped Deployment',
      description:
        'Deploy entirely on your infrastructure with zero external dependencies or telemetry.',
    },
    {
      icon: Shield,
      title: 'Defense in Depth',
      description:
        'Multi-layer security architecture with honeypots, rate limiting, and intrusion detection.',
    },
    {
      icon: Eye,
      title: 'Complete Audit Trail',
      description:
        'Every action logged with user context, timestamps, and cryptographic integrity.',
    },
    {
      icon: Users,
      title: 'Enterprise Identity',
      description:
        'Native support for Active Directory, SAML 2.0, OIDC, and PKI/Smart Card authentication.',
    },
    {
      icon: FileCheck,
      title: 'Compliance Ready',
      description: 'SOC 2 Type II, HIPAA, GDPR, and ISO 27001 controls built-in.',
    },
  ];

  const certifications = [
    { name: 'SOC 2 Type II', status: 'Awaiting Audit' },
    { name: 'ISO 27001', status: 'Awaiting Audit' },
    { name: 'HIPAA', status: 'Controls Ready' },
    { name: 'GDPR', status: 'Controls Ready' },
    { name: 'FedRAMP', status: 'Future Goal' },
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
            <Link to="/security" className="text-red-900">
              SECURITY
            </Link>
            <Link to="/privacy" className="text-gray-500 hover:text-white transition-colors">
              PRIVACY
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
          <Shield className="w-12 h-12 mx-auto mb-4 text-red-900" />
          <p className="text-xs tracking-[0.4em] text-gray-600 uppercase mb-6">
            ENTERPRISE SECURITY
          </p>
          <h1 className="text-3xl font-extralight tracking-wide mb-4">Security First</h1>
          <p className="text-gray-500">
            Enterprise-grade security designed for sovereign deployments and regulated industries.
          </p>
        </div>
      </section>

      {/* Security Features */}
      <section className="relative z-20 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-xl font-light text-center mb-12 text-white">Security Architecture</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {securityFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-black/50 backdrop-blur-sm border border-gray-800 hover:border-red-900/30 rounded p-6 transition-colors"
              >
                <feature.icon className="w-8 h-8 text-red-900 mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance */}
      <section className="relative z-20 py-16 border-t border-gray-900">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h2 className="text-xl font-light text-center mb-12 text-white">
            Compliance & Certifications
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {certifications.map((cert, index) => (
              <div
                key={index}
                className="text-center p-4 bg-black/50 border border-gray-800 rounded"
              >
                <CheckCircle className="w-6 h-6 mx-auto mb-2 text-green-500" />
                <div className="font-medium text-white text-sm">{cert.name}</div>
                <div className="text-xs text-gray-600">{cert.status}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vulnerability Reporting */}
      <section className="relative z-20 py-16 border-t border-gray-900">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="bg-amber-900/10 border border-amber-900/30 rounded p-8">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-medium text-white mb-2">
                  Security Vulnerability Reporting
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  If you discover a security vulnerability, please report it responsibly. We take
                  all reports seriously and will respond within 24 hours.
                </p>
                <a
                  href="mailto:security@datacendia.com"
                  className="inline-flex items-center gap-2 text-amber-500 text-sm hover:text-amber-400 transition-colors"
                >
                  security@datacendia.com <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-20 py-12 border-t border-gray-900">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-6 mb-4 text-xs tracking-wider">
            <Link to="/privacy" className="text-gray-600 hover:text-white transition-colors">
              PRIVACY
            </Link>
            <Link to="/terms" className="text-gray-600 hover:text-white transition-colors">
              TERMS
            </Link>
            <Link to="/sovereign" className="text-gray-600 hover:text-white transition-colors">
              CONTACT
            </Link>
          </div>
          <p className="text-[10px] text-gray-700 tracking-widest">
            © {new Date().getFullYear()} DATACENDIA • SOVEREIGN INTELLIGENCE
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SecurityPage;
