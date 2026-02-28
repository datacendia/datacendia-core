// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * SEC EDGAR API INTEGRATION
 * Corporate filings, contracts, and disclosure documents
 * 
 * API Docs: https://www.sec.gov/developer
 * Coverage: All public company filings (10-K, 10-Q, 8-K, contracts, etc.)
 * Rate Limit: 10 requests/second, no authentication required
 */

const SEC_EDGAR_API_BASE = 'https://data.sec.gov';
const SEC_EFTS_BASE = 'https://efts.sec.gov/LATEST/search-index';

// Common SEC filing types
export type FilingType = 
  | '10-K' | '10-K/A'     // Annual reports
  | '10-Q' | '10-Q/A'     // Quarterly reports
  | '8-K' | '8-K/A'       // Current reports (material events)
  | 'DEF 14A' | 'DEFM14A' // Proxy statements
  | 'S-1' | 'S-1/A'       // IPO registration
  | 'S-4' | 'S-4/A'       // M&A registration
  | '4'                   // Insider trading
  | '13F-HR'              // Institutional holdings
  | 'SC 13D' | 'SC 13G'   // Beneficial ownership
  | '424B'                // Prospectus
  | 'CORRESP'             // SEC correspondence
  | 'EX-10'               // Material contracts (exhibit)
  | 'EX-21'               // Subsidiaries list
  | 'EX-99';              // Press releases

export interface SECCompany {
  cik: string;
  name: string;
  ticker?: string;
  exchange?: string;
  sic?: string;
  sicDescription?: string;
  stateOfIncorporation?: string;
  fiscalYearEnd?: string;
}

export interface SECFiling {
  accessionNumber: string;
  filingDate: string;
  reportDate?: string;
  form: string;
  primaryDocument: string;
  primaryDocDescription: string;
  items?: string;
  size: number;
  isXBRL: boolean;
  isInlineXBRL: boolean;
  fileNumber?: string;
  filmNumber?: string;
  acceptanceDateTime: string;
}

export interface SECFilingDocument {
  sequence: string;
  description: string;
  documentUrl: string;
  type: string;
  size: number;
}

export interface SECSearchResult {
  cik: string;
  companyName: string;
  ticker?: string;
  filings: SECFiling[];
}

export interface FullTextSearchResult {
  id: string;
  cik: string;
  companyName: string;
  formType: string;
  filedAt: string;
  periodOfReport?: string;
  snippet: string;
  documentUrl: string;
}

class SECEdgarService {
  private requestQueue: Promise<void> = Promise.resolve();
  private lastRequestTime: number = 0;
  private MIN_REQUEST_INTERVAL = 100; // 10 requests/second max

  private async throttledFetch<T>(url: string): Promise<T> {
    // Ensure we don't exceed rate limit
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.MIN_REQUEST_INTERVAL) {
      await new Promise(resolve => setTimeout(resolve, this.MIN_REQUEST_INTERVAL - timeSinceLastRequest));
    }
    this.lastRequestTime = Date.now();

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Datacendia Legal Research contact@datacendia.com',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`SEC EDGAR API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Look up company by CIK, ticker, or name
   */
  async lookupCompany(query: string): Promise<SECCompany | null> {
    // Try to find by ticker first
    const tickerUrl = `${SEC_EDGAR_API_BASE}/submissions/CIK${query.padStart(10, '0')}.json`;
    
    try {
      const data = await this.throttledFetch<{
        cik: string;
        name: string;
        tickers: string[];
        exchanges: string[];
        sic: string;
        sicDescription: string;
        stateOfIncorporation: string;
        fiscalYearEnd: string;
      }>(tickerUrl);

      return {
        cik: data.cik,
        name: data.name,
        ticker: data.tickers?.[0],
        exchange: data.exchanges?.[0],
        sic: data.sic,
        sicDescription: data.sicDescription,
        stateOfIncorporation: data.stateOfIncorporation,
        fiscalYearEnd: data.fiscalYearEnd,
      };
    } catch {
      return null;
    }
  }

