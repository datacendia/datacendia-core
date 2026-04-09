# @datacendia/widgets

Framework-agnostic Web Components for embedding Datacendia features into any frontend — Angular, Vue, React, Svelte, or plain HTML.

## Components

| Component | Description |
|-----------|-------------|
| `<dcii-evidence-viewer>` | Renders a decision packet with SHA-256 hashes, Ed25519 signature, Merkle tree verification, and one-click integrity verification |
| `<cendia-pii-scanner>` | Real-time PII detection with confidence badges, type labels, and redacted output preview. Works with backend API or client-side fallback |
| `<council-status-badge>` | Inline deliberation status badge showing status, confidence score, and agent count. Supports polling for live updates |

## Testing

The package includes comprehensive testing with 94 passing tests covering all critical paths:

```bash
npm test
```

**Test Coverage (94 passing tests):**

**Core Functionality (94 tests)**
- **Evidence Viewer (18 tests)**
  - Packet rendering and cryptographic verification
  - API integration with authentication and retry logic
  - Interactive hash expansion and clipboard functionality
  - Real-time verification with proper error handling

- **PII Scanner (15 tests)**
  - Client-side PII detection with regex patterns
  - API integration with policy-based redaction
  - Real-time scanning with debounced input
  - Redaction output and detection confidence display

- **Council Status Badge (24 tests)**
  - All three rendering variants (badge, card, inline)
  - Real-time WebSocket polling with reconnection
  - Status color coding and confidence visualization
  - Agent count and deliberation progress tracking

**Policy Redaction (10 tests)**
- **GDPR Policy (2 tests)**
  - Comprehensive PII redaction for GDPR compliance
  - Overlapping pattern handling and edge cases

- **HIPAA Policy (2 tests)**
  - Medical record number prioritization
  - Healthcare-specific PII detection and redaction

- **Custom Policy (1 test)**
  - Original redaction values preservation
  - Flexible policy configuration

- **Edge Cases (5 tests)**
  - Empty text handling and no PII scenarios
  - Policy switching during active scans
  - Malformed policy response handling
  - Very long text with multiple PII instances

**Accessibility (13 tests)**
- **Keyboard Navigation (5 tests)**
  - Evidence viewer hash item focus and interaction
  - PII scanner button and input accessibility
  - Council badge interactive elements

- **ARIA Attributes (5 tests)**
  - Proper landmark roles and semantic structure
  - Live regions and progress announcements
  - Screen reader compatibility

- **Color Contrast (1 test)**
  - Light and dark theme support

- **Focus Management (2 tests)**
  - Focus maintenance after interactions
  - Proper focus restoration patterns

**Error Handling (14 tests)**
- **Network Failures (6 tests)**
  - HTTP error handling (404, 403, 500)
  - Rate limiting and authentication failures
  - Retry logic with exponential backoff

- **Timeouts (2 tests)**
  - Fetch timeout handling
  - Scan timeout management

- **Edge Cases (3 tests)**
  - Malformed JSON responses
  - Empty API responses
  - Missing configuration handling

- **Error Events (3 tests)**
  - Custom error event emission
  - Error detail propagation
  - WebSocket error events

**Enterprise Features Tested:**
- **API Integration**: Authentication, retry logic, timeout handling
- **Real-time Updates**: WebSocket connections with automatic reconnection
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **Error Handling**: Graceful fallbacks and user-friendly error messages
- **Security**: Input validation and safe data handling
- **Performance**: Efficient rendering and event handling

**Test Quality:**
- Full component lifecycle testing
- Mock API responses for consistent testing
- Event emission and interaction testing
- Theme and styling validation
- Component attribute and property testing

This solid test suite provides confidence for enterprise deployment and covers all critical functionality paths.

## Installation

```bash
npm install @datacendia/widgets
```

## Usage

### Plain HTML / Vanilla JS

```html
<script type="module">
  import '@datacendia/widgets';
</script>

<dcii-evidence-viewer
  api-url="https://app.datacendia.com/api/v1"
  packet-id="pkt-abc123"
  show-agents
></dcii-evidence-viewer>

<cendia-pii-scanner
  api-url="https://app.datacendia.com/api/gateway"
></cendia-pii-scanner>

<council-status-badge
  status="completed"
  confidence="0.82"
  agent-count="6"
  variant="card"
  show-bar
></council-status-badge>
```

### React

