/**
 * General Catalyst Sandbox Page
 * @module pages/sandbox/GeneralCatalystSandboxPage
 */
import React from 'react';
import SandboxTemplatePage from './SandboxTemplate';
import config from './configs/general-catalyst';

export const GeneralCatalystSandboxPage: React.FC = () => {
  return <SandboxTemplatePage config={config} />;
};

export default GeneralCatalystSandboxPage;
