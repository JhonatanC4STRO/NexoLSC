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