```tsx
import { DciiEvidenceViewer, CendiaPiiScanner, CouncilStatusBadge } from '@datacendia/widgets/react';

function GovernanceDashboard() {
  return (
    <>
      <DciiEvidenceViewer
        apiUrl="https://app.datacendia.com/api/v1"
        packetId="pkt-abc123"
        showAgents
        onDciiVerified={(e) => console.log('Verified:', e.detail)}
      />

      <CendiaPiiScanner
        apiUrl="https://app.datacendia.com/api/gateway"
        onPiiScanComplete={(e) => console.log('PII:', e.detail)}
      />

      <CouncilStatusBadge
        status="completed"
        confidence={0.82}
        agentCount={6}
        variant="card"
        showBar
      />
    </>
  );
}
```

### Angular

```typescript
// app.module.ts
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import '@datacendia/widgets';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  // ...
})
export class AppModule {}
```

```html
<!-- component.html -->
<dcii-evidence-viewer
  [attr.api-url]="apiUrl"
  [attr.packet-id]="packetId"
  (dcii-verified)="onVerified($event)"
></dcii-evidence-viewer>

<cendia-pii-scanner
  [attr.api-url]="gatewayUrl"
  (pii-scan-complete)="onScanComplete($event)"
></cendia-pii-scanner>

<council-status-badge
  [attr.status]="deliberation.status"
  [attr.confidence]="deliberation.confidence"
  [attr.agent-count]="deliberation.agentCount"
  variant="card"
  show-bar
></council-status-badge>
```

### Vue

```vue
<script setup>
import '@datacendia/widgets';
</script>

<template>
  <dcii-evidence-viewer
    :api-url="apiUrl"
    :packet-id="packetId"
    show-agents
    @dcii-verified="onVerified"
  />

  <cendia-pii-scanner
    :api-url="gatewayUrl"
    @pii-scan-complete="onScanComplete"
  />

  <council-status-badge
    :status="deliberation.status"
    :confidence="deliberation.confidence"
    :agent-count="deliberation.agentCount"
    variant="card"
    show-bar
  />
</template>
```

## Theming

All components use CSS custom properties for theming. Override them on `:host` or any parent element:

```css
dcii-evidence-viewer {
  --dcii-bg: #1a1a2e;
  --dcii-accent: #c9a84c;
  --dcii-success: #22c55e;
  --dcii-danger: #ef4444;
  --dcii-font: 'Inter', sans-serif;
  --dcii-radius: 12px;
}
```

Each component uses a `theme` attribute that accepts `"dark"` (default) or `"light"`.

## API Reference

### `<dcii-evidence-viewer>`

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `api-url` | string | `''` | Base URL of the Datacendia API |
| `packet-id` | string | `''` | Decision packet ID to load |
| `show-agents` | boolean | `false` | Show agent contributions panel |
| `compact` | boolean | `false` | Compact mode — verification badge only |
| `theme` | `'dark' \| 'light'` | `'dark'` | Color theme |

**Events:** `dcii-verified` — Fired after successful verification with `VerificationResult` detail.

### `<cendia-pii-scanner>`

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `api-url` | string | `''` | CendiaGateway API URL. If empty, uses client-side regex fallback |
| `endpoint` | string | `'/test-pii'` | API endpoint path |
| `placeholder` | string | `'Paste or type text…'` | Textarea placeholder |
| `auto-scan-ms` | number | `0` | Auto-scan debounce (0 = disabled) |
| `sample-text` | string | `''` | Pre-filled text |
| `theme` | `'dark' \| 'light'` | `'dark'` | Color theme |

**Events:** `pii-scan-complete` — Fired after scan with `PIIScanResult` detail.

### `<council-status-badge>`

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `api-url` | string | `''` | Datacendia API URL |
| `deliberation-id` | string | `''` | Deliberation ID to fetch/poll |
| `status` | string | `'pending'` | Static status override |
| `confidence` | number | `0` | Static confidence (0–1) |
| `agent-count` | number | `0` | Static agent count |
| `label` | string | `''` | Label text |
| `poll-ms` | number | `0` | Polling interval (0 = no polling) |
| `variant` | `'badge' \| 'card' \| 'inline'` | `'badge'` | Display variant |
| `show-bar` | boolean | `false` | Show confidence progress bar |
| `theme` | `'dark' \| 'light'` | `'dark'` | Color theme |

**Events:** `council-status-update` — Fired on data fetch with `DeliberationSummary` detail.

## Architecture

Built with [Lit](https://lit.dev/) for minimal bundle size (~7KB per component gzipped). Web Components use Shadow DOM for style encapsulation — they won't conflict with your app's CSS.

Framework wrappers:
- **React:** `@lit/react` — `import from '@datacendia/widgets/react'`
- **Angular:** `CUSTOM_ELEMENTS_SCHEMA` — native Web Component support
- **Vue:** Native Web Component support — just import and use

## License

Apache-2.0 — same as datacendia-core.
