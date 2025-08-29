// paymentCard.js

// Function to create a payment card element
export function createPaymentCard(payment) {
    const card = document.createElement("div")
    card.className = "bg-white shadow rounded-lg p-4 mb-4"
  
    const courseName = document.createElement("h3")
    courseName.className = "text-lg font-semibold text-gray-800 mb-2"
    courseName.textContent = payment.curso
  
    const paymentStatus = document.createElement("p")
    paymentStatus.className = "text-sm text-gray-600"
    paymentStatus.textContent = `Estado: ${payment.estado}`
  
    const paymentMethod = document.createElement("p")
    paymentMethod.className = "text-sm text-gray-600"
    paymentMethod.textContent = `Método: ${payment.metodo || "No especificado"}`
  
    card.appendChild(courseName)
    card.appendChild(paymentStatus)
    card.appendChild(paymentMethod)
  
    return card
  }
  