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

export const PT_SCENARIOS: TemplateScenario[] = [S1, S2, S3, S4, S5];
