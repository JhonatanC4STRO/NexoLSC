import { AnimationAction, AnimationClip, AnimationMixer, LoopOnce, Object3D } from 'three';
import type { PlaybackFrame } from '../core/player/SignPlayer';
import type { SignEntry } from '../core/signs/types';

export const REST_CLIP = 'rest';

/**
 * Traduce un PlaybackFrame a pesos y tiempos de AnimationActions.
 * No avanza el tiempo por su cuenta: el SignPlayer es la única fuente de verdad.
 */
export class ClipDriver {
  private mixer: AnimationMixer;
  private actions = new Map<string, AnimationAction>();

  constructor(root: Object3D, clips: AnimationClip[]) {
    this.mixer = new AnimationMixer(root);
    for (const clip of clips) {
      const action = this.mixer.clipAction(clip);
      action.setLoop(LoopOnce, 1);
      action.clampWhenFinished = true;
      action.play();
      action.paused = true; // el tiempo lo fijamos manualmente
      action.setEffectiveWeight(0);
      this.actions.set(clip.name, action);
    }
  }

  has(clipName: string) {
    return this.actions.has(clipName);
  }

  missingClips(signs: SignEntry[]) {
    return signs.filter((s) => !this.has(s.animation.clip)).map((s) => s.gloss);
  }

  apply(frame: PlaybackFrame | null) {
    const weights = new Map<string, { weight: number; time: number }>();
    const set = (name: string, weight: number, progress: number) => {
      const action = this.actions.get(name) ?? this.actions.get(REST_CLIP);
      if (!action || weight <= 0) return;
      const key = action.getClip().name;
      const prev = weights.get(key);
      weights.set(key, { weight: (prev?.weight ?? 0) + weight, time: progress * action.getClip().duration });
    };

    if (!frame) {
      set(REST_CLIP, 1, 1);
    } else {
      const t = easeInOut(frame.transition);
      const fromClip = frame.from?.animation.clip ?? REST_CLIP;
      const toClip = frame.to?.animation.clip ?? REST_CLIP;
      if (frame.isRepeat) {
        // Letra repetida: pequeña "re-articulación" pasando cerca del reposo.
        const dip = Math.sin(Math.PI * t) * 0.5;
        set(REST_CLIP, dip, 1);
        set(toClip, 1 - dip, frame.progress);
      } else {
        set(fromClip, 1 - t, 1);
        set(toClip, t, frame.item.kind === 'pause' ? 1 : frame.progress);
      }
    }

    for (const [name, action] of this.actions) {
      const w = weights.get(name);
      action.setEffectiveWeight(w?.weight ?? 0);
      if (w) action.time = w.time;
    }
    this.mixer.update(0);
  }

  dispose() {
    this.mixer.stopAllAction();
    this.mixer.uncacheRoot(this.mixer.getRoot());
    this.actions.clear();
  }
}

function easeInOut(x: number) {
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}
