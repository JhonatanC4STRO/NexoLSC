# 18 · Requisitos e historias de usuario

> **En pocas palabras:** aquí está **qué debe hacer NexoLSC** (requisitos) y **para quién lo hace**
> (historias de usuario). Cada historia dice cómo saber si está lista (criterios de aceptación) y a qué
> épica del [plan de trabajo](14-plan-implementacion.md) pertenece. Más adelante, este documento será la
> base del documento IEEE 830 y de la matriz de trazabilidad del SENA.

Si una palabra técnica no te queda clara, búscala en el [glosario](17-glosario.md).

## Cómo leer este documento

| Palabra | Qué significa | Ejemplo |
|---|---|---|
| **Requisito funcional** (RF) | Algo que la app **hace** | «Cambiar la velocidad de 0,5x a 2x» |
| **Requisito no funcional** (RNF) | **Cómo** debe hacerlo: rapidez, accesibilidad, privacidad, licencias… | «Funcionar sin servidor» |
| **Historia de usuario** (HU) | Lo que una persona quiere lograr, contado desde su lado: *Como… quiero… para…* | «Como aprendiz de LSC quiero ir más despacio para ver la forma de la mano» |
| **Criterio de aceptación** | Cómo se comprueba que una historia está lista: *Dado… cuando… entonces…* | «Dado que elegí 0,5x, cuando reproduzco HOLA, entonces cada letra dura el doble» |

**Prioridad**

- **Imprescindible:** sin esto no hay MVP.
- **Importante:** el MVP funciona sin esto, pero queda incompleto.
- **Deseable:** mejora la experiencia; puede esperar.

**Estado:** ✅ hecho · 🟡 en curso · ⏳ por hacer. Los estados son los de la versión **v0.5.1
(2026-10-09)**.

## Quiénes usan NexoLSC

| Perfil | Quién es | Qué necesita |
|---|---|---|
| **Persona oyente** | Familiar, docente, compañero o compañera del SENA, funcionario de atención al público | Mostrar rápido cómo se deletrea una palabra o un nombre en LSC |
| **Aprendiz de LSC** | Alguien que está aprendiendo el alfabeto manual | Ver la mano despacio, desde varios ángulos y las veces que quiera |
| **Persona sorda** | Usa la LSC como su lengua | Entender lo que el avatar deletrea y saber si las letras son confiables |
| **Validador** | Persona sorda que usa la LSC desde pequeña, o intérprete, que revisa las letras | Revisar cada letra y dejar su resultado anotado |
| **Equipo de contenido** | Quien anima las letras en Blender | Corregir una letra y verla en la página sin pasos complicados |

## Requisitos funcionales

### Escribir o decir el texto

| ID | La app debe… | Prioridad | Estado | Épica | Detalle |
|---|---|---|---|---|---|
| RF-01 | Recibir una palabra o frase escrita (hasta 200 caracteres) y deletrearla al pulsar **Reproducir** o Enter | Imprescindible | ✅ | NX-2 | [09](09-flujo-texto-letras-avatar.md) |
| RF-02 | Recibir el texto por voz en español de Colombia: mostrar lo que va entendiendo, ponerlo en el campo y reproducirlo solo | Importante | ✅ | NX-2 | [10](10-flujo-voz-texto-avatar.md) |
| RF-03 | Explicar en español qué pasó cuando la voz falla (sin permiso, no se oyó nada, sin internet, navegador sin voz) e invitar a escribir | Importante | ✅ | NX-2 | [10](10-flujo-voz-texto-avatar.md) |
| RF-29 | Ofrecer **voz local** (Whisper dentro del navegador) donde el navegador no trae voz o su voz falla (Firefox, Brave): **avisar el tamaño y pedir permiso antes de descargar**, mostrar el avance y detener la grabación sola al hacer una pausa | Importante | ✅ | NX-8 | [10](10-flujo-voz-texto-avatar.md) |

### Limpiar el texto

| ID | La app debe… | Prioridad | Estado | Épica | Detalle |
|---|---|---|---|---|---|
| RF-04 | Pasar a mayúsculas y quitar tildes y diéresis, **conservando la Ñ** | Imprescindible | ✅ | NX-2 | [11](11-manejo-caracteres-especiales.md) |
| RF-05 | Convertir espacios y signos en pausas (450 ms entre palabras, 550 ms por coma, 850 ms al final de una oración) e ignorar `¿ ¡`, comillas y paréntesis | Imprescindible | ✅ | NX-2 | [11](11-manejo-caracteres-especiales.md) |
| RF-06 | Omitir lo que todavía no tiene seña (números, emojis, símbolos, otros alfabetos) y avisarlo en «Omitidos (sin seña en el MVP): …» | Imprescindible | ✅ | NX-2 | [11](11-manejo-caracteres-especiales.md) |
| RF-07 | Mostrar «Se deletreará: …» con el texto ya limpio | Importante | ✅ | NX-2 | [09](09-flujo-texto-letras-avatar.md) |

