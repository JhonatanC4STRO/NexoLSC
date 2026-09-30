# 05 · Sistema de rigging

## Idea central: dos esqueletos con dos funciones

```text
          AUTORÍA (en Blender)                         EJECUCIÓN (en el navegador)
┌──────────────────────────────────┐          ┌──────────────────────────────────┐
│ Rig de control Rigify            │  export  │ Esqueleto de deformación         │
│  • controles FK/IK de brazo      │ ───────► │  • solo huesos DEF-* (181)       │
│  • controles de dedos            │ sampling │  • rotaciones horneadas por clip │
│  • huesos MCH/ORG (mecánica)     │          │  • lo mueve el AnimationMixer    │
│  (930 huesos en total)           │          │                                  │
└──────────────────────────────────┘          └──────────────────────────────────┘
```

- **En Blender** las letras se posan con los controles de Rigify (`upper_arm_fk.R`, `f_index.01.R`, …),
  por script (`tools/blender/bake_letters.py`), a partir de los datos de `assets-src/letters/alfabeto_lsc.json`.
- **Al exportar** (`tools/blender/export_avatar.py`) se usa `export_def_bones=True` +
  `export_force_sampling=True`: el exportador evalúa las restricciones de Rigify y escribe el resultado en
  los huesos `DEF-*`. El navegador nunca ve los 930 huesos de control, solo los 181 que deforman la malla.

Probado con Blender 5.2 en los candidatos MPFB: 1 skin de 181 articulaciones y 28 clips (`rest` + 27 letras).

## Esqueleto de deformación (candidatos MPFB, rig `rigify.human`)

| Región | Huesos (nomenclatura Rigify) | Uso en LSC |
|---|---|---|
| Columna | `DEF-spine` … `DEF-spine.003` | Inclinación del torso (fases futuras) |
| Cuello / cabeza | `DEF-spine.004` … `DEF-spine.006` | Asentir, negar, inclinar (no manuales) |
| Hombro | `DEF-shoulder.L/R` | Elevar el brazo sin deformar |
| Brazo | `DEF-upper_arm.L/R` + `.001` (torsión) | Posición de la mano en el espacio |
| Antebrazo | `DEF-forearm.L/R` + `.001` (torsión) | **Giro de la palma** sin efecto "envoltorio de caramelo" |
| Mano | `DEF-hand.L/R` | Orientación de la mano |
| Pulgar | `DEF-thumb.01–03.L/R` | Crítico: A, D, E, L, M, N, O, Y… |
| Dedos | `DEF-f_index/f_middle/f_ring/f_pinky.01–03.L/R` | Configuración de cada letra |
| Palma | `DEF-palm.01–04.L/R` (metacarpianos) | Ahuecar la mano (C, O, Q) |
| Cara | párpados, cejas, ojos, mandíbula, labios, lengua (`DEF-lid.*`, `DEF-jaw`, `DEF-tongue`…) | Expresiones no manuales (fases futuras) |

Las piernas existen, pero el MVP no las anima.

## Convenciones (verificadas en el rig MPFB)

| Convención | Valor |
|---|---|
| Unidades | 1 unidad = 1 m, pies en el origen |
| Frente del personaje | −Y en Blender (el exportador lo convierte a +Z en glTF) |
| Mano dominante | derecha (`.R`) |
| Interruptor IK/FK del brazo | `IK_FK = 1.0` (FK); `mpfb_builder.py` lo deja así, porque Rigify lo genera en IK |
| Modo de rotación | Brazos: cuaterniones. **Dedos y pulgar: Euler XYZ**. `pose_helpers.py` maneja ambos |
| Flexión de falanges | rotación **positiva en X local** del control (cierra el dedo) |
| Separación de dedos | **Z local**: + hacia el pulgar |
| Pulgar (`thumb.01`) | X local + hacia el índice; Z local + hacia la palma, − hacia afuera |
| Giro de la palma | rotación del `forearm_fk.R` sobre su propio eje; con −60° respecto a la postura base, la palma queda al frente |

Estos ejes son los que usa el formato de las letras (ver [06-animation-clips.md](06-animation-clips.md)).
Un avatar con otro rig Rigify debería comportarse igual; si no, se ajusta en los datos, no en el código.

## Pesos (weight painting)

- Máximo 4 influencias por vértice (límite práctico de glTF/three.js); el exportador conserva las 4 de
  mayor peso.
- Revisar en poses extremas: puño cerrado (A, S), pulgar cruzado (E, M, N), dedos cruzados (R),
  mano en "O" (O, D), muñeca doblada (P, H).
- El pulgar es la zona que peor se deforma en mallas ligeras (base del pulgar en la palma).

## Qué hacen los scripts

| Script | Qué hace con el rig |
|---|---|
| `mpfb_builder.py` | Añade el metarig `rigify.human` de MPFB, genera el rig Rigify (`rig`), deja un solo modificador Armature, hornea el fenotipo y aplica las máscaras, pone los brazos en FK |
| `bake_letters.py` | Posa los controles FK según los datos de cada letra y crea una Action por letra (`rest`, `sign_*`) |
| `export_avatar.py` | Deja una sola armadura deformando, elimina grupos de vértices que no son `DEF-*`, excluye Actions ajenas, exporta solo huesos `DEF-*` con muestreo |

## Preparado para el futuro

| Necesidad futura | Cómo lo soporta este rig |
|---|---|
| Expresiones faciales | Rig facial Rigify ya generado (y *shape keys* si se añaden) |
| Movimiento de cabeza | Huesos de cuello y cabeza ya existen |
| Señas con dos manos | Huesos `.L` ya existen; basta con incluir la mano izquierda en los datos |
| Ubicaciones precisas (tocar la barbilla, el pecho) | IK en Blender al hornear, o IK en tiempo real en three.js (fase 2) |
| Varios avatares | Mismos nombres de huesos y mismos datos de letras: se vuelven a hornear por avatar |
