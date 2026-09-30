# 15 · Código

> El proyecto ya está creado en la raíz de NexoLSC (`src/`, `public/`, `tools/`, `assets-src/`).
> Este documento es la referencia legible de ese código; si difieren, manda el código.

Código **probado** el 2026-09-30 (v0.2.x):

- `npm test` → 15 pruebas en verde (Vitest 5).
- `npm run build` → compila sin errores (TypeScript 7 + Vite 8).
- En el navegador: selector con los candidatos de avatar (`mpfb2-caricatura` por defecto, `mpfb2` y el
  de prueba local), las 27 letras con clip, fondo del SENA desenfocado; al saltar a una letra en pausa se
  muestra esa letra. Sin errores en consola.
- Scripts de Blender (`mpfb_builder.py`, `bake_letters.py`, `export_avatar.py`) probados con Blender 5.2
  y MPFB 2.0.17.

## Cómo ejecutarlo

Requisitos: Node.js 20+ (probado con Node 24) y Blender 5.x para exportar avatares.

```bash
npm install
```

```bash
npm test
```

```bash
npm run dev
```

Abre http://localhost:5173. Para generar o añadir avatares, ver `assets-src/README.md`. Por ejemplo:

```bash
blender -b assets-src/avatars/mpfb2/avatar.blend --python tools/blender/export_avatar.py -- public/models/avatars/mpfb2.glb
```

## Mapa de archivos

| Archivo | Rol |
|---|---|
| `src/core/signs/*` | Modelo de datos y léxico (27 letras) |
| `src/core/text/normalize.ts` | Texto → tokens (tildes, Ñ, pausas, números, no soportados) |
| `src/core/player/queue.ts` | Tokens → cola de reproducción ("AnimationQueue") |
| `src/core/player/SignPlayer.ts` | Motor: estados, reloj, velocidad, saltos, bucle |
| `src/avatar/avatars.ts` + `src/hooks/useAvatarChoice.ts` | Candidatos de avatar y elección del usuario |
| `src/avatar/ClipDriver.ts` | Estado del motor → mezcla de AnimationClips |
| `src/avatar/Avatar3D.tsx` | Escena R3F y carga del GLB |
| `src/speech/speechToText.ts` | Interfaz de voz + Web Speech API |
| `src/ui/*` | Selector de avatar, controles, línea de tiempo, micrófono, logo e íconos de la marca |
| `tools/blender/*` | Exportación del GLB y ayudas para posar por script |
| `assets-src/avatars/mpfb2/build_avatar.py` | Genera el candidato MPFB2 (CC0) de forma reproducible |

---

## `package.json`

```json
{
  "name": "nexolsc",
  "private": true,
  "version": "0.3.0",
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
    <meta name="theme-color" content="#0b6b4f" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;700;800&family=Atkinson+Hyperlegible:wght@400;700&display=swap"
    />
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
tsconfig.tsbuildinfo
__pycache__/

# Documentos de gestión personales (no se publican)
*.xlsx

# Avatar de prueba con derechos de terceros (Miles Morales, Marvel/Sony):
# solo para desarrollo local, nunca en el repositorio público.
assets-src/avatars/miles-prueba/
public/models/avatars/miles-prueba.glb

# Los candidatos con licencia libre (p. ej. assets-src/avatars/mpfb2/, CC0) sí se versionan.
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

## `src/hooks/useAvatarChoice.ts`

```ts
import { useEffect, useState } from 'react';
import { AVATARS, DEFAULT_AVATAR_ID, isModelAvailable, type AvatarOption } from '../avatar/avatars';

const STORAGE_KEY = 'nexolsc.avatar';

export interface AvatarChoice {
  /** null mientras se comprueba qué GLB existen. */
  available: Record<string, boolean> | null;
  /** Avatar en uso; null si no hay ninguno disponible. */
  selected: AvatarOption | null;
  select: (id: string) => void;
}

