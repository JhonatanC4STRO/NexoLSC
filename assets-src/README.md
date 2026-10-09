# assets-src — archivos de trabajo de los avatares

> **En pocas palabras:** aquí están los archivos con los que se **crean** los avatares y sus letras. La
> página web no los usa directamente: usa el archivo `.glb` que sale de aquí y se guarda en
> `public/models/avatars/`.

```text
assets-src/
└── avatars/
    ├── mpfb2/              ← licencia libre (CC0) · el que usa la app · se guarda en git
    └── miles-prueba/       ← derechos de autor de otros · SOLO en tu equipo (en .gitignore)
```

Cada avatar tiene su ficha (`build_avatar.py`), su archivo de Blender (`avatar.blend`), sus imágenes
(`textures/`) y su licencia (`LICENSE.md`). Todos cumplen las mismas reglas: un esqueleto Rigify llamado
`rig` y las animaciones `rest` (reposo) y `sign_*` (una por letra).

> El avatar caricaturesco `mpfb2-caricatura` se eliminó el 2026-10-08. Sigue en el historial de git por si
> se quiere recuperar.

## Las letras se perfeccionan en Blender

El **original** de cada letra es su animación dentro de `avatars/mpfb2/avatar.blend`: `rest` (reposo),
`sign_A` … `sign_Z` y `sign_ENYE`. Para mejorar una letra se abre ese archivo en Blender, se mueven los
dedos y la mano, y se exporta. Los pasos completos están en
[docs/06-animation-clips.md](../docs/06-animation-clips.md#4-cómo-perfeccionar-una-letra-en-blender).

```bash
npm run avatar:abrir
```

```bash
npm run avatar:exportar
```

> **Cuidado:** `avatar.blend` es el original de las letras. Haz una copia antes de cambios grandes; si se
> daña, se puede recuperar la última versión subida con git.

> Todas las letras están en **borrador**: salen de mirar el dibujo del diccionario DBLSC (pág. 573) y
> tienen que validarlas personas sordas que usan la LSC.

## Crear un avatar desde cero

**Lo que necesitas una sola vez:**

- Blender 5.2 o más nuevo. Los comandos `npm run avatar:…` lo buscan solos en
  `C:\Program Files\Blender Foundation\`; si está en otro lugar, pon su ruta en la variable `BLENDER`.
- La extensión **MPFB** en Blender (*Preferencias → Get Extensions →* buscar «MPFB»).
- El paquete de recursos `makehuman_system_assets_cc0.zip` cargado en MPFB (*Apply assets → Library
  settings → Load pack from zip file*).

1. **Crear el personaje** (solo para avatares MPFB; `blender` es el programa de Blender). El generador no
   sobrescribe un `avatar.blend` que ya exista, para no borrar sus letras:

   ```bash
   blender -b --python assets-src/avatars/mpfb2/build_avatar.py
   ```

2. **Copiar las letras de `mpfb2`:** abre el `avatar.blend` nuevo en Blender y usa *File → Append →*
   `assets-src/avatars/mpfb2/avatar.blend` *→ Action →* `rest` y todas las `sign_…`. Guarda.
3. **Perfeccionar las letras a mano** en Blender (`npm run avatar:abrir`).
4. **Exportar el archivo que usa la página:**

   ```bash
   npm run avatar:exportar
   ```

Para trabajar con otro avatar, pon su nombre en la variable `AVATAR` (por ejemplo, en PowerShell:
`$env:AVATAR="otro"; npm.cmd run avatar:abrir`).

## Añadir un avatar nuevo

1. **Con MPFB:** copia la carpeta `mpfb2` con otro nombre, **borra de la copia `avatar.blend`, `textures/`
   y `skin.mhmat`** (si no, el generador se detiene para no sobrescribir), cambia los ajustes de `CONFIG` en
   `build_avatar.py` (cuerpo, cara, piel, ropa) y haz los pasos de arriba. El generador común está en `tools/blender/mpfb_builder.py`.
2. **De otro origen:** su archivo `.blend` debe tener un esqueleto Rigify llamado `rig`. Haz los pasos 2 a 4.
3. **Regístralo en la app**, en `src/avatar/avatars.ts`, y guarda su `LICENSE.md`. Si su licencia no es
   libre, márcalo con `publishable: false` y añádelo a `.gitignore` para que no se suba.
