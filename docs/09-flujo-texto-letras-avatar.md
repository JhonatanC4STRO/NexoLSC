# 09 · Flujo Texto → letras → avatar

## Secuencia

```text
Usuario            App.tsx            normalizeText       buildQueue          SignPlayer          ClipDriver / Avatar
   │ escribe "Casa"   │                     │                  │                   │                      │
   │ ▶ Reproducir ───►│ spell("Casa") ─────►│                  │                   │                      │
   │                  │◄── tokens C,A,S,A ──│                  │                   │                      │
   │                  │──────────── tokens ───────────────────►│                   │                      │
   │                  │◄─────────── QueueItem[4] ──────────────│ (SignRepository)  │                      │
   │                  │──────────────────── load(items); play() ──────────────────►│                      │
   │                  │                                                            │                      │
   │                  │  cada frame: usePlayerClock → player.update(dt)            │                      │
   │                  │              useFrame       → driver.apply(player.getFrame()) ───────────────────►│
   │◄── UI: "Letra actual: A · 2 / 4" (snapshot solo cuando cambia la letra) ──────│                      │
```

## Paso a paso (con el código inicial)

| # | Paso que pediste | Dónde ocurre |
|---|---|---|
| 1 | Leer el texto | `App.tsx` → `spell(text)` al enviar el formulario (botón o Enter) |
| 2 | Convertirlo a mayúsculas | `normalizeText` → `toLetter()` usa `toLocaleLowerCase('es')` y luego `toUpperCase()` |
| 3 | Separarlo carácter por carácter | `Array.from(input)` (respeta caracteres Unicode completos) |
| 4 | Espacios como pausas | Espacios/guiones → token `pause: 'word'`; varias seguidas se colapsan |
| 5 | Buscar la animación de cada letra | `buildQueue` → `SignRepository.findLetter()` → `sign.animation.clip` |
| 6 | Reproducir en orden | `SignPlayer.update(dt)` recorre la cola |
| 7 | Pasar a la siguiente al terminar | Cuando `elapsedMs` supera `transitionMs + durationMs`, `index++` |

## Ejemplos

### `HOLA`

```text
tokens:  H  O  L  A
cola:    [H 850ms] [O 850ms] [L 850ms] [A 850ms]      total ≈ 3,4 s a 1x
avatar:  rest→H, H→O, O→L, L→A, (fin: se mantiene A; Detener vuelve a rest)
UI:      H → O → L → A    Letra actual: L    3 / 4
```

### `CASA`

```text
C → A → S → A
S es dinámica (traza una "S"): 250 ms de transición + 950 ms de clip
```

### `¿Cómo estás?`

```text
entrada:      ¿Cómo estás?
normalizado:  COMO ESTAS
tokens:       C O M O (pausa palabra) E S T A S
UI:           C → O → M → O   E → S → T → A → S
```

Los signos `¿` y `?` no se señan: `¿` se ignora y `?` al final no genera pausa porque no hay nada después.

### `Hola, Ana 5`

```text
normalizado:  HOLA ANA 5
cola:         H O L A (pausa coma 550 ms) A N A
aviso en UI:  "Omitidos (sin seña en el MVP): 5"
```

## Qué ve el usuario

1. Debajo del campo: **"Se deletreará: COMO ESTAS"**. Así sabe de antemano qué se va a señar y ve el
   efecto de quitar tildes y signos.
2. El avatar empieza de inmediato.
3. La línea de tiempo resalta la letra actual; las ya señadas se atenúan; las que no tienen animación
   aparecen con borde discontinuo.
4. Clic en cualquier letra = saltar a ella.

## Probado en el navegador

Con el avatar `mpfb2-caricatura` y las 27 letras:

- `Hola Nexo` → `HOLA NEXO`: todas las letras tienen clip (ninguna aparece como "animación
  pendiente"); al pausar y saltar a la L, el avatar muestra la L con el pulgar horizontal.
- `Allá` → `ALLA`: A → L → L → A, con la "re-articulación" en la L repetida y el contador `2 / 4`.
- `¿Hola, Ana 5?` → `HOLA ANA`, con el aviso "Omitidos: 5", el hueco entre palabras en la línea de
  tiempo y `4 / 7`.
- Fondo del escenario con la foto del SENA desenfocada; la mano se sigue leyendo bien.

Sin errores en consola.
