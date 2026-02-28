// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// VERTICALS ROUTES - Industry-Specific Vertical Pages
// =============================================================================

import React, { lazy } from 'react';
import { RouteObject, Navigate } from 'react-router-dom';
import { SuspenseWrapper } from './utils';

const VerticalsHubPage = lazy(() =>
  import('../pages/verticals').then((m) => ({ default: m.VerticalsHubPage }))
);
const HealthcarePage = lazy(() =>
  import('../pages/verticals').then((m) => ({ default: m.HealthcarePage }))
);
const FinancialServicesPage = lazy(() =>
  import('../pages/verticals').then((m) => ({ default: m.FinancialServicesPage }))
);
const GovernmentLegalPage = lazy(() =>
  import('../pages/verticals').then((m) => ({ default: m.GovernmentLegalPage }))
);
const LegalPage = lazy(() =>
  import('../pages/verticals').then((m) => ({ default: m.LegalPage }))
);
const InsurancePage = lazy(() =>
  import('../pages/verticals').then((m) => ({ default: m.InsurancePage }))
);
const PharmaceuticalPage = lazy(() =>
  import('../pages/verticals').then((m) => ({ default: m.PharmaceuticalPage }))
);
const ManufacturingPage = lazy(() =>
  import('../pages/verticals').then((m) => ({ default: m.ManufacturingPage }))
);
const EnergyUtilitiesPage = lazy(() =>
  import('../pages/verticals').then((m) => ({ default: m.EnergyUtilitiesPage }))
);
const TechnologyVerticalPage = lazy(() =>
  import('../pages/verticals').then((m) => ({ default: m.TechnologyPage }))
);
const RetailHospitalityPage = lazy(() =>
  import('../pages/verticals').then((m) => ({ default: m.RetailHospitalityPage }))
);
const RealEstateConstructionPage = lazy(() =>
  import('../pages/verticals').then((m) => ({ default: m.RealEstateConstructionPage }))
);
const TransportationLogisticsPage = lazy(() =>
  import('../pages/verticals').then((m) => ({ default: m.TransportationLogisticsPage }))
);
const MediaEntertainmentPage = lazy(() =>
  import('../pages/verticals').then((m) => ({ default: m.MediaEntertainmentPage }))
);
const ProfessionalServicesPage = lazy(() =>
  import('../pages/verticals').then((m) => ({ default: m.ProfessionalServicesPage }))
);
const HigherEducationPage = lazy(() =>
  import('../pages/verticals').then((m) => ({ default: m.HigherEducationPage }))
);
const SportsPage = lazy(() => import('../pages/verticals').then((m) => ({ default: m.SportsPage })));
const TelecommunicationsPage = lazy(() =>
  import('../pages/verticals').then((m) => ({ default: m.TelecommunicationsPage }))
);
const AerospacePage = lazy(() =>
  import('../pages/verticals').then((m) => ({ default: m.AerospacePage }))
);
const AgriculturePage = lazy(() =>
  import('../pages/verticals').then((m) => ({ default: m.AgriculturePage }))
);
const AutomotivePage = lazy(() =>
  import('../pages/verticals').then((m) => ({ default: m.AutomotivePage }))
);
const ConstructionPage = lazy(() =>
  import('../pages/verticals').then((m) => ({ default: m.ConstructionPage }))
);
const HospitalityPage = lazy(() =>
  import('../pages/verticals').then((m) => ({ default: m.HospitalityPage }))
);
const NonProfitPage = lazy(() =>
  import('../pages/verticals').then((m) => ({ default: m.NonProfitPage }))
);
const IndustrialServicesPage = lazy(() =>
  import('../pages/verticals').then((m) => ({ default: m.IndustrialServicesPage }))
);
const SmartCityPage = lazy(() =>
  import('../pages/verticals').then((m) => ({ default: m.SmartCityPage }))
);
const EUBankingPage = lazy(() =>
  import('../pages/verticals').then((m) => ({ default: m.EUBankingPage }))
);

const w = (Component: React.ComponentType) => (
  <SuspenseWrapper><Component /></SuspenseWrapper>
);

export const verticalsRoutes: RouteObject[] = [
  { path: '/verticals', element: w(VerticalsHubPage) },
  { path: '/verticals/healthcare', element: w(HealthcarePage) },
  { path: '/verticals/financial-services', element: w(FinancialServicesPage) },
  { path: '/verticals/government-legal', element: w(GovernmentLegalPage) },
  { path: '/verticals/legal', element: w(LegalPage) },
  { path: '/verticals/insurance', element: w(InsurancePage) },
  { path: '/verticals/pharmaceutical', element: w(PharmaceuticalPage) },
  { path: '/verticals/manufacturing', element: w(ManufacturingPage) },
  { path: '/verticals/energy-utilities', element: w(EnergyUtilitiesPage) },
  { path: '/verticals/technology', element: w(TechnologyVerticalPage) },
  { path: '/verticals/retail-hospitality', element: w(RetailHospitalityPage) },
  { path: '/verticals/real-estate', element: w(RealEstateConstructionPage) },
  { path: '/verticals/transportation', element: w(TransportationLogisticsPage) },
  { path: '/verticals/media-entertainment', element: w(MediaEntertainmentPage) },
  { path: '/verticals/professional-services', element: w(ProfessionalServicesPage) },
  { path: '/verticals/higher-education', element: w(HigherEducationPage) },
  { path: '/verticals/sports', element: w(SportsPage) },
  { path: '/verticals/telecommunications', element: w(TelecommunicationsPage) },
  { path: '/verticals/aerospace', element: w(AerospacePage) },
  { path: '/verticals/agriculture', element: w(AgriculturePage) },
  { path: '/verticals/automotive', element: w(AutomotivePage) },
  { path: '/verticals/construction', element: w(ConstructionPage) },
  { path: '/verticals/hospitality', element: w(HospitalityPage) },
  { path: '/verticals/nonprofit', element: w(NonProfitPage) },
  { path: '/verticals/industrial-services', element: w(IndustrialServicesPage) },
  { path: '/verticals/smart-city', element: w(SmartCityPage) },
  { path: '/verticals/eu-banking', element: w(EUBankingPage) },
  { path: '/industries', element: w(VerticalsHubPage) },
  { path: '/solutions', element: w(VerticalsHubPage) },
];
