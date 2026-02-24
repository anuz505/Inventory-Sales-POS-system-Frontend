import { z } from "zod";

export const productQuerySchema = z
  .object({
    name: z.string().min(1).optional(),
    sku: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    category: z.string().min(1).optional(),
    supplier: z.string().min(1).optional(),

    min_selling_price: z.coerce.number().nonnegative().optional(),
    max_selling_price: z.coerce.number().nonnegative().optional(),
    min_cost_price: z.coerce.number().nonnegative().optional(),
    max_cost_price: z.coerce.number().nonnegative().optional(),

    min_stock: z.coerce.number().int().nonnegative().optional(),
    max_stock: z.coerce.number().int().nonnegative().optional(),

    low_stock: z
      .enum(["true", "false"])
      .transform((v) => v === "true")
      .optional(),

    created_after: z.string().datetime({ offset: true }).optional(),
    created_before: z.string().datetime({ offset: true }).optional(),

    ordering: z
      .string()
      .regex(
        /^-?(name|sku|category|supplier|selling_price|cost_price|stock|created_at)$/,
      )
      .optional(),

    limit: z.coerce.number().int().positive().max(500).default(20),
    offset: z.coerce.number().int().nonnegative().default(0),
  })
  .refine(
    (data) =>
      data.min_selling_price === undefined ||
      data.max_selling_price === undefined ||
      data.min_selling_price <= data.max_selling_price,
    {
      message: "min_selling_price must be <= max_selling_price",
      path: ["min_selling_price"],
    },
  )
  .refine(
    (data) =>
      data.min_cost_price === undefined ||
      data.max_cost_price === undefined ||
      data.min_cost_price <= data.max_cost_price,
    {
      message: "min_cost_price must be <= max_cost_price",
      path: ["min_cost_price"],
    },
  )
  .refine(
    (data) =>
      data.min_stock === undefined ||
      data.max_stock === undefined ||
      data.min_stock <= data.max_stock,
    { message: "min_stock must be <= max_stock", path: ["min_stock"] },
  );

export type ProductQueryParams = z.infer<typeof productQuerySchema>;
