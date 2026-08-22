# RDA-002: Traducción determinista por intenciones

**Estado:** Propuesta
**Fecha:** 2026-08-22

## Contexto

Una salida fluida pero lingüísticamente incorrecta puede perjudicar la
comunicación. El catálogo inicial será pequeño y cada animación requiere trabajo
manual y validación.

## Decisión propuesta

Reconocer únicamente intenciones definidas y seleccionar guiones LSC versionados.
Ante una entrada desconocida se devuelve `NO_SOPORTADA`. No se usará un LLM para
componer el guion del PMV.

Después de devolver `NO_SOPORTADA`, la interfaz puede ofrecer el modo de deletreo
manual definido en la [RDA-004](RDA-004-deletreo-manual.md). Esta salida también
es determinista, requiere confirmación y no se presenta como traducción LSC.

## Consecuencias

- Salidas trazables y reproducibles.
- Cobertura limitada pero explícita.
- Cada ampliación requiere ejemplos, guion, animaciones y validación.
- Se evita confundir plausibilidad textual con corrección lingüística.

## Revisión futura

Reconsiderar solo después de contar con un corpus autorizado, evaluación formal y
un mecanismo que bloquee cualquier salida no validada.
