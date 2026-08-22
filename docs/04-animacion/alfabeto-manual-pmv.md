# Alfabeto manual del PMV

**Estado:** Plan de producción pendiente de validación LSC
**Esqueleto objetivo:** `avatar-v1`

## Propósito

Crear una animación por letra para deletrear nombres propios, siglas y palabras
sin una seña disponible. El deletreo también podrá aplicarse a una frase corta si
el usuario lo solicita expresamente, pero la interfaz debe advertir que no es una
traducción a LSC.

## Alcance inicial

- Letras `A` a `Z` y `Ñ`.
- Vocales con tilde se convierten en su vocal base; `Ü` se convierte en `U`.
- Los espacios producen una pausa visible entre palabras.
- `CH`, `LL` y `RR` se reproducen como letras consecutivas mientras una validación
  lingüística no apruebe otra convención.
- Números, signos y símbolos quedan fuera del PMV. Si aparecen, el sistema debe
  avisar y pedir una corrección; nunca los elimina silenciosamente.

## Animaciones para Blender

| Letra | Animación | Tipo | Estado |
|---|---|---|---|
| A | `LSC_ALFABETO_A_V1` | Por validar | PENDIENTE_REFERENCIA |
| B | `LSC_ALFABETO_B_V1` | Por validar | PENDIENTE_REFERENCIA |
| C | `LSC_ALFABETO_C_V1` | Por validar | PENDIENTE_REFERENCIA |
| D | `LSC_ALFABETO_D_V1` | Por validar | PENDIENTE_REFERENCIA |
| E | `LSC_ALFABETO_E_V1` | Por validar | PENDIENTE_REFERENCIA |
| F | `LSC_ALFABETO_F_V1` | Por validar | PENDIENTE_REFERENCIA |
| G | `LSC_ALFABETO_G_V1` | Por validar | PENDIENTE_REFERENCIA |
| H | `LSC_ALFABETO_H_V1` | Por validar | PENDIENTE_REFERENCIA |
| I | `LSC_ALFABETO_I_V1` | Por validar | PENDIENTE_REFERENCIA |
| J | `LSC_ALFABETO_J_V1` | Con movimiento por validar | PENDIENTE_REFERENCIA |
| K | `LSC_ALFABETO_K_V1` | Por validar | PENDIENTE_REFERENCIA |
| L | `LSC_ALFABETO_L_V1` | Por validar | PENDIENTE_REFERENCIA |
| M | `LSC_ALFABETO_M_V1` | Por validar | PENDIENTE_REFERENCIA |
| N | `LSC_ALFABETO_N_V1` | Por validar | PENDIENTE_REFERENCIA |
| Ñ | `LSC_ALFABETO_ENE_V1` | Por validar | PENDIENTE_REFERENCIA |
| O | `LSC_ALFABETO_O_V1` | Por validar | PENDIENTE_REFERENCIA |
| P | `LSC_ALFABETO_P_V1` | Por validar | PENDIENTE_REFERENCIA |
| Q | `LSC_ALFABETO_Q_V1` | Por validar | PENDIENTE_REFERENCIA |
| R | `LSC_ALFABETO_R_V1` | Por validar | PENDIENTE_REFERENCIA |
| S | `LSC_ALFABETO_S_V1` | Por validar | PENDIENTE_REFERENCIA |
| T | `LSC_ALFABETO_T_V1` | Por validar | PENDIENTE_REFERENCIA |
| U | `LSC_ALFABETO_U_V1` | Por validar | PENDIENTE_REFERENCIA |
| V | `LSC_ALFABETO_V_V1` | Por validar | PENDIENTE_REFERENCIA |
| W | `LSC_ALFABETO_W_V1` | Por validar | PENDIENTE_REFERENCIA |
| X | `LSC_ALFABETO_X_V1` | Por validar | PENDIENTE_REFERENCIA |
| Y | `LSC_ALFABETO_Y_V1` | Por validar | PENDIENTE_REFERENCIA |
| Z | `LSC_ALFABETO_Z_V1` | Con movimiento por validar | PENDIENTE_REFERENCIA |

Los nombres son identificadores técnicos, no describen la configuración de la
mano. Cada letra necesita una referencia colombiana autorizada y validación antes
de animarse.

## Reproducción

1. Convertir el texto confirmado a mayúsculas.
2. Normalizar únicamente las vocales acentuadas y `Ü`.
3. Comprobar que cada carácter tenga una animación publicada.
4. Mostrar al usuario el texto exacto que se deletreará.
5. Solicitar confirmación explícita.
6. Reproducir una letra a la vez, con transición legible y pausa entre palabras.
7. Permitir pausar, repetir y reducir la velocidad.

## Criterios de terminado del alfabeto

- [ ] Las 27 letras tienen referencia y variante regional documentadas.
- [ ] Las configuraciones, orientaciones y movimientos fueron validados.
- [ ] Las transiciones no forman configuraciones accidentales.
- [ ] La `Ñ` se conserva y las vocales acentuadas se normalizan correctamente.
- [ ] Las letras se reconocen aisladas y dentro de palabras de prueba.
- [ ] Todos los identificadores están publicados en el catálogo de animaciones.
- [ ] La misma versión funciona en Blender, GLB y aplicación.

## Palabras de prueba

- `ANA`: repetición de una letra no consecutiva.
- `JHONATAN`: combinación de letra con movimiento y letras estáticas.
- `NIÑO`: uso obligatorio de la `Ñ`.
- `BOGOTÁ`: normalización de vocal acentuada.
- `LSC`: sigla.
- `MARÍA JOSÉ`: vocales acentuadas y pausa entre palabras.
