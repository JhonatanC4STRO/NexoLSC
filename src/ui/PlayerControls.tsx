import { SPEEDS, type SignPlayer } from '../core/player/SignPlayer';
import { usePlayer } from '../hooks/usePlayer';

export function PlayerControls({ player }: { player: SignPlayer }) {
  const { status, items, speed, loop } = usePlayer(player);
  const empty = items.length === 0;
  const playing = status === 'playing';

  return (
    <div className="controls">
      <div className="controls__main" role="group" aria-label="Controles de reproducción">
        <button type="button" className="btn" onClick={() => player.restart()} disabled={empty} title="Reiniciar (R)">
          ↶ Reiniciar
        </button>
        <button type="button" className="btn" onClick={() => player.prev()} disabled={empty} title="Letra anterior (←)" aria-label="Letra anterior">
          ⏮
        </button>
        <button type="button" className="btn btn--primary" onClick={() => player.togglePlay()} disabled={empty} title="Reproducir / Pausar (Espacio)">
          {playing ? '⏸ Pausar' : status === 'paused' ? '▶ Continuar' : '▶ Reproducir'}
        </button>
        <button type="button" className="btn" onClick={() => player.next()} disabled={empty} title="Letra siguiente (→)" aria-label="Letra siguiente">
          ⏭
        </button>
        <button type="button" className="btn" onClick={() => player.stop()} disabled={empty || status === 'idle'} title="Detener">
          ⏹ Detener
        </button>
        <button type="button" className={`btn ${loop ? 'btn--active' : ''}`} onClick={() => player.setLoop(!loop)} aria-pressed={loop} title="Repetir la palabra">
          🔁 Repetir
        </button>
      </div>
      <div className="controls__speed" role="radiogroup" aria-label="Velocidad">
        <span>Velocidad:</span>
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
