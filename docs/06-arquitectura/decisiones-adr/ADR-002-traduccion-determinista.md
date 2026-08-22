# ADR-002: Traducción determinista por intenciones

**Estado:** Propuesta
**Fecha:** 2026-08-22

## Contexto

Una salida fluida pero lingüísticamente incorrecta puede perjudicar la
comunicación. El catálogo inicial será pequeño y cada animación requiere trabajo
manual y validación.

## Decisión propuesta

Reconocer únicamente intenciones definidas y seleccionar guiones LSC versionados.
Ante una entrada desconocida se devuelve `NO_SOPORTADA`. No se usará un LLM para
componer el guion del MVP.

## Consecuencias

- Salidas trazables y reproducibles.
- Cobertura limitada pero explícita.
- Cada ampliación requiere ejemplos, guion, clips y validación.
- Se evita confundir plausibilidad textual con corrección lingüística.

## Revisión futura

Reconsiderar solo después de contar con un corpus autorizado, evaluación formal y
un mecanismo que bloquee cualquier salida no validada.
