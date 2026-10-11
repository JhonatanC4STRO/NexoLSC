# 14 · Plan de trabajo

> **En pocas palabras:** el trabajo está dividido en **9 épicas** (grandes bloques). Las cuatro primeras ya
> están hechas; ahora lo más importante es que **personas sordas validen las 27 letras**. Este documento
> es **el** plan: aquí se marca lo que se termina y se añade lo nuevo.

Una **épica** es un bloque grande de trabajo; dentro tiene **tareas** pequeñas que se pueden terminar en
uno o pocos días. Cada épica termina con algo que se puede probar.

## Cómo usar este plan

- Cuando termines una tarea, cambia `- [ ]` por `- [x]`. Si se termina una épica completa, actualiza
  también la tabla «Cómo va».
- Si aparece trabajo nuevo, añádelo como tarea dentro de su épica (o crea una épica nueva, NX-10…).
- Al publicar una versión, anota en el `CHANGELOG.md` qué tareas se terminaron.

## Cómo va (v0.5.1, 2026-10-09)

| # | Épica | Estado |
|---|---|---|
| NX-1 | Proyecto base | ✅ Hecha |
| NX-2 | Núcleo sin 3D | ✅ Hecha |
| NX-3 | Camino Blender → archivo .glb → navegador | ✅ Hecha |
| NX-4 | El avatar | 🟡 En curso |
| NX-5 | Las 27 letras | 🟡 En curso |
| NX-6 | Validación con la comunidad sorda | ⏳ Por hacer — **es lo siguiente más importante** |
| NX-7 | Pantalla y marca | 🟡 En curso |
| NX-8 | Publicar la página | ⏳ Por hacer |
| NX-9 | Documentación | ✅ Hecha |

## Las épicas y sus tareas

### NX-1 · Proyecto base — ✅

- [x] Crear el proyecto con Vite, React y TypeScript.
- [x] Pruebas automáticas (`npm test`, 15 en verde) y arranque local (`npm run dev`).
- [x] Repositorio en GitHub (`JhonatanC4STRO/NexoLSC`) con versiones y `CHANGELOG.md`.

### NX-2 · Núcleo sin 3D — ✅

- [x] Limpiar el texto, armar la lista de señas y el reproductor con su reloj.
- [x] Controles, línea de letras y botón de voz.
- [x] Vista sin 3D (letra grande con la descripción de la mano).

**Terminada cuando:** escribes «¿Cómo estás?», ves `COMO ESTAS` y las letras avanzan con todos los controles.

### NX-3 · Camino Blender → archivo .glb → navegador — ✅

- [x] Probar el camino completo con un avatar de prueba (solo local).
- [x] Programa de exportación (`export_avatar.py`) que deja solo lo que el navegador necesita.

### NX-4 · El avatar — 🟡

- [x] Selector de avatar en la app.
- [x] Avatar `mpfb2` (licencia libre, realista, 1,71 m), creado por programa (`mpfb_builder.py`).
- [x] Eliminar el avatar caricaturesco (2026-10-08).
- [ ] Decidir el avatar definitivo: quedarse con `mpfb2` o encargar uno estilizado a un artista 3D y
  aplicarle las mismas letras.
- [ ] Medir si un celular de gama media mueve bien el avatar (181 huesos, ~5 MB).
- [ ] (Opcional) Animación de espera: respirar y parpadear.

### NX-5 · Las 27 letras — 🟡

- [x] Primera versión de las 27 letras a partir del dibujo del diccionario DBLSC (pág. 573).
- [x] Aplicadas al avatar; 6 con movimiento (G, H, J, Ñ, S, Z).
- [x] Primera revisión de frente y de lado; corregidas C, O, Q, A, X, H, P, L e Y.
- [x] Las letras pasan a vivir solo en Blender: animaciones limpias (50 controles por letra), comandos
  `npm run avatar:abrir` / `avatar:exportar` y se elimina el archivo de ángulos (v0.5.0).
- [ ] Perfeccionar cada letra a mano en Blender, comparándola con video.
- [ ] Compararlas con los videos de INSOR Educativo, sobre todo F, G, P, Q, S, T y U (ver [12](12-fuentes-alfabeto-lsc.md)).
- [ ] Afinar el pulgar cuando toca otro dedo (O, D, F, T).
- [ ] Probar todas a velocidad 0,5x y 1x en la app.

