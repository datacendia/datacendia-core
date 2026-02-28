// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// EXPORT & COMPARISON KIT
// Universal export toolbar, side-by-side comparison, and PDF export
// =============================================================================

import React, { useState, useCallback, useRef } from 'react';
import {
  Download,
  FileText,
  FileJson,
  Table,
  Clipboard,
  Check,
  Printer,
  ArrowLeftRight,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronDown,
  Columns,
} from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

export interface ExportColumn {
  key: string;
  label: string;
  include?: boolean;
}

export interface ComparisonItem {
  label: string;
  valueA: string | number;
  valueB: string | number;
  format?: 'number' | 'percent' | 'currency' | 'text';
  higherIsBetter?: boolean;
}

// =============================================================================
// DELTA BADGE — Change indicator between two values
// =============================================================================

export const DeltaBadge: React.FC<{
  valueA: number;
  valueB: number;
  format?: 'number' | 'percent' | 'currency';
  higherIsBetter?: boolean;
}> = ({ valueA, valueB, format = 'number', higherIsBetter = true }) => {
  const delta = valueB - valueA;
  const pctChange = valueA !== 0 ? ((valueB - valueA) / Math.abs(valueA)) * 100 : 0;
  const isPositive = higherIsBetter ? delta > 0 : delta < 0;
  const isNegative = higherIsBetter ? delta < 0 : delta > 0;

  const formatValue = (v: number) => {
    if (format === 'currency') return `$${Math.abs(v).toLocaleString()}`;
    if (format === 'percent') return `${Math.abs(v).toFixed(1)}%`;
    return Math.abs(v).toLocaleString();
  };

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
      isPositive ? 'bg-emerald-500/20 text-emerald-400' :
      isNegative ? 'bg-red-500/20 text-red-400' :
      'bg-gray-500/20 text-gray-400'
    }`}>
      {delta > 0 && <TrendingUp className="w-3 h-3" />}
      {delta < 0 && <TrendingDown className="w-3 h-3" />}
      {delta === 0 && <Minus className="w-3 h-3" />}
      {delta > 0 ? '+' : delta < 0 ? '-' : ''}{formatValue(Math.abs(delta))}
      <span className="text-gray-500 ml-0.5">({pctChange > 0 ? '+' : ''}{pctChange.toFixed(1)}%)</span>
    </div>
  );
};

// =============================================================================
// EXPORT TOOLBAR — Universal CSV/JSON/PDF/Clipboard export
// =============================================================================

export const ExportToolbar: React.FC<{
  data: Record<string, any>[];
  columns: ExportColumn[];
  filename?: string;
  title?: string;
  onExport?: (format: string, data: string) => void;
}> = ({ data, columns, filename = 'export', title, onExport }) => {
  const [copied, setCopied] = useState(false);
  const [showColumnPicker, setShowColumnPicker] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<Set<string>>(
    new Set(columns.filter(c => c.include !== false).map(c => c.key))
  );

  const getFilteredData = useCallback(() => {
    const cols = columns.filter(c => selectedColumns.has(c.key));
    return data.map(row => {
      const filtered: Record<string, any> = {};
      cols.forEach(c => { filtered[c.label] = row[c.key]; });
      return filtered;
    });
  }, [data, columns, selectedColumns]);

  const exportCSV = useCallback(() => {
    const cols = columns.filter(c => selectedColumns.has(c.key));
    const header = cols.map(c => `"${c.label}"`).join(',');
    const rows = data.map(row =>
      cols.map(c => {
        const val = row[c.key];
        return typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val;
      }).join(',')
    );
    const csv = [header, ...rows].join('\n');
    downloadFile(csv, `${filename}.csv`, 'text/csv');
    onExport?.('csv', csv);
  }, [data, columns, selectedColumns, filename, onExport]);

  const exportJSON = useCallback(() => {
    const json = JSON.stringify(getFilteredData(), null, 2);
    downloadFile(json, `${filename}.json`, 'application/json');
    onExport?.('json', json);
  }, [getFilteredData, filename, onExport]);

  const copyToClipboard = useCallback(async () => {
    const cols = columns.filter(c => selectedColumns.has(c.key));
    const header = cols.map(c => c.label).join('\t');
    const rows = data.map(row =>
      cols.map(c => String(row[c.key] ?? '')).join('\t')
    );
    const text = [header, ...rows].join('\n');
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onExport?.('clipboard', text);
  }, [data, columns, selectedColumns, onExport]);

  const printView = useCallback(() => {
    const cols = columns.filter(c => selectedColumns.has(c.key));
    const html = `
      <!DOCTYPE html>
      <html><head>
        <title>${title || filename}</title>
        <style>
          body { font-family: system-ui, sans-serif; padding: 2rem; color: #111; }
          h1 { font-size: 1.5rem; margin-bottom: 0.25rem; }
          .meta { color: #666; font-size: 0.8rem; margin-bottom: 1.5rem; }
          table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
          th { background: #f3f4f6; text-align: left; padding: 8px 12px; border-bottom: 2px solid #ddd; font-weight: 600; }
          td { padding: 6px 12px; border-bottom: 1px solid #eee; }
          tr:nth-child(even) { background: #f9fafb; }
          .footer { margin-top: 2rem; font-size: 0.75rem; color: #999; border-top: 1px solid #eee; padding-top: 1rem; }
        </style>
      </head><body>
        <h1>${title || 'Data Export'}</h1>
        <div class="meta">Generated ${new Date().toLocaleString()} · ${data.length} records · Datacendia Platform</div>
        <table>
          <thead><tr>${cols.map(c => `<th>${c.label}</th>`).join('')}</tr></thead>
          <tbody>${data.map(row => `<tr>${cols.map(c => `<td>${row[c.key] ?? ''}</td>`).join('')}</tr>`).join('')}</tbody>
        </table>
        <div class="footer">© ${new Date().getFullYear()} Datacendia, LLC · Confidential</div>
      </body></html>
    `;
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(html);
      win.document.close();
      win.print();
    }
    onExport?.('pdf', html);
  }, [data, columns, selectedColumns, title, filename, onExport]);

  const toggleColumn = (key: string) => {
    const next = new Set(selectedColumns);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setSelectedColumns(next);
  };

  return (
    <div className="flex items-center gap-1 relative">
      {/* Column Picker */}
      <div className="relative">
        <button
          onClick={() => setShowColumnPicker(!showColumnPicker)}
          className="flex items-center gap-1 px-2 py-1.5 text-xs bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
        >
          <Columns className="w-3 h-3" />
          Columns
          <ChevronDown className="w-3 h-3" />
        </button>
        {showColumnPicker && (
          <div className="absolute top-full mt-1 left-0 z-50 bg-gray-800 border border-gray-700 rounded-lg p-2 shadow-xl min-w-[160px]">
            {columns.map(c => (
              <label key={c.key} className="flex items-center gap-2 px-2 py-1 text-xs text-gray-300 hover:bg-gray-700 rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedColumns.has(c.key)}
                  onChange={() => toggleColumn(c.key)}
                  className="rounded border-gray-600"
                />
                {c.label}
              </label>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={exportCSV}
        className="flex items-center gap-1 px-2 py-1.5 text-xs bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
        title="Export CSV"
      >
        <Table className="w-3 h-3" /> CSV
      </button>

      <button
        onClick={exportJSON}
        className="flex items-center gap-1 px-2 py-1.5 text-xs bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
        title="Export JSON"
      >
        <FileJson className="w-3 h-3" /> JSON
      </button>

      <button
        onClick={copyToClipboard}
        className="flex items-center gap-1 px-2 py-1.5 text-xs bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
        title="Copy to clipboard"
      >
        {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Clipboard className="w-3 h-3" />}
        {copied ? 'Copied' : 'Copy'}
      </button>

      <button
        onClick={printView}
        className="flex items-center gap-1 px-2 py-1.5 text-xs bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
        title="Print / PDF"
      >
        <Printer className="w-3 h-3" /> PDF
      </button>
    </div>
  );
};

// =============================================================================
// COMPARISON PANEL — Side-by-side A/B analysis
// =============================================================================

export const ComparisonPanel: React.FC<{
  title?: string;
  labelA: string;
  labelB: string;
  items: ComparisonItem[];
  showDelta?: boolean;
}> = ({ title = 'Comparison', labelA, labelB, items, showDelta = true }) => {
  const formatValue = (value: string | number, format?: string) => {
    if (typeof value === 'string') return value;
    if (format === 'currency') return `$${value.toLocaleString()}`;
    if (format === 'percent') return `${value.toFixed(1)}%`;
    return value.toLocaleString();
  };

  return (
    <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
        <ArrowLeftRight className="w-4 h-4 text-blue-400" />
        {title}
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-2 px-3 text-xs text-gray-500 font-medium">Metric</th>
              <th className="text-right py-2 px-3 text-xs font-medium text-blue-400">{labelA}</th>
              <th className="text-right py-2 px-3 text-xs font-medium text-purple-400">{labelB}</th>
              {showDelta && (
                <th className="text-right py-2 px-3 text-xs text-gray-500 font-medium">Delta</th>
              )}
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => {
              const numA = typeof item.valueA === 'number' ? item.valueA : parseFloat(item.valueA) || 0;
              const numB = typeof item.valueB === 'number' ? item.valueB : parseFloat(item.valueB) || 0;

              return (
                <tr key={i} className="border-b border-gray-800 hover:bg-gray-800/30">
                  <td className="py-2 px-3 text-gray-300">{item.label}</td>
                  <td className="py-2 px-3 text-right font-mono text-blue-300">
                    {formatValue(item.valueA, item.format)}
                  </td>
                  <td className="py-2 px-3 text-right font-mono text-purple-300">
                    {formatValue(item.valueB, item.format)}
                  </td>
                  {showDelta && typeof item.valueA === 'number' && typeof item.valueB === 'number' && (
                    <td className="py-2 px-3 text-right">
                      <DeltaBadge
                        valueA={numA}
                        valueB={numB}
                        format={item.format as any}
                        higherIsBetter={item.higherIsBetter}
                      />
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// =============================================================================
// PDF EXECUTIVE SUMMARY BUTTON
// =============================================================================

export const PDFExportButton: React.FC<{
  title: string;
  subtitle?: string;
  sections: Array<{
    heading: string;
    content: string;
    metrics?: Array<{ label: string; value: string }>;
  }>;
  branding?: { company: string; logo?: string };
}> = ({ title, subtitle, sections, branding = { company: 'Datacendia' } }) => {
  const [generating, setGenerating] = useState(false);

  const generate = () => {
    setGenerating(true);
    const html = `
      <!DOCTYPE html>
      <html><head>
        <title>${title}</title>
        <style>
          @page { margin: 1in; }
          body { font-family: 'Segoe UI', system-ui, sans-serif; color: #1a1a2e; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 2rem; }
          .header { border-bottom: 3px solid #2563eb; padding-bottom: 1rem; margin-bottom: 2rem; }
          .header h1 { font-size: 1.8rem; color: #1a1a2e; margin: 0; }
          .header .subtitle { color: #666; font-size: 0.95rem; margin-top: 0.25rem; }
          .header .meta { color: #999; font-size: 0.8rem; margin-top: 0.5rem; }
          .section { margin-bottom: 2rem; page-break-inside: avoid; }
          .section h2 { font-size: 1.2rem; color: #2563eb; border-left: 3px solid #2563eb; padding-left: 0.75rem; margin-bottom: 0.75rem; }
          .section p { color: #444; font-size: 0.9rem; }
          .metrics { display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 0.75rem; }
          .metric { background: #f3f4f6; padding: 0.75rem 1rem; border-radius: 8px; min-width: 120px; }
          .metric .value { font-size: 1.4rem; font-weight: 700; color: #1a1a2e; }
          .metric .label { font-size: 0.75rem; color: #666; }
          .footer { margin-top: 3rem; padding-top: 1rem; border-top: 1px solid #ddd; font-size: 0.75rem; color: #999; display: flex; justify-content: space-between; }
          .confidential { color: #dc2626; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
        </style>
      </head><body>
        <div class="header">
          <h1>${title}</h1>
          ${subtitle ? `<div class="subtitle">${subtitle}</div>` : ''}
          <div class="meta">Generated ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} · ${branding.company} Platform</div>
        </div>
        ${sections.map(s => `
          <div class="section">
            <h2>${s.heading}</h2>
            <p>${s.content}</p>
            ${s.metrics ? `<div class="metrics">${s.metrics.map(m => `
              <div class="metric">
                <div class="value">${m.value}</div>
                <div class="label">${m.label}</div>
              </div>
            `).join('')}</div>` : ''}
          </div>
        `).join('')}
        <div class="footer">
          <span class="confidential">Confidential</span>
          <span>© ${new Date().getFullYear()} ${branding.company}, LLC · All Rights Reserved</span>
        </div>
      </body></html>
    `;
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(html);
      win.document.close();
      setTimeout(() => {
        win.print();
        setGenerating(false);
      }, 500);
    } else {
      setGenerating(false);
    }
  };

  return (
    <button
      onClick={generate}
      disabled={generating}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
    >
      <FileText className="w-4 h-4" />
      {generating ? 'Generating...' : 'Executive Summary PDF'}
    </button>
  );
};

// =============================================================================
// HELPERS
// =============================================================================

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
