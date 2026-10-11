/**
 * Worker de voz local: carga Whisper (transformers.js) y convierte audio en texto
 * sin bloquear la pantalla ni el avatar. El audio nunca sale del equipo.
 */
import { ModelRegistry, pipeline } from '@huggingface/transformers';
import type { WorkerRequest, WorkerResponse } from './whisperProvider';

const TASK = 'automatic-speech-recognition';
const MODEL = 'onnx-community/whisper-base';
const OPTIONS = { dtype: 'q8', device: 'wasm' } as const;

const ctx = self as unknown as {
  postMessage(msg: WorkerResponse): void;
  onmessage: ((e: MessageEvent<WorkerRequest>) => void) | null;
};

type Transcriber = (audio: Float32Array, options: { language: string; task: 'transcribe' }) => Promise<{ text: string } | { text: string }[]>;

let loading: Promise<Transcriber> | null = null;

function load(): Promise<Transcriber> {
  loading ??= pipeline(TASK, MODEL, {
    ...OPTIONS,
    progress_callback: (p) => {
      if (p.status === 'progress_total') ctx.postMessage({ type: 'progress', loaded: p.loaded, total: p.total });
    },
  })
    .then((asr) => asr as unknown as Transcriber)
    .catch((err) => {
      loading = null; // permite reintentar si falló la descarga
      throw err;
    });
  return loading;
}

ctx.onmessage = async ({ data }) => {
  const { id } = data;
  try {
    switch (data.type) {
      case 'check': {
        const cached = await ModelRegistry.is_pipeline_cached(TASK, MODEL, OPTIONS).catch(() => false);
        ctx.postMessage({ id, type: 'cached', cached });
        break;
      }
      case 'load':
        await load();
        ctx.postMessage({ id, type: 'ready' });
        break;
      case 'transcribe': {
        const asr = await load();
        const out = await asr(data.audio, { language: 'spanish', task: 'transcribe' });
        const text = (Array.isArray(out) ? out.map((o) => o.text).join(' ') : out.text).trim();
        ctx.postMessage({ id, type: 'result', text });
        break;
      }
    }
  } catch (err) {
    ctx.postMessage({
      id,
      type: 'error',
      code: data.type === 'transcribe' ? 'transcribe' : 'model-load',
      message: err instanceof Error ? err.message : String(err),
    });
  }
};
