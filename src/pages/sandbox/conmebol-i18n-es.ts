/**
 * CONMEBOL Sandbox — Spanish (ES) Translations
 * Applied at runtime via applySpanish() in ConmebolSandboxPage.tsx.
 * @module pages/sandbox/conmebol-i18n-es
 */
// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

export interface ScenarioES {
  title: string;
  subtitle: string;
  banner: string;
  idleTitle: string;
  idleDesc: string;
  phaseLabels: [string, string, string];
  scriptContent: string[];
  scenarioNum: string;
  receipt: {
    merkleLabel: string;
    complianceLabel: string;
    complianceValue: string;
    complianceThreshold: string;
    guaranteeTitle: string;
    guaranteeBody: string;
    evidenceChain: string;
  };
  connectors: { name: string; type: string; detail: string }[];
  agentRoles: Record<string, string>;
}

const R: Record<string, string> = {
  doj: 'Monitoreo del DOJ de EE.UU. y Anticorrupción',
  integrity: 'Detección de Amaño de Partidos y Anomalías de Apuestas',
  legal: 'Jurisprudencia del TAS y Cumplimiento en 10 Jurisdicciones',
  commercial: 'Valoración de Derechos de Medios y Cumplimiento Anticorrupción',
  whistle: 'Anonimato Criptográfico y Firmas de Anillo',
  tpo: 'Propiedad de Terceros y Análisis de Sociedades Ficticias',
  youth: 'Artículo 19 de FIFA y Protección de Menores',
  finance: 'Asignación de Ingresos y Monitoreo de Equidad',
  doping: 'Código WADA y Cadena de Custodia Transfronteriza',
  var: 'Tecnología de Arbitraje y Cumplimiento IFAB',
  ethics: 'Aplicación Antirracismo y Protocolo de Tres Pasos FIFA',
  governance: 'Integridad Electoral Post-FIFAgate y Conflictos de Interés',
};

export const ES_DATA: Record<string, ScenarioES> = {};

ES_DATA['doj-compliance'] = {
  title: 'Post-FIFAgate — Auditoría de Cumplimiento del DOJ',
  subtitle: 'Monitoreo FBI/DOJ · 7 ejecutivos encarcelados · Ciclo Copa América $1.500M · Escrutinio federal continuo',
  banner: 'Simulando una revisión de cumplimiento del DOJ de EE.UU. sobre la gobernanza reformada de CONMEBOL tras el escándalo FIFAgate de 2015. El DOJ exige evidencia en tiempo real de que cada decisión demuestra integridad — prueba criptográfica de gobernanza reformada.',
  scenarioNum: 'Auditoría DOJ',
  idleTitle: 'Listo para Deliberar',
  idleDesc: '4 agentes de IA prepararán la presentación de cumplimiento ante el DOJ post-FIFAgate — transformando "autocertificación" en prueba criptográfica de gobernanza reformada.',
  phaseLabels: ['Requisitos de Revisión DOJ', 'Análisis Legal y de Propiedad', 'Protocolo de Divulgación Proactiva'],
  connectors: [
    { name: 'Portal de Cumplimiento DOJ', type: 'Interfaz de Monitoreo Federal', detail: 'Monitoreo activo — revisión trimestral en 14 días' },
    { name: 'Libro Mayor Financiero CONMEBOL', type: 'Seguimiento de Ingresos y Gastos', detail: 'Copa Libertadores 2026: $847M en acuerdos comerciales' },
    { name: 'Archivo del Caso Traffic Sports', type: 'Evidencia Histórica de Corrupción', detail: 'Acusaciones 2015: 42 individuos, 7 ejecutivos CONMEBOL' },
    { name: 'Base de Datos de Derecho Suizo', type: 'Derecho Corporativo Paraguayo y Suizo', detail: 'Estatutos CONMEBOL + marco de asociación suizo' },
  ],
  agentRoles: R,
  scriptContent: [
    'ALERTA DE REVISIÓN TRIMESTRAL. El DOJ, Distrito Este de Nueva York, ha solicitado el paquete de evidencia de cumplimiento Q2 2026 de CONMEBOL. Áreas de enfoque: (1) Todos los acuerdos comerciales >$5M — el DOJ quiere prueba de licitación competitiva, (2) Renovación de derechos de transmisión de Copa Libertadores ($340M/año) — el escándalo de 2015 se centró en Traffic Sports y Datisa sobornando a funcionarios por estos derechos, (3) Pagos a intermediarios >$100K. El monitor del DOJ señaló que la presentación anterior dependía de "autocertificación" en lugar de evidencia independiente. Esto ya no es aceptable.',
    'Análisis de renovación de derechos de transmisión completado. Acuerdo actual: $340M/año con un consorcio. Nuestro modelo de Valor Justo de Mercado — entrenado con 2.400 acuerdos comparables — establece el rango en $310-365M. El acuerdo está dentro del rango. Sin embargo, el consorcio ganador incluye una entidad con vínculos indirectos de propiedad a un antiguo socio comercial de CONMEBOL de la era pre-2015. No constituye corrupción, pero crea un riesgo óptico que el DOJ cuestionará.',
    'DISENSO REGISTRADO. El vínculo indirecto es legalmente permisible — la entidad pasó verificación de integridad de FIFA. Sin embargo, el estándar del DOJ no es "legalmente permisible" sino "demostrablemente reformado." Bajo los Factores Filip, CONMEBOL debe demostrar que su programa es "efectivo en la práctica." Un vínculo con un socio pre-escándalo será escrutado. Exijo que el proceso de licitación sea reconstruido con evidencia completa: cada oferta, cada criterio de evaluación, cada puntuación y la justificación documentada.',
    'BANDERA LEVANTADA. Referencia cruzada de propiedad beneficiaria del consorcio contra la base de DPA del DOJ. El vínculo traza a través de 3 capas corporativas hasta un testigo (no acusado) en el juicio de Traffic Sports que se desinvirtió en 2018. El vínculo está a 2 capas de la entidad licitante. En contexto normal es irrelevante. En el escrutinio post-FIFAgate, el DOJ preguntará por qué CONMEBOL no señaló esto en su diligencia debida.',
    'Proponiendo Paquete de Evidencia Listo para DOJ: (1) Reconstrucción completa — 4 ofertas, matriz de 12 factores, puntuación de 5 miembros del comité. Cada paso sellado con CendiaChronos. (2) Adenda de diligencia debida — vínculo divulgado proactivamente con análisis de 3 capas corporativas y desinversión 2018. (3) Validación VJM — 2.400 acuerdos prueban que $340M está en rango. (4) Paquete formateado para DOJ con Recibo del Regulador de un clic. No más "autocertificación" — prueba matemática de cumplimiento.',
    'El Paquete transforma la posición de CONMEBOL. En lugar de responder "¿por qué no detectaron esto?" CONMEBOL divulga proactivamente. El sellado criptográfico permite al DOJ verificar documentación en tiempo real. El modelo VJM satisface "criterios objetivos." Disenso RETIRADO. Este es el estándar de evidencia que el DOJ pide desde 2016.',
  ],
  receipt: {
    merkleLabel: 'Raíz Merkle (4 ofertas + evaluación 12 factores + Traza de propiedad + Datos VJM)',
    complianceLabel: 'Estado Cumplimiento DOJ',
    complianceValue: 'DIVULGACIÓN PROACTIVA',
    complianceThreshold: 'Factores Filip satisfechos',
    guaranteeTitle: 'DOJ Distrito Este — Evidencia de Gobernanza Reformada Sellada',
    guaranteeBody: 'Paquete criptográfico que sella la evidencia Q2 2026: reconstrucción de licitación con 4 ofertas, matriz de 12 factores, traza de propiedad a través de 3 capas, benchmark VJM de 2.400 acuerdos, y divulgación proactiva del vínculo pre-escándalo. Cada documento con marca CendiaChronos probando captura en tiempo real.',
    evidenceChain: 'RFP Copa Libertadores → 4 ofertas → Evaluación 12 factores → Puntuación comité → Traza propiedad → Análisis 3 capas → Validación VJM → Divulgación proactiva → Formato DOJ → Sello ML-DSA-65',
  },
};

