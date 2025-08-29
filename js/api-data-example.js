// Ejemplo de cómo procesar los datos de la API que me pasaste Lucas

// Datos de ejemplo de la API
const apiResponse = {
  "success": true,
  "id": "477712",
  "idalu": "397150",
  "centro": "146",
  "centronom": "Avellaneda          ",
  "fechabaja": "2025-06-30",
  "motivobaja": "553",
  "motivobajades": "FALTA DE PAGO",
  "fecha": "2025-02-19",
  "idplan": "523",
  "textoplan": "MASAJISTA PROFESIONAL PR",
  "codigo": "presencial.masajprof22",
  "certificado_regular": "https://servidoreddis.com.ar/sistema/certificado_regular.php?token=8b378d5fbea51e1b768781bf17d01b65&idcur=186823&pais=ar",
  "beca": "0",
  "promo": "0",
  "promodes": "",
  "aula": "1869",
  "eo": 0,
  "avance": 21,
  "clasestotales": 27,
  "claseshechas": 5,
  "tiempouso": "08:34",
  "fecha_primer_interaccion": "2025-03-25 16:48:39",
  "fecha_ultima_interaccion": "2025-05-11 20:37:42",
  "cantidad_interacciones": 1000,
  "notas": null,
  "fechanota": null,
  "certificados": [
    {
      "titulo": "MASAJISTA PROFESIONAL",
      "linkcertificado": "",
      "linkcredencial": "",
      "tipo": "Certificado Final",
      "pagado": 0,
      "nota": 0,
      "cuota": 99,
      "disponible": false
    }
  ],
  "cuotas": [
    {
      "id": "6033833",
      "cuota": "1",
      "mes": "Marzo",
      "importe": "54000.00",
      "ppago": "50000.00",
      "pagado": "2",
      "fechaven": "2025-03-18"
    },
    {
      "id": "6033834",
      "cuota": "2",
      "mes": "Abril",
      "importe": "54000.00",
      "ppago": "50000.00",
      "pagado": "2",
      "fechaven": "2025-04-18"
    },
    {
      "id": "6033835",
      "cuota": "3",
      "mes": "Mayo",
      "importe": "54000.00",
      "ppago": "50000.00",
      "pagado": "2",
      "fechaven": "2025-05-18"
    },
    {
      "id": "6033836",
      "cuota": "4",
      "mes": "Junio",
      "importe": "56000.00",
      "ppago": "51500.00",
      "pagado": "0",
      "fechaven": "2025-06-18"
    },
    {
      "id": "6033837",
      "cuota": "5",
      "mes": "Julio",
      "importe": "56000.00",
      "ppago": "51500.00",
      "pagado": "0",
      "fechaven": "2025-07-18"
    },
    {
      "id": "6033838",
      "cuota": "6",
      "mes": "Agosto",
      "importe": "56000.00",
      "ppago": "51500.00",
      "pagado": "0",
      "fechaven": "2025-08-18"
    },
    {
      "id": "6033839",
      "cuota": "99",
      "mes": "Agosto",
      "importe": "52500.00",
      "ppago": "0.00",
      "pagado": "0",
      "fechaven": "2025-08-18"
    }
  ]
};

