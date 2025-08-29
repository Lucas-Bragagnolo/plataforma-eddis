// Simple Authentication Module
import { apiService, ApiError } from "./api.js"
import { showToast, setLoadingState, redirectToLogin } from "./utils.js"

// Debug configuration
const DEBUG_MODE = false

function debugLog(step, data, type = "info") {
  if (!DEBUG_MODE) return

  const timestamp = new Date().toISOString()
  const styles = {
    info: "color: #2563eb; font-weight: bold;",
    success: "color: #16a34a; font-weight: bold;",
    error: "color: #dc2626; font-weight: bold;",
    warning: "color: #d97706; font-weight: bold;",
  }

  console.group(`🔍 [AUTH DEBUG ${timestamp}] ${step}`)
  console.log(`%c${step}`, styles[type])

  if (typeof data === "object") {
    console.table(data)
    console.log("📋 Datos completos:", JSON.stringify(data, null, 2))
  } else {
    console.log("📄 Datos:", data)
  }

  console.groupEnd()
}

// Reemplazar la función handleLogin completa:
export async function handleLogin(event) {
  debugLog(
    "🎬 INICIO DEL MANEJO DE LOGIN",
    {
      eventType: event.type,
      timestamp: new Date().toISOString(),
    },
    "info",
  )

  event.preventDefault()

  const form = event.target
  const formData = new FormData(form)

  // Extraer datos del formulario
  const legajo = formData.get("username")?.trim()
  const documento = formData.get("documento")?.trim()
  let pais = formData.get("country")?.trim()
  // Mapear studio_beauty a 'sb' para el login de Studio Beauty
  if (pais === 'studio_beauty') {
    pais = 'sb'
  }
  const submitButton = form.querySelector('button[type="submit"]')

  // DEBUG: Mostrar datos que se enviarán a la API
  console.log('[LOGIN DEBUG] Datos a enviar:', { legajo, documento, pais });

  debugLog(
    "📝 DATOS EXTRAÍDOS DEL FORMULARIO",
    {
      legajo: legajo,
      documento: documento,
      pais: pais,
      legajoLength: legajo ? legajo.length : 0,
      documentoLength: documento ? documento.length : 0,
      paisLength: pais ? pais.length : 0,
      submitButtonFound: !!submitButton,
    },
    "info",
  )

  // Clear previous errors
  clearFormErrors(form)

  // Validate form
  debugLog(
    "🔍 INICIANDO VALIDACIÓN DEL FORMULARIO",
    {
      legajoPresente: !!legajo,
      documentoPresente: !!documento,
      paisPresente: !!pais,
    },
    "info",
  )

  if (!validateLoginForm(legajo, documento, pais, form)) {
    debugLog(
      "❌ VALIDACIÓN DEL FORMULARIO FALLÓ",
      {
        legajo: legajo,
        documento: documento,
        pais: pais,
      },
      "error",
    )
    return
  }

  debugLog(
    "✅ VALIDACIÓN DEL FORMULARIO EXITOSA",
    {
      todosLosCamposCompletos: true,
    },
    "success",
  )

  // Set loading state
  debugLog(
    "⏳ ESTABLECIENDO ESTADO DE CARGA",
    {
      buttonDisabled: true,
    },
    "info",
  )
  setLoadingState(submitButton, true)

  try {
    debugLog(
      "🚀 LLAMANDO A apiService.login",
      {
        legajo: legajo,
        documento: documento,
        pais: pais,
        timestamp: new Date().toISOString(),
      },
      "info",
    )

    const response = await apiService.login(legajo, documento, pais)

    // DEBUG: Mostrar respuesta completa de la API
    console.log('[LOGIN DEBUG] Respuesta de la API:', response);

    debugLog(
      "📥 RESPUESTA RECIBIDA DE apiService.login",
      {
        response: response,
        success: response.success,
        hasToken: !!response.token,
        message: response.message,
      },
      response.success ? "success" : "warning",
    )

    if (response.success) {
      const countryName = getCountryName(pais)      
      debugLog(
        "🎉 LOGIN EXITOSO",
        {
          pais: pais,
          message: `¡Bienvenido desde ${countryName}!`,
        },
        "success",
      )

      showToast(`¡Bienvenido desde ${countryName}!`, "success")

      // Store login info
      localStorage.setItem("lastLoginCountry", pais)
      localStorage.setItem("lastLoginTime", new Date().toISOString())

      debugLog(
        "💾 INFORMACIÓN DE LOGIN GUARDADA",
        {
          lastLoginCountry: localStorage.getItem("lastLoginCountry"),
          lastLoginTime: localStorage.getItem("lastLoginTime"),
        },
        "success",
      )

      // Redirect to dashboard
      debugLog(
        "🔄 REDIRIGIENDO AL DASHBOARD",
        {
          delay: "1500ms",
          targetUrl: "index.html",
        },
        "info",
      )

      setTimeout(() => {
        debugLog(
          "➡️ EJECUTANDO REDIRECCIÓN",
          {
            from: window.location.href,
            to: "index.html",
          },
          "info",
        )
        window.location.href = "index.html"
      }, 1500)
    } else {
      debugLog(
        "⚠️ LOGIN NO EXITOSO",
        {
          success: response.success,
          message: response.message,
          fullResponse: response,
        },
        "warning",
      )

      showToast(response.message || "Error en el inicio de sesión", "error")
    }
  } catch (error) {
    // DEBUG: Mostrar error completo en consola
    console.error('[LOGIN DEBUG] Error en login:', error);
    if (error && typeof error === 'object') {
      console.error('[LOGIN DEBUG] Error details:', {
        type: error.constructor?.name,
        message: error.message,
        data: error.data,
        stack: error.stack
      });
    }
    debugLog(
      "💥 ERROR CAPTURADO EN handleLogin",
      {
        errorType: error.constructor.name,
        errorMessage: error.message,
        isApiError: error instanceof ApiError,
        errorData: error.data,
        stack: error.stack,
      },
      "error",
    )

    handleLoginError(error)
  } finally {
    debugLog(
      "🔄 RESTAURANDO ESTADO DEL BOTÓN",
      {
        buttonEnabled: true,
      },
      "info",
    )
    setLoadingState(submitButton, false, "Iniciar Sesión")
  }
}

