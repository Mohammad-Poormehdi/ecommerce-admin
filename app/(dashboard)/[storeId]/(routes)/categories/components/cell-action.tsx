"use client"

import { useState } from "react"
import { Params } from "next/dist/shared/lib/router/utils/route-matcher"
import { useParams, useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react"
import { toast } from "react-hot-toast"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import AlertModal from "@/components/modals/alert-modal"

import { CategoryColumn } from "./columns"

interface CellActionProps {
  category: CategoryColumn
}

type IParams = {
  storeId: string
}

export const CellAction: React.FC<CellActionProps> = ({ category }) => {
  const params = useParams() as IParams
  const router = useRouter()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id)
    toast.success("Id Copied to clipboard")
  }
  const { mutate: deleteCategories, isLoading: isDeletingStore } = useMutation({
    mutationFn: async () => {
      await axios.delete(`/api/${params.storeId}/categories/${category.id}`)
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.status === 401) {
          toast.error("you are not logged in")
          router.push("/sign-in")
        }
      }
      toast.error("Something went wrong please try again later")
    },
    onSuccess: () => {
      setIsOpen(false)
      toast.success("Category deleted succesfully")
      router.push(`/${params.storeId}/categories`)
    },
  })
  return (
    <>
      <AlertModal
        isOpen={isOpen}
        loading={isDeletingStore}
        onClose={() => setIsOpen(false)}
        onConfirm={deleteCategories}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() =>
              router.push(`/${params.storeId}/categories/${category.id}`)
            }
          >
            <Edit className="mr-2 h-4 w-4" />
            Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onCopy(category.id)}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Id
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsOpen(true)}>
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
