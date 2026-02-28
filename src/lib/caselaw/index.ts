// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * CASELAW ACCESS PROJECT API INTEGRATION
 * Harvard Law School's free caselaw database
 * https://case.law/
 * 
 * Free tier: 500 API calls/day
 * Coverage: 6.7M+ cases from all US jurisdictions through 2018
 */

const CASELAW_API_BASE = 'https://api.case.law/v1';

// Types based on CAP API schema
export interface CaselawCase {
  id: number;
  url: string;
  name: string;
  name_abbreviation: string;
  decision_date: string;
  docket_number: string;
  first_page: string;
  last_page: string;
  citations: CaselawCitation[];
  volume: {
    url: string;
    volume_number: string;
    barcode: string;
  };
  reporter: {
    url: string;
    full_name: string;
    id: number;
  };
  court: {
    url: string;
    name_abbreviation: string;
    slug: string;
    id: number;
    name: string;
  };
  jurisdiction: {
    id: number;
    name_long: string;
    url: string;
    slug: string;
    whitelisted: boolean;
    name: string;
  };
  cites_to?: CaselawCitesTo[];
  frontend_url: string;
  preview?: string[];
  casebody?: {
    status: string;
    data: {
      judges: string[];
      parties: string[];
      attorneys: string[];
      opinions: CaselawOpinion[];
      head_matter: string;
    };
  };
}

export interface CaselawCitation {
  type: string;
  cite: string;
}

export interface CaselawCitesTo {
  cite: string;
  category: string;
  reporter?: string;
  case_ids?: number[];
  opinion_id?: number;
}

export interface CaselawOpinion {
  text: string;
  type: string;
  author: string;
}

export interface CaselawSearchParams {
  search?: string;           // Full-text search
  cite?: string;             // Citation lookup (e.g., "539 U.S. 558")
  name_abbreviation?: string; // Case name search
  jurisdiction?: string;     // e.g., "ill", "cal", "us"
  court?: string;            // Court slug
  decision_date_min?: string; // YYYY-MM-DD
  decision_date_max?: string;
  ordering?: string;         // e.g., "-decision_date"
  page_size?: number;        // Max 100
  full_case?: boolean;       // Include full text (uses API quota)
}

export interface CaselawSearchResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: CaselawCase[];
}

class CaselawService {
  private apiToken: string | null = null;
  private rateLimitRemaining: number = 500;
  private rateLimitReset: Date | null = null;

  constructor() {
    // Try to load API token from environment or localStorage
    if (typeof window !== 'undefined') {
      this.apiToken = localStorage.getItem('caselaw_api_token');
    }
  }

