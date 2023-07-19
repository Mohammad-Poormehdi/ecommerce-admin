import { z } from "zod"

export const RegisterValidator = z
  .object({
    name: z.string().min(3),
    username: z.string().min(5),
    email: z.string().email(),
    password: z
      .string()
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/, {
        message:
          "password must contain at least 8 characters an one number and one letter",
      }),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "passwords does not match",
    path: ["confirm"],
  })

export type RegisterRequest = z.infer<typeof RegisterValidator>
