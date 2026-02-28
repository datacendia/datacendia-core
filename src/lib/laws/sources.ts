// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * LEGAL DATA SOURCES - COMPREHENSIVE REFERENCE
 * 
 * This documents ALL available legal data sources, what's downloadable,
 * and what requires API access or web-only access.
 */

export interface LegalDataSource {
  id: string;
  name: string;
  type: 'federal' | 'state' | 'local' | 'international' | 'specialized';
  category: 'statutes' | 'regulations' | 'cases' | 'municipal' | 'environmental' | 'labor' | 'securities';
  hasApi: boolean;
  hasBulkDownload: boolean;
  isFree: boolean;
  url: string;
  apiUrl?: string;
  description: string;
  coverage: string;
  limitations?: string;
}

// ============================================
// FEDERAL SOURCES (Most complete coverage)
// ============================================

export const FEDERAL_SOURCES: LegalDataSource[] = [
  // STATUTES
  {
    id: 'uscode',
    name: 'U.S. Code',
    type: 'federal',
    category: 'statutes',
    hasApi: false,
    hasBulkDownload: true,
    isFree: true,
    url: 'https://uscode.house.gov/download/download.shtml',
    description: 'Complete United States Code - all federal statutes',
    coverage: 'All 54 titles of federal law',
    limitations: 'Bulk download requires manual navigation, ~150MB XML',
  },
  {
    id: 'govinfo',
    name: 'GovInfo (GPO)',
    type: 'federal',
    category: 'statutes',
    hasApi: true,
    hasBulkDownload: true,
    isFree: true,
    url: 'https://www.govinfo.gov/',
    apiUrl: 'https://api.govinfo.gov/',
    description: 'Official government publishing - USC, CFR, Federal Register, bills',
    coverage: 'All federal publications',
  },
  
  // REGULATIONS
  {
    id: 'ecfr',
    name: 'eCFR (Code of Federal Regulations)',
    type: 'federal',
    category: 'regulations',
    hasApi: true,
    hasBulkDownload: true,
    isFree: true,
    url: 'https://www.ecfr.gov/',
    apiUrl: 'https://www.ecfr.gov/api/',
    description: 'All federal regulations - 50 titles',
    coverage: 'Complete CFR, updated daily',
  },
  {
    id: 'federal-register',
    name: 'Federal Register',
    type: 'federal',
    category: 'regulations',
    hasApi: true,
    hasBulkDownload: true,
    isFree: true,
    url: 'https://www.federalregister.gov/',
    apiUrl: 'https://www.federalregister.gov/developers/api/v1',
    description: 'Daily publication of federal rules, proposed rules, notices',
    coverage: 'All federal agency actions since 1994',
  },
  
  // ENVIRONMENTAL (CFR Title 40)
  {
    id: 'epa-regulations',
    name: 'EPA Regulations (40 CFR)',
    type: 'federal',
    category: 'environmental',
    hasApi: true,
    hasBulkDownload: true,
    isFree: true,
    url: 'https://www.ecfr.gov/current/title-40',
    apiUrl: 'https://www.ecfr.gov/api/versioner/v1/full/current/title-40.xml',
    description: 'All EPA environmental regulations',
    coverage: 'Clean Air Act, Clean Water Act, RCRA, CERCLA, TSCA, etc.',
  },
  
  // LABOR/OSHA (CFR Title 29)
  {
    id: 'dol-regulations',
    name: 'DOL/OSHA Regulations (29 CFR)',
    type: 'federal',
    category: 'labor',
    hasApi: true,
    hasBulkDownload: true,
    isFree: true,
    url: 'https://www.ecfr.gov/current/title-29',
    apiUrl: 'https://www.ecfr.gov/api/versioner/v1/full/current/title-29.xml',
    description: 'All labor regulations - OSHA, wage/hour, ERISA',
    coverage: 'Workplace safety, wages, benefits, unions',
  },
  
  // SECURITIES (CFR Title 17)
  {
    id: 'sec-regulations',
    name: 'SEC Regulations (17 CFR)',
    type: 'federal',
    category: 'securities',
    hasApi: true,
    hasBulkDownload: true,
    isFree: true,
    url: 'https://www.ecfr.gov/current/title-17',
    apiUrl: 'https://www.ecfr.gov/api/versioner/v1/full/current/title-17.xml',
    description: 'All SEC and CFTC regulations',
    coverage: 'Securities law, commodities, exchanges',
  },
  
  // CASE LAW
  {
    id: 'cap',
    name: 'Caselaw Access Project',
    type: 'federal',
    category: 'cases',
    hasApi: true,
    hasBulkDownload: true,
    isFree: true,
    url: 'https://case.law/',
    apiUrl: 'https://api.case.law/v1/',
    description: 'Harvard Law digitized case law',
    coverage: '6.7M+ cases, all US jurisdictions through 2018',
  },
  {
    id: 'courtlistener',
    name: 'CourtListener',
    type: 'federal',
    category: 'cases',
    hasApi: true,
    hasBulkDownload: true,
    isFree: true,
    url: 'https://www.courtlistener.com/',
    apiUrl: 'https://www.courtlistener.com/api/rest/v3/',
    description: 'Free Law Project case law and dockets',
    coverage: 'Federal and state cases, PACER dockets via RECAP',
  },
];

