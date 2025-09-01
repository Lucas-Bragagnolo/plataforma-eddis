// Enhanced Utility Functions with Professional UX
export function showToast(message, type = "info", duration = 4000) {
  const toast = document.getElementById("toast")
  const toastIcon = document.getElementById("toastIcon")
  const toastMessage = document.getElementById("toastMessage")

  if (!toast || !toastIcon || !toastMessage) {
    console.warn("Toast elements not found")
    return
  }

  const iconConfig = {
    success: { icon: "fas fa-check-circle", class: "text-green-500" },
    error: { icon: "fas fa-exclamation-circle", class: "text-red-500" },
    info: { icon: "fas fa-info-circle", class: "text-blue-500" },
    warning: { icon: "fas fa-exclamation-triangle", class: "text-yellow-500" },
  }

  const config = iconConfig[type] || iconConfig["info"]

  toastIcon.className = `w-5 h-5 ${config.icon} ${config.class}`
  toastMessage.textContent = message
  // Show toast with animation
  toast.classList.remove("translate-x-full")

  // Auto-hide with custom duration
  setTimeout(() => {
    toast.classList.add("translate-x-full")
  }, duration)

  // Announce to screen readers
  announceToScreenReader(message, type)
}

// Enhanced loading state with better UX
export function setLoadingState(element, isLoading, originalText = "") {
  if (!element) return

  if (isLoading) {
    element.disabled = true
    element.dataset.originalText = element.textContent
    element.innerHTML = `
      <span class="flex items-center justify-center">
        <div class="spinner mr-2"></div>
        <span>Cargando...</span>
      </span>
    `
    element.classList.add("opacity-75", "cursor-not-allowed")
  } else {
    element.disabled = false
    element.textContent = element.dataset.originalText || originalText
    element.classList.remove("opacity-75", "cursor-not-allowed")
  }
}

// Professional form validation
export function validateForm(form) {
  const fields = form.querySelectorAll("input[required], select[required]")
  let isValid = true
  const errors = []

  fields.forEach((field) => {
    const fieldValid = validateField(field)
    if (!fieldValid.isValid) {
      isValid = false
      errors.push({
        field: field.name,
        message: fieldValid.message,
      })
    }
  })

  return { isValid, errors }
}

// Enhanced field validation with better UX
export function validateField(field) {
  const value = field.value.trim()
  let isValid = true
  let message = ""

  // Clear previous states
  clearFieldError(field)

  // Validation rules
  if (field.hasAttribute("required") && !value) {
    isValid = false
    message = "Este campo es obligatorio"
  } else if (field.type === "email" && value) {
    if (!isValidEmail(value)) {
      isValid = false
      message = "Ingresa un email válido"
    }
  } else if (field.name === "username" && value) {
    if (value.length < 3) {
      isValid = false
      message = "El legajo debe tener al menos 3 caracteres"
    } else if (!/^[a-zA-Z0-9]+$/.test(value)) {
      isValid = false
      message = "Solo se permiten letras y números"
    }
  } else if (field.name === "password" && value) {
    if (value.length < 4) {
      isValid = false
      message = "La contraseña debe tener al menos 4 caracteres"
    }
  }

  return { isValid, message }
}

// Professional error display
export function showFieldError(field, message) {
  field.classList.add("border-red-500", "error-shake")
  field.classList.remove("border-green-500")
  field.setAttribute("aria-invalid", "true")

  // Show error icon
  const errorIcon = document.getElementById(field.name + "Error")
  const successIcon = document.getElementById(field.name + "Success")

  if (errorIcon) errorIcon.classList.remove("hidden")
  if (successIcon) successIcon.classList.add("hidden")

  // Show error message
  const errorMsg = document.getElementById(field.name + "ErrorMsg")
  if (errorMsg) {
    const span = errorMsg.querySelector("span")
    if (span) span.textContent = message
    errorMsg.classList.remove("hidden")
  }

  // Remove shake animation
  setTimeout(() => {
    field.classList.remove("error-shake")
  }, 500)

  // Announce error to screen readers
  announceToScreenReader(`Error en ${field.name}: ${message}`, "error")
}

// Professional success display
export function showFieldSuccess(field) {
  field.classList.add("border-green-500")
  field.classList.remove("border-red-500")
  field.setAttribute("aria-invalid", "false")

  // Show success icon
  const successIcon = document.getElementById(field.name + "Success")
  const errorIcon = document.getElementById(field.name + "Error")

  if (successIcon) successIcon.classList.remove("hidden")
  if (errorIcon) errorIcon.classList.add("hidden")

  // Hide error message
  const errorMsg = document.getElementById(field.name + "ErrorMsg")
  if (errorMsg) errorMsg.classList.add("hidden")
}

