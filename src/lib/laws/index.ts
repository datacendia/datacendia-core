// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * STATUTORY LAW INTEGRATION
 * 
 * Federal statutory law sources:
 * 
 * DOWNLOADABLE (with APIs):
 * - eCFR (Code of Federal Regulations) - Full API, XML downloads
 * - Federal Register - API available
 * 
 * DOWNLOADABLE (bulk only):
 * - U.S. Code - XML from House.gov (requires manual download)
 * - Public Laws - From GovInfo
 * 
 * WEB ONLY:
 * - Cornell LII - No bulk download
 * - State statutes - Varies by state
 */

const ECFR_API_BASE = 'https://www.ecfr.gov/api';

export interface CFRTitle {
  number: number;
  name: string;
  chapters: number;
  lastUpdated: string;
}

export interface CFRSection {
  title: number;
  chapter: string;
  part: number;
  section: string;
  heading: string;
  text: string;
  authority: string;
  source: string;
}

export interface CFRSearchResult {
  title: number;
  part: number;
  section: string;
  heading: string;
  snippet: string;
  hierarchy: string[];
}

export interface USCodeTitle {
  number: number;
  name: string;
  positive_law: boolean;
  description: string;
}

// Key U.S. Code titles for legal work
export const USC_TITLES: USCodeTitle[] = [
  { number: 11, name: 'Bankruptcy', positive_law: true, description: 'Bankruptcy proceedings and debtor relief' },
  { number: 15, name: 'Commerce and Trade', positive_law: false, description: 'Includes DTSA (Defend Trade Secrets Act), antitrust, consumer protection' },
  { number: 17, name: 'Copyrights', positive_law: true, description: 'Copyright law and protections' },
  { number: 18, name: 'Crimes and Criminal Procedure', positive_law: true, description: 'Federal criminal law' },
  { number: 26, name: 'Internal Revenue Code', positive_law: true, description: 'Tax law' },
  { number: 28, name: 'Judiciary and Judicial Procedure', positive_law: true, description: 'Federal court system' },
  { number: 29, name: 'Labor', positive_law: false, description: 'Employment law, FLSA, OSHA, ERISA' },
  { number: 35, name: 'Patents', positive_law: true, description: 'Patent law' },
  { number: 42, name: 'Public Health and Welfare', positive_law: false, description: 'Civil rights, ADA, ADEA, Title VII' },
];

// Key CFR titles for legal work
export const CFR_TITLES: { number: number; name: string; relevance: string }[] = [
  { number: 17, name: 'Commodity and Securities Exchanges', relevance: 'SEC regulations, securities law' },
  { number: 26, name: 'Internal Revenue', relevance: 'IRS regulations' },
  { number: 29, name: 'Labor', relevance: 'DOL regulations, OSHA, wage/hour' },
  { number: 37, name: 'Patents, Trademarks, and Copyrights', relevance: 'USPTO regulations' },
  { number: 40, name: 'Protection of Environment', relevance: 'EPA regulations' },
  { number: 45, name: 'Public Welfare', relevance: 'HHS regulations, HIPAA' },
  { number: 47, name: 'Telecommunication', relevance: 'FCC regulations' },
];

class ECFRService {
  private cache: Map<string, { data: unknown; timestamp: number }> = new Map();
  private CACHE_TTL = 1000 * 60 * 60; // 1 hour

  /**
   * Get list of all CFR titles
   */
  async getTitles(): Promise<CFRTitle[]> {
    const cacheKey = 'titles';
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data as CFRTitle[];
    }

    const response = await fetch(`${ECFR_API_BASE}/versioner/v1/titles`);
    if (!response.ok) {throw new Error(`eCFR API error: ${response.status}`);}
    
    const data = await response.json();
    const titles = data.titles.map((t: { number: number; name: string; latest_amended_on: string }) => ({
      number: t.number,
      name: t.name,
      lastUpdated: t.latest_amended_on,
    }));

