import type { SignPlayer } from '../core/player/SignPlayer';
import { usePlayer } from '../hooks/usePlayer';

/**
 * Sustituto del avatar mientras no exista el GLB. Permite desarrollar y
 * probar todo el flujo (texto, voz, cola, controles) desde el día 1.
 */
export function AvatarPlaceholder({ player, reason }: { player: SignPlayer; reason: string }) {
  const { items, index, status } = usePlayer(player);
  const item = status === 'idle' ? undefined : items[index];
  const sign = item?.kind === 'sign' ? item.sign : undefined;

  return (
    <div className="stage stage--placeholder" role="img" aria-label={sign ? `Letra ${sign.gloss}` : 'Avatar en reposo'}>
      <span className="placeholder__letter">{sign?.gloss ?? (item ? '·' : '🧍')}</span>
      {sign && <p className="placeholder__desc">{sign.handConfiguration.fingers}</p>}
      {sign?.movement.dynamic && <p className="placeholder__move">Movimiento: {sign.movement.description}</p>}
      <p className="placeholder__note">{reason} — modo de vista previa sin 3D</p>
    </div>
  );
}
