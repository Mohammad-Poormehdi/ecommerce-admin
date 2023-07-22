import { format } from "date-fns"
import { Plus } from "lucide-react"

import prismadb from "@/lib/prismadb"
import { Button } from "@/components/ui/button"
import Heading from "@/components/ui/heading"

import BillboardClient from "./components/client"
import { SizeColumn } from "./components/columns"

interface SizesPageProps {
  params: { storeId: string }
}

const SizesPage: React.FC<SizesPageProps> = async ({ params }) => {
  const sizes = await prismadb.size.findMany({
    where: { storeId: params.storeId },
    orderBy: { createdAt: "desc" },
  })
  const formatedSizes: SizeColumn[] = sizes.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }))
  return (
    <>
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <BillboardClient sizes={formatedSizes} />
        </div>
      </div>
    </>
  )
}

export default SizesPage
