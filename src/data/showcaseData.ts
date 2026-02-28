// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIA SHOWCASE DATA - COMPREHENSIVE DEMO DATA FOR ALL SERVICES
// =============================================================================
// This file provides realistic, industry-specific demo data for showcasing
// Cendia's Decision Intelligence platform across all verticals and services.
//
// VERTICALS: Healthcare/Genomics, Defense/Government, Financial Services
// SERVICES: Core Suite, Trust Layer, Sovereign Tier
// =============================================================================

// =============================================================================
// TYPES
// =============================================================================

export type Vertical = 'healthcare' | 'defense' | 'financial' | 'general';
export type ServiceTier = 'core' | 'trust' | 'sovereign' | 'vertical';
export type DecisionStatus = 'pending' | 'in_progress' | 'approved' | 'rejected' | 'escalated';
export type RiskLevel = 'critical' | 'high' | 'medium' | 'low' | 'minimal';
export type Urgency = 'immediate' | 'urgent' | 'standard' | 'low';

// =============================================================================
// COMPANY PROFILES BY VERTICAL
// =============================================================================

export interface CompanyProfile {
  id: string;
  name: string;
  vertical: Vertical;
  industry: string;
  size: 'enterprise' | 'mid-market' | 'startup';
  employees: number;
  revenue: string;
  headquarters: string;
  logo?: string;
}

export const COMPANY_PROFILES: Record<Vertical, CompanyProfile> = {
  healthcare: {
    id: 'meridian-health',
    name: 'Meridian Health Systems',
    vertical: 'healthcare',
    industry: 'Integrated Healthcare Network',
    size: 'enterprise',
    employees: 45000,
    revenue: '$12.4B',
    headquarters: 'Boston, MA',
  },
  defense: {
    id: 'aegis-dynamics',
    name: 'Aegis Dynamics Corp',
    vertical: 'defense',
    industry: 'Defense & Aerospace',
    size: 'enterprise',
    employees: 28000,
    revenue: '$8.7B',
    headquarters: 'Arlington, VA',
  },
  financial: {
    id: 'atlas-capital',
    name: 'Atlas Capital Partners',
    vertical: 'financial',
    industry: 'Investment Banking & Asset Management',
    size: 'enterprise',
    employees: 12000,
    revenue: '$4.2B',
    headquarters: 'New York, NY',
  },
  general: {
    id: 'nexus-corp',
    name: 'Nexus Corporation',
    vertical: 'general',
    industry: 'Technology Conglomerate',
    size: 'enterprise',
    employees: 85000,
    revenue: '$32.1B',
    headquarters: 'San Francisco, CA',
  },
};

// =============================================================================
// EXECUTIVE PERSONAS
// =============================================================================

export interface Executive {
  id: string;
  name: string;
  title: string;
  department: string;
  avatar?: string;
  vertical: Vertical;
}

export const EXECUTIVES: Record<Vertical, Executive[]> = {
  healthcare: [
    { id: 'exec-h1', name: 'Dr. Sarah Chen', title: 'Chief Medical Officer', department: 'Clinical Operations', vertical: 'healthcare' },
    { id: 'exec-h2', name: 'Michael Torres', title: 'CEO', department: 'Executive', vertical: 'healthcare' },
    { id: 'exec-h3', name: 'Jennifer Park', title: 'Chief Compliance Officer', department: 'Regulatory', vertical: 'healthcare' },
    { id: 'exec-h4', name: 'David Kim', title: 'CFO', department: 'Finance', vertical: 'healthcare' },
    { id: 'exec-h5', name: 'Dr. Robert Williams', title: 'Chief Research Officer', department: 'R&D', vertical: 'healthcare' },
    { id: 'exec-h6', name: 'Lisa Anderson', title: 'Chief Nursing Officer', department: 'Patient Care', vertical: 'healthcare' },
  ],
  defense: [
    { id: 'exec-d1', name: 'Gen. James Mitchell (Ret.)', title: 'CEO', department: 'Executive', vertical: 'defense' },
    { id: 'exec-d2', name: 'Dr. Elena Vasquez', title: 'Chief Technology Officer', department: 'Engineering', vertical: 'defense' },
    { id: 'exec-d3', name: 'Col. Marcus Johnson (Ret.)', title: 'VP Programs', department: 'Defense Programs', vertical: 'defense' },
    { id: 'exec-d4', name: 'Catherine Liu', title: 'Chief Security Officer', department: 'Security', vertical: 'defense' },
    { id: 'exec-d5', name: 'Thomas Wright', title: 'CFO', department: 'Finance', vertical: 'defense' },
    { id: 'exec-d6', name: 'Dr. Amir Hassan', title: 'Chief Scientist', department: 'Advanced Research', vertical: 'defense' },
  ],
  financial: [
    { id: 'exec-f1', name: 'Victoria Sterling', title: 'CEO', department: 'Executive', vertical: 'financial' },
    { id: 'exec-f2', name: 'Jonathan Blake', title: 'Chief Investment Officer', department: 'Investments', vertical: 'financial' },
    { id: 'exec-f3', name: 'Margaret Chen', title: 'Chief Risk Officer', department: 'Risk Management', vertical: 'financial' },
    { id: 'exec-f4', name: 'Richard Nakamura', title: 'Chief Compliance Officer', department: 'Compliance', vertical: 'financial' },
    { id: 'exec-f5', name: 'Samantha Rodriguez', title: 'Head of Trading', department: 'Trading', vertical: 'financial' },
    { id: 'exec-f6', name: 'Alexander Petrov', title: 'CFO', department: 'Finance', vertical: 'financial' },
  ],
  general: [
    { id: 'exec-g1', name: 'Alexandra Reyes', title: 'CEO', department: 'Executive', vertical: 'general' },
    { id: 'exec-g2', name: 'Benjamin Foster', title: 'COO', department: 'Operations', vertical: 'general' },
    { id: 'exec-g3', name: 'Christine Wu', title: 'CTO', department: 'Technology', vertical: 'general' },
    { id: 'exec-g4', name: 'Daniel Okonkwo', title: 'CFO', department: 'Finance', vertical: 'general' },
    { id: 'exec-g5', name: 'Emily Johansson', title: 'Chief People Officer', department: 'HR', vertical: 'general' },
    { id: 'exec-g6', name: 'Frank Martinez', title: 'General Counsel', department: 'Legal', vertical: 'general' },
  ],
};

