# 04 · Diseño del avatar

## 1. Diagnóstico de tu avatar actual

Archivo: `spmiles.blend` (Miles Morales, "Blender Cycles 2.90 with rig"). Lo abrí con Blender 5.2 en
modo consola, **sin modificar el original** (trabajé sobre una copia).

| Aspecto | Hallazgo | Impacto |
|---|---|---|
| Malla | `mesh7…` cuerpo: 3.265 vértices / 6.526 caras; `mesh0…` 244 vértices (parte de la cabeza) | Ligera para web ✅ |
| Rig | **Rigify**: `metarig` (55 huesos) + `rig` generado (337 huesos, 61 de deformación) | Tiene todo lo necesario para dedos ✅ |
| Dedos | Pulgar, índice, medio, anular y meñique con 3 falanges por mano; entre 50 y 150 vértices con peso por falange | Se pueden formar las letras ✅ (probado con A y L) |
| Muñeca / antebrazo | `DEF-forearm` + `DEF-forearm.001` (hueso de torsión) | Evita el efecto "envoltorio de caramelo" al girar la muñeca ✅ |
| Doble deformación | La malla tiene **dos** modificadores Armature: `metarig` y `rig` | ❌ glTF admite un solo esqueleto por malla. El script de exportación quita el del `metarig` |
| Grupos de vértices duplicados | Cada hueso tiene dos grupos (p. ej. `f_index.01.R` y `DEF-f_index.01.R`) | ❌ Se eliminan los que no son `DEF-*` al exportar |
| Influencias por vértice | Algunos vértices tienen más de 4 huesos | ⚠️ El exportador conserva los 4 de mayor peso. Revisar dedos tras exportar |
| Escala | Mide ~6,5 unidades de alto (debería medir ~1,7 m) | ⚠️ Corregir en Blender; el visor la normaliza como red de seguridad |
| Cara | **Máscara**, sin *shape keys* ni huesos faciales | ❌ Imposible hacer expresiones no manuales (fase 3) |
| Contraste | Traje y **guantes negros** | ❌ En la prueba en el navegador los dedos se distinguen poco |
| Licencia | Personaje de Marvel/Sony; los nombres internos (`desirefx.me`) indican que se descargó de un sitio de redistribución | ❌ **No se puede usar en un producto público** |

### Veredicto

Úsalo **solo para prototipar el pipeline técnico** (rig → poses → GLB → navegador). Con él ya validé que
la cadena completa funciona. Antes de mostrar el MVP a usuarios o publicarlo, **cámbialo por un avatar
original o con licencia libre**. El código no cambia: cada avatar es un GLB en `public/models/avatars/`
registrado en `src/avatar/avatars.ts`, siempre que tenga los clips con los mismos nombres. Ahora vive en
`assets-src/avatars/miles-prueba/` y está excluido de git.

## 2. Requisitos del avatar definitivo

### Legibilidad de las manos (prioridad 1)

- Piel de tono medio y ropa lisa de **otro** tono (sin estampados ni guantes). El fondo del visor es gris claro.
- Manos un poco más grandes de lo realista (10–15 %) si el estilo es caricaturesco, como en el video de referencia.
- Topología de manos: 2–3 anillos de aristas en cada nudillo y en la base del pulgar; palma con
  suficientes vértices para ahuecarse (letras C, O, Q).
- Uñas visibles (ayudan a leer la orientación de los dedos).

### Cara (prioridad 2, aunque el MVP no la use)

- Cara **visible** y con *shape keys* (idealmente las 52 de ARKit o, como mínimo: cejas arriba/abajo/juntas,
  ojos abiertos/cerrados/entrecerrados, boca abierta, labios redondeados/estirados, mejillas infladas).
  El DBLSC documenta este tipo de gestualidad en su Anexo 4.
- Huesos de cuello y cabeza para asentir, negar e inclinar.

### Presupuesto técnico para web

| Parámetro | Objetivo |
|---|---|
| Triángulos | 15.000–40.000 (las manos pueden llevar el 25 %) |
| Huesos de deformación | 55–80 (cuerpo + manos + mandíbula/ojos si aplica) |
| Influencias por vértice | máx. 4 |
| Texturas | 1–2 materiales, 2048 px, luego KTX2 |
| Peso del `.glb` | < 5 MB (el de prueba pesa 1,5 MB) |
| Escala | 1 unidad = 1 metro, pies en el origen, transformaciones aplicadas |
| Pose de reposo en Blender | A-pose o T-pose con los dedos rectos y relajados |

### Estilo

- Estilizado amable (tipo animación 3D) mejor que hiperrealista: evita el "valle inquietante" y perdona
  imperfecciones de animación.
- Diversidad: dejar la puerta abierta a varios avatares (mismo esqueleto, distinta malla).
- Identidad propia: no parecerse a los avatares de Hand Talk ni a personajes con derechos.

## 3. De dónde sacar un avatar legal

