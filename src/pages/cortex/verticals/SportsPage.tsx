// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * DATACENDIA PLATFORM - SPORTS VERTICAL
 * Football/Soccer DDGI Dashboard
 * 
 * Copyright (c) 2024-2026 Datacendia, Inc. All Rights Reserved.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Trophy,
  Users,
  FileText,
  TrendingUp,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  ChevronRight,
  DollarSign,
  BarChart3,
  Scale,
  Gavel,
  Layers,
  Activity,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SportsService, TransferDecision, ComplianceFramework } from '@/services/SportsService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/Toast';

// =============================================================================
// MOCK DATA FOR DEMO
// =============================================================================

const MOCK_DECISIONS: TransferDecision[] = [
  {
    id: 'trf-2026-001',
    organizationId: 'celtic-fc',
    templateId: 'transfer-inbound-v1',
    status: 'completed',
    createdAt: '2026-01-15T10:30:00Z',
    updatedAt: '2026-01-20T14:00:00Z',
    createdBy: 'sporting-director',
    lockedAt: '2026-01-20T14:00:00Z',
    auditHash: 'a3f8c2e1...',
    transactionType: 'inbound',
    player: {
      name: 'Kyogo Furuhashi',
      position: 'ST',
      nationality: 'Japanese',
      dateOfBirth: '1995-01-20',
    },
    counterpartyClub: {
      name: 'Vissel Kobe',
      country: 'Japan',
      league: 'J1 League',
    },
    transferFee: 4500000,
    addOns: 500000,
    agentFee: 400000,
    scoutingAssessment: {
      matchesObserved: 18,
      videoAnalysisComplete: true,
      dataProfile: 'Elite pressing, top 5% xG/90',
      characterReferences: 4,
      recommendation: 'strong_buy',
    },
    valuation: {
      methodology: 'Market comparable + performance model',
      marketComparables: 'Similar J-League exports £3-6M',
      internalValuation: 4200000,
      negotiatedFee: 4500000,
      premium: 7.1,
    },
    alternativesConsidered: [],
    approvals: [
      { role: 'sporting_director', userId: 'sd-1', userName: 'Mark Lawwell', decision: 'approved', timestamp: '2026-01-18T09:00:00Z' },
      { role: 'cfo', userId: 'cfo-1', userName: 'Chris McKay', decision: 'approved', timestamp: '2026-01-19T11:00:00Z' },
    ],
    complianceChecks: [
      { framework: 'UEFA_FFP', status: 'passed' },
      { framework: 'FIFA_AGENT_REGS', status: 'passed' },
    ],
    evidenceAttachments: [
      { id: 'ev-1', type: 'scouting_report', filename: 'kyogo_scout_report.pdf', uploadedAt: '2026-01-16T08:00:00Z', uploadedBy: 'scout-1', hash: 'abc123...' },
      { id: 'ev-2', type: 'valuation_analysis', filename: 'kyogo_valuation.xlsx', uploadedAt: '2026-01-17T10:00:00Z', uploadedBy: 'analyst-1', hash: 'def456...' },
    ],
    timeline: [],
  },
  {
    id: 'trf-2026-002',
    organizationId: 'celtic-fc',
    templateId: 'transfer-inbound-v1',
    status: 'pending_approval',
    createdAt: '2026-01-25T14:00:00Z',
    updatedAt: '2026-01-28T16:30:00Z',
    createdBy: 'sporting-director',
    transactionType: 'inbound',
    player: {
      name: 'Paulo Bernardo',
      position: 'CM',
      nationality: 'Portuguese',
      dateOfBirth: '2002-02-24',
    },
    counterpartyClub: {
      name: 'Benfica',
      country: 'Portugal',
      league: 'Primeira Liga',
    },
    transferFee: 6000000,
    addOns: 2000000,
    agentFee: 600000,
    scoutingAssessment: {
      matchesObserved: 24,
      videoAnalysisComplete: true,
      dataProfile: 'Elite ball progression, top 10% pass completion under pressure',
      characterReferences: 3,
      recommendation: 'buy',
    },
    valuation: {
      methodology: 'Multi-factor model with loan performance',
      marketComparables: 'Similar Portuguese exports £5-10M',
      internalValuation: 5500000,
      negotiatedFee: 6000000,
      premium: 9.1,
    },
    alternativesConsidered: [
      { playerName: 'Alternative A', reason: 'Similar profile', whyNotSelected: 'Higher fee' },
    ],
    approvals: [
      { role: 'sporting_director', userId: 'sd-1', userName: 'Mark Lawwell', decision: 'approved', timestamp: '2026-01-27T09:00:00Z' },
      { role: 'cfo', userId: '', userName: '', decision: 'pending' },
    ],
    complianceChecks: [
      { framework: 'UEFA_FFP', status: 'pending' },
      { framework: 'FIFA_AGENT_REGS', status: 'passed' },
    ],
    evidenceAttachments: [],
    timeline: [],
  },
  {
    id: 'trf-2026-003',
    organizationId: 'celtic-fc',
    templateId: 'transfer-outbound-v1',
    status: 'draft',
    createdAt: '2026-01-28T09:00:00Z',
    updatedAt: '2026-01-28T09:00:00Z',
    createdBy: 'sporting-director',
    transactionType: 'outbound',
    player: {
      name: 'Matt O\'Riley',
      position: 'CAM',
      nationality: 'Danish',
      dateOfBirth: '2000-11-21',
    },
    counterpartyClub: {
      name: 'Brighton & Hove Albion',
      country: 'England',
      league: 'Premier League',
    },
    transferFee: 25000000,
    addOns: 5000000,
    agentFee: 0,
    scoutingAssessment: {
      matchesObserved: 0,
      videoAnalysisComplete: false,
      dataProfile: '',
      characterReferences: 0,
      recommendation: 'conditional',
    },
    valuation: {
      methodology: '',
      marketComparables: '',
      internalValuation: 0,
      negotiatedFee: 25000000,
      premium: 0,
    },
    alternativesConsidered: [],
    approvals: [],
    complianceChecks: [],
    evidenceAttachments: [],
    timeline: [],
  },
];

