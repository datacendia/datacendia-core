// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * OFFLINE CASELAW SERVICE
 * Searches locally downloaded caselaw data from Harvard's Caselaw Access Project
 * 
 * Data structure (after download):
 * data/caselaw/
 * ├── ReportersMetadata.json
 * ├── JurisdictionsMetadata.json
 * ├── us/                    # U.S. Supreme Court
 * │   ├── 1/
 * │   │   ├── VolumeMetadata.json
 * │   │   ├── case-001.json
 * │   │   └── ...
 * │   └── ...
 * ├── f3d/                   # Federal Reporter 3d
 * └── ...
 */

export interface OfflineCaseData {
  id: number;
  name: string;
  name_abbreviation: string;
  decision_date: string;
  docket_number?: string;
  first_page: string;
  last_page: string;
  citations: { type: string; cite: string }[];
  court: {
    name: string;
    name_abbreviation: string;
    slug: string;
  };
  jurisdiction: {
    name: string;
    slug: string;
  };
  casebody?: {
    data: {
      judges?: string[];
      parties?: string[];
      attorneys?: string[];
      head_matter?: string;
      opinions: {
        type: string;
        author?: string;
        text: string;
      }[];
    };
  };
  cites_to?: {
    cite: string;
    category: string;
  }[];
}

export interface OfflineSearchResult {
  case: OfflineCaseData;
  reporter: string;
  volume: string;
  relevanceScore: number;
  matchedTerms: string[];
}

export interface ReporterMetadata {
  id: number;
  slug: string;
  full_name: string;
  short_name: string;
  start_year: number;
  end_year: number;
  volume_count: number;
}

class OfflineCaselawService {
  private dataPath: string = './data/caselaw';
  private reportersMetadata: ReporterMetadata[] = [];
  private caseIndex: Map<string, OfflineCaseData> = new Map();
  private isInitialized: boolean = false;
  private indexedReporters: Set<string> = new Set();
  
  // File structure from static.case.law:
  // <reporter>/<volume>/cases/<page>-<index>.json
  // OR after zip extraction:
  // <reporter>/<volume>/<page>-<index>.json

  /**
   * Set the path to offline caselaw data
   */
  setDataPath(path: string) {
    this.dataPath = path;
    this.isInitialized = false;
  }

  /**
   * Initialize the service by loading metadata
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {return;}

    try {
      // In browser context, we'd fetch from public folder
      // In Node context, we'd read from filesystem
      const reportersResponse = await fetch(`${this.dataPath}/ReportersMetadata.json`);
      if (reportersResponse.ok) {
        this.reportersMetadata = await reportersResponse.json();
      }
      this.isInitialized = true;
    } catch (error) {
      console.warn('Could not load offline caselaw metadata:', error);
      this.reportersMetadata = [];
    }
  }

  /**
   * Get list of available reporters
   */
  async getAvailableReporters(): Promise<ReporterMetadata[]> {
    await this.initialize();
    return this.reportersMetadata;
  }

  /**
   * Load cases from a specific reporter into memory for searching
   */
  async indexReporter(reporterSlug: string): Promise<number> {
    if (this.indexedReporters.has(reporterSlug)) {
      return 0; // Already indexed
    }

    const casesIndexed = 0;

    try {
      // This would need to be adapted based on how data is served
      // For browser: fetch from public folder or API
      // For Node/Electron: read from filesystem
      
      // Placeholder - in production, implement proper file loading
      console.log(`Indexing reporter: ${reporterSlug}`);
      this.indexedReporters.add(reporterSlug);
      
    } catch (error) {
      console.error(`Error indexing reporter ${reporterSlug}:`, error);
    }

    return casesIndexed;
  }

  /**
   * Search cases by text query
   */
  async searchCases(
    query: string,
    options?: {
      reporters?: string[];
      jurisdiction?: string;
      dateMin?: string;
      dateMax?: string;
      limit?: number;
    }
  ): Promise<OfflineSearchResult[]> {
    await this.initialize();

    const results: OfflineSearchResult[] = [];
    const queryTerms = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);
    const limit = options?.limit || 20;

    // Search through indexed cases
    for (const [key, caseData] of this.caseIndex) {
      // Filter by reporter if specified
      if (options?.reporters && options.reporters.length > 0) {
        const [reporter] = key.split('/');
        if (!options.reporters.includes(reporter)) {continue;}
      }

      // Filter by jurisdiction
      if (options?.jurisdiction && caseData.jurisdiction.slug !== options.jurisdiction) {
        continue;
      }

      // Filter by date
      if (options?.dateMin && caseData.decision_date < options.dateMin) {continue;}
      if (options?.dateMax && caseData.decision_date > options.dateMax) {continue;}

      // Calculate relevance score
      const { score, matchedTerms } = this.calculateRelevance(caseData, queryTerms);

      if (score > 0) {
        const [reporter, volume] = key.split('/');
        results.push({
          case: caseData,
          reporter,
          volume,
          relevanceScore: score,
          matchedTerms,
        });
      }
    }