  /**
   * Get company filings by CIK
   */
  async getCompanyFilings(cik: string, options?: {
    form?: FilingType;
    limit?: number;
  }): Promise<SECFiling[]> {
    const paddedCik = cik.replace(/^0+/, '').padStart(10, '0');
    const url = `${SEC_EDGAR_API_BASE}/submissions/CIK${paddedCik}.json`;

    const data = await this.throttledFetch<{
      filings: {
        recent: {
          accessionNumber: string[];
          filingDate: string[];
          reportDate: string[];
          form: string[];
          primaryDocument: string[];
          primaryDocDescription: string[];
          items: string[];
          size: number[];
          isXBRL: number[];
          isInlineXBRL: number[];
          fileNumber: string[];
          filmNumber: string[];
          acceptanceDateTime: string[];
        };
      };
    }>(url);

    const recent = data.filings.recent;
    const filings: SECFiling[] = [];
    const limit = options?.limit || 50;

    for (let i = 0; i < Math.min(recent.accessionNumber.length, limit); i++) {
      if (options?.form && recent.form[i] !== options.form) {continue;}

      filings.push({
        accessionNumber: recent.accessionNumber[i],
        filingDate: recent.filingDate[i],
        reportDate: recent.reportDate[i],
        form: recent.form[i],
        primaryDocument: recent.primaryDocument[i],
        primaryDocDescription: recent.primaryDocDescription[i],
        items: recent.items[i],
        size: recent.size[i],
        isXBRL: recent.isXBRL[i] === 1,
        isInlineXBRL: recent.isInlineXBRL[i] === 1,
        fileNumber: recent.fileNumber[i],
        filmNumber: recent.filmNumber[i],
        acceptanceDateTime: recent.acceptanceDateTime[i],
      });

      if (filings.length >= limit) {break;}
    }

    return filings;
  }

  /**
   * Get filing documents (exhibits, contracts, etc.)
   */
  async getFilingDocuments(cik: string, accessionNumber: string): Promise<SECFilingDocument[]> {
    const paddedCik = cik.replace(/^0+/, '').padStart(10, '0');
    const cleanAccession = accessionNumber.replace(/-/g, '');
    const url = `${SEC_EDGAR_API_BASE}/Archives/edgar/data/${paddedCik}/${cleanAccession}/index.json`;

    const data = await this.throttledFetch<{
      directory: {
        item: { name: string; type: string; size: string; description?: string }[];
      };
    }>(url);

    return data.directory.item
      .filter(item => item.type === 'file')
      .map(item => ({
        sequence: item.name,
        description: item.description || item.name,
        documentUrl: `https://www.sec.gov/Archives/edgar/data/${paddedCik}/${cleanAccession}/${item.name}`,
        type: item.name.split('.').pop() || 'unknown',
        size: parseInt(item.size) || 0,
      }));
  }

  /**
   * Get material contracts from a filing (EX-10 exhibits)
   */
  async getMaterialContracts(cik: string, accessionNumber: string): Promise<SECFilingDocument[]> {
    const docs = await this.getFilingDocuments(cik, accessionNumber);
    return docs.filter(doc => 
      doc.description.toLowerCase().includes('ex-10') ||
      doc.description.toLowerCase().includes('exhibit 10') ||
      doc.description.toLowerCase().includes('material contract') ||
      doc.description.toLowerCase().includes('agreement')
    );
  }

