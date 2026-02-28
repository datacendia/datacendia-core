// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * FEDERAL REGISTER API INTEGRATION
 * Daily publication of federal rules, proposed rules, and notices
 * 
 * API Docs: https://www.federalregister.gov/developers/api/v1
 * Coverage: All federal agency actions since 1994
 * Rate Limit: No authentication required, reasonable use
 */

const FEDERAL_REGISTER_API_BASE = 'https://www.federalregister.gov/api/v1';

export type DocumentType = 'RULE' | 'PRORULE' | 'NOTICE' | 'PRESDOCU';

export interface FederalRegisterDocument {
  document_number: string;
  title: string;
  type: DocumentType;
  abstract: string;
  publication_date: string;
  effective_on: string | null;
  agencies: { name: string; id: number; slug: string }[];
  docket_ids: string[];
  citation: string;
  pdf_url: string;
  html_url: string;
  full_text_xml_url: string;
  json_url: string;
  regulation_id_numbers: string[];
  cfr_references: { title: number; part: number }[];
  topics: string[];
  significant: boolean;
  action: string;
  dates: string;
  page_length: number;
  start_page: number;
  end_page: number;
}

export interface FederalRegisterSearchParams {
  term?: string;
  agencies?: string[];
  type?: DocumentType[];
  publication_date_gte?: string;
  publication_date_lte?: string;
  effective_date_gte?: string;
  effective_date_lte?: string;
  cfr_title?: number;
  cfr_part?: number;
  significant?: boolean;
  page?: number;
  per_page?: number;
  order?: 'relevance' | 'newest' | 'oldest' | 'executive_order_number';
}

export interface FederalRegisterSearchResponse {
  count: number;
  total_pages: number;
  results: FederalRegisterDocument[];
}

export interface PublicInspectionDocument {
  document_number: string;
  title: string;
  type: DocumentType;
  agencies: { name: string }[];
  filing_type: string;
  special_filing: boolean;
  pdf_url: string;
  publication_date: string;
}

class FederalRegisterService {
  private cache: Map<string, { data: unknown; timestamp: number }> = new Map();
  private CACHE_TTL = 1000 * 60 * 15; // 15 minutes (data changes daily)

