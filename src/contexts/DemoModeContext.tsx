// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * =============================================================================
 * DEMO MODE CONTEXT
 * =============================================================================
 * Provides demo mode functionality for recording professional videos.
 * 
 * Features:
 * - Clean UI mode (hides debug elements, notifications)
 * - Pre-loaded demo data
 * - Guided step overlays
 * - Script prompts for recording
 * - Automatic transitions
 */

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

// =============================================================================
// TYPES
// =============================================================================

export type DemoId = 
  | 'executive-overview'
  | 'council-in-action'
  | 'audit-compliance'
  | 'industry-verticals'
  | 'technical-deep-dive';

export interface DemoStep {
  id: string;
  title: string;
  description: string;
  script: string; // What to say during recording
  duration: number; // Seconds
  action?: () => void; // Auto-action to perform
  highlight?: string; // CSS selector to highlight
  route?: string; // Navigate to this route
  waitForClick?: boolean; // Wait for user click before proceeding
}

export interface Demo {
  id: DemoId;
  name: string;
  description: string;
  duration: string;
  audience: string;
  thumbnail: string;
  steps: DemoStep[];
}

export interface DemoModeState {
  isActive: boolean;
  currentDemo: Demo | null;
  currentStepIndex: number;
  isPlaying: boolean;
  showScript: boolean;
  showOverlay: boolean;
  cleanMode: boolean; // Hides UI chrome for cleaner recording
}

export interface DemoModeContextValue extends DemoModeState {
  // Demo control
  startDemo: (demoId: DemoId) => void;
  stopDemo: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (index: number) => void;
  
  // Playback
  play: () => void;
  pause: () => void;
  
  // Settings
  toggleScript: () => void;
  toggleOverlay: () => void;
  toggleCleanMode: () => void;
  
  // Helpers
  getCurrentStep: () => DemoStep | null;
  getProgress: () => number;
  getDemos: () => Demo[];
}

// =============================================================================
// DEMO DEFINITIONS
// =============================================================================

