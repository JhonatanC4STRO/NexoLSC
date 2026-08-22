# ADR-003: Distribución inicial del avatar y clips

**Estado:** Propuesta
**Fecha:** 2026-08-22

## Contexto

Es necesario decidir si cada seña se entrega como archivo independiente o si el
avatar contiene varias `AnimationClip`.

## Decisión propuesta

Durante el primer vertical slice se exportará un único GLB con el avatar, pose
neutral y el conjunto inicial de clips. Los guiones referenciarán los nombres de
las Actions incluidas.

## Consecuencias

- Carga e implementación simples.
- Todas las animaciones comparten rig y materiales.
- Agregar una seña obliga a generar una nueva versión del GLB.
- El peso crecerá con el catálogo.

## Disparador para revisar

Separar animaciones o cargar paquetes cuando el GLB supere el presupuesto de peso
o cuando la actualización de un clip afecte de forma material el despliegue.
