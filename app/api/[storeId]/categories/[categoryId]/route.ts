import { NextResponse } from "next/server"
import { BillboardValidator, CategoryValidator } from "@/validators/forms"
import { z } from "zod"

import prismadb from "@/lib/prismadb"
import { getAuthSession } from "@/lib/session"

export async function GET(
  request: Request,
  { params }: { params: { categoryId: string; storeId: string } }
) {
  try {
    if (!params.categoryId) {
      return new Response("Category Id is missing", { status: 400 })
    }
    if (!params.storeId) {
      return new Response("Store Id is missing")
    }
    const category = await prismadb.category.findUnique({
      where: {
        id: params.categoryId,
      },
    })
    return NextResponse.json(category, { status: 200 })
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.log("[CATEGORY_GET]", error)
    }
    return new Response("Internal server error", { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const session = await getAuthSession()
    if (!session?.user) {
      return new Response("Unauthenticated", { status: 401 })
    }
    if (!params.storeId || !params.categoryId) {
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
    const { name, billboardId } = CategoryValidator.parse(body)
    const updatedCategory = await prismadb.category.update({
      where: {
        id: params.categoryId,
        storeId: params.storeId,
      },
      data: {
        name,
        billboardId,
      },
    })
    return NextResponse.json(updatedCategory, { status: 200 })
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.log("[CATEGORY_PATCH]", error)
    }
    if (error instanceof z.ZodError) {
      return new Response("Invalid data request", { status: 422 })
    }
    return new Response("Internal server error", { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const session = await getAuthSession()
    if (!session?.user) {
      return new Response("Unauthenticated", { status: 401 })
    }
    if (!params.storeId || !params.categoryId) {
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
    const deletedCategory = await prismadb.category.delete({
      where: {
        id: params.categoryId,
      },
    })
    return NextResponse.json(deletedCategory, { status: 200 })
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.log("[CATEGORY_DELETE]", error)
    }
    return new Response("Internal server error", { status: 500 })
  }
}
