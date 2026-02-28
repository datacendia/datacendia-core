// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * CASELAW TOOLS FOR COUNCIL AGENTS
 * These tools allow agents to search and retrieve case law during deliberation
 */

import { caselawService, type CaselawCase, type CaselawSearchResponse } from './index';

export interface CaselawToolResult {
  success: boolean;
  data?: unknown;
  error?: string;
  source: 'caselaw-access-project';
  cached?: boolean;
}

// Simple in-memory cache for demo
const searchCache = new Map<string, { result: CaselawSearchResponse; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

function getCacheKey(params: Record<string, unknown>): string {
  return JSON.stringify(params);
}

/**
 * Search for cases by topic/keywords
 */
export async function searchCasesByTopic(
  topic: string,
  options?: {
    jurisdiction?: string;
    dateMin?: string;
    dateMax?: string;
    limit?: number;
  }
): Promise<CaselawToolResult> {
  try {
    const cacheKey = getCacheKey({ topic, ...options });
    const cached = searchCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return {
        success: true,
        data: formatSearchResults(cached.result),
        source: 'caselaw-access-project',
        cached: true,
      };
    }

    const result = await caselawService.searchByTopic(topic, options);
    searchCache.set(cacheKey, { result, timestamp: Date.now() });

    return {
      success: true,
      data: formatSearchResults(result),
      source: 'caselaw-access-project',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      source: 'caselaw-access-project',
    };
  }
}

/**
 * Look up a specific case by citation
 */
export async function getCaseByCitation(citation: string): Promise<CaselawToolResult> {
  try {
    const result = await caselawService.getCaseByCitation(citation, true);
    
    if (!result) {
      return {
        success: false,
        error: `Case not found for citation: ${citation}`,
        source: 'caselaw-access-project',
      };
    }

    return {
      success: true,
      data: formatCaseDetail(result),
      source: 'caselaw-access-project',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      source: 'caselaw-access-project',
    };
  }
}

/**
 * Find cases similar to a given case
 */
export async function findSimilarCases(
  caseNameOrCitation: string,
  limit: number = 5
): Promise<CaselawToolResult> {
  try {
    // First, find the source case
    let sourceCase = await caselawService.getCaseByCitation(caseNameOrCitation, true);
    
    if (!sourceCase) {
      // Try searching by name
      const searchResult = await caselawService.searchCases({
        name_abbreviation: caseNameOrCitation,
        page_size: 1,
        full_case: true,
      });
      sourceCase = searchResult.results[0];
    }

    if (!sourceCase) {
      return {
        success: false,
        error: `Could not find case: ${caseNameOrCitation}`,
        source: 'caselaw-access-project',
      };
    }

    const relatedCases = await caselawService.findRelatedCases(sourceCase, limit);

    return {
      success: true,
      data: {
        sourceCase: formatCaseSummary(sourceCase),
        relatedCases: relatedCases.map(formatCaseSummary),
      },
      source: 'caselaw-access-project',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      source: 'caselaw-access-project',
    };
  }
}

/**
 * Search for trade secret cases (specialized for demo)
 */
export async function searchTradeSecretCases(
  jurisdiction?: string
): Promise<CaselawToolResult> {
  try {
    const result = await caselawService.searchTradeSecretCases(jurisdiction);

    return {
      success: true,
      data: formatSearchResults(result),
      source: 'caselaw-access-project',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      source: 'caselaw-access-project',
    };
  }
}

/**
 * Get available jurisdictions
 */
export async function getJurisdictions(): Promise<CaselawToolResult> {
  try {
    const jurisdictions = await caselawService.getJurisdictions();

    return {
      success: true,
      data: jurisdictions.map(j => ({
        slug: j.slug,
        name: j.name,
        fullName: j.name_long,
      })),
      source: 'caselaw-access-project',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      source: 'caselaw-access-project',
    };
  }
}

// Formatting helpers

function formatSearchResults(response: CaselawSearchResponse): {
  totalCount: number;
  cases: ReturnType<typeof formatCaseSummary>[];
} {
  return {
    totalCount: response.count,
    cases: response.results.map(formatCaseSummary),
  };
}

function formatCaseSummary(caseData: CaselawCase): {
  id: number;
  name: string;
  citation: string;
  date: string;
  court: string;
  jurisdiction: string;
  url: string;
} {
  return {
    id: caseData.id,
    name: caseData.name_abbreviation,
    citation: caseData.citations[0]?.cite || 'No citation',
    date: caseData.decision_date,
    court: caseData.court.name,
    jurisdiction: caseData.jurisdiction.name,
    url: caseData.frontend_url,
  };
}

function formatCaseDetail(caseData: CaselawCase): {
  id: number;
  name: string;
  fullName: string;
  citation: string;
  date: string;
  court: string;
  jurisdiction: string;
  docketNumber: string;
  url: string;
  parties?: string[];
  judges?: string[];
  attorneys?: string[];
  holdings?: string[];
  citesTo?: { cite: string; category: string }[];
  opinions?: { type: string; author: string; excerpt: string }[];
} {
  const holdings = caselawService.extractKeyHoldings(caseData);

  return {
    id: caseData.id,
    name: caseData.name_abbreviation,
    fullName: caseData.name,
    citation: caseData.citations[0]?.cite || 'No citation',
    date: caseData.decision_date,
    court: caseData.court.name,
    jurisdiction: caseData.jurisdiction.name,
    docketNumber: caseData.docket_number,
    url: caseData.frontend_url,
    parties: caseData.casebody?.data?.parties,
    judges: caseData.casebody?.data?.judges,
    attorneys: caseData.casebody?.data?.attorneys,
    holdings: holdings.length > 0 ? holdings : undefined,
    citesTo: caseData.cites_to?.slice(0, 10).map(c => ({
      cite: c.cite,
      category: c.category,
    })),
    opinions: caseData.casebody?.data?.opinions?.map(o => ({
      type: o.type,
      author: o.author || 'Unknown',
      excerpt: o.text.substring(0, 500) + (o.text.length > 500 ? '...' : ''),
    })),
  };
}

/**
 * Tool definitions for agent system prompts
 */
export const CASELAW_TOOL_DEFINITIONS = `
## Available Legal Research Tools

You have access to the Caselaw Access Project database (6.7M+ US cases):

### searchCasesByTopic(topic, options?)
Search for cases by legal topic or keywords.
- topic: Search terms (e.g., "trade secret misappropriation", "breach of fiduciary duty")
- options.jurisdiction: State/federal filter (e.g., "cal", "us", "ny")
- options.dateMin/dateMax: Date range (YYYY-MM-DD)
- options.limit: Max results (default 20)

### getCaseByCitation(citation)
Look up a specific case by its citation.
- citation: Legal citation (e.g., "539 U.S. 558", "184 Cal. App. 4th 210")

### findSimilarCases(caseNameOrCitation, limit?)
Find cases related to or cited by a given case.
- caseNameOrCitation: Case name or citation
- limit: Max related cases (default 5)

### searchTradeSecretCases(jurisdiction?)
Specialized search for trade secret misappropriation cases.

When citing cases, always include:
- Full case name
- Citation
- Decision date
- Relevant holding or principle
`;

export default {
  searchCasesByTopic,
  getCaseByCitation,
  findSimilarCases,
  searchTradeSecretCases,
  getJurisdictions,
  CASELAW_TOOL_DEFINITIONS,
};
