// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * UNIFIED CASELAW SERVICE
 * Combines multiple data sources for legal case research:
 * 
 * 1. Offline (static.case.law bulk downloads) - No network, fastest
 * 2. CourtListener API - Better search, citation network
 * 3. CAP API (case.law) - Original source, 500 calls/day free
 * 
 * Priority: Offline → CourtListener → CAP API
 */

import { caselawService, type CaselawCase } from './index';
import { courtListenerService, type CourtListenerSearchResult } from './courtlistener';
import { offlineCaselawService, type OfflineCaseData, type OfflineSearchResult } from './offline';

export type DataSource = 'offline' | 'courtlistener' | 'cap-api';

export interface UnifiedCaseResult {
  id: string;
  name: string;
  citation: string;
  date: string;
  court: string;
  jurisdiction: string;
  url?: string;
  snippet?: string;
  citeCount?: number;
  source: DataSource;
  raw?: CaselawCase | CourtListenerSearchResult | OfflineCaseData;
}

export interface UnifiedSearchOptions {
  query: string;
  jurisdiction?: string;
  dateMin?: string;
  dateMax?: string;
  limit?: number;
  sources?: DataSource[];
  preferOffline?: boolean;
}

export interface UnifiedSearchResponse {
  results: UnifiedCaseResult[];
  totalCount: number;
  sources: {
    source: DataSource;
    count: number;
    available: boolean;
    error?: string;
  }[];
}

class UnifiedCaselawService {
  private offlineAvailable: boolean = false;
  private courtListenerAvailable: boolean = true;
  private capApiAvailable: boolean = true;

  /**
   * Initialize and check available sources
   */
  async initialize(): Promise<void> {
    // Check offline data
    try {
      await offlineCaselawService.initialize();
      const stats = offlineCaselawService.getStats();
      this.offlineAvailable = stats.reportersAvailable > 0;
    } catch {
      this.offlineAvailable = false;
    }

    // CourtListener and CAP API are assumed available unless they fail
  }

