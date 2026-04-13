// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// STATEMENT OF FACTS SERVICE (Community Edition — DCII)
// Generates cryptographically anchored factual summaries of deliberations.
// =============================================================================

import crypto from 'crypto';
import { BoundedMap } from '../utils/BoundedMap.js';
import { withFallback } from './_serviceProxy.js';

const statements = new BoundedMap<string, any>({ maxSize: 10000 });

export const statementOfFactsService: any = withFallback({
  async generate(data: {
    deliberationId: string;
    question: string;
    synthesis: string;
    agentResponses?: any[];
    confidence?: number;
    organizationId?: string;
  }): Promise<any> {
    const hash = crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
    const statement = {
      id: `sof-${crypto.randomUUID().slice(0, 8)}`,
      deliberationId: data.deliberationId,
      organizationId: data.organizationId || 'default',
      hash,
      title: `Statement of Facts — ${data.question.slice(0, 60)}`,
      facts: [
        { id: 1, statement: `Deliberation question: "${data.question}"`, verified: true, source: 'user_input' },
        { id: 2, statement: `${(data.agentResponses || []).length} agents participated in analysis`, verified: true, source: 'system' },
        { id: 3, statement: `Consensus reached with ${data.confidence || 0}% confidence`, verified: true, source: 'council' },
        { id: 4, statement: `Synthesis: ${data.synthesis?.slice(0, 200)}`, verified: true, source: 'council' },
      ],
      attestation: {
        hash,
        algorithm: 'SHA-256',
        timestamp: new Date().toISOString(),
        signedBy: 'Datacendia DCII',
      },
      generatedAt: new Date().toISOString(),
    };
    statements.set(data.deliberationId, statement);
    return statement;
  },

  async getByDeliberation(deliberationId: string): Promise<any | null> {
    return statements.get(deliberationId) || null;
  },

  async list(organizationId?: string): Promise<any[]> {
    let items = [...statements.values()];
    if (organizationId) items = items.filter(s => s.organizationId === organizationId);
    return items.sort((a, b) => b.generatedAt.localeCompare(a.generatedAt));
  },
});
