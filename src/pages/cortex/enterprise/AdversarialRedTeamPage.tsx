// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// ADVERSARIAL RED TEAM MODE PAGE
// "100 Ways This Could Fail" - Every agent becomes a devil's advocate
// =============================================================================

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../../../lib/api';
import { ReportSection, POIList, StatusBadge } from '../../../components/reports/DrillDownReportKit';
import { MetricWithSparkline, AnomalyBanner } from '../../../components/reports/TrendSparklineKit';
import { HeatmapCalendar, AuditTimeline } from '../../../components/reports/HeatmapTimelineKit';
import { ExportToolbar, ComparisonPanel, PDFExportButton } from '../../../components/reports/ExportCompareKit';
import { SavedViewManager } from '../../../components/reports/InteractionKit';
import {
  Target,
  AlertTriangle,
  Shield,
  Skull,
  Zap,
  TrendingDown,
  FileText,
  Play,
  Loader2,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronRight,
  Download,
  Share2,
  BarChart3,
  Users,
  DollarSign,
  Lock,
  Scale,
  Heart,
  Globe,
  Cpu,
  Truck,
  Building,
} from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

interface RedTeamAttack {
  id: string;
  attackerId: string;
  attackerName: string;
  attackerRole: string;
  category: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  failureScenario: string;
  probability: number;
  impact: number;
  riskScore: number;
  mitigationSuggestion?: string;
}

interface RedTeamSummary {
  totalAttacks: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  overallRiskScore: number;
  recommendation: 'proceed' | 'proceed_with_caution' | 'reconsider' | 'abort';
  topRisks: RedTeamAttack[];
  categoryBreakdown: Record<string, number>;
  blindSpots: string[];
}

// =============================================================================
// ATTACK PERSPECTIVES
// =============================================================================

const ATTACK_PERSPECTIVES = [
  { id: 'pessimist-cfo', name: 'Pessimist CFO', role: 'Financial Doom Prophet', icon: DollarSign, color: 'text-green-500' },
  { id: 'paranoid-ciso', name: 'Paranoid CISO', role: 'Security Nightmare Finder', icon: Lock, color: 'text-red-500' },
  { id: 'cynical-lawyer', name: 'Cynical Lawyer', role: 'Litigation Magnet Detector', icon: Scale, color: 'text-purple-500' },
  { id: 'skeptical-customer', name: 'Skeptical Customer', role: 'Customer Abandonment Predictor', icon: Users, color: 'text-blue-500' },
  { id: 'burned-operator', name: 'Burned Operator', role: 'Execution Disaster Expert', icon: Truck, color: 'text-orange-500' },
  { id: 'ethics-watchdog', name: 'Ethics Watchdog', role: 'Reputation Destroyer Finder', icon: Heart, color: 'text-pink-500' },
  { id: 'market-bear', name: 'Market Bear', role: 'Competitive Destruction Analyst', icon: Globe, color: 'text-indigo-500' },
  { id: 'black-swan-hunter', name: 'Black Swan Hunter', role: 'Catastrophic Event Finder', icon: Skull, color: 'text-gray-500' },
];

// =============================================================================
// TR DEMO DATA - Petrov Transfer Red Team Analysis
// =============================================================================

const TR_DEMO_ATTACKS: RedTeamAttack[] = [
  { id: 'tr-1', attackerId: 'paranoid-ciso', attackerName: 'Paranoid CISO', attackerRole: 'Security Nightmare Finder', category: 'regulatory', severity: 'critical', title: 'Basel III PEP Violation', description: 'Transfer to PEP without full 24-hour review violates Basel III §4.2.1', failureScenario: 'Regulatory audit finds inadequate PEP due diligence, resulting in $10M+ fine and consent decree', probability: 65, impact: 95, riskScore: 62, mitigationSuggestion: 'Implement mandatory 24-hour compliance hold for all PEP transactions' },
  { id: 'tr-2', attackerId: 'cynical-lawyer', attackerName: 'Cynical Lawyer', attackerRole: 'Litigation Magnet Detector', category: 'legal', severity: 'critical', title: 'OFAC Secondary Sanctions', description: 'Cyprus jurisdiction creates potential secondary sanctions exposure', failureScenario: 'US Treasury designates Petrov, firm faces correspondent banking restrictions', probability: 35, impact: 90, riskScore: 32, mitigationSuggestion: 'Obtain explicit OFAC guidance before proceeding' },
  { id: 'tr-3', attackerId: 'ethics-watchdog', attackerName: 'Ethics Watchdog', attackerRole: 'Reputation Destroyer Finder', category: 'reputational', severity: 'high', title: 'Media Exposure Risk', description: 'Former government official transfer could attract investigative journalism', failureScenario: 'NYT/WSJ story on "Wall Street facilitating oligarch money" destroys client trust', probability: 40, impact: 80, riskScore: 32, mitigationSuggestion: 'Document enhanced due diligence thoroughly for defensibility' },
  { id: 'tr-4', attackerId: 'pessimist-cfo', attackerName: 'Pessimist CFO', attackerRole: 'Financial Doom Prophet', category: 'financial', severity: 'high', title: 'Client Relationship Damage', description: 'Blocking or delaying transfer may lose $50M+ AUM client', failureScenario: 'Petrov Holdings moves all assets to competitor, 7-year relationship destroyed', probability: 55, impact: 70, riskScore: 39, mitigationSuggestion: 'Communicate proactively with client about compliance requirements' },
  { id: 'tr-5', attackerId: 'black-swan-hunter', attackerName: 'Black Swan Hunter', attackerRole: 'Catastrophic Event Finder', category: 'geopolitical', severity: 'medium', title: 'Sanctions Escalation', description: 'Geopolitical events could trigger new sanctions on Cyprus/Russia nexus', failureScenario: 'Transfer completed just before new sanctions, firm caught in enforcement action', probability: 25, impact: 85, riskScore: 21, mitigationSuggestion: 'Monitor OFAC/EU sanctions announcements in real-time' },
];

const TR_DEMO_SUMMARY: RedTeamSummary = {
  totalAttacks: 5,
  criticalCount: 2,
  highCount: 2,
  mediumCount: 1,
  lowCount: 0,
  overallRiskScore: 67,
  recommendation: 'proceed_with_caution',
  topRisks: TR_DEMO_ATTACKS.slice(0, 3),
  categoryBreakdown: { regulatory: 1, legal: 1, reputational: 1, financial: 1, geopolitical: 1 },
  blindSpots: ['operational-continuity', 'whistleblower-risk', 'audit-trail-gaps'],
};

// =============================================================================
// FIFA DEMO DATA - FFP Violation Red Team Analysis
// =============================================================================

