# 16 · Estrategia para incorporar palabras y frases completas

## Qué se reutiliza del MVP en todas las fases

| Pieza del MVP | Fase 2 (palabras) | Fase 3 (estructura LSC) | Fase 4 (voz) | Fase 5 (cámara) |
|---|---|---|---|---|
| `SignEntry` (modelo de datos) | ✅ `kind: 'word'` | ✅ + pistas no manuales | ✅ | ✅ etiquetas para entrenar |
| `SignRepository` | ✅ pasa a JSON/API | ✅ | ✅ | ✅ |
| `normalizeText` | ✅ + tokenización por palabra | ✅ | ✅ | — |
| `buildQueue` | 🔄 busca palabras antes de deletrear | 🔄 recibe glosas en vez de texto | 🔄 | — |
| `SignPlayer` | ✅ sin cambios | ✅ + pistas paralelas | ✅ | — |
| `ClipDriver` / avatar | ✅ + paquetes bajo demanda | ✅ + morph targets faciales | ✅ | — |
| `SpeechToTextProvider` | ✅ | ✅ | ✅ | — |

## Fase 2 · Texto → palabras → señas

```text
"Mi casa es grande"
   │ normalizeText (conserva los límites de palabra)
   ▼
[MI] [CASA] [ES] [GRANDE]
   │ lematizar (formas → lema): "casas" → CASA, "quiero" → QUERER
   ▼
buildQueue:
   ¿hay seña para la palabra/lema?  ── sí ──► QueueItem(word_CASA)
                │ no
                ▼
         deletrear letra por letra (el MVP actual)
```

Cambios concretos:

1. `buildQueue` intenta primero `repo.find('word', lema)` y solo si falla deletrea. Es un cambio local.
2. Lematización: empezar con un diccionario de formas frecuentes (JSON) y, si hace falta, una librería de
   PLN para español.
3. Expresiones de varias palabras ("buenos días", "por favor"): buscar primero la secuencia más larga.
4. **Paquetes de animación** (`animation.pack`): exportar grupos temáticos (saludos, familia, colores…)
   como GLB sin malla y cargarlos bajo demanda. three.js vincula las pistas por nombre de hueso.
5. **Coarticulación**: entre palabras, la transición se hace hacia la ubicación de la seña siguiente. Para
   señas que tocan el cuerpo (barbilla, pecho), añadir **IK en tiempo real** del brazo hacia puntos de
   referencia del avatar (el DBLSC documenta estos puntos en su Anexo 3).
6. Backend mínimo: panel para gestionar el léxico y el estado de validación (aquí entran Postgres y una
   API). El frontend sigue igual: solo cambia de dónde lee `SignRepository`.

### Producción de animaciones a escala

| Método | Calidad | Costo | Comentario |
|---|---|---|---|
| Animación manual en Blender | Alta si hay buen animador | Alto por seña | Lo del MVP; no escala a miles |
| Captura de movimiento con video + MediaPipe Holistic → retargeting | Media; dedos con ruido | Bajo | Grabar a señantes sordos; limpiar en Blender |
| Captura óptica o guantes de captura | Alta | Alto (equipo) | Para un léxico central de alta calidad |
| Síntesis desde notación (HamNoSys/SiGML, p. ej. JASigning) | Media, robótica | Bajo por seña, alto al inicio | Requiere transcribir cada seña en notación |

Recomendación: animación manual para las primeras 100–200 palabras más frecuentes (validadas), y
explorar captura con video grabando a **personas sordas, con consentimiento y remuneración**.

Priorización del léxico: empezar por los campos temáticos del DBLSC más útiles (saludos, familia,
números, tiempo, lugares) y por las palabras más frecuentes del contexto de uso objetivo.

## Fase 3 · Texto → estructura LSC → secuencia de señas

La LSC tiene su propia gramática (orden, uso del espacio, clasificadores, expresiones no manuales). El
DBLSC lo muestra con glosas: *"Mi abuelo cumplió años el 15 de marzo"* →
`PRO1POS ABUELO HACE POCO QUINCE MARZO CUMPLEAÑOS`.

Arquitectura propuesta:

```text
Español ──► Traductor ──► Representación intermedia (glosas + marcas) ──► buildQueue ──► SignPlayer
             (reglas + modelo de lenguaje,              │
              revisado por personas sordas)              ▼
                                   [{gloss:'PRO1POS'}, {gloss:'ABUELO'}, …,
                                    {nonmanual:'cejas_arriba', span:[3,5]}]
```

- La **representación intermedia en glosas** es el contrato entre el traductor y el reproductor. Permite
  que un intérprete escriba glosas a mano (útil para validar) y probar el avatar sin traductor.
- El reproductor gana **pistas paralelas**: manos (clips), cara (morph targets), cabeza (rotaciones),
  todas sobre el mismo reloj. La cola pasa de una lista a una línea de tiempo con capas:

```ts
interface Timeline {
  manual: QueueItem[];                                  // lo que existe hoy
  nonManual: { track: 'face' | 'head'; clip: string; startItem: number; endItem: number }[];
}
```

- Un traductor automático (reglas o modelo de lenguaje) **siempre** debe marcar su salida como no
  validada y ofrecer que una persona la corrija; los errores de traducción en lengua de señas son un
  problema de accesibilidad real.

## Fase 4 · Voz → texto → LSC → avatar

Ya está prevista: `SpeechToTextProvider` entrega texto y el resto del flujo es el de la fase 3. Solo
se añade el manejo de frases largas (dividir por pausas del reconocimiento).

## Fase 5 · Cámara → reconocimiento de LSC → texto

- Detección de manos y cuerpo en el navegador con MediaPipe (Hands / Holistic): 21 puntos por mano.
- Letras estáticas: clasificador sobre los puntos de la mano (los trabajos de la Universidad de los Llanos
  muestran que es viable para el alfabeto LSC).
- Letras dinámicas y palabras: modelos secuenciales sobre series de puntos.
- Los mismos `SignEntry` sirven de etiquetas; el avatar puede mostrar "esto es lo que entendí".
- Requiere un conjunto de datos propio, con consentimiento informado de las personas grabadas.

## Reglas para no tener que rehacer

1. Nunca poner lógica de LSC dentro de componentes de React o del visor 3D.
2. Todo lo que el avatar hace pasa por `SignEntry` → `QueueItem` → `SignPlayer`.
3. Los nombres de los huesos del avatar son un contrato: si cambias de avatar, conserva los nombres.
4. Cada seña lleva `sources` y `validation`.
5. Las decisiones lingüísticas se toman con personas sordas usuarias de LSC, no solo desde el código.
