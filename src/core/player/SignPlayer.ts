import type { SignEntry } from '../signs/types';
import type { QueueItem } from './queue';

export type PlayerStatus = 'idle' | 'playing' | 'paused' | 'ended';

export const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2] as const;
export type Speed = (typeof SPEEDS)[number];

/** Estado discreto para la UI (cambia pocas veces por segundo). */
export interface PlayerSnapshot {
  status: PlayerStatus;
  items: readonly QueueItem[];
  index: number;
  speed: Speed;
  loop: boolean;
}

/** Estado continuo para el renderizador 3D (se lee en cada frame, no provoca renders de React). */
export interface PlaybackFrame {
  item: QueueItem;
  /** Seña desde la que se transiciona (null = pose de reposo). */
  from: SignEntry | null;
  /** Seña objetivo (null = pose de reposo). En pausas es la última seña mostrada. */
  to: SignEntry | null;
  isRepeat: boolean;
  /** 0..1 dentro de la transición. */
  transition: number;
  /** 0..1 dentro del tramo principal (hold o clip dinámico). */
  progress: number;
}

type Listener = () => void;

/**
 * Motor de reproducción independiente del framework y del motor 3D.
 * El tiempo lo controla el propio reproductor mediante `update(dtMs)`, lo que
 * hace triviales pausar, cambiar velocidad, saltar y probarlo sin navegador.
 */
export class SignPlayer {
  private items: QueueItem[] = [];
  private index = 0;
  private elapsedMs = 0;
  private status: PlayerStatus = 'idle';
  private speed: Speed = 1;
  private loop = false;
  private listeners = new Set<Listener>();
  private snapshot: PlayerSnapshot = this.buildSnapshot();

  // --- API pública -------------------------------------------------------

  load(items: QueueItem[]) {
    this.items = items;
    this.index = 0;
    this.elapsedMs = 0;
    this.status = 'idle';
    this.emit();
  }

  play() {
    if (this.items.length === 0) return;
    if (this.status === 'ended') this.rewind();
    this.status = 'playing';
    this.emit();
  }

  pause() {
    if (this.status !== 'playing') return;
    this.status = 'paused';
    this.emit();
  }

  togglePlay() {
    if (this.status === 'playing') this.pause();
    else this.play();
  }

  stop() {
    this.rewind();
    this.status = 'idle';
    this.emit();
  }

  restart() {
    this.rewind();
    this.play();
  }

  /**
   * Salta a un elemento de la cola. Mantiene el estado actual (si estaba pausado, sigue pausado).
   * Reproduciendo: arranca con la transición suave. Detenido: salta la transición para que
   * el avatar muestre de inmediato la seña elegida (si no, quedaría congelado en la anterior).
   */
  seek(index: number) {
    if (this.items.length === 0) return;
    this.index = clamp(index, 0, this.items.length - 1);
    this.elapsedMs = this.status === 'playing' ? 0 : this.items[this.index].transitionMs;
    if (this.status === 'ended' || this.status === 'idle') this.status = 'paused';
    this.emit();
  }

  next() {
    this.seek(this.index + 1);
  }

  prev() {
    this.seek(this.index - 1);
  }

  setSpeed(speed: Speed) {
    this.speed = speed;
    this.emit();
  }

  setLoop(loop: boolean) {
    this.loop = loop;
    this.emit();
  }

  /** Avanza el reloj. Llamar desde un bucle requestAnimationFrame. */
  update(dtMs: number) {
    if (this.status !== 'playing' || this.items.length === 0) return;
    this.elapsedMs += dtMs * this.speed;
    let changed = false;
    while (this.elapsedMs >= totalMs(this.items[this.index])) {
      this.elapsedMs -= totalMs(this.items[this.index]);
      if (this.index < this.items.length - 1) {
        this.index++;
      } else if (this.loop) {
        this.index = 0;
      } else {
        this.elapsedMs = totalMs(this.items[this.index]);
        this.status = 'ended';
        this.emit();
        return;
      }
      changed = true;
    }
    if (changed) this.emit();
  }

  /** Estado continuo; null cuando no hay nada que mostrar (reposo). */
  getFrame(): PlaybackFrame | null {
    if (this.status === 'idle' || this.items.length === 0) return null;
    const item = this.items[this.index];
    const from = this.lastSignBefore(this.index);
    const to = item.kind === 'sign' ? item.sign : from;
    const transition = item.transitionMs > 0 ? clamp(this.elapsedMs / item.transitionMs, 0, 1) : 1;
    const progress = clamp((this.elapsedMs - item.transitionMs) / item.durationMs, 0, 1);
    return { item, from, to, isRepeat: item.kind === 'sign' && item.isRepeat, transition, progress };
  }

  // --- Suscripción (compatible con useSyncExternalStore) -----------------

  subscribe = (listener: Listener) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getSnapshot = () => this.snapshot;

  // --- Internos ----------------------------------------------------------

  private rewind() {
    this.index = 0;
    this.elapsedMs = 0;
  }

  private lastSignBefore(index: number): SignEntry | null {
    for (let i = index - 1; i >= 0; i--) {
      const it = this.items[i];
      if (it.kind === 'sign') return it.sign;
    }
    return null;
  }

  private buildSnapshot(): PlayerSnapshot {
    return { status: this.status, items: this.items, index: this.index, speed: this.speed, loop: this.loop };
  }

  private emit() {
    this.snapshot = this.buildSnapshot();
    this.listeners.forEach((l) => l());
  }
}

function totalMs(item: QueueItem) {
  return item.transitionMs + item.durationMs;
}

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}