// =============================================================================
// DECISIONS BY VERTICAL
// =============================================================================

export interface Decision {
  id: string;
  title: string;
  description: string;
  vertical: Vertical;
  status: DecisionStatus;
  risk: RiskLevel;
  urgency: Urgency;
  stakeholders: string[];
  financialImpact: string;
  deadline: Date;
  createdAt: Date;
  category: string;
  aiConfidence: number;
  dissent?: { count: number; severity: 'minor' | 'significant' | 'critical' };
}

export const DECISIONS: Record<Vertical, Decision[]> = {
  healthcare: [
    {
      id: 'dec-h1',
      title: 'FDA 510(k) Submission Strategy for AI Diagnostic Tool',
      description: 'Determine regulatory pathway for new AI-powered diagnostic imaging system. Options include 510(k), De Novo, or PMA routes.',
      vertical: 'healthcare',
      status: 'in_progress',
      risk: 'high',
      urgency: 'urgent',
      stakeholders: ['Dr. Sarah Chen', 'Jennifer Park', 'Dr. Robert Williams'],
      financialImpact: '$45M revenue at risk',
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      category: 'Regulatory',
      aiConfidence: 0.78,
      dissent: { count: 2, severity: 'significant' },
    },
    {
      id: 'dec-h2',
      title: 'Clinical Trial Phase III Go/No-Go for Oncology Drug',
      description: 'Based on Phase II results, decide whether to proceed with $120M Phase III investment for novel immunotherapy.',
      vertical: 'healthcare',
      status: 'pending',
      risk: 'critical',
      urgency: 'immediate',
      stakeholders: ['Michael Torres', 'Dr. Robert Williams', 'David Kim'],
      financialImpact: '$120M investment decision',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      category: 'R&D Investment',
      aiConfidence: 0.65,
      dissent: { count: 3, severity: 'critical' },
    },
    {
      id: 'dec-h3',
      title: 'Hospital Acquisition: Regional Medical Center',
      description: 'Evaluate acquisition of 450-bed regional hospital to expand network coverage in underserved market.',
      vertical: 'healthcare',
      status: 'in_progress',
      risk: 'high',
      urgency: 'standard',
      stakeholders: ['Michael Torres', 'David Kim', 'Lisa Anderson'],
      financialImpact: '$380M acquisition',
      deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      category: 'M&A',
      aiConfidence: 0.82,
    },
    {
      id: 'dec-h4',
      title: 'EHR System Migration to Cloud Platform',
      description: 'Migrate legacy EHR system to cloud-native platform. HIPAA compliance and data migration risks to evaluate.',
      vertical: 'healthcare',
      status: 'approved',
      risk: 'medium',
      urgency: 'standard',
      stakeholders: ['Jennifer Park', 'Dr. Sarah Chen'],
      financialImpact: '$28M implementation cost',
      deadline: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
      category: 'Technology',
      aiConfidence: 0.91,
    },
    {
      id: 'dec-h5',
      title: 'Nursing Staff Ratio Policy Change',
      description: 'Implement new nurse-to-patient ratios across ICU and Med-Surg units. Union negotiations required.',
      vertical: 'healthcare',
      status: 'escalated',
      risk: 'medium',
      urgency: 'urgent',
      stakeholders: ['Lisa Anderson', 'Michael Torres'],
      financialImpact: '$15M annual labor cost increase',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      category: 'Operations',
      aiConfidence: 0.73,
      dissent: { count: 1, severity: 'minor' },
    },
  ],
  defense: [
    {
      id: 'dec-d1',
      title: 'Next-Gen Fighter Program Bid Decision',
      description: 'Submit $4.2B bid for NGAD program. Requires commitment to new manufacturing facility and workforce expansion.',
      vertical: 'defense',
      status: 'in_progress',
      risk: 'critical',
      urgency: 'immediate',
      stakeholders: ['Gen. James Mitchell', 'Dr. Elena Vasquez', 'Thomas Wright'],
      financialImpact: '$4.2B contract opportunity',
      deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
      category: 'Strategic Bid',
      aiConfidence: 0.71,
      dissent: { count: 2, severity: 'significant' },
    },
    {
      id: 'dec-d2',
      title: 'Classified AI System Deployment Authorization',
      description: 'Authorize deployment of AI-assisted threat detection system to allied nation. Export control and ITAR compliance review.',
      vertical: 'defense',
      status: 'pending',
      risk: 'high',
      urgency: 'urgent',
      stakeholders: ['Catherine Liu', 'Col. Marcus Johnson', 'Dr. Amir Hassan'],
      financialImpact: '$890M export contract',
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      category: 'Export Control',
      aiConfidence: 0.84,
    },
    {
      id: 'dec-d3',
      title: 'Cybersecurity Incident Response: Supply Chain Breach',
      description: 'Respond to detected intrusion in Tier 2 supplier network. Potential exposure of classified program data.',
      vertical: 'defense',
      status: 'escalated',
      risk: 'critical',
      urgency: 'immediate',
      stakeholders: ['Catherine Liu', 'Gen. James Mitchell', 'Dr. Elena Vasquez'],
      financialImpact: '$200M+ liability exposure',
      deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      category: 'Security Incident',
      aiConfidence: 0.92,
      dissent: { count: 1, severity: 'critical' },
    },
    {
      id: 'dec-d4',
      title: 'Manufacturing Facility Expansion: Arizona Site',
      description: 'Approve $450M expansion of Arizona manufacturing facility for hypersonic weapons program.',
      vertical: 'defense',
      status: 'approved',
      risk: 'medium',
      urgency: 'standard',
      stakeholders: ['Thomas Wright', 'Col. Marcus Johnson'],
      financialImpact: '$450M capital investment',
      deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
      category: 'Capital Investment',
      aiConfidence: 0.88,
    },
    {
      id: 'dec-d5',
      title: 'Workforce Clearance Upgrade Program',
      description: 'Implement accelerated TS/SCI clearance program for 2,000 engineers. Partnership with OPM required.',
      vertical: 'defense',
      status: 'in_progress',
      risk: 'low',
      urgency: 'standard',
      stakeholders: ['Catherine Liu', 'Gen. James Mitchell'],
      financialImpact: '$12M program cost',
      deadline: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      category: 'Human Resources',
      aiConfidence: 0.95,
    },
  ],
  financial: [
    {
      id: 'dec-f1',
      title: 'Algorithmic Trading Strategy Deployment',
      description: 'Deploy new ML-based trading algorithm for fixed income desk. $2B AUM exposure. Regulatory and model risk review.',
      vertical: 'financial',
      status: 'in_progress',
      risk: 'high',
      urgency: 'urgent',
      stakeholders: ['Samantha Rodriguez', 'Margaret Chen', 'Jonathan Blake'],
      financialImpact: '$2B AUM at risk',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      category: 'Trading',
      aiConfidence: 0.76,
      dissent: { count: 2, severity: 'significant' },
    },
    {
      id: 'dec-f2',
      title: 'Private Equity Fund Launch: Infrastructure Focus',
      description: 'Launch $5B infrastructure-focused PE fund. LP commitments and regulatory filings required.',
      vertical: 'financial',
      status: 'pending',
      risk: 'medium',
      urgency: 'standard',
      stakeholders: ['Victoria Sterling', 'Jonathan Blake', 'Alexander Petrov'],
      financialImpact: '$5B fund launch',
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      category: 'Product Launch',
      aiConfidence: 0.85,
    },
    {
      id: 'dec-f3',
      title: 'Basel III Capital Adequacy Response',
      description: 'Respond to Fed examination findings on capital adequacy. $800M additional capital buffer may be required.',
      vertical: 'financial',
      status: 'escalated',
      risk: 'critical',
      urgency: 'immediate',
      stakeholders: ['Richard Nakamura', 'Victoria Sterling', 'Alexander Petrov'],
      financialImpact: '$800M capital requirement',
      deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      category: 'Regulatory',
      aiConfidence: 0.89,
      dissent: { count: 1, severity: 'minor' },
    },
    {
      id: 'dec-f4',
      title: 'Cryptocurrency Custody Service Launch',
      description: 'Launch institutional crypto custody service. SEC, OCC, and state regulatory approvals needed.',
      vertical: 'financial',
      status: 'in_progress',
      risk: 'high',
      urgency: 'standard',
      stakeholders: ['Jonathan Blake', 'Richard Nakamura', 'Margaret Chen'],
      financialImpact: '$150M revenue opportunity',
      deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
      category: 'New Business',
      aiConfidence: 0.68,
      dissent: { count: 3, severity: 'significant' },
    },
    {
      id: 'dec-f5',
      title: 'M&A: Regional Bank Acquisition',
      description: 'Acquire regional bank with $8B deposits. Synergy analysis and regulatory approval timeline assessment.',
      vertical: 'financial',
      status: 'approved',
      risk: 'medium',
      urgency: 'urgent',
      stakeholders: ['Victoria Sterling', 'Alexander Petrov'],
      financialImpact: '$1.2B acquisition',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      category: 'M&A',
      aiConfidence: 0.91,
    },
  ],
  general: [
    {
      id: 'dec-g1',
      title: 'AI Ethics Policy Framework Adoption',
      description: 'Adopt comprehensive AI ethics framework across all business units. Board-level governance required.',
      vertical: 'general',
      status: 'in_progress',
      risk: 'medium',
      urgency: 'standard',
      stakeholders: ['Alexandra Reyes', 'Christine Wu', 'Frank Martinez'],
      financialImpact: '$5M implementation cost',
      deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      category: 'Governance',
      aiConfidence: 0.87,
    },
    {
      id: 'dec-g2',
      title: 'Global Workforce Restructuring',
      description: 'Implement workforce optimization across 12 countries. 3,000 role changes, union consultations required.',
      vertical: 'general',
      status: 'pending',
      risk: 'high',
      urgency: 'urgent',
      stakeholders: ['Benjamin Foster', 'Emily Johansson', 'Daniel Okonkwo'],
      financialImpact: '$180M annual savings',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      category: 'Operations',
      aiConfidence: 0.72,
      dissent: { count: 4, severity: 'critical' },
    },
    {
      id: 'dec-g3',
      title: 'Strategic Partnership: Cloud Provider',
      description: 'Enter 5-year strategic partnership with major cloud provider. $500M commitment with exclusivity clause.',
      vertical: 'general',
      status: 'in_progress',
      risk: 'medium',
      urgency: 'standard',
      stakeholders: ['Christine Wu', 'Alexandra Reyes', 'Daniel Okonkwo'],
      financialImpact: '$500M commitment',
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      category: 'Partnership',
      aiConfidence: 0.83,
    },
  ],
};

