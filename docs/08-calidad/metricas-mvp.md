# Métricas del MVP

**Versión:** 0.1
**Estado:** Umbrales iniciales por confirmar

## Principio

Separar precisión de transcripción, clasificación, fidelidad lingüística y
rendimiento del avatar. Una sola métrica de “precisión de traducción” ocultaría
dónde ocurre el error.

## Métricas

| ID | Métrica | Cálculo | Meta inicial |
|---|---|---|---:|
| MET-STT-01 | Transcripciones aceptadas sin corrección | aceptadas / audios válidos | ≥ 85 % |
| MET-TEC-01 | Éxito de captura | capturas procesadas / intentos válidos | ≥ 95 % |
| MET-LIN-01 | Exactitud de intención | clasificaciones correctas / frases de prueba | ≥ 90 % |
| MET-LIN-02 | Comprensión de animación | respuestas correctas / visualizaciones | ≥ 80 % |
| MET-SEG-01 | Fallback seguro | desconocidos sin traducción inventada / desconocidos | 100 % |
| MET-TEC-02 | Integridad de catálogo | guiones válidos / guiones publicados | 100 % |
| MET-PERF-01 | Latencia confirmación → animación | percentil 95 | < 4 s |
| MET-PERF-02 | Fluidez del avatar | FPS mínimo durante reproducción | ≥ 30 |
| MET-PERF-03 | Peso de recursos críticos | transferencia comprimida | ≤ 15 MB |
| MET-UX-01 | Finalización sin ayuda | tareas completadas / intentos | ≥ 80 % |
| MET-UX-02 | Recuperación de errores | recuperaciones exitosas / fallos recuperables | ≥ 95 % |
| MET-PRI-01 | Incidentes de audio o secretos | conteo | 0 |

## Segmentación mínima

- Entrada escrita frente a voz.
- Frase e intención.
- Dispositivo y navegador.
- Velocidad normal frente a lenta.
- Participantes nuevos frente a quienes ya vieron la animación.

## Interpretación

- Un STT bajo no implica que el guion LSC sea incorrecto.
- Una clasificación alta no valida la comprensión del avatar.
- Repetir participantes puede introducir aprendizaje y elevar artificialmente la
  comprensión.
- Con muestras pequeñas se reportan conteos y observaciones, no conclusiones
  estadísticas generales.

## Decisión al finalizar el piloto

- **Continuar:** se cumplen seguridad, validación y comprensión, y existe interés.
- **Cambiar:** el valor existe, pero falla una hipótesis corregible.
- **Detener:** no se logra comprensión suficiente o el costo de validación y
  animación hace inviable ampliar el dominio.
