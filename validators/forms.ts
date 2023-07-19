import * as z from "zod"

export const formSchema = z.object({
  name: z.string().min(1),
})

export const BillboardValidator = z.object({
  label: z.string().min(1),
  imageUrl: z
    .string()
    .min(1, { message: "Image is required" })
    .regex(/\.(jpg|jpeg|png|webp|avif|gif)$/, {
      message: "invalid image type",
    }),
})

export type CreateBillboardRequest = z.infer<typeof BillboardValidator>

export type formType = z.infer<typeof formSchema>
