# 15 · Código inicial

> El proyecto ya está creado en la raíz de NexoLSC (`src/`, `public/`, `tools/`, `assets-src/`).
> Este documento es la referencia legible de ese código; si difieren, manda el código.

Código **probado** el 2026-09-28:

- `npm test` → 15 pruebas en verde (Vitest 5).
- `npm run build` → compila sin errores (TypeScript 7 + Vite 8).
- En el navegador (modo desarrollo y build de producción): carga `public/models/avatar.glb` (exportado
  desde `assets-src/avatar/avatar.blend`, clips `rest`, `sign_A`, `sign_L`), deletrea "Allá", "Lala" y
  "¿Hola, Ana 5?" correctamente, y al saltar a una letra en pausa muestra esa letra. Sin errores en consola.
- `tools/blender/export_avatar.py` probado con Blender 5.2 sobre una copia de tu avatar.

## Cómo ejecutarlo

Requisitos: Node.js 20+ (probado con Node 24) y Blender 5.x para exportar el avatar.

```bash
npm install
```

```bash
npm test
```

```bash
npm run dev
```

Abre http://localhost:5173. Sin `public/models/avatar.glb` verás la **vista de respaldo** (letra grande +
descripción). Para regenerar el GLB desde el `.blend`:

```bash
blender -b assets-src/avatar/avatar.blend --python tools/blender/export_avatar.py -- public/models/avatar.glb
```

El `.blend` debe tener un objeto armadura llamado `rig` y Actions llamadas `rest` y `sign_*`
(ver [06-animation-clips.md](06-animation-clips.md)).

## Mapa de archivos

| Archivo | Rol |
|---|---|
| `src/core/signs/*` | Modelo de datos y léxico (27 letras) |
| `src/core/text/normalize.ts` | Texto → tokens (tildes, Ñ, pausas, números, no soportados) |
| `src/core/player/queue.ts` | Tokens → cola de reproducción ("AnimationQueue") |
| `src/core/player/SignPlayer.ts` | Motor: estados, reloj, velocidad, saltos, bucle |
| `src/avatar/ClipDriver.ts` | Estado del motor → mezcla de AnimationClips |
| `src/avatar/Avatar3D.tsx` | Escena R3F y carga del GLB |
| `src/speech/speechToText.ts` | Interfaz de voz + Web Speech API |
| `src/ui/*` | Controles, línea de tiempo, micrófono |
| `tools/blender/*` | Exportación del GLB y ayudas para posar por script |

---

## `package.json`

```json
{
  "name": "nexolsc",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run"
  },
  "dependencies": {
    "@react-three/drei": "^10.7.9",
    "@react-three/fiber": "^9.8.1",
    "react": "^19.3.0",
    "react-dom": "^19.3.0",
    "three": "^0.186.1"
  },
  "devDependencies": {
    "@types/react": "^19.3.0",
    "@types/react-dom": "^19.3.0",
    "@types/three": "^0.186.0",
    "@vitejs/plugin-react": "^6.1.1",
    "typescript": "^7.0.2",
    "vite": "^8.3.1",
    "vitest": "^5.0.2"
  }
}
```

## `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noEmit": true,
    "skipLibCheck": true,
    "types": ["vite/client"]
  },
  "include": ["src"]
}
```

## `vite.config.ts`

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
```

## `index.html`

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>NexoLSC · Deletreador LSC</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

## `.gitignore`

```text
node_modules/
dist/
*.blend1
*.blend@
.DS_Store
Thumbs.db
~$*.xlsx
tsconfig.tsbuildinfo
```

## `src/core/signs/types.ts`

```ts
/**
 * Modelo de datos de una seña. Una letra del alfabeto manual es solo un
 * tipo de seña (`kind: 'letter'`); el mismo modelo sirve luego para
 * palabras, números y expresiones no manuales.
 */

export type SignKind = 'letter' | 'number' | 'word' | 'phrase' | 'nonmanual';

/** Estado de validación lingüística: nada llega a "approved" sin revisión de una persona sorda usuaria de LSC. */
export type ValidationStatus = 'draft' | 'in_review' | 'approved' | 'rejected';

export type Hand = 'dominant' | 'non_dominant' | 'both';

export interface HandConfiguration {
  /** Etiqueta de configuración manual según la tabla del DBLSC ("mano en A", "mano en 5"...). */
  handshape: string;
  /** Descripción legible de los dedos (se completa a partir de la fuente, no se inventa). */
  fingers: string;
  /** Orientación de la palma respecto a quien seña. */
  palmOrientation?: 'forward' | 'backward' | 'inward' | 'outward' | 'up' | 'down' | 'side';
  /** Ubicación en el espacio de señado. */
  location?: string;
  hand: Hand;
}

export interface SignMovement {
  /** true si la letra tiene trayectoria o movimiento interno (J, Ñ, S, Z…). */
  dynamic: boolean;
  /** Descripción de la trayectoria según la fuente (flechas de la ilustración). */
  description?: string;
}

export interface SourceReference {
  /** Identificador de la fuente en docs/12-fuentes-alfabeto-lsc.md */
  id: string;
  /** Ubicación exacta dentro de la fuente (página, minuto de video…). */
  locator: string;
}

export interface AnimationRef {
  /** Nombre del AnimationClip dentro del GLB (p. ej. "sign_A"). */
  clip: string;
  /** Archivo/paquete que contiene el clip. Permite cargar paquetes bajo demanda en fases futuras. */
  pack: string;
  /** Duración del tramo principal en ms a velocidad 1x (hold para estáticas, clip para dinámicas). */
  durationMs: number;
  /** Duración de la transición desde la seña anterior en ms a velocidad 1x. */
  transitionMs: number;
}

export interface SignEntry {
  /** ID estable y único: "lsc.letter.A", "lsc.word.CASA"… */
  id: string;
  kind: SignKind;
  /** Glosa (convención: mayúsculas). Para letras, la letra misma. */
  gloss: string;
  /** Nombre en español para mostrar ("a", "eñe"…). */
  name: string;
  language: 'LSC';
  animation: AnimationRef;
  handConfiguration: HandConfiguration;
  movement: SignMovement;
  description: string;
  sources: SourceReference[];
  validation: {
    status: ValidationStatus;
    reviewedBy?: string;
    reviewedAt?: string;
    notes?: string;
  };
  tags?: string[];
}
```

## `src/core/signs/alphabet.lsc.ts`

