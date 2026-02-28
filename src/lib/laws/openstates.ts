// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * OPEN STATES API INTEGRATION
 * Free API for state legislative data across all 50 US states + DC + PR
 * 
 * API Docs: https://docs.openstates.org/api-v3/
 * Coverage: Bills, legislators, votes, committees for all states
 * Rate Limit: Reasonable use, API key required
 * 
 * To get an API key: https://open.pluralpolicy.com/accounts/profile/
 */

const OPENSTATES_API_BASE = 'https://v3.openstates.org';

// US State/Territory codes
export const US_JURISDICTIONS = {
  // States
  al: 'Alabama',
  ak: 'Alaska',
  az: 'Arizona',
  ar: 'Arkansas',
  ca: 'California',
  co: 'Colorado',
  ct: 'Connecticut',
  de: 'Delaware',
  fl: 'Florida',
  ga: 'Georgia',
  hi: 'Hawaii',
  id: 'Idaho',
  il: 'Illinois',
  in: 'Indiana',
  ia: 'Iowa',
  ks: 'Kansas',
  ky: 'Kentucky',
  la: 'Louisiana',
  me: 'Maine',
  md: 'Maryland',
  ma: 'Massachusetts',
  mi: 'Michigan',
  mn: 'Minnesota',
  ms: 'Mississippi',
  mo: 'Missouri',
  mt: 'Montana',
  ne: 'Nebraska',
  nv: 'Nevada',
  nh: 'New Hampshire',
  nj: 'New Jersey',
  nm: 'New Mexico',
  ny: 'New York',
  nc: 'North Carolina',
  nd: 'North Dakota',
  oh: 'Ohio',
  ok: 'Oklahoma',
  or: 'Oregon',
  pa: 'Pennsylvania',
  ri: 'Rhode Island',
  sc: 'South Carolina',
  sd: 'South Dakota',
  tn: 'Tennessee',
  tx: 'Texas',
  ut: 'Utah',
  vt: 'Vermont',
  va: 'Virginia',
  wa: 'Washington',
  wv: 'West Virginia',
  wi: 'Wisconsin',
  wy: 'Wyoming',
  // Territories
  dc: 'District of Columbia',
  pr: 'Puerto Rico',
} as const;

export type JurisdictionCode = keyof typeof US_JURISDICTIONS;

// API Response Types
export interface OpenStatesBill {
  id: string;
  identifier: string;
  title: string;
  classification: string[];
  subject: string[];
  abstracts: { abstract: string; note: string }[];
  from_organization: {
    id: string;
    name: string;
    classification: string;
  };
  legislative_session: {
    identifier: string;
    jurisdiction: {
      id: string;
      name: string;
      classification: string;
    };
  };
  latest_action_date: string;
  latest_action_description: string;
  first_action_date: string;
  created_at: string;
  updated_at: string;
  openstates_url: string;
  sponsors: OpenStatesSponsor[];
  actions: OpenStatesAction[];
  votes: OpenStatesVote[];
  sources: { url: string; note: string }[];
  versions: OpenStatesBillVersion[];
  documents: OpenStatesBillDocument[];
}

export interface OpenStatesSponsor {
  id: string;
  name: string;
  entity_type: string;
  organization_id?: string;
  person_id?: string;
  primary: boolean;
  classification: string;
}

export interface OpenStatesAction {
  id: string;
  organization: {
    id: string;
    name: string;
    classification: string;
  };
  description: string;
  date: string;
  classification: string[];
  order: number;
}

export interface OpenStatesVote {
  id: string;
  identifier: string;
  motion_text: string;
  start_date: string;
  result: string;
  organization: {
    id: string;
    name: string;
    classification: string;
  };
  counts: { option: string; value: number }[];
  votes: { option: string; voter_name: string; voter_id: string }[];
}

export interface OpenStatesBillVersion {
  note: string;
  date: string;
  links: { url: string; media_type: string }[];
}

export interface OpenStatesBillDocument {
  note: string;
  date: string;
  links: { url: string; media_type: string }[];
}

export interface OpenStatesPerson {
  id: string;
  name: string;
  party: string;
  current_role: {
    title: string;
    org_classification: string;
    district: string;
    division_id: string;
  } | null;
  jurisdiction: {
    id: string;
    name: string;
    classification: string;
  };
  given_name: string;
  family_name: string;
  image: string;
  email: string;
  openstates_url: string;
  created_at: string;
  updated_at: string;
}

export interface OpenStatesSearchParams {
  jurisdiction?: JurisdictionCode;
  session?: string;
  chamber?: 'upper' | 'lower';
  classification?: string;
  subject?: string;
  updated_since?: string;
  created_since?: string;
  action_since?: string;
  q?: string; // Full-text search
  page?: number;
  per_page?: number;
}

export interface OpenStatesSearchResponse<T> {
  results: T[];
  pagination: {
    per_page: number;
    page: number;
    max_page: number;
    total_items: number;
  };
}

