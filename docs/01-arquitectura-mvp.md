# 01 · Arquitectura del MVP

## Resumen

El MVP es una **aplicación 100 % frontend** (sitio estático) construida con React + Three.js.
No necesita servidor propio: el léxico de 27 letras va en el código, el avatar es un archivo `.glb`
estático y el reconocimiento de voz lo hace el navegador.

El diseño separa lo que **cambiará** en las fases futuras (cómo se convierte el texto en señas) de lo que
**se mantendrá** (el motor de reproducción y el avatar). Así, al pasar de deletrear letras a señar
palabras no hay que rehacer el reproductor ni el visor 3D.

## Diagrama de capas

```text
┌──────────────────────────────────────────────────────────────────────┐
│ UI (React)                                                           │
│  TextInput · SpeechButton · PlayerControls · LetterTimeline          │
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
│  SignRepository ← alphabet.lsc.ts               │  │  avatar.glb (clips)      │
└─────────────────────────────────────────────────┘  └──────────────────────────┘
```

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
5. **Degradación elegante.** Si falta el `.glb`, se muestra un visor de respaldo (letra grande +
   descripción de la configuración). Si falta el clip de una letra, el avatar usa `rest` y la línea de
   tiempo la marca como "animación pendiente". Si el navegador no soporta voz, se explica y se ofrece
   escribir.

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
| A2 | Un solo `avatar.glb` con N clips | Un `.glb` por letra (con malla) | Ver [06-animation-clips.md](06-animation-clips.md) |
| A3 | Reloj propio en `SignPlayer` | Encadenar eventos `finished` del `AnimationMixer` | Con eventos, pausar/saltar/cambiar velocidad se vuelve frágil |
| A4 | Transiciones calculadas en tiempo real (blending) | Animar a mano cada transición entre pares de letras | 27×27 = 729 transiciones; el blending las resuelve |
| A5 | Estado con `useSyncExternalStore` | Redux / Zustand | El estado es pequeño y vive en una clase; no hace falta otra librería |
| A6 | Voz con Web Speech API detrás de una interfaz | Servicio de voz en la nube | Sin costos ni claves; la interfaz permite cambiar de proveedor |
