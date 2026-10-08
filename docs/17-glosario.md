# 17 · Glosario

> **En pocas palabras:** las palabras técnicas que aparecen en la documentación, explicadas en una o dos
> líneas. Están en orden alfabético.

| Palabra | Qué significa |
|---|---|
| **Alfabeto manual** | Las formas de la mano que representan cada letra. Sirve para deletrear nombres o palabras que no tienen seña propia. En la LSC tiene 27 letras |
| **Animación** (*clip*) | Un movimiento guardado dentro del archivo del avatar. Cada letra es una animación: `sign_A`, `sign_B`… y `rest` es la pose de reposo |
| **Avatar** | El personaje 3D que hace las señas |
| **Blender** | Programa gratuito para crear y animar modelos 3D. Aquí se crean los avatares |
| **Borrador** (*draft*) | Estado de una letra que todavía no han revisado personas sordas. Hoy todas las letras están así |
| **Build** (*compilar*) | Preparar la página para publicarla. Se hace con `npm run build` y queda en la carpeta `dist/` |
| **Commit** | Un punto guardado en el historial de git, con un mensaje que dice qué cambió |
| **Componente** | Una pieza de la pantalla hecha con React (un botón, la línea de letras, el selector…) |
| **DBLSC** | *Diccionario Básico de la Lengua de Señas Colombiana* (INSOR e Instituto Caro y Cuervo, 2006). Es la fuente del alfabeto |
| **Deletrear** | Hacer una palabra letra por letra con el alfabeto manual |
| **Esqueleto** (*rig*) | Los huesos invisibles dentro del avatar que permiten moverlo. Ver [05](05-sistema-rigging.md) |
| **Exportar** | Convertir el avatar de Blender en un archivo `.glb` que la página puede abrir |
| **Fase** | Una etapa del proyecto. Fase 1: deletrear; fase 2: palabras; fase 3: frases; fase 4: voz a LSC; fase 5: reconocer señas con la cámara |
| **FK / IK** | Dos formas de mover un brazo en 3D. FK: se gira hueso por hueso (hombro, codo, muñeca). IK: se mueve la mano y el brazo la sigue. Las letras usan FK |
| **git** | Programa que guarda el historial de cambios del proyecto. GitHub es la página donde se sube ese historial |
| **GLB** (`.glb`) | Formato de archivo 3D para la web. Guarda en un solo archivo el cuerpo del avatar, su esqueleto y sus animaciones |
| **Glosa** | La palabra en MAYÚSCULAS con la que se escribe una seña (por ejemplo, CASA). Así lo hace el diccionario DBLSC |
| **Hornear** (*bake*) | Convertir los datos de las letras (los ángulos) en animaciones guardadas dentro del avatar. Lo hace `bake_letters.py` |
| **HTTPS** | Conexión segura de una página (el candado del navegador). Sin ella, el micrófono no funciona |
| **Interfaz** (en código) | Un «enchufe» común: define qué funciones debe tener una pieza, para poder cambiarla por otra sin tocar el resto |
| **LSC** | Lengua de Señas Colombiana. Es la lengua propia de la comunidad sorda de Colombia (Ley 324 de 1996) |
| **Mezclar animaciones** (*blending*) | Pasar suavemente de una pose a otra apagando una animación y encendiendo la siguiente poco a poco |
| **Mockup** | Un dibujo de cómo se verá una pantalla, antes de programarla |
| **MPFB** | Extensión de Blender (*MakeHuman for Blender*) que crea personas en 3D con licencia libre |
| **MVP** | *Producto mínimo viable*: la primera versión que ya sirve, con lo mínimo necesario. Aquí: deletrear letra por letra |
| **Node.js / npm** | Node.js permite correr las herramientas del proyecto en tu computador. npm instala las librerías y corre los comandos (`npm run dev`, `npm test`) |
| **No manual** | La parte de una seña que no se hace con las manos: gestos de la cara, de la cabeza o del cuerpo |
| **Núcleo** (`src/core`) | La parte del código que limpia el texto, arma la lista de señas y lleva el reloj. Funciona sin pantalla y sin 3D |
| **Prueba automática** | Un pequeño programa que revisa que otra parte del código funcione. Se corren con `npm test` |
| **React** | Librería para construir la pantalla por piezas (componentes) |
| **Reproductor** (`SignPlayer`) | La pieza que recorre la lista de señas con su propio reloj: reproduce, pausa, salta y cambia la velocidad |
| **Rigify** | El sistema de esqueletos que viene con Blender. Los avatares lo usan |
| **Seña** | Una unidad de la lengua de señas: una letra, un número, una palabra o una frase |
| **Sistema de diseño** | El conjunto de colores, letras, íconos y piezas de la marca, con sus reglas de uso |
| **three.js** | Librería que dibuja el 3D en el navegador |
| **Token** (de diseño) | Un valor de la marca con nombre, por ejemplo el color `selva` (`#0b6b4f`) |
| **Token** (de texto) | Cada pedazo del texto ya limpio: una letra, una pausa, un número |
| **TypeScript** | JavaScript con «tipos»: avisa de errores antes de ejecutar el código |
| **Validar** | Que personas sordas que usan la LSC revisen una seña y digan si está bien hecha |
| **Versión** (`v0.3.0`) | Un número que identifica cada entrega del proyecto. Ver la sección «Versiones» del [README](../README.md) |
| **Vite** | Herramienta que arranca la página mientras trabajas (`npm run dev`) y la prepara para publicarla |
| **Web Speech API** | El reconocimiento de voz que traen algunos navegadores (Chrome, Edge, Safari) |
