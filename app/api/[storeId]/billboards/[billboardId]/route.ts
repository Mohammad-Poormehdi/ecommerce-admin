import { NextResponse } from "next/server"
import { BillboardValidator } from "@/validators/forms"
import { z } from "zod"

import prismadb from "@/lib/prismadb"
import { getAuthSession } from "@/lib/session"

export async function GET(
  request: Request,
  { params }: { params: { billboardId: string } }
) {
  try {
    if (!params.billboardId) {
      return new Response("Billbord Id is missing", { status: 400 })
    }
    const billboard = await prismadb.billboard.findUnique({
      where: {
        id: params.billboardId,
      },
    })
    return NextResponse.json(billboard, { status: 200 })
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.log("[BILLBOARD_GET]", error)
    }
    return new Response("Internal server error", { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const session = await getAuthSession()
    if (session?.user) {
      return new Response("Unauthenticated", { status: 401 })
    }
    if (!params.storeId || !params.billboardId) {
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
    const { imageUrl, label } = BillboardValidator.parse(body)
    const updatedBillboard = await prismadb.billboard.update({
      where: {
        id: params.billboardId,
        storeId: params.storeId,
      },
      data: {
        label,
        imageUrl,
      },
    })
    return NextResponse.json(updatedBillboard, { status: 200 })
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.log("[BILLBOARD_PATCH]", error)
    }
    if (error instanceof z.ZodError) {
      return new Response("Invalid data request", { status: 422 })
    }
    return new Response("Internal server error", { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const session = await getAuthSession()
    if (session?.user) {
      return new Response("Unauthenticated", { status: 401 })
    }
    if (!params.storeId || !params.billboardId) {
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
    const deletedBillboard = await prismadb.billboard.delete({
      where: {
        id: params.billboardId,
      },
    })
    return NextResponse.json(deletedBillboard, { status: 200 })
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.log("[BILLBOARD_DELETE]", error)
    }
    return new Response("Internal server error", { status: 500 })
  }
}
