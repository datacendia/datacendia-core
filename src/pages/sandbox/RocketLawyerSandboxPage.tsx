/**
 * Rocket Lawyer Sandbox Page
 *
 * Template-driven sandbox demo using the SandboxTemplate component.
 * Config: src/pages/sandbox/configs/rocket-lawyer.ts
 *
 * @module pages/sandbox/RocketLawyerSandboxPage
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import React from 'react';
import SandboxTemplatePage from './SandboxTemplate';
import config from './configs/rocket-lawyer';

export const RocketLawyerSandboxPage: React.FC = () => {
  return <SandboxTemplatePage config={config} />;
};

export default RocketLawyerSandboxPage;
