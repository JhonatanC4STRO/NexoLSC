"""
Funciones para posar el rig Rigify por script (ver docs/06-animation-clips.md).

Uso dentro de Blender (Scripting → Run Script) o importándolo desde otro script.
Las poses generadas son un punto de partida: siempre se revisan contra la fuente
(DBLSC p. 573) y se validan con personas sordas usuarias de LSC.
"""
import bpy
import math
from mathutils import Vector, Quaternion

rig = bpy.data.objects['rig']
pb = rig.pose.bones


def upd():
    bpy.context.view_layer.update()


def reset():
    """Vuelve todos los huesos a la pose de descanso del rig.

    También desasigna la Action activa: si no, al actualizar la escena Blender
    vuelve a aplicar sus fotogramas clave y la pose anterior se suma a la nueva.
    """
    if rig.animation_data:
        rig.animation_data.action = None
    for b in pb:
        b.location = (0, 0, 0)
        if b.rotation_mode == 'QUATERNION':
            b.rotation_quaternion = (1, 0, 0, 0)
        else:
            b.rotation_euler = (0, 0, 0)
    upd()


def _post_multiply(b, q):
    """Aplica una rotación local sin importar el modo de rotación del hueso (cuaternión o Euler).

    Ojo: en el Rigify actual los dedos usan Euler XYZ y los brazos cuaterniones.
    Escribir solo rotation_quaternion en un hueso Euler no tiene efecto.
    """
    if b.rotation_mode == 'QUATERNION':
        b.rotation_quaternion = b.rotation_quaternion @ q
    elif b.rotation_mode == 'AXIS_ANGLE':
        raise ValueError(f'{b.name}: modo AXIS_ANGLE no soportado')
    else:
        b.rotation_euler = (b.rotation_euler.to_quaternion() @ q).to_euler(b.rotation_mode, b.rotation_euler)


def rot_world(name, axis, deg):
    """Rota el hueso alrededor de un eje en espacio de armadura, respetando la pose actual."""
    b = pb[name]
    upd()
    axis_local = (b.matrix.to_3x3().inverted() @ Vector(axis)).normalized()
    _post_multiply(b, Quaternion(axis_local, math.radians(deg)))
    upd()


def aim(name, direction):
    """Apunta el eje Y del hueso (su largo) hacia una dirección en espacio de armadura."""
    b = pb[name]
    upd()
    cur = b.matrix.to_3x3() @ Vector((0, 1, 0))
    d = Vector(direction).normalized()
    axis = cur.cross(d)
    if axis.length > 1e-6:
        rot_world(name, axis.normalized(), math.degrees(cur.angle(d)))


def curl(finger, deg, side='R'):
    """Flexiona las 3 falanges de un dedo (X local positivo = cerrar)."""
    for i, k in enumerate(['01', '02', '03']):
        b = pb[f'{finger}.{k}.{side}']
        _post_multiply(b, Quaternion((1, 0, 0), math.radians(deg * (0.8 if i == 0 else 1.0))))
    upd()


def arm_signing_space():
    """Mano derecha a la altura del hombro, palma al frente; brazo izquierdo relajado."""
    aim('upper_arm_fk.L', (0.15, 0.05, -1))
    aim('forearm_fk.L', (0.05, -0.1, -1))
    aim('upper_arm_fk.R', (-0.35, -0.25, -0.9))
    aim('forearm_fk.R', (0.1, -0.35, 0.93))
    aim('hand_fk.R', (0.0, -0.1, 1))


def key_action(action_name, frame=1):
    """Crea una Action con Fake User y guarda la pose actual en el fotograma indicado."""
    act = bpy.data.actions.new(action_name)
    act.use_fake_user = True
    rig.animation_data_create()
    rig.animation_data.action = act
    for b in pb:
        b.keyframe_insert('rotation_quaternion' if b.rotation_mode == 'QUATERNION' else 'rotation_euler', frame=frame)
        b.keyframe_insert('location', frame=frame)
    return act
