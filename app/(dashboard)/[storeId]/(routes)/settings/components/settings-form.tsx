"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { formSchema, formType } from "@/validators/forms"
import { zodResolver } from "@hookform/resolvers/zod"
import { Store } from "@prisma/client"
import { useMutation } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"
import { Trash } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"

import { useOrigin } from "@/hooks/use-origin"
import ApiAlert from "@/components/ui/api-alert"
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
import { Separator } from "@/components/ui/seperator"
import AlertModal from "@/components/modals/alert-modal"

interface SettingsFormProps {
  store: Store
}

const SettingsForm: React.FC<SettingsFormProps> = ({ store }) => {
  const origin = useOrigin()
  const router = useRouter()
  const form = useForm<formType>({
    resolver: zodResolver(formSchema),
    defaultValues: store,
  })
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const { mutate: updateStoreName, isLoading: isUpdatingName } = useMutation({
    mutationFn: async ({ name }: formType) => {
      const payload = { name }
      const { data } = await axios.patch(`/api/stores/${store.id}`, payload)
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
      toast.success("Store name changed succesfully")
      router.refresh()
    },
  })

  const { mutate: deleteStore, isLoading: isDeletingStore } = useMutation({
    mutationFn: async () => {
      await axios.delete(`/api/stores/${store.id}`)
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
      toast.success("Store deleted succesfully")
      router.push("/")
    },
  })

  const onSubmit = async (values: formType) => {
    updateStoreName(values)
  }

  return (
    <>
      <AlertModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={deleteStore}
        loading={isDeletingStore}
      />
      <div className="flex items-center justify-between">
        <Heading title="Settings" description="Manage store preferences" />
        <Button
          variant="destructive"
          size="sm"
          onClick={() => {
            setIsOpen(true)
          }}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
      <Separator />
      <Form {...form}>
        <form
          className="space-y-8 w-full"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isUpdatingName}
                      placeholder="store name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={isUpdatingName} className="ml-auto" type="submit">
            Save changes
          </Button>
        </form>
      </Form>
      <Separator />
      <ApiAlert
        title="NEXT_PUBLIC_API_URL"
        description={`${origin}/api/${store.id}`}
        variant="public"
      />
    </>
  )
}

export default SettingsForm
