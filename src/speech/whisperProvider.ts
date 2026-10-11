/**
 * Voz local con Whisper: para navegadores sin Web Speech API (Firefox, Brave…).
 * Graba con el micrófono, corta solo al detectar silencio y convierte el audio en
 * texto dentro de un worker. El modelo se descarga una vez (con aviso previo) y
 * queda guardado en el navegador.
 */
import type { SpeechCallbacks, SpeechToTextProvider } from './speechToText';

/** Descarga la primera vez, medida: modelo whisper-base (q8, ~77 MB) + motor WASM comprimido (~7 MB). */
export const WHISPER_DOWNLOAD_MB = 85;

type Request = { type: 'check' } | { type: 'load' } | { type: 'transcribe'; audio: Float32Array };
export type WorkerRequest = Request & { id: number };

export type WorkerResponse =
  | { type: 'progress'; loaded: number; total: number }
  | { id: number; type: 'cached'; cached: boolean }
  | { id: number; type: 'ready' }
  | { id: number; type: 'result'; text: string }
  | { id: number; type: 'error'; code: string; message: string };

type Reply = Exclude<WorkerResponse, { type: 'progress' }>;

// Detección de voz por volumen (RMS de la señal, de 0 a 1).
const TICK_MS = 100;
const VOICE_RMS = 0.015;
const MIN_VOICE_MS = 200;
const END_SILENCE_MS = 1200;
const NO_SPEECH_MS = 7000;
const MAX_MS = 15000;

/** Frases que Whisper «alucina» con silencio o ruido (vienen de subtítulos de internet). */
const HALLUCINATIONS = /amara\.org|subt[ií]tulos|gracias por ver|suscr[ií]bete/i;

class SpeechError extends Error {
  constructor(readonly code: string) {
    super(code);
  }
}

let worker: Worker | null = null;
let nextId = 1;
let ready = false;
const progressListeners = new Set<(loaded: number, total: number) => void>();

function getWorker(): Worker {
  if (!worker) {
    worker = new Worker(new URL('./whisper.worker.ts', import.meta.url), { type: 'module' });
    worker.addEventListener('message', (e: MessageEvent<WorkerResponse>) => {
      const msg = e.data;
      if (msg.type === 'progress') progressListeners.forEach((fn) => fn(msg.loaded, msg.total));
    });
  }
  return worker;
}

/** Envía una orden al worker y espera su respuesta. */
function ask(req: Request, transfer: Transferable[] = []): Promise<Reply> {
  const w = getWorker();
  const id = nextId++;
  return new Promise((resolve) => {
    const onMessage = (e: MessageEvent<WorkerResponse>) => {
      if (e.data.type === 'progress' || e.data.id !== id) return;
      cleanup();
      resolve(e.data);
    };
    const onError = () => {
      cleanup();
      resolve({ id, type: 'error', code: 'model-load', message: 'worker' });
    };
    const cleanup = () => {
      w.removeEventListener('message', onMessage);
      w.removeEventListener('error', onError);
    };
    w.addEventListener('message', onMessage);
    w.addEventListener('error', onError);
    w.postMessage({ ...req, id }, transfer);
  });
}

