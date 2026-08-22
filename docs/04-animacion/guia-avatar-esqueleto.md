# Guía del avatar y esqueleto de animación

**Estado:** Borrador técnico

## Objetivo

Mantener un único avatar compatible con todas las animaciones del PMV y garantizar que
manos, rostro y torso puedan representar los componentes necesarios de LSC.

## Requisitos del modelo

- Topología apropiada para deformación de hombros, codos, muñecas y dedos.
- Cinco dedos completamente articulados en cada mano.
- Huesos suficientes para pulgar, metacarpos y falanges.
- Cuello, cabeza, ojos y torso animables.
- Claves de forma o esqueleto de animación facial para cejas, ojos, mejillas y boca.
- Materiales legibles y contraste entre manos, ropa y fondo.
- Sin accesorios que oculten manos, rostro o articulaciones.

## Jerarquía mínima propuesta

```text
RAIZ
└── CADERA
    ├── COLUMNA -> PECHO -> CUELLO -> CABEZA
    │   ├── OJO.I / OJO.D
    │   ├── CLAVICULA.I -> BRAZO.I -> ANTEBRAZO.I -> MANO.I -> DEDOS.I
    │   └── CLAVICULA.D -> BRAZO.D -> ANTEBRAZO.D -> MANO.D -> DEDOS.D
    └── PIERNAS
```

Los nombres definitivos se congelarán antes de producir el catálogo. Cambiar la
jerarquía después de animar requiere readaptación o reprocesamiento.

## Versionado

- Primera versión: `avatar-v1`.
- Un cambio compatible conserva versión menor.
- Cambiar nombres, jerarquía o pose base crea una versión mayor.
- Cada animación registra la versión exacta del esqueleto de animación.

## Pose neutral

Debe definirse una pose neutral lingüística y visualmente adecuada para iniciar y
terminar secuencias. La pose de reposo técnico del esqueleto de animación no debe asumirse
automáticamente como pose neutral comunicativa.

## Cámara e iluminación

- Plano medio que incluya cabeza, torso y espacio de articulación.
- Cámara estable, preferiblemente frontal con ligera perspectiva.
- Manos visibles incluso cerca del rostro o laterales.
- Luz suave sin sombras que oculten la configuración de los dedos.
- Fondo simple y contrastante.

## Control de calidad del esqueleto de animación

- [ ] No hay colapsos visibles en hombros y muñecas.
- [ ] Todos los dedos pueden adoptar configuraciones requeridas.
- [ ] Las manos no atraviesan el cuerpo o el rostro en animaciones aprobadas.
- [ ] Ojos, cejas, boca, cabeza y torso pueden animarse.
- [ ] El GLB mantiene la deformación por esqueleto, las claves de forma y las
  animaciones necesarias.
- [ ] El avatar funciona a 30 fotogramas por segundo en el dispositivo de referencia.
