# 04 · Diseño del avatar

## 1. Candidatos de avatar

La app tiene un **selector de avatar** para comparar candidatos con las mismas palabras y controles.
Todos cumplen el mismo contrato (rig Rigify con huesos `DEF-*`, clips `rest` + `sign_*`) y reciben las
mismas 27 letras desde `assets-src/letters/alfabeto_lsc.json` (ver [06](06-animation-clips.md)).

| Candidato | Estado | Licencia | Altura | GLB |
|---|---|---|---|---|
| `mpfb2-caricatura` | **Por defecto** | CC0 | 1,66 m | ~5,0 MB, 28 clips |
| `mpfb2` | Alternativo | CC0 | 1,71 m | ~5,3 MB, 28 clips |
| `miles-prueba` | Solo local (no se publica) | Derechos de terceros | — | ver anexo |

Los dos candidatos MPFB se generan por script (`assets-src/avatars/<id>/build_avatar.py` con el
generador compartido `tools/blender/mpfb_builder.py`) y comparten estas características:

| Aspecto | Resultado | vs. requisitos (sección 2) |
|---|---|---|
| Rig | Rigify completo: 930 huesos de control, **181 de deformación** | ⚠️ Más que el objetivo (55–80) por el **rig facial**; útil para las fases con expresiones. Rendimiento a medir en móviles |
| Manos | 3 falanges por dedo + **metacarpianos** (`DEF-palm.01–04`) | ✅ Permite ahuecar la mano (C, O, Q) |
| Cara | Visible, con huesos de párpados, cejas, mandíbula, labios y lengua | ✅ Preparado para no manuales |
| Vértices | ~19.000–24.000 en total | ✅ Presupuesto web |
| Materiales | Opacos, salvo pelo, cejas y pestañas en recorte (`MASK`); texturas JPEG salvo las de transparencia | ✅ Sin errores de orden de dibujo en three.js |
| Peso | ~5 MB, porque cada clip guarda también huesos que no se mueven (cara, piernas) | ⚠️ Optimizable con `gltf-transform` |

### `mpfb2-caricatura` — versión caricaturesca con los rasgos del autor

Objetivo: un estilo caricaturesco amable, con identidad propia (sin copiar avatares de otros productos) y
parecido a los rasgos del autor del proyecto, tomados de sus fotos y con su consentimiento. Las fotos no
forman parte del repositorio.

| Rasgo | Cómo se logró |
|---|---|
| Cara redonda y llena, cabeza más grande | *targets* `head-round`, `head-fat`, `head-scale-*`, `cheek-volume`, `chin-width` |
| Ojos más grandes, café oscuro | `eye-scale` + iris recoloreado (el "brown" de MakeHuman es rojizo) |
| Nariz ancha, labios llenos | `nose-scale-horiz`, `nose-volume`, `mouth-*lip-volume` |
| Cejas negras gruesas y rectas | cejas `eyebrow009` |
| Pelo negro peinado hacia arriba/atrás | pelo `short04` |
| Piel trigueña clara | mezcla de pieles CC0 (55 % `young_caucasian_male`, 25 % `young_asian_male`, 20 % `young_african_male`) |
| Camiseta negra lisa | `male_casualsuit06` con la camiseta recoloreada a negro y el logo eliminado |
| Manos más grandes | `hand-scale` y `hand-fingers-diameter`: se leen mejor las configuraciones |

**Límite:** MPFB produce humanos realistas; el resultado es "realista con proporciones caricaturescas", no
un personaje de animación estilizado. Para ese acabado, la ruta es un artista 3D (o un flujo de diseño 2D
→ malla 3D con IA, que requiere un plan de pago) y aplicarle las mismas letras con `bake_letters.py`.

### `mpfb2` — hombre joven realista

Piel morena media (mezcla 50/50 de dos pieles CC0), pelo corto, camisa azul oscuro lisa de manga larga y
jeans: contraste mano/ropa como el de los intérpretes.

### Lecciones del proceso (resueltas en `mpfb_builder.py`)

- Los materiales de MakeHuman conectan el alfa de todas las texturas; el exportador glTF los marcaba como
  transparentes (`BLEND`), lo que en three.js causa errores de orden de dibujo, y guardaba todo en PNG
  (19 MB). Se desconecta el alfa en los opacos y se usa recorte (`MASK`) en pelo, cejas y pestañas.
- En el Rigify actual los dedos usan rotación Euler y los brazos cuaterniones; los brazos vienen en IK
  y se pasan a FK. `tools/blender/pose_helpers.py` maneja ambos modos.
