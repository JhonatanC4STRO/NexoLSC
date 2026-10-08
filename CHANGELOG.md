# Changelog

Todos los cambios relevantes del proyecto. Formato basado en
[Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y
[Versionado Semántico](https://semver.org/lang/es/).

Mientras la versión sea `0.x`, el MVP no se considera estable: una versión menor (`0.2.0`, `0.3.0`)
puede cambiar formatos de datos o la estructura del proyecto.

## [0.4.0] - 2026-10-08

### Añadido
- Pantalla «Escenario» (opción A de los mockups, <https://claude.ai/artifact/4baJA1Goh6NToKhGvrnGKD>): el
  avatar ocupa toda la pantalla y lo demás flota encima. Tarjeta de la letra actual con su descripción
  (`src/ui/CurrentLetter.tsx`), barra inferior con letras, velocidad, campo de texto, voz y controles, y
  cabecera con el logo, el estado de validación y el selector de avatar. En el celular la barra pasa a ser
  un panel inferior y la velocidad, un solo botón.
- Botones de vista de la cámara: Frente, Perfil y Mano (`src/ui/CameraViews.tsx`). La vista Mano sigue la
  posición de la mano en ese momento; con «menos movimiento» la cámara cambia sin animación.
- Glosario de palabras técnicas (`docs/17-glosario.md`).
- Plan de trabajo listo para Jira: 9 épicas con sus tareas en `docs/jira/plan-nexolsc.csv` (para importar
  con el importador CSV de Jira).
- Comando `npm run docs:codigo` (`tools/docs/gen_doc15.mjs`), que vuelve a generar el doc 15 desde el código.

### Cambiado
- Documentación reescrita en lenguaje sencillo (01 a 13, README y `assets-src/README.md`), con un resumen
  «En pocas palabras» al inicio de cada documento. El README explica paso a paso cómo ejecutar el proyecto.
- Diagramas de la documentación en Mermaid y en español (se ven como gráficos en GitHub y en VS Code):
  capas de la app, taller de contenido y recorrido del texto (01), esqueletos (05), tipos de letra (06),
  estados del reproductor (07), recorrido texto → avatar (09), voz (10) y fases 2 y 3 (16).
- Doc 14 (plan de trabajo) reescrito en lenguaje sencillo y organizado en épicas (NX-1 a NX-9) como en Jira.
- Doc 15 regenerado con el código actual (antes mostraba código de la v0.2).
- El avatar por defecto ahora es **MPFB2 · hombre joven** (`mpfb2`).
- Cámara del escenario más abierta, para que la cabeza y las manos queden entre la cabecera y la barra.

### Eliminado
- Avatar `mpfb2-caricatura`: su `.glb`, su carpeta en `assets-src/avatars/`, su registro en la app y sus
  imágenes en el sistema de diseño (grupo «Personaje»). Sigue en el historial de git.

## [0.3.0] - 2026-09-30

### Añadido
- Marca visual NexoLSC aplicada a la app: símbolo de dos arcos en «C» enlazados con el logotipo
  «nexo» + píldora «LSC» en la cabecera (`src/ui/Logo.tsx`), favicon (`public/favicon.svg`),
  `theme-color` y variantes del símbolo en `public/brand/`.
- Íconos propios de la marca (`src/ui/icons.tsx`) en lugar de emojis: reproducir, pausar, detener,
  reiniciar, repetir, micrófono, anterior y siguiente.
- Insignia de validación en el pie: cuántas letras han validado personas sordas (hoy 0 de 27, «Borrador»),
  calculada desde `validation.status`.
- Tipografías *Baloo 2* (títulos, letras) y *Atkinson Hyperlegible* (texto), desde Google Fonts.

### Cambiado
- `src/styles.css` reescrito con los tokens de la marca en tema claro y oscuro: acción primaria y foco
  en verde selva, letra actual en amarillo mango con borde `mango-ink`, letras ya señadas en bruma,
  errores en achiote. Botones en píldora, objetivos táctiles de 44 px, tarjeta de entrada y escenario
  con esquinas de 24 px y sombra.
- Controles en dos filas: transporte (anterior · reproducir/pausar · siguiente) y acciones secundarias
  (reiniciar, detener, repetir); en pantallas estrechas el transporte ya no se parte.
- Documentación: diseño de la interfaz (lenguaje visual con los tokens de la marca), estructura de
  carpetas y README.

## [0.2.2] - 2026-09-30

### Eliminado
- `docs/00-analisis-video-referencia.md`: el análisis del producto de referencia ya no aporta al proyecto.

### Cambiado
- Documentación actualizada al estado de la v0.2.x: arquitectura con la producción de contenido
  (avatares y letras como datos), tecnologías (MPFB, alternativas descartadas), diseño del avatar
  reorganizado alrededor de los candidatos actuales, rigging con los ejes verificados del rig MPFB,
  revisión de las 27 letras, modelo de datos (`SignEntry` + datos de pose), interfaz (selector de avatar
  y fondo), plan con el estado real por etapas y estrategia de palabras basada en datos de pose.

## [0.2.1] - 2026-09-29

### Añadido
- Foto de fondo del escenario: sede del SENA, nuevo Centro de la Amazonía (Florencia, Caquetá),
  en `public/backgrounds/sena.jpg`. Se muestra desenfocada y con velo claro detrás del avatar.

### Cambiado
- Enlaces del changelog actualizados al nombre actual del repositorio (`NexoLSC`).

## [0.2.0] - 2026-09-29

### Añadido
- **27 letras del alfabeto manual LSC** (A–Z y Ñ) como datos independientes del avatar en
  `assets-src/letters/alfabeto_lsc.json`, con trayectoria en G, H, J, Ñ, S y Z. Estado `draft`:
  pendientes de validación con personas sordas usuarias de LSC.
- `tools/blender/bake_letters.py`: aplica las letras al rig Rigify de cualquier avatar (cambiar de avatar
  no obliga a reanimar).
- Candidato de avatar **MPFB2 · caricatura** (CC0), predeterminado, con rasgos del autor del proyecto.
- Candidato de avatar **MPFB2** realista (CC0).
- `tools/blender/mpfb_builder.py`: generador reutilizable de candidatos MPFB 2 + Rigify (materiales
  opacos/recorte para three.js, texturas optimizadas para web, recoloreado de ropa e iris).
- Selector de avatar en la interfaz, con licencia visible y elección recordada en el navegador.
- Fondo de escenario configurable (`src/avatar/stage.ts`), desenfocado para no restar legibilidad a las
  manos; lee `public/backgrounds/sena.jpg` si existe.
- `CHANGELOG.md` y versionado semántico con etiquetas `vX.Y.Z`.

### Cambiado
- Estructura de avatares: `assets-src/avatars/<id>/` y `public/models/avatars/<id>.glb`.
- Documentación actualizada (docs 03, 04, 05, 06, 13, 14, 15, README y `assets-src/README.md`).

### Corregido
- En desarrollo (StrictMode) el avatar quedaba en pose de enlace: el `AnimationMixer` se creaba una vez y
  la limpieza del efecto lo detenía.
- Al saltar a una letra en pausa se mostraba la letra anterior.
- `pose_helpers.py`: los dedos del Rigify actual usan rotación Euler (antes solo se escribían cuaterniones)
  y las poses se acumulaban entre Actions.
- Materiales de MakeHuman exportados como transparentes (`BLEND`), que en three.js causan errores de
  orden de dibujo; ahora son `OPAQUE`, y `MASK` en pelo, cejas y pestañas.

## [0.1.0] - 2026-09-28

### Añadido
- MVP deletreador: texto o voz → letras → avatar 3D (React + TypeScript + three.js/R3F).
- Núcleo sin dependencias de UI: normalizador de texto (tildes, Ñ, pausas, números), cola de señas y
  `SignPlayer` (reproducir, pausar, detener, reiniciar, velocidad 0.5x–2x, saltar, repetir).
- Documentación del MVP en `docs/` (00–16), con fuentes del alfabeto LSC.
- Scripts de Blender para limpiar y exportar avatares a GLB.
- 15 pruebas con Vitest.

[0.4.0]: https://github.com/JhonatanC4STRO/NexoLSC/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/JhonatanC4STRO/NexoLSC/compare/v0.2.2...v0.3.0
[0.2.2]: https://github.com/JhonatanC4STRO/NexoLSC/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/JhonatanC4STRO/NexoLSC/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/JhonatanC4STRO/NexoLSC/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/JhonatanC4STRO/NexoLSC/releases/tag/v0.1.0
