# Flujo de trabajo Blender → GLB → aplicación

**Versión:** 0.1
**Estado:** Borrador técnico

## Flujo

```mermaid
flowchart LR
    A[Referencia LSC autorizada] --> B[Animación en Blender]
    B --> C[Revisión lingüística]
    C -->|Ajustar| B
    C -->|Aprobar| D[Acción / NLA versionada]
    D --> E[Exportación GLB]
    E --> F[Visor glTF independiente]
    F --> G[Prueba en Three.js]
    G --> H[Catálogo publicado]
```

## Archivo fuente

Estructura propuesta:

```text
recursos/
├── blender/
│   ├── avatar-v1.blend
│   └── referencias/
├── exportaciones/
│   └── avatar-v1.glb
└── catalogo/
    ├── senas.json
    └── intenciones.json
```

Los archivos Blender y GLB se incorporarán cuando existan. Las referencias deben
tener origen y permiso de uso registrados.

## Preparación en Blender

1. Trabajar con el esqueleto de animación `avatar-v1` sin renombrar huesos.
2. Crear una Acción con la convención acordada.
3. Incluir la Acción en el mecanismo que el exportador glTF vaya a exportar.
4. Revisar el rango, pose inicial, pose final y claves de forma.
5. Aplicar u hornear restricciones no compatibles.
6. Guardar una nueva versión antes de cambios destructivos.

## Perfil de exportación inicial

- Formato: binario de glTF (`.glb`).
- Incluir: malla, armadura, deformación por esqueleto, animaciones y claves de
  forma requeridas.
- Excluir: cámaras, luces y objetos de control que no use la aplicación.
- Exportar huesos de deformación y dependencias necesarias.
- Muestrear animaciones si las restricciones o los controladores lo requieren.
- Compresión de texturas y geometría: decidir después de medir calidad y peso.

## Verificación después de exportar

- Abrir el archivo en un visor glTF independiente.
- Enumerar los nombres de `AnimationClip`.
- Reproducir cada animación individualmente.
- Verificar pose neutral, manos, rostro, materiales y escala.
- Cargarlo con el reproductor real y probar fundidos cruzados.
- Registrar peso, tiempo de carga y fotogramas por segundo.

## Criterio de salida de la Iteración 0

Un GLB contiene pose neutral y tres animaciones de prueba, se reproduce en un navegador
y conserva movimientos de dedos y al menos un componente facial.