ES_DATA['match-fixing'] = {
  title: 'Copa Libertadores — Red de Amaño de Partidos',
  subtitle: 'Fase de grupos · Anomalía de apuestas en 4 países · Sindicato criminal · Coordinación INTERPOL',
  banner: 'Simulando detección de amaño durante fase de grupos de Copa Libertadores donde monitores de IA detectan anomalías coordinadas en casas de apuestas de Argentina, Colombia, Paraguay y Malasia. La investigación debe abarcar 4 jurisdicciones sin alertar al sindicato.',
  scenarioNum: 'Amaño',
  idleTitle: 'Listo para Deliberar',
  idleDesc: '4 agentes de IA responderán a una amenaza de amaño coordinada en 4 jurisdicciones — construyendo evidencia sellada mientras coordinan intervención INTERPOL antes del pitazo inicial.',
  phaseLabels: ['Detección de Anomalías e Inteligencia', 'Análisis Legal Multijurisdiccional', 'Protocolo de Intervención Coordinada'],
  connectors: [
    { name: 'Plataforma de Integridad CONMEBOL', type: 'Detección de Anomalías de Apuestas', detail: 'ALERTA: Anomalías coordinadas en 4 jurisdicciones' },
    { name: 'Sportradar Integridad', type: 'Monitoreo Global de Apuestas', detail: 'Feed en tiempo real: 400+ casas de apuestas en Sudamérica y Asia' },
    { name: 'Unidad de Amaño INTERPOL', type: 'Coordinación Multijurisdiccional', detail: 'Canal seguro — Argentina, Colombia, Paraguay en espera' },
    { name: 'Base Disciplinaria CONMEBOL', type: 'Casos Históricos de Integridad', detail: '347 investigaciones previas indexadas' },
  ],
  agentRoles: R,
  scriptContent: [
    'ALERTA CRÍTICA. Anomalías coordinadas detectadas en Grupo F, Partido #24 (Club A vs Club B, en 48 horas). Datos Sportradar: (1) Cuotas "Exacto 0-0" de 9/1 a 3/1 en 7 casas sudamericanas — 640% sobre volumen normal. (2) Actividad simultánea en hándicap asiático en 4 casas malasias, consistente con apuestas de sindicato. (3) Firma de anomalía coincide con 3 casos confirmados en Copa Sudamericana 2019-2022. El sindicato apunta a un empate 0-0 comprometiendo atacantes de ambos equipos.',
    'Referencia cruzada con investigaciones del DOJ sobre crimen organizado sudamericano. El sindicato malasio coincide con red identificada en acusación del DOJ de 2023 (Caso SDNY 23-CR-847). El patrón de intermediarios — "corredores" locales en Buenos Aires y Bogotá acercándose a jugadores por conexiones sociales — es consistente con inteligencia del DOJ. Si CONMEBOL no actúa y el partido resulta amañado, el DOJ lo verá como evidencia de reformas insuficientes. Debemos demostrar intervención proactiva.',
    'DISENSO REGISTRADO. La investigación abarca 4 jurisdicciones: (1) Argentina — Policía Federal, (2) Colombia — Fiscalía General, (3) Paraguay — sede CONMEBOL, acción disciplinaria, (4) Malasia — Policía Real. No podemos compartir inteligencia con las 4 sin arriesgar filtración que alerte al sindicato. La policía argentina tiene historial de filtraciones a medios. Exijo protocolo de notificación escalonada: primero INTERPOL, luego cada autoridad bajo condiciones selladas con embargo de 24 horas.',
    'BANDERA LEVANTADA. CendiaWhistle ha recibido reporte anónimo corroborante desde uno de los clubes: "A un jugador le ofrecieron $200.000 por segunda amarilla en el primer tiempo." La firma de anillo confirma autenticación en el sistema de CONMEBOL con identidad matemáticamente sellada. Esto eleva de "patrón sospechoso" a "inteligencia accionable." El acercamiento sugiere un resultado táctico específico (10 hombres → juego defensivo → 0-0).',
    'Proponiendo protocolo coordinado: (1) INTERPOL notificada vía canal sellado — briefing seguro simultáneo a las 4 jurisdicciones. Inteligencia sellada criptográficamente. (2) Capitanes y DT informados 6 horas antes bajo protocolo confidencial. (3) Monitoreo mejorado en partido: cada amarilla, sustitución e interrupción rastreada en tiempo real. (4) Reporte CendiaWhistle sellado por separado para persecución criminal. (5) Apuestas del sindicato monitoreadas en tiempo real para máxima evidencia.',
    'Notificación escalonada vía INTERPOL satisface las 4 jurisdicciones minimizando filtración. Firma de anillo CendiaWhistle es admisible bajo Código Penal Argentino, procedimiento colombiano, ley paraguaya y Ley de Evidencia de Malasia. Embargo de 24 horas previene filtraciones. Disenso RETIRADO. Protocolo transforma investigación reactiva en aplicación proactiva, multijurisdiccional y sellada.',
  ],
  receipt: {
    merkleLabel: 'Raíz Merkle (Datos Sportradar + Reporte CendiaWhistle + Referencia INTERPOL + Evidencia 4 jurisdicciones)',
    complianceLabel: 'Integridad del Partido',
    complianceValue: 'INTERVENCIÓN ACTIVA',
    complianceThreshold: '4 jurisdicciones coordinadas',
    guaranteeTitle: 'Integridad CONMEBOL — Evidencia Multijurisdiccional Sellada',
    guaranteeBody: 'Paquete que sella la investigación completa: detección Sportradar en 7 casas, reporte CendiaWhistle con firma de anillo, coordinación INTERPOL con 4 países, y protocolo de monitoreo mejorado. Cadena admisible en las 4 jurisdicciones. Identidad del denunciante matemáticamente imposible de extraer.',
    evidenceChain: 'Anomalía Sportradar → Patrones (3 casos) → Sindicato DOJ → CendiaWhistle → INTERPOL sellado → 4 jurisdicciones → Briefing clubes → Monitoreo mejorado → Sello ML-DSA-65',
  },
};

