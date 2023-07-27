import { format } from "date-fns"
import { Plus } from "lucide-react"

import prismadb from "@/lib/prismadb"
import { priceFormatter } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Heading from "@/components/ui/heading"

import BillboardClient from "./components/client"
import { OrderColumn } from "./components/columns"

interface OrdersPageProps {
  params: { storeId: string }
}

const OrdersPage: React.FC<OrdersPageProps> = async ({ params }) => {
  const orders = await prismadb.order.findMany({
    where: { storeId: params.storeId },
    orderBy: { createdAt: "desc" },
    include: {
      orderItems: {
        include: { product: true },
      },
    },
  })
  const formattedOrders: OrderColumn[] = orders.map((item) => ({
    id: item.id,
    phone: item.phone,
    address: item.address,
    products: item.orderItems
      .map((orderitem) => orderitem.product.name)
      .join(", "),
    totalPrice: priceFormatter.format(
      item.orderItems.reduce((total, item) => {
        return total + Number(item.product.price)
      }, 0)
    ),
    isPaid: item.isPaid,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }))
  return (
    <>
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <BillboardClient orders={formattedOrders} />
        </div>
      </div>
    </>
  )
}

export default OrdersPage