### Deletrear con el avatar

| ID | La app debe… | Prioridad | Estado | Épica | Detalle |
|---|---|---|---|---|---|
| RF-08 | Hacer con el avatar 3D cada una de las **27 letras** del alfabeto manual de la LSC, en orden y pasando suavemente de una a otra | Imprescindible | 🟡 hechas, falta perfeccionarlas | NX-5 | [06](06-animation-clips.md) |
| RF-09 | Dar más tiempo a las letras con movimiento (G, H, J, Ñ, S, Z): 1.200 ms en vez de 850 ms | Imprescindible | ✅ | NX-2 | [07](07-animation-queue.md) |
| RF-10 | Marcar las letras repetidas (como la LL de «Allá») acercando la mano un momento al reposo entre las dos | Importante | ✅ | NX-2 | [11](11-manejo-caracteres-especiales.md) |

### Controlar la reproducción

| ID | La app debe… | Prioridad | Estado | Épica | Detalle |
|---|---|---|---|---|---|
| RF-11 | Reproducir, pausar, continuar, detener y reiniciar | Imprescindible | ✅ | NX-2 | [07](07-animation-queue.md) |
| RF-12 | Ir a la letra anterior o siguiente, y saltar a cualquier letra tocándola en la línea de letras | Importante | ✅ | NX-2 | [07](07-animation-queue.md) |
| RF-13 | Cambiar la velocidad (0,5x, 0,75x, 1x, 1,25x, 1,5x, 2x) al instante, incluso a mitad de una letra | Imprescindible | ✅ | NX-2 | [07](07-animation-queue.md) |
| RF-14 | Repetir la palabra sin parar (modo **Repetir**) | Importante | ✅ | NX-2 | [07](07-animation-queue.md) |
| RF-15 | Atajos de teclado: `Espacio` reproduce o pausa, `←` `→` cambian de letra, `R` reinicia | Importante | ✅ | NX-7 | [13](13-diseno-interfaz.md) |

### Lo que muestra la pantalla

| ID | La app debe… | Prioridad | Estado | Épica | Detalle |
|---|---|---|---|---|---|
| RF-16 | Mostrar la letra actual en grande, su posición («3 de 4 · HOLA») y cómo se pone la mano | Imprescindible | ✅ | NX-2 | [13](13-diseno-interfaz.md) |
| RF-17 | Mostrar la línea de letras: la actual en amarillo, las ya señadas en verde claro y las que no tienen animación con borde punteado | Importante | ✅ | NX-2 | [13](13-diseno-interfaz.md) |
| RF-18 | Mostrar el estado de las letras («Borrador · 0 de 27 letras validadas»), calculado solo | Imprescindible | ✅ | NX-7 | [13](13-diseno-interfaz.md) |
| RF-19 | Mostrar la **ficha de la letra**: descripción completa, fuente y estado de validación | Deseable | ⏳ | NX-7 | [13](13-diseno-interfaz.md) |

### Cámara y avatar

| ID | La app debe… | Prioridad | Estado | Épica | Detalle |
|---|---|---|---|---|---|
| RF-20 | Ofrecer las vistas **Frente**, **Perfil** y **Mano**, y dejar girar la cámara con el mouse o el dedo | Importante | ✅ | NX-7 | [13](13-diseno-interfaz.md) |
| RF-21 | Dejar elegir el avatar, recordar la elección y mostrar su licencia | Deseable | ✅ | NX-4 | [04](04-diseno-avatar.md) |
| RF-22 | Ofrecer un **modo espejo** para practicar | Deseable | ⏳ | NX-7 | [13](13-diseno-interfaz.md) |
| RF-30 | En el celular, **plegar el panel** de abajo para ver el avatar en pantalla completa: a mano («Ocultar panel» / «Escribir») y solo al reproducir | Importante | ✅ | NX-7 | [13](13-diseno-interfaz.md) |

### Seguir funcionando aunque falte algo

