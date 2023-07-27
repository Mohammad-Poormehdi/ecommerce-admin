import { format } from "date-fns"
import { Plus } from "lucide-react"

import prismadb from "@/lib/prismadb"
import { priceFormatter } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Heading from "@/components/ui/heading"

import productClient from "./components/client"
import ProductClient from "./components/client"
import { ProductColumn } from "./components/columns"

interface ProductsPageProps {
  params: { storeId: string }
}

const ProductsPage: React.FC<ProductsPageProps> = async ({ params }) => {
  const products = await prismadb.product.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      category: true,
      color: true,
      size: true,
      images: true,
    },
    orderBy: { createdAt: "desc" },
  })
  const formatedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    price: priceFormatter.format(item.price.toNumber()),
    category: item.category.name,
    size: item.size.name,
    colorName: item.color.name,
    colorValue: item.color.value,
    images: item.images,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }))
  return (
    <>
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <ProductClient products={formatedProducts} />
        </div>
      </div>
    </>
  )
}

export default ProductsPage
