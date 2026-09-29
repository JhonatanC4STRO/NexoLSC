# assets-src

Archivos fuente pesados. **No se publican** (no están en `public/`).

## ⚠️ Avatar de prueba

`avatar/avatar.blend` y `textures/` son una copia del modelo de Miles Morales con tres Actions de
**prueba de pipeline**: `rest`, `sign_A` y `sign_L`. Estas poses **no están validadas** como letras de LSC.

- El personaje pertenece a terceros (Marvel/Sony): úsalo solo para desarrollo local.
- Por eso `avatar/*.blend`, `textures/` y `public/models/*.glb` están en `.gitignore` y **no** se suben
  al repositorio público.
- Antes de mostrar el MVP a usuarios o publicarlo, reemplázalo por un avatar legal
  (ver `docs/04-diseno-avatar.md`) y regenera `public/models/avatar.glb`.

## Regenerar el GLB

```bash
blender -b assets-src/avatar/avatar.blend --python tools/blender/export_avatar.py -- public/models/avatar.glb
```

Las texturas se buscan en `assets-src/textures/` (ruta relativa guardada en el `.blend`).
