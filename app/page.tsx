import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { ChatInterface } from "@/components/chat/chat-interface"

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return (
    <main className="flex min-h-screen flex-col">
      <ChatInterface user={session.user} />
    </main>
  )
}
