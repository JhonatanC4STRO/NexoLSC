# Modelo de datos

**Versión:** 0.2
**Estado:** Propuesta conceptual

## Convenciones

- Los nombres de entidades, relaciones y atributos están en español.
- Los identificadores técnicos omiten tildes y la letra `ñ` para facilitar su uso
  posterior en código y archivos JSON.
- Las claves se describen en español dentro del diagrama.
- Los tiempos expresados en milisegundos utilizan el sufijo `Milisegundos`.

## Relaciones

```mermaid
erDiagram
    INTENCION ||--o{ EJEMPLO_ENUNCIADO : reconoce
    INTENCION ||--|| GUION_SENAS : publica
    GUION_SENAS ||--|{ PASO_GUION : contiene
    PASO_GUION }o--|| ANIMACION_SENA : referencia
    ANIMACION_SENA }o--|| VERSION_ESQUELETO : requiere
    INTENCION ||--o{ REGISTRO_VALIDACION : valida
    ANIMACION_SENA ||--o{ REGISTRO_VALIDACION : valida

    INTENCION {
      texto id "Clave primaria"
      texto proposito
      texto estado
      texto versionGuion
    }
    EJEMPLO_ENUNCIADO {
      texto contenido
      texto configuracionRegional
      booleano positivo
    }
    GUION_SENAS {
      texto idIntencion "Clave foránea: INTENCION"
      texto version
      texto versionEsqueleto "Clave foránea: VERSION_ESQUELETO"
      texto estado
    }
    PASO_GUION {
      entero orden
      texto idAnimacion "Clave foránea: ANIMACION_SENA"
      numero velocidad
      entero pausaMilisegundos
      texto transicion
    }
    ANIMACION_SENA {
      texto id "Clave primaria"
      texto nombreAnimacionBlender
      texto versionEsqueleto "Clave foránea: VERSION_ESQUELETO"
      entero duracionMilisegundos
      texto estado
    }
    VERSION_ESQUELETO {
      texto id "Clave primaria"
      texto ubicacionRecurso
      texto sumaComprobacion
    }
    REGISTRO_VALIDACION {
      texto tipoObjetivo
      texto idObjetivo
      texto version
      fecha fechaValidacion
      texto resultado
    }
```

## Ejemplo de intención

```json
{
  "id": "CORTESIA_GRACIAS",
  "proposito": "Expresar agradecimiento",
  "configuracionRegional": "es-CO",
  "estado": "PROPUESTA",
  "ejemplos": {
    "positivos": ["gracias", "muchas gracias"],
    "negativos": ["no gracias"]
  },
  "versionGuion": null
}
```

## Ejemplo de guion

```json
{
  "idIntencion": "CORTESIA_GRACIAS",
  "version": "0.1.0",
  "versionEsqueleto": "avatar-v1",
  "estado": "PROPUESTA",
  "pasos": [
    {
      "orden": 1,
      "idAnimacion": "LSC_CORTESIA_GRACIAS_V1",
      "velocidad": 1,
      "pausaMilisegundos": 100,
      "transicion": "NEUTRAL_A_SENA"
    }
  ]
}
```

Los valores lingüísticos del ejemplo no están validados.

## Reglas de integridad

- Un guion publicado referencia únicamente animaciones publicadas.
- Todas las animaciones de un guion usan el mismo valor de `versionEsqueleto`.
- Los identificadores y versiones son inmutables después de publicación.
- Los registros de validación no contienen datos personales innecesarios.
- La suma de comprobación del GLB permite verificar que se probó el mismo recurso
  publicado.
