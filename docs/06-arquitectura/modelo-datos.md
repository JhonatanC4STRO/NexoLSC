# Modelo de datos

**Versión:** 0.1
**Estado:** Propuesta conceptual

## Relaciones

```mermaid
erDiagram
    INTENT ||--o{ UTTERANCE_EXAMPLE : reconoce
    INTENT ||--|| SIGN_SCRIPT : publica
    SIGN_SCRIPT ||--|{ SCRIPT_STEP : contiene
    SCRIPT_STEP }o--|| SIGN_CLIP : referencia
    SIGN_CLIP }o--|| RIG_VERSION : requiere
    INTENT ||--o{ VALIDATION_RECORD : valida
    SIGN_CLIP ||--o{ VALIDATION_RECORD : valida

    INTENT {
      string id PK
      string purpose
      string status
      string scriptVersion
    }
    UTTERANCE_EXAMPLE {
      string text
      string locale
      boolean positive
    }
    SIGN_SCRIPT {
      string intentId FK
      string version
      string rigVersion FK
      string status
    }
    SCRIPT_STEP {
      int order
      string clipId FK
      number speed
      int holdMs
      string transition
    }
    SIGN_CLIP {
      string id PK
      string actionName
      string rigVersion FK
      int durationMs
      string status
    }
    RIG_VERSION {
      string id PK
      string assetUrl
      string checksum
    }
    VALIDATION_RECORD {
      string targetType
      string targetId
      string version
      date validatedAt
      string result
    }
```

## Ejemplo de intención

```json
{
  "id": "CORTESIA_GRACIAS",
  "purpose": "Expresar agradecimiento",
  "locale": "es-CO",
  "status": "PROPUESTA",
  "examples": {
    "positive": ["gracias", "muchas gracias"],
    "negative": ["no gracias"]
  },
  "scriptVersion": null
}
```

## Ejemplo de guion

```json
{
  "intentId": "CORTESIA_GRACIAS",
  "version": "0.1.0",
  "rigVersion": "avatar-v1",
  "status": "PROPUESTA",
  "steps": [
    {
      "order": 1,
      "clipId": "LSC_CORTESIA_GRACIAS_V1",
      "speed": 1,
      "holdMs": 100,
      "transition": "NEUTRAL_TO_SIGN"
    }
  ]
}
```

Los valores lingüísticos del ejemplo no están validados.

## Reglas de integridad

- Un guion publicado referencia únicamente clips publicados.
- Todos los clips de un guion usan el mismo `rigVersion`.
- Los identificadores y versiones son inmutables después de publicación.
- Los registros de validación no contienen datos personales innecesarios.
- El hash del GLB permite comprobar que se probó el mismo recurso publicado.
