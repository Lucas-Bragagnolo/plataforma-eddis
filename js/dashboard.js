// Simple Dashboard Module

//console.log('[DEBUG] Dashboard.js cargado');
import { apiService, ApiError, COUNTRIES } from "./api.js"
import { showToast, formatDate } from "./utils.js"
import { checkAuthStatus, logout } from "./auth.js"

// Mostrar estado vacío cuando no hay datos
function mostrarEstadoVacio() {
  //console.log('[DEBUG] Entrando a mostrarEstadoVacio');
  const emptyState = document.getElementById('emptyState');
  const courseDetails = document.getElementById('courseDetails');

  if (emptyState && courseDetails) {
    emptyState.classList.remove('hidden');
    courseDetails.classList.add('hidden');
  }
  //console.log('[DEBUG] mostrarEstadoVacio completado');
}

// Variables globales
let userData = {}
let coursesData = {}
let paymentsData = []

// Inicialización del dashboard
document.addEventListener("DOMContentLoaded", async () => {
  //console.log('[DEBUG] Evento DOMContentLoaded disparado');

  if (!checkAuthStatus()) {
    //console.log('[DEBUG] Usuario NO autenticado');
    return;
  }
  //console.log('[DEBUG] Usuario autenticado');

  // Show current country info
  displayCurrentCountryInfo();

  // Initialize dashboard
  //console.log('[DEBUG] Iniciando initializeDashboard');
  await initializeDashboard();
  //console.log('[DEBUG] initializeDashboard completado');

  setupEventListeners();
  //console.log('[DEBUG] Event listeners configurados');
})

// Display current country information
function displayCurrentCountryInfo() {
  //console.log('[DEBUG] displayCurrentCountryInfo');
  const currentCountry = apiService.getCurrentCountry()
  //console.log('[DEBUG] Current country:', currentCountry);
  const countryInfo = COUNTRIES[currentCountry]
  //console.log('[DEBUG] Country info:', countryInfo);

  if (countryInfo) {
    // Add country indicator to header
    addCountryIndicator(countryInfo)

    // Show welcome message
    showToast(`Conectado desde ${countryInfo.name}`, "info")
  }
}

// Add country indicator to header
function addCountryIndicator(countryInfo) {
  const header = document.querySelector("header")
  if (!header) return

  // Remove existing indicator
  const existingIndicator = header.querySelector(".country-indicator")
  if (existingIndicator) {
    existingIndicator.remove()
  }

  // Create new indicator
  const indicator = document.createElement("div")
  indicator.className =
    "country-indicator flex items-center bg-blue-100 text-blue-800 px-3 py-2 rounded-full text-sm font-medium mr-4"
  indicator.innerHTML = `
    <span class="mr-2">${countryInfo.flag}</span>
    
  `

  // Insert before dark mode toggle
  const darkModeToggle = header.querySelector("#toggleDarkMode")
  if (darkModeToggle) {
    header.insertBefore(indicator, darkModeToggle)
  } else {
    header.appendChild(indicator)
  }
}

// Initialize dashboard
async function initializeDashboard() {
  //console.log('[DEBUG] Entrando a initializeDashboard');
  showTab("tab-cursos-actuales");
  //console.log('[DEBUG] Tab mostrado');

  try {
    //console.log('[DEBUG] Llamando a loadUserDataFromAPI');
    await loadUserDataFromAPI();
    //    console.log('[DEBUG] loadUserDataFromAPI completado');
  } catch (error) {
    //console.error('[ERROR] Error en initializeDashboard:', error);
    throw error;
  }
}

// Load user data from API
async function loadUserDataFromAPI() {
  //console.log('[DEBUG] Entrando a loadUserDataFromAPI');
  const entidad = localStorage.getItem('lastLoginCountry');
  const currentCountry = apiService.getCurrentCountry();
  const countryInfo = COUNTRIES[currentCountry];

  try {
    //console.log('[DEBUG] Mostrando toast de carga');
    showToast(`Cargando datos desde ${entidad}...`, "info");

    //console.log('[DEBUG] Llamando a getAlumnoData');
    const response = await apiService.getAlumnoData();
    //console.log('[DEBUG] Respuesta de getAlumnoData:', response);

    if (response.success) {
      // Update global data
      userData = response;
      // userData.fechaini = response.fechaini;
      //console.log('[DEBUG] Actualizando datos de usuario:', userData);
      //console.log('[DEBUG] Llamando a poblarSelectorCursos');
      poblarSelectorCursos(response.cursos);
      //console.log('[DEBUG] poblarSelectorCursos completado');

      updateUserInterface();
      //console.log('[DEBUG] UI actualizada');

      showToast(`Datos cargados correctamente`, "success");
    } else {
      //console.error('[ERROR] Respuesta sin success:', response);
      throw new Error(response.message || "Error al cargar los datos");
    }
  } catch (error) {
    console.error('[ERROR] Error en loadUserDataFromAPI:', error);
    handleDataLoadError(error);
  }
}

// Handle data loading errors
function handleDataLoadError(error) {
  if (error instanceof ApiError) {
    if (error.isUnauthorized()) {
      showToast("Sesión expirada. Redirigiendo al login...", "error")
      apiService.logout()
      setTimeout(() => {
        window.location.href = "login.html"
      }, 2000)
    } else {
      showToast(error.message, "error")
    }
  } else {
    showToast("Error al cargar los datos. Inténtalo de nuevo.", "error")
  }
}

// Update user interface
function updateUserInterface() {
  //console.log('[DEBUG] Entrando a updateUserInterface');
  updateUserProfile(userData);
  updateUserData();
  updatePaymentsHistory();
  //console.log('[DEBUG] updateUserInterface completado');
}

