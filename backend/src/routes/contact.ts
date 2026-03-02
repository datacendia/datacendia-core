/**
 * API Routes — Contact
 *
 * Express route handler defining REST endpoints.
 * @module routes/contact
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// CONTACT API ROUTES
// Handle contact form submissions
// =============================================================================

import express, { Request, Response, Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.js';
import { deterministicFloat, deterministicInt, deterministicPercentage, deterministicPick } from '../utils/deterministic.js';

const router: Router = express.Router();
const prisma = new PrismaClient();

// =============================================================================
// ROUTES
// =============================================================================

/**
 * POST /contact
 * Submit a contact form
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email, company, message, inquiry_type, source } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ 
        error: 'Name, email, and message are required' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Store in demo_requests table (reusing existing table)
    const contact = await prisma.demo_requests.create({
      data: {
        id: `contact-${Date.now()}-${crypto.randomUUID().slice(0, 9)}`,
        first_name: name.split(' ')[0] || name,
        last_name: name.split(' ').slice(1).join(' ') || '',
        email,
        company: company || 'Not provided',
        job_title: inquiry_type || 'general',
        company_size: source || 'contact_form',
        industry: 'Contact Inquiry',
        primary_interest: 'General Contact',
        additional_notes: message,
        status: 'new',
        created_at: new Date(),
      },
    });

    logger.info('[Contact] New submission:', {
      id: contact.id,
      email,
      inquiry_type,
      source,
    });

    // Send confirmation (production upgrade: trigger email service)
    res.json({
      success: true,
      message: 'Thank you for contacting us. We will get back to you soon.',
      id: contact.id,
    });

  } catch (error) {
    logger.error('[Contact] Submission failed:', error);
    res.status(500).json({ error: 'Failed to submit contact form' });
  }
});

/**
 * GET /contact/submissions
 * Get contact submissions (admin only)
 */
router.get('/submissions', async (req: Request, res: Response) => {
  try {
    const { limit = 50 } = req.query;

    const submissions = await prisma.demo_requests.findMany({
      where: {
        industry: 'Contact Inquiry',
      },
      orderBy: { created_at: 'desc' },
      take: Math.min(Number(limit), 100),
    });

    res.json({
      success: true,
      data: submissions,
      count: submissions.length,
    });
  } catch (error) {
    logger.error('[Contact] Failed to fetch submissions:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

export default router;