ES_DATA['tpo-detection'] = {
  title: 'Detección TPO — Red Oculta de Propiedad de Terceros',
  subtitle: 'Club Copa Libertadores · Transferencia $18M · 3 sociedades ficticias · Elusión de prohibición FIFA',
  banner: 'Simulando detección de Propiedad de Terceros oculta en una transferencia de Copa Libertadores donde IA revela una red de sociedades ficticias en Uruguay, Panamá e Islas Vírgenes Británicas para eludir la prohibición TPO de FIFA 2015.',
  scenarioNum: 'Detección TPO',
  idleTitle: 'Listo para Deliberar',
  idleDesc: '4 agentes de IA detectarán y desmantelarán una red TPO oculta en 4 países — bloqueando una transferencia de $18M y refiriendo conexiones de lavado al DOJ.',
  phaseLabels: ['Detección de Sociedades Ficticias', 'Análisis Legal y del DOJ', 'Protocolo de Bloqueo y Referencia'],
  connectors: [
    { name: 'Portal FIFA TMS', type: 'Sistema de Transferencias', detail: 'Transferencia #2026-SA-4847: $18M, Jugador X, Club A → Club B' },
    { name: 'Motor Detección TPO CONMEBOL', type: 'Análisis de Propiedad Beneficiaria', detail: 'Detección IA activa — base de 12.000 entidades' },
    { name: 'Registros Nacionales de Empresas', type: 'Uruguay · Panamá · IVB', detail: 'Consulta de propiedad beneficiaria en tiempo real' },
    { name: 'Base de Aplicación TPO FIFA', type: 'Violaciones Históricas TPO', detail: '284 casos previos indexados desde prohibición 2015' },
  ],
  agentRoles: R,
  scriptContent: [
    'BANDERA CRÍTICA. Transferencia #2026-SA-4847: Jugador X de Club A (Argentina) a Club B (Brasil) por $18M. Análisis IA detecta anomalías: (1) Propiedad declarada del club vendedor es 100%, pero instrucciones de pago dirigen 35% ($6,3M) a "Inversiones Río de la Plata S.A." — empresa uruguaya de 11 meses sin operaciones futbolísticas. (2) 15% adicional ($2,7M) a "Pacific Sports Holdings Ltd" en Panamá con agente en IVB. (3) El agente del jugador es director de ambas. Estructura TPO de manual: sociedades ficticias para derechos económicos ocultos. La prohibición TPO (Art. 18ter RETJ) está vigente desde 2015 pero Sudamérica sigue siendo la región de mayor riesgo.',
    'Análisis financiero confirma hipótesis TPO. Entidad uruguaya: (1) Cero empleados, (2) Capital de $1.000, (3) Única actividad: recibir pagos de transferencias — 4 transacciones previas por $9,2M con jugadores sudamericanos. Entidad panameña traza 2 capas hasta fondo de inversión en Singapur con actividad TPO conocida. No es caso límite — es red organizada en al menos 3 países usando sociedades ficticias para derechos económicos fraccionarios.',
    'DISENSO REGISTRADO. Ambos clubes alegarán desconocimiento de la estructura TPO. Bajo Art. 18ter(4), deben realizar "diligencia debida" pero el estándar es vago. Argumentarán: (1) Instrucciones del agente, no de los clubes, (2) Entidad uruguaya es "derechos de imagen" legítima, (3) Prohibición TPO no cubre "derechos de imagen." Necesitamos cerrar cada vía de escape en el TAS antes del bloqueo.',
    'BANDERA LEVANTADA. El fondo de Singapur aparece en lista de vigilancia de lavado del DOJ 2024. Transferencias en dólares a través de bancos corresponsales de EE.UU. crean jurisdicción federal bajo 18 U.S.C. § 1956. Si CONMEBOL no señala esto al DOJ, la credibilidad post-FIFAgate queda destruida. Debe referirse como divulgación proactiva simultáneamente con el bloqueo.',
    'Proponiendo Protocolo de Bloqueo Total TPO: (1) TRANSFERENCIA BLOQUEADA — ningún fondo liberado. (2) Evidencia sellada: traza completa Uruguay → Panamá → IVB → Singapur con 4 transacciones previas. (3) FIFA TMS notificado. (4) Clubes con ventana de 30 días. (5) Agente marcado — escrutinio mejorado futuro. (6) Divulgación proactiva al DOJ de conexión de lavado con Singapur.',
    'Protocolo cierra todas las vías TAS: (1) Defensa de "imagen" neutralizada por 4 transacciones previas — TAS 2020/A/7356 estableció que enrutamiento sistemático constituye TPO. (2) Defensa de "desconocimiento" debilitada por vínculo agente-director. (3) Divulgación DOJ demuestra cooperación anticorrupción. Disenso RETIRADO. Acción TPO más completa en historia de CONMEBOL.',
  ],
  receipt: {
    merkleLabel: 'Raíz Merkle (Traza propiedad + 4 sociedades ficticias + FIFA TMS + Referencia DOJ)',
    complianceLabel: 'Aplicación TPO',
    complianceValue: 'TRANSFERENCIA BLOQUEADA',
    complianceThreshold: 'Violación RETJ 18ter confirmada',
    guaranteeTitle: 'Prohibición TPO FIFA — Bloqueo con Referencia DOJ',
    guaranteeBody: 'Investigación TPO completa sellada: traza por Uruguay/Panamá/IVB/Singapur, 4 transacciones de sociedades ficticias, notificación FIFA TMS, marcaje de agente, y divulgación proactiva DOJ. Transferencia bloqueada con evidencia lista para TAS.',
    evidenceChain: 'Documentación → Anomalía IA → Traza propiedad (4 países) → Sociedades ficticias → Vínculo agente-director → 4 transacciones → FIFA TMS → DOJ proactivo → Bloqueo → Sello ML-DSA-65',
  },
};

ES_DATA['youth-protection'] = {
  title: 'Tráfico de Menores — Artículo 19 de FIFA',
  subtitle: 'Jugador de 14 años · Transferencia irregular transfronteriza · 3 intermediarios · Emergencia de protección infantil',
  banner: 'Simulando detección de transferencia internacional irregular de un jugador sudamericano de 14 años que elude el Artículo 19 de FIFA. IA revela una red de intermediarios no regulados que facilitan movimiento de menores — el desafío de protección más crítico de Sudamérica.',
  scenarioNum: 'Protección Juvenil',
  idleTitle: 'Listo para Deliberar',
  idleDesc: '4 agentes de IA detectarán y desmantelarán una red de tráfico juvenil — bloqueando la transferencia, exponiendo un patrón de 23 casos y coordinando protección infantil en 3 países.',
  phaseLabels: ['Detección de Violación', 'Análisis de Red y Revisión Legal', 'Protocolo de Emergencia Infantil'],
  connectors: [
    { name: 'Portal FIFA TMS Menores', type: 'Transferencia Internacional de Menores', detail: 'Solicitud: jugador de 14 años, Paraguay → Portugal' },
    { name: 'Base de Protección Juvenil CONMEBOL', type: 'Registro de Transferencias Sub-18', detail: '2.847 solicitudes de menores rastreadas desde 2020' },
    { name: 'Sistema de Registro de Intermediarios', type: 'Verificación de Agentes', detail: '3 intermediarios marcados — ninguno registrado en FIFA' },
    { name: 'Agencias Nacionales de Protección Infantil', type: 'Paraguay · Brasil · Portugal', detail: 'SNNA (Paraguay) + CNPDPCJ (Portugal) integrados' },
  ],
  agentRoles: R,
  scriptContent: [
    'ALERTA DE PROTECCIÓN INFANTIL — MÁXIMA PRIORIDAD. Solicitud de transferencia para jugador paraguayo de 14 años a academia de club portugués. El Artículo 19 de FIFA prohíbe transferencias internacionales de menores con solo 3 excepciones: (1) padres mudándose por razones no futbolísticas, (2) transferencias UE/EEE para 16-18 años, (3) jugadores a 50km de frontera. NINGUNA aplica. El jugador tiene 14 (bajo el umbral UE de 16), la transferencia es intercontinental, y no hay reubicación parental. Además, 3 intermediarios nombrados — ninguno es agente registrado FIFA. Bloqueo inmediato obligatorio.',
    'Análisis de red de intermediarios revela patrón de tráfico. Intermediario A: paraguayo sin registro FIFA, conectado a 7 intentos previos de transferencia de menores (5 bloqueados). Intermediario B: brasileño en São Paulo, vinculado a academia no regulada en Asunción que "busca" jugadores desde los 12 años en comunidades rurales. Intermediario C: entidad portuguesa "Global Football Talent Ltd" — €100 de capital, constituida hace 6 meses para recibir "comisiones de scouting." El club portugués pagaría €200K en "compensación de desarrollo" — pero €140K (70%) va a los 3 intermediarios, no al club original. No es transferencia legítima — es red de explotación comercial de un niño.',
    'DISENSO REGISTRADO. El club portugués alegará "mejor vida" y "educación futbolística de clase mundial." Sin embargo: (1) Bajo ley paraguaya (Código de la Niñez, Art. 3), el interés superior del niño lo determina la SNNA, no un club. (2) El consentimiento parental puede haberse obtenido mediante incentivos financieros a familia en pobreza, lo cual constituye explotación bajo la Convención de la ONU (Art. 32). (3) Los 3 intermediarios violaron las Regulaciones de Agentes de FIFA. Exijo referencia a la SNNA de Paraguay e INTERPOL.',
    'BANDERA LEVANTADA. Análisis de patrones revela que no es caso aislado. Intermediario A tiene 7 intentos previos, pero la red más amplia con la academia de São Paulo ha facilitado 23 transferencias de menores en 4 años — 14 eludieron supervisión de CONMEBOL mediante "pruebas" con visas de turista. De los 23 jugadores, solo 3 están activos profesionalmente. Los 20 restantes fueron liberados en 18 meses, muchos abandonados en países extranjeros. Es red sistemática de explotación infantil.',
    'Proponiendo Protocolo de Emergencia de Protección: (1) TRANSFERENCIA BLOQUEADA — bloqueo de todas las transacciones FIFA TMS con estos 3 intermediarios y la academia. (2) SNNA Paraguay notificada — evaluación de bienestar del jugador y familia. (3) FIFA notificada — investigación de las 23 transferencias y bienestar de los 20 liberados. (4) Referencia INTERPOL como posible tráfico humano. (5) Evidencia sellada con CendiaChronos — patrón completo preservado para persecución criminal. (6) Circular de emergencia a las 10 asociaciones sobre "pruebas" de academias no reguladas.',
    'Protocolo satisface todos los requisitos legales: Artículo 19 FIFA, ley paraguaya de protección, Convención ONU, y estándares INTERPOL. La evidencia criptográfica del patrón de 23 casos establece explotación sistemática — no hay defensa de "error aislado." Evidencia admisible en Paraguay, Brasil y Portugal. Disenso RETIRADO. Protocolo protege no solo a este niño sino expone red que ha explotado al menos 23 jóvenes.',
  ],
  receipt: {
    merkleLabel: 'Raíz Merkle (Datos de menor + patrón 23 casos + red de 3 intermediarios + referencia SNNA)',
    complianceLabel: 'Protección Infantil',
    complianceValue: 'PROTOCOLO DE EMERGENCIA',
    complianceThreshold: 'Artículo 19 FIFA — bloqueo activo',
    guaranteeTitle: 'Artículo 19 FIFA — Red de Explotación Infantil Expuesta',
    guaranteeBody: 'Paquete sellado: transferencia bloqueada, análisis de red de 3 intermediarios, patrón de tráfico de 23 casos, vínculo con academia de São Paulo, referencia SNNA Paraguay, y notificación INTERPOL. Cadena de evidencia preservada para persecución criminal en 3 jurisdicciones. 20 menores liberados identificados para seguimiento.',
    evidenceChain: 'Solicitud → Art. 19 → Intermediarios (3 no registrados) → Red (23 transferencias) → Flujo financiero → SNNA → INTERPOL → Circular emergencia → Bloqueo → Sello ML-DSA-65',
  },
};

