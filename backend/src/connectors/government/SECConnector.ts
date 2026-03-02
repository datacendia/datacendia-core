// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * =============================================================================
 * SEC EDGAR CONNECTOR - Securities and Exchange Commission
 * =============================================================================
 * Production connector for SEC EDGAR database providing:
 * - Company filings (10-K, 10-Q, 8-K, etc.)
 * - Insider transactions (Form 3, 4, 5)
 * - Institutional holdings (13F)
 * - Full-text search across filings
 * - Company facts and submissions
 * 
 * API Documentation: https://www.sec.gov/developer
 */

import { HttpConnector, HttpConnectorConfig } from '../core/HttpConnector.js';
import { ConnectorMetadata } from '../BaseConnector.js';

// =============================================================================
// TYPES
// =============================================================================

export interface SECCompany {
  cik: string;
  entityType: string;
  sic: string;
  sicDescription: string;
  insiderTransactionForOwnerExists: number;
  insiderTransactionForIssuerExists: number;
  name: string;
  tickers: string[];
  exchanges: string[];
  ein: string;
  description: string;
  website: string;
  investorWebsite: string;
  category: string;
  fiscalYearEnd: string;
  stateOfIncorporation: string;
  stateOfIncorporationDescription: string;
  addresses: {
    mailing: SECAddress;
    business: SECAddress;
  };
  phone: string;
  flags: string;
  formerNames: Array<{ name: string; from: string; to: string }>;
  filings: {
    recent: SECFilingRecent;
    files: Array<{ name: string; filingCount: number; filingFrom: string; filingTo: string }>;
  };
}

export interface SECAddress {
  street1: string;
  street2: string | null;
  city: string;
  stateOrCountry: string;
  zipCode: string;
  stateOrCountryDescription: string;
}

export interface SECFilingRecent {
  accessionNumber: string[];
  filingDate: string[];
  reportDate: string[];
  acceptanceDateTime: string[];
  act: string[];
  form: string[];
  fileNumber: string[];
  filmNumber: string[];
  items: string[];
  size: number[];
  isXBRL: number[];
  isInlineXBRL: number[];
  primaryDocument: string[];
  primaryDocDescription: string[];
}

export interface SECFiling {
  accessionNumber: string;
  filingDate: string;
  reportDate: string;
  acceptanceDateTime: string;
  form: string;
  fileNumber: string;
  size: number;
  isXBRL: boolean;
  primaryDocument: string;
  primaryDocDescription: string;
  documentUrl: string;
}

export interface SECCompanyFacts {
  cik: number;
  entityName: string;
  facts: {
    'us-gaap'?: Record<string, SECFactConcept>;
    'dei'?: Record<string, SECFactConcept>;
    'invest'?: Record<string, SECFactConcept>;
  };
}

export interface SECFactConcept {
  label: string;
  description: string;
  units: Record<string, Array<{
    end: string;
    val: number;
    accn: string;
    fy: number;
    fp: string;
    form: string;
    filed: string;
    frame?: string;
  }>>;
}

export interface SECInsiderTransaction {
  acquisitionOrDisposition: string;
  transactionDate: string;
  transactionCode: string;
  equitySwapInvolved: boolean;
  transactionShares: number;
  transactionPricePerShare: number;
  transactionAcquiredDisposedCode: string;
  sharesOwnedFollowingTransaction: number;
  directOrIndirectOwnership: string;
  natureOfOwnership: string;
}

export interface SEC13FHolding {
  nameOfIssuer: string;
  titleOfClass: string;
  cusip: string;
  value: number;
  shrsOrPrnAmt: number;
  shrsOrPrnAmtType: string;
  putCall: string | null;
  investmentDiscretion: string;
  otherManager: string | null;
  votingAuthoritySole: number;
  votingAuthorityShared: number;
  votingAuthorityNone: number;
}

export interface SECSearchResult {
  id: string;
  score: number;
  _source: {
    ciks: string[];
    display_names: string[];
    file_date: string;
    file_num: string[];
    film_num: string[];
    form: string;
    sequence: number;
    xsl: string | null;
    adsh: string;
  };
}

// =============================================================================
// SEC CONNECTOR
// =============================================================================

export class SECEdgarConnector extends HttpConnector {
  private static readonly BASE_URL = 'https://data.sec.gov';
  private static readonly EFTS_URL = 'https://efts.sec.gov/LATEST/search-index';
  private static readonly METADATA: ConnectorMetadata = {
    id: 'sec-edgar',
    name: 'SEC EDGAR',
    description: 'Corporate filings, financial statements, insider trading from SEC EDGAR',
    vertical: 'government',
    category: 'financial-regulatory',
    provider: 'SEC',
    region: 'US',
    dataTypes: ['10-K', '10-Q', '8-K', 'insider-transactions', 'proxy-statements', '13F-holdings'],
    updateFrequency: 'real-time',
    documentationUrl: 'https://www.sec.gov/developer',
    apiVersion: 'v1',
    requiredCredentials: ['user_agent'],
    complianceFrameworks: ['FedRAMP', 'SOX'],
  };

