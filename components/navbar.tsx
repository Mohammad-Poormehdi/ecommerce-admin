import { redirect } from "next/navigation"

import prismadb from "@/lib/prismadb"
import { getAuthSession } from "@/lib/session"

import MainNav from "./main-nav"
import StoreSwitcher from "./store-switcher"
import { ModeToggle } from "./theme-toggle"
import UserAccountNav from "./user-account-nav"

interface NavbarProps {}

const Navbar = async ({}) => {
  const session = await getAuthSession()
  if (!session?.user) {
    redirect("/sign-in")
  }
  const stores = await prismadb.store.findMany({
    where: {
      userId: session?.user.id,
    },
  })
  return (
    <>
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <StoreSwitcher items={stores} />
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <ModeToggle />
            <UserAccountNav
              user={{
                name: session?.user.name,
                email: session?.user.email,
                image: session?.user.image,
              }}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar
