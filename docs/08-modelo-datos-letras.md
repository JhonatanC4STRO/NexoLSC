# 08 · Modelo de datos para las letras

## De la propuesta inicial al modelo recomendado

Propuesta inicial:

```js
{ letter: "A", animation: "sign_A", duration: 1200 }
```

Funciona para el MVP, pero se queda corta en cuanto haya palabras, números, variantes regionales o
validación. El modelo recomendado trata la letra como **un tipo de seña**:

```ts
interface SignEntry {
  id: string;                 // "lsc.letter.A" — estable y único
  kind: 'letter' | 'number' | 'word' | 'phrase' | 'nonmanual';
  gloss: string;              // "A" (glosa en mayúsculas; para palabras: "CASA")
  name: string;               // "a", "eñe", "uve doble" — para mostrar y para lectores de pantalla
  language: 'LSC';
  animation: {
    clip: string;             // "sign_A"
    pack: string;             // "avatar" (fase 2: "saludos", "familia"…)
    durationMs: number;       // tramo principal a 1x
    transitionMs: number;     // transición desde la seña anterior a 1x
  };
  handConfiguration: {
    handshape: string;        // etiqueta de configuración del DBLSC ("A", "5", "Bb"…)
    fingers: string;          // descripción legible, tomada de la fuente
    palmOrientation?: 'forward' | 'backward' | 'inward' | 'outward' | 'up' | 'down' | 'side';
    location?: string;
    hand: 'dominant' | 'non_dominant' | 'both';
  };
  movement: { dynamic: boolean; description?: string };
  description: string;
  sources: { id: string; locator: string }[];   // de dónde sale la configuración
  validation: {
    status: 'draft' | 'in_review' | 'approved' | 'rejected';
    reviewedBy?: string;
    reviewedAt?: string;
    notes?: string;
  };
  tags?: string[];
}
```

Cubre todos los campos que pediste (`letter`, `name`, `animation`, `duration`, `description`,
`hand_configuration`, `source`) y añade `validation`, `movement`, `pack` y `kind`.

## Por qué cada campo añadido

| Campo | Motivo |
|---|---|
| `id` | Referencias estables (analítica, revisiones, traducciones) aunque cambie el nombre del clip |
| `kind` | Un solo modelo para letras, números, palabras y no manuales |
| `gloss` | Convención de la lingüística de lenguas de señas; el DBLSC usa glosas en mayúsculas |
| `animation.pack` | Permite cargar paquetes de animación bajo demanda en la fase 2 sin cambiar el modelo |
| `durationMs` + `transitionMs` | El motor necesita ambos; permiten ajustar el ritmo por seña |
| `handConfiguration.handshape` | Enlaza con la tabla de configuraciones del DBLSC (pp. LI–LII) y con el buscador por configuración de INSOR Educativo |
| `movement.dynamic` | Separa letras con trayectoria (G, H, J, Ñ, S, Z) de las estáticas |
| `sources` | Trazabilidad: nada sin fuente (requisito del proyecto) |
| `validation` | Nada llega a `approved` sin revisión de una persona sorda usuaria de LSC |

## Ejemplos

Letra estática:

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

Letra dinámica:

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

Palabra (fase 2, mismo modelo):

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

## Dónde se guarda

| Fase | Almacenamiento |
|---|---|
| MVP | `src/core/signs/alphabet.lsc.ts` (versionado en git, tipado) |
| Fase 2 | JSON por campo temático en `public/lexicon/*.json` o una API |
| Fase 2–3 | PostgreSQL (tabla `signs` + `sign_sources` + `sign_reviews` + `sign_variants` por región) |

Esquema SQL orientativo para cuando llegue el momento:

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
  region text,                          -- variantes regionales (Bogotá, Valle…)
  updated_at timestamptz default now()
);
create table sign_sources (sign_id text references signs(id), source_id text, locator text);
create table sign_reviews (sign_id text references signs(id), reviewer text, status text, notes text, reviewed_at timestamptz);
```

## Dos archivos de datos por letra

Cada letra vive en dos lugares, con responsabilidades distintas:

| Archivo | Qué describe | Quién lo usa |
|---|---|---|
| `src/core/signs/alphabet.lsc.ts` (`SignEntry`) | **Qué** es la seña: glosa, nombre, clip, duraciones, descripción legible, fuente, validación | La app web (cola, línea de tiempo, vista de respaldo) |
| `assets-src/letters/alfabeto_lsc.json` | **Cómo** la hace el avatar: ángulos de dedos y pulgar, orientación de la mano, trayectoria | `tools/blender/bake_letters.py` al generar los clips de cada avatar |

El vínculo entre ambos es el nombre del clip: la entrada `"L"` del JSON produce la Action `sign_L`, que es
el `animation.clip` de `lsc.letter.L` (la Ñ usa `sign_ENYE`). El formato del JSON está en
[06-animation-clips.md](06-animation-clips.md).

## Estado actual de los datos

Las 27 letras están cargadas con `validation.status = "draft"` en los dos archivos. Las descripciones
`fingers` y los ángulos del JSON son una **lectura de la ilustración** del DBLSC (p. 573); donde la
ilustración deja dudas se marca "(Verificar.)". Ver la tabla completa en
[12-fuentes-alfabeto-lsc.md](12-fuentes-alfabeto-lsc.md).
