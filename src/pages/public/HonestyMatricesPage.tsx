// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA - THE HONESTY MATRICES
// Radical transparency. No exceptions.
// Premium dark theme matching Sovereign Landing Page
// =============================================================================

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../../lib/utils';
import { ArrowRight } from 'lucide-react';
import { deterministicFloat, deterministicInt } from '../../lib/deterministic';

// =============================================================================
// PREMIUM EFFECTS (matching SovereignLandingPage)
// =============================================================================

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
    const particleCount = 40;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: deterministicFloat('honestymatrices-6') * canvas.width,
        y: deterministicFloat('honestymatrices-7') * canvas.height,
        vx: (deterministicFloat('honestymatrices-1') - 0.5) * 0.2,
        vy: (deterministicFloat('honestymatrices-2') - 0.5) * 0.2,
        size: deterministicFloat('honestymatrices-4') * 2 + 0.5,
        opacity: deterministicFloat('honestymatrices-5') * 0.4 + 0.1,
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

      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(127, 29, 29, ${0.08 * (1 - dist / 120)})`;
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

// Scan lines overlay
const ScanLines: React.FC = () => (
  <div
    className="fixed inset-0 pointer-events-none z-10 opacity-[0.02]"
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
        setTimeout(() => setIsGlitching(false), 150);
      },
      6000 + deterministicFloat('honestymatrices-3') * 4000
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

// =============================================================================
// MATRIX DATA
// =============================================================================

type MatrixCell = {
  value: string;
  status: 'good' | 'bad' | 'partial' | 'neutral';
};

type MatrixRow = {
  label: string;
  cells: MatrixCell[];
};

type Matrix = {
  id: string;
  title: string;
  question: string;
  description: string;
  icon: string;
  color: string;
  columns: string[];
  rows: MatrixRow[];
  admission: string;
  services: string[];
};

const matrices: Matrix[] = [
  {
    id: 'sovereignty',
    title: 'Sovereignty Matrix',
    question: 'How much control do I actually have?',
    description: 'Choose your deployment model based on your sovereignty requirements.',
    icon: '🏛️',
    color: '#6366F1',
    columns: ['Cloud', 'Private Cloud', 'Self-Managed', 'Air-Gapped'],
    rows: [
      {
        label: 'Who controls the keys?',
        cells: [
          { value: 'Vendor + Provider', status: 'bad' },
          { value: 'Shared', status: 'partial' },
          { value: 'Customer', status: 'good' },
          { value: 'Customer (offline)', status: 'good' },
        ],
      },
      {
        label: 'We can see your data',
        cells: [
          { value: 'Yes', status: 'bad' },
          { value: 'Limited', status: 'partial' },
          { value: 'Never', status: 'good' },
          { value: 'Impossible', status: 'good' },
        ],
      },
      {
        label: 'We can access your system',
        cells: [
          { value: 'Yes', status: 'bad' },
          { value: 'Yes', status: 'bad' },
          { value: 'No', status: 'good' },
          { value: 'No', status: 'good' },
        ],
      },
      {
        label: 'Third parties can be compelled',
        cells: [
          { value: 'Yes', status: 'bad' },
          { value: 'No', status: 'good' },
          { value: 'No', status: 'good' },
          { value: 'No', status: 'good' },
        ],
      },
      {
        label: 'CLOUD Act applies',
        cells: [
          { value: 'Yes', status: 'bad' },
          { value: 'Partial', status: 'partial' },
          { value: 'No', status: 'good' },
          { value: 'No', status: 'good' },
        ],
      },
      {
        label: 'GDPR data residency compliant',
        cells: [
          { value: 'Partial', status: 'partial' },
          { value: 'Yes', status: 'good' },
          { value: 'Yes', status: 'good' },
          { value: 'Yes', status: 'good' },
        ],
      },
      {
        label: 'Fully sovereign',
        cells: [
          { value: 'No', status: 'bad' },
          { value: 'No', status: 'bad' },
          { value: 'Yes', status: 'good' },
          { value: 'Yes', status: 'good' },
        ],
      },
      {
        label: 'Works offline',
        cells: [
          { value: 'No', status: 'bad' },
          { value: 'No', status: 'bad' },
          { value: 'Partial', status: 'partial' },
          { value: 'Yes', status: 'good' },
        ],
      },
      {
        label: 'Works offline forever',
        cells: [
          { value: 'No', status: 'bad' },
          { value: 'No', status: 'bad' },
          { value: 'No', status: 'bad' },
          { value: 'Yes', status: 'good' },
        ],
      },
      {
        label: 'You own the deployment',
        cells: [
          { value: 'No', status: 'bad' },
          { value: 'Partial', status: 'partial' },
          { value: 'Yes', status: 'good' },
          { value: 'Yes', status: 'good' },
        ],
      },
      {
        label: 'Exit cost',
        cells: [
          { value: 'Medium', status: 'partial' },
          { value: 'Low', status: 'good' },
          { value: 'Very Low', status: 'good' },
          { value: 'Very Low', status: 'good' },
        ],
      },
      {
        label: 'Best for',
        cells: [
          { value: 'Startups, SMBs', status: 'neutral' },
          { value: 'Enterprise, Regulated', status: 'neutral' },
          { value: 'Banks, Gov', status: 'neutral' },
          { value: 'Defense, Intel', status: 'neutral' },
        ],
      },
    ],
    admission:
      "If you choose cloud, we will have technical access. We'd rather you understand that before you sign.",
    services: ['CendiaSovereign™'],
  },
  {
    id: 'ai-governance',
    title: 'AI Governance Reality Check',
    question: "Who's actually responsible when AI goes wrong?",
    description:
      'Who is actually responsible when AI goes wrong — and what you show your regulator or board.',
    icon: '🤖',
    color: '#EF4444',
    columns: ['Traditional Vendor', 'In-House ML Team', 'Datacendia'],
    rows: [
      {
        label: 'Model makes biased decision',
        cells: [
          { value: '"Not our fault, your data"', status: 'bad' },
          { value: 'Blame the data scientist who left', status: 'bad' },
          { value: 'CendiaEthics™ flags bias pre-deployment', status: 'good' },
        ],
      },
      {
        label: "Can't explain decision to regulator",
        cells: [
          { value: 'Vendor provides generic docs', status: 'bad' },
          { value: 'Hope someone documented it', status: 'bad' },
          { value: 'CendiaWitness™ + CendiaGlass™ = audit-ready', status: 'good' },
        ],
      },
      {
        label: 'Model drifts in production',
        cells: [
          { value: 'You notice when customers complain', status: 'bad' },
          { value: 'If you built monitoring', status: 'partial' },
          { value: 'CendiaBlackBox™ tracks drift; alerts before impact', status: 'good' },
        ],
      },
      {
        label: 'Need to roll back',
        cells: [
          { value: 'Submit support ticket', status: 'bad' },
          { value: 'Hope you versioned it', status: 'bad' },
          { value: 'One-click rollback with lineage intact', status: 'good' },
        ],
      },
      {
        label: 'Auditor asks "how did it decide?"',
        cells: [
          { value: 'Awkward silence', status: 'bad' },
          { value: '"It\'s a neural network..."', status: 'bad' },
          { value: 'Factor contribution + counterfactual analysis', status: 'good' },
        ],
      },
      {
        label: 'AI recommends something unethical',
        cells: [
          { value: '"Algorithm is neutral"', status: 'bad' },
          { value: 'Debate in Slack', status: 'bad' },
          { value: 'CendiaVeto™ blocks automatically', status: 'good' },
        ],
      },
      {
        label: 'Competing AI recommendations',
        cells: [
          { value: "Pick one, hope it's right", status: 'bad' },
          { value: 'Loudest voice wins', status: 'bad' },
          { value: 'The Council: multi-agent deliberation', status: 'good' },
        ],
      },
      {
        label: 'Regulator asks: "Show me how this AI decided last October"',
        cells: [
          { value: 'Scramble for logs', status: 'bad' },
          { value: 'Reconstruct from notebooks', status: 'bad' },
          {
            value: 'Open Chronos at that date; replay Council deliberation and evidence',
            status: 'good',
          },
        ],
      },
    ],
    admission: 'Most AI vendors avoid accountability. We build it in.',
    services: [
      'CendiaEthics™',
      'CendiaGlass™',
      'CendiaWitness™',
      'CendiaBlackBox™',
      'CendiaVeto™',
      'CendiaMirror™',
      'The Council™',
    ],
  },
  {
    id: 'integration',
    title: 'Integration Honesty Matrix',
    question: 'How hard is it really to connect things?',
    description: 'Every vendor says "easy integration." Here\'s the truth.',
    icon: '🔌',
    color: '#10B981',
    columns: ['Vendor Promise', 'Actual Reality', 'Datacendia Reality'],
    rows: [
      {
        label: 'Modern REST API',
        cells: [
          { value: '"5 minutes!"', status: 'neutral' },
          { value: '2-4 hours with auth, pagination, rate limits', status: 'partial' },
          { value: '1-2 hours; CendiaBridge™ handles auth patterns', status: 'good' },
        ],
      },
      {
        label: 'Legacy SOAP/XML',
        cells: [
          { value: '"We support it"', status: 'neutral' },
          { value: 'Find the one engineer who knows SOAP', status: 'bad' },
          { value: 'CendiaBridge™ transforms protocols', status: 'good' },
        ],
      },
      {
        label: 'Mainframe/AS400',
        cells: [
          { value: '"Enterprise ready"', status: 'neutral' },
          { value: '6-month professional services', status: 'bad' },
          { value: 'Honest: this is hard. Budget 4-6 weeks.', status: 'partial' },
        ],
      },
      {
        label: 'Real-time streaming',
        cells: [
          { value: '"Kafka connector"', status: 'neutral' },
          { value: 'Pray the offsets align', status: 'bad' },
          { value: 'CendiaMesh™ manages consumer groups', status: 'good' },
        ],
      },
      {
        label: 'Proprietary ERP systems',
        cells: [
          { value: '"Certified!"', status: 'neutral' },
          { value: 'Expensive connectors + consultants', status: 'bad' },
          { value: 'We connect; licensing is between you and vendor', status: 'partial' },
        ],
      },
      {
        label: 'Shadow IT spreadsheets',
        cells: [
          { value: 'Not mentioned', status: 'bad' },
          { value: '40% of real business logic lives here', status: 'bad' },
          { value: 'CendiaFlow™ can ingest; exposes the chaos', status: 'good' },
        ],
      },
      {
        label: 'Cloud data warehouses',
        cells: [
          { value: '"Native integration"', status: 'neutral' },
          { value: 'Query optimization is your problem', status: 'partial' },
          { value: 'Native connectors; CendiaLineage™ tracks transforms', status: 'good' },
        ],
      },
    ],
    admission: "Mainframes are hard. Shadow IT is real. We won't pretend otherwise.",
    services: ['CendiaBridge™', 'CendiaMesh™', 'CendiaFlow™', 'CendiaLineage™', 'CendiaKey™'],
  },
  {
    id: '3am',
    title: 'What Breaks at 3 AM',
    question: 'When things go wrong, what actually happens?',
    description: 'Things break. The question is how fast you understand and recover.',
    icon: '🚨',
    color: '#F59E0B',
    columns: ['Typical Response', 'Datacendia Response'],
    rows: [
      {
        label: 'Data pipeline fails',
        cells: [
          { value: 'PagerDuty → engineer → SSH → logs → guess', status: 'bad' },
          { value: 'Alert with root cause; upstream/downstream impact shown', status: 'good' },
        ],
      },
      {
        label: 'Dashboard shows wrong number',
        cells: [
          { value: 'Blame the data team', status: 'bad' },
          { value: 'Trace in Chronos back to the exact change; fix at the root', status: 'good' },
        ],
      },
      {
        label: '"The AI said something crazy"',
        cells: [
          { value: 'Disable and apologize', status: 'bad' },
          { value: 'See exactly what inputs caused output; evidence preserved', status: 'good' },
        ],
      },
      {
        label: 'Integration stops syncing',
        cells: [
          { value: 'Check both sides, restart, hope', status: 'bad' },
          {
            value: 'Centralized integration health; automatic retry with alerting',
            status: 'good',
          },
        ],
      },
      {
        label: 'Key person quits mid-incident',
        cells: [
          { value: 'Panic', status: 'bad' },
          {
            value: 'Documented runbooks; CendiaOracle™ answers "how did we fix this?"',
            status: 'good',
          },
        ],
      },
      {
        label: 'Auditor shows up unannounced',
        cells: [
          { value: 'Scramble for 3 days', status: 'bad' },
          { value: 'Export audit package in minutes', status: 'good' },
        ],
      },
      {
        label: 'Security breach detected',
        cells: [
          { value: 'War room, finger pointing', status: 'bad' },
          { value: 'Immediate scope assessment; affected data identified', status: 'good' },
        ],
      },
      {
        label: 'Decision pattern keeps failing',
        cells: [
          { value: 'Repeat same mistakes', status: 'bad' },
          { value: 'Pattern identified and banned after 3 failures', status: 'good' },
        ],
      },
    ],
    admission: 'Things break. The question is how fast you can understand and recover.',
    services: [
      'CendiaPulse™',
      'CendiaLineage™',
      'CendiaGlass™',
      'CendiaWitness™',
      'CendiaMesh™',
      'CendiaLegacy™',
      'CendiaOracle™',
      'CendiaApotheosis™',
    ],
  },
  {
    id: 'platform-comparison',
    title: 'Platform Category Comparison',
    question: 'How do different platform types compare?',
    description:
      "You're not just choosing a vendor; you're choosing a category. This matrix shows the trade-offs each one bakes in.",
    icon: '⚖️',
    color: '#8B5CF6',
    columns: [
      'Enterprise BI',
      'Cloud Data Platform',
      'CRM Platform',
      'ERP Suite',
      'AI API',
      'Datacendia',
    ],
    rows: [
      {
        label: 'Can run air-gapped',
        cells: [
          { value: 'Sometimes', status: 'partial' },
          { value: 'Rarely', status: 'bad' },
          { value: 'Rarely', status: 'bad' },
          { value: 'Sometimes', status: 'partial' },
          { value: 'Rarely', status: 'bad' },
          { value: 'Yes', status: 'good' },
        ],
      },
      {
        label: 'Can run on-prem',
        cells: [
          { value: 'Often', status: 'good' },
          { value: 'Rarely', status: 'bad' },
          { value: 'Rarely', status: 'bad' },
          { value: 'Often', status: 'good' },
          { value: 'Rarely', status: 'bad' },
          { value: 'Yes', status: 'good' },
        ],
      },
      {
        label: 'Data portability',
        cells: [
          { value: 'Varies', status: 'partial' },
          { value: 'Varies', status: 'partial' },
          { value: 'Check terms', status: 'partial' },
          { value: 'Varies', status: 'partial' },
          { value: 'Check terms', status: 'partial' },
          { value: 'Full export', status: 'good' },
        ],
      },
      {
        label: 'You own the models',
        cells: [
          { value: 'Rarely', status: 'bad' },
          { value: 'N/A', status: 'neutral' },
          { value: 'Rarely', status: 'bad' },
          { value: 'Rarely', status: 'bad' },
          { value: 'Rarely', status: 'bad' },
          { value: 'Yes', status: 'good' },
        ],
      },
      {
        label: 'Exit complexity',
        cells: [
          { value: 'High', status: 'bad' },
          { value: 'Medium', status: 'partial' },
          { value: 'High', status: 'bad' },
          { value: 'High', status: 'bad' },
          { value: 'Low', status: 'good' },
          { value: 'Low', status: 'good' },
        ],
      },
      {
        label: 'AI decision explainability',
        cells: [
          { value: 'Sometimes', status: 'partial' },
          { value: 'N/A', status: 'neutral' },
          { value: 'Limited', status: 'partial' },
          { value: 'Limited', status: 'partial' },
          { value: 'Limited', status: 'partial' },
          { value: 'Full', status: 'good' },
        ],
      },
      {
        label: 'Immutable audit trail',
        cells: [
          { value: 'Sometimes', status: 'partial' },
          { value: 'Sometimes', status: 'partial' },
          { value: 'Sometimes', status: 'partial' },
          { value: 'Sometimes', status: 'partial' },
          { value: 'Rarely', status: 'bad' },
          { value: 'Built-in', status: 'good' },
        ],
      },
      {
        label: 'Self-improving AI',
        cells: [
          { value: 'Rarely', status: 'bad' },
          { value: 'Rarely', status: 'bad' },
          { value: 'Rarely', status: 'bad' },
          { value: 'Rarely', status: 'bad' },
          { value: 'Rarely', status: 'bad' },
          { value: 'CendiaApotheosis™', status: 'good' },
        ],
      },
      {
        label: 'Formal dissent tracking',
        cells: [
          { value: 'Rarely', status: 'bad' },
          { value: 'Rarely', status: 'bad' },
          { value: 'Rarely', status: 'bad' },
          { value: 'Rarely', status: 'bad' },
          { value: 'Rarely', status: 'bad' },
          { value: 'CendiaDissent™', status: 'good' },
        ],
      },
      {
        label: 'Multi-agent deliberation',
        cells: [
          { value: 'Rarely', status: 'bad' },
          { value: 'Rarely', status: 'bad' },
          { value: 'Rarely', status: 'bad' },
          { value: 'Rarely', status: 'bad' },
          { value: 'Emerging', status: 'partial' },
          { value: 'The Council™', status: 'good' },
        ],
      },
    ],
    admission:
      "Different platform categories have different strengths. Know what you're trading off.",
    services: [
      'CendiaGlass™',
      'CendiaLedger™',
      'CendiaVeto™',
      'CendiaApotheosis™',
      'CendiaDissent™',
      'The Council™',
      'CendiaChronos™',
    ],
  },
  {
    id: 'limitations',
    title: "What We Can't Do",
    question: 'What are your actual limitations?',
    description: 'What Datacendia will never promise you.',
    icon: '🚫',
    color: '#DC2626',
    columns: ['Can We Do It?', 'Honest Answer'],
    rows: [
      {
        label: 'Replace your data warehouse',
        cells: [
          { value: 'No', status: 'bad' },
          { value: "We sit on top of it; we don't replace it", status: 'neutral' },
        ],
      },
      {
        label: 'Magically fix bad data',
        cells: [
          { value: 'No', status: 'bad' },
          { value: 'We expose bad data; you have to fix it', status: 'neutral' },
        ],
      },
      {
        label: 'Guarantee AI is never wrong',
        cells: [
          { value: 'No', status: 'bad' },
          { value: "We guarantee you'll know when it is, and why", status: 'neutral' },
        ],
      },
      {
        label: 'Integrate in 5 minutes',
        cells: [
          { value: 'Rarely', status: 'partial' },
          { value: 'Simple REST APIs: hours. Legacy systems: weeks.', status: 'neutral' },
        ],
      },
      {
        label: 'Work without your engineers',
        cells: [
          { value: 'No', status: 'bad' },
          { value: "We reduce work by 60-80%; we don't eliminate it", status: 'neutral' },
        ],
      },
      {
        label: 'Replace human judgment',
        cells: [
          { value: 'No', status: 'bad' },
          { value: "We augment and track human judgment; we don't replace it", status: 'neutral' },
        ],
      },
      {
        label: 'Prevent all security breaches',
        cells: [
          { value: 'No', status: 'bad' },
          {
            value: 'We detect faster and scope immediately; prevention is layered',
            status: 'neutral',
          },
        ],
      },
      {
        label: 'Work with zero training',
        cells: [
          { value: 'No', status: 'bad' },
          { value: 'Basic usage: 2 hours. Power usage: 2 weeks.', status: 'neutral' },
        ],
      },
      {
        label: 'Scale infinitely',
        cells: [
          { value: 'No', status: 'bad' },
          { value: 'Practical limit: ~10M decisions/month per instance', status: 'neutral' },
        ],
      },
      {
        label: 'Make untraceable decisions',
        cells: [
          { value: 'No', status: 'bad' },
          {
            value:
              "Every major decision leaves a trail. If you want deniability, we're the wrong platform.",
            status: 'neutral',
          },
        ],
      },
    ],
    admission: 'Every platform has limits. Knowing them prevents disappointment.',
    services: [],
  },
];

// =============================================================================
// COMPONENTS
// =============================================================================

const MatrixCard: React.FC<{ matrix: Matrix; onClick: () => void }> = ({ matrix, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="group bg-black/50 backdrop-blur-sm border border-gray-800 hover:border-red-900/50 p-6 text-left transition-all duration-300 rounded"
    >
      <div className="flex items-start gap-4">
        <span className="text-3xl">{matrix.icon}</span>
        <div className="flex-1">
          <h3 className="text-lg font-medium text-white group-hover:text-red-100 transition-colors">
            {matrix.title}
          </h3>
          <p className="text-red-900/80 text-sm font-medium mt-1">{matrix.question}</p>
          <p className="text-gray-500 text-xs mt-2">{matrix.description}</p>
        </div>
        <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-red-900 group-hover:translate-x-1 transition-all" />
      </div>
    </button>
  );
};

const MatrixModal: React.FC<{ matrix: Matrix; onClose: () => void }> = ({ matrix, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-black border border-gray-800 max-w-6xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-black text-white p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-3xl">{matrix.icon}</span>
              <div>
                <h2 className="text-xl font-light tracking-wide">{matrix.title}</h2>
                <p className="text-gray-500 text-sm">{matrix.question}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-white transition-colors text-sm tracking-widest"
            >
              CLOSE
            </button>
          </div>
        </div>

        {/* Matrix Table */}
        <div className="p-6 overflow-auto max-h-[60vh]">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left p-3 bg-gray-900/50 font-medium text-gray-400 border-b border-gray-800 text-sm tracking-wider">
                  CAPABILITY
                </th>
                {matrix.columns.map((col, idx) => (
                  <th
                    key={idx}
                    className="text-center p-3 bg-gray-900/50 font-medium text-gray-400 border-b border-gray-800 min-w-[120px] text-xs tracking-wider"
                  >
                    {col.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrix.rows.map((row, rowIdx) => (
                <tr key={rowIdx} className="border-b border-gray-800/50 hover:bg-gray-900/30">
                  <td className="p-3 font-medium text-gray-300 text-sm">{row.label}</td>
                  {row.cells.map((cell, cellIdx) => (
                    <td key={cellIdx} className="p-3 text-center">
                      <span
                        className={cn(
                          'inline-block px-3 py-1 rounded text-xs font-medium',
                          cell.status === 'good' &&
                            'bg-green-900/30 text-green-400 border border-green-900/50',
                          cell.status === 'bad' &&
                            'bg-red-900/30 text-red-400 border border-red-900/50',
                          cell.status === 'partial' &&
                            'bg-yellow-900/30 text-yellow-400 border border-yellow-900/50',
                          cell.status === 'neutral' &&
                            'bg-gray-800 text-gray-400 border border-gray-700'
                        )}
                      >
                        {cell.value}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="bg-gray-900/50 p-6 border-t border-gray-800">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-gray-500 text-sm italic">"{matrix.admission}"</p>
              {matrix.services.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {matrix.services.map((service, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-red-900/20 text-red-400 text-[10px] font-medium rounded border border-red-900/30"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <Link
              to="/sovereign"
              className="group px-6 py-3 border border-red-900 text-white text-sm tracking-wider hover:bg-red-900/10 transition-all flex items-center gap-2"
            >
              <span>Request Access</span>
              <ArrowRight className="w-4 h-4 text-red-800 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// MAIN PAGE
// =============================================================================

export const HonestyMatricesPage: React.FC = () => {
  const [selectedMatrix, setSelectedMatrix] = useState<Matrix | null>(null);

  return (
    <div className="min-h-screen bg-black text-white font-light antialiased selection:bg-red-900/30 relative overflow-hidden">
      {/* Background Effects */}
      <ParticleField />
      <ScanLines />

      {/* Vignette overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-10"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.5) 100%)',
        }}
      />

      {/* Navigation */}
      <nav className="relative z-30 border-b border-gray-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              to="/sovereign"
              className="text-xl font-extralight tracking-[0.2em] text-white hover:text-red-100 transition-colors"
            >
              DATACENDIA
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link
                to="/sovereign"
                className="text-xs tracking-[0.15em] text-gray-500 hover:text-white transition-colors"
              >
                SOVEREIGN
              </Link>
              <Link to="/honesty" className="text-xs tracking-[0.15em] text-red-900">
                HONESTY MATRICES
              </Link>
              <Link
                to="/product"
                className="text-xs tracking-[0.15em] text-gray-500 hover:text-white transition-colors"
              >
                PRODUCT
              </Link>
            </div>

            <Link
              to="/demo"
              className="px-4 py-2 border border-gray-800 text-xs tracking-[0.15em] text-gray-400 hover:text-white hover:border-red-900/50 transition-all"
            >
              REQUEST EARLY ACCESS
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-20 py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-xs tracking-[0.4em] text-gray-600 uppercase mb-6">
            RADICAL TRANSPARENCY
          </p>
          <h1 className="text-4xl md:text-5xl font-extralight tracking-[0.1em] mb-6">
            <GlitchText>THE HONESTY MATRICES</GlitchText>
          </h1>
          <p className="text-lg text-gray-400 font-light mb-4">
            Most vendors hide this. We lead with it.
          </p>
          <p className="text-sm text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Every matrix shows what we can do, what we can't do, and exactly where we stand against
            alternatives.
          </p>
        </div>
      </section>

      {/* Primary Matrices - Featured 3 */}
      <section className="relative z-20 py-12">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <p className="text-xs tracking-[0.3em] text-gray-600 uppercase mb-6 text-center">
            PRIMARY MATRICES
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {matrices
              .filter((m) => ['sovereignty', 'ai-governance', '3am'].includes(m.id))
              .map((matrix) => (
                <MatrixCard
                  key={matrix.id}
                  matrix={matrix}
                  onClick={() => setSelectedMatrix(matrix)}
                />
              ))}
          </div>

          {/* View All Link */}
          <div className="text-center mb-12">
            <button
              onClick={() =>
                document.getElementById('all-matrices')?.scrollIntoView({ behavior: 'smooth' })
              }
              className="text-sm text-red-900 hover:text-red-700 transition-colors border-b border-red-900/50 pb-1"
            >
              View all 6 Honesty Matrices →
            </button>
          </div>
        </div>
      </section>

      {/* All Matrices Grid */}
      <section id="all-matrices" className="relative z-20 py-12 border-t border-gray-900">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <p className="text-xs tracking-[0.3em] text-gray-600 uppercase mb-6 text-center">
            ALL MATRICES
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matrices.map((matrix) => (
              <MatrixCard
                key={matrix.id}
                matrix={matrix}
                onClick={() => setSelectedMatrix(matrix)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Tagline */}
      <section className="relative z-20 py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-xl md:text-2xl font-light text-gray-300 mb-12">
            "If we can't be honest before you buy,
            <br />
            <span className="text-white">why trust us after?</span>"
          </p>
          <Link
            to="/sovereign"
            className="group inline-flex px-10 py-5 border-2 border-red-900 bg-black hover:bg-red-900/10 transition-all duration-300 items-center gap-3"
          >
            <span className="text-sm tracking-[0.25em] text-white font-medium">
              Request Early Access
            </span>
            <ArrowRight className="w-4 h-4 text-red-800 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-20 py-16 px-6 border-t border-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs text-gray-600 leading-relaxed max-w-2xl mx-auto mb-8">
            The first enterprise platform built on honesty.
            <br />
            No fine print. No hidden limitations. No surprises.
          </p>
          <div className="flex items-center justify-center gap-8 text-[10px] text-gray-700 tracking-widest">
            <span>© {new Date().getFullYear()} DATACENDIA</span>
            <span>•</span>
            <span>RADICAL TRANSPARENCY</span>
          </div>
        </div>
      </footer>

      {/* Matrix Modal */}
      {selectedMatrix && (
        <MatrixModal matrix={selectedMatrix} onClose={() => setSelectedMatrix(null)} />
      )}
    </div>
  );
};

export default HonestyMatricesPage;
