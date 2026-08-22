# Especificación lingüística español–LSC

**Versión:** 0.1
**Estado:** Borrador no validado
**Advertencia:** este documento requiere revisión de una persona competente en LSC.

## 1. Principio central

La LSC no se modelará como español representado con las manos. El sistema
reconoce una intención dentro de un dominio cerrado y selecciona un guion de LSC
previamente validado.

## 2. Flujo lingüístico

```text
enunciado español
  -> normalización limitada
  -> identificación de intención
  -> selección de variante aprobada
  -> guion de señas
  -> animaciones y marcadores no manuales
```

## 3. Entrada

- Español de Colombia.
- Frases cortas, idealmente una intención por turno.
- Mayúsculas, tildes y puntuación no deben alterar la intención cuando no cambien
  el significado.
- No se conservarán muletillas irrelevantes para clasificar una intención.

## 4. Salida: guion de señas

Ejemplo ilustrativo, no validado lingüísticamente:

```json
{
  "idIntencion": "SALUDO_HOLA",
  "versionGuion": "0.1.0",
  "versionEsqueleto": "avatar-v1",
  "pasos": [
    {
      "idAnimacion": "LSC_SALUDO_HOLA_V1",
      "velocidad": 1.0,
      "pausaMilisegundos": 150,
      "componentesNoManuales": null
    }
  ]
}
```

El ejemplo define una estructura técnica; no certifica que el movimiento
asociado sea correcto.

## 5. Componentes mínimos de una seña

El catálogo podrá registrar:

- configuración de una o ambas manos;
- orientación;
- ubicación;
- movimiento;
- contacto;
- uso del espacio;
- componentes faciales, de cabeza, mirada y torso;
- variante regional o contextual;
- transiciones relevantes.

## 6. Estrategia del PMV

1. Definir intenciones comunicativas completas.
2. Recopilar formas frecuentes de expresarlas en español.
3. Acordar el guion de LSC con el validador.
4. Animar y revisar el guion.
5. Publicarlo solo después de aprobar comprensión y fidelidad.

## 7. Normalización permitida

- Conversión a minúsculas para comparar.
- Eliminación de espacios repetidos.
- Equivalencias escritas aprobadas: “hola”, “buenas”.
- Corrección manual del usuario.

No se permite inferir libremente sinónimos ni construir gramática LSC mediante un
modelo generativo durante el PMV.

## 8. Frase no soportada

Salida obligatoria:

```json
{
  "estado": "no_soportada",
  "mensaje": "Esta expresión todavía no tiene una traducción validada."
}
```

Opcionalmente se podrá sugerir una lista cerrada de intenciones soportadas, sin
afirmar que una de ellas equivale a la entrada.

## 9. Variación

Cada seña o guion debe registrar la región y el contexto de validación. Si existen
variantes, el PMV seleccionará una variante principal acordada y documentará las
demás sin mezclarlas automáticamente.

## 10. Contenido excluido

- Diagnósticos, tratamientos o emergencias.
- Consentimiento legal y trámites de consecuencias materiales.
- Insultos o contenido sensible hasta contar con protocolo específico.
- Nombres propios que requieran deletreo no implementado.

## 11. Decisiones abiertas

- Sistema exacto de glosas que se usará internamente.
- Región o variante principal de LSC.
- Tratamiento del deletreo manual.
- Convenciones para preguntas, negación y referencia espacial.
