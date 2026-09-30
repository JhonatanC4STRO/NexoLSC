"""
Candidato "mpfb2-caricatura": versión caricaturesca inspirada en los rasgos del autor
del proyecto (MPFB 2 + Rigify, recursos CC0).

Rasgos buscados (de sus fotos): hombre de unos 20 años, piel trigueña clara, cara
redonda y llena, cejas negras gruesas y rectas, ojos cafés, nariz ancha, labios
llenos, pelo negro peinado hacia arriba y atrás con los lados cortos, camiseta
negra. Rasgo caricaturesco: cabeza, ojos y manos algo más grandes (las manos
grandes además ayudan a leer las señas).

  blender -b --python assets-src/avatars/mpfb2-caricatura/build_avatar.py
  blender -b assets-src/avatars/mpfb2-caricatura/avatar.blend --python tools/blender/bake_letters.py
  blender -b assets-src/avatars/mpfb2-caricatura/avatar.blend --python tools/blender/export_avatar.py -- public/models/avatars/mpfb2-caricatura.glb
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..', '..', 'tools', 'blender'))
from mpfb_builder import build_candidate  # noqa: E402


def t(name, value):
    return {'target': name, 'value': value}


CONFIG = {
    'name': 'nexolsc_caricatura',
    'macro': {
        'gender': 1.0,
        'age': 0.44,          # principios de los 20
        'muscle': 0.45,
        'weight': 0.68,       # complexión llena
        'proportions': 0.35,  # menos "ideal", más caricatura
        'height': 0.63,       # ≈ 1,65 m
        'cupsize': 0.5,
        'firmness': 0.5,
        'race': {'caucasian': 0.55, 'asian': 0.25, 'african': 0.20},
    },
    'targets': [
        # Cabeza más grande y redonda (rasgo caricaturesco + cara llena)
        t('head-round', 0.7), t('head-fat-incr', 0.5),
        t('head-scale-horiz-incr', 0.6), t('head-scale-vert-incr', 0.55), t('head-scale-depth-incr', 0.5),
        t('l-cheek-volume-incr', 0.5), t('r-cheek-volume-incr', 0.5),
        t('chin-width-incr', 0.3), t('neck-double-incr', 0.15),
        # Ojos más grandes
        t('l-eye-scale-incr', 0.8), t('r-eye-scale-incr', 0.8),
        # Nariz ancha y labios llenos
        t('nose-scale-horiz-incr', 0.4), t('nose-volume-incr', 0.35), t('nose-point-width-incr', 0.35),
        t('mouth-upperlip-volume-incr', 0.25), t('mouth-lowerlip-volume-incr', 0.35),
        # Cejas un poco más bajas y rectas (mirada seria)
        t('eyebrows-angle-down', 0.2),
        # Manos más grandes y dedos algo más gruesos: se leen mejor las configuraciones
        t('l-hand-scale-incr', 0.5), t('r-hand-scale-incr', 0.5),
        t('l-hand-fingers-diameter-incr', 0.2), t('r-hand-fingers-diameter-incr', 0.2),
    ],
    'skin_mix': [('young_caucasian_male', 0.55), ('young_asian_male', 0.25), ('young_african_male', 0.20)],
    'eyes_material': 'brown',
    'bodyparts': [
        ('eyebrows', 'eyebrow009/eyebrow009.mhclo'),   # gruesas y rectas
        ('eyelashes', 'eyelashes01/eyelashes01.mhclo'),
        ('teeth', 'teeth_base/teeth_base.mhclo'),
        ('hair', 'short04/short04.mhclo'),             # negro, peinado hacia arriba/atrás
    ],
    'clothes': ['male_casualsuit06/male_casualsuit06.mhclo', 'shoes02/shoes02.mhclo'],
    # La camiseta de casualsuit06 es blanca: se pasa a negro sin tocar los jeans.
    'recolor': {'male_casualsuit06_diffuse': 'casualsuit06_black_tee', 'brown_eye': 'iris_dark_brown'},
}

if __name__ == '__main__':
    build_candidate(CONFIG, HERE)
