/**
 * Modelo de datos de una seña. Una letra del alfabeto manual es solo un
 * tipo de seña (`kind: 'letter'`); el mismo modelo sirve luego para
 * palabras, números y expresiones no manuales.
 */

export type SignKind = 'letter' | 'number' | 'word' | 'phrase' | 'nonmanual';

/** Estado de validación lingüística: nada llega a "approved" sin revisión de una persona sorda usuaria de LSC. */
export type ValidationStatus = 'draft' | 'in_review' | 'approved' | 'rejected';

export type Hand = 'dominant' | 'non_dominant' | 'both';

export interface HandConfiguration {
  /** Etiqueta de configuración manual según la tabla del DBLSC ("mano en A", "mano en 5"...). */
  handshape: string;
  /** Descripción legible de los dedos (se completa a partir de la fuente, no se inventa). */
  fingers: string;
  /** Orientación de la palma respecto a quien seña. */
  palmOrientation?: 'forward' | 'backward' | 'inward' | 'outward' | 'up' | 'down' | 'side';
  /** Ubicación en el espacio de señado. */
  location?: string;
  hand: Hand;
}

export interface SignMovement {
  /** true si la letra tiene trayectoria o movimiento interno (J, Ñ, S, Z…). */
  dynamic: boolean;
  /** Descripción de la trayectoria según la fuente (flechas de la ilustración). */
  description?: string;
}

export interface SourceReference {
  /** Identificador de la fuente en docs/12-fuentes-alfabeto-lsc.md */
  id: string;
  /** Ubicación exacta dentro de la fuente (página, minuto de video…). */
  locator: string;
}

export interface AnimationRef {
  /** Nombre del AnimationClip dentro del GLB (p. ej. "sign_A"). */
  clip: string;
  /** Archivo/paquete que contiene el clip. Permite cargar paquetes bajo demanda en fases futuras. */
  pack: string;
  /** Duración del tramo principal en ms a velocidad 1x (hold para estáticas, clip para dinámicas). */
  durationMs: number;
  /** Duración de la transición desde la seña anterior en ms a velocidad 1x. */
  transitionMs: number;
}

export interface SignEntry {
  /** ID estable y único: "lsc.letter.A", "lsc.word.CASA"… */
  id: string;
  kind: SignKind;
  /** Glosa (convención: mayúsculas). Para letras, la letra misma. */
  gloss: string;
  /** Nombre en español para mostrar ("a", "eñe"…). */
  name: string;
  language: 'LSC';
  animation: AnimationRef;
  handConfiguration: HandConfiguration;
  movement: SignMovement;
  description: string;
  sources: SourceReference[];
  validation: {
    status: ValidationStatus;
    reviewedBy?: string;
    reviewedAt?: string;
    notes?: string;
  };
  tags?: string[];
}