  constructor(config: Partial<HttpConnectorConfig> = {}) {
    const userAgent = config.credentials?.userAgent || 'Datacendia/1.0 (enterprise@datacendia.com)';
    
    super({
      id: 'sec-edgar',
      name: 'SEC EDGAR',
      description: 'SEC EDGAR Database',
      vertical: 'government',
      category: 'financial-regulatory',
      baseUrl: SECEdgarConnector.BASE_URL,
      authType: 'none',
      headers: {
        'User-Agent': userAgent,
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip, deflate',
      },
      rateLimit: {
        requests: 10, // SEC recommends max 10 requests per second
        windowMs: 1000,
      },
      timeout: 30000,
      retryAttempts: 3,
      ...config,
    });
  }

  getMetadata(): ConnectorMetadata {
    return SECEdgarConnector.METADATA;
  }

  protected async performHealthCheck(): Promise<void> {
    // Check if we can access the company tickers file
    await this.request('GET', '/submissions/CIK0000320193.json'); // Apple Inc
  }

  // ---------------------------------------------------------------------------
  // UTILITY METHODS
  // ---------------------------------------------------------------------------

  private formatCik(cik: string | number): string {
    return String(cik).padStart(10, '0');
  }

  private parseCik(cik: string): string {
    return cik.replace(/^CIK/, '').replace(/^0+/, '');
  }

  // ---------------------------------------------------------------------------
  // COMPANY INFORMATION
  // ---------------------------------------------------------------------------

  /**
   * Get company submissions and filings by CIK
   */
  async getCompanySubmissions(cik: string | number): Promise<SECCompany> {
    const formattedCik = this.formatCik(cik);
    return this.request<SECCompany>('GET', `/submissions/CIK${formattedCik}.json`);
  }

  /**
   * Get company by ticker symbol
   */
  async getCompanyByTicker(ticker: string): Promise<SECCompany | null> {
    const tickers = await this.getCompanyTickers();
    const company = Object.values(tickers).find(
      (c: any) => c.ticker?.toUpperCase() === ticker.toUpperCase()
    );
    
    if (!company) return null;
    return this.getCompanySubmissions((company as any).cik_str);
  }

  /**
   * Get all company tickers
   */
  async getCompanyTickers(): Promise<Record<string, { cik_str: string; ticker: string; title: string }>> {
    return this.request('GET', '/company_tickers.json');
  }

  /**
   * Search companies by name
   */
  async searchCompanies(query: string): Promise<Array<{ cik: string; name: string; ticker?: string }>> {
    const tickers = await this.getCompanyTickers();
    const results: Array<{ cik: string; name: string; ticker?: string }> = [];
    const queryLower = query.toLowerCase();

    for (const company of Object.values(tickers)) {
      const c = company as { cik_str: string; ticker: string; title: string };
      if (c.title.toLowerCase().includes(queryLower) || c.ticker?.toLowerCase().includes(queryLower)) {
        results.push({
          cik: c.cik_str,
          name: c.title,
          ticker: c.ticker,
        });
      }
      if (results.length >= 50) break;
    }

    return results;
  }

  // ---------------------------------------------------------------------------
  // FILINGS
  // ---------------------------------------------------------------------------

  /**
   * Get recent filings for a company
   */
  async getRecentFilings(cik: string | number, options?: {
    forms?: string[];
    limit?: number;
  }): Promise<SECFiling[]> {
    const company = await this.getCompanySubmissions(cik);
    const recent = company.filings.recent;
    const filings: SECFiling[] = [];
    const formattedCik = this.formatCik(cik);

    for (let i = 0; i < recent.accessionNumber.length; i++) {
      if (options?.forms && !options.forms.includes(recent.form[i])) {
        continue;
      }

      const accessionNumber = recent.accessionNumber[i].replace(/-/g, '');
      
      filings.push({
        accessionNumber: recent.accessionNumber[i],
        filingDate: recent.filingDate[i],
        reportDate: recent.reportDate[i],
        acceptanceDateTime: recent.acceptanceDateTime[i],
        form: recent.form[i],
        fileNumber: recent.fileNumber[i],
        size: recent.size[i],
        isXBRL: recent.isXBRL[i] === 1,
        primaryDocument: recent.primaryDocument[i],
        primaryDocDescription: recent.primaryDocDescription[i],
        documentUrl: `https://www.sec.gov/Archives/edgar/data/${this.parseCik(formattedCik)}/${accessionNumber}/${recent.primaryDocument[i]}`,
      });

      if (options?.limit && filings.length >= options.limit) break;
    }

    return filings;
  }