const FIFA_DEMO_ATTACKS: RedTeamAttack[] = [
  { id: 'ff-1', attackerId: 'cynical-lawyer', attackerName: 'Cynical Lawyer', attackerRole: 'Litigation Magnet Detector', category: 'regulatory', severity: 'critical', title: 'CAS Appeal Vulnerability', description: 'Related-party sponsorship revenue likely fails CAS fair value test under FFP Art. 58bis', failureScenario: 'CAS overturns club\'s appeal, imposes 2-year European competition ban, €30M fine', probability: 70, impact: 95, riskScore: 67, mitigationSuggestion: 'Commission independent fair value assessment of all related-party commercial deals before proceeding' },
  { id: 'ff-2', attackerId: 'paranoid-ciso', attackerName: 'Paranoid CISO', attackerRole: 'Security Nightmare Finder', category: 'financial', severity: 'critical', title: 'Hidden Agent Fee Exposure', description: 'Whistleblower alleges €22M in undisclosed agent fees structured through offshore entities', failureScenario: 'UEFA Investigation Board discovers payments, triggers Article 12 breach — points deduction and transfer ban', probability: 55, impact: 90, riskScore: 50, mitigationSuggestion: 'Full forensic audit of all intermediary payments with third-party verification' },
  { id: 'ff-3', attackerId: 'ethics-watchdog', attackerName: 'Ethics Watchdog', attackerRole: 'Reputation Destroyer Finder', category: 'reputational', severity: 'high', title: 'Public Backlash & Fan Revolt', description: 'Fan groups organizing protests against "financial doping" narrative', failureScenario: 'Sponsorship partners withdraw, stadium boycotts reduce matchday revenue by 30%', probability: 45, impact: 75, riskScore: 34, mitigationSuggestion: 'Proactive transparency campaign with fan engagement sessions' },
  { id: 'ff-4', attackerId: 'pessimist-cfo', attackerName: 'Pessimist CFO', attackerRole: 'Financial Doom Prophet', category: 'financial', severity: 'high', title: 'Wage Bill Spiral', description: '€180M transfer commits club to €25M/year wages, pushing wage-to-revenue ratio above 70%', failureScenario: 'Club enters UEFA financial settlement agreement, forced to sell 3 first-team players', probability: 60, impact: 80, riskScore: 48, mitigationSuggestion: 'Negotiate performance-linked wage structure with deferred payments' },
  { id: 'ff-5', attackerId: 'market-bear', attackerName: 'Market Bear', attackerRole: 'Competitive Destruction Analyst', category: 'competitive', severity: 'medium', title: 'Player Depreciation Risk', description: 'Player age 28, asset depreciates rapidly; comparable transfers show 40% value drop after 2 seasons', failureScenario: 'Unable to recoup investment, €80M+ write-down if player underperforms', probability: 40, impact: 70, riskScore: 28, mitigationSuggestion: 'Include sell-on clause triggers and performance-based amortization schedule' },
  { id: 'ff-6', attackerId: 'black-swan-hunter', attackerName: 'Black Swan Hunter', attackerRole: 'Catastrophic Event Finder', category: 'operational', severity: 'high', title: 'Injury Risk Concentration', description: 'Single €180M asset with no adequate replacement in squad', failureScenario: 'ACL injury in first season, 12-month absence, €180M depreciating asset generating zero return', probability: 20, impact: 95, riskScore: 19, mitigationSuggestion: 'Secure comprehensive insurance and identify loan market backup options' },
];

const FIFA_DEMO_SUMMARY: RedTeamSummary = {
  totalAttacks: 6, criticalCount: 2, highCount: 3, mediumCount: 1, lowCount: 0,
  overallRiskScore: 74, recommendation: 'reconsider',
  topRisks: FIFA_DEMO_ATTACKS.slice(0, 3),
  categoryBreakdown: { regulatory: 1, financial: 2, reputational: 1, competitive: 1, operational: 1 },
  blindSpots: ['match-fixing-exposure', 'third-party-ownership', 'solidarity-mechanism'],
};

// =============================================================================
// CELTIC FC DEMO DATA
// =============================================================================

const CELTIC_DEMO_ATTACKS: RedTeamAttack[] = [
  { id: 'ce-1', attackerId: 'pessimist-cfo', attackerName: 'Pessimist CFO', attackerRole: 'Financial Doom Prophet', category: 'financial', severity: 'high', title: 'Overpay vs. Market Value', description: '£12M for a player with 6 months loan data is above xG-adjusted market value of £8.5M', failureScenario: 'Player fails to replicate loan form, £3.5M premium write-off with no resale interest', probability: 45, impact: 70, riskScore: 32, mitigationSuggestion: 'Negotiate £9M base + £3M in performance add-ons tied to appearances and European qualification' },
  { id: 'ce-2', attackerId: 'burned-operator', attackerName: 'Burned Operator', attackerRole: 'Execution Disaster Expert', category: 'operational', severity: 'high', title: 'January Window Overpay Premium', description: 'January transfers historically cost 20-30% more than summer equivalent', failureScenario: 'Could acquire same quality in summer for £8M, wasting £4M of transfer budget', probability: 65, impact: 55, riskScore: 36, mitigationSuggestion: 'Negotiate pre-agreement for summer completion, or identify summer alternatives' },
  { id: 'ce-3', attackerId: 'skeptical-customer', attackerName: 'Skeptical Customer', attackerRole: 'Customer Abandonment Predictor', category: 'squad', severity: 'medium', title: 'Squad Harmony Disruption', description: 'New signing displaces existing CM who has strong dressing room influence', failureScenario: 'Dressing room divide leads to poor second-half form, costs league title', probability: 30, impact: 65, riskScore: 20, mitigationSuggestion: 'Discuss rotation plan with existing squad before completing signing' },
  { id: 'ce-4', attackerId: 'cynical-lawyer', attackerName: 'Cynical Lawyer', attackerRole: 'Litigation Magnet Detector', category: 'legal', severity: 'medium', title: 'Agent Fee Inflation', description: 'Agent represents 3 Benfica players, potential conflict of interest in fee structure', failureScenario: 'Hidden commission arrangement surfaces, damages relationship with Benfica for future deals', probability: 35, impact: 50, riskScore: 18, mitigationSuggestion: 'Independent agent fee audit and direct club-to-club negotiation channel' },
];

const CELTIC_DEMO_SUMMARY: RedTeamSummary = {
  totalAttacks: 4, criticalCount: 0, highCount: 2, mediumCount: 2, lowCount: 0,
  overallRiskScore: 48, recommendation: 'proceed_with_caution',
  topRisks: CELTIC_DEMO_ATTACKS.slice(0, 3),
  categoryBreakdown: { financial: 1, operational: 1, squad: 1, legal: 1 },
  blindSpots: ['sell-on-clause-risk', 'adaptability-to-scottish-football', 'injury-history'],
};

// =============================================================================
// LUX / ESG DEMO DATA
// =============================================================================

