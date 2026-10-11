# 10 · De lo que dices a lo que seña el avatar

> **En pocas palabras:** la voz es **solo otra forma de escribir**. Pulsas «Hablar», dices la palabra, el
> navegador la convierte en texto y ese texto sigue exactamente el mismo camino que si lo hubieras escrito
> (ver [09](09-flujo-texto-letras-avatar.md)). En Chrome, Edge y Safari se usa la voz del navegador; en
> Firefox, Brave y otros que no la tienen, se usa **Whisper dentro del navegador**, avisando antes de
> descargarlo.

![Al pulsar Hablar el navegador escucha; mientras hablas muestra un texto provisional y al terminar el texto entra al campo, se convierte en letras y el avatar las seña.](diagramas/10-voz-avatar.svg)

## Se puede cambiar el motor de voz

Hoy se usa el reconocimiento de voz que trae el navegador. El código lo usa a través de un «enchufe» común
(una interfaz), así que se puede cambiar por otro motor sin tocar el resto:

```ts
interface SpeechToTextProvider {
  readonly name: string;
  isSupported(): boolean;            // ¿funciona en este navegador?
  start(lang: string, callbacks: {
    onInterim?: (text: string) => void;   // texto provisional mientras hablas
    onFinal: (text: string) => void;      // texto final
    onError?: (code: string) => void;     // si algo falla
    onEnd?: () => void;                   // cuando deja de escuchar
  }): () => void;                    // devuelve una función para detener
}
```

Para usar otro motor, se escribe uno que cumpla esta interfaz y se le pasa al botón
(`<SpeechButton provider={…} />`).

## Qué motor se usa en cada navegador

| Navegador | Motor | Qué pasa |
|---|---|---|
| Chrome, Edge, Safari | **Voz del navegador** (Web Speech API) | Funciona al instante, sin descargar nada |
| Firefox, Brave, Opera GX y otros sin voz propia | **Whisper dentro del navegador** | La primera vez avisa y pide permiso para descargar unos 85 MB; después funciona sin descargar |
| Si la voz del navegador falla (por ejemplo, Brave responde «network») | Pasa a **Whisper** | Avisa «La voz del navegador no respondió…» y el siguiente toque usa la voz local |

La elección la hace `pickSpeechProvider()` en `src/speech/speechToText.ts`. Para probar Whisper en Chrome,
abre la página con `?voz=local` al final de la dirección (por ejemplo `http://localhost:5173/?voz=local`).

## Lo que hay que saber del reconocimiento del navegador

| Tema | Detalle |
|---|---|
| Idioma | Español de Colombia (`es-CO`). Si el navegador no lo tiene, usa español general |
| Navegadores | Chrome y Edge: sí. Safari: sí. Firefox: no (ahí se usa Whisper) |
| Privacidad | En Chrome, el audio se envía a servidores de Google para reconocerlo. Hay que decirlo en la política de privacidad |
| Requisitos | La página debe tener HTTPS (o ser `localhost`), y hay que dar permiso al micrófono |
| Errores | Permiso negado, no se oyó nada, sin internet o navegador sin soporte: todos muestran un mensaje en español |
| Forma de uso | Una frase cada vez que pulsas el botón, viendo el texto mientras hablas |

## La voz local: Whisper dentro del navegador

Whisper es un modelo de inteligencia artificial que convierte voz en texto. Aquí corre **dentro del
navegador** con la librería `@huggingface/transformers`, así que **el audio no sale del equipo** y no hace
falta servidor.

### Paso a paso

