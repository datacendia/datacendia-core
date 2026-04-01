/**
 * Grupo Figer — Portuguese (Português) Scenarios
 * @module pages/sandbox/configs/grupo-figer-pt
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import type { TemplateScenario } from '../SandboxTemplate';
import { AGENTS_PT } from './grupo-figer-agents';

const A = AGENTS_PT;

// =============================================================================
// CENÁRIO 1 — DUPLA REPRESENTAÇÃO
// =============================================================================

const S1: TemplateScenario = {
  id: 'dual-representation',
  title: 'Dupla Representação — Transferência para a Premier League',
  subtitle: 'Teto de honorários FIFA 6% · Consentimento duplo obrigatório · Visto de trabalho FA GBE · Prazo de registro IMS',
  banner: 'Um cliente da Figer está sendo transferido do Flamengo para um clube da Premier League. A Figer representa tanto o jogador quanto o clube comprador (dupla representação). O Regulamento de Agentes FIFA 2023 exige consentimento escrito explícito de ambas as partes, teto combinado de 6%, e registro no IMS. A FA exige visto de trabalho GBE. Um documento faltante anula todos os honorários.',
  risk: 'Crítico',
  scenarioNum: 'Transferência',
  icon: 'scale',
  color: 'text-emerald-400',
  agents: [A.transferAgent, A.fifaCompliance, A.legalAgent, A.financialAgent],
  connectors: [
    { name: 'Portal FIFA IMS', status: 'connected', type: 'Sistema de Gestão de Intermediários', icon: 'shield', detail: 'Janela de transferências fecha em 72 horas — registro IMS obrigatório' },
    { name: 'Sistema de Registro CBF', status: 'connected', type: 'Base de Dados CBF', icon: 'database', detail: 'Contrato do jogador registrado — ITC pendente da CBF para FA' },
    { name: 'Calculadora FA GBE', status: 'syncing', type: 'Avaliação de Visto de Trabalho UK', icon: 'globe', detail: 'Convocações internacionais: 12 (Brasil U-23) — limiar GBE: 70 pontos' },
    { name: 'Arquivo de Mandatos Figer', status: 'connected', type: 'Documentação de Mandatos', icon: 'file-text', detail: '3 mandatos ativos para este jogador em 2 jurisdições' },
  ],
  script: [
    { agentId: 'transfer', phase: 'phase1', type: 'warning', delay: 800, content: 'ALERTA DE DUPLA REPRESENTAÇÃO. A Figer atua pelo jogador (mandato de venda assinado em 14 de março de 2026) e pelo clube comprador da Premier League (carta de compromisso de compra em 22 de março de 2026). Os Artigos 12-13 do Regulamento de Agentes FIFA 2023 exigem: (1) Consentimento escrito explícito do jogador reconhecendo a dupla representação, (2) Consentimento escrito explícito do clube, (3) Divulgação completa de conflito de interesses, (4) Honorário combinado não pode exceder 6% da remuneração bruta do jogador sob o Artigo 16. Status atual: Consentimento do jogador — ASSINADO. Consentimento do clube — PENDENTE. A janela de transferências fecha em 72 horas. Sem consentimento do clube, todo o direito a honorários da Figer é nulo.' },
    { agentId: 'financial', phase: 'phase1', type: 'analysis', delay: 2500, content: 'Análise da estrutura de honorários. Remuneração bruta do jogador: £4,2M/ano × contrato de 5 anos = £21M total. Teto FIFA a 6% (dupla representação): £1,26M máximo. Honorário proposto pela Figer: £1,1M (5,24% — dentro do teto). Rota de pagamento: O clube paga diretamente à Figer através do FIFA IMS — sem intermediários permitidos sob Artigos 17-20. Verificação AML: Fonte de pagamento verificada — conta operacional do clube. Notificação COAF obrigatória para recebimento transfronteiriço acima de R$50.000. Declaração à Receita Federal obrigatória em 30 dias.' },
    { agentId: 'fifa', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSIDÊNCIA REGISTRADA. A carta de compromisso tem data de 22 de março de 2026, mas faz referência a um "acordo verbal de fevereiro de 2026." De acordo com o Artigo 14 do Regulamento de Agentes FIFA 2023, os mandatos devem ser por escrito antes de qualquer representação. Se a FIFA determinar que a Figer começou a representar o clube em fevereiro sem mandato escrito, o honorário do lado da compra (£550K) está em risco. O mandato registrado na CBF não faz referência explícita ao consentimento de dupla representação exigido pelo Artigo 12. É necessário um formulário independente de consentimento FIFA.' },
    { agentId: 'legal', phase: 'phase2', type: 'flag', delay: 2000, content: 'ALERTA ELEVADO. Jurisprudência CAS: CAS 2024/A/9847 (Agente vs. Clube) — o TAS decidiu que acordos verbais anteriores a mandatos escritos não validam retroativamente a representação. A referência ao acordo verbal de fevereiro cria vulnerabilidade. Além disso, a avaliação GBE da FA mostra 65 pontos contra um limiar de 70. A transferência falhará no registro da FA a menos que o clube solicite revisão do painel de exceções ou as convocações sejam recalculadas sob o marco GBE 2026 revisado.' },
    { agentId: 'transfer', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Propondo Pacote de Transferência Conforme Datacendia: (1) Executar Formulário independente de Consentimento de Dupla Representação FIFA — jogador E clube assinam simultaneamente, com linguagem explícita dos Artigos 12-13. Selado criptograficamente via CendiaChronos. (2) Alterar a carta para remover referência ao acordo verbal de fevereiro — a data efetiva do mandato escrito é 22 de março de 2026. (3) Registrar no IMS imediatamente. (4) Clube apresenta solicitação de exceções GBE hoje. (5) Documentação AML completa: notificação COAF e declaração Receita Federal preparadas. Tudo selado com RFC 3161 e ML-DSA-65.' },
    { agentId: 'fifa', phase: 'phase3', type: 'resolution', delay: 2500, content: 'O formulário de consentimento com carimbo de tempo criptográfico elimina o risco de retroatividade identificado no CAS 2024/A/9847. A carta alterada remove a referência de fevereiro — cadeia de mandato limpa. O registro IMS com selo de evidência Datacendia fornece procedência completa aos auditores FIFA: mandato → consentimento → cálculo de honorários → registro IMS, tudo vinculado criptograficamente. Dissidência RETIRADA. Este é o padrão de evidência que o Regulamento de Agentes FIFA 2023 pretendia.' },
  ],
  receiptTemplate: {
    hash: 'SHA-256:f4e8c62d1a7b9530e8d2c96f4b1a3e5d7c9f0a2b4d6e8f0a2b4d6e8f0a2b4d6e',
    merkleRoot: 'b7c9e1d3f5a7b9c1d3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9',
    merkleLabel: 'Árvore Merkle (Consentimento duplo + Cálculo de honorários + Registro IMS + Solicitação GBE + Documentação AML)',
    complianceLabel: 'Status Regulamento de Agentes FIFA 2023',
    complianceValue: 'DUPLA REPRESENTAÇÃO CONFORME',
    complianceThreshold: 'Artigos 12-16 cumpridos',
    agents: ['Agente de Governança', 'Agente FIFA', 'Agente Jurídico', 'Agente Financeiro'],
    dissents: 1,
    dissentResolved: true,
    guaranteeTitle: 'Grupo Figer — Evidência de Transferência com Dupla Representação Selada',
    guaranteeBody: 'Este pacote criptográfico sela evidência completa de conformidade de dupla representação para auditoria FIFA IMS: consentimento do jogador, consentimento do clube, divulgação de conflitos, cálculo do teto de honorários (5,24% ≤ 6%), autorização AML e solicitação GBE.',
    evidenceChain: 'Verificação de mandato → Consentimento duplo → Cálculo do teto → Registro IMS → Solicitação GBE → AML/COAF → Selagem → ML-DSA-65',
  },
  idleTitle: 'Pronto para Deliberar',
  idleDesc: '4 agentes IA realizarão uma revisão completa de conformidade de transferência com dupla representação — validando mandatos FIFA, tetos de honorários, registro IMS, vistos de trabalho FA e documentação AML.',
  phaseLabels: ['Análise de Mandato e Honorários', 'Revisão de Conformidade e Debate', 'Resolução e Selagem de Evidência'],
};

// =============================================================================
// CENÁRIO 2 — PROTEÇÃO DE MENORES
// =============================================================================

const S2: TemplateScenario = {
  id: 'minor-protection',
  title: 'Proteção de Jogador Menor — FIFA Artigo 19',
  subtitle: 'Jogador de 16 anos · Transferência internacional · Aprovação do Subcomitê FIFA · Proteção infantil ECA',
  banner: 'A Figer descobre um talento de 16 anos de uma escolinha de São Paulo para um clube da Primeira Liga portuguesa. O Artigo 19 do RSTP FIFA proíbe transferências internacionais de menores de 18 anos salvo exceções específicas. Requer aprovação do Subcomitê FIFA, consentimento dos pais, planos educacionais e conformidade com o ECA do Brasil.',
  risk: 'Crítico',
  scenarioNum: 'Juvenil',
  icon: 'shield-check',
  color: 'text-orange-400',
  agents: [A.youthProtection, A.fifaCompliance, A.legalAgent, A.dataProtection],
  connectors: [
    { name: 'Subcomitê FIFA', status: 'syncing', type: 'Aprovação de Menores', icon: 'shield', detail: 'Solicitação pendente — processamento médio: 45 dias' },
    { name: 'Registro Juvenil CBF (BID)', status: 'connected', type: 'Base de Dados Juvenil', icon: 'database', detail: 'Jogador registrado desde os 14 — histórico desde 2022' },
    { name: 'Registro de Conformidade ECA', status: 'connected', type: 'Marco de Proteção Infantil', icon: 'shield-check', detail: 'Estatuto da Criança — horários, educação, bem-estar' },
    { name: 'Portal de Agentes FPF', status: 'ready', type: 'Registro FA Portuguesa', icon: 'globe', detail: 'Cota de estrangeiros Primeira Liga: 8 vagas não-UE disponíveis' },
  ],
  script: [
    { agentId: 'youth', phase: 'phase1', type: 'warning', delay: 800, content: 'ALERTA DE PROTEÇÃO DE MENORES. O jogador tem 16 anos — nascido em 8 de junho de 2009. Qualquer transferência internacional requer exceção do Artigo 19 do RSTP FIFA. Exceção 2 potencialmente aplicável (Portugal é UE): o clube deve fornecer educação futebolística E acadêmica adequada, alojamento apropriado, e designar um responsável pelo bem-estar. A Figer deve documentar TODAS as condições e apresentar ao Subcomitê FIFA. PARADA OBRIGATÓRIA: Sem atividade de transferência até confirmação do Subcomitê.' },
    { agentId: 'data', phase: 'phase1', type: 'analysis', delay: 2500, content: 'ANÁLISE DE PROTEÇÃO DE DADOS LGPD/GDPR. Os dados do menor estão duplamente protegidos: LGPD brasileira Artigo 14 — proteções específicas para dados de crianças, requer consentimento dos pais. GDPR Artigo 8 — aplica-se no destino português. Categorias: registros médicos, boletins escolares, informações financeiras da família, dados biométricos. TODO processamento requer base legal documentada sob ambas legislações. A ANPD intensificou a fiscalização sobre dados de menores em contextos esportivos.' },
    { agentId: 'legal', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSIDÊNCIA REGISTRADA. O ECA do Brasil impõe limites rigorosos sobre condições de trabalho de menores. Artigo 67: Sem trabalho perigoso, noturno ou exaustivo para menores de 18. Os horários de treinamento de clubes europeus frequentemente excedem os limites do ECA. A solicitação ao Subcomitê deve demonstrar conformidade com a lei trabalhista portuguesa E padrões do ECA. O mandato de agência com menor de 16 anos requer co-assinatura do responsável legal E aprovação de um juiz da Justiça do Trabalho brasileira para realocação internacional.' },
    { agentId: 'fifa', phase: 'phase2', type: 'flag', delay: 2000, content: 'ALERTA ELEVADO. Taxa de aprovação do Subcomitê FIFA para transferências Brasil-Portugal de 16 anos: 67% (24 de 36 solicitações 2024-2026). Motivos de rejeição mais comuns: plano educacional inadequado (8), falta de responsável pelo bem-estar (4), alojamento insatisfatório (3), consentimento dos pais incompleto (1). A Figer deve verificar obrigações de compensação por formação — todos os clubes formadores desde os 12 anos têm direito sob Artigos 20-21 do RSTP FIFA.' },
    { agentId: 'youth', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Propondo Pacote de Proteção de Menores Datacendia: (1) Solicitação completa ao Subcomitê FIFA: verificação de idade, documentação Exceção 2, programa educacional, CV do responsável, planos de alojamento. (2) Consentimento dos pais bilíngue — assinado por ambos os pais, com reconhecimento de firma em cartório. (3) Plano de conformidade ECA — horários de treinamento contra limites do ECA. (4) LGPD/GDPR — consentimento dos pais para todas as categorias, SCCs para transferência transfronteiriça. (5) Compensação por formação via BID CBF. (6) Aprovação da Justiça do Trabalho. Tudo selado criptograficamente. PARADA OBRIGATÓRIA mantida.' },
    { agentId: 'legal', phase: 'phase3', type: 'resolution', delay: 2500, content: 'O Pacote de Proteção de Menores aborda os 4 fatores comuns de rejeição. A conformidade de dupla jurisdição (ECA + lei trabalhista portuguesa) demonstra que o dever de cuidado da Figer se estende além dos requisitos FIFA. O marco LGPD/GDPR protege contra ações das autoridades de dados. A compensação por formação preserva os direitos dos clubes formadores. Dissidência RETIRADA. Este é o padrão ouro para transferências internacionais de menores.' },
  ],
  receiptTemplate: {
    hash: 'SHA-256:a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
    merkleRoot: 'c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d5',
    merkleLabel: 'Árvore Merkle (Solicitação Art. 19 + Consentimento dos pais + Plano ECA + LGPD/GDPR + Compensação)',
    complianceLabel: 'Status FIFA Artigo 19',
    complianceValue: 'SOLICITAÇÃO APRESENTADA — PENDENTE SUBCOMITÊ',
    complianceThreshold: 'Condições da Exceção 2 documentadas',
    agents: ['Agente de Proteção Juvenil', 'Agente FIFA', 'Agente Jurídico', 'Agente de Dados'],
    dissents: 1,
    dissentResolved: true,
    guaranteeTitle: 'Grupo Figer — Evidência de Proteção de Menor Selada',
    guaranteeBody: 'Este pacote sela evidência completa de conformidade FIFA Artigo 19: solicitação ao Subcomitê, consentimento dos pais, plano ECA, proteção de dados LGPD/GDPR, compensação por formação e aprovação da Justiça do Trabalho.',
    evidenceChain: 'Verificação de idade → Avaliação de exceção → Plano educacional → Responsável → Consentimento → ECA → LGPD/GDPR → Compensação → Justiça do Trabalho → Selagem → ML-DSA-65',
  },
  idleTitle: 'Pronto para Deliberar',
  idleDesc: '4 agentes IA realizarão revisão completa de proteção de menores FIFA Artigo 19 — exceções, consentimento dos pais, bem-estar infantil, proteção de dados e compensação por formação.',
  phaseLabels: ['Avaliação de Proteção', 'Revisão Jurídica e de Dados', 'Resolução e Selagem'],
};

// =============================================================================
// CENÁRIO 3 — ARBITRAGEM CAS
// =============================================================================

const S3: TemplateScenario = {
  id: 'cas-arbitration',
  title: 'Arbitragem CAS — Disputa por Honorários Não Pagos',
  subtitle: 'Clube recusa £880K · Apresentação FIFA DRC · Procedimento CAS expedito · Prazo de 48 horas',
  banner: 'Um clube da Saudi Pro League se recusa a pagar os £880K de honorários da Figer, alegando que o mandato era inválido e os honorários excedem os tetos FIFA. A Figer deve apresentar perante a Câmara de Resolução de Disputas FIFA e preparar-se para procedimentos CAS expeditos. Evidência contemporânea completa determina o resultado.',
  risk: 'Alto',
  scenarioNum: 'CAS',
  icon: 'gavel',
  color: 'text-indigo-400',
  agents: [A.casArbitration, A.legalAgent, A.financialAgent, A.integrityAgent],
  connectors: [
    { name: 'Portal de Arbitragem CAS', status: 'connected', type: 'Tribunal Arbitral do Esporte', icon: 'gavel', detail: 'Procedimento expedito — evidência em 48 horas' },
    { name: 'Sistema DRC FIFA', status: 'connected', type: 'Câmara de Resolução de Disputas', icon: 'scale', detail: 'Reclamação #DRC-2026-04721 — resposta do clube pendente' },
    { name: 'Registro de Agentes SAFF', status: 'connected', type: 'Federação Saudita', icon: 'globe', detail: 'Registro Figer SAFF verificado — válido até dez 2027' },
    { name: 'Cofre de Evidência Figer', status: 'connected', type: 'Arquivo Criptográfico', icon: 'lock', detail: '47 documentos selados — cadeia completa' },
  ],
  script: [
    { agentId: 'cas', phase: 'phase1', type: 'warning', delay: 800, content: 'PROCEDIMENTO CAS EXPEDITO ATIVADO. O clube da Saudi Pro League apresentou reconvenção no CAS contestando os £880K da Figer. Três argumentos do clube: (1) Mandato assinado pelo Diretor Esportivo, não signatário autorizado sob lei societária saudita — mandato nulo. (2) Honorário de 4,2% da remuneração — clube alega ser única parte mandante, teto de 3% (£628K). (3) Registro IMS 2 horas antes do fechamento — clube alega que foi "após conclusão efetiva da transferência." CAS ordenou evidência em 48 horas.' },
    { agentId: 'financial', phase: 'phase1', type: 'analysis', delay: 2500, content: 'Análise forense de honorários. Remuneração total do jogador: £20,95M (contrato de 5 anos). Honorário Figer: £880K = 4,2%. Se apenas lado jogador (teto 3%): máximo £628K — argumento do clube vence, Figer perde £252K. Se dupla representação (teto 6%): máximo £1,257M — honorário conforme. Questão crítica: A Figer representava ambas as partes? Evidência: Mandato do jogador 3 de fevereiro de 2026. Carta do clube 18 de fevereiro de 2026 assinada por Mohammed Al-Rashidi. Consentimento de dupla representação 19 de fevereiro. Todos com carimbos de tempo RFC 3161 no cofre Datacendia.' },
    { agentId: 'legal', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSIDÊNCIA REGISTRADA. Sob a Lei de Sociedades Saudita (Decreto Real M/3), obrigações corporativas devem ser assinadas por representante autorizado. CAS 2023/A/9612 — CAS confirmou a contestação de um clube saudita contra acordo assinado por Diretor Esportivo sem autoridade do Conselho. Se Al-Rashidi não tinha resolução do Conselho ao assinar, o mandato é nulo sob lei saudita. A Figer deve produzir evidência da autoridade de Al-Rashidi na data da assinatura.' },
    { agentId: 'integrity', phase: 'phase2', type: 'flag', delay: 2000, content: 'ALERTA ELEVADO. O argumento de cronologia IMS é fraco — CAS 2024/A/9901 estabeleceu que registro IMS até o fechamento da janela é válido. Os carimbos criptográficos da Datacendia provam que a submissão IMS foi preparada 6 dias antes. Evidência crítica: Resolução do Conselho de 15 de janeiro de 2026 autorizando Al-Rashidi a "executar todos os acordos relacionados a transferências" — anexada à carta original no cofre Datacendia.' },
    { agentId: 'cas', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Propondo Pacote de Evidência CAS Datacendia — 48 Horas: (1) Cadeia de mandato: Mandato jogador (3 fev) → Carta clube (18 fev) → Consentimento duplo (19 fev) — todos com RFC 3161. (2) Resolução do Conselho (15 jan 2026) autorizando Al-Rashidi — capturada antes da disputa. (3) Cálculo: dupla representação 4,2% ≤ 6%. (4) Cronologia IMS: carimbos de 6 dias de antecedência. (5) Árvore Merkle vinculando 47 documentos. Exportação CAS com um clique.' },
    { agentId: 'legal', phase: 'phase3', type: 'resolution', delay: 2500, content: 'A Resolução do Conselho é decisiva — prova que Al-Rashidi tinha autoridade ao assinar, destruindo o argumento principal do clube. O carimbo criptográfico prova captura em tempo real, não fabricação posterior. O CAS sustenta consistentemente que evidência criptográfica contemporânea tem maior peso probatório. Com o precedente IMS (CAS 2024/A/9901), os três argumentos do clube falham. Dissidência RETIRADA. Este pacote deve resultar em recuperação total mais custos CAS.' },
  ],
  receiptTemplate: {
    hash: 'SHA-256:d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5',
    merkleRoot: 'e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9',
    merkleLabel: 'Árvore Merkle (47 docs: Cadeia de mandato + Resolução do Conselho + Cálculo + Cronologia IMS + Consentimento)',
    complianceLabel: 'Status de Evidência CAS',
    complianceValue: 'PACOTE SELADO — PRAZO 48H CUMPRIDO',
    complianceThreshold: 'Regras CAS de Procedimento cumpridas',
    agents: ['Agente CAS', 'Agente Jurídico', 'Agente Financeiro', 'Agente de Integridade'],
    dissents: 1,
    dissentResolved: true,
    guaranteeTitle: 'Grupo Figer — Pacote de Evidência CAS Expedito Selado',
    guaranteeBody: 'Este pacote sela 47 documentos para procedimento CAS expedito: cadeia de mandato, autoridade do signatário, cálculo de honorários, cronologia IMS e consentimento de dupla representação.',
    evidenceChain: 'Cadeia de mandato → Resolução do Conselho → Consentimento duplo → Cálculo → Cronologia IMS → Árvore Merkle → Selagem → ML-DSA-65',
  },
  idleTitle: 'Pronto para Deliberar',
  idleDesc: '4 agentes IA prepararão pacote de evidência CAS expedito — validando cadeia de mandato, autoridade do signatário, conformidade de honorários e cronologia IMS.',
  phaseLabels: ['Análise de Reclamação', 'Desafio Jurídico e Debate', 'Pacote e Selagem'],
};

// =============================================================================
// CENÁRIO 4 — DETECÇÃO TPO
// =============================================================================

const S4: TemplateScenario = {
  id: 'tpo-detection',
  title: 'Detecção de TPO — Transferência Sul-Americana',
  subtitle: 'FIFA RSTP Artigo 18ter · Estrutura de investimento oculta · Empresa de fachada · Propriedade circular',
  banner: 'A Figer facilita a transferência de um jogador colombiano de um clube argentino para a LaLiga. A devida diligência revela uma estrutura de propriedade complexa envolvendo um veículo de investimento uruguaio com direitos econômicos indiretos. A FIFA proibiu TPO globalmente em 2015, mas estruturas sul-americanas persistem.',
  risk: 'Alto',
  scenarioNum: 'TPO',
  icon: 'search',
  color: 'text-red-400',
  agents: [A.integrityAgent, A.fifaCompliance, A.legalAgent, A.financialAgent],
  connectors: [
    { name: 'Registro TPO FIFA', status: 'connected', type: 'Base de Dados TPO', icon: 'search', detail: 'Base de violações TPO — 847 casos históricos' },
    { name: 'Sistema de Registro AFA', status: 'connected', type: 'Base de Dados FA Argentina', icon: 'database', detail: 'Contrato do jogador + estrutura de propriedade' },
    { name: 'Registro Corporativo Uruguaio', status: 'syncing', type: 'Pesquisa de Propriedade', icon: 'building-2', detail: 'Verificando veículo de investimento — 4 camadas corporativas' },
    { name: 'Portal de Agentes RFEF', status: 'ready', type: 'Registro FA Espanhola', icon: 'globe', detail: 'Avaliação do teto salarial LaLiga pendente' },
  ],
  script: [
    { agentId: 'integrity', phase: 'phase1', type: 'warning', delay: 800, content: 'ALERTA DE AVALIAÇÃO TPO. A devida diligência revela que 30% dos direitos econômicos do jogador foram transferidos para "Río de la Plata Football Investments S.A." — sociedade anônima uruguaia — em 2021. O Artigo 18ter do RSTP FIFA proíbe que terceiros tenham influência sobre emprego, transferências ou assuntos do clube. A apresentação AFA (janeiro de 2026) mostra que o clube adquiriu 100% dos direitos em dezembro de 2024. No entanto, a entidade uruguaia não foi dissolvida e seus beneficiários incluem um membro da diretoria do clube argentino. PARADA OBRIGATÓRIA.' },
    { agentId: 'financial', phase: 'phase1', type: 'analysis', delay: 2500, content: 'Análise forense financeira. A entidade foi capitalizada com US$2,1M em 2021 — 30% do valor do jogador (US$7M). A "recompra" de dezembro de 2024 foi US$4,5M — 30% do valor atualizado (US$15M). Pagamento do clube argentino à conta do Río de la Plata no Banco República, Montevidéu. Análise de propriedade: o acionista controlador (67%) é Gabriel Martínez Aguirre — que também é Vice-Presidente do clube argentino. Estrutura circular: o clube pagou US$4,5M a uma empresa controlada por seu próprio Vice-Presidente. TPO disfarçado.' },
    { agentId: 'legal', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSIDÊNCIA REGISTRADA. A estrutura circular pode não constituir tecnicamente TPO se o clube genuinamente controla 100% dos direitos pós-dezembro de 2024. CAS 2022/A/8945 estabeleceu que TPO termina quando o clube adquire todos os direitos. Porém, o papel duplo do VP cria conflito ético FIFA separado. Se a Figer prosseguir e a FIFA determinar evasão de TPO, a Figer enfrenta: (a) Perda de honorários, (b) Suspensão de licença, (c) Investigação nas 11 jurisdições. Risco assimétrico — um honorário vs. todo o negócio da Figer.' },
    { agentId: 'fifa', phase: 'phase2', type: 'flag', delay: 2000, content: 'ALERTA ELEVADO. A FIFA sancionou 23 clubes por TPO desde 2015 — 7 envolveram estruturas onde um dirigente era beneficiário da entidade terceira. Em todos os 7 casos, a FIFA tratou o arranjo como TPO vigente independentemente da transferência formal de direitos. O pagamento circular é um alerta específico no protocolo de investigação FIFA. A obrigação de devida diligência da Figer exige "investigação razoável" — prosseguir sem resolver isso está abaixo do limiar.' },
    { agentId: 'integrity', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Propondo Protocolo de Resolução TPO Datacendia: (1) PARADA OBRIGATÓRIA mantida. (2) Exigir do clube argentino: (a) Parecer jurídico independente confirmando ausência de direitos econômicos de terceiros, (b) Divulgação de propriedade mostrando dissolução ou separação do VP, (c) Certificação AFA de 100% dos direitos. (3) Se condições cumpridas: prosseguir com documentação selada. (4) Se NÃO cumpridas: Figer se retira e apresenta divulgação proativa à FIFA demonstrando detecção e recusa. A divulgação protege a licença da Figer. Tudo selado criptograficamente.' },
    { agentId: 'legal', phase: 'phase3', type: 'resolution', delay: 2500, content: 'O Protocolo protege a Figer independentemente do resultado. Se resolvido, documentação completa. Se não, a divulgação proativa demonstra o "programa de conformidade eficaz" que protege licenças. O CAS recompensa agentes que detectam e divulgam violações. A evidência criptográfica prova que a detecção da Figer ocorreu antes de qualquer atividade de transferência. Dissidência RETIRADA. Isso transforma uma potencial catástrofe regulatória em demonstração dos padrões de governança da Figer.' },
  ],
  receiptTemplate: {
    hash: 'SHA-256:e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6',
    merkleRoot: 'f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9a1',
    merkleLabel: 'Árvore Merkle (Rastreamento de propriedade + Forense financeiro + Precedentes CAS + Protocolo de resolução)',
    complianceLabel: 'Status de Avaliação TPO',
    complianceValue: 'PARADA OBRIGATÓRIA — RESOLUÇÃO PENDENTE',
    complianceThreshold: 'FIFA RSTP Artigo 18ter',
    agents: ['Agente de Integridade', 'Agente FIFA', 'Agente Jurídico', 'Agente Financeiro'],
    dissents: 1,
    dissentResolved: true,
    guaranteeTitle: 'Grupo Figer — Evidência de Detecção TPO Selada',
    guaranteeBody: 'Este pacote sela evidência completa de avaliação TPO: rastreamento de propriedade, forense financeiro, detecção de estrutura circular, análise de precedentes CAS e protocolo de resolução.',
    evidenceChain: 'Rastreamento de propriedade → Forense financeiro → Propriedade beneficiária → Detecção circular → Precedentes CAS → Protocolo → Selagem → ML-DSA-65',
  },
  idleTitle: 'Pronto para Deliberar',
  idleDesc: '4 agentes IA realizarão avaliação TPO — rastreando propriedade beneficiária, analisando estruturas financeiras e aplicando paradas obrigatórias com evidência criptográfica.',
  phaseLabels: ['Análise de Propriedade', 'Forense Jurídico e Financeiro', 'Protocolo de Resolução'],
};

// =============================================================================
// CENÁRIO 5 — IMPOSTOS E AML BRASILEIRO
// =============================================================================

const S5: TemplateScenario = {
  id: 'brazil-tax-aml',
  title: 'Receita Federal e COAF — Conformidade Fiscal Transfronteiriça',
  subtitle: 'Honorário de R$12M · Alerta AML COAF · Auditoria Receita Federal · Direitos de imagem',
  banner: 'A Figer recebe R$12M de honorários de uma transferência para um clube saudita via FIFA IMS. A Receita Federal exige classificação fiscal precisa. O COAF alertou o pagamento para revisão AML. Simultaneamente, uma empresa de direitos de imagem estruturada pela Figer está sob auditoria da Receita Federal.',
  risk: 'Alto',
  scenarioNum: 'Fiscal/AML',
  icon: 'banknote',
  color: 'text-yellow-400',
  agents: [A.financialAgent, A.legalAgent, A.integrityAgent, A.dataProtection],
  connectors: [
    { name: 'Receita Federal do Brasil', status: 'connected', type: 'Autoridade Tributária', icon: 'landmark', detail: 'Notificação de auditoria — prazo de 30 dias' },
    { name: 'Portal COAF', status: 'syncing', type: 'Unidade de Inteligência Financeira', icon: 'alert-triangle', detail: 'Alerta AML — R$12M transfronteiriço de entidade saudita' },
    { name: 'Sistema BACEN', status: 'connected', type: 'Relatório de Câmbio', icon: 'banknote', detail: 'Contrato de câmbio registrado — taxa PTAX fixada' },
    { name: 'Rastreador FIFA IMS', status: 'connected', type: 'Verificação de Pagamentos', icon: 'shield', detail: 'Instrução de pagamento verificada — rota IMS confirmada' },
  ],
  script: [
    { agentId: 'financial', phase: 'phase1', type: 'warning', delay: 800, content: 'ALERTA DE AUDITORIA RECEITA FEDERAL. Dois eventos simultâneos: (1) Honorário de R$12M requer classificação fiscal correta — IRPJ 15% + 10% adicional sobre lucro acima de R$240K/ano, CSLL 9%, PIS/COFINS 3,65% (cumulativo) ou 9,25% (não cumulativo), ISS São Paulo 5%. Taxa efetiva total: 34-40%. Classificação incorreta gera multas de 75-150%. (2) A Receita Federal abriu auditoria sobre empresa de direitos de imagem (pessoa jurídica) de um cliente de alto perfil — suspeitam que a empresa carece de "substância comercial." Este é o questionamento mais comum da Receita Federal a estruturas de direitos de imagem no futebol brasileiro.' },
    { agentId: 'integrity', phase: 'phase1', type: 'analysis', delay: 2500, content: 'ANÁLISE AML COAF. A Resolução COAF 36/2021 exige que agentes esportivos reportem transações acima de R$50.000, transações com jurisdições monitoradas pelo GAFI, e rotas de pagamento incomuns. Os R$12M da Arábia Saudita ativam os três critérios. A Figer deve apresentar um Relatório de Transação Suspeita (STR) ao COAF em 24 horas. Não porque a transação é suspeita, mas porque o valor e origem atendem limiares de reporte obrigatório. Não reportar gera multas de R$20M ou 2× o valor da transação.' },
    { agentId: 'legal', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSIDÊNCIA REGISTRADA. A auditoria de direitos de imagem é o problema mais perigoso. A Receita Federal questionou 340+ empresas de direitos de imagem desde 2019 sob a doutrina de "substância comercial." Posição da Receita: se mais de 95% da receita da PJ vem de uma única fonte (o clube), e a PJ não tem funcionários, escritório nem atividades além de receber pagamentos de imagem, carece de substância e deve ser tributada como renda pessoal. Alíquota pessoal: 27,5% vs. PJ: ~11%. Se a Receita reclassificar, o jogador enfrenta impostos retroativos e a Figer enfrenta responsabilidade profissional pelo assessoramento.' },
    { agentId: 'data', phase: 'phase2', type: 'flag', delay: 2000, content: 'ALERTA ELEVADO. A PJ de direitos de imagem contém dados financeiros pessoais do jogador protegidos pela LGPD. Se a Receita Federal solicitar acesso aos registros, a Figer deve verificar: (1) A solicitação tem base legal sob legislação tributária, (2) Apenas dados relevantes à auditoria são divulgados, (3) O jogador é notificado conforme LGPD Artigo 18. A ANPD estabeleceu que auditorias fiscais não anulam os requisitos de minimização de dados da LGPD.' },
    { agentId: 'financial', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Propondo Pacote de Conformidade Fiscal e AML Datacendia: (1) STR COAF — apresentado em 24 horas com documentação completa. (2) Declaração de honorários — cálculos IRPJ/CSLL/PIS/COFINS/ISS com comprovantes, via e-CAC. (3) Resposta à auditoria de imagem — evidência de substância comercial: contratos com 3 patrocinadores (não só o clube), demonstrações financeiras diversificadas, contrato de escritório, dois funcionários de meio período. (4) Divulgação conforme LGPD — apenas documentos especificados, com notificação ao jogador. Tudo selado criptograficamente.' },
    { agentId: 'legal', phase: 'phase3', type: 'resolution', delay: 2500, content: 'A questão crítica é se a PJ tem substância comercial genuína. Se a evidência mostrar 3 contratos de patrocínio e diversificação, o questionamento da Receita é defensável — correspondendo ao padrão vencedor em decisões recentes do CARF. O STR COAF proativo demonstra conformidade AML. A divulgação conforme LGPD mostra respeito por direitos de dados mesmo sob pressão governamental. Dissidência RETIRADA. Este pacote transforma duas ameaças de conformidade em demonstração da governança integrada da Figer.' },
  ],
  receiptTemplate: {
    hash: 'SHA-256:f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7',
    merkleRoot: 'a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9a1b3',
    merkleLabel: 'Árvore Merkle (STR COAF + Cálculos fiscais + Evidência de imagem + LGPD + BACEN)',
    complianceLabel: 'Status Receita Federal e COAF',
    complianceValue: 'COAF APRESENTADO — RESPOSTA FISCAL PREPARADA',
    complianceThreshold: 'COAF 36/2021 + Requisitos Receita Federal',
    agents: ['Agente Financeiro', 'Agente Jurídico', 'Agente de Integridade', 'Agente de Dados'],
    dissents: 1,
    dissentResolved: true,
    guaranteeTitle: 'Grupo Figer — Evidência de Conformidade Fiscal e AML Selada',
    guaranteeBody: 'Este pacote sela conformidade fiscal e AML brasileira completa: STR COAF, cálculos de honorários, evidência de substância de imagem, divulgação LGPD e documentação BACEN.',
    evidenceChain: 'STR COAF → Classificação fiscal → Auditoria de imagem → LGPD → BACEN → Selagem → ML-DSA-65',
  },
  idleTitle: 'Pronto para Deliberar',
  idleDesc: '4 agentes IA realizarão revisão de conformidade fiscal e AML brasileira — relatório COAF, resposta a auditoria, defesa de imagem e governança de dados LGPD.',
  phaseLabels: ['Avaliação Fiscal e AML', 'Defesa de Auditoria e Dados', 'Pacote e Selagem'],
};

// =============================================================================
// CENÁRIO 6 — DIREITOS DE IMAGEM MULTI-JURISDIÇÃO
// =============================================================================

const S6: TemplateScenario = {
  id: 'image-rights',
  title: 'Direitos de Imagem Multi-Jurisdição',
  subtitle: 'Brasil PJ · Espanha sociedad · UK renda pessoal · Arábia Saudita empregador · 4 regimes fiscais',
  banner: 'Um cliente da Figer joga na Espanha mas tem contratos de direitos de imagem no Brasil, no Reino Unido e na Arábia Saudita. Cada jurisdição trata os direitos de imagem de forma diferente. Uma estrutura incorreta gera impostos retroativos e multas nas 4 jurisdições simultaneamente.',
  risk: 'Alto',
  scenarioNum: 'Imagem',
  icon: 'eye',
  color: 'text-violet-400',
  agents: [A.financialAgent, A.legalAgent, A.dataProtection, A.fifaCompliance],
  connectors: [
    { name: 'Receita Federal do Brasil', status: 'connected', type: 'Autoridade Tributária Brasileira', icon: 'landmark', detail: 'Empresa PJ de imagem — declaração anual em 60 dias' },
    { name: 'Agencia Tributaria (Espanha)', status: 'connected', type: 'Autoridade Tributária Espanhola', icon: 'landmark', detail: 'IRPF imagem não residente — avaliação Lei Beckham' },
    { name: 'HMRC (Reino Unido)', status: 'syncing', type: 'Autoridade Tributária UK', icon: 'landmark', detail: 'Patrocínio de imagem de marca UK — avaliação de retenção' },
    { name: 'GAZT (Arábia Saudita)', status: 'ready', type: 'Autoridade Tributária Saudita', icon: 'landmark', detail: 'Direitos de imagem como renda de emprego — 0% imposto pessoal' },
  ],
  script: [
    { agentId: 'financial', phase: 'phase1', type: 'warning', delay: 800, content: 'ALERTA DE DIREITOS DE IMAGEM MULTI-JURISDIÇÃO. Cliente da Figer joga na LaLiga. Receitas de imagem de 4 jurisdições: (1) BRASIL — PJ do jogador recebe R$3,2M/ano de 2 patrocinadores. Alíquota PJ ~11% vs pessoal 27,5%. Receita Federal questiona estruturas PJ sem "substância comercial." (2) ESPANHA — Clube paga 15% do salário como imagem por sociedad civil. Lei Beckham permite 24% para não residentes — mas renda de imagem pode não se qualificar. (3) UK — £400K de patrocínio com marca britânica. HMRC tributa direitos de imagem de não residentes sob Seção 966 ITA 2007. (4) ARÁBIA SAUDITA — R$1,8M de jogos de exibição. 0% imposto pessoal mas possível reclassificação como renda empresarial (20% Zakat). Exposição total se as estruturas falharem: €2,1M estimados em impostos retroativos.' },
    { agentId: 'legal', phase: 'phase1', type: 'analysis', delay: 2500, content: 'Avaliação jurisdição por jurisdição. BRASIL: A PJ tem 2 contratos de patrocínio e 1 funcionário — atende limiar mínimo de substância conforme decisões recentes do CARF. Risco: MÉDIO. ESPANHA: A sociedad civil está sendo questionada pela Agencia Tributaria quando o jogador é sócio único. Risco: ALTO. UK: Seção 966 ITA 2007 exige retenção. A marca UK paga bruto atualmente — sem retenção. HMRC aplicará multas. Risco: CRÍTICO. ARÁBIA SAUDITA: Risco BAIXO — raramente aplica a artistas estrangeiros.' },
    { agentId: 'data', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSIDÊNCIA REGISTRADA. As estruturas de imagem envolvem dados financeiros do jogador em 4 jurisdições — LGPD, GDPR, UK GDPR e PDPL saudita. Se qualquer autoridade solicitar a estrutura global (comum em auditorias), a Figer deve navegar 4 regimes de proteção de dados. O CRS da OCDE compartilha automaticamente informações entre Espanha e Brasil — contradições serão detectadas em 12-18 meses. A Figer deve garantir que as 4 estruturas contem a mesma história.' },
    { agentId: 'fifa', phase: 'phase2', type: 'flag', delay: 2000, content: 'ALERTA ELEVADO. O Artigo 22 do Regulamento de Agentes FIFA 2023 exige agir no "melhor interesse do cliente." Se as estruturas de imagem gerarem impostos retroativos, o jogador pode alegar negligência da Figer. Além disso, todas as estruturas financeiras devem ser documentadas para auditoria FIFA. A estrutura de 4 jurisdições deve ser totalmente divulgada na declaração anual de conformidade FIFA da Figer.' },
    { agentId: 'financial', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Propondo Pacote de Conformidade de Imagem Datacendia: (1) UK URGENTE — Implementar retenção Seção 966 imediatamente. Divulgação voluntária ao HMRC (multas reduzidas 10-30% vs 100%). (2) ESPANHA — Verificar que a sociedad civil tem caráter associativo genuíno. Se não, reestruturar. (3) BRASIL — Documentar substância comercial da PJ. (4) SAUDITA — Manter tratamento atual. (5) Verificação de consistência transfronteiriça — Datacendia mapeia as 4 estruturas garantindo coerência ante intercâmbio automático CRS. (6) Declaração FIFA preparada. Tudo selado criptograficamente.' },
    { agentId: 'legal', phase: 'phase3', type: 'resolution', delay: 2500, content: 'A divulgação voluntária UK é a ação imediata crítica. A reestruturação da sociedad civil espanhola deve ocorrer neste ano fiscal. A verificação de consistência CRS é o elemento mais valioso — a maioria dos agentes nunca verifica coerência entre jurisdições. A divulgação FIFA protege a licença da Figer. Dissidência RETIRADA. Este pacote transforma assessoria fragmentada em conformidade global integrada.' },
  ],
  receiptTemplate: {
    hash: 'SHA-256:a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8',
    merkleRoot: 'b9c1d3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1',
    merkleLabel: 'Árvore Merkle (Brasil PJ + Espanha sociedad + UK retenção + Saudita + Consistência CRS + Divulgação FIFA)',
    complianceLabel: 'Conformidade de Direitos de Imagem',
    complianceValue: 'DIVULGAÇÃO UK APRESENTADA — 4 JURISDIÇÕES ALINHADAS',
    complianceThreshold: 'Consistência CRS verificada',
    agents: ['Agente Financeiro', 'Agente Jurídico', 'Agente de Dados', 'Agente FIFA'],
    dissents: 1,
    dissentResolved: true,
    guaranteeTitle: 'Grupo Figer — Evidência de Direitos de Imagem Multi-Jurisdição Selada',
    guaranteeBody: 'Este pacote sela conformidade de direitos de imagem em 4 jurisdições: substância PJ brasileira, reestruturação sociedad espanhola, divulgação voluntária HMRC, documentação saudita, verificação CRS e divulgação FIFA.',
    evidenceChain: 'Auditoria PJ Brasil → Revisão sociedad Espanha → Divulgação voluntária UK → Avaliação saudita → Consistência CRS → Declaração FIFA → Selagem → ML-DSA-65',
  },
  idleTitle: 'Pronto para Deliberar',
  idleDesc: '4 agentes IA realizarão revisão de direitos de imagem multi-jurisdição — alinhando estruturas fiscais no Brasil, Espanha, UK e Arábia Saudita.',
  phaseLabels: ['Análise Jurisdicional', 'Proteção de Dados e FIFA', 'Alinhamento Global e Selagem'],
};

// =============================================================================
// CENÁRIO 7 — LICENCIAMENTO DE AGENTES FIFA
// =============================================================================

const S7: TemplateScenario = {
  id: 'agent-licensing',
  title: 'Licenciamento de Agentes FIFA — Conformidade Multi-Federação',
  subtitle: '11 jurisdições · Exame anual · Requisitos DPC · Conduta · Divulgação de honorários',
  banner: 'A Figer opera em 11 jurisdições e deve manter licenças com cada federação nacional. O Regulamento de Agentes FIFA 2023 introduziu exames anuais obrigatórios, desenvolvimento profissional contínuo e padrões de conduta. Uma licença vencida significa que a Figer não pode atuar legalmente nessa jurisdição.',
  risk: 'Alto',
  scenarioNum: 'Licenças',
  icon: 'shield-check',
  color: 'text-blue-400',
  agents: [A.fifaCompliance, A.legalAgent, A.transferAgent, A.integrityAgent],
  connectors: [
    { name: 'Plataforma de Agentes FIFA', status: 'connected', type: 'Registro Global', icon: 'shield', detail: 'Figer registrada — exame anual em 45 dias' },
    { name: 'Registro CBF', status: 'connected', type: 'CBF', icon: 'database', detail: 'Licença principal — 200+ mandatos ativos' },
    { name: 'Portal Multi-Federação', status: 'syncing', type: '10 Federações Adicionais', icon: 'globe', detail: 'FA, RFEF, DFB, FIGC, FFF, SAFF, UAEFA, QFA, USSF, JFA' },
    { name: 'Sistema de Acompanhamento DPC', status: 'connected', type: 'Desenvolvimento Profissional', icon: 'book-open', detail: '12 horas DPC anuais exigidas — 8 concluídas' },
  ],
  script: [
    { agentId: 'fifa', phase: 'phase1', type: 'warning', delay: 800, content: 'AUDITORIA DE LICENÇAS FIFA. Verificação anual em 11 jurisdições: (1) Exame FIFA anual — em 45 dias. Taxa de aprovação 2025: 71%. (2) CBF — Licença vigente, renovação outubro 2026. (3) FA (Inglaterra) — Requisito DPC: 15 horas anuais, 8 concluídas, faltam 7. (4) RFEF (Espanha) — Novo requisito 2026: certificação AML anual. NÃO CONCLUÍDA. (5) SAFF (Arábia Saudita) — Renovação exige seguro de responsabilidade profissional cobrindo operações sauditas. Apólice atual EXCLUI Oriente Médio. LACUNA CRÍTICA.' },
    { agentId: 'legal', phase: 'phase1', type: 'analysis', delay: 2500, content: 'Avaliação de risco. A lacuna de seguro SAFF é a mais crítica — sem seguro válido, a licença SAFF está tecnicamente suspensa. Transações com clubes sauditas durante a exclusão são legalmente vulneráveis. A Arábia Saudita representa ~15% do volume anual de transferências da Figer (US$75M+). A certificação AML da RFEF é a segunda prioridade — Espanha é o maior mercado europeu. O déficit DPC da FA é gerenciável. O exame FIFA é risco de continuidade do negócio.' },
    { agentId: 'transfer', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSIDÊNCIA REGISTRADA. Há 3 negociações ativas com clubes sauditas — honorários potenciais de £2,1M. Se divulgarmos a lacuna de seguro, esses acordos podem desmoronar. Mas se completarmos e depois for descoberta, os 3 honorários estão em risco mais procedimentos disciplinares FIFA. A opção comercialmente atraente (completar primeiro, consertar depois) é a opção de catástrofe regulatória. Devemos obter cobertura de emergência ANTES de qualquer atividade saudita adicional.' },
    { agentId: 'integrity', phase: 'phase2', type: 'flag', delay: 2000, content: 'ALERTA ELEVADO. A FIFA suspendeu 14 agentes em 2025 por licenças inadequadas — 5 por lacunas de seguro, 3 por DPC vencido. Em todos os casos, as transações durante o período foram investigadas e os honorários sujeitos a confisco. A posição da FIFA: operar sem licença válida em QUALQUER jurisdição contamina TODAS as transações. A lacuna SAFF deve ser tratada como emergência organizacional.' },
    { agentId: 'fifa', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Propondo Pacote de Conformidade de Licenças Datacendia: (1) IMEDIATO — Extensão de emergência da apólice de seguro para Oriente Médio. Objetivo: 48 horas. Sem atividade saudita até confirmar. (2) Certificação AML RFEF — agendar em 14 dias. (3) DPC FA — registrar 3 cursos (7 horas) em 30 dias. (4) Preparação exame FIFA. (5) Calendário automatizado de renovação — cada federação, cada prazo, com alertas de 90 dias. (6) Revisão retroativa de transações sauditas durante lacuna — preparar divulgação voluntária à SAFF se necessário. Tudo selado criptograficamente.' },
    { agentId: 'transfer', phase: 'phase3', type: 'resolution', delay: 2500, content: 'O binder de seguro de emergência elimina o risco imediato. As 3 negociações sauditas são retomadas com cobertura confirmada — pausa de 48 horas comercialmente gerenciável. O calendário automatizado é o maior valor a longo prazo — previne recorrência nas 11 jurisdições. A divulgação voluntária SAFF demonstra detecção proativa. Dissidência RETIRADA. Isso transforma uma crise de conformidade em melhoria sistemática de governança.' },
  ],
  receiptTemplate: {
    hash: 'SHA-256:b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9',
    merkleRoot: 'c1d3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3',
    merkleLabel: 'Árvore Merkle (11 licenças + Seguro + DPC + Certificação AML + Exame)',
    complianceLabel: 'Status de Licenças',
    complianceValue: 'SEGURO RESTAURADO — 11 LICENÇAS VERIFICADAS',
    complianceThreshold: 'Regulamento de Agentes FIFA 2023 — todas as jurisdições',
    agents: ['Agente FIFA', 'Agente Jurídico', 'Agente de Transferências', 'Agente de Integridade'],
    dissents: 1,
    dissentResolved: true,
    guaranteeTitle: 'Grupo Figer — Evidência de Licenciamento Multi-Federação Selada',
    guaranteeBody: 'Este pacote sela conformidade de licenças em 11 jurisdições: verificação de seguro, DPC, certificação AML, registro de exame e calendário automatizado.',
    evidenceChain: 'Emergência de seguro → Restauração SAFF → AML RFEF → DPC FA → Exame FIFA → Calendário → Revisão retroativa → Selagem → ML-DSA-65',
  },
  idleTitle: 'Pronto para Deliberar',
  idleDesc: '4 agentes IA auditarão licenças em 11 jurisdições — verificando seguro, DPC, certificações e exames.',
  phaseLabels: ['Auditoria e Detecção de Lacunas', 'Avaliação de Risco e Debate', 'Remediação e Selagem'],
};

// =============================================================================
// CENÁRIO 8 — SOLIDARIEDADE E COMPENSAÇÃO POR FORMAÇÃO
// =============================================================================

const S8: TemplateScenario = {
  id: 'training-compensation',
  title: 'Solidariedade e Compensação por Formação — Trilha das Escolinhas',
  subtitle: 'FIFA RSTP Artigos 20-21 · 6 clubes formadores · Idade 12-23 · R$4,8M em reivindicações',
  banner: 'Um cliente da Figer se transfere de um clube da Série A para a Bundesliga por €18M. Sob os Artigos 20-21 do RSTP FIFA, cada clube que formou o jogador entre 12 e 23 anos tem direito a compensação. O jogador passou por 3 escolinhas brasileiras, 2 clubes da Série B e o clube atual. Rastrear esse histórico no sistema fragmentado do futebol juvenil brasileiro é um dos maiores desafios de conformidade do futebol mundial.',
  risk: 'Alto',
  scenarioNum: 'Formação',
  icon: 'trending-up',
  color: 'text-cyan-400',
  agents: [A.transferAgent, A.financialAgent, A.legalAgent, A.fifaCompliance],
  connectors: [
    { name: 'Sistema BID CBF', status: 'connected', type: 'Registro de Jogadores', icon: 'database', detail: 'Histórico: 6 clubes desde os 12 — registros BID fragmentados' },
    { name: 'Portal FIFA TMS', status: 'connected', type: 'Sistema de Transferências', icon: 'shield', detail: 'Transferência internacional €18M — mecanismo de solidariedade ativado' },
    { name: 'Sistema DFB', status: 'syncing', type: 'FA Alemã', icon: 'globe', detail: 'Registro pendente — janela de reivindicações aberta' },
    { name: 'Registro de Clubes Brasileiros', status: 'connected', type: 'Escolinhas e Clubes Juvenis', icon: 'search', detail: '3 escolinhas — 1 dissolvida, 1 fundida, 1 ativa' },
  ],
  script: [
    { agentId: 'transfer', phase: 'phase1', type: 'warning', delay: 800, content: 'ALERTA DE SOLIDARIEDADE E COMPENSAÇÃO POR FORMAÇÃO. Transferência internacional por €18M ativa RSTP FIFA: (1) MECANISMO DE SOLIDARIEDADE (Artigo 21) — 5% de €18M (€900K) distribuído aos clubes formadores proporcionalmente por anos de formação entre 12-23. Histórico BID CBF: Idade 12-14: Escolinha Futebol Arte (São Paulo) — DISSOLVIDA em 2022. Idade 14-16: Escolinha Craque do Futuro — FUNDIDA em 2023. Idade 16-18: EC Juventude (Série B) — ativo. Idade 18-19: Guarani FC (Série B) — ativo. Idade 19-23: Clube atual Série A — ativo. As escolinhas dissolvida e fundida criam um problema documental — quem recebe sua parte dos €900K?' },
    { agentId: 'financial', phase: 'phase1', type: 'analysis', delay: 2500, content: 'Cálculo de pagamentos de solidariedade. €900K total: Escolinha Futebol Arte (12-14, 2 anos): Categoria IV, €54K (6%). Escolinha Craque do Futuro (14-16, 2 anos): Categoria IV, €54K (6%). EC Juventude (16-18, 2 anos): Categoria III, €72K (8%). Guarani FC (18-19, 1 ano): Categoria III, €36K (4%). Clube Série A atual (19-23, 4 anos): Categoria I, €684K (76%). Problema: €54K para uma entidade dissolvida e €54K para uma fundida. Os registros BID da CBF não rastreiam consistentemente entidades sucessoras de clubes juvenis.' },
    { agentId: 'legal', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSIDÊNCIA REGISTRADA. A escolinha dissolvida cria um vácuo jurídico. Sob o Código Civil brasileiro (Lei 10.406/02), os bens residuais vão para uma entidade com fins semelhantes — mas as escolinhas raramente seguem procedimentos formais de dissolução. CAS 2021/A/7892 estabeleceu que o clube comprador assume o risco de pagar à entidade incorreta. A Figer deve obter: (1) Registros de dissolução da Junta Comercial de São Paulo, (2) Registro CBF confirmando entidade sobrevivente da fusão. Sem esses documentos, o clube da Bundesliga deve custodiar os €108K até confirmar sucessores.' },
    { agentId: 'fifa', phase: 'phase2', type: 'flag', delay: 2000, content: 'ALERTA ELEVADO. O registro DFB não pode ser concluído até resolver obrigações de solidariedade. A Circular FIFA 1709 exige reconhecimento ao registrar no TMS. Além disso, o clube atual da Série A pode disputar a alocação — se alegarem formação desde os 18 (não 19), sua parte aumenta. Os registros BID mostram registro aos 19 mas o clube pode apresentar evidência de formação informal anterior.' },
    { agentId: 'transfer', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Propondo Pacote de Resolução Datacendia: (1) Escolinha dissolvida — buscar registros da Junta Comercial. Sem sucessor, os €54K são distribuídos proporcionalmente conforme Circular 1709. (2) Escolinha fundida — consulta BID CBF para confirmar entidade sobrevivente. (3) Disputa de idade do clube Série A — a data BID controla. (4) Custódia de €108K para permitir registro TMS. (5) Cronograma de pagamentos de solidariedade para 6 clubes. Tudo selado criptograficamente.' },
    { agentId: 'legal', phase: 'phase3', type: 'resolution', delay: 2500, content: 'A custódia permite que o registro TMS prossiga protegendo o clube de pagamento duplo. O CAS validou custódias em disputas de solidariedade (CAS 2023/A/9456). A Junta Comercial resolverá em 10-15 dias. A data BID controla a disputa de idade. Dissidência RETIRADA. Este pacote resolve um desafio unicamente brasileiro.' },
  ],
  receiptTemplate: {
    hash: 'SHA-256:c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0',
    merkleRoot: 'd3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5',
    merkleLabel: 'Árvore Merkle (6 clubes + Cálculo + Busca clube dissolvido + Custódia + Verificação BID)',
    complianceLabel: 'Status de Solidariedade',
    complianceValue: 'CUSTÓDIA ESTABELECIDA — REGISTRO TMS PROSSEGUINDO',
    complianceThreshold: 'FIFA RSTP Artigos 20-21 cumpridos',
    agents: ['Agente de Transferências', 'Agente Financeiro', 'Agente Jurídico', 'Agente FIFA'],
    dissents: 1,
    dissentResolved: true,
    guaranteeTitle: 'Grupo Figer — Evidência de Solidariedade e Compensação Selada',
    guaranteeBody: 'Este pacote sela conformidade do mecanismo de solidariedade: histórico de 6 clubes, cálculo proporcional, resolução de escolinhas, custódia e verificação BID CBF.',
    evidenceChain: 'Rastreio BID → 6 clubes → Cálculo → Busca clube dissolvido → Confirmação fusão → Custódia → Registro TMS → Selagem → ML-DSA-65',
  },
  idleTitle: 'Pronto para Deliberar',
  idleDesc: '4 agentes IA rastrearão o histórico de formação do jogador — calculando pagamentos de solidariedade, resolvendo clubes dissolvidos e gerenciando custódia.',
  phaseLabels: ['Histórico e Cálculo', 'Resolução de Clubes e Disputas', 'Custódia e Registro TMS'],
};

// =============================================================================
// CENÁRIO 9 — TETO SALARIAL LALIGA
// =============================================================================

const S9: TemplateScenario = {
  id: 'laliga-salary-cap',
  title: 'Teto Salarial LaLiga — Avaliação de Viabilidade',
  subtitle: 'LaLiga LCFP · Clube a 95% do teto · Demanda de €8M · Prazo de registro',
  banner: 'A Figer negocia a transferência de um internacional brasileiro para a LaLiga. O jogador exige €8M/ano bruto. A LCFP da LaLiga impõe tetos salariais rígidos — diferente de outras ligas. O clube já está a 95% do seu teto. Se o acordo for estruturado incorretamente, a LaLiga rejeitará o registro.',
  risk: 'Alto',
  scenarioNum: 'LaLiga',
  icon: 'trending-up',
  color: 'text-amber-400',
  agents: [A.financialAgent, A.transferAgent, A.legalAgent, A.fifaCompliance],
  connectors: [
    { name: 'Portal LCFP LaLiga', status: 'connected', type: 'Gestão de Teto Salarial', icon: 'banknote', detail: 'Clube a 95% de €120M — €6M disponíveis' },
    { name: 'Sistema RFEF', status: 'connected', type: 'FA Espanhola', icon: 'database', detail: 'Prazo de registro: 31 agosto 2026' },
    { name: 'Sistema CBF', status: 'connected', type: 'Saída CBF', icon: 'globe', detail: 'ITC pendente — processamento CBF 5-7 dias' },
    { name: 'Modelagem de Contratos Figer', status: 'connected', type: 'Motor de Estrutura Salarial', icon: 'trending-up', detail: 'Jogador exige €8M bruto — €2M acima do disponível' },
  ],
  script: [
    { agentId: 'financial', phase: 'phase1', type: 'warning', delay: 800, content: 'CRISE DE TETO SALARIAL LALIGA. Posição LCFP do clube: Teto total €120M. Compromissos atuais €114M (95%). Margem disponível: €6M. Demanda do jogador: €8M bruto/ano. DÉFICIT: €2M. A LCFP é um TETO RÍGIDO — não uma diretriz. Se o clube exceder seu teto, a LaLiga rejeitará o registro. Diferente da Premier League ou Bundesliga, não há mecanismo de "cumprir ou explicar." Opções: (1) Clube vende ou empresta jogador para liberar espaço — janela fecha em 14 dias. (2) Jogador aceita €6M (redução de 25%). (3) Estruturação criativa — imagem separada, bônus variáveis.' },
    { agentId: 'transfer', phase: 'phase1', type: 'analysis', delay: 2500, content: 'Análise de estrutura contratual. LCFP conta: (a) Salário fixo — completo contra teto, (b) Bônus — valor "esperado" (50-70%), (c) Direitos de imagem — EXCLUÍDOS se pagos por entidade separada e limitados a 15%, (d) Bônus de assinatura — amortizado. Estrutura proposta: Fixo: €5M. Imagem: €1,5M por sociedad civil (excluído, dentro dos 15%). Bônus: €3M máximo, LCFP conta 60% = €1,8M. Valor total: €8,5M. Impacto LCFP: €6,8M. Ainda €800K acima da margem. O clube DEVE liberar €800K com uma saída.' },
    { agentId: 'legal', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSIDÊNCIA REGISTRADA. A exclusão de 15% de imagem está sendo agressivamente questionada pela LaLiga. Em 2025, a LaLiga desafiou 12 estruturas de imagem. Se a LaLiga reclassificar os €1,5M como salário, o impacto salta de €6,8M para €8,3M — catastroficamente acima do teto. O jogador deve ter valor comercial demonstrável. Além disso, a amortização do bônus de assinatura assume contrato de 4 anos — saída antecipada acelera o impacto.' },
    { agentId: 'fifa', phase: 'phase2', type: 'flag', delay: 2000, content: 'ALERTA ELEVADO. O processamento ITC da CBF leva 5-7 dias. O prazo de registro é 31 de agosto — 14 dias. ITC atrasado significa que o jogador não pode jogar até janeiro de 2027. Além disso, o Regulamento de Agentes FIFA exige divulgação do honorário da Figer para avaliação LCFP.' },
    { agentId: 'financial', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Propondo Pacote de Viabilidade LaLiga Datacendia: (1) Estrutura: €5M fixo + €1,5M imagem + €3M bônus. LCFP: €6,8M. (2) Evidência de imagem — avaliação comercial do jogador. (3) Clube libera Jogador Y (€900K) para espaço. (4) Expedição ITC CBF. (5) Honorário Figer pago pelo clube vendedor para minimizar impacto LCFP. (6) Bônus de assinatura: €2M amortizado em 4 anos = €500K/ano. Total LCFP: €7,3M. Com saída Jogador Y (€900K): líquido €6,4M contra €6,9M disponível. VIÁVEL. Tudo selado.' },
    { agentId: 'legal', phase: 'phase3', type: 'resolution', delay: 2500, content: 'A estrutura funciona se: (a) Jogador Y sair antes do prazo, (b) evidência de imagem suportar €1,5M, (c) ITC CBF chegar até 28 de agosto. A modelagem simultânea de saída/chegada é crítica — a LaLiga avalia no momento do registro. Pagamento de honorário pelo clube vendedor é prática padrão. Dissidência RETIRADA. Estrutura viável — apertada mas defensável.' },
  ],
  receiptTemplate: {
    hash: 'SHA-256:d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1',
    merkleRoot: 'e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7',
    merkleLabel: 'Árvore Merkle (Cálculo LCFP + Estrutura + Avaliação imagem + ITC + Modelagem de espaço)',
    complianceLabel: 'Status LCFP LaLiga',
    complianceValue: 'ESTRUTURA VIÁVEL — €6,4M vs €6,9M',
    complianceThreshold: 'Teto rígido LCFP cumprido',
    agents: ['Agente Financeiro', 'Agente de Transferências', 'Agente Jurídico', 'Agente FIFA'],
    dissents: 1,
    dissentResolved: true,
    guaranteeTitle: 'Grupo Figer — Evidência de Teto Salarial LaLiga Selada',
    guaranteeBody: 'Este pacote sela conformidade LCFP: modelagem contratual, avaliação de imagem, simulação de espaço, ITC CBF e estrutura de honorários.',
    evidenceChain: 'Avaliação LCFP → Modelagem → Avaliação imagem → Saída → ITC CBF → Honorários → Registro → Selagem → ML-DSA-65',
  },
  idleTitle: 'Pronto para Deliberar',
  idleDesc: '4 agentes IA avaliarão viabilidade de teto salarial LaLiga — modelando contratos, exclusões de imagem e prazos de registro.',
  phaseLabels: ['Análise de Teto e Contrato', 'Imagem e Risco', 'Confirmação e Selagem'],
};

// =============================================================================
// CENÁRIO 10 — LEI PELÉ vs FIFA RSTP
// =============================================================================

const S10: TemplateScenario = {
  id: 'lei-pele-rstp',
  title: 'Lei Pelé vs FIFA RSTP — Disputa de Rescisão Unilateral',
  subtitle: 'Jogador invoca Lei Pelé · Clube reivindica RSTP · Batalha jurisdicional CAS · €6M de compensação',
  banner: 'Um cliente da Figer quer deixar seu clube brasileiro por uma oferta europeia. Sob a Lei Pelé (9.615/98), jogadores podem rescindir contratos com compensação limitada pela cláusula penal. Sob o FIFA RSTP Artigo 17, a compensação é ilimitada. O clube invoca RSTP; o jogador invoca Lei Pelé. Este conflito jurisdicional é o tema mais litigado do direito desportivo brasileiro.',
  risk: 'Crítico',
  scenarioNum: 'Lei Pelé',
  icon: 'gavel',
  color: 'text-rose-400',
  agents: [A.legalAgent, A.casArbitration, A.transferAgent, A.financialAgent],
  connectors: [
    { name: 'Departamento Jurídico CBF', status: 'connected', type: 'CBF', icon: 'scale', detail: 'Contrato registrado — 3 anos restantes de contrato de 5' },
    { name: 'Tribunal Regional do Trabalho (TRT)', status: 'syncing', type: 'Justiça do Trabalho', icon: 'gavel', detail: 'Lei Pelé Art. 28 — "cláusula penal"' },
    { name: 'FIFA DRC', status: 'connected', type: 'Câmara de Resolução de Disputas', icon: 'shield', detail: 'Clube apresentou reclamação RSTP Art. 17 — €6M' },
    { name: 'Registro CAS', status: 'ready', type: 'Tribunal Arbitral do Esporte', icon: 'gavel', detail: 'Jurisdição de recurso — CAS ou Justiça do Trabalho?' },
  ],
  script: [
    { agentId: 'legal', phase: 'phase1', type: 'warning', delay: 800, content: 'CONFLITO LEI PELÉ vs FIFA RSTP. Contrato de 5 anos desde janeiro de 2024. Agora tem 2 anos e 3 meses — dentro do "período protegido" FIFA. O jogador quer aceitar oferta da Bundesliga. LEI PELÉ: Artigo 28 — a "cláusula penal" fixa compensação: R$25M (≈€4,2M). O jogador pode rescindir após o primeiro ano pagando a cláusula. LEGAL sob lei brasileira. FIFA RSTP: Artigo 17 — rescisão durante período protegido com compensação baseada na "especificidade do esporte" — pode exceder a cláusula. O clube exige €6M. Qual jurisdição prevalece — FIFA DRC ou Justiça do Trabalho brasileira?' },
    { agentId: 'cas', phase: 'phase1', type: 'analysis', delay: 2500, content: 'ANÁLISE JURISDICIONAL CAS. O tema mais litigado no futebol sul-americano. CAS 2020/A/7156 — CAS decidiu que RSTP aplica-se a transferências internacionais mesmo quando o contrato doméstico é regido por lei brasileira. A reclamação de €6M é procedimentalmente válida. Porém, CAS 2022/A/8234 introduziu nuance: onde a lei trabalhista brasileira oferece proteções específicas (cláusula penal), o CAS deve considerar as "expectativas legítimas" do jogador. A posição emergente: a compensação RSTP Art. 17 não deve "exceder substancialmente" a cláusula penal. Isso sugere compensação mais próxima de €4,2M que €6M — mas não é certo.' },
    { agentId: 'transfer', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSIDÊNCIA REGISTRADA. O clube da Bundesliga não assinará se houver disputa pendente — seriam corresponsáveis sob RSTP Art. 17(2) como "clube indutor." Invocar rescisão unilateral Lei Pelé sem acordo do clube alemão é um beco sem saída. A Figer deve negociar uma resolução comercial — a via jurídica destrói o negócio.' },
    { agentId: 'financial', phase: 'phase2', type: 'flag', delay: 2000, content: 'ALERTA ELEVADO. Modelagem financeira. Clube brasileiro: €6M (RSTP Art. 17). Figer/jogador: €4,2M (cláusula penal). CAS provável: €4,5-5,5M. Orçamento do clube alemão: €12M total. Se a Figer negociar transferência consensual a €5M: o clube alemão economiza €7M, o clube brasileiro obtém mais que a cláusula, o jogador evita 12-18 meses de disputa. Além disso, sob Lei Pelé Art. 29, clubes formadores têm direitos de solidariedade — o clube brasileiro pode ter obrigações próprias pendentes. Isso cria uma alavanca de contrademanda.' },
    { agentId: 'legal', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Propondo Estratégia de Resolução Datacendia: (1) NÃO invocar rescisão unilateral Lei Pelé — mata o negócio. (2) Negociar transferência consensual usando cláusula penal como PISO e RSTP Art. 17 como TETO. Objetivo: €5M. (3) Apresentar tendência CAS ao clube brasileiro — €5M negociado é melhor que €4,5M após 18 meses de litígio. (4) Usar contrademanda de solidariedade como alavanca. (5) Estruturar como taxa de transferência (não compensação por rescisão) — permite honorário padrão de agente. (6) Documentação selada como seguro se a negociação falhar. Tudo com carimbo de tempo criptográfico.' },
    { agentId: 'cas', phase: 'phase3', type: 'resolution', delay: 2500, content: 'A estratégia de negociação comercial é a correta. O CAS leva 12-18 meses, custa €50-100K e cria incerteza. €5M consensual beneficia todos: o clube brasileiro supera a cláusula penal, o clube alemão está abaixo do orçamento, o jogador evita disputa. A contrademanda de solidariedade é alavanca genuína. O pacote Datacendia serve como seguro. Dissidência RETIRADA. Isso transforma uma batalha jurisdicional em um acordo comercial.' },
  ],
  receiptTemplate: {
    hash: 'SHA-256:e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2',
    merkleRoot: 'f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9',
    merkleLabel: 'Árvore Merkle (Lei Pelé + RSTP Art. 17 + Jurisprudência CAS + Modelagem + Contrademanda solidariedade)',
    complianceLabel: 'Status de Resolução de Disputas',
    complianceValue: 'TRANSFERÊNCIA CONSENSUAL — €5M',
    complianceThreshold: 'Lei Pelé + FIFA RSTP reconciliados',
    agents: ['Agente Jurídico', 'Agente CAS', 'Agente de Transferências', 'Agente Financeiro'],
    dissents: 1,
    dissentResolved: true,
    guaranteeTitle: 'Grupo Figer — Evidência de Resolução Lei Pelé vs FIFA RSTP Selada',
    guaranteeBody: 'Este pacote sela evidência de resolução: análise Lei Pelé, avaliação RSTP Art. 17, tendência CAS, modelagem financeira, documentação de contrademanda de solidariedade e acordo de transferência consensual.',
    evidenceChain: 'Análise Lei Pelé → RSTP Art. 17 → Precedentes CAS → Modelagem → Contrademanda → Negociação → Transferência → Selagem → ML-DSA-65',
  },
  idleTitle: 'Pronto para Deliberar',
  idleDesc: '4 agentes IA navegarão o conflito Lei Pelé vs FIFA RSTP — modelando resultados CAS, estruturando negociação e selando evidência.',
  phaseLabels: ['Análise Jurisdicional', 'Estratégia de Negociação', 'Resolução e Selagem'],

        complianceScore: 90,
        timelineEvents: [
      {
            "timestamp": "2026-04-01T12:18:01.162Z",
            "type": "analysis",
            "title": "System Assessment - Dupla Representação — Transferência para a Premier League",
            "description": "Data protection, cybersecurity, IP rights, platform governance: System Assessment analysis for Grupo Figer Pt completed with industry-specific compliance checks",
            "agent": "Tech Agent",
            "impact": "high"
      },
      {
            "timestamp": "2026-04-01T12:19:01.162Z",
            "type": "warning",
            "title": "Privacy Compliance - Dupla Representação — Transferência para a Premier League",
            "description": "Data protection, cybersecurity, IP rights, platform governance: Privacy Compliance analysis for Grupo Figer Pt completed with industry-specific compliance checks",
            "agent": "Privacy Agent",
            "impact": "high"
      },
      {
            "timestamp": "2026-04-01T12:20:01.162Z",
            "type": "dissent",
            "title": "Security Risk - Dupla Representação — Transferência para a Premier League",
            "description": "Data protection, cybersecurity, IP rights, platform governance: Security Risk analysis for Grupo Figer Pt completed with industry-specific compliance checks",
            "agent": "Security Agent",
            "impact": "medium"
      },
      {
            "timestamp": "2026-04-01T12:21:01.162Z",
            "type": "proposal",
            "title": "Governance Framework - Dupla Representação — Transferência para a Premier League",
            "description": "Data protection, cybersecurity, IP rights, platform governance: Governance Framework analysis for Grupo Figer Pt completed with industry-specific compliance checks",
            "agent": "Platform Agent",
            "impact": "high"
      },
      {
            "timestamp": "2026-04-01T12:22:01.162Z",
            "type": "resolution",
            "title": "Compliance Certified - Dupla Representação — Transferência para a Premier League",
            "description": "Data protection, cybersecurity, IP rights, platform governance: Compliance Certified analysis for Grupo Figer Pt completed with industry-specific compliance checks",
            "agent": "Audit Agent",
            "impact": "high"
      }
]};

export const PT_SCENARIOS: TemplateScenario[] = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10];
