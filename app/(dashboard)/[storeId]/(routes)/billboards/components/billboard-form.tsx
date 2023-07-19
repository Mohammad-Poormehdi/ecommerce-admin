"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { BillboardValidator, CreateBillboardRequest } from "@/validators/forms"
import { zodResolver } from "@hookform/resolvers/zod"
import { Billboard, Store } from "@prisma/client"
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

interface BillboardFormProps {
  billboard: Billboard | null
  params: {
    storeId: string
    billboardId: string
  }
}

const BillboardForm: React.FC<BillboardFormProps> = ({ billboard, params }) => {
  const router = useRouter()
  const title = billboard ? "Edit billboard" : "Create billboard"
  const description = billboard ? "Edit a billboard" : "Add a new billboard"
  const toastMessage = billboard ? "Billboard updated." : "Billboard created."
  const action = billboard ? "Save changes" : "Create"

  const form = useForm<CreateBillboardRequest>({
    resolver: zodResolver(BillboardValidator),
    defaultValues: billboard || { label: "", imageUrl: "" },
  })
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const { mutate: uploadImage, isLoading: isUpdatingName } = useMutation({
    mutationFn: async (payload: CreateBillboardRequest) => {
      console.log(payload)
      if (billboard) {
        await axios.patch(
          `/api/${params.storeId}/billboards/${params.billboardId}`,
          payload
        )
      } else {
        console.log(payload)
        await axios.post(`/api/${params.storeId}/billboards`, payload)
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
      router.push(`/${params.storeId}/billboards`)
    },
  })

  const { mutate: deleteBillboard, isLoading: isDeletingStore } = useMutation({
    mutationFn: async () => {
      await axios.delete(
        `/api/${params.storeId}/billboards/${params.billboardId}`
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
      toast.success("Billboard deleted succesfully")
      router.push("/")
    },
  })

  const onSubmit = async (values: CreateBillboardRequest) => {
    console.log(values)
    uploadImage(values)
  }

  return (
    <>
      <AlertModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={deleteBillboard}
        loading={isDeletingStore}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {billboard && (
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
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background image</FormLabel>
                <FormControl>
                  <ImageUpload
                    disabled={false}
                    value={field.value ? [field.value] : []}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isUpdatingName}
                      placeholder="Billboard label"
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

export default BillboardForm
