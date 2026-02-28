// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * CendiaInsure™ Page
 * 
 * AI Insurance Integration
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, FileText, DollarSign, AlertTriangle, CheckCircle, Clock, Building2 } from 'lucide-react';
import { AIInsuranceService, InsurancePolicy, CoverageTypeInfo } from '@/services/AIInsuranceService';

const statusColors: Record<string, string> = {
  quoted: 'bg-gray-100 text-gray-800',
  bound: 'bg-blue-100 text-blue-800',
  active: 'bg-green-100 text-green-800',
  expired: 'bg-yellow-100 text-yellow-800',
  cancelled: 'bg-red-100 text-red-800',
  claimed: 'bg-purple-100 text-purple-800',
};

const riskTierColors: Record<string, string> = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800',
};

export default function AIInsurancePage() {
  const [coverageTypes, setCoverageTypes] = useState<CoverageTypeInfo[]>([]);
  const [policies, setPolicies] = useState<InsurancePolicy[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('policies');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const types = await AIInsuranceService.getCoverageTypes();
      setCoverageTypes(types);
    } catch (error) {
      console.error('Failed to load data, using demo data:', error);
      setCoverageTypes([
        { type: 'errors_omissions' as any, name: 'AI Errors & Omissions', description: 'Coverage for AI system failures, incorrect outputs, and decision errors', basePremium: 25000 },
        { type: 'cyber_liability' as any, name: 'AI Cyber Liability', description: 'Coverage for AI-related data breaches, adversarial attacks, and model theft', basePremium: 35000 },
        { type: 'product_liability' as any, name: 'AI Product Liability', description: 'Coverage for harm caused by AI-powered products or services', basePremium: 45000 },
        { type: 'professional' as any, name: 'AI Professional Liability', description: 'Coverage for professional negligence in AI system design and deployment', basePremium: 30000 },
        { type: 'directors_officers' as any, name: 'AI D&O Insurance', description: 'Coverage for directors and officers for AI governance decisions', basePremium: 50000 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
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
          <Shield className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold">CendiaInsure™</h1>
            <p className="text-muted-foreground">Direct liability coverage per AI decision</p>
          </div>
        </div>
        <Button>
          <FileText className="h-4 w-4 mr-2" />
          Request Quote
        </Button>
      </div>

      {/* Value Proposition */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900">AI-Specific Liability Protection</h3>
              <p className="text-sm text-blue-700 mt-1">
                Protect your organization from AI-related losses with specialized coverage for errors & omissions, 
                cyber liability, and professional indemnity. Per-decision coverage with real-time risk scoring.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="policies">Active Policies</TabsTrigger>
          <TabsTrigger value="coverage">Coverage Types</TabsTrigger>
          <TabsTrigger value="claims">Claims</TabsTrigger>
        </TabsList>

        <TabsContent value="policies" className="space-y-4">
          {policies.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">No Active Policies</h3>
                <p className="text-muted-foreground">Request a quote to get AI liability coverage for your organization.</p>
                <Button className="mt-4">
                  <FileText className="h-4 w-4 mr-2" />
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ) : (
            policies.map((policy) => (
              <Card key={policy.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        Policy #{policy.policyNumber}
                        <Badge className={statusColors[policy.status]}>{policy.status}</Badge>
                      </CardTitle>
                      <CardDescription>
                        {policy.coverageType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </CardDescription>
                    </div>
                    <Badge className={riskTierColors[policy.riskTier]}>
                      {policy.riskTier.toUpperCase()} Risk
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Coverage Limit</p>
                      <p className="font-medium text-lg">{formatCurrency(policy.coverageLimit)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Deductible</p>
                      <p className="font-medium text-lg">{formatCurrency(policy.deductible)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Annual Premium</p>
                      <p className="font-medium text-lg">{formatCurrency(policy.premium)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Expires</p>
                      <p className="font-medium text-lg">{formatDate(policy.expirationDate)}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm">View Certificate</Button>
                    <Button variant="outline" size="sm">Coverage Details</Button>
                    <Button variant="outline" size="sm">File Claim</Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="coverage" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {coverageTypes.map((type) => (
              <Card key={type.type}>
                <CardHeader>
                  <CardTitle className="text-lg">{type.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{type.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-muted-foreground">Base Premium</span>
                    <span className="font-semibold">{formatCurrency(type.basePremium)}/year</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Get Quote
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="claims">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Claims Management
              </CardTitle>
              <CardDescription>File and track insurance claims</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No claims filed.</p>
                <p className="text-sm mt-2">When incidents occur, you can file claims here for covered AI decisions.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
