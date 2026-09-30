import { AVATARS } from '../avatar/avatars';
import type { AvatarChoice } from '../hooks/useAvatarChoice';

/** Permite comparar los candidatos de avatar. Los que no tienen GLB aparecen deshabilitados. */
export function AvatarSelector({ choice }: { choice: AvatarChoice }) {
  const { available, selected, select } = choice;
  if (!available) return null;

  return (
    <div className="avatar-selector">
      <label htmlFor="avatar">Avatar</label>
      <select id="avatar" value={selected?.id ?? ''} onChange={(e) => select(e.target.value)} disabled={!selected}>
        {AVATARS.map((a) => (
          <option key={a.id} value={a.id} disabled={!available[a.id]}>
            {a.name}
            {available[a.id] ? '' : ' (no disponible)'}
          </option>
        ))}
      </select>
      {selected && (
        <span className={`avatar-selector__license ${selected.publishable ? '' : 'avatar-selector__license--warn'}`}>
          Licencia: {selected.license}
        </span>
      )}
    </div>
  );
}
