// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// EMAIL SERVICE — SendGrid HTTP API (primary) + Nodemailer SMTP (fallback)
// =============================================================================

import nodemailer from 'nodemailer';
import { logger } from '../utils/logger.js';

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';
const SMTP_HOST = process.env.SMTP_HOST || '';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587', 10);
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const EMAIL_FROM = process.env.SMTP_FROM || process.env.EMAIL_FROM || 'noreply@datacendia.com';
const SALES_EMAIL = process.env.SALES_EMAIL || 'sales@datacendia.com';

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter | null {
  if (transporter) return transporter;
  if (!SMTP_HOST) return null;
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
  });
  return transporter;
}

async function sendViaSendGrid(options: SendEmailOptions): Promise<boolean> {
  const body = {
    personalizations: [{ to: [{ email: options.to }] }],
    from: { email: EMAIL_FROM },
    reply_to: options.replyTo ? { email: options.replyTo } : undefined,
    subject: options.subject,
    content: [
      { type: 'text/plain', value: options.text },
      ...(options.html ? [{ type: 'text/html', value: options.html }] : []),
    ],
  };
  const resp = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SENDGRID_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (resp.status >= 200 && resp.status < 300) {
    logger.info(`[Email] SendGrid → sent to ${options.to}: ${options.subject}`);
    return true;
  }
  const errText = await resp.text();
  logger.error(`[Email] SendGrid error (${resp.status}): ${errText}`);
  return false;
}

interface SendEmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}

class EmailService {
  async send(options: SendEmailOptions): Promise<boolean> {
    // Priority 1: SendGrid HTTP API (works on Railway — no SMTP ports needed)
    if (SENDGRID_API_KEY) {
      try {
        return await sendViaSendGrid(options);
      } catch (err) {
        logger.error('[Email] SendGrid exception:', err);
        // Fall through to SMTP
      }
    }

    // Priority 2: SMTP via Nodemailer
    const transport = getTransporter();
    if (transport) {
      try {
        await transport.sendMail({
          from: EMAIL_FROM,
          to: options.to,
          subject: options.subject,
          text: options.text,
          html: options.html,
          replyTo: options.replyTo,
        });
        logger.info(`[Email] SMTP → sent to ${options.to}: ${options.subject}`);
        return true;
      } catch (err) {
        logger.error('[Email] SMTP failed:', err);
        return false;
      }
    }

    // Priority 3: Log only
    logger.warn('[Email] No email provider configured (set SENDGRID_API_KEY or SMTP_HOST)');
    logger.info(`[Email] Would send to ${options.to}: ${options.subject}`);
    logger.info('[Email] Body:\n' + options.text);
    return true;
  }

  async notifyDemoRequest(data: {
    firstName: string;
    lastName: string;
    email: string;
    company: string;
    jobTitle?: string;
    companySize?: string;
    industry?: string;
    primaryInterest?: string;
    additionalNotes?: string;
  }): Promise<boolean> {
    const subject = `🆕 Demo Request: ${data.firstName} ${data.lastName} — ${data.company}`;
    const text = [
      `New demo request received`,
      ``,
      `Name:             ${data.firstName} ${data.lastName}`,
      `Email:            ${data.email}`,
      `Company:          ${data.company}`,
      `Job Title:        ${data.jobTitle || '—'}`,
      `Company Size:     ${data.companySize || '—'}`,
      `Industry:         ${data.industry || '—'}`,
      `Primary Interest: ${data.primaryInterest || '—'}`,
      ``,
      `Additional Notes:`,
      data.additionalNotes || '(none)',
      ``,
      `— Datacendia Platform`,
    ].join('\n');

    return this.send({
      to: SALES_EMAIL,
      subject,
      text,
      replyTo: data.email,
    });
  }
}

export const emailService = new EmailService();
