// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CROSS-JURISDICTION COMPLIANCE PAGE
// CendiaCrossJurisdiction™ - Multi-Jurisdiction Compliance Engine
// =============================================================================

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../../../lib/api';
import {
  Globe,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  MapPin,
  Scale,
  FileText,
  Activity,
  Loader2,
  ChevronDown,
  ChevronRight,
  Info,
} from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

interface Jurisdiction {
  code: string;
  name: string;
  region: string;
  frameworks: string[];
  dataResidency: 'required' | 'preferred' | 'flexible';
  crossBorderRestrictions: string[];
}

interface ComplianceAssessment {
  id: string;
  dataType: string;
  sourceJurisdiction: string;
  targetJurisdiction: string;
  assessment: 'compliant' | 'requires_review' | 'blocked';
  conflicts: Array<{
    type: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    description: string;
    recommendation: string;
  }>;
  requiredControls: string[];
  estimatedComplexity: 'low' | 'medium' | 'high' | 'very_high';
}

interface ComplianceMatrix {
  jurisdictions: string[];
  matrix: Record<string, Record<string, 'allowed' | 'restricted' | 'prohibited'>>;
  lastUpdated: Date;
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function CrossJurisdictionPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [jurisdictions, setJurisdictions] = useState<Jurisdiction[]>([]);
  const [assessment, setAssessment] = useState<ComplianceAssessment | null>(null);
  const [matrix, setMatrix] = useState<ComplianceMatrix | null>(null);
  const [selectedSource, setSelectedSource] = useState('US_FEDERAL');
  const [selectedTarget, setSelectedTarget] = useState('EU');
  const [dataType, setDataType] = useState('personal_data');
  const [expandedConflicts, setExpandedConflicts] = useState<Set<number>>(new Set());

  useEffect(() => {
    loadJurisdictions();
    loadMatrix();
  }, []);

  const loadJurisdictions = async () => {
    try {
      const response = await api.get('/cross-jurisdiction/jurisdictions');
      setJurisdictions((response.data as any).data || []);
    } catch (err) {
      console.error('Failed to load jurisdictions, using demo data:', err);
      setJurisdictions([
        { code: 'US_FEDERAL', name: 'United States (Federal)', region: 'North America', frameworks: ['HIPAA', 'SOX', 'FERPA'], dataResidency: 'flexible', crossBorderRestrictions: ['ITAR', 'EAR'] },
        { code: 'EU', name: 'European Union', region: 'Europe', frameworks: ['GDPR', 'DORA', 'EU AI Act'], dataResidency: 'required', crossBorderRestrictions: ['SCCs required', 'Adequacy decision needed'] },
        { code: 'UK', name: 'United Kingdom', region: 'Europe', frameworks: ['UK GDPR', 'FCA', 'DPA 2018'], dataResidency: 'preferred', crossBorderRestrictions: ['International Data Transfer Agreement'] },
        { code: 'CA', name: 'Canada', region: 'North America', frameworks: ['PIPEDA', 'PHIPA'], dataResidency: 'flexible', crossBorderRestrictions: ['Adequate protection required'] },
        { code: 'SG', name: 'Singapore', region: 'Asia-Pacific', frameworks: ['PDPA'], dataResidency: 'flexible', crossBorderRestrictions: ['Comparable standard required'] },
        { code: 'AU', name: 'Australia', region: 'Asia-Pacific', frameworks: ['Privacy Act 1988', 'APPs'], dataResidency: 'flexible', crossBorderRestrictions: ['APP 8 cross-border disclosure'] },
        { code: 'CN', name: 'China', region: 'Asia-Pacific', frameworks: ['PIPL', 'CSL', 'DSL'], dataResidency: 'required', crossBorderRestrictions: ['Security assessment required', 'CAC approval for critical data'] },
      ]);
    }
  };

