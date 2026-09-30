"""
Aplica las letras del alfabeto (definidas como DATOS, independientes del avatar)
a cualquier avatar con rig Rigify y crea una Action por letra.

Uso:
  blender -b assets-src/avatars/<id>/avatar.blend --python tools/blender/bake_letters.py
  blender -b <avatar.blend> --python tools/blender/bake_letters.py -- --poses assets-src/letters/alfabeto_lsc.json

Crea/reemplaza las Actions: rest, sign_A … sign_Z, sign_ENYE y guarda el .blend.
Después se exporta con tools/blender/export_avatar.py.

Formato de cada letra (ángulos en grados, ejes LOCALES del rig Rigify, mano derecha):
  fingers.<index|middle|ring|pinky> = [mcp, pip, dip, spread]   (X local; spread = Z local, + hacia el pulgar)
  thumb = [cmc_x, cmc_z, cmc_y, mcp, ip]
          cmc_x + hacia el índice · cmc_z + hacia la palma / − hacia afuera · cmc_y giro · mcp/ip flexión
  arm   = {twist, flex, dev, swing, lift, tilt}   (ajustes sobre la postura base de señado)
          twist: giro del antebrazo (orientación de la palma) · flex/dev: muñeca
          swing/lift: desplazan la mano rotando el hombro (+ derecha del espectador / + arriba)
          tilt: inclina el antebrazo en el plano frontal
          hand_dir: [x, y, z] dirección (mundo) a la que apuntan los dedos; por defecto hacia arriba
          forearm_dir: [x, y, z] dirección (mundo) del antebrazo, si la postura base no sirve (P)
          Ejes del mundo: +X izquierda del avatar (derecha del espectador), −Y hacia el espectador, +Z arriba
  motion = [{t, ...mismos campos que arm, fingers/thumb opcionales}]  (solo letras dinámicas)
"""
import json
import math
import os
import sys

import bpy
from mathutils import Quaternion, Vector

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
sys.path.insert(0, HERE)
import pose_helpers as P  # noqa: E402

FPS = 24
FINGERS = ('index', 'middle', 'ring', 'pinky')
BONE = {'index': 'f_index', 'middle': 'f_middle', 'ring': 'f_ring', 'pinky': 'f_pinky'}


def load_poses():
    argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
    path = argv[argv.index('--poses') + 1] if '--poses' in argv else os.path.join(ROOT, 'assets-src', 'letters', 'alfabeto_lsc.json')
    with open(path, encoding='utf-8') as fh:
        return json.load(fh)


def local(bone, axis, deg):
    if deg:
        P._post_multiply(P.pb[bone], Quaternion(Vector(axis), math.radians(deg)))


def apply_hand(fingers, thumb, side='R'):
    for name in FINGERS:
        mcp, pip, dip, spread = fingers.get(name, [0, 0, 0, 0])
        b = BONE[name]
        local(f'{b}.01.{side}', (0, 0, 1), spread)
        local(f'{b}.01.{side}', (1, 0, 0), mcp)
        local(f'{b}.02.{side}', (1, 0, 0), pip)
        local(f'{b}.03.{side}', (1, 0, 0), dip)
    cmc_x, cmc_z, cmc_y, mcp, ip = thumb
    local(f'thumb.01.{side}', (0, 0, 1), cmc_z)
    local(f'thumb.01.{side}', (1, 0, 0), cmc_x)
    local(f'thumb.01.{side}', (0, 1, 0), cmc_y)
    local(f'thumb.02.{side}', (1, 0, 0), mcp)
    local(f'thumb.03.{side}', (1, 0, 0), ip)


