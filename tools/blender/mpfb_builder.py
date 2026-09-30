"""
Generador reutilizable de candidatos de avatar con MPFB 2 + Rigify.

Cada candidato vive en assets-src/avatars/<id>/ y tiene un build_avatar.py que
solo define su configuración y llama a build_candidate(). Requiere la extensión
MPFB y el paquete "makehuman_system_assets" instalados en Blender.

Salida en la carpeta del candidato:
  avatar.blend   personaje + rig Rigify (armadura "rig"), listo para glTF
  textures/      texturas copiadas y optimizadas para web
  skin.mhmat     material de piel (mezcla de pieles CC0)

Las poses (rest + letras) NO se crean aquí: las aplica tools/blender/bake_letters.py
a cualquier avatar, para que las letras no dependan del avatar.
"""
import os

import bpy
import numpy as np

bpy.ops.preferences.addon_enable(module='rigify')
from bl_ext.blender_org.mpfb.services import (  # noqa: E402
    AssetService, HumanService, LocationService, ObjectService, RigService, SystemService, TargetService,
)

TEXTURE_SIZE = 2048
ALPHA_CUTOFF = 0.35


def build_candidate(cfg, out_dir):
    """cfg: dict con name, macro, targets, skin_mix, eyes_material, bodyparts, clothes, recolor."""
    tex_dir = os.path.join(out_dir, 'textures')
    os.makedirs(tex_dir, exist_ok=True)

    _clear_scene()
    basemesh = HumanService.create_human(scale=0.1, macro_detail_dict=cfg['macro'])  # 1 unidad = 1 m
    basemesh.name = cfg['name']
    if cfg.get('targets'):
        # Detalles de cara/cuerpo; se aplican antes del rig y de la ropa para que ajusten a la forma final.
        TargetService.bulk_load_targets(basemesh, cfg['targets'])

    HumanService.add_builtin_rig(basemesh, 'rigify.human', import_weights=True)
    skin = _build_skin(cfg, out_dir, tex_dir)
    HumanService.set_character_skin(skin, basemesh, skin_type='GAMEENGINE', material_instances=False)

    eyes = _asset('eyes', 'low-poly/low-poly.mhclo')
    HumanService.add_mhclo_asset(eyes, basemesh, asset_type='eyes', subdiv_levels=0, material_type='MAKESKIN',
                                 alternative_materials=_eye_material(eyes, cfg['eyes_material']))
    for kind, fragment in cfg['bodyparts']:
        HumanService.add_mhclo_asset(_asset(kind, fragment), basemesh, asset_type=kind, subdiv_levels=0, material_type='MAKESKIN')
    for fragment in cfg['clothes']:
        HumanService.add_mhclo_asset(_asset('clothes', fragment), basemesh, asset_type='Clothes', subdiv_levels=0, material_type='MAKESKIN')

    metarig = ObjectService.find_object_of_type_amongst_nearest_relatives(basemesh, 'Skeleton')
    assert SystemService.check_for_rigify(), 'Rigify no está habilitado'
    rig = RigService.generate_rigify_rig(metarig, meta_rig_action='delete')
    assert rig is not None, 'Rigify rechazó el metarig'
    rig.name = 'rig'
    _move_feet_to_ground(basemesh, rig)

    _finalize_for_web(basemesh, rig)
    alpha_keys = _alpha_keys(cfg)
    _prepare_materials(alpha_keys)
    _localize_textures(tex_dir, alpha_keys, cfg.get('recolor', {}))

    blend_path = os.path.join(out_dir, 'avatar.blend')
    bpy.ops.wm.save_as_mainfile(filepath=blend_path)
    bpy.ops.file.make_paths_relative()  # texturas relativas a avatar.blend (//textures/...)
    bpy.ops.wm.save_mainfile(filepath=blend_path)
    missing = [i.name for i in bpy.data.images if i.source == 'FILE' and not os.path.isfile(bpy.path.abspath(i.filepath))]
    assert not missing, f'Texturas no encontradas: {missing}'

    height = _height(basemesh)
    print(f'[ok] {blend_path}')
    print(f'[altura] {height:.3f} m')
    print('[rig] huesos', len(rig.data.bones), 'deformación', sum(b.use_deform for b in rig.data.bones))
    for o in bpy.data.objects:
        if o.type == 'MESH' and o.parent == rig:
            print('[malla]', o.name, len(o.data.vertices), 'vértices')
    return basemesh, rig


