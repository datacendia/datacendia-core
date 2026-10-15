/**
 * Type Definitions — oracledb
 *
 * The Oracle driver is optional: ClientHostedAdapter loads it with a dynamic
 * import only when an organization connects an Oracle database, and tells the
 * operator to install it otherwise. This keeps the backend typechecking
 * without the package installed.
 * @module types/oracledb.d
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

declare module 'oracledb';
