# 13 · Diseño de la interfaz

## Pantalla principal (escritorio)

```text
┌────────────────────────────────────────────────────────────────────┐
│ (●● nexo[LSC])          Deletrea en Lengua de Señas Colombiana     │
├────────────────────────────────────────────────────────────────────┤
│ Escribe una palabra o frase                                        │
│ ┌──────────────────────────────────────────────┐ ┌──────────────┐  │
│ │ ¿Cómo estás?                                 │ │ ▷ Reproducir │  │
│ └──────────────────────────────────────────────┘ └──────────────┘  │
│ (🎙 Hablar)                                                        │
│ Se deletreará: COMO ESTAS                                          │
├────────────────────────────────────────────────────────────────────┤
│ Avatar [MPFB2 · caricatura ▾]   Licencia: CC0                      │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│                        AVATAR 3D                                   │
│      (plano medio, foto de la sede del SENA desenfocada detrás)    │
│                                                                    │
├────────────────────────────────────────────────────────────────────┤
│ Letra actual: M                                            3 / 9   │
│ [C] [O] [M] [O]   [E] [S] [T] [A] [S]                              │
│          ▲ actual (resaltada y un poco más grande)                 │
├────────────────────────────────────────────────────────────────────┤
│              (‹)   ( ⏸ Pausar )   (›)                              │
│        (↻ Reiniciar)  (□ Detener)  (⇄ Repetir)                     │
│  Velocidad  (0.5x) (0.75x) [1x] (1.25x) (1.5x) (2x)                │
├────────────────────────────────────────────────────────────────────┤
│        [Borrador · 0 de 27 letras validadas por personas sordas]   │
│ Configuraciones basadas en el DBLSC (INSOR – ICC, 2006).           │
└────────────────────────────────────────────────────────────────────┘
```

Los controles van en dos grupos: el transporte (anterior · reproducir/pausar · siguiente) en la primera
fila, que nunca se parte, y las acciones secundarias debajo. En móvil es la misma columna y el avatar
ocupa ~60 % del alto. Los íconos (`src/ui/icons.tsx`) son los de la marca y siempre van con texto o
`aria-label`.

## Componentes

| Componente | Responsabilidad |
|---|---|
| `App` | Estado del texto, `spell()`, atajos de teclado, insignia de validación del pie |
| `Logo` | Símbolo de la marca (SVG en línea, colores desde los tokens) + logotipo «nexo» y píldora «LSC» |
| `SpeechButton` | Micrófono, texto provisional, errores, aviso de "no disponible" |
| `AvatarSelector` | Elegir candidato de avatar; muestra su licencia (en rojo si no se puede publicar) y recuerda la elección |
| `Avatar3D` | Canvas transparente, cámara, luces; muestra `AvatarPlaceholder` si no hay GLB |
| `StageBackground` (en `Avatar3D`) | Foto de fondo desenfocada con velo claro (`src/avatar/stage.ts`) |
| `LetterTimeline` | Letra actual, `n / total`, chips clicables (saltar), huecos entre palabras |
| `PlayerControls` | Reiniciar, anterior, reproducir/pausar/continuar, siguiente, detener, repetir, velocidad |

## Estados de la interfaz

| Estado | Botón principal | Avatar | Línea de tiempo |
|---|---|---|---|
| Vacío | "Reproducir" deshabilitado | `rest` | oculta |
| Reproduciendo | "Pausar" | letra actual | letra actual en mango (borde `mango-ink`, un poco más grande); las ya señadas en bruma |
| Pausado | "Continuar" | congelado en la pose | igual |
| Terminado | "Reproducir" (vuelve a empezar) | última letra | todas en bruma |
| Letra sin animación | — | `rest` | chip con borde discontinuo |
| Sin ningún GLB | — | vista de respaldo: letra grande + descripción de la configuración | igual |
| Avatar sin GLB | — | aparece "(no disponible)" en el selector y se usa otro | — |
| Sin foto de fondo | — | escenario liso (`escenario`) | — |
| Navegador sin voz | botón "Hablar" reemplazado por aviso | — | — |

## Accesibilidad (objetivo WCAG 2.2 AA)

- **Teclado**: `Espacio` reproducir/pausar, `←`/`→` letra anterior/siguiente, `R` reiniciar (fuera de
  campos de texto). Todos los controles son botones nativos con foco visible (anillo selva de 3 px, separado 2 px).
- **Lectores de pantalla**: la línea "Letra actual" está en una región `aria-live="polite"`; la
  velocidad es un `radiogroup`; el chip actual tiene `aria-current="step"`; el botón "Repetir" usa
  `aria-pressed`.
- **Contraste**: texto ≥ 4,5:1 (los pares de color de la marca están medidos); bordes de controles
  ≥ 3:1; modo oscuro automático con `prefers-color-scheme`.
