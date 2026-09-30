/**
 * Íconos de la marca NexoLSC: cuadrícula de 24px, trazo de 2px, extremos redondeados,
 * una sola tinta (currentColor, heredan el color del botón). Decorativos: el botón
 * lleva el texto o un aria-label.
 */
import type { ReactNode } from 'react';

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      className="icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

export const PlayIcon = () => (
  <Icon>
    <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.4-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" />
  </Icon>
);

export const PauseIcon = () => (
  <Icon>
    <rect x="6" y="5" width="4" height="14" rx="1.5" />
    <rect x="14" y="5" width="4" height="14" rx="1.5" />
  </Icon>
);

export const StopIcon = () => (
  <Icon>
    <rect x="5.5" y="5.5" width="13" height="13" rx="3" />
  </Icon>
);

export const RestartIcon = () => (
  <Icon>
    <path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3" />
    <path d="M4 4v4.5h4.5" />
  </Icon>
);

export const RepeatIcon = () => (
  <Icon>
    <path d="M17 3.5l3 3-3 3" />
    <path d="M4 11.5v-1a4 4 0 0 1 4-4h12" />
    <path d="M7 20.5l-3-3 3-3" />
    <path d="M20 12.5v1a4 4 0 0 1-4 4H4" />
  </Icon>
);

export const MicIcon = () => (
  <Icon>
    <rect x="9" y="3" width="6" height="11" rx="3" />
    <path d="M5.5 11a6.5 6.5 0 0 0 13 0" />
    <path d="M12 17.5V21" />
  </Icon>
);

export const PrevIcon = () => (
  <Icon>
    <path d="M15.5 6l-6 6 6 6" />
  </Icon>
);

export const NextIcon = () => (
  <Icon>
    <path d="M8.5 6l6 6-6 6" />
  </Icon>
);
