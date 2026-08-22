# Convenciones de animaciones

**Versión:** 0.1
**Estado:** Borrador

## Unidad de trabajo

Cada animación representa una seña o una unidad animada que tenga sentido reutilizar.
Una intención se representa mediante un guion que ordena animaciones y componentes no
manuales. No se debe fragmentar una seña solo para aumentar reutilización.

## Nombres

```text
<IDIOMA>_<DOMINIO>_<CONCEPTO>_V<n>
```

- Acciones, pistas NLA y `idAnimacion` usarán el mismo nombre.
- Nombres en mayúsculas, ASCII y guion bajo.
- No usar `.001`, `final`, `nuevo` ni fechas como versión.

## Línea de tiempo

- Velocidad del proyecto: 30 fotogramas por segundo **POR CONFIRMAR**.
- Cada Acción empieza en fotograma 0.
- Mantener claves únicamente dentro del rango de la Acción.
- Incluir entrada y salida compatibles con la pose neutral cuando sea válido.
- Evitar pausas artificiales no aprobadas por revisión lingüística.

## Claves y curvas

- Animar rotaciones de huesos con cuaterniones cuando reduzcan artefactos.
- Revisar el sobrepaso de las interpolaciones, especialmente en los dedos.
- Hornear restricciones antes de exportar si glTF no las representa.
- Las claves de forma necesarias deben quedar animadas o documentadas en el guion.

## Transiciones

La transición no es solo un fundido cruzado técnico. Debe revisarse que no cree una
configuración accidental o cambie el significado. Tipos iniciales:

- `NEUTRAL_A_SENA`
- `SENA_A_SENA`
- `SENA_A_NEUTRAL`
- `PAUSA`

Los tiempos por defecto son parámetros técnicos sujetos a validación:

| Transición | Duración inicial |
|---|---:|
| Neutral a seña | 120 ms |
| Entre señas | 100 ms |
| Seña a neutral | 150 ms |

## Exportación y aceptación

Una animación se acepta técnicamente cuando:

- se exporta con el nombre correcto;
- reproduce sin saltos y sobre el esqueleto de animación compatible;
- no contiene tracks de objetos ajenos;
- conserva componentes manuales y no manuales;
- no presenta intersecciones graves;
- tiene registro en el catálogo;
- pasa validación lingüística antes de publicarse.
