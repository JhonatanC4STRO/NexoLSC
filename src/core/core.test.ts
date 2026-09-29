import { describe, expect, it } from 'vitest';
import { normalizeText } from './text/normalize';
import { buildQueue } from './player/queue';
import { SignPlayer } from './player/SignPlayer';
import { signRepository } from './signs/SignRepository';

const letters = (input: string) =>
  normalizeText(input)
    .tokens.map((t) => (t.type === 'letter' ? t.value : t.type === 'pause' ? '_' : t.type === 'number' ? `#${t.value}` : `?${t.source}`))
    .join('');

describe('normalizeText', () => {
  it('deletrea HOLA', () => expect(letters('hola')).toBe('HOLA'));
  it('quita tildes y diéresis pero conserva Ñ', () => expect(letters('Pingüino ñandú árbol')).toBe('PINGUINO_ÑANDU_ARBOL'));
  it('maneja signos de interrogación y espacios', () => {
    const r = normalizeText('¿Cómo estás?');
    expect(r.display).toBe('COMO ESTAS');
  });
  it('colapsa pausas y conserva la más fuerte', () => expect(letters('hola,   mundo. ¡sí!')).toBe('HOLA_MUNDO_SI'));
  it('reporta números y símbolos', () => expect(letters('casa 3 @')).toBe('CASA_#3?@'));
  it('limita la longitud', () => expect(normalizeText('a'.repeat(300)).truncated).toBe(true));
});

describe('buildQueue', () => {
  it('crea una seña por letra y marca repeticiones', () => {
    const { items, skipped } = buildQueue(normalizeText('calle 5').tokens, signRepository);
    expect(items.filter((i) => i.kind === 'sign').map((i) => i.label).join('')).toBe('CALLE');
    const repeats = items.filter((i) => i.kind === 'sign' && i.isRepeat).map((i) => i.label);
    expect(repeats).toEqual(['L']);
    expect(skipped).toEqual(['5']);
  });
  it('el alfabeto tiene 27 letras con clip', () => {
    expect(signRepository.all('letter')).toHaveLength(27);
    expect(signRepository.findLetter('Ñ')?.animation.clip).toBe('sign_ENYE');
  });
});

describe('SignPlayer', () => {
  const load = (text: string) => {
    const p = new SignPlayer();
    p.load(buildQueue(normalizeText(text).tokens, signRepository).items);
    return p;
  };
  const current = (p: SignPlayer) => p.getSnapshot().items[p.getSnapshot().index].label;

  it('reproduce en orden y termina', () => {
    const p = load('HOLA');
    p.play();
    const seen = [current(p)];
    for (let i = 0; i < 400; i++) {
      p.update(16);
      if (current(p) !== seen[seen.length - 1]) seen.push(current(p));
    }
    expect(seen.join('')).toBe('HOLA');
    expect(p.getSnapshot().status).toBe('ended');
  });

  it('pausa congela el tiempo', () => {
    const p = load('HOLA');
    p.play();
    p.pause();
    p.update(10_000);
    expect(current(p)).toBe('H');
  });

  it('la velocidad acorta la duración', () => {
    const slow = load('AB');
    const fast = load('AB');
    slow.setSpeed(0.5);
    fast.setSpeed(2);
    slow.play();
    fast.play();
    slow.update(900);
    fast.update(900);
    expect(current(slow)).toBe('A');
    expect(current(fast)).toBe('B');
  });

  it('seek, stop, restart y loop', () => {
    const p = load('HOLA');
    p.seek(2);
    expect(current(p)).toBe('L');
    expect(p.getSnapshot().status).toBe('paused');
    p.stop();
    expect(p.getFrame()).toBeNull();
    p.setLoop(true);
    p.restart();
    for (let i = 0; i < 400; i++) p.update(16);
    expect(p.getSnapshot().status).toBe('playing');
  });

  it('saltar a una letra en pausa muestra esa letra (sin quedarse en la transición)', () => {
    const p = load('LALA');
    p.play();
    p.pause();
    p.seek(2);
    const f = p.getFrame()!;
    expect(f.to?.gloss).toBe('L');
    expect(f.transition).toBe(1);
  });

  it('saltar mientras reproduce conserva la transición suave', () => {
    const p = load('LALA');
    p.play();
    p.seek(2);
    expect(p.getFrame()!.transition).toBe(0);
  });

  it('el frame de una pausa mantiene la última seña', () => {
    const p = load('A B');
    p.seek(1);
    const f = p.getFrame()!;
    expect(f.item.kind).toBe('pause');
    expect(f.to?.gloss).toBe('A');
  });
});