| Opción | Licencia | Ventajas | Desventajas |
|---|---|---|---|
| **MPFB2 (MakeHuman para Blender)** | Personajes generados en CC0 | Humano completo, rig con dedos, *shape keys* faciales opcionales, dentro de Blender | Estilo realista genérico; hay que personalizar |
| **Blender Studio – Human Base Meshes** | CC0 | Buena topología, fácil de estilizar | Sin rig: hay que riggear (Rigify) |
| **VRoid Studio** | Los modelos que creas son tuyos (revisar los términos vigentes) | Estilo anime, cara expresiva lista | Estilo muy particular; exportación VRM → glTF |
| **Encargar a un artista 3D** | Cesión de derechos por contrato | Identidad propia, manos a medida | Costo y tiempo |

Verifica la licencia vigente de cualquier opción antes de publicar; guarda una copia de los términos en
`assets-src/avatars/<id>/LICENSE.md`.

## 3.1 Candidatos creados

La app tiene un **selector de avatar** para compararlos con las mismas palabras y controles.

### Candidato `mpfb2` — hombre joven (2026-09-28)

Generado por script con MPFB 2.0.17 + Rigify (`assets-src/avatars/mpfb2/build_avatar.py`), solo con
recursos **CC0** (ver `assets-src/avatars/mpfb2/LICENSE.md`).

| Aspecto | Resultado | vs. requisitos |
|---|---|---|
| Aspecto | Hombre de ~25 años, piel morena media (mezcla 50/50 de dos pieles CC0), pelo corto, camisa azul oscuro lisa de manga larga, jeans | ✅ Contraste mano/ropa como el de los intérpretes |
| Altura | 1,71 m, pies en el origen, 1 unidad = 1 m | ✅ |
| Vértices | ~24.000 en total (cuerpo 7.840, ropa 8.426, dientes 3.868, pelo 1.755…) | ✅ Presupuesto web |
| Rig | Rigify completo: 930 huesos de control, **181 de deformación** | ⚠️ Más que el objetivo (55–80) por el **rig facial**; útil para las fases con expresiones. Rendimiento a medir en móviles |
| Manos | 3 falanges por dedo + **metacarpianos** (`DEF-palm.01–04`) | ✅ Permite ahuecar la mano (C, O, Q) |
| Cara | Visible, con huesos de párpados, cejas, mandíbula, labios y lengua | ✅ Preparado para no manuales |
| GLB | **3,7 MB**, texturas JPEG (PNG solo en pelo, cejas y pestañas), materiales opacos salvo pelo/cejas/pestañas en `MASK` | ✅ < 5 MB |
| Estilo | Realista genérico (MakeHuman) | ⚠️ Menos amable que un estilo caricaturesco; evaluar con usuarios |

### Candidato `mpfb2-caricatura` — versión caricaturesca con los rasgos del autor (2026-09-29) · por defecto

El objetivo era un estilo caricaturesco como el del video de referencia, pero con identidad propia (sin
copiar a Hugo de Hand Talk) y parecido a los rasgos del autor del proyecto, tomados de sus fotos.

- **Camino descartado:** diseño 2D con IA → malla 3D. El plan gratuito del servicio conectado no permite
  el modelo de imagen necesario y la conversión a 3D (9–38 créditos) no cabía en el saldo; además, las
  mallas generadas por IA suelen dar manos fusionadas.
- **Camino elegido:** MPFB2 con ajustes finos. Es gratuito y conserva manos y rig que ya funcionan.

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

Resultado: 1,66 m, 181 huesos de deformación, GLB de ~5 MB con las 27 letras. **Límite honesto:** MPFB
produce humanos realistas; el resultado es "realista con proporciones caricaturescas", no un personaje de
animación estilizado. Para ese acabado, la ruta es un artista 3D (o recargar créditos y retomar el diseño
2D → 3D) y aplicarle las mismas letras con `bake_letters.py`.

Lecciones del proceso (ya resueltas en el script):
- Los materiales de MakeHuman conectan el alfa de todas las texturas; el exportador los marcaba como
  transparentes (`BLEND`), lo que en three.js causa errores de orden de dibujo, y guardaba todo en PNG
  (19 MB). Se desconecta el alfa en los opacos y se usa recorte (`MASK`) en pelo, cejas y pestañas.
- En el Rigify actual los dedos usan rotación Euler y los brazos cuaterniones; los brazos vienen en IK
  y se pasan a FK. `tools/blender/pose_helpers.py` maneja ambos modos.
- El parámetro `height` de MakeHuman no es lineal en metros: 0,5 → 1,59 m, 0,6 → 1,71 m, 0,8 → 1,97 m.

## 4. Encuadre y escena

```text
            ┌───────────────────────┐
            │       (cabeza)        │  ← margen de ~10 % sobre la cabeza
            │   ✋                   │  ← espacio de señado: de la cintura
            │  (hombros)            │     a la cabeza, un poco a los lados
            │        (torso)        │
            │       (cintura)       │  ← borde inferior del cuadro
            └───────────────────────┘
```

- Cámara frontal a la altura del pecho, campo de visión ~30°, órbita limitada (el usuario puede girar
  un poco para ver la mano de perfil; útil para letras como P o G).
- Tres luces: principal alta a la derecha, relleno suave, contraluz para separar los dedos del fondo.
- Pose `rest`: brazos relajados o manos juntas a la cintura (como en el video de referencia).
- Mano dominante: **derecha** (así se ilustra en la fuente). Dejar prevista la opción de "modo
  espejo/zurdo" (fase posterior).
