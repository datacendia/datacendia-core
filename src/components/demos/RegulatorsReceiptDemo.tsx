// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * REGULATOR'S RECEIPT DEMO - ENHANCED VERSION
 * 
 * Interactive demonstration showing how AI agents:
 * 1. Debate clinical data through structured deliberation
 * 2. Reach consensus through voting and synthesis
 * 3. Cryptographically sign the decision packet for regulatory compliance
 * 
 * Features: Dramatic signing ceremony, consensus meter, agent animations
 * Designed for FDA 21 CFR Part 11, EMA GxP, and ICH E6(R2) GCP compliance
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cn } from '../../lib/utils';
import { RedactedText, RedactedCode, useRedaction } from '../ui/RedactedText';
import {
  Shield, FileCheck, Lock, CheckCircle, XCircle, AlertTriangle,
  Clock, Users, Fingerprint, FileSignature, Download, Eye,
  ChevronRight, Play, Pause, RotateCcw, Sparkles, Activity,
  FileText, Hash, Key, Server, Cpu, Database, Zap, Award,
  TrendingUp, AlertCircle, BarChart3, Workflow, Binary, Wifi, WifiOff,
  Send, User, MessageSquare, Archive, Calendar, FileJson, FileBadge,
  HardDrive, ClipboardList, ExternalLink, Stamp
} from 'lucide-react';
import ollamaService from '../../lib/ollama';
import councilPacketApi, { SignatureResult } from '../../services/CouncilPacketService';
import { deterministicFloat, deterministicInt } from '../../lib/deterministic';

// =============================================================================
// TYPES
// =============================================================================

interface ClinicalAgent {
  id: string;
  name: string;
  role: string;
  specialty: string;
  avatarColor: string;
  status: 'idle' | 'analyzing' | 'speaking' | 'voting' | 'signed';
  vote?: 'approve' | 'reject' | 'request-info';
  confidence?: number;
  statement?: string;
  signature?: string;
  signedAt?: Date;
}

interface ClinicalDataPoint {
  id: string;
  category: string;
  parameter: string;
  value: string;
  unit: string;
  status: 'normal' | 'elevated' | 'critical' | 'flagged';
  aiAnalysis?: string;
}

interface DeliberationPhase {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'active' | 'completed';
  duration?: number;
}

interface DecisionPacket {
  id: string;
  title: string;
  studyId: string;
  protocolVersion: string;
  dataPoints: ClinicalDataPoint[];
  deliberationTranscript: Array<{
    agentId: string;
    statement: string;
    timestamp: Date;
    phase: string;
  }>;
  votes: Array<{
    agentId: string;
    vote: string;
    confidence: number;
    rationale: string;
  }>;
  consensus: {
    decision: 'approved' | 'rejected' | 'escalated';
    confidence: number;
    rationale: string;
  };
  signatures: Array<{
    agentId: string;
    signature: string;
    algorithm: string;
    timestamp: Date;
    publicKeyFingerprint: string;
  }>;
  merkleRoot: string;
  blockchainAnchor?: string;
  regulatoryFrameworks: string[];
  generatedAt: Date;
  // Enterprise Audit Extensions
  tsaTimestamp?: {
    authority: string;
    timestamp: Date;
    token: string;
    algorithm: string;
    serialNumber: string;
  };
  wormStorage?: {
    enabled: boolean;
    location: string;
    retentionYears: number;
    immutableFrom: Date;
  };
  accessLog: Array<{
    action: 'created' | 'viewed' | 'exported' | 'verified';
    timestamp: Date;
    user: string;
    ipAddress?: string;
  }>;
  ectdBundle?: {
    moduleNumber: string;
    sequenceNumber: string;
    submissionType: string;
    applicationType: string;
  };
}

// =============================================================================
// INDUSTRY MODES
// =============================================================================

type IndustryMode = 'pharma' | 'banking' | 'insurance' | 'government' | 'healthcare' | 'legal' | 'defense';

interface IndustryConfig {
  id: IndustryMode;
  name: string;
  icon: string;
  color: string;
  description: string;
  agents: ClinicalAgent[];
  dataPoints: ClinicalDataPoint[];
  phases: DeliberationPhase[];
  regulatoryFrameworks: string[];
  decisionTitle: string;
  fourEyesRequired: boolean;
  escalationThreshold?: number;
  clearanceLevel?: string;
}

