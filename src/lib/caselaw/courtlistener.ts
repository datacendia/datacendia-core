// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * COURTLISTENER API SERVICE
 * Alternative API for accessing CAP data via Free Law Project's CourtListener
 * 
 * CourtListener provides:
 * - More robust API than static.case.law
 * - Better search capabilities
 * - Citation network analysis
 * - RECAP archive (federal court documents)
 * 
 * API Docs: https://www.courtlistener.com/help/api/
 * Rate Limits: 5,000 requests/hour for authenticated users
 */

const COURTLISTENER_API_BASE = 'https://www.courtlistener.com/api/rest/v3';

export interface CourtListenerOpinion {
  id: number;
  absolute_url: string;
  cluster: string;
  author: number | null;
  author_str: string;
  per_curiam: boolean;
  joined_by: number[];
  type: string;
  sha1: string;
  page_count: number | null;
  download_url: string | null;
  local_path: string | null;
  plain_text: string;
  html: string | null;
  html_lawbox: string | null;
  html_columbia: string | null;
  html_with_citations: string | null;
  extracted_by_ocr: boolean;
}

export interface CourtListenerCluster {
  id: number;
  absolute_url: string;
  panel: number[];
  non_participating_judges: number[];
  docket: string;
  sub_opinions: string[];
  citations: { volume: number; reporter: string; page: string; type: number }[];
  judges: string;
  date_filed: string;
  date_filed_is_approximate: boolean;
  slug: string;
  case_name: string;
  case_name_short: string;
  case_name_full: string;
  scdb_id: string;
  scdb_decision_direction: number | null;
  scdb_votes_majority: number | null;
  scdb_votes_minority: number | null;
  source: string;
  procedural_history: string;
  attorneys: string;
  nature_of_suit: string;
  posture: string;
  syllabus: string;
  headnotes: string;
  summary: string;
  disposition: string;
  history: string;
  other_dates: string;
  cross_reference: string;
  correction: string;
  citation_count: number;
  precedential_status: string;
  date_blocked: string | null;
  blocked: boolean;
}

export interface CourtListenerDocket {
  id: number;
  absolute_url: string;
  court: string;
  court_id: string;
  clusters: string[];
  audio_files: string[];
  assigned_to: number | null;
  assigned_to_str: string;
  referred_to: number | null;
  referred_to_str: string;
  date_created: string;
  date_modified: string;
  source: number;
  appeal_from_str: string;
  assigned_to_id: number | null;
  referred_to_id: number | null;
  date_last_index: string | null;
  date_cert_granted: string | null;
  date_cert_denied: string | null;
  date_argued: string | null;
  date_reargued: string | null;
  date_reargument_denied: string | null;
  date_filed: string | null;
  date_terminated: string | null;
  date_last_filing: string | null;
  case_name_short: string;
  case_name: string;
  case_name_full: string;
  slug: string;
  docket_number: string;
  docket_number_core: string;
  pacer_case_id: string;
  cause: string;
  nature_of_suit: string;
  jury_demand: string;
  jurisdiction_type: string;
  appellate_fee_status: string;
  appellate_case_type_information: string;
  mdl_status: string;
  filepath_local: string;
  filepath_ia: string;
  filepath_ia_json: string;
  ia_upload_failure_count: number | null;
  ia_needs_upload: boolean | null;
  ia_date_first_change: string | null;
  view_count: number;
  date_blocked: string | null;
  blocked: boolean;
}

export interface CourtListenerCourt {
  id: string;
  pacer_court_id: string | null;
  pacer_has_rss_feed: boolean | null;
  pacer_rss_entry_types: string;
  fjc_court_id: string;
  date_modified: string;
  in_use: boolean;
  has_opinion_scraper: boolean;
  has_oral_argument_scraper: boolean;
  position: number;
  citation_string: string;
  short_name: string;
  full_name: string;
  url: string;
  start_date: string;
  end_date: string | null;
  jurisdiction: string;
}

export interface CourtListenerSearchResult {
  absolute_url: string;
  attorney: string;
  caseName: string;
  caseNameShort: string;
  citation: string[];
  citeCount: number;
  cluster_id: number;
  court: string;
  court_citation_string: string;
  court_exact: string;
  court_id: string;
  dateArgued: string | null;
  dateFiled: string;
  dateReargued: string | null;
  dateReargumentDenied: string | null;
  docket_id: number;
  docketNumber: string;
  download_url: string | null;
  id: number;
  judge: string;
  lexisCite: string;
  neutralCite: string;
  non_participating_judge_ids: number[];
  panel_ids: number[];
  per_curiam: boolean;
  sibling_ids: number[];
  snippet: string;
  source: string;
  status: string;
  status_exact: string;
  suitNature: string;
  timestamp: string;
  type: string;
}

export interface CourtListenerSearchResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: CourtListenerSearchResult[];
}

class CourtListenerService {
  private apiToken: string | null = null;
  private requestCount: number = 0;
  private hourStart: number = Date.now();

