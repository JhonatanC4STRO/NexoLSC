import type { SignPlayer } from '../core/player/SignPlayer';
import { usePlayer } from '../hooks/usePlayer';

/**
 * Tarjeta flotante con la letra que se está señando, su posición en la palabra y cómo se pone
 * la mano. En pantallas estrechas se reduce a una píldora con la letra y el contador.
 */
export function CurrentLetter({ player }: { player: SignPlayer }) {
  const { items, index, status } = usePlayer(player);
  const signs = items.filter((i) => i.kind === 'sign');
  const active = status !== 'idle' && items.length > 0;
  const current = active ? items[index] : undefined;
  const sign = current?.kind === 'sign' ? current : undefined;

  if (signs.length === 0) {
    return (
      <section className="letter-card letter-card--empty" aria-label="Letra actual">
        <span className="letter-card__label">Letra actual</span>
        <span className="letter-card__letter" aria-hidden="true">·</span>
        <p className="letter-card__desc">Escribe una palabra abajo y pulsa Reproducir.</p>
      </section>
    );
  }

  const position = active ? items.slice(0, index + 1).filter((i) => i.kind === 'sign').length : 0;
  const word = sign
    ? signs.filter((i) => i.wordIndex === sign.wordIndex).map((i) => i.label).join('')
    : signs.map((i) => i.label).join('');

  return (
    <section className="letter-card" aria-label="Letra actual" aria-live="polite">
      <span className="letter-card__label">Letra actual</span>
      <span className="letter-card__letter">{sign?.label ?? '—'}</span>
      <span className="letter-card__count">
        {position} de {signs.length} · {word}
      </span>
      {sign && <p className="letter-card__desc">{sign.sign.handConfiguration.fingers}</p>}
    </section>
  );
}
