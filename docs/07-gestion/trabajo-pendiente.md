# Trabajo pendiente inicial

**Versión:** 0.1
**Estado:** Borrador priorizado

Prioridades: `Obligatoria`, `Recomendada`, `Opcional`, `Fuera del PMV` para el PMV.

## Épicas

| ID | Épica | Resultado |
|---|---|---|
| EP-01 | Captura y revisión | Obtener texto correcto desde voz o teclado. |
| EP-02 | Traducción controlada | Convertir texto soportado en un guion validado. |
| EP-03 | Avatar 3D | Reproducir animaciones con controles básicos. |
| EP-04 | Contenido LSC | Producir, validar y versionar intenciones y animaciones. |
| EP-05 | Calidad y despliegue | Medir, proteger datos y ejecutar un piloto. |

## Historias obligatorias

### HU-01 — Ingresar una frase

Como emisor hispanohablante, quiero escribir o grabar una frase corta para iniciar
una traducción.

**Aceptación**

- Dado permiso de micrófono, cuando inicio y detengo una grabación menor de 10 s,
  entonces el sistema la envía a transcripción e indica el estado.
- Si el permiso falla, puedo continuar escribiendo.
- Una segunda acción de grabación no puede iniciarse mientras la primera se procesa.

### HU-02 — Corregir la transcripción

Como emisor, quiero revisar y corregir el texto reconocido para evitar traducir
una frase equivocada.

**Aceptación**

- La transcripción nunca se confirma automáticamente.
- Puedo editarla, cancelarla o volver a grabar.
- El motor recibe exactamente la versión confirmada.

### HU-03 — Resolver una intención soportada

Como usuario, quiero que una frase soportada seleccione el guion correcto.

**Aceptación**

- Los ejemplos positivos de una intención resuelven su ID.
- Los negativos no resuelven ese ID.
- Solo se devuelve un guion con estado `VALIDADA`.

### HU-04 — Reproducir el avatar

Como receptor usuario de LSC, quiero ver la secuencia completa para comprender la
intención.

**Aceptación**

- Las animaciones se reproducen en el orden del guion.
- Manos, rostro y torso permanecen en cuadro.
- Una animación faltante produce error y no una secuencia incompleta.

### HU-05 — Controlar la reproducción

Como receptor, quiero pausar, repetir y reducir la velocidad.

**Aceptación**

- Repetir reinicia la secuencia desde su estado definido.
- Pausar no reinicia la animación.
- La velocidad lenta no cambia el orden ni omite pasos.

### HU-06 — Manejar una frase no soportada

Como usuario, quiero una respuesta honesta cuando no exista traducción validada.

**Aceptación**

- No se reproduce ningún guion aproximado.
- Se permite editar el texto o consultar expresiones soportadas.
- El mensaje no culpa al usuario.

### HU-07 — Bloquear incompatibilidades

Como propietario, quiero detectar animaciones incompatibles antes de publicarlos.

**Aceptación**

- La validación falla si un guion referencia una animación inexistente.
- La validación falla si mezcla versiones incompatibles del esqueleto de animación.
- El error identifica el guion y la animación sin exponer secretos.

### HU-08 — Proteger audio y credenciales

Como usuario, quiero que el audio y las credenciales se manejen de forma segura.

**Aceptación**

- La clave del servicio de transcripción no aparece en el navegador.
- El servidor rechaza archivos fuera de límites.
- El audio temporal se elimina tras completar o fallar la solicitud.

## Historias Recomendada

- HU-09: precargar recursos esenciales y mostrar progreso.
- HU-10: mostrar una lista navegable de expresiones soportadas.
- HU-11: registrar errores técnicos sin almacenar texto completo por defecto.
- HU-12: ejecutar el flujo completo por teclado.

## Fuera del PMV del PMV

- HU-X1: conversación continua bidireccional.
- HU-X2: generación automática de señas.
- HU-X3: cuentas de usuario e historial.
- HU-X4: panel administrativo.
- HU-X5: traducción para emergencias o decisiones de alto riesgo.

## Criterios de preparación

Una historia puede entrar al iteración cuando tiene propósito, alcance, criterios de
aceptación, dependencias identificadas y contenido lingüístico disponible si lo
requiere.