  /**
   * Search across all available sources
   */
  async search(options: UnifiedSearchOptions): Promise<UnifiedSearchResponse> {
    const sources = options.sources || ['offline', 'courtlistener', 'cap-api'];
    const limit = options.limit || 20;
    const results: UnifiedCaseResult[] = [];
    const sourceStats: UnifiedSearchResponse['sources'] = [];

    // Try offline first if preferred and available
    if (sources.includes('offline') && this.offlineAvailable && options.preferOffline !== false) {
      try {
        const offlineResults = await offlineCaselawService.searchCases(options.query, {
          jurisdiction: options.jurisdiction,
          dateMin: options.dateMin,
          dateMax: options.dateMax,
          limit,
        });

        results.push(...offlineResults.map(r => this.normalizeOfflineResult(r)));
        sourceStats.push({
          source: 'offline',
          count: offlineResults.length,
          available: true,
        });

        // If we got enough results from offline, skip network calls
        if (results.length >= limit) {
          return {
            results: results.slice(0, limit),
            totalCount: results.length,
            sources: sourceStats,
          };
        }
      } catch (error) {
        sourceStats.push({
          source: 'offline',
          count: 0,
          available: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    // Try CourtListener
    if (sources.includes('courtlistener') && this.courtListenerAvailable) {
      try {
        const clResults = await courtListenerService.searchOpinions(options.query, {
          court: options.jurisdiction,
          filed_after: options.dateMin,
          filed_before: options.dateMax,
        });

        results.push(...clResults.results.map(r => this.normalizeCourtListenerResult(r)));
        sourceStats.push({
          source: 'courtlistener',
          count: clResults.results.length,
          available: true,
        });
      } catch (error) {
        this.courtListenerAvailable = false;
        sourceStats.push({
          source: 'courtlistener',
          count: 0,
          available: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    // Try CAP API as fallback
    if (sources.includes('cap-api') && this.capApiAvailable && results.length < limit) {
      try {
        const capResults = await caselawService.searchByTopic(options.query, {
          jurisdiction: options.jurisdiction,
          dateMin: options.dateMin,
          dateMax: options.dateMax,
          limit: limit - results.length,
        });

        results.push(...capResults.results.map(r => this.normalizeCapResult(r)));
        sourceStats.push({
          source: 'cap-api',
          count: capResults.results.length,
          available: true,
        });
      } catch (error) {
        sourceStats.push({
          source: 'cap-api',
          count: 0,
          available: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    // Deduplicate by citation
    const seen = new Set<string>();
    const dedupedResults = results.filter(r => {
      const key = r.citation.toLowerCase().replace(/\s+/g, '');
      if (seen.has(key)) {return false;}
      seen.add(key);
      return true;
    });

    return {
      results: dedupedResults.slice(0, limit),
      totalCount: dedupedResults.length,
      sources: sourceStats,
    };
  }

  /**
   * Get a specific case by citation
   */
  async getCaseByCitation(citation: string): Promise<UnifiedCaseResult | null> {
    // Try offline first
    if (this.offlineAvailable) {
      const offlineCase = await offlineCaselawService.getCaseByCitation(citation);
      if (offlineCase) {
        return {
          id: offlineCase.id.toString(),
          name: offlineCase.name_abbreviation,
          citation: offlineCase.citations[0]?.cite || citation,
          date: offlineCase.decision_date,
          court: offlineCase.court.name,
          jurisdiction: offlineCase.jurisdiction.name,
          source: 'offline',
          raw: offlineCase,
        };
      }
    }

    // Try CAP API
    try {
      const capCase = await caselawService.getCaseByCitation(citation, true);
      if (capCase) {
        return this.normalizeCapResult(capCase);
      }
    } catch {
      // Continue to next source
    }

    return null;
  }

  /**
   * Search for trade secret cases (specialized)
   */
  async searchTradeSecretCases(jurisdiction?: string): Promise<UnifiedSearchResponse> {
    return this.search({
      query: '"trade secret" OR "misappropriation" OR "DTSA" OR "Uniform Trade Secrets Act"',
      jurisdiction,
      limit: 20,
    });
  }

  /**
   * Search for employment discrimination cases (specialized)
   */
  async searchEmploymentCases(jurisdiction?: string): Promise<UnifiedSearchResponse> {
    return this.search({
      query: '"age discrimination" OR "ADEA" OR "wrongful termination" OR "Title VII" OR "employment discrimination"',
      jurisdiction,
      limit: 20,
    });
  }

  /**
   * Get available data sources status
   */
  getSourceStatus(): {
    offline: { available: boolean; casesIndexed: number };
    courtlistener: { available: boolean; authenticated: boolean };
    capApi: { available: boolean; callsRemaining: number };
  } {
    const offlineStats = offlineCaselawService.getStats();
    const clStats = courtListenerService.getUsageStats();
    const capStats = caselawService.getRateLimitStatus();

    return {
      offline: {
        available: this.offlineAvailable,
        casesIndexed: offlineStats.casesIndexed,
      },
      courtlistener: {
        available: this.courtListenerAvailable,
        authenticated: clStats.authenticated,
      },
      capApi: {
        available: this.capApiAvailable,
        callsRemaining: capStats.remaining,
      },
    };
  }

  // Normalization helpers

  private normalizeOfflineResult(result: OfflineSearchResult): UnifiedCaseResult {
    return {
      id: `offline-${result.reporter}-${result.volume}-${result.case.id}`,
      name: result.case.name_abbreviation,
      citation: result.case.citations[0]?.cite || 'No citation',
      date: result.case.decision_date,
      court: result.case.court.name,
      jurisdiction: result.case.jurisdiction.name,
      source: 'offline',
      raw: result.case,
    };
  }

  private normalizeCourtListenerResult(result: CourtListenerSearchResult): UnifiedCaseResult {
    return {
      id: `cl-${result.cluster_id}`,
      name: result.caseName,
      citation: result.citation.join(', ') || 'No citation',
      date: result.dateFiled,
      court: result.court,
      jurisdiction: result.court_id,
      url: `https://www.courtlistener.com${result.absolute_url}`,
      snippet: result.snippet.replace(/<[^>]*>/g, ''),
      citeCount: result.citeCount,
      source: 'courtlistener',
      raw: result,
    };
  }

  private normalizeCapResult(result: CaselawCase): UnifiedCaseResult {
    return {
      id: `cap-${result.id}`,
      name: result.name_abbreviation,
      citation: result.citations[0]?.cite || 'No citation',
      date: result.decision_date,
      court: result.court.name,
      jurisdiction: result.jurisdiction.name,
      url: result.frontend_url,
      source: 'cap-api',
      raw: result,
    };
  }
}

// Singleton instance
export const unifiedCaselawService = new UnifiedCaselawService();

export default unifiedCaselawService;