    this.cache.set(cacheKey, { data: titles, timestamp: Date.now() });
    return titles;
  }

  /**
   * Get structure of a specific title
   */
  async getTitleStructure(titleNumber: number): Promise<unknown> {
    const response = await fetch(
      `${ECFR_API_BASE}/versioner/v1/structure/current/title-${titleNumber}.json`
    );
    if (!response.ok) {throw new Error(`eCFR API error: ${response.status}`);}
    return response.json();
  }

  /**
   * Get full text of a CFR section
   */
  async getSection(titleNumber: number, part: number, section: string): Promise<string> {
    const response = await fetch(
      `${ECFR_API_BASE}/renderer/v1/content/current/title-${titleNumber}/part-${part}/section-${section}`
    );
    if (!response.ok) {throw new Error(`eCFR API error: ${response.status}`);}
    return response.text();
  }

  /**
   * Search CFR text
   */
  async search(query: string, options?: {
    title?: number;
    page?: number;
    perPage?: number;
  }): Promise<{ results: CFRSearchResult[]; totalCount: number }> {
    const params = new URLSearchParams({
      query,
      per_page: (options?.perPage || 20).toString(),
      page: (options?.page || 1).toString(),
    });
    
    if (options?.title) {
      params.append('title', options.title.toString());
    }

    const response = await fetch(`${ECFR_API_BASE}/search/v1/results?${params}`);
    if (!response.ok) {throw new Error(`eCFR API error: ${response.status}`);}
    
    const data = await response.json();
    return {
      results: data.results.map((r: { 
        title: number; 
        part: number; 
        section: string; 
        heading: string; 
        snippet: string;
        hierarchy: string[];
      }) => ({
        title: r.title,
        part: r.part,
        section: r.section,
        heading: r.heading,
        snippet: r.snippet,
        hierarchy: r.hierarchy,
      })),
      totalCount: data.meta.total_count,
    };
  }

  /**
   * Get XML download URL for a title
   */
  getDownloadUrl(titleNumber: number, date: string = '2024-01-01'): string {
    return `${ECFR_API_BASE}/versioner/v1/full/${date}/title-${titleNumber}.xml`;
  }

  /**
   * Search for employment-related regulations
   */
  async searchEmploymentRegs(query: string): Promise<{ results: CFRSearchResult[]; totalCount: number }> {
    return this.search(query, { title: 29 }); // Title 29 = Labor
  }

  /**
   * Search for IP-related regulations
   */
  async searchIPRegs(query: string): Promise<{ results: CFRSearchResult[]; totalCount: number }> {
    return this.search(query, { title: 37 }); // Title 37 = Patents, TM, Copyright
  }
}

/**
 * Generate Cornell LII URL for a U.S. Code section
 */
export function getUSCodeUrl(title: number, section: string): string {
  return `https://www.law.cornell.edu/uscode/text/${title}/${section}`;
}

/**
 * Generate eCFR URL for a CFR section
 */
export function getCFRUrl(title: number, part: number, section?: string): string {
  if (section) {
    return `https://www.ecfr.gov/current/title-${title}/part-${part}/section-${part}.${section}`;
  }
  return `https://www.ecfr.gov/current/title-${title}/part-${part}`;
}

/**
 * Key statutes for legal demos
 */
export const KEY_STATUTES = {
  tradeSecrets: {
    name: 'Defend Trade Secrets Act (DTSA)',
    citation: '18 U.S.C. § 1836',
    url: getUSCodeUrl(18, '1836'),
    description: 'Federal civil cause of action for trade secret misappropriation',
  },
  adea: {
    name: 'Age Discrimination in Employment Act',
    citation: '29 U.S.C. § 621 et seq.',
    url: getUSCodeUrl(29, '621'),
    description: 'Prohibits employment discrimination against persons 40+',
  },
  titleVII: {
    name: 'Title VII of the Civil Rights Act',
    citation: '42 U.S.C. § 2000e',
    url: getUSCodeUrl(42, '2000e'),
    description: 'Prohibits employment discrimination based on protected classes',
  },
  erisa: {
    name: 'Employee Retirement Income Security Act',
    citation: '29 U.S.C. § 1001 et seq.',
    url: getUSCodeUrl(29, '1001'),
    description: 'Regulates employee benefit plans',
  },
  ada: {
    name: 'Americans with Disabilities Act',
    citation: '42 U.S.C. § 12101 et seq.',
    url: getUSCodeUrl(42, '12101'),
    description: 'Prohibits discrimination based on disability',
  },
  lanhamAct: {
    name: 'Lanham Act (Trademark)',
    citation: '15 U.S.C. § 1051 et seq.',
    url: getUSCodeUrl(15, '1051'),
    description: 'Federal trademark law',
  },
  patentAct: {
    name: 'Patent Act',
    citation: '35 U.S.C. § 1 et seq.',
    url: getUSCodeUrl(35, '1'),
    description: 'Federal patent law',
  },
  copyrightAct: {
    name: 'Copyright Act',
    citation: '17 U.S.C. § 101 et seq.',
    url: getUSCodeUrl(17, '101'),
    description: 'Federal copyright law',
  },
};