  /**
   * Search filings by full text (using SEC EFTS)
   */
  async fullTextSearch(query: string, options?: {
    forms?: FilingType[];
    dateFrom?: string;
    dateTo?: string;
    limit?: number;
  }): Promise<FullTextSearchResult[]> {
    const params = new URLSearchParams({
      q: query,
      dateRange: 'custom',
      startdt: options?.dateFrom || '2020-01-01',
      enddt: options?.dateTo || new Date().toISOString().split('T')[0],
    });

    if (options?.forms) {
      params.append('forms', options.forms.join(','));
    }

    // Note: SEC full-text search requires different approach
    // This is a simplified version - full implementation would use their search API
    const url = `https://efts.sec.gov/LATEST/search-index?${params}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Datacendia Legal Research contact@datacendia.com',
        },
      });
      
      if (!response.ok) {
        // Fall back to basic search
        return [];
      }
      
      const data = await response.json();
      return data.hits?.hits?.map((hit: {
        _id: string;
        _source: {
          ciks: string[];
          display_names: string[];
          form: string;
          file_date: string;
          period_of_report?: string;
        };
        highlight?: { content?: string[] };
      }) => ({
        id: hit._id,
        cik: hit._source.ciks?.[0] || '',
        companyName: hit._source.display_names?.[0] || '',
        formType: hit._source.form,
        filedAt: hit._source.file_date,
        periodOfReport: hit._source.period_of_report,
        snippet: hit.highlight?.content?.[0] || '',
        documentUrl: `https://www.sec.gov/Archives/edgar/data/${hit._source.ciks?.[0]}/${hit._id}`,
      })) || [];
    } catch {
      return [];
    }
  }

  /**
   * Get recent 8-K filings (material events)
   */
  async getRecent8Ks(days: number = 7): Promise<{ company: string; cik: string; filing: SECFiling }[]> {
    // This would require iterating through recent filings
    // For now, return empty - would need to use RSS feed or bulk data
    return [];
  }

  /**
   * Search for M&A related filings
   */
  async searchMAFilings(companyName?: string): Promise<FullTextSearchResult[]> {
    const query = companyName 
      ? `"${companyName}" AND (merger OR acquisition OR "business combination")`
      : 'merger OR acquisition OR "business combination"';
    
    return this.fullTextSearch(query, {
      forms: ['8-K', 'S-4', 'DEFM14A'],
      limit: 20,
    });
  }

  /**
   * Search for employment agreements
   */
  async searchEmploymentAgreements(companyName?: string): Promise<FullTextSearchResult[]> {
    const query = companyName
      ? `"${companyName}" AND ("employment agreement" OR "executive compensation" OR "severance")`
      : '"employment agreement" OR "executive compensation" OR "severance agreement"';
    
    return this.fullTextSearch(query, {
      forms: ['10-K', '8-K', 'DEF 14A'],
      limit: 20,
    });
  }

  /**
   * Get filing URL
   */
  getFilingUrl(cik: string, accessionNumber: string, document?: string): string {
    const paddedCik = cik.replace(/^0+/, '').padStart(10, '0');
    const cleanAccession = accessionNumber.replace(/-/g, '');
    
    if (document) {
      return `https://www.sec.gov/Archives/edgar/data/${paddedCik}/${cleanAccession}/${document}`;
    }
    return `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${cik}&type=&dateb=&owner=include&count=40`;
  }

  /**
   * Format filing for display
   */
  formatFilingForDisplay(filing: SECFiling, companyName?: string): string {
    return `**${filing.form}** - ${companyName || 'Unknown Company'}
Filed: ${filing.filingDate}
${filing.reportDate ? `Report Date: ${filing.reportDate}` : ''}
Description: ${filing.primaryDocDescription}
${filing.items ? `Items: ${filing.items}` : ''}
Accession: ${filing.accessionNumber}`;
  }

  /**
   * Format for agent context
   */
  formatForAgentContext(filings: SECFiling[], companyName?: string): string {
    if (filings.length === 0) {
      return 'No SEC filings found.';
    }

    return filings.map(f => this.formatFilingForDisplay(f, companyName)).join('\n\n---\n\n');
  }
}

// Common company CIKs for demos
export const NOTABLE_COMPANIES = {
  apple: { cik: '320193', ticker: 'AAPL', name: 'Apple Inc.' },
  google: { cik: '1652044', ticker: 'GOOGL', name: 'Alphabet Inc.' },
  microsoft: { cik: '789019', ticker: 'MSFT', name: 'Microsoft Corporation' },
  amazon: { cik: '1018724', ticker: 'AMZN', name: 'Amazon.com Inc.' },
  tesla: { cik: '1318605', ticker: 'TSLA', name: 'Tesla Inc.' },
  meta: { cik: '1326801', ticker: 'META', name: 'Meta Platforms Inc.' },
  nvidia: { cik: '1045810', ticker: 'NVDA', name: 'NVIDIA Corporation' },
  jpmorgan: { cik: '19617', ticker: 'JPM', name: 'JPMorgan Chase & Co.' },
  berkshire: { cik: '1067983', ticker: 'BRK-A', name: 'Berkshire Hathaway Inc.' },
  uber: { cik: '1543151', ticker: 'UBER', name: 'Uber Technologies Inc.' },
  waymo: { cik: '1652044', ticker: 'GOOGL', name: 'Waymo (Alphabet subsidiary)' },
};

// Singleton instance
export const secEdgarService = new SECEdgarService();

export default secEdgarService;
