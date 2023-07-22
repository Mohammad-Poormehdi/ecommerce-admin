"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CreateSizeRequest, SizeValidator } from "@/validators/forms"
import { zodResolver } from "@hookform/resolvers/zod"
import { Size } from "@prisma/client"
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
import ImageUpload from "@/components/ui/image-upload"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/seperator"
import AlertModal from "@/components/modals/alert-modal"

interface SizeFormProps {
  size: Size | null
  params: {
    storeId: string
    sizeId: string
  }
}

const SizeForm: React.FC<SizeFormProps> = ({ size, params }) => {
  const router = useRouter()
  const title = size ? "Edit size" : "Create size"
  const description = size ? "Edit a size" : "Add a new size"
  const toastMessage = size ? "size updated." : "size created."
  const action = size ? "Save changes" : "Create"

  const form = useForm<CreateSizeRequest>({
    resolver: zodResolver(SizeValidator),
    defaultValues: size || { name: "", value: "" },
  })
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const { mutate: uploadImage, isLoading: isUpdatingName } = useMutation({
    mutationFn: async (payload: CreateSizeRequest) => {
      console.log(payload)
      if (size) {
        await axios.patch(
          `/api/${params.storeId}/sizes/${params.sizeId}`,
          payload
        )
      } else {
        console.log(payload)
        await axios.post(`/api/${params.storeId}/sizes`, payload)
      }
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
      toast.success(toastMessage)
      router.refresh()
      router.push(`/${params.storeId}/sizes`)
    },
  })

  const { mutate: deletesize, isLoading: isDeletingStore } = useMutation({
    mutationFn: async () => {
      await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`)
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
      toast.success("size deleted succesfully")
      router.push(`/${params.storeId}/sizes`)
      router.refresh()
    },
  })

  const onSubmit = async (values: CreateSizeRequest) => {
    console.log(values)
    uploadImage(values)
  }

  return (
    <>
      <AlertModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={deletesize}
        loading={isDeletingStore}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {size && (
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
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isUpdatingName}
                      placeholder="Size name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isUpdatingName}
                      placeholder="Size value"
                      {...field}
                    />
                  </FormControl>
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

export default SizeForm
