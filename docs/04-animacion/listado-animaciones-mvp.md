# Listado de animaciones del MVP para Blender

**Versión:** 0.1
**Estado:** Plan de producción; contenido LSC pendiente de validación
**Rig objetivo:** `avatar-v1`
**Velocidad de trabajo propuesta:** 30 FPS

## Propósito

Este documento convierte el catálogo de intenciones en una lista concreta de
Actions que deben producirse en Blender. Los nombres describen su función dentro
del software; no representan por sí mismos la forma, gramática ni orden correcto
de la LSC.

> No se debe comenzar una animación lingüística usando únicamente la frase en
> español. Cada Action necesita primero un guion o video de referencia aprobado
> por una persona competente en LSC.

## Estrategia de producción del MVP

- Crear una Action completa por intención comunicativa.
- Mantener pose inicial y final documentadas para cada Action.
- Incluir dentro de la misma Action las manos, rostro, cabeza, mirada y torso que
  pertenezcan a la intención.
- No dividir una frase en clips léxicos reutilizables hasta que la validación LSC
  confirme que la división y las transiciones conservan el significado.
- Publicar todas las Actions aprobadas dentro del GLB `avatar-v1` durante el MVP.

## Resumen

| Grupo | Cantidad | Objetivo |
|---|---:|---|
| Base técnica | 1 | Pose neutral compatible con todas las Actions. |
| Ola 1 | 10 | Intenciones mínimas para el primer flujo por texto. |
| Ola 2 | 9 | Ampliación del catálogo después del vertical slice. |
| Bloqueada | 1 | Requiere resolver nombres propios o deletreo manual. |
| **Total planificado** | **21** | 20 Actions candidatas y una decisión bloqueada. |

La Action bloqueada no se incluye en el primer GLB. Por tanto, el objetivo de
publicación del MVP es una pose neutral más 19 intenciones.

## Base técnica

| N.º | Action de Blender | Uso | Sprint | Estado de producción |
|---:|---|---|---:|---|
| 00 | `POSE_NEUTRAL_V1` | Estado inicial, separación entre interacciones y retorno seguro. | 0 | PENDIENTE |

La pose neutral debe ser acordada lingüísticamente. No se debe asumir que la pose
de reposo del rig es una pose comunicativa adecuada.

## Ola 1: diez animaciones esenciales

Estas Actions permiten demostrar el recorrido texto → intención → avatar en
Sprint 1. Las tres primeras también sirven para probar exportación durante Sprint 0.

| Orden | ID de intención | Action de Blender | Significado de referencia en español | Uso en Sprint 0 | Estado |
|---:|---|---|---|---|---|
| 01 | `SALUDO_HOLA` | `LSC_SALUDO_HOLA_V1` | Hola / saludo general | Prueba 1 | PENDIENTE_REFERENCIA |
| 02 | `CORTESIA_GRACIAS` | `LSC_CORTESIA_GRACIAS_V1` | Gracias | Prueba 2 | PENDIENTE_REFERENCIA |
| 03 | `COMUNICACION_NO_ENTIENDO` | `LSC_COMUNICACION_NO_ENTIENDO_V1` | No entiendo | Prueba 3 | PENDIENTE_REFERENCIA |
| 04 | `SALUDO_BUENOS_DIAS` | `LSC_SALUDO_BUENOS_DIAS_V1` | Buenos días | — | PENDIENTE_REFERENCIA |
| 05 | `CORTESIA_POR_FAVOR` | `LSC_CORTESIA_POR_FAVOR_V1` | Por favor | — | PENDIENTE_REFERENCIA |
| 06 | `RESPUESTA_SI` | `LSC_RESPUESTA_SI_V1` | Sí / de acuerdo | — | PENDIENTE_REFERENCIA |
| 07 | `RESPUESTA_NO` | `LSC_RESPUESTA_NO_V1` | No | — | PENDIENTE_REFERENCIA |
| 08 | `DESPEDIDA_ADIOS` | `LSC_DESPEDIDA_ADIOS_V1` | Adiós / hasta luego | — | PENDIENTE_REFERENCIA |
| 09 | `NECESIDAD_AYUDA` | `LSC_NECESIDAD_AYUDA_V1` | Necesito ayuda | — | PENDIENTE_REFERENCIA |
| 10 | `COMUNICACION_REPETIR` | `LSC_COMUNICACION_REPETIR_V1` | Repite / otra vez | — | PENDIENTE_REFERENCIA |

## Ola 2: ampliación del MVP

Estas Actions se producen después de probar el rig, el exportador y el reproductor
con la Ola 1.