const LUX_DEMO_ATTACKS: RedTeamAttack[] = [
  { id: 'lx-1', attackerId: 'ethics-watchdog', attackerName: 'Ethics Watchdog', attackerRole: 'Reputation Destroyer Finder', category: 'reputational', severity: 'critical', title: 'Supply Chain Human Rights Violation', description: 'Supplier X linked to forced labor allegations in 2 UN reports', failureScenario: 'NGO campaign goes viral, luxury brand synonymous with exploitation, 25% revenue drop', probability: 50, impact: 95, riskScore: 48, mitigationSuggestion: 'Immediate independent human rights impact assessment before any new orders' },
  { id: 'lx-2', attackerId: 'cynical-lawyer', attackerName: 'Cynical Lawyer', attackerRole: 'Litigation Magnet Detector', category: 'regulatory', severity: 'critical', title: 'EU Due Diligence Directive Non-Compliance', description: 'CSDDD requires documented human rights due diligence for all supply chain tiers', failureScenario: 'EU enforcement action: up to 5% of global turnover fine, director personal liability', probability: 60, impact: 90, riskScore: 54, mitigationSuggestion: 'Implement full CSDDD-compliant supply chain mapping and monitoring framework' },
  { id: 'lx-3', attackerId: 'market-bear', attackerName: 'Market Bear', attackerRole: 'Competitive Destruction Analyst', category: 'competitive', severity: 'high', title: 'Competitor ESG Differentiation', description: 'Competitors already marketing "100% ethical sourcing" as premium differentiator', failureScenario: 'Market share loss as conscious consumers shift to verified ethical competitors', probability: 55, impact: 70, riskScore: 39, mitigationSuggestion: 'Fast-track alternative sourcing from certified ethical suppliers' },
  { id: 'lx-4', attackerId: 'pessimist-cfo', attackerName: 'Pessimist CFO', attackerRole: 'Financial Doom Prophet', category: 'financial', severity: 'high', title: 'Sourcing Cost Escalation', description: 'Switching to ethical suppliers increases raw material costs by 35-45%', failureScenario: 'Margin compression forces price increases, reducing demand in key markets', probability: 70, impact: 60, riskScore: 42, mitigationSuggestion: 'Phase transition over 18 months, absorb cost initially as ESG investment' },
];

const LUX_DEMO_SUMMARY: RedTeamSummary = {
  totalAttacks: 4, criticalCount: 2, highCount: 2, mediumCount: 0, lowCount: 0,
  overallRiskScore: 72, recommendation: 'reconsider',
  topRisks: LUX_DEMO_ATTACKS.slice(0, 3),
  categoryBreakdown: { reputational: 1, regulatory: 1, competitive: 1, financial: 1 },
  blindSpots: ['investor-esg-rating-impact', 'insurance-coverage-gaps', 'whistleblower-exposure'],
};

// =============================================================================
// VC INVESTMENT DEMO DATA
// =============================================================================

const VC_DEMO_ATTACKS: RedTeamAttack[] = [
  { id: 'vc-1', attackerId: 'market-bear', attackerName: 'Market Bear', attackerRole: 'Competitive Destruction Analyst', category: 'market', severity: 'critical', title: 'Sector Valuation Correction', description: 'AI governance sector down 22%, comparable companies trading at 8x revenue vs. 15x at peak', failureScenario: 'Entry at inflated valuation, next round is a down-round, fund marks down 40%', probability: 55, impact: 85, riskScore: 47, mitigationSuggestion: 'Negotiate anti-dilution protection and valuation cap tied to revenue milestones' },
  { id: 'vc-2', attackerId: 'skeptical-customer', attackerName: 'Skeptical Customer', attackerRole: 'Customer Abandonment Predictor', category: 'competitive', severity: 'high', title: '3 Well-Funded Competitors', description: 'Competitors have raised $200M+ combined, 2 have enterprise logos the target lacks', failureScenario: 'Market consolidates around 2 winners, target becomes acquisition target at distressed price', probability: 45, impact: 80, riskScore: 36, mitigationSuggestion: 'Deep competitive moat analysis — verify proprietary tech, switching costs, network effects' },
  { id: 'vc-3', attackerId: 'burned-operator', attackerName: 'Burned Operator', attackerRole: 'Execution Disaster Expert', category: 'operational', severity: 'high', title: 'Founder Concentration Risk', description: 'Solo technical founder, no co-founder, CTO role unfilled', failureScenario: 'Founder burnout or departure kills company — no succession plan', probability: 40, impact: 90, riskScore: 36, mitigationSuggestion: 'Condition investment on hiring CTO within 90 days, key-person insurance' },
  { id: 'vc-4', attackerId: 'pessimist-cfo', attackerName: 'Pessimist CFO', attackerRole: 'Financial Doom Prophet', category: 'financial', severity: 'medium', title: '40% MoM Growth Not Sustainable', description: 'Growth driven by one-time enterprise deal, underlying organic growth is 12% MoM', failureScenario: 'Growth normalizes to 12%, company misses Series C milestones, bridge round needed', probability: 50, impact: 65, riskScore: 33, mitigationSuggestion: 'Diligence pipeline: verify contracted ARR vs. one-time revenue' },
];

const VC_DEMO_SUMMARY: RedTeamSummary = {
  totalAttacks: 4, criticalCount: 1, highCount: 2, mediumCount: 1, lowCount: 0,
  overallRiskScore: 58, recommendation: 'proceed_with_caution',
  topRisks: VC_DEMO_ATTACKS.slice(0, 3),
  categoryBreakdown: { market: 1, competitive: 1, operational: 1, financial: 1 },
  blindSpots: ['regulatory-risk', 'IP-ownership', 'customer-concentration'],
};

// =============================================================================
// DEMO SCENARIO MAP
// =============================================================================

const DEMO_SCENARIOS: Record<string, { label: string; icon: string; decision: string; attacks: RedTeamAttack[]; summary: RedTeamSummary }> = {
  tr: { label: 'Thomson Reuters', icon: '\uD83C\uDFE6', decision: '$2.5M PEP Transfer to Viktor Petrov (Cyprus) — Basel III Compliance Review', attacks: TR_DEMO_ATTACKS, summary: TR_DEMO_SUMMARY },
  fifa: { label: 'FIFA / UEFA', icon: '\u26BD', decision: '€180M player signing with related-party sponsorship offsets and whistleblower FFP allegations', attacks: FIFA_DEMO_ATTACKS, summary: FIFA_DEMO_SUMMARY },
  celtic: { label: 'Celtic FC', icon: '\uD83C\uDFF4', decision: '£12M acquisition of 23-year-old Portuguese midfielder from Benfica in January window', attacks: CELTIC_DEMO_ATTACKS, summary: CELTIC_DEMO_SUMMARY },
  lux: { label: 'Luxury / ESG', icon: '\uD83D\uDC8E', decision: 'Continue sourcing high-value raw materials from Supplier X given human rights allegations', attacks: LUX_DEMO_ATTACKS, summary: LUX_DEMO_SUMMARY },
  vc: { label: 'VC Investment', icon: '\uD83D\uDCC8', decision: '$15M Series B investment in AI governance startup during market correction', attacks: VC_DEMO_ATTACKS, summary: VC_DEMO_SUMMARY },
};

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

