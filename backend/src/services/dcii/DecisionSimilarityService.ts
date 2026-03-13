// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * CendiaPrecedent™ — Decision Precedent Engine
 *
 * Compares any new decision against historical precedents using TF-IDF
 * cosine similarity. Catches inconsistency before it becomes liability.
 *
 * "This decision is 87% similar to Decision #X from 3 months ago
 *  which had a different outcome."
 *
 * Like legal case law search — but for AI decisions.
 *
 * @module services/dcii/DecisionSimilarityService
 * @exports decisionSimilarityService
 */

import { sha256, bytesToHex, utf8ToBytes } from '../crypto/nativeCrypto.js';
import { logger } from '../../utils/logger.js';
import { prisma } from '../../config/database.js';

// =============================================================================
// TYPES
// =============================================================================

export interface PrecedentMatch {
  deliberationId: string;
  question: string;
  decision: string;
  similarity: number;         // 0-1 cosine similarity
  similarityPercent: number;  // 0-100
  createdAt: string;
  consensusScore: number;
  mode: string;
  outcomeMatch: boolean;      // did both reach the same conclusion direction?
  warning?: string;           // populated if outcomes diverge significantly
}

export interface PrecedentSearchResult {
  searchId: string;
  query: string;
  queryDeliberationId?: string;
  matches: PrecedentMatch[];
  totalSearched: number;
  searchedAt: string;
  searchDurationMs: number;
  inconsistencies: {
    matchId: string;
    description: string;
    severity: 'high' | 'medium' | 'low';
  }[];
}

// =============================================================================
// TF-IDF ENGINE (Lightweight, no external dependencies)
// =============================================================================

interface DocumentVector {
  id: string;
  terms: Map<string, number>; // term → TF-IDF weight
  magnitude: number;
}

class TfIdfEngine {
  private documents = new Map<string, { terms: string[]; metadata: any }>();
  private idfCache = new Map<string, number>();
  private vectorCache = new Map<string, DocumentVector>();
  private dirty = true;

  addDocument(id: string, text: string, metadata: any): void {
    const terms = this.tokenize(text);
    this.documents.set(id, { terms, metadata });
    this.dirty = true;
  }

  search(queryText: string, topK: number = 10): { id: string; score: number; metadata: any }[] {
    if (this.dirty) this.recomputeVectors();

    const queryTerms = this.tokenize(queryText);
    const queryTf = this.computeTf(queryTerms);
    const queryVector = new Map<string, number>();
    let queryMag = 0;

    for (const [term, tf] of queryTf) {
      const idf = this.idfCache.get(term) || 0;
      const weight = tf * idf;
      queryVector.set(term, weight);
      queryMag += weight * weight;
    }
    queryMag = Math.sqrt(queryMag);

    if (queryMag === 0) return [];

    const results: { id: string; score: number; metadata: any }[] = [];

    for (const [id, docVec] of this.vectorCache) {
      if (docVec.magnitude === 0) continue;

      let dotProduct = 0;
      for (const [term, weight] of queryVector) {
        const docWeight = docVec.terms.get(term) || 0;
        dotProduct += weight * docWeight;
      }

      const score = dotProduct / (queryMag * docVec.magnitude);
      if (score > 0.05) {
        results.push({ id, score, metadata: this.documents.get(id)?.metadata });
      }
    }

    results.sort((a, b) => b.score - a.score);
    return results.slice(0, topK);
  }

  private recomputeVectors(): void {
    const N = this.documents.size;
    if (N === 0) return;

    // Compute IDF
    const docFrequency = new Map<string, number>();
    for (const [, doc] of this.documents) {
      const uniqueTerms = new Set(doc.terms);
      for (const term of uniqueTerms) {
        docFrequency.set(term, (docFrequency.get(term) || 0) + 1);
      }
    }

    this.idfCache.clear();
    for (const [term, df] of docFrequency) {
      this.idfCache.set(term, Math.log(1 + N / df));
    }

    // Compute TF-IDF vectors
    this.vectorCache.clear();
    for (const [id, doc] of this.documents) {
      const tf = this.computeTf(doc.terms);
      const terms = new Map<string, number>();
      let magnitude = 0;

      for (const [term, tfVal] of tf) {
        const idf = this.idfCache.get(term) || 0;
        const weight = tfVal * idf;
        terms.set(term, weight);
        magnitude += weight * weight;
      }

      this.vectorCache.set(id, { id, terms, magnitude: Math.sqrt(magnitude) });
    }

    this.dirty = false;
  }

  private computeTf(terms: string[]): Map<string, number> {
    const freq = new Map<string, number>();
    for (const t of terms) freq.set(t, (freq.get(t) || 0) + 1);
    const max = Math.max(...freq.values(), 1);
    const tf = new Map<string, number>();
    for (const [term, count] of freq) tf.set(term, count / max);
    return tf;
  }

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(t => t.length > 2 && !STOP_WORDS.has(t));
  }

  get size(): number { return this.documents.size; }
}

const STOP_WORDS = new Set([
  'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'her',
  'was', 'one', 'our', 'out', 'has', 'had', 'his', 'how', 'its', 'may',
  'new', 'now', 'old', 'see', 'way', 'who', 'did', 'get', 'let', 'say',
  'she', 'too', 'use', 'this', 'that', 'with', 'have', 'from', 'they',
  'been', 'said', 'each', 'which', 'their', 'will', 'other', 'about',
  'many', 'then', 'them', 'these', 'some', 'would', 'make', 'like',
  'into', 'could', 'time', 'very', 'when', 'come', 'what', 'your',
]);

