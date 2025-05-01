"use client"

import type React from "react"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { GithubIcon, KeyIcon, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [apiKey, setApiKey] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const handleApiKeyLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate API key format
      if (!apiKey.startsWith("sk-") || apiKey.length < 10) {
        throw new Error("مفتاح API غير صالح")
      }

      // Store API key in localStorage
      localStorage.setItem("cyberai_api_key", apiKey)

      // Sign in with credentials
      const result = await signIn("credentials", {
        apiKey,
        redirect: false,
      })

      if (result?.error) {
        throw new Error(result.error)
      }

      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحبًا بك في CyberAI Chat",
      })

      router.push("/")
      router.refresh()
    } catch (error) {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: error instanceof Error ? error.message : "حدث خطأ غير متوقع",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGithubLogin = async () => {
    setIsLoading(true)
    try {
      await signIn("github", { callbackUrl: "/" })
    } catch (error) {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: "فشل تسجيل الدخول باستخدام GitHub",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-secondary/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Image src="/logo.png" alt="CyberAI Logo" width={60} height={60} className="h-12 w-12" />
          </div>
          <CardTitle className="text-2xl">مرحبًا بك في CyberAI Chat</CardTitle>
          <CardDescription>سجل الدخول للوصول إلى واجهة الدردشة المتقدمة</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleApiKeyLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">مفتاح API</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="أدخل مفتاح API الخاص بك"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  جاري تسجيل الدخول...
                </>
              ) : (
                <>
                  <KeyIcon className="ml-2 h-4 w-4" />
                  تسجيل الدخول بمفتاح API
                </>
              )}
            </Button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">أو</span>
            </div>
          </div>

          <Button variant="outline" className="w-full" onClick={handleGithubLogin} disabled={isLoading}>
            <GithubIcon className="ml-2 h-4 w-4" />
            تسجيل الدخول باستخدام GitHub
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col text-center text-sm text-muted-foreground">
          <p>بتسجيل الدخول، أنت توافق على شروط الاستخدام وسياسة الخصوصية.</p>
        </CardFooter>
      </Card>
    </div>
  )
}