// =============================================================================
// REGULATORY FRAMEWORKS BY VERTICAL
// =============================================================================

export interface RegulatoryFramework {
  id: string;
  name: string;
  shortName: string;
  vertical: Vertical;
  jurisdiction: string;
  complianceScore: number;
  lastAudit: Date;
  nextAudit: Date;
  openFindings: number;
  criticalFindings: number;
}

export const REGULATORY_FRAMEWORKS: Record<Vertical, RegulatoryFramework[]> = {
  healthcare: [
    { id: 'reg-h1', name: 'Health Insurance Portability and Accountability Act', shortName: 'HIPAA', vertical: 'healthcare', jurisdiction: 'US Federal', complianceScore: 94, lastAudit: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), nextAudit: new Date(Date.now() + 275 * 24 * 60 * 60 * 1000), openFindings: 3, criticalFindings: 0 },
    { id: 'reg-h2', name: 'Food and Drug Administration', shortName: 'FDA 21 CFR', vertical: 'healthcare', jurisdiction: 'US Federal', complianceScore: 91, lastAudit: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000), nextAudit: new Date(Date.now() + 245 * 24 * 60 * 60 * 1000), openFindings: 5, criticalFindings: 1 },
    { id: 'reg-h3', name: 'General Data Protection Regulation', shortName: 'GDPR', vertical: 'healthcare', jurisdiction: 'EU', complianceScore: 88, lastAudit: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), nextAudit: new Date(Date.now() + 305 * 24 * 60 * 60 * 1000), openFindings: 7, criticalFindings: 0 },
    { id: 'reg-h4', name: 'Clinical Laboratory Improvement Amendments', shortName: 'CLIA', vertical: 'healthcare', jurisdiction: 'US Federal', complianceScore: 96, lastAudit: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), nextAudit: new Date(Date.now() + 185 * 24 * 60 * 60 * 1000), openFindings: 1, criticalFindings: 0 },
    { id: 'reg-h5', name: 'Joint Commission Accreditation', shortName: 'TJC', vertical: 'healthcare', jurisdiction: 'US', complianceScore: 92, lastAudit: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), nextAudit: new Date(Date.now() + 730 * 24 * 60 * 60 * 1000), openFindings: 4, criticalFindings: 0 },
  ],
  defense: [
    { id: 'reg-d1', name: 'International Traffic in Arms Regulations', shortName: 'ITAR', vertical: 'defense', jurisdiction: 'US Federal', complianceScore: 97, lastAudit: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), nextAudit: new Date(Date.now() + 320 * 24 * 60 * 60 * 1000), openFindings: 2, criticalFindings: 0 },
    { id: 'reg-d2', name: 'Cybersecurity Maturity Model Certification', shortName: 'CMMC 2.0', vertical: 'defense', jurisdiction: 'US DoD', complianceScore: 89, lastAudit: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), nextAudit: new Date(Date.now() + 275 * 24 * 60 * 60 * 1000), openFindings: 8, criticalFindings: 1 },
    { id: 'reg-d3', name: 'National Industrial Security Program', shortName: 'NISPOM', vertical: 'defense', jurisdiction: 'US Federal', complianceScore: 95, lastAudit: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000), nextAudit: new Date(Date.now() + 245 * 24 * 60 * 60 * 1000), openFindings: 3, criticalFindings: 0 },
    { id: 'reg-d4', name: 'Export Administration Regulations', shortName: 'EAR', vertical: 'defense', jurisdiction: 'US Federal', complianceScore: 93, lastAudit: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), nextAudit: new Date(Date.now() + 305 * 24 * 60 * 60 * 1000), openFindings: 4, criticalFindings: 0 },
    { id: 'reg-d5', name: 'Federal Acquisition Regulation', shortName: 'FAR/DFARS', vertical: 'defense', jurisdiction: 'US Federal', complianceScore: 91, lastAudit: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), nextAudit: new Date(Date.now() + 185 * 24 * 60 * 60 * 1000), openFindings: 6, criticalFindings: 0 },
  ],
  financial: [
    { id: 'reg-f1', name: 'Sarbanes-Oxley Act', shortName: 'SOX', vertical: 'financial', jurisdiction: 'US Federal', complianceScore: 96, lastAudit: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), nextAudit: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000), openFindings: 2, criticalFindings: 0 },
    { id: 'reg-f2', name: 'Basel III Capital Requirements', shortName: 'Basel III', vertical: 'financial', jurisdiction: 'International', complianceScore: 88, lastAudit: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), nextAudit: new Date(Date.now() + 275 * 24 * 60 * 60 * 1000), openFindings: 5, criticalFindings: 1 },
    { id: 'reg-f3', name: 'Digital Operational Resilience Act', shortName: 'DORA', vertical: 'financial', jurisdiction: 'EU', complianceScore: 82, lastAudit: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), nextAudit: new Date(Date.now() + 305 * 24 * 60 * 60 * 1000), openFindings: 9, criticalFindings: 2 },
    { id: 'reg-f4', name: 'Anti-Money Laundering', shortName: 'AML/BSA', vertical: 'financial', jurisdiction: 'US Federal', complianceScore: 94, lastAudit: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), nextAudit: new Date(Date.now() + 320 * 24 * 60 * 60 * 1000), openFindings: 3, criticalFindings: 0 },
    { id: 'reg-f5', name: 'Markets in Financial Instruments Directive', shortName: 'MiFID II', vertical: 'financial', jurisdiction: 'EU', complianceScore: 90, lastAudit: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000), nextAudit: new Date(Date.now() + 245 * 24 * 60 * 60 * 1000), openFindings: 4, criticalFindings: 0 },
    { id: 'reg-f6', name: 'Payment Card Industry Data Security', shortName: 'PCI-DSS', vertical: 'financial', jurisdiction: 'International', complianceScore: 97, lastAudit: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), nextAudit: new Date(Date.now() + 185 * 24 * 60 * 60 * 1000), openFindings: 1, criticalFindings: 0 },
  ],
  general: [
    { id: 'reg-g1', name: 'General Data Protection Regulation', shortName: 'GDPR', vertical: 'general', jurisdiction: 'EU', complianceScore: 91, lastAudit: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), nextAudit: new Date(Date.now() + 305 * 24 * 60 * 60 * 1000), openFindings: 4, criticalFindings: 0 },
    { id: 'reg-g2', name: 'California Consumer Privacy Act', shortName: 'CCPA', vertical: 'general', jurisdiction: 'US State', complianceScore: 89, lastAudit: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), nextAudit: new Date(Date.now() + 275 * 24 * 60 * 60 * 1000), openFindings: 6, criticalFindings: 0 },
    { id: 'reg-g3', name: 'ISO 27001 Information Security', shortName: 'ISO 27001', vertical: 'general', jurisdiction: 'International', complianceScore: 94, lastAudit: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000), nextAudit: new Date(Date.now() + 245 * 24 * 60 * 60 * 1000), openFindings: 3, criticalFindings: 0 },
    { id: 'reg-g4', name: 'SOC 2 Type II', shortName: 'SOC 2', vertical: 'general', jurisdiction: 'US', complianceScore: 96, lastAudit: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), nextAudit: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000), openFindings: 2, criticalFindings: 0 },
  ],
};