**Terminada cuando:** las 27 letras están listas para mostrarlas a personas sordas (NX-6).

### NX-6 · Validación con la comunidad sorda — ⏳

- [ ] Contactar a FENASCOL, INSOR, una asociación local o aprendices sordos del SENA; acordar cómo
  participan y pagarles su tiempo.
- [ ] Sesiones con al menos dos personas sordas que usen la LSC desde pequeñas y un intérprete.
- [ ] Anotar el resultado de cada letra (aprobada o rechazada, con notas) en los dos archivos de datos.
- [ ] Resolver las preguntas abiertas: CH, LL y RR, letras repetidas, la seña APARTE y el ritmo.
- [ ] Prueba de comprensión: palabras deletreadas por el avatar que la persona debe reconocer (meta: 9 de
  cada 10 o más).

**Terminada cuando:** las 27 letras están **aprobadas**.

### NX-7 · Pantalla y marca — 🟡

- [x] Marca visual NexoLSC (v0.3.0).
- [x] Foto de la sede del SENA de fondo, desenfocada.
- [x] Mockups con tres opciones y elección de la opción A «Escenario».
- [x] Pantalla «Escenario» en escritorio y celular (v0.4.0).
- [x] Botones de vista de la cámara: Frente, Perfil y Mano (v0.4.0).
- [ ] Ficha de la letra (idea de la opción B): descripción completa, fuente y estado.
- [ ] Modo espejo para practicar.
- [ ] Revisión de accesibilidad con teclado y lector de pantalla.

### NX-8 · Publicar la página — ⏳

- [ ] Hacer más livianos los archivos del avatar (quitar animaciones de huesos que no se mueven y comprimir).
- [ ] Pantalla de carga mientras baja el avatar.
- [ ] Política de privacidad (en Chrome, la voz pasa por servidores de Google; la voz local descarga el
  modelo de Hugging Face y jsDelivr, pero el audio no sale del equipo).
- [x] Despliegue con Docker para Dokploy (`Dockerfile` + `nginx.conf`).
- [x] Voz en Firefox y Brave: Whisper dentro del navegador, con aviso y avance de la descarga.
- [ ] Probar la voz local con micrófono real en Firefox (computador y Android) y en un equipo sencillo.
- [ ] Publicar en un servicio de páginas estáticas con HTTPS.

### NX-9 · Documentación — ✅

- [x] Documentos 01 a 13 y README en lenguaje sencillo, con glosario.
- [x] Diagramas en español, rehechos con la skill «diagram-design» y la marca NexoLSC (`npm run docs:diagramas`).
- [x] Doc 15 generado automáticamente desde el código (`npm run docs:codigo`).
- [x] Este plan de trabajo, organizado en épicas.
- [x] Doc 16 (palabras y frases) en lenguaje sencillo.
- [x] Doc 18: requisitos funcionales y no funcionales, historias de usuario y trazabilidad.
- [ ] Cuando el MVP esté completo: pasar el doc 18 al formato IEEE 830 y adaptar la matriz del SENA
  (`Matris.xlsx`) a NexoLSC.

## Riesgos

| Riesgo | ¿Qué tan probable? | Qué se hace |
|---|---|---|
| Que una letra esté mal interpretada | Media | Todas empiezan en borrador y pasan por la validación (NX-6) |
| Que los dedos se deformen en poses difíciles | Media | Revisarlas de frente y de lado; corregir los datos |
| Que el avatar vaya lento en celulares | Media | Medirlo y, si hace falta, quitar huesos de la cara y animaciones que sobran |
| Que la voz no funcione en Firefox | Resuelta | Whisper dentro del navegador, con aviso antes de descargar |
| Querer traducir frases antes de tiempo | Media | Mantener el alcance: solo deletrear en el MVP |
| No conseguir personas sordas para validar | Media | Contactar pronto a FENASCOL, INSOR y el SENA; tener presupuesto para pagar su tiempo |
| Publicar algo con derechos de autor de otros | Baja | El avatar de prueba no se sube a git; cada avatar tiene su `LICENSE.md` |

## Cuándo está listo el MVP

> «Escribo (o digo) una palabra → el avatar hace bien la seña de cada letra, una por una, y una persona
> sorda que usa la LSC reconoce la palabra.»