```ts
import type { SignEntry } from './types';

/**
 * Alfabeto manual LSC (27 letras) según el Anexo "Alfabeto manual" del
 * Diccionario Básico de la Lengua de Señas Colombiana (INSOR / Instituto Caro y Cuervo, 2006), p. 573.
 *
 * IMPORTANTE: las descripciones de `fingers` son una LECTURA de la ilustración
 * de la fuente, no una definición propia. Todas empiezan en estado `draft` y
 * deben ser validadas por una persona sorda usuaria de LSC o un intérprete
 * certificado antes de pasar a `approved`.
 */

const SOURCE_DBLSC = { id: 'dblsc-2006', locator: 'Anexos, Alfabeto manual, p. 573' };

const STATIC_HOLD_MS = 600;
const DYNAMIC_MS = 950;
const TRANSITION_MS = 250;

interface LetterSpec {
  letter: string;
  name: string;
  fingers: string;
  movement?: string;
}

const LETTERS: LetterSpec[] = [
  { letter: 'A', name: 'a', fingers: 'Puño cerrado; pulgar extendido y apoyado al costado del índice.' },
  { letter: 'B', name: 'be', fingers: 'Índice, medio, anular y meñique extendidos y juntos hacia arriba; pulgar doblado sobre la palma.' },
  { letter: 'C', name: 'ce', fingers: 'Dedos y pulgar curvados formando una "C", sin tocarse.' },
  { letter: 'D', name: 'de', fingers: 'Índice extendido hacia arriba; medio, anular y meñique curvados en contacto con el pulgar.' },
  { letter: 'E', name: 'e', fingers: 'Dedos flexionados con las puntas hacia la palma; pulgar doblado bajo ellos.' },
  { letter: 'F', name: 'efe', fingers: 'Índice extendido hacia arriba con el pulgar en contacto lateral; medio, anular y meñique cerrados. (Verificar.)' },
  { letter: 'G', name: 'ge', fingers: 'Mano cerrada con el índice extendido en diagonal. (Verificar posición del pulgar.)', movement: 'Flecha curva junto a la punta del índice: giro/flexión corta.' },
  { letter: 'H', name: 'hache', fingers: 'Índice y medio extendidos juntos en diagonal; pulgar sobre anular y meñique flexionados.', movement: 'Flecha diagonal: desplazamiento corto hacia abajo/adelante.' },
  { letter: 'I', name: 'i', fingers: 'Meñique extendido hacia arriba; demás dedos cerrados con el pulgar sobre ellos.' },
  { letter: 'J', name: 'jota', fingers: 'Configuración de la I (meñique extendido).', movement: 'El meñique traza una curva descendente en forma de "J".' },
  { letter: 'K', name: 'ka', fingers: 'Índice extendido hacia arriba, medio extendido hacia adelante, pulgar en contacto con el medio; anular y meñique cerrados.' },
  { letter: 'L', name: 'ele', fingers: 'Índice extendido hacia arriba y pulgar extendido en horizontal formando una "L"; demás dedos cerrados.' },
  { letter: 'M', name: 'eme', fingers: 'Puño con índice, medio y anular doblados sobre el pulgar.' },
  { letter: 'N', name: 'ene', fingers: 'Puño con índice y medio doblados sobre el pulgar.' },
  { letter: 'Ñ', name: 'eñe', fingers: 'Configuración de la N.', movement: 'Flecha doble: oscilación lateral de la muñeca.' },
  { letter: 'O', name: 'o', fingers: 'Todos los dedos curvados tocando la punta del pulgar, formando una "O".' },
  { letter: 'P', name: 'pe', fingers: 'Mano orientada hacia abajo: índice extendido hacia abajo, medio flexionado hacia adelante, pulgar entre ellos. (Verificar.)' },
  { letter: 'Q', name: 'cu', fingers: 'Puntas de todos los dedos reunidas con el pulgar, apuntando hacia arriba. (Verificar.)' },
  { letter: 'R', name: 'erre', fingers: 'Índice y medio extendidos y cruzados; anular y meñique cerrados con el pulgar.' },
  { letter: 'S', name: 'ese', fingers: 'Índice extendido, demás dedos cerrados. (Verificar si participa el medio.)', movement: 'Traza una "S" en el aire.' },
  { letter: 'T', name: 'te', fingers: 'Medio, anular y meñique extendidos hacia arriba; índice flexionado en contacto con el pulgar. (Verificar.)' },
  { letter: 'U', name: 'u', fingers: 'Dos dedos extendidos y separados con los intermedios flexionados (lectura: índice y meñique). (VERIFICAR.)' },
  { letter: 'V', name: 'uve', fingers: 'Índice y medio extendidos y separados en "V"; anular y meñique cerrados con el pulgar.' },
  { letter: 'W', name: 'uve doble', fingers: 'Índice, medio y anular extendidos y separados; el pulgar sujeta el meñique.' },
  { letter: 'X', name: 'equis', fingers: 'Índice flexionado en gancho; demás dedos cerrados.' },
  { letter: 'Y', name: 'ye', fingers: 'Pulgar y meñique extendidos; demás dedos cerrados.' },
  { letter: 'Z', name: 'zeta', fingers: 'Índice y medio extendidos juntos hacia arriba.', movement: 'Traza una "Z" en el aire.' },
];

export const LSC_ALPHABET: SignEntry[] = LETTERS.map(({ letter, name, fingers, movement }) => ({
  id: `lsc.letter.${letter}`,
  kind: 'letter',
  gloss: letter,
  name,
  language: 'LSC',
  animation: {
    // Nombres de clip solo ASCII para evitar problemas de codificación en Blender/glTF.
    clip: `sign_${letter === 'Ñ' ? 'ENYE' : letter}`,
    pack: 'avatar',
    durationMs: movement ? DYNAMIC_MS : STATIC_HOLD_MS,
    transitionMs: TRANSITION_MS,
  },
  handConfiguration: { handshape: letter, fingers, hand: 'dominant' },
  movement: { dynamic: Boolean(movement), description: movement },
  description: `Letra ${letter} del alfabeto manual LSC.`,
  sources: [SOURCE_DBLSC],
  validation: { status: 'draft' },
  tags: ['alfabeto', 'dactilologia'],
}));
```

## `src/core/signs/SignRepository.ts`

```ts
import type { SignEntry, SignKind } from './types';
import { LSC_ALPHABET } from './alphabet.lsc';

/**
 * Punto único de acceso al léxico. Hoy es un arreglo en memoria; en fases
 * futuras puede leer un JSON remoto o una API sin cambiar a quienes lo usan.
 */
export class SignRepository {
  private byKey = new Map<string, SignEntry>();

  constructor(entries: SignEntry[]) {
    for (const entry of entries) this.byKey.set(key(entry.kind, entry.gloss), entry);
  }

  find(kind: SignKind, gloss: string): SignEntry | undefined {
    return this.byKey.get(key(kind, gloss));
  }

  findLetter(letter: string): SignEntry | undefined {
    return this.find('letter', letter);
  }

  all(kind?: SignKind): SignEntry[] {
    const list = [...this.byKey.values()];
    return kind ? list.filter((e) => e.kind === kind) : list;
  }
}

function key(kind: SignKind, gloss: string) {
  return `${kind}:${gloss}`;
}

export const signRepository = new SignRepository(LSC_ALPHABET);
```

## `src/core/text/normalize.ts`

