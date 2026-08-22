# Catálogo de señas y animaciones

**Estado:** Plantilla; sin contenido lingüístico validado

La orden de producción propuesta para Blender se encuentra en el
[listado de animaciones del PMV](../04-animacion/listado-animaciones-pmv.md).
Este catálogo registra cada animación después de producirla; el listado organiza el
trabajo pendiente antes de que los registros estén completos.

## Campos obligatorios

| Campo | Descripción |
|---|---|
| `idAnimacion` | Identificador técnico estable. |
| `tipoAnimacion` | `SENA`, `LETRA_MANUAL` o `POSE`. |
| `caracter` | Letra asociada cuando `tipoAnimacion` es `LETRA_MANUAL`; vacío en los demás casos. |
| `etiquetaGlosa` | Etiqueta humana, no traducción literal. |
| `significado` | Significado o función en el contexto validado. |
| `region` | Región o comunidad de referencia. |
| `versionEsqueleto` | Versión compatible del esqueleto de animación. |
| `nombreAnimacionBlender` | Nombre exacto de la animación en Blender y GLB. |
| `duracionMilisegundos` | Duración nominal en milisegundos. |
| `componentesNoManuales` | Marcadores no manuales incorporados o requeridos. |
| `fuente` | Fuente y condiciones de consulta. |
| `codigoValidador` | Código de la persona validadora; evita publicar datos personales. |
| `fechaValidacion` | Fecha de aprobación. |
| `estado` | Estado del elemento. |

## Registro inicial de ejemplo

El siguiente registro es solamente técnico:

| idAnimacion | Etiqueta | Acción | Esqueleto de animación | Región | Estado |
|---|---|---|---|---|---|
| LSC_SALUDO_HOLA_V1 | HOLA | `LSC_SALUDO_HOLA_V1` | avatar-v1 | POR CONFIRMAR | PROPUESTA |
| POSE_NEUTRAL_V1 | Pose neutral | `POSE_NEUTRAL_V1` | avatar-v1 | N/A | PROPUESTA |
| LSC_ALFABETO_A_V1 | Letra A | `LSC_ALFABETO_A_V1` | avatar-v1 | Colombia | PROPUESTA |

## Convención de identificadores

```text
LSC_<DOMINIO>_<CONCEPTO>_V<n>
```

Ejemplos:

- `LSC_CORTESIA_GRACIAS_V1`
- `LSC_COMUNICACION_REPETIR_V1`

No se debe renombrar un identificador publicado; una corrección incompatible
crea una versión nueva.
