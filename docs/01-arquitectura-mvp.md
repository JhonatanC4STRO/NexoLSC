# 01 · Arquitectura del MVP

## Resumen

El sistema tiene dos partes:

1. **La app web** (sitio estático, React + three.js): convierte texto o voz en una cola de letras y la
   reproduce con un avatar 3D. No necesita servidor: el léxico va en el código, los avatares son `.glb`
   estáticos y el reconocimiento de voz lo hace el navegador.
2. **La producción de contenido** (Blender + scripts de Python): genera los avatares y les aplica las 27
   letras, que están definidas como datos independientes del avatar.

El diseño separa lo que **cambiará** en las fases futuras (cómo se convierte el texto en señas, qué avatar
se usa) de lo que **se mantendrá** (el motor de reproducción). Así, al pasar de deletrear letras a señar
palabras, o al cambiar de avatar, no hay que rehacer el reproductor ni volver a animar.

## Diagrama de capas (app web)

```text
┌──────────────────────────────────────────────────────────────────────┐
│ UI (React)                                                           │
│  TextInput · SpeechButton · AvatarSelector · PlayerControls ·        │
│  LetterTimeline                                                      │
└───────────────┬───────────────────────────────▲──────────────────────┘
                │ texto                         │ snapshot (useSyncExternalStore)
                ▼                               │
┌──────────────────────────────┐   ┌────────────┴─────────────────────┐
│ Entrada                      │   │ SignPlayer (core, TS puro)        │
│  SpeechToTextProvider        │   │  cola · estado · reloj · velocidad│
│   └─ WebSpeechProvider       │   │  play/pause/stop/seek/loop        │
└──────────────┬───────────────┘   └────────────▲───────────┬─────────┘
               │ texto                          │ items     │ PlaybackFrame
               ▼                                │           ▼
┌──────────────────────────────────────────────┴─┐  ┌──────────────────────────┐
│ Pipeline lingüístico (core, TS puro)            │  │ Avatar3D (R3F / Three.js)│
│  normalizeText → Token[]                        │  │  ClipDriver              │
│  buildQueue(tokens, SignRepository) → QueueItem │  │   └─ AnimationMixer      │
│  SignRepository ← alphabet.lsc.ts               │  │  avatars/<id>.glb (clips)│
└─────────────────────────────────────────────────┘  │  StageBackground (foto)  │
                                                     └──────────────────────────┘
```

## Diagrama de la producción de contenido

```text
assets-src/letters/alfabeto_lsc.json          assets-src/avatars/<id>/build_avatar.py
  (27 letras como ángulos de dedos,             (configuración del personaje)
   pulgar, mano y trayectorias)                          │ tools/blender/mpfb_builder.py
            │                                            ▼   (MPFB 2 + Rigify, texturas web)
            │                                  assets-src/avatars/<id>/avatar.blend
            └──────────► tools/blender/bake_letters.py ◄──┘
                                     │  crea las Actions rest + sign_A … sign_Z, sign_ENYE
                                     ▼
                         tools/blender/export_avatar.py
                                     │  solo huesos DEF-*, clips horneados
                                     ▼
                         public/models/avatars/<id>.glb  ──►  registrado en src/avatar/avatars.ts
```

La misma definición de letras se aplica a todos los avatares: cambiar de avatar es volver a ejecutar
`bake_letters.py` y `export_avatar.py`, no reanimar. Detalle en
[06-animation-clips.md](06-animation-clips.md).

Es la arquitectura que propusiste (TextInput, SpeechInput, SignPlayer → AnimationQueue, Avatar3D),
con tres piezas añadidas que la hacen escalable:

| Pieza añadida | Por qué |
|---|---|
| `normalizeText` + `buildQueue` | Aíslan la regla "texto → qué señas". En la fase 2 solo cambia `buildQueue` (busca palabras antes de deletrear). |
| `SignRepository` | Único punto de acceso al léxico. Hoy es un arreglo; mañana, un JSON remoto o una API. |
| `ClipDriver` | Traduce el estado del reproductor a pesos de animación. El reproductor no sabe nada de Three.js. |

## Principios

1. **El núcleo (`src/core`) no depende de React ni de Three.js.** Se prueba con Vitest sin navegador
   (15 pruebas en el código inicial).
2. **El reproductor es dueño del tiempo.** `SignPlayer.update(dt)` avanza un reloj propio
   multiplicado por la velocidad. El 3D solo *muestrea* el estado (`getFrame()`) en cada frame. Por eso
   pausar, cambiar la velocidad, saltar a una letra o repetir son operaciones triviales y deterministas.
