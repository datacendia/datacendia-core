/**
 * Page — Aegis Page
 *
 * React page component rendered by the router.
 *
 * @exports EnterprisePage
 * @module pages/sovereign/AegisPage
 */

﻿import { EnterpriseGate } from '@/components/ui/EnterpriseGate';

export default function EnterprisePage() {
  return <EnterpriseGate featureName="CendiaAegis™" description="Advanced threat protection — proactive defense for your decision infrastructure." />;
}
