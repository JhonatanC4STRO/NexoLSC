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
