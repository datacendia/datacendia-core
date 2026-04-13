// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import crypto from 'node:crypto';

interface Violation { id: string; framework: string; ruleId: string; severity: string; matterId?: string; status: string; description: string; detectedAt: string }
interface FrameworkConfig { framework: string; enabled: boolean; strictMode: boolean; autoRemediate: boolean }

const FRAMEWORKS = ['ethics-rules', 'bar-standards', 'data-privacy', 'conflict-of-interest', 'privilege-protection', 'billing-compliance'];
const RULES: Record<string, any[]> = Object.fromEntries(FRAMEWORKS.map(f => [f, [
  { id: `${f}-001`, name: `${f} Rule 1`, description: `Primary rule for ${f}`, severity: 'high', enabled: true },
  { id: `${f}-002`, name: `${f} Rule 2`, description: `Secondary rule for ${f}`, severity: 'medium', enabled: true },
]]));

class CendiaGovernServiceImpl {
  private violations = new Map<string, Violation>();
  private configs = new Map<string, FrameworkConfig>(FRAMEWORKS.map(f => [f, { framework: f, enabled: true, strictMode: false, autoRemediate: false }]));

  async runComplianceCheck(params: { matterId?: string; framework?: string; content?: string; checkedBy: string }) {
    const issues: Violation[] = [];
    if (Math.random() > 0.7) {
      const v: Violation = { id: crypto.randomUUID(), framework: params.framework || 'ethics-rules', ruleId: 'ethics-rules-001', severity: 'medium', matterId: params.matterId, status: 'open', description: 'Potential compliance issue detected', detectedAt: new Date().toISOString() };
      this.violations.set(v.id, v);
      issues.push(v);
    }
    return { compliant: issues.length === 0, issues, checkedBy: params.checkedBy, checkedAt: new Date().toISOString() };
  }

  getOpenViolations(filters?: { framework?: string; severity?: string; matterId?: string }) {
    let list = [...this.violations.values()].filter(v => v.status === 'open');
    if (filters?.framework) list = list.filter(v => v.framework === filters.framework);
    if (filters?.severity) list = list.filter(v => v.severity === filters.severity);
    if (filters?.matterId) list = list.filter(v => v.matterId === filters.matterId);
    return list;
  }

  async resolveViolation(id: string, params: { resolution: string; resolvedBy: string }) {
    const v = this.violations.get(id);
    if (!v) return null;
    v.status = 'resolved';
    (v as any).resolution = params.resolution;
    (v as any).resolvedBy = params.resolvedBy;
    (v as any).resolvedAt = new Date().toISOString();
    return v;
  }

  getRulesForFramework(framework: string) { return RULES[framework] || []; }
  getConfiguration(framework: string) { return this.configs.get(framework) || null; }
  updateConfiguration(params: { framework: string; enabled?: boolean; strictMode?: boolean; autoRemediate?: boolean }) {
    const cfg = this.configs.get(params.framework);
    if (cfg) Object.assign(cfg, params);
  }

  getStatistics() {
    const all = [...this.violations.values()];
    return { totalViolations: all.length, open: all.filter(v => v.status === 'open').length, resolved: all.filter(v => v.status === 'resolved').length, frameworks: FRAMEWORKS.length };
  }
}

export const cendiaGovernService = new CendiaGovernServiceImpl();
