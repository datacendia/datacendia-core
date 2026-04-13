// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import crypto from 'crypto';

const KNOWLEDGE_DOCS = [
  { id: 'fifa-rstp', source: 'FIFA', title: 'Regulations on the Status and Transfer of Players', type: 'regulation', content: 'Article 1: Scope — These regulations lay down the rules governing the status of players, their eligibility, and their transfer between clubs.' },
  { id: 'uefa-ffp', source: 'UEFA', title: 'Financial Fair Play Regulations', type: 'regulation', content: 'Article 58: Break-even requirement — clubs must demonstrate that their total relevant expenses do not exceed total relevant income by more than the acceptable deviation.' },
  { id: 'uefa-cl', source: 'UEFA', title: 'Club Licensing Regulations', type: 'regulation', content: 'Article 47: Sporting criteria — clubs must have a youth development programme.' },
  { id: 'pl-psr', source: 'Premier League', title: 'Profitability and Sustainability Rules', type: 'regulation', content: 'Rule E.11: Permitted maximum loss of £105 million over a rolling 3-year assessment period.' },
  { id: 'cas-guide', source: 'CAS', title: 'Court of Arbitration for Sport Procedures', type: 'legal', content: 'R38: The Panel shall apply the rules of law chosen by the parties.' },
  { id: 'agent-regs', source: 'FIFA', title: 'FIFA Football Agent Regulations 2023', type: 'regulation', content: 'Article 15: Service fee caps — agents may not receive more than 10% of the transfer fee for representation.' },
];

class SportsKnowledgeBaseImpl {
  private provenanceLog: any[] = [];

  getStatus() { return { documents: KNOWLEDGE_DOCS.length, sources: [...new Set(KNOWLEDGE_DOCS.map(d => d.source))], indexed: true }; }

  async query(opts: { query: string; sources?: string[]; types?: string[]; maxResults?: number; minRelevance?: number }) {
    let docs = [...KNOWLEDGE_DOCS];
    if (opts.sources?.length) docs = docs.filter(d => opts.sources!.includes(d.source));
    if (opts.types?.length) docs = docs.filter(d => opts.types!.includes(d.type));

    const queryLower = opts.query.toLowerCase();
    const scored = docs.map(d => {
      const titleMatch = d.title.toLowerCase().includes(queryLower) ? 0.5 : 0;
      const contentMatch = d.content.toLowerCase().includes(queryLower) ? 0.3 : 0;
      const hash = crypto.createHash('md5').update(`${d.id}-${opts.query}`).digest();
      const fuzz = (hash[0]! / 255) * 0.2;
      return { ...d, relevance: Math.min(1, titleMatch + contentMatch + fuzz) };
    }).filter(d => d.relevance >= (opts.minRelevance || 0.1))
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, opts.maxResults || 10);

    this.provenanceLog.push({ action: 'query', query: opts.query, resultsCount: scored.length, timestamp: new Date().toISOString() });
    return scored;
  }

  getProvenanceLog(opts?: { documentId?: string; limit?: number }) {
    let records = [...this.provenanceLog];
    if (opts?.documentId) records = records.filter(r => r.documentId === opts.documentId);
    if (opts?.limit) records = records.slice(-opts.limit);
    return records;
  }
}

export const sportsKnowledgeBase = new SportsKnowledgeBaseImpl();