# --- Pasos ---------------------------------------------------------------------

def _clear_scene():
    for obj in list(bpy.data.objects):
        bpy.data.objects.remove(obj, do_unlink=True)


def _asset(subdir, fragment):
    path = AssetService.find_asset_absolute_path(fragment, subdir)
    if not path:
        raise SystemExit(f'No se encontró el recurso {subdir}/{fragment}. ¿Está instalado el paquete de MakeHuman?')
    return path


def _eye_material(eyes_path, material):
    from bl_ext.blender_org.mpfb.entities.clothes.mhclo import Mhclo
    mhclo = Mhclo()
    mhclo.load(eyes_path, only_metadata=True)
    return {mhclo.uuid: f'materials/{material}.mhmat'} if mhclo.uuid else None


def _build_skin(cfg, out_dir, tex_dir):
    """Mezcla pieles CC0 (todas comparten el mismo mapa UV) según cfg['skin_mix'] = [(nombre, peso), ...]."""
    skins_dir = LocationService.get_user_data('skins')
    mix = cfg['skin_mix']
    total = sum(w for _, w in mix)
    acc = np.zeros(TEXTURE_SIZE * TEXTURE_SIZE * 4, dtype=np.float32)
    for name, weight in mix:
        folder = os.path.join(skins_dir, name)
        img = bpy.data.images.load(os.path.join(folder, _mhmat_diffuse(os.path.join(folder, name + '.mhmat'))))
        img.scale(TEXTURE_SIZE, TEXTURE_SIZE)
        px = np.empty_like(acc)
        img.pixels.foreach_get(px)
        acc += px * (weight / total)
        bpy.data.images.remove(img)
    out = bpy.data.images.new('skin_diffuse', TEXTURE_SIZE, TEXTURE_SIZE)
    out.pixels.foreach_set(acc)
    out.filepath_raw = os.path.join(tex_dir, 'skin_diffuse.png')
    out.file_format = 'PNG'
    out.save()

    # mhmat propio que apunta a la textura mezclada (basado en el de la primera piel).
    first = mix[0][0]
    lines = []
    with open(os.path.join(skins_dir, first, first + '.mhmat'), encoding='utf-8') as fh:
        for line in fh:
            if line.startswith('name '):
                line = f'name {cfg["name"]}_skin\n'
            elif line.startswith('diffuseTexture '):
                line = 'diffuseTexture textures/skin_diffuse.png\n'
            elif line.split(' ')[0] in ('normalmapTexture', 'specularmapTexture', 'bumpmapTexture', 'transmissionmapTexture'):
                continue
            lines.append(line)
    mhmat = os.path.join(out_dir, 'skin.mhmat')
    with open(mhmat, 'w', encoding='utf-8') as fh:
        fh.writelines(lines)
    return mhmat


def _mhmat_diffuse(mhmat_path):
    """Nombre del archivo de textura difusa declarado en un .mhmat (no siempre termina en _diffuse.png)."""
    with open(mhmat_path, encoding='utf-8') as fh:
        for line in fh:
            if line.startswith('diffuseTexture '):
                return line.split(' ', 1)[1].strip()
    raise ValueError(f'{mhmat_path} no declara diffuseTexture')


def _move_feet_to_ground(basemesh, rig):
    bpy.context.view_layer.update()
    lowest = min((basemesh.matrix_world @ v.co).z for v in basemesh.data.vertices)
    rig.location.z -= lowest


def _height(basemesh):
    bpy.context.view_layer.update()
    zs = [(basemesh.matrix_world @ v.co).z for v in basemesh.data.vertices]
    return max(zs) - min(zs)


