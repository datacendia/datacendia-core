/**
 * Page — Symbiont Page
 *
 * React page component rendered by the router.
 *
 * @exports EnterprisePage
 * @module pages/sovereign/SymbiontPage
 */

﻿import { EnterpriseGate } from '@/components/ui/EnterpriseGate';

export default function EnterprisePage() {
  return <EnterpriseGate featureName="CendiaSymbiont™" description="Cross-organization decision sharing — federated governance without data exposure." />;
}
