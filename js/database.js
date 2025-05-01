// database.js - إدارة قاعدة البيانات المحلية

class CyberAIDatabase {
  constructor() {
    this.db = null
    this.dbName = "CyberAIOS"
    this.dbVersion = 1
    this.stores = {
      models: "id",
      chats: "id, timestamp",
      apiKeys: "id, name",
      settings: "id",
    }
  }

  // فتح اتصال بقاعدة البيانات
  async open() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion)

      request.onerror = (event) => {
        console.error("فشل في فتح قاعدة البيانات:", event.target.error)
        reject(event.target.error)
      }

      request.onupgradeneeded = (event) => {
        const db = event.target.result

        // إنشاء مخازن البيانات إذا لم تكن موجودة
        if (!db.objectStoreNames.contains("models")) {
          const modelsStore = db.createObjectStore("models", { keyPath: "id" })
          modelsStore.createIndex("name", "name", { unique: false })

          // إضافة بعض النماذج الافتراضية
          this.addDefaultModels(modelsStore)
        }

        if (!db.objectStoreNames.contains("chats")) {
          const chatsStore = db.createObjectStore("chats", { keyPath: "id", autoIncrement: true })
          chatsStore.createIndex("timestamp", "timestamp", { unique: false })
        }

        if (!db.objectStoreNames.contains("apiKeys")) {
          const apiKeysStore = db.createObjectStore("apiKeys", { keyPath: "id" })
          apiKeysStore.createIndex("name", "name", { unique: false })

          // إضافة مفتاح API افتراضي
          this.addDefaultApiKey(apiKeysStore)
        }

        if (!db.objectStoreNames.contains("settings")) {
          const settingsStore = db.createObjectStore("settings", { keyPath: "id" })

          // إضافة إعدادات افتراضية
          this.addDefaultSettings(settingsStore)
        }
      }

      request.onsuccess = (event) => {
        this.db = event.target.result
        console.log("تم فتح قاعدة البيانات بنجاح")
        resolve(this.db)
      }
    })
  }

  // إضافة النماذج الافتراضية
  addDefaultModels(store) {
    const models = [
      {
        id: "tinyllama",
        name: "TinyLlama (1.1B)",
        description: "نموذج خفيف مثالي للهواتف والأجهزة محدودة الموارد",
        path: "./models/tinyllama.gguf",
        size: "400MB",
        quantization: "Q4_K_M",
        installed: true,
        downloadUrl:
          "https://huggingface.co/TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF/resolve/main/tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf",
      },
      {
        id: "llama2",
        name: "Llama 2 (7B)",
        description: "نموذج متوسط الحجم مع أداء متوازن للحواسيب المكتبية",
        path: "./models/llama2.gguf",
        size: "4GB",
        quantization: "Q4_K_M",
        installed: false,
        downloadUrl: "https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGUF/resolve/main/llama-2-7b-chat.Q4_K_M.gguf",
      },
      {
        id: "mistral",
        name: "Mistral (7B)",
        description: "نموذج متطور يوفر أداءً ممتازًا مع حجم معقول",
        path: "./models/mistral.gguf",
        size: "4GB",
        quantization: "Q4_K_M",
        installed: false,
        downloadUrl:
          "https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.2-GGUF/resolve/main/mistral-7b-instruct-v0.2.Q4_K_M.gguf",
      },
      {
        id: "phi2",
        name: "Phi-2 (2.7B)",
        description: "نموذج صغير الحجم من Microsoft مع أداء مذهل مقارنة بحجمه",
        path: "./models/phi2.gguf",
        size: "1.5GB",
        quantization: "Q4_K_M",
        installed: false,
        downloadUrl: "https://huggingface.co/TheBloke/phi-2-GGUF/resolve/main/phi-2.Q4_K_M.gguf",
      },
    ]

    models.forEach((model) => {
      store.add(model)
    })
  }

  // إضافة مفتاح API افتراضي
  addDefaultApiKey(store) {
    const apiKey = {
      id: "default",
      name: "المفتاح الافتراضي",
      key: "sk_cyberai_" + this.generateRandomString(16),
      model: "all",
      created: new Date().toISOString(),
      expires: null,
      permissions: "readwrite",
      status: "active",
    }

    store.add(apiKey)
  }

  // إضافة إعدادات افتراضية
  addDefaultSettings(store) {
    const settings = {
      id: "app",
      theme: "dark",
      language: "ar",
      defaultModel: "tinyllama",
      temperature: 0.7,
      maxTokens: 512,
      webSearch: true,
      deepThinking: true,
      saveChats: true,
      apiServer: {
        host: "127.0.0.1",
        port: 8000,
        autoStart: false,
      },
    }

    store.add(settings)
  }

  // الحصول على جميع النماذج
  async getModels() {
    return this.getAll("models")
  }

  // الحصول على نموذج محدد
  async getModel(id) {
    return this.get("models", id)
  }

  // تحديث حالة تثبيت النموذج
  async updateModelInstallation(id, installed) {
    const model = await this.get("models", id)
    if (model) {
      model.installed = installed
      return this.update("models", model)
    }
    return false
  }

  // الحصول على جميع المحادثات
  async getChats() {
    return this.getAll("chats")
  }

  // الحصول على محادثة محددة
  async getChat(id) {
    return this.get("chats", id)
  }

  // حفظ محادثة جديدة
  async saveChat(chat) {
    return this.add("chats", {
      timestamp: new Date().toISOString(),
      model: chat.model,
      messages: chat.messages,
    })
  }

  // حذف محادثة
  async deleteChat(id) {
    return this.delete("chats", id)
  }

  // الحصول على جميع مفاتيح API
  async getApiKeys() {
    return this.getAll("apiKeys")
  }

  // الحصول على مفتاح API محدد
  async getApiKey(id) {
    return this.get("apiKeys", id)
  }

  // إضافة مفتاح API جديد
  async addApiKey(apiKey) {
    return this.add("apiKeys", {
      id: apiKey.id || this.generateRandomString(8),
      name: apiKey.name,
      key: "sk_cyberai_" + this.generateRandomString(16),
      model: apiKey.model,
      created: new Date().toISOString(),
      expires: apiKey.expires || null,
      permissions: apiKey.permissions,
      status: "active",
    })
  }

  // تحديث مفتاح API
  async updateApiKey(apiKey) {
    return this.update("apiKeys", apiKey)
  }

  // حذف مفتاح API
  async deleteApiKey(id) {
    return this.delete("apiKeys", id)
  }

  // الحصول على الإعدادات
  async getSettings() {
    return this.get("settings", "app")
  }

  // تحديث الإعدادات
  async updateSettings(settings) {
    settings.id = "app"
    return this.update("settings", settings)
  }

  // إضافة عنصر إلى مخزن
  async add(storeName, item) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], "readwrite")
      const store = transaction.objectStore(storeName)
      const request = store.add(item)

      request.onsuccess = () => {
        resolve(request.result)
      }

      request.onerror = (event) => {
        console.error(`فشل في إضافة عنصر إلى ${storeName}:`, event.target.error)
        reject(event.target.error)
      }
    })
  }

  // تحديث عنصر في مخزن
  async update(storeName, item) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], "readwrite")
      const store = transaction.objectStore(storeName)
      const request = store.put(item)

      request.onsuccess = () => {
        resolve(true)
      }

      request.onerror = (event) => {
        console.error(`فشل في تحديث عنصر في ${storeName}:`, event.target.error)
        reject(event.target.error)
      }
    })
  }

  // حذف عنصر من مخزن
  async delete(storeName, id) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], "readwrite")
      const store = transaction.objectStore(storeName)
      const request = store.delete(id)

      request.onsuccess = () => {
        resolve(true)
      }

      request.onerror = (event) => {
        console.error(`فشل في حذف عنصر من ${storeName}:`, event.target.error)
        reject(event.target.error)
      }
    })
  }

  // الحصول على عنصر من مخزن
  async get(storeName, id) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], "readonly")
      const store = transaction.objectStore(storeName)
      const request = store.get(id)

      request.onsuccess = () => {
        resolve(request.result)
      }

      request.onerror = (event) => {
        console.error(`فشل في الحصول على عنصر من ${storeName}:`, event.target.error)
        reject(event.target.error)
      }
    })
  }

  // الحصول على جميع العناصر من مخزن
  async getAll(storeName) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], "readonly")
      const store = transaction.objectStore(storeName)
      const request = store.getAll()

      request.onsuccess = () => {
        resolve(request.result)
      }

      request.onerror = (event) => {
        console.error(`فشل في الحصول على جميع العناصر من ${storeName}:`, event.target.error)
        reject(event.target.error)
      }
    })
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
window.CyberAIDatabase = CyberAIDatabase
