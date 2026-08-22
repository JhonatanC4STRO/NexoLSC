# Plan de sprints

**Versión:** 0.1
**Estado:** Propuesta
**Cadencia:** sprints de una semana

## Forma de trabajo para una persona

- Lunes: objetivo y selección de historias.
- Cada día: registro de cinco minutos con hecho, siguiente paso y bloqueo.
- Viernes: demostración grabada, revisión de métricas y retrospectiva breve.
- Limitar trabajo en curso a una historia principal.
- No representar roles Scrum como personas distintas; el propietario asume
  producto, desarrollo y pruebas, pero la validación LSC es externa.

## Sprint 0 — Reducir incertidumbre

**Objetivo:** demostrar que un clip validable viaja de Blender al navegador.

- Aprobar visión, no-objetivos y diez intenciones candidatas.
- Congelar `avatar-v1` o definir sus requisitos.
- Crear pose neutral y tres clips técnicos.
- Exportar GLB y reproducirlo en un visor web mínimo.
- Acordar protocolo de validación.

**Salida:** GLB de prueba, decisiones principales aprobadas y backlog listo.

## Sprint 1 — Vertical slice por texto

**Objetivo:** texto confirmado → intención → avatar para diez intenciones.

- Crear frontend y reproductor.
- Implementar catálogos JSON y validación de integridad.
- Implementar clasificación determinista.
- Reproducir guiones y manejar `NO_SOPORTADA`.
- Automatizar pruebas unitarias del catálogo.

**Salida:** flujo demostrable sin micrófono.

## Sprint 2 — Voz y recuperación

**Objetivo:** incorporar grabación y transcripción sin degradar el flujo por texto.

- Captura de audio y estados.
- Backend y servicio STT.
- Revisión/corrección del texto.
- Límites de archivo, errores y eliminación temporal.
- Pruebas de integración.

**Salida:** voz → texto confirmado → avatar.

## Sprint 3 — Contenido y controles

**Objetivo:** completar de 20 a 30 intenciones y mejorar reproducción.

- Incorporar clips validados.
- Revisar transiciones y marcadores no manuales.
- Pausa, repetición y velocidad lenta.
- Lista de expresiones soportadas.
- Optimización básica del GLB tras medir.

**Salida:** catálogo objetivo del MVP.

## Sprint 4 — Piloto

**Objetivo:** obtener evidencia de comprensión, usabilidad y rendimiento.

- Pruebas con usuarios de LSC y consentimiento.
- Corregir errores críticos de contenido.
- Auditoría básica de accesibilidad y privacidad.
- Medir latencia, FPS, peso y tasa de éxito.
- Desplegar una versión piloto claramente etiquetada.

**Salida:** informe de resultados y decisión continuar/cambiar/detener.

## Stop condition

El MVP termina cuando el flujo completo funciona, las intenciones publicadas están
validadas y se ejecutó el piloto. Características nuevas pasan a una fase posterior.