def _finalize_for_web(basemesh, rig):
    """Deja el personaje listo para glTF: sin shape keys, sin máscaras, un solo Armature."""
    bpy.ops.object.select_all(action='DESELECT')
    bpy.context.view_layer.objects.active = basemesh
    basemesh.select_set(True)

    # glTF admite un solo esqueleto por malla; "Armature PV" (preservar volumen) no se exporta.
    for m in list(basemesh.modifiers):
        if m.type == 'ARMATURE' and m.name != 'Armature':
            basemesh.modifiers.remove(m)

    # Hornear el fenotipo y los detalles (shape keys de MakeHuman) en la malla.
    if basemesh.data.shape_keys:
        bpy.ops.object.shape_key_remove(all=True, apply_mix=True)

    # Aplicar máscaras: quitan la geometría auxiliar y el cuerpo oculto bajo la ropa.
    for m in [m for m in basemesh.modifiers if m.type == 'MASK']:
        bpy.ops.object.modifier_move_to_index(modifier=m.name, index=0)
        bpy.ops.object.modifier_apply(modifier=m.name)

    # Brazos en FK: así se posan con los controles *_fk (ver tools/blender/pose_helpers.py).
    for side in ('L', 'R'):
        rig.pose.bones[f'upper_arm_parent.{side}']['IK_FK'] = 1.0


def _alpha_keys(cfg):
    """Materiales/texturas con transparencia real: pelo, cejas y pestañas."""
    keys = ['eyebrow', 'eyelashes']
    keys += [os.path.basename(frag).split('.')[0] for kind, frag in cfg['bodyparts'] if kind == 'hair']
    return keys


def _prepare_materials(alpha_keys):
    """Ajusta los materiales de MakeHuman para glTF / three.js.

    MakeHuman conecta el alfa de la textura en todos los materiales, y el exportador
    glTF los marca entonces como BLEND (transparentes). En three.js eso causa errores
    de orden de dibujo (p. ej. ver el cuerpo a través de la camisa). Aquí:
      - opacos (piel, ropa, zapatos, ojos, dientes): alfa desconectada -> OPAQUE, una cara;
      - pelo/cejas/pestañas: alfa recortada 1 - (alfa < corte) -> MASK, sin ordenamiento.
    """
    for mat in bpy.data.materials:
        if not mat.users or not mat.node_tree:
            continue
        nt = mat.node_tree
        bsdf = next((n for n in nt.nodes if n.type == 'BSDF_PRINCIPLED'), None)
        if bsdf is None:
            continue
        alpha_in = bsdf.inputs['Alpha']
        source = alpha_in.links[0].from_socket if alpha_in.is_linked else None
        for link in list(alpha_in.links):
            nt.links.remove(link)
        alpha_in.default_value = 1.0

        if any(key in mat.name for key in alpha_keys) and source is not None:
            less = nt.nodes.new('ShaderNodeMath')
            less.operation = 'LESS_THAN'
            less.inputs[1].default_value = ALPHA_CUTOFF
            one_minus = nt.nodes.new('ShaderNodeMath')
            one_minus.operation = 'SUBTRACT'
            one_minus.inputs[0].default_value = 1.0
            nt.links.new(source, less.inputs[0])
            nt.links.new(less.outputs[0], one_minus.inputs[1])
            nt.links.new(one_minus.outputs[0], alpha_in)
            mat.use_backface_culling = False
        else:
            mat.use_backface_culling = True
            # Nodos de textura que solo alimentaban el alfa quedan huérfanos: se eliminan.
            for node in [n for n in nt.nodes if n.type == 'TEX_IMAGE' and not any(o.is_linked for o in n.outputs)]:
                nt.nodes.remove(node)


