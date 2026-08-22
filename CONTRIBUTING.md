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
6. Registrar el cambio relevante en `CHANGELOG.md`, dentro de `[Sin publicar]`.
7. Ejecutar las verificaciones correspondientes.
8. Revisar que no existan secretos ni archivos temporales.
9. Crear un commit convencional.
10. Subir el commit al repositorio remoto.

## Commits

Formato:

```text
<tipo>(<alcance>): <resumen imperativo>
```

Tipos permitidos:

- `feat`: comportamiento nuevo.
- `fix`: corrección de un defecto.
- `docs`: cambio exclusivamente documental.
- `test`: creación o modificación de pruebas.
- `refactor`: cambio estructural sin alterar comportamiento.
- `perf`: mejora de rendimiento.
- `build`: dependencias o compilación.
- `ci`: automatización del repositorio.
- `chore`: mantenimiento que no encaja en los anteriores.
- `revert`: reversión explícita de un cambio.

Ejemplos:

```text
docs: add initial MVP specification
feat(avatar): play validated sign scripts
fix(audio): recover after denied permission
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
| Alcance o comportamiento | Visión, SRS, backlog y casos de prueba afectados. |
| Regla español–LSC | Especificación lingüística, catálogo y registro de validación. |
| Animación | Listado de animaciones, catálogo de señas y pipeline Blender–GLB. |
| Arquitectura o stack | ADR correspondiente y arquitectura C4. |
| Interfaz | Flujo, wireframes y accesibilidad. |
| Seguridad o privacidad | SRS, requisitos no funcionales, riesgos y pruebas. |
| Corrección de defecto | Caso de prueba de regresión y `CHANGELOG.md`. |

## Definition of Done del cambio

- [ ] Existe relación con una necesidad, historia o corrección.
- [ ] Las funciones están documentadas.
- [ ] Las pruebas aplicables pasan.
- [ ] Los documentos afectados coinciden con el comportamiento.
- [ ] `CHANGELOG.md` fue actualizado si el cambio es relevante para el proyecto.
- [ ] El diff no contiene secretos, credenciales, audio personal o temporales.
- [ ] El commit tiene un único propósito y fue subido al remoto.
