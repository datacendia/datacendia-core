/**
 * Thomson Reuters Sandbox Page
 *
 * Template-driven sandbox demo using the SandboxTemplate component.
 * Config: src/pages/sandbox/configs/thomson-reuters.ts
 *
 * @module pages/sandbox/ThomsonReutersSandboxPage
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import React from 'react';
import SandboxTemplatePage from './SandboxTemplate';
import trConfig from './configs/trdemo';
import { SandboxTracker } from './SandboxTracker';

export const ThomsonReutersSandboxPage: React.FC = () => {
  return (
    <>
      <SandboxTracker sandboxId="thomson-reuters" />
      <SandboxTemplatePage config={trConfig} />
    </>
  );
};

export default ThomsonReutersSandboxPage;
