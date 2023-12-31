import { format } from "date-fns"
import { Plus } from "lucide-react"

import prismadb from "@/lib/prismadb"
import { Button } from "@/components/ui/button"
import Heading from "@/components/ui/heading"

import BillboardClient from "./components/client"
import { BillboardColumn } from "./components/columns"

interface BillboardsPageProps {
  params: { storeId: string }
}

const BillboardsPage: React.FC<BillboardsPageProps> = async ({ params }) => {
  const billboards = await prismadb.billboard.findMany({
    where: { storeId: params.storeId },
    orderBy: { createdAt: "desc" },
  })
  const formatedBillboards: BillboardColumn[] = billboards.map((item) => ({
    id: item.id,
    label: item.label,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }))
  return (
    <>
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <BillboardClient billboards={formatedBillboards} />
        </div>
      </div>
    </>
  )
}

export default BillboardsPage
