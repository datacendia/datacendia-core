// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * LEGAL RESEARCH TOOLS FOR COUNCIL AGENTS
 * These tools allow agents to search federal regulations and state legislation
 */

import { ecfrService, type CFRSearchResult } from './index';
import { openStatesService, type OpenStatesBill, type JurisdictionCode, US_JURISDICTIONS } from './openstates';

export interface LegalToolResult {
  success: boolean;
  data?: unknown;
  error?: string;
  source: string;
  cached?: boolean;
}

// Simple in-memory cache
const cache = new Map<string, { result: unknown; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

function getCacheKey(tool: string, params: Record<string, unknown>): string {
  return `${tool}:${JSON.stringify(params)}`;
}

function getFromCache<T>(key: string): T | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.result as T;
  }
  return null;
}

function setCache(key: string, result: unknown): void {
  cache.set(key, { result, timestamp: Date.now() });
}

// ==========================================
// FEDERAL REGULATIONS (eCFR)
// ==========================================

/**
 * Search federal regulations (CFR)
 */
export async function searchFederalRegulations(
  query: string,
  options?: {
    title?: number;
    limit?: number;
  }
): Promise<LegalToolResult> {
  const cacheKey = getCacheKey('cfr-search', { query, ...options });
  const cached = getFromCache<{ results: CFRSearchResult[]; totalCount: number }>(cacheKey);
  
  if (cached) {
    return {
      success: true,
      data: formatCFRResults(cached),
      source: 'ecfr',
      cached: true,
    };
  }

  try {
    const result = await ecfrService.search(query, {
      title: options?.title,
      perPage: options?.limit || 10,
    });
    
    setCache(cacheKey, result);
    
    return {
      success: true,
      data: formatCFRResults(result),
      source: 'ecfr',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      source: 'ecfr',
    };
  }
}

function formatCFRResults(result: { results: CFRSearchResult[]; totalCount: number }): string {
  if (result.results.length === 0) {
    return 'No federal regulations found matching the query.';
  }

  const formatted = result.results.map(r => 
    `**${r.title} CFR § ${r.part}.${r.section}** - ${r.heading}\n${r.snippet}`
  ).join('\n\n---\n\n');

  return `Found ${result.totalCount} federal regulations:\n\n${formatted}`;
}

/**
 * Search employment regulations (29 CFR)
 */
export async function searchEmploymentRegulations(query: string): Promise<LegalToolResult> {
  return searchFederalRegulations(query, { title: 29 });
}

/**
 * Search environmental regulations (40 CFR)
 */
export async function searchEnvironmentalRegulations(query: string): Promise<LegalToolResult> {
  return searchFederalRegulations(query, { title: 40 });
}

/**
 * Search IP/patent regulations (37 CFR)
 */
export async function searchIPRegulations(query: string): Promise<LegalToolResult> {
  return searchFederalRegulations(query, { title: 37 });
}

// ==========================================
// STATE LEGISLATION (Open States)
// ==========================================

/**
 * Search state bills
 */
export async function searchStateBills(
  query: string,
  options?: {
    state?: JurisdictionCode;
    limit?: number;
  }
): Promise<LegalToolResult> {
  if (!openStatesService.hasApiKey()) {
    return {
      success: false,
      error: 'Open States API key required. Set via openStatesService.setApiKey()',
      source: 'openstates',
    };
  }

  const cacheKey = getCacheKey('state-bills', { query, ...options });
  const cached = getFromCache<OpenStatesBill[]>(cacheKey);
  
  if (cached) {
    return {
      success: true,
      data: openStatesService.formatForAgentContext(cached),
      source: 'openstates',
      cached: true,
    };
  }

  try {
    const result = await openStatesService.searchBills({
      q: query,
      jurisdiction: options?.state,
      per_page: options?.limit || 10,
    });
    
    setCache(cacheKey, result.results);
    
    return {
      success: true,
      data: openStatesService.formatForAgentContext(result.results),
      source: 'openstates',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      source: 'openstates',
    };
  }
}

/**
 * Get recent bills in a state
 */
export async function getRecentStateBills(
  state: JurisdictionCode,
  days: number = 7
): Promise<LegalToolResult> {
  if (!openStatesService.hasApiKey()) {
    return {
      success: false,
      error: 'Open States API key required',
      source: 'openstates',
    };
  }

  try {
    const result = await openStatesService.getRecentBills(state, { days });
    
    return {
      success: true,
      data: openStatesService.formatForAgentContext(result.results),
      source: 'openstates',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      source: 'openstates',
    };
  }
}

/**
 * Search employment-related state bills
 */
export async function searchStateEmploymentBills(
  state?: JurisdictionCode
): Promise<LegalToolResult> {
  if (!openStatesService.hasApiKey()) {
    return {
      success: false,
      error: 'Open States API key required',
      source: 'openstates',
    };
  }

  try {
    const result = await openStatesService.searchEmploymentBills(state);
    
    return {
      success: true,
      data: openStatesService.formatForAgentContext(result.results),
      source: 'openstates',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      source: 'openstates',
    };
  }
}

