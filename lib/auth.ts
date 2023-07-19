import { PrismaAdapter } from "@next-auth/prisma-adapter"
import bcrypt from "bcrypt"
import { nanoid } from "nanoid"
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GithubProvider from "next-auth/providers/github"

import prismadb from "./prismadb"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prismadb),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Invalid Credentials")
        }
        const user = await prismadb.user.findUnique({
          where: {
            email: credentials?.email,
          },
        })
        if (!user || !user.hashedPassword) {
          return null
        }
        const comparedPassword = bcrypt.compare(
          user?.hashedPassword,
          credentials?.password
        )
        if (!comparedPassword) {
          return null
        }
        return user
      },
    }),
  ],
  debug: process.env.NODE_ENV === "development",
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email
        session.user.image = token.picture
        session.user.username = token.username
      }
      return session
    },
    async jwt({ token, user }) {
      const dbUser = await prismadb.user.findFirst({
        where: {
          email: token.email,
        },
      })
      if (!dbUser) {
        token.id = user!.id
        return token
      }
      if (!dbUser?.username) {
        await prismadb.user.update({
          where: { id: dbUser?.id },
          data: {
            username: nanoid(10),
          },
        })
      }
      return {
        id: dbUser?.id,
        name: dbUser?.name,
        email: dbUser?.email,
        picture: dbUser?.image,
        username: dbUser?.username,
      }
    },
    redirect() {
      return "/"
    },
  },
}
