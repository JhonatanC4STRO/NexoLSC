# 04 · El avatar

> **En pocas palabras:** hoy la app usa un avatar realista creado con MPFB 2, con licencia libre. Lo más
> importante de un
> avatar para lengua de señas es que **las manos se lean bien**: piel y ropa de colores distintos, manos un
> poco grandes y dedos bien separados.

## 1. Los avatares disponibles

La app tiene un **selector de avatar** para comparar los avatares con las mismas palabras. Todos tienen
el mismo tipo de esqueleto y las mismas animaciones con los mismos nombres. Las letras se perfeccionan a
mano en Blender (ver [06](06-animation-clips.md)).

| Avatar | Uso | Licencia | Altura | Archivo |
|---|---|---|---|---|
| `mpfb2` | **El que sale por defecto** | Libre (CC0) | 1,71 m | ~5,3 MB, 28 animaciones |
| `miles-prueba` | Solo en tu equipo, no se publica | Derechos de autor de otros | — | ver el anexo |

Las 28 animaciones son: la pose de reposo más una por cada letra (27).

> Hubo un segundo avatar, `mpfb2-caricatura` (versión caricaturesca con los rasgos del autor). **Se eliminó
> el 2026-10-08** porque no gustó el resultado. Sigue en el historial de git (versiones v0.2.0 a v0.3.0) por
> si algún día se quiere recuperar.

Los avatares MPFB se crean con un programa: cada uno tiene su ficha
(`assets-src/avatars/<id>/build_avatar.py`) y un generador común (`tools/blender/mpfb_builder.py`).
Así quedó `mpfb2`:

| Aspecto | Cómo quedó | ¿Cumple lo pedido? (sección 2) |
|---|---|---|
| Esqueleto | 930 huesos para posar; **181 huesos** que mueven el cuerpo | ⚠️ Son más de los 55–80 buscados porque incluye los huesos de la **cara**. Sirven para las expresiones en el futuro. Falta medir si los celulares los mueven bien |
| Manos | 3 huesos por dedo + **huesos de la palma** | ✅ La palma se puede ahuecar (letras C, O, Q) |
| Cara | Visible, con huesos en párpados, cejas, mandíbula, labios y lengua | ✅ Lista para gestos de la cara |
| Detalle del cuerpo | ~19.000–24.000 puntos | ✅ Liviano para la web |
| Materiales | Opacos; el pelo, las cejas y las pestañas usan recorte | ✅ Sin errores de dibujo en el navegador |
| Peso | ~5 MB, porque cada animación guarda también huesos que no se mueven (cara, piernas) | ⚠️ Se puede reducir más adelante |

### `mpfb2` — hombre joven realista

Piel morena media, pelo corto, camisa azul oscuro lisa de manga larga y jeans. Las manos contrastan con la
ropa, como en los intérpretes de lengua de señas.

### Problemas que aparecieron y cómo se resolvieron

Todo esto ya está corregido en `mpfb_builder.py`:

- **El avatar salía transparente y pesaba 19 MB.** Los materiales de MakeHuman marcaban todo como
  transparente y se guardaba en PNG. Ahora solo el pelo, las cejas y las pestañas usan recorte, y las
  demás texturas se guardan en JPEG.
- **Los dedos y los brazos se mueven de forma distinta.** En Blender, los dedos usan un tipo de rotación y
  los brazos otro. Además, los brazos venían en modo «sigue a la mano» (IK) y hay que pasarlos a modo
  «hueso por hueso» (FK). `mpfb_builder.py` deja los brazos en FK, que es como se posan a mano.
- **La altura no era la esperada.** El ajuste de altura de MakeHuman no va en metros: 0,5 → 1,59 m,
  0,6 → 1,71 m, 0,8 → 1,97 m.
- **Algunas pieles no cargaban.** No todas nombran igual su imagen; ahora se lee el nombre desde el
  archivo del material.

## 2. Qué debe tener un buen avatar para LSC

### Que las manos se lean bien (lo más importante)

- Piel de tono medio y ropa lisa de **otro** color (sin estampados ni guantes). Fondo claro o una foto
  desenfocada.