```ts
/**
 * Texto libre → tokens deletreables.
 *
 * Reglas del MVP (ver docs/11-manejo-caracteres-especiales.md):
 *  - Mayúsculas con locale "es".
 *  - Ñ se conserva como letra propia (se procesa ANTES de quitar diacríticos).
 *  - Vocales con tilde/diéresis → vocal base (Á→A, Ü→U). Otros diacríticos latinos también (Ç→C).
 *  - Espacios, guiones y barras → pausa de palabra.
 *  - , ; : → pausa corta.  . ! ? … → pausa de oración.  ¿ ¡ → se ignoran.
 *  - Dígitos → token "number" (sin animación en el MVP; se reportan).
 *  - Cualquier otro carácter → token "unsupported" (se omite y se reporta).
 */

export type PauseReason = 'word' | 'comma' | 'sentence';

export type Token =
  | { type: 'letter'; value: string; source: string; index: number; wordIndex: number }
  | { type: 'number'; value: string; source: string; index: number; wordIndex: number }
  | { type: 'pause'; reason: PauseReason }
  | { type: 'unsupported'; source: string; index: number };

export interface NormalizeOptions {
  maxChars?: number;
}

export interface NormalizeResult {
  tokens: Token[];
  /** Texto normalizado para mostrar, p. ej. "¿Cómo estás?" → "COMO ESTAS" */
  display: string;
  truncated: boolean;
}

const WORD_BREAK = /[\s\-–—/_]/u;
const COMMA_BREAK = /[,;:]/u;
const SENTENCE_BREAK = /[.!?…]/u;
const IGNORED = /[¿¡"'«»“”‘’()[\]{}]/u;
const PAUSE_RANK: Record<PauseReason, number> = { word: 1, comma: 2, sentence: 3 };

export function normalizeText(input: string, options: NormalizeOptions = {}): NormalizeResult {
  const maxChars = options.maxChars ?? 200;
  const chars = Array.from(input.trim());
  const truncated = chars.length > maxChars;
  const tokens: Token[] = [];
  let wordIndex = 0;
  let pendingPause: PauseReason | null = null;

  const pushPause = (reason: PauseReason) => {
    if (!pendingPause || PAUSE_RANK[reason] > PAUSE_RANK[pendingPause]) pendingPause = reason;
  };
  const flushPause = () => {
    if (pendingPause && tokens.some((t) => t.type === 'letter' || t.type === 'number')) {
      tokens.push({ type: 'pause', reason: pendingPause });
      wordIndex++;
    }
    pendingPause = null;
  };

  chars.slice(0, maxChars).forEach((source, index) => {
    const letter = toLetter(source);
    if (letter) {
      flushPause();
      tokens.push({ type: 'letter', value: letter, source, index, wordIndex });
    } else if (/^[0-9]$/.test(source)) {
      flushPause();
      tokens.push({ type: 'number', value: source, source, index, wordIndex });
    } else if (WORD_BREAK.test(source)) {
      pushPause('word');
    } else if (COMMA_BREAK.test(source)) {
      pushPause('comma');
    } else if (SENTENCE_BREAK.test(source)) {
      pushPause('sentence');
    } else if (!IGNORED.test(source)) {
      tokens.push({ type: 'unsupported', source, index });
    }
  });

  return { tokens, display: toDisplay(tokens), truncated };
}

/** Devuelve la letra del alfabeto (A–Z, Ñ) o null. */
export function toLetter(char: string): string | null {
  const lower = char.toLocaleLowerCase('es');
  if (lower === 'ñ') return 'Ñ';
  const base = lower.normalize('NFD').replace(/\p{M}/gu, '');
  return /^[a-z]$/.test(base) ? base.toUpperCase() : null;
}

function toDisplay(tokens: Token[]): string {
  return tokens
    .map((t) => (t.type === 'letter' || t.type === 'number' ? t.value : t.type === 'pause' ? ' ' : ''))
    .join('');
}
```

## `src/core/player/queue.ts`

```ts
import type { SignEntry } from '../signs/types';
import type { SignRepository } from '../signs/SignRepository';
import type { PauseReason, Token } from '../text/normalize';

export type QueueItem =
  | {
      id: string;
      kind: 'sign';
      label: string;
      sign: SignEntry;
      wordIndex: number;
      transitionMs: number;
      durationMs: number;
      /** Misma seña que la anterior sin pausa en medio (LL, RR, CC…). */
      isRepeat: boolean;
    }
  | {
      id: string;
      kind: 'pause';
      label: string;
      reason: PauseReason;
      wordIndex: number;
      transitionMs: number;
      durationMs: number;
    };

export interface BuildQueueResult {
  items: QueueItem[];
  /** Caracteres que no se pudieron deletrear (números, símbolos, letras sin seña). */
  skipped: string[];
}

export const PAUSE_MS: Record<PauseReason, number> = { word: 450, comma: 550, sentence: 850 };

/**
 * Tokens → cola de reproducción. En la Fase 2 este es el único punto donde
 * se inserta la búsqueda de palabras completas antes de caer al deletreo.
 */
export function buildQueue(tokens: Token[], repo: SignRepository): BuildQueueResult {
  const items: QueueItem[] = [];
  const skipped: string[] = [];
  let lastSign: SignEntry | null = null;

  tokens.forEach((token, i) => {
    if (token.type === 'letter') {
      const sign = repo.findLetter(token.value);
      if (!sign) {
        skipped.push(token.source);
        return;
      }
      items.push({
        id: `${i}-${sign.id}`,
        kind: 'sign',
        label: sign.gloss,
        sign,
        wordIndex: token.wordIndex,
        transitionMs: sign.animation.transitionMs,
        durationMs: sign.animation.durationMs,
        isRepeat: lastSign?.id === sign.id,
      });
      lastSign = sign;
    } else if (token.type === 'pause') {
      const prev = items[items.length - 1];
      items.push({
        id: `${i}-pause`,
        kind: 'pause',
        label: '·',
        reason: token.reason,
        wordIndex: prev?.wordIndex ?? 0,
        transitionMs: 0,
        durationMs: PAUSE_MS[token.reason],
      });
      lastSign = null;
    } else {
      skipped.push(token.source);
    }
  });

  return { items, skipped };
}
```

## `src/core/player/SignPlayer.ts`

