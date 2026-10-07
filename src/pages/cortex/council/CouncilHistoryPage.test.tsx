// @vitest-environment jsdom
/**
 * Council — History Page Test
 *
 * The history lists the workspace's own deliberations and nothing invented: an
 * empty workspace says so and points to the Council, and a failed load says it
 * failed instead of showing sample rows. The CSV export keeps formulas inert.
 */

import { afterEach, describe, it, expect, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const get = vi.hoisted(() => vi.fn());
vi.mock('../../../lib/api/client', () => ({ default: { api: { get } } }));

import { CouncilHistoryPage } from './CouncilHistoryPage';

const renderPage = () =>
  render(
    <MemoryRouter>
      <CouncilHistoryPage />
    </MemoryRouter>
  );

afterEach(() => {
  cleanup();
  get.mockReset();
});

describe('CouncilHistoryPage', () => {
  it('says an empty workspace is empty and offers the Council', async () => {
    get.mockResolvedValue({ success: true, data: [] });

    renderPage();

    expect(await screen.findByText('No deliberations in this workspace yet.')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Ask the Council' })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Export CSV/ }).hasAttribute('disabled')).toBe(true);
  });

  it('reports a failed load instead of showing sample deliberations', async () => {
    get.mockResolvedValue({ success: false, error: { code: 'HTTP_ERROR', message: 'HTTP 500' } });

    renderPage();

    expect(await screen.findByText('The deliberations could not be loaded.')).toBeTruthy();
    expect(screen.queryByText('No deliberations in this workspace yet.')).toBeNull();
  });

  it('lists what the API returns', async () => {
    get.mockResolvedValue({
      success: true,
      data: [
        {
          id: 'dlb-1',
          question: 'Should we enter the Chilean market?',
          status: 'COMPLETED',
          confidence: 0.82,
          decision: { status: 'APPROVED', dissent: [] },
          created_at: '2026-10-01T12:00:00Z',
        },
      ],
    });

    renderPage();

    expect(await screen.findByText('Should we enter the Chilean market?')).toBeTruthy();
    // The row's score, and the average of the one row
    expect(screen.getAllByText('82%')).toHaveLength(2);
    expect(screen.getByRole('button', { name: /Export CSV/ }).hasAttribute('disabled')).toBe(false);
  });

  it('exports the rows as a CSV a spreadsheet cannot execute', async () => {
    get.mockResolvedValue({
      success: true,
      data: [
        {
          id: 'dlb-2',
          question: '=HYPERLINK("http://example.com","Open")',
          status: 'COMPLETED',
          confidence: 0.5,
          created_at: '2026-10-02T00:00:00Z',
        },
      ],
    });
    const blobs: Blob[] = [];
    URL.createObjectURL = vi.fn((blob: Blob) => {
      blobs.push(blob);
      return 'blob:csv';
    });
    URL.revokeObjectURL = vi.fn();
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    renderPage();
    await screen.findByText('=HYPERLINK("http://example.com","Open")');
    fireEvent.click(screen.getByRole('button', { name: /Export CSV/ }));

    expect(click).toHaveBeenCalledTimes(1);
    const text = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.readAsText(blobs[0]);
    });
    expect(text.split('\r\n')).toEqual([
      '"Title","Status","Consensus %","Mode","Agents","Duration","Date","Tags"',
      // A leading quote keeps the formula as text; inner quotes are doubled
      '"\'=HYPERLINK(""http://example.com"",""Open"")","Consensus","50","Council","0","—","2026-10-02T00:00:00Z",""',
    ]);
    click.mockRestore();
  });
});
