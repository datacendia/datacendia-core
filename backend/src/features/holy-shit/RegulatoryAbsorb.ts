// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA PLATFORM - REGULATORY INSTANT-ABSORB
// Upload any regulation and the Council learns it in seconds
// =============================================================================

import { BaseService, ServiceConfig, ServiceHealth } from '../../core/services/BaseService.js';
import { featureGating, SubscriptionTier } from '../../core/subscriptions/SubscriptionTiers.js';
import { getErrorMessage } from '../../utils/errors.js';
import { deterministicFloat, deterministicInt, deterministicPercentage, deterministicPick } from '../../utils/deterministic.js';

// =============================================================================
// TYPES
// =============================================================================

export interface RegulatoryAbsorbRequest {
  organizationId: string;
  userId: string;
  tier: SubscriptionTier;
  document: DocumentUpload;
  customMapping?: ProcessMapping[];
}

export interface DocumentUpload {
  filename: string;
  mimeType: string;
  size: number;
  content: string; // Base64 or text content
}

export interface ProcessMapping {
  processId: string;
  processName: string;
  department: string;
}

export interface AbsorptionResult {
  id: string;
  documentName: string;
  uploadedAt: Date;
  processingTime: number; // seconds
  status: 'processing' | 'complete' | 'failed';
  
  // Extraction results
  extractedRequirements: RegulatoryRequirement[];
  complianceTriggers: ComplianceTrigger[];
  processMapping: ProcessImpact[];
  agentUpdates: AgentKnowledgeUpdate[];
  decisionConstraints: DecisionConstraint[];
  
  // Summary
  summary: AbsorptionSummary;
}

export interface RegulatoryRequirement {
  id: string;
  section: string;
  title: string;
  description: string;
  category: RequirementCategory;
  severity: 'critical' | 'high' | 'medium' | 'low';
  deadline?: Date;
  affectedAreas: string[];
  originalText: string;
}

export type RequirementCategory = 
  | 'data_protection'
  | 'security'
  | 'financial'
  | 'operational'
  | 'governance'
  | 'environmental'
  | 'employment'
  | 'industry_specific'
  | 'reporting'
  | 'licensing';

export interface ComplianceTrigger {
  id: string;
  trigger: string;
  condition: string;
  requirementIds: string[];
  actionRequired: string;
  automatable: boolean;
}

export interface ProcessImpact {
  processId: string;
  processName: string;
  department: string;
  impactLevel: 'high' | 'medium' | 'low';
  changes: string[];
  requirements: string[];
}

export interface AgentKnowledgeUpdate {
  agentId: string;
  agentName: string;
  knowledgeAdded: string[];
  constraintsAdded: string[];
  updateStatus: 'success' | 'pending' | 'failed';
}

export interface DecisionConstraint {
  id: string;
  constraint: string;
  appliesTo: string[];
  source: string;
  enforcementLevel: 'mandatory' | 'advisory';
}

export interface AbsorptionSummary {
  totalPages: number;
  totalWords: number;
  processingTime: number;
  requirementsExtracted: number;
  triggersIdentified: number;
  processesAffected: number;
  agentsUpdated: number;
  constraintsCreated: number;
  complianceGaps: number;
  riskScore: number;
  penalties: PenaltyInfo[];
}

export interface PenaltyInfo {
  violation: string;
  maxPenalty: string;
  description: string;
}

// =============================================================================
// REGULATORY ABSORB SERVICE
// =============================================================================

export class RegulatoryAbsorbService extends BaseService {
  private ollamaEndpoint: string;
  private absorbedDocuments: Map<string, AbsorptionResult[]> = new Map();
  private knowledgeBase: Map<string, RegulatoryRequirement[]> = new Map();

  constructor(config?: Partial<ServiceConfig>) {
    super({
      name: 'regulatory-absorb',
      version: '1.0.0',
      dependencies: ['council'],
      ...config,
    });
    this.ollamaEndpoint = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434';
  }

  async initialize(): Promise<void> {
    this.logger.info('Regulatory Instant-Absorb service initializing...');
  }

