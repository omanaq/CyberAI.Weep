import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(timestamp: string): string {
  try {
    const date = new Date(timestamp)
    return date.toLocaleTimeString("ar-SA", {
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch (error) {
    return ""
  }
}

export function getModelDisplayName(modelId: string): string {
  const modelMap: Record<string, string> = {
    "gpt-3.5-turbo": "GPT-3.5 Turbo",
    "gpt-4": "GPT-4",
    "gpt-4o": "GPT-4o",
    "claude-3-opus-20240229": "Claude 3 Opus",
    "claude-3-sonnet-20240229": "Claude 3 Sonnet",
    "claude-3-haiku-20240307": "Claude 3 Haiku",
  }

  return modelMap[modelId] || modelId
}
