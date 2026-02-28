// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * CendiaRegulatorySandbox™ Page
 * 
 * Test Against Proposed Regulations
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { FlaskConical, Calendar, Globe, FileCheck, AlertTriangle, TrendingUp, Clock } from 'lucide-react';
import { RegulatorySandboxService, ProposedRegulation, SandboxTest, RegulatoryTimeline } from '@/services/RegulatorySandboxService';

const statusColors: Record<string, string> = {
  proposed: 'bg-gray-100 text-gray-800',
  draft: 'bg-blue-100 text-blue-800',
  public_comment: 'bg-yellow-100 text-yellow-800',
  final_draft: 'bg-orange-100 text-orange-800',
  adopted: 'bg-green-100 text-green-800',
  effective: 'bg-emerald-100 text-emerald-800',
  amended: 'bg-purple-100 text-purple-800',
  withdrawn: 'bg-red-100 text-red-800',
};

const readinessColors: Record<string, string> = {
  compliant: 'bg-green-100 text-green-800',
  mostly_compliant: 'bg-blue-100 text-blue-800',
  partial: 'bg-yellow-100 text-yellow-800',
  non_compliant: 'bg-red-100 text-red-800',
};

export default function RegulatorySandboxPage() {
  const [regulations, setRegulations] = useState<ProposedRegulation[]>([]);
  const [tests, setTests] = useState<SandboxTest[]>([]);
  const [timeline, setTimeline] = useState<RegulatoryTimeline | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('regulations');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [regsData, testsData, timelineData] = await Promise.all([
        RegulatorySandboxService.getRegulations(),
        RegulatorySandboxService.getAllTests(),
        RegulatorySandboxService.getTimeline(),
      ]);
      setRegulations(regsData);
      setTests(testsData);
      setTimeline(timelineData);
    } catch (error) {
      console.error('Failed to load data, using demo data:', error);
      setRegulations([
        { id: 'eu-ai-act', code: 'EU-AI-ACT', name: 'EU AI Act', fullName: 'Regulation on Artificial Intelligence', jurisdiction: 'EU' as any, status: 'effective' as any, proposedDate: '2021-04-21', expectedEffectiveDate: '2025-08-01', summary: 'Risk-based framework for AI systems in the EU', keyRequirements: [{ id: 'r1', article: 'Art. 6', title: 'High-Risk Classification', description: 'AI systems in Annex III areas classified as high-risk', category: 'Classification', mandatory: true }], affectedVerticals: ['Healthcare', 'Finance', 'Legal'], affectedAISystems: ['Decision Support', 'Risk Assessment'], estimatedComplianceCost: '$250K-$500K', lastUpdated: new Date().toISOString(), confidence: 0.95 },
        { id: 'us-ai-bill', code: 'US-AI-2025', name: 'US AI Accountability Act', fullName: 'Algorithmic Accountability Act of 2025', jurisdiction: 'US-Federal' as any, status: 'draft' as any, proposedDate: '2025-03-15', expectedAdoptionDate: '2026-01-01', summary: 'Federal AI transparency and accountability requirements', keyRequirements: [{ id: 'r2', article: 'Sec. 4', title: 'Impact Assessment', description: 'Automated decision systems require impact assessments', category: 'Assessment', mandatory: true }], affectedVerticals: ['Finance', 'Healthcare', 'Employment'], affectedAISystems: ['Automated Decisions', 'Scoring Systems'], estimatedComplianceCost: '$100K-$300K', lastUpdated: new Date().toISOString(), confidence: 0.6 },
      ] as any);
      setTimeline({ upcomingDeadlines: [{ date: '2025-08-01', regulation: 'EU AI Act', event: 'Full enforcement begins' }], recentChanges: [{ date: new Date().toISOString(), regulation: 'EU AI Act', change: 'High-risk system obligations now enforceable' }] } as any);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FlaskConical className="h-8 w-8 text-purple-600" />
          <div>
            <h1 className="text-2xl font-bold">CendiaSandbox™</h1>
            <p className="text-muted-foreground">Test against proposed regulations before they're law</p>
          </div>
        </div>
        <Button>
          <FileCheck className="h-4 w-4 mr-2" />
          New Compliance Test
        </Button>
      </div>

      {/* Timeline Summary */}
      {timeline && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Upcoming (6 months)</p>
                  <p className="text-2xl font-bold">{timeline.upcoming.length}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">In Draft</p>
                  <p className="text-2xl font-bold">{timeline.inDraft.length}</p>
                </div>
                <FileCheck className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Recently Effective</p>
                  <p className="text-2xl font-bold">{timeline.recentlyEffective.length}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="regulations">Proposed Regulations</TabsTrigger>
          <TabsTrigger value="tests">Compliance Tests</TabsTrigger>
          <TabsTrigger value="timeline">Regulatory Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="regulations" className="space-y-4">
          {regulations.map((reg) => (
            <Card key={reg.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {reg.name}
                      <Badge className={statusColors[reg.status]}>
                        {reg.status.replace(/_/g, ' ')}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{reg.fullName}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{reg.jurisdiction}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{reg.summary}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Proposed</p>
                    <p className="font-medium">{formatDate(reg.proposedDate)}</p>
                  </div>
                  {reg.expectedEffectiveDate && (
                    <div>
                      <p className="text-muted-foreground">Expected Effective</p>
                      <p className="font-medium">{formatDate(reg.expectedEffectiveDate)}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-muted-foreground">Requirements</p>
                    <p className="font-medium">{reg.keyRequirements.length} articles</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Est. Cost</p>
                    <p className="font-medium">{reg.estimatedComplianceCost}</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" size="sm">
                    <FlaskConical className="h-4 w-4 mr-2" />
                    Run Compliance Test
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="tests" className="space-y-4">
          {tests.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FlaskConical className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">No Tests Yet</h3>
                <p className="text-muted-foreground">Run a compliance test against a proposed regulation to see results here.</p>
              </CardContent>
            </Card>
          ) : (
            tests.map((test) => (
              <Card key={test.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{test.name}</CardTitle>
                      <CardDescription>Testing against: {test.regulationName}</CardDescription>
                    </div>
                    {test.results && (
                      <Badge className={readinessColors[test.results.readinessLevel]}>
                        {test.results.readinessLevel.replace(/_/g, ' ')}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                {test.results && (
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Overall Compliance Score</span>
                          <span className="font-medium">{test.results.overallScore.toFixed(1)}%</span>
                        </div>
                        <Progress value={test.results.overallScore} />
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Gaps Found</p>
                          <p className="font-medium text-lg">{test.results.gaps.length}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Remediation Effort</p>
                          <p className="font-medium text-lg">{test.results.estimatedRemediationEffort}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Est. Cost</p>
                          <p className="font-medium text-lg">{test.results.estimatedRemediationCost}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Regulatory Timeline
              </CardTitle>
              <CardDescription>Upcoming regulatory changes and deadlines</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {timeline?.upcoming.map((reg) => (
                  <div key={reg.id} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="w-24 text-center">
                      <p className="text-sm text-muted-foreground">Effective</p>
                      <p className="font-semibold">{reg.expectedEffectiveDate ? formatDate(reg.expectedEffectiveDate) : 'TBD'}</p>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{reg.name}</h4>
                      <p className="text-sm text-muted-foreground">{reg.jurisdiction}</p>
                      <p className="text-sm mt-1">{reg.summary}</p>
                    </div>
                    <Badge className={statusColors[reg.status]}>{reg.status}</Badge>
                  </div>
                ))}
                {(!timeline?.upcoming || timeline.upcoming.length === 0) && (
                  <p className="text-center text-muted-foreground py-8">No upcoming regulations in the next 6 months.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