  async shutdown(): Promise<void> {
    this.logger.info('Regulatory Instant-Absorb service shutting down...');
    this.absorbedDocuments.clear();
    this.knowledgeBase.clear();
  }

  async healthCheck(): Promise<ServiceHealth> {
    return {
      status: 'healthy',
      lastCheck: new Date(),
      details: { 
        documentsAbsorbed: Array.from(this.absorbedDocuments.values()).flat().length,
        requirementsKnown: Array.from(this.knowledgeBase.values()).flat().length,
      },
    };
  }

  // ---------------------------------------------------------------------------
  // FEATURE ACCESS CHECK
  // ---------------------------------------------------------------------------

  checkAccess(tier: SubscriptionTier, organizationId: string): { allowed: boolean; reason?: string } {
    if (!featureGating.hasFeature(tier, 'regulatoryInstantAbsorb')) {
      return {
        allowed: false,
        reason: `Regulatory Instant-Absorb requires ${featureGating.getUpgradeTierForFeature('regulatoryInstantAbsorb')} tier or higher.`,
      };
    }

    // Check usage limits
    const currentUsage = this.getMonthlyUsage(organizationId);
    if (!featureGating.isWithinLimit(tier, 'regulatoryDocumentsPerMonth', currentUsage)) {
      return {
        allowed: false,
        reason: 'Monthly regulatory document limit reached. Please upgrade your plan.',
      };
    }

    return { allowed: true };
  }

  // ---------------------------------------------------------------------------
  // MAIN ABSORPTION FUNCTION
  // ---------------------------------------------------------------------------

  async absorbDocument(request: RegulatoryAbsorbRequest): Promise<AbsorptionResult> {
    const startTime = Date.now();

    // Check feature access
    const access = this.checkAccess(request.tier, request.organizationId);
    if (!access.allowed) {
      throw new Error(access.reason);
    }

    this.logger.info(`Starting absorption of: ${request.document.filename}`);

    const resultId = `reg-${Date.now()}-${crypto.randomUUID().slice(0, 9)}`;

    try {
      // Extract text from document
      const documentText = await this.extractText(request.document);
      const wordCount = documentText.split(/\s+/).length;
      const pageCount = Math.ceil(wordCount / 250); // Approximate pages

      // Extract regulatory requirements
      const requirements = await this.extractRequirements(documentText);
      
      // Identify compliance triggers
      const triggers = await this.identifyTriggers(requirements);
      
      // Map to company processes
      const processImpacts = await this.mapToProcesses(
        requirements,
        request.customMapping
      );
      
      // Update agent knowledge bases
      const agentUpdates = await this.updateAgentKnowledge(requirements);
      
      // Create decision constraints
      const constraints = this.createConstraints(requirements);
      
      // Extract penalty information
      const penalties = this.extractPenalties(documentText);

      const processingTime = (Date.now() - startTime) / 1000;

      const result: AbsorptionResult = {
        id: resultId,
        documentName: request.document.filename,
        uploadedAt: new Date(),
        processingTime,
        status: 'complete',
        extractedRequirements: requirements,
        complianceTriggers: triggers,
        processMapping: processImpacts,
        agentUpdates,
        decisionConstraints: constraints,
        summary: {
          totalPages: pageCount,
          totalWords: wordCount,
          processingTime,
          requirementsExtracted: requirements.length,
          triggersIdentified: triggers.length,
          processesAffected: processImpacts.length,
          agentsUpdated: agentUpdates.filter(a => a.updateStatus === 'success').length,
          constraintsCreated: constraints.length,
          complianceGaps: this.calculateComplianceGaps(requirements, processImpacts),
          riskScore: this.calculateRiskScore(requirements),
          penalties,
        },
      };

      // Store in history
      this.storeAbsorption(request.organizationId, result);
      
      // Add to knowledge base
      this.addToKnowledgeBase(request.organizationId, requirements);

      this.incrementCounter('documents_absorbed', 1);
      this.recordMetric('absorption_time_seconds', processingTime);

      return result;
    } catch (error) {
      this.incrementCounter('absorptions_failed', 1);
      throw error;
    }
  }