  setApiToken(token: string) {
    this.apiToken = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('caselaw_api_token', token);
    }
  }

  getApiToken(): string | null {
    return this.apiToken;
  }

  getRateLimitStatus(): { remaining: number; reset: Date | null } {
    return {
      remaining: this.rateLimitRemaining,
      reset: this.rateLimitReset,
    };
  }

  private async fetch<T>(endpoint: string, params?: Record<string, string | number | boolean>): Promise<T> {
    const url = new URL(`${CASELAW_API_BASE}${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };

    if (this.apiToken) {
      headers['Authorization'] = `Token ${this.apiToken}`;
    }

    const response = await fetch(url.toString(), { headers });

    // Track rate limits from response headers
    const remaining = response.headers.get('X-RateLimit-Remaining');
    const reset = response.headers.get('X-RateLimit-Reset');
    
    if (remaining) {
      this.rateLimitRemaining = parseInt(remaining, 10);
    }
    if (reset) {
      this.rateLimitReset = new Date(reset);
    }

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Free tier allows 500 requests/day.');
      }
      throw new Error(`Caselaw API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Search for cases by various criteria
   */
  async searchCases(params: CaselawSearchParams): Promise<CaselawSearchResponse> {
    const queryParams: Record<string, string | number | boolean> = {};
    
    if (params.search) {queryParams.search = params.search;}
    if (params.cite) {queryParams.cite = params.cite;}
    if (params.name_abbreviation) {queryParams.name_abbreviation = params.name_abbreviation;}
    if (params.jurisdiction) {queryParams.jurisdiction = params.jurisdiction;}
    if (params.court) {queryParams.court = params.court;}
    if (params.decision_date_min) {queryParams.decision_date_min = params.decision_date_min;}
    if (params.decision_date_max) {queryParams.decision_date_max = params.decision_date_max;}
    if (params.ordering) {queryParams.ordering = params.ordering;}
    if (params.page_size) {queryParams.page_size = params.page_size;}
    if (params.full_case) {queryParams.full_case = 'true';}

    return this.fetch<CaselawSearchResponse>('/cases/', queryParams);
  }

  /**
   * Get a specific case by ID
   */
  async getCase(caseId: number, fullCase: boolean = false): Promise<CaselawCase> {
    const params: Record<string, string> = {};
    if (fullCase) {params.full_case = 'true';}
    
    return this.fetch<CaselawCase>(`/cases/${caseId}/`, params);
  }

  /**
   * Look up a case by citation (e.g., "539 U.S. 558")
   */
  async getCaseByCitation(citation: string, fullCase: boolean = false): Promise<CaselawCase | null> {
    const results = await this.searchCases({
      cite: citation,
      page_size: 1,
      full_case: fullCase,
    });
    
    return results.results[0] || null;
  }

  /**
   * Find similar/related cases based on a case
   */
  async findRelatedCases(caseData: CaselawCase, limit: number = 10): Promise<CaselawCase[]> {
    if (!caseData.cites_to || caseData.cites_to.length === 0) {
      // If no citations, search by similar terms
      const searchTerms = caseData.name_abbreviation.split(' v. ')[0];
      const results = await this.searchCases({
        search: searchTerms,
        jurisdiction: caseData.jurisdiction.slug,
        page_size: limit,
      });
      return results.results.filter(c => c.id !== caseData.id);
    }

    // Get cases that this case cites
    const relatedCases: CaselawCase[] = [];
    const citesToProcess = caseData.cites_to.slice(0, limit);

    for (const cite of citesToProcess) {
      if (cite.case_ids && cite.case_ids.length > 0) {
        try {
          const citedCase = await this.getCase(cite.case_ids[0]);
          relatedCases.push(citedCase);
        } catch (e) {
          console.warn(`Could not fetch cited case: ${cite.cite}`);
        }
      }
    }

    return relatedCases;
  }

  /**
   * Search for trade secret cases (for demo)
   */
  async searchTradeSecretCases(jurisdiction?: string): Promise<CaselawSearchResponse> {
    return this.searchCases({
      search: 'trade secret misappropriation',
      jurisdiction,
      ordering: '-decision_date',
      page_size: 20,
    });
  }

  /**
   * Search for cases by legal topic
   */
  async searchByTopic(topic: string, options?: {
    jurisdiction?: string;
    dateMin?: string;
    dateMax?: string;
    limit?: number;
  }): Promise<CaselawSearchResponse> {
    return this.searchCases({
      search: topic,
      jurisdiction: options?.jurisdiction,
      decision_date_min: options?.dateMin,
      decision_date_max: options?.dateMax,
      page_size: options?.limit || 20,
      ordering: '-decision_date',
    });
  }

  /**
   * Get jurisdictions list
   */
  async getJurisdictions(): Promise<{ id: number; slug: string; name: string; name_long: string }[]> {
    const response = await this.fetch<{ results: { id: number; slug: string; name: string; name_long: string }[] }>('/jurisdictions/');
    return response.results;
  }

  /**
   * Get courts list
   */
  async getCourts(jurisdiction?: string): Promise<{ id: number; slug: string; name: string; name_abbreviation: string }[]> {
    const params: Record<string, string> = {};
    if (jurisdiction) {params.jurisdiction = jurisdiction;}
    
    const response = await this.fetch<{ results: { id: number; slug: string; name: string; name_abbreviation: string }[] }>('/courts/', params);
    return response.results;
  }

  /**
   * Format case for display
   */
  formatCaseForDisplay(caseData: CaselawCase): string {
    const citation = caseData.citations[0]?.cite || 'No citation';
    const date = new Date(caseData.decision_date).toLocaleDateString();
    return `${caseData.name_abbreviation}, ${citation} (${date})`;
  }

  /**
   * Extract key holdings from case text (basic extraction)
   */
  extractKeyHoldings(caseData: CaselawCase): string[] {
    if (!caseData.casebody?.data?.opinions) {return [];}

    const holdings: string[] = [];
    const holdingPatterns = [
      /we hold that/gi,
      /the court holds/gi,
      /it is held that/gi,
      /we conclude that/gi,
      /we find that/gi,
      /judgment is/gi,
    ];

    for (const opinion of caseData.casebody.data.opinions) {
      const sentences = opinion.text.split(/[.!?]+/);
      for (const sentence of sentences) {
        for (const pattern of holdingPatterns) {
          if (pattern.test(sentence) && sentence.length > 50 && sentence.length < 500) {
            holdings.push(sentence.trim());
            break;
          }
        }
      }
    }

    return holdings.slice(0, 5); // Return top 5 holdings
  }
}

// Singleton instance
export const caselawService = new CaselawService();

// Re-export other caselaw services
export { courtListenerService } from './courtlistener';
export type { 
  CourtListenerOpinion, 
  CourtListenerCluster, 
  CourtListenerSearchResult,
  CourtListenerSearchResponse 
} from './courtlistener';

export { offlineCaselawService } from './offline';
export type { 
  OfflineCaseData, 
  OfflineSearchResult, 
  ReporterMetadata 
} from './offline';

export { unifiedCaselawService } from './unified';
export type { 
  UnifiedCaseResult, 
  UnifiedSearchOptions, 
  UnifiedSearchResponse,
  DataSource 
} from './unified';

export { 
  searchCasesByTopic, 
  getCaseByCitation, 
  findSimilarCases,
  searchTradeSecretCases,
  CASELAW_TOOL_DEFINITIONS 
} from './tools';

export {
  LEGAL_SOURCES,
  generateSearchUrl,
  generateAllSearchUrls,
  getApiSources,
  getSourcesForUseCase,
  formatSourcesForAgent,
} from './sources';
export type { LegalSource } from './sources';

// Export for use in agents
export default caselawService;