// Update user profile
function updateUserData() {
  //console.log('[DEBUG] Entrando a updateUserData');
  const nombreUsuario = document.getElementById("nombreUsuario");
  //console.log('[DEBUG] updateUserData userData:', userData);
  if (nombreUsuario) {
    if (userData) {
      nombreUsuario.textContent = userData.nombre + " " + userData.apellido;
      //console.log('[DEBUG] Renderizado en #nombreUsuario:', userData);
    } else {
      nombreUsuario.textContent = "";
      //console.log('[DEBUG] userData incompleto, no se renderiza nombre');
    }
  } else {
    //console.log('[DEBUG] No se encontró el elemento #nombreUsuario en el DOM');
  }
  //console.log('[DEBUG] updateUserData completado');
}

function updateUserProfile() {
  //console.log('[DEBUG] Entrando a updateUserProfile');
  const currentCountry = apiService.getCurrentCountry()
  const countryInfo = COUNTRIES[currentCountry]

  const elements = {
    nombreUsuario: `${userData.nombre} ${userData.apellido}`,
    userNombre: `${userData.nombre} ${userData.apellido}`,
    userEmail: userData.email,
    userLegajo: userData.legajo,
    userDocumento: userData.documento,
    miembroDesde: `Miembro desde: ${userData.fechaingreso}`,
  }

  Object.entries(elements).forEach(([id, value]) => {
    const element = document.getElementById(id)
    if (element) {
      element.textContent = value
    }
  })

  // Add country info to user card
  const userCard = document.getElementById("userCard")
  const entidad = localStorage.getItem('lastLoginCountry');
  if (userCard && countryInfo) {
    // Remove existing country badge
    const existingBadge = userCard.querySelector(".country-badge")
    if (existingBadge) {
      existingBadge.remove()
    }

    // Add country badge
    const countryBadge = document.createElement("div")
    countryBadge.className = "country-badge text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded mt-1"
    countryBadge.innerHTML = `${entidad}`

    const userInfo = userCard.querySelector("#userInfo")
    if (userInfo) {
      userInfo.appendChild(countryBadge)
    }
  }

  // Fill form inputs
  const formInputs = {
    nombreInput: userData.nombre,
    apellidoInput: userData.apellido,
    emailInput: userData.email,
    documentoInput: userData.documento,
    telefonoInput: userData.telefono,
    ubicacionInput: userData.ubicacion,
  }

  Object.entries(formInputs).forEach(([id, value]) => {
    const input = document.getElementById(id)
    if (input) {
      input.value = value || ""
    }
  })
  //console.log('[DEBUG] updateUserProfile completado');
}

// Update payments history
function updatePaymentsHistory() {
  //console.log('[DEBUG] Entrando a updatePaymentsHistory');
  const container = document.getElementById("contenedor-pagos")
  if (!container) return

  container.innerHTML = ""

  paymentsData.forEach((payment) => {
    const paymentCard = createPaymentCard(payment)
    container.appendChild(paymentCard)
  })
  //console.log('[DEBUG] updatePaymentsHistory completado');
}

// Create payment card
function createPaymentCard(payment) {
  //console.log('[DEBUG] Entrando a createPaymentCard');
  const card = document.createElement("div")
  card.className = "bg-white rounded-lg shadow-sm border border-gray-200 p-6"

  const statusClass = {
    pagado: "bg-green-100 text-green-800",
    pendiente: "bg-yellow-100 text-yellow-800",
    vencido: "bg-red-100 text-red-800",
  }

  card.innerHTML = `
    <div class="flex items-start justify-between mb-4">
      <div>
        <h3 class="text-lg font-semibold text-gray-900">${payment.curso}</h3>
        <p class="text-sm text-gray-500">${formatDate(payment.fecha)}</p>
      </div>
      <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusClass[payment.estado]}">
        ${payment.estado.charAt(0).toUpperCase() + payment.estado.slice(1)}
      </span>
    </div>
    <div class="space-y-2">
      <div class="flex justify-between">
        <span class="text-sm text-gray-500">Monto:</span>
        <span class="text-sm font-medium text-gray-900">${payment.monto}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-sm text-gray-500">Método:</span>
        <span class="text-sm text-gray-900">${payment.metodo}</span>
      </div>
    </div>
  `
  //console.log('[DEBUG] createPaymentCard completado');
  return card
}

// Show tab
function showTab(tabId) {
  //console.log('[DEBUG] Entrando a showTab');
  const tabContents = document.querySelectorAll(".tab-content")
  tabContents.forEach((tab) => {
    tab.classList.add("hidden")
  })
  const activeTab = document.getElementById(tabId)
  if (activeTab) {
    activeTab.classList.remove("hidden")
  }
  //console.log('[DEBUG] showTab completado');
}

// Setup event listeners
function setupEventListeners() {
  //console.log('[DEBUG] Entrando a setupEventListeners');
  // Menu navigation
  const menuButtons = document.querySelectorAll("#menuNav button, .px-4 button")
  menuButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetTab = button.getAttribute("data-tab")
      if (targetTab) {
        showTab(targetTab)
        menuButtons.forEach((btn) => btn.classList.remove("active-tab"))
        button.classList.add("active-tab")
      }
    })
  })

  // Logout button
  const logoutBtn = document.getElementById("cerrarSesionBtn")
  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogout)
  }
  //console.log('[DEBUG] setupEventListeners completado');
}

// Handle logout
function handleLogout() {
  //console.log('[DEBUG] Entrando a handleLogout');
  const currentCountry = apiService.getCurrentCountry()
  const countryInfo = COUNTRIES[currentCountry]

  if (confirm(`¿Cerrar sesión ?`)) {
    logout()
  }
  //console.log('[DEBUG] handleLogout completado');
}

