# Contribución y flujo de cambios

Este proyecto es mantenido inicialmente por una sola persona, pero conserva un
flujo verificable para que cada decisión y modificación pueda entenderse después.

## Regla principal

Cada cambio debe responder cuatro preguntas:

1. ¿Qué problema o necesidad resuelve?
2. ¿Por qué se eligió esta solución?
3. ¿Cómo funciona y qué partes modifica?
4. ¿Cómo se comprobó que funciona?

El código, las pruebas, la documentación y el registro de cambios forman una sola
unidad de trabajo.

## Flujo obligatorio

1. Seleccionar una historia, requisito, riesgo o corrección concreta.
2. Crear un cambio pequeño con un único propósito.
3. Documentar todas las funciones nuevas o modificadas.
4. Agregar o actualizar pruebas relevantes.
5. Actualizar el documento funcional, técnico o lingüístico afectado.
6. Registrar el cambio relevante en `CAMBIOS.md`, dentro de `[Sin publicar]`.
7. Ejecutar las verificaciones correspondientes.
8. Revisar que no existan secretos ni archivos temporales.
9. Crear una confirmación en Git con un mensaje convencional en español.
10. Enviar la confirmación al repositorio remoto.

## Confirmaciones en Git

Formato:

```text
<tipo>(<alcance>): <resumen imperativo>
```

Tipos permitidos:

- `funcionalidad`: comportamiento nuevo.
- `correccion`: corrección de un defecto.
- `documentacion`: cambio exclusivamente documental.
- `pruebas`: creación o modificación de pruebas.
- `refactorizacion`: cambio estructural sin alterar comportamiento.
- `rendimiento`: mejora de rendimiento.
- `compilacion`: dependencias o proceso de compilación.
- `integracion`: automatización del repositorio.
- `mantenimiento`: tareas que no encajan en los anteriores.
- `reversion`: reversión explícita de un cambio.

Ejemplos:

```text
documentacion: crear especificacion inicial del PMV
funcionalidad(avatar): reproducir guiones validados
correccion(audio): recuperar permiso denegado
```

El asunto debe ser breve, en modo imperativo y describir un solo cambio. El cuerpo
explica el motivo únicamente cuando no sea evidente, haya una ruptura de
compatibilidad, una migración, un cambio de seguridad o una reversión.

## Documentación de funciones

Todas las funciones propias del proyecto deben documentarse de acuerdo con
[el estándar de documentación](docs/09-desarrollo/estandar-documentacion-y-cambios.md).
No se exige documentar funciones provenientes de dependencias.

## Qué documento actualizar

| Tipo de cambio | Documentación mínima |
|---|---|
| Alcance o comportamiento | Visión, ERS, trabajo pendiente y casos de prueba afectados. |
| Regla español–LSC | Especificación lingüística, catálogo y registro de validación. |
| Animación | Listado de animaciones, catálogo de señas y flujo de trabajo Blender–GLB. |
| Arquitectura o conjunto tecnológico | RDA correspondiente y arquitectura C4. |
| Interfaz | Flujo, bocetos y accesibilidad. |
| Seguridad o privacidad | ERS, requisitos no funcionales, riesgos y pruebas. |
| Corrección de defecto | Caso de prueba de regresión y `CAMBIOS.md`. |

## Definición de terminado del cambio

- [ ] Existe relación con una necesidad, historia o corrección.
- [ ] Las funciones están documentadas.
- [ ] Las pruebas aplicables pasan.
- [ ] Los documentos afectados coinciden con el comportamiento.
- [ ] `CAMBIOS.md` fue actualizado si el cambio es relevante para el proyecto.
- [ ] Los cambios preparados no contienen secretos, credenciales, audio personal o temporales.
- [ ] La confirmación en Git tiene un único propósito y fue enviada al remoto.