def _texture_policy(stem, alpha_keys):
    """(formato, tamaño máximo). Solo lo que tiene transparencia real va en PNG: el exportador
    glTF guarda en PNG toda imagen con canal alfa aunque sea opaca, y eso triplica el peso."""
    if 'skin_diffuse' in stem:
        return 'JPEG', 2048
    if any(key in stem for key in alpha_keys):
        return 'PNG', 1024 if 'eyebrow' not in stem and 'eyelashes' not in stem else 512
    for key, size in (('shoes', 512), ('_normal', 1024), ('_ao', 512), ('_eye', 512), ('teeth', 512)):
        if key in stem:
            return 'JPEG', size
    return 'JPEG', 1024  # ropa


RECOLORS = {}


def recolor(name):
    def register(fn):
        RECOLORS[name] = fn
        return fn
    return register


@recolor('casualsuit06_black_tee')
def _casualsuit06_black_tee(px, w, h):
    """male_casualsuit06: la camiseta blanca (franja superior del mapa UV, ~43 %) pasa a negro.

    Se conservan las arrugas (luminancia) y se borra el logo de MakeHuman: los píxeles
    saturados u oscuros de la camiseta se sustituyen por la luminancia típica de la tela.
    Los jeans (resto del mapa) no se tocan.
    """
    img = px.reshape(h, w, 4)                 # Blender guarda las filas de abajo hacia arriba
    shirt = img[int(h * (1 - 0.43)):, :, :3]
    lum = shirt @ np.array([0.2126, 0.7152, 0.0722], dtype=np.float32)
    mx, mn = shirt.max(axis=2), shirt.min(axis=2)
    sat = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-6), 0)
    typical = float(np.median(lum))
    lum = np.where((sat > 0.12) | (lum < typical - 0.12), typical, lum)  # logo y texto -> tela lisa
    shade = np.clip(lum / max(typical, 1e-6), 0.6, 1.15)
    shirt[:] = (shade * 0.11)[..., None]      # negro con un poco de volumen
    return px


@recolor('iris_dark_brown')
def _iris_dark_brown(px, w, h):
    """El iris "brown" de MakeHuman es café rojizo; se lleva a café oscuro conservando el detalle."""
    img = px.reshape(-1, 4)
    rgb = img[:, :3]
    mx, mn = rgb.max(axis=1), rgb.min(axis=1)
    sat = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-6), 0)
    iris = sat > 0.3                                   # la esclerótica es casi gris
    lum = rgb[iris] @ np.array([0.2126, 0.7152, 0.0722], dtype=np.float32)
    rgb[iris] = np.clip(lum[:, None] * np.array([1.9, 1.25, 0.8], dtype=np.float32), 0, 1)
    return px


def _localize_textures(tex_dir, alpha_keys, recolor_cfg):
    """Copia cada textura a ./textures, reducida y en el formato adecuado para web."""
    leftovers = set()
    for img in bpy.data.images:
        if img.source != 'FILE' or not img.filepath:
            continue
        src = os.path.abspath(bpy.path.abspath(img.filepath))
        stem = os.path.splitext(os.path.basename(src))[0]
        fmt, max_size = _texture_policy(stem, alpha_keys)
        dest = os.path.join(tex_dir, stem + ('.jpg' if fmt == 'JPEG' else '.png'))
        if os.path.normcase(src) != os.path.normcase(dest):
            w, h = img.size
            if max(w, h) > max_size:
                f = max_size / max(w, h)
                img.scale(int(w * f), int(h * f))
            for key, name in recolor_cfg.items():
                if key in stem:
                    w, h = img.size
                    px = np.empty(w * h * 4, dtype=np.float32)
                    img.pixels.foreach_get(px)
                    img.pixels.foreach_set(RECOLORS[name](px, w, h).ravel())
            img.filepath_raw = dest
            img.file_format = fmt
            img.save(quality=88)
            if os.path.dirname(src) == tex_dir:
                leftovers.add(src)  # p. ej. skin_diffuse.png generada por _build_skin
        # Ruta absoluta por ahora: el .blend aún no está guardado; se hace relativa al guardar.
        img.filepath = dest
        img.reload()  # recargar sin canal alfa si pasó a JPEG
    for path in leftovers:
        os.remove(path)
