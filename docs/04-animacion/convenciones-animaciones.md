# Convenciones de animaciones

**Versión:** 0.1
**Estado:** Borrador

## Unidad de trabajo

Cada clip representa una seña o una unidad animada que tenga sentido reutilizar.
Una intención se representa mediante un guion que ordena clips y componentes no
manuales. No se debe fragmentar una seña solo para aumentar reutilización.

## Nombres

```text
<IDIOMA>_<DOMINIO>_<CONCEPTO>_V<n>
```

- Actions, pistas NLA y `clipId` usarán el mismo nombre.
- Nombres en mayúsculas, ASCII y guion bajo.
- No usar `.001`, `final`, `nuevo` ni fechas como versión.

## Línea de tiempo

- Velocidad del proyecto: 30 FPS **POR CONFIRMAR**.
- Cada Action empieza en frame 0.
- Mantener claves únicamente dentro del rango de la Action.
- Incluir entrada y salida compatibles con la pose neutral cuando sea válido.
- Evitar pausas artificiales no aprobadas por revisión lingüística.

## Claves y curvas

- Animar rotaciones de huesos con cuaterniones cuando reduzcan artefactos.
- Revisar overshoot de interpolaciones, especialmente en dedos.
- Hornear restricciones antes de exportar si glTF no las representa.
- Las shape keys necesarias deben quedar animadas o documentadas en el guion.

## Transiciones

La transición no es solo un crossfade técnico. Debe revisarse que no cree una
configuración accidental o cambie el significado. Tipos iniciales:

- `NEUTRAL_TO_SIGN`
- `SIGN_TO_SIGN`
- `SIGN_TO_NEUTRAL`
- `HOLD`

Los tiempos por defecto son parámetros técnicos sujetos a validación:

| Transición | Duración inicial |
|---|---:|
| Neutral a seña | 120 ms |
| Entre señas | 100 ms |
| Seña a neutral | 150 ms |

## Exportación y aceptación

Un clip se acepta técnicamente cuando:

- se exporta con el nombre correcto;
- reproduce sin saltos y sobre el rig compatible;
- no contiene tracks de objetos ajenos;
- conserva componentes manuales y no manuales;
- no presenta intersecciones graves;
- tiene registro en el catálogo;
- pasa validación lingüística antes de publicarse.