| ID | La app debe… | Prioridad | Estado | Épica | Detalle |
|---|---|---|---|---|---|
| RF-23 | Seguir funcionando si falta algo. Sin avatar: muestra la letra en grande con la descripción. Sin la animación de una letra: el avatar queda en reposo y la letra se marca. Sin foto de fondo: fondo liso | Importante | ✅ | NX-2 | [01](01-arquitectura-mvp.md) |

### Taller de contenido y validación

| ID | El proyecto debe… | Prioridad | Estado | Épica | Detalle |
|---|---|---|---|---|---|
| RF-24 | Abrir el avatar en Blender y exportarlo para la página con un comando (`npm run avatar:abrir` / `avatar:exportar`) | Imprescindible | ✅ | NX-3 | [06](06-animation-clips.md) |
| RF-25 | Guardar, en la ficha de cada letra, de dónde sale (`sources`) y su estado: borrador, en revisión, aprobada o rechazada | Imprescindible | ✅ | NX-2 | [08](08-modelo-datos-letras.md) |
| RF-26 | Anotar el resultado de cada validación (quién revisó, cuándo y sus notas) | Imprescindible | ⏳ | NX-6 | [12](12-fuentes-alfabeto-lsc.md) |

### Publicar

| ID | La app debe… | Prioridad | Estado | Épica | Detalle |
|---|---|---|---|---|---|
| RF-27 | Mostrar una pantalla de carga mientras baja el avatar | Importante | ⏳ | NX-8 | [14](14-plan-implementacion.md) |
| RF-28 | Tener una política de privacidad que diga que, en Chrome, la voz pasa por servidores de Google | Imprescindible | ⏳ | NX-8 | [10](10-flujo-voz-texto-avatar.md) |

## Requisitos no funcionales

| ID | Tipo | La app debe… | Cómo se mide | Estado | Épica |
|---|---|---|---|---|---|
| RNF-01 | Arquitectura | Funcionar **sin servidor**, toda en el navegador, y poder publicarse en un servicio de páginas estáticas | `npm run build` crea `dist/` y la página funciona sola | ✅ | NX-1 |
| RNF-02 | Seguridad | Publicarse con **HTTPS** (sin él, el micrófono no funciona) | La dirección publicada tiene el candado | ⏳ | NX-8 |
| RNF-03 | Compatibilidad | Funcionar en Chrome, Edge, Safari y Firefox, **con voz en todos** (en Firefox y Brave, con la voz local) | Prueba manual en cada navegador | 🟡 falta probar con micrófono real en Firefox | NX-8 |
| RNF-04 | Rendimiento | Mover el avatar con fluidez en un computador y en un celular de gama media | Meta propuesta: 30 cuadros por segundo o más en un celular de gama media (por medir) | ⏳ | NX-4 |
| RNF-05 | Rendimiento | Descargar el avatar en un tiempo razonable | Archivo del avatar más liviano que los ~5 MB de hoy (meta por definir al medir) | ⏳ | NX-8 |
| RNF-06 | Accesibilidad | Usarse con teclado y lector de pantalla, con contraste 4,5:1 en textos y 3:1 en bordes, botones de 44 px o más, letra *Atkinson Hyperlegible* y respeto por «menos movimiento» | Revisión con teclado y lector de pantalla (NVDA o VoiceOver) | 🟡 hecho, falta la revisión | NX-7 |
| RNF-07 | Usabilidad | Verse bien en computador y celular, con tema claro u oscuro según el sistema | Prueba en las dos pantallas y los dos temas | ✅ | NX-7 |
| RNF-08 | Usabilidad | Estar toda en español, con mensajes de error en español sencillo | Revisión de todos los textos de la pantalla | ✅ | NX-7 |
| RNF-09 | Fidelidad a la LSC | Basar las letras en una fuente reconocida (DBLSC, pág. 573) y **no presentar ninguna letra como validada** sin la aprobación de personas sordas | Cada ficha tiene `sources` y `validation`; la pantalla muestra «Borrador» | ✅ | NX-5 |
| RNF-10 | Fidelidad a la LSC | Que personas sordas entiendan lo que el avatar deletrea | Prueba de comprensión: 9 de cada 10 palabras reconocidas o más | ⏳ | NX-6 |
| RNF-11 | Honestidad | Decir siempre qué no se pudo señar y que las letras están en borrador; el color nunca va solo, cada estado lleva su palabra | Revisión de la pantalla | ✅ | NX-7 |
| RNF-12 | Privacidad | No guardar datos personales. Solo se guarda en el navegador qué avatar eligió la persona y, si aceptó, el modelo de voz local. Con la voz local, el audio no sale del equipo | Revisión del código: no hay cuentas ni envío de datos propios | ✅ | NX-8 |
| RNF-16 | Rendimiento | Con la voz local, tener el texto pocos segundos después de terminar de hablar, sin congelar el avatar | Medido: ~2 s por frase corta (12 núcleos, con aislamiento entre orígenes). Falta medir en un equipo sencillo | 🟡 | NX-8 |
| RNF-13 | Licencias | Usar solo recursos con licencia libre o propia: cada avatar con su `LICENSE.md`; no poner dibujos ni fotos del DBLSC sin permiso escrito | Revisión de `assets-src/` y `public/` antes de publicar | ✅ | NX-4 |
| RNF-14 | Mantenibilidad | Mantener el núcleo (`src/core`) separado de la pantalla y del 3D, con pruebas automáticas | `npm test`: 15 pruebas en verde | ✅ | NX-2 |
| RNF-15 | Escalabilidad | Poder pasar a palabras, frases y voz a LSC sin rehacer el reproductor ni el avatar; poder cambiar el motor de voz | Las reglas del [doc 16](16-estrategia-palabras-frases.md) se cumplen | ✅ | NX-2 |

