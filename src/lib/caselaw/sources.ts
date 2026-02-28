// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * FREE LEGAL RESEARCH SOURCES
 * 
 * This module documents and integrates available free legal research sources.
 * Some have APIs, others are web-only (for reference/linking).
 * 
 * Sources with APIs (integrated):
 * - CourtListener (Free Law Project) - Best API, citation network
 * - Caselaw Access Project (Harvard) - Bulk data, 6.7M cases
 * 
 * Sources without APIs (link generation only):
 * - Google Scholar - Best search, no API
 * - Justia - Good browsing, limited API
 * - FindLaw - Thomson Reuters, no API
 * - Oyez Project - Supreme Court oral arguments
 */

export interface LegalSource {
  id: string;
  name: string;
  description: string;
  url: string;
  hasApi: boolean;
  apiDocs?: string;
  coverage: string;
  features: string[];
  limitations: string[];
  searchUrlTemplate?: string;
  caseUrlTemplate?: string;
}

export const LEGAL_SOURCES: LegalSource[] = [
  {
    id: 'courtlistener',
    name: 'CourtListener',
    description: 'Free Law Project\'s comprehensive legal database with robust API',
    url: 'https://www.courtlistener.com',
    hasApi: true,
    apiDocs: 'https://www.courtlistener.com/help/api/',
    coverage: 'Federal and state courts, PACER dockets, oral arguments',
    features: [
      'REST API with 5,000 requests/hour',
      'Citation network analysis',
      'RECAP archive (federal dockets)',
      'Oral argument audio',
      'Real-time alerts',
    ],
    limitations: [
      'Requires free account for full API access',
      'Some PACER documents require purchase',
    ],
    searchUrlTemplate: 'https://www.courtlistener.com/?q={query}&type=o',
    caseUrlTemplate: 'https://www.courtlistener.com/opinion/{id}/',
  },
  {
    id: 'cap',
    name: 'Caselaw Access Project',
    description: 'Harvard Law School\'s digitized collection of U.S. case law',
    url: 'https://case.law',
    hasApi: true,
    apiDocs: 'https://case.law/api/',
    coverage: '6.7M+ cases from all U.S. jurisdictions through 2018',
    features: [
      'Bulk data downloads available',
      'Consistent JSON format',
      'Full case text with citations',
      'Free API (500 calls/day)',
    ],
    limitations: [
      'Data ends around 2018',
      'Rate limited to 500 calls/day free tier',
    ],
    searchUrlTemplate: 'https://case.law/search/#/cases?search={query}',
    caseUrlTemplate: 'https://cite.case.law/{citation}',
  },
  {
    id: 'google-scholar',
    name: 'Google Scholar',
    description: 'Google\'s case law search with powerful ranking algorithms',
    url: 'https://scholar.google.com',
    hasApi: false,
    coverage: 'U.S. federal and state cases since 1923',
    features: [
      'Powerful search and ranking',
      'Citation counts and "Cited by" links',
      'Filter by court and date range',
      'Free and unlimited access',
      '"How cited" analysis',
    ],
    limitations: [
      'No API available',
      'Cannot bulk download',
      'Must use web interface',
    ],
    searchUrlTemplate: 'https://scholar.google.com/scholar?hl=en&as_sdt=4&q={query}',
  },
  {
    id: 'justia',
    name: 'Justia',
    description: 'Comprehensive free legal information and case law database',
    url: 'https://www.justia.com',
    hasApi: false,
    coverage: 'U.S. Supreme Court, federal circuits, state courts',
    features: [
      'Well-organized by jurisdiction',
      'Legal forms and guides',
      'Lawyer directory',
      'Annotations and summaries',
      'Links to Oyez for oral arguments',
    ],
    limitations: [
      'No public API',
      'Some features require account',
    ],
    searchUrlTemplate: 'https://www.justia.com/search?q={query}',
    caseUrlTemplate: 'https://supreme.justia.com/cases/federal/us/{volume}/{page}/',
  },
  {
    id: 'findlaw',
    name: 'FindLaw',
    description: 'Thomson Reuters free legal resource for cases and codes',
    url: 'https://caselaw.findlaw.com',
    hasApi: false,
    coverage: 'U.S. Supreme Court, federal appellate, state courts',
    features: [
      'Browse by jurisdiction',
      'Legal news and commentary',
      'Practice area guides',
      'State law resources',
    ],
    limitations: [
      'No API',
      'Owned by Thomson Reuters (commercial)',
      'Limited historical coverage',
    ],
    searchUrlTemplate: 'https://caselaw.findlaw.com/search.html?query={query}',
  },
  {
    id: 'oyez',
    name: 'Oyez Project',
    description: 'Multimedia archive of Supreme Court proceedings',
    url: 'https://www.oyez.org',
    hasApi: false,
    coverage: 'U.S. Supreme Court oral arguments and decisions',
    features: [
      'Audio recordings of oral arguments',
      'Synchronized transcripts',
      'Justice voting records',
      'Case summaries and analysis',
      'Historical archive back to 1955',
    ],
    limitations: [
      'Supreme Court only',
      'No bulk download',
      'No API',
    ],
    searchUrlTemplate: 'https://www.oyez.org/search/{query}',
    caseUrlTemplate: 'https://www.oyez.org/cases/{term}/{docket}',
  },
  {
    id: 'law-cornell',
    name: 'Legal Information Institute (Cornell)',
    description: 'Cornell Law School\'s free legal encyclopedia and case law',
    url: 'https://www.law.cornell.edu',
    hasApi: false,
    coverage: 'U.S. Code, CFR, Supreme Court, Constitution',
    features: [
      'Wex legal dictionary/encyclopedia',
      'U.S. Code with annotations',
      'CFR (regulations)',
      'Supreme Court decisions',
    ],
    limitations: [
      'No API',
      'Focus on statutes over case law',
    ],
    searchUrlTemplate: 'https://www.law.cornell.edu/search/site/{query}',
  },
  {
    id: 'public-resource',
    name: 'Public.Resource.Org',
    description: 'Carl Malamud\'s project to make law freely accessible',
    url: 'https://public.resource.org',
    hasApi: false,
    coverage: 'Building codes, standards, government documents',
    features: [
      'Building codes and standards',
      'Government documents',
      'Advocacy for open access',
    ],
    limitations: [
      'Focus on codes/standards, not case law',
      'No structured API',
    ],
  },
];