// Actualizar handleLoginError para incluir debug:
function handleLoginError(error) {
  debugLog(
    "🚨 MANEJANDO ERROR DE LOGIN",
    {
      errorType: error.constructor.name,
      errorMessage: error.message,
      isApiError: error instanceof ApiError,
    },
    "error",
  )

  if (error instanceof ApiError) {
    debugLog(
      "🔍 DETALLES DEL API ERROR",
      {
        status: error.status,
        isUnauthorized: error.isUnauthorized(),
        isBadRequest: error.isBadRequest(),
        isServerError: error.isServerError(),
        data: error.data,
      },
      "error",
    )

    if (error.isUnauthorized()) {
      showToast("Credenciales inválidas. Verifica tu legajo y contraseña.", "error")
    } else if (error.isBadRequest()) {
      showToast("Datos incompletos. Asegúrate de completar todos los campos.", "error")
    } else if (error.isServerError()) {
      showToast("Servicio temporalmente no disponible. Inténtalo más tarde.", "error")
    } else {
      showToast(error.message, "error")
    }
  } else {
    debugLog(
      "🔍 ERROR GENÉRICO",
      {
        message: error.message,
        stack: error.stack,
      },
      "error",
    )
    showToast("Error de conexión. Verifica tu internet e inténtalo de nuevo.", "error")
  }
}

// Actualizar la validación para incluir documento
function validateLoginForm(legajo, documento, pais, form) {
  let isValid = true

  if (!legajo) {
    showFieldError(form.querySelector("#username"), "El legajo es obligatorio")
    isValid = false
  }

  if (!documento) {
    showFieldError(form.querySelector("#documento"), "El documento es obligatorio")
    isValid = false
  }

  if (!pais) {
    showFieldError(form.querySelector("#countrySelect"), "Debes seleccionar tu región")
    isValid = false
  }

  return isValid
}

// Show field error
function showFieldError(field, message) {
  if (!field) return

  field.classList.add("border-red-500")
  field.setAttribute("aria-invalid", "true")

  // Show toast for immediate feedback
  showToast(message, "error")
}

// Clear form errors
function clearFormErrors(form) {
  const fields = form.querySelectorAll("input, select")
  fields.forEach((field) => {
    field.classList.remove("border-red-500")
    field.setAttribute("aria-invalid", "false")
  })
}

// Get country name helper
function getCountryName(countryCode) {
  const countries = {
    argentina: "Argentina 🇦🇷",
    uruguay: "Uruguay 🇺🇾",
    paraguay: "Paraguay 🇵🇾",
    studio_beauty: "Studio Beauty 💄",
  }
  return countries[countryCode] || countryCode
}

// Check authentication status
export function checkAuthStatus() {
  if (!apiService.isAuthenticated()) {
    showToast("Sesión expirada. Por favor, inicia sesión nuevamente.", "warning")
    setTimeout(redirectToLogin, 1500)
    return false
  }
  return true
}

// Logout function
export function logout() {
  const country = apiService.getCurrentCountry()
  const countryName = getCountryName(country)

  apiService.logout()
  showToast(`Sesión cerrada en ${countryName}`, "success")
  setTimeout(redirectToLogin, 1000)
}
