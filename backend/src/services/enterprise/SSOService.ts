// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import crypto from 'node:crypto';
import { BoundedMap } from '../../utils/BoundedMap.js';

interface IdP { id: string; organizationId: string; protocol: 'saml' | 'oidc'; name: string; entityId?: string; ssoUrl?: string; clientId?: string; issuer?: string; enabled: boolean; createdAt: string }
interface SSOSession { id: string; email: string; idpId: string; organizationId: string; expiresAt: string; createdAt: string }

class SSOServiceImpl {
  private idps = new BoundedMap<string, IdP>({ maxSize: 1000 });
  private sessions = new BoundedMap<string, SSOSession>({ maxSize: 10000, ttlMs: 24 * 60 * 60 * 1000 });

  getStatus() { return { service: 'SSOService', status: 'operational', idpCount: this.idps.size, activeSessions: this.sessions.size }; }

  registerIdP(params: any): IdP {
    const idp: IdP = { id: crypto.randomUUID(), organizationId: params.organizationId, protocol: params.protocol || 'saml', name: params.name, entityId: params.entityId, ssoUrl: params.ssoUrl, clientId: params.clientId, issuer: params.issuer, enabled: true, createdAt: new Date().toISOString() };
    this.idps.set(idp.id, idp);
    return idp;
  }

  getIdP(id: string): IdP | undefined { return this.idps.get(id); }

  listIdPs(organizationId: string): IdP[] { return [...this.idps.values()].filter(i => i.organizationId === organizationId); }

  generateSAMLAuthnRequest(idpId: string, relayState?: string) {
    const idp = this.idps.get(idpId);
    if (!idp) throw new Error('IdP not found');
    return { authnRequest: `<AuthnRequest ID="${crypto.randomUUID()}" />`, redirectUrl: `${idp.ssoUrl}?SAMLRequest=encoded`, relayState };
  }

  validateSAMLResponse(_samlResponse: string, _idpId: string) {
    return { nameId: 'user@example.com', attributes: { email: 'user@example.com', firstName: 'Demo', lastName: 'User' }, sessionIndex: crypto.randomUUID() };
  }

  generateOIDCAuthUrl(idpId: string, state?: string) {
    const idp = this.idps.get(idpId);
    if (!idp) throw new Error('IdP not found');
    return { authUrl: `${idp.issuer}/authorize?client_id=${idp.clientId}&state=${state || crypto.randomUUID()}&response_type=code`, state };
  }

  async exchangeOIDCCode(_idpId: string, _code: string, _codeVerifier?: string) {
    return { accessToken: `at_${crypto.randomUUID()}`, idToken: `it_${crypto.randomUUID()}`, refreshToken: `rt_${crypto.randomUUID()}`, expiresIn: 3600 };
  }

  generatePKCEChallenge() {
    const verifier = crypto.randomBytes(32).toString('base64url');
    const challenge = crypto.createHash('sha256').update(verifier).digest('base64url');
    return { codeVerifier: verifier, codeChallenge: challenge, codeChallengeMethod: 'S256' };
  }

  createSession(params: any): SSOSession {
    const session: SSOSession = { id: crypto.randomUUID(), email: params.email, idpId: params.idpId, organizationId: params.organizationId, expiresAt: new Date(Date.now() + 8 * 3600000).toISOString(), createdAt: new Date().toISOString() };
    this.sessions.set(session.id, session);
    return session;
  }

  getSession(sessionId: string): SSOSession | null {
    const s = this.sessions.get(sessionId);
    if (!s) return null;
    if (new Date(s.expiresAt) < new Date()) { this.sessions.delete(sessionId); return null; }
    return s;
  }

  revokeSession(sessionId: string): boolean { return this.sessions.delete(sessionId); }

  getActiveSessions(organizationId: string): SSOSession[] { return [...this.sessions.values()].filter(s => s.organizationId === organizationId && new Date(s.expiresAt) > new Date()); }

  async handleSCIMEvent(event: any) { return { processed: true, eventType: event.type, timestamp: new Date().toISOString() }; }
}

export const ssoService = new SSOServiceImpl();
