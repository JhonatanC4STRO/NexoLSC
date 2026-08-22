# Modelo de datos

**Versión:** 0.1
**Estado:** Propuesta conceptual

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
      string id PK
      string proposito
      string estado
      string versionGuion
    }
    EJEMPLO_ENUNCIADO {
      string texto
      string configuracionRegional
      boolean positivo
    }
    GUION_SENAS {
      string idIntencion FK
      string version
      string versionEsqueleto FK
      string estado
    }
    PASO_GUION {
      int orden
      string idAnimacion FK
      number velocidad
      int pausaMs
      string transicion
    }
    ANIMACION_SENA {
      string id PK
      string nombreAccion
      string versionEsqueleto FK
      int duracionMs
      string estado
    }
    VERSION_ESQUELETO {
      string id PK
      string urlRecurso
      string sumaComprobacion
    }
    REGISTRO_VALIDACION {
      string tipoObjetivo
      string idObjetivo
      string version
      date validadoEn
      string resultado
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
      "pausaMs": 100,
      "transicion": "NEUTRAL_A_SENA"
    }
  ]
}
```

Los valores lingüísticos del ejemplo no están validados.

## Reglas de integridad

- Un guion publicado referencia únicamente animaciones publicadas.
- Todos las animaciones de un guion usan el mismo `versionEsqueleto`.
- Los identificadores y versiones son inmutables después de publicación.
- Los registros de validación no contienen datos personales innecesarios.
- El suma de comprobación del GLB permite comprobar que se probó el mismo recurso publicado.
