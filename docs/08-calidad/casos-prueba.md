# Casos de prueba iniciales

**Estado:** Borrador

| ID | Caso | Resultado esperado | Requisitos |
|---|---|---|---|
| CP-001 | Escribir “hola” y confirmar | Resuelve una intención validada y prepara su guion | RF-001, RF-006, RF-007 |
| CP-002 | Grabar audio válido menor de 10 s | Obtiene texto y pasa a revisión | RF-002, RF-003, RF-004 |
| CP-003 | Corregir una transcripción | Se traduce exactamente el texto corregido | RF-005, RN-004 |
| CP-004 | Ejecutar ejemplos positivos por intención | Todos resuelven la intención esperada | RF-006 |
| CP-005 | Ejecutar ejemplos negativos y ambiguos | No resuelven una intención incorrecta | RF-006, RN-002 |
| CP-006 | Reproducir guion de varias animaciones | Orden, pose y componentes se conservan | RF-008, RNF-009 |
| CP-007 | Pausar, repetir y usar velocidad lenta | Cada control conserva estado y secuencia | RF-009 |
| CP-008 | Enviar frase fuera del dominio | Devuelve `NO_SOPORTADA` sin animación | RF-010, RN-002 |
| CP-009 | Referenciar animación faltante o esqueleto de animación incompatible | Validación o reproducción se bloquea con error | RF-011, RN-003 |
| CP-010 | Provocar fallos en cada estado | La interfaz de usuario informa y permite recuperarse | RF-012, RNF-014 |
| CP-011 | Inspeccionar el paquete compilado de la interfaz web | No contiene claves ni secretos del servicio de transcripción | RNF-006 |
| CP-012 | Completar y abortar transcripción | Audio temporal eliminado en ambos casos | RNF-007 |
| CP-013 | Denegar permiso de micrófono | Se ofrece texto sin bloquear la aplicación | RNF-005 |
| CP-014 | Navegar solo con teclado | Todos los controles son alcanzables y visibles | RNF-008 |
| CP-015 | Mostrar animación sin texto a usuarios LSC | Comprensión cumple el umbral acordado | RNF-009, RNF-012 |
| CP-016 | Elegir deletreo para `JHONATAN` | Muestra advertencia, solicita confirmación y reproduce ocho letras en orden | RF-014, RF-015, RN-008 |
| CP-017 | Deletrear `NIÑO` y `BOGOTÁ` | Conserva `Ñ`, normaliza `Á` y etiqueta la salida como deletreo | RF-016, RNF-015 |
| CP-018 | Deletrear texto con número o letra no publicada | Bloquea toda la secuencia e identifica el carácter problemático | RF-017, RN-009, RNF-016 |

## Plantilla detallada

```text
ID:
Título:
Precondiciones:
Datos:
Pasos:
Resultado esperado:
Resultado obtenido:
Evidencia:
Versión de aplicación:
Versión de catálogo y GLB:
Estado: PASA / FALLA / BLOQUEADA
```

Los casos CP-001, CP-004 y CP-015 dependen de que las intenciones respectivas
sean validadas; mientras tanto se ejecutan con contenido marcado como técnico.
