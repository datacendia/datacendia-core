// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import crypto from 'crypto';

class CendiaGlassServiceImpl {
  private devices = new Map<string, any>();
  private overlays = new Map<string, any>();
  private sessions: any[] = [];
  private anchors: any[] = [];

  async getDashboard(orgId: string) {
    return { organizationId: orgId, devices: this.getDevicesForOrg(orgId).length, overlays: [...this.overlays.values()].filter(o => o.organizationId === orgId).length, activeSessions: this.getActiveSessions(orgId).length };
  }

  getDevicesForOrg(orgId: string) { return [...this.devices.values()].filter(d => d.organizationId === orgId); }
  getDevice(id: string) { return this.devices.get(id) || null; }

  getOverlays(orgId: string, type?: string) {
    let results = [...this.overlays.values()].filter(o => o.organizationId === orgId);
    if (type) results = results.filter(o => o.type === type);
    return results;
  }

  async getOverlayData(id: string) {
    const overlay = this.overlays.get(id);
    if (!overlay) throw new Error('Overlay not found');
    return overlay.data || {};
  }

  getActiveSessions(orgId: string) { return this.sessions.filter(s => s.organizationId === orgId && s.status === 'active'); }
  getSessionHistory(orgId: string, limit: number) { return this.sessions.filter(s => s.organizationId === orgId).slice(-limit); }
  getAnchors(orgId: string, location?: any) { let r = this.anchors.filter(a => a.organizationId === orgId); if (location?.building) r = r.filter(a => a.building === location.building); return r; }

  async getCouncilVisualization(sessionId: string) {
    return { sessionId, visualizations: [], generatedAt: new Date().toISOString() };
  }
}

export const cendiaGlassService = new CendiaGlassServiceImpl();
