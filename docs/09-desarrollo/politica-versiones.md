# Política de versiones

**Estado:** Aceptada

## Decisión

Git conserva el historial de cada documento y archivo. Por esa razón, los
documentos Markdown no llevarán un número de versión manual en su encabezado.
Cada cambio coherente se guarda en una confirmación pequeña y en español.

Las etiquetas de Git se reservan para hitos completos del proyecto; no se crea
una etiqueta por cada documento ni por cada confirmación.

## Formato de etiquetas

```text
v<mayor>.<menor>.<parche>
v<mayor>.<menor>.<parche>-documentacion
```

- `mayor`: cambio incompatible del producto o sus contratos públicos.
- `menor`: capacidad nueva compatible.
- `parche`: corrección compatible.
- `-documentacion`: hito que todavía no representa una aplicación ejecutable.

La primera base documental se publica como `v0.1.0-documentacion`. La primera
versión ejecutable podrá usar `v0.1.0` cuando cumpla su criterio de aceptación.

## Elementos que sí conservan versión propia

- guiones LSC;
- catálogos y sus esquemas;
- avatar y esqueleto de animación;
- animaciones de Blender;
- archivos GLB publicados;
- contratos de API cuando exista compatibilidad externa que preservar.

Estas versiones forman parte de los datos del sistema y permiten comprobar
compatibilidad durante la ejecución. No sustituyen las etiquetas de Git.

## Creación de un hito

Antes de crear una etiqueta:

1. confirmar que no hay cambios sin registrar;
2. ejecutar las verificaciones aplicables;
3. actualizar `CAMBIOS.md`;
4. crear una etiqueta anotada con descripción breve en español;
5. enviar la confirmación y la etiqueta al repositorio remoto.
