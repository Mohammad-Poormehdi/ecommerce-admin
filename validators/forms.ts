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

export const CategoryValidator = z.object({
  name: z.string().min(1),
  billboardId: z.string().min(1),
})

export const SizeValidator = z.object({
  name: z.string().min(1),
  value: z.string().min(1),
})

export type CreateSizeRequest = z.infer<typeof SizeValidator>

export type CreateCategoryRequest = z.infer<typeof CategoryValidator>

export type CreateBillboardRequest = z.infer<typeof BillboardValidator>

export type formType = z.infer<typeof formSchema>
