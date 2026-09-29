import { useEffect, useSyncExternalStore } from 'react';
import type { SignPlayer } from '../core/player/SignPlayer';

/** Suscribe un componente al estado discreto del reproductor. */
export function usePlayer(player: SignPlayer) {
  return useSyncExternalStore(player.subscribe, player.getSnapshot);
}

/** Único reloj de la app: avanza el reproductor en cada frame del navegador. */
export function usePlayerClock(player: SignPlayer) {
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      // Se limita dt para que un cambio de pestaña no salte varias letras de golpe.
      player.update(Math.min(now - last, 100));
      last = now;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [player]);
}
