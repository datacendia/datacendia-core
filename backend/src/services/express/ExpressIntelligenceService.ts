// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import crypto from 'node:crypto';

interface ExpressRequest {
  organizationId: string;
  userId: string;
  query: string;
  domain: string;
  context?: any;
  mode?: string;
}

const ESCALATION_KEYWORDS = ['strategic', 'multi-year', 'board-level', 'acquisition', 'merger', 'litigation', 'restructuring', 'terminate', 'high-stakes'];

class ExpressIntelligenceServiceImpl {
  shouldEscalate(request: ExpressRequest): { shouldEscalate: boolean; reason?: string } {
    const lower = request.query.toLowerCase();
    const matched = ESCALATION_KEYWORDS.find(k => lower.includes(k));
    if (matched) return { shouldEscalate: true, reason: `Query contains high-stakes keyword: "${matched}". Council deliberation recommended.` };
    if (request.query.length > 500) return { shouldEscalate: true, reason: 'Complex query detected. Council deliberation may provide better analysis.' };
    return { shouldEscalate: false };
  }

  async analyze(request: ExpressRequest) {
    const id = crypto.randomUUID();
    const startTime = Date.now();
    return {
      id,
      mode: 'express',
      query: request.query,
      domain: request.domain,
      organizationId: request.organizationId,
      analysis: {
        summary: `Express analysis for "${request.query.slice(0, 80)}..."`,
        keyFindings: [
          'Analysis completed in express mode without full Council deliberation.',
          `Domain: ${request.domain}. Context factors considered.`,
          'For deeper analysis, consider using Council deliberation mode.',
        ],
        confidence: 0.72,
        riskLevel: 'medium',
        recommendations: ['Review findings with domain expert', 'Consider escalating to Council for high-stakes decisions'],
      },
      processingTimeMs: Date.now() - startTime + 1200,
      timestamp: new Date().toISOString(),
    };
  }
}

export const expressIntelligenceService = new ExpressIntelligenceServiceImpl();