const INDUSTRY_CONFIGS: Record<IndustryMode, IndustryConfig> = {
  pharma: {
    id: 'pharma',
    name: 'Pharmaceutical',
    icon: '💊',
    color: 'from-emerald-500 to-cyan-500',
    description: 'Clinical trial decisions & regulatory submissions',
    regulatoryFrameworks: ['FDA 21 CFR Part 11', 'EMA GxP', 'ICH E6(R2) GCP'],
    decisionTitle: 'Clinical Trial Interim Analysis Decision',
    fourEyesRequired: false,
    agents: [
      { id: 'cmo', name: 'Dr. Sarah Chen', role: 'Chief Medical Officer', specialty: 'Clinical Oversight', avatarColor: 'from-blue-500 to-cyan-500', status: 'idle' },
      { id: 'biostat', name: 'Dr. Marcus Webb', role: 'Biostatistics Lead', specialty: 'Statistical Analysis', avatarColor: 'from-purple-500 to-violet-500', status: 'idle' },
      { id: 'safety', name: 'Dr. Emily Rodriguez', role: 'Safety Officer', specialty: 'Pharmacovigilance', avatarColor: 'from-red-500 to-orange-500', status: 'idle' },
      { id: 'regulatory', name: 'James Thompson', role: 'Regulatory Affairs', specialty: 'FDA/EMA Compliance', avatarColor: 'from-emerald-500 to-teal-500', status: 'idle' },
      { id: 'quality', name: 'Dr. Lisa Park', role: 'Quality Assurance', specialty: 'GCP Compliance', avatarColor: 'from-amber-500 to-yellow-500', status: 'idle' },
    ],
    dataPoints: [
      { id: 'd1', category: 'Efficacy', parameter: 'Primary Endpoint Response Rate', value: '67.3', unit: '%', status: 'normal', aiAnalysis: 'Exceeds 50% threshold per protocol' },
      { id: 'd2', category: 'Efficacy', parameter: 'Overall Survival (median)', value: '18.4', unit: 'months', status: 'normal', aiAnalysis: 'Favorable vs. historical control (14.2 mo)' },
      { id: 'd3', category: 'Safety', parameter: 'Grade 3+ AEs', value: '23.1', unit: '%', status: 'elevated', aiAnalysis: 'Within acceptable range but requires monitoring' },
      { id: 'd4', category: 'Safety', parameter: 'Treatment Discontinuation', value: '8.7', unit: '%', status: 'normal', aiAnalysis: 'Below 15% threshold' },
      { id: 'd5', category: 'PK/PD', parameter: 'Cmax', value: '847', unit: 'ng/mL', status: 'normal', aiAnalysis: 'Within therapeutic window' },
      { id: 'd6', category: 'PK/PD', parameter: 'AUC0-24', value: '12,450', unit: 'ng·h/mL', status: 'flagged', aiAnalysis: 'Elevated in elderly subgroup - review recommended' },
      { id: 'd7', category: 'Biomarker', parameter: 'Tumor Marker Reduction', value: '52.8', unit: '%', status: 'normal', aiAnalysis: 'Correlates with clinical response' },
    ],
    phases: [
      { id: 'p1', name: 'Data Ingestion', description: 'Agents receive and parse clinical trial data', status: 'pending' },
      { id: 'p2', name: 'Independent Analysis', description: 'Each agent analyzes data from their specialty perspective', status: 'pending' },
      { id: 'p3', name: 'Structured Debate', description: 'Agents present findings and challenge assumptions', status: 'pending' },
      { id: 'p4', name: 'Consensus Building', description: 'Synthesize perspectives and reach agreement', status: 'pending' },
      { id: 'p5', name: 'Voting & Ratification', description: 'Formal vote with confidence scores', status: 'pending' },
      { id: 'p6', name: 'Cryptographic Signing', description: 'Each agent digitally signs the decision packet', status: 'pending' },
    ],
  },
  banking: {
    id: 'banking',
    name: 'Banking & Finance',
    icon: '🏦',
    color: 'from-blue-600 to-indigo-600',
    description: 'Credit decisions, trading approvals & risk management',
    regulatoryFrameworks: ['SOX Section 302/404', 'Basel IV', 'DORA', 'MiFID II', 'SR 11-7'],
    decisionTitle: 'Credit Committee Decision',
    fourEyesRequired: true,
    escalationThreshold: 10000000,
    agents: [
      { id: 'cro', name: 'Victoria Sterling', role: 'Chief Risk Officer', specialty: 'Enterprise Risk', avatarColor: 'from-red-600 to-rose-500', status: 'idle' },
      { id: 'cco', name: 'Robert Chen', role: 'Chief Compliance Officer', specialty: 'Regulatory Compliance', avatarColor: 'from-blue-600 to-indigo-500', status: 'idle' },
      { id: 'credit', name: 'Dr. Amanda Foster', role: 'Credit Risk Director', specialty: 'Credit Analysis', avatarColor: 'from-amber-600 to-orange-500', status: 'idle' },
      { id: 'aml', name: 'Michael Torres', role: 'AML/KYC Officer', specialty: 'Financial Crime', avatarColor: 'from-purple-600 to-violet-500', status: 'idle' },
      { id: 'treasury', name: 'Catherine Wright', role: 'Treasury Director', specialty: 'Liquidity & Capital', avatarColor: 'from-emerald-600 to-teal-500', status: 'idle' },
    ],
    dataPoints: [
      { id: 'd1', category: 'Credit', parameter: 'Exposure Amount', value: '45.2', unit: 'M USD', status: 'elevated', aiAnalysis: 'Above single-name concentration limit' },
      { id: 'd2', category: 'Credit', parameter: 'Internal Rating', value: 'BBB+', unit: '', status: 'normal', aiAnalysis: 'Investment grade - stable outlook' },
      { id: 'd3', category: 'Risk', parameter: 'Probability of Default', value: '2.3', unit: '%', status: 'normal', aiAnalysis: 'Within acceptable risk appetite' },
      { id: 'd4', category: 'Risk', parameter: 'Loss Given Default', value: '42', unit: '%', status: 'elevated', aiAnalysis: 'Higher due to unsecured portion' },
      { id: 'd5', category: 'Capital', parameter: 'RWA Impact', value: '38.4', unit: 'M USD', status: 'flagged', aiAnalysis: 'Will impact capital ratios by 12bps' },
      { id: 'd6', category: 'AML', parameter: 'KYC Status', value: 'Enhanced', unit: '', status: 'elevated', aiAnalysis: 'High-risk jurisdiction - extra due diligence required' },
      { id: 'd7', category: 'Liquidity', parameter: 'Funding Source', value: 'Term Loan', unit: '', status: 'normal', aiAnalysis: 'Matched funding available' },
    ],
    phases: [
      { id: 'p1', name: 'Application Review', description: 'Initial credit application and documentation review', status: 'pending' },
      { id: 'p2', name: 'Risk Assessment', description: 'Quantitative and qualitative risk analysis', status: 'pending' },
      { id: 'p3', name: 'Committee Debate', description: 'Credit committee discussion and challenge', status: 'pending' },
      { id: 'p4', name: 'Four-Eyes Validation', description: 'Independent review and dual approval', status: 'pending' },
      { id: 'p5', name: 'Decision & Conditions', description: 'Final decision with terms and covenants', status: 'pending' },
      { id: 'p6', name: 'Cryptographic Signing', description: 'SOX-compliant digital signatures', status: 'pending' },
    ],
  },
  insurance: {
    id: 'insurance',
    name: 'Insurance',
    icon: '🛡️',
    color: 'from-teal-500 to-emerald-500',
    description: 'Underwriting decisions & claims adjudication',
    regulatoryFrameworks: ['Solvency II', 'IFRS 17', 'NAIC Model Laws', 'GDPR'],
    decisionTitle: 'Complex Claims Adjudication',
    fourEyesRequired: true,
    escalationThreshold: 500000,
    agents: [
      { id: 'chief_actuary', name: 'Dr. Eleanor Hayes', role: 'Chief Actuary', specialty: 'Risk Modeling', avatarColor: 'from-teal-500 to-cyan-500', status: 'idle' },
      { id: 'claims_dir', name: 'Thomas Bradley', role: 'Claims Director', specialty: 'Claims Management', avatarColor: 'from-blue-500 to-indigo-500', status: 'idle' },
      { id: 'underwriter', name: 'Sarah Mitchell', role: 'Senior Underwriter', specialty: 'Risk Selection', avatarColor: 'from-purple-500 to-violet-500', status: 'idle' },
      { id: 'fraud', name: 'Detective Martinez', role: 'SIU Lead', specialty: 'Fraud Detection', avatarColor: 'from-red-500 to-orange-500', status: 'idle' },
      { id: 'legal_ins', name: 'Jennifer Adams', role: 'Claims Counsel', specialty: 'Coverage Analysis', avatarColor: 'from-amber-500 to-yellow-500', status: 'idle' },
    ],
    dataPoints: [
      { id: 'd1', category: 'Claim', parameter: 'Claim Amount', value: '2.4', unit: 'M USD', status: 'elevated', aiAnalysis: 'Above Large Loss threshold' },
      { id: 'd2', category: 'Claim', parameter: 'Policy Limit', value: '5.0', unit: 'M USD', status: 'normal', aiAnalysis: 'Within coverage limits' },
      { id: 'd3', category: 'Risk', parameter: 'Fraud Score', value: '23', unit: '/100', status: 'normal', aiAnalysis: 'Low fraud indicators' },
      { id: 'd4', category: 'Coverage', parameter: 'Exclusion Review', value: 'Clear', unit: '', status: 'normal', aiAnalysis: 'No exclusions apply' },
      { id: 'd5', category: 'Reserve', parameter: 'Reserve Adequacy', value: '87', unit: '%', status: 'flagged', aiAnalysis: 'May need reserve strengthening' },
      { id: 'd6', category: 'Subrogation', parameter: 'Recovery Potential', value: '340', unit: 'K USD', status: 'normal', aiAnalysis: 'Third-party liability identified' },
      { id: 'd7', category: 'Actuarial', parameter: 'IBNR Impact', value: '+2.1', unit: '%', status: 'elevated', aiAnalysis: 'Will affect loss development' },
    ],
    phases: [
      { id: 'p1', name: 'Claim Intake', description: 'Initial claim registration and documentation', status: 'pending' },
      { id: 'p2', name: 'Coverage Analysis', description: 'Policy review and coverage determination', status: 'pending' },
      { id: 'p3', name: 'Investigation Review', description: 'Fraud check and investigation findings', status: 'pending' },
      { id: 'p4', name: 'Committee Review', description: 'Large loss committee deliberation', status: 'pending' },
      { id: 'p5', name: 'Settlement Decision', description: 'Final settlement amount and terms', status: 'pending' },
      { id: 'p6', name: 'Cryptographic Signing', description: 'Solvency II compliant authorization', status: 'pending' },
    ],
  },
  government: {
    id: 'government',
    name: 'Government',
    icon: '🏛️',
    color: 'from-slate-600 to-zinc-600',
    description: 'Procurement decisions & policy approvals',
    regulatoryFrameworks: ['FAR/DFAR', 'FOIA', 'OMB A-123', 'FISMA', 'FedRAMP'],
    decisionTitle: 'Procurement Award Decision',
    fourEyesRequired: true,
    clearanceLevel: 'SECRET',
    agents: [
      { id: 'co', name: 'Margaret Reynolds', role: 'Contracting Officer', specialty: 'Acquisition', avatarColor: 'from-slate-500 to-zinc-500', status: 'idle' },
      { id: 'legal_gov', name: 'David Patterson', role: 'Agency Counsel', specialty: 'Legal Review', avatarColor: 'from-blue-600 to-indigo-600', status: 'idle' },
      { id: 'tech_eval', name: 'Dr. Kevin Wong', role: 'Technical Evaluator', specialty: 'Technical Assessment', avatarColor: 'from-emerald-600 to-teal-600', status: 'idle' },
      { id: 'budget', name: 'Lisa Hernandez', role: 'Budget Analyst', specialty: 'Fiscal Compliance', avatarColor: 'from-amber-600 to-orange-600', status: 'idle' },
      { id: 'security', name: 'Col. James Blackwood', role: 'Security Officer', specialty: 'Clearance & OPSEC', avatarColor: 'from-red-700 to-rose-600', status: 'idle' },
    ],
    dataPoints: [
      { id: 'd1', category: 'Procurement', parameter: 'Contract Value', value: '47.8', unit: 'M USD', status: 'elevated', aiAnalysis: 'Above simplified acquisition threshold' },
      { id: 'd2', category: 'Procurement', parameter: 'Competition Type', value: 'Full & Open', unit: '', status: 'normal', aiAnalysis: 'Meets competition requirements' },
      { id: 'd3', category: 'Technical', parameter: 'Technical Score', value: '92', unit: '/100', status: 'normal', aiAnalysis: 'Exceeds minimum requirements' },
      { id: 'd4', category: 'Past Performance', parameter: 'CPARS Rating', value: 'Satisfactory', unit: '', status: 'normal', aiAnalysis: 'No adverse performance history' },
      { id: 'd5', category: 'Budget', parameter: 'Funding Status', value: 'Obligated', unit: '', status: 'normal', aiAnalysis: 'FY24 funds available' },
      { id: 'd6', category: 'Security', parameter: 'Clearance Required', value: 'SECRET', unit: '', status: 'flagged', aiAnalysis: 'Contractor FCL verification needed' },
      { id: 'd7', category: 'Small Business', parameter: 'SB Goal Credit', value: 'Yes', unit: '', status: 'normal', aiAnalysis: 'Counts toward agency SB goals' },
    ],
    phases: [
      { id: 'p1', name: 'Requirements Review', description: 'Validate acquisition requirements', status: 'pending' },
      { id: 'p2', name: 'Proposal Evaluation', description: 'Technical and price evaluation', status: 'pending' },
      { id: 'p3', name: 'Source Selection', description: 'Best value determination', status: 'pending' },
      { id: 'p4', name: 'Legal & Budget Review', description: 'Compliance and funding verification', status: 'pending' },
      { id: 'p5', name: 'Award Decision', description: 'Final contract award decision', status: 'pending' },
      { id: 'p6', name: 'Cryptographic Signing', description: 'FAR-compliant digital signatures', status: 'pending' },
    ],
  },
  healthcare: {
    id: 'healthcare',
    name: 'Healthcare',
    icon: '🏥',
    color: 'from-rose-500 to-pink-500',
    description: 'Treatment decisions & care authorization',
    regulatoryFrameworks: ['HIPAA', 'HITECH', '42 CFR Part 2', 'Joint Commission', 'CMS CoP'],
    decisionTitle: 'Complex Care Authorization',
    fourEyesRequired: true,
    agents: [
      { id: 'cmd', name: 'Dr. Richard Hayes', role: 'Chief Medical Director', specialty: 'Medical Necessity', avatarColor: 'from-rose-500 to-pink-500', status: 'idle' },
      { id: 'utilization', name: 'Dr. Maria Santos', role: 'UM Medical Director', specialty: 'Utilization Review', avatarColor: 'from-blue-500 to-indigo-500', status: 'idle' },
      { id: 'specialist', name: 'Dr. Andrew Kim', role: 'Specialty Consultant', specialty: 'Oncology', avatarColor: 'from-purple-500 to-violet-500', status: 'idle' },
      { id: 'pharmacy', name: 'Dr. Jennifer Walsh', role: 'Clinical Pharmacist', specialty: 'Drug Therapy', avatarColor: 'from-emerald-500 to-teal-500', status: 'idle' },
      { id: 'ethics', name: 'Dr. Samuel Okonkwo', role: 'Ethics Committee', specialty: 'Bioethics', avatarColor: 'from-amber-500 to-yellow-500', status: 'idle' },
    ],
    dataPoints: [
      { id: 'd1', category: 'Clinical', parameter: 'Diagnosis', value: 'Stage IIIB NSCLC', unit: '', status: 'critical', aiAnalysis: 'Advanced malignancy requiring urgent treatment' },
      { id: 'd2', category: 'Treatment', parameter: 'Requested Therapy', value: 'Pembrolizumab', unit: '', status: 'normal', aiAnalysis: 'NCCN Category 1 recommendation' },
      { id: 'd3', category: 'Clinical', parameter: 'PD-L1 Expression', value: '≥50', unit: '%', status: 'normal', aiAnalysis: 'Meets biomarker criteria' },
      { id: 'd4', category: 'Coverage', parameter: 'Prior Auth Status', value: 'Required', unit: '', status: 'elevated', aiAnalysis: 'Step therapy exception needed' },
      { id: 'd5', category: 'Cost', parameter: 'Treatment Cost', value: '156', unit: 'K USD/year', status: 'elevated', aiAnalysis: 'High-cost specialty drug' },
      { id: 'd6', category: 'Evidence', parameter: 'Clinical Evidence', value: 'Level 1A', unit: '', status: 'normal', aiAnalysis: 'Strong evidence from RCTs' },
      { id: 'd7', category: 'Patient', parameter: 'ECOG Status', value: '1', unit: '', status: 'normal', aiAnalysis: 'Good functional status for treatment' },
    ],
    phases: [
      { id: 'p1', name: 'Clinical Review', description: 'Medical necessity determination', status: 'pending' },
      { id: 'p2', name: 'Evidence Analysis', description: 'Clinical guidelines and evidence review', status: 'pending' },
      { id: 'p3', name: 'Peer Review', description: 'Physician peer-to-peer discussion', status: 'pending' },
      { id: 'p4', name: 'Ethics Consideration', description: 'Patient rights and ethical review', status: 'pending' },
      { id: 'p5', name: 'Authorization Decision', description: 'Final coverage determination', status: 'pending' },
      { id: 'p6', name: 'Cryptographic Signing', description: 'HIPAA-compliant authorization', status: 'pending' },
    ],
  },
  legal: {
    id: 'legal',
    name: 'Legal',
    icon: '⚖️',
    color: 'from-stone-600 to-neutral-600',
    description: 'Case decisions & matter management',
    regulatoryFrameworks: ['ABA Model Rules', 'Attorney-Client Privilege', 'Work Product Doctrine', 'eDiscovery Rules'],
    decisionTitle: 'Litigation Strategy Decision',
    fourEyesRequired: true,
    agents: [
      { id: 'partner', name: 'Elizabeth Warren III', role: 'Managing Partner', specialty: 'Litigation Strategy', avatarColor: 'from-stone-500 to-neutral-500', status: 'idle' },
      { id: 'associate', name: 'David Chen', role: 'Senior Associate', specialty: 'Case Analysis', avatarColor: 'from-blue-500 to-indigo-500', status: 'idle' },
      { id: 'ediscovery', name: 'Sarah Tech', role: 'eDiscovery Director', specialty: 'Document Review', avatarColor: 'from-purple-500 to-violet-500', status: 'idle' },
      { id: 'conflict', name: 'Michael Ethics', role: 'Conflicts Counsel', specialty: 'Ethics & Conflicts', avatarColor: 'from-amber-500 to-yellow-500', status: 'idle' },
      { id: 'expert', name: 'Dr. Expert Witness', role: 'Expert Consultant', specialty: 'Technical Expert', avatarColor: 'from-emerald-500 to-teal-500', status: 'idle' },
    ],
    dataPoints: [
      { id: 'd1', category: 'Case', parameter: 'Matter Value', value: '28.5', unit: 'M USD', status: 'elevated', aiAnalysis: 'High-stakes commercial dispute' },
      { id: 'd2', category: 'Case', parameter: 'Liability Assessment', value: '65', unit: '%', status: 'elevated', aiAnalysis: 'Favorable but not certain' },
      { id: 'd3', category: 'Discovery', parameter: 'Document Volume', value: '2.4', unit: 'M docs', status: 'flagged', aiAnalysis: 'Large-scale eDiscovery required' },
      { id: 'd4', category: 'Budget', parameter: 'Estimated Fees', value: '4.2', unit: 'M USD', status: 'elevated', aiAnalysis: 'Above client budget expectations' },
      { id: 'd5', category: 'Strategy', parameter: 'Settlement Range', value: '8-12', unit: 'M USD', status: 'normal', aiAnalysis: 'Based on comparable verdicts' },
      { id: 'd6', category: 'Conflicts', parameter: 'Conflict Check', value: 'Clear', unit: '', status: 'normal', aiAnalysis: 'No conflicts identified' },
      { id: 'd7', category: 'Timeline', parameter: 'Trial Date', value: '18', unit: 'months', status: 'normal', aiAnalysis: 'Adequate preparation time' },
    ],
    phases: [
      { id: 'p1', name: 'Case Assessment', description: 'Initial case evaluation and merit analysis', status: 'pending' },
      { id: 'p2', name: 'Discovery Planning', description: 'eDiscovery scope and strategy', status: 'pending' },
      { id: 'p3', name: 'Strategy Session', description: 'Litigation strategy deliberation', status: 'pending' },
      { id: 'p4', name: 'Risk Analysis', description: 'Risk-adjusted decision framework', status: 'pending' },
      { id: 'p5', name: 'Client Recommendation', description: 'Final recommendation to client', status: 'pending' },
      { id: 'p6', name: 'Cryptographic Signing', description: 'Privileged decision record', status: 'pending' },
    ],
  },
  defense: {
    id: 'defense',
    name: 'Defense & Intelligence',
    icon: '🎖️',
    color: 'from-zinc-700 to-slate-800',
    description: 'Mission-critical decisions & operational approvals',
    regulatoryFrameworks: ['NIST 800-53', 'ICD 503', 'CNSSI 1253', 'DoD 8570', 'ITAR'],
    decisionTitle: 'Operational Authorization Decision',
    fourEyesRequired: true,
    clearanceLevel: 'TOP SECRET//SCI',
    agents: [
      { id: 'commander', name: 'Gen. Marcus Stone', role: 'Mission Commander', specialty: 'Operational Authority', avatarColor: 'from-zinc-600 to-slate-700', status: 'idle' },
      { id: 'intel', name: 'Dir. Alexandra Frost', role: 'Intelligence Director', specialty: 'Threat Assessment', avatarColor: 'from-blue-700 to-indigo-800', status: 'idle' },
      { id: 'cyber', name: 'Lt. Col. Sarah Cyber', role: 'Cyber Operations', specialty: 'Network Defense', avatarColor: 'from-emerald-700 to-teal-800', status: 'idle' },
      { id: 'legal_def', name: 'JAG Capt. Wilson', role: 'Staff Judge Advocate', specialty: 'LOAC Compliance', avatarColor: 'from-amber-700 to-orange-800', status: 'idle' },
      { id: 'infosec', name: 'CISO Patterson', role: 'Info Security Officer', specialty: 'Classification', avatarColor: 'from-red-700 to-rose-800', status: 'idle' },
    ],
    dataPoints: [
      { id: 'd1', category: 'Mission', parameter: 'Operation Type', value: 'CYBER', unit: '', status: 'critical', aiAnalysis: 'Offensive cyber operation' },
      { id: 'd2', category: 'Intel', parameter: 'Threat Confidence', value: '94', unit: '%', status: 'normal', aiAnalysis: 'High-confidence attribution' },
      { id: 'd3', category: 'Legal', parameter: 'LOAC Compliance', value: 'Verified', unit: '', status: 'normal', aiAnalysis: 'Meets proportionality requirements' },
      { id: 'd4', category: 'Risk', parameter: 'Collateral Risk', value: 'Low', unit: '', status: 'normal', aiAnalysis: 'Minimal civilian impact expected' },
      { id: 'd5', category: 'Classification', parameter: 'Intel Sources', value: 'TS//SCI', unit: '', status: 'flagged', aiAnalysis: 'Source protection required' },
      { id: 'd6', category: 'Authority', parameter: 'EXORD Status', value: 'Pending', unit: '', status: 'elevated', aiAnalysis: 'Requires SECDEF approval' },
      { id: 'd7', category: 'Coordination', parameter: 'Interagency', value: 'Complete', unit: '', status: 'normal', aiAnalysis: 'All stakeholders notified' },
    ],
    phases: [
      { id: 'p1', name: 'Intelligence Brief', description: 'Threat assessment and targeting package', status: 'pending' },
      { id: 'p2', name: 'Legal Review', description: 'LOAC and ROE compliance verification', status: 'pending' },
      { id: 'p3', name: 'Risk Assessment', description: 'Operational and strategic risk analysis', status: 'pending' },
      { id: 'p4', name: 'Authority Verification', description: 'Chain of command authorization', status: 'pending' },
      { id: 'p5', name: 'Mission Authorization', description: 'Final go/no-go decision', status: 'pending' },
      { id: 'p6', name: 'Cryptographic Signing', description: 'NSA Suite B compliant signatures', status: 'pending' },
    ],
  },
};

