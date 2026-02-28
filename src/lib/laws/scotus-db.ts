// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * SUPREME COURT DATABASE (SCDB) INTEGRATION
 * Coded metadata for every SCOTUS decision (1791-present)
 * 
 * Source: http://scdb.wustl.edu/
 * Coverage: All Supreme Court cases with coded variables
 * Format: CSV data, no API - we provide lookup utilities
 * 
 * Note: This provides structured metadata about SCOTUS cases.
 * For full case text, use Caselaw Access Project or CourtListener.
 */

// SCDB Issue Areas (what the case is about)
export const ISSUE_AREAS = {
  1: 'Criminal Procedure',
  2: 'Civil Rights',
  3: 'First Amendment',
  4: 'Due Process',
  5: 'Privacy',
  6: 'Attorneys',
  7: 'Unions',
  8: 'Economic Activity',
  9: 'Judicial Power',
  10: 'Federalism',
  11: 'Interstate Relations',
  12: 'Federal Taxation',
  13: 'Miscellaneous',
  14: 'Private Action',
} as const;

// SCDB Decision Directions
export const DECISION_DIRECTIONS = {
  1: 'Conservative',
  2: 'Liberal',
  3: 'Unspecifiable',
} as const;

// SCDB Case Dispositions
export const DISPOSITIONS = {
  1: 'Stay, petition, or motion granted',
  2: 'Affirmed',
  3: 'Reversed',
  4: 'Reversed and remanded',
  5: 'Vacated and remanded',
  6: 'Affirmed and reversed in part',
  7: 'Affirmed and remanded',
  8: 'Vacated',
  9: 'Petition denied or appeal dismissed',
  10: 'Certification to or from a lower court',
  11: 'No disposition',
} as const;

// SCDB Legal Provisions (constitutional/statutory basis)
export const LEGAL_PROVISIONS = {
  // Constitutional Amendments
  10001: 'First Amendment - Free Speech',
  10002: 'First Amendment - Religion (Establishment)',
  10003: 'First Amendment - Religion (Free Exercise)',
  10004: 'First Amendment - Press',
  10005: 'First Amendment - Assembly',
  10010: 'Fourth Amendment - Search and Seizure',
  10020: 'Fifth Amendment - Self-Incrimination',
  10021: 'Fifth Amendment - Double Jeopardy',
  10022: 'Fifth Amendment - Due Process',
  10023: 'Fifth Amendment - Takings',
  10030: 'Sixth Amendment - Right to Counsel',
  10031: 'Sixth Amendment - Confrontation',
  10032: 'Sixth Amendment - Jury Trial',
  10040: 'Eighth Amendment - Cruel and Unusual',
  10050: 'Fourteenth Amendment - Due Process',
  10051: 'Fourteenth Amendment - Equal Protection',
  // Key Statutes
  20010: 'Civil Rights Act of 1964',
  20020: 'Voting Rights Act',
  20030: 'Americans with Disabilities Act',
  20040: 'Age Discrimination in Employment Act',
  20050: 'Title VII',
  20060: 'Sherman Antitrust Act',
  20070: 'Securities Exchange Act',
  20080: 'National Labor Relations Act',
  20090: 'Clean Air Act',
  20100: 'Clean Water Act',
} as const;

export interface SCOTUSCase {
  caseId: string;
  docketNumber: string;
  caseName: string;
  dateDecision: string;
  dateArgument?: string;
  dateRearg?: string;
  term: number;
  naturalCourt: number;
  chief: string;
  issueArea: keyof typeof ISSUE_AREAS;
  decisionDirection: keyof typeof DECISION_DIRECTIONS;
  disposition: keyof typeof DISPOSITIONS;
  legalProvision?: keyof typeof LEGAL_PROVISIONS;
  majVotes: number;
  minVotes: number;
  splitVote: boolean;
  unanimous: boolean;
  authorityDecision1?: string;
  authorityDecision2?: string;
  precedentAlteration: boolean;
  citation?: string;
}

export interface SCOTUSJustice {
  justiceId: number;
  justiceName: string;
  direction: 'majority' | 'dissent' | 'concurrence';
  vote: number;
  opinion?: 'majority' | 'concurrence' | 'dissent' | 'special';
}

