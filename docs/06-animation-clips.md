# 06 · Sistema de Animation Clips

## 1. ¿Un GLB por letra o un GLB con muchos clips?

| Criterio | A) `A.glb … Z.glb` (cada uno con malla) | B) `avatar.glb` con clips `sign_*` | C) `avatar.glb` + paquetes de animación sin malla |
|---|---|---|---|
| Descargas | 27 archivos; la malla se repite 27 veces (~1,5 MB × 27) | 1 archivo | 1 avatar + N paquetes pequeños |
| Memoria | 27 esqueletos/mallas o recargas | 1 esqueleto | 1 esqueleto |
| Transiciones entre letras | Hay que cambiar de modelo o re-dirigir clips | Nativas: mismo `AnimationMixer` | Nativas si los nombres de huesos coinciden |
| Añadir una letra | Exportar un archivo | Re-exportar el avatar | Exportar un paquete |
| Escala a miles de señas (fase 2) | ❌ | ⚠️ el archivo crece sin límite | ✅ carga bajo demanda |
| Complejidad | Media | **Baja** | Media |

### Recomendación

- **MVP: opción B.** Un único `public/models/avatar.glb` con los clips `rest` + 27 letras. Las poses de
  letras estáticas son clips de 1 fotograma; las 27 juntas añaden muy poco peso.
- **Fase 2: opción C.** El modelo de datos ya incluye `animation.pack` (hoy siempre `"avatar"`). Cuando
  haya cientos de palabras, se exportan paquetes **solo con esqueleto + animaciones** (sin malla), se
  cargan con `GLTFLoader` y sus clips se añaden al mismo `AnimationMixer`. Funciona porque three.js
  vincula las pistas por **nombre de hueso**.
- La opción A se descarta.

## 2. Convención de nombres

| Clip | Contenido |
|---|---|
| `rest` | Pose neutra (inicio, fin, fallback). **Obligatorio** |
| `idle` | (Opcional) respiración/parpadeo en bucle para cuando no se seña |
| `sign_A` … `sign_Z` | Una por letra |
| `sign_ENYE` | Ñ (nombres solo ASCII para evitar problemas de codificación) |
| `num_0` … `num_9` | Fase 1.1 |
| `word_CASA`, `word_GRACIAS` | Fase 2 (la glosa en mayúsculas) |

El nombre del clip lo decide el dato (`SignEntry.animation.clip`), no el código.

## 3. Tipos de clip

```text
Letra estática (A, B, C, D, E, F, I, K, L, M, N, O, P, Q, R, T, U, V, W, X, Y)
  clip de 1 fotograma = la pose
  el motor genera:  [transición 250 ms desde la pose anterior] → [sostener 600 ms]

Letra dinámica (G, H, J, Ñ, S, Z — tienen flechas en la ilustración de la fuente)
  clip de ~24–30 fotogramas: pose inicial → trayectoria → pose final
  el motor genera:  [transición 250 ms hacia el fotograma 0] → [reproducir el clip ~950 ms]
```

Las **transiciones no se animan a mano**: el `ClipDriver` mezcla (blending) la pose anterior con la
siguiente con una curva suave. Así no hay que producir 27 × 27 transiciones.

Duraciones iniciales (a velocidad 1x): transición 250 ms, sostener 600 ms, dinámicas 950 ms.
Son valores de partida para ajustar con usuarios sordos; están en los datos, no en el código.

## 4. Flujo de trabajo en Blender por letra

1. **Referencia**: abre la ilustración de la letra (DBLSC p. 573) como imagen de referencia
   (*Add → Image → Reference*) junto a la mano. No la incluyas en el repo.
2. **Pose**: con el `rig` en *Pose Mode*, desde la pose `rest`:
   - brazo en FK: `upper_arm_fk.R`, `forearm_fk.R`, `hand_fk.R` → mano a la altura del hombro, palma
     hacia el frente (salvo que la letra indique otra orientación);
   - dedos: `f_index.01–03.R`, …, `thumb.01–03.R`.
3. **Guardar la pose en la biblioteca** (*Asset Browser → Pose Library*) con el nombre `A`, `B`… Esto
   permite reutilizar y corregir poses rápidamente.
4. **Crear la Action** `sign_A` (1 fotograma para estáticas; 24–30 fotogramas para dinámicas), con
   *Fake User* activado.
