import { format } from "date-fns"
import { Plus } from "lucide-react"

import prismadb from "@/lib/prismadb"
import { Button } from "@/components/ui/button"
import Heading from "@/components/ui/heading"

import CategoryClient from "./components/client"
import { CategoryColumn } from "./components/columns"

interface CategoriesPage {
  params: { storeId: string }
}

const BillboardsPage: React.FC<CategoriesPage> = async ({ params }) => {
  const categories = await prismadb.category.findMany({
    where: {
      storeId: params.storeId,
    },
    include: { billboard: true },
  })
  const formatedCategories: CategoryColumn[] = categories.map((item) => ({
    id: item.id,
    name: item.name,
    billboardLabel: item.billboard?.label,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }))
  return (
    <>
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <CategoryClient categories={formatedCategories} />
        </div>
      </div>
    </>
  )
}

export default BillboardsPage
