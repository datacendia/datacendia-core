/**
 * UFC Sandbox Page
 *
 * Template-driven sandbox demo using the SandboxTemplate component.
 * Config: src/pages/sandbox/configs/ufc-tko.ts
 *
 * @module pages/sandbox/UfcSandboxPage
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import React from 'react';
import SandboxTemplatePage from './SandboxTemplate';
import ufcConfig from './configs/ufc-tko';

export const UfcSandboxPage: React.FC = () => {
  return <SandboxTemplatePage config={ufcConfig} />;
};

export default UfcSandboxPage;