ES_DATA['revenue-distribution'] = {
  title: 'Copa Libertadores — Distribución de Ingresos $500M',
  subtitle: '47 clubes · 10 países · $500M total · Pagos solidarios · Equidad entre asociaciones',
  banner: 'Simulando la distribución de $500M en ingresos comerciales de Copa Libertadores entre 47 clubes y 10 asociaciones — probando que cada dólar fue asignado según estatutos mientras se aborda la brecha entre clubes argentinos/brasileños y naciones más pequeñas.',
  scenarioNum: 'Ingresos',
  idleTitle: 'Listo para Deliberar',
  idleDesc: '4 agentes de IA distribuirán $500M en ingresos de Copa Libertadores entre 47 clubes y 10 naciones — probando asignación justa mientras abordan la brecha entre mercados grandes y pequeños.',
  phaseLabels: ['Cálculo de Ingresos y Análisis de Brecha', 'Revisión Legal y DOJ', 'Protocolo de Asignación Verificable'],
  connectors: [
    { name: 'Motor de Ingresos CONMEBOL', type: 'Asignación de Ingresos Comerciales', detail: '$500M: transmisión ($320M), patrocinio ($130M), premios ($50M)' },
    { name: 'Resultados Copa Libertadores', type: 'Resultados y Clasificación', detail: '152 partidos en fase de grupos + eliminatorias' },
    { name: 'Portal de Asociaciones', type: 'Seguimiento de Pagos Solidarios', detail: '10 asociaciones — pagos solidarios pendientes' },
    { name: 'Verificación Bancaria de Clubes', type: 'Cuentas de Pago', detail: '47 cuentas verificadas en 10 países' },
  ],
  agentRoles: R,
  scriptContent: [
    'Motor de asignación iniciado. Ingresos totales Copa Libertadores 2026: $500.000.000. Estructura: (1) Premios por rendimiento: $200M (40%) — 47 clubes, ponderado por desempeño. (2) Pool de mercado TV: $180M (36%) — por valor de mercado nacional de transmisión. (3) Pagos solidarios: $70M (14%) — desarrollo para las 10 FAs. (4) Reserva operativa CONMEBOL: $50M (10%). Problema crítico: el pool TV crea desigualdad extrema. Argentina y Brasil representan 78% del valor de transmisión pero solo 40% de los clubes. Un club boliviano en cuartos recibe $1,2M del pool TV, mientras un club argentino eliminado en grupos recibe $4,8M. Ratio 4:1 por peor rendimiento — técnicamente correcto pero políticamente explosivo.',
    'BANDERA LEVANTADA. La brecha se amplía. En 2020 el ratio era 3,2:1. En 2026 es 4,8:1, impulsado por explosión de acuerdos argentinos y brasileños (Globo, ESPN) mientras mercados boliviano, ecuatoriano y paraguayo se estancaron. 4 clubes de mercados pequeños se quejaron formalmente y amenazan escalar al TAS. La administración anterior usaba distribución opaca como herramienta de corrupción — funcionarios aceptaban sobornos para manipular fórmulas. Cualquier percepción de favoritismo socava la narrativa de reforma.',
    'DISENSO REGISTRADO. El desafío TAS de los 4 clubes tiene mérito. Bajo jurisprudencia TAS (2019/A/6391), la distribución debe ser "objetivamente justificada y proporcionada." La fórmula actual asigna pool TV por tamaño de mercado — métrica que naciones pequeñas no pueden controlar. El monitor DOJ escrutará cualquier fórmula que consolide poder de clubes grandes. La corrupción pre-FIFAgate involucró manipulación de distribuciones. Exijo reporte de transparencia completo: cada club ve cada pago, la fórmula y la justificación.',
    'ADVERTENCIA. El monitor DOJ ha señalado "transparencia en distribución de ingresos" como foco del Q3 2026. La corrupción pre-FIFAgate involucró $40M+ en sobornos por asignación de derechos. Si la fórmula actual no puede verificarse independientemente — si los clubes deben "confiar" en los cálculos — falla el test de "gobernanza reformada." Cada dólar debe ser rastreable desde origen hasta cuenta bancaria del club.',
    'Proponiendo Protocolo de Asignación Verificable: (1) Cada club recibe "Recibo de Ingresos" mostrando: pool total → fórmula → su pago, con cada variable transparente. (2) Los 47 pagos + 10 solidarios sellados en árbol Merkle — cualquier club puede verificar su pago Y el de todos los demás. (3) "Ajuste de equidad competitiva" — 10% del pool TV redistribuido de los 3 mercados top a los 5 inferiores, reduciendo brecha de 4,8:1 a 3,4:1. (4) Asignación completa publicada en CONMEBOL.com — primera vez en historia. (5) Paquete DOJ generado automáticamente.',
    'Protocolo aborda el desafío TAS y requisito DOJ. El ajuste de equidad (4,8:1 a 3,4:1) demuestra que CONMEBOL aborda desigualdad estructural. El árbol Merkle público elimina alegaciones de opacidad o favoritismo. Transparencia de fórmula satisface estándar DOJ post-FIFAgate. Disenso RETIRADO. Transforma la distribución de ingresos de proceso históricamente más corrupto a más transparente de CONMEBOL.',
  ],
  receipt: {
    merkleLabel: 'Raíz Merkle (47 pagos clubes + 10 solidarios + Pool TV + Ajuste equidad)',
    complianceLabel: 'Ingresos Verificados',
    complianceValue: '57/57 PAGOS',
    complianceThreshold: '$500M distribuidos transparentemente',
    guaranteeTitle: 'Copa Libertadores — Distribución de Ingresos Verificable',
    guaranteeBody: 'Asignación completa de $500M sellada: 47 clubes y 10 asociaciones con fórmulas transparentes y verificación independiente vía Merkle. Ajuste de equidad reduce brecha TV de 4,8:1 a 3,4:1. Ningún club puede alegar opacidad — cada cálculo es matemáticamente transparente.',
    evidenceChain: 'Ingresos ($500M) → Fórmula → Pool TV + Ajuste equidad → 47 pagos → 10 solidarios → Portal público → Paquete DOJ → Merkle → Sello ML-DSA-65',
  },
};

