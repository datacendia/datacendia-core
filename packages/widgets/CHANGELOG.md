# Changelog — @datacendia/widgets

All notable changes to the Datacendia Web Components package.

## [0.1.0] — 2026-04-09

### Added

- **`<dcii-evidence-viewer>`** — Decision packet viewer with SHA-256 artifact hashes, Ed25519 signature display, Merkle tree root, confidence bar, agent contributions panel, regulatory framework tags, and one-click integrity verification via API. Compact mode for inline use.
- **`<cendia-pii-scanner>`** — Real-time PII detection widget with textarea input, backend API integration (`/test-pii`, `/scan`), client-side regex fallback for offline use, detection cards with type labels and confidence percentages, severity-colored badges, and redacted output preview.
- **`<council-status-badge>`** — Deliberation status component with three variants: badge (pill), card (mini dashboard with progress bars), and inline (icon + percentage). Supports API polling with auto-stop on completion.
- **React wrappers** via `@lit/react` — typed event props for all components.
- **Angular support** via `CUSTOM_ELEMENTS_SCHEMA` — documented attribute binding.
- **Vue support** — native Web Component binding.
- **CSS custom property theming** — full dark/light mode support across all components.
- **Demo page** (`demo.html`) — standalone HTML page with static data showcasing all components and variants.
- **Test suite** — 50+ tests covering rendering, attribute binding, client-side PII detection, status variants, theme switching, and event emission.
- **CI workflow** — GitHub Actions pipeline for build, type-check, test, and dist verification on every push to `packages/widgets/`.