const DEMOS: Demo[] = [
  {
    id: 'executive-overview',
    name: 'Executive Overview',
    description: 'High-level platform overview for C-Suite and Board',
    duration: '5 min',
    audience: 'C-Suite, Board Members',
    thumbnail: '🎯',
    steps: [
      {
        id: 'intro',
        title: 'Welcome to Datacendia',
        description: 'Sovereign Enterprise Intelligence Platform',
        script: 'Welcome to Datacendia — the sovereign enterprise intelligence platform that turns your data into accountable, explainable decisions.',
        duration: 8,
        route: '/cortex/dashboard',
      },
      {
        id: 'problem',
        title: 'The Problem',
        description: 'Why traditional AI fails for enterprise',
        script: 'Traditional AI gives you predictions without proof. When the regulator asks "why did you make this decision?" — you have nothing to show them.',
        duration: 10,
      },
      {
        id: 'solution',
        title: 'Our Solution',
        description: 'Multi-agent deliberation with full audit trail',
        script: 'Datacendia solves this with multi-agent deliberation. 14 specialized AI agents debate your decisions, and every argument is logged to an immutable ledger.',
        duration: 12,
        route: '/cortex/council',
      },
      {
        id: 'council-preview',
        title: 'The Council',
        description: 'Watch agents deliberate',
        script: 'This is The Council. CFO, CISO, Legal, Risk — each agent analyzes your decision from their domain expertise. They argue, they dissent, and they reach consensus.',
        duration: 15,
        highlight: '.council-chamber',
      },
      {
        id: 'audit-preview',
        title: 'Audit Evidence',
        description: 'One-click compliance packets',
        script: 'When you need proof, one click generates a cryptographically signed evidence packet. PDF, JSON, ready for your auditor.',
        duration: 10,
        route: '/cortex/evidence-vault',
      },
      {
        id: 'sovereignty',
        title: 'True Sovereignty',
        description: 'Your infrastructure, your control',
        script: 'And it all runs on YOUR infrastructure. On-prem, private cloud, or fully air-gapped. Your data never leaves your control.',
        duration: 10,
      },
      {
        id: 'pricing',
        title: 'Investment',
        description: 'Starting at $60k/year',
        script: 'Starting at $60,000 per year for Starter tier, with Enterprise and Sovereign options for regulated industries.',
        duration: 8,
      },
      {
        id: 'cta',
        title: 'Get Started',
        description: 'Request a briefing',
        script: 'Ready to see more? Request a technical briefing and we will show you The Council deliberating on YOUR data.',
        duration: 8,
      },
    ],
  },
  {
    id: 'council-in-action',
    name: 'The Council in Action',
    description: 'Watch 14 agents debate a real M&A decision',
    duration: '15 min',
    audience: 'Decision-makers, Strategy Teams',
    thumbnail: '🏛️',
    steps: [
      {
        id: 'intro',
        title: 'The Council Demo',
        description: 'Multi-agent deliberation in action',
        script: 'In this demo, we will watch The Council deliberate on a real M&A scenario — a $200 million acquisition target.',
        duration: 10,
        route: '/cortex/council',
      },
      {
        id: 'scenario-setup',
        title: 'The Scenario',
        description: 'Acme Corp acquisition',
        script: 'Our scenario: Acme Corp wants to acquire TechStart Inc for $200M. The financials look solid, but something feels off. Let us see what The Council finds.',
        duration: 12,
      },
      {
        id: 'upload-docs',
        title: 'Upload Documents',
        description: 'Ingest the data room',
        script: 'First, we upload the data room documents. 5,000 PDFs, financial statements, contracts. The Analyst agent will ingest all of this.',
        duration: 15,
        highlight: '.upload-zone',
        waitForClick: true,
      },
      {
        id: 'analyst-phase',
        title: 'Analyst Agent',
        description: 'Pattern recognition',
        script: 'The Analyst is processing... It has identified a concerning pattern: 70% of revenue comes from just 3 customers. That is a concentration risk.',
        duration: 20,
        highlight: '.agent-analyst',
      },
      {
        id: 'cfo-phase',
        title: 'CFO Agent',
        description: 'Financial modeling',
        script: 'The CFO agent is now modeling scenarios. If even one of those top 3 customers leaves, the company value drops by 40%.',
        duration: 18,
        highlight: '.agent-cfo',
      },
      {
        id: 'redteam-phase',
        title: 'Red Team Agent',
        description: 'Adversarial challenge',
        script: 'Now the Red Team attacks the analysis. It has found something the others missed — there are antitrust concerns in the EU that were not disclosed.',
        duration: 20,
        highlight: '.agent-redteam',
      },
      {
        id: 'legal-phase',
        title: 'Legal Agent',
        description: 'Regulatory analysis',
        script: 'Legal confirms: EU Commission approval is not guaranteed. There is a 60% chance of a 12-month delay.',
        duration: 15,
        highlight: '.agent-legal',
      },
      {
        id: 'debate',
        title: 'The Debate',
        description: 'Agents argue their positions',
        script: 'Now the agents debate. CFO wants to proceed at a lower price. Legal recommends walking away. Risk is in the middle. Watch them argue.',
        duration: 25,
      },
      {
        id: 'dissent',
        title: 'Dissent Recorded',
        description: 'CendiaDissent tracks disagreement',
        script: 'Notice the dissent indicator. Legal formally dissented from the recommendation. This is now permanently recorded — audit-proof.',
        duration: 15,
        highlight: '.dissent-badge',
      },
      {
        id: 'arbiter',
        title: 'Arbiter Synthesis',
        description: 'Final recommendation',
        script: 'The Arbiter synthesizes everything. Recommendation: Proceed at $120M with customer retention warranties, or walk away. You did not overpay by $80M.',
        duration: 20,
        highlight: '.agent-arbiter',
      },
      {
        id: 'export',
        title: 'Export Decision Packet',
        description: 'Full audit trail',
        script: 'One click exports the entire deliberation — every argument, every dissent, every piece of evidence. Ready for your board, your auditor, your regulator.',
        duration: 15,
        waitForClick: true,
      },
      {
        id: 'value',
        title: 'The Value',
        description: 'What you got',
        script: 'In 15 minutes, you got what would take a team of analysts weeks. And you have the proof to back it up.',
        duration: 10,
      },
    ],
  },
  {
    id: 'audit-compliance',
    name: 'Audit & Compliance',
    description: 'Generate evidence packets and prove compliance',
    duration: '10 min',
    audience: 'CISO, Legal, Compliance Officers',
    thumbnail: '📋',
    steps: [
      {
        id: 'intro',
        title: 'Audit & Compliance Demo',
        description: 'Evidence generation for regulators',
        script: 'This demo shows how Datacendia generates audit-ready evidence packets for SOC 2, ISO 27001, and regulatory compliance.',
        duration: 10,
        route: '/cortex/evidence-vault',
      },
      {
        id: 'ledger',
        title: 'The Immutable Ledger',
        description: 'Every decision recorded',
        script: 'Every decision made on the platform is recorded to an immutable ledger. Cryptographically signed, timestamped, tamper-evident.',
        duration: 12,
        route: '/cortex/ledger',
      },
      {
        id: 'lineage',
        title: 'Decision Lineage',
        description: 'Full reasoning chain',
        script: 'Click any decision to see its complete lineage — what data was used, which agents weighed in, what the arguments were, and who dissented.',
        duration: 15,
        highlight: '.decision-lineage',
        waitForClick: true,
      },
      {
        id: 'evidence-vault',
        title: 'Evidence Vault',
        description: 'All your audit packets',
        script: 'The Evidence Vault stores all generated audit packets. Organized by date, decision, and compliance framework.',
        duration: 12,
        route: '/cortex/evidence-vault',
      },
      {
        id: 'generate-packet',
        title: 'Generate Evidence Packet',
        description: 'One-click export',
        script: 'Watch this: one click generates a complete evidence packet. PDF/A-3 format, cryptographically signed, with embedded JSON data.',
        duration: 15,
        highlight: '.generate-packet-btn',
        waitForClick: true,
      },
      {
        id: 'packet-contents',
        title: 'Packet Contents',
        description: 'What is included',
        script: 'The packet includes: decision summary, full deliberation transcript, dissent records, data lineage, timestamps, and digital signatures.',
        duration: 15,
      },
      {
        id: 'verify',
        title: 'Verify Integrity',
        description: 'Tamper detection',
        script: 'Anyone can verify the packet has not been tampered with. The hash is recorded on our ledger — any modification is instantly detectable.',
        duration: 12,
        highlight: '.verify-btn',
      },
      {
        id: 'compliance-mapping',
        title: 'Compliance Mapping',
        description: 'SOC 2, ISO 27001, NIST',
        script: 'Our controls map directly to SOC 2, ISO 27001, and NIST 800-53. Your auditor can trace every control to its evidence.',
        duration: 15,
        route: '/cortex/compliance',
      },
      {
        id: 'cta',
        title: 'Ready for Your Auditor',
        description: 'Confidence in compliance',
        script: 'When the auditor arrives, you are ready. Every decision explained, every control evidenced, every requirement met.',
        duration: 10,
      },
    ],
  },
  {
    id: 'industry-verticals',
    name: 'Industry Verticals',
    description: 'See how the platform adapts to your industry',
    duration: '10 min',
    audience: 'Domain Experts, Industry Buyers',
    thumbnail: '🏢',
    steps: [
      {
        id: 'intro',
        title: 'Industry Verticals Demo',
        description: 'Tailored for your industry',
        script: 'Datacendia is not one-size-fits-all. The platform adapts to your industry with pre-configured services, agents, and compliance frameworks.',
        duration: 10,
        route: '/cortex/admin/vertical-config',
      },
      {
        id: 'vertical-selector',
        title: 'Choose Your Vertical',
        description: '24 industry configurations',
        script: 'We support 24 industry verticals. Let me show you how the platform transforms when you switch between them.',
        duration: 12,
        highlight: '.vertical-selector',
      },
      {
        id: 'financial-services',
        title: 'Financial Services',
        description: 'Banks, Asset Managers, Insurance',
        script: 'Financial Services: The platform enables regulatory compliance tools, risk modeling, and audit workflows. CendiaDissent for trader oversight.',
        duration: 20,
        waitForClick: true,
      },
      {
        id: 'healthcare',
        title: 'Healthcare',
        description: 'Hospitals, Pharma, Biotech',
        script: 'Healthcare: HIPAA-aligned controls, clinical decision support, veto authority for patient safety. FHIR integration for EHR connectivity.',
        duration: 20,
        waitForClick: true,
      },
      {
        id: 'aerospace-defense',
        title: 'Aerospace & Defense',
        description: 'Defense Contractors, Space',
        script: 'Aerospace and Defense: Full sovereign mode — air-gapped deployment, TPM attestation, time-locked decisions, portable USB instances.',
        duration: 20,
        waitForClick: true,
      },
      {
        id: 'comparison',
        title: 'Side-by-Side',
        description: 'Different needs, same platform',
        script: 'Notice how different industries enable different services. Finance needs audit trails. Defense needs air-gap. Healthcare needs veto authority.',
        duration: 15,
      },
      {
        id: 'custom',
        title: 'Custom Configuration',
        description: 'Build your own',
        script: 'Or build your own configuration. Enable exactly the services you need, disable what you do not.',
        duration: 12,
        highlight: '.custom-vertical',
      },
      {
        id: 'cta',
        title: 'Your Industry, Your Way',
        description: 'Tailored deployment',
        script: 'Whatever your industry, Datacendia adapts to your compliance requirements, your workflows, and your security posture.',
        duration: 10,
      },
    ],
  },
  {
    id: 'technical-deep-dive',
    name: 'Technical Deep-Dive',
    description: 'Architecture, deployment, and integrations',
    duration: '20 min',
    audience: 'IT, Enterprise Architects, DevOps',
    thumbnail: '⚙️',
    steps: [
      {
        id: 'intro',
        title: 'Technical Deep-Dive',
        description: 'For architects and engineers',
        script: 'This demo is for the technical team. We will cover architecture, deployment options, integrations, and security controls.',
        duration: 10,
      },
      {
        id: 'architecture',
        title: 'Architecture Overview',
        description: 'How it all fits together',
        script: 'Datacendia is a containerized application. Frontend in React, backend in Node.js with Express, PostgreSQL for persistence, and local LLMs via Ollama.',
        duration: 20,
      },
      {
        id: 'deployment-modes',
        title: 'Deployment Modes',
        description: '4 ways to deploy',
        script: 'Four deployment modes: Private cloud for most enterprises. On-premises for regulated industries. Air-gapped for defense. Hybrid for flexibility.',
        duration: 15,
      },
      {
        id: 'docker',
        title: 'Docker Deployment',
        description: 'One command to run',
        script: 'Deployment is simple. Docker Compose brings up the entire stack — frontend, backend, database, Ollama, and supporting services.',
        duration: 15,
      },
      {
        id: 'adapters',
        title: 'Universal Adapters',
        description: '16 connector suites',
        script: '16 connector suites built on 6 universal adapters. Database, Webhook, File Watcher, FHIR, FIX, and MQTT. Connect to any enterprise system.',
        duration: 20,
      },
      {
        id: 'database-adapter',
        title: 'Database Adapter',
        description: 'Connect to your data',
        script: 'The database adapter supports PostgreSQL, MySQL, SQL Server, Oracle, MongoDB, and Snowflake. Zero-copy architecture — data stays in your systems.',
        duration: 18,
      },
      {
        id: 'kms',
        title: 'Key Management',
        description: 'KMS/HSM integration',
        script: 'Encryption keys stay in YOUR KMS. We support HashiCorp Vault, AWS KMS, Azure Key Vault, or local keys for air-gapped deployments.',
        duration: 15,
      },
      {
        id: 'security-controls',
        title: 'Security Controls',
        description: 'Defense in depth',
        script: '1,188 API endpoints, all authenticated. Rate limiting, RBAC, audit logging, intrusion detection. 4,040 automated security tests.',
        duration: 18,
      },
      {
        id: 'observability',
        title: 'Observability',
        description: 'Monitoring and tracing',
        script: 'OpenTelemetry for distributed tracing. Prometheus metrics. Grafana dashboards. Full observability into every decision.',
        duration: 15,
      },
      {
        id: 'api-tour',
        title: 'API Tour',
        description: 'RESTful interfaces',
        script: 'Full REST API for everything. Council deliberations, evidence export, ledger queries, admin functions. Swagger documentation included.',
        duration: 15,
        route: '/api-docs',
      },
      {
        id: 'sovereign-features',
        title: 'Sovereign Features',
        description: 'For classified environments',
        script: 'Sovereign tier adds: data diode ingest, QR air-gap bridge, TPM attestation, time-locked decisions, and portable USB deployment.',
        duration: 18,
      },
      {
        id: 'cta',
        title: 'Ready to Deploy',
        description: 'Get started today',
        script: 'Ready to deploy? We provide full documentation, Docker images, and professional services for enterprise rollout.',
        duration: 10,
      },
    ],
  },
];

