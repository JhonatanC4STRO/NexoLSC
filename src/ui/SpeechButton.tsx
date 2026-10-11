import { useRef, useState } from 'react';
import {
  pickSpeechProvider,
  whisperProvider,
  type SpeechStatus,
  type SpeechToTextProvider,
} from '../speech/speechToText';
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
  'audio-capture': 'No se encontró un micrófono.',
  'model-load': 'No se pudo descargar el modelo de voz. Revisa tu conexión e intenta de nuevo.',
  transcribe: 'No se pudo convertir la voz en texto. Intenta de nuevo.',
};

/** Errores de la voz del navegador que se pueden resolver con la voz local (p. ej. Brave). */
const FALLBACK_ERRORS = new Set(['network', 'service-not-allowed']);

const mb = (bytes: number) => Math.round(bytes / 1e6);

export function SpeechButton({ onResult, provider: initial }: Props) {
  const [provider, setProvider] = useState<SpeechToTextProvider>(() => initial ?? pickSpeechProvider());
  const [listening, setListening] = useState(false);
  const [status, setStatus] = useState<SpeechStatus | null>(null);
  const [consentMB, setConsentMB] = useState(0);
  const [interim, setInterim] = useState('');
  const [error, setError] = useState<string | null>(null);
  const stopRef = useRef<() => void>(() => {});
  const supported = provider.isSupported();

  const begin = () => {
    setConsentMB(0);
    setError(null);
    setInterim('');
    setListening(true);
    stopRef.current = provider.start('es-CO', {
      onInterim: setInterim,
      onStatus: setStatus,
      onFinal: (text) => {
        setInterim('');
        onResult(text);
      },
      onError: (code) => {
        if (FALLBACK_ERRORS.has(code) && !provider.local && whisperProvider.isSupported()) {
          setProvider(whisperProvider);
          setError('La voz del navegador no respondió. Toca el micrófono otra vez para usar la voz local.');
          return;
        }
        setError(ERRORS[code] ?? `Error de voz: ${code}`);
      },
      onEnd: () => {
        setListening(false);
        setStatus(null);
      },
    });
  };

  const toggle = async () => {
    if (listening) {
      stopRef.current();
      return;
    }
    // Antes de la primera descarga, se avisa del tamaño y se pide permiso.
    const pending = (await provider.pendingDownloadMB?.()) ?? 0;
    if (pending > 0) {
      setError(null);
      setConsentMB(pending);
      return;
    }
    begin();
  };

  if (!supported) {
    return (
      <p className="speech__note">
        Voz no disponible en este navegador. Escribe el texto, o usa Chrome, Edge o Safari.
      </p>
    );
  }

  const label =
    status?.phase === 'downloading'
      ? 'Descargando el modelo de voz… toca para cancelar'
      : status?.phase === 'transcribing'
        ? 'Convirtiendo tu voz en texto…'
        : listening
          ? 'Escuchando… toca para detener'
          : 'Hablar';

  return (
    <>
      <button
        type="button"
        className={`btn btn--round ${listening && status?.phase !== 'downloading' ? 'btn--recording' : ''}`}
        onClick={toggle}
        disabled={status?.phase === 'transcribing'}
        aria-pressed={listening}
        aria-label={label}
        title={label}
      >
        <MicIcon />
      </button>

      {consentMB > 0 && (
        <div className="speech__consent" role="group" aria-labelledby="speech-consent-text">
          <p id="speech-consent-text">
            Tu navegador no trae reconocimiento de voz. Puedes usar uno que funciona <strong>dentro de tu
            equipo</strong>: se descarga una sola vez (unos <strong>{consentMB} MB</strong>, mejor con wifi) y queda
            guardado. Tu voz no sale de tu equipo.
          </p>
          <div className="speech__consent-actions">
            <button type="button" className="btn btn--primary" onClick={begin}>
              Descargar y hablar
            </button>
            <button type="button" className="btn btn--quiet" onClick={() => setConsentMB(0)}>
              Ahora no
            </button>
          </div>
        </div>
      )}

      {status?.phase === 'downloading' && (
        <div className="speech__note speech__progress" role="status">
          <span>
            Descargando el modelo de voz… {mb(status.loaded)} de {mb(status.total)} MB
          </span>
          <progress value={status.loaded} max={status.total} aria-label="Descarga del modelo de voz" />
        </div>
      )}
      {status?.phase === 'listening' && provider.local && (
        <span className="speech__note speech__note--interim" role="status">
          Escuchando… di la palabra y haz una pausa.
        </span>
      )}
      {status?.phase === 'transcribing' && (
        <span className="speech__note speech__note--interim" role="status">
          Convirtiendo tu voz en texto…
        </span>
      )}
      {interim && <span className="speech__note speech__note--interim">“{interim}”</span>}
      {error && (
        <span className="speech__note speech__note--error" role="alert">
          {error}
        </span>
      )}
    </>
  );
}