ES_DATA['whistle-corruption'] = {
  title: 'CendiaWhistle — Corrupción en Asociación Miembro',
  subtitle: 'Reporte anónimo · Malversación de presidente de FA · $12M fondos de desarrollo · Anonimato por firma de anillo',
  banner: 'Simulando un reporte anónimo de denunciante alegando que un presidente de asociación miembro de CONMEBOL ha malversado $12M en fondos de desarrollo FIFA Forward. Las firmas de anillo de CendiaWhistle garantizan anonimato matemático — ni CONMEBOL puede identificar la fuente.',
  scenarioNum: 'Denunciante',
  idleTitle: 'Listo para Deliberar',
  idleDesc: '4 agentes de IA investigarán un reporte anónimo de corrupción contra un miembro del Comité Ejecutivo — usando imágenes satelitales y análisis financiero para construir evidencia sellada para referencia al DOJ.',
  phaseLabels: ['Reporte Anónimo y Verificación', 'Análisis Legal y Jurisdicción DOJ', 'Investigación Sellada y Referencia'],
  connectors: [
    { name: 'Portal CendiaWhistle', type: 'Reportes Anónimos', detail: 'Firma de anillo verificada — reportante entre 10 asociaciones' },
    { name: 'Programa FIFA Forward', type: 'Seguimiento de Fondos de Desarrollo', detail: '$240M distribuidos a 10 asociaciones en 4 años' },
    { name: 'Comité de Ética CONMEBOL', type: 'Investigación Interna', detail: '14 investigaciones éticas previas indexadas' },
    { name: 'Reguladores Financieros Nacionales', type: 'Anti-Lavado de Dinero', detail: 'Conexiones UIF activas para 10 jurisdicciones' },
  ],
  agentRoles: R,
  scriptContent: [
    'ALERTA PRIORITARIA. CendiaWhistle ha recibido reporte anónimo desde la red de asociaciones miembro alegando malversación sistemática de fondos FIFA Forward. Detalles: (1) Presidente de asociación desvió $12M en 3 años de fondos para desarrollo de fútbol base y construcción de academias juveniles. (2) Fondos canalizados a través de empresa constructora del cuñado del presidente — facturó "renovaciones de estadio" nunca completadas o al 30% del costo facturado. (3) El reporte incluye números de factura, fechas y fotografías de obras incompletas. Firma de anillo confirma autenticación dentro de la red de 10 asociaciones. Identidad matemáticamente sellada — ni orden judicial paraguaya puede extraerla.',
    'Referencia cruzada con registros de desembolso FIFA Forward. CONFIRMADO: (1) La asociación recibió $24M en 3 años — los $12M representan 50%. (2) La constructora aparece en 7 facturas por $14,3M, todas por "desarrollo de infraestructura." (3) Reportes de cumplimiento FIFA Forward muestran proyectos como "completados" — pero análisis de imágenes satelitales: Sitio A: cimientos, sin estructura. Sitio B: 40% completo, abandonado. Sitio C: no se puede ubicar en las coordenadas GPS proporcionadas. La discrepancia entre reportes y evidencia satelital es condenatoria. No es contabilidad creativa — es fraude sistemático.',
    'DISENSO REGISTRADO. Políticamente explosivo. El presidente acusado es miembro del Comité Ejecutivo de CONMEBOL con voto en el Congreso FIFA. La remoción requiere: (1) Comité de Ética FIFA bajo Art. 64, (2) Cumplimiento de estatutos de la federación nacional, (3) Potencial persecución criminal local. Si CONMEBOL actúa y la acusación se demuestra falsa, crisis de gobernanza. Si no actúa y el DOJ descubre la malversación, confirma que las reformas son cosméticas. Exijo que toda investigación use el sistema de prueba de conocimiento cero de Datacendia — la evidencia debe ser verificable independientemente antes de cualquier acción formal.',
    'BANDERA LEVANTADA. Los fondos FIFA Forward provienen de ingresos FIFA que incluyen dinero de transmisión de origen estadounidense. Bajo ley federal, la malversación de fondos con origen en EE.UU. mediante transferencias bancarias constituye fraude electrónico (18 U.S.C. § 1343) — dando jurisdicción al DOJ independientemente de dónde ocurrió. Esta es exactamente la teoría legal de las acusaciones FIFAgate de 2015. Si CONMEBOL no refiere esto proactivamente al DOJ, la narrativa de gobernanza reformada colapsa.',
    'Proponiendo protocolo de investigación sellada: (1) Reporte CendiaWhistle preservado con firma de anillo — prueba de autenticidad sin revelar identidad. (2) Imágenes satelitales y registros FIFA Forward sellados — verificación independiente. (3) Comité de Ética FIFA notificado con paquete completo. (4) Divulgación proactiva al DOJ — conexión con fondos de origen estadounidense activa referencia obligatoria. (5) UIF del país del acusado notificada para investigación anti-lavado. (6) Protección del denunciante garantizada por matemáticas — no por política que puede ser anulada por presión política.',
    'Protocolo satisface todos los requisitos: Código de Ética FIFA, ley criminal nacional, referencia DOJ por fraude electrónico, y protección de denunciantes. Imágenes satelitales proporcionan corroboración independiente que no depende del testimonio del denunciante. Disenso RETIRADO. Recomiendo escalación inmediata al Comité de Ética FIFA y DOJ con paquete sellado.',
  ],
  receipt: {
    merkleLabel: 'Raíz Merkle (Firma de anillo + Imágenes satelitales + Registros FIFA Forward + Referencia DOJ)',
    complianceLabel: 'Protección de Denunciante',
    complianceValue: 'MATEMÁTICA',
    complianceThreshold: 'identidad no extraíble',
    guaranteeTitle: 'CendiaWhistle — Miembro de Comité Ejecutivo Referido al DOJ',
    guaranteeBody: 'Paquete sellado: reporte anónimo, verificación satelital de obras incompletas, análisis de desembolsos FIFA Forward, y referencia proactiva DOJ. Firma de anillo garantiza anonimato matemático. Evidencia independiente corrobora sin depender del denunciante. CONMEBOL demuestra gobernanza reformada contra su propia dirigencia.',
    evidenceChain: 'Firma de anillo → Reporte → Análisis FIFA Forward → Verificación satelital → Traza empresa constructora → Ética FIFA → DOJ proactivo → UIF → Sello ML-DSA-65',
  },
};