  /**
   * Set API token for authenticated requests (higher rate limits)
   * Get token at: https://www.courtlistener.com/help/api/
   */
  setApiToken(token: string) {
    this.apiToken = token;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (this.apiToken) {
      headers['Authorization'] = `Token ${this.apiToken}`;
    }
    return headers;
  }

  private async fetch<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    // Rate limit tracking
    const now = Date.now();
    if (now - this.hourStart > 3600000) {
      this.requestCount = 0;
      this.hourStart = now;
    }
    
    const limit = this.apiToken ? 5000 : 100;
    if (this.requestCount >= limit) {
      throw new Error(`Rate limit exceeded (${limit}/hour). ${this.apiToken ? '' : 'Set API token for higher limits.'}`);
    }

    const url = new URL(`${COURTLISTENER_API_BASE}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const response = await fetch(url.toString(), {
      headers: this.getHeaders(),
    });

    this.requestCount++;

    if (!response.ok) {
      throw new Error(`CourtListener API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Search opinions (cases)
   */
  async searchOpinions(
    query: string,
    options?: {
      court?: string;
      filed_after?: string;
      filed_before?: string;
      cited_gt?: number;
      order_by?: 'score' | 'dateFiled' | '-dateFiled' | 'citeCount' | '-citeCount';
      page?: number;
    }
  ): Promise<CourtListenerSearchResponse> {
    const params: Record<string, string> = {
      q: query,
      type: 'o', // opinions
    };

    if (options?.court) {params.court = options.court;}
    if (options?.filed_after) {params.filed_after = options.filed_after;}
    if (options?.filed_before) {params.filed_before = options.filed_before;}
    if (options?.cited_gt) {params.cited_gt = options.cited_gt.toString();}
    if (options?.order_by) {params.order_by = options.order_by;}
    if (options?.page) {params.page = options.page.toString();}

    return this.fetch<CourtListenerSearchResponse>('/search/', params);
  }

  /**
   * Get opinion cluster (case with all opinions)
   */
  async getCluster(clusterId: number): Promise<CourtListenerCluster> {
    return this.fetch<CourtListenerCluster>(`/clusters/${clusterId}/`);
  }

  /**
   * Get individual opinion
   */
  async getOpinion(opinionId: number): Promise<CourtListenerOpinion> {
    return this.fetch<CourtListenerOpinion>(`/opinions/${opinionId}/`);
  }

  /**
   * Get docket (case filing information)
   */
  async getDocket(docketId: number): Promise<CourtListenerDocket> {
    return this.fetch<CourtListenerDocket>(`/dockets/${docketId}/`);
  }

  /**
   * Get court information
   */
  async getCourt(courtId: string): Promise<CourtListenerCourt> {
    return this.fetch<CourtListenerCourt>(`/courts/${courtId}/`);
  }

  /**
   * List all courts
   */
  async listCourts(): Promise<{ count: number; results: CourtListenerCourt[] }> {
    return this.fetch('/courts/');
  }

  /**
   * Search for trade secret cases
   */
  async searchTradeSecretCases(options?: {
    court?: string;
    filed_after?: string;
  }): Promise<CourtListenerSearchResponse> {
    return this.searchOpinions(
      '"trade secret" OR "misappropriation" OR "Defend Trade Secrets Act" OR "DTSA"',
      {
        ...options,
        order_by: '-citeCount',
      }
    );
  }

  /**
   * Search for employment discrimination cases
   */
  async searchEmploymentCases(options?: {
    court?: string;
    filed_after?: string;
  }): Promise<CourtListenerSearchResponse> {
    return this.searchOpinions(
      '"age discrimination" OR "ADEA" OR "wrongful termination" OR "Title VII"',
      {
        ...options,
        order_by: '-citeCount',
      }
    );
  }

  /**
   * Get cases that cite a specific case
   */
  async getCitingCases(clusterId: number): Promise<CourtListenerSearchResponse> {
    return this.fetch<CourtListenerSearchResponse>('/search/', {
      q: `cites:${clusterId}`,
      type: 'o',
      order_by: '-citeCount',
    });
  }

  /**
   * Format search result for display
   */
  formatResult(result: CourtListenerSearchResult): {
    name: string;
    citation: string;
    date: string;
    court: string;
    snippet: string;
    citeCount: number;
    url: string;
  } {
    return {
      name: result.caseName,
      citation: result.citation.join(', ') || 'No citation',
      date: result.dateFiled,
      court: result.court,
      snippet: result.snippet.replace(/<[^>]*>/g, ''), // Strip HTML
      citeCount: result.citeCount,
      url: `https://www.courtlistener.com${result.absolute_url}`,
    };
  }

  /**
   * Get API usage stats
   */
  getUsageStats(): {
    requestsThisHour: number;
    limit: number;
    authenticated: boolean;
  } {
    return {
      requestsThisHour: this.requestCount,
      limit: this.apiToken ? 5000 : 100,
      authenticated: !!this.apiToken,
    };
  }
}

// Singleton instance
export const courtListenerService = new CourtListenerService();

export default courtListenerService;
