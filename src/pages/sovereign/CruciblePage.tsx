/**
 * Page — Crucible Page
 *
 * React page component rendered by the router.
 *
 * @exports EnterprisePage
 * @module pages/sovereign/CruciblePage
 */

﻿import { EnterpriseGate } from '@/components/ui/EnterpriseGate';

export default function EnterprisePage() {
  return <EnterpriseGate featureName="CendiaCrucible™" description="Adversarial stress testing — attack decisions with simulated threats before they become real." />;
}
