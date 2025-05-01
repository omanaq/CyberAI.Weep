"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Send, Brain, Search, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface ChatInputProps {
  onSendMessage: (message: string) => void
  isLoading: boolean
  webSearch: boolean
  deepThinking: boolean
  onClearChat: () => void
}

export function ChatInput({ onSendMessage, isLoading, webSearch, deepThinking, onClearChat }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !isLoading) {
      onSendMessage(message)
      setMessage("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }

  const handleDeepThinking = () => {
    if (!deepThinking) return

    if (message.trim() === "") {
      setMessage("فكر بعمق في ")
      setTimeout(() => textareaRef.current?.focus(), 0)
    } else {
      onSendMessage(message)
      setMessage("")
    }
  }

  const handleWebSearch = () => {
    if (!webSearch) return

    if (message.trim() === "") {
      setMessage("ابحث عن ")
      setTimeout(() => textareaRef.current?.focus(), 0)
    } else {
      onSendMessage(message)
      setMessage("")
    }
  }

  return (
    <div className="border-t bg-background p-4">
      <form onSubmit={handleSubmit} className="mx-auto max-w-4xl">
        <div className="relative flex items-center rounded-lg border bg-background p-2 shadow-sm focus-within:ring-1 focus-within:ring-primary">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder="اكتب رسالتك هنا..."
            className={cn("flex-1 resize-none bg-transparent px-2 py-1.5 outline-none", "max-h-32 min-h-[2.5rem]")}
            disabled={isLoading}
            rows={1}
          />
          <div className="flex shrink-0 items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button type="submit" size="icon" disabled={!message.trim() || isLoading}>
                    <Send className="h-4 w-4" />
                    <span className="sr-only">إرسال</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">إرسال</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="mt-2 flex justify-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDeepThinking}
                  disabled={isLoading || !deepThinking}
                  className={cn(!deepThinking && "opacity-50")}
                >
                  <Brain className="ml-1 h-4 w-4" />
                  <span>تفكير عميق</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                {deepThinking ? "استخدام وضع التفكير العميق" : "وضع التفكير العميق غير مفعل"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleWebSearch}
                  disabled={isLoading || !webSearch}
                  className={cn(!webSearch && "opacity-50")}
                >
                  <Search className="ml-1 h-4 w-4" />
                  <span>بحث متقدم</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                {webSearch ? "استخدام وضع البحث المتقدم" : "وضع البحث المتقدم غير مفعل"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button type="button" variant="outline" size="sm" onClick={onClearChat} disabled={isLoading}>
                  <Trash2 className="ml-1 h-4 w-4" />
                  <span>مسح المحادثة</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">مسح جميع الرسائل</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </form>
    </div>
  )
}
