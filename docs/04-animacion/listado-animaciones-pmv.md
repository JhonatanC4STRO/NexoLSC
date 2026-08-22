# Listado de animaciones del PMV para Blender

**Versión:** 0.1
**Estado:** Plan de producción; contenido LSC pendiente de validación
**Esqueleto de animación objetivo:** `avatar-v1`
**Velocidad de trabajo propuesta:** 30 fotogramas por segundo

## Propósito

Este documento convierte el catálogo de intenciones en una lista concreta de
Acciones que deben producirse en Blender. Los nombres describen su función dentro
del software; no representan por sí mismos la forma, gramática ni orden correcto
de la LSC.

> No se debe comenzar una animación lingüística usando únicamente la frase en
> español. Cada Acción necesita primero un guion o video de referencia aprobado
> por una persona competente en LSC.

## Estrategia de producción del PMV

- Crear una Acción completa por intención comunicativa.
- Mantener pose inicial y final documentadas para cada Acción.
- Incluir dentro de la misma Acción las manos, rostro, cabeza, mirada y torso que
  pertenezcan a la intención.
- No dividir una frase en animaciones léxicas reutilizables hasta que la validación LSC
  confirme que la división y las transiciones conservan el significado.
- Publicar todas las Acciones aprobadas dentro del GLB `avatar-v1` durante el PMV.

## Resumen

| Grupo | Cantidad | Objetivo |
|---|---:|---|
| Base técnica | 1 | Pose neutral compatible con todas las Acciones. |
| Ola 1 | 10 | Intenciones mínimas para el primer flujo por texto. |
| Ola 2 | 9 | Ampliación del catálogo después del recorrido vertical. |
| Bloqueada | 1 | Requiere resolver nombres propios o deletreo manual. |
| **Total planificado** | **21** | 20 Acciones candidatas y una decisión bloqueada. |

La Acción bloqueada no se incluye en el primer GLB. Por tanto, el objetivo de
publicación del PMV es una pose neutral más 19 intenciones.

## Base técnica

| N.º | Acción de Blender | Uso | Iteración | Estado de producción |
|---:|---|---|---:|---|
| 00 | `POSE_NEUTRAL_V1` | Estado inicial, separación entre interacciones y retorno seguro. | 0 | PENDIENTE |

La pose neutral debe ser acordada lingüísticamente. No se debe asumir que la pose
de reposo del esqueleto de animación es una pose comunicativa adecuada.

## Ola 1: diez animaciones esenciales

Estas Acciones permiten demostrar el recorrido texto → intención → avatar en
la Iteración 1. Las tres primeras también sirven para probar la exportación durante
la Iteración 0.

| Orden | ID de intención | Acción de Blender | Significado de referencia en español | Uso en la Iteración 0 | Estado |
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

## Ola 2: ampliación del PMV

Estas Acciones se producen después de probar el esqueleto de animación, el exportador y el reproductor
con la Ola 1.

| Orden | ID de intención | Acción de Blender | Significado de referencia en español | Prioridad | Estado |
|---:|---|---|---|---|---|
| 11 | `CORTESIA_PERDON` | `LSC_CORTESIA_PERDON_V1` | Perdón / disculpa | Obligatoria | PENDIENTE_REFERENCIA |
| 12 | `COMUNICACION_MAS_DESPACIO` | `LSC_COMUNICACION_MAS_DESPACIO_V1` | Más despacio | Obligatoria | PENDIENTE_REFERENCIA |
| 13 | `SALUDO_BUENAS_TARDES` | `LSC_SALUDO_BUENAS_TARDES_V1` | Buenas tardes | Recomendada | PENDIENTE_REFERENCIA |
| 14 | `SALUDO_BUENAS_NOCHES` | `LSC_SALUDO_BUENAS_NOCHES_V1` | Buenas noches | Recomendada | PENDIENTE_REFERENCIA |
| 15 | `PREGUNTA_NOMBRE` | `LSC_PREGUNTA_NOMBRE_V1` | ¿Cómo te llamas? | Recomendada | PENDIENTE_REFERENCIA |
| 16 | `PREGUNTA_COMO_ESTA` | `LSC_PREGUNTA_COMO_ESTA_V1` | ¿Cómo estás? | Recomendada | PENDIENTE_REFERENCIA |
| 17 | `RESPUESTA_ESTOY_BIEN` | `LSC_RESPUESTA_ESTOY_BIEN_V1` | Estoy bien | Recomendada | PENDIENTE_REFERENCIA |
| 18 | `NECESIDAD_AGUA` | `LSC_NECESIDAD_AGUA_V1` | Necesito agua | Recomendada | PENDIENTE_REFERENCIA |
| 19 | `NECESIDAD_BANO` | `LSC_NECESIDAD_BANO_V1` | ¿Dónde está el baño? | Recomendada | PENDIENTE_REFERENCIA |

