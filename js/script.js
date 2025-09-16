// [DEBUG] script.js cargado correctamente

// Variable global para almacenar las publicaciones desde la API
let publicacionesData = []

// Función para cargar publicaciones desde la API
async function cargarPublicaciones() {
  const grid = document.getElementById("publicacionesGrid");
  if (!grid) return;
  
  // Mostrar loading state
  mostrarLoadingPublicaciones();
  
  try {
    console.log('[DEBUG] Cargando publicaciones desde la API...');
    
    // Importar el apiService dinámicamente
    const { apiService } = await import('./api.js');
    
    const response = await apiService.getNovedadesData();
    console.log('[DEBUG] Respuesta de novedades API:', response);
    
    if (response.success) {
      // Convertir el objeto de respuesta a un array
      const publicacionesArray = Object.values(response).filter(item => item.id);
      
      // Mapear los datos de la API al formato esperado
      publicacionesData = publicacionesArray.map(item => ({
        id: parseInt(item.id),
        titulo: item.titulo,
        descripcion: item.descripcion,
        fechaPublicacion: item.fecha,
        imagenUrl: item.portada,
        imagenCabecera: item.cabecera,
        orden: parseInt(item.orden),
        vigenciaini: item.vigenciaini,
        vigenciafin: item.vigenciafin
      }));
      
      // Ordenar por orden si está disponible
      publicacionesData.sort((a, b) => a.orden - b.orden);
      
      console.log('[DEBUG] Publicaciones procesadas:', publicacionesData);
      
      // Renderizar las publicaciones
      renderPublicaciones();
      
    } else {
      console.error('[ERROR] Error al cargar publicaciones:', response);
      // Fallback a datos mock en caso de error
      usarDatosMock();
    }
    
  } catch (error) {
    console.error('[ERROR] Error en cargarPublicaciones:', error);
    // Fallback a datos mock en caso de error
    usarDatosMock();
  }
}

// Función para mostrar estado de loading
function mostrarLoadingPublicaciones() {
  const grid = document.getElementById("publicacionesGrid");
  if (!grid) return;
  
  grid.innerHTML = `
    <div class="col-span-full flex flex-col items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-darkmode border-t-transparent mb-4"></div>
      <p class="text-gray-600 dark:text-text-dark-secondary">Cargando novedades...</p>
    </div>
  `;
}

// Función fallback con datos mock
function usarDatosMock() {
  console.log('[DEBUG] Usando datos mock como fallback');
  publicacionesData = [
    {
      id: 1,
      titulo: "Nuevos cursos disponibles para 2024",
      descripcion: "Descubre nuestra nueva oferta educativa con cursos actualizados y certificaciones reconocidas internacionalmente.",
      imagenUrl: "https://picsum.photos/400/400?random=1",
      fechaPublicacion: "2024-01-15",
    },
    {
      id: 2,
      titulo: "Certificaciones internacionales",
      descripcion: "Obtén certificaciones reconocidas mundialmente que impulsen tu carrera profesional.",
      imagenUrl: "https://picsum.photos/400/400?random=2",
      fechaPublicacion: "2024-01-10",
    },
    {
      id: 3,
      titulo: "Plataforma renovada",
      descripcion: "Experimenta nuestra nueva plataforma con mejor diseño, funcionalidades mejoradas y mayor accesibilidad.",
      imagenUrl: "https://picsum.photos/400/400?random=3",
      fechaPublicacion: "2024-01-08",
    }
  ];
  renderPublicaciones();
} 

// DOM elements
const courseSelector = document.getElementById("courseSelector")
const courseDetails = document.getElementById("courseDetails")
const emptyState = document.getElementById("emptyState")
const courseName = document.getElementById("courseName")
const courseStatus = document.getElementById("courseStatus")
const printConstancyBtn = document.getElementById("printConstancyBtn")
const courseStatusMobile = document.getElementById("courseStatusMobile") // Added for mobile status
// Removed progressBar - now using circular progress
const progressText = document.getElementById("progressText")
const completedLessons = document.getElementById("completedLessons")
const totalLessons = document.getElementById("totalLessons")
const studyHours = document.getElementById("studyHours")
const averageScore = document.getElementById("averageScore")
const paymentStatus = document.getElementById("paymentStatus")
const paymentAmount = document.getElementById("paymentAmount")
const paymentDue = document.getElementById("paymentDue")
const payButton = document.getElementById("payButton")
const certificateContent = document.getElementById("certificateContent")
const toast = document.getElementById("toast")
const toastIcon = document.getElementById("toastIcon")
const toastMessage = document.getElementById("toastMessage")
const toastClose = document.getElementById("toastClose")