// =============================================================================
// CONTEXT
// =============================================================================

const DemoModeContext = createContext<DemoModeContextValue | null>(null);

export const useDemoMode = (): DemoModeContextValue => {
  const context = useContext(DemoModeContext);
  if (!context) {
    throw new Error('useDemoMode must be used within a DemoModeProvider');
  }
  return context;
};

// =============================================================================
// PROVIDER
// =============================================================================

interface DemoModeProviderProps {
  children: ReactNode;
}

export const DemoModeProvider: React.FC<DemoModeProviderProps> = ({ children }) => {
  const [state, setState] = useState<DemoModeState>({
    isActive: false,
    currentDemo: null,
    currentStepIndex: 0,
    isPlaying: false,
    showScript: true,
    showOverlay: true,
    cleanMode: true,
  });

  // Auto-advance timer
  useEffect(() => {
    if (!state.isPlaying || !state.currentDemo) {return;}

    const currentStep = state.currentDemo.steps[state.currentStepIndex];
    if (!currentStep || currentStep.waitForClick) {return;}

    const timer = setTimeout(() => {
      if (state.currentStepIndex < state.currentDemo!.steps.length - 1) {
        setState(prev => ({ ...prev, currentStepIndex: prev.currentStepIndex + 1 }));
      } else {
        setState(prev => ({ ...prev, isPlaying: false }));
      }
    }, currentStep.duration * 1000);

    return () => clearTimeout(timer);
  }, [state.isPlaying, state.currentStepIndex, state.currentDemo]);

  const startDemo = useCallback((demoId: DemoId) => {
    const demo = DEMOS.find(d => d.id === demoId);
    if (!demo) {return;}

    setState({
      isActive: true,
      currentDemo: demo,
      currentStepIndex: 0,
      isPlaying: false,
      showScript: true,
      showOverlay: true,
      cleanMode: true,
    });
  }, []);

  const stopDemo = useCallback(() => {
    setState(prev => ({
      ...prev,
      isActive: false,
      currentDemo: null,
      currentStepIndex: 0,
      isPlaying: false,
    }));
  }, []);

  const nextStep = useCallback(() => {
    if (!state.currentDemo) {return;}
    if (state.currentStepIndex < state.currentDemo.steps.length - 1) {
      setState(prev => ({ ...prev, currentStepIndex: prev.currentStepIndex + 1 }));
    }
  }, [state.currentDemo, state.currentStepIndex]);

  const prevStep = useCallback(() => {
    if (state.currentStepIndex > 0) {
      setState(prev => ({ ...prev, currentStepIndex: prev.currentStepIndex - 1 }));
    }
  }, [state.currentStepIndex]);

  const goToStep = useCallback((index: number) => {
    if (!state.currentDemo) {return;}
    if (index >= 0 && index < state.currentDemo.steps.length) {
      setState(prev => ({ ...prev, currentStepIndex: index }));
    }
  }, [state.currentDemo]);

  const play = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: true }));
  }, []);

  const pause = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: false }));
  }, []);

  const toggleScript = useCallback(() => {
    setState(prev => ({ ...prev, showScript: !prev.showScript }));
  }, []);

  const toggleOverlay = useCallback(() => {
    setState(prev => ({ ...prev, showOverlay: !prev.showOverlay }));
  }, []);

  const toggleCleanMode = useCallback(() => {
    setState(prev => ({ ...prev, cleanMode: !prev.cleanMode }));
  }, []);

  const getCurrentStep = useCallback((): DemoStep | null => {
    if (!state.currentDemo) {return null;}
    return state.currentDemo.steps[state.currentStepIndex] || null;
  }, [state.currentDemo, state.currentStepIndex]);

  const getProgress = useCallback((): number => {
    if (!state.currentDemo) {return 0;}
    return ((state.currentStepIndex + 1) / state.currentDemo.steps.length) * 100;
  }, [state.currentDemo, state.currentStepIndex]);

  const getDemos = useCallback((): Demo[] => {
    return DEMOS;
  }, []);

  const value: DemoModeContextValue = {
    ...state,
    startDemo,
    stopDemo,
    nextStep,
    prevStep,
    goToStep,
    play,
    pause,
    toggleScript,
    toggleOverlay,
    toggleCleanMode,
    getCurrentStep,
    getProgress,
    getDemos,
  };

  return (
    <DemoModeContext.Provider value={value}>
      {children}
    </DemoModeContext.Provider>
  );
};

export default DemoModeContext;
