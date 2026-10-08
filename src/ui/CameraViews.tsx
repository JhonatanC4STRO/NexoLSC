import type { CameraView } from '../avatar/Avatar3D';

const VIEWS: { id: CameraView; label: string; hint: string }[] = [
  { id: 'frente', label: 'Frente', hint: 'Ver al avatar de frente' },
  { id: 'perfil', label: 'Perfil', hint: 'Ver la mano de lado' },
  { id: 'mano', label: 'Mano', hint: 'Acercar la cámara a la mano' },
];

/** Botones para cambiar el punto de vista de la cámara. */
export function CameraViews({ value, onChange }: { value: CameraView; onChange: (v: CameraView) => void }) {
  return (
    <nav className="views" aria-label="Vista de la cámara">
      {VIEWS.map((v) => (
        <button
          key={v.id}
          type="button"
          className={`views__btn ${value === v.id ? 'is-on' : ''}`}
          aria-pressed={value === v.id}
          title={v.hint}
          onClick={() => onChange(v.id)}
        >
          {v.label}
        </button>
      ))}
    </nav>
  );
}
