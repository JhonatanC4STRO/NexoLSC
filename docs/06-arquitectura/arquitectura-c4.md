# Arquitectura C4

**Versión:** 0.2
**Estado:** Propuesta

## Nivel 1: contexto

```mermaid
flowchart LR
    Emisor[Emisor hispanohablante]
    Receptor[Receptor usuario de LSC]
    Sistema[Sistema Traductor Español–LSC]
    TranscripcionAutomatica[Servicio de transcripción]
    Validador[Validador lingüístico externo]

    Emisor -->|Voz, texto y confirmación| Sistema
    Sistema -->|Avatar y estado| Receptor
    Sistema -->|Audio temporal| TranscripcionAutomatica
    TranscripcionAutomatica -->|Transcripción| Sistema
    Validador -->|Aprueba guiones y animaciones fuera de la app| Sistema
```

## Nivel 2: contenedores

```mermaid
flowchart TB
    subgraph Navegador
        InterfazUsuario[Interfaz: React + TypeScript]
        Reproductor[Reproductor: React Three Fiber / Three.js]
    end

    subgraph Servidor
        API[API Fastify + TypeScript]
        MotorTraduccion[Motor de intenciones y guiones]
        Catalogo[Catálogos JSON versionados]
    end

    TranscripcionAutomatica[API de transcripción]
    Recursos[Archivos estáticos GLB]

    InterfazUsuario -->|Audio o texto| API
    API -->|Audio temporal| TranscripcionAutomatica
    TranscripcionAutomatica -->|Texto| API
    API --> MotorTraduccion
    MotorTraduccion --> Catalogo
    API -->|Intención y guion| InterfazUsuario
    InterfazUsuario --> Reproductor
    Reproductor --> Recursos
```

## Responsabilidades

### Aplicación web

- Solicitar permiso y capturar audio.
- Mostrar transcripción editable.
- Gestionar estados de la interacción.
- Cargar el avatar y reproducir el guion.
- No contener claves privadas.

### Servidor API

- Validar tamaño, formato y duración del audio.
- Proteger la clave del proveedor de transcripción.
- Normalizar texto de forma limitada.
- Clasificar intenciones soportadas.
- Entregar únicamente guiones publicados.
- Eliminar audio temporal y emitir errores seguros.

### Motor de traducción

- Operar de manera determinista sobre el catálogo aprobado.
- Distinguir intención soportada de entrada desconocida.
- Verificar compatibilidad entre guion, animaciones y esqueleto de animación.
- No generar libremente secuencias de LSC.

### Catálogos

- Ser la fuente de verdad de intenciones, guiones y animaciones.
- Mantener versión, estado y trazabilidad lingüística.
- Permanecer como JSON durante el PMV.

## Estructura del repositorio

La distribución concreta de aplicaciones, módulos, catálogos, pruebas y recursos
3D se define en [Estructura del proyecto](estructura-proyecto.md). La propuesta
mantiene la interfaz y el servidor dentro de un repositorio único, pero evita que
una aplicación importe detalles internos de la otra.

## Despliegue inicial

Una aplicación web estática y una API Node desplegada como un único servicio o
dos servicios simples. Los GLB pueden servirse como archivos estáticos. No se
incorporan colas, microservicios, almacenamiento de objetos ni base de datos hasta
que una necesidad medida lo justifique.

## Límites de confianza

- Navegador: entrada no confiable.
- Servidor: único lugar con secretos.
- Proveedor transcripción automática: tercero que procesa audio bajo sus términos.
- Catálogo publicado: contenido confiable solo después de validación.