// =============================================================================
// AI AGENTS BY SERVICE
// =============================================================================

export interface AIAgent {
  id: string;
  name: string;
  role: string;
  specialty: string;
  avatar: string;
  personality: string;
  bias?: string;
  vertical?: Vertical;
}

export const AI_AGENTS: AIAgent[] = [
  // Council Agents
  { id: 'agent-1', name: 'Strategist Prime', role: 'Strategic Advisor', specialty: 'Long-term planning and competitive positioning', avatar: '🎯', personality: 'Analytical and forward-thinking' },
  { id: 'agent-2', name: 'Risk Oracle', role: 'Risk Analyst', specialty: 'Risk identification and mitigation strategies', avatar: '⚠️', personality: 'Cautious and thorough', bias: 'Conservative' },
  { id: 'agent-3', name: 'Innovation Catalyst', role: 'Innovation Advisor', specialty: 'Disruptive opportunities and emerging trends', avatar: '💡', personality: 'Creative and optimistic', bias: 'Progressive' },
  { id: 'agent-4', name: 'Compliance Guardian', role: 'Regulatory Expert', specialty: 'Legal and regulatory compliance', avatar: '⚖️', personality: 'Precise and rule-oriented' },
  { id: 'agent-5', name: 'Financial Sage', role: 'Financial Analyst', specialty: 'Financial modeling and ROI analysis', avatar: '💰', personality: 'Numbers-driven and pragmatic' },
  { id: 'agent-6', name: 'Stakeholder Voice', role: 'Stakeholder Advocate', specialty: 'Employee and customer impact analysis', avatar: '👥', personality: 'Empathetic and inclusive' },
  { id: 'agent-7', name: 'Devil\'s Advocate', role: 'Critical Challenger', specialty: 'Finding flaws and challenging assumptions', avatar: '😈', personality: 'Skeptical and probing', bias: 'Contrarian' },
  { id: 'agent-8', name: 'Operations Expert', role: 'Operational Advisor', specialty: 'Implementation feasibility and execution', avatar: '⚙️', personality: 'Practical and detail-oriented' },
  
  // Vertical-Specific Agents
  { id: 'agent-h1', name: 'Clinical Advisor', role: 'Medical Expert', specialty: 'Clinical outcomes and patient safety', avatar: '🏥', personality: 'Patient-focused', vertical: 'healthcare' },
  { id: 'agent-h2', name: 'FDA Navigator', role: 'Regulatory Specialist', specialty: 'FDA pathways and compliance', avatar: '📋', personality: 'Meticulous', vertical: 'healthcare' },
  { id: 'agent-d1', name: 'Security Analyst', role: 'Defense Expert', specialty: 'National security implications', avatar: '🛡️', personality: 'Mission-focused', vertical: 'defense' },
  { id: 'agent-d2', name: 'ITAR Specialist', role: 'Export Control Expert', specialty: 'Export regulations and clearances', avatar: '🔒', personality: 'Security-conscious', vertical: 'defense' },
  { id: 'agent-f1', name: 'Market Analyst', role: 'Trading Expert', specialty: 'Market dynamics and trading strategies', avatar: '📈', personality: 'Data-driven', vertical: 'financial' },
  { id: 'agent-f2', name: 'Basel Expert', role: 'Capital Specialist', specialty: 'Capital requirements and stress testing', avatar: '🏦', personality: 'Conservative', vertical: 'financial' },
];

