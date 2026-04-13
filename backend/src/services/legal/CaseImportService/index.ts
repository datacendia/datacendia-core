// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import crypto from 'node:crypto';

class CaseImportServiceImpl {
  parseCAPBulkJSON(jsonContent: string, importedBy: string): { cases: any[]; errors: string[] } {
    try {
      const raw = JSON.parse(jsonContent);
      const items = Array.isArray(raw) ? raw : raw.results || [raw];
      const cases: any[] = [];
      const errors: string[] = [];
      for (const item of items) {
        try {
          cases.push({ id: crypto.randomUUID(), citation: item.citation || item.name_abbreviation || 'Unknown', title: item.name || item.name_abbreviation || 'Untitled', court: item.court?.name || 'Unknown', date: item.decision_date || new Date().toISOString().slice(0, 10), jurisdiction: item.jurisdiction?.name || 'Unknown', content: item.casebody?.data?.opinions?.[0]?.text || '', sourceSystem: 'cap', importedBy, importedAt: new Date().toISOString() });
        } catch (e) { errors.push(`Failed to parse case: ${(e as Error).message}`); }
      }
      return { cases, errors };
    } catch (e) { return { cases: [], errors: [`Invalid JSON: ${(e as Error).message}`] }; }
  }

  parseCourtListenerCases(cases: any[], importedBy: string): any[] {
    return cases.map(item => ({
      id: crypto.randomUUID(),
      citation: item.citation || item.case_name_short || 'Unknown',
      title: item.case_name || item.case_name_short || 'Untitled',
      court: item.court || 'Unknown',
      date: item.date_filed || new Date().toISOString().slice(0, 10),
      jurisdiction: item.jurisdiction || 'Unknown',
      content: item.plain_text || item.html || '',
      sourceSystem: 'courtlistener',
      importedBy,
      importedAt: new Date().toISOString(),
    }));
  }

  parseCSV(csvContent: string, importedBy: string): { cases: any[]; errors: string[] } {
    const cases: any[] = [];
    const errors: string[] = [];
    const lines = csvContent.trim().split('\n');
    if (lines.length < 2) return { cases, errors: ['CSV must have a header row and at least one data row'] };
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    for (let i = 1; i < lines.length; i++) {
      try {
        const values = lines[i].split(',').map(v => v.trim());
        const row: Record<string, string> = {};
        headers.forEach((h, idx) => { row[h] = values[idx] || ''; });
        if (!row.citation && !row.title) { errors.push(`Row ${i}: missing citation and title`); continue; }
        cases.push({
          id: crypto.randomUUID(),
          citation: row.citation || 'Unknown',
          title: row.title || 'Untitled',
          court: row.court || 'Unknown',
          date: row.date_decided || new Date().toISOString().slice(0, 10),
          jurisdiction: row.jurisdiction || 'Unknown',
          content: row.summary || '',
          sourceSystem: 'csv',
          importedBy,
          importedAt: new Date().toISOString(),
        });
      } catch (e) { errors.push(`Row ${i}: ${(e as Error).message}`); }
    }
    return { cases, errors };
  }
}

export const caseImportService = new CaseImportServiceImpl();
