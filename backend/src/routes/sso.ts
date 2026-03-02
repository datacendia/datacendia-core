// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// SSO API ROUTES — SAML 2.0 + OIDC/PKCE + SCIM 2.0
// =============================================================================

import { Router, Request, Response } from 'express';
import { devAuth } from '../middleware/auth.js';
import { ssoService } from '../services/enterprise/SSOService.js';

const router = Router();

// Health (no auth)
router.get('/health', (_req: Request, res: Response) => {
  res.json({ success: true, data: { status: 'healthy', service: 'sso', timestamp: new Date().toISOString() } });
});

router.get('/status', (_req: Request, res: Response) => {
  res.json({ success: true, data: ssoService.getStatus() });
});

router.use(devAuth);

// =============================================================================
// IDENTITY PROVIDER MANAGEMENT
// =============================================================================

router.post('/idp', async (req: Request, res: Response) => {
  try {
    const idp = ssoService.registerIdP(req.body);
    res.json({ success: true, data: idp });
  } catch (err) {
    res.status(400).json({ success: false, error: (err as Error).message });
  }
});

router.get('/idp/:id', (req: Request, res: Response) => {
  const idp = ssoService.getIdP(req.params.id);
  if (!idp) return res.status(404).json({ success: false, error: 'IdP not found' });
  res.json({ success: true, data: idp });
});

router.get('/idps/:organizationId', (req: Request, res: Response) => {
  const idps = ssoService.listIdPs(req.params.organizationId);
  res.json({ success: true, data: idps });
});

// =============================================================================
// SAML 2.0 FLOW
// =============================================================================

router.post('/saml/authn-request', (req: Request, res: Response) => {
  try {
    const result = ssoService.generateSAMLAuthnRequest(req.body.idpId, req.body.relayState);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: (err as Error).message });
  }
});

router.post('/saml/acs', (req: Request, res: Response) => {
  try {
    const assertion = ssoService.validateSAMLResponse(req.body.SAMLResponse, req.body.idpId);
    res.json({ success: true, data: assertion });
  } catch (err) {
    res.status(400).json({ success: false, error: (err as Error).message });
  }
});

// =============================================================================
// OIDC FLOW (with PKCE)
// =============================================================================

router.post('/oidc/authorize', (req: Request, res: Response) => {
  try {
    const result = ssoService.generateOIDCAuthUrl(req.body.idpId, req.body.state);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: (err as Error).message });
  }
});

router.post('/oidc/token', async (req: Request, res: Response) => {
  try {
    const tokenSet = await ssoService.exchangeOIDCCode(req.body.idpId, req.body.code, req.body.codeVerifier);
    res.json({ success: true, data: tokenSet });
  } catch (err) {
    res.status(400).json({ success: false, error: (err as Error).message });
  }
});

router.get('/oidc/pkce', (_req: Request, res: Response) => {
  const challenge = ssoService.generatePKCEChallenge();
  res.json({ success: true, data: challenge });
});

// =============================================================================
// SESSION MANAGEMENT
// =============================================================================

router.post('/sessions', (req: Request, res: Response) => {
  try {
    const session = ssoService.createSession(req.body);
    res.json({ success: true, data: { id: session.id, email: session.email, expiresAt: session.expiresAt } });
  } catch (err) {
    res.status(400).json({ success: false, error: (err as Error).message });
  }
});

router.get('/sessions/:sessionId', (req: Request, res: Response) => {
  const session = ssoService.getSession(req.params.sessionId);
  if (!session) return res.status(404).json({ success: false, error: 'Session not found or expired' });
  res.json({ success: true, data: session });
});

router.delete('/sessions/:sessionId', (req: Request, res: Response) => {
  const revoked = ssoService.revokeSession(req.params.sessionId);
  res.json({ success: true, data: { revoked } });
});

router.get('/sessions/org/:organizationId', (req: Request, res: Response) => {
  const sessions = ssoService.getActiveSessions(req.params.organizationId);
  res.json({ success: true, data: sessions });
});

// =============================================================================
// SCIM 2.0 DIRECTORY SYNC
// =============================================================================

router.post('/scim/event', async (req: Request, res: Response) => {
  try {
    const result = await ssoService.handleSCIMEvent(req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: (err as Error).message });
  }
});

export default router;