// ============================================
// STATE SOURCES (Limited bulk availability)
// ============================================

export const STATE_SOURCES: LegalDataSource[] = [
  {
    id: 'openstates',
    name: 'Open States',
    type: 'state',
    category: 'statutes',
    hasApi: true,
    hasBulkDownload: false,
    isFree: true,
    url: 'https://openstates.org/',
    apiUrl: 'https://v3.openstates.org/',
    description: 'State legislative data - bills, legislators, votes',
    coverage: 'All 50 states + DC + PR, current sessions',
    limitations: 'Bills only, not compiled statutes. API key required.',
  },
  {
    id: 'legiscan',
    name: 'LegiScan',
    type: 'state',
    category: 'statutes',
    hasApi: true,
    hasBulkDownload: true,
    isFree: false, // Free tier limited
    url: 'https://legiscan.com/',
    apiUrl: 'https://api.legiscan.com/',
    description: 'State and federal bill tracking',
    coverage: 'All 50 states + Congress',
    limitations: 'Free tier: 30 API calls/day. Bulk requires subscription.',
  },
  {
    id: 'state-codes-web',
    name: 'State Legislature Websites',
    type: 'state',
    category: 'statutes',
    hasApi: false,
    hasBulkDownload: false,
    isFree: true,
    url: 'https://www.ncsl.org/about-state-legislatures/state-legislative-websites-directory',
    description: 'Links to all 50 state legislature websites',
    coverage: 'All states, but no unified format',
    limitations: 'Each state different. No bulk download. Web scraping required.',
  },
];

// ============================================
// LOCAL/MUNICIPAL SOURCES (Very limited)
// ============================================

export const LOCAL_SOURCES: LegalDataSource[] = [
  {
    id: 'municode',
    name: 'Municode Library',
    type: 'local',
    category: 'municipal',
    hasApi: false,
    hasBulkDownload: false,
    isFree: true, // Reading is free
    url: 'https://library.municode.com/',
    description: 'Municipal codes for thousands of cities/counties',
    coverage: '~3,400 municipalities',
    limitations: 'Web access only. No API. No bulk download.',
  },
  {
    id: 'american-legal',
    name: 'American Legal Publishing',
    type: 'local',
    category: 'municipal',
    hasApi: false,
    hasBulkDownload: false,
    isFree: true,
    url: 'https://codelibrary.amlegal.com/',
    description: 'Municipal codes',
    coverage: '~2,000 municipalities',
    limitations: 'Web access only. No API. No bulk download.',
  },
  {
    id: 'general-code',
    name: 'General Code eCode360',
    type: 'local',
    category: 'municipal',
    hasApi: false,
    hasBulkDownload: false,
    isFree: true,
    url: 'https://ecode360.com/',
    description: 'Municipal codes',
    coverage: '~3,000 municipalities',
    limitations: 'Web access only. No API. No bulk download.',
  },
];

// ============================================
// SPECIALIZED SOURCES
// ============================================

