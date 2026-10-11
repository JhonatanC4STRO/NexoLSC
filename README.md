# NexoLSC — deletreador en Lengua de Señas Colombiana

> **En pocas palabras:** escribes (o dices) una palabra y un avatar 3D la deletrea con el alfabeto manual
> de la Lengua de Señas Colombiana (LSC), letra por letra. Puedes pausar, cambiar la velocidad, saltar a
> una letra, repetir y mirar la mano de frente, de lado o de cerca.

Proyecto del SENA, Centro de la Amazonía (Florencia, Caquetá).

## Cómo ejecutarlo en tu computador

**Lo que necesitas instalar una sola vez:** [Node.js](https://nodejs.org/) versión 20 o más nueva (trae
`npm`). Para saber si ya lo tienes, abre una terminal y escribe `node -v`: debe mostrar un número como
`v20…` o mayor.

1. **Abre una terminal en la carpeta del proyecto.** En VS Code: menú *Terminal → Nueva terminal*. O en
   Windows, abre la carpeta `NexoLSC` en el Explorador, escribe `cmd` en la barra de direcciones y pulsa
   Enter.
2. **Instala las librerías** (solo la primera vez, o cuando cambie `package.json`):

   ```bash
   npm install
   ```

3. **Arranca la página:**

   ```bash
   npm run dev
   ```

4. **Ábrela en el navegador:** entra a <http://localhost:5173>. Escribe una palabra, por ejemplo «Hola», y
   pulsa **Reproducir** (o Enter).
5. **Para detenerla:** vuelve a la terminal y pulsa `Ctrl + C`.

Mientras la página está arrancada, cada vez que guardas un cambio en el código el navegador se actualiza
solo.

### Otros comandos útiles

| Comando | Para qué |
|---|---|
| `npm test` | Corre las pruebas automáticas (deben salir 15 en verde) |
| `npm run build` | Prepara la versión para publicar, en la carpeta `dist/` |
| `npm run preview` | Abre esa versión de publicación para revisarla antes de subirla |
| `npm run avatar:abrir` | Abre el avatar en Blender para perfeccionar las letras |
| `npm run avatar:exportar` | Exporta el avatar para la página después de editarlo en Blender |
| `npm run docs:codigo` | Vuelve a generar el doc 15 con el código actual |
| `npm run docs:diagramas` | Vuelve a generar los diagramas de los documentos (necesita Python y la skill «diagram-design») |

### Si algo no funciona

- **«npm no se reconoce como un comando»:** falta instalar Node.js, o hay que cerrar y abrir la terminal
  después de instalarlo.
- **«No se puede cargar el archivo …\npm.ps1 porque la ejecución de scripts está deshabilitada»** (en
  PowerShell de Windows): escribe `npm.cmd` en lugar de `npm` (por ejemplo, `npm.cmd run dev`), o usa la
  terminal *Command Prompt* o *Git Bash*. Si prefieres arreglarlo para siempre, ejecuta en PowerShell
  `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned` y vuelve a abrir la terminal.
- **El puerto 5173 está ocupado:** Vite usará otro (5174, 5175…). Mira en la terminal qué dirección muestra.
- **El avatar no aparece:** revisa que exista `public/models/avatars/mpfb2.glb`. Si no hay ningún avatar, la
  página muestra la letra en grande con su descripción.
- **El botón de voz no funciona:** en Chrome, Edge y Safari se usa la voz del navegador. En Firefox y
  Brave se usa la voz local (Whisper): la primera vez pide permiso para descargar unos 85 MB. En todos los
  casos, la página debe abrirse con `https://` (o en `localhost`) y hay que permitir el micrófono.

## Documentación

Todo está escrito en lenguaje sencillo. Si una palabra técnica no te queda clara, búscala en el
[glosario](docs/17-glosario.md).

