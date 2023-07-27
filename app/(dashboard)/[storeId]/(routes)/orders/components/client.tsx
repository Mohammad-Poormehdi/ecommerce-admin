"use client"

import { useParams, useRouter } from "next/navigation"
import { Billboard } from "@prisma/client"
import { Plus } from "lucide-react"

import ApiList from "@/components/ui/api-list"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import Heading from "@/components/ui/heading"
import { Separator } from "@/components/ui/seperator"

import { OrderColumn, columns } from "./columns"

interface OrderClientProps {
  orders: OrderColumn[]
}

const OrderClient: React.FC<OrderClientProps> = ({ orders }) => {
  const router = useRouter()
  const params = useParams()
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Orders (${orders.length}) `}
          description="Manage orders for your store"
        />
      </div>
      <Separator />
      <DataTable searchKey="products" columns={columns} data={orders} />

    </>
  )
}

export default OrderClient
