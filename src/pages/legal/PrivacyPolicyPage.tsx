// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA - PRIVACY POLICY PAGE
// GDPR, CCPA, and SOC 2 Compliant Privacy Policy
// =============================================================================

import React from 'react';
import { Link } from 'react-router-dom';

export const PrivacyPolicyPage: React.FC = () => {
  const lastUpdated = 'November 15, 2024';
  const effectiveDate = 'November 15, 2024';

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">D</span>
            </div>
            <span className="text-xl font-bold text-neutral-900">Datacendia</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link to="/terms" className="text-neutral-600 hover:text-neutral-900">
              Terms
            </Link>
            <Link to="/license" className="text-neutral-600 hover:text-neutral-900">
              License
            </Link>
            <Link to="/security" className="text-neutral-600 hover:text-neutral-900">
              Security
            </Link>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">Privacy Policy</h1>
          <div className="text-sm text-neutral-500 space-x-4">
            <span>Last updated: {lastUpdated}</span>
            <span>•</span>
            <span>Effective: {effectiveDate}</span>
          </div>
        </div>

        <div className="prose prose-neutral max-w-none">
          {/* Introduction */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">1. Introduction</h2>
            <p className="text-neutral-600 mb-4">
              Datacendia, Inc. ("Datacendia," "we," "us," or "our") is committed to protecting your
              privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard
              your information when you use our platform, services, and websites (collectively, the
              "Services").
            </p>
            <p className="text-neutral-600 mb-4">
              We comply with the General Data Protection Regulation (GDPR), California Consumer
              Privacy Act (CCPA), and other applicable data protection laws. We are SOC 2 Type II
              certified and maintain rigorous security controls.
            </p>
          </section>

          {/* Data Collection */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">2. Information We Collect</h2>

            <h3 className="text-lg font-semibold text-neutral-900 mb-3">
              2.1 Information You Provide
            </h3>
            <ul className="list-disc pl-6 text-neutral-600 mb-4">
              <li>
                <strong>Account Information:</strong> Name, email address, password, organization
                name
              </li>
              <li>
                <strong>Billing Information:</strong> Payment card details, billing address
                (processed by our payment provider)
              </li>
              <li>
                <strong>Profile Information:</strong> Job title, department, profile picture
              </li>
              <li>
                <strong>Communications:</strong> Messages you send us, support tickets, feedback
              </li>
              <li>
                <strong>User Content:</strong> Data you upload, queries you run, configurations you
                create
              </li>
            </ul>

            <h3 className="text-lg font-semibold text-neutral-900 mb-3">
              2.2 Information Collected Automatically
            </h3>
            <ul className="list-disc pl-6 text-neutral-600 mb-4">
              <li>
                <strong>Usage Data:</strong> Features used, queries executed, time spent, actions
                taken
              </li>
              <li>
                <strong>Device Information:</strong> IP address, browser type, operating system,
                device identifiers
              </li>
              <li>
                <strong>Log Data:</strong> Access times, pages viewed, errors encountered
              </li>
              <li>
                <strong>Cookies:</strong> Session cookies, preference cookies, analytics cookies
              </li>
            </ul>

            <h3 className="text-lg font-semibold text-neutral-900 mb-3">
              2.3 Information from Third Parties
            </h3>
            <ul className="list-disc pl-6 text-neutral-600 mb-4">
              <li>
                <strong>Integrations:</strong> Data from services you connect to Datacendia
              </li>
              <li>
                <strong>Single Sign-On:</strong> Identity information from SSO providers
              </li>
              <li>
                <strong>Public Sources:</strong> Business information from public databases
              </li>
            </ul>
          </section>

          {/* Data Usage */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              3. How We Use Your Information
            </h2>
            <ul className="list-disc pl-6 text-neutral-600 mb-4">
              <li>Provide, maintain, and improve our Services</li>
              <li>Process transactions and send related information</li>
              <li>Send technical notices, updates, and support messages</li>
              <li>Respond to your comments, questions, and customer service requests</li>
              <li>Monitor and analyze trends, usage, and activities</li>
              <li>
                Detect, investigate, and prevent fraudulent transactions and unauthorized access
              </li>
              <li>Personalize your experience and provide content recommendations</li>
              <li>Comply with legal obligations and enforce our policies</li>
            </ul>
          </section>

          {/* Legal Bases */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              4. Legal Bases for Processing (GDPR)
            </h2>
            <p className="text-neutral-600 mb-4">We process your personal data based on:</p>
            <ul className="list-disc pl-6 text-neutral-600 mb-4">
              <li>
                <strong>Contract Performance:</strong> To provide you with our Services
              </li>
              <li>
                <strong>Legitimate Interests:</strong> To improve our Services, prevent fraud,
                ensure security
              </li>
              <li>
                <strong>Legal Obligation:</strong> To comply with applicable laws and regulations
              </li>
              <li>
                <strong>Consent:</strong> For marketing communications and optional analytics
              </li>
            </ul>
          </section>

          {/* Data Sharing */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              5. How We Share Your Information
            </h2>
            <p className="text-neutral-600 mb-4">
              <strong>We do not sell your personal data.</strong> We may share your information
              with:
            </p>
            <ul className="list-disc pl-6 text-neutral-600 mb-4">
              <li>
                <strong>Service Providers:</strong> Companies that help us operate (hosting, payment
                processing, analytics)
              </li>
              <li>
                <strong>Business Partners:</strong> With your consent, for integrations you enable
              </li>
              <li>
                <strong>Legal Requirements:</strong> When required by law or to protect our rights
              </li>
              <li>
                <strong>Business Transfers:</strong> In connection with mergers or acquisitions
              </li>
              <li>
                <strong>Your Organization:</strong> Information shared with administrators of your
                account
              </li>
            </ul>
          </section>

          {/* Data Retention */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">6. Data Retention</h2>
            <p className="text-neutral-600 mb-4">
              We retain your personal data only as long as necessary for the purposes outlined in
              this policy:
            </p>
            <ul className="list-disc pl-6 text-neutral-600 mb-4">
              <li>
                <strong>Active Accounts:</strong> Duration of your subscription plus 30 days
              </li>
              <li>
                <strong>Deleted Accounts:</strong> 30 days for data recovery, then permanent
                deletion
              </li>
              <li>
                <strong>Audit Logs:</strong> 7 years for compliance purposes
              </li>
              <li>
                <strong>Backup Data:</strong> 90 days for disaster recovery
              </li>
            </ul>
          </section>

          {/* Your Rights */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">7. Your Rights</h2>

            <h3 className="text-lg font-semibold text-neutral-900 mb-3">7.1 All Users</h3>
            <ul className="list-disc pl-6 text-neutral-600 mb-4">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Delete your account and data</li>
              <li>Export your data</li>
              <li>Opt out of marketing communications</li>
            </ul>

            <h3 className="text-lg font-semibold text-neutral-900 mb-3">
              7.2 GDPR Rights (EU/EEA/UK)
            </h3>
            <ul className="list-disc pl-6 text-neutral-600 mb-4">
              <li>Right to be forgotten</li>
              <li>Right to data portability</li>
              <li>Right to restrict processing</li>
              <li>Right to object to processing</li>
              <li>Right to withdraw consent</li>
              <li>Right to lodge a complaint with a supervisory authority</li>
            </ul>

            <h3 className="text-lg font-semibold text-neutral-900 mb-3">
              7.3 CCPA Rights (California)
            </h3>
            <ul className="list-disc pl-6 text-neutral-600 mb-4">
              <li>Right to know what personal information is collected</li>
              <li>Right to delete personal information</li>
              <li>Right to opt-out of the sale of personal information (we don't sell data)</li>
              <li>Right to non-discrimination for exercising rights</li>
            </ul>

            <p className="text-neutral-600">
              To exercise these rights, contact us at{' '}
              <a
                href="mailto:privacy@datacendia.com"
                className="text-primary-600 hover:text-primary-700"
              >
                privacy@datacendia.com
              </a>
            </p>
          </section>

          {/* Security */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">8. Security</h2>
            <p className="text-neutral-600 mb-4">
              We implement industry-leading security measures to protect your data:
            </p>
            <ul className="list-disc pl-6 text-neutral-600 mb-4">
              <li>AES-256 encryption at rest and TLS 1.3 in transit</li>
              <li>SOC 2 Type II certified</li>
              <li>Regular penetration testing and security audits</li>
              <li>Multi-factor authentication support</li>
              <li>Role-based access controls</li>
              <li>24/7 security monitoring</li>
              <li>Incident response procedures</li>
            </ul>
          </section>

          {/* International Transfers */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              9. International Data Transfers
            </h2>
            <p className="text-neutral-600 mb-4">
              Your data may be transferred to and processed in countries outside your home country.
              For transfers from the EU/EEA, we use:
            </p>
            <ul className="list-disc pl-6 text-neutral-600 mb-4">
              <li>Standard Contractual Clauses (SCCs)</li>
              <li>EU-US Data Privacy Framework</li>
              <li>Adequacy decisions where applicable</li>
            </ul>
          </section>

          {/* Cookies */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">10. Cookies and Tracking</h2>
            <p className="text-neutral-600 mb-4">We use cookies and similar technologies for:</p>
            <ul className="list-disc pl-6 text-neutral-600 mb-4">
              <li>
                <strong>Essential Cookies:</strong> Required for the Services to function
              </li>
              <li>
                <strong>Analytics Cookies:</strong> To understand how you use our Services
              </li>
              <li>
                <strong>Preference Cookies:</strong> To remember your settings
              </li>
            </ul>
            <p className="text-neutral-600">
              You can manage cookie preferences through your browser settings or our cookie banner.
            </p>
          </section>

          {/* Children */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">11. Children's Privacy</h2>
            <p className="text-neutral-600">
              Our Services are not directed to individuals under 16. We do not knowingly collect
              personal data from children. If you become aware that a child has provided us with
              personal data, please contact us.
            </p>
          </section>

          {/* Changes */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">12. Changes to This Policy</h2>
            <p className="text-neutral-600">
              We may update this Privacy Policy from time to time. We will notify you of material
              changes by posting the new policy on this page and, for significant changes, by email.
              Your continued use of the Services after changes constitutes acceptance.
            </p>
          </section>

          {/* Contact */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">13. Contact Us</h2>
            <p className="text-neutral-600 mb-4">
              For questions about this Privacy Policy or to exercise your rights:
            </p>
            <div className="bg-neutral-50 rounded-lg p-6">
              <p className="text-neutral-900 font-medium">Datacendia, Inc.</p>
              <p className="text-neutral-600">Attn: Privacy Team</p>
              <p className="text-neutral-600">100 Enterprise Way, Suite 500</p>
              <p className="text-neutral-600">San Francisco, CA 94105</p>
              <p className="text-neutral-600 mt-4">
                Email:{' '}
                <a href="mailto:privacy@datacendia.com" className="text-primary-600">
                  privacy@datacendia.com
                </a>
              </p>
              <p className="text-neutral-600">
                DPO:{' '}
                <a href="mailto:dpo@datacendia.com" className="text-primary-600">
                  dpo@datacendia.com
                </a>
              </p>
            </div>
          </section>
        </div>

        {/* Download PDF */}
        <div className="mt-12 pt-8 border-t border-neutral-200 flex items-center justify-between">
          <button className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            Download PDF
          </button>
          <div className="text-sm text-neutral-500">Version 2.0 | Effective {effectiveDate}</div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-neutral-50 border-t border-neutral-200 py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-neutral-500">
          <p>© {new Date().getFullYear()} Datacendia, Inc. All rights reserved.</p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Link to="/terms" className="hover:text-neutral-900">
              Terms of Service
            </Link>
            <Link to="/license" className="hover:text-neutral-900">
              License
            </Link>
            <Link to="/security" className="hover:text-neutral-900">
              Security
            </Link>
            <Link to="/cookies" className="hover:text-neutral-900">
              Cookie Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicyPage;
