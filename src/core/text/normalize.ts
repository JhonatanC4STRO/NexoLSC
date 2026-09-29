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
