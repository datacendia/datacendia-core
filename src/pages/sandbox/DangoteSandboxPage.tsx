/**
 * Dangote Group Sandbox Page
 *
 * Template-driven sandbox demo using the SandboxTemplate component.
 * Config: src/pages/sandbox/configs/dangote.ts
 *
 * @module pages/sandbox/DangoteSandboxPage
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import React from 'react';
import SandboxTemplatePage from './SandboxTemplate';
import config from './configs/dangote';

export const DangoteSandboxPage: React.FC = () => {
  return <SandboxTemplatePage config={config} />;
};

export default DangoteSandboxPage;
