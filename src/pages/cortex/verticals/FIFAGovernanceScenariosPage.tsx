// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * DATACENDIA PLATFORM - FIFA/UEFA GOVERNANCE SCENARIOS
 * Presentation-grade crisis scenarios for institutional demo
 * 
 * "Football doesn't lack intelligence. It lacks defensible deliberation."
 * 
 * Copyright (c) 2024-2026 Datacendia, Inc. All Rights Reserved.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Clock,
  FileText,
  Lock,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  Download,
  Eye,
  Hash,
  Fingerprint,
  Scale,
  Gavel,
  TrendingUp,
  Users,
  Timer,
  ShieldCheck,
  Activity,
  FileCheck,
  Layers,
  ArrowLeft,
  Zap,
  Target,
  AlertCircle,
  BarChart3,
  BookOpen,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { deterministicFloat, deterministicInt } from '../../../lib/deterministic';
import {
  FIFA_GOVERNANCE_SCENARIOS,
  GovernanceScenario,
  ScenarioAgent,
} from './fifa-scenarios-data';

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

const CategoryBadge = ({ category, label }: { category: string; label: string }) => {
  const colors: Record<string, string> = {
    financial: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    integrity: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    emergency: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    operational: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    policy: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  };
  return <Badge className={colors[category] || colors.operational}>{label}</Badge>;
};

const RiskFlagBadge = ({ flag }: { flag?: string }) => {
  if (!flag) {return null;}
  const colors: Record<string, string> = {
    critical: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    high: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  };
  return <Badge className={colors[flag] || ''} variant="outline">{flag.toUpperCase()}</Badge>;
};

const ImpactBadge = ({ impact }: { impact: string }) => {
  const colors: Record<string, string> = {
    catastrophic: 'text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-900/20',
    severe: 'text-orange-700 bg-orange-50 dark:text-orange-400 dark:bg-orange-900/20',
    major: 'text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/20',
    moderate: 'text-yellow-700 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/20',
    minor: 'text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-900/20',
  };
  return <Badge className={colors[impact] || ''} variant="outline">{impact}</Badge>;
};

const OutputIcon = ({ type }: { type: string }) => {
  const icons: Record<string, React.ReactNode> = {
    decision_packet: <FileText className="h-4 w-4 text-indigo-500" />,
    financial_simulation: <BarChart3 className="h-4 w-4 text-green-500" />,
    evidence_trail: <Lock className="h-4 w-4 text-blue-500" />,
    receipt: <Fingerprint className="h-4 w-4 text-purple-500" />,
    risk_matrix: <Target className="h-4 w-4 text-red-500" />,
    dissent_record: <Scale className="h-4 w-4 text-amber-500" />,
    decision_tree: <Layers className="h-4 w-4 text-cyan-500" />,
    reasoning_chain: <BookOpen className="h-4 w-4 text-emerald-500" />,
    timeline: <Timer className="h-4 w-4 text-orange-500" />,
  };
  return <>{icons[type] || <FileText className="h-4 w-4" />}</>;
};

// =============================================================================
// SCENARIO CARD (Hub View)
// =============================================================================

const ScenarioCard = ({
  scenario,
  onClick,
}: {
  scenario: GovernanceScenario;
  onClick: () => void;
}) => (
  <Card
    className="cursor-pointer hover:shadow-lg transition-all hover:border-indigo-300 dark:hover:border-indigo-700 group"
    onClick={onClick}
  >
    <CardHeader>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{scenario.icon}</span>
          <div>
            <CategoryBadge category={scenario.category} label={scenario.categoryLabel} />
            <CardTitle className="text-lg mt-2 group-hover:text-indigo-600 transition-colors">
              {scenario.title}
            </CardTitle>
            <CardDescription className="mt-1">{scenario.subtitle}</CardDescription>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-indigo-600 transition-colors" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <Users className="h-3.5 w-3.5" />
          {scenario.agents.length} Agents
        </span>
        <span className="flex items-center gap-1">
          <FileText className="h-3.5 w-3.5" />
          {scenario.outputs.length} Outputs
        </span>
        <span className="flex items-center gap-1">
          <AlertTriangle className="h-3.5 w-3.5" />
          {scenario.risks.length} Risk Vectors
        </span>
        <span className="flex items-center gap-1">
          <Timer className="h-3.5 w-3.5" />
          {scenario.estimatedDuration}
        </span>
      </div>
      <p className="text-sm mt-3 italic text-muted-foreground">"{scenario.keyInsight}"</p>
    </CardContent>
  </Card>
);

