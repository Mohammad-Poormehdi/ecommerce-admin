import { NextResponse } from "next/server"
import { BillboardValidator } from "@/validators/forms"
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
    const { imageUrl, label } = BillboardValidator.parse(body)
    const billboard = await prismadb.billboard.create({
      data: {
        label,
        imageUrl,
        storeId: params.storeId,
      },
    })
    return NextResponse.json(billboard, { status: 200 })
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.log("[BILLBOARDS_POST]", error)
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
    const billboards = await prismadb.billboard.findMany({
      where: { storeId: params.storeId },
    })
    if (!billboards) {
      return []
    } else {
      return NextResponse.json(billboards, { status: 200 })
    }
  } catch (error) {
    console.log("[BILLBOARD_GET]", error)
  }
}
