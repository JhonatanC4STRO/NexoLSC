/**
 * Fondo del escenario del avatar.
 *
 * La imagen se muestra desenfocada y aclarada: el fondo da contexto (el lugar),
 * pero no debe competir con las manos, que es lo que la persona necesita leer.
 * Si el archivo no existe, el escenario queda con el gris liso de siempre.
 */
export const STAGE_BACKGROUND = {
  url: '/backgrounds/sena.jpg',
  /** Desenfoque en px. 0 = nítido (no recomendado para legibilidad de las manos). */
  blurPx: 5,
  /** Velo claro sobre la foto (0 = ninguno, 1 = gris liso). */
  veil: 0.35,
  /** Recorte de la foto: qué parte queda visible detrás del avatar. */
  position: 'center 35%',
};
