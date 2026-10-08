# 03 · Carpetas del proyecto

> **En pocas palabras:** `src/` es el código de la página, `public/` son los archivos que la página
> descarga (avatares, imágenes), `assets-src/` son los archivos de trabajo de los avatares y las letras, y
> `tools/` son los programas de Blender que crean los avatares. `docs/` es esta documentación.

## El árbol de carpetas

```text
NexoLSC/
├── README.md                      ← índice de la documentación y cómo arrancar el proyecto
├── CHANGELOG.md                   ← qué cambió en cada versión
├── .gitattributes                 ← le dice a git qué archivos son binarios (.blend, .glb, imágenes)
├── docs/                          ← esta documentación (01 a 17)
│   └── jira/plan-nexolsc.csv      ← el plan de trabajo, para importarlo en Jira
├── assets-src/                    ← archivos de trabajo de los avatares (la página no los usa)
│   ├── README.md                  ← cómo crear un avatar, aplicarle las letras y exportarlo
│   ├── letters/
│   │   └── alfabeto_lsc.json      ← las 27 letras como DATOS (sirven para cualquier avatar)
│   └── avatars/                   ← una carpeta por avatar
│       ├── mpfb2/                 ← licencia libre · el que usa la app · se guarda en git
│       │   ├── build_avatar.py    ← ficha del personaje (altura, cara, piel, ropa)
│       │   ├── avatar.blend       ← el avatar en Blender, con una animación por letra
│       │   ├── textures/          ← imágenes de piel, ojos y ropa
│       │   └── LICENSE.md         ← licencia del avatar
│       └── miles-prueba/          ← tiene derechos de autor de otros · SOLO en tu equipo
├── tools/
│   ├── blender/
│   │   ├── mpfb_builder.py        ← crea un avatar a partir de su ficha
│   │   ├── bake_letters.py        ← aplica las 27 letras a cualquier avatar
│   │   ├── export_avatar.py       ← limpia el avatar y lo exporta como .glb
│   │   └── pose_helpers.py        ← funciones para mover brazos y dedos con código
│   └── docs/
│       └── gen_doc15.mjs          ← genera el doc 15 desde el código (npm run docs:codigo)
├── public/                        ← lo que la página descarga tal cual
│   ├── favicon.svg                ← ícono de la pestaña del navegador
│   ├── brand/                     ← versiones del logo (color, oscuro, blanco…)
│   ├── backgrounds/
│   │   └── sena.jpg               ← foto de fondo del escenario (opcional)
│   └── models/
│       └── avatars/               ← un archivo .glb por avatar (cuerpo + esqueleto + letras)
│           ├── mpfb2.glb
│           └── miles-prueba.glb   ← solo en tu equipo
├── src/                           ← el código de la página
│   ├── core/                      ← el núcleo: funciona sin pantalla y sin 3D
│   │   ├── text/
│   │   │   └── normalize.ts       ← limpia el texto (tildes, Ñ, espacios, signos)
│   │   ├── signs/
│   │   │   ├── types.ts           ← cómo se describe una seña
│   │   │   ├── alphabet.lsc.ts    ← las 27 letras (fuente: diccionario DBLSC 2006, pág. 573)
│   │   │   └── SignRepository.ts  ← el diccionario de señas
│   │   ├── player/
│   │   │   ├── queue.ts           ← arma la lista de señas
│   │   │   └── SignPlayer.ts      ← el reproductor (reloj, estados, velocidad)
│   │   └── core.test.ts           ← pruebas automáticas
│   ├── avatar/
│   │   ├── avatars.ts             ← lista de avatares disponibles y su licencia
│   │   ├── stage.ts               ← ajustes de la foto de fondo (desenfoque, velo)
│   │   ├── Avatar3D.tsx           ← muestra el avatar: cámara, luces, carga del .glb
│   │   ├── ClipDriver.ts          ← mezcla las animaciones según el reproductor
│   │   └── AvatarPlaceholder.tsx  ← vista sin 3D (letra grande) si no hay avatar
│   ├── speech/
│   │   └── speechToText.ts        ← reconocimiento de voz
│   ├── hooks/
│   │   ├── usePlayer.ts           ← conecta el reproductor con la pantalla
│   │   └── useAvatarChoice.ts     ← recuerda qué avatar elegiste
│   ├── ui/                        ← piezas de la pantalla
│   │   ├── Logo.tsx               ← el logo «nexo LSC»
│   │   ├── CurrentLetter.tsx      ← tarjeta de la letra actual
│   │   ├── CameraViews.tsx        ← botones de vista: Frente, Perfil, Mano
│   │   ├── icons.tsx              ← íconos de la marca
│   │   ├── AvatarSelector.tsx     ← selector de avatar
│   │   ├── PlayerControls.tsx     ← botones de reproducir, pausar, velocidad…
│   │   ├── LetterTimeline.tsx     ← línea de letras
│   │   └── SpeechButton.tsx       ← botón «Hablar»
│   ├── App.tsx                    ← la pantalla completa
│   ├── main.tsx                   ← punto de arranque
│   └── styles.css                 ← colores, letras y estilos (tema claro y oscuro)
├── index.html                     ← la página base
├── package.json                   ← lista de librerías y comandos (npm run dev, npm test…)
├── tsconfig.json                  ← ajustes de TypeScript
└── vite.config.ts                 ← ajustes de Vite
```

## Reglas para mantener el orden

| Regla | Por qué |
|---|---|
| El núcleo (`src/core`) no usa React ni three.js | Así se prueba sin navegador y se puede reutilizar en otros lugares (un widget, una extensión) |
| Las letras (`alphabet.lsc.ts`) están separadas de la lógica | Más adelante se pueden cambiar por un archivo o un servicio en internet sin tocar el reproductor |
| `assets-src/` no está dentro de `public/` | Los archivos de Blender y las texturas originales no los necesita el navegador |
| Cada avatar tiene su carpeta con su `LICENSE.md` | Se comparan con el selector, y solo los de licencia libre se suben a git |
| Los `.glb` se crean siempre con `export_avatar.py` | Así se exportan siempre igual, sin olvidar pasos |
| No se guardan imágenes de fuentes con derechos de autor | Se guarda el nombre del libro y la página (ver [12](12-fuentes-alfabeto-lsc.md)) |

## Cómo crecerá

```text
src/core/
├── text/
│   ├── normalize.ts
│   └── lemmatize.ts               ← fase 2: llevar cada palabra a su forma base («quiero» → QUERER)
├── signs/
│   ├── alphabet.lsc.ts
│   ├── numbers.lsc.ts             ← fase 1.1: los números (diccionario DBLSC, pág. 574)
│   └── lexicon/                   ← fase 2: palabras, agrupadas por tema
├── translate/                     ← fase 3: del español a la estructura de la LSC
└── player/
public/models/
├── avatars/<id>.glb               ← el avatar con su alfabeto
└── packs/                         ← fase 2: paquetes de animaciones sin cuerpo, se descargan al usarlos
    ├── saludos.glb
    └── familia.glb
```
