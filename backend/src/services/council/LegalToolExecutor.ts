// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * LEGAL TOOL EXECUTOR FOR COUNCIL
 * Wires legal research tools into the Council deliberation flow
 * 
 * This allows Council agents to execute legal research during deliberation:
 * - Search case law
 * - Search federal regulations
 * - Search state bills
 * - Search Federal Register
 * - Search SEC filings
 */

import { ToolCallTracer } from './CouncilDecisionPacketService.js';

// LegalSearchResult defined locally to avoid compile-time dependency on enterprise legal/ module
export interface LegalSearchResult {
  title: string;
  citation?: string;
  source: string;
  summary?: string;
  url?: string;
  date?: string;
  relevanceScore?: number;
  [key: string]: unknown;
}

/**
 * Dynamically load the enterprise LegalResearchService.
 * Returns null if the module is not available (community edition).
 */
async function getLegalResearchService(): Promise<any | null> {
  try {
    const mod = await import('../legal/LegalResearchService.js');
    return mod.legalResearchService;
  } catch {
    return null;
  }
}

export interface LegalToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, {
      type: string;
      description: string;
      enum?: string[];
    }>;
    required: string[];
  };
}

export interface LegalToolResult {
  success: boolean;
  toolName: string;
  results: LegalSearchResult[] | undefined;
  formatted: string | undefined;
  error: string | undefined;
  durationMs: number;
  source: string;
}

// Tool definitions for Council agents
export const LEGAL_TOOL_DEFINITIONS: LegalToolDefinition[] = [
  {
    name: 'search_cases',
    description: 'Search case law from the Caselaw Access Project. Returns relevant court cases with citations, dates, and summaries.',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query for case law (e.g., "trade secret misappropriation", "employment discrimination")',
        },
        jurisdiction: {
          type: 'string',
          description: 'Jurisdiction filter (e.g., "us", "cal", "tex")',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results (default: 10)',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'search_regulations',
    description: 'Search the Code of Federal Regulations (CFR) for federal agency rules and regulations.',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query for regulations',
        },
        title: {
          type: 'number',
          description: 'CFR title number (e.g., 29 for Labor, 40 for EPA, 37 for Patents)',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results (default: 10)',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'search_state_bills',
    description: 'Search state legislation across all 50 US states using Open States API.',
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
          enum: ['al', 'ak', 'az', 'ar', 'ca', 'co', 'ct', 'de', 'fl', 'ga', 'hi', 'id', 'il', 'in', 'ia', 'ks', 'ky', 'la', 'me', 'md', 'ma', 'mi', 'mn', 'ms', 'mo', 'mt', 'ne', 'nv', 'nh', 'nj', 'nm', 'ny', 'nc', 'nd', 'oh', 'ok', 'or', 'pa', 'ri', 'sc', 'sd', 'tn', 'tx', 'ut', 'vt', 'va', 'wa', 'wv', 'wi', 'wy', 'dc', 'pr'],
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results (default: 10)',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'search_federal_register',
    description: 'Search the Federal Register for federal rules, proposed rules, and agency notices.',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query',
        },
        type: {
          type: 'string',
          description: 'Document type filter',
          enum: ['RULE', 'PRORULE', 'NOTICE'],
        },
        agency: {
          type: 'string',
          description: 'Agency slug (e.g., "labor-department", "environmental-protection-agency")',
        },
        days: {
          type: 'number',
          description: 'Limit to documents from last N days',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results (default: 10)',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'search_sec_filings',
    description: 'Search SEC EDGAR for corporate filings (10-K, 10-Q, 8-K, contracts, etc.).',
    parameters: {
      type: 'object',
      properties: {
        cik: {
          type: 'string',
          description: 'Company CIK number (e.g., "320193" for Apple)',
        },
        form: {
          type: 'string',
          description: 'Filing type filter (e.g., "10-K", "8-K", "DEF 14A")',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results (default: 10)',
        },
      },
      required: ['cik'],
    },
  },
  {
    name: 'search_westlaw',
    description: 'Search Westlaw (Thomson Reuters) for case law, statutes, regulations, and secondary sources. Requires enterprise API key.',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query for Westlaw (e.g., "fiduciary duty breach", "GDPR enforcement action")',
        },
        jurisdiction: {
          type: 'string',
          description: 'Jurisdiction filter (e.g., "federal", "california", "uk", "eu")',
        },
        contentType: {
          type: 'string',
          description: 'Type of legal content to search',
          enum: ['cases', 'statutes', 'regulations', 'secondary'],
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results (default: 10)',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'unified_legal_search',
    description: 'Search across multiple legal sources simultaneously (cases, regulations, bills, Federal Register).',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query',
        },
        sources: {
          type: 'array',
          description: 'Sources to search (default: all)',
        },
        jurisdiction: {
          type: 'string',
          description: 'Jurisdiction filter for cases and bills',
        },
        limit: {
          type: 'number',
          description: 'Maximum results per source (default: 5)',
        },
      },
      required: ['query'],
    },
  },
];