/** Graba hasta que la persona deja de hablar (o toca detener). */
async function record(): Promise<{ stop: () => void; done: Promise<Float32Array> }> {
  let stream: MediaStream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true },
    });
  } catch (err) {
    const name = err instanceof DOMException ? err.name : '';
    throw new SpeechError(name === 'NotAllowedError' || name === 'SecurityError' ? 'not-allowed' : 'audio-capture');
  }

  const recorder = new MediaRecorder(stream);
  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data.size) chunks.push(e.data);
  };

  const meter = new AudioContext();
  void meter.resume();
  const analyser = meter.createAnalyser();
  analyser.fftSize = 2048;
  meter.createMediaStreamSource(stream).connect(analyser);
  const samples = new Float32Array(analyser.fftSize);

  let voiceMs = 0;
  let silenceMs = 0;
  let heardVoice = false;
  let stoppedByUser = false;
  const startedAt = performance.now();

  const stop = () => {
    if (recorder.state !== 'inactive') recorder.stop();
  };

  const timer = setInterval(() => {
    analyser.getFloatTimeDomainData(samples);
    let sum = 0;
    for (const v of samples) sum += v * v;
    const rms = Math.sqrt(sum / samples.length);
    if (rms > VOICE_RMS) {
      voiceMs += TICK_MS;
      silenceMs = 0;
      if (voiceMs >= MIN_VOICE_MS) heardVoice = true;
    } else {
      silenceMs += TICK_MS;
    }
    const elapsed = performance.now() - startedAt;
    if ((heardVoice && silenceMs >= END_SILENCE_MS) || (!heardVoice && elapsed >= NO_SPEECH_MS) || elapsed >= MAX_MS) {
      stop();
    }
  }, TICK_MS);

  const done = new Promise<Float32Array>((resolve, reject) => {
    recorder.onstop = async () => {
      clearInterval(timer);
      stream.getTracks().forEach((t) => t.stop());
      void meter.close();
      if (!heardVoice && !stoppedByUser) return reject(new SpeechError('no-speech'));
      try {
        resolve(await decode(new Blob(chunks, { type: recorder.mimeType })));
      } catch {
        reject(new SpeechError('audio-capture'));
      }
    };
  });

  recorder.start();
  return {
    stop: () => {
      stoppedByUser = true;
      stop();
    },
    done,
  };
}

/** Convierte la grabación en muestras a 16 kHz, que es lo que espera Whisper. */
async function decode(blob: Blob): Promise<Float32Array> {
  const ctx = new AudioContext({ sampleRate: 16000 });
  try {
    const audio = await ctx.decodeAudioData(await blob.arrayBuffer());
    return audio.getChannelData(0).slice();
  } finally {
    void ctx.close();
  }
}

function clean(text: string): string {
  if (HALLUCINATIONS.test(text)) return '';
  return text.replace(/\[[^\]]*\]|\([^)]*\)/g, '').trim();
}

export const whisperProvider: SpeechToTextProvider = {
  name: 'Whisper (en el navegador)',
  local: true,
  isSupported: () =>
    typeof window !== 'undefined' &&
    typeof Worker !== 'undefined' &&
    typeof WebAssembly === 'object' &&
    typeof MediaRecorder !== 'undefined' &&
    Boolean(navigator.mediaDevices?.getUserMedia),

  async pendingDownloadMB() {
    if (ready) return 0;
    const r = await ask({ type: 'check' });
    return r.type === 'cached' && r.cached ? 0 : WHISPER_DOWNLOAD_MB;
  },

  start(_lang, { onFinal, onError, onEnd, onStatus }: SpeechCallbacks) {
    let closed = false;
    let stopRecording: (() => void) | null = null;
    const end = () => {
      if (closed) return;
      closed = true;
      progressListeners.delete(onProgress);
      onEnd?.();
    };
    const onProgress = (loaded: number, total: number) => {
      if (!closed) onStatus?.({ phase: 'downloading', loaded, total: Math.max(total, WHISPER_DOWNLOAD_MB * 1e6) });
    };

    void (async () => {
      try {
        if (!ready) {
          onStatus?.({ phase: 'downloading', loaded: 0, total: WHISPER_DOWNLOAD_MB * 1e6 });
          progressListeners.add(onProgress);
          const r = await ask({ type: 'load' });
          progressListeners.delete(onProgress);
          if (r.type === 'error') throw new SpeechError('model-load');
          ready = true;
        }
        if (closed) return;

        onStatus?.({ phase: 'listening' });
        const rec = await record();
        stopRecording = rec.stop;
        if (closed) rec.stop();
        const audio = await rec.done;
        if (closed) return;

        onStatus?.({ phase: 'transcribing' });
        const r = await ask({ type: 'transcribe', audio }, [audio.buffer]);
        if (r.type === 'error') throw new SpeechError('transcribe');
        const text = r.type === 'result' ? clean(r.text) : '';
        if (!text) throw new SpeechError('no-speech');
        if (!closed) onFinal(text);
      } catch (err) {
        if (!closed) onError?.(err instanceof SpeechError ? err.code : 'transcribe');
      } finally {
        end();
      }
    })();

    // Mientras graba, detener = terminar y convertir lo grabado. Mientras descarga, cancelar.
    return () => {
      if (stopRecording) stopRecording();
      else end();
    };
  },
};
