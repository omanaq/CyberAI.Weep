// main.js - الملف الرئيسي للجافاسكريبت

document.addEventListener("DOMContentLoaded", () => {
  console.log("CyberAI OS loaded successfully")

  // إضافة زر نسخ لكل كتل الكود
  setupCodeBlocks()

  // تحقق من توفر متطلبات النظام
  checkSystemRequirements()

  // تهيئة أحداث النقر
  setupEventListeners()

  // التحقق من حالة تسجيل الدخول
  checkAuthStatus()
})

// إضافة زر نسخ لكل كتل الكود
function setupCodeBlocks() {
  const codeBlocks = document.querySelectorAll("pre, .code-block")

  codeBlocks.forEach((block) => {
    // إنشاء زر النسخ
    const copyButton = document.createElement("button")
    copyButton.className = "copy-btn"
    copyButton.textContent = "نسخ"

    // إضافة الزر إلى كتلة الكود
    block.style.position = "relative"
    block.appendChild(copyButton)

    // إضافة حدث النقر
    copyButton.addEventListener("click", () => {
      const code = block.querySelector("code") ? block.querySelector("code").textContent : block.textContent

      navigator.clipboard
        .writeText(code)
        .then(() => {
          copyButton.textContent = "تم النسخ!"
          setTimeout(() => {
            copyButton.textContent = "نسخ"
          }, 2000)
        })
        .catch((err) => {
          console.error("فشل في نسخ النص: ", err)
          copyButton.textContent = "فشل النسخ"
          setTimeout(() => {
            copyButton.textContent = "نسخ"
          }, 2000)
        })
    })
  })
}

// التحقق من متطلبات النظام
function checkSystemRequirements() {
  // هذه الدالة ستقوم بالتحقق من توفر المتطلبات الأساسية
  // مثل دعم WebAssembly وغيرها

  const requirements = {
    webAssembly: typeof WebAssembly === "object",
    localStorage: typeof localStorage === "object",
    serviceWorker: "serviceWorker" in navigator,
  }

  console.log("System requirements check:", requirements)

  // يمكن إضافة تنبيه للمستخدم إذا كانت هناك متطلبات غير متوفرة
  if (!requirements.webAssembly) {
    console.warn("متصفحك لا يدعم WebAssembly، قد لا تعمل بعض الميزات بشكل صحيح")
  }
}

// إعداد أحداث النقر
function setupEventListeners() {
  // أحداث النقر للأزرار والروابط

  // مثال: زر تنزيل النموذج
  const downloadButtons = document.querySelectorAll(".download-btn")
  downloadButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      // إذا كان الزر يحتوي على رابط، دعه يعمل بشكل طبيعي
      if (this.getAttribute("href")) return

      e.preventDefault()
      const modelName = this.getAttribute("data-model")
      if (modelName) {
        downloadModel(modelName)
      }
    })
  })

  // التحقق من وجود زر تسجيل الخروج
  const logoutBtn = document.getElementById("logout-btn")
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("user")
      window.location.href = "login.html"
    })
  }
}

// تنزيل النموذج
function downloadModel(modelName) {
  console.log(`بدء تنزيل النموذج: ${modelName}`)

  // التحقق من حالة تسجيل الدخول
  const user = JSON.parse(localStorage.getItem("user"))
  if (!user) {
    alert("يرجى تسجيل الدخول أولاً لتنزيل النماذج")
    window.location.href = "login.html"
    return
  }

  // التحقق من نوع المفتاح وحدود الاستخدام
  if (user.keyType === "free") {
    if (user.usageCount >= user.usageLimit) {
      alert("لقد وصلت إلى الحد الأقصى لاستخدام المفتاح المجاني. يرجى الترقية للحصول على مفتاح غير محدود.")
      return
    }

    // زيادة عداد الاستخدام
    user.usageCount++
    localStorage.setItem("user", JSON.stringify(user))
  }

  // هنا يمكن إضافة منطق لتنزيل النموذج
  // أو توجيه المستخدم إلى صفحة التنزيل

  alert(`سيتم تحويلك إلى صفحة تنزيل النموذج: ${modelName}`)
  window.location.href = `pages/download.html?model=${modelName}`
}

// التحقق من حالة تثبيت النموذج
function checkModelInstallation(modelName) {
  // هذه الدالة ستتحقق من حالة تثبيت النموذج
  // يمكن استخدام localStorage لتخزين حالة التثبيت

  const installedModels = JSON.parse(localStorage.getItem("installedModels") || "{}")
  return installedModels[modelName] || false
}

// حفظ حالة تثبيت النموذج
function saveModelInstallation(modelName, status) {
  const installedModels = JSON.parse(localStorage.getItem("installedModels") || "{}")
  installedModels[modelName] = status
  localStorage.setItem("installedModels", JSON.stringify(installedModels))
}

// التحقق من حالة تسجيل الدخول
function checkAuthStatus() {
  const user = JSON.parse(localStorage.getItem("user"))
  const authRequiredElements = document.querySelectorAll(".auth-required")

  if (!user) {
    // المستخدم غير مسجل الدخول
    authRequiredElements.forEach((element) => {
      element.style.display = "block"
    })

    // إعادة توجيه المستخدم إلى صفحة تسجيل الدخول إذا كان في صفحة تتطلب تسجيل الدخول
    const requiresAuth = document.body.classList.contains("requires-auth")
    if (requiresAuth) {
      window.location.href = "/login.html?redirect=" + encodeURIComponent(window.location.pathname)
    }
  } else {
    // المستخدم مسجل الدخول
    authRequiredElements.forEach((element) => {
      element.style.display = "none"
    })

    // تحديث معلومات المستخدم في الواجهة
    const userNameElements = document.querySelectorAll(".user-name")
    userNameElements.forEach((element) => {
      element.textContent = user.name
    })

    // تحديث نوع المفتاح
    const keyTypeElements = document.querySelectorAll(".key-type")
    keyTypeElements.forEach((element) => {
      if (user.keyType === "unlimited") {
        element.textContent = "غير محدود"
        element.classList.add("unlimited")
      } else {
        element.textContent = `مجاني (${user.usageCount}/${user.usageLimit})`
        element.classList.add("free")
      }
    })
  }
}

// توليد مفتاح API
function generateApiKey(type = "free", username = "") {
  // إضافة اسم عبدالعزيز في المفتاح
  const prefix = type === "unlimited" ? "sk_cyberai_abdulaziz_unlimited_" : "sk_cyberai_free_"
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789"
  let result = prefix

  // إضافة اسم المستخدم إذا كان موجوداً
  if (username) {
    result += username.toLowerCase().replace(/[^a-z0-9]/g, "") + "_"
  }

  // إضافة سلسلة عشوائية
  for (let i = 0; i < 16; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  return result
}

// التحقق من صلاحية مفتاح API
function validateApiKey(key) {
  // التحقق من بادئة المفتاح
  if (!key.startsWith("sk_cyberai_")) {
    return false
  }

  // التحقق من نوع المفتاح
  const isUnlimited = key.includes("abdulaziz_unlimited")

  // الحصول على معلومات المستخدم
  const user = JSON.parse(localStorage.getItem("user"))

  if (!user) {
    return false
  }

  // التحقق من تطابق المفتاح مع المستخدم
  if (user.apiKey !== key) {
    return false
  }

  // التحقق من حدود الاستخدام للمفاتيح المجانية
  if (!isUnlimited && user.usageCount >= user.usageLimit) {
    return false
  }

  return true
}
