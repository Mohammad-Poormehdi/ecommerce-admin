import { NextResponse } from "next/server"
import { ColorValidator } from "@/validators/forms"
import { z } from "zod"

import prismadb from "@/lib/prismadb"
import { getAuthSession } from "@/lib/session"

export async function GET(
  request: Request,
  { params }: { params: { colorId: string } }
) {
  try {
    if (!params.colorId) {
      return new Response("Billbord Id is missing", { status: 400 })
    }
    const color = await prismadb.color.findUnique({
      where: {
        id: params.colorId,
      },
    })
    return NextResponse.json(color, { status: 200 })
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.log("[COLOR_GET]", error)
    }
    return new Response("Internal server error", { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { storeId: string; colorId: string } }
) {
  try {
    const session = await getAuthSession()
    if (!session?.user) {
      return new Response("Unauthenticated", { status: 401 })
    }
    if (!params.storeId || !params.colorId) {
      return new Response("Invalid params", { status: 400 })
    }
    const storeByUserId = await prismadb.store.findMany({
      where: {
        id: params.storeId,
      },
    })
    if (!storeByUserId) {
      return new Response("Unauthorized", { status: 403 })
    }
    const body = await request.json()
    const { name, value } = ColorValidator.parse(body)
    const updatedcolor = await prismadb.color.update({
      where: {
        id: params.colorId,
        storeId: params.storeId,
      },
      data: {
        name,
        value,
      },
    })
    return NextResponse.json(updatedcolor, { status: 200 })
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.log("[COLOR_PATCH]", error)
    }
    if (error instanceof z.ZodError) {
      return new Response("Invalid data request", { status: 422 })
    }
    return new Response("Internal server error", { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { storeId: string; colorId: string } }
) {
  try {
    const session = await getAuthSession()
    if (!session?.user) {
      return new Response("Unauthenticated", { status: 401 })
    }
    if (!params.storeId || !params.colorId) {
      return new Response("Invalid Pramas", { status: 400 })
    }
    const storeByUserId = await prismadb.store.findUnique({
      where: {
        userId: session?.user.id,
        id: params.storeId,
      },
    })
    if (!storeByUserId) {
      return new Response("Unauthorized", { status: 403 })
    }
    const deletedColor = await prismadb.color.delete({
      where: {
        id: params.colorId,
      },
    })
    return NextResponse.json(deletedColor, { status: 200 })
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.log("[COLOR_DELETE]", error)
    }
    return new Response("Internal server error", { status: 500 })
  }
}