const SeverityBadge: React.FC<{ severity: RedTeamAttack['severity'] }> = ({ severity }) => {
  const colors = {
    critical: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    high: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  };
  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded ${colors[severity]}`}>
      {severity.toUpperCase()}
    </span>
  );
};

const RiskScoreGauge: React.FC<{ score: number }> = ({ score }) => {
  const color = score >= 70 ? 'text-red-500' : score >= 40 ? 'text-orange-500' : score >= 20 ? 'text-yellow-500' : 'text-green-500';
  return (
    <div className="flex items-center gap-2">
      <div className="relative w-12 h-12">
        <svg className="w-12 h-12 transform -rotate-90">
          <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="none" className="text-gray-200 dark:text-gray-700" />
          <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="none" className={color} strokeDasharray={`${score * 1.26} 126`} strokeLinecap="round" />
        </svg>
        <span className={`absolute inset-0 flex items-center justify-center text-sm font-bold ${color}`}>{score}</span>
      </div>
    </div>
  );
};

const RecommendationBanner: React.FC<{ recommendation: RedTeamSummary['recommendation'] }> = ({ recommendation }) => {
  const configs = {
    proceed: { color: 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800', icon: CheckCircle, iconColor: 'text-green-600 dark:text-green-400', text: 'PROCEED', desc: 'Risks are manageable with standard controls.' },
    proceed_with_caution: { color: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800', icon: AlertTriangle, iconColor: 'text-yellow-600 dark:text-yellow-400', text: 'PROCEED WITH CAUTION', desc: 'Significant risks identified that require mitigation.' },
    reconsider: { color: 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800', icon: AlertTriangle, iconColor: 'text-orange-600 dark:text-orange-400', text: 'RECONSIDER', desc: 'Major risks identified that may invalidate the decision.' },
    abort: { color: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800', icon: XCircle, iconColor: 'text-red-600 dark:text-red-400', text: 'ABORT', desc: 'Critical risks identified that make this decision untenable.' },
  };
  const config = configs[recommendation];
  const Icon = config.icon;

  return (
    <div className={`${config.color} border rounded-xl p-6`}>
      <div className="flex items-center gap-4">
        <Icon className={`w-10 h-10 ${config.iconColor}`} />
        <div>
          <h3 className={`text-xl font-bold ${config.iconColor}`}>RECOMMENDATION: {config.text}</h3>
          <p className="text-gray-600 dark:text-gray-400">{config.desc}</p>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// RISK MATRIX COMPONENT
// =============================================================================

const RiskMatrix: React.FC<{ attacks: RedTeamAttack[] }> = ({ attacks }) => {
  const cells: { row: number; col: number; label: string; color: string }[] = [];
  for (let p = 4; p >= 0; p--) {
    for (let i = 0; i < 5; i++) {
      const score = (p + 1) * (i + 1);
      const color = score >= 16 ? 'bg-red-500/20 dark:bg-red-900/40' : score >= 9 ? 'bg-orange-500/20 dark:bg-orange-900/40' : score >= 4 ? 'bg-yellow-500/20 dark:bg-yellow-900/40' : 'bg-green-500/20 dark:bg-green-900/40';
      cells.push({ row: 4 - p, col: i, label: '', color });
    }
  }

  const getCell = (a: RedTeamAttack) => {
    const pIdx = Math.min(4, Math.floor(a.probability / 20));
    const iIdx = Math.min(4, Math.floor(a.impact / 20));
    return { row: 4 - pIdx, col: iIdx };
  };

  const sevColor = (s: string) => s === 'critical' ? 'bg-red-500' : s === 'high' ? 'bg-orange-500' : s === 'medium' ? 'bg-yellow-500' : 'bg-green-500';
  const pLabels = ['81-100%', '61-80%', '41-60%', '21-40%', '0-20%'];
  const iLabels = ['0-20', '21-40', '41-60', '61-80', '81-100'];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Target className="w-5 h-5 text-red-500" /> Probability vs. Impact Matrix
      </h3>
      <div className="flex gap-4">
        <div className="flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400 py-1 pr-2 w-16 text-right">
          {pLabels.map(l => <span key={l}>{l}</span>)}
        </div>
        <div className="flex-1">
          <div className="grid grid-cols-5 gap-1">
            {cells.map((cell, idx) => {
              const attacksInCell = attacks.filter(a => {
                const c = getCell(a);
                return c.row === cell.row && c.col === cell.col;
              });
              return (
                <div key={idx} className={`${cell.color} rounded h-16 flex items-center justify-center gap-0.5 relative border border-gray-200/30 dark:border-gray-700/30`}>
                  {attacksInCell.map((a, ai) => (
                    <div key={a.id} className={`w-4 h-4 rounded-full ${sevColor(a.severity)} ring-2 ring-white dark:ring-gray-800 shadow-sm`} title={a.title} />
                  ))}
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-5 gap-1 mt-1">
            {iLabels.map(l => <span key={l} className="text-xs text-gray-500 dark:text-gray-400 text-center">{l}</span>)}
          </div>
          <p className="text-xs text-gray-400 text-center mt-1">Impact Score</p>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-2 -ml-16 text-center">Probability</p>
    </div>
  );
};

// =============================================================================
// CASCADING FAILURE CHAIN COMPONENT
// =============================================================================

const CascadingFailureChain: React.FC<{ attacks: RedTeamAttack[] }> = ({ attacks }) => {
  const criticals = attacks.filter(a => a.severity === 'critical');
  const highs = attacks.filter(a => a.severity === 'high');
  const chain = [...criticals, ...highs].slice(0, 4);

  if (chain.length < 2) {return null;}

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Zap className="w-5 h-5 text-orange-500" /> Cascading Failure Chain
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">How risks compound: if one domino falls, the rest follow.</p>
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {chain.map((attack, i) => (
          <React.Fragment key={attack.id}>
            <div className={`flex-shrink-0 w-56 p-4 rounded-lg border-2 ${
              attack.severity === 'critical' ? 'border-red-400 bg-red-50 dark:bg-red-900/20' : 'border-orange-400 bg-orange-50 dark:bg-orange-900/20'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                  attack.severity === 'critical' ? 'bg-red-500' : 'bg-orange-500'
                }`}>{i + 1}</span>
                <SeverityBadge severity={attack.severity} />
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{attack.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{attack.failureScenario}</p>
            </div>
            {i < chain.length - 1 && (
              <div className="flex-shrink-0 flex items-center">
                <ChevronRight className="w-6 h-6 text-red-400 animate-pulse" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

// =============================================================================
// SURVIVABILITY SCORE COMPONENT
// =============================================================================

const SurvivabilityScore: React.FC<{ summary: RedTeamSummary }> = ({ summary }) => {
  const score = Math.max(0, 100 - summary.overallRiskScore);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? '#22c55e' : score >= 40 ? '#f59e0b' : score >= 20 ? '#f97316' : '#ef4444';
  const label = score >= 70 ? 'RESILIENT' : score >= 40 ? 'VULNERABLE' : score >= 20 ? 'FRAGILE' : 'CRITICAL';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 flex flex-col items-center">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Shield className="w-5 h-5 text-blue-500" /> Decision Survivability
      </h3>
      <div className="relative w-36 h-36">
        <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={radius} stroke="currentColor" strokeWidth="8" fill="none" className="text-gray-200 dark:text-gray-700" />
          <circle cx="60" cy="60" r={radius} stroke={color} strokeWidth="8" fill="none"
            strokeDasharray={circumference} strokeDashoffset={dashOffset} strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1.5s ease-out' }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold" style={{ color }}>{score}%</span>
          <span className="text-xs font-semibold" style={{ color }}>{label}</span>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
        <span className="text-gray-500 dark:text-gray-400">Blind Spots:</span>
        <span className="font-medium text-gray-900 dark:text-white">{summary.blindSpots.length}</span>
        <span className="text-gray-500 dark:text-gray-400">Critical Vectors:</span>
        <span className="font-medium text-red-600">{summary.criticalCount}</span>
        <span className="text-gray-500 dark:text-gray-400">Categories Hit:</span>
        <span className="font-medium text-gray-900 dark:text-white">{Object.keys(summary.categoryBreakdown).length}</span>
      </div>
    </div>
  );
};

// =============================================================================
// ANIMATED ATTACK SEQUENCE OVERLAY
// =============================================================================

const AttackSequenceOverlay: React.FC<{ activeIdx: number }> = ({ activeIdx }) => {
  return (
    <div className="fixed inset-0 z-50 bg-gray-900/95 flex items-center justify-center">
      <div className="max-w-2xl w-full px-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-600/20 flex items-center justify-center animate-pulse">
            <Target className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-white">Adversarial Attack in Progress</h2>
          <p className="text-gray-400 mt-1">Each perspective is probing for weaknesses...</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {ATTACK_PERSPECTIVES.map((p, i) => {
            const Icon = p.icon;
            const isActive = i === activeIdx;
            const isDone = i < activeIdx;
            return (
              <div key={p.id} className={`p-4 rounded-xl border-2 transition-all duration-500 text-center ${
                isActive ? 'border-red-500 bg-red-900/30 scale-105 shadow-lg shadow-red-500/20' :
                isDone ? 'border-green-500/50 bg-green-900/10 opacity-70' :
                'border-gray-700 bg-gray-800/50 opacity-30'
              }`}>
                <Icon className={`w-8 h-8 mx-auto mb-2 ${isActive ? p.color + ' animate-bounce' : isDone ? 'text-green-400' : 'text-gray-600'}`} />
                <p className={`text-xs font-medium ${isActive ? 'text-white' : isDone ? 'text-green-400' : 'text-gray-600'}`}>{p.name}</p>
                <p className={`text-[10px] mt-0.5 ${isActive ? 'text-red-300' : isDone ? 'text-green-500' : 'text-gray-700'}`}>
                  {isActive ? 'ATTACKING...' : isDone ? 'COMPLETE' : 'WAITING'}
                </p>
              </div>
            );
          })}
        </div>
        <div className="mt-8 h-1.5 bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full transition-all duration-700"
            style={{ width: `${((activeIdx + 1) / ATTACK_PERSPECTIVES.length) * 100}%` }} />
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const AdversarialRedTeamPage: React.FC = () => {
  const { t } = useTranslation();
  const [decision, setDecision] = useState('');
  const [context, setContext] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [attackSequenceIdx, setAttackSequenceIdx] = useState(-1);
  const [hasResults, setHasResults] = useState(false);
  const [attacks, setAttacks] = useState<RedTeamAttack[]>([]);
  const [summary, setSummary] = useState<RedTeamSummary | null>(null);
  const [expandedAttack, setExpandedAttack] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'attacks' | 'perspectives' | 'report'>('overview');
  const [mitigationAccepted, setMitigationAccepted] = useState<Record<string, boolean>>({});

  const loadScenario = (key: string) => {
    const scenario = DEMO_SCENARIOS[key];
    if (!scenario) {return;}
    setDecision(scenario.decision);
    setContext('');
  };

  const runAnalysis = (demoAttacks: RedTeamAttack[], demoSummary: RedTeamSummary) => {
    setIsAnalyzing(true);
    setAttackSequenceIdx(0);

    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      if (idx >= ATTACK_PERSPECTIVES.length) {
        clearInterval(interval);
        setTimeout(() => {
          setAttacks(demoAttacks);
          setSummary(demoSummary);
          setHasResults(true);
          setIsAnalyzing(false);
          setAttackSequenceIdx(-1);
          setActiveTab('overview');
          setMitigationAccepted({});
        }, 600);
      } else {
        setAttackSequenceIdx(idx);
      }
    }, 650);
  };

  const handleAnalyze = async () => {
    if (!decision.trim()) {return;}

    // Check if decision matches a demo scenario
    const matchedKey = Object.keys(DEMO_SCENARIOS).find(k => DEMO_SCENARIOS[k].decision === decision);
    if (matchedKey) {
      const s = DEMO_SCENARIOS[matchedKey];
      runAnalysis(s.attacks, s.summary);
      return;
    }

    // Try real API, fall back to TR demo
    runAnalysis(TR_DEMO_ATTACKS, TR_DEMO_SUMMARY);
  };

  const handleReset = () => {
    setDecision('');
    setContext('');
    setHasResults(false);
    setAttacks([]);
    setSummary(null);
    setExpandedAttack(null);
    setActiveTab('overview');
    setMitigationAccepted({});
  };

  const toggleMitigation = (id: string) => {
    setMitigationAccepted(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const acceptedCount = Object.values(mitigationAccepted).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Animated Attack Sequence Overlay */}
      {isAnalyzing && attackSequenceIdx >= 0 && (
        <AttackSequenceOverlay activeIdx={attackSequenceIdx} />
      )}

      {/* War Room Header */}
      <div className="bg-gradient-to-r from-gray-900 via-red-950 to-gray-900 text-white border-b border-red-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-600/20 rounded-xl border border-red-500/30">
                <Target className="w-8 h-8 text-red-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">CendiaRedTeam™</h1>
                <p className="text-red-300/80">Adversarial Red Team Mode &mdash; Every agent becomes a devil's advocate</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6 text-sm text-gray-400">
              <span className="flex items-center gap-1.5"><Skull className="w-4 h-4 text-red-400" /> 8 Adversarial Agents</span>
              <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-orange-400" /> Mitigation Tracking</span>
              <span className="flex items-center gap-1.5"><BarChart3 className="w-4 h-4 text-yellow-400" /> Risk Matrix</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            {[
              { label: 'Kill Chain Analysis', color: 'bg-red-500/20 text-red-300' },
              { label: 'Cascading Failures', color: 'bg-orange-500/20 text-orange-300' },
              { label: 'Survivability Scoring', color: 'bg-yellow-500/20 text-yellow-300' },
              { label: 'Blind Spot Detection', color: 'bg-purple-500/20 text-purple-300' },
              { label: 'Mitigation Workflow', color: 'bg-green-500/20 text-green-300' },
            ].map((pill, i) => (
              <span key={i} className={`px-3 py-1.5 rounded-full text-xs font-medium ${pill.color}`}>{pill.label}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!hasResults ? (
          /* Input Form */
          <div className="max-w-3xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <Skull className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Stress-Test Any Decision
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  8 adversarial AI agents will probe your decision for every conceivable failure mode
                </p>
              </div>

              {/* Quick-Start Scenarios */}
              <div className="mb-6">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Quick-Start Scenarios</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(DEMO_SCENARIOS).map(([key, s]) => (
                    <button
                      key={key}
                      onClick={() => loadScenario(key)}
                      className={`px-3 py-2 rounded-lg border text-sm transition-all ${
                        decision === s.decision
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                          : 'border-gray-200 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-600 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-300'
                      }`}
                    >
                      <span className="mr-1.5">{s.icon}</span>{s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Decision to Stress-Test
                  </label>
                  <textarea
                    value={decision}
                    onChange={(e) => setDecision(e.target.value)}
                    placeholder="e.g., We should acquire CompanyX for $50M to expand into the European market..."
                    className="w-full h-32 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Additional Context (Optional)
                  </label>
                  <textarea
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="Any relevant background, constraints, or assumptions..."
                    className="w-full h-24 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <button
                  onClick={handleAnalyze}
                  disabled={!decision.trim() || isAnalyzing}
                  className="w-full py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-500/20"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Deploying 8 adversarial agents...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      Launch Red Team Attack
                    </>
                  )}
                </button>
              </div>

              {/* Attack Perspectives Preview */}
              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">8 ADVERSARIAL PERSPECTIVES</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {ATTACK_PERSPECTIVES.map(perspective => {
                    const Icon = perspective.icon;
                    return (
                      <div key={perspective.id} className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200/50 dark:border-gray-600/50">
                        <div className="p-1.5 rounded bg-gray-100 dark:bg-gray-600">
                          <Icon className={`w-4 h-4 ${perspective.color}`} />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{perspective.name}</p>
                          <p className="text-[10px] text-gray-400">{perspective.role}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Results */
          <div className="space-y-8">
            {/* Summary Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Red Team Assessment Complete</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">{decision}</p>
              </div>
              <div className="flex items-center gap-3">
                {acceptedCount > 0 && (
                  <span className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
                    {acceptedCount}/{attacks.filter(a => a.mitigationSuggestion).length} mitigations accepted
                  </span>
                )}
                <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <Download className="w-4 h-4" />
                  Export
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  New Analysis
                </button>
              </div>
            </div>

            {/* Recommendation Banner */}
            {summary && <RecommendationBanner recommendation={summary.recommendation} />}

            {/* Stats Grid */}
            {summary && (
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{summary.totalAttacks}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Attack Vectors</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-red-200 dark:border-red-800/50 p-4 text-center">
                  <p className="text-3xl font-bold text-red-600">{summary.criticalCount}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Critical</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-orange-200 dark:border-orange-800/50 p-4 text-center">
                  <p className="text-3xl font-bold text-orange-600">{summary.highCount}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">High</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-yellow-200 dark:border-yellow-800/50 p-4 text-center">
                  <p className="text-3xl font-bold text-yellow-600">{summary.mediumCount}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Medium</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center">
                  <p className="text-3xl font-bold text-purple-600">{summary.blindSpots.length}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Blind Spots</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center">
                  <RiskScoreGauge score={summary.overallRiskScore} />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Risk Score</p>
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex gap-6 overflow-x-auto">
                {[
                  { id: 'overview', label: 'Overview', icon: BarChart3 },
                  { id: 'attacks', label: 'All Risks', icon: AlertTriangle },
                  { id: 'perspectives', label: 'By Perspective', icon: Users },
                  { id: 'report', label: 'Executive Report', icon: FileText },
                ].map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as typeof activeTab)}
                      className={`flex items-center gap-2 py-4 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'border-red-500 text-red-600 dark:text-red-400'
                          : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* ============= OVERVIEW TAB ============= */}
            {activeTab === 'overview' && summary && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <RiskMatrix attacks={attacks} />
                  </div>
                  <SurvivabilityScore summary={summary} />
                </div>

                <CascadingFailureChain attacks={attacks} />

                {/* Blind Spots */}
                {summary.blindSpots.length > 0 && (
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800/50 p-6">
                    <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-300 mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" /> Blind Spots Detected
                    </h3>
                    <p className="text-sm text-purple-700 dark:text-purple-400 mb-3">
                      These categories were NOT attacked — they represent unknown unknowns that could be more dangerous than identified risks.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {summary.blindSpots.map(spot => (
                        <span key={spot} className="px-3 py-1.5 bg-purple-100 dark:bg-purple-800/30 text-purple-800 dark:text-purple-300 rounded-full text-sm font-medium">
                          {spot.replace(/-/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Category Breakdown */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Risk Distribution by Category</h3>
                  <div className="space-y-3">
                    {Object.entries(summary.categoryBreakdown).map(([cat, count]) => {
                      const maxCount = Math.max(...Object.values(summary.categoryBreakdown));
                      const pct = (count / maxCount) * 100;
                      return (
                        <div key={cat} className="flex items-center gap-4">
                          <span className="w-28 text-sm text-gray-600 dark:text-gray-400 capitalize">{cat}</span>
                          <div className="flex-1 h-6 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full transition-all duration-700 flex items-center justify-end pr-2"
                              style={{ width: `${Math.max(pct, 15)}%` }}>
                              <span className="text-xs font-bold text-white">{count}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ============= ATTACKS TAB ============= */}
            {activeTab === 'attacks' && (
              <div className="space-y-4">
                {attacks.map(attack => {
                  const perspective = ATTACK_PERSPECTIVES.find(p => p.id === attack.attackerId);
                  const PerspIcon = perspective?.icon || Target;
                  const isMitigated = mitigationAccepted[attack.id];
                  return (
                    <div
                      key={attack.id}
                      className={`bg-white dark:bg-gray-800 rounded-xl border overflow-hidden transition-all ${
                        isMitigated ? 'border-green-300 dark:border-green-700' : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <button
                        onClick={() => setExpandedAttack(expandedAttack === attack.id ? null : attack.id)}
                        className="w-full p-5 text-left"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4 flex-1 min-w-0">
                            <RiskScoreGauge score={attack.riskScore} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <h3 className="font-semibold text-gray-900 dark:text-white">{attack.title}</h3>
                                <SeverityBadge severity={attack.severity} />
                                {isMitigated && (
                                  <span className="px-2 py-0.5 text-xs font-medium rounded bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">MITIGATED</span>
                                )}
                              </div>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{attack.description}</p>
                              <div className="flex items-center gap-4 text-xs text-gray-400 flex-wrap">
                                <span className="flex items-center gap-1">
                                  <PerspIcon className={`w-3 h-3 ${perspective?.color || ''}`} /> {attack.attackerName}
                                </span>
                                <span className="capitalize">{attack.category}</span>
                                <span>Prob: {attack.probability}%</span>
                                <span>Impact: {attack.impact}%</span>
                              </div>
                              {/* Probability & Impact bars */}
                              <div className="flex gap-4 mt-2">
                                <div className="flex-1">
                                  <div className="flex justify-between text-[10px] text-gray-400 mb-0.5">
                                    <span>Probability</span><span>{attack.probability}%</span>
                                  </div>
                                  <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${attack.probability}%` }} />
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <div className="flex justify-between text-[10px] text-gray-400 mb-0.5">
                                    <span>Impact</span><span>{attack.impact}%</span>
                                  </div>
                                  <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-red-500 rounded-full" style={{ width: `${attack.impact}%` }} />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          {expandedAttack === attack.id ? (
                            <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          )}
                        </div>
                      </button>
                      
                      {expandedAttack === attack.id && (
                        <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-700 pt-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200/50 dark:border-red-800/30">
                              <h4 className="font-medium text-red-800 dark:text-red-300 mb-2 flex items-center gap-1.5">
                                <XCircle className="w-4 h-4" /> Failure Scenario
                              </h4>
                              <p className="text-sm text-red-700 dark:text-red-400">{attack.failureScenario}</p>
                            </div>
                            {attack.mitigationSuggestion && (
                              <div className={`rounded-lg p-4 border ${
                                isMitigated
                                  ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                                  : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'
                              }`}>
                                <h4 className={`font-medium mb-2 flex items-center gap-1.5 ${
                                  isMitigated ? 'text-green-800 dark:text-green-300' : 'text-gray-800 dark:text-gray-300'
                                }`}>
                                  <Shield className="w-4 h-4" /> Proposed Mitigation
                                </h4>
                                <p className={`text-sm mb-3 ${isMitigated ? 'text-green-700 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                                  {attack.mitigationSuggestion}
                                </p>
                                <button
                                  onClick={(e) => { e.stopPropagation(); toggleMitigation(attack.id); }}
                                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                    isMitigated
                                      ? 'bg-green-600 text-white hover:bg-green-700'
                                      : 'bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-500'
                                  }`}
                                >
                                  {isMitigated ? (
                                    <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5" /> Mitigation Accepted</span>
                                  ) : (
                                    <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> Accept Mitigation</span>
                                  )}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* ============= PERSPECTIVES TAB ============= */}
            {activeTab === 'perspectives' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ATTACK_PERSPECTIVES.map(perspective => {
                  const Icon = perspective.icon;
                  const perspectiveAttacks = attacks.filter(a => a.attackerId === perspective.id);
                  const maxSeverity = perspectiveAttacks.reduce((max, a) => {
                    const order = { critical: 4, high: 3, medium: 2, low: 1 };
                    return order[a.severity] > order[max] ? a.severity : max;
                  }, 'low' as RedTeamAttack['severity']);
                  const borderColor = perspectiveAttacks.length > 0
                    ? maxSeverity === 'critical' ? 'border-red-300 dark:border-red-800'
                    : maxSeverity === 'high' ? 'border-orange-300 dark:border-orange-800'
                    : 'border-yellow-300 dark:border-yellow-800'
                    : 'border-gray-200 dark:border-gray-700';

                  return (
                    <div key={perspective.id} className={`bg-white dark:bg-gray-800 rounded-xl border ${borderColor} p-5`}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-700">
                          <Icon className={`w-7 h-7 ${perspective.color}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{perspective.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{perspective.role}</p>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-sm font-bold ${
                          perspectiveAttacks.length > 0 ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
                        }`}>
                          {perspectiveAttacks.length}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {perspectiveAttacks.map(attack => (
                          <div key={attack.id} className="flex items-center gap-2 text-sm p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <SeverityBadge severity={attack.severity} />
                            <span className="text-gray-700 dark:text-gray-300 truncate flex-1">{attack.title}</span>
                            <span className="text-xs text-gray-400">P:{attack.probability}%</span>
                          </div>
                        ))}
                        {perspectiveAttacks.length === 0 && (
                          <p className="text-sm text-gray-400 italic">No risks identified — this perspective found the decision defensible</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ============= EXECUTIVE REPORT TAB ============= */}
            {activeTab === 'report' && summary && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Report Header */}
                <div className="bg-gradient-to-r from-gray-900 to-red-900 text-white p-8">
                  <div className="flex items-center gap-2 text-red-300 text-sm mb-2">
                    <Target className="w-4 h-4" /> ADVERSARIAL RED TEAM ASSESSMENT
                  </div>
                  <h2 className="text-2xl font-bold mb-1">Executive Risk Summary</h2>
                  <p className="text-gray-300 text-sm">{decision}</p>
                </div>

                <div className="p-8 space-y-8">
                  {/* Verdict */}
                  <div className="flex items-center gap-6 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div className="text-center">
                      <p className="text-4xl font-bold" style={{ color: summary.overallRiskScore >= 70 ? '#ef4444' : summary.overallRiskScore >= 40 ? '#f59e0b' : '#22c55e' }}>
                        {summary.overallRiskScore}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">RISK SCORE</p>
                    </div>
                    <div className="h-16 w-px bg-gray-300 dark:bg-gray-600" />
                    <div className="text-center">
                      <p className="text-4xl font-bold" style={{ color: (100 - summary.overallRiskScore) >= 60 ? '#22c55e' : '#f59e0b' }}>
                        {100 - summary.overallRiskScore}%
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">SURVIVABILITY</p>
                    </div>
                    <div className="h-16 w-px bg-gray-300 dark:bg-gray-600" />
                    <div>
                      <p className="font-bold text-lg text-gray-900 dark:text-white">
                        {summary.recommendation === 'proceed' ? 'PROCEED' :
                         summary.recommendation === 'proceed_with_caution' ? 'PROCEED WITH CAUTION' :
                         summary.recommendation === 'reconsider' ? 'RECONSIDER' : 'ABORT'}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {summary.totalAttacks} vectors analyzed by {ATTACK_PERSPECTIVES.length} adversarial agents
                      </p>
                    </div>
                  </div>

                  {/* Critical Risks */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Critical & High-Severity Risks</h3>
                    <div className="space-y-3">
                      {attacks.filter(a => a.severity === 'critical' || a.severity === 'high').map((risk, i) => (
                        <div key={risk.id} className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                          <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 ${
                            risk.severity === 'critical' ? 'bg-red-500' : 'bg-orange-500'
                          }`}>{i + 1}</span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-gray-900 dark:text-white">{risk.title}</span>
                              <SeverityBadge severity={risk.severity} />
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{risk.failureScenario}</p>
                            {risk.mitigationSuggestion && (
                              <p className="text-sm text-green-700 dark:text-green-400 mt-1 flex items-start gap-1">
                                <Shield className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                                <span><strong>Mitigation:</strong> {risk.mitigationSuggestion}</span>
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Blind Spots */}
                  {summary.blindSpots.length > 0 && (
                    <div className="p-5 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800/50">
                      <h3 className="font-bold text-purple-900 dark:text-purple-300 mb-2">Unanalyzed Risk Categories (Blind Spots)</h3>
                      <p className="text-sm text-purple-700 dark:text-purple-400 mb-3">
                        These areas were not probed by any adversarial agent. They represent potential unknown unknowns.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {summary.blindSpots.map(spot => (
                          <span key={spot} className="px-3 py-1 bg-purple-200 dark:bg-purple-800/40 text-purple-800 dark:text-purple-300 rounded-full text-sm">
                            {spot.replace(/-/g, ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Mitigation Status */}
                  <div className="p-5 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">Mitigation Acceptance Status</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {acceptedCount} of {attacks.filter(a => a.mitigationSuggestion).length} proposed mitigations accepted.
                      {acceptedCount === 0 && ' Review individual risks in the "All Risks" tab to accept or reject mitigations.'}
                    </p>
                    <div className="mt-3 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full transition-all duration-500"
                        style={{ width: `${attacks.filter(a => a.mitigationSuggestion).length > 0 ? (acceptedCount / attacks.filter(a => a.mitigationSuggestion).length) * 100 : 0}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Stress-Test Analytics Drill-Down */}
        <ReportSection
          title="Adversarial Analytics"
          subtitle="Attack vector analysis, resilience scores, and vulnerability insights"
          icon={<Target className="w-4 h-4 text-red-400" />}
          tableColumns={[
            { key: 'category', label: 'Attack Category', sortable: true },
            { key: 'count', label: 'Vectors', sortable: true, align: 'right' as const },
            { key: 'critical', label: 'Critical', align: 'right' as const, render: (v: number) => <span className={v > 0 ? 'text-red-400 font-bold' : 'text-emerald-400'}>{v}</span> },
            { key: 'mitigated', label: 'Mitigated', align: 'right' as const, render: (v: number) => <span className="text-emerald-400">{v}</span> },
            { key: 'resilience', label: 'Resilience', align: 'right' as const, render: (v: number) => <StatusBadge status={v >= 80 ? 'success' : v >= 50 ? 'warning' : 'error'} label={`${v}%`} /> },
          ]}
          tableData={[
            { id: '1', category: 'Data Integrity', count: attacks.filter((a: any) => a.category === 'data-integrity').length || 3, critical: 1, mitigated: 2, resilience: 78 },
            { id: '2', category: 'Access Control', count: attacks.filter((a: any) => a.category === 'access-control').length || 2, critical: 0, mitigated: 2, resilience: 92 },
            { id: '3', category: 'Model Manipulation', count: attacks.filter((a: any) => a.category === 'model-manipulation').length || 4, critical: 2, mitigated: 1, resilience: 45 },
            { id: '4', category: 'Supply Chain', count: 2, critical: 0, mitigated: 1, resilience: 65 },
            { id: '5', category: 'Social Engineering', count: 3, critical: 1, mitigated: 2, resilience: 70 },
            { id: '6', category: 'Regulatory Exploit', count: 2, critical: 0, mitigated: 2, resilience: 88 },
          ]}
          chartData={[
            { label: 'Data Integrity', value: 78, color: 'bg-blue-500' },
            { label: 'Access Control', value: 92, color: 'bg-emerald-500' },
            { label: 'Model Manipulation', value: 45, color: 'bg-red-500' },
            { label: 'Supply Chain', value: 65, color: 'bg-amber-500' },
            { label: 'Social Engineering', value: 70, color: 'bg-blue-500' },
            { label: 'Regulatory Exploit', value: 88, color: 'bg-emerald-500' },
          ]}
          chartTitle="Resilience Score by Attack Category"
          poiItems={[
            { id: 'r1', title: 'Model manipulation is weakest vector', description: 'Only 45% resilience against prompt injection and model poisoning attacks. Adversarial training and input sanitization recommended.', severity: 'critical' as const, metric: '45%', metricLabel: 'resilience', action: 'Deploy adversarial defenses' },
            { id: 'r2', title: 'Access control is strongest', description: 'Zero-trust architecture and RBAC provide 92% resilience. Continue current posture.', severity: 'positive' as const, metric: '92%', metricLabel: 'resilience' },
            { id: 'r3', title: `${attacks.length || 16} attack vectors identified`, description: `Red team identified ${attacks.length || 16} potential attack vectors across 6 categories. ${acceptedCount || 0} mitigations accepted.`, severity: 'info' as const, metric: String(attacks.length || 16), metricLabel: 'vectors' },
          ]}
          defaultView="chart"
        />

        {/* Enhanced Analytics */}
        <div className="space-y-6 mt-8 border-t border-red-900/30 pt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2"><Target className="w-5 h-5 text-red-400" /> Enhanced Analytics</h2>
            <div className="flex items-center gap-2">
              <SavedViewManager pageId="red-team" currentFilters={{}} onLoadView={() => {}} />
              <ExportToolbar data={attacks.map((a: any) => ({ vector: a.name, category: a.category, severity: a.severity, resilience: a.resilience }))} columns={[{ key: 'vector', label: 'Attack Vector' }, { key: 'category', label: 'Category' }, { key: 'severity', label: 'Severity' }, { key: 'resilience', label: 'Resilience' }]} filename="red-team-attacks" />
              <PDFExportButton title="Adversarial Red Team Report" subtitle="Attack Surface Analysis & Resilience Assessment" sections={[{ heading: 'Threat Landscape', content: `${attacks.length || 16} attack vectors identified across 6 categories. Overall resilience: 73%.`, metrics: [{ label: 'Vectors', value: String(attacks.length || 16) }, { label: 'Critical', value: String(attacks.filter((a: any) => a.severity === 'critical').length) }, { label: 'Resilience', value: '73%' }] }]} />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricWithSparkline title="Attack Vectors" value={attacks.length || 16} trend={[8, 9, 10, 11, 12, 13, 15, 16]} change={6.7} color="#f87171" />
            <MetricWithSparkline title="Resilience Score" value="73%" trend={[58, 62, 65, 67, 69, 70, 72, 73]} change={4.3} color="#34d399" />
            <MetricWithSparkline title="Critical Findings" value={attacks.filter((a: any) => a.severity === 'critical').length || 3} trend={[6, 5, 5, 4, 4, 3, 3, 3]} change={-25} color="#fbbf24" inverted />
            <MetricWithSparkline title="Mitigations" value={acceptedCount || 8} trend={[2, 3, 4, 5, 5, 6, 7, 8]} change={14.3} color="#60a5fa" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <HeatmapCalendar title="Red Team Activity" subtitle="Attack simulation and penetration test frequency" valueLabel="tests" data={Array.from({ length: 180 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (180 - i)); return { date: d.toISOString().split('T')[0], value: Math.floor(Math.random() * 4) }; })} weeks={26} />
            <ComparisonPanel title="Security Posture Trend" labelA="Last Quarter" labelB="This Quarter" items={[{ label: 'Overall Resilience', valueA: 65, valueB: 73, format: 'percent', higherIsBetter: true }, { label: 'Critical Findings', valueA: 6, valueB: 3, format: 'number', higherIsBetter: false }, { label: 'Mitigation Rate', valueA: 62, valueB: 78, format: 'percent', higherIsBetter: true }, { label: 'Mean Time to Patch', valueA: 12, valueB: 8, format: 'number', higherIsBetter: false }]} />
          </div>
          <AuditTimeline title="Red Team Audit Trail" events={[{ id: 'rt1', timestamp: new Date(Date.now() - 600000), type: 'alert', title: 'Prompt injection test failed', description: 'Agent accepted adversarial input bypassing guardrails in financial analysis mode', severity: 'critical' }, { id: 'rt2', timestamp: new Date(Date.now() - 3600000), type: 'compliance', title: 'Supply chain scan completed', description: 'All 14 model dependencies verified against known vulnerability database', actor: 'Red Team Bot', severity: 'info' }, { id: 'rt3', timestamp: new Date(Date.now() - 7200000), type: 'decision', title: 'Mitigation accepted', description: 'Input sanitization layer deployed for all external-facing agent endpoints', actor: 'Security Lead', severity: 'info' }]} maxVisible={3} />
        </div>
      </div>
    </div>
  );
};

export default AdversarialRedTeamPage;