// =============================================================================
// METRICS & KPIs BY VERTICAL
// =============================================================================

export interface Metric {
  id: string;
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  target?: number;
  vertical: Vertical;
  category: string;
}

export const METRICS: Record<Vertical, Metric[]> = {
  healthcare: [
    { id: 'met-h1', name: 'Patient Satisfaction Score', value: 4.6, unit: '/5', trend: 'up', trendValue: 0.2, target: 4.8, vertical: 'healthcare', category: 'Quality' },
    { id: 'met-h2', name: 'Clinical Trial Success Rate', value: 68, unit: '%', trend: 'up', trendValue: 5, target: 75, vertical: 'healthcare', category: 'R&D' },
    { id: 'met-h3', name: 'FDA Approval Timeline', value: 14, unit: 'months', trend: 'down', trendValue: -2, target: 12, vertical: 'healthcare', category: 'Regulatory' },
    { id: 'met-h4', name: 'HIPAA Compliance Score', value: 94, unit: '%', trend: 'stable', trendValue: 0, target: 95, vertical: 'healthcare', category: 'Compliance' },
    { id: 'met-h5', name: 'Bed Occupancy Rate', value: 82, unit: '%', trend: 'up', trendValue: 3, target: 85, vertical: 'healthcare', category: 'Operations' },
    { id: 'met-h6', name: 'Average Length of Stay', value: 4.2, unit: 'days', trend: 'down', trendValue: -0.3, target: 4.0, vertical: 'healthcare', category: 'Operations' },
  ],
  defense: [
    { id: 'met-d1', name: 'Contract Win Rate', value: 42, unit: '%', trend: 'up', trendValue: 5, target: 50, vertical: 'defense', category: 'Business Development' },
    { id: 'met-d2', name: 'Program On-Time Delivery', value: 87, unit: '%', trend: 'stable', trendValue: 0, target: 95, vertical: 'defense', category: 'Execution' },
    { id: 'met-d3', name: 'Security Incident Rate', value: 0.02, unit: '/month', trend: 'down', trendValue: -0.01, target: 0, vertical: 'defense', category: 'Security' },
    { id: 'met-d4', name: 'CMMC Compliance Score', value: 89, unit: '%', trend: 'up', trendValue: 4, target: 95, vertical: 'defense', category: 'Compliance' },
    { id: 'met-d5', name: 'Cleared Workforce', value: 78, unit: '%', trend: 'up', trendValue: 2, target: 85, vertical: 'defense', category: 'Human Capital' },
    { id: 'met-d6', name: 'R&D Investment', value: 12.4, unit: '% revenue', trend: 'up', trendValue: 0.8, target: 15, vertical: 'defense', category: 'Innovation' },
  ],
  financial: [
    { id: 'met-f1', name: 'Assets Under Management', value: 847, unit: 'B', trend: 'up', trendValue: 23, target: 900, vertical: 'financial', category: 'Growth' },
    { id: 'met-f2', name: 'Return on Equity', value: 14.2, unit: '%', trend: 'up', trendValue: 1.1, target: 15, vertical: 'financial', category: 'Performance' },
    { id: 'met-f3', name: 'Capital Adequacy Ratio', value: 13.8, unit: '%', trend: 'stable', trendValue: 0, target: 12, vertical: 'financial', category: 'Risk' },
    { id: 'met-f4', name: 'Cost-to-Income Ratio', value: 58, unit: '%', trend: 'down', trendValue: -2, target: 55, vertical: 'financial', category: 'Efficiency' },
    { id: 'met-f5', name: 'Net Promoter Score', value: 42, unit: '', trend: 'up', trendValue: 5, target: 50, vertical: 'financial', category: 'Customer' },
    { id: 'met-f6', name: 'Fraud Detection Rate', value: 99.7, unit: '%', trend: 'up', trendValue: 0.1, target: 99.9, vertical: 'financial', category: 'Security' },
  ],
  general: [
    { id: 'met-g1', name: 'Revenue Growth', value: 18, unit: '%', trend: 'up', trendValue: 3, target: 20, vertical: 'general', category: 'Growth' },
    { id: 'met-g2', name: 'Employee Engagement', value: 78, unit: '%', trend: 'up', trendValue: 4, target: 85, vertical: 'general', category: 'People' },
    { id: 'met-g3', name: 'Customer Retention', value: 92, unit: '%', trend: 'stable', trendValue: 0, target: 95, vertical: 'general', category: 'Customer' },
    { id: 'met-g4', name: 'Decision Velocity', value: 3.2, unit: 'days', trend: 'down', trendValue: -0.5, target: 2.5, vertical: 'general', category: 'Operations' },
    { id: 'met-g5', name: 'ESG Score', value: 82, unit: '/100', trend: 'up', trendValue: 5, target: 90, vertical: 'general', category: 'Sustainability' },
    { id: 'met-g6', name: 'Innovation Index', value: 74, unit: '/100', trend: 'up', trendValue: 8, target: 80, vertical: 'general', category: 'Innovation' },
  ],
};

