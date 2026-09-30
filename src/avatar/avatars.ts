/**
 * Candidatos de avatar para comparar. Cada uno es un GLB con el mismo contrato:
 * esqueleto Rigify (huesos DEF-*) y clips "rest" + "sign_*".
 * Fuentes y scripts de cada candidato: assets-src/avatars/<id>/
 */
export interface AvatarOption {
  id: string;
  name: string;
  url: string;
  license: string;
  /** false = no puede publicarse (solo desarrollo local; su GLB está en .gitignore). */
  publishable: boolean;
}

export const AVATARS: AvatarOption[] = [
  {
    id: 'mpfb2-caricatura',
    name: 'MPFB2 · caricatura',
    url: '/models/avatars/mpfb2-caricatura.glb',
    license: 'CC0 (MakeHuman / MPFB2)',
    publishable: true,
  },
  {
    id: 'mpfb2',
    name: 'MPFB2 · hombre joven',
    url: '/models/avatars/mpfb2.glb',
    license: 'CC0 (MakeHuman / MPFB2)',
    publishable: true,
  },
  {
    id: 'miles-prueba',
    name: 'Prueba de pipeline (solo local)',
    url: '/models/avatars/miles-prueba.glb',
    license: 'Derechos de terceros — no publicar',
    publishable: false,
  },
];

export const DEFAULT_AVATAR_ID = 'mpfb2-caricatura';

/**
 * ¿Existe el GLB? Vite (y muchos hostings SPA) responden index.html con 200 para
 * rutas inexistentes, así que además del estado se valida que no sea HTML.
 */
export async function isModelAvailable(url: string): Promise<boolean> {
  try {
    const r = await fetch(url, { method: 'HEAD' });
    return r.ok && !(r.headers.get('content-type') ?? '').includes('text/html');
  } catch {
    return false;
  }
}
