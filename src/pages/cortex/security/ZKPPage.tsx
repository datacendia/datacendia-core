// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * CendiaZKP™ Page
 * 
 * Zero-Knowledge Proofs for Compliance
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Lock, FileCheck, Eye, EyeOff, CheckCircle, XCircle, Clock } from 'lucide-react';
import { ZKPService, ZKProof, ProofTypeInfo } from '@/services/ZKPService';

const statusColors: Record<string, string> = {
  generating: 'bg-blue-100 text-blue-800',
  valid: 'bg-green-100 text-green-800',
  invalid: 'bg-red-100 text-red-800',
  expired: 'bg-gray-100 text-gray-800',
  revoked: 'bg-orange-100 text-orange-800',
};

const proofTypeIcons: Record<string, React.ReactNode> = {
  compliance: <FileCheck className="h-5 w-5" />,
  fairness: <Shield className="h-5 w-5" />,
  accuracy: <CheckCircle className="h-5 w-5" />,
  data_governance: <Lock className="h-5 w-5" />,
  audit_trail: <Eye className="h-5 w-5" />,
  human_oversight: <EyeOff className="h-5 w-5" />,
  consent: <FileCheck className="h-5 w-5" />,
};

export default function ZKPPage() {
  const [proofTypes, setProofTypes] = useState<ProofTypeInfo[]>([]);
  const [proofs, setProofs] = useState<ZKProof[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('proofs');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const types = await ZKPService.getProofTypes();
      setProofTypes(types);
    } catch (error) {
      console.error('Failed to load data, using demo data:', error);
      setProofTypes([
        { type: 'compliance' as any, name: 'Compliance Proof', description: 'Prove regulatory compliance without revealing internal controls', verificationTime: '< 1s', proofSize: '2 KB' },
        { type: 'identity' as any, name: 'Identity Verification', description: 'Verify identity attributes without exposing personal data', verificationTime: '< 500ms', proofSize: '1.5 KB' },
        { type: 'financial' as any, name: 'Financial Threshold', description: 'Prove financial thresholds met without revealing exact figures', verificationTime: '< 2s', proofSize: '3 KB' },
        { type: 'age' as any, name: 'Age Verification', description: 'Prove age requirement met without revealing date of birth', verificationTime: '< 200ms', proofSize: '0.8 KB' },
        { type: 'consent' as any, name: 'Consent Proof', description: 'Prove consent was given without revealing the consented terms', verificationTime: '< 1s', proofSize: '1.2 KB' },
      ] as any);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-green-600" />
          <div>
            <h1 className="text-2xl font-bold">CendiaZKP™</h1>
            <p className="text-muted-foreground">Prove compliance without revealing proprietary logic</p>
          </div>
        </div>
        <Button>
          <Lock className="h-4 w-4 mr-2" />
          Generate New Proof
        </Button>
      </div>

      {/* Overview */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-green-900">Cryptographic Compliance Verification</h3>
              <p className="text-sm text-green-700 mt-1">
                Zero-knowledge proofs allow you to demonstrate regulatory compliance to auditors and regulators 
                without exposing your proprietary AI models, training data, or business logic.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="proofs">Generated Proofs</TabsTrigger>
          <TabsTrigger value="types">Proof Types</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
        </TabsList>

        <TabsContent value="proofs" className="space-y-4">
          {proofs.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Lock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">No Proofs Generated Yet</h3>
                <p className="text-muted-foreground">Generate a zero-knowledge proof to demonstrate compliance.</p>
                <Button className="mt-4">
                  <Shield className="h-4 w-4 mr-2" />
                  Generate First Proof
                </Button>
              </CardContent>
            </Card>
          ) : (
            proofs.map((proof) => (
              <Card key={proof.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {proofTypeIcons[proof.type]}
                        {proof.type.replace(/_/g, ' ').toUpperCase()} Proof
                        <Badge className={statusColors[proof.status]}>{proof.status}</Badge>
                      </CardTitle>
                      <CardDescription>{proof.claim}</CardDescription>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <p>Verified {proof.verificationCount} times</p>
                      <p>Expires: {formatDate(proof.expiresAt)}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Framework</p>
                      <p className="font-medium">{proof.framework || 'General'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Generated</p>
                      <p className="font-medium">{formatDate(proof.generatedAt)}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm">Verify</Button>
                    <Button variant="outline" size="sm">Export Certificate</Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="types" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {proofTypes.map((type) => (
              <Card key={type.type}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {proofTypeIcons[type.type]}
                    {type.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{type.description}</p>
                  <div>
                    <p className="text-sm font-medium mb-2">Required Inputs:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {type.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button variant="outline" size="sm" className="mt-4 w-full">
                    Generate This Proof
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="certificates">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="h-5 w-5" />
                Compliance Certificates
              </CardTitle>
              <CardDescription>Verifiable certificates issued from ZK proofs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <FileCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No certificates issued yet.</p>
                <p className="text-sm mt-2">Certificates are generated when ZK proofs are verified by third parties.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
