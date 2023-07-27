import { NextResponse } from "next/server"
import { ProductValidator } from "@/validators/forms"
import { z } from "zod"

import prismadb from "@/lib/prismadb"
import { getAuthSession } from "@/lib/session"

export async function GET(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    if (!params.productId) {
      return new Response("Billbord Id is missing", { status: 400 })
    }
    const product = await prismadb.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true,
      },
    })
    return NextResponse.json(product, { status: 200 })
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.log("[PRODUCT_GET]", error)
    }
    return new Response("Internal server error", { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const session = await getAuthSession()
    if (!session?.user) {
      return new Response("Unauthenticated", { status: 401 })
    }
    if (!params.storeId || !params.productId) {
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
    const { categoryId, colorId, images, name, price, sizeId, isFeatured } =
      ProductValidator.parse(body)
    await prismadb.product.update({
      where: {
        id: params.productId,
        storeId: params.storeId,
      },
      data: {
        name,
        categoryId,
        colorId,
        price,
        sizeId,
        isFeatured,
        images: {
          deleteMany: {},
        },
      },
    })
    const updatedProduct = await prismadb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    })
    return NextResponse.json(updatedProduct, { status: 200 })
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.log("[PRODUCT_PATCH]", error)
    }
    if (error instanceof z.ZodError) {
      return new Response("Invalid data request", { status: 422 })
    }
    return new Response("Internal server error", { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const session = await getAuthSession()
    if (!session?.user) {
      return new Response("Unauthenticated", { status: 401 })
    }
    if (!params.storeId || !params.productId) {
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
    const deletedProduct = await prismadb.product.delete({
      where: {
        id: params.productId,
      },
    })
    return NextResponse.json(deletedProduct, { status: 200 })
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.log("[PRODUCT_DELETE]", error)
    }
    return new Response("Internal server error", { status: 500 })
  }
}
