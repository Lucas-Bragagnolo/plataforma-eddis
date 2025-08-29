// Importar datos desde data.js
import { coursesData } from "./dashboard.js"
import { showToast, formatDate } from "./utils.js"

// DOM elements para cursos
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

// Variables declaration
const paymentsData = [
  // Example payment data
  { curso: "Curso de JavaScript", estado: "pendiente", metodo: "" },
  // Add more payments as needed
]

const Swal = {
  fire: (options) => {
    // Mock implementation for Swal.fire
    console.log(options)
    return new Promise((resolve) => {
      resolve({ isConfirmed: true })
    })
  },
}

// Funciones para manejar los cursos
function setupCourseSelector() {
  if (courseSelector) {
    courseSelector.addEventListener("change", handleCourseSelection)
  }
}

function setupPaymentButton() {
  if (payButton) {
    payButton.addEventListener("click", handlePayment)
  }
}

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

function showEmptyState() {
  if (courseDetails) courseDetails.classList.add("hidden")
  if (emptyState) emptyState.classList.remove("hidden")
}

function showCourseDetails(course) {
  if (emptyState) emptyState.classList.add("hidden")
  if (courseDetails) courseDetails.classList.remove("hidden")

  updateCourseHeader(course)
  updateProgressSection(course)
  updatePaymentSection(course)
  updateCertificateSection(course)
}

function updateCourseHeader(course) {
  if (courseName) courseName.textContent = course.nombre
  if (courseDates) {
    courseDates.textContent = `${formatDate(course.fechaInicio)} - ${formatDate(course.fechaFin)}`
  }

  updateCourseStatus(course.estado)
}

function updateCourseStatus(estado) {
  if (!courseStatus) return

  const statusConfig = {
    activo: { text: "Activo", class: "bg-green-100 text-green-800" },
    completado: { text: "Completado", class: "bg-blue-100 text-blue-800" },
    suspendido: { text: "Suspendido", class: "bg-red-100 text-red-800" },
  }

  const config = statusConfig[estado] || statusConfig["activo"]
  courseStatus.textContent = config.text
  courseStatus.className = `inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.class}`
}

function updateProgressSection(course) {
  // Update circular progress
  const progressCircle = document.getElementById('progressCircle');
  const progressPercentage = document.getElementById('progressPercentage');
  
  if (progressCircle && progressPercentage) {
    const percentage = course.avance || 0;
    const circumference = 2 * Math.PI * 64; // radius = 64
    const offset = circumference - (percentage / 100) * circumference;
    
    progressCircle.style.strokeDashoffset = offset;
    progressPercentage.textContent = `${percentage}%`;
  }
  
  if (progressText) {
    progressText.textContent = `${course.avance}% completado`;
  }
  if (completedLessons) {
    completedLessons.textContent = course.leccionesCompletadas
  }
  if (totalLessons) {
    totalLessons.textContent = course.totalLecciones
  }
  if (studyHours) {
    studyHours.textContent = course.horasEstudio
  }
  if (averageScore) {
    averageScore.textContent = course.promedio
  }
}

function updatePaymentSection(course) {
  updatePaymentStatus(course.estadoCuota)

  if (paymentAmount) {
    paymentAmount.textContent = course.montoMatricula
  }
  if (paymentDue) {
    paymentDue.textContent = course.fechaVencimiento
  }

  // Show/hide pay button based on payment status
  if (payButton) {
    if (course.estadoCuota === "pendiente" || course.estadoCuota === "vencida") {
      payButton.classList.remove("hidden")
      updatePayButtonStyle(course.estadoCuota)
    } else {
      payButton.classList.add("hidden")
    }
  }
}

function updatePaymentStatus(estadoCuota) {
  if (!paymentStatus) return

  const statusConfig = {
    al_dia: { text: "Al día", class: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100" },
    pendiente: { text: "Pendiente", class: "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100" },
    vencida: { text: "Vencida", class: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100" },
  }

  const config = statusConfig[estadoCuota] || statusConfig["pendiente"]
  paymentStatus.textContent = config.text
  paymentStatus.className = `inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.class}`
}

function updatePayButtonStyle(estadoCuota) {
  if (!payButton) return

  const buttonConfig = {
    pendiente:
      "w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200",
    vencida:
      "w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200",
  }

  payButton.className = buttonConfig[estadoCuota] || buttonConfig["pendiente"]
}

function updateCertificateSection(course) {
  if (!certificateContent) return

  if (course.completado && course.estadoCuota === "al_dia") {
    // Certificate available
    certificateContent.innerHTML = `
            <div class="text-center py-4">
                <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <i class="fa-solid fa-award text-green-600 text-2xl"></i>
                </div>
                <p class="text-sm font-medium text-gray-900 mb-3">¡Certificado disponible!</p>
                <button id="downloadCertificate" class="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
                    <i class="fa-solid fa-download mr-2"></i>
                    Descargar Certificado
                </button>
            </div>
        `

    // Add event listener for certificate download
    const downloadBtn = document.getElementById("downloadCertificate")
    if (downloadBtn) {
      downloadBtn.addEventListener("click", () => handleCertificateDownload(course))
    }
  } else if (course.completado && course.estadoCuota !== "al_dia") {
    // Course completed but payment pending
    certificateContent.innerHTML = `
            <div class="text-center py-8">
                <i class="fa-solid fa-exclamation-triangle text-yellow-500 text-3xl mb-3"></i>
                <p class="text-sm text-gray-600">Curso completado</p>
                <p class="text-xs text-gray-500 mt-1">Paga la cuota para obtener tu certificado</p>
            </div>
        `
  } else {
    // Course not completed
    const progressNeeded = 100 - course.progreso
    certificateContent.innerHTML = `
            <div class="text-center py-8">
                <i class="fa-solid fa-award text-gray-300 text-3xl mb-3"></i>
                <p class="text-sm text-gray-500">Completa el curso para obtener tu certificado</p>
                <p class="text-xs text-gray-400 mt-1">Te falta ${progressNeeded}% para completar</p>
            </div>
        `
  }
}

function handlePayment() {
  const selectedCourseId = courseSelector?.value
  const course = coursesData[selectedCourseId]

  if (!course) {
    showToast("Por favor selecciona un curso", "error")
    return
  }

  if (window.Swal) {
    Swal.fire({
      title: "Procesar Pago",
      text: `¿Deseas proceder con el pago de ${course.montoMatricula} para el curso "${course.nombre}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, pagar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        processPayment(course)
      }
    })
  } else {
    if (confirm(`¿Deseas proceder con el pago de ${course.montoMatricula} para el curso "${course.nombre}"?`)) {
      processPayment(course)
    }
  }
}

function processPayment(course) {
  showToast("Redirigiendo a la pasarela de pago...", "info")

  // Simulate payment process
  setTimeout(() => {
    // Update course payment status
    course.estadoCuota = "al_dia"
    course.fechaVencimiento = "Pagado"

    // Update UI
    showCourseDetails(course)
    showToast("¡Pago procesado exitosamente!", "success")
  }, 2000)
}

function handleCertificateDownload(course) {
  showToast(`Descargando certificado de "${course.nombre}"...`, "info")

  // Simulate download process
  setTimeout(() => {
    showToast("¡Certificado descargado exitosamente!", "success")
  }, 1500)
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  setupCourseSelector()
  setupPaymentButton()
})

// Export functions for external use
export { handleCourseSelection, showCourseDetails, handlePayment, handleCertificateDownload }
