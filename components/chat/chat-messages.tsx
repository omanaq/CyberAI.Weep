import type { RefObject } from "react"
import type { Message } from "@/lib/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn, formatTime } from "@/lib/utils"

interface ChatMessagesProps {
  messages: Message[]
  isLoading: boolean
  messagesEndRef: RefObject<HTMLDivElement>
}

export function ChatMessages({ messages, isLoading, messagesEndRef }: ChatMessagesProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="mx-auto max-w-4xl space-y-4 pb-20">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex animate-fade-in",
              message.role === "user" ? "justify-end" : "justify-start",
              message.role === "thinking" && "opacity-70",
            )}
          >
            <div
              className={cn(
                "flex max-w-[85%] gap-3 rounded-lg p-4 md:max-w-[70%]",
                message.role === "user"
                  ? "flex-row-reverse bg-primary/10 text-primary-foreground"
                  : message.role === "thinking"
                    ? "bg-muted/50 text-muted-foreground"
                    : "bg-muted",
              )}
            >
              {message.role !== "user" && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/logo.png" alt="CyberAI" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
              )}

              <div className="flex flex-col">
                <div className="message-content">{message.content}</div>
                <div className="mt-1 text-right text-xs text-muted-foreground">
                  {formatTime(message.timestamp)}
                  {message.model && <span className="mr-2 text-xs text-muted-foreground">{message.model}</span>}
                </div>
              </div>

              {message.role === "user" && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback>أنت</AvatarFallback>
                </Avatar>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex animate-fade-in justify-start">
            <div className="flex max-w-[85%] gap-3 rounded-lg bg-muted p-4 md:max-w-[70%]">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/logo.png" alt="CyberAI" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}