- El parámetro `height` de MakeHuman no es lineal en metros: 0,5 → 1,59 m, 0,6 → 1,71 m, 0,8 → 1,97 m.
- No todas las pieles nombran igual su textura: se lee la ruta desde el `.mhmat`.

## 2. Requisitos del avatar

### Legibilidad de las manos (prioridad 1)

- Piel de tono medio y ropa lisa de **otro** tono (sin estampados ni guantes). El fondo del escenario es
  claro o una foto desenfocada.
- Manos un poco más grandes de lo realista (10–15 %) si el estilo es caricaturesco.
- Topología de manos: 2–3 anillos de aristas en cada nudillo y en la base del pulgar; palma con
  suficientes vértices para ahuecarse (letras C, O, Q).
- Uñas visibles (ayudan a leer la orientación de los dedos).

### Cara (prioridad 2, aunque el MVP no la use)

- Cara **visible** y con *shape keys* o huesos faciales (cejas, ojos, boca, mejillas). El DBLSC
  documenta este tipo de gestualidad en su Anexo 4.
- Huesos de cuello y cabeza para asentir, negar e inclinar.

### Presupuesto técnico para web

| Parámetro | Objetivo |
|---|---|
| Triángulos | 15.000–40.000 (las manos pueden llevar el 25 %) |
| Huesos de deformación | 55–80 (cuerpo + manos + mandíbula/ojos); los candidatos actuales tienen 181 por el rig facial |
| Influencias por vértice | máx. 4 |
| Texturas | 2048 px como máximo, JPEG salvo transparencias; luego KTX2 |
| Peso del `.glb` | < 5 MB |
| Escala | 1 unidad = 1 metro, pies en el origen, transformaciones aplicadas |
| Pose de reposo en Blender | A-pose o T-pose con los dedos rectos y relajados |

### Estilo

- Estilizado amable mejor que hiperrealista: evita el "valle inquietante" y perdona imperfecciones de
  animación.
- Diversidad: varios avatares con el mismo esqueleto y distinta malla.
- Identidad propia: no parecerse a avatares de otros productos ni a personajes con derechos.

## 3. De dónde sacar un avatar legal

| Opción | Licencia | Ventajas | Desventajas |
|---|---|---|---|
| **MPFB2 (MakeHuman para Blender)** — *en uso* | Recursos CC0 | Humano completo, rig con dedos y cara, generable por script | Estilo realista; hay que personalizar |
| **Blender Studio – Human Base Meshes** | CC0 | Buena topología, fácil de estilizar | Sin rig: hay que riggear (Rigify) |
| **VRoid Studio** | Los modelos que creas son tuyos (revisar los términos vigentes) | Estilo anime, cara expresiva lista | Estilo muy particular; exportación VRM → glTF |
| **Encargar a un artista 3D** | Cesión de derechos por contrato | Identidad propia, estilo caricaturesco real, manos a medida | Costo y tiempo |

Guarda los términos de licencia de cada candidato en `assets-src/avatars/<id>/LICENSE.md`.

## 4. Encuadre y escena

```text
            ┌───────────────────────┐
            │       (cabeza)        │  ← margen sobre la cabeza
            │   ✋                   │  ← espacio de señado: de la cintura
            │  (hombros)            │     a la cabeza, un poco a los lados
            │        (torso)        │
            │       (cintura)       │  ← borde inferior del cuadro
            └───────────────────────┘
```

- Cámara frontal a la altura del pecho, campo de visión 30°, órbita limitada (el usuario puede girar
  un poco para ver la mano de perfil; útil para letras como P o G).
- Luces: hemisférica + principal alta + contraluz para separar los dedos del fondo.
- Fondo: foto de la sede del SENA desenfocada y con velo claro (`src/avatar/stage.ts`, ver
  [13](13-diseno-interfaz.md)).
- Pose `rest`: brazos relajados a los lados.
- Mano dominante: **derecha** (así se ilustra en la fuente). Queda prevista la opción de "modo
  espejo/zurdo" (fase posterior).

## Anexo: avatar de prueba descartado (Miles Morales)

El primer avatar (`spmiles.blend`) sirvió para validar la cadena Blender → GLB → navegador, pero **no se
puede publicar**: es un personaje de Marvel/Sony descargado de un sitio de redistribución, tiene la cara
cubierta por una máscara (sin expresiones posibles) y guantes negros que dificultan leer los dedos. Además
traía problemas técnicos que el script de exportación limpia: dos modificadores Armature, grupos de
vértices duplicados y escala de ~6,5 unidades. Vive solo en el equipo local
(`assets-src/avatars/miles-prueba/`, excluido de git).
