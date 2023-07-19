import { ReactNode } from "react"
import { redirect } from "next/navigation"

import prismadb from "@/lib/prismadb"
import { getAuthSession } from "@/lib/session"

export default async function SetupLayout({
  children,
}: {
  children: ReactNode
}) {
  const session = await getAuthSession()
  if (!session?.user) {
    redirect("/sign-in")
  }
  const store = await prismadb.store.findFirst({
    where: { userId: session.user.id },
  })
  if (store) {
    redirect(`/${store.id}`)
  }
  return <>{children}</>
}