## Historias de usuario

### HU-01 · Deletrear una palabra escrita

**Como** persona oyente, **quiero** escribir una palabra y ver al avatar deletrearla, **para** mostrarle a una
persona sorda cómo se dice con el alfabeto manual.

| Prioridad | Estado | Épica | Requisitos |
|---|---|---|---|
| Imprescindible | ✅ | NX-2, NX-5 | RF-01, RF-04, RF-05, RF-07, RF-08, RF-09, RF-10 |

Criterios de aceptación:

1. **Dado** que escribo «Hola», **cuando** pulso Reproducir o Enter, **entonces** veo «Se deletreará: HOLA» y el
   avatar hace H, O, L y A en ese orden.
2. **Dado** que escribo «¿Cómo estás?», **cuando** lo reproduzco, **entonces** se deletrea `COMO ESTAS`, sin
   tildes ni signos y con una pausa entre las dos palabras.
3. **Dado** que escribo «ñandú», **cuando** lo reproduzco, **entonces** se deletrea `ÑANDU`: la Ñ se conserva.
4. **Dado** que escribo «Casa», **cuando** llega la S, **entonces** el avatar dibuja la S en el aire y esa letra
   dura más que las demás.
5. **Dado** que escribo «Allá», **cuando** llega la segunda L, **entonces** el avatar se acerca un momento al
   reposo para que se note que son dos L.

### HU-02 · Decir la palabra en voz alta

**Como** persona oyente, **quiero** decir la palabra en vez de escribirla, **para** usar la app más rápido,
sobre todo en el celular.

| Prioridad | Estado | Épica | Requisitos |
|---|---|---|---|
| Importante | 🟡 | NX-2, NX-8 | RF-02, RF-03, RF-29, RNF-03, RNF-16 |

Criterios de aceptación:

1. **Dado** que uso Chrome, Edge o Safari, **cuando** pulso «Hablar» y digo «hola», **entonces** veo el texto
   mientras hablo, «hola» aparece en el campo y el avatar empieza solo.
2. **Dado** que el botón está escuchando, **cuando** lo miro, **entonces** está rojo y dice «Escuchando… (toca
   para detener)».
3. **Dado** que negué el permiso del micrófono, **cuando** pulso «Hablar», **entonces** veo un mensaje en
   español que lo explica.
4. **Dado** que uso Firefox o Brave por primera vez, **cuando** pulso «Hablar», **entonces** veo un aviso con el
   tamaño de la descarga (unos 85 MB) y los botones «Descargar y hablar» y «Ahora no», y **no se descarga
   nada hasta que acepto**.
5. **Dado** que acepté, **cuando** se descarga el modelo, **entonces** veo el avance («34 de 85 MB») y puedo
   cancelar tocando el micrófono.
6. **Dado** que el modelo ya está guardado, **cuando** digo «hola» y hago una pausa, **entonces** la grabación
   se detiene sola y en pocos segundos «hola» aparece en el campo y el avatar lo seña. *(Probado con audio
   grabado; falta probar con micrófono real en Firefox.)*

### HU-03 · Saber qué no se puede señar

**Como** persona oyente, **quiero** que la app me diga qué partes de mi texto no se van a señar, **para** no
creer que la persona sorda recibió algo que no se mostró.

