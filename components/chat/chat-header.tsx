"use client"

import { Menu, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getModelDisplayName } from "@/lib/utils"

interface ChatHeaderProps {
  toggleSidebar: () => void
  openSettings: () => void
  modelName: string
}

export function ChatHeader({ toggleSidebar, openSettings, modelName }: ChatHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b bg-card p-3 shadow-sm">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:mr-2">
          <Menu className="h-5 w-5" />
          <span className="sr-only">القائمة</span>
        </Button>
        <h1 className="text-lg font-semibold md:block">CyberAI Chat</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden items-center text-sm text-muted-foreground md:flex">
          <span>النموذج: {getModelDisplayName(modelName)}</span>
          <span className="mx-2 h-1 w-1 rounded-full bg-green-500"></span>
          <span>متصل</span>
        </div>

        <Button variant="ghost" size="icon" onClick={openSettings}>
          <Settings className="h-5 w-5" />
          <span className="sr-only">الإعدادات</span>
        </Button>
      </div>
    </header>
  )
}