export const SPECIALIZED_SOURCES: LegalDataSource[] = [
  // ENVIRONMENTAL
  {
    id: 'epa-echo',
    name: 'EPA ECHO (Enforcement)',
    type: 'specialized',
    category: 'environmental',
    hasApi: true,
    hasBulkDownload: true,
    isFree: true,
    url: 'https://echo.epa.gov/',
    apiUrl: 'https://echo.epa.gov/tools/web-services',
    description: 'EPA enforcement and compliance data',
    coverage: 'Facility permits, inspections, violations',
  },
  {
    id: 'epa-envirofacts',
    name: 'EPA Envirofacts',
    type: 'specialized',
    category: 'environmental',
    hasApi: true,
    hasBulkDownload: true,
    isFree: true,
    url: 'https://enviro.epa.gov/',
    apiUrl: 'https://enviro.epa.gov/enviro/efservice/',
    description: 'EPA environmental data warehouse',
    coverage: 'Air, water, waste, toxics data',
  },
  
  // SECURITIES
  {
    id: 'sec-edgar',
    name: 'SEC EDGAR',
    type: 'specialized',
    category: 'securities',
    hasApi: true,
    hasBulkDownload: true,
    isFree: true,
    url: 'https://www.sec.gov/edgar',
    apiUrl: 'https://www.sec.gov/cgi-bin/browse-edgar',
    description: 'SEC corporate filings',
    coverage: 'All public company filings - 10-K, 10-Q, 8-K, etc.',
  },
  
  // LABOR
  {
    id: 'osha-data',
    name: 'OSHA Data & Statistics',
    type: 'specialized',
    category: 'labor',
    hasApi: true,
    hasBulkDownload: true,
    isFree: true,
    url: 'https://www.osha.gov/data',
    description: 'OSHA inspection and injury data',
    coverage: 'Workplace inspections, injuries, fatalities',
  },
  {
    id: 'nlrb-decisions',
    name: 'NLRB Decisions',
    type: 'specialized',
    category: 'labor',
    hasApi: false,
    hasBulkDownload: false,
    isFree: true,
    url: 'https://www.nlrb.gov/cases-decisions/decisions',
    description: 'National Labor Relations Board decisions',
    coverage: 'Union and labor relations cases',
  },
  
  // BUILDING CODES
  {
    id: 'icc-codes',
    name: 'ICC Building Codes',
    type: 'specialized',
    category: 'regulations',
    hasApi: false,
    hasBulkDownload: false,
    isFree: false,
    url: 'https://codes.iccsafe.org/',
    description: 'International Building Code, Fire Code, etc.',
    coverage: 'Model building codes adopted by most jurisdictions',
    limitations: 'Commercial. Some free read-only access.',
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getAllSources(): LegalDataSource[] {
  return [
    ...FEDERAL_SOURCES,
    ...STATE_SOURCES,
    ...LOCAL_SOURCES,
    ...SPECIALIZED_SOURCES,
  ];
}

export function getDownloadableSources(): LegalDataSource[] {
  return getAllSources().filter(s => s.hasBulkDownload && s.isFree);
}

export function getApiSources(): LegalDataSource[] {
  return getAllSources().filter(s => s.hasApi && s.isFree);
}

export function getSourcesByCategory(category: LegalDataSource['category']): LegalDataSource[] {
  return getAllSources().filter(s => s.category === category);
}

export function getEnvironmentalSources(): LegalDataSource[] {
  return getAllSources().filter(s => s.category === 'environmental');
}

export function getLaborSources(): LegalDataSource[] {
  return getAllSources().filter(s => s.category === 'labor');
}

/**
 * Summary of what's actually downloadable for offline use
 */
export const DOWNLOADABLE_SUMMARY = `
## What Can Be Downloaded for Offline Use

### FEDERAL (Full Coverage Available)
✅ U.S. Code - All federal statutes (~150MB XML)
✅ CFR - All federal regulations (50 titles, ~2GB XML)
✅ Federal Register - Daily rules/notices (API + bulk)
✅ Case Law - 6.7M+ cases via CAP/CourtListener

### SPECIALIZED FEDERAL
✅ EPA Regulations (40 CFR) - Environmental law
✅ OSHA Regulations (29 CFR) - Workplace safety
✅ SEC Regulations (17 CFR) - Securities law
✅ SEC EDGAR - Corporate filings
✅ EPA ECHO - Enforcement data

### STATE (Limited)
⚠️ Open States API - Bills only, not compiled statutes
⚠️ LegiScan - Subscription required for bulk
❌ State Codes - No unified bulk source (50 different systems)

### LOCAL/MUNICIPAL
❌ No bulk download available
❌ Must access via Municode, American Legal, eCode360 websites
❌ Thousands of jurisdictions, no central source

### BUILDING/INDUSTRIAL CODES
❌ ICC Codes - Commercial, not freely downloadable
❌ NFPA Codes - Commercial
❌ Industry standards (ASTM, IEEE, etc.) - Commercial
`;

export default {
  FEDERAL_SOURCES,
  STATE_SOURCES,
  LOCAL_SOURCES,
  SPECIALIZED_SOURCES,
  getAllSources,
  getDownloadableSources,
  getApiSources,
  DOWNLOADABLE_SUMMARY,
};
