# Plan de pruebas

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
- Construcción del guion y respuesta segura.
- Normalización de vocales acentuadas, conservación de `Ñ` y mapeo de letras.
- Rechazo de números, símbolos y letras sin animación publicada.

### Integración

- Navegador → servidor con audio válido.
- Servidor → proveedor de transcripción mediante dobles de prueba y prueba controlada real.
- Servidor → motor → catálogo.
- Carga de GLB y enumeración de animaciones.
- Secuencia de deletreo → catálogo de letras → reproductor.

### De extremo a extremo

- Texto → confirmación → avatar.
- Voz → transcripción → corrección → avatar.
- Frase no soportada.
- Frase no soportada → elección y confirmación de deletreo → avatar.
- Permiso de micrófono rechazado.
- Error de red y recuperación.

### Visuales y 3D

- Encuadre y contraste.
- Deformación de dedos, muñecas y hombros.
- Componentes faciales.
- Transiciones y pose neutral.
- Fotogramas por segundo, carga y comportamiento móvil.

### Lingüísticas

- Revisión experta por versión.
- Comprensión sin mostrar el texto.
- Variantes regionales y contexto.
- Negativos que podrían confundirse con una intención.
- Reconocimiento de letras aisladas y palabras deletreadas, sin mostrar el texto.

### Seguridad y privacidad

- Claves ausentes del paquete compilado.
- Rechazo de archivos grandes o tipos inválidos.
- Eliminación de archivos temporales.
- Registros sin audio ni texto completo por defecto.
- Mensajes de error sin información interna sensible.

## Entornos

- Desarrollo local con transcripción simulada.
- Integración con credencial separada y audios de prueba consentidos.
- Piloto desplegado con catálogo congelado.

## Datos de prueba

- Banco versionado de frases sintéticas o grabadas con consentimiento.
- Ejemplos positivos, negativos, ambiguos, vacíos y fuera de dominio.
- No almacenar grabaciones personales en el repositorio.

## Criterios de entrada al piloto

- Todos los requisitos obligatorios pasan las pruebas automatizadas aplicables.
- Cero defectos críticos abiertos.
- Catálogo publicado validado.
- Flujo de privacidad revisado.
- Rendimiento medido en los dispositivos de referencia.

## Criterios de suspensión

Suspender pruebas con usuarios si se detecta traducción potencialmente dañina,
falta de consentimiento, exposición de datos o una versión no validada del avatar.
