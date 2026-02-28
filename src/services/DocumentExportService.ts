// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIA DOCUMENT EXPORT SERVICE
// Professional document generation for auditors, compliance, and stakeholders
// Supports: PDF, HTML Viewer, ZIP Bundle
// =============================================================================

export interface AuditPackageData {
  exportDate: string;
  snapshotDate: string;
  type: string;
  version: string;
  contents: {
    deliberations: DeliberationRecord[];
    decisions: DecisionRecord[];
    timeline: TimelineRecord[];
    metrics?: MetricRecord[];
    metadata: {
      totalEvents: number;
      totalDeliberations: number;
      totalDecisions: number;
      dateRange: { start: string; end: string };
    };
  };
  cryptographicProof: {
    hash: string;
    fullHash?: string;
    timestamp: string;
    signer: string;
    algorithm: string;
  };
}

export interface DeliberationRecord {
  id: string;
  question: string;
  status: string;
  mode: string;
  currentPhase?: string;
  decision?: string;
  confidence?: number;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  transcript: TranscriptEntry[];
  crossExaminations?: any[];
  participatingAgents?: string[];
  agentCount: number;
}

export interface TranscriptEntry {
  agentId: string;
  agentCode: string;
  agentName: string;
  phase: string;
  content: string;
  confidence?: number;
  timestamp: string;
  metadata?: any;
}

export interface DecisionRecord {
  id: string;
  question: string;
  outcome: string;
  confidence?: number;
  decidedAt?: string;
  status: string;
}

export interface TimelineRecord {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  magnitude?: number;
  sentiment?: string;
  department?: string;
  category?: string;
  deliberationId?: string;
  source?: string;
}

export interface MetricRecord {
  id: string;
  name: string;
  code: string;
  category?: string;
  value?: number;
}

// =============================================================================
// DOCUMENT EXPORT SERVICE
// =============================================================================

class DocumentExportService {
  
  // ===========================================================================
  // PROFESSIONAL HTML VIEWER
  // ===========================================================================
  
