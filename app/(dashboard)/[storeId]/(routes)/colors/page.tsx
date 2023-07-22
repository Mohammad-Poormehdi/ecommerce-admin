import { format } from "date-fns"
import { Plus } from "lucide-react"

import prismadb from "@/lib/prismadb"
import { Button } from "@/components/ui/button"
import Heading from "@/components/ui/heading"


import ColorsClient from "./components/client"
import { ColorColumn } from "./components/columns"

interface ColorsPageProps {
  params: { storeId: string }
}

const ColorsPage: React.FC<ColorsPageProps> = async ({ params }) => {
  const colors = await prismadb.color.findMany({
    where: { storeId: params.storeId },
    orderBy: { createdAt: "desc" },
  })
  const formatedColors: ColorColumn[] = colors.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }))
  return (
    <>
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <ColorsClient colors={formatedColors} />
        </div>
      </div>
    </>
  )
}

export default ColorsPage
