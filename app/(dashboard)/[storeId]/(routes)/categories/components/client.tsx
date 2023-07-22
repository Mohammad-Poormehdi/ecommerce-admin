"use client"

import { useParams, useRouter } from "next/navigation"
import { Billboard } from "@prisma/client"
import { Plus } from "lucide-react"

import ApiList from "@/components/ui/api-list"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import Heading from "@/components/ui/heading"
import { Separator } from "@/components/ui/seperator"

import { CategoryColumn, columns } from "./columns"

interface CategoryClientProps {
  categories: CategoryColumn[]
}

const CategoryClient: React.FC<CategoryClientProps> = ({ categories }) => {
  const router = useRouter()
  const params = useParams()

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Categories (${categories.length}) `}
          description="Manage categories for your store"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/categories/new`)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={categories} />
      <Heading title="API" description="API calls for Categories" />
      <Separator />
      <ApiList entityName="categories" entityIdName="<categoryId>" />
    </>
  )
}

export default CategoryClient