// Event listeners
courseSelector.addEventListener("change", handleCourseSelection)
payButton.addEventListener("click", handlePayment)
toastClose.addEventListener("click", hideToast)
printConstancyBtn.addEventListener("click", handlePrintConstancy)

// Handle course selection
function handleCourseSelection(event) {
  const courseId = event.target.value
  const selectorBlock = document.getElementById('cursoSelectorBlock');

  if (!courseId) {
    showEmptyState();
    if (selectorBlock) selectorBlock.classList.remove('hidden');
    return;
  }

  if (selectorBlock) selectorBlock.classList.add('hidden');

  const course = coursesData[courseId];
  if (course) {
    showCourseDetails(course);
  }
}

// Show empty state
function showEmptyState() {
  courseDetails.classList.add("hidden")
  emptyState.classList.remove("hidden")
}

// Show course details
function showCourseDetails(course) {
  emptyState.classList.add("hidden")
  courseDetails.classList.remove("hidden")

  // Update course information
  courseName.textContent = course.nombre
  updateCourseStatus(course.estado)

  // Update progress
  updateProgress(course)

  // Update payment status
  updatePaymentStatus(course)

  // Update certificate section
  updateCertificateSection(course)
}

// Update course status
function updateCourseStatus(estado) {
  const statusConfig = {
    activo: { text: "Activo", class: "bg-green-100 text-green-800" },
    completado: { text: "Completado", class: "bg-blue-100 text-blue-800" },
    suspendido: { text: "Suspendido", class: "bg-red-100 text-red-800" },
  }

  const config = statusConfig[estado] || statusConfig["activo"]

  // Update desktop status
  if (courseStatus) {
    courseStatus.textContent = config.text
    courseStatus.className = `inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${config.class}`
  }

  // Update mobile status
  if (courseStatusMobile) {
    courseStatusMobile.textContent = config.text
    courseStatusMobile.className = `inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.class}`
  }
}

// Update progress information
function updateProgress(course) {
  // Update circular progress
  const progressCircle = document.getElementById("progressCircle")
  const progressPercentage = document.getElementById("progressPercentage")

  if (progressCircle && progressPercentage) {
    const percentage = course.progreso || 0
    const circumference = 2 * Math.PI * 64 // radius = 64
    const offset = circumference - (percentage / 100) * circumference

    progressCircle.style.strokeDashoffset = offset
    progressPercentage.textContent = `${percentage}%`
  }

  if (progressText) {
    progressText.textContent = `${course.progreso}% completado`
  }
  completedLessons.textContent = course.leccionesCompletadas
  totalLessons.textContent = course.totalLecciones
  studyHours.textContent = course.horasEstudio
  averageScore.textContent = course.promedio
}

