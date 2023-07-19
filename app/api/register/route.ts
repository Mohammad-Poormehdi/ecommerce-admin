import { NextResponse } from "next/server"
import { RegisterValidator } from "@/validators/sign-up"
import bcrypt from "bcrypt"
import { z } from "zod"

import prismadb from "@/lib/prismadb"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, username, email, password } = RegisterValidator.parse(body)
    const hashedPassword = await bcrypt.hash(password, 12)
    const user = await prismadb.user.create({
      data: {
        name,
        email,
        username,
        hashedPassword,
      },
    })
    return NextResponse.json(user, { status: 200 })
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.log("[REGISTER_POST]", error)
    }
    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 422 })
    }
    return new Response("Internal server Error", { status: 500 })
  }
}
