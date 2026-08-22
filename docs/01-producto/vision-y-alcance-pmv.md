# Visión y alcance del PMV

**Versión:** 0.1
**Estado:** Borrador para aprobación

## 1. Problema

En interacciones cotidianas, una persona que habla español y una persona usuaria
de LSC pueden no compartir una lengua. Las herramientas genéricas de traducción
de texto no representan adecuadamente una lengua visual y espacial ni sus
componentes no manuales.

## 2. Visión

Crear una aplicación web que reciba una frase corta en español colombiano,
muestre su transcripción y reproduzca mediante un avatar 3D una traducción a LSC
previamente definida y validada para un dominio cerrado.

## 3. Hipótesis de valor

Si una persona puede expresar una intención cotidiana mediante voz y obtener una
animación comprensible en LSC, podrá apoyar una interacción básica sin aprender
previamente a operar herramientas complejas.

La hipótesis se considerará respaldada cuando usuarios de LSC comprendan al menos
el 80 % de las intenciones del piloto sin ver el texto fuente. Este umbral es
inicial y está **POR CONFIRMAR**.

## 4. Usuarios

- Usuario emisor: persona hispanohablante que graba o escribe una frase.
- Usuario receptor: persona sorda o usuaria de LSC que observa el avatar.
- Propietario del producto: única persona desarrolladora del PMV.
- Validador lingüístico externo: persona sorda usuaria de LSC o profesional
  competente en LSC–español.

## 5. Alcance incluido

- Idioma de entrada: español de Colombia (`es-CO`).
- Lengua de salida: Lengua de Señas Colombiana.
- Entrada por texto y por grabación corta, de máximo 10 segundos.
- Dominio de saludos, cortesía y necesidades cotidianas.
- Entre 20 y 30 intenciones validadas.
- Catálogo inicial de 40 a 60 animaciones reutilizables.
- Revisión de la transcripción antes de reproducir.
- Repetición, pausa y velocidad normal/lenta.
- Mensaje explícito cuando la intención no esté soportada.

## 6. No-objetivos

- No traducir cualquier oración del español.
- No sustituir palabras una a una.
- No traducir LSC a español.
- No interpretar conversaciones continuas.
- No generar señas o animaciones con IA.
- No cubrir comunicaciones médicas, legales o de emergencia.
- No afirmar equivalencia con un intérprete profesional.
- No crear aplicaciones móviles nativas durante el PMV.

## 7. Resultado observable del PMV

Una persona abre la aplicación, graba una frase soportada, confirma la
transcripción y ve al avatar reproducir el guion LSC correcto. Si la frase no está
soportada, la aplicación lo informa sin inventar una traducción.

## 8. Indicadores de éxito iniciales

- 100 % de las intenciones publicadas tienen validación lingüística registrada.
- Al menos 80 % de comprensión por participantes usuarios de LSC.
- Al menos 90 % de identificación de la intención en frases del banco de prueba.
- Inicio de la animación en menos de 4 segundos después de confirmar el texto,
  bajo las condiciones de referencia.
- Cero traducciones inventadas ante entradas no soportadas.

## 9. Supuestos por confirmar

- [ ] La lengua objetivo será exclusivamente LSC.
- [ ] El dialecto de entrada principal será `es-CO`.
- [ ] El primer dominio será saludos y necesidades cotidianas.
- [ ] Se podrá contar con al menos una persona validadora de LSC.
- [ ] Se acepta utilizar un servicio externo para transcribir audio.
- [ ] La aplicación será inicialmente una web de escritorio y móvil.
