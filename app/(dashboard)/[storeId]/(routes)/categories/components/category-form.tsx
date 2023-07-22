"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CategoryValidator, CreateCategoryRequest } from "@/validators/forms"
import { zodResolver } from "@hookform/resolvers/zod"
import { Billboard, Category } from "@prisma/client"
import { useMutation } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"
import { Trash } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import Heading from "@/components/ui/heading"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/seperator"
import AlertModal from "@/components/modals/alert-modal"

interface CategoryFormProps {
  billboards: Billboard[]
  category: Category | null
  params: {
    storeId: string
    categoryId: string
  }
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  category,
  params,
  billboards,
}) => {
  const router = useRouter()
  const title = category ? "Edit category" : "Create category"
  const description = category ? "Edit a category" : "Add a new category"
  const toastMessage = category ? "Category updated." : "Category created."
  const action = category ? "Save changes" : "Create"

  const form = useForm<CreateCategoryRequest>({
    resolver: zodResolver(CategoryValidator),
    defaultValues: category || { name: "", billboardId: "" },
  })
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const { mutate: createOrUpdateCategory, isLoading: isUpdatingName } =
    useMutation({
      mutationFn: async (payload: CreateCategoryRequest) => {
        console.log(payload)
        if (category) {
          await axios.patch(
            `/api/${params.storeId}/categories/${params.categoryId}`,
            payload
          )
        } else {
          console.log(payload)
          await axios.post(`/api/${params.storeId}/categories`, payload)
        }
      },
      onError: (error) => {
        if (process.env.NODE_ENV === "development") {
          console.log(error)
        }
        if (error instanceof AxiosError) {
          if (error.status === 401) {
            toast.error("you are not logged in")
            router.push("/sign-in")
          }
        }
        toast.error("Something went wrong please try again later")
      },
      onSuccess: () => {
        toast.success(toastMessage)
        router.refresh()
        router.push(`/${params.storeId}/categories`)
      },
    })

  const { mutate: deleteCategory, isLoading: isDeletingStore } = useMutation({
    mutationFn: async () => {
      await axios.delete(
        `/api/${params.storeId}/categories/${params.categoryId}`
      )
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
      router.refresh()
    },
  })

  const onSubmit = async (values: CreateCategoryRequest) => {
    createOrUpdateCategory(values)
  }

  return (
    <>
      <AlertModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={deleteCategory}
        loading={isDeletingStore}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {category && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              setIsOpen(true)
            }}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          className="space-y-8 w-full"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isUpdatingName}
                      placeholder="Category name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="billboardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard</FormLabel>

                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a Billboard"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {billboards.map((billboard) => (
                        <SelectItem key={billboard.id} value={billboard.id}>
                          {billboard.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={isUpdatingName} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
      <Separator />
    </>
  )
}

export default CategoryForm