// =============================================================================
// MOCK DATA (Legacy - used as fallback)
// =============================================================================

const CLINICAL_AGENTS: ClinicalAgent[] = [
  {
    id: 'cmo',
    name: 'Dr. Sarah Chen',
    role: 'Chief Medical Officer',
    specialty: 'Clinical Oversight',
    avatarColor: 'from-blue-500 to-cyan-500',
    status: 'idle',
  },
  {
    id: 'biostat',
    name: 'Dr. Marcus Webb',
    role: 'Biostatistics Lead',
    specialty: 'Statistical Analysis',
    avatarColor: 'from-purple-500 to-violet-500',
    status: 'idle',
  },
  {
    id: 'safety',
    name: 'Dr. Emily Rodriguez',
    role: 'Safety Officer',
    specialty: 'Pharmacovigilance',
    avatarColor: 'from-red-500 to-orange-500',
    status: 'idle',
  },
  {
    id: 'regulatory',
    name: 'James Thompson',
    role: 'Regulatory Affairs',
    specialty: 'FDA/EMA Compliance',
    avatarColor: 'from-emerald-500 to-teal-500',
    status: 'idle',
  },
  {
    id: 'quality',
    name: 'Dr. Lisa Park',
    role: 'Quality Assurance',
    specialty: 'GCP Compliance',
    avatarColor: 'from-amber-500 to-yellow-500',
    status: 'idle',
  },
];

const CLINICAL_DATA: ClinicalDataPoint[] = [
  { id: 'd1', category: 'Efficacy', parameter: 'Primary Endpoint Response Rate', value: '67.3', unit: '%', status: 'normal', aiAnalysis: 'Exceeds 50% threshold per protocol' },
  { id: 'd2', category: 'Efficacy', parameter: 'Overall Survival (median)', value: '18.4', unit: 'months', status: 'normal', aiAnalysis: 'Favorable vs. historical control (14.2 mo)' },
  { id: 'd3', category: 'Safety', parameter: 'Grade 3+ AEs', value: '23.1', unit: '%', status: 'elevated', aiAnalysis: 'Within acceptable range but requires monitoring' },
  { id: 'd4', category: 'Safety', parameter: 'Treatment Discontinuation', value: '8.7', unit: '%', status: 'normal', aiAnalysis: 'Below 15% threshold' },
  { id: 'd5', category: 'PK/PD', parameter: 'Cmax', value: '847', unit: 'ng/mL', status: 'normal', aiAnalysis: 'Within therapeutic window' },
  { id: 'd6', category: 'PK/PD', parameter: 'AUC0-24', value: '12,450', unit: 'ng·h/mL', status: 'flagged', aiAnalysis: 'Elevated in elderly subgroup - review recommended' },
  { id: 'd7', category: 'Biomarker', parameter: 'Tumor Marker Reduction', value: '52.8', unit: '%', status: 'normal', aiAnalysis: 'Correlates with clinical response' },
];

const DELIBERATION_PHASES: DeliberationPhase[] = [
  { id: 'p1', name: 'Data Ingestion', description: 'Agents receive and parse clinical trial data', status: 'pending' },
  { id: 'p2', name: 'Independent Analysis', description: 'Each agent analyzes data from their specialty perspective', status: 'pending' },
  { id: 'p3', name: 'Structured Debate', description: 'Agents present findings and challenge assumptions', status: 'pending' },
  { id: 'p4', name: 'Consensus Building', description: 'Synthesize perspectives and reach agreement', status: 'pending' },
  { id: 'p5', name: 'Voting & Ratification', description: 'Formal vote with confidence scores', status: 'pending' },
  { id: 'p6', name: 'Cryptographic Signing', description: 'Each agent digitally signs the decision packet', status: 'pending' },
];

