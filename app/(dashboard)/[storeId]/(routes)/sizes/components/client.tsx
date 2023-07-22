"use client"

import { useParams, useRouter } from "next/navigation"
import { Billboard } from "@prisma/client"
import { Plus } from "lucide-react"

import ApiList from "@/components/ui/api-list"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import Heading from "@/components/ui/heading"
import { Separator } from "@/components/ui/seperator"

import { SizeColumn, columns } from "./columns"

interface SizeClientProps {
  sizes: SizeColumn[]
}

const SizeClient: React.FC<SizeClientProps> = ({ sizes }) => {
  const router = useRouter()
  const params = useParams()
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Sizes (${sizes.length}) `}
          description="Manage sizes for your store"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/sizes/new`)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={sizes} />
      <Heading title="API" description="API calls for sizes" />
      <Separator />
      <ApiList entityName="sizes" entityIdName="<sizeId>" />
    </>
  )
}

export default SizeClient