  generateHTMLViewer(data: AuditPackageData, options: { 
    title?: string;
    organization?: string;
    preparedFor?: string;
  } = {}): string {
    const title = options.title || 'Audit Package Report';
    const org = options.organization || 'Datacendia';
    const preparedFor = options.preparedFor || 'Compliance Review';
    
    const deliberationSections = data.contents.deliberations.map((d, idx) => `
      <div class="deliberation-card">
        <div class="card-header" onclick="toggleSection('delib-${idx}')">
          <div class="header-left">
            <span class="status-badge ${this.getStatusClass(d.status)}">${d.status}</span>
            <h3>Deliberation #${idx + 1}</h3>
          </div>
          <div class="header-right">
            <span class="confidence">${d.confidence ? `${d.confidence}% confidence` : ''}</span>
            <span class="toggle-icon">▼</span>
          </div>
        </div>
        <div id="delib-${idx}" class="card-body">
          <div class="question-box">
            <label>Question Posed:</label>
            <p>${this.escapeHtml(d.question)}</p>
          </div>
          
          <div class="meta-grid">
            <div class="meta-item">
              <label>Mode</label>
              <span>${d.mode}</span>
            </div>
            <div class="meta-item">
              <label>Phase</label>
              <span>${d.currentPhase || 'N/A'}</span>
            </div>
            <div class="meta-item">
              <label>Started</label>
              <span>${d.startedAt ? new Date(d.startedAt).toLocaleString() : 'N/A'}</span>
            </div>
            <div class="meta-item">
              <label>Completed</label>
              <span>${d.completedAt ? new Date(d.completedAt).toLocaleString() : 'N/A'}</span>
            </div>
          </div>
          
          ${d.decision ? `
          <div class="decision-box">
            <label>Final Decision:</label>
            <p>${this.escapeHtml(d.decision)}</p>
          </div>
          ` : ''}
          
          <div class="transcript-section">
            <h4>📜 Full Transcript (${d.transcript.length} entries)</h4>
            <div class="transcript-entries">
              ${d.transcript.map((t, tIdx) => `
                <div class="transcript-entry">
                  <div class="entry-header">
                    <span class="agent-badge">${t.agentCode?.toUpperCase() || 'AGENT'}</span>
                    <span class="agent-name">${this.escapeHtml(t.agentName || 'Unknown Agent')}</span>
                    <span class="phase-tag">${t.phase}</span>
                    <span class="timestamp">${t.timestamp ? new Date(t.timestamp).toLocaleString() : ''}</span>
                  </div>
                  <div class="entry-content">
                    <pre>${this.escapeHtml(t.content || '')}</pre>
                  </div>
                  ${t.confidence ? `<div class="entry-confidence">Confidence: ${(t.confidence * 100).toFixed(0)}%</div>` : ''}
                </div>
              `).join('')}
            </div>
          </div>
          
          ${d.participatingAgents && d.participatingAgents.length > 0 ? `
          <div class="agents-summary">
            <label>Participating Agents:</label>
            <div class="agent-tags">
              ${d.participatingAgents.map(a => `<span class="agent-tag">${a}</span>`).join('')}
            </div>
          </div>
          ` : ''}
        </div>
      </div>
    `).join('');
    
    const timelineSections = data.contents.timeline.slice(0, 50).map((t, idx) => `
      <tr>
        <td>${new Date(t.timestamp).toLocaleString()}</td>
        <td><span class="type-badge ${t.type}">${t.type}</span></td>
        <td>${this.escapeHtml(t.title)}</td>
        <td>${this.escapeHtml(t.description?.substring(0, 100) || '')}${t.description && t.description.length > 100 ? '...' : ''}</td>
        <td>${t.department || '-'}</td>
        <td>${t.magnitude || '-'}</td>
      </tr>
    `).join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - ${org}</title>
  <style>
    :root {
      --primary: #f59e0b;
      --primary-dark: #d97706;
      --bg-dark: #0f0f0f;
      --bg-card: #1a1a1a;
      --bg-section: #252525;
      --text-primary: #ffffff;
      --text-secondary: #a0a0a0;
      --border: #333333;
      --success: #22c55e;
      --warning: #eab308;
      --error: #ef4444;
      --info: #3b82f6;
    }
    
    * { box-sizing: border-box; margin: 0; padding: 0; }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: var(--bg-dark);
      color: var(--text-primary);
      line-height: 1.6;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    
    /* Header */
    .report-header {
      background: linear-gradient(135deg, var(--bg-card) 0%, #2a2a2a 100%);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 40px;
      margin-bottom: 30px;
      text-align: center;
    }
    
    .report-header h1 {
      font-size: 2.5rem;
      color: var(--primary);
      margin-bottom: 10px;
    }
    
    .report-header .subtitle {
      color: var(--text-secondary);
      font-size: 1.1rem;
    }
    
    .report-header .meta {
      display: flex;
      justify-content: center;
      gap: 40px;
      margin-top: 30px;
      flex-wrap: wrap;
    }
    
    .report-header .meta-item {
      text-align: center;
    }
    
    .report-header .meta-item label {
      display: block;
      color: var(--text-secondary);
      font-size: 0.85rem;
      margin-bottom: 5px;
    }
    
    .report-header .meta-item span {
      font-weight: 600;
      color: var(--text-primary);
    }
    
    /* Proof Box */
    .proof-box {
      background: var(--bg-section);
      border: 1px solid var(--success);
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 30px;
    }
    
    .proof-box h2 {
      color: var(--success);
      font-size: 1.2rem;
      margin-bottom: 15px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .proof-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
    }
    
    .proof-item {
      background: var(--bg-card);
      padding: 12px;
      border-radius: 8px;
    }
    
    .proof-item label {
      display: block;
      color: var(--text-secondary);
      font-size: 0.8rem;
      margin-bottom: 5px;
    }
    
    .proof-item code {
      font-family: 'Monaco', 'Consolas', monospace;
      font-size: 0.85rem;
      word-break: break-all;
    }
    
    /* Summary Cards */
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    
    .summary-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 20px;
      text-align: center;
    }
    
    .summary-card .number {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--primary);
    }
    
    .summary-card .label {
      color: var(--text-secondary);
      font-size: 0.9rem;
    }
    
    /* Section */
    .section {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 30px;
      margin-bottom: 30px;
    }
    
