import { productQuerySchema } from "@/validation/product-params-validation";
import { salesQuerySchema } from "@/validation/Sales-params-avlidation";

export function parseProductQuery(rawQuery: unknown) {
  const result = productQuerySchema.safeParse(rawQuery);

  if (!result.success) {
    const errors = result.error.issues;
    return { success: false as const, errors };
  }

  return { success: true as const, data: result.data };
}
export function parseSalesQuery(rawQuery: unknown) {
  const result = salesQuerySchema.safeParse(rawQuery);

  if (!result.success) {
    const errors = result.error.issues;
    return { success: false as const, errors };
  }

  return { success: true as const, data: result.data };
}
