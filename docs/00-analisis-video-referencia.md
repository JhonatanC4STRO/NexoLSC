# 00 · Análisis del video de referencia

> Video: `Hand Talk Plugin — Mozilla Firefox 2026-09-28 18-21-49.mp4` (1920×1160, 30 fps, ~18,5 s).
> Página grabada: `handtalk.me/en/plugin` (Hand Talk Plugin, ASL).
> Método: se extrajeron fotogramas cada 3 s y recortes del widget del avatar. Esto permite analizar
> estados de la interfaz y poses clave, pero **no** el movimiento continuo entre fotogramas.
> Los tiempos son aproximados.

El objetivo es entender **patrones de interacción y de experiencia de usuario**, no copiar el producto.
No se reutilizan nombres, personajes, ilustraciones ni la identidad visual de Hand Talk.

---

## 1. Qué se ve en el video

| Momento aprox. | Qué pasa | Observación de UX |
|---|---|---|
| 0–8 s | El widget está abierto sobre la página. El avatar ("Hugo") está en reposo con las manos juntas a la altura de la cintura. Hay un globo de bienvenida con texto y botones ↻ (repetir) y ✕. | El reposo es una **pose neutra y estable**: se lee como "no estoy señando". El globo explica para qué sirve la herramienta. |
| 8–9 s | El avatar levanta la mano (saludo) y empieza a señar. Los controles inferiores cambian de ☀ / ▨ / `1.0x` a **■ Detener** y **⏸ Pausar**. | Los controles son **contextuales**: durante la reproducción solo aparece lo que sirve en ese momento. |
| 9–12 s | Señas con una y dos manos, movimientos de cabeza y expresión facial (cejas, boca). La cámara no se mueve. | Plano medio fijo (cintura hacia arriba). Las manos siempre quedan dentro del cuadro. |
| 12–15 s | El usuario pasa el cursor por el texto de la página: los párrafos se subrayan y aparece un **icono de manos** junto al cursor para indicar que ese bloque se puede traducir. | Modelo de interacción "apunta y traduce". Útil para una futura extensión/widget (no es parte del MVP). |
| 15–18 s | Termina la seña y el avatar vuelve a la pose de reposo. Reaparecen ☀ / ▨ / `1.0x`. | Cada secuencia empieza y termina en reposo. Esto da un "punto de partida" claro para quien mira. |

### Elementos del widget

```text
┌──────────────────────────────┐
│ ◌            [🇺🇸 ASL]    [✕] │  ← idioma de señas visible + cerrar
│                              │
│           AVATAR             │  ← fondo gris neutro, plano medio
│         (plano medio)        │
│                              │
│              [☀] [▨] [1.0x]  │  ← contraste, fondo, velocidad (en reposo)
│                   [■] [⏸]    │  ← detener, pausar (reproduciendo)
└──────────────────────────────┘
```

## 2. Patrones que vale la pena adoptar

1. **Plano medio fijo** con las manos siempre dentro del cuadro. El espacio de señado (de la cintura a
   la cabeza) es lo único importante.
2. **Fondo liso y neutro** que contrasta con la piel y la ropa del avatar. Así la silueta de los
   dedos se lee bien.
3. **Pose de reposo explícita** al inicio, al final y en las pausas largas.
4. **Controles mínimos y contextuales**: reproducir/pausar/detener y la velocidad siempre a mano.
5. **Velocidad visible** (`1.0x`) como control de primer nivel, no escondida en un menú.
6. **Etiqueta de la lengua de señas** (ASL en el video; para nosotros **LSC**).
7. **Avatar estilizado con manos grandes y expresivas**: se prioriza que la mano se entienda por encima
   del realismo.
8. **Cara expresiva**: aunque el MVP no la usa, el avatar definitivo debe tener cara visible y
   deformable (las expresiones no manuales son gramática en LSC).

## 3. Qué no aplica al MVP (o lo hacemos distinto)

| Hand Talk | NexoLSC MVP | Motivo |
|---|---|---|
| Traduce frases completas con gramática de ASL | Solo **deletrea** letra por letra | Alcance del MVP |
| Widget flotante dentro de sitios de terceros | Página propia con campo de texto y micrófono | Más simple de construir y validar |
| Selección de texto de la página ("apunta y traduce") | Texto escrito o dictado | Se deja para una fase posterior (extensión/SDK) |
| No se ve progreso por letra | **Línea de tiempo `H → O → L → A`** con la letra actual y `2 / 4` | El objetivo es **aprender** configuraciones, no solo recibir la traducción |
| Solo pausa/detener mientras reproduce | Además: saltar a una letra, anterior/siguiente, repetir en bucle | Uso educativo |

## 4. Decisiones que salen de este análisis

- Cámara de plano medio, fija, con órbita limitada (el usuario puede girar un poco para ver la mano de lado).
- Fondo `#e9ecef` (gris claro) en modo claro; el avatar debe tener ropa lisa de tono medio y piel con contraste.
- Clip `rest` obligatorio en el GLB: es la pose de inicio, de fin y de fallback.
- Controles: Reiniciar, Anterior, Reproducir/Pausar/Continuar, Siguiente, Detener, Repetir + selector de velocidad.
- Mostrar siempre **qué** se está deletreando (texto normalizado) y **dónde** va la reproducción.

## 5. Hallazgo importante al probar tu avatar actual

Cuando conecté tu avatar (Miles Morales) al prototipo, el traje negro con guantes negros sobre fondo
claro hace que **los dedos se distingan poco**. Con el traje, la máscara y la licencia del modelo, esto
confirma que ese avatar sirve para prototipar el pipeline técnico, pero **no para el producto**. Ver
[04-diseno-avatar.md](04-diseno-avatar.md).
