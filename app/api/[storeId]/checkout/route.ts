import { NextResponse } from "next/server"
import { CheckoutValidator } from "@/validators/checkout"
import { z } from "zod"

import prismadb from "@/lib/prismadb"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}
export async function POST(
  request: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    console.log(params)
    const body = await request.json()
    const { productIds } = CheckoutValidator.parse(body)
    const existingStore = await prismadb.store.findUnique({
      where: {
        id: params.storeId,
      },
    })
    if (!existingStore) {
      return new Response("invalid store Id", {
        status: 400,
        headers: corsHeaders,
      })
    }
    const order = await prismadb.order.create({
      data: {
        storeId: params.storeId,
        isPaid: true,
        orderItems: {
          create: productIds.map((productId) => ({
            product: {
              connect: {
                id: productId,
              },
            },
          })),
        },
      },
    })
    return NextResponse.json(order, { status: 200, headers: corsHeaders })
  } catch (error) {
    console.log("CHECKOUT_POST", error)
    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed", {
        status: 422,
        headers: corsHeaders,
      })
    }
    return new Response("Internal Server error", {
      status: 500,
      headers: corsHeaders,
    })
  }
}