// Función para procesar y mostrar los datos
function procesarDatosAPI(datos) {
  console.log('=== INFORMACIÓN DEL CURSO ===');
  console.log(`Curso: ${datos.textoplan}`);
  console.log(`Centro: ${datos.centronom.trim()}`);
  console.log(`Fecha de inicio: ${datos.fecha}`);
  console.log(`Progreso: ${datos.avance}%`);
  console.log(`Clases asistidas: ${datos.claseshechas} de ${datos.clasestotales}`);
  console.log(`Tiempo de uso: ${datos.tiempouso}`);
  
  if (datos.fechabaja) {
    console.log(`⚠️ CURSO SUSPENDIDO: ${datos.motivobajades} (${datos.fechabaja})`);
  }
  
  console.log('\n=== ESTADO DE CUOTAS ===');
  
  // Procesar cuotas regulares (no cuota 99)
  const cuotasRegulares = datos.cuotas.filter(c => c.cuota !== '99');
  const cuotasPagadas = cuotasRegulares.filter(c => c.pagado === '1' || c.pagado === '2');
  const cuotasPendientes = cuotasRegulares.filter(c => c.pagado === '0');
  
  console.log(`Cuotas pagadas: ${cuotasPagadas.length}/${cuotasRegulares.length}`);
  
  if (cuotasPendientes.length > 0) {
    const proximaCuota = cuotasPendientes[0];
    const importe = parseFloat(proximaCuota.importe);
    const prontoPago = parseFloat(proximaCuota.ppago);
    
    console.log(`Próxima cuota: ${proximaCuota.mes}`);
    console.log(`Importe: $${importe.toLocaleString('es-AR', {minimumFractionDigits: 2})}`);
    if (prontoPago > 0) {
      console.log(`Pronto pago: $${prontoPago.toLocaleString('es-AR', {minimumFractionDigits: 2})}`);
    }
    console.log(`Vencimiento: ${proximaCuota.fechaven}`);
  }
  
  // Procesar derecho de examen (cuota 99)
  const cuotaExamen = datos.cuotas.find(c => c.cuota === '99');
  if (cuotaExamen) {
    console.log('\n=== DERECHO DE EXAMEN ===');
    const importeExamen = parseFloat(cuotaExamen.importe);
    const estadoExamen = cuotaExamen.pagado === '1' ? 'Pagado' : 'Pendiente';
    
    console.log(`Estado: ${estadoExamen}`);
    console.log(`Importe: $${importeExamen.toLocaleString('es-AR', {minimumFractionDigits: 2})}`);
    console.log(`Vencimiento: ${cuotaExamen.fechaven}`);
  }
  
  console.log('\n=== CERTIFICADOS ===');
  datos.certificados.forEach(cert => {
    console.log(`${cert.titulo} (${cert.tipo})`);
    console.log(`Estado: ${cert.pagado === 1 ? 'Pagado' : 'Pendiente de pago'}`);
    console.log(`Disponible: ${cert.disponible ? 'Sí' : 'No'}`);
    if (cert.nota > 0) {
      console.log(`Nota: ${cert.nota}`);
    }
  });
  
  if (datos.certificado_regular) {
    console.log(`\n📄 Constancia de alumno regular disponible: ${datos.certificado_regular}`);
  }
}

// Función para generar resumen financiero
function generarResumenFinanciero(datos) {
  const cuotasRegulares = datos.cuotas.filter(c => c.cuota !== '99');
  const cuotaExamen = datos.cuotas.find(c => c.cuota === '99');
  
  let totalPagado = 0;
  let totalPendiente = 0;
  
  cuotasRegulares.forEach(cuota => {
    const importe = parseFloat(cuota.importe);
    if (cuota.pagado === '1' || cuota.pagado === '2') {
      totalPagado += importe;
    } else {
      totalPendiente += importe;
    }
  });
  
  if (cuotaExamen) {
    const importeExamen = parseFloat(cuotaExamen.importe);
    if (cuotaExamen.pagado === '1') {
      totalPagado += importeExamen;
    } else {
      totalPendiente += importeExamen;
    }
  }
  
  console.log('\n=== RESUMEN FINANCIERO ===');
  console.log(`Total pagado: $${totalPagado.toLocaleString('es-AR', {minimumFractionDigits: 2})}`);
  console.log(`Total pendiente: $${totalPendiente.toLocaleString('es-AR', {minimumFractionDigits: 2})}`);
  console.log(`Total del curso: $${(totalPagado + totalPendiente).toLocaleString('es-AR', {minimumFractionDigits: 2})}`);
}

// Ejecutar el procesamiento de ejemplo
console.log('Procesando datos de la API...\n');
procesarDatosAPI(apiResponse);
generarResumenFinanciero(apiResponse);

// Exportar para uso en otros archivos
export { procesarDatosAPI, generarResumenFinanciero };