"""
Candidato "mpfb2": hombre joven adulto, realista (MPFB 2 + Rigify, recursos CC0).

  blender -b --python assets-src/avatars/mpfb2/build_avatar.py
  blender -b assets-src/avatars/mpfb2/avatar.blend --python tools/blender/bake_letters.py
  blender -b assets-src/avatars/mpfb2/avatar.blend --python tools/blender/export_avatar.py -- public/models/avatars/mpfb2.glb

Ver tools/blender/mpfb_builder.py y LICENSE.md.
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..', '..', 'tools', 'blender'))
from mpfb_builder import build_candidate  # noqa: E402

CONFIG = {
    'name': 'nexolsc_mpfb2',
    'macro': {
        'gender': 1.0,        # 0 = mujer, 1 = hombre
        'age': 0.5,           # 0.5 ≈ 25 años en MakeHuman
        'muscle': 0.55,
        'weight': 0.5,
        'proportions': 0.6,
        'height': 0.6,        # ≈ 1,71 m (0.5 → 1,59 m; 0.8 → 1,97 m)
        'cupsize': 0.5,
        'firmness': 0.5,
        'race': {'african': 0.45, 'caucasian': 0.35, 'asian': 0.20},
    },
    'targets': [],
    'skin_mix': [('young_african_male', 0.5), ('young_caucasian_male', 0.5)],
    'eyes_material': 'brown',
    'bodyparts': [
        ('eyebrows', 'eyebrow001/eyebrow001.mhclo'),
        ('eyelashes', 'eyelashes01/eyelashes01.mhclo'),
        ('teeth', 'teeth_base/teeth_base.mhclo'),
        ('hair', 'short02/short02.mhclo'),
    ],
    'clothes': ['male_casualsuit01/male_casualsuit01.mhclo', 'shoes01/shoes01.mhclo'],
}

if __name__ == '__main__':
    build_candidate(CONFIG, HERE)
