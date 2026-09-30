# 02 · Tecnologías recomendadas

Tu propuesta (Blender → GLB → Three.js + React + React Three Fiber) **es la correcta** para este MVP.
Solo añado Vite, TypeScript y Vitest, y dejo fuera todo lo que no se necesita todavía.

Versiones verificadas en npm el 2026-09-28 y probadas juntas (compilación + pruebas + ejecución en navegador).

## Stack del MVP

| Capa | Tecnología | Versión | Para qué |
|---|---|---|---|
| Modelado / rig / animación | **Blender** | 5.2 (la que tienes instalada) | Generar avatares, hornear las letras, exportar GLB (todo por script) |
| Generador de personajes | **MPFB** (MakeHuman para Blender) | 2.0.17 + `makehuman_system_assets` (CC0) | Avatares con licencia libre, dedos, metacarpianos y cara; ajustes finos de rasgos |
| Rig de autoría | **Rigify** (incluido en Blender) | — | Controles cómodos para posar dedos; se exportan solo los huesos `DEF-*` |
| Letras | **JSON + script de Blender** (`bake_letters.py`) | — | Las 27 letras como datos, aplicables a cualquier avatar |
| Formato 3D | **glTF 2.0 binario (`.glb`)** | — | Estándar web: malla + esqueleto + clips en un archivo |
| Bundler / dev server | **Vite** | 8.3 | Arranque instantáneo, build estático |
| UI | **React** | 19.3 | Componentes de la interfaz |
| Lenguaje | **TypeScript** | 7.0 | Tipos para el modelo de datos de señas (evita errores al crecer el léxico) |
| 3D | **three.js** | 0.186 | Render, `AnimationMixer`, skinning |
| 3D en React | **@react-three/fiber** | 9.8 | Escena declarativa, bucle `useFrame` |
| Utilidades 3D | **@react-three/drei** | 10.7 | `useGLTF`, `OrbitControls`, `ContactShadows` |
| Pruebas | **Vitest** | 5.0 | Pruebas del núcleo (normalizador, cola, reproductor) |
| Voz → texto | **Web Speech API** (navegador) | — | Dictado en `es-CO` sin servidor |
| Hosting | Cualquier hosting estático con HTTPS | — | Vercel / Netlify / GitHub Pages |

## Por qué React Three Fiber (y no Three.js "a pelo")

- La interfaz ya es React; R3F permite montar la escena como un componente más.
- `useFrame` da un bucle por frame sin gestionar `requestAnimationFrame` a mano.
- Importante: **la lógica de reproducción no depende de R3F** (vive en `src/core`). Si mañana se
  necesita un widget embebible sin React, el núcleo se reutiliza tal cual con Three.js puro.

## Alternativas evaluadas

| Alternativa | Veredicto |
|---|---|
| **Babylon.js** | Excelente motor, pero el ecosistema React + glTF de three/R3F es más grande y tu propuesta ya lo usa. Sin ventaja clara para este caso. |
| **Unity WebGL / Godot Web** | Descargas de decenas de MB, arranque lento y peor integración con una página accesible. Descartado para web. |
| **Next.js** | No hay SSR ni rutas de servidor que justificarlo. Vite es más simple. Reconsiderar si se añade un sitio con contenido/SEO. |
| **Zustand / Redux** | No hace falta: el estado vive en la clase `SignPlayer` y se expone con `useSyncExternalStore`. |
| **Síntesis procedural (SiGML/HamNoSys, p. ej. JASigning)** | Interesante para fases futuras (generar señas desde notación), pero complica el MVP. Ver [16-estrategia-palabras-frases.md](16-estrategia-palabras-frases.md). |
| **Avatar generado con IA (imagen → malla 3D)** | Probado y descartado por ahora: el plan gratuito del servicio disponible no incluye el modelo de imagen necesario, la conversión a 3D cuesta 9–38 créditos y las mallas generadas suelen dar manos fusionadas, lo peor para LSC. |
| **Modelos 3D descargados de internet** | Descartados para publicar: el primer avatar de prueba (Miles Morales) era un personaje con derechos de terceros. |

## Herramientas opcionales (después del MVP)

| Herramienta | Uso |
|---|---|
| `@gltf-transform/cli` | Comprimir el GLB (Meshopt/Draco para malla, KTX2 para texturas) y eliminar las pistas de animación de huesos que no se mueven (cara, piernas). Los GLB actuales pesan ~5 MB. |
| `@huggingface/transformers` (Whisper en el navegador) | Voz → texto en **Firefox** y sin enviar audio a terceros. Ver [10-flujo-voz-texto-avatar.md](10-flujo-voz-texto-avatar.md). |
| Playwright | Pruebas de extremo a extremo de la interfaz. |
| MediaPipe (Hands / Holistic) | Fase 5: reconocimiento de LSC por cámara; también sirve para captura de movimiento a partir de video. |

## Compatibilidad de navegadores

| Función | Chrome / Edge | Safari | Firefox |
|---|---|---|---|
| Avatar 3D (WebGL2) | ✅ | ✅ | ✅ |
| Voz (Web Speech API) | ✅ (envía el audio a servidores de Google) | ✅ parcial (`webkitSpeechRecognition`) | ❌ **no disponible** en la versión estable |

> En **Firefox** el botón «Hablar» muestra "voz no disponible" hasta que se añada un proveedor alternativo
> (Whisper en el navegador).
