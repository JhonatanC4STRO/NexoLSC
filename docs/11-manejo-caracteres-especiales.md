# 11 · Tildes, espacios y caracteres especiales

> **En pocas palabras:** antes de señar, la página «limpia» el texto: lo pasa a mayúsculas, quita las
> tildes (pero **conserva la Ñ**, que es una letra propia del alfabeto) y convierte los espacios y signos en
> pausas. Lo que no tiene seña todavía, como los números o los emojis, no se seña y se avisa.

Todas estas reglas están en `src/core/text/normalize.ts` y tienen pruebas automáticas.

## Las reglas

| Si escribes | Queda | Por qué |
|---|---|---|
| `a` … `z` | `A` … `Z` | Todo se pasa a mayúsculas |
| `á é í ó ú` | `A E I O U` | Se quita la tilde |
| `ü` | `U` | Se quita la diéresis, igual que la tilde |
| `ñ` / `Ñ` | `Ñ` | **Se cuida antes** de quitar las tildes; si no, se volvería N. La Ñ es una letra propia del alfabeto manual LSC |
| `à ç ô …` (letras de otros idiomas) | `A C O …` | Se quita la marca (útil para nombres extranjeros) |
| Espacio, tabulador, salto de línea, `-`, `–`, `—`, `/`, `_` | Pausa entre palabras (450 ms) | Varios seguidos cuentan como uno |
| `,` `;` `:` | Pausa corta (550 ms) | |
| `.` `!` `?` `…` | Pausa de fin de oración (850 ms) | |
| `¿` `¡`, comillas, paréntesis, corchetes, apóstrofos | Nada | Se ignoran, sin pausa |
| `0` a `9` | No se seña | **Todavía no hay señas de números**: se omiten y se avisa. Vendrán en la fase 1.1 (están en el diccionario DBLSC, pág. 574) |
| Emojis, `@ # $ % & * + =`, otros alfabetos (`ß`, `ж`, `中`…) | No se seña | Se omiten y se muestran en «Omitidos (sin seña en el MVP): …» |
| Más de 200 caracteres | Se corta | Se muestra `…` al final |

Dos reglas más:

- Las pausas al principio y al final se quitan (no tiene sentido esperar antes de la primera letra).
- Si se juntan varias pausas (por ejemplo, `"hola, . mundo"`), se queda la más larga.

## Ejemplos

| Texto | Se deletrea | No se seña |
|---|---|---|
| `¿Cómo estás?` | `COMO ESTAS` | — |
| `Pingüino ñandú árbol` | `PINGUINO ÑANDU ARBOL` | — |
| `hola,   mundo. ¡sí!` | `HOLA MUNDO SI` | — |
| `casa 3 @` | `CASA 3` (el 3 se muestra, pero no se seña) | `3 @` |
| `Calle 5` | `CALLE` (la L repetida se marca) | `5` |
| `José-María` | `JOSE MARIA` | — |

## Preguntas pendientes (hay que validarlas con la comunidad sorda)

| Tema | Qué se hace hoy | Por qué sigue abierto |
|---|---|---|
| **CH, LL, RR** | Se deletrean letra por letra (C+H, L+L, R+R) | La ilustración del diccionario DBLSC muestra 27 letras, sin CH, LL ni RR. Pero otra fuente (Wikipedia, citando al Instituto Caro y Cuervo) habla de **32 formas de mano** para 27 letras. Hay que preguntar a INSOR o FENASCOL si estas combinaciones tienen seña propia |
| **Letras repetidas** (LL, RR, SS) | El avatar se acerca un momento al reposo entre las dos | No se encontró en las fuentes cómo se marca una letra repetida en LSC |
| **Separar palabras** | Pausa de 450 ms con la mano en su sitio | El diccionario DBLSC tiene la seña **APARTE**, que se usa «para separar una palabra de otra cuando se deletrean con el alfabeto manual» (pág. 443). Se podría usar entre palabras más adelante |
| **Números** | Se omiten y se avisa | Cada número tiene su seña (diccionario DBLSC, pág. 574). Convertir «3» en «TRES» y deletrearlo **no** es lo que haría una persona sorda |
| **Tildes** | Se quitan | El alfabeto manual no tiene letras con tilde; falta confirmar que no se marquen de otra forma |

## ¿Por qué no deletrear los números con letras?

Deletrear T-R-E-S para el número 3 sería algo que ninguna persona que usa la LSC haría. Es mejor ser
honestos («todavía no se puede») y añadir las señas de los números como primera ampliación, ya que la fuente
existe.
