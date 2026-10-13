"""
Quita los huesos curvos (B-Bones) del avatar para que Blender muestre los dedos igual que la web.

glTF y three.js no soportan B-Bones: en la web cada parte del dedo se dobla recta. Con este ajuste,
lo que ves y corriges en Blender sale igual en la página. No cambia ninguna animación.

Uso (con Blender cerrado):  npm run avatar:sin-curvas
"""
import bpy

rig = bpy.data.objects['rig']
cambiados = 0
for b in rig.data.bones:
    if b.use_deform and b.bbone_segments != 1:
        b.bbone_segments = 1
        cambiados += 1
bpy.ops.wm.save_mainfile()
print(f'[ok] huesos sin curva: {cambiados}')