/**
 * Execute a legal tool and return results
 */
export async function executeLegalTool(
  toolName: string,
  params: Record<string, unknown>,
  tracer?: ToolCallTracer
): Promise<LegalToolResult> {
  const startTime = Date.now();
  const callId = tracer?.startCall(toolName, params);

  try {
    const service = await getLegalResearchService();
    if (!service) {
      const durationMs = Date.now() - startTime;
      return {
        success: false,
        toolName,
        results: undefined,
        formatted: undefined,
        error: 'Legal research tools require Enterprise Edition. See COMMUNITY.md for details.',
        durationMs,
        source: 'unavailable',
      };
    }

    const result = await service.executeTool(toolName, params);
    const durationMs = Date.now() - startTime;

    const toolResult: LegalToolResult = {
      success: result.success,
      toolName,
      results: result.results,
      formatted: result.results 
        ? service.formatResultsForAgent(result.results)
        : undefined,
      error: result.error,
      durationMs,
      source: result.source,
    };

    if (callId && tracer) {
      tracer.endCall(callId, {
        resultCount: result.results?.length || 0,
        source: result.source,
        durationMs,
      }, result.success, result.error);
    }

    return toolResult;
  } catch (error) {
    const durationMs = Date.now() - startTime;
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';

    if (callId && tracer) {
      tracer.endCall(callId, { error: errorMsg }, false, errorMsg);
    }

    return {
      success: false,
      toolName,
      results: undefined,
      formatted: undefined,
      error: errorMsg,
      durationMs,
      source: 'error',
    };
  }
}

/**
 * Check if a tool name is a legal research tool
 */
export function isLegalTool(toolName: string): boolean {
  const legalToolNames = LEGAL_TOOL_DEFINITIONS.map(t => t.name);
  return legalToolNames.includes(toolName) || 
         toolName.startsWith('search_') ||
         toolName === 'unified_legal_search';
}

/**
 * Get tool definition by name
 */
export function getLegalToolDefinition(toolName: string): LegalToolDefinition | undefined {
  return LEGAL_TOOL_DEFINITIONS.find(t => t.name === toolName);
}

/**
 * Format tool definitions for agent system prompt
 */
export function formatLegalToolsForSystemPrompt(): string {
  return `
## Available Legal Research Tools

You have access to the following legal research tools. Use them to find relevant case law, regulations, and legislation to support your analysis.

${LEGAL_TOOL_DEFINITIONS.map(tool => `
### ${tool.name}
${tool.description}

Parameters:
${Object.entries(tool.parameters.properties).map(([name, prop]) => 
  `- **${name}**${tool.parameters.required.includes(name) ? ' (required)' : ''}: ${prop.description}`
).join('\n')}
`).join('\n')}

To use a tool, format your request as:
\`\`\`tool
{
  "name": "tool_name",
  "params": { ... }
}
\`\`\`
`;
}

/**
 * Parse tool calls from agent response
 */
export function parseToolCallsFromResponse(response: string): Array<{
  name: string;
  params: Record<string, unknown>;
}> {
  const toolCalls: Array<{ name: string; params: Record<string, unknown> }> = [];
  
  // Match ```tool ... ``` blocks
  const toolBlockRegex = /```tool\s*([\s\S]*?)```/g;
  let match;
  
  while ((match = toolBlockRegex.exec(response)) !== null) {
    try {
      const matchContent = match[1];
      if (!matchContent) continue;
      const parsed = JSON.parse(matchContent.trim());
      if (parsed.name && typeof parsed.name === 'string') {
        toolCalls.push({
          name: parsed.name,
          params: parsed.params || {},
        });
      }
    } catch {
      // Skip malformed tool calls
    }
  }
  
  return toolCalls;
}

/**
 * Execute all tool calls from an agent response
 */
export async function executeToolCallsFromResponse(
  response: string,
  tracer?: ToolCallTracer
): Promise<LegalToolResult[]> {
  const toolCalls = parseToolCallsFromResponse(response);
  const results: LegalToolResult[] = [];
  
  for (const call of toolCalls) {
    if (isLegalTool(call.name)) {
      const result = await executeLegalTool(call.name, call.params, tracer);
      results.push(result);
    }
  }
  
  return results;
}

export default {
  LEGAL_TOOL_DEFINITIONS,
  executeLegalTool,
  isLegalTool,
  getLegalToolDefinition,
  formatLegalToolsForSystemPrompt,
  parseToolCallsFromResponse,
  executeToolCallsFromResponse,
};
