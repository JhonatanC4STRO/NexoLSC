# Guía del avatar y rig

**Versión:** 0.1
**Estado:** Borrador técnico

## Objetivo

Mantener un único avatar compatible con todos los clips del MVP y garantizar que
manos, rostro y torso puedan representar los componentes necesarios de LSC.

## Requisitos del modelo

- Topología apropiada para deformación de hombros, codos, muñecas y dedos.
- Cinco dedos completamente articulados en cada mano.
- Huesos suficientes para pulgar, metacarpos y falanges.
- Cuello, cabeza, ojos y torso animables.
- Shape keys o rig facial para cejas, ojos, mejillas y boca.
- Materiales legibles y contraste entre manos, ropa y fondo.
- Sin accesorios que oculten manos, rostro o articulaciones.

## Jerarquía mínima propuesta

```text
ROOT
└── HIPS
    ├── SPINE -> CHEST -> NECK -> HEAD
    │   ├── EYE.L / EYE.R
    │   ├── CLAVICLE.L -> ARM.L -> FOREARM.L -> HAND.L -> FINGERS.L
    │   └── CLAVICLE.R -> ARM.R -> FOREARM.R -> HAND.R -> FINGERS.R
    └── LEGS
```

Los nombres definitivos se congelarán antes de producir el catálogo. Cambiar la
jerarquía después de animar requiere retargeting o reprocesamiento.

## Versionado

- Primera versión: `avatar-v1`.
- Un cambio compatible conserva versión menor.
- Cambiar nombres, jerarquía o pose base crea una versión mayor.
- Cada clip registra la versión exacta del rig.

## Pose neutral

Debe definirse una pose neutral lingüística y visualmente adecuada para iniciar y
terminar secuencias. La pose de reposo técnico del rig no debe asumirse
automáticamente como pose neutral comunicativa.

## Cámara e iluminación

- Plano medio que incluya cabeza, torso y espacio de articulación.
- Cámara estable, preferiblemente frontal con ligera perspectiva.
- Manos visibles incluso cerca del rostro o laterales.
- Luz suave sin sombras que oculten la configuración de los dedos.
- Fondo simple y contrastante.

## Control de calidad del rig

- [ ] No hay colapsos visibles en hombros y muñecas.
- [ ] Todos los dedos pueden adoptar configuraciones requeridas.
- [ ] Las manos no atraviesan cuerpo o rostro en clips aprobados.
- [ ] Ojos, cejas, boca, cabeza y torso pueden animarse.
- [ ] El GLB mantiene skinning, shape keys y Actions necesarias.
- [ ] El avatar funciona a 30 FPS en el dispositivo de referencia.
