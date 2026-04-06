/**
 * ADT (Tarma) Sandbox Page
 *
 * Template-driven sandbox demo using the SandboxTemplate component.
 * Config: src/pages/sandbox/configs/adt.ts
 *
 * @module pages/sandbox/AdtSandboxPage
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import React from 'react';
import SandboxTemplatePage from './SandboxTemplate';
import adtConfig from './configs/adt';

export const AdtSandboxPage: React.FC = () => {
  return <SandboxTemplatePage config={adtConfig} />;
};

export default AdtSandboxPage;
