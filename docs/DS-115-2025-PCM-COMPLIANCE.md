# Declaración de Cumplimiento — DS N° 115-2025-PCM

**DATACENDIA** | Declaración de Conformidad Técnica
Fecha: 11 de marzo de 2026

---

## Declaración

Datacendia, a través de su producto CendiaGateway™ y la plataforma Datacendia Core, genera evidencia técnica que satisface los requisitos establecidos por el Decreto Supremo N° 115-2025-PCM, el cual adopta la norma ISO/IEC 42001:2023 como estándar obligatorio para la gobernanza de sistemas de inteligencia artificial en el Perú.

Esta declaración describe las capacidades técnicas del producto y su alineación con las cláusulas específicas de ISO/IEC 42001:2023 conforme a DS 115-2025-PCM.

---

## Mapeo de Cláusulas

| Cláusula ISO/IEC 42001 | Requisito | Capacidad de Datacendia |
|------------------------|-----------|------------------------|
| **4.1** Contexto de la organización | Comprensión de la organización y su contexto en relación con IA | CendiaGateway mapea todos los sistemas de IA en uso, usuarios, y flujos de datos — generando un inventario completo de IA |
| **5.2** Política de IA | Política de IA documentada y comunicada | Motor de Políticas de CendiaGateway aplica políticas de IA en tiempo real; cada política se documenta y versiona |
| **6.1** Evaluación de riesgos | Evaluación de riesgos de sistemas de IA | CendiaCrucible™ ejecuta simulaciones Monte Carlo y análisis de estrés sobre decisiones de IA |
| **6.2** Objetivos del AIMS | Objetivos medibles para el sistema de gestión de IA | IISS™ (Institutional Immune System Score) proporciona una métrica cuantitativa de 0–1000 para resiliencia de gobernanza |
| **8.4** Documentación de impacto | Evaluación de impacto de sistemas de IA | Cada deliberación del Council genera documentación de impacto con análisis multi-agente |
| **9.1** Monitoreo y medición | Monitoreo continuo del desempeño del AIMS | Dashboard en tiempo real con KPIs de gobernanza, alertas, y métricas de cumplimiento |
| **9.2** Auditoría interna | Auditorías internas del AIMS | Registros de auditoría inmutables con firma Ed25519 y hash SHA-256; cadena de custodia completa |
| **9.3** Revisión por la dirección | Revisión periódica por la alta dirección | Regulator's Receipt™ genera informes ejecutivos con evidencia criptográfica verificable |
| **10.1** Mejora continua | No conformidades y acciones correctivas | Sistema de alertas y workflows automatizados para gestión de no conformidades |

---

## Evidencia Técnica Generada

CendiaGateway genera los siguientes registros automáticamente desde el primer día de despliegue:

1. **Registro de Interacciones IA** — Cada prompt enviado y respuesta recibida, con timestamp RFC 3161, atribuido a un usuario identificado
2. **Firma Criptográfica** — Ed25519 sobre cada interacción, verificable con herramientas estándar (openssl) sin dependencia de Datacendia
3. **Hash SHA-256** — Cadena de hashes Merkle tree sobre deliberaciones, citaciones, respuestas y disidencias
4. **Paquete de Evidencia** — Tres PDFs por deliberación: Registro Admisible en Corte, Paquete de Evidencia, Resumen Ejecutivo
5. **Registro de Políticas** — Historial versionado de todas las políticas de IA, con fecha de vigencia y responsable
6. **Detección de Shadow AI** — Registro de uso no autorizado de herramientas de IA

---

## Alineación con Ley 31814

CendiaGateway aborda específicamente los requisitos para sistemas de IA de **alto riesgo** según la Ley 31814 (Ley que promueve el uso de la Inteligencia Artificial en favor del desarrollo económico y social del país):

- **Scoring crediticio** — Registro completo de cada decisión de scoring asistida por IA
- **Detección de fraude** — Trazabilidad de alertas de fraude generadas por IA
- **Atención al cliente** — Registro de interacciones de IA con clientes
- **Evaluación de riesgo** — Documentación de modelos de riesgo basados en IA

---

## Marco Regulatorio Aplicable

| Regulación | Jurisdicción | Estado de Alineación |
|------------|-------------|---------------------|
| DS N° 115-2025-PCM | Perú | ✅ Alineado — evidencia técnica generada |
| ISO/IEC 42001:2023 | Internacional | ✅ Auto-evaluación completada |
| Ley 31814 | Perú | ✅ Alineado — sistemas de alto riesgo documentados |
| Ley 26702 (Sistema Financiero) | Perú | ✅ Compatible — marco de riesgo operativo |
| Reglamento SBS Gobierno Corporativo | Perú | ✅ Compatible — gestión integral de riesgos |
| Ley 29733 (Datos Personales) | Perú | ✅ Arquitectura soberana — zero data egress |

---

## Nota Importante

Esta declaración constituye una **auto-declaración de conformidad técnica** por parte de Datacendia. No constituye una certificación de terceros ni una auditoría independiente. Datacendia está en proceso de certificación formal ante INACAL conforme a ISO/IEC 42001:2023.

---

**Stuart Rainey**
Fundador y CEO, Datacendia
Lima, Perú
stuart.rainey@datacendia.com

*Miembro del Programa NVIDIA Inception*
