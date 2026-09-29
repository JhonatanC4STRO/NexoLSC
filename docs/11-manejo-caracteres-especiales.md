# 11 · Manejo de tildes, espacios y caracteres especiales

Todas las reglas están en `src/core/text/normalize.ts` y tienen pruebas.

## Tabla de reglas

| Entrada | Salida | Regla |
|---|---|---|
| `a` … `z` | `A` … `Z` | Mayúsculas con locale `es` |
| `á é í ó ú` | `A E I O U` | Se quita el diacrítico (NFD + eliminar marcas combinantes) |
| `ü` | `U` | Igual que las tildes |
| `ñ` / `Ñ` | `Ñ` | **Se procesa antes** de quitar diacríticos (si no, se convertiría en N). Es letra propia del alfabeto manual LSC |
| `à ç ô …` (otros latinos) | `A C O …` | Se quita el diacrítico (nombres extranjeros) |
| Espacio, tab, salto de línea, `-`, `–`, `—`, `/`, `_` | pausa de palabra (450 ms) | Varias seguidas cuentan como una |
| `,` `;` `:` | pausa corta (550 ms) | |
| `.` `!` `?` `…` | pausa de oración (850 ms) | |
| `¿` `¡` comillas, paréntesis, corchetes, apóstrofos | (nada) | Se ignoran sin pausa |
| `0`–`9` | token `number` | **Sin seña en el MVP**: se omiten y se avisa. Fase 1.1: números del DBLSC (p. 574) |
| Emojis, `@ # $ % & * + =`, otros alfabetos (`ß`, `ж`, `中`…) | token `unsupported` | Se omiten y se muestran en "Omitidos (sin seña en el MVP): …" |
| Más de 200 caracteres | se corta | Se muestra `…` al final del texto normalizado |

Reglas adicionales:

- Las pausas al inicio y al final se descartan (no tiene sentido esperar antes de la primera letra).
- Si coinciden varias pausas (`"hola, . mundo"`), se queda la más larga.

## Casos resueltos

| Texto | Se deletrea | Omitidos |
|---|---|---|
| `¿Cómo estás?` | `COMO ESTAS` | — |
| `Pingüino ñandú árbol` | `PINGUINO ÑANDU ARBOL` | — |
| `hola,   mundo. ¡sí!` | `HOLA MUNDO SI` | — |
| `casa 3 @` | `CASA 3` (el 3 se muestra pero no se seña) | `3 @` |
| `Calle 5` | `CALLE` (L repetida marcada) | `5` |
| `José-María` | `JOSE MARIA` | — |

## Decisiones abiertas (a validar con la comunidad sorda)

| Tema | Decisión del MVP | Por qué está abierta |
|---|---|---|
| **CH, LL, RR** | Se deletrean letra por letra (C+H, L+L, R+R) | La ilustración del DBLSC muestra 27 letras (sin CH, LL ni RR), pero Wikipedia, citando el Portal de Lenguas de Colombia (Instituto Caro y Cuervo), habla de **32 configuraciones manuales** para 27 letras. Hay que confirmar con INSOR/FENASCOL si existen configuraciones propias para dígrafos o variantes |
| **Letras repetidas** (LL, RR, SS) | Pequeña re-articulación acercándose a `rest` | No encontré en las fuentes cómo se marca la repetición en LSC |
| **Separar palabras** | Pausa de 450 ms con la mano en su sitio | El DBLSC registra la seña **APARTE**, que se usa "para separar una palabra de otra cuando se deletrean con el alfabeto manual" (p. 443). Podría insertarse entre palabras en una versión posterior |
| **Números** | Se omiten con aviso | Hay seña para cada número (anexo del DBLSC, p. 574). Convertir "3" en "TRES" y deletrearlo **no** es lo que haría una persona sorda |
| **Tildes** | Se eliminan | El alfabeto manual no tiene letras con tilde; confirmar que no se marca de otra forma |

## Por qué no convertir los números en palabras

Deletrear `T-R-E-S` para el número 3 produciría algo que ningún usuario de LSC haría. Es mejor ser
honesto ("no soportado todavía") y añadir los clips de números como primera ampliación, ya que la fuente
existe.
