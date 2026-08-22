# RDA-004: Deletreo manual como salida explícita

**Estado:** Aceptada
**Fecha:** 2026-08-22

## Contexto

El catálogo cerrado no puede contener todos los nombres propios, marcas, siglas o
términos nuevos. El alfabeto manual permite representar su escritura, pero una
secuencia de letras no equivale a una traducción gramatical a LSC.

## Decisión

El PMV incluirá un modo de deletreo manual construido exclusivamente con
animaciones de letras validadas. Cuando una entrada no tenga una traducción
disponible, la aplicación podrá ofrecer deletrearla, pero solo después de que el
usuario elija y confirme esa opción.

La salida se identificará como `DELETREO_MANUAL` y nunca como `TRADUCCION_LSC`.
El motor seguirá devolviendo `NO_SOPORTADA` antes de presentar las alternativas.

## Reglas

- Priorizar siempre un guion LSC validado cuando exista.
- No activar el deletreo automáticamente.
- Mostrar el texto exacto antes de reproducirlo.
- Utilizar únicamente letras publicadas y compatibles con el avatar.
- Bloquear la secuencia completa si falta una letra.
- Informar que el resultado representa español deletreado manualmente.
- Rechazar números y símbolos durante el PMV sin eliminarlos silenciosamente.

## Consecuencias positivas

- Permite comunicar nombres propios, siglas y términos fuera del catálogo.
- Desbloquea una presentación con nombre variable.
- Reutiliza el mismo reproductor, catálogo y GLB.
- Mantiene una salida determinista y verificable.

## Costos y límites

- Agrega 27 animaciones y sus transiciones al trabajo de Blender.
- Deletrear frases completas puede ser lento y poco natural.
- Cada letra y las secuencias de prueba requieren validación con usuarios de LSC.
- No amplía la gramática ni el vocabulario validado del traductor.

## Alternativas descartadas

- Deletrear automáticamente toda frase desconocida: puede confundirse con una
  traducción y oculta la falta de cobertura.
- Generar una seña mediante inteligencia artificial: no garantiza fidelidad ni
  forma parte del PMV.
- Crear animaciones para números y símbolos ahora: amplía el alcance antes de
  validar el uso del alfabeto.