// =============================================================================
// CHRONOS - TIME MACHINE SCENARIOS
// =============================================================================

export interface TimeScenario {
  id: string;
  name: string;
  type: 'replay' | 'simulation' | 'what-if';
  description: string;
  vertical: Vertical;
  timeframe: string;
  impact: string;
  probability?: number;
  lessons?: string[];
}

export const TIME_SCENARIOS: Record<Vertical, TimeScenario[]> = {
  healthcare: [
    { id: 'ts-h1', name: 'COVID-19 Response Replay', type: 'replay', description: 'Analyze pandemic response decisions from 2020-2022', vertical: 'healthcare', timeframe: '2020-2022', impact: 'Identified 3 decision points that could have saved $45M', lessons: ['Earlier PPE stockpiling', 'Faster telehealth rollout', 'Better surge capacity planning'] },
    { id: 'ts-h2', name: 'Drug Shortage Crisis', type: 'simulation', description: 'Simulate response to critical drug supply chain disruption', vertical: 'healthcare', timeframe: 'Next 6 months', impact: '$28M patient care impact', probability: 0.35 },
    { id: 'ts-h3', name: 'What-If: Earlier AI Adoption', type: 'what-if', description: 'Model outcomes if AI diagnostics were adopted 2 years earlier', vertical: 'healthcare', timeframe: '2022-2024', impact: '12% improvement in early detection rates' },
  ],
  defense: [
    { id: 'ts-d1', name: 'Supply Chain Attack Response', type: 'replay', description: 'Review response to 2023 supplier cyber incident', vertical: 'defense', timeframe: '2023', impact: 'Contained breach 48 hours faster than industry average', lessons: ['Improved vendor monitoring', 'Faster isolation protocols'] },
    { id: 'ts-d2', name: 'Geopolitical Escalation', type: 'simulation', description: 'Simulate business impact of Taiwan Strait conflict', vertical: 'defense', timeframe: 'Next 12 months', impact: '$1.2B supply chain disruption', probability: 0.15 },
    { id: 'ts-d3', name: 'What-If: CMMC Early Compliance', type: 'what-if', description: 'Model contract wins if CMMC Level 3 achieved 1 year earlier', vertical: 'defense', timeframe: '2023-2024', impact: '$340M additional contract opportunities' },
  ],
  financial: [
    { id: 'ts-f1', name: '2023 Banking Crisis Response', type: 'replay', description: 'Analyze decisions during SVB/regional bank crisis', vertical: 'financial', timeframe: 'March 2023', impact: 'Avoided $180M in deposit flight', lessons: ['Faster liquidity response', 'Better client communication'] },
    { id: 'ts-f2', name: 'Interest Rate Shock', type: 'simulation', description: 'Simulate portfolio impact of 200bp rate increase', vertical: 'financial', timeframe: 'Next 6 months', impact: '$450M mark-to-market impact', probability: 0.25 },
    { id: 'ts-f3', name: 'What-If: Crypto Custody Launch', type: 'what-if', description: 'Model revenue if crypto custody launched in 2021', vertical: 'financial', timeframe: '2021-2024', impact: '$85M missed revenue opportunity' },
  ],
  general: [
    { id: 'ts-g1', name: 'Remote Work Transition', type: 'replay', description: 'Review 2020 remote work policy decisions', vertical: 'general', timeframe: '2020', impact: 'Identified $32M in real estate optimization', lessons: ['Faster tech deployment', 'Better change management'] },
    { id: 'ts-g2', name: 'AI Disruption Scenario', type: 'simulation', description: 'Simulate competitive impact of AI-native competitor', vertical: 'general', timeframe: 'Next 24 months', impact: '15% market share at risk', probability: 0.40 },
    { id: 'ts-g3', name: 'What-If: Earlier ESG Focus', type: 'what-if', description: 'Model investor sentiment if ESG initiatives started 3 years earlier', vertical: 'general', timeframe: '2020-2023', impact: '8% higher institutional investment' },
  ],
};

