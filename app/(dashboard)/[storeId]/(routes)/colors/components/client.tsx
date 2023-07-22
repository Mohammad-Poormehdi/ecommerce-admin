"use client"

import { useParams, useRouter } from "next/navigation"
import { Billboard } from "@prisma/client"
import { Plus } from "lucide-react"

import ApiList from "@/components/ui/api-list"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import Heading from "@/components/ui/heading"
import { Separator } from "@/components/ui/seperator"

import { ColorColumn, columns } from "./columns"

interface ColorsClientProps {
  colors: ColorColumn[]
}

const ColorsClient: React.FC<ColorsClientProps> = ({ colors }) => {
  const router = useRouter()
  const params = useParams()
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Colors (${colors.length}) `}
          description="Manage colors for your store"
        />
        <Button onClick={() => router.push(`/${params.storeId}/colors/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={colors} />
      <Heading title="API" description="API calls for colors" />
      <Separator />
      <ApiList entityName="colors" entityIdName="<colorId>" />
    </>
  )
}

export default ColorsClient