  private async fetch<T>(endpoint: string, params?: Record<string, string | number | boolean | string[]>): Promise<T> {
    const url = new URL(`${FEDERAL_REGISTER_API_BASE}${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => url.searchParams.append(`${key}[]`, v));
          } else {
            url.searchParams.append(key, String(value));
          }
        }
      });
    }

    const response = await fetch(url.toString(), {
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Federal Register API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Search Federal Register documents
   */
  async search(params: FederalRegisterSearchParams): Promise<FederalRegisterSearchResponse> {
    const queryParams: Record<string, string | number | boolean | string[]> = {
      per_page: params.per_page || 20,
      page: params.page || 1,
    };

    if (params.term) {queryParams['conditions[term]'] = params.term;}
    if (params.agencies) {queryParams['conditions[agencies][]'] = params.agencies;}
    if (params.type) {queryParams['conditions[type][]'] = params.type;}
    if (params.publication_date_gte) {queryParams['conditions[publication_date][gte]'] = params.publication_date_gte;}
    if (params.publication_date_lte) {queryParams['conditions[publication_date][lte]'] = params.publication_date_lte;}
    if (params.effective_date_gte) {queryParams['conditions[effective_date][gte]'] = params.effective_date_gte;}
    if (params.effective_date_lte) {queryParams['conditions[effective_date][lte]'] = params.effective_date_lte;}
    if (params.cfr_title) {queryParams['conditions[cfr][title]'] = params.cfr_title;}
    if (params.cfr_part) {queryParams['conditions[cfr][part]'] = params.cfr_part;}
    if (params.significant !== undefined) {queryParams['conditions[significant]'] = params.significant ? '1' : '0';}
    if (params.order) {queryParams.order = params.order;}

    return this.fetch<FederalRegisterSearchResponse>('/documents.json', queryParams);
  }

  /**
   * Get a specific document by number
   */
  async getDocument(documentNumber: string): Promise<FederalRegisterDocument> {
    return this.fetch<FederalRegisterDocument>(`/documents/${documentNumber}.json`);
  }

  /**
   * Get documents published on a specific date
   */
  async getDocumentsByDate(date: string): Promise<FederalRegisterSearchResponse> {
    return this.search({
      publication_date_gte: date,
      publication_date_lte: date,
      per_page: 100,
    });
  }

  /**
   * Get today's documents
   */
  async getTodaysDocuments(): Promise<FederalRegisterSearchResponse> {
    const today = new Date().toISOString().split('T')[0];
    return this.getDocumentsByDate(today);
  }

  /**
   * Get recent final rules
   */
  async getRecentRules(days: number = 7): Promise<FederalRegisterSearchResponse> {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    return this.search({
      type: ['RULE'],
      publication_date_gte: since,
      order: 'newest',
      per_page: 50,
    });
  }

  /**
   * Get recent proposed rules
   */
  async getRecentProposedRules(days: number = 30): Promise<FederalRegisterSearchResponse> {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    return this.search({
      type: ['PRORULE'],
      publication_date_gte: since,
      order: 'newest',
      per_page: 50,
    });
  }

  /**
   * Get significant regulatory actions
   */
  async getSignificantActions(days: number = 30): Promise<FederalRegisterSearchResponse> {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    return this.search({
      significant: true,
      publication_date_gte: since,
      order: 'newest',
      per_page: 50,
    });
  }

  /**
   * Search by agency
   */
  async searchByAgency(agencySlug: string, options?: {
    type?: DocumentType[];
    days?: number;
    limit?: number;
  }): Promise<FederalRegisterSearchResponse> {
    const days = options?.days || 90;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    return this.search({
      agencies: [agencySlug],
      type: options?.type,
      publication_date_gte: since,
      order: 'newest',
      per_page: options?.limit || 20,
    });
  }

  /**
   * Search employment-related rules (DOL, EEOC, NLRB)
   */
  async searchEmploymentRules(query?: string): Promise<FederalRegisterSearchResponse> {
    return this.search({
      term: query || 'employment OR labor OR wage OR discrimination',
      agencies: ['labor-department', 'equal-employment-opportunity-commission', 'national-labor-relations-board'],
      type: ['RULE', 'PRORULE'],
      order: 'newest',
      per_page: 20,
    });
  }

  /**
   * Search environmental rules (EPA)
   */
  async searchEnvironmentalRules(query?: string): Promise<FederalRegisterSearchResponse> {
    return this.search({
      term: query || 'environment OR pollution OR emissions OR climate',
      agencies: ['environmental-protection-agency'],
      type: ['RULE', 'PRORULE'],
      order: 'newest',
      per_page: 20,
    });
  }

  /**
   * Search SEC rules
   */
  async searchSECRules(query?: string): Promise<FederalRegisterSearchResponse> {
    return this.search({
      term: query,
      agencies: ['securities-and-exchange-commission'],
      type: ['RULE', 'PRORULE'],
      order: 'newest',
      per_page: 20,
    });
  }

  /**
   * Get public inspection documents (pre-publication)
   */
  async getPublicInspection(): Promise<{ count: number; results: PublicInspectionDocument[] }> {
    return this.fetch('/public-inspection-documents.json');
  }

  /**
   * Get list of agencies
   */
  async getAgencies(): Promise<{ name: string; slug: string; id: number; short_name: string }[]> {
    const cacheKey = 'agencies';
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL * 4) {
      return cached.data as { name: string; slug: string; id: number; short_name: string }[];
    }

    const response = await this.fetch<{ name: string; slug: string; id: number; short_name: string }[]>('/agencies.json');
    this.cache.set(cacheKey, { data: response, timestamp: Date.now() });
    return response;
  }

  /**
   * Format document for display
   */
  formatDocumentForDisplay(doc: FederalRegisterDocument): string {
    const type = {
      'RULE': 'Final Rule',
      'PRORULE': 'Proposed Rule',
      'NOTICE': 'Notice',
      'PRESDOCU': 'Presidential Document',
    }[doc.type] || doc.type;

    return `**${doc.title}**
Type: ${type}
Agency: ${doc.agencies.map(a => a.name).join(', ')}
Published: ${doc.publication_date}
${doc.effective_on ? `Effective: ${doc.effective_on}` : ''}
Citation: ${doc.citation}
${doc.abstract ? `\nAbstract: ${doc.abstract.substring(0, 300)}...` : ''}
URL: ${doc.html_url}`;
  }

  /**
   * Format search results for agent context
   */
  formatForAgentContext(results: FederalRegisterDocument[]): string {
    if (results.length === 0) {
      return 'No Federal Register documents found.';
    }

    return results.map(doc => this.formatDocumentForDisplay(doc)).join('\n\n---\n\n');
  }
}

// Key federal agencies for legal work
export const KEY_AGENCIES = {
  dol: { slug: 'labor-department', name: 'Department of Labor' },
  eeoc: { slug: 'equal-employment-opportunity-commission', name: 'EEOC' },
  nlrb: { slug: 'national-labor-relations-board', name: 'NLRB' },
  epa: { slug: 'environmental-protection-agency', name: 'EPA' },
  sec: { slug: 'securities-and-exchange-commission', name: 'SEC' },
  ftc: { slug: 'federal-trade-commission', name: 'FTC' },
  fda: { slug: 'food-and-drug-administration', name: 'FDA' },
  osha: { slug: 'occupational-safety-and-health-administration', name: 'OSHA' },
  uspto: { slug: 'patent-and-trademark-office', name: 'USPTO' },
  doj: { slug: 'justice-department', name: 'Department of Justice' },
  hhs: { slug: 'health-and-human-services-department', name: 'HHS' },
  dot: { slug: 'transportation-department', name: 'DOT' },
};

// Singleton instance
export const federalRegisterService = new FederalRegisterService();

export default federalRegisterService;
