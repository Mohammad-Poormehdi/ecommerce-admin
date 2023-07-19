"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { RegisterRequest, RegisterValidator } from "@/validators/sign-up"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"
import { signIn } from "next-auth/react"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import { toast } from "react-hot-toast"

import { Button } from "../ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"
import { Input } from "../ui/input"

interface SignUpFormProps {}

const SignUpForm: React.FC<SignUpFormProps> = ({}) => {
  const form = useForm({
    resolver: zodResolver(RegisterValidator),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      confirm: "",
    },
  })
  const router = useRouter()
  const { mutate: registerUser, isLoading } = useMutation({
    mutationFn: async ({
      name,
      email,
      username,
      confirm,
      password,
    }: RegisterRequest) => {
      const payload = { name, username, email, password, confirm }
      const { data } = await axios.post("/api/register", payload)
      signIn("credentials", { email, password, redirect: false })
    },
    onError: (error) => {
      toast.error("Something went wrong please try again later")
    },
    onSuccess: () => {
      toast.success("Your account creted succesfully")
      router.push("/")
    },
  })
  const onSubmit: SubmitHandler<RegisterRequest> = (
    values: RegisterRequest
  ) => {
    registerUser(values)
  }
  return (
    <>
      <Card className="p-5 md:w-[500px] md:h-auto w-full h-full">
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>
            sign up to use ecommerce admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full sapce-y-5"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary">Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="Name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary">Username</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        type="text"
                        placeholder="username"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary">Email</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="email"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary">Password</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="confirm password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                disabled={isLoading}
                type="submit"
                className="mt-4 w-full"
              >
                Sign Up
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <div className="flex items-center justify-center gap-x-2 text-sm">
            <p>Already have an account ?</p>
            <Link
              href="/sign-in"
              className="underline underline-offset-2 text-blue-600"
            >
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </>
  )
}

export default SignUpForm
