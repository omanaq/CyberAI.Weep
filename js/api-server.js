// api-server.js - إدارة خادم API المحلي

class CyberAIServer {
  constructor() {
    this.isRunning = false
    this.port = 8000
    this.host = "127.0.0.1"
    this.model = "tinyllama"
    this.modelPath = "./models/tinyllama.gguf"
    this.apiKeys = []
    this.db = null
    this.adminKey = "sk_cyberai_abdulaziz_unlimited_" + this.generateRandomString(16)
  }

  // تهيئة الخادم
  async init(database) {
    this.db = database

    // استرجاع الإعدادات
    const settings = await this.db.getSettings()
    if (settings && settings.apiServer) {
      this.port = settings.apiServer.port || 8000
      this.host = settings.apiServer.host || "127.0.0.1"
    }

    // استرجاع مفاتيح API
    const keys = await this.db.getApiKeys()
    if (keys && keys.length > 0) {
      this.apiKeys = keys
    } else {
      // إضافة مفتاح المسؤول الافتراضي
      this.apiKeys.push({
        id: "admin",
        name: "عبدالعزيز",
        key: this.adminKey,
        model: "all",
        created: new Date().toISOString(),
        expires: null,
        permissions: "admin",
        status: "active",
        type: "unlimited",
        usageLimit: Number.POSITIVE_INFINITY,
        usageCount: 0,
      })
    }

    // استرجاع النموذج الافتراضي
    const defaultModel = settings ? settings.defaultModel : "tinyllama"
    const model = await this.db.getModel(defaultModel)
    if (model) {
      this.model = model.id
      this.modelPath = model.path
    }

    console.log("تم تهيئة خادم API")

    // بدء تشغيل الخادم تلقائيًا إذا كان مطلوبًا
    if (settings && settings.apiServer && settings.apiServer.autoStart) {
      this.start()
    }
  }

  // بدء تشغيل الخادم
  start() {
    if (this.isRunning) {
      console.log("الخادم قيد التشغيل بالفعل")
      return false
    }

    // في التطبيق الحقيقي، هنا سيتم بدء تشغيل خادم API
    // لأغراض العرض، نقوم بمحاكاة بدء التشغيل

    console.log(`بدء تشغيل خادم API على ${this.host}:${this.port} باستخدام النموذج ${this.model}`)

    // محاكاة بدء التشغيل
    this.isRunning = true

    // إطلاق حدث بدء التشغيل
    this.dispatchEvent("start", {
      host: this.host,
      port: this.port,
      model: this.model,
    })

    return true
  }

  // إيقاف تشغيل الخادم
  stop() {
    if (!this.isRunning) {
      console.log("الخادم متوقف بالفعل")
      return false
    }

    // في التطبيق الحقيقي، هنا سيتم إيقاف تشغيل خادم API
    // لأغراض العرض، نقوم بمحاكاة إيقاف التشغيل

    console.log("إيقاف تشغيل خادم API")

    // محاكاة إيقاف التشغيل
    this.isRunning = false

    // إطلاق حدث إيقاف التشغيل
    this.dispatchEvent("stop")

    return true
  }

  // تغيير النموذج
  async changeModel(modelId) {
    const model = await this.db.getModel(modelId)
    if (!model) {
      console.error(`النموذج ${modelId} غير موجود`)
      return false
    }

    if (!model.installed) {
      console.error(`النموذج ${modelId} غير مثبت`)
      return false
    }

    // إذا كان الخادم قيد التشغيل، نقوم بإيقافه وإعادة تشغيله
    const wasRunning = this.isRunning
    if (wasRunning) {
      this.stop()
    }

    this.model = model.id
    this.modelPath = model.path

    console.log(`تم تغيير النموذج إلى ${model.name}`)

    // إعادة تشغيل الخادم إذا كان قيد التشغيل
    if (wasRunning) {
      this.start()
    }

    return true
  }

  // تغيير منفذ الخادم
  async changePort(port) {
    if (this.isRunning) {
      console.error("لا يمكن تغيير المنفذ أثناء تشغيل الخادم")
      return false
    }

    this.port = port

    // تحديث الإعدادات
    const settings = await this.db.getSettings()
    if (settings) {
      settings.apiServer = settings.apiServer || {}
      settings.apiServer.port = port
      await this.db.updateSettings(settings)
    }

    console.log(`تم تغيير منفذ الخادم إلى ${port}`)

    return true
  }

