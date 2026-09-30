import { SPEEDS, type SignPlayer } from '../core/player/SignPlayer';
import { usePlayer } from '../hooks/usePlayer';
import { NextIcon, PauseIcon, PlayIcon, PrevIcon, RepeatIcon, RestartIcon, StopIcon } from './icons';

export function PlayerControls({ player }: { player: SignPlayer }) {
  const { status, items, speed, loop } = usePlayer(player);
  const empty = items.length === 0;
  const playing = status === 'playing';

  return (
    <div className="controls">
      <div className="controls__main" role="group" aria-label="Controles de reproducción">
        <button type="button" className="btn btn--icon" onClick={() => player.prev()} disabled={empty} title="Letra anterior (←)" aria-label="Letra anterior">
          <PrevIcon />
        </button>
        <button type="button" className="btn btn--primary btn--play" onClick={() => player.togglePlay()} disabled={empty} title="Reproducir / Pausar (Espacio)">
          {playing ? <PauseIcon /> : <PlayIcon />}
          {playing ? 'Pausar' : status === 'paused' ? 'Continuar' : 'Reproducir'}
        </button>
        <button type="button" className="btn btn--icon" onClick={() => player.next()} disabled={empty} title="Letra siguiente (→)" aria-label="Letra siguiente">
          <NextIcon />
        </button>
      </div>
      <div className="controls__main" role="group" aria-label="Más controles">
        <button type="button" className="btn" onClick={() => player.restart()} disabled={empty} title="Reiniciar (R)">
          <RestartIcon /> Reiniciar
        </button>
        <button type="button" className="btn" onClick={() => player.stop()} disabled={empty || status === 'idle'} title="Detener">
          <StopIcon /> Detener
        </button>
        <button type="button" className={`btn ${loop ? 'btn--active' : ''}`} onClick={() => player.setLoop(!loop)} aria-pressed={loop} title="Repetir la palabra">
          <RepeatIcon /> Repetir
        </button>
      </div>
      <div className="controls__speed" role="radiogroup" aria-label="Velocidad">
        <span>Velocidad</span>
        {SPEEDS.map((s) => (
          <button
            key={s}
            type="button"
            role="radio"
            aria-checked={s === speed}
            className={`chip ${s === speed ? 'chip--active' : ''}`}
            onClick={() => player.setSpeed(s)}
          >
            {s}x
          </button>
        ))}
      </div>
    </div>
  );
}
