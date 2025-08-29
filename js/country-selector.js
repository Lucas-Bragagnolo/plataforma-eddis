// Country Selector Component
import { COUNTRIES } from "./api.js"

export class CountrySelector {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId)
    this.options = {
      showFlags: true,
      defaultCountry: "argentina",
      placeholder: "Selecciona tu región",
      onChange: null,
      ...options,
    }
    this.selectedCountry = this.options.defaultCountry
    this.render()
  }

  render() {
    if (!this.container) return

    const selectorHTML = `
      <div class="country-selector mb-4">
        <label for="countrySelect" class="block text-gray-700 font-medium mb-2">
          <i class="fas fa-globe mr-2 text-blue-600"></i>Región / País
        </label>
        <div class="relative">
          <select id="countrySelect" 
                  name="country"
                  required
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors duration-200 appearance-none bg-white text-gray-900 shadow-sm">
            <option value="">${this.options.placeholder}</option>
            ${this.generateOptions()}
          </select>
          <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
            <i class="fas fa-chevron-down text-gray-400"></i>
          </div>
        </div>
        <p class="text-xs text-gray-500 mt-1">
          <i class="fas fa-info-circle mr-1"></i>
          Cada región maneja sus propios datos de estudiantes
        </p>
      </div>
    `

    this.container.innerHTML = selectorHTML
    this.setupEventListeners()

    // Set initial value
    this.setSelectedCountry(this.selectedCountry)
  }

  generateOptions() {
    return Object.values(COUNTRIES)
      .map((country) => {
        const flag = this.options.showFlags ? country.flag + " " : ""
        return `<option value="${country.code}">${flag}${country.name}</option>`
      })
      .join("")
  }

  setupEventListeners() {
    const select = this.container.querySelector("#countrySelect")
    if (select) {
      select.addEventListener("change", (e) => {
        this.selectedCountry = e.target.value

        // Update visual feedback
        this.updateVisualFeedback(e.target.value)

        // Call onChange callback
        if (this.options.onChange && e.target.value) {
          this.options.onChange(this.selectedCountry, COUNTRIES[this.selectedCountry])
        }
      })

      // Add visual feedback on focus
      select.addEventListener("focus", () => {
        select.parentElement.classList.add("ring-2", "ring-blue-200")
      })

      select.addEventListener("blur", () => {
        select.parentElement.classList.remove("ring-2", "ring-blue-200")
      })
    }
  }

  updateVisualFeedback(countryCode) {
    if (!countryCode) return

    const country = COUNTRIES[countryCode]
    if (!country) return

    // Add a small indicator showing selected country
    let indicator = this.container.querySelector(".country-indicator")

    if (!indicator) {
      indicator = document.createElement("div")
      indicator.className = "country-indicator mt-2 text-sm"
      this.container.appendChild(indicator)
    }

    indicator.innerHTML = `
      <div class="flex items-center text-blue-600 bg-blue-50 px-3 py-2 rounded-md">
        <span class="text-lg mr-2">${country.flag}</span>
        <span class="font-medium">Conectando a ${country.name}</span>
        <i class="fas fa-check-circle ml-auto text-green-500"></i>
      </div>
    `
  }

  getSelectedCountry() {
    return this.selectedCountry
  }

  setSelectedCountry(countryCode) {
    if (COUNTRIES[countryCode]) {
      this.selectedCountry = countryCode
      const select = this.container.querySelector("#countrySelect")
      if (select) {
        select.value = countryCode
        this.updateVisualFeedback(countryCode)
      }
    }
  }

  // Get country info
  getSelectedCountryInfo() {
    return COUNTRIES[this.selectedCountry]
  }

  // Validate selection
  isValid() {
    return this.selectedCountry && COUNTRIES[this.selectedCountry]
  }

  // Show error state
  showError(message) {
    const select = this.container.querySelector("#countrySelect")
    if (select) {
      select.classList.add("border-red-500", "ring-2", "ring-red-200")
    }

    // Show error message
    let errorMsg = this.container.querySelector(".error-message")
    if (!errorMsg) {
      errorMsg = document.createElement("p")
      errorMsg.className = "error-message text-xs text-red-600 mt-1"
      this.container.appendChild(errorMsg)
    }
    errorMsg.innerHTML = `<i class="fas fa-exclamation-circle mr-1"></i>${message}`
  }

  // Clear error state
  clearError() {
    const select = this.container.querySelector("#countrySelect")
    if (select) {
      select.classList.remove("border-red-500", "ring-2", "ring-red-200")
    }

    const errorMsg = this.container.querySelector(".error-message")
    if (errorMsg) {
      errorMsg.remove()
    }
  }
}
