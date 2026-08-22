# Catálogo inicial de intenciones

**Versión:** 0.2
**Estado:** Propuesta; ninguna intención está validada todavía

Estados permitidos: `PROPUESTA`, `EN_VALIDACION`, `VALIDADA`, `RECHAZADA`.

| ID | Propósito | Ejemplos de entrada en español | Prioridad | Estado |
|---|---|---|---:|---|
| SALUDO_HOLA | Saludo general | hola; buenas | Must | PROPUESTA |
| SALUDO_BUENOS_DIAS | Saludo matutino | buenos días; muy buenos días | Must | PROPUESTA |
| SALUDO_BUENAS_TARDES | Saludo vespertino | buenas tardes | Should | PROPUESTA |
| SALUDO_BUENAS_NOCHES | Saludo nocturno | buenas noches | Should | PROPUESTA |
| CORTESIA_GRACIAS | Expresar agradecimiento | gracias; muchas gracias | Must | PROPUESTA |
| CORTESIA_POR_FAVOR | Pedir cortésmente | por favor | Must | PROPUESTA |
| CORTESIA_PERDON | Pedir disculpas | perdón; discúlpame | Must | PROPUESTA |
| RESPUESTA_SI | Respuesta afirmativa | sí; de acuerdo | Must | PROPUESTA |
| RESPUESTA_NO | Respuesta negativa | no; no gracias | Must | PROPUESTA |
| DESPEDIDA_ADIOS | Finalizar interacción | adiós; hasta luego | Must | PROPUESTA |
| PRESENTACION_MI_NOMBRE | Presentar nombre | mi nombre es…; me llamo… | Should | PROPUESTA |
| PREGUNTA_NOMBRE | Preguntar nombre | ¿cómo te llamas? | Should | PROPUESTA |
| PREGUNTA_COMO_ESTA | Preguntar estado | ¿cómo estás? | Should | PROPUESTA |
| RESPUESTA_ESTOY_BIEN | Expresar bienestar | estoy bien; todo bien | Should | PROPUESTA |
| NECESIDAD_AYUDA | Solicitar ayuda general | necesito ayuda; ayúdame | Must | PROPUESTA |
| NECESIDAD_AGUA | Solicitar agua | necesito agua; quiero agua | Should | PROPUESTA |
| NECESIDAD_BANO | Preguntar por baño | ¿dónde está el baño? | Should | PROPUESTA |
| COMUNICACION_NO_ENTIENDO | Indicar incomprensión | no entiendo | Must | PROPUESTA |
| COMUNICACION_REPETIR | Solicitar repetición | repite por favor; otra vez | Must | PROPUESTA |
| COMUNICACION_MAS_DESPACIO | Solicitar menor velocidad | más despacio | Must | PROPUESTA |

## Criterio para incorporar una intención

- Tiene un propósito inequívoco dentro del dominio.
- Cuenta con al menos tres ejemplos de entrada.
- Tiene guion LSC validado.
- Todos sus clips existen y son compatibles con el rig.
- Tiene pruebas positivas, negativas y de comprensión.

## Decisión pendiente

La primera ola de diez intenciones está propuesta en el
[listado de animaciones del MVP](../04-animacion/listado-animaciones-mvp.md). La
selección todavía debe revisarse con el validador lingüístico antes de comenzar a
animar. `PRESENTACION_MI_NOMBRE` permanece bloqueada hasta definir cómo tratar
nombres propios y deletreo manual.
