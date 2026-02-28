// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA - TERMS OF SERVICE PAGE
// Enterprise Terms of Service
// =============================================================================

import React from 'react';
import { Link } from 'react-router-dom';

export const TermsPage: React.FC = () => {
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
            <Link to="/privacy" className="text-neutral-600 hover:text-neutral-900">
              Privacy
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
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">Terms of Service</h1>
          <div className="text-sm text-neutral-500 space-x-4">
            <span>Last updated: {lastUpdated}</span>
            <span>•</span>
            <span>Effective: {effectiveDate}</span>
          </div>
        </div>

        <div className="prose prose-neutral max-w-none">
          {/* Acceptance */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-neutral-600 mb-4">
              By accessing or using the Datacendia platform, services, software, or websites
              (collectively, the "Services"), you agree to be bound by these Terms of Service
              ("Terms"). If you are using the Services on behalf of an organization, you represent
              that you have authority to bind that organization to these Terms.
            </p>
            <p className="text-neutral-600">
              If you do not agree to these Terms, you may not access or use the Services.
            </p>
          </section>

          {/* Description */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">2. Description of Services</h2>
            <p className="text-neutral-600 mb-4">
              Datacendia provides an enterprise intelligence platform that includes:
            </p>
            <ul className="list-disc pl-6 text-neutral-600 mb-4">
              <li>Data integration and knowledge graph capabilities</li>
              <li>AI-powered analytics and forecasting</li>
              <li>Workflow automation and orchestration</li>
              <li>Real-time health monitoring and alerting</li>
              <li>Data governance and compliance tools</li>
              <li>AI advisory and decision support</li>
            </ul>
          </section>

          {/* Accounts */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">3. Account Registration</h2>
            <p className="text-neutral-600 mb-4">
              To use certain features, you must register for an account. You agree to:
            </p>
            <ul className="list-disc pl-6 text-neutral-600 mb-4">
              <li>Provide accurate, current, and complete registration information</li>
              <li>Maintain and promptly update your account information</li>
              <li>Maintain the security of your password and account</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>
          </section>

          {/* Subscription */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              4. Subscription and Payment
            </h2>

            <h3 className="text-lg font-semibold text-neutral-900 mb-3">4.1 Subscription Plans</h3>
            <p className="text-neutral-600 mb-4">
              The Services are offered on a subscription basis. Your subscription includes access to
              the features specified in your plan. We reserve the right to modify plans with
              reasonable notice.
            </p>

            <h3 className="text-lg font-semibold text-neutral-900 mb-3">4.2 Payment Terms</h3>
            <ul className="list-disc pl-6 text-neutral-600 mb-4">
              <li>Fees are billed in advance on a monthly or annual basis</li>
              <li>All fees are non-refundable except as required by law</li>
              <li>You authorize us to charge your payment method automatically</li>
              <li>Unpaid fees may result in suspension or termination</li>
            </ul>

            <h3 className="text-lg font-semibold text-neutral-900 mb-3">4.3 Price Changes</h3>
            <p className="text-neutral-600">
              We may change prices with at least 30 days' notice. Price changes take effect at the
              start of your next billing cycle.
            </p>
          </section>

          {/* Use Restrictions */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">5. Acceptable Use</h2>
            <p className="text-neutral-600 mb-4">You agree not to:</p>
            <ul className="list-disc pl-6 text-neutral-600 mb-4">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe any intellectual property or privacy rights</li>
              <li>Transmit malware, viruses, or harmful code</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt the Services</li>
              <li>Reverse engineer, decompile, or disassemble the Services</li>
              <li>Resell, sublicense, or redistribute the Services</li>
              <li>Use the Services to harm others or engage in illegal activities</li>
              <li>Circumvent any usage limits or restrictions</li>
              <li>Use automated means to access the Services without permission</li>
            </ul>
          </section>

          {/* Your Data */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">6. Your Data</h2>

            <h3 className="text-lg font-semibold text-neutral-900 mb-3">6.1 Ownership</h3>
            <p className="text-neutral-600 mb-4">
              You retain all rights to your data. By uploading data to the Services, you grant us a
              limited license to host, store, process, and display your data solely to provide the
              Services.
            </p>

            <h3 className="text-lg font-semibold text-neutral-900 mb-3">6.2 Data Processing</h3>
            <p className="text-neutral-600 mb-4">
              We process your data in accordance with our Data Processing Agreement and Privacy
              Policy. For EU/EEA customers, we act as a data processor.
            </p>

            <h3 className="text-lg font-semibold text-neutral-900 mb-3">6.3 Data Portability</h3>
            <p className="text-neutral-600">
              You may export your data at any time through the platform. Upon termination, we will
              make your data available for export for 30 days.
            </p>
          </section>

          {/* Intellectual Property */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">7. Intellectual Property</h2>

            <h3 className="text-lg font-semibold text-neutral-900 mb-3">7.1 Our IP</h3>
            <p className="text-neutral-600 mb-4">
              The Services, including all software, content, trademarks, and technology, are owned
              by Datacendia or our licensors. Nothing in these Terms grants you any rights except
              the limited license to use the Services.
            </p>

            <h3 className="text-lg font-semibold text-neutral-900 mb-3">7.2 Feedback</h3>
            <p className="text-neutral-600">
              If you provide feedback or suggestions, you grant us a perpetual, royalty-free license
              to use and incorporate such feedback into our Services.
            </p>
          </section>

          {/* Confidentiality */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">8. Confidentiality</h2>
            <p className="text-neutral-600 mb-4">
              Both parties agree to protect confidential information disclosed during the provision
              of Services. Confidential information includes pricing, technical details, and
              business information not publicly available.
            </p>
            <p className="text-neutral-600">
              This obligation survives termination for a period of 5 years.
            </p>
          </section>

          {/* Warranties */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              9. Warranties and Disclaimers
            </h2>

            <h3 className="text-lg font-semibold text-neutral-900 mb-3">9.1 Our Warranties</h3>
            <p className="text-neutral-600 mb-4">We warrant that:</p>
            <ul className="list-disc pl-6 text-neutral-600 mb-4">
              <li>The Services will perform materially as described</li>
              <li>We have the right to provide the Services</li>
              <li>We will use commercially reasonable security measures</li>
            </ul>

            <h3 className="text-lg font-semibold text-neutral-900 mb-3">9.2 Disclaimers</h3>
            <p className="text-neutral-600 uppercase font-semibold">
              EXCEPT AS EXPRESSLY PROVIDED, THE SERVICES ARE PROVIDED "AS IS" WITHOUT WARRANTY OF
              ANY KIND. WE DISCLAIM ALL IMPLIED WARRANTIES INCLUDING MERCHANTABILITY, FITNESS FOR A
              PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>
          </section>

          {/* Limitation */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              10. Limitation of Liability
            </h2>
            <p className="text-neutral-600 mb-4 uppercase font-semibold">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, DATACENDIA SHALL NOT BE LIABLE FOR ANY
              INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF
              PROFITS, REVENUE, DATA, OR USE, WHETHER IN CONTRACT, TORT, OR OTHERWISE.
            </p>
            <p className="text-neutral-600 uppercase font-semibold">
              OUR TOTAL LIABILITY SHALL NOT EXCEED THE FEES PAID BY YOU IN THE 12 MONTHS PRECEDING
              THE CLAIM.
            </p>
          </section>

          {/* Indemnification */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">11. Indemnification</h2>
            <p className="text-neutral-600">
              You agree to indemnify and hold harmless Datacendia from any claims, damages, and
              expenses arising from: (a) your use of the Services, (b) your violation of these
              Terms, (c) your violation of any third-party rights, or (d) your data.
            </p>
          </section>

          {/* Termination */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">12. Termination</h2>

            <h3 className="text-lg font-semibold text-neutral-900 mb-3">12.1 By You</h3>
            <p className="text-neutral-600 mb-4">
              You may cancel your subscription at any time. Cancellation takes effect at the end of
              your current billing period.
            </p>

            <h3 className="text-lg font-semibold text-neutral-900 mb-3">12.2 By Us</h3>
            <p className="text-neutral-600 mb-4">
              We may suspend or terminate your access if you breach these Terms, fail to pay fees,
              or if required by law. We will provide notice except in cases of emergency.
            </p>

            <h3 className="text-lg font-semibold text-neutral-900 mb-3">
              12.3 Effect of Termination
            </h3>
            <p className="text-neutral-600">
              Upon termination, your right to use the Services ceases. You may export your data for
              30 days. Provisions that should survive termination will survive.
            </p>
          </section>

          {/* General */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">13. General Provisions</h2>

            <h3 className="text-lg font-semibold text-neutral-900 mb-3">13.1 Governing Law</h3>
            <p className="text-neutral-600 mb-4">
              These Terms are governed by the laws of the State of Delaware, USA, without regard to
              conflict of laws principles.
            </p>

            <h3 className="text-lg font-semibold text-neutral-900 mb-3">13.2 Dispute Resolution</h3>
            <p className="text-neutral-600 mb-4">
              Any disputes shall be resolved through binding arbitration in San Francisco, CA,
              except that either party may seek injunctive relief in court.
            </p>

            <h3 className="text-lg font-semibold text-neutral-900 mb-3">13.3 Modifications</h3>
            <p className="text-neutral-600 mb-4">
              We may modify these Terms with notice. Material changes will be announced at least 30
              days in advance. Continued use constitutes acceptance.
            </p>

            <h3 className="text-lg font-semibold text-neutral-900 mb-3">13.4 Entire Agreement</h3>
            <p className="text-neutral-600 mb-4">
              These Terms, together with our Privacy Policy and any Order Form, constitute the
              entire agreement between you and Datacendia.
            </p>

            <h3 className="text-lg font-semibold text-neutral-900 mb-3">13.5 Assignment</h3>
            <p className="text-neutral-600">
              You may not assign these Terms without our consent. We may assign these Terms in
              connection with a merger or acquisition.
            </p>
          </section>

          {/* Contact */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">14. Contact Us</h2>
            <div className="bg-neutral-50 rounded-lg p-6">
              <p className="text-neutral-900 font-medium">Datacendia, Inc.</p>
              <p className="text-neutral-600">100 Enterprise Way, Suite 500</p>
              <p className="text-neutral-600">San Francisco, CA 94105</p>
              <p className="text-neutral-600 mt-4">
                Email:{' '}
                <a href="mailto:legal@datacendia.com" className="text-primary-600">
                  legal@datacendia.com
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
            <Link to="/privacy" className="hover:text-neutral-900">
              Privacy Policy
            </Link>
            <Link to="/license" className="hover:text-neutral-900">
              License
            </Link>
            <Link to="/security" className="hover:text-neutral-900">
              Security
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TermsPage;
