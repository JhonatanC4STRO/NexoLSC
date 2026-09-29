import type { SignEntry } from './types';

/**
 * Alfabeto manual LSC (27 letras) según el Anexo "Alfabeto manual" del
 * Diccionario Básico de la Lengua de Señas Colombiana (INSOR / Instituto Caro y Cuervo, 2006), p. 573.
 *
 * IMPORTANTE: las descripciones de `fingers` son una LECTURA de la ilustración
 * de la fuente, no una definición propia. Todas empiezan en estado `draft` y
 * deben ser validadas por una persona sorda usuaria de LSC o un intérprete
 * certificado antes de pasar a `approved`.
 */

const SOURCE_DBLSC = { id: 'dblsc-2006', locator: 'Anexos, Alfabeto manual, p. 573' };

const STATIC_HOLD_MS = 600;
const DYNAMIC_MS = 950;
const TRANSITION_MS = 250;

interface LetterSpec {
  letter: string;
  name: string;
  fingers: string;
  movement?: string;
}

const LETTERS: LetterSpec[] = [
  { letter: 'A', name: 'a', fingers: 'Puño cerrado; pulgar extendido y apoyado al costado del índice.' },
  { letter: 'B', name: 'be', fingers: 'Índice, medio, anular y meñique extendidos y juntos hacia arriba; pulgar doblado sobre la palma.' },
  { letter: 'C', name: 'ce', fingers: 'Dedos y pulgar curvados formando una "C", sin tocarse.' },
  { letter: 'D', name: 'de', fingers: 'Índice extendido hacia arriba; medio, anular y meñique curvados en contacto con el pulgar.' },
  { letter: 'E', name: 'e', fingers: 'Dedos flexionados con las puntas hacia la palma; pulgar doblado bajo ellos.' },
  { letter: 'F', name: 'efe', fingers: 'Índice extendido hacia arriba con el pulgar en contacto lateral; medio, anular y meñique cerrados. (Verificar.)' },
  { letter: 'G', name: 'ge', fingers: 'Mano cerrada con el índice extendido en diagonal. (Verificar posición del pulgar.)', movement: 'Flecha curva junto a la punta del índice: giro/flexión corta.' },
  { letter: 'H', name: 'hache', fingers: 'Índice y medio extendidos juntos en diagonal; pulgar sobre anular y meñique flexionados.', movement: 'Flecha diagonal: desplazamiento corto hacia abajo/adelante.' },
  { letter: 'I', name: 'i', fingers: 'Meñique extendido hacia arriba; demás dedos cerrados con el pulgar sobre ellos.' },
  { letter: 'J', name: 'jota', fingers: 'Configuración de la I (meñique extendido).', movement: 'El meñique traza una curva descendente en forma de "J".' },
  { letter: 'K', name: 'ka', fingers: 'Índice extendido hacia arriba, medio extendido hacia adelante, pulgar en contacto con el medio; anular y meñique cerrados.' },
  { letter: 'L', name: 'ele', fingers: 'Índice extendido hacia arriba y pulgar extendido en horizontal formando una "L"; demás dedos cerrados.' },
  { letter: 'M', name: 'eme', fingers: 'Puño con índice, medio y anular doblados sobre el pulgar.' },
  { letter: 'N', name: 'ene', fingers: 'Puño con índice y medio doblados sobre el pulgar.' },
  { letter: 'Ñ', name: 'eñe', fingers: 'Configuración de la N.', movement: 'Flecha doble: oscilación lateral de la muñeca.' },
  { letter: 'O', name: 'o', fingers: 'Todos los dedos curvados tocando la punta del pulgar, formando una "O".' },
  { letter: 'P', name: 'pe', fingers: 'Mano orientada hacia abajo: índice extendido hacia abajo, medio flexionado hacia adelante, pulgar entre ellos. (Verificar.)' },
  { letter: 'Q', name: 'cu', fingers: 'Puntas de todos los dedos reunidas con el pulgar, apuntando hacia arriba. (Verificar.)' },
  { letter: 'R', name: 'erre', fingers: 'Índice y medio extendidos y cruzados; anular y meñique cerrados con el pulgar.' },
  { letter: 'S', name: 'ese', fingers: 'Índice extendido, demás dedos cerrados. (Verificar si participa el medio.)', movement: 'Traza una "S" en el aire.' },
  { letter: 'T', name: 'te', fingers: 'Medio, anular y meñique extendidos hacia arriba; índice flexionado en contacto con el pulgar. (Verificar.)' },
  { letter: 'U', name: 'u', fingers: 'Dos dedos extendidos y separados con los intermedios flexionados (lectura: índice y meñique). (VERIFICAR.)' },
  { letter: 'V', name: 'uve', fingers: 'Índice y medio extendidos y separados en "V"; anular y meñique cerrados con el pulgar.' },
  { letter: 'W', name: 'uve doble', fingers: 'Índice, medio y anular extendidos y separados; el pulgar sujeta el meñique.' },
  { letter: 'X', name: 'equis', fingers: 'Índice flexionado en gancho; demás dedos cerrados.' },
  { letter: 'Y', name: 'ye', fingers: 'Pulgar y meñique extendidos; demás dedos cerrados.' },
  { letter: 'Z', name: 'zeta', fingers: 'Índice y medio extendidos juntos hacia arriba.', movement: 'Traza una "Z" en el aire.' },
];

export const LSC_ALPHABET: SignEntry[] = LETTERS.map(({ letter, name, fingers, movement }) => ({
  id: `lsc.letter.${letter}`,
  kind: 'letter',
  gloss: letter,
  name,
  language: 'LSC',
  animation: {
    // Nombres de clip solo ASCII para evitar problemas de codificación en Blender/glTF.
    clip: `sign_${letter === 'Ñ' ? 'ENYE' : letter}`,
    pack: 'avatar',
    durationMs: movement ? DYNAMIC_MS : STATIC_HOLD_MS,
    transitionMs: TRANSITION_MS,
  },
  handConfiguration: { handshape: letter, fingers, hand: 'dominant' },
  movement: { dynamic: Boolean(movement), description: movement },
  description: `Letra ${letter} del alfabeto manual LSC.`,
  sources: [SOURCE_DBLSC],
  validation: { status: 'draft' },
  tags: ['alfabeto', 'dactilologia'],
}));
