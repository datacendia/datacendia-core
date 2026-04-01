/**
 * Grupo Figer — Spanish (Español) Scenarios
 * @module pages/sandbox/configs/grupo-figer-es
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import type { TemplateScenario } from '../SandboxTemplate';
import { AGENTS_ES } from './grupo-figer-agents';

const A = AGENTS_ES;

// =============================================================================
// SCENARIO 1 — DOBLE REPRESENTACIÓN
// =============================================================================

const S1: TemplateScenario = {
  id: 'dual-representation',
  title: 'Doble Representación — Transferencia a la Premier League',
  subtitle: 'Tope de honorarios FIFA 6% · Consentimiento dual requerido · Permiso de trabajo FA GBE · Plazo de registro IMS',
  banner: 'Un cliente de Figer se transfiere de Flamengo a un club de la Premier League. Figer representa tanto al jugador como al club adquirente (doble representación). El Reglamento de Agentes FIFA 2023 requiere consentimiento escrito explícito de ambas partes, tope combinado del 6%, y registro en IMS. La FA requiere un permiso de trabajo GBE. Un documento faltante anula todos los honorarios.',
  risk: 'Crítico',
  scenarioNum: 'Transferencia',
  icon: 'scale',
  color: 'text-emerald-400',
  agents: [A.transferAgent, A.fifaCompliance, A.legalAgent, A.financialAgent],
  connectors: [
    { name: 'Portal FIFA IMS', status: 'connected', type: 'Sistema de Gestión de Intermediarios', icon: 'shield', detail: 'Ventana de transferencias cierra en 72 horas — registro IMS requerido' },
    { name: 'Sistema de Registro CBF', status: 'connected', type: 'Base de Datos FA Brasileña', icon: 'database', detail: 'Contrato del jugador registrado — ITC pendiente de CBF a FA' },
    { name: 'Calculadora FA GBE', status: 'syncing', type: 'Evaluación de Permiso de Trabajo UK', icon: 'globe', detail: 'Caps internacionales del jugador: 12 (Brasil U-23) — umbral GBE: 70 puntos' },
    { name: 'Archivo de Mandatos Figer', status: 'connected', type: 'Documentación de Mandatos', icon: 'file-text', detail: '3 mandatos activos para este jugador en 2 jurisdicciones' },
  ],
  script: [
    { agentId: 'transfer', phase: 'phase1', type: 'warning', delay: 800, content: 'ALERTA DE DOBLE REPRESENTACIÓN. Figer actúa para el jugador (mandato de venta firmado 14 de marzo 2026) y el club adquirente de la Premier League (carta de compromiso de compra 22 de marzo 2026). Los Artículos 12-13 del Reglamento de Agentes FIFA 2023 requieren: (1) Consentimiento escrito explícito del jugador reconociendo la doble representación, (2) Consentimiento escrito explícito del club, (3) Divulgación completa del conflicto de intereses, (4) Honorario combinado no puede exceder el 6% de la remuneración bruta del jugador bajo el Artículo 16. Estado actual: Consentimiento del jugador — FIRMADO. Consentimiento del club — PENDIENTE. La ventana de transferencias cierra en 72 horas. Sin consentimiento del club, todo el derecho a honorarios de Figer es nulo.' },
    { agentId: 'financial', phase: 'phase1', type: 'analysis', delay: 2500, content: 'Análisis de estructura de honorarios. Remuneración bruta del jugador: £4.2M/año × contrato de 5 años = £21M total. Tope FIFA al 6% (doble representación): £1.26M máximo. Honorario propuesto por Figer: £1.1M (5.24% — dentro del tope). Ruta de pago: El club paga directamente a Figer a través de FIFA IMS — sin intermediarios permitidos bajo Artículos 17-20. Verificación AML: Fuente de pago verificada — cuenta operativa del club. Notificación COAF requerida para recepción transfronteriza superior a R$50,000. Declaración ante Receita Federal requerida dentro de 30 días.' },
    { agentId: 'fifa', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISENSO REGISTRADO. La carta de compromiso tiene fecha 22 de marzo 2026 pero referencia un "acuerdo verbal de febrero 2026." Bajo el Artículo 14 del Reglamento de Agentes FIFA 2023, los mandatos deben ser por escrito antes de cualquier representación. Si FIFA determina que Figer comenzó a representar al club en febrero sin mandato escrito, el honorario del lado de compra (£550K) está en riesgo. El mandato registrado en CBF no referencia explícitamente el consentimiento de doble representación requerido por el Artículo 12. Se necesita un formulario independiente de consentimiento FIFA.' },
    { agentId: 'legal', phase: 'phase2', type: 'flag', delay: 2000, content: 'ALERTA ELEVADA. Jurisprudencia CAS: CAS 2024/A/9847 (Agente vs. Club) — el TAS dictaminó que los acuerdos verbales anteriores a mandatos escritos no validan retroactivamente la representación. La referencia al acuerdo verbal de febrero crea vulnerabilidad. Además, la evaluación GBE de la FA muestra 65 puntos contra un umbral de 70. La transferencia fallará en el registro de la FA a menos que el club solicite revisión del panel de excepciones o las caps del jugador se recalculen bajo el marco GBE 2026 revisado.' },
    { agentId: 'transfer', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proponiendo Paquete de Transferencia Conforme Datacendia: (1) Ejecutar Formulario independiente de Consentimiento de Doble Representación FIFA — jugador Y club firman simultáneamente, con lenguaje explícito de Artículos 12-13. Sellado criptográficamente vía CendiaChronos. (2) Enmendar la carta para eliminar la referencia al acuerdo verbal de febrero — la fecha efectiva del mandato escrito es 22 de marzo 2026. (3) Registrar en IMS inmediatamente. (4) Club presenta solicitud de excepciones GBE hoy. (5) Documentación AML completa: notificación COAF y declaración Receita Federal preparadas. Todo sellado con RFC 3161 y ML-DSA-65.' },
    { agentId: 'fifa', phase: 'phase3', type: 'resolution', delay: 2500, content: 'El formulario de consentimiento con marca temporal criptográfica elimina el riesgo de retroactividad identificado en CAS 2024/A/9847. La carta enmendada elimina la referencia de febrero — cadena de mandato limpia. El registro IMS con sello de evidencia Datacendia proporciona procedencia completa a auditores FIFA: mandato → consentimiento → cálculo de honorarios → registro IMS, todo vinculado criptográficamente. Disenso RETIRADO. Este es el estándar de evidencia que el Reglamento de Agentes FIFA 2023 pretendía.' },
  ],
  receiptTemplate: {
    hash: 'SHA-256:f4e8c62d1a7b9530e8d2c96f4b1a3e5d7c9f0a2b4d6e8f0a2b4d6e8f0a2b4d6e',
    merkleRoot: 'b7c9e1d3f5a7b9c1d3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9',
    merkleLabel: 'Árbol Merkle (Consentimiento dual + Cálculo de honorarios + Registro IMS + Solicitud GBE + Documentación AML)',
    complianceLabel: 'Estado Reglamento de Agentes FIFA 2023',
    complianceValue: 'DOBLE REPRESENTACIÓN CONFORME',
    complianceThreshold: 'Artículos 12-16 cumplidos',
    agents: ['Agente de Gobernanza', 'Agente FIFA', 'Agente Legal', 'Agente Financiero'],
    dissents: 1,
    dissentResolved: true,
    guaranteeTitle: 'Grupo Figer — Evidencia de Transferencia con Doble Representación Sellada',
    guaranteeBody: 'Este paquete criptográfico sella evidencia completa de cumplimiento de doble representación para auditoría FIFA IMS: consentimiento del jugador, consentimiento del club, divulgación de conflictos, cálculo de tope de honorarios (5.24% ≤ 6%), autorización AML y solicitud GBE.',
    evidenceChain: 'Verificación de mandato → Consentimiento dual → Cálculo de tope → Registro IMS → Solicitud GBE → AML/COAF → Sellado → ML-DSA-65',
  },
  idleTitle: 'Listo para Deliberar',
  idleDesc: '4 agentes IA realizarán una revisión completa de cumplimiento de transferencia con doble representación — validando mandatos FIFA, topes de honorarios, registro IMS, permisos de trabajo FA y documentación AML.',
  phaseLabels: ['Análisis de Mandato y Honorarios', 'Revisión de Cumplimiento y Debate', 'Resolución y Sellado de Evidencia'],
};

// =============================================================================
// SCENARIO 2 — PROTECCIÓN DE MENORES
// =============================================================================

const S2: TemplateScenario = {
  id: 'minor-protection',
  title: 'Protección de Jugador Menor — FIFA Artículo 19',
  subtitle: 'Jugador de 16 años · Transferencia internacional · Aprobación del Subcomité FIFA · Protección infantil ECA',
  banner: 'Figer descubre un talento de 16 años de una escolinha de São Paulo para un club de la Primeira Liga portuguesa. El Artículo 19 del RSTP FIFA prohíbe transferencias internacionales de menores de 18 salvo excepciones específicas. Requiere aprobación del Subcomité FIFA, consentimiento parental, planes educativos y cumplimiento del ECA de Brasil.',
  risk: 'Crítico',
  scenarioNum: 'Juvenil',
  icon: 'shield-check',
  color: 'text-orange-400',
  agents: [A.youthProtection, A.fifaCompliance, A.legalAgent, A.dataProtection],
  connectors: [
    { name: 'Subcomité FIFA', status: 'syncing', type: 'Aprobación de Menores', icon: 'shield', detail: 'Solicitud pendiente — procesamiento promedio: 45 días' },
    { name: 'Registro Juvenil CBF (BID)', status: 'connected', type: 'Base de Datos Juvenil', icon: 'database', detail: 'Jugador registrado desde los 14 — historial desde 2022' },
    { name: 'Registro de Cumplimiento ECA', status: 'connected', type: 'Marco de Protección Infantil', icon: 'shield-check', detail: 'Estatuto da Criança — horarios, educación, bienestar' },
    { name: 'Portal de Agentes FPF', status: 'ready', type: 'Registro FA Portuguesa', icon: 'globe', detail: 'Cuota de extranjeros Primeira Liga: 8 plazas no-UE disponibles' },
  ],
  script: [
    { agentId: 'youth', phase: 'phase1', type: 'warning', delay: 800, content: 'ALERTA DE PROTECCIÓN DE MENORES. El jugador tiene 16 años — nacido el 8 de junio de 2009. Cualquier transferencia internacional requiere excepción del Artículo 19 del RSTP FIFA. Excepción 2 potencialmente aplicable (Portugal es UE): el club debe proporcionar educación futbolística Y académica adecuada, alojamiento apropiado, y designar un oficial de bienestar. Figer debe documentar TODAS las condiciones y presentar ante el Subcomité FIFA. PARADA OBLIGATORIA: Sin actividad de transferencia hasta confirmación del Subcomité.' },
    { agentId: 'data', phase: 'phase1', type: 'analysis', delay: 2500, content: 'ANÁLISIS DE PROTECCIÓN DE DATOS LGPD/GDPR. Los datos del menor están doblemente protegidos: LGPD brasileña Artículo 14 — protecciones específicas para datos de niños, requiere consentimiento parental. GDPR Artículo 8 — aplica en destino portugués. Categorías: registros médicos, expedientes académicos, información financiera familiar, datos biométricos. TODO procesamiento requiere base legal documentada bajo ambas legislaciones. La ANPD ha intensificado la aplicación sobre datos de menores en contextos deportivos.' },
    { agentId: 'legal', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISENSO REGISTRADO. El ECA de Brasil impone límites estrictos sobre condiciones laborales de menores. Artículo 67: Sin trabajo peligroso, nocturno o agotador para menores de 18. Los horarios de entrenamiento europeos frecuentemente exceden los límites del ECA. La solicitud al Subcomité debe demostrar cumplimiento con la ley laboral portuguesa Y estándares ECA. El mandato de agencia con un menor de 16 años requiere co-firma del tutor legal Y aprobación de un juez del Tribunal Laboral brasileño para reubicación internacional.' },
    { agentId: 'fifa', phase: 'phase2', type: 'flag', delay: 2000, content: 'ALERTA ELEVADA. Tasa de aprobación del Subcomité FIFA para transferencias Brasil-Portugal de 16 años: 67% (24 de 36 solicitudes 2024-2026). Razones de rechazo más comunes: plan educativo inadecuado (8), falta de oficial de bienestar (4), alojamiento insatisfactorio (3), consentimiento parental incompleto (1). Figer debe verificar obligaciones de compensación por formación — todos los clubes formadores desde los 12 años tienen derecho bajo Artículos 20-21 del RSTP FIFA.' },
    { agentId: 'youth', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proponiendo Paquete de Protección de Menores Datacendia: (1) Solicitud completa al Subcomité FIFA: verificación de edad, documentación Excepción 2, programa educativo, CV del oficial de bienestar, planes de alojamiento. (2) Consentimiento parental bilingüe — firmado por ambos padres, atestiguado por notario brasileño. (3) Plan de cumplimiento ECA — horarios de entrenamiento contra límites ECA. (4) LGPD/GDPR — consentimiento parental para todas las categorías, SCCs para transferencia transfronteriza. (5) Compensación por formación. (6) Aprobación del Tribunal Laboral brasileño. Todo sellado criptográficamente. PARADA OBLIGATORIA mantenida.' },
    { agentId: 'legal', phase: 'phase3', type: 'resolution', delay: 2500, content: 'El Paquete de Protección de Menores aborda los 4 factores comunes de rechazo. El cumplimiento de doble jurisdicción (ECA + ley laboral portuguesa) demuestra que el deber de cuidado de Figer se extiende más allá de los requisitos FIFA. El marco LGPD/GDPR protege contra acciones de autoridades de datos. La compensación por formación preserva los derechos de los clubes formadores. Disenso RETIRADO. Este es el estándar de oro para transferencias internacionales de menores.' },
  ],
  receiptTemplate: {
    hash: 'SHA-256:a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
    merkleRoot: 'c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d5',
    merkleLabel: 'Árbol Merkle (Solicitud Art. 19 + Consentimiento parental + Plan ECA + LGPD/GDPR + Compensación)',
    complianceLabel: 'Estado FIFA Artículo 19',
    complianceValue: 'SOLICITUD PRESENTADA — PENDIENTE SUBCOMITÉ',
    complianceThreshold: 'Condiciones Excepción 2 documentadas',
    agents: ['Agente de Protección Juvenil', 'Agente FIFA', 'Agente Legal', 'Agente de Datos'],
    dissents: 1,
    dissentResolved: true,
    guaranteeTitle: 'Grupo Figer — Evidencia de Protección de Menor Sellada',
    guaranteeBody: 'Este paquete sella evidencia completa de cumplimiento FIFA Artículo 19: solicitud al Subcomité, consentimiento parental, plan ECA, protección de datos LGPD/GDPR, compensación por formación y aprobación del Tribunal Laboral.',
    evidenceChain: 'Verificación de edad → Evaluación de excepción → Plan educativo → Oficial de bienestar → Consentimiento → ECA → LGPD/GDPR → Compensación → Tribunal → Sellado → ML-DSA-65',
  },
  idleTitle: 'Listo para Deliberar',
  idleDesc: '4 agentes IA realizarán revisión completa de protección de menores FIFA Artículo 19 — excepciones, consentimiento parental, bienestar infantil, protección de datos y compensación por formación.',
  phaseLabels: ['Evaluación de Protección', 'Revisión Legal y de Datos', 'Resolución y Sellado'],
};

// =============================================================================
// SCENARIO 3 — ARBITRAJE CAS
// =============================================================================

const S3: TemplateScenario = {
  id: 'cas-arbitration',
  title: 'Arbitraje CAS — Disputa por Honorarios Impagos',
  subtitle: 'Club rechaza £880K · Presentación FIFA DRC · Procedimiento CAS expedito · Plazo de 48 horas',
  banner: 'Un club de la Saudi Pro League se niega a pagar los £880K de honorarios de Figer, alegando que el mandato era inválido y los honorarios exceden los topes FIFA. Figer debe presentar ante la Cámara de Resolución de Disputas FIFA y prepararse para procedimientos CAS expeditos. La evidencia contemporánea completa determina el resultado.',
  risk: 'Alto',
  scenarioNum: 'CAS',
  icon: 'gavel',
  color: 'text-indigo-400',
  agents: [A.casArbitration, A.legalAgent, A.financialAgent, A.integrityAgent],
  connectors: [
    { name: 'Portal de Arbitraje CAS', status: 'connected', type: 'Tribunal de Arbitraje del Deporte', icon: 'gavel', detail: 'Procedimiento expedito — evidencia en 48 horas' },
    { name: 'Sistema DRC FIFA', status: 'connected', type: 'Cámara de Resolución de Disputas', icon: 'scale', detail: 'Reclamo #DRC-2026-04721 — respuesta del club pendiente' },
    { name: 'Registro de Agentes SAFF', status: 'connected', type: 'Federación Saudí', icon: 'globe', detail: 'Registro Figer SAFF verificado — válido hasta dic 2027' },
    { name: 'Bóveda de Evidencia Figer', status: 'connected', type: 'Archivo Criptográfico', icon: 'lock', detail: '47 documentos sellados — cadena completa' },
  ],
  script: [
    { agentId: 'cas', phase: 'phase1', type: 'warning', delay: 800, content: 'PROCEDIMIENTO CAS EXPEDITO ACTIVADO. El club de la Saudi Pro League ha presentado contrademanda ante CAS impugnando los £880K de Figer. Tres argumentos del club: (1) Mandato firmado por Director Deportivo, no un signatario autorizado bajo ley corporativa saudí — mandato nulo. (2) Honorario de 4.2% de la remuneración — club alega ser única parte mandante, tope de 3% (£628K). (3) Registro IMS 2 horas antes del cierre — club alega que fue "después de la transferencia efectiva." CAS ordenó evidencia en 48 horas.' },
    { agentId: 'financial', phase: 'phase1', type: 'analysis', delay: 2500, content: 'Análisis forense de honorarios. Remuneración total del jugador: £20.95M (contrato de 5 años). Honorario Figer: £880K = 4.2%. Si solo lado jugador (tope 3%): máximo £628K — argumento del club gana, Figer pierde £252K. Si doble representación (tope 6%): máximo £1.257M — honorario conforme. Pregunta crítica: ¿Figer representaba a ambas partes? Evidencia: Mandato del jugador 3 de febrero 2026. Carta del club 18 de febrero 2026 firmada por Mohammed Al-Rashidi. Consentimiento de doble representación 19 de febrero. Todos con marcas temporales RFC 3161 en la bóveda Datacendia.' },
    { agentId: 'legal', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISENSO REGISTRADO. Bajo la Ley de Sociedades Saudí (Decreto Real M/3), las obligaciones corporativas deben ser firmadas por un representante autorizado. CAS 2023/A/9612 — CAS confirmó la impugnación de un club saudí contra un acuerdo firmado por un Director Deportivo sin autoridad del Consejo. Si Al-Rashidi carecía de resolución del Consejo al momento de la firma, el mandato es nulo bajo ley saudí. Figer debe producir evidencia de la autoridad de Al-Rashidi en la fecha de firma.' },
    { agentId: 'integrity', phase: 'phase2', type: 'flag', delay: 2000, content: 'ALERTA ELEVADA. El argumento de cronología IMS es débil — CAS 2024/A/9901 estableció que el registro IMS hasta el cierre de ventana es válido. Las marcas temporales criptográficas de Datacendia prueban que la presentación IMS fue preparada 6 días antes. La evidencia crítica: Resolución del Consejo del 15 de enero 2026 autorizando a Al-Rashidi a "ejecutar todos los acuerdos relacionados con transferencias" — adjunta a la carta original en la bóveda Datacendia.' },
    { agentId: 'cas', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proponiendo Paquete de Evidencia CAS Datacendia — 48 Horas: (1) Cadena de mandato: Mandato jugador (3 feb) → Carta club (18 feb) → Consentimiento dual (19 feb) — todos con RFC 3161. (2) Resolución del Consejo (15 ene 2026) autorizando a Al-Rashidi — capturada antes de la disputa. (3) Cálculo: doble representación 4.2% ≤ 6%. (4) Cronología IMS: marcas de 6 días de anticipación. (5) Árbol Merkle vinculando 47 documentos. Exportación CAS con un clic.' },
    { agentId: 'legal', phase: 'phase3', type: 'resolution', delay: 2500, content: 'La Resolución del Consejo es decisiva — prueba que Al-Rashidi tenía autoridad al firmar, destruyendo el argumento principal del club. La marca temporal criptográfica prueba captura en tiempo real, no fabricación posterior. CAS sostiene consistentemente que la evidencia criptográfica contemporánea tiene mayor peso que reconstrucciones documentales. Con el precedente IMS (CAS 2024/A/9901), los tres argumentos del club fallan. Disenso RETIRADO. Este paquete debe resultar en recuperación total más costos CAS.' },
  ],
  receiptTemplate: {
    hash: 'SHA-256:d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5',
    merkleRoot: 'e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9',
    merkleLabel: 'Árbol Merkle (47 docs: Cadena de mandato + Resolución del Consejo + Cálculo + Cronología IMS + Consentimiento)',
    complianceLabel: 'Estado de Evidencia CAS',
    complianceValue: 'PAQUETE SELLADO — PLAZO 48H CUMPLIDO',
    complianceThreshold: 'Reglas CAS de Procedimiento cumplidas',
    agents: ['Agente CAS', 'Agente Legal', 'Agente Financiero', 'Agente de Integridad'],
    dissents: 1,
    dissentResolved: true,
    guaranteeTitle: 'Grupo Figer — Paquete de Evidencia CAS Expedito Sellado',
    guaranteeBody: 'Este paquete sella 47 documentos para procedimiento CAS expedito: cadena de mandato, autoridad del signatario, cálculo de honorarios, cronología IMS y consentimiento de doble representación.',
    evidenceChain: 'Cadena de mandato → Resolución del Consejo → Consentimiento dual → Cálculo → Cronología IMS → Árbol Merkle → Sellado → ML-DSA-65',
  },
  idleTitle: 'Listo para Deliberar',
  idleDesc: '4 agentes IA prepararán un paquete de evidencia CAS expedito — validando cadena de mandato, autoridad del signatario, cumplimiento de honorarios y cronología IMS.',
  phaseLabels: ['Análisis de Reclamo', 'Desafío Legal y Debate', 'Paquete y Sellado'],
};

// =============================================================================
// SCENARIO 4 — DETECCIÓN TPO
// =============================================================================

const S4: TemplateScenario = {
  id: 'tpo-detection',
  title: 'Detección de TPO — Transferencia Sudamericana',
  subtitle: 'FIFA RSTP Artículo 18ter · Estructura de inversión oculta · Empresa fantasma · Propiedad circular',
  banner: 'Figer facilita la transferencia de un jugador colombiano de un club argentino a LaLiga. La debida diligencia revela una estructura de propiedad compleja con un vehículo de inversión uruguayo con derechos económicos indirectos. FIFA prohibió TPO globalmente en 2015, pero estructuras sudamericanas persisten.',
  risk: 'Alto',
  scenarioNum: 'TPO',
  icon: 'search',
  color: 'text-red-400',
  agents: [A.integrityAgent, A.fifaCompliance, A.legalAgent, A.financialAgent],
  connectors: [
    { name: 'Registro TPO FIFA', status: 'connected', type: 'Base de Datos TPO', icon: 'search', detail: 'Base de violaciones TPO — 847 casos históricos' },
    { name: 'Sistema de Registro AFA', status: 'connected', type: 'Base de Datos FA Argentina', icon: 'database', detail: 'Contrato del jugador + estructura de propiedad' },
    { name: 'Registro Corporativo Uruguayo', status: 'syncing', type: 'Búsqueda de Propiedad', icon: 'building-2', detail: 'Verificando vehículo de inversión — 4 capas corporativas' },
    { name: 'Portal de Agentes RFEF', status: 'ready', type: 'Registro FA Española', icon: 'globe', detail: 'Evaluación de tope salarial LaLiga pendiente' },
  ],
  script: [
    { agentId: 'integrity', phase: 'phase1', type: 'warning', delay: 800, content: 'ALERTA DE EVALUACIÓN TPO. La debida diligencia revela que el 30% de los derechos económicos del jugador fueron transferidos a "Río de la Plata Football Investments S.A." — sociedad anónima uruguaya — en 2021. El Artículo 18ter del RSTP FIFA prohíbe que terceros tengan influencia sobre empleo, transferencias o asuntos del club. La presentación AFA (enero 2026) muestra que el club adquirió el 100% de los derechos en diciembre 2024. Sin embargo, la entidad uruguaya no ha sido disuelta y sus beneficiarios incluyen un directivo del club argentino. PARADA OBLIGATORIA.' },
    { agentId: 'financial', phase: 'phase1', type: 'analysis', delay: 2500, content: 'Análisis forense financiero. La entidad fue capitalizada con US$2.1M en 2021 — 30% del valor del jugador (US$7M). La "recompra" de diciembre 2024 fue US$4.5M — 30% del valor actualizado (US$15M). Pago del club argentino a la cuenta de Río de la Plata en Banco República, Montevideo. Análisis de propiedad: el accionista controlante (67%) es Gabriel Martínez Aguirre — quien también es Vicepresidente del club argentino. Estructura circular: el club pagó US$4.5M a una empresa controlada por su propio Vicepresidente. TPO encubierto.' },
    { agentId: 'legal', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISENSO REGISTRADO. La estructura circular puede no constituir técnicamente TPO si el club genuinamente controla el 100% post-diciembre 2024. CAS 2022/A/8945 estableció que TPO termina cuando el club adquiere todos los derechos. Sin embargo, el rol dual del VP crea un conflicto ético FIFA separado. Si Figer procede y FIFA determina circumvención TPO, Figer enfrenta: (a) Pérdida de honorarios, (b) Suspensión de licencia, (c) Investigación en las 11 jurisdicciones. Riesgo asimétrico — un honorario vs. todo el negocio de Figer.' },
    { agentId: 'fifa', phase: 'phase2', type: 'flag', delay: 2000, content: 'ALERTA ELEVADA. FIFA ha sancionado 23 clubes por TPO desde 2015 — 7 involucraron estructuras donde un directivo era beneficiario de la entidad tercera. En los 7 casos, FIFA trató el arreglo como TPO vigente independientemente de la transferencia formal de derechos. El pago circular es una señal de alerta específica en el protocolo de investigación FIFA. La obligación de debida diligencia de Figer requiere "investigación razonable" — proceder sin resolver esto está por debajo del umbral.' },
    { agentId: 'integrity', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proponiendo Protocolo de Resolución TPO Datacendia: (1) PARADA OBLIGATORIA mantenida. (2) Requerir al club argentino: (a) Opinión legal independiente confirmando ausencia de derechos económicos de terceros, (b) Divulgación de propiedad mostrando disolución o separación del VP, (c) Certificación AFA de 100% de derechos. (3) Si condiciones cumplidas: proceder con documentación sellada. (4) Si NO cumplidas: Figer se retira y presenta divulgación proactiva ante FIFA demostrando detección y rechazo. La divulgación protege la licencia de Figer. Todo sellado criptográficamente.' },
    { agentId: 'legal', phase: 'phase3', type: 'resolution', delay: 2500, content: 'El Protocolo protege a Figer independientemente del resultado. Si resuelto, documentación completa. Si no, la divulgación proactiva demuestra el "programa de cumplimiento efectivo" que protege licencias. CAS recompensa agentes que detectan y divulgan violaciones. La evidencia criptográfica prueba que la detección de Figer ocurrió antes de cualquier actividad de transferencia. Disenso RETIRADO. Esto transforma una potencial catástrofe regulatoria en demostración de los estándares de gobernanza de Figer.' },
  ],
  receiptTemplate: {
    hash: 'SHA-256:e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6',
    merkleRoot: 'f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9a1',
    merkleLabel: 'Árbol Merkle (Trazado de propiedad + Forense financiero + Precedentes CAS + Protocolo de resolución)',
    complianceLabel: 'Estado de Evaluación TPO',
    complianceValue: 'PARADA OBLIGATORIA — RESOLUCIÓN PENDIENTE',
    complianceThreshold: 'FIFA RSTP Artículo 18ter',
    agents: ['Agente de Integridad', 'Agente FIFA', 'Agente Legal', 'Agente Financiero'],
    dissents: 1,
    dissentResolved: true,
    guaranteeTitle: 'Grupo Figer — Evidencia de Detección TPO Sellada',
    guaranteeBody: 'Este paquete sella evidencia completa de evaluación TPO: trazado de propiedad, forense financiero, detección de estructura circular, análisis de precedentes CAS y protocolo de resolución.',
    evidenceChain: 'Trazado de propiedad → Forense financiero → Propiedad beneficiaria → Detección circular → Precedentes CAS → Protocolo → Sellado → ML-DSA-65',
  },
  idleTitle: 'Listo para Deliberar',
  idleDesc: '4 agentes IA realizarán evaluación TPO — trazando propiedad beneficiaria, analizando estructuras financieras y aplicando paradas obligatorias con evidencia criptográfica.',
  phaseLabels: ['Análisis de Propiedad', 'Forense Legal y Financiero', 'Protocolo de Resolución'],
};

// =============================================================================
// SCENARIO 5 — IMPUESTOS Y AML BRASILEÑO
// =============================================================================

const S5: TemplateScenario = {
  id: 'brazil-tax-aml',
  title: 'Receita Federal y COAF — Cumplimiento Fiscal Transfronterizo',
  subtitle: 'Honorario de R$12M · Alerta AML COAF · Auditoría Receita Federal · Derechos de imagen',
  banner: 'Figer recibe R$12M de honorarios de una transferencia a un club saudí a través de FIFA IMS. Receita Federal requiere clasificación fiscal precisa. COAF ha alertado el pago para revisión AML. Simultáneamente, una empresa de derechos de imagen estructurada por Figer está bajo auditoría.',
  risk: 'Alto',
  scenarioNum: 'Fiscal/AML',
  icon: 'banknote',
  color: 'text-yellow-400',
  agents: [A.financialAgent, A.legalAgent, A.integrityAgent, A.dataProtection],
  connectors: [
    { name: 'Receita Federal do Brasil', status: 'connected', type: 'Autoridad Tributaria', icon: 'landmark', detail: 'Notificación de auditoría — plazo de 30 días' },
    { name: 'Portal COAF', status: 'syncing', type: 'Unidad de Inteligencia Financiera', icon: 'alert-triangle', detail: 'Alerta AML — R$12M transfronterizo de entidad saudí' },
    { name: 'Sistema BACEN', status: 'connected', type: 'Reporte de Cambio', icon: 'banknote', detail: 'Contrato de cambio registrado — tasa PTAX fijada' },
    { name: 'Rastreador FIFA IMS', status: 'connected', type: 'Verificación de Pagos', icon: 'shield', detail: 'Instrucción de pago verificada — ruta IMS confirmada' },
  ],
  script: [
    { agentId: 'financial', phase: 'phase1', type: 'warning', delay: 800, content: 'ALERTA DE AUDITORÍA RECEITA FEDERAL. Dos eventos concurrentes: (1) Honorario de R$12M requiere clasificación fiscal correcta — IRPJ 15% + 10% adicional sobre utilidad mayor a R$240K/año, CSLL 9%, PIS/COFINS 3.65% (acumulativo) o 9.25% (no acumulativo), ISS São Paulo 5%. Tasa efectiva total: 34-40%. Clasificación incorrecta genera multas del 75-150%. (2) Receita Federal abrió auditoría sobre empresa de derechos de imagen (pessoa jurídica) de un cliente — sospecha que la empresa carece de "sustancia comercial." Este es el desafío más común de Receita Federal a estructuras de derechos de imagen en el fútbol brasileño.' },
    { agentId: 'integrity', phase: 'phase1', type: 'analysis', delay: 2500, content: 'ANÁLISIS AML COAF. La Resolución COAF 36/2021 requiere que agentes deportivos reporten transacciones superiores a R$50,000, transacciones con jurisdicciones monitoreadas por FATF, y rutas de pago inusuales. Los R$12M de Arabia Saudita activan los tres criterios. Figer debe presentar un Reporte de Transacción Sospechosa (STR) ante COAF en 24 horas. No porque la transacción sea sospechosa, sino porque el monto y origen cumplen umbrales de reporte obligatorio. No presentar genera multas de R$20M o 2× el monto de la transacción.' },
    { agentId: 'legal', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISENSO REGISTRADO. La auditoría de derechos de imagen es el problema más peligroso. Receita Federal ha impugnado 340+ empresas de derechos de imagen desde 2019 bajo la doctrina de "sustancia comercial." Su posición: si más del 95% de los ingresos de la PJ provienen de una sola fuente (el club), y la PJ no tiene empleados, oficina ni actividades más allá de recibir pagos de imagen, carece de sustancia comercial y debe tributar como ingreso personal. Tasa personal: 27.5% vs. PJ: ~11%. Si Receita Federal reclasifica, el jugador enfrenta impuestos retroactivos y Figer enfrenta responsabilidad profesional.' },
    { agentId: 'data', phase: 'phase2', type: 'flag', delay: 2000, content: 'ALERTA ELEVADA. La PJ de derechos de imagen contiene datos financieros personales del jugador protegidos por LGPD. Si Receita Federal solicita acceso a los registros, Figer debe verificar: (1) La solicitud tiene base legal bajo ley tributaria, (2) Solo se divulgan datos relevantes a la auditoría, (3) El jugador es notificado bajo LGPD Artículo 18. La ANPD ha establecido que auditorías fiscales no anulan los requisitos de minimización de datos LGPD.' },
    { agentId: 'financial', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proponiendo Paquete de Cumplimiento Fiscal y AML Datacendia: (1) STR COAF — presentado en 24 horas con documentación completa. (2) Declaración de honorarios — cálculos IRPJ/CSLL/PIS/COFINS/ISS con respaldos, via e-CAC. (3) Respuesta a auditoría de imagen — evidencia de sustancia comercial: contratos con 3 patrocinadores (no solo el club), estados financieros diversificados, contrato de oficina, dos empleados de medio tiempo. (4) Divulgación LGPD — solo documentos especificados, con notificación al jugador. Todo sellado criptográficamente.' },
    { agentId: 'legal', phase: 'phase3', type: 'resolution', delay: 2500, content: 'La cuestión crítica es si la PJ tiene sustancia comercial genuina. Si la evidencia muestra 3 contratos de patrocinio y diversificación, el desafío de Receita Federal es defendible — coincidiendo con patrones ganadores en decisiones recientes del CARF. El STR COAF proactivo demuestra cumplimiento AML. La divulgación LGPD muestra respeto por derechos de datos incluso bajo presión gubernamental. Disenso RETIRADO. Este paquete transforma dos amenazas de cumplimiento en demostración de gobernanza integrada de Figer.' },
  ],
  receiptTemplate: {
    hash: 'SHA-256:f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7',
    merkleRoot: 'a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9a1b3',
    merkleLabel: 'Árbol Merkle (STR COAF + Cálculos fiscales + Evidencia de imagen + LGPD + BACEN)',
    complianceLabel: 'Estado Receita Federal y COAF',
    complianceValue: 'COAF PRESENTADO — RESPUESTA FISCAL PREPARADA',
    complianceThreshold: 'COAF 36/2021 + Requisitos Receita Federal',
    agents: ['Agente Financiero', 'Agente Legal', 'Agente de Integridad', 'Agente de Datos'],
    dissents: 1,
    dissentResolved: true,
    guaranteeTitle: 'Grupo Figer — Evidencia de Cumplimiento Fiscal y AML Sellada',
    guaranteeBody: 'Este paquete sella cumplimiento fiscal y AML brasileño completo: STR COAF, cálculos de honorarios, evidencia de sustancia de imagen, divulgación LGPD y documentación BACEN.',
    evidenceChain: 'STR COAF → Clasificación fiscal → Auditoría de imagen → LGPD → BACEN → Sellado → ML-DSA-65',
  },
  idleTitle: 'Listo para Deliberar',
  idleDesc: '4 agentes IA realizarán revisión de cumplimiento fiscal y AML brasileño — reporte COAF, respuesta a auditoría, defensa de imagen y gobernanza de datos LGPD.',
  phaseLabels: ['Evaluación Fiscal y AML', 'Defensa de Auditoría y Datos', 'Paquete y Sellado'],
};

// =============================================================================
// SCENARIO 6 — DERECHOS DE IMAGEN MULTI-JURISDICCIÓN
// =============================================================================

const S6: TemplateScenario = {
  id: 'image-rights',
  title: 'Derechos de Imagen Multi-Jurisdicción',
  subtitle: 'Brasil PJ · España sociedad · UK ingreso personal · Arabia Saudita empleador · 4 regímenes fiscales',
  banner: 'Un cliente de Figer juega en España pero tiene contratos de derechos de imagen en Brasil, el Reino Unido y Arabia Saudita. Cada jurisdicción trata los derechos de imagen de manera diferente. Una estructura incorrecta genera impuestos retroactivos y multas en las 4 jurisdicciones simultáneamente.',
  risk: 'Alto',
  scenarioNum: 'Imagen',
  icon: 'eye',
  color: 'text-violet-400',
  agents: [A.financialAgent, A.legalAgent, A.dataProtection, A.fifaCompliance],
  connectors: [
    { name: 'Receita Federal do Brasil', status: 'connected', type: 'Autoridad Tributaria Brasileña', icon: 'landmark', detail: 'Empresa PJ de imagen — declaración anual en 60 días' },
    { name: 'Agencia Tributaria (España)', status: 'connected', type: 'Autoridad Tributaria Española', icon: 'landmark', detail: 'IRPF imagen no residente — evaluación Ley Beckham' },
    { name: 'HMRC (Reino Unido)', status: 'syncing', type: 'Autoridad Tributaria UK', icon: 'landmark', detail: 'Patrocinio de imagen de marca UK — evaluación de retención' },
    { name: 'GAZT (Arabia Saudita)', status: 'ready', type: 'Autoridad Tributaria Saudí', icon: 'landmark', detail: 'Derechos de imagen como ingreso laboral — 0% impuesto personal' },
  ],
  script: [
    { agentId: 'financial', phase: 'phase1', type: 'warning', delay: 800, content: 'ALERTA DE DERECHOS DE IMAGEN MULTI-JURISDICCIÓN. Cliente de Figer juega en LaLiga. Ingresos por imagen de 4 jurisdicciones: (1) BRASIL — PJ del jugador recibe R$3.2M/año de 2 patrocinadores. Tasa PJ ~11% vs personal 27.5%. Receita Federal desafía estructuras PJ sin "sustancia comercial." (2) ESPAÑA — Club paga 15% del salario como imagen a través de sociedad civil. La Ley Beckham permite 24% para no residentes — pero los ingresos de imagen pueden no calificar. (3) UK — £400K de patrocinio con marca británica. HMRC grava derechos de imagen de no residentes bajo Sección 966 ITA 2007. (4) ARABIA SAUDITA — R$1.8M de partidos de exhibición. 0% impuesto personal pero posible reclasificación como ingreso empresarial (20% Zakat). Exposición total si las estructuras fallan: €2.1M estimados en impuestos retroactivos.' },
    { agentId: 'legal', phase: 'phase1', type: 'analysis', delay: 2500, content: 'Evaluación jurisdicción por jurisdicción. BRASIL: La PJ tiene 2 contratos de patrocinio y 1 empleado — cumple umbral mínimo de sustancia según decisiones recientes del CARF. Riesgo: MEDIO. ESPAÑA: La sociedad civil está siendo cuestionada por Agencia Tributaria cuando el jugador es socio único. Riesgo: ALTO. UK: Sección 966 ITA 2007 requiere retención. La marca UK paga bruto actualmente — sin retención. HMRC impondrá multas. Riesgo: CRÍTICO. ARABIA SAUDITA: Riesgo BAJO — raramente aplica a artistas extranjeros.' },
    { agentId: 'data', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISENSO REGISTRADO. Las estructuras de imagen involucran datos financieros del jugador en 4 jurisdicciones — LGPD, GDPR, UK GDPR y PDPL saudí. Si cualquier autoridad solicita la estructura global (común en auditorías), Figer debe navegar 4 regímenes de protección de datos. El CRS de la OCDE comparte automáticamente información entre España y Brasil — las contradicciones serán detectadas en 12-18 meses. Figer debe garantizar que las 4 estructuras cuenten la misma historia.' },
    { agentId: 'fifa', phase: 'phase2', type: 'flag', delay: 2000, content: 'ALERTA ELEVADA. El Artículo 22 del Reglamento de Agentes FIFA 2023 exige actuar en "el mejor interés del cliente." Si las estructuras de imagen generan impuestos retroactivos, el jugador puede reclamar negligencia de Figer. Además, todas las estructuras financieras deben documentarse para auditoría FIFA. La estructura de 4 jurisdicciones debe divulgarse completamente en la declaración anual de cumplimiento FIFA de Figer.' },
    { agentId: 'financial', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proponiendo Paquete de Cumplimiento de Imagen Datacendia: (1) UK URGENTE — Implementar retención Sección 966 inmediatamente. Divulgación voluntaria a HMRC (multas reducidas 10-30% vs 100%). (2) ESPAÑA — Verificar que la sociedad civil tiene carácter asociativo genuino. Si no, reestructurar. (3) BRASIL — Documentar sustancia comercial PJ. (4) SAUDITA — Mantener tratamiento actual. (5) Verificación de consistencia transfronteriza — Datacendia mapea las 4 estructuras asegurando coherencia ante intercambio automático CRS. (6) Declaración FIFA preparada. Todo sellado criptográficamente.' },
    { agentId: 'legal', phase: 'phase3', type: 'resolution', delay: 2500, content: 'La divulgación voluntaria UK es la acción inmediata crítica. La reestructuración de la sociedad civil española debe ocurrir este año fiscal. La verificación de consistencia CRS es el elemento más valioso — la mayoría de agentes nunca verifican coherencia entre jurisdicciones. La divulgación FIFA protege la licencia de Figer. Disenso RETIRADO. Este paquete transforma asesoría fragmentada en cumplimiento global integrado.' },
  ],
  receiptTemplate: {
    hash: 'SHA-256:a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8',
    merkleRoot: 'b9c1d3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1',
    merkleLabel: 'Árbol Merkle (Brasil PJ + España sociedad + UK retención + Saudita + Consistencia CRS + Divulgación FIFA)',
    complianceLabel: 'Cumplimiento de Derechos de Imagen',
    complianceValue: 'DIVULGACIÓN UK PRESENTADA — 4 JURISDICCIONES ALINEADAS',
    complianceThreshold: 'Consistencia CRS verificada',
    agents: ['Agente Financiero', 'Agente Legal', 'Agente de Datos', 'Agente FIFA'],
    dissents: 1,
    dissentResolved: true,
    guaranteeTitle: 'Grupo Figer — Evidencia de Derechos de Imagen Multi-Jurisdicción Sellada',
    guaranteeBody: 'Este paquete sella cumplimiento de derechos de imagen en 4 jurisdicciones: sustancia PJ brasileña, reestructuración sociedad española, divulgación voluntaria HMRC, documentación saudí, verificación CRS y divulgación FIFA.',
    evidenceChain: 'Auditoría PJ Brasil → Revisión sociedad España → Divulgación voluntaria UK → Evaluación saudí → Consistencia CRS → Declaración FIFA → Sellado → ML-DSA-65',
  },
  idleTitle: 'Listo para Deliberar',
  idleDesc: '4 agentes IA realizarán revisión de derechos de imagen multi-jurisdicción — alineando estructuras fiscales en Brasil, España, UK y Arabia Saudita.',
  phaseLabels: ['Análisis Jurisdiccional', 'Protección de Datos y FIFA', 'Alineación Global y Sellado'],
};

// =============================================================================
// SCENARIO 7 — LICENCIAMIENTO DE AGENTES FIFA
// =============================================================================

const S7: TemplateScenario = {
  id: 'agent-licensing',
  title: 'Licenciamiento de Agentes FIFA — Cumplimiento Multi-Federación',
  subtitle: '11 jurisdicciones · Examen anual · Requisitos DPC · Conducta · Divulgación de honorarios',
  banner: 'Figer opera en 11 jurisdicciones y debe mantener licencias con cada federación nacional. El Reglamento de Agentes FIFA 2023 introdujo exámenes anuales obligatorios, desarrollo profesional continuo y estándares de conducta. Una licencia vencida significa que Figer no puede actuar legalmente en esa jurisdicción.',
  risk: 'Alto',
  scenarioNum: 'Licencias',
  icon: 'shield-check',
  color: 'text-blue-400',
  agents: [A.fifaCompliance, A.legalAgent, A.transferAgent, A.integrityAgent],
  connectors: [
    { name: 'Plataforma de Agentes FIFA', status: 'connected', type: 'Registro Global', icon: 'shield', detail: 'Figer registrado — examen anual en 45 días' },
    { name: 'Registro CBF', status: 'connected', type: 'FA Brasileña', icon: 'database', detail: 'Licencia principal — 200+ mandatos activos' },
    { name: 'Portal Multi-Federación', status: 'syncing', type: '10 Federaciones Adicionales', icon: 'globe', detail: 'FA, RFEF, DFB, FIGC, FFF, SAFF, UAEFA, QFA, USSF, JFA' },
    { name: 'Sistema de Seguimiento DPC', status: 'connected', type: 'Desarrollo Profesional', icon: 'book-open', detail: '12 horas DPC anuales requeridas — 8 completadas' },
  ],
  script: [
    { agentId: 'fifa', phase: 'phase1', type: 'warning', delay: 800, content: 'AUDITORÍA DE LICENCIAS FIFA. Verificación anual en 11 jurisdicciones: (1) Examen FIFA anual — en 45 días. Tasa de aprobación 2025: 71%. (2) CBF — Licencia vigente, renovación octubre 2026. (3) FA (Inglaterra) — Requisito DPC: 15 horas anuales, 8 completadas, faltan 7. (4) RFEF (España) — Nuevo requisito 2026: certificación AML anual. NO COMPLETADA. (5) SAFF (Arabia Saudita) — Renovación requiere seguro de responsabilidad profesional que cubra operaciones saudíes. Póliza actual EXCLUYE Medio Oriente. BRECHA CRÍTICA.' },
    { agentId: 'legal', phase: 'phase1', type: 'analysis', delay: 2500, content: 'Evaluación de riesgo. La brecha de seguro SAFF es la más crítica — sin seguro válido, la licencia SAFF está técnicamente suspendida. Transacciones con clubes saudíes durante la exclusión son legalmente vulnerables. Arabia Saudita representa ~15% del volumen anual de transferencias de Figer (US$75M+). La certificación AML de RFEF es la segunda prioridad — España es el mayor mercado europeo. El déficit DPC de FA es manejable. El examen FIFA es riesgo de continuidad del negocio.' },
    { agentId: 'transfer', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISENSO REGISTRADO. Hay 3 negociaciones activas con clubes saudíes — honorarios potenciales de £2.1M. Si divulgamos la brecha de seguro, estos acuerdos pueden colapsar. Pero si completamos y luego se descubre, los 3 honorarios están en riesgo más procedimientos disciplinarios FIFA. La opción comercialmente atractiva (completar primero, arreglar después) es la opción de catástrofe regulatoria. Debemos obtener cobertura de emergencia ANTES de cualquier actividad saudí adicional.' },
    { agentId: 'integrity', phase: 'phase2', type: 'flag', delay: 2000, content: 'ALERTA ELEVADA. FIFA suspendió 14 agentes en 2025 por licencias inadecuadas — 5 por brechas de seguro, 3 por DPC vencido. En todos los casos, las transacciones durante el período fueron investigadas y los honorarios sujetos a decomiso. La posición de FIFA: operar sin licencia válida en CUALQUIER jurisdicción contamina TODAS las transacciones. La brecha SAFF debe tratarse como emergencia organizacional.' },
    { agentId: 'fifa', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proponiendo Paquete de Cumplimiento de Licencias Datacendia: (1) INMEDIATO — Extensión de emergencia a póliza de seguro para Medio Oriente. Objetivo: 48 horas. Sin actividad saudí hasta confirmar. (2) Certificación AML RFEF — programar en 14 días. (3) DPC FA — registrar 3 cursos (7 horas) en 30 días. (4) Preparación examen FIFA. (5) Calendario automatizado de renovación — cada federación, cada plazo, con alertas de 90 días. (6) Revisión retroactiva de transacciones saudíes durante brecha — preparar divulgación voluntaria a SAFF si es necesario. Todo sellado criptográficamente.' },
    { agentId: 'transfer', phase: 'phase3', type: 'resolution', delay: 2500, content: 'El binder de seguro de emergencia elimina el riesgo inmediato. Las 3 negociaciones saudíes se reanudan con cobertura confirmada — pausa de 48 horas comercialmente manejable. El calendario automatizado es el mayor valor a largo plazo — previene recurrencia en las 11 jurisdicciones. La divulgación voluntaria SAFF demuestra detección proactiva. Disenso RETIRADO. Esto transforma una crisis de cumplimiento en mejora sistemática de gobernanza.' },
  ],
  receiptTemplate: {
    hash: 'SHA-256:b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9',
    merkleRoot: 'c1d3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3',
    merkleLabel: 'Árbol Merkle (11 licencias + Seguro + DPC + Certificación AML + Examen)',
    complianceLabel: 'Estado de Licencias',
    complianceValue: 'SEGURO RESTAURADO — 11 LICENCIAS VERIFICADAS',
    complianceThreshold: 'Reglamento de Agentes FIFA 2023 — todas las jurisdicciones',
    agents: ['Agente FIFA', 'Agente Legal', 'Agente de Transferencias', 'Agente de Integridad'],
    dissents: 1,
    dissentResolved: true,
    guaranteeTitle: 'Grupo Figer — Evidencia de Licenciamiento Multi-Federación Sellada',
    guaranteeBody: 'Este paquete sella cumplimiento de licencias en 11 jurisdicciones: verificación de seguro, DPC, certificación AML, registro de examen y calendario automatizado.',
    evidenceChain: 'Emergencia de seguro → Restauración SAFF → AML RFEF → DPC FA → Examen FIFA → Calendario → Revisión retroactiva → Sellado → ML-DSA-65',
  },
  idleTitle: 'Listo para Deliberar',
  idleDesc: '4 agentes IA auditarán licencias en 11 jurisdicciones — verificando seguro, DPC, certificaciones y exámenes.',
  phaseLabels: ['Auditoría y Detección de Brechas', 'Evaluación de Riesgo y Debate', 'Remediación y Sellado'],
};

// =============================================================================
// SCENARIO 8 — SOLIDARIDAD Y COMPENSACIÓN POR FORMACIÓN
// =============================================================================

const S8: TemplateScenario = {
  id: 'training-compensation',
  title: 'Solidaridad y Compensación por Formación — Ruta de Escolinhas',
  subtitle: 'FIFA RSTP Artículos 20-21 · 6 clubes formadores · Edad 12-23 · R$4.8M en reclamos',
  banner: 'Un cliente de Figer se transfiere de un club de Série A a la Bundesliga por €18M. Bajo los Artículos 20-21 del RSTP FIFA, cada club que formó al jugador entre 12 y 23 años tiene derecho a compensación. El jugador pasó por 3 escolinhas brasileñas, 2 clubes de Série B y el club actual. Rastrear esta historia en el sistema fragmentado de fútbol juvenil brasileño es uno de los mayores desafíos de cumplimiento del fútbol mundial.',
  risk: 'Alto',
  scenarioNum: 'Formación',
  icon: 'trending-up',
  color: 'text-cyan-400',
  agents: [A.transferAgent, A.financialAgent, A.legalAgent, A.fifaCompliance],
  connectors: [
    { name: 'Sistema BID CBF', status: 'connected', type: 'Registro de Jugadores', icon: 'database', detail: 'Historial: 6 clubes desde los 12 — registros BID fragmentados' },
    { name: 'Portal FIFA TMS', status: 'connected', type: 'Sistema de Coincidencia de Transferencias', icon: 'shield', detail: 'Transferencia internacional €18M — mecanismo de solidaridad activado' },
    { name: 'Sistema DFB', status: 'syncing', type: 'FA Alemana', icon: 'globe', detail: 'Registro pendiente — ventana de reclamos abierta' },
    { name: 'Registro de Clubes Brasileños', status: 'connected', type: 'Escolinhas y Clubes Juveniles', icon: 'search', detail: '3 escolinhas — 1 disuelta, 1 fusionada, 1 activa' },
  ],
  script: [
    { agentId: 'transfer', phase: 'phase1', type: 'warning', delay: 800, content: 'ALERTA DE SOLIDARIDAD Y COMPENSACIÓN POR FORMACIÓN. Transferencia internacional por €18M activa RSTP FIFA: (1) MECANISMO DE SOLIDARIDAD (Artículo 21) — 5% de €18M (€900K) distribuido a clubes formadores proporcionalmente por años de formación entre 12-23. Historial BID CBF: Edad 12-14: Escolinha Futebol Arte (São Paulo) — DISUELTA en 2022. Edad 14-16: Escolinha Craque do Futuro — FUSIONADA en 2023. Edad 16-18: EC Juventude (Série B) — activo. Edad 18-19: Guarani FC (Série B) — activo. Edad 19-23: Club actual Série A — activo. Las escolinhas disuelta y fusionada crean un problema documental — ¿quién recibe su parte de los €900K?' },
    { agentId: 'financial', phase: 'phase1', type: 'analysis', delay: 2500, content: 'Cálculo de pagos de solidaridad. €900K total: Escolinha Futebol Arte (12-14, 2 años): Categoría IV, €54K (6%). Escolinha Craque do Futuro (14-16, 2 años): Categoría IV, €54K (6%). EC Juventude (16-18, 2 años): Categoría III, €72K (8%). Guarani FC (18-19, 1 año): Categoría III, €36K (4%). Club Série A actual (19-23, 4 años): Categoría I, €684K (76%). Problema: €54K para una entidad disuelta y €54K para una fusionada. Los registros BID de CBF no rastrean consistentemente entidades sucesoras de clubes juveniles.' },
    { agentId: 'legal', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISENSO REGISTRADO. La escolinha disuelta crea un vacío legal. Bajo el Código Civil brasileño (Lei 10.406/02), los activos residuales van a una entidad con propósitos similares — pero las escolinhas raramente siguen procedimientos formales de disolución. CAS 2021/A/7892 estableció que el club comprador asume el riesgo de pagar a la entidad incorrecta. Figer debe obtener: (1) Registros de disolución de la Junta Comercial de São Paulo, (2) Registro CBF confirmando entidad sobreviviente de la fusión. Sin estos documentos, el club de la Bundesliga debe custodiar los €108K hasta confirmar sucesores.' },
    { agentId: 'fifa', phase: 'phase2', type: 'flag', delay: 2000, content: 'ALERTA ELEVADA. El registro DFB no puede completarse hasta resolver obligaciones de solidaridad. La Circular FIFA 1709 requiere reconocimiento al registrar en TMS. Además, el club actual de Série A puede disputar la asignación — si reclaman formación desde los 18 (no 19), su parte aumenta. Los registros BID muestran registro a los 19 pero el club puede presentar evidencia de formación informal anterior.' },
    { agentId: 'transfer', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proponiendo Paquete de Resolución Datacendia: (1) Escolinha disuelta — buscar registros de Junta Comercial. Sin sucesor, los €54K se distribuyen proporcionalmente según Circular 1709. (2) Escolinha fusionada — consulta BID CBF para confirmar entidad sobreviviente. (3) Disputa de edad del club Série A — la fecha BID controla. (4) Custodia de €108K para permitir registro TMS. (5) Calendario de pagos de solidaridad para 6 clubes. Todo sellado criptográficamente.' },
    { agentId: 'legal', phase: 'phase3', type: 'resolution', delay: 2500, content: 'La custodia permite que el registro TMS proceda protegiendo al club de doble pago. CAS ha validado custodias en disputas de solidaridad (CAS 2023/A/9456). La Junta Comercial resolverá en 10-15 días. La fecha BID controla la disputa de edad. Disenso RETIRADO. Este paquete resuelve un desafío únicamente brasileño.' },
  ],
  receiptTemplate: {
    hash: 'SHA-256:c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0',
    merkleRoot: 'd3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5',
    merkleLabel: 'Árbol Merkle (6 clubes + Cálculo + Búsqueda club disuelto + Custodia + Verificación BID)',
    complianceLabel: 'Estado de Solidaridad',
    complianceValue: 'CUSTODIA ESTABLECIDA — REGISTRO TMS PROCEDIENDO',
    complianceThreshold: 'FIFA RSTP Artículos 20-21 cumplidos',
    agents: ['Agente de Transferencias', 'Agente Financiero', 'Agente Legal', 'Agente FIFA'],
    dissents: 1,
    dissentResolved: true,
    guaranteeTitle: 'Grupo Figer — Evidencia de Solidaridad y Compensación Sellada',
    guaranteeBody: 'Este paquete sella cumplimiento del mecanismo de solidaridad: historial de 6 clubes, cálculo proporcional, resolución de escolinhas, custodia y verificación BID CBF.',
    evidenceChain: 'Rastreo BID → 6 clubes → Cálculo → Búsqueda club disuelto → Confirmación fusión → Custodia → Registro TMS → Sellado → ML-DSA-65',
  },
  idleTitle: 'Listo para Deliberar',
  idleDesc: '4 agentes IA rastrearán el historial de formación del jugador — calculando pagos de solidaridad, resolviendo clubes disueltos y gestionando custodia.',
  phaseLabels: ['Historial y Cálculo', 'Resolución de Clubes y Disputas', 'Custodia y Registro TMS'],
};

// =============================================================================
// SCENARIO 9 — TOPE SALARIAL LALIGA
// =============================================================================

const S9: TemplateScenario = {
  id: 'laliga-salary-cap',
  title: 'Tope Salarial LaLiga — Evaluación de Viabilidad',
  subtitle: 'LaLiga LCFP · Club al 95% del tope · Demanda de €8M · Plazo de registro',
  banner: 'Figer negocia la transferencia de un internacional brasileño a LaLiga. El jugador demanda €8M/año bruto. La LCFP de LaLiga impone topes salariales estrictos — a diferencia de otras ligas. El club ya está al 95% de su tope. Si el acuerdo se estructura incorrectamente, LaLiga rechazará el registro.',
  risk: 'Alto',
  scenarioNum: 'LaLiga',
  icon: 'trending-up',
  color: 'text-amber-400',
  agents: [A.financialAgent, A.transferAgent, A.legalAgent, A.fifaCompliance],
  connectors: [
    { name: 'Portal LCFP LaLiga', status: 'connected', type: 'Gestión de Tope Salarial', icon: 'banknote', detail: 'Club al 95% de €120M — €6M disponibles' },
    { name: 'Sistema RFEF', status: 'connected', type: 'FA Española', icon: 'database', detail: 'Plazo de registro: 31 agosto 2026' },
    { name: 'Sistema CBF', status: 'connected', type: 'Salida FA Brasileña', icon: 'globe', detail: 'ITC pendiente — procesamiento CBF 5-7 días' },
    { name: 'Modelado de Contratos Figer', status: 'connected', type: 'Motor de Estructura Salarial', icon: 'trending-up', detail: 'Jugador demanda €8M bruto — €2M sobre disponible' },
  ],
  script: [
    { agentId: 'financial', phase: 'phase1', type: 'warning', delay: 800, content: 'CRISIS DE TOPE SALARIAL LALIGA. Posición LCFP del club: Tope total €120M. Compromisos actuales €114M (95%). Margen disponible: €6M. Demanda del jugador: €8M bruto/año. DÉFICIT: €2M. La LCFP es un TOPE DURO — no una guía. Si el club excede su tope, LaLiga rechazará el registro. A diferencia de Premier League o Bundesliga, no hay mecanismo de "cumplir o explicar." Opciones: (1) Club vende o presta jugador para liberar espacio — ventana cierra en 14 días. (2) Jugador acepta €6M (reducción del 25%). (3) Estructuración creativa — imagen separada, bonificaciones variables.' },
    { agentId: 'transfer', phase: 'phase1', type: 'analysis', delay: 2500, content: 'Análisis de estructura contractual. LCFP cuenta: (a) Salario fijo — completo contra tope, (b) Bonificaciones — valor "esperado" (50-70%), (c) Derechos de imagen — EXCLUIDOS si pagados por entidad separada y limitados al 15%, (d) Prima de fichaje — amortizada. Estructura propuesta: Fijo: €5M. Imagen: €1.5M por sociedad civil (excluido, dentro del 15%). Bonificaciones: €3M máximo, LCFP cuenta 60% = €1.8M. Valor total: €8.5M. Impacto LCFP: €6.8M. Aún €800K sobre margen. El club DEBE liberar €800K con una salida.' },
    { agentId: 'legal', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISENSO REGISTRADO. La exclusión del 15% de imagen está siendo agresivamente cuestionada por LaLiga. En 2025, LaLiga desafió 12 estructuras de imagen. Si LaLiga reclasifica los €1.5M como salario, el impacto salta de €6.8M a €8.3M — catastróficamente sobre el tope. El jugador debe tener valor comercial demostrable. Además, la amortización de prima de fichaje asume contrato de 4 años — salida anticipada acelera el impacto.' },
    { agentId: 'fifa', phase: 'phase2', type: 'flag', delay: 2000, content: 'ALERTA ELEVADA. El procesamiento ITC de CBF toma 5-7 días. El plazo de registro es 31 de agosto — 14 días. ITC tardío significa que el jugador no puede jugar hasta enero 2027. Además, el Reglamento de Agentes FIFA requiere divulgación del honorario de Figer para evaluación LCFP.' },
    { agentId: 'financial', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proponiendo Paquete de Viabilidad LaLiga Datacendia: (1) Estructura: €5M fijo + €1.5M imagen + €3M bonificaciones. LCFP: €6.8M. (2) Evidencia de imagen — valoración comercial del jugador. (3) Club libera Jugador Y (€900K) para espacio. (4) Expedición ITC CBF. (5) Honorario Figer pagado por club vendedor para minimizar impacto LCFP. (6) Prima: €2M amortizada en 4 años = €500K/año. Total LCFP: €7.3M. Con salida Jugador Y (€900K): neto €6.4M contra €6.9M disponible. VIABLE. Todo sellado.' },
    { agentId: 'legal', phase: 'phase3', type: 'resolution', delay: 2500, content: 'La estructura funciona si: (a) Jugador Y sale antes del plazo, (b) evidencia de imagen soporta €1.5M, (c) ITC CBF llega antes del 28 de agosto. El modelado simultáneo de salida/llegada es crítico — LaLiga evalúa al momento del registro. Pago de honorario por club vendedor es práctica estándar. Disenso RETIRADO. Estructura viable — ajustada pero defendible.' },
  ],
  receiptTemplate: {
    hash: 'SHA-256:d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1',
    merkleRoot: 'e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7',
    merkleLabel: 'Árbol Merkle (Cálculo LCFP + Estructura + Valoración imagen + ITC + Modelado de espacio)',
    complianceLabel: 'Estado LCFP LaLiga',
    complianceValue: 'ESTRUCTURA VIABLE — €6.4M vs €6.9M',
    complianceThreshold: 'Tope duro LCFP cumplido',
    agents: ['Agente Financiero', 'Agente de Transferencias', 'Agente Legal', 'Agente FIFA'],
    dissents: 1,
    dissentResolved: true,
    guaranteeTitle: 'Grupo Figer — Evidencia de Tope Salarial LaLiga Sellada',
    guaranteeBody: 'Este paquete sella cumplimiento LCFP: modelado contractual, valoración de imagen, simulación de espacio, ITC CBF y estructura de honorarios.',
    evidenceChain: 'Evaluación LCFP → Modelado → Valoración imagen → Salida → ITC CBF → Honorarios → Registro → Sellado → ML-DSA-65',
  },
  idleTitle: 'Listo para Deliberar',
  idleDesc: '4 agentes IA evaluarán viabilidad de tope salarial LaLiga — modelando contratos, exclusiones de imagen y plazos de registro.',
  phaseLabels: ['Análisis de Tope y Contrato', 'Imagen y Riesgo', 'Confirmación y Sellado'],
};

// =============================================================================
// SCENARIO 10 — LEI PELÉ vs FIFA RSTP
// =============================================================================

const S10: TemplateScenario = {
  id: 'lei-pele-rstp',
  title: 'Lei Pelé vs FIFA RSTP — Disputa de Terminación Unilateral',
  subtitle: 'Jugador invoca Lei Pelé · Club reclama RSTP · Batalla jurisdiccional CAS · €6M de compensación',
  banner: 'Un cliente de Figer quiere dejar su club brasileño por una oferta europea. Bajo Lei Pelé, los jugadores pueden terminar contratos con compensación limitada. Bajo FIFA RSTP Artículo 17, la compensación es ilimitada. El club invoca RSTP; el jugador invoca Lei Pelé. Este conflicto jurisdiccional es el tema más litigado del derecho futbolístico brasileño.',
  risk: 'Crítico',
  scenarioNum: 'Lei Pelé',
  icon: 'gavel',
  color: 'text-rose-400',
  agents: [A.legalAgent, A.casArbitration, A.transferAgent, A.financialAgent],
  connectors: [
    { name: 'Departamento Legal CBF', status: 'connected', type: 'FA Brasileña', icon: 'scale', detail: 'Contrato registrado — 3 años restantes de contrato de 5' },
    { name: 'Tribunal Laboral (TRT)', status: 'syncing', type: 'Justiça do Trabalho', icon: 'gavel', detail: 'Lei Pelé Art. 28 — "cláusula penal"' },
    { name: 'FIFA DRC', status: 'connected', type: 'Cámara de Resolución de Disputas', icon: 'shield', detail: 'Club presentó reclamo RSTP Art. 17 — €6M' },
    { name: 'Registro CAS', status: 'ready', type: 'Tribunal Arbitral del Deporte', icon: 'gavel', detail: 'Jurisdicción de apelación — ¿CAS o tribunal laboral?' },
  ],
  script: [
    { agentId: 'legal', phase: 'phase1', type: 'warning', delay: 800, content: 'CONFLICTO LEI PELÉ vs FIFA RSTP. Contrato de 5 años desde enero 2024. Ahora tiene 2 años y 3 meses — dentro del "período protegido" FIFA. El jugador quiere aceptar oferta de la Bundesliga. LEI PELÉ: Artículo 28 — la "cláusula penal" fija compensación: R$25M (≈€4.2M). El jugador puede terminar después del primer año pagando la cláusula. LEGAL bajo ley brasileña. FIFA RSTP: Artículo 17 — terminación durante período protegido con compensación basada en "especificidad del deporte" — puede exceder la cláusula. El club demanda €6M. ¿Qué jurisdicción prevalece — FIFA DRC o Tribunal Laboral brasileño?' },
    { agentId: 'cas', phase: 'phase1', type: 'analysis', delay: 2500, content: 'ANÁLISIS JURISDICCIONAL CAS. El tema más litigado en fútbol sudamericano. CAS 2020/A/7156 — CAS decidió que RSTP aplica a transferencias internacionales incluso cuando el contrato doméstico se rige por ley brasileña. El reclamo de €6M es procedimentalmente válido. Sin embargo, CAS 2022/A/8234 introdujo matiz: donde la ley laboral brasileña provee protecciones específicas (cláusula penal), CAS debe considerar las "expectativas legítimas" del jugador. La posición emergente: la compensación RSTP Art. 17 no debe "exceder sustancialmente" la cláusula penal. Esto sugiere compensación más cerca de €4.2M que €6M — pero no es certero.' },
    { agentId: 'transfer', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISENSO REGISTRADO. El club de la Bundesliga no firmará si hay disputa pendiente — serían corresponsables bajo RSTP Art. 17(2) como "club inductor." Invocar terminación unilateral Lei Pelé sin acuerdo del club alemán es un callejón sin salida. Figer debe negociar una resolución comercial — la vía legal destruye el acuerdo.' },
    { agentId: 'financial', phase: 'phase2', type: 'flag', delay: 2000, content: 'ALERTA ELEVADA. Modelado financiero. Club brasileño: €6M (RSTP Art. 17). Figer/jugador: €4.2M (cláusula penal). CAS probable: €4.5-5.5M. Presupuesto del club alemán: €12M total. Si Figer negocia transferencia consensual a €5M: el club alemán ahorra €7M, el club brasileño obtiene más que la cláusula, el jugador evita 12-18 meses de disputa. Además, bajo Lei Pelé Art. 29, clubes formadores tienen derechos de solidaridad — el club brasileño puede tener obligaciones propias pendientes. Esto crea una palanca de contrademanda.' },
    { agentId: 'legal', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proponiendo Estrategia de Resolución Datacendia: (1) NO invocar terminación unilateral Lei Pelé — mata el acuerdo. (2) Negociar transferencia consensual usando cláusula penal como PISO y RSTP Art. 17 como TECHO. Objetivo: €5M. (3) Presentar tendencia CAS al club brasileño — €5M negociado es mejor que €4.5M después de 18 meses de litigio. (4) Usar contrademanda de solidaridad como palanca. (5) Estructurar como fee de transferencia (no compensación por terminación) — permite honorario estándar de agente. (6) Documentación sellada como seguro si la negociación falla. Todo con marca temporal criptográfica.' },
    { agentId: 'cas', phase: 'phase3', type: 'resolution', delay: 2500, content: 'La estrategia de negociación comercial es correcta. CAS tarda 12-18 meses, cuesta €50-100K y crea incertidumbre. €5M consensual beneficia a todos: el club brasileño supera la cláusula penal, el club alemán está bajo presupuesto, el jugador evita disputa. La contrademanda de solidaridad es palanca genuina. El paquete Datacendia sirve como seguro. Disenso RETIRADO. Esto transforma una batalla jurisdiccional en un acuerdo comercial.' },
  ],
  receiptTemplate: {
    hash: 'SHA-256:e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2',
    merkleRoot: 'f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9',
    merkleLabel: 'Árbol Merkle (Lei Pelé + RSTP Art. 17 + Jurisprudencia CAS + Modelado + Contrademanda solidaridad)',
    complianceLabel: 'Estado de Resolución de Disputas',
    complianceValue: 'TRANSFERENCIA CONSENSUAL — €5M',
    complianceThreshold: 'Lei Pelé + FIFA RSTP reconciliados',
    agents: ['Agente Legal', 'Agente CAS', 'Agente de Transferencias', 'Agente Financiero'],
    dissents: 1,
    dissentResolved: true,
    guaranteeTitle: 'Grupo Figer — Evidencia de Resolución Lei Pelé vs FIFA RSTP Sellada',
    guaranteeBody: 'Este paquete sella evidencia de resolución: análisis Lei Pelé, evaluación RSTP Art. 17, tendencia CAS, modelado financiero, documentación de contrademanda de solidaridad y acuerdo de transferencia consensual.',
    evidenceChain: 'Análisis Lei Pelé → RSTP Art. 17 → Precedentes CAS → Modelado → Contrademanda → Negociación → Transferencia → Sellado → ML-DSA-65',
  },
  idleTitle: 'Listo para Deliberar',
  idleDesc: '4 agentes IA navegarán el conflicto Lei Pelé vs FIFA RSTP — modelando resultados CAS, estructurando negociación y sellando evidencia.',
  phaseLabels: ['Análisis Jurisdiccional', 'Estrategia de Negociación', 'Resolución y Sellado'],

        complianceScore: 91,
        timelineEvents: [
      {
            "timestamp": "2026-04-01T12:18:01.158Z",
            "type": "analysis",
            "title": "System Assessment - Doble Representación — Transferencia a la Premier League",
            "description": "Data protection, cybersecurity, IP rights, platform governance: System Assessment analysis for Grupo Figer Es completed with industry-specific compliance checks",
            "agent": "Tech Agent",
            "impact": "high"
      },
      {
            "timestamp": "2026-04-01T12:19:01.158Z",
            "type": "warning",
            "title": "Privacy Compliance - Doble Representación — Transferencia a la Premier League",
            "description": "Data protection, cybersecurity, IP rights, platform governance: Privacy Compliance analysis for Grupo Figer Es completed with industry-specific compliance checks",
            "agent": "Privacy Agent",
            "impact": "high"
      },
      {
            "timestamp": "2026-04-01T12:20:01.158Z",
            "type": "dissent",
            "title": "Security Risk - Doble Representación — Transferencia a la Premier League",
            "description": "Data protection, cybersecurity, IP rights, platform governance: Security Risk analysis for Grupo Figer Es completed with industry-specific compliance checks",
            "agent": "Security Agent",
            "impact": "medium"
      },
      {
            "timestamp": "2026-04-01T12:21:01.158Z",
            "type": "proposal",
            "title": "Governance Framework - Doble Representación — Transferencia a la Premier League",
            "description": "Data protection, cybersecurity, IP rights, platform governance: Governance Framework analysis for Grupo Figer Es completed with industry-specific compliance checks",
            "agent": "Platform Agent",
            "impact": "high"
      },
      {
            "timestamp": "2026-04-01T12:22:01.158Z",
            "type": "resolution",
            "title": "Compliance Certified - Doble Representación — Transferencia a la Premier League",
            "description": "Data protection, cybersecurity, IP rights, platform governance: Compliance Certified analysis for Grupo Figer Es completed with industry-specific compliance checks",
            "agent": "Audit Agent",
            "impact": "high"
      }
]};

export const ES_SCENARIOS: TemplateScenario[] = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10];
