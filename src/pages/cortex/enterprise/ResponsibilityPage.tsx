// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIA RESPONSIBILITY™ — HUMAN ACCOUNTABILITY LAYER
// Explicit liability transfer, TPM-signed accountability records, delegation chains
// =============================================================================

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Shield,
  UserCheck,
  FileSignature,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  ChevronRight,
  Download,
  Eye,
  Plus,
  RefreshCw,
  Lock,
  Fingerprint,
  Scale,
  FileText,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { responsibilityService, AccountabilityRecord, AccountabilityChain, LiabilityReport, FailureCategory, AccountabilityAction } from '@/services/ResponsibilityService';

const FAILURE_CATEGORIES: { value: FailureCategory; label: string }[] = [
  { value: 'LEGITIMACY_COLLAPSE', label: 'Legitimacy Collapse' },
  { value: 'MINORITY_HARM', label: 'Minority Harm' },
  { value: 'ECONOMIC_INSTABILITY', label: 'Economic Instability' },
  { value: 'POLITICAL_BACKLASH', label: 'Political Backlash' },
  { value: 'SYSTEMIC_RISK', label: 'Systemic Risk' },
  { value: 'ADVERSARIAL_ABUSE', label: 'Adversarial Abuse' },
  { value: 'TEMPORAL_DECAY', label: 'Temporal Decay' },
  { value: 'NARRATIVE_WEAPONIZATION', label: 'Narrative Weaponization' },
  { value: 'FREE_SPEECH_CHILLING', label: 'Free Speech Chilling' },
  { value: 'DEMOCRATIC_PROCESS_EROSION', label: 'Democratic Process Erosion' },
  { value: 'DUE_PROCESS_VIOLATION', label: 'Due Process Violation' },
  { value: 'MARKET_DISTORTION', label: 'Market Distortion' },
  { value: 'ENVIRONMENTAL_EXTERNALITY', label: 'Environmental Externality' },
  { value: 'PRIVACY_EROSION', label: 'Privacy Erosion' },
];

const ACTION_COLORS: Record<AccountabilityAction, string> = {
  APPROVE: 'bg-green-500/10 text-green-500 border-green-500/20',
  OVERRIDE: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  DEFER: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  REJECT: 'bg-red-500/10 text-red-500 border-red-500/20',
  ESCALATE: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
};

const ACTION_ICONS: Record<AccountabilityAction, React.ReactNode> = {
  APPROVE: <CheckCircle2 className="h-4 w-4" />,
  OVERRIDE: <AlertTriangle className="h-4 w-4" />,
  DEFER: <Clock className="h-4 w-4" />,
  REJECT: <XCircle className="h-4 w-4" />,
  ESCALATE: <Users className="h-4 w-4" />,
};