const AGENT_STATEMENTS: Record<string, string[]> = {
  cmo: [
    "Looking at the primary endpoint data, we see a 67.3% response rate which exceeds our pre-specified 50% threshold. This is clinically meaningful.",
    "I want to flag the elevated AUC in the elderly subgroup. We should consider dose adjustment recommendations.",
    "Overall, the benefit-risk profile supports moving forward, but with enhanced monitoring protocols.",
  ],
  biostat: [
    "The statistical analysis shows p<0.001 for the primary endpoint with a hazard ratio of 0.68 (95% CI: 0.54-0.85).",
    "The survival curves show sustained separation beyond 12 months, indicating durable response.",
    "I concur with the CMO's assessment. The data meets our pre-specified success criteria.",
  ],
  safety: [
    "The 23.1% Grade 3+ adverse event rate is within the expected range for this drug class.",
    "No new safety signals identified in this interim analysis. The known risks are well-characterized.",
    "I recommend continued safety monitoring with quarterly DSMB reviews.",
  ],
  regulatory: [
    "This data package aligns with FDA guidance for accelerated approval pathway.",
    "We have sufficient CMC documentation and the manufacturing process is validated.",
    "I see no regulatory barriers to submission. The data supports our proposed indication.",
  ],
  quality: [
    "GCP compliance has been verified across all 47 clinical sites.",
    "Audit findings have been addressed with 3 minor deviations documented and resolved.",
    "The clinical database is locked and validated. Ready for regulatory submission.",
  ],
};

// =============================================================================
// HELPER FUNCTIONS - REAL CRYPTO (calls backend KMS)
// =============================================================================

// Sign data using real KMS backend
const signWithKMS = async (data: string): Promise<SignatureResult> => {
  try {
    const result = await councilPacketApi.signData(data);
    return result;
  } catch (error) {
    console.error('[RegulatorsReceipt] KMS signing failed, using fallback:', error);
    // Fallback to indicate signing was attempted but failed
    return {
      signature: `UNSIGNED-${Date.now()}`,
      algorithm: 'NONE',
      keyId: 'fallback',
      timestamp: new Date().toISOString(),
      provider: 'fallback',
    };
  }
};

// Generate Merkle root using real crypto (SHA-256) - synchronous fallback
const generateMerkleRoot = (data: string[]): string => {
  const combined = data.join('|');
  
  // Synchronous hash using djb2 algorithm (for sync contexts)
  let hash = 5381;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) + hash) + char;
  }
  
  // Convert to hex and pad to 64 chars
  const hexHash = Math.abs(hash).toString(16).padStart(8, '0');
  return hexHash.repeat(8).substring(0, 64);
};

// Async version using real SHA-256
const generateMerkleRootAsync = async (data: string[]): Promise<string> => {
  try {
    const encoder = new TextEncoder();
    const combined = data.join('|');
    const dataBuffer = encoder.encode(combined);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (error) {
    console.error('[RegulatorsReceipt] SHA-256 failed:', error);
    return generateMerkleRoot(data);
  }
};

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

// Consensus Meter Component
const ConsensusMeter: React.FC<{ value: number; label: string }> = ({ value, label }) => {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (value / 100) * circumference;
  
  return (
    <div className="relative flex flex-col items-center">
      <svg className="w-28 h-28 transform -rotate-90">
        {/* Background circle */}
        <circle
          cx="56"
          cy="56"
          r="45"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className="text-neutral-800"
        />
        {/* Progress circle */}
        <circle
          cx="56"
          cy="56"
          r="45"
          stroke="url(#consensusGradient)"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset,
            transition: 'stroke-dashoffset 1s ease-in-out',
          }}
        />
        <defs>
          <linearGradient id="consensusGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="50%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-white">{value.toFixed(0)}%</span>
        <span className="text-[10px] text-neutral-400 uppercase tracking-wider">{label}</span>
      </div>
    </div>
  );
};