  const loadMatrix = async () => {
    try {
      const response = await api.get('/cross-jurisdiction/matrix');
      setMatrix((response.data as any).data);
    } catch (err) {
      console.error('Failed to load matrix, using demo data:', err);
      setMatrix({
        jurisdictions: ['US_FEDERAL', 'EU', 'UK', 'CA', 'SG', 'AU', 'CN'],
        matrix: {
          US_FEDERAL: { EU: 'restricted', UK: 'allowed', CA: 'allowed', SG: 'allowed', AU: 'allowed', CN: 'prohibited' },
          EU: { US_FEDERAL: 'restricted', UK: 'allowed', CA: 'restricted', SG: 'restricted', AU: 'restricted', CN: 'prohibited' },
          UK: { US_FEDERAL: 'allowed', EU: 'allowed', CA: 'allowed', SG: 'allowed', AU: 'allowed', CN: 'restricted' },
          CA: { US_FEDERAL: 'allowed', EU: 'restricted', UK: 'allowed', SG: 'allowed', AU: 'allowed', CN: 'prohibited' },
          SG: { US_FEDERAL: 'allowed', EU: 'restricted', UK: 'allowed', CA: 'allowed', AU: 'allowed', CN: 'restricted' },
          AU: { US_FEDERAL: 'allowed', EU: 'restricted', UK: 'allowed', CA: 'allowed', SG: 'allowed', CN: 'restricted' },
          CN: { US_FEDERAL: 'prohibited', EU: 'prohibited', UK: 'restricted', CA: 'prohibited', SG: 'restricted', AU: 'restricted' },
        },
        lastUpdated: new Date(),
      });
    }
  };

