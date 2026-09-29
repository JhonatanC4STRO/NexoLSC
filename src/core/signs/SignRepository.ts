import type { SignEntry, SignKind } from './types';
import { LSC_ALPHABET } from './alphabet.lsc';

/**
 * Punto único de acceso al léxico. Hoy es un arreglo en memoria; en fases
 * futuras puede leer un JSON remoto o una API sin cambiar a quienes lo usan.
 */
export class SignRepository {
  private byKey = new Map<string, SignEntry>();

  constructor(entries: SignEntry[]) {
    for (const entry of entries) this.byKey.set(key(entry.kind, entry.gloss), entry);
  }

  find(kind: SignKind, gloss: string): SignEntry | undefined {
    return this.byKey.get(key(kind, gloss));
  }

  findLetter(letter: string): SignEntry | undefined {
    return this.find('letter', letter);
  }

  all(kind?: SignKind): SignEntry[] {
    const list = [...this.byKey.values()];
    return kind ? list.filter((e) => e.kind === kind) : list;
  }
}

function key(kind: SignKind, gloss: string) {
  return `${kind}:${gloss}`;
}

export const signRepository = new SignRepository(LSC_ALPHABET);
