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

Cada cambio relevante actualiza `CAMBIOS.md` y se guarda en una confirmación
pequeña de Git.
La razón de decisiones difíciles de revertir se registra en un RDA.

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
- **Efectos:** red, archivos, estado, registros o servicios externos.
- **Errores:** condiciones y forma en que se representan.
- **Privacidad:** tratamiento de audio, texto o datos identificables.
- **Relación:** requisito, historia, regla o RDA relevante.

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
 * @param texto Texto español corregido y confirmado por el usuario.
 * @param catalogo Catálogo inmutable utilizado durante la solicitud.
 * @returns Una intención validada o el resultado explícito `no_soportada`.
 * @throws {ErrorIntegridadCatalogo} Si un guion publicado referencia animaciones inválidas.
 */
export function resolverIntencion(
  texto: string,
  catalogo: CatalogoPublicado,
): ResultadoTraduccion {
  // Implementación.
}
```

Ejemplo para una función con efectos:

```ts
/**
 * Envía audio temporal al proveedor de transcripción y elimina el archivo al finalizar.
 *
 * Centraliza el ciclo de vida del audio para cumplir RNF-007 incluso cuando la
 * transcripción falla o la solicitud es cancelada.
 *
 * @param rutaAudio Ruta temporal creada por el servidor.
 * @returns Texto transcrito por el proveedor.
 * @throws {ErrorTranscripcion} Si el proveedor rechaza o no procesa el audio.
 *
 * Efectos: realiza una solicitud de red y elimina `rutaAudio` en un bloque final.
 */
async function transcribirYEliminar(rutaAudio: string): Promise<string> {
  // Implementación.
}
```

Las etiquetas `@param`, `@returns` y `@throws` se conservan porque forman parte de
la sintaxis de TSDoc. Los efectos se describen en español dentro del párrafo
principal.

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
// PENDIENTE(NEXO-12): separar el GLB cuando supere el presupuesto RNF-004.
```

## 6. Documentación de operaciones de API y datos

- Cada operación de API se documenta mediante OpenAPI.
- Debe incluir propósito, autenticación, entrada, salida, errores y ejemplo.
- Los esquemas JSON tienen descripción de campos y reglas de integridad.
- Los identificadores de requisitos se enlazan cuando implementan una regla crítica.
- Nunca se incluyen claves, audios reales ni datos personales en ejemplos.

## 7. Documentación de animaciones

Cada Acción de Blender registra:

- intención y contexto;
- nombre exacto y versión del esqueleto de animación;
- referencia autorizada;
- componentes manuales y no manuales;
- fotogramas, duración, pose inicial y final;
- revisión técnica y LSC;
- archivo exportado y suma de comprobación.

Los cambios de una Acción aprobada crean una nueva versión y una entrada en el
registro de cambios; no se reemplaza silenciosamente un archivo validado.

## 8. Registro de cambios

`CAMBIOS.md` usa las secciones:

- `Añadido`;
- `Cambiado`;
- `Corregido`;
- `Eliminado`;
- `Seguridad`;
- `Pendiente`, solo mientras no exista una primera versión ejecutable.

No se registran correcciones ortográficas aisladas sin efecto en el contenido. Sí
se registran cambios en requisitos, comportamiento, datos, arquitectura,
traducciones, animaciones, privacidad y dependencias.

## 9. Evidencia antes de confirmar en Git

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

Al cerrar cada iteración:

1. comparar ERS, trabajo pendiente, código y pruebas;
2. revisar funciones sin documentación;
3. comprobar enlaces Markdown;
4. revisar cambios sin entrada en el registro de cambios;
5. confirmar que RDA y arquitectura reflejan la implementación;
6. revisar que animaciones y catálogos apunten a las mismas versiones.

## 11. Idioma obligatorio

Toda documentación, interfaz, mensaje, comentario y nombre controlado por el
proyecto se escribe en español. Esto incluye variables, funciones, tipos del
dominio, rutas propias, ramas, títulos de solicitudes de cambio, descripciones y
mensajes de confirmación en Git. Estos mensajes deben ser breves, naturales y
fáciles de entender, según la guía de contribución.

Solo se conservan sin traducción los nombres propios o la sintaxis impuestos por
una herramienta o estándar, por ejemplo: Git, GitHub, Blender, TypeScript, JSON,
GLB, glTF, OpenAPI, TSDoc, nombres de dependencias, etiquetas como `@param` y
archivos reconocidos automáticamente como `README.md`, `.gitignore` y
`.gitattributes`.

Cuando una API externa exija un campo en inglés, se encapsula en el límite de la
integración y el resto del proyecto utiliza su equivalente en español.