3. **Estado discreto vs. continuo.** La UI de React se re-renderiza solo cuando cambia la letra o el
   estado (pocas veces por segundo). El avatar lee el estado continuo 60 veces por segundo sin pasar por
   React.
4. **Todo es un "SignEntry".** Una letra es una seña de tipo `letter`. Palabras, números y expresiones
   no manuales usarán el mismo modelo ([08-modelo-datos-letras.md](08-modelo-datos-letras.md)).
5. **Las letras son datos, los avatares son intercambiables.** Todos los avatares cumplen el mismo
   contrato (rig Rigify, clips `rest` + `sign_*`) y se registran en `src/avatar/avatars.ts`; la app los
   compara con un selector.
6. **Degradación elegante.** Si no hay ningún `.glb`, se muestra un visor de respaldo (letra grande +
   descripción de la configuración). Si falta el clip de una letra, el avatar usa `rest` y la línea de
   tiempo la marca como "animación pendiente". Si falta la foto de fondo, el escenario queda gris. Si el
   navegador no soporta voz, se explica y se ofrece escribir.

## ¿Necesitamos Node.js, Express y PostgreSQL?

| Tecnología | ¿En el MVP? | Justificación | ¿Cuándo entra? |
|---|---|---|---|
| **Node.js** | Solo como **herramienta de desarrollo** (Vite, npm, pruebas) | No hay código de servidor | Ya se usa para compilar |
| **Express** (u otro backend) | **No** | No hay datos privados, cuentas ni lógica que deba ocultarse | Fase 2–3: panel de administración del léxico, flujo de validación con revisores sordos, analítica, reconocimiento de voz en la nube (para no exponer claves), traducción en servidor |
| **PostgreSQL** | **No** | 27 letras caben en un archivo TypeScript versionado en git | Fase 2: cuando el léxico pase de cientos de señas, con variantes regionales, estados de validación e historial. Un Postgres gestionado (p. ej. Supabase o Neon) basta al principio |

**Despliegue del MVP:** `npm run build` genera `dist/` y se publica en cualquier hosting estático
(Vercel, Netlify, GitHub Pages, Cloudflare Pages). Requiere **HTTPS** para que el micrófono funcione.

## Flujo de datos (resumen)

```text
"¿Cómo estás?"
   │ normalizeText
   ▼
[C][O][M][O] (pausa) [E][S][T][A][S]            ← Token[]
   │ buildQueue + SignRepository
   ▼
QueueItem[] con sign, transitionMs, durationMs  ← la "AnimationQueue"
   │ player.load(items); player.play()
   ▼
SignPlayer.update(dt) cada frame  ──►  getFrame() = {from, to, transition, progress}
                                            │
                                            ▼
                                   ClipDriver.apply(frame) → mixer.update(0) → avatar
```

## Decisiones de arquitectura (tipo ADR)

| # | Decisión | Alternativa descartada | Motivo |
|---|---|---|---|
| A1 | SPA estática, sin backend | Node/Express desde el inicio | Menos piezas; nada del MVP lo requiere |
| A2 | Un `.glb` por avatar con todos los clips | Un `.glb` por letra (con malla) | Ver [06-animation-clips.md](06-animation-clips.md) |
| A3 | Reloj propio en `SignPlayer` | Encadenar eventos `finished` del `AnimationMixer` | Con eventos, pausar/saltar/cambiar velocidad se vuelve frágil |
| A4 | Transiciones calculadas en tiempo real (blending) | Animar a mano cada transición entre pares de letras | 27×27 = 729 transiciones; el blending las resuelve |
| A5 | Estado con `useSyncExternalStore` | Redux / Zustand | El estado es pequeño y vive en una clase; no hace falta otra librería |
| A6 | Voz con Web Speech API detrás de una interfaz | Servicio de voz en la nube | Sin costos ni claves; la interfaz permite cambiar de proveedor |
| A7 | Letras como datos aplicados por script (`bake_letters.py`) | Animar cada letra a mano en cada avatar | Cambiar de avatar o corregir una letra no obliga a reanimar; probado con dos avatares |
| A8 | Avatares generados por script con MPFB 2 (CC0) | Modelos descargados de terceros; malla generada por IA | Licencia libre, reproducible, rig con dedos y cara; las mallas por IA suelen dar manos fusionadas |