```ts
import type { SignEntry } from '../signs/types';
import type { QueueItem } from './queue';

export type PlayerStatus = 'idle' | 'playing' | 'paused' | 'ended';

export const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2] as const;
export type Speed = (typeof SPEEDS)[number];

/** Estado discreto para la UI (cambia pocas veces por segundo). */
export interface PlayerSnapshot {
  status: PlayerStatus;
  items: readonly QueueItem[];
  index: number;
  speed: Speed;
  loop: boolean;
}

/** Estado continuo para el renderizador 3D (se lee en cada frame, no provoca renders de React). */
export interface PlaybackFrame {
  item: QueueItem;
  /** Seña desde la que se transiciona (null = pose de reposo). */
  from: SignEntry | null;
  /** Seña objetivo (null = pose de reposo). En pausas es la última seña mostrada. */
  to: SignEntry | null;
  isRepeat: boolean;
  /** 0..1 dentro de la transición. */
  transition: number;
  /** 0..1 dentro del tramo principal (hold o clip dinámico). */
  progress: number;
}

type Listener = () => void;

/**
 * Motor de reproducción independiente del framework y del motor 3D.
 * El tiempo lo controla el propio reproductor mediante `update(dtMs)`, lo que
 * hace triviales pausar, cambiar velocidad, saltar y probarlo sin navegador.
 */
export class SignPlayer {
  private items: QueueItem[] = [];
  private index = 0;
  private elapsedMs = 0;
  private status: PlayerStatus = 'idle';
  private speed: Speed = 1;
  private loop = false;
  private listeners = new Set<Listener>();
  private snapshot: PlayerSnapshot = this.buildSnapshot();

  // --- API pública -------------------------------------------------------

  load(items: QueueItem[]) {
    this.items = items;
    this.index = 0;
    this.elapsedMs = 0;
    this.status = 'idle';
    this.emit();
  }

  play() {
    if (this.items.length === 0) return;
    if (this.status === 'ended') this.rewind();
    this.status = 'playing';
    this.emit();
  }

  pause() {
    if (this.status !== 'playing') return;
    this.status = 'paused';
    this.emit();
  }

  togglePlay() {
    if (this.status === 'playing') this.pause();
    else this.play();
  }

  stop() {
    this.rewind();
    this.status = 'idle';
    this.emit();
  }

  restart() {
    this.rewind();
    this.play();
  }

  /**
   * Salta a un elemento de la cola. Mantiene el estado actual (si estaba pausado, sigue pausado).
   * Reproduciendo: arranca con la transición suave. Detenido: salta la transición para que
   * el avatar muestre de inmediato la seña elegida (si no, quedaría congelado en la anterior).
   */
  seek(index: number) {
    if (this.items.length === 0) return;
    this.index = clamp(index, 0, this.items.length - 1);
    this.elapsedMs = this.status === 'playing' ? 0 : this.items[this.index].transitionMs;
    if (this.status === 'ended' || this.status === 'idle') this.status = 'paused';
    this.emit();
  }

  next() {
    this.seek(this.index + 1);
  }

  prev() {
    this.seek(this.index - 1);
  }

  setSpeed(speed: Speed) {
    this.speed = speed;
    this.emit();
  }

  setLoop(loop: boolean) {
    this.loop = loop;
    this.emit();
  }

  /** Avanza el reloj. Llamar desde un bucle requestAnimationFrame. */
  update(dtMs: number) {
    if (this.status !== 'playing' || this.items.length === 0) return;
    this.elapsedMs += dtMs * this.speed;
    let changed = false;
    while (this.elapsedMs >= totalMs(this.items[this.index])) {
      this.elapsedMs -= totalMs(this.items[this.index]);
      if (this.index < this.items.length - 1) {
        this.index++;
      } else if (this.loop) {
        this.index = 0;
      } else {
        this.elapsedMs = totalMs(this.items[this.index]);
        this.status = 'ended';
        this.emit();
        return;
      }
      changed = true;
    }
    if (changed) this.emit();
  }

  /** Estado continuo; null cuando no hay nada que mostrar (reposo). */
  getFrame(): PlaybackFrame | null {
    if (this.status === 'idle' || this.items.length === 0) return null;
    const item = this.items[this.index];
    const from = this.lastSignBefore(this.index);
    const to = item.kind === 'sign' ? item.sign : from;
    const transition = item.transitionMs > 0 ? clamp(this.elapsedMs / item.transitionMs, 0, 1) : 1;
    const progress = clamp((this.elapsedMs - item.transitionMs) / item.durationMs, 0, 1);
    return { item, from, to, isRepeat: item.kind === 'sign' && item.isRepeat, transition, progress };
  }

  // --- Suscripción (compatible con useSyncExternalStore) -----------------

  subscribe = (listener: Listener) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getSnapshot = () => this.snapshot;

  // --- Internos ----------------------------------------------------------

  private rewind() {
    this.index = 0;
    this.elapsedMs = 0;
  }

  private lastSignBefore(index: number): SignEntry | null {
    for (let i = index - 1; i >= 0; i--) {
      const it = this.items[i];
      if (it.kind === 'sign') return it.sign;
    }
    return null;
  }

  private buildSnapshot(): PlayerSnapshot {
    return { status: this.status, items: this.items, index: this.index, speed: this.speed, loop: this.loop };
  }

  private emit() {
    this.snapshot = this.buildSnapshot();
    this.listeners.forEach((l) => l());
  }
}

function totalMs(item: QueueItem) {
  return item.transitionMs + item.durationMs;
}

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}
```

## `src/core/core.test.ts`

```ts
import { describe, expect, it } from 'vitest';
import { normalizeText } from './text/normalize';
import { buildQueue } from './player/queue';
import { SignPlayer } from './player/SignPlayer';
import { signRepository } from './signs/SignRepository';

const letters = (input: string) =>
  normalizeText(input)
    .tokens.map((t) => (t.type === 'letter' ? t.value : t.type === 'pause' ? '_' : t.type === 'number' ? `#${t.value}` : `?${t.source}`))
    .join('');

describe('normalizeText', () => {
  it('deletrea HOLA', () => expect(letters('hola')).toBe('HOLA'));
  it('quita tildes y diéresis pero conserva Ñ', () => expect(letters('Pingüino ñandú árbol')).toBe('PINGUINO_ÑANDU_ARBOL'));
  it('maneja signos de interrogación y espacios', () => {
    const r = normalizeText('¿Cómo estás?');
    expect(r.display).toBe('COMO ESTAS');
  });
  it('colapsa pausas y conserva la más fuerte', () => expect(letters('hola,   mundo. ¡sí!')).toBe('HOLA_MUNDO_SI'));
  it('reporta números y símbolos', () => expect(letters('casa 3 @')).toBe('CASA_#3?@'));
  it('limita la longitud', () => expect(normalizeText('a'.repeat(300)).truncated).toBe(true));
});

describe('buildQueue', () => {
  it('crea una seña por letra y marca repeticiones', () => {
    const { items, skipped } = buildQueue(normalizeText('calle 5').tokens, signRepository);
    expect(items.filter((i) => i.kind === 'sign').map((i) => i.label).join('')).toBe('CALLE');
    const repeats = items.filter((i) => i.kind === 'sign' && i.isRepeat).map((i) => i.label);
    expect(repeats).toEqual(['L']);
    expect(skipped).toEqual(['5']);
  });
  it('el alfabeto tiene 27 letras con clip', () => {
    expect(signRepository.all('letter')).toHaveLength(27);
    expect(signRepository.findLetter('Ñ')?.animation.clip).toBe('sign_ENYE');
  });
});

describe('SignPlayer', () => {
  const load = (text: string) => {
    const p = new SignPlayer();
    p.load(buildQueue(normalizeText(text).tokens, signRepository).items);
    return p;
  };
  const current = (p: SignPlayer) => p.getSnapshot().items[p.getSnapshot().index].label;

  it('reproduce en orden y termina', () => {
    const p = load('HOLA');
    p.play();
    const seen = [current(p)];
    for (let i = 0; i < 400; i++) {
      p.update(16);
      if (current(p) !== seen[seen.length - 1]) seen.push(current(p));
    }
    expect(seen.join('')).toBe('HOLA');
    expect(p.getSnapshot().status).toBe('ended');
  });

  it('pausa congela el tiempo', () => {
    const p = load('HOLA');
    p.play();
    p.pause();
    p.update(10_000);
    expect(current(p)).toBe('H');
  });

  it('la velocidad acorta la duración', () => {
    const slow = load('AB');
    const fast = load('AB');
    slow.setSpeed(0.5);
    fast.setSpeed(2);
    slow.play();
    fast.play();
    slow.update(900);
    fast.update(900);
    expect(current(slow)).toBe('A');
    expect(current(fast)).toBe('B');
  });

  it('seek, stop, restart y loop', () => {
    const p = load('HOLA');
    p.seek(2);
    expect(current(p)).toBe('L');
    expect(p.getSnapshot().status).toBe('paused');
    p.stop();
    expect(p.getFrame()).toBeNull();
    p.setLoop(true);
    p.restart();
    for (let i = 0; i < 400; i++) p.update(16);
    expect(p.getSnapshot().status).toBe('playing');
  });

  it('saltar a una letra en pausa muestra esa letra (sin quedarse en la transición)', () => {
    const p = load('LALA');
    p.play();
    p.pause();
    p.seek(2);
    const f = p.getFrame()!;
    expect(f.to?.gloss).toBe('L');
    expect(f.transition).toBe(1);
  });

  it('saltar mientras reproduce conserva la transición suave', () => {
    const p = load('LALA');
    p.play();
    p.seek(2);
    expect(p.getFrame()!.transition).toBe(0);
  });

  it('el frame de una pausa mantiene la última seña', () => {
    const p = load('A B');
    p.seek(1);
    const f = p.getFrame()!;
    expect(f.item.kind).toBe('pause');
    expect(f.to?.gloss).toBe('A');
  });
});
```

## `src/hooks/usePlayer.ts`

```ts
import { useEffect, useSyncExternalStore } from 'react';
import type { SignPlayer } from '../core/player/SignPlayer';

