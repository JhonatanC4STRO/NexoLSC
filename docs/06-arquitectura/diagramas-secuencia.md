# Diagramas de secuencia y estados

**Versión:** 0.1
**Estado:** Propuesta

## Secuencia de voz a avatar

```mermaid
sequenceDiagram
    actor U as Usuario
    participant W as Aplicación web
    participant A as Backend API
    participant S as Servicio STT
    participant T as Motor de traducción
    participant P as Reproductor 3D

    U->>W: Inicia y detiene grabación
    W->>A: POST /transcriptions (audio)
    A->>A: Valida formato, tamaño y duración
    A->>S: Envía audio temporal
    S-->>A: Transcripción
    A-->>W: Texto
    W-->>U: Muestra texto editable
    U->>W: Confirma o corrige
    W->>A: POST /translations (texto)
    A->>T: Identificar intención
    alt intención validada
        T-->>A: Intención + guion versionado
        A-->>W: Resultado soportado
        W->>P: Reproducir pasos
        P-->>U: Animación LSC
    else no soportada
        T-->>A: NO_SOPORTADA
        A-->>W: Mensaje seguro
        W-->>U: Editar o elegir una opción
    end
```

## Máquina de estados de la interfaz

```mermaid
stateDiagram-v2
    [*] --> LISTO
    LISTO --> GRABANDO: iniciar voz
    LISTO --> REVISANDO: escribir texto
    GRABANDO --> TRANSCRIBIENDO: detener
    GRABANDO --> LISTO: cancelar
    TRANSCRIBIENDO --> REVISANDO: texto recibido
    TRANSCRIBIENDO --> ERROR: fallo
    REVISANDO --> TRADUCIENDO: confirmar
    REVISANDO --> GRABANDO: volver a grabar
    TRADUCIENDO --> CARGANDO: soportada
    TRADUCIENDO --> NO_SOPORTADA: desconocida
    TRADUCIENDO --> ERROR: fallo
    CARGANDO --> REPRODUCIENDO: recursos listos
    CARGANDO --> ERROR: clip faltante
    REPRODUCIENDO --> PAUSADO: pausar
    PAUSADO --> REPRODUCIENDO: continuar
    REPRODUCIENDO --> LISTO: finalizar
    NO_SOPORTADA --> REVISANDO: editar
    NO_SOPORTADA --> LISTO: cancelar
    ERROR --> LISTO: recuperar
```

## Secuencia de publicación de una seña

```mermaid
sequenceDiagram
    participant D as Desarrollador/animador
    participant V as Validador LSC
    participant B as Blender
    participant C as Catálogo

    D->>V: Presenta intención y contexto
    V-->>D: Guion/referencia acordada
    D->>B: Crea Action
    D->>V: Muestra render o visor
    alt requiere ajustes
        V-->>D: Correcciones
        D->>B: Ajusta animación
    else aprobada
        V-->>D: Registra aprobación de versión
        D->>C: Publica clip y metadatos
    end
```
