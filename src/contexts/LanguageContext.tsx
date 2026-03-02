/**
 * Context — Language Context
 *
 * React context provider for cross-component state sharing.
 *
 * @exports LanguageProvider, useLanguage, LanguageSelector, Language
 * @module contexts/LanguageContext
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * =============================================================================
 * DATACENDIA - ENTERPRISE LANGUAGE CONTEXT
 * =============================================================================
 * 100% Dynamic Translation System
 * - Loads ALL translations from backend API
 * - Supports ALL 24 languages dynamically
 * - AI-powered translation via Ollama
 * - Caching and persistence
 * - RTL support
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import apiClient from '@/lib/api/client';

// =============================================================================
// TYPES
// =============================================================================

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  rtl: boolean;
}

interface LanguageContextType {
  language: string;
  languageInfo: Language | null;
  languages: Language[];
  translations: Record<string, string>;
  isRTL: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  setLanguage: (code: string) => Promise<void>;
  t: (key: string, interpolations?: Record<string, string>) => string;
  translateContent: (content: string) => Promise<string>;
  translateDeliberation: (content: {
    question: string;
    messages: Array<{ agent: string; content: string }>;
    decision?: string;
  }) => Promise<typeof content>;
}

// =============================================================================
// DEFAULT ENGLISH TRANSLATIONS (Fallback)
// =============================================================================

const DEFAULT_TRANSLATIONS: Record<string, string> = {
  // App
  'app.name': 'Datacendia',
  'app.tagline': 'Enterprise Intelligence Platform',

  // Common
  'button.save': 'Save',
  'button.cancel': 'Cancel',
  'button.close': 'Close',
  'button.submit': 'Submit',
  'button.delete': 'Delete',
  'button.edit': 'Edit',
  'button.add': 'Add',
  'button.unlock': 'Unlock',
  'button.view_all': 'View All',
  'label.loading': 'Loading...',
  'label.error': 'Error',
  'label.online': 'Online',
  'label.offline': 'Offline',
  'label.mode': 'Mode',
  'label.consulting': 'Consulting',
  'label.select_all': 'Select all',
  'label.select_all_online': 'Select all online',
  'label.premium': 'Premium',
  'label.locked': 'Locked',
  'label.admin': 'Admin',
  'label.user': 'User',
  'label.lead': 'Lead',

  // Common
  'common.completed': 'completed',
  'common.queried': 'queried',
  'common.approved': 'approved',
  'common.rejected': 'rejected',
  'common.pending': 'pending',
  'common.select': 'Select',
  'common.search': 'Search',
  'common.filter': 'Filter',
  'common.sort': 'Sort',
  'common.all': 'All',
  'common.none': 'None',

  // Sidebar Navigation
  'sidebar.dashboard': 'Dashboard',
  'sidebar.the_graph': 'The Graph',
  'sidebar.the_council': 'The Council',
  'sidebar.the_pulse': 'The Pulse',
  'sidebar.the_lens': 'The Lens',
  'sidebar.the_bridge': 'The Bridge',
  'sidebar.pillars': 'Pillars',
  'sidebar.the_helm': 'The Helm',
  'sidebar.the_lineage': 'The Lineage',
  'sidebar.the_predict': 'The Predict',
  'sidebar.the_flow': 'The Flow',
  'sidebar.the_health': 'The Health',
  'sidebar.the_guard': 'The Guard',
  'sidebar.the_ethics': 'The Ethics',
  'sidebar.the_agents': 'The Agents',
  'sidebar.system': 'System',
  'sidebar.data': 'Data',
  'sidebar.security': 'Security',
  'sidebar.settings': 'Settings',
  'sidebar.help': 'Help',
  'sidebar.connect_data_source': 'Connect a data source',

  // Top Navigation
  'nav.explore': 'Explore',
  'nav.ask_council': 'Ask Council',
  'nav.monitor': 'Monitor',
  'nav.forecast': 'Forecast',
  'nav.automate': 'Automate',
  'nav.decision_intelligence': 'Decision Intelligence',
  'nav.dashboard': 'Dashboard',
  'nav.council': 'The Council',
  'nav.settings': 'Settings',

  // Council
  'council.title': 'The Council',
  'council.subtitle': 'Programmable Organizational Intelligence',
  'council.pre_built_modes': 'Pre-Built Council Modes',
  'council.modes_library': 'Modes Library',
  'council.ai_agents': 'AI Agents',
  'council.ollama_connected': 'Ollama Connected',
  'council.ollama_disconnected': 'Ollama Disconnected',
  'council.agents.domain': 'Domain Agents',
  'council.agents.all': 'All agents (auto-select)',
  'council.ask': 'Ask The Council',
  'council.ask_question': 'Ask Question',
  'council.placeholder': 'What would you like to know?',
  'council.quick_answer': 'Quick Answer',
  'council.full_deliberation': 'Full Deliberation',
  'council.recent_decisions': 'Recent Decisions',
  'council.no_decisions': 'No decisions yet. Ask The Council a question!',
  'council.create_agent': 'Create Agent',
  'council.agent_builder': 'Agent Builder Pack',

  // Council Modes Library
  'council.modes.title': 'Council Modes Library',
  'council.modes.subtitle': 'The same 10 agents with different modes produce radically different outputs.',
  'council.modes.cultureNote': 'The prompt IS the company culture.',
  'council.modes.quickReference': 'Quick Reference',
  'council.modes.mode': 'Mode',
  'council.modes.primeDirective': 'Prime Directive',
  'council.modes.bestFor': 'Best For',
  'council.modes.agentBehavior': 'Agent Behavior',

  // Council Modes
  'mode.war_room': 'War Room',
  'mode.war_room.directive': 'Conflict before Consensus',
  'mode.due_diligence': 'Due Diligence',
  'mode.innovation_lab': 'Innovation Lab',
  'mode.compliance': 'Compliance',
  'mode.crisis': 'Crisis',
  'mode.execution': 'Execution',

  // Core Agent Names
  'agent.chief.name': 'CEO - Chief Strategy Agent',
  'agent.chief.role': 'Strategic Synthesis',
  'agent.chief.description': 'Synthesizes insights from all agents into strategic recommendations.',

  'agent.cfo.name': 'CFO - Financial Intelligence Agent',
  'agent.cfo.role': 'Financial Analysis & Risk',
  'agent.cfo.description':
    'Analyzes financial data, budgets, forecasts, and provides insights on fiscal health.',

  'agent.coo.name': 'COO - Operations Intelligence Agent',
  'agent.coo.role': 'Operational Efficiency',
  'agent.coo.description': 'Optimizes workflows, resource allocation, and operational performance.',

  'agent.ciso.name': 'CISO - Security & Compliance Agent',
  'agent.ciso.role': 'Security & Risk Management',
  'agent.ciso.description':
    'Monitors security posture, compliance requirements, and risk mitigation.',

  'agent.cmo.name': 'CMO - Market Intelligence Agent',
  'agent.cmo.role': 'Marketing & Customer Insights',
  'agent.cmo.description':
    'Analyzes market trends, customer behavior, and marketing effectiveness.',

  'agent.cto.name': 'CTO - Technology Intelligence Agent',
  'agent.cto.role': 'Technology Strategy',
  'agent.cto.description':
    'Evaluates technology decisions, architecture, and digital transformation.',

  'agent.chro.name': 'CHRO - People Intelligence Agent',
  'agent.chro.role': 'Human Resources & Culture',
  'agent.chro.description':
    'Analyzes workforce dynamics, talent management, and organizational culture.',

  'agent.cro.name': 'CRO - Revenue Intelligence Agent',
  'agent.cro.role': 'Revenue & Growth',
  'agent.cro.description':
    'Optimizes revenue streams, pricing strategies, and growth opportunities.',

  'agent.cdo.name': 'CDO - Data Intelligence Agent',
  'agent.cdo.role': 'Data Governance',
  'agent.cdo.description': 'Manages data quality, lineage, and governance across the organization.',

  'agent.risk.name': 'CRO - Risk Intelligence Agent',
  'agent.risk.role': 'Risk Assessment',
  'agent.risk.description': 'Identifies, quantifies, and mitigates organizational risks.',

  'agent.clo.name': 'CLO - Legal Intelligence Agent',
  'agent.clo.role': 'Legal & Compliance',
  'agent.clo.description': 'Analyzes legal risks, contracts, and regulatory compliance.',

  // Premium Agents
  'agent.cpo.name': 'Product Strategy Agent',
  'agent.cpo.role': 'Product Innovation & Roadmap',
  'agent.caio.name': 'AI Strategy Agent',
  'agent.caio.role': 'AI/ML Governance & Innovation',
  'agent.cso.name': 'Sustainability Agent',
  'agent.cso.role': 'ESG & Environmental Impact',
  'agent.cio.name': 'Investment Intelligence Agent',
  'agent.cio.role': 'Capital Allocation & Portfolio',
  'agent.cco.name': 'Communications Agent',
  'agent.cco.role': 'Corporate Communications & PR',

  // Audit Agents
  'agent.ext-auditor.name': 'External Auditor',
  'agent.ext-auditor.role': 'Independent Third-Party Audit',
  'agent.int-auditor.name': 'Internal Auditor',
  'agent.int-auditor.role': 'Internal Controls & Process Audit',

  // Healthcare Agents
  'agent.cmio.name': 'Chief Medical Information Officer',
  'agent.cmio.role': 'Healthcare IT & Clinical Systems',
  'agent.pso.name': 'Patient Safety Officer',
  'agent.pso.role': 'Clinical Safety & Quality',
  'agent.hco.name': 'Healthcare Compliance Officer',
  'agent.hco.role': 'HIPAA & Healthcare Regulations',
  'agent.cod.name': 'Clinical Operations Director',
  'agent.cod.role': 'Healthcare Operations & Efficiency',

  // Finance Agents
  'agent.quant.name': 'Quantitative Analyst',
  'agent.quant.role': 'Financial Modeling & Risk Analytics',
  'agent.pm.name': 'Portfolio Manager',
  'agent.pm.role': 'Investment Strategy & Asset Allocation',
  'agent.cro-finance.name': 'Credit Risk Officer',
  'agent.cro-finance.role': 'Credit Analysis & Risk Assessment',
  'agent.treasury.name': 'Treasury Analyst',
  'agent.treasury.role': 'Cash Management & Liquidity',

  // Legal Agents
  'agent.contracts.name': 'Contract Specialist',
  'agent.contracts.role': 'Contract Analysis & Negotiation',
  'agent.ip.name': 'Intellectual Property Counsel',
  'agent.ip.role': 'Patents, Trademarks & IP Strategy',
  'agent.litigation.name': 'Litigation Expert',
  'agent.litigation.role': 'Dispute Resolution & Trial Strategy',
  'agent.regulatory.name': 'Regulatory Affairs Counsel',
  'agent.regulatory.role': 'Government Relations & Compliance',

  // Settings
  'settings.language': 'Language',
  'settings.language.select': 'Select Language',
  'settings.languages_available': 'languages available',
  'settings.title': 'Settings',
  'settings.profile': 'Profile',
  'settings.notifications': 'Notifications',
  'settings.security': 'Security',
  'settings.appearance': 'Appearance',
  'settings.integrations': 'Integrations',

  // Search
  'search.placeholder': 'Search anything...',

  // Dashboard
  'dashboard.title': 'Dashboard',
  'dashboard.welcome': 'Welcome back',
  'dashboard.subtitle': "Here's what's happening at {{company}}",
  'dashboard.health_score': 'Health Score',
  'dashboard.alerts': 'Alerts',
  'dashboard.critical_alerts': 'Critical Alerts',
  'dashboard.pending_approvals': 'Pending Approvals',
  'dashboard.key_metrics': 'Key Metrics',
  'dashboard.keyMetrics': 'Key Metrics',
  'dashboard.recent_activity': 'Recent Activity',
  'dashboard.recentActivity': 'Recent Activity',
  'dashboard.quick_actions': 'Quick Actions',
  'dashboard.ask_council': 'Ask Council',
  'dashboard.askTheCouncil': 'Ask the Council',
  'dashboard.view_health': 'View Health',
  'dashboard.explore_data': 'Explore Data',
  'dashboard.run_forecast': 'Run Forecast',
  'dashboard.no_alerts': 'No active alerts',
  'dashboard.no_approvals': 'No pending approvals',
  'dashboard.no_activity': 'No recent activity',
  'dashboard.data': 'Data',
  'dashboard.operations': 'Operations',
  'dashboard.security': 'Security',
  'dashboard.people': 'People',
  'dashboard.fromLastWeek': 'from last week',
  'dashboard.critical': 'Critical',
  'dashboard.warning': 'Warning',
  'dashboard.workflows': 'Workflows',
  'dashboard.access': 'Access',
  'dashboard.budget': 'Budget',
  'dashboard.by': 'by',
  'dashboard.approve': 'Approve',
  'dashboard.viewFullLog': 'View Full Log',
  'dashboard.recentQueries': 'Recent Queries',
  // Dashboard Greetings
  'dashboard.greetings.morning': 'Good morning',
  'dashboard.greetings.afternoon': 'Good afternoon',
  'dashboard.greetings.evening': 'Good evening',
  // Dashboard Sample Alerts
  'dashboard.sampleAlerts.databaseCpu': 'Database CPU usage exceeds 90%',
  'dashboard.sampleAlerts.paymentLatency': 'Payment processing latency spike',
  'dashboard.sampleAlerts.diskUsage': 'Storage approaching capacity',
  // Dashboard Sample Approvals
  'dashboard.sampleApprovals.monthlyClose': 'Q4 Financial Close Workflow',
  'dashboard.sampleApprovals.prodDbAccess': 'Production Database Access',
  // Dashboard Sample Metrics
  'dashboard.sampleMetrics.revenue': 'Revenue',
  'dashboard.sampleMetrics.pipeline': 'Pipeline',
  'dashboard.sampleMetrics.burnRate': 'Burn Rate',
  'dashboard.sampleMetrics.nps': 'NPS Score',
  // Dashboard Sample Queries
  'dashboard.sampleQueries.churnIncrease': 'Why did churn increase last month?',
  'dashboard.sampleQueries.forecastRevenue': 'Forecast Q4 revenue scenarios',
  'dashboard.sampleQueries.biggestRisk': "What's our biggest operational risk?",

  // Graph
  'graph.title': 'Knowledge Graph',
  'graph.subtitle': 'Explore your data universe',
  'graph.search': 'Search entities...',
  'graph.filters': 'Filters',
  'graph.entities': 'Entities',
  'graph.relationships': 'Relationships',
  'graph.clusters': 'Clusters',
  'graph.no_results': 'No results found',

  // Pulse
  'pulse.title': 'The Pulse',
  'pulse.subtitle': 'Real-time organizational health',
  'pulse.overall_health': 'Overall Health',
  'pulse.trending': 'Trending',
  'pulse.alerts': 'Alerts',
  'pulse.metrics': 'Metrics',
  'pulse.anomalies': 'Anomalies',

  // Lens
  'lens.title': 'The Lens',
  'lens.subtitle': 'See possible futures',
  'lens.scenarios': 'Scenarios',
  'lens.forecasts': 'Forecasts',
  'lens.simulations': 'Simulations',
  'lens.what_if': 'What-If Analysis',

  // Bridge
  'bridge.title': 'The Bridge',
  'bridge.subtitle': 'Connect and automate',
  'bridge.workflows': 'Workflows',
  'bridge.integrations': 'Integrations',
  'bridge.automations': 'Automations',
  'bridge.connectors': 'Connectors',

  // Common page elements
  'page.loading': 'Loading...',
  'page.error': 'Something went wrong',
  'page.retry': 'Try again',
  'page.back': 'Back',
  'page.next': 'Next',
  'page.previous': 'Previous',
  'page.save_changes': 'Save Changes',
  'page.discard': 'Discard',
  'page.confirm': 'Confirm',
  'page.not_found': 'Page not found',
  'page.go_home': 'Go to Dashboard',

  // Time
  'time.just_now': 'Just now',
  'time.minutes_ago': 'minutes ago',
  'time.hours_ago': 'hours ago',
  'time.days_ago': 'days ago',
  'time.today': 'Today',
  'time.yesterday': 'Yesterday',

  // Status
  'status.active': 'Active',
  'status.inactive': 'Inactive',
  'status.pending': 'Pending',
  'status.completed': 'Completed',
  'status.failed': 'Failed',
  'status.running': 'Running',
  'status.paused': 'Paused',

  // Actions
  'action.create': 'Create',
  'action.update': 'Update',
  'action.delete': 'Delete',
  'action.view': 'View',
  'action.export': 'Export',
  'action.import': 'Import',
  'action.refresh': 'Refresh',
  'action.filter': 'Filter',
  'action.sort': 'Sort',
  'action.search': 'Search',

  // Auth
  'auth.login': 'Login',
  'auth.logout': 'Logout',
  'auth.register': 'Register',
  'auth.forgot_password': 'Forgot Password',
  'auth.reset_password': 'Reset Password',
  'auth.email': 'Email',
  'auth.password': 'Password',
  'auth.remember_me': 'Remember me',
  'auth.sign_in': 'Sign In',
  'auth.sign_up': 'Sign Up',
  'auth.welcome_back': 'Welcome back',
  'auth.create_account': 'Create your account',
};

// Pre-built translations for instant switching (no LLM needed)
const STATIC_TRANSLATIONS: Record<string, Record<string, string>> = {
  es: {
    // App
    'app.tagline': 'Plataforma de Inteligencia Empresarial',

    // Common buttons and labels
    'button.save': 'Guardar',
    'button.cancel': 'Cancelar',
    'button.close': 'Cerrar',
    'button.submit': 'Enviar',
    'button.delete': 'Eliminar',
    'button.edit': 'Editar',
    'button.add': 'Agregar',
    'button.unlock': 'Desbloquear',
    'button.view_all': 'Ver Todo',
    'label.loading': 'Cargando...',
    'label.error': 'Error',
    'label.online': 'En línea',
    'label.offline': 'Desconectado',
    'label.mode': 'Modo',
    'label.consulting': 'Consultando',
    'label.select_all': 'Seleccionar todo',
    'label.select_all_online': 'Seleccionar todos en línea',
    'label.premium': 'Premium',
    'label.locked': 'Bloqueado',
    'label.admin': 'Administrador',
    'label.user': 'Usuario',
    'label.lead': 'Líder',

    // Sidebar Navigation
    'sidebar.dashboard': 'Panel',
    'sidebar.the_graph': 'El Grafo',
    'sidebar.the_council': 'El Consejo',
    'sidebar.the_pulse': 'El Pulso',
    'sidebar.the_lens': 'El Lente',
    'sidebar.the_bridge': 'El Puente',
    'sidebar.pillars': 'Pilares',
    'sidebar.the_helm': 'El Timón',
    'sidebar.the_lineage': 'El Linaje',
    'sidebar.the_predict': 'El Predictor',
    'sidebar.the_flow': 'El Flujo',
    'sidebar.the_health': 'La Salud',
    'sidebar.the_guard': 'El Guardián',
    'sidebar.the_ethics': 'La Ética',
    'sidebar.the_agents': 'Los Agentes',
    'sidebar.system': 'Sistema',
    'sidebar.data': 'Datos',
    'sidebar.security': 'Seguridad',
    'sidebar.settings': 'Configuración',
    'sidebar.help': 'Ayuda',
    'sidebar.connect_data_source': 'Conectar fuente de datos',

    // Top Navigation
    'nav.explore': 'Explorar',
    'nav.ask_council': 'Consultar Consejo',
    'nav.monitor': 'Monitorear',
    'nav.forecast': 'Pronóstico',
    'nav.automate': 'Automatizar',
    'nav.decision_intelligence': 'Inteligencia de Decisiones',
    'nav.dashboard': 'Panel',
    'nav.council': 'El Consejo',
    'nav.settings': 'Configuración',

    // Council
    'council.title': 'El Consejo',
    'council.subtitle': 'Inteligencia Organizacional Programable',
    'council.pre_built_modes': 'Modos de Consejo Predefinidos',
    'council.modes_library': 'Biblioteca de Modos',
    'council.ai_agents': 'Agentes IA',
    'council.ollama_connected': 'Ollama Conectado',
    'council.ollama_disconnected': 'Ollama Desconectado',
    'council.agents.domain': 'Agentes de Dominio',
    'council.agents.all': 'Todos los agentes (auto-selección)',
    'council.ask': 'Consultar al Consejo',
    'council.ask_question': 'Hacer Pregunta',
    'council.placeholder': '¿Qué te gustaría saber?',
    'council.quick_answer': 'Respuesta Rápida',
    'council.full_deliberation': 'Deliberación Completa',
    'council.recent_decisions': 'Decisiones Recientes',
    'council.no_decisions': '¡Aún no hay decisiones. Haz una pregunta al Consejo!',
    'council.create_agent': 'Crear Agente',
    'council.agent_builder': 'Paquete Constructor de Agentes',

    // Council Modes
    'mode.war_room': 'Sala de Guerra',
    'mode.war_room.directive': 'Conflicto antes del Consenso',
    'mode.due_diligence': 'Debida Diligencia',
    'mode.innovation_lab': 'Laboratorio de Innovación',
    'mode.compliance': 'Cumplimiento',
    'mode.crisis': 'Crisis',
    'mode.execution': 'Ejecución',

    // Core Agents
    'agent.chief.name': 'Agente Estratégico Principal',
    'agent.chief.role': 'Síntesis Estratégica',
    'agent.chief.description':
      'Sintetiza información de todos los agentes en recomendaciones estratégicas.',
    'agent.cfo.name': 'Agente de Inteligencia Financiera',
    'agent.cfo.role': 'Análisis Financiero y Riesgo',
    'agent.cfo.description':
      'Analiza datos financieros, presupuestos, pronósticos y proporciona información sobre salud fiscal.',
    'agent.coo.name': 'Agente de Inteligencia Operativa',
    'agent.coo.role': 'Eficiencia Operacional',
    'agent.coo.description':
      'Optimiza flujos de trabajo, asignación de recursos y rendimiento operativo.',
    'agent.ciso.name': 'Agente de Seguridad y Cumplimiento',
    'agent.ciso.role': 'Gestión de Seguridad y Riesgo',
    'agent.ciso.description':
      'Monitorea postura de seguridad, requisitos de cumplimiento y mitigación de riesgos.',
    'agent.cmo.name': 'Agente de Inteligencia de Mercado',
    'agent.cmo.role': 'Marketing e Insights del Cliente',
    'agent.cmo.description':
      'Analiza tendencias del mercado, comportamiento del cliente y efectividad del marketing.',
    'agent.cto.name': 'Agente de Inteligencia Tecnológica',
    'agent.cto.role': 'Estrategia Tecnológica',
    'agent.cto.description':
      'Evalúa decisiones tecnológicas, arquitectura y transformación digital.',
    'agent.chro.name': 'Agente de Inteligencia de Personal',
    'agent.chro.role': 'Recursos Humanos y Cultura',
    'agent.chro.description':
      'Analiza dinámica laboral, gestión del talento y cultura organizacional.',
    'agent.cro.name': 'Agente de Inteligencia de Ingresos',
    'agent.cro.role': 'Ingresos y Crecimiento',
    'agent.cro.description':
      'Optimiza flujos de ingresos, estrategias de precios y oportunidades de crecimiento.',
    'agent.cdo.name': 'Agente de Inteligencia de Datos',
    'agent.cdo.role': 'Gobernanza de Datos',
    'agent.cdo.description':
      'Gestiona calidad de datos, linaje y gobernanza en toda la organización.',
    'agent.risk.name': 'Agente de Inteligencia de Riesgos',
    'agent.risk.role': 'Evaluación de Riesgos',
    'agent.risk.description': 'Identifica, cuantifica y mitiga riesgos organizacionales.',
    'agent.clo.name': 'Agente de Inteligencia Legal',
    'agent.clo.role': 'Legal y Cumplimiento',
    'agent.clo.description': 'Analiza riesgos legales, contratos y cumplimiento regulatorio.',

    // Premium Agents
    'agent.cpo.name': 'Agente de Estrategia de Producto',
    'agent.cpo.role': 'Innovación de Producto y Roadmap',
    'agent.caio.name': 'Agente de Estrategia IA',
    'agent.caio.role': 'Gobernanza e Innovación de IA/ML',
    'agent.cso.name': 'Agente de Sostenibilidad',
    'agent.cso.role': 'ESG e Impacto Ambiental',
    'agent.cio.name': 'Agente de Inteligencia de Inversiones',
    'agent.cio.role': 'Asignación de Capital y Portafolio',
    'agent.cco.name': 'Agente de Comunicaciones',
    'agent.cco.role': 'Comunicaciones Corporativas y RP',

    // Audit Agents
    'agent.ext-auditor.name': 'Auditor Externo',
    'agent.ext-auditor.role': 'Auditoría Independiente de Terceros',
    'agent.int-auditor.name': 'Auditor Interno',
    'agent.int-auditor.role': 'Controles Internos y Auditoría de Procesos',

    // Healthcare Agents
    'agent.cmio.name': 'Director Médico de Información',
    'agent.cmio.role': 'TI de Salud y Sistemas Clínicos',
    'agent.pso.name': 'Oficial de Seguridad del Paciente',
    'agent.pso.role': 'Seguridad Clínica y Calidad',
    'agent.hco.name': 'Oficial de Cumplimiento de Salud',
    'agent.hco.role': 'HIPAA y Regulaciones de Salud',
    'agent.cod.name': 'Director de Operaciones Clínicas',
    'agent.cod.role': 'Operaciones y Eficiencia de Salud',

    // Finance Agents
    'agent.quant.name': 'Analista Cuantitativo',
    'agent.quant.role': 'Modelado Financiero y Análisis de Riesgo',
    'agent.pm.name': 'Gestor de Portafolio',
    'agent.pm.role': 'Estrategia de Inversión y Asignación de Activos',
    'agent.cro-finance.name': 'Oficial de Riesgo Crediticio',
    'agent.cro-finance.role': 'Análisis de Crédito y Evaluación de Riesgo',
    'agent.treasury.name': 'Analista de Tesorería',
    'agent.treasury.role': 'Gestión de Efectivo y Liquidez',

    // Legal Agents
    'agent.contracts.name': 'Especialista en Contratos',
    'agent.contracts.role': 'Análisis y Negociación de Contratos',
    'agent.ip.name': 'Consejero de Propiedad Intelectual',
    'agent.ip.role': 'Patentes, Marcas y Estrategia de PI',
    'agent.litigation.name': 'Experto en Litigios',
    'agent.litigation.role': 'Resolución de Disputas y Estrategia de Juicio',
    'agent.regulatory.name': 'Consejero de Asuntos Regulatorios',
    'agent.regulatory.role': 'Relaciones Gubernamentales y Cumplimiento',

    // Settings
    'settings.language': 'Idioma',
    'settings.language.select': 'Seleccionar Idioma',
    'settings.languages_available': 'idiomas disponibles',
    'settings.title': 'Configuración',
    'settings.profile': 'Perfil',
    'settings.notifications': 'Notificaciones',
    'settings.security': 'Seguridad',
    'settings.appearance': 'Apariencia',
    'settings.integrations': 'Integraciones',
    'search.placeholder': 'Buscar cualquier cosa...',

    // Dashboard
    'dashboard.title': 'Panel',
    'dashboard.welcome': 'Bienvenido de nuevo',
    'dashboard.health_score': 'Puntuación de Salud',
    'dashboard.alerts': 'Alertas',
    'dashboard.critical_alerts': 'Alertas Críticas',
    'dashboard.pending_approvals': 'Aprobaciones Pendientes',
    'dashboard.key_metrics': 'Métricas Clave',
    'dashboard.recent_activity': 'Actividad Reciente',
    'dashboard.quick_actions': 'Acciones Rápidas',
    'dashboard.ask_council': 'Consultar Consejo',
    'dashboard.view_health': 'Ver Salud',
    'dashboard.explore_data': 'Explorar Datos',
    'dashboard.run_forecast': 'Ejecutar Pronóstico',
    'dashboard.no_alerts': 'Sin alertas activas',
    'dashboard.no_approvals': 'Sin aprobaciones pendientes',
    'dashboard.no_activity': 'Sin actividad reciente',
    'dashboard.data': 'Datos',
    'dashboard.operations': 'Operaciones',
    'dashboard.security': 'Seguridad',
    'dashboard.people': 'Personal',

    // Graph
    'graph.title': 'Grafo de Conocimiento',
    'graph.subtitle': 'Explora tu universo de datos',
    'graph.search': 'Buscar entidades...',
    'graph.filters': 'Filtros',
    'graph.entities': 'Entidades',
    'graph.relationships': 'Relaciones',
    'graph.clusters': 'Grupos',
    'graph.no_results': 'Sin resultados',

    // Pulse
    'pulse.title': 'El Pulso',
    'pulse.subtitle': 'Salud organizacional en tiempo real',
    'pulse.overall_health': 'Salud General',
    'pulse.trending': 'Tendencias',
    'pulse.alerts': 'Alertas',
    'pulse.metrics': 'Métricas',
    'pulse.anomalies': 'Anomalías',

    // Lens
    'lens.title': 'El Lente',
    'lens.subtitle': 'Ve futuros posibles',
    'lens.scenarios': 'Escenarios',
    'lens.forecasts': 'Pronósticos',
    'lens.simulations': 'Simulaciones',
    'lens.what_if': 'Análisis Qué-Si',

    // Bridge
    'bridge.title': 'El Puente',
    'bridge.subtitle': 'Conecta y automatiza',
    'bridge.workflows': 'Flujos de Trabajo',
    'bridge.integrations': 'Integraciones',
    'bridge.automations': 'Automatizaciones',
    'bridge.connectors': 'Conectores',

    // Common page elements
    'page.loading': 'Cargando...',
    'page.error': 'Algo salió mal',
    'page.retry': 'Intentar de nuevo',
    'page.back': 'Atrás',
    'page.next': 'Siguiente',
    'page.previous': 'Anterior',
    'page.save_changes': 'Guardar Cambios',
    'page.discard': 'Descartar',
    'page.confirm': 'Confirmar',
    'page.not_found': 'Página no encontrada',
    'page.go_home': 'Ir al Panel',

    // Time
    'time.just_now': 'Justo ahora',
    'time.minutes_ago': 'minutos atrás',
    'time.hours_ago': 'horas atrás',
    'time.days_ago': 'días atrás',
    'time.today': 'Hoy',
    'time.yesterday': 'Ayer',

    // Status
    'status.active': 'Activo',
    'status.inactive': 'Inactivo',
    'status.pending': 'Pendiente',
    'status.completed': 'Completado',
    'status.failed': 'Fallido',
    'status.running': 'Ejecutando',
    'status.paused': 'Pausado',

    // Actions
    'action.create': 'Crear',
    'action.update': 'Actualizar',
    'action.delete': 'Eliminar',
    'action.view': 'Ver',
    'action.export': 'Exportar',
    'action.import': 'Importar',
    'action.refresh': 'Actualizar',
    'action.filter': 'Filtrar',
    'action.sort': 'Ordenar',
    'action.search': 'Buscar',

    // Auth
    'auth.login': 'Iniciar Sesión',
    'auth.logout': 'Cerrar Sesión',
    'auth.register': 'Registrarse',
    'auth.forgot_password': 'Olvidé mi Contraseña',
    'auth.reset_password': 'Restablecer Contraseña',
    'auth.email': 'Correo Electrónico',
    'auth.password': 'Contraseña',
    'auth.remember_me': 'Recordarme',
    'auth.sign_in': 'Iniciar Sesión',
    'auth.sign_up': 'Registrarse',
    'auth.welcome_back': 'Bienvenido de nuevo',
    'auth.create_account': 'Crea tu cuenta',
  },
  fr: {
    'app.tagline': "Plateforme d'Intelligence d'Entreprise",
    'nav.council': 'Le Conseil',
    'council.title': 'Le Conseil',
    'council.subtitle': 'Intelligence Organisationnelle Programmable',
    'agent.cfo.name': 'Agent Intelligence Financière',
    'agent.cfo.role': 'Analyse Financière et Risque',
    'agent.coo.name': 'Agent Intelligence Opérationnelle',
    'agent.coo.role': 'Efficacité Opérationnelle',
    'agent.ciso.name': 'Agent Sécurité et Conformité',
    'agent.ciso.role': 'Gestion de la Sécurité et des Risques',
    'label.online': 'En ligne',
    'label.offline': 'Hors ligne',
    'settings.language': 'Langue',
    'search.placeholder': 'Rechercher...',
  },
  de: {
    'app.tagline': 'Enterprise Intelligence Plattform',
    'nav.council': 'Der Rat',
    'council.title': 'Der Rat',
    'council.subtitle': 'Programmierbare Organisationsintelligenz',
    'agent.cfo.name': 'Finanzintelligenz-Agent',
    'agent.cfo.role': 'Finanzanalyse & Risiko',
    'agent.coo.name': 'Betriebsintelligenz-Agent',
    'agent.coo.role': 'Operative Effizienz',
    'agent.ciso.name': 'Sicherheits- & Compliance-Agent',
    'agent.ciso.role': 'Sicherheits- & Risikomanagement',
    'label.online': 'Online',
    'label.offline': 'Offline',
    'settings.language': 'Sprache',
    'search.placeholder': 'Suchen...',
  },
  zh: {
    'app.tagline': '企业智能平台',
    'nav.council': '理事会',
    'council.title': '理事会',
    'council.subtitle': '可编程组织智能',
    'agent.cfo.name': '财务智能代理',
    'agent.cfo.role': '财务分析与风险',
    'agent.coo.name': '运营智能代理',
    'agent.coo.role': '运营效率',
    'agent.ciso.name': '安全合规代理',
    'agent.ciso.role': '安全与风险管理',
    'label.online': '在线',
    'label.offline': '离线',
    'settings.language': '语言',
    'search.placeholder': '搜索...',
  },
  ja: {
    'app.tagline': 'エンタープライズインテリジェンスプラットフォーム',
    'nav.council': '評議会',
    'council.title': '評議会',
    'council.subtitle': 'プログラマブル組織インテリジェンス',
    'agent.cfo.name': '財務インテリジェンスエージェント',
    'agent.cfo.role': '財務分析とリスク',
    'agent.coo.name': '運用インテリジェンスエージェント',
    'agent.coo.role': '運用効率',
    'agent.ciso.name': 'セキュリティ＆コンプライアンスエージェント',
    'agent.ciso.role': 'セキュリティとリスク管理',
    'label.online': 'オンライン',
    'label.offline': 'オフライン',
    'settings.language': '言語',
    'search.placeholder': '検索...',
  },
  ar: {
    'app.tagline': 'منصة ذكاء المؤسسات',
    'nav.council': 'المجلس',
    'council.title': 'المجلس',
    'council.subtitle': 'الذكاء التنظيمي القابل للبرمجة',
    'agent.cfo.name': 'وكيل الذكاء المالي',
    'agent.cfo.role': 'التحليل المالي والمخاطر',
    'agent.coo.name': 'وكيل الذكاء التشغيلي',
    'agent.coo.role': 'الكفاءة التشغيلية',
    'label.online': 'متصل',
    'label.offline': 'غير متصل',
    'settings.language': 'اللغة',
    'search.placeholder': 'بحث...',
  },
};

// =============================================================================
// CONTEXT
// =============================================================================

const LanguageContext = createContext<LanguageContextType | null>(null);

// =============================================================================
// PROVIDER
// =============================================================================

// Auto-detect browser language on first visit
const detectBrowserLanguage = (): string => {
  if (typeof window === 'undefined') {
    return 'en';
  }

  // Check if user has a saved preference
  const saved = localStorage.getItem('datacendia_language');
  if (saved) {
    return saved;
  }

  // Get browser language (e.g., 'en-US' -> 'en')
  const browserLang = navigator.language?.split('-')[0] || 'en';

  // Supported languages
  const supported = [
    'en',
    'es',
    'fr',
    'de',
    'zh',
    'ja',
    'ko',
    'ar',
    'pt',
    'it',
    'ru',
    'nl',
    'pl',
    'tr',
    'vi',
    'th',
    'hi',
    'he',
    'id',
    'ms',
    'sv',
    'da',
    'fi',
    'no',
  ];

  return supported.includes(browserLang) ? browserLang : 'en';
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<string>(detectBrowserLanguage);

  const [languages, setLanguages] = useState<Language[]>([
    { code: 'en', name: 'English', nativeName: 'English', rtl: false },
    { code: 'es', name: 'Spanish', nativeName: 'Español', rtl: false },
    { code: 'fr', name: 'French', nativeName: 'Français', rtl: false },
    { code: 'de', name: 'German', nativeName: 'Deutsch', rtl: false },
    { code: 'it', name: 'Italian', nativeName: 'Italiano', rtl: false },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português', rtl: false },
    { code: 'zh', name: 'Chinese', nativeName: '中文', rtl: false },
    { code: 'ja', name: 'Japanese', nativeName: '日本語', rtl: false },
    { code: 'ko', name: 'Korean', nativeName: '한국어', rtl: false },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', rtl: true },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', rtl: false },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', rtl: false },
    { code: 'ru', name: 'Russian', nativeName: 'Русский', rtl: false },
    { code: 'pl', name: 'Polish', nativeName: 'Polski', rtl: false },
    { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', rtl: false },
    { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', rtl: false },
    { code: 'th', name: 'Thai', nativeName: 'ไทย', rtl: false },
    { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', rtl: false },
    { code: 'tl', name: 'Filipino', nativeName: 'Filipino', rtl: false },
    { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', rtl: false },
    { code: 'ur', name: 'Urdu', nativeName: 'اردو', rtl: true },
  ]);
  const [translations, setTranslations] = useState<Record<string, string>>(DEFAULT_TRANSLATIONS);
  const [isLoading, _setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const loadingRef = useRef(false);
  const cacheRef = useRef<Map<string, Record<string, string>>>(new Map());

  // Get current language info
  const languageInfo = languages.find((l) => l.code === language) || null;
  const isRTL = languageInfo?.rtl || false;

  // Load available languages only when authenticated (defer API calls)
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      // Use fallback languages immediately without API call
      setLanguages([
        { code: 'en', name: 'English', nativeName: 'English', rtl: false },
        { code: 'es', name: 'Spanish', nativeName: 'Español', rtl: false },
        { code: 'fr', name: 'French', nativeName: 'Français', rtl: false },
      ]);
      return;
    }
    
    const loadLanguages = async () => {
      try {
        const response = await apiClient.api.get<{ languages: Language[] }>('/i18n/languages');
        if (response.success && response.data?.languages) {
          setLanguages(response.data.languages);
        }
      } catch (error) {
        console.error('Failed to load languages:', error);
        // Set minimal fallback languages
        setLanguages([
          { code: 'en', name: 'English', nativeName: 'English', rtl: false },
          { code: 'es', name: 'Spanish', nativeName: 'Español', rtl: false },
          { code: 'fr', name: 'French', nativeName: 'Français', rtl: false },
        ]);
      }
    };

    loadLanguages();
  }, []);

  // Load translations when language changes - INSTANT with static, then fetch more
  useEffect(() => {
    const loadTranslations = async () => {
      // Check cache first
      const cached = cacheRef.current.get(language);
      if (cached) {
        setTranslations(cached);
        setIsInitialized(true);
        return;
      }

      // English uses defaults
      if (language === 'en') {
        setTranslations(DEFAULT_TRANSLATIONS);
        cacheRef.current.set('en', DEFAULT_TRANSLATIONS);
        setIsInitialized(true);
        return;
      }

      // INSTANT: Apply static translations immediately (no loading spinner)
      const staticTrans = STATIC_TRANSLATIONS[language];
      if (staticTrans) {
        const combined = { ...DEFAULT_TRANSLATIONS, ...staticTrans };
        setTranslations(combined);
        cacheRef.current.set(language, combined);
        setIsInitialized(true);
        // Don't return - continue to fetch more from API in background
      }

      // Background: Fetch additional translations from API (non-blocking)
      if (!loadingRef.current) {
        loadingRef.current = true;

        try {
          const response = await apiClient.api.get<{
            translations: Record<string, string>;
            count: number;
          }>(`/i18n/translations/${language}`);

          if (response.success && response.data?.translations) {
            const base = staticTrans
              ? { ...DEFAULT_TRANSLATIONS, ...staticTrans }
              : DEFAULT_TRANSLATIONS;
            const newTranslations = { ...base, ...response.data.translations };
            setTranslations(newTranslations);
            cacheRef.current.set(language, newTranslations);
            console.log(`Enhanced with ${response.data.count} translations for ${language}`);
          }
        } catch (error) {
          // Silent fail - we already have static translations
          console.log(`Using static translations for ${language}`);
        } finally {
          loadingRef.current = false;
          setIsInitialized(true);
        }
      }
    };

    loadTranslations();
  }, [language]);

  // Apply RTL to document
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
      document.documentElement.lang = language;
    }
  }, [isRTL, language]);

  // Set language
  const setLanguage = useCallback(
    async (code: string) => {
      if (code === language) {
        return;
      }

      setLanguageState(code);
      localStorage.setItem('datacendia_language', code);

      // Save preference to backend
      try {
        await apiClient.api.put('/i18n/user/preference', { language: code });
      } catch (error) {
        console.error('Failed to save language preference:', error);
      }
    },
    [language]
  );

  // Translation function
  const t = useCallback(
    (key: string, interpolations?: Record<string, string>): string => {
      let text = translations[key] || DEFAULT_TRANSLATIONS[key] || key;

      if (interpolations) {
        Object.entries(interpolations).forEach(([k, v]) => {
          text = text.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), v);
        });
      }

      return text;
    },
    [translations]
  );

  // Translate dynamic content
  const translateContent = useCallback(
    async (content: string): Promise<string> => {
      if (language === 'en') {
        return content;
      }

      try {
        const response = await apiClient.api.post<{ translated: string }>(
          '/i18n/translate/content',
          {
            content,
            targetLanguage: language,
          }
        );

        if (response.success && response.data?.translated) {
          return response.data.translated;
        }
      } catch (error) {
        console.error('Content translation failed:', error);
      }

      return content;
    },
    [language]
  );

  // Translate deliberation
  const translateDeliberation = useCallback(
    async (content: {
      question: string;
      messages: Array<{ agent: string; content: string }>;
      decision?: string;
    }) => {
      if (language === 'en') {
        return content;
      }

      try {
        const response = await apiClient.api.post<typeof content>('/i18n/translate/deliberation', {
          ...content,
          targetLanguage: language,
        });

        if (response.success && response.data) {
          return response.data;
        }
      } catch (error) {
        console.error('Deliberation translation failed:', error);
      }

      return content;
    },
    [language]
  );

  const value: LanguageContextType = {
    language,
    languageInfo,
    languages,
    translations,
    isRTL,
    isLoading,
    isInitialized,
    setLanguage,
    t,
    translateContent,
    translateDeliberation,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

// =============================================================================
// HOOK
// =============================================================================

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// =============================================================================
// LANGUAGE SELECTOR COMPONENT
// =============================================================================

export function LanguageSelector({ className }: { className?: string }) {
  const { language, languages, setLanguage, isLoading, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const currentLanguage = languages.find((l) => l.code === language);

  // Filter languages by search query
  const filteredLanguages = languages.filter(
    (lang) =>
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
    if (!isOpen) {
      setSearchQuery('');
    }
  }, [isOpen]);

  // Keyboard shortcut: Alt+L to toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'l') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleLanguageChange = async (code: string) => {
    const lang = languages.find((l) => l.code === code);
    await setLanguage(code);
    setIsOpen(false);

    // Show toast notification
    if (lang) {
      setToastMessage(`🌐 ${lang.nativeName}`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  return (
    <div className={`relative ${className || ''}`}>
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-[100] animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="bg-neutral-900 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
            <span className="text-sm font-medium">{toastMessage}</span>
            <span className="text-green-400">✓</span>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-100 transition-colors group"
        disabled={isLoading}
        title="Change language (Alt+L)"
      >
        <span className="text-lg group-hover:scale-110 transition-transform">🌐</span>
        <span className="text-sm font-medium uppercase">{language}</span>
        {currentLanguage && (
          <span className="hidden sm:inline text-sm text-neutral-500">
            {currentLanguage.nativeName}
          </span>
        )}
        {isLoading && (
          <span className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        )}
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-neutral-200 z-50 overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200">
            {/* Header with search */}
            <div className="p-3 border-b border-neutral-100 bg-gradient-to-b from-neutral-50 to-white">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm text-neutral-900">
                  {t('settings.language') || 'Language'}
                </h3>
                <span className="text-xs text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full">
                  {languages.length}
                </span>
              </div>
              {/* Search input */}
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search languages..."
                  className="w-full pl-8 pr-3 py-2 text-sm bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <svg
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Language list */}
            <div className="max-h-72 overflow-y-auto py-1">
              {filteredLanguages.length === 0 ? (
                <div className="px-4 py-8 text-center text-neutral-400 text-sm">
                  No languages found
                </div>
              ) : (
                filteredLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-neutral-50 transition-all duration-150 ${
                      language === lang.code
                        ? 'bg-primary-50 border-l-2 border-primary-500'
                        : 'border-l-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono uppercase w-7 text-neutral-400 bg-neutral-100 rounded px-1 py-0.5 text-center">
                        {lang.code}
                      </span>
                      <div>
                        <p
                          className={`font-medium text-sm ${language === lang.code ? 'text-primary-700' : 'text-neutral-900'}`}
                        >
                          {lang.nativeName}
                        </p>
                        <p className="text-xs text-neutral-500">{lang.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {lang.rtl && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded font-medium">
                          RTL
                        </span>
                      )}
                      {language === lang.code && (
                        <span className="text-primary-600 text-lg">✓</span>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* Footer with keyboard hint */}
            <div className="px-3 py-2 border-t border-neutral-100 bg-neutral-50 text-xs text-neutral-400 flex items-center justify-between">
              <span>
                Press{' '}
                <kbd className="px-1.5 py-0.5 bg-neutral-200 rounded text-neutral-600 font-mono text-[10px]">
                  Alt+L
                </kbd>{' '}
                to toggle
              </span>
              <span>
                <kbd className="px-1.5 py-0.5 bg-neutral-200 rounded text-neutral-600 font-mono text-[10px]">
                  Esc
                </kbd>{' '}
                to close
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default LanguageProvider;