/** Suscribe un componente al estado discreto del reproductor. */
export function usePlayer(player: SignPlayer) {
  return useSyncExternalStore(player.subscribe, player.getSnapshot);
}

/** Único reloj de la app: avanza el reproductor en cada frame del navegador. */
export function usePlayerClock(player: SignPlayer) {
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      // Se limita dt para que un cambio de pestaña no salte varias letras de golpe.
      player.update(Math.min(now - last, 100));
      last = now;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [player]);
}
```

## `src/avatar/ClipDriver.ts`

```ts
import { AnimationAction, AnimationClip, AnimationMixer, LoopOnce, Object3D } from 'three';
import type { PlaybackFrame } from '../core/player/SignPlayer';
import type { SignEntry } from '../core/signs/types';

export const REST_CLIP = 'rest';

/**
 * Traduce un PlaybackFrame a pesos y tiempos de AnimationActions.
 * No avanza el tiempo por su cuenta: el SignPlayer es la única fuente de verdad.
 */
export class ClipDriver {
  private mixer: AnimationMixer;
  private actions = new Map<string, AnimationAction>();

  constructor(root: Object3D, clips: AnimationClip[]) {
    this.mixer = new AnimationMixer(root);
    for (const clip of clips) {
      const action = this.mixer.clipAction(clip);
      action.setLoop(LoopOnce, 1);
      action.clampWhenFinished = true;
      action.play();
      action.paused = true; // el tiempo lo fijamos manualmente
      action.setEffectiveWeight(0);
      this.actions.set(clip.name, action);
    }
  }

  has(clipName: string) {
    return this.actions.has(clipName);
  }

  missingClips(signs: SignEntry[]) {
    return signs.filter((s) => !this.has(s.animation.clip)).map((s) => s.gloss);
  }

  apply(frame: PlaybackFrame | null) {
    const weights = new Map<string, { weight: number; time: number }>();
    const set = (name: string, weight: number, progress: number) => {
      const action = this.actions.get(name) ?? this.actions.get(REST_CLIP);
      if (!action || weight <= 0) return;
      const key = action.getClip().name;
      const prev = weights.get(key);
      weights.set(key, { weight: (prev?.weight ?? 0) + weight, time: progress * action.getClip().duration });
    };

    if (!frame) {
      set(REST_CLIP, 1, 1);
    } else {
      const t = easeInOut(frame.transition);
      const fromClip = frame.from?.animation.clip ?? REST_CLIP;
      const toClip = frame.to?.animation.clip ?? REST_CLIP;
      if (frame.isRepeat) {
        // Letra repetida: pequeña "re-articulación" pasando cerca del reposo.
        const dip = Math.sin(Math.PI * t) * 0.5;
        set(REST_CLIP, dip, 1);
        set(toClip, 1 - dip, frame.progress);
      } else {
        set(fromClip, 1 - t, 1);
        set(toClip, t, frame.item.kind === 'pause' ? 1 : frame.progress);
      }
    }

    for (const [name, action] of this.actions) {
      const w = weights.get(name);
      action.setEffectiveWeight(w?.weight ?? 0);
      if (w) action.time = w.time;
    }
    this.mixer.update(0);
  }

  dispose() {
    this.mixer.stopAllAction();
    this.mixer.uncacheRoot(this.mixer.getRoot());
    this.actions.clear();
  }
}

function easeInOut(x: number) {
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}
```

## `src/avatar/Avatar3D.tsx`

```tsx
import { Component, Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, OrbitControls, useGLTF } from '@react-three/drei';
import { Box3, Vector3, type Object3D } from 'three';
import type { SignPlayer } from '../core/player/SignPlayer';
import { signRepository } from '../core/signs/SignRepository';
import { ClipDriver } from './ClipDriver';
import { AvatarPlaceholder } from './AvatarPlaceholder';

const MODEL_URL = '/models/avatar.glb';

interface Props {
  player: SignPlayer;
  onMissingClips?: (letters: string[]) => void;
}

export function Avatar3D({ player, onMissingClips }: Props) {
  const modelAvailable = useModelAvailable(MODEL_URL);

  if (modelAvailable === null) return <div className="stage stage--loading">Cargando avatar…</div>;
  if (!modelAvailable) return <AvatarPlaceholder player={player} reason="No se encontró /models/avatar.glb" />;

  return (
    <div className="stage">
      <ModelErrorBoundary fallback={<AvatarPlaceholder player={player} reason="Error al cargar el avatar" />}>
        <Canvas camera={{ position: [0, 1.4, 1.35], fov: 30 }} dpr={[1, 2]}>
          <color attach="background" args={['#e9ecef']} />
          <hemisphereLight args={['#ffffff', '#8a8f98', 1.2]} />
          <directionalLight position={[1.5, 2.5, 2]} intensity={1.6} />
          <directionalLight position={[-2, 2, -1]} intensity={0.6} />
          <Suspense fallback={null}>
            <AvatarModel player={player} onMissingClips={onMissingClips} />
            <ContactShadows position={[0, 0, 0]} opacity={0.35} blur={2.5} far={2} />
          </Suspense>
          <OrbitControls target={[0, 1.3, 0]} enablePan={false} minDistance={0.8} maxDistance={3} />
        </Canvas>
      </ModelErrorBoundary>
    </div>
  );
}

function AvatarModel({ player, onMissingClips }: Props) {
  const { scene, animations } = useGLTF(MODEL_URL);
  const driverRef = useRef<ClipDriver | null>(null);
  const scale = useMemo(() => normalizeHeight(scene), [scene]);

  // El driver se crea dentro del efecto: en StrictMode (desarrollo) React monta,
  // limpia y vuelve a montar, y cada montaje necesita su propio AnimationMixer.
  useEffect(() => {
    const driver = new ClipDriver(scene, animations);
    driverRef.current = driver;
    onMissingClips?.(driver.missingClips(signRepository.all('letter')));
    return () => {
      driver.dispose();
      driverRef.current = null;
    };
  }, [scene, animations, onMissingClips]);

  // El reloj lo avanza usePlayerClock; aquí solo se muestrea el estado.
  useFrame(() => driverRef.current?.apply(player.getFrame()));

  return (
    <group scale={scale}>
      <primitive object={scene} />
    </group>
  );
}

/** Escala cualquier avatar a ~1.75 m. Lo ideal es corregir la escala en Blender; esto es una red de seguridad. */
function normalizeHeight(scene: Object3D, targetHeight = 1.75) {
  const height = new Box3().setFromObject(scene).getSize(new Vector3()).y;
  return height > 0 ? targetHeight / height : 1;
}

/** Vite devuelve index.html (200) para rutas inexistentes, así que se valida el content-type. */
function useModelAvailable(url: string) {
  const [available, setAvailable] = useState<boolean | null>(null);
  useEffect(() => {
    let cancelled = false;
    fetch(url, { method: 'HEAD' })
      .then((r) => r.ok && !(r.headers.get('content-type') ?? '').includes('text/html'))
      .catch(() => false)
      .then((ok) => !cancelled && setAvailable(ok));
    return () => {
      cancelled = true;
    };
  }, [url]);
  return available;
}

class ModelErrorBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
```

## `src/avatar/AvatarPlaceholder.tsx`

```tsx
import type { SignPlayer } from '../core/player/SignPlayer';
import { usePlayer } from '../hooks/usePlayer';

/**
 * Sustituto del avatar mientras no exista el GLB. Permite desarrollar y
 * probar todo el flujo (texto, voz, cola, controles) desde el día 1.
 */
export function AvatarPlaceholder({ player, reason }: { player: SignPlayer; reason: string }) {
  const { items, index, status } = usePlayer(player);
  const item = status === 'idle' ? undefined : items[index];
  const sign = item?.kind === 'sign' ? item.sign : undefined;

  return (
    <div className="stage stage--placeholder" role="img" aria-label={sign ? `Letra ${sign.gloss}` : 'Avatar en reposo'}>
      <span className="placeholder__letter">{sign?.gloss ?? (item ? '·' : '🧍')}</span>
      {sign && <p className="placeholder__desc">{sign.handConfiguration.fingers}</p>}
      {sign?.movement.dynamic && <p className="placeholder__move">Movimiento: {sign.movement.description}</p>}
      <p className="placeholder__note">{reason} — modo de vista previa sin 3D</p>
    </div>
  );
}
```

## `src/speech/speechToText.ts`

```ts
/**
 * Abstracción de voz → texto. El MVP usa la Web Speech API del navegador;
 * se puede añadir otro proveedor (Whisper en el navegador, API en la nube)
 * implementando la misma interfaz.
 */
export interface SpeechCallbacks {
  onInterim?: (text: string) => void;
  onFinal: (text: string) => void;
  onError?: (error: string) => void;
  onEnd?: () => void;
}

export interface SpeechToTextProvider {
  readonly name: string;
  isSupported(): boolean;
  /** Empieza a escuchar; devuelve una función para detener. */
  start(lang: string, callbacks: SpeechCallbacks): () => void;
}

// Tipos mínimos: la Web Speech API no está en lib.dom de TypeScript.
interface RecognitionResultList {
  length: number;
  [i: number]: { isFinal: boolean; 0: { transcript: string } };
}
interface Recognition {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  onresult: ((e: { resultIndex: number; results: RecognitionResultList }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}
type RecognitionCtor = new () => Recognition;

function getCtor(): RecognitionCtor | undefined {
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
}

export const webSpeechProvider: SpeechToTextProvider = {
  name: 'Web Speech API',
  isSupported: () => typeof window !== 'undefined' && Boolean(getCtor()),
  start(lang, { onInterim, onFinal, onError, onEnd }) {
    const Ctor = getCtor();
    if (!Ctor) {
      onError?.('not-supported');
      return () => {};
    }
    const rec = new Ctor();
    rec.lang = lang;
    rec.interimResults = true;
    rec.continuous = false;
    rec.maxAlternatives = 1;
    rec.onresult = (e) => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) onFinal(r[0].transcript.trim());
        else interim += r[0].transcript;
      }
      if (interim) onInterim?.(interim);
    };
    rec.onerror = (e) => onError?.(e.error);
    rec.onend = () => onEnd?.();
    rec.start();
    return () => rec.stop();
  },
};
```

## `src/ui/SpeechButton.tsx`

```tsx
import { useRef, useState } from 'react';
import { webSpeechProvider, type SpeechToTextProvider } from '../speech/speechToText';

interface Props {
  onResult: (text: string) => void;
  provider?: SpeechToTextProvider;
}

const ERRORS: Record<string, string> = {
  'not-allowed': 'Permiso de micrófono denegado.',
  'no-speech': 'No se detectó voz. Intenta de nuevo.',
  network: 'El reconocimiento de voz necesita conexión a internet.',
  'not-supported': 'Tu navegador no soporta reconocimiento de voz.',
};

export function SpeechButton({ onResult, provider = webSpeechProvider }: Props) {
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState('');
  const [error, setError] = useState<string | null>(null);
  const stopRef = useRef<() => void>(() => {});
  const supported = provider.isSupported();

  const toggle = () => {
    if (listening) {
      stopRef.current();
      return;
    }
    setError(null);
    setInterim('');
    setListening(true);
    stopRef.current = provider.start('es-CO', {
      onInterim: setInterim,
      onFinal: (text) => {
        setInterim('');
        onResult(text);
      },
      onError: (code) => setError(ERRORS[code] ?? `Error de voz: ${code}`),
      onEnd: () => setListening(false),
    });
  };

  if (!supported) {
    return (
      <p className="speech__unsupported">
        🎤 Voz no disponible en este navegador (p. ej. Firefox). Usa Chrome o Edge, o escribe el texto.
      </p>
    );
  }

  return (
    <div className="speech">
      <button type="button" className={`btn ${listening ? 'btn--recording' : ''}`} onClick={toggle} aria-pressed={listening}>
        {listening ? '⏺ Escuchando… (toca para detener)' : '🎤 Hablar'}
      </button>
      {interim && <span className="speech__interim">“{interim}”</span>}
      {error && <span className="speech__error" role="alert">{error}</span>}
    </div>
  );
}
```

## `src/ui/PlayerControls.tsx`

```tsx
import { SPEEDS, type SignPlayer } from '../core/player/SignPlayer';
import { usePlayer } from '../hooks/usePlayer';

export function PlayerControls({ player }: { player: SignPlayer }) {
  const { status, items, speed, loop } = usePlayer(player);
  const empty = items.length === 0;
  const playing = status === 'playing';

  return (
    <div className="controls">
      <div className="controls__main" role="group" aria-label="Controles de reproducción">
        <button type="button" className="btn" onClick={() => player.restart()} disabled={empty} title="Reiniciar (R)">
          ↶ Reiniciar
        </button>
        <button type="button" className="btn" onClick={() => player.prev()} disabled={empty} title="Letra anterior (←)" aria-label="Letra anterior">
          ⏮
        </button>
        <button type="button" className="btn btn--primary" onClick={() => player.togglePlay()} disabled={empty} title="Reproducir / Pausar (Espacio)">
          {playing ? '⏸ Pausar' : status === 'paused' ? '▶ Continuar' : '▶ Reproducir'}
        </button>
        <button type="button" className="btn" onClick={() => player.next()} disabled={empty} title="Letra siguiente (→)" aria-label="Letra siguiente">
          ⏭
        </button>
        <button type="button" className="btn" onClick={() => player.stop()} disabled={empty || status === 'idle'} title="Detener">
          ⏹ Detener
        </button>
        <button type="button" className={`btn ${loop ? 'btn--active' : ''}`} onClick={() => player.setLoop(!loop)} aria-pressed={loop} title="Repetir la palabra">
          🔁 Repetir
        </button>
      </div>
      <div className="controls__speed" role="radiogroup" aria-label="Velocidad">
        <span>Velocidad:</span>
        {SPEEDS.map((s) => (
          <button
            key={s}
            type="button"
            role="radio"
            aria-checked={s === speed}
            className={`chip ${s === speed ? 'chip--active' : ''}`}
            onClick={() => player.setSpeed(s)}
          >
            {s}x
          </button>
        ))}
      </div>
    </div>
  );
}
```

## `src/ui/LetterTimeline.tsx`

```tsx
import type { SignPlayer } from '../core/player/SignPlayer';
import { usePlayer } from '../hooks/usePlayer';