def apply_arm(arm):
    """Ajustes sobre la postura de señado. swing/lift rotan el hombro alrededor de ejes del mundo."""
    swing, lift = arm.get('swing', 0), arm.get('lift', 0)
    if swing:
        P.rot_world('upper_arm_fk.R', (0, 0, 1), swing)
    if lift:
        P.rot_world('upper_arm_fk.R', (1, 0, 0), -lift)
    P.upd()
    if 'forearm_dir' in arm:  # p. ej. antebrazo hacia adelante para que la mano apunte abajo (P)
        P.aim('forearm_fk.R', arm['forearm_dir'])
    tilt = arm.get('tilt', 0)
    if tilt:  # inclina el antebrazo en el plano frontal (p. ej. dedos horizontales en la H)
        P.rot_world('forearm_fk.R', (0, 1, 0), tilt)
        P.upd()
    twist = arm.get('twist', 0)
    if twist:
        fk = P.pb['forearm_fk.R']
        P.rot_world('forearm_fk.R', fk.matrix.to_3x3() @ Vector((0, 1, 0)), twist)
    # Tras girar el antebrazo, se vuelve a orientar la mano: el giro cambia hacia dónde mira
    # la palma, pero los dedos siguen apuntando a hand_dir (por defecto, hacia arriba).
    P.aim('hand_fk.R', arm.get('hand_dir', DEFAULT_HAND_DIR))
    local('hand_fk.R', (1, 0, 0), arm.get('flex', 0))
    local('hand_fk.R', (0, 0, 1), arm.get('dev', 0))
    P.upd()


ARM_KEYS = ('twist', 'flex', 'dev', 'swing', 'lift', 'tilt')
DEFAULT_HAND_DIR = (0.0, -0.1, 1.0)  # dedos hacia arriba, levemente hacia adelante


def pose_letter(base, override=None, defaults=None):
    """Postura completa: base de señado + mano + brazo.

    Los valores de brazo se SUMAN: defaults (p. ej. palma al frente) + letra + fotograma de movimiento.
    """
    override = override or {}
    P.reset()
    P.arm_signing_space()
    arm = {}
    for layer in ((defaults or {}).get('arm', {}), base.get('arm', {}), override):
        for key in ARM_KEYS:
            if key in layer:
                arm[key] = arm.get(key, 0) + layer[key]
        for key in ('hand_dir', 'forearm_dir'):  # direcciones absolutas: la última capa gana
            if key in layer:
                arm[key] = layer[key]
    apply_arm(arm)
    fingers = dict(base['fingers'])
    fingers.update(override.get('fingers', {}))
    apply_hand(fingers, override.get('thumb', base['thumb']))
    P.upd()


def pose_rest():
    P.reset()
    P.aim('upper_arm_fk.R', (-0.15, 0.05, -1)); P.aim('forearm_fk.R', (-0.05, -0.1, -1))
    P.aim('upper_arm_fk.L', (0.15, 0.05, -1)); P.aim('forearm_fk.L', (0.05, -0.1, -1))


def key_pose(action, frame):
    for b in P.pb:
        path = 'rotation_quaternion' if b.rotation_mode == 'QUATERNION' else 'rotation_euler'
        b.keyframe_insert(path, frame=frame, group=b.name)
        b.keyframe_insert('location', frame=frame, group=b.name)


def new_action(name):
    old = bpy.data.actions.get(name)
    if old:
        bpy.data.actions.remove(old)
    act = bpy.data.actions.new(name)
    act.use_fake_user = True
    P.rig.animation_data_create()
    P.rig.animation_data.action = act
    return act


def clip_name(letter):
    return 'sign_ENYE' if letter == 'Ñ' else f'sign_{letter}'


def main():
    data = load_poses()
    # rest
    pose_rest()
    new_action('rest'); key_pose(None, 1)

    for letter, spec in data['letters'].items():
        motion = spec.get('motion')
        # new_action antes de posar: reset() desasigna la Action anterior (evita que se sumen)
        P.reset()
        act = new_action(clip_name(letter))
        defaults = data.get('defaults', {})
        if not motion:
            pose_letter(spec, defaults=defaults)
            P.rig.animation_data.action = act
            key_pose(act, 1)
        else:
            frames = max(2, round(spec.get('duration_s', 0.95) * FPS))
            for kf in motion:
                pose_letter(spec, kf, defaults)
                P.rig.animation_data.action = act
                key_pose(act, 1 + round(kf['t'] * (frames - 1)))
        P.rig.animation_data.action = None
    P.reset()
    bpy.ops.wm.save_mainfile()
    print('[ok] Actions:', sorted(a.name for a in bpy.data.actions if a.name == 'rest' or a.name.startswith('sign_')))


if __name__ == '__main__':
    main()