  /**
   * Get 10-K annual reports
   */
  async get10Ks(cik: string | number, limit = 10): Promise<SECFiling[]> {
    return this.getRecentFilings(cik, { forms: ['10-K', '10-K/A'], limit });
  }

  /**
   * Get 10-Q quarterly reports
   */
  async get10Qs(cik: string | number, limit = 20): Promise<SECFiling[]> {
    return this.getRecentFilings(cik, { forms: ['10-Q', '10-Q/A'], limit });
  }

  /**
   * Get 8-K current reports
   */
  async get8Ks(cik: string | number, limit = 50): Promise<SECFiling[]> {
    return this.getRecentFilings(cik, { forms: ['8-K', '8-K/A'], limit });
  }

  /**
   * Get proxy statements
   */
  async getProxyStatements(cik: string | number, limit = 10): Promise<SECFiling[]> {
    return this.getRecentFilings(cik, { forms: ['DEF 14A', 'DEFA14A', 'PRE 14A'], limit });
  }

  // ---------------------------------------------------------------------------
  // COMPANY FACTS (XBRL DATA)
  // ---------------------------------------------------------------------------

  /**
   * Get company facts (structured XBRL data)
   */
  async getCompanyFacts(cik: string | number): Promise<SECCompanyFacts> {
    const formattedCik = this.formatCik(cik);
    return this.request<SECCompanyFacts>('GET', `/api/xbrl/companyfacts/CIK${formattedCik}.json`);
  }

  /**
   * Get specific concept data (e.g., Revenue, NetIncome)
   */
  async getConceptData(cik: string | number, taxonomy: string, concept: string): Promise<SECFactConcept> {
    const formattedCik = this.formatCik(cik);
    return this.request<SECFactConcept>(
      'GET',
      `/api/xbrl/companyconcept/CIK${formattedCik}/${taxonomy}/${concept}.json`
    );
  }

  /**
   * Get revenue history
   */
  async getRevenueHistory(cik: string | number): Promise<Array<{ period: string; value: number; filed: string }>> {
    try {
      const concept = await this.getConceptData(cik, 'us-gaap', 'Revenues');
      const usdData = concept.units['USD'] || [];
      return usdData
        .filter(d => d.form === '10-K' || d.form === '10-Q')
        .map(d => ({ period: d.end, value: d.val, filed: d.filed }))
        .sort((a, b) => b.period.localeCompare(a.period));
    } catch {
      // Try alternative concept names
      try {
        const concept = await this.getConceptData(cik, 'us-gaap', 'RevenueFromContractWithCustomerExcludingAssessedTax');
        const usdData = concept.units['USD'] || [];
        return usdData
          .filter(d => d.form === '10-K' || d.form === '10-Q')
          .map(d => ({ period: d.end, value: d.val, filed: d.filed }))
          .sort((a, b) => b.period.localeCompare(a.period));
      } catch {
        return [];
      }
    }
  }

  /**
   * Get net income history
   */
  async getNetIncomeHistory(cik: string | number): Promise<Array<{ period: string; value: number; filed: string }>> {
    try {
      const concept = await this.getConceptData(cik, 'us-gaap', 'NetIncomeLoss');
      const usdData = concept.units['USD'] || [];
      return usdData
        .filter(d => d.form === '10-K' || d.form === '10-Q')
        .map(d => ({ period: d.end, value: d.val, filed: d.filed }))
        .sort((a, b) => b.period.localeCompare(a.period));
    } catch {
      return [];
    }
  }

  /**
   * Get total assets history
   */
  async getAssetsHistory(cik: string | number): Promise<Array<{ period: string; value: number; filed: string }>> {
    try {
      const concept = await this.getConceptData(cik, 'us-gaap', 'Assets');
      const usdData = concept.units['USD'] || [];
      return usdData
        .filter(d => d.form === '10-K' || d.form === '10-Q')
        .map(d => ({ period: d.end, value: d.val, filed: d.filed }))
        .sort((a, b) => b.period.localeCompare(a.period));
    } catch {
      return [];
    }
  }

  // ---------------------------------------------------------------------------
  // INSIDER TRANSACTIONS
  // ---------------------------------------------------------------------------

  /**
   * Get insider transactions (Form 3, 4, 5)
   */
  async getInsiderFilings(cik: string | number, limit = 50): Promise<SECFiling[]> {
    return this.getRecentFilings(cik, { forms: ['3', '4', '5', '3/A', '4/A', '5/A'], limit });
  }

