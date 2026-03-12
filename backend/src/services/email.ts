// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// EMAIL SERVICE — Nodemailer-based transactional email
// =============================================================================

import nodemailer from 'nodemailer';
import { logger } from '../utils/logger.js';

const SMTP_HOST = process.env.SMTP_HOST || '';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587', 10);
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const SMTP_FROM = process.env.SMTP_FROM || 'noreply@datacendia.com';
const SALES_EMAIL = process.env.SALES_EMAIL || 'sales@datacendia.com';

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter | null {
  if (transporter) return transporter;
  if (!SMTP_HOST) {
    logger.warn('[Email] SMTP_HOST not configured — emails will be logged only');
    return null;
  }
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
  });
  return transporter;
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
    const transport = getTransporter();

    const mailOptions = {
      from: SMTP_FROM,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
      replyTo: options.replyTo,
    };

    if (!transport) {
      logger.info('[Email] (no SMTP) Would send:', {
        to: options.to,
        subject: options.subject,
      });
      logger.info('[Email] Body:\n' + options.text);
      return true;
    }

    try {
      await transport.sendMail(mailOptions);
      logger.info(`[Email] Sent to ${options.to}: ${options.subject}`);
      return true;
    } catch (err) {
      logger.error('[Email] Failed to send:', err);
      return false;
    }
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
