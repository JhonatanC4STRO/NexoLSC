# 08 · Cómo se describe una seña (modelo de datos)

> **En pocas palabras:** cada letra se guarda como una **ficha** con varios datos: qué letra es, cómo se
> llama, qué animación usa, cuánto dura, cómo se pone la mano, de qué libro sale y si ya la revisó una
> persona sorda. Las palabras y los números usarán la misma ficha en el futuro.

## De la idea inicial a la ficha completa

La idea inicial era:

```js
{ letter: "A", animation: "sign_A", duration: 1200 }
```

Sirve para empezar, pero se queda corta cuando haya palabras, números, variantes por región o revisión por
personas sordas. Por eso la letra se guarda como **un tipo de seña** (`SignEntry`):

```ts
interface SignEntry {
  id: string;                 // "lsc.letter.A" — identificador único que no cambia
  kind: 'letter' | 'number' | 'word' | 'phrase' | 'nonmanual';   // letra, número, palabra, frase o gesto
  gloss: string;              // "A" (para palabras: "CASA")
  name: string;               // "a", "eñe", "uve doble" — para mostrar y para lectores de pantalla
  language: 'LSC';
  animation: {
    clip: string;             // "sign_A" — nombre de la animación
    pack: string;             // "avatar" (fase 2: "saludos", "familia"…)
    durationMs: number;       // cuánto dura la seña a velocidad normal
    transitionMs: number;     // cuánto tarda en llegar desde la seña anterior
  };
  handConfiguration: {
    handshape: string;        // forma de la mano según el diccionario DBLSC ("A", "5", "Bb"…)
    fingers: string;          // descripción en palabras, tomada de la fuente
    palmOrientation?: 'forward' | 'backward' | 'inward' | 'outward' | 'up' | 'down' | 'side';
    location?: string;        // dónde se hace (frente al pecho, en la barbilla…)
    hand: 'dominant' | 'non_dominant' | 'both';   // mano principal, la otra o las dos
  };
  movement: { dynamic: boolean; description?: string };   // ¿tiene movimiento? ¿cuál?
  description: string;
  sources: { id: string; locator: string }[];   // de qué libro y página sale
  validation: {
    status: 'draft' | 'in_review' | 'approved' | 'rejected';   // borrador, en revisión, aprobada, rechazada
    reviewedBy?: string;
    reviewedAt?: string;
    notes?: string;
  };
  tags?: string[];
}
```

## Para qué sirve cada dato

| Dato | Para qué |
|---|---|
| `id` | Un nombre fijo para referirse a la seña siempre, aunque cambie su animación |
| `kind` | Una sola ficha para letras, números, palabras y gestos de la cara |
| `gloss` | La **glosa**: la palabra en mayúsculas con la que se escribe una seña. Así lo hace el diccionario DBLSC |
| `animation.pack` | Permite, en la fase 2, descargar paquetes de animaciones solo cuando se usan |
| `durationMs` y `transitionMs` | El reproductor los necesita, y permiten ajustar el ritmo de cada seña |
| `handConfiguration.handshape` | Enlaza con la tabla de formas de mano del diccionario DBLSC |
| `movement.dynamic` | Separa las letras con movimiento (G, H, J, Ñ, S, Z) de las quietas |
| `sources` | Nada sin fuente: siempre se sabe de dónde salió cada seña |
| `validation` | Ninguna seña pasa a «aprobada» sin la revisión de una persona sorda que use la LSC |

## Ejemplos

Una letra quieta, la L:

```json
{
  "id": "lsc.letter.L",
  "kind": "letter",
  "gloss": "L",
  "name": "ele",
  "language": "LSC",
  "animation": { "clip": "sign_L", "pack": "avatar", "durationMs": 600, "transitionMs": 250 },
  "handConfiguration": {
    "handshape": "L",
    "fingers": "Índice extendido hacia arriba y pulgar extendido en horizontal formando una \"L\"; demás dedos cerrados.",
    "hand": "dominant"
  },
  "movement": { "dynamic": false },
  "description": "Letra L del alfabeto manual LSC.",
  "sources": [{ "id": "dblsc-2006", "locator": "Anexos, Alfabeto manual, p. 573" }],
  "validation": { "status": "draft" },
  "tags": ["alfabeto", "dactilologia"]
}
```

Una letra con movimiento, la J:

```json
{
  "id": "lsc.letter.J",
  "gloss": "J",
  "animation": { "clip": "sign_J", "pack": "avatar", "durationMs": 950, "transitionMs": 250 },
  "handConfiguration": { "handshape": "I", "fingers": "Configuración de la I (meñique extendido).", "hand": "dominant" },
  "movement": { "dynamic": true, "description": "El meñique traza una curva descendente en forma de \"J\"." },
  "validation": { "status": "draft" }
}
```

Una palabra (fase 2, con la misma ficha):

```json
{
  "id": "lsc.word.CASA",
  "kind": "word",
  "gloss": "CASA",
  "name": "casa",
  "animation": { "clip": "word_CASA", "pack": "vivienda", "durationMs": 1100, "transitionMs": 300 },
  "handConfiguration": { "handshape": "B", "fingers": "…según la fuente…", "hand": "both" },
  "movement": { "dynamic": true, "description": "…según la fuente…" },
  "sources": [{ "id": "dblsc-2006", "locator": "entrada CASA, p. …" }],
  "validation": { "status": "draft" }
}
```

## Dónde se guardan las fichas

| Etapa | Dónde |
|---|---|
| Hoy | En el código: `src/core/signs/alphabet.lsc.ts` |
| Fase 2 | En archivos de datos por tema (`public/lexicon/*.json`) o en un servicio en internet |
| Fase 2–3 | En una base de datos (PostgreSQL), con tablas para las señas, sus fuentes, sus revisiones y sus variantes por región |

Así podría verse esa base de datos cuando llegue el momento (es solo una guía):

```sql
create table signs (
  id text primary key,                 -- 'lsc.word.CASA'
  kind text not null,
  gloss text not null,
  name text not null,
  clip text not null,
  pack text not null,
  duration_ms int not null,
  transition_ms int not null,
  hand_configuration jsonb not null,
  movement jsonb not null,
  description text,
  validation_status text not null default 'draft',
  region text,                          -- variantes por región (Bogotá, Valle…)
  updated_at timestamptz default now()
);
create table sign_sources (sign_id text references signs(id), source_id text, locator text);
create table sign_reviews (sign_id text references signs(id), reviewer text, status text, notes text, reviewed_at timestamptz);
```

## Dónde está cada parte de una letra

| Dónde | Responde | Quién lo usa |
|---|---|---|
| `src/core/signs/alphabet.lsc.ts` (la ficha `SignEntry`) | **¿Qué** es la seña? Nombre, animación, duración, descripción, fuente y revisión | La página web |
| La animación en `assets-src/avatars/mpfb2/avatar.blend` | **¿Cómo** la hace el avatar? Es **el original**: se perfecciona a mano en Blender | Se exporta al `.glb` que usa la página |

Los une el nombre de la animación: la ficha `lsc.letter.L` pide la animación `sign_L`. La Ñ usa `sign_ENYE`.
Cómo editar las animaciones: [06-animation-clips.md](06-animation-clips.md).

## Cómo están hoy los datos

Las 27 letras están cargadas en los dos archivos y todas están en **borrador** (`draft`). Las descripciones
de la mano y los ángulos salen de **mirar la ilustración** del diccionario DBLSC (pág. 573). Donde la
ilustración deja dudas, la descripción dice «(Verificar.)». La tabla completa está en
[12-fuentes-alfabeto-lsc.md](12-fuentes-alfabeto-lsc.md).
