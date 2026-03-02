/**
 * Page — D C I I Dashboard Page
 *
 * React page component rendered by the router.
 *
 * @exports EnterprisePage
 * @module pages/cortex/enterprise/DCIIDashboardPage
 */

﻿import { EnterpriseGate } from '@/components/ui/EnterpriseGate';

export default function EnterprisePage() {
  return <EnterpriseGate featureName="CendiaDCII™" description="Decision Crisis Immunization Infrastructure — 9 decision primitives, IISS scoring, media authentication." />;
}
