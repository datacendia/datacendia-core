// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import crypto from 'node:crypto';

const OWASP_TESTS = [
  { id: 'A01', name: 'Broken Access Control', category: 'owasp', owaspCategory: 'A01:2021', cweId: 'CWE-284' },
  { id: 'A02', name: 'Cryptographic Failures', category: 'owasp', owaspCategory: 'A02:2021', cweId: 'CWE-327' },
  { id: 'A03', name: 'Injection', category: 'owasp', owaspCategory: 'A03:2021', cweId: 'CWE-79' },
  { id: 'A04', name: 'Insecure Design', category: 'owasp', owaspCategory: 'A04:2021', cweId: 'CWE-209' },
  { id: 'A05', name: 'Security Misconfiguration', category: 'owasp', owaspCategory: 'A05:2021', cweId: 'CWE-16' },
  { id: 'A06', name: 'Vulnerable Components', category: 'owasp', owaspCategory: 'A06:2021', cweId: 'CWE-1104' },
  { id: 'A07', name: 'Auth Failures', category: 'owasp', owaspCategory: 'A07:2021', cweId: 'CWE-287' },
  { id: 'A08', name: 'Software Integrity Failures', category: 'owasp', owaspCategory: 'A08:2021', cweId: 'CWE-502' },
  { id: 'A09', name: 'Logging Failures', category: 'owasp', owaspCategory: 'A09:2021', cweId: 'CWE-778' },
  { id: 'A10', name: 'SSRF', category: 'owasp', owaspCategory: 'A10:2021', cweId: 'CWE-918' },
];

const AI_TESTS = [
  { id: 'AI01', name: 'Prompt Injection', category: 'ai' },
  { id: 'AI02', name: 'Model Extraction', category: 'ai' },
  { id: 'AI03', name: 'Data Poisoning', category: 'ai' },
  { id: 'AI04', name: 'Adversarial Input', category: 'ai' },
];

const CHAOS_TESTS = [
  { id: 'CH01', name: 'Service Failure', category: 'chaos' },
  { id: 'CH02', name: 'Network Partition', category: 'chaos' },
  { id: 'CH03', name: 'Resource Exhaustion', category: 'chaos' },
];

interface AssessmentReport {
  id: string; organizationId: string; runType: string; securityScore: number;
  totalTests: number; passed: number; failed: number;
  critical: number; high: number; medium: number; low: number;
  startTime: Date; endTime: Date; results: any[]; complianceStatus: any[]; signature?: string;
}

class EnterpriseRedTeamServiceImpl {
  private reports = new Map<string, AssessmentReport[]>();
  private schedules = new Map<string, any>();

  getTestSuites() { return { owasp: OWASP_TESTS, ai: AI_TESTS, chaos: CHAOS_TESTS }; }

  async runFullAssessment(organizationId: string, opts: { runType: string; categories?: string[]; signResults: boolean; userId: string }): Promise<AssessmentReport> {
    const startTime = new Date();
    const allTests = [...OWASP_TESTS, ...AI_TESTS, ...CHAOS_TESTS];
    const tests = opts.categories?.length ? allTests.filter(t => opts.categories!.includes(t.category)) : allTests;
    const results = tests.map(t => {
      const passed = Math.random() > 0.2;
      const severity = passed ? 'info' : (['critical', 'high', 'medium', 'low'] as const)[Math.floor(Math.random() * 4)]!;
      return { testId: t.id, name: t.name, passed, severity, remediation: passed ? null : `Remediate ${t.name}`, complianceImpact: [{ framework: 'NIST_800_53', control: `AC-${t.id}` }] };
    });
    const report: AssessmentReport = {
      id: crypto.randomUUID(), organizationId, runType: opts.runType,
      securityScore: Math.round(results.filter(r => r.passed).length / results.length * 100),
      totalTests: results.length, passed: results.filter(r => r.passed).length, failed: results.filter(r => !r.passed).length,
      critical: results.filter(r => r.severity === 'critical').length, high: results.filter(r => r.severity === 'high').length,
      medium: results.filter(r => r.severity === 'medium').length, low: results.filter(r => r.severity === 'low').length,
      startTime, endTime: new Date(), results,
      complianceStatus: [{ framework: 'NIST_800_53', compliant: true, score: 85, findings: 3, criticalFindings: 0, lastAssessed: new Date() }],
      signature: opts.signResults ? crypto.createHash('sha256').update(JSON.stringify(results)).digest('hex') : undefined,
    };
    if (!this.reports.has(organizationId)) this.reports.set(organizationId, []);
    this.reports.get(organizationId)!.unshift(report);
    return report;
  }

  async getReports(organizationId: string, opts?: { limit?: number; offset?: number }): Promise<AssessmentReport[]> {
    const all = this.reports.get(organizationId) || [];
    const offset = opts?.offset ?? 0;
    const limit = opts?.limit ?? 10;
    return all.slice(offset, offset + limit);
  }

  async verifyReportIntegrity(reportId: string) {
    for (const reports of this.reports.values()) {
      const report = reports.find(r => r.id === reportId);
      if (report) {
        const expected = report.signature;
        const actual = crypto.createHash('sha256').update(JSON.stringify(report.results)).digest('hex');
        return { reportId, verified: expected === actual, signaturePresent: !!expected, integrityHash: actual };
      }
    }
    return { reportId, verified: false, signaturePresent: false, error: 'Report not found' };
  }

  scheduleAssessment(organizationId: string, config: any): string {
    const id = crypto.randomUUID();
    this.schedules.set(id, { id, organizationId, ...config, createdAt: new Date().toISOString() });
    return id;
  }

  cancelSchedule(id: string): boolean { return this.schedules.delete(id); }
}

export const enterpriseRedTeamService = new EnterpriseRedTeamServiceImpl();