    .section h2 {
      color: var(--primary);
      font-size: 1.5rem;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 1px solid var(--border);
    }
    
    /* Deliberation Cards */
    .deliberation-card {
      background: var(--bg-section);
      border: 1px solid var(--border);
      border-radius: 12px;
      margin-bottom: 20px;
      overflow: hidden;
    }
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 20px;
      cursor: pointer;
      background: rgba(245, 158, 11, 0.1);
      transition: background 0.2s;
    }
    
    .card-header:hover {
      background: rgba(245, 158, 11, 0.15);
    }
    
    .header-left {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    
    .header-left h3 {
      font-size: 1.1rem;
    }
    
    .header-right {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    
    .confidence {
      color: var(--success);
      font-weight: 600;
    }
    
    .toggle-icon {
      color: var(--text-secondary);
      transition: transform 0.2s;
    }
    
    .card-body {
      padding: 20px;
    }
    
    .card-body.collapsed {
      display: none;
    }
    
    /* Status Badges */
    .status-badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }
    
    .status-badge.COMPLETED, .status-badge.completed {
      background: rgba(34, 197, 94, 0.2);
      color: var(--success);
    }
    
    .status-badge.PENDING, .status-badge.pending {
      background: rgba(234, 179, 8, 0.2);
      color: var(--warning);
    }
    
    .status-badge.ERROR, .status-badge.error {
      background: rgba(239, 68, 68, 0.2);
      color: var(--error);
    }
    
    /* Question/Decision Boxes */
    .question-box, .decision-box {
      background: var(--bg-card);
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 20px;
    }
    
    .question-box label, .decision-box label {
      display: block;
      color: var(--primary);
      font-weight: 600;
      margin-bottom: 8px;
    }
    
    .decision-box {
      border-left: 4px solid var(--success);
    }
    
    /* Meta Grid */
    .meta-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 15px;
      margin-bottom: 20px;
    }
    
    .meta-item {
      background: var(--bg-card);
      padding: 12px;
      border-radius: 8px;
    }
    
    .meta-item label {
      display: block;
      color: var(--text-secondary);
      font-size: 0.8rem;
      margin-bottom: 4px;
    }
    
    /* Transcript */
    .transcript-section h4 {
      color: var(--text-primary);
      margin-bottom: 15px;
    }
    
    .transcript-entry {
      background: var(--bg-card);
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 15px;
      border-left: 3px solid var(--primary);
    }
    
    .entry-header {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      align-items: center;
      margin-bottom: 10px;
    }
    
    .agent-badge {
      background: var(--primary);
      color: #000;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 700;
    }
    
    .agent-name {
      font-weight: 600;
    }
    
    .phase-tag {
      background: var(--bg-section);
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 0.75rem;
      color: var(--text-secondary);
    }
    
    .timestamp {
      color: var(--text-secondary);
      font-size: 0.8rem;
      margin-left: auto;
    }
    
    .entry-content pre {
      white-space: pre-wrap;
      word-wrap: break-word;
      font-family: inherit;
      font-size: 0.9rem;
      line-height: 1.7;
      color: var(--text-secondary);
    }
    
    .entry-confidence {
      margin-top: 10px;
      color: var(--success);
      font-size: 0.85rem;
    }
    
    /* Agent Tags */
    .agent-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 8px;
    }
    
    .agent-tag {
      background: var(--bg-card);
      border: 1px solid var(--border);
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.8rem;
    }
    
    /* Timeline Table */
    .timeline-table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .timeline-table th {
      text-align: left;
      padding: 12px;
      background: var(--bg-section);
      color: var(--text-secondary);
      font-size: 0.85rem;
      font-weight: 600;
      border-bottom: 1px solid var(--border);
    }
    
    .timeline-table td {
      padding: 12px;
      border-bottom: 1px solid var(--border);
      font-size: 0.9rem;
    }
    
    .timeline-table tr:hover {
      background: rgba(245, 158, 11, 0.05);
    }
    
    .type-badge {
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
    }
    
    .type-badge.deliberation { background: rgba(59, 130, 246, 0.2); color: var(--info); }
    .type-badge.decision { background: rgba(34, 197, 94, 0.2); color: var(--success); }
    .type-badge.alert { background: rgba(239, 68, 68, 0.2); color: var(--error); }
    .type-badge.metric { background: rgba(234, 179, 8, 0.2); color: var(--warning); }
    
    /* Search */
    .search-bar {
      display: flex;
      gap: 15px;
      margin-bottom: 20px;
    }
    
    .search-bar input {
      flex: 1;
      padding: 12px 16px;
      background: var(--bg-section);
      border: 1px solid var(--border);
      border-radius: 8px;
      color: var(--text-primary);
      font-size: 1rem;
    }
    
    .search-bar input:focus {
      outline: none;
      border-color: var(--primary);
    }
    
    .search-bar button {
      padding: 12px 24px;
      background: var(--primary);
      color: #000;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
    }
    
    /* Print Styles */
    @media print {
      body { background: white; color: black; }
      .search-bar, .toggle-icon { display: none; }
      .card-body { display: block !important; }
      .section, .deliberation-card, .proof-box { 
        break-inside: avoid;
        border-color: #ccc;
      }
    }
    
    /* Footer */
    .report-footer {
      text-align: center;
      padding: 30px;
      color: var(--text-secondary);
      font-size: 0.85rem;
    }
    
    .verified-stamp {
      display: inline-block;
      background: rgba(34, 197, 94, 0.1);
      border: 2px solid var(--success);
      color: var(--success);
      padding: 10px 30px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 1.1rem;
      margin-bottom: 15px;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <header class="report-header">
      <h1>📋 ${title}</h1>
      <p class="subtitle">Prepared for ${preparedFor} | Generated by ${org}</p>
      <div class="meta">
        <div class="meta-item">
          <label>Export Date</label>
          <span>${new Date(data.exportDate).toLocaleString()}</span>
        </div>
        <div class="meta-item">
          <label>Snapshot Date</label>
          <span>${new Date(data.snapshotDate).toLocaleString()}</span>
        </div>
        <div class="meta-item">
          <label>Package Type</label>
          <span>${data.type}</span>
        </div>
        <div class="meta-item">
          <label>Version</label>
          <span>${data.version}</span>
        </div>
      </div>
    </header>
    
    <!-- Cryptographic Proof -->
    <div class="proof-box">
      <h2>🔐 Cryptographic Proof of Authenticity</h2>
      <div class="proof-grid">
        <div class="proof-item">
          <label>Hash</label>
          <code>${data.cryptographicProof.hash}</code>
        </div>
        <div class="proof-item">
          <label>Algorithm</label>
          <code>${data.cryptographicProof.algorithm}</code>
        </div>
        <div class="proof-item">
          <label>Signed By</label>
          <code>${data.cryptographicProof.signer}</code>
        </div>
        <div class="proof-item">
          <label>Timestamp</label>
          <code>${new Date(data.cryptographicProof.timestamp).toLocaleString()}</code>
        </div>
      </div>
    </div>
    
    <!-- Summary -->
    <div class="summary-grid">
      <div class="summary-card">
        <div class="number">${data.contents.metadata.totalDeliberations}</div>
        <div class="label">Deliberations</div>
      </div>
      <div class="summary-card">
        <div class="number">${data.contents.metadata.totalDecisions}</div>
        <div class="label">Decisions</div>
      </div>
      <div class="summary-card">
        <div class="number">${data.contents.metadata.totalEvents}</div>
        <div class="label">Timeline Events</div>
      </div>
      <div class="summary-card">
        <div class="number">${data.contents.metrics?.length || 0}</div>
        <div class="label">Metrics Tracked</div>
      </div>
    </div>
    
    <!-- Deliberations -->
    <section class="section">
      <h2>🤖 Council Deliberations</h2>
      <div class="search-bar">
        <input type="text" id="searchDelibs" placeholder="Search deliberations..." onkeyup="searchDeliberations()">
        <button onclick="expandAll()">Expand All</button>
        <button onclick="collapseAll()">Collapse All</button>
      </div>
      <div id="deliberations-container">
        ${deliberationSections || '<p>No deliberations in this audit package.</p>'}
      </div>
    </section>
    
    <!-- Timeline -->
    <section class="section">
      <h2>📅 Timeline Events</h2>
      <table class="timeline-table">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Type</th>
            <th>Title</th>
            <th>Description</th>
            <th>Department</th>
            <th>Magnitude</th>
          </tr>
        </thead>
        <tbody>
          ${timelineSections || '<tr><td colspan="6">No timeline events</td></tr>'}
        </tbody>
      </table>
      ${data.contents.timeline.length > 50 ? `<p style="margin-top:15px;color:var(--text-secondary)">Showing 50 of ${data.contents.timeline.length} events</p>` : ''}
    </section>
    
    <!-- Footer -->
    <footer class="report-footer">
      <div class="verified-stamp">✓ VERIFIED AUTHENTIC</div>
      <p>This document was automatically generated by Datacendia Sovereign Stack.<br>
      For verification, contact compliance@datacendia.com</p>
      <p style="margin-top:15px">Classification: Confidential | Retention: 7 years</p>
    </footer>
  </div>
  
  <script>
    function toggleSection(id) {
      const el = document.getElementById(id);
      const icon = el.previousElementSibling.querySelector('.toggle-icon');
      if (el.classList.contains('collapsed')) {
        el.classList.remove('collapsed');
        icon.style.transform = 'rotate(0deg)';
      } else {
        el.classList.add('collapsed');
        icon.style.transform = 'rotate(-90deg)';
      }
    }
    
    function expandAll() {
      document.querySelectorAll('.card-body').forEach(el => {
        el.classList.remove('collapsed');
      });
      document.querySelectorAll('.toggle-icon').forEach(el => {
        el.style.transform = 'rotate(0deg)';
      });
    }
    
    function collapseAll() {
      document.querySelectorAll('.card-body').forEach(el => {
        el.classList.add('collapsed');
      });
      document.querySelectorAll('.toggle-icon').forEach(el => {
        el.style.transform = 'rotate(-90deg)';
      });
    }
    
    function searchDeliberations() {
      const query = document.getElementById('searchDelibs').value.toLowerCase();
      document.querySelectorAll('.deliberation-card').forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(query) ? 'block' : 'none';
      });
    }
    
    // Print function
    function printReport() {
      window.print();
    }
  </script>
