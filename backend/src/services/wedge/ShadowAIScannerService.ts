// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// WEDGE 1: SHADOW AI SCANNER SERVICE
// Detects unauthorized AI tool usage across an organization.
// Quantifies data leakage risk with dollar exposure estimates.
// =============================================================================

import crypto from 'crypto';
import { logger } from '../../utils/logger.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ShadowAIDetection {
  id: string;
  timestamp: string;
  userId: string;
  userEmail: string;
  department: string;
  aiTool: string;
  provider: string;
  dataClassification: 'public' | 'internal' | 'confidential' | 'restricted';
  piiTypesDetected: string[];
  dataSizeBytes: number;
  action: 'blocked' | 'flagged' | 'allowed';
  riskScore: number;
  integrityHash: string;
}

export interface ShadowAIScanResult {
  scanId: string;
  organizationId: string;
  scanTimestamp: string;
  scanDurationMs: number;
  summary: {
    totalEmployees: number;
    employeesUsingAI: number;
    unauthorizedToolsDetected: number;
    totalInteractions: number;
    piiExposures: number;
    sourceCodeLeaks: number;
    confidentialDataLeaks: number;
    estimatedExposureUsd: number;
    riskLevel: 'critical' | 'high' | 'medium' | 'low';
  };
  byTool: Array<{
    tool: string;
    provider: string;
    authorized: boolean;
    userCount: number;
    interactionCount: number;
    piiExposures: number;
    estimatedCostUsd: number;
  }>;
  byDepartment: Array<{
    department: string;
    userCount: number;
    interactionCount: number;
    piiExposures: number;
    topTools: string[];
    riskLevel: string;
  }>;
  topRisks: Array<{
    severity: 'critical' | 'high' | 'medium' | 'low';
    category: string;
    description: string;
    affectedUsers: number;
    estimatedExposureUsd: number;
    recommendation: string;
  }>;
  recentDetections: ShadowAIDetection[];
  complianceGaps: Array<{
    framework: string;
    requirement: string;
    status: 'non_compliant' | 'partial' | 'compliant';
    finding: string;
  }>;
  generatedAt: string;
  integrityHash: string;
}

export interface ScanConfig {
  organizationId: string;
  organizationName?: string;
  industry?: string;
  employeeCount?: number;
  authorizedTools?: string[];
  departments?: string[];
  timeRange?: string;
}

// ---------------------------------------------------------------------------
// Demo data generators
// ---------------------------------------------------------------------------

const AI_TOOLS = [
  { tool: 'ChatGPT', provider: 'OpenAI', risk: 'high' },
  { tool: 'Claude', provider: 'Anthropic', risk: 'medium' },
  { tool: 'Gemini', provider: 'Google', risk: 'medium' },
  { tool: 'Copilot', provider: 'Microsoft', risk: 'low' },
  { tool: 'Perplexity', provider: 'Perplexity AI', risk: 'medium' },
  { tool: 'Midjourney', provider: 'Midjourney', risk: 'low' },
  { tool: 'Cursor', provider: 'Anysphere', risk: 'medium' },
  { tool: 'Jasper AI', provider: 'Jasper', risk: 'medium' },
  { tool: 'DeepSeek', provider: 'DeepSeek', risk: 'high' },
  { tool: 'Grok', provider: 'xAI', risk: 'medium' },
];

const DEPARTMENTS = ['Engineering', 'Product', 'Legal', 'Finance', 'Marketing', 'HR', 'Sales', 'Operations', 'Executive', 'Customer Support'];

const PII_TYPES = ['email', 'phone', 'ssn', 'credit_card', 'bank_account', 'address', 'medical_record', 'passport', 'driver_license', 'tax_id'];