/** Muestra H → O → L → A, resalta la letra actual y permite saltar a cualquiera. */
export function LetterTimeline({ player, missing }: { player: SignPlayer; missing: string[] }) {
  const { items, index, status } = usePlayer(player);
  if (items.length === 0) return null;

  const signs = items.filter((i) => i.kind === 'sign');
  const current = items[index];
  const position = items.slice(0, index + 1).filter((i) => i.kind === 'sign').length;
  const active = status !== 'idle';

  return (
    <section className="timeline" aria-label="Progreso del deletreo">
      <div className="timeline__status" aria-live="polite">
        <span>
          Letra actual: <strong>{active && current.kind === 'sign' ? current.label : '—'}</strong>
        </span>
        <span>
          {active ? position : 0} / {signs.length}
        </span>
      </div>
      <ol className="timeline__chips">
        {items.map((item, i) =>
          item.kind === 'pause' ? (
            <li key={item.id} className="timeline__gap" aria-hidden="true" />
          ) : (
            <li key={item.id}>
              <button
                type="button"
                className={[
                  'chip',
                  'chip--letter',
                  active && i === index ? 'chip--current' : '',
                  active && i < index ? 'chip--done' : '',
                  missing.includes(item.label) ? 'chip--missing' : '',
                ].join(' ')}
                onClick={() => player.seek(i)}
                aria-current={active && i === index ? 'step' : undefined}
                title={missing.includes(item.label) ? 'Animación pendiente' : `Ir a ${item.label}`}
              >
                {item.label}
              </button>
            </li>
          ),
        )}
      </ol>
    </section>
  );
}
```

## `src/App.tsx`

```tsx
import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { SignPlayer } from './core/player/SignPlayer';
import { buildQueue } from './core/player/queue';
import { signRepository } from './core/signs/SignRepository';
import { normalizeText } from './core/text/normalize';
import { Avatar3D } from './avatar/Avatar3D';
import { usePlayerClock } from './hooks/usePlayer';
import { PlayerControls } from './ui/PlayerControls';
import { LetterTimeline } from './ui/LetterTimeline';
import { SpeechButton } from './ui/SpeechButton';

export default function App() {
  const player = useMemo(() => new SignPlayer(), []);
  const [text, setText] = useState('');
  const [display, setDisplay] = useState('');
  const [skipped, setSkipped] = useState<string[]>([]);
  const [missing, setMissing] = useState<string[]>([]);
  usePlayerClock(player);

  const spell = useCallback(
    (input: string) => {
      const { tokens, display, truncated } = normalizeText(input);
      const queue = buildQueue(tokens, signRepository);
      setDisplay(display + (truncated ? '…' : ''));
      setSkipped([...new Set(queue.skipped)]);
      player.load(queue.items);
      player.play();
    },
    [player],
  );

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    spell(text);
  };

  const onSpeech = (spoken: string) => {
    setText(spoken);
    spell(spoken);
  };

  useKeyboardShortcuts(player);

  return (
    <main className="app">
      <header className="app__header">
        <h1>NexoLSC</h1>
        <p>Deletreador en Lengua de Señas Colombiana</p>
      </header>

      <form className="input" onSubmit={onSubmit}>
        <label htmlFor="text">Escribe una palabra o frase</label>
        <div className="input__row">
          <input
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Escribe una palabra o frase…"
            maxLength={200}
            autoComplete="off"
          />
          <button type="submit" className="btn btn--primary" disabled={!text.trim()}>
            ▶ Reproducir
          </button>
        </div>
        <SpeechButton onResult={onSpeech} />
        {display && (
          <p className="input__normalized">
            Se deletreará: <strong>{display}</strong>
          </p>
        )}
        {skipped.length > 0 && (
          <p className="input__warning" role="status">
            Omitidos (sin seña en el MVP): {skipped.join(' ')}
          </p>
        )}
      </form>

      <Avatar3D player={player} onMissingClips={setMissing} />
      <LetterTimeline player={player} missing={missing} />
      <PlayerControls player={player} />

      <footer className="app__footer">
        Configuraciones basadas en el Diccionario Básico de la LSC (INSOR – Instituto Caro y Cuervo, 2006).
        Animaciones en validación con la comunidad sorda.
      </footer>
    </main>
  );
}

function useKeyboardShortcuts(player: SignPlayer) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLButtonElement) return;
      if (e.key === ' ') {
        e.preventDefault();
        player.togglePlay();
      } else if (e.key === 'ArrowRight') player.next();
      else if (e.key === 'ArrowLeft') player.prev();
      else if (e.key.toLowerCase() === 'r') player.restart();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [player]);
}
```

## `src/main.tsx`

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

## `src/styles.css`

```css
:root {
  --bg: #f6f7f9;
  --surface: #ffffff;
  --stage: #e9ecef;
  --text: #1d2330;
  --muted: #5d6677;
  --primary: #1f6feb;
  --primary-text: #ffffff;
  --accent: #f59f00;
  --border: #d9dde4;
  --danger: #c92a2a;
  --radius: 14px;
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  color: var(--text);
  background: var(--bg);
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #11151c;
    --surface: #1a2029;
    --stage: #232a35;
    --text: #e8ecf2;
    --muted: #9aa4b5;
    --border: #2f3847;
  }
}

* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); }

.app { max-width: 880px; margin: 0 auto; padding: 16px; display: grid; gap: 16px; }
.app__header h1 { margin: 0; font-size: 1.6rem; }
.app__header p { margin: 4px 0 0; color: var(--muted); }
.app__footer { font-size: 0.8rem; color: var(--muted); text-align: center; }

.input { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 16px; display: grid; gap: 10px; }
.input label { font-weight: 600; }
.input__row { display: flex; gap: 8px; }
.input__row input { flex: 1; min-width: 0; font-size: 1.25rem; padding: 10px 12px; border-radius: 10px; border: 1px solid var(--border); background: var(--bg); color: var(--text); }
.input__normalized { margin: 0; color: var(--muted); letter-spacing: 0.08em; }
.input__warning { margin: 0; color: var(--danger); font-size: 0.9rem; }