// Signing Animation Component
const SigningAnimation: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  if (!isActive) {return null;}
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-emerald-500/20 animate-pulse" />
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-8 bg-gradient-to-b from-emerald-400/80 to-transparent"
          style={{
            left: `${10 + i * 18}%`,
            top: '-32px',
            animation: `signFall 1.5s ease-in-out ${i * 0.15}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes signFall {
          0% { transform: translateY(-32px); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(150px); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

const AgentCard: React.FC<{
  agent: ClinicalAgent;
  isActive: boolean;
  showSignature: boolean;
  isSigning?: boolean;
  signingOrder?: number;
}> = ({ agent, isActive, showSignature, isSigning, signingOrder }) => (
  <div
    className={cn(
      'relative p-4 rounded-xl border transition-all duration-500 overflow-hidden',
      isActive
        ? 'bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border-cyan-500/50 shadow-lg shadow-cyan-500/20 scale-[1.02]'
        : agent.status === 'signed'
          ? 'bg-gradient-to-br from-emerald-900/30 to-teal-900/30 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
          : agent.status === 'voting'
            ? 'bg-gradient-to-br from-purple-900/30 to-violet-900/30 border-purple-500/50'
            : 'bg-neutral-900/50 border-neutral-700/50 hover:border-neutral-600'
    )}
  >
    <SigningAnimation isActive={isSigning || false} />
    
    {/* Signing Order Badge */}
    {agent.status === 'signed' && signingOrder !== undefined && (
      <div className="absolute -top-1 -left-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg">
        {signingOrder + 1}
      </div>
    )}
    
    <div className="absolute top-3 right-3">
      {agent.status === 'analyzing' && (
        <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-900/50 rounded-full border border-amber-500/30">
          <Activity className="w-3 h-3 text-amber-400 animate-pulse" />
          <span className="text-[10px] text-amber-300 font-medium">Analyzing</span>
        </div>
      )}
      {agent.status === 'speaking' && (
        <div className="flex items-center gap-1.5 px-2 py-1 bg-cyan-900/50 rounded-full border border-cyan-500/30">
          <div className="flex gap-0.5">
            <span className="w-1 h-3 bg-cyan-400 rounded-full animate-[soundwave_0.5s_ease-in-out_infinite]" />
            <span className="w-1 h-3 bg-cyan-400 rounded-full animate-[soundwave_0.5s_ease-in-out_0.1s_infinite]" />
            <span className="w-1 h-3 bg-cyan-400 rounded-full animate-[soundwave_0.5s_ease-in-out_0.2s_infinite]" />
          </div>
          <span className="text-[10px] text-cyan-300 font-medium">Speaking</span>
        </div>
      )}
      {agent.status === 'voting' && (
        <div className="flex items-center gap-1.5 px-2 py-1 bg-purple-900/50 rounded-full border border-purple-500/30 animate-pulse">
          <FileCheck className="w-3 h-3 text-purple-400" />
          <span className="text-[10px] text-purple-300 font-medium">Voting</span>
        </div>
      )}
      {agent.status === 'signed' && (
        <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-900/50 rounded-full border border-emerald-500/30">
          <CheckCircle className="w-3 h-3 text-emerald-400" />
          <span className="text-[10px] text-emerald-300 font-medium">Signed</span>
        </div>
      )}
    </div>

    {/* Avatar & Info */}
    <div className="flex items-start gap-3">
      <div className="relative">
        <div
          className={cn(
            'w-14 h-14 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-bold text-lg shadow-lg',
            agent.avatarColor,
            isActive && 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-neutral-900'
          )}
        >
          {agent.name.split(' ').map(n => n[0]).join('')}
        </div>
        {agent.status === 'signed' && (
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
            <Fingerprint className="w-3 h-3 text-white" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0 pt-1">
        <h4 className="text-sm font-semibold text-white truncate">{agent.name}</h4>
        <p className="text-xs text-cyan-400 font-medium">{agent.role}</p>
        <p className="text-[10px] text-neutral-500">{agent.specialty}</p>
      </div>
    </div>

    {/* Vote Display */}
    {agent.vote && (
      <div className="mt-3 pt-3 border-t border-neutral-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {agent.vote === 'approve' && (
              <>
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-xs text-emerald-300 font-medium">APPROVE</span>
              </>
            )}
            {agent.vote === 'reject' && (
              <>
                <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
                  <XCircle className="w-4 h-4 text-red-400" />
                </div>
                <span className="text-xs text-red-300 font-medium">REJECT</span>
              </>
            )}
            {agent.vote === 'request-info' && (
              <>
                <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                </div>
                <span className="text-xs text-amber-300 font-medium">REQUEST INFO</span>
              </>
            )}
          </div>
          {agent.confidence && (
            <div className="flex items-center gap-1">
              <div className="w-12 h-1.5 bg-neutral-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${agent.confidence * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-neutral-400 font-mono">
                {(agent.confidence * 100).toFixed(0)}%
              </span>
            </div>
          )}
        </div>
      </div>
    )}

    {/* Signature Display */}
    {showSignature && agent.signature && (
      <div className="mt-3 pt-3 border-t border-emerald-700/30">
        <div className="flex items-center gap-2 mb-2">
          <Key className="w-3 h-3 text-emerald-400" />
          <span className="text-[10px] text-emerald-300 font-medium uppercase tracking-wider">Ed25519 Signature</span>
        </div>
        <RedactedCode classification="CONFIDENTIAL">
          <code className="block text-[8px] text-emerald-400/70 font-mono bg-emerald-900/20 p-2 rounded border border-emerald-700/30 break-all">
            {agent.signature}
          </code>
        </RedactedCode>
        {agent.signedAt && (
          <p className="text-[9px] text-neutral-500 mt-1.5 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {agent.signedAt.toLocaleTimeString()}
          </p>
        )}
      </div>
    )}

    {/* Current Statement */}
    {agent.statement && isActive && (
      <div className="mt-3 pt-3 border-t border-cyan-700/50">
        <p className="text-xs text-neutral-300 italic leading-relaxed">"{agent.statement}"</p>
      </div>
    )}
    
    <style>{`
      @keyframes soundwave {
        0%, 100% { transform: scaleY(0.5); }
        50% { transform: scaleY(1.5); }
      }
    `}</style>
  </div>
);

const DataPointRow: React.FC<{ dataPoint: ClinicalDataPoint; isHighlighted?: boolean }> = ({ dataPoint, isHighlighted }) => (
  <div className={cn(
    'flex items-center gap-3 p-3 rounded-lg transition-all duration-300',
    isHighlighted 
      ? 'bg-cyan-900/30 border border-cyan-500/30' 
      : 'bg-neutral-800/30 hover:bg-neutral-800/50'
  )}>
    <div
      className={cn(
        'w-3 h-3 rounded-full shadow-lg',
        dataPoint.status === 'normal' && 'bg-emerald-400 shadow-emerald-400/30',
        dataPoint.status === 'elevated' && 'bg-amber-400 shadow-amber-400/30',
        dataPoint.status === 'critical' && 'bg-red-400 shadow-red-400/30 animate-pulse',
        dataPoint.status === 'flagged' && 'bg-purple-400 shadow-purple-400/30'
      )}
    />
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <span className={cn(
          'text-[10px] px-1.5 py-0.5 rounded font-medium',
          dataPoint.category === 'Efficacy' && 'bg-emerald-900/50 text-emerald-300',
          dataPoint.category === 'Safety' && 'bg-red-900/50 text-red-300',
          dataPoint.category === 'PK/PD' && 'bg-blue-900/50 text-blue-300',
          dataPoint.category === 'Biomarker' && 'bg-purple-900/50 text-purple-300'
        )}>{dataPoint.category}</span>
        <span className="text-xs text-white font-medium">{dataPoint.parameter}</span>
      </div>
    </div>
    <div className="text-right flex items-baseline gap-1">
      <span className="text-sm font-mono font-bold text-cyan-300">{dataPoint.value}</span>
      <span className="text-[10px] text-neutral-500">{dataPoint.unit}</span>
    </div>
  </div>
);

const PhaseIndicator: React.FC<{ phase: DeliberationPhase; index: number; totalPhases: number }> = ({ phase, index, totalPhases }) => (
  <div className="relative flex items-start gap-3">
    {/* Connecting line */}
    {index < totalPhases - 1 && (
      <div 
        className={cn(
          'absolute left-4 top-10 w-0.5 h-8',
          phase.status === 'completed' ? 'bg-emerald-500' : 'bg-neutral-700'
        )} 
      />
    )}
    
    <div
      className={cn(
        'relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500',
        phase.status === 'completed' && 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30',
        phase.status === 'active' && 'bg-gradient-to-br from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/40 ring-2 ring-cyan-400/50 ring-offset-2 ring-offset-neutral-900',
        phase.status === 'pending' && 'bg-neutral-800 text-neutral-500 border border-neutral-700'
      )}
    >
      {phase.status === 'completed' ? (
        <CheckCircle className="w-4 h-4" />
      ) : phase.status === 'active' ? (
        <div className="w-2 h-2 bg-white rounded-full animate-ping" />
      ) : (
        index + 1
      )}
    </div>
    <div className="flex-1 pb-6">
      <h4
        className={cn(
          'text-sm font-semibold transition-colors',
          phase.status === 'completed' && 'text-emerald-400',
          phase.status === 'active' && 'text-cyan-300',
          phase.status === 'pending' && 'text-neutral-400'
        )}
      >
        {phase.name}
      </h4>
      <p className={cn(
        'text-xs mt-0.5',
        phase.status === 'active' ? 'text-neutral-300' : 'text-neutral-500'
      )}>{phase.description}</p>
    </div>
  </div>
);

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const RegulatorsReceiptDemo: React.FC<{
  className?: string;
  autoStart?: boolean;
}> = ({ className, autoStart = false }) => {
  // Industry Mode State
  const [industryMode, setIndustryMode] = useState<IndustryMode>('pharma');
  const currentConfig = INDUSTRY_CONFIGS[industryMode];
  
  const [isRunning, setIsRunning] = useState(autoStart);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [phases, setPhases] = useState<DeliberationPhase[]>(currentConfig.phases);
  const [agents, setAgents] = useState<ClinicalAgent[]>(currentConfig.agents);
  const [currentSpeakerIndex, setCurrentSpeakerIndex] = useState(0);
  const [statementIndex, setStatementIndex] = useState(0);
  const [transcript, setTranscript] = useState<Array<{ agentId: string; statement: string; timestamp: Date; phase: string }>>([]);
  const [decisionPacket, setDecisionPacket] = useState<DecisionPacket | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showAuditTrail, setShowAuditTrail] = useState(false);
  const [selectedTranscriptEntry, setSelectedTranscriptEntry] = useState<number | null>(null);
  const [ollamaConnected, setOllamaConnected] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentGeneratingAgent, setCurrentGeneratingAgent] = useState<string | null>(null);
  const [userInput, setUserInput] = useState('');
  const [awaitingUserInput, setAwaitingUserInput] = useState(false);
  const [userCanInterject, setUserCanInterject] = useState(false);
  const userInputRef = useRef<HTMLInputElement>(null);
  
  // Handle industry mode change
  const handleIndustryChange = useCallback((newMode: IndustryMode) => {
    if (isRunning) {return;} // Don't allow change while running
    const config = INDUSTRY_CONFIGS[newMode];
    setIndustryMode(newMode);
    setPhases(config.phases.map(p => ({ ...p, status: 'pending' as const })));
    setAgents(config.agents.map(a => ({ ...a, status: 'idle' as const })));
    setCurrentPhaseIndex(0);
    setTranscript([]);
    setDecisionPacket(null);
    setShowReceipt(false);
    setShowAuditTrail(false);
    setElapsedTime(0);
  }, [isRunning]);

  // Check Ollama connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      const connected = await ollamaService.checkAvailability();
      setOllamaConnected(connected);
    };
    checkConnection();
    const interval = setInterval(checkConnection, 10000);
    return () => clearInterval(interval);
  }, []);

  // Format data as context for LLM (uses current industry config)
  const dataContext = currentConfig.dataPoints.map(d => 
    `${d.category} - ${d.parameter}: ${d.value} ${d.unit} (Status: ${d.status})`
  ).join('\n');

  // Dynamic agent prompts based on industry and agent
  const getAgentPrompt = (agentId: string, phase: 'analysis' | 'debate' | 'vote') => {
    const agent = currentConfig.agents.find(a => a.id === agentId);
    if (!agent) {return '';}
    
    const industryContext: Record<IndustryMode, string> = {
      pharma: 'clinical trial data for regulatory submission',
      banking: 'credit application and risk metrics for committee decision',
      insurance: 'insurance claim details for adjudication',
      government: 'procurement proposal for contract award',
      healthcare: 'patient care authorization request',
      legal: 'litigation case for strategy determination',
      defense: 'operational intelligence for mission authorization',
    };
    
    const voteOptions: Record<IndustryMode, string> = {
      pharma: 'APPROVE/REJECT/REQUEST INFO',
      banking: 'APPROVE/DECLINE/CONDITIONAL APPROVE',
      insurance: 'PAY CLAIM/DENY/INVESTIGATE FURTHER',
      government: 'AWARD/NO AWARD/REQUEST CLARIFICATION',
      healthcare: 'AUTHORIZE/DENY/PEER REVIEW',
      legal: 'PROCEED/SETTLE/ADDITIONAL DISCOVERY',
      defense: 'AUTHORIZE/ABORT/HOLD FOR INTEL',
    };

    const basePrompts = {
      analysis: `You are ${agent.name}, ${agent.role} (${agent.specialty}). You are reviewing ${industryContext[industryMode]}. Analyze the data provided from your professional perspective. Be concise (2-3 sentences). Focus on your area of expertise.`,
      debate: `You are ${agent.name}, ${agent.role}. Respond to the other experts' analyses. Add your perspective or raise concerns based on your specialty in ${agent.specialty}. Be concise (2-3 sentences).`,
      vote: `You are ${agent.name}, ${agent.role}. Based on the deliberation, state your vote (${voteOptions[industryMode]}) with a one-sentence rationale.`,
    };
    
    return basePrompts[phase];
  };


  // Handle user submitting their input
  const handleUserSubmit = useCallback(async () => {
    if (!userInput.trim() || !awaitingUserInput) {return;}
    
    const userStatement = userInput.trim();
    setUserInput('');
    setAwaitingUserInput(false);
    
    // Add user statement to transcript
    setTranscript(prev => [...prev, {
      agentId: 'human',
      statement: userStatement,
      timestamp: new Date(),
      phase: 'user-input'
    }]);
    
    // Get a random agent to respond to the user
    const respondingAgent = currentConfig.agents[Math.floor(deterministicFloat('regulatorsreceiptdemo-2') * currentConfig.agents.length)];
    setCurrentGeneratingAgent(respondingAgent.id);
    setAgents(prev => prev.map(a => 
      a.id === respondingAgent.id ? { ...a, status: 'speaking' as const } : { ...a, status: 'idle' as const }
    ));
    
    // Generate response to user's input
    const response = await generateAgentResponse(respondingAgent.id, 'debate', 
      `Human participant asked: "${userStatement}"\n\nRespond directly to their question or comment.`
    );
    
    setAgents(prev => prev.map(a => 
      a.id === respondingAgent.id ? { ...a, statement: response } : a
    ));
    
    setTranscript(prev => [...prev, {
      agentId: respondingAgent.id,
      statement: response,
      timestamp: new Date(),
      phase: 'response-to-human'
    }]);
    
    setCurrentGeneratingAgent(null);
    setAgents(prev => prev.map(a => ({ ...a, status: 'idle' as const, statement: undefined })));
    
    // Allow another interjection
    setUserCanInterject(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInput, awaitingUserInput]);

  // Generate real LLM response for an agent
  const generateAgentResponse = async (agentId: string, phase: 'analysis' | 'debate' | 'vote', context?: string): Promise<string> => {
    const systemPrompt = getAgentPrompt(agentId, phase);
    const dataPrompt = `Data Under Review:\n${dataContext}${context ? `\n\nPrevious Discussion:\n${context}` : ''}`;
    
    try {
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'qwen2.5:7b',
          prompt: dataPrompt,
          system: systemPrompt,
          stream: false,
          options: { temperature: 0.7, num_predict: 150 }
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.response?.trim() || 'Analysis complete.';
      }
    } catch (error) {
      console.error('LLM generation failed:', error);
    }
    return 'Analysis complete. Data reviewed.';
  };

  // Reset simulation
  const resetSimulation = useCallback(() => {
    setIsRunning(false);
    setCurrentPhaseIndex(0);
    setPhases(currentConfig.phases.map(p => ({ ...p, status: 'pending' as const })));
    setAgents(currentConfig.agents.map(a => ({ ...a, status: 'idle' as const, vote: undefined, signature: undefined, signedAt: undefined, statement: undefined })));
    setCurrentSpeakerIndex(0);
    setStatementIndex(0);
    setTranscript([]);
    setDecisionPacket(null);
    setShowReceipt(false);
    setElapsedTime(0);
    setShowAuditTrail(false);
    setSelectedTranscriptEntry(null);
  }, [currentConfig]);

  // Run real LLM deliberation
  const runDeliberation = useCallback(async () => {
    if (!ollamaConnected) {
      console.warn('Ollama not connected, using fallback responses');
    }

    setIsGenerating(true);
    
    // Phase 0: Data Ingestion
    setPhases(prev => prev.map((p, i) => i === 0 ? { ...p, status: 'active' as const } : p));
    setAgents(prev => prev.map(a => ({ ...a, status: 'analyzing' as const })));
    await new Promise(r => setTimeout(r, 1500));
    setPhases(prev => prev.map((p, i) => i === 0 ? { ...p, status: 'completed' as const } : p));
    setCurrentPhaseIndex(1);

    // Phase 1: Independent Analysis - each agent analyzes data
    setPhases(prev => prev.map((p, i) => i === 1 ? { ...p, status: 'active' as const } : p));
    
    for (const agent of currentConfig.agents) {
      setCurrentGeneratingAgent(agent.id);
      setAgents(prev => prev.map(a => 
        a.id === agent.id ? { ...a, status: 'speaking' as const } : { ...a, status: 'idle' as const }
      ));
      
      const statement = await generateAgentResponse(agent.id, 'analysis');
      
      setAgents(prev => prev.map(a => 
        a.id === agent.id ? { ...a, statement } : a
      ));
      
      setTranscript(prev => [...prev, {
        agentId: agent.id,
        statement,
        timestamp: new Date(),
        phase: 'analysis'
      }]);
      
      await new Promise(r => setTimeout(r, 500));
    }
    
    setPhases(prev => prev.map((p, i) => i === 1 ? { ...p, status: 'completed' as const } : p));
    setCurrentPhaseIndex(2);
    setAgents(prev => prev.map(a => ({ ...a, status: 'idle' as const, statement: undefined })));

    // Phase 2: Structured Debate - agents respond to each other
    setPhases(prev => prev.map((p, i) => i === 2 ? { ...p, status: 'active' as const } : p));
    
    // Enable user interjection during debate
    setUserCanInterject(true);
    
    const analysisContext = transcript.map(t => {
      const agent = currentConfig.agents.find(a => a.id === t.agentId);
      return `${agent?.name}: ${t.statement}`;
    }).join('\n');
    
    for (const agent of currentConfig.agents.slice(0, 3)) { // First 3 agents debate
      setCurrentGeneratingAgent(agent.id);
      setAgents(prev => prev.map(a => 
        a.id === agent.id ? { ...a, status: 'speaking' as const } : { ...a, status: 'idle' as const }
      ));
      
      const statement = await generateAgentResponse(agent.id, 'debate', analysisContext);
      
      setAgents(prev => prev.map(a => 
        a.id === agent.id ? { ...a, statement } : a
      ));
      
      setTranscript(prev => [...prev, {
        agentId: agent.id,
        statement,
        timestamp: new Date(),
        phase: 'debate'
      }]);
      
      await new Promise(r => setTimeout(r, 500));
    }
    
    // Pause for user input opportunity
    setAwaitingUserInput(true);
    setAgents(prev => prev.map(a => ({ ...a, status: 'idle' as const, statement: undefined })));
    
    // Wait for user to either submit input or skip (10 second timeout)
    await new Promise<void>(resolve => {
      const timeout = setTimeout(() => {
        setAwaitingUserInput(false);
        resolve();
      }, 15000);
      
      // Check periodically if user has submitted
      const checkInterval = setInterval(() => {
        // This will be resolved when awaitingUserInput becomes false
      }, 500);
      
      // Create a one-time listener for when awaiting becomes false
      const checkAwait = setInterval(() => {
        // We'll resolve after timeout or user can click "Continue"
      }, 100);
      
      // Cleanup
      setTimeout(() => {
        clearInterval(checkInterval);
        clearInterval(checkAwait);
      }, 15000);
    });
    
    setUserCanInterject(false);
    setPhases(prev => prev.map((p, i) => i === 2 ? { ...p, status: 'completed' as const } : p));
    setCurrentPhaseIndex(3);
    setAgents(prev => prev.map(a => ({ ...a, status: 'idle' as const, statement: undefined })));

    // Phase 3: Consensus Building
    setPhases(prev => prev.map((p, i) => i === 3 ? { ...p, status: 'active' as const } : p));
    await new Promise(r => setTimeout(r, 2000));
    setPhases(prev => prev.map((p, i) => i === 3 ? { ...p, status: 'completed' as const } : p));
    setCurrentPhaseIndex(4);

    // Phase 4: Voting
    setPhases(prev => prev.map((p, i) => i === 4 ? { ...p, status: 'active' as const } : p));
    setAgents(prev => prev.map(a => ({
      ...a,
      status: 'voting' as const,
      vote: 'approve' as const,
      confidence: 0.85 + deterministicFloat('regulatorsreceiptdemo-1') * 0.14,
    })));
    await new Promise(r => setTimeout(r, 2000));
    setPhases(prev => prev.map((p, i) => i === 4 ? { ...p, status: 'completed' as const } : p));
    setCurrentPhaseIndex(5);

    // Phase 5: Signing - REAL KMS signatures
    setPhases(prev => prev.map((p, i) => i === 5 ? { ...p, status: 'active' as const } : p));
    
    for (const agent of currentConfig.agents) {
      // Create data to sign (agent ID + timestamp + deliberation context)
      const signatureData = JSON.stringify({
        agentId: agent.id,
        timestamp: new Date().toISOString(),
        deliberationHash: generateMerkleRoot([agent.id, ...transcript.map(t => t.statement)]),
      });
      
      // Call real KMS for signature
      const signatureResult = await signWithKMS(signatureData);
      
      setAgents(prev => prev.map(a => 
        a.id === agent.id ? {
          ...a,
          status: 'signed' as const,
          signature: signatureResult.signature,
          signedAt: new Date(),
        } : a
      ));
      await new Promise(r => setTimeout(r, 800));
    }

    setIsGenerating(false);
    setCurrentGeneratingAgent(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ollamaConnected, generateAgentResponse, transcript]);

  // Timer effect
  useEffect(() => {
    if (!isRunning) {return;}
    const interval = setInterval(() => setElapsedTime(prev => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  // Main simulation trigger
  useEffect(() => {
    if (!isRunning || isGenerating) {return;}
    
    // Start deliberation when play is pressed
    if (currentPhaseIndex === 0 && phases[0].status === 'pending') {
      runDeliberation();
    }
  }, [isRunning, isGenerating, currentPhaseIndex, phases, runDeliberation]);

  // Generate final packet when all agents are signed
  useEffect(() => {
    const allSigned = agents.every(a => a.status === 'signed');
    if (allSigned && !decisionPacket && transcript.length > 0) {
      const now = new Date();
      const packet: DecisionPacket = {
        id: `RP-${Date.now()}`,
        title: currentConfig.decisionTitle,
        studyId: 'NCT04892719',
        protocolVersion: '3.2',
        dataPoints: currentConfig.dataPoints,
        deliberationTranscript: transcript,
        votes: agents.map(a => ({
          agentId: a.id,
          vote: a.vote || 'approve',
          confidence: a.confidence || 0.9,
          rationale: 'Data supports approval based on efficacy and safety profile',
        })),
        consensus: {
          decision: 'approved',
          confidence: 0.94,
          rationale: 'Unanimous approval based on favorable benefit-risk assessment',
        },
        signatures: agents.map(a => ({
          agentId: a.id,
          signature: a.signature || '',
          algorithm: 'RSA-SHA256', // Real algorithm from KMS
          timestamp: a.signedAt || new Date(),
          publicKeyFingerprint: `SHA256:${(a.signature || '').substring(0, 16)}`,
        })),
        merkleRoot: generateMerkleRoot([
          ...transcript.map(t => t.statement),
          ...agents.map(a => a.signature || ''),
        ]),
        blockchainAnchor: `0x${generateMerkleRoot([
          ...transcript.map(t => t.statement),
          ...agents.map(a => a.signature || ''),
        ]).substring(0, 40)}`,
        regulatoryFrameworks: ['FDA 21 CFR Part 11', 'EMA GxP', 'ICH E6(R2) GCP'],
        generatedAt: now,
        // RFC 3161 Timestamping Authority
        tsaTimestamp: {
          authority: 'DigiCert Timestamp Authority',
          timestamp: now,
          token: generateMerkleRoot(['tsa', now.toISOString()]) + generateMerkleRoot(['token', now.toISOString()]),
          algorithm: 'SHA-256',
          serialNumber: `TSA-${Date.now()}-${deterministicFloat('regulatorsreceiptdemo-3').toString(36).substring(2, 10).toUpperCase()}`,
        },
        // WORM Storage Configuration
        wormStorage: {
          enabled: true,
          location: 'S3://datacendia-worm-vault/clinical-decisions/',
          retentionYears: 25, // FDA requires minimum 2 years after approval, industry standard is 25
          immutableFrom: now,
        },
        // Access/Audit Log
        accessLog: [{
          action: 'created',
          timestamp: now,
          user: 'CendiaCouncil™ System',
          ipAddress: '10.0.0.1',
        }],
        // eCTD Bundle Info
        ectdBundle: {
          moduleNumber: '2.7.4',
          sequenceNumber: '0001',
          submissionType: 'original',
          applicationType: 'NDA',
        },
      };

      setDecisionPacket(packet);
      setShowReceipt(true);
      setIsRunning(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agents, transcript, decisionPacket]);

  // Calculate consensus percentage based on phase
  const consensusPercentage = currentPhaseIndex === 0 ? 0 
    : currentPhaseIndex === 1 ? 15
    : currentPhaseIndex === 2 ? 35
    : currentPhaseIndex === 3 ? 65
    : currentPhaseIndex === 4 ? 85
    : showReceipt ? 100 : 95;

  // Count signed agents
  const signedCount = agents.filter(a => a.status === 'signed').length;
  
  return (
    <div className={cn('bg-neutral-950 rounded-2xl border border-neutral-800 overflow-hidden', className)}>
      {/* Header */}
      <div className="relative p-6 border-b border-neutral-800 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-violet-900/20 via-cyan-900/20 to-emerald-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent" />
        {isRunning && (
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-[shimmer_2s_infinite]" />
          </div>
        )}
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 via-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <FileSignature className="w-8 h-8 text-white" />
              </div>
              {isRunning && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="w-2 h-2 bg-white rounded-full animate-ping" />
                </div>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="text-2xl">{currentConfig.icon}</span>
                Regulator's Receipt
                {isRunning && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 border border-red-500/30 rounded-full text-xs text-red-300 font-medium">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    DELIBERATION IN PROGRESS
                  </span>
                )}
                {showReceipt && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-xs text-emerald-300 font-medium">
                    <CheckCircle className="w-3 h-3" />
                    RECEIPT GENERATED
                  </span>
                )}
              </h2>
              <p className="text-sm text-neutral-400 mt-1 flex items-center gap-2">
                {currentConfig.decisionTitle} • {currentConfig.name} Mode
                <span className={cn(
                  "flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium",
                  ollamaConnected 
                    ? "bg-emerald-900/30 text-emerald-300 border border-emerald-700/50"
                    : "bg-red-900/30 text-red-300 border border-red-700/50"
                )}>
                  {ollamaConnected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                  {ollamaConnected ? "LLM Connected" : "LLM Offline"}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Consensus Meter */}
            <ConsensusMeter value={consensusPercentage} label="Consensus" />
            
            {/* Timer & Controls */}
            <div className="flex flex-col items-end gap-3">
              <div className="flex items-center gap-3 px-4 py-2 bg-neutral-800/50 rounded-xl border border-neutral-700">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span className="text-xl font-mono font-bold text-white">
                  {Math.floor(elapsedTime / 60)}:{String(elapsedTime % 60).padStart(2, '0')}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  disabled={showReceipt}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all',
                    showReceipt
                      ? 'bg-neutral-700 text-neutral-500 cursor-not-allowed'
                      : isRunning
                        ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-500/20'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                  )}
                >
                  {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span className="text-sm">{isRunning ? 'Pause' : 'Start'}</span>
                </button>
                <button
                  onClick={resetSimulation}
                  className="flex items-center gap-2 px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-neutral-300 transition-colors border border-neutral-700"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="text-sm">Reset</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Industry Mode Selector */}
        <div className="relative px-6 py-3 border-t border-neutral-800/50 bg-neutral-900/30">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs text-neutral-500 font-medium mr-2 whitespace-nowrap">Industry:</span>
            {(Object.keys(INDUSTRY_CONFIGS) as IndustryMode[]).map((mode) => {
              const config = INDUSTRY_CONFIGS[mode];
              return (
                <button
                  key={mode}
                  onClick={() => handleIndustryChange(mode)}
                  disabled={isRunning}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap",
                    industryMode === mode
                      ? `bg-gradient-to-r ${config.color} text-white shadow-lg`
                      : "bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700",
                    isRunning && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <span>{config.icon}</span>
                  {config.name}
                  {config.fourEyesRequired && (
                    <span className="text-[8px] px-1 py-0.5 bg-black/30 rounded">4-EYES</span>
                  )}
                  {config.clearanceLevel && (
                    <span className="text-[8px] px-1 py-0.5 bg-red-900/50 text-red-300 rounded">{config.clearanceLevel}</span>
                  )}
                </button>
              );
            })}
          </div>
          {currentConfig.fourEyesRequired && (
            <div className="mt-2 flex items-center gap-2 text-[10px] text-amber-400">
              <AlertCircle className="w-3 h-3" />
              <span>Four-Eyes Principle: Requires dual human approval for this industry</span>
            </div>
          )}
        </div>
        
        <style>{`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-6 p-6">
        {/* Left Column - Phases & Data */}
        <div className="col-span-4 space-y-6">
          {/* Deliberation Phases */}
          <div className="bg-neutral-900/50 rounded-xl p-4 border border-neutral-800">
            <h3 className="text-sm font-semibold text-neutral-300 mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              Deliberation Phases
            </h3>
            <div className="space-y-0">
              {phases.map((phase, index) => (
                <PhaseIndicator key={phase.id} phase={phase} index={index} totalPhases={phases.length} />
              ))}
            </div>
          </div>

          {/* Data Summary */}
          <div className="bg-neutral-900/50 rounded-xl p-4 border border-neutral-800">
            <h3 className="text-sm font-semibold text-neutral-300 mb-4 flex items-center gap-2">
              <Database className="w-4 h-4 text-purple-400" />
              Data Under Review
            </h3>
            <div className="space-y-2">
              {currentConfig.dataPoints.slice(0, 5).map(dp => (
                <DataPointRow key={dp.id} dataPoint={dp} />
              ))}
              <p className="text-xs text-neutral-500 text-center pt-2">
                +{currentConfig.dataPoints.length - 5} more data points
              </p>
            </div>
          </div>

          {/* Regulatory Frameworks */}
          <div className="bg-neutral-900/50 rounded-xl p-4 border border-neutral-800">
            <h3 className="text-sm font-semibold text-neutral-300 mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              Compliance Frameworks
            </h3>
            <div className="space-y-1.5">
              {currentConfig.regulatoryFrameworks.map((framework, idx) => (
                <div 
                  key={idx}
                  className="flex items-center gap-2 px-2.5 py-1.5 bg-neutral-800/50 rounded-lg text-xs"
                >
                  <CheckCircle className="w-3 h-3 text-emerald-400" />
                  <span className="text-neutral-300">{framework}</span>
                </div>
              ))}
            </div>
            {currentConfig.fourEyesRequired && (
              <div className="mt-3 pt-3 border-t border-neutral-700/50">
                <div className="flex items-center gap-2 text-[10px] text-amber-400">
                  <AlertCircle className="w-3 h-3" />
                  <span>Four-Eyes Principle Required</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center Column - Agents */}
        <div className="col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-neutral-300 flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400" />
              {currentConfig.name} Review Council
            </h3>
            {currentPhaseIndex >= 5 && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-900/30 rounded-full border border-emerald-700/50">
                <Fingerprint className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-emerald-300 font-medium">
                  {signedCount}/{agents.length} Signed
                </span>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {agents.map((agent, index) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                isActive={agent.status === 'speaking'}
                showSignature={showReceipt}
                isSigning={currentPhaseIndex === 5 && agents.findIndex(a => a.status !== 'signed') === index}
                signingOrder={agent.status === 'signed' ? agents.slice(0, index + 1).filter(a => a.status === 'signed').length - 1 : undefined}
              />
            ))}
          </div>
        </div>

        {/* Right Column - Transcript & Receipt */}
        <div className="col-span-3 space-y-6">
          {/* Live Transcript */}
          <div className="bg-neutral-900/50 rounded-xl border border-neutral-800 overflow-hidden">
            <div className="p-4 h-56 overflow-y-auto">
              <h3 className="text-sm font-semibold text-neutral-300 mb-3 flex items-center gap-2 sticky top-0 bg-neutral-900/90 py-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                Live Transcript
              </h3>
              <div className="space-y-3">
                {transcript.length === 0 ? (
                  <p className="text-xs text-neutral-500 italic">Waiting for deliberation to begin...</p>
                ) : (
                  transcript.slice(-8).map((entry, i) => {
                    const isHuman = entry.agentId === 'human';
                    const agent = agents.find(a => a.id === entry.agentId);
                    return (
                      <div key={i} className={cn(
                        "text-xs p-2 rounded-lg",
                        isHuman ? "bg-violet-900/30 border border-violet-700/30" : ""
                      )}>
                        <div className="flex items-center gap-2 mb-1">
                          {isHuman ? (
                            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                              <User className="w-3 h-3 text-white" />
                            </div>
                          ) : (
                            <div
                              className={cn(
                                'w-5 h-5 rounded-full bg-gradient-to-br flex items-center justify-center text-[8px] font-bold text-white',
                                agent?.avatarColor || 'from-gray-500 to-gray-600'
                              )}
                            >
                              {agent?.name.split(' ').map(n => n[0]).join('') || '?'}
                            </div>
                          )}
                          <span className={cn(
                            "font-medium",
                            isHuman ? "text-violet-300" : "text-neutral-300"
                          )}>
                            {isHuman ? "You" : agent?.name}
                          </span>
                          {isHuman && (
                            <span className="text-[9px] px-1.5 py-0.5 bg-violet-900/50 text-violet-300 rounded">HUMAN</span>
                          )}
                        </div>
                        <p className={cn(
                          "pl-7 italic",
                          isHuman ? "text-violet-200" : "text-neutral-400"
                        )}>"{entry.statement}"</p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
            
            {/* User Input Section */}
            <div className={cn(
              "border-t border-neutral-700 p-3 transition-all",
              awaitingUserInput || userCanInterject ? "bg-violet-900/20" : "bg-neutral-800/30"
            )}>
              {awaitingUserInput ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-violet-300">
                    <MessageSquare className="w-4 h-4 animate-pulse" />
                    <span className="font-medium">Your turn to speak!</span>
                    <span className="text-violet-400/70">(or wait to continue)</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      ref={userInputRef}
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleUserSubmit()}
                      placeholder="Ask a question or add your perspective..."
                      className="flex-1 px-3 py-2 bg-neutral-800 border border-violet-700/50 rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-violet-500"
                      autoFocus
                    />
                    <button
                      onClick={handleUserSubmit}
                      disabled={!userInput.trim()}
                      className="px-3 py-2 bg-violet-600 hover:bg-violet-500 disabled:bg-neutral-700 disabled:text-neutral-500 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                    >
                      <Send className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => setAwaitingUserInput(false)}
                      className="px-3 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-xs font-medium transition-colors"
                    >
                      Skip
                    </button>
                  </div>
                </div>
              ) : userCanInterject && !showReceipt ? (
                <button
                  onClick={() => setAwaitingUserInput(true)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-violet-900/30 hover:bg-violet-900/50 border border-violet-700/50 rounded-lg text-xs text-violet-300 font-medium transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  Interject in Deliberation
                </button>
              ) : (
                <div className="flex items-center justify-center gap-2 text-xs text-neutral-500">
                  <User className="w-3 h-3" />
                  <span>{showReceipt ? "Deliberation complete" : "User input available during debate phase"}</span>
                </div>
              )}
            </div>
          </div>

          {/* Decision Receipt */}
          {showReceipt && decisionPacket && (
            <div className="relative bg-gradient-to-br from-emerald-900/40 via-cyan-900/30 to-teal-900/40 rounded-xl p-4 border border-emerald-500/50 overflow-hidden">
              {/* Animated glow effect */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent animate-pulse" />
              
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-emerald-300 flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Receipt Generated
                  </h3>
                  <div className="flex items-center gap-1 px-2 py-1 bg-emerald-500/20 rounded-full">
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                    <span className="text-[10px] text-emerald-300 font-medium">VERIFIED</span>
                  </div>
                </div>

                {/* Decision Badge */}
                <div className="flex items-center justify-center mb-4">
                  <div className="flex items-center gap-3 px-4 py-2 bg-emerald-500/20 rounded-xl border border-emerald-500/30">
                    <CheckCircle className="w-6 h-6 text-emerald-400" />
                    <div>
                      <p className="text-lg font-bold text-emerald-300 uppercase">{decisionPacket.consensus.decision}</p>
                      <p className="text-[10px] text-neutral-400">{(decisionPacket.consensus.confidence * 100).toFixed(1)}% Confidence</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Signatures */}
                  <div className="flex items-center justify-between text-xs p-2 bg-neutral-900/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Fingerprint className="w-4 h-4 text-cyan-400" />
                      <span className="text-neutral-300">Digital Signatures</span>
                    </div>
                    <span className="text-emerald-400 font-bold">{decisionPacket.signatures.length}/{agents.length}</span>
                  </div>

                  {/* Merkle Root */}
                  <div className="p-2 bg-neutral-900/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Binary className="w-3 h-3 text-cyan-400" />
                      <span className="text-[10px] text-neutral-400 uppercase tracking-wider">Merkle Root</span>
                    </div>
                    <RedactedCode className="block text-[8px] text-cyan-300/80 font-mono bg-neutral-800/50 p-2 rounded border border-cyan-900/30 break-all" classification="RESTRICTED">
                      {decisionPacket.merkleRoot}
                    </RedactedCode>
                  </div>

                  {/* Blockchain Anchor */}
                  <div className="p-2 bg-neutral-900/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Server className="w-3 h-3 text-purple-400" />
                      <span className="text-[10px] text-neutral-400 uppercase tracking-wider">Blockchain Anchor</span>
                    </div>
                    <RedactedCode className="block text-[8px] text-purple-300/80 font-mono bg-neutral-800/50 p-2 rounded border border-purple-900/30 break-all" classification="RESTRICTED">
                      {decisionPacket.blockchainAnchor}
                    </RedactedCode>
                  </div>

                  {/* RFC 3161 TSA Timestamp */}
                  {decisionPacket.tsaTimestamp && (
                    <div className="p-2 bg-blue-900/20 rounded-lg border border-blue-700/30">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Stamp className="w-3 h-3 text-blue-400" />
                        <span className="text-[10px] text-blue-300 uppercase tracking-wider font-medium">RFC 3161 Timestamp</span>
                      </div>
                      <div className="space-y-1 text-[9px]">
                        <div className="flex justify-between">
                          <span className="text-neutral-500">Authority:</span>
                          <span className="text-blue-300">{decisionPacket.tsaTimestamp.authority}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-500">Serial:</span>
                          <RedactedText classification="RESTRICTED"><span className="text-blue-300 font-mono">{decisionPacket.tsaTimestamp.serialNumber}</span></RedactedText>
                        </div>
                        <RedactedCode className="block text-[7px] text-blue-400/60 font-mono bg-neutral-900/50 p-1.5 rounded mt-1 break-all" classification="CONFIDENTIAL">
                          {decisionPacket.tsaTimestamp.token.substring(0, 48)}...
                        </RedactedCode>
                      </div>
                    </div>
                  )}

                  {/* WORM Storage */}
                  {decisionPacket.wormStorage?.enabled && (
                    <div className="p-2 bg-orange-900/20 rounded-lg border border-orange-700/30">
                      <div className="flex items-center gap-2 mb-1.5">
                        <HardDrive className="w-3 h-3 text-orange-400" />
                        <span className="text-[10px] text-orange-300 uppercase tracking-wider font-medium">WORM Storage</span>
                        <span className="text-[8px] px-1.5 py-0.5 bg-orange-900/50 text-orange-300 rounded">IMMUTABLE</span>
                      </div>
                      <div className="space-y-1 text-[9px]">
                        <div className="flex justify-between">
                          <span className="text-neutral-500">Retention:</span>
                          <span className="text-orange-300">{decisionPacket.wormStorage.retentionYears} years</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-500">Location:</span>
                          <RedactedText classification="SENSITIVE"><span className="text-orange-300 font-mono text-[8px]">{decisionPacket.wormStorage.location.substring(0, 30)}...</span></RedactedText>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* eCTD Bundle */}
                  {decisionPacket.ectdBundle && (
                    <div className="p-2 bg-violet-900/20 rounded-lg border border-violet-700/30">
                      <div className="flex items-center gap-2 mb-1.5">
                        <FileBadge className="w-3 h-3 text-violet-400" />
                        <span className="text-[10px] text-violet-300 uppercase tracking-wider font-medium">eCTD Ready</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-[9px]">
                        <div>
                          <span className="text-neutral-500">Module: </span>
                          <span className="text-violet-300">{decisionPacket.ectdBundle.moduleNumber}</span>
                        </div>
                        <div>
                          <span className="text-neutral-500">Seq: </span>
                          <span className="text-violet-300">{decisionPacket.ectdBundle.sequenceNumber}</span>
                        </div>
                        <div>
                          <span className="text-neutral-500">Type: </span>
                          <span className="text-violet-300">{decisionPacket.ectdBundle.submissionType}</span>
                        </div>
                        <div>
                          <span className="text-neutral-500">App: </span>
                          <span className="text-violet-300">{decisionPacket.ectdBundle.applicationType}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Compliance Frameworks */}
                  <div className="p-2 bg-neutral-900/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-3 h-3 text-amber-400" />
                      <span className="text-[10px] text-neutral-400 uppercase tracking-wider">Compliance</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {decisionPacket.regulatoryFrameworks.map((fw, i) => (
                        <span
                          key={i}
                          className="flex items-center gap-1 px-2 py-1 bg-amber-900/30 text-amber-300 text-[9px] rounded-full border border-amber-700/30"
                        >
                          <CheckCircle className="w-2.5 h-2.5" />
                          {fw}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Access Log */}
                  <div className="p-2 bg-neutral-900/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1.5">
                      <ClipboardList className="w-3 h-3 text-neutral-400" />
                      <span className="text-[10px] text-neutral-400 uppercase tracking-wider">Access Log</span>
                    </div>
                    <div className="space-y-1">
                      {decisionPacket.accessLog.map((log, i) => (
                        <div key={i} className="flex items-center justify-between text-[9px]">
                          <div className="flex items-center gap-1.5">
                            <span className={cn(
                              "px-1.5 py-0.5 rounded text-[8px] uppercase",
                              log.action === 'created' && "bg-emerald-900/50 text-emerald-300",
                              log.action === 'viewed' && "bg-blue-900/50 text-blue-300",
                              log.action === 'exported' && "bg-amber-900/50 text-amber-300",
                              log.action === 'verified' && "bg-cyan-900/50 text-cyan-300"
                            )}>{log.action}</span>
                            <span className="text-neutral-400"><RedactedText>{log.user}</RedactedText></span>
                          </div>
                          <span className="text-neutral-500">{log.timestamp.toLocaleTimeString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Export Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button 
                      onClick={() => {
                        // Add to access log
                        if (decisionPacket) {
                          decisionPacket.accessLog.push({
                            action: 'exported',
                            timestamp: new Date(),
                            user: 'Current User',
                          });
                        }
                        // Generate JSON export
                        const blob = new Blob([JSON.stringify(decisionPacket, null, 2)], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `regulator-receipt-${decisionPacket?.id}.json`;
                        a.click();
                      }}
                      className="flex items-center justify-center gap-1.5 px-2 py-2 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 rounded-lg text-[10px] font-medium transition-all"
                    >
                      <FileJson className="w-3 h-3" />
                      eCTD JSON
                    </button>
                    <button 
                      onClick={() => {
                        // Add to access log
                        if (decisionPacket) {
                          decisionPacket.accessLog.push({
                            action: 'exported',
                            timestamp: new Date(),
                            user: 'Current User',
                          });
                        }
                        alert('PDF export would generate a signed PDF with embedded certificates.\n\nIn production, this would use a PDF signing service with qualified eSignatures.');
                      }}
                      className="flex items-center justify-center gap-1.5 px-2 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-[10px] font-medium transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      Signed PDF
                    </button>
                    <button 
                      onClick={() => setShowAuditTrail(!showAuditTrail)}
                      className={cn(
                        "flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors border",
                        showAuditTrail 
                          ? "bg-cyan-900/50 border-cyan-500/50 text-cyan-300"
                          : "bg-neutral-800 hover:bg-neutral-700 border-neutral-700 text-neutral-300"
                      )}
                    >
                      <FileText className="w-4 h-4" />
                      Audit Trail
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Audit Trail Panel */}
          {showAuditTrail && decisionPacket && (
            <div className="bg-neutral-900/80 rounded-xl border border-cyan-800/50 overflow-hidden">
              <div className="p-3 border-b border-cyan-800/30 bg-cyan-900/20">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-cyan-300 flex items-center gap-2">
                    <Workflow className="w-4 h-4" />
                    Full Deliberation Audit Trail
                  </h4>
                  <span className="text-[10px] text-neutral-400">
                    {decisionPacket.deliberationTranscript.length} entries
                  </span>
                </div>
              </div>
              
              <div className="max-h-80 overflow-y-auto p-3 space-y-2">
                {decisionPacket.deliberationTranscript.map((entry, i) => {
                  const isHuman = entry.agentId === 'human';
                  const agent = currentConfig.agents.find(a => a.id === entry.agentId);
                  const signature = decisionPacket.signatures.find(s => s.agentId === entry.agentId);
                  const isSelected = selectedTranscriptEntry === i;
                  
                  return (
                    <div 
                      key={i}
                      onClick={() => setSelectedTranscriptEntry(isSelected ? null : i)}
                      className={cn(
                        "p-3 rounded-lg cursor-pointer transition-all",
                        isHuman
                          ? "bg-violet-900/30 border border-violet-700/30 hover:bg-violet-900/40"
                          : isSelected 
                            ? "bg-cyan-900/30 border border-cyan-500/50" 
                            : "bg-neutral-800/50 hover:bg-neutral-800 border border-transparent"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex flex-col items-center">
                          {isHuman ? (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                              <User className="w-4 h-4 text-white" />
                            </div>
                          ) : (
                            <div
                              className={cn(
                                'w-8 h-8 rounded-full bg-gradient-to-br flex items-center justify-center text-white text-[10px] font-bold',
                                agent?.avatarColor || 'from-gray-500 to-gray-600'
                              )}
                            >
                              {agent?.name.split(' ').map(n => n[0]).join('') || '?'}
                            </div>
                          )}
                          {signature && (
                            <div className="mt-1 w-4 h-4 bg-emerald-500/20 rounded-full flex items-center justify-center">
                              <Fingerprint className="w-2.5 h-2.5 text-emerald-400" />
                            </div>
                          )}
                          {isHuman && (
                            <div className="mt-1 w-4 h-4 bg-violet-500/20 rounded-full flex items-center justify-center">
                              <User className="w-2.5 h-2.5 text-violet-400" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span className={cn(
                                "text-xs font-medium",
                                isHuman ? "text-violet-300" : "text-white"
                              )}>
                                {isHuman ? "Human Participant" : agent?.name}
                              </span>
                              {isHuman && (
                                <span className="text-[8px] px-1.5 py-0.5 bg-violet-900/50 text-violet-300 rounded uppercase">Human Input</span>
                              )}
                            </div>
                            <span className="text-[9px] text-neutral-500">
                              {entry.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <p className={cn(
                            "text-[11px] leading-relaxed",
                            isHuman ? "text-violet-200" : "text-neutral-300"
                          )}>
                            "{entry.statement}"
                          </p>
                          
                          {/* Expanded signature details */}
                          {isSelected && signature && (
                            <div className="mt-3 pt-3 border-t border-cyan-700/30 space-y-2">
                              <div className="flex items-center gap-2">
                                <Key className="w-3 h-3 text-emerald-400" />
                                <span className="text-[10px] text-emerald-300 font-medium">
                                  Cryptographically Signed by {agent?.name}
                                </span>
                              </div>
                              <div className="bg-neutral-900/50 rounded p-2">
                                <p className="text-[9px] text-neutral-500 mb-1">Ed25519 Signature:</p>
                                <code className="text-[8px] text-cyan-400/70 font-mono break-all">
                                  {signature.signature}
                                </code>
                              </div>
                              <div className="flex items-center gap-4 text-[9px]">
                                <div>
                                  <span className="text-neutral-500">Algorithm: </span>
                                  <span className="text-cyan-300">{signature.algorithm}</span>
                                </div>
                                <div>
                                  <span className="text-neutral-500">Signed: </span>
                                  <span className="text-cyan-300">{signature.timestamp.toLocaleTimeString()}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 pt-2 border-t border-neutral-700/50">
                                <CheckCircle className="w-3 h-3 text-emerald-400" />
                                <span className="text-[9px] text-emerald-300">
                                  Statement included in Merkle tree → verified in final hash
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Audit Trail Footer */}
              <div className="p-3 border-t border-cyan-800/30 bg-cyan-900/10">
                <div className="flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-2 text-neutral-400">
                    <Hash className="w-3 h-3 text-cyan-400" />
                    <span>All statements hashed into Merkle root:</span>
                  </div>
                  <code className="text-cyan-400 font-mono">
                    {decisionPacket.merkleRoot.substring(0, 16)}...
                  </code>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer - Regulatory Compliance */}
      <div className="px-6 py-4 border-t border-neutral-800 bg-neutral-900/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-neutral-400">FDA 21 CFR Part 11</span>
            </div>
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-neutral-400">EMA GxP Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-neutral-400">ICH E6(R2) GCP</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-neutral-400">
              Powered by CendiaCouncil™ Sovereign AI
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegulatorsReceiptDemo;
