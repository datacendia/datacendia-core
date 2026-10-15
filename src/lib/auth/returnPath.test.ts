/**
 * Library — Return Path After Sign-In Test
 *
 * Sign-in returns visitors to the page they asked for, and only to a page
 * inside the app.
 */

import { describe, it, expect } from 'vitest';
import { DEFAULT_AFTER_SIGN_IN, returnPath } from './returnPath';

describe('returnPath', () => {
  it('returns the page the visitor asked for, query and hash included', () => {
    expect(returnPath({ from: '/cortex/council?mode=advisory#top' })).toBe('/cortex/council?mode=advisory#top');
  });

  it.each([[undefined], [null], [{}], [{ from: 42 }], [{ from: '' }]])(
    'falls back to the dashboard without a usable page: %j',
    (state) => {
      expect(returnPath(state)).toBe(DEFAULT_AFTER_SIGN_IN);
    }
  );

  it.each([
    ['https://evil.example/cortex'],
    ['//evil.example/cortex'],
    ['/\\evil.example'],
    ['javascript:alert(1)'],
    ['cortex/council'],
  ])('never leaves the app: %s', (from) => {
    expect(returnPath({ from })).toBe(DEFAULT_AFTER_SIGN_IN);
  });

  it.each([['/login'], ['/register?plan=pro'], ['/auth/login'], ['/login#form']])(
    'does not send the visitor back to sign-in: %s',
    (from) => {
      expect(returnPath({ from })).toBe(DEFAULT_AFTER_SIGN_IN);
    }
  );

  it('keeps pages that merely start with the same letters', () => {
    expect(returnPath({ from: '/loginsights' })).toBe('/loginsights');
  });
});
