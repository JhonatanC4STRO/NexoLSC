# Especificación de requisitos de software (ERS)

**Versión:** 0.1
**Estado:** Borrador
**Referencia:** estructura ligera inspirada en ISO/IEC/IEEE 29148:2018

## 1. Propósito

Definir requisitos verificables para el PMV de traducción de frases cortas en
español colombiano a animaciones de LSC mediante un avatar 3D.

## 2. Alcance y límites

El sistema admite únicamente intenciones pertenecientes al catálogo aprobado. El
sistema no se presenta como intérprete profesional y no se autoriza para
situaciones de alto riesgo.

## 3. Actores

- Emisor hispanohablante.
- Receptor usuario de LSC.
- Administrador/desarrollador del catálogo.
- Servicio externo de transcripción.

## 4. Requisitos funcionales

| ID | Requisito | Prioridad | Verificación |
|---|---|---:|---|
| RF-001 | El sistema permitirá escribir una frase en español. | Obligatoria | Prueba funcional |
| RF-002 | El sistema permitirá grabar audio corto con consentimiento del micrófono. | Obligatoria | Prueba funcional |
| RF-003 | El sistema enviará el audio al servidor para transcribirlo. | Obligatoria | Integración |
| RF-004 | El sistema mostrará la transcripción antes de traducir. | Obligatoria | Prueba interfaz de usuario |
| RF-005 | El usuario podrá corregir o volver a grabar la transcripción. | Obligatoria | Prueba interfaz de usuario |
| RF-006 | El motor clasificará el texto en una intención soportada o `NO_SOPORTADA`. | Obligatoria | Prueba unitaria |
| RF-007 | Cada intención soportada producirá un guion de señas versionado. | Obligatoria | Prueba unitaria |
| RF-008 | El avatar reproducirá en orden las animaciones del guion. | Obligatoria | Prueba visual |
| RF-009 | El usuario podrá pausar, repetir y seleccionar velocidad normal o lenta. | Recomendada | Prueba interfaz de usuario |
| RF-010 | El sistema mostrará un mensaje seguro ante frases no soportadas. | Obligatoria | Prueba funcional |
| RF-011 | El sistema no reproducirá una intención si falta una animación obligatoria. | Obligatoria | Prueba de error |
| RF-012 | La interfaz indicará los estados de grabación, procesamiento y reproducción. | Obligatoria | Prueba interfaz de usuario |
| RF-013 | Durante desarrollo, el sistema permitirá inspeccionar la intención y la versión del guion seleccionados. | Recomendada | Inspección |

## 5. Reglas de negocio

| ID | Regla |
|---|---|
| RN-001 | Solo se publican intenciones con estado lingüístico `VALIDADA`. |
| RN-002 | Una frase desconocida nunca se traduce mediante semejanza no validada por encima de un umbral arbitrario. |
| RN-003 | Todas las animaciones de un guion deben pertenecer a una versión compatible del esqueleto de animación. |
| RN-004 | La corrección escrita del usuario sustituye la transcripción original como entrada al clasificador. |
| RN-005 | El audio se elimina después de transcribirlo salvo consentimiento explícito para pruebas. |
| RN-006 | Los contenidos de alto riesgo se rechazan en el PMV con una advertencia clara. |

## 6. Interfaces externas

### Navegador

- Permiso de micrófono.
- Reproducción WebGL del avatar.
- Entrada táctil, teclado y puntero.

### Servidor

Interfaz preliminar:

- `POST /api/transcripciones`
- `POST /api/traducciones`
- `GET /api/intenciones/{id}` solo durante desarrollo o administración.
- `GET /api/salud`

La definición exacta se documentará mediante OpenAPI al implementar.

## 7. Datos de entrada y salida

Entrada principal: audio o texto en español.
Salida intermedia: transcripción e intención.
Salida final: guion de señas reproducible y metadatos de versión.

## 8. Restricciones

- Desarrollo y mantenimiento por una sola persona.
- Animaciones producidas manualmente en Blender.
- Los secretos de servicios externos permanecen exclusivamente en el servidor.
- El catálogo inicial debe funcionar sin un panel administrativo.
- El PMV empleará un solo avatar y una sola versión de esqueleto de animación.

## 9. Dependencias

- Acceso al micrófono autorizado por el usuario.
- Navegador con WebGL.
- Conexión de red para transcripción externa.
- Disponibilidad de animaciones y guiones validados.

## 10. Criterio de aceptación global

El PMV se acepta cuando diez escenarios completos recorren texto y voz hasta la
animación, los fallos producen un estado recuperable y las intenciones publicadas
superan el protocolo de validación lingüística.
