# Estándar de documentación y cambios

**Versión:** 0.1
**Estado:** Aceptado
**Aplica desde:** 2026-08-22

## 1. Objetivo

Garantizar que cada función, módulo y cambio de NexoLSC pueda entenderse sin
depender de la memoria de quien lo implementó. La documentación debe explicar la
intención y las decisiones; no repetir literalmente lo que ya expresa el código.

## 2. Niveles de documentación

### Proyecto

El `README.md` explica qué es el producto, cómo instalarlo, ejecutarlo, probarlo y
encontrar su documentación.

### Cambio

Cada cambio relevante actualiza `CHANGELOG.md` y se guarda en un commit pequeño.
La razón de decisiones difíciles de revertir se registra en un ADR.

### Módulo

Cada módulo comienza con una descripción breve cuando su responsabilidad o límite
no resulte evidente por su ubicación y nombre.

### Función

Todas las funciones propias, exportadas o internas, incluyen TSDoc/JSDoc. Las
funciones triviales pueden usar una descripción de una línea; las que contienen
reglas de negocio, seguridad, traducción, estado o efectos externos deben explicar
el contrato completo.

## 3. Contrato documental de una función

La documentación responde, cuando corresponda:

- **Qué hace:** resultado observable.
- **Por qué existe:** regla, requisito o decisión que implementa.
- **Entradas:** significado, unidades, formato y límites.
- **Salida:** significado del valor devuelto.
- **Efectos:** red, archivos, estado, logs o servicios externos.
- **Errores:** condiciones y forma en que se representan.
- **Privacidad:** tratamiento de audio, texto o datos identificables.
- **Relación:** requisito, historia, regla o ADR relevante.

No deben agregarse etiquetas vacías ni comentarios que solo traduzcan el nombre de
la función a una frase más larga.

## 4. Formato TypeScript

Ejemplo para una regla de negocio:

```ts
/**
 * Resuelve un enunciado confirmado contra el catálogo publicado.
 *
 * Existe para garantizar RN-001 y RN-002: solo devuelve guiones validados y
 * nunca compone una traducción aproximada para texto desconocido.
 *
 * @param text Texto español corregido y confirmado por el usuario.
 * @param catalog Catálogo inmutable utilizado durante la solicitud.
 * @returns Una intención validada o el resultado explícito `unsupported`.
 * @throws {CatalogIntegrityError} Si un guion publicado referencia clips inválidos.
 */
export function resolveIntent(
  text: string,
  catalog: PublishedCatalog,
): TranslationResult {
  // Implementación.
}
```

Ejemplo para una función con efectos:

```ts
/**
 * Envía audio temporal al proveedor STT y elimina el archivo al finalizar.
 *
 * Centraliza el ciclo de vida del audio para cumplir RNF-007 incluso cuando la
 * transcripción falla o la solicitud es cancelada.
 *
 * @param audioPath Ruta temporal creada por el backend.
 * @returns Texto transcrito por el proveedor.
 * @throws {TranscriptionError} Si el proveedor rechaza o no procesa el audio.
 * @sideEffect Realiza una solicitud de red y elimina `audioPath` en un bloque final.
 */
async function transcribeAndDelete(audioPath: string): Promise<string> {
  // Implementación.
}
```

`@sideEffect` es una convención interna del proyecto. Si la herramienta TSDoc
adoptada no permite etiquetas personalizadas, los efectos se describen en el
párrafo principal.

## 5. Comentarios dentro del código

Se permiten para explicar:

- una regla lingüística o de seguridad no evidente;
- una incompatibilidad de navegador o glTF;
- una optimización basada en una medición;
- una solución temporal con condición concreta para eliminarla.

Se deben evitar comentarios como:

```ts
// Incrementa el contador.
counter += 1;
```

Un pendiente debe incluir contexto y un disparador:

```ts
// TODO(NEXO-12): separar el GLB cuando supere el presupuesto RNF-004.
```

## 6. Documentación de endpoints y datos

- Cada endpoint se documenta mediante OpenAPI.
- Debe incluir propósito, autenticación, entrada, salida, errores y ejemplo.
- Los esquemas JSON tienen descripción de campos y reglas de integridad.
- Los identificadores de requisitos se enlazan cuando implementan una regla crítica.
- Nunca se incluyen claves, audios reales ni datos personales en ejemplos.

## 7. Documentación de animaciones

Cada Action de Blender registra:

- intención y contexto;
- nombre exacto y versión del rig;
- referencia autorizada;
- componentes manuales y no manuales;
- frames, duración, pose inicial y final;
- revisión técnica y LSC;
- archivo exportado y checksum.

Los cambios de una Action aprobada crean una nueva versión y una entrada en el
registro de cambios; no se reemplaza silenciosamente un archivo validado.

## 8. Registro de cambios

`CHANGELOG.md` usa las secciones:

- `Añadido`;
- `Cambiado`;
- `Corregido`;
- `Eliminado`;
- `Seguridad`;
- `Pendiente`, solo mientras no exista una primera versión ejecutable.

No se registran correcciones ortográficas aisladas sin efecto en el contenido. Sí
se registran cambios en requisitos, comportamiento, datos, arquitectura,
traducciones, animaciones, privacidad y dependencias.

## 9. Evidencia antes del commit

El mensaje final del cambio o la descripción de una futura solicitud de cambios
debe indicar:

```text
Motivo:
Implementación:
Documentación actualizada:
Pruebas ejecutadas:
Resultado:
Riesgos o pendientes:
```

La evidencia puede ser breve, pero no debe afirmar que una prueba pasó si no se
ejecutó.

## 10. Revisión periódica

Al cerrar cada sprint:

1. comparar SRS, backlog, código y pruebas;
2. revisar funciones sin documentación;
3. comprobar enlaces Markdown;
4. revisar cambios sin entrada de changelog;
5. confirmar que ADR y arquitectura reflejan la implementación;
6. revisar que clips y catálogos apunten a las mismas versiones.
