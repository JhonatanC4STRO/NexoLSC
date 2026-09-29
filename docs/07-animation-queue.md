# 07 · Sistema AnimationQueue (motor de reproducción)

El motor tiene dos piezas:

- **La cola** (`buildQueue` → `QueueItem[]`): qué se va a señar y cuánto dura cada elemento.
- **El reproductor** (`SignPlayer`): recorre la cola con un reloj propio y expone el estado.

Ambas viven en `src/core/player/`, son TypeScript puro y tienen pruebas.

## 1. La cola

```ts
type QueueItem =
  | { kind: 'sign';  label: 'H'; sign: SignEntry; transitionMs: 250; durationMs: 600; isRepeat: false; wordIndex: 0 }
  | { kind: 'pause'; label: '·'; reason: 'word' | 'comma' | 'sentence'; transitionMs: 0; durationMs: 450 };
```

Ejemplo para `"Hola, Ana"`:

```text
AnimationQueue
[ H, O, L, A, (pausa coma 550 ms), A, N, A ]
```

| Elemento | Duración a 1x |
|---|---|
| Letra estática | 250 ms transición + 600 ms sostener = 850 ms |
| Letra dinámica | 250 ms + 950 ms = 1.200 ms |
| Pausa entre palabras | 450 ms |
| Pausa por coma, punto y coma, dos puntos | 550 ms |
| Pausa de oración (. ! ? …) | 850 ms |

## 2. Estados del reproductor

```text
            load()                play()
  ┌──────► idle ──────────────────────────► playing ◄──────┐
  │          ▲                               │  │  ▲        │
  │   stop() │                       pause() │  │  │ play() │ restart()
  │          │                               ▼  │  │        │
  │          └─────────────────────────── paused ──┘        │
  │                        seek()/next()/prev() (desde idle │
  │                        o ended quedan en paused)        │
  │                                                         │
  └── load() ◄── ended ◄── (última letra termina y loop=false)
                   │
                   └── play() / restart() → vuelve a empezar desde 0
```

## 3. API → requisitos que pediste

| Requisito | Método | Comportamiento |
|---|---|---|
| Reproducir | `play()` | Desde `idle`/`paused`; si terminó, vuelve a empezar |
| Pausar | `pause()` | Congela el reloj; el avatar se queda en la pose actual |
| Continuar | `play()` (o `togglePlay()`) | Sigue exactamente donde estaba |
| Detener | `stop()` | Vuelve al inicio y a la pose `rest` |
| Reiniciar | `restart()` | Vuelve al inicio y reproduce |
| Cambiar velocidad | `setSpeed(0.5 \| 0.75 \| 1 \| 1.25 \| 1.5 \| 2)` | Efecto inmediato, incluso a mitad de una letra |
| Saltar a una letra | `seek(i)`, `next()`, `prev()` | Va al elemento `i`. Si estaba reproduciendo, sigue con transición suave; si está en pausa, muestra la seña elegida de inmediato |
| Repetir la palabra | `setLoop(true)` | Al terminar vuelve al inicio sin pasar por `ended` |

## 4. El reloj: por qué el reproductor controla el tiempo

La forma "obvia" sería `play H → esperar evento 'finished' → play O…`. Funciona para reproducir, pero
complica pausar, saltar y cambiar de velocidad (hay que cancelar promesas, escuchar eventos, recalcular
tiempos). En su lugar:

```ts
update(dtMs) {
  if (status !== 'playing') return;
  elapsedMs += dtMs * speed;                    // la velocidad es un multiplicador
  while (elapsedMs >= total(items[index])) {    // puede cruzar varias letras si dt es grande
    elapsedMs -= total(items[index]);
    if (index < items.length - 1) index++;
    else if (loop) index = 0;
    else { status = 'ended'; break; }
  }
}
```

- Un único bucle `requestAnimationFrame` (`usePlayerClock`) llama a `player.update(dt)`. `dt` se limita
  a 100 ms para que al volver de otra pestaña no se salten letras.
- **Pausa** = no avanzar el reloj. **Velocidad** = multiplicar `dt`. **Saltar** = cambiar `index` y
  poner `elapsedMs = 0`. Nada más.
- El comportamiento es determinista: las pruebas simulan el tiempo llamando a `update(16)` en un bucle.

## 5. Dos tipos de estado

| | `getSnapshot()` | `getFrame()` |
|---|---|---|
| Para | React (UI) | Avatar 3D |
| Contenido | `status`, `items`, `index`, `speed`, `loop` | `from`, `to`, `transition` (0..1), `progress` (0..1), `isRepeat` |
| Frecuencia | Solo cuando cambia algo discreto | Cada frame (60/s), sin provocar renders de React |
| Uso | `useSyncExternalStore(player.subscribe, player.getSnapshot)` | `useFrame(() => driver.apply(player.getFrame()))` |

`from` es la última seña antes del elemento actual (las pausas se saltan), así la transición siempre
parte de una pose real. En una pausa, `to = from`: el avatar mantiene la última letra.

## 6. Letras repetidas

`buildQueue` marca `isRepeat: true` cuando una letra es igual a la anterior sin pausa en medio (LL, RR,
SS, CC). El `ClipDriver` hace una pequeña "re-articulación" acercándose a `rest` durante la transición,
para que se perciban dos letras.

> ⚠️ Cómo se marca la repetición en LSC (rebote, desplazamiento lateral, pausa) **debe validarse**
> con usuarios sordos. El comportamiento está aislado en `ClipDriver.apply` para cambiarlo fácilmente.

## 7. Eventos y extensiones previstas

- Hoy: `subscribe(listener)` avisa de cualquier cambio discreto.
- Fácil de añadir: `onItemStart(item)`, `onEnd()` para subtítulos, analítica o para encadenar frases.
- Fase 2: los `QueueItem` de tipo `sign` pueden ser palabras; el reproductor no cambia.
- Fase 3: añadir **pistas paralelas** (cara, cabeza) que se reproducen sobre el mismo reloj. Ver
  [16-estrategia-palabras-frases.md](16-estrategia-palabras-frases.md).

## 8. Pruebas incluidas

```text
✓ normalizeText › deletrea HOLA
✓ normalizeText › quita tildes y diéresis pero conserva Ñ
✓ normalizeText › maneja signos de interrogación y espacios
✓ normalizeText › colapsa pausas y conserva la más fuerte
✓ normalizeText › reporta números y símbolos
✓ normalizeText › limita la longitud
✓ buildQueue › crea una seña por letra y marca repeticiones
✓ buildQueue › el alfabeto tiene 27 letras con clip
✓ SignPlayer › reproduce en orden y termina
✓ SignPlayer › pausa congela el tiempo
✓ SignPlayer › la velocidad acorta la duración
✓ SignPlayer › seek, stop, restart y loop
✓ SignPlayer › el frame de una pausa mantiene la última seña
✓ SignPlayer › saltar a una letra en pausa muestra esa letra (sin quedarse en la transición)
✓ SignPlayer › saltar mientras reproduce conserva la transición suave
Tests  15 passed (15)
```
