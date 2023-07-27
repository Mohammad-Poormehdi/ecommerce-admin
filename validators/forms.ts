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
  billboardId: z.string().optional(),
})

export const SizeValidator = z.object({
  name: z.string().min(1),
  value: z.string().min(1),
})
export const ColorValidator = z.object({
  name: z.string().min(1),
  value: z
    .string()
    .min(4)
    .regex(/^#/, { message: "please enter a valid color hex value" }),
})

export const ProductValidator = z.object({
  name: z.string().min(1),
  images: z.object({ url: z.string() }).array(),
  price: z.coerce.number().min(1),
  categoryId: z.string().min(1),
  colorId: z.string().min(1),
  sizeId: z.string().min(1),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
})

export type CreateProductRequest = z.infer<typeof ProductValidator>

export type CreateColorRequest = z.infer<typeof ColorValidator>

export type CreateSizeRequest = z.infer<typeof SizeValidator>

export type CreateCategoryRequest = z.infer<typeof CategoryValidator>

export type CreateBillboardRequest = z.infer<typeof BillboardValidator>

export type formType = z.infer<typeof formSchema>
