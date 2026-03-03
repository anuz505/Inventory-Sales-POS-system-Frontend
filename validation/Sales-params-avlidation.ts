import { z } from "zod";

export const salesQuerySchema = z
  .object({
    invoice_number: z.string().min(1).optional(),

    // Dates
    created_after: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
    created_before: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),

    // Discount filters
    min_discount: z.coerce.number().nonnegative().optional(),
    max_discount: z.coerce.number().nonnegative().optional(),

    // Total amount filters
    min_total: z.coerce.number().nonnegative().optional(),
    max_total: z.coerce.number().nonnegative().optional(),

    // Relations (UUIDs)
    product: z.string().uuid().optional(),
    user: z.string().uuid().optional(),
    customer: z.string().min(1).optional(),

    // Enums / strings
    payment_method: z.string().min(1).optional(),
    payment_status: z.string().min(1).optional(),

    // Ordering (Django OrderingFilter style)
    ordering: z
      .string()
      .regex(/^-?(invoice_number|total_amount|discount_amount|created_at)$/)
      .optional(),

    // Pagination
    limit: z.coerce.number().int().positive().max(500).default(20),
    offset: z.coerce.number().int().nonnegative().default(0),
  })

  // ---- refinements ----
  .refine(
    (data) =>
      data.min_discount === undefined ||
      data.max_discount === undefined ||
      data.min_discount <= data.max_discount,
    {
      message: "min_discount must be <= max_discount",
      path: ["min_discount"],
    },
  )
  .refine(
    (data) =>
      data.min_total === undefined ||
      data.max_total === undefined ||
      data.min_total <= data.max_total,
    {
      message: "min_total must be <= max_total",
      path: ["min_total"],
    },
  )
  .refine(
    (data) =>
      data.created_after === undefined ||
      data.created_before === undefined ||
      new Date(data.created_after) <= new Date(data.created_before),
    {
      message: "created_after must be before created_before",
      path: ["created_after"],
    },
  );
