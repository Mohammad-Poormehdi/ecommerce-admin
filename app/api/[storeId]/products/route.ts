import { request } from "http"
import { NextResponse } from "next/server"
import { ProductValidator } from "@/validators/forms"
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
    const {
      categoryId,
      colorId,
      images,
      name,
      price,
      sizeId,
      isArchived,
      isFeatured,
    } = ProductValidator.parse(body)
    const product = await prismadb.product.create({
      data: {
        name,
        categoryId,
        colorId,
        price,
        sizeId,
        isArchived,
        isFeatured,
        storeId: params.storeId,
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    })
    return NextResponse.json(product, { status: 200 })
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.log("[PRODUCTS_POST]", error)
    }
    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 422 })
    }
    return new Response("Internal server error", { status: 500 })
  }
}

export async function GET(
  request: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get("categoryId") || undefined
    const sizeId = searchParams.get("sizeId") || undefined
    const colorId = searchParams.get("colorId") || undefined
    const isFeatured = searchParams.get("isFeatured")

    if (!params.storeId) {
      return new Response("Invalid store Id", { status: 400 })
    }
    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        sizeId,
        colorId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        category: true,
        size: true,
        color: true,
      },
      orderBy: { createdAt: "desc" },
    })
    if (!products) {
      return []
    } else {
      return NextResponse.json(products, { status: 200 })
    }
  } catch (error) {
    console.log("[PRODUCTS_GET]", error)
  }
}
