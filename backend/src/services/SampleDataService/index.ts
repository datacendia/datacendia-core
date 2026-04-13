// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

interface DatasetDef { id: string; name: string; description: string; tables: string[]; category: string }

const DATASETS: DatasetDef[] = [
  { id: 'ecommerce', name: 'E-Commerce', description: 'Online retail sample data', tables: ['customers', 'orders', 'products', 'reviews'], category: 'retail' },
  { id: 'healthcare', name: 'Healthcare', description: 'Patient and claims data', tables: ['patients', 'encounters', 'claims', 'providers'], category: 'healthcare' },
  { id: 'financial', name: 'Financial', description: 'Banking transaction data', tables: ['accounts', 'transactions', 'customers', 'loans'], category: 'finance' },
  { id: 'hr', name: 'Human Resources', description: 'Employee data', tables: ['employees', 'departments', 'roles', 'reviews'], category: 'hr' },
];

class SampleDataServiceImpl {
  getAvailableDatasets() { return DATASETS; }

  getDataset(id: string): DatasetDef | null { return DATASETS.find(d => d.id === id) || null; }

  getDatasetStats(id: string, scale = 1) {
    const ds = this.getDataset(id);
    if (!ds) return null;
    return { id, name: ds.name, tables: ds.tables.map(t => ({ name: t, recordCount: Math.round(1000 * scale), columns: 8 })), totalRecords: Math.round(ds.tables.length * 1000 * scale) };
  }

  generateSQL(id: string, scale = 1) {
    const ds = this.getDataset(id);
    if (!ds) return '';
    return ds.tables.map(t => `-- ${t}\nCREATE TABLE ${t} (id SERIAL PRIMARY KEY, created_at TIMESTAMP DEFAULT NOW());\n-- ~${Math.round(1000 * scale)} rows`).join('\n\n');
  }

  generateDataset(id: string, scale = 1) {
    const ds = this.getDataset(id);
    if (!ds) return [];
    return ds.tables.map(t => {
      const count = Math.max(1, Math.round(10 * scale));
      const records = Array.from({ length: count }, (_, i) => ({ id: i + 1, name: `${t}_record_${i + 1}`, createdAt: new Date().toISOString() }));
      return { table: t, records };
    });
  }
}

export const sampleDataService = new SampleDataServiceImpl();