// =============================================================================
// GHOST BOARD - BOARD MEMBER AVATARS
// =============================================================================

export interface BoardMemberAvatar {
  id: string;
  name: string;
  background: string;
  expertise: string[];
  personality: string;
  challengeStyle: string;
  avatar: string;
}

export const BOARD_AVATARS: BoardMemberAvatar[] = [
  { id: 'board-1', name: 'Eleanor Blackwood', background: 'Former Fortune 100 CEO, 30 years executive experience', expertise: ['Strategy', 'M&A', 'Turnarounds'], personality: 'Direct and demanding', challengeStyle: 'Asks tough questions about execution capability', avatar: '👩‍💼' },
  { id: 'board-2', name: 'Dr. Marcus Chen', background: 'Stanford Professor, Former Fed Economist', expertise: ['Economics', 'Risk Management', 'Quantitative Analysis'], personality: 'Analytical and methodical', challengeStyle: 'Challenges assumptions with data', avatar: '👨‍🏫' },
  { id: 'board-3', name: 'General Patricia Hayes (Ret.)', background: 'Former 4-Star General, Defense Industry Board Member', expertise: ['Operations', 'Crisis Management', 'Government Relations'], personality: 'Mission-focused and decisive', challengeStyle: 'Probes contingency planning', avatar: '🎖️' },
  { id: 'board-4', name: 'Raj Patel', background: 'Tech Entrepreneur, 3x Unicorn Founder', expertise: ['Innovation', 'Technology', 'Disruption'], personality: 'Visionary and impatient', challengeStyle: 'Pushes for bolder moves', avatar: '🚀' },
  { id: 'board-5', name: 'Sarah Goldstein', background: 'Former SEC Commissioner, Corporate Governance Expert', expertise: ['Compliance', 'Governance', 'Shareholder Rights'], personality: 'Precise and thorough', challengeStyle: 'Focuses on fiduciary duties', avatar: '⚖️' },
  { id: 'board-6', name: 'James Okonkwo', background: 'Private Equity Partner, Activist Investor', expertise: ['Finance', 'Value Creation', 'Cost Optimization'], personality: 'Results-driven and skeptical', challengeStyle: 'Demands clear ROI metrics', avatar: '💼' },
];

// =============================================================================
// PRE-MORTEM - FAILURE MODES
// =============================================================================

export interface FailureMode {
  id: string;
  category: string;
  description: string;
  probability: number;
  impact: RiskLevel;
  mitigations: string[];
  earlyWarnings: string[];
}

export const FAILURE_MODES: FailureMode[] = [
  { id: 'fm-1', category: 'Execution', description: 'Key talent leaves during critical implementation phase', probability: 0.25, impact: 'high', mitigations: ['Retention packages', 'Knowledge documentation', 'Succession planning'], earlyWarnings: ['Increased recruiter activity', 'Declining engagement scores', 'Competitor hiring announcements'] },
  { id: 'fm-2', category: 'Market', description: 'Competitor launches superior product before our release', probability: 0.30, impact: 'critical', mitigations: ['Accelerate timeline', 'Differentiation strategy', 'Partnership options'], earlyWarnings: ['Patent filings', 'Hiring patterns', 'Conference presentations'] },
  { id: 'fm-3', category: 'Regulatory', description: 'New regulation invalidates core business model', probability: 0.15, impact: 'critical', mitigations: ['Regulatory monitoring', 'Lobbying efforts', 'Business model flexibility'], earlyWarnings: ['Legislative proposals', 'Regulatory speeches', 'Industry association alerts'] },
  { id: 'fm-4', category: 'Technology', description: 'Critical system failure during peak demand', probability: 0.20, impact: 'high', mitigations: ['Redundancy', 'Load testing', 'Incident response plan'], earlyWarnings: ['Performance degradation', 'Error rate increases', 'Capacity utilization'] },
  { id: 'fm-5', category: 'Financial', description: 'Cost overruns exceed budget by 50%+', probability: 0.35, impact: 'high', mitigations: ['Contingency budget', 'Phased approach', 'Vendor negotiations'], earlyWarnings: ['Early milestone cost variance', 'Scope creep', 'Resource conflicts'] },
  { id: 'fm-6', category: 'Stakeholder', description: 'Key stakeholder withdraws support mid-project', probability: 0.20, impact: 'medium', mitigations: ['Stakeholder mapping', 'Regular communication', 'Quick wins'], earlyWarnings: ['Reduced engagement', 'Conflicting priorities', 'Leadership changes'] },
];

// =============================================================================
// DECISION DEBT - STUCK DECISIONS
// =============================================================================

