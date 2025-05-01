export interface Message {
  id: string
  role: "user" | "assistant" | "thinking" | "search"
  content: string
  timestamp: string
  model?: string
}

export interface ModelSettings {
  model: string
  temperature: number
  maxTokens: number
  webSearch: boolean
  deepThinking: boolean
  saveChats: boolean
}

export interface SearchResult {
  title: string
  content: string
  source: string
}

declare module "next-auth" {
  interface User {
    apiKey?: string
    provider?: string
  }

  interface Session {
    user: User
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    apiKey?: string
    provider?: string
  }
}
