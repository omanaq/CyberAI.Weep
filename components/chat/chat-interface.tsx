"use client"

import { useState, useRef, useEffect } from "react"
import type { User } from "next-auth"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/chat/sidebar"
import { ChatHeader } from "@/components/chat/chat-header"
import { ChatMessages } from "@/components/chat/chat-messages"
import { ChatInput } from "@/components/chat/chat-input"
import { ChatSettings } from "@/components/chat/chat-settings"
import { useToast } from "@/components/ui/use-toast"
import type { Message, ModelSettings } from "@/lib/types"

interface ChatInterfaceProps {
  user: User
}

export function ChatInterface({ user }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "مرحبًا! أنا مساعد CyberAI الخاص بك. كيف يمكنني مساعدتك اليوم؟",
      timestamp: new Date().toISOString(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const router = useRouter()

  const [modelSettings, setModelSettings] = useState<ModelSettings>({
    model: "gpt-3.5-turbo",
    temperature: 0.7,
    maxTokens: 1000,
    webSearch: true,
    deepThinking: true,
    saveChats: true,
  })

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Load API key from localStorage
  useEffect(() => {
    const apiKey = localStorage.getItem("cyberai_api_key")
    if (!apiKey && !user.apiKey) {
      toast({
        title: "مفتاح API غير متوفر",
        description: "يرجى تسجيل الدخول باستخدام مفتاح API صالح",
        variant: "destructive",
      })
      router.push("/login")
    }
  }, [user, router, toast])

  // Load saved messages from localStorage
  useEffect(() => {
    if (modelSettings.saveChats) {
      const savedMessages = localStorage.getItem("cyberai_messages")
      if (savedMessages) {
        try {
          const parsedMessages = JSON.parse(savedMessages)
          if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
            setMessages(parsedMessages)
          }
        } catch (error) {
          console.error("Error parsing saved messages:", error)
        }
      }
    }
  }, [modelSettings.saveChats])

  // Save messages to localStorage when they change
  useEffect(() => {
    if (modelSettings.saveChats && messages.length > 0) {
      localStorage.setItem("cyberai_messages", JSON.stringify(messages))
    }
  }, [messages, modelSettings.saveChats])

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      // Add thinking message if enabled
      let thinkingMessageId: string | null = null
      if (modelSettings.deepThinking) {
        const thinkingMessage: Message = {
          id: `thinking-${Date.now()}`,
          role: "thinking",
          content: "أفكر في إجابة مناسبة... أحلل السؤال وأبحث عن المعلومات ذات الصلة.",
          timestamp: new Date().toISOString(),
        }
        thinkingMessageId = thinkingMessage.id
        setMessages((prev) => [...prev, thinkingMessage])
      }

      // Format messages for API
      const apiMessages = messages
        .filter((msg) => msg.role === "user" || msg.role === "assistant")
        .concat(userMessage)
        .map(({ role, content }) => ({ role, content }))

      // Get API key
      const apiKey = localStorage.getItem("cyberai_api_key") || user.apiKey

      // Call API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey || "",
        },
        body: JSON.stringify({
          messages: apiMessages,
          model: modelSettings.model,
          temperature: modelSettings.temperature,
          maxTokens: modelSettings.maxTokens,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "فشل في الاتصال بالخادم")
      }

      const data = await response.json()

      // Remove thinking message if it exists
      if (thinkingMessageId) {
        setMessages((prev) => prev.filter((msg) => msg.id !== thinkingMessageId))
      }

      // Add assistant message
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.response,
        timestamp: new Date().toISOString(),
        model: data.model,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      toast({
        title: "خطأ في الاتصال",
        description: error instanceof Error ? error.message : "حدث خطأ غير متوقع",
        variant: "destructive",
      })

      // Remove thinking message if it exists
      if (modelSettings.deepThinking) {
        setMessages((prev) => prev.filter((msg) => msg.role !== "thinking"))
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "تم مسح المحادثة. كيف يمكنني مساعدتك؟",
        timestamp: new Date().toISOString(),
      },
    ])

    if (modelSettings.saveChats) {
      localStorage.removeItem("cyberai_messages")
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} user={user} onClearChat={handleClearChat} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <ChatHeader
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          openSettings={() => setIsSettingsOpen(true)}
          modelName={modelSettings.model}
        />

        <ChatMessages messages={messages} isLoading={isLoading} messagesEndRef={messagesEndRef} />

        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          webSearch={modelSettings.webSearch}
          deepThinking={modelSettings.deepThinking}
          onClearChat={handleClearChat}
        />
      </div>

      <ChatSettings
        isOpen={isSettingsOpen}
        setIsOpen={setIsSettingsOpen}
        settings={modelSettings}
        setSettings={setModelSettings}
      />
    </div>
  )
}