// =============================================================================
// SERVICE
// =============================================================================

class DecisionPrecedentEngine {
  private engine = new TfIdfEngine();
  private indexed = false;
  private indexedOrgs = new Set<string>();

  constructor() {
    logger.info('⚖️ CendiaPrecedent: Initialized — decision precedent engine active');
  }

  // ---------------------------------------------------------------------------
  // INDEX BUILDING
  // ---------------------------------------------------------------------------

  async ensureIndex(organizationId: string): Promise<number> {
    if (this.indexedOrgs.has(organizationId)) return this.engine.size;

    const deliberations = await prisma.deliberations.findMany({
      where: { organization_id: organizationId, status: 'COMPLETED' },
      orderBy: { created_at: 'desc' },
      take: 1000, // Cap for performance
    });

    for (const delib of deliberations) {
      const decisionText = typeof delib.decision === 'object'
        ? JSON.stringify(delib.decision)
        : (delib.decision as string) || '';

      this.engine.addDocument(delib.id, `${delib.question} ${decisionText}`, {
        question: delib.question,
        decision: decisionText,
        createdAt: delib.created_at.toISOString(),
        consensusScore: delib.confidence != null ? Math.round(delib.confidence * 100) : 0,
        mode: delib.mode || 'standard',
      });
    }

    this.indexedOrgs.add(organizationId);
    logger.info(`⚖️ CendiaPrecedent: Indexed ${deliberations.length} decisions for org ${organizationId}`);
    return deliberations.length;
  }

  // ---------------------------------------------------------------------------
  // PRECEDENT SEARCH
  // ---------------------------------------------------------------------------

  async findPrecedents(
    query: string,
    organizationId: string,
    options: { topK?: number; minSimilarity?: number; excludeId?: string } = {}
  ): Promise<PrecedentSearchResult> {
    const startTime = Date.now();
    const { topK = 10, minSimilarity = 0.1, excludeId } = options;

    await this.ensureIndex(organizationId);

    const rawResults = this.engine.search(query, topK + 5); // Extra to account for filtering

    const matches: PrecedentMatch[] = rawResults
      .filter(r => r.score >= minSimilarity && r.id !== excludeId)
      .slice(0, topK)
      .map(r => ({
        deliberationId: r.id,
        question: r.metadata.question,
        decision: (r.metadata.decision || '').substring(0, 200),
        similarity: Math.round(r.score * 1000) / 1000,
        similarityPercent: Math.round(r.score * 100),
        createdAt: r.metadata.createdAt,
        consensusScore: r.metadata.consensusScore,
        mode: r.metadata.mode,
        outcomeMatch: true, // Will be refined below
      }));

    // Detect inconsistencies — similar questions with divergent outcomes
    const inconsistencies: PrecedentSearchResult['inconsistencies'] = [];

    for (const match of matches) {
      if (match.similarityPercent >= 70) {
        // High similarity — check if outcomes diverged
        // Simple heuristic: if consensus scores differ by >30 points, flag it
        const otherMatches = matches.filter(m =>
          m.deliberationId !== match.deliberationId && m.similarityPercent >= 60
        );

        for (const other of otherMatches) {
          const scoreDiff = Math.abs(match.consensusScore - other.consensusScore);
          if (scoreDiff > 30) {
            match.outcomeMatch = false;
            match.warning = `Similar to ${other.deliberationId} (${other.similarityPercent}% match) but consensus differed by ${scoreDiff} points`;

            inconsistencies.push({
              matchId: match.deliberationId,
              description: `Decision "${match.question.substring(0, 50)}..." is ${match.similarityPercent}% similar to a previous decision but reached a significantly different consensus (${match.consensusScore}% vs ${other.consensusScore}%)`,
              severity: scoreDiff > 50 ? 'high' : scoreDiff > 30 ? 'medium' : 'low',
            });
          }
        }
      }
    }

    const result: PrecedentSearchResult = {
      searchId: `prec-${bytesToHex(sha256(utf8ToBytes(`${query}:${Date.now()}`))).substring(0, 12)}`,
      query,
      matches,
      totalSearched: this.engine.size,
      searchedAt: new Date().toISOString(),
      searchDurationMs: Date.now() - startTime,
      inconsistencies,
    };

    logger.info(`⚖️ CendiaPrecedent: Found ${matches.length} precedents for query (${result.searchDurationMs}ms, ${inconsistencies.length} inconsistencies)`);

    return result;
  }

  /**
   * Check a specific deliberation against all precedents.
   */
  async checkDeliberation(deliberationId: string, organizationId: string): Promise<PrecedentSearchResult> {
    const delib = await prisma.deliberations.findUnique({ where: { id: deliberationId } });
    if (!delib) throw new Error(`Deliberation ${deliberationId} not found`);

    const result = await this.findPrecedents(delib.question, organizationId, {
      excludeId: deliberationId,
      topK: 10,
      minSimilarity: 0.15,
    });

    result.queryDeliberationId = deliberationId;
    return result;
  }
}

export const decisionSimilarityService = new DecisionPrecedentEngine();