export default function ResponsibilityPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [serviceHealth, setServiceHealth] = useState<{ status: string } | null>(null);
  const [recentRecords, setRecentRecords] = useState<AccountabilityRecord[]>([]);
  const [selectedChain, setSelectedChain] = useState<AccountabilityChain | null>(null);
  const [selectedReport, setSelectedReport] = useState<LiabilityReport | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [decisionIdInput, setDecisionIdInput] = useState('');

  // Form state for creating records
  const [formData, setFormData] = useState({
    decisionId: '',
    actionTaken: 'APPROVE' as AccountabilityAction,
    justification: '',
    acceptedRisks: [] as FailureCategory[],
    riskAcknowledgment: '',
    aiRecommendation: '',
    aiConfidenceScore: 0,
  });

  useEffect(() => {
    loadServiceHealth();
  }, []);

  const loadServiceHealth = async () => {
    const health = await responsibilityService.getHealth();
    setServiceHealth(health);
  };

  const loadAccountabilityChain = async (decisionId: string) => {
    setIsLoading(true);
    try {
      const chain = await responsibilityService.getAccountabilityChain(decisionId);
      setSelectedChain(chain);
      setRecentRecords(chain.records);
    } catch (error) {
      console.error('Failed to load accountability chain:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadLiabilityReport = async (decisionId: string) => {
    setIsLoading(true);
    try {
      const report = await responsibilityService.getLiabilityReport(decisionId);
      setSelectedReport(report);
    } catch (error) {
      console.error('Failed to load liability report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRecord = async () => {
    if (!user) {return;}
    
    setIsLoading(true);
    try {
      const record = await responsibilityService.createRecord({
        decisionId: formData.decisionId,
        organizationId: user.organizationId || 'demo-org',
        humanAuthority: {
          name: user.name || 'Unknown User',
          role: user.role || 'User',
          email: user.email,
        },
        actionTaken: formData.actionTaken,
        justification: formData.justification,
        acceptedRisks: formData.acceptedRisks,
        riskAcknowledgment: formData.riskAcknowledgment,
        aiRecommendation: formData.aiRecommendation,
        aiConfidenceScore: formData.aiConfidenceScore,
      });
      
      setRecentRecords(prev => [record, ...prev]);
      setIsCreateDialogOpen(false);
      setFormData({
        decisionId: '',
        actionTaken: 'APPROVE',
        justification: '',
        acceptedRisks: [],
        riskAcknowledgment: '',
        aiRecommendation: '',
        aiConfidenceScore: 0,
      });
    } catch (error) {
      console.error('Failed to create record:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRisk = (risk: FailureCategory) => {
    setFormData(prev => ({
      ...prev,
      acceptedRisks: prev.acceptedRisks.includes(risk)
        ? prev.acceptedRisks.filter(r => r !== risk)
        : [...prev.acceptedRisks, risk]
    }));
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            CendiaResponsibility™
          </h1>
          <p className="text-muted-foreground mt-1">
            Human Accountability Layer — Explicit liability transfer for AI-assisted decisions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className={serviceHealth?.status === 'operational' ? 'border-green-500 text-green-500' : 'border-amber-500 text-amber-500'}>
            <Activity className="h-3 w-3 mr-1" />
            {serviceHealth?.status || 'Loading...'}
          </Badge>
          <Button variant="outline" size="sm" onClick={loadServiceHealth}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Record
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileSignature className="h-5 w-5" />
                  Create Accountability Record
                </DialogTitle>
                <DialogDescription>
                  Sign and record your accountability for a decision. This creates an immutable, cryptographically signed record.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="decisionId">Decision ID</Label>
                    <Input
                      id="decisionId"
                      placeholder="e.g., DEC-2026-001"
                      value={formData.decisionId}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, decisionId: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="action">Action</Label>
                    <Select
                      value={formData.actionTaken}
                      onValueChange={(v: string) => setFormData(prev => ({ ...prev, actionTaken: v as AccountabilityAction }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="APPROVE">Approve</SelectItem>
                        <SelectItem value="OVERRIDE">Override</SelectItem>
                        <SelectItem value="DEFER">Defer</SelectItem>
                        <SelectItem value="REJECT">Reject</SelectItem>
                        <SelectItem value="ESCALATE">Escalate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="justification">Justification</Label>
                  <Textarea
                    id="justification"
                    placeholder="Explain your reasoning for this action..."
                    rows={3}
                    value={formData.justification}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, justification: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Accepted Risks</Label>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-md p-3">
                    {FAILURE_CATEGORIES.map(cat => (
                      <div key={cat.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={cat.value}
                          checked={formData.acceptedRisks.includes(cat.value)}
                          onCheckedChange={() => toggleRisk(cat.value)}
                        />
                        <label htmlFor={cat.value} className="text-sm cursor-pointer">
                          {cat.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="riskAck">Risk Acknowledgment Statement</Label>
                  <Textarea
                    id="riskAck"
                    placeholder="I acknowledge and accept the following risks..."
                    rows={2}
                    value={formData.riskAcknowledgment}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, riskAcknowledgment: e.target.value }))}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="aiRec">AI Recommendation (Optional)</Label>
                    <Input
                      id="aiRec"
                      placeholder="What did the AI recommend?"
                      value={formData.aiRecommendation}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, aiRecommendation: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="aiConf">AI Confidence %</Label>
                    <Input
                      id="aiConf"
                      type="number"
                      min={0}
                      max={100}
                      placeholder="0-100"
                      value={formData.aiConfidenceScore || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, aiConfidenceScore: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                </div>
                
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Lock className="h-5 w-5 text-amber-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-amber-500">Cryptographic Signing</p>
                      <p className="text-sm text-muted-foreground">
                        This record will be signed with TPM 2.0 hardware attestation (or software fallback) and cannot be modified after creation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateRecord} disabled={isLoading || !formData.decisionId || !formData.justification}>
                  <Fingerprint className="h-4 w-4 mr-2" />
                  Sign & Record
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Records</p>
                <p className="text-2xl font-bold">{recentRecords.length || 0}</p>
              </div>
              <FileSignature className="h-8 w-8 text-primary/20" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overrides</p>
                <p className="text-2xl font-bold">{recentRecords.filter(r => r.actionTaken === 'OVERRIDE').length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-amber-500/20" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Risks Accepted</p>
                <p className="text-2xl font-bold">{recentRecords.reduce((acc, r) => acc + r.acceptedRisks.length, 0)}</p>
              </div>
              <Scale className="h-8 w-8 text-red-500/20" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Chain Integrity</p>
                <p className="text-2xl font-bold text-green-500">{selectedChain?.isValid ? '✓ Valid' : '—'}</p>
              </div>
              <Lock className="h-8 w-8 text-green-500/20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="chain">Accountability Chain</TabsTrigger>
          <TabsTrigger value="reports">Liability Reports</TabsTrigger>
          <TabsTrigger value="delegations">Delegations</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Accountability Records</CardTitle>
              <CardDescription>
                Cryptographically signed records of human accountability for AI-assisted decisions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentRecords.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <UserCheck className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>No accountability records yet</p>
                  <p className="text-sm">Create a new record or load an accountability chain by decision ID</p>
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <Input
                      placeholder="Enter Decision ID..."
                      className="max-w-xs"
                      value={decisionIdInput}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDecisionIdInput(e.target.value)}
                    />
                    <Button onClick={() => loadAccountabilityChain(decisionIdInput)} disabled={!decisionIdInput}>
                      Load Chain
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentRecords.map(record => (
                    <div
                      key={record.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <Badge className={ACTION_COLORS[record.actionTaken]}>
                          {ACTION_ICONS[record.actionTaken]}
                          <span className="ml-1">{record.actionTaken}</span>
                        </Badge>
                        <div>
                          <p className="font-medium">{record.decisionId}</p>
                          <p className="text-sm text-muted-foreground">
                            {record.humanAuthority.name} • {record.humanAuthority.role}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right text-sm">
                          <p>{record.acceptedRisks.length} risks accepted</p>
                          <p className="text-muted-foreground">
                            {new Date(record.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          <Fingerprint className="h-3 w-3 mr-1" />
                          {record.signature.attestationType}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chain" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Accountability Chain Viewer</CardTitle>
              <CardDescription>
                View the complete chain of accountability for a decision
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-6">
                <Input
                  placeholder="Enter Decision ID..."
                  value={decisionIdInput}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDecisionIdInput(e.target.value)}
                />
                <Button onClick={() => loadAccountabilityChain(decisionIdInput)} disabled={isLoading}>
                  {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Load Chain'}
                </Button>
              </div>
              
              {selectedChain && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">Chain Status</p>
                      <p className="text-sm text-muted-foreground">Decision: {selectedChain.decisionId}</p>
                    </div>
                    <Badge className={selectedChain.isValid ? 'bg-green-500' : 'bg-red-500'}>
                      {selectedChain.isValid ? 'Valid' : 'Invalid'}
                    </Badge>
                  </div>
                  
                  <div className="relative">
                    {selectedChain.records.map((record, index) => (
                      <div key={record.id} className="flex gap-4 pb-6 last:pb-0">
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${ACTION_COLORS[record.actionTaken]}`}>
                            {ACTION_ICONS[record.actionTaken]}
                          </div>
                          {index < selectedChain.records.length - 1 && (
                            <div className="w-0.5 h-full bg-border mt-2" />
                          )}
                        </div>
                        <div className="flex-1 pb-4 border-b last:border-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{record.actionTaken}</p>
                            <span className="text-sm text-muted-foreground">
                              {new Date(record.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm mt-1">{record.justification}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline">{record.humanAuthority.name}</Badge>
                            <Badge variant="outline">{record.humanAuthority.role}</Badge>
                            {record.acceptedRisks.length > 0 && (
                              <Badge variant="destructive">{record.acceptedRisks.length} risks</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Liability Report Generator</CardTitle>
              <CardDescription>
                Generate boardroom-grade liability reports for legal and audit purposes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-6">
                <Input
                  placeholder="Enter Decision ID..."
                  value={decisionIdInput}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDecisionIdInput(e.target.value)}
                />
                <Button onClick={() => loadLiabilityReport(decisionIdInput)} disabled={isLoading}>
                  {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Generate Report'}
                </Button>
              </div>
              
              {selectedReport && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Final Accountable Authority</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-lg font-bold">{selectedReport.finalAccountable.name}</p>
                        <p className="text-sm text-muted-foreground">{selectedReport.finalAccountable.role}</p>
                        {selectedReport.finalAccountable.jurisdiction && (
                          <p className="text-sm text-muted-foreground">{selectedReport.finalAccountable.jurisdiction}</p>
                        )}
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Total Risks Accepted</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-1">
                          {selectedReport.totalRisksAccepted.map(risk => (
                            <Badge key={risk} variant="destructive" className="text-xs">
                              {risk.replace(/_/g, ' ')}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">Report Hash</p>
                      <p className="font-mono text-sm">{selectedReport.reportHash}</p>
                    </div>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export PDF
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="delegations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Authority Delegations</CardTitle>
              <CardDescription>
                Manage delegation of decision-making authority with cryptographic proof
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>No active delegations</p>
                <p className="text-sm">Create delegations to allow others to sign on your behalf within defined constraints</p>
                <Button className="mt-4" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Delegation
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Info Panel */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <Shield className="h-10 w-10 text-primary" />
            <div>
              <h3 className="font-semibold text-lg">About CendiaResponsibility™</h3>
              <p className="text-muted-foreground mt-1">
                CendiaResponsibility™ provides explicit human accountability for AI-assisted decisions. 
                Every record is cryptographically signed (TPM 2.0 or software fallback), creating an 
                immutable chain of accountability that can be verified by regulators, courts, and auditors.
              </p>
              <div className="flex items-center gap-4 mt-4">
                <Badge variant="outline">
                  <Lock className="h-3 w-3 mr-1" />
                  TPM 2.0 Signing
                </Badge>
                <Badge variant="outline">
                  <FileText className="h-3 w-3 mr-1" />
                  Merkle Verification
                </Badge>
                <Badge variant="outline">
                  <Scale className="h-3 w-3 mr-1" />
                  Liability Transfer
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
