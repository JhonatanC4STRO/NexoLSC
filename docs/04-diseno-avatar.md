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
original o con licencia libre**. El código no cambia: basta con reemplazar `public/models/avatar.glb`,
siempre que el nuevo avatar tenga los clips con los mismos nombres.

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
`assets-src/avatar/LICENSE.md`.

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
