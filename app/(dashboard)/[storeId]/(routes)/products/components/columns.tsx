"use client"

import Image from "next/image"
import { Image as PrismaImage } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ProductColumn = {
  id: string
  name: string
  price: string
  category: string
  size: string
  colorName: string
  colorValue: string
  images: PrismaImage[]
  isFeatured: boolean
  isArchived: boolean
  createdAt: string
}

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => (
      <div className="relative w-[100px] h-[100px] rounded-lg">
        <Image
          fill
          className="object-cover"
          alt="product image"
          src={row.original.images[0]?.url}
        />
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
  },

  {
    accessorKey: "isArchived",
    header: "Archived",
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "size",
    header: "Size",
  },
  {
    accessorKey: "color",
    header: "Color",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        {row.original.colorName}
        <div
          className="h-6 w-6 rounded-full border"
          style={{ backgroundColor: row.original.colorValue }}
        />
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction product={row.original} />,
  },
]
