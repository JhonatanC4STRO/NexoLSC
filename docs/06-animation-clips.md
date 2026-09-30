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

- **MVP: opción B.** Un único GLB por avatar (`public/models/avatars/<id>.glb`) con los clips `rest` + 27 letras. Las poses de
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

## 4. Las letras como datos (independientes del avatar) — implementado

Las 27 letras **no** se animan a mano en cada avatar. Se describen una vez en
`assets-src/letters/alfabeto_lsc.json` y `tools/blender/bake_letters.py` las aplica al rig de cualquier
avatar Rigify, creando `rest` + `sign_A` … `sign_Z` + `sign_ENYE`.

```json
"L": {
  "status": "draft",
  "note": "Índice arriba y pulgar horizontal formando una L; demás cerrados.",
  "fingers": { "index": [0, 0, 0, 0], "middle": [85, 100, 60, 0], "ring": [85, 100, 60, 0], "pinky": [85, 100, 60, 0] },
  "thumb": [-30, -20, 0, 0, 0]
},
"J": {
  "fingers": { "...": "configuración de la I" },
  "motion": [ { "t": 0, "lift": 4 }, { "t": 0.5, "lift": -5 }, { "t": 1, "lift": -5, "swing": -6, "twist": 45 } ]
}
```

| Campo | Significado (ejes locales del rig Rigify, mano derecha) |
|---|---|
| `fingers.<dedo>` | `[mcp, pip, dip, spread]` en grados: flexión de cada falange (X local, + cierra) y separación (Z local, + hacia el pulgar) |
| `thumb` | `[cmc_x, cmc_z, cmc_y, mcp, ip]`: base del pulgar hacia el índice (+X), hacia la palma (+Z) o afuera (−Z), giro, y flexión de las dos falanges |
| `arm.twist` | Giro del antebrazo, es decir, hacia dónde mira la palma. `defaults.arm.twist = −60` deja la palma al frente |
| `arm.hand_dir` / `arm.forearm_dir` | Dirección (mundo) de los dedos / del antebrazo. Ej.: P apunta hacia abajo |
| `arm.swing` / `arm.lift` / `arm.tilt` | Desplazan la mano (derecha del espectador / arriba) o inclinan el antebrazo |
| `motion` | Fotogramas clave `t` (0..1) con ajustes que se suman: trayectorias de G, H, J, Ñ, S, Z |

**Probado:** las mismas definiciones producen las 27 letras en el avatar caricaturesco y en el
realista, sin cambiar ningún dato (ver [04-diseno-avatar.md](04-diseno-avatar.md#31-candidatos-creados)).
Lo que puede requerir ajuste por avatar son los **contactos** (pulgar tocando dedos en O, D, F, T)
cuando las proporciones de la mano cambian mucho.

Flujo para corregir una letra:
1. Editar su entrada en el JSON (por ejemplo, el pulgar de la L).
2. `bake_letters.py` en cada avatar y exportar el GLB.
3. Revisar de frente y de perfil. Cambiar `status` a `approved` solo tras la validación con personas sordas.

```bash
blender -b assets-src/avatars/mpfb2/avatar.blend --python tools/blender/bake_letters.py
```

```bash
blender -b assets-src/avatars/mpfb2/avatar.blend --python tools/blender/export_avatar.py -- public/models/avatars/mpfb2.glb
```

Alternativa manual (para retoques finos): posar en Blender con la ilustración del DBLSC como imagen de
referencia, guardar la pose en la *Pose Library* y trasladar los ángulos resultantes al JSON para que la
corrección valga en todos los avatares.

Salida esperada (probada con el avatar de prueba, que además trae restos que el script limpia):

```text
[limpieza] mesh7.dat.desirefx.me_.obj: quitando modificador Armature -> metarig
[limpieza] excluyendo acción rigAction
[limpieza] excluyendo acción T-Pose
[ok] public/models/avatars/miles-prueba.glb
[clips] ['rest', 'sign_A', 'sign_L']
```

El script completo está en [15-codigo-inicial.md](15-codigo-inicial.md).

## 5. Posar por script (opcional pero útil)

Para una primera aproximación rápida de las 27 poses, o para aplicar correcciones en lote,
`tools/blender/pose_helpers.py` (probado en los dos rigs) ofrece:

| Función | Qué hace |
|---|---|
| `reset()` | Vuelve a la pose de descanso **y desasigna la Action activa** |
| `rot_world(hueso, eje, grados)` | Rota un hueso alrededor de un eje del espacio de la armadura |
| `aim(hueso, dirección)` | Apunta el hueso (su eje Y) hacia una dirección |
| `curl(dedo, grados)` | Flexiona las 3 falanges de un dedo (X local positivo = cerrar) |
| `arm_signing_space()` | Mano derecha a la altura del hombro, palma al frente |
| `key_action(nombre)` | Crea una Action con *Fake User* y guarda la pose actual |

```python
import pose_helpers as P   # con tools/blender en sys.path

# Ejemplo: tres dedos cerrados (prueba de pipeline, NO es una letra validada)
P.reset()
P.arm_signing_space()
for f in ['f_middle', 'f_ring', 'f_pinky']:
    P.curl(f, 70)
P.key_action('sign_L')
```

Dos trampas que ya están resueltas en el archivo:
- En el Rigify actual los **dedos usan Euler** y los brazos cuaterniones: escribir solo
  `rotation_quaternion` en un dedo no tiene ningún efecto.
- Si queda una Action asignada al rig, Blender vuelve a aplicar sus fotogramas al actualizar la escena y
  las poses **se suman**; por eso `reset()` la desasigna.

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
node -e "const b=require('fs').readFileSync('public/models/avatars/mpfb2.glb');const l=b.readUInt32LE(12);const j=JSON.parse(b.slice(20,20+l));console.log('joints',j.skins.map(s=>s.joints.length),'clips',j.animations.map(a=>a.name))"
```

Además, la app marca con borde discontinuo en la línea de tiempo las letras cuyo clip todavía no está
en el GLB.
