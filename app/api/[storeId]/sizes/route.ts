import { NextResponse } from "next/server"
import { BillboardValidator, SizeValidator } from "@/validators/forms"
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
    const { name, value } = SizeValidator.parse(body)
    const size = await prismadb.size.create({
      data: {
        name,
        value,
        storeId: params.storeId,
      },
    })
    return NextResponse.json(size, { status: 200 })
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.log("[SIZES_POST]", error)
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
    const sizes = await prismadb.size.findMany({
      where: { storeId: params.storeId },
    })
    if (!sizes) {
      return []
    } else {
      return NextResponse.json(sizes, { status: 200 })
    }
  } catch (error) {
    console.log("[SIZES_GET]", error)
  }
}