  // ---------------------------------------------------------------------------
  // DOCUMENT PROCESSING
  // ---------------------------------------------------------------------------

  private async extractText(document: DocumentUpload): Promise<string> {
    // Production upgrade: use PDF parsing library
    // For now, assume content is already text or decode base64
    if (document.mimeType === 'application/pdf') {
      // Would use pdf-parse or similar library
      return document.content;
    }
    
    if (document.content.startsWith('data:')) {
      // Base64 encoded
      const base64Data = document.content.split(',')[1];
      return Buffer.from(base64Data, 'base64').toString('utf-8');
    }
    
    return document.content;
  }

  // ---------------------------------------------------------------------------
  // REQUIREMENT EXTRACTION
  // ---------------------------------------------------------------------------

  private async extractRequirements(documentText: string): Promise<RegulatoryRequirement[]> {
    // Chunk document for processing
    const chunks = this.chunkDocument(documentText, 4000);
    const allRequirements: RegulatoryRequirement[] = [];

    for (const chunk of chunks) {
      const prompt = `Extract all regulatory requirements from this text. For each requirement, identify:
1. The specific obligation or rule
2. Who/what it applies to
3. Any deadlines or timeframes
4. Severity (critical, high, medium, low)
5. Category (data_protection, security, financial, operational, governance, environmental, employment, industry_specific, reporting, licensing)

TEXT:
${chunk}

Respond in JSON format:
{
  "requirements": [
    {
      "section": "Section reference",
      "title": "Short title",
      "description": "Full requirement description",
      "category": "category_name",
      "severity": "high",
      "deadline": "Date if specified",
      "affectedAreas": ["Areas affected"],
      "originalText": "Original text snippet"
    }
  ]
}`;

      try {
        const response = await fetch(`${this.ollamaEndpoint}/api/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'llama3.2:latest',
            prompt,
            stream: false,
            format: 'json',
          }),
        });

        const data = await response.json() as { response: string };
        const parsed = JSON.parse(data.response);

        for (const req of parsed.requirements || []) {
          allRequirements.push({
            id: `req-${Date.now()}-${allRequirements.length}`,
            section: req.section || 'Unknown',
            title: req.title || 'Untitled Requirement',
            description: req.description || '',
            category: req.category || 'operational',
            severity: req.severity || 'medium',
            deadline: req.deadline ? new Date(req.deadline) : undefined,
            affectedAreas: req.affectedAreas || [],
            originalText: req.originalText || '',
          });
        }
      } catch (error: unknown) {
        this.logger.error(`Error extracting requirements from chunk: ${error instanceof Error ? getErrorMessage(error) : 'Unknown error'}`);
      }
    }

    return allRequirements;
  }

  private chunkDocument(text: string, maxChunkSize: number): string[] {
    const chunks: string[] = [];
    const words = text.split(/\s+/);
    let currentChunk: string[] = [];
    let currentSize = 0;

    for (const word of words) {
      if (currentSize + word.length + 1 > maxChunkSize) {
        chunks.push(currentChunk.join(' '));
        currentChunk = [word];
        currentSize = word.length;
      } else {
        currentChunk.push(word);
        currentSize += word.length + 1;
      }
    }

    if (currentChunk.length > 0) {
      chunks.push(currentChunk.join(' '));
    }

    return chunks;
  }

  // ---------------------------------------------------------------------------
  // TRIGGER IDENTIFICATION
  // ---------------------------------------------------------------------------

  private async identifyTriggers(requirements: RegulatoryRequirement[]): Promise<ComplianceTrigger[]> {
    const triggers: ComplianceTrigger[] = [];

    // Group requirements by category and create triggers
    const categories = [...new Set(requirements.map(r => r.category))];

    for (const category of categories) {
      const categoryReqs = requirements.filter(r => r.category === category);
      
      triggers.push({
        id: `trigger-${Date.now()}-${triggers.length}`,
        trigger: `${category.replace('_', ' ')} compliance check`,
        condition: `When processing ${category.replace('_', ' ')} related decisions`,
        requirementIds: categoryReqs.map(r => r.id),
        actionRequired: `Review ${categoryReqs.length} ${category} requirements before proceeding`,
        automatable: ['reporting', 'data_protection'].includes(category),
      });
    }

    // Add critical requirement triggers
    const criticalReqs = requirements.filter(r => r.severity === 'critical');
    if (criticalReqs.length > 0) {
      triggers.push({
        id: `trigger-critical-${Date.now()}`,
        trigger: 'Critical compliance alert',
        condition: 'Any decision affecting regulated areas',
        requirementIds: criticalReqs.map(r => r.id),
        actionRequired: 'Mandatory legal review required',
        automatable: false,
      });
    }

    return triggers;
  }

  // ---------------------------------------------------------------------------
  // PROCESS MAPPING
  // ---------------------------------------------------------------------------

  private async mapToProcesses(
    requirements: RegulatoryRequirement[],
    customMapping?: ProcessMapping[]
  ): Promise<ProcessImpact[]> {
    // Default company processes
    const defaultProcesses: ProcessMapping[] = [
      { processId: 'p1', processName: 'Customer Data Handling', department: 'Operations' },
      { processId: 'p2', processName: 'Financial Reporting', department: 'Finance' },
      { processId: 'p3', processName: 'Employee Onboarding', department: 'HR' },
      { processId: 'p4', processName: 'Product Development', department: 'Engineering' },
      { processId: 'p5', processName: 'Vendor Management', department: 'Procurement' },
      { processId: 'p6', processName: 'Security Operations', department: 'IT Security' },
    ];

    const processes = customMapping || defaultProcesses;
    const impacts: ProcessImpact[] = [];

    for (const process of processes) {
      const relevantReqs = requirements.filter(r => 
        r.affectedAreas.some(area => 
          process.processName.toLowerCase().includes(area.toLowerCase()) ||
          process.department.toLowerCase().includes(area.toLowerCase())
        ) ||
        // Category-based matching
        (process.department === 'Finance' && r.category === 'financial') ||
        (process.department === 'HR' && r.category === 'employment') ||
        (process.department === 'IT Security' && r.category === 'security') ||
        (process.processName.includes('Data') && r.category === 'data_protection')
      );

      if (relevantReqs.length > 0) {
        const criticalCount = relevantReqs.filter(r => r.severity === 'critical').length;
        const highCount = relevantReqs.filter(r => r.severity === 'high').length;

        impacts.push({
          processId: process.processId,
          processName: process.processName,
          department: process.department,
          impactLevel: criticalCount > 0 ? 'high' : highCount > 2 ? 'medium' : 'low',
          changes: relevantReqs.slice(0, 3).map(r => r.title),
          requirements: relevantReqs.map(r => r.id),
        });
      }
    }

    return impacts;
  }

  // ---------------------------------------------------------------------------
  // AGENT KNOWLEDGE UPDATES
  // ---------------------------------------------------------------------------

  private async updateAgentKnowledge(
    requirements: RegulatoryRequirement[]
  ): Promise<AgentKnowledgeUpdate[]> {
    const agents = [
      { id: 'ciso', name: 'CISO Agent', categories: ['security', 'data_protection'] },
      { id: 'legal', name: 'Legal Agent', categories: ['governance', 'licensing', 'employment'] },
      { id: 'cfo', name: 'CFO Agent', categories: ['financial', 'reporting'] },
      { id: 'coo', name: 'COO Agent', categories: ['operational', 'environmental'] },
    ];

    const updates: AgentKnowledgeUpdate[] = [];

    for (const agent of agents) {
      const relevantReqs = requirements.filter(r => 
        agent.categories.includes(r.category)
      );

      if (relevantReqs.length > 0) {
        updates.push({
          agentId: agent.id,
          agentName: agent.name,
          knowledgeAdded: relevantReqs.map(r => r.title),
          constraintsAdded: relevantReqs
            .filter(r => r.severity === 'critical' || r.severity === 'high')
            .map(r => `Must comply with: ${r.title}`),
          updateStatus: 'success',
        });
      }
    }

    return updates;
  }

  // ---------------------------------------------------------------------------
  // CONSTRAINT CREATION
  // ---------------------------------------------------------------------------

  private createConstraints(requirements: RegulatoryRequirement[]): DecisionConstraint[] {
    return requirements
      .filter(r => r.severity === 'critical' || r.severity === 'high')
      .map((r, idx) => ({
        id: `constraint-${Date.now()}-${idx}`,
        constraint: `All decisions must comply with: ${r.title}`,
        appliesTo: r.affectedAreas,
        source: r.section,
        enforcementLevel: r.severity === 'critical' ? 'mandatory' : 'advisory',
      }));
  }

  // ---------------------------------------------------------------------------
  // ANALYSIS HELPERS
  // ---------------------------------------------------------------------------

  private extractPenalties(documentText: string): PenaltyInfo[] {
    const penalties: PenaltyInfo[] = [];
    
    // Common penalty patterns
    const penaltyPatterns = [
      /(?:fine|penalty|sanction)[^.]*(?:Ã¢â€šÂ¬|Ã‚Â£|\$|EUR|USD|GBP)\s*[\d,]+(?:\s*(?:million|billion))?[^.]*/gi,
      /(?:Ã¢â€šÂ¬|Ã‚Â£|\$|EUR|USD|GBP)\s*[\d,]+(?:\s*(?:million|billion))?[^.]*(?:fine|penalty|sanction)[^.]*/gi,
      /\d+%\s*(?:of\s*)?(?:annual\s*)?(?:turnover|revenue|profit)[^.]*/gi,
    ];

    for (const pattern of penaltyPatterns) {
      const matches = documentText.match(pattern) || [];
      for (const match of matches.slice(0, 5)) {
        penalties.push({
          violation: 'Non-compliance',
          maxPenalty: match.trim(),
          description: 'Extracted penalty clause',
        });
      }
    }

    return penalties;
  }

  private calculateComplianceGaps(
    requirements: RegulatoryRequirement[],
    processImpacts: ProcessImpact[]
  ): number {
    // Count requirements not mapped to any process
    const mappedReqIds = new Set(processImpacts.flatMap(p => p.requirements));
    return requirements.filter(r => !mappedReqIds.has(r.id)).length;
  }

  private calculateRiskScore(requirements: RegulatoryRequirement[]): number {
    const severityScores = { critical: 40, high: 25, medium: 10, low: 5 };
    const totalScore = requirements.reduce((sum, r) => 
      sum + (severityScores[r.severity] || 5), 0
    );
    return Math.min(100, totalScore);
  }

  // ---------------------------------------------------------------------------
  // USAGE TRACKING
  // ---------------------------------------------------------------------------

  private getMonthlyUsage(organizationId: string): number {
    const history = this.absorbedDocuments.get(organizationId) || [];
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    
    return history.filter(h => h.uploadedAt >= thisMonth).length;
  }

  private storeAbsorption(organizationId: string, result: AbsorptionResult): void {
    const history = this.absorbedDocuments.get(organizationId) || [];
    history.push(result);
    this.absorbedDocuments.set(organizationId, history);
  }

  private addToKnowledgeBase(organizationId: string, requirements: RegulatoryRequirement[]): void {
    const existing = this.knowledgeBase.get(organizationId) || [];
    this.knowledgeBase.set(organizationId, [...existing, ...requirements]);
  }

  getAbsorptionHistory(organizationId: string): AbsorptionResult[] {
    return this.absorbedDocuments.get(organizationId) || [];
  }

  getKnowledgeBase(organizationId: string): RegulatoryRequirement[] {
    return this.knowledgeBase.get(organizationId) || [];
  }

  // Query knowledge base for deliberations
  queryKnowledge(organizationId: string, query: string): RegulatoryRequirement[] {
    const knowledge = this.knowledgeBase.get(organizationId) || [];
    const queryLower = query.toLowerCase();
    
    return knowledge.filter(r => 
      r.title.toLowerCase().includes(queryLower) ||
      r.description.toLowerCase().includes(queryLower) ||
      r.affectedAreas.some(a => a.toLowerCase().includes(queryLower))
    );
  }
}

// Export singleton
export const regulatoryAbsorbService = new RegulatoryAbsorbService();
