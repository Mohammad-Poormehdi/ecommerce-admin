import { NextResponse } from "next/server"
import { formSchema } from "@/validators/forms"
import { z } from "zod"

import prismadb from "@/lib/prismadb"
import { getAuthSession } from "@/lib/session"

export async function PATCH(
  request: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const session = await getAuthSession()
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 })
    }
    const body = await request.json()
    const { name } = formSchema.parse(body)
    if (!params.storeId) {
      return new Response("Store id is missing", { status: 400 })
    }
    const store = await prismadb.store.update({
      where: {
        id: params.storeId,
        userId: session.user.id,
      },
      data: {
        name,
      },
    })
    return NextResponse.json(store, { status: 200 })
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.log("[STORE_PATCH]", error)
    }
    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 422 })
    }
    return new Response("Internal server error", { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const session = await getAuthSession()
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 })
    }
    if (!params.storeId) {
      return new Response("store Id required", { status: 400 })
    }
    const store = await prismadb.store.delete({
      where: {
        id: params.storeId,
        userId: session.user.id,
      },
    })
    return NextResponse.json(store, { status: 200 })
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.log("[STORE_DELETE]", error)
    }
  }
}