function generateDetections(count: number): ShadowAIDetection[] {
  const detections: ShadowAIDetection[] = [];
  const now = Date.now();
  for (let i = 0; i < count; i++) {
    const tool = AI_TOOLS[Math.floor(Math.random() * AI_TOOLS.length)];
    const dept = DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)];
    const hasPII = Math.random() < 0.35;
    const piiTypes = hasPII
      ? PII_TYPES.filter(() => Math.random() < 0.3).slice(0, 3)
      : [];
    const classifications: ShadowAIDetection['dataClassification'][] = ['public', 'internal', 'confidential', 'restricted'];
    const classification = classifications[Math.floor(Math.random() * classifications.length)];
    const riskScore = classification === 'restricted' ? 90 + Math.floor(Math.random() * 10) :
                      classification === 'confidential' ? 60 + Math.floor(Math.random() * 30) :
                      classification === 'internal' ? 30 + Math.floor(Math.random() * 30) :
                      Math.floor(Math.random() * 30);

    detections.push({
      id: `shadow-${crypto.randomUUID().slice(0, 8)}`,
      timestamp: new Date(now - Math.floor(Math.random() * 7 * 86400000)).toISOString(),
      userId: `user-${100 + i}`,
      userEmail: `${['j.smith', 'a.garcia', 'm.chen', 'r.patel', 's.kim', 'l.johnson', 'd.williams', 'k.nakamura', 'f.martinez', 'b.thompson'][i % 10]}@acme.com`,
      department: dept,
      aiTool: tool.tool,
      provider: tool.provider,
      dataClassification: classification,
      piiTypesDetected: piiTypes,
      dataSizeBytes: Math.floor(Math.random() * 50000) + 500,
      action: riskScore > 80 ? 'blocked' : riskScore > 50 ? 'flagged' : 'allowed',
      riskScore,
      integrityHash: `sha256:${crypto.createHash('sha256').update(`${i}-${now}`).digest('hex').slice(0, 16)}`,
    });
  }
  return detections.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

class ShadowAIScannerService {
  private scans = new Map<string, ShadowAIScanResult>();

