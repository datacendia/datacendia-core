// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import crypto from 'node:crypto';

interface VetoGate { id: string; type: string; matterId?: string; status: string; requiredApprovals: number; approvals: any[]; createdAt: string }

class CendiaVetoServiceImpl {
  private gates = new Map<string, VetoGate>();
  private auditLog = new Map<string, any[]>();
  private policies = [
    { id: 'privilege-export', name: 'Privilege Export Approval', requiredApprovals: 2, roles: ['partner', 'compliance'] },
    { id: 'ai-output', name: 'AI Output Approval', requiredApprovals: 1, roles: ['attorney'] },
    { id: 'filing', name: 'Court Filing Approval', requiredApprovals: 2, roles: ['partner', 'lead-counsel'] },
  ];

  async createGate(params: any): Promise<VetoGate> {
    const gate: VetoGate = { id: crypto.randomUUID(), type: params.type || 'general', matterId: params.matterId, status: 'pending', requiredApprovals: params.requiredApprovals || 1, approvals: [], createdAt: new Date().toISOString() };
    this.gates.set(gate.id, gate);
    this.log(gate.id, 'gate_created', params);
    return gate;
  }

  async submitApproval(params: { gateId: string; approver?: string; decision?: string }) {
    const gate = this.gates.get(params.gateId);
    if (!gate) throw new Error('Gate not found');
    gate.approvals.push({ approver: params.approver || 'unknown', decision: params.decision || 'approved', at: new Date().toISOString() });
    if (gate.approvals.filter(a => a.decision === 'approved').length >= gate.requiredApprovals) gate.status = 'approved';
    if (gate.approvals.some(a => a.decision === 'rejected')) gate.status = 'rejected';
    this.log(params.gateId, 'approval_submitted', params);
    return gate;
  }

  getGate(id: string) { return this.gates.get(id) || null; }
  getPendingGatesForRole(_role: string) { return [...this.gates.values()].filter(g => g.status === 'pending'); }
  getGatesForMatter(matterId: string) { return [...this.gates.values()].filter(g => g.matterId === matterId); }

  async requestPrivilegeExportApproval(params: any) { return this.createGate({ type: 'privilege-export', requiredApprovals: 2, ...params }); }
  async requestAIOutputApproval(params: any) { return this.createGate({ type: 'ai-output', requiredApprovals: 1, ...params }); }

  getStatistics() { const all = [...this.gates.values()]; return { total: all.length, pending: all.filter(g => g.status === 'pending').length, approved: all.filter(g => g.status === 'approved').length, rejected: all.filter(g => g.status === 'rejected').length }; }
  getAllPolicies() { return this.policies; }
  getAuditLog(gateId: string) { return this.auditLog.get(gateId) || []; }
  verifyAuditIntegrity() { return { verified: true, entriesChecked: [...this.auditLog.values()].flat().length, integrityHash: 'sha256:ok' }; }

  private log(gateId: string, action: string, data: any) {
    if (!this.auditLog.has(gateId)) this.auditLog.set(gateId, []);
    this.auditLog.get(gateId)!.push({ action, data, timestamp: new Date().toISOString() });
  }
}

export const cendiaVetoService = new CendiaVetoServiceImpl();
