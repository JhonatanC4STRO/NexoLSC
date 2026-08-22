# Accesibilidad

**Estado:** Borrador

## Objetivo

La interfaz debe ser utilizable por personas con distintas capacidades visuales,
motoras, auditivas y cognitivas, sin reducir la legibilidad de la LSC.

## Requisitos de interfaz

- Controles operables con teclado y foco claramente visible.
- Nombres accesibles para grabar, detener, confirmar, repetir y cambiar velocidad.
- Contraste suficiente en texto, botones, manos, ropa y fondo.
- No depender exclusivamente de color para representar estados.
- Texto escalable hasta 200 % sin perder controles.
- Mensajes de estado anunciados mediante una región accesible sin interrumpir al usuario.
- Objetivos táctiles de tamaño cómodo y separados.
- No iniciar audio ni animación automáticamente al cargar la página.
- Anunciar la advertencia y confirmación de deletreo antes de iniciar la secuencia.
- Mantener visible el texto exacto que se deletrea.

## Accesibilidad del avatar

- Mantener cabeza, torso, codos y manos dentro del encuadre.
- Evitar ropa y fondo con colores similares a las manos.
- No superponer subtítulos o botones sobre el espacio de articulación.
- Permitir repetición, pausa y velocidad reducida.
- Evitar desenfoque de movimiento que oculte configuraciones manuales.
- Probar en pantallas pequeñas y con brillo reducido.

## Movimiento

La animación lingüística no puede eliminarse mediante “reducir movimiento”. Sin
embargo, los elementos decorativos, transiciones de interfaz y movimientos de
cámara sí deben respetar la preferencia `prefers-reduced-motion`.

## Audio y texto

- Toda entrada de voz debe aparecer como texto revisable.
- Ninguna instrucción esencial debe existir solo en audio.
- Los errores de micrófono deben incluir pasos escritos para resolverlos.

## Lista de verificación

- [ ] Navegación completa sin ratón.
- [ ] Foco visible y orden lógico.
- [ ] Lectura con lector de pantalla de los estados principales.
- [ ] Contraste verificado.
- [ ] Zoom al 200 %.
- [ ] Prueba móvil horizontal y vertical.
- [ ] Revisión del avatar por usuarios de LSC.
