# RDA-001: Conjunto tecnológico del PMV

**Estado:** Propuesta
**Fecha:** 2026-08-22

## Contexto

Una sola persona construirá una aplicación web con captura de audio, servidor,
motor de reglas y reproducción 3D. Se debe minimizar la cantidad de lenguajes y
servicios operados.

## Decisión propuesta

- React 19, TypeScript y Vite para la interfaz.
- Three.js, React Three Fiber y Drei para el avatar.
- Node.js LTS, TypeScript y Fastify para el servidor.
- Catálogos JSON versionados durante el PMV.
- API de transcripción `gpt-4o-mini-transcribe` como opción inicial.
- Vitest, Testing Library y Playwright para pruebas.
- Mermaid para diagramas versionables.

## Consecuencias positivas

- Un único lenguaje de programación principal.
- El secreto del transcripción automática permanece en servidor.
- React Three Fiber integra el avatar con la interfaz.
- Los catálogos pueden revisarse mediante cambios de texto.

## Costos y límites

- Dependencia de red y costo variable del proveedor de transcripción.
- Node no es la primera opción para entrenar modelos propios; eso no forma parte
  del PMV.
- Los catálogos JSON no ofrecen edición concurrente ni consultas complejas.

## Alternativas descartadas por ahora

- Microservicio Python: agrega operación sin necesidad actual.
- Base de datos PostgreSQL: innecesaria mientras solo una persona edite catálogos.
- Reconocimiento de voz directo en navegador: soporte y comportamiento variables.
- Aplicación móvil nativa: duplica trabajo antes de validar el producto.
