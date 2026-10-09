"""
Genera los diagramas de la documentación (docs/diagramas/*.html) con el estilo de la skill
«diagram-design» y la marca NexoLSC (perfil ~/.diagram-design/profiles/nexolsc.md).

Uso (desde la raíz del proyecto):  npm run docs:diagramas
  1. escribe un .html por diagrama en docs/diagramas/ (la fuente, se abre en el navegador);
  2. si encuentra la skill instalada, lo exporta a .svg (la imagen que usan los documentos).

Reglas que aplica (diagram-design §6): conectores en ángulo recto con esquinas redondeadas (r=8),
etiquetas con máscara y 8 px de separación, flechas antes que las cajas, leyenda abajo,
<title>/<desc> accesibles y como máximo 1–2 elementos de acento por diagrama.
"""
import glob
import html
import os
import subprocess
import sys

OUT = os.path.join('docs', 'diagramas')

# ---------- Marca NexoLSC (tema claro) ----------
PAPER = '#f5f9f6'
INK = '#0f2a2e'
MUTED = '#4a6266'
SOFT = '#71898a'
ACCENT = '#0b6b4f'
LINK = '#7a4f00'
SANS = "'Atkinson Hyperlegible', 'Segoe UI', Arial, sans-serif"
MONO = "'Geist Mono', Consolas, 'Courier New', monospace"
FONTS = ('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800'
         '&family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&family=Geist+Mono:wght@400;500;600&display=swap')

KINDS = {  # tratamiento de nodos (style-guide § Node type → treatment)
    'focal': dict(fill='rgba(11,107,79,0.08)', stroke=ACCENT, tag=ACCENT, label='Foco'),
    'backend': dict(fill='#ffffff', stroke=INK, tag=MUTED, label='Paso'),
    'store': dict(fill='rgba(15,42,46,0.05)', stroke=MUTED, tag=MUTED, label='Datos o archivo'),
    'external': dict(fill='rgba(15,42,46,0.03)', stroke='rgba(15,42,46,0.30)', tag=MUTED, label='Externo'),
    'input': dict(fill='rgba(74,98,102,0.10)', stroke=SOFT, tag=MUTED, label='Entrada'),
    'optional': dict(fill='rgba(15,42,46,0.02)', stroke='rgba(15,42,46,0.35)', tag=MUTED, label='Opcional', dash='4,3'),
}
ARROWS = {'muted': (MUTED, 'arrow'), 'accent': (ACCENT, 'arrow-accent'), 'link': (LINK, 'arrow-link')}


def esc(t):
    return html.escape(t, quote=True)


