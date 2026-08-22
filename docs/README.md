# Índice de documentación

**Versión:** 0.6
**Fecha:** 2026-08-22
**Estado:** Borrador para revisión

## Cómo revisar estos documentos

1. Revisar primero la visión, el alcance y los supuestos.
2. Corregir las decisiones marcadas como **POR CONFIRMAR**.
3. Validar la especificación lingüística con una persona sorda usuaria de LSC o
   con un profesional competente en LSC–español.
4. Convertir los requisitos aceptados en historias listas para la Iteración 1.

## Documentos

### Puntos de entrada

- [README principal](../README.md) — presenta el propósito general del proyecto,
  su alcance preliminar y conduce a esta documentación.
- **Este índice (`docs/README.md`)** — explica el orden recomendado de lectura,
  resume para qué sirve cada archivo y define cuándo existe información suficiente
  para comenzar a programar.

### Producto

- [Identidad visual de NexoLSC](01-producto/identidad-visual.md) — define el
  significado y uso del nombre, lema, propósito, personalidad, concepto del
  logotipo, paleta accesible, tipografía, iconografía, avatar, tono verbal, variables
  de desarrollo y entregables gráficos pendientes.
- [Visión y alcance del PMV](01-producto/vision-y-alcance-pmv.md) — define el
  problema, la propuesta de valor, los usuarios, lo que incluye y excluye el PMV,
  sus indicadores de éxito y los supuestos que todavía deben confirmarse.
- [Personas y escenarios](01-producto/personas-y-escenarios.md) — describe quién
  utilizará el producto, sus necesidades y riesgos, y muestra mediante un diagrama
  detallado cómo transcurre una interacción principal y sus alternativas.
- [Glosario](01-producto/glosario.md) — unifica el significado de términos como
  LSC, intención, guion de señas, glosa, animación, esqueleto de animación, PMV, RDA y respuesta segura para evitar
  interpretaciones diferentes entre documentos.

### Requisitos

- [Especificación de requisitos (ERS)](02-requisitos/especificacion-requisitos-ers.md)
  — concentra el propósito, actores, requisitos funcionales, reglas de negocio,
  interfaces, restricciones y criterio de aceptación global del sistema.
- [Requisitos no funcionales](02-requisitos/requisitos-no-funcionales.md) — fija
  condiciones medibles de rendimiento, seguridad, privacidad, accesibilidad,
  compatibilidad, mantenibilidad y recuperación ante errores.
- [Matriz de trazabilidad](02-requisitos/matriz-trazabilidad.md) — relaciona cada
  necesidad con requisitos, historias de usuario, casos de prueba y métricas; sirve
  para comprobar que nada importante quede sin implementar o verificar.

### Lingüística

- [Especificación español–LSC](03-linguistica/especificacion-espanol-lsc.md) —
  establece cómo pasar de un enunciado español a una intención y luego a un guion
  LSC validado, incluyendo normalización, variación y comportamiento ante entradas
  no soportadas.
- [Catálogo de intenciones](03-linguistica/catalogo-intenciones.md) — enumera las
  situaciones comunicativas que el PMV podrá reconocer, sus ejemplos españoles,
  prioridad y estado de validación.
- [Catálogo de señas](03-linguistica/catalogo-senas.md) — define los campos y las
  convenciones necesarias para registrar cada seña o animación, junto con versión del
  esqueleto de animación, región, fuente y evidencia de validación.
- [Protocolo de validación LSC](03-linguistica/protocolo-validacion-lsc.md) — indica
  cómo revisar lingüísticamente guiones y animaciones, cómo realizar pruebas de
  comprensión y qué evidencia se necesita antes de publicar contenido.

### Animación

- [Listado de animaciones del PMV](04-animacion/listado-animaciones-pmv.md) —
  transforma las 20 intenciones en una orden concreta de producción para Blender,
  separada en pose neutral, diez Acciones esenciales, nueve de ampliación y una
  intención bloqueada; también incluye estados, Criterios de preparación y ficha por
  Acción.
- [Guía del avatar y esqueleto de animación](04-animacion/guia-avatar-esqueleto.md) — especifica los
  requisitos del modelo 3D, esqueleto, manos, rostro, pose neutral, cámara,
  iluminación, versionado y control de calidad del esqueleto de animación.
- [Convenciones de animaciones](04-animacion/convenciones-animaciones.md) — define
  cómo nombrar Acciones y animaciones, trabajar la línea de tiempo, configurar curvas y
  tratar transiciones entre señas de forma consistente.
- [Flujo de trabajo Blender–GLB](04-animacion/flujo-blender-glb.md) — documenta el flujo
  desde una referencia LSC autorizada hasta Blender, exportación GLB, revisión en
  un visor glTF, prueba en Three.js y publicación en el catálogo.

### Diseño

- [Flujo de usuario](05-diseno/flujo-usuario.md) — muestra las rutas por voz y
  texto, los estados visibles de la interfaz y el comportamiento esperado durante
  grabación, revisión, traducción, reproducción y errores.
