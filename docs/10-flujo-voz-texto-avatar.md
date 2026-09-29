# 10 · Flujo Voz → texto → letras → avatar

## Idea

La voz es **solo otra forma de escribir**. Tras el reconocimiento, el texto entra exactamente por el
mismo camino que si se hubiera tecleado (ver [09](09-flujo-texto-letras-avatar.md)).

```text
🎤 Hablar
   │
   ▼
SpeechToTextProvider.start('es-CO')      ← Web Speech API (MVP)
   │  onInterim("ho…")  → se muestra en gris mientras hablas
   │  onFinal("Hola")
   ▼
setText("Hola") + spell("Hola")          ← el mismo spell() del botón Reproducir
   │
   ▼
H → O → L → A → avatar
```

## Interfaz de proveedor

```ts
interface SpeechToTextProvider {
  readonly name: string;
  isSupported(): boolean;
  start(lang: string, callbacks: {
    onInterim?: (text: string) => void;
    onFinal: (text: string) => void;
    onError?: (code: string) => void;
    onEnd?: () => void;
  }): () => void;          // devuelve "stop"
}
```

El MVP trae `webSpeechProvider`. Cambiar de motor = implementar esta interfaz y pasarla a
`<SpeechButton provider={…} />`.

## Web Speech API: lo que hay que saber

| Tema | Detalle |
|---|---|
| Idioma | `es-CO` (español de Colombia). Si un navegador no lo tiene, suele caer a `es` |
| Soporte | Chrome y Edge: sí. Safari: sí, con prefijo `webkit`. **Firefox estable: no** |
| Privacidad | En Chrome el audio se procesa en servidores de Google. Hay que decirlo en la política de privacidad |
| Requisitos | HTTPS (o `localhost`) y permiso de micrófono |
| Errores manejados | `not-allowed` (permiso denegado), `no-speech`, `network`, `not-supported` → mensaje en español |
| Modo | `continuous = false`, `interimResults = true`: una frase por pulsación, con vista previa |

## Firefox y privacidad: alternativas

| Opción | Cómo | Ventajas | Costos |
|---|---|---|---|
| **Whisper en el navegador** (`@huggingface/transformers`, modelo `whisper-tiny`/`base` multilingüe) | Grabar con `MediaRecorder` → transcribir en un Web Worker (WebGPU o WASM) | Funciona en Firefox, sin servidor, el audio no sale del equipo | Descarga inicial de decenas a cientos de MB; más lento en equipos modestos |
| **API de voz en la nube** (Google, Azure, Deepgram, OpenAI…) | Función serverless que recibe el audio | Precisión alta, cualquier navegador | Requiere backend mínimo (para no exponer la clave), costo por minuto, política de datos |

**Recomendación:** MVP con Web Speech API + mensaje claro en navegadores sin soporte ("Usa Chrome o
Edge, o escribe el texto"). Como primera mejora, añadir Whisper en el navegador como proveedor
alternativo cuando `webSpeechProvider.isSupported()` sea falso.

## Decisiones de UX

- Al terminar de hablar, el texto aparece en el campo (el usuario puede ver y corregir errores de
  reconocimiento) y **se reproduce automáticamente**. Si en pruebas con usuarios molesta, cambiar a
  "confirmar antes de reproducir".
- Mientras escucha, el botón cambia a rojo: "⏺ Escuchando… (toca para detener)".
- El reconocimiento puede escribir números como dígitos ("tengo 3 gatos" → "tengo 3 gatos"). En el MVP
  los números se omiten y se avisa; ver [11](11-manejo-caracteres-especiales.md).

## Fase 4 (futuro)

En la fase 4 (voz → texto → LSC → avatar), el proveedor de voz no cambia: solo cambia lo que ocurre
después de `onFinal` (el texto pasa por el traductor de la fase 3 en vez del deletreador).
