// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

interface LegalResult { id: string; title: string; citation?: string; source: string; relevance: number; snippet: string; date?: string; url?: string }

const SAMPLE_CASES: LegalResult[] = [
  { id: 'c1', title: 'Brown v. Board of Education', citation: '347 U.S. 483 (1954)', source: 'caselaw', relevance: 0.95, snippet: 'Separate educational facilities are inherently unequal.', date: '1954-05-17' },
  { id: 'c2', title: 'Miranda v. Arizona', citation: '384 U.S. 436 (1966)', source: 'caselaw', relevance: 0.88, snippet: 'The person in custody must be informed of rights prior to questioning.', date: '1966-06-13' },
  { id: 'c3', title: 'Roe v. Wade', citation: '410 U.S. 113 (1973)', source: 'caselaw', relevance: 0.82, snippet: 'Right to privacy extends to a woman\'s decision to have an abortion.', date: '1973-01-22' },
  { id: 'c4', title: 'Citizens United v. FEC', citation: '558 U.S. 310 (2010)', source: 'caselaw', relevance: 0.78, snippet: 'Political speech does not lose First Amendment protection.', date: '2010-01-21' },
];

class LegalResearchServiceImpl {
  private apiKeys: Record<string, string> = {};
  private toolHistory: any[] = [];
  private cache = new Map<string, any>();

  getStatus() {
    return { service: 'LegalResearchService', status: 'operational', sources: ['caselaw', 'regulations', 'stateBills', 'federalRegister', 'sec', 'westlaw'], apiKeysConfigured: Object.keys(this.apiKeys), cacheSize: this.cache.size };
  }

  private search(query: string, items: LegalResult[], opts?: { limit?: number }): LegalResult[] {
    const q = query.toLowerCase();
    return items.filter(r => r.title.toLowerCase().includes(q) || r.snippet.toLowerCase().includes(q) || r.citation?.toLowerCase().includes(q))
      .sort((a, b) => b.relevance - a.relevance).slice(0, opts?.limit || 20);
  }

  async searchCases(query: string, opts?: any): Promise<LegalResult[]> {
    this.logTool('searchCases', { query, ...opts });
    return this.search(query, SAMPLE_CASES, opts);
  }

  async getCaseByCitation(citation: string): Promise<LegalResult | undefined> {
    this.logTool('getCaseByCitation', { citation });
    return SAMPLE_CASES.find(c => c.citation === citation);
  }

  async searchRegulations(query: string, opts?: any): Promise<LegalResult[]> {
    this.logTool('searchRegulations', { query, ...opts });
    return [{ id: 'reg1', title: `${opts?.title || 'CFR'} - ${query}`, source: 'regulations', relevance: 0.85, snippet: `Federal regulation related to "${query}".` }];
  }

  async searchStateBills(query: string, opts?: any): Promise<LegalResult[]> {
    this.logTool('searchStateBills', { query, ...opts });
    return [{ id: 'sb1', title: `${opts?.state || 'Multi-state'} Bill - ${query}`, source: 'stateBills', relevance: 0.80, snippet: `State legislation related to "${query}".` }];
  }

  async searchFederalRegister(query: string, opts?: any): Promise<LegalResult[]> {
    this.logTool('searchFederalRegister', { query, ...opts });
    return [{ id: 'fr1', title: `Federal Register Notice - ${query}`, source: 'federalRegister', relevance: 0.82, snippet: `Federal notice regarding "${query}".`, date: new Date().toISOString().slice(0, 10) }];
  }

  async searchSECFilings(cik: string, opts?: any): Promise<LegalResult[]> {
    this.logTool('searchSECFilings', { cik, ...opts });
    return [{ id: 'sec1', title: `SEC Filing - CIK ${cik}`, source: 'sec', relevance: 0.87, snippet: `${opts?.form || '10-K'} filing for entity ${cik}.` }];
  }

  async searchWestlaw(query: string, opts?: any): Promise<LegalResult[]> {
    this.logTool('searchWestlaw', { query, ...opts });
    if (!this.apiKeys['westlaw']) return [];
    return [{ id: 'wl1', title: `Westlaw Result - ${query}`, source: 'westlaw', relevance: 0.90, snippet: `Premium legal research result for "${query}".` }];
  }

  async getWestlawDocument(documentId: string): Promise<LegalResult | undefined> {
    this.logTool('getWestlawDocument', { documentId });
    if (!this.apiKeys['westlaw']) return undefined;
    return { id: documentId, title: `Westlaw Document ${documentId}`, source: 'westlaw', relevance: 1.0, snippet: 'Full document content.' };
  }

  async unifiedSearch(query: string, opts?: any): Promise<LegalResult[]> {
    this.logTool('unifiedSearch', { query, ...opts });
    const sources: string[] = opts?.sources || ['caselaw', 'regulations'];
    const results: LegalResult[] = [];
    if (sources.includes('caselaw')) results.push(...await this.searchCases(query, opts));
    if (sources.includes('regulations')) results.push(...await this.searchRegulations(query, opts));
    if (sources.includes('stateBills')) results.push(...await this.searchStateBills(query, opts));
    if (sources.includes('federalRegister')) results.push(...await this.searchFederalRegister(query, opts));
    return results.sort((a, b) => b.relevance - a.relevance).slice(0, opts?.limit || 20);
  }

  async executeTool(tool: string, params: any) {
    this.logTool(tool, params);
    const fn = (this as any)[tool];
    if (typeof fn === 'function') { const results = await fn.call(this, params.query || params.citation || params.cik, params); return { success: true, tool, results }; }
    return { success: false, tool, error: `Unknown tool: ${tool}` };
  }

  formatResultsForAgent(results: LegalResult[]): string {
    if (!results.length) return 'No results found.';
    return results.map((r, i) => `[${i + 1}] ${r.title}${r.citation ? ` (${r.citation})` : ''}\n    ${r.snippet}`).join('\n\n');
  }

  getToolCallHistory() { return this.toolHistory; }

  setApiKeys(keys: Record<string, string>) { Object.assign(this.apiKeys, keys); }

  clearCache() { this.cache.clear(); }

  private logTool(tool: string, params: any) { this.toolHistory.push({ tool, params, timestamp: new Date().toISOString() }); if (this.toolHistory.length > 500) this.toolHistory.shift(); }
}

export const legalResearchService = new LegalResearchServiceImpl();