// Evento para traer datos de curso al seleccionar
const courseSelector = document.getElementById('courseSelector');
if (courseSelector) {
  courseSelector.addEventListener('change', async function (e) {
    //console.log('[DEBUG] Entrando a evento de cambio de curso');
    const courseId = e.target.value;
    if (!courseId) return;
    try {
      // Mostrar loading o feedback si quieres
      // --- DEBUG INICIO ---
      const token = apiService.getAuthToken();
      const country = localStorage.getItem('selectedCountry');
      const countryMap = {
        argentina: 'ar',
        uruguay: 'uy',
        paraguay: 'py',
        studio_beauty: 'sb'
      };
      const apiCountry = countryMap[country] || country;
      //console.log('[DEBUG] Token:', token);
      //console.log('[DEBUG] País (localStorage):', country);
      //console.log('[DEBUG] País para API:', apiCountry);
      //console.log('[DEBUG] ID Curso:', courseId);
      if (!token || !apiCountry || !courseId) {
        console.warn('[DEBUG] Faltan parámetros para la petición:', { token, apiCountry, courseId });
        alert('Faltan parámetros para la petición. Verifica token, país y curso.');
        mostrarEstadoVacio();
        return;
      }
      const params = new URLSearchParams({ pais: apiCountry, token, idcur: courseId }).toString();
      const urlFinal = `/cursos/datos.php?${params}`;
      //  console.log('[DEBUG] URL final:', urlFinal);

      // Mostrar loader
      const overlay = document.getElementById('apiOverlay');
      if (overlay) {
        overlay.classList.remove('hidden');
      }

      // --- DEBUG FIN ---
      let data;
      try {
        //console.log('[DEBUG] Llamando a getCursoData');
        data = await apiService.getCursoData(courseId);
        //console.log('[DEBUG] Respuesta de getCursoData:', data);
      } catch (err) {
        console.error('[DEBUG] Error completo al obtener datos del curso:', err);
        alert('Error de conexión o de API: ' + (err && err.message ? err.message : err));
        mostrarEstadoVacio();
      } finally {
        // Ocultar loader
        if (overlay) {
          overlay.classList.add('hidden');
        }
      }

      // Actualizar la UI con los datos completos del curso
      if (data) {
        //console.log('[DEBUG] Llamando a mostrarDetallesCurso');
        mostrarDetallesCurso(data);
      } else {
        alert('La respuesta de la API no contiene datos válidos.');
        mostrarEstadoVacio();
      }
    } catch (err) {
      console.error('Error al obtener datos del curso:', err);
      // showToast('No se pudo cargar la información del curso', 'error');
    }
    //console.log('[DEBUG] Evento de cambio de curso completado');
  });
}

// Toggle dark mode
const darkToggleBtn = document.getElementById('toggleDarkMode');
if (darkToggleBtn) {
  darkToggleBtn.addEventListener('click', function () {
    //  console.log('[DEBUG] Entrando a evento de cambio de modo oscuro');
    document.body.classList.toggle('dark');
    // Guardar preferencia
    if (document.body.classList.contains('dark')) {
      localStorage.setItem('darkMode', '1');
    } else {
      localStorage.setItem('darkMode', '0');
    }
    //console.log('[DEBUG] Evento de cambio de modo oscuro completado');
  });
  // Al cargar, aplica preferencia guardada
  if (localStorage.getItem('darkMode') === '1') {
    document.body.classList.add('dark');
  }
}

