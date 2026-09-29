"""
Prepara y exporta el avatar de NexoLSC a GLB con un AnimationClip por seña.

Uso (sin abrir la interfaz de Blender):
  blender -b assets-src/avatar/avatar.blend --python tools/blender/export_avatar.py -- public/models/avatar.glb

Qué hace:
  1. Deja UNA sola armadura deformando la malla (quita modificadores Armature extra).
  2. Elimina grupos de vértices que no pertenecen a huesos de deformación (DEF-*).
  3. Exporta solo huesos de deformación, con muestreo de animación (hornea las
     restricciones de Rigify) y una animación glTF por cada Action "rest" / "idle" / "sign_*".
  4. Lista los clips exportados para verificar.

No guarda cambios en el .blend: trabaja sobre la sesión en memoria.
"""
import bpy
import sys

RIG_NAME = 'rig'
CLIP_PREFIXES = ('rest', 'idle', 'sign_')

argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
out_path = argv[0] if argv else '//avatar.glb'

rig = bpy.data.objects[RIG_NAME]
meshes = [o for o in bpy.data.objects if o.type == 'MESH' and o.parent == rig]

# 1. Una sola armadura por malla (glTF admite un solo skin por malla).
for o in meshes:
    for m in list(o.modifiers):
        if m.type == 'ARMATURE' and m.object != rig:
            print(f'[limpieza] {o.name}: quitando modificador {m.name} -> {m.object.name if m.object else None}')
            o.modifiers.remove(m)

# 2. Grupos de vértices sin hueso de deformación.
deform = {b.name for b in rig.data.bones if b.use_deform}
for o in meshes:
    for vg in list(o.vertex_groups):
        if vg.name not in deform:
            o.vertex_groups.remove(vg)

# 3. Solo exportar las acciones de señas. El modo ACTIONS exporta toda acción
#    compatible con la armadura, así que las demás se eliminan de la sesión
#    (el .blend en disco no se modifica porque este script nunca guarda).
if rig.animation_data:
    rig.animation_data.action = None
for a in list(bpy.data.actions):
    if not a.name.startswith(CLIP_PREFIXES):
        print(f'[limpieza] excluyendo acción {a.name}')
        bpy.data.actions.remove(a)
clips = list(bpy.data.actions)
if not clips:
    raise SystemExit('No hay acciones rest/idle/sign_* para exportar')

bpy.ops.object.select_all(action='DESELECT')
for o in [rig, *meshes]:
    o.select_set(True)
bpy.context.view_layer.objects.active = rig

bpy.ops.export_scene.gltf(
    filepath=bpy.path.abspath(out_path),
    export_format='GLB',
    use_selection=True,
    export_def_bones=True,            # solo huesos DEF-* (no controles MCH/ORG de Rigify)
    export_animation_mode='ACTIONS',  # una animación glTF por Action
    export_force_sampling=True,       # hornea restricciones de Rigify a los huesos DEF
    export_optimize_animation_size=True,
    export_image_format='JPEG',
)

print(f'[ok] {out_path}')
print('[clips]', sorted(a.name for a in clips))
