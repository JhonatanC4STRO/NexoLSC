import type { SignPlayer } from '../core/player/SignPlayer';
import { usePlayer } from '../hooks/usePlayer';

/** Las letras de la palabra (H O L A): resalta la actual y permite saltar a cualquiera. */
export function LetterTimeline({ player, missing }: { player: SignPlayer; missing: string[] }) {
  const { items, index, status } = usePlayer(player);
  if (items.length === 0) return null;

  const active = status !== 'idle';

  return (
    <ol className="timeline" aria-label="Progreso del deletreo">
      {items.map((item, i) =>
        item.kind === 'pause' ? (
          <li key={item.id} className="timeline__gap" aria-hidden="true" />
        ) : (
          <li key={item.id}>
            <button
              type="button"
              className={[
                'chip',
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
  );
}