| Prioridad | Estado | Épica | Requisitos |
|---|---|---|---|
| Imprescindible | ✅ | NX-2 | RF-06, RF-17, RNF-11 |

Criterios de aceptación:

1. **Dado** que escribo «casa 3 @», **cuando** lo reproduzco, **entonces** el avatar deletrea `CASA` y veo
   «Omitidos (sin seña en el MVP): 3 @».
2. **Dado** que una letra no tiene animación, **cuando** aparece en la línea de letras, **entonces** tiene borde
   punteado y el avatar se queda en reposo en ese momento.
3. **Dado** que escribo más de 200 caracteres, **cuando** lo reproduzco, **entonces** el texto se corta y
   termina en `…`.

### HU-04 · Controlar la reproducción

**Como** aprendiz de LSC, **quiero** pausar, volver a una letra y reiniciar, **para** mirar con calma la
letra que no entendí.

| Prioridad | Estado | Épica | Requisitos |
|---|---|---|---|
| Imprescindible | ✅ | NX-2 | RF-11, RF-12, RF-15 |

Criterios de aceptación:

1. **Dado** que el avatar está deletreando, **cuando** pulso Pausar, **entonces** se queda quieto en la pose de
   ese momento; **cuando** pulso Continuar, sigue exactamente desde ahí.
2. **Dado** que está en pausa, **cuando** toco la L en la línea de letras, **entonces** el avatar muestra la L
   de inmediato.
3. **Dado** que está reproduciendo, **cuando** toco otra letra, **entonces** el avatar pasa a ella con un
   movimiento suave y sigue reproduciendo.
4. **Dado** que no estoy escribiendo en el campo, **cuando** pulso `Espacio`, `←`, `→` o `R`, **entonces**
   reproduce o pausa, cambia de letra o reinicia.
5. **Dado** que pulso Detener, **entonces** el avatar vuelve al reposo y a la primera letra.

### HU-05 · Ir más despacio y repetir

**Como** aprendiz de LSC, **quiero** bajar la velocidad y repetir la palabra sin parar, **para** practicar
la forma de la mano mientras la miro.

| Prioridad | Estado | Épica | Requisitos |
|---|---|---|---|
| Imprescindible | ✅ | NX-2 | RF-13, RF-14 |

Criterios de aceptación:

1. **Dado** que elijo 0,5x, **cuando** reproduzco «HOLA», **entonces** cada letra dura el doble (unos 6,8
   segundos en total, en vez de 3,4).
2. **Dado** que una letra se está haciendo, **cuando** cambio la velocidad, **entonces** el cambio se nota al
   instante, sin volver a empezar.
3. **Dado** que activo Repetir, **cuando** termina la última letra, **entonces** vuelve a empezar sola.
4. **Dado** que uso el celular, **cuando** toco el botón «1x», **entonces** pasa a la siguiente velocidad.

### HU-06 · Ver la mano desde varios ángulos

**Como** aprendiz de LSC, **quiero** ver la mano de frente, de lado y de cerca, **para** entender bien la
posición de cada dedo.

| Prioridad | Estado | Épica | Requisitos |
|---|---|---|---|
| Importante | ✅ | NX-7 | RF-20 |

Criterios de aceptación:

1. **Dado** que pulso **Perfil**, **entonces** la cámara gira al lado de la mano derecha con un movimiento
   corto.
2. **Dado** que pulso **Mano**, **entonces** la cámara se acerca a la mano en la posición en la que esté.
3. **Dado** que elegí una vista, **cuando** arrastro con el mouse o el dedo, **entonces** puedo seguir girando
   la cámara.
4. **Dado** que mi sistema pide menos animación, **cuando** cambio de vista, **entonces** la cámara cambia sin
   movimiento.

### HU-07 · Saber en qué letra va

**Como** aprendiz de LSC, **quiero** ver qué letra está haciendo el avatar y cómo se pone la mano,
**para** relacionar la forma de la mano con la letra.

| Prioridad | Estado | Épica | Requisitos |
|---|---|---|---|
| Imprescindible | ✅ | NX-2 | RF-16, RF-17 |

Criterios de aceptación:

1. **Dado** que se deletrea «HOLA», **cuando** el avatar hace la L, **entonces** la tarjeta muestra la L en
   grande, «3 de 4 · HOLA» y la descripción de la mano.
2. **Dado** que la L es la letra actual, **entonces** en la línea de letras la L está en amarillo y la H y la O
   en verde claro.
