document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const sidebar = document.getElementById("sidebar")
  const sidebarToggle = document.getElementById("sidebar-toggle")
  const loginScreen = document.getElementById("login-screen")
  const chatInterface = document.getElementById("chat-interface")
  const loginBtn = document.getElementById("login-btn")
  const generateKeyBtn = document.getElementById("generate-key-btn")
  const generateKeyLogin = document.getElementById("generate-key-login")
  const apiKeyModal = document.getElementById("api-key-modal")
  const modalClose = document.getElementById("modal-close")
  const newApiKey = document.getElementById("new-api-key")
  const copyKeyBtn = document.getElementById("copy-key-btn")
  const useKeyBtn = document.getElementById("use-key-btn")
  const apiKeyDisplay = document.getElementById("api-key-display")
  const apiKeyInput = document.getElementById("api-key-input")
  const username = document.getElementById("username")
  const userNameDisplay = document.getElementById("user-name")
  const messageInput = document.getElementById("message-input")
  const sendButton = document.getElementById("send-button")
  const chatMessages = document.getElementById("chat-messages")
  const clearChat = document.getElementById("clear-chat")
  const connectionStatus = document.getElementById("connection-status")

  // Toggle Sidebar
  sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed")
  })

  // Login Functionality
  loginBtn.addEventListener("click", () => {
    const usernameValue = username.value.trim()
    const apiKey = apiKeyInput.value.trim()

    if (usernameValue && apiKey) {
      // Store in localStorage
      localStorage.setItem("cyberai_username", usernameValue)
      localStorage.setItem("cyberai_api_key", apiKey)

      // Update UI
      userNameDisplay.textContent = usernameValue
      apiKeyDisplay.textContent = maskApiKey(apiKey)

      // Show chat interface
      loginScreen.style.display = "none"
      chatInterface.style.display = "flex"
    } else {
      alert("الرجاء إدخال اسم المستخدم ومفتاح API")
    }
  })

  // Check if user is already logged in
  function checkLoggedIn() {
    const storedUsername = localStorage.getItem("cyberai_username")
    const storedApiKey = localStorage.getItem("cyberai_api_key")

    if (storedUsername && storedApiKey) {
      userNameDisplay.textContent = storedUsername
      apiKeyDisplay.textContent = maskApiKey(storedApiKey)

      loginScreen.style.display = "none"
      chatInterface.style.display = "flex"
    }
  }

  // Run on page load
  checkLoggedIn()

  // Generate API Key
  function generateApiKey() {
    // In a real app, this would be a server request
    // For demo, we'll generate a random string
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let result = "sk-"
    for (let i = 0; i < 32; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return result
  }

  // Mask API Key for display
  function maskApiKey(key) {
    if (key.length <= 10) return key
    return key.substring(0, 4) + "..." + key.substring(key.length - 4)
  }

  // Generate Key Button Click
  generateKeyBtn.addEventListener("click", () => {
    const newKey = generateApiKey()
    newApiKey.textContent = newKey
    apiKeyModal.classList.add("active")
  })

  // Generate Key from Login Screen
  generateKeyLogin.addEventListener("click", (e) => {
    e.preventDefault()
    const newKey = generateApiKey()
    newApiKey.textContent = newKey
    apiKeyModal.classList.add("active")
  })

  // Close Modal
  modalClose.addEventListener("click", () => {
    apiKeyModal.classList.remove("active")
  })

  // Copy API Key
  copyKeyBtn.addEventListener("click", () => {
    const keyText = newApiKey.textContent
    navigator.clipboard.writeText(keyText).then(() => {
      copyKeyBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `
      setTimeout(() => {
        copyKeyBtn.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        `
      }, 2000)
    })
  })

  // Use Generated Key
  useKeyBtn.addEventListener("click", () => {
    const keyText = newApiKey.textContent
    apiKeyInput.value = keyText
    apiKeyDisplay.textContent = maskApiKey(keyText)
    apiKeyModal.classList.remove("active")
  })

  // Send Message
  sendButton.addEventListener("click", sendMessage)
  messageInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendMessage()
    }
  })

  function sendMessage() {
    const message = messageInput.value.trim()
    if (!message) return

    // Add user message to chat
    addMessage(message, "user")
    messageInput.value = ""

    // Show typing indicator
    showTypingIndicator()

    // Simulate AI response after a delay
    setTimeout(() => {
      // Remove typing indicator
      removeTypingIndicator()

      // Generate AI response
      const aiResponse = generateAIResponse(message)
      addMessage(aiResponse, "bot")
    }, 1500)
  }

  function addMessage(text, sender) {
    const now = new Date()
    const time = now.getHours() + ":" + (now.getMinutes() < 10 ? "0" : "") + now.getMinutes()

    const messageDiv = document.createElement("div")
    messageDiv.className = `message ${sender}-message`

    if (sender === "user") {
      messageDiv.innerHTML = `
        <div class="message-avatar">
          <span>${userNameDisplay.textContent.charAt(0)}</span>
        </div>
        <div class="message-content">
          <p>${text}</p>
          <div class="message-time">${time}</div>
        </div>
      `
    } else {
      messageDiv.innerHTML = `
        <div class="message-avatar">
          <img src="assets/images/bot-avatar.svg" alt="Bot">
        </div>
        <div class="message-content">
          <p>${text}</p>
          <div class="message-time">${time}</div>
        </div>
      `
    }

    chatMessages.appendChild(messageDiv)
    chatMessages.scrollTop = chatMessages.scrollHeight
  }

  function showTypingIndicator() {
    const typingDiv = document.createElement("div")
    typingDiv.className = "message bot-message typing-indicator-container"
    typingDiv.id = "typing-indicator"

    typingDiv.innerHTML = `
      <div class="message-avatar">
        <img src="assets/images/bot-avatar.svg" alt="Bot">
      </div>
      <div class="message-content">
        <div class="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    `

    chatMessages.appendChild(typingDiv)
    chatMessages.scrollTop = chatMessages.scrollHeight
  }

  function removeTypingIndicator() {
    const typingIndicator = document.getElementById("typing-indicator")
    if (typingIndicator) {
      typingIndicator.remove()
    }
  }

  // Simple AI response generator
  function generateAIResponse(userMessage) {
    // In a real app, this would call an API
    const responses = [
      "شكراً على سؤالك. يمكنني مساعدتك في ذلك.",
      "هذا سؤال مثير للاهتمام. دعني أفكر في الإجابة.",
      "بناءً على المعلومات المتاحة، يمكنني القول أن...",
      "هناك عدة طرق للتعامل مع هذا الموضوع. أولاً...",
      "أفهم ما تسأل عنه. الإجابة هي...",
      "سؤال رائع! وفقاً لمعلوماتي...",
      "يمكنني تقديم بعض المعلومات حول هذا الموضوع.",
      "دعني أبحث عن هذا... وجدت بعض المعلومات المفيدة.",
    ]

    // Simple logic to make responses seem more relevant
    if (userMessage.includes("مرحبا") || userMessage.includes("أهلا")) {
      return "مرحباً! كيف يمكنني مساعدتك اليوم؟"
    } else if (userMessage.includes("شكرا") || userMessage.includes("شكراً")) {
      return "العفو! سعيد بمساعدتك. هل هناك شيء آخر تود معرفته؟"
    } else if (userMessage.includes("كيف") && userMessage.includes("حال")) {
      return "أنا بخير، شكراً على سؤالك! كيف يمكنني مساعدتك اليوم؟"
    } else if (userMessage.includes("ما هو") || userMessage.includes("ما هي")) {
      return "هذا سؤال مثير للاهتمام. بناءً على معلوماتي، " + responses[Math.floor(Math.random() * responses.length)]
    } else {
      return responses[Math.floor(Math.random() * responses.length)]
    }
  }

  // Clear Chat
  clearChat.addEventListener("click", () => {
    // Keep only the first welcome message
    const firstMessage = chatMessages.firstElementChild
    chatMessages.innerHTML = ""
    if (firstMessage) {
      chatMessages.appendChild(firstMessage)
    }
  })

  // Connection Status Toggle (for demo purposes)
  connectionStatus.addEventListener("click", () => {
    const statusIndicator = document.querySelector(".status-indicator")
    if (statusIndicator.classList.contains("connected")) {
      statusIndicator.classList.remove("connected")
      statusIndicator.classList.add("disconnected")
      connectionStatus.textContent = "غير متصل"
    } else {
      statusIndicator.classList.remove("disconnected")
      statusIndicator.classList.add("connected")
      connectionStatus.textContent = "متصل"
    }
  })

  // Logout functionality
  document.querySelector(".nav-item:last-child").addEventListener("click", (e) => {
    e.preventDefault()
    localStorage.removeItem("cyberai_username")
    localStorage.removeItem("cyberai_api_key")
    loginScreen.style.display = "flex"
    chatInterface.style.display = "none"
    username.value = ""
    apiKeyInput.value = ""
  })
})