export interface DecisionDebt {
  id: string;
  title: string;
  daysStuck: number;
  dailyCost: number;
  totalCost: number;
  blockers: string[];
  owner: string;
  vertical: Vertical;
  category: string;
}

export const DECISION_DEBT: Record<Vertical, DecisionDebt[]> = {
  healthcare: [
    { id: 'dd-h1', title: 'EHR Vendor Selection', daysStuck: 45, dailyCost: 8500, totalCost: 382500, blockers: ['Stakeholder alignment', 'Security review pending'], owner: 'CIO', vertical: 'healthcare', category: 'Technology' },
    { id: 'dd-h2', title: 'Nursing Union Contract Terms', daysStuck: 28, dailyCost: 15000, totalCost: 420000, blockers: ['Union negotiations', 'Budget approval'], owner: 'CHRO', vertical: 'healthcare', category: 'HR' },
    { id: 'dd-h3', title: 'Clinical AI Deployment Scope', daysStuck: 62, dailyCost: 12000, totalCost: 744000, blockers: ['FDA guidance unclear', 'Liability concerns'], owner: 'CMO', vertical: 'healthcare', category: 'Clinical' },
  ],
  defense: [
    { id: 'dd-d1', title: 'Subcontractor Security Clearance', daysStuck: 90, dailyCost: 25000, totalCost: 2250000, blockers: ['OPM backlog', 'Foreign national review'], owner: 'CSO', vertical: 'defense', category: 'Security' },
    { id: 'dd-d2', title: 'Manufacturing Site Selection', daysStuck: 55, dailyCost: 18000, totalCost: 990000, blockers: ['State incentive negotiations', 'Environmental review'], owner: 'COO', vertical: 'defense', category: 'Operations' },
    { id: 'dd-d3', title: 'IP Licensing Agreement', daysStuck: 38, dailyCost: 22000, totalCost: 836000, blockers: ['Legal review', 'Export control classification'], owner: 'General Counsel', vertical: 'defense', category: 'Legal' },
  ],
  financial: [
    { id: 'dd-f1', title: 'Trading Algorithm Approval', daysStuck: 21, dailyCost: 45000, totalCost: 945000, blockers: ['Model validation', 'Risk committee review'], owner: 'CRO', vertical: 'financial', category: 'Trading' },
    { id: 'dd-f2', title: 'Branch Consolidation Plan', daysStuck: 75, dailyCost: 8000, totalCost: 600000, blockers: ['Union consultation', 'Regulatory notification'], owner: 'COO', vertical: 'financial', category: 'Operations' },
    { id: 'dd-f3', title: 'Crypto Product Launch', daysStuck: 120, dailyCost: 35000, totalCost: 4200000, blockers: ['Regulatory uncertainty', 'Board approval'], owner: 'CEO', vertical: 'financial', category: 'Product' },
  ],
  general: [
    { id: 'dd-g1', title: 'Cloud Migration Strategy', daysStuck: 42, dailyCost: 12000, totalCost: 504000, blockers: ['Vendor selection', 'Security assessment'], owner: 'CTO', vertical: 'general', category: 'Technology' },
    { id: 'dd-g2', title: 'Hybrid Work Policy', daysStuck: 85, dailyCost: 5000, totalCost: 425000, blockers: ['Executive alignment', 'Facilities planning'], owner: 'CHRO', vertical: 'general', category: 'HR' },
  ],
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

export const getDecisionsByVertical = (vertical: Vertical): Decision[] => DECISIONS[vertical] || [];
export const getExecutivesByVertical = (vertical: Vertical): Executive[] => EXECUTIVES[vertical] || [];
export const getMetricsByVertical = (vertical: Vertical): Metric[] => METRICS[vertical] || [];
export const getRegulatoryFrameworksByVertical = (vertical: Vertical): RegulatoryFramework[] => REGULATORY_FRAMEWORKS[vertical] || [];
export const getTimeScenariosByVertical = (vertical: Vertical): TimeScenario[] => TIME_SCENARIOS[vertical] || [];
export const getDecisionDebtByVertical = (vertical: Vertical): DecisionDebt[] => DECISION_DEBT[vertical] || [];
export const getCompanyProfile = (vertical: Vertical): CompanyProfile => COMPANY_PROFILES[vertical];

export const getAgentsByVertical = (vertical?: Vertical): AIAgent[] => {
  const generalAgents = AI_AGENTS.filter(a => !a.vertical);
  if (!vertical) {return generalAgents;}
  const verticalAgents = AI_AGENTS.filter(a => a.vertical === vertical);
  return [...generalAgents, ...verticalAgents];
};

export const calculateTotalDecisionDebt = (vertical: Vertical): number => {
  return DECISION_DEBT[vertical]?.reduce((sum, d) => sum + d.totalCost, 0) || 0;
};

export const formatCurrency = (value: number): string => {
  if (value >= 1000000000) {return `$${(value / 1000000000).toFixed(1)}B`;}
  if (value >= 1000000) {return `$${(value / 1000000).toFixed(1)}M`;}
  if (value >= 1000) {return `$${(value / 1000).toFixed(0)}K`;}
  return `$${value.toFixed(0)}`;
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const getDaysUntil = (date: Date): number => {
  return Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
};

export const getRiskColor = (risk: RiskLevel): string => {
  switch (risk) {
    case 'critical': return 'bg-red-600';
    case 'high': return 'bg-amber-600';
    case 'medium': return 'bg-yellow-600';
    case 'low': return 'bg-green-600';
    case 'minimal': return 'bg-blue-600';
    default: return 'bg-zinc-600';
  }
};

export const getStatusColor = (status: DecisionStatus): string => {
  switch (status) {
    case 'approved': return 'bg-green-600';
    case 'rejected': return 'bg-red-600';
    case 'in_progress': return 'bg-blue-600';
    case 'escalated': return 'bg-amber-600';
    case 'pending': return 'bg-zinc-600';
    default: return 'bg-zinc-600';
  }
};
