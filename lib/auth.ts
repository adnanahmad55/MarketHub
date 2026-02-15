import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import { prisma } from "./prisma";
import { NextAuthOptions } from "next-auth" // 👈 Change 1: Ye import add karo
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt"

//const prisma = new PrismaClient()

// 👇 Change 2: ': NextAuthOptions' add kiya hai yahan
export const authOptions: NextAuthOptions = {
  // 👇 Change 3: 'as any' lagaya hai kyuki Prisma ke version mismatch ki wajah se kabhi kabhi faltu error deta hai
  adapter: PrismaAdapter(prisma) as any, 
  
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user) return null

        const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)
        
        if (!isPasswordCorrect) return null

        return user
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role
        token.id = user.id // ID bhi store kar lo, kaam aati hai
      }
      return token
    },
    async session({ session, token }: any) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session
    }
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET, // Ye zaroori hai production ke liye
}