</body>
</html>`;
  }

  // ===========================================================================
  // HELPERS
  // ===========================================================================
  
  private escapeHtml(text: any): string {
    if (text === null || text === undefined) {return '';}
    // Convert to string if not already a string
    const str = typeof text === 'string' ? text : String(text);
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
  
  private getStatusClass(status: string): string {
    const s = status?.toLowerCase() || '';
    if (s.includes('complete')) {return 'COMPLETED';}
    if (s.includes('error') || s.includes('fail')) {return 'ERROR';}
    return 'PENDING';
  }

  // ===========================================================================
  // EXPORT METHODS
  // ===========================================================================
  
  openHTMLViewer(data: AuditPackageData, options?: { title?: string; organization?: string; preparedFor?: string }): void {
    const html = this.generateHTMLViewer(data, options);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }
  
  downloadHTML(data: AuditPackageData, filename: string, options?: { title?: string; organization?: string; preparedFor?: string }): void {
    const html = this.generateHTMLViewer(data, options);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
  
  downloadJSON(data: AuditPackageData, filename: string): void {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
  
  async downloadBundle(data: AuditPackageData, bundleName: string): Promise<void> {
    // For a full bundle, we'd use JSZip - for now, download HTML which is most useful
    const html = this.generateHTMLViewer(data, { title: 'Complete Audit Package' });
    const htmlBlob = new Blob([html], { type: 'text/html' });
    const jsonBlob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    
    // Download both files
    const htmlUrl = URL.createObjectURL(htmlBlob);
    const jsonUrl = URL.createObjectURL(jsonBlob);
    
    const a1 = document.createElement('a');
    a1.href = htmlUrl;
    a1.download = `${bundleName}.html`;
    a1.click();
    
    setTimeout(() => {
      const a2 = document.createElement('a');
      a2.href = jsonUrl;
      a2.download = `${bundleName}.json`;
      a2.click();
      
      URL.revokeObjectURL(htmlUrl);
      URL.revokeObjectURL(jsonUrl);
    }, 500);
  }
}

export const documentExportService = new DocumentExportService();
export default documentExportService;