/**
 * Search IP/trade secret state bills
 */
export async function searchStateIPBills(
  state?: JurisdictionCode
): Promise<LegalToolResult> {
  if (!openStatesService.hasApiKey()) {
    return {
      success: false,
      error: 'Open States API key required',
      source: 'openstates',
    };
  }

  try {
    const result = await openStatesService.searchIPBills(state);
    
    return {
      success: true,
      data: openStatesService.formatForAgentContext(result.results),
      source: 'openstates',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      source: 'openstates',
    };
  }
}

/**
 * Get state legislators
 */
export async function getStateLegislators(
  state: JurisdictionCode,
  options?: { chamber?: 'upper' | 'lower'; party?: string }
): Promise<LegalToolResult> {
  if (!openStatesService.hasApiKey()) {
    return {
      success: false,
      error: 'Open States API key required',
      source: 'openstates',
    };
  }

  try {
    const result = await openStatesService.getStateLegislators(state, options);
    
    const formatted = result.results.map(p => 
      `**${p.name}** (${p.party})\n${p.current_role?.title || 'Former'} - District ${p.current_role?.district || 'N/A'}`
    ).join('\n\n');
    
    return {
      success: true,
      data: formatted || 'No legislators found',
      source: 'openstates',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      source: 'openstates',
    };
  }
}

// ==========================================
// TOOL DEFINITIONS FOR AGENTS
// ==========================================

export const LEGAL_TOOL_DEFINITIONS = [
  {
    name: 'search_federal_regulations',
    description: 'Search the Code of Federal Regulations (CFR) for federal agency rules and regulations',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query for regulations',
        },
        title: {
          type: 'number',
          description: 'Optional CFR title number (e.g., 29 for Labor, 40 for EPA, 37 for Patents)',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'search_state_bills',
    description: 'Search state legislation across all 50 US states using Open States API',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query for bills',
        },
        state: {
          type: 'string',
          description: 'Two-letter state code (e.g., "ca" for California, "tx" for Texas)',
          enum: Object.keys(US_JURISDICTIONS),
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_recent_state_bills',
    description: 'Get recently active bills in a specific state',
    parameters: {
      type: 'object',
      properties: {
        state: {
          type: 'string',
          description: 'Two-letter state code',
          enum: Object.keys(US_JURISDICTIONS),
        },
        days: {
          type: 'number',
          description: 'Number of days to look back (default: 7)',
        },
      },
      required: ['state'],
    },
  },
  {
    name: 'search_employment_regulations',
    description: 'Search federal employment/labor regulations (29 CFR - DOL, OSHA, wage/hour)',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'search_environmental_regulations',
    description: 'Search federal environmental regulations (40 CFR - EPA)',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'search_state_employment_bills',
    description: 'Search state bills related to employment, labor, wages, discrimination',
    parameters: {
      type: 'object',
      properties: {
        state: {
          type: 'string',
          description: 'Optional two-letter state code to filter results',
          enum: Object.keys(US_JURISDICTIONS),
        },
      },
    },
  },
  {
    name: 'search_state_ip_bills',
    description: 'Search state bills related to intellectual property, trade secrets, patents',
    parameters: {
      type: 'object',
      properties: {
        state: {
          type: 'string',
          description: 'Optional two-letter state code to filter results',
          enum: Object.keys(US_JURISDICTIONS),
        },
      },
    },
  },
];

/**
 * Execute a legal tool by name
 */
export async function executeLegalTool(
  toolName: string,
  params: Record<string, unknown>
): Promise<LegalToolResult> {
  switch (toolName) {
    case 'search_federal_regulations':
      return searchFederalRegulations(
        params.query as string,
        { title: params.title as number | undefined }
      );
    
    case 'search_state_bills':
      return searchStateBills(
        params.query as string,
        { state: params.state as JurisdictionCode | undefined }
      );
    
    case 'get_recent_state_bills':
      return getRecentStateBills(
        params.state as JurisdictionCode,
        params.days as number | undefined
      );
    
    case 'search_employment_regulations':
      return searchEmploymentRegulations(params.query as string);
    
    case 'search_environmental_regulations':
      return searchEnvironmentalRegulations(params.query as string);
    
    case 'search_state_employment_bills':
      return searchStateEmploymentBills(params.state as JurisdictionCode | undefined);
    
    case 'search_state_ip_bills':
      return searchStateIPBills(params.state as JurisdictionCode | undefined);
    
    default:
      return {
        success: false,
        error: `Unknown legal tool: ${toolName}`,
        source: 'unknown',
      };
  }
}

export default {
  searchFederalRegulations,
  searchStateBills,
  getRecentStateBills,
  searchEmploymentRegulations,
  searchEnvironmentalRegulations,
  searchStateEmploymentBills,
  searchStateIPBills,
  getStateLegislators,
  executeLegalTool,
  LEGAL_TOOL_DEFINITIONS,
};