  // تغيير مضيف الخادم
  async changeHost(host) {
    if (this.isRunning) {
      console.error("لا يمكن تغيير المضيف أثناء تشغيل الخادم")
      return false
    }

    this.host = host

    // تحديث الإعدادات
    const settings = await this.db.getSettings()
    if (settings) {
      settings.apiServer = settings.apiServer || {}
      settings.apiServer.host = host
      await this.db.updateSettings(settings)
    }

    console.log(`تم تغيير مضيف الخادم إلى ${host}`)

    return true
  }

  // التحقق من صحة مفتاح API
  validateApiKey(key) {
    if (!key) return false

    // البحث عن المفتاح في قائمة المفاتيح
    const apiKey = this.apiKeys.find((k) => k.key === key && k.status === "active")

    if (!apiKey) return false

    // التحقق من تاريخ انتهاء الصلاحية
    if (apiKey.expires) {
      const expiryDate = new Date(apiKey.expires)
      if (expiryDate < new Date()) {
        return false
      }
    }

    // التحقق من حدود الاستخدام
    if (apiKey.type !== "unlimited" && apiKey.usageCount >= apiKey.usageLimit) {
      return false
    }

    // زيادة عداد الاستخدام
    apiKey.usageCount++

    return {
      valid: true,
      keyInfo: apiKey,
    }
  }

  // إنشاء مفتاح API جديد
  createApiKey(options) {
    const { name, type = "free", permissions = "read", expires = null, models = "all" } = options

    // التحقق من صلاحيات المستخدم
    const user = JSON.parse(localStorage.getItem("user"))
    if (!user || user.keyType !== "unlimited") {
      return {
        success: false,
        error: "ليس لديك صلاحية لإنشاء مفاتيح API",
      }
    }

    // إنشاء المفتاح
    const prefix = type === "unlimited" ? "sk_cyberai_abdulaziz_unlimited_" : "sk_cyberai_free_"
    const key = prefix + this.generateRandomString(16)

    // إنشاء كائن المفتاح
    const apiKey = {
      id: this.generateRandomString(8),
      name,
      key,
      model: models,
      created: new Date().toISOString(),
      expires,
      permissions,
      status: "active",
      type,
      usageLimit: type === "unlimited" ? Number.POSITIVE_INFINITY : 900,
      usageCount: 0,
    }

    // إضافة المفتاح إلى القائمة
    this.apiKeys.push(apiKey)

    // حفظ المفتاح في قاعدة البيانات
    if (this.db) {
      this.db.addApiKey(apiKey)
    }

    return {
      success: true,
      key: apiKey,
    }
  }

  // حذف مفتاح API
  deleteApiKey(keyId) {
    // التحقق من صلاحيات المستخدم
    const user = JSON.parse(localStorage.getItem("user"))
    if (!user || user.keyType !== "unlimited") {
      return {
        success: false,
        error: "ليس لديك صلاحية لحذف مفاتيح API",
      }
    }

    // البحث عن المفتاح
    const keyIndex = this.apiKeys.findIndex((k) => k.id === keyId)
    if (keyIndex === -1) {
      return {
        success: false,
        error: "المفتاح غير موجود",
      }
    }

    // حذف المفتاح
    this.apiKeys.splice(keyIndex, 1)

    // حذف المفتاح من قاعدة البيانات
    if (this.db) {
      this.db.deleteApiKey(keyId)
    }

    return {
      success: true,
    }
  }

  // إطلاق حدث
  dispatchEvent(eventName, data) {
    const event = new CustomEvent(`cyberai:server:${eventName}`, { detail: data })
    window.dispatchEvent(event)
  }

  // الحصول على عنوان URL للخادم
  getServerUrl() {
    return `http://${this.host}:${this.port}`
  }

  // الحصول على حالة الخادم
  getStatus() {
    return {
      isRunning: this.isRunning,
      host: this.host,
      port: this.port,
      model: this.model,
      modelPath: this.modelPath,
      url: this.getServerUrl(),
    }
  }

  // توليد سلسلة عشوائية
  generateRandomString(length) {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789"
    let result = ""

    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    return result
  }
}

// تصدير الفئة
window.CyberAIServer = CyberAIServer
