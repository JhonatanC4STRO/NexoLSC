# Especificación lingüística español–LSC

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

## 9. Deletreo manual

Cuando no exista una traducción validada, el usuario podrá elegir deletrear el
texto confirmado. Esta salida representa la escritura del español mediante el
alfabeto manual y no una traducción gramatical a LSC.

Reglas del PMV:

- un guion LSC validado tiene prioridad;
- el deletreo requiere elección y confirmación explícitas;
- se conservan las letras `A` a `Z` y la `Ñ`;
- `Á`, `É`, `Í`, `Ó`, `Ú` y `Ü` se normalizan a su vocal base;
- un espacio produce una pausa entre palabras;
- números y símbolos producen un mensaje de carácter no soportado;
- si falta una animación, no se reproduce una secuencia parcial.

Ejemplo técnico:

```json
{
  "tipoSalida": "DELETREO_MANUAL",
  "textoConfirmado": "NIÑO",
  "pasos": [
    { "idAnimacion": "LSC_ALFABETO_N_V1" },
    { "idAnimacion": "LSC_ALFABETO_I_V1" },
    { "idAnimacion": "LSC_ALFABETO_ENE_V1" },
    { "idAnimacion": "LSC_ALFABETO_O_V1" }
  ]
}
```

## 10. Variación

Cada seña o guion debe registrar la región y el contexto de validación. Si existen
variantes, el PMV seleccionará una variante principal acordada y documentará las
demás sin mezclarlas automáticamente.

## 11. Contenido excluido

- Diagnósticos, tratamientos o emergencias.
- Consentimiento legal y trámites de consecuencias materiales.
- Insultos o contenido sensible hasta contar con protocolo específico.
- Números y símbolos que requieran un repertorio manual no implementado.

## 12. Decisiones abiertas

- Sistema exacto de glosas que se usará internamente.
- Región o variante principal de LSC.
- Ritmo y duración de las transiciones entre letras.
- Formas específicas para secuencias como `CH`, `LL` y `RR`, si la validación
  colombiana recomienda tratarlas de manera diferente.
- Convenciones para preguntas, negación y referencia espacial.
