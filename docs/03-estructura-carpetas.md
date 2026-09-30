# 03 · Estructura de carpetas

```text
NexoLSC/
├── README.md                      ← índice de la documentación y cómo ejecutar
├── docs/                          ← documentos 00–16
├── assets-src/                    ← archivos fuente de los avatares (no se sirven)
│   ├── README.md                  ← cómo generar, hornear letras, exportar y añadir candidatos
│   ├── letters/
│   │   └── alfabeto_lsc.json      ← las 27 letras como DATOS, independientes del avatar
│   └── avatars/                   ← un candidato por carpeta
│       ├── mpfb2-caricatura/      ← CC0 · por defecto · se versiona
│       │   ├── build_avatar.py    ← configuración del personaje (MPFB 2 + Rigify)
│       │   ├── avatar.blend       ← avatar + rig + una Action por letra
│       │   ├── textures/
│       │   └── LICENSE.md
│       ├── mpfb2/                 ← CC0 · realista · se versiona
│       └── miles-prueba/          ← derechos de terceros · solo local (.gitignore)
├── tools/
│   └── blender/
│       ├── mpfb_builder.py        ← generador compartido de candidatos MPFB
│       ├── bake_letters.py        ← aplica alfabeto_lsc.json a cualquier avatar Rigify
│       ├── export_avatar.py       ← limpieza + exportación GLB (probado con Blender 5.2)
│       └── pose_helpers.py        ← funciones para posar brazos y dedos por script
├── public/
│   ├── backgrounds/
│   │   └── sena.jpg               ← fondo del escenario (src/avatar/stage.ts); opcional
│   └── models/
│       └── avatars/               ← un GLB por candidato (malla + esqueleto + clips rest / sign_*)
│           ├── mpfb2-caricatura.glb
│           ├── mpfb2.glb
│           └── miles-prueba.glb   ← solo local
├── src/
│   ├── core/                      ← TypeScript puro: sin React ni Three.js
│   │   ├── text/
│   │   │   └── normalize.ts       ← texto → Token[] (tildes, Ñ, espacios, signos…)
│   │   ├── signs/
│   │   │   ├── types.ts           ← modelo SignEntry
│   │   │   ├── alphabet.lsc.ts    ← 27 letras (fuente: DBLSC 2006, p. 573)
│   │   │   └── SignRepository.ts  ← acceso al léxico
│   │   ├── player/
│   │   │   ├── queue.ts           ← Token[] → QueueItem[] ("AnimationQueue")
│   │   │   └── SignPlayer.ts      ← motor de reproducción (reloj, estados, velocidad)
│   │   └── core.test.ts
│   ├── avatar/
│   │   ├── avatars.ts             ← registro de candidatos de avatar (URL, licencia)
│   │   ├── stage.ts               ← fondo del escenario (imagen, desenfoque, velo)
│   │   ├── Avatar3D.tsx           ← Canvas R3F, carga del GLB, cámara, luces
│   │   ├── ClipDriver.ts          ← frame del reproductor → pesos de AnimationActions
│   │   └── AvatarPlaceholder.tsx  ← vista sin 3D (mientras no haya GLB)
│   ├── speech/
│   │   └── speechToText.ts        ← interfaz + proveedor Web Speech API
│   ├── hooks/
│   │   ├── usePlayer.ts           ← usePlayer (estado) y usePlayerClock (reloj rAF)
│   │   └── useAvatarChoice.ts     ← qué candidatos existen y cuál eligió el usuario
│   ├── ui/
│   │   ├── AvatarSelector.tsx
│   │   ├── PlayerControls.tsx
│   │   ├── LetterTimeline.tsx
│   │   └── SpeechButton.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── styles.css
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Reglas de la estructura

| Regla | Motivo |
|---|---|
| `src/core` no importa nada de `react`, `three` ni `@react-three/*` | Se prueba sin navegador y se puede reutilizar en un widget, una extensión o un servidor |
| Los datos lingüísticos (`alphabet.lsc.ts`) viven separados de la lógica | En la fase 2 se reemplazan por un JSON/API sin tocar el reproductor |
| `assets-src/` no va en `public/` | El `.blend` y las texturas fuente no los necesita el navegador |
| Un candidato de avatar = una carpeta con su `LICENSE.md` | Se comparan en la app con el selector; solo los de licencia libre se versionan |
| Los `.glb` se generan con `tools/blender/export_avatar.py` | Exportación reproducible, sin pasos manuales olvidados |
| No guardar en el repo imágenes de fuentes con derechos | Se guardan enlaces y número de página (ver [12-fuentes-alfabeto-lsc.md](12-fuentes-alfabeto-lsc.md)) |

## Crecimiento previsto

```text
src/core/
├── text/
│   ├── normalize.ts
│   └── lemmatize.ts               ← fase 2: formas verbales → lema
├── signs/
│   ├── alphabet.lsc.ts
│   ├── numbers.lsc.ts             ← fase 1.1: números (anexo del DBLSC, p. 574)
│   └── lexicon/                   ← fase 2: palabras (JSON por campo temático o API)
├── translate/                     ← fase 3: español → glosas LSC
└── player/
public/models/
├── avatars/<id>.glb               ← malla + esqueleto + alfabeto (el avatar elegido)
└── packs/                         ← fase 2: paquetes de animación sin malla (bajo demanda)
    ├── saludos.glb
    └── familia.glb
```
