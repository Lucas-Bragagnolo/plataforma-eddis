// Ejemplos de cómo funciona la lógica del derecho de examen
// ACTUALIZADO: Incluye verificación de cuotas vencidas

// Ejemplo 1: Alumno con cuotas pendientes - EXAMEN BLOQUEADO
const ejemploAlumnoCuotasPendientes = {
  "textoplan": "MASAJISTA PROFESIONAL PR",
  "cuotas": [
    {"cuota": "1", "mes": "Marzo", "importe": "54000.00", "pagado": "2", "fechaven": "2025-03-18"},
    {"cuota": "2", "mes": "Abril", "importe": "54000.00", "pagado": "2", "fechaven": "2025-04-18"},
    {"cuota": "3", "mes": "Mayo", "importe": "54000.00", "pagado": "0", "fechaven": "2025-05-18"}, // PENDIENTE
    {"cuota": "4", "mes": "Junio", "importe": "56000.00", "pagado": "0", "fechaven": "2025-06-18"}, // PENDIENTE
    {"cuota": "99", "mes": "Agosto", "importe": "52500.00", "pagado": "0", "fechaven": "2025-08-18"} // EXAMEN
  ]
};

// Ejemplo 1B: Alumno con cuotas VENCIDAS - EXAMEN BLOQUEADO (caso crítico)
const ejemploAlumnoCuotasVencidas = {
  "textoplan": "MASAJISTA PROFESIONAL PR",
  "cuotas": [
    {"cuota": "1", "mes": "Enero", "importe": "54000.00", "pagado": "1", "fechaven": "2025-01-18"},
    {"cuota": "2", "mes": "Febrero", "importe": "54000.00", "pagado": "0", "fechaven": "2025-02-18"}, // VENCIDA
    {"cuota": "3", "mes": "Marzo", "importe": "54000.00", "pagado": "0", "fechaven": "2025-03-18"}, // VENCIDA
    {"cuota": "4", "mes": "Abril", "importe": "56000.00", "pagado": "0", "fechaven": "2025-09-18"}, // PENDIENTE (no vencida)
    {"cuota": "99", "mes": "Agosto", "importe": "52500.00", "pagado": "0", "fechaven": "2025-08-18"} // EXAMEN
  ]
};

// Ejemplo 2: Alumno con todas las cuotas pagadas - EXAMEN DISPONIBLE
const ejemploAlumnoListoParaExamen = {
  "textoplan": "MASAJISTA PROFESIONAL PR",
  "cuotas": [
    {"cuota": "1", "mes": "Marzo", "importe": "54000.00", "pagado": "2", "fechaven": "2025-03-18"},
    {"cuota": "2", "mes": "Abril", "importe": "54000.00", "pagado": "1", "fechaven": "2025-04-18"},
    {"cuota": "3", "mes": "Mayo", "importe": "54000.00", "pagado": "1", "fechaven": "2025-05-18"},
    {"cuota": "4", "mes": "Junio", "importe": "56000.00", "pagado": "2", "fechaven": "2025-06-18"},
    {"cuota": "99", "mes": "Agosto", "importe": "52500.00", "pagado": "0", "fechaven": "2025-08-18"} // EXAMEN DISPONIBLE
  ]
};

// Ejemplo 3: Alumno con examen ya pagado - COMPLETADO
const ejemploAlumnoExamenPagado = {
  "textoplan": "MASAJISTA PROFESIONAL PR",
  "cuotas": [
    {"cuota": "1", "mes": "Marzo", "importe": "54000.00", "pagado": "1", "fechaven": "2025-03-18"},
    {"cuota": "2", "mes": "Abril", "importe": "54000.00", "pagado": "1", "fechaven": "2025-04-18"},
    {"cuota": "3", "mes": "Mayo", "importe": "54000.00", "pagado": "1", "fechaven": "2025-05-18"},
    {"cuota": "4", "mes": "Junio", "importe": "56000.00", "pagado": "1", "fechaven": "2025-06-18"},
    {"cuota": "99", "mes": "Agosto", "importe": "52500.00", "pagado": "1", "fechaven": "2025-08-18"} // EXAMEN PAGADO
  ]
};