| Orden | ID de intención | Action de Blender | Significado de referencia en español | Prioridad | Estado |
|---:|---|---|---|---|---|
| 11 | `CORTESIA_PERDON` | `LSC_CORTESIA_PERDON_V1` | Perdón / disculpa | Must | PENDIENTE_REFERENCIA |
| 12 | `COMUNICACION_MAS_DESPACIO` | `LSC_COMUNICACION_MAS_DESPACIO_V1` | Más despacio | Must | PENDIENTE_REFERENCIA |
| 13 | `SALUDO_BUENAS_TARDES` | `LSC_SALUDO_BUENAS_TARDES_V1` | Buenas tardes | Should | PENDIENTE_REFERENCIA |
| 14 | `SALUDO_BUENAS_NOCHES` | `LSC_SALUDO_BUENAS_NOCHES_V1` | Buenas noches | Should | PENDIENTE_REFERENCIA |
| 15 | `PREGUNTA_NOMBRE` | `LSC_PREGUNTA_NOMBRE_V1` | ¿Cómo te llamas? | Should | PENDIENTE_REFERENCIA |
| 16 | `PREGUNTA_COMO_ESTA` | `LSC_PREGUNTA_COMO_ESTA_V1` | ¿Cómo estás? | Should | PENDIENTE_REFERENCIA |
| 17 | `RESPUESTA_ESTOY_BIEN` | `LSC_RESPUESTA_ESTOY_BIEN_V1` | Estoy bien | Should | PENDIENTE_REFERENCIA |
| 18 | `NECESIDAD_AGUA` | `LSC_NECESIDAD_AGUA_V1` | Necesito agua | Should | PENDIENTE_REFERENCIA |
| 19 | `NECESIDAD_BANO` | `LSC_NECESIDAD_BANO_V1` | ¿Dónde está el baño? | Should | PENDIENTE_REFERENCIA |

Las preguntas requieren una revisión específica de sus componentes no manuales.
La tabla no define cuáles son; deben anotarse en la ficha aprobada de producción.

## Intención bloqueada

| ID de intención | Action candidata | Motivo | Decisión necesaria | Estado |
|---|---|---|---|---|
| `PRESENTACION_MI_NOMBRE` | `LSC_PRESENTACION_MI_NOMBRE_V1` | La frase necesita incorporar un nombre variable y puede requerir deletreo manual. Una Action fija quedaría incompleta. | Definir si el MVP incorpora alfabeto manual, una pausa para deletreo humano o excluye esta intención. | BLOQUEADA |

No se debe animar esta Action hasta resolver el comportamiento completo. Mientras
esté bloqueada, el clasificador no debe publicarla como intención soportada.

## Estados de producción

| Estado | Significado |
|---|---|
| `PENDIENTE_REFERENCIA` | Falta un guion o video LSC aprobado para animar. |
| `LISTA_PARA_ANIMAR` | Referencia, contexto, región y rig están aprobados. |
| `EN_ANIMACION` | Trabajo activo en Blender. |
| `REVISION_TECNICA` | Se revisan deformaciones, curvas, nombres y exportación. |
| `REVISION_LSC` | Una persona competente revisa fidelidad lingüística. |
| `APROBADA` | Superó revisiones técnica y lingüística. |
| `EXPORTADA` | La versión aprobada está incluida y probada en el GLB. |
| `BLOQUEADA` | Existe una decisión o dependencia que impide comenzar. |

## Definition of Ready para animar

Una Action solo cambia a `LISTA_PARA_ANIMAR` cuando tiene:

- [ ] intención aceptada para el MVP;
- [ ] región o variante de LSC definida;
- [ ] guion o video de referencia con permiso de uso;
- [ ] revisión inicial de una persona competente en LSC;
- [ ] anotaciones de configuración manual, orientación, ubicación y movimiento;
- [ ] anotaciones de rostro, cabeza, mirada y torso;
- [ ] pose inicial, pose final y ritmo de referencia;
- [ ] versión `avatar-v1` del rig congelada para producción.

## Ficha de producción por Action

Copiar esta ficha para cada animación:

```text
ID de intención:
Action:
Versión del rig:
Región o variante:
Significado y contexto:
Referencia autorizada:
Persona validadora o código:
Pose inicial:
Pose final:
Mano dominante:
Configuraciones manuales:
Orientación y ubicación:
Movimiento y contacto:
Rostro, cabeza, mirada y torso:
Duración de referencia:
Frames de inicio y fin:
Intersecciones por revisar:
Estado de producción:
Resultado de revisión técnica:
Resultado de revisión LSC:
Archivo .blend:
GLB y checksum:
```

## Lista de trabajo en Blender

Para cada Action:

1. Crear la Action con el nombre exacto de la tabla.
2. Bloquear primero poses principales, torso, brazos y trayectoria.
3. Completar muñecas y configuraciones de todos los dedos.
4. Incorporar componentes no manuales definidos en la ficha.
5. Ajustar ritmo, anticipaciones y pausas contra la referencia.
6. Revisar intersecciones de manos con cuerpo, rostro y entre sí.
7. Limpiar curvas y evitar overshoot en dedos y muñecas.
8. Confirmar pose inicial y final acordadas.
9. Incorporar la Action al mecanismo de exportación glTF.
10. Probarla aislada en un visor glTF y después en la aplicación.
11. Enviar la misma versión a revisión LSC.
12. Registrar aprobación, duración, archivo y checksum antes de publicar.

## Criterio de salida

El listado del MVP está terminado cuando `POSE_NEUTRAL_V1` y las 19 Actions no
bloqueadas tienen estado `EXPORTADA`, pertenecen al mismo `avatar-v1.glb`, pasan
las pruebas técnicas y cuentan con validación LSC para su versión exacta.