| # | Qué pasa | Dónde está en el código |
|---|---|---|
| 1 | Pulsas «Hablar». La app revisa si el modelo ya está guardado en el navegador | `pendingDownloadMB()` en `whisperProvider.ts` |
| 2 | **Si no está, avisa antes de descargar nada:** «se descarga una sola vez (unos 85 MB, mejor con wifi) y queda guardado. Tu voz no sale de tu equipo». Puedes elegir «Descargar y hablar» o «Ahora no» | `SpeechButton.tsx` |
| 3 | Descarga el modelo mostrando el avance («34 de 85 MB»). Se puede cancelar tocando el micrófono | `whisper.worker.ts` |
| 4 | Graba. **Se detiene sola** cuando haces una pausa de 1,2 segundos después de hablar (o a los 15 segundos). Si en 7 segundos no oye nada, avisa «No se detectó voz» | `record()` en `whisperProvider.ts` |
| 5 | Convierte el audio en texto en un *worker* (un proceso aparte), para que el avatar y los botones no se congelen | `whisper.worker.ts` |
| 6 | El texto entra al campo y el avatar lo seña, igual que con la voz del navegador | `App.tsx` → `spell(text)` |

### Datos del modelo

| Tema | Detalle |
|---|---|
| Modelo | `onnx-community/whisper-base`, comprimido (q8), en español |
| Descarga | Unos **85 MB** la primera vez (modelo 77 MB + motor 7 MB). Ocupa unos 107 MB guardado en el navegador |
| De dónde se descarga | El modelo, de Hugging Face; el motor (ONNX Runtime), de jsDelivr. Hay que decirlo en la política de privacidad |
| Rapidez medida | Unos **2 segundos** para una frase corta en un computador de 12 núcleos. Sin el aislamiento (ver abajo), unos 9 segundos |
| Errores | Sin micrófono, permiso negado, no se oyó nada o no se pudo descargar: todos con mensaje en español |
| Frases inventadas | Con silencio o ruido, Whisper a veces «inventa» frases de subtítulos («Subtítulos realizados por la comunidad de Amara.org»). La app las descarta, y solo convierte el audio si detectó voz |

### Por qué la página envía encabezados de «aislamiento»

El motor de Whisper es mucho más rápido si puede usar **varios núcleos del procesador**. Los navegadores
solo lo permiten si la página está «aislada», y eso se activa con dos encabezados que envía el servidor:

```text
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: credentialless
```

Están en `nginx.conf` (producción) y en `vite.config.ts` (`npm run dev` y `npm run preview`). El valor
`credentialless` deja cargar sin cambios las fuentes de Google y el modelo de Hugging Face. Safari no lo
entiende, pero no pasa nada: en Safari se usa la voz del navegador.

## Otras opciones que se revisaron

| Opción | Cómo funciona | A favor | En contra |
|---|---|---|---|
| **Whisper en el VPS** | La página envía el audio a un servicio de voz en nuestro propio servidor | Funciona en cualquier navegador sin descargas | Ocupa recursos del servidor, hay que protegerlo y el audio sale del equipo |
| **Servicio de voz en la nube** (Google, Azure, Deepgram, OpenAI…) | El audio se envía a un servicio que devuelve el texto | Muy preciso y funciona en cualquier navegador | Necesita un pequeño servidor para guardar la clave, cuesta por minuto y hay que cuidar los datos |

## Decisiones sobre la experiencia

- Al terminar de hablar, el texto aparece en el campo (así puedes ver y corregir errores) y **se reproduce
  solo**. Si en las pruebas con personas eso molesta, se cambiará a «confirmar antes de reproducir».
- Mientras escucha, el botón se pone rojo y dice «Escuchando… (toca para detener)». Con Whisper, tocarlo
  termina la grabación y convierte lo que se alcanzó a decir.
- **Nunca se descarga el modelo sin avisar.** El aviso dice el tamaño, que se descarga una sola vez y que
  la voz no sale del equipo.
- El reconocimiento puede escribir los números con cifras («tengo 3 gatos»). Hoy los números no se señan y
  se avisa; ver [11](11-manejo-caracteres-especiales.md).

## En el futuro (fase 4)

Cuando el proyecto traduzca frases completas a LSC, la parte de la voz no cambia. Solo cambia lo que pasa
después de tener el texto: en vez de deletrearlo, pasará por el traductor de la fase 3.