- [Bocetos](05-diseno/bocetos.md) — contiene bocetos de baja fidelidad para
  la pantalla principal, confirmación de transcripción, frase no soportada y vista
  móvil; sirve como base antes del diseño visual definitivo.
- [Accesibilidad](05-diseno/accesibilidad.md) — reúne criterios para teclado,
  lector de pantalla, contraste, escalado de texto, movimiento, controles táctiles
  y legibilidad visual del avatar.

### Arquitectura

- [Arquitectura C4](06-arquitectura/arquitectura-c4.md) — explica el contexto y
  los contenedores principales: aplicación web, reproductor 3D, servidor, servicio
  de transcripción, motor de traducción, catálogos y recursos GLB.
- [Modelo de datos](06-arquitectura/modelo-datos.md) — define las entidades y
  relaciones entre intenciones, ejemplos, guiones, pasos, animaciones, versiones del esqueleto de animación
  y registros de validación, con ejemplos JSON.
- [Diagramas de secuencia y estados](06-arquitectura/diagramas-secuencia.md) —
  representa las interacciones temporales de voz a avatar, los estados de la
  interfaz y el proceso para publicar una nueva seña.
- [Registro de decisiones arquitectónicas](06-arquitectura/decisiones-rda/README.md)
  — funciona como índice de decisiones técnicas importantes y muestra si están
  propuestas, aceptadas, reemplazadas o rechazadas.
- [RDA-001: Conjunto tecnológico del PMV](06-arquitectura/decisiones-rda/RDA-001-tecnologias-pmv.md)
  — propone React, TypeScript, Vite, Three.js, React Three Fiber, Node.js,
  Fastify, JSON, el servicio de transcripción y las herramientas de pruebas.
- [RDA-002: Traducción determinista](06-arquitectura/decisiones-rda/RDA-002-traduccion-determinista.md)
  — justifica reconocer únicamente intenciones y guiones validados, devolviendo
  `NO_SOPORTADA` en lugar de generar traducciones libres.
- [RDA-003: GLB único con animaciones](06-arquitectura/decisiones-rda/RDA-003-glb-unico-con-animaciones.md)
  — explica por qué el primer PMV distribuirá un avatar con varias animaciones dentro de
  un único GLB y cuándo convendría revisar esa decisión.

### Gestión

- [Trabajo pendiente](07-gestion/trabajo-pendiente.md) — organiza épicas, historias de usuario,
  prioridades y criterios de aceptación; es la fuente para seleccionar el trabajo
  de cada iteración.
- [Plan de iteraciones](07-gestion/plan-iteraciones.md) — divide el PMV desde la Iteración 0
  hasta el piloto, asigna un objetivo y una salida observable a cada semana y fija
  la condición para detener el desarrollo del PMV.
- [Registro de riesgos](07-gestion/riesgos.md) — identifica riesgos lingüísticos,
  técnicos, legales, operativos y de alcance, calcula su exposición y establece
  mitigaciones y disparadores.
- [Definición de terminado](07-gestion/definicion-de-terminado.md) — contiene las
  listas que deben cumplirse para declarar terminados una historia, una intención
  LSC, una animación de Blender y una iteración.

### Calidad

- [Plan de pruebas](08-calidad/plan-pruebas.md) — define niveles de prueba,
  entornos, datos, controles de seguridad y criterios para iniciar o suspender el
  piloto.
- [Casos de prueba](08-calidad/casos-prueba.md) — proporciona escenarios
  verificables para captura, transcripción, clasificación, reproducción, errores,
  privacidad, accesibilidad y comprensión lingüística.
- [Métricas del PMV](08-calidad/metricas-pmv.md) — especifica cómo medir por
  separado transcripción, clasificación, comprensión, rendimiento, experiencia,
  integridad y privacidad, y cómo decidir si continuar, cambiar o detener.

### Desarrollo y cambios

- [Guía de contribución](../CONTRIBUIR.md) — define el flujo obligatorio para
  implementar, documentar, probar, registrar, confirmar y subir cada cambio.
- [Estándar de documentación y cambios](09-desarrollo/estandar-documentacion-y-cambios.md)
  — especifica cómo documentar cada función, módulo, operación de API, dato y animación,
  con ejemplos TSDoc y reglas para explicar propósito, motivo y funcionamiento.
- [Registro de cambios](../CAMBIOS.md) — conserva un resumen legible de las
  funcionalidades, correcciones, decisiones y pendientes acumulados por versión.

### Fuentes

- [Referencias normativas y técnicas](REFERENCIAS.md) — reúne las fuentes oficiales
  empleadas para requisitos, LSC, Blender, glTF, Three.js, React Three Fiber y
  transcripción de voz, además de sus advertencias de uso.

## Condición para empezar a programar

Se puede iniciar la Iteración 1 cuando estén aprobados:

- el problema, el usuario y los no-objetivos;
- al menos diez intenciones del catálogo;
- el formato del guion de señas;
- tres animaciones de prueba exportadas correctamente desde Blender;
- las historias HU-01 a HU-04 y sus criterios de aceptación.
