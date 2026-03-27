/**
 * Formula 1 Sandbox Page
 *
 * Template-driven sandbox demo using the SandboxTemplate component.
 * Config: src/pages/sandbox/configs/formula1.ts
 *
 * @module pages/sandbox/Formula1SandboxPage
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import React from 'react';
import SandboxTemplatePage from './SandboxTemplate';
import f1Config from './configs/formula1';

export const Formula1SandboxPage: React.FC = () => {
  return <SandboxTemplatePage config={f1Config} />;
};

export default Formula1SandboxPage;
