/**
 * Cusco FC Sandbox Page
 *
 * Template-driven sandbox demo using the SandboxTemplate component.
 * Config: src/pages/sandbox/configs/cusco-fc.ts
 *
 * @module pages/sandbox/CuscoFcSandboxPage
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import React from 'react';
import SandboxTemplatePage from './SandboxTemplate';
import cuscoFcConfig from './configs/cusco-fc';

export const CuscoFcSandboxPage: React.FC = () => {
  return <SandboxTemplatePage config={cuscoFcConfig} />;
};

export default CuscoFcSandboxPage;
