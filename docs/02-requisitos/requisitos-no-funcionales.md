# Requisitos no funcionales

**Versión:** 0.1
**Estado:** Borrador; los umbrales requieren medición y ajuste

| ID | Categoría | Requisito medible | Condición |
|---|---|---|---|
| RNF-001 | Rendimiento | La interfaz de usuario responderá a una interacción en menos de 200 ms, excluyendo servicios externos. | Equipo de referencia |
| RNF-002 | Latencia | La animación comenzará en menos de 4 s tras confirmar texto. | p95, red estable |
| RNF-003 | Animación | El reproductor mantendrá al menos 30 fotogramas por segundo. | Dispositivo de referencia |
| RNF-004 | Peso | El avatar inicial y sus recursos críticos no excederán 15 MB comprimidos. | **POR CONFIRMAR** |
| RNF-005 | Disponibilidad | Un fallo del servicio de transcripción permitirá continuar mediante texto. | Siempre |
| RNF-006 | Seguridad | Ninguna clave o secreto se incluirá en el paquete compilado del navegador. | Inspección de compilación |
| RNF-007 | Privacidad | El audio se eliminará al terminar la transcripción, salvo consentimiento de prueba. | Servidor y proveedor |
| RNF-008 | Accesibilidad | Todos los controles tendrán nombre accesible, foco visible y operación por teclado. | Auditoría |
| RNF-009 | Comprensibilidad | Manos, rostro y torso permanecerán visibles durante la seña. | Revisión visual |
| RNF-010 | Compatibilidad | Se soportarán las dos últimas versiones estables de Chrome, Edge y Firefox. | **POR CONFIRMAR** |
| RNF-011 | Mantenibilidad | Intenciones y guiones podrán modificarse sin cambiar el reproductor 3D. | Prueba de cambio |
| RNF-012 | Trazabilidad | Toda intención publicada tendrá fuente, versión, validador y fecha. | Inspección del catálogo |
| RNF-013 | Observabilidad | Los errores tendrán código y contexto técnico sin guardar audio ni texto sensible completo. | Prueba de registros |
| RNF-014 | Recuperación | La aplicación volverá a estado listo después de cualquier error recuperable. | Prueba de estados |

## Condiciones de referencia por definir

- Modelo de teléfono y computador.
- Navegador y resolución.
- Velocidad y latencia de red.
- Tamaño del audio y número de animaciones precargadas.