def mono_w(text, size):
    """Ancho de una etiqueta mono: 0.62 em por carácter + 8 px de relleno, redondeado a 4."""
    w = len(text) * 0.62 * size + 8
    return int(-(-w // 4) * 4)


class Diagram:
    def __init__(self, slug, title, desc, eyebrow, width, height):
        self.slug, self.title, self.desc, self.eyebrow = slug, title, desc, eyebrow
        self.w, self.h = width, height
        self.zones, self.edges, self.labels, self.nodes, self.extra, self.legend = [], [], [], [], [], []
        self.kinds_used, self.arrows_used = [], []
        self.no_legend = False  # para diagramas cuyas piezas ya tienen su propio texto

    # ----- piezas -----
    def zone(self, x, y, w, h, label):
        self.zones.append(
            f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" fill="rgba(15,42,46,0.025)" '
            f'stroke="rgba(15,42,46,0.16)" stroke-width="1"/>'
            f'<text x="{x + 12}" y="{y + 18}" fill="{SOFT}" font-size="8" font-family="{MONO}" '
            f'letter-spacing="0.14em">{esc(label)}</text>')

    def node(self, x, y, w, h, kind, name, sub=(), tag=None, shape='rect'):
        k = KINDS[kind]
        if kind not in self.kinds_used:
            self.kinds_used.append(kind)
        dash = f' stroke-dasharray="{k["dash"]}"' if 'dash' in k else ''
        rx = {'rect': 6, 'state': 8, 'oval': h // 2}.get(shape, 6)
        cx = x + w / 2
        out = []
        if shape == 'diamond':
            pts = f'{cx},{y} {x + w},{y + h / 2} {cx},{y + h} {x},{y + h / 2}'
            out.append(f'<polygon points="{pts}" fill="{PAPER}"/>')
            out.append(f'<polygon points="{pts}" fill="{k["fill"]}" stroke="{k["stroke"]}" stroke-width="1.2"{dash}/>')
        else:
            out.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{PAPER}"/>')
            out.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{k["fill"]}" '
                       f'stroke="{k["stroke"]}" stroke-width="1"{dash}/>')
        sub = ([sub] if sub else []) if isinstance(sub, str) else list(sub)
        if shape == 'diamond':  # en un rombo todas las líneas son parte de la pregunta
            lines = [name] + sub
            y0 = y + h / 2 - (len(lines) - 1) * 7 + 4
            for i, line in enumerate(lines):
                out.append(f'<text x="{cx}" y="{y0 + 14 * i:.0f}" fill="{INK}" font-size="12" font-weight="700" '
                           f'font-family="{SANS}" text-anchor="middle">{esc(line)}</text>')
            self.nodes.append(''.join(out))
            return
        top = y
        if tag:
            tw = mono_w(tag, 7)
            out.append(f'<rect x="{x + 8}" y="{y + 6}" width="{tw}" height="12" rx="2" fill="none" '
                       f'stroke="{k["tag"]}" stroke-opacity="0.45" stroke-width="0.8"/>'
                       f'<text x="{x + 8 + tw / 2}" y="{y + 15}" fill="{k["tag"]}" font-size="7" '
                       f'font-family="{MONO}" text-anchor="middle" letter-spacing="0.08em">{esc(tag)}</text>')
            top = y + 14
        block = 12 + 13 * len(sub)            # alto del nombre + subrenglones
        base = top + (y + h - top) / 2 - block / 2 + 10
        out.append(f'<text x="{cx}" y="{base:.0f}" fill="{INK}" font-size="12" font-weight="700" '
                   f'font-family="{SANS}" text-anchor="middle">{esc(name)}</text>')
        for i, line in enumerate(sub):
            out.append(f'<text x="{cx}" y="{base + 14 + 13 * i:.0f}" fill="{MUTED}" font-size="9" '
                       f'font-family="{MONO}" text-anchor="middle">{esc(line)}</text>')
        self.nodes.append(''.join(out))

    def dot(self, x, y):
        self.nodes.append(f'<circle cx="{x}" cy="{y}" r="6" fill="{INK}"/>')

    def edge(self, pts, style='muted', dashed=False, label=None, seg=None, side='above', end=True):
        color, marker = ARROWS[style]
        key = (style, dashed)
        if key not in self.arrows_used:
            self.arrows_used.append(key)
        d = round_path(pts)
        dash = ' stroke-dasharray="5,4"' if dashed else ''
        mk = f' marker-end="url(#{marker})"' if end else ''
        self.edges.append(f'<path d="{d}" fill="none" stroke="{color}" stroke-width="1.2"{dash}{mk}/>')
        if label:
            if seg is None:  # el tramo más largo
                seg = max(range(len(pts) - 1), key=lambda i: abs(pts[i + 1][0] - pts[i][0]) + abs(pts[i + 1][1] - pts[i][1]))
            (x1, y1), (x2, y2) = pts[seg], pts[seg + 1]
            self.label((x1 + x2) / 2, (y1 + y2) / 2, label, side, horizontal=(y1 == y2))

    def label(self, mx, my, text, side, horizontal=True):
        w, h, gap = mono_w(text, 8), 12, 8
        if side == 'above':
            rx, ry = mx - w / 2, my - gap - h
        elif side == 'below':
            rx, ry = mx - w / 2, my + gap
        elif side == 'right':
            rx, ry = mx + gap, my - h / 2
        else:  # left
            rx, ry = mx - gap - w, my - h / 2
        self.labels.append(
            f'<rect x="{rx:.0f}" y="{ry:.0f}" width="{w}" height="{h}" rx="2" fill="{PAPER}"/>'
            f'<text x="{rx + w / 2:.0f}" y="{ry + 9:.0f}" fill="{MUTED}" font-size="8" font-family="{MONO}" '
            f'text-anchor="middle" letter-spacing="0.06em">{esc(text)}</text>')

    def raw(self, svg):
        self.extra.append(svg)

    def callout(self, x, y, text, anchor='start'):
        self.extra.append(f'<text x="{x}" y="{y}" fill="{MUTED}" font-size="14" font-style="italic" '
                          f'font-family="{SANS}" text-anchor="{anchor}">{esc(text)}</text>')

    # ----- salida -----
    def legend_svg(self, extra_items=()):
        y = self.h - 36
        out = [f'<line x1="32" y1="{y - 12}" x2="{self.w - 32}" y2="{y - 12}" stroke="rgba(15,42,46,0.10)" stroke-width="0.8"/>',
               f'<text x="32" y="{y + 4}" fill="{MUTED}" font-size="8" font-family="{MONO}" letter-spacing="0.14em">LEYENDA</text>']
        x = 108
        for kind in self.kinds_used:
            k = KINDS[kind]
            dash = f' stroke-dasharray="{k["dash"]}"' if 'dash' in k else ''
            out.append(f'<rect x="{x}" y="{y - 6}" width="20" height="12" rx="3" fill="{k["fill"]}" stroke="{k["stroke"]}" stroke-width="1"{dash}/>'
                       f'<text x="{x + 28}" y="{y + 4}" fill="{MUTED}" font-size="9" font-family="{MONO}">{esc(k["label"])}</text>')
            x += 28 + len(k['label']) * 5.6 + 16
        names = {('muted', False): 'Flujo', ('muted', True): 'Opcional o respuesta', ('accent', False): 'Camino principal',
                 ('accent', True): 'Respuesta principal', ('link', False): 'Externo', ('link', True): 'Externo opcional'}
        for style, dashed in self.arrows_used:
            color, marker = ARROWS[style]
            dash = ' stroke-dasharray="5,4"' if dashed else ''
            label = names[(style, dashed)]
            out.append(f'<line x1="{x}" y1="{y}" x2="{x + 24}" y2="{y}" stroke="{color}" stroke-width="1.2"{dash} marker-end="url(#{marker})"/>'
                       f'<text x="{x + 32}" y="{y + 4}" fill="{MUTED}" font-size="9" font-family="{MONO}">{esc(label)}</text>')
            x += 32 + len(label) * 5.6 + 16
        for label, svg in extra_items:
            out.append(svg.format(x=x, y=y) + f'<text x="{x + 28}" y="{y + 4}" fill="{MUTED}" font-size="9" font-family="{MONO}">{esc(label)}</text>')
            x += 28 + len(label) * 5.6 + 16
        return ''.join(out)

    def html(self, legend_extra=()):
        s = self.slug
        markers = ''.join(
            f'<marker id="{mid}" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">'
            f'<polygon points="0 0, 8 3, 0 6" fill="{c}"/></marker>' for c, mid in ARROWS.values())
        svg = (f'<svg viewBox="0 0 {self.w} {self.h}" xmlns="http://www.w3.org/2000/svg" role="img" '
               f'aria-labelledby="{s}-title {s}-desc">'
               f'<title id="{s}-title">{esc(self.title)}</title><desc id="{s}-desc">{esc(self.desc)}</desc>'
               f'<defs>{markers}</defs><rect width="100%" height="100%" fill="{PAPER}"/>'
               + ''.join(self.zones) + ''.join(self.edges) + ''.join(self.labels) + ''.join(self.nodes)
               + ''.join(self.extra) + ('' if self.no_legend else self.legend_svg(legend_extra)) + '</svg>')
        return f'''<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{esc(self.title)} · NexoLSC</title>
  <link href="{esc(FONTS)}" rel="stylesheet">
  <style>
    *, *::before, *::after {{ box-sizing: border-box; margin: 0; padding: 0; }}
    :root {{ --color-paper: {PAPER}; --color-ink: {INK}; --color-muted: {MUTED}; --color-accent: {ACCENT}; }}
    body {{ font-family: {SANS}; background: var(--color-paper); color: var(--color-ink); min-height: 100vh;
           display: flex; align-items: center; justify-content: center; padding: 3rem 2rem; }}
    .frame {{ max-width: 1200px; width: 100%; }}
    .diagram-container {{ width: 100%; overflow-x: auto; }}
    .eyebrow {{ font-family: {MONO}; font-size: 0.66rem; font-weight: 500; letter-spacing: 0.18em;
               text-transform: uppercase; color: var(--color-muted); margin-bottom: 0.5rem; }}
    h1 {{ font-family: 'Baloo 2', 'Atkinson Hyperlegible', sans-serif; font-size: clamp(1.5rem, 2.4vw + 0.75rem, 2rem);
         font-weight: 800; letter-spacing: -0.02em; line-height: 1.15; color: var(--color-ink); margin-bottom: 1.5rem; }}
    svg {{ width: 100%; min-width: {self.w}px; display: block; }}
    @media print {{ .diagram-container {{ overflow-x: visible; }} svg {{ min-width: 0; }} }}
  </style>
</head>
<body>
  <div class="frame">
    <p class="eyebrow">{esc(self.eyebrow)} · NexoLSC</p>
    <h1>{esc(self.title)}</h1>
    <div class="diagram-container">
      {svg}
    </div>
  </div>
</body>
</html>
'''


def round_path(pts, r=8):
    """Camino ortogonal con esquinas redondeadas (cuarto de círculo) de radio r."""
    if len(pts) == 2:
        return f'M{pts[0][0]} {pts[0][1]} L{pts[1][0]} {pts[1][1]}'
    d = [f'M{pts[0][0]} {pts[0][1]}']
    for i in range(1, len(pts) - 1):
        (x0, y0), (x1, y1), (x2, y2) = pts[i - 1], pts[i], pts[i + 1]
        l1 = abs(x1 - x0) + abs(y1 - y0)
        l2 = abs(x2 - x1) + abs(y2 - y1)
        rr = min(r, l1 / 2, l2 / 2)
        ax = x1 - (rr if x1 > x0 else -rr if x1 < x0 else 0)
        ay = y1 - (rr if y1 > y0 else -rr if y1 < y0 else 0)
        bx = x1 + (rr if x2 > x1 else -rr if x2 < x1 else 0)
        by = y1 + (rr if y2 > y1 else -rr if y2 < y1 else 0)
        cross = (x1 - x0) * (y2 - y1) - (y1 - y0) * (x2 - x1)
        sweep = 1 if cross > 0 else 0
        d.append(f'L{ax:g} {ay:g} A{rr:g} {rr:g} 0 0 {sweep} {bx:g} {by:g}')
    d.append(f'L{pts[-1][0]} {pts[-1][1]}')
    return ' '.join(d)


# =====================================================================================
# Los diagramas
# =====================================================================================

def d_capas():
    d = Diagram('01-piezas-pagina', 'Las piezas de la página web',
                'La pantalla envía el texto o la voz al núcleo, que limpia el texto, arma la lista de señas y la '
                'reproduce; el reproductor le dice al avatar 3D qué pose mostrar y avisa a la pantalla la letra actual.',
                'Arquitectura', 960, 600)
    d.zone(248, 64, 688, 280, 'NÚCLEO · FUNCIONA SIN PANTALLA NI 3D')
    d.zone(472, 392, 464, 136, 'AVATAR 3D · THREE.JS + FOTO DE FONDO')
    d.edge([(100, 96), (100, 32), (844, 32), (844, 176)], label='ÓRDENES', seg=1, side='above')
    d.edge([(780, 176), (780, 44), (156, 44), (156, 96)], dashed=True, label='LETRA ACTUAL', seg=1, side='below')
    d.edge([(216, 116), (272, 116)])
    d.edge([(128, 152), (128, 256)], label='VOZ', side='right')
    d.edge([(216, 284), (244, 284), (244, 136), (272, 136)])
    d.edge([(456, 124), (472, 124), (472, 196), (488, 196)])
    d.edge([(456, 284), (580, 284), (580, 232)])
    d.edge([(672, 204), (720, 204)], label='LISTA', side='above')
    d.edge([(812, 232), (812, 432)], style='accent', label='60 POSES/S', side='right')
    d.edge([(672, 460), (712, 460)])
    d.node(40, 96, 176, 56, 'input', 'Pantalla', 'botones · campo · letras', tag='UI')
    d.node(40, 256, 176, 56, 'external', 'Voz del navegador', 'Web Speech API', tag='WEB')
    d.node(272, 96, 184, 56, 'backend', 'Limpiar el texto', 'normalizeText', tag='TEXTO')
    d.node(272, 256, 184, 56, 'store', 'Diccionario de señas', 'SignRepository', tag='DATOS')
    d.node(488, 176, 184, 56, 'backend', 'Armar la lista', 'buildQueue', tag='LISTA')
    d.node(720, 176, 184, 56, 'focal', 'Reproductor', 'reloj · estados · velocidad', tag='NÚCLEO')
    d.node(496, 432, 176, 56, 'store', 'Archivo del avatar', 'mpfb2.glb', tag='GLB')
    d.node(712, 432, 200, 56, 'backend', 'Mezclador de animaciones', 'ClipDriver', tag='3D')
    return d


def d_taller():
    d = Diagram('01-taller-contenido', 'Cómo se crean los avatares y sus letras',
                'La ficha del personaje crea el avatar en Blender; sus letras se perfeccionan a mano (o se copian de '
                'otro avatar) y luego se exporta el archivo .glb que la app registra.',
                'Proceso', 960, 448)
    d.edge([(816, 104), (816, 168)], dashed=True, label='AVATAR NUEVO', side='right')
    d.edge([(232, 196), (272, 196)])
    d.edge([(472, 196), (512, 196)])
    d.edge([(712, 196), (752, 196)], style='accent')
    d.edge([(856, 224), (856, 296)], style='accent', label='CTRL + S', side='right')
    d.edge([(752, 324), (712, 324)])
    d.edge([(512, 324), (472, 324)])
    d.node(752, 48, 208 - 16, 56, 'optional', 'Letras de otro avatar', 'File › Append › Action', tag='COPIA')
    d.node(32, 168, 200, 56, 'input', 'Ficha del personaje', 'build_avatar.py', tag='FICHA')
    d.node(272, 168, 200, 56, 'backend', 'Crear el avatar', 'MPFB 2 · Rigify', tag='BLENDER')
    d.node(512, 168, 200, 56, 'store', 'Avatar en Blender', 'avatar.blend · el original', tag='BLEND')
    d.node(752, 168, 176, 56, 'focal', 'Perfeccionar letras', 'npm run avatar:abrir', tag='A MANO')
    d.node(752, 296, 176, 56, 'backend', 'Exportar para la web', 'npm run avatar:exportar', tag='EXPORTAR')
    d.node(512, 296, 200, 56, 'store', 'Archivo del avatar', 'public/models/avatars/', tag='GLB')
    d.node(272, 296, 200, 56, 'backend', 'Registrar en la app', 'src/avatar/avatars.ts', tag='APP')
    return d


def d_texto():
    d = Diagram('01-texto-avatar', 'Del texto al avatar, paso a paso',
                'El texto escrito se limpia, se convierte en una lista de señas, el reproductor avanza su reloj en cada '
                'cuadro y el avatar mezcla las animaciones de la pose del momento.',
                'Proceso', 960, 392)
    d.edge([(288, 108), (368, 108)], label='LIMPIAR', side='above')
    d.edge([(592, 108), (672, 108)], label='BUSCAR SEÑAS', side='above')
    d.edge([(784, 136), (784, 248)], label='CARGAR', side='right')
    d.edge([(672, 276), (592, 276)], style='accent', label='CADA CUADRO', side='above')
    d.edge([(368, 276), (288, 276)], label='MEZCLAR', side='above')
    d.node(64, 80, 224, 56, 'input', 'Lo que escribes', '¿Cómo estás?', tag='TEXTO')
    d.node(368, 80, 224, 56, 'backend', 'Letras limpias', 'C O M O · E S T A S', tag='LETRAS')
    d.node(672, 80, 224, 56, 'backend', 'Lista de señas', 'una seña por letra', tag='LISTA')
    d.node(672, 248, 224, 56, 'focal', 'Reproductor', 'avanza su reloj', tag='NÚCLEO')
    d.node(368, 248, 224, 56, 'backend', 'Pose del momento', 'de qué letra a cuál', tag='POSE')
    d.node(64, 248, 224, 56, 'store', 'El avatar se mueve', '60 veces por segundo', tag='3D')
    return d


def d_esqueletos():
    d = Diagram('05-dos-esqueletos', 'Dos esqueletos, dos trabajos',
                'En Blender el avatar tiene un esqueleto de control de 930 huesos para posarlo; al exportar solo se '
                'guardan los 181 huesos que mueven el cuerpo, que son los que usa el navegador.',
                'Arquitectura', 960, 320)
    d.zone(40, 40, 368, 192, 'PARA CREAR · BLENDER')
    d.zone(552, 40, 368, 192, 'PARA MOSTRAR · NAVEGADOR')
    d.edge([(384, 140), (576, 140)], style='accent', label='EXPORTAR', side='above')
    d.label(480, 140, 'SIN CONTROLES', 'below')
    d.node(64, 80, 320, 120, 'backend', 'Esqueleto de control',
           ['930 huesos', 'controles de brazos y dedos', 'huesos de ayuda internos'], tag='RIGIFY')
    d.node(576, 80, 320, 120, 'focal', 'Esqueleto que mueve el cuerpo',
           ['181 huesos DEF', 'cada letra ya guardada', 'lo mueve three.js'], tag='GLB')
    return d


def d_tipos_letra():
    d = Diagram('06-tipos-de-letra', 'Dos tipos de letra',
                'Una letra quieta tarda 250 ms en llegar y se mantiene 600 ms; una letra con movimiento tarda 250 ms en '
                'llegar y hace su recorrido en 950 ms.', 'Línea de tiempo', 960, 264)
    d.no_legend = True  # cada barra dice lo que es
    x0, scale = 232, 0.52  # 1200 ms → 624 px
    def bar(y, ms0, ms1, kind, text):
        k = KINDS[kind]
        if kind not in d.kinds_used:
            d.kinds_used.append(kind)
        x, w = x0 + ms0 * scale, (ms1 - ms0) * scale
        d.raw(f'<rect x="{x:.0f}" y="{y}" width="{w:.0f}" height="32" rx="4" fill="{PAPER}"/>'
              f'<rect x="{x:.0f}" y="{y}" width="{w:.0f}" height="32" rx="4" fill="{k["fill"]}" stroke="{k["stroke"]}" stroke-width="1"/>'
              f'<text x="{x + w / 2:.0f}" y="{y + 20}" fill="{INK}" font-size="11" font-weight="700" font-family="{SANS}" text-anchor="middle">{esc(text)}</text>')
    def row(y, name, sub, total):
        d.raw(f'<text x="40" y="{y + 14}" fill="{INK}" font-size="11" font-weight="700" font-family="{SANS}">{esc(name)}</text>'
              f'<text x="40" y="{y + 28}" fill="{MUTED}" font-size="9" font-family="{MONO}">{esc(sub)}</text>')
        total_txt = f'{total:,}'.replace(',', '.')
        d.raw(f'<text x="{x0 + total * scale + 12:.0f}" y="{y + 20}" fill="{MUTED}" font-size="9" font-family="{MONO}">{total_txt} ms</text>')
    row(56, 'Letra quieta', '21 letras', 850)
    bar(56, 0, 250, 'store', 'Llegar · 250 ms')
    bar(56, 250, 850, 'backend', 'Mantener la pose · 600 ms')
    row(120, 'Letra con movimiento', 'G H J Ñ S Z', 1200)
    bar(120, 0, 250, 'store', 'Llegar · 250 ms')
    bar(120, 250, 1200, 'focal', 'Hacer el recorrido · 950 ms')
    axis_y = 184
    d.raw(f'<line x1="{x0}" y1="{axis_y}" x2="{x0 + 1200 * scale:.0f}" y2="{axis_y}" stroke="#d3e2da" stroke-width="1"/>')
    for ms in range(0, 1201, 300):
        x = x0 + ms * scale
        d.raw(f'<line x1="{x:.0f}" y1="{axis_y}" x2="{x:.0f}" y2="{axis_y + 4}" stroke="{SOFT}" stroke-width="1"/>'
              f'<text x="{x:.0f}" y="{axis_y + 16}" fill="{MUTED}" font-size="8" font-family="{MONO}" text-anchor="middle">{ms} ms</text>')
    d.callout(40, 236, 'A velocidad normal (1x). Los tiempos se ajustarán con personas sordas.')
    return d


def d_estados():
    d = Diagram('07-estados-reproductor', 'Los estados del reproductor',
                'El reproductor pasa de En espera a Reproduciendo; desde ahí puede pausar y continuar o terminar, y '
                'saltar a una letra lleva a En pausa; detener vuelve siempre a En espera.',
                'Máquina de estados', 960, 448)
    d.edge([(62, 200), (112, 200)], label='CARGAR', side='above')
    d.edge([(176, 172), (176, 100), (400, 100)], style='accent', label='REPRODUCIR', seg=1, side='above')
    d.edge([(464, 128), (464, 272)], label='PAUSAR', side='left')
    d.edge([(528, 272), (528, 128)], label='CONTINUAR', side='right')
    d.edge([(592, 92), (844, 92), (844, 172)], label='ÚLTIMA LETRA', seg=0, side='above')
    d.edge([(788, 172), (788, 108), (592, 108)], label='REPRODUCIR', seg=1, side='below')
    d.edge([(176, 228), (176, 300), (400, 300)], label='SALTAR', seg=1, side='above')
    d.edge([(816, 228), (816, 300), (592, 300)], label='SALTAR', seg=1, side='above')
    d.dot(56, 200)
    d.node(112, 172, 160, 56, 'backend', 'En espera', 'idle', shape='state')
    d.node(400, 72, 192, 56, 'focal', 'Reproduciendo', 'playing', shape='state')
    d.node(400, 272, 192, 56, 'backend', 'En pausa', 'paused', shape='state')
    d.node(736, 172, 160, 56, 'backend', 'Terminado', 'ended', shape='state')
    d.callout(480, 372, 'Detener, desde cualquier estado, vuelve a «En espera».', anchor='middle')
    return d


def d_secuencia():
    d = Diagram('09-recorrido-texto', 'Del texto escrito a la seña',
                'La persona escribe una palabra; la pantalla pide al núcleo la lista de señas y la carga en el '
                'reproductor; en cada cuadro el avatar pregunta qué pose mostrar y la pantalla avisa la letra actual.',
                'Secuencia', 960, 616)
    xs = [96, 288, 480, 672, 864]
    names = [('input', 'Persona', '', None), ('backend', 'Pantalla', 'App.tsx', None),
             ('backend', 'Núcleo', 'limpia · busca · arma', None), ('focal', 'Reproductor', 'SignPlayer', None),
             ('store', 'Avatar', 'ClipDriver · 3D', None)]
    for x in xs:
        d.raw(f'<line x1="{x}" y1="96" x2="{x}" y2="536" stroke="{SOFT}" stroke-width="1" stroke-dasharray="4,4"/>')
    # fragmento LOOP (se pinta antes que los mensajes)
    fx, fy, fw, fh = 256, 268, 640, 168
    d.zones.append(f'<rect x="{fx}" y="{fy}" width="{fw}" height="{fh}" rx="4" fill="rgba(15,42,46,0.02)" stroke="rgba(15,42,46,0.22)" stroke-width="1"/>'
                   f'<rect x="{fx}" y="{fy}" width="44" height="16" rx="2" fill="{PAPER}" stroke="rgba(15,42,46,0.22)" stroke-width="1"/>'
                   f'<text x="{fx + 22}" y="{fy + 12}" fill="{MUTED}" font-size="8" font-family="{MONO}" text-anchor="middle" letter-spacing="0.12em">LOOP</text>'
                   f'<text x="{fx + 56}" y="{fy + 12}" fill="{MUTED}" font-size="8" font-family="{MONO}" letter-spacing="0.04em">[en cada cuadro · 60 por segundo]</text>')
    def msg(a, b, y, text, style='muted', dashed=False):
        x1, x2 = xs[a], xs[b]
        d.edge([(x1, y), (x2 - (4 if x2 > x1 else -4), y)], style=style, dashed=dashed, label=text, side='above')
    msg(0, 1, 136, 'ESCRIBE «CASA»')
    msg(1, 2, 176, 'ARMAR LISTA')
    msg(2, 1, 212, '4 SEÑAS', dashed=True)
    msg(1, 3, 248, 'REPRODUCIR')
    msg(1, 3, 316, 'AVANZAR RELOJ')
    msg(4, 3, 352, '¿QUÉ POSE?')
    msg(3, 4, 388, 'POSE', dashed=True)
    d.edge([(864, 404), (832, 404), (832, 424), (864, 424)], label='MEZCLAR', seg=1, side='left')
    msg(3, 1, 476, 'LETRA NUEVA', dashed=True)
    msg(1, 0, 516, 'LETRA ACTUAL', style='accent')
    for (kind, name, sub, tag), x in zip(names, xs):
        d.node(x - 76, 40, 152, 56, kind, name, [sub] if sub else [])
    return d


def d_voz():
    d = Diagram('10-voz-avatar', 'De la voz al avatar',
                'Al pulsar Hablar el navegador escucha; mientras hablas muestra un texto provisional y al terminar el '
                'texto entra al campo, se convierte en letras y el avatar las seña.', 'Proceso', 960, 392)
    d.edge([(192, 124), (272, 124)])
    d.edge([(464, 124), (544, 124)], label='AL TERMINAR', side='above')
    d.edge([(368, 152), (368, 248)], style='link', dashed=True, label='MIENTRAS HABLA', side='right')
    d.edge([(640, 152), (640, 248)], label='SE REPRODUCE', side='right')
    d.edge([(736, 276), (816, 276)], style='accent')
    d.node(32, 96, 160, 56, 'input', 'Botón Hablar', 'toque o clic', tag='UI')
    d.node(272, 96, 192, 56, 'external', 'El navegador escucha', 'Web Speech · es-CO', tag='WEB')
    d.node(272, 248, 192, 56, 'optional', 'Texto provisional', 'en gris', tag='VISTA')
    d.node(544, 96, 192, 56, 'backend', 'Texto en el campo', '«Hola»', tag='TEXTO')
    d.node(544, 248, 192, 56, 'backend', 'H → O → L → A', 'lista de señas', tag='LISTA')
    d.node(816, 248, 120, 56, 'focal', 'El avatar seña', tag='3D')
    return d


def d_fase2():
    d = Diagram('16-fase2-palabras', 'Fase 2: palabras completas',
                'El texto se limpia por palabras y cada palabra se lleva a su forma base; si existe su seña se usa, y si '
                'no, se deletrea letra por letra; las dos salidas llegan al reproductor.',
                'Diagrama de flujo', 960, 696)
    cx = 440
    d.edge([(cx, 88), (cx, 128)], label='LIMPIAR', side='right')
    d.edge([(cx, 184), (cx, 224)], label='FORMA BASE', side='right')
    d.edge([(cx, 280), (cx, 308)])
    d.edge([(cx + 112, 356), (640, 356)], style='accent', label='SÍ', side='above')
    d.edge([(cx, 404), (cx, 448)], label='NO', side='right')
    d.edge([(cx, 504), (cx, 568)])
    d.edge([(752, 384), (752, 596), (cx + 120, 596)])
    d.node(cx - 140, 32, 280, 56, 'input', 'Escribes «Mi casa es grande»', shape='oval')
    d.node(cx - 112, 128, 224, 56, 'backend', 'Palabras limpias', 'MI · CASA · ES · GRANDE')
    d.node(cx - 112, 224, 224, 56, 'backend', 'Forma base de cada palabra', 'casas → CASA')
    d.node(cx - 112, 308, 224, 96, 'focal', '¿Hay seña para', ['esa palabra?'], shape='diamond')
    d.node(640, 328, 224, 56, 'store', 'Usar la seña de la palabra', 'CASA')
    d.node(cx - 112, 448, 224, 56, 'backend', 'Deletrear letra por letra', 'lo que hace hoy la app')
    d.node(cx - 120, 568, 240, 56, 'backend', 'Reproductor', shape='oval')
    return d


def d_fase3():
    d = Diagram('16-fase3-frases', 'Fase 3: frases con la gramática de la LSC',
                'Un traductor revisado por personas sordas pasa la frase en español a glosas en el orden de la LSC con '
                'gestos de la cara; de ahí se arma la lista de señas para el reproductor.',
                'Proceso', 960, 352)
    d.edge([(176, 128), (208, 128)])
    d.edge([(384, 128), (416, 128)], style='accent')
    d.edge([(632, 128), (664, 128)])
    d.edge([(808, 128), (840, 128)])
    d.edge([(524, 160), (524, 208)], dashed=True, label='EJEMPLO', side='right', end=False)
    d.node(32, 96, 144, 64, 'input', 'Frase en español', '«Mi abuelo…»', tag='TEXTO')
    d.node(208, 96, 176, 64, 'focal', 'Traductor', ['reglas + IA', 'revisado por sordos'], tag='FASE 3')
    d.node(416, 96, 216, 64, 'backend', 'Frase en orden de la LSC', 'glosas + gestos de la cara', tag='GLOSAS')
    d.node(664, 96, 144, 64, 'backend', 'Armar la lista', 'buildQueue', tag='LISTA')
    d.node(840, 96, 104, 64, 'backend', 'Reproductor', tag='NÚCLEO')
    d.node(368, 208, 312, 64, 'optional', 'PRO1POS · ABUELO · … · CUMPLEAÑOS', ['cejas arriba durante las señas 3 a 5'], tag='GLOSAS')
    return d


DIAGRAMS = [d_capas, d_taller, d_texto, d_esqueletos, d_tipos_letra, d_estados, d_secuencia, d_voz, d_fase2, d_fase3]


def find_skill():
    pattern = os.path.expanduser('~/.claude/plugins/cache/diagram-design/diagram-design/*/skills/diagram-design')
    found = sorted(glob.glob(pattern))
    return found[-1] if found else None


def main():
    os.makedirs(OUT, exist_ok=True)
    skill = find_skill()
    for make in DIAGRAMS:
        d = make()
        path = os.path.join(OUT, d.slug + '.html')
        with open(path, 'w', encoding='utf-8', newline='\n') as fh:
            fh.write(d.html())
        print('[html]', path)
        if skill:
            svg = os.path.join(OUT, d.slug + '.svg')
            subprocess.run([sys.executable, os.path.join(skill, 'scripts', 'export_svg.py'), path, svg], check=True,
                           stdout=subprocess.DEVNULL)
            print('[svg] ', svg)
    if not skill:
        print('Aviso: no encontré la skill diagram-design; solo se generaron los .html.')


if __name__ == '__main__':
    main()
