/**
 * a16z (Andreessen Horowitz) Sandbox Page
 *
 * Template-driven sandbox demo using the SandboxTemplate component.
 * Config: src/pages/sandbox/configs/a16z.ts
 *
 * @module pages/sandbox/A16zSandboxPage
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import React from 'react';
import SandboxTemplatePage from './SandboxTemplate';
import config from './configs/a16z';

export const A16zSandboxPage: React.FC = () => {
  return <SandboxTemplatePage config={config} />;
};
