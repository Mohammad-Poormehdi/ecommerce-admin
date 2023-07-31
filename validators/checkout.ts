import { Product } from "@prisma/client"
import { string, z } from "zod"

import { ProductValidator } from "./forms"

const ProductTypeValidator = z.ZodType<Product>

export const CheckoutValidator = z.object({
  productIds: z.string().array(),
})
