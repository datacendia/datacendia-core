// Re-export from src/lib/utils for deeply nested import paths
export * from '../src/lib/utils';

// Community stubs for utility functions (enterprise implementations in datacendia-components)
export function formatCurrency(value: number, currency = 'USD', locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value);
}

export function formatNumber(value: number, decimalsOrLocale: number | string = 'en-US'): string {
  if (typeof decimalsOrLocale === 'number') {
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: decimalsOrLocale, maximumFractionDigits: decimalsOrLocale }).format(value);
  }
  return new Intl.NumberFormat(decimalsOrLocale).format(value);
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}
