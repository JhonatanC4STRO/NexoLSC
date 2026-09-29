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
