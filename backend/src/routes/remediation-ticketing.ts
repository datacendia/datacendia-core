/**
 * API Routes — Remediation & Ticketing
 * @module routes/remediation-ticketing
 */

import { Router, Request, Response } from 'express';
import { remediationTicketing } from '../services/remediation/RemediationTicketingService.js';

const router = Router();

// --- Connectors ---
router.get('/connectors', async (_req: Request, res: Response) => {
  try { res.json({ success: true, data: await remediationTicketing.listConnectors() }); }
  catch (error) { res.status(500).json({ success: false, error: 'Failed to list connectors' }); }
});

router.post('/connectors', async (req: Request, res: Response) => {
  try { res.status(201).json({ success: true, data: await remediationTicketing.createConnector(req.body) }); }
  catch (error) { res.status(500).json({ success: false, error: 'Failed to create connector' }); }
});

router.get('/connectors/:id', async (req: Request, res: Response) => {
  try {
    const c = await remediationTicketing.getConnector(req.params.id);
    if (!c) return res.status(404).json({ success: false, error: 'Connector not found' });
    res.json({ success: true, data: c });
  } catch (error) { res.status(500).json({ success: false, error: 'Failed to get connector' }); }
});

router.post('/connectors/:id/test', async (req: Request, res: Response) => {
  try { res.json({ success: true, data: await remediationTicketing.testConnector(req.params.id) }); }
  catch (error) { res.status(500).json({ success: false, error: 'Failed to test connector' }); }
});

router.post('/connectors/:id/sync', async (req: Request, res: Response) => {
  try { res.json({ success: true, data: await remediationTicketing.syncConnector(req.params.id) }); }
  catch (error) { res.status(500).json({ success: false, error: 'Failed to sync connector' }); }
});

// --- Tickets ---
router.get('/tickets', async (req: Request, res: Response) => {
  try {
    const tickets = await remediationTicketing.listTickets({
      status: req.query.status as any,
      priority: req.query.priority as any,
      triggerSource: req.query.triggerSource as any,
      connectorId: req.query.connectorId as string,
    });
    res.json({ success: true, data: tickets, total: tickets.length });
  } catch (error) { res.status(500).json({ success: false, error: 'Failed to list tickets' }); }
});

router.post('/tickets', async (req: Request, res: Response) => {
  try { res.status(201).json({ success: true, data: await remediationTicketing.createTicket(req.body) }); }
  catch (error) { res.status(500).json({ success: false, error: 'Failed to create ticket' }); }
});

router.get('/tickets/:id', async (req: Request, res: Response) => {
  try {
    const t = await remediationTicketing.getTicket(req.params.id);
    if (!t) return res.status(404).json({ success: false, error: 'Ticket not found' });
    res.json({ success: true, data: t });
  } catch (error) { res.status(500).json({ success: false, error: 'Failed to get ticket' }); }
});

router.put('/tickets/:id/status', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || 'system';
    const t = await remediationTicketing.updateTicketStatus(req.params.id, req.body.status, userId);
    if (!t) return res.status(404).json({ success: false, error: 'Ticket not found' });
    res.json({ success: true, data: t });
  } catch (error) { res.status(500).json({ success: false, error: 'Failed to update ticket' }); }
});

router.post('/tickets/:id/evidence', async (req: Request, res: Response) => {
  try {
    const ev = await remediationTicketing.attachEvidence(req.params.id, { ...req.body, attachedAt: new Date().toISOString() });
    if (!ev) return res.status(404).json({ success: false, error: 'Ticket not found' });
    res.status(201).json({ success: true, data: ev });
  } catch (error) { res.status(500).json({ success: false, error: 'Failed to attach evidence' }); }
});

router.post('/tickets/:id/evidence/:evidenceId/verify', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || 'system';
    await remediationTicketing.verifyEvidence(req.params.id, req.params.evidenceId, userId);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ success: false, error: 'Failed to verify evidence' }); }
});

router.post('/sla/check', async (_req: Request, res: Response) => {
  try { res.json({ success: true, data: await remediationTicketing.checkSLABreaches() }); }
  catch (error) { res.status(500).json({ success: false, error: 'Failed to check SLA breaches' }); }
});

// --- Automation Rules ---
router.get('/automation-rules', async (_req: Request, res: Response) => {
  try { res.json({ success: true, data: await remediationTicketing.listAutomationRules() }); }
  catch (error) { res.status(500).json({ success: false, error: 'Failed to list rules' }); }
});

router.post('/automation-rules', async (req: Request, res: Response) => {
  try { res.status(201).json({ success: true, data: await remediationTicketing.createAutomationRule(req.body) }); }
  catch (error) { res.status(500).json({ success: false, error: 'Failed to create rule' }); }
});

router.post('/events', async (req: Request, res: Response) => {
  try {
    const tickets = await remediationTicketing.processEvent(req.body.source, req.body.entityId, req.body.data);
    res.json({ success: true, data: { ticketsCreated: tickets.length, tickets } });
  } catch (error) { res.status(500).json({ success: false, error: 'Failed to process event' }); }
});

export default router;
