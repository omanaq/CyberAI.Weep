"use client"

import type { Dispatch, SetStateAction } from "react"
import type { User } from "next-auth"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { MessageSquare, Settings, LogOut, Trash2, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface SidebarProps {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  user: User
  onClearChat: () => void
}

export function Sidebar({ isOpen, setIsOpen, user, onClearChat }: SidebarProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    localStorage.removeItem("cyberai_api_key")
    localStorage.removeItem("cyberai_messages")
    await signOut({ redirect: false })
    router.push("/login")
  }

  return (
    <aside
      className={cn(
        "fixed inset-y-0 right-0 z-50 flex w-64 flex-col border-l bg-card transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
        isOpen ? "translate-x-0" : "translate-x-full",
      )}
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="CyberAI Logo" className="h-8 w-8" />
          <h2 className="text-lg font-bold">CyberAI</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="md:hidden">
          <span className="sr-only">إغلاق</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="mb-6 flex items-center gap-3 rounded-lg border bg-card p-3 shadow-sm">
          <Avatar>
            {user.image ? (
              <AvatarImage src={user.image || "/placeholder.svg"} alt={user.name || "المستخدم"} />
            ) : (
              <AvatarFallback>{user.name?.charAt(0) || "م"}</AvatarFallback>
            )}
          </Avatar>
          <div className="overflow-hidden">
            <p className="truncate font-medium">{user.name || "المستخدم"}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email || ""}</p>
          </div>
        </div>

        <nav className="space-y-1">
          <Button variant="ghost" className="w-full justify-start" onClick={() => {}}>
            <MessageSquare className="ml-2 h-5 w-5" />
            <span>المحادثة الحالية</span>
          </Button>

          <Button variant="ghost" className="w-full justify-start" onClick={onClearChat}>
            <Trash2 className="ml-2 h-5 w-5" />
            <span>محادثة جديدة</span>
          </Button>
        </nav>

        <Separator className="my-4" />

        <div className="rounded-lg border bg-card p-3 shadow-sm">
          <h3 className="mb-2 text-sm font-medium">تكامل GitHub</h3>
          <div className="flex items-center gap-2">
            <Github className="h-5 w-5" />
            <span className="text-sm">{user.provider === "github" ? "متصل" : "غير متصل"}</span>
          </div>
          {user.provider !== "github" && (
            <Button
              variant="outline"
              size="sm"
              className="mt-2 w-full"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              ربط حساب GitHub
            </Button>
          )}
        </div>
      </div>

      <div className="border-t p-4">
        <div className="flex flex-col gap-2">
          <Button variant="outline" className="w-full justify-start">
            <Settings className="ml-2 h-5 w-5" />
            <span>الإعدادات</span>
          </Button>
          <Button variant="outline" className="w-full justify-start" onClick={handleSignOut}>
            <LogOut className="ml-2 h-5 w-5" />
            <span>تسجيل الخروج</span>
          </Button>
        </div>
      </div>
    </aside>
  )
}
