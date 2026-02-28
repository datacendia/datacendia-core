// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { api, setCurrentDataSourceId } from './client';

// These tests verify that the ApiClient propagates the currently selected
// data source via the X-Data-Source-Id header on all requests.

describe('ApiClient data source header propagation', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ success: true }),
    } as any);

    (globalThis as any).fetch = fetchMock;

    // Clear any previously stored data source id
    setCurrentDataSourceId(null);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('includes X-Data-Source-Id header when a current data source is set', async () => {
    const dataSourceId = 'test-ds-id';
    setCurrentDataSourceId(dataSourceId);

    await api.get('/test-endpoint');

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [, options] = fetchMock.mock.calls[0];
    const headers = (options as any).headers as Record<string, string>;

    expect(headers['X-Data-Source-Id']).toBe(dataSourceId);
  });
});