ES_DATA['var-altitude'] = {
  title: 'VAR a 3.600m — Controversia de Altitud en La Paz',
  subtitle: 'Eliminatoria Copa Libertadores · La Paz (3.640m) · Fallo de equipo VAR · Protesta por altitud · Apelación TAS',
  banner: 'Simulando un partido eliminatorio en La Paz, Bolivia (3.640m) donde el equipo VAR falla por condiciones atmosféricas, un penal controvertido se otorga sin revisión VAR, y el equipo visitante apela al TAS argumentando repetición del partido — el tema de gobernanza más contencioso de Sudamérica.',
  scenarioNum: 'VAR / Altitud',
  idleTitle: 'Listo para Deliberar',
  idleDesc: '4 agentes de IA responderán a un fallo VAR a 3.640m — sellando evidencia, preparando defensa TAS y mandando mejoras de equipo para prevenir recurrencia.',
  phaseLabels: ['Análisis de Fallo VAR', 'Impacto Legal y Comercial', 'Sellado de Evidencia y Protocolo de Reforma'],
  connectors: [
    { name: 'Sala de Operaciones VAR', type: 'Sistema de Árbitro Asistente por Video', detail: 'Cuartos Copa Libertadores Vuelta — La Paz, Bolivia' },
    { name: 'Base Médica CONMEBOL', type: 'Cumplimiento Protocolo de Altitud', detail: 'Altitud: 3.640m — oxígeno suplementario obligatorio' },
    { name: 'Estándares Técnicos IFAB', type: 'Especificaciones de Equipo VAR', detail: 'Protocolo VAR v4.2 + clasificaciones de altitud' },
    { name: 'Jurisprudencia TAS Altitud', type: 'Casos Históricos de Altitud', detail: 'Archivo de prohibición FIFA (2007-2018)' },
  ],
  agentRoles: R,
  scriptContent: [
    'INCIDENTE CRÍTICO. Cuartos de Final Copa Libertadores, Vuelta: Club Boliviano vs Club Argentino en La Paz (Estadio Hernando Siles, 3.640m). Minuto 73: árbitro otorga penal al local. El sistema VAR — que debió revisar — sufrió fallo total de comunicación entre sala VAR y árbitro en el 71:30 (90 segundos antes). El VMO vio en repetición que el contacto fue fuera del área, pero no pudo comunicarse. El penal fue convertido. Marcador: 2-1 para el club boliviano (3-3 global, clasificando por gol de visitante). El club argentino exige suspensión y repetición.',
    'Análisis de fallo del equipo VAR. El fallo de comunicación fue causado por interferencia atmosférica en altitud — el sistema inalámbrico opera a 2,4GHz, susceptible a interferencia ionosférica a gran altitud. Esta es una limitación técnica CONOCIDA. Las especificaciones de CONMEBOL (2024) fueron probadas de 0 a 2.500m pero NO a 3.640m. El manual del proveedor dice "rendimiento óptimo hasta 2.800m." CONMEBOL desplegó equipo de nivel del mar en el estadio profesional más alto del mundo. Es fallo de gobernanza, no de equipo aleatorio.',
    'DISENSO REGISTRADO. El club argentino apelará al TAS bajo Art. 18 del Código Disciplinario (circunstancias irregulares). Argumentos: (1) VAR era obligatorio, (2) CONMEBOL desplegó equipo no clasificado para la altitud, (3) La decisión fue "error claro y obvio" que VAR habría corregido. Precedente complejo: FIFA prohibió partidos sobre 2.500m de 2007-2018, Bolivia logró levantar la prohibición. TAS nunca falló sobre fallo VAR por altitud específicamente. Caso de primera impresión — podría reabrir el debate de 20 años.',
    'BANDERA LEVANTADA. Implicaciones comerciales enormes. Si TAS ordena repetición, establece precedente de que cualquier fallo VAR en altitud invalida resultados. Bolivia tiene 3 clubes en Copa Libertadores — todos juegan de local sobre 3.000m. Podría excluir efectivamente a clubes bolivianos, violando Estatutos CONMEBOL de trato igualitario. Además, el contrato de transmisión con ESPN garantiza "cobertura VAR continua" para eliminatorias. ESPN solicita explicación formal y posible compensación de $2-5M.',
    'Proponiendo Protocolo de Integridad VAR en Altitud: (1) INMEDIATO: Registros VAR completos — timestamps de fallo, revisión VMO y diagnósticos — sellados criptográficamente. (2) Los registros PRUEBAN que VMO identificó el error pero no pudo comunicarlo — crítico para TAS. (3) FUTURO: CONMEBOL manda equipo VAR certificado para altitud (hasta 4.000m) para sedes sobre 2.800m. Respaldo por fibra óptica cableada obligatorio. (4) ESTE PARTIDO: reconocer proactivamente el fallo y ofrecer audiencia formal al club argentino — transparencia en lugar de negación.',
    'Protocolo proporciona posición legal óptima: (1) Registros sellados demuestran transparencia — debilita argumento de "encubrimiento negligente" en TAS. (2) Mandato de mejora demuestra gobernanza reformada. (3) Oferta de audiencia demuestra buena fe. No recomiendo repetición — TAS 2019/A/6388 estableció que "fallos técnicos no invalidan resultados salvo causa deliberada." La decisión del penal la tomó un árbitro calificado. VAR es ayuda, no garantía. Disenso RETIRADO. La evidencia sellada protege a CONMEBOL en TAS mientras el mandato previene recurrencia.',
  ],
  receipt: {
    merkleLabel: 'Raíz Merkle (Registros VAR + Datos de fallo de comunicación + Especificaciones equipo + Evidencia TAS)',
    complianceLabel: 'Equipo VAR',
    complianceValue: 'FALLO DOCUMENTADO',
    complianceThreshold: 'mejora para altitud mandada',
    guaranteeTitle: 'Copa Libertadores — Integridad VAR en Altitud Sellada',
    guaranteeBody: 'Paquete sellado: registros de despliegue, timestamps de fallo de comunicación a 3.640m, revisión VMO, y cadena de decisión del penal. Evidencia lista para TAS. Mandato de mejora y respaldo por fibra óptica demuestran gobernanza reformada.',
    evidenceChain: 'Despliegue equipo → Verificación altitud → Fallo comunicación (71:30) → Revisión VMO → Decisión penal (73:00) → Diagnósticos → Evidencia TAS → Mandato mejora → Respaldo fibra → Sello ML-DSA-65',
  },
};

ES_DATA['anti-discrimination'] = {
  title: 'Racismo en Copa Libertadores — Protocolo de Tres Pasos FIFA',
  subtitle: 'Eliminatoria · Cánticos racistas detectados · 40.000 aficionados · Protocolo tres pasos · Sanciones al club · Apelación TAS',
  banner: 'Simulando un incidente racista durante eliminatoria de Copa Libertadores donde monitoreo de audio detecta cánticos racistas coordinados contra un jugador visitante. CONMEBOL debe decidir si invoca el protocolo de tres pasos FIFA, documentar evidencia y defender sanciones en TAS.',
  scenarioNum: 'Racismo',
  idleTitle: 'Listo para Deliberar',
  idleDesc: '4 agentes de IA responderán a cánticos racistas durante una eliminatoria — sellando evidencia de múltiples fuentes, iniciando el protocolo de tres pasos y construyendo caso disciplinario a prueba de TAS.',
  phaseLabels: ['Detección de Incidente y Captura de Evidencia', 'Defensa Legal y Análisis DOJ', 'Protocolo de Aplicación Tolerancia Cero'],
  connectors: [
    { name: 'Comité de Ética CONMEBOL', type: 'Aplicación Anti-Discriminación', detail: 'Cuartos Copa Libertadores — incidente de racismo reportado' },
    { name: 'Monitoreo de Audio del Estadio', type: 'Detección de Patrones Acústicos', detail: 'Sectores 108-112: cánticos coordinados detectados a 74dB+' },
    { name: 'Base Disciplinaria FIFA', type: 'Precedentes Anti-Discriminación', detail: '89 casos previos sudamericanos indexados' },
    { name: 'Archivo de Transmisión CONMEBOL', type: 'Evidencia de Video y Audio', detail: '14 ángulos de cámara + micrófonos direccionales activos' },
  ],
  agentRoles: R,
  scriptContent: [
    'ALERTA DE DISCRIMINACIÓN — MÁXIMA SEVERIDAD. Cuartos de Final Copa Libertadores. Minuto 58: monitoreo de audio detecta cánticos racistas coordinados de Sectores 108-112 (aproximadamente 3.000-4.000 aficionados) contra delantero afrobrasileño visitante. Los cánticos incluyen ruidos de mono y un insulto racial repetido al unísono. Micrófonos direccionales confirman audio sobre umbral de 74dB para "organizado." El jugador se acercó al árbitro señalando las gradas. Bajo protocolo de tres pasos FIFA: Paso 1 es anuncio de advertencia por PA; Paso 2 suspensión; Paso 3 abandono del partido. El árbitro AÚN NO ha iniciado Paso 1. El Comisario del Partido debe asesorar inmediatamente.',
    'Captura de evidencia iniciada. (1) Audio: 4 micrófonos direccionales cubriendo Sectores 108-112 han grabado 3 minutos 22 segundos de cánticos racistas continuos. Análisis acústico confirma coordinación (timing sincronizado, ritmo consistente). (2) Cámaras de transmisión: 3 de 14 cubrían reacciones del público — imágenes de ~800 individuos identificables. (3) CCTV: cámaras de seguridad cubren los sectores. (4) Redes sociales: aficionados en los sectores han publicado videos desde dentro. (5) La reacción del jugador visitante capturada en transmisión — visiblemente afectado. El incidente de racismo más documentado en historia de Copa Libertadores.',
    'DISENSO REGISTRADO. El club local montará defensa predecible: (1) "Minoría pequeña" — pero 3.000-4.000 no es minoría, (2) "No puede controlar aficionados individuales" — pero Art. 17 del Código Disciplinario establece responsabilidad objetiva, (3) "Umbral acústico arbitrario" — pero el estándar de 74dB es metodología validada por UEFA. Rango de sanción: cierre parcial (mínimo), cierre total por 2-5 partidos, y multa hasta $100.000. Si invocamos Paso 2 o 3 y el club es eliminado, argumentarán que el protocolo fue desproporcionado. Exijo que cada punto de decisión sea sellado en tiempo real con CendiaChronos.',
    'BANDERA LEVANTADA. Dimensión DOJ: las reformas post-FIFAgate incluyen "integridad institucional" que abarca anti-discriminación. El monitor DOJ notará cómo CONMEBOL maneja esto — si la sanción es percibida como leve, señala que las reformas priorizan intereses comerciales sobre estándares éticos. El club del jugador visitante es un club brasileño importante con audiencia significativa en EE.UU. Una respuesta débil generará cobertura negativa que llega al DOJ. FIFA President Infantino ha elevado personalmente la anti-discriminación.',
    'Proponiendo Protocolo de Evidencia y Aplicación Anti-Discriminación: (1) INMEDIATO: Comisario asesoró iniciar Paso 1 — anuncio PA en español advirtiendo suspensión. Timestamp sellado. (2) EVIDENCIA: Audio (3:22 de cánticos coordinados), transmisión (800+ identificables), CCTV, y redes sociales — todo sellado en Merkle. (3) DISCIPLINARIO: 3 partidos cierre total + $100.000 multa (máximo). Responsabilidad objetiva Art. 17. (4) PROTECCIÓN: Bienestar del jugador documentado. (5) PRECEDENTE: Este paquete se convierte en estándar de referencia. (6) DECLARACIÓN: Comunicado de tolerancia cero en 2 horas.',
    'Evidencia sellada hace esto a prueba de TAS. Las 3 defensas estándar neutralizadas: (1) "Minoría" — datos acústicos prueban 3.000-4.000 coordinados en 4 sectores, (2) "No puede controlar" — responsabilidad objetiva aplica, y falta de intervención de stewards demuestra negligencia, (3) "Umbral arbitrario" — estándar 74dB validado por UEFA y ahora precedente CONMEBOL. Cierre de 3 partidos es proporcionado bajo TAS 2019/A/6267. Disenso RETIRADO. Acción anti-discriminación más fuerte en historia del fútbol sudamericano.',
  ],
  receipt: {
    merkleLabel: 'Raíz Merkle (Audio + Transmisión + CCTV + Redes sociales + Timestamps protocolo)',
    complianceLabel: 'Anti-Discriminación',
    complianceValue: 'TOLERANCIA CERO',
    complianceThreshold: 'Protocolo Tres Pasos FIFA iniciado',
    guaranteeTitle: 'Copa Libertadores — Evidencia Anti-Discriminación Sellada',
    guaranteeBody: 'Paquete sellado: 3:22 de cánticos coordinados, 800+ individuos identificables, CCTV, redes sociales, timestamp de Paso 1, cadena de decisión del Comisario, y recomendación disciplinaria (3 partidos cierre + $100K). Evidencia lista para TAS. Estándar de referencia para aplicación anti-discriminación sudamericana.',
    evidenceChain: 'Detección audio → Análisis acústico (74dB+) → Transmisión → CCTV → Redes sociales → Paso 1 protocolo → Decisión Comisario → Recomendación disciplinaria → Declaración pública → Sello ML-DSA-65',
  },
};