3. **Dado** que todavía no hay palabra, **entonces** la tarjeta dice «Escribe una palabra abajo y pulsa
   Reproducir».

### HU-08 · Saber si las letras son confiables

**Como** persona sorda, **quiero** saber si las letras del avatar ya fueron revisadas por personas sordas,
**para** decidir cuánto confiar en lo que veo.

| Prioridad | Estado | Épica | Requisitos |
|---|---|---|---|
| Imprescindible | ✅ | NX-7 | RF-18, RF-25, RNF-09, RNF-11 |

Criterios de aceptación:

1. **Dado** que ninguna letra está aprobada, **cuando** abro la página, **entonces** veo «Borrador · 0 de 27
   letras validadas».
2. **Dado** que una letra cambia a «aprobada» en su ficha, **cuando** se vuelve a publicar la página,
   **entonces** el contador sube solo, sin tocar la pantalla.

### HU-09 · Usar la app sin mouse o con lector de pantalla

**Como** persona con baja visión o que no usa mouse, **quiero** manejar toda la app con el teclado o con un
lector de pantalla, **para** usarla igual que los demás.

| Prioridad | Estado | Épica | Requisitos |
|---|---|---|---|
| Importante | 🟡 | NX-7 | RF-15, RNF-06 |

Criterios de aceptación:

1. **Dado** que solo uso el teclado, **cuando** paso por los controles con `Tab`, **entonces** llego a todos y
   cada uno muestra un anillo verde.
2. **Dado** que uso un lector de pantalla, **cuando** cambia la letra, **entonces** el lector la anuncia.
3. **Dado** que un botón muestra solo un ícono, **entonces** el lector dice su nombre.
4. **Dado** que se revisa con NVDA o VoiceOver, **entonces** no quedan problemas sin anotar. *(Falta: es la
   revisión pendiente de NX-7.)*

### HU-10 · Usar la app en el celular

**Como** persona oyente, **quiero** usar la app en mi celular, **para** tenerla a mano cuando hablo con una
persona sorda.

| Prioridad | Estado | Épica | Requisitos |
|---|---|---|---|
| Imprescindible | 🟡 | NX-7, NX-4 | RF-30, RNF-04, RNF-07 |

Criterios de aceptación:

1. **Dado** que abro la página en un celular, **entonces** veo el avatar, los botones de vista y el panel de
   abajo sin que nada se salga de la pantalla.
2. **Dado** que escribí una palabra, **cuando** pulso Reproducir, **entonces** se cierra el teclado, el panel se
   pliega a una barra delgada y el avatar ocupa toda la pantalla.
3. **Dado** que el panel está plegado, **cuando** toco «Escribir», **entonces** el panel se abre con el cursor en
   el campo; y **cuando** toco «Ocultar panel», se vuelve a plegar.
4. **Dado** que la palabra es larga, **cuando** el avatar avanza, **entonces** la letra actual siempre se ve en
   la barra de letras.
5. **Dado** que mi celular usa tema oscuro, **entonces** la página también lo usa, y el escenario se mantiene
   claro.
6. **Dado** que uso un celular de gama media, **cuando** el avatar deletrea, **entonces** se mueve con fluidez.
   *(Falta medirlo.)*

### HU-11 · Elegir el avatar

**Como** persona usuaria, **quiero** elegir entre los avatares disponibles, **para** usar el que me resulte
más claro.

| Prioridad | Estado | Épica | Requisitos |
|---|---|---|---|
| Deseable | ✅ | NX-4 | RF-21, RNF-13 |

Criterios de aceptación:

1. **Dado** que hay más de un avatar, **cuando** elijo uno en el selector, **entonces** aparece con las mismas
   letras.
2. **Dado** que elegí un avatar, **cuando** vuelvo a abrir la página, **entonces** sigue elegido.
3. **Dado** que paso el mouse sobre un avatar, **entonces** veo su licencia (también está en el pie).

### HU-12 · Que la página no se rompa si falta algo

**Como** persona usuaria, **quiero** que la página siga sirviendo aunque falte el avatar, una animación o la
foto, **para** no quedarme sin nada.

| Prioridad | Estado | Épica | Requisitos |
|---|---|---|---|
| Importante | ✅ | NX-2 | RF-23 |

Criterios de aceptación:

1. **Dado** que no hay ningún avatar, **cuando** reproduzco una palabra, **entonces** veo cada letra en grande
   con la descripción de la mano.
