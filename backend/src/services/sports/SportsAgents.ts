// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

const AGENT_PRESETS = [
  { id: 'sporting-director', role: 'Sporting Director AI', displayLabel: 'Sporting Director', description: 'Strategic analysis of squad needs, player fit, and long-term sporting vision', expertise: ['squad-analysis', 'tactical-fit', 'squad-balance'], workflows: ['transfer-inbound', 'transfer-outbound', 'squad-planning'], responseStyle: 'analytical', customizableLabel: true, model: 'gpt-4o-mini', temperature: 0.3, maxTokens: 2000, systemPrompt: 'You are a world-class sporting director AI. Analyze transfers from a sporting perspective: squad needs, tactical fit, player trajectory, and long-term value.' },
  { id: 'chief-scout', role: 'Chief Scout AI', displayLabel: 'Chief Scout', description: 'Deep scouting analysis with performance metrics, playing style, and comparable players', expertise: ['player-profiling', 'performance-metrics', 'comparables'], workflows: ['transfer-inbound', 'scouting'], responseStyle: 'detailed', customizableLabel: true, model: 'gpt-4o-mini', temperature: 0.2, maxTokens: 3000, systemPrompt: 'You are a chief scout AI. Provide detailed scouting reports with statistical analysis, stylistic profiles, and comparable player assessments.' },
  { id: 'financial-controller', role: 'Financial Controller AI', displayLabel: 'Financial Controller', description: 'Financial Fair Play compliance, amortization, and budget impact analysis', expertise: ['ffp-compliance', 'amortization', 'budget-impact'], workflows: ['transfer-inbound', 'transfer-outbound', 'contract-renewal'], responseStyle: 'precise', customizableLabel: true, model: 'gpt-4o-mini', temperature: 0.1, maxTokens: 2000, systemPrompt: 'You are a financial controller AI for a football club. Analyze all transactions for FFP compliance, amortization impact, wage-to-revenue ratios, and budget sustainability.' },
  { id: 'legal-counsel', role: 'Legal Counsel AI', displayLabel: 'Legal Counsel', description: 'Regulatory compliance, contract structure, and legal risk assessment', expertise: ['fifa-regulations', 'contract-law', 'tpi-risk'], workflows: ['transfer-inbound', 'transfer-outbound', 'contract-renewal', 'dispute-resolution'], responseStyle: 'formal', customizableLabel: true, model: 'gpt-4o-mini', temperature: 0.1, maxTokens: 2500, systemPrompt: 'You are legal counsel AI for a football club. Assess regulatory compliance (FIFA RSTP, UEFA licensing, domestic rules), contract structure, agent fee compliance, and litigation risk.' },
  { id: 'performance-analyst', role: 'Performance Analyst AI', displayLabel: 'Performance Analyst', description: 'Data-driven performance analysis, injury risk, and physical profiling', expertise: ['match-analytics', 'physical-profiling', 'injury-risk'], workflows: ['transfer-inbound', 'scouting', 'squad-planning'], responseStyle: 'data-driven', customizableLabel: true, model: 'gpt-4o-mini', temperature: 0.2, maxTokens: 2000, systemPrompt: 'You are a performance analyst AI. Provide data-driven analysis of player performance metrics, physical profiles, injury history/risk, and expected contribution.' },
  { id: 'fan-engagement', role: 'Fan Engagement AI', displayLabel: 'Fan & Commercial', description: 'Commercial impact, marketability, and fan sentiment analysis', expertise: ['commercial-value', 'marketability', 'fan-sentiment'], workflows: ['transfer-inbound', 'commercial'], responseStyle: 'engaging', customizableLabel: true, model: 'gpt-4o-mini', temperature: 0.4, maxTokens: 1500, systemPrompt: 'You are a fan engagement and commercial AI. Analyze the commercial impact of transfers: shirt sales, social media growth, sponsorship implications, and fan sentiment.' },
];

export const SPORTS_AGENT_PRESETS = AGENT_PRESETS;

class SportsAgentServiceImpl {
  getAgentPreset(id: string) { return AGENT_PRESETS.find(a => a.id === id) || null; }

  getRecommendedAgents(workflow: string) { return AGENT_PRESETS.filter(a => a.workflows.includes(workflow)); }

  getWorkflows() {
    const wf = new Set<string>();
    for (const a of AGENT_PRESETS) for (const w of a.workflows) wf.add(w);
    return [...wf].map(id => ({ id, name: id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()), agentCount: AGENT_PRESETS.filter(a => a.workflows.includes(id)).length }));
  }

  async buildAgentPrompt(agent: any, context: { workflow: string; player?: any; financials?: any; additionalContext?: string }) {
    let prompt = agent.systemPrompt;
    if (context.player) prompt += `\n\nPLAYER CONTEXT:\n${JSON.stringify(context.player, null, 2)}`;
    if (context.financials) prompt += `\n\nFINANCIAL CONTEXT:\n${JSON.stringify(context.financials, null, 2)}`;
    if (context.additionalContext) prompt += `\n\nADDITIONAL CONTEXT:\n${context.additionalContext}`;
    prompt += `\n\nWorkflow: ${context.workflow}`;
    return prompt;
  }
}

export const sportsAgentService = new SportsAgentServiceImpl();
