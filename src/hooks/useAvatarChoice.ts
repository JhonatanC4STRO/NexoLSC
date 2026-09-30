import { useEffect, useState } from 'react';
import { AVATARS, DEFAULT_AVATAR_ID, isModelAvailable, type AvatarOption } from '../avatar/avatars';

const STORAGE_KEY = 'nexolsc.avatar';

export interface AvatarChoice {
  /** null mientras se comprueba qué GLB existen. */
  available: Record<string, boolean> | null;
  /** Avatar en uso; null si no hay ninguno disponible. */
  selected: AvatarOption | null;
  select: (id: string) => void;
}

/** Comprueba qué candidatos tienen GLB y recuerda la elección del usuario en este navegador. */
export function useAvatarChoice(): AvatarChoice {
  const [available, setAvailable] = useState<Record<string, boolean> | null>(null);
  const [chosenId, setChosenId] = useState<string | null>(() => readStored());

  useEffect(() => {
    let cancelled = false;
    Promise.all(AVATARS.map(async (a) => [a.id, await isModelAvailable(a.url)] as const)).then((entries) => {
      if (!cancelled) setAvailable(Object.fromEntries(entries));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const selected = available ? pickAvailable(available, chosenId) : null;

  const select = (id: string) => {
    setChosenId(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // Almacenamiento bloqueado (modo privado, etc.): la elección vale solo para esta sesión.
    }
  };

  return { available, selected, select };
}

function pickAvailable(available: Record<string, boolean>, chosenId: string | null): AvatarOption | null {
  const order = [chosenId, DEFAULT_AVATAR_ID, ...AVATARS.map((a) => a.id)];
  const id = order.find((candidate) => candidate && available[candidate]);
  return AVATARS.find((a) => a.id === id) ?? null;
}

function readStored(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}
