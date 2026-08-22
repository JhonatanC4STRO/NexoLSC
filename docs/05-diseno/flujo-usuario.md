# Flujo de usuario

**Versión:** 0.1
**Estado:** Borrador

## Flujo principal por voz

```mermaid
flowchart TD
    A[Inicio / listo] --> B{Elegir entrada}
    B -->|Voz| C[Solicitar permiso de micrófono]
    C -->|Aceptado| D[Grabar máximo 10 s]
    C -->|Rechazado| E[Ofrecer entrada de texto]
    D --> F[Transcribir]
    F -->|Correcto| G[Mostrar texto editable]
    F -->|Error| E
    G --> H{Usuario confirma}
    H -->|Corregir| G
    H -->|Confirmar| I[Identificar intención]
    I -->|Soportada| J[Cargar guion y animaciones]
    I -->|No soportada| K[Mensaje seguro y alternativas]
    J --> L[Reproducir avatar]
    L --> M[Repetir / pausar / lento]
    M --> A
    K --> A
```

## Flujo principal por texto

1. Escribir una frase.
2. Confirmar la frase.
3. Identificar la intención.
4. Reproducir el guion si está validado.
5. Informar con claridad si no está soportado.

## Estados visibles

| Estado | Mensaje sugerido | Acción disponible |
|---|---|---|
| LISTO | “Escribe o mantén presionado para hablar.” | Escribir, grabar |
| GRABANDO | “Escuchando…” | Detener, cancelar |
| TRANSCRIBIENDO | “Convirtiendo voz en texto…” | Cancelar |
| REVISANDO | “Confirma lo que entendimos.” | Editar, repetir |
| TRADUCIENDO | “Preparando la traducción…” | Cancelar |
| CARGANDO | “Cargando el avatar…” | Esperar, reintentar |
| REPRODUCIENDO | “Reproduciendo LSC.” | Pausar, repetir, lento |
| NO_SOPORTADA | “Esta expresión aún no tiene traducción validada.” | Ver opciones |
| ERROR | Mensaje específico y recuperable. | Reintentar, usar texto |

## Principios de interacción

- El usuario siempre ve y puede corregir la transcripción.
- El sistema no reproduce resultados parciales como si estuvieran validados.
- Cada error ofrece una siguiente acción.
- La animación no comienza hasta que el avatar y el guion están listos.
- No se muestran porcentajes de “confianza de traducción” que puedan inducir una
  falsa sensación de precisión.
