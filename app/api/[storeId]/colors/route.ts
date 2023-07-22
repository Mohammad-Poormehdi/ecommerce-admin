import { NextResponse } from "next/server"
import { ColorValidator } from "@/validators/forms"
import { z } from "zod"

import prismadb from "@/lib/prismadb"
import { getAuthSession } from "@/lib/session"

export async function POST(
  request: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const session = await getAuthSession()
    if (!session?.user) {
      return new Response("Unauthenticated", { status: 401 })
    }
    if (!params.storeId) {
      return new Response("Please provide a store id", { status: 400 })
    }
    const storeByUserId = await prismadb.store.findUnique({
      where: {
        id: params.storeId,
        userId: session?.user.id,
      },
    })
    if (!storeByUserId) {
      return new Response("Unauthorized", { status: 403 })
    }
    const body = await request.json()
    const { name, value } = ColorValidator.parse(body)
    const color = await prismadb.color.create({
      data: {
        name,
        value,
        storeId: params.storeId,
      },
    })
    return NextResponse.json(color, { status: 200 })
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.log("[COLORS_POST]", error)
    }
    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 422 })
    }
    return new Response("Internal server error", { status: 500 })
  }
}

export async function GET(
  _request: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new Response("Invalid store Id", { status: 400 })
    }
    const colors = await prismadb.color.findMany({
      where: { storeId: params.storeId },
    })
    return NextResponse.json(colors, { status: 200 })
  } catch (error) {
    console.log("[COLORS_GET]", error)
  }
}
