// Función mejorada para mostrar detalles del curso con datos de la API
function mostrarDetallesCursoMejorado(curso) {
  const emptyState = document.getElementById('emptyState');
  const courseDetails = document.getElementById('courseDetails');
  const courseName = document.getElementById('courseName');
  const courseStatus = document.getElementById('courseStatus');
  const courseDates = document.getElementById('courseDates');
  const progressText = document.getElementById('progressText');
  const paymentStatus = document.getElementById('paymentStatus');
  const paymentAmount = document.getElementById('paymentAmount');
  const paymentDue = document.getElementById('paymentDue');
  const payButton = document.getElementById('payButton');
  const examFeeCard = document.getElementById('examFeeCard');
  const examFeeStatus = document.getElementById('examFeeStatus');
  const examFeeAmount = document.getElementById('examFeeAmount');
  const examFeeDue = document.getElementById('examFeeDue');
  const payExamFeeButton = document.getElementById('payExamFeeButton');
  const completedLessons = document.getElementById('completedLessons');
  const totalLessons = document.getElementById('totalLessons');
  const studyHours = document.getElementById('studyHours');
  const averageScore = document.getElementById('averageScore');

  if (emptyState) emptyState.classList.add('hidden');
  if (courseDetails) courseDetails.classList.remove('hidden');

  // Actualizar detalles del curso
  if (courseName) courseName.textContent = curso.textoplan || 'Curso sin nombre';
  
  // Determinar estado del curso basado en fechabaja y motivobaja
  let estadoCurso = 'Activo';
  let estadoClass = 'bg-green-100 text-green-800';
  
  if (curso.fechabaja && curso.motivobajades) {
    estadoCurso = `Suspendido - ${curso.motivobajades}`;
    estadoClass = 'bg-red-100 text-red-800';
  }
  
  if (courseStatus) {
    courseStatus.textContent = estadoCurso;
    courseStatus.className = `inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${estadoClass}`;
  }
  
  if (courseDates) {
    const fechaInicio = curso.fecha || 'No especificada';
    const fechaBaja = curso.fechabaja ? ` - Baja: ${curso.fechabaja}` : '';
    courseDates.textContent = `Inicio: ${fechaInicio}${fechaBaja}`;
  }

  // Update circular progress
  const progressCircle = document.getElementById('progressCircle');
  const progressPercentage = document.getElementById('progressPercentage');
  const estimatedTime = document.getElementById('estimatedTime');
  
  if (progressCircle && progressPercentage) {
    const percentage = parseInt(curso.avance) || 0;
    const circumference = 2 * Math.PI * 64; // radius = 64
    const offset = circumference - (percentage / 100) * circumference;
    
    progressCircle.style.strokeDashoffset = offset;
    progressPercentage.textContent = `${percentage}%`;
  }
  
  if (progressText) {
    progressText.textContent = `${curso.avance || 0}% completado`;
  }
  
  // Actualizar estadísticas del progreso con datos reales de la API
  if (completedLessons) {
    completedLessons.textContent = curso.claseshechas || 0;
  }
  if (totalLessons) {
    totalLessons.textContent = curso.clasestotales || 0;
  }
  if (studyHours) {
    studyHours.textContent = curso.tiempouso || '0:00';
  }
  if (averageScore) {
    // Calcular promedio basado en el avance o usar un valor por defecto
    const promedio = curso.avance ? Math.round(curso.avance * 0.8 + 20) : 0; // Fórmula simple
    averageScore.textContent = promedio;
  }
  
  // Calculate estimated time (example calculation)
  if (estimatedTime) {
    const remaining = 100 - (parseInt(curso.avance) || 0);
    const clasesRestantes = (curso.clasestotales || 0) - (curso.claseshechas || 0);
    if (clasesRestantes > 0) {
      estimatedTime.textContent = `${clasesRestantes} clases restantes`;
    } else {
      estimatedTime.textContent = 'Completado';
    }
  }

  // Actualizar estado de cuota regular
  if (curso.cuotas && Array.isArray(curso.cuotas)) {
    // Buscar la cuota regular más próxima (excluyendo cuota 99 que es derecho de examen)
    const cuotasRegulares = curso.cuotas.filter(c => c.cuota !== '99');
    const proximaCuotaPendiente = cuotasRegulares.find(c => c.pagado == '0');
    const cuotaMostrar = proximaCuotaPendiente || cuotasRegulares[cuotasRegulares.length - 1];
    
    if (cuotaMostrar && paymentStatus && paymentAmount && paymentDue) {
      const pagada = cuotaMostrar.pagado == '1' || cuotaMostrar.pagado == '2';
      
      // Determinar estado y color
      let estadoTexto = 'Pendiente';
      let estadoClass = 'bg-yellow-100 text-yellow-800';
      
      if (pagada) {
        estadoTexto = cuotaMostrar.pagado == '2' ? 'Pronto Pago' : 'Pagada';
        estadoClass = 'bg-green-100 text-green-800';
      } else {
        // Verificar si está vencida
        const fechaVencimiento = new Date(cuotaMostrar.fechaven);
        const hoy = new Date();
        if (fechaVencimiento < hoy) {
          estadoTexto = 'Vencida';
          estadoClass = 'bg-red-100 text-red-800';
        }
      }
      
      paymentStatus.textContent = estadoTexto;
      paymentStatus.className = `inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${estadoClass}`;
      
      // Formatear importe
      const importe = parseFloat(cuotaMostrar.importe);
      paymentAmount.textContent = `$${importe.toLocaleString('es-AR', {minimumFractionDigits: 2})}`;
      
      paymentDue.textContent = `${cuotaMostrar.mes} - Vence: ${cuotaMostrar.fechaven}`;
      
      // Ocultar botón de pago (se puede implementar más adelante)
      if (payButton) payButton.classList.add('hidden');
    }
    
    // Manejar derecho de examen (cuota 99)
    const cuotaExamen = curso.cuotas.find(c => c.cuota === '99');
    if (cuotaExamen && examFeeCard) {
      examFeeCard.classList.remove('hidden');
      
      const examenPagado = cuotaExamen.pagado == '1' || cuotaExamen.pagado == '2';
      
      if (examFeeStatus) {
        examFeeStatus.textContent = examenPagado ? 'Pagado' : 'Pendiente';
        examFeeStatus.className = examenPagado 
          ? 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800'
          : 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800';
      }
      
      if (examFeeAmount) {
        const importeExamen = parseFloat(cuotaExamen.importe);
        examFeeAmount.textContent = `$${importeExamen.toLocaleString('es-AR', {minimumFractionDigits: 2})}`;
      }
      
      if (examFeeDue) {
        examFeeDue.textContent = `${cuotaExamen.mes} - Vence: ${cuotaExamen.fechaven}`;
      }
      
      // Ocultar botón de pago del examen por ahora
      if (payExamFeeButton) payExamFeeButton.classList.add('hidden');
    } else if (examFeeCard) {
      examFeeCard.classList.add('hidden');
    }
  }

  // Configurar enlace de descarga de constancia
  const descargarConstanciaBtn = document.getElementById('descargarConstanciaBtn');
  if (descargarConstanciaBtn) {
    if (curso.certificado_regular) {
      descargarConstanciaBtn.href = curso.certificado_regular;
      descargarConstanciaBtn.classList.remove('opacity-50', 'cursor-not-allowed');
      descargarConstanciaBtn.title = '';
    } else {
      descargarConstanciaBtn.classList.add('opacity-50', 'cursor-not-allowed');
      descargarConstanciaBtn.title = 'Constancia no disponible';
    }
  }

  // Actualizar certificados
  if (curso.certificados && Array.isArray(curso.certificados)) {
    const certificateContent = document.getElementById('certificateContent');

    function buildCertificateCard(cert, avanceCurso) {
      const pagado = cert.pagado === 1;
      const disponible = cert.disponible === true;
      const notaValida = cert.nota && cert.nota > 0;
    
      const bordeColor = pagado ? 'border-t-4 border-green-500' : 'border-t-4 border-orange-500';
      const iconBg = pagado ? 'bg-green-500' : 'bg-orange-500';
      const iconoEstado = pagado ? '✅' : '⏳';
    
      const botonesHTML = disponible && pagado ? `
        <div class="flex flex-col sm:flex-row gap-2 mt-4">
          <button 
            class="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded focus:outline-none focus:ring focus:ring-blue-300"
            onclick="window.open('${cert.linkcertificado}', '_blank')"
            aria-label="Imprimir certificado de ${cert.titulo}">
            🖨️ <span>Certificado</span>
          </button>
          <button 
            class="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-700 hover:bg-gray-800 rounded focus:outline-none focus:ring focus:ring-gray-400"
            onclick="window.open('${cert.linkcredencial}', '_blank')"
            aria-label="Imprimir credencial de ${cert.titulo}">
            🖨️ <span>Credencial</span>
          </button>
        </div>
      ` : `
        <div class="mt-4 text-sm font-medium text-orange-600">
          ${!pagado ? 'Pendiente de pago' : 'No disponible'}
        </div>
      `;
    
      const notaHTML = notaValida
        ? `<span class="inline-block bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded">Nota: ${cert.nota}</span>`
        : '';
    
      return `
        <div class="swiper-slide h-full">
          <article class="card h-full flex flex-col justify-between p-4 rounded-lg shadow-md bg-white ${bordeColor}" tabindex="0">
            <div>
              <div class="flex items-start gap-4">
                <div class="estado-icon ${iconBg} text-white w-10 h-10 flex items-center justify-center rounded-full text-lg" aria-hidden="true">
                  ${iconoEstado}
                </div>
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-gray-900">${cert.titulo}</h3>
                  <div class="text-sm text-gray-500 mt-1">${cert.tipo}</div>
                  ${notaHTML ? `<div class="mt-2">${notaHTML}</div>` : ''}
                </div>
              </div>
            </div>
            ${botonesHTML}
          </article>
        </div>
      `;
    }
    
    // Ordenar: primero Certificado Final, luego el resto
    const certificadosOrdenados = [...curso.certificados].sort((a, b) => {
      if (a.tipo === 'Certificado Final' && b.tipo !== 'Certificado Final') return -1;
      if (a.tipo !== 'Certificado Final' && b.tipo === 'Certificado Final') return 1;
      return 0;
    });

    const swiperWrapper = document.getElementById('swiper-certificates');
    if (swiperWrapper) {
      swiperWrapper.innerHTML = certificadosOrdenados
        .map(cert => buildCertificateCard(cert, curso.avance))
        .join('');
    
      // Iniciar Swiper.js después de insertar las cards
      new Swiper('.mySwiper', {
        slidesPerView: 1.2,
        spaceBetween: 16,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        breakpoints: {
          640: { slidesPerView: 1.3 }
        }
      });
    }
  }
}