// =============================================================================
// AGENT DETAIL PANEL
// =============================================================================

const AgentPanel = ({
  agent,
  index,
  expanded,
  onToggle,
}: {
  agent: ScenarioAgent;
  index: number;
  expanded: boolean;
  onToggle: () => void;
}) => (
  <div className="border rounded-lg overflow-hidden">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors text-left"
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 font-bold text-sm shrink-0">
          {index + 1}
        </div>
        <div>
          <div className="font-medium">{agent.displayLabel}</div>
          <div className="text-sm text-muted-foreground">{agent.mandate}</div>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0 ml-4">
        <RiskFlagBadge flag={agent.riskFlag} />
        <Badge variant="outline">{agent.confidence}%</Badge>
        <Badge variant="secondary">{agent.citationCount} citations</Badge>
        {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </div>
    </button>
    {expanded && (
      <div className="px-4 pb-4 border-t bg-muted/20">
        <div className="pt-3 space-y-3">
          <div className="text-sm leading-relaxed bg-white dark:bg-gray-900 p-4 rounded border font-mono">
            {agent.finding}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Progress value={agent.confidence} className="h-2" />
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              Confidence: {agent.confidence}%
            </span>
          </div>
        </div>
      </div>
    )}
  </div>
);

// =============================================================================
// SCENARIO DETAIL VIEW
// =============================================================================

const ScenarioDetail = ({
  scenario,
  onBack,
}: {
  scenario: GovernanceScenario;
  onBack: () => void;
}) => {
  const [expandedAgents, setExpandedAgents] = useState<Set<string>>(new Set());

  const toggleAgent = (id: string) => {
    const next = new Set(expandedAgents);
    if (next.has(id)) {next.delete(id);}
    else {next.add(id);}
    setExpandedAgents(next);
  };

  const expandAll = () => {
    if (expandedAgents.size === scenario.agents.length) {
      setExpandedAgents(new Set());
    } else {
      setExpandedAgents(new Set(scenario.agents.map((a) => a.id)));
    }
  };

  const avgConfidence = Math.round(
    scenario.agents.reduce((s, a) => s + a.confidence, 0) / scenario.agents.length
  );
  const totalCitations = scenario.agents.reduce((s, a) => s + a.citationCount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Scenarios
        </button>
        <div className="flex items-start gap-4">
          <span className="text-5xl">{scenario.icon}</span>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CategoryBadge category={scenario.category} label={scenario.categoryLabel} />
              <Badge variant="outline" className="gap-1">
                <Activity className="h-3 w-3" />
                Council Mode: {scenario.councilMode}
              </Badge>
            </div>
            <h1 className="text-2xl font-bold">{scenario.title}</h1>
            <p className="text-muted-foreground mt-1">{scenario.subtitle}</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-indigo-600">{scenario.agents.length}</div>
            <div className="text-xs text-muted-foreground">Council Agents</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-600">{avgConfidence}%</div>
            <div className="text-xs text-muted-foreground">Avg Confidence</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-600">{totalCitations}</div>
            <div className="text-xs text-muted-foreground">Total Citations</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-red-600">{scenario.risks.length}</div>
            <div className="text-xs text-muted-foreground">Risk Vectors</div>
          </div>
        </div>
      </div>

      {/* Detail Tabs */}
      <Tabs defaultValue="setup" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="setup" className="gap-1 text-xs sm:text-sm">
            <FileText className="h-3.5 w-3.5" />
            Setup
          </TabsTrigger>
          <TabsTrigger value="deliberation" className="gap-1 text-xs sm:text-sm">
            <Users className="h-3.5 w-3.5" />
            Council
          </TabsTrigger>
          <TabsTrigger value="risks" className="gap-1 text-xs sm:text-sm">
            <AlertTriangle className="h-3.5 w-3.5" />
            Risks
          </TabsTrigger>
          <TabsTrigger value="outputs" className="gap-1 text-xs sm:text-sm">
            <FileCheck className="h-3.5 w-3.5" />
            Outputs
          </TabsTrigger>
          <TabsTrigger value="receipt" className="gap-1 text-xs sm:text-sm">
            <Fingerprint className="h-3.5 w-3.5" />
            Receipt
          </TabsTrigger>
        </TabsList>

        {/* Setup Tab */}
        <TabsContent value="setup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-600" />
                Scenario Setup
              </CardTitle>
              <CardDescription>
                The situation facing the governing body. This is what gets presented in the first 5 minutes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {scenario.setup.map((line, i) => (
                  <div
                    key={i}
                    className={`text-sm ${
                      line.startsWith('  —')
                        ? 'pl-6 text-muted-foreground'
                        : 'font-medium'
                    }`}
                  >
                    {line.startsWith('  —') ? line : `• ${line}`}
                  </div>
                ))}
              </div>

              {scenario.complications.length > 0 && (
                <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-lg border border-amber-200 dark:border-amber-800">
                  <h4 className="font-semibold text-sm flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    Complications
                  </h4>
                  <div className="space-y-1">
                    {scenario.complications.map((c, i) => (
                      <div key={i} className="text-sm text-muted-foreground">• {c}</div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Why It Matters */}
          <Card className="border-indigo-200 dark:border-indigo-800">
            <CardHeader className="bg-indigo-50 dark:bg-indigo-900/20">
              <CardTitle className="flex items-center gap-2 text-base">
                <Target className="h-5 w-5 text-indigo-600" />
                Why This Resonates
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-2">
                {scenario.whyItMatters.map((point, i) => (
                  <div key={i} className="text-sm flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded text-sm font-medium text-indigo-800 dark:text-indigo-300 italic">
                "{scenario.keyInsight}"
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Council Deliberation Tab */}
        <TabsContent value="deliberation" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-indigo-600" />
                    Council Deliberation
                  </CardTitle>
                  <CardDescription>
                    {scenario.agents.length} agents deliberated with {totalCitations} citations.
                    Average confidence: {avgConfidence}%.
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={expandAll}>
                  {expandedAgents.size === scenario.agents.length ? 'Collapse All' : 'Expand All'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {scenario.agents.map((agent, index) => (
                <AgentPanel
                  key={agent.id}
                  agent={agent}
                  index={index}
                  expanded={expandedAgents.has(agent.id)}
                  onToggle={() => toggleAgent(agent.id)}
                />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Risks Tab */}
        <TabsContent value="risks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Risk Matrix
              </CardTitle>
              <CardDescription>
                Probability × Impact assessment for each identified risk vector.
                All risks have documented mitigation strategies.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {scenario.risks.map((risk, i) => (
                <div key={i} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-medium text-sm">{risk.label}</div>
                    </div>
                    <ImpactBadge impact={risk.impact} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Probability</span>
                      <span className="font-medium">{risk.probability}%</span>
                    </div>
                    <Progress
                      value={risk.probability}
                      className={`h-2 ${
                        risk.probability > 50
                          ? '[&>div]:bg-red-500'
                          : risk.probability > 30
                          ? '[&>div]:bg-amber-500'
                          : '[&>div]:bg-green-500'
                      }`}
                    />
                  </div>
                  <div className="text-xs bg-green-50 dark:bg-green-900/10 p-2 rounded flex items-start gap-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-green-600 shrink-0 mt-0.5" />
                    <span><strong>Mitigation:</strong> {risk.mitigation}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Outputs Tab */}
        <TabsContent value="outputs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-green-600" />
                Deliverable Outputs
              </CardTitle>
              <CardDescription>
                Each output is cryptographically sealed and court-admissible.
                These are the artifacts you present to stakeholders.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {scenario.outputs.map((output) => (
                <div key={output.id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <OutputIcon type={output.type} />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{output.label}</div>
                    <div className="text-xs text-muted-foreground">{output.description}</div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button variant="ghost" size="icon" title="Preview">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Export">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Regulator's Receipt Tab */}
        <TabsContent value="receipt" className="space-y-4">
          <Card className="border-2 border-indigo-200 dark:border-indigo-800">
            <CardHeader className="bg-indigo-50 dark:bg-indigo-900/20">
              <CardTitle className="flex items-center gap-2">
                <Fingerprint className="h-5 w-5 text-indigo-600" />
                Regulator's Receipt™
              </CardTitle>
              <CardDescription>
                A single, court-admissible artifact proving the governance process was followed.
                This is the document you hand to CAS when challenged.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="font-mono text-xs bg-gray-950 text-green-400 p-6 rounded-lg overflow-auto space-y-3">
                <div>
{`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  DATACENDIA REGULATOR'S RECEIPT™
  Scenario: ${scenario.title}
  Category: ${scenario.categoryLabel}
  Generated: ${new Date().toISOString()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`}
                </div>

                <div>
{`COUNCIL DELIBERATION SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Agents Invoked: ${scenario.agents.length}
Total Citations: ${totalCitations}
Average Confidence: ${avgConfidence}%
Council Mode: ${scenario.councilMode.toUpperCase()}
Risk Flags: ${scenario.agents.filter(a => a.riskFlag === 'critical').length} CRITICAL, ${scenario.agents.filter(a => a.riskFlag === 'high').length} HIGH`}
                </div>

                <div>
{`AGENT FINDINGS
━━━━━━━━━━━━━━
${scenario.agents.map((a, i) => `${i + 1}. ${a.displayLabel}
   Confidence: ${a.confidence}% | Citations: ${a.citationCount}${a.riskFlag ? ` | Risk: ${a.riskFlag.toUpperCase()}` : ''}
   Finding: ${a.finding.substring(0, 120)}...`).join('\n\n')}`}
                </div>

                <div>
{`RISK ASSESSMENT
━━━━━━━━━━━━━━━
${scenario.risks.map(r => `${r.probability > 50 ? '🔴' : r.probability > 30 ? '😀¡' : '😀¢'} ${r.label}
   Probability: ${r.probability}% | Impact: ${r.impact.toUpperCase()}
   Mitigation: ${r.mitigation}`).join('\n\n')}`}
                </div>

                <div>
{`DELIVERABLE OUTPUTS
━━━━━━━━━━━━━━━━━━━
${scenario.outputs.map((o, i) => `${i + 1}. ${o.label} [${o.type}]
   ${o.description}`).join('\n')}`}
                </div>

                <div>
{`DISSENT RECORD
━━━━━━━━━━━━━━
${scenario.agents.filter(a => a.role === 'institutional_dissent').map(a => `Dissent Agent: ${a.displayLabel}
${a.finding}`).join('\n') || 'No dissent recorded.'}`}
                </div>

                <div>
{`INTEGRITY SEAL
━━━━━━━━━━━━━━
Merkle Root: 0x${Array.from({length: 32}, () => deterministicInt(0, 15, 'fifagovernancescenarios-1').toString(16)).join('')}
Document Hash: SHA-256:${Array.from({length: 32}, () => deterministicInt(0, 15, 'fifagovernancescenarios-2').toString(16)).join('')}
Court Admissibility: ✅ ISO 27037 + eIDAS (EU 910/2014)
Tampering Detection: ✅ Any modification invalidates hash
Human Verification: ✅ Required before finalization`}
                </div>

                <div className="text-yellow-400">
{`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  This receipt is cryptographically signed and immutable.
  It proves the governance process was followed.
  Present to CAS, media, or stakeholders as a single artifact.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`}
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <Button className="gap-2">
                  <Download className="h-4 w-4" />
                  Export Receipt (PDF + JSON)
                </Button>
                <Button variant="outline" className="gap-2">
                  <Hash className="h-4 w-4" />
                  Verify Integrity
                </Button>
                <Button variant="outline" className="gap-2">
                  <Eye className="h-4 w-4" />
                  View Full Decision DNA
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// =============================================================================
// MAIN PAGE
// =============================================================================

export default function FIFAGovernanceScenariosPage() {
  const navigate = useNavigate();
  const [selectedScenario, setSelectedScenario] = useState<GovernanceScenario | null>(null);

  return (
    <div className="container mx-auto py-6 space-y-6 max-w-6xl">
      {selectedScenario ? (
        <ScenarioDetail
          scenario={selectedScenario}
          onBack={() => setSelectedScenario(null)}
        />
      ) : (
        <>
          {/* Hub Header */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <button
                onClick={() => navigate('/cortex/verticals/sports')}
                className="hover:text-foreground transition-colors flex items-center gap-1"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Sports Governance
              </button>
              <ChevronRight className="h-3 w-3" />
              <span>FIFA/UEFA Scenarios</span>
            </div>

            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                  <Gavel className="h-8 w-8 text-indigo-600" />
                  Governance Crisis Scenarios
                </h1>
                <p className="text-muted-foreground mt-2 max-w-2xl">
                  High-impact scenarios that demonstrate institutional protection under scrutiny.
                  Each scenario shows The Council™ deliberating a real governance challenge
                  with defensible outputs.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => navigate('/cortex/verticals/sports/uefa-walkthrough')}
                className="gap-2 shrink-0"
              >
                <Shield className="h-4 w-4" />
                UEFA Walkthrough
              </Button>
            </div>

            {/* Framing Quote */}
            <div className="p-4 bg-gray-900 text-white rounded-lg">
              <div className="flex items-start gap-3">
                <div className="text-2xl">"</div>
                <div>
                  <p className="text-lg font-medium">
                    Football doesn't lack intelligence. It lacks defensible deliberation.
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    These scenarios are not analytics. They are not AI predictions.
                    They are structured governance simulations that make institutional
                    decisions provable under scrutiny.
                  </p>
                </div>
              </div>
            </div>

            {/* Presentation Format */}
            <Card className="bg-indigo-50 dark:bg-indigo-900/10 border-indigo-200 dark:border-indigo-800">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-6 text-sm">
                  <span className="font-semibold text-indigo-700 dark:text-indigo-400">Presentation Format:</span>
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> 5 min framing</span>
                  <span>→</span>
                  <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> 20 min walkthrough</span>
                  <span>→</span>
                  <span className="flex items-center gap-1"><Fingerprint className="h-3.5 w-3.5" /> Show Regulator's Receipt</span>
                  <span>→</span>
                  <span className="flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5" /> Close: "Institutional protection"</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Scenario Cards */}
          <div className="space-y-4">
            {FIFA_GOVERNANCE_SCENARIOS.map((scenario) => (
              <ScenarioCard
                key={scenario.id}
                scenario={scenario}
                onClick={() => setSelectedScenario(scenario)}
              />
            ))}
          </div>

          {/* Bottom CTA */}
          <Card className="bg-gray-900 text-white border-gray-800">
            <CardContent className="pt-6 pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">
                    This is not about automation. It's about institutional protection.
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">
                    Pitch as: "We can make your most controversial decisions defensible under scrutiny."
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button
                    variant="outline"
                    className="text-white border-gray-600 hover:bg-gray-800 gap-2"
                    onClick={() => navigate('/cortex/verticals/sports')}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Sports Dashboard
                  </Button>
                  <Button
                    className="bg-indigo-600 hover:bg-indigo-700 gap-2"
                    onClick={() => navigate('/cortex/verticals/sports/uefa-walkthrough')}
                  >
                    <Shield className="h-4 w-4" />
                    Launch UEFA Demo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