5. **Control visual**: render de frente y de perfil (ver `pose_test.py` en el código de prueba) para la
   revisión con personas sordas.
6. **Exportar** con el script (no a mano):

```bash
blender -b assets-src/avatar/avatar.blend --python tools/blender/export_avatar.py -- public/models/avatar.glb
```

Salida esperada (probada con tu avatar):

```text
[limpieza] mesh7.dat.desirefx.me_.obj: quitando modificador Armature -> metarig
[limpieza] excluyendo acción rigAction
[limpieza] excluyendo acción T-Pose
[ok] public/models/avatar.glb
[clips] ['rest', 'sign_A', 'sign_L']
```

El script completo está en [15-codigo-inicial.md](15-codigo-inicial.md).

## 5. Posar por script (opcional pero útil)

Para una primera aproximación rápida de las 27 poses, o para aplicar correcciones en lote, estas funciones
(probadas en tu rig) rotan huesos respetando la pose actual:

```python
# tools/blender/pose_helpers.py
import bpy, math
from mathutils import Vector, Quaternion

rig = bpy.data.objects['rig']
pb = rig.pose.bones

def upd():
    bpy.context.view_layer.update()

def rot_world(name, axis, deg):
    """Rota el hueso alrededor de un eje en espacio de armadura."""
    b = pb[name]
    upd()
    axis_local = (b.matrix.to_3x3().inverted() @ Vector(axis)).normalized()
    q = Quaternion(axis_local, math.radians(deg))
    b.rotation_quaternion = b.rotation_quaternion @ q
    upd()

def aim(name, direction):
    """Apunta el eje Y del hueso (su largo) hacia una dirección en espacio de armadura."""
    b = pb[name]
    upd()
    cur = b.matrix.to_3x3() @ Vector((0, 1, 0))
    d = Vector(direction).normalized()
    axis = cur.cross(d)
    if axis.length > 1e-6:
        rot_world(name, axis.normalized(), math.degrees(cur.angle(d)))

def curl(finger, deg, side='R'):
    """Flexiona las 3 falanges de un dedo (X local positivo = cerrar)."""
    for i, k in enumerate(['01', '02', '03']):
        b = pb[f'{finger}.{k}.{side}']
        b.rotation_quaternion = b.rotation_quaternion @ Quaternion((1, 0, 0), math.radians(deg * (0.8 if i == 0 else 1.0)))
    upd()

# Ejemplo: mano en espacio de señado + tres dedos cerrados (prueba de pipeline, NO es una letra validada)
aim('upper_arm_fk.R', (-0.35, -0.25, -0.9))
aim('forearm_fk.R', (0.1, -0.35, 0.93))
aim('hand_fk.R', (0.0, -0.1, 1))
for f in ['f_middle', 'f_ring', 'f_pinky']:
    curl(f, 70)
```

> El script sirve para acelerar el trabajo, **no** reemplaza la revisión visual contra la fuente ni la
> validación con usuarios de LSC.

## 6. Cómo se reproducen los clips en three.js

- Todos los clips se registran una vez en un `AnimationMixer`, en pausa y con peso 0.
- En cada frame, `ClipDriver.apply(frame)`:
  - asigna peso `1 − t` al clip de la letra anterior (fijado en su último fotograma);
  - asigna peso `t` al clip de la letra actual (en el tiempo que indica el progreso);
  - si es la **misma letra repetida** (LL, RR, SS), pasa brevemente cerca de `rest` para que se vea
    que hay dos letras (a validar con la comunidad);
  - llama a `mixer.update(0)`: aplica la mezcla sin avanzar tiempo (el tiempo lo lleva el `SignPlayer`).
- La suma de pesos siempre es 1, así three.js no mezcla con la pose de enlace (*bind pose*).

## 7. Verificación de un GLB exportado

```bash
node -e "const b=require('fs').readFileSync('public/models/avatar.glb');const l=b.readUInt32LE(12);const j=JSON.parse(b.slice(20,20+l));console.log('joints',j.skins.map(s=>s.joints.length),'clips',j.animations.map(a=>a.name))"
```

Además, la app marca con borde discontinuo en la línea de tiempo las letras cuyo clip todavía no está
en el GLB.
