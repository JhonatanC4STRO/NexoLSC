# Wireframes de baja fidelidad

**Versión:** 0.2
**Estado:** Borrador; no representa el diseño visual definitivo

## Pantalla principal

```text
┌──────────────────────────────────────────────────────────────┐
│ Traductor Español → LSC                         [Ayuda]       │
├────────────────────────────┬─────────────────────────────────┤
│ Entrada en español         │ Avatar LSC                      │
│                            │                                 │
│ ┌────────────────────────┐ │        ┌──────────────┐         │
│ │ Escribe una frase...   │ │        │              │         │
│ └────────────────────────┘ │        │    AVATAR    │         │
│                            │        │              │         │
│ [ Mantén para hablar ]     │        └──────────────┘         │
│                            │                                 │
│ Estado: Listo              │ [⏮ Repetir] [⏯] [1× / 0.75×]   │
│                            │                                 │
│ [Traducir]                 │ Intención: —                    │
├────────────────────────────┴─────────────────────────────────┤
│ Solo cubre expresiones cotidianas validadas.                 │
└──────────────────────────────────────────────────────────────┘
```

## Revisión de transcripción

```text
┌──────────────────────────────────────────────┐
│ Confirma lo que entendimos                   │
│                                              │
│ ┌──────────────────────────────────────────┐ │
│ │ buenos días                             │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│ [Volver a grabar]        [Confirmar]         │
└──────────────────────────────────────────────┘
```

## Frase no soportada

```text
┌──────────────────────────────────────────────┐
│ Esta expresión aún no tiene una traducción   │
│ validada. No reproduciremos una aproximación.│
│                                              │
│ Puedes intentar una de estas opciones:       │
│ • Hola                                       │
│ • Gracias                                    │
│ • Necesito ayuda                             │
│                                              │
│ [Editar texto]            [Ver expresiones]  │
└──────────────────────────────────────────────┘
```

## Vista móvil

En pantallas estrechas, el avatar aparece primero durante la reproducción; el
panel de entrada queda debajo. Los controles no deben cubrir manos ni rostro.

## Pendientes de decisión

- [ ] Aprobar definitivamente el nombre `NexoLSC` y completar la revisión de marca.
- [ ] Crear los archivos finales definidos en la
  [identidad visual](../01-producto/identidad-visual.md).
- [ ] Prioridad visual entre texto y avatar.
- [ ] Si se muestra el identificador de intención fuera de modo desarrollo.
- [ ] Colores, tipografía y estilo del avatar.
