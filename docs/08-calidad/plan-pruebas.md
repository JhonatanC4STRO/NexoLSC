# Plan de pruebas

**Versión:** 0.1
**Estado:** Borrador

## Objetivo

Comprobar que el sistema produce únicamente guiones aprobados, reproduce el
avatar de forma legible, protege la entrada de audio y se recupera de fallos.

## Niveles de prueba

### Unitarias

- Normalización de texto.
- Clasificación de intenciones.
- Entradas positivas y negativas.
- Integridad de catálogos y versiones.
- Construcción del guion y fallback.

### Integración

- Navegador → backend con audio válido.
- Backend → proveedor STT mediante dobles de prueba y prueba controlada real.
- Backend → motor → catálogo.
- Carga de GLB y enumeración de clips.

### End-to-end

- Texto → confirmación → avatar.
- Voz → transcripción → corrección → avatar.
- Frase no soportada.
- Permiso de micrófono rechazado.
- Error de red y recuperación.

### Visuales y 3D

- Encuadre y contraste.
- Deformación de dedos, muñecas y hombros.
- Componentes faciales.
- Transiciones y pose neutral.
- FPS, carga y comportamiento móvil.

### Lingüísticas

- Revisión experta por versión.
- Comprensión sin mostrar el texto.
- Variantes regionales y contexto.
- Negativos que podrían confundirse con una intención.

### Seguridad y privacidad

- Claves ausentes del bundle.
- Rechazo de archivos grandes o tipos inválidos.
- Eliminación de archivos temporales.
- Logs sin audio ni texto completo por defecto.
- Mensajes de error sin información interna sensible.

## Entornos

- Desarrollo local con STT simulado.
- Integración con credencial separada y audios de prueba consentidos.
- Piloto desplegado con catálogo congelado.

## Datos de prueba

- Banco versionado de frases sintéticas o grabadas con consentimiento.
- Ejemplos positivos, negativos, ambiguos, vacíos y fuera de dominio.
- No almacenar grabaciones personales en el repositorio.

## Criterios de entrada al piloto

- Todos los Must pasan pruebas automatizadas aplicables.
- Cero defectos críticos abiertos.
- Catálogo publicado validado.
- Flujo de privacidad revisado.
- Rendimiento medido en los dispositivos de referencia.

## Criterios de suspensión

Suspender pruebas con usuarios si se detecta traducción potencialmente dañina,
falta de consentimiento, exposición de datos o una versión no validada del avatar.