  async runScan(config: ScanConfig): Promise<ShadowAIScanResult> {
    const start = Date.now();
    const scanId = `scan-${crypto.randomUUID().slice(0, 12)}`;
    const empCount = config.employeeCount || 500;
    const authorized = config.authorizedTools || ['Copilot'];
    const detections = generateDetections(Math.min(empCount, 200));

    const piiExposures = detections.filter(d => d.piiTypesDetected.length > 0).length;
    const sourceCodeLeaks = detections.filter(d => d.department === 'Engineering' && d.dataClassification !== 'public').length;
    const confidentialLeaks = detections.filter(d => ['confidential', 'restricted'].includes(d.dataClassification)).length;
    const uniqueUsers = new Set(detections.map(d => d.userId)).size;
    const uniqueTools = [...new Set(detections.map(d => d.aiTool))];
    const unauthorizedTools = uniqueTools.filter(t => !authorized.includes(t));

    // Exposure calc: avg $50K per PII record, $200K per source code leak, $100K per confidential leak
    const estimatedExposure = (piiExposures * 50_000) + (sourceCodeLeaks * 200_000) + (confidentialLeaks * 100_000);
    const riskLevel: ShadowAIScanResult['summary']['riskLevel'] =
      estimatedExposure > 5_000_000 ? 'critical' :
      estimatedExposure > 1_000_000 ? 'high' :
      estimatedExposure > 200_000 ? 'medium' : 'low';

    const byTool = uniqueTools.map(tool => {
      const toolDetections = detections.filter(d => d.aiTool === tool);
      return {
        tool,
        provider: toolDetections[0]?.provider || 'Unknown',
        authorized: authorized.includes(tool),
        userCount: new Set(toolDetections.map(d => d.userId)).size,
        interactionCount: toolDetections.length,
        piiExposures: toolDetections.filter(d => d.piiTypesDetected.length > 0).length,
        estimatedCostUsd: toolDetections.length * (0.02 + Math.random() * 0.05),
      };
    }).sort((a, b) => b.interactionCount - a.interactionCount);

    const depts = config.departments || DEPARTMENTS;
    const byDepartment = depts.map(dept => {
      const deptDetections = detections.filter(d => d.department === dept);
      const deptPII = deptDetections.filter(d => d.piiTypesDetected.length > 0).length;
      return {
        department: dept,
        userCount: new Set(deptDetections.map(d => d.userId)).size,
        interactionCount: deptDetections.length,
        piiExposures: deptPII,
        topTools: [...new Set(deptDetections.map(d => d.aiTool))].slice(0, 3),
        riskLevel: deptPII > 5 ? 'high' : deptPII > 2 ? 'medium' : 'low',
      };
    }).filter(d => d.interactionCount > 0).sort((a, b) => b.interactionCount - a.interactionCount);

    const topRisks: ShadowAIScanResult['topRisks'] = [
      {
        severity: 'critical',
        category: 'Data Leakage',
        description: `${piiExposures} PII exposures detected across ${unauthorizedTools.length} unauthorized AI tools`,
        affectedUsers: uniqueUsers,
        estimatedExposureUsd: piiExposures * 50_000,
        recommendation: 'Deploy AI gateway proxy to intercept and block PII before it leaves your network',
      },
      {
        severity: 'high',
        category: 'Source Code Exposure',
        description: `${sourceCodeLeaks} instances of proprietary source code shared with external AI providers`,
        affectedUsers: new Set(detections.filter(d => d.department === 'Engineering').map(d => d.userId)).size,
        estimatedExposureUsd: sourceCodeLeaks * 200_000,
        recommendation: 'Enforce local-only AI models (e.g., Ollama) for code-related tasks',
      },
      {
        severity: 'high',
        category: 'Shadow AI Proliferation',
        description: `${unauthorizedTools.length} unauthorized AI tools in active use — only ${authorized.join(', ')} authorized`,
        affectedUsers: uniqueUsers,
        estimatedExposureUsd: 0,
        recommendation: 'Implement CendiaGateway to consolidate AI access through a governed proxy',
      },
      {
        severity: 'medium',
        category: 'Compliance Gap',
        description: 'No audit trail exists for AI-assisted decisions — non-compliant with EU AI Act Article 12',
        affectedUsers: uniqueUsers,
        estimatedExposureUsd: 500_000,
        recommendation: 'Enable Regulator\'s Receipt for all AI interactions to create court-admissible evidence',
      },
    ];

    const complianceGaps: ShadowAIScanResult['complianceGaps'] = [
      { framework: 'EU AI Act', requirement: 'Article 12 — Record-keeping', status: 'non_compliant', finding: 'No automated logging of AI system interactions or decisions' },
      { framework: 'EU AI Act', requirement: 'Article 14 — Human oversight', status: 'partial', finding: 'Some tools have human review but no systematic enforcement' },
      { framework: 'GDPR', requirement: 'Article 35 — DPIA', status: 'non_compliant', finding: 'No Data Protection Impact Assessment for AI tools processing personal data' },
      { framework: 'NIST AI RMF', requirement: 'GOVERN 1.1', status: 'non_compliant', finding: 'No AI risk management policies or procedures in place' },
      { framework: 'SOC 2', requirement: 'CC6.1 — Logical access', status: 'partial', finding: 'AI tools not included in access control inventory' },
      { framework: 'ISO 42001', requirement: 'Clause 6.1 — Risk assessment', status: 'non_compliant', finding: 'AI systems not covered by organizational risk assessment' },
    ];

    const scanData = JSON.stringify({ scanId, config, detections: detections.length });
    const result: ShadowAIScanResult = {
      scanId,
      organizationId: config.organizationId,
      scanTimestamp: new Date().toISOString(),
      scanDurationMs: Date.now() - start + Math.floor(Math.random() * 2000) + 1000,
      summary: {
        totalEmployees: empCount,
        employeesUsingAI: uniqueUsers,
        unauthorizedToolsDetected: unauthorizedTools.length,
        totalInteractions: detections.length,
        piiExposures,
        sourceCodeLeaks,
        confidentialDataLeaks: confidentialLeaks,
        estimatedExposureUsd: estimatedExposure,
        riskLevel,
      },
      byTool,
      byDepartment,
      topRisks,
      recentDetections: detections.slice(0, 20),
      complianceGaps,
      generatedAt: new Date().toISOString(),
      integrityHash: `sha256:${crypto.createHash('sha256').update(scanData).digest('hex')}`,
    };

    this.scans.set(scanId, result);
    logger.info(`[ShadowAI] Scan ${scanId} complete: ${uniqueUsers} users, ${unauthorizedTools.length} unauthorized tools, $${estimatedExposure.toLocaleString()} exposure`);
    return result;
  }

  async getScan(scanId: string): Promise<ShadowAIScanResult | null> {
    return this.scans.get(scanId) ?? null;
  }

  async listScans(orgId: string): Promise<ShadowAIScanResult[]> {
    return [...this.scans.values()].filter(s => s.organizationId === orgId);
  }
}

export const shadowAIScannerService = new ShadowAIScannerService();
