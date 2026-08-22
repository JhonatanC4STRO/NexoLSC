# Registro de riesgos

**Versión:** 0.1
**Estado:** Borrador

Escala: probabilidad e impacto de 1 (bajo) a 5 (alto). Exposición = P × I.

| ID | Riesgo | P | I | Exp. | Mitigación | Disparador |
|---|---|---:|---:|---:|---|---|
| R-01 | Traducción lingüísticamente incorrecta | 4 | 5 | 20 | Dominio cerrado y validación LSC antes de publicar | Revisor rechaza guion |
| R-02 | Avatar no permite configuraciones manuales claras | 4 | 5 | 20 | Prueba del rig con señas difíciles en Sprint 0 | Dedos o muñeca colapsan |
| R-03 | Sobrealcance para una sola persona | 5 | 4 | 20 | 20–30 intenciones y no-objetivos explícitos | Historia no cabe en un sprint |
| R-04 | Variación regional causa ambigüedad | 3 | 4 | 12 | Registrar región y publicar una variante acordada | Usuarios reportan otra interpretación |
| R-05 | STT falla por ruido o acento | 4 | 3 | 12 | Mostrar texto editable y mantener entrada manual | Aumentan correcciones |
| R-06 | Latencia degrada la interacción | 3 | 4 | 12 | Medir p95, limitar audio y precargar recursos | p95 supera 4 s |
| R-07 | GLB demasiado pesado | 3 | 3 | 9 | Presupuesto de peso y medición por sprint | Supera 15 MB |
| R-08 | Exposición de audio o clave | 2 | 5 | 10 | Backend, eliminación temporal y revisión de secretos | Se detecta clave o archivo persistente |
| R-09 | Uso del producto en contexto de alto riesgo | 3 | 5 | 15 | Aviso visible, rechazo de intenciones y alcance limitado | Usuario solicita uso médico/legal |
| R-10 | Fuente de señas sin permiso de reutilización | 3 | 4 | 12 | Registrar origen y derechos antes de animar | No hay autorización clara |
| R-11 | Dependencia de un único validador | 4 | 4 | 16 | Planificar disponibilidad y buscar participantes de comprensión | Validación bloqueada > 1 sprint |
| R-12 | Fatiga o abandono del desarrollador | 3 | 4 | 12 | Sprints cortos, WIP 1 y demo semanal | Dos sprints sin incremento |

## Revisión

- Revisar riesgos al planear y cerrar cada sprint.
- Cualquier exposición 15 o superior requiere una acción activa en el backlog.
- Un riesgo ocurrido se convierte en incidencia y debe registrar respuesta.