ES_DATA['conflict-of-interest'] = {
  title: 'Comité Ejecutivo — Conflicto de Interés No Declarado',
  subtitle: 'Votación derechos de transmisión · Empresa oculta de ejecutivo · Acuerdo de $340M · Código de Ética FIFA · Escrutinio DOJ',
  banner: 'Simulando la detección de un conflicto de interés no declarado donde un miembro del Comité Ejecutivo de CONMEBOL tiene una relación financiera oculta con una empresa que licita por derechos de transmisión de Copa Libertadores. Exactamente el mecanismo de corrupción que definió FIFAgate.',
  scenarioNum: 'Conflicto',
  idleTitle: 'Listo para Deliberar',
  idleDesc: '4 agentes de IA detectarán conflictos de interés no declarados antes de una votación de $340M en derechos de transmisión — examinando a los 10 miembros contra los 6 licitantes y bloqueando el patrón de repetición de FIFAgate.',
  phaseLabels: ['Screening de Propiedad y Detección', 'Análisis Legal e Impacto Político', 'Protocolo de Recusación y Reforma'],
  connectors: [
    { name: 'Portal de Gobernanza CONMEBOL', type: 'Registro de Conflictos de Interés', detail: 'Comité Ejecutivo: 10 miembros + Presidente' },
    { name: 'Base de Datos de Licitantes', type: 'Análisis de Propiedad Beneficiaria', detail: 'RFP transmisión Copa Libertadores: 6 licitantes' },
    { name: 'Comité de Ética FIFA', type: 'Aplicación Código de Ética', detail: 'Artículos 19-22: provisiones de conflicto de interés' },
    { name: 'Monitor de Cumplimiento DOJ', type: 'Supervisión Federal', detail: 'Escrutinio de acuerdos comerciales post-FIFAgate activo' },
  ],
  agentRoles: R,
  scriptContent: [
    'ALERTA DE GOBERNANZA. Screening automatizado de conflictos para la votación de derechos de transmisión Copa Libertadores 2027-2030 (sesión del Comité Ejecutivo en 72 horas) ha detectado relación no declarada crítica. Miembro X — representante de una de las 10 asociaciones — tiene interés de propiedad beneficiaria en holding de medios que es accionista del 30% del Licitante D, uno de 6 compitiendo por contrato de $340M/año. Traza: Miembro X posee 100% de holding uruguayo ("Inversiones del Sur S.A."), que posee 15% de entidad panameña ("Meridian Media Holdings"), que posee 30% del Licitante D. La declaración anual de Miembro X lista CERO intereses en medios o transmisión. Violación directa del Art. 19 del Código de Ética FIFA.',
    'Patrón de repetición de FIFAgate. Las acusaciones DOJ de 2015 documentaron exactamente este mecanismo: funcionarios CONMEBOL con propiedad oculta en empresas licitantes, votando para adjudicar contratos a sus propias entidades. El ex presidente Eugenio Figueredo fue condenado precisamente por esto. Si Miembro X vota sin divulgación y el DOJ descubre la propiedad oculta, constituirá: (1) fraude electrónico, (2) fraude de servicios honestos, (3) potencial lavado. La pregunta no es si Miembro X es corrupto — es si los sistemas de CONMEBOL pueden detectar esto ANTES de la votación.',
    'DISENSO REGISTRADO. Miembro X alegará: (1) holding uruguayo es vehículo pasivo y entidad panameña está a 2 capas — "no sabía de la estructura del Licitante D," (2) el formulario no pregunta específicamente por participaciones indirectas en medios a través de vehículos offshore, (3) removerlo cambia el balance político. Sin embargo: Art. 19(3) exige divulgar "cualquier interés que pueda llevar a conflicto" — el estándar es "pueda llevar," no "definitivamente constituye." Propiedad indirecta del 15% en accionista del 30% claramente califica. El formulario pregunta "cualquier interés financiero en medios, transmisión o marketing deportivo" — la falla en divulgar no es ambigua.',
    'BANDERA LEVANTADA. Extendiendo análisis a los 10 miembros contra los 6 licitantes. Resultados: (1) Miembro X: conflicto confirmado con Licitante D. (2) Miembro Y: cónyuge empleada en subsidiaria sudamericana del Licitante B como directora de marketing. Declarado pero clasificado como "inmaterial." Salario de $180K/año sugiere materialidad. (3) Sin otros conflictos en los 8 restantes. Dos conflictos de 10 miembros afecta significativamente el margen. Si ambos se recusan, la votación de 8 miembros requiere 5 para mayoría.',
    'Proponiendo Protocolo de Bloqueo de Conflicto de Interés: (1) Miembro X INMEDIATAMENTE recusado — propiedad no declarada viola Art. 19. Referencia a Ética FIFA iniciada. (2) Miembro Y recusado pendiente revisión — $180K/año en subsidiaria de licitante es material. (3) Votación procede con 8 miembros elegibles. (4) Traza completa de propiedad de 10 miembros vs 6 licitantes sellada — prueba de screening pre-votación. (5) Divulgación proactiva al DOJ. (6) Formulario actualizado para exigir propiedad indirecta a través de cualquier estructura. (7) Screening automatizado permanente para cada decisión comercial.',
    'Protocolo cierra toda vulnerabilidad. Miembro X no puede alegar ignorancia — el formulario cubre intereses en medios explícitamente, y 100% de propiedad del primer nivel no es pasivo. Referencia a Ética FIFA es obligatoria. Recusación de Miembro Y es proporcionada. Votación de 8 es válida (quórum es 6). Screening automatizado elimina conflictos futuros. Disenso RETIRADO. Gobernanza post-FIFAgate funcionando como fue diseñada — detectando mecanismos de corrupción antes de que se ejecuten, no investigándolos años después.',
  ],
  receipt: {
    merkleLabel: 'Raíz Merkle (Traza de 10 miembros + análisis 6 licitantes + Declaraciones COI + Registros recusación)',
    complianceLabel: 'Conflicto de Interés',
    complianceValue: 'BLOQUEO ACTIVO',
    complianceThreshold: 'Violación Art. 19 Código Ética FIFA confirmada',
    guaranteeTitle: 'Comité Ejecutivo CONMEBOL — Integridad Pre-Votación Sellada',
    guaranteeBody: 'Paquete sellado: trazas de propiedad de 10 miembros vs 6 licitantes, propiedad oculta de 2 capas de Miembro X en accionista del Licitante D, empleo de cónyuge de Miembro Y en Licitante B, decisiones de recusación, referencia a Ética FIFA, y divulgación DOJ. Votación procede solo con miembros verificados. Cada paso sellado con CendiaChronos probando detección pre-votación.',
    evidenceChain: 'RFP transmisión → 6 licitantes → Screening propiedad 10 miembros → Conflicto Miembro X (2 capas) → Empleo cónyuge Miembro Y → Recusaciones → Ética FIFA → DOJ proactivo → Votación limpia 8 miembros → Sello ML-DSA-65',
  },
};

