# assets-src — archivos de trabajo de los avatares y las letras

> **En pocas palabras:** aquí están los archivos con los que se **crean** los avatares y sus letras. La
> página web no los usa directamente: usa el archivo `.glb` que sale de aquí y se guarda en
> `public/models/avatars/`.

```text
assets-src/
├── letters/
│   └── alfabeto_lsc.json   ← las 27 letras como DATOS (sirven para cualquier avatar)
└── avatars/
    ├── mpfb2/              ← licencia libre (CC0) · el que usa la app · se guarda en git
    └── miles-prueba/       ← derechos de autor de otros · SOLO en tu equipo (en .gitignore)
```

Cada avatar tiene su ficha (`build_avatar.py`), su archivo de Blender (`avatar.blend`), sus imágenes
(`textures/`) y su licencia (`LICENSE.md`). Todos cumplen las mismas reglas: un esqueleto Rigify llamado
`rig` y las animaciones `rest` (reposo) y `sign_*` (una por letra).

> El avatar caricaturesco `mpfb2-caricatura` se eliminó el 2026-10-08. Sigue en el historial de git por si
> se quiere recuperar.

## Las letras NO dependen del avatar

Las 27 letras se escriben una sola vez en `letters/alfabeto_lsc.json`: los ángulos de cada dedo y del
pulgar, hacia dónde mira la mano y, en las letras con movimiento, el recorrido. El programa
`tools/blender/bake_letters.py` aplica esos datos al esqueleto de **cualquier** avatar y crea sus
animaciones.

- **Cambiar de avatar** = volver a correr el programa en el avatar nuevo.
- **Corregir una letra** = cambiar sus números en el archivo de datos y volver a correr el programa en
  todos los avatares.

> Todas las letras están en **borrador**: salen de mirar el dibujo del diccionario DBLSC (pág. 573) y
> tienen que validarlas personas sordas que usan la LSC.

## Paso a paso para un avatar

**Lo que necesitas una sola vez:**

- Blender 5.2 o más nuevo.
- La extensión **MPFB** en Blender (*Preferencias → Get Extensions →* buscar «MPFB»).
- El paquete de recursos `makehuman_system_assets_cc0.zip` cargado en MPFB (*Apply assets → Library
  settings → Load pack from zip file*).

En los comandos, `blender` es el programa de Blender. En Windows suele estar en
`"C:\Program Files\Blender Foundation\Blender 5.2\blender.exe"`.

1. **Crear el personaje** (solo para avatares MPFB):

   ```bash
   blender -b --python assets-src/avatars/mpfb2/build_avatar.py
   ```

2. **Aplicar las letras al avatar** («hornear»):

   ```bash
   blender -b assets-src/avatars/mpfb2/avatar.blend --python tools/blender/bake_letters.py
   ```

3. **Exportar el archivo que usa la página:**

   ```bash
   blender -b assets-src/avatars/mpfb2/avatar.blend --python tools/blender/export_avatar.py -- public/models/avatars/mpfb2.glb
   ```

Cada vez que cambies `letters/alfabeto_lsc.json`, repite los pasos 2 y 3 en cada avatar.

## Añadir un avatar nuevo

1. **Con MPFB:** copia la carpeta `mpfb2`, cambia los ajustes de `CONFIG` en `build_avatar.py` (cuerpo,
   cara, piel, ropa) y haz los tres pasos. El generador común está en `tools/blender/mpfb_builder.py`.
2. **De otro origen:** su archivo `.blend` debe tener un esqueleto Rigify llamado `rig`. Haz los pasos 2 y 3.
3. **Regístralo en la app**, en `src/avatar/avatars.ts`, y guarda su `LICENSE.md`. Si su licencia no es
   libre, márcalo con `publishable: false` y añádelo a `.gitignore` para que no se suba.
