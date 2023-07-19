import { ReactNode } from "react"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth"
import prismadb from "@/lib/prismadb"
import { getAuthSession } from "@/lib/session"
import Navbar from "@/components/navbar"

export default async function DashboardLayout({
  params,
  children,
}: {
  children: ReactNode
  params: { storeId: string }
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect("/sign-in")
  }
  const store = await prismadb.store.findFirst({
    where: { id: params.storeId, userId: session?.user.id },
  })

  if (!store) {
    redirect("/")
  }
  return (
    <>
      <div className="">
        <Navbar />
        {children}
      </div>
    </>
  )
}
