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
