import { useId } from 'react';

/**
 * Logo de NexoLSC: dos arcos en «C» (la letra del alfabeto manual) enlazados, más el
 * logotipo «nexo» con la píldora «LSC». Los cortes (máscaras) muestran qué arco pasa
 * por encima: arriba el verde, abajo el amarillo. Colores desde los tokens de marca.
 */
export function Logo({ size = 40 }: { size?: number }) {
  const id = useId().replace(/:/g, '');
  return (
    <span className="logo" role="img" aria-label="NexoLSC" style={{ ['--logo-size' as string]: `${size}px` }}>
      <svg className="logo__mark" viewBox="0 0 64 64" width={size} height={size} aria-hidden="true" focusable="false">
        <defs>
          <mask id={`${id}-d`} maskUnits="userSpaceOnUse" x="0" y="0" width="64" height="64">
            <rect width="64" height="64" fill="#fff" />
            <path d="M28.79 18.84 A14 14 0 0 1 34.72 23" fill="none" stroke="#000" strokeWidth="13" strokeLinecap="round" />
          </mask>
          <mask id={`${id}-i`} maskUnits="userSpaceOnUse" x="0" y="0" width="64" height="64">
            <rect width="64" height="64" fill="#fff" />
            <path d="M29.28 41 A14 14 0 0 0 35.21 45.16" fill="none" stroke="#000" strokeWidth="13" strokeLinecap="round" />
          </mask>
        </defs>
        <g fill="none" strokeWidth="8" strokeLinecap="round">
          <path className="logo__arc-selva" mask={`url(#${id}-i)`} d="M34.72 23 A14 14 0 1 0 32.03 43.47" />
          <path className="logo__arc-mango" mask={`url(#${id}-d)`} d="M31.97 20.53 A14 14 0 1 1 29.28 41" />
        </g>
      </svg>
      <span className="logo__word" aria-hidden="true">
        nexo<span className="logo__pill">LSC</span>
      </span>
    </span>
  );
}
