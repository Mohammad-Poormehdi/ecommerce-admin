"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Github } from "lucide-react"
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
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form"
import { Input } from "../ui/input"

interface SignInProps {}

const SignIn: React.FC<SignInProps> = ({}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const router = useRouter()
  const signInWithGithub = () => {
    setIsLoading(true)
    try {
      signIn("github", { redirect: false })
      router.push("/")
    } catch (error) {
      // TODO:add toast
    } finally {
      setIsLoading(false)
    }
  }
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  })
  const onSubmit: SubmitHandler<FieldValues> = (values) => {
    console.log(values)
    try {
      signIn("credentials", { ...values })
      router.push("/")
    } catch (error) {
      console.log(error)
      toast.error("Invalid credentilas")
    }
  }
  return (
    <>
      <Card className="p-5 md:w-[500px] md:h-auto w-full h-full">
        <CardHeader>
          <CardTitle className="text-2xl">Sign in</CardTitle>
          <CardDescription>sign in to use admin dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email" type="email" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button className="w-full" type="submit">
                Sign in
              </Button>
            </form>
          </Form>
          <Button
            variant="outline"
            disabled={isLoading}
            onClick={signInWithGithub}
            className="gap-x-3 w-full mt-2"
          >
            <Github />
            <p>Sign in with Github</p>
          </Button>
        </CardContent>

        <CardFooter>
          <div className="flex items-center justify-center gap-x-2 text-sm">
            <p>Don't have an account ?</p>
            <Link
              href={"/sign-up"}
              className="underline underline-offset-2 text-blue-600"
            >
              Sign Up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </>
  )
}

export default SignIn