const MOCK_FRAMEWORKS: ComplianceFramework[] = [
  { id: 'UEFA_FFP', name: 'UEFA Financial Fair Play', shortName: 'FFP', governingBody: 'UEFA', region: 'europe', requirementsCount: 4 },
  { id: 'UEFA_CLUB_LICENSING', name: 'UEFA Club Licensing', shortName: 'Club Licensing', governingBody: 'UEFA', region: 'europe', requirementsCount: 5 },
  { id: 'FIFA_AGENT_REGS', name: 'FIFA Agent Regulations', shortName: 'Agent Regs', governingBody: 'FIFA', region: 'global', requirementsCount: 4 },
];

// =============================================================================
// COMPONENTS
// =============================================================================

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const variants: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    pending_approval: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    withdrawn: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400',
  };

  const labels: Record<string, string> = {
    draft: 'Draft',
    pending_approval: 'Pending Approval',
    approved: 'Approved',
    rejected: 'Rejected',
    completed: 'Completed',
    withdrawn: 'Withdrawn',
  };

  return (
    <Badge className={variants[status] || variants.draft}>
      {labels[status] || status}
    </Badge>
  );
};

const TransactionTypeBadge: React.FC<{ type: string }> = ({ type }) => {
  const labels: Record<string, string> = {
    inbound: '⬇️ Inbound',
    outbound: '⬆️ Outbound',
    loan_out: '↗️ Loan Out',
    loan_in: '↙️ Loan In',
  };

  return (
    <span className="text-sm font-medium">
      {labels[type] || type}
    </span>
  );
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// =============================================================================
// MAIN PAGE
// =============================================================================

export default function SportsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [decisions, setDecisions] = useState<TransferDecision[]>(MOCK_DECISIONS);
  const [frameworks] = useState<ComplianceFramework[]>(MOCK_FRAMEWORKS);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Stats
  const stats = {
    total: decisions.length,
    draft: decisions.filter(d => d.status === 'draft').length,
    pending: decisions.filter(d => d.status === 'pending_approval').length,
    completed: decisions.filter(d => d.status === 'completed').length,
    totalValue: decisions.reduce((sum, d) => sum + d.transferFee + d.addOns, 0),
    inboundValue: decisions.filter(d => d.transactionType === 'inbound').reduce((sum, d) => sum + d.transferFee, 0),
    outboundValue: decisions.filter(d => d.transactionType === 'outbound').reduce((sum, d) => sum + d.transferFee, 0),
  };

  // Filtered decisions
  const filteredDecisions = decisions.filter(d => {
    const matchesSearch = d.player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.counterpartyClub.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
    const matchesType = typeFilter === 'all' || d.transactionType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const { addToast } = useToast();

  const handleNewDecision = () => {
    addToast({ type: 'info', title: 'Opening new transfer decision wizard...' });
  };

  const handleViewDecision = (id: string) => {
    addToast({ type: 'info', title: `Opening decision ${id}...` });
  };

  const handleExportDecision = async (id: string) => {
    addToast({ type: 'success', title: `Exporting decision ${id} to PDF...` });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Trophy className="h-8 w-8 text-green-600" />
            Sports DDGI
          </h1>
          <p className="text-muted-foreground mt-1">
            Transfer decisions, contract governance, FFP compliance
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/cortex/verticals/sports/fifa-scenarios')} className="gap-2">
            <Shield className="h-4 w-4" />
            FIFA/UEFA Scenarios
          </Button>
          <Button variant="outline" onClick={() => navigate('/cortex/verticals/sports/uefa-walkthrough')} className="gap-2">
            <Gavel className="h-4 w-4" />
            UEFA Walkthrough
          </Button>
          <Button onClick={handleNewDecision} className="gap-2">
            <Plus className="h-4 w-4" />
            New Decision
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Decisions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pending} pending approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inbound Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(stats.inboundValue)}
            </div>
            <p className="text-xs text-muted-foreground">
              {decisions.filter(d => d.transactionType === 'inbound').length} transfers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outbound Value</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(stats.outboundValue)}
            </div>
            <p className="text-xs text-muted-foreground">
              {decisions.filter(d => d.transactionType === 'outbound').length} transfers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{frameworks.length}</div>
            <p className="text-xs text-muted-foreground">
              Active frameworks
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="decisions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="decisions" className="gap-2">
            <FileText className="h-4 w-4" />
            Decisions
          </TabsTrigger>
          <TabsTrigger value="compliance" className="gap-2">
            <Shield className="h-4 w-4" />
            Compliance
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="crisis" className="gap-2">
            <Activity className="h-4 w-4" />
            Crisis Immunization
          </TabsTrigger>
        </TabsList>

        {/* Decisions Tab */}
        <TabsContent value="decisions" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by player or club..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="pending_approval">Pending Approval</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="inbound">Inbound</SelectItem>
                    <SelectItem value="outbound">Outbound</SelectItem>
                    <SelectItem value="loan_out">Loan Out</SelectItem>
                    <SelectItem value="loan_in">Loan In</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Decisions Table */}
          <Card>
            <CardHeader>
              <CardTitle>Transfer Decisions</CardTitle>
              <CardDescription>
                {filteredDecisions.length} decision{filteredDecisions.length !== 1 ? 's' : ''} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Player</th>
                      <th className="text-left py-3 px-4">Type</th>
                      <th className="text-left py-3 px-4">Club</th>
                      <th className="text-right py-3 px-4">Fee</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Recommendation</th>
                      <th className="text-right py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDecisions.map((decision) => (
                      <tr key={decision.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium">{decision.player.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {decision.player.position} • {decision.player.nationality}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <TransactionTypeBadge type={decision.transactionType} />
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium">{decision.counterpartyClub.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {decision.counterpartyClub.league}
                            </div>
                          </div>
                        </td>
                        <td className="text-right py-3 px-4 font-medium">
                          {formatCurrency(decision.transferFee)}
                          {decision.addOns > 0 && (
                            <div className="text-xs text-muted-foreground">
                              +{formatCurrency(decision.addOns)} add-ons
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <StatusBadge status={decision.status} />
                        </td>
                        <td className="py-3 px-4">
                          {decision.scoutingAssessment.recommendation && (
                            <Badge variant={
                              decision.scoutingAssessment.recommendation === 'strong_buy' ? 'default' :
                              decision.scoutingAssessment.recommendation === 'buy' ? 'secondary' :
                              decision.scoutingAssessment.recommendation === 'pass' ? 'destructive' :
                              'outline'
                            }>
                              {SportsService.getRecommendationLabel(decision.scoutingAssessment.recommendation)}
                            </Badge>
                          )}
                        </td>
                        <td className="text-right py-3 px-4">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewDecision(decision.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleExportDecision(decision.id)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {frameworks.map((framework) => (
              <Card key={framework.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scale className="h-5 w-5" />
                    {framework.shortName}
                  </CardTitle>
                  <CardDescription>{framework.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Governing Body</span>
                      <span className="font-medium">{framework.governingBody}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Region</span>
                      <Badge variant="outline">{framework.region}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Requirements</span>
                      <span className="font-medium">{framework.requirementsCount}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* FFP Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                FFP Break-Even Status
              </CardTitle>
              <CardDescription>Current financial position relative to FFP limits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Break-even position</span>
                  <span className="font-medium text-green-600">+£12.4M</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '75%' }} />
                </div>
                <p className="text-xs text-muted-foreground">
                  75% of acceptable deviation used
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Squad cost ratio</span>
                  <span className="font-medium">68%</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '68%' }} />
                </div>
                <p className="text-xs text-muted-foreground">
                  Below 70% threshold
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Decision Velocity</CardTitle>
                <CardDescription>Average time from draft to completion</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">4.2 days</div>
                <p className="text-sm text-muted-foreground mt-2">
                  <span className="text-green-600">↓ 1.3 days</span> vs. previous window
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Approval Rate</CardTitle>
                <CardDescription>Decisions approved on first submission</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">94%</div>
                <p className="text-sm text-muted-foreground mt-2">
                  <span className="text-green-600">↑ 8%</span> vs. previous window
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Evidence Completeness</CardTitle>
                <CardDescription>Decisions with all required evidence</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">100%</div>
                <p className="text-sm text-muted-foreground mt-2">
                  All completed decisions have full evidence
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Audit Readiness</CardTitle>
                <CardDescription>Decisions ready for regulatory audit</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-green-600">100%</div>
                <p className="text-sm text-muted-foreground mt-2">
                  All completed decisions locked with hash
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        {/* Crisis Immunization Tab */}
        <TabsContent value="crisis" className="space-y-4">
          <Card className="border-2 border-indigo-200 dark:border-indigo-800">
            <CardHeader className="bg-indigo-50 dark:bg-indigo-900/20">
              <CardTitle className="flex items-center gap-2">
                <Gavel className="h-5 w-5 text-indigo-600" />
                Crisis Immunization Framework
              </CardTitle>
              <CardDescription>
                Modules designed to make football governance decisions provable, defensible, and CAS-resilient.
                Click any module to see how it applies to your organization.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  {
                    title: 'Discovery-Time Proof',
                    target: 'UEFA / CAS',
                    problem: 'Evidence invalidated by timing disputes',
                    outcome: 'Cryptographic timestamps lock the moment evidence becomes actionable',
                    icon: Clock,
                    color: 'text-blue-600',
                  },
                  {
                    title: 'Mathematical Rule Fairness Ledger',
                    target: 'FIFA / EU Law',
                    problem: 'Rules challenged as arbitrary or disproportionate',
                    outcome: 'Objective rule application with proportionality proofs',
                    icon: Scale,
                    color: 'text-purple-600',
                  },
                  {
                    title: 'Continuity Simulation Engine',
                    target: 'Clubs',
                    problem: 'Institutional knowledge lost during leadership change',
                    outcome: 'Decision DNA captures intent, constraints, and trade-offs',
                    icon: Users,
                    color: 'text-green-600',
                  },
                  {
                    title: 'Public Verifiability Layer',
                    target: 'Socios / Members',
                    problem: 'Trust collapse after governance scandals',
                    outcome: 'Selective cryptographic disclosure of governance actions',
                    icon: Eye,
                    color: 'text-orange-600',
                  },
                  {
                    title: 'Pre-Mortem & Override Ledger',
                    target: 'Board / Directors',
                    problem: 'High-value decisions fail without accountability',
                    outcome: 'Pre-mortem risk capture + immutable override justification',
                    icon: AlertTriangle,
                    color: 'text-red-600',
                  },
                  {
                    title: 'Deliberation Synchronization',
                    target: 'Multi-Director Clubs',
                    problem: 'Multiple decision-makers, incoherent outcomes',
                    outcome: 'Synchronized deliberation records with conflict visibility',
                    icon: Layers,
                    color: 'text-cyan-600',
                  },
                  {
                    title: 'Rehabilitation-Grade Audit',
                    target: 'Previously Sanctioned Clubs',
                    problem: 'Regulator distrust after prior sanctions',
                    outcome: 'Forward-looking auditability with continuous proof',
                    icon: Shield,
                    color: 'text-indigo-600',
                  },
                  {
                    title: 'Compliance Drift Early-Warning',
                    target: 'PSR / FFP Clubs',
                    problem: 'Financial breaches detected too late to correct',
                    outcome: 'Real-time variance detection against regulatory constraints',
                    icon: TrendingUp,
                    color: 'text-emerald-600',
                  },
                ].map((mod) => (
                  <Card key={mod.title} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <mod.icon className={`h-5 w-5 ${mod.color}`} />
                        {mod.title}
                      </CardTitle>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">{mod.target}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-2">
                        <strong>Problem:</strong> {mod.problem}
                      </p>
                      <p className="text-sm">
                        <strong>Solution:</strong> {mod.outcome}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-6 space-y-3">
                <div className="p-4 bg-gray-900 text-white rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold flex items-center gap-2">
                        <Shield className="h-4 w-4 text-indigo-400" />
                        FIFA/UEFA Governance Crisis Scenarios
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">
                        5 high-impact scenarios: FFP Crisis, World Cup Host Selection, Match-Fixing Emergency,
                        Solidarity Disputes, and VAR Policy Reform. Presentation-ready for institutional demo.
                      </p>
                    </div>
                    <Button onClick={() => navigate('/cortex/verticals/sports/fifa-scenarios')} className="gap-2 shrink-0 bg-indigo-600 hover:bg-indigo-700">
                      <ChevronRight className="h-4 w-4" />
                      Launch Scenarios
                    </Button>
                  </div>
                </div>
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold flex items-center gap-2">
                        <Gavel className="h-4 w-4 text-indigo-600" />
                        UEFA Procedural Integrity Walkthrough
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Interactive demo showing Discovery-Time Proof, Multi-Agent Deliberation,
                        Procedural Compliance, and the Regulator's Receipt in action.
                      </p>
                    </div>
                    <Button variant="outline" onClick={() => navigate('/cortex/verticals/sports/uefa-walkthrough')} className="gap-2 shrink-0">
                      <ChevronRight className="h-4 w-4" />
                      Launch Walkthrough
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