/** Comprueba qué candidatos tienen GLB y recuerda la elección del usuario en este navegador. */
export function useAvatarChoice(): AvatarChoice {
  const [available, setAvailable] = useState<Record<string, boolean> | null>(null);
  const [chosenId, setChosenId] = useState<string | null>(() => readStored());

  useEffect(() => {
    let cancelled = false;
    Promise.all(AVATARS.map(async (a) => [a.id, await isModelAvailable(a.url)] as const)).then((entries) => {
      if (!cancelled) setAvailable(Object.fromEntries(entries));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const selected = available ? pickAvailable(available, chosenId) : null;

  const select = (id: string) => {
    setChosenId(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // Almacenamiento bloqueado (modo privado, etc.): la elección vale solo para esta sesión.
    }
  };

  return { available, selected, select };
}

function pickAvailable(available: Record<string, boolean>, chosenId: string | null): AvatarOption | null {
  const order = [chosenId, DEFAULT_AVATAR_ID, ...AVATARS.map((a) => a.id)];
  const id = order.find((candidate) => candidate && available[candidate]);
  return AVATARS.find((a) => a.id === id) ?? null;
}

function readStored(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}
```

## `src/avatar/avatars.ts`

```ts
/**
 * Candidatos de avatar para comparar. Cada uno es un GLB con el mismo contrato:
 * esqueleto Rigify (huesos DEF-*) y clips "rest" + "sign_*".
 * Fuentes y scripts de cada candidato: assets-src/avatars/<id>/
 */
export interface AvatarOption {
  id: string;
  name: string;
  url: string;
  license: string;
  /** false = no puede publicarse (solo desarrollo local; su GLB está en .gitignore). */
  publishable: boolean;
}

export const AVATARS: AvatarOption[] = [
  {
    id: 'mpfb2-caricatura',
    name: 'MPFB2 · caricatura',
    url: '/models/avatars/mpfb2-caricatura.glb',
    license: 'CC0 (MakeHuman / MPFB2)',
    publishable: true,
  },
  {
    id: 'mpfb2',
    name: 'MPFB2 · hombre joven',
    url: '/models/avatars/mpfb2.glb',
    license: 'CC0 (MakeHuman / MPFB2)',
    publishable: true,
  },
  {
    id: 'miles-prueba',
    name: 'Prueba de pipeline (solo local)',
    url: '/models/avatars/miles-prueba.glb',
    license: 'Derechos de terceros — no publicar',
    publishable: false,
  },
];

export const DEFAULT_AVATAR_ID = 'mpfb2-caricatura';

/**
 * ¿Existe el GLB? Vite (y muchos hostings SPA) responden index.html con 200 para
 * rutas inexistentes, así que además del estado se valida que no sea HTML.
 */
export async function isModelAvailable(url: string): Promise<boolean> {
  try {
    const r = await fetch(url, { method: 'HEAD' });
    return r.ok && !(r.headers.get('content-type') ?? '').includes('text/html');
  } catch {
    return false;
  }
}
```

## `src/avatar/stage.ts`

```ts
/**
 * Fondo del escenario del avatar.
 *
 * La imagen se muestra desenfocada y aclarada: el fondo da contexto (el lugar),
 * pero no debe competir con las manos, que es lo que la persona necesita leer.
 * Si el archivo no existe, el escenario queda con el gris liso de siempre.
 */
export const STAGE_BACKGROUND = {
  url: '/backgrounds/sena.jpg',
  /** Desenfoque en px. 0 = nítido (no recomendado para legibilidad de las manos). */
  blurPx: 5,
  /** Velo claro sobre la foto (0 = ninguno, 1 = gris liso). */
  veil: 0.35,
  /** Recorte de la foto: qué parte queda visible detrás del avatar. */
  position: 'center 35%',
};
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
import { Component, Suspense, useEffect, useMemo, useRef, type ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, OrbitControls, useGLTF } from '@react-three/drei';
import { Box3, Vector3, type Object3D } from 'three';
import type { SignPlayer } from '../core/player/SignPlayer';
import { signRepository } from '../core/signs/SignRepository';
import { ClipDriver } from './ClipDriver';
import { AvatarPlaceholder } from './AvatarPlaceholder';
import type { AvatarOption } from './avatars';
import { STAGE_BACKGROUND } from './stage';

interface Props {
  player: SignPlayer;
  /** undefined = todavía comprobando; null = no hay ningún GLB disponible. */
  avatar: AvatarOption | null | undefined;
  onMissingClips?: (letters: string[]) => void;
}

export function Avatar3D({ player, avatar, onMissingClips }: Props) {
  if (avatar === undefined) return <div className="stage stage--loading">Cargando avatar…</div>;
  if (avatar === null) {
    return <AvatarPlaceholder player={player} reason="No hay ningún avatar en public/models/avatars/" />;
  }

  return (
    <div className="stage">
      <StageBackground />
      {/* key: al cambiar de avatar se reinicia el manejo de errores */}
      <ModelErrorBoundary key={avatar.url} fallback={<AvatarPlaceholder player={player} reason={`Error al cargar ${avatar.name}`} />}>
        {/* Lienzo transparente: el fondo lo pone StageBackground (CSS) */}
        <Canvas camera={{ position: [0, 1.42, 1.6], fov: 30 }} dpr={[1, 2]} gl={{ alpha: true }}>
          <hemisphereLight args={['#ffffff', '#8a8f98', 1.2]} />
          <directionalLight position={[1.5, 2.5, 2]} intensity={1.6} />
          <directionalLight position={[-2, 2, -1]} intensity={0.6} />
          <Suspense fallback={null}>
            <AvatarModel key={avatar.url} url={avatar.url} player={player} onMissingClips={onMissingClips} />
            <ContactShadows position={[0, 0, 0]} opacity={0.35} blur={2.5} far={2} />
          </Suspense>
          <OrbitControls target={[0, 1.33, 0]} enablePan={false} minDistance={0.8} maxDistance={3} />
        </Canvas>
      </ModelErrorBoundary>
    </div>
  );
}

/** Foto de fondo desenfocada y con un velo claro, para dar contexto sin restar legibilidad a las manos. */
function StageBackground() {
  const { url, blurPx, veil, position } = STAGE_BACKGROUND;
  return (
    <div className="stage__bg" aria-hidden="true">
      <div
        className="stage__bg-image"
        style={{ backgroundImage: `url("${url}")`, backgroundPosition: position, filter: `blur(${blurPx}px)` }}
      />
      <div className="stage__bg-veil" style={{ opacity: veil }} />
    </div>
  );
}

interface ModelProps {
  url: string;
  player: SignPlayer;
  onMissingClips?: (letters: string[]) => void;
}

function AvatarModel({ url, player, onMissingClips }: ModelProps) {
  const { scene, animations } = useGLTF(url);
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
import { MicIcon } from './icons';

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
        Voz no disponible en este navegador (p. ej. Firefox). Usa Chrome o Edge, o escribe el texto.
      </p>
    );
  }

  return (
    <div className="speech">
      <button type="button" className={`btn ${listening ? 'btn--recording' : ''}`} onClick={toggle} aria-pressed={listening}>
        <MicIcon />
        {listening ? 'Escuchando… (toca para detener)' : 'Hablar'}
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
import { NextIcon, PauseIcon, PlayIcon, PrevIcon, RepeatIcon, RestartIcon, StopIcon } from './icons';

export function PlayerControls({ player }: { player: SignPlayer }) {
  const { status, items, speed, loop } = usePlayer(player);
  const empty = items.length === 0;
  const playing = status === 'playing';

  return (
    <div className="controls">
      <div className="controls__main" role="group" aria-label="Controles de reproducción">
        <button type="button" className="btn btn--icon" onClick={() => player.prev()} disabled={empty} title="Letra anterior (←)" aria-label="Letra anterior">
          <PrevIcon />
        </button>
        <button type="button" className="btn btn--primary btn--play" onClick={() => player.togglePlay()} disabled={empty} title="Reproducir / Pausar (Espacio)">
          {playing ? <PauseIcon /> : <PlayIcon />}
          {playing ? 'Pausar' : status === 'paused' ? 'Continuar' : 'Reproducir'}
        </button>
        <button type="button" className="btn btn--icon" onClick={() => player.next()} disabled={empty} title="Letra siguiente (→)" aria-label="Letra siguiente">
          <NextIcon />
        </button>
      </div>
      <div className="controls__main" role="group" aria-label="Más controles">
        <button type="button" className="btn" onClick={() => player.restart()} disabled={empty} title="Reiniciar (R)">
          <RestartIcon /> Reiniciar
        </button>
        <button type="button" className="btn" onClick={() => player.stop()} disabled={empty || status === 'idle'} title="Detener">
          <StopIcon /> Detener
        </button>
        <button type="button" className={`btn ${loop ? 'btn--active' : ''}`} onClick={() => player.setLoop(!loop)} aria-pressed={loop} title="Repetir la palabra">
          <RepeatIcon /> Repetir
        </button>
      </div>
      <div className="controls__speed" role="radiogroup" aria-label="Velocidad">
        <span>Velocidad</span>
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

## `src/ui/AvatarSelector.tsx`

```tsx
import { AVATARS } from '../avatar/avatars';
import type { AvatarChoice } from '../hooks/useAvatarChoice';

/** Permite comparar los candidatos de avatar. Los que no tienen GLB aparecen deshabilitados. */
export function AvatarSelector({ choice }: { choice: AvatarChoice }) {
  const { available, selected, select } = choice;
  if (!available) return null;

  return (
    <div className="avatar-selector">
      <label htmlFor="avatar">Avatar</label>
      <select id="avatar" value={selected?.id ?? ''} onChange={(e) => select(e.target.value)} disabled={!selected}>
        {AVATARS.map((a) => (
          <option key={a.id} value={a.id} disabled={!available[a.id]}>
            {a.name}
            {available[a.id] ? '' : ' (no disponible)'}
          </option>
        ))}
      </select>
      {selected && (
        <span className={`avatar-selector__license ${selected.publishable ? '' : 'avatar-selector__license--warn'}`}>
          Licencia: {selected.license}
        </span>
      )}
    </div>
  );
}
```

## `src/ui/Logo.tsx`

```tsx
import { useId } from 'react';

/**
 * Logo de NexoLSC: dos arcos en «C» (la letra del alfabeto manual) enlazados, más el
 * logotipo «nexo» con la píldora «LSC». Los cortes (máscaras) muestran qué arco pasa
 * por encima: arriba el verde, abajo el amarillo. Colores desde los tokens de marca.
 */
export function Logo({ size = 40 }: { size?: number }) {
  const id = useId().replace(/:/g, '');
  return (
    <span className="logo" role="img" aria-label="NexoLSC" style={{ ['--logo-size' as string]: `${size}px` }}>
      <svg className="logo__mark" viewBox="0 0 64 64" width={size} height={size} aria-hidden="true" focusable="false">
        <defs>
          <mask id={`${id}-d`} maskUnits="userSpaceOnUse" x="0" y="0" width="64" height="64">
            <rect width="64" height="64" fill="#fff" />
            <path d="M28.79 18.84 A14 14 0 0 1 34.72 23" fill="none" stroke="#000" strokeWidth="13" strokeLinecap="round" />
          </mask>
          <mask id={`${id}-i`} maskUnits="userSpaceOnUse" x="0" y="0" width="64" height="64">
            <rect width="64" height="64" fill="#fff" />
            <path d="M29.28 41 A14 14 0 0 0 35.21 45.16" fill="none" stroke="#000" strokeWidth="13" strokeLinecap="round" />
          </mask>
        </defs>
        <g fill="none" strokeWidth="8" strokeLinecap="round">
          <path className="logo__arc-selva" mask={`url(#${id}-i)`} d="M34.72 23 A14 14 0 1 0 32.03 43.47" />
          <path className="logo__arc-mango" mask={`url(#${id}-d)`} d="M31.97 20.53 A14 14 0 1 1 29.28 41" />
        </g>
      </svg>
      <span className="logo__word" aria-hidden="true">
        nexo<span className="logo__pill">LSC</span>
      </span>
    </span>
  );
}
```

## `src/ui/icons.tsx`

```tsx
/**
 * Íconos de la marca NexoLSC: cuadrícula de 24px, trazo de 2px, extremos redondeados,
 * una sola tinta (currentColor, heredan el color del botón). Decorativos: el botón
 * lleva el texto o un aria-label.
 */
import type { ReactNode } from 'react';

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      className="icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

export const PlayIcon = () => (
  <Icon>
    <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.4-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" />
  </Icon>
);

export const PauseIcon = () => (
  <Icon>
    <rect x="6" y="5" width="4" height="14" rx="1.5" />
    <rect x="14" y="5" width="4" height="14" rx="1.5" />
  </Icon>
);

export const StopIcon = () => (
  <Icon>
    <rect x="5.5" y="5.5" width="13" height="13" rx="3" />
  </Icon>
);

export const RestartIcon = () => (
  <Icon>
    <path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3" />
    <path d="M4 4v4.5h4.5" />
  </Icon>
);

export const RepeatIcon = () => (
  <Icon>
    <path d="M17 3.5l3 3-3 3" />
    <path d="M4 11.5v-1a4 4 0 0 1 4-4h12" />
    <path d="M7 20.5l-3-3 3-3" />
    <path d="M20 12.5v1a4 4 0 0 1-4 4H4" />
  </Icon>
);

export const MicIcon = () => (
  <Icon>
    <rect x="9" y="3" width="6" height="11" rx="3" />
    <path d="M5.5 11a6.5 6.5 0 0 0 13 0" />
    <path d="M12 17.5V21" />
  </Icon>
);

export const PrevIcon = () => (
  <Icon>
    <path d="M15.5 6l-6 6 6 6" />
  </Icon>
);

export const NextIcon = () => (
  <Icon>
    <path d="M8.5 6l6 6-6 6" />
  </Icon>
);
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
import { useAvatarChoice } from './hooks/useAvatarChoice';
import { AvatarSelector } from './ui/AvatarSelector';
import { PlayerControls } from './ui/PlayerControls';
import { LetterTimeline } from './ui/LetterTimeline';
import { SpeechButton } from './ui/SpeechButton';
import { Logo } from './ui/Logo';
import { PlayIcon } from './ui/icons';

export default function App() {
  const player = useMemo(() => new SignPlayer(), []);
  const [text, setText] = useState('');
  const [display, setDisplay] = useState('');
  const [skipped, setSkipped] = useState<string[]>([]);
  const [missing, setMissing] = useState<string[]>([]);
  const avatarChoice = useAvatarChoice();
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
        <h1>
          <Logo size={40} />
        </h1>
        <p>Deletrea en Lengua de Señas Colombiana</p>
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
            <PlayIcon /> Reproducir
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

      <AvatarSelector choice={avatarChoice} />
      <Avatar3D
        player={player}
        avatar={avatarChoice.available ? avatarChoice.selected : undefined}
        onMissingClips={setMissing}
      />
      <LetterTimeline player={player} missing={missing} />
      <PlayerControls player={player} />

      <footer className="app__footer">
        <ValidationBadge />
        <p>
          Configuraciones basadas en el Diccionario Básico de la LSC (INSOR – Instituto Caro y Cuervo, 2006).
          Animaciones en validación con la comunidad sorda.
        </p>
      </footer>
    </main>
  );
}

/** Estado de validación del alfabeto: honesto con el usuario mientras las señas sean borradores. */
function ValidationBadge() {
  const letters = signRepository.all('letter');
  const approved = letters.filter((l) => l.validation.status === 'approved').length;
  const done = approved === letters.length;
  return (
    <span className={`status-badge ${done ? 'status-badge--approved' : 'status-badge--draft'}`}>
      {done ? 'Aprobado' : 'Borrador'} · {approved} de {letters.length} letras validadas por personas sordas
    </span>
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
/*
 * Marca NexoLSC (v0.3.0). Tokens tomados del sistema de diseño:
 * https://claude.ai/artifact/EVFLVxqZYXv6AC4Kj38ork
 * Selva = acción y foco · mango = la letra actual · achiote = errores (siempre con palabra).
 */
:root {
  --surface: #f5f9f6;
  --surface-raised: #ffffff;
  --bruma: #e2f0e8;
  --arena: #fff3d6;
  --line: #d3e2da;
  --line-strong: #71898a;
  --ink: #0f2a2e;
  --ink-muted: #4a6266;
  --selva: #0b6b4f;
  --on-selva: #ffffff;
  --mango: #ffb627;
  --on-mango: #0f2a2e;
  --mango-ink: #7a4f00;
  --noche: #0f2a2e;
  --achiote: #a8360b;
  --achiote-soft: #fde4d8;
  --escenario: #e9ecef;
  --focus: var(--selva);
  --shadow-card: 0 1px 2px rgba(15, 42, 46, 0.06), 0 8px 24px rgba(15, 42, 46, 0.08);

  --font-display: 'Baloo 2', 'Nunito', ui-rounded, system-ui, sans-serif;
  --font-body: 'Atkinson Hyperlegible', 'Segoe UI', system-ui, sans-serif;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;

  --radius-sm: 10px;
  --radius-md: 16px;
  --radius-lg: 24px;
  --radius-pill: 999px;

  color-scheme: light dark;
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 24px;
  color: var(--ink);
  background: var(--surface);
}

@media (prefers-color-scheme: dark) {
  :root {
    --surface: #0c1a1c;
    --surface-raised: #142629;
    --bruma: #123a2d;
    --arena: #3a2c08;
    --line: #2a4145;
    --line-strong: #6b8784;
    --ink: #e8f3ee;
    --ink-muted: #a6bbb6;
    --selva: #52c99c;
    --on-selva: #062a1e;
    --mango: #ffc34d;
    --on-mango: #1a1300;
    --mango-ink: #ffc34d;
    --noche: #1f4a50;
    --achiote: #ff9a6b;
    --achiote-soft: #3d1a0c;
    --shadow-card: 0 1px 2px rgba(0, 0, 0, 0.4), 0 8px 24px rgba(0, 0, 0, 0.35);
  }
}

* { box-sizing: border-box; }
body { margin: 0; background: var(--surface); }

/* ---------- Estructura ---------- */
.app { max-width: 880px; margin: 0 auto; padding: var(--space-4); display: grid; gap: var(--space-6); }
.app__header { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: var(--space-2) var(--space-4); }
.app__header h1 { margin: 0; line-height: 0; }
.app__header p { margin: 0; color: var(--ink-muted); font-size: 14px; line-height: 20px; }
.app__footer { font-size: 13px; line-height: 18px; color: var(--ink-muted); text-align: center; display: grid; gap: var(--space-2); justify-items: center; }
.app__footer p { margin: 0; }

/* ---------- Logo ---------- */
.logo { display: inline-flex; align-items: center; gap: calc(var(--logo-size, 40px) * 0.2); }
.logo__mark { display: block; flex: none; }
.logo__arc-selva { stroke: var(--selva); }
.logo__arc-mango { stroke: var(--mango); }
.logo__word {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: calc(var(--logo-size, 40px) * 0.8);
  line-height: 1;
  letter-spacing: -0.02em;
  color: var(--ink);
  display: inline-flex;
  align-items: center;
  gap: 0.12em;
}
.logo__pill {
  background: var(--mango);
  color: var(--on-mango);
  border-radius: var(--radius-pill);
  font-size: 0.58em;
  letter-spacing: 0.02em;
  padding: 0.18em 0.5em 0.08em;
}

/* ---------- Íconos ---------- */
.icon { width: 20px; height: 20px; flex: none; }

/* ---------- Tarjeta de entrada ---------- */
.input {
  background: var(--surface-raised);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  padding: var(--space-6);
  display: grid;
  gap: var(--space-3);
}
.input label { font-weight: 700; font-size: 14px; line-height: 20px; }
.input__row { display: flex; flex-wrap: wrap; gap: var(--space-2); }
.input__row input {
  flex: 1 1 14rem;
  min-width: 0;
  font: inherit;
  font-size: 18px;
  line-height: 28px;
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  border: 2px solid var(--line-strong);
  background: var(--surface-raised);
  color: var(--ink);
}
.input__row input:focus-visible { outline: 3px solid var(--focus); outline-offset: 2px; }
.input__normalized { margin: 0; color: var(--ink-muted); letter-spacing: 0.08em; }
.input__warning {
  margin: 0;
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-sm);
  background: var(--achiote-soft);
  color: var(--achiote);
  font-size: 14px;
}

/* ---------- Botones ---------- */
.btn {
  font: inherit;
  font-weight: 700;
  font-size: 14px;
  line-height: 20px;
  min-height: 44px;
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-pill);
  border: 2px solid var(--line-strong);
  background: var(--surface-raised);
  color: var(--ink);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  transition: background-color 120ms, border-color 120ms, color 120ms;
}
.btn:hover:not(:disabled) { border-color: var(--selva); color: var(--selva); }
.btn:disabled { opacity: 0.45; cursor: not-allowed; }
.btn:focus-visible, .chip:focus-visible { outline: 3px solid var(--focus); outline-offset: 2px; }
.btn--icon { padding: var(--space-3); min-width: 44px; }
.btn--play { min-width: 10rem; }
.btn--primary { background: var(--selva); color: var(--on-selva); border-color: var(--selva); }
.btn--primary:hover:not(:disabled) { color: var(--on-selva); filter: brightness(1.08); }
.btn--active { background: var(--bruma); border-color: var(--selva); color: var(--selva); }
.btn--recording { background: var(--achiote); color: var(--surface-raised); border-color: var(--achiote); }
.btn--recording:hover:not(:disabled) { color: var(--surface-raised); border-color: var(--achiote); }

/* ---------- Voz ---------- */
.speech { display: flex; gap: var(--space-3); align-items: center; flex-wrap: wrap; }
.speech__interim { color: var(--ink-muted); font-style: italic; }
.speech__error, .speech__unsupported { color: var(--achiote); margin: 0; font-size: 14px; }

/* ---------- Selector de avatar ---------- */
.avatar-selector { display: flex; flex-wrap: wrap; gap: var(--space-2) var(--space-3); align-items: center; }
.avatar-selector label { font-weight: 700; font-size: 14px; }
.avatar-selector select {
  font: inherit;
  min-height: 44px;
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  border: 2px solid var(--line-strong);
  background: var(--surface-raised);
  color: var(--ink);
}
.avatar-selector select:focus-visible { outline: 3px solid var(--focus); outline-offset: 2px; }
.avatar-selector__license { font-size: 13px; line-height: 18px; color: var(--ink-muted); }
.avatar-selector__license--warn { color: var(--achiote); }

/* ---------- Escenario ---------- */
/* Claro en ambos temas: la piel y la ropa oscura del avatar contrastan mejor sobre claro. */
.stage {
  position: relative;
  height: min(60vh, 520px);
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--escenario);
  box-shadow: var(--shadow-card);
  color: #0f2a2e;
}
/* Fondo del escenario (src/avatar/stage.ts). inset negativo: oculta los bordes borrosos del desenfoque. */
.stage__bg { position: absolute; inset: 0; pointer-events: none; }
.stage__bg-image { position: absolute; inset: -16px; background-size: cover; background-repeat: no-repeat; }
.stage__bg-veil { position: absolute; inset: 0; background: #eef4f0; }
.stage--loading { display: grid; place-items: center; color: #4a6266; }
.stage--placeholder { display: grid; place-content: center; justify-items: center; text-align: center; padding: var(--space-4); gap: var(--space-2); }
.placeholder__letter { font-family: var(--font-display); font-size: clamp(5rem, 18vw, 9rem); font-weight: 800; line-height: 1; }
.placeholder__desc { max-width: 46ch; margin: 0; }
.placeholder__move { margin: 0; color: #0b6b4f; font-weight: 700; }
.placeholder__note { margin: var(--space-2) 0 0; font-size: 13px; line-height: 18px; color: #4a6266; }

/* ---------- Línea de letras ---------- */
.timeline { display: grid; gap: var(--space-3); }
.timeline__status { display: flex; justify-content: space-between; gap: var(--space-4); font-family: var(--font-display); font-weight: 700; font-size: 20px; line-height: 26px; }
.timeline__chips { list-style: none; display: flex; flex-wrap: wrap; gap: var(--space-2); margin: 0; padding: var(--space-1); align-items: center; }
.timeline__gap { width: var(--space-4); }

.chip {
  font: inherit;
  font-weight: 700;
  font-size: 14px;
  min-height: 44px;
  border: 2px solid var(--line-strong);
  background: var(--surface-raised);
  color: var(--ink);
  border-radius: var(--radius-pill);
  padding: var(--space-2) var(--space-4);
  cursor: pointer;
  transition: transform 160ms ease, background-color 160ms, border-color 160ms;
}
.chip--active { background: var(--selva); border-color: var(--selva); color: var(--on-selva); }
.chip--letter {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 22px;
  line-height: 1;
  min-width: 48px;
  height: 48px;
  padding: 0 var(--space-2);
  border-radius: var(--radius-sm);
}
.chip--done { background: var(--bruma); color: var(--selva); border-color: var(--bruma); }
.chip--current { background: var(--mango); border-color: var(--mango-ink); color: var(--on-mango); transform: scale(1.12); }
.chip--missing { border-style: dashed; color: var(--ink-muted); }

/* ---------- Controles ---------- */
.controls { display: grid; gap: var(--space-3); }
.controls__main, .controls__speed { display: flex; flex-wrap: wrap; gap: var(--space-2); align-items: center; justify-content: center; }
.controls__speed span { color: var(--ink-muted); font-size: 14px; font-weight: 700; }

/* ---------- Estado de validación ---------- */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  border-radius: var(--radius-pill);
  padding: 2px var(--space-3);
  font-size: 13px;
  line-height: 18px;
  font-weight: 700;
}
.status-badge--draft { background: var(--arena); color: var(--mango-ink); }
.status-badge--approved { background: var(--bruma); color: var(--selva); }
.status-badge--rejected { background: var(--achiote-soft); color: var(--achiote); }

@media (max-width: 480px) {
  .input { padding: var(--space-4); }
  .btn { padding: var(--space-3) var(--space-4); }
}

@media (prefers-reduced-motion: reduce) {
  .chip, .btn { transition: none; }
  .chip--current { transform: none; }
}
```

## `tools/blender/mpfb_builder.py`

```python
"""
Generador reutilizable de candidatos de avatar con MPFB 2 + Rigify.

Cada candidato vive en assets-src/avatars/<id>/ y tiene un build_avatar.py que
solo define su configuración y llama a build_candidate(). Requiere la extensión
MPFB y el paquete "makehuman_system_assets" instalados en Blender.

Salida en la carpeta del candidato:
  avatar.blend   personaje + rig Rigify (armadura "rig"), listo para glTF
  textures/      texturas copiadas y optimizadas para web
  skin.mhmat     material de piel (mezcla de pieles CC0)

Las poses (rest + letras) NO se crean aquí: las aplica tools/blender/bake_letters.py
a cualquier avatar, para que las letras no dependan del avatar.
"""
import os

import bpy
import numpy as np

bpy.ops.preferences.addon_enable(module='rigify')
from bl_ext.blender_org.mpfb.services import (  # noqa: E402
    AssetService, HumanService, LocationService, ObjectService, RigService, SystemService, TargetService,
)

TEXTURE_SIZE = 2048
ALPHA_CUTOFF = 0.35


def build_candidate(cfg, out_dir):
    """cfg: dict con name, macro, targets, skin_mix, eyes_material, bodyparts, clothes, recolor."""
    tex_dir = os.path.join(out_dir, 'textures')
    os.makedirs(tex_dir, exist_ok=True)

    _clear_scene()
    basemesh = HumanService.create_human(scale=0.1, macro_detail_dict=cfg['macro'])  # 1 unidad = 1 m
    basemesh.name = cfg['name']
    if cfg.get('targets'):
        # Detalles de cara/cuerpo; se aplican antes del rig y de la ropa para que ajusten a la forma final.
        TargetService.bulk_load_targets(basemesh, cfg['targets'])

    HumanService.add_builtin_rig(basemesh, 'rigify.human', import_weights=True)
    skin = _build_skin(cfg, out_dir, tex_dir)
    HumanService.set_character_skin(skin, basemesh, skin_type='GAMEENGINE', material_instances=False)

    eyes = _asset('eyes', 'low-poly/low-poly.mhclo')
    HumanService.add_mhclo_asset(eyes, basemesh, asset_type='eyes', subdiv_levels=0, material_type='MAKESKIN',
                                 alternative_materials=_eye_material(eyes, cfg['eyes_material']))
    for kind, fragment in cfg['bodyparts']:
        HumanService.add_mhclo_asset(_asset(kind, fragment), basemesh, asset_type=kind, subdiv_levels=0, material_type='MAKESKIN')
    for fragment in cfg['clothes']:
        HumanService.add_mhclo_asset(_asset('clothes', fragment), basemesh, asset_type='Clothes', subdiv_levels=0, material_type='MAKESKIN')

    metarig = ObjectService.find_object_of_type_amongst_nearest_relatives(basemesh, 'Skeleton')
    assert SystemService.check_for_rigify(), 'Rigify no está habilitado'
    rig = RigService.generate_rigify_rig(metarig, meta_rig_action='delete')
    assert rig is not None, 'Rigify rechazó el metarig'
    rig.name = 'rig'
    _move_feet_to_ground(basemesh, rig)

    _finalize_for_web(basemesh, rig)
    alpha_keys = _alpha_keys(cfg)
    _prepare_materials(alpha_keys)
    _localize_textures(tex_dir, alpha_keys, cfg.get('recolor', {}))

    blend_path = os.path.join(out_dir, 'avatar.blend')
    bpy.ops.wm.save_as_mainfile(filepath=blend_path)
    bpy.ops.file.make_paths_relative()  # texturas relativas a avatar.blend (//textures/...)
    bpy.ops.wm.save_mainfile(filepath=blend_path)
    missing = [i.name for i in bpy.data.images if i.source == 'FILE' and not os.path.isfile(bpy.path.abspath(i.filepath))]
    assert not missing, f'Texturas no encontradas: {missing}'

    height = _height(basemesh)
    print(f'[ok] {blend_path}')
    print(f'[altura] {height:.3f} m')
    print('[rig] huesos', len(rig.data.bones), 'deformación', sum(b.use_deform for b in rig.data.bones))
    for o in bpy.data.objects:
        if o.type == 'MESH' and o.parent == rig:
            print('[malla]', o.name, len(o.data.vertices), 'vértices')
    return basemesh, rig


# --- Pasos ---------------------------------------------------------------------

def _clear_scene():
    for obj in list(bpy.data.objects):
        bpy.data.objects.remove(obj, do_unlink=True)


def _asset(subdir, fragment):
    path = AssetService.find_asset_absolute_path(fragment, subdir)
    if not path:
        raise SystemExit(f'No se encontró el recurso {subdir}/{fragment}. ¿Está instalado el paquete de MakeHuman?')
    return path


def _eye_material(eyes_path, material):
    from bl_ext.blender_org.mpfb.entities.clothes.mhclo import Mhclo
    mhclo = Mhclo()
    mhclo.load(eyes_path, only_metadata=True)
    return {mhclo.uuid: f'materials/{material}.mhmat'} if mhclo.uuid else None


def _build_skin(cfg, out_dir, tex_dir):
    """Mezcla pieles CC0 (todas comparten el mismo mapa UV) según cfg['skin_mix'] = [(nombre, peso), ...]."""
    skins_dir = LocationService.get_user_data('skins')
    mix = cfg['skin_mix']
    total = sum(w for _, w in mix)
    acc = np.zeros(TEXTURE_SIZE * TEXTURE_SIZE * 4, dtype=np.float32)
    for name, weight in mix:
        folder = os.path.join(skins_dir, name)
        img = bpy.data.images.load(os.path.join(folder, _mhmat_diffuse(os.path.join(folder, name + '.mhmat'))))
        img.scale(TEXTURE_SIZE, TEXTURE_SIZE)
        px = np.empty_like(acc)
        img.pixels.foreach_get(px)
        acc += px * (weight / total)
        bpy.data.images.remove(img)
    out = bpy.data.images.new('skin_diffuse', TEXTURE_SIZE, TEXTURE_SIZE)
    out.pixels.foreach_set(acc)
    out.filepath_raw = os.path.join(tex_dir, 'skin_diffuse.png')
    out.file_format = 'PNG'
    out.save()

    # mhmat propio que apunta a la textura mezclada (basado en el de la primera piel).
    first = mix[0][0]
    lines = []
    with open(os.path.join(skins_dir, first, first + '.mhmat'), encoding='utf-8') as fh:
        for line in fh:
            if line.startswith('name '):
                line = f'name {cfg["name"]}_skin\n'
            elif line.startswith('diffuseTexture '):
                line = 'diffuseTexture textures/skin_diffuse.png\n'
            elif line.split(' ')[0] in ('normalmapTexture', 'specularmapTexture', 'bumpmapTexture', 'transmissionmapTexture'):
                continue
            lines.append(line)
    mhmat = os.path.join(out_dir, 'skin.mhmat')
    with open(mhmat, 'w', encoding='utf-8') as fh:
        fh.writelines(lines)
    return mhmat


def _mhmat_diffuse(mhmat_path):
    """Nombre del archivo de textura difusa declarado en un .mhmat (no siempre termina en _diffuse.png)."""
    with open(mhmat_path, encoding='utf-8') as fh:
        for line in fh:
            if line.startswith('diffuseTexture '):
                return line.split(' ', 1)[1].strip()
    raise ValueError(f'{mhmat_path} no declara diffuseTexture')


def _move_feet_to_ground(basemesh, rig):
    bpy.context.view_layer.update()
    lowest = min((basemesh.matrix_world @ v.co).z for v in basemesh.data.vertices)
    rig.location.z -= lowest


def _height(basemesh):
    bpy.context.view_layer.update()
    zs = [(basemesh.matrix_world @ v.co).z for v in basemesh.data.vertices]
    return max(zs) - min(zs)


def _finalize_for_web(basemesh, rig):
    """Deja el personaje listo para glTF: sin shape keys, sin máscaras, un solo Armature."""
    bpy.ops.object.select_all(action='DESELECT')
    bpy.context.view_layer.objects.active = basemesh
    basemesh.select_set(True)

    # glTF admite un solo esqueleto por malla; "Armature PV" (preservar volumen) no se exporta.
    for m in list(basemesh.modifiers):
        if m.type == 'ARMATURE' and m.name != 'Armature':
            basemesh.modifiers.remove(m)

    # Hornear el fenotipo y los detalles (shape keys de MakeHuman) en la malla.
    if basemesh.data.shape_keys:
        bpy.ops.object.shape_key_remove(all=True, apply_mix=True)

    # Aplicar máscaras: quitan la geometría auxiliar y el cuerpo oculto bajo la ropa.
    for m in [m for m in basemesh.modifiers if m.type == 'MASK']:
        bpy.ops.object.modifier_move_to_index(modifier=m.name, index=0)
        bpy.ops.object.modifier_apply(modifier=m.name)

    # Brazos en FK: así se posan con los controles *_fk (ver tools/blender/pose_helpers.py).
    for side in ('L', 'R'):
        rig.pose.bones[f'upper_arm_parent.{side}']['IK_FK'] = 1.0


def _alpha_keys(cfg):
    """Materiales/texturas con transparencia real: pelo, cejas y pestañas."""
    keys = ['eyebrow', 'eyelashes']
    keys += [os.path.basename(frag).split('.')[0] for kind, frag in cfg['bodyparts'] if kind == 'hair']
    return keys


def _prepare_materials(alpha_keys):
    """Ajusta los materiales de MakeHuman para glTF / three.js.

    MakeHuman conecta el alfa de la textura en todos los materiales, y el exportador
    glTF los marca entonces como BLEND (transparentes). En three.js eso causa errores
    de orden de dibujo (p. ej. ver el cuerpo a través de la camisa). Aquí:
      - opacos (piel, ropa, zapatos, ojos, dientes): alfa desconectada -> OPAQUE, una cara;
      - pelo/cejas/pestañas: alfa recortada 1 - (alfa < corte) -> MASK, sin ordenamiento.
    """
    for mat in bpy.data.materials:
        if not mat.users or not mat.node_tree:
            continue
        nt = mat.node_tree
        bsdf = next((n for n in nt.nodes if n.type == 'BSDF_PRINCIPLED'), None)
        if bsdf is None:
            continue
        alpha_in = bsdf.inputs['Alpha']
        source = alpha_in.links[0].from_socket if alpha_in.is_linked else None
        for link in list(alpha_in.links):
            nt.links.remove(link)
        alpha_in.default_value = 1.0

        if any(key in mat.name for key in alpha_keys) and source is not None:
            less = nt.nodes.new('ShaderNodeMath')
            less.operation = 'LESS_THAN'
            less.inputs[1].default_value = ALPHA_CUTOFF
            one_minus = nt.nodes.new('ShaderNodeMath')
            one_minus.operation = 'SUBTRACT'
            one_minus.inputs[0].default_value = 1.0
            nt.links.new(source, less.inputs[0])
            nt.links.new(less.outputs[0], one_minus.inputs[1])
            nt.links.new(one_minus.outputs[0], alpha_in)
            mat.use_backface_culling = False
        else:
            mat.use_backface_culling = True
            # Nodos de textura que solo alimentaban el alfa quedan huérfanos: se eliminan.
            for node in [n for n in nt.nodes if n.type == 'TEX_IMAGE' and not any(o.is_linked for o in n.outputs)]:
                nt.nodes.remove(node)


def _texture_policy(stem, alpha_keys):
    """(formato, tamaño máximo). Solo lo que tiene transparencia real va en PNG: el exportador
    glTF guarda en PNG toda imagen con canal alfa aunque sea opaca, y eso triplica el peso."""
    if 'skin_diffuse' in stem:
        return 'JPEG', 2048
    if any(key in stem for key in alpha_keys):
        return 'PNG', 1024 if 'eyebrow' not in stem and 'eyelashes' not in stem else 512
    for key, size in (('shoes', 512), ('_normal', 1024), ('_ao', 512), ('_eye', 512), ('teeth', 512)):
        if key in stem:
            return 'JPEG', size
    return 'JPEG', 1024  # ropa


RECOLORS = {}


def recolor(name):
    def register(fn):
        RECOLORS[name] = fn
        return fn
    return register


@recolor('casualsuit06_black_tee')
def _casualsuit06_black_tee(px, w, h):
    """male_casualsuit06: la camiseta blanca (franja superior del mapa UV, ~43 %) pasa a negro.

    Se conservan las arrugas (luminancia) y se borra el logo de MakeHuman: los píxeles
    saturados u oscuros de la camiseta se sustituyen por la luminancia típica de la tela.
    Los jeans (resto del mapa) no se tocan.
    """
    img = px.reshape(h, w, 4)                 # Blender guarda las filas de abajo hacia arriba
    shirt = img[int(h * (1 - 0.43)):, :, :3]
    lum = shirt @ np.array([0.2126, 0.7152, 0.0722], dtype=np.float32)
    mx, mn = shirt.max(axis=2), shirt.min(axis=2)
    sat = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-6), 0)
    typical = float(np.median(lum))
    lum = np.where((sat > 0.12) | (lum < typical - 0.12), typical, lum)  # logo y texto -> tela lisa
    shade = np.clip(lum / max(typical, 1e-6), 0.6, 1.15)
    shirt[:] = (shade * 0.11)[..., None]      # negro con un poco de volumen
    return px


@recolor('iris_dark_brown')
def _iris_dark_brown(px, w, h):
    """El iris "brown" de MakeHuman es café rojizo; se lleva a café oscuro conservando el detalle."""
    img = px.reshape(-1, 4)
    rgb = img[:, :3]
    mx, mn = rgb.max(axis=1), rgb.min(axis=1)
    sat = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-6), 0)
    iris = sat > 0.3                                   # la esclerótica es casi gris
    lum = rgb[iris] @ np.array([0.2126, 0.7152, 0.0722], dtype=np.float32)
    rgb[iris] = np.clip(lum[:, None] * np.array([1.9, 1.25, 0.8], dtype=np.float32), 0, 1)
    return px


def _localize_textures(tex_dir, alpha_keys, recolor_cfg):
    """Copia cada textura a ./textures, reducida y en el formato adecuado para web."""
    leftovers = set()
    for img in bpy.data.images:
        if img.source != 'FILE' or not img.filepath:
            continue
        src = os.path.abspath(bpy.path.abspath(img.filepath))
        stem = os.path.splitext(os.path.basename(src))[0]
        fmt, max_size = _texture_policy(stem, alpha_keys)
        dest = os.path.join(tex_dir, stem + ('.jpg' if fmt == 'JPEG' else '.png'))
        if os.path.normcase(src) != os.path.normcase(dest):
            w, h = img.size
            if max(w, h) > max_size:
                f = max_size / max(w, h)
                img.scale(int(w * f), int(h * f))
            for key, name in recolor_cfg.items():
                if key in stem:
                    w, h = img.size
                    px = np.empty(w * h * 4, dtype=np.float32)
                    img.pixels.foreach_get(px)
                    img.pixels.foreach_set(RECOLORS[name](px, w, h).ravel())
            img.filepath_raw = dest
            img.file_format = fmt
            img.save(quality=88)
            if os.path.dirname(src) == tex_dir:
                leftovers.add(src)  # p. ej. skin_diffuse.png generada por _build_skin
        # Ruta absoluta por ahora: el .blend aún no está guardado; se hace relativa al guardar.
        img.filepath = dest
        img.reload()  # recargar sin canal alfa si pasó a JPEG
    for path in leftovers:
        os.remove(path)
```

## `tools/blender/bake_letters.py`

```python
"""
Aplica las letras del alfabeto (definidas como DATOS, independientes del avatar)
a cualquier avatar con rig Rigify y crea una Action por letra.

Uso:
  blender -b assets-src/avatars/<id>/avatar.blend --python tools/blender/bake_letters.py
  blender -b <avatar.blend> --python tools/blender/bake_letters.py -- --poses assets-src/letters/alfabeto_lsc.json

Crea/reemplaza las Actions: rest, sign_A … sign_Z, sign_ENYE y guarda el .blend.
Después se exporta con tools/blender/export_avatar.py.

Formato de cada letra (ángulos en grados, ejes LOCALES del rig Rigify, mano derecha):
  fingers.<index|middle|ring|pinky> = [mcp, pip, dip, spread]   (X local; spread = Z local, + hacia el pulgar)
  thumb = [cmc_x, cmc_z, cmc_y, mcp, ip]
          cmc_x + hacia el índice · cmc_z + hacia la palma / − hacia afuera · cmc_y giro · mcp/ip flexión
  arm   = {twist, flex, dev, swing, lift, tilt}   (ajustes sobre la postura base de señado)
          twist: giro del antebrazo (orientación de la palma) · flex/dev: muñeca
          swing/lift: desplazan la mano rotando el hombro (+ derecha del espectador / + arriba)
          tilt: inclina el antebrazo en el plano frontal
          hand_dir: [x, y, z] dirección (mundo) a la que apuntan los dedos; por defecto hacia arriba
          forearm_dir: [x, y, z] dirección (mundo) del antebrazo, si la postura base no sirve (P)
          Ejes del mundo: +X izquierda del avatar (derecha del espectador), −Y hacia el espectador, +Z arriba
  motion = [{t, ...mismos campos que arm, fingers/thumb opcionales}]  (solo letras dinámicas)
"""
import json
import math
import os
import sys

import bpy
from mathutils import Quaternion, Vector

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
sys.path.insert(0, HERE)
import pose_helpers as P  # noqa: E402

FPS = 24
FINGERS = ('index', 'middle', 'ring', 'pinky')
BONE = {'index': 'f_index', 'middle': 'f_middle', 'ring': 'f_ring', 'pinky': 'f_pinky'}


def load_poses():
    argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
    path = argv[argv.index('--poses') + 1] if '--poses' in argv else os.path.join(ROOT, 'assets-src', 'letters', 'alfabeto_lsc.json')
    with open(path, encoding='utf-8') as fh:
        return json.load(fh)


def local(bone, axis, deg):
    if deg:
        P._post_multiply(P.pb[bone], Quaternion(Vector(axis), math.radians(deg)))


def apply_hand(fingers, thumb, side='R'):
    for name in FINGERS:
        mcp, pip, dip, spread = fingers.get(name, [0, 0, 0, 0])
        b = BONE[name]
        local(f'{b}.01.{side}', (0, 0, 1), spread)
        local(f'{b}.01.{side}', (1, 0, 0), mcp)
        local(f'{b}.02.{side}', (1, 0, 0), pip)
        local(f'{b}.03.{side}', (1, 0, 0), dip)
    cmc_x, cmc_z, cmc_y, mcp, ip = thumb
    local(f'thumb.01.{side}', (0, 0, 1), cmc_z)
    local(f'thumb.01.{side}', (1, 0, 0), cmc_x)
    local(f'thumb.01.{side}', (0, 1, 0), cmc_y)
    local(f'thumb.02.{side}', (1, 0, 0), mcp)
    local(f'thumb.03.{side}', (1, 0, 0), ip)


def apply_arm(arm):
    """Ajustes sobre la postura de señado. swing/lift rotan el hombro alrededor de ejes del mundo."""
    swing, lift = arm.get('swing', 0), arm.get('lift', 0)
    if swing:
        P.rot_world('upper_arm_fk.R', (0, 0, 1), swing)
    if lift:
        P.rot_world('upper_arm_fk.R', (1, 0, 0), -lift)
    P.upd()
    if 'forearm_dir' in arm:  # p. ej. antebrazo hacia adelante para que la mano apunte abajo (P)
        P.aim('forearm_fk.R', arm['forearm_dir'])
    tilt = arm.get('tilt', 0)
    if tilt:  # inclina el antebrazo en el plano frontal (p. ej. dedos horizontales en la H)
        P.rot_world('forearm_fk.R', (0, 1, 0), tilt)
        P.upd()
    twist = arm.get('twist', 0)
    if twist:
        fk = P.pb['forearm_fk.R']
        P.rot_world('forearm_fk.R', fk.matrix.to_3x3() @ Vector((0, 1, 0)), twist)
    # Tras girar el antebrazo, se vuelve a orientar la mano: el giro cambia hacia dónde mira
    # la palma, pero los dedos siguen apuntando a hand_dir (por defecto, hacia arriba).
    P.aim('hand_fk.R', arm.get('hand_dir', DEFAULT_HAND_DIR))
    local('hand_fk.R', (1, 0, 0), arm.get('flex', 0))
    local('hand_fk.R', (0, 0, 1), arm.get('dev', 0))
    P.upd()


ARM_KEYS = ('twist', 'flex', 'dev', 'swing', 'lift', 'tilt')
DEFAULT_HAND_DIR = (0.0, -0.1, 1.0)  # dedos hacia arriba, levemente hacia adelante


def pose_letter(base, override=None, defaults=None):
    """Postura completa: base de señado + mano + brazo.

    Los valores de brazo se SUMAN: defaults (p. ej. palma al frente) + letra + fotograma de movimiento.
    """
    override = override or {}
    P.reset()
    P.arm_signing_space()
    arm = {}
    for layer in ((defaults or {}).get('arm', {}), base.get('arm', {}), override):
        for key in ARM_KEYS:
            if key in layer:
                arm[key] = arm.get(key, 0) + layer[key]
        for key in ('hand_dir', 'forearm_dir'):  # direcciones absolutas: la última capa gana
            if key in layer:
                arm[key] = layer[key]
    apply_arm(arm)
    fingers = dict(base['fingers'])
    fingers.update(override.get('fingers', {}))
    apply_hand(fingers, override.get('thumb', base['thumb']))
    P.upd()


def pose_rest():
    P.reset()
    P.aim('upper_arm_fk.R', (-0.15, 0.05, -1)); P.aim('forearm_fk.R', (-0.05, -0.1, -1))
    P.aim('upper_arm_fk.L', (0.15, 0.05, -1)); P.aim('forearm_fk.L', (0.05, -0.1, -1))


def key_pose(action, frame):
    for b in P.pb:
        path = 'rotation_quaternion' if b.rotation_mode == 'QUATERNION' else 'rotation_euler'
        b.keyframe_insert(path, frame=frame, group=b.name)
        b.keyframe_insert('location', frame=frame, group=b.name)


def new_action(name):
    old = bpy.data.actions.get(name)
    if old:
        bpy.data.actions.remove(old)
    act = bpy.data.actions.new(name)
    act.use_fake_user = True
    P.rig.animation_data_create()
    P.rig.animation_data.action = act
    return act


def clip_name(letter):
    return 'sign_ENYE' if letter == 'Ñ' else f'sign_{letter}'


def main():
    data = load_poses()
    # rest
    pose_rest()
    new_action('rest'); key_pose(None, 1)

    for letter, spec in data['letters'].items():
        motion = spec.get('motion')
        # new_action antes de posar: reset() desasigna la Action anterior (evita que se sumen)
        P.reset()
        act = new_action(clip_name(letter))
        defaults = data.get('defaults', {})
        if not motion:
            pose_letter(spec, defaults=defaults)
            P.rig.animation_data.action = act
            key_pose(act, 1)
        else:
            frames = max(2, round(spec.get('duration_s', 0.95) * FPS))
            for kf in motion:
                pose_letter(spec, kf, defaults)
                P.rig.animation_data.action = act
                key_pose(act, 1 + round(kf['t'] * (frames - 1)))
        P.rig.animation_data.action = None
    P.reset()
    bpy.ops.wm.save_mainfile()
    print('[ok] Actions:', sorted(a.name for a in bpy.data.actions if a.name == 'rest' or a.name.startswith('sign_')))


if __name__ == '__main__':
    main()
```

## `tools/blender/export_avatar.py`

```python
"""
Prepara y exporta el avatar de NexoLSC a GLB con un AnimationClip por seña.

Uso (sin abrir la interfaz de Blender):
  blender -b assets-src/avatars/mpfb2/avatar.blend --python tools/blender/export_avatar.py -- public/models/avatars/mpfb2.glb

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
    """Vuelve todos los huesos a la pose de descanso del rig.

    También desasigna la Action activa: si no, al actualizar la escena Blender
    vuelve a aplicar sus fotogramas clave y la pose anterior se suma a la nueva.
    """
    if rig.animation_data:
        rig.animation_data.action = None
    for b in pb:
        b.location = (0, 0, 0)
        if b.rotation_mode == 'QUATERNION':
            b.rotation_quaternion = (1, 0, 0, 0)
        else:
            b.rotation_euler = (0, 0, 0)
    upd()


def _post_multiply(b, q):
    """Aplica una rotación local sin importar el modo de rotación del hueso (cuaternión o Euler).

    Ojo: en el Rigify actual los dedos usan Euler XYZ y los brazos cuaterniones.
    Escribir solo rotation_quaternion en un hueso Euler no tiene efecto.
    """
    if b.rotation_mode == 'QUATERNION':
        b.rotation_quaternion = b.rotation_quaternion @ q
    elif b.rotation_mode == 'AXIS_ANGLE':
        raise ValueError(f'{b.name}: modo AXIS_ANGLE no soportado')
    else:
        b.rotation_euler = (b.rotation_euler.to_quaternion() @ q).to_euler(b.rotation_mode, b.rotation_euler)


def rot_world(name, axis, deg):
    """Rota el hueso alrededor de un eje en espacio de armadura, respetando la pose actual."""
    b = pb[name]
    upd()
    axis_local = (b.matrix.to_3x3().inverted() @ Vector(axis)).normalized()
    _post_multiply(b, Quaternion(axis_local, math.radians(deg)))
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
        _post_multiply(b, Quaternion((1, 0, 0), math.radians(deg * (0.8 if i == 0 else 1.0))))
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

## `assets-src/avatars/mpfb2/build_avatar.py`

```python
"""
Candidato "mpfb2": hombre joven adulto, realista (MPFB 2 + Rigify, recursos CC0).

  blender -b --python assets-src/avatars/mpfb2/build_avatar.py
  blender -b assets-src/avatars/mpfb2/avatar.blend --python tools/blender/bake_letters.py
  blender -b assets-src/avatars/mpfb2/avatar.blend --python tools/blender/export_avatar.py -- public/models/avatars/mpfb2.glb

Ver tools/blender/mpfb_builder.py y LICENSE.md.
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..', '..', 'tools', 'blender'))
from mpfb_builder import build_candidate  # noqa: E402

CONFIG = {
    'name': 'nexolsc_mpfb2',
    'macro': {
        'gender': 1.0,        # 0 = mujer, 1 = hombre
        'age': 0.5,           # 0.5 ≈ 25 años en MakeHuman
        'muscle': 0.55,
        'weight': 0.5,
        'proportions': 0.6,
        'height': 0.6,        # ≈ 1,71 m (0.5 → 1,59 m; 0.8 → 1,97 m)
        'cupsize': 0.5,
        'firmness': 0.5,
        'race': {'african': 0.45, 'caucasian': 0.35, 'asian': 0.20},
    },
    'targets': [],
    'skin_mix': [('young_african_male', 0.5), ('young_caucasian_male', 0.5)],
    'eyes_material': 'brown',
    'bodyparts': [
        ('eyebrows', 'eyebrow001/eyebrow001.mhclo'),
        ('eyelashes', 'eyelashes01/eyelashes01.mhclo'),
        ('teeth', 'teeth_base/teeth_base.mhclo'),
        ('hair', 'short02/short02.mhclo'),
    ],
    'clothes': ['male_casualsuit01/male_casualsuit01.mhclo', 'shoes01/shoes01.mhclo'],
}

if __name__ == '__main__':
    build_candidate(CONFIG, HERE)
```

## `assets-src/avatars/mpfb2-caricatura/build_avatar.py`

```python
"""
Candidato "mpfb2-caricatura": versión caricaturesca inspirada en los rasgos del autor
del proyecto (MPFB 2 + Rigify, recursos CC0).

Rasgos buscados (de sus fotos): hombre de unos 20 años, piel trigueña clara, cara
redonda y llena, cejas negras gruesas y rectas, ojos cafés, nariz ancha, labios
llenos, pelo negro peinado hacia arriba y atrás con los lados cortos, camiseta
negra. Rasgo caricaturesco: cabeza, ojos y manos algo más grandes (las manos
grandes además ayudan a leer las señas).

  blender -b --python assets-src/avatars/mpfb2-caricatura/build_avatar.py
  blender -b assets-src/avatars/mpfb2-caricatura/avatar.blend --python tools/blender/bake_letters.py
  blender -b assets-src/avatars/mpfb2-caricatura/avatar.blend --python tools/blender/export_avatar.py -- public/models/avatars/mpfb2-caricatura.glb
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..', '..', 'tools', 'blender'))
from mpfb_builder import build_candidate  # noqa: E402


def t(name, value):
    return {'target': name, 'value': value}


CONFIG = {
    'name': 'nexolsc_caricatura',
    'macro': {
        'gender': 1.0,
        'age': 0.44,          # principios de los 20
        'muscle': 0.45,
        'weight': 0.68,       # complexión llena
        'proportions': 0.35,  # menos "ideal", más caricatura
        'height': 0.63,       # ≈ 1,65 m
        'cupsize': 0.5,
        'firmness': 0.5,
        'race': {'caucasian': 0.55, 'asian': 0.25, 'african': 0.20},
    },
    'targets': [
        # Cabeza más grande y redonda (rasgo caricaturesco + cara llena)
        t('head-round', 0.7), t('head-fat-incr', 0.5),
        t('head-scale-horiz-incr', 0.6), t('head-scale-vert-incr', 0.55), t('head-scale-depth-incr', 0.5),
        t('l-cheek-volume-incr', 0.5), t('r-cheek-volume-incr', 0.5),
        t('chin-width-incr', 0.3), t('neck-double-incr', 0.15),
        # Ojos más grandes
        t('l-eye-scale-incr', 0.8), t('r-eye-scale-incr', 0.8),
        # Nariz ancha y labios llenos
        t('nose-scale-horiz-incr', 0.4), t('nose-volume-incr', 0.35), t('nose-point-width-incr', 0.35),
        t('mouth-upperlip-volume-incr', 0.25), t('mouth-lowerlip-volume-incr', 0.35),
        # Cejas un poco más bajas y rectas (mirada seria)
        t('eyebrows-angle-down', 0.2),
        # Manos más grandes y dedos algo más gruesos: se leen mejor las configuraciones
        t('l-hand-scale-incr', 0.5), t('r-hand-scale-incr', 0.5),
        t('l-hand-fingers-diameter-incr', 0.2), t('r-hand-fingers-diameter-incr', 0.2),
    ],
    'skin_mix': [('young_caucasian_male', 0.55), ('young_asian_male', 0.25), ('young_african_male', 0.20)],
    'eyes_material': 'brown',
    'bodyparts': [
        ('eyebrows', 'eyebrow009/eyebrow009.mhclo'),   # gruesas y rectas
        ('eyelashes', 'eyelashes01/eyelashes01.mhclo'),
        ('teeth', 'teeth_base/teeth_base.mhclo'),
        ('hair', 'short04/short04.mhclo'),             # negro, peinado hacia arriba/atrás
    ],
    'clothes': ['male_casualsuit06/male_casualsuit06.mhclo', 'shoes02/shoes02.mhclo'],
    # La camiseta de casualsuit06 es blanca: se pasa a negro sin tocar los jeans.
    'recolor': {'male_casualsuit06_diffuse': 'casualsuit06_black_tee', 'brown_eye': 'iris_dark_brown'},
}

if __name__ == '__main__':
    build_candidate(CONFIG, HERE)
```
