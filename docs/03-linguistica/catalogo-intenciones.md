# Catálogo inicial de intenciones

**Estado:** Propuesta; ninguna intención está validada todavía

Estados permitidos: `PROPUESTA`, `EN_VALIDACION`, `VALIDADA`, `RECHAZADA`.

| ID | Propósito | Ejemplos de entrada en español | Prioridad | Estado |
|---|---|---|---:|---|
| SALUDO_HOLA | Saludo general | hola; buenas | Obligatoria | PROPUESTA |
| SALUDO_BUENOS_DIAS | Saludo matutino | buenos días; muy buenos días | Obligatoria | PROPUESTA |
| SALUDO_BUENAS_TARDES | Saludo vespertino | buenas tardes | Recomendada | PROPUESTA |
| SALUDO_BUENAS_NOCHES | Saludo nocturno | buenas noches | Recomendada | PROPUESTA |
| CORTESIA_GRACIAS | Expresar agradecimiento | gracias; muchas gracias | Obligatoria | PROPUESTA |
| CORTESIA_POR_FAVOR | Pedir cortésmente | por favor | Obligatoria | PROPUESTA |
| CORTESIA_PERDON | Pedir disculpas | perdón; discúlpame | Obligatoria | PROPUESTA |
| RESPUESTA_SI | Respuesta afirmativa | sí; de acuerdo | Obligatoria | PROPUESTA |
| RESPUESTA_NO | Respuesta negativa | no; no gracias | Obligatoria | PROPUESTA |
| DESPEDIDA_ADIOS | Finalizar interacción | adiós; hasta luego | Obligatoria | PROPUESTA |
| PRESENTACION_MI_NOMBRE | Presentar nombre | mi nombre es…; me llamo… | Recomendada | PROPUESTA |
| PREGUNTA_NOMBRE | Preguntar nombre | ¿cómo te llamas? | Recomendada | PROPUESTA |
| PREGUNTA_COMO_ESTA | Preguntar estado | ¿cómo estás? | Recomendada | PROPUESTA |
| RESPUESTA_ESTOY_BIEN | Expresar bienestar | estoy bien; todo bien | Recomendada | PROPUESTA |
| NECESIDAD_AYUDA | Solicitar ayuda general | necesito ayuda; ayúdame | Obligatoria | PROPUESTA |
| NECESIDAD_AGUA | Solicitar agua | necesito agua; quiero agua | Recomendada | PROPUESTA |
| NECESIDAD_BANO | Preguntar por baño | ¿dónde está el baño? | Recomendada | PROPUESTA |
| COMUNICACION_NO_ENTIENDO | Indicar incomprensión | no entiendo | Obligatoria | PROPUESTA |
| COMUNICACION_REPETIR | Solicitar repetición | repite por favor; otra vez | Obligatoria | PROPUESTA |
| COMUNICACION_MAS_DESPACIO | Solicitar menor velocidad | más despacio | Obligatoria | PROPUESTA |

## Criterio para incorporar una intención

- Tiene un propósito inequívoco dentro del dominio.
- Cuenta con al menos tres ejemplos de entrada.
- Tiene guion LSC validado.
- Todos sus animaciones existen y son compatibles con el esqueleto de animación.
- Tiene pruebas positivas, negativas y de comprensión.

## Producción pendiente

La primera ola de diez intenciones está propuesta en el
[listado de animaciones del PMV](../04-animacion/listado-animaciones-pmv.md). La
selección todavía debe revisarse con el validador lingüístico antes de comenzar a
animar. `PRESENTACION_MI_NOMBRE` combinará un guion LSC validado con el deletreo
manual del nombre confirmado por el usuario. No se publicará hasta que ambas
partes estén validadas.
