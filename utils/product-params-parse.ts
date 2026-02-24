import { productQuerySchema } from "@/validation/product-params-validation";

export function parseProductQuery(rawQuery: unknown) {
  const result = productQuerySchema.safeParse(rawQuery);

  if (!result.success) {
    const errors = result.error.issues;
    return { success: false as const, errors };
  }

  return { success: true as const, data: result.data };
}