ES_DATA['anti-doping'] = {
  title: 'Copa América Antidopaje — Cadena de Custodia Rota',
  subtitle: 'Estrella positiva · Sede remota · Fallo cadena de frío · Cumplimiento WADA · Apelación TAS · 2 laboratorios acreditados',
  banner: 'Simulando crisis antidopaje donde una estrella de Copa América da positivo pero la defensa cuestiona la cadena de custodia — argumentando que la muestra se comprometió durante el transporte desde una sede remota en Bolivia hasta el laboratorio más cercano acreditado por WADA en Brasil, un viaje de 3 países y 48 horas.',
  scenarioNum: 'Dopaje',
  idleTitle: 'Listo para Deliberar',
  idleDesc: '4 agentes de IA defenderán un hallazgo antidopaje contra un desafío de cadena de custodia — reconstruyendo 48 horas de transporte a través de 3 países y probando integridad pese a una brecha documental en el aeropuerto más alto del mundo.',
  phaseLabels: ['Hallazgo Adverso y Reconstrucción', 'Desafío Legal y Análisis Científico', 'Defensa de Evidencia y Reforma de Infraestructura'],
  connectors: [
    { name: 'Portal WADA ADAMS', type: 'Administración Antidopaje', detail: 'Muestra #CA26-0847: Hallazgo Analítico Adverso reportado' },
    { name: 'Comisión Médica CONMEBOL', type: 'Coordinación Control de Dopaje', detail: 'Copa América 2026: 340 pruebas en 6 sedes' },
    { name: 'Laboratorio Brasileño de Control de Dopaje', type: 'Laboratorio Acreditado WADA', detail: 'Río de Janeiro — laboratorio acreditado más cercano' },
    { name: 'División Antidopaje del TAS', type: 'Jurisprudencia de Apelación', detail: '147 casos previos de cadena de custodia indexados' },
  ],
  agentRoles: R,
  scriptContent: [
    'ALERTA ANTIDOPAJE. Copa América 2026 Fase de Grupos: Muestra #CA26-0847 recolectada de Jugador Z (delantero estrella, país anfitrión) después de partido en Sucre, Bolivia (2.810m) ha dado Hallazgo Analítico Adverso por agente anabólico prohibido (ratio testosterona/epitestosterona de 11,2:1, umbral es 4:1). El hallazgo es inequívoco desde perspectiva de laboratorio. Sin embargo, la cadena de custodia presenta vulnerabilidad crítica: (1) Muestra recolectada en Sucre a las 22:45 después del partido. (2) No existe laboratorio acreditado WADA en Bolivia. (3) Transporte por carretera a aeropuerto de La Paz (3 horas), vuelo a São Paulo (5 horas), courier a LBCD en Río (6 horas). (4) Total: 48 horas. (5) El registro de temperatura de cadena de frío muestra brecha de 4 horas 12 minutos durante tránsito en aeropuerto de La Paz sin datos registrados. Esta brecha es el único argumento de la defensa.',
    'Reconstrucción de cadena de custodia. (1) Recolección: Oficial de Control de Dopaje certificado, documentación completa, jugador firmó formulario, muestras A y B selladas con testigos. Sin irregularidad. (2) Tramo 1 (Sucre-La Paz): case de transporte aislado con registrador continuo. 2-8°C durante 3 horas. (3) Aeropuerto de La Paz: ESTA ES LA BRECHA. Registrador muestra lecturas hasta 02:17, luego nada hasta 06:29 (4 horas 12 minutos). El log escrito del courier dice que muestras permanecieron en case aislado en área segura de carga. Sin verificación electrónica. (4) Tramo 2 (La Paz-São Paulo-Río): registrador reanuda a 06:29, cumplimiento continuo 2-8°C. (5) Recepción laboratorio: LBCD recibió dentro de especificación. La brecha de 4 horas es el ÚNICO problema — pero bajo WADA IST, CUALQUIER brecha puede ser usada como defensa.',
    'DISENSO REGISTRADO. La defensa se centrará en la brecha de 4 horas. Argumentos: (1) Bajo WADA IST Art. 6.4, la Autoridad de Control debe demostrar "ninguna desviación que pudiera razonablemente haber causado el HAA." (2) Una brecha de 4 horas no documentada a 4.061m (El Alto — aeropuerto internacional más alto del mundo) significa que las muestras pudieron exponerse a frío extremo (temperaturas nocturnas en El Alto bajan a -10°C), potencialmente degradando metabolitos. (3) Precedente TAS mixto: TAS 2018/A/5546 consideró brecha de 2 horas insuficiente para invalidar; TAS 2021/A/7803 con brecha de 6 horas SÍ invalidó. Nuestra brecha de 4 horas cae entre ambos precedentes. Exijo evidencia corroborante: CCTV del aeropuerto, GPS del celular del courier, y cálculos de masa térmica del case aislado.',
    'BANDERA LEVANTADA. Dimensión DOJ: integridad antidopaje es parte del compromiso de reforma de CONMEBOL. Si estrella del país anfitrión es exonerada por tecnicismo de cadena de custodia — con hallazgo de laboratorio inequívoco (11,2:1 vs umbral 4:1) — la percepción será que el sistema antidopaje de CONMEBOL es estructuralmente inadecuado para la geografía sudamericana. El monitor DOJ notará que CONMEBOL sabía que Bolivia no tenía laboratorio acreditado, sabía que el transporte requería 48 horas por 3 países, y no implementó monitoreo redundante. Fallo de infraestructura de gobernanza.',
    'Proponiendo Protocolo de Cadena de Custodia Antidopaje: (1) ESTE CASO: Cadena completa reconstruida y sellada — cada entrega, cada lectura, cada brecha. CCTV del aeropuerto (solicitado a AASANA Bolivia) y cálculos de masa térmica añadidos. Análisis de ingeniería térmica: case aislado de grado médico mantiene 2-8°C por 12+ horas incluso a -10°C — la brecha de 4 horas, aunque fallo documental, casi con certeza NO rompió requisitos de temperatura. (2) FUTURO: CONMEBOL manda registradores IoT con GPS y transmisión por satélite para TODO transporte antidopaje. Sin brechas posibles. Costo: $200 por unidad. (3) MUESTRA B: Derecho preservado, transporte con nuevo registrador IoT como demostración. (4) Paquete formateado para WADA, TAS y DOJ.',
    'El cálculo de masa térmica es decisivo. Case de grado médico mantiene temperatura por 12+ horas a -10°C — datos revisados por pares de estándares IATA de cadena fría farmacéutica. La brecha de 4 horas es insuficiente científicamente para comprometer la muestra. Combinado con CCTV (case en área segura, sin manipulación) y GPS del courier (presencia continua), la cadena se sostiene. TAS 2021/A/7803 es distinguible — ese caso involucró contenedor no aislado. Disenso RETIRADO. El HAA se mantiene, y el mandato IoT previene brechas futuras.',
  ],
  receipt: {
    merkleLabel: 'Raíz Merkle (Recolección DCO + Registros temperatura + CCTV aeropuerto + Análisis térmico + Recibo laboratorio)',
    complianceLabel: 'Integridad Antidopaje',
    complianceValue: 'CADENA VERIFICADA',
    complianceThreshold: 'Cumplimiento WADA IST confirmado',
    guaranteeTitle: 'Copa América — Cadena de Custodia Antidopaje Sellada',
    guaranteeBody: 'Paquete sellado: registros de recolección, monitoreo continuo de temperatura (con explicación de brecha de 4 horas respaldada por cálculos de masa térmica y CCTV), cadena de 48 horas por 3 países, recibo LBCD y Hallazgo Analítico Adverso (ratio T/E 11,2:1), y mandato de registradores IoT. Cadena se sostiene bajo escrutinio científico. Derechos de muestra B preservados.',
    evidenceChain: 'Recolección (Sucre) → DCO → Transporte (temp) → Aeropuerto La Paz (brecha 4hr + análisis térmico) → Vuelo São Paulo → Courier Río → Recibo LBCD → HAA reportado → Mandato IoT → Sello ML-DSA-65',
  },
};
