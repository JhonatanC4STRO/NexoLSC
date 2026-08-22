# Matriz de trazabilidad

**Estado:** Inicial

| Necesidad | Requisito | Historia | Prueba | Métrica |
|---|---|---|---|---|
| Capturar una frase | RF-001, RF-002 | HU-01 | CP-001, CP-002 | MET-TEC-01 |
| Corregir reconocimiento | RF-004, RF-005 | HU-02 | CP-003 | MET-TRANS-01 |
| Traducir solo contenido válido | RF-006, RF-007, RN-001 | HU-03 | CP-004, CP-005 | MET-LIN-01 |
| Ver la traducción | RF-008, RNF-009 | HU-04 | CP-006 | MET-LIN-02 |
| Controlar reproducción | RF-009 | HU-05 | CP-007 | MET-EU-01 |
| Manejar desconocidos | RF-010, RN-002 | HU-06 | CP-008 | MET-SEG-01 |
| Evitar animaciones incompatibles | RF-011, RN-003 | HU-07 | CP-009 | MET-TEC-02 |
| Entender el estado | RF-012, RNF-014 | HU-01 | CP-010 | MET-EU-02 |
| Proteger audio y claves | RNF-006, RNF-007 | HU-08 | CP-011, CP-012 | MET-PRIV-01 |
| Deletrear texto por elección | RF-014, RF-015, RN-008 | HU-09 | CP-016, CP-017 | MET-DEL-01 |
| Evitar secuencias incompletas | RF-016, RF-017, RN-009 | HU-09 | CP-018 | MET-TEC-03 |

Esta matriz debe actualizarse cuando cambie un requisito, una historia o un caso
de prueba. No se considera completo un requisito obligatorio sin al menos una prueba.