| # | Documento | De qué trata |
|---|---|---|
| 01 | [Cómo está construido](docs/01-arquitectura-mvp.md) | Las dos partes del proyecto (página web y taller de contenido) y por qué no hace falta servidor |
| 02 | [Herramientas](docs/02-tecnologias-recomendadas.md) | Qué programas y librerías se usan, y qué se descartó |
| 03 | [Carpetas](docs/03-estructura-carpetas.md) | Qué hay en cada carpeta |
| 04 | [El avatar](docs/04-diseno-avatar.md) | El avatar actual y qué debe tener un buen avatar para LSC |
| 05 | [El esqueleto](docs/05-sistema-rigging.md) | Cómo se mueve el avatar por dentro |
| 06 | [Las animaciones de las letras](docs/06-animation-clips.md) | Cómo perfeccionar cada letra a mano en Blender y exportarla |
| 07 | [La lista de señas y el reproductor](docs/07-animation-queue.md) | Cómo se reproduce, pausa, salta y cambia de velocidad |
| 08 | [Cómo se describe una seña](docs/08-modelo-datos-letras.md) | La ficha de cada letra |
| 09 | [Del texto al avatar](docs/09-flujo-texto-letras-avatar.md) | Paso a paso, con ejemplos |
| 10 | [De la voz al avatar](docs/10-flujo-voz-texto-avatar.md) | Cómo funciona el botón «Hablar» |
| 11 | [Tildes y caracteres especiales](docs/11-manejo-caracteres-especiales.md) | Qué pasa con tildes, Ñ, números y signos |
| 12 | [De dónde salen las letras](docs/12-fuentes-alfabeto-lsc.md) | Las fuentes reales del alfabeto LSC y cómo se validarán |
| 13 | [La pantalla](docs/13-diseno-interfaz.md) | El diseño «Escenario», los mockups y la accesibilidad |
| 14 | [Plan de trabajo](docs/14-plan-implementacion.md) | Qué está hecho y qué sigue |
| 15 | [Código](docs/15-codigo-inicial.md) | El código del proyecto para leerlo con calma |
| 16 | [Palabras y frases completas](docs/16-estrategia-palabras-frases.md) | Cómo pasar de deletrear a señar palabras |
| 17 | [Glosario](docs/17-glosario.md) | Las palabras técnicas, explicadas |
| 18 | [Requisitos e historias de usuario](docs/18-requisitos-e-historias.md) | Qué debe hacer la app, para quién y cómo se comprueba |

## Decisiones principales

1. **Solo página web, sin servidor.** Todo funciona en el navegador (Vite + React + TypeScript + three.js).
2. **Un archivo por avatar con todas las letras** (`public/models/avatars/<id>.glb`).
3. **El reproductor lleva su propio reloj.** Por eso pausar, cambiar la velocidad y saltar son sencillos.
4. **Las letras salen del Diccionario Básico de la LSC** (INSOR – Instituto Caro y Cuervo, 2006), página
   573: 27 letras; G, H, J, Ñ, S y Z tienen movimiento. Todas están en **borrador** hasta que las validen
   personas sordas que usan la LSC.
5. **Las letras se perfeccionan a mano en Blender.** Cada letra es una animación dentro de
   `assets-src/avatars/mpfb2/avatar.blend`, que es el original. Se abre con `npm run avatar:abrir` y se
   exporta con `npm run avatar:exportar`.
6. **Avatar actual: MPFB2 · hombre joven** (licencia libre CC0). El avatar caricaturesco se eliminó el
   2026-10-08. El modelo de Miles Morales solo existe en el equipo local para pruebas: tiene derechos de
   autor de otros.
7. **Marca visual propia:** dos arcos en «C» enlazados, verde selva y amarillo mango. Sistema de diseño:
   <https://claude.ai/artifact/EVFLVxqZYXv6AC4Kj38ork>.
8. **Pantalla «Escenario»:** el avatar ocupa toda la pantalla y los controles flotan encima. Mockups:
   <https://claude.ai/artifact/4baJA1Goh6NToKhGvrnGKD>.

## Cómo está hoy (2026-10-08)

- 15 pruebas automáticas en verde y la versión de publicación se arma sin errores.
- **27 letras** aplicadas al avatar `mpfb2` (1,71 m, ~5 MB), todas en borrador.
- Pantalla «Escenario» en escritorio y celular, con tema claro y oscuro automático.
- Botones de vista de la cámara: Frente, Perfil y Mano.
- Fondo con la foto de la sede del SENA, desenfocada (`public/backgrounds/sena.jpg`).
- Voz: en Chrome, Edge y Safari con la voz del navegador; en Firefox y Brave con **Whisper dentro del
  navegador** (descarga de ~85 MB la primera vez, con aviso).

Cómo crear o añadir avatares: [assets-src/README.md](assets-src/README.md).

## Versiones

El proyecto usa [versionado semántico](https://semver.org/lang/es/) (números como `0.3.0`) y anota los
cambios de cada versión en [CHANGELOG.md](CHANGELOG.md). Cada versión publicada tiene una etiqueta de git
`vX.Y.Z`.

Para publicar una versión nueva (ejemplo con la `0.4.0`):

1. Anota los cambios en `CHANGELOG.md`.
2. Sube el número de versión sin crear la etiqueta todavía:

   ```bash
   npm version 0.4.0 --no-git-tag-version
   ```

3. Haz el commit, crea la etiqueta y súbelos:

   ```bash
   git tag -a v0.4.0 -m "v0.4.0"
   ```

   ```bash
   git push origin main --follow-tags
   ```
