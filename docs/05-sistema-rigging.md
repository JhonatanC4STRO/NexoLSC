# 05 · Sistema de rigging

## Idea central: dos esqueletos con dos funciones

```text
          AUTORÍA (en Blender)                         EJECUCIÓN (en el navegador)
┌──────────────────────────────────┐          ┌──────────────────────────────────┐
│ Rig de control Rigify            │  export  │ Esqueleto de deformación         │
│  • controles FK/IK de brazo      │ ───────► │  • solo huesos DEF-* (61 hoy)    │
│  • controles de dedos            │ sampling │  • rotaciones horneadas por clip │
│  • huesos MCH/ORG (mecánica)     │          │  • lo mueve el AnimationMixer    │
└──────────────────────────────────┘          └──────────────────────────────────┘
```

- **En Blender** se anima con los controles cómodos de Rigify (`upper_arm_fk.R`, `f_index.01.R`, …).
- **Al exportar** se usa `export_def_bones=True` + `export_force_sampling=True`: el exportador evalúa
  las restricciones de Rigify y escribe el resultado directamente en los huesos `DEF-*`. El navegador
  nunca ve los 337 huesos de control, solo los 61 que deforman la malla.

Esto está **probado** con tu avatar y Blender 5.2: el GLB resultante tiene 1 skin de 61 articulaciones
y un clip por Action.

## Esqueleto de deformación requerido

| Región | Huesos (nomenclatura Rigify) | Uso en LSC |
|---|---|---|
| Columna | `DEF-spine` … `DEF-spine.003` | Inclinación del torso (fases futuras) |
| Cuello / cabeza | `DEF-spine.004`, `DEF-spine.005`, `DEF-head` | Asentir, negar, inclinar (no manuales) |
| Hombro | `DEF-shoulder.L/R` | Elevar el brazo sin deformar |
| Brazo | `DEF-upper_arm.L/R` + `.001` (torsión) | Posición de la mano en el espacio |
| Antebrazo | `DEF-forearm.L/R` + `.001` (torsión) | **Pronación/supinación** (orientación de la palma) sin "caramelo" |
| Mano | `DEF-hand.L/R` | Orientación de la mano |
| Pulgar | `DEF-thumb.01–03.L/R` | Crítico: A, D, E, L, M, N, O, Y… |
| Dedos | `DEF-f_index/f_middle/f_ring/f_pinky.01–03.L/R` | Configuración de cada letra |
| Palma (recomendado) | `DEF-palm.01–04.L/R` (metacarpianos de Rigify) | Ahuecar la mano (C, O, Q); el avatar de prueba no los tiene, **el candidato MPFB2 sí** |
| Cara (avatar definitivo) | *shape keys* o huesos de mandíbula, ojos y cejas | Expresiones no manuales |

Las piernas pueden existir, pero el MVP no las anima.

## Convenciones

| Convención | Valor | Verificado en tu rig |
|---|---|---|
| Unidades | 1 unidad = 1 m | ❌ mide 6,5 → aplicar escala |
| Frente del personaje | −Y en Blender (el exportador lo convierte a +Z en glTF) | ✅ |
| Mano dominante | derecha (`.R`) | — |
| Flexión de falanges | rotación **positiva en X local** del hueso de control | ✅ (probado: 70° en X cierra el puño) |
| Modo de rotación | Cuaterniones en controles de mano y dedos | ✅ |
| Interruptor IK/FK del brazo | `IK_FK = 1.0` (FK) para señas | ✅ ya está en FK |

Mantener el mismo *roll* en todos los dedos garantiza que "cerrar" sea el mismo eje para todos. Esto
permite posar por script (ver `pose_helpers.py` en [06-animation-clips.md](06-animation-clips.md)).

## Pesos (weight painting)

- Máximo 4 influencias por vértice (límite práctico de glTF/three.js). En Blender:
  *Weights → Limit Total (4)* y luego *Normalize All*.
- Revisar en poses extremas: puño cerrado (A, S), pulgar cruzado (E, M, N), dedos cruzados (R),
  mano en "O" (O, D), muñeca girada 90° (P, H).
- El pulgar necesita pesos suaves en la eminencia tenar (base del pulgar en la palma); es la zona que
  peor se deforma en mallas ligeras.

## Limpieza del avatar actual (automatizada)

`tools/blender/export_avatar.py` hace esto en memoria, sin guardar el `.blend`:

1. Quita el modificador Armature que apunta al `metarig` (queda solo `rig`).
2. Elimina grupos de vértices que no corresponden a huesos de deformación.
3. Elimina de la sesión las Actions que no sean `rest`, `idle` o `sign_*` (p. ej. `Saludo`, `T-Pose`,
   `rigAction`) para que no se exporten.
4. Exporta solo huesos `DEF-*` con muestreo.

Pasos **manuales** recomendados antes de producir las 27 letras (una sola vez):

1. Escalar a ~1,7 m: seleccionar `rig` y mallas, escalar, *Apply → All Transforms* y regenerar el rig
   con Rigify (*Generate Rig*) desde el `metarig` escalado. Aplicar escala a un rig ya generado puede
   romper las restricciones de estiramiento.
2. Añadir metacarpianos (`palm.01–04`) al `metarig` y regenerar, si el avatar lo permite.
3. *Limit Total* de pesos a 4 y revisar dedos.

## Preparado para el futuro

| Necesidad futura | Cómo lo soporta este rig |
|---|---|
| Expresiones faciales | *Shape keys* → se exportan como *morph targets* glTF → pistas de morph en los clips |
| Movimiento de cabeza | Huesos `DEF-spine.005` / `DEF-head` ya existen |
| Señas con dos manos | Huesos `.L` ya existen; el clip simplemente los anima |
| Ubicaciones precisas (tocar la barbilla, el pecho) | Añadir IK en tiempo real en three.js sobre la cadena del brazo (fase 2) usando puntos de referencia del cuerpo |
| Varios avatares | Mismos nombres de huesos → los clips se reutilizan entre avatares |