- **Objetivos táctiles**: botones, chips y selector de al menos 44 px de alto.
- **Tipografía legible**: Atkinson Hyperlegible para el texto (diseñada para baja visión: distingue
  `I`/`l`/`1` y `O`/`0`).
- **Movimiento reducido**: con `prefers-reduced-motion` se quita la animación de escala de los chips (la
  animación del avatar se mantiene porque es el contenido).
- **Idioma**: `<html lang="es">`.
- **Honestidad**: se muestra qué se omitió y qué no está validado (insignia de estado en el pie, calculada
  desde `validation.status` de cada letra). El color nunca va solo: el estado siempre lleva su palabra.

## Funciones pensadas para aprender

| Función | Estado |
|---|---|
| Velocidades 0.5x–2x | ✅ en el código inicial |
| Repetir en bucle | ✅ |
| Saltar a una letra y pausar en ella | ✅ (clic en el chip; en pausa el avatar muestra esa letra y se queda quieto) |
| Girar la cámara para ver la mano de perfil | ✅ (órbita limitada) |
| Botones de vista rápida: frente / perfil / primer plano de la mano | Siguiente iteración |
| Modo espejo (ver la seña como si fuera tu reflejo) | Siguiente iteración |
| Tarjeta de la letra con la descripción de la configuración y la fuente | Siguiente iteración (los datos ya existen) |
| Modo práctica: el avatar seña una letra al azar y el usuario adivina | Idea para después del MVP |

## Lenguaje visual (marca NexoLSC)

La interfaz usa la marca visual del proyecto. Sistema de diseño completo (símbolo, colores, tipografía,
íconos, personaje y componentes): <https://claude.ai/artifact/EVFLVxqZYXv6AC4Kj38ork>. Los tokens viven
como variables CSS en `src/styles.css`.

| Token | Claro | Oscuro | Uso |
|---|---|---|---|
| `surface` | `#f5f9f6` | `#0c1a1c` | Fondo de página |
| `surface-raised` | `#ffffff` | `#142629` | Tarjeta de entrada, campos, botones secundarios |
| `ink` / `ink-muted` | `#0f2a2e` / `#4a6266` | `#e8f3ee` / `#a6bbb6` | Texto principal / secundario |
| `selva` | `#0b6b4f` | `#52c99c` | Acción primaria, velocidad activa, anillo de foco |
| `mango` | `#ffb627` | `#ffc34d` | La letra que se está señando, píldora «LSC» |
| `bruma` | `#e2f0e8` | `#123a2d` | Letras ya señadas, estado aprobado |
| `arena` | `#fff3d6` | `#3a2c08` | Estado borrador |
| `achiote` | `#a8360b` | `#ff9a6b` | Errores, grabando, letras rechazadas |
| `line-strong` | `#71898a` | `#6b8784` | Bordes de campos y botones secundarios (≥ 3:1) |
| `escenario` | `#e9ecef` | igual | Escenario sin foto: claro en ambos temas por contraste con la piel |

- **Tipografía**: *Baloo 2* (redondeada) para el logotipo, la letra actual y los chips; *Atkinson
  Hyperlegible* para todo el texto. Se cargan de Google Fonts (`index.html`).
- **Forma**: botones en píldora (`radius-pill`), campos `radius-md` (16 px), tarjetas y escenario
  `radius-lg` (24 px), chips de letra `radius-sm` (10 px). Una sola sombra (`shadow-card`).
- **Favicon y color del navegador**: `public/favicon.svg` (ícono de la app) y `theme-color` selva.
  Las variantes del símbolo están en `public/brand/`.

## Fondo del escenario

Detrás del avatar puede ir una foto del lugar (proyecto SENA: la sede, `public/backgrounds/sena.jpg`).
Se configura en `src/avatar/stage.ts`:

| Parámetro | Valor | Motivo |
|---|---|---|
| `blurPx` | 5 | El fondo da contexto, pero con detalle nítido compite con las manos |
| `veil` | 0.35 | Velo claro (`#eef4f0`, un gris con el tinte verde de la marca) que baja el contraste de la foto y mantiene la mano como lo más visible |
| `position` | `center 35%` | Qué parte de la foto queda detrás del avatar |

Si el archivo no existe, el escenario usa el color `escenario` liso. Regla: si en pruebas con usuarios cuesta leer los
dedos, subir `blurPx`/`veil` antes que cambiar la ropa o la luz del avatar.

## Ideas para después

- **Modo widget** flotante para incrustar el deletreador en otros sitios (por ejemplo, páginas del SENA),
  reutilizando el mismo núcleo.
- Vistas rápidas de cámara (frente / perfil / primer plano de la mano) y modo espejo para aprender.
