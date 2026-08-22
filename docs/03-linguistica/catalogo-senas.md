# Catálogo de señas y clips

**Versión:** 0.2
**Estado:** Plantilla; sin contenido lingüístico validado

La orden de producción propuesta para Blender se encuentra en el
[listado de animaciones del MVP](../04-animacion/listado-animaciones-mvp.md).
Este catálogo registra cada clip después de producirlo; el listado organiza el
trabajo pendiente antes de que los registros estén completos.

## Campos obligatorios

| Campo | Descripción |
|---|---|
| `clipId` | Identificador técnico estable. |
| `glossLabel` | Etiqueta humana, no traducción literal. |
| `meaning` | Significado o función en el contexto validado. |
| `region` | Región o comunidad de referencia. |
| `rigVersion` | Versión compatible del rig. |
| `actionName` | Nombre exacto de la Action/NLA en Blender y GLB. |
| `durationMs` | Duración nominal. |
| `nonManual` | Marcadores no manuales incorporados o requeridos. |
| `source` | Fuente y condiciones de consulta. |
| `validator` | Código de la persona validadora; evitar datos personales públicos. |
| `validatedAt` | Fecha de aprobación. |
| `status` | Estado del elemento. |

## Registro inicial de ejemplo

El siguiente registro es solamente técnico:

| clipId | Etiqueta | Action | Rig | Región | Estado |
|---|---|---|---|---|---|
| LSC_SALUDO_HOLA_V1 | HOLA | `LSC_SALUDO_HOLA_V1` | avatar-v1 | POR CONFIRMAR | PROPUESTA |
| POSE_NEUTRAL_V1 | Pose neutral | `POSE_NEUTRAL_V1` | avatar-v1 | N/A | PROPUESTA |

## Convención de identificadores

```text
LSC_<DOMINIO>_<CONCEPTO>_V<n>
```

Ejemplos:

- `LSC_CORTESIA_GRACIAS_V1`
- `LSC_COMUNICACION_REPETIR_V1`

No se debe renombrar un identificador publicado; una corrección incompatible
crea una versión nueva.
