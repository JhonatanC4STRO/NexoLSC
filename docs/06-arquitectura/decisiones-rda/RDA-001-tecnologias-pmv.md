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

## Función de Drei en el avatar

Las responsabilidades de las herramientas 3D son diferentes:

| Herramienta | Responsabilidad en NexoLSC |
|---|---|
| Blender | Crear el avatar, el esqueleto y las animaciones; exportarlos como GLB. |
| Three.js | Proporcionar el motor 3D del navegador: escena, cámara, luces, modelo y reproducción de animaciones. |
| React Three Fiber | Permitir controlar Three.js mediante componentes y estado de React. |
| Drei | Proporcionar utilidades reutilizables sobre React Three Fiber para evitar código repetitivo. |

Para el PMV, Drei se usará únicamente en las siguientes tareas:

- `useGLTF`: cargar y reutilizar en memoria el archivo `avatar-v1.glb`.
- `useAnimations`: vincular las animaciones incluidas en el GLB con el avatar y
  permitir seleccionar una por su nombre.

El recorrido será:

```text
Blender crea el avatar y sus animaciones
  → exporta avatar-v1.glb
  → Drei carga el archivo
  → Drei expone las animaciones disponibles
  → el reproductor elige y reproduce la indicada por el guion
```

Drei **no** traduce español a LSC, no crea movimientos, no genera el esqueleto y
no valida señas. Es una ayuda de programación y puede reemplazarse por llamadas
directas a Three.js si deja de aportar simplicidad.

## Consecuencias positivas

- Un único lenguaje de programación principal.
- El secreto del servicio de transcripción permanece en el servidor.
- React Three Fiber integra el avatar con la interfaz.
- Drei reduce el código necesario para cargar el GLB y acceder a sus animaciones.
- Los catálogos pueden revisarse mediante cambios de texto.

## Costos y límites

- Dependencia de red y costo variable del proveedor de transcripción.
- Node.js no es la primera opción para entrenar modelos propios; eso no forma parte
  del PMV.
- Los catálogos JSON no ofrecen edición concurrente ni consultas complejas.
- Drei agrega una dependencia, por lo que su uso se limita a utilidades que
  reduzcan código de manera comprobable.

## Alternativas descartadas por ahora

- Microservicio Python: agrega operación sin necesidad actual.
- Base de datos PostgreSQL: innecesaria mientras solo una persona edite catálogos.
- Reconocimiento de voz directo en navegador: soporte y comportamiento variables.
- Aplicación móvil nativa: duplica trabajo antes de validar el producto.
