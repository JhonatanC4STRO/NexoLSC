# 13 · Diseño de la interfaz

## Pantalla principal (escritorio)

```text
┌────────────────────────────────────────────────────────────────────┐
│ NexoLSC                                                            │
│ Deletreador en Lengua de Señas Colombiana                          │
├────────────────────────────────────────────────────────────────────┤
│ Escribe una palabra o frase                                        │
│ ┌──────────────────────────────────────────────┐ ┌──────────────┐  │
│ │ ¿Cómo estás?                                 │ │ ▶ Reproducir │  │
│ └──────────────────────────────────────────────┘ └──────────────┘  │
│ [🎤 Hablar]                                                        │
│ Se deletreará: COMO ESTAS                                          │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│                        AVATAR 3D                                   │
│                   (plano medio, fondo gris)                        │
│                                                                    │
├────────────────────────────────────────────────────────────────────┤
│ Letra actual: M                                            3 / 9   │
│ [C] [O] [M] [O]   [E] [S] [T] [A] [S]                              │
│          ▲ actual (resaltada y un poco más grande)                 │
├────────────────────────────────────────────────────────────────────┤
│  ↶ Reiniciar   ⏮   ⏸ Pausar   ⏭   ⏹ Detener   🔁 Repetir           │
│  Velocidad:  0.5x  0.75x  [1x]  1.25x  1.5x  2x                    │
├────────────────────────────────────────────────────────────────────┤
│ Configuraciones basadas en el DBLSC (INSOR – ICC, 2006).           │
└────────────────────────────────────────────────────────────────────┘
```

En móvil es la misma columna; los controles pasan a dos filas y el avatar ocupa ~60 % del alto.

## Componentes

| Componente | Responsabilidad |
|---|---|
| `App` | Estado del texto, `spell()`, atajos de teclado |
| `SpeechButton` | Micrófono, texto provisional, errores, aviso de "no disponible" |
| `Avatar3D` | Canvas, cámara, luces; muestra `AvatarPlaceholder` si no hay GLB |
| `LetterTimeline` | Letra actual, `n / total`, chips clicables (saltar), huecos entre palabras |
| `PlayerControls` | Reiniciar, anterior, reproducir/pausar/continuar, siguiente, detener, repetir, velocidad |

## Estados de la interfaz

| Estado | Botón principal | Avatar | Línea de tiempo |
|---|---|---|---|
| Vacío | "▶ Reproducir" deshabilitado | `rest` | oculta |
| Reproduciendo | "⏸ Pausar" | letra actual | letra actual en ámbar |
| Pausado | "▶ Continuar" | congelado en la pose | igual |
| Terminado | "▶ Reproducir" (vuelve a empezar) | última letra | todas atenuadas |
| Letra sin animación | — | `rest` | chip con borde discontinuo |
| Sin GLB | — | vista de respaldo: letra grande + descripción de la configuración | igual |
| Navegador sin voz | 🎤 reemplazado por aviso | — | — |

## Accesibilidad (objetivo WCAG 2.2 AA)

- **Teclado**: `Espacio` reproducir/pausar, `←`/`→` letra anterior/siguiente, `R` reiniciar (fuera de
  campos de texto). Todos los controles son botones nativos con foco visible (contorno ámbar de 3 px).
- **Lectores de pantalla**: la línea "Letra actual" está en una región `aria-live="polite"`; la
  velocidad es un `radiogroup`; el chip actual tiene `aria-current="step"`; el botón "Repetir" usa
  `aria-pressed`.
- **Contraste**: texto ≥ 4,5:1; modo oscuro automático con `prefers-color-scheme`.
- **Movimiento reducido**: con `prefers-reduced-motion` se quita la animación de escala de los chips (la
  animación del avatar se mantiene porque es el contenido).
- **Idioma**: `<html lang="es">`.
- **Honestidad**: se muestra qué se omitió y qué no está validado.

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

## Lenguaje visual

| Token | Claro | Oscuro |
|---|---|---|
| Fondo | `#f6f7f9` | `#11151c` |
| Superficie | `#ffffff` | `#1a2029` |
| Escenario del avatar | `#e9ecef` | `#232a35` (el lienzo 3D se mantiene claro por contraste con la piel) |
| Primario (acciones) | `#1f6feb` | igual |
| Acento (letra actual, foco) | `#f59f00` | igual |

Tipografía del sistema, esquinas redondeadas de 10–14 px, un solo color de acento para "dónde estoy".

## Inspiración del video de referencia (sin copiar)

- Del video: plano medio, fondo neutro, controles contextuales, velocidad visible, etiqueta de idioma.
- Propio de NexoLSC: línea de tiempo por letra, texto normalizado visible, avisos de caracteres
  omitidos, estado de validación, orientación educativa.
- Futuro: un **modo widget** flotante (como el del video) para incrustar en otros sitios usando el mismo
  núcleo.