// Update payment status
function updatePaymentStatus(course) {
  const statusConfig = {
    al_dia: { text: "Al día", class: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100" },
    pendiente: { text: "Pendiente", class: "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100" },
    vencida: { text: "Vencida", class: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100" },
  }

  const config = statusConfig[course.estadoCuota] || statusConfig["pendiente"]
  paymentStatus.textContent = config.text
  paymentStatus.className = `inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.class}`

  paymentAmount.textContent = course.montoMatricula
  paymentDue.textContent = course.fechaVencimiento

  // Show/hide pay button
  if (course.estadoCuota === "pendiente" || course.estadoCuota === "vencida") {
    payButton.classList.remove("hidden")
    payButton.className =
      course.estadoCuota === "vencida"
        ? "w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        : "w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
  } else {
    payButton.classList.add("hidden")
  }
}

// Update certificate section
function updateCertificateSection(course) {
  if (course.completado && course.estadoCuota === "al_dia") {
    certificateContent.innerHTML = `
            <div class="text-center py-4">
                <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <i data-lucide="award" class="w-8 h-8 text-green-600"></i>
                </div>
                <p class="text-sm font-medium text-gray-900 mb-3">¡Certificado disponible!</p>
                <button id="downloadCertificate" class="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
                    <i data-lucide="download" class="w-4 h-4 inline mr-2"></i>
                    Descargar Certificado
                </button>
            </div>
        `

    // Add event listener for certificate download
    document.getElementById("downloadCertificate").addEventListener("click", handleCertificateDownload)
  } else if (course.completado && course.estadoCuota !== "al_dia") {
    certificateContent.innerHTML = `
            <div class="text-center py-8">
                <i data-lucide="alert-circle" class="w-12 h-12 text-yellow-500 mx-auto mb-3"></i>
                <p class="text-sm text-gray-600">Curso completado</p>
                <p class="text-xs text-gray-500 mt-1">Paga la cuota para obtener tu certificado</p>
            </div>
        `
  } else {
    const progressNeeded = 100 - course.progreso
    certificateContent.innerHTML = `
            <div class="text-center py-8">
                <i data-lucide="award" class="w-12 h-12 text-gray-300 mx-auto mb-3"></i>
                <p class="text-sm text-gray-500">Completa el curso para obtener tu certificado</p>
                <p class="text-xs text-gray-400 mt-1">Te falta ${progressNeeded}% para completar</p>
            </div>
        `
  }
}

// Handle payment
function handlePayment() {
  const selectedCourseId = courseSelector.value
  const course = coursesData[selectedCourseId]

  if (course) {
    showToast("Redirigiendo a la pasarela de pago...", "info")

    // Simulate payment process
    setTimeout(() => {
      course.estadoCuota = "al_dia"
      course.fechaVencimiento = "Pagado"
      showCourseDetails(course)
      showToast("¡Pago procesado exitosamente!", "success")
    }, 2000)
  }
}

// Handle certificate download
function handleCertificateDownload() {
  const selectedCourseId = courseSelector.value
  const course = coursesData[selectedCourseId]

  if (course) {
    showToast(`Descargando certificado de "${course.nombre}"...`, "success")

    // Simulate download
    setTimeout(() => {
      showToast("¡Certificado descargado exitosamente!", "success")
    }, 1500)
  }
}

// Handle constancy print
function handlePrintConstancy() {
  const selectedCourseId = courseSelector.value
  const course = coursesData[selectedCourseId]

  if (course) {
    showToast(`Imprimiendo constancia de "${course.nombre}"...`, "info")

    // Simulate print
    setTimeout(() => {
      showToast("¡Constancia impresa exitosamente!", "success")
    }, 1500)
  }
}

// Funciones utilitarias
export function showToast(message, type = "info") {
  const toast = document.getElementById("toast")
  const toastIcon = document.getElementById("toastIcon")
  const toastMessage = document.getElementById("toastMessage")

  const iconConfig = {
    success: { icon: "fa-circle-check", class: "text-green-500" },
    error: { icon: "fa-circle-xmark", class: "text-red-500" },
    info: { icon: "fa-info-circle", class: "text-blue-500" },
    warning: { icon: "fa-triangle-exclamation", class: "text-yellow-500" },
  }

  const config = iconConfig[type] || iconConfig["info"]

  toastIcon.className = `w-5 h-5 fa-solid ${config.icon} ${config.class}`
  toastMessage.textContent = message

  toast.classList.remove("hidden")

  // Auto-hide después de 3 segundos
  setTimeout(() => {
    toast.classList.add("hidden")
  }, 3000)
}

// Hide toast notification
function hideToast() {
  document.getElementById("toast").classList.add("hidden")
}

// Event listener para cerrar toast manualmente
document.getElementById("toastClose").addEventListener("click", hideToast)

// Botón para volver a seleccionar curso
const volverBtn = document.getElementById("btnVolverSeleccionCurso");
if (volverBtn) {
  volverBtn.addEventListener("click", () => {
    const selectorBlock = document.getElementById("cursoSelectorBlock");
    const courseDetails = document.getElementById("courseDetails");
    if (selectorBlock) selectorBlock.classList.remove("hidden");
    if (courseDetails) courseDetails.classList.add("hidden");
    // Opcional: resetear el select
    const courseSelector = document.getElementById("courseSelector");
    if (courseSelector) courseSelector.value = "";
  });
}

// Función para renderizar las publicaciones
function renderPublicaciones() {
  const grid = document.getElementById("publicacionesGrid");
  if (!grid) return;

  // Clear and set up the grid container
  grid.innerHTML = "";
  
  // Usar un solo estilo unificado (estilo Instagram) para mobile y desktop
  grid.className = "w-full p-2 space-y-4";

  publicacionesData.forEach((publicacion, index) => {
    // Crear tarjeta estilo Instagram unificada
    const instagramCard = document.createElement("div");
    instagramCard.className = "bg-white dark:bg-card-dark border border-gray-200 dark:border-border-dark overflow-hidden transition-shadow";
    
    instagramCard.innerHTML = `
      <!-- Header del post -->
      <div class="flex items-center p-3 border-b border-gray-100 dark:border-border-dark">
        <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <i class="fa-solid fa-graduation-cap text-white text-xs"></i>
        </div>
        <div class="ml-3">
          <p class="font-semibold text-sm text-gray-900 dark:text-text-dark">Eddis Educativa</p>
          <p class="text-xs text-gray-500 dark:text-text-dark-secondary">${formatDate(publicacion.fechaPublicacion)}</p>
        </div>
      </div>
      
      <!-- Imagen principal - aspect ratio 1:1 (cuadrada) -->
      <div class="relative aspect-square bg-gray-100 dark:bg-gray-800">
        <img src="${publicacion.imagenUrl || 'https://picsum.photos/600/600?random=' + publicacion.id}" 
             alt="${publicacion.titulo}" 
             class="w-full h-full object-cover"
             loading="lazy">
      </div>
      
      <!-- Contenido -->
      <div class="p-4">
        <!-- Título y descripción -->
        <div>
          <h3 class="font-semibold text-gray-900 dark:text-text-dark mb-2 line-clamp-2">
            ${publicacion.titulo}
          </h3>
          <p class="text-gray-600 dark:text-text-dark-secondary text-sm leading-relaxed line-clamp-3">
            ${publicacion.descripcion || 'Esta es una publicación importante.'}
          </p>
        </div>
      </div>
    `;


    // Agregar la tarjeta al grid
    grid.appendChild(instagramCard);
  });
}

// Función global para mostrar el detalle de una publicación
window.mostrarDetallePublicacion = function(publicacion) {
  console.log("Mostrando detalle de publicación:", publicacion);
  
  // Ocultar el contenido principal de inicio
  const inicioContent = document.getElementById('inicioContent');
  if (inicioContent) {
    inicioContent.style.display = 'none';
  }
  
  // Crear o obtener el contenedor de detalle
  let detalleContainer = document.getElementById('publicacionDetalle');
  if (!detalleContainer) {
    detalleContainer = document.createElement('div');
    detalleContainer.id = 'publicacionDetalle';
    detalleContainer.className = 'tab-content';
    
    // Insertar después del contenido de inicio
    const main = document.querySelector('main');
    main.appendChild(detalleContainer);
  }
  
  // Vista para Desktop (sin navegación)
  detalleContainer.innerHTML = `
    <!-- Vista Desktop -->
    <div class="hidden md:block">
      <!-- Header simple -->
      <div class="bg-white dark:bg-card-dark shadow-sm border-b border-gray-200 dark:border-border-dark p-4 mb-6">
        <div class="flex items-center justify-between max-w-6xl mx-auto">
          <button onclick="window.volverAPublicaciones()" class="flex items-center space-x-2 text-gray-600 dark:text-text-dark hover:text-gray-900 dark:hover:text-text-dark transition-colors">
            <i class="fa-solid fa-arrow-left"></i>
            <span>Volver a Novedades</span>
          </button>
        </div>
      </div>
      
      <!-- Contenido principal desktop -->
      <div class="max-w-4xl mx-auto px-4">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Imagen -->
          <div class="relative">
            <img src="${publicacion.imagenCabecera || publicacion.imagenUrl || 'https://picsum.photos/600/400?random=' + publicacion.id}" 
                 alt="${publicacion.titulo}" 
                 class="w-full h-96 object-cover rounded-lg shadow-lg">
          </div>
          
          <!-- Contenido -->
          <div class="space-y-6">
            <div>
              <span class="text-sm text-gray-500 dark:text-text-dark-secondary">
                ${formatDate(publicacion.fechaPublicacion)}
              </span>
              <h1 class="text-3xl font-bold text-gray-900 dark:text-text-dark mt-2">
                ${publicacion.titulo}
              </h1>
            </div>
            
            <div class="prose dark:prose-invert max-w-none">
              <p class="text-gray-600 dark:text-text-dark-secondary leading-relaxed text-lg">
                ${publicacion.descripcion || 'Esta es una publicación importante que contiene información relevante para todos nuestros estudiantes. Manténganse informados de las últimas novedades y actualizaciones de nuestra institución. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Vista Mobile (estilo Instagram) -->
    <div class="md:hidden">
      <!-- Header mobile -->
      <div class="bg-white dark:bg-card-dark border-b border-gray-200 dark:border-border-dark p-3 sticky top-0 z-10">
        <div class="flex items-center justify-between">
          <button onclick="window.volverAPublicaciones()" class="p-2 -ml-2 text-gray-600 dark:text-text-dark">
            <i class="fa-solid fa-arrow-left text-xl"></i>
          </button>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-text-dark">Novedad</h2>
          <div class="w-10"></div>
        </div>
      </div>
      
      <!-- Contenido mobile -->
      <div class="bg-white dark:bg-card-dark">
        <!-- Imagen -->
        <div class="relative">
          <img src="${publicacion.imagenCabecera || publicacion.imagenUrl || 'https://picsum.photos/400/400?random=' + publicacion.id}" 
               alt="${publicacion.titulo}" 
               class="w-full aspect-square object-cover">
        </div>
        
        <!-- Información -->
        <div class="p-4">
          <!-- Título -->
          <h2 class="font-semibold text-gray-900 dark:text-text-dark mb-2">
            ${publicacion.titulo}
          </h2>
          
          <!-- Descripción con "Ver más" -->
          <div>
            <p id="descripcionCorta" class="text-gray-600 dark:text-text-dark-secondary leading-relaxed">
              ${(publicacion.descripcion || 'Esta es una publicación importante que contiene información relevante para todos nuestros estudiantes. Manténganse informados de las últimas novedades y actualizaciones de nuestra institución.').substring(0, 150)}${(publicacion.descripcion || '').length > 150 ? '...' : ''}
            </p>
            
            ${(publicacion.descripcion || '').length > 150 ? `
              <p id="descripcionCompleta" class="text-gray-600 dark:text-text-dark-secondary leading-relaxed hidden">
                ${publicacion.descripcion || 'Esta es una publicación importante que contiene información relevante para todos nuestros estudiantes. Manténganse informados de las últimas novedades y actualizaciones de nuestra institución.'}
              </p>
              
              <button id="verMasBtn" onclick="window.toggleDescripcion()" class="text-gray-500 dark:text-text-dark-secondary text-sm mt-1">
                ver más
              </button>
              
              <button id="verMenosBtn" onclick="window.toggleDescripcion()" class="text-gray-500 dark:text-text-dark-secondary text-sm mt-1 hidden">
                ver menos
              </button>
            ` : ''}
          </div>
          
          <!-- Fecha -->
          <div class="mt-3 pt-3 border-t border-gray-100 dark:border-border-dark">
            <span class="text-xs text-gray-400 dark:text-text-dark-secondary uppercase tracking-wide">
              ${formatDate(publicacion.fechaPublicacion)}
            </span>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Mostrar el detalle
  detalleContainer.classList.remove('hidden');
  detalleContainer.style.display = 'block';
}

// Enhanced tab switching functionality
function switchTab(targetTabId) {
  console.log("[v0] switchTab called with targetTabId:", targetTabId)

  // Hide all tab contents
  document.querySelectorAll(".tab-content").forEach((tab) => {
    tab.classList.add("hidden")
  })

  // Remove active class from all menu items
  document.querySelectorAll(".menu-item").forEach((item) => {
    item.classList.remove("active-tab")
  })

  // Remove active class from bottom bar items
  document.querySelectorAll("#bottombar button[data-tab]").forEach((item) => {
    item.classList.remove("text-blue-600")
    item.classList.add("text-gray-700")
  })

  // Show target tab
  const targetTab = document.getElementById(targetTabId)
  console.log("[v0] Target tab element:", targetTab)

  if (targetTab) {
    targetTab.classList.remove("hidden")
    console.log("[v0] Target tab shown successfully")
  } else {
    console.log("[v0] ERROR: Target tab not found!")
  }

  const activeMenuItems = document.querySelectorAll(`[data-tab="${targetTabId}"]`)
  console.log("[v0] Active menu items found:", activeMenuItems.length)

  activeMenuItems.forEach((activeMenuItem) => {
    if (activeMenuItem.classList.contains("menu-item")) {
      activeMenuItem.classList.add("active-tab")
      // For bottom bar items, also update colors
      if (activeMenuItem.closest("#bottombar")) {
        activeMenuItem.classList.remove("text-gray-700")
        activeMenuItem.classList.add("text-blue-600")
        console.log("[v0] Bottom bar item activated")
      }
    }
  })

  // Special handling for Inicio tab
  if (targetTabId === "inicioContent") {
    console.log("[v0] Special handling for inicioContent - checking if publicaciones need loading")
    if (publicacionesData.length === 0) {
      console.log("[v0] No publications data, loading from API")
      cargarPublicaciones()
    } else {
      console.log("[v0] Publications already loaded, rendering existing data")
      setTimeout(() => {
        renderPublicaciones()
      }, 100)
    }
  }
}

// Initialize the dashboard
document.addEventListener("DOMContentLoaded", () => {
  console.log("[v0] DOMContentLoaded - Initializing dashboard with Inicio tab");
  
  // Cargar publicaciones dinámicamente desde la API
  cargarPublicaciones();

  // Eliminar showEmptyState() al inicio
  // showEmptyState();

  // Switch to Inicio tab and render publicaciones
  console.log("[v0] Switching to inicioContent on load")
  switchTab("inicioContent")

  // Add event listeners for all tab buttons
  const tabButtons = document.querySelectorAll("[data-tab]")
  console.log("[v0] Found", tabButtons.length, "tab buttons")

  tabButtons.forEach((button, index) => {
    const tabId = button.getAttribute("data-tab")
    console.log(`[v0] Setting up listener for button ${index + 1} with tab:`, tabId)

    button.addEventListener("click", (e) => {
      e.preventDefault()
      const targetTab = button.getAttribute("data-tab")
      console.log("[v0] Tab button clicked, switching to tab:", targetTab)
      switchTab(targetTab)
    })
  })
})

// Lucide icon creation
const lucide = {
  createIcons: () => {
    // Placeholder for Lucide icon creation logic
    console.log("Lucide icons created")
  },
}

// Format date function
function formatDate(fecha) {
  // Usa Luxon global para formatear la fecha
  if (window.luxon) {
    return luxon.DateTime.fromISO(fecha).toLocaleString(luxon.DateTime.DATE_MED);
  }
  // Fallback simple si no está luxon
  const d = new Date(fecha);
  return d.toLocaleDateString('es-AR', { year: 'numeric', month: 'short', day: 'numeric' });
}

// Mostrar cuenta corriente desktop y ocultar cards de pago y examen
const verCuentaCorrienteBtnMobile = document.getElementById("verCuentaCorrienteBtnMobile");
const cuentaCorrienteContainer = document.getElementById("cuentaCorrienteContainer");
const examFeeCard = document.getElementById("examFeeCard");
const paymentCard = document.querySelector('.bg-white.rounded-lg.shadow-sm.border.border-gray-200.p-6');

if (verCuentaCorrienteBtnMobile) {
  verCuentaCorrienteBtnMobile.addEventListener("click", () => {
    if (cuentaCorrienteContainer) cuentaCorrienteContainer.classList.remove("hidden");
    if (examFeeCard) examFeeCard.classList.add("hidden");
    if (paymentCard) paymentCard.classList.add("hidden");
  });
}

// Funciones globales para el detalle de publicaciones
window.volverAPublicaciones = function() {
  const detalleContainer = document.getElementById('publicacionDetalle');
  const inicioContent = document.getElementById('inicioContent');
  
  if (detalleContainer) {
    detalleContainer.style.display = 'none';
  }
  
  if (inicioContent) {
    inicioContent.style.display = 'block';
  }
}

window.toggleDescripcion = function() {
  const descripcionCorta = document.getElementById('descripcionCorta');
  const descripcionCompleta = document.getElementById('descripcionCompleta');
  const verMasBtn = document.getElementById('verMasBtn');
  const verMenosBtn = document.getElementById('verMenosBtn');
  
  if (descripcionCorta && descripcionCompleta && verMasBtn && verMenosBtn) {
    if (descripcionCompleta.classList.contains('hidden')) {
      // Mostrar descripción completa
      descripcionCorta.classList.add('hidden');
      descripcionCompleta.classList.remove('hidden');
      verMasBtn.classList.add('hidden');
      verMenosBtn.classList.remove('hidden');
    } else {
      // Mostrar descripción corta
      descripcionCorta.classList.remove('hidden');
      descripcionCompleta.classList.add('hidden');
      verMasBtn.classList.remove('hidden');
      verMenosBtn.classList.add('hidden');
    }
  }
}

// Función para abrir el campus virtual con reintentos
function abrirCampus() {
  console.log('[DEBUG] Intentando abrir campus virtual');
  console.log('[DEBUG] window.userData:', window.userData);
  console.log('[DEBUG] typeof window.userData:', typeof window.userData);
  console.log('[DEBUG] window.userData.logincampus:', window.userData?.logincampus);
  
  // Verificar si tenemos los datos del usuario y el link del campus
  if (window.userData && window.userData.logincampus) {
    console.log('[DEBUG] Abriendo campus:', window.userData.logincampus);
    // Abrir el campus en una nueva pestaña
    window.open(window.userData.logincampus, '_blank');
  } else {
    console.warn('[WARNING] No se encontró link del campus, reintentando...');
    console.warn('[WARNING] window.userData:', window.userData);
    console.warn('[WARNING] logincampus:', window.userData?.logincampus);
    
    // Reintentar después de un breve delay para dar tiempo a que se carguen los datos
    setTimeout(() => {
      if (window.userData && window.userData.logincampus) {
        console.log('[DEBUG] Reintento exitoso, abriendo campus:', window.userData.logincampus);
        window.open(window.userData.logincampus, '_blank');
      } else {
        console.error('[ERROR] Datos aún no disponibles después del reintento');
        // Si aún no tenemos el link, mostrar un mensaje de error
        if (typeof showToast !== 'undefined') {
          showToast('No se pudo obtener el enlace del campus. Asegúrate de que los datos estén cargados.', 'error');
        } else {
          alert('No se pudo obtener el enlace del campus. Asegúrate de que los datos estén cargados.');
        }
      }
    }, 1000); // Esperar 1 segundo
  }
}

// Event listeners para los botones de campus
document.addEventListener('DOMContentLoaded', function() {
  console.log('[DEBUG] Configurando event listeners para campus');
  console.log('[DEBUG] window.userData en DOMContentLoaded:', window.userData);
  
  // Botón de campus en desktop (sidebar)
  const campusDesktopBtn = document.getElementById('campusDesktopBtn');
  if (campusDesktopBtn) {
    campusDesktopBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('[DEBUG] Click en campus desktop, userData actual:', window.userData);
      abrirCampus();
    });
    console.log('[DEBUG] Event listener configurado para campus desktop');
  } else {
    console.warn('[WARNING] No se encontró el botón campusDesktopBtn');
  }

  // Botón de campus en mobile (bottom bar)
  const campusMobileBtn = document.getElementById('campusMobileBtn');
  if (campusMobileBtn) {
    campusMobileBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('[DEBUG] Click en campus mobile, userData actual:', window.userData);
      abrirCampus();
    });
    console.log('[DEBUG] Event listener configurado para campus mobile');
  } else {
    console.warn('[WARNING] No se encontró el botón campusMobileBtn');
  }
});