// Función mejorada para mostrar historial de cuotas
function mostrarHistorialCuotasMejorado(cuotas, nombreCurso) {
  const container = document.getElementById('cuentaCorrienteContainer');
  if (!container) return;
  
  // Función para formatear el estado de pago
  const formatearEstadoPago = (pagado) => {
    switch(pagado) {
      case '1': return { texto: 'Pagada', clase: 'text-green-600 font-semibold' };
      case '2': return { texto: 'Pronto Pago', clase: 'text-blue-600 font-semibold' };
      default: return { texto: 'Pendiente', clase: 'text-red-600 font-semibold' };
    }
  };
  
  container.innerHTML = `
    <div class="bg-white rounded-lg shadow-lg p-2 sm:p-6 mb-6">
      <h3 class="text-xl font-bold mb-4">Cuenta Corriente - ${nombreCurso}</h3>
      <!-- Desktop Table -->
      <div class="hidden sm:block overflow-x-auto">
        <table class="min-w-full text-sm text-left border">
          <thead>
            <tr class="bg-gray-100">
              <th class="py-2 px-2 border font-semibold">#</th>
              <th class="py-2 px-2 border font-semibold">Mes</th>
              <th class="py-2 px-2 border font-semibold">Importe</th>
              <th class="py-2 px-2 border font-semibold">Estado</th>
              <th class="py-2 px-2 border font-semibold">Pronto Pago</th>
              <th class="py-2 px-2 border font-semibold">Vencimiento</th>
            </tr>
          </thead>
          <tbody>
            ${cuotas.map(c => {
              const estadoPago = formatearEstadoPago(c.pagado);
              const importe = parseFloat(c.importe);
              const prontoPago = c.ppago && parseFloat(c.ppago) > 0 ? parseFloat(c.ppago) : null;
              
              return `
                <tr class="${c.cuota === '99' ? 'bg-purple-50' : ''}">
                  <td class="py-2 px-2 border">${c.cuota === '99' ? 'Examen' : c.cuota}</td>
                  <td class="py-2 px-2 border">${c.mes}</td>
                  <td class="py-2 px-2 border font-mono">$${importe.toLocaleString('es-AR', {minimumFractionDigits:2})}</td>
                  <td class="py-2 px-2 border ${estadoPago.clase}">${estadoPago.texto}</td>
                  <td class="py-2 px-2 border font-mono">${prontoPago ? '$' + prontoPago.toLocaleString('es-AR', {minimumFractionDigits:2}) : '-'}</td>
                  <td class="py-2 px-2 border">${c.fechaven}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
      <!-- Mobile List -->
      <div class="block sm:hidden space-y-2">
        ${cuotas.map(c => {
          const estadoPago = formatearEstadoPago(c.pagado);
          const importe = parseFloat(c.importe);
          const prontoPago = c.ppago && parseFloat(c.ppago) > 0 ? parseFloat(c.ppago) : null;
          
          return `
            <div class="bg-gray-50 rounded-lg p-3 border ${c.cuota === '99' ? 'border-purple-200 bg-purple-50' : ''}">
              <div class="flex justify-between mb-2">
                <span class="font-semibold text-gray-700">Cuota:</span> 
                <span class="font-semibold">${c.cuota === '99' ? 'Derecho de Examen' : `Cuota ${c.cuota}`}</span>
              </div>
              <div class="flex justify-between"><span class="font-semibold text-gray-700">Mes:</span> <span>${c.mes}</span></div>
              <div class="flex justify-between"><span class="font-semibold text-gray-700">Importe:</span> <span class="font-mono">$${importe.toLocaleString('es-AR', {minimumFractionDigits:2})}</span></div>
              <div class="flex justify-between"><span class="font-semibold text-gray-700">Estado:</span> <span class="${estadoPago.clase}">${estadoPago.texto}</span></div>
              <div class="flex justify-between"><span class="font-semibold text-gray-700">Pronto Pago:</span> <span class="font-mono">${prontoPago ? '$' + prontoPago.toLocaleString('es-AR', {minimumFractionDigits:2}) : '-'}</span></div>
              <div class="flex justify-between"><span class="font-semibold text-gray-700">Vencimiento:</span> <span>${c.fechaven}</span></div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

// Exportar las funciones para uso en el dashboard principal
window.mostrarDetallesCursoMejorado = mostrarDetallesCursoMejorado;
window.mostrarHistorialCuotasMejorado = mostrarHistorialCuotasMejorado;