// Función para analizar el estado del derecho de examen (LÓGICA MEJORADA)
function analizarEstadoExamen(curso) {
  const cuotaExamen = curso.cuotas.find(c => c.cuota === '99');
  const cuotasRegulares = curso.cuotas.filter(c => c.cuota !== '99');
  const todasCuotasPagadas = cuotasRegulares.every(c => c.pagado == '1' || c.pagado == '2');
  const cuotasPendientes = cuotasRegulares.filter(c => c.pagado == '0');
  const examenPagado = cuotaExamen && (cuotaExamen.pagado == '1' || cuotaExamen.pagado == '2');
  
  // NUEVA LÓGICA: Verificar cuotas vencidas
  const hoy = new Date();
  const cuotasVencidas = cuotasRegulares.filter(c => {
    if (c.pagado == '0') {
      const fechaVencimiento = new Date(c.fechaven);
      return fechaVencimiento < hoy;
    }
    return false;
  });
  
  console.log(`\n=== ANÁLISIS: ${curso.textoplan} ===`);
  console.log(`Cuotas regulares: ${cuotasRegulares.length}`);
  console.log(`Cuotas pagadas: ${cuotasRegulares.length - cuotasPendientes.length}/${cuotasRegulares.length}`);
  console.log(`Cuotas pendientes: ${cuotasPendientes.length}`);
  console.log(`Cuotas VENCIDAS: ${cuotasVencidas.length}`);
  
  // CONDICIONES ESTRICTAS para habilitar el derecho de examen:
  // 1. El examen NO debe estar pagado
  // 2. TODAS las cuotas regulares deben estar pagadas
  // 3. NO debe haber cuotas pendientes
  // 4. NO debe haber cuotas vencidas
  const puedeAbonarExamen = !examenPagado && 
                           todasCuotasPagadas && 
                           cuotasPendientes.length === 0 && 
                           cuotasVencidas.length === 0;
  
  if (examenPagado) {
    console.log('🎓 ESTADO: EXAMEN PAGADO ✅');
    console.log('   - El alumno puede rendir el examen final');
    return 'PAGADO';
  } else if (puedeAbonarExamen) {
    console.log('🟢 ESTADO: LISTO PARA PAGAR EXAMEN');
    console.log('   - Todas las cuotas están pagadas');
    console.log('   - No hay cuotas vencidas');
    console.log('   - Puede proceder al pago del derecho de examen');
    console.log(`   - Importe del examen: $${parseFloat(cuotaExamen.importe).toLocaleString('es-AR')}`);
    return 'DISPONIBLE';
  } else {
    console.log('🔒 ESTADO: EXAMEN BLOQUEADO');
    
    if (cuotasVencidas.length > 0) {
      console.log(`   - ⚠️  CRÍTICO: ${cuotasVencidas.length} cuota(s) VENCIDA(S)`);
      console.log('   - Cuotas vencidas:', cuotasVencidas.map(c => `${c.mes} (vencía: ${c.fechaven})`).join(', '));
    }
    
    if (cuotasPendientes.length > cuotasVencidas.length) {
      const pendientesNoVencidas = cuotasPendientes.length - cuotasVencidas.length;
      console.log(`   - ${pendientesNoVencidas} cuota(s) pendiente(s) (no vencidas aún)`);
    }
    
    console.log('   - MOTIVO DEL BLOQUEO: Debe estar al día con TODAS las cuotas');
    return 'BLOQUEADO';
  }
}

