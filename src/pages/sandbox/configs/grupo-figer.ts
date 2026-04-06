/**
 * Grupo Figer Sandbox Config — Trilingual (EN/ES/PT)
 *
 * Brazil's largest sports agency. 200+ players, 11 jurisdictions,
 * US$500M+ annual transfer volume. FIFA Agent Regulations 2023 compliant.
 *
 * Access: /sandbox/figer (Key: FIGER-26)
 *
 * @module pages/sandbox/configs/grupo-figer
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import type { OrgSandboxConfig } from '../SandboxTemplate';
import { EN_SCENARIOS } from './grupo-figer-en';
import { ES_SCENARIOS } from './grupo-figer-es';
import { PT_SCENARIOS } from './grupo-figer-pt';

export type FigerLang = 'en' | 'es' | 'pt';

export interface FigerTrilingualConfig extends OrgSandboxConfig {
  pt: {
    footerNote: string;
    scenarios: typeof PT_SCENARIOS;
  };
}

const config: FigerTrilingualConfig = {
  // ── Identity ──────────────────────────────────────────────────────────────
  orgLabel: 'GRUPO FIGER',
  accessKey: 'FIGER-26',
  sessionKey: 'figer-sandbox-unlocked',

  // ── Styling (Tailwind) — Green/Gold for Brazilian sports agency ─────────
  accent: 'emerald',
  accentColor: 'text-emerald-400',
  accentHover: 'from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600',
  ringColor: 'focus:ring-emerald-500/30',
  borderColor: 'border-emerald-500/30',
  gradientFrom: 'from-emerald-600/20',
  gradientTo: 'to-emerald-900/20',

  // ── Footer (EN) ────────────────────────────────────────────────────────────
  footerNote: '200+ regulatory scenarios mapped for Grupo Figer · 11 jurisdictions · FIFA, CBF, UEFA, FA, LaLiga, Bundesliga, SAFF, MLS',

  // ── English Scenarios ──────────────────────────────────────────────────────
  scenarios: EN_SCENARIOS,

  // ── Spanish i18n (existing template pattern) ───────────────────────────────
  i18n: {
    footerNote: '200+ escenarios regulatorios mapeados para Grupo Figer · 11 jurisdicciones · FIFA, CBF, UEFA, FA, LaLiga, Bundesliga, SAFF, MLS',
    labels: {
      dataConnectors: 'Conectores de Datos',
      activeCouncil: 'Consejo Activo',
      deliberationTitle: 'Deliberación Multi-Agente',
      readyToBegin: 'Listo para comenzar',
      phase: 'Fase',
      deliberationComplete: 'Deliberación Completa — Consenso Alcanzado',
      runDeliberation: 'Iniciar Deliberación',
      generateReceipt: 'Generar Recibo del Regulador',
      generatingBundle: 'Generando Paquete de Evidencia Criptográfica...',
      simulationNote: 'NOTA DE SIMULACIÓN:',
      selectScenario: 'Seleccionar Escenario',
      reset: 'Reiniciar',
      confidential: 'CONFIDENCIAL',
      executiveSandbox: 'SANDBOX EJECUTIVO',
      connectorLive: 'ACTIVO',
      connectorSync: 'SYNC',
      connectorReady: 'LISTO',
      complianceScore: 'Compliance Score',
      timeline: 'Decision Timeline',
      evidenceExplorer: 'Evidence Explorer',
      shareReport: 'Share Report',
      exportData: 'Export Data',
      viewDetails: 'View Details',
      hideDetails: 'Hide Details'},
    scenarios: ES_SCENARIOS,
  },

  // ── Portuguese (extended) ──────────────────────────────────────────────────
  pt: {
    footerNote: '200+ cenários regulatórios mapeados para o Grupo Figer · 11 jurisdições · FIFA, CBF, UEFA, FA, LaLiga, Bundesliga, SAFF, MLS',
    scenarios: PT_SCENARIOS,
  },
};

export default config;
