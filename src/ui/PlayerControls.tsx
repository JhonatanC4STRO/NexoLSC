import { SPEEDS, type SignPlayer } from '../core/player/SignPlayer';
import { usePlayer } from '../hooks/usePlayer';
import { NextIcon, PauseIcon, PlayIcon, PrevIcon, RepeatIcon, RestartIcon, StopIcon } from './icons';

/** Controles de reproducción: anterior · reproducir/pausar · siguiente, más reiniciar, detener y repetir. */
export function PlayerControls({ player }: { player: SignPlayer }) {
  const { status, items, loop } = usePlayer(player);
  const empty = items.length === 0;
  const playing = status === 'playing';
  const playLabel = playing ? 'Pausar' : status === 'paused' ? 'Continuar' : 'Reproducir';

  return (
    <div className="controls" role="group" aria-label="Controles de reproducción">
      <button type="button" className="btn btn--quiet" onClick={() => player.restart()} disabled={empty} title="Reiniciar (R)" aria-label="Reiniciar">
        <RestartIcon /> <span className="btn__label">Reiniciar</span>
      </button>
      <button type="button" className="btn btn--round" onClick={() => player.prev()} disabled={empty} title="Letra anterior (←)" aria-label="Letra anterior">
        <PrevIcon />
      </button>
      <button type="button" className="btn btn--round btn--big" onClick={() => player.togglePlay()} disabled={empty} title={`${playLabel} (Espacio)`} aria-label={playLabel}>
        {playing ? <PauseIcon /> : <PlayIcon />}
      </button>
      <button type="button" className="btn btn--round" onClick={() => player.next()} disabled={empty} title="Letra siguiente (→)" aria-label="Letra siguiente">
        <NextIcon />
      </button>
      <button type="button" className={`btn btn--quiet ${loop ? 'btn--active' : ''}`} onClick={() => player.setLoop(!loop)} aria-pressed={loop} title="Repetir la palabra" aria-label="Repetir">
        <RepeatIcon /> <span className="btn__label">Repetir</span>
      </button>
      <button type="button" className="btn btn--quiet" onClick={() => player.stop()} disabled={empty || status === 'idle'} title="Detener" aria-label="Detener">
        <StopIcon /> <span className="btn__label">Detener</span>
      </button>
    </div>
  );
}

/**
 * Velocidad: en pantallas anchas, todas las opciones a la vista; en el celular, un solo
 * botón que pasa a la siguiente velocidad en cada toque.
 */
export function SpeedControl({ player }: { player: SignPlayer }) {
  const { speed } = usePlayer(player);
  const next = SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length];
  const fmt = (s: number) => `${String(s).replace('.', ',')}x`;

  return (
    <>
      <div className="speed" role="radiogroup" aria-label="Velocidad">
        <span className="speed__label">Velocidad</span>
        {SPEEDS.map((s) => (
          <button
            key={s}
            type="button"
            role="radio"
            aria-checked={s === speed}
            className={`speed__opt ${s === speed ? 'is-on' : ''}`}
            onClick={() => player.setSpeed(s)}
          >
            {fmt(s)}
          </button>
        ))}
      </div>
      <button
        type="button"
        className="btn btn--quiet speed-cycle"
        onClick={() => player.setSpeed(next)}
        aria-label={`Velocidad ${fmt(speed)}. Cambiar a ${fmt(next)}`}
      >
        {fmt(speed)}
      </button>
    </>
  );
}
