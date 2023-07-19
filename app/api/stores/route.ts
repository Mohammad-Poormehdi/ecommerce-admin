import { NextResponse } from "next/server"
import { formSchema } from "@/validators/forms"
import { z } from "zod"

import prismadb from "@/lib/prismadb"
import { getAuthSession } from "@/lib/session"

export async function POST(request: Request) {
  try {
    const session = await getAuthSession()
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }
    const body = await request.json()
    const { name } = formSchema.parse(body)
    const store = await prismadb.store.create({
      data: {
        userId: session.user.id,
        name,
      },
    })
    return NextResponse.json(store)
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.log("[STORES_POST]", error)
    }
    if (error instanceof z.ZodError) {
      return new NextResponse("Inavlid request data passed", { status: 422 })
    }
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