.btn { font: inherit; padding: 10px 14px; border-radius: 10px; border: 1px solid var(--border); background: var(--surface); color: var(--text); cursor: pointer; }
.btn:disabled { opacity: 0.45; cursor: not-allowed; }
.btn:focus-visible, .chip:focus-visible { outline: 3px solid var(--accent); outline-offset: 2px; }
.btn--primary { background: var(--primary); color: var(--primary-text); border-color: var(--primary); font-weight: 600; }
.btn--active { border-color: var(--primary); color: var(--primary); }
.btn--recording { background: var(--danger); color: #fff; border-color: var(--danger); }

.speech { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
.speech__interim { color: var(--muted); font-style: italic; }
.speech__error, .speech__unsupported { color: var(--danger); margin: 0; font-size: 0.9rem; }

.stage { height: min(60vh, 520px); border-radius: var(--radius); overflow: hidden; background: var(--stage); border: 1px solid var(--border); }
.stage--loading { display: grid; place-items: center; color: var(--muted); }
.stage--placeholder { display: grid; place-content: center; justify-items: center; text-align: center; padding: 16px; gap: 6px; }
.placeholder__letter { font-size: clamp(5rem, 18vw, 9rem); font-weight: 800; line-height: 1; }
.placeholder__desc { max-width: 46ch; margin: 0; }
.placeholder__move { margin: 0; color: var(--primary); }
.placeholder__note { margin: 8px 0 0; font-size: 0.8rem; color: var(--muted); }

.timeline { display: grid; gap: 8px; }
.timeline__status { display: flex; justify-content: space-between; font-size: 1.1rem; }
.timeline__chips { list-style: none; display: flex; flex-wrap: wrap; gap: 6px; margin: 0; padding: 0; align-items: center; }
.timeline__gap { width: 14px; }

.chip { font: inherit; border: 1px solid var(--border); background: var(--surface); color: var(--text); border-radius: 999px; padding: 6px 12px; cursor: pointer; }
.chip--active { background: var(--primary); border-color: var(--primary); color: var(--primary-text); }
.chip--letter { min-width: 42px; font-size: 1.15rem; font-weight: 700; border-radius: 10px; }
.chip--done { opacity: 0.55; }
.chip--current { background: var(--accent); border-color: var(--accent); color: #1d2330; transform: scale(1.12); }
.chip--missing { border-style: dashed; }

.controls { display: grid; gap: 12px; }
.controls__main, .controls__speed { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; justify-content: center; }
.controls__speed span { color: var(--muted); }

@media (prefers-reduced-motion: reduce) {
  .chip--current { transform: none; }
}
```

## `tools/blender/export_avatar.py`

```python
"""
Prepara y exporta el avatar de NexoLSC a GLB con un AnimationClip por seña.

Uso (sin abrir la interfaz de Blender):
  blender -b assets-src/avatar/avatar.blend --python tools/blender/export_avatar.py -- public/models/avatar.glb

Qué hace:
  1. Deja UNA sola armadura deformando la malla (quita modificadores Armature extra).
  2. Elimina grupos de vértices que no pertenecen a huesos de deformación (DEF-*).
  3. Exporta solo huesos de deformación, con muestreo de animación (hornea las
     restricciones de Rigify) y una animación glTF por cada Action "rest" / "idle" / "sign_*".
  4. Lista los clips exportados para verificar.

No guarda cambios en el .blend: trabaja sobre la sesión en memoria.
"""
import bpy
import sys

RIG_NAME = 'rig'
CLIP_PREFIXES = ('rest', 'idle', 'sign_')

argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
out_path = argv[0] if argv else '//avatar.glb'

rig = bpy.data.objects[RIG_NAME]
meshes = [o for o in bpy.data.objects if o.type == 'MESH' and o.parent == rig]

# 1. Una sola armadura por malla (glTF admite un solo skin por malla).
for o in meshes:
    for m in list(o.modifiers):
        if m.type == 'ARMATURE' and m.object != rig:
            print(f'[limpieza] {o.name}: quitando modificador {m.name} -> {m.object.name if m.object else None}')
            o.modifiers.remove(m)

# 2. Grupos de vértices sin hueso de deformación.
deform = {b.name for b in rig.data.bones if b.use_deform}
for o in meshes:
    for vg in list(o.vertex_groups):
        if vg.name not in deform:
            o.vertex_groups.remove(vg)

# 3. Solo exportar las acciones de señas. El modo ACTIONS exporta toda acción
#    compatible con la armadura, así que las demás se eliminan de la sesión
#    (el .blend en disco no se modifica porque este script nunca guarda).
if rig.animation_data:
    rig.animation_data.action = None
for a in list(bpy.data.actions):
    if not a.name.startswith(CLIP_PREFIXES):
        print(f'[limpieza] excluyendo acción {a.name}')
        bpy.data.actions.remove(a)
clips = list(bpy.data.actions)
if not clips:
    raise SystemExit('No hay acciones rest/idle/sign_* para exportar')

bpy.ops.object.select_all(action='DESELECT')
for o in [rig, *meshes]:
    o.select_set(True)
bpy.context.view_layer.objects.active = rig

bpy.ops.export_scene.gltf(
    filepath=bpy.path.abspath(out_path),
    export_format='GLB',
    use_selection=True,
    export_def_bones=True,            # solo huesos DEF-* (no controles MCH/ORG de Rigify)
    export_animation_mode='ACTIONS',  # una animación glTF por Action
    export_force_sampling=True,       # hornea restricciones de Rigify a los huesos DEF
    export_optimize_animation_size=True,
    export_image_format='JPEG',
)

print(f'[ok] {out_path}')
print('[clips]', sorted(a.name for a in clips))
```

## `tools/blender/pose_helpers.py`

```python
"""
Funciones para posar el rig Rigify por script (ver docs/06-animation-clips.md).

Uso dentro de Blender (Scripting → Run Script) o importándolo desde otro script.
Las poses generadas son un punto de partida: siempre se revisan contra la fuente
(DBLSC p. 573) y se validan con personas sordas usuarias de LSC.
"""
import bpy
import math
from mathutils import Vector, Quaternion

rig = bpy.data.objects['rig']
pb = rig.pose.bones


def upd():
    bpy.context.view_layer.update()


def reset():
    """Vuelve todos los huesos a la pose de descanso del rig."""
    for b in pb:
        b.location = (0, 0, 0)
        if b.rotation_mode == 'QUATERNION':
            b.rotation_quaternion = (1, 0, 0, 0)
        else:
            b.rotation_euler = (0, 0, 0)
    upd()


def rot_world(name, axis, deg):
    """Rota el hueso alrededor de un eje en espacio de armadura, respetando la pose actual."""
    b = pb[name]
    upd()
    axis_local = (b.matrix.to_3x3().inverted() @ Vector(axis)).normalized()
    q = Quaternion(axis_local, math.radians(deg))
    if b.rotation_mode == 'QUATERNION':
        b.rotation_quaternion = b.rotation_quaternion @ q
    else:
        b.rotation_euler = (b.rotation_euler.to_quaternion() @ q).to_euler(b.rotation_mode)
    upd()


def aim(name, direction):
    """Apunta el eje Y del hueso (su largo) hacia una dirección en espacio de armadura."""
    b = pb[name]
    upd()
    cur = b.matrix.to_3x3() @ Vector((0, 1, 0))
    d = Vector(direction).normalized()
    axis = cur.cross(d)
    if axis.length > 1e-6:
        rot_world(name, axis.normalized(), math.degrees(cur.angle(d)))


def curl(finger, deg, side='R'):
    """Flexiona las 3 falanges de un dedo (X local positivo = cerrar)."""
    for i, k in enumerate(['01', '02', '03']):
        b = pb[f'{finger}.{k}.{side}']
        b.rotation_quaternion = b.rotation_quaternion @ Quaternion((1, 0, 0), math.radians(deg * (0.8 if i == 0 else 1.0)))
    upd()


def arm_signing_space():
    """Mano derecha a la altura del hombro, palma al frente; brazo izquierdo relajado."""
    aim('upper_arm_fk.L', (0.15, 0.05, -1))
    aim('forearm_fk.L', (0.05, -0.1, -1))
    aim('upper_arm_fk.R', (-0.35, -0.25, -0.9))
    aim('forearm_fk.R', (0.1, -0.35, 0.93))
    aim('hand_fk.R', (0.0, -0.1, 1))


def key_action(action_name, frame=1):
    """Crea una Action con Fake User y guarda la pose actual en el fotograma indicado."""
    act = bpy.data.actions.new(action_name)
    act.use_fake_user = True
    rig.animation_data_create()
    rig.animation_data.action = act
    for b in pb:
        b.keyframe_insert('rotation_quaternion' if b.rotation_mode == 'QUATERNION' else 'rotation_euler', frame=frame)
        b.keyframe_insert('location', frame=frame)
    return act
```