/**
 * Generate a search URL for a specific source
 */
export function generateSearchUrl(sourceId: string, query: string): string | null {
  const source = LEGAL_SOURCES.find(s => s.id === sourceId);
  if (!source?.searchUrlTemplate) {return null;}
  
  return source.searchUrlTemplate.replace('{query}', encodeURIComponent(query));
}

/**
 * Generate URLs for all sources that support search
 */
export function generateAllSearchUrls(query: string): { source: LegalSource; url: string }[] {
  return LEGAL_SOURCES
    .filter(s => s.searchUrlTemplate)
    .map(source => ({
      source,
      url: source.searchUrlTemplate!.replace('{query}', encodeURIComponent(query)),
    }));
}

/**
 * Get sources with API access (for programmatic integration)
 */
export function getApiSources(): LegalSource[] {
  return LEGAL_SOURCES.filter(s => s.hasApi);
}

/**
 * Get sources for a specific use case
 */
export function getSourcesForUseCase(useCase: 'search' | 'bulk' | 'citations' | 'audio'): LegalSource[] {
  switch (useCase) {
    case 'search':
      return LEGAL_SOURCES.filter(s => s.searchUrlTemplate);
    case 'bulk':
      return LEGAL_SOURCES.filter(s => s.id === 'cap' || s.id === 'courtlistener');
    case 'citations':
      return LEGAL_SOURCES.filter(s => s.id === 'courtlistener' || s.id === 'google-scholar');
    case 'audio':
      return LEGAL_SOURCES.filter(s => s.id === 'oyez' || s.id === 'courtlistener');
    default:
      return LEGAL_SOURCES;
  }
}

/**
 * Format source information for agent context
 */
export function formatSourcesForAgent(): string {
  return `
## Available Legal Research Sources

### Sources with API Access (Integrated)
${LEGAL_SOURCES.filter(s => s.hasApi).map(s => `
**${s.name}** (${s.url})
- Coverage: ${s.coverage}
- Features: ${s.features.slice(0, 3).join(', ')}
`).join('')}

### Additional Free Sources (Web Only)
${LEGAL_SOURCES.filter(s => !s.hasApi).map(s => `
**${s.name}** (${s.url})
- Coverage: ${s.coverage}
- Best for: ${s.features[0]}
`).join('')}

When citing cases, prefer sources with API access for verification.
For Supreme Court oral arguments, use Oyez Project.
For citation network analysis, use CourtListener or Google Scholar.
`;
}

export default LEGAL_SOURCES;