// Función para generar el HTML del panel según el estado
function generarPanelExamen(curso) {
  const estado = analizarEstadoExamen(curso);
  const cuotaExamen = curso.cuotas.find(c => c.cuota === '99');
  const cuotasPendientes = curso.cuotas.filter(c => c.cuota !== '99' && c.pagado == '0');
  
  // Calcular cuotas vencidas
  const hoy = new Date();
  const cuotasVencidas = curso.cuotas.filter(c => {
    if (c.cuota !== '99' && c.pagado == '0') {
      const fechaVencimiento = new Date(c.fechaven);
      return fechaVencimiento < hoy;
    }
    return false;
  });
  
  let html = `
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="flex items-center justify-between mb-4">
        <h4 class="text-lg font-medium text-gray-900">Derecho de Examen</h4>
        <i class="fa-solid fa-graduation-cap text-gray-400"></i>
      </div>
      <div class="space-y-4">
  `;
  
  // Estado
  if (estado === 'PAGADO') {
    html += `
        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-500">Estado:</span>
          <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Pagado</span>
        </div>
    `;
  } else if (estado === 'DISPONIBLE') {
    html += `
        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-500">Estado:</span>
          <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Disponible para Pago</span>
        </div>
    `;
  } else {
    html += `
        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-500">Estado:</span>
          <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">No Disponible</span>
        </div>
    `;
  }
  
  // Monto
  html += `
        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-500">Monto:</span>
          <span class="text-sm font-medium text-gray-900">$${parseFloat(cuotaExamen.importe).toLocaleString('es-AR', {minimumFractionDigits: 2})}</span>
        </div>
  `;
  
  // Información adicional según estado
  if (estado === 'BLOQUEADO') {
    let mensajeDetalle = '';
    let colorClase = 'text-red-600';
    let iconoClase = 'fa-solid fa-lock';
    
    if (cuotasVencidas.length > 0) {
      const vencidasTexto = cuotasVencidas.length === 1 ? '1 cuota vencida' : `${cuotasVencidas.length} cuotas vencidas`;
      mensajeDetalle = `Tienes ${vencidasTexto}`;
      
      if (cuotasPendientes.length > cuotasVencidas.length) {
        const pendientesNoVencidas = cuotasPendientes.length - cuotasVencidas.length;
        mensajeDetalle += ` y ${pendientesNoVencidas} cuota${pendientesNoVencidas > 1 ? 's' : ''} pendiente${pendientesNoVencidas > 1 ? 's' : ''}`;
      }
      
      iconoClase = 'fa-solid fa-exclamation-triangle';
    } else if (cuotasPendientes.length > 0) {
      const pendientesTexto = cuotasPendientes.length === 1 ? '1 cuota pendiente' : `${cuotasPendientes.length} cuotas pendientes`;
      mensajeDetalle = `Tienes ${pendientesTexto} de pago`;
      colorClase = 'text-orange-600';
      iconoClase = 'fa-solid fa-clock';
    }
    
    html += `
        <div class="mt-4 p-3 rounded-lg bg-red-50 border border-red-200">
          <div class="flex items-center ${colorClase}">
            <i class="${iconoClase} mr-2"></i>
            <span class="font-medium">Derecho de examen no disponible</span>
          </div>
          <div class="${colorClase} text-xs mt-1">
            ${mensajeDetalle}
          </div>
          <div class="text-xs mt-2 opacity-75 ${colorClase}">
            Debes estar al día con todas las cuotas para poder abonar el derecho de examen
          </div>
        </div>
    `;
  } else if (estado === 'DISPONIBLE') {
    html += `
        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-500">Vencimiento:</span>
          <span class="text-sm text-gray-900">${cuotaExamen.mes} - Vence: ${cuotaExamen.fechaven}</span>
        </div>
        <div class="mt-4 p-3 rounded-lg bg-green-50 border border-green-200">
          <div class="flex items-center text-green-700">
            <i class="fa-solid fa-check-circle mr-2"></i>
            <span class="font-medium">¡Listo para pagar el derecho de examen!</span>
          </div>
          <div class="text-green-600 text-xs mt-1">Todas las cuotas del curso están al día.</div>
        </div>
        <button class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
          <i class="fa-solid fa-graduation-cap mr-2"></i>Pagar Derecho de Examen
        </button>
    `;
  } else {
    html += `
        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-500">Vencimiento:</span>
          <span class="text-sm text-gray-900">${cuotaExamen.mes} - Vence: ${cuotaExamen.fechaven}</span>
        </div>
        <div class="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200">
          <div class="flex items-center text-blue-700">
            <i class="fa-solid fa-check-circle mr-2"></i>
            <span class="font-medium">Derecho de examen pagado</span>
          </div>
          <div class="text-blue-600 text-xs mt-1">Ya puedes rendir el examen final del curso.</div>
        </div>
    `;
  }
  
  html += `
      </div>
    </div>
  `;
  
  return html;
}

// Ejecutar ejemplos
console.log('=== EJEMPLOS DE LÓGICA DEL DERECHO DE EXAMEN (ACTUALIZADA) ===');

analizarEstadoExamen(ejemploAlumnoCuotasPendientes);
analizarEstadoExamen(ejemploAlumnoCuotasVencidas);
analizarEstadoExamen(ejemploAlumnoListoParaExamen);
analizarEstadoExamen(ejemploAlumnoExamenPagado);

console.log('\n=== RESUMEN DE LA LÓGICA ===');
console.log('✅ El botón de "Pagar Derecho de Examen" SOLO aparece cuando:');
console.log('   1. El derecho de examen NO está pagado');
console.log('   2. TODAS las cuotas regulares están pagadas');
console.log('   3. NO hay cuotas pendientes');
console.log('   4. NO hay cuotas vencidas');
console.log('');
console.log('🔒 El botón se OCULTA cuando hay cuotas vencidas o pendientes');
console.log('📊 Esta lógica garantiza que el alumno esté completamente al día');

export { analizarEstadoExamen, generarPanelExamen };