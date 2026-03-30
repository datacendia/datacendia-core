/**
 * Grupo Figer — Shared Agent Definitions
 * @module pages/sandbox/configs/grupo-figer-agents
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import type { TemplateAgent } from '../SandboxTemplate';

export const AGENTS: Record<string, TemplateAgent> = {
  fifaCompliance: { id: 'fifa', name: 'FIFA Compliance Agent', role: 'FIFA Agent Regulations 2023 & IMS Monitoring', icon: '🏟️', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
  transferAgent: { id: 'transfer', name: 'Transfer Governance Agent', role: 'RSTP Compliance, Fee Caps & Mandate Documentation', icon: '⚽', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
  legalAgent: { id: 'legal', name: 'Legal Agent', role: 'CAS Jurisprudence, Lei Pelé & Multi-Jurisdiction Compliance', icon: '⚖️', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
  financialAgent: { id: 'financial', name: 'Financial Agent', role: 'AML/COAF, Transfer Fee Routing & Tax Compliance', icon: '💰', color: 'text-yellow-400', borderColor: 'border-yellow-500/40', bgColor: 'bg-yellow-500/10' },
  dataProtection: { id: 'data', name: 'Data Protection Agent', role: 'LGPD, GDPR & Player Personal Data Governance', icon: '🔒', color: 'text-violet-400', borderColor: 'border-violet-500/40', bgColor: 'bg-violet-500/10' },
  youthProtection: { id: 'youth', name: 'Youth Protection Agent', role: 'FIFA Article 19, ECA & Minor Safeguarding', icon: '👦', color: 'text-orange-400', borderColor: 'border-orange-500/40', bgColor: 'bg-orange-500/10' },
  casArbitration: { id: 'cas', name: 'CAS Arbitration Agent', role: 'Dispute Evidence, DRC Filing & Settlement Strategy', icon: '🏛️', color: 'text-indigo-400', borderColor: 'border-indigo-500/40', bgColor: 'bg-indigo-500/10' },
  integrityAgent: { id: 'integrity', name: 'Integrity Agent', role: 'TPO Detection, Conflict-of-Interest & Anti-Corruption', icon: '🛡️', color: 'text-cyan-400', borderColor: 'border-cyan-500/40', bgColor: 'bg-cyan-500/10' },
};

export const AGENTS_ES: Record<string, TemplateAgent> = {
  fifaCompliance: { ...AGENTS.fifaCompliance, name: 'Agente de Cumplimiento FIFA', role: 'Reglamento de Agentes FIFA 2023 y Monitoreo IMS' },
  transferAgent: { ...AGENTS.transferAgent, name: 'Agente de Gobernanza de Transferencias', role: 'Cumplimiento RSTP, Topes de Honorarios y Documentación' },
  legalAgent: { ...AGENTS.legalAgent, name: 'Agente Legal', role: 'Jurisprudencia CAS, Lei Pelé y Cumplimiento Multi-Jurisdicción' },
  financialAgent: { ...AGENTS.financialAgent, name: 'Agente Financiero', role: 'AML/COAF, Ruta de Honorarios y Cumplimiento Fiscal' },
  dataProtection: { ...AGENTS.dataProtection, name: 'Agente de Protección de Datos', role: 'LGPD, GDPR y Datos Personales del Jugador' },
  youthProtection: { ...AGENTS.youthProtection, name: 'Agente de Protección Juvenil', role: 'FIFA Artículo 19, ECA y Protección de Menores' },
  casArbitration: { ...AGENTS.casArbitration, name: 'Agente de Arbitraje CAS', role: 'Evidencia de Disputas, Presentación DRC y Estrategia' },
  integrityAgent: { ...AGENTS.integrityAgent, name: 'Agente de Integridad', role: 'Detección TPO, Conflicto de Interés y Anticorrupción' },
};

export const AGENTS_PT: Record<string, TemplateAgent> = {
  fifaCompliance: { ...AGENTS.fifaCompliance, name: 'Agente de Conformidade FIFA', role: 'Regulamento de Agentes FIFA 2023 e Monitoramento IMS' },
  transferAgent: { ...AGENTS.transferAgent, name: 'Agente de Governança de Transferências', role: 'Conformidade RSTP, Tetos de Honorários e Documentação' },
  legalAgent: { ...AGENTS.legalAgent, name: 'Agente Jurídico', role: 'Jurisprudência CAS, Lei Pelé e Conformidade Multi-Jurisdição' },
  financialAgent: { ...AGENTS.financialAgent, name: 'Agente Financeiro', role: 'AML/COAF, Rota de Honorários e Conformidade Tributária' },
  dataProtection: { ...AGENTS.dataProtection, name: 'Agente de Proteção de Dados', role: 'LGPD, GDPR e Dados Pessoais do Jogador' },
  youthProtection: { ...AGENTS.youthProtection, name: 'Agente de Proteção Juvenil', role: 'FIFA Artigo 19, ECA e Proteção de Menores' },
  casArbitration: { ...AGENTS.casArbitration, name: 'Agente de Arbitragem CAS', role: 'Evidência de Disputas, Apresentação DRC e Estratégia' },
  integrityAgent: { ...AGENTS.integrityAgent, name: 'Agente de Integridade', role: 'Detecção TPO, Conflito de Interesse e Anticorrupção' },
};
