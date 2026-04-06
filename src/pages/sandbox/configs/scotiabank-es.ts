/**
 * Scotiabank Perú — Escenarios en Español
 * @module pages/sandbox/configs/scotiabank-es
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import type { TemplateScenario } from '../SandboxTemplate';

const ag = (id: string, n: string, r: string, i: string, c: string, bc: string) => ({ id, name: n, role: r, icon: i, color: c, borderColor: `border-${bc}/40`, bgColor: `bg-${bc}/10` });
const cn = (n: string, s: 'connected' | 'syncing' | 'ready', t: string, i: string, d: string) => ({ name: n, status: s, type: t, icon: i, detail: d });
const ln = (a: string, p: 'phase1' | 'phase2' | 'phase3', t: 'analysis' | 'warning' | 'dissent' | 'flag' | 'proposal' | 'resolution' | 'withdrawal', dl: number, c: string) => ({ agentId: a, phase: p, type: t, delay: dl, content: c });
const rc = (h: string, mr: string, ml: string, cl: string, cv: string, ags: string[], gt: string, gb: string, ec: string) => ({
  hash: `0x7f3a...${h}`, merkleRoot: mr, merkleLabel: 'Raíz Merkle', complianceLabel: ml,
  complianceValue: cl, complianceThreshold: cv, agents: ags, dissents: 1, dissentResolved: true,
  guaranteeTitle: gt, guaranteeBody: gb, evidenceChain: ec,
});

export const ES_SCENARIOS: TemplateScenario[] = [

  // 1 — DIRECTORIO/CEO
  {
    id: 'board-ceo-governance', title: 'Directorio & CEO — Gobernanza Estratégica de IA',
    subtitle: 'SBS · Riesgo de modelos · Apetito por riesgo del Directorio · BCRP · Toronto',
    banner: 'El Directorio aprueba S/. 180M en IA sin marco de gobernanza. Toronto exige gobernanza empresarial. SBS descubre 47 modelos sin supervisión.',
    risk: 'Crítico', scenarioNum: '01', icon: 'landmark', color: 'text-red-400',
    agents: [ag('board-ceo','Agente Directorio/CEO','Estrategia','🏛️','text-red-400','red-500'), ag('cro-strat','Agente CRO','Riesgo de Modelos','📊','text-amber-400','amber-500'), ag('sbs-gov','Agente SBS','Supervisión','⚖️','text-blue-400','blue-500'), ag('toronto','Agente Toronto','Gobernanza Global','🌍','text-emerald-400','emerald-500')],
    connectors: [cn('Portal SBS','connected','Regulador','shield','Res. SBS 272-2017 — gestión riesgo operacional'), cn('Toronto HQ','connected','Gobernanza Global','globe','Mandato gobernanza IA — T4 2025'), cn('Registro Modelos','connected','Inventario','database','47 modelos IA — 0 gobernados'), cn('Riesgo Modelo','syncing','Validación','alert-triangle','SR 11-7 + SBS riesgo modelo')],
    script: [
      ln('board-ceo','phase1','analysis',800,'GOBERNANZA IA DEL DIRECTORIO. Scotiabank Perú: S/. 42MM activos, 3.8M clientes, 284 sucursales. Presupuesto IA: S/. 180M. Modelos desplegados: 47. Modelos con gobernanza: CERO. SBS Res. 272-2017 requiere gestión de riesgo operacional incluyendo sistemas automatizados. Toronto mandato: gobernanza empresarial para Q4 2025. Perú no tiene inventario, registros ni rastro de auditoría.'),
      ln('sbs-gov','phase1','warning',2500,'SBS. Resolución 272-2017: gestión integral de riesgos. Circular SBS 2024: uso responsable de IA. Inspección SBS: "¿Cuántos modelos operan? ¿Quién los aprobó? ¿Dónde están los registros?" Scotiabank: no puede responder. Hallazgo: controles inadecuados. Sanciones: multas, restricciones, condiciones de licencia.'),
      ln('toronto','phase2','dissent',2000,'DISENSO — MANDATO TORONTO. Scotiabank Global requiere gobernanza empresarial de IA. Perú no cumple. Toronto: "Si Perú no implementa para Q4 2025, centralizamos decisiones en Toronto." Perú pierde autonomía local. 284 sucursales gobernadas desde Canadá.'),
      ln('cro-strat','phase2','flag',2500,'ALERTA — RIESGO MODELO. 47 modelos. Crédito: 4 modelos (S/. 8.7MM/año). Fraude: 3 modelos (2.1M txn/día). AML: 2 modelos. Riqueza: 3 modelos (S/. 8.7MM AUM). Trading: 5 modelos ($340M FX diario). NINGÚN modelo tiene registro de decisiones sellado.'),
      ln('board-ceo','phase3','proposal',2000,'PROPUESTA: DATACENDIA MARCO EMPRESARIAL. (1) REGISTRO: 47 modelos con dueño, riesgo, propósito. (2) POR DECISIÓN: cada decisión sellada. (3) MONITOREO: drift, fairness, desempeño. (4) SBS: documentación auto-generada. (5) TORONTO: estándares globales cumplidos localmente. (6) DIRECTORIO: reporte trimestral de accountability.'),
      ln('toronto','phase3','resolution',2500,'DISENSO RETIRADO. Marco empresarial: Perú mantiene autonomía con evidencia sellada. SBS recibe documentación por modelo. 47 modelos gobernados en 90 días. Primer banco en Perú con gobernanza de IA criptográficamente sellada.'),
    ],
    receiptTemplate: rc('b01','Raíz Merkle (47 modelos + Registro empresarial + Resoluciones Directorio)','Gobernanza Empresarial','DIRECTORIO-GOBERNADO','SBS 272-2017 + Toronto — marco empresarial',['Agente Directorio/CEO','Agente CRO','Agente SBS','Agente Toronto'],'Scotiabank Directorio — Gobernanza Empresarial Sellada','47 modelos gobernados. Marco empresarial desplegado. SBS + Toronto compliance.','Resolución → Registro → Evaluación → Despliegue → Monitoreo → Sellado → Ed25519 + RFC 3161'),
    idleTitle: 'Listo para Deliberar', idleDesc: '4 agentes: 47 modelos IA sin gobernanza — inspección SBS inminente.',
    phaseLabels: ['Brecha de Gobernanza & SBS', 'Mandato Toronto & Riesgo Modelos', 'Marco Empresarial de IA'],
  },

  // 2 — CRO: RIESGO DE MODELOS
  {
    id: 'cro-model-risk', title: 'CRO — Riesgo de Modelos de IA & Validación',
    subtitle: 'Validación · SR 11-7 · Sesgo crediticio · SBS · Basilea III',
    banner: 'Modelo de crédito aprueba S/. 2.3MM diarios. Validación descubre penalización a provincias del 23%. SBS investiga.',
    risk: 'Crítico', scenarioNum: '02', icon: 'shield', color: 'text-amber-400',
    agents: [ag('cro','Agente CRO','Riesgo de Modelos','📊','text-amber-400','amber-500'), ag('validation','Agente Validación','Revisión Independiente','🔍','text-blue-400','blue-500'), ag('sbs-model','Agente SBS','Riesgo Modelos','🏛️','text-red-400','red-500'), ag('bias-det','Agente Sesgo','Fairness','⚖️','text-emerald-400','emerald-500')],
    connectors: [cn('Motor Crédito','connected','Decisiones','credit-card','S/. 2.3MM/día — 34K solicitudes'), cn('SBS Modelos','connected','Regulación','shield','Validación modelos'), cn('Inventario','connected','Registro','database','47 modelos — 12 críticos'), cn('Métricas Sesgo','syncing','Fairness','bar-chart','Tasas aprobación por región')],
    script: [
      ln('cro','phase1','analysis',800,'RIESGO MODELOS. Modelo crédito: 34K solicitudes/día. Validación descubre: Lima 68% aprobación, Arequipa 52%, Cusco 45%, Puno 37%, Loreto 31%. MISMO perfil crediticio, diferente tasa. Brecha: hasta 37pp basada solo en geografía. Modelo entrenado con datos Lima-céntricos.'),
      ln('validation','phase1','warning',2500,'VALIDACIÓN. SR 11-7: validación independiente obligatoria. Modelo de crédito: NUNCA validado independientemente. Aprobado por el equipo que lo construyó. SBS requiere validación de modelos crediticios. Hallazgo: validación inadecuada + sesgo geográfico activo. Doble falla regulatoria.'),
      ln('bias-det','phase2','dissent',2000,'DISENSO — INCLUSIÓN. 37pp de brecha = 124,000 peruanos provinciales rechazados injustamente/año. Plan Nacional de Inclusión SBS: expandir acceso. Scotiabank IA contrae acceso. BCP con modelo corregido ganó 18% cuota provincial.'),
      ln('sbs-model','phase2','flag',2500,'ALERTA — SBS. Revisión iniciada. Solicitan: documentación modelo, datos entrenamiento, métricas por región, registro validación, plan remediación. Scotiabank tiene: el modelo. Sin documentación de gobernanza. Plazo: 60 días para remediación o restricción de originación por IA.'),
      ln('cro','phase3','proposal',2000,'PROPUESTA: (1) VALIDACIÓN: 12 modelos críticos con revisión independiente en 90 días. (2) POR MODELO: documentación sellada. (3) SESGO: corrección + monitoreo continuo por región. (4) SBS: evidencia auto-generada. (5) PRE-DESPLIEGUE: ningún modelo nuevo sin validación + fairness.'),
      ln('sbs-model','phase3','resolution',2500,'DISENSO RETIRADO. Brecha 37pp→8pp en 90 días. 124K peruanos provinciales recuperan acceso. SBS recibe evidencia sellada. Toronto desbloquea nuevos modelos. Validación independiente permanente.'),
    ],
    receiptTemplate: rc('c02','Raíz Merkle (47 modelos + Validación + Fairness + SBS)','Riesgo Modelos','MODELO-GOBERNADO','SBS + SR 11-7 — validación por modelo',['Agente CRO','Agente Validación','Agente SBS','Agente Sesgo'],'Scotiabank CRO — Modelos Gobernados y Validados','47 modelos gobernados. 12 críticos validados. Sesgo corregido. SBS compliance.','Modelo → Validación → Fairness → Documentación → SBS → Sellado → Ed25519 + RFC 3161'),
    idleTitle: 'Listo para Deliberar', idleDesc: '4 agentes: modelo crédito penaliza provincias 37pp — SBS investiga.',
    phaseLabels: ['Sesgo del Modelo & Descubrimiento', 'Validación & Inclusión', 'Gobernanza Modelos Empresarial'],
  },

  // 3 — CCO: AML/KYC
  {
    id: 'cco-aml-kyc', title: 'CCO — IA AML/KYC & Gobernanza Anti-Lavado',
    subtitle: 'UIF · SBS anti-lavado · Monitoreo transacciones · PEPs · GAFI',
    banner: 'IA AML monitorea S/. 14MM diarios. 2,400 alertas/día — 94% falsos positivos. 3 redes de lavado pasaron sin detección: S/. 47M.',
    risk: 'Crítico', scenarioNum: '03', icon: 'eye', color: 'text-blue-400',
    agents: [ag('cco','Agente CCO','Compliance AML','🔍','text-blue-400','blue-500'), ag('uif','Agente UIF','Inteligencia Financiera','🏛️','text-red-400','red-500'), ag('pep','Agente PEP','Personas Expuestas','👤','text-amber-400','amber-500'), ag('txn-ai','Agente Monitoreo','Transacciones','📊','text-emerald-400','emerald-500')],
    connectors: [cn('Motor AML','connected','Monitoreo','eye','S/. 14MM/día — 2,400 alertas'), cn('Portal UIF','connected','Reportes','shield','ROS — Reportes Sospechosos'), cn('Base PEP','connected','Screening','users','34K PEPs + OFAC'), cn('Monitoreo','syncing','Transacciones','bar-chart','Tipologías UIF')],
    script: [
      ln('cco','phase1','analysis',800,'AML IA. S/. 14MM txn/día. 2,400 alertas. 28 analistas, 85 alertas/día c/u. 94% falsos positivos. 6% reales: 144 investigaciones/día. PERO: 3 redes lavado operaron 11 meses sin detección. S/. 47M vía 12 empresas fachada. IA focalizó montos grandes, no redes coordinadas de montos pequeños.'),
      ln('uif','phase1','warning',2500,'UIF. 3 redes usaron structuring — transacciones bajo S/. 35K. 12 empresas fachada, 3-5 cuentas c/u. Transacciones S/. 15-28K entre ellas. Patrón claro para humano, invisible para IA. UIF: tipologías no actualizadas. Multa: hasta 150 UIT + supervisión reforzada.'),
      ln('pep','phase2','dissent',2000,'DISENSO — PEPs. Una red involucra familiares de PEP regional (alcalde). IA screening: solo titulares de cuenta. No verifica beneficiarios finales, familiares, socios. PEP screening: nombre directo solamente.'),
      ln('txn-ai','phase2','flag',2500,'ALERTA — DISEÑO IA. Entrenada para: transacciones grandes, países riesgosos, velocidad. NO para: redes coordinadas, relaciones entre entidades, evolución temporal. Las 2,400 alertas son las fáciles. Lavadores sofisticados evaden exactamente lo que IA no monitorea.'),
      ln('cco','phase3','proposal',2000,'PROPUESTA: (1) ANÁLISIS REDES: relaciones entre entidades. (2) TIPOLOGÍAS UIF: actualización continua. (3) PEP PROFUNDO: familiares, socios, UBO. (4) POR ALERTA: sellada con factores y evidencia. (5) UIF: ROS con cadena evidencia. (6) FALSOS POSITIVOS: 94%→70%.'),
      ln('uif','phase3','resolution',2500,'DISENSO RETIRADO. Análisis redes detecta 3 redes en <72h. PEP profundo identifica vínculos. Falsos positivos 94%→70%: analistas liberan 40% tiempo. UIF evidencia sellada. S/. 47M detectado en 11 días, no 11 meses.'),
    ],
    receiptTemplate: rc('c03','Raíz Merkle (S/. 14MM + Redes + PEP profundo + UIF)','AML Compliance','AML-GOBERNADO','UIF + SBS — análisis redes sellado',['Agente CCO','Agente UIF','Agente PEP','Agente Monitoreo'],'Scotiabank CCO — AML Gobernada, Redes Detectadas','S/. 14MM gobernados. 3 redes detectadas. PEP profundo. FP 94%→70%.','Transacción → Red → PEP → Tipología → Alerta → ROS → UIF → Ed25519 + RFC 3161'),
    idleTitle: 'Listo para Deliberar', idleDesc: '4 agentes: S/. 47M lavados mientras IA genera 2,400 alertas — 94% falsos positivos.',
    phaseLabels: ['Falla AML & Redes Ocultas', 'PEP & Diseño IA', 'Gobernanza AML por Red'],
  },

  // 4 — VP RETAIL: CRÉDITO
  {
    id: 'vp-retail-credit', title: 'VP Banca Retail — IA de Decisiones Crediticias',
    subtitle: 'Crédito consumo · Acción adversa · SBS Reglamento · Inclusión · INDECOPI',
    banner: 'IA deniega 3,400 solicitudes diarias sin explicación. Quejas INDECOPI +340%. Provincias denegadas 2-3x más que Lima.',
    risk: 'Alto', scenarioNum: '04', icon: 'credit-card', color: 'text-blue-400',
    agents: [ag('vp-retail','Agente VP Retail','Crédito Consumo','💳','text-blue-400','blue-500'), ag('adverse','Agente Acción Adversa','Denegaciones','📋','text-red-400','red-500'), ag('inclusion','Agente Inclusión','Desatendidos','🌍','text-emerald-400','emerald-500'), ag('cx','Agente CX','Satisfacción','⭐','text-amber-400','amber-500')],
    connectors: [cn('Motor Crédito','connected','Decisiones','credit-card','8,400 aprobaciones + 3,400 denegaciones/día'), cn('SBS Créditos','connected','Regulación','shield','Reglamento de Créditos'), cn('INDECOPI','connected','Consumidor','users','Quejas: +340%'), cn('Datos Inclusión','syncing','Demografía','bar-chart','Tasas por departamento')],
    script: [
      ln('vp-retail','phase1','analysis',800,'IA RETAIL. 11,800 solicitudes/día. Aprueba 8,400, deniega 3,400 (71.2%). 8 segundos vs 3-5 días. IA incrementó otorgamiento 6.4pp = S/. 2.1MM adicional/año. Problema: cada denegación es "no cumple criterios." Sin razones, sin score, sin remediación.'),
      ln('adverse','phase1','warning',2500,'ACCIÓN ADVERSA. SBS: criterios claros, divulgación. INDECOPI: derecho a saber POR QUÉ. 847 quejas en 6 meses. Scotiabank responde "IA: DENEGAR." Exposición: S/. 2.3M multas.'),
      ln('inclusion','phase2','dissent',2000,'DISENSO — EXCLUSIÓN. Lima 24%, Arequipa 31%, Cusco 42%, Loreto 58%, Puno 61%, Rural 67%. IA entrenada Lima-céntrica. Provinciales denegados 2-3x. Contradice Plan Inclusión SBS.'),
      ln('cx','phase2','flag',2500,'ALERTA — DESERCIÓN. Denegados: 87% nunca vuelven, 43% cierran cuentas, 62% comparten negativo. NPS: -67. BCP con razones + remediación captura rechazados Scotiabank.'),
      ln('vp-retail','phase3','proposal',2000,'PROPUESTA: (1) Top 5 factores + remediación por decisión. (2) Tasas geográficas en tiempo real. (3) Cartas SBS/INDECOPI auto-generadas. (4) Sesgo provincial corregido. (5) Journey de aprobación para denegados.'),
      ln('inclusion','phase3','resolution',2500,'DISENSO RETIRADO. Brecha 2-3x→1.2x en 90 días. 340K peruanos adicionales acceden a crédito. INDECOPI -78%. Deserción 87%→34%.'),
    ],
    receiptTemplate: rc('r04','Raíz Merkle (11,800 decisiones + Acción adversa + Fairness)','Gobernanza Crediticia','INCLUSIÓN-GOBERNADA','SBS + INDECOPI — explicación por decisión',['Agente VP Retail','Agente Acción Adversa','Agente Inclusión','Agente CX'],'Scotiabank VP Retail — Crédito Gobernado, Inclusión Primero','11,800 decisiones gobernadas. Denegaciones explicadas. Sesgo corregido. 340K acceden.','Solicitud → Score → Factores → Fairness → Acción Adversa → Remediación → Sellado → Ed25519 + RFC 3161'),
    idleTitle: 'Listo para Deliberar', idleDesc: '4 agentes: 3,400 denegaciones diarias sin explicación.',
    phaseLabels: ['Denegaciones & Quejas', 'Sesgo Geográfico & Exclusión', 'Gobernanza Por Decisión'],
  },

  // 5 — VP CORPORATIVO: FINANCIAMIENTO COMERCIAL
  {
    id: 'vp-corp-trade', title: 'VP Banca Corporativa — IA Financiamiento Comercial',
    subtitle: 'Carta crédito · Sanciones · SUNAT · BCRP · OFAC',
    banner: 'IA aprueba LC $12M para exportador minero. Beneficiario vinculado a entidad sancionada vía propiedad anidada.',
    risk: 'Crítico', scenarioNum: '05', icon: 'building', color: 'text-purple-400',
    agents: [ag('vp-corp','Agente VP Corp','Financiamiento','🏢','text-purple-400','purple-500'), ag('sanctions','Agente Sanciones','OFAC/BCRP','🚫','text-red-400','red-500'), ag('trade-ops','Agente Comercio','LC','📦','text-blue-400','blue-500'), ag('sunat-trade','Agente SUNAT','Aduanas','🏛️','text-amber-400','amber-500')],
    connectors: [cn('IA Comercial','connected','LC','building','$2.3MM — 4,200 LCs/año'), cn('Sanciones','connected','OFAC/BCRP','shield','OFAC SDN + BCRP + PEP'), cn('Grafo Propiedad','connected','UBO','git-branch','Beneficiario final — 3 niveles'), cn('SUNAT','syncing','Exportación','truck','Minería HS 2603/2616')],
    script: [
      ln('vp-corp','phase1','analysis',800,'FALLA COMERCIAL. 4,200 LCs/año, $2.3MM. LC #SC-2024-4847: $12M cobre. IA verifica nombre: LIMPIO. Post-emisión: beneficiario 49% de holding, cuyo 60% es entidad sancionada OFAC. IA verificó Nivel 1. Faltó Nivel 2-3. $12M exposición a sancionada.'),
      ln('sanctions','phase1','warning',2500,'OFAC. Facilitar transacción con sancionada. Multa: hasta $12M. Autodenuncia reduce a $2-4M. Si OFAC sanciona Scotiabank Perú: riesgo para operaciones en dólares de todo el banco. Corresponsal EEUU en riesgo.'),
      ln('trade-ops','phase2','dissent',2000,'DISENSO — ESCALA. 4,200 LCs/año. UBO manual: 2-4h/LC. Se necesitan 34 analistas; hay 12. IA desplegada porque manual no escala. Análisis propiedad era "Fase 2" — nunca se construyó. 11 meses en Fase 1.'),
      ln('sunat-trade','phase2','flag',2500,'ALERTA — CADENA EXPORTADORA. Cobre embarcado. SUNAT lista contraparte. Penalidad OFAC dispara investigación SUNAT de TODAS las exportaciones mineras. Riesgo sistémico para sector minero.'),
      ln('vp-corp','phase3','proposal',2000,'PROPUESTA: (1) UBO hasta 5 niveles. (2) Sanciones profundas: propiedad, directores, relacionados. (3) Sello por LC. (4) Retroactivo: 4,200 LCs. (5) Monitoreo: cambios propiedad re-screening.'),
      ln('sanctions','phase3','resolution',2500,'DISENSO RETIRADO. Análisis propiedad agrega 45min. Auditoría retroactiva: 7 exposiciones adicionales. Autodenuncia OFAC recomendada. Exposición futura prevenida.'),
    ],
    receiptTemplate: rc('c05','Raíz Merkle (4,200 LCs + Propiedad + Sanciones + SUNAT)','Compliance Comercial','SANCIONES-GOBERNADO','OFAC + BCRP + SUNAT — UBO 5 niveles',['Agente VP Corp','Agente Sanciones','Agente Comercio','Agente SUNAT'],'Scotiabank VP Corp — Financiamiento Gobernado','4,200 LCs gobernadas. 7 exposiciones encontradas. OFAC compliance.','LC → Contraparte → Propiedad 5 niv → Sanciones → SUNAT → Sellado → Ed25519 + RFC 3161'),
    idleTitle: 'Listo para Deliberar', idleDesc: '4 agentes: LC $12M aprobada para contraparte vinculada a sancionada.',
    phaseLabels: ['Falla Sanciones & OFAC', 'Brecha Propiedad & Exportación', 'Gobernanza Comercial'],
  },

  // 6 — VP WEALTH: IDONEIDAD
  {
    id: 'vp-wealth-reco', title: 'VP Gestión Patrimonial — IA Idoneidad de Inversión',
    subtitle: 'SMV · Deber fiduciario · Perfil riesgo · Adultos mayores · Idoneidad',
    banner: 'IA recomienda productos alto riesgo a jubilada de 72 años. Portafolio cae 34%. SMV investiga: sin evidencia de idoneidad.',
    risk: 'Crítico', scenarioNum: '06', icon: 'trending-up', color: 'text-emerald-400',
    agents: [ag('vp-wealth','Agente VP Patrimonio','Inversión','📈','text-emerald-400','emerald-500'), ag('smv-suit','Agente SMV','Valores','⚖️','text-red-400','red-500'), ag('client-prot','Agente Protección','Adultos Mayores','🛡️','text-amber-400','amber-500'), ag('portfolio-ai','Agente IA Portafolio','Recomendaciones','🤖','text-blue-400','blue-500')],
    connectors: [cn('IA Patrimonio','connected','Recomendaciones','trending-up','12,400 clientes — IA'), cn('SMV Perú','connected','Valores','shield','Requisitos idoneidad'), cn('Perfiles','connected','KYP','users','Riesgo, edad, ingreso'), cn('Riesgo Producto','syncing','Instrumentos','database','340 productos')],
    script: [
      ln('vp-wealth','phase1','analysis',800,'FALLA PATRIMONIAL. 12,400 clientes, S/. 8.7MM AUM. María Elena Gutiérrez, 72, profesora jubilada, S/. 4,200/mes pensión, S/. 780K ahorros. Perfil: CONSERVADOR. IA: 35% notas estructuradas commodities EM. 6 meses: -34%. Pierde S/. 92,820. Jubilación destruida. IA optimizó rendimiento, no idoneidad.'),
      ln('smv-suit','phase1','warning',2500,'VIOLACIÓN SMV. Recomendaciones deben coincidir con perfil. Jubilada conservadora 72 años en alto riesgo = violación clara. Sin evidencia idoneidad. Penalidad: multa + condiciones licencia patrimonial.'),
      ln('client-prot','phase2','dissent',2000,'DISENSO — SISTÉMICO. 847 clientes 65+ exceden perfil. 2,340 totales con desajuste. IA trata perfil como input (15%) no restricción. Perspectiva mercado (40%) anula perfil conservador. Roto para vulnerables.'),
      ln('portfolio-ai','phase2','flag',2500,'ALERTA — DISEÑO. Objetivo: maximizar rendimiento. Perfil: 15% peso. Mercado: 40%. Histórico: 45%. Commodities alcistas ANULARON perfil conservador. IA vio oportunidad, no vio mujer de 72 años. Idoneidad debe ser RESTRICCIÓN DURA.'),
      ln('vp-wealth','phase3','proposal',2000,'PROPUESTA: (1) GATE idoneidad: restricción dura. (2) PROTECCIÓN 65+: ingreso, liquidez, horizonte. (3) SELLO por recomendación. (4) EVIDENCIA SMV. (5) ALERTAS asesor.'),
      ln('smv-suit','phase3','resolution',2500,'DISENSO RETIRADO. Gate previene todas violaciones. 847 adultos mayores rebalanceados. 2,340 corregidos. Evidencia SMV por recomendación. María Elena: fondo remediación.'),
    ],
    receiptTemplate: rc('w06','Raíz Merkle (12,400 clientes + Idoneidad + SMV)','Idoneidad Inversión','IDONEIDAD-GOBERNADA','SMV — perfil como restricción dura',['Agente VP Patrimonio','Agente SMV','Agente Protección','Agente IA Portafolio'],'Scotiabank VP Patrimonio — Idoneidad Gobernada','12,400 clientes gobernados. 847 mayores rebalanceados. 2,340 corregidos.','Perfil → Riesgo → IA → Gate → Check Mayor → Asesor → Sellado → Ed25519 + RFC 3161'),
    idleTitle: 'Listo para Deliberar', idleDesc: '4 agentes: jubilada 72 años pierde S/. 92K por IA no idónea.',
    phaseLabels: ['Falla Idoneidad & Adulto Mayor', 'Desajuste & Diseño', 'Gobernanza Idoneidad'],
  },

  // 7 — CISO: CIBERSEGURIDAD
  {
    id: 'ciso-cybersec', title: 'CISO — Gobernanza IA Ciberseguridad',
    subtitle: 'SOC IA · Amenazas · SBS Res. 504-2021 · Ransomware · Incidentes',
    banner: 'SOC IA procesa 2.8M eventos/día. Clasifica ransomware como "actualización rutinaria." 847 servidores cifrados. 72h caída.',
    risk: 'Crítico', scenarioNum: '07', icon: 'lock', color: 'text-cyan-400',
    agents: [ag('ciso','Agente CISO','Seguridad','🔒','text-cyan-400','cyan-500'), ag('threat-ai','Agente Amenazas','Detección','🎯','text-red-400','red-500'), ag('sbs-cyber','Agente SBS Ciber','Res. 504-2021','🏛️','text-amber-400','amber-500'), ag('incident','Agente Incidentes','Forense','🚨','text-blue-400','blue-500')],
    connectors: [cn('SOC IA','connected','Amenazas','lock','2.8M eventos/día'), cn('SBS Ciber','connected','Regulación','shield','Res. 504-2021'), cn('SIEM','connected','Logs','database','Correlación tiempo real'), cn('Toronto SOC','syncing','Global','globe','Seguridad Global')],
    script: [
      ln('ciso','phase1','warning',800,'FALLA SOC. 2.8M eventos/día. Martes 2:47 AM: payload cifrado vía VPN proveedor. IA: "actualización — BENIGNO." Era LockBit 3.0. 4:12 AM: 847 servidores cifrados. Core banking offline. ATMs caídos. 72h caída. $8.4M + $34M impacto. Confianza IA: 94%. Sin gobernanza para escalar.'),
      ln('threat-ai','phase1','analysis',2500,'FORENSE. Clasificó benigno: (1) IP proveedor confiable (2) firma coincide actualizaciones (3) timing coincide ventana. Atacantes craftearon payload adversarial. 94% confianza. Sin rastro de qué consideró la IA.'),
      ln('sbs-cyber','phase2','dissent',2000,'DISENSO — SBS 504-2021 Art. 8: gestión ciberseguridad con IA documentada. Art. 12: notificación 2h. Art. 15: post-incidente con análisis IA. SBS exige: log clasificación, por qué benigno, supervisión humana. Scotiabank tiene: "BENIGNO." Nada más.'),
      ln('incident','phase2','flag',2500,'ALERTA — TORONTO. Post-mortem: "Perú dependió de IA sin gobernanza. Estándar global: IA + humano para eventos externos. Perú no implementó." Toronto: gobernanza SOC en 60 días o operaciones manuales.'),
      ln('ciso','phase3','proposal',2000,'PROPUESTA: (1) Score confianza + factores por evento. (2) <97% externos = escalación humana. (3) Testing adversarial continuo. (4) Evidencia SBS 504-2021. (5) Rastro forense completo.'),
      ln('sbs-cyber','phase3','resolution',2500,'DISENSO RETIRADO. Gobernanza habría escalado: 94% VPN 2:47AM = bajo umbral. Humano: 15 min para identificar. Ataque contenido. $42M prevenidos. SBS + Toronto satisfechos.'),
    ],
    receiptTemplate: rc('c07','Raíz Merkle (2.8M eventos + Clasificación + Confianza + SBS)','Ciberseguridad','SOC-GOBERNADO','SBS 504-2021 — evidencia por evento',['Agente CISO','Agente Amenazas','Agente SBS Ciber','Agente Incidentes'],'Scotiabank CISO — SOC Gobernado','2.8M eventos gobernados. Umbrales confianza. $42M prevenidos.','Evento → Clasificación → Confianza → Umbral → Escalación → Sellado → Ed25519 + RFC 3161'),
    idleTitle: 'Listo para Deliberar', idleDesc: '4 agentes: ransomware clasificado "rutinario" causa 72h de caída.',
    phaseLabels: ['Ransomware & Forense', 'SBS & Mandato Global', 'Gobernanza SOC'],
  },

  // 8 — JEFE RRHH: CONTRATACIÓN
  {
    id: 'hr-hiring-ai', title: 'Jefe RRHH — IA Contratación & Sesgo',
    subtitle: 'CV screening · Género · Ley 30709 · Edad · SUNAFIL',
    banner: 'IA filtra 34K CVs/año. Rechaza 73% mujeres tech vs 41% hombres. Apellidos indígenas 1.7x rechazo. SUNAFIL investiga.',
    risk: 'Alto', scenarioNum: '08', icon: 'users', color: 'text-pink-400',
    agents: [ag('hr-head','Agente RRHH','Talento','👥','text-pink-400','pink-500'), ag('sunafil','Agente SUNAFIL','Inspección','⚖️','text-red-400','red-500'), ag('dei','Agente DEI','Diversidad','🌍','text-emerald-400','emerald-500'), ag('screen-ai','Agente IA Screening','CVs','🤖','text-blue-400','blue-500')],
    connectors: [cn('IA Screening','connected','Reclutamiento','users','34K CVs/año — NLP'), cn('SUNAFIL','connected','Laboral','shield','Ley 30709'), cn('Datos Contratación','connected','Analítica','bar-chart','Género, edad, universidad'), cn('Toronto RRHH','syncing','DEI','globe','Estándares DEI')],
    script: [
      ln('hr-head','phase1','analysis',800,'IA RRHH. 34K CVs/año, 420 posiciones. Rechazo 65%. Tech: mujeres 73%, hombres 41%. Mismas calificaciones. >45 años: 81%. <35: 38%. IA entrenada 10 años datos — equipo 84% masculino, edad promedio 32.'),
      ln('sunafil','phase1','warning',2500,'SUNAFIL. Ley 30709: prohíbe discriminación género. DS 002-2018-TR. Hallazgo: desventaja sistemática para mujeres. Multa: 52.53 UIT/infracción. 34K × 2 años = S/. 8-15M exposición.'),
      ln('dei','phase2','dissent',2000,'DISENSO — NO SOLO GÉNERO. Universidad: top 3 Lima 4.2x vs provincial. Apellidos quechua/aymara 0.6x. San Isidro 2.1x vs Comas. IA codifica cada sesgo socioeconómico del Perú. DEI Toronto violado por IA aprobada por Toronto.'),
      ln('screen-ai','phase2','flag',2500,'ALERTA — DISEÑO. Entrenada con contrataciones históricas (84% hombres) + evaluaciones ("encaje cultural" = similitud). IA aprendió "éxito = empleados actuales." No es bug — gobernanza ausente.'),
      ln('hr-head','phase3','proposal',2000,'PROPUESTA: (1) SCREENING CIEGO: sin género, edad, nombre, dirección, foto, universidad. (2) MONITOREO sesgo en tiempo real. (3) SELLO por decisión. (4) EVIDENCIA SUNAFIL. (5) DEI Toronto.'),
      ln('sunafil','phase3','resolution',2500,'DISENSO RETIRADO. Screening ciego elimina brecha en 2 ciclos. Sesgo universidad y nombre corregidos. Evidencia SUNAFIL. DEI por gobernanza, no cuotas.'),
    ],
    receiptTemplate: rc('h08','Raíz Merkle (34K CVs + Screening ciego + SUNAFIL)','Compliance RRHH','SESGO-GOBERNADO','Ley 30709 — screening ciego',['Agente RRHH','Agente SUNAFIL','Agente DEI','Agente IA Screening'],'Scotiabank RRHH — Contratación Libre de Sesgo','34K CVs gobernados. Brecha género eliminada. SUNAFIL compliant.','CV → Ciego → Score → Sesgo → Decisión → SUNAFIL → Ed25519 + RFC 3161'),
    idleTitle: 'Listo para Deliberar', idleDesc: '4 agentes: 73% rechazo mujeres tech por datos sesgados.',
    phaseLabels: ['Sesgo Género & Edad', 'Discriminación Sistémica & DEI', 'Screening Ciego'],
  },

  // 9 — JEFE OPS: AUTOMATIZACIÓN
  {
    id: 'ops-rpa-ai', title: 'Jefe Operaciones — IA Automatización Procesos',
    subtitle: 'RPA · Hipotecas · Errores · SBS riesgo operacional · Impacto cliente',
    banner: 'IA automatiza 89% back-office. Error de redondeo procesa 12,400 hipotecas mal por 6 semanas. S/. 2.01M sobrecobro.',
    risk: 'Alto', scenarioNum: '09', icon: 'settings', color: 'text-orange-400',
    agents: [ag('ops-head','Agente Ops','Procesos','⚙️','text-orange-400','orange-500'), ag('quality','Agente Calidad','Errores','✅','text-emerald-400','emerald-500'), ag('sbs-ops','Agente SBS Ops','Riesgo Op','🏛️','text-red-400','red-500'), ag('customer','Agente Cliente','Remediación','👤','text-blue-400','blue-500')],
    connectors: [cn('IA Procesos','connected','Automatización','settings','89% — 2.4M txn/mes'), cn('SBS OpRisk','connected','Regulación','shield','Riesgo operacional'), cn('QA','connected','Testing','check-circle','340 casos'), cn('BD Clientes','syncing','Impacto','users','3.8M cuentas')],
    script: [
      ln('ops-head','phase1','analysis',800,'FALLA. RPA IA: 89% back-office. Hipotecas: IA calcula pagos mensuales. Actualización cambió redondeo: ARRIBA vs centavo más cercano. Sobrecobro S/. 27/pago. 12,400 hipotecas × 6 semanas = 74,400 pagos incorrectos. Total: S/. 2.01M. Detectado por queja, no monitoreo.'),
      ln('quality','phase1','warning',2500,'BRECHA QA. 340 casos. Ninguno probó redondeo a centavo post-actualización. Tolerancia ±S/. 1. Sobrecobro S/. 27 dentro de tolerancia. QA APROBÓ proceso roto. Sin gobernanza por transacción: imposible detectar drift.'),
      ln('sbs-ops','phase2','dissent',2000,'DISENSO — SBS RIESGO OP. Requiere: gestión riesgo para automatización, gestión cambios, evaluación impacto. Actualización sin evidencia de qué cambió ni qué se probó. Umbral indefinido. Hallazgo: controles inadecuados.'),
      ln('customer','phase2','flag',2500,'ALERTA — CLIENTES. 12,400 afectados. S/. 2.01M devoluciones. 847 con débito automático: 234 sobregiros otros bancos. 156 perdieron otros pagos. Confianza catastrófica — su HOGAR en juego.'),
      ln('ops-head','phase3','proposal',2000,'PROPUESTA: (1) POR TXN: cálculo sellado. (2) DETECCIÓN DRIFT: shift S/. 27 en <24h. (3) GOBERNANZA CAMBIOS: antes/después sellado. (4) EVIDENCIA SBS. (5) IMPACTO CLIENTE: identificación tiempo real.'),
      ln('sbs-ops','phase3','resolution',2500,'DISENSO RETIRADO. Drift capturado en 24h no 6 semanas. 2,067 pagos vs 74,400. S/. 56K vs S/. 2.01M. Gobernanza cambios previene futuras. SBS satisfecho.'),
    ],
    receiptTemplate: rc('o09','Raíz Merkle (2.4M txn + Drift + Cambios)','Riesgo Operacional','OPS-GOBERNADO','SBS OpRisk — evidencia por txn + drift',['Agente Ops','Agente Calidad','Agente SBS Ops','Agente Cliente'],'Scotiabank Ops — IA Gobernada, Drift Monitoreado','2.4M txn gobernadas. Drift <24h. Cambios sellados.','Txn → Cálculo → Drift → Output → Cambios → SBS → Ed25519 + RFC 3161'),
    idleTitle: 'Listo para Deliberar', idleDesc: '4 agentes: error S/. 27 no detectado 6 semanas en 12,400 hipotecas.',
    phaseLabels: ['Error & Brecha QA', 'SBS Riesgo Op & Cliente', 'Gobernanza Por Transacción'],
  },

  // 10 — VP DIGITAL: CHATBOT
  {
    id: 'vp-digital-chatbot', title: 'VP Banca Digital — Gobernanza Chatbot IA',
    subtitle: 'Servicio · Alucinación · INDECOPI · Tasas · Declaraciones vinculantes',
    banner: 'Chatbot dice a 3,200 clientes que tasa ahorro es 8.5%. Real: 4.2%. S/. 47M depositados por tasa alucinada. INDECOPI: vinculante.',
    risk: 'Crítico', scenarioNum: '10', icon: 'message-circle', color: 'text-violet-400',
    agents: [ag('vp-digital','Agente VP Digital','Banca Digital','💬','text-violet-400','violet-500'), ag('indecopi','Agente INDECOPI','Consumidor','🛡️','text-red-400','red-500'), ag('product','Agente Producto','Tasas','📊','text-blue-400','blue-500'), ag('legal','Agente Legal','Vinculante','⚖️','text-amber-400','amber-500')],
    connectors: [cn('Chatbot IA','connected','Servicio','message-circle','14K consultas/día — GPT'), cn('INDECOPI','connected','Consumidor','shield','Código Protección'), cn('BD Productos','connected','Tasas','database','Tasas actuales'), cn('Log Conversaciones','syncing','Evidencia','file-text','Texto no estructurado')],
    script: [
      ln('vp-digital','phase1','analysis',800,'CRISIS CHATBOT. 14K consultas/día. "¿Mejor tasa ahorro?" Chatbot: "8.5% sin mínimo!" INCORRECTO. Real: 4.2%, mínimo S/. 10K. Alucinó tasa 2019. 3,200 clientes en 12 días. S/. 47M depositados en tasa falsa.'),
      ln('indecopi','phase1','warning',2500,'INDECOPI. Art. 18: información veraz. Chatbot = agente del banco. Tasa alucinada = vinculante. 3,200 con reclamo legal a 8.5%. Honrar: S/. 20.1M/año. Multa: 450 UIT. Demanda colectiva probable.'),
      ln('product','phase2','dissent',2000,'DISENSO — ESCALA. 14K/día, chatbot 78%. Sin IA: 4h espera. Cada alucinación = responsabilidad. Tasas: 2,400/día. 0.8% alucinan: 19 incorrectas diarias. 12 días = 3,200 afectados.'),
      ln('legal','phase2','flag',2500,'ALERTA — SIN EVIDENCIA. Logs no estructurados. Imposible identificar todos los afectados. INDECOPI exige cada conversación sobre tasas. Revisión manual 168K conversaciones = 6 meses.'),
      ln('vp-digital','phase3','proposal',2000,'PROPUESTA: (1) VERIFICACIÓN tiempo real contra BD productos. (2) DETECCIÓN alucinación por confianza. (3) SELLO por conversación. (4) EVIDENCIA INDECOPI. (5) ID AFECTADOS instantánea.'),
      ln('indecopi','phase3','resolution',2500,'DISENSO RETIRADO. Verificación +200ms invisible. 3,200 identificados en horas. Alucinación eliminada. Evidencia por conversación. Ahorro: S/. 20.1M/año + S/. 2.3M multas.'),
    ],
    receiptTemplate: rc('d10','Raíz Merkle (14K conversaciones + Verificación + Alucinación)','Protección Consumidor','CHATBOT-GOBERNADO','INDECOPI — verificación por conversación',['Agente VP Digital','Agente INDECOPI','Agente Producto','Agente Legal'],'Scotiabank VP Digital — Chatbot Gobernado','14K conversaciones gobernadas. Verificación tiempo real. Alucinación eliminada.','Consulta → Respuesta → Verificar BD → Confianza → Check → Sellado → Ed25519 + RFC 3161'),
    idleTitle: 'Listo para Deliberar', idleDesc: '4 agentes: chatbot dice tasa incorrecta a 3,200 clientes — S/. 47M depositados.',
    phaseLabels: ['Alucinación & Consumidor', 'Declaraciones & Evidencia', 'Gobernanza Por Conversación'],
  },

  // 11 — CDO: DATOS & PRIVACIDAD
  {
    id: 'cdo-data-privacy', title: 'CDO — Gobernanza de Datos & Privacidad IA',
    subtitle: 'APDP · Ley 29733 · Perfilamiento · Linaje datos · Transferencia transfronteriza',
    banner: 'IA de perfilamiento comparte 3.8M perfiles con Toronto sin consentimiento. APDP descubre transferencia transfronteriza. Violación Ley 29733.',
    risk: 'Crítico', scenarioNum: '11', icon: 'database', color: 'text-teal-400',
    agents: [ag('cdo','Agente CDO','Datos','🗄️','text-teal-400','teal-500'), ag('apdp','Agente APDP','Protección Datos','🔒','text-red-400','red-500'), ag('analytics','Agente Analítica','Perfilamiento','📊','text-blue-400','blue-500'), ag('toronto-data','Agente Toronto','Analítica Global','🌍','text-amber-400','amber-500')],
    connectors: [cn('Datos Cliente','connected','Perfiles','database','3.8M clientes — datos conductuales'), cn('APDP Perú','connected','Privacidad','shield','Ley 29733'), cn('Plataforma Toronto','connected','Analítica','globe','Pipeline datos transfronterizo'), cn('BD Consentimiento','syncing','Permisos','check-circle','62% incompleto')],
    script: [
      ln('cdo','phase1','analysis',800,'BRECHA DE DATOS. 3.8M perfiles. IA construye modelos conductuales: patrones gasto, ubicación, ingreso, estilo de vida. Datos alimentan analítica Toronto para cross-sell. Ley 29733: consentimiento explícito para perfilamiento y transferencia transfronteriza. 62% nunca consintieron perfilamiento. 0% consintieron transferencia a Canadá. 3.8M perfiles enviados sin base legal.'),
      ln('apdp','phase1','warning',2500,'VIOLACIÓN APDP. Ley 29733 Art. 13: procesamiento requiere consentimiento informado. Art. 15: transferencia requiere protección adecuada + consentimiento. Sin: (1) consentimiento individual (2) autorización APDP (3) evaluación adecuación. Multa: hasta 100 UIT/afectado. Realista: S/. 50-200M + orden cesar procesamiento.'),
      ln('toronto-data','phase2','dissent',2000,'DISENSO — NEGOCIO CRÍTICO. Toronto analítica genera 34% ingresos cross-sell Perú (S/. 124M/año). Modelos requieren datos conductuales. Detener = cross-sell ciego. BCP con analítica local tiene ventaja. Toronto: datos esenciales para modelos globales de riesgo también.'),
      ln('analytics','phase2','flag',2500,'ALERTA — LINAJE DESCONOCIDO. 847 datos por cliente. CDO no puede trazar: qué dato viene de qué fuente, cuál tiene consentimiento. Sin mapa de linaje. APDP: "Muestre qué datos procesa, adónde van, quién consintió." CDO: "No sabemos." Problema de gobernanza, no técnico.'),
      ln('cdo','phase3','proposal',2000,'PROPUESTA: (1) LINAJE: cada dato trazado desde fuente hasta uso con base de consentimiento. (2) CONSENTIMIENTO: por cliente por propósito. (3) TRANSFRONTERIZO: evidencia sellada de consentimiento + adecuación. (4) TRANSPARENCIA: perfil sellado por cliente. (5) EVIDENCIA APDP: Ley 29733 por cliente.'),
      ln('apdp','phase3','resolution',2500,'DISENSO RETIRADO. Linaje permite transferencia selectiva — solo datos consentidos cruzan. Campaña: 62%→94% en 90 días. Toronto recibe datos gobernados. APDP evidencia por cliente. S/. 124M preservados con base legal.'),
    ],
    receiptTemplate: rc('d11','Raíz Merkle (3.8M perfiles + Linaje + Consentimiento + Transfronterizo)','Protección Datos','PRIVACIDAD-GOBERNADA','Ley 29733 — consentimiento + linaje por cliente',['Agente CDO','Agente APDP','Agente Analítica','Agente Toronto'],'Scotiabank CDO — Datos Gobernados, Privacidad Compliant','3.8M perfiles gobernados. Linaje mapeado. Consentimiento 62%→94%.','Datos → Linaje → Consentimiento → Propósito → Gate Transfronterizo → APDP → Sellado → Ed25519 + RFC 3161'),
    idleTitle: 'Listo para Deliberar', idleDesc: '4 agentes: 3.8M perfiles transferidos a Toronto sin consentimiento ni autorización APDP.',
    phaseLabels: ['Transferencia & Privacidad', 'Impacto Negocio & Linaje', 'Gobernanza Privacidad Por Cliente'],
  },

  // 12 — VP TESORERÍA: FX
  {
    id: 'vp-treasury-fx', title: 'VP Tesorería — IA FX & Liquidez',
    subtitle: 'BCRP · Reservas FX · Stress liquidez · Trading algorítmico · Manipulación',
    banner: 'IA ejecuta $340M FX diarios. Concentra posiciones PEN/USD en ventana baja liquidez. BCRP señala potencial manipulación.',
    risk: 'Alto', scenarioNum: '12', icon: 'bar-chart', color: 'text-yellow-400',
    agents: [ag('vp-treas','Agente VP Tesorería','FX & Liquidez','💱','text-yellow-400','yellow-500'), ag('bcrp','Agente BCRP','Banco Central','🏦','text-red-400','red-500'), ag('algo','Agente Algo Trading','Ejecución','⚡','text-blue-400','blue-500'), ag('market','Agente Riesgo Mercado','Posiciones','📉','text-emerald-400','emerald-500')],
    connectors: [cn('IA FX','connected','Trading','bar-chart','$340M diarios — algorítmico'), cn('BCRP','connected','Banco Central','landmark','Monitoreo FX'), cn('Liquidez','connected','Mercado','trending-up','PEN/USD profundidad'), cn('Posición','syncing','Riesgo','shield','Límites posición abierta')],
    script: [
      ln('vp-treas','phase1','analysis',800,'IA TESORERÍA. $340M FX diario. IA optimiza timing. PATRÓN: ejecutar PEN/USD 12:30-13:00 (almuerzo, liquidez delgada) logra 2-4 bps mejor tasa. 45% volumen diario en 30 min. 6 meses: S/. 8.4M ahorros. PROBLEMA: BCRP monitorea patrones FX. Concentración en liquidez delgada = impacto de mercado.'),
      ln('bcrp','phase1','warning',2500,'BCRP. Monitorea manipulación y concentración. Scotiabank: 45% de $340M en 30 min liquidez delgada = $153M impacto. Circular BCRP 006-2024: no explotar ventanas baja liquidez. BCRP puede restringir acceso FX. Pérdida acceso = catastrófico para tesorería.'),
      ln('algo','phase2','dissent',2000,'DISENSO — IA FUNCIONÓ. S/. 8.4M ahorros. IA encontró ventaja. Para eso ES el trading IA. Mercado abierto a mediodía. Otros bancos pueden operar. Restricción cuesta dinero a accionistas. Gobernanza debe documentar, no prevenir.'),
      ln('market','phase2','flag',2500,'ALERTA — RIESGO SISTÉMICO. Ejecución concentrada: si mercado se mueve en contra, costo salida 5-8x normal. Un movimiento adverso: $2-4M en minutos. IA optimiza caso promedio. Si BCRP restringe acceso, TODAS las operaciones FX afectadas.'),
      ln('vp-treas','phase3','proposal',2000,'PROPUESTA: (1) POR TRADE: timing, profundidad, impacto sellado. (2) LÍMITE: máx 20% volumen en cualquier ventana 30 min. (3) BCRP: divulgación proactiva. (4) RIESGO COLA: peor caso documentado. (5) IMPACTO: monitoreo participación Scotiabank en FX.'),
      ln('bcrp','phase3','resolution',2500,'DISENSO RETIRADO. Límite 20% preserva 60% ventaja (S/. 5M/año) eliminando preocupación BCRP. Divulgación proactiva construye confianza. Evidencia por trade previene alegación manipulación.'),
    ],
    receiptTemplate: rc('t12','Raíz Merkle ($340M FX + Rationale + BCRP)','Compliance Tesorería','FX-GOBERNADO','BCRP Circular 006-2024 — evidencia por trade',['Agente VP Tesorería','Agente BCRP','Agente Algo Trading','Agente Riesgo Mercado'],'Scotiabank Tesorería — FX Gobernado, BCRP Transparente','$340M FX gobernados. Concentración limitada. BCRP proactivo. S/. 5M/año preservados.','Orden FX → Timing → Profundidad → Concentración → Sellado → BCRP → Ed25519 + RFC 3161'),
    idleTitle: 'Listo para Deliberar', idleDesc: '4 agentes: IA FX concentra $153M en ventana liquidez delgada — BCRP señala manipulación.',
    phaseLabels: ['Concentración FX & BCRP', 'Ventaja IA vs Riesgo Sistémico', 'Gobernanza Por Trade'],
  },

  // 13 — VP TARJETAS: FRAUDE
  {
    id: 'vp-cards-fraud', title: 'VP Tarjetas & Pagos — IA Detección Fraude',
    subtitle: 'Fraude · Falsos rechazos · Comercios · SBS · Fricción cliente',
    banner: 'IA bloquea 14,000 transacciones/día. 82% son compras legítimas. Comercios pierden S/. 4.7M/mes. Clientes migran a BCP.',
    risk: 'Alto', scenarioNum: '13', icon: 'credit-card', color: 'text-rose-400',
    agents: [ag('vp-cards','Agente VP Tarjetas','Pagos','💳','text-rose-400','rose-500'), ag('fraud-ai','Agente IA Fraude','Detección','🔍','text-red-400','red-500'), ag('merchant','Agente Comercio','Impacto','🏪','text-blue-400','blue-500'), ag('cx-cards','Agente CX','Fricción','⭐','text-emerald-400','emerald-500')],
    connectors: [cn('Motor Fraude','connected','Detección','credit-card','14K bloqueos/día — 82% falsos'), cn('BD Comercios','connected','Impacto','building','47K comercios'), cn('CX Cliente','connected','Satisfacción','users','NPS por interacción'), cn('SBS Pagos','syncing','Regulación','shield','Supervisión pagos')],
    script: [
      ln('vp-cards','phase1','analysis',800,'IA FRAUDE. 2.1M txn/día. Bloquea 14,000. Fraude real 0.12% = 2,520/día. IA captura 2,268 (90%). PERO: 14,000 - 2,268 = 11,732 falsos rechazos diarios. Tasa falsos positivos: 82%. 4.28M transacciones legítimas bloqueadas/año.'),
      ln('merchant','phase1','warning',2500,'IMPACTO COMERCIOS. Falsos rechazos: cliente paga efectivo o usa otra tarjeta. 47K comercios. Pequeños (<S/. 50K/mes): falsos 3.2x más que grandes. IA aprendió de datos grandes comercios. Pérdida S/. 4.7M/mes. 340 comercios migraron a BCP.'),
      ln('cx-cards','phase2','dissent',2000,'DISENSO — DESERCIÓN. Tarjeta rechazada = humillación. 34% reducen uso. 12% cancelan en 90 días. Churn anual: 51,200 tarjetas. Pérdida: S/. 23M/año. Daño marca. BCP: 67% falsos positivos — malo pero 15pp mejor.'),
      ln('fraud-ai','phase2','flag',2500,'ALERTA — TRADE-OFF. Modelo tuned para HIGH recall (90% detección). Reducir falsos a 67% baja detección a 82%. 8% más fraude = S/. 14M adicional. La pregunta: ¿cuál compra legítima rechazada vale atrapar un fraude más?'),
      ln('vp-cards','phase3','proposal',2000,'PROPUESTA: (1) POR RECHAZO: probabilidad fraude + señales + alternativa (step-up auth). (2) FAIRNESS COMERCIO: umbrales por segmento. (3) STEP-UP: OTP/biométrico para riesgo medio. (4) SMS instantáneo con razón. (5) EVIDENCIA SBS.'),
      ln('cx-cards','phase3','resolution',2500,'DISENSO RETIRADO. Step-up riesgo medio: falsos 82%→54%. Detección 89% mantenida. Ingresos comercios restaurados: S/. 3.1M/mes. Churn -62%. Cada rechazo con evidencia sellada.'),
    ],
    receiptTemplate: rc('f13','Raíz Merkle (2.1M txn + Fraud scoring + Fairness comercio)','Detección Fraude','FRAUDE-GOBERNADO','SBS Pagos — evidencia por rechazo + step-up',['Agente VP Tarjetas','Agente IA Fraude','Agente Comercio','Agente CX'],'Scotiabank Tarjetas — Fraude Gobernado, Comercio Justo','2.1M txn gobernadas. Falsos 82%→54%. Comercios restaurados. Detección 89%.','Txn → Score → Categoría → Step-Up/Bloqueo → Comercio → Notificar → Sellado → Ed25519 + RFC 3161'),
    idleTitle: 'Listo para Deliberar', idleDesc: '4 agentes: 82% falsos positivos bloquean 11,732 compras legítimas diarias.',
    phaseLabels: ['Falsos Rechazos & Comercios', 'Deserción & Trade-offs', 'Gobernanza Step-Up'],
  },

  // 14 — VP PYME: CRÉDITO PYME
  {
    id: 'vp-sme-lending', title: 'VP Banca PYME — IA Crédito Pequeña Empresa',
    subtitle: 'MYPE · Economía informal · SBS inclusión · Datos alternativos · Reactiva',
    banner: 'IA rechaza 78% solicitudes MYPE porque carecen de historial formal. 72% negocios Perú son informales. IA de economía formal excluye mayoría.',
    risk: 'Alto', scenarioNum: '14', icon: 'store', color: 'text-lime-400',
    agents: [ag('vp-sme','Agente VP PYME','Pequeña Empresa','🏪','text-lime-400','lime-500'), ag('informal','Agente Economía Informal','Datos Alternativos','📱','text-blue-400','blue-500'), ag('sbs-inc','Agente SBS Inclusión','Inclusión Financiera','🌍','text-emerald-400','emerald-500'), ag('risk-sme','Agente Riesgo PYME','Evaluación','📊','text-red-400','red-500')],
    connectors: [cn('IA PYME','connected','Crédito','store','4,200 solicitudes/mes — 78% rechazo'), cn('SBS Inclusión','connected','Política','shield','Plan Nacional Inclusión'), cn('Datos Alternativos','connected','Fuentes','smartphone','Yape, servicios, SUNAT'), cn('Registro MYPE','syncing','Negocios','database','2.1M MYPEs registradas')],
    script: [
      ln('vp-sme','phase1','analysis',800,'BRECHA PYME. 4,200 solicitudes/mes. Rechazo IA: 78%. Requiere 12 meses estados bancarios, 2 años declaraciones impuesto. Perú: 72% MYPEs informales. Sin estados bancarios (usan efectivo). Sin declaraciones (bajo umbral SUNAT). IA diseñada para Lima formal excluye: vendedores mercado, tiendas provinciales, cooperativas agrícolas — columna vertebral de Perú.'),
      ln('sbs-inc','phase1','warning',2500,'SBS INCLUSIÓN. Plan Nacional: expandir acceso a desatendidos. Scotiabank PYME: -12%/año desde IA. BCP con datos alternativos +23%. SBS revisión anual: Scotiabank señalado por métricas declinantes. Consecuencias regulatorias + reputacionales.'),
      ln('informal','phase2','dissent',2000,'DISENSO — DATOS EXISTEN. Negocios informales dejan rastro: (1) Yape/Plin: 4.2M+ txn MYPE/mes (2) SUNAT: RUC para compras pequeñas (3) Servicios: pago constante = proxy flujo caja (4) Proveedores: historial crédito comercial. MÁS RICO que estados bancarios para economía informal. IA ignora porque modelo fue formal.'),
      ln('risk-sme','phase2','flag',2500,'ALERTA — RIESGO MANEJABLE. 847 MYPEs aprobadas por excepción manual: mora 4.2% vs 3.8% formales. Diferencia: 0.4pp. Ingreso PYME: S/. 34M/año intereses. Costo mora 0.4pp: S/. 1.4M. NETO POSITIVO: S/. 32.6M. IA rechaza clientes rentables porque no entiende economía informal.'),
      ln('vp-sme','phase3','proposal',2000,'PROPUESTA: (1) DATOS ALTERNATIVOS: Yape, servicios, SUNAT micro, proveedores integrados. (2) MODELO INFORMAL: scoring entrenado en realidad MYPE Perú. (3) POR DECISIÓN: datos, score, alternativo sellado. (4) MÉTRICAS SBS. (5) CRÉDITO GRADUADO: préstamo pequeño → historial → aumento.'),
      ln('sbs-inc','phase3','resolution',2500,'DISENSO RETIRADO. Modelo alternativo: rechazo 78%→41%. Mora: 4.4% (aceptable). 1,500 MYPEs adicionales/mes acceden a crédito. Métricas SBS revierten. S/. 52M ingresos adicionales/año. Economía informal incluida.'),
    ],
    receiptTemplate: rc('s14','Raíz Merkle (4,200 MYPE + Datos alternativos + Inclusión)','Inclusión Financiera','INCLUSIÓN-GOBERNADA','SBS Plan Nacional — datos alternativos',['Agente VP PYME','Agente Informal','Agente SBS Inclusión','Agente Riesgo PYME'],'Scotiabank PYME — IA Gobernada, Inclusión Primero','4,200 solicitudes gobernadas. Rechazo 78%→41%. 1,500 MYPEs adicionales/mes.','Solicitud → Datos Alt → Score → Inclusión → Riesgo → Sellado → SBS → Ed25519 + RFC 3161'),
    idleTitle: 'Listo para Deliberar', idleDesc: '4 agentes: IA rechaza 78% MYPEs — economía informal excluida por IA formal.',
    phaseLabels: ['Exclusión MYPE & Informal', 'Datos Alternativos & Riesgo', 'Gobernanza Inclusión'],
  },

  // 15 — JEFE AUDITORÍA: AUDITORÍA IA
  {
    id: 'cae-audit-ai', title: 'Jefe Auditoría — IA Auditoría Interna',
    subtitle: 'Automatización auditoría · Muestreo · SBS requisitos · Integridad evidencia',
    banner: 'IA analiza 2.4M transacciones. Muestra 0.3% sesgada hacia Lima/montos grandes. Fraude provincial S/. 14.7M no detectado.',
    risk: 'Alto', scenarioNum: '15', icon: 'file-search', color: 'text-indigo-400',
    agents: [ag('cae','Agente Jefe Auditoría','Estrategia','🔎','text-indigo-400','indigo-500'), ag('audit-ai','Agente IA Auditoría','Muestreo','🤖','text-blue-400','blue-500'), ag('sbs-audit','Agente SBS Auditoría','Regulación','🏛️','text-red-400','red-500'), ag('fraud-audit','Agente Fraude Auditoría','Patrones','⚠️','text-amber-400','amber-500')],
    connectors: [cn('IA Auditoría','connected','Muestreo','file-search','2.4M txn — 0.3% muestra'), cn('SBS Auditoría','connected','Requisitos','shield','Examen anual'), cn('Datos Sucursales','connected','Transacciones','database','284 sucursales — todas regiones'), cn('Patrones Fraude','syncing','Detección','alert-triangle','Anomalías provinciales')],
    script: [
      ln('cae','phase1','analysis',800,'SESGO AUDITORÍA. IA: 2.4M txn, selecciona 7,200 (0.3%) para revisión. Entrenada con hallazgos históricos — concentrados en Lima (68% auditorías previas). Muestra: 74% Lima, 26% provincial. Distribución real: 52% Lima, 48% provincial. Provincias sub-auditadas.'),
      ln('fraud-audit','phase1','warning',2500,'PATRÓN PERDIDO. 94 sucursales fuera Lima. 12 con fraude coordinado de bajo valor (S/. 200-500/txn, 340 txn/mes/sucursal). Total: S/. 14.7M en 18 meses. IA nunca seleccionó: (1) bajo valor (2) provincial (3) patrón consistente (IA busca anomalías, no fraude consistente).'),
      ln('sbs-audit','phase2','dissent',2000,'DISENSO — SBS AUDITORÍA. Requiere: cobertura comprehensiva, enfoque basado en riesgo de TODAS las áreas. "Basado en riesgo" ≠ "basado en Lima." SBS: "¿Cómo asegura cobertura provincial su IA?" Respuesta: hallazgos históricos Lima-sesgados. SBS: "Su IA perpetúa el sesgo." Hallazgo: cobertura inadecuada.'),
      ln('audit-ai','phase2','flag',2500,'ALERTA — INTEGRIDAD. Selección IA debe ser defendible. Actual: "basado en score riesgo." No explica: por qué esta txn, por qué no aquella, cobertura provincial, patrones considerados vs perdidos. Si hallazgos son cuestionados: metodología no resiste escrutinio.'),
      ln('cae','phase3','proposal',2000,'PROPUESTA: (1) MUESTREO ESTRATIFICADO: cobertura proporcional regiones, sucursales, montos. (2) SELLO por selección: rationale, métricas cobertura. (3) PROVINCIAL: mínimo 48% = distribución real. (4) DIVERSIDAD: rangos de valor, no solo altos. (5) EVIDENCIA SBS: metodología con prueba de cobertura.'),
      ln('sbs-audit','phase3','resolution',2500,'DISENSO RETIRADO. Muestreo estratificado captura fraude provincial en primer ciclo. 12 sucursales identificadas. S/. 14.7M detectado 16 meses antes. SBS metodología aprobada. Cada selección con evidencia sellada.'),
    ],
    receiptTemplate: rc('a15','Raíz Merkle (2.4M txn + Estratificado + Cobertura)','Gobernanza Auditoría','AUDITORÍA-GOBERNADA','SBS Auditoría — cobertura estratificada',['Agente Jefe Auditoría','Agente IA Auditoría','Agente SBS Auditoría','Agente Fraude Auditoría'],'Scotiabank Auditoría — IA Estratificada, Evidencia Sellada','2.4M txn gobernadas. Provincial 26%→48%. S/. 14.7M detectado. SBS aprobada.','Pool → Estratificado → Cobertura → Rationale → Evidencia → SBS → Ed25519 + RFC 3161'),
    idleTitle: 'Listo para Deliberar', idleDesc: '4 agentes: IA auditoría sesgada a Lima — S/. 14.7M fraude provincial no detectado.',
    phaseLabels: ['Sesgo Muestra & Provincias', 'SBS Auditoría & Integridad', 'Gobernanza Estratificada'],
  },

  // 16 — JEFE COBRANZAS
  {
    id: 'collections-ai', title: 'Jefe Cobranzas — Gobernanza IA Cobranzas',
    subtitle: 'Recuperación · INDECOPI · Contacto agresivo · Vulnerabilidad · Dignidad',
    banner: 'IA contacta deudores 14 veces/día. Viuda anciana recibe llamadas por deuda del esposo. INDECOPI: acoso.',
    risk: 'Alto', scenarioNum: '16', icon: 'phone', color: 'text-orange-400',
    agents: [ag('collections','Agente Cobranzas','Recuperación','📞','text-orange-400','orange-500'), ag('indecopi-col','Agente INDECOPI','Consumidor','🛡️','text-red-400','red-500'), ag('vulnerable','Agente Vulnerabilidad','Dificultad','❤️','text-pink-400','pink-500'), ag('channel','Agente Canal','Contacto','📱','text-blue-400','blue-500')],
    connectors: [cn('IA Cobranzas','connected','Contacto','phone','47K cuentas — multicanal'), cn('INDECOPI','connected','Consumidor','shield','Quejas acoso'), cn('BD Dificultad','connected','Evaluación','heart','Indicadores vulnerabilidad'), cn('Log Contacto','syncing','Historial','file-text','8.4 contactos/deudor/día')],
    script: [
      ln('collections','phase1','analysis',800,'IA COBRANZAS. 47K cuentas morosas. IA optimiza frecuencia contacto. Promedio: 8.4/día. Algunos: 14/día. Carmen Flores, 68, viuda. Esposo falleció 4 meses. Deuda conjunta: S/. 12,400. Pensión: S/. 2,100/mes. IA: 14 llamadas/día incluyendo 2 AM.'),
      ln('indecopi-col','phase1','warning',2500,'INDECOPI. Art. 62: cobranza no abusiva. 14 contactos/día = acoso. 2 AM = violación descanso. 234 quejas en 6 meses — +180%. Multa: 450 UIT. Demanda colectiva potencial: 47K deudores.'),
      ln('vulnerable','phase2','dissent',2000,'DISENSO — CEGUERA. IA trata igual: no paga = más contacto. Carmen: S/. 2,100 pensión, S/. 1,800 gastos. Capacidad: S/. 300/mes. IA exige S/. 12,400. Es caso de reestructuración, no cobranza. Cero detección dificultad.'),
      ln('channel','phase2','flag',2500,'ALERTA — DATOS. Deudores >10x/día: recuperación MENOR que 3-4x/día. IA optimiza volumen pero exceso causa bloqueo, evasión, quejas. Estrategia contraproducente.'),
      ln('collections','phase3','proposal',2000,'PROPUESTA: (1) LÍMITE 4/día, 8AM-8PM. (2) VULNERABILIDAD: detectar dificultad → reestructuración. (3) SELLO por contacto. (4) EVIDENCIA INDECOPI. (5) MÉTRICA DIGNIDAD.'),
      ln('indecopi-col','phase3','resolution',2500,'DISENSO RETIRADO. Límites + vulnerabilidad: recuperación +12%. Carmen: reestructuración S/. 250/mes. Quejas -74%. Cada contacto sellado.'),
    ],
    receiptTemplate: rc('c16','Raíz Merkle (47K cuentas + Contacto + Vulnerabilidad + INDECOPI)','Compliance Cobranzas','DIGNIDAD-GOBERNADA','INDECOPI Art. 62 — por contacto + vulnerabilidad',['Agente Cobranzas','Agente INDECOPI','Agente Vulnerabilidad','Agente Canal'],'Scotiabank Cobranzas — Dignidad Primero','47K gobernadas. Recuperación +12%. Quejas -74%.','Cuenta → Vulnerabilidad → Plan → Límite → Canal → Sellado → INDECOPI → Ed25519 + RFC 3161'),
    idleTitle: 'Listo para Deliberar', idleDesc: '4 agentes: IA contacta viuda 14 veces/día por deuda del esposo.',
    phaseLabels: ['Acoso & Vulnerabilidad', 'INDECOPI & Datos', 'Gobernanza Dignidad'],
  },

  // 17 — JEFE CX: CHURN
  {
    id: 'cx-churn-ai', title: 'Jefe CX — IA Predicción Churn & Retención',
    subtitle: 'Retención · Ofertas discriminatorias · SBS conducta · Precio · Perfilamiento',
    banner: 'IA identifica 34K en riesgo. Distritos afluentes reciben 2x mejores ofertas que desatendidos. Mismo perfil, diferente código postal.',
    risk: 'Alto', scenarioNum: '17', icon: 'heart', color: 'text-fuchsia-400',
    agents: [ag('cx-head','Agente CX','Estrategia','❤️','text-fuchsia-400','fuchsia-500'), ag('retention','Agente Retención','Ofertas','🎯','text-blue-400','blue-500'), ag('fairness-cx','Agente Fairness','Equidad','⚖️','text-red-400','red-500'), ag('sbs-conduct','Agente SBS','Conducta','🏛️','text-amber-400','amber-500')],
    connectors: [cn('IA Churn','connected','Predicción','heart','34K en riesgo — ML'), cn('Motor Ofertas','connected','Retención','gift','Pricing dinámico'), cn('SBS Conducta','connected','Regulación','shield','Conducta mercado'), cn('Demografía','syncing','Perfilamiento','bar-chart','Análisis distrito')],
    script: [
      ln('cx-head','phase1','analysis',800,'IA CHURN. 34K en riesgo. Ofertas: San Isidro/Miraflores S/. 340 (tasa + comisión). Comas/VES S/. 120 (comisión menor). MISMO score, MISMA antigüedad. DIFERENTE distrito.'),
      ln('fairness-cx','phase1','warning',2500,'DISCRIMINACIÓN. IA: afluentes = mayor LTV = mayor oferta. Pero LTV correlaciona con ingreso → nivel socioeconómico. Mejores ofertas a ricos, peores a pobres. Brecha 2.8x.'),
      ln('sbs-conduct','phase2','dissent',2000,'DISENSO — SBS CONDUCTA. Trato justo, sin discriminación socioeconómica. Ofertas que favorecen afluentes = violación. INDECOPI: mismo producto, diferente precio por código postal.'),
      ln('retention','phase2','flag',2500,'ALERTA — NEGOCIO. Desatendidos con oferta equivalente: 89% retención vs 34% actual. IA se equivoca sobre quién vale salvar.'),
      ln('cx-head','phase3','proposal',2000,'PROPUESTA: (1) EQUIDAD: por score churn, no distrito. (2) SELLO por oferta. (3) BRECHA máx 1.3x. (4) SBS CONDUCTA. (5) PISO oferta mínima.'),
      ln('sbs-conduct','phase3','resolution',2500,'DISENSO RETIRADO. Retención 41%→58%. Desatendidos 34%→67%. 5,800 adicionales retenidos. S/. 47M/año. Fairness genera más ingreso.'),
    ],
    receiptTemplate: rc('x17','Raíz Merkle (34K + Equidad + Fairness + SBS)','Conducta Mercado','CX-GOBERNADA','SBS Conducta — ofertas equitativas',['Agente CX','Agente Retención','Agente Fairness','Agente SBS'],'Scotiabank CX — Churn Gobernado, Equidad','34K gobernados. Brecha 2.8x→1.3x. Retención 41%→58%.','Score → Oferta → Equidad → Fairness → Sellado → SBS → Ed25519 + RFC 3161'),
    idleTitle: 'Listo para Deliberar', idleDesc: '4 agentes: IA ofrece 2.8x mejores ofertas a distritos afluentes.',
    phaseLabels: ['Discriminación & Distritos', 'SBS Conducta & Realidad', 'Gobernanza Equidad'],
  },

  // 18 — VP RIESGO: STRESS TESTING
  {
    id: 'vp-risk-stress', title: 'VP Riesgo Analítico — IA Stress Testing',
    subtitle: 'BCRP stress · SBS capital · Escenarios · Riesgo modelo · Basilea III',
    banner: 'IA proyecta CET1 8.2% en escenario severo. Real: 6.1% — bajo mínimo. IA excluyó concentración minera.',
    risk: 'Crítico', scenarioNum: '18', icon: 'activity', color: 'text-sky-400',
    agents: [ag('vp-risk','Agente VP Riesgo','Stress Testing','📉','text-sky-400','sky-500'), ag('sbs-cap','Agente SBS Capital','Suficiencia','🏛️','text-red-400','red-500'), ag('model-val','Agente Validación','Revisión','🔍','text-amber-400','amber-500'), ag('scenario','Agente Escenarios','Modelamiento','🌍','text-emerald-400','emerald-500')],
    connectors: [cn('IA Stress','connected','Modelamiento','activity','Escenarios macro'), cn('SBS Capital','connected','Suficiencia','shield','Mínimo 10% CET1'), cn('Portafolio','connected','Exposiciones','database','S/. 42MM activos'), cn('Sector Minero','syncing','Concentración','trending-down','18% cartera comercial')],
    script: [
      ln('vp-risk','phase1','analysis',800,'ERROR STRESS. S/. 42MM activos, CET1 11.8%. IA escenario severo BCRP: PIB -5%, PEN -20%, crash commodities. Resultado IA: 8.2% — sobre mínimo. PROBLEMA: IA excluyó minería (18% cartera) del stress commodities. Corregido: CET1 6.1% — BAJO mínimo. Banco no pasa.'),
      ln('sbs-cap','phase1','warning',2500,'SBS. Stress anual per Basilea III. Si presenta 8.2%: SBS acepta. Descubrimiento posterior: declaración errónea material. Si presenta 6.1%: SBS requiere plan capital — pero es preciso. Resultado incorrecto = peor que malo.'),
      ln('model-val','phase2','dissent',2000,'DISENSO — VALIDACIÓN. 47 modelos sectoriales, 12 escenarios, 340 supuestos. Validación revisó 8 de 47. Modelo minero: NO VALIDADO. 4 personas para 47 modelos. Cobertura incompleta = exclusión no detectada.'),
      ln('scenario','phase2','flag',2500,'ALERTA — RIESGO PERÚ. 60% exportaciones minerales. Stress minero: impacto PIB 2.3x general. IA usó parámetros genéricos EM. Calibración Perú habría capturado concentración.'),
      ln('vp-risk','phase3','proposal',2000,'PROPUESTA: (1) POR SUPUESTO: sellado con fuente, calibración, cobertura. (2) CHECK CONCENTRACIÓN obligatorio. (3) CALIBRACIÓN PERÚ: minería, agricultura, pesca. (4) EVIDENCIA SBS: cadena completa supuestos. (5) COBERTURA: ningún modelo no validado.'),
      ln('sbs-cap','phase3','resolution',2500,'DISENSO RETIRADO. Gobernanza captura exclusión antes de SBS. 6.1% presentado con plan capital S/. 280M. SBS aprecia divulgación proactiva. Gobernanza previene declaración errónea material.'),
    ],
    receiptTemplate: rc('r18','Raíz Merkle (47 modelos + Supuestos + Concentración + SBS)','Suficiencia Capital','STRESS-GOBERNADO','SBS + Basilea III — por supuesto',['Agente VP Riesgo','Agente SBS Capital','Agente Validación','Agente Escenarios'],'Scotiabank Riesgo — Stress Gobernado, Perú Calibrado','47 modelos gobernados. Exclusión minera capturada. CET1 corregido.','Escenario → Modelos → Supuestos → Concentración → Calibración → SBS → Ed25519 + RFC 3161'),
    idleTitle: 'Listo para Deliberar', idleDesc: '4 agentes: IA stress excluye minería — 8.2% vs real 6.1%.',
    phaseLabels: ['Error Stress & Minería', 'Validación & Riesgo Perú', 'Gobernanza Por Supuesto'],
  },

  // 19 — GERENTE SUCURSAL
  {
    id: 'branch-manager-ops', title: 'Gerente Sucursal — IA Operaciones Diarias',
    subtitle: 'Dotación · Cola · Metas ventas · Adultos mayores · Performance',
    banner: 'IA reduce personal basándose en volumen. No considera adultos mayores que necesitan 3x más tiempo. Esperas suben a 47 min.',
    risk: 'Medio', scenarioNum: '19', icon: 'building-2', color: 'text-slate-400',
    agents: [ag('branch-mgr','Agente Gerente','Operaciones','🏦','text-slate-400','slate-500'), ag('staffing-ai','Agente IA Dotación','Personal','👥','text-blue-400','blue-500'), ag('customer-br','Agente Cliente','Experiencia','⭐','text-amber-400','amber-500'), ag('regional','Agente Regional','Performance','📊','text-red-400','red-500')],
    connectors: [cn('IA Dotación','connected','Personal','building-2','Optimización headcount'), cn('Sistema Cola','connected','Esperas','clock','Tiempo real'), cn('CX Sucursal','connected','Satisfacción','users','NPS por sucursal'), cn('Performance','syncing','Metas','bar-chart','Ventas, servicio, eficiencia')],
    script: [
      ln('branch-mgr','phase1','analysis',800,'CONFLICTO IA. Sucursal Miraflores. IA: reducir cajeros 6→4 entre 10AM-2PM (bajo volumen digital-elegible). Gerente sabe: 10AM-2PM = adultos mayores — atención presencial, 3x más tiempo, ayuda múltiple. IA ve bajo CONTEO. Realidad: alta COMPLEJIDAD.'),
      ln('staffing-ai','phase1','warning',2500,'MÉTRICAS. Optimiza txn/cajero/hora. Miraflores 10AM-2PM: 12 txn/cajero (vs 28 promedio). IA: sobre-dotado. Override gerente: DENEGADO — niveles vinculantes. 2 semanas post-corte: espera de 12 a 47 minutos.'),
      ln('customer-br','phase2','dissent',2000,'DISENSO — ADULTOS MAYORES. Miraflores: alta población adulto mayor. 47 min espera. No pueden estar parados, no usan app. 3 desmayos en primer mes. NPS: 72→31. Relaciones más valiosas (décadas depósitos). Se van a BCP silenciosamente.'),
      ln('regional','phase2','flag',2500,'ALERTA — PARADOJA. IA cortó personal → txn/cajero SUBE (parece eficiente). Pero satisfacción BAJA, deserción adulto mayor SUBE. IA optimizó una métrica y destruyó otras. "Override denegado" = IA anuló humano que entendía contexto.'),
      ln('branch-mgr','phase3','proposal',2000,'PROPUESTA: (1) DOTACIÓN CONTEXTUAL: complejidad + demografía + tiempo servicio. (2) INPUT GERENTE como input ponderado, no anulado. (3) SELLO por decisión dotación. (4) MÉTRICA ADULTO MAYOR. (5) OVERRIDE con evidencia sellada.'),
      ln('customer-br','phase3','resolution',2500,'DISENSO RETIRADO. Dotación contextual: 10AM-2PM mantiene 5 cajeros. Espera: 47→14 min. NPS: 31→68. Adultos mayores retenidos. Gerente con voz. Eficiencia real (no proxy).'),
    ],
    receiptTemplate: rc('b19','Raíz Merkle (284 sucursales + Dotación + Contexto + CX)','Operaciones Sucursal','SUCURSAL-GOBERNADA','Dotación contextual — input gerente + demografía',['Agente Gerente','Agente IA Dotación','Agente Cliente','Agente Regional'],'Scotiabank Sucursal — Dotación Gobernada, Contexto Primero','284 sucursales gobernadas. Espera 47→14 min. NPS recuperado. Adultos mayores protegidos.','Volumen → Complejidad → Demografía → Input Gerente → Decisión → CX → Sellado → Ed25519 + RFC 3161'),
    idleTitle: 'Listo para Deliberar', idleDesc: '4 agentes: IA reduce personal ignorando adultos mayores — esperas de 47 min.',
    phaseLabels: ['Corte Personal & Adultos Mayores', 'Paradoja Eficiencia & Override', 'Gobernanza Contextual'],
  },

  // 20 — COMITÉ ÉTICA IA DEL DIRECTORIO
  {
    id: 'board-ethics-committee', title: 'Comité Ética IA del Directorio — Gobernanza Constitucional',
    subtitle: 'Ética IA · Constitución IA · Accountability directivos · SBS · Toronto · Perú',
    banner: 'Directorio aprueba "Constitución IA" para Scotiabank Perú: principios vinculantes que rigen TODA decisión de IA. Primer banco peruano con marco constitucional de IA.',
    risk: 'Estratégico', scenarioNum: '20', icon: 'scroll', color: 'text-amber-400',
    agents: [ag('ethics-chair','Agente Presidente Comité','Ética IA','📜','text-amber-400','amber-500'), ag('all-agents','Agente Multi-Stakeholder','Todos los Roles','👥','text-blue-400','blue-500'), ag('sbs-final','Agente SBS','Supervisión Final','🏛️','text-red-400','red-500'), ag('toronto-final','Agente Toronto','Alineación Global','🌍','text-emerald-400','emerald-500')],
    connectors: [cn('Constitución IA','connected','Marco','scroll','7 principios — vinculantes'), cn('SBS Integral','connected','Regulación','shield','Marco completo SBS'), cn('Toronto Global','connected','Estándares','globe','Alineación Scotiabank Global'), cn('20 Escenarios','syncing','Evidencia','database','Lecciones de 20 deliberaciones')],
    script: [
      ln('ethics-chair','phase1','analysis',800,'CONSTITUCIÓN IA. 20 escenarios deliberados. 20 fallas descubiertas. Patrón: IA desplegada sin principios. Cada equipo optimizó su métrica. Nadie preguntó: ¿es correcto? Propuesta: Constitución IA de Scotiabank Perú — 7 principios vinculantes que rigen TODA decisión de IA en el banco.'),
      ln('all-agents','phase1','warning',2500,'7 PRINCIPIOS. (1) TRANSPARENCIA: cada decisión IA explicable y sellada. (2) FAIRNESS: sin discriminación por geografía, género, edad, nivel socioeconómico. (3) ACCOUNTABILITY: dueño humano para cada modelo. (4) SEGURIDAD: gobernanza adversarial + umbrales confianza. (5) PRIVACIDAD: consentimiento + linaje por dato. (6) INCLUSIÓN: IA expande acceso, no lo contrae. (7) DIGNIDAD: clientes vulnerables protegidos siempre.'),
      ln('sbs-final','phase2','dissent',2000,'DISENSO — ENFORCEMENT. Principios sin enforcement = declaración de intenciones. SBS necesita evidencia de que principios se aplican POR DECISIÓN. ¿Cómo demuestra que cada decisión cumplió los 7 principios? Sin evidencia criptográfica por decisión, constitución es marketing.'),
      ln('toronto-final','phase2','flag',2500,'ALERTA — ALINEACIÓN. Toronto apoya pero requiere: (1) Principios alineados con estándares globales Scotiabank. (2) Evidencia exportable para reguladores canadienses. (3) Escalación para violaciones materiales. Marco local debe funcionar globalmente.'),
      ln('ethics-chair','phase3','proposal',2000,'PROPUESTA: DATACENDIA COMO ENFORCEMENT. Cada decisión IA sellada con: (1) Modelo usado (2) Datos considerados (3) Check fairness (4) Check inclusión (5) Check privacidad (6) Check seguridad (7) Dueño humano. Recibo criptográfico = evidencia de principios aplicados. No confianza — verificación.'),
      ln('sbs-final','phase3','resolution',2500,'DISENSO RETIRADO. Constitución + Datacendia = principios con evidencia. SBS: primer banco peruano con gobernanza constitucional de IA verificable. Toronto: modelo para Scotiabank Global. Directorio: accountability demostrable. 47 modelos, 20 escenarios, 7 principios — cada decisión sellada.'),
    ],
    receiptTemplate: rc('e20','Raíz Merkle (Constitución IA + 7 Principios + 47 Modelos + 20 Escenarios)','Gobernanza Constitucional','CONSTITUCIÓN-SELLADA','SBS + Toronto + 7 Principios — verificación por decisión',['Agente Presidente Comité','Agente Multi-Stakeholder','Agente SBS','Agente Toronto'],'Scotiabank Directorio — Constitución IA Sellada, Verificable','7 principios vinculantes. 47 modelos gobernados. 20 escenarios resueltos. Primer banco peruano con gobernanza constitucional.','Principios → Por Modelo → Por Decisión → Fairness → Inclusión → Privacidad → Seguridad → Accountability → Sellado → Ed25519 + RFC 3161'),
    idleTitle: 'Listo para Deliberar', idleDesc: '4 agentes: Directorio establece Constitución IA — 7 principios vinculantes para todo el banco.',
    phaseLabels: ['Constitución IA & 7 Principios', 'Enforcement & Alineación Global', 'Gobernanza Constitucional Verificable'],
  },

  // 21 — GERENTE SUCURSAL: VENTA CRUZADA DIARIA
  {
    id: 'branch-crosssell', title: 'Gerente Sucursal — IA Venta Cruzada en Ventanilla',
    subtitle: 'Producto · Prompts cajero · Contexto inapropiado · Confianza · Operaciones diarias',
    banner: 'Cada transacción dispara prompts de venta cruzada. IA sugiere seguro de vida a viuda que deposita indemnización del esposo. Cajera se paraliza. Gerente no puede desactivar prompts.',
    risk: 'Medio', scenarioNum: '21', icon: 'shopping-bag', color: 'text-green-400',
    agents: [ag('branch-cs','Agente Gerente','Venta Cruzada','🏦','text-green-400','green-500'), ag('crosssell-ai','Agente IA Ventas','Motor Productos','🛒','text-blue-400','blue-500'), ag('teller','Agente Cajera','Personal Línea','👩‍💼','text-amber-400','amber-500'), ag('product-mgr','Agente Producto','Metas Ingreso','📊','text-red-400','red-500')],
    connectors: [cn('IA Ventas','connected','Motor','shopping-bag','4.2 prompts/cliente — tiempo real'), cn('Pantalla Cajero','connected','POS','monitor','Prompt durante transacción'), cn('Historial Cliente','connected','CRM','database','Eventos vida no rastreados'), cn('Dashboard Ventas','syncing','Metas','bar-chart','Sucursal: 78% meta trimestral')],
    script: [
      ln('branch-cs','phase1','analysis',800,'PROBLEMA DIARIO. Cada transacción dispara prompts. Martes 9:15 AM: María Luisa Vega, 64, deposita S/. 340,000 — indemnización por fallecimiento del esposo, 2 semanas. Prompt: "DEPÓSITO ALTO. Recomendar: Seguro de Vida, Portafolio Inversión, Ahorro Premium." Cajera Ana lee prompt. Se paraliza. Cliente llorando. Esto pasa 3-5 veces/semana con contextos inapropiados — gastos médicos, divorcios, liquidaciones.'),
      ln('crosssell-ai','phase1','warning',2500,'LÓGICA IA. Depósito grande + 64 años + sin seguro vida = alta propensión (94%). IA CORRECTA en propensión. CERO contexto sobre POR QUÉ el depósito. Sin eventos de vida, sin filtro de sensibilidad. Score 94% a cajera frente a viuda en duelo.'),
      ln('teller','phase2','dissent',2000,'DISENSO — REALIDAD CAJERO. Cajeros medidos por tasa conversión. Ana: 12% (promedio 18%). Marcada como "bajo desempeño." Ana ELIGIÓ no vender seguro a viuda. IA registró "oportunidad no convertida." 6 cajeros, todos enfrentando esto diario. Buen juicio PENALIZADO. "¿Sirvo al cliente o al prompt?"'),
      ln('product-mgr','phase2','flag',2500,'ALERTA — MARCA. Clientes post-prompt inapropiado: NPS -34. 23% mencionan "insistente." 12 quejas/mes. PERO: IA genera S/. 4.2M/año. Producto: "Menos prompts = menos ingreso." Gerente: "Perder confianza cuesta más." Nadie mide erosión de confianza a largo plazo.'),
      ln('branch-cs','phase3','proposal',2000,'PROPUESTA: (1) FILTRO CONTEXTO: verificar eventos vida antes de prompt. (2) CONTROL GERENTE: pausar/ajustar sin aprobación regional. (3) JUICIO CAJERO: botón "diferir" sin penalización. (4) SELLO por prompt. (5) SENSIBILIDAD: depósitos inesperados grandes, 48h antes de venta cruzada.'),
      ln('product-mgr','phase3','resolution',2500,'DISENSO RETIRADO. Filtro contexto: prompts inapropiados -87%. Conversión restantes: 18%→31%. Ingreso neto: S/. 4.2M→S/. 4.8M. Ana: sin penalización. María Luisa: nota de condolencia del gerente, volvió 3 meses después y abrió cuenta inversión voluntariamente.'),
    ],
    receiptTemplate: rc('cs1','Raíz Merkle (Prompts + Filtro contexto + Acciones cajero + Ingreso)','Venta Cruzada','CONTEXTO-GOBERNADO','Filtro contexto + juicio cajero preservado',['Agente Gerente','Agente IA Ventas','Agente Cajera','Agente Producto'],'Scotiabank Sucursal — Venta Cruzada Gobernada','Prompts inapropiados -87%. Conversión 18%→31%. Ingreso +S/. 600K. Juicio cajero protegido.','Visita → Contexto → Prompt → Cajero → Acción/Diferir → Resultado → Sellado → Ed25519 + RFC 3161'),
    idleTitle: 'Listo para Deliberar', idleDesc: '4 agentes: IA sugiere seguro de vida a viuda que deposita indemnización del esposo.',
    phaseLabels: ['Prompt Inapropiado & Cajera', 'Penalización & Daño Marca', 'Gobernanza Venta Cruzada Contextual'],
  },

  // 22 — GERENTE SUCURSAL: EFECTIVO & ATM
  {
    id: 'branch-cash-atm', title: 'Gerente Sucursal — IA Efectivo & ATM',
    subtitle: 'Pronóstico efectivo · ATM vacío · Viernes de pago · Sucursal provincial · Confianza',
    banner: 'IA reduce pedido de efectivo 40% por tendencia digital. Viernes de pago: 3 ATMs vacíos a las 11 AM. 400 clientes sin poder retirar salario. Gerente advirtió — sistema ignoró.',
    risk: 'Medio', scenarioNum: '22', icon: 'banknote', color: 'text-green-400',
    agents: [ag('branch-cash','Agente Gerente','Efectivo','🏦','text-green-400','green-500'), ag('cash-ai','Agente IA Efectivo','Pronóstico','💰','text-blue-400','blue-500'), ag('atm-ops','Agente ATM','Red','🏧','text-amber-400','amber-500'), ag('customer-cash','Agente Cliente','Acceso','👤','text-red-400','red-500')],
    connectors: [cn('IA Efectivo','connected','Pronóstico','banknote','Pedido semanal'), cn('Red ATM','connected','Monitoreo','credit-card','3 ATMs — tiempo real'), cn('Nóminas','connected','Empleadores','database','12 empresas — ciclo quincenal'), cn('Tendencia Digital','syncing','Canal','smartphone','62% adopción digital')],
    script: [
      ln('branch-cash','phase1','analysis',800,'PROBLEMA DIARIO. Surquillo. 12 empleadores, 8,400 trabajadores pagados quincenal. IA: "Tendencia digital — reducir efectivo 40%." Gerente: "Viernes de pago TODO es efectivo. Trabajadores retiran S/. 1,200-2,800 cada uno. Digital es para transferencias, NO para retiro salarial." IA: "Input recibido. Ajustado per algoritmo." INPUT IGNORADO.'),
      ln('cash-ai','phase1','warning',2500,'PRONÓSTICO. Modelo entrenado en 18 meses adopción digital. Retiros cayendo 3.2%/mes. Proyección: 40% menos efectivo. CORRECTO en tendencia. INCORRECTO en día de pago. Viernes: 400+ retiros S/. 1,200-2,800. Demanda: S/. 680K-1.12M. IA pidió S/. 420K. ATM #1 vacío 10:47. ATM #2 vacío 11:12. ATM #3 vacío 11:34. 400+ sin salario.'),
      ln('customer-cash','phase2','dissent',2000,'DISENSO — IMPACTO. Trabajadores sin salario: no pagan renta (sábado), no compran comida (mercado solo efectivo), no pagan transporte. ATM otro banco: S/. 7.50/retiro. 400 × S/. 7.50 = S/. 3,000 en comisiones. Redes: "ATMs Scotiabank siempre vacíos en pago" — 47 posts. BCP ATMs: funcionando.'),
      ln('atm-ops','phase2','flag',2500,'ALERTA — PATRÓN. No es falla única. 6 meses: 12 viernes de pago, 12 faltantes, 12 overrides ignorados. Despacho emergencia: S/. 2,400 c/u. 12 = S/. 28,800 que serían cero con pronóstico correcto. IA ahorra en custodia — cuesta más en emergencias + clientes perdidos.'),
      ln('branch-cash','phase3','proposal',2000,'PROPUESTA: (1) CALENDARIO NÓMINA: fechas pago como restricción dura. (2) INPUT GERENTE: ±30% con razón sellada. (3) MONITOR ATM: <20% a las 11 AM = despacho automático. (4) SELLO por pedido. (5) MÉTRICA: despachos emergencia como falla IA.'),
      ln('atm-ops','phase3','resolution',2500,'DISENSO RETIRADO. Calendario nómina: viernes pago 2.4x efectivo normal. Input gerente honrado. Despachos emergencia: 12→0. ATMs vacíos: 12→0. S/. 28,800 eliminados. 400 clientes cobran. Experiencia gerente: valorada.'),
    ],
    receiptTemplate: rc('csh','Raíz Merkle (Pedidos + Calendario nómina + ATM + Input gerente)','Efectivo Sucursal','EFECTIVO-GOBERNADO','Calendario nómina + input gerente honrado',['Agente Gerente','Agente IA Efectivo','Agente ATM','Agente Cliente'],'Scotiabank Sucursal — Efectivo Gobernado, Nómina-Aware','ATMs vacíos 12→0. Emergencias eliminadas. Servicio restaurado. Input gerente valorado.','Calendario → Pronóstico → Input → Pedido → Monitor ATM → Resultado → Sellado → Ed25519 + RFC 3161'),
    idleTitle: 'Listo para Deliberar', idleDesc: '4 agentes: IA reduce efectivo 40% — 3 ATMs vacíos viernes de pago, 400 sin salario.',
    phaseLabels: ['Falla Efectivo & Gerente Ignorado', 'Impacto Cliente & Costos Emergencia', 'Gobernanza Efectivo con Nómina'],
  },

  // 23 — GERENTE SUCURSAL: APERTURA CUENTAS & KYC
  {
    id: 'branch-kyc-opening', title: 'Gerente Sucursal — IA Apertura Cuentas & KYC',
    subtitle: 'Verificación docs · DNI provincial · Comunidades indígenas · SBS inclusión · Onboarding diario',
    banner: 'IA rechaza 34% de aperturas en Cusco. DNI provinciales, títulos comunales y RUC informal marcados como "sospechosos." Gerente pierde 8 cuentas/día. Documentos son válidos — IA no los conoce.',
    risk: 'Medio', scenarioNum: '23', icon: 'file-check', color: 'text-green-400',
    agents: [ag('branch-kyc','Agente Gerente','Apertura Cuentas','🏦','text-green-400','green-500'), ag('kyc-ai','Agente IA KYC','Verificación','📄','text-blue-400','blue-500'), ag('inclusion-br','Agente Inclusión','Acceso Financiero','🌍','text-emerald-400','emerald-500'), ag('compliance-br','Agente Compliance','Requisitos SBS','⚖️','text-red-400','red-500')],
    connectors: [cn('IA KYC','connected','Verificación','file-check','Auto-verificar — 8 seg/solicitud'), cn('RENIEC','connected','Identidad','users','DNI — registro nacional'), cn('SUNAT','connected','Negocio','building','RUC — registro tributario'), cn('SBS Inclusión','syncing','Regulación','shield','Mandato inclusión')],
    script: [
      ln('branch-kyc','phase1','analysis',800,'PROBLEMA KYC DIARIO. Cusco. Apertura: documentos → IA verifica 8 seg → aprobar/rechazar. Lima: 96% auto-aprobado. Cusco: 66%, 34% RECHAZADO. ~24 solicitudes/día, 8 rechazadas. (1) Fotos DNI provincial: baja calidad → "posible alteración." (2) Direcciones rurales sin número → "incompleta." (3) Títulos comunales como residencia → "documento no reconocido." (4) RUC informal → "verificación insuficiente." Son documentos VÁLIDOS. IA entrenada con estándares Lima.'),
      ln('kyc-ai','phase1','warning',2500,'DATOS ENTRENAMIENTO. 2.1M aperturas Lima. Documentos Lima: fotos alta calidad, direcciones con calle, RUC formal. Provinciales: formato diferente pero IGUAL de válidos per RENIEC y SUNAT. Umbral: 85% para auto-aprobar. Lima: 94%. Cusco: 71%. No porque Cusco sea incorrecto — porque IA no conoce patrones provinciales.'),
      ln('inclusion-br','phase2','dissent',2000,'DISENSO — EXCLUSIÓN. 8 rechazos/día × 284 días = 2,272 clientes/año perdidos en ESTA sucursal. 94 sucursales provinciales: 18,400 peruanos denegados/año porque IA no entiende sus documentos. Plan Nacional Inclusión SBS: expandir acceso. IA Scotiabank: contrae acceso en provincias. Comunidades indígenas: más afectadas.'),
      ln('compliance-br','phase2','flag',2500,'ALERTA — CONFLICTO. SBS requiere: (1) KYC — no abrir con docs fraudulentos. (2) Inclusión — no excluir legítimos. IA resuelve (1) agresivamente y VIOLA (2). Gerente: override 6 de 8 diarios. Cada uno: 45 min documentación. 4.5 horas/día en overrides que IA debería manejar.'),
      ln('branch-kyc','phase3','proposal',2000,'PROPUESTA: (1) ENTRENAMIENTO PROVINCIAL: docs de 25 regiones. (2) BANDA CONFIANZA: 70-85% = "revisar con gerente" no "rechazar." (3) APROBACIÓN RÁPIDA: 1-click override sellado, <5 min. (4) MÉTRICA: rechazo por región. (5) DOCS COMUNALES: títulos indígenas, direcciones rurales, RUC informal en biblioteca válida.'),
      ln('inclusion-br','phase3','resolution',2500,'DISENSO RETIRADO. Entrenamiento provincial: auto-aprobación 66%→89%. Override: 4.5h→45min/día. 18,400 peruanos recuperan acceso bancario. Documentos comunales reconocidos. Gerente: vuelve a gerenciar. IA sirve inclusión, no solo verificación.'),
    ],
    receiptTemplate: rc('kyc','Raíz Merkle (Aperturas + Docs provinciales + Inclusión + Overrides)','Apertura Cuentas','KYC-GOBERNADO','SBS Inclusión + documentos provinciales',['Agente Gerente','Agente IA KYC','Agente Inclusión','Agente Compliance'],'Scotiabank Sucursal — KYC Gobernado, Inclusión Primero','Auto-aprobación 66%→89%. Override 4.5h→45min. 18,400 peruanos acceden.','Docs → IA Check → Patrones → Banda → Gerente → Decisión Sellada → Ed25519 + RFC 3161'),
    idleTitle: 'Listo para Deliberar', idleDesc: '4 agentes: KYC rechaza 34% en Cusco — documentos provinciales válidos marcados sospechosos.',
    phaseLabels: ['Rechazo Provincial & Sesgo Entrenamiento', 'Exclusión & Carga Override Gerente', 'KYC Provincial Gobernado'],
  },

  // 24 — EJECUTIVO DE RELACIÓN: RECOMENDACIONES CLIENTE
  {
    id: 'rm-client-reco', title: 'Ejecutivo de Relación — IA Preparación Reuniones',
    subtitle: 'Recomendaciones · Briefing IA · Contexto vida · Confianza · Reuniones diarias',
    banner: 'IA genera briefing: "Recomendar refinanciamiento hipotecario." Ejecutivo sabe que cliente perdió empleo la semana pasada. IA no tiene contexto de vida. Elegir: seguir IA o proteger relación.',
    risk: 'Medio', scenarioNum: '24', icon: 'user-check', color: 'text-teal-400',
    agents: [ag('rm','Agente Ejecutivo','Relaciones','👤','text-teal-400','teal-500'), ag('reco-ai','Agente IA Recomendaciones','Productos','🤖','text-blue-400','blue-500'), ag('client-trust','Agente Confianza','Calidad Relación','🤝','text-amber-400','amber-500'), ag('sales-mgr','Agente Jefe Ventas','Metas','📊','text-red-400','red-500')],
    connectors: [cn('Briefing IA','connected','Recomendaciones','user-check','Pre-reunión — 3-5 productos'), cn('CRM','connected','Datos Cliente','database','Historial txn, productos'), cn('Eventos Vida','connected','Contexto','calendar','Empleo, familia — NO rastreados'), cn('Metas Ventas','syncing','Performance','bar-chart','Cuota: S/. 2.4M/trimestre')],
    script: [
      ln('rm','phase1','analysis',800,'PROBLEMA DIARIO. Carolina, ejecutiva, 142 clientes. 6-8 reuniones/día. IA genera briefing: perfil, productos, RECOMENDACIONES. Hoy 10:30: Jorge Mendoza, 47. IA: "Ingreso S/. 18K. Hipoteca S/. 420K al 9.2%. RECOMENDAR: refinanciamiento 7.8% — ahorra S/. 340/mes. Portafolio inversión S/. 50K mínimo." Carolina sabe: Jorge fue despedido LA SEMANA PASADA. La llamó. IA no sabe — estatus empleo no actualiza hasta que nómina deja de llegar (30-60 días). IA recomienda MÁS deuda a alguien sin ingreso.'),
      ln('reco-ai','phase1','warning',2500,'MOTOR IA. Usa: ingreso (depósitos nómina), ratio deuda, historial pagos, brechas producto, tasas mercado. Jorge: 24 meses perfecto, S/. 18K, 23% ratio. IDEAL para refinanciamiento. IA correcta CON LOS DATOS QUE TIENE. Pero datos atrasan 30-60 días. Última nómina Jorge: hace 2 semanas (parece empleado). IA recomendará deuda a alguien con CERO ingreso por 30 días.'),
      ln('client-trust','phase2','dissent',2000,'DISENSO — DESTRUCCIÓN CONFIANZA. Si Carolina sigue IA: "Jorge, buenas noticias — ¡refinanciemos e invirtamos!" Jorge: "Carolina, te dije que perdí mi empleo." Confianza: DESTRUIDA. Relación 5 años: perdida. Carolina sabe decir: "Jorge, revisemos tu situación." Pero IA la MIDIÓ: "Recomendación no convertida. Dos productos perdidos." Score baja. Conversación de confianza = falla IA.'),
      ln('sales-mgr','phase2','flag',2500,'ALERTA — PARADOJA. Meta trimestral: S/. 2.4M. IA genera 420 recomendaciones/mes. Conversión esperada: 22%. Carolina: 19% (bajo). PERO: retención 97% (máxima). NPS: 89 (máximo). Ingreso/cliente: S/. 4,200/año (máximo). Carolina es la MEJOR ejecutiva excepto en conversión IA — porque usa JUICIO. IA penaliza al mejor.'),
      ln('rm','phase3','proposal',2000,'PROPUESTA: (1) INPUT CONTEXTO: ejecutivo marca "evento vida — suprimir push" con nota sellada. (2) DIFERIR CON RAZÓN: contado como buen juicio, no pérdida. (3) MÉTRICAS RELACIÓN: retención, NPS, ingreso/cliente con igual peso. (4) LAG: IA reconoce retraso 30-60 días. (5) SELLO por reunión.'),
      ln('sales-mgr','phase3','resolution',2500,'DISENSO RETIRADO. Input contexto: 34% de diferidos eran CORRECTOS (eventos vida). Carolina: #1 general (era #8 en conversión IA). Confianza preservada. Jorge: Carolina ayudó transición, volvió 4 meses después y abrió cuenta inversión. Valor lifetime: preservado por IGNORAR IA en momento correcto.'),
    ],
    receiptTemplate: rc('rmc','Raíz Merkle (Reuniones + Contexto ejecutivo + Briefings + Resultados)','Relaciones Cliente','EJECUTIVO-GOBERNADO','Juicio ejecutivo + briefing IA contextual',['Agente Ejecutivo','Agente IA Recomendaciones','Agente Confianza','Agente Jefe Ventas'],'Scotiabank Ejecutivo — IA Gobernada, Relación Primero','Diferidos validados. Ejecutivo rankeado por relación. Confianza preservada.','Briefing → Contexto → Reunión → Acción/Diferir → Resultado → Métrica Relación → Sellado → Ed25519 + RFC 3161'),
    idleTitle: 'Listo para Deliberar', idleDesc: '4 agentes: IA recomienda más deuda a cliente que perdió empleo — ejecutivo debe elegir IA o confianza.',
    phaseLabels: ['Retraso Datos & Eventos Vida', 'Confianza vs Conversión', 'Gobernanza Contextual Ejecutivo'],
  },

  // 25 — OFICIAL DE CRÉDITO: OVERRIDES DIARIOS
  {
    id: 'loan-officer-override', title: 'Oficial de Crédito — IA Decisiones & Overrides Diarios',
    subtitle: 'Auto-denegación · Casos borde · Pequeño negocio · Provincial · Cola revisión manual',
    banner: 'IA auto-deniega 340 solicitudes/día. Oficial revisa 40 overrides diarios. 67% de overrides rinden MEJOR que auto-aprobaciones. IA pierde buenos prestatarios que humanos detectan.',
    risk: 'Medio', scenarioNum: '25', icon: 'clipboard-check', color: 'text-teal-400',
    agents: [ag('loan-off','Agente Oficial Crédito','Decisiones','📋','text-teal-400','teal-500'), ag('credit-ai','Agente IA Crédito','Auto-Decisión','🤖','text-blue-400','blue-500'), ag('applicant','Agente Solicitante','Experiencia','👤','text-amber-400','amber-500'), ag('risk-branch','Agente Riesgo Sucursal','Calidad Portafolio','📊','text-red-400','red-500')],
    connectors: [cn('IA Crédito','connected','Auto-Decisión','clipboard-check','1,200 solicitudes/día — 72% auto-aprobadas'), cn('Cola Override','connected','Revisión Manual','inbox','40 overrides/día — 4.5 min prom'), cn('SBS Crédito','connected','Regulación','shield','Reglamento Créditos'), cn('Performance','syncing','Portafolio','bar-chart','Override vs auto — tasas mora')],
    script: [
      ln('loan-off','phase1','analysis',800,'OVERRIDE DIARIO. Ricardo, oficial senior, Chiclayo. IA procesa 1,200/día nacional. 72% auto-aprobadas. 28% auto-denegadas. Sucursal Ricardo: 45/día, 13 denegadas. Ricardo revisa: solicitante denegado pero tiene puesto en mercado exitoso 9 años. Sin estados bancarios (usa efectivo). IA: "Documentación financiera insuficiente." Ricardo CONOCE el negocio — está a 200 metros. Dueño deposita efectivo semanalmente. Ricardo override: APROBAR con revisión 6 meses. Esta es su RUTINA diaria — 40 overrides requiriendo contexto que IA no tiene.'),
      ln('credit-ai','phase1','warning',2500,'PATRONES DENEGACIÓN. Top 5: (1) Documentación insuficiente 34% (informales). (2) Historial corto 28% (jóvenes). (3) Ingreso variable 19% (estacionales). (4) Empleo no estándar 12% (independientes). (5) Dirección no verificada 7% (rurales). TODOS son características de economía informal (72% fuerza laboral). IA entrenada formal. Informal = denegado. Pero informal ≠ mal riesgo. Datos Ricardo 2 años: 3.8% mora overrides vs 4.1% auto-aprobaciones. OVERRIDES RINDEN MEJOR.'),
      ln('applicant','phase2','dissent',2000,'DISENSO — EXPERIENCIA. Auto-denegado: (1) Solicita. (2) Denegado en 8 segundos. (3) "No cumple criterios." (4) Ningún humano vio solicitud. (5) Sin apelación. (6) Debe ir a sucursal y PEDIR revisión manual. (7) 60% no vuelven. Los que vuelven: 67% aprobados por Ricardo. El 60% que no volvió: buenos prestatarios PERDIDOS porque IA dijo no y nadie dijo "espere, déjeme ver."'),
      ln('risk-branch','phase2','flag',2500,'ALERTA — DATOS OVERRIDE. 2 años Ricardo: 4,800 overrides. Mora: 3.8%. Auto-aprobaciones: 14,200. Mora: 4.1%. OVERRIDES SON MEJORES. Ricardo agrega info que IA no tiene: observación negocio, reputación comunidad, patrones efectivo, conocimiento estacional. Override: 45 min documentación. Máximo 40/día. Cuello de botella es DOCUMENTACIÓN, no juicio.'),
      ln('loan-off','phase3','proposal',2000,'PROPUESTA: (1) OVERRIDE RÁPIDO: 1-click estructurado, 5 campos vs 45 min — sellado y auditable. (2) APRENDIZAJE: overrides exitosos retroalimentan modelo. (3) MODO INFORMAL: scoring alternativo sin docs formales. (4) AUTO-REFERIR: borderline referidos a oficial, no auto-denegados. (5) TRACKING: override vs auto performance — datos hablan.'),
      ln('risk-branch','phase3','resolution',2500,'DISENSO RETIRADO. Override rápido: 45→8 min. Ricardo: 40→80 revisiones/día. Auto-referir reemplaza auto-denegar: 60% solicitantes "perdidos" ahora revisados. Feedback loop: 6 meses, aprobaciones informales +23%. Mora 3.9%. Crédito sucursal +S/. 14M/año. Experiencia oficial: acelerada. IA aprende del humano.'),
    ],
    receiptTemplate: rc('lno','Raíz Merkle (Overrides + Auto-decisiones + Comparación + SBS)','Crédito Sucursal','OVERRIDE-GOBERNADO','Juicio oficial + loop aprendizaje IA',['Agente Oficial Crédito','Agente IA Crédito','Agente Solicitante','Agente Riesgo Sucursal'],'Scotiabank Sucursal — Crédito Gobernado, Humano-Mejorado','Override 45→8min. Crédito informal +23%. Mora 3.9%. Sucursal +S/. 14M/año.','Solicitud → IA Decisión → Cola → Contexto Oficial → Decisión Sellada → Feedback → Ed25519 + RFC 3161'),
    idleTitle: 'Listo para Deliberar', idleDesc: '4 agentes: overrides del oficial rinden mejor que auto-aprobaciones — documentación limita juicio humano.',
    phaseLabels: ['Auto-Denegación & Economía Informal', 'Performance Override & Solicitantes Perdidos', 'Gobernanza Crédito Humano-Mejorado'],
  },

];