  // ---------------------------------------------------------------------------
  // INSTITUTIONAL HOLDINGS (13F)
  // ---------------------------------------------------------------------------

  /**
   * Get 13F institutional holdings filings
   */
  async get13FFilings(cik: string | number, limit = 10): Promise<SECFiling[]> {
    return this.getRecentFilings(cik, { forms: ['13F-HR', '13F-HR/A'], limit });
  }

  // ---------------------------------------------------------------------------
  // FULL TEXT SEARCH
  // ---------------------------------------------------------------------------

  /**
   * Full-text search across SEC filings
   */
  async searchFilings(query: string, options?: {
    forms?: string[];
    dateStart?: string;
    dateEnd?: string;
    ciks?: string[];
    limit?: number;
  }): Promise<SECSearchResult[]> {
    // Build the search query
    const searchQuery: Record<string, unknown> = {
      q: query,
      dateRange: 'custom',
      startdt: options?.dateStart || '2000-01-01',
      enddt: options?.dateEnd || new Date().toISOString().split('T')[0],
    };

    if (options?.forms) {
      searchQuery.forms = options.forms;
    }
    if (options?.ciks) {
      searchQuery.ciks = options.ciks;
    }

    // Note: The EFTS search requires a different endpoint and may need additional setup
    // This is a simplified version
    const response = await this.request<{ hits: { hits: SECSearchResult[] } }>(
      'GET',
      `${SECEdgarConnector.EFTS_URL}`,
      { params: searchQuery as Record<string, string> }
    );

    const results = response.hits?.hits || [];
    return options?.limit ? results.slice(0, options.limit) : results;
  }

  // ---------------------------------------------------------------------------
  // FRAMES (BULK DATA)
  // ---------------------------------------------------------------------------

  /**
   * Get all companies reporting a specific concept for a period
   */
  async getFrame(taxonomy: string, concept: string, unit: string, period: string): Promise<unknown> {
    return this.request(
      'GET',
      `/api/xbrl/frames/${taxonomy}/${concept}/${unit}/${period}.json`
    );
  }

  // ---------------------------------------------------------------------------
  // DATA FETCH
  // ---------------------------------------------------------------------------

  async fetchData(params?: Record<string, unknown>): Promise<unknown[]> {
    const dataType = (params?.type as string) || 'filings';
    const cik = params?.cik as string;
    const ticker = params?.ticker as string;

    // Get CIK from ticker if needed
    let targetCik = cik;
    if (!targetCik && ticker) {
      const company = await this.getCompanyByTicker(ticker);
      if (!company) throw new Error(`Company not found for ticker: ${ticker}`);
      targetCik = company.cik;
    }

    switch (dataType) {
      case 'company':
        if (!targetCik) throw new Error('CIK or ticker required');
        return [await this.getCompanySubmissions(targetCik)];

      case 'filings':
        if (!targetCik) throw new Error('CIK or ticker required');
        return this.getRecentFilings(targetCik, {
          forms: params?.forms as string[],
          limit: params?.limit as number,
        });

      case '10-K':
        if (!targetCik) throw new Error('CIK or ticker required');
        return this.get10Ks(targetCik, params?.limit as number);

      case '10-Q':
        if (!targetCik) throw new Error('CIK or ticker required');
        return this.get10Qs(targetCik, params?.limit as number);

      case '8-K':
        if (!targetCik) throw new Error('CIK or ticker required');
        return this.get8Ks(targetCik, params?.limit as number);

      case 'insider':
        if (!targetCik) throw new Error('CIK or ticker required');
        return this.getInsiderFilings(targetCik, params?.limit as number);

      case '13F':
        if (!targetCik) throw new Error('CIK or ticker required');
        return this.get13FFilings(targetCik, params?.limit as number);

      case 'revenue':
        if (!targetCik) throw new Error('CIK or ticker required');
        return this.getRevenueHistory(targetCik);

      case 'netincome':
        if (!targetCik) throw new Error('CIK or ticker required');
        return this.getNetIncomeHistory(targetCik);

      case 'search':
        if (!params?.query) throw new Error('Query required for search');
        return this.searchFilings(params.query as string, params as any);

      case 'tickers':
        const tickers = await this.getCompanyTickers();
        return Object.values(tickers);

      default:
        if (targetCik) {
          return this.getRecentFilings(targetCik, { limit: 50 });
        }
        throw new Error('Unknown data type or missing parameters');
    }
  }
}

// Factory function for registration
export function createSECEdgarConnector(config: HttpConnectorConfig): SECEdgarConnector {
  return new SECEdgarConnector(config);
}