/**
 * Format statute reference for agent context
 */
export function formatStatutesForAgent(): string {
  return `
## Key Federal Statutes

### Employment Law
- **ADEA** (29 U.S.C. § 621): Age discrimination, applies to employees 40+
- **Title VII** (42 U.S.C. § 2000e): Race, color, religion, sex, national origin discrimination
- **ADA** (42 U.S.C. § 12101): Disability discrimination
- **ERISA** (29 U.S.C. § 1001): Employee benefits protection

### Intellectual Property
- **DTSA** (18 U.S.C. § 1836): Federal trade secret protection
- **Lanham Act** (15 U.S.C. § 1051): Trademark law
- **Patent Act** (35 U.S.C.): Patent law
- **Copyright Act** (17 U.S.C.): Copyright law

### Regulations (CFR)
- **29 CFR**: Labor regulations (DOL, OSHA, wage/hour)
- **37 CFR**: Patent and trademark regulations
- **45 CFR**: HHS regulations (HIPAA)

Use Cornell LII for U.S. Code: https://www.law.cornell.edu/uscode/
Use eCFR for regulations: https://www.ecfr.gov/
`;
}

// Singleton instance
export const ecfrService = new ECFRService();

// Re-export Open States for state legislation
export { 
  openStatesService, 
  US_JURISDICTIONS,
  type JurisdictionCode,
  type OpenStatesBill,
  type OpenStatesPerson,
  type OpenStatesSearchParams,
  type OpenStatesSearchResponse,
} from './openstates';

// Re-export legal data sources documentation
export {
  FEDERAL_SOURCES,
  STATE_SOURCES,
  LOCAL_SOURCES,
  SPECIALIZED_SOURCES,
  getAllSources,
  getDownloadableSources,
  getApiSources,
  getSourcesByCategory,
  DOWNLOADABLE_SUMMARY,
} from './sources';
export type { LegalDataSource } from './sources';

// Re-export legal tools for agents
export {
  searchFederalRegulations,
  searchStateBills,
  getRecentStateBills,
  searchEmploymentRegulations,
  searchEnvironmentalRegulations,
  searchStateEmploymentBills,
  searchStateIPBills,
  executeLegalTool,
  LEGAL_TOOL_DEFINITIONS,
} from './tools';

// Re-export Federal Register service
export {
  federalRegisterService,
  KEY_AGENCIES,
  type FederalRegisterDocument,
  type FederalRegisterSearchParams,
  type FederalRegisterSearchResponse,
  type DocumentType,
} from './federal-register';

// Re-export SEC EDGAR service
export {
  secEdgarService,
  NOTABLE_COMPANIES,
  type SECCompany,
  type SECFiling,
  type SECFilingDocument,
  type FilingType,
} from './sec-edgar';

// Re-export SCOTUS Database
export {
  ISSUE_AREAS,
  DECISION_DIRECTIONS,
  DISPOSITIONS,
  LANDMARK_CASES,
  getLandmarkCasesByIssue,
  getEmploymentLandmarkCases,
  getIPLandmarkCases,
  formatLandmarkCase,
  formatLandmarkCasesForAgent,
  SCOTUS_RESOURCES,
} from './scotus-db';

export default ecfrService;
