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
}

export const caseImportService = new CaseImportServiceImpl();