// Mostrar detalles del curso en la UI
function mostrarDetallesCurso(curso) {
  //console.log('[DEBUG] Entrando a mostrarDetallesCurso');
  const emptyState = document.getElementById('emptyState');
  const courseDetails = document.getElementById('courseDetails');
  const courseName = document.getElementById('courseName');
  const courseStatus = document.getElementById('courseStatus');
  const courseDates = document.getElementById('courseDates');

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
  // Actualizar progreso circular
  const progressCircle = document.getElementById('progressCircle');
  const progressPercentage = document.getElementById('progressPercentage');

  // Actualizar card de asistencia
  const attendancePercentage = document.getElementById('attendancePercentage');
  const attendedClasses = document.getElementById('attendedClasses');
  const totalClasses = document.getElementById('totalClasses');
  const studyHours = document.getElementById('studyHours');

  // Calcular valores
  const clasesHechas = parseInt(curso.claseshechas) || 0;
  const clasesTotales = parseInt(curso.clasestotales) || 0;
  const asistencia = clasesTotales > 0 ? Math.round((clasesHechas / clasesTotales) * 100) : 0;
  const avance = parseInt(curso.avance) || 0;

  // Actualizar progreso circular
  if (progressCircle && progressPercentage) {
    const circumference = 2 * Math.PI * 64; // radius = 64
    const offset = circumference - (avance / 100) * circumference;

    progressCircle.style.strokeDashoffset = offset;
    progressPercentage.textContent = `${avance}%`;
  }

  // Actualizar elementos de asistencia
  if (attendancePercentage) attendancePercentage.textContent = `${asistencia}%`;
  if (attendedClasses) attendedClasses.textContent = clasesHechas;
  if (totalClasses) totalClasses.textContent = clasesTotales;
  if (studyHours) studyHours.textContent = curso.tiempouso || '0:00';

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
      paymentAmount.textContent = `$${importe.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;

      paymentDue.textContent = `${cuotaMostrar.mes} - Vence: ${cuotaMostrar.fechaven}`;

      // Ocultar botón de pago (se puede implementar más adelante)
      if (payButton) payButton.classList.add('hidden');
      // Botón para ver cuenta corriente
      let verCuentaBtn = document.getElementById('verCuentaCorrienteBtn');
      if (!verCuentaBtn) {
        verCuentaBtn = document.createElement('button');
        verCuentaBtn.id = 'verCuentaCorrienteBtn';
        verCuentaBtn.className = 'mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200';
        verCuentaBtn.innerHTML = '<i class="fa-solid fa-list mr-2"></i>Ver cuenta corriente';
        payButton.parentElement.appendChild(verCuentaBtn);
      }
      verCuentaBtn.onclick = () => {
        // Ocultar panel detalle
        const detalles = document.querySelector('#courseDetails [class*="lg:col-span-2"]');
        const sidebar = document.querySelector('#courseDetails > div > div.space-y-4');
        if (detalles) detalles.style.display = 'none';
        if (sidebar) {
          // Ocultar toda la barra lateral
          sidebar.style.display = 'none';
        }
        // Mostrar cuenta corriente
        const cuentaContainer = document.getElementById('cuentaCorrienteContainer');
        if (cuentaContainer) {
          cuentaContainer.style.display = '';
          cuentaContainer.innerHTML = '';
          let volverBtn = document.getElementById('volverDatosCursoBtn');
          if (!volverBtn) {
            volverBtn = document.createElement('button');
            volverBtn.id = 'volverDatosCursoBtn';
            volverBtn.className = 'mb-4 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200';
            volverBtn.innerHTML = '<i class="fa-solid fa-arrow-left mr-2"></i>Volver a los datos del curso';
            cuentaContainer.parentElement.insertBefore(volverBtn, cuentaContainer);
          }
          volverBtn.onclick = () => {
            // Mostrar panel detalle
            if (detalles) detalles.style.display = '';
            if (sidebar) sidebar.style.display = '';
            
            // Buscar y mostrar los paneles de la sidebar
            const estadoCuotaCard = sidebar?.querySelector('.bg-white');
            const examFeeCardElement = document.getElementById('examFeeCard');
            
            // Ocultar completamente el contenedor de cuenta corriente
            cuentaContainer.style.display = 'none';
            cuentaContainer.innerHTML = '';
            
            // Remover el botón
            volverBtn.remove();
            
            console.log('[DEBUG] Volviendo a vista normal del curso');
          };
          mostrarHistorialCuotasEnPantalla(curso.cuotas, curso.textoplan);
        }
      };
    }

    // Manejar derecho de examen (cuota 99)
    const cuotaExamen = curso.cuotas.find(c => c.cuota === '99');
    if (cuotaExamen && examFeeCard) {
      examFeeCard.classList.remove('hidden');

      const examenPagado = cuotaExamen.pagado == '1' || cuotaExamen.pagado == '2';

      // Obtener todas las cuotas regulares (excluyendo la cuota 99 del derecho de examen)
      const cuotasRegulares = curso.cuotas.filter(c => c.cuota !== '99');

      // Verificar que TODAS las cuotas regulares estén pagadas (pagado == '1' o pagado == '2')
      const todasCuotasPagadas = cuotasRegulares.length > 0 && cuotasRegulares.every(c => c.pagado == '1' || c.pagado == '2');
      console.log(todasCuotasPagadas+"cuotas")
      // Contar cuotas pendientes (pagado == '0')
      const cuotasPendientes = cuotasRegulares.filter(c => c.pagado == '0');

      // Debug para desarrollo
      console.log('[DERECHO EXAMEN] Estado actual:', {
        totalCuotasRegulares: cuotasRegulares.length,
        cuotasPendientes: cuotasPendientes.length,
        todasCuotasPagadas: todasCuotasPagadas,
        examenPagado: examenPagado,
        detallesCuotas: cuotasRegulares.map(c => ({
          cuota: c.cuota,
          mes: c.mes,
          pagado: c.pagado,
          importe: c.importe
        }))
      });

      if (examFeeStatus) {
        let estadoTexto = 'Pendiente';
        let estadoClass = 'bg-yellow-100 text-yellow-800';

        if (examenPagado) {
          estadoTexto = cuotaExamen.pagado == '2' ? 'Pagado (Pronto Pago)' : 'Pagado';
          estadoClass = 'bg-green-100 text-green-800';
        } else if (todasCuotasPagadas) {
          estadoTexto = 'Disponible para Pago';
          estadoClass = 'bg-blue-100 text-blue-800';
        } else {
          estadoTexto = 'No Disponible';
          estadoClass = 'bg-red-100 text-red-800';
        }

        examFeeStatus.textContent = estadoTexto;
        examFeeStatus.className = `inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${estadoClass}`;
      }

      if (examFeeAmount) {
        const importeExamen = parseFloat(cuotaExamen.importe);
        examFeeAmount.textContent = `$${importeExamen.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;
      }

      if (examFeeDue) {
        let mensajeDetalle = '';

        if (examenPagado) {
          mensajeDetalle = `
            <div class="text-xs text-green-600 mt-2">
              <i class="fa-solid fa-check-circle mr-1"></i>
              Derecho de examen abonado correctamente
            </div>
          `;
        } else if (todasCuotasPagadas) {
          mensajeDetalle = `
            <div class="text-xs text-blue-600 mt-2">
              <i class="fa-solid fa-info-circle mr-1"></i>
              ¡Felicitaciones! Ya puedes abonar el derecho de examen
            </div>
          `;
        } else {
          // Hay cuotas pendientes - mensaje claro y simple
          const mensajePendientes = cuotasPendientes.length === 1
            ? `Tienes 1 cuota pendiente de pago`
            : `Tienes ${cuotasPendientes.length} cuotas pendientes de pago`;

          mensajeDetalle = `
            <div class="text-xs text-red-600 mt-2">
              <i class="fa-solid fa-lock mr-1"></i>
              <div class="font-medium">Derecho de examen no disponible</div>
              <div class="mt-1">${mensajePendientes}</div>
              <div class="text-xs mt-2 opacity-75">
                Debes estar al día con todas las cuotas para poder abonar el derecho de examen
              </div>
            </div>
          `;
        }

        if (examenPagado || todasCuotasPagadas) {
          examFeeDue.innerHTML = `
            <div class="text-xs text-gray-600">
              ${cuotaExamen.mes} - Vence: ${cuotaExamen.fechaven}
            </div>
            ${mensajeDetalle}
          `;
        } else {
          examFeeDue.innerHTML = mensajeDetalle;
        }
      }

      // NUEVA LÓGICA DEL BOTÓN DE PAGO DEL DERECHO DE EXAMEN
      if (payExamFeeButton) {
        console.log('[DERECHO EXAMEN] Botón encontrado:', payExamFeeButton);
        // Condición simple: El examen NO debe estar pagado Y TODAS las cuotas regulares deben estar pagadas
        const puedeAbonarExamen = !examenPagado && todasCuotasPagadas;

        console.log('[DERECHO EXAMEN] Evaluación simplificada:', {
          puedeAbonar: puedeAbonarExamen,
          examenNoPagado: !examenPagado,
          todasCuotasPagadas: todasCuotasPagadas,
          cuotasPendientes: cuotasPendientes.length
        });

        if (puedeAbonarExamen) {
          // Mostrar y habilitar botón
          payExamFeeButton.classList.remove('hidden');
          payExamFeeButton.style.display = 'block'; // Forzar visualización
          payExamFeeButton.disabled = false;
          payExamFeeButton.innerHTML = '<i class="fa-solid fa-graduation-cap mr-2"></i>Pagar Derecho de Examen';
          payExamFeeButton.className = 'w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200';
          console.log('[DERECHO EXAMEN] Botón mostrado - condiciones cumplidas');

          // Configurar evento de click
          payExamFeeButton.onclick = () => {
            const confirmacion = confirm(`¿Confirmas el pago del derecho de examen por $${parseFloat(cuotaExamen.importe).toLocaleString('es-AR', { minimumFractionDigits: 2 })}?`);

            if (confirmacion) {
              showToast("Redirigiendo al sistema de pagos...", "info");

              // Aquí integrarías con tu sistema de pagos real
              console.log('[DERECHO EXAMEN] Iniciando pago:', {
                cuota: cuotaExamen.cuota,
                importe: cuotaExamen.importe,
                mes: cuotaExamen.mes
              });

              // Simulación temporal (remover en producción)
              setTimeout(() => {
                showToast("Pago procesado correctamente", "success");
              }, 2000);
            }
          };
        } else {
          // Ocultar botón cuando no se cumplen las condiciones
          payExamFeeButton.classList.add('hidden');
          payExamFeeButton.style.display = 'none'; // Forzar ocultación
          console.log('[DERECHO EXAMEN] Botón ocultado - condiciones no cumplidas');
        }
      }
    } else if (examFeeCard) {
      examFeeCard.classList.add('hidden');
    }
  }

  // Alternar solo cuenta corriente
  function mostrarSoloCuentaCorriente(curso) {
    // Oculta todo menos el título
    const detalles = document.querySelector('#courseDetails [class*=col-span-2]');
    const sidebar = document.querySelector('#courseDetails [class*=space-y-6]');
    if (detalles) detalles.style.display = 'none';
    if (sidebar) sidebar.style.display = 'none';
    // Mostrar solo el título y la cuenta corriente
    const cuentaContainer = document.getElementById('cuentaCorrienteContainer');
    if (cuentaContainer) {
      cuentaContainer.innerHTML = '';
      cuentaContainer.style.display = '';
      // Botón volver
      let volverBtn = document.getElementById('volverDatosCursoBtn');
      if (!volverBtn) {
        volverBtn = document.createElement('button');
        volverBtn.id = 'volverDatosCursoBtn';
        volverBtn.className = 'mb-4 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200';
        volverBtn.innerHTML = '<i class="fa-solid fa-arrow-left mr-2"></i>Volver a los datos del curso';
        cuentaContainer.parentElement.insertBefore(volverBtn, cuentaContainer);
      }
      volverBtn.onclick = () => mostrarDatosCompletosCurso(curso);
      mostrarHistorialCuotasEnPantalla(curso.cuotas, curso.textoplan);
    }
  }

  function mostrarDatosCompletosCurso(curso) {
    // Mostrar todos los datos
    const detalles = document.querySelector('#courseDetails [class*=col-span-2]');
    const sidebar = document.querySelector('#courseDetails [class*=space-y-6]');
    if (detalles) detalles.style.display = '';
    if (sidebar) sidebar.style.display = '';
    // Quitar botón volver
    let volverBtn = document.getElementById('volverDatosCursoBtn');
    if (volverBtn) volverBtn.remove();
    // Limpiar cuenta corriente
    mostrarHistorialCuotasEnPantalla(curso.cuotas, curso.textoplan);
  }

  // Mostrar historial de cuotas en pantalla - VERSIÓN MEJORADA
  function mostrarHistorialCuotasEnPantalla(cuotas, nombreCurso) {
    const container = document.getElementById('cuentaCorrienteContainer');
    if (!container) return;

    // Separar cuotas regulares y derecho de examen
    const cuotasRegulares = cuotas.filter(c => c.cuota !== '99');
    const cuotaExamen = cuotas.find(c => c.cuota === '99');

    // Función para obtener el estado visual de una cuota
    function getEstadoCuota(cuota) {
      if (cuota.pagado == '1') {
        return {
          texto: 'Pagada',
          clase: 'bg-green-100 text-green-800 border-green-200',
          icono: 'fa-check-circle text-green-600'
        };
      } else if (cuota.pagado == '2') {
        return {
          texto: 'Pronto Pago',
          clase: 'bg-blue-100 text-blue-800 border-blue-200',
          icono: 'fa-clock text-blue-600'
        };
      } else {
        // Verificar si está vencida
        const hoy = new Date();
        const fechaVencimiento = new Date(cuota.fechaven);
        const estaVencida = fechaVencimiento < hoy;
        
        return {
          texto: estaVencida ? 'Vencida' : 'Pendiente',
          clase: estaVencida ? 'bg-red-100 text-red-800 border-red-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icono: estaVencida ? 'fa-exclamation-triangle text-red-600' : 'fa-clock text-yellow-600'
        };
      }
    }

    // Calcular estadísticas
    const totalCuotas = cuotasRegulares.length;
    const cuotasPagadas = cuotasRegulares.filter(c => c.pagado == '1' || c.pagado == '2').length;
    const cuotasPendientes = cuotasRegulares.filter(c => c.pagado == '0').length;
    const porcentajePagado = totalCuotas > 0 ? Math.round((cuotasPagadas / totalCuotas) * 100) : 0;

    container.innerHTML = `
      <div class="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6">
        <!-- Header con estadísticas -->
        <div class="mb-6">
          <h3 class="text-xl font-bold text-gray-900 mb-2">Cuenta Corriente - ${nombreCurso}</h3>
          
          <!-- Barra de progreso -->
          <div class="mb-4">
            <div class="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progreso de pagos</span>
              <span>${cuotasPagadas}/${totalCuotas} cuotas pagadas (${porcentajePagado}%)</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-3">
              <div class="bg-green-500 h-3 rounded-full transition-all duration-500" style="width: ${porcentajePagado}%"></div>
            </div>
          </div>

          <!-- Estadísticas rápidas -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <div class="text-center p-3 bg-gray-50 rounded-lg">
              <div class="text-2xl font-bold text-gray-900">${totalCuotas}</div>
              <div class="text-xs text-gray-500">Total Cuotas</div>
            </div>
            <div class="text-center p-3 bg-green-50 rounded-lg">
              <div class="text-2xl font-bold text-green-600">${cuotasPagadas}</div>
              <div class="text-xs text-gray-500">Pagadas</div>
            </div>
            <div class="text-center p-3 bg-yellow-50 rounded-lg">
              <div class="text-2xl font-bold text-yellow-600">${cuotasPendientes}</div>
              <div class="text-xs text-gray-500">Pendientes</div>
            </div>
            ${cuotaExamen ? `
            <div class="text-center p-3 bg-purple-50 rounded-lg">
              <div class="text-2xl font-bold text-purple-600">${cuotaExamen.pagado == '1' || cuotaExamen.pagado == '2' ? '✓' : '○'}</div>
              <div class="text-xs text-gray-500">Der. Examen</div>
            </div>
            ` : ''}
          </div>
        </div>

        <!-- Vista de tarjetas para móvil y desktop -->
        <div class="space-y-3">
          <h4 class="text-lg font-semibold text-gray-900 mb-3">Cuotas Regulares</h4>
          
          <!-- Vista Desktop: Grid de tarjetas -->
          <div class="hidden sm:grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            ${cuotasRegulares.map(cuota => {
              const estado = getEstadoCuota(cuota);
              const importe = parseFloat(cuota.importe);
              const prontoPago = cuota.ppago && cuota.ppago !== '0.00' ? parseFloat(cuota.ppago) : null;
              
              return `
                <div class="border rounded-lg p-4 ${estado.clase} transition-all duration-200 hover:shadow-md">
                  <!-- Header de la cuota -->
                  <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center space-x-2">
                      <span class="text-lg font-bold">Cuota ${cuota.cuota}</span>
                      <i class="fas ${estado.icono}"></i>
                    </div>
                    <span class="px-2 py-1 rounded-full text-xs font-medium ${estado.clase}">
                      ${estado.texto}
                    </span>
                  </div>
                  
                  <!-- Información de la cuota -->
                  <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                      <span class="text-gray-600">Mes:</span>
                      <span class="font-medium">${cuota.mes}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">${cuota.pagado == '2' ? 'Pagó (Pronto Pago):' : 'Importe:'}</span>
                      <span class="font-bold">$${(cuota.pagado == '2' && prontoPago ? prontoPago : importe).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Vencimiento:</span>
                      <span class="font-medium">${cuota.fechaven}</span>
                    </div>
                  </div>
                  
                  <!-- Botón de impresión (solo si está pagada y tiene link de recibo) -->
                  ${(cuota.pagado == '1' || cuota.pagado == '2') ? `
                  <div class="mt-3 pt-3 border-t border-black/10">
                    <button 
                      onclick="window.open('${cuota.linkRecibo}', '_blank')"
                      class="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors duration-200"
                      title="Imprimir recibo de pago"
                    >
                      <i class="fas fa-print"></i>
                      <span>Imprimir Recibo</span>
                    </button>
                  </div>
                  ` : ''}
                </div>
              `;
            }).join('')}
          </div>

          <!-- Vista Móvil: Acordeón -->
          <div class="sm:hidden space-y-2">
            ${cuotasRegulares.map((cuota, index) => {
              const estado = getEstadoCuota(cuota);
              const importe = parseFloat(cuota.importe);
              const prontoPago = cuota.ppago && cuota.ppago !== '0.00' ? parseFloat(cuota.ppago) : null;
              
              return `
                <div class="border rounded-lg ${estado.clase} overflow-hidden">
                  <!-- Header clickeable del acordeón -->
                  <button 
                    class="w-full p-3 text-left flex items-center justify-between hover:bg-black/5 transition-colors duration-200"
                    onclick="toggleAccordion('cuota-${cuota.cuota}')"
                    aria-expanded="false"
                    aria-controls="cuota-${cuota.cuota}-content"
                  >
                    <div class="flex items-center space-x-3">
                      <i class="fas ${estado.icono}"></i>
                      <div>
                        <span class="font-bold text-sm">Cuota ${cuota.cuota}</span>
                        <div class="text-xs text-gray-600">${cuota.mes}</div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-2">
                      <span class="px-2 py-1 rounded-full text-xs font-medium ${estado.clase}">
                        ${estado.texto}
                      </span>
                      <i class="fas fa-chevron-down transition-transform duration-200" id="cuota-${cuota.cuota}-icon"></i>
                    </div>
                  </button>
                  
                  <!-- Contenido colapsable -->
                  <div 
                    id="cuota-${cuota.cuota}-content" 
                    class="accordion-content max-h-0 overflow-hidden transition-all duration-300 ease-in-out"
                  >
                    <div class="p-3 pt-0 border-t border-black/10">
                      <div class="space-y-2 text-sm">
                        <div class="flex justify-between items-center p-2 bg-white/30 rounded">
                          <span class="text-gray-700">Mes:</span>
                          <span class="font-medium">${cuota.mes}</span>
                        </div>
                        <div class="flex justify-between items-center p-2 bg-white/30 rounded">
                          <span class="text-gray-700">${cuota.pagado == '2' ? 'Pagó (Pronto Pago):' : 'Importe:'}</span>
                          <span class="font-bold">$${(cuota.pagado == '2' && prontoPago ? prontoPago : importe).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div class="flex justify-between items-center p-2 bg-white/30 rounded">
                          <span class="text-gray-700">Vencimiento:</span>
                          <span class="font-medium">${cuota.fechaven}</span>
                        </div>
                        
                        <!-- Botón de impresión móvil (solo si está pagada y tiene link de recibo) -->
                        ${(cuota.pagado == '1' || cuota.pagado == '2') && cuota.linkRecibo ? `
                        <button 
                          onclick="window.open('${cuota.linkRecibo}', '_blank')"
                          class="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors duration-200 mt-2"
                          title="Imprimir recibo de pago"
                        >
                          <i class="fas fa-print"></i>
                          <span>Imprimir Recibo</span>
                        </button>
                        ` : ''}
                      </div>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>

          <!-- Derecho de Examen (si existe) -->
          ${cuotaExamen ? `
          <div class="mt-8">
            <h4 class="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <i class="fas fa-graduation-cap text-purple-600 mr-2"></i>
              Derecho de Examen
            </h4>
            <div class="border-2 border-purple-200 rounded-xl p-5 ${getEstadoCuota(cuotaExamen).clase} max-w-md shadow-lg bg-gradient-to-br from-purple-50 to-indigo-50">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <i class="fas fa-certificate text-purple-600"></i>
                  </div>
                  <div>
                    <span class="text-lg font-bold text-purple-900">Derecho de Examen</span>
                    <div class="text-xs text-purple-600">Cuota especial</div>
                  </div>
                </div>
                <span class="px-3 py-1 rounded-full text-xs font-medium ${getEstadoCuota(cuotaExamen).clase} shadow-sm">
                  ${getEstadoCuota(cuotaExamen).texto}
                </span>
              </div>
              <div class="space-y-3 text-sm">
                <div class="flex justify-between items-center p-2 bg-white/50 rounded-lg">
                  <span class="text-gray-700 font-medium">Período:</span>
                  <span class="font-semibold text-gray-900">${cuotaExamen.mes}</span>
                </div>
                <div class="flex justify-between items-center p-2 bg-white/50 rounded-lg">
                  <span class="text-gray-700 font-medium">${cuotaExamen.pagado == '2' ? 'Pagó (Pronto Pago):' : 'Importe:'}</span>
                  <span class="font-bold text-lg text-purple-900">$${(cuotaExamen.pagado == '2' && cuotaExamen.ppago && cuotaExamen.ppago !== '0.00' ? parseFloat(cuotaExamen.ppago) : parseFloat(cuotaExamen.importe)).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div class="flex justify-between items-center p-2 bg-white/50 rounded-lg">
                  <span class="text-gray-700 font-medium">Vencimiento:</span>
                  <span class="font-semibold text-gray-900">${cuotaExamen.fechaven}</span>
                </div>
                
                <!-- Botón de impresión para derecho de examen (solo si está pagado y tiene link de recibo) -->
                ${(cuotaExamen.pagado == '1' || cuotaExamen.pagado == '2') && cuotaExamen.linkRecibo ? `
                <button 
                  onclick="window.open('${cuotaExamen.linkRecibo}', '_blank')"
                  class="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 mt-3 shadow-sm"
                  title="Imprimir recibo de derecho de examen"
                >
                  <i class="fas fa-print"></i>
                  <span>Imprimir Recibo</span>
                </button>
                ` : ''}
              </div>
            </div>
          </div>
          ` : ''}
        </div>
      </div>
    `;

    // Agregar función para manejar el acordeón (solo se ejecuta una vez)
    if (!window.toggleAccordion) {
      window.toggleAccordion = function(cuotaId) {
        const content = document.getElementById(cuotaId + '-content');
        const icon = document.getElementById(cuotaId + '-icon');
        const button = content.previousElementSibling;
        
        if (content.style.maxHeight && content.style.maxHeight !== '0px') {
          // Cerrar
          content.style.maxHeight = '0px';
          icon.style.transform = 'rotate(0deg)';
          button.setAttribute('aria-expanded', 'false');
        } else {
          // Abrir
          content.style.maxHeight = content.scrollHeight + 'px';
          icon.style.transform = 'rotate(180deg)';
          button.setAttribute('aria-expanded', 'true');
        }
      };
    }
  }

  // Función original (mantenida para compatibilidad)
  function mostrarHistorialCuotasEnPantallaOriginal(cuotas, nombreCurso) {
    const container = document.getElementById('cuentaCorrienteContainer');
    if (!container) return;
    container.innerHTML = `
    <div class="bg-white rounded-lg shadow-lg p-2 sm:p-6 mb-6">
      <h3 class="text-xl font-bold mb-4">Cuenta Corriente - ${nombreCurso}</h3>
      <!-- Desktop Table -->
      <div class="hidden sm:block overflow-x-auto">
        <table class="min-w-full text-sm text-left border">
          <thead>
            <tr class="bg-gray-100">
              <th class="py-2 px-2 border">#</th>
              <th class="py-2 px-2 border">Mes</th>
              <th class="py-2 px-2 border">Importe</th>
              <th class="py-2 px-2 border">Pagado</th>
              <th class="py-2 px-2 border">Pronto Pago</th>
              <th class="py-2 px-2 border">Vencimiento</th>
            </tr>
          </thead>
          <tbody>
            ${cuotas.map(c => `
              <tr>
                <td class="py-1 px-2 border">${c.cuota}</td>
                <td class="py-1 px-2 border">${c.mes}</td>
                <td class="py-1 px-2 border">$${parseFloat(c.importe).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</td>
                <td class="py-1 px-2 border">${c.pagado == 1 ? 'Sí' : (c.pagado == 2 ? 'Pronto Pago' : 'No')}</td>
                <td class="py-1 px-2 border">${c.ppago && c.ppago !== '0.00' ? '$' + parseFloat(c.ppago).toLocaleString('es-AR', { minimumFractionDigits: 2 }) : '-'}</td>
                <td class="py-1 px-2 border">${c.fechaven}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      <!-- Mobile List -->
      <div class="block sm:hidden space-y-2">
        ${cuotas.map(c => `
          <div class="bg-gray-50 rounded-lg p-3 border flex flex-col text-xs">
            <div class="flex justify-between"><span class="font-semibold">Cuota:</span> <span>${c.cuota}</span></div>
            <div class="flex justify-between"><span class="font-semibold">Mes:</span> <span>${c.mes}</span></div>
            <div class="flex justify-between"><span class="font-semibold">Importe:</span> <span>$${parseFloat(c.importe).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span></div>
            <div class="flex justify-between"><span class="font-semibold">Pagado:</span> <span>${c.pagado == 1 ? 'Sí' : (c.pagado == 2 ? 'Pronto Pago' : 'No')}</span></div>
            <div class="flex justify-between"><span class="font-semibold">Pronto Pago:</span> <span>${c.ppago && c.ppago !== '0.00' ? '$' + parseFloat(c.ppago).toLocaleString('es-AR', { minimumFractionDigits: 2 }) : '-'}</span></div>
            <div class="flex justify-between"><span class="font-semibold">Vencimiento:</span> <span>${c.fechaven}</span></div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
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
    const certificateContentMobile = document.getElementById('certificateContentMobile');

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

      // PASO 2: Iniciar Swiper.js después de insertar las cards
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
          640: { slidesPerView: 1.3 },
          1024: { slidesPerView: 1.5 },
        }
      });
    }

  }



  // Actualizar estado del derecho de examen
  if (curso.cuotas && Array.isArray(curso.cuotas)) {
    const examCuota = curso.cuotas.find(c => c.cuota === '99');
    if (examCuota) {
      examFeeCard.classList.remove('hidden');
      const examPagada = examCuota.pagado == 1 || examCuota.pagado == 2;
      examFeeStatus.textContent = examPagada ? 'Pagada' : 'Pendiente';
      examFeeStatus.className = examPagada
        ? 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
        : 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';

      examFeeAmount.textContent = examCuota.importe;
      examFeeDue.textContent = examCuota.mes;
      if (!examPagada) {
        payExamFeeButton.classList.remove('hidden');
        payExamFeeButton.onclick = () => pagarCuotaExamen(examCuota);
      } else {
        payExamFeeButton.classList.add('hidden');
      }
      // Ocultar el botón de pagar para derecho de examen
    }
  }

  function pagarCuotaExamen(cuota) {
    const confirmacion = confirm(`¿Deseas proceder con el pago del derecho de examen por $${cuota.importe}?`)

    if (confirmacion) {
      // Mostrar mensaje de procesamiento
      window.showToast("Redirigiendo al sistema de pagos...", "info")

      // Aquí puedes integrar con tu sistema de pagos real
      // Ejemplo: window.location.href = `https://tu-sistema-pagos.com/pagar?cuota=99&monto=${cuota.importe}`;

      console.log("[v0] Iniciando pago para cuota 99:", {
        cuota: cuota.cuota,
        importe: cuota.importe,
        mes: cuota.mes,
      })

      // Simulación de éxito (remover en producción)
      setTimeout(() => {
        window.showToast("Pago procesado correctamente", "success")
      }, 2000)
    }
  }

  // Función para manejar el menú desplegable
  function toggleDropdown(event, certType) {
    event.preventDefault();
    const button = event.currentTarget;
    const dropdownMenu = button.nextElementSibling;
    const currentDropdowns = document.querySelectorAll('.dropdown-menu:not(.hidden)');

    // Cerrar otros dropdowns abiertos
    currentDropdowns.forEach(menu => {
      if (menu !== dropdownMenu) {
        menu.classList.add('hidden');
      }
    });

    // Alternar este dropdown
    dropdownMenu.classList.toggle('hidden');

    // Actualizar aria-expanded
    button.setAttribute('aria-expanded', !dropdownMenu.classList.contains('hidden'));
  }

  // Cerrar dropdowns al hacer clic fuera
  document.addEventListener('click', (event) => {
    const dropdownMenus = document.querySelectorAll('.dropdown-menu');
    const buttons = document.querySelectorAll('[aria-haspopup="true"]');

    dropdownMenus.forEach(menu => {
      if (!menu.contains(event.target) && !buttons.contains(event.target)) {
        menu.classList.add('hidden');
      }
    });
  });

  //console.log('[DEBUG] mostrarDetallesCurso completado');
}