- Manos un poco más grandes de lo normal (10–15 %) si el estilo es caricaturesco.
- Suficiente detalle en los nudillos y en la base del pulgar para que se doblen bien, y en la palma para
  que se pueda ahuecar (C, O, Q).
- Uñas visibles: ayudan a ver hacia dónde apuntan los dedos.

### Cara (importante después, aunque hoy no se use)

- Cara **visible** y que se pueda mover (cejas, ojos, boca, mejillas). En LSC, la cara también comunica;
  el diccionario DBLSC lo describe en su Anexo 4.
- Cuello y cabeza que se puedan mover para asentir, negar o inclinar la cabeza.

### Límites para que funcione bien en la web

| Qué | Objetivo |
|---|---|
| Detalle del cuerpo | 15.000–40.000 triángulos (las manos pueden llevar una cuarta parte) |
| Huesos que mueven el cuerpo | 55–80 (cuerpo, manos, mandíbula y ojos). Los avatares actuales tienen 181 por los de la cara |
| Huesos que afectan a cada punto | 4 como máximo |
| Imágenes (texturas) | 2048 px como máximo, en JPEG salvo las que necesitan transparencia |
| Peso del archivo `.glb` | Menos de 5 MB |
| Escala | 1 unidad = 1 metro, con los pies en el suelo |
| Pose de partida en Blender | Brazos abiertos en A o en T, dedos rectos y relajados |

### Estilo

- Mejor amable y algo estilizado que hiperrealista: un humano «casi real» puede resultar inquietante, y un
  estilo amable disimula pequeños errores de animación.
- Diversidad: varios avatares con el mismo esqueleto y distinta apariencia.
- Identidad propia: no parecerse a avatares de otros productos ni a personajes con derechos de autor.

## 3. Dónde conseguir un avatar que se pueda usar legalmente

| Opción | Licencia | A favor | En contra |
|---|---|---|---|
| **MPFB 2 (MakeHuman para Blender)** — *la que se usa* | Libre (CC0) | Persona completa con dedos y cara, se crea con un programa | Estilo realista; hay que personalizarlo |
| **Blender Studio – Human Base Meshes** | Libre (CC0) | Buena forma, fácil de estilizar | No trae esqueleto: hay que ponérselo |
| **VRoid Studio** | Lo que creas es tuyo (revisar los términos) | Estilo anime con cara expresiva | Estilo muy particular; hay que convertir el formato |
| **Contratar a un artista 3D** | Se ceden los derechos por contrato | Identidad propia, caricatura de verdad, manos a medida | Cuesta dinero y tiempo |

Guarda la licencia de cada avatar en `assets-src/avatars/<id>/LICENSE.md`.

## 4. Cómo se ve el avatar en pantalla

```text
            ┌───────────────────────┐
            │       (cabeza)        │  ← espacio libre sobre la cabeza
            │   ✋                   │  ← zona donde se hacen las señas: de la cintura
            │  (hombros)            │     a la cabeza, y un poco a los lados
            │        (torso)        │
            │       (cintura)       │  ← borde de abajo del cuadro
            └───────────────────────┘
```

- **Cámara:** de frente, a la altura del pecho. Se puede girar un poco para ver la mano de lado (útil en
  letras como P o G).
- **Luces:** una luz general, una principal desde arriba y una de contraluz para separar los dedos del
  fondo.
- **Fondo:** la foto de la sede del SENA, desenfocada y con un velo claro (ajustes en
  `src/avatar/stage.ts`, ver [13](13-diseno-interfaz.md)).
- **Reposo:** brazos relajados a los lados.
- **Mano que seña:** la **derecha**, como en la fuente. Más adelante se puede añadir un «modo zurdo».

## Anexo: el avatar de prueba que se descartó (Miles Morales)

El primer avatar sirvió para comprobar que el camino Blender → archivo .glb → navegador funcionaba, pero
**no se puede publicar**:

- Es un personaje de Marvel y Sony, descargado de un sitio que redistribuye modelos.
- Tiene la cara cubierta con una máscara, así que no puede hacer expresiones.
- Usa guantes negros, que hacen difícil ver los dedos.

Solo está en el equipo local (`assets-src/avatars/miles-prueba/`, excluido de git).
