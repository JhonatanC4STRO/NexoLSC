# 14 · Plan de implementación paso a paso

Plan pensado para una persona trabajando a tiempo parcial. Cada etapa termina con algo que se puede
probar. Las etapas 0–2 ya están **resueltas en el código inicial** y validadas con tu avatar.

## Etapa 0 · Proyecto base (½ día) — ✅ resuelto en el código inicial

- [ ] Crear el proyecto con los archivos de [15-codigo-inicial.md](15-codigo-inicial.md).
- [ ] `npm install`, `npm test` (15 pruebas en verde), `npm run dev`.
- [ ] Inicializar git y subir a un repositorio privado.

**Listo cuando:** la app abre en `localhost` y muestra la vista de respaldo (sin GLB).

## Etapa 1 · Núcleo sin 3D (1–2 días) — ✅ resuelto

- Normalizador de texto, cola, reproductor, controles, línea de tiempo, voz.
- Vista de respaldo: letra grande + descripción de la configuración.

**Listo cuando:** escribes "¿Cómo estás?", ves `COMO ESTAS` y la línea de tiempo avanza con todos los controles.

## Etapa 2 · Pipeline Blender → GLB → navegador (1–2 días) — ✅ validado con tu avatar

- Copiar tu `.blend` a `assets-src/avatar/`.
- Crear las Actions `rest`, `sign_A`, `sign_L` (poses de prueba).
- Exportar con `tools/blender/export_avatar.py` a `public/models/avatar.glb`.

**Listo cuando:** "ALLA" mueve el avatar A → L → L → A. *(Probado: funciona, sin errores en consola.)*

## Etapa 3 · Avatar definitivo (1–3 semanas, en paralelo con la 4)

- [ ] Elegir la fuente del avatar legal (MPFB2, Human Base Meshes, VRoid o encargo). Ver [04](04-diseno-avatar.md).
- [ ] Rig Rigify con metacarpianos; escala 1,7 m; pesos limitados a 4 influencias.
- [ ] Pruebas de deformación en las poses difíciles (A, E, M, N, O, R, P).
- [ ] Clip `rest` y, opcionalmente, `idle`.

**Listo cuando:** el nuevo `avatar.glb` reemplaza al de prueba sin cambiar una sola línea de código.

> Mientras tanto se puede seguir animando letras sobre tu avatar actual: si el nuevo usa los mismos
> nombres de huesos (Rigify), las poses se pueden transferir.

## Etapa 4 · Las 27 letras (2–3 semanas)

Orden sugerido (de más fácil a más difícil, para aprender el flujo):

1. Estáticas con dedos extendidos: B, L, Y, V, W, I, D
2. Estáticas de puño: A, E, M, N, X, R
3. Estáticas curvas o con orientación especial: C, O, Q, K, P, F, T, U
4. Dinámicas: J, Z, S, H, G, Ñ

Por cada letra:

- [ ] Pose contra la ilustración del DBLSC (p. 573) + video de INSOR Educativo.
- [ ] Action `sign_X` (1 fotograma o 24–30 si es dinámica).
- [ ] Render frente/perfil para revisión.
- [ ] Exportar y probar en la app a 0.5x y 1x.

**Listo cuando:** ninguna letra aparece con borde discontinuo en la línea de tiempo.

## Etapa 5 · Validación con la comunidad sorda (1–2 semanas, iterativa)

- [ ] Contactar a FENASCOL, INSOR o una asociación local; acordar la participación (y remunerarla).
- [ ] Sesiones con al menos dos personas sordas señantes nativas y un intérprete.
- [ ] Registrar resultados en `validation` de cada letra (`approved` / `rejected` + notas).
- [ ] Resolver las preguntas abiertas: dígrafos (CH, LL, RR), letras repetidas, seña APARTE, ritmo.
- [ ] Prueba de comprensión: palabras deletreadas por el avatar que la persona debe reconocer (meta: ≥ 90 %).

**Listo cuando:** las 27 letras están en `approved`.

## Etapa 6 · Pulido y publicación (3–5 días)

- [ ] Comprimir el GLB (`gltf-transform`), precargar el avatar, pantalla de carga.
- [ ] Vistas rápidas de cámara (frente/perfil/mano) y modo espejo.
- [ ] Revisión de accesibilidad (teclado, lector de pantalla, contraste).
- [ ] Política de privacidad (voz en Chrome = servidores de Google).
- [ ] Publicar en hosting estático con HTTPS.

## Riesgos

| Riesgo | Probabilidad | Mitigación |
|---|---|---|
| Uso del avatar de Miles Morales en público | Alta si no se cambia | Etapa 3 obligatoria antes de publicar |
| Configuraciones mal interpretadas | Media | Estado `draft` por defecto + etapa 5 |
| Deformación pobre de los dedos en la malla | Media | Elegir un avatar con buena topología de manos; pruebas de poses extremas |
| La voz no funciona en Firefox | Segura | Mensaje claro; Whisper en el navegador como siguiente paso |
| Intentar traducir frases antes de tiempo | Media | Mantener el alcance: solo deletreo en el MVP |
| Falta de acceso a personas sordas para validar | Media | Contactar pronto a FENASCOL/INSOR; presupuesto para compensar su tiempo |

## Criterio de éxito del MVP

> "Escribo (o digo) una palabra → el avatar realiza correctamente la seña de cada letra, una por una,
> y una persona sorda usuaria de LSC reconoce la palabra."