// Llena el select de cursos
function poblarSelectorCursos(cursos) {
  //console.log('[DEBUG] Entrando a poblarSelectorCursos');
  const select = document.getElementById('courseSelector');
  //console.log('[DEBUG] Select encontrado:', !!select);

  if (!select) {
    console.error('[ERROR] No se encontró el select con id courseSelector');
    console.error('[ERROR] HTML actual del documento:', document.body.innerHTML);
    return;
  }

  //console.log('[DEBUG] Cursos recibidos:', cursos);
  //console.log('[DEBUG] Tipo de cursos:', typeof cursos);

  // Verificar si cursos es un objeto y convertirlo a array si es necesario
  if (typeof cursos === 'object' && !Array.isArray(cursos)) {
    //console.log('[DEBUG] Convertir objeto a array');
    cursos = Object.values(cursos);
  }

  // Opción inicial
  select.innerHTML = '<option value="">Selecciona un curso...</option>';

  if (!Array.isArray(cursos)) {
    console.error('[ERROR] El parámetro cursos no es un array:', cursos);
    console.error('[ERROR] Tipo recibido:', typeof cursos);
    return;
  }

  if (cursos.length === 0) {
    console.warn('[WARNING] No hay cursos disponibles');
    return;
  }

  //console.log('[DEBUG] Procesando', cursos.length, 'cursos');

  cursos.forEach((curso, idx) => {
    //console.log(`[DEBUG] Procesando curso [${idx}]:`, curso);

    if (!curso || !curso.id || !curso.nombre) {
      console.error('[ERROR] Curso inválido:', curso);
      return;
    }

    const option = document.createElement('option');
    option.value = curso.id;
    option.textContent = curso.nombre;
    select.appendChild(option);
    //console.log(`[DEBUG] Agregada opción para curso ${curso.id}:`, curso.nombre);
  });

  //console.log('[DEBUG] Select final:', select.innerHTML);
  //console.log('[DEBUG] Total de opciones:', select.options.length);
  //console.log('[DEBUG] poblarSelectorCursos completado');
}
