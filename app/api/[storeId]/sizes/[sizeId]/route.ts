import { NextResponse } from "next/server"
import { BillboardValidator, SizeValidator } from "@/validators/forms"
import { z } from "zod"

import prismadb from "@/lib/prismadb"
import { getAuthSession } from "@/lib/session"

export async function GET(
  request: Request,
  { params }: { params: { sizeId: string } }
) {
  try {
    if (!params.sizeId) {
      return new Response("Billbord Id is missing", { status: 400 })
    }
    const size = await prismadb.size.findUnique({
      where: {
        id: params.sizeId,
      },
    })
    return NextResponse.json(size, { status: 200 })
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.log("[SIZE_GET]", error)
    }
    return new Response("Internal server error", { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { storeId: string; sizeId: string } }
) {
  try {
    const session = await getAuthSession()
    if (session?.user) {
      return new Response("Unauthenticated", { status: 401 })
    }
    if (!params.storeId || !params.sizeId) {
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
    const { name, value } = SizeValidator.parse(body)
    const updatedSize = await prismadb.size.update({
      where: {
        id: params.sizeId,
        storeId: params.storeId,
      },
      data: {
        name,
        value,
      },
    })
    return NextResponse.json(updatedSize, { status: 200 })
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.log("[SIZE_PATCH]", error)
    }
    if (error instanceof z.ZodError) {
      return new Response("Invalid data request", { status: 422 })
    }
    return new Response("Internal server error", { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { storeId: string; sizeId: string } }
) {
  try {
    const session = await getAuthSession()
    if (!session?.user) {
      return new Response("Unauthenticated", { status: 401 })
    }
    if (!params.storeId || !params.sizeId) {
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
    const deleteSize = await prismadb.size.delete({
      where: {
        id: params.sizeId,
      },
    })
    return NextResponse.json(deleteSize, { status: 200 })
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.log("[SIZE_DELETE]", error)
    }
    return new Response("Internal server error", { status: 500 })
  }
}
