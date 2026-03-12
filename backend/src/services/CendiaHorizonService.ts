// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// Auto-generated stub — implement as needed

export interface ChangeType { [key: string]: any; }

export interface NodeType { [key: string]: any; }

export interface EdgeType { [key: string]: any; }

export const cendiaHorizonService: any = new Proxy({}, {
  get: (_t: any, prop: string) => {
    if (prop === 'then') return undefined;
    return (..._args: any[]) => Promise.resolve({});
  },
});

export class ChangeSpec { [key: string]: any; }

export class TimeHorizon { [key: string]: any; }
