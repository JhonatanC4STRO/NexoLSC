import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { SignPlayer } from './core/player/SignPlayer';
import { buildQueue } from './core/player/queue';
import { signRepository } from './core/signs/SignRepository';
import { normalizeText } from './core/text/normalize';
import { Avatar3D, type CameraView } from './avatar/Avatar3D';
import { usePlayerClock } from './hooks/usePlayer';
import { useAvatarChoice } from './hooks/useAvatarChoice';
import { AvatarSelector } from './ui/AvatarSelector';
import { CameraViews } from './ui/CameraViews';
import { CurrentLetter } from './ui/CurrentLetter';
import { PlayerControls, SpeedControl } from './ui/PlayerControls';
import { LetterTimeline } from './ui/LetterTimeline';
import { SpeechButton } from './ui/SpeechButton';
import { Logo } from './ui/Logo';
import { PlayIcon } from './ui/icons';

/**
 * Pantalla «Escenario»: el avatar ocupa toda la pantalla y lo demás flota encima.
 * Arriba el logo y el avatar elegido; a la izquierda la letra actual; a la derecha la vista
 * de la cámara; abajo la barra para escribir, ver las letras y controlar la reproducción.
 */
export default function App() {
  const player = useMemo(() => new SignPlayer(), []);
  const [text, setText] = useState('');
  const [display, setDisplay] = useState('');
  const [skipped, setSkipped] = useState<string[]>([]);
  const [missing, setMissing] = useState<string[]>([]);
  const [view, setView] = useState<CameraView>('frente');
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
      <section className="scene" aria-label="Escenario del avatar">
        <Avatar3D
          player={player}
          avatar={avatarChoice.available ? avatarChoice.selected : undefined}
          onMissingClips={setMissing}
          view={view}
        />

        <header className="scene__top">
          <h1 className="plate plate--logo">
            <Logo size={36} />
          </h1>
          <div className="plate plate--group">
            <ValidationBadge />
            <AvatarSelector choice={avatarChoice} />
          </div>
        </header>

        <CurrentLetter player={player} />
        <CameraViews value={view} onChange={setView} />

        <div className="dock-wrap">
          <section className="dock" aria-label="Deletrear">
            <div className="dock__row">
              <LetterTimeline player={player} missing={missing} />
              <SpeedControl player={player} />
            </div>

            <form className="entry" onSubmit={onSubmit}>
              <label htmlFor="text" className="sr-only">
                Escribe una palabra o frase
              </label>
              <input
                id="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Escribe una palabra o frase…"
                maxLength={200}
                autoComplete="off"
              />
              <SpeechButton onResult={onSpeech} />
              <button type="submit" className="btn btn--primary entry__submit" disabled={!text.trim()} aria-label="Reproducir">
                <PlayIcon /> <span className="btn__label">Reproducir</span>
              </button>
              {display && (
                <p className="entry__note">
                  Se deletreará: <strong>{display}</strong>
                </p>
              )}
              {skipped.length > 0 && (
                <p className="entry__note entry__note--warn" role="status">
                  Omitidos (sin seña en el MVP): {skipped.join(' ')}
                </p>
              )}
            </form>

            <PlayerControls player={player} />
            {/* En el celular el estado de validación baja aquí; en pantallas anchas va en la cabecera. */}
            <div className="dock__badge">
              <ValidationBadge />
            </div>
          </section>
        </div>
      </section>

      <footer className="app__footer">
        <p>
          Letras basadas en el Diccionario Básico de la LSC (INSOR – Instituto Caro y Cuervo, 2006). Animaciones en
          validación con la comunidad sorda.
        </p>
        {avatarChoice.selected && (
          <p>
            Avatar: {avatarChoice.selected.name} · Licencia {avatarChoice.selected.license}
          </p>
        )}
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
      {done ? 'Aprobado' : 'Borrador'} · {approved} de {letters.length}
      <span className="status-badge__more">{' '}letras validadas</span>
    </span>
  );
}

function useKeyboardShortcuts(player: SignPlayer) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target;
      if (t instanceof HTMLInputElement || t instanceof HTMLButtonElement || t instanceof HTMLSelectElement) return;
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