2. **Dado** que falta la foto de fondo, **entonces** el escenario queda gris claro y liso.

### HU-13 · Perfeccionar una letra en Blender

**Como** integrante del equipo de contenido, **quiero** abrir el avatar, corregir una letra a mano y verla en
la página, **para** mejorar las letras sin pasos complicados.

| Prioridad | Estado | Épica | Requisitos |
|---|---|---|---|
| Imprescindible | ✅ | NX-3, NX-5 | RF-24 |

Criterios de aceptación:

1. **Dado** que ejecuto `npm run avatar:abrir`, **entonces** se abre `avatar.blend` en Blender con las 27 letras
   y el reposo.
2. **Dado** que corregí una letra y guardé, **cuando** ejecuto `npm run avatar:exportar`, **entonces** se
   actualiza el `.glb` y la página muestra la letra corregida.
3. **Dado** que vuelvo a generar el avatar con `mpfb_builder.py`, **entonces** no se borran las letras (salvo
   que use `--sobrescribir`).

### HU-14 · Validar las letras

**Como** validador, **quiero** revisar cada letra del avatar y dejar mi resultado anotado, **para** que la
app solo marque como aprobadas las letras que la comunidad sorda aceptó.

| Prioridad | Estado | Épica | Requisitos |
|---|---|---|---|
| Imprescindible | ⏳ | NX-6 | RF-25, RF-26, RNF-09 |

Criterios de aceptación:

1. **Dado** que reviso una letra, **cuando** termino, **entonces** su ficha queda como «aprobada» o
   «rechazada», con quién la revisó, la fecha y las notas.
2. **Dado** que una letra fue rechazada, **entonces** vuelve al equipo de contenido con las notas para
   corregirla.
3. **Dado** que se terminan las sesiones, **entonces** las preguntas abiertas (CH, LL y RR, letras repetidas,
   la seña APARTE y el ritmo) tienen una respuesta anotada.

### HU-15 · Comprobar que se entiende

**Como** persona sorda, **quiero** reconocer las palabras que deletrea el avatar, **para** que la app me sirva
de verdad para comunicarme.

| Prioridad | Estado | Épica | Requisitos |
|---|---|---|---|
| Imprescindible | ⏳ | NX-6 | RNF-10 |

Criterios de aceptación:

1. **Dado** que veo palabras deletreadas por el avatar sin ver el texto, **cuando** digo cuál es cada una,
   **entonces** acierto 9 de cada 10 o más.
2. **Dado** que una palabra no se entendió, **entonces** se anota qué letra falló y por qué.

### HU-16 · Ver la ficha de la letra

**Como** aprendiz de LSC, **quiero** abrir la ficha de una letra, **para** ver su descripción completa, de qué
libro sale y si ya está validada.

| Prioridad | Estado | Épica | Requisitos |
|---|---|---|---|
| Deseable | ⏳ | NX-7 | RF-19 |

Criterios de aceptación:

1. **Dado** que toco «ver ficha» en la letra actual, **entonces** veo la descripción completa, la fuente (por
   ejemplo, DBLSC pág. 573) y el estado de validación.

### HU-17 · Practicar con el modo espejo

**Como** aprendiz de LSC, **quiero** ver al avatar como en un espejo, **para** copiar la seña con mi propia mano
sin tener que invertirla en la cabeza.

| Prioridad | Estado | Épica | Requisitos |
|---|---|---|---|
| Deseable | ⏳ | NX-7 | RF-22 |

Criterios de aceptación:

1. **Dado** que activo el modo espejo, **entonces** el avatar se ve invertido de izquierda a derecha y lo dice
   en pantalla.
2. **Dado** que lo desactivo, **entonces** vuelve a la vista normal.

### HU-18 · Entrar a la página publicada

**Como** persona oyente, **quiero** abrir NexoLSC desde un enlace, sin instalar nada, **para** usarlo en
cualquier lugar.

| Prioridad | Estado | Épica | Requisitos |
|---|---|---|---|
| Imprescindible | ⏳ | NX-8 | RF-27, RF-28, RNF-01, RNF-02, RNF-05, RNF-12 |

Criterios de aceptación:

1. **Dado** que abro el enlace, **entonces** la página carga con HTTPS (con el candado) y el micrófono
   funciona.
2. **Dado** que el avatar todavía está bajando, **entonces** veo una pantalla de carga.
3. **Dado** que quiero saber qué pasa con mi voz, **entonces** encuentro la política de privacidad desde la
   página.

## Trazabilidad: de la historia a la prueba

