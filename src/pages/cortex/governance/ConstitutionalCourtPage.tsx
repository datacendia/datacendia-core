// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * CendiaConstitutionalCourt™ Page
 * 
 * AI Dispute Resolution with Precedent Tracking
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Scale, Gavel, BookOpen, FileText, AlertTriangle, CheckCircle, Clock, Users } from 'lucide-react';
import { ConstitutionalCourtService, Dispute, ConstitutionalPrinciple, CourtStatistics } from '@/services/ConstitutionalCourtService';

const statusColors: Record<string, string> = {
  filed: 'bg-blue-100 text-blue-800',
  under_review: 'bg-yellow-100 text-yellow-800',
  hearing_scheduled: 'bg-purple-100 text-purple-800',
  deliberating: 'bg-orange-100 text-orange-800',
  opinion_drafted: 'bg-cyan-100 text-cyan-800',
  resolved: 'bg-green-100 text-green-800',
  appealed: 'bg-red-100 text-red-800',
  appeal_resolved: 'bg-emerald-100 text-emerald-800',
};

const categoryLabels: Record<string, string> = {
  confidence_conflict: 'Confidence Conflict',
  methodology_dispute: 'Methodology Dispute',
  data_interpretation: 'Data Interpretation',
  ethical_conflict: 'Ethical Conflict',
  compliance_disagreement: 'Compliance Disagreement',
  risk_assessment: 'Risk Assessment',
  recommendation_conflict: 'Recommendation Conflict',
};

export default function ConstitutionalCourtPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [principles, setPrinciples] = useState<ConstitutionalPrinciple[]>([]);
  const [statistics, setStatistics] = useState<CourtStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('disputes');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [principlesData, statsData] = await Promise.all([
        ConstitutionalCourtService.getPrinciples(),
        ConstitutionalCourtService.getStatistics(),
      ]);
      setPrinciples(principlesData);
      setStatistics(statsData);
    } catch (error) {
      console.error('Failed to load data, using demo data:', error);
      setPrinciples([
        { id: 'p1', name: 'Fairness & Non-Discrimination', description: 'AI decisions must not discriminate based on protected characteristics', category: 'Ethics', weight: 0.9, precedentCount: 12 },
        { id: 'p2', name: 'Transparency & Explainability', description: 'All AI-assisted decisions must be explainable to affected parties', category: 'Governance', weight: 0.85, precedentCount: 8 },
        { id: 'p3', name: 'Human Override Authority', description: 'Humans must retain final authority over consequential decisions', category: 'Control', weight: 0.95, precedentCount: 15 },
        { id: 'p4', name: 'Data Minimization', description: 'AI systems must use minimum data necessary for the task', category: 'Privacy', weight: 0.8, precedentCount: 6 },
        { id: 'p5', name: 'Proportionality', description: 'AI intervention must be proportional to the stakes involved', category: 'Ethics', weight: 0.75, precedentCount: 9 },
      ] as any);
      setStatistics({ totalDisputes: 23, resolvedDisputes: 19, pendingDisputes: 4, averageResolutionDays: 3.2, precedentsEstablished: 31, principlesCited: 47 } as any);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Scale className="h-8 w-8 text-indigo-600" />
          <div>
            <h1 className="text-2xl font-bold">CendiaCourt™</h1>
            <p className="text-muted-foreground">Formal dispute resolution with precedent tracking</p>
          </div>
        </div>
        <Button>
          <Gavel className="h-4 w-4 mr-2" />
          File New Dispute
        </Button>
      </div>

      {/* Statistics */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Disputes</p>
                  <p className="text-2xl font-bold">{statistics.totalDisputes}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Resolved</p>
                  <p className="text-2xl font-bold">{statistics.resolved}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{statistics.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Resolution</p>
                  <p className="text-2xl font-bold">{statistics.avgResolutionDays.toFixed(1)} days</p>
                </div>
                <Users className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="disputes">Active Disputes</TabsTrigger>
          <TabsTrigger value="precedents">Precedent Database</TabsTrigger>
          <TabsTrigger value="principles">Constitutional Principles</TabsTrigger>
        </TabsList>

        <TabsContent value="disputes" className="space-y-4">
          {disputes.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Scale className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">No Active Disputes</h3>
                <p className="text-muted-foreground">When agents disagree, disputes will appear here for formal resolution.</p>
              </CardContent>
            </Card>
          ) : (
            disputes.map((dispute) => (
              <Card key={dispute.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {dispute.caseNumber}
                        <Badge className={statusColors[dispute.status]}>
                          {dispute.status.replace(/_/g, ' ')}
                        </Badge>
                      </CardTitle>
                      <CardDescription>{dispute.title}</CardDescription>
                    </div>
                    <Badge variant="outline">{categoryLabels[dispute.category]}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-800">Petitioner</p>
                      <p className="font-semibold">{dispute.petitioner.agentName}</p>
                      <p className="text-sm text-muted-foreground mt-1">{dispute.petitioner.position}</p>
                    </div>
                    <div className="p-4 bg-red-50 rounded-lg">
                      <p className="text-sm font-medium text-red-800">Respondent</p>
                      <p className="font-semibold">{dispute.respondent.agentName}</p>
                      <p className="text-sm text-muted-foreground mt-1">{dispute.respondent.position}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="precedents">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Precedent Database
              </CardTitle>
              <CardDescription>Search resolved cases for binding precedent</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Precedent database will populate as disputes are resolved.</p>
                <p className="text-sm mt-2">Resolved cases become binding precedent for future disputes.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="principles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5" />
                Constitutional Principles
              </CardTitle>
              <CardDescription>Foundational principles guiding AI governance decisions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {principles.map((principle) => (
                  <div key={principle.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{principle.name}</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{principle.category}</Badge>
                        <Badge variant="secondary">Weight: {principle.weight}</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{principle.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
