# 02 · Herramientas que usa el proyecto

> **En pocas palabras:** los avatares se hacen en **Blender** y se guardan como archivos **.glb**. La
> página se hace con **React** y muestra el 3D con **three.js**. Todas las versiones de esta lista se
> probaron juntas y funcionan.

La propuesta inicial (Blender → GLB → three.js + React + React Three Fiber) **es la adecuada** para
este proyecto. Solo se añadieron Vite, TypeScript y Vitest, y se dejó fuera lo que todavía no hace falta.

Versiones revisadas el 2026-09-28 y probadas juntas: compilan, pasan las pruebas y funcionan en el
navegador.

## Las herramientas

| Para qué | Herramienta | Versión | En sencillo |
|---|---|---|---|
| Crear y animar los avatares | **Blender** | 5.2 | Programa gratuito de 3D. Aquí se crean los avatares, se les aplican las letras y se exportan, todo con programas automáticos |
| Generar los personajes | **MPFB** (MakeHuman para Blender) | 2.0.17 + paquete de recursos (licencia CC0) | Crea personas en 3D con dedos y cara, y permite ajustar los rasgos. Su licencia es libre |
| Esqueleto para posar | **Rigify** (viene con Blender) | — | Añade controles cómodos para mover brazos y dedos |
| Las letras | **Animaciones en Blender** | — | Cada letra es una animación que se perfecciona a mano y se exporta con el avatar |
| Formato del avatar | **.glb** (glTF 2.0) | — | Formato estándar de 3D para la web: cuerpo, esqueleto y animaciones en un solo archivo |
| Arrancar y compilar la página | **Vite** | 8.3 | Arranca la página al instante mientras se trabaja y la prepara para publicarla |
| La pantalla | **React** | 19.3 | Construye la interfaz por piezas (botones, campo de texto, línea de letras) |
| El lenguaje | **TypeScript** | 7.0 | JavaScript con «tipos»: avisa de errores antes de ejecutar, útil cuando haya miles de señas |
| El 3D | **three.js** | 0.186 | Dibuja el avatar en el navegador y reproduce sus animaciones |
| El 3D dentro de React | **React Three Fiber** | 9.8 | Permite usar three.js como si fuera una pieza más de React |
| Ayudas para el 3D | **drei** | 10.7 | Funciones listas: cargar el avatar, girar la cámara, sombra en el piso |
| Pruebas automáticas | **Vitest** | 5.0 | Revisa que el núcleo funcione bien (limpiar texto, lista de señas, reproductor) |
| Voz a texto | **Reconocimiento de voz del navegador** (Web Speech API) | — | Convierte lo que dices en texto, en español de Colombia, sin servidor propio |
| Publicar | Cualquier servicio de páginas estáticas con HTTPS | — | Vercel, Netlify o GitHub Pages |

## ¿Por qué React Three Fiber y no three.js solo?

- La pantalla ya está hecha con React. Con React Three Fiber, el avatar es una pieza más de la pantalla.
- Trae un «bucle por cuadro» (`useFrame`) listo, sin tener que programarlo a mano.
- Importante: **la lógica del reproductor no depende de React Three Fiber** (vive aparte, en
  `src/core`). Si algún día se quiere un widget para otras páginas sin React, ese núcleo se reutiliza tal
  cual.

## Otras opciones que se revisaron

| Opción | Qué se decidió |
|---|---|
| **Babylon.js** (otro motor 3D) | Es muy bueno, pero three.js tiene más ejemplos y herramientas con React, y ya estaba en la propuesta. No da ninguna ventaja aquí |
| **Unity o Godot para web** | Pesan decenas de MB, tardan en arrancar y son menos accesibles. Descartados |
| **Next.js** | Sirve para páginas con servidor, y este proyecto no lo tiene. Vite es más simple. Se puede reconsiderar si se crea un sitio con mucho contenido |
| **Redux o Zustand** (librerías de estado) | No hacen falta: el estado vive dentro del reproductor |
| **Generar señas desde notación escrita** (SiGML/HamNoSys, JASigning) | Interesante para el futuro, pero complica el MVP. Ver [16](16-estrategia-palabras-frases.md) |
| **Avatar creado con IA** (de una foto a un modelo 3D) | Probado y descartado por ahora: el plan gratuito no incluía el modelo necesario, convertir a 3D cuesta créditos y las mallas generadas suelen pegar los dedos, lo peor para la lengua de señas |
| **Modelos 3D descargados de internet** | Descartados para publicar: el primer avatar de prueba (Miles Morales) es un personaje con derechos de autor de otros |

## Herramientas para después

| Herramienta | Para qué |
|---|---|
| `@gltf-transform/cli` | Hacer más livianos los archivos del avatar (hoy pesan unos 5 MB) comprimiendo el cuerpo, las texturas y quitando animaciones de partes que no se mueven |
| Whisper en el navegador (`@huggingface/transformers`) | Reconocer la voz en **Firefox** y sin enviar el audio a otras empresas. Ver [10](10-flujo-voz-texto-avatar.md) |
| Playwright | Probar la pantalla automáticamente, como si fuera una persona |
| MediaPipe | Más adelante: reconocer señas con la cámara, o grabar movimientos de personas reales desde un video |

## ¿Funciona en mi navegador?

| Función | Chrome / Edge | Safari | Firefox |
|---|---|---|---|
| Avatar 3D | ✅ | ✅ | ✅ |
| Voz | ✅ (el audio se envía a servidores de Google para reconocerlo) | ✅ en parte | ❌ **no disponible** |

> En **Firefox**, el botón «Hablar» muestra «voz no disponible» y te invita a escribir. Se podrá
> resolver añadiendo Whisper en el navegador.
