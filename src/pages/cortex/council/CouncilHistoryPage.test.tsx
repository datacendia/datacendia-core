// @vitest-environment jsdom
/**
 * Council — History Page Test
 *
 * The history lists the workspace's own deliberations and nothing invented: an
 * empty workspace says so and points to the Council, and a failed load says it
 * failed instead of showing sample rows. Every page of results is loaded, and
 * the CSV export holds the rows as shown, in order, with formulas kept inert.
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
  vi.restoreAllMocks();
});

const HEADER = '"Title","Status","Consensus %","Mode","Agents","Duration","Date","Tags"';

// A completed deliberation with no dissent, as GET /deliberations returns it.
const row = (fields: Record<string, unknown>) => ({
  status: 'COMPLETED',
  confidence: 0.5,
  decision: { status: 'APPROVED', dissent: [] },
  created_at: '2026-10-01T00:00:00Z',
  ...fields,
});

// Catches the export's download; the returned function reads the CSV it built.
function captureCsv(): () => Promise<string[]> {
  const blobs: Blob[] = [];
  URL.createObjectURL = vi.fn((blob: Blob) => {
    blobs.push(blob);
    return 'blob:csv';
  });
  URL.revokeObjectURL = vi.fn();
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
  return () =>
    new Promise<string[]>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split('\r\n'));
      reader.readAsText(blobs[0]);
    });
}

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
      data: [row({ id: 'dlb-1', question: 'Should we enter the Chilean market?', confidence: 0.82 })],
    });

    renderPage();

    expect(await screen.findByText('Should we enter the Chilean market?')).toBeTruthy();
    // The row's score, and the average of the one row
    expect(screen.getAllByText('82%')).toHaveLength(2);
    expect(screen.getByRole('button', { name: /Export CSV/ }).hasAttribute('disabled')).toBe(false);
  });

  it('loads every page of a workspace with more than one', async () => {
    const firstPage = Array.from({ length: 100 }, (_, i) => row({ id: `p1-${i}`, question: `Question ${i + 1}` }));
    get.mockImplementation(async (_path: string, params: { page: number }) => ({
      success: true,
      data: params.page === 1 ? firstPage : [row({ id: 'p2-0', question: 'Question 101' })],
      pagination: { page: params.page, limit: 100, total: 101, totalPages: 2 },
    }));

    renderPage();

    expect(await screen.findByText('Question 101')).toBeTruthy();
    expect(get).toHaveBeenCalledTimes(2);
    expect(get).toHaveBeenLastCalledWith('/deliberations', { page: 2, limit: 100 });
    expect(screen.getByText('101')).toBeTruthy();
  });

  it('exports the rows as a CSV a spreadsheet cannot execute', async () => {
    get.mockResolvedValue({
      success: true,
      data: [
        row({ id: 'dlb-2', question: '=HYPERLINK("http://example.com","Open")', created_at: '2026-10-02T00:00:00Z' }),
        row({ id: 'dlb-3', question: '\t=SUM(A1:A2)', created_at: '2026-10-01T00:00:00Z' }),
      ],
    });
    const readCsv = captureCsv();

    renderPage();
    await screen.findByText('=HYPERLINK("http://example.com","Open")');
    fireEvent.click(screen.getByRole('button', { name: /Export CSV/ }));

    expect(await readCsv()).toEqual([
      HEADER,
      // A leading quote keeps a formula as text, even behind a tab; inner quotes are doubled
      `"'=HYPERLINK(""http://example.com"",""Open"")","Consensus","50","Council","0","—","2026-10-02T00:00:00Z",""`,
      `"'\t=SUM(A1:A2)","Consensus","50","Council","0","—","2026-10-01T00:00:00Z",""`,
    ]);
  });

  it('exports only the rows the filter keeps, in the chosen order', async () => {
    get.mockResolvedValue({
      success: true,
      data: [
        row({ id: 'a', question: 'Expand to Lima', confidence: 0.95, created_at: '2026-10-01T00:00:00Z' }),
        row({
          id: 'b',
          question: 'Cut the R&D budget',
          confidence: 0.9,
          decision: { status: 'APPROVED', dissent: ['CFO'] },
          created_at: '2026-10-03T00:00:00Z',
        }),
        row({ id: 'c', question: 'Hire a CISO', confidence: 0.6, created_at: '2026-10-02T00:00:00Z' }),
      ],
    });
    const readCsv = captureCsv();

    renderPage();
    await screen.findByText('Expand to Lima');
    fireEvent.click(screen.getByRole('button', { name: 'consensus' }));
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'consensus' } });
    fireEvent.click(screen.getByRole('button', { name: /Export CSV/ }));

    // The split decision is filtered out; sorted by date, the CISO row would come first
    expect(await readCsv()).toEqual([
      HEADER,
      '"Expand to Lima","Consensus","95","Council","0","—","2026-10-01T00:00:00Z",""',
      '"Hire a CISO","Consensus","60","Council","0","—","2026-10-02T00:00:00Z",""',
    ]);
  });
});
