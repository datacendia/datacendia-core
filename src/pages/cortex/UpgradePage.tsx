// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * Page — Enterprise Upgrade
 *
 * Displayed when a user navigates to an enterprise-only feature in the
 * Community Edition. Shows what's available and links to pricing.
 *
 * @module pages/cortex/UpgradePage
 */

export default function UpgradePage() {
  return (
    <div style={{ maxWidth: 640, margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>
        Enterprise Feature
      </h1>
      <p style={{ fontSize: 16, color: '#6b7280', marginBottom: 24, lineHeight: 1.6 }}>
        This feature is available in the <strong>Datacendia Enterprise Edition</strong>.
        The Community Edition includes The Council, multi-agent deliberation,
        immutable audit trails, and 30 industry verticals.
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <a
          href="https://datacendia.com/pricing.html"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            padding: '10px 24px',
            backgroundColor: '#2563eb',
            color: '#fff',
            borderRadius: 8,
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          View Pricing
        </a>
        <a
          href="https://github.com/datacendia/datacendia-core"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            padding: '10px 24px',
            backgroundColor: 'transparent',
            color: '#2563eb',
            border: '1px solid #2563eb',
            borderRadius: 8,
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          Community Features
        </a>
      </div>
      <p style={{ fontSize: 13, color: '#9ca3af', marginTop: 32 }}>
        Enterprise plans start at $499/month.
        Contact <a href="mailto:enterprise@datacendia.com">enterprise@datacendia.com</a> for a demo.
      </p>
    </div>
  );
}
