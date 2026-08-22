# Métricas del PMV

**Estado:** Umbrales iniciales por confirmar

## Principio

Separar precisión de transcripción, clasificación, fidelidad lingüística y
rendimiento del avatar. Una sola métrica de “precisión de traducción” ocultaría
dónde ocurre el error.

## Métricas

| ID | Métrica | Cálculo | Meta inicial |
|---|---|---|---:|
| MET-TRANS-01 | Transcripciones aceptadas sin corrección | aceptadas / audios válidos | ≥ 85 % |
| MET-TEC-01 | Éxito de captura | capturas procesadas / intentos válidos | ≥ 95 % |
| MET-LIN-01 | Exactitud de intención | clasificaciones correctas / frases de prueba | ≥ 90 % |
| MET-LIN-02 | Comprensión de animación | respuestas correctas / visualizaciones | ≥ 80 % |
| MET-SEG-01 | Respuesta segura | desconocidos sin traducción inventada / desconocidos | 100 % |
| MET-TEC-02 | Integridad de catálogo | guiones válidos / guiones publicados | 100 % |
| MET-REND-01 | Latencia confirmación → animación | percentil 95 | < 4 s |
| MET-REND-02 | Fluidez del avatar | fotogramas por segundo mínimos durante la reproducción | ≥ 30 |
| MET-REND-03 | Peso de recursos críticos | transferencia comprimida | ≤ 15 MB |
| MET-EU-01 | Finalización sin ayuda | tareas completadas / intentos | ≥ 80 % |
| MET-EU-02 | Recuperación de errores | recuperaciones exitosas / fallos recuperables | ≥ 95 % |
| MET-PRIV-01 | Incidentes de audio o secretos | conteo | 0 |
| MET-DEL-01 | Deletreos iniciados con confirmación | secuencias confirmadas / secuencias iniciadas | 100 % |
| MET-TEC-03 | Integridad del alfabeto | letras válidas / letras reproducidas | 100 % |
| MET-LIN-03 | Comprensión de palabras deletreadas | palabras reconocidas / palabras mostradas | ≥ 80 % |

## Segmentación mínima

- Entrada escrita frente a voz.
- Frase e intención.
- Dispositivo y navegador.
- Velocidad normal frente a lenta.
- Participantes nuevos frente a quienes ya vieron la animación.

## Interpretación

- Una tasa baja de transcripciones aceptadas no implica que el guion LSC sea incorrecto.
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