// Clear field errors
export function clearFieldError(field) {
  field.classList.remove("border-red-500", "border-green-500")
  field.setAttribute("aria-invalid", "false")

  // Hide icons
  const errorIcon = document.getElementById(field.name + "Error")
  const successIcon = document.getElementById(field.name + "Success")

  if (errorIcon) errorIcon.classList.add("hidden")
  if (successIcon) successIcon.classList.add("hidden")

  // Hide error message
  const errorMsg = document.getElementById(field.name + "ErrorMsg")
  if (errorMsg) errorMsg.classList.add("hidden")
}

// Enhanced email validation
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Format date with better localization
export function formatDate(dateString) {
  if (!dateString) return "No especificada"
  
  try {
    const date = luxon.DateTime.fromISO(dateString)
    
    if (!date.isValid) {
      // Fallback para fechas en formato no ISO
      const fallbackDate = new Date(dateString)
      if (isNaN(fallbackDate.getTime())) {
        return "Fecha inválida"
      }
      return fallbackDate.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit", 
        year: "numeric"
      })
    }
    
    return date.toFormat("dd/MM/yyyy")
  } catch (error) {
    // Fallback si Luxon no está disponible
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return "Fecha inválida"
    }
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    })
  }
}

// Format date for short display (dd/mm/aa)
export function formatDateShort(dateString) {
  if (!dateString) return "No especificada"
  
  try {
    const date = luxon.DateTime.fromISO(dateString)
    
    if (!date.isValid) {
      const fallbackDate = new Date(dateString)
      if (isNaN(fallbackDate.getTime())) {
        return "Fecha inválida"
      }
      return fallbackDate.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit"
      })
    }
    
    return date.toFormat("dd/MM/yy")
  } catch (error) {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return "Fecha inválida"
    }
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit"
    })
  }
}

// Format date for long display (dd de mes de yyyy)
export function formatDateLong(dateString) {
  if (!dateString) return "No especificada"
  
  try {
    const date = luxon.DateTime.fromISO(dateString)
    
    if (!date.isValid) {
      const fallbackDate = new Date(dateString)
      if (isNaN(fallbackDate.getTime())) {
        return "Fecha inválida"
      }
      return fallbackDate.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric"
      })
    }
    
    return date.toFormat("dd 'de' MMMM 'de' yyyy", { locale: "es" })
  } catch (error) {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return "Fecha inválida"
    }
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric"
    })
  }
}

// Redirect with loading state
export function redirectToLogin() {
  const entidad = JSON.parse(localStorage.getItem("entidad"))
  let loginRedirect = "login.html"
  if (entidad && ["ar", "uy", "py"].includes(entidad.codigo)) {
    loginRedirect = "login.html"
  }
  showToast("Redirigiendo al login...", "info", 2000)
  setTimeout(() => {
    window.location.href = loginRedirect
  }, 1000)
}

// Setup enhanced toast functionality
export function setupToastClose() {
  const toastClose = document.getElementById("toastClose")
  if (toastClose) {
    toastClose.addEventListener("click", () => {
      const toast = document.getElementById("toast")
      toast.classList.add("translate-x-full")
    })
  }
}

// Accessibility: Announce to screen readers
function announceToScreenReader(message, type = "info") {
  const announcement = document.createElement("div")
  announcement.setAttribute("aria-live", "polite")
  announcement.setAttribute("aria-atomic", "true")
  announcement.className = "sr-only"
  announcement.textContent = `${type}: ${message}`

  document.body.appendChild(announcement)

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

// Enhanced keyboard navigation
export function setupKeyboardNavigation() {
  document.addEventListener("keydown", (e) => {
    // Tab navigation improvements
    if (e.key === "Tab") {
      const focusableElements = document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault()
        lastElement.focus()
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault()
        firstElement.focus()
      }
    }

    // Escape key functionality
    if (e.key === "Escape") {
      // Close modals, dropdowns, etc.
      const toast = document.getElementById("toast")
      if (toast && !toast.classList.contains("translate-x-full")) {
        toast.classList.add("translate-x-full")
      }
    }
  })
}

// Performance: Debounce function for real-time validation
export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Enhanced focus management
export function focusFirstError() {
  const firstError = document.querySelector('[aria-invalid="true"]')
  if (firstError) {
    firstError.focus()
    firstError.scrollIntoView({ behavior: "smooth", block: "center" })
  }
}
