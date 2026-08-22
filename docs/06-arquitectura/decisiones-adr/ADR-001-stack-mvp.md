# ADR-001: Stack técnico del MVP

**Estado:** Propuesta
**Fecha:** 2026-08-22

## Contexto

Una sola persona construirá una aplicación web con captura de audio, backend,
motor de reglas y reproducción 3D. Se debe minimizar la cantidad de lenguajes y
servicios operados.

## Decisión propuesta

- React 19, TypeScript y Vite para la interfaz.
- Three.js, React Three Fiber y Drei para el avatar.
- Node.js LTS, TypeScript y Fastify para el backend.
- Catálogos JSON versionados durante el MVP.
- API de transcripción `gpt-4o-mini-transcribe` como opción inicial.
- Vitest, Testing Library y Playwright para pruebas.
- Mermaid para diagramas versionables.

## Consecuencias positivas

- Un único lenguaje de programación principal.
- El secreto del STT permanece en backend.
- React Three Fiber integra el avatar con la interfaz.
- Los catálogos pueden revisarse mediante cambios de texto.

## Costos y límites

- Dependencia de red y costo variable del proveedor STT.
- Node no es la primera opción para entrenar modelos propios; eso no forma parte
  del MVP.
- Los catálogos JSON no ofrecen edición concurrente ni consultas complejas.

## Alternativas descartadas por ahora

- Microservicio Python: agrega operación sin necesidad actual.
- Base de datos PostgreSQL: innecesaria mientras solo una persona edite catálogos.
- Reconocimiento de voz directo en navegador: soporte y comportamiento variables.
- Aplicación móvil nativa: duplica trabajo antes de validar el producto.
