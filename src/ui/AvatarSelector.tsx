import { AVATARS } from '../avatar/avatars';
import type { AvatarChoice } from '../hooks/useAvatarChoice';

/** Elegir avatar. Los que no tienen GLB aparecen deshabilitados; la licencia va en el título. */
export function AvatarSelector({ choice }: { choice: AvatarChoice }) {
  const { available, selected, select } = choice;
  if (!available) return null;

  return (
    <div className="avatar-selector">
      <label htmlFor="avatar">Avatar</label>
      <select
        id="avatar"
        value={selected?.id ?? ''}
        onChange={(e) => select(e.target.value)}
        disabled={!selected}
        title={selected ? `Licencia: ${selected.license}` : undefined}
      >
        {AVATARS.map((a) => (
          <option key={a.id} value={a.id} disabled={!available[a.id]}>
            {a.name}
            {available[a.id] ? '' : ' (no disponible)'}
          </option>
        ))}
      </select>
      {selected && !selected.publishable && <span className="avatar-selector__warn">No publicar: {selected.license}</span>}
    </div>
  );
}
