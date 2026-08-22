# Registro de cambios

Los cambios relevantes de NexoLSC se registran en este archivo. Las etiquetas de
Git identifican hitos documentales y versiones ejecutables según la
[política de versiones](docs/09-desarrollo/politica-versiones.md).

## [Sin publicar]

## [0.1.0-documentacion] - 2026-08-22

### Añadido

- Documentación inicial de visión, alcance, personas, escenarios y glosario.
- ERS ligera, requisitos no funcionales y matriz de trazabilidad.
- Especificación español–LSC, catálogos y protocolo de validación lingüística.
- Guías del avatar, esqueleto de animación, animaciones y flujo de trabajo Blender–GLB.
- Listado de 20 intenciones y orden de producción de animaciones del PMV.
- Flujos, bocetos y requisitos de accesibilidad.
- Arquitectura C4, modelo de datos, secuencias, estados y RDA iniciales.
- Trabajo pendiente, plan de iteraciones, riesgos y definición de terminado.
- Plan, casos y métricas de pruebas.
- Propuesta de nombre e identidad visual de NexoLSC.
- Política de documentación de código y gestión de cambios.
- Configuración inicial para Git, archivos ignorados y Git LFS para recursos 3D.
- Estructura propuesta del repositorio, con responsabilidades y dependencias entre
  interfaz, servidor, contratos, catálogos y recursos 3D.
- Plan de 27 animaciones para el alfabeto manual, con reglas de normalización,
  reproducción, validación y palabras de prueba.
- Decisión arquitectónica para ofrecer deletreo por elección sin confundirlo con
  una traducción a LSC.
- Política de versiones mediante historial y etiquetas de Git.

### Cambiado

- El modelo de datos y el catálogo de señas utilizan nombres, tipos y campos en
  español, incluidos los ejemplos JSON relacionados.
- La decisión del conjunto tecnológico explica el papel limitado de Drei en la
  carga del GLB y el control de las animaciones del avatar.
- Las confirmaciones, ramas y descripciones deben usar español sencillo y mensajes
  breves que reflejen la forma de escribir del responsable del proyecto.
- Requisitos, historias, flujos, arquitectura, datos, riesgos, pruebas y métricas
  incorporan el modo de deletreo manual.
- Los documentos dejan de mantener números de versión manuales; los hitos completos
  se identifican mediante etiquetas de Git.
- El índice documental describe el propósito de cada archivo.
- El documento de personas incorpora un flujo detallado de interacción.
- El español pasa a ser el idioma obligatorio para documentación, interfaz,
  comentarios, nombres del dominio y mensajes de confirmación en Git.
- Las siglas y términos de gestión se adaptan a `PMV`, `ERS`, `RDA`, iteraciones y
  prioridades en español.

### Pendiente

- Aprobar el nombre NexoLSC y completar la consulta de antecedentes de marca.
- Validar el contenido lingüístico con personas competentes en LSC.
- Crear el avatar, el esqueleto de animación y las primeras tres animaciones de prueba.
- Iniciar la implementación de la Iteración 1.
