"use client"

import { useRouter } from "next/navigation"
import { formSchema, formType } from "@/validators/forms"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"

import { useStoreModal } from "@/hooks/use-store-modal"
import { Modal } from "@/components/ui/Modal"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

export const StoreModal = () => {
  const storeModal = useStoreModal()
  const router = useRouter()
  const form = useForm<formType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  })
  const { mutate: createStore, isLoading } = useMutation({
    mutationFn: async ({ name }: formType) => {
      const payload: formType = { name }
      const { data } = await axios.post("/api/stores", payload)
      window.location.assign(`/${data.id}`)
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.status === 401) {
          toast.error("you are not logged in")
          return router.push("/sign-in")
        }
        return toast.error("Internal server error")
      }
    },
    onSuccess: () => {
      toast.success("Store created")
    },
  })
  const onSubmit = async (values: formType) => {
    createStore(values)
  }

  return (
    <Modal
      title="Create store"
      description="Add a new store to manage products and categories"
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="E-Commerce"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button
                  disabled={isLoading}
                  onClick={storeModal.onClose}
                  variant={"outline"}
                >
                  Cancel
                </Button>
                <Button disabled={isLoading} type="submit">
                  Continue
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  )
}