class OpenStatesService {
  private apiKey: string | null = null;
  private requestCount: number = 0;
  private lastRequestTime: number = 0;

  constructor() {
    // Try to load API key from environment or localStorage
    if (typeof window !== 'undefined') {
      this.apiKey = localStorage.getItem('openstates_api_key');
    } else if (typeof process !== 'undefined') {
      this.apiKey = process.env.OPENSTATES_API_KEY || null;
    }
  }

  /**
   * Set API key (required for all requests)
   */
  setApiKey(key: string): void {
    this.apiKey = key;
    if (typeof window !== 'undefined') {
      localStorage.setItem('openstates_api_key', key);
    }
  }

  /**
   * Check if API key is configured
   */
  hasApiKey(): boolean {
    return !!this.apiKey;
  }

  /**
   * Get usage stats
   */
  getUsageStats(): { requestCount: number; hasApiKey: boolean } {
    return {
      requestCount: this.requestCount,
      hasApiKey: this.hasApiKey(),
    };
  }

  private async fetch<T>(endpoint: string, params?: Record<string, string | number | undefined>): Promise<T> {
    if (!this.apiKey) {
      throw new Error('Open States API key required. Get one at https://open.pluralpolicy.com/accounts/profile/');
    }

    const url = new URL(`${OPENSTATES_API_BASE}${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    // Rate limiting - simple delay between requests
    const now = Date.now();
    if (now - this.lastRequestTime < 100) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    this.lastRequestTime = Date.now();
    this.requestCount++;

    const response = await fetch(url.toString(), {
      headers: {
        'X-API-KEY': this.apiKey,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid Open States API key');
      }
      if (response.status === 429) {
        throw new Error('Open States rate limit exceeded');
      }
      throw new Error(`Open States API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // ==========================================
  // BILLS
  // ==========================================

  /**
   * Search for bills across states
   */
  async searchBills(params: OpenStatesSearchParams): Promise<OpenStatesSearchResponse<OpenStatesBill>> {
    const queryParams: Record<string, string | number | undefined> = {
      page: params.page || 1,
      per_page: params.per_page || 20,
    };

    if (params.jurisdiction) {queryParams.jurisdiction = params.jurisdiction;}
    if (params.session) {queryParams.session = params.session;}
    if (params.chamber) {queryParams.chamber = params.chamber;}
    if (params.classification) {queryParams.classification = params.classification;}
    if (params.subject) {queryParams.subject = params.subject;}
    if (params.updated_since) {queryParams.updated_since = params.updated_since;}
    if (params.created_since) {queryParams.created_since = params.created_since;}
    if (params.action_since) {queryParams.action_since = params.action_since;}
    if (params.q) {queryParams.q = params.q;}

    return this.fetch<OpenStatesSearchResponse<OpenStatesBill>>('/bills', queryParams);
  }

  /**
   * Get a specific bill by ID
   */
  async getBill(billId: string): Promise<OpenStatesBill> {
    return this.fetch<OpenStatesBill>(`/bills/${encodeURIComponent(billId)}`);
  }

  /**
   * Search bills by keyword in a specific state
   */
  async searchStateBills(
    jurisdiction: JurisdictionCode,
    query: string,
    options?: { session?: string; page?: number; perPage?: number }
  ): Promise<OpenStatesSearchResponse<OpenStatesBill>> {
    return this.searchBills({
      jurisdiction,
      q: query,
      session: options?.session,
      page: options?.page,
      per_page: options?.perPage,
    });
  }

  /**
   * Get recent bills in a state
   */
  async getRecentBills(
    jurisdiction: JurisdictionCode,
    options?: { days?: number; page?: number; perPage?: number }
  ): Promise<OpenStatesSearchResponse<OpenStatesBill>> {
    const days = options?.days || 7;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    return this.searchBills({
      jurisdiction,
      action_since: since,
      page: options?.page,
      per_page: options?.perPage,
    });
  }

  // ==========================================
  // LEGISLATORS
  // ==========================================

  /**
   * Search for legislators
   */
  async searchPeople(params: {
    jurisdiction?: JurisdictionCode;
    name?: string;
    party?: string;
    chamber?: 'upper' | 'lower';
    district?: string;
    page?: number;
    per_page?: number;
  }): Promise<OpenStatesSearchResponse<OpenStatesPerson>> {
    const queryParams: Record<string, string | number | undefined> = {
      page: params.page || 1,
      per_page: params.per_page || 20,
    };

    if (params.jurisdiction) {queryParams.jurisdiction = params.jurisdiction;}
    if (params.name) {queryParams.name = params.name;}
    if (params.party) {queryParams.party = params.party;}
    if (params.chamber) {queryParams.org_classification = params.chamber;}
    if (params.district) {queryParams.district = params.district;}

    return this.fetch<OpenStatesSearchResponse<OpenStatesPerson>>('/people', queryParams);
  }

  /**
   * Get a specific legislator by ID
   */
  async getPerson(personId: string): Promise<OpenStatesPerson> {
    return this.fetch<OpenStatesPerson>(`/people/${encodeURIComponent(personId)}`);
  }

  /**
   * Get legislators for a state
   */
  async getStateLegislators(
    jurisdiction: JurisdictionCode,
    options?: { chamber?: 'upper' | 'lower'; party?: string; page?: number; perPage?: number }
  ): Promise<OpenStatesSearchResponse<OpenStatesPerson>> {
    return this.searchPeople({
      jurisdiction,
      chamber: options?.chamber,
      party: options?.party,
      page: options?.page,
      per_page: options?.perPage,
    });
  }

  // ==========================================
  // JURISDICTIONS
  // ==========================================

  /**
   * Get list of all jurisdictions
   */
  async getJurisdictions(): Promise<{ id: string; name: string; classification: string }[]> {
    const response = await this.fetch<{ results: { id: string; name: string; classification: string }[] }>('/jurisdictions');
    return response.results;
  }

  /**
   * Get jurisdiction details
   */
  async getJurisdiction(jurisdictionId: string): Promise<{
    id: string;
    name: string;
    classification: string;
    division_id: string;
    url: string;
    legislative_sessions: { identifier: string; name: string; start_date: string; end_date: string }[];
  }> {
    return this.fetch(`/jurisdictions/${encodeURIComponent(jurisdictionId)}`);
  }

  // ==========================================
  // SPECIALIZED SEARCHES
  // ==========================================

  /**
   * Search for employment-related bills
   */
  async searchEmploymentBills(
    jurisdiction?: JurisdictionCode,
    options?: { page?: number; perPage?: number }
  ): Promise<OpenStatesSearchResponse<OpenStatesBill>> {
    return this.searchBills({
      jurisdiction,
      q: 'employment OR labor OR wage OR worker OR discrimination',
      page: options?.page,
      per_page: options?.perPage,
    });
  }

  /**
   * Search for trade secret / IP bills
   */
  async searchIPBills(
    jurisdiction?: JurisdictionCode,
    options?: { page?: number; perPage?: number }
  ): Promise<OpenStatesSearchResponse<OpenStatesBill>> {
    return this.searchBills({
      jurisdiction,
      q: '"trade secret" OR "intellectual property" OR patent OR copyright OR trademark',
      page: options?.page,
      per_page: options?.perPage,
    });
  }

  /**
   * Search for environmental bills
   */
  async searchEnvironmentalBills(
    jurisdiction?: JurisdictionCode,
    options?: { page?: number; perPage?: number }
  ): Promise<OpenStatesSearchResponse<OpenStatesBill>> {
    return this.searchBills({
      jurisdiction,
      q: 'environment OR pollution OR climate OR emissions OR EPA',
      page: options?.page,
      per_page: options?.perPage,
    });
  }

  /**
   * Search for healthcare bills
   */
  async searchHealthcareBills(
    jurisdiction?: JurisdictionCode,
    options?: { page?: number; perPage?: number }
  ): Promise<OpenStatesSearchResponse<OpenStatesBill>> {
    return this.searchBills({
      jurisdiction,
      q: 'healthcare OR health OR medical OR hospital OR insurance',
      page: options?.page,
      per_page: options?.perPage,
    });
  }

  // ==========================================
  // FORMATTING HELPERS
  // ==========================================

  /**
   * Format bill for display
   */
  formatBillForDisplay(bill: OpenStatesBill): string {
    const state = bill.legislative_session.jurisdiction.name;
    const session = bill.legislative_session.identifier;
    const status = bill.latest_action_description || 'No recent action';
    
    return `${bill.identifier} (${state} ${session}): ${bill.title}\nStatus: ${status}`;
  }

  /**
   * Get bill summary for agent context
   */
  getBillSummary(bill: OpenStatesBill): {
    identifier: string;
    title: string;
    state: string;
    session: string;
    status: string;
    lastAction: string;
    sponsors: string[];
    url: string;
  } {
    return {
      identifier: bill.identifier,
      title: bill.title,
      state: bill.legislative_session.jurisdiction.name,
      session: bill.legislative_session.identifier,
      status: bill.classification.join(', '),
      lastAction: bill.latest_action_description || 'Unknown',
      sponsors: bill.sponsors.filter(s => s.primary).map(s => s.name),
      url: bill.openstates_url,
    };
  }

  /**
   * Format state legislation context for agents
   */
  formatForAgentContext(bills: OpenStatesBill[]): string {
    if (bills.length === 0) {return 'No relevant state legislation found.';}

    return bills.map(bill => {
      const summary = this.getBillSummary(bill);
      return `**${summary.identifier}** (${summary.state})
Title: ${summary.title}
Status: ${summary.status}
Last Action: ${summary.lastAction}
Sponsors: ${summary.sponsors.join(', ') || 'None listed'}
URL: ${summary.url}`;
    }).join('\n\n---\n\n');
  }
}

// Singleton instance
export const openStatesService = new OpenStatesService();

export default openStatesService;
