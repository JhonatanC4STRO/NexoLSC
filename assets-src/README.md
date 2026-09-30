# assets-src

Archivos fuente de los avatares y de las letras. La app no los carga directamente: usa los `.glb`
de `public/models/avatars/`.

```text
assets-src/
├── letters/
│   └── alfabeto_lsc.json   ← las 27 letras como DATOS (independientes del avatar)
└── avatars/
    ├── mpfb2-caricatura/   ← CC0 · por defecto en la app · se versiona
    ├── mpfb2/              ← CC0 · realista · se versiona
    └── miles-prueba/       ← derechos de terceros · SOLO local (en .gitignore)
```

Cada candidato de avatar tiene `build_avatar.py` (su configuración), `avatar.blend`, `textures/` y
`LICENSE.md`. Todos cumplen el mismo contrato: armadura Rigify llamada `rig` y clips `rest` + `sign_*`.

## Las letras NO dependen del avatar

Las 27 letras se describen una sola vez en `letters/alfabeto_lsc.json`: ángulos de cada dedo y del
pulgar, orientación de la mano y, en las letras dinámicas, la trayectoria. `tools/blender/bake_letters.py`
aplica esos datos al rig de **cualquier** avatar y crea sus Actions. Cambiar de avatar = volver a ejecutar
el script; corregir una letra = editar el JSON y volver a ejecutarlo en todos los avatares.

> Todas las letras están en estado `draft`: son una lectura de la ilustración del DBLSC (p. 573) y deben
> validarse con personas sordas usuarias de LSC.

## Flujo completo (por candidato)

Requisitos (una sola vez): extensión **MPFB** en Blender (Preferencias → Get Extensions → "MPFB") y el
paquete `makehuman_system_assets_cc0.zip` cargado en MPFB (Apply assets → Library settings → Load pack
from zip file).

1. Generar el personaje (solo candidatos MPFB):

```bash
blender -b --python assets-src/avatars/mpfb2-caricatura/build_avatar.py
```

2. Hornear las letras en el avatar:

```bash
blender -b assets-src/avatars/mpfb2-caricatura/avatar.blend --python tools/blender/bake_letters.py
```

3. Exportar el GLB que usa la app:

```bash
blender -b assets-src/avatars/mpfb2-caricatura/avatar.blend --python tools/blender/export_avatar.py -- public/models/avatars/mpfb2-caricatura.glb
```

Después de editar `letters/alfabeto_lsc.json`, repetir los pasos 2 y 3 en cada avatar.

## Añadir un nuevo candidato

1. MPFB: copiar una carpeta existente, cambiar `CONFIG` en `build_avatar.py` (fenotipo, ajustes de cara,
   pieles, ropa) y ejecutar los tres pasos. Generador compartido: `tools/blender/mpfb_builder.py`.
2. Otro origen: su `.blend` debe tener una armadura Rigify llamada `rig`; ejecutar los pasos 2 y 3.
3. Registrarlo en `src/avatar/avatars.ts` (con `publishable: false` y en `.gitignore` si no tiene licencia
   libre) y añadir su `LICENSE.md`.