// Notable SCOTUS cases for legal demos
export const LANDMARK_CASES: Record<string, {
  name: string;
  citation: string;
  year: number;
  issueArea: string;
  holding: string;
  relevance: string;
}> = {
  // Employment Law
  'griggs-v-duke-power': {
    name: 'Griggs v. Duke Power Co.',
    citation: '401 U.S. 424 (1971)',
    year: 1971,
    issueArea: 'Civil Rights',
    holding: 'Employment tests must be job-related; disparate impact theory established',
    relevance: 'Foundation of employment discrimination law',
  },
  'mcdonnell-douglas-v-green': {
    name: 'McDonnell Douglas Corp. v. Green',
    citation: '411 U.S. 792 (1973)',
    year: 1973,
    issueArea: 'Civil Rights',
    holding: 'Established burden-shifting framework for discrimination claims',
    relevance: 'Standard framework for employment discrimination cases',
  },
  'burlington-v-ellerth': {
    name: 'Burlington Industries v. Ellerth',
    citation: '524 U.S. 742 (1998)',
    year: 1998,
    issueArea: 'Civil Rights',
    holding: 'Employer liability for supervisor harassment; affirmative defense',
    relevance: 'Key sexual harassment precedent',
  },
  
  // Trade Secrets / IP
  'kewanee-v-bicron': {
    name: 'Kewanee Oil Co. v. Bicron Corp.',
    citation: '416 U.S. 470 (1974)',
    year: 1974,
    issueArea: 'Economic Activity',
    holding: 'State trade secret law not preempted by federal patent law',
    relevance: 'Foundation for state trade secret protection',
  },
  'bonito-boats-v-thunder-craft': {
    name: 'Bonito Boats v. Thunder Craft',
    citation: '489 U.S. 141 (1989)',
    year: 1989,
    issueArea: 'Economic Activity',
    holding: 'State laws cannot offer patent-like protection for unpatented designs',
    relevance: 'Limits of state IP protection',
  },
  
  // Contract Law
  'carnival-cruise-v-shute': {
    name: 'Carnival Cruise Lines v. Shute',
    citation: '499 U.S. 585 (1991)',
    year: 1991,
    issueArea: 'Economic Activity',
    holding: 'Forum selection clauses in form contracts enforceable',
    relevance: 'Contract enforceability standards',
  },
  'at&t-mobility-v-concepcion': {
    name: 'AT&T Mobility v. Concepcion',
    citation: '563 U.S. 333 (2011)',
    year: 2011,
    issueArea: 'Economic Activity',
    holding: 'FAA preempts state laws invalidating class arbitration waivers',
    relevance: 'Arbitration clause enforceability',
  },
  
  // Environmental
  'chevron-v-nrdc': {
    name: 'Chevron U.S.A. v. NRDC',
    citation: '467 U.S. 837 (1984)',
    year: 1984,
    issueArea: 'Judicial Power',
    holding: 'Courts defer to agency interpretation of ambiguous statutes',
    relevance: 'Foundation of administrative law (recently limited)',
  },
  'massachusetts-v-epa': {
    name: 'Massachusetts v. EPA',
    citation: '549 U.S. 497 (2007)',
    year: 2007,
    issueArea: 'Federalism',
    holding: 'EPA has authority to regulate greenhouse gases under Clean Air Act',
    relevance: 'Climate change regulation authority',
  },
  
  // Recent Significant
  'bostock-v-clayton-county': {
    name: 'Bostock v. Clayton County',
    citation: '590 U.S. ___ (2020)',
    year: 2020,
    issueArea: 'Civil Rights',
    holding: 'Title VII prohibits discrimination based on sexual orientation and gender identity',
    relevance: 'Expanded employment discrimination protections',
  },
  'loper-bright-v-raimondo': {
    name: 'Loper Bright Enterprises v. Raimondo',
    citation: '603 U.S. ___ (2024)',
    year: 2024,
    issueArea: 'Judicial Power',
    holding: 'Overruled Chevron deference; courts must exercise independent judgment',
    relevance: 'Major shift in administrative law',
  },
};

/**
 * Get landmark cases by issue area
 */
export function getLandmarkCasesByIssue(issueArea: string): typeof LANDMARK_CASES[string][] {
  return Object.values(LANDMARK_CASES).filter(c => 
    c.issueArea.toLowerCase().includes(issueArea.toLowerCase())
  );
}

/**
 * Get employment law landmark cases
 */
export function getEmploymentLandmarkCases(): typeof LANDMARK_CASES[string][] {
  return Object.values(LANDMARK_CASES).filter(c => 
    c.relevance.toLowerCase().includes('employment') ||
    c.relevance.toLowerCase().includes('discrimination') ||
    c.relevance.toLowerCase().includes('harassment')
  );
}

/**
 * Get IP/trade secret landmark cases
 */
export function getIPLandmarkCases(): typeof LANDMARK_CASES[string][] {
  return Object.values(LANDMARK_CASES).filter(c => 
    c.relevance.toLowerCase().includes('trade secret') ||
    c.relevance.toLowerCase().includes('ip') ||
    c.relevance.toLowerCase().includes('patent') ||
    c.issueArea === 'Economic Activity'
  );
}

/**
 * Format landmark case for agent context
 */
export function formatLandmarkCase(caseKey: string): string {
  const c = LANDMARK_CASES[caseKey];
  if (!c) {return `Case not found: ${caseKey}`;}
  
  return `**${c.name}**
Citation: ${c.citation}
Issue: ${c.issueArea}
Holding: ${c.holding}
Relevance: ${c.relevance}`;
}

/**
 * Format multiple landmark cases for agent context
 */
export function formatLandmarkCasesForAgent(cases: typeof LANDMARK_CASES[string][]): string {
  if (cases.length === 0) {return 'No landmark cases found.';}
  
  return cases.map(c => 
    `**${c.name}** (${c.citation})
Holding: ${c.holding}
Relevance: ${c.relevance}`
  ).join('\n\n---\n\n');
}

/**
 * Get SCOTUS statistics by issue area
 */
export function getIssueAreaDescription(issueArea: keyof typeof ISSUE_AREAS): string {
  return ISSUE_AREAS[issueArea] || 'Unknown';
}

/**
 * Get disposition description
 */
export function getDispositionDescription(disposition: keyof typeof DISPOSITIONS): string {
  return DISPOSITIONS[disposition] || 'Unknown';
}

/**
 * URLs for SCOTUS resources
 */
export const SCOTUS_RESOURCES = {
  scdb: 'http://scdb.wustl.edu/',
  oyez: 'https://www.oyez.org/',
  supremeCourtGov: 'https://www.supremecourt.gov/',
  scotusBlog: 'https://www.scotusblog.com/',
  justia: 'https://supreme.justia.com/',
};

export default {
  ISSUE_AREAS,
  DECISION_DIRECTIONS,
  DISPOSITIONS,
  LEGAL_PROVISIONS,
  LANDMARK_CASES,
  getLandmarkCasesByIssue,
  getEmploymentLandmarkCases,
  getIPLandmarkCases,
  formatLandmarkCase,
  formatLandmarkCasesForAgent,
  SCOTUS_RESOURCES,
};