Esta tabla es el resumen. Más adelante se pasará a la matriz del SENA (objetivo → requisito → historia → caso
de prueba → evidencia).

| Historia | Requisitos | Épica | Cómo se prueba | Estado |
|---|---|---|---|---|
| HU-01 Deletrear una palabra | RF-01, 04, 05, 07, 08, 09, 10 | NX-2, NX-5 | Pruebas automáticas (`normalizeText`, `buildQueue`) + prueba en el navegador | ✅ |
| HU-02 Decir la palabra | RF-02, 03, 29 · RNF-03, 16 | NX-2, NX-8 | Prueba manual en Chrome, Edge, Safari, Firefox y Brave; voz local probada con `?voz=local` | 🟡 |
| HU-03 Qué no se seña | RF-06, 17 · RNF-11 | NX-2 | Prueba automática («reporta números y símbolos», «limita la longitud») + navegador | ✅ |
| HU-04 Controlar la reproducción | RF-11, 12, 15 | NX-2 | Pruebas automáticas de `SignPlayer` (pausa, seek, stop, restart) + navegador | ✅ |
| HU-05 Velocidad y repetir | RF-13, 14 | NX-2 | Pruebas automáticas («la velocidad acorta la duración», loop) | ✅ |
| HU-06 Vistas de la cámara | RF-20 | NX-7 | Prueba en el navegador, escritorio y celular | ✅ |
| HU-07 En qué letra va | RF-16, 17 | NX-2 | Prueba en el navegador | ✅ |
| HU-08 Letras confiables | RF-18, 25 · RNF-09, 11 | NX-7 | Revisión de las fichas + navegador | ✅ |
| HU-09 Teclado y lector de pantalla | RF-15 · RNF-06 | NX-7 | Revisión con teclado, NVDA o VoiceOver | 🟡 |
| HU-10 En el celular | RF-30 · RNF-04, 07 | NX-7, NX-4 | Prueba en el navegador a 375 × 812 (panel plegable) y en un celular de gama media | 🟡 |
| HU-11 Elegir avatar | RF-21 · RNF-13 | NX-4 | Prueba en el navegador | ✅ |
| HU-12 Si falta algo | RF-23 | NX-2 | Quitar el `.glb` o la foto y probar en el navegador | ✅ |
| HU-13 Perfeccionar en Blender | RF-24 | NX-3, NX-5 | Corregir una letra, exportar y verla en la página | ✅ |
| HU-14 Validar las letras | RF-25, 26 · RNF-09 | NX-6 | Sesiones con personas sordas e intérprete | ⏳ |
| HU-15 Comprobar que se entiende | RNF-10 | NX-6 | Prueba de comprensión (meta: 9 de 10) | ⏳ |
| HU-16 Ficha de la letra | RF-19 | NX-7 | Prueba en el navegador | ⏳ |
| HU-17 Modo espejo | RF-22 | NX-7 | Prueba en el navegador | ⏳ |
| HU-18 Página publicada | RF-27, 28 · RNF-01, 02, 05, 12 | NX-8 | Abrir la dirección publicada en celular y computador | ⏳ |

Los requisitos RNF-08 (todo en español), RNF-14 (núcleo con pruebas) y RNF-15 (crecer sin rehacer) no tienen
una historia propia: se revisan en cada versión (`npm test` y revisión de textos).

## Lo que queda fuera del MVP

Estas cosas **no** son requisitos todavía. Están planeadas en el [doc 16](16-estrategia-palabras-frases.md):

- Señar **palabras completas** (fase 2) y **frases con la gramática de la LSC** (fase 3).
- Señar los **números** (vendrán en la fase 1.1, con el DBLSC pág. 574).
- Señas propias para **CH, LL y RR**, si la validación confirma que existen.
- Reconocer señas con la **cámara** (fase 5).
- Cuentas de usuario, servidor o base de datos.

## Cómo mantener este documento

- Cuando se termine una tarea del [plan](14-plan-implementacion.md), cambia también el estado del requisito y
  de la historia aquí.
- Un requisito nuevo lleva el siguiente número libre (RF-31, RNF-17…). Los números no se reutilizan: si un
  requisito se descarta, se tacha y se dice por qué.
- Cada historia nueva debe tener al menos un criterio de aceptación y decir a qué épica pertenece.
- **Siguiente paso:** cuando el MVP esté completo, pasar este documento al formato **IEEE 830** y adaptar la
  matriz (`Matris.xlsx`) a NexoLSC.
