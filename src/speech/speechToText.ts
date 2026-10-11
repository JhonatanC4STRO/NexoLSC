/**
 * Abstracción de voz → texto. Se usa la Web Speech API del navegador y, donde no
 * existe (Firefox, Brave…), Whisper dentro del navegador (`whisperProvider.ts`).
 * Se puede añadir otro proveedor (API en la nube) implementando la misma interfaz.
 */
import { whisperProvider } from './whisperProvider';

/** En qué va un proveedor que no es instantáneo (Whisper). */
export type SpeechStatus =
  | { phase: 'downloading'; loaded: number; total: number }
  | { phase: 'listening' }
  | { phase: 'transcribing' };

export interface SpeechCallbacks {
  onInterim?: (text: string) => void;
  onFinal: (text: string) => void;
  onError?: (error: string) => void;
  onEnd?: () => void;
  onStatus?: (status: SpeechStatus) => void;
}

export interface SpeechToTextProvider {
  readonly name: string;
  /** true si el audio se procesa en el propio equipo. */
  readonly local?: boolean;
  isSupported(): boolean;
  /** MB que hay que descargar antes del primer uso (0 si ya está listo). Se avisa antes. */
  pendingDownloadMB?(): Promise<number>;
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

/**
 * Elige el motor de voz: el del navegador si existe; si no, Whisper local.
 * Con `?voz=local` en la dirección se fuerza Whisper (útil para probarlo en Chrome).
 */
export function pickSpeechProvider(): SpeechToTextProvider {
  const forceLocal = typeof location !== 'undefined' && new URLSearchParams(location.search).get('voz') === 'local';
  if (!forceLocal && webSpeechProvider.isSupported()) return webSpeechProvider;
  if (whisperProvider.isSupported()) return whisperProvider;
  return webSpeechProvider;
}

export { whisperProvider };
