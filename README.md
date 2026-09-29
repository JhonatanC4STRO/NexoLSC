# NexoLSC — MVP deletreador en Lengua de Señas Colombiana

> **Objetivo del MVP:** escribo (o digo) una palabra → un avatar 3D hace la seña de cada letra del
> alfabeto manual LSC, una por una, con controles para aprender (pausa, velocidad, saltar, repetir).

## Documentos

| # | Documento | Contenido |
|---|---|---|
| 00 | [Análisis del video de referencia](docs/00-analisis-video-referencia.md) | Patrones de UX de Hand Talk que adoptamos y los que no |
| 01 | [Arquitectura del MVP](docs/01-arquitectura-mvp.md) | Capas, principios, ¿hace falta backend? (no) |
| 02 | [Tecnologías recomendadas](docs/02-tecnologias-recomendadas.md) | Stack con versiones probadas y alternativas |
| 03 | [Estructura de carpetas](docs/03-estructura-carpetas.md) | Árbol del proyecto y reglas |
| 04 | [Diseño del avatar](docs/04-diseno-avatar.md) | Diagnóstico de tu avatar actual y requisitos del definitivo |
| 05 | [Sistema de rigging](docs/05-sistema-rigging.md) | Rig de control Rigify vs. esqueleto de deformación exportado |
| 06 | [Sistema de Animation Clips](docs/06-animation-clips.md) | Un GLB con clips vs. uno por letra; flujo en Blender; exportación |
| 07 | [Sistema AnimationQueue](docs/07-animation-queue.md) | Cola, estados, reloj, velocidad, saltos |
| 08 | [Modelo de datos para las letras](docs/08-modelo-datos-letras.md) | `SignEntry` y su evolución |
| 09 | [Flujo Texto → letras → avatar](docs/09-flujo-texto-letras-avatar.md) | Paso a paso con ejemplos |
| 10 | [Flujo Voz → texto → letras → avatar](docs/10-flujo-voz-texto-avatar.md) | Web Speech API, límites, alternativas |
| 11 | [Tildes, espacios y caracteres especiales](docs/11-manejo-caracteres-especiales.md) | Reglas y decisiones abiertas |
| 12 | [Fuentes reales del alfabeto LSC](docs/12-fuentes-alfabeto-lsc.md) | Fichas de fuentes, lectura letra por letra, protocolo de validación |
| 13 | [Diseño de la interfaz](docs/13-diseno-interfaz.md) | Pantalla, estados, accesibilidad |
| 14 | [Plan de implementación](docs/14-plan-implementacion.md) | Etapas, criterios de "listo" y riesgos |
| 15 | [Código inicial](docs/15-codigo-inicial.md) | Todo el código del proyecto base (probado) |
| 16 | [Palabras y frases completas](docs/16-estrategia-palabras-frases.md) | Cómo llegar de la fase 1 a la 5 sin rehacer |

## Decisiones clave

1. **Solo frontend** (Vite + React + TypeScript + three.js/R3F). Sin Node/Express/PostgreSQL en el MVP.
2. **Un `avatar.glb` con un clip por letra** (`rest`, `sign_A` … `sign_Z`, `sign_ENYE`); paquetes de
   animación bajo demanda en la fase 2.
3. **El reproductor controla el tiempo** y el 3D solo lo muestrea: pausar, velocidad y saltos son triviales.
4. **Fuente del alfabeto:** Diccionario Básico de la LSC (INSOR – Instituto Caro y Cuervo, 2006), p. 573:
   27 letras; G, H, J, Ñ, S y Z tienen movimiento. Todas las letras quedan en `draft` hasta que las
   validen personas sordas usuarias de LSC.
5. **Tu avatar actual (Miles Morales) sirve para probar el pipeline, no para publicar**: personaje con
   derechos de terceros, máscara sin cara y guantes negros con poco contraste.

## Estado verificado (2026-09-28)

- Código inicial: 15 pruebas en verde, build sin errores.
- Pipeline Blender 5.2 → GLB → navegador probado con una copia de tu avatar (clips `rest`, `sign_A`, `sign_L`).
- Voz: funciona en Chrome/Edge/Safari; **no en Firefox**.

## Cómo ejecutar el proyecto

```bash
npm install
```

```bash
npm run dev
```

Abre http://localhost:5173 y escribe una palabra. Pruebas: `npm test`.

**El avatar no está en el repositorio.** El modelo de prueba usado en desarrollo es un personaje con
derechos de terceros y no se publica. Sin `public/models/avatar.glb` la app muestra la **vista de
respaldo** (letra grande + descripción de la configuración) y todo el flujo funciona igual. Para generar
el GLB desde un `.blend` propio, ver [assets-src/README.md](assets-src/README.md).
