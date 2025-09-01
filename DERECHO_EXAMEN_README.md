# Lógica del Derecho de Examen

## Resumen
El derecho de examen (cuota 99) es un pago especial que permite al alumno rendir el examen final del curso. **Solo se puede pagar cuando el alumno está completamente al día con todas sus cuotas regulares**.

## Condiciones Estrictas

Para que aparezca el botón "Pagar Derecho de Examen", se deben cumplir **TODAS** estas condiciones:

1. ✅ **El derecho de examen NO debe estar pagado** (`cuotaExamen.pagado != '1' && cuotaExamen.pagado != '2'`)
2. ✅ **TODAS las cuotas regulares deben estar pagadas** (`pagado == '1' || pagado == '2'`)
3. ✅ **NO debe haber cuotas pendientes** (`pagado == '0'`)
4. ✅ **NO debe haber cuotas vencidas** (cuotas con `pagado == '0'` y `fechaven < hoy`)

## Estados Posibles

### 🎓 EXAMEN PAGADO
- **Condición**: `cuotaExamen.pagado == '1' || cuotaExamen.pagado == '2'`
- **Estado mostrado**: "Pagado" (verde)
- **Botón**: Oculto
- **Mensaje**: "Derecho de examen abonado correctamente"

### 🟢 DISPONIBLE PARA PAGO
- **Condición**: Todas las condiciones estrictas se cumplen
- **Estado mostrado**: "Disponible para Pago" (azul)
- **Botón**: Visible y habilitado
- **Mensaje**: "¡Felicitaciones! Ya puedes abonar el derecho de examen"

### 🔒 NO DISPONIBLE
- **Condición**: Hay cuotas pendientes o vencidas
- **Estado mostrado**: "No Disponible" (rojo)
- **Botón**: Oculto
- **Mensaje**: Detalla qué cuotas faltan pagar

## Implementación en el Código

La lógica principal está en `js/dashboard.js` en la función `mostrarDetallesCurso()`:

```javascript
// CONDICIONES ESTRICTAS para habilitar el pago del derecho de examen
const puedeAbonarExamen = !examenPagado && 
                         todasCuotasPagadas && 
                         cuotasPendientes.length === 0 && 
                         cuotasVencidas.length === 0;

if (puedeAbonarExamen) {
  // Mostrar botón habilitado
  payExamFeeButton.classList.remove('hidden');
} else {
  // Ocultar botón
  payExamFeeButton.classList.add('hidden');
}
```

## Casos de Ejemplo

### Caso 1: Cuotas Pendientes (Botón Oculto)
```javascript
{
  "cuotas": [
    {"cuota": "1", "pagado": "1", "fechaven": "2025-03-18"},
    {"cuota": "2", "pagado": "0", "fechaven": "2025-04-18"}, // PENDIENTE
    {"cuota": "99", "pagado": "0", "fechaven": "2025-08-18"}
  ]
}
```
**Resultado**: Botón oculto - hay 1 cuota pendiente

### Caso 2: Cuotas Vencidas (Botón Oculto)
```javascript
{
  "cuotas": [
    {"cuota": "1", "pagado": "1", "fechaven": "2025-01-18"},
    {"cuota": "2", "pagado": "0", "fechaven": "2025-02-18"}, // VENCIDA
    {"cuota": "99", "pagado": "0", "fechaven": "2025-08-18"}
  ]
}
```
**Resultado**: Botón oculto - hay 1 cuota vencida

### Caso 3: Todo Pagado (Botón Visible)
```javascript
{
  "cuotas": [
    {"cuota": "1", "pagado": "1", "fechaven": "2025-03-18"},
    {"cuota": "2", "pagado": "2", "fechaven": "2025-04-18"},
    {"cuota": "99", "pagado": "0", "fechaven": "2025-08-18"}
  ]
}
```
**Resultado**: Botón visible - todas las cuotas están pagadas

## Archivos Relacionados

- **`js/dashboard.js`**: Implementación principal de la lógica
- **`examples/exam-fee-examples.js`**: Ejemplos y casos de prueba
- **`pages/index.html`**: Elementos HTML del panel de derecho de examen

## Elementos HTML

Los elementos principales que maneja la lógica son:

- `#examFeeCard`: Contenedor del panel
- `#examFeeStatus`: Estado del derecho de examen
- `#examFeeAmount`: Monto a pagar
- `#examFeeDue`: Información de vencimiento
- `#payExamFeeButton`: Botón de pago (se muestra/oculta según condiciones)

## Debugging

Para verificar el funcionamiento, revisa los logs en la consola del navegador:

```
[DEBUG EXAMEN] Estado del derecho de examen: {
  cuotasRegulares: 4,
  todasPagadas: true,
  pendientes: 0,
  vencidas: 0,
  examenPagado: false
}

[DEBUG EXAMEN] Evaluación para habilitar pago: {
  puedeAbonar: true,
  examenNoPagado: true,
  todasPagadas: true,
  sinPendientes: true,
  sinVencidas: true
}
```

## Notas Importantes

1. **Cuota 99**: Siempre representa el derecho de examen
2. **Estados de pago**: `'0'` = no pagado, `'1'` = pagado, `'2'` = pronto pago
3. **Fechas**: Se comparan con la fecha actual para determinar vencimientos
4. **Prioridad**: Las cuotas vencidas tienen prioridad en los mensajes de error
5. **Seguridad**: La lógica es estricta para evitar pagos indebidos

---

**Última actualización**: 29/08/2025
**Versión**: 1.0