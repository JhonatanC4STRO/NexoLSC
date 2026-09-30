# 14 · Plan de implementación paso a paso

Plan pensado para una persona trabajando a tiempo parcial. Cada etapa termina con algo que se puede
probar.

## Estado actual (v0.2.1, 2026-09-30)

| Etapa | Estado |
|---|---|
| 0 · Proyecto base | ✅ Hecha |
| 1 · Núcleo sin 3D | ✅ Hecha |
| 2 · Pipeline Blender → GLB → navegador | ✅ Hecha |
| 3 · Avatar | 🟡 Dos candidatos CC0 listos; falta elegir definitivo y medir en móvil |
| 4 · Las 27 letras | 🟡 Animadas en borrador en los dos avatares; falta contrastarlas con video |
| 5 · Validación con la comunidad sorda | ⏳ Pendiente (es el siguiente paso importante) |
| 6 · Pulido y publicación | 🟡 Fondo, git y versionado hechos; falta optimizar, accesibilidad y desplegar |

## Etapa 0 · Proyecto base — ✅

- [x] Proyecto Vite + React + TypeScript (ver [15-codigo-inicial.md](15-codigo-inicial.md)).
- [x] `npm install`, `npm test` (15 pruebas en verde), `npm run dev`.
- [x] Repositorio git en GitHub (`JhonatanC4STRO/NexoLSC`) con versionado semántico y `CHANGELOG.md`.

## Etapa 1 · Núcleo sin 3D — ✅

- [x] Normalizador de texto, cola, reproductor, controles, línea de tiempo, voz.
- [x] Vista de respaldo: letra grande + descripción de la configuración.

**Listo cuando:** escribes "¿Cómo estás?", ves `COMO ESTAS` y la línea de tiempo avanza con todos los controles.

## Etapa 2 · Pipeline Blender → GLB → navegador — ✅

- [x] Validado primero con un avatar de prueba (solo local) y luego con los candidatos MPFB.
- [x] `export_avatar.py`: solo huesos `DEF-*`, un clip por Action, limpieza automática.

## Etapa 3 · Avatar — 🟡

- [x] Selector de avatar en la app para comparar candidatos.
- [x] `mpfb2` (CC0, realista, 1,71 m) y `mpfb2-caricatura` (CC0, rasgos del autor, 1,66 m, por defecto).
  Ver [04](04-diseno-avatar.md#1-candidatos-de-avatar).
- [x] Generador reproducible (`tools/blender/mpfb_builder.py`).
- [ ] Elegir el avatar definitivo (o encargar uno estilizado a un artista 3D y aplicarle las mismas letras).
- [ ] Medir rendimiento en un móvil de gama media (181 huesos de deformación).
- [ ] Clip `idle` opcional (respiración/parpadeo).

## Etapa 4 · Las 27 letras — 🟡

- [x] Las 27 letras definidas como datos (`assets-src/letters/alfabeto_lsc.json`) a partir de la
  ilustración del DBLSC (p. 573).
- [x] Horneadas en los dos avatares con `bake_letters.py`; 6 con movimiento (G, H, J, Ñ, S, Z).
- [x] Primera revisión visual de frente y de perfil; corregidas C, O, Q, A, X, H, P, L e Y.
- [ ] Contrastar cada letra con el video de INSOR Educativo, sobre todo las marcadas con ⚠️ en
  [12](12-fuentes-alfabeto-lsc.md) (F, G, P, Q, S, T, U).
- [ ] Afinar los contactos del pulgar (O, D, F, T) y probar todas a 0.5x y 1x en la app.

**Listo cuando:** las 27 letras están listas para la validación (etapa 5).

## Etapa 5 · Validación con la comunidad sorda (1–2 semanas, iterativa) — ⏳

- [ ] Contactar a FENASCOL, INSOR o una asociación local (o aprendices sordos del SENA); acordar la
  participación y remunerarla.
- [ ] Sesiones con al menos dos personas sordas señantes nativas y un intérprete.
- [ ] Registrar resultados en `status`/`validation` de cada letra (`approved` / `rejected` + notas), en el
  JSON de poses y en `alphabet.lsc.ts`.
- [ ] Resolver las preguntas abiertas: dígrafos (CH, LL, RR), letras repetidas, seña APARTE, ritmo.
- [ ] Prueba de comprensión: palabras deletreadas por el avatar que la persona debe reconocer (meta: ≥ 90 %).

**Listo cuando:** las 27 letras están en `approved`.

## Etapa 6 · Pulido y publicación (3–5 días) — 🟡

- [x] Fondo del escenario con la sede del SENA, desenfocado.
- [ ] Reducir el peso de los GLB (~5 MB): eliminar pistas de huesos que no se mueven, comprimir con
  `gltf-transform`; pantalla de carga.
- [ ] Vistas rápidas de cámara (frente/perfil/mano) y modo espejo.
- [ ] Revisión de accesibilidad (teclado, lector de pantalla, contraste).
- [ ] Política de privacidad (voz en Chrome = servidores de Google).
- [ ] Publicar en hosting estático con HTTPS.

## Riesgos

| Riesgo | Probabilidad | Mitigación |
|---|---|---|
| Configuraciones mal interpretadas | Media | Estado `draft` por defecto + etapa 5 |
| Deformación de los dedos en poses extremas | Media | Revisión de frente y de perfil; ajustar datos o pesos |
| Rendimiento en móviles (181 huesos, GLB de 5 MB) | Media | Medir; recortar pistas de animación y huesos faciales si hace falta |
| La voz no funciona en Firefox | Segura | Mensaje claro; Whisper en el navegador como siguiente paso |
| Intentar traducir frases antes de tiempo | Media | Mantener el alcance: solo deletreo en el MVP |
| Falta de acceso a personas sordas para validar | Media | Contactar pronto a FENASCOL/INSOR/SENA; presupuesto para compensar su tiempo |
| Publicar recursos con derechos de terceros | Baja | El avatar de prueba está en `.gitignore`; cada candidato lleva `LICENSE.md` |

## Criterio de éxito del MVP

> "Escribo (o digo) una palabra → el avatar realiza correctamente la seña de cada letra, una por una,
> y una persona sorda usuaria de LSC reconoce la palabra."
