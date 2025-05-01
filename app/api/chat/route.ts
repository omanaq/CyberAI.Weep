import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "يجب تسجيل الدخول للوصول إلى هذه الخدمة" }, { status: 401 })
    }

    // Parse request body
    const { messages, model, temperature, maxTokens } = await req.json()

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "يجب توفير رسائل صالحة" }, { status: 400 })
    }

    // Get API key from headers or session
    const apiKey = req.headers.get("x-api-key") || session.user.apiKey

    if (!apiKey) {
      return NextResponse.json({ error: "مفتاح API غير متوفر" }, { status: 400 })
    }

    // Format messages for the AI model
    const formattedMessages = messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
    }))

    // Generate response using AI SDK
    const { text } = await generateText({
      model: openai(model || "gpt-3.5-turbo", {
        apiKey: apiKey as string,
      }),
      messages: formattedMessages,
      temperature: temperature || 0.7,
      maxTokens: maxTokens || 1000,
    })

    // Return the response
    return NextResponse.json({
      response: text,
      model: model || "gpt-3.5-turbo",
    })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: "حدث خطأ أثناء معالجة الطلب" }, { status: 500 })
  }
}
