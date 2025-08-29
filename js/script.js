// Mock data for courses
const coursesData = {
  1: {
    id: "1",
    nombre: "Introducción a la Programación",
    progreso: 75,
    estadoCuota: "al_dia",
    completado: false,
    certificadoDisponible: false,
    estado: "activo",
    fechaInicio: "2024-01-15",
    fechaFin: "2024-04-15",
    leccionesCompletadas: 18,
    totalLecciones: 24,
    horasEstudio: 45,
    promedio: 87,
    montoMatricula: "$299",
    fechaVencimiento: "15 Feb 2024",
  },
  2: {
    id: "2",
    nombre: "Desarrollo Web Avanzado",
    progreso: 100,
    estadoCuota: "al_dia",
    completado: true,
    certificadoDisponible: true,
    estado: "completado",
    fechaInicio: "2023-09-01",
    fechaFin: "2023-12-15",
    leccionesCompletadas: 32,
    totalLecciones: 32,
    horasEstudio: 120,
    promedio: 94,
    montoMatricula: "$499",
    fechaVencimiento: "Pagado",
  },
  3: {
    id: "3",
    nombre: "Diseño Gráfico Digital",
    progreso: 45,
    estadoCuota: "pendiente",
    completado: false,
    certificadoDisponible: false,
    estado: "activo",
    fechaInicio: "2024-02-01",
    fechaFin: "2024-05-30",
    leccionesCompletadas: 9,
    totalLecciones: 20,
    horasEstudio: 28,
    promedio: 78,
    montoMatricula: "$399",
    fechaVencimiento: "28 Feb 2024",
  },
  4: {
    id: "4",
    nombre: "Marketing Digital",
    progreso: 20,
    estadoCuota: "vencida",
    completado: false,
    certificadoDisponible: false,
    estado: "suspendido",
    fechaInicio: "2024-01-10",
    fechaFin: "2024-04-10",
    leccionesCompletadas: 3,
    totalLecciones: 15,
    horasEstudio: 12,
    promedio: 65,
    montoMatricula: "$349",
    fechaVencimiento: "10 Feb 2024 (Vencida)",
  },
}

// DOM elements
const courseSelector = document.getElementById("courseSelector")
const courseDetails = document.getElementById("courseDetails")
const emptyState = document.getElementById("emptyState")
const courseName = document.getElementById("courseName")
const courseStatus = document.getElementById("courseStatus")
const courseDates = document.getElementById("courseDates")
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

// Handle course selection
function handleCourseSelection(event) {
  const courseId = event.target.value

  if (!courseId) {
    showEmptyState()
    return
  }

  const course = coursesData[courseId]
  if (course) {
    showCourseDetails(course)
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
  courseDates.textContent = `${formatDate(course.fechaInicio)} - ${formatDate(course.fechaFin)}`

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
  courseStatus.textContent = config.text
  courseStatus.className = `inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.class}`
}

// Update progress information
function updateProgress(course) {
  // Update circular progress
  const progressCircle = document.getElementById('progressCircle');
  const progressPercentage = document.getElementById('progressPercentage');
  
  if (progressCircle && progressPercentage) {
    const percentage = course.progreso || 0;
    const circumference = 2 * Math.PI * 64; // radius = 64
    const offset = circumference - (percentage / 100) * circumference;
    
    progressCircle.style.strokeDashoffset = offset;
    progressPercentage.textContent = `${percentage}%`;
  }
  
  if (progressText) {
    progressText.textContent = `${course.progreso}% completado`;
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

// Funciones utilitarias
export function showToast(message, type = "info") {
  const toast = document.getElementById("toast");
  const toastIcon = document.getElementById("toastIcon");
  const toastMessage = document.getElementById("toastMessage");

  const iconConfig = {
    success: { icon: "fa-circle-check", class: "text-green-500" },
    error: { icon: "fa-circle-xmark", class: "text-red-500" },
    info: { icon: "fa-info-circle", class: "text-blue-500" },
    warning: { icon: "fa-triangle-exclamation", class: "text-yellow-500" },
  };

  const config = iconConfig[type] || iconConfig["info"];

  toastIcon.className = `w-5 h-5 fa-solid ${config.icon} ${config.class}`;
  toastMessage.textContent = message;

  toast.classList.remove("hidden");

  // Auto-hide después de 3 segundos
  setTimeout(() => {
    toast.classList.add("hidden");
  }, 3000);
}

export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Hide toast notification
function hideToast() {
  document.getElementById("toast").classList.add("hidden");
}

// Event listener para cerrar toast manualmente
document.getElementById("toastClose").addEventListener("click", hideToast);

// Initialize the dashboard
document.addEventListener("DOMContentLoaded", () => {
  showEmptyState()
})

// Lucide icon creation
const lucide = {
  createIcons: () => {
    // Placeholder for Lucide icon creation logic
    console.log("Lucide icons created")
  },
}