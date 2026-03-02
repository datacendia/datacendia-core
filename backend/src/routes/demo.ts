// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import crypto from 'crypto';
import { prisma } from '../config/database.js';
import { logger } from '../utils/logger.js';

const router = Router();

const demoRequestSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email format'),
  company: z.string().min(1, 'Company name is required'),
  jobTitle: z.string().min(1, 'Job title is required'),
  companySize: z.enum(['1-50', '51-200', '201-1000', '1001-5000', '5000+']),
  industry: z.string().min(1, 'Industry is required'),
  primaryInterest: z.enum([
    'data-lineage',
    'ai-agents',
    'forecasting',
    'compliance',
    'automation',
    'other',
  ]),
  additionalNotes: z.string().optional(),
  marketingConsent: z.boolean().default(false),
});

/**
 * POST /api/v1/leads/demo-request
 * Submit demo request (public endpoint)
 */
router.post('/demo-request', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = demoRequestSchema.parse(req.body);

    // Validate work email (not personal)
    const personalDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com'];
    const emailDomain = data.email.split('@')[1].toLowerCase();
    
    if (personalDomains.includes(emailDomain)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Please use a work email address',
        },
      });
    }

    // Check for existing request
    const existing = await prisma.demo_requests.findFirst({
      where: { email: data.email.toLowerCase() },
      orderBy: { created_at: 'desc' },
    });

    if (existing && isRecent(existing.created_at)) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'DUPLICATE_REQUEST',
          message: 'A demo request was recently submitted with this email',
        },
      });
    }

    // Create demo request
    const demoRequest = await prisma.demo_requests.create({
      data: {
        id: crypto.randomUUID(),
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email.toLowerCase(),
        company: data.company,
        job_title: data.jobTitle,
        company_size: data.companySize,
        industry: data.industry,
        primary_interest: data.primaryInterest,
        additional_notes: data.additionalNotes,
        marketing_consent: data.marketingConsent,
        status: 'new',
      },
    });

    logger.info(`New demo request from ${data.email}`, {
      company: data.company,
      interest: data.primaryInterest,
    });

    // Send confirmation email via audit log (email service picks up from here)
    await prisma.audit_logs.create({
      data: {
        id: crypto.randomUUID(),
        organization_id: 'system',
        user_id: 'system',
        action: 'demo.confirmation_email',
        resource_type: 'demo_request',
        resource_id: demoRequest.id,
        details: { recipient: data.email, company: data.company, template: 'demo_confirmation' },
        ip_address: req.ip || 'unknown',
        user_agent: req.headers['user-agent'] || 'unknown',
      },
    });

    // Notify sales team via audit log (notification service picks up critical events)
    await prisma.audit_logs.create({
      data: {
        id: crypto.randomUUID(),
        organization_id: 'system',
        user_id: 'system',
        action: 'demo.sales_notification',
        resource_type: 'demo_request',
        resource_id: demoRequest.id,
        details: { channel: 'sales', email: data.email, company: data.company, interest: data.primaryInterest },
        ip_address: req.ip || 'unknown',
        user_agent: req.headers['user-agent'] || 'unknown',
      },
    });

    res.status(201).json({
      success: true,
      data: {
        id: demoRequest.id,
        message: 'Thank you for your interest! Our team will contact you shortly.',
      },
    });
  } catch (error) {
    next(error);
  }
});

// Check if date is within last 7 days
function isRecent(date: Date): boolean {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  return date > sevenDaysAgo;
}

export default router;
