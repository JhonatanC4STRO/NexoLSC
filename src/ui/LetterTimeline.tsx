import type { SignPlayer } from '../core/player/SignPlayer';
import { usePlayer } from '../hooks/usePlayer';

/** Muestra H → O → L → A, resalta la letra actual y permite saltar a cualquiera. */
export function LetterTimeline({ player, missing }: { player: SignPlayer; missing: string[] }) {
  const { items, index, status } = usePlayer(player);
  if (items.length === 0) return null;

  const signs = items.filter((i) => i.kind === 'sign');
  const current = items[index];
  const position = items.slice(0, index + 1).filter((i) => i.kind === 'sign').length;
  const active = status !== 'idle';

  return (
    <section className="timeline" aria-label="Progreso del deletreo">
      <div className="timeline__status" aria-live="polite">
        <span>
          Letra actual: <strong>{active && current.kind === 'sign' ? current.label : '—'}</strong>
        </span>
        <span>
          {active ? position : 0} / {signs.length}
        </span>
      </div>
      <ol className="timeline__chips">
        {items.map((item, i) =>
          item.kind === 'pause' ? (
            <li key={item.id} className="timeline__gap" aria-hidden="true" />
          ) : (
            <li key={item.id}>
              <button
                type="button"
                className={[
                  'chip',
                  'chip--letter',
                  active && i === index ? 'chip--current' : '',
                  active && i < index ? 'chip--done' : '',
                  missing.includes(item.label) ? 'chip--missing' : '',
                ].join(' ')}
                onClick={() => player.seek(i)}
                aria-current={active && i === index ? 'step' : undefined}
                title={missing.includes(item.label) ? 'Animación pendiente' : `Ir a ${item.label}`}
              >
                {item.label}
              </button>
            </li>
          ),
        )}
      </ol>
    </section>
  );
}
