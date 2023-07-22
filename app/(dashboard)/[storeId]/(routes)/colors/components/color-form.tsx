"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ColorValidator, CreateColorRequest } from "@/validators/forms"
import { zodResolver } from "@hookform/resolvers/zod"
import { Color } from "@prisma/client"
import { useMutation } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"
import { Trash } from "lucide-react"
import { SketchPicker } from "react-color"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"

import { Button } from "@/components/ui/button"
import ColorPicker from "@/components/ui/color-picker"
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

interface ColorFormProps {
  color: Color | null
  params: {
    storeId: string
    colorId: string
  }
}

const ColorForm: React.FC<ColorFormProps> = ({ color, params }) => {
  const router = useRouter()
  const title = color ? "Edit color" : "Create color"
  const description = color ? "Edit a color" : "Add a new color"
  const toastMessage = color ? "color updated." : "color created."
  const action = color ? "Save changes" : "Create"

  const form = useForm<CreateColorRequest>({
    resolver: zodResolver(ColorValidator),
    defaultValues: color || { name: "", value: "" },
  })
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [colorInputValue, setColorInputValue] = useState<string>(
    color?.value || ""
  )
  const { mutate: updateOrCreateColor, isLoading: isUpdatingOrChangingColor } =
    useMutation({
      mutationFn: async (payload: CreateColorRequest) => {
        if (color) {
          await axios.patch(
            `/api/${params.storeId}/colors/${params.colorId}`,
            payload
          )
        } else {
          await axios.post(`/api/${params.storeId}/colors`, payload)
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
        router.push(`/${params.storeId}/colors`)
      },
    })

  const { mutate: deleteColor, isLoading: isDeletingStore } = useMutation({
    mutationFn: async () => {
      await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`)
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
      toast.success("color deleted succesfully")
      router.push(`/${params.storeId}/colors`)
      router.refresh()
    },
  })

  const onSubmit = async (values: CreateColorRequest) => {
    updateOrCreateColor(values)
  }

  return (
    <>
      <AlertModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={deleteColor}
        loading={isDeletingStore}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {color && (
          <Button
            variant="destructive"
            color="sm"
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
                      disabled={isUpdatingOrChangingColor}
                      placeholder="color name"
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
                    <div className="flex items-center gap-x-3">
                      <ColorPicker
                        value={field.value}
                        handleChangeComplete={(color) => {
                          setColorInputValue(color)
                          field.onChange(colorInputValue)
                        }}
                      />
                      <div
                        className="rounded-full p-4 border"
                        style={{ backgroundColor: colorInputValue }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            disabled={isUpdatingOrChangingColor}
            className="ml-auto"
            type="submit"
          >
            {action}
          </Button>
        </form>
      </Form>
      <Separator />
    </>
  )
}

export default ColorForm
