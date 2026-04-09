/**
 * Tests — <council-status-badge>
 *
 * Verifies rendering for all three variants (badge, card, inline),
 * attribute binding, status colors, and confidence display.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import '../components/council-status-badge.js';
import type { CouncilStatusBadge } from '../components/council-status-badge.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function createElement(attrs: Record<string, unknown> = {}): Promise<CouncilStatusBadge> {
  const el = document.createElement('council-status-badge') as CouncilStatusBadge;
  for (const [key, val] of Object.entries(attrs)) {
    el.setAttribute(key, String(val));
  }
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

function shadow(el: CouncilStatusBadge): ShadowRoot {
  return el.shadowRoot!;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('council-status-badge', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('registers as a custom element', () => {
    expect(customElements.get('council-status-badge')).toBeDefined();
  });

  // --- Badge variant (default) ---

  it('renders badge variant by default', async () => {
    const el = await createElement({ status: 'completed', confidence: '0.82', 'agent-count': '6' });
    const root = shadow(el);

    expect(root.querySelector('.badge-root')).toBeTruthy();
  });

  it('shows status label in badge', async () => {
    const el = await createElement({ status: 'completed' });
    const root = shadow(el);

    expect(root.querySelector('.status-label')?.textContent).toContain('Completed');
  });

  it('shows confidence percentage', async () => {
    const el = await createElement({ status: 'completed', confidence: '0.82' });
    const root = shadow(el);

    expect(root.querySelector('.conf')?.textContent).toContain('82%');
  });

  it('shows agent count', async () => {
    const el = await createElement({ status: 'completed', 'agent-count': '6' });
    const root = shadow(el);

    expect(root.textContent).toContain('6');
  });

  it('shows green dot for completed status', async () => {
    const el = await createElement({ status: 'completed' });
    const root = shadow(el);

    const dot = root.querySelector('.status-dot') as HTMLElement;
    expect(dot?.style.background).toContain('#22c55e');
  });

  it('shows blue dot for deliberating status', async () => {
    const el = await createElement({ status: 'deliberating' });
    const root = shadow(el);

    const dot = root.querySelector('.status-dot') as HTMLElement;
    expect(dot?.style.background).toContain('#3b82f6');
  });

  it('shows red dot for failed status', async () => {
    const el = await createElement({ status: 'failed' });
    const root = shadow(el);

    const dot = root.querySelector('.status-dot') as HTMLElement;
    expect(dot?.style.background).toContain('#ef4444');
  });

  it('shows yellow dot for pending status', async () => {
    const el = await createElement({ status: 'pending' });
    const root = shadow(el);

    const dot = root.querySelector('.status-dot') as HTMLElement;
    expect(dot?.style.background).toContain('#eab308');
  });

  // --- Status labels ---

  it('renders correct label for cross_examination', async () => {
    const el = await createElement({ status: 'cross_examination' });
    const root = shadow(el);

    expect(root.querySelector('.status-label')?.textContent).toContain('Cross-Exam');
  });

  it('renders correct label for in_progress', async () => {
    const el = await createElement({ status: 'in_progress' });
    const root = shadow(el);

    expect(root.querySelector('.status-label')?.textContent).toContain('In Progress');
  });

  // --- Confidence colors ---

  it('shows green confidence for >= 80%', async () => {
    const el = await createElement({ status: 'completed', confidence: '0.85' });
    const root = shadow(el);

    const conf = root.querySelector('.conf') as HTMLElement;
    expect(conf?.style.color).toContain('#22c55e');
  });

  it('shows yellow confidence for 60-79%', async () => {
    const el = await createElement({ status: 'completed', confidence: '0.65' });
    const root = shadow(el);

    const conf = root.querySelector('.conf') as HTMLElement;
    expect(conf?.style.color).toContain('#eab308');
  });

  it('shows red confidence for < 60%', async () => {
    const el = await createElement({ status: 'completed', confidence: '0.45' });
    const root = shadow(el);

    const conf = root.querySelector('.conf') as HTMLElement;
    expect(conf?.style.color).toContain('#ef4444');
  });

  // --- Card variant ---

  it('renders card variant', async () => {
    const el = await createElement({ variant: 'card', status: 'completed', confidence: '0.82', 'agent-count': '6' });
    const root = shadow(el);

    expect(root.querySelector('.card-root')).toBeTruthy();
    expect(root.querySelector('.card-metrics')).toBeTruthy();
  });

  it('shows label in card variant', async () => {
    const el = await createElement({ variant: 'card', status: 'completed', label: 'CRE Acquisition Review' });
    const root = shadow(el);

    expect(root.querySelector('.card-label')?.textContent).toContain('CRE Acquisition Review');
  });

  it('shows confidence bar in card when show-bar is set', async () => {
    const el = await createElement({ variant: 'card', status: 'completed', confidence: '0.82', 'show-bar': '' });
    const root = shadow(el);

    expect(root.querySelector('.conf-bar')).toBeTruthy();
    const fill = root.querySelector('.conf-fill') as HTMLElement;
    expect(fill?.style.width).toBe('82%');
  });

  // --- Inline variant ---

  it('renders inline variant', async () => {
    const el = await createElement({ variant: 'inline', status: 'completed', confidence: '0.82' });
    const root = shadow(el);

    expect(root.querySelector('.inline-root')).toBeTruthy();
  });

  it('shows checkmark icon for completed in inline mode', async () => {
    const el = await createElement({ variant: 'inline', status: 'completed' });
    const root = shadow(el);

    expect(root.querySelector('.status-icon')?.textContent).toContain('✓');
  });

  it('shows circle icon for deliberating in inline mode', async () => {
    const el = await createElement({ variant: 'inline', status: 'deliberating' });
    const root = shadow(el);

    expect(root.querySelector('.status-icon')?.textContent).toContain('◉');
  });

  // --- Themes ---

  it('supports light theme in badge mode', async () => {
    const el = await createElement({ theme: 'light', status: 'completed' });
    const root = shadow(el);

    expect(root.querySelector('.light')).toBeTruthy();
  });

  it('supports light theme in card mode', async () => {
    const el = await createElement({ variant: 'card', theme: 'light', status: 'completed' });
    const root = shadow(el);

    expect(root.querySelector('.card-root.light')).toBeTruthy();
  });

  // --- Edge cases ---

  it('hides confidence when zero', async () => {
    const el = await createElement({ status: 'pending' });
    const root = shadow(el);

    expect(root.querySelector('.conf')).toBeNull();
  });

  it('hides agent count when zero', async () => {
    const el = await createElement({ status: 'pending' });
    const root = shadow(el);

    expect(root.querySelector('.agents')).toBeNull();
  });
});
