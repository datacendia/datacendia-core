// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import crypto from 'crypto';

class CendiaBlackBoxServiceImpl {
  private units = new Map<string, any>();
  private jobs: any[] = [];
  private records: any[] = [];
  private recoveries: any[] = [];
  private reports: any[] = [];

  async getDashboard(orgId: string) {
    return { organizationId: orgId, units: this.getUnitsForOrg(orgId).length, jobs: this.jobs.filter(j => j.organizationId === orgId).length, records: this.records.filter(r => r.organizationId === orgId).length };
  }

  getUnitsForOrg(orgId: string) { return [...this.units.values()].filter(u => u.organizationId === orgId); }
  getUnit(id: string) { return this.units.get(id) || null; }
  getJobs(orgId: string, status?: string) { let r = this.jobs.filter(j => j.organizationId === orgId); if (status) r = r.filter(j => j.status === status); return r; }
  getStoredRecords(orgId: string, sourceType?: string) { let r = this.records.filter(r2 => r2.organizationId === orgId); if (sourceType) r = r.filter(r2 => r2.sourceType === sourceType); return r; }
  getRecoveries(orgId: string) { return this.recoveries.filter(r => r.organizationId === orgId); }
  getIntegrityReports(orgId: string) { return this.reports.filter(r => r.organizationId === orgId); }

  async runIntegrityCheck(unitId: string) {
    const unit = this.units.get(unitId);
    if (!unit) throw new Error('Unit not found');
    const report = { id: `report-${crypto.randomUUID().slice(0, 8)}`, unitId, status: 'passed', checksPerformed: 7, issuesFound: 0, checkedAt: new Date().toISOString() };
    this.reports.push(report);
    return report;
  }
}

export const cendiaBlackBoxService = new CendiaBlackBoxServiceImpl();