    // Sort by relevance and limit
    return results
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limit);
  }

  /**
   * Get a specific case by citation
   */
  async getCaseByCitation(citation: string): Promise<OfflineCaseData | null> {
    await this.initialize();

    // Normalize citation
    const normalizedCite = citation.toLowerCase().replace(/\s+/g, ' ').trim();

    for (const caseData of this.caseIndex.values()) {
      for (const cite of caseData.citations) {
        if (cite.cite.toLowerCase().replace(/\s+/g, ' ').trim() === normalizedCite) {
          return caseData;
        }
      }
    }

    return null;
  }

  /**
   * Find cases cited by a given case
   */
  async getCitedCases(caseData: OfflineCaseData): Promise<OfflineCaseData[]> {
    if (!caseData.cites_to || caseData.cites_to.length === 0) {
      return [];
    }

    const citedCases: OfflineCaseData[] = [];

    for (const cite of caseData.cites_to) {
      const citedCase = await this.getCaseByCitation(cite.cite);
      if (citedCase) {
        citedCases.push(citedCase);
      }
    }

    return citedCases;
  }

  /**
   * Calculate relevance score for a case against query terms
   */
  private calculateRelevance(
    caseData: OfflineCaseData,
    queryTerms: string[]
  ): { score: number; matchedTerms: string[] } {
    let score = 0;
    const matchedTerms: string[] = [];

    const searchableText = [
      caseData.name,
      caseData.name_abbreviation,
      caseData.casebody?.data?.head_matter || '',
      ...(caseData.casebody?.data?.opinions?.map(o => o.text) || []),
    ].join(' ').toLowerCase();

    for (const term of queryTerms) {
      if (searchableText.includes(term)) {
        matchedTerms.push(term);
        
        // Weight by where the term appears
        if (caseData.name.toLowerCase().includes(term)) {
          score += 10; // High weight for case name
        }
        if (caseData.casebody?.data?.head_matter?.toLowerCase().includes(term)) {
          score += 5; // Medium weight for head matter
        }
        
        // Count occurrences in opinion text
        const opinionText = caseData.casebody?.data?.opinions?.map(o => o.text).join(' ') || '';
        const occurrences = (opinionText.toLowerCase().match(new RegExp(term, 'g')) || []).length;
        score += Math.min(occurrences, 10); // Cap at 10 per term
      }
    }

    // Boost recent cases slightly
    const year = parseInt(caseData.decision_date.substring(0, 4));
    if (year >= 2010) {score *= 1.2;}
    if (year >= 2015) {score *= 1.1;}

    return { score, matchedTerms };
  }

  /**
   * Extract key holdings from case text
   */
  extractHoldings(caseData: OfflineCaseData): string[] {
    if (!caseData.casebody?.data?.opinions) {return [];}

    const holdings: string[] = [];
    const holdingPatterns = [
      /we hold that[^.]+\./gi,
      /the court holds[^.]+\./gi,
      /it is held that[^.]+\./gi,
      /we conclude that[^.]+\./gi,
      /we find that[^.]+\./gi,
      /accordingly,? we[^.]+\./gi,
    ];

    for (const opinion of caseData.casebody.data.opinions) {
      for (const pattern of holdingPatterns) {
        const matches = opinion.text.match(pattern);
        if (matches) {
          holdings.push(...matches.map(m => m.trim()));
        }
      }
    }

    // Deduplicate and limit
    return [...new Set(holdings)].slice(0, 5);
  }

  /**
   * Format case for display
   */
  formatCaseDisplay(caseData: OfflineCaseData): string {
    const citation = caseData.citations[0]?.cite || 'No citation';
    const year = caseData.decision_date.substring(0, 4);
    return `${caseData.name_abbreviation}, ${citation} (${year})`;
  }

  /**
   * Get statistics about indexed data
   */
  getStats(): {
    reportersAvailable: number;
    reportersIndexed: number;
    casesIndexed: number;
  } {
    return {
      reportersAvailable: this.reportersMetadata.length,
      reportersIndexed: this.indexedReporters.size,
      casesIndexed: this.caseIndex.size,
    };
  }
}

// Singleton instance
export const offlineCaselawService = new OfflineCaselawService();

export default offlineCaselawService;
