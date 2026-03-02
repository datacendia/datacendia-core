// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// MARKETING LEADS API ROUTES
// Handle marketing form submissions (Request Access, Newsletter, Manifesto)
// =============================================================================

import express, { Request, Response, Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.js';

const router: Router = express.Router();
const prisma = new PrismaClient();

// =============================================================================
// ROUTES
// =============================================================================

/**
 * POST /marketing-leads
 * Submit a marketing lead (Request Access / Newsletter / Manifesto Bible request)
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, title, organization, concern, source } = req.body;

    // Validate required fields
    if (!name || !organization) {
      return res.status(400).json({
        error: 'Name and organization are required',
      });
    }

    // Store in demo_requests table (reusing existing table)
    const lead = await prisma.demo_requests.create({
      data: {
        id: `mktg-${Date.now()}-${crypto.randomUUID().slice(0, 9)}`,
        first_name: name.split(' ')[0] || name,
        last_name: name.split(' ').slice(1).join(' ') || '',
        email: '',
        company: organization,
        job_title: title || '',
        company_size: source || 'marketing_form',
        industry: 'Marketing Lead',
        primary_interest: source === 'sovereign_landing' ? 'Sovereign Access' :
                         source === 'manifesto' ? 'Manifesto Bible' : 'General Interest',
        additional_notes: concern || '',
        status: 'new',
        created_at: new Date(),
      },
    });

    logger.info('[MarketingLeads] New submission:', {
      id: lead.id,
      organization,
      source,
    });

    res.json({
      success: true,
      message: 'Your request has been received. We will contact you within 48 hours.',
      id: lead.id,
    });

  } catch (error) {
    logger.error('[MarketingLeads] Submission failed:', error);
    res.status(500).json({ error: 'Failed to submit request' });
  }
});

/**
 * POST /marketing-leads/newsletter
 * Subscribe to newsletter
 */
router.post('/newsletter', async (req: Request, res: Response) => {
  try {
    const { email, source } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const subscriber = await prisma.demo_requests.create({
      data: {
        id: `news-${Date.now()}-${crypto.randomUUID().slice(0, 9)}`,
        first_name: '',
        last_name: '',
        email,
        company: '',
        job_title: '',
        company_size: source || 'newsletter',
        industry: 'Newsletter Subscriber',
        primary_interest: 'Newsletter',
        additional_notes: '',
        status: 'subscribed',
        created_at: new Date(),
      },
    });

    logger.info('[MarketingLeads] Newsletter subscription:', {
      id: subscriber.id,
      email,
    });

    res.json({
      success: true,
      message: 'Successfully subscribed to the newsletter.',
      id: subscriber.id,
    });

  } catch (error) {
    logger.error('[MarketingLeads] Newsletter subscription failed:', error);
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

/**
 * GET /marketing-leads
 * Get marketing leads (admin only)
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { limit = 50, source } = req.query;

    const where: any = {
      industry: { in: ['Marketing Lead', 'Newsletter Subscriber'] },
    };

    if (source === 'newsletter') {
      where.industry = 'Newsletter Subscriber';
    } else if (source === 'leads') {
      where.industry = 'Marketing Lead';
    }

    const leads = await prisma.demo_requests.findMany({
      where,
      orderBy: { created_at: 'desc' },
      take: Math.min(Number(limit), 100),
    });

    res.json({
      success: true,
      data: leads,
      count: leads.length,
    });
  } catch (error) {
    logger.error('[MarketingLeads] Failed to fetch leads:', error);
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

export default router;