Las preguntas requieren una revisión específica de sus componentes no manuales.
La tabla no define cuáles son; deben anotarse en la ficha aprobada de producción.

## Intención bloqueada

| ID de intención | Acción candidata | Motivo | Decisión necesaria | Estado |
|---|---|---|---|---|
| `PRESENTACION_MI_NOMBRE` | `LSC_PRESENTACION_MI_NOMBRE_V1` | La frase necesita incorporar un nombre variable y puede requerir deletreo manual. Una Acción fija quedaría incompleta. | Definir si el PMV incorpora alfabeto manual, una pausa para deletreo humano o excluye esta intención. | BLOQUEADA |

No se debe animar esta Acción hasta resolver el comportamiento completo. Mientras
esté bloqueada, el clasificador no debe publicarla como intención soportada.

## Estados de producción

| Estado | Significado |
|---|---|
| `PENDIENTE_REFERENCIA` | Falta un guion o video LSC aprobado para animar. |
| `LISTA_PARA_ANIMAR` | Referencia, contexto, región y esqueleto de animación están aprobados. |
| `EN_ANIMACION` | Trabajo activo en Blender. |
| `REVISION_TECNICA` | Se revisan deformaciones, curvas, nombres y exportación. |
| `REVISION_LSC` | Una persona competente revisa fidelidad lingüística. |
| `APROBADA` | Superó revisiones técnica y lingüística. |
| `EXPORTADA` | La versión aprobada está incluida y probada en el GLB. |
| `BLOQUEADA` | Existe una decisión o dependencia que impide comenzar. |

## Criterios de preparación para animar

Una Acción solo cambia a `LISTA_PARA_ANIMAR` cuando tiene:

- [ ] intención aceptada para el PMV;
- [ ] región o variante de LSC definida;
- [ ] guion o video de referencia con permiso de uso;
- [ ] revisión inicial de una persona competente en LSC;
- [ ] anotaciones de configuración manual, orientación, ubicación y movimiento;
- [ ] anotaciones de rostro, cabeza, mirada y torso;
- [ ] pose inicial, pose final y ritmo de referencia;
- [ ] versión `avatar-v1` del esqueleto de animación congelada para producción.

## Ficha de producción por Acción

Copiar esta ficha para cada animación:

```text
ID de intención:
Acción:
Versión del esqueleto de animación:
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
Fotogramas de inicio y fin:
Intersecciones por revisar:
Estado de producción:
Resultado de revisión técnica:
Resultado de revisión LSC:
Archivo .blend:
GLB y suma de comprobación:
```

## Lista de trabajo en Blender

Para cada Acción:

1. Crear la Acción con el nombre exacto de la tabla.
2. Bloquear primero poses principales, torso, brazos y trayectoria.
3. Completar muñecas y configuraciones de todos los dedos.
4. Incorporar componentes no manuales definidos en la ficha.
5. Ajustar ritmo, anticipaciones y pausas contra la referencia.
6. Revisar intersecciones de manos con cuerpo, rostro y entre sí.
7. Limpiar curvas y evitar sobrepasos en dedos y muñecas.
8. Confirmar pose inicial y final acordadas.
9. Incorporar la Acción al mecanismo de exportación glTF.
10. Probarla aislada en un visor glTF y después en la aplicación.
11. Enviar la misma versión a revisión LSC.
12. Registrar aprobación, duración, archivo y suma de comprobación antes de publicar.

## Criterio de salida

El listado del PMV está terminado cuando `POSE_NEUTRAL_V1` y las 19 Acciones no
bloqueadas tienen estado `EXPORTADA`, pertenecen al mismo `avatar-v1.glb`, pasan
las pruebas técnicas y cuentan con validación LSC para su versión exacta.
