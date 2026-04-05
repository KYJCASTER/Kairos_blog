import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Github from "next-auth/providers/github"
import { prisma } from "./db"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Github({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    session: async ({ session, user }: { session: any, user: any }) => {
      if (session?.user) {
        session.user.id = user.id
        session.user.role = user.role
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
})