  const assessTransfer = async () => {
    setLoading(true);
    try {
      const response = await api.post('/cross-jurisdiction/assess', {
        dataType,
        sourceJurisdiction: selectedSource,
        targetJurisdiction: selectedTarget,
      });
      setAssessment((response.data as any).data);
    } catch (err) {
      console.error('Failed to assess transfer:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleConflict = (index: number) => {
    const newExpanded = new Set(expandedConflicts);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedConflicts(newExpanded);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-500';
      case 'high': return 'text-orange-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  const getAssessmentColor = (assessment: string) => {
    switch (assessment) {
      case 'compliant': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'requires_review': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'blocked': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Globe className="w-8 h-8 text-blue-500" />
            CendiaJurisdiction™
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Multi-Jurisdiction Compliance Engine
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Activity className="w-4 h-4" />
          <span>Enterprise Platinum</span>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900 dark:text-blue-100">
            <p className="font-semibold mb-1">17 Jurisdictions Supported</p>
            <p className="text-blue-700 dark:text-blue-300">
              Assess cross-border data transfers across US Federal, US States (CA, CO, VA, CT), EU, UK, Germany, France, Canada, Brazil, Japan, South Korea, China, Singapore, Australia, and India.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transfer Assessment */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Scale className="w-5 h-5 text-blue-500" />
            Assess Cross-Border Transfer
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data Type
              </label>
              <select
                value={dataType}
                onChange={(e) => setDataType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="personal_data">Personal Data (PII)</option>
                <option value="sensitive_personal_data">Sensitive Personal Data</option>
                <option value="health_data">Health Data (PHI)</option>
                <option value="financial_data">Financial Data</option>
                <option value="biometric_data">Biometric Data</option>
                <option value="children_data">Children's Data</option>
                <option value="employee_data">Employee Data</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Source Jurisdiction
              </label>
              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="US_FEDERAL">United States (Federal)</option>
                <option value="US_CA">California (CCPA/CPRA)</option>
                <option value="US_CO">Colorado (CPA)</option>
                <option value="US_VA">Virginia (VCDPA)</option>
                <option value="US_CT">Connecticut (CTDPA)</option>
                <option value="EU">European Union (GDPR)</option>
                <option value="UK">United Kingdom (UK GDPR)</option>
                <option value="DE">Germany</option>
                <option value="FR">France</option>
                <option value="CA">Canada (PIPEDA)</option>
                <option value="BR">Brazil (LGPD)</option>
                <option value="JP">Japan (APPI)</option>
                <option value="KR">South Korea (PIPA)</option>
                <option value="CN">China (PIPL)</option>
                <option value="SG">Singapore (PDPA)</option>
                <option value="AU">Australia (Privacy Act)</option>
                <option value="IN">India (DPDP Act)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Target Jurisdiction
              </label>
              <select
                value={selectedTarget}
                onChange={(e) => setSelectedTarget(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="US_FEDERAL">United States (Federal)</option>
                <option value="US_CA">California (CCPA/CPRA)</option>
                <option value="US_CO">Colorado (CPA)</option>
                <option value="US_VA">Virginia (VCDPA)</option>
                <option value="US_CT">Connecticut (CTDPA)</option>
                <option value="EU">European Union (GDPR)</option>
                <option value="UK">United Kingdom (UK GDPR)</option>
                <option value="DE">Germany</option>
                <option value="FR">France</option>
                <option value="CA">Canada (PIPEDA)</option>
                <option value="BR">Brazil (LGPD)</option>
                <option value="JP">Japan (APPI)</option>
                <option value="KR">South Korea (PIPA)</option>
                <option value="CN">China (PIPL)</option>
                <option value="SG">Singapore (PDPA)</option>
                <option value="AU">Australia (Privacy Act)</option>
                <option value="IN">India (DPDP Act)</option>
              </select>
            </div>

            <button
              onClick={assessTransfer}
              disabled={loading}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Assessing...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  Assess Transfer
                </>
              )}
            </button>
          </div>
        </div>

        {/* Assessment Results */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" />
            Assessment Results
          </h2>

          {!assessment ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Scale className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Run an assessment to see results</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className={`px-4 py-3 rounded-lg ${getAssessmentColor(assessment.assessment)}`}>
                <div className="flex items-center gap-2 mb-1">
                  {assessment.assessment === 'compliant' ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : assessment.assessment === 'blocked' ? (
                    <XCircle className="w-5 h-5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5" />
                  )}
                  <span className="font-semibold">
                    {assessment.assessment === 'compliant' ? 'Transfer Allowed' :
                     assessment.assessment === 'blocked' ? 'Transfer Blocked' :
                     'Requires Review'}
                  </span>
                </div>
                <div className="text-sm">
                  {assessment.dataType} from {assessment.sourceJurisdiction} to {assessment.targetJurisdiction}
                </div>
              </div>

              {assessment.conflicts.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Conflicts Detected ({assessment.conflicts.length})
                  </h3>
                  <div className="space-y-2">
                    {assessment.conflicts.map((conflict, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                      >
                        <button
                          onClick={() => toggleConflict(index)}
                          className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            {expandedConflicts.has(index) ? (
                              <ChevronDown className="w-4 h-4 text-gray-400" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-gray-400" />
                            )}
                            <span className={`text-sm font-medium ${getSeverityColor(conflict.severity)}`}>
                              {conflict.type}
                            </span>
                          </div>
                          <span className={`px-2 py-0.5 text-xs rounded ${
                            conflict.severity === 'critical' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                            conflict.severity === 'high' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' :
                            conflict.severity === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                            'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                          }`}>
                            {conflict.severity}
                          </span>
                        </button>
                        {expandedConflicts.has(index) && (
                          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                              {conflict.description}
                            </p>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              <span className="font-semibold">Recommendation:</span> {conflict.recommendation}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {assessment.requiredControls.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Required Controls
                  </h3>
                  <div className="space-y-1">
                    {assessment.requiredControls.map((control, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{control}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Implementation Complexity</span>
                  <span className={`font-semibold ${
                    assessment.estimatedComplexity === 'low' ? 'text-green-600' :
                    assessment.estimatedComplexity === 'medium' ? 'text-yellow-600' :
                    assessment.estimatedComplexity === 'high' ? 'text-orange-600' :
                    'text-red-600'
                  }`}>
                    {assessment.estimatedComplexity.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Supported Jurisdictions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Supported Jurisdictions ({jurisdictions.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {jurisdictions.map((jurisdiction) => (
            <div
              key={jurisdiction.code}
              className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
            >
              <div className="flex items-start gap-2 mb-2">
                <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-medium text-sm text-gray-900 dark:text-white">{jurisdiction.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{jurisdiction.region}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {jurisdiction.frameworks.slice(0, 2).map((framework) => (
                  <span
                    key={framework}
                    className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded"
                  >
                    {framework}
                  </span>
                ))}
                {jurisdiction.frameworks.length > 2 && (
                  <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded">
                    +{jurisdiction.frameworks.length - 2}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
