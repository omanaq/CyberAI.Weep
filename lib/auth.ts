import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GitHubProvider from "next-auth/providers/github"

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "API Key",
      credentials: {
        apiKey: { label: "API Key", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.apiKey) {
          return null
        }

        // Validate API key format
        if (!credentials.apiKey.startsWith("sk-") || credentials.apiKey.length < 10) {
          throw new Error("مفتاح API غير صالح")
        }

        // In a real app, you would validate the API key against your database
        // For this demo, we'll just accept any key that starts with "sk-"
        return {
          id: "api-key-user",
          name: "مستخدم API",
          email: "user@example.com",
          apiKey: credentials.apiKey,
          provider: "credentials",
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.apiKey = user.apiKey
        token.provider = user.provider
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.apiKey = token.apiKey as string
        session.user.provider = token.provider as string
      }
      return session
    },
  },
}
