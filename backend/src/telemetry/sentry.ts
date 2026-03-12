// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

export const sentry = {
  isEnabled(): boolean {
    return false;
  },
  errorHandler(): (err: any, req: any, res: any, next: any) => void {
    return (err: any, _req: any, _res: any, next: any) => next(err);
  },
